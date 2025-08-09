/**
 * Hook to get the Auth instance
 */
export declare const useAuth: () => import("./AuthRN").AuthRN | null;
/**
 * Hook to get auth state
 */
export declare const useAuthState: () => {
    authenticated: boolean;
    loading: boolean;
    error: null;
    walletAddress: string | null;
    user: string | null;
};
/**
 * Hook for connecting wallet
 */
export declare const useConnect: () => {
    connect: () => Promise<{
        success: boolean;
        message: string;
        walletAddress: string;
    }> | undefined;
    disconnect: () => Promise<void> | undefined;
};
/**
 * Placeholder hooks - to be implemented
 */
export declare const useProvider: () => null;
export declare const useProviders: () => never[];
export declare const useSocials: () => {
    twitter: boolean;
    discord: boolean;
    spotify: boolean;
    tiktok: boolean;
    telegram: boolean;
};
export declare const useLinkSocials: () => {
    linkTwitter: () => Promise<void> | undefined;
    linkDiscord: () => Promise<void> | undefined;
    linkSpotify: () => Promise<void> | undefined;
    linkTikTok: (config: any) => Promise<any> | undefined;
    linkTelegram: (config: any) => Promise<any> | undefined;
};
export declare const useLinkModal: () => {
    open: () => void;
    close: () => void;
    isOpen: boolean;
};
export declare const useOrigin: () => {
    uploads: {
        data: never[];
        isLoading: boolean;
        refetch: () => void;
    };
    stats: {
        data: null;
        isLoading: boolean;
    };
    origin: import("..").Origin | null;
};
