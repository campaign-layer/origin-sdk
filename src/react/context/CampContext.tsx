import React, { useState, useContext, createContext } from "react";
import { Auth } from "../../core/auth/index";
import { ModalProvider } from "./ModalContext";
// @ts-ignore
import { WagmiContext } from "wagmi";
import * as ackeeTracker from "../../ackeeUtil";
import { SocialsProvider } from "./SocialsContext";
import { ToastProvider } from "../toasts";
import constants from "../../constants";

/**
 * CampContext
 * @type {React.Context}
 * @property {string} clientId The Camp client ID
 * @property {Auth} auth The Camp Auth instance
 * @property {function} setAuth The function to set the Camp Auth instance
 * @property {boolean} wagmiAvailable Whether Wagmi is available
 */
interface CampContextType {
  clientId: string | null;
  auth: Auth | null;
  setAuth: React.Dispatch<React.SetStateAction<Auth>>;
  wagmiAvailable: boolean;
  ackee: any;
  setAckee: any;
}

const CampContext = createContext<CampContextType>({
  clientId: null,
  auth: null,
  setAuth: () => {},
  wagmiAvailable: false,
  ackee: null,
  setAckee: () => {},
});

/**
 * CampProvider
 * @param {Object} props The props
 * @param {string} props.clientId The Camp client ID
 * @param {string} props.redirectUri The redirect URI to use after social oauths
 * @param {React.ReactNode} props.children The children components
 * @returns {JSX.Element} The CampProvider component
 */
const CampProvider = ({
  clientId,
  redirectUri,
  children,
  allowAnalytics = true,
}: {
  clientId: string;
  redirectUri?: string;
  children: React.ReactNode;
  allowAnalytics?: boolean;
}) => {
  const ackeeInstance = allowAnalytics
    ? ackeeTracker.create(constants.ACKEE_INSTANCE, {
        detailed: false,
        ignoreLocalhost: false,
        ignoreOwnVisits: false,
      })
    : null;
  const [ackee, setAckee] = useState(ackeeInstance);

  const [auth, setAuth] = useState(
    new Auth({
      clientId,
      redirectUri: redirectUri || window.location.href,
      ackeeInstance,
    })
  );

  const wagmiContext = useContext(WagmiContext);

  return (
    <CampContext.Provider
      value={{
        clientId,
        auth,
        setAuth,
        wagmiAvailable: wagmiContext !== undefined,
        ackee,
        setAckee,
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
