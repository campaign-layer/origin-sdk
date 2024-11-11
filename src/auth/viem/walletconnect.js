import { useState, useEffect } from "react";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { testnet } from "./chains";

const getWalletConnectProvider = async (projectId) => {
  const provider = await EthereumProvider.init({
    chains: [testnet.id],
    projectId,
    showQrModal: true,
  });
  return provider;
};

export const useWalletConnectProvider = (projectId) => {
  const [walletConnectProvider, setWalletConnectProvider] = useState(null);

  useEffect(() => {
    const fetchWalletConnectProvider = async () => {
      try {
        const provider = await getWalletConnectProvider(projectId);
        setWalletConnectProvider(provider);
      } catch (error) {
        console.error("Error getting WalletConnect provider:", error);
      }
    };

    fetchWalletConnectProvider();
  }, []);

  return walletConnectProvider;
};
