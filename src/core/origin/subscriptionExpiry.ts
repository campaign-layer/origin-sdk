import { Origin } from ".";
import abi from "./contracts/Marketplace.json";
import { Abi, Address } from "viem";

export function subscriptionExpiry(
  this: Origin,
  tokenId: bigint,
  user: Address
): Promise<bigint> {
  return this.callContractMethod(
    this.environment.MARKETPLACE_CONTRACT_ADDRESS as Address,
    abi as Abi,
    "subscriptionExpiry",
    [tokenId, user]
  );
}
