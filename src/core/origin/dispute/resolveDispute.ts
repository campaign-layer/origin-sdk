import { Abi, Address } from "viem";
import { Origin } from "..";

/**
 * Resolves a dispute after the voting period has ended.
 * Can be called by anyone - resolution is deterministic based on votes and quorum.
 * If the dispute is valid, the IP is marked as disputed and bond is returned.
 * If invalid, the bond is split between the IP owner and resolver (protocol fee to caller).
 *
 * @param disputeId The ID of the dispute to resolve.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * await origin.resolveDispute(1n);
 * ```
 */
export async function resolveDispute(
  this: Origin,
  disputeId: bigint
): Promise<any> {
  return this.callContractMethod(
    this.environment.DISPUTE_CONTRACT_ADDRESS as Address,
    this.environment.DISPUTE_ABI as Abi,
    "resolveDispute",
    [disputeId],
    { waitForReceipt: true }
  );
}
