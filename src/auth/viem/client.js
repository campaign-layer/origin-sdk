import { createWalletClient, custom } from "viem";
import { testnet } from "./chains";
let client = null;

const getClient = () => {
  if (!client) {
    client = createWalletClient({
      chain: testnet,
      transport: custom(window.ethereum),
    });
  }
  return client;
};
export { getClient };
