import { Origin } from ".";
import { Address } from "viem";

/**
 * Checks if a user has access to a specific token based on subscription expiry.
 * @param user - The address of the user.
 * @param tokenId - The ID of the token.
 * @returns A promise that resolves to a boolean indicating if the user has access.
 */
export async function hasAccess(
  this: Origin,
  user: Address,
  tokenId: bigint
): Promise<boolean> {
  try {
    const expiryTimestamp = await this.subscriptionExpiry(tokenId, user);
    const currentTimestamp = BigInt(Math.floor(Date.now() / 1000));
    return expiryTimestamp > currentTimestamp;
  } catch (error) {
    return false;
  }
}
