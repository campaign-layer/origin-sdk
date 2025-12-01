import { parseEther, zeroAddress } from "viem";
import constants from "../../constants";
import { createLicenseTerms } from "../../core/origin/utils";
import { useToast } from "../components/toasts";
import {
  BinIcon,
  CampIcon,
  CornerSquare,
  CornerSVG,
  getIconBySocial,
  LinkIcon,
  SquareCorners,
} from "./icons";
import {
  ModalContext,
  useAuth,
  useAuthState,
  useLinkModal,
  useModal,
  useSocials,
} from "./index";
import styles from "./styles/auth.module.css";
import buttonStyles from "./styles/buttons.module.css";
import React, { JSX, useContext, useEffect, useState, useRef } from "react";
import {
  toSeconds,
  validateDuration,
  validatePrice,
  validateRoyaltyBps,
} from "../../utils";
import Tooltip from "../components/Tooltip";

interface CampButtonProps {
  onClick: () => void;
  authenticated: boolean;
  disabled?: boolean;
}

/**
 * The injected CampButton component.
 * @param { { onClick: function, authenticated: boolean } } props The props.
 * @returns { JSX.Element } The CampButton component.
 */
export const CampButton = ({
  onClick,
  authenticated,
  disabled,
}: CampButtonProps) => {
  return (
    <button
      className={buttonStyles["connect-button"]}
      onClick={onClick}
      disabled={disabled}
    >
      <SquareCorners />
      <div className={buttonStyles["button-icon"]}>
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
      {authenticated ? "My Origin" : "Connect"}
    </button>
  );
};

/**
 * The GoToOriginDashboard component. Handles the action of going to the Origin Dashboard.
 * @param { { text?: string } } props The props.
 * @param { string } [props.text] The text to display on the button.
 * @param { string } [props.text="Origin Dashboard"] The default text to display on the button.
 * @returns { JSX.Element } The GoToOriginDashboard component.
 */
export const GoToOriginDashboard = ({
  text = "Origin Dashboard",
}: {
  text?: string;
}): JSX.Element => (
  <a
    className={styles["origin-dashboard-button"]}
    href={constants.ORIGIN_DASHBOARD}
    target="_blank"
    rel="noopener noreferrer"
  >
    {text} <LinkIcon w="0.875rem" />
  </a>
);

/**
 * The TabButton component.
 * @param { { label: string, isActive: boolean, onClick: function } } props The props.
 * @returns { JSX.Element } The TabButton component.
 */
