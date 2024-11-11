import React, { useEffect } from "react";
import { createContext } from "react";
import { TwitterAPI } from "../../twitter.js";
import { Auth } from "../../auth/index.js";
import { ModalProvider } from "./ModalContext.jsx";

const CampContext = createContext({
  apiKey: null,
  clientId: null,
  twitter: null,
  auth: null,
});

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

export { CampContext, CampProvider };
