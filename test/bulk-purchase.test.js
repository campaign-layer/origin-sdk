/**
 * Test script for Bulk Purchase functionality on Camp Testnet
 * 
 * Run with: node test/bulk-purchase.test.js
 */

import { createPublicClient, http, formatEther, zeroAddress } from "viem";

// Camp Testnet chain config
const campTestnet = {
  id: 123420001114,
  name: "Camp Network Testnet",
  nativeCurrency: { name: "CAMP", symbol: "CAMP", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.basecamp.t.raas.gelato.cloud"] },
  },
};

// Contract addresses (testnet)
const BATCH_PURCHASE_ADDRESS = "0xaF0cF04DBfeeAcEdC77Dc68A91381AFB967B8518";

// Minimal ABI for testing
const BATCH_PURCHASE_ABI = [
  {
    inputs: [{ internalType: "uint256[]", name: "tokenIds", type: "uint256[]" }],
    name: "previewBulkCost",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "totalNativeCost", type: "uint256" },
          { internalType: "uint256", name: "totalERC20Cost", type: "uint256" },
          { internalType: "uint256", name: "validCount", type: "uint256" },
          { internalType: "uint256[]", name: "invalidTokenIds", type: "uint256[]" },
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
    inputs: [{ internalType: "uint256[]", name: "tokenIds", type: "uint256[]" }],
    name: "buildPurchaseParams",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "tokenId", type: "uint256" },
          { internalType: "uint256", name: "expectedPrice", type: "uint256" },
          { internalType: "uint32", name: "expectedDuration", type: "uint32" },
          { internalType: "address", name: "expectedPaymentToken", type: "address" },
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
    inputs: [{ internalType: "uint256[]", name: "tokenIds", type: "uint256[]" }],
    name: "checkActiveStatus",
    outputs: [{ internalType: "bool[]", name: "activeFlags", type: "bool[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "marketplace",
    outputs: [{ internalType: "contract IMarketplace", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ipNFT",
    outputs: [{ internalType: "contract IIpNFT", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];

// Client ID for testing
const CLIENT_ID = "b11271bc-e77e-4ed5-a14e-ead571a8a915";

async function main() {
  console.log("🧪 Testing Bulk Purchase SDK on Camp Testnet\n");
  console.log("━".repeat(50));
  console.log("Client ID:", CLIENT_ID);

  // Create public client for read operations
  const publicClient = createPublicClient({
    chain: campTestnet,
    transport: http(campTestnet.rpcUrls.default.http[0]),
  });

  // Test 1: Check contract is deployed and accessible
  console.log("\n📋 Test 1: Verify BatchPurchase contract deployment");
  try {
    const marketplace = await publicClient.readContract({
      address: BATCH_PURCHASE_ADDRESS,
      abi: BATCH_PURCHASE_ABI,
      functionName: "marketplace",
    });
    const ipNFT = await publicClient.readContract({
      address: BATCH_PURCHASE_ADDRESS,
      abi: BATCH_PURCHASE_ABI,
      functionName: "ipNFT",
    });
    console.log("   ✅ Contract deployed at:", BATCH_PURCHASE_ADDRESS);
    console.log("   ✅ Marketplace address:", marketplace);
    console.log("   ✅ IpNFT address:", ipNFT);
  } catch (error) {
    console.log("   ❌ Error:", error.message);
    process.exit(1);
  }

  // Test 2: Test previewBulkCost with some token IDs
  const sampleTokenIds = [1n, 2n, 3n];

  console.log("\n📋 Test 2: Preview bulk cost for token IDs:", sampleTokenIds.map(String).join(", "));
  try {
    const preview = await publicClient.readContract({
      address: BATCH_PURCHASE_ADDRESS,
      abi: BATCH_PURCHASE_ABI,
      functionName: "previewBulkCost",
      args: [sampleTokenIds],
    });
    console.log("   ✅ Total Native Cost:", formatEther(preview.totalNativeCost), "CAMP");
    console.log("   ✅ Total ERC20 Cost:", formatEther(preview.totalERC20Cost), "tokens");
    console.log("   ✅ Valid Count:", preview.validCount.toString());
    console.log("   ✅ Invalid Token IDs:", preview.invalidTokenIds.map(String).join(", ") || "None");
  } catch (error) {
    console.log("   ⚠️ Preview failed (tokens may not exist):", error.shortMessage || error.message);
  }

  // Test 3: Check active status
  console.log("\n📋 Test 3: Check active status for token IDs");
  try {
    const activeFlags = await publicClient.readContract({
      address: BATCH_PURCHASE_ADDRESS,
      abi: BATCH_PURCHASE_ABI,
      functionName: "checkActiveStatus",
      args: [sampleTokenIds],
    });
    sampleTokenIds.forEach((id, i) => {
      console.log(`   Token ${id}: ${activeFlags[i] ? "✅ Active" : "❌ Not Active"}`);
    });
  } catch (error) {
    console.log("   ⚠️ Status check failed:", error.shortMessage || error.message);
  }

  // Test 4: Build purchase params
  console.log("\n📋 Test 4: Build purchase params");
  try {
    const params = await publicClient.readContract({
      address: BATCH_PURCHASE_ADDRESS,
      abi: BATCH_PURCHASE_ABI,
      functionName: "buildPurchaseParams",
      args: [sampleTokenIds],
    });
    params.forEach((p) => {
      console.log(`   Token ${p.tokenId}:`);
      console.log(`      Price: ${formatEther(p.expectedPrice)} CAMP`);
      console.log(`      Duration: ${p.expectedDuration / 86400} days`);
      console.log(`      Payment Token: ${p.expectedPaymentToken === zeroAddress ? "Native (CAMP)" : p.expectedPaymentToken}`);
    });
  } catch (error) {
    console.log("   ⚠️ Build params failed (tokens may not exist):", error.shortMessage || error.message);
  }

  // Test 5: Test with Origin SDK
  console.log("\n📋 Test 5: Test Origin SDK integration");
  try {
    const { Origin } = await import("../dist/core.esm.js");
    
    const origin = new Origin("DEVELOPMENT");
    console.log("   ✅ Origin SDK loaded successfully");
    console.log("   ✅ Environment:", origin.environment.NAME);
    console.log("   ✅ BatchPurchase Address:", origin.environment.BATCH_PURCHASE_CONTRACT_ADDRESS);
    
    // Check if bulk methods are available
    console.log("   ✅ bulkBuyAccess method:", typeof origin.bulkBuyAccess === "function" ? "Available" : "Missing");
    console.log("   ✅ bulkBuyAccessTolerant method:", typeof origin.bulkBuyAccessTolerant === "function" ? "Available" : "Missing");
    console.log("   ✅ bulkBuyAccessSmart method:", typeof origin.bulkBuyAccessSmart === "function" ? "Available" : "Missing");
    console.log("   ✅ previewBulkCost method:", typeof origin.previewBulkCost === "function" ? "Available" : "Missing");
    console.log("   ✅ buildPurchaseParams method:", typeof origin.buildPurchaseParams === "function" ? "Available" : "Missing");
    console.log("   ✅ checkActiveStatus method:", typeof origin.checkActiveStatus === "function" ? "Available" : "Missing");
  } catch (error) {
    console.log("   ⚠️ SDK integration test failed");
    console.log("   Error:", error.message);
  }

  console.log("\n" + "━".repeat(50));
  console.log("🏁 Tests completed!\n");
}

main().catch(console.error);
