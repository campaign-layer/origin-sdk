// Example: Query blockchain data using viem in Node.js

import { Auth, createNodeWalletClient, campMainnet } from "@campnetwork/origin";
import { privateKeyToAccount } from "viem/accounts";

const account = privateKeyToAccount(process.env.PRIVATE_KEY);
const client = createNodeWalletClient(
  account,
  campMainnet,
  campMainnet.rpcUrls.default.http[0]
);

const auth = new Auth({
  clientId: process.env.CLIENT_ID,
  redirectUri: "https://myapp.com/callback",
  environment: "PRODUCTION",
});

async function queryOriginData() {
  try {
    // Connect
    await auth.connectWithSigner(client, {
      domain: "myapp.com",
      uri: "https://myapp.com",
    });

    console.log("Connected as:", account.address);

    // Example token ID to query
    const tokenId = BigInt(1);

    // Query various data about the IP NFT
    console.log("\nQuerying IP NFT data...");

    // 1. Get owner
    const owner = await auth.origin.ownerOf(tokenId);
    console.log("Owner:", owner);

    // 2. Get license terms
    const terms = await auth.origin.getTerms(tokenId);
    console.log("License Terms:", {
      mintPrice: terms.mintPrice.toString(),
      royalty: terms.royalty,
      accessPrice: terms.accessPrice.toString(),
      accessDuration: terms.accessDuration,
    });

    // 3. Check if user has access
    const hasAccess = await auth.origin.hasAccess(tokenId, account.address);
    console.log("User has access:", hasAccess);

    // 4. Get subscription expiry if user has access
    if (hasAccess) {
      const expiry = await auth.origin.subscriptionExpiry(
        tokenId,
        account.address
      );
      console.log(
        "Subscription expires:",
        new Date(Number(expiry) * 1000).toISOString()
      );
    }

    // 5. Get token URI
    const uri = await auth.origin.tokenURI(tokenId);
    console.log("Token URI:", uri);

    // 6. Get balance (how many of this token the user owns)
    const balance = await auth.origin.balanceOf(account.address, tokenId);
    console.log("User balance:", balance.toString());

    // 7. Check data status
    const status = await auth.origin.dataStatus(tokenId);
    console.log("Data status:", status);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

queryOriginData();
