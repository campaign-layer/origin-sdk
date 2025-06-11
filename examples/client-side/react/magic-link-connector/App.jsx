import { CampModal } from "@campnetwork/origin/react";
import { Magic } from "magic-sdk";
import { useEffect, useState } from "react";
function App() {
  // Initialize Magic
  const magic = new Magic("your-magic-key");

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to handle Magic login/logout, and set the provider accordingly
  const handleMagicLogin = async () => {
    try {
      setLoading(true);
      if (provider) {
        await magic.user.logout();
        setProvider(null);
      } else {
        await magic.wallet.connectWithUI();
        setProvider(magic.rpcProvider);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    magic.user.isLoggedIn().then((isLoggedIn) => {
      // If the user is already logged in, set the provider
      if (isLoggedIn) {
        setProvider(magic.rpcProvider);
      }
      setLoading(false);
    });
  }, []);

  // Render the login/logout button and the CampModal component
  // ! Make sure to only pass the provider to the CampModal component if the user is logged in !
  
  return (
    <div>
      <button disabled={loading} onClick={handleMagicLogin}>
        {loading ? "loading" : provider ? "Magic Logout" : "Magic Login"}
      </button>
      <br />
      <br />
      <CampModal
        defaultProvider={{
          provider: provider,
          info: {
            name: "Magic", // You can use any name and icon you want
            icon: "https://magic.link/favicon.ico",
          },
          exclusive: true,
        }}
      />
    </div>
  );
}

export default App;
