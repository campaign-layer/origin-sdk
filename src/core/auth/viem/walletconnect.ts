import { useState, useEffect } from "react";
import { testnet } from "./chains";

const getWalletConnectProvider = async (projectId: string): Promise<any> => {
  const { EthereumProvider } = await import("@walletconnect/ethereum-provider");
  const provider = await EthereumProvider.init({
    optionalChains: [testnet.id],
    chains: [testnet.id],
    projectId,
    showQrModal: true,
    methods: ["personal_sign"],
  });
  return provider;
};

export const useWalletConnectProvider = (projectId: string): any | null => {
  const [walletConnectProvider, setWalletConnectProvider] = useState<
    any | null
  >(null);

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
  }, [projectId]);

  return walletConnectProvider;
};
