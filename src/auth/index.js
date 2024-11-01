import { APIError } from "../errors";
import { getClient } from "./viem/client";
import { createSiweMessage, generateSiweNonce } from "viem/siwe";
import constants from "../constants";
/**
 * The Auth class.
 * @class
 * @classdesc The Auth class is used to authenticate the user.
 */
class Auth {
    /**
     * Constructor for the Auth class.
     * @param {object} options - The options object.
     * @param {string} options.clientId - The client ID.
     * @throws {APIError} - Throws an error if the clientId is not provided.
     */
    constructor({ clientId }) {
        if (!clientId) {
            throw new APIError('clientId is required');
        }
        this.viem = getClient();
        this.clientId = clientId;
        this.isAuthenticated = false;
        this.walletAddress = null;
    }

    async requestAccount() {
        // const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log(this.viem)
        const [account] = await this.viem.requestAddresses();
        this.walletAddress = account;
    }

    async fetchNonce() {
        try {
            const res = await fetch(constants.SIWE_API_NONCE, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await res.json();
            return data.nonce;
        }
        catch (e) {
            console.error(e);
        }
    }

    async verifySignature(message, signature, nonce) {
        try {
            const res = await fetch(constants.SIWE_API_VERIFY, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message,
                    signature,
                })
            })
            const data = await res.json();
            return data;
        }
        catch (e) {
            console.error(e);
        }
    }

    async sign() {
        if (!this.walletAddress) {
            await this.requestAccount();
        }
        const nonce = await this.fetchNonce();
        const message = createSiweMessage({
            domain: window.location.host,
            address: this.walletAddress,
            statement: 'Connect with Camp Network',
            uri: window.location.origin,
            version: '1',
            chainId: this.viem.chain.id,
            nonce: nonce
        })
        const signature = await this.viem.signMessage({
            account: this.walletAddress,
            message: message
        });
        const res = await this.verifySignature(message, signature, nonce);
        console.log('res', res);

        // 1. get nonce from backend
        // 2. sign the nonce with the wallet using siwe
        // 3. call backend to verify the signature
        // 4. if signature is verified, set isAuthenticated to true
    }
}

export { Auth };