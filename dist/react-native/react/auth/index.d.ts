import { CampContext, CampProvider } from "../context/CampContext";
import { ModalContext } from "../context/ModalContext";
import { Provider } from "../../core/auth/viem/providers";
import { CampModal, MyCampModal } from "./modals";
import { Auth } from "../../core/auth";
import { LinkButton, StandaloneCampButton } from "./buttons";
import { type UseQueryResult } from "@tanstack/react-query";
export { CampModal, MyCampModal };
export { LinkButton };
export { CampContext, CampProvider, ModalContext };
export { StandaloneCampButton as CampButton };
/**
 * Returns the Auth instance provided by the context.
 * @returns { Auth } The Auth instance provided by the context.
 * @example
 * const auth = useAuth();
 * auth.connect();
 */
export declare const useAuth: () => Auth;
/**
 * Returns the functions to link and unlink socials.
 * @returns { { linkTwitter: function, unlinkTwitter: function, linkDiscord: function, unlinkDiscord: function, linkSpotify: function, unlinkSpotify: function } } The functions to link and unlink socials.
 * @example
 * const { linkTwitter, unlinkTwitter, linkDiscord, unlinkDiscord, linkSpotify, unlinkSpotify } = useLinkSocials();
 * linkTwitter();
 */
export declare const useLinkSocials: () => Record<string, Function>;
/**
 * Fetches the provider from the context and sets the provider in the auth instance.
 * @returns { { provider: { provider: string, info: { name: string } }, setProvider: function } } The provider and a function to set the provider.
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
 * @returns { { authenticated: boolean, loading: boolean } } The authenticated state and loading state.
 */
export declare const useAuthState: () => {
    authenticated: boolean;
    loading: boolean;
};
export declare const useViem: () => {
    client: any;
};
/**
 * Connects and disconnects the user.
 * @returns { { connect: function, disconnect: function } } The connect and disconnect functions.
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
 * Returns the array of providers.
 * @returns { Array } The array of providers and the loading state.
 */
export declare const useProviders: () => Provider[];
/**
 * Returns the modal state and functions to open and close the modal.
 * @returns { { isOpen: boolean, openModal: function, closeModal: function } } The modal state and functions to open and close the modal.
 */
export declare const useModal: () => {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};
/**
 * Returns the functions to open and close the link modal.
 * @returns { { isLinkingOpen: boolean, closeModal: function, handleOpen: function } } The link modal state and functions to open and close the modal.
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
 * @returns { { data: {}, socials: {}, error: Error, isLoading: boolean, refetch: () => {} } } react-query query object.
 */
export declare const useSocials: () => UseSocialsResult;
/**
 * Fetches the Origin usage data and uploads data.
 * @returns { usage: { data: any, isError: boolean, isLoading: boolean, refetch: () => void }, uploads: { data: any, isError: boolean, isLoading: boolean, refetch: () => void } } The Origin usage data and uploads data.
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
