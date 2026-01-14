import { Abi, Address, zeroAddress } from "viem";
import { Origin } from "..";
import { DataStatus } from "../utils";
import { getPublicClient } from "../../auth/viem/client";

/**
 * Result of checking if a user can fractionalize an NFT.
 */
export interface FractionalizeEligibility {
  /** Whether the user can fractionalize this NFT */
  canFractionalize: boolean;
  /** Reason why user cannot fractionalize (if canFractionalize is false) */
  reason?: string;
  /** Whether the user owns this NFT */
  isOwner: boolean;
  /** Current owner of the NFT */
  currentOwner: Address;
  /** Whether this NFT is already fractionalized */
  isAlreadyFractionalized: boolean;
  /** ERC20 address if already fractionalized */
  existingErc20Address?: Address;
  /** Current data status of the NFT */
  dataStatus: DataStatus;
  /** Whether the fractionalizer contract is approved to transfer */
  isApproved: boolean;
  /** Whether approval is needed before fractionalizing */
  needsApproval: boolean;
}

/**
 * Checks if a user can fractionalize an NFT and why not if they can't.
 * Returns detailed information about eligibility requirements.
 *
 * @param tokenId The token ID of the NFT to check.
 * @param owner Optional address to check. If not provided, uses connected wallet.
 * @returns A promise that resolves with the fractionalize eligibility details.
 *
 * @example
 * ```typescript
 * const eligibility = await origin.canFractionalize(1n);
 *
 * if (eligibility.canFractionalize) {
 *   if (eligibility.needsApproval) {
 *     // Use fractionalizeWithApproval for convenience
 *     await origin.fractionalizeWithApproval(1n);
 *   } else {
 *     await origin.fractionalize(1n);
 *   }
 * } else {
 *   console.log(`Cannot fractionalize: ${eligibility.reason}`);
 * }
 * ```
 */
export async function canFractionalize(
  this: Origin,
  tokenId: bigint,
  owner?: Address
): Promise<FractionalizeEligibility> {
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

  const publicClient = getPublicClient();
  const fractionalizerAddress = this.environment
    .FRACTIONALIZER_CONTRACT_ADDRESS as Address;

  // Fetch all required data in parallel
  const [
    currentOwner,
    dataStatus,
    erc20Address,
    approvedAddress,
    isApprovedForAll,
  ] = await Promise.all([
    this.ownerOf(tokenId) as Promise<Address>,
    this.dataStatus(tokenId) as Promise<DataStatus>,
    this.getTokenForNFT(tokenId) as Promise<Address>,
    publicClient.readContract({
      address: this.environment.DATANFT_CONTRACT_ADDRESS as Address,
      abi: this.environment.IPNFT_ABI as Abi,
      functionName: "getApproved",
      args: [tokenId],
    }) as Promise<Address>,
    publicClient.readContract({
      address: this.environment.DATANFT_CONTRACT_ADDRESS as Address,
      abi: this.environment.IPNFT_ABI as Abi,
      functionName: "isApprovedForAll",
      args: [ownerAddress, fractionalizerAddress],
    }) as Promise<boolean>,
  ]);

  const isOwner = currentOwner.toLowerCase() === ownerAddress.toLowerCase();
  const isAlreadyFractionalized = erc20Address && erc20Address !== zeroAddress;
  const isApproved =
    isApprovedForAll ||
    approvedAddress.toLowerCase() === fractionalizerAddress.toLowerCase();

  // Build base result
  const baseResult: FractionalizeEligibility = {
    canFractionalize: false,
    isOwner,
    currentOwner,
    isAlreadyFractionalized: !!isAlreadyFractionalized,
    existingErc20Address: isAlreadyFractionalized
      ? (erc20Address as Address)
      : undefined,
    dataStatus,
    isApproved,
    needsApproval: !isApproved,
  };

  // Check requirements in order
  if (!isOwner) {
    return {
      ...baseResult,
      reason: `You don't own this NFT. Current owner: ${currentOwner}`,
    };
  }

  if (isAlreadyFractionalized) {
    return {
      ...baseResult,
      reason: `This NFT is already fractionalized. ERC20: ${erc20Address}`,
    };
  }

  if (dataStatus === DataStatus.DELETED) {
    return {
      ...baseResult,
      reason: "This NFT has been deleted and cannot be fractionalized",
    };
  }

  if (dataStatus === DataStatus.DISPUTED) {
    return {
      ...baseResult,
      reason: "This NFT is disputed and cannot be fractionalized",
    };
  }

  // All checks passed
  return {
    ...baseResult,
    canFractionalize: true,
  };
}
