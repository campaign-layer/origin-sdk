import { APIError } from "../../errors";
import { getClient, getPublicClient } from "./viem/client";
import { createSiweMessage } from "viem/siwe";
import constants from "../../constants";
import { Provider, providerStore } from "./viem/providers";
// import { Ackee } from "../../index";
// import { sendAnalyticsEvent } from "../../utils";
import { Origin } from "../origin";
import { checksumAddress } from "viem";

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
      object[key] =
        redirectUri[key] ||
        (typeof window !== "undefined" ? window.location.href : "");
      return object;
    }, {} as Record<string, string>);
  } else if (typeof redirectUri === "string") {
    return keys.reduce((object, key) => {
      object[key] = redirectUri;
      return object;
    }, {} as Record<string, string>);
  } else if (!redirectUri) {
    return keys.reduce((object, key) => {
      object[key] = typeof window !== "undefined" ? window.location.href : "";
      return object;
    }, {} as Record<string, string>);
  }
  return {};
};

/**
 * The Auth class.
 * @class
 * @classdesc The Auth class is used to authenticate the user.
 */
class Auth {
  redirectUri: Record<string, string>;
  clientId: string;
  isAuthenticated: boolean;
  jwt: string | null;
  walletAddress: string | null;
  userId: string | null;
  viem: any;
  origin: Origin | null;
  #triggers: Record<string, Function[]>;
  #ackeeInstance: any;

  /**
   * Constructor for the Auth class.
   * @param {object} options The options object.
   * @param {string} options.clientId The client ID.
   * @param {string|object} options.redirectUri The redirect URI used for oauth. Leave empty if you want to use the current URL. If you want different redirect URIs for different socials, pass an object with the socials as keys and the redirect URIs as values.
   * @param {boolean} [options.allowAnalytics=true] Whether to allow analytics to be sent.
   * @param {object} [options.ackeeInstance] The Ackee instance.
   * @throws {APIError} - Throws an error if the clientId is not provided.
   */
  constructor({
    clientId,
    redirectUri,
    allowAnalytics = true,
    ackeeInstance,
  }: {
    clientId: string;
    redirectUri: string | Record<string, string>;
    allowAnalytics?: boolean;
    ackeeInstance?: any;
  }) {
    if (!clientId) {
      throw new Error("clientId is required");
    }

    this.viem = null;

    // if (typeof window !== "undefined") {
    //   if (window.ethereum) this.viem = getClient(window.ethereum);
    // }
    this.redirectUri = createRedirectUriObject(redirectUri);

    if (ackeeInstance) this.#ackeeInstance = ackeeInstance;
    if (
      allowAnalytics &&
      !this.#ackeeInstance &&
      typeof window !== "undefined"
    ) {
      // this.#ackeeInstance = Ackee.create(constants.ACKEE_INSTANCE, {
      //   detailed: false,
      //   ignoreLocalhost: true,
      //   ignoreOwnVisits: false,
      // });
    }

    this.clientId = clientId;
    this.isAuthenticated = false;
    this.jwt = null;
    this.origin = null;
    this.walletAddress = null;
    this.userId = null;
    this.#triggers = {};
    providerStore.subscribe((providers: Provider[]) => {
      this.#trigger("providers", providers);
    });
    this.#loadAuthStatusFromStorage();
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
    if (event === "providers") {
      callback(providerStore.value());
    }
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
   * Set the provider. This is useful for setting the provider when the user selects a provider from the UI or when dApp wishes to use a specific provider.
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
    this.viem = getClient(provider, info.name, address);
    if (this.origin) {
      this.origin.setViemClient(this.viem);
    }
    // TODO: only use one of these
    this.#trigger("viem", this.viem);
    this.#trigger("provider", { provider, info });
  }

  /**
   * Set the wallet address. This is useful for edge cases where the provider can't return the wallet address. Don't use this unless you know what you're doing.
   * @param {string} walletAddress The wallet address.
   * @returns {void}
   */
  setWalletAddress(walletAddress: string): void {
    this.walletAddress = walletAddress;
  }

  async recoverProvider(): Promise<void> {
    if (!this.walletAddress) {
      console.warn(
        "No wallet address found in local storage. Please connect your wallet again."
      );
      return;
    }
    let provider: Provider | undefined;
    const providers = providerStore.value() ?? [];
    for (const p of providers) {
      try {
        const accounts = await p.provider.request({
          method: "eth_requestAccounts",
        });
        if (accounts[0]?.toLowerCase() === this.walletAddress?.toLowerCase()) {
          provider = p;
          break;
        }
      } catch (err) {
        console.warn("Failed to fetch accounts from provider:", err);
      }
    }

    if (provider) {
      this.setProvider({
        provider: provider.provider,
        info: provider.info || {
          name: "Unknown",
        },
        address: this.walletAddress,
      });
    } else {
      console.warn(
        "No matching provider found for the stored wallet address. Please connect your wallet again."
      );
    }
  }

