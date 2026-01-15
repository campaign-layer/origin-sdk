import { Abi, Address } from "viem";
import { Origin } from "..";

/**
 * Tags a child IP as disputed if its parent has been successfully disputed.
 * This propagates the dispute status to derivative IPs.
 *
 * @param childIpId The token ID of the child IP to tag.
 * @param infringerDisputeId The ID of the resolved dispute against the parent IP.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * // After parent IP (tokenId 1) has been disputed, tag child IP (tokenId 2)
 * await origin.tagChildIp(2n, 1n); // childIpId, disputeId of parent
 * ```
 */
export async function tagChildIp(
  this: Origin,
  childIpId: bigint,
  infringerDisputeId: bigint
): Promise<any> {
  return this.callContractMethod(
    this.environment.DISPUTE_CONTRACT_ADDRESS as Address,
    this.environment.DISPUTE_ABI as Abi,
    "tagChildIp",
    [childIpId, infringerDisputeId],
    { waitForReceipt: true }
  );
}
