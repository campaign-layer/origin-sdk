import { useEffect } from "react";
import { CampModal } from "@campnetwork/origin/react";

import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";

function App() {
  const { login, logout, authenticated } = usePrivy();
  const { wallets } = useWallets();
  const { setActiveWallet } = useSetActiveWallet();

  useEffect(() => {
    // set the latest wallet as the active wallet
    // this "fixes" a Privy quirk where wagmi prefers a previously connected extension wallet such as MetaMask
    // over newly created Privy embedded wallets
    // feel free to write your own logic to handle which wallet to set as active
    if (wallets.length > 0) setActiveWallet(wallets[0]);
  }, [wallets]);
  return (
    <div>
      <CampModal />
      <button onClick={authenticated ? logout : login}>
        {authenticated ? "Privy Logout" : "Privy Login"}
      </button>
    </div>
  );
}
export default App;
