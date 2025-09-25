import { Origin } from ".";
import { Abi, Address } from "viem";

export function approve(this: Origin, to: Address, tokenId: bigint) {
  return this.callContractMethod(
    this.environment.DATANFT_CONTRACT_ADDRESS as Address,
    this.environment.IPNFT_ABI as Abi,
    "approve",
    [to, tokenId]
  );
}
