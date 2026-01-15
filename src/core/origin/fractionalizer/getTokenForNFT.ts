import { Abi, Address } from "viem";
import { Origin } from "..";

/**
 * Gets the fractional ERC20 token address for a specific IP NFT.
 * Returns zero address if the NFT has not been fractionalized.
 *
 * @param tokenId The token ID of the IP NFT.
 * @returns A promise that resolves with the fractional token address.
 *
 * @example
 * ```typescript
 * const fractionalToken = await origin.getTokenForNFT(1n);
 * if (fractionalToken !== zeroAddress) {
 *   console.log(`Fractional token: ${fractionalToken}`);
 * } else {
 *   console.log("NFT has not been fractionalized");
 * }
 * ```
 */
export async function getTokenForNFT(
  this: Origin,
  tokenId: bigint
): Promise<Address> {
  return this.callContractMethod(
    this.environment.FRACTIONALIZER_CONTRACT_ADDRESS as Address,
    this.environment.FRACTIONALIZER_ABI as Abi,
    "getTokenForNFT",
    [tokenId]
  );
}
