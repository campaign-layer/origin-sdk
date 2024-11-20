import { useContext, useEffect, useState } from "react";
import {
  useAuthState,
  useConnect,
  useProvider,
  useProviders,
  useSocials,
} from ".";
import { ModalContext } from "../context/ModalContext";
import styles from "./styles/auth.module.css";
import { CampContext } from "../context/CampContext";
import { formatAddress } from "../../utils";
import { useWalletConnectProvider } from "../../auth/viem/walletconnect";
import { custom, useAccount, useConnectorClient } from "wagmi";

const DiscordIcon = () => (
  <svg
    className="w-8 h-8"
    viewBox="0 0 42 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M41.1302 23.4469V24.2363C41.0328 24.2948 41.0717 24.3923 41.062 24.4702C41.0328 24.8991 40.9938 25.3279 40.9645 25.7568C40.9548 25.9322 40.8866 26.0589 40.7306 26.1661C37.7092 28.3396 34.4247 30.0062 30.8672 31.1173C30.6528 31.1856 30.5358 31.1563 30.3994 30.9711C29.6879 29.977 29.0446 28.9439 28.4696 27.862C28.3624 27.6573 28.4111 27.5989 28.6061 27.5209C29.532 27.17 30.4286 26.7509 31.2961 26.2733C31.8419 25.981 31.8224 25.9907 31.3546 25.5911C31.1109 25.3767 30.9062 25.3474 30.5943 25.4936C27.7971 26.7509 24.8634 27.4624 21.7933 27.5989C18.0507 27.7645 14.4542 27.092 11.0235 25.6008C10.5069 25.3767 10.1463 25.3669 9.75645 25.7763C9.59076 25.9517 9.54202 25.9907 9.77594 26.1271C10.7213 26.6534 11.6862 27.131 12.6999 27.5014C12.963 27.5989 12.963 27.6963 12.8461 27.9205C12.2905 28.9634 11.6667 29.9575 10.9942 30.9224C10.8383 31.1466 10.6921 31.1953 10.429 31.1173C6.91049 29.9965 3.65518 28.3591 0.663021 26.2051C0.497331 26.0784 0.419365 25.9615 0.409619 25.747C0.409619 25.4156 0.360879 25.094 0.341386 24.7626C0.156204 21.9752 0.292661 19.2072 0.789729 16.4489C1.66691 11.5952 3.61619 7.18007 6.33545 3.08656C6.43291 2.94037 6.54012 2.8429 6.69607 2.76493C9.25938 1.61485 11.9202 0.805904 14.6784 0.308836C14.8538 0.279597 14.961 0.308829 15.0488 0.484265C15.3217 1.04956 15.6141 1.6051 15.887 2.17039C15.9844 2.37507 16.0624 2.4628 16.3158 2.42381C19.2397 2.01446 22.1734 2.02421 25.0973 2.42381C25.2923 2.45305 25.3702 2.39457 25.4385 2.22889C25.7114 1.65385 26.0038 1.08854 26.2767 0.513503C26.3644 0.32832 26.4813 0.26985 26.686 0.308836C29.4248 0.805904 32.066 1.61486 34.6099 2.74545C34.7853 2.82342 34.912 2.94037 35.0192 3.10606C38.4305 8.18395 40.5454 13.7297 40.9938 19.8699C41.0133 20.1623 40.9548 20.4742 41.101 20.7666V21.4976C41.0035 21.634 41.0328 21.7997 41.0425 21.9459C41.0718 22.4527 40.9645 22.9693 41.101 23.4761L41.1302 23.4469ZM23.8108 17.063C23.8108 18.0961 24.035 18.9148 24.5223 19.6458C25.8868 21.7218 28.5963 21.9069 30.1655 20.0259C31.53 18.3885 31.4618 15.8349 29.9998 14.2755C28.7815 12.9792 26.8225 12.8038 25.419 13.8856C24.3371 14.7238 23.8595 15.8739 23.8206 17.063H23.8108ZM17.5731 17.3748C17.5731 16.6244 17.4756 16.0103 17.2027 15.4353C16.5595 14.1 15.5361 13.2424 14.0059 13.1936C12.4952 13.1449 11.4328 13.9246 10.7408 15.2111C9.88315 16.829 10.1366 18.7881 11.3549 20.1623C12.5829 21.5463 14.6102 21.7315 16.0526 20.5619C17.0955 19.714 17.5438 18.5737 17.5828 17.3748H17.5731Z"
      fill="#5865F2"
    />
  </svg>
);

