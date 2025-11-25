import { WalletClient, Account, Chain, Address, Hex, Abi } from 'viem';

interface BaseSigner {
    getAddress(): Promise<string>;
    signMessage(message: string): Promise<string>;
    signTypedData?(domain: any, types: any, value: any): Promise<string>;
    getChainId(): Promise<number>;
}
type SignerType = "viem" | "ethers" | "custom";
interface SignerAdapter {
    type: SignerType;
    signer: any;
    getAddress(): Promise<string>;
    signMessage(message: string): Promise<string>;
    signTypedData(domain: any, types: any, value: any): Promise<string>;
    getChainId(): Promise<number>;
}

/**
 * Adapter for viem WalletClient
 */
declare class ViemSignerAdapter implements SignerAdapter {
    type: SignerType;
    signer: WalletClient;
    constructor(signer: WalletClient);
    getAddress(): Promise<string>;
    signMessage(message: string): Promise<string>;
    signTypedData(domain: any, types: any, value: any): Promise<string>;
    getChainId(): Promise<number>;
}
/**
 * Adapter for ethers Signer (v5 and v6)
 */
declare class EthersSignerAdapter implements SignerAdapter {
    type: SignerType;
    signer: any;
    constructor(signer: any);
    getAddress(): Promise<string>;
    signMessage(message: string): Promise<string>;
    signTypedData(domain: any, types: any, value: any): Promise<string>;
    getChainId(): Promise<number>;
}
/**
 * Adapter for custom signer implementations
 */
declare class CustomSignerAdapter implements SignerAdapter {
    type: SignerType;
    signer: any;
    constructor(signer: any);
    getAddress(): Promise<string>;
    signMessage(message: string): Promise<string>;
    signTypedData(domain: any, types: any, value: any): Promise<string>;
    getChainId(): Promise<number>;
}
/**
 * Factory function to create appropriate adapter based on signer type
 */
declare function createSignerAdapter(signer: any): SignerAdapter;

interface StorageAdapter {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
}
/**
 * Browser localStorage adapter
 */
declare class BrowserStorage implements StorageAdapter {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
}
/**
 * In-memory storage adapter for Node.js
 */
declare class MemoryStorage implements StorageAdapter {
    private storage;
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
    clear(): void;
}

/**
 * Create a wallet client for Node.js environment
 * @param account The viem account
 * @param chain The chain to use
 * @param rpcUrl Optional RPC URL (defaults to chain's default RPC)
 * @returns WalletClient
 */
declare function createNodeWalletClient(account: Account, chain: Chain, rpcUrl?: string): WalletClient;

declare const testnet: {
    id: number;
    name: string;
    nativeCurrency: {
        decimals: number;
        name: string;
        symbol: string;
    };
    rpcUrls: {
        default: {
            http: string[];
        };
    };
    blockExplorers: {
        default: {
            name: string;
            url: string;
        };
    };
};
declare const mainnet: {
    id: number;
    name: string;
    nativeCurrency: {
        decimals: number;
        name: string;
        symbol: string;
    };
    rpcUrls: {
        default: {
            http: string[];
        };
    };
    blockExplorers: {
        default: {
            name: string;
            url: string;
        };
    };
};

