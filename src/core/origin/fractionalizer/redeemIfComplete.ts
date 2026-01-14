import { Abi, Address } from "viem";
import { Origin } from "..";
import { getPublicClient } from "../../auth/viem/client";

/**
 * Redeems fractional tokens for the underlying NFT, but only if the caller owns 100% of the supply.
 * This method checks the caller's balance before attempting to redeem, providing a clear error
 * if they don't hold the full supply.
 *
 * @param tokenId The token ID of the original NFT to redeem.
 * @returns A promise that resolves with the transaction result.
 * @throws Error if the caller doesn't own 100% of the fractional tokens.
 *
 * @example
 * ```typescript
 * try {
 *   const result = await origin.redeemIfComplete(1n);
 *   console.log("NFT redeemed successfully!");
 * } catch (error) {
 *   console.log("You don't own all fractional tokens yet");
 * }
 * ```
 */
export async function redeemIfComplete(
  this: Origin,
  tokenId: bigint
): Promise<any> {
  if (!this.environment.FRACTIONALIZER_CONTRACT_ADDRESS) {
    throw new Error("Fractionalizer contract address not configured");
  }
  if (!this.environment.FRACTIONALIZER_ABI) {
    throw new Error("Fractionalizer ABI not configured");
  }

  // Get the ERC20 token address for this NFT
  const erc20Address = await this.getTokenForNFT(tokenId);
  if (
    !erc20Address ||
    erc20Address === "0x0000000000000000000000000000000000000000"
  ) {
    throw new Error("This NFT has not been fractionalized");
  }

  // Get current wallet address
  const viemClient = (this as any).viemClient;
  if (!viemClient) {
    throw new Error("WalletClient not connected. Please connect a wallet.");
  }

  let owner: Address;
  if (viemClient.account) {
    owner = viemClient.account.address;
  } else {
    const accounts = await viemClient.request({
      method: "eth_requestAccounts",
      params: [] as any,
    });
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found in connected wallet.");
    }
    owner = accounts[0] as Address;
  }

  // Check caller's balance and total supply
  const erc20Abi = [
    {
      inputs: [{ name: "owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupply",
      outputs: [{ name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ] as Abi;

  const publicClient = getPublicClient();

  const [balance, totalSupply] = await Promise.all([
    publicClient.readContract({
      address: erc20Address as Address,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [owner],
    }) as Promise<bigint>,
    publicClient.readContract({
      address: erc20Address as Address,
      abi: erc20Abi,
      functionName: "totalSupply",
      args: [],
    }) as Promise<bigint>,
  ]);

  if (balance < totalSupply) {
    const percentage = (balance * BigInt(10000)) / totalSupply;
    throw new Error(
      `Cannot redeem: you own ${percentage / BigInt(100)}.${
        percentage % BigInt(100)
      }% of the fractional tokens (${balance}/${totalSupply}). You need 100% to redeem.`
    );
  }

  // Proceed with redemption
  return this.callContractMethod(
    this.environment.FRACTIONALIZER_CONTRACT_ADDRESS as Address,
    this.environment.FRACTIONALIZER_ABI as Abi,
    "redeem",
    [tokenId],
    { waitForReceipt: true }
  );
}
