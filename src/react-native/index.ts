// React Native SDK exports

// Authentication - Core requirement
export { CampProvider, CampContext } from './context/CampContext';
export { useCampAuth, useAuthState, useCamp, useModal } from './hooks';
export { AuthRN } from './auth/AuthRN';

// AppKit Integration - Core requirement
export { useAppKit } from './hooks';

// Social & Origin - Core requirement  
export { useSocials, useOrigin } from './hooks';

// Components - Core requirement
export { CampButton } from './components/CampButton';
export { CampModal } from './components/CampModal';

// Core APIs
export { TwitterAPI } from '../core/twitter';
export { SpotifyAPI } from '../core/spotify';
export { TikTokAPI } from '../core/tiktok';
export { Origin } from '../core/origin';

// Storage
export { Storage } from './storage';

// Icons and UI components
export * from './components/icons';

// Re-export common utilities and constants
export { default as constants } from '../constants';
export * from '../utils';
export * from '../errors';

// Types - Core requirement  
export type { 
  CampContextType,
  LicenseTerms,
  IPAssetMetadata,
  TransactionRequest,
  TransactionResponse,
  CampAuthHook,
  AppKitHook,
  SocialsHook,
  OriginHook,
  CampButtonProps,
  CampModalProps,
  WalletConnectConfig,
} from './types';

// Error handling - Core requirement
export { 
  CampSDKError,
  ErrorCodes,
  createWalletNotConnectedError,
  createAuthenticationFailedError,
  createTransactionRejectedError,
  createNetworkError,
  createSocialLinkingFailedError,
  createIPCreationFailedError,
  createAppKitNotInitializedError,
  withRetry,
} from './errors';

// Constants
export { FEATURED_WALLET_IDS, DEFAULT_PROJECT_ID } from './types';
