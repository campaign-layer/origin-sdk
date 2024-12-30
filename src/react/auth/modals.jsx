import React, { useContext, useEffect, useState, useRef } from "react";
import {
  useAuthState,
  useConnect,
  useLinkModal,
  useProvider,
  useProviders,
  useSocials,
} from "./index.jsx";
import { ModalContext } from "../context/ModalContext.jsx";
import styles from "./styles/auth.module.css";
import { CampContext } from "../context/CampContext.jsx";
import { formatAddress, capitalize } from "../../utils.js";
import { useWalletConnectProvider } from "../../auth/viem/walletconnect.js";
import { useAccount, useConnectorClient } from "wagmi";
import { ClientOnly, ReactPortal, getIconByConnectorName } from "../utils.js";
import { CampButton, ProviderButton, ConnectorButton } from "./buttons.jsx";
import {
  DiscordIcon,
  TwitterIcon,
  SpotifyIcon,
  CloseIcon,
  CampIcon,
  getIconBySocial,
  TikTokIcon,
  TelegramIcon,
} from "./icons.jsx";
import constants from "../../constants.js";

/**
 * The Auth modal component.
 * @param { { setIsVisible: function, wcProvider: object, loading: boolean, onlyWagmi: boolean, defaultProvider: object } } props The props.
 * @returns { JSX.Element } The Auth modal component.
 */
