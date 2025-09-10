import { Origin } from ".";
import abi from "./contracts/DataNFT.json";
import { Abi, Address } from "viem";

export function getTerms(this: Origin, tokenId: bigint) {
  return this.callContractMethod(
    this.environment.DATANFT_CONTRACT_ADDRESS as Address,
    abi as Abi,
    "getTerms",
    [tokenId]
  );
}
