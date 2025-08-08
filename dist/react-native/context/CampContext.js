import { _ as __awaiter } from '../tslib.es6.js';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { A as AuthRN } from '../AuthRN.js';
import { Storage } from '../storage.js';
import 'viem/siwe';
import 'viem';
import '../../errors';
import 'viem/accounts';

/**
 * CampContext for React Native with AppKit integration
 */
const CampContext = createContext({
    auth: null,
    setAuth: () => { },
    clientId: "",
    isAuthenticated: false,
    isLoading: false,
    walletAddress: null,
    error: null,
    connect: () => __awaiter(void 0, void 0, void 0, function* () { }),
    disconnect: () => __awaiter(void 0, void 0, void 0, function* () { }),
    clearError: () => { },
    getAppKit: () => null,
});
const CampProvider = ({ children, clientId, redirectUri, allowAnalytics = true, appKit }) => {
    const [auth, setAuth] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!clientId) {
            console.error("CampProvider: clientId is required");
            return;
        }
        try {
            const authInstance = new AuthRN({
                clientId,
                redirectUri,
                allowAnalytics,
                appKit // Pass AppKit instance
            });
            // Set up event listeners
            authInstance.on('state', (state) => {
                setIsLoading(state === 'loading');
                setIsAuthenticated(state === 'authenticated');
                if (state === 'unauthenticated') {
                    setWalletAddress(null);
                }
            });
            // Load initial state
            const loadInitialState = () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const savedAddress = yield Storage.getItem('camp-sdk:wallet-address');
                    if (savedAddress && authInstance.isAuthenticated) {
                        setWalletAddress(savedAddress);
                        setIsAuthenticated(true);
                    }
                }
                catch (err) {
                    console.error('Error loading initial auth state:', err);
                }
            });
            setAuth(authInstance);
            loadInitialState();
        }
        catch (error) {
            console.error("Failed to create AuthRN instance:", error);
            setError("Failed to initialize authentication");
        }
    }, [clientId, redirectUri, allowAnalytics, appKit]);
    const connect = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!auth)
            return;
        try {
            setError(null);
            const result = yield auth.connect();
            setWalletAddress(result.walletAddress);
        }
        catch (err) {
            setError(err.message || 'Failed to connect wallet');
            throw err;
        }
    });
    const disconnect = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!auth)
            return;
        try {
            setError(null);
            yield auth.disconnect();
            setWalletAddress(null);
        }
        catch (err) {
            setError(err.message || 'Failed to disconnect wallet');
            throw err;
        }
    });
    const clearError = () => {
        setError(null);
    };
    const getAppKit = () => {
        return auth === null || auth === void 0 ? void 0 : auth.getAppKit();
    };
    return (React.createElement(CampContext.Provider, { value: {
            auth,
            setAuth,
            clientId,
            isAuthenticated,
            isLoading,
            walletAddress,
            error,
            connect,
            disconnect,
            clearError,
            getAppKit,
        } }, children));
};
const useCamp = () => {
    const context = useContext(CampContext);
    if (!context) {
        throw new Error('useCamp must be used within a CampProvider');
    }
    return context;
};

export { CampContext, CampProvider, useCamp };
