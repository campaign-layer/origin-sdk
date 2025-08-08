import type { CampContextType } from '../context/CampContext';
import { AuthRN } from '../auth/AuthRN';
export type { CampContextType };
export declare const useCampAuth: () => {
    auth: AuthRN | null;
    isAuthenticated: boolean;
    authenticated: boolean;
    isLoading: boolean;
    loading: boolean;
    walletAddress: string | null;
    error: string | null;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    clearError: () => void;
};
export declare const useAuthState: () => {
    authenticated: boolean;
    loading: boolean;
};
export declare const useCamp: () => CampContextType;
export declare const useSocials: () => {
    data: Record<string, boolean>;
    socials: Record<string, boolean>;
    isLoading: boolean;
    error: Error | null;
    linkSocial: (platform: "twitter" | "discord" | "spotify") => Promise<void>;
    unlinkSocial: (platform: "twitter" | "discord" | "spotify") => Promise<void>;
    refetch: () => Promise<void>;
};
export declare const useAppKit: () => {
    isConnected: boolean;
    isAppKitConnected: boolean;
    isConnecting: boolean;
    address: string | null;
    appKitAddress: string | null;
    chainId: number | null;
    balance: string | null;
    openAppKit: () => Promise<string>;
    disconnectAppKit: () => Promise<void>;
    disconnect: () => Promise<void>;
    signMessage: (message: string) => Promise<string>;
    switchNetwork: (targetChainId: number) => Promise<void>;
    sendTransaction: (transaction: any) => Promise<any>;
    getBalance: () => Promise<string>;
    getChainId: () => Promise<number>;
    getProvider: () => any;
    subscribeAccount: (callback: (account: any) => void) => (() => void);
    subscribeChainId: (callback: (chainId: number) => void) => (() => void);
    appKit: any;
};
export declare const useModal: () => {
    isOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};
export declare const useOrigin: () => {
    stats: {
        refetch: () => Promise<void>;
        data: any;
        isLoading: boolean;
        error: Error | null;
        isError: boolean;
    };
    uploads: {
        refetch: () => Promise<void>;
        data: any[];
        isLoading: boolean;
        error: Error | null;
        isError: boolean;
    };
    mintFile: (file: any, metadata: Record<string, unknown>, license: any, parentId?: bigint) => Promise<string | null>;
    createIPAsset: (file: File, metadata: any, license: any) => Promise<string>;
    createSocialIPAsset: (source: "twitter" | "spotify", license: any) => Promise<string>;
};
