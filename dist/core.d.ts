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
    BATCH_PURCHASE_CONTRACT_ADDRESS: string;
    DISPUTE_CONTRACT_ADDRESS?: string;
    FRACTIONALIZER_CONTRACT_ADDRESS?: string;
    APP_REGISTRY_CONTRACT_ADDRESS?: string;
    CHAIN: any;
    IPNFT_ABI?: any;
    MARKETPLACE_ABI?: any;
    TBA_ABI?: any;
    BATCH_PURCHASE_ABI?: any;
    DISPUTE_ABI?: any;
    FRACTIONALIZER_ABI?: any;
    APP_REGISTRY_ABI?: any;
}

/**
 * Enum representing the type of license for an IP NFT.
 * - DURATION_BASED: License expires after a set duration (subscription model).
 * - SINGLE_PAYMENT: One-time payment for perpetual access.
 * - X402: HTTP 402-based micropayment license (no on-chain payments).
 */
declare enum LicenseType {
    DURATION_BASED = 0,
    SINGLE_PAYMENT = 1,
    X402 = 2
}
/**
 * Represents the terms of a license for a digital asset.
 * @property price - The price of the asset in wei.
 * @property duration - The duration of the license in seconds (0 for SINGLE_PAYMENT and X402).
 * @property royaltyBps - The royalty percentage in basis points (0-10000).
 * @property paymentToken - The address of the payment token (ERC20 / address(0) for native currency).
 * @property licenseType - The type of license (DURATION_BASED, SINGLE_PAYMENT, or X402).
 */
type LicenseTerms = {
    price: bigint;
    duration: number;
    royaltyBps: number;
    paymentToken: Address;
    licenseType: LicenseType;
};
/**
 * Enum representing the status of data in the system.
 * - ACTIVE: The data is currently active and available.
 * - DELETED: The data has been deleted and is no longer available.
 * - DISPUTED: The data has been disputed and marked as potentially infringing.
 */
declare enum DataStatus {
    ACTIVE = 0,
    DELETED = 1,
    DISPUTED = 2
}
/**
 * Enum representing the status of a dispute.
 * - Uninitialized: Dispute does not exist.
 * - Raised: Dispute has been raised but not yet asserted by IP owner.
 * - Asserted: IP owner has responded to the dispute.
 * - Resolved: Dispute has been resolved (either valid or invalid).
 * - Cancelled: Dispute was cancelled by the initiator.
 */
declare enum DisputeStatus {
    Uninitialized = 0,
    Raised = 1,
    Asserted = 2,
    Resolved = 3,
    Cancelled = 4
}
/**
 * Represents a dispute against an IP NFT.
 */
interface Dispute {
    initiator: Address;
    targetId: bigint;
    disputeTag: Hex;
    disputeEvidenceHash: Hex;
    counterEvidenceHash: Hex;
    disputeTimestamp: bigint;
    assertionTimestamp: bigint;
    yesVotes: bigint;
    noVotes: bigint;
    status: DisputeStatus;
    bondAmount: bigint;
    protocolFeeAmount: bigint;
}
/**
 * Represents app information from the AppRegistry.
 */
interface AppInfo {
    treasury: Address;
    revenueShareBps: number;
    isActive: boolean;
}
/**
 * Comprehensive token information returned by getTokenInfoSmart.
 */
interface TokenInfo {
    tokenId: bigint;
    owner: Address;
    uri: string;
    status: DataStatus;
    terms: LicenseTerms;
    hasAccess: boolean;
    accessExpiry: bigint | null;
    appId: string;
}
/**
 * Creates license terms for a digital asset.
 * @param price The price of the asset in wei.
 * @param duration The duration of the license in seconds (use 0 for SINGLE_PAYMENT and X402).
 * @param royaltyBps The royalty percentage in basis points (0-10000).
 * @param paymentToken The address of the payment token (ERC20 / address(0) for native currency).
 * @param licenseType The type of license (defaults to DURATION_BASED).
 * @returns The created license terms.
 */
