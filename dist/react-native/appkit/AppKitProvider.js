import { _ as __awaiter } from '../tslib.es6.js';
import React, { createContext, useContext } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const AppKitContext = createContext(null);
const AppKitProvider = ({ children, config }) => {
    // This would be initialized with actual AppKit
    // For now, providing the structure
    const queryClient = new QueryClient();
    const appKitValue = {
        openAppKit: () => __awaiter(void 0, void 0, void 0, function* () {
            // This would open the AppKit modal
            console.log('Opening AppKit modal...');
            // In real implementation:
            // import { open } from '@reown/appkit-react-native'
            // await open()
        }),
        closeAppKit: () => {
            // This would close the AppKit modal
            console.log('Closing AppKit modal...');
            // In real implementation:
            // import { close } from '@reown/appkit-react-native'
            // close()
        },
        isConnected: false, // This would come from AppKit state
        address: null, // This would come from connected wallet
        signMessage: (message) => __awaiter(void 0, void 0, void 0, function* () {
            // This would use the connected wallet to sign
            console.log('Signing message:', message);
            // In real implementation:
            // const provider = getProvider()
            // return await provider.request({
            //   method: 'personal_sign',
            //   params: [message, address]
            // })
            return 'mock_signature';
        }),
        signTransaction: (transaction) => __awaiter(void 0, void 0, void 0, function* () {
            // This would sign and send transaction
            console.log('Signing transaction:', transaction);
            return 'mock_tx_hash';
        }),
        switchNetwork: (chainId) => __awaiter(void 0, void 0, void 0, function* () {
            // This would switch network
            console.log('Switching to network:', chainId);
        }),
        disconnect: () => __awaiter(void 0, void 0, void 0, function* () {
            // This would disconnect the wallet
            console.log('Disconnecting wallet...');
        }),
        getProvider: () => {
            // This would return the current provider
            return null;
        }
    };
    return (React.createElement(QueryClientProvider, { client: queryClient },
        React.createElement(AppKitContext.Provider, { value: appKitValue }, children)));
};
// Hook to use AppKit
const useAppKit = () => {
    const context = useContext(AppKitContext);
    if (!context) {
        throw new Error('useAppKit must be used within AppKitProvider');
    }
    return context;
};
// Direct AppKit utilities that users can access
const AppKitUtils = {
    // Open AppKit modal directly
    open: () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Direct AppKit open');
        // import { open } from '@reown/appkit-react-native'
        // await open()
    }),
    // Close AppKit modal directly
    close: () => {
        console.log('Direct AppKit close');
        // import { close } from '@reown/appkit-react-native'
        // close()
    },
    // Get current connection state
    getState: () => {
        console.log('Getting AppKit state');
        // import { getState } from '@reown/appkit-react-native'
        // return getState()
        return { isConnected: false, address: null };
    },
    // Subscribe to AppKit events
    subscribe: (callback) => {
        console.log('Subscribing to AppKit events');
        // import { subscribeState } from '@reown/appkit-react-native'
        // return subscribeState(callback)
        return () => { }; // unsubscribe function
    }
};

export { AppKitProvider, AppKitUtils, useAppKit };
