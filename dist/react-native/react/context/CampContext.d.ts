import React from "react";
import { Auth } from "../../core/auth";
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
declare const CampContext: React.Context<CampContextType>;
/**
 * CampProvider
 * @param {Object} props The props
 * @param {string} props.clientId The Camp client ID
 * @param {string} props.redirectUri The redirect URI to use after social oauths
 * @param {React.ReactNode} props.children The children components
 * @param {boolean} props.allowAnalytics Whether to allow analytics to be sent
 * @returns {JSX.Element} The CampProvider component
 */
declare const CampProvider: ({ clientId, redirectUri, children, allowAnalytics, }: {
    clientId: string;
    redirectUri?: string;
    children: React.ReactNode;
    allowAnalytics?: boolean;
}) => React.JSX.Element;
export { CampContext, CampProvider };
