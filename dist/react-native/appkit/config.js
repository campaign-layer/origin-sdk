/**
 * AppKit Configuration for React Native
 * Note: This file provides configuration templates for AppKit integration.
 * Actual AppKit instances should be created in your app with proper dependencies installed.
 */
// Configuration template for AppKit with proper chain support
const defaultAppKitConfig = {
    projectId: process.env.REOWN_PROJECT_ID || '', // Your Reown Project ID
    metadata: {
        name: 'Camp Network',
        description: 'Camp Network Origin SDK React Native Integration',
        url: 'https://camp.network',
        icons: ['https://camp.network/favicon.ico'],
    },
    networks: [
        // Mainnet configuration
        {
            id: 1,
            name: 'Ethereum',
            nativeCurrency: {
                decimals: 18,
                name: 'Ethereum',
                symbol: 'ETH',
            },
            rpcUrls: {
                default: {
                    http: ['https://rpc.ankr.com/eth'],
                },
                public: {
                    http: ['https://rpc.ankr.com/eth'],
                },
            },
            blockExplorers: {
                default: { name: 'Etherscan', url: 'https://etherscan.io' },
            },
        },
        // Polygon configuration
        {
            id: 137,
            name: 'Polygon',
            nativeCurrency: {
                decimals: 18,
                name: 'Polygon',
                symbol: 'MATIC',
            },
            rpcUrls: {
                default: {
                    http: ['https://rpc.ankr.com/polygon'],
                },
                public: {
                    http: ['https://rpc.ankr.com/polygon'],
                },
            },
            blockExplorers: {
                default: { name: 'PolygonScan', url: 'https://polygonscan.com' },
            },
        },
        // Arbitrum configuration
        {
            id: 42161,
            name: 'Arbitrum One',
            nativeCurrency: {
                decimals: 18,
                name: 'Ethereum',
                symbol: 'ETH',
            },
            rpcUrls: {
                default: {
                    http: ['https://rpc.ankr.com/arbitrum'],
                },
                public: {
                    http: ['https://rpc.ankr.com/arbitrum'],
                },
            },
            blockExplorers: {
                default: { name: 'Arbiscan', url: 'https://arbiscan.io' },
            },
        },
    ],
    features: {
        analytics: true,
    },
};
/**
 * Creates an AppKit configuration with custom settings
 * @param config - Custom configuration options
 * @returns Complete AppKit configuration
 */
const createAppKitConfig = (config) => {
    return Object.assign(Object.assign(Object.assign({}, defaultAppKitConfig), config), { metadata: Object.assign(Object.assign({}, defaultAppKitConfig.metadata), config.metadata), networks: config.networks || defaultAppKitConfig.networks, features: Object.assign(Object.assign({}, defaultAppKitConfig.features), config.features) });
};

export { createAppKitConfig, defaultAppKitConfig };
