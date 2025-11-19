import { useContext, useEffect, useState, useSyncExternalStore } from "react";
import { CampContext, CampProvider } from "../context/CampContext";
import { ModalContext } from "../context/ModalContext";
import { providerStore, Provider } from "../../core/auth/viem/providers";
import { CampModal, MyCampModal } from "./modals";
import { Auth } from "../../core/auth";
import { SocialsContext } from "../context/SocialsContext";
import { LinkButton, StandaloneCampButton } from "./buttons";
import constants from "../../constants";
import { type UseQueryResult } from "@tanstack/react-query";

export { CampModal, MyCampModal };
export { LinkButton };
export { CampContext, CampProvider, ModalContext };
export { StandaloneCampButton as CampButton };

const isBrowser = typeof window !== "undefined";

const getAuthProperties = (auth: Auth) => {
  const prototype = Object.getPrototypeOf(auth);
  const properties = Object.getOwnPropertyNames(prototype);
  const object: Record<string, any> = {};

  for (const property of properties) {
    if (typeof (auth as any)[property] === "function") {
      object[property] = (auth as any)[property].bind(auth);
    }
  }

  return object;
};

const getAuthVariables = (auth: Auth) => {
  const variables = Object.keys(auth);
  const object: Record<string, any> = {};

  for (const variable of variables) {
    object[variable] = (auth as any)[variable];
  }

  return object;
};

/**
 * Returns the Auth instance provided by the context.
 * @returns { Auth } The Auth instance provided by the context.
 * @example
 * const auth = useAuth();
 * auth.connect();
 */
export const useAuth = (): Auth => {
  if (!isBrowser) {
    return {} as Auth;
  }
  const { auth } = useContext(CampContext);
  if (!auth) {
    throw new Error(
      "Auth instance is not available. Make sure to wrap your component with CampProvider."
    );
  }

  const [authProperties, setAuthProperties] = useState(getAuthProperties(auth));
  const [authVariables, setAuthVariables] = useState(getAuthVariables(auth));

  const updateAuth = () => {
    setAuthVariables(getAuthVariables(auth));
    setAuthProperties(getAuthProperties(auth));
  };

  useEffect(() => {
    if (!isBrowser) {
      return;
    }
    auth.on("state", updateAuth);
    auth.on("provider", updateAuth);
  }, [auth]);

  return { ...authVariables, ...authProperties } as Auth;
};

/**
 * Returns the functions to link and unlink socials.
 * @returns { { linkTwitter: function, unlinkTwitter: function, linkDiscord: function, unlinkDiscord: function, linkSpotify: function, unlinkSpotify: function } } The functions to link and unlink socials.
 * @example
 * const { linkTwitter, unlinkTwitter, linkDiscord, unlinkDiscord, linkSpotify, unlinkSpotify } = useLinkSocials();
 * linkTwitter();
 */
export const useLinkSocials = (): Record<string, Function> => {
  const { auth } = useContext(CampContext);

  if (!auth) {
    return {};
  }
  const prototype = Object.getPrototypeOf(auth);
  const linkingProps = Object.getOwnPropertyNames(prototype).filter(
    (prop) =>
      (prop.startsWith("link") || prop.startsWith("unlink")) &&
      (constants.AVAILABLE_SOCIALS.includes(prop.slice(4).toLowerCase()) ||
        constants.AVAILABLE_SOCIALS.includes(prop.slice(6).toLowerCase()))
  );

  const linkingFunctions = linkingProps.reduce(
    (acc, prop) => {
      acc[prop] = (auth as any)[prop].bind(auth);
      return acc;
    },
    {
      sendTelegramOTP: auth.sendTelegramOTP.bind(auth),
    } as Record<string, Function>
  );

  return linkingFunctions;
};

/**
 * Fetches the provider from the context and sets the provider in the auth instance.
 * @returns { { provider: { provider: string, info: { name: string } }, setProvider: function } } The provider and a function to set the provider.
 */
export const useProvider = (): {
  provider: { provider: any; info: { name: string } };
  setProvider: (provider: any, info?: any) => void;
} => {
  if (!isBrowser) {
    return {
      provider: { provider: null, info: { name: "" } },
      setProvider: () => {},
    };
  }
  const { auth } = useContext(CampContext);
  if (!auth) {
    throw new Error(
      "Auth instance is not available. Make sure to wrap your component with CampProvider."
    );
  }

  const [provider, setProvider] = useState({
    provider: isBrowser ? auth.viem?.transport : null,
    info: { name: isBrowser ? auth.viem?.transport?.name : "" },
  });
  useEffect(() => {
    if (isBrowser) {
      auth.on(
        "provider",
        ({ provider, info }: { provider: any; info: any }) => {
          setProvider({ provider, info });
        }
      );
    }
  }, [auth]);

  const authSetProvider = auth.setProvider.bind(auth);

  return { provider, setProvider: authSetProvider };
};

/**
 * Returns the authenticated state and loading state.
 * @returns { { authenticated: boolean, loading: boolean } } The authenticated state and loading state.
 */
