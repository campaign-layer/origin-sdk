export { AppKitProvider, useAppKit, AppKitUtils } from './AppKitProvider';
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
export { AppKitButton } from './AppKitButton';