const TwitterIcon = () => (
  <svg
    className="w-8 h-8"
    viewBox="0 0 33 27"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M32.3127 3.1985C31.3088 3.64684 30.2075 3.92949 29.1257 4.10493C29.6422 4.01721 30.3927 3.09129 30.6948 2.71118C31.1529 2.13614 31.5428 1.48313 31.7572 0.781387C31.7864 0.722908 31.8059 0.654685 31.7572 0.615699C31.689 0.58646 31.6402 0.605947 31.5915 0.62544C30.3829 1.26871 29.1354 1.73654 27.8099 2.07766C27.7027 2.1069 27.615 2.07766 27.5467 2.00943C27.4395 1.88273 27.3323 1.76578 27.2153 1.66832C26.6598 1.19074 26.0555 0.820367 25.383 0.547467C24.4961 0.186849 23.5312 0.0309141 22.576 0.0991391C21.6501 0.157618 20.734 0.420776 19.9055 0.849619C19.0771 1.27846 18.3461 1.88273 17.7516 2.60397C17.1473 3.35444 16.6989 4.24137 16.465 5.17702C16.2409 6.08344 16.2603 6.98012 16.3968 7.89629C16.4163 8.05223 16.3968 8.07173 16.2701 8.05224C11.0752 7.28227 6.76732 5.42069 3.26834 1.4344C3.1124 1.25896 3.03443 1.25897 2.90773 1.44415C1.37754 3.73457 2.11826 7.41871 4.02857 9.23155C4.28197 9.47521 4.54513 9.71887 4.82777 9.93329C4.72056 9.95278 3.45353 9.81633 2.32294 9.23155C2.167 9.13408 2.09877 9.19257 2.07928 9.35826C2.06953 9.60192 2.07928 9.83583 2.11827 10.099C2.41066 12.4284 4.01882 14.5726 6.23126 15.4108C6.49442 15.518 6.78681 15.6155 7.06946 15.6642C6.56264 15.7714 6.04608 15.8494 4.61335 15.7422C4.43792 15.7032 4.36969 15.8006 4.43792 15.9663C5.51977 18.9195 7.85892 19.7967 9.60353 20.2938C9.83744 20.3327 10.0714 20.3327 10.3053 20.3912C10.2955 20.4107 10.276 20.4107 10.2663 20.4302C9.6815 21.3171 7.67374 21.9701 6.73808 22.3015C5.03245 22.8961 3.18063 23.169 1.37754 22.9838C1.08514 22.9448 1.02666 22.9448 0.948692 22.9838C0.870721 23.0325 0.938946 23.1007 1.02666 23.1787C1.39703 23.4224 1.76739 23.6368 2.1475 23.8415C3.28784 24.4457 4.48665 24.9331 5.73419 25.2742C12.1766 27.0578 19.4279 25.742 24.2622 20.937C28.0633 17.1652 29.3888 11.9605 29.3888 6.7462C29.3888 6.54153 29.6325 6.43433 29.7689 6.31737C30.7533 5.57664 31.5525 4.68971 32.2932 3.69558C32.4589 3.47141 32.4589 3.27648 32.4589 3.18876V3.15952C32.4589 3.0718 32.4589 3.10104 32.3322 3.15952L32.3127 3.1985Z"
      fill="#1F9CEA"
    />
  </svg>
);

const SpotifyIcon = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="#1DB954"
  >
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const CloseIcon = () => (
  <svg
    className={styles["close-icon"]}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 6L18 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * The ProviderButton component.
 * @param { { provider: { provider: string, info: { name: string, icon: string } }, handleConnect: function, loading: boolean, label: string } } props The props.
 * @returns { JSX.Element } The ProviderButton component.
 */
const ProviderButton = ({ provider, handleConnect, loading, label }) => {
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
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='%23777777' d='M21 7.28V5c0-1.1-.9-2-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-2.28A2 2 0 0 0 22 15V9a2 2 0 0 0-1-1.72M20 9v6h-7V9zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2z'/%3E%3Ccircle cx='16' cy='12' r='1.5' fill='%23777777'/%3E%3C/svg%3E"
        }
        alt={provider.info.name}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <span className={styles["provider-name"]}>{provider.info.name}</span>
        {label && <span className={styles["provider-label"]}>({label})</span>}
      </div>
      {isButtonLoading && <div className={styles.spinner} />}
    </button>
  );
};

/**
 * The injected CampButton component.
 * @param { { onClick: function, authenticated: boolean } } props The props.
 * @returns { JSX.Element } The CampButton component.
 */
