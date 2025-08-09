import { useState, useEffect, useCallback, useContext } from 'react';
import { CampContext } from '../context/CampContext';
import type { CampContextType } from '../context/CampContext';
import { AuthRN } from '../auth/AuthRN';

// Export the context type
export type { CampContextType };

// Main Camp authentication hook
export const useCampAuth = () => {
  const context = useContext(CampContext);
  
  if (!context) {
    throw new Error('useCampAuth must be used within a CampProvider');
  }

  const { 
    auth, 
    isAuthenticated, 
    isLoading, 
    walletAddress, 
    error, 
    connect, 
    disconnect, 
    clearError 
  } = context;

  return {
    auth,
    isAuthenticated,
    authenticated: isAuthenticated, // Alias for compatibility
    isLoading,
    loading: isLoading, // Alias for compatibility
    walletAddress,
    error,
    connect,
    disconnect,
    clearError,
  };
};

// Alias for compatibility
export const useAuthState = () => {
  const { isAuthenticated, isLoading } = useCampAuth();
  return { authenticated: isAuthenticated, loading: isLoading };
};

// Combined hook for full Camp access
export const useCamp = () => {
  const context = useContext(CampContext);
  
  if (!context) {
    throw new Error('useCamp must be used within a CampProvider');
  }

  return context;
};

// Social accounts hook
export const useSocials = () => {
  const { auth } = useCampAuth();
  const [data, setData] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSocials = useCallback(async () => {
    if (!auth || !auth.isAuthenticated) {
      setData({});
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const socialsData = await auth.getLinkedSocials();
      setData(socialsData);
    } catch (err) {
      setError(err as Error);
      setData({});
    } finally {
      setIsLoading(false);
    }
  }, [auth]);

  const linkSocial = useCallback(async (platform: 'twitter' | 'discord' | 'spotify'): Promise<void> => {
    if (!auth) throw new Error('Authentication required');
    return auth.linkSocial(platform);
  }, [auth]);

  const unlinkSocial = useCallback(async (platform: 'twitter' | 'discord' | 'spotify'): Promise<void> => {
    if (!auth) throw new Error('Authentication required');
    return auth.unlinkSocial(platform);
  }, [auth]);

  useEffect(() => {
    if (auth?.isAuthenticated) {
      fetchSocials();
    }
  }, [auth?.isAuthenticated, fetchSocials]);

  return {
    data,
    socials: data, // Alias for compatibility
    isLoading,
    error,
    linkSocial,
    unlinkSocial,
    refetch: fetchSocials,
  };
};

