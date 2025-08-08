'use strict';

var React = require('react');
var CampContext = require('../context/CampContext.js');
var ModalContext = require('../context/ModalContext.js');
var SocialsContext = require('../context/SocialsContext.js');
var OriginContext = require('../context/OriginContext.js');
var constants = require('../src/constants.js');

const getAuthProperties = (auth) => {
    const prototype = Object.getPrototypeOf(auth);
    const properties = Object.getOwnPropertyNames(prototype);
    const object = {};
    for (const property of properties) {
        if (typeof auth[property] === "function") {
            object[property] = auth[property].bind(auth);
        }
    }
    return object;
};
const getAuthVariables = (auth) => {
    const variables = Object.keys(auth);
    const object = {};
    for (const variable of variables) {
        object[variable] = auth[variable];
    }
    return object;
};
/**
 * Returns the Auth instance provided by the context.
 * @returns { AuthRN } The Auth instance provided by the context.
 */
const useAuth = () => {
    const { auth } = React.useContext(CampContext.CampContext);
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const [authProperties, setAuthProperties] = React.useState(getAuthProperties(auth));
    const [authVariables, setAuthVariables] = React.useState(getAuthVariables(auth));
    const updateAuth = () => {
        setAuthVariables(getAuthVariables(auth));
        setAuthProperties(getAuthProperties(auth));
    };
    React.useEffect(() => {
        auth.on("state", updateAuth);
        auth.on("provider", updateAuth);
    }, [auth]);
    return Object.assign(Object.assign({}, authVariables), authProperties);
};
/**
 * Returns the functions to link and unlink socials.
 */
const useLinkSocials = () => {
    const { auth } = React.useContext(CampContext.CampContext);
    if (!auth) {
        return {};
    }
    const prototype = Object.getPrototypeOf(auth);
    const linkingProps = Object.getOwnPropertyNames(prototype).filter((prop) => (prop.startsWith("link") || prop.startsWith("unlink")) &&
        (constants.AVAILABLE_SOCIALS.includes(prop.slice(4).toLowerCase()) ||
            constants.AVAILABLE_SOCIALS.includes(prop.slice(6).toLowerCase())));
    const linkingFunctions = linkingProps.reduce((acc, prop) => {
        acc[prop] = auth[prop].bind(auth);
        return acc;
    }, {
        sendTelegramOTP: auth.sendTelegramOTP.bind(auth),
    });
    return linkingFunctions;
};
/**
 * Returns the provider state and setter.
 */
const useProvider = () => {
    var _a;
    const { auth } = React.useContext(CampContext.CampContext);
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const [provider, setProvider] = React.useState({
        provider: auth.viem,
        info: { name: ((_a = auth.viem) === null || _a === void 0 ? void 0 : _a.name) || "" },
    });
    React.useEffect(() => {
        auth.on("provider", ({ provider, info }) => {
            setProvider({ provider, info });
        });
    }, [auth]);
    const authSetProvider = auth.setProvider.bind(auth);
    return { provider, setProvider: authSetProvider };
};
/**
 * Returns the authenticated state and loading state.
 */
const useAuthState = () => {
    const { auth } = React.useContext(CampContext.CampContext);
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const [authenticated, setAuthenticated] = React.useState(auth.isAuthenticated);
    const [loading, setLoading] = React.useState(false);
    React.useEffect(() => {
        setAuthenticated(auth.isAuthenticated);
        auth.on("state", (state) => {
            if (state === "loading")
                setLoading(true);
            else {
                if (state === "authenticated")
                    setAuthenticated(true);
                else if (state === "unauthenticated")
                    setAuthenticated(false);
                setLoading(false);
            }
        });
    }, [auth]);
    return { authenticated, loading };
};
/**
 * Connects and disconnects the user.
 */
const useConnect = () => {
    const { auth } = React.useContext(CampContext.CampContext);
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const connect = auth.connect.bind(auth);
    const disconnect = auth.disconnect.bind(auth);
    return { connect, disconnect };
};
/**
 * Returns the array of providers (empty in React Native as we use AppKit).
 */
