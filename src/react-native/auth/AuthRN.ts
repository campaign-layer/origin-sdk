import { APIError } from "../../errors";
import { createSiweMessage } from "viem/siwe";
import constants from "../../constants";
import { Origin } from "../../core/origin";
import { checksumAddress } from "viem";
import { Storage } from "../storage";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const createRedirectUriObject = (
  redirectUri: string | Record<string, string>
): Record<string, string> => {
  const keys = ["twitter", "discord", "spotify"];
  
  if (typeof redirectUri === "object") {
    return keys.reduce((object, key) => {
      object[key] = redirectUri[key] || "app://redirect";
      return object;
    }, {} as Record<string, string>);
  } else if (typeof redirectUri === "string") {
    return keys.reduce((object, key) => {
      object[key] = redirectUri;
      return object;
    }, {} as Record<string, string>);
  } else if (!redirectUri) {
    return keys.reduce((object, key) => {
      object[key] = "app://redirect";
      return object;
    }, {} as Record<string, string>);
  }
  return {};
};

/**
 * The React Native Auth class with AppKit integration.
 * @class
 * @classdesc The Auth class is used to authenticate the user in React Native with AppKit for wallet operations.
 */
class AuthRN {
  redirectUri: Record<string, string>;
  clientId: string;
  isAuthenticated: boolean;
  jwt: string | null;
  walletAddress: string | null;
  userId: string | null;
  viem: any;
  origin: Origin | null;
  #triggers: Record<string, Function[]>;
  #provider: any;
  #appKitInstance: any; // AppKit instance for signing

  /**
   * Constructor for the Auth class.
   * @param {object} options The options object.
   * @param {string} options.clientId The client ID.
   * @param {string|object} options.redirectUri The redirect URI used for oauth. 
   * @param {boolean} [options.allowAnalytics=true] Whether to allow analytics to be sent.
   * @param {any} [options.appKit] AppKit instance for wallet operations.
   * @throws {APIError} - Throws an error if the clientId is not provided.
   */
  constructor({
    clientId,
    redirectUri,
    allowAnalytics = true,
    appKit,
  }: {
    clientId: string;
    redirectUri?: string | Record<string, string>;
    allowAnalytics?: boolean;
    appKit?: any;
  }) {
    if (!clientId) {
      throw new Error("clientId is required");
    }

    this.viem = null;
    this.redirectUri = createRedirectUriObject(redirectUri || "app://redirect");

    this.clientId = clientId;
    this.isAuthenticated = false;
    this.jwt = null;
    this.origin = null;
    this.walletAddress = null;
    this.userId = null;
    this.#triggers = {};
    this.#provider = null;
    this.#appKitInstance = appKit;
    this.#loadAuthStatusFromStorage();
  }

  /**
   * Set AppKit instance for wallet operations.
   * @param {any} appKit AppKit instance.
   */
  setAppKit(appKit: any): void {
    this.#appKitInstance = appKit;
  }

  /**
   * Get AppKit instance for wallet operations.
   * @returns {any} AppKit instance.
   */
  getAppKit(): any {
    return this.#appKitInstance;
  }

  /**
   * Subscribe to an event. Possible events are "state", "provider", "providers", and "viem".
   * @param {("state"|"provider"|"providers"|"viem")} event The event.
   * @param {function} callback The callback function.
   * @returns {void}
   * @example
   * auth.on("state", (state) => {
   *  console.log(state);
   * });
   */
  on(
    event: "state" | "provider" | "providers" | "viem",
    callback: Function
  ): void {
    if (!this.#triggers[event]) {
      this.#triggers[event] = [];
    }
    this.#triggers[event].push(callback);
  }

