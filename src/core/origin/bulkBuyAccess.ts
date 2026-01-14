import { Origin } from ".";
import { Abi, Address, zeroAddress } from "viem";
import { getPublicClient } from "../auth/viem/client";
import { approveIfNeeded } from "./approveIfNeeded";

/**
 * Parameters for a single purchase in a bulk buy operation.
 */
export interface BuyParams {
  tokenId: bigint;
  expectedPrice: bigint;
  expectedDuration: number;
  expectedPaymentToken: Address;
  expectedProtocolFeeBps: number;
  expectedAppFeeBps: number;
}

/**
 * Result of a tolerant bulk purchase operation.
 */
export interface TolerantResult {
  successCount: bigint;
  failureCount: bigint;
  totalSpent: bigint;
  refundAmount: bigint;
  failedTokenIds: bigint[];
}

/**
 * Preview of bulk purchase costs.
 */
export interface BulkCostPreview {
  totalNativeCost: bigint;
  totalERC20Cost: bigint;
  validCount: bigint;
  invalidTokenIds: bigint[];
}

/**
 * Executes an atomic bulk purchase of multiple IP-NFT licenses.
 * All purchases succeed or all fail together.
 *
 * @param buyer The address that will receive the licenses.
 * @param purchases Array of purchase parameters for each token.
 * @param value Total native token value to send (sum of all native token purchases).
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * const purchases = [
 *   { tokenId: 1n, expectedPrice: 1000000000000000n, expectedDuration: 86400, expectedPaymentToken: zeroAddress },
 *   { tokenId: 2n, expectedPrice: 2000000000000000n, expectedDuration: 86400, expectedPaymentToken: zeroAddress },
 * ];
 * const totalValue = 3000000000000000n;
 * await origin.bulkBuyAccess(buyerAddress, purchases, totalValue);
 * ```
 */
export function bulkBuyAccess(
  this: Origin,
  buyer: Address,
  purchases: BuyParams[],
  value?: bigint
) {
  return this.callContractMethod(
    this.environment.BATCH_PURCHASE_CONTRACT_ADDRESS as Address,
    this.environment.BATCH_PURCHASE_ABI as Abi,
    "bulkBuyAccess",
    [buyer, purchases],
    { waitForReceipt: true, value }
  );
}

/**
 * Executes a fault-tolerant bulk purchase of multiple IP-NFT licenses.
 * Individual purchases can fail without reverting the entire transaction.
 * Unused funds are automatically refunded.
 *
 * @param buyer The address that will receive the licenses.
 * @param purchases Array of purchase parameters for each token.
 * @param value Total native token value to send (can be more than needed; excess is refunded).
 * @returns A promise that resolves with the tolerant result including success/failure counts.
 *
 * @example
 * ```typescript
 * const result = await origin.bulkBuyAccessTolerant(buyerAddress, purchases, totalValue);
 * console.log(`Purchased ${result.successCount} of ${purchases.length} IPs`);
 * console.log(`Failed tokens: ${result.failedTokenIds}`);
 * ```
 */
export function bulkBuyAccessTolerant(
  this: Origin,
  buyer: Address,
  purchases: BuyParams[],
  value?: bigint
) {
  return this.callContractMethod(
    this.environment.BATCH_PURCHASE_CONTRACT_ADDRESS as Address,
    this.environment.BATCH_PURCHASE_ABI as Abi,
    "bulkBuyAccessTolerant",
    [buyer, purchases],
    { waitForReceipt: true, value }
  );
}

/**
 * Previews the total cost of purchasing multiple IP-NFT licenses.
 * This is a view function that doesn't require a transaction.
 *
 * @param tokenIds Array of token IDs to preview costs for.
 * @returns A promise that resolves with the cost preview including total costs and invalid tokens.
 *
 * @example
 * ```typescript
 * const preview = await origin.previewBulkCost([1n, 2n, 3n]);
 * console.log(`Total cost: ${preview.totalNativeCost} wei`);
 * console.log(`Valid tokens: ${preview.validCount}`);
 * ```
 */
export function previewBulkCost(
  this: Origin,
  tokenIds: bigint[]
): Promise<BulkCostPreview> {
  return this.callContractMethod(
    this.environment.BATCH_PURCHASE_CONTRACT_ADDRESS as Address,
    this.environment.BATCH_PURCHASE_ABI as Abi,
    "previewBulkCost",
    [tokenIds]
  );
}

