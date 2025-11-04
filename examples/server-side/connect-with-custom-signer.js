// Example: Custom signer implementation for Origin SDK

import { Auth } from "@campnetwork/origin";

// Custom signer class that implements the required interface
class CustomSigner {
  constructor(privateKey, rpcUrl) {
    this.privateKey = privateKey;
    this.rpcUrl = rpcUrl;
    this.address = null; // Set this based on your implementation
  }

  async getAddress() {
    // Implement: Return the wallet address
    return this.address;
  }

  async signMessage(message) {
    // Implement: Sign the message with your private key
    // Return the signature as a hex string
    return "0x...";
  }

  async getChainId() {
    // Implement: Return the chain ID
    return 484; // camp network chain ID
  }
}

// Create Auth instance
const auth = new Auth({
  clientId: process.env.CLIENT_ID,
  redirectUri: "https://myapp.com/callback",
  environment: "PRODUCTION",
});

// Use custom signer
async function main() {
  const signer = new CustomSigner(process.env.PRIVATE_KEY, process.env.RPC_URL);

  try {
    const result = await auth.connectWithSigner(signer, {
      domain: "myapp.com",
      uri: "https://myapp.com",
    });

    console.log("Connected with custom signer!", result);
  } catch (error) {
    console.error("Failed to connect:", error);
  }
}

main();
