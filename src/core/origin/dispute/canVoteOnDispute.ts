import { Abi, Address } from "viem";
import { Origin } from "..";
import { DisputeStatus, resolveWalletAddress } from "../utils";
import { getPublicClient } from "../../auth/viem/client";

/**
 * Result of checking if a user can vote on a dispute.
 */
export interface VoteEligibility {
  canVote: boolean;
  /** Reason why user cannot vote (if canVote is false) */
  reason?: string;
  /** User's voting weight (staked CAMP balance) */
  votingWeight: bigint;
  /** Minimum required stake to vote */
  stakingThreshold: bigint;
  hasAlreadyVoted: boolean;
  /** Timestamp when user staked (0 if never staked) */
  userStakeTimestamp: bigint;
  disputeTimestamp: bigint;
  disputeStatus: DisputeStatus;
  isVotingPeriodActive: boolean;
}

// minimal ABI for staking vault
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
  const voterAddress = await resolveWalletAddress(
    (this as any).viemClient,
    voter
  );

  const publicClient = getPublicClient();
  const disputeContractAddress = this.environment
    .DISPUTE_CONTRACT_ADDRESS as Address;
  const disputeAbi = this.environment.DISPUTE_ABI as Abi;

  // fetch dispute data, config, and hasVoted in parallel
  const [
    dispute,
    stakingVaultAddress,
    stakingThreshold,
    cooldownPeriod,
    judgementPeriod,
    hasAlreadyVoted,
  ] = await Promise.all([
    this.getDispute(disputeId),
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

  // parse dispute struct
  const disputeStatus = dispute.status;
  const disputeTimestamp = dispute.disputeTimestamp;
  const assertionTimestamp = dispute.assertionTimestamp;

  // fetch staking vault data
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

  // calculate voting period
  const currentTimestamp = BigInt(Math.floor(Date.now() / 1000));
  let isVotingPeriodActive = false;
  let votingPeriodEnd: bigint;

  if (disputeStatus === DisputeStatus.Asserted) {
    // for asserted disputes, voting period is relative to assertion timestamp
    votingPeriodEnd = assertionTimestamp + judgementPeriod;
    isVotingPeriodActive = currentTimestamp <= votingPeriodEnd;
  } else if (disputeStatus === DisputeStatus.Raised) {
    // for raised disputes, voting period extends from cooldown through judgement
    votingPeriodEnd = disputeTimestamp + cooldownPeriod + judgementPeriod;
    isVotingPeriodActive = currentTimestamp <= votingPeriodEnd;
  }

  // build base result
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

  // check all requirements
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

  // passed
  return {
    ...baseResult,
    canVote: true,
  };
}
