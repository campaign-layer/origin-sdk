import React from "react";
import { createContext } from "react";
import { TwitterAPI } from "../../twitter.js";

const CampContext = createContext({
  apiKey: null,
  clientId: null,
  twitter: new TwitterAPI({ apiKey: null, clientId: null }),
});

const CampProvider = ({ apiKey, clientId, children }) => {
  return (
    <CampContext.Provider
      value={{
        apiKey,
        twitter: new TwitterAPI({ apiKey: apiKey || null, clientId: clientId || null }),
      }}
    >
      {children}
    </CampContext.Provider>
  );
};

export { CampContext, CampProvider };
