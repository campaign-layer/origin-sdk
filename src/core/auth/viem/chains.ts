export const testnet = {
  id: 123420001114,
  name: "Basecamp",
  nativeCurrency: {
    decimals: 18,
    name: "Camp",
    symbol: "CAMP",
  },
  rpcUrls: {
    default: {
      http: [
        "https://rpc-campnetwork.xyz",
        "https://rpc.basecamp.t.raas.gelato.cloud",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://basecamp.cloud.blockscout.com/",
    },
  },
};

export const mainnet = {
  id: 484,
  name: "Camp Network",
  nativeCurrency: {
    decimals: 18,
    name: "Camp",
    symbol: "CAMP",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.camp.raas.gelato.cloud/"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://camp.cloud.blockscout.com/",
    },
  },
};
