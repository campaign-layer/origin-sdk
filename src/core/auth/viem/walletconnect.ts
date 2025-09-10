import { useState, useEffect } from "react";

const getWalletConnectProvider = async (
  projectId: string,
  chain: any
): Promise<any> => {
  const { EthereumProvider } = await import("@walletconnect/ethereum-provider");
  const provider = await EthereumProvider.init({
    optionalChains: [chain.id],
    chains: [chain.id],
    projectId,
    showQrModal: true,
    methods: ["personal_sign"],
  });
  return provider;
};

export const useWalletConnectProvider = (
  projectId: string,
  chain: any
): any | null => {
  const [walletConnectProvider, setWalletConnectProvider] = useState<
    any | null
  >(null);

  useEffect(() => {
    const fetchWalletConnectProvider = async () => {
      try {
        const provider = await getWalletConnectProvider(projectId, chain);
        setWalletConnectProvider(provider);
      } catch (error) {
        console.error("Error getting WalletConnect provider:", error);
      }
    };

    fetchWalletConnectProvider();
  }, [projectId]);

  return walletConnectProvider;
};
