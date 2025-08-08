// AppKit Integration exports
export { AppKitProvider, useAppKit, AppKitUtils } from './AppKitProvider';

// AppKit Types
export interface WalletConnection {
  address: string;
  chainId: number;
  provider: any;
}

export interface SigningRequest {
  message?: string;
  transaction?: any;
  type: 'message' | 'transaction' | 'typedData';
}

// AppKit React Native Component
export { AppKitButton } from './AppKitButton';
