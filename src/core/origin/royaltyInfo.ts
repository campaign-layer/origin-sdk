import { Origin } from ".";
import abi from "./contracts/DataNFT.json";
import { Abi, Address } from "viem";

export async function royaltyInfo(
  this: Origin,
  tokenId: bigint,
  salePrice: bigint
): Promise<[Address, bigint]> {
  return this.callContractMethod(
    this.environment.DATANFT_CONTRACT_ADDRESS as Address,
    this.environment.IPNFT_ABI as Abi,
    "royaltyInfo",
    [tokenId, salePrice]
  );
}
