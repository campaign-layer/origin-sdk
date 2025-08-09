import { AuthRN } from "./AuthRN";
import { UseQueryResult } from "@tanstack/react-query";
/**
 * Returns the Auth instance provided by the context.
 * @returns { AuthRN } The Auth instance provided by the context.
 */
export declare const useAuth: () => AuthRN;
/**
 * Returns the functions to link and unlink socials.
 */
export declare const useLinkSocials: () => Record<string, Function>;
/**
 * Returns the provider state and setter.
 */
export declare const useProvider: () => {
    provider: {
        provider: any;
        info: {
            name: string;
        };
    };
    setProvider: (provider: any, info?: any) => void;
};
/**
 * Returns the authenticated state and loading state.
 */
export declare const useAuthState: () => {
    authenticated: boolean;
    loading: boolean;
};
/**
 * Connects and disconnects the user.
 */
export declare const useConnect: () => {
    connect: () => Promise<{
        success: boolean;
        message: string;
        walletAddress: string;
    }>;
    disconnect: () => Promise<void>;
};
/**
 * Returns the array of providers (empty in React Native as we use AppKit).
 */
export declare const useProviders: () => any[];
/**
 * Returns the modal state and functions to open and close the modal.
 */
export declare const useModal: () => {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};
/**
 * Returns the functions to open and close the link modal.
 */
export declare const useLinkModal: () => Record<string, Function | boolean> & {
    isLinkingOpen: boolean;
    closeModal: () => void;
    handleOpen: (social: string) => void;
};
type UseSocialsResult<TData = unknown, TError = Error> = UseQueryResult<TData, TError> & {
    socials: Record<string, string>;
};
/**
 * Fetches the socials linked to the user.
 */
export declare const useSocials: () => UseSocialsResult;
/**
 * Fetches the Origin usage data and uploads data.
 */
export declare const useOrigin: () => {
    stats: {
        data: any;
        isError: boolean;
        isLoading: boolean;
        refetch: () => void;
    };
    uploads: {
        data: any[];
        isError: boolean;
        isLoading: boolean;
        refetch: () => void;
    };
};
export {};
