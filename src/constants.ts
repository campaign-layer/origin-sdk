import { mainnet, testnet } from "./core/auth/viem/chains";

import ipnftMainnetAbi from "./core/origin/contracts/mainnet/IPNFT.json";
import marketplaceMainnetAbi from "./core/origin/contracts/mainnet/Marketplace.json";

export default {
  SIWE_MESSAGE_STATEMENT: "Connect with Camp Network",
  AUTH_HUB_BASE_API:
    "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",
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
  ACKEE_INSTANCE: "https://ackee-production-01bd.up.railway.app",
  ACKEE_EVENTS: {
    USER_CONNECTED: "ed42542d-b676-4112-b6d9-6db98048b2e0",
    USER_DISCONNECTED: "20af31ac-e602-442e-9e0e-b589f4dd4016",
    TWITTER_LINKED: "7fbea086-90ef-4679-ba69-f47f9255b34c",
    DISCORD_LINKED: "d73f5ae3-a8e8-48f2-8532-85e0c7780d6a",
    SPOTIFY_LINKED: "fc1788b4-c984-42c8-96f4-c87f6bb0b8f7",
    TIKTOK_LINKED: "4a2ffdd3-f0e9-4784-8b49-ff76ec1c0a6a",
    TELEGRAM_LINKED: "9006bc5d-bcc9-4d01-a860-4f1a201e8e47",
  },
  DATANFT_CONTRACT_ADDRESS: "0xF90733b9eCDa3b49C250B2C3E3E42c96fC93324E",
  MARKETPLACE_CONTRACT_ADDRESS: "0x5c5e6b458b2e3924E7688b8Dee1Bb49088F6Fef5",
  MAX_LICENSE_DURATION: 2628000, // 30 days in seconds
  MIN_LICENSE_DURATION: 86400, // 1 day in seconds
  MIN_PRICE: 1000000000000000, // 0.001 ETH in wei
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
}

export const ENVIRONMENTS = {
  DEVELOPMENT: {
    NAME: "DEVELOPMENT",
    AUTH_HUB_BASE_API:
      "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",
    AUTH_ENDPOINT: "auth-testnet",
    ORIGIN_DASHBOARD: "https://origin.campnetwork.xyz",
    DATANFT_CONTRACT_ADDRESS: "0x57346ed72A6e0f9D56b52f050c61803fF7d107E4",
    MARKETPLACE_CONTRACT_ADDRESS: "0xb9f217362Fbef0f1384E5a25a66EFF933cdf4201",
    CHAIN: testnet,
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
  },
} as { [key: string]: Environment };
