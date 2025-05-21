import React, { useState, useContext, createContext, useEffect } from "react";
import { Auth } from "../../core/auth";
import { ModalProvider } from "./ModalContext";
import { WagmiContext } from "wagmi";
// import { Ackee } from "../../index";
import { SocialsProvider } from "./SocialsContext";
import { ToastProvider } from "../toasts";
import constants from "../../constants";
import { OriginProvider } from "./OriginContext";

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
  setAuth: React.Dispatch<React.SetStateAction<Auth | null>>;
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
 * @param {boolean} props.allowAnalytics Whether to allow analytics to be sent
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
  const isServer = typeof window === "undefined";

  // const ackeeInstance =
  //   allowAnalytics && !isServer
  //     ? Ackee.create(constants.ACKEE_INSTANCE, {
  //         detailed: false,
  //         ignoreLocalhost: true,
  //         ignoreOwnVisits: false,
  //       })
  //     : null;
  // const [ackee, setAckee] = useState(ackeeInstance);

  const [auth, setAuth] = useState(
    !isServer ? new Auth({
      clientId,
      redirectUri: redirectUri
        ? redirectUri
        : !isServer
        ? window.location.href
        : "",
      // ackeeInstance,
    }) : null
  );

  // const wagmiContext = useContext(WagmiContext);

  const wagmiContext = typeof window !== "undefined" ? useContext(WagmiContext) : undefined;


  return (
    <CampContext.Provider
      value={{
        clientId,
        auth,
        setAuth,
        wagmiAvailable: wagmiContext !== undefined,
        ackee: null,
        setAckee : () => {},
      }}
    >
      <SocialsProvider>
        <OriginProvider>
          <ToastProvider>
            <ModalProvider>{children}</ModalProvider>
          </ToastProvider>
        </OriginProvider>
      </SocialsProvider>
    </CampContext.Provider>
  );
};

export { CampContext, CampProvider };
