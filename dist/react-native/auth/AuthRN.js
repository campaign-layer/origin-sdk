'use strict';

var tslib_es6 = require('../node_modules/tslib/tslib.es6.js');
var errors = require('../src/errors.js');
var siwe = require('viem/siwe');
var constants = require('../src/constants.js');
var index = require('../src/core/origin/index.js');
var viem = require('viem');
var storage = require('../storage.js');

var _AuthRN_instances, _AuthRN_triggers, _AuthRN_provider, _AuthRN_appKitInstance, _AuthRN_trigger, _AuthRN_loadAuthStatusFromStorage, _AuthRN_requestAccount, _AuthRN_signMessage;
const createRedirectUriObject = (redirectUri) => {
    const keys = ["twitter", "discord", "spotify"];
    if (typeof redirectUri === "object") {
        return keys.reduce((object, key) => {
            object[key] = redirectUri[key] || "app://redirect";
            return object;
        }, {});
    }
    else if (typeof redirectUri === "string") {
        return keys.reduce((object, key) => {
            object[key] = redirectUri;
            return object;
        }, {});
    }
    else if (!redirectUri) {
        return keys.reduce((object, key) => {
            object[key] = "app://redirect";
            return object;
        }, {});
    }
    return {};
};
/**
 * The React Native Auth class with AppKit integration.
 * @class
 * @classdesc The Auth class is used to authenticate the user in React Native with AppKit for wallet operations.
 */
