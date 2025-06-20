import { Address } from "viem";

/**
 * Represents the terms of a license for a digital asset.
 * @property price - The price of the asset in wei.
 * @property duration - The duration of the license in seconds.
 * @property royaltyBps - The royalty percentage in basis points (0-10000).
 * @property paymentToken - The address of the payment token (ERC20 / address(0) for native currency).
 */
export type LicenseTerms = {
  price: bigint;
  duration: number;
  royaltyBps: number;
  paymentToken: Address;
};

/**
 * Enum representing the status of data in the system.
 * * - ACTIVE: The data is currently active and available.
 * * - PENDING_DELETE: The data is scheduled for deletion but not yet removed.
 * * - DELETED: The data has been deleted and is no longer available.
 */
export enum DataStatus {
  ACTIVE = 0,
  PENDING_DELETE = 1,
  DELETED = 2,
}

/**
 * Creates license terms for a digital asset.
 * @param price The price of the asset in wei.
 * @param duration The duration of the license in seconds.
 * @param royaltyBps The royalty percentage in basis points (0-10000).
 * @param paymentToken The address of the payment token (ERC20 / address(0) for native currency).
 * @returns The created license terms.
 */
export const createLicenseTerms = (
  price: bigint,
  duration: number,
  royaltyBps: number,
  paymentToken: Address
): LicenseTerms => {
  return {
    price,
    duration,
    royaltyBps,
    paymentToken,
  };
};

/**
 * Represents the source of an IpNFT.
 * This can be one of the supported social media platforms or a file upload.
 */
export type IpNFTSource = "spotify" | "twitter" | "tiktok" | "file";