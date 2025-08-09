/**
 * AppKit Configuration for React Native
 * Note: This file provides configuration templates for AppKit integration.
 * Actual AppKit instances should be created in your app with proper dependencies installed.
 */
export declare const defaultAppKitConfig: {
    projectId: string;
    metadata: {
        name: string;
        description: string;
        url: string;
        icons: string[];
    };
    networks: {
        id: number;
        name: string;
        nativeCurrency: {
            decimals: number;
            name: string;
            symbol: string;
        };
        rpcUrls: {
            default: {
                http: string[];
            };
            public: {
                http: string[];
            };
        };
        blockExplorers: {
            default: {
                name: string;
                url: string;
            };
        };
    }[];
    features: {
        analytics: boolean;
    };
};
export interface AppKitConfig {
    projectId: string;
    metadata: {
        name: string;
        description: string;
        url: string;
        icons: string[];
    };
    networks: Array<{
        id: number;
        name: string;
        nativeCurrency: {
            decimals: number;
            name: string;
            symbol: string;
        };
        rpcUrls: {
            default: {
                http: string[];
            };
            public: {
                http: string[];
            };
        };
        blockExplorers: {
            default: {
                name: string;
                url: string;
            };
        };
    }>;
    features?: {
        analytics?: boolean;
    };
}
/**
 * Creates an AppKit configuration with custom settings
 * @param config - Custom configuration options
 * @returns Complete AppKit configuration
 */
export declare const createAppKitConfig: (config: Partial<AppKitConfig>) => AppKitConfig;
