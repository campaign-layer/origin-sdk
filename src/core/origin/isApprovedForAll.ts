import { Origin } from ".";
import abi from "./contracts/DataNFT.json";
import { Abi, Address } from "viem";

export function isApprovedForAll(
  this: Origin,
  owner: Address,
  operator: Address
): Promise<boolean> {
  return this.callContractMethod(
    this.environment.DATANFT_CONTRACT_ADDRESS as Address,
    abi as Abi,
    "isApprovedForAll",
    [owner, operator]
  );
}
