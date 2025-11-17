import { Auth } from "./core/auth/index";

export * from "./core/auth/signers";
export * from "./core/auth/storage";

export { createNodeWalletClient } from "./core/auth/viem/node-client";

export {
  mainnet as campMainnet,
  testnet as campTestnet,
} from "./core/auth/viem/chains";

export { Auth };

export {
  createLicenseTerms,
  LicenseTerms,
  DataStatus,
} from "./core/origin/utils";
