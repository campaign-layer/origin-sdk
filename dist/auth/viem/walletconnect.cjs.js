'use strict';

var react = require('react');
var ethereumProvider = require('@walletconnect/ethereum-provider');

const testnet = {
  id: 325000,
  name: "Camp Network Testnet V2",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH"
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-campnetwork.xyz"]
    }
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://camp-network-testnet.blockscout.com"
    }
  }
};

const getWalletConnectProvider = async projectId => {
  const provider = await ethereumProvider.EthereumProvider.init({
    optionalChains: [testnet.id],
    projectId,
    showQrModal: true,
    methods: ["personal_sign"]
  });
  return provider;
};
const useWalletConnectProvider = projectId => {
  const [walletConnectProvider, setWalletConnectProvider] = react.useState(null);
  react.useEffect(() => {
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

exports.useWalletConnectProvider = useWalletConnectProvider;