const CampButton = ({ onClick, authenticated, disabled }) => {
  return (
    <button
      className={styles["connect-button"]}
      onClick={onClick}
      disabled={disabled}
    >
      <div className={styles["button-icon"]}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 571.95 611.12"
          height="1rem"
          width="1rem"
        >
          <path
            d="m563.25 431.49-66.17-51.46c-11.11-8.64-27.28-5.06-33.82 7.4-16.24 30.9-41.69 56.36-70.85 73.73l-69.35-69.35c-3.73-3.73-8.79-5.83-14.07-5.83s-10.34 2.1-14.07 5.83l-73.78 73.78c-57.37-30.39-96.55-90.71-96.55-160.03 0-99.79 81.19-180.98 180.98-180.98 60.35 0 118.17 26.28 156.39 89.44 6.85 11.32 21.92 14.33 32.59 6.51l64.21-47.06c9.53-6.98 12.06-20.15 5.78-30.16C508.83 54.41 411.43 0 305.56 0 137.07 0 0 137.07 0 305.56s137.07 305.56 305.56 305.56c57.6 0 113.72-16.13 162.31-46.63A306.573 306.573 0 0 0 568.8 460.8c5.78-9.78 3.42-22.34-5.55-29.31Zm-301.42 49.69 47.15-47.15 44.69 44.69c-15.92 5.1-32.2 7.83-48.1 7.83-15.08 0-29.72-1.87-43.74-5.36Zm42.36-222.47c-.07 1.49-.08 21.29 49.54 55.11 37.02 25.24 19.68 75.52 12.1 92.05a147.07 147.07 0 0 0-20.12-38.91c-12.73-17.59-26.87-28.9-36.74-35.59-10.38 6.36-27.41 18.74-41.07 40.02-8.27 12.89-12.82 25.16-15.42 34.48l-.03-.05c-15.1-40.6-9.75-60.88-1.95-71.9 6.12-8.65 17.24-20.6 17.24-20.6 9.71-9.66 19.96-19.06 29.82-38.17 6.06-11.75 6.59-15.84 6.63-16.45Z"
            fill="#000"
            strokeWidth="0"
          />
          <path
            d="M267.74 313.33s-11.11 11.95-17.24 20.6c-7.8 11.02-13.14 31.3 1.95 71.9-86.02-75.3 2.56-152.15.79-146.3-6.58 21.75 14.49 53.8 14.49 53.8Zm20.98-23.66c3.01-4.27 5.97-9.06 8.8-14.55 6.62-12.83 6.64-16.54 6.64-16.54s-2.09 20.02 49.53 55.21c37.02 25.24 19.68 75.52 12.1 92.05 0 0 43.69-27.86 37.49-74.92-7.45-56.61-38.08-51.5-60.84-93.43-21.23-39.11 15.03-70.44 15.03-70.44s-48.54-2.61-70.76 48.42c-23.42 53.77 2 74.21 2 74.21Z"
            fill="#ff6d01"
            strokeWidth="0"
          />
        </svg>
      </div>
      {authenticated ? "My Camp" : "Connect"}
    </button>
  );
};

/**
 * The Auth modal component.
 * @param { { setIsVisible: function, wcProvider: object, loading: boolean } } props The props.
 * @returns { JSX.Element } The Auth modal component.
 */
