import { useContext, useState, useEffect } from 'react';
import { CampContext } from '../context/CampContext.js';
import { ModalContext } from '../context/ModalContext.js';
import { SocialsContext } from '../context/SocialsContext.js';
import { OriginContext } from '../context/OriginContext.js';
import { c as constants } from '../AuthRN.js';
import '../tslib.es6.js';
import '../storage.js';
import '@tanstack/react-query';
import 'viem/siwe';
import 'viem';
import '../../errors';
import 'viem/accounts';

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
    const { auth } = useContext(CampContext);
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const [authProperties, setAuthProperties] = useState(getAuthProperties(auth));
    const [authVariables, setAuthVariables] = useState(getAuthVariables(auth));
    const updateAuth = () => {
        setAuthVariables(getAuthVariables(auth));
        setAuthProperties(getAuthProperties(auth));
    };
    useEffect(() => {
        auth.on("state", updateAuth);
        auth.on("provider", updateAuth);
    }, [auth]);
    return Object.assign(Object.assign({}, authVariables), authProperties);
};
/**
 * Returns the functions to link and unlink socials.
 */
const useLinkSocials = () => {
    const { auth } = useContext(CampContext);
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
    const { auth } = useContext(CampContext);
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const [provider, setProvider] = useState({
        provider: auth.viem,
        info: { name: ((_a = auth.viem) === null || _a === void 0 ? void 0 : _a.name) || "" },
    });
    useEffect(() => {
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
    const { auth } = useContext(CampContext);
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const [authenticated, setAuthenticated] = useState(auth.isAuthenticated);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
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
    const { auth } = useContext(CampContext);
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
    const { isVisible, setIsVisible } = useContext(ModalContext);
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
    const { isLinkingVisible, setIsLinkingVisible, setCurrentlyLinking } = useContext(ModalContext);
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
    const { query } = useContext(SocialsContext);
    const socials = (query === null || query === void 0 ? void 0 : query.data) || {};
    return Object.assign(Object.assign({}, query), { socials });
};
/**
 * Fetches the Origin usage data and uploads data.
 */
const useOrigin = () => {
    const { statsQuery, uploadsQuery } = useContext(OriginContext);
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

export { useAuth, useAuthState, useConnect, useLinkModal, useLinkSocials, useModal, useOrigin, useProvider, useProviders, useSocials };
