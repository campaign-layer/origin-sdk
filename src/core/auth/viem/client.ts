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
  Chain,
} from "viem";
import { mainnet, testnet } from "./chains";
import { toAccount } from "viem/accounts";
let client: any = null;
let publicClient: PublicClient | null = null;
let currentChain: Chain | null = null;

const getClient = (
  provider: any,
  name: string = "window.ethereum",
  chain?: Chain,
  address?: string
): WalletClient | null => {
  if (!provider && !client) {
    console.warn("Provider is required to create a client.");
    return null;
  }
  const selectedChain = chain || testnet;

  if (
    !client ||
    (client.transport.name !== name && provider) ||
    (address !== client.account?.address && provider) ||
    currentChain?.id !== selectedChain.id
  ) {
    const obj = {
      chain: selectedChain,
      transport: custom(provider, {
        name: name,
      }),
    } as WalletClientConfig;
    if (address) {
      obj.account = toAccount(address as Address);
    }
    client = createWalletClient(obj);
    currentChain = selectedChain;

    if (publicClient && publicClient.chain?.id !== selectedChain.id) {
      publicClient = null;
    }
  }
  return client;
};

const getPublicClient = (chain?: Chain): PublicClient => {
  const selectedChain = chain || currentChain || testnet;

  if (!publicClient || publicClient.chain?.id !== selectedChain.id) {
    publicClient = createPublicClient({
      chain: selectedChain,
      transport: http(),
    });
  }
  return publicClient;
};

const setChain = (chain: Chain) => {
  currentChain = chain;
  publicClient = null; // reset public client to be recreated with new chain
};

export { getClient, getPublicClient, setChain };
