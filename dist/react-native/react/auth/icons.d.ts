import React from "react";
type Social = "twitter" | "spotify" | "discord" | "tiktok" | "telegram";
export declare const getIconBySocial: (social: Social) => () => React.JSX.Element;
export declare const CheckMarkIcon: ({ w, h }: {
    w?: any;
    h?: any;
}) => React.JSX.Element;
export declare const XMarkIcon: ({ w, h }: {
    w?: any;
    h?: any;
}) => React.JSX.Element;
export declare const LinkIcon: ({ w, h }: {
    w?: any;
    h?: any;
}) => React.JSX.Element;
export declare const BinIcon: ({ w, h }: {
    w?: any;
    h?: any;
}) => React.JSX.Element;
export declare const CampIcon: ({ customStyles }: {
    customStyles?: any;
}) => React.JSX.Element;
export declare const DiscordIcon: () => React.JSX.Element;
export declare const TwitterIcon: () => React.JSX.Element;
export declare const SpotifyIcon: () => React.JSX.Element;
export declare const TikTokIcon: () => React.JSX.Element;
export declare const TelegramIcon: () => React.JSX.Element;
export declare const CloseIcon: () => React.JSX.Element;
export {};