const AuthModal = ({ setIsVisible, wcProvider, loading }) => {
  const { connect } = useConnect();
  const { setProvider } = useProvider();
  const { auth, wagmiAvailable } = useContext(CampContext);
  const [customProvider, setCustomProvider] = useState(null);
  const providers = useProviders();
  let customConnector;
  let customAccount;
  if (wagmiAvailable) {
    customConnector = useConnectorClient();
    customAccount = useAccount();
  }

  const handleWalletConnect = async ({ provider }) => {
    auth.setLoading(true);
    try {
      if (provider.connected) await provider.disconnect();
      await provider.connect();
    } catch (error) {
      auth.setLoading(false);
    }
  };

  useEffect(() => {
    console.log(customAccount?.isConnected);
    console.log(customAccount?.connector)
  }, [customAccount]);

  useEffect(() => {
    if (wagmiAvailable && customConnector) {
      const provider = customConnector.data;
      if (provider) {
        setCustomProvider(provider);
      }
    }
  }, [customConnector, customAccount]);

  useEffect(() => {
    const doConnect = async () => {
      handleConnect({
        provider: wcProvider,
        info: { name: "WalletConnect" },
      });
    };
    if (wcProvider) {
      wcProvider.on("connect", doConnect);
    }
    return () => {
      if (wcProvider) {
        wcProvider.off("connect", doConnect);
      }
    };
  }, [wcProvider]);

  const handleConnect = (provider) => {
    if (provider) setProvider(provider);
    connect();
  };
  return (
    <div className={styles.container}>
      <div
        className={styles["close-button"]}
        onClick={() => setIsVisible(false)}
      >
        <CloseIcon />
      </div>
      <div className={styles.header}>
        <img
          className={styles["modal-icon"]}
          src="https://cdn.harbor.gg/project/15/0e836c2dc9302eea702c398012a8e5c114108e32e8e0cbedcd348ce4773f642f.jpg"
          alt="Camp Network"
        />
        <span>Connect with Camp</span>
      </div>

      <div className={styles["provider-list"]}>
        {providers.map((provider) => (
          <ProviderButton
            provider={provider}
            handleConnect={handleConnect}
            loading={loading}
            key={provider.info.uuid}
          />
        ))}
        {wcProvider && (
          <ProviderButton
            provider={{
              provider: wcProvider,
              info: {
                name: "WalletConnect",
                icon: "data:image/svg+xml,%3Csvg fill='%233B99FC' role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.913 7.519c3.915-3.831 10.26-3.831 14.174 0l.471.461a.483.483 0 0 1 0 .694l-1.611 1.577a.252.252 0 0 1-.354 0l-.649-.634c-2.73-2.673-7.157-2.673-9.887 0l-.694.68a.255.255 0 0 1-.355 0L4.397 8.719a.482.482 0 0 1 0-.693l.516-.507Zm17.506 3.263 1.434 1.404a.483.483 0 0 1 0 .694l-6.466 6.331a.508.508 0 0 1-.709 0l-4.588-4.493a.126.126 0 0 0-.178 0l-4.589 4.493a.508.508 0 0 1-.709 0L.147 12.88a.483.483 0 0 1 0-.694l1.434-1.404a.508.508 0 0 1 .709 0l4.589 4.493c.05.048.129.048.178 0l4.589-4.493a.508.508 0 0 1 .709 0l4.589 4.493c.05.048.128.048.178 0l4.589-4.493a.507.507 0 0 1 .708 0Z'/%3E%3C/svg%3E",
              },
            }}
            handleConnect={handleWalletConnect}
            loading={loading}
          />
        )}
        <ProviderButton
          provider={{
            provider: customProvider || window.ethereum,
            info: { name: "Browser Wallet", icon: customAccount?.connector?.icon },
          }}
          label={
            customAccount?.connector
              ? customAccount.connector.name
              : "window.ethereum"
          }
          handleConnect={handleConnect}
          loading={loading}
        />
      </div>
      <a
        href="https://campnetwork.xyz"
        className={styles["footer-text"]}
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by Camp Network
      </a>
    </div>
  );
};

/**
 * The CampModal component.
 * @param { { injectButton?: boolean, wcProjectId?: string } } props The props.
 * @returns { JSX.Element } The CampModal component.
 */
export const CampModal = ({ injectButton = true, wcProjectId }) => {
  const { authenticated, loading } = useAuthState();
  const { isVisible, setIsVisible } = useContext(ModalContext);
  const { provider } = useProvider();

  const walletConnectProvider = wcProjectId
    ? useWalletConnectProvider(wcProjectId)
    : null;

  const handleModalButton = () => {
    setIsVisible(true);
  };
  useEffect(() => {
    if (authenticated) {
      if (isVisible) {
        setIsVisible(false);
      }
    }
  }, [authenticated]);
  return (
    <div>
      {injectButton && (
        <CampButton
          disabled={!provider.provider}
          onClick={handleModalButton}
          authenticated={authenticated}
        />
      )}
      {isVisible && (
        <div
          className={styles.modal}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsVisible(false);
            }
          }}
        >
          {authenticated ? (
            <MyCampModal wcProvider={walletConnectProvider} />
          ) : (
            <AuthModal
              setIsVisible={setIsVisible}
              wcProvider={walletConnectProvider}
              loading={loading}
            />
          )}
        </div>
      )}
    </div>
  );
};

