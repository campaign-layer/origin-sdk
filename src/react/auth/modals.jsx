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
const DiscordIcon = () => (
  <svg
    className="w-8 h-8"
    viewBox="0 0 42 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M41.1302 23.4469V24.2363C41.0328 24.2948 41.0717 24.3923 41.062 24.4702C41.0328 24.8991 40.9938 25.3279 40.9645 25.7568C40.9548 25.9322 40.8866 26.0589 40.7306 26.1661C37.7092 28.3396 34.4247 30.0062 30.8672 31.1173C30.6528 31.1856 30.5358 31.1563 30.3994 30.9711C29.6879 29.977 29.0446 28.9439 28.4696 27.862C28.3624 27.6573 28.4111 27.5989 28.6061 27.5209C29.532 27.17 30.4286 26.7509 31.2961 26.2733C31.8419 25.981 31.8224 25.9907 31.3546 25.5911C31.1109 25.3767 30.9062 25.3474 30.5943 25.4936C27.7971 26.7509 24.8634 27.4624 21.7933 27.5989C18.0507 27.7645 14.4542 27.092 11.0235 25.6008C10.5069 25.3767 10.1463 25.3669 9.75645 25.7763C9.59076 25.9517 9.54202 25.9907 9.77594 26.1271C10.7213 26.6534 11.6862 27.131 12.6999 27.5014C12.963 27.5989 12.963 27.6963 12.8461 27.9205C12.2905 28.9634 11.6667 29.9575 10.9942 30.9224C10.8383 31.1466 10.6921 31.1953 10.429 31.1173C6.91049 29.9965 3.65518 28.3591 0.663021 26.2051C0.497331 26.0784 0.419365 25.9615 0.409619 25.747C0.409619 25.4156 0.360879 25.094 0.341386 24.7626C0.156204 21.9752 0.292661 19.2072 0.789729 16.4489C1.66691 11.5952 3.61619 7.18007 6.33545 3.08656C6.43291 2.94037 6.54012 2.8429 6.69607 2.76493C9.25938 1.61485 11.9202 0.805904 14.6784 0.308836C14.8538 0.279597 14.961 0.308829 15.0488 0.484265C15.3217 1.04956 15.6141 1.6051 15.887 2.17039C15.9844 2.37507 16.0624 2.4628 16.3158 2.42381C19.2397 2.01446 22.1734 2.02421 25.0973 2.42381C25.2923 2.45305 25.3702 2.39457 25.4385 2.22889C25.7114 1.65385 26.0038 1.08854 26.2767 0.513503C26.3644 0.32832 26.4813 0.26985 26.686 0.308836C29.4248 0.805904 32.066 1.61486 34.6099 2.74545C34.7853 2.82342 34.912 2.94037 35.0192 3.10606C38.4305 8.18395 40.5454 13.7297 40.9938 19.8699C41.0133 20.1623 40.9548 20.4742 41.101 20.7666V21.4976C41.0035 21.634 41.0328 21.7997 41.0425 21.9459C41.0718 22.4527 40.9645 22.9693 41.101 23.4761L41.1302 23.4469ZM23.8108 17.063C23.8108 18.0961 24.035 18.9148 24.5223 19.6458C25.8868 21.7218 28.5963 21.9069 30.1655 20.0259C31.53 18.3885 31.4618 15.8349 29.9998 14.2755C28.7815 12.9792 26.8225 12.8038 25.419 13.8856C24.3371 14.7238 23.8595 15.8739 23.8206 17.063H23.8108ZM17.5731 17.3748C17.5731 16.6244 17.4756 16.0103 17.2027 15.4353C16.5595 14.1 15.5361 13.2424 14.0059 13.1936C12.4952 13.1449 11.4328 13.9246 10.7408 15.2111C9.88315 16.829 10.1366 18.7881 11.3549 20.1623C12.5829 21.5463 14.6102 21.7315 16.0526 20.5619C17.0955 19.714 17.5438 18.5737 17.5828 17.3748H17.5731Z"
      fill="black"
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
      fill="black"
    />
  </svg>
);

