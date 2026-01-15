import { Abi, Address, zeroAddress } from "viem";
import { Origin } from "..";
import { DataStatus, resolveWalletAddress } from "../utils";
import { getPublicClient } from "../../auth/viem/client";

/**
 * Result of checking if a user can fractionalize an NFT.
 */
export interface FractionalizeEligibility {
  canFractionalize: boolean;
  /** Reason why user cannot fractionalize (if canFractionalize is false) */
  reason?: string;
  isOwner: boolean;
  currentOwner: Address;
  isAlreadyFractionalized: boolean;
  /** ERC20 address if already fractionalized */
  existingErc20Address?: Address;
  dataStatus: DataStatus;
  isApproved: boolean;
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
  const ownerAddress = await resolveWalletAddress(
    (this as any).viemClient,
    owner
  );

  const publicClient = getPublicClient();
  const fractionalizerAddress = this.environment
    .FRACTIONALIZER_CONTRACT_ADDRESS as Address;

  // fetch all required data
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

  // build base result
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

  // check requirements
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

  // passed
  return {
    ...baseResult,
    canFractionalize: true,
  };
}
