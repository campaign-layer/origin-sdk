import { _ as __awaiter } from './tslib.es6.js';

/**
 * Standardized Error Types for Camp Network React Native SDK
 * Requirements: Section "ERROR HANDLING REQUIREMENTS"
 */
class CampSDKError extends Error {
    constructor(message, code, details) {
        super(message);
        this.name = 'CampSDKError';
        this.code = code;
        this.details = details;
    }
}
// Required error types from SDK_REQUIREMENTS.txt
const ErrorCodes = {
    WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
    AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
    TRANSACTION_REJECTED: 'TRANSACTION_REJECTED',
    NETWORK_ERROR: 'NETWORK_ERROR',
    SOCIAL_LINKING_FAILED: 'SOCIAL_LINKING_FAILED',
    IP_CREATION_FAILED: 'IP_CREATION_FAILED',
    APPKIT_NOT_INITIALIZED: 'APPKIT_NOT_INITIALIZED',
    MODULE_RESOLUTION_ERROR: 'MODULE_RESOLUTION_ERROR',
    PROVIDER_CONFLICT: 'PROVIDER_CONFLICT',
};
// Helper functions to create specific error types
const createWalletNotConnectedError = (details) => new CampSDKError('Wallet is not connected', ErrorCodes.WALLET_NOT_CONNECTED, details);
const createAuthenticationFailedError = (message, details) => new CampSDKError(message || 'Authentication failed', ErrorCodes.AUTHENTICATION_FAILED, details);
const createTransactionRejectedError = (details) => new CampSDKError('Transaction was rejected', ErrorCodes.TRANSACTION_REJECTED, details);
const createNetworkError = (message, details) => new CampSDKError(message || 'Network request failed', ErrorCodes.NETWORK_ERROR, details);
const createSocialLinkingFailedError = (provider, details) => new CampSDKError(`Failed to link ${provider} account`, ErrorCodes.SOCIAL_LINKING_FAILED, details);
const createIPCreationFailedError = (details) => new CampSDKError('Failed to create IP asset', ErrorCodes.IP_CREATION_FAILED, details);
const createAppKitNotInitializedError = (details) => new CampSDKError('AppKit is not initialized', ErrorCodes.APPKIT_NOT_INITIALIZED, details);
// Error recovery utility
const withRetry = (fn_1, ...args_1) => __awaiter(void 0, [fn_1, ...args_1], void 0, function* (fn, maxRetries = 3, delay = 1000) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return yield fn();
        }
        catch (error) {
            lastError = error;
            // Don't retry for user rejections or authentication failures
            if (error instanceof CampSDKError &&
                (error.code === ErrorCodes.TRANSACTION_REJECTED ||
                    error.code === ErrorCodes.AUTHENTICATION_FAILED)) {
                throw error;
            }
            if (i < maxRetries - 1) {
                yield new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
            }
        }
    }
    throw lastError;
});

export { CampSDKError, ErrorCodes, createAppKitNotInitializedError, createAuthenticationFailedError, createIPCreationFailedError, createNetworkError, createSocialLinkingFailedError, createTransactionRejectedError, createWalletNotConnectedError, withRetry };
