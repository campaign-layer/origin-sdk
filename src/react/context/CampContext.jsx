import React, { useState, useContext, createContext } from "react";
import { Auth } from "../../core/auth/index.js";
import { ModalProvider } from "./ModalContext.jsx";
import { WagmiContext } from "wagmi";
import { SocialsProvider } from "./SocialsContext.jsx";
import { ToastProvider } from "../toasts.jsx";

/**
 * CampContext
 * @type {React.Context}
 * @property {string} clientId The Camp client ID
 * @property {Auth} auth The Camp Auth instance
 * @property {function} setAuth The function to set the Camp Auth instance
 * @property {boolean} wagmiAvailable Whether Wagmi is available
 */
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
      <SocialsProvider>
        <ToastProvider>
          <ModalProvider>{children}</ModalProvider>
        </ToastProvider>
      </SocialsProvider>
    </CampContext.Provider>
  );
};

export { CampContext, CampProvider };