  /**
   * Trigger an event.
   * @private
   * @param {string} event The event.
   * @param {object | string} data The data to pass to the callback.
   * @returns {void}
   */
  #trigger(event: string, data: object | string): void {
    if (this.#triggers[event]) {
      this.#triggers[event].forEach((callback) => callback(data));
    }
  }

  /**
   * Set the loading state.
   * @param {boolean} loading The loading state.
   * @returns {void}
   */
  setLoading(loading: boolean): void {
    this.#trigger(
      "state",
      loading
        ? "loading"
        : this.isAuthenticated
        ? "authenticated"
        : "unauthenticated"
    );
  }

  /**
   * Set the provider. This is useful for setting the provider when the user selects a provider from the UI.
   * @param {object} options The options object. Includes the provider and the provider info.
   * @returns {void}
   * @throws {APIError} - Throws an error if the provider is not provided.
   */
  setProvider({
    provider,
    info,
    address,
  }: {
    provider: any;
    info: any;
    address?: string;
  }): void {
    if (!provider) {
      throw new APIError("provider is required");
    }
    this.#provider = provider;
    this.viem = provider; // In React Native, we use the provider directly
    if (this.origin) {
      this.origin.setViemClient(this.viem);
    }
    this.#trigger("viem", this.viem);
    this.#trigger("provider", { provider, info });
  }

  /**
   * Set the wallet address.
   * @param {string} walletAddress The wallet address.
   * @returns {void}
   */
  setWalletAddress(walletAddress: string): void {
    this.walletAddress = walletAddress;
  }

  /**
   * Load the authentication status from storage.
   * @private
   * @param {any} [provider] Optional provider to use for reinitializing viem.
   * @returns {void}
   */
  async #loadAuthStatusFromStorage(provider?: any): Promise<void> {
    try {
      const [walletAddress, userId, jwt] = await Promise.all([
        Storage.getItem("camp-sdk:wallet-address"),
        Storage.getItem("camp-sdk:user-id"),
        Storage.getItem("camp-sdk:jwt")
      ]);

      if (walletAddress && userId && jwt) {
        this.walletAddress = walletAddress;
        this.userId = userId;
        this.jwt = jwt;
        this.origin = new Origin(this.jwt);
        this.isAuthenticated = true;

        if (provider) {
          this.setProvider({
            provider: provider.provider,
            info: provider.info || { name: "Unknown" },
            address: walletAddress,
          });
        }
      } else {
        this.isAuthenticated = false;
      }
    } catch (error) {
      console.error('Error loading auth status from storage:', error);
      this.isAuthenticated = false;
    }
  }

  /**
   * Request the user to connect their wallet using AppKit.
   * @private
   * @returns {Promise<string>} A promise that resolves with the wallet address.
   * @throws {APIError} - Throws an error if the user does not connect their wallet.
   */
  async #requestAccount(): Promise<string> {
    try {
      if (this.#appKitInstance) {
        // Use AppKit for wallet connection
        await this.#appKitInstance.openAppKit();
        
        // Wait for connection and get address
        const state = this.#appKitInstance.getState?.() || {};
        if (state.address) {
          this.walletAddress = checksumAddress(state.address);
          return this.walletAddress;
        }
        throw new APIError("No address returned from AppKit");
      }
      
      // Fallback to direct provider if available
      if (!this.#provider) {
        throw new APIError("No AppKit instance or provider available");
      }
      
      const accounts = await this.#provider.request({
        method: "eth_requestAccounts",
      });
      
      if (!accounts || accounts.length === 0) {
        throw new APIError("No accounts found");
      }
      
      this.walletAddress = checksumAddress(accounts[0]);
      return this.walletAddress as string;
    } catch (e: any) {
      throw new APIError(e.message || "Failed to connect wallet");
    }
  }

  /**
   * Sign a message using AppKit or provider.
   * @private
   * @param {string} message The message to sign.
   * @returns {Promise<string>} The signature.
   * @throws {APIError} - Throws an error if signing fails.
   */
  async #signMessage(message: string): Promise<string> {
    try {
      if (this.#appKitInstance && this.#appKitInstance.signMessage) {
        // Use AppKit for signing
        return await this.#appKitInstance.signMessage(message);
      }
      
      // Fallback to direct provider signing
      if (!this.#provider) {
        throw new APIError("No signing method available");
      }
      
      return await this.#provider.request({
        method: "personal_sign",
        params: [message, this.walletAddress],
      });
    } catch (e: any) {
      throw new APIError(e.message || "Failed to sign message");
    }
  }

  /**
   * Fetch the nonce from the server.
   * @private
   * @returns {Promise<string>} A promise that resolves with the nonce.
   * @throws {APIError} - Throws an error if the nonce cannot be fetched.
   */
  async #fetchNonce(): Promise<string> {
    try {
      const res = await fetch(
        `${constants.AUTH_HUB_BASE_API}/auth/client-user/nonce`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-client-id": this.clientId,
          },
          body: JSON.stringify({ walletAddress: this.walletAddress }),
        }
      );
      const data = await res.json();
      if (res.status !== 200) {
        return Promise.reject(data.message || "Failed to fetch nonce");
      }
      return data.data;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  /**
   * Verify the signature.
   * @private
   * @param {string} message The message.
   * @param {string} signature The signature.
   * @returns {Promise<{ success: boolean; userId: string; token: string }>} A promise that resolves with the verification result.
   * @throws {APIError} - Throws an error if the signature cannot be verified.
   */
  async #verifySignature(
    message: string,
    signature: string
  ): Promise<{ success: boolean; userId: string; token: string }> {
    try {
      const res = await fetch(
        `${constants.AUTH_HUB_BASE_API}/auth/client-user/verify`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-client-id": this.clientId,
          },
          body: JSON.stringify({
            message,
            signature,
            walletAddress: this.walletAddress,
          }),
        }
      );
      const data = await res.json();
      const payload = data.data.split(".")[1];
      const decoded = JSON.parse(atob(payload));
      return {
        success: !data.isError,
        userId: decoded.id,
        token: data.data,
      };
    } catch (e: any) {
      throw new APIError(e);
    }
  }

  /**
   * Create the SIWE message.
   * @private
   * @param {string} nonce The nonce.
   * @returns {string} The EIP-4361 formatted message.
   */
  #createMessage(nonce: string): string {
    return createSiweMessage({
      domain: "mobile.app", // React Native doesn't have window.location
      address: this.walletAddress as any,
      statement: constants.SIWE_MESSAGE_STATEMENT,
      uri: "app://",
      version: "1",
      chainId: this.#provider?.chainId || 1, // Default to mainnet if not available
      nonce: nonce,
    });
  }

  /**
   * Disconnect the user and clear AppKit connection.
   * @returns {Promise<void>}
   */
  async disconnect(): Promise<void> {
    if (!this.isAuthenticated) {
      return;
    }
    this.#trigger("state", "unauthenticated");
    this.isAuthenticated = false;
    this.walletAddress = null;
    this.userId = null;
    this.jwt = null;
    this.origin = null;
    this.viem = null;
    this.#provider = null;
    
    // Disconnect AppKit if available
    if (this.#appKitInstance && this.#appKitInstance.disconnect) {
      try {
        await this.#appKitInstance.disconnect();
      } catch (error) {
        console.error('Error disconnecting AppKit:', error);
      }
    }
    
    try {
      await Storage.multiRemove([
        "camp-sdk:wallet-address",
        "camp-sdk:user-id",
        "camp-sdk:jwt"
      ]);
    } catch (error) {
      console.error('Error removing auth data from storage:', error);
    }
  }

  /**
   * Connect the user's wallet and authenticate using AppKit.
   * @returns {Promise<{ success: boolean; message: string; walletAddress: string }>} A promise that resolves with the authentication result.
   * @throws {APIError} - Throws an error if the user cannot be authenticated.
   */
  async connect(): Promise<{
    success: boolean;
    message: string;
    walletAddress: string;
  }> {
    this.#trigger("state", "loading");
    try {
      if (!this.walletAddress) {
        await this.#requestAccount();
      }
      
      this.walletAddress = checksumAddress(this.walletAddress as `0x${string}`);
      
      // Create SIWE message
      const message = createSiweMessage({
        domain: "camp.org",
        address: this.walletAddress as `0x${string}`,
        statement: "Sign in with Ethereum to Camp",
        uri: "https://camp.org",
        version: "1",
        chainId: 1,
        nonce: Math.random().toString(36).substring(2, 15),
        issuedAt: new Date(),
      });
      
      // Sign message using AppKit or provider
      const signature = await this.#signMessage(message);
      
      // Authenticate with the server
      const response = await fetch(
        `${constants.AUTH_HUB_BASE_API}/auth/wallet/connect`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-camp-client-id": this.clientId,
          },
          body: JSON.stringify({
            signature: signature,
            message: message,
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error("Authentication failed");
      }
      
      const data = await response.json();
      
      if (data.status !== "success") {
        throw new APIError(data.message || "Authentication failed");
      }
      
      // Store the authentication data
      this.jwt = data.data.jwt;
      this.userId = data.data.user.id;
      this.isAuthenticated = true;
      this.origin = new Origin(this.jwt!);
      
      // Set viem client if available
      if (this.viem) {
        this.origin.setViemClient(this.viem);
      }
      
      // Save to storage
      try {
        await Storage.multiSet([
          ["camp-sdk:jwt", this.jwt!],
          ["camp-sdk:wallet-address", this.walletAddress as string],
          ["camp-sdk:user-id", this.userId!],
        ]);
      } catch (error) {
        console.error('Error saving auth data to storage:', error);
      }
      
      this.#trigger("state", "authenticated");
      return {
        success: true,
        message: "Successfully authenticated",
        walletAddress: this.walletAddress as string,
      };
      
    } catch (e: any) {
      this.isAuthenticated = false;
      this.#trigger("state", "unauthenticated");
      throw new APIError(e.message || "Authentication failed");
    }
  }

  /**
   * Get the user's linked social accounts.
   * @returns {Promise<Record<string, boolean>>} A promise that resolves with the user's linked social accounts.
   * @throws {Error|APIError} - Throws an error if the user is not authenticated or if the request fails.
   */
  async getLinkedSocials(): Promise<Record<string, boolean>> {
    if (!this.isAuthenticated)
      throw new Error("User needs to be authenticated");
    const connections = await fetch(
      `${constants.AUTH_HUB_BASE_API}/auth/client-user/connections-sdk`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "x-client-id": this.clientId,
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res.json());
    if (!connections.isError) {
      const socials: Record<string, boolean> = {};
      Object.keys(connections.data.data).forEach((key) => {
        socials[key.split("User")[0]] = connections.data.data[key];
      });
      return socials;
    } else {
      throw new APIError(connections.message || "Failed to fetch connections");
    }
  }

  // Social linking methods remain the same as web version
  // but with mobile-appropriate redirect handling
  async linkTwitter(): Promise<void> {
    if (!this.isAuthenticated) {
      throw new Error("User needs to be authenticated");
    }
    // In React Native, we'd open this URL in a browser or WebView
    const url = `${constants.AUTH_HUB_BASE_API}/twitter/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri["twitter"]}`;
    // This would be handled by the React Native app using Linking or a WebView
    throw new Error("Social linking should be handled by the React Native app using a WebView or Linking API");
  }

  async linkDiscord(): Promise<void> {
    if (!this.isAuthenticated) {
      throw new Error("User needs to be authenticated");
    }
    const url = `${constants.AUTH_HUB_BASE_API}/discord/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri["discord"]}`;
    throw new Error("Social linking should be handled by the React Native app using a WebView or Linking API");
  }

  async linkSpotify(): Promise<void> {
    if (!this.isAuthenticated) {
      throw new Error("User needs to be authenticated");
    }
    const url = `${constants.AUTH_HUB_BASE_API}/spotify/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri["spotify"]}`;
    throw new Error("Social linking should be handled by the React Native app using a WebView or Linking API");
  }

  async linkTikTok(handle: string): Promise<any> {
    if (!this.isAuthenticated) {
      throw new Error("User needs to be authenticated");
    }
    const data = await fetch(
      `${constants.AUTH_HUB_BASE_API}/tiktok/connect-sdk`,
      {
        method: "POST",
        redirect: "follow",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "x-client-id": this.clientId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userHandle: handle,
          clientId: this.clientId,
          userId: this.userId,
        }),
      }
    ).then((res) => res.json());

    if (!data.isError) {
      return data.data;
    } else {
      if (data.message === "Request failed with status code 502") {
        throw new APIError(
          "TikTok service is currently unavailable, try again later"
        );
      } else {
        throw new APIError(data.message || "Failed to link TikTok account");
      }
    }
  }

  // Add all other social linking/unlinking methods...
  // (keeping them similar to the web version but with mobile considerations)

  async sendTelegramOTP(phoneNumber: string): Promise<any> {
    if (!this.isAuthenticated)
      throw new Error("User needs to be authenticated");
    if (!phoneNumber) throw new APIError("Phone number is required");
    await this.unlinkTelegram();
    const data = await fetch(
      `${constants.AUTH_HUB_BASE_API}/telegram/sendOTP-sdk`,
      {
        method: "POST",
        redirect: "follow",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "x-client-id": this.clientId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
        }),
      }
    ).then((res) => res.json());

    if (!data.isError) {
      return data.data;
    } else {
      throw new APIError(data.message || "Failed to send Telegram OTP");
    }
  }

  async linkTelegram(
    phoneNumber: string,
    otp: string,
    phoneCodeHash: string
  ): Promise<any> {
    if (!this.isAuthenticated)
      throw new Error("User needs to be authenticated");
    if (!phoneNumber || !otp || !phoneCodeHash)
      throw new APIError("Phone number, OTP, and phone code hash are required");
    const data = await fetch(
      `${constants.AUTH_HUB_BASE_API}/telegram/signIn-sdk`,
      {
        method: "POST",
        redirect: "follow",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "x-client-id": this.clientId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: phoneNumber,
          code: otp,
          phone_code_hash: phoneCodeHash,
          userId: this.userId,
          clientId: this.clientId,
        }),
      }
    ).then((res) => res.json());

    if (!data.isError) {
      return data.data;
    } else {
      throw new APIError(data.message || "Failed to link Telegram account");
    }
  }

  // Unlink methods
  async unlinkTwitter(): Promise<any> {
    if (!this.isAuthenticated) {
      throw new Error("User needs to be authenticated");
    }
    const data = await fetch(
      `${constants.AUTH_HUB_BASE_API}/twitter/disconnect-sdk`,
      {
        method: "POST",
        redirect: "follow",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "x-client-id": this.clientId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: this.userId,
        }),
      }
    ).then((res) => res.json());
    if (!data.isError) {
      return data.data;
    } else {
      throw new APIError(data.message || "Failed to unlink Twitter account");
    }
  }

  async unlinkDiscord(): Promise<any> {
    if (!this.isAuthenticated) {
      throw new APIError("User needs to be authenticated");
    }
    const data = await fetch(
      `${constants.AUTH_HUB_BASE_API}/discord/disconnect-sdk`,
      {
        method: "POST",
        redirect: "follow",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "x-client-id": this.clientId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: this.userId,
        }),
      }
    ).then((res) => res.json());
    if (!data.isError) {
      return data.data;
    } else {
      throw new APIError(data.message || "Failed to unlink Discord account");
    }
  }

  async unlinkSpotify(): Promise<any> {
    if (!this.isAuthenticated) {
      throw new APIError("User needs to be authenticated");
    }
    const data = await fetch(
      `${constants.AUTH_HUB_BASE_API}/spotify/disconnect-sdk`,
      {
        method: "POST",
        redirect: "follow",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "x-client-id": this.clientId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: this.userId,
        }),
      }
    ).then((res) => res.json());
    if (!data.isError) {
      return data.data;
    } else {
      throw new APIError(data.message || "Failed to unlink Spotify account");
    }
  }

  async unlinkTikTok(): Promise<any> {
    if (!this.isAuthenticated) {
      throw new APIError("User needs to be authenticated");
    }
    const data = await fetch(
      `${constants.AUTH_HUB_BASE_API}/tiktok/disconnect-sdk`,
      {
        method: "POST",
        redirect: "follow",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "x-client-id": this.clientId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: this.userId,
        }),
      }
    ).then((res) => res.json());

    if (!data.isError) {
      return data.data;
    } else {
      throw new APIError(data.message || "Failed to unlink TikTok account");
    }
  }

  async unlinkTelegram(): Promise<any> {
    if (!this.isAuthenticated) {
      throw new APIError("User needs to be authenticated");
    }
    const data = await fetch(
      `${constants.AUTH_HUB_BASE_API}/telegram/disconnect-sdk`,
      {
        method: "POST",
        redirect: "follow",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "x-client-id": this.clientId,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: this.userId,
        }),
      }
    ).then((res) => res.json());

    if (!data.isError) {
      return data.data;
    } else {
      throw new APIError(data.message || "Failed to unlink Telegram account");
    }
  }

  /**
   * Generic method to link social accounts
   */
  async linkSocial(provider: 'twitter' | 'discord' | 'spotify'): Promise<void> {
    switch (provider) {
      case 'twitter':
        return this.linkTwitter();
      case 'discord':
        return this.linkDiscord();
      case 'spotify':
        return this.linkSpotify();
      default:
        throw new Error(`Unsupported social provider: ${provider}`);
    }
  }

  /**
   * Generic method to unlink social accounts
   */
  async unlinkSocial(provider: 'twitter' | 'discord' | 'spotify'): Promise<any> {
    switch (provider) {
      case 'twitter':
        return this.unlinkTwitter();
      case 'discord':
        return this.unlinkDiscord();
      case 'spotify':
        return this.unlinkSpotify();
      default:
        throw new Error(`Unsupported social provider: ${provider}`);
    }
  }

  /**
   * Mint social NFT (placeholder implementation)
   */
  async mintSocial(provider: string, data: any): Promise<any> {
    if (!this.isAuthenticated) {
      throw new APIError("User needs to be authenticated");
    }
    
    // This is a placeholder implementation
    // You would replace this with actual minting logic
    throw new Error("mintSocial is not yet implemented");
  }

  /**
   * Sign a message using the connected wallet
   */
  async signMessage(message: string): Promise<string> {
    if (!this.isAuthenticated) {
      throw new APIError("User needs to be authenticated");
    }

    const appKit = this.getAppKit();
    if (!appKit) {
      throw new APIError("AppKit not initialized");
    }

    try {
      if (appKit.signMessage) {
        return await appKit.signMessage({ message });
      } else {
        throw new Error("Sign message not available on AppKit instance");
      }
    } catch (error: any) {
      throw new APIError(`Failed to sign message: ${error.message}`);
    }
  }

  /**
   * Send a transaction using the connected wallet
   */
  async sendTransaction(transaction: any): Promise<any> {
    if (!this.isAuthenticated) {
      throw new APIError("User needs to be authenticated");
    }

    const appKit = this.getAppKit();
    if (!appKit) {
      throw new APIError("AppKit not initialized");
    }

    try {
      if (appKit.sendTransaction) {
        return await appKit.sendTransaction(transaction);
      } else {
        throw new Error("Send transaction not available on AppKit instance");
      }
    } catch (error: any) {
      throw new APIError(`Failed to send transaction: ${error.message}`);
    }
  }
}

export { AuthRN };
