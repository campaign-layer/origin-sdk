import { APIError } from "../errors";
import { getClient } from "./viem/client";
import { createSiweMessage } from "viem/siwe";
import constants from "../constants";
import { providerStore } from "./viem/providers";
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
   * @param {string} options.redirectUri The redirect URI used for oauth. Leave empty if you want to use the current URL.
   * @throws {APIError} - Throws an error if the clientId is not provided.
   */
  #triggers;
  constructor({ clientId, redirectUri }) {
    if (!clientId) {
      throw new APIError("clientId is required");
    }

    if (typeof window !== "undefined") {
      this.viem = getClient(window.ethereum);
      if (!redirectUri) {
        redirectUri = window.location.href;
      }
    } else {
      this.viem = null;
    }
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.isAuthenticated = false;
    this.jwt = null;
    this.walletAddress = null;
    this.userId = null;
    this.#triggers = [];

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
      return data.data;
    } catch (e) {
      throw new APIError(e);
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
    window.location.href = `${constants.AUTH_HUB_BASE_API}/twitter/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri}`;
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
    window.location.href = `${constants.AUTH_HUB_BASE_API}/discord/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri}`;
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
    window.location.href = `${constants.AUTH_HUB_BASE_API}/spotify/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri}`;
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
}

export { Auth };
