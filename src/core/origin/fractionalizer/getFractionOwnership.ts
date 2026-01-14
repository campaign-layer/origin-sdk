import { Abi, Address, zeroAddress } from "viem";
import { Origin } from "..";
import { getPublicClient } from "../../auth/viem/client";

/**
 * Ownership information for fractional tokens.
 */
export interface FractionOwnership {
  /** The original NFT token ID */
  tokenId: bigint;
  /** The ERC20 token address (zero if not fractionalized) */
  erc20Address: Address;
  /** Whether this NFT has been fractionalized */
  isFractionalized: boolean;
  /** User's balance of fractional tokens */
  balance: bigint;
  /** Total supply of fractional tokens */
  totalSupply: bigint;
  /** User's ownership percentage (0-100) */
  ownershipPercentage: number;
  /** Whether user owns 100% and can redeem */
  canRedeem: boolean;
  /** Number of decimals for the ERC20 token */
  decimals: number;
}

// Minimal ERC20 ABI
const ERC20_ABI = [
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
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as Abi;

/**
 * Gets a user's ownership percentage of a fractionalized NFT.
 * Returns detailed information about the user's fractional token holdings.
 *
 * @param tokenId The token ID of the original NFT.
 * @param owner Optional address to check. If not provided, uses connected wallet.
 * @returns A promise that resolves with the ownership details.
 *
 * @example
 * ```typescript
 * const ownership = await origin.getFractionOwnership(1n);
 *
 * if (!ownership.isFractionalized) {
 *   console.log("This NFT has not been fractionalized");
 * } else {
 *   console.log(`You own ${ownership.ownershipPercentage}% of this NFT`);
 *   console.log(`Balance: ${ownership.balance} / ${ownership.totalSupply}`);
 *
 *   if (ownership.canRedeem) {
 *     console.log("You can redeem the original NFT!");
 *     await origin.redeem(1n);
 *   }
 * }
 * ```
 */
export async function getFractionOwnership(
  this: Origin,
  tokenId: bigint,
  owner?: Address
): Promise<FractionOwnership> {
  if (!this.environment.FRACTIONALIZER_CONTRACT_ADDRESS) {
    throw new Error("Fractionalizer contract address not configured");
  }
  if (!this.environment.FRACTIONALIZER_ABI) {
    throw new Error("Fractionalizer ABI not configured");
  }

  // Resolve owner address
  let ownerAddress: Address;
  if (owner) {
    ownerAddress = owner;
  } else {
    const viemClient = (this as any).viemClient;
    if (!viemClient) {
      throw new Error("No owner address provided and no wallet connected");
    }
    if (viemClient.account) {
      ownerAddress = viemClient.account.address;
    } else {
      const accounts = await viemClient.request({
        method: "eth_requestAccounts",
        params: [] as any,
      });
      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found in connected wallet");
      }
      ownerAddress = accounts[0] as Address;
    }
  }

  // Get the ERC20 token address for this NFT
  const erc20Address = await this.getTokenForNFT(tokenId);

  // Check if fractionalized
  if (!erc20Address || erc20Address === zeroAddress) {
    return {
      tokenId,
      erc20Address: zeroAddress,
      isFractionalized: false,
      balance: BigInt(0),
      totalSupply: BigInt(0),
      ownershipPercentage: 0,
      canRedeem: false,
      decimals: 18,
    };
  }

  const publicClient = getPublicClient();

  // Fetch ERC20 data
  const [balance, totalSupply, decimals] = await Promise.all([
    publicClient.readContract({
      address: erc20Address as Address,
      abi: ERC20_ABI,
      functionName: "balanceOf",
      args: [ownerAddress],
    }) as Promise<bigint>,
    publicClient.readContract({
      address: erc20Address as Address,
      abi: ERC20_ABI,
      functionName: "totalSupply",
      args: [],
    }) as Promise<bigint>,
    publicClient.readContract({
      address: erc20Address as Address,
      abi: ERC20_ABI,
      functionName: "decimals",
      args: [],
    }) as Promise<number>,
  ]);

  // Calculate ownership percentage
  let ownershipPercentage = 0;
  if (totalSupply > BigInt(0)) {
    ownershipPercentage = Number((balance * BigInt(10000)) / totalSupply) / 100;
  }

  const canRedeem = balance >= totalSupply && totalSupply > BigInt(0);

  return {
    tokenId,
    erc20Address: erc20Address as Address,
    isFractionalized: true,
    balance,
    totalSupply,
    ownershipPercentage,
    canRedeem,
    decimals,
  };
}