const SpotifyIcon = () => (
  <svg
    className="w-8 h-8"
    viewBox="0 0 42 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <rect
      x="0.740601"
      y="0.64502"
      width="40.8618"
      height="40.8618"
      fill="url(#pattern0_963_39880)"
    />
    <defs>
      <pattern
        id="pattern0_963_39880"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use xlinkHref="#image0_963_39880" transform="scale(0.00444444)" />
      </pattern>
      <image
        id="image0_963_39880"
        width="225"
        height="225"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
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
      stroke="#777777"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 6L18 18"
      stroke="#777777"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
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
 * @param { { injectButton: boolean } } props The props.
 * @returns { JSX.Element } The CampModal component.
 */
export const CampModal = ({ injectButton = true }) => {
  const { authenticated, loading } = useAuthState();
  const { connect } = useConnect();
  const { setProvider } = useProvider();
  const { isAuthVisible, setIsAuthVisible, setIsMyCampVisible } =
    useContext(ModalContext);
  const providers = useProviders();
  const handleConnect = (provider) => {
    if (provider) setProvider(provider);
    connect();
  };

  const handleModalButton = () => {
    if (authenticated) {
      setIsMyCampVisible(true);
    } else {
      setIsAuthVisible(!isAuthVisible);
    }
  };

  useEffect(() => {
    if (authenticated) {
      if (isAuthVisible) {
        setIsAuthVisible(false);
        setIsMyCampVisible(false);
      }
    }
  }, [authenticated]);
  return (
    <div>
      {injectButton && (
        <button
          className={styles["connect-button"]}
          onClick={handleModalButton}
        >
          {authenticated ? "My Camp" : "Connect with Camp"}
        </button>
      )}
      {authenticated ? (
        <MyCampModal />
      ) : (
        isAuthVisible && (
          <div
            className={styles.modal}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsAuthVisible(false);
              }
            }}
          >
            <div className={styles.container}>
              <div
                className={styles["close-button"]}
                onClick={() => setIsAuthVisible(false)}
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
                target="_blank"
              >
                via Camp Network
              </a>
            </div>
          </div>
        )
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
      <button
        onClick={handleClick}
        className={styles["connector-button"]}
        disabled={isConnected}
      >
        {icon}
        <span>{name}</span>
        {isConnected && (
          <svg
            className={styles["connector-checkmark"]}
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10.6798" cy="10" r="10" fill="#29D31A" />
            <path
              d="M4.6272 11.0528L7.78509 14.4738L16.2061 6.5791"
              stroke="white"
              strokeWidth="2.10526"
              strokeLinecap="round"
            />
          </svg>
        )}
      </button>
      {isConnected &&
        (isUnlinking ? (
          <div className={styles.loader} />
        ) : (
          <button
            className={styles["unlink-connector-button"]}
            onClick={handleDisconnect}
            disabled={isUnlinking}
          >
            Unlink
          </button>
        ))}
    </div>
  );
};

export const MyCampModal = () => {
  const { auth } = useContext(CampContext);
  const { isMyCampVisible: isVisible, setIsMyCampVisible: setIsVisible } =
    useContext(ModalContext);
  const { authenticated } = useAuthState();
  const { disconnect } = useConnect();
  const { data: socials, loading, refetch } = useSocials();
  useEffect(() => {
    if (!authenticated) {
      setIsVisible(false);
    }
  }, [authenticated]);
  return (
    isVisible && (
      <div
        className={styles.modal}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsVisible(false);
          }
        }}
      >
        <div className={styles.container}>
          <div
            className={styles["close-button"]}
            onClick={() => setIsVisible(false)}
          >
            <CloseIcon />
          </div>
          <div className={styles.header}>My Camp</div>
          <div>
            {loading ? (
              <div className={styles.spinner} />
            ) : (
              <div className={styles["socials-container"]}>
                <ConnectorButton
                  name="Discord"
                  link={auth.linkDiscord}
                  unlink={auth.unlinkDiscord.bind(auth)}
                  isConnected={socials?.discord}
                  refetch={refetch}
                  icon={<DiscordIcon />}
                />
                <ConnectorButton
                  name="Twitter"
                  link={auth.linkTwitter}
                  unlink={auth.unlinkTwitter.bind(auth)}
                  isConnected={socials?.twitter}
                  refetch={refetch}
                  icon={<TwitterIcon />}
                />
                <ConnectorButton
                  name="Spotify"
                  link={auth.linkSpotify}
                  unlink={auth.unlinkSpotify.bind(auth)}
                  isConnected={socials?.spotify}
                  refetch={refetch}
                  icon={<SpotifyIcon />}
                />
              </div>
            )}
          </div>
          <button className={styles["disconnect-button"]} onClick={disconnect}>
            Disconnect
          </button>
          <a
            href="https://campnetwork.xyz"
            className={styles["footer-text"]}
            target="_blank"
            style={{ marginTop: 0 }}
          >
            via Camp Network
          </a>
        </div>
      </div>
    )
  );
};
