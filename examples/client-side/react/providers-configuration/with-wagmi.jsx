// The following examples work with any providers that support wagmi
import { CampModal } from "@campnetwork/origin/react";

/*
 * Show all providers
 * The wagmi injected provider will be shown at the top of the list
 */
function App() {
  return (
    <div>
      <CampModal />
    </div>
  );
}

/*
 * The wagmi injected provider will be the only one shown in the modal
 * The user will not be able to switch to other providers
 * If the user is not connected to the wagmi provider, the button will be disabled
 */
function AppOnlyWagmi() {
  return (
    <div>
      <CampModal onlyWagmi />
    </div>
  );
}

export { App, AppOnlyWagmi };
