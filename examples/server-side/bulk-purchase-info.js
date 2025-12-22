/**
 * Example: Fetch IP-NFT information before bulk purchase
 *
 * This example shows how to:
 * - Check if tokens are active
 * - Preview bulk purchase costs
 * - Build purchase parameters
 *
 * Usage: node --experimental-fetch examples/server-side/bulk-purchase-info.js
 */

import { createPublicClient, http, formatEther, zeroAddress } from "viem";
import { campTestnet, campMainnet } from "@campnetwork/origin";

// Configuration - Change these for your use case
const USE_TESTNET = true;
const chain = USE_TESTNET ? campTestnet : campMainnet;
const RPC_URL = USE_TESTNET
  ? "https://rpc.basecamp.t.raas.gelato.cloud"
  : "https://rpc.camp.network"; // Update with actual mainnet RPC

// BatchPurchase contract addresses
const BATCH_PURCHASE_ADDRESS = USE_TESTNET
  ? "0xaF0cF04DBfeeAcEdC77Dc68A91381AFB967B8518" // Testnet
  : "0x31885cD2A445322067dF890bACf6CeFE9b233BCC"; // Mainnet

const BATCH_PURCHASE_ABI = [
  {
    inputs: [
      { internalType: "uint256[]", name: "tokenIds", type: "uint256[]" },
    ],
    name: "previewBulkCost",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "totalNativeCost", type: "uint256" },
          { internalType: "uint256", name: "totalERC20Cost", type: "uint256" },
          { internalType: "uint256", name: "validCount", type: "uint256" },
          {
            internalType: "uint256[]",
            name: "invalidTokenIds",
            type: "uint256[]",
          },
        ],
        internalType: "struct IBatchPurchase.BulkCostPreview",
        name: "preview",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "tokenIds", type: "uint256[]" },
    ],
    name: "buildPurchaseParams",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "expectedPrice", type: "uint256" },
          { internalType: "uint32", name: "expectedDuration", type: "uint32" },
          {
            internalType: "address",
            name: "expectedPaymentToken",
            type: "address",
          },
        ],
        internalType: "struct IBatchPurchase.BuyParams[]",
        name: "purchases",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "uint256[]", name: "tokenIds", type: "uint256[]" },
    ],
    name: "checkActiveStatus",
    outputs: [{ internalType: "bool[]", name: "activeFlags", type: "bool[]" }],
    stateMutability: "view",
    type: "function",
  },
];

// Example token IDs - replace with your own
const TOKEN_IDS = [
  // Add your token IDs here as BigInt
  // Example: 85457687339203529094766949803543800638452443945411920803255506648043325123548n,
];

async function main() {
  if (TOKEN_IDS.length === 0) {
    console.log("Please add token IDs to the TOKEN_IDS array");
    process.exit(1);
  }

  console.log("Fetching IP-NFT details...\n");
  console.log("Network:", USE_TESTNET ? "Testnet" : "Mainnet");
  console.log("Token IDs:", TOKEN_IDS.length);

  const client = createPublicClient({
    chain,
    transport: http(RPC_URL),
  });

  // 1. Check active status
  console.log("\n--- Active Status ---");
  try {
    const activeFlags = await client.readContract({
      address: BATCH_PURCHASE_ADDRESS,
      abi: BATCH_PURCHASE_ABI,
      functionName: "checkActiveStatus",
      args: [TOKEN_IDS],
    });

    TOKEN_IDS.forEach((id, i) => {
      console.log(`Token ${id}: ${activeFlags[i] ? "ACTIVE" : "NOT ACTIVE"}`);
    });
  } catch (error) {
    console.log("Error:", error.shortMessage || error.message);
  }

  // 2. Preview bulk cost
  console.log("\n--- Bulk Cost Preview ---");
  try {
    const preview = await client.readContract({
      address: BATCH_PURCHASE_ADDRESS,
      abi: BATCH_PURCHASE_ABI,
      functionName: "previewBulkCost",
      args: [TOKEN_IDS],
    });

    console.log(
      `Total Native Cost: ${formatEther(preview.totalNativeCost)} CAMP`
    );
    console.log(
      `Total ERC20 Cost: ${formatEther(preview.totalERC20Cost)} tokens`
    );
    console.log(`Valid Count: ${preview.validCount}`);
    console.log(
      `Invalid Tokens: ${
        preview.invalidTokenIds.length > 0
          ? preview.invalidTokenIds.join(", ")
          : "None"
      }`
    );
  } catch (error) {
    console.log("Error:", error.shortMessage || error.message);
  }

  // 3. Build purchase params
  console.log("\n--- Purchase Parameters ---");
  try {
    const params = await client.readContract({
      address: BATCH_PURCHASE_ADDRESS,
      abi: BATCH_PURCHASE_ABI,
      functionName: "buildPurchaseParams",
      args: [TOKEN_IDS],
    });

    params.forEach((p, i) => {
      console.log(`\nToken #${i + 1}:`);
      console.log(`  ID: ${p.tokenId}`);
      console.log(`  Price: ${formatEther(p.expectedPrice)} CAMP`);
      console.log(`  Duration: ${p.expectedDuration / 86400} days`);
      console.log(
        `  Payment: ${
          p.expectedPaymentToken === zeroAddress
            ? "Native (CAMP)"
            : p.expectedPaymentToken
        }`
      );
    });
  } catch (error) {
    console.log("Error:", error.shortMessage || error.message);
  }
}

main().catch(console.error);
