import { Origin } from ".";
import { Abi, Address } from "viem";

export function setApprovalForAll(
  this: Origin,
  operator: Address,
  approved: boolean
) {
  return this.callContractMethod(
    this.environment.DATANFT_CONTRACT_ADDRESS as Address,
    this.environment.IPNFT_ABI as Abi,
    "setApprovalForAll",
    [operator, approved]
  );
}