declare const createLicenseTerms: (price: bigint, duration: number, royaltyBps: number, paymentToken: Address, licenseType?: LicenseType) => LicenseTerms;
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
 * @param appId Optional app ID for the minting operation. Defaults to the SDK's appId (clientId).
 * @returns A promise that resolves when the minting is complete.
 */
declare function mintWithSignature(this: Origin, to: Address, tokenId: bigint, parents: bigint[], isIp: boolean, hash: Hex, uri: string, licenseTerms: LicenseTerms, deadline: bigint, signature: Hex, appId?: string): Promise<any>;
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
 * @param expectedProtocolFeeBps The expected protocol fee in basis points (0-10000). Defaults to 0.
 * @param expectedAppFeeBps The expected app fee in basis points (0-10000). Defaults to 0.
 * @param value The amount of native token to send (only required if paying with native token).
 * @returns A promise that resolves when the transaction is confirmed.
 */
declare function buyAccess(this: Origin, buyer: Address, tokenId: bigint, expectedPrice: bigint, expectedDuration: bigint, expectedPaymentToken: Address, expectedProtocolFeeBps?: number, expectedAppFeeBps?: number, value?: bigint): Promise<any>;

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

/**
 * Raises a dispute against an IP NFT.
 * Requires the caller to have the dispute bond amount in dispute tokens.
 *
 * @param targetIpId The token ID of the IP NFT to dispute.
 * @param evidenceHash The hash of evidence supporting the dispute.
 * @param disputeTag A tag identifying the type of dispute.
 * @returns A promise that resolves with the transaction result including the dispute ID.
 *
 * @example
 * ```typescript
 * const result = await origin.raiseDispute(
 *   1n,
 *   "0x1234...", // evidence hash
 *   "0x5678..." // dispute tag (e.g., "infringement", "fraud")
 * );
 * ```
 */
declare function raiseDispute(this: Origin, targetIpId: bigint, evidenceHash: Hex, disputeTag: Hex): Promise<any>;

/**
 * Asserts a dispute as the IP owner with counter-evidence.
 * Must be called by the owner of the disputed IP within the cooldown period.
 *
 * @param disputeId The ID of the dispute to assert.
 * @param counterEvidenceHash The hash of evidence countering the dispute.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * await origin.disputeAssertion(1n, "0x1234..."); // counter-evidence hash
 * ```
 */
declare function disputeAssertion(this: Origin, disputeId: bigint, counterEvidenceHash: Hex): Promise<any>;

/**
 * Votes on a dispute as a CAMP token staker.
 * Only users who staked before the dispute was raised can vote.
 * Requires the caller to have voting power >= staking threshold.
 *
 * @param disputeId The ID of the dispute to vote on.
 * @param support True to vote in favor of the dispute, false to vote against.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * // Vote in favor of the dispute
 * await origin.voteOnDispute(1n, true);
 *
 * // Vote against the dispute
 * await origin.voteOnDispute(1n, false);
 * ```
 */
declare function voteOnDispute(this: Origin, disputeId: bigint, support: boolean): Promise<any>;

/**
 * Resolves a dispute after the voting period has ended.
 * Can be called by anyone - resolution is deterministic based on votes and quorum.
 * If the dispute is valid, the IP is marked as disputed and bond is returned.
 * If invalid, the bond is split between the IP owner and resolver (protocol fee to caller).
 *
 * @param disputeId The ID of the dispute to resolve.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * await origin.resolveDispute(1n);
 * ```
 */
declare function resolveDispute(this: Origin, disputeId: bigint): Promise<any>;

/**
 * Cancels a dispute that is still in the raised state.
 * Can only be called by the dispute initiator during the cooldown period.
 * The bond is returned to the initiator.
 *
 * @param disputeId The ID of the dispute to cancel.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * await origin.cancelDispute(1n);
 * ```
 */
declare function cancelDispute(this: Origin, disputeId: bigint): Promise<any>;

