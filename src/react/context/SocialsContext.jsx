import React, { createContext, useContext } from "react";
import { CampContext, useAuthState } from "../auth/index.jsx";
import { useQuery } from "@tanstack/react-query";

export const SocialsContext = createContext({
  query: null,
});

export const SocialsProvider = ({ children }) => {
  const { authenticated } = useAuthState();
  const { auth } = useContext(CampContext);
  const query = useQuery({
    queryKey: ["socials", authenticated],
    queryFn: () => auth.getLinkedSocials(),
  });

  return (
    <SocialsContext.Provider
      value={{
        query,
      }}
    >
      {children}
    </SocialsContext.Provider>
  );
};
