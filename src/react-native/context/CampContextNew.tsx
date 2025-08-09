import React, { useState, createContext, useEffect, ReactNode } from "react";
import { AuthRN } from "../auth/AuthRN";

/**
 * CampContext for React Native
 */
export const CampContext = createContext<{
  auth: AuthRN | null;
  setAuth: React.Dispatch<React.SetStateAction<AuthRN | null>>;
  clientId: string;
}>({
  auth: null,
  setAuth: () => {},
  clientId: "",
});

interface CampProviderProps {
  children: ReactNode;
  clientId: string;
  redirectUri?: string | Record<string, string>;
}

export const CampProvider = ({ children, clientId, redirectUri }: CampProviderProps) => {
  const [auth, setAuth] = useState<AuthRN | null>(null);

  useEffect(() => {
    if (!clientId) {
      console.error("CampProvider: clientId is required");
      return;
    }

    try {
      const authInstance = new AuthRN({ clientId, redirectUri });
      setAuth(authInstance);
    } catch (error) {
      console.error("Failed to create AuthRN instance:", error);
    }
  }, [clientId, redirectUri]);

  return (
    <CampContext.Provider
      value={{
        auth,
        setAuth,
        clientId,
      }}
    >
      {children}
    </CampContext.Provider>
  );
};
