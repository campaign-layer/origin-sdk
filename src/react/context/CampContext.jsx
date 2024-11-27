import React, { useState, useContext, createContext } from "react";
import { Auth } from "../../auth/index.js";
import { ModalProvider } from "./ModalContext.jsx";
import { WagmiContext } from "wagmi";

const CampContext = createContext({
  clientId: null,
  auth: null,
  setAuth: () => {},
  wagmiAvailable: false,
});

/**
 * CampProvider
 * @param {Object} props The props
 * @param {string} props.clientId The Camp client ID
 * @param {string} props.redirectUri The redirect URI to use after social oauths
 * @param {React.ReactNode} props.children The children components
 * @returns {JSX.Element} The CampProvider component
 */
const CampProvider = ({ clientId, redirectUri, children }) => {
  const [auth, setAuth] = useState(new Auth({ clientId, redirectUri }));

  const wagmiContext = useContext(WagmiContext);

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
