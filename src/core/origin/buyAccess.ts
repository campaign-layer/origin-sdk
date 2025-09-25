import { Origin } from ".";
import { Abi, Address } from "viem";

/**
 * Buys access to a data NFT for a specified duration.
 * @param buyer The address of the buyer.
 * @param tokenId The ID of the data NFT.
 * @param expectedPrice The expected price for the access.
 * @param expectedDuration The expected duration of the access in seconds.
 * @param expectedPaymentToken The address of the payment token (use zero address for native token).
 * @param value The amount of native token to send (only required if paying with native token).
 * @returns A promise that resolves when the transaction is confirmed.
 */
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