const AuthModal = ({
  setIsVisible,
  wcProvider,
  loading,
  onlyWagmi,
  defaultProvider,
}) => {
  const { connect } = useConnect();
  const { setProvider } = useProvider();
  const { auth, wagmiAvailable } = useContext(CampContext);
  const [customProvider, setCustomProvider] = useState(null);
  const providers = useProviders();
  const [customConnector, setCustomConnector] = useState(null);
  const [customAccount, setCustomAccount] = useState(null);
  let wagmiConnectorClient;
  let wagmiAccount;
  if (wagmiAvailable) {
    wagmiConnectorClient = useConnectorClient();
    wagmiAccount = useAccount();
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
    if (wagmiAvailable && !defaultProvider) {
      setCustomConnector(wagmiConnectorClient);
      setCustomAccount(wagmiAccount);
    }
  }, [
    wagmiAvailable,
    defaultProvider,
    wagmiAccount,
    wagmiConnectorClient?.data,
  ]);

  useEffect(() => {
    if (defaultProvider && defaultProvider.provider && defaultProvider.info) {
      let addr = defaultProvider.provider.address;
      const acc = {
        connector: {
          ...defaultProvider.info,
          icon:
            defaultProvider.info.icon ||
            getIconByConnectorName(defaultProvider.info.name),
        },
        address: addr,
      };
      if (!addr) {
        defaultProvider.provider
          .request({
            method: "eth_requestAccounts",
          })
          .then((accounts) => {
            setCustomAccount({
              ...acc,
              address: accounts[0],
            });
          });
      } else {
        setCustomAccount(acc);
      }
      setCustomProvider(defaultProvider.provider);
    }
  }, [defaultProvider]);

  useEffect(() => {
    if (wagmiAvailable && customConnector) {
      const provider = customConnector.data;
      if (provider) {
        setCustomProvider(provider);
      }
    }
  }, [customConnector, customConnector?.data, wagmiAvailable, customProvider]);

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
    // necessary for appkit, as it doesn't seem to support the "eth_requestAccounts" method
    if (
      customAccount?.address &&
      customProvider?.uid &&
      provider?.provider?.uid === customProvider?.uid
    ) {
      auth.setWalletAddress(customAccount?.address);
    }
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
        {/* <img
          className={styles["modal-icon"]}
          src="https://cdn.harbor.gg/project/15/0e836c2dc9302eea702c398012a8e5c114108e32e8e0cbedcd348ce4773f642f.jpg"
          alt="Camp Network"
        /> */}
        <div className={styles["modal-icon"]}>
          <CampIcon />
        </div>
        <span>Connect with Camp</span>
      </div>

      <div
        className={`${customAccount?.connector ? styles["big"] : ""} ${
          styles["provider-list"]
        }`}
      >
        {customAccount?.connector && (
          <>
            <ProviderButton
              provider={{
                provider: customProvider || window.ethereum,
                info: {
                  name: customAccount.connector.name,
                  icon:
                    customAccount.connector.icon ||
                    getIconByConnectorName(customAccount.connector.name),
                },
              }}
              label={formatAddress(customAccount.address)}
              handleConnect={handleConnect}
              loading={loading}
            />
            {(providers.length || wcProvider || window.ethereum) &&
              !onlyWagmi &&
              !defaultProvider?.exclusive && (
                <div className={styles["divider"]} />
              )}
          </>
        )}
        {!onlyWagmi &&
          !defaultProvider?.exclusive &&
          providers.map((provider) => (
            <ProviderButton
              provider={provider}
              handleConnect={handleConnect}
              loading={loading}
              key={provider.info.uuid}
            />
          ))}
        {!onlyWagmi && !defaultProvider?.exclusive && wcProvider && (
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
        {!onlyWagmi && !defaultProvider?.exclusive && window.ethereum && (
          <ProviderButton
            provider={{
              provider: window.ethereum,
              info: {
                name: "Browser Wallet",
              },
            }}
            label="window.ethereum"
            handleConnect={handleConnect}
            loading={loading}
          />
        )}
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
 * @param { { injectButton?: boolean, wcProjectId?: string, onlyWagmi?: boolean, defaultProvider?: object } } props The props.
 * @returns { JSX.Element } The CampModal component.
 */
export const CampModal = ({
  injectButton = true,
  wcProjectId,
  onlyWagmi = false,
  defaultProvider,
}) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { authenticated, loading } = useAuthState();
  const { isVisible, setIsVisible } = useContext(ModalContext);
  const { isLinkingVisible } = useContext(ModalContext);
  const { provider } = useProvider();
  const providers = useProviders();
  const { wagmiAvailable } = useContext(CampContext);
  let customAccount;
  if (wagmiAvailable) {
    customAccount = useAccount();
  }

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

  // Cases where the button should be disabled
  useEffect(() => {
    const noProvider = !provider.provider;
    const noWagmiOrAccount = !wagmiAvailable || !customAccount?.isConnected;
    const noWalletConnectProvider = !walletConnectProvider;
    const noProviders = !providers.length;
    const onlyWagmiNoAccount = onlyWagmi && !customAccount?.isConnected;
    const noDefaultProvider = !defaultProvider || !defaultProvider.provider;
    const defaultProviderExclusive = defaultProvider?.exclusive;

    const noAvailableProviders =
      noProvider &&
      noWagmiOrAccount &&
      noWalletConnectProvider &&
      noProviders &&
      noDefaultProvider;

    const shouldDisableButton =
      (noAvailableProviders ||
        onlyWagmiNoAccount ||
        (noDefaultProvider && defaultProviderExclusive)) &&
      !authenticated;

    setIsButtonDisabled(shouldDisableButton);
  }, [
    provider,
    wagmiAvailable,
    customAccount,
    walletConnectProvider,
    providers,
    authenticated,
    defaultProvider,
  ]);

  return (
    <ClientOnly>
      <div>
        {injectButton && (
          <CampButton
            disabled={isButtonDisabled}
            onClick={handleModalButton}
            authenticated={authenticated}
          />
        )}
        <ReactPortal wrapperId="camp-modal-wrapper">
          {isLinkingVisible && <LinkingModal />}
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
                  onlyWagmi={onlyWagmi}
                  defaultProvider={defaultProvider}
                />
              )}
            </div>
          )}
        </ReactPortal>
      </div>
    </ClientOnly>
  );
};

/**
 * The TikTokFlow component. Handles linking and unlinking of TikTok accounts.
 * @returns { JSX.Element } The TikTokFlow component.
 */
const TikTokFlow = () => {
  const { setIsLinkingVisible, currentlyLinking } = useContext(ModalContext);
  const { socials, refetch, isLoading: isSocialsLoading } = useSocials();
  const { auth } = useContext(CampContext);
  const [IsLoading, setIsLoading] = useState(false);
  const [handleInput, setHandleInput] = useState("");

  const resetState = () => {
    setIsLoading(false);
    setIsLinkingVisible(false);
    setHandleInput("");
  };

  const handleLink = async () => {
    if (isSocialsLoading) return;
    setIsLoading(true);
    if (socials[currentlyLinking]) {
      try {
        await auth.unlinkTikTok();
      } catch (error) {
        resetState();
        console.error(error);
        return;
      }
    } else {
      if (!handleInput) return;
      try {
        await auth.linkTikTok(handleInput);
      } catch (error) {
        resetState();
        console.error(error);
        return;
      }
    }
    refetch();
    resetState();
  };

  return (
    <div>
      <div className={styles["linking-text"]}>
        {currentlyLinking && socials[currentlyLinking] ? (
          <div>
            Your {capitalize(currentlyLinking)} account is currently linked.
          </div>
        ) : (
          <div>
            <b>{window.location.host}</b> is requesting to link your{" "}
            {capitalize(currentlyLinking)} account.
            <div>
              <input
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                type="text"
                placeholder="Enter your TikTok username"
                className={styles["tiktok-input"]}
              />
            </div>
          </div>
        )}
      </div>
      <button
        className={styles["linking-button"]}
        onClick={handleLink}
        disabled={IsLoading}
      >
        {!IsLoading ? (
          currentlyLinking && socials[currentlyLinking] ? (
            "Unlink"
          ) : (
            "Link"
          )
        ) : (
          <div className={styles.spinner} />
        )}
      </button>
    </div>
  );
};

