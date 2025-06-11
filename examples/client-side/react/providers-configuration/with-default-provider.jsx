import { CampModal } from "@campnetwork/origin/react";

/*
 * The following example shows how to set a custom provider
 * as the default provider for the CampModal
 */

function App() {
  return (
    <div>
      <CampModal
        defaultProvider={{
          provider: window.ethereum,
          /*
           * If the provider name includes the word "Privy" (or "Appkit")
           * the icon will be automatically set
           * If you want to set a custom icon, you can do so by
           * providing the icon URL
           * You can also provide any provider name you want
           */
          info: {
            name: "My Custom Provider",
            // icon: "https://example.com/icon.png", // Optional
          },
          // If exclusive is true, this will be the only provider shown in the modal
          exclusive: false,
        }}
      />
    </div>
  );
}

export { App };
