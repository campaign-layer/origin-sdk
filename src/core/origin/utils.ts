import { Address, Hex, TypedDataParameter } from "viem";
import constants from "../../constants";

/**
 * Enum representing the type of license for an IP NFT.
 * - DURATION_BASED: License expires after a set duration (subscription model).
 * - SINGLE_PAYMENT: One-time payment for perpetual access.
 * - X402: HTTP 402-based micropayment license (no on-chain payments).
 */
export enum LicenseType {
  DURATION_BASED = 0,
  SINGLE_PAYMENT = 1,
  X402 = 2,
}

/**
 * Represents the terms of a license for a digital asset.
 * @property price - The price of the asset in wei.
 * @property duration - The duration of the license in seconds (0 for SINGLE_PAYMENT and X402).
 * @property royaltyBps - The royalty percentage in basis points (0-10000).
 * @property paymentToken - The address of the payment token (ERC20 / address(0) for native currency).
 * @property licenseType - The type of license (DURATION_BASED, SINGLE_PAYMENT, or X402).
 */
export type LicenseTerms = {
  price: bigint;
  duration: number;
  royaltyBps: number;
  paymentToken: Address;
  licenseType: LicenseType;
};

/**
 * Enum representing the status of data in the system.
 * - ACTIVE: The data is currently active and available.
 * - DELETED: The data has been deleted and is no longer available.
 * - DISPUTED: The data has been disputed and marked as potentially infringing.
 */
export enum DataStatus {
  ACTIVE = 0,
  DELETED = 1,
  DISPUTED = 2,
}

/**
 * Enum representing the status of a dispute.
 * - Uninitialized: Dispute does not exist.
 * - Raised: Dispute has been raised but not yet asserted by IP owner.
 * - Asserted: IP owner has responded to the dispute.
 * - Resolved: Dispute has been resolved (either valid or invalid).
 * - Cancelled: Dispute was cancelled by the initiator.
 */
export enum DisputeStatus {
  Uninitialized = 0,
  Raised = 1,
  Asserted = 2,
  Resolved = 3,
  Cancelled = 4,
}

/**
 * Represents a dispute against an IP NFT.
 */
export interface Dispute {
  initiator: Address;
  targetId: bigint;
  disputeTag: Hex;
  disputeEvidenceHash: Hex;
  counterEvidenceHash: Hex;
  disputeTimestamp: bigint;
  assertionTimestamp: bigint;
  yesVotes: bigint;
  noVotes: bigint;
  status: DisputeStatus;
  bondAmount: bigint;
  protocolFeeAmount: bigint;
}

/**
 * Represents app information from the AppRegistry.
 */
export interface AppInfo {
  treasury: Address;
  revenueShareBps: number;
  isActive: boolean;
}

/**
 * Comprehensive token information returned by getTokenInfoSmart.
 */
export interface TokenInfo {
  tokenId: bigint;
  owner: Address;
  uri: string;
  status: DataStatus;
  terms: LicenseTerms;
  hasAccess: boolean;
  accessExpiry: bigint | null;
  appId: string;
}

/**
 * Creates license terms for a digital asset.
 * @param price The price of the asset in wei.
 * @param duration The duration of the license in seconds (use 0 for SINGLE_PAYMENT and X402).
 * @param royaltyBps The royalty percentage in basis points (0-10000).
 * @param paymentToken The address of the payment token (ERC20 / address(0) for native currency).
 * @param licenseType The type of license (defaults to DURATION_BASED).
 * @returns The created license terms.
 */
export const createLicenseTerms = (
  price: bigint,
  duration: number,
  royaltyBps: number,
  paymentToken: Address,
  licenseType: LicenseType = LicenseType.DURATION_BASED
): LicenseTerms => {
  if (
    royaltyBps < constants.MIN_ROYALTY_BPS ||
    royaltyBps > constants.MAX_ROYALTY_BPS
  ) {
    throw new Error(
      `Royalty basis points must be between ${constants.MIN_ROYALTY_BPS} and ${constants.MAX_ROYALTY_BPS}`
    );
  }

  if (licenseType === LicenseType.DURATION_BASED) {
    if (
      duration < constants.MIN_LICENSE_DURATION ||
      duration > constants.MAX_LICENSE_DURATION
    ) {
      throw new Error(
        `Duration must be between ${constants.MIN_LICENSE_DURATION} and ${constants.MAX_LICENSE_DURATION} seconds for DURATION_BASED licenses`
      );
    }
  } else if (
    (licenseType === LicenseType.SINGLE_PAYMENT ||
      licenseType === LicenseType.X402) &&
    duration > 0
  ) {
    throw new Error(
      `Duration must be 0 for ${LicenseType[licenseType]} licenses`
    );
  }

  if (price < constants.MIN_PRICE) {
    throw new Error(`Price must be at least ${constants.MIN_PRICE} wei`);
  }

  return {
    price,
    duration,
    royaltyBps,
    paymentToken,
    licenseType,
  };
};

/**
 * Represents the source of an IpNFT.
 * This can be one of the supported social media platforms or a file upload.
 */
export type IpNFTSource = "spotify" | "twitter" | "tiktok" | "file";

/**
 * Defines the EIP-712 typed data structure for X402 Intent signatures.
 */
export const X402_INTENT_TYPES: Record<string, TypedDataParameter[]> = {
  X402Intent: [
    { name: "payer", type: "address" },
    { name: "asset", type: "address" },
    { name: "amount", type: "uint256" },
    { name: "httpMethod", type: "string" },
    { name: "payTo", type: "address" },

    { name: "tokenId", type: "uint256" },
    { name: "duration", type: "uint32" },

    { name: "expiresAt", type: "uint256" },
    { name: "nonce", type: "bytes32" },
  ],
};
