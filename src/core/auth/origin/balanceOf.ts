import { Origin } from ".";
import constants from "../../../constants";
import abi from "../../origin/contracts/DataNFT.json";
import { Abi, Address } from "viem";

export function balanceOf(this: Origin, owner: Address) {
  return this.callContractMethod(
    constants.DATANFT_CONTRACT_ADDRESS as Address,
    abi as Abi,
    "balanceOf",
    [owner]
  );
}
