import { Abi, Address } from "viem";
import { Origin } from "..";
import { AppInfo } from "../utils";

/**
 * Gets information about a registered app from the AppRegistry.
 *
 * @param appId The app ID to look up.
 * @returns A promise that resolves with the app information.
 *
 * @example
 * ```typescript
 * const appInfo = await origin.getAppInfo("my-app-id");
 * console.log(`Treasury: ${appInfo.treasury}`);
 * console.log(`Revenue Share: ${appInfo.revenueShareBps / 100}%`);
 * console.log(`Active: ${appInfo.isActive}`);
 * ```
 */
export async function getAppInfo(
  this: Origin,
  appId: string
): Promise<AppInfo> {
  if (!this.environment.APP_REGISTRY_CONTRACT_ADDRESS) {
    throw new Error("App registry contract address not configured");
  }
  if (!this.environment.APP_REGISTRY_ABI) {
    throw new Error("App registry ABI not configured");
  }

  return this.callContractMethod(
    this.environment.APP_REGISTRY_CONTRACT_ADDRESS as Address,
    this.environment.APP_REGISTRY_ABI as Abi,
    "getAppInfo",
    [appId]
  );
}