/**
 * Tags a child IP as disputed if its parent has been successfully disputed.
 * This propagates the dispute status to derivative IPs.
 *
 * @param childIpId The token ID of the child IP to tag.
 * @param infringerDisputeId The ID of the resolved dispute against the parent IP.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * // After parent IP (tokenId 1) has been disputed, tag child IP (tokenId 2)
 * await origin.tagChildIp(2n, 1n); // childIpId, disputeId of parent
 * ```
 */
declare function tagChildIp(this: Origin, childIpId: bigint, infringerDisputeId: bigint): Promise<any>;

/**
 * Gets the details of a dispute by its ID.
 *
 * @param disputeId The ID of the dispute to fetch.
 * @returns A promise that resolves with the dispute details.
 *
 * @example
 * ```typescript
 * const dispute = await origin.getDispute(1n);
 * console.log(`Status: ${dispute.status}`);
 * console.log(`Yes votes: ${dispute.yesVotes}`);
 * console.log(`No votes: ${dispute.noVotes}`);
 * ```
 */
declare function getDispute(this: Origin, disputeId: bigint): Promise<Dispute>;

/**
 * Result of checking if a user can vote on a dispute.
 */
interface VoteEligibility {
    canVote: boolean;
    /** Reason why user cannot vote (if canVote is false) */
    reason?: string;
    /** User's voting weight (staked CAMP balance) */
    votingWeight: bigint;
    /** Minimum required stake to vote */
    stakingThreshold: bigint;
    hasAlreadyVoted: boolean;
    /** Timestamp when user staked (0 if never staked) */
    userStakeTimestamp: bigint;
    disputeTimestamp: bigint;
    disputeStatus: DisputeStatus;
    isVotingPeriodActive: boolean;
}
/**
 * Checks if a user meets the requirements to vote on a dispute.
 * Returns detailed information about eligibility and reason if ineligible.
 *
 * @param disputeId The ID of the dispute to check.
 * @param voter Optional address to check. If not provided, uses connected wallet.
 * @returns A promise that resolves with the vote eligibility details.
 *
 * @example
 * ```typescript
 * const eligibility = await origin.canVoteOnDispute(1n);
 *
 * if (eligibility.canVote) {
 *   console.log(`You can vote with weight: ${eligibility.votingWeight}`);
 *   await origin.voteOnDispute(1n, true);
 * } else {
 *   console.log(`Cannot vote: ${eligibility.reason}`);
 * }
 * ```
 */
declare function canVoteOnDispute(this: Origin, disputeId: bigint, voter?: Address): Promise<VoteEligibility>;

/**
 * Progress and voting statistics for a dispute.
 */
interface DisputeProgress {
    disputeId: bigint;
    status: DisputeStatus;
    /** Total YES votes (weighted by stake) */
    yesVotes: bigint;
    /** Total NO votes (weighted by stake) */
    noVotes: bigint;
    totalVotes: bigint;
    /** YES votes as percentage (0-100) */
    yesPercentage: number;
    /** NO votes as percentage (0-100) */
    noPercentage: number;
    /** Required quorum for valid resolution */
    quorum: bigint;
    /** Current progress toward quorum (0-100+) */
    quorumPercentage: number;
    quorumMet: boolean;
    /** Projected outcome if resolved now */
    projectedOutcome: "dispute_succeeds" | "dispute_fails" | "no_quorum";
    timeline: {
        raisedAt: Date;
        /** When the cooldown period ends (owner can no longer assert) */
        cooldownEndsAt: Date;
        votingEndsAt: Date;
        canResolveNow: boolean;
        /** Time remaining until resolution (in seconds, 0 if can resolve) */
        timeUntilResolution: number;
    };
}
/**
 * Gets detailed progress and voting statistics for a dispute.
 * Includes vote counts, percentages, quorum progress, and timeline.
 *
 * @param disputeId The ID of the dispute to check.
 * @returns A promise that resolves with the dispute progress details.
 *
 * @example
 * ```typescript
 * const progress = await origin.getDisputeProgress(1n);
 *
 * console.log(`Yes: ${progress.yesPercentage}% | No: ${progress.noPercentage}%`);
 * console.log(`Quorum: ${progress.quorumPercentage}% (${progress.quorumMet ? 'met' : 'not met'})`);
 * console.log(`Projected outcome: ${progress.projectedOutcome}`);
 *
 * if (progress.timeline.canResolveNow) {
 *   await origin.resolveDispute(1n);
 * } else {
 *   console.log(`Can resolve in ${progress.timeline.timeUntilResolution} seconds`);
 * }
 * ```
 */
