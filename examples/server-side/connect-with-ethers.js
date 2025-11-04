// Example: Connect to Origin SDK using ethers v6 Signer in Node.js

import { Auth, campMainnet } from "@campnetwork/origin";
import { ethers } from "ethers";

// Setup ethers provider and signer
const provider = new ethers.JsonRpcProvider(
  campMainnet.rpcUrls.default.http[0]
);
const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Create Auth instance
const auth = new Auth({
  clientId: process.env.CLIENT_ID,
  redirectUri: process.env.REDIRECT_URI || "https://myapp.com/callback",
  environment: "PRODUCTION",
});

// Connect using ethers signer
async function main() {
  try {
    const result = await auth.connectWithSigner(signer, {
      domain: "myapp.com",
      uri: "https://myapp.com",
    });

    console.log("Connected!", result);
    console.log("Wallet Address:", result.walletAddress);
    console.log("Authenticated:", auth.isAuthenticated);

    // Now you can use origin methods
    if (auth.origin) {
      // Example: Get terms for an IP NFT
      // const terms = await auth.origin.getTerms(tokenId);
      // console.log('Terms:', terms);
    }
  } catch (error) {
    console.error("Failed to connect:", error);
  }
}

main();
