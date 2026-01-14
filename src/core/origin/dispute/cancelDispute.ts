import { Abi, Address } from "viem";
import { Origin } from "..";

/**
 * Cancels a dispute that is still in the raised state.
 * Can only be called by the dispute initiator during the cooldown period.
 * The bond is returned to the initiator.
 *
 * @param disputeId The ID of the dispute to cancel.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * await origin.cancelDispute(1n);
 * ```
 */
export async function cancelDispute(
  this: Origin,
  disputeId: bigint
): Promise<any> {
  if (!this.environment.DISPUTE_CONTRACT_ADDRESS) {
    throw new Error("Dispute contract address not configured");
  }
  if (!this.environment.DISPUTE_ABI) {
    throw new Error("Dispute ABI not configured");
  }

  return this.callContractMethod(
    this.environment.DISPUTE_CONTRACT_ADDRESS as Address,
    this.environment.DISPUTE_ABI as Abi,
    "cancelDispute",
    [disputeId],
    { waitForReceipt: true }
  );
}
