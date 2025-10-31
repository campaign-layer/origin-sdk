import { mainnet, testnet } from "./core/auth/viem/chains";

import ipnftMainnetAbi from "./core/origin/contracts/mainnet/IPNFT.json";
import marketplaceMainnetAbi from "./core/origin/contracts/mainnet/Marketplace.json";
import royaltyVaultAbi from "./core/origin/contracts/mainnet/RoyaltyVault.json";
import tbaAbi from "./core/origin/contracts/mainnet/TBA.json";

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
  TBA_ABI?: any;
}

export const ENVIRONMENTS = {
  DEVELOPMENT: {
    NAME: "DEVELOPMENT",
    AUTH_HUB_BASE_API:
      "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",
    AUTH_ENDPOINT: "auth-testnet",
    ORIGIN_DASHBOARD: "https://origin.campnetwork.xyz",
    DATANFT_CONTRACT_ADDRESS: "0xB53F5723Dd4E46da32e1769Bd36A5aD880e707A5",
    MARKETPLACE_CONTRACT_ADDRESS: "0x97b0A18B2888e904940fFd19E480a28aeec3F055",
    CHAIN: testnet,
    IPNFT_ABI: ipnftMainnetAbi,
    MARKETPLACE_ABI: marketplaceMainnetAbi,
    ROYALTY_VAULT_ABI: royaltyVaultAbi,
    TBA_ABI: tbaAbi,
  },
  PRODUCTION: {
    NAME: "PRODUCTION",
    AUTH_HUB_BASE_API:
      "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",
    AUTH_ENDPOINT: "auth-mainnet",
    ORIGIN_DASHBOARD: "https://origin.campnetwork.xyz",
    DATANFT_CONTRACT_ADDRESS: "0x39EeE1C3989f0dD543Dee60f8582F7F81F522C38",
    MARKETPLACE_CONTRACT_ADDRESS: "0xc69BAa987757d054455fC0f2d9797684E9FB8b9C",
    CHAIN: mainnet,
    IPNFT_ABI: ipnftMainnetAbi,
    MARKETPLACE_ABI: marketplaceMainnetAbi,
    ROYALTY_VAULT_ABI: royaltyVaultAbi,
    TBA_ABI: tbaAbi,
  },
} as { [key: string]: Environment };
