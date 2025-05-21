import React, { createContext, useContext, ReactNode } from "react";
import { CampContext, useAuthState } from "../auth/index";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

interface OriginContextProps {
  statsQuery: UseQueryResult<any, unknown> | null;
  uploadsQuery: UseQueryResult<any, unknown> | null;
}

export const OriginContext = createContext<OriginContextProps>({
  statsQuery: null,
  uploadsQuery: null,
});

interface OriginProviderProps {
  children: ReactNode;
}

export const OriginProvider = ({ children }: OriginProviderProps) => {
  const { authenticated } = useAuthState();
  const { auth } = useContext(CampContext);
  if (!auth && typeof window !== "undefined") {
    throw new Error("Auth instance is not available");
  }

  const statsQuery = useQuery({
    queryKey: ["origin-stats", authenticated],
    queryFn: () => auth?.origin?.getOriginUsage() ?? Promise.resolve(null),
  });

  const uploadsQuery = useQuery({
    queryKey: ["origin-uploads", authenticated],
    queryFn: () => auth?.origin?.getOriginUploads() ?? Promise.resolve(null),
  });

  return (
    <OriginContext.Provider
      value={{
        statsQuery: statsQuery,
        uploadsQuery: uploadsQuery,
      }}
    >
      {children}
    </OriginContext.Provider>
  );
};
