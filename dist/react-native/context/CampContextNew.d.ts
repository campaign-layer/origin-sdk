import React, { ReactNode } from "react";
import { AuthRN } from "../auth/AuthRN";
/**
 * CampContext for React Native
 */
export declare const CampContext: React.Context<{
    auth: AuthRN | null;
    setAuth: React.Dispatch<React.SetStateAction<AuthRN | null>>;
    clientId: string;
}>;
interface CampProviderProps {
    children: ReactNode;
    clientId: string;
    redirectUri?: string | Record<string, string>;
}
export declare const CampProvider: ({ children, clientId, redirectUri }: CampProviderProps) => React.JSX.Element;
export {};
