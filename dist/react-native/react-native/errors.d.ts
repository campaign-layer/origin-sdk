/**
 * Standardized Error Types for Camp Network React Native SDK
 * Requirements: Section "ERROR HANDLING REQUIREMENTS"
 */
export declare class CampSDKError extends Error {
    code: string;
    details?: any;
    constructor(message: string, code: string, details?: any);
}
export declare const ErrorCodes: {
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
export declare const createWalletNotConnectedError: (details?: any) => CampSDKError;
export declare const createAuthenticationFailedError: (message?: string, details?: any) => CampSDKError;
export declare const createTransactionRejectedError: (details?: any) => CampSDKError;
export declare const createNetworkError: (message?: string, details?: any) => CampSDKError;
export declare const createSocialLinkingFailedError: (provider: string, details?: any) => CampSDKError;
export declare const createIPCreationFailedError: (details?: any) => CampSDKError;
export declare const createAppKitNotInitializedError: (details?: any) => CampSDKError;
export declare const withRetry: <T>(fn: () => Promise<T>, maxRetries?: number, delay?: number) => Promise<T>;
