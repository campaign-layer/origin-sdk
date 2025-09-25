import { Origin } from ".";
import { Abi, Address } from "viem";

/**
 * Sets the IPNFT as deleted
 * @param tokenId The token ID to set as deleted.
 * @returns A promise that resolves when the transaction is complete.
 */
export function finalizeDelete(this: Origin, tokenId: bigint) {
  return this.callContractMethod(
    this.environment.DATANFT_CONTRACT_ADDRESS as Address,
    this.environment.IPNFT_ABI as Abi,
    "finalizeDelete",
    [tokenId]
  );
}
