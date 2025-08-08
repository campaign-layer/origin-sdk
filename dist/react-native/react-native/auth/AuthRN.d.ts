import { Origin } from "../../core/origin";
declare global {
    interface Window {
        ethereum?: any;
    }
}
/**
 * The React Native Auth class with AppKit integration.
 * @class
 * @classdesc The Auth class is used to authenticate the user in React Native with AppKit for wallet operations.
 */
declare class AuthRN {
    #private;
    redirectUri: Record<string, string>;
    clientId: string;
    isAuthenticated: boolean;
    jwt: string | null;
    walletAddress: string | null;
    userId: string | null;
    viem: any;
    origin: Origin | null;
    /**
     * Constructor for the Auth class.
     * @param {object} options The options object.
     * @param {string} options.clientId The client ID.
     * @param {string|object} options.redirectUri The redirect URI used for oauth.
     * @param {boolean} [options.allowAnalytics=true] Whether to allow analytics to be sent.
     * @param {any} [options.appKit] AppKit instance for wallet operations.
     * @throws {APIError} - Throws an error if the clientId is not provided.
     */
    constructor({ clientId, redirectUri, allowAnalytics, appKit, }: {
        clientId: string;
        redirectUri?: string | Record<string, string>;
        allowAnalytics?: boolean;
        appKit?: any;
    });
    /**
     * Set AppKit instance for wallet operations.
     * @param {any} appKit AppKit instance.
     */
    setAppKit(appKit: any): void;
    /**
     * Get AppKit instance for wallet operations.
     * @returns {any} AppKit instance.
     */
    getAppKit(): any;
    /**
     * Subscribe to an event. Possible events are "state", "provider", "providers", and "viem".
     * @param {("state"|"provider"|"providers"|"viem")} event The event.
     * @param {function} callback The callback function.
     * @returns {void}
     * @example
     * auth.on("state", (state) => {
     *  console.log(state);
     * });
     */
    on(event: "state" | "provider" | "providers" | "viem", callback: Function): void;
    /**
     * Set the loading state.
     * @param {boolean} loading The loading state.
     * @returns {void}
     */
    setLoading(loading: boolean): void;
    /**
     * Set the provider. This is useful for setting the provider when the user selects a provider from the UI.
     * @param {object} options The options object. Includes the provider and the provider info.
     * @returns {void}
     * @throws {APIError} - Throws an error if the provider is not provided.
     */
    setProvider({ provider, info, address, }: {
        provider: any;
        info: any;
        address?: string;
    }): void;
    /**
     * Set the wallet address.
     * @param {string} walletAddress The wallet address.
     * @returns {void}
     */
    setWalletAddress(walletAddress: string): void;
    /**
     * Disconnect the user and clear AppKit connection.
     * @returns {Promise<void>}
     */
    disconnect(): Promise<void>;
    /**
     * Connect the user's wallet and authenticate using AppKit.
     * @returns {Promise<{ success: boolean; message: string; walletAddress: string }>} A promise that resolves with the authentication result.
     * @throws {APIError} - Throws an error if the user cannot be authenticated.
     */
    connect(): Promise<{
        success: boolean;
        message: string;
        walletAddress: string;
    }>;
    /**
     * Get the user's linked social accounts.
     * @returns {Promise<Record<string, boolean>>} A promise that resolves with the user's linked social accounts.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated or if the request fails.
     */
    getLinkedSocials(): Promise<Record<string, boolean>>;
    linkTwitter(): Promise<void>;
    linkDiscord(): Promise<void>;
    linkSpotify(): Promise<void>;
    linkTikTok(handle: string): Promise<any>;
    sendTelegramOTP(phoneNumber: string): Promise<any>;
    linkTelegram(phoneNumber: string, otp: string, phoneCodeHash: string): Promise<any>;
    unlinkTwitter(): Promise<any>;
    unlinkDiscord(): Promise<any>;
    unlinkSpotify(): Promise<any>;
    unlinkTikTok(): Promise<any>;
    unlinkTelegram(): Promise<any>;
    /**
     * Generic method to link social accounts
     */
    linkSocial(provider: 'twitter' | 'discord' | 'spotify'): Promise<void>;
    /**
     * Generic method to unlink social accounts
     */
    unlinkSocial(provider: 'twitter' | 'discord' | 'spotify'): Promise<any>;
    /**
     * Mint social NFT (placeholder implementation)
     */
    mintSocial(provider: string, data: any): Promise<any>;
    /**
     * Sign a message using the connected wallet
     */
    signMessage(message: string): Promise<string>;
    /**
     * Send a transaction using the connected wallet
     */
    sendTransaction(transaction: any): Promise<any>;
}
export { AuthRN };
