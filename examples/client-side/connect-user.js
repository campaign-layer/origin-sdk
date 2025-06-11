import { Auth } from "@campnetwork/origin";

// Create a new Auth instance
const auth = new Auth({
  clientId: process.env.CAMP_CLIENT_ID,
});

// Prompt the user to connect to the Camp Auth Hub via the default provider (window.ethereum)
// (call auth.connect() before a provider is set to connect via the default provider)
const connectDefault = async () => {
  if (!auth.isAuthenticated) auth.connect();
};

// Listen for the available providers
let providers = [];
auth.on("providers", (p) => {
  providers = p;
});

// Prompt the user to connect to the Camp Auth Hub via a specific provider
const connectViaRainbow = async () => {
  if (!auth.isAuthenticated) {
    const provider = providers.find((p) => p.info.name === "Rainbow");
    auth.setProvider(provider);
    auth.connect();
  }
};
