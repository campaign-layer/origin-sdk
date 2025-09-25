import { Origin } from ".";
import { Abi, Address } from "viem";

/**
 * Returns the license terms associated with a specific token ID.
 * @param tokenId The token ID to query.
 * @returns The license terms of the token ID.
 */
export function getTerms(this: Origin, tokenId: bigint) {
  return this.callContractMethod(
    this.environment.DATANFT_CONTRACT_ADDRESS as Address,
    this.environment.IPNFT_ABI as Abi,
    "getTerms",
    [tokenId]
  );
}
