import { Abi } from "viem";
import { mintWithSignature, registerIpNFT } from "./mintWithSignature";
import { updateTerms } from "./updateTerms";
import { requestDelete } from "./requestDelete";
import { getTerms } from "./getTerms";
import { ownerOf } from "./ownerOf";
import { balanceOf } from "./balanceOf";
import { contentHash } from "./contentHash";
import { tokenURI } from "./tokenURI";
import { dataStatus } from "./dataStatus";
import { royaltyInfo } from "./royaltyInfo";
import { getApproved } from "./getApproved";
import { isApprovedForAll } from "./isApprovedForAll";
import { transferFrom } from "./transferFrom";
import { safeTransferFrom } from "./safeTransferFrom";
import { approve } from "./approve";
import { setApprovalForAll } from "./setApprovalForAll";
import { buyAccess } from "./buyAccess";
import { renewAccess } from "./renewAccess";
import { hasAccess } from "./hasAccess";
import { subscriptionExpiry } from "./subscriptionExpiry";
import { LicenseTerms } from "./utils";
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
export declare class Origin {
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
    mintSocial: (source: "spotify" | "twitter" | "tiktok", metadata: Record<string, unknown>, license: LicenseTerms) => Promise<string | null>;
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
export {};
