import React, { ReactNode } from "react";
import { AuthRN } from "../auth/AuthRN";
export interface CampContextType {
    auth: AuthRN | null;
    setAuth: React.Dispatch<React.SetStateAction<AuthRN | null>>;
    clientId: string;
    isAuthenticated: boolean;
    isLoading: boolean;
    walletAddress: string | null;
    error: string | null;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    clearError: () => void;
    getAppKit: () => any;
}
/**
 * CampContext for React Native with AppKit integration
 */
export declare const CampContext: React.Context<CampContextType>;
interface CampProviderProps {
    children: ReactNode;
    clientId: string;
    redirectUri?: string | Record<string, string>;
    allowAnalytics?: boolean;
    appKit?: any;
}
export declare const CampProvider: ({ children, clientId, redirectUri, allowAnalytics, appKit }: CampProviderProps) => React.JSX.Element;
export declare const useCamp: () => CampContextType;
export {};
