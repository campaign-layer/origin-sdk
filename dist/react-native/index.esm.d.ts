import React, { ReactNode } from 'react';
import { Address, Hex, Abi } from 'viem';
import { ViewStyle } from 'react-native';

/**
 * Represents the terms of a license for a digital asset.
 * @property price - The price of the asset in wei.
 * @property duration - The duration of the license in seconds.
 * @property royaltyBps - The royalty percentage in basis points (0-10000).
 * @property paymentToken - The address of the payment token (ERC20 / address(0) for native currency).
 */
type LicenseTerms$1 = {
    price: bigint;
    duration: number;
    royaltyBps: number;
    paymentToken: Address;
};
/**
 * Enum representing the status of data in the system.
 * * - ACTIVE: The data is currently active and available.
 * * - PENDING_DELETE: The data is scheduled for deletion but not yet removed.
 * * - DELETED: The data has been deleted and is no longer available.
 */
declare enum DataStatus {
    ACTIVE = 0,
    PENDING_DELETE = 1,
    DELETED = 2
}
/**
 * Represents the source of an IpNFT.
 * This can be one of the supported social media platforms or a file upload.
 */
type IpNFTSource = "spotify" | "twitter" | "tiktok" | "file";

/**
 * Mints a Data NFT with a signature.
 * @param to The address to mint the NFT to.
 * @param tokenId The ID of the token to mint.
 * @param parentId The ID of the parent NFT, if applicable.
 * @param hash The hash of the data associated with the NFT.
 * @param uri The URI of the NFT metadata.
 * @param licenseTerms The terms of the license for the NFT.
 * @param deadline The deadline for the minting operation.
 * @param signature The signature for the minting operation.
 * @returns A promise that resolves when the minting is complete.
 */
declare function mintWithSignature(this: Origin, to: Address, tokenId: bigint, parentId: bigint, hash: Hex, uri: string, licenseTerms: LicenseTerms$1, deadline: bigint, signature: Hex): Promise<any>;
/**
 * Registers a Data NFT with the Origin service in order to obtain a signature for minting.
 * @param source The source of the Data NFT (e.g., "spotify", "twitter", "tiktok", or "file").
 * @param deadline The deadline for the registration operation.
 * @param fileKey Optional file key for file uploads.
 * @return A promise that resolves with the registration data.
 */
declare function registerIpNFT(this: Origin, source: IpNFTSource, deadline: bigint, licenseTerms: LicenseTerms$1, metadata: Record<string, unknown>, fileKey?: string | string[], parentId?: bigint): Promise<any>;

declare function updateTerms(this: Origin, tokenId: bigint, royaltyReceiver: Address, newTerms: LicenseTerms$1): Promise<any>;

declare function requestDelete(this: Origin, tokenId: bigint): Promise<any>;

declare function getTerms(this: Origin, tokenId: bigint): Promise<any>;

declare function ownerOf(this: Origin, tokenId: bigint): Promise<any>;

declare function balanceOf(this: Origin, owner: Address): Promise<any>;

declare function contentHash(this: Origin, tokenId: bigint): Promise<any>;

declare function tokenURI(this: Origin, tokenId: bigint): Promise<any>;

declare function dataStatus(this: Origin, tokenId: bigint): Promise<DataStatus>;

declare function royaltyInfo(this: Origin, tokenId: bigint, salePrice: bigint): Promise<[Address, bigint]>;

declare function getApproved(this: Origin, tokenId: bigint): Promise<Address>;

declare function isApprovedForAll(this: Origin, owner: Address, operator: Address): Promise<boolean>;

declare function transferFrom(this: Origin, from: Address, to: Address, tokenId: bigint): Promise<any>;

declare function safeTransferFrom(this: Origin, from: Address, to: Address, tokenId: bigint, data?: Hex): Promise<any>;

declare function approve(this: Origin, to: Address, tokenId: bigint): Promise<any>;

declare function setApprovalForAll(this: Origin, operator: Address, approved: boolean): Promise<any>;

declare function buyAccess(this: Origin, buyer: Address, tokenId: bigint, periods: number, value?: bigint): Promise<any>;

declare function renewAccess(this: Origin, tokenId: bigint, buyer: Address, periods: number, value?: bigint): Promise<any>;

declare function hasAccess(this: Origin, user: Address, tokenId: bigint): Promise<boolean>;

declare function subscriptionExpiry(this: Origin, tokenId: bigint, user: Address): Promise<bigint>;

interface OriginUsageReturnType {
    user: {
        multiplier: number;
        points: number;
        active: boolean;
    };
    teams: Array<any>;
    dataSources: Array<any>;
}
type CallOptions = {
    value?: bigint;
    gas?: bigint;
    waitForReceipt?: boolean;
};
/**
 * The Origin class
 * Handles the upload of files to Origin, as well as querying the user's stats
 */
declare class Origin {
    #private;
    mintWithSignature: typeof mintWithSignature;
    registerIpNFT: typeof registerIpNFT;
    updateTerms: typeof updateTerms;
    requestDelete: typeof requestDelete;
    getTerms: typeof getTerms;
    ownerOf: typeof ownerOf;
    balanceOf: typeof balanceOf;
    contentHash: typeof contentHash;
    tokenURI: typeof tokenURI;
    dataStatus: typeof dataStatus;
    royaltyInfo: typeof royaltyInfo;
    getApproved: typeof getApproved;
    isApprovedForAll: typeof isApprovedForAll;
    transferFrom: typeof transferFrom;
    safeTransferFrom: typeof safeTransferFrom;
    approve: typeof approve;
    setApprovalForAll: typeof setApprovalForAll;
    buyAccess: typeof buyAccess;
    renewAccess: typeof renewAccess;
    hasAccess: typeof hasAccess;
    subscriptionExpiry: typeof subscriptionExpiry;
    private jwt;
    private viemClient?;
    constructor(jwt: string, viemClient?: any);
    getJwt(): string;
    setViemClient(client: any): void;
    uploadFile: (file: File, options?: {
        progressCallback?: (percent: number) => void;
    }) => Promise<any>;
    mintFile: (file: File, metadata: Record<string, unknown>, license: LicenseTerms$1, parentId?: bigint, options?: {
        progressCallback?: (percent: number) => void;
    }) => Promise<string | null>;
    mintSocial: (source: "spotify" | "twitter" | "tiktok", metadata: Record<string, unknown>, license: LicenseTerms$1) => Promise<string | null>;
    getOriginUploads: () => Promise<any>;
    /**
     * Get the user's Origin stats (multiplier, consent, usage, etc.).
     * @returns {Promise<OriginUsageReturnType>} A promise that resolves with the user's Origin stats.
     */
    getOriginUsage(): Promise<OriginUsageReturnType>;
    /**
     * Set the user's consent for Origin usage.
     * @param {boolean} consent The user's consent.
     * @returns {Promise<void>}
     * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the consent is not provided.
     */
    setOriginConsent(consent: boolean): Promise<void>;
    /**
     * Set the user's Origin multiplier.
     * @param {number} multiplier The user's Origin multiplier.
     * @returns {Promise<void>}
     * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the multiplier is not provided.
     */
    setOriginMultiplier(multiplier: number): Promise<void>;
    /**
     * Call a contract method.
     * @param {string} contractAddress The contract address.
     * @param {Abi} abi The contract ABI.
     * @param {string} methodName The method name.
     * @param {any[]} params The method parameters.
     * @param {CallOptions} [options] The call options.
     * @returns {Promise<any>} A promise that resolves with the result of the contract call or transaction hash.
     * @throws {Error} - Throws an error if the wallet client is not connected and the method is not a view function.
     */
    callContractMethod(contractAddress: string, abi: Abi, methodName: string, params: any[], options?: CallOptions): Promise<any>;
    /**
     * Buy access to an asset by first checking its price via getTerms, then calling buyAccess.
     * @param {bigint} tokenId The token ID of the asset.
     * @param {number} periods The number of periods to buy access for.
     * @returns {Promise<any>} The result of the buyAccess call.
     */
    buyAccessSmart(tokenId: bigint, periods: number): Promise<any>;
    getData(tokenId: bigint): Promise<any>;
}

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

interface CampContextType$1 {
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
declare const CampContext: React.Context<CampContextType$1>;
interface CampProviderProps {
    children: ReactNode;
    clientId: string;
    redirectUri?: string | Record<string, string>;
    allowAnalytics?: boolean;
    appKit?: any;
}
declare const CampProvider: ({ children, clientId, redirectUri, allowAnalytics, appKit }: CampProviderProps) => React.JSX.Element;

declare const useCampAuth: () => {
    auth: AuthRN | null;
    isAuthenticated: boolean;
    authenticated: boolean;
    isLoading: boolean;
    loading: boolean;
    walletAddress: string | null;
    error: string | null;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    clearError: () => void;
};
declare const useAuthState: () => {
    authenticated: boolean;
    loading: boolean;
};
declare const useCamp: () => CampContextType$1;
declare const useSocials: () => {
    data: Record<string, boolean>;
    socials: Record<string, boolean>;
    isLoading: boolean;
    error: Error | null;
    linkSocial: (platform: "twitter" | "discord" | "spotify") => Promise<void>;
    unlinkSocial: (platform: "twitter" | "discord" | "spotify") => Promise<void>;
    refetch: () => Promise<void>;
};
declare const useAppKit: () => {
    isConnected: boolean;
    isAppKitConnected: boolean;
    isConnecting: boolean;
    address: string | null;
    appKitAddress: string | null;
    chainId: number | null;
    balance: string | null;
    openAppKit: () => Promise<string>;
    disconnectAppKit: () => Promise<void>;
    disconnect: () => Promise<void>;
    signMessage: (message: string) => Promise<string>;
    switchNetwork: (targetChainId: number) => Promise<void>;
    sendTransaction: (transaction: any) => Promise<any>;
    getBalance: () => Promise<string>;
    getChainId: () => Promise<number>;
    getProvider: () => any;
    subscribeAccount: (callback: (account: any) => void) => (() => void);
    subscribeChainId: (callback: (chainId: number) => void) => (() => void);
    appKit: any;
};
declare const useModal: () => {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};
declare const useOrigin: () => {
    stats: {
        refetch: () => Promise<void>;
        data: any;
        isLoading: boolean;
        error: Error | null;
        isError: boolean;
    };
    uploads: {
        refetch: () => Promise<void>;
        data: any[];
        isLoading: boolean;
        error: Error | null;
        isError: boolean;
    };
    mintFile: (file: any, metadata: Record<string, unknown>, license: any, parentId?: bigint) => Promise<string | null>;
    createIPAsset: (file: File, metadata: any, license: any) => Promise<string>;
    createSocialIPAsset: (source: "twitter" | "spotify", license: any) => Promise<string>;
};

interface CampButtonProps$1 {
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    authenticated?: boolean;
}
declare const CampButton: React.FC<CampButtonProps$1>;

interface CampModalProps$1 {
    visible?: boolean;
    onClose?: () => void;
    children?: React.ReactNode;
}
declare const CampModal: React.FC<CampModalProps$1>;

/**
 * The TwitterAPI class.
 * @class
 * @classdesc The TwitterAPI class is used to interact with the Twitter API.
 */
declare class TwitterAPI {
    apiKey: string;
    /**
     * Constructor for the TwitterAPI class.
     * @param {object} options - The options object.
     * @param {string} options.apiKey - The API key. (Needed for data fetching)
     */
    constructor({ apiKey }: {
        apiKey: string;
    });
    /**
     * Fetch Twitter user details by username.
     * @param {string} twitterUserName - The Twitter username.
     * @returns {Promise<object>} - The user details.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchUserByUsername(twitterUserName: string): Promise<object>;
    /**
     * Fetch tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchTweetsByUsername(twitterUserName: string, page?: number, limit?: number): Promise<object>;
    /**
     * Fetch followers by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The followers.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchFollowersByUsername(twitterUserName: string, page?: number, limit?: number): Promise<object>;
    /**
     * Fetch following by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The following.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchFollowingByUsername(twitterUserName: string, page?: number, limit?: number): Promise<object>;
    /**
     * Fetch tweet by tweet ID.
     * @param {string} tweetId - The tweet ID.
     * @returns {Promise<object>} - The tweet.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchTweetById(tweetId: string): Promise<object>;
    /**
     * Fetch user by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The user data.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchUserByWalletAddress(walletAddress: string, page?: number, limit?: number): Promise<object>;
    /**
     * Fetch reposted tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The reposted tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchRepostedByUsername(twitterUserName: string, page?: number, limit?: number): Promise<object>;
    /**
     * Fetch replies by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The replies.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchRepliesByUsername(twitterUserName: string, page?: number, limit?: number): Promise<object>;
    /**
     * Fetch likes by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The likes.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchLikesByUsername(twitterUserName: string, page?: number, limit?: number): Promise<object>;
    /**
     * Fetch follows by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The follows.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchFollowsByUsername(twitterUserName: string, page?: number, limit?: number): Promise<object>;
    /**
     * Fetch viewed tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The viewed tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchViewedTweetsByUsername(twitterUserName: string, page?: number, limit?: number): Promise<object>;
    /**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */
    _fetchDataWithAuth(url: string): Promise<object>;
}

interface SpotifyAPIOptions {
    apiKey: string;
}
/**
 * The SpotifyAPI class.
 * @class
 */
declare class SpotifyAPI {
    apiKey: string;
    /**
     * Constructor for the SpotifyAPI class.
     * @constructor
     * @param {SpotifyAPIOptions} options - The Spotify API options.
     * @param {string} options.apiKey - The Spotify API key.
     * @throws {Error} - Throws an error if the API key is not provided.
     */
    constructor(options: SpotifyAPIOptions);
    /**
     * Fetch the user's saved tracks by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved tracks.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchSavedTracksById(spotifyId: string): Promise<object>;
    /**
     * Fetch the played tracks of a user by Spotify ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The played tracks.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchPlayedTracksById(spotifyId: string): Promise<object>;
    /**
     * Fetch the user's saved albums by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved albums.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchSavedAlbumsById(spotifyId: string): Promise<object>;
    /**
     * Fetch the user's saved playlists by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved playlists.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchSavedPlaylistsById(spotifyId: string): Promise<object>;
    /**
     * Fetch the tracks of an album by album ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} albumId - The album ID.
     * @returns {Promise<object>} - The tracks in the album.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchTracksInAlbum(spotifyId: string, albumId: string): Promise<object>;
    /**
     * Fetch the tracks in a playlist by playlist ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} playlistId - The playlist ID.
     * @returns {Promise<object>} - The tracks in the playlist.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchTracksInPlaylist(spotifyId: string, playlistId: string): Promise<object>;
    /**
     * Fetch the user's Spotify data by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @returns {Promise<object>} - The user's Spotify data.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchUserByWalletAddress(walletAddress: string): Promise<object>;
    /**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */
    _fetchDataWithAuth(url: string): Promise<object>;
}

/**
 * The TikTokAPI class.
 * @class
 */
declare class TikTokAPI {
    apiKey: string;
    /**
     * Constructor for the TikTokAPI class.
     * @param {object} options - The options object.
     * @param {string} options.apiKey - The Camp API key.
     */
    constructor({ apiKey }: {
        apiKey: string;
    });
    /**
     * Fetch TikTok user details by username.
     * @param {string} tiktokUserName - The TikTok username.
     * @returns {Promise<object>} - The user details.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchUserByUsername(tiktokUserName: string): Promise<object>;
    /**
     * Fetch video details by TikTok username and video ID.
     * @param {string} userHandle - The TikTok username.
     * @param {string} videoId - The video ID.
     * @returns {Promise<object>} - The video details.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchVideoById(userHandle: string, videoId: string): Promise<object>;
    /**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */
    _fetchDataWithAuth(url: string): Promise<object>;
}

/**
 * Storage utility for React Native
 * Wraps AsyncStorage with localStorage-like interface
 * Uses dynamic import to avoid build-time dependency
 */
declare class Storage {
    static getItem(key: string): Promise<string | null>;
    static setItem(key: string, value: string): Promise<void>;
    static removeItem(key: string): Promise<void>;
    static multiGet(keys: string[]): Promise<Array<[string, string | null]>>;
    static multiSet(keyValuePairs: Array<[string, string]>): Promise<void>;
    static multiRemove(keys: string[]): Promise<void>;
}

declare const CampIcon: React.FC<{
    width?: number;
    height?: number;
}>;
declare const CloseIcon: React.FC<{
    width?: number;
    height?: number;
}>;
declare const TwitterIcon: React.FC<{
    width?: number;
    height?: number;
}>;
declare const DiscordIcon: React.FC<{
    width?: number;
    height?: number;
}>;
declare const SpotifyIcon: React.FC<{
    width?: number;
    height?: number;
}>;
declare const TikTokIcon: React.FC<{
    width?: number;
    height?: number;
}>;
declare const TelegramIcon: React.FC<{
    width?: number;
    height?: number;
}>;
declare const CheckMarkIcon: React.FC<{
    width?: number;
    height?: number;
}>;
declare const XMarkIcon: React.FC<{
    width?: number;
    height?: number;
}>;
declare const LinkIcon: React.FC<{
    width?: number;
    height?: number;
}>;
declare const getIconBySocial: (social: string) => React.FC<{
    width?: number;
    height?: number;
}>;

declare const _default: {
    SIWE_MESSAGE_STATEMENT: string;
    AUTH_HUB_BASE_API: string;
    ORIGIN_DASHBOARD: string;
    SUPPORTED_IMAGE_FORMATS: string[];
    SUPPORTED_VIDEO_FORMATS: string[];
    SUPPORTED_AUDIO_FORMATS: string[];
    SUPPORTED_TEXT_FORMATS: string[];
    AVAILABLE_SOCIALS: string[];
    ACKEE_INSTANCE: string;
    ACKEE_EVENTS: {
        USER_CONNECTED: string;
        USER_DISCONNECTED: string;
        TWITTER_LINKED: string;
        DISCORD_LINKED: string;
        SPOTIFY_LINKED: string;
        TIKTOK_LINKED: string;
        TELEGRAM_LINKED: string;
    };
    DATANFT_CONTRACT_ADDRESS: string;
    MARKETPLACE_CONTRACT_ADDRESS: string;
};

/**
 * Makes a GET request to the given URL with the provided headers.
 *
 * @param {string} url - The URL to send the GET request to.
 * @param {object} headers - The headers to include in the request.
 * @returns {Promise<object>} - The response data.
 * @throws {APIError} - Throws an error if the request fails.
 */
declare function fetchData(url: string, headers?: Record<string, string>): Promise<object>;
/**
 * Constructs a query string from an object of query parameters.
 *
 * @param {object} params - An object representing query parameters.
 * @returns {string} - The encoded query string.
 */
declare function buildQueryString(params?: Record<string, any>): string;
/**
 * Builds a complete URL with query parameters.
 *
 * @param {string} baseURL - The base URL of the endpoint.
 * @param {object} params - An object representing query parameters.
 * @returns {string} - The complete URL with query string.
 */
declare function buildURL(baseURL: string, params?: Record<string, any>): string;
declare const baseTwitterURL: string;
declare const baseSpotifyURL: string;
declare const baseTikTokURL: string;
/**
 * Formats an Ethereum address by truncating it to the first and last n characters.
 * @param {string} address - The Ethereum address to format.
 * @param {number} n - The number of characters to keep from the start and end of the address.
 * @return {string} - The formatted address.
 */
declare const formatAddress: (address: string, n?: number) => string;
/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @return {string} - The capitalized string.
 */
declare const capitalize: (str: string) => string;
/**
 * Formats a Camp amount to a human-readable string.
 * @param {number} amount - The Camp amount to format.
 * @returns {string} - The formatted Camp amount.
 */
declare const formatCampAmount: (amount: number) => string;
/**
 * Sends an analytics event to the Ackee server.
 * @param {any} ackee - The Ackee instance.
 * @param {string} event - The event name.
 * @param {string} key - The key for the event.
 * @param {number} value - The value for the event.
 * @returns {Promise<string>} - A promise that resolves with the response from the server.
 */
declare const sendAnalyticsEvent: (ackee: any, event: string, key: string, value: number) => Promise<string>;
interface UploadProgressCallback {
    (percent: number): void;
}
interface UploadWithProgress {
    (file: File, url: string, onProgress: UploadProgressCallback): Promise<string>;
}
/**
 * Uploads a file to a specified URL with progress tracking.
 * Falls back to a simple fetch request if XMLHttpRequest is not available.
 * @param {File} file - The file to upload.
 * @param {string} url - The URL to upload the file to.
 * @param {UploadProgressCallback} onProgress - A callback function to track upload progress.
 * @returns {Promise<string>} - A promise that resolves with the response from the server.
 */
declare const uploadWithProgress: UploadWithProgress;

declare class APIError extends Error {
    statusCode: string | number;
    constructor(message: string, statusCode?: string | number);
    toJSON(): {
        error: string;
        message: string;
        statusCode?: string | number;
    };
}
declare class ValidationError extends Error {
    constructor(message: string);
    toJSON(): {
        error: string;
        message: string;
        statusCode: number;
    };
}

/**
 * TypeScript interfaces for Camp Network React Native SDK
 * Requirements: Section "HOOK INTERFACES REQUIRED" and "COMPONENT INTERFACES"
 */

interface LicenseTerms {
    type: 'commercial' | 'non-commercial' | 'custom';
    price?: string;
    currency?: string;
    terms?: string;
    expiry?: Date;
}
interface IPAssetMetadata {
    title: string;
    description: string;
    tags?: string[];
    category?: string;
    creator?: string;
    originalUrl?: string;
    socialPlatform?: 'twitter' | 'spotify' | 'tiktok';
    [key: string]: any;
}
interface TransactionRequest {
    to: string;
    value?: string;
    data?: string;
    gasLimit?: string;
    gasPrice?: string;
}
interface TransactionResponse {
    hash: string;
    from: string;
    to: string;
    value: string;
    gasUsed: string;
    blockNumber?: number;
    confirmations?: number;
}
/**
 * useCampAuth Hook Interface
 * Requirements: Section "A. useCampAuth Hook"
 */
interface CampAuthHook {
    authenticated: boolean;
    loading: boolean;
    walletAddress: string | null;
    error: string | null;
    connect: () => Promise<{
        success: boolean;
        message: string;
        walletAddress: string;
    }>;
    disconnect: () => Promise<void>;
    clearError: () => void;
    auth: any | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
/**
 * useAppKit Hook Interface
 * Requirements: Section "B. useAppKit Hook"
 */
interface AppKitHook {
    isAppKitConnected: boolean;
    isConnecting: boolean;
    appKitAddress: string | null;
    chainId: number | null;
    openAppKit: () => Promise<string>;
    disconnectAppKit: () => Promise<void>;
    signMessage: (message: string) => Promise<string>;
    switchNetwork: (chainId: number) => Promise<void>;
    sendTransaction: (tx: TransactionRequest) => Promise<TransactionResponse>;
    getBalance: () => Promise<string>;
    getChainId: () => Promise<number>;
    getProvider: () => any;
    subscribeAccount: (callback: (account: any) => void) => () => void;
    subscribeChainId: (callback: (chainId: number) => void) => () => void;
    isConnected: boolean;
    address: string | null;
    balance?: string | null;
    appKit: any;
}
/**
 * useSocials Hook Interface
 * Requirements: Section "C. useSocials Hook"
 */
interface SocialsHook {
    socials: Record<string, boolean>;
    isLoading: boolean;
    error: Error | null;
    linkSocial: (platform: 'twitter' | 'discord' | 'spotify') => Promise<void>;
    unlinkSocial: (platform: 'twitter' | 'discord' | 'spotify') => Promise<void>;
    refetch: () => Promise<void>;
    data: Record<string, boolean>;
}
/**
 * useOrigin Hook Interface
 * Requirements: Section "D. useOrigin Hook"
 */
interface OriginHook {
    stats: {
        data: any;
        isLoading: boolean;
        isError: boolean;
        error: Error | null;
        refetch: () => Promise<void>;
    };
    uploads: {
        data: any[];
        isLoading: boolean;
        isError: boolean;
        error: Error | null;
        refetch: () => Promise<void>;
    };
    createIPAsset: (file: File, metadata: IPAssetMetadata, license: LicenseTerms) => Promise<string>;
    createSocialIPAsset: (source: 'twitter' | 'spotify', license: LicenseTerms) => Promise<string>;
    mintFile: (file: any, metadata: any, license: any, parentId?: bigint) => Promise<any>;
}
/**
 * CampButton Component Interface
 * Requirements: Section "A. CampButton Component"
 */
interface CampButtonProps {
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    style?: any;
    authenticated?: boolean;
}
/**
 * CampModal Component Interface
 * Requirements: Section "B. CampModal Component"
 */
interface CampModalProps {
    visible?: boolean;
    onClose?: () => void;
    children?: React.ReactNode;
}
interface CampContextType {
    auth: any | null;
    setAuth: React.Dispatch<React.SetStateAction<any | null>>;
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
interface WalletConnectConfig {
    projectId: string;
    metadata: {
        name: string;
        description: string;
        url: string;
        icons: string[];
    };
    featuredWalletIds?: string[];
}
declare const FEATURED_WALLET_IDS: {
    readonly METAMASK: "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96";
    readonly RAINBOW: "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369";
    readonly COINBASE: "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa";
};
declare const DEFAULT_PROJECT_ID = "83d0addc08296ab3d8a36e786dee7f48";

/**
 * Standardized Error Types for Camp Network React Native SDK
 * Requirements: Section "ERROR HANDLING REQUIREMENTS"
 */
declare class CampSDKError extends Error {
    code: string;
    details?: any;
    constructor(message: string, code: string, details?: any);
}
declare const ErrorCodes: {
    readonly WALLET_NOT_CONNECTED: "WALLET_NOT_CONNECTED";
    readonly AUTHENTICATION_FAILED: "AUTHENTICATION_FAILED";
    readonly TRANSACTION_REJECTED: "TRANSACTION_REJECTED";
    readonly NETWORK_ERROR: "NETWORK_ERROR";
    readonly SOCIAL_LINKING_FAILED: "SOCIAL_LINKING_FAILED";
    readonly IP_CREATION_FAILED: "IP_CREATION_FAILED";
    readonly APPKIT_NOT_INITIALIZED: "APPKIT_NOT_INITIALIZED";
    readonly MODULE_RESOLUTION_ERROR: "MODULE_RESOLUTION_ERROR";
    readonly PROVIDER_CONFLICT: "PROVIDER_CONFLICT";
};
declare const createWalletNotConnectedError: (details?: any) => CampSDKError;
declare const createAuthenticationFailedError: (message?: string, details?: any) => CampSDKError;
declare const createTransactionRejectedError: (details?: any) => CampSDKError;
declare const createNetworkError: (message?: string, details?: any) => CampSDKError;
declare const createSocialLinkingFailedError: (provider: string, details?: any) => CampSDKError;
declare const createIPCreationFailedError: (details?: any) => CampSDKError;
declare const createAppKitNotInitializedError: (details?: any) => CampSDKError;
declare const withRetry: <T>(fn: () => Promise<T>, maxRetries?: number, delay?: number) => Promise<T>;

export { APIError, type AppKitHook, AuthRN, type CampAuthHook, CampButton, type CampButtonProps, CampContext, type CampContextType, CampIcon, CampModal, type CampModalProps, CampProvider, CampSDKError, CheckMarkIcon, CloseIcon, DEFAULT_PROJECT_ID, DiscordIcon, ErrorCodes, FEATURED_WALLET_IDS, type IPAssetMetadata, type LicenseTerms, LinkIcon, Origin, type OriginHook, type SocialsHook, SpotifyAPI, SpotifyIcon, Storage, TelegramIcon, TikTokAPI, TikTokIcon, type TransactionRequest, type TransactionResponse, TwitterAPI, TwitterIcon, ValidationError, type WalletConnectConfig, XMarkIcon, baseSpotifyURL, baseTikTokURL, baseTwitterURL, buildQueryString, buildURL, capitalize, _default as constants, createAppKitNotInitializedError, createAuthenticationFailedError, createIPCreationFailedError, createNetworkError, createSocialLinkingFailedError, createTransactionRejectedError, createWalletNotConnectedError, fetchData, formatAddress, formatCampAmount, getIconBySocial, sendAnalyticsEvent, uploadWithProgress, useAppKit, useAuthState, useCamp, useCampAuth, useModal, useOrigin, useSocials, withRetry };
