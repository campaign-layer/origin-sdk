import { Auth } from "@campnetwork/origin";

// Create a new Auth instance
const auth = new Auth({
  clientId: process.env.CAMP_CLIENT_ID,
});

// Subscribe to EIP6963 injected provider events
auth.on("providers", (providers) => {
  console.log("injected providers", providers);
});

// Subscribe to provider change events
auth.on("provider", (provider) => {
  console.log("provider set to", provider);
});

// Subscribe to authentication state change events
auth.on("state", (state) => {
  console.log("auth state", state);
});