export const useAuthState = (): {
  authenticated: boolean;
  loading: boolean;
} => {
  if (!isBrowser) {
    return { authenticated: false, loading: false };
  }
  const { auth } = useContext(CampContext);

  if (!auth) {
    throw new Error(
      "Auth instance is not available. Make sure to wrap your component with CampProvider."
    );
  }

  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setAuthenticated(auth.isAuthenticated);
    auth.on("state", (state: string) => {
      if (state === "loading") setLoading(true);
      else {
        if (state === "authenticated") setAuthenticated(true);
        else if (state === "unauthenticated") setAuthenticated(false);
        setLoading(false);
      }
    });
  }, [auth]);
  return { authenticated, loading };
};

export const useViem = (): {
  client: any;
} => {
  if (!isBrowser) {
    return { client: null };
  }
  const { auth } = useContext(CampContext);
  const [client, setClient] = useState<any>(null);
  useEffect(() => {
    setClient(auth?.viem);
    auth?.on("viem", (client: any) => {
      setClient(client);
    });
  }, [auth]);

  if (!auth) {
    throw new Error(
      "Auth instance is not available. Make sure to wrap your component with CampProvider."
    );
  }

  return {
    client,
  };
};

/**
 * Connects and disconnects the user.
 * @returns { { connect: function, disconnect: function } } The connect and disconnect functions.
 */
export const useConnect = (): {
  connect: () => Promise<{
    success: boolean;
    message: string;
    walletAddress: string;
  }>;
  disconnect: () => Promise<void>;
} => {
  if (!isBrowser) {
    return {
      connect: () =>
        Promise.resolve({ success: false, message: "", walletAddress: "" }),
      disconnect: () => Promise.resolve(),
    };
  }
  const { auth } = useContext(CampContext);

  if (!auth) {
    throw new Error(
      "Auth instance is not available. Make sure to wrap your component with CampProvider."
    );
  }

  const connect = auth.connect.bind(auth);
  const disconnect = auth.disconnect.bind(auth);
  return { connect, disconnect };
};

/**
 * Returns the array of providers.
 * @returns { Array } The array of providers and the loading state.
 */
export const useProviders = (): Provider[] => {
  if (!isBrowser) {
    return [];
  }

  return useSyncExternalStore(
    providerStore.subscribe as any,
    providerStore.value,
    providerStore.value
  );
};

/**
 * Returns the modal state and functions to open and close the modal.
 * @returns { { isOpen: boolean, openModal: function, closeModal: function } } The modal state and functions to open and close the modal.
 */
export const useModal = (): {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
} => {
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
 * @returns { { isLinkingOpen: boolean, closeModal: function, handleOpen: function } } The link modal state and functions to open and close the modal.
 */
export const useLinkModal = (): Record<string, Function | boolean> & {
  isLinkingOpen: boolean;
  closeModal: () => void;
  handleOpen: (social: string) => void;
} => {
  const { socials } = useSocials();
  const { isLinkingVisible, setIsLinkingVisible, setCurrentlyLinking } =
    useContext(ModalContext);

  const handleOpen = (social: string) => {
    if (!socials) {
      console.error("User is not authenticated");
      return;
    }
    setCurrentlyLinking(social);
    setIsLinkingVisible(true);
  };

  const handleLink = (social: string) => {
    if (!socials) {
      console.error("User is not authenticated");
      return;
    }
    if (socials && !socials[social]) {
      setCurrentlyLinking(social);
      setIsLinkingVisible(true);
    } else {
      setIsLinkingVisible(false);
      console.warn(`User already linked ${social}`);
    }
  };

  const handleUnlink = (social: string) => {
    if (!socials) {
      console.error("User is not authenticated");
      return;
    }
    if (socials && socials[social]) {
      setCurrentlyLinking(social);
      setIsLinkingVisible(true);
    } else {
      setIsLinkingVisible(false);
      console.warn(`User isn't linked to ${social}`);
    }
  };

  const handleClose = () => {
    setIsLinkingVisible(false);
  };

  const obj: Record<string, Function> = {};
  constants.AVAILABLE_SOCIALS.forEach((social) => {
    obj[`link${social.charAt(0).toUpperCase() + social.slice(1)}`] = () =>
      handleLink(social);
    obj[`unlink${social.charAt(0).toUpperCase() + social.slice(1)}`] = () =>
      handleUnlink(social);
    obj[`open${social.charAt(0).toUpperCase() + social.slice(1)}Modal`] = () =>
      handleOpen(social);
  });

  return {
    isLinkingOpen: isLinkingVisible,
    ...obj,
    closeModal: handleClose,
    handleOpen,
  };
};

type UseSocialsResult<TData = unknown, TError = Error> = UseQueryResult<
  TData,
  TError
> & {
  socials: Record<string, string>;
};

/**
 * Fetches the socials linked to the user.
 * @returns { { data: {}, socials: {}, error: Error, isLoading: boolean, refetch: () => {} } } react-query query object.
 */

export const useSocials = (): UseSocialsResult => {
  const { query } = useContext(SocialsContext) as {
    query: UseQueryResult<any, Error>;
  };
  const socials = query?.data || {};
  return {
    ...query,
    socials,
  };
};
