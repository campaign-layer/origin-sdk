import { CampModal } from "@campnetwork/origin/react";
import { useWallets } from "@privy-io/react-auth";
import { useEffect, useState } from "react";

/*
 * The following example will work with or without wagmi
 * It will display the Privy embedded wallet at the top of the list (if available)
 */

function App() {
  const { wallets } = useWallets();
  const [privyEthereumProvider, setPrivyEthereumProvider] = useState(null);

  useEffect(() => {
    /*
     * Select the embedded provider from the list of wallets
     * and set it as the default provider for the CampModal
     *
     * Feel free to customize this logic to fit your needs
     */
    if (!wallets.length) return;

    const wallet = wallets.find(
      (wallet) => wallet.connectorType === "embedded"
    );

    if (!wallet) return;

    wallet.getEthereumProvider().then((provider) => {
      setPrivyEthereumProvider(provider);
    });
  }, [wallets]);

  return (
    <div>
      <CampModal
        defaultProvider={{
          provider: privyEthereumProvider,
          /*
           * If the provider name includes the word "Privy" (or "Appkit")
           * the icon will be automatically set
           * If you want to set a custom icon, you can do so by
           * providing the icon URL
           * You can also provide any provider name you want
           */
          info: {
            name: "Privy",
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
