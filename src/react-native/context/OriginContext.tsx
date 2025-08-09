import React, { createContext, useContext, ReactNode } from "react";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { CampContext } from "./CampContext";

interface OriginContextType {
  statsQuery: UseQueryResult<any, Error>;
  uploadsQuery: UseQueryResult<any, Error>;
}

const OriginContext = createContext<OriginContextType | null>(null);

interface OriginProviderProps {
  children: ReactNode;
}

const OriginProvider = ({ children }: OriginProviderProps) => {
  const { auth } = useContext(CampContext);

  const statsQuery = useQuery({
    queryKey: ["origin-stats", auth?.userId],
    queryFn: async () => {
      if (!auth?.isAuthenticated || !auth?.origin) {
        return null;
      }
      return await auth.origin.getOriginUsage();
    },
    enabled: !!auth?.isAuthenticated && !!auth?.origin,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const uploadsQuery = useQuery({
    queryKey: ["origin-uploads", auth?.userId],
    queryFn: async () => {
      if (!auth?.isAuthenticated || !auth?.origin) {
        return [];
      }
      return await auth.origin.getOriginUploads();
    },
    enabled: !!auth?.isAuthenticated && !!auth?.origin,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  return (
    <OriginContext.Provider value={{ statsQuery, uploadsQuery }}>
      {children}
    </OriginContext.Provider>
  );
};

export { OriginContext, OriginProvider };
