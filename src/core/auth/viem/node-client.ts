import { createWalletClient, http, WalletClient, Chain, Account } from "viem";

/**
 * Create a wallet client for Node.js environment
 * @param account The viem account
 * @param chain The chain to use
 * @param rpcUrl Optional RPC URL (defaults to chain's default RPC)
 * @returns WalletClient
 */
export function createNodeWalletClient(
  account: Account,
  chain: Chain,
  rpcUrl?: string
): WalletClient {
  return createWalletClient({
    account,
    chain,
    transport: http(rpcUrl),
  });
}