declare function getDisputeProgress(this: Origin, disputeId: bigint): Promise<DisputeProgress>;

/**
 * Fractionalizes an IP NFT into fungible ERC20 tokens.
 * The NFT is transferred to the fractionalizer contract and a new ERC20 token is created.
 * The caller receives the full supply of fractional tokens.
 *
 * @param tokenId The token ID of the IP NFT to fractionalize.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * // First approve the fractionalizer contract to transfer your NFT
 * await origin.approve(fractionalizerAddress, tokenId);
 *
 * // Then fractionalize
 * const result = await origin.fractionalize(1n);
 * ```
 */
declare function fractionalize(this: Origin, tokenId: bigint): Promise<any>;

/**
 * Redeems an IP NFT by burning all of its fractional tokens.
 * The caller must hold the entire supply of the NFT's fractional token.
 * After redemption, the NFT is transferred back to the caller.
 *
 * @param tokenId The token ID of the IP NFT to redeem.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * // Requires holding 100% of the fractional token supply
 * await origin.redeem(1n);
 * ```
 */
declare function redeem(this: Origin, tokenId: bigint): Promise<any>;

/**
 * Gets the fractional ERC20 token address for a specific IP NFT.
 * Returns zero address if the NFT has not been fractionalized.
 *
 * @param tokenId The token ID of the IP NFT.
 * @returns A promise that resolves with the fractional token address.
 *
 * @example
 * ```typescript
 * const fractionalToken = await origin.getTokenForNFT(1n);
 * if (fractionalToken !== zeroAddress) {
 *   console.log(`Fractional token: ${fractionalToken}`);
 * } else {
 *   console.log("NFT has not been fractionalized");
 * }
 * ```
 */
declare function getTokenForNFT(this: Origin, tokenId: bigint): Promise<Address>;

/**
 * Fractionalizes an IP NFT with automatic approval.
 * This method first approves the fractionalizer contract to transfer your NFT,
 * then calls fractionalize. This is the recommended method for most use cases.
 *
 * @param tokenId The token ID of the IP NFT to fractionalize.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * // Single call handles approval and fractionalization
 * const result = await origin.fractionalizeWithApproval(1n);
 * ```
 */
declare function fractionalizeWithApproval(this: Origin, tokenId: bigint): Promise<any>;

/**
 * Redeems fractional tokens for the underlying NFT, but only if the caller owns 100% of the supply.
 * This method checks the caller's balance before attempting to redeem, providing a clear error
 * if they don't hold the full supply.
 *
 * @param tokenId The token ID of the original NFT to redeem.
 * @returns A promise that resolves with the transaction result.
 * @throws Error if the caller doesn't own 100% of the fractional tokens.
 *
 * @example
 * ```typescript
 * try {
 *   const result = await origin.redeemIfComplete(1n);
 *   console.log("NFT redeemed successfully!");
 * } catch (error) {
 *   console.log("You don't own all fractional tokens yet");
 * }
 * ```
 */
declare function redeemIfComplete(this: Origin, tokenId: bigint): Promise<any>;

/**
 * Ownership information for fractional tokens.
 */
