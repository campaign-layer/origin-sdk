import { Origin } from ".";
import constants from "../../constants";
import abi from "./contracts/Marketplace.json";
import { Abi, Address } from "viem";
export function buyAccess(
  this: Origin,
  buyer: Address,
  tokenId: bigint,
  periods: number,
  value?: bigint // only for native token payments
) {
  return this.callContractMethod(
    constants.MARKETPLACE_CONTRACT_ADDRESS as Address,
    abi as Abi,
    "buyAccess",
    [buyer, tokenId, periods],
    { waitForReceipt: true, value }
  );
}