interface Environment {
    NAME: string;
    AUTH_HUB_BASE_API: string;
    AUTH_ENDPOINT: string;
    ORIGIN_DASHBOARD: string;
    DATANFT_CONTRACT_ADDRESS: string;
    MARKETPLACE_CONTRACT_ADDRESS: string;
    CHAIN: any;
    IPNFT_ABI?: any;
    MARKETPLACE_ABI?: any;
    ROYALTY_VAULT_ABI?: any;
    TBA_ABI?: any;
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
 * Creates license terms for a digital asset.
 * @param price The price of the asset in wei.
 * @param duration The duration of the license in seconds.
 * @param royaltyBps The royalty percentage in basis points (0-10000).
 * @param paymentToken The address of the payment token (ERC20 / address(0) for native currency).
 * @returns The created license terms.
 */
declare const createLicenseTerms: (price: bigint, duration: number, royaltyBps: number, paymentToken: Address) => LicenseTerms;
/**
 * Represents the source of an IpNFT.
 * This can be one of the supported social media platforms or a file upload.
 */
type IpNFTSource = "spotify" | "twitter" | "tiktok" | "file";

/**
 * Mints a Data NFT with a signature.
 * @param to The address to mint the NFT to.
 * @param tokenId The ID of the token to mint.
 * @param parents The IDs of the parent NFTs, if applicable.
 * @param isIp Whether the NFT is an IP NFT.
 * @param hash The hash of the data associated with the NFT.
 * @param uri The URI of the NFT metadata.
 * @param licenseTerms The terms of the license for the NFT.
 * @param deadline The deadline for the minting operation.
 * @param signature The signature for the minting operation.
 * @returns A promise that resolves when the minting is complete.
 */
declare function mintWithSignature(this: Origin, to: Address, tokenId: bigint, parents: bigint[], isIp: boolean, hash: Hex, uri: string, licenseTerms: LicenseTerms, deadline: bigint, signature: Hex): Promise<any>;
/**
 * Registers a Data NFT with the Origin service in order to obtain a signature for minting.
 * @param source The source of the Data NFT (e.g., "spotify", "twitter", "tiktok", or "file").
 * @param deadline The deadline for the registration operation.
 * @param licenseTerms The terms of the license for the NFT.
 * @param metadata The metadata associated with the NFT.
 * @param fileKey The file key(s) if the source is "file".
 * @param parents The IDs of the parent NFTs, if applicable.
 * @return A promise that resolves with the registration data.
 */
declare function registerIpNFT(this: Origin, source: IpNFTSource, deadline: bigint, licenseTerms: LicenseTerms, metadata: Record<string, unknown>, fileKey?: string | string[], parents?: bigint[]): Promise<any>;

/**
 * Updates the license terms of a specified IPNFT.
 * @param tokenId The ID of the IPNFT to update.
 * @param newTerms The new license terms to set.
 * @returns A promise that resolves when the transaction is complete.
 */
declare function updateTerms(this: Origin, tokenId: bigint, newTerms: LicenseTerms): Promise<any>;

/**
 * Sets the IPNFT as deleted
 * @param tokenId The token ID to set as deleted.
 * @returns A promise that resolves when the transaction is complete.
 */
declare function finalizeDelete(this: Origin, tokenId: bigint): Promise<any>;

/**
 * Calls the getOrCreateRoyaltyVault method on the IPNFT contract.
 * @param tokenOwner The address of the token owner for whom to get or create the royalty vault.
 * @param simulateOnly If true, simulates the transaction without executing it.
 * @returns The address of the royalty vault associated with the specified token owner.
 */
declare function getOrCreateRoyaltyVault(this: Origin, tokenOwner: Address, simulateOnly?: boolean): Promise<Address>;

/**
 * Returns the license terms associated with a specific token ID.
 * @param tokenId The token ID to query.
 * @returns The license terms of the token ID.
 */
declare function getTerms(this: Origin, tokenId: bigint): Promise<any>;

/**
 * Returns the owner of the specified IPNFT.
 * @param tokenId The ID of the IPNFT to query.
 * @returns The address of the owner of the IPNFT.
 */
declare function ownerOf(this: Origin, tokenId: bigint): Promise<any>;

/**
 * Returns the number of IPNFTs owned by the given address.
 * @param owner The address to query.
 * @returns The number of IPNFTs owned by the address.
 */
declare function balanceOf(this: Origin, owner: Address): Promise<any>;

/**
 * Returns the metadata URI associated with a specific token ID.
 * @param tokenId The token ID to query.
 * @returns The metadata URI of the token ID.
 */
declare function tokenURI(this: Origin, tokenId: bigint): Promise<any>;

/**
 * Returns the data status of the given token ID.
 * @param tokenId The token ID to query.
 * @returns The data status of the token ID.
 */
declare function dataStatus(this: Origin, tokenId: bigint): Promise<DataStatus>;

/**
 * Checks if an operator is approved to manage all assets of a given owner.
 * @param owner The address of the asset owner.
 * @param operator The address of the operator to check.
 * @return A promise that resolves to a boolean indicating if the operator is approved for all assets of the owner.
 */
declare function isApprovedForAll(this: Origin, owner: Address, operator: Address): Promise<boolean>;

declare function transferFrom(this: Origin, from: Address, to: Address, tokenId: bigint): Promise<any>;

declare function safeTransferFrom(this: Origin, from: Address, to: Address, tokenId: bigint, data?: Hex): Promise<any>;

declare function approve(this: Origin, to: Address, tokenId: bigint): Promise<any>;

declare function setApprovalForAll(this: Origin, operator: Address, approved: boolean): Promise<any>;

/**
 * Buys access to a data NFT for a specified duration.
 * @param buyer The address of the buyer.
 * @param tokenId The ID of the data NFT.
 * @param expectedPrice The expected price for the access.
 * @param expectedDuration The expected duration of the access in seconds.
 * @param expectedPaymentToken The address of the payment token (use zero address for native token).
 * @param value The amount of native token to send (only required if paying with native token).
 * @returns A promise that resolves when the transaction is confirmed.
 */
declare function buyAccess(this: Origin, buyer: Address, tokenId: bigint, expectedPrice: bigint, expectedDuration: bigint, expectedPaymentToken: Address, value?: bigint): Promise<any>;

/**
 * Checks if a user has access to a specific token based on subscription expiry.
 * @param user - The address of the user.
 * @param tokenId - The ID of the token.
 * @returns A promise that resolves to a boolean indicating if the user has access.
 */
declare function hasAccess(this: Origin, user: Address, tokenId: bigint): Promise<boolean>;

declare function subscriptionExpiry(this: Origin, tokenId: bigint, user: Address): Promise<bigint>;

/**
 * Response from getDataWithX402 when payment is required
 */
interface X402Response {
    error: string;
    marketplaceAction?: {
        kind: string;
        contract: Address;
        network: string;
        chainId: number;
        method: string;
        payer: Address;
        payTo: Address;
        tokenId: string;
        duration: number;
        asset: Address;
        amount: string;
        amountFormatted: string;
    };
}
interface TransactionResult {
    txHash: string;
    receipt?: any;
}
/**
 * EXPERIMENTAL METHOD
 * Settles a payment intent response by purchasing access if needed.
 * This method checks if the user already has access to the item, and if not,
 * it calls buyAccess with the parameters from the payment intent response.
 * Supports viem WalletClient, ethers Signer, and custom signer implementations.
 *
 * @param paymentIntentResponse - The response from getDataWithIntent containing payment details.
 * @param signer - Optional signer object used to interact with the blockchain. If not provided, uses the connected wallet client.
 * @returns A promise that resolves with the transaction hash and receipt, or null if access already exists.
 * @throws {Error} If the response doesn't contain marketplace action or if the method is not buyAccess.
 */
declare function settlePaymentIntent(this: Origin, paymentIntentResponse: X402Response, signer?: any): Promise<TransactionResult | null>;

/**
 * EXPERIMENTAL METHOD
 * Fetch data with X402 payment handling.
 * @param {bigint} tokenId The token ID to fetch data for.
 * @param {any} [signer] Optional signer object for signing the X402 intent.
 * @returns {Promise<any>} A promise that resolves with the fetched data.
 * @throws {Error} Throws an error if the data cannot be fetched or if no signer/wallet client is provided.
 */
declare function getDataWithIntent(this: Origin, tokenId: bigint, signer?: any, decide?: (terms: any) => Promise<boolean>): Promise<any>;

interface RoyaltyInfo {
    tokenBoundAccount: Address;
    balance: bigint;
    balanceFormatted: string;
}
type CallOptions = {
    value?: bigint;
    gas?: bigint;
    waitForReceipt?: boolean;
    simulate?: boolean;
};
/**
 * The Origin class
 * Handles interactions with Origin protocol.
 */
declare class Origin {
    #private;
    mintWithSignature: typeof mintWithSignature;
    registerIpNFT: typeof registerIpNFT;
    updateTerms: typeof updateTerms;
    finalizeDelete: typeof finalizeDelete;
    getOrCreateRoyaltyVault: typeof getOrCreateRoyaltyVault;
    getTerms: typeof getTerms;
    ownerOf: typeof ownerOf;
    balanceOf: typeof balanceOf;
    tokenURI: typeof tokenURI;
    dataStatus: typeof dataStatus;
    isApprovedForAll: typeof isApprovedForAll;
    transferFrom: typeof transferFrom;
    safeTransferFrom: typeof safeTransferFrom;
    approve: typeof approve;
    setApprovalForAll: typeof setApprovalForAll;
    buyAccess: typeof buyAccess;
    hasAccess: typeof hasAccess;
    subscriptionExpiry: typeof subscriptionExpiry;
    settlePaymentIntent: typeof settlePaymentIntent;
    getDataWithIntent: typeof getDataWithIntent;
    private jwt?;
    environment: Environment;
    private viemClient?;
    baseParentId?: bigint;
    constructor(environment?: Environment | string, jwt?: string, viemClient?: WalletClient, baseParentId?: bigint);
    getJwt(): string | undefined;
    setViemClient(client: WalletClient): void;
    /**
     * Mints a file-based IpNFT.
     * @param file The file to mint.
     * @param metadata The metadata associated with the file.
     * @param license The license terms for the IpNFT.
     * @param parents Optional parent token IDs for lineage tracking.
     * @param options Optional parameters including progress callback, preview image, and use asset as preview flag.
     * @returns The token ID of the minted IpNFT as a string, or null if minting failed.
     */
    mintFile(file: File, metadata: Record<string, unknown>, license: LicenseTerms, parents?: bigint[], options?: {
        progressCallback?: (percent: number) => void;
        previewImage?: File | null;
        useAssetAsPreview?: boolean;
    }): Promise<string | null>;
    /**
     * Mints a social IpNFT.
     * @param source The social media source (spotify, twitter, tiktok).
     * @param metadata The metadata associated with the social media content.
     * @param license The license terms for the IpNFT.
     * @return The token ID of the minted IpNFT as a string, or null if minting failed.
     */
    mintSocial(source: "spotify" | "twitter" | "tiktok", metadata: Record<string, unknown>, license: LicenseTerms): Promise<string | null>;
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
     * @returns {Promise<any>} The result of the buyAccess call.
     */
    buyAccessSmart(tokenId: bigint): Promise<any>;
    /**
     * Fetch the underlying data associated with a specific token ID.
     * @param {bigint} tokenId - The token ID to fetch data for.
     * @returns {Promise<any>} A promise that resolves with the fetched data.
     * @throws {Error} Throws an error if the data cannot be fetched.
     */
    getData(tokenId: bigint): Promise<any>;
    /**
     * Get the Token Bound Account (TBA) address for a specific token ID.
     * @param {bigint} tokenId - The token ID to get the TBA address for.
     * @returns {Promise<Address>} A promise that resolves with the TBA address.
     * @throws {Error} Throws an error if the TBA address cannot be retrieved.
     * @example
     * ```typescript
     * const tbaAddress = await origin.getTokenBoundAccount(1n);
     * console.log(`TBA Address: ${tbaAddress}`);
     * ```
     */
    getTokenBoundAccount(tokenId: bigint): Promise<Address>;
    /**
     * Get royalty information for a token ID, including the token bound account address and its balance.
     * @param {bigint} tokenId - The token ID to check royalties for.
     * @param {Address} [token] - Optional token address to check royalties for. If not provided, checks for native token.
     * @returns {Promise<RoyaltyInfo>} A promise that resolves with the token bound account address and balance information.
     * @throws {Error} Throws an error if the token bound account cannot be retrieved.
     * @example
     * ```typescript
     * // Get royalties for a specific token
     * const royalties = await origin.getRoyalties(1n);
     *
     * // Get ERC20 token royalties for a specific token
     * const royalties = await origin.getRoyalties(1n, "0x1234...");
     * ```
     */
    getRoyalties(tokenId: bigint, token?: Address): Promise<RoyaltyInfo>;
    /**
     * Claim royalties from a token's Token Bound Account (TBA).
     * @param {bigint} tokenId - The token ID to claim royalties from.
     * @param {Address} [recipient] - Optional recipient address. If not provided, uses the connected wallet.
     * @param {Address} [token] - Optional token address to claim royalties in. If not provided, claims in native token.
     * @returns {Promise<any>} A promise that resolves when the claim transaction is confirmed.
     * @throws {Error} Throws an error if no wallet is connected and no recipient address is provided.
     * @example
     * ```typescript
     * // Claim native token royalties for token #1 to connected wallet
     * await origin.claimRoyalties(1n);
     *
     * // Claim ERC20 token royalties to a specific address
     * await origin.claimRoyalties(1n, "0xRecipient...", "0xToken...");
     * ```
     */
    claimRoyalties(tokenId: bigint, recipient?: Address, token?: Address): Promise<any>;
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
    environment: Environment;
    baseParentId?: bigint;
    /**
     * Constructor for the Auth class.
     * @param {object} options The options object.
     * @param {string} options.clientId The client ID.
     * @param {string|object} options.redirectUri The redirect URI used for oauth. Leave empty if you want to use the current URL. If you want different redirect URIs for different socials, pass an object with the socials as keys and the redirect URIs as values.
     * @param {("DEVELOPMENT"|"PRODUCTION")} [options.environment="DEVELOPMENT"] The environment to use.
     * @param {StorageAdapter} [options.storage] Custom storage adapter. Defaults to localStorage in browser, memory storage in Node.js.
     * @throws {APIError} - Throws an error if the clientId is not provided.
     */
    constructor({ clientId, redirectUri, environment, baseParentId, storage, }: {
        clientId: string;
        redirectUri: string | Record<string, string>;
        environment?: "DEVELOPMENT" | "PRODUCTION";
        baseParentId?: bigint;
        storage?: StorageAdapter;
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
     * Unsubscribe from an event. Possible events are "state", "provider", "providers", and "viem".
     * @param {("state"|"provider"|"providers"|"viem")} event The event.
     * @param {function} callback The callback function.
     * @returns {void}
     */
    off(event: "state" | "provider" | "providers" | "viem", callback: Function): void;
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
    /**
     * Recover the provider from local storage.
     * @returns {Promise<void>}
     */
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
     * Connect with a custom signer (for Node.js or custom wallet implementations).
     * This method bypasses browser wallet interactions and uses the provided signer directly.
     * @param {any} signer The signer instance (viem WalletClient, ethers Signer, or custom signer).
     * @param {object} [options] Optional configuration.
     * @param {string} [options.domain] The domain to use in SIWE message (defaults to 'localhost').
     * @param {string} [options.uri] The URI to use in SIWE message (defaults to 'http://localhost').
     * @returns {Promise<{ success: boolean; message: string; walletAddress: string }>} A promise that resolves with the authentication result.
     * @throws {APIError} - Throws an error if authentication fails.
     * @example
     * // Using with ethers
     * const signer = new ethers.Wallet(privateKey, provider);
     * await auth.connectWithSigner(signer, { domain: 'myapp.com', uri: 'https://myapp.com' });
     *
     * // Using with viem
     * const account = privateKeyToAccount('0x...');
     * const client = createWalletClient({ account, chain: mainnet, transport: http() });
     * await auth.connectWithSigner(client);
     */
    connectWithSigner(signer: any, options?: {
        domain?: string;
        uri?: string;
    }): Promise<{
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
     * @throws {Error} - Throws an error if the user is not authenticated or in Node.js environment.
     */
    linkTwitter(): Promise<void>;
    /**
     * Link the user's Discord account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated or in Node.js environment.
     */
    linkDiscord(): Promise<void>;
    /**
     * Link the user's Spotify account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated or in Node.js environment.
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

export { Auth, type BaseSigner, BrowserStorage, CustomSignerAdapter, DataStatus, EthersSignerAdapter, type LicenseTerms, MemoryStorage, Origin, type SignerAdapter, type SignerType, type StorageAdapter, ViemSignerAdapter, mainnet as campMainnet, testnet as campTestnet, createLicenseTerms, createNodeWalletClient, createSignerAdapter };