interface FractionOwnership {
    tokenId: bigint;
    /** The ERC20 token address (zero if not fractionalized) */
    erc20Address: Address;
    isFractionalized: boolean;
    /** User's balance of fractional tokens */
    balance: bigint;
    /** Total supply of fractional tokens */
    totalSupply: bigint;
    /** User's ownership percentage (0-100) */
    ownershipPercentage: number;
    /** Whether user owns 100% and can redeem */
    canRedeem: boolean;
    decimals: number;
}
/**
 * Gets a user's ownership percentage of a fractionalized NFT.
 * Returns detailed information about the user's fractional token holdings.
 *
 * @param tokenId The token ID of the original NFT.
 * @param owner Optional address to check. If not provided, uses connected wallet.
 * @returns A promise that resolves with the ownership details.
 *
 * @example
 * ```typescript
 * const ownership = await origin.getFractionOwnership(1n);
 *
 * if (!ownership.isFractionalized) {
 *   console.log("This NFT has not been fractionalized");
 * } else {
 *   console.log(`You own ${ownership.ownershipPercentage}% of this NFT`);
 *   console.log(`Balance: ${ownership.balance} / ${ownership.totalSupply}`);
 *
 *   if (ownership.canRedeem) {
 *     console.log("You can redeem the original NFT!");
 *     await origin.redeem(1n);
 *   }
 * }
 * ```
 */
declare function getFractionOwnership(this: Origin, tokenId: bigint, owner?: Address): Promise<FractionOwnership>;

/**
 * Result of checking if a user can fractionalize an NFT.
 */
interface FractionalizeEligibility {
    canFractionalize: boolean;
    /** Reason why user cannot fractionalize (if canFractionalize is false) */
    reason?: string;
    isOwner: boolean;
    currentOwner: Address;
    isAlreadyFractionalized: boolean;
    /** ERC20 address if already fractionalized */
    existingErc20Address?: Address;
    dataStatus: DataStatus;
    isApproved: boolean;
    needsApproval: boolean;
}
/**
 * Checks if a user can fractionalize an NFT and why not if they can't.
 * Returns detailed information about eligibility requirements.
 *
 * @param tokenId The token ID of the NFT to check.
 * @param owner Optional address to check. If not provided, uses connected wallet.
 * @returns A promise that resolves with the fractionalize eligibility details.
 *
 * @example
 * ```typescript
 * const eligibility = await origin.canFractionalize(1n);
 *
 * if (eligibility.canFractionalize) {
 *   if (eligibility.needsApproval) {
 *     // Use fractionalizeWithApproval for convenience
 *     await origin.fractionalizeWithApproval(1n);
 *   } else {
 *     await origin.fractionalize(1n);
 *   }
 * } else {
 *   console.log(`Cannot fractionalize: ${eligibility.reason}`);
 * }
 * ```
 */
declare function canFractionalize(this: Origin, tokenId: bigint, owner?: Address): Promise<FractionalizeEligibility>;

/**
 * Gets information about a registered app from the AppRegistry.
 *
 * @param appId The app ID to look up.
 * @returns A promise that resolves with the app information.
 *
 * @example
 * ```typescript
 * const appInfo = await origin.getAppInfo("my-app-id");
 * console.log(`Treasury: ${appInfo.treasury}`);
 * console.log(`Revenue Share: ${appInfo.revenueShareBps / 100}%`);
 * console.log(`Active: ${appInfo.isActive}`);
 * ```
 */
declare function getAppInfo(this: Origin, appId: string): Promise<AppInfo>;

/**
 * Parameters for a single purchase in a bulk buy operation.
 */
interface BuyParams {
    tokenId: bigint;
    expectedPrice: bigint;
    expectedDuration: number;
    expectedPaymentToken: Address;
    expectedProtocolFeeBps: number;
    expectedAppFeeBps: number;
}
/**
 * Result of a tolerant bulk purchase operation.
 */
interface TolerantResult {
    successCount: bigint;
    failureCount: bigint;
    totalSpent: bigint;
    refundAmount: bigint;
    failedTokenIds: bigint[];
}
/**
 * Preview of bulk purchase costs.
 */
