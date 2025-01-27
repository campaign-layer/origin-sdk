import React, { JSX } from 'react';
import { UseQueryResult } from '@tanstack/react-query';

declare global {
    interface Window {
        ethereum?: any;
    }
}
/**
 * The Auth class.
 * @class
 * @classdesc The Auth class is used to authenticate the user.
 */
declare class Auth {
    #private;
    redirectUri: Record<string, string>;
    clientId: string;
    isAuthenticated: boolean;
    jwt: string | null;
    walletAddress: string | null;
    userId: string | null;
    viem: any;
    /**
     * Constructor for the Auth class.
     * @param {object} options The options object.
     * @param {string} options.clientId The client ID.
     * @param {string|object} options.redirectUri The redirect URI used for oauth. Leave empty if you want to use the current URL. If you want different redirect URIs for different socials, pass an object with the socials as keys and the redirect URIs as values.
     * @throws {APIError} - Throws an error if the clientId is not provided.
     */
    constructor({ clientId, redirectUri, allowAnalytics, ackeeInstance, }: {
        clientId: string;
        redirectUri: string | Record<string, string>;
        allowAnalytics?: boolean;
        ackeeInstance?: any;
    });
    /**
     * Subscribe to an event. Possible events are "state", "provider", and "providers".
     * @param {("state"|"provider"|"providers")} event The event.
     * @param {function} callback The callback function.
     * @returns {void}
     * @example
     * auth.on("state", (state) => {
     *  console.log(state);
     * });
     */
    on(event: "state" | "provider" | "providers", callback: Function): void;
    /**
     * Set the loading state.
     * @param {boolean} loading The loading state.
     * @returns {void}
     */
    setLoading(loading: boolean): void;
    /**
     * Set the provider. This is useful for setting the provider when the user selects a provider from the UI or when dApp wishes to use a specific provider.
     * @param {object} options The options object. Includes the provider and the provider info.
     * @returns {void}
     * @throws {APIError} - Throws an error if the provider is not provided.
     */
    setProvider({ provider, info }: {
        provider: any;
        info: any;
    }): void;
    /**
     * Set the wallet address. This is useful for edge cases where the provider can't return the wallet address. Don't use this unless you know what you're doing.
     * @param {string} walletAddress The wallet address.
     * @returns {void}
     */
    setWalletAddress(walletAddress: string): void;
    /**
     * Disconnect the user.
     * @returns {void}
     */
    disconnect(): Promise<void>;
    /**
     * Connect the user's wallet and sign the message.
     * @returns {Promise<object>} A promise that resolves with the authentication result.
     * @throws {APIError} - Throws an error if the user cannot be authenticated.
     */
    connect(): Promise<{
        success: boolean;
        message: string;
        walletAddress: string;
    }>;
    /**
     * Get the user's linked social accounts.
     * @returns {Promise<object>} A promise that resolves with the user's linked social accounts.
     * @throws {APIError} - Throws an error if the user is not authenticated or if the request fails.
     * @example
     * const auth = new Auth({ clientId: "your-client-id" });
     * const socials = await auth.getLinkedSocials();
     * console.log(socials);
     */
    getLinkedSocials(): Promise<Record<string, any>>;
    /**
     * Link the user's Twitter account.
     * @returns {void}
     * @throws {APIError} - Throws an error if the user is not authenticated.
     */
    linkTwitter(): Promise<void>;
    /**
     * Link the user's Discord account.
     * @returns {void}
     * @throws {APIError} - Throws an error if the user is not authenticated.
     */
    linkDiscord(): Promise<void>;
    /**
     * Link the user's Spotify account.
     * @returns {void}
     * @throws {APIError} - Throws an error if the user is not authenticated.
     */
    linkSpotify(): Promise<void>;
    /**
     * Link the user's TikTok account.
     * @param {string} handle The user's TikTok handle.
     * @returns {void}
     * @throws {APIError} - Throws an error if the user is not authenticated.
     */
    linkTikTok(handle: string): Promise<any>;
    /**
     * Send an OTP to the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @returns {void}
     * @throws {APIError} - Throws an error if the user is not authenticated.
     */
    sendTelegramOTP(phoneNumber: string): Promise<any>;
    /**
     * Link the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @param {string} otp The OTP.
     * @param {string} phoneCodeHash The phone code hash.
     * @returns {void}
     * @throws {APIError} - Throws an error if the user is not authenticated. Also throws an error if the phone number, OTP, and phone code hash are not provided.
     */
    linkTelegram(phoneNumber: string, otp: string, phoneCodeHash: string): Promise<any>;
    /**
     * Unlink the user's Twitter account.
     */
    unlinkTwitter(): Promise<any>;
    /**
     * Unlink the user's Discord account.
     */
    unlinkDiscord(): Promise<any>;
    /**
     * Unlink the user's Spotify account.
     */
    unlinkSpotify(): Promise<any>;
    unlinkTikTok(): Promise<any>;
    unlinkTelegram(): Promise<any>;
}

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
declare const CampContext: React.Context<CampContextType>;
/**
 * CampProvider
 * @param {Object} props The props
 * @param {string} props.clientId The Camp client ID
 * @param {string} props.redirectUri The redirect URI to use after social oauths
 * @param {React.ReactNode} props.children The children components
 * @returns {JSX.Element} The CampProvider component
 */
