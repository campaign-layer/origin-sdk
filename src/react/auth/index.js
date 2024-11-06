import { useContext, useEffect, useState, useSyncExternalStore } from "react";
import { CampContext } from "../context/CampContext";
import { providerStore } from "../../auth/viem/providers";
/**
 * @returns {Auth} The instance of the Auth class.
 * @example
 * import { useAuth } from "./auth/index.js";
 * const auth = useAuth();
 */
export const useAuth = () => {
  const { auth } = useContext(CampContext);
  return auth;
};

export const useProvider = () => {
  const { auth } = useContext(CampContext);
  const [provider, setProvider] = useState({
    provider: auth.viem.transport,
    info: { name: auth.viem.transport.name },
  });
  useEffect(() => {
    auth.setProvider(provider);
  }, [auth, provider]);

  return { provider, setProvider };
};

export const useAuthState = () => {
  const { auth } = useContext(CampContext);
  const [authenticated, setAuthenticated] = useState(auth.isAuthenticated);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    auth.on("auth", (state) => {
      setAuthenticated(state === "authenticated");
      setLoading(state === "loading");
    });
  }, [auth]);
  return { authenticated, loading };
};

export const useConnect = () => {
  const { auth } = useContext(CampContext);
  const connect = auth.connect.bind(auth);
  const disconnect = auth.disconnect.bind(auth);
  return { connect, disconnect };
};

export const useProviders = () =>
  useSyncExternalStore(
    providerStore.subscribe,
    providerStore.value,
    providerStore.value
  );
