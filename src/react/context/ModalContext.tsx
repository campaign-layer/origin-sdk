import React, { useState, createContext, ReactNode } from "react";

interface ModalContextProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
  isLinkingVisible: boolean;
  setIsLinkingVisible: (isLinkingVisible: boolean) => void;
  currentlyLinking: any;
  setCurrentlyLinking: (currentlyLinking: any) => void;
}

export const ModalContext = createContext<ModalContextProps>({
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
  return (
    <ModalContext.Provider
      value={{
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
