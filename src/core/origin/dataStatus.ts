import { Origin } from ".";
import abi from "./contracts/DataNFT.json";
import { Abi, Address } from "viem";
import { DataStatus } from "./utils";

export function dataStatus(this: Origin, tokenId: bigint): Promise<DataStatus> {
  return this.callContractMethod(
    this.environment.DATANFT_CONTRACT_ADDRESS as Address,
    this.environment.IPNFT_ABI as Abi,
    "dataStatus",
    [tokenId]
  );
}
