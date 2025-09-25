import { Origin } from ".";
import { Abi, Address } from "viem";

/**
 * Returns the owner of the specified IPNFT.
 * @param tokenId The ID of the IPNFT to query.
 * @returns The address of the owner of the IPNFT.
 */
export function ownerOf(this: Origin, tokenId: bigint) {
  return this.callContractMethod(
    this.environment.DATANFT_CONTRACT_ADDRESS as Address,
    this.environment.IPNFT_ABI as Abi,
    "ownerOf",
    [tokenId]
  );
}
