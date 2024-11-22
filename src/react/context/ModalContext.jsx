import React, { useState, createContext } from "react";

export const ModalContext = createContext({
  isVisible: false,
  setIsVisible: () => {},
});

export const ModalProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
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
