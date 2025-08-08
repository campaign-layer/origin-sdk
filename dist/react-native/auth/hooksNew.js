'use strict';

var React = require('react');
var CampContext = require('../context/CampContext.js');

/**
 * Hook to get the Auth instance
 */
const useAuth = () => {
    const { auth } = React.useContext(CampContext.CampContext);
    return auth;
};
/**
 * Hook to get auth state
 */
const useAuthState = () => {
    const { auth } = React.useContext(CampContext.CampContext);
    return {
        authenticated: (auth === null || auth === void 0 ? void 0 : auth.isAuthenticated) || false,
        loading: false, // TODO: implement proper loading state
        error: null,
        walletAddress: (auth === null || auth === void 0 ? void 0 : auth.walletAddress) || null,
        user: (auth === null || auth === void 0 ? void 0 : auth.userId) || null,
    };
};
/**
 * Hook for connecting wallet
 */
const useConnect = () => {
    const auth = useAuth();
    return {
        connect: () => auth === null || auth === void 0 ? void 0 : auth.connect(),
        disconnect: () => { var _a; return (_a = auth === null || auth === void 0 ? void 0 : auth.disconnect) === null || _a === void 0 ? void 0 : _a.call(auth); },
    };
};
/**
 * Placeholder hooks - to be implemented
 */
const useProvider = () => {
    return null;
};
const useProviders = () => {
    return [];
};
const useSocials = () => {
    useAuth();
    return {
        twitter: false, // TODO: implement proper socials tracking
        discord: false,
        spotify: false,
        tiktok: false,
        telegram: false,
    };
};
const useLinkSocials = () => {
    const auth = useAuth();
    return {
        linkTwitter: () => { var _a; return (_a = auth === null || auth === void 0 ? void 0 : auth.linkTwitter) === null || _a === void 0 ? void 0 : _a.call(auth); },
        linkDiscord: () => { var _a; return (_a = auth === null || auth === void 0 ? void 0 : auth.linkDiscord) === null || _a === void 0 ? void 0 : _a.call(auth); },
        linkSpotify: () => { var _a; return (_a = auth === null || auth === void 0 ? void 0 : auth.linkSpotify) === null || _a === void 0 ? void 0 : _a.call(auth); },
        linkTikTok: (config) => { var _a; return (_a = auth === null || auth === void 0 ? void 0 : auth.linkTikTok) === null || _a === void 0 ? void 0 : _a.call(auth, config); },
        linkTelegram: (config) => { var _a; return (_a = auth === null || auth === void 0 ? void 0 : auth.linkTelegram) === null || _a === void 0 ? void 0 : _a.call(auth, config, "", ""); },
    };
};
const useLinkModal = () => {
    return {
        open: () => console.log("Link modal not implemented"),
        close: () => console.log("Link modal not implemented"),
        isOpen: false,
    };
};
const useOrigin = () => {
    const auth = useAuth();
    return {
        uploads: { data: [], isLoading: false, refetch: () => { } },
        stats: { data: null, isLoading: false },
        origin: (auth === null || auth === void 0 ? void 0 : auth.origin) || null,
    };
};

exports.useAuth = useAuth;
exports.useAuthState = useAuthState;
exports.useConnect = useConnect;
exports.useLinkModal = useLinkModal;
exports.useLinkSocials = useLinkSocials;
exports.useOrigin = useOrigin;
exports.useProvider = useProvider;
exports.useProviders = useProviders;
exports.useSocials = useSocials;
