import { Origin } from ".";
import { Abi, Address } from "viem";

/**
 * Returns the metadata URI associated with a specific token ID.
 * @param tokenId The token ID to query.
 * @returns The metadata URI of the token ID.
 */
export function tokenURI(this: Origin, tokenId: bigint) {
  return this.callContractMethod(
    this.environment.DATANFT_CONTRACT_ADDRESS as Address,
    this.environment.IPNFT_ABI as Abi,
    "tokenURI",
    [tokenId]
  );
}
