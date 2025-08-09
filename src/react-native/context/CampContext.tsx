import React, { useState, createContext, useEffect, ReactNode, useContext } from "react";
import { AuthRN } from "../auth/AuthRN";
import { Storage } from "../storage";

export interface CampContextType {
  auth: AuthRN | null;
  setAuth: React.Dispatch<React.SetStateAction<AuthRN | null>>;
  clientId: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  walletAddress: string | null;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  clearError: () => void;
  getAppKit: () => any; // Direct AppKit access
}

/**
 * CampContext for React Native with AppKit integration
 */
export const CampContext = createContext<CampContextType>({
  auth: null,
  setAuth: () => {},
  clientId: "",
  isAuthenticated: false,
  isLoading: false,
  walletAddress: null,
  error: null,
  connect: async () => {},
  disconnect: async () => {},
  clearError: () => {},
  getAppKit: () => null,
});

interface CampProviderProps {
  children: ReactNode;
  clientId: string;
  redirectUri?: string | Record<string, string>;
  allowAnalytics?: boolean;
  appKit?: any; // AppKit instance
}

export const CampProvider = ({ 
  children, 
  clientId, 
  redirectUri, 
  allowAnalytics = true,
  appKit 
}: CampProviderProps) => {
  const [auth, setAuth] = useState<AuthRN | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) {
      console.error("CampProvider: clientId is required");
      return;
    }

    try {
      const authInstance = new AuthRN({ 
        clientId, 
        redirectUri, 
        allowAnalytics,
        appKit // Pass AppKit instance
      });

      // Set up event listeners
      authInstance.on('state', (state: string) => {
        setIsLoading(state === 'loading');
        setIsAuthenticated(state === 'authenticated');
        if (state === 'unauthenticated') {
          setWalletAddress(null);
        }
      });

      // Load initial state
      const loadInitialState = async () => {
        try {
          const savedAddress = await Storage.getItem('camp-sdk:wallet-address');
          if (savedAddress && authInstance.isAuthenticated) {
            setWalletAddress(savedAddress);
            setIsAuthenticated(true);
          }
        } catch (err) {
          console.error('Error loading initial auth state:', err);
        }
      };

      setAuth(authInstance);
      loadInitialState();
    } catch (error) {
      console.error("Failed to create AuthRN instance:", error);
      setError("Failed to initialize authentication");
    }
  }, [clientId, redirectUri, allowAnalytics, appKit]);

  const connect = async () => {
    if (!auth) return;
    
    try {
      setError(null);
      const result = await auth.connect();
      setWalletAddress(result.walletAddress);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      throw err;
    }
  };

  const disconnect = async () => {
    if (!auth) return;
    
    try {
      setError(null);
      await auth.disconnect();
      setWalletAddress(null);
    } catch (err: any) {
      setError(err.message || 'Failed to disconnect wallet');
      throw err;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const getAppKit = () => {
    return auth?.getAppKit();
  };

  return (
    <CampContext.Provider
      value={{
        auth,
        setAuth,
        clientId,
        isAuthenticated,
        isLoading,
        walletAddress,
        error,
        connect,
        disconnect,
        clearError,
        getAppKit,
      }}
    >
      {children}
    </CampContext.Provider>
  );
};

export const useCamp = (): CampContextType => {
  const context = useContext(CampContext);
  if (!context) {
    throw new Error('useCamp must be used within a CampProvider');
  }
  return context;
};
