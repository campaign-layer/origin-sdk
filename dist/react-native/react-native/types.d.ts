/**
 * TypeScript interfaces for Camp Network React Native SDK
 * Requirements: Section "HOOK INTERFACES REQUIRED" and "COMPONENT INTERFACES"
 */
import type React from 'react';
export interface LicenseTerms {
    type: 'commercial' | 'non-commercial' | 'custom';
    price?: string;
    currency?: string;
    terms?: string;
    expiry?: Date;
}
export interface IPAssetMetadata {
    title: string;
    description: string;
    tags?: string[];
    category?: string;
    creator?: string;
    originalUrl?: string;
    socialPlatform?: 'twitter' | 'spotify' | 'tiktok';
    [key: string]: any;
}
export interface TransactionRequest {
    to: string;
    value?: string;
    data?: string;
    gasLimit?: string;
    gasPrice?: string;
}
export interface TransactionResponse {
    hash: string;
    from: string;
    to: string;
    value: string;
    gasUsed: string;
    blockNumber?: number;
    confirmations?: number;
}
/**
 * useCampAuth Hook Interface
 * Requirements: Section "A. useCampAuth Hook"
 */
export interface CampAuthHook {
    authenticated: boolean;
    loading: boolean;
    walletAddress: string | null;
    error: string | null;
    connect: () => Promise<{
        success: boolean;
        message: string;
        walletAddress: string;
    }>;
    disconnect: () => Promise<void>;
    clearError: () => void;
    auth: any | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
/**
 * useAppKit Hook Interface
 * Requirements: Section "B. useAppKit Hook"
 */
export interface AppKitHook {
    isAppKitConnected: boolean;
    isConnecting: boolean;
    appKitAddress: string | null;
    chainId: number | null;
    openAppKit: () => Promise<string>;
    disconnectAppKit: () => Promise<void>;
    signMessage: (message: string) => Promise<string>;
    switchNetwork: (chainId: number) => Promise<void>;
    sendTransaction: (tx: TransactionRequest) => Promise<TransactionResponse>;
    getBalance: () => Promise<string>;
    getChainId: () => Promise<number>;
    getProvider: () => any;
    subscribeAccount: (callback: (account: any) => void) => () => void;
    subscribeChainId: (callback: (chainId: number) => void) => () => void;
    isConnected: boolean;
    address: string | null;
    balance?: string | null;
    appKit: any;
}
/**
 * useSocials Hook Interface
 * Requirements: Section "C. useSocials Hook"
 */
export interface SocialsHook {
    socials: Record<string, boolean>;
    isLoading: boolean;
    error: Error | null;
    linkSocial: (platform: 'twitter' | 'discord' | 'spotify') => Promise<void>;
    unlinkSocial: (platform: 'twitter' | 'discord' | 'spotify') => Promise<void>;
    refetch: () => Promise<void>;
    data: Record<string, boolean>;
}
/**
 * useOrigin Hook Interface
 * Requirements: Section "D. useOrigin Hook"
 */
export interface OriginHook {
    stats: {
        data: any;
        isLoading: boolean;
        isError: boolean;
        error: Error | null;
        refetch: () => Promise<void>;
    };
    uploads: {
        data: any[];
        isLoading: boolean;
        isError: boolean;
        error: Error | null;
        refetch: () => Promise<void>;
    };
    createIPAsset: (file: File, metadata: IPAssetMetadata, license: LicenseTerms) => Promise<string>;
    createSocialIPAsset: (source: 'twitter' | 'spotify', license: LicenseTerms) => Promise<string>;
    mintFile: (file: any, metadata: any, license: any, parentId?: bigint) => Promise<any>;
}
/**
 * CampButton Component Interface
 * Requirements: Section "A. CampButton Component"
 */
export interface CampButtonProps {
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    style?: any;
    authenticated?: boolean;
}
/**
 * CampModal Component Interface
 * Requirements: Section "B. CampModal Component"
 */
export interface CampModalProps {
    visible?: boolean;
    onClose?: () => void;
    children?: React.ReactNode;
}
export interface CampContextType {
    auth: any | null;
    setAuth: React.Dispatch<React.SetStateAction<any | null>>;
    clientId: string;
    isAuthenticated: boolean;
    isLoading: boolean;
    walletAddress: string | null;
    error: string | null;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    clearError: () => void;
    getAppKit: () => any;
}
export interface WalletConnectConfig {
    projectId: string;
    metadata: {
        name: string;
        description: string;
        url: string;
        icons: string[];
    };
    featuredWalletIds?: string[];
}
export declare const FEATURED_WALLET_IDS: {
    readonly METAMASK: "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96";
    readonly RAINBOW: "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369";
    readonly COINBASE: "fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa";
};
export declare const DEFAULT_PROJECT_ID = "83d0addc08296ab3d8a36e786dee7f48";
