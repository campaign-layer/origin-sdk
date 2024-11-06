import React from "react";
import { createContext } from "react";

export const ModalContext = createContext({
  isAuthVisible: false,
  setIsAuthVisible: () => {},
  isMyCampVisible: false,
  setIsMyCampVisible: () => {},
});

export const ModalProvider = ({ children }) => {
  const [isAuthVisible, setIsAuthVisible] = React.useState(false);
  const [isMyCampVisible, setIsMyCampVisible] = React.useState(false);
  return (
    <ModalContext.Provider
      value={{
        isAuthVisible,
        setIsAuthVisible,
        isMyCampVisible,
        setIsMyCampVisible,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
