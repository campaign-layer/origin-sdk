import { Abi, Address } from "viem";
import { Origin } from "..";
import { DisputeStatus } from "../utils";
import { getPublicClient } from "../../auth/viem/client";

/**
 * Result of checking if a user can vote on a dispute.
 */
export interface VoteEligibility {
  /** Whether the user can vote on this dispute */
  canVote: boolean;
  /** Reason why user cannot vote (if canVote is false) */
  reason?: string;
  /** User's voting weight (staked CAMP balance) */
  votingWeight: bigint;
  /** Minimum required stake to vote */
  stakingThreshold: bigint;
  /** Whether user has already voted */
  hasAlreadyVoted: boolean;
  /** Timestamp when user staked (0 if never staked) */
  userStakeTimestamp: bigint;
  /** Timestamp when dispute was raised */
  disputeTimestamp: bigint;
  /** Current dispute status */
  disputeStatus: DisputeStatus;
  /** Whether voting period is still active */
  isVotingPeriodActive: boolean;
}

// Minimal ABI for staking vault
const STAKING_VAULT_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "userStakeTimestamp",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as Abi;

/**
 * Checks if a user meets the requirements to vote on a dispute.
 * Returns detailed information about eligibility and reason if ineligible.
 *
 * @param disputeId The ID of the dispute to check.
 * @param voter Optional address to check. If not provided, uses connected wallet.
 * @returns A promise that resolves with the vote eligibility details.
 *
 * @example
 * ```typescript
 * const eligibility = await origin.canVoteOnDispute(1n);
 *
 * if (eligibility.canVote) {
 *   console.log(`You can vote with weight: ${eligibility.votingWeight}`);
 *   await origin.voteOnDispute(1n, true);
 * } else {
 *   console.log(`Cannot vote: ${eligibility.reason}`);
 * }
 * ```
 */
export async function canVoteOnDispute(
  this: Origin,
  disputeId: bigint,
  voter?: Address
): Promise<VoteEligibility> {
  if (!this.environment.DISPUTE_CONTRACT_ADDRESS) {
    throw new Error("Dispute contract address not configured");
  }
  if (!this.environment.DISPUTE_ABI) {
    throw new Error("Dispute ABI not configured");
  }

  // Resolve voter address
  let voterAddress: Address;
  if (voter) {
    voterAddress = voter;
  } else {
    const viemClient = (this as any).viemClient;
    if (!viemClient) {
      throw new Error("No voter address provided and no wallet connected");
    }
    if (viemClient.account) {
      voterAddress = viemClient.account.address;
    } else {
      const accounts = await viemClient.request({
        method: "eth_requestAccounts",
        params: [] as any,
      });
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found in connected wallet");
      }
      voterAddress = accounts[0] as Address;
    }
  }

  const publicClient = getPublicClient();
  const disputeContractAddress = this.environment
    .DISPUTE_CONTRACT_ADDRESS as Address;
  const disputeAbi = this.environment.DISPUTE_ABI as Abi;

  // Fetch dispute data, config, and hasVoted in parallel
  const [
    dispute,
    stakingVaultAddress,
    stakingThreshold,
    cooldownPeriod,
    judgementPeriod,
    hasAlreadyVoted,
  ] = await Promise.all([
    publicClient.readContract({
      address: disputeContractAddress,
      abi: disputeAbi,
      functionName: "disputes",
      args: [disputeId],
    }) as Promise<any>,
    publicClient.readContract({
      address: disputeContractAddress,
      abi: disputeAbi,
      functionName: "stakingVault",
      args: [],
    }) as Promise<Address>,
    publicClient.readContract({
      address: disputeContractAddress,
      abi: disputeAbi,
      functionName: "stakingThreshold",
      args: [],
    }) as Promise<bigint>,
    publicClient.readContract({
      address: disputeContractAddress,
      abi: disputeAbi,
      functionName: "disputeCoolDownPeriod",
      args: [],
    }) as Promise<bigint>,
    publicClient.readContract({
      address: disputeContractAddress,
      abi: disputeAbi,
      functionName: "disputeJudgementPeriod",
      args: [],
    }) as Promise<bigint>,
    publicClient.readContract({
      address: disputeContractAddress,
      abi: disputeAbi,
      functionName: "hasVoted",
      args: [disputeId, voterAddress],
    }) as Promise<boolean>,
  ]);

  // Parse dispute struct
  const disputeStatus = Number(dispute.status ?? dispute[9]) as DisputeStatus;
  const disputeTimestamp = BigInt(dispute.disputeTimestamp ?? dispute[5] ?? 0);
  const assertionTimestamp = BigInt(
    dispute.assertionTimestamp ?? dispute[6] ?? 0
  );

  // Fetch staking vault data
  const [userStakeTimestamp, votingWeight] = await Promise.all([
    publicClient.readContract({
      address: stakingVaultAddress,
      abi: STAKING_VAULT_ABI,
      functionName: "userStakeTimestamp",
      args: [voterAddress],
    }) as Promise<bigint>,
    publicClient.readContract({
      address: stakingVaultAddress,
      abi: STAKING_VAULT_ABI,
      functionName: "balanceOf",
      args: [voterAddress],
    }) as Promise<bigint>,
  ]);

  // Calculate voting period
  const currentTimestamp = BigInt(Math.floor(Date.now() / 1000));
  let isVotingPeriodActive = false;
  let votingPeriodEnd: bigint;

  if (disputeStatus === DisputeStatus.Asserted) {
    // For asserted disputes, voting period is relative to assertion timestamp
    votingPeriodEnd = assertionTimestamp + judgementPeriod;
    isVotingPeriodActive = currentTimestamp <= votingPeriodEnd;
  } else if (disputeStatus === DisputeStatus.Raised) {
    // For raised disputes, voting period extends from cooldown through judgement
    votingPeriodEnd = disputeTimestamp + cooldownPeriod + judgementPeriod;
    isVotingPeriodActive = currentTimestamp <= votingPeriodEnd;
  }

  // Build base result
  const baseResult: VoteEligibility = {
    canVote: false,
    votingWeight,
    stakingThreshold,
    hasAlreadyVoted,
    userStakeTimestamp,
    disputeTimestamp,
    disputeStatus,
    isVotingPeriodActive,
  };

  // Check all requirements in order
  if (
    disputeStatus !== DisputeStatus.Raised &&
    disputeStatus !== DisputeStatus.Asserted
  ) {
    return {
      ...baseResult,
      reason: `Dispute is not in a voteable status (current: ${DisputeStatus[disputeStatus]})`,
    };
  }

  if (!isVotingPeriodActive) {
    return {
      ...baseResult,
      reason: "Voting period has ended",
    };
  }

  if (hasAlreadyVoted) {
    return {
      ...baseResult,
      reason: "You have already voted on this dispute",
    };
  }

  if (userStakeTimestamp === BigInt(0)) {
    return {
      ...baseResult,
      reason: "You have never staked CAMP tokens",
    };
  }

  if (userStakeTimestamp >= disputeTimestamp) {
    return {
      ...baseResult,
      reason:
        "You staked after this dispute was raised (vote recycling prevention)",
    };
  }

  if (votingWeight < stakingThreshold) {
    return {
      ...baseResult,
      reason: `Insufficient stake: you have ${votingWeight} but need at least ${stakingThreshold}`,
    };
  }

  // All checks passed
  return {
    ...baseResult,
    canVote: true,
  };
}
