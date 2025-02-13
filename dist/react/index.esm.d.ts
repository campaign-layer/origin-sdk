import React, { JSX } from 'react';
import { Auth } from '@campnetwork/sdk';
import { UseQueryResult } from '@tanstack/react-query';

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
 * @param {boolean} props.allowAnalytics Whether to allow analytics to be sent
 * @returns {JSX.Element} The CampProvider component
 */
declare const CampProvider: ({ clientId, redirectUri, children, allowAnalytics, }: {
    clientId: string;
    redirectUri?: string;
    children: React.ReactNode;
    allowAnalytics?: boolean;
}) => React.JSX.Element;

interface ModalContextProps {
    isButtonDisabled: boolean;
    setIsButtonDisabled: (isButtonDisabled: boolean) => void;
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

declare const StandaloneCampButton: () => JSX.Element | null;
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

export { StandaloneCampButton as CampButton, CampContext, CampModal, CampProvider, LinkButton, ModalContext, MyCampModal, useAuth, useAuthState, useConnect, useLinkModal, useLinkSocials, useModal, useProvider, useProviders, useSocials };
