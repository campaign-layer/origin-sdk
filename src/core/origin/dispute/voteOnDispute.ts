import { Abi, Address } from "viem";
import { Origin } from "..";

/**
 * Votes on a dispute as a CAMP token staker.
 * Only users who staked before the dispute was raised can vote.
 * Requires the caller to have voting power >= staking threshold.
 *
 * @param disputeId The ID of the dispute to vote on.
 * @param support True to vote in favor of the dispute, false to vote against.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * // Vote in favor of the dispute
 * await origin.voteOnDispute(1n, true);
 *
 * // Vote against the dispute
 * await origin.voteOnDispute(1n, false);
 * ```
 */
export async function voteOnDispute(
  this: Origin,
  disputeId: bigint,
  support: boolean
): Promise<any> {
  return this.callContractMethod(
    this.environment.DISPUTE_CONTRACT_ADDRESS as Address,
    this.environment.DISPUTE_ABI as Abi,
    "voteOnDispute",
    [disputeId, support],
    { waitForReceipt: true }
  );
}
