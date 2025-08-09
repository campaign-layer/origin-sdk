import { WalletClient, type PublicClient } from "viem";
declare const getClient: (provider: any, name?: string, address?: string) => WalletClient | null;
declare const getPublicClient: () => PublicClient;
export { getClient, getPublicClient };
