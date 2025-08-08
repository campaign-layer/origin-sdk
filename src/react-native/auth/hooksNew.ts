import { useContext } from "react";
import { CampContext } from "../context/CampContext";

/**
 * Hook to get the Auth instance
 */
export const useAuth = () => {
  const { auth } = useContext(CampContext);
  return auth;
};

/**
 * Hook to get auth state
 */
export const useAuthState = () => {
  const { auth } = useContext(CampContext);
  
  return {
    authenticated: auth?.isAuthenticated || false,
    loading: false, // TODO: implement proper loading state
    error: null,
    walletAddress: auth?.walletAddress || null,
    user: auth?.userId || null,
  };
};

/**
 * Hook for connecting wallet
 */
export const useConnect = () => {
  const auth = useAuth();
  
  return {
    connect: () => auth?.connect(),
    disconnect: () => auth?.disconnect?.(),
  };
};

/**
 * Placeholder hooks - to be implemented
 */
export const useProvider = () => {
  return null;
};

export const useProviders = () => {
  return [];
};

export const useSocials = () => {
  const auth = useAuth();
  return {
    twitter: false, // TODO: implement proper socials tracking
    discord: false,
    spotify: false,
    tiktok: false,
    telegram: false,
  };
};

export const useLinkSocials = () => {
  const auth = useAuth();
  return {
    linkTwitter: () => auth?.linkTwitter?.(),
    linkDiscord: () => auth?.linkDiscord?.(),
    linkSpotify: () => auth?.linkSpotify?.(),
    linkTikTok: (config: any) => auth?.linkTikTok?.(config),
    linkTelegram: (config: any) => auth?.linkTelegram?.(config, "", ""),
  };
};

export const useLinkModal = () => {
  return {
    open: () => console.log("Link modal not implemented"),
    close: () => console.log("Link modal not implemented"),
    isOpen: false,
  };
};

export const useOrigin = () => {
  const auth = useAuth();
  return {
    uploads: { data: [], isLoading: false, refetch: () => {} },
    stats: { data: null, isLoading: false },
    origin: auth?.origin || null,
  };
};
