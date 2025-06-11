import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CampProvider } from "@campnetwork/origin/react";
import { createAppKit } from "@reown/appkit/react";
import { WagmiProvider } from "wagmi";
import { mainnet } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import App from "./App.jsx";

const queryClient = new QueryClient();

// Get projectId from https://cloud.reown.com
const wcProjectId = "your-wc-project-id";

// Create a metadata object - optional
const metadata = {
  name: "Camp SDK x AppKit",
  description: "A simple example of using the Camp SDK with AppKit",
  url: "https://example.com", // origin must match your domain & subdomain
  icons: ["https://imgur.com/7nLZezD.png"],
};

// Set the networks
const networks = [mainnet];

// Create Wagmi Adapter
const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId: wcProjectId,
  ssr: true,
});

// Create modal
createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId: wcProjectId,
  metadata,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <CampProvider clientId="your-camp-client-id">
          <App />
        </CampProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
