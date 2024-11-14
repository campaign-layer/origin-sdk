import React from "react";
import { createContext } from "react";
import { Auth } from "../../auth/index.js";
import { ModalProvider } from "./ModalContext.jsx";

const CampContext = createContext({
  clientId: null,
  auth: null,
});

const CampProvider = ({ clientId, redirectUri, children }) => {
  const [auth, setAuth] = React.useState(new Auth({ clientId, redirectUri }));

  return (
    <CampContext.Provider
      value={{
        clientId,
        auth,
        setAuth,
      }}
    >
      <ModalProvider>{children}</ModalProvider>
    </CampContext.Provider>
  );
};

export { CampContext, CampProvider };
