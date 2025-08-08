import React, { JSX } from "react";
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
export declare const CampButton: ({ onClick, authenticated, disabled, }: CampButtonProps) => JSX.Element;
/**
 * The GoToOriginDashboard component. Handles the action of going to the Origin Dashboard.
 * @param { { text?: string } } props The props.
 * @param { string } [props.text] The text to display on the button.
 * @param { string } [props.text="Origin Dashboard"] The default text to display on the button.
 * @returns { JSX.Element } The GoToOriginDashboard component.
 */
export declare const GoToOriginDashboard: ({ text, }: {
    text?: string;
}) => JSX.Element;
/**
 * The TabButton component.
 * @param { { label: string, isActive: boolean, onClick: function } } props The props.
 * @returns { JSX.Element } The TabButton component.
 */
export declare const TabButton: ({ label, isActive, onClick, }: {
    label: string;
    isActive: boolean;
    onClick: () => void;
}) => JSX.Element;
export declare const StandaloneCampButton: () => JSX.Element | null;
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
export declare const ProviderButton: ({ provider, handleConnect, loading, label, }: ProviderButtonProps) => JSX.Element;
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
interface FileUploadProps {
    onFileUpload?: (files: File[]) => void;
    accept?: string;
    maxFileSize?: number;
}
interface PercentageSliderProps {
    onChange: (value: number) => void;
}
export declare const PercentageSlider: React.FC<PercentageSliderProps>;
interface DeadlinePickerProps {
    onChange: (unixTimestamp: number) => void;
}
export declare const DatePicker: React.FC<DeadlinePickerProps>;
/**
 * The FileUpload component.
 * Provides a file upload field with drag-and-drop support.
 * @param { { onFileUpload?: function, accept?: string, maxFileSize?: number } } props The props.
 * @returns { JSX.Element } The FileUpload component.
 */
export declare const FileUpload: ({ onFileUpload, accept, maxFileSize, }: FileUploadProps) => JSX.Element;
export {};
