import React, { ReactNode } from 'react';
interface AppKitConfig {
    projectId: string;
    metadata?: {
        name: string;
        description: string;
        url: string;
        icons: string[];
    };
}
interface AppKitContextType {
    openAppKit: () => Promise<void>;
    closeAppKit: () => void;
    isConnected: boolean;
    address: string | null;
    signMessage: (message: string) => Promise<string>;
    signTransaction: (transaction: any) => Promise<string>;
    switchNetwork: (chainId: number) => Promise<void>;
    disconnect: () => Promise<void>;
    getProvider: () => any;
}
interface AppKitProviderProps {
    children: ReactNode;
    config: AppKitConfig;
}
export declare const AppKitProvider: React.FC<AppKitProviderProps>;
export declare const useAppKit: () => AppKitContextType;
export declare const AppKitUtils: {
    open: () => Promise<void>;
    close: () => void;
    getState: () => {
        isConnected: boolean;
        address: null;
    };
    subscribe: (callback: (state: any) => void) => () => void;
};
export {};
