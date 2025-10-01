import { mainnet, testnet } from "./core/auth/viem/chains";

import ipnftMainnetAbi from "./core/origin/contracts/mainnet/IPNFT.json";
import marketplaceMainnetAbi from "./core/origin/contracts/mainnet/Marketplace.json";
import royaltyVaultAbi from "./core/origin/contracts/mainnet/RoyaltyVault.json";

export default {
  SIWE_MESSAGE_STATEMENT: "Connect with Camp Network",
  ORIGIN_DASHBOARD: "https://origin.campnetwork.xyz",
  SUPPORTED_IMAGE_FORMATS: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
  ],
  SUPPORTED_VIDEO_FORMATS: ["video/mp4", "video/webm"],
  SUPPORTED_AUDIO_FORMATS: ["audio/mpeg", "audio/wav", "audio/ogg"],
  SUPPORTED_TEXT_FORMATS: ["text/plain"],
  AVAILABLE_SOCIALS: ["twitter", "spotify", "tiktok"],
  MAX_LICENSE_DURATION: 2628000, // 30 days in seconds
  MIN_LICENSE_DURATION: 86400, // 1 day in seconds
  MIN_PRICE: 1000000000000000, // 0.001 CAMP in wei
  MIN_ROYALTY_BPS: 1, // 0.01%
  MAX_ROYALTY_BPS: 10000, // 100%
};

export interface Environment {
  NAME: string;
  AUTH_HUB_BASE_API: string;
  AUTH_ENDPOINT: string;
  ORIGIN_DASHBOARD: string;
  DATANFT_CONTRACT_ADDRESS: string;
  MARKETPLACE_CONTRACT_ADDRESS: string;
  CHAIN: any;
  IPNFT_ABI?: any;
  MARKETPLACE_ABI?: any;
  ROYALTY_VAULT_ABI?: any;
}

export const ENVIRONMENTS = {
  DEVELOPMENT: {
    NAME: "DEVELOPMENT",
    AUTH_HUB_BASE_API:
      "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",
    AUTH_ENDPOINT: "auth-testnet",
    ORIGIN_DASHBOARD: "https://origin.campnetwork.xyz",
    DATANFT_CONTRACT_ADDRESS: "0x8EB0E8C3bA99c04F05ab01A5BED34F00c6c3BE4D",
    MARKETPLACE_CONTRACT_ADDRESS: "0x2947eE8a352158fda08F2cf5c0AE8e5b1DFCfDc9",
    CHAIN: testnet,
    IPNFT_ABI: ipnftMainnetAbi,
    MARKETPLACE_ABI: marketplaceMainnetAbi,
    ROYALTY_VAULT_ABI: royaltyVaultAbi,
  },
  PRODUCTION: {
    NAME: "PRODUCTION",
    AUTH_HUB_BASE_API:
      "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",
    AUTH_ENDPOINT: "auth-mainnet",
    ORIGIN_DASHBOARD: "https://origin.campnetwork.xyz",
    DATANFT_CONTRACT_ADDRESS: "0x54d8490f034e3A4D07CD220a7Dc88D9B91B82c25",
    MARKETPLACE_CONTRACT_ADDRESS: "0x5D2be63c94931f82B602Ecd1538064ab4196F8e7",
    CHAIN: mainnet,
    IPNFT_ABI: ipnftMainnetAbi,
    MARKETPLACE_ABI: marketplaceMainnetAbi,
    ROYALTY_VAULT_ABI: royaltyVaultAbi,
  },
} as { [key: string]: Environment };
