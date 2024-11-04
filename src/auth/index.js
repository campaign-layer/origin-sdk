import { APIError } from "../errors";
import { getClient } from "./viem/client";
import { createSiweMessage } from "viem/siwe";
import constants from "../constants";
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
   * @param {string} options.redirectUri The redirect URI used for oauth.
   * @throws {APIError} - Throws an error if the clientId is not provided.
   */
  constructor({ clientId, redirectUri }) {
    if (!clientId) {
      throw new APIError("clientId is required");
    }
    this.viem = getClient();
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.isAuthenticated = false;
    this.walletAddress = null;
    this.userId = null;

    this.#loadAuthStatusFromStorage();
  }

  /**
   * Load the authentication status from local storage.
   * @private
   * @returns {void}
   */
  #loadAuthStatusFromStorage() {
    const walletAddress = localStorage.getItem("camp-sdk:wallet-address");
    const userId = localStorage.getItem("camp-sdk:user-id");

    if (walletAddress && userId) {
      this.walletAddress = walletAddress;
      this.userId = userId;
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
      const res = await fetch(constants.SIWE_API_NONCE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      return data.nonce;
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
      const res = await fetch(constants.SIWE_API_VERIFY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          signature,
        }),
      });
      const data = await res.json();
      return data;
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
    localStorage.removeItem("camp-sdk:wallet-address");
    localStorage.removeItem("camp-sdk:user-id");
  }

  /**
   * Connect the user's wallet and sign the message.
   * @returns {Promise<object>} A promise that resolves with the authentication result.
   * @throws {APIError} - Throws an error if the user cannot be authenticated.
   */
  async connect() {
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
        localStorage.setItem("camp-sdk:wallet-address", this.walletAddress);
        localStorage.setItem("camp-sdk:user-id", this.userId);
        return {
          success: true,
          message: "Successfully authenticated",
          walletAddress: this.walletAddress,
        };
      } else {
        this.isAuthenticated = false;
        throw new APIError("Failed to authenticate");
      }
    } catch (e) {
      throw new APIError(e);
    }
  }
}

export { Auth };
