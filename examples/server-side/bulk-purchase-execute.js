/**
 * Example: Execute bulk purchase of IP-NFTs
 * 
 * This example shows how to execute a bulk purchase transaction
 * using the BatchPurchase contract.
 * 
 * Usage: PRIVATE_KEY=0x... node --experimental-fetch examples/server-side/bulk-purchase-execute.js
 */

import { createPublicClient, createWalletClient, http, formatEther, zeroAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { campTestnet, campMainnet } from "@campnetwork/origin";

// Configuration - Change these for your use case
const USE_TESTNET = true;
const chain = USE_TESTNET ? campTestnet : campMainnet;
const RPC_URL = USE_TESTNET 
  ? "https://rpc.basecamp.t.raas.gelato.cloud"
  : "https://rpc.camp.network"; // Update with actual mainnet RPC
const EXPLORER_URL = USE_TESTNET
  ? "https://basecamp.cloud.blockscout.com"
  : "https://camp.network"; // Update with actual mainnet explorer

// BatchPurchase contract addresses
const BATCH_PURCHASE_ADDRESS = USE_TESTNET
  ? "0xaF0cF04DBfeeAcEdC77Dc68A91381AFB967B8518"  // Testnet
  : "0x31885cD2A445322067dF890bACf6CeFE9b233BCC";  // Mainnet

const BATCH_PURCHASE_ABI = [
  {
    inputs: [
      { internalType: "address", name: "buyer", type: "address" },
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
    name: "bulkBuyAccess",
    outputs: [{ internalType: "uint256", name: "totalPaid", type: "uint256" }],
    stateMutability: "payable",
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
];

// Example token IDs - replace with your own
const TOKEN_IDS = [
  // Add your token IDs here as BigInt
  // Example: 85457687339203529094766949803543800638452443945411920803255506648043325123548n,
];

async function main() {
  // Validate inputs
  const privateKey = process.env.PRIVATE_KEY;
  if (!privateKey) {
    console.error("Error: PRIVATE_KEY environment variable not set");
    console.log("\nUsage: PRIVATE_KEY=0x... node --experimental-fetch examples/server-side/bulk-purchase-execute.js");
    process.exit(1);
  }

  if (TOKEN_IDS.length === 0) {
    console.log("Please add token IDs to the TOKEN_IDS array");
    process.exit(1);
  }

  const formattedKey = privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`;
  
  console.log("Executing Bulk Purchase\n");
  console.log("Network:", USE_TESTNET ? "Testnet" : "Mainnet");

  // Create account
  const account = privateKeyToAccount(formattedKey);
  console.log("Wallet:", account.address);

  // Create clients
  const publicClient = createPublicClient({
    chain,
    transport: http(RPC_URL),
  });

  const walletClient = createWalletClient({
    account,
    chain,
    transport: http(RPC_URL),
  });

  // Check balance
  const balance = await publicClient.getBalance({ address: account.address });
  console.log(`Balance: ${formatEther(balance)} CAMP\n`);

  // Get purchase params
  console.log("Fetching purchase parameters...");
  const params = await publicClient.readContract({
    address: BATCH_PURCHASE_ADDRESS,
    abi: BATCH_PURCHASE_ABI,
    functionName: "buildPurchaseParams",
    args: [TOKEN_IDS],
  });

  // Calculate total cost
  let totalCost = 0n;
  params.forEach((p, i) => {
    console.log(`  Token ${i + 1}: ${formatEther(p.expectedPrice)} CAMP`);
    if (p.expectedPaymentToken === zeroAddress) {
      totalCost += p.expectedPrice;
    }
  });
  
  console.log(`\nTotal Cost: ${formatEther(totalCost)} CAMP`);

  // Check balance
  if (balance < totalCost) {
    console.error(`\nInsufficient balance! Need ${formatEther(totalCost)} CAMP`);
    process.exit(1);
  }

  // Execute transaction
  console.log("\nExecuting bulkBuyAccess...");

  try {
    const hash = await walletClient.writeContract({
      address: BATCH_PURCHASE_ADDRESS,
      abi: BATCH_PURCHASE_ABI,
      functionName: "bulkBuyAccess",
      args: [account.address, params],
      value: totalCost,
    });

    console.log(`\nTransaction submitted: ${hash}`);
    console.log(`Explorer: ${EXPLORER_URL}/tx/${hash}`);

    console.log("\nWaiting for confirmation...");
    const receipt = await publicClient.waitForTransactionReceipt({ hash });

    if (receipt.status === "success") {
      console.log("\n=== PURCHASE SUCCESSFUL ===");
      console.log(`Block: ${receipt.blockNumber}`);
      console.log(`Gas Used: ${receipt.gasUsed}`);
      console.log(`IPs Purchased: ${TOKEN_IDS.length}`);
      console.log(`Total Paid: ${formatEther(totalCost)} CAMP`);
    } else {
      console.log("\nTransaction failed!");
    }
  } catch (error) {
    console.error("\nTransaction failed:", error.shortMessage || error.message);
  }
}

main().catch(console.error);

