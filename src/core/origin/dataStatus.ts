import { Origin } from ".";
import { Abi, Address } from "viem";
import { DataStatus } from "./utils";

/**
 * Returns the data status of the given token ID.
 * @param tokenId The token ID to query.
 * @returns The data status of the token ID.
 */
export function dataStatus(this: Origin, tokenId: bigint): Promise<DataStatus> {
  return this.callContractMethod(
    this.environment.DATANFT_CONTRACT_ADDRESS as Address,
    this.environment.IPNFT_ABI as Abi,
    "dataStatus",
    [tokenId]
  );
}
