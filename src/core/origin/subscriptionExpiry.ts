import { Origin } from ".";
import { Abi, Address } from "viem";

export function subscriptionExpiry(
  this: Origin,
  tokenId: bigint,
  user: Address
): Promise<bigint> {
  return this.callContractMethod(
    this.environment.MARKETPLACE_CONTRACT_ADDRESS as Address,
    this.environment.MARKETPLACE_ABI as Abi,
    "subscriptionExpiry",
    [tokenId, user]
  );
}
