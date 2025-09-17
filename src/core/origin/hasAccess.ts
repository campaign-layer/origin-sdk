import { Origin } from ".";
import abi from "./contracts/Marketplace.json";
import { Abi, Address } from "viem";
export function hasAccess(
  this: Origin,
  user: Address,
  tokenId: bigint
): Promise<boolean> {
  return this.callContractMethod(
    this.environment.MARKETPLACE_CONTRACT_ADDRESS as Address,
    this.environment.MARKETPLACE_ABI as Abi,
    "hasAccess",
    [user, tokenId]
  );
}
