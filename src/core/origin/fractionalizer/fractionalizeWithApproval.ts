import { Abi, Address } from "viem";
import { Origin } from "..";

/**
 * Fractionalizes an IP NFT with automatic approval.
 * This method first approves the fractionalizer contract to transfer your NFT,
 * then calls fractionalize. This is the recommended method for most use cases.
 *
 * @param tokenId The token ID of the IP NFT to fractionalize.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * // Single call handles approval and fractionalization
 * const result = await origin.fractionalizeWithApproval(1n);
 * ```
 */
export async function fractionalizeWithApproval(
  this: Origin,
  tokenId: bigint
): Promise<any> {
  await this.approve(
    this.environment.FRACTIONALIZER_CONTRACT_ADDRESS as Address,
    tokenId
  );

  return this.callContractMethod(
    this.environment.FRACTIONALIZER_CONTRACT_ADDRESS as Address,
    this.environment.FRACTIONALIZER_ABI as Abi,
    "fractionalize",
    [tokenId],
    { waitForReceipt: true }
  );
}