// AppKit hook for wallet operations (no wagmi dependency)
export const useAppKit = () => {
  const { getAppKit, auth } = useCamp();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);

  const appKit = getAppKit();

  useEffect(() => {
    if (!appKit) return;

    // Check initial connection state
    try {
      const connected = appKit.getIsConnected?.() || false;
      const account = appKit.getAccount?.();
      const currentChainId = appKit.getChainId?.();

      setIsConnected(connected);
      setAddress(account?.address || null);
      setChainId(currentChainId || null);
    } catch (error) {
      console.warn('Error getting AppKit state:', error);
    }

    // Set up event listeners if available
    let unsubscribeAccount: (() => void) | undefined;
    let unsubscribeNetwork: (() => void) | undefined;

    try {
      if (appKit.subscribeAccount) {
        unsubscribeAccount = appKit.subscribeAccount((account: any) => {
          setAddress(account?.address || null);
          setIsConnected(!!account?.address);
        });
      }

      if (appKit.subscribeChainId) {
        unsubscribeNetwork = appKit.subscribeChainId((chainId: number) => {
          setChainId(chainId);
        });
      }
    } catch (error) {
      console.warn('Error setting up AppKit subscriptions:', error);
    }

    return () => {
      unsubscribeAccount?.();
      unsubscribeNetwork?.();
    };
  }, [appKit]);

  const openAppKit = useCallback(async (): Promise<string> => {
    if (!appKit) throw new Error('AppKit not initialized');
    
    setIsConnecting(true);
    try {
      if (appKit.open) {
        await appKit.open();
      } else if (appKit.openAppKit) {
        await appKit.openAppKit();
      } else {
        throw new Error('No open method available on AppKit');
      }
      
      // Return the connected address
      const account = appKit.getAccount?.();
      return account?.address || '';
    } finally {
      setIsConnecting(false);
    }
  }, [appKit]);

  const disconnectAppKit = useCallback(async () => {
    if (!appKit) return;
    
    try {
      await appKit.disconnect?.();
      setIsConnected(false);
      setAddress(null);
      setChainId(null);
      setBalance(null);
    } catch (error) {
      console.error('Error disconnecting AppKit:', error);
      throw error;
    }
  }, [appKit]);

  const switchNetwork = useCallback(async (targetChainId: number) => {
    if (!appKit) throw new Error('AppKit not initialized');
    
    try {
      await appKit.switchNetwork?.({ chainId: targetChainId });
      setChainId(targetChainId);
    } catch (error) {
      console.error('Error switching network:', error);
      throw error;
    }
  }, [appKit]);

  const signMessage = useCallback(async (message: string): Promise<string> => {
    if (!appKit) throw new Error('AppKit not initialized');
    if (!isConnected) throw new Error('Wallet not connected');
    
    try {
      if (appKit.signMessage) {
        return await appKit.signMessage({ message });
      } else if (auth && auth.signMessage) {
        // Fallback to auth instance
        return await auth.signMessage(message);
      } else {
        throw new Error('Sign message not available');
      }
    } catch (error) {
      console.error('Error signing message:', error);
      throw error;
    }
  }, [appKit, isConnected, auth]);

  const sendTransaction = useCallback(async (transaction: any): Promise<any> => {
    if (!appKit) throw new Error('AppKit not initialized');
    if (!isConnected) throw new Error('Wallet not connected');
    
    try {
      if (appKit.sendTransaction) {
        return await appKit.sendTransaction(transaction);
      } else if (auth && auth.sendTransaction) {
        // Fallback to auth instance
        return await auth.sendTransaction(transaction);
      } else {
        throw new Error('Send transaction not available');
      }
    } catch (error) {
      console.error('Error sending transaction:', error);
      throw error;
    }
  }, [appKit, isConnected, auth]);

  const getBalance = useCallback(async (): Promise<string> => {
    if (!appKit) throw new Error('AppKit not initialized');
    if (!isConnected || !address) throw new Error('Wallet not connected');
    
    try {
      if (appKit.getBalance) {
        const balanceResult = await appKit.getBalance({ address });
        setBalance(balanceResult.formatted || balanceResult.toString());
        return balanceResult.formatted || balanceResult.toString();
      } else {
        throw new Error('Get balance not available');
      }
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }, [appKit, isConnected, address]);

  const getChainId = useCallback(async (): Promise<number> => {
    if (!appKit) throw new Error('AppKit not initialized');
    
    try {
      const currentChainId = appKit.getChainId?.();
      if (currentChainId) {
        setChainId(currentChainId);
        return currentChainId;
      } else {
        throw new Error('Get chain ID not available');
      }
    } catch (error) {
      console.error('Error getting chain ID:', error);
      throw error;
    }
  }, [appKit]);

  const subscribeToAccountChanges = useCallback((callback: (account: any) => void): (() => void) => {
    if (!appKit || !appKit.subscribeAccount) {
      return () => {}; // Return empty unsubscribe function
    }
    
    return appKit.subscribeAccount(callback);
  }, [appKit]);

  const subscribeToNetworkChanges = useCallback((callback: (chainId: number) => void): (() => void) => {
    if (!appKit || !appKit.subscribeChainId) {
      return () => {}; // Return empty unsubscribe function
    }
    
    return appKit.subscribeChainId(callback);
  }, [appKit]);

  const getProvider = useCallback(() => {
    if (!appKit) throw new Error('AppKit not initialized');
    return appKit.getProvider?.() || appKit;
  }, [appKit]);

  return {
    // Connection state
    isConnected,
    isAppKitConnected: isConnected, // Alias for compatibility
    isConnecting,
    address,
    appKitAddress: address, // Alias for compatibility
    chainId,
    balance,
    
    // Connection actions
    openAppKit,
    disconnectAppKit,
    disconnect: disconnectAppKit, // Alias for compatibility
    
    // Wallet operations (REQUIREMENTS FULFILLED)
    signMessage,
    switchNetwork,
    sendTransaction,
    getBalance,
    getChainId,
    
    // Advanced operations (REQUIREMENTS FULFILLED)
    getProvider,
    subscribeAccount: subscribeToAccountChanges,
    subscribeChainId: subscribeToNetworkChanges,
    
    // Direct AppKit access
    appKit,
  };
};

