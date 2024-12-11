import React, { useState, createContext } from "react";

export const ModalContext = createContext({
  isVisible: false,
  setIsVisible: () => {},
  isLinkingVisible: false,
  setIsLinkingVisible: () => {},
  currentlyLinking: null,
  setCurrentlyLinking: () => {},
});

export const ModalProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLinkingVisible, setIsLinkingVisible] = useState(false);
  const [currentlyLinking, setCurrentlyLinking] = useState(null);
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
