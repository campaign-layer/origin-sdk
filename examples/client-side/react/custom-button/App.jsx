import { CampModal, useModal, useAuthState } from "@campnetwork/origin/react";
import "./App.css";

function App() {
  const { openModal } = useModal();
  const { authenticated } = useAuthState();
  return (
    <div>
      <CampModal injectButton={false} />
      <button className="custom-button" onClick={openModal}>
        {authenticated ? "My Camp" : "Connect with Camp"}
      </button>
    </div>
  );
}

export default App;
