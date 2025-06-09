import { Origin } from ".";
import constants from "../../../constants";
import abi from "../../origin/contracts/Marketplace.json";
import { Abi, Address } from "viem";
export function buyAccess(
  this: Origin,
  tokenId: bigint,
  periods: number,
  value?: bigint // only for native token payments
) {
  return this.callContractMethod(
    constants.MARKETPLACE_CONTRACT_ADDRESS as Address,
    abi as Abi,
    "buyAccess",
    [tokenId, periods],
    value !== undefined ? { value } : undefined
  );
}
