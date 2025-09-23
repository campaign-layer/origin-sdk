import React from "react";
import styles from "./styles/auth.module.css";

type Social = "twitter" | "spotify" | "discord" | "tiktok" | "telegram";

export const getIconBySocial = (social: Social) => {
  switch (social) {
    case "twitter":
      return TwitterIcon;
    case "spotify":
      return SpotifyIcon;
    case "discord":
      return DiscordIcon;
    case "tiktok":
      return TikTokIcon;
    case "telegram":
      return TelegramIcon;
    default:
      return () => <></>;
  }
};

export const CheckMarkIcon = ({ w, h }: { w?: any; h?: any }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={w || "1rem"}
    height={h || "1rem"}
  >
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export const XMarkIcon = ({ w, h }: { w?: any; h?: any }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={w || "1rem"}
    height={h || "1rem"}
  >
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </svg>
);

export const LinkIcon = ({ w, h }: { w?: any; h?: any }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={w || "1rem"}
    height={h || "1rem"}
  >
    <path d="M14 4h-13v18h20v-11h1v12h-22v-20h14v1zm10 5h-1v-6.293l-11.646 11.647-.708-.708 11.647-11.646h-6.293v-1h8v8z" />
  </svg>
);

export const BinIcon = ({ w, h }: { w?: any; h?: any }) => (
  <svg
    clipRule="evenodd"
    fillRule="evenodd"
    strokeLinejoin="round"
    strokeMiterlimit="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    width={w || "1rem"}
    height={h || "1rem"}
  >
    <path
      d="m4.015 5.494h-.253c-.413 0-.747-.335-.747-.747s.334-.747.747-.747h5.253v-1c0-.535.474-1 1-1h4c.526 0 1 .465 1 1v1h5.254c.412 0 .746.335.746.747s-.334.747-.746.747h-.254v15.435c0 .591-.448 1.071-1 1.071-2.873 0-11.127 0-14 0-.552 0-1-.48-1-1.071zm14.5 0h-13v15.006h13zm-4.25 2.506c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75s.75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75zm-4.5 0c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75s.75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75zm3.75-4v-.5h-3v.5z"
      fillRule="nonzero"
    />
  </svg>
);

export const CampIcon = ({ customStyles }: { customStyles?: any }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 571.95 611.12"
    height="1rem"
    width="1rem"
    fill="currentColor"
    style={customStyles}
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
);
export const DiscordIcon = () => (
  <svg viewBox="0 0 42 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M41.1302 23.4469V24.2363C41.0328 24.2948 41.0717 24.3923 41.062 24.4702C41.0328 24.8991 40.9938 25.3279 40.9645 25.7568C40.9548 25.9322 40.8866 26.0589 40.7306 26.1661C37.7092 28.3396 34.4247 30.0062 30.8672 31.1173C30.6528 31.1856 30.5358 31.1563 30.3994 30.9711C29.6879 29.977 29.0446 28.9439 28.4696 27.862C28.3624 27.6573 28.4111 27.5989 28.6061 27.5209C29.532 27.17 30.4286 26.7509 31.2961 26.2733C31.8419 25.981 31.8224 25.9907 31.3546 25.5911C31.1109 25.3767 30.9062 25.3474 30.5943 25.4936C27.7971 26.7509 24.8634 27.4624 21.7933 27.5989C18.0507 27.7645 14.4542 27.092 11.0235 25.6008C10.5069 25.3767 10.1463 25.3669 9.75645 25.7763C9.59076 25.9517 9.54202 25.9907 9.77594 26.1271C10.7213 26.6534 11.6862 27.131 12.6999 27.5014C12.963 27.5989 12.963 27.6963 12.8461 27.9205C12.2905 28.9634 11.6667 29.9575 10.9942 30.9224C10.8383 31.1466 10.6921 31.1953 10.429 31.1173C6.91049 29.9965 3.65518 28.3591 0.663021 26.2051C0.497331 26.0784 0.419365 25.9615 0.409619 25.747C0.409619 25.4156 0.360879 25.094 0.341386 24.7626C0.156204 21.9752 0.292661 19.2072 0.789729 16.4489C1.66691 11.5952 3.61619 7.18007 6.33545 3.08656C6.43291 2.94037 6.54012 2.8429 6.69607 2.76493C9.25938 1.61485 11.9202 0.805904 14.6784 0.308836C14.8538 0.279597 14.961 0.308829 15.0488 0.484265C15.3217 1.04956 15.6141 1.6051 15.887 2.17039C15.9844 2.37507 16.0624 2.4628 16.3158 2.42381C19.2397 2.01446 22.1734 2.02421 25.0973 2.42381C25.2923 2.45305 25.3702 2.39457 25.4385 2.22889C25.7114 1.65385 26.0038 1.08854 26.2767 0.513503C26.3644 0.32832 26.4813 0.26985 26.686 0.308836C29.4248 0.805904 32.066 1.61486 34.6099 2.74545C34.7853 2.82342 34.912 2.94037 35.0192 3.10606C38.4305 8.18395 40.5454 13.7297 40.9938 19.8699C41.0133 20.1623 40.9548 20.4742 41.101 20.7666V21.4976C41.0035 21.634 41.0328 21.7997 41.0425 21.9459C41.0718 22.4527 40.9645 22.9693 41.101 23.4761L41.1302 23.4469ZM23.8108 17.063C23.8108 18.0961 24.035 18.9148 24.5223 19.6458C25.8868 21.7218 28.5963 21.9069 30.1655 20.0259C31.53 18.3885 31.4618 15.8349 29.9998 14.2755C28.7815 12.9792 26.8225 12.8038 25.419 13.8856C24.3371 14.7238 23.8595 15.8739 23.8206 17.063H23.8108ZM17.5731 17.3748C17.5731 16.6244 17.4756 16.0103 17.2027 15.4353C16.5595 14.1 15.5361 13.2424 14.0059 13.1936C12.4952 13.1449 11.4328 13.9246 10.7408 15.2111C9.88315 16.829 10.1366 18.7881 11.3549 20.1623C12.5829 21.5463 14.6102 21.7315 16.0526 20.5619C17.0955 19.714 17.5438 18.5737 17.5828 17.3748H17.5731Z"
      fill="#5865F2"
    />
  </svg>
);

export const TwitterIcon = () => (
  <svg viewBox="0 0 33 27" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M32.3127 3.1985C31.3088 3.64684 30.2075 3.92949 29.1257 4.10493C29.6422 4.01721 30.3927 3.09129 30.6948 2.71118C31.1529 2.13614 31.5428 1.48313 31.7572 0.781387C31.7864 0.722908 31.8059 0.654685 31.7572 0.615699C31.689 0.58646 31.6402 0.605947 31.5915 0.62544C30.3829 1.26871 29.1354 1.73654 27.8099 2.07766C27.7027 2.1069 27.615 2.07766 27.5467 2.00943C27.4395 1.88273 27.3323 1.76578 27.2153 1.66832C26.6598 1.19074 26.0555 0.820367 25.383 0.547467C24.4961 0.186849 23.5312 0.0309141 22.576 0.0991391C21.6501 0.157618 20.734 0.420776 19.9055 0.849619C19.0771 1.27846 18.3461 1.88273 17.7516 2.60397C17.1473 3.35444 16.6989 4.24137 16.465 5.17702C16.2409 6.08344 16.2603 6.98012 16.3968 7.89629C16.4163 8.05223 16.3968 8.07173 16.2701 8.05224C11.0752 7.28227 6.76732 5.42069 3.26834 1.4344C3.1124 1.25896 3.03443 1.25897 2.90773 1.44415C1.37754 3.73457 2.11826 7.41871 4.02857 9.23155C4.28197 9.47521 4.54513 9.71887 4.82777 9.93329C4.72056 9.95278 3.45353 9.81633 2.32294 9.23155C2.167 9.13408 2.09877 9.19257 2.07928 9.35826C2.06953 9.60192 2.07928 9.83583 2.11827 10.099C2.41066 12.4284 4.01882 14.5726 6.23126 15.4108C6.49442 15.518 6.78681 15.6155 7.06946 15.6642C6.56264 15.7714 6.04608 15.8494 4.61335 15.7422C4.43792 15.7032 4.36969 15.8006 4.43792 15.9663C5.51977 18.9195 7.85892 19.7967 9.60353 20.2938C9.83744 20.3327 10.0714 20.3327 10.3053 20.3912C10.2955 20.4107 10.276 20.4107 10.2663 20.4302C9.6815 21.3171 7.67374 21.9701 6.73808 22.3015C5.03245 22.8961 3.18063 23.169 1.37754 22.9838C1.08514 22.9448 1.02666 22.9448 0.948692 22.9838C0.870721 23.0325 0.938946 23.1007 1.02666 23.1787C1.39703 23.4224 1.76739 23.6368 2.1475 23.8415C3.28784 24.4457 4.48665 24.9331 5.73419 25.2742C12.1766 27.0578 19.4279 25.742 24.2622 20.937C28.0633 17.1652 29.3888 11.9605 29.3888 6.7462C29.3888 6.54153 29.6325 6.43433 29.7689 6.31737C30.7533 5.57664 31.5525 4.68971 32.2932 3.69558C32.4589 3.47141 32.4589 3.27648 32.4589 3.18876V3.15952C32.4589 3.0718 32.4589 3.10104 32.3322 3.15952L32.3127 3.1985Z"
      fill="#1F9CEA"
    />
  </svg>
);

export const SpotifyIcon = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="#1DB954"
  >
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

export const TikTokIcon = () => (
  <svg role="img" viewBox="-2 -2 28 28" xmlns="http://www.w3.org/2000/svg">
    <title>TikTok</title>
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

export const TelegramIcon = () => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="#0088cc"
  >
    <title>Telegram</title>
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);
export const CloseIcon = () => (
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

export const CopyIcon = ({ w, h }: { w: number; h: number }) => (
  <svg
    clipRule="evenodd"
    fillRule="evenodd"
    strokeLinejoin="round"
    strokeMiterlimit="2"
    width={w}
    height={h}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m6 19v2c0 .621.52 1 1 1h2v-1.5h-1.5v-1.5zm7.5 3h-3.5v-1.5h3.5zm4.5 0h-3.5v-1.5h3.5zm4-3h-1.5v1.5h-1.5v1.5h2c.478 0 1-.379 1-1zm-1.5-1v-3.363h1.5v3.363zm0-4.363v-3.637h1.5v3.637zm-13-3.637v3.637h-1.5v-3.637zm11.5-4v1.5h1.5v1.5h1.5v-2c0-.478-.379-1-1-1zm-10 0h-2c-.62 0-1 .519-1 1v2h1.5v-1.5h1.5zm4.5 1.5h-3.5v-1.5h3.5zm3-1.5v-2.5h-13v13h2.5v-1.863h1.5v3.363h-4.5c-.48 0-1-.379-1-1v-14c0-.481.38-1 1-1h14c.621 0 1 .522 1 1v4.5h-3.5v-1.5z"
      fillRule="nonzero"
    />
  </svg>
);

export const CornerSVG = ({
  position,
  padding = 2,
  color = "currentColor",
  thickness = 1,
  width = 12,
  height = 12,
  className = "",
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  padding?: number | string;
  color?: string;
  thickness?: number | string;
  width?: number;
  height?: number;
  className?: string;
}) => {
  let rotation = 0;
  if (position === "top-right") rotation = 90;
  if (position === "bottom-right") rotation = 180;
  if (position === "bottom-left") rotation = 270;

  const strokeWidth =
    typeof thickness === "number" ? thickness : parseFloat(thickness);

  const positionClass = styles[`corner-${position.replace("-", "-")}`];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25 25"
      fill="none"
      className={`${styles["corner-svg"]} ${positionClass} ${className}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        color,
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        ...(typeof padding === "number"
          ? {
              [position.includes("top") ? "top" : "bottom"]: `${padding}px`,
              [position.includes("left") ? "left" : "right"]: `${padding}px`,
            }
          : {
              [position.includes("top") ? "top" : "bottom"]: padding,
              [position.includes("left") ? "left" : "right"]: padding,
            }),
      }}
    >
      <path
        d="M1 25L0.999999 1L25 1"
        stroke="currentColor"
        strokeWidth={strokeWidth}
      ></path>
    </svg>
  );
};

export const CornerSquare = ({
  position,
  padding = 4,
  color = "white",
  size = 4,
  className = "",
  opacity = 0.5,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  padding?: number | string;
  color?: string;
  size?: number | string;
  className?: string;
  opacity?: number;
}) => {
  const positionClass = styles[`corner-${position.replace("-", "-")}`];

  return (
    <div
      className={`${styles["corner-square"]} ${positionClass} ${className}`}
      style={{
        backgroundColor: color,
        width: typeof size === "number" ? `${size}px` : size,
        height: typeof size === "number" ? `${size}px` : size,
        opacity,
        ...(typeof padding === "number"
          ? {
              [position.includes("top") ? "top" : "bottom"]: `${padding}px`,
              [position.includes("left") ? "left" : "right"]: `${padding}px`,
            }
          : {
              [position.includes("top") ? "top" : "bottom"]: padding,
              [position.includes("left") ? "left" : "right"]: padding,
            }),
      }}
    />
  );
};

export const SquareCorners = ({
  padding = 2,
  color = "white",
  size = 4,
  className = "",
  opacity = 0.5,
}: {
  padding?: number | string;
  color?: string;
  size?: number | string;
  className?: string;
  opacity?: number;
}) => {
  return (
    <>
      <CornerSquare
        position="top-left"
        padding={padding}
        color={color}
        size={size}
        className={className}
        opacity={opacity}
      />
      <CornerSquare
        position="top-right"
        padding={padding}
        color={color}
        size={size}
        className={className}
        opacity={opacity}
      />
      <CornerSquare
        position="bottom-left"
        padding={padding}
        color={color}
        size={size}
        className={className}
        opacity={opacity}
      />
      <CornerSquare
        position="bottom-right"
        padding={padding}
        color={color}
        size={size}
        className={className}
        opacity={opacity}
      />
    </>
  );
};

export const ArrowCorners = ({
  padding = 2,
  color = "currentColor",
  thickness = 1,
  size = 12,
  className = "",
}: {
  padding?: number | string;
  color?: string;
  thickness?: number | string;
  size?: number;
  className?: string;
}) => {
  return (
    <>
      <CornerSVG
        position="top-left"
        padding={padding}
        color={color}
        thickness={thickness}
        width={size}
        height={size}
        className={className}
      />
      <CornerSVG
        position="top-right"
        padding={padding}
        color={color}
        thickness={thickness}
        width={size}
        height={size}
        className={className}
      />
      <CornerSVG
        position="bottom-left"
        padding={padding}
        color={color}
        thickness={thickness}
        width={size}
        height={size}
        className={className}
      />
      <CornerSVG
        position="bottom-right"
        padding={padding}
        color={color}
        thickness={thickness}
        width={size}
        height={size}
        className={className}
      />
    </>
  );
};
