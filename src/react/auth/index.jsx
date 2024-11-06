import { useContext, useEffect, useState, useSyncExternalStore } from "react";
import { CampContext } from "../context/CampContext";
import { providerStore } from "../../auth/viem/providers";
import styles from "./styles/auth.module.css";
/**
 * Returns the instance of the Auth class.
 * @returns {Auth} The instance of the Auth class.
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
    auth.on("auth", (state) => {
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
 * The ProviderButton component.
 * @param { { provider: { provider: string, info: { name: string, icon: string } }, handleConnect: function, loading: boolean } } props The props.
 * @returns { JSX.Element } The ProviderButton component.
 */
const ProviderButton = ({ provider, handleConnect, loading }) => {
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const handleClick = () => {
    handleConnect(provider);
    setIsButtonLoading(true);
  };
  useEffect(() => {
    if (!loading) {
      setIsButtonLoading(false);
    }
  }, [loading]);
  return (
    <button
      className={styles["provider-button"]}
      onClick={handleClick}
      disabled={loading}
    >
      <img
        src={
          provider.info.icon ||
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='%23333333' d='M21 7.28V5c0-1.1-.9-2-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-2.28A2 2 0 0 0 22 15V9a2 2 0 0 0-1-1.72M20 9v6h-7V9zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2z'/%3E%3Ccircle cx='16' cy='12' r='1.5' fill='%23aaaaaa'/%3E%3C/svg%3E"
        }
        alt={provider.info.name}
      />
      <span className={styles["provider-name"]}>{provider.info.name}</span>
      {isButtonLoading && <div className={styles.spinner} />}
    </button>
  );
};

/**
 * The CampModal component.
 * @returns { JSX.Element } The CampModal component.
 */
export const CampModal = () => {
  const { authenticated, loading } = useAuthState();
  const { connect, disconnect } = useConnect();
  const { setProvider } = useProvider();
  const [isVisible, setIsVisible] = useState(false);
  const providers = useProviders();
  const handleConnect = (provider) => {
    if (provider) setProvider(provider);
    connect();
  };
  const handleDisconnect = () => {
    disconnect();
  };

  const handleModalButton = () => {
    if (authenticated) {
      handleDisconnect();
    } else {
      setIsVisible(!isVisible);
    }
  };

  useEffect(() => {
    if (authenticated) {
      setIsVisible(false);
    }
  }, [authenticated]);
  return (
    <div>
      <button onClick={handleModalButton}>
        {authenticated ? "Disconnect" : "Connect"}
      </button>
      {isVisible && (
        <div
          className={styles.modal}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsVisible(false);
            }
          }}
        >
          <div className={styles.container}>
            {
              <>
                <img
                  className={styles["modal-icon"]}
                  src="https://cdn.harbor.gg/project/15/0e836c2dc9302eea702c398012a8e5c114108e32e8e0cbedcd348ce4773f642f.jpg"
                  alt="Camp Network"
                />
                <div className={styles["provider-list"]}>
                  {providers.map((provider) => (
                    <ProviderButton
                      provider={provider}
                      handleConnect={handleConnect}
                      loading={loading}
                      key={provider.info.uuid}
                    />
                  ))}
                  <ProviderButton
                    provider={{
                      provider: window.ethereum,
                      info: { name: "Browser Wallet" },
                    }}
                    handleConnect={handleConnect}
                    loading={loading}
                  />
                </div>
                <a
                  href="https://campnetwork.xyz"
                  className={styles["footer-text"]}
                >
                  Connect with Camp Network
                </a>
              </>
            }
          </div>
        </div>
      )}
    </div>
  );
};