declare const CampProvider: ({ clientId, redirectUri, children, allowAnalytics, }: {
    clientId: string;
    redirectUri?: string;
    children: React.ReactNode;
    allowAnalytics?: boolean;
}) => React.JSX.Element;

interface ModalContextProps {
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
    isLinkingVisible: boolean;
    setIsLinkingVisible: (isLinkingVisible: boolean) => void;
    currentlyLinking: any;
    setCurrentlyLinking: (currentlyLinking: any) => void;
}
declare const ModalContext: React.Context<ModalContextProps>;

interface Provider {
    info: {
        uuid: string;
    };
    provider: any;
}

interface CampModalProps {
    injectButton?: boolean;
    wcProjectId?: string;
    onlyWagmi?: boolean;
    defaultProvider?: any;
}
/**
 * The CampModal component.
 * @param { { injectButton?: boolean, wcProjectId?: string, onlyWagmi?: boolean, defaultProvider?: object } } props The props.
 * @returns { JSX.Element } The CampModal component.
 */
declare const CampModal: ({ injectButton, wcProjectId, onlyWagmi, defaultProvider, }: CampModalProps) => React.JSX.Element;
/**
 * The MyCampModal component.
 * @param { { wcProvider: object } } props The props.
 * @returns { JSX.Element } The MyCampModal component.
 */
declare const MyCampModal: ({ wcProvider }: {
    wcProvider: any;
}) => React.JSX.Element;

interface LinkButtonProps {
    variant?: "default" | "icon";
    social: "twitter" | "spotify" | "discord" | "tiktok" | "telegram";
    theme?: "default" | "camp";
}
/**
 * The LinkButton component.
 * A button that will open the modal to link or unlink a social account.
 * @param { { variant: ("default"|"icon"), social: ("twitter"|"spotify"|"discord"), theme: ("default"|"camp") } } props The props.
 * @returns { JSX.Element } The LinkButton component.
 */
declare const LinkButton: ({ variant, social, theme, }: LinkButtonProps) => JSX.Element | null;

/**
 * Returns the Auth instance provided by the context.
 * @returns { Auth } The Auth instance provided by the context.
 * @example
 * const auth = useAuth();
 * auth.connect();
 */
declare const useAuth: () => Auth;
/**
 * Returns the functions to link and unlink socials.
 * @returns { { linkTwitter: function, unlinkTwitter: function, linkDiscord: function, unlinkDiscord: function, linkSpotify: function, unlinkSpotify: function } } The functions to link and unlink socials.
 * @example
 * const { linkTwitter, unlinkTwitter, linkDiscord, unlinkDiscord, linkSpotify, unlinkSpotify } = useLinkSocials();
 * linkTwitter();
 */
declare const useLinkSocials: () => Record<string, Function>;
/**
 * Fetches the provider from the context and sets the provider in the auth instance.
 * @returns { { provider: { provider: string, info: { name: string } }, setProvider: function } } The provider and a function to set the provider.
 */
declare const useProvider: () => {
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
declare const useAuthState: () => {
    authenticated: boolean;
    loading: boolean;
};
/**
 * Connects and disconnects the user.
 * @returns { { connect: function, disconnect: function } } The connect and disconnect functions.
 */
declare const useConnect: () => {
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
declare const useProviders: () => Provider[];
/**
 * Returns the modal state and functions to open and close the modal.
 * @returns { { isOpen: boolean, openModal: function, closeModal: function } } The modal state and functions to open and close the modal.
 */
declare const useModal: () => {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};
declare const useLinkModal: () => Record<string, Function | boolean> & {
    isLinkingOpen: boolean;
    closeModal: () => void;
    handleOpen: (social: string) => void;
};
/**
 * Fetches the socials linked to the user.
 * @returns { { data: Array, socials: Array, error: Error, isLoading: boolean, refetch: () => {} } } react-query query object.
 */
type UseSocialsResult<TData = unknown, TError = Error> = UseQueryResult<TData, TError> & {
    socials: Record<string, string>;
};
declare const useSocials: () => UseSocialsResult;

export { CampContext, CampModal, CampProvider, LinkButton, ModalContext, MyCampModal, useAuth, useAuthState, useConnect, useLinkModal, useLinkSocials, useModal, useProvider, useProviders, useSocials };
