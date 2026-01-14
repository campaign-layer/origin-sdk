import { Abi, Address } from "viem";
import { Origin } from "..";
import { DisputeStatus } from "../utils";
import { getPublicClient } from "../../auth/viem/client";

/**
 * Progress and voting statistics for a dispute.
 */
export interface DisputeProgress {
  /** Dispute ID */
  disputeId: bigint;
  /** Current dispute status */
  status: DisputeStatus;
  /** Total YES votes (weighted by stake) */
  yesVotes: bigint;
  /** Total NO votes (weighted by stake) */
  noVotes: bigint;
  /** Total votes cast */
  totalVotes: bigint;
  /** YES votes as percentage (0-100) */
  yesPercentage: number;
  /** NO votes as percentage (0-100) */
  noPercentage: number;
  /** Required quorum for valid resolution */
  quorum: bigint;
  /** Current progress toward quorum (0-100+) */
  quorumPercentage: number;
  /** Whether quorum has been met */
  quorumMet: boolean;
  /** Projected outcome if resolved now */
  projectedOutcome: "dispute_succeeds" | "dispute_fails" | "no_quorum";
  /** Timeline information */
  timeline: {
    /** When the dispute was raised */
    raisedAt: Date;
    /** When the cooldown period ends (owner can no longer assert) */
    cooldownEndsAt: Date;
    /** When the voting period ends */
    votingEndsAt: Date;
    /** Whether the dispute can be resolved now */
    canResolveNow: boolean;
    /** Time remaining until resolution (in seconds, 0 if can resolve) */
    timeUntilResolution: number;
  };
}

/**
 * Gets detailed progress and voting statistics for a dispute.
 * Includes vote counts, percentages, quorum progress, and timeline.
 *
 * @param disputeId The ID of the dispute to check.
 * @returns A promise that resolves with the dispute progress details.
 *
 * @example
 * ```typescript
 * const progress = await origin.getDisputeProgress(1n);
 *
 * console.log(`Yes: ${progress.yesPercentage}% | No: ${progress.noPercentage}%`);
 * console.log(`Quorum: ${progress.quorumPercentage}% (${progress.quorumMet ? 'met' : 'not met'})`);
 * console.log(`Projected outcome: ${progress.projectedOutcome}`);
 *
 * if (progress.timeline.canResolveNow) {
 *   await origin.resolveDispute(1n);
 * } else {
 *   console.log(`Can resolve in ${progress.timeline.timeUntilResolution} seconds`);
 * }
 * ```
 */
export async function getDisputeProgress(
  this: Origin,
  disputeId: bigint
): Promise<DisputeProgress> {
  if (!this.environment.DISPUTE_CONTRACT_ADDRESS) {
    throw new Error("Dispute contract address not configured");
  }
  if (!this.environment.DISPUTE_ABI) {
    throw new Error("Dispute ABI not configured");
  }

  const publicClient = getPublicClient();
  const disputeContractAddress = this.environment
    .DISPUTE_CONTRACT_ADDRESS as Address;
  const disputeAbi = this.environment.DISPUTE_ABI as Abi;

  // Fetch dispute and config in parallel
  const [dispute, quorum, cooldownPeriod, judgementPeriod] = await Promise.all([
    publicClient.readContract({
      address: disputeContractAddress,
      abi: disputeAbi,
      functionName: "disputes",
      args: [disputeId],
    }) as Promise<any>,
    publicClient.readContract({
      address: disputeContractAddress,
      abi: disputeAbi,
      functionName: "disputeQuorum",
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
  ]);

  // Parse dispute struct
  const status = Number(dispute.status ?? dispute[9]) as DisputeStatus;
  const disputeTimestamp = BigInt(dispute.disputeTimestamp ?? dispute[5] ?? 0);
  const assertionTimestamp = BigInt(
    dispute.assertionTimestamp ?? dispute[6] ?? 0
  );
  const yesVotes = BigInt(dispute.yesVotes ?? dispute[7] ?? 0);
  const noVotes = BigInt(dispute.noVotes ?? dispute[8] ?? 0);

  // Calculate vote statistics
  const totalVotes = yesVotes + noVotes;
  let yesPercentage = 0;
  let noPercentage = 0;

  if (totalVotes > BigInt(0)) {
    yesPercentage = Number((yesVotes * BigInt(10000)) / totalVotes) / 100;
    noPercentage = Number((noVotes * BigInt(10000)) / totalVotes) / 100;
  }

  // Calculate quorum progress
  let quorumPercentage = 0;
  if (quorum > BigInt(0)) {
    quorumPercentage = Number((totalVotes * BigInt(10000)) / quorum) / 100;
  }
  const quorumMet = totalVotes >= quorum;

  // Determine projected outcome
  let projectedOutcome: "dispute_succeeds" | "dispute_fails" | "no_quorum";
  if (!quorumMet) {
    projectedOutcome = "no_quorum";
  } else if (yesVotes > noVotes) {
    projectedOutcome = "dispute_succeeds";
  } else {
    projectedOutcome = "dispute_fails";
  }

  // Calculate timeline
  const currentTimestamp = BigInt(Math.floor(Date.now() / 1000));
  const raisedAt = new Date(Number(disputeTimestamp) * 1000);
  const cooldownEndsAt = new Date(
    Number(disputeTimestamp + cooldownPeriod) * 1000
  );

  let votingEndsAt: Date;
  let resolutionTimestamp: bigint;

  if (status === DisputeStatus.Asserted) {
    // For asserted disputes, voting ends relative to assertion
    votingEndsAt = new Date(
      Number(assertionTimestamp + judgementPeriod) * 1000
    );
    resolutionTimestamp = assertionTimestamp + judgementPeriod;
  } else {
    // For raised disputes, voting ends after cooldown + judgement
    votingEndsAt = new Date(
      Number(disputeTimestamp + cooldownPeriod + judgementPeriod) * 1000
    );
    resolutionTimestamp = disputeTimestamp + cooldownPeriod + judgementPeriod;
  }

  const canResolveNow =
    (status === DisputeStatus.Raised || status === DisputeStatus.Asserted) &&
    currentTimestamp > resolutionTimestamp;

  const timeUntilResolution = canResolveNow
    ? 0
    : Number(resolutionTimestamp - currentTimestamp);

  return {
    disputeId,
    status,
    yesVotes,
    noVotes,
    totalVotes,
    yesPercentage,
    noPercentage,
    quorum,
    quorumPercentage,
    quorumMet,
    projectedOutcome,
    timeline: {
      raisedAt,
      cooldownEndsAt,
      votingEndsAt,
      canResolveNow,
      timeUntilResolution,
    },
  };
}
