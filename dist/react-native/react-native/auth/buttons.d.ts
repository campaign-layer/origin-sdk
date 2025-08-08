import React from "react";
interface CampButtonProps {
    onPress: () => void;
    authenticated: boolean;
    disabled?: boolean;
    style?: any;
}
declare const CampButton: ({ onPress, authenticated, disabled, style }: CampButtonProps) => React.JSX.Element;
interface LinkButtonProps {
    social: string;
    variant?: "default" | "icon";
    theme?: "default" | "camp";
    style?: any;
    onPress?: () => void;
}
declare const LinkButton: ({ social, variant, theme, style, onPress }: LinkButtonProps) => React.JSX.Element;
declare const LoadingSpinner: ({ size, color }: {
    size?: string | undefined;
    color?: string | undefined;
}) => React.JSX.Element;
export { CampButton, LinkButton, LoadingSpinner };