/**
 * The OTPInput component. Handles OTP input with customizable number of inputs.
 * @param { { numInputs: number, onChange: function } } props The props.
 * @returns { JSX.Element } The OTPInput component.
 */
const OTPInput = ({ numInputs, onChange }) => {
  const [otp, setOtp] = useState(Array(numInputs).fill(""));
  const inputRefs = useRef([]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    onChange(newOtp.join(""));
    if (value && index < numInputs - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleFocus = (e) => e.target.select();

  return (
    <div className={styles["otp-input-container"]}>
      {otp.map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          maxLength="1"
          value={otp[index]}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onFocus={handleFocus}
          className={styles["otp-input"]}
        />
      ))}
    </div>
  );
};

/**
 * The TelegramFlow component. Handles linking and unlinking of Telegram accounts.
 * @returns { JSX.Element } The TelegramFlow component.
 */
const TelegramFlow = () => {
  const { setIsLinkingVisible, currentlyLinking } = useContext(ModalContext);
  const { socials, refetch, isLoading: isSocialsLoading } = useSocials();
  const { auth } = useContext(CampContext);
  const [IsLoading, setIsLoading] = useState(false);
  const [phoneInput, setPhoneInput] = useState("");
  const [otpInput, setOtpInput] = useState("");
  const [phoneCodeHash, setPhoneCodeHash] = useState("");
  const [isOTPSent, setIsOTPSent] = useState(false);

  const resetState = () => {
    setIsLoading(false);
    setPhoneInput("");
    setOtpInput("");
  };

  const verifyPhoneNumber = (phone) => {
    const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return phoneRegex.test(phone.replace(/\s/g, "").replace(/-/g, ""));
  };

  const handleAction = async () => {
    if (isSocialsLoading) return;
    if (isOTPSent) {
      if (!otpInput) return;
      setIsLoading(true);
      try {
        await auth.linkTelegram(phoneInput, otpInput, phoneCodeHash);
        refetch();
        resetState();
        setIsLinkingVisible(false);
      } catch (error) {
        resetState();
        console.error(error);
        return;
      }
    } else {
      if (!verifyPhoneNumber(phoneInput)) {
        // TODO: create an alert component
        alert("Invalid phone number.");
        return;
      }
      setIsLoading(true);
      try {
        const res = await auth.sendTelegramOTP(phoneInput);
        setIsOTPSent(true);
        setIsLoading(false);
        setPhoneCodeHash(res.phone_code_hash);
      } catch (error) {
        resetState();
        console.error(error);
        return;
      }
    }
  };

  return (
    <div>
      <div className={styles["linking-text"]}>
        {currentlyLinking && socials[currentlyLinking] ? (
          <div>
            Your {capitalize(currentlyLinking)} account is currently linked.
          </div>
        ) : (
          <div>
            {isOTPSent ? (
              <div>
                <span>Enter the OTP sent to your phone number.</span>
                <div>
                  <OTPInput numInputs={5} onChange={setOtpInput} />
                </div>
              </div>
            ) : (
              <div>
                <b>{window.location.host}</b> is requesting to link your{" "}
                {capitalize(currentlyLinking)} account. <br/>
                <span>This will only work if you have 2FA disabled on your Telegram account.</span>
                <div>
                  <input
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    type="tel"
                    placeholder="Enter your phone number"
                    className={styles["tiktok-input"]}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <button
        className={styles["linking-button"]}
        onClick={handleAction}
        disabled={IsLoading}
      >
        {!IsLoading ? (
          currentlyLinking && socials[currentlyLinking] ? (
            "Unlink"
          ) : isOTPSent ? (
            "Link"
          ) : (
            "Send OTP"
          )
        ) : (
          <div className={styles.spinner} />
        )}
      </button>
    </div>
  );
};

/**
 * The BasicFlow component. Handles linking and unlinking of socials through redirecting to the appropriate OAuth flow.
 * @returns { JSX.Element } The BasicFlow component.
 */
const BasicFlow = () => {
  const { setIsLinkingVisible, currentlyLinking } = useContext(ModalContext);
  const { socials, refetch, isLoading: isSocialsLoading } = useSocials();
  const { auth } = useContext(CampContext);
  const [isUnlinking, setIsUnlinking] = useState(false);

  const handleLink = async () => {
    if (isSocialsLoading) return;
    if (socials[currentlyLinking]) {
      setIsUnlinking(true);
      try {
        await auth[`unlink${capitalize(currentlyLinking)}`]();
      } catch (error) {
        setIsUnlinking(false);
        setIsLinkingVisible(false);
        console.error(error);
        return;
      }
      refetch();
      setIsLinkingVisible(false);
      setIsUnlinking(false);
    } else {
      try {
        auth[`link${capitalize(currentlyLinking)}`]();
      } catch (error) {
        setIsLinkingVisible(false);
        console.error(error);
        return;
      }
    }
  };

  return (
    <div>
      <div className={styles["linking-text"]}>
        {currentlyLinking && socials[currentlyLinking] ? (
          <div>
            Your {capitalize(currentlyLinking)} account is currently linked.
          </div>
        ) : (
          <div>
            <b>{window.location.host}</b> is requesting to link your{" "}
            {capitalize(currentlyLinking)} account.
          </div>
        )}
      </div>
      <button
        className={styles["linking-button"]}
        onClick={handleLink}
        disabled={isUnlinking}
      >
        {!isUnlinking ? (
          currentlyLinking && socials[currentlyLinking] ? (
            "Unlink"
          ) : (
            "Link"
          )
        ) : (
          <div className={styles.spinner} />
        )}
      </button>
    </div>
  );
};

/**
 * The LinkingModal component. Handles the linking and unlinking of socials.
 * @returns { JSX.Element } The LinkingModal component.
 */
const LinkingModal = () => {
  const { isLoading: isSocialsLoading } = useSocials();
  const { setIsLinkingVisible, currentlyLinking } = useContext(ModalContext);

  const [flow, setFlow] = useState(null);

  useEffect(() => {
    if (["twitter", "discord", "spotify"].includes(currentlyLinking)) {
      setFlow("basic");
    } else if (currentlyLinking === "tiktok") {
      setFlow("tiktok");
    } else if (currentlyLinking === "telegram") {
      setFlow("telegram");
    }
  }, [currentlyLinking]);

  const Icon = getIconBySocial(currentlyLinking);

  return (
    <div
      className={styles.modal}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsLinkingVisible(false);
        }
      }}
      style={{
        zIndex: 86,
      }}
    >
      <div className={styles.container}>
        <div
          className={styles["close-button"]}
          onClick={() => setIsLinkingVisible(false)}
        >
          <CloseIcon />
        </div>
        {isSocialsLoading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "4rem",
              marginBottom: "1rem",
            }}
          >
            <div className={styles.spinner} />
          </div>
        ) : (
          <div>
            <div className={styles.header}>
              <div className={styles["small-modal-icon"]}>
                <Icon />
              </div>
            </div>
            {flow === "basic" && <BasicFlow />}
            {flow === "tiktok" && <TikTokFlow />}
            {flow === "telegram" && <TelegramFlow />}
          </div>
        )}
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
    </div>
  );
};

/**
 * The MyCampModal component.
 * @param { { wcProvider: object } } props The props.
 * @returns { JSX.Element } The MyCampModal component.
 */
export const MyCampModal = ({ wcProvider }) => {
  const { auth } = useContext(CampContext);
  const { setIsVisible: setIsVisible } = useContext(ModalContext);
  const { disconnect } = useConnect();
  const { socials, loading, refetch } = useSocials();
  const [isLoadingSocials, setIsLoadingSocials] = useState(true);
  const { linkTikTok, linkTelegram } = useLinkModal();

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
    {
      name: "TikTok",
      link: linkTikTok,
      unlink: auth.unlinkTikTok.bind(auth),
      isConnected: socials?.tiktok,
      icon: <TikTokIcon />,
    },
    {
      name: "Telegram",
      link: linkTelegram,
      unlink: auth.unlinkTelegram.bind(auth),
      isConnected: socials?.telegram,
      icon: <TelegramIcon />,
    },
  ].filter((social) =>
    constants.AVAILABLE_SOCIALS.includes(social.name.toLowerCase())
  );

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