  /**
   * Load the authentication status from local storage.
   * @private
   * @param {any} [provider] Optional provider to use for reinitializing viem.
   * @returns {void}
   */
  async #loadAuthStatusFromStorage(provider?: any): Promise<void> {
    if (typeof localStorage === "undefined") {
      return;
    }

    const walletAddress = localStorage?.getItem("camp-sdk:wallet-address");
    const userId = localStorage?.getItem("camp-sdk:user-id");
    const jwt = localStorage?.getItem("camp-sdk:jwt");

    if (walletAddress && userId && jwt) {
      this.walletAddress = walletAddress;
      this.userId = userId;
      this.jwt = jwt;
      this.origin = new Origin(this.jwt);
      this.isAuthenticated = true;

      /*
      let selectedProvider = provider;

      if (!selectedProvider) {
        const providers = providerStore.value() ?? [];
        for (const p of providers) {
          try {
            const accounts = await p.provider.request({
              method: "eth_requestAccounts",
            });
            if (accounts[0]?.toLowerCase() === walletAddress.toLowerCase()) {
              selectedProvider = p;
              break;
            }
          } catch (err) {
            console.warn("Failed to fetch accounts from provider:", err);
          }
        }
      }
        */

      if (provider) {
        this.setProvider({
          provider: provider.provider,
          info: provider.info || {
            name: "Unknown",
          },
          address: walletAddress,
        });
      } else {
        // console.warn(
        //   "No matching provider was given for the stored wallet address. Trying to recover provider."
        // );
        // await this.recoverProvider();
        // TODO: do this but less aggressively (check provider info instead of addresses)
      }
    } else {
      this.isAuthenticated = false;
    }
  }

  /**
   * Request the user to connect their wallet.
   * @private
   * @returns {Promise<string>} A promise that resolves with the wallet address.
   * @throws {APIError} - Throws an error if the user does not connect their wallet.
   */
  async #requestAccount(): Promise<string> {
    try {
      const [account] = await this.viem.requestAddresses();
      this.walletAddress = checksumAddress(account);
      return this.walletAddress;
    } catch (e: any) {
      throw new APIError(e);
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
      domain: window.location.host,
      address: this.walletAddress as any,
      statement: constants.SIWE_MESSAGE_STATEMENT,
      uri: window.location.origin,
      version: "1",
      chainId: this.viem.chain.id,
      nonce: nonce,
    });
  }

  /**
   * Send an analytics event.
   * @private
   * @param {string} event The event name.
   * @param {string} message The event message.
   * @param {number} [count=1] The event count.
   * @returns {Promise<void>}
   */
  async #sendAnalyticsEvent(
    event: string,
    message: string,
    count: number = 1
  ): Promise<void> {
    // if (this.#ackeeInstance)
    //   await sendAnalyticsEvent(this.#ackeeInstance, event, message, count);
    // else return;
  }

  /**
   * Disconnect the user.
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
    localStorage.removeItem("camp-sdk:wallet-address");
    localStorage.removeItem("camp-sdk:user-id");
    localStorage.removeItem("camp-sdk:jwt");
    // await this.#sendAnalyticsEvent(
    //   constants.ACKEE_EVENTS.USER_DISCONNECTED,
    //   "User Disconnected"
    // );
  }

  /**
   * Connect the user's wallet and sign the message.
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
      const nonce = await this.#fetchNonce();
      const message = this.#createMessage(nonce);
      const signature = await this.viem.signMessage({
        account: this.walletAddress,
        message: message,
      });
      const res = await this.#verifySignature(message, signature);
      if (res.success) {
        this.isAuthenticated = true;
        this.userId = res.userId;
        this.jwt = res.token;
        this.origin = new Origin(this.jwt, this.viem);
        localStorage.setItem("camp-sdk:jwt", this.jwt);
        localStorage.setItem(
          "camp-sdk:wallet-address",
          this.walletAddress as string
        );
        localStorage.setItem("camp-sdk:user-id", this.userId);
        this.#trigger("state", "authenticated");
        await this.#sendAnalyticsEvent(
          constants.ACKEE_EVENTS.USER_CONNECTED,
          "User Connected"
        );
        return {
          success: true,
          message: "Successfully authenticated",
          walletAddress: this.walletAddress as string,
        };
      } else {
        this.isAuthenticated = false;
        this.#trigger("state", "unauthenticated");
        throw new APIError("Failed to authenticate");
      }
    } catch (e: any) {
      this.isAuthenticated = false;
      this.#trigger("state", "unauthenticated");
      throw new APIError(e);
    }
  }

  /**
   * Get the user's linked social accounts.
   * @returns {Promise<Record<string, boolean>>} A promise that resolves with the user's linked social accounts.
   * @throws {Error|APIError} - Throws an error if the user is not authenticated or if the request fails.
   * @example
   * const auth = new Auth({ clientId: "your-client-id" });
   * const socials = await auth.getLinkedSocials();
   * console.log(socials);
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

  /**
   * Link the user's Twitter account.
   * @returns {Promise<void>}
   * @throws {Error} - Throws an error if the user is not authenticated.
   */
  async linkTwitter(): Promise<void> {
    if (!this.isAuthenticated) {
      throw new Error("User needs to be authenticated");
    }
    // await this.#sendAnalyticsEvent(
    //   constants.ACKEE_EVENTS.TWITTER_LINKED,
    //   "Twitter Linked"
    // );
    window.location.href = `${constants.AUTH_HUB_BASE_API}/twitter/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri["twitter"]}`;
  }

  /**
   * Link the user's Discord account.
   * @returns {Promise<void>}
   * @throws {Error} - Throws an error if the user is not authenticated.
   */
  async linkDiscord(): Promise<void> {
    if (!this.isAuthenticated) {
      throw new Error("User needs to be authenticated");
    }
    // await this.#sendAnalyticsEvent(
    //   constants.ACKEE_EVENTS.DISCORD_LINKED,
    //   "Discord Linked"
    // );
    window.location.href = `${constants.AUTH_HUB_BASE_API}/discord/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri["discord"]}`;
  }

  /**
   * Link the user's Spotify account.
   * @returns {Promise<void>}
   * @throws {Error} - Throws an error if the user is not authenticated.
   */
  async linkSpotify(): Promise<void> {
    if (!this.isAuthenticated) {
      throw new Error("User needs to be authenticated");
    }
    // await this.#sendAnalyticsEvent(
    //   constants.ACKEE_EVENTS.SPOTIFY_LINKED,
    //   "Spotify Linked"
    // );
    window.location.href = `${constants.AUTH_HUB_BASE_API}/spotify/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri["spotify"]}`;
  }

  /**
   * Link the user's TikTok account.
   * @param {string} handle The user's TikTok handle.
   * @returns {Promise<any>} A promise that resolves with the TikTok account data.
   * @throws {Error|APIError} - Throws an error if the user is not authenticated.
   */
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
      this.#sendAnalyticsEvent(
        constants.ACKEE_EVENTS.TIKTOK_LINKED,
        "TikTok Linked"
      );
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

  /**
   * Send an OTP to the user's Telegram account.
   * @param {string} phoneNumber The user's phone number.
   * @returns {Promise<any>} A promise that resolves with the OTP data.
   * @throws {Error|APIError} - Throws an error if the user is not authenticated.
   */
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

  /**
   * Link the user's Telegram account.
   * @param {string} phoneNumber The user's phone number.
   * @param {string} otp The OTP.
   * @param {string} phoneCodeHash The phone code hash.
   * @returns {Promise<object>} A promise that resolves with the Telegram account data.
   * @throws {APIError|Error} - Throws an error if the user is not authenticated. Also throws an error if the phone number, OTP, and phone code hash are not provided.
   */
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
      this.#sendAnalyticsEvent(
        constants.ACKEE_EVENTS.TELEGRAM_LINKED,
        "Telegram Linked"
      );
      return data.data;
    } else {
      throw new APIError(data.message || "Failed to link Telegram account");
    }
  }

  /**
   * Unlink the user's Twitter account.
   * @returns {Promise<any>} A promise that resolves with the unlink result.
   * @throws {Error} - Throws an error if the user is not authenticated.
   * @throws {APIError} - Throws an error if the request fails.
   */
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

  /**
   * Unlink the user's Discord account.
   * @returns {Promise<any>} A promise that resolves with the unlink result.
   * @throws {Error} - Throws an error if the user is not authenticated.
   * @throws {APIError} - Throws an error if the request fails.
   */
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

  /**
   * Unlink the user's Spotify account.
   * @returns {Promise<any>} A promise that resolves with the unlink result.
   * @throws {Error} - Throws an error if the user is not authenticated.
   * @throws {APIError} - Throws an error if the request fails.
   */
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

  /**
   * Unlink the user's TikTok account.
   * @returns {Promise<any>} A promise that resolves with the unlink result.
   * @throws {Error} - Throws an error if the user is not authenticated.
   * @throws {APIError} - Throws an error if the request fails.
   */
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

  /**
   * Unlink the user's Telegram account.
   * @returns {Promise<any>} A promise that resolves with the unlink result.
   * @throws {Error} - Throws an error if the user is not authenticated.
   * @throws {APIError} - Throws an error if the request fails.
   */
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
}

export { Auth };
