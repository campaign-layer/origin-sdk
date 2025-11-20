import { Origin } from ".";
import {
  Address,
  TypedDataDomain,
  checksumAddress,
  zeroAddress,
  keccak256,
  toBytes,
} from "viem";
import { createSignerAdapter, SignerAdapter } from "../auth/signers";
import { X402_INTENT_TYPES } from "./utils";

/**
 * Fetch data with X402 payment handling.
 * @param {bigint} tokenId The token ID to fetch data for.
 * @param {any} [signer] Optional signer object for signing the X402 intent.
 * @returns {Promise<any>} A promise that resolves with the fetched data.
 * @throws {Error} Throws an error if the data cannot be fetched or if no signer/wallet client is provided.
 */
export async function getDataWithX402(
  this: Origin,
  tokenId: bigint,
  signer?: any
): Promise<any> {
  const viemClient = (this as any).viemClient;

  if (!signer && !viemClient) {
    throw new Error("No signer or wallet client provided for X402 intent.");
  }

  const initialResponse = await fetch(
    `${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/data/${tokenId}`,
    {
      method: "GET",
    }
  );

  if (initialResponse.status !== 402) {
    if (!initialResponse.ok) {
      throw new Error("Failed to fetch data");
    }
    return initialResponse.json();
  }

  const sig = viemClient || createSignerAdapter(signer);
  const walletAddress = viemClient
    ? await getCurrentAccount.call(this)
    : await (sig as SignerAdapter).getAddress();

  const intentData = await initialResponse.json();
  if (intentData.error) {
    throw new Error(intentData.error);
  }

  const requirements = intentData.accepts[0];

  const x402Payload = await buildX402Payload.call(
    this,
    requirements,
    checksumAddress(walletAddress as `0x${string}`) as Address,
    sig
  );
  const header = btoa(JSON.stringify(x402Payload));

  const retryResponse = await fetch(
    `${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/data/${tokenId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-PAYMENT": header,
      },
    }
  );

  if (retryResponse.status === 402) {
    // subscription required
    return retryResponse.json();
  }

  if (!retryResponse.ok) {
    throw new Error("Failed to fetch data after X402 payment");
  }

  const res = await retryResponse.json();
  return {
    error: null,
    data: res.data ?? res,
  };
}

/**
 * Build the X402 payment payload.
 * @private
 */
async function buildX402Payload(
  this: Origin,
  requirements: any,
  payer: Address,
  signer: any
): Promise<any> {
  const asset =
    requirements.asset === "native" ? zeroAddress : requirements.asset;
  const amount = BigInt(requirements.maxAmountRequired || 0);
  const duration = requirements.extra.duration;
  const domain = makeX402IntentDomain.call(this);
  const types = X402_INTENT_TYPES;
  const nonce = crypto.randomUUID();
  const nonceBytes32 = keccak256(toBytes(nonce));
  const payment = {
    payer: payer,
    asset: asset,
    amount: amount.toString(),
    httpMethod: "GET",
    payTo: checksumAddress(
      this.environment.MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`
    ) as Address,
    tokenId: requirements.extra.tokenId,
    duration: duration,
    expiresAt: Math.floor(Date.now() / 1000) + requirements.maxTimeoutSeconds,
    nonce: nonceBytes32,
  };
  const signerAdapter = createSignerAdapter(signer);
  const signature = await signerAdapter.signTypedData(domain, types, payment);

  const x402Payload = {
    x402Version: 1,
    scheme: "exact",
    network: requirements.network,
    payload: {
      ...payment,
      sigType: "eip712",
      signature: signature,
      license: {
        tokenId: requirements.extra.tokenId,
        duration: duration,
      },
    },
  };
  return x402Payload;
}

/**
 * Create the X402 Intent domain for EIP-712 signing.
 * @private
 */
function makeX402IntentDomain(this: Origin): TypedDataDomain {
  return {
    name: "Origin X402 Intent",
    version: "1",
    chainId: this.environment.CHAIN.id,
    verifyingContract: this.environment
      .MARKETPLACE_CONTRACT_ADDRESS as `0x${string}`,
  };
}

/**
 * Get the current account address.
 * @private
 */
async function getCurrentAccount(this: Origin): Promise<string> {
  const viemClient = (this as any).viemClient;

  if (!viemClient) {
    throw new Error("WalletClient not connected. Please connect a wallet.");
  }

  // If account is already set on the client, return it directly
  if (viemClient.account) {
    return viemClient.account.address;
  }

  // Otherwise request accounts (browser wallet flow)
  const accounts = await viemClient.request({
    method: "eth_requestAccounts",
    params: [] as any,
  });
  if (!accounts || accounts.length === 0) {
    throw new Error("No accounts found in connected wallet.");
  }
  return accounts[0];
}
