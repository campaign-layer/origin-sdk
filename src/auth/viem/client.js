import { createWalletClient, custom } from "viem";
import { testnet } from "./chains";
let client = null;

const getClient = (provider, name = "window.ethereum") => {
  if (!provider && !client) {
    console.warn("Provider is required to create a client.");
    return null;
  }
  if (!client || (client.transport.name !== name && provider)) {
    client = createWalletClient({
      chain: testnet,
      transport: custom(provider, {
        name: name,
      }),
    });
  }
  return client;
};
export { getClient };
