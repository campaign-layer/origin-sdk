import { Origin } from ".";
import constants from "../../constants";
import abi from "./contracts/DataNFT.json";
import { Abi, Address } from "viem";

export function approve(this: Origin, to: Address, tokenId: bigint) {
  return this.callContractMethod(
    constants.DATANFT_CONTRACT_ADDRESS as Address,
    abi as Abi,
    "approve",
    [to, tokenId]
  );
}
