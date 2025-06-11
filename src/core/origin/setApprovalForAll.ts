import { Origin } from ".";
import constants from "../../constants";
import abi from "./contracts/DataNFT.json";
import { Abi, Address } from "viem";

export function setApprovalForAll(
  this: Origin,
  operator: Address,
  approved: boolean
) {
  return this.callContractMethod(
    constants.DATANFT_CONTRACT_ADDRESS as Address,
    abi as Abi,
    "setApprovalForAll",
    [operator, approved]
  );
}
