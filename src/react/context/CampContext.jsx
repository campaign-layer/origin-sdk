import React from "react";
import { createContext } from "react";
import { TwitterAPI } from "../../twitter.js";
import { Auth } from "../../auth/index.js";

const CampContext = createContext({
  apiKey: null,
  clientId: null,
  twitter: null,
  auth: null,
});

const CampProvider = ({ apiKey, clientId, redirectUri, children }) => {
  return (
    <CampContext.Provider
      value={{
        apiKey,
        twitter: new TwitterAPI({ apiKey: apiKey || null, clientId: clientId || null }),
        auth: new Auth({ clientId: clientId || null, redirectUri: redirectUri || null }),
      }}
    >
      {children}
    </CampContext.Provider>
  );
};

export { CampContext, CampProvider };
