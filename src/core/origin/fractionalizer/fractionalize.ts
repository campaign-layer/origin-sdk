import { Abi, Address } from "viem";
import { Origin } from "..";

/**
 * Fractionalizes an IP NFT into fungible ERC20 tokens.
 * The NFT is transferred to the fractionalizer contract and a new ERC20 token is created.
 * The caller receives the full supply of fractional tokens.
 *
 * @param tokenId The token ID of the IP NFT to fractionalize.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * // First approve the fractionalizer contract to transfer your NFT
 * await origin.approve(fractionalizerAddress, tokenId);
 *
 * // Then fractionalize
 * const result = await origin.fractionalize(1n);
 * ```
 */
export async function fractionalize(
  this: Origin,
  tokenId: bigint
): Promise<any> {
  if (!this.environment.FRACTIONALIZER_CONTRACT_ADDRESS) {
    throw new Error("Fractionalizer contract address not configured");
  }
  if (!this.environment.FRACTIONALIZER_ABI) {
    throw new Error("Fractionalizer ABI not configured");
  }

  return this.callContractMethod(
    this.environment.FRACTIONALIZER_CONTRACT_ADDRESS as Address,
    this.environment.FRACTIONALIZER_ABI as Abi,
    "fractionalize",
    [tokenId],
    { waitForReceipt: true }
  );
}
