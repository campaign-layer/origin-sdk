import React, { ReactNode } from "react";
interface ModalContextType {
    isVisible: boolean;
    setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
    isLinkingVisible: boolean;
    setIsLinkingVisible: React.Dispatch<React.SetStateAction<boolean>>;
    currentlyLinking: string;
    setCurrentlyLinking: React.Dispatch<React.SetStateAction<string>>;
    isButtonDisabled: boolean;
    setIsButtonDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}
declare const ModalContext: React.Context<ModalContextType>;
interface ModalProviderProps {
    children: ReactNode;
}
declare const ModalProvider: ({ children }: ModalProviderProps) => React.JSX.Element;
export { ModalContext, ModalProvider };
