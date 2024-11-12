import { useContext, useEffect, useState, useSyncExternalStore } from "react";
import { CampContext } from "../context/CampContext";
import { ModalContext } from "../context/ModalContext";
import { providerStore } from "../../auth/viem/providers";
import { CampModal, MyCampModal } from "./modals";
import { useQuery } from "@tanstack/react-query";
import { Auth } from "../../auth/index";

export { CampModal, MyCampModal };
/**
 * Returns the instance of the Auth class.
 * @returns { Auth } The instance of the Auth class.
 * @example
 */
export const useAuth = () => {
  const { auth } = useContext(CampContext);
  return auth;
};

/**
 * Fetches the provider from the context and sets the provider in the auth instance.
 * @returns { { provider: { provider: string, info: { name: string } }, setProvider: function } } The provider and a function to set the provider.
 */
export const useProvider = () => {
  const { auth } = useContext(CampContext);
  const [provider, setProvider] = useState({
    provider: auth.viem.transport,
    info: { name: auth.viem.transport.name },
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
 * @returns { { authenticated: boolean, loading: boolean } } The authenticated state and loading state.
 */
export const useAuthState = () => {
  const { auth } = useContext(CampContext);
  const [authenticated, setAuthenticated] = useState(auth.isAuthenticated);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    auth.on("state", (state) => {
      setAuthenticated(state === "authenticated");
      setLoading(state === "loading");
    });
  }, [auth]);
  return { authenticated, loading };
};

/**
 * Connects and disconnects the user.
 * @returns { { connect: function, disconnect: function } } The connect and disconnect functions.
 */
export const useConnect = () => {
  const { auth } = useContext(CampContext);
  const connect = auth.connect.bind(auth);
  const disconnect = auth.disconnect.bind(auth);
  return { connect, disconnect };
};

/**
 * Returns the array of providers.
 * @returns { Array } The array of providers and the loading state.
 */
export const useProviders = () =>
  useSyncExternalStore(
    providerStore.subscribe,
    providerStore.value,
    providerStore.value
  );

/**
 * Returns the modal state and functions to open and close the modal.
 * @returns { { isOpen: boolean, openModal: function, closeModal: function } } The modal state and functions to open and close the modal.
 */
export const useModal = () => {
  const {
    isAuthVisible,
    setIsAuthVisible,
    isMyCampVisible,
    setIsMyCampVisible,
  } = useContext(ModalContext);
  const { authenticated } = useAuthState();

  const handleOpen = () => {
    if (authenticated) {
      setIsMyCampVisible(true);
    } else {
      setIsAuthVisible(true);
    }
  };

  const handleClose = () => {
    if (authenticated) {
      setIsMyCampVisible(false);
    } else {
      setIsAuthVisible(false);
    }
  };

  return {
    isOpen: isAuthVisible || isMyCampVisible,
    openModal: handleOpen,
    closeModal: handleClose,
  };
};

/**
 * Fetches the socials linked to the user.
 * @returns { { data: Array, error: Error, loading: boolean } } The socials linked to the user.
 */
export const useSocials = () => {
  const { auth } = useContext(CampContext);
  return useQuery({
    queryKey: ["socials", auth.isAuthenticated],
    queryFn: () => auth.getLinkedSocials(),
  });
};