const useProviders = () => {
    // In React Native, we don't have the same provider discovery as web
    // This would be replaced by AppKit wallet connections
    return [];
};
/**
 * Returns the modal state and functions to open and close the modal.
 */
const useModal = () => {
    const { isVisible, setIsVisible } = React.useContext(ModalContext.ModalContext);
    const handleOpen = () => {
        setIsVisible(true);
    };
    const handleClose = () => {
        setIsVisible(false);
    };
    return {
        isOpen: isVisible,
        openModal: handleOpen,
        closeModal: handleClose,
    };
};
/**
 * Returns the functions to open and close the link modal.
 */
const useLinkModal = () => {
    const { socials } = useSocials();
    const { isLinkingVisible, setIsLinkingVisible, setCurrentlyLinking } = React.useContext(ModalContext.ModalContext);
    const handleOpen = (social) => {
        if (!socials) {
            console.error("User is not authenticated");
            return;
        }
        setCurrentlyLinking(social);
        setIsLinkingVisible(true);
    };
    const handleLink = (social) => {
        if (!socials) {
            console.error("User is not authenticated");
            return;
        }
        if (socials && !socials[social]) {
            setCurrentlyLinking(social);
            setIsLinkingVisible(true);
        }
        else {
            setIsLinkingVisible(false);
            console.warn(`User already linked ${social}`);
        }
    };
    const handleUnlink = (social) => {
        if (!socials) {
            console.error("User is not authenticated");
            return;
        }
        if (socials && socials[social]) {
            setCurrentlyLinking(social);
            setIsLinkingVisible(true);
        }
        else {
            setIsLinkingVisible(false);
            console.warn(`User isn't linked to ${social}`);
        }
    };
    const handleClose = () => {
        setIsLinkingVisible(false);
    };
    const obj = {};
    constants.AVAILABLE_SOCIALS.forEach((social) => {
        obj[`link${social.charAt(0).toUpperCase() + social.slice(1)}`] = () => handleLink(social);
        obj[`unlink${social.charAt(0).toUpperCase() + social.slice(1)}`] = () => handleUnlink(social);
        obj[`open${social.charAt(0).toUpperCase() + social.slice(1)}Modal`] = () => handleOpen(social);
    });
    return Object.assign(Object.assign({ isLinkingOpen: isLinkingVisible }, obj), { closeModal: handleClose, handleOpen });
};
/**
 * Fetches the socials linked to the user.
 */
const useSocials = () => {
    const { query } = React.useContext(SocialsContext.SocialsContext);
    const socials = (query === null || query === void 0 ? void 0 : query.data) || {};
    return Object.assign(Object.assign({}, query), { socials });
};
/**
 * Fetches the Origin usage data and uploads data.
 */
const useOrigin = () => {
    const { statsQuery, uploadsQuery } = React.useContext(OriginContext.OriginContext);
    return {
        stats: {
            data: statsQuery === null || statsQuery === void 0 ? void 0 : statsQuery.data,
            isError: statsQuery === null || statsQuery === void 0 ? void 0 : statsQuery.isError,
            isLoading: statsQuery === null || statsQuery === void 0 ? void 0 : statsQuery.isLoading,
            refetch: statsQuery === null || statsQuery === void 0 ? void 0 : statsQuery.refetch,
        },
        uploads: {
            data: (uploadsQuery === null || uploadsQuery === void 0 ? void 0 : uploadsQuery.data) || [],
            isError: uploadsQuery === null || uploadsQuery === void 0 ? void 0 : uploadsQuery.isError,
            isLoading: uploadsQuery === null || uploadsQuery === void 0 ? void 0 : uploadsQuery.isLoading,
            refetch: uploadsQuery === null || uploadsQuery === void 0 ? void 0 : uploadsQuery.refetch,
        },
    };
};

exports.useAuth = useAuth;
exports.useAuthState = useAuthState;
exports.useConnect = useConnect;
exports.useLinkModal = useLinkModal;
exports.useLinkSocials = useLinkSocials;
exports.useModal = useModal;
exports.useOrigin = useOrigin;
exports.useProvider = useProvider;
exports.useProviders = useProviders;
exports.useSocials = useSocials;