export const TabButton = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      className={`${styles["tab-button"]} ${
        isActive ? styles["active-tab"] : ""
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export const StandaloneCampButton = () => {
  const modalContext = useContext(ModalContext);
  const { openModal } = useModal();
  const { authenticated } = useAuthState();

  if (!modalContext) {
    console.error("CampButton must be used within a ModalProvider");
    return null;
  }

  const { isButtonDisabled } = modalContext;

  return (
    <CampButton
      onClick={openModal}
      authenticated={authenticated}
      disabled={isButtonDisabled}
    />
  );
};

interface ProviderButtonProps {
  provider: { provider: string; info: Record<string, string> };
  handleConnect: (provider: any) => void;
  loading?: boolean;
  label?: string;
}

/**
 * The ProviderButton component.
 * @param { { provider: { provider: string, info: { name: string, icon: string } }, handleConnect: function, loading: boolean, label: string } } props The props.
 * @returns { JSX.Element } The ProviderButton component.
 */
export const ProviderButton = ({
  provider,
  handleConnect,
  loading,
  label,
}: ProviderButtonProps) => {
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
      className={buttonStyles["provider-button"]}
      onClick={handleClick}
      disabled={loading}
    >
      <SquareCorners color="#ddd" />
      <img
        src={
          provider.info.icon ||
          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='%23777777' d='M21 7.28V5c0-1.1-.9-2-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-2.28A2 2 0 0 0 22 15V9a2 2 0 0 0-1-1.72M20 9v6h-7V9zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2z'/%3E%3Ccircle cx='16' cy='12' r='1.5' fill='%23777777'/%3E%3C/svg%3E"
        }
        className={buttonStyles["provider-icon"]}
        alt={provider.info.name}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <span className={buttonStyles["provider-name"]}>
          {provider.info.name}
        </span>
        {label && (
          <span className={buttonStyles["provider-label"]}>({label})</span>
        )}
      </div>
      {isButtonLoading && <div className={styles.spinner} />}
    </button>
  );
};

interface ConnectorButtonProps {
  name: string;
  link: Function;
  unlink: () => Promise<void>;
  icon: JSX.Element;
  isConnected: boolean;
  refetch: Function;
}

export const ConnectorButton = ({
  name,
  link,
  unlink,
  icon,
  isConnected,
  refetch,
}: ConnectorButtonProps) => {
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
          <SquareCorners color="#ddd" />
          <span>{name}</span>
        </button>
      )}
    </div>
  );
};

interface IconButtonProps {
  icon: JSX.Element;
  onClick: () => void;
}

const IconButton = ({ icon, onClick }: IconButtonProps) => {
  return (
    <button className={buttonStyles["icon-button"]} onClick={onClick}>
      {icon}
    </button>
  );
};

interface LinkButtonProps {
  variant?: "default" | "icon";
  social: "twitter" | "spotify" | "discord" | "tiktok" | "telegram";
  theme?: "default" | "camp";
}

/**
 * The LinkButton component.
 * A button that will open the modal to link or unlink a social account.
 * @param { { variant: ("default"|"icon"), social: ("twitter"|"spotify"|"discord"), theme: ("default"|"camp") } } props The props.
 * @returns { JSX.Element } The LinkButton component.
 */
export const LinkButton = ({
  variant = "default",
  social,
  theme = "default",
}: LinkButtonProps) => {
  const { handleOpen } = useLinkModal();
  if (["default", "icon"].indexOf(variant) === -1) {
    throw new Error("Invalid variant, must be 'default' or 'icon'");
  }

  if (constants.AVAILABLE_SOCIALS.indexOf(social) === -1) {
    console.error(
      `Invalid LinkButton social, must be one of ${constants.AVAILABLE_SOCIALS.join(
        ", "
      )}`
    );
    return null;
  }

  if (["default", "camp"].indexOf(theme) === -1) {
    throw new Error("Invalid theme, must be 'default' or 'camp'");
  }

  const { socials } = useSocials();
  const { authenticated } = useAuthState();
  const isLinked = socials && socials[social];
  const handleClick = () => {
    handleOpen(social);
  };
  const Icon = getIconBySocial(social);
  return (
    <button
      disabled={!authenticated}
      className={`${buttonStyles[`link-button-${variant}`]} 
        ${theme === "default" ? buttonStyles[social] : ""}
      `}
      onClick={handleClick}
    >
      {variant === "icon" ? (
        <div className={buttonStyles["icon-container"]}>
          <SquareCorners color="#ffffffaa" />
          <Icon />
          <div
            className={`${buttonStyles["camp-logo"]} ${
              !isLinked ? buttonStyles["not-linked"] : ""
            }`}
          >
            <CampIcon />
          </div>
        </div>
      ) : (
        <div className={buttonStyles["button-container"]}>
          <SquareCorners color="#ffffffaa" />
          <div
            className={`${buttonStyles["camp-logo"]} ${
              !isLinked ? buttonStyles["not-linked"] : ""
            }`}
          >
            <CampIcon />
          </div>
          <div className={buttonStyles["link-icon"]}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
              />
            </svg>
          </div>
          <div className={buttonStyles["social-icon"]}>
            <Icon />
          </div>
        </div>
      )}
    </button>
  );
};

interface FileUploadProps {
  onFileUpload?: (files: File[]) => void;
  accept?: string;
  maxFileSize?: number; // in bytes
}

interface LoadingBarProps {
  progress: number;
  style?: React.CSSProperties;
}

/**
 * LoadingBar component to display upload progress.
 * @param { { progress: number } } props The props.
 * @returns { JSX.Element } The LoadingBar component.
 */
const LoadingBar = ({ progress, style }: LoadingBarProps): JSX.Element => {
  return (
    <div className={buttonStyles["loading-bar-container"]} style={style}>
      <div
        className={buttonStyles["loading-bar"]}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

interface PercentageSliderProps {
  onChange: (value: number) => void;
}

export const PercentageSlider: React.FC<PercentageSliderProps> = ({
  onChange,
}) => {
  const [value, setValue] = useState(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setValue(val);
    onChange(val);
  };

  return (
    <div className={buttonStyles["percentage-slider"]}>
      {/* <label htmlFor="slider">Royalty:</label> */}
      <input
        id="slider"
        type="range"
        min="1"
        max="100"
        value={value}
        onChange={handleChange}
      />
      <label htmlFor="slider">{value}%</label>
    </div>
  );
};

interface DeadlinePickerProps {
  onChange: (unixTimestamp: number) => void;
}

export const DatePicker: React.FC<DeadlinePickerProps> = ({ onChange }) => {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = e.target.value;
    setValue(dateStr);

    const timestamp = Math.floor(new Date(dateStr).getTime() / 1000);
    if (!isNaN(timestamp)) {
      onChange(timestamp);
    }
  };

  return (
    <div className={buttonStyles["date-picker"]}>
      {/* <label htmlFor="date">License expiry:</label> */}
      <input
        id="date"
        type="datetime-local"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
};

export const FancyInput = ({
  value,
  onChange,
  step,
  placeholder,
  type = "text",
  icon,
  label,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step?: number;
  placeholder?: string;
  type?: string;
  icon?: JSX.Element;
  label?: string;
}) => {
  return (
    <>
      {label && (
        <span className={buttonStyles["fancy-input-label"]}>{label}</span>
      )}
      <div
        className={buttonStyles["fancy-input-container"]}
        style={type === "textarea" ? { minHeight: "5rem" } : {}}
      >
        {type === "textarea" ? (
          <textarea
            value={value}
            onChange={onChange as any}
            placeholder={placeholder}
            className={buttonStyles["fancy-input"]}
            rows={3}
          />
        ) : (
          <input
            type={type}
            value={value}
            step={step}
            min={0}
            onChange={onChange}
            placeholder={placeholder}
            className={buttonStyles["fancy-input"]}
          />
        )}
        {icon && (
          <>
            <div className={buttonStyles["input-divider"]} />
            <div className={buttonStyles["input-icon-container"]}>{icon}</div>
          </>
        )}
      </div>
    </>
  );
};

/**
 * The FileUpload component.
 * Provides a file upload field with drag-and-drop support.
 * @param { { onFileUpload?: function, accept?: string, maxFileSize?: number } } props The props.
 * @returns { JSX.Element } The FileUpload component.
 */
export const FileUpload = ({
  onFileUpload,
  accept,
  maxFileSize,
}: FileUploadProps): JSX.Element => {
  const auth = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewImageInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();
  const [price, setPrice] = useState<string>("");
  const [royaltyBps, setRoyaltyBps] = useState<string>("2.5"); // in percentage
  const [licenseDuration, setLicenseDuration] = useState<number>(24);
  const [durationUnit, setDurationUnit] = useState<string>("hours");
  const [isValidInput, setIsValidInput] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [useBaseAssetAsPreview, setUseBaseAssetAsPreview] =
    useState<boolean>(false);

  const isAllImagesAccepted = accept
    ? accept.split(",").every((type) => type.trim().startsWith("image/"))
    : false;

  const validateInputs = () => {
    const isDurationValid = validateDuration(licenseDuration, durationUnit);
    let isPriceValid = validatePrice(price);
    const isRoyaltyValid = validateRoyaltyBps(royaltyBps);

    setIsValidInput(isDurationValid && isPriceValid && isRoyaltyValid);
  };

  useEffect(() => {
    validateInputs();
  }, [price, licenseDuration, durationUnit, royaltyBps]);

  useEffect(() => {
    // use base asset as preview is checked, clear custom preview image
    if (useBaseAssetAsPreview) {
      setPreviewImage(null);
      if (previewImageInputRef.current) {
        previewImageInputRef.current.value = "";
      }
    }
  }, [useBaseAssetAsPreview]);

  const handleUpload = async () => {
    if (selectedFile) {
      setIsUploading(true);
      try {
        const durationInSeconds = toSeconds(licenseDuration, durationUnit);
        const priceInWei = parseEther(price || "0");
        const computedRoyaltyBps = Math.floor(parseFloat(royaltyBps) * 100); // percentage to basis points

        const license = createLicenseTerms(
          priceInWei,
          durationInSeconds,
          computedRoyaltyBps,
          zeroAddress
        );
        const metadata = {
          name: selectedFile.name,
          description: `File uploaded by ${auth?.walletAddress} via the Origin SDK`,
        };
        const res = await auth?.origin?.mintFile(
          selectedFile,
          metadata,
          license,
          [],
          {
            progressCallback(percent: number) {
              setUploadProgress(percent);
            },
            previewImage: previewImage,
            useAssetAsPreview: useBaseAssetAsPreview,
          }
        );
        if (onFileUpload) {
          onFileUpload([selectedFile]);
        }
        addToast(`File minted successfully. Token ID: ${res}`, "success", 5000);
      } catch (error: Error | any) {
        if (error.toString().includes("User rejected")) {
          addToast("User rejected the transaction", "error", 5000);
        } else {
          addToast(`Error minting file: ${error.message}`, "error", 5000);
        }
        setIsUploading(false);
      } finally {
        setSelectedFile(null);
        setIsUploading(false);
        setUploadProgress(0);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (selectedFile && selectedFile.type.startsWith("image/")) {
        URL.revokeObjectURL(URL.createObjectURL(selectedFile));
      }
    };
  }, [selectedFile]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);

    if (accept) {
      const acceptedTypes = accept.split(",");
      const invalidFiles = files.filter(
        (file) => !acceptedTypes.some((type) => file.type.match(type.trim()))
      );

      if (invalidFiles.length > 0) {
        addToast(
          `File not supported. Accepted types: ${accept}`,
          "error",
          5000
        );
        return;
      }
    }

    const file = files[0];

    if (maxFileSize && file.size > maxFileSize) {
      addToast(
        `File size exceeds the limit of ${(
          maxFileSize /
          1024 /
          1024
        ).toPrecision(2)} MB`,
        "error",
        5000
      );
      return;
    }

    setSelectedFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const file = files[0];

      if (maxFileSize && file.size > maxFileSize) {
        addToast(
          `File size exceeds the limit of ${(
            maxFileSize /
            1024 /
            1024
          ).toPrecision(2)} MB`,
          "error",
          5000
        );
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    fileInputRef.current!.value = "";
    setPreviewImage(null);
    if (previewImageInputRef.current) {
      previewImageInputRef.current.value = "";
    }
    setUseBaseAssetAsPreview(false);
  };

  const handlePreviewImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const file = files[0];

      if (!file.type.startsWith("image/")) {
        addToast("Preview must be an image file", "error", 5000);
        return;
      }

      if (maxFileSize && file.size > maxFileSize) {
        addToast(
          `File size exceeds the limit of ${(
            maxFileSize /
            1024 /
            1024
          ).toPrecision(2)} MB`,
          "error",
          5000
        );
        return;
      }

      setPreviewImage(file);
    }
  };

  const handleRemovePreviewImage = () => {
    setPreviewImage(null);
    if (previewImageInputRef.current) {
      previewImageInputRef.current.value = "";
    }
  };

  const renderFilePreview = () => {
    if (!selectedFile) return null;

    if (selectedFile.type.startsWith("image/")) {
      return (
        <img
          src={URL.createObjectURL(selectedFile)}
          alt="Preview"
          className={buttonStyles["file-preview"]}
        />
      );
    }

    if (selectedFile.type.startsWith("audio/")) {
      return (
        <audio
          controls
          src={URL.createObjectURL(selectedFile)}
          className={buttonStyles["file-preview"]}
        />
      );
    }

    if (selectedFile.type.startsWith("video/")) {
      return (
        <video
          controls
          src={URL.createObjectURL(selectedFile)}
          className={buttonStyles["file-preview"]}
        />
      );
    }

    if (selectedFile.type.startsWith("text/")) {
      return (
        <iframe
          src={URL.createObjectURL(selectedFile)}
          className={buttonStyles["file-preview"]}
          title="File Preview"
        ></iframe>
      );
    }

    return (
      <p className={buttonStyles["file-preview-text"]}>
        File selected: {selectedFile.name}
      </p>
    );
  };

  return (
    <div
      className={`${buttonStyles["file-upload-container"]} ${
        isDragging
          ? buttonStyles["dragging"]
          : selectedFile
          ? buttonStyles["file-selected"]
          : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={!selectedFile ? handleClick : undefined}
    >
      <input
        type="file"
        accept={accept}
        className={buttonStyles["file-input"]}
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      {selectedFile ? (
        <div className={buttonStyles["selected-file-container"]}>
          {renderFilePreview()}
          <span className={buttonStyles["file-name"]}>{selectedFile.name}</span>
          {/* price */}
          <FancyInput
            type="number"
            step={0.0001}
            placeholder="$CAMP"
            value={price}
            label="Price in $CAMP"
            onChange={(e) => {
              const value = e.target.value;
              setPrice(value);
            }}
            icon={<CampIcon />}
          />
          {/* duration */}
          <span className={buttonStyles["fancy-input-label"]}>
            License Duration
          </span>
          <div className={buttonStyles["duration-input-container"]}>
            <input
              type="number"
              placeholder="Duration"
              className={buttonStyles["duration-input"]}
              value={licenseDuration > 0 ? licenseDuration.toString() : ""}
              onChange={(e) => {
                const value = e.target.value;
                setLicenseDuration(value ? Number(value) : 0);
              }}
            />
            <select
              className={buttonStyles["duration-unit-select"]}
              value={durationUnit}
              onChange={(e) => {
                setDurationUnit(e.target.value);
              }}
            >
              <option value="hours">Hours</option>
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
            </select>
          </div>
          {/* royalty */}
          <FancyInput
            type="number"
            step={0.1}
            placeholder="Royalty %"
            label="Royalty %"
            value={royaltyBps.toString()}
            onChange={(e) => {
              const value = e.target.value;
              setRoyaltyBps(value);
            }}
            icon={<span className={buttonStyles["percentage-icon"]}>%</span>}
          />

          {/* Preview Image Section */}
          {isAllImagesAccepted && selectedFile?.type.startsWith("image/") && (
            <div className={buttonStyles["preview-option-container"]}>
              <label className={buttonStyles["checkbox-label"]}>
                <input
                  type="checkbox"
                  checked={useBaseAssetAsPreview}
                  onChange={(e) => setUseBaseAssetAsPreview(e.target.checked)}
                  className={buttonStyles["checkbox-input"]}
                />
                <span>Use base asset as preview</span>
              </label>
            </div>
          )}

          <div className={buttonStyles["preview-image-section"]}>
            <span className={buttonStyles["fancy-input-label"]}>
              Preview Image (optional)
            </span>
            <input
              type="file"
              accept="image/*"
              ref={previewImageInputRef}
              onChange={handlePreviewImageChange}
              disabled={useBaseAssetAsPreview}
              className={buttonStyles["file-input"]}
              style={{ display: "none" }}
            />
            <div className={buttonStyles["preview-image-controls"]}>
              {previewImage ? (
                <div className={buttonStyles["preview-image-preview"]}>
                  <img
                    src={URL.createObjectURL(previewImage)}
                    alt="Preview"
                    className={buttonStyles["preview-thumbnail"]}
                  />
                  <span className={buttonStyles["preview-filename"]}>
                    {previewImage.name}
                  </span>
                  <button
                    type="button"
                    className={buttonStyles["remove-preview-button"]}
                    onClick={handleRemovePreviewImage}
                    disabled={useBaseAssetAsPreview}
                  >
                    <BinIcon w="1rem" h="1rem" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className={buttonStyles["select-preview-button"]}
                  onClick={() => previewImageInputRef.current?.click()}
                  disabled={useBaseAssetAsPreview}
                >
                  Select Preview Image
                </button>
              )}
            </div>
          </div>

          {isUploading && (
            <LoadingBar
              progress={uploadProgress}
              style={{ marginTop: "16px" }}
            />
          )}
          <div className={buttonStyles["upload-buttons"]}>
            <button
              className={buttonStyles["remove-file-button"]}
              disabled={isUploading}
              onClick={handleRemoveFile}
            >
              <BinIcon w="1.25rem" h="1.25rem" />
            </button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading || !isValidInput}
            >
              Mint
            </Button>
          </div>
        </div>
      ) : (
        <p>
          Drag and drop your file here, or click to select a file.
          <br />
          {accept && (
            <span className={buttonStyles["accepted-types"]}>
              {accept
                .split(",")
                .map((type) => type.trim().split("/")[1].replace(/-/g, " "))
                .join(", ")
                .replace("plain", "txt")
                .replace(/, ([^,]*)$/, ", or $1")}
            </span>
          )}
          <br />
          {maxFileSize && (
            <span className={buttonStyles["accepted-types"]}>
              Max size: {(maxFileSize / 1024 / 1024).toPrecision(2)} MB
            </span>
          )}
        </p>
      )}
    </div>
  );
};

export const Button = ({
  children,
  onClick,
  disabled,
  className,
  style,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <button
      className={`${buttonStyles["button"]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      <CornerSquare position="top-left" padding={4} />
      <CornerSquare position="top-right" padding={4} />
      <CornerSquare position="bottom-left" padding={4} />
      <CornerSquare position="bottom-right" padding={4} />
      {children}
    </button>
  );
};
