import { _ as __awaiter } from '../tslib.es6.js';
import { useContext, useState, useCallback, useEffect } from 'react';
import { CampContext } from '../context/CampContext.js';
import '../AuthRN.js';
import 'viem/siwe';
import 'viem';
import '../../errors';
import 'viem/accounts';
import '../storage.js';

// Main Camp authentication hook
const useCampAuth = () => {
    const context = useContext(CampContext);
    if (!context) {
        throw new Error('useCampAuth must be used within a CampProvider');
    }
    const { auth, isAuthenticated, isLoading, walletAddress, error, connect, disconnect, clearError } = context;
    return {
        auth,
        isAuthenticated,
        authenticated: isAuthenticated, // Alias for compatibility
        isLoading,
        loading: isLoading, // Alias for compatibility
        walletAddress,
        error,
        connect,
        disconnect,
        clearError,
    };
};
// Alias for compatibility
const useAuthState = () => {
    const { isAuthenticated, isLoading } = useCampAuth();
    return { authenticated: isAuthenticated, loading: isLoading };
};
// Combined hook for full Camp access
const useCamp = () => {
    const context = useContext(CampContext);
    if (!context) {
        throw new Error('useCamp must be used within a CampProvider');
    }
    return context;
};
// Social accounts hook
const useSocials = () => {
    const { auth } = useCampAuth();
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchSocials = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!auth || !auth.isAuthenticated) {
            setData({});
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const socialsData = yield auth.getLinkedSocials();
            setData(socialsData);
        }
        catch (err) {
            setError(err);
            setData({});
        }
        finally {
            setIsLoading(false);
        }
    }), [auth]);
    const linkSocial = useCallback((platform) => __awaiter(void 0, void 0, void 0, function* () {
        if (!auth)
            throw new Error('Authentication required');
        return auth.linkSocial(platform);
    }), [auth]);
    const unlinkSocial = useCallback((platform) => __awaiter(void 0, void 0, void 0, function* () {
        if (!auth)
            throw new Error('Authentication required');
        return auth.unlinkSocial(platform);
    }), [auth]);
    useEffect(() => {
        if (auth === null || auth === void 0 ? void 0 : auth.isAuthenticated) {
            fetchSocials();
        }
    }, [auth === null || auth === void 0 ? void 0 : auth.isAuthenticated, fetchSocials]);
    return {
        data,
        socials: data, // Alias for compatibility
        isLoading,
        error,
        linkSocial,
        unlinkSocial,
        refetch: fetchSocials,
    };
};
// AppKit hook for wallet operations (no wagmi dependency)
const useAppKit = () => {
    const { getAppKit, auth } = useCamp();
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [address, setAddress] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [balance, setBalance] = useState(null);
    const appKit = getAppKit();
    useEffect(() => {
        var _a, _b, _c;
        if (!appKit)
            return;
        // Check initial connection state
        try {
            const connected = ((_a = appKit.getIsConnected) === null || _a === void 0 ? void 0 : _a.call(appKit)) || false;
            const account = (_b = appKit.getAccount) === null || _b === void 0 ? void 0 : _b.call(appKit);
            const currentChainId = (_c = appKit.getChainId) === null || _c === void 0 ? void 0 : _c.call(appKit);
            setIsConnected(connected);
            setAddress((account === null || account === void 0 ? void 0 : account.address) || null);
            setChainId(currentChainId || null);
        }
        catch (error) {
            console.warn('Error getting AppKit state:', error);
        }
        // Set up event listeners if available
        let unsubscribeAccount;
        let unsubscribeNetwork;
        try {
            if (appKit.subscribeAccount) {
                unsubscribeAccount = appKit.subscribeAccount((account) => {
                    setAddress((account === null || account === void 0 ? void 0 : account.address) || null);
                    setIsConnected(!!(account === null || account === void 0 ? void 0 : account.address));
                });
            }
            if (appKit.subscribeChainId) {
                unsubscribeNetwork = appKit.subscribeChainId((chainId) => {
                    setChainId(chainId);
                });
            }
        }
        catch (error) {
            console.warn('Error setting up AppKit subscriptions:', error);
        }
        return () => {
            unsubscribeAccount === null || unsubscribeAccount === void 0 ? void 0 : unsubscribeAccount();
            unsubscribeNetwork === null || unsubscribeNetwork === void 0 ? void 0 : unsubscribeNetwork();
        };
    }, [appKit]);
    const openAppKit = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!appKit)
            throw new Error('AppKit not initialized');
        setIsConnecting(true);
        try {
            if (appKit.open) {
                yield appKit.open();
            }
            else if (appKit.openAppKit) {
                yield appKit.openAppKit();
            }
            else {
                throw new Error('No open method available on AppKit');
            }
            // Return the connected address
            const account = (_a = appKit.getAccount) === null || _a === void 0 ? void 0 : _a.call(appKit);
            return (account === null || account === void 0 ? void 0 : account.address) || '';
        }
        finally {
            setIsConnecting(false);
        }
    }), [appKit]);
    const disconnectAppKit = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!appKit)
            return;
        try {
            yield ((_a = appKit.disconnect) === null || _a === void 0 ? void 0 : _a.call(appKit));
            setIsConnected(false);
            setAddress(null);
            setChainId(null);
            setBalance(null);
        }
        catch (error) {
            console.error('Error disconnecting AppKit:', error);
            throw error;
        }
    }), [appKit]);
    const switchNetwork = useCallback((targetChainId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!appKit)
            throw new Error('AppKit not initialized');
        try {
            yield ((_a = appKit.switchNetwork) === null || _a === void 0 ? void 0 : _a.call(appKit, { chainId: targetChainId }));
            setChainId(targetChainId);
        }
        catch (error) {
            console.error('Error switching network:', error);
            throw error;
        }
    }), [appKit]);
    const signMessage = useCallback((message) => __awaiter(void 0, void 0, void 0, function* () {
        if (!appKit)
            throw new Error('AppKit not initialized');
        if (!isConnected)
            throw new Error('Wallet not connected');
        try {
            if (appKit.signMessage) {
                return yield appKit.signMessage({ message });
            }
            else if (auth && auth.signMessage) {
                // Fallback to auth instance
                return yield auth.signMessage(message);
            }
            else {
                throw new Error('Sign message not available');
            }
        }
        catch (error) {
            console.error('Error signing message:', error);
            throw error;
        }
    }), [appKit, isConnected, auth]);
    const sendTransaction = useCallback((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        if (!appKit)
            throw new Error('AppKit not initialized');
        if (!isConnected)
            throw new Error('Wallet not connected');
        try {
            if (appKit.sendTransaction) {
                return yield appKit.sendTransaction(transaction);
            }
            else if (auth && auth.sendTransaction) {
                // Fallback to auth instance
                return yield auth.sendTransaction(transaction);
            }
            else {
                throw new Error('Send transaction not available');
            }
        }
        catch (error) {
            console.error('Error sending transaction:', error);
            throw error;
        }
    }), [appKit, isConnected, auth]);
    const getBalance = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!appKit)
            throw new Error('AppKit not initialized');
        if (!isConnected || !address)
            throw new Error('Wallet not connected');
        try {
            if (appKit.getBalance) {
                const balanceResult = yield appKit.getBalance({ address });
                setBalance(balanceResult.formatted || balanceResult.toString());
                return balanceResult.formatted || balanceResult.toString();
            }
            else {
                throw new Error('Get balance not available');
            }
        }
        catch (error) {
            console.error('Error getting balance:', error);
            throw error;
        }
    }), [appKit, isConnected, address]);
    const getChainId = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!appKit)
            throw new Error('AppKit not initialized');
        try {
            const currentChainId = (_a = appKit.getChainId) === null || _a === void 0 ? void 0 : _a.call(appKit);
            if (currentChainId) {
                setChainId(currentChainId);
                return currentChainId;
            }
            else {
                throw new Error('Get chain ID not available');
            }
        }
        catch (error) {
            console.error('Error getting chain ID:', error);
            throw error;
        }
    }), [appKit]);
    const subscribeToAccountChanges = useCallback((callback) => {
        if (!appKit || !appKit.subscribeAccount) {
            return () => { }; // Return empty unsubscribe function
        }
        return appKit.subscribeAccount(callback);
    }, [appKit]);
    const subscribeToNetworkChanges = useCallback((callback) => {
        if (!appKit || !appKit.subscribeChainId) {
            return () => { }; // Return empty unsubscribe function
        }
        return appKit.subscribeChainId(callback);
    }, [appKit]);
    const getProvider = useCallback(() => {
        var _a;
        if (!appKit)
            throw new Error('AppKit not initialized');
        return ((_a = appKit.getProvider) === null || _a === void 0 ? void 0 : _a.call(appKit)) || appKit;
    }, [appKit]);
    return {
        // Connection state
        isConnected,
        isAppKitConnected: isConnected, // Alias for compatibility
        isConnecting,
        address,
        appKitAddress: address, // Alias for compatibility
        chainId,
        balance,
        // Connection actions
        openAppKit,
        disconnectAppKit,
        disconnect: disconnectAppKit, // Alias for compatibility
        // Wallet operations (REQUIREMENTS FULFILLED)
        signMessage,
        switchNetwork,
        sendTransaction,
        getBalance,
        getChainId,
        // Advanced operations (REQUIREMENTS FULFILLED)
        getProvider,
        subscribeAccount: subscribeToAccountChanges,
        subscribeChainId: subscribeToNetworkChanges,
        // Direct AppKit access
        appKit,
    };
};
// Modal control hook
const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const openModal = useCallback(() => {
        setIsOpen(true);
    }, []);
    const closeModal = useCallback(() => {
        setIsOpen(false);
    }, []);
    return {
        isOpen,
        openModal,
        closeModal,
    };
};
// Origin NFT operations hook
const useOrigin = () => {
    const { auth } = useCampAuth();
    const [stats, setStats] = useState({ data: null, isLoading: false, error: null, isError: false });
    const [uploads, setUploads] = useState({ data: [], isLoading: false, error: null, isError: false });
    const fetchStats = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!auth || !auth.isAuthenticated || !auth.origin)
            return;
        setStats(prev => (Object.assign(Object.assign({}, prev), { isLoading: true, error: null, isError: false })));
        try {
            const statsData = yield auth.origin.getOriginUsage();
            setStats({ data: statsData, isLoading: false, error: null, isError: false });
        }
        catch (error) {
            setStats({ data: null, isLoading: false, error: error, isError: true });
        }
    }), [auth]);
    const fetchUploads = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!auth || !auth.isAuthenticated || !auth.origin)
            return;
        setUploads(prev => (Object.assign(Object.assign({}, prev), { isLoading: true, error: null, isError: false })));
        try {
            const uploadsData = yield auth.origin.getOriginUploads();
            setUploads({ data: uploadsData || [], isLoading: false, error: null, isError: false });
        }
        catch (error) {
            setUploads({ data: [], isLoading: false, error: error, isError: true });
        }
    }), [auth]);
    const mintFile = useCallback((file, metadata, license, parentId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!(auth === null || auth === void 0 ? void 0 : auth.origin))
            throw new Error('Origin not initialized');
        return auth.origin.mintFile(file, metadata, license, parentId);
    }), [auth]);
    const createIPAsset = useCallback((file, metadata, license) => __awaiter(void 0, void 0, void 0, function* () {
        if (!(auth === null || auth === void 0 ? void 0 : auth.origin))
            throw new Error('Origin not initialized');
        const result = yield auth.origin.mintFile(file, metadata, license);
        if (typeof result === 'string')
            return result;
        return (result === null || result === void 0 ? void 0 : result.tokenId) || (result === null || result === void 0 ? void 0 : result.id) || 'unknown';
    }), [auth]);
    const createSocialIPAsset = useCallback((source, license) => __awaiter(void 0, void 0, void 0, function* () {
        if (!auth)
            throw new Error('Authentication required');
        const result = yield auth.mintSocial(source, license);
        if (typeof result === 'string')
            return result;
        return (result === null || result === void 0 ? void 0 : result.tokenId) || (result === null || result === void 0 ? void 0 : result.id) || 'unknown';
    }), [auth]);
    useEffect(() => {
        if ((auth === null || auth === void 0 ? void 0 : auth.isAuthenticated) && (auth === null || auth === void 0 ? void 0 : auth.origin)) {
            fetchStats();
            fetchUploads();
        }
    }, [auth === null || auth === void 0 ? void 0 : auth.isAuthenticated, auth === null || auth === void 0 ? void 0 : auth.origin, fetchStats, fetchUploads]);
    return {
        stats: Object.assign(Object.assign({}, stats), { refetch: fetchStats }),
        uploads: Object.assign(Object.assign({}, uploads), { refetch: fetchUploads }),
        mintFile,
        // IP Asset operations (REQUIREMENTS FULFILLED)
        createIPAsset,
        createSocialIPAsset,
    };
};

export { useAppKit, useAuthState, useCamp, useCampAuth, useModal, useOrigin, useSocials };
