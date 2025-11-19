import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  JSX,
  ReactNode,
} from "react";
import {
  useAuthState,
  useConnect,
  useLinkModal,
  useProvider,
  useProviders,
  useSocials,
} from "./index";
import { ModalContext } from "../context/ModalContext";
import styles from "./styles/auth.module.css";
import { CampContext } from "../context/CampContext";
import { formatAddress, capitalize, formatCampAmount } from "../../utils";
import { useWalletConnectProvider } from "../../core/auth/viem/walletconnect";
import { useAccount, useConnectorClient } from "wagmi";
import { ClientOnly, ReactPortal, getIconByConnectorName } from "../utils";
import {
  CampButton,
  ProviderButton,
  ConnectorButton,
  TabButton,
  GoToOriginDashboard,
  FileUpload,
  Button,
} from "./buttons";
import {
  DiscordIcon,
  TwitterIcon,
  SpotifyIcon,
  CloseIcon,
  CampIcon,
  getIconBySocial,
  TikTokIcon,
  TelegramIcon,
  CopyIcon,
  ArrowCorners,
} from "./icons.js";
import constants from "../../constants.js";
import { useToast } from "../components/toasts.js";
import Tooltip from "../components/Tooltip";
import { formatEther } from "viem";
interface AuthModalProps {
  setIsVisible: (isVisible: boolean) => void;
  wcProvider: any;
  loading: boolean;
  onlyWagmi: boolean;
  defaultProvider: any;
}

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
}: AuthModalProps) => {
  const { connect } = useConnect();
  const { setProvider } = useProvider();
  const { auth, wagmiAvailable, environment } = useContext(CampContext);
  const [customProvider, setCustomProvider] = useState<any>(null);
  const providers = useProviders();
  const [customConnector, setCustomConnector] = useState<any>(null);
  const [customAccount, setCustomAccount] = useState<any>(null);
  let wagmiConnectorClient: ReturnType<typeof useConnectorClient> | undefined;
  let wagmiAccount: ReturnType<typeof useAccount> | undefined;
  if (wagmiAvailable) {
    wagmiConnectorClient = useConnectorClient();
    wagmiAccount = useAccount();
  }
  const { addToast: toast } = useToast();

  if (!auth) {
    throw new Error(
      "Auth instance is not available. Make sure to wrap your component with CampProvider."
    );
  }

  const handleWalletConnect = async ({ provider }: { provider: any }) => {
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
          .then((accounts: string[]) => {
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

  const handleConnect = async (provider: any) => {
    if (provider) {
      let addr = null;
      if (provider?.provider?.uid === customProvider?.uid) {
        addr = customAccount?.address;
      }
      setProvider({
        ...provider,
        address: addr,
      });
      if (addr) {
        auth.setWalletAddress(addr);
      }
    }
    // necessary for appkit, as it doesn't seem to support the "eth_requestAccounts" method
    if (
      customAccount?.address &&
      customProvider?.uid &&
      provider?.provider?.uid === customProvider?.uid
    ) {
      auth.setWalletAddress(customAccount?.address);
    }
    try {
      await connect();
    } catch (error) {
      console.error("Error during connect:", error);
      toast("Error connecting wallet. Please try again.", "error", 5000);
    }
  };
  return (
    <div className={styles["outer-container"]}>
      <div className={`${styles.container} ${styles["linking-container"]}`}>
        <ArrowCorners padding={8} color="#AAA" />
        <div
          className={styles["close-button"]}
          onClick={() => setIsVisible(false)}
        >
          <CloseIcon />
        </div>
        <div className={styles["auth-header"]}>
          <div className={styles["modal-icon"]}>
            <CampIcon />
          </div>
          <span>Connect to Origin</span>
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
                label={formatAddress(customAccount.address, 6)}
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
        <div className={styles["footer-container"]}>
          <a
            href="https://campnetwork.xyz"
            className={styles["footer-text"]}
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by Camp Network
          </a>
        </div>
      </div>
    </div>
  );
};

interface CampModalProps {
  injectButton?: boolean;
  wcProjectId?: string;
  onlyWagmi?: boolean;
  defaultProvider?: any;
}

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
}: CampModalProps) => {
  // const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const { auth, environment } = useContext(CampContext);
  const { authenticated, loading } = useAuthState();
  const { isVisible, setIsVisible, isButtonDisabled, setIsButtonDisabled } =
    useContext(ModalContext);
  const { isLinkingVisible } = useContext(ModalContext);
  const { provider } = useProvider();
  const providers = useProviders();
  const { wagmiAvailable } = useContext(CampContext);
  let customAccount: ReturnType<typeof useAccount> | undefined;
  if (wagmiAvailable) {
    customAccount = useAccount();
  }

  const walletConnectProvider = wcProjectId
    ? useWalletConnectProvider(wcProjectId, environment.CHAIN)
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

  useEffect(() => {
    // handles recovering the provider if it was passed as a defaultProvider or if WalletConnect was used
    // the core module handles the other cases (injected providers) automatically
    const recoverProvider = async () => {
      try {
        if (auth) {
          if (defaultProvider && defaultProvider.provider) {
            const provider = defaultProvider.provider;
            const [address] = await provider.request({
              method: "eth_requestAccounts",
            });
            if (address.toLowerCase() === auth.walletAddress?.toLowerCase()) {
              auth.setProvider({
                ...defaultProvider,
                address,
              });
            } else {
              console.error(
                "Address mismatch. Default provider address does not match authenticated address."
              );
            }
          } else if (
            walletConnectProvider &&
            walletConnectProvider.accounts.length
          ) {
            const [address] = await walletConnectProvider.request({
              method: "eth_requestAccounts",
            });
            if (address.toLowerCase() === auth.walletAddress?.toLowerCase()) {
              auth.setProvider({
                provider: walletConnectProvider,
                info: {
                  name: "WalletConnect",
                },
                address,
              });
            } else {
              console.error(
                "Address mismatch. WalletConnect provider address does not match authenticated address."
              );
            }
          }
        }
      } catch (error) {
        console.error("Error recovering provider:", error);
      }
    };

    if (authenticated) {
      recoverProvider();
    }
  }, [
    authenticated,
    defaultProvider,
    defaultProvider?.provider,
    auth,
    walletConnectProvider,
  ]);

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
  const { addToast: toast } = useToast();

  if (!auth) {
    throw new Error(
      "Auth instance is not available. Make sure to wrap your component with CampProvider."
    );
  }

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
        toast("Error unlinking TikTok account", "error", 5000);
        return;
      }
    } else {
      if (!handleInput) return;
      try {
        await auth.linkTikTok(handleInput);
      } catch (error: Error | any) {
        resetState();
        toast(
          error.message ? error.message : "Error linking TikTok account",
          "error",
          5000
        );
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
      <Button
        // className={styles["linking-button"]}
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
      </Button>
    </div>
  );
};

