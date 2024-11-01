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
        // const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const [account] = await this.viem.getAddresses();
        this.walletAddress = account;
        console.log(this.walletAddress);
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
            message: 'hello'
        });
        // const signature = await this.viem.request({
        //     method: 'personal_sign',
        //     params: [this.walletAddress, this.walletAddress]
        // })
        // await window.ethereum.request({
        //     "method": "personal_sign",
        //     "params": [
        //      "0x506c65617365207369676e2074686973206d65737361676520746f20636f6e6669726d20796f7572206964656e746974792e",
        //      "0xeab0028b493e029b41f5a4386f789507c00fdc84"
        //    ],
        //    });
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