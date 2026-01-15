import { Abi, Address, zeroAddress } from "viem";
import { Origin } from "..";
import { resolveWalletAddress } from "../utils";
import { getPublicClient } from "../../auth/viem/client";

/**
 * Ownership information for fractional tokens.
 */
export interface FractionOwnership {
  tokenId: bigint;
  /** The ERC20 token address (zero if not fractionalized) */
  erc20Address: Address;
  isFractionalized: boolean;
  /** User's balance of fractional tokens */
  balance: bigint;
  /** Total supply of fractional tokens */
  totalSupply: bigint;
  /** User's ownership percentage (0-100) */
  ownershipPercentage: number;
  /** Whether user owns 100% and can redeem */
  canRedeem: boolean;
  decimals: number;
}

// minimal ERC20 ABI
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
  const ownerAddress = await resolveWalletAddress(
    (this as any).viemClient,
    owner
  );

  // get the ERC20 token address for this NFT
  const erc20Address = await this.getTokenForNFT(tokenId);

  // check if fractionalized
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

  // fetch ERC20 data
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

  // calculate ownership percentage
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
