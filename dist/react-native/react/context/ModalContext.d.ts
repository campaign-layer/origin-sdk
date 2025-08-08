import React, { ReactNode } from "react";
interface ModalContextProps {
    isButtonDisabled: boolean;
    setIsButtonDisabled: (isButtonDisabled: boolean) => void;
    isVisible: boolean;
    setIsVisible: (isVisible: boolean) => void;
    isLinkingVisible: boolean;
    setIsLinkingVisible: (isLinkingVisible: boolean) => void;
    currentlyLinking: any;
    setCurrentlyLinking: (currentlyLinking: any) => void;
}
export declare const ModalContext: React.Context<ModalContextProps>;
interface ModalProviderProps {
    children: ReactNode;
}
export declare const ModalProvider: ({ children }: ModalProviderProps) => React.JSX.Element;
export {};
