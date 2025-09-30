import React, { useState, useContext, createContext } from "react";
import { Auth } from "../../core/auth";
import { ModalProvider } from "./ModalContext";
import { WagmiContext } from "wagmi";
import { SocialsProvider } from "./SocialsContext";
import { ToastProvider } from "../components/toasts";
import { Environment, ENVIRONMENTS } from "../../constants";
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
  environment: Environment;
}

const CampContext = createContext<CampContextType>({
  clientId: null,
  auth: null,
  setAuth: () => {},
  wagmiAvailable: false,
  environment: ENVIRONMENTS.DEVELOPMENT,
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
  environment = "DEVELOPMENT",
}: {
  clientId: string;
  redirectUri?: string;
  children: React.ReactNode;
  allowAnalytics?: boolean;
  environment?: "DEVELOPMENT" | "PRODUCTION";
}) => {
  const isServer = typeof window === "undefined";

  const [auth, setAuth] = useState(
    !isServer
      ? new Auth({
          clientId,
          redirectUri: redirectUri
            ? redirectUri
            : !isServer
            ? window.location.href
            : "",
          environment: environment,
        })
      : null
  );

  const wagmiContext =
    typeof window !== "undefined" ? useContext(WagmiContext) : undefined;

  return (
    <CampContext.Provider
      value={{
        clientId,
        auth,
        setAuth,
        wagmiAvailable: wagmiContext !== undefined,
        environment: ENVIRONMENTS[environment],
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
