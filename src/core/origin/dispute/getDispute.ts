import { Abi, Address } from "viem";
import { Origin } from "..";
import { Dispute } from "../utils";

/**
 * Gets the details of a dispute by its ID.
 *
 * @param disputeId The ID of the dispute to fetch.
 * @returns A promise that resolves with the dispute details.
 *
 * @example
 * ```typescript
 * const dispute = await origin.getDispute(1n);
 * console.log(`Status: ${dispute.status}`);
 * console.log(`Yes votes: ${dispute.yesVotes}`);
 * console.log(`No votes: ${dispute.noVotes}`);
 * ```
 */
export async function getDispute(
  this: Origin,
  disputeId: bigint
): Promise<Dispute> {
  if (!this.environment.DISPUTE_CONTRACT_ADDRESS) {
    throw new Error("Dispute contract address not configured");
  }
  if (!this.environment.DISPUTE_ABI) {
    throw new Error("Dispute ABI not configured");
  }

  return this.callContractMethod(
    this.environment.DISPUTE_CONTRACT_ADDRESS as Address,
    this.environment.DISPUTE_ABI as Abi,
    "disputes",
    [disputeId]
  );
}
