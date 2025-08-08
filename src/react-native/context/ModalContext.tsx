import React, { createContext, useState, ReactNode } from "react";

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

const ModalContext = createContext<ModalContextType>({
  isVisible: false,
  setIsVisible: () => {},
  isLinkingVisible: false,
  setIsLinkingVisible: () => {},
  currentlyLinking: "",
  setCurrentlyLinking: () => {},
  isButtonDisabled: false,
  setIsButtonDisabled: () => {},
});

interface ModalProviderProps {
  children: ReactNode;
}

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLinkingVisible, setIsLinkingVisible] = useState(false);
  const [currentlyLinking, setCurrentlyLinking] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  return (
    <ModalContext.Provider
      value={{
        isVisible,
        setIsVisible,
        isLinkingVisible,
        setIsLinkingVisible,
        currentlyLinking,
        setCurrentlyLinking,
        isButtonDisabled,
        setIsButtonDisabled,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export { ModalContext, ModalProvider };
