import { Abi, Address } from "viem";
import { Origin } from "..";

/**
 * Redeems an IP NFT by burning all of its fractional tokens.
 * The caller must hold the entire supply of the NFT's fractional token.
 * After redemption, the NFT is transferred back to the caller.
 *
 * @param tokenId The token ID of the IP NFT to redeem.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * // Requires holding 100% of the fractional token supply
 * await origin.redeem(1n);
 * ```
 */
export async function redeem(this: Origin, tokenId: bigint): Promise<any> {
  return this.callContractMethod(
    this.environment.FRACTIONALIZER_CONTRACT_ADDRESS as Address,
    this.environment.FRACTIONALIZER_ABI as Abi,
    "redeem",
    [tokenId],
    { waitForReceipt: true }
  );
}
