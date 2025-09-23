import React, { createContext, useContext, ReactNode } from "react";
import { CampContext, useAuthState } from "../auth/index";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface SocialsContextProps {
  query: UseQueryResult<any, unknown> | null;
}

export const SocialsContext = createContext<SocialsContextProps>({
  query: null,
});

interface SocialsProviderProps {
  children: ReactNode;
}

export const SocialsProvider = ({ children }: SocialsProviderProps) => {
  const { authenticated } = useAuthState();
  const { auth } = useContext(CampContext);
  if (!auth && typeof window !== "undefined") {
    throw new Error("Auth instance is not available");
  }
  const query = useQuery({
    queryKey: ["socials", authenticated],
    queryFn: () => auth?.getLinkedSocials() ?? Promise.resolve(null),
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
