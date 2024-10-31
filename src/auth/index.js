import { APIError } from "../errors";
import { getClient } from "./viem/client";
import { createSiweMessage, generateSiweNonce } from "viem/siwe";
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
        this.walletAddress = '';
    }

    async requestAccount() {
        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        this.walletAddress = account;
    }

    async fetchNonce() {
        // call backend to get nonce
        return generateSiweNonce();
    }

    async sign() {
        if (!this.walletAddress) {
            await this.requestAccount();
        }
        const message = createSiweMessage({
            domain: window.location.host,
            address: this.walletAddress,
            statement: 'Connect with Camp Network',
            uri: window.location.origin,
            version: '1',
            chainId: this.viem.chain.id,
            nonce: await this.fetchNonce()
        })
        const signature = await this.viem.signMessage({
            account: this.walletAddress,
            message: message
        });
        console.log(signature);

        // const signature = await this.viem.signMessage(nonce);
        // console.log(signature);
        // get nonce from backend
        // sign the nonce with the wallet using siwe
        // call backend to verify the signature
        // if signature is verified, set isAuthenticated to true
    }
}

export { Auth };