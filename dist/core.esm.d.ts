import { Address, Hex, Abi } from 'viem';

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
 * Represents the terms of a license for a digital asset.
 * @property price - The price of the asset in wei.
 * @property duration - The duration of the license in seconds.
 * @property royaltyBps - The royalty percentage in basis points (0-10000).
 * @property paymentToken - The address of the payment token (ERC20 / address(0) for native currency).
 */
type LicenseTerms = {
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
declare function mintWithSignature(this: Origin, to: Address, tokenId: bigint, parentId: bigint, hash: Hex, uri: string, licenseTerms: LicenseTerms, deadline: bigint, signature: Hex): Promise<any>;
/**
 * Registers a Data NFT with the Origin service in order to obtain a signature for minting.
 * @param source The source of the Data NFT (e.g., "spotify", "twitter", "tiktok", or "file").
 * @param deadline The deadline for the registration operation.
 * @param fileKey Optional file key for file uploads.
 * @return A promise that resolves with the registration data.
 */
declare function registerIpNFT(this: Origin, source: IpNFTSource, deadline: bigint, licenseTerms: LicenseTerms, metadata: Record<string, unknown>, fileKey?: string | string[], parentId?: bigint): Promise<any>;

declare function updateTerms(this: Origin, tokenId: bigint, newTerms: LicenseTerms): Promise<any>;

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

declare function buyAccess(this: Origin, tokenId: bigint, periods: number, value?: bigint): Promise<any>;

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
    mintFile: (file: File, metadata: Record<string, unknown>, license: LicenseTerms, parentId?: bigint, options?: {
        progressCallback?: (percent: number) => void;
    }) => Promise<string | null>;
    mintSocial: (source: "spotify" | "twitter" | "tiktok", license: LicenseTerms) => Promise<string | null>;
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
    origin: Origin | null;
    /**
     * Constructor for the Auth class.
     * @param {object} options The options object.
     * @param {string} options.clientId The client ID.
     * @param {string|object} options.redirectUri The redirect URI used for oauth. Leave empty if you want to use the current URL. If you want different redirect URIs for different socials, pass an object with the socials as keys and the redirect URIs as values.
     * @param {boolean} [options.allowAnalytics=true] Whether to allow analytics to be sent.
     * @param {object} [options.ackeeInstance] The Ackee instance.
     * @throws {APIError} - Throws an error if the clientId is not provided.
     */
    constructor({ clientId, redirectUri, allowAnalytics, ackeeInstance, }: {
        clientId: string;
        redirectUri: string | Record<string, string>;
        allowAnalytics?: boolean;
        ackeeInstance?: any;
    });
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
     * Set the provider. This is useful for setting the provider when the user selects a provider from the UI or when dApp wishes to use a specific provider.
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
     * Set the wallet address. This is useful for edge cases where the provider can't return the wallet address. Don't use this unless you know what you're doing.
     * @param {string} walletAddress The wallet address.
     * @returns {void}
     */
    setWalletAddress(walletAddress: string): void;
    recoverProvider(): Promise<void>;
    /**
     * Disconnect the user.
     * @returns {Promise<void>}
     */
    disconnect(): Promise<void>;
    /**
     * Connect the user's wallet and sign the message.
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
     * @example
     * const auth = new Auth({ clientId: "your-client-id" });
     * const socials = await auth.getLinkedSocials();
     * console.log(socials);
     */
    getLinkedSocials(): Promise<Record<string, boolean>>;
    /**
     * Link the user's Twitter account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */
    linkTwitter(): Promise<void>;
    /**
     * Link the user's Discord account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */
    linkDiscord(): Promise<void>;
    /**
     * Link the user's Spotify account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */
    linkSpotify(): Promise<void>;
    /**
     * Link the user's TikTok account.
     * @param {string} handle The user's TikTok handle.
     * @returns {Promise<any>} A promise that resolves with the TikTok account data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */
    linkTikTok(handle: string): Promise<any>;
    /**
     * Send an OTP to the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @returns {Promise<any>} A promise that resolves with the OTP data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */
    sendTelegramOTP(phoneNumber: string): Promise<any>;
    /**
     * Link the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @param {string} otp The OTP.
     * @param {string} phoneCodeHash The phone code hash.
     * @returns {Promise<object>} A promise that resolves with the Telegram account data.
     * @throws {APIError|Error} - Throws an error if the user is not authenticated. Also throws an error if the phone number, OTP, and phone code hash are not provided.
     */
    linkTelegram(phoneNumber: string, otp: string, phoneCodeHash: string): Promise<any>;
    /**
     * Unlink the user's Twitter account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */
    unlinkTwitter(): Promise<any>;
    /**
     * Unlink the user's Discord account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */
    unlinkDiscord(): Promise<any>;
    /**
     * Unlink the user's Spotify account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */
    unlinkSpotify(): Promise<any>;
    /**
     * Unlink the user's TikTok account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */
    unlinkTikTok(): Promise<any>;
    /**
     * Unlink the user's Telegram account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */
    unlinkTelegram(): Promise<any>;
}

export { Auth, SpotifyAPI, TwitterAPI };
