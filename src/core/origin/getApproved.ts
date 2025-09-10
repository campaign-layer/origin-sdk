import { Origin } from ".";
import abi from "./contracts/DataNFT.json";
import { Abi, Address } from "viem";

export function getApproved(this: Origin, tokenId: bigint): Promise<Address> {
  return this.callContractMethod(
    this.environment.DATANFT_CONTRACT_ADDRESS as Address,
    abi as Abi,
    "getApproved",
    [tokenId]
  );
}
