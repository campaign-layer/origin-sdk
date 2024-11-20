import React from "react";
import { createContext } from "react";
import { Auth } from "../../auth/index.js";
import { ModalProvider } from "./ModalContext.jsx";
import { WagmiContext } from "wagmi";

const CampContext = createContext({
  clientId: null,
  auth: null,
  setAuth: () => {},
  wagmiAvailable: false,
});

const CampProvider = ({ clientId, redirectUri, children }) => {
  const [auth, setAuth] = React.useState(new Auth({ clientId, redirectUri }));

  const wagmiContext = React.useContext(WagmiContext);

  return (
    <CampContext.Provider
      value={{
        clientId,
        auth,
        setAuth,
        wagmiAvailable: wagmiContext !== undefined,
      }}
    >
      <ModalProvider>{children}</ModalProvider>
    </CampContext.Provider>
  );
};

export { CampContext, CampProvider };