class AuthRN {
    /**
     * Constructor for the Auth class.
     * @param {object} options The options object.
     * @param {string} options.clientId The client ID.
     * @param {string|object} options.redirectUri The redirect URI used for oauth.
     * @param {boolean} [options.allowAnalytics=true] Whether to allow analytics to be sent.
     * @param {any} [options.appKit] AppKit instance for wallet operations.
     * @throws {APIError} - Throws an error if the clientId is not provided.
     */
    constructor({ clientId, redirectUri, allowAnalytics = true, appKit, }) {
        _AuthRN_instances.add(this);
        _AuthRN_triggers.set(this, void 0);
        _AuthRN_provider.set(this, void 0);
        _AuthRN_appKitInstance.set(this, void 0); // AppKit instance for signing
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
        tslib_es6.__classPrivateFieldSet(this, _AuthRN_triggers, {}, "f");
        tslib_es6.__classPrivateFieldSet(this, _AuthRN_provider, null, "f");
        tslib_es6.__classPrivateFieldSet(this, _AuthRN_appKitInstance, appKit, "f");
        tslib_es6.__classPrivateFieldGet(this, _AuthRN_instances, "m", _AuthRN_loadAuthStatusFromStorage).call(this);
    }
    /**
     * Set AppKit instance for wallet operations.
     * @param {any} appKit AppKit instance.
     */
    setAppKit(appKit) {
        tslib_es6.__classPrivateFieldSet(this, _AuthRN_appKitInstance, appKit, "f");
    }
    /**
     * Get AppKit instance for wallet operations.
     * @returns {any} AppKit instance.
     */
    getAppKit() {
        return tslib_es6.__classPrivateFieldGet(this, _AuthRN_appKitInstance, "f");
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
    on(event, callback) {
        if (!tslib_es6.__classPrivateFieldGet(this, _AuthRN_triggers, "f")[event]) {
            tslib_es6.__classPrivateFieldGet(this, _AuthRN_triggers, "f")[event] = [];
        }
        tslib_es6.__classPrivateFieldGet(this, _AuthRN_triggers, "f")[event].push(callback);
    }
    /**
     * Set the loading state.
     * @param {boolean} loading The loading state.
     * @returns {void}
     */
    setLoading(loading) {
        tslib_es6.__classPrivateFieldGet(this, _AuthRN_instances, "m", _AuthRN_trigger).call(this, "state", loading
            ? "loading"
            : this.isAuthenticated
                ? "authenticated"
                : "unauthenticated");
    }
    /**
     * Set the provider. This is useful for setting the provider when the user selects a provider from the UI.
     * @param {object} options The options object. Includes the provider and the provider info.
     * @returns {void}
     * @throws {APIError} - Throws an error if the provider is not provided.
     */
    setProvider({ provider, info, address, }) {
        if (!provider) {
            throw new errors.APIError("provider is required");
        }
        tslib_es6.__classPrivateFieldSet(this, _AuthRN_provider, provider, "f");
        this.viem = provider; // In React Native, we use the provider directly
        if (this.origin) {
            this.origin.setViemClient(this.viem);
        }
        tslib_es6.__classPrivateFieldGet(this, _AuthRN_instances, "m", _AuthRN_trigger).call(this, "viem", this.viem);
        tslib_es6.__classPrivateFieldGet(this, _AuthRN_instances, "m", _AuthRN_trigger).call(this, "provider", { provider, info });
    }
    /**
     * Set the wallet address.
     * @param {string} walletAddress The wallet address.
     * @returns {void}
     */
    setWalletAddress(walletAddress) {
        this.walletAddress = walletAddress;
    }
    /**
     * Disconnect the user and clear AppKit connection.
     * @returns {Promise<void>}
     */
    disconnect() {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                return;
            }
            tslib_es6.__classPrivateFieldGet(this, _AuthRN_instances, "m", _AuthRN_trigger).call(this, "state", "unauthenticated");
            this.isAuthenticated = false;
            this.walletAddress = null;
            this.userId = null;
            this.jwt = null;
            this.origin = null;
            this.viem = null;
            tslib_es6.__classPrivateFieldSet(this, _AuthRN_provider, null, "f");
            // Disconnect AppKit if available
            if (tslib_es6.__classPrivateFieldGet(this, _AuthRN_appKitInstance, "f") && tslib_es6.__classPrivateFieldGet(this, _AuthRN_appKitInstance, "f").disconnect) {
                try {
                    yield tslib_es6.__classPrivateFieldGet(this, _AuthRN_appKitInstance, "f").disconnect();
                }
                catch (error) {
                    console.error('Error disconnecting AppKit:', error);
                }
            }
            try {
                yield storage.Storage.multiRemove([
                    "camp-sdk:wallet-address",
                    "camp-sdk:user-id",
                    "camp-sdk:jwt"
                ]);
            }
            catch (error) {
                console.error('Error removing auth data from storage:', error);
            }
        });
    }
    /**
     * Connect the user's wallet and authenticate using AppKit.
     * @returns {Promise<{ success: boolean; message: string; walletAddress: string }>} A promise that resolves with the authentication result.
     * @throws {APIError} - Throws an error if the user cannot be authenticated.
     */
    connect() {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            tslib_es6.__classPrivateFieldGet(this, _AuthRN_instances, "m", _AuthRN_trigger).call(this, "state", "loading");
            try {
                if (!this.walletAddress) {
                    yield tslib_es6.__classPrivateFieldGet(this, _AuthRN_instances, "m", _AuthRN_requestAccount).call(this);
                }
                this.walletAddress = viem.checksumAddress(this.walletAddress);
                // Create SIWE message
                const message = siwe.createSiweMessage({
                    domain: "camp.org",
                    address: this.walletAddress,
                    statement: "Sign in with Ethereum to Camp",
                    uri: "https://camp.org",
                    version: "1",
                    chainId: 1,
                    nonce: Math.random().toString(36).substring(2, 15),
                    issuedAt: new Date(),
                });
                // Sign message using AppKit or provider
                const signature = yield tslib_es6.__classPrivateFieldGet(this, _AuthRN_instances, "m", _AuthRN_signMessage).call(this, message);
                // Authenticate with the server
                const response = yield fetch(`${constants.AUTH_HUB_BASE_API}/auth/wallet/connect`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-camp-client-id": this.clientId,
                    },
                    body: JSON.stringify({
                        signature: signature,
                        message: message,
                    }),
                });
                if (!response.ok) {
                    throw new Error("Authentication failed");
                }
                const data = yield response.json();
                if (data.status !== "success") {
                    throw new errors.APIError(data.message || "Authentication failed");
                }
                // Store the authentication data
                this.jwt = data.data.jwt;
                this.userId = data.data.user.id;
                this.isAuthenticated = true;
                this.origin = new index.Origin(this.jwt);
                // Set viem client if available
                if (this.viem) {
                    this.origin.setViemClient(this.viem);
                }
                // Save to storage
                try {
                    yield storage.Storage.multiSet([
                        ["camp-sdk:jwt", this.jwt],
                        ["camp-sdk:wallet-address", this.walletAddress],
                        ["camp-sdk:user-id", this.userId],
                    ]);
                }
                catch (error) {
                    console.error('Error saving auth data to storage:', error);
                }
                tslib_es6.__classPrivateFieldGet(this, _AuthRN_instances, "m", _AuthRN_trigger).call(this, "state", "authenticated");
                return {
                    success: true,
                    message: "Successfully authenticated",
                    walletAddress: this.walletAddress,
                };
            }
            catch (e) {
                this.isAuthenticated = false;
                tslib_es6.__classPrivateFieldGet(this, _AuthRN_instances, "m", _AuthRN_trigger).call(this, "state", "unauthenticated");
                throw new errors.APIError(e.message || "Authentication failed");
            }
        });
    }
    /**
     * Get the user's linked social accounts.
     * @returns {Promise<Record<string, boolean>>} A promise that resolves with the user's linked social accounts.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated or if the request fails.
     */
    getLinkedSocials() {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated)
                throw new Error("User needs to be authenticated");
            const connections = yield fetch(`${constants.AUTH_HUB_BASE_API}/auth/client-user/connections-sdk`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${this.jwt}`,
                    "x-client-id": this.clientId,
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json());
            if (!connections.isError) {
                const socials = {};
                Object.keys(connections.data.data).forEach((key) => {
                    socials[key.split("User")[0]] = connections.data.data[key];
                });
                return socials;
            }
            else {
                throw new errors.APIError(connections.message || "Failed to fetch connections");
            }
        });
    }
    // Social linking methods remain the same as web version
    // but with mobile-appropriate redirect handling
    linkTwitter() {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new Error("User needs to be authenticated");
            }
            // In React Native, we'd open this URL in a browser or WebView
            `${constants.AUTH_HUB_BASE_API}/twitter/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri["twitter"]}`;
            // This would be handled by the React Native app using Linking or a WebView
            throw new Error("Social linking should be handled by the React Native app using a WebView or Linking API");
        });
    }
    linkDiscord() {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new Error("User needs to be authenticated");
            }
            `${constants.AUTH_HUB_BASE_API}/discord/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri["discord"]}`;
            throw new Error("Social linking should be handled by the React Native app using a WebView or Linking API");
        });
    }
    linkSpotify() {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new Error("User needs to be authenticated");
            }
            `${constants.AUTH_HUB_BASE_API}/spotify/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri["spotify"]}`;
            throw new Error("Social linking should be handled by the React Native app using a WebView or Linking API");
        });
    }
    linkTikTok(handle) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new Error("User needs to be authenticated");
            }
            const data = yield fetch(`${constants.AUTH_HUB_BASE_API}/tiktok/connect-sdk`, {
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
            }).then((res) => res.json());
            if (!data.isError) {
                return data.data;
            }
            else {
                if (data.message === "Request failed with status code 502") {
                    throw new errors.APIError("TikTok service is currently unavailable, try again later");
                }
                else {
                    throw new errors.APIError(data.message || "Failed to link TikTok account");
                }
            }
        });
    }
    // Add all other social linking/unlinking methods...
    // (keeping them similar to the web version but with mobile considerations)
    sendTelegramOTP(phoneNumber) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated)
                throw new Error("User needs to be authenticated");
            if (!phoneNumber)
                throw new errors.APIError("Phone number is required");
            yield this.unlinkTelegram();
            const data = yield fetch(`${constants.AUTH_HUB_BASE_API}/telegram/sendOTP-sdk`, {
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
            }).then((res) => res.json());
            if (!data.isError) {
                return data.data;
            }
            else {
                throw new errors.APIError(data.message || "Failed to send Telegram OTP");
            }
        });
    }
    linkTelegram(phoneNumber, otp, phoneCodeHash) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated)
                throw new Error("User needs to be authenticated");
            if (!phoneNumber || !otp || !phoneCodeHash)
                throw new errors.APIError("Phone number, OTP, and phone code hash are required");
            const data = yield fetch(`${constants.AUTH_HUB_BASE_API}/telegram/signIn-sdk`, {
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
            }
            else {
                throw new errors.APIError(data.message || "Failed to link Telegram account");
            }
        });
    }
    // Unlink methods
    unlinkTwitter() {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new Error("User needs to be authenticated");
            }
            const data = yield fetch(`${constants.AUTH_HUB_BASE_API}/twitter/disconnect-sdk`, {
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
            }).then((res) => res.json());
            if (!data.isError) {
                return data.data;
            }
            else {
                throw new errors.APIError(data.message || "Failed to unlink Twitter account");
            }
        });
    }
    unlinkDiscord() {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new errors.APIError("User needs to be authenticated");
            }
            const data = yield fetch(`${constants.AUTH_HUB_BASE_API}/discord/disconnect-sdk`, {
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
            }).then((res) => res.json());
            if (!data.isError) {
                return data.data;
            }
            else {
                throw new errors.APIError(data.message || "Failed to unlink Discord account");
            }
        });
    }
    unlinkSpotify() {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new errors.APIError("User needs to be authenticated");
            }
            const data = yield fetch(`${constants.AUTH_HUB_BASE_API}/spotify/disconnect-sdk`, {
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
            }).then((res) => res.json());
            if (!data.isError) {
                return data.data;
            }
            else {
                throw new errors.APIError(data.message || "Failed to unlink Spotify account");
            }
        });
    }
    unlinkTikTok() {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new errors.APIError("User needs to be authenticated");
            }
            const data = yield fetch(`${constants.AUTH_HUB_BASE_API}/tiktok/disconnect-sdk`, {
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
            }).then((res) => res.json());
            if (!data.isError) {
                return data.data;
            }
            else {
                throw new errors.APIError(data.message || "Failed to unlink TikTok account");
            }
        });
    }
    unlinkTelegram() {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new errors.APIError("User needs to be authenticated");
            }
            const data = yield fetch(`${constants.AUTH_HUB_BASE_API}/telegram/disconnect-sdk`, {
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
            }).then((res) => res.json());
            if (!data.isError) {
                return data.data;
            }
            else {
                throw new errors.APIError(data.message || "Failed to unlink Telegram account");
            }
        });
    }
    /**
     * Generic method to link social accounts
     */
    linkSocial(provider) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
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
        });
    }
    /**
     * Generic method to unlink social accounts
     */
    unlinkSocial(provider) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
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
        });
    }
    /**
     * Mint social NFT (placeholder implementation)
     */
    mintSocial(provider, data) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new errors.APIError("User needs to be authenticated");
            }
            // This is a placeholder implementation
            // You would replace this with actual minting logic
            throw new Error("mintSocial is not yet implemented");
        });
    }
    /**
     * Sign a message using the connected wallet
     */
    signMessage(message) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new errors.APIError("User needs to be authenticated");
            }
            const appKit = this.getAppKit();
            if (!appKit) {
                throw new errors.APIError("AppKit not initialized");
            }
            try {
                if (appKit.signMessage) {
                    return yield appKit.signMessage({ message });
                }
                else {
                    throw new Error("Sign message not available on AppKit instance");
                }
            }
            catch (error) {
                throw new errors.APIError(`Failed to sign message: ${error.message}`);
            }
        });
    }
    /**
     * Send a transaction using the connected wallet
     */
    sendTransaction(transaction) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new errors.APIError("User needs to be authenticated");
            }
            const appKit = this.getAppKit();
            if (!appKit) {
                throw new errors.APIError("AppKit not initialized");
            }
            try {
                if (appKit.sendTransaction) {
                    return yield appKit.sendTransaction(transaction);
                }
                else {
                    throw new Error("Send transaction not available on AppKit instance");
                }
            }
            catch (error) {
                throw new errors.APIError(`Failed to send transaction: ${error.message}`);
            }
        });
    }
}
_AuthRN_triggers = new WeakMap(), _AuthRN_provider = new WeakMap(), _AuthRN_appKitInstance = new WeakMap(), _AuthRN_instances = new WeakSet(), _AuthRN_trigger = function _AuthRN_trigger(event, data) {
    if (tslib_es6.__classPrivateFieldGet(this, _AuthRN_triggers, "f")[event]) {
        tslib_es6.__classPrivateFieldGet(this, _AuthRN_triggers, "f")[event].forEach((callback) => callback(data));
    }
}, _AuthRN_loadAuthStatusFromStorage = function _AuthRN_loadAuthStatusFromStorage(provider) {
    return tslib_es6.__awaiter(this, void 0, void 0, function* () {
        try {
            const [walletAddress, userId, jwt] = yield Promise.all([
                storage.Storage.getItem("camp-sdk:wallet-address"),
                storage.Storage.getItem("camp-sdk:user-id"),
                storage.Storage.getItem("camp-sdk:jwt")
            ]);
            if (walletAddress && userId && jwt) {
                this.walletAddress = walletAddress;
                this.userId = userId;
                this.jwt = jwt;
                this.origin = new index.Origin(this.jwt);
                this.isAuthenticated = true;
                if (provider) {
                    this.setProvider({
                        provider: provider.provider,
                        info: provider.info || { name: "Unknown" },
                        address: walletAddress,
                    });
                }
            }
            else {
                this.isAuthenticated = false;
            }
        }
        catch (error) {
            console.error('Error loading auth status from storage:', error);
            this.isAuthenticated = false;
        }
    });
}, _AuthRN_requestAccount = function _AuthRN_requestAccount() {
    return tslib_es6.__awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            if (tslib_es6.__classPrivateFieldGet(this, _AuthRN_appKitInstance, "f")) {
                // Use AppKit for wallet connection
                yield tslib_es6.__classPrivateFieldGet(this, _AuthRN_appKitInstance, "f").openAppKit();
                // Wait for connection and get address
                const state = ((_b = (_a = tslib_es6.__classPrivateFieldGet(this, _AuthRN_appKitInstance, "f")).getState) === null || _b === void 0 ? void 0 : _b.call(_a)) || {};
                if (state.address) {
                    this.walletAddress = viem.checksumAddress(state.address);
                    return this.walletAddress;
                }
                throw new errors.APIError("No address returned from AppKit");
            }
            // Fallback to direct provider if available
            if (!tslib_es6.__classPrivateFieldGet(this, _AuthRN_provider, "f")) {
                throw new errors.APIError("No AppKit instance or provider available");
            }
            const accounts = yield tslib_es6.__classPrivateFieldGet(this, _AuthRN_provider, "f").request({
                method: "eth_requestAccounts",
            });
            if (!accounts || accounts.length === 0) {
                throw new errors.APIError("No accounts found");
            }
            this.walletAddress = viem.checksumAddress(accounts[0]);
            return this.walletAddress;
        }
        catch (e) {
            throw new errors.APIError(e.message || "Failed to connect wallet");
        }
    });
}, _AuthRN_signMessage = function _AuthRN_signMessage(message) {
    return tslib_es6.__awaiter(this, void 0, void 0, function* () {
        try {
            if (tslib_es6.__classPrivateFieldGet(this, _AuthRN_appKitInstance, "f") && tslib_es6.__classPrivateFieldGet(this, _AuthRN_appKitInstance, "f").signMessage) {
                // Use AppKit for signing
                return yield tslib_es6.__classPrivateFieldGet(this, _AuthRN_appKitInstance, "f").signMessage(message);
            }
            // Fallback to direct provider signing
            if (!tslib_es6.__classPrivateFieldGet(this, _AuthRN_provider, "f")) {
                throw new errors.APIError("No signing method available");
            }
            return yield tslib_es6.__classPrivateFieldGet(this, _AuthRN_provider, "f").request({
                method: "personal_sign",
                params: [message, this.walletAddress],
            });
        }
        catch (e) {
            throw new errors.APIError(e.message || "Failed to sign message");
        }
    });
};

exports.AuthRN = AuthRN;
