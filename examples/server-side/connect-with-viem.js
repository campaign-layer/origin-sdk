// Example: Connect to Origin SDK using viem in Node.js

import {
  Auth,
  createNodeWalletClient,
  campMainnet,
  campTestnet,
} from "@campnetwork/origin";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

// Create viem account from private key
const account = privateKeyToAccount(process.env.PRIVATE_KEY);

// Use Camp Network mainnet chain (or campTestnet for testing)
const client = createWalletClient({
  account,
  chain: campMainnet,
  transport: http(campMainnet.rpcUrls.default.http[0]),
});

// Or use the helper function:
// const client = createNodeWalletClient(account, campMainnet, process.env.RPC_URL);

// Create Auth instance
const auth = new Auth({
  clientId: process.env.CLIENT_ID,
  redirectUri: "https://myapp.com/callback",
  environment: "PRODUCTION",
});

// Connect using viem client
async function main() {
  try {
    const result = await auth.connectWithSigner(client, {
      domain: "myapp.com",
      uri: "https://myapp.com",
    });

    console.log("Connected!", result);
    console.log("Wallet Address:", result.walletAddress);
    console.log("Authenticated:", auth.isAuthenticated);

    // Now you can use origin methods
    if (auth.origin) {
      // Example: Check if user has access to an IP NFT
      // const hasAccess = await auth.origin.hasAccess(ipId, account.address);
      // console.log('Has Access:', hasAccess);
    }
  } catch (error) {
    console.error("Failed to connect:", error);
  }
}

main();
