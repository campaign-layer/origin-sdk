import React from "react";
import { createContext } from "react";
import { TwitterAPI } from "../../twitter.js";

const CampContext = createContext({
  apiKey: null,
  clientId: null,
  twitter: new TwitterAPI({ apiKey: null, clientId: "id" }),
});

const CampProvider = ({ apiKey, clientId, children }) => {
  return (
    <CampContext.Provider
      value={{
        apiKey,
        twitter: new TwitterAPI({ apiKey: apiKey || null, clientId }),
      }}
    >
      {children}
    </CampContext.Provider>
  );
};

export { CampContext, CampProvider };