interface BulkCostPreview {
    totalNativeCost: bigint;
    totalERC20Cost: bigint;
    validCount: bigint;
    invalidTokenIds: bigint[];
}
/**
 * Executes an atomic bulk purchase of multiple IP-NFT licenses.
 * All purchases succeed or all fail together.
 *
 * @param buyer The address that will receive the licenses.
 * @param purchases Array of purchase parameters for each token.
 * @param value Total native token value to send (sum of all native token purchases).
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * const purchases = [
 *   { tokenId: 1n, expectedPrice: 1000000000000000n, expectedDuration: 86400, expectedPaymentToken: zeroAddress },
 *   { tokenId: 2n, expectedPrice: 2000000000000000n, expectedDuration: 86400, expectedPaymentToken: zeroAddress },
 * ];
 * const totalValue = 3000000000000000n;
 * await origin.bulkBuyAccess(buyerAddress, purchases, totalValue);
 * ```
 */
declare function bulkBuyAccess(this: Origin, buyer: Address, purchases: BuyParams[], value?: bigint): Promise<any>;
/**
 * Executes a fault-tolerant bulk purchase of multiple IP-NFT licenses.
 * Individual purchases can fail without reverting the entire transaction.
 * Unused funds are automatically refunded.
 *
 * @param buyer The address that will receive the licenses.
 * @param purchases Array of purchase parameters for each token.
 * @param value Total native token value to send (can be more than needed; excess is refunded).
 * @returns A promise that resolves with the tolerant result including success/failure counts.
 *
 * @example
 * ```typescript
 * const result = await origin.bulkBuyAccessTolerant(buyerAddress, purchases, totalValue);
 * console.log(`Purchased ${result.successCount} of ${purchases.length} IPs`);
 * console.log(`Failed tokens: ${result.failedTokenIds}`);
 * ```
 */
declare function bulkBuyAccessTolerant(this: Origin, buyer: Address, purchases: BuyParams[], value?: bigint): Promise<any>;
/**
 * Previews the total cost of purchasing multiple IP-NFT licenses.
 * This is a view function that doesn't require a transaction.
 *
 * @param tokenIds Array of token IDs to preview costs for.
 * @returns A promise that resolves with the cost preview including total costs and invalid tokens.
 *
 * @example
 * ```typescript
 * const preview = await origin.previewBulkCost([1n, 2n, 3n]);
 * console.log(`Total cost: ${preview.totalNativeCost} wei`);
 * console.log(`Valid tokens: ${preview.validCount}`);
 * ```
 */
declare function previewBulkCost(this: Origin, tokenIds: bigint[]): Promise<BulkCostPreview>;
/**
 * Builds purchase parameters for multiple tokens by fetching their current license terms.
 * This is a view function that doesn't require a transaction.
 *
 * @param tokenIds Array of token IDs to build parameters for.
 * @returns A promise that resolves with an array of BuyParams ready for bulk purchase.
 *
 * @example
 * ```typescript
 * const params = await origin.buildPurchaseParams([1n, 2n, 3n]);
 * await origin.bulkBuyAccess(buyer, params, totalValue);
 * ```
 */
declare function buildPurchaseParams(this: Origin, tokenIds: bigint[]): Promise<BuyParams[]>;
/**
 * Checks the active status of multiple tokens.
 *
 * @param tokenIds Array of token IDs to check.
 * @returns A promise that resolves with an array of boolean flags indicating active status.
 *
 * @example
 * ```typescript
 * const activeFlags = await origin.checkActiveStatus([1n, 2n, 3n]);
 * const activeTokens = tokenIds.filter((_, i) => activeFlags[i]);
 * ```
 */
declare function checkActiveStatus(this: Origin, tokenIds: bigint[]): Promise<boolean[]>;
/**
 * Smart bulk purchase that automatically fetches terms and handles the entire purchase flow.
 * This is the recommended method for most use cases.
 *
 * @param tokenIds Array of token IDs to purchase.
 * @param options Optional configuration for the purchase.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * // Atomic purchase - all succeed or all fail
 * const result = await origin.bulkBuyAccessSmart([1n, 2n, 3n]);
 *
 * // Tolerant purchase - continue even if some fail
 * const result = await origin.bulkBuyAccessSmart([1n, 2n, 3n], { tolerant: true });
 * ```
 */
