// @ts-ignore
import {
  Address,
  createWalletClient,
  custom,
  WalletClient,
  WalletClientConfig,
  createPublicClient,
  type PublicClient,
  http,
} from "viem";
import { mainnet, testnet } from "./chains";
import { toAccount } from "viem/accounts";
let client: any = null;
let publicClient: PublicClient | null = null;

const getClient = (
  provider: any,
  name: string = "window.ethereum",
  chain: "mainnet" | "testnet" = "testnet",
  address?: string
): WalletClient | null => {
  if (!provider && !client) {
    console.warn("Provider is required to create a client.");
    return null;
  }
  if (
    !client ||
    (client.transport.name !== name && provider) ||
    (address !== client.account?.address && provider)
  ) {
    const obj = {
      chain: chain === "mainnet" ? mainnet : testnet,
      transport: custom(provider, {
        name: name,
      }),
    } as WalletClientConfig;
    if (address) {
      obj.account = toAccount(address as Address);
    }
    client = createWalletClient(obj);
  }
  return client;
};

const getPublicClient = (): PublicClient => {
  if (!publicClient) {
    publicClient = createPublicClient({
      chain: testnet,
      transport: http(),
    });
  }
  return publicClient;
};
export { getClient, getPublicClient };
