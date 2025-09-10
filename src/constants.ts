import { mainnet, testnet } from "./core/auth/viem/chains";

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
  MIN_LICENSE_DURATION: 3600, // 1 hour in seconds
};

export interface Environment {
  NAME: string;
  AUTH_HUB_BASE_API: string;
  ORIGIN_DASHBOARD: string;
  DATANFT_CONTRACT_ADDRESS: string;
  MARKETPLACE_CONTRACT_ADDRESS: string;
  CHAIN: any;
}

export const ENVIRONMENTS = {
  DEVELOPMENT: {
    NAME: "DEVELOPMENT",
    AUTH_HUB_BASE_API:
      "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",
    ORIGIN_DASHBOARD: "https://origin.campnetwork.xyz",
    DATANFT_CONTRACT_ADDRESS: "0xF90733b9eCDa3b49C250B2C3E3E42c96fC93324E",
    MARKETPLACE_CONTRACT_ADDRESS: "0x5c5e6b458b2e3924E7688b8Dee1Bb49088F6Fef5",
    CHAIN: testnet,
  },
  PRODUCTION: {
    NAME: "PRODUCTION",
    AUTH_HUB_BASE_API:
      "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev", // to be updated
    ORIGIN_DASHBOARD: "https://origin.campnetwork.xyz",
    DATANFT_CONTRACT_ADDRESS: "0xF90733b9eCDa3b49C250B2C3E3E42c96fC93324E", // to be updated
    MARKETPLACE_CONTRACT_ADDRESS: "0x5c5e6b458b2e3924E7688b8Dee1Bb49088F6Fef5", // to be updated
    CHAIN: mainnet,
  },
};
