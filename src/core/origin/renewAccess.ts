import { Origin } from ".";
import abi from "./contracts/Marketplace.json";
import { Abi, Address } from "viem";
export function renewAccess(
  this: Origin,
  tokenId: bigint,
  buyer: Address,
  periods: number,
  value?: bigint
) {
  return this.callContractMethod(
    this.environment.MARKETPLACE_CONTRACT_ADDRESS as Address,
    this.environment.MARKETPLACE_ABI as Abi,
    "renewAccess",
    [tokenId, buyer, periods],
    value !== undefined ? { value } : undefined
  );
}
