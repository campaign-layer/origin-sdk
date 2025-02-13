import React, { useState, createContext, ReactNode } from "react";

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

export const ModalContext = createContext<ModalContextProps>({
  isButtonDisabled: false,
  setIsButtonDisabled: () => {},
  isVisible: false,
  setIsVisible: () => {},
  isLinkingVisible: false,
  setIsLinkingVisible: () => {},
  currentlyLinking: null,
  setCurrentlyLinking: () => {},
});

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLinkingVisible, setIsLinkingVisible] = useState<boolean>(false);
  const [currentlyLinking, setCurrentlyLinking] = useState<any>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  return (
    <ModalContext.Provider
      value={{
        isButtonDisabled,
        setIsButtonDisabled,
        isVisible,
        setIsVisible,
        isLinkingVisible,
        setIsLinkingVisible,
        currentlyLinking,
        setCurrentlyLinking,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
