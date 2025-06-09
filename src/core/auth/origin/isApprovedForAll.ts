import { Origin } from ".";
import constants from "../../../constants";
import abi from "../../origin/contracts/DataNFT.json";
import { Abi, Address } from "viem";

export function isApprovedForAll(
  this: Origin,
  owner: Address,
  operator: Address
): Promise<boolean> {
  return this.callContractMethod(
    constants.DATANFT_CONTRACT_ADDRESS as Address,
    abi as Abi,
    "isApprovedForAll",
    [owner, operator]
  );
}
