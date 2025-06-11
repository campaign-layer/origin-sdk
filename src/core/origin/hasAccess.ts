import { Origin } from ".";
import constants from "../../constants";
import abi from "./contracts/Marketplace.json";
import { Abi, Address } from "viem";
export function hasAccess(
  this: Origin,
  user: Address,
  tokenId: bigint
): Promise<boolean> {
  return this.callContractMethod(
    constants.MARKETPLACE_CONTRACT_ADDRESS as Address,
    abi as Abi,
    "hasAccess",
    [user, tokenId]
  );
}
