import React from "react";
import { createContext } from "react";

export const ModalContext = createContext({
  isVisible: false,
  setIsVisible: () => {},
});

export const ModalProvider = ({ children }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  return (
    <ModalContext.Provider
      value={{
        isVisible,
        setIsVisible,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
