import { Origin } from ".";
import constants from "../../constants";
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
    constants.MARKETPLACE_CONTRACT_ADDRESS as Address,
    abi as Abi,
    "renewAccess",
    [tokenId, buyer, periods],
    value !== undefined ? { value } : undefined
  );
}