/**
 * Builds purchase parameters for multiple tokens by fetching their current license terms.
 * This is a view function that doesn't require a transaction.
 *
 * @param tokenIds Array of token IDs to build parameters for.
 * @returns A promise that resolves with an array of BuyParams ready for bulk purchase.
 *
 * @example
 * ```typescript
 * const params = await origin.buildPurchaseParams([1n, 2n, 3n]);
 * await origin.bulkBuyAccess(buyer, params, totalValue);
 * ```
 */
export function buildPurchaseParams(
  this: Origin,
  tokenIds: bigint[]
): Promise<BuyParams[]> {
  return this.callContractMethod(
    this.environment.BATCH_PURCHASE_CONTRACT_ADDRESS as Address,
    this.environment.BATCH_PURCHASE_ABI as Abi,
    "buildPurchaseParams",
    [tokenIds]
  );
}

/**
 * Checks the active status of multiple tokens.
 *
 * @param tokenIds Array of token IDs to check.
 * @returns A promise that resolves with an array of boolean flags indicating active status.
 *
 * @example
 * ```typescript
 * const activeFlags = await origin.checkActiveStatus([1n, 2n, 3n]);
 * const activeTokens = tokenIds.filter((_, i) => activeFlags[i]);
 * ```
 */
export function checkActiveStatus(
  this: Origin,
  tokenIds: bigint[]
): Promise<boolean[]> {
  return this.callContractMethod(
    this.environment.BATCH_PURCHASE_CONTRACT_ADDRESS as Address,
    this.environment.BATCH_PURCHASE_ABI as Abi,
    "checkActiveStatus",
    [tokenIds]
  );
}

/**
 * Smart bulk purchase that automatically fetches terms and handles the entire purchase flow.
 * This is the recommended method for most use cases.
 *
 * @param tokenIds Array of token IDs to purchase.
 * @param options Optional configuration for the purchase.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * // Atomic purchase - all succeed or all fail
 * const result = await origin.bulkBuyAccessSmart([1n, 2n, 3n]);
 *
 * // Tolerant purchase - continue even if some fail
 * const result = await origin.bulkBuyAccessSmart([1n, 2n, 3n], { tolerant: true });
 * ```
 */
export async function bulkBuyAccessSmart(
  this: Origin,
  tokenIds: bigint[],
  options?: {
    tolerant?: boolean;
  }
): Promise<any> {
  if (!tokenIds || tokenIds.length === 0) {
    throw new Error("No token IDs provided for bulk purchase");
  }

  // Get the buyer's wallet address
  const viemClient = (this as any).viemClient;
  if (!viemClient) {
    throw new Error("WalletClient not connected. Please connect a wallet.");
  }

  let buyer: Address;
  if (viemClient.account) {
    buyer = viemClient.account.address;
  } else {
    const accounts = await viemClient.request({
      method: "eth_requestAccounts",
      params: [] as any,
    });
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found in connected wallet.");
    }
    buyer = accounts[0] as Address;
  }

  // Build purchase params from on-chain data
  const purchases = await this.buildPurchaseParams(tokenIds);

  // Calculate total native token cost
  let totalNativeValue = BigInt(0);
  const erc20Purchases: { token: Address; amount: bigint }[] = [];

  for (const purchase of purchases) {
    if (purchase.expectedPaymentToken === zeroAddress) {
      totalNativeValue += purchase.expectedPrice;
    } else {
      // Group ERC20 purchases by token
      const existing = erc20Purchases.find(
        (p) => p.token === purchase.expectedPaymentToken
      );
      if (existing) {
        existing.amount += purchase.expectedPrice;
      } else {
        erc20Purchases.push({
          token: purchase.expectedPaymentToken,
          amount: purchase.expectedPrice,
        });
      }
    }
  }

  // Approve ERC20 tokens if needed
  const publicClient = getPublicClient();
  for (const erc20 of erc20Purchases) {
    await approveIfNeeded({
      walletClient: viemClient,
      publicClient,
      tokenAddress: erc20.token,
      owner: buyer,
      spender: this.environment.BATCH_PURCHASE_CONTRACT_ADDRESS as Address,
      amount: erc20.amount,
    });
  }

  // Execute the purchase
  if (options?.tolerant) {
    return this.bulkBuyAccessTolerant(buyer, purchases, totalNativeValue);
  } else {
    return this.bulkBuyAccess(buyer, purchases, totalNativeValue);
  }
}
