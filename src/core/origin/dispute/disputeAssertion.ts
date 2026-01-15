import { Abi, Address, Hex } from "viem";
import { Origin } from "..";

/**
 * Asserts a dispute as the IP owner with counter-evidence.
 * Must be called by the owner of the disputed IP within the cooldown period.
 *
 * @param disputeId The ID of the dispute to assert.
 * @param counterEvidenceHash The hash of evidence countering the dispute.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * await origin.disputeAssertion(1n, "0x1234..."); // counter-evidence hash
 * ```
 */
export async function disputeAssertion(
  this: Origin,
  disputeId: bigint,
  counterEvidenceHash: Hex
): Promise<any> {
  return this.callContractMethod(
    this.environment.DISPUTE_CONTRACT_ADDRESS as Address,
    this.environment.DISPUTE_ABI as Abi,
    "disputeAssertion",
    [disputeId, counterEvidenceHash],
    { waitForReceipt: true }
  );
}
