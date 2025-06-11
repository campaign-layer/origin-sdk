import { Origin } from ".";
import constants from "../../constants";
import abi from "./contracts/DataNFT.json";
import { Abi, Address } from "viem";
import { DataStatus } from "./utils";

export function dataStatus(this: Origin, tokenId: bigint): Promise<DataStatus> {
  return this.callContractMethod(
    constants.DATANFT_CONTRACT_ADDRESS as Address,
    abi as Abi,
    "dataStatus",
    [tokenId]
  );
}
