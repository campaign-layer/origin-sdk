import { Origin } from ".";
import { Address, encodeFunctionData, Abi } from "viem";
import { createSignerAdapter, SignerAdapter } from "../auth/signers";

/**
 * Response from getDataWithX402 when payment is required
 */
export interface X402Response {
  error: string;
  marketplaceAction?: {
    kind: string;
    contract: Address;
    network: string;
    chainId: number;
    method: string;
    payer: Address;
    payTo: Address;
    tokenId: string;
    duration: number;
    asset: Address;
    amount: string;
    amountFormatted: string;
  };
}

interface TransactionResult {
  txHash: string;
  receipt?: any;
}
/**
 * EXPERIMENTAL METHOD
 * Settles a payment intent response by purchasing access if needed.
 * This method checks if the user already has access to the item, and if not,
 * it calls buyAccess with the parameters from the payment intent response.
 * Supports viem WalletClient, ethers Signer, and custom signer implementations.
 *
 * @param paymentIntentResponse - The response from getDataWithIntent containing payment details.
 * @param signer - Optional signer object used to interact with the blockchain. If not provided, uses the connected wallet client.
 * @returns A promise that resolves with the transaction hash and receipt, or null if access already exists.
 * @throws {Error} If the response doesn't contain marketplace action or if the method is not buyAccess.
 */
export async function settlePaymentIntent(
  this: Origin,
  paymentIntentResponse: X402Response,
  signer?: any
): Promise<TransactionResult | null> {
  if (!paymentIntentResponse.marketplaceAction) {
    throw new Error("No marketplace action found in X402 response");
  }
  const { marketplaceAction } = paymentIntentResponse;
  if (marketplaceAction.method !== "buyAccess") {
    throw new Error(
      `Unsupported marketplace action method: ${marketplaceAction.method}`
    );
  }

  const tokenId = BigInt(marketplaceAction.tokenId);
  const payerAddress = marketplaceAction.payer as Address;
  const alreadyHasAccess = await this.hasAccess(payerAddress, tokenId);

  if (alreadyHasAccess) {
    console.log("User already has access to this item");
    return null;
  }

  const expectedPrice = BigInt(marketplaceAction.amount);
  const expectedDuration = BigInt(marketplaceAction.duration);
  const expectedPaymentToken = marketplaceAction.asset as Address;

  const isNativeToken =
    expectedPaymentToken === "0x0000000000000000000000000000000000000000";
  const value = isNativeToken ? expectedPrice : BigInt(0);

  if (signer) {
    const signerAdapter = createSignerAdapter(signer);
    const marketplaceAddress = this.environment
      .MARKETPLACE_CONTRACT_ADDRESS as Address;
    const abi = this.environment.MARKETPLACE_ABI as Abi;

    const data = encodeFunctionData({
      abi,
      functionName: "buyAccess",
      args: [
        payerAddress,
        tokenId,
        expectedPrice,
        expectedDuration,
        expectedPaymentToken,
      ],
    });

    if (signerAdapter.type === "viem") {
      const viemSigner = (signerAdapter as any).signer;
      const txHash = await viemSigner.sendTransaction({
        to: marketplaceAddress,
        data,
        value,
        account: (await signerAdapter.getAddress()) as `0x${string}`,
      });

      const receipt = await viemSigner.waitForTransactionReceipt({
        hash: txHash,
      });

      return { txHash, receipt };
    } else if (signerAdapter.type === "ethers") {
      const ethersSigner = (signerAdapter as any).signer;

      const tx = await ethersSigner.sendTransaction({
        to: marketplaceAddress,
        data,
        value: value.toString(),
      });

      const receipt = await tx.wait();
      return { txHash: tx.hash, receipt };
    } else {
      const customSigner = (signerAdapter as any).signer;

      if (typeof customSigner.sendTransaction !== "function") {
        throw new Error(
          "Custom signer must implement sendTransaction() method"
        );
      }

      const tx = await customSigner.sendTransaction({
        to: marketplaceAddress,
        data,
        value: value.toString(),
      });

      if (tx.wait && typeof tx.wait === "function") {
        const receipt = await tx.wait();
        return { txHash: tx.hash, receipt };
      }

      return { txHash: tx.hash || tx };
    }
  }

  if (!(this as any).viemClient) {
    throw new Error("No signer or wallet client provided for settleX402");
  }

  return await this.buyAccess(
    payerAddress,
    tokenId,
    expectedPrice,
    expectedDuration,
    expectedPaymentToken,
    isNativeToken ? value : undefined
  );
}