declare function bulkBuyAccessSmart(this: Origin, tokenIds: bigint[], options?: {
    tolerant?: boolean;
}): Promise<any>;

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
    bulkBuyAccess: typeof bulkBuyAccess;
    bulkBuyAccessTolerant: typeof bulkBuyAccessTolerant;
    bulkBuyAccessSmart: typeof bulkBuyAccessSmart;
    previewBulkCost: typeof previewBulkCost;
    buildPurchaseParams: typeof buildPurchaseParams;
    checkActiveStatus: typeof checkActiveStatus;
    raiseDispute: typeof raiseDispute;
    disputeAssertion: typeof disputeAssertion;
    voteOnDispute: typeof voteOnDispute;
    resolveDispute: typeof resolveDispute;
    cancelDispute: typeof cancelDispute;
    tagChildIp: typeof tagChildIp;
    getDispute: typeof getDispute;
    canVoteOnDispute: typeof canVoteOnDispute;
    getDisputeProgress: typeof getDisputeProgress;
    fractionalize: typeof fractionalize;
    redeem: typeof redeem;
    getTokenForNFT: typeof getTokenForNFT;
    fractionalizeWithApproval: typeof fractionalizeWithApproval;
    redeemIfComplete: typeof redeemIfComplete;
    getFractionOwnership: typeof getFractionOwnership;
    canFractionalize: typeof canFractionalize;
    getAppInfo: typeof getAppInfo;
    private jwt?;
    environment: Environment;
    private viemClient?;
    baseParentId?: bigint;
    appId?: string;
    constructor(environment?: Environment | string, jwt?: string, viemClient?: WalletClient, baseParentId?: bigint, appId?: string);
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
     * Gets comprehensive token information in a single call.
     * Combines owner, status, terms, URI, and access information.
     *
     * @param tokenId The token ID to get information for.
     * @param owner Optional address to check access for. If not provided, uses connected wallet.
     * @returns A promise that resolves with comprehensive token information.
     *
     * @example
     * ```typescript
     * const info = await origin.getTokenInfoSmart(1n);
     * console.log(`Owner: ${info.owner}`);
     * console.log(`Price: ${info.terms.price}`);
     * console.log(`Has access: ${info.hasAccess}`);
     * ```
     */
    getTokenInfoSmart(tokenId: bigint, owner?: Address): Promise<TokenInfo>;
    /**
     * Buy access to an asset by first checking its price via getTerms, then calling buyAccess.
     * Automatically fetches protocol and app fees from the contracts.
     * If the user already has access, returns null without making a transaction.
     *
     * @param tokenId The token ID of the asset.
     * @returns The result of the buyAccess call, or null if user already has access.
     *
     * @example
     * ```typescript
     * const result = await origin.buyAccessSmart(1n);
     * if (result === null) {
     *   console.log("You already have access to this asset");
     * } else {
     *   console.log("Access purchased:", result.txHash);
     * }
     * ```
     */
    buyAccessSmart(tokenId: bigint): Promise<any | null>;
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

export { type AppInfo, Auth, type BaseSigner, BrowserStorage, type BulkCostPreview, type BuyParams, CustomSignerAdapter, DataStatus, type Dispute, type DisputeProgress, DisputeStatus, EthersSignerAdapter, type FractionOwnership, type FractionalizeEligibility, type LicenseTerms, LicenseType, MemoryStorage, Origin, type SignerAdapter, type SignerType, type StorageAdapter, type TokenInfo, type TolerantResult, ViemSignerAdapter, type VoteEligibility, mainnet as campMainnet, testnet as campTestnet, createLicenseTerms, createNodeWalletClient, createSignerAdapter };
