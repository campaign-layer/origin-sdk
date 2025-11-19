import React, { useState, useContext, createContext } from "react";
import { Auth } from "../../core/auth";
import { ModalProvider } from "./ModalContext";
import { WagmiContext } from "wagmi";
import { SocialsProvider } from "./SocialsContext";
import { ToastProvider } from "../components/toasts";
import { Environment, ENVIRONMENTS } from "../../constants";

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
 * @param {string | bigint} props.baseParentId The base parent ID to use for minted NFTs
 * @param {string} props.environment The environment to use ("DEVELOPMENT" or "PRODUCTION")
 * @returns {JSX.Element} The CampProvider component
 */
const CampProvider = ({
  clientId,
  redirectUri,
  children,
  environment = "DEVELOPMENT",
  baseParentId,
}: {
  clientId: string;
  redirectUri?: string;
  children: React.ReactNode;
  environment?: "DEVELOPMENT" | "PRODUCTION";
  baseParentId?: string | bigint;
}) => {
  const isServer = typeof window === "undefined";
  const normalizedBaseParentId =
    typeof baseParentId === "string" ? BigInt(baseParentId) : baseParentId;

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
          baseParentId: normalizedBaseParentId,
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
        <ToastProvider>
          <ModalProvider>{children}</ModalProvider>
        </ToastProvider>
      </SocialsProvider>
    </CampContext.Provider>
  );
};

export { CampContext, CampProvider };