interface OTPInputProps {
  numInputs: number;
  onChange: (otp: string) => void;
}

/**
 * The OTPInput component. Handles OTP input with customizable number of inputs.
 * @param { { numInputs: number, onChange: function } } props The props.
 * @returns { JSX.Element } The OTPInput component.
 */
const OTPInput = ({ numInputs, onChange }: OTPInputProps) => {
  const [otp, setOtp] = useState(Array(numInputs).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    onChange(newOtp.join(""));
    if (value && index < numInputs - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) =>
    e.target.select();

  return (
    <div className={styles["otp-input-container"]}>
      {otp.map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el!;
          }}
          type="text"
          maxLength={1}
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
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const { addToast: toast } = useToast();

  if (!auth) {
    throw new Error(
      "Auth instance is not available. Make sure to wrap your component with CampProvider."
    );
  }

  const resetState = () => {
    setIsLoading(false);
    setPhoneInput("");
    setOtpInput("");
  };

  const handlePhoneInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneInput(e.target.value);
    setIsPhoneValid(verifyPhoneNumber(e.target.value) || !e.target.value);
  };

  const verifyPhoneNumber = (phone: string) => {
    const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
    return phoneRegex.test(phone.replace(/\s/g, "").replace(/[-()]/g, ""));
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
        toast(
          "Invalid phone number, it should be in the format +1234567890",
          "warning",
          5000
        );
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
                {capitalize(currentlyLinking)} account. <br />
                <span>
                  This will only work if you have 2FA disabled on your Telegram
                  account.
                </span>
                <div>
                  <input
                    value={phoneInput}
                    onChange={handlePhoneInput}
                    type="tel"
                    placeholder="Enter your phone number"
                    className={`${styles["tiktok-input"]} ${
                      !isPhoneValid ? styles["invalid"] : ""
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Button
        // className={styles["linking-button"]}
        onClick={handleAction}
        disabled={
          IsLoading ||
          (!isPhoneValid && !isOTPSent) ||
          (!phoneInput && !isOTPSent) ||
          (isOTPSent && otpInput.length < 5)
        }
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
      </Button>
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

  if (!auth) {
    throw new Error(
      "Auth instance is not available. Make sure to wrap your component with CampProvider."
    );
  }

  const handleLink = async () => {
    if (isSocialsLoading) return;
    if (socials[currentlyLinking]) {
      setIsUnlinking(true);
      try {
        await (auth as any)[`unlink${capitalize(currentlyLinking)}`]();
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
        await (auth as any)[`link${capitalize(currentlyLinking)}`]();
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
      <Button
        // className={styles["linking-button"]}
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
      </Button>
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

  const [flow, setFlow] = useState<"basic" | "tiktok" | "telegram">("basic");

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
      <div className={styles["outer-container"]}>
        <div className={`${styles.container} ${styles["linking-container"]}`}>
          <ArrowCorners padding={8} color="#AAA" />
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
              <div
                className={styles.spinner}
                style={{
                  marginRight: "auto",
                }}
              />
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
          <div className={styles["footer-container"]}>
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
      </div>
    </div>
  );
};

/**
 * The OriginSection component. Displays the Origin status, royalty multiplier, and royalty credits.
 * @returns { JSX.Element } The OriginSection component.
 */
const OriginSection = (): JSX.Element => {
  const { environment } = useContext(CampContext);
  return (
    <div className={styles["origin-wrapper"]}>
      <div className={styles["origin-section"]}>
        <Tooltip
          content={
            environment.NAME === "PRODUCTION"
              ? "You are connected to Camp Mainnet"
              : "You are connected to Camp Testnet"
          }
          position="top"
          containerStyle={{ width: "100%" }}
        >
          <div className={styles["origin-container"]}>
            <span>
              {environment.NAME === "PRODUCTION" ? "Mainnet" : "Testnet"}
            </span>
            <span className={styles["origin-label"]}>Chain</span>
          </div>
        </Tooltip>
        <div className={styles["divider"]} />
        <Tooltip
          content={environment.DATANFT_CONTRACT_ADDRESS}
          position="top"
          containerStyle={{ width: "100%" }}
        >
          <div className={styles["origin-container"]}>
            <span>
              {formatAddress(environment.DATANFT_CONTRACT_ADDRESS, 4)}
            </span>
            <span className={styles["origin-label"]}>IP NFT</span>
          </div>
        </Tooltip>
        <div className={styles["divider"]} />
        <Tooltip
          content={environment.MARKETPLACE_CONTRACT_ADDRESS}
          position="top"
          containerStyle={{ width: "100%" }}
        >
          <div className={styles["origin-container"]}>
            <span>
              {formatAddress(environment.MARKETPLACE_CONTRACT_ADDRESS, 4)}
            </span>
            <span className={styles["origin-label"]}>Marketplace</span>
          </div>
        </Tooltip>
      </div>
    </div>
  );
};

/**
 * The MyCampModal component.
 * @param { { wcProvider: object } } props The props.
 * @returns { JSX.Element } The MyCampModal component.
 */
export const MyCampModal = ({
  wcProvider,
}: {
  wcProvider: any;
}): JSX.Element => {
  const { auth, environment } = useContext(CampContext);
  const { setIsVisible: setIsVisible } = useContext(ModalContext);
  const { disconnect } = useConnect();
  const { socials, isLoading, refetch } = useSocials();
  const [isLoadingSocials, setIsLoadingSocials] = useState(true);
  const { linkTiktok, linkTelegram } = useLinkModal();
  const [activeTab, setActiveTab] = useState<
    "origin" | "socials" | "images" | "audio" | "videos" | "text"
  >("socials");
  const { addToast: toast } = useToast();

  const { provider } = useProvider();

  if (!auth) {
    throw new Error(
      "Auth instance is not available. Make sure to wrap your component with CampProvider."
    );
  }

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
      link: linkTiktok,
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
    <div className={styles["outer-container"]}>
      <div className={styles.container}>
        <ArrowCorners padding={8} color="#AAA" />
        <div
          className={styles["close-button"]}
          onClick={() => setIsVisible(false)}
        >
          <CloseIcon />
        </div>
        <div className={styles.header}>
          <CampIcon customStyles={{ marginRight: "0.5rem" }} />
          {/* <span>My Origin</span> */}
          <span
            className={styles["wallet-address"]}
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  auth.walletAddress as string
                );
                toast("Address copied to clipboard", "success", 3000);
              } catch (error) {
                toast("Failed to copy address", "error", 3000);
              }
            }}
          >
            {formatAddress(auth.walletAddress as string, 6)}
            <CopyIcon w={16} h={16} />
          </span>
        </div>
        <div className={styles["vertical-tabs-container"]}>
          <div className={styles["vertical-tabs"]}>
            <TabButton
              label="Origin"
              isActive={activeTab === "origin"}
              onClick={() => setActiveTab("origin")}
            />
            <TabButton
              label="Socials"
              isActive={activeTab === "socials"}
              onClick={() => setActiveTab("socials")}
            />
            <TabButton
              label="Images"
              isActive={activeTab === "images"}
              onClick={() => setActiveTab("images")}
            />
            <TabButton
              label="Audio"
              isActive={activeTab === "audio"}
              onClick={() => setActiveTab("audio")}
            />
            <TabButton
              label="Videos"
              isActive={activeTab === "videos"}
              onClick={() => setActiveTab("videos")}
            />
            <TabButton
              label="Text"
              isActive={activeTab === "text"}
              onClick={() => setActiveTab("text")}
            />
          </div>
          <div className={styles["vertical-tab-content"]}>
            {activeTab === "origin" && <OriginTab />}
            {activeTab === "socials" && (
              <SocialsTab
                connectedSocials={connected}
                notConnectedSocials={notConnected}
                refetch={refetch}
                isLoading={isLoading}
                isLoadingSocials={isLoadingSocials}
              />
            )}
            {activeTab === "images" && <ImagesTab />}
            {activeTab === "audio" && <AudioTab />}
            {activeTab === "videos" && <VideosTab />}
            {activeTab === "text" && <TextTab />}
            <ArrowCorners padding={8} color="#DDD" />
          </div>
        </div>
        {!provider.provider && (
          <button
            className={styles["no-provider-warning"]}
            onClick={() => auth.recoverProvider()}
            style={{ cursor: "pointer" }}
            type="button"
          >
            Click to try reconnecting your wallet. <br />
            If this doesn't work, please disconnect and connect again.
          </button>
        )}
        {/* <button
          className={styles["disconnect-button"]}
          onClick={handleDisconnect}
        >
          Disconnect
        </button> */}
        <Button onClick={handleDisconnect}>Disconnect</Button>
        <div className={styles["footer-container"]}>
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
    </div>
  );
};

const TabContent = ({
  children,
  className,
  requiresProvider = false,
}: {
  children: ReactNode;
  className?: string;
  requiresProvider?: boolean;
}) => {
  const { provider } = useProvider();
  const isProviderAvailable = provider?.provider;

  return (
    <div className={className} style={{ position: "relative" }}>
      {requiresProvider && !isProviderAvailable && (
        <div className={styles["tab-provider-required-overlay"]}>
          You need to connect your wallet to use this feature.
        </div>
      )}
      {children}
    </div>
  );
};

const OriginTab = () => {
  return (
    <TabContent className={styles["origin-tab"]}>
      <OriginSection />
      <GoToOriginDashboard />
    </TabContent>
  );
};

const SocialsTab = ({
  connectedSocials,
  notConnectedSocials,
  refetch,
  isLoading,
  isLoadingSocials,
}: {
  connectedSocials: any[];
  notConnectedSocials: any[];
  refetch: Function;
  isLoading: boolean;
  isLoadingSocials: boolean;
}) => {
  return (
    <TabContent className={styles["socials-wrapper"]}>
      {isLoading || isLoadingSocials ? (
        <div
          className={styles.spinner}
          style={{
            margin: "auto",
            marginTop: "6rem",
            marginBottom: "6rem",
          }}
        />
      ) : (
        <>
          <div className={styles["socials-container"]}>
            <h3>Not Linked</h3>
            {notConnectedSocials.map((social) => (
              <ConnectorButton
                key={social.name}
                name={social.name}
                link={social.link as Function}
                unlink={social.unlink}
                isConnected={!!social.isConnected}
                refetch={refetch}
                icon={social.icon}
              />
            ))}
            {notConnectedSocials.length === 0 && (
              <span className={styles["no-socials"]}>
                You've linked all your socials!
              </span>
            )}
          </div>
          <div className={styles["socials-container"]}>
            <h3>Linked</h3>
            {connectedSocials.map((social) => (
              <ConnectorButton
                key={social.name}
                name={social.name}
                link={social.link as Function}
                unlink={social.unlink}
                isConnected={!!social.isConnected}
                refetch={refetch}
                icon={social.icon}
              />
            ))}
            {connectedSocials.length === 0 && (
              <span className={styles["no-socials"]}>
                You have no socials linked.
              </span>
            )}
          </div>
        </>
      )}
    </TabContent>
  );
};

const ImagesTab = () => {
  return (
    <TabContent requiresProvider className={styles["ip-tab-container"]}>
      <FileUpload
        accept={constants.SUPPORTED_IMAGE_FORMATS.join(",")}
        maxFileSize={1.049e7} // 10 MB
      />
    </TabContent>
  );
};

const AudioTab = () => {
  return (
    <TabContent requiresProvider className={styles["ip-tab-container"]}>
      <FileUpload
        accept={constants.SUPPORTED_AUDIO_FORMATS.join(",")}
        maxFileSize={1.573e7} // 15 MB
      />
    </TabContent>
  );
};

const VideosTab = () => {
  return (
    <TabContent requiresProvider className={styles["ip-tab-container"]}>
      <FileUpload
        accept={constants.SUPPORTED_VIDEO_FORMATS.join(",")}
        maxFileSize={2.097e7} // 20 MB
      />
    </TabContent>
  );
};

const TextTab = () => {
  return (
    <TabContent requiresProvider className={styles["ip-tab-container"]}>
      <FileUpload
        accept={constants.SUPPORTED_TEXT_FORMATS.join(",")}
        maxFileSize={1.049e7} // 10 MB
      />
    </TabContent>
  );
};
