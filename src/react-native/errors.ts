/**
 * Standardized Error Types for Camp Network React Native SDK
 * Requirements: Section "ERROR HANDLING REQUIREMENTS"
 */

export class CampSDKError extends Error {
  code: string;
  details?: any;

  constructor(message: string, code: string, details?: any) {
    super(message);
    this.name = 'CampSDKError';
    this.code = code;
    this.details = details;
  }
}

// Required error types from SDK_REQUIREMENTS.txt
export const ErrorCodes = {
  WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
  AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
  TRANSACTION_REJECTED: 'TRANSACTION_REJECTED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SOCIAL_LINKING_FAILED: 'SOCIAL_LINKING_FAILED',
  IP_CREATION_FAILED: 'IP_CREATION_FAILED',
  APPKIT_NOT_INITIALIZED: 'APPKIT_NOT_INITIALIZED',
  MODULE_RESOLUTION_ERROR: 'MODULE_RESOLUTION_ERROR',
  PROVIDER_CONFLICT: 'PROVIDER_CONFLICT',
} as const;

// Helper functions to create specific error types
export const createWalletNotConnectedError = (details?: any) => 
  new CampSDKError('Wallet is not connected', ErrorCodes.WALLET_NOT_CONNECTED, details);

export const createAuthenticationFailedError = (message?: string, details?: any) => 
  new CampSDKError(message || 'Authentication failed', ErrorCodes.AUTHENTICATION_FAILED, details);

export const createTransactionRejectedError = (details?: any) => 
  new CampSDKError('Transaction was rejected', ErrorCodes.TRANSACTION_REJECTED, details);

export const createNetworkError = (message?: string, details?: any) => 
  new CampSDKError(message || 'Network request failed', ErrorCodes.NETWORK_ERROR, details);

export const createSocialLinkingFailedError = (provider: string, details?: any) => 
  new CampSDKError(`Failed to link ${provider} account`, ErrorCodes.SOCIAL_LINKING_FAILED, details);

export const createIPCreationFailedError = (details?: any) => 
  new CampSDKError('Failed to create IP asset', ErrorCodes.IP_CREATION_FAILED, details);

export const createAppKitNotInitializedError = (details?: any) => 
  new CampSDKError('AppKit is not initialized', ErrorCodes.APPKIT_NOT_INITIALIZED, details);

// Error recovery utility
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry for user rejections or authentication failures
      if (error instanceof CampSDKError && 
          (error.code === ErrorCodes.TRANSACTION_REJECTED || 
           error.code === ErrorCodes.AUTHENTICATION_FAILED)) {
        throw error;
      }
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError!;
};
