import React, { createContext, useContext, ReactNode } from "react";
import { CampContext, useAuthState } from "../auth/index";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export interface UserData {
  id: string;
  privyId: string | null;
  email: string | null;
  uniqueId: string;
  spotifyId: string | null;
  youtubeId: string | null;
  tiktokId: string | null;
  firstName: string;
  lastName: string;
  phoneNumber: string | null;
  walletAddress: string;
  image: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  isAllowListed: boolean;
}

interface UserApiResponse {
  isError: boolean;
  data: UserData;
  message: string;
}

export interface UserContextProps {
  query: UseQueryResult<UserData | null, Error> | null;
  user: UserData | null;
  isAllowListed: boolean;
  isLoading: boolean;
  refetch: () => void;
}

export const UserContext = createContext<UserContextProps>({
  query: null,
  user: null,
  isAllowListed: false,
  isLoading: false,
  refetch: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const { authenticated } = useAuthState();
  const { auth, environment } = useContext(CampContext);

  if (!auth && typeof window !== "undefined") {
    throw new Error("Auth instance is not available");
  }

  const query = useQuery({
    queryKey: ["user", authenticated],
    queryFn: async (): Promise<UserData | null> => {
      if (!authenticated || !auth?.jwt) return null;

      const response = await fetch(
        `${environment.AUTH_HUB_BASE_API}/${environment.AUTH_ENDPOINT}/client-user/user`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${auth.jwt}`,
            "x-client-id": auth.clientId,
            "Content-Type": "application/json",
          },
        }
      );

      const data: UserApiResponse = await response.json();

      if (data.isError) {
        throw new Error(data.message || "Failed to fetch user data");
      }

      return data.data;
    },
    enabled: authenticated,
  });

  const value: UserContextProps = {
    query,
    user: query.data ?? null,
    isAllowListed: query.data?.isAllowListed ?? false,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