const ConnectorButton = ({
  name,
  link,
  unlink,
  icon,
  isConnected,
  refetch,
}) => {
  const [isUnlinking, setIsUnlinking] = useState(false);
  const handleClick = () => {
    link();
  };
  const handleDisconnect = async () => {
    setIsUnlinking(true);
    try {
      await unlink();
      await refetch();
      setIsUnlinking(false);
    } catch (error) {
      setIsUnlinking(false);
      console.error(error);
    }
  };
  return (
    <div className={styles["connector-container"]}>
      {isConnected ? (
        <div
          className={styles["connector-connected"]}
          data-connected={isConnected}
        >
          {icon}
          <span>{name}</span>
          {isUnlinking ? (
            <div
              className={styles.loader}
              style={{
                alignSelf: "flex-end",
                position: "absolute",
                right: "0.375rem",
              }}
            />
          ) : (
            <button
              className={styles["unlink-connector-button"]}
              onClick={handleDisconnect}
              disabled={isUnlinking}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 22v-2m-8-5l6-6m-4-3l.463-.536a5 5 0 0 1 7.071 7.072L18 13m-5 5l-.397.534a5.07 5.07 0 0 1-7.127 0a4.97 4.97 0 0 1 0-7.071L6 11m14 6h2M2 7h2m3-5v2"
                />
              </svg>
              Unlink
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={handleClick}
          className={styles["connector-button"]}
          disabled={isConnected}
        >
          {icon}
          <span>{name}</span>
        </button>
      )}
    </div>
  );
};

export const MyCampModal = ({ wcProvider }) => {
  const { auth } = useContext(CampContext);
  const { setIsVisible: setIsVisible } = useContext(ModalContext);
  const { disconnect } = useConnect();
  const { data: socials, loading, refetch } = useSocials();
  const [isLoadingSocials, setIsLoadingSocials] = useState(true);

  const handleDisconnect = () => {
    wcProvider?.disconnect();
    disconnect();
    setIsVisible(false);
  };

  useEffect(() => {
    if (socials) setIsLoadingSocials(false);
  }, [socials]);

  const connectedSocials = [
    {
      name: "Discord",
      link: auth.linkDiscord.bind(auth),
      unlink: auth.unlinkDiscord.bind(auth),
      isConnected: socials?.discord,
      icon: <DiscordIcon />,
    },
    {
      name: "Twitter",
      link: auth.linkTwitter.bind(auth),
      unlink: auth.unlinkTwitter.bind(auth),
      isConnected: socials?.twitter,
      icon: <TwitterIcon />,
    },
    {
      name: "Spotify",
      link: auth.linkSpotify.bind(auth),
      unlink: auth.unlinkSpotify.bind(auth),
      isConnected: socials?.spotify,
      icon: <SpotifyIcon />,
    },
  ];

  const connected = connectedSocials.filter((social) => social.isConnected);
  const notConnected = connectedSocials.filter((social) => !social.isConnected);

  return (
    <div className={styles.container}>
      <div
        className={styles["close-button"]}
        onClick={() => setIsVisible(false)}
      >
        <CloseIcon />
      </div>
      <div className={styles.header}>
        <span>My Camp</span>
        <span className={styles["wallet-address"]}>
          {formatAddress(auth.walletAddress)}
        </span>
      </div>
      <div className={styles["socials-wrapper"]}>
        {loading || isLoadingSocials ? (
          <div
            className={styles.spinner}
            style={{ margin: "auto", marginTop: "6rem", marginBottom: "6rem" }}
          />
        ) : (
          <>
            <div className={styles["socials-container"]}>
              <h3>Not Linked</h3>
              {notConnected.map((social) => (
                <ConnectorButton
                  key={social.name}
                  name={social.name}
                  link={social.link}
                  unlink={social.unlink}
                  isConnected={social.isConnected}
                  refetch={refetch}
                  icon={social.icon}
                />
              ))}
              {notConnected.length === 0 && (
                <span className={styles["no-socials"]}>
                  You've linked all your socials!
                </span>
              )}
            </div>
            <div className={styles["socials-container"]}>
              <h3>Linked</h3>
              {connected.map((social) => (
                <ConnectorButton
                  key={social.name}
                  name={social.name}
                  link={social.link}
                  unlink={social.unlink}
                  isConnected={social.isConnected}
                  refetch={refetch}
                  icon={social.icon}
                />
              ))}
              {connected.length === 0 && (
                <span className={styles["no-socials"]}>
                  You have no socials linked.
                </span>
              )}
            </div>
          </>
        )}
      </div>
      <button
        className={styles["disconnect-button"]}
        onClick={handleDisconnect}
      >
        Disconnect
      </button>
      <a
        href="https://campnetwork.xyz"
        className={styles["footer-text"]}
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginTop: 0 }}
      >
        Powered by Camp Network
      </a>
    </div>
  );
};
