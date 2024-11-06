import React, { useEffect } from "react";
import { createContext } from "react";
import { TwitterAPI } from "../../twitter.js";
import { Auth } from "../../auth/index.js";

const CampContext = createContext({
  apiKey: null,
  clientId: null,
  twitter: null,
  auth: null,
});

const ModalContext = createContext({
  isVisible: false,
  setIsVisible: () => {},
});

const ModalProvider = ({ children }) => {
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

const CampProvider = ({ apiKey, clientId, redirectUri, children }) => {
  const [auth, setAuth] = React.useState(new Auth({ clientId, redirectUri }));
  const [twitter, setTwitter] = React.useState(
    new TwitterAPI({ clientId, apiKey })
  );

  return (
    <CampContext.Provider
      value={{
        apiKey,
        clientId,
        auth,
        setAuth,
        twitter,
        setTwitter,
      }}
    >
      <ModalProvider>{children}</ModalProvider>
    </CampContext.Provider>
  );
};

export { CampContext, ModalContext, CampProvider, ModalProvider };
