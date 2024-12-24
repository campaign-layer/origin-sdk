import { APIError } from "../errors";
import { getClient } from "./viem/client";
import { createSiweMessage } from "viem/siwe";
import constants from "../constants";
import { providerStore } from "./viem/providers";

const createRedirectUriObject = (redirectUri) => {
  const keys = ["twitter", "discord", "spotify"];

  if (typeof redirectUri === "object") {
    return keys.reduce((object, key) => {
      object[key] =
        redirectUri[key] ||
        (typeof window !== "undefined" ? window.location.href : "");
      return object;
    }, {});
  } else if (typeof redirectUri === "string") {
    return keys.reduce((object, key) => {
      object[key] = redirectUri;
      return object;
    }, {});
  } else if (!redirectUri) {
    return keys.reduce((object, key) => {
      object[key] = typeof window !== "undefined" ? window.location.href : "";
      return object;
    }, {});
  }
};

/**
 * The Auth class.
 * @class
 * @classdesc The Auth class is used to authenticate the user.
 */
class Auth {
  /**
   * Constructor for the Auth class.
   * @param {object} options The options object.
   * @param {string} options.clientId The client ID.
   * @param {string|object} options.redirectUri The redirect URI used for oauth. Leave empty if you want to use the current URL. If you want different redirect URIs for different socials, pass an object with the socials as keys and the redirect URIs as values.
   * @throws {APIError} - Throws an error if the clientId is not provided.
   */
  #triggers;
  constructor({ clientId, redirectUri }) {
    if (!clientId) {
      throw new Error("clientId is required");
    }

    this.viem = null;

    if (typeof window !== "undefined") {
      if (window.ethereum) this.viem = getClient(window.ethereum);
    }
    this.redirectUri = createRedirectUriObject(redirectUri);

    this.clientId = clientId;
    this.isAuthenticated = false;
    this.jwt = null;
    this.walletAddress = null;
    this.userId = null;
    this.#triggers = [];
    providerStore.subscribe((providers) => {
      this.#trigger("providers", providers);
    });
    this.#loadAuthStatusFromStorage();
  }

  /**
   * Subscribe to an event. Possible events are "state", "provider", and "providers".
   * @param {("state"|"provider"|"providers")} event The event.
   * @param {function} callback The callback function.
   * @returns {void}
   * @example
   * auth.on("state", (state) => {
   *  console.log(state);
   * });
   */
  on(event, callback) {
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
   * @param {object} data The data.
   * @returns {void}
   */
  #trigger(event, data) {
    if (this.#triggers[event]) {
      this.#triggers[event].forEach((callback) => callback(data));
    }
  }