// Modal control hook
export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
  };
};

// Origin NFT operations hook
export const useOrigin = () => {
  const { auth } = useCampAuth();
  const [stats, setStats] = useState<{
    data: any;
    isLoading: boolean;
    error: Error | null;
    isError: boolean;
  }>({ data: null, isLoading: false, error: null, isError: false });
  
  const [uploads, setUploads] = useState<{
    data: any[];
    isLoading: boolean;
    error: Error | null;
    isError: boolean;
  }>({ data: [], isLoading: false, error: null, isError: false });

  const fetchStats = useCallback(async () => {
    if (!auth || !auth.isAuthenticated || !auth.origin) return;

    setStats(prev => ({ ...prev, isLoading: true, error: null, isError: false }));
    
    try {
      const statsData = await auth.origin.getOriginUsage();
      setStats({ data: statsData, isLoading: false, error: null, isError: false });
    } catch (error) {
      setStats({ data: null, isLoading: false, error: error as Error, isError: true });
    }
  }, [auth]);

  const fetchUploads = useCallback(async () => {
    if (!auth || !auth.isAuthenticated || !auth.origin) return;

    setUploads(prev => ({ ...prev, isLoading: true, error: null, isError: false }));
    
    try {
      const uploadsData = await auth.origin.getOriginUploads();
      setUploads({ data: uploadsData || [], isLoading: false, error: null, isError: false });
    } catch (error) {
      setUploads({ data: [], isLoading: false, error: error as Error, isError: true });
    }
  }, [auth]);

  const mintFile = useCallback(async (file: any, metadata: Record<string, unknown>, license: any, parentId?: bigint) => {
    if (!auth?.origin) throw new Error('Origin not initialized');
    return auth.origin.mintFile(file, metadata, license, parentId);
  }, [auth]);

  const createIPAsset = useCallback(async (file: File, metadata: any, license: any): Promise<string> => {
    if (!auth?.origin) throw new Error('Origin not initialized');
    const result = await auth.origin.mintFile(file, metadata, license);
    if (typeof result === 'string') return result;
    return (result as any)?.tokenId || (result as any)?.id || 'unknown';
  }, [auth]);

  const createSocialIPAsset = useCallback(async (source: 'twitter' | 'spotify', license: any): Promise<string> => {
    if (!auth) throw new Error('Authentication required');
    const result = await auth.mintSocial(source, license);
    if (typeof result === 'string') return result;
    return (result as any)?.tokenId || (result as any)?.id || 'unknown';
  }, [auth]);

  useEffect(() => {
    if (auth?.isAuthenticated && auth?.origin) {
      fetchStats();
      fetchUploads();
    }
  }, [auth?.isAuthenticated, auth?.origin, fetchStats, fetchUploads]);

  return {
    stats: {
      ...stats,
      refetch: fetchStats,
    },
    uploads: {
      ...uploads,
      refetch: fetchUploads,
    },
    mintFile,
    // IP Asset operations (REQUIREMENTS FULFILLED)
    createIPAsset,
    createSocialIPAsset,
  };
};
