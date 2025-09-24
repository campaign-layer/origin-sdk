import { Origin } from ".";
import abi from "./contracts/Marketplace.json";
import { Abi, Address } from "viem";
export function buyAccess(
  this: Origin,
  buyer: Address,
  tokenId: bigint,
  expectedPrice: bigint,
  expectedDuration: bigint,
  expectedPaymentToken: Address,
  value?: bigint // only for native token payments
) {
  return this.callContractMethod(
    this.environment.MARKETPLACE_CONTRACT_ADDRESS as Address,
    this.environment.MARKETPLACE_ABI as Abi,
    "buyAccess",
    [buyer, tokenId, expectedPrice, expectedDuration, expectedPaymentToken],
    { waitForReceipt: true, value }
  );
}