  /**
   * Set the loading state.
   * @param {boolean} loading The loading state.
   * @returns {void}
   */
  setLoading(loading) {
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
  setProvider({ provider, info }) {
    if (!provider) {
      throw new APIError("provider is required");
    }
    this.viem = getClient(provider, info.name);
    this.#trigger("provider", { provider, info });
  }

  /**
   * Set the wallet address. This is useful for edge cases where the provider can't return the wallet address. Don't use this unless you know what you're doing.
   * @param {string} walletAddress The wallet address.
   * @returns {void}
   */
  setWalletAddress(walletAddress) {
    this.walletAddress = walletAddress;
  }

  /**
   * Load the authentication status from local storage.
   * @private
   * @returns {void}
   */
  #loadAuthStatusFromStorage() {
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
      this.isAuthenticated = true;
    } else {
      this.isAuthenticated = false;
    }
  }

  /**
   * Request the user to connect their wallet.
   * @private
   * @returns {Promise<void>} A promise that resolves when the user connects their wallet.
   * @throws {APIError} - Throws an error if the user does not connect their wallet.
   */
  async #requestAccount() {
    try {
      const [account] = await this.viem.requestAddresses();
      this.walletAddress = account;
      return account;
    } catch (e) {
      throw new APIError(e);
    }
  }

  /**
   * Fetch the nonce from the server.
   * @private
   * @returns {Promise<string>} A promise that resolves with the nonce.
   * @throws {APIError} - Throws an error if the nonce cannot be fetched.
   */
  async #fetchNonce() {
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
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * Verify the signature.
   * @private
   * @param {string} message The message.
   * @param {string} signature The signature.
   * @returns {Promise<object>} A promise that resolves with the verification result.
   * @throws {APIError} - Throws an error if the signature cannot be verified.
   */
  async #verifySignature(message, signature) {
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
    } catch (e) {
      throw new APIError(e);
    }
  }

  /**
   * Create the SIWE message.
   * @private
   * @param {string} nonce The nonce.
   * @returns {string} The EIP-4361 formatted message.
   */
  #createMessage(nonce) {
    return createSiweMessage({
      domain: window.location.host,
      address: this.walletAddress,
      statement: constants.SIWE_MESSAGE_STATEMENT,
      uri: window.location.origin,
      version: "1",
      chainId: this.viem.chain.id,
      nonce: nonce,
    });
  }

  /**
   * Disconnect the user.
   * @returns {void}
   */
  async disconnect() {
    this.isAuthenticated = false;
    this.walletAddress = null;
    this.userId = null;
    this.jwt = null;
    localStorage.removeItem("camp-sdk:wallet-address");
    localStorage.removeItem("camp-sdk:user-id");
    localStorage.removeItem("camp-sdk:jwt");
    this.#trigger("state", "unauthenticated");
  }

  /**
   * Connect the user's wallet and sign the message.
   * @returns {Promise<object>} A promise that resolves with the authentication result.
   * @throws {APIError} - Throws an error if the user cannot be authenticated.
   */
  async connect() {
    this.#trigger("state", "loading");
    try {
      if (!this.walletAddress) {
        await this.#requestAccount();
      }
      const nonce = await this.#fetchNonce();
      const message = this.#createMessage(nonce);
      const signature = await this.viem.signMessage({
        account: this.walletAddress,
        message: message,
      });
      const res = await this.#verifySignature(message, signature, nonce);
      if (res.success) {
        this.isAuthenticated = true;
        this.userId = res.userId;
        this.jwt = res.token;
        localStorage.setItem("camp-sdk:jwt", this.jwt);
        localStorage.setItem("camp-sdk:wallet-address", this.walletAddress);
        localStorage.setItem("camp-sdk:user-id", this.userId);
        this.#trigger("state", "authenticated");
        return {
          success: true,
          message: "Successfully authenticated",
          walletAddress: this.walletAddress,
        };
      } else {
        this.isAuthenticated = false;
        this.#trigger("state", "unauthenticated");
        throw new APIError("Failed to authenticate");
      }
    } catch (e) {
      this.isAuthenticated = false;
      this.#trigger("state", "unauthenticated");
      throw new APIError(e);
    }
  }

  /**
   * Get the user's linked social accounts.
   * @returns {Promise<object>} A promise that resolves with the user's linked social accounts.
   * @throws {APIError} - Throws an error if the user is not authenticated or if the request fails.
   * @example
   * const auth = new Auth({ clientId: "your-client-id" });
   * const socials = await auth.getLinkedSocials();
   * console.log(socials);
   */
  async getLinkedSocials() {
    if (!this.isAuthenticated)
      throw new APIError("User needs to be authenticated");
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
      const socials = {};
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
   * @returns {void}
   * @throws {APIError} - Throws an error if the user is not authenticated.
   */
  linkTwitter() {
    if (!this.isAuthenticated) {
      throw new APIError("User needs to be authenticated");
    }
    window.location.href = `${constants.AUTH_HUB_BASE_API}/twitter/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri["twitter"]}`;
  }

  /**
   * Link the user's Discord account.
   * @returns {void}
   * @throws {APIError} - Throws an error if the user is not authenticated.
   */
  linkDiscord() {
    if (!this.isAuthenticated) {
      throw new APIError("User needs to be authenticated");
    }
    window.location.href = `${constants.AUTH_HUB_BASE_API}/discord/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri["discord"]}`;
  }

  /**
   * Link the user's Spotify account.
   * @returns {void}
   * @throws {APIError} - Throws an error if the user is not authenticated.
   */
  linkSpotify() {
    if (!this.isAuthenticated) {
      throw new APIError("User needs to be authenticated");
    }
    window.location.href = `${constants.AUTH_HUB_BASE_API}/spotify/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri["spotify"]}`;
  }

  /**
   * Link the user's TikTok account.
   * @param {string} handle The user's TikTok handle.
   * @returns {void}
   * @throws {APIError} - Throws an error if the user is not authenticated.
   */
  async linkTikTok(handle) {
    if (!this.isAuthenticated) {
      throw new APIError("User needs to be authenticated");
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

  /**
   * Send an OTP to the user's Telegram account.
   * @param {string} phoneNumber The user's phone number.
   * @returns {void}
   * @throws {APIError} - Throws an error if the user is not authenticated.
   */
  async sendTelegramOTP(phoneNumber) {
    if (!this.isAuthenticated)
      throw new APIError("User needs to be authenticated");
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
   * @returns {void}
   * @throws {APIError} - Throws an error if the user is not authenticated. Also throws an error if the phone number, OTP, and phone code hash are not provided.
   */
  async linkTelegram(phoneNumber, otp, phoneCodeHash) {
    if (!this.isAuthenticated)
      throw new APIError("User needs to be authenticated");
    if (!phoneNumber || !otp || !phoneCodeHash)
      throw new APIError("Phone number, OTP, and phone code hash are required");
    const data = await fetch(`${constants.AUTH_HUB_BASE_API}/telegram/signIn-sdk`, {
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
    }).then((res) => res.json());

    if (!data.isError) {
      return data.data;
    } else {
      throw new APIError(data.message || "Failed to link Telegram account");
    }
  }

  /**
   * Unlink the user's Twitter account.
   */
  async unlinkTwitter() {
    if (!this.isAuthenticated) {
      throw new APIError("User needs to be authenticated");
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
   */
  async unlinkDiscord() {
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
   */
  async unlinkSpotify() {
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

  async unlinkTikTok() {
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

  async unlinkTelegram() {
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
