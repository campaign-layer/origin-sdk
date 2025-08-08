'use strict';

var tslib_es6 = require('../node_modules/tslib/tslib.es6.js');
var React = require('react');
var AuthRN = require('../auth/AuthRN.js');
var storage = require('../storage.js');

/**
 * CampContext for React Native with AppKit integration
 */
const CampContext = React.createContext({
    auth: null,
    setAuth: () => { },
    clientId: "",
    isAuthenticated: false,
    isLoading: false,
    walletAddress: null,
    error: null,
    connect: () => tslib_es6.__awaiter(void 0, void 0, void 0, function* () { }),
    disconnect: () => tslib_es6.__awaiter(void 0, void 0, void 0, function* () { }),
    clearError: () => { },
    getAppKit: () => null,
});
const CampProvider = ({ children, clientId, redirectUri, allowAnalytics = true, appKit }) => {
    const [auth, setAuth] = React.useState(null);
    const [isAuthenticated, setIsAuthenticated] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [walletAddress, setWalletAddress] = React.useState(null);
    const [error, setError] = React.useState(null);
    React.useEffect(() => {
        if (!clientId) {
            console.error("CampProvider: clientId is required");
            return;
        }
        try {
            const authInstance = new AuthRN.AuthRN({
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
            const loadInitialState = () => tslib_es6.__awaiter(void 0, void 0, void 0, function* () {
                try {
                    const savedAddress = yield storage.Storage.getItem('camp-sdk:wallet-address');
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
    const connect = () => tslib_es6.__awaiter(void 0, void 0, void 0, function* () {
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
    const disconnect = () => tslib_es6.__awaiter(void 0, void 0, void 0, function* () {
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
    const context = React.useContext(CampContext);
    if (!context) {
        throw new Error('useCamp must be used within a CampProvider');
    }
    return context;
};

exports.CampContext = CampContext;
exports.CampProvider = CampProvider;
exports.useCamp = useCamp;
