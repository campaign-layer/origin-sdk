import { Abi, Address, Hex } from "viem";
import { Origin } from "..";

/**
 * Raises a dispute against an IP NFT.
 * Requires the caller to have the dispute bond amount in dispute tokens.
 *
 * @param targetIpId The token ID of the IP NFT to dispute.
 * @param evidenceHash The hash of evidence supporting the dispute.
 * @param disputeTag A tag identifying the type of dispute.
 * @returns A promise that resolves with the transaction result including the dispute ID.
 *
 * @example
 * ```typescript
 * const result = await origin.raiseDispute(
 *   1n,
 *   "0x1234...", // evidence hash
 *   "0x5678..." // dispute tag (e.g., "infringement", "fraud")
 * );
 * ```
 */
export async function raiseDispute(
  this: Origin,
  targetIpId: bigint,
  evidenceHash: Hex,
  disputeTag: Hex
): Promise<any> {
  return this.callContractMethod(
    this.environment.DISPUTE_CONTRACT_ADDRESS as Address,
    this.environment.DISPUTE_ABI as Abi,
    "raiseDispute",
    [targetIpId, evidenceHash, disputeTag],
    { waitForReceipt: true }
  );
}
