import React, { createContext, useContext, ReactNode } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { CampContext } from "./CampContext";

interface SocialsContextType {
  query: UseQueryResult<any, Error>;
}

const SocialsContext = createContext<SocialsContextType | null>(null);

interface SocialsProviderProps {
  children: ReactNode;
}

const SocialsProvider = ({ children }: SocialsProviderProps) => {
  const { auth } = useContext(CampContext);

  const query = useQuery({
    queryKey: ["socials", auth?.userId],
    queryFn: async () => {
      if (!auth?.isAuthenticated) {
        return {};
      }
      return await auth.getLinkedSocials();
    },
    enabled: !!auth?.isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  return (
    <SocialsContext.Provider value={{ query }}>
      {children}
    </SocialsContext.Provider>
  );
};

export { SocialsContext, SocialsProvider };
