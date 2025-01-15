import { JSX } from "react";
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
export declare const CampButton: ({ onClick, authenticated, disabled }: CampButtonProps) => JSX.Element;
interface ProviderButtonProps {
    provider: {
        provider: string;
        info: Record<string, string>;
    };
    handleConnect: (provider: any) => void;
    loading?: boolean;
    label?: string;
}
/**
 * The ProviderButton component.
 * @param { { provider: { provider: string, info: { name: string, icon: string } }, handleConnect: function, loading: boolean, label: string } } props The props.
 * @returns { JSX.Element } The ProviderButton component.
 */
export declare const ProviderButton: ({ provider, handleConnect, loading, label }: ProviderButtonProps) => JSX.Element;
interface ConnectorButtonProps {
    name: string;
    link: Function;
    unlink: () => Promise<void>;
    icon: JSX.Element;
    isConnected: boolean;
    refetch: Function;
}
export declare const ConnectorButton: ({ name, link, unlink, icon, isConnected, refetch, }: ConnectorButtonProps) => JSX.Element;
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
export declare const LinkButton: ({ variant, social, theme, }: LinkButtonProps) => JSX.Element | null;
export {};
