'use strict';

var tslib_es6 = require('../../../node_modules/tslib/tslib.es6.js');
var viem = require('viem');
var constants = require('../../constants.js');
var errors = require('../../errors.js');
var utils = require('../../utils.js');
var client = require('../auth/viem/client.js');
var chains = require('../auth/viem/chains.js');
var mintWithSignature = require('./mintWithSignature.js');
var updateTerms = require('./updateTerms.js');
var requestDelete = require('./requestDelete.js');
var getTerms = require('./getTerms.js');
var ownerOf = require('./ownerOf.js');
var balanceOf = require('./balanceOf.js');
var contentHash = require('./contentHash.js');
var tokenURI = require('./tokenURI.js');
var dataStatus = require('./dataStatus.js');
var royaltyInfo = require('./royaltyInfo.js');
var getApproved = require('./getApproved.js');
var isApprovedForAll = require('./isApprovedForAll.js');
var transferFrom = require('./transferFrom.js');
var safeTransferFrom = require('./safeTransferFrom.js');
var approve = require('./approve.js');
var setApprovalForAll = require('./setApprovalForAll.js');
var buyAccess = require('./buyAccess.js');
var renewAccess = require('./renewAccess.js');
var hasAccess = require('./hasAccess.js');
var subscriptionExpiry = require('./subscriptionExpiry.js');
var approveIfNeeded = require('./approveIfNeeded.js');

var _Origin_instances, _Origin_generateURL, _Origin_setOriginStatus, _Origin_waitForTxReceipt, _Origin_ensureChainId;
/**
 * The Origin class
 * Handles the upload of files to Origin, as well as querying the user's stats
 */
class Origin {
    constructor(jwt, viemClient) {
        _Origin_instances.add(this);
        _Origin_generateURL.set(this, (file) => tslib_es6.__awaiter(this, void 0, void 0, function* () {
            const uploadRes = yield fetch(`${constants.AUTH_HUB_BASE_API}/auth/origin/upload-url`, {
                method: "POST",
                body: JSON.stringify({
                    name: file.name,
                    type: file.type,
                }),
                headers: {
                    Authorization: `Bearer ${this.jwt}`,
                },
            });
            const data = yield uploadRes.json();
            return data.isError ? data.message : data.data;
        }));
        _Origin_setOriginStatus.set(this, (key, status) => tslib_es6.__awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`${constants.AUTH_HUB_BASE_API}/auth/origin/update-status`, {
                method: "PATCH",
                body: JSON.stringify({
                    status,
                    fileKey: key,
                }),
                headers: {
                    Authorization: `Bearer ${this.jwt}`,
                    "Content-Type": "application/json",
                },
            });
            if (!res.ok) {
                console.error("Failed to update origin status");
                return;
            }
        }));
        this.uploadFile = (file, options) => tslib_es6.__awaiter(this, void 0, void 0, function* () {
            const uploadInfo = yield tslib_es6.__classPrivateFieldGet(this, _Origin_generateURL, "f").call(this, file);
            if (!uploadInfo) {
                console.error("Failed to generate upload URL");
                return;
            }
            try {
                yield utils.uploadWithProgress(file, uploadInfo.url, (options === null || options === void 0 ? void 0 : options.progressCallback) || (() => { }));
            }
            catch (error) {
                yield tslib_es6.__classPrivateFieldGet(this, _Origin_setOriginStatus, "f").call(this, uploadInfo.key, "failed");
                throw new Error("Failed to upload file: " + error);
            }
            yield tslib_es6.__classPrivateFieldGet(this, _Origin_setOriginStatus, "f").call(this, uploadInfo.key, "success");
            return uploadInfo;
        });
        this.mintFile = (file, metadata, license, parentId, options) => tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (!this.viemClient) {
                throw new Error("WalletClient not connected.");
            }
            const info = yield this.uploadFile(file, options);
            if (!info || !info.key) {
                throw new Error("Failed to upload file or get upload info.");
            }
            const deadline = BigInt(Math.floor(Date.now() / 1000) + 600); // 10 minutes from now
            const registration = yield this.registerIpNFT("file", deadline, license, metadata, info.key, parentId);
            const { tokenId, signerAddress, creatorContentHash, signature, uri } = registration;
            if (!tokenId ||
                !signerAddress ||
                !creatorContentHash ||
                signature === undefined ||
                !uri) {
                throw new Error("Failed to register IpNFT: Missing required fields in registration response.");
            }
            const [account] = yield this.viemClient.request({
                method: "eth_requestAccounts",
                params: [],
            });
            const mintResult = yield this.mintWithSignature(account, tokenId, parentId || BigInt(0), creatorContentHash, uri, license, deadline, signature);
            if (mintResult.status !== "0x1") {
                throw new Error(`Minting failed with status: ${mintResult.status}`);
            }
            return tokenId.toString();
        });
        this.mintSocial = (source, metadata, license) => tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (!this.viemClient) {
                throw new Error("WalletClient not connected.");
            }
            const deadline = BigInt(Math.floor(Date.now() / 1000) + 600); // 10 minutes from now
            const registration = yield this.registerIpNFT(source, deadline, license, metadata);
            const { tokenId, signerAddress, creatorContentHash, signature, uri } = registration;
            if (!tokenId ||
                !signerAddress ||
                !creatorContentHash ||
                signature === undefined ||
                !uri) {
                throw new Error("Failed to register Social IpNFT: Missing required fields in registration response.");
            }
            const [account] = yield this.viemClient.request({
                method: "eth_requestAccounts",
                params: [],
            });
            const mintResult = yield this.mintWithSignature(account, tokenId, BigInt(0), // parentId is not applicable for social IpNFTs
            creatorContentHash, uri, license, deadline, signature);
            if (mintResult.status !== "0x1") {
                throw new Error(`Minting Social IpNFT failed with status: ${mintResult.status}`);
            }
            return tokenId.toString();
        });
        this.getOriginUploads = () => tslib_es6.__awaiter(this, void 0, void 0, function* () {
            const res = yield fetch(`${constants.AUTH_HUB_BASE_API}/auth/origin/files`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${this.jwt}`,
                },
            });
            if (!res.ok) {
                console.error("Failed to get origin uploads");
                return null;
            }
            const data = yield res.json();
            return data.data;
        });
        this.jwt = jwt;
        this.viemClient = viemClient;
        // DataNFT methods
        this.mintWithSignature = mintWithSignature.mintWithSignature.bind(this);
        this.registerIpNFT = mintWithSignature.registerIpNFT.bind(this);
        this.updateTerms = updateTerms.updateTerms.bind(this);
        this.requestDelete = requestDelete.requestDelete.bind(this);
        this.getTerms = getTerms.getTerms.bind(this);
        this.ownerOf = ownerOf.ownerOf.bind(this);
        this.balanceOf = balanceOf.balanceOf.bind(this);
        this.contentHash = contentHash.contentHash.bind(this);
        this.tokenURI = tokenURI.tokenURI.bind(this);
        this.dataStatus = dataStatus.dataStatus.bind(this);
        this.royaltyInfo = royaltyInfo.royaltyInfo.bind(this);
        this.getApproved = getApproved.getApproved.bind(this);
        this.isApprovedForAll = isApprovedForAll.isApprovedForAll.bind(this);
        this.transferFrom = transferFrom.transferFrom.bind(this);
        this.safeTransferFrom = safeTransferFrom.safeTransferFrom.bind(this);
        this.approve = approve.approve.bind(this);
        this.setApprovalForAll = setApprovalForAll.setApprovalForAll.bind(this);
        // Marketplace methods
        this.buyAccess = buyAccess.buyAccess.bind(this);
        this.renewAccess = renewAccess.renewAccess.bind(this);
        this.hasAccess = hasAccess.hasAccess.bind(this);
        this.subscriptionExpiry = subscriptionExpiry.subscriptionExpiry.bind(this);
    }
    getJwt() {
        return this.jwt;
    }
    setViemClient(client) {
        this.viemClient = client;
    }
    /**
     * Get the user's Origin stats (multiplier, consent, usage, etc.).
     * @returns {Promise<OriginUsageReturnType>} A promise that resolves with the user's Origin stats.
     */
    getOriginUsage() {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            const data = yield fetch(`${constants.AUTH_HUB_BASE_API}/auth/origin/usage`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${this.jwt}`,
                    // "x-client-id": this.clientId,
                    "Content-Type": "application/json",
                },
            }).then((res) => res.json());
            if (!data.isError && data.data.user) {
                return data;
            }
            else {
                throw new errors.APIError(data.message || "Failed to fetch Origin usage");
            }
        });
    }
    /**
     * Set the user's consent for Origin usage.
     * @param {boolean} consent The user's consent.
     * @returns {Promise<void>}
     * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the consent is not provided.
     */
    setOriginConsent(consent) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (consent === undefined) {
                throw new errors.APIError("Consent is required");
            }
            const data = yield fetch(`${constants.AUTH_HUB_BASE_API}/auth/origin/status`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${this.jwt}`,
                    // "x-client-id": this.clientId,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    active: consent,
                }),
            }).then((res) => res.json());
            if (!data.isError) {
                return;
            }
            else {
                throw new errors.APIError(data.message || "Failed to set Origin consent");
            }
        });
    }
    /**
     * Set the user's Origin multiplier.
     * @param {number} multiplier The user's Origin multiplier.
     * @returns {Promise<void>}
     * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the multiplier is not provided.
     */
    setOriginMultiplier(multiplier) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (multiplier === undefined) {
                throw new errors.APIError("Multiplier is required");
            }
            const data = yield fetch(`${constants.AUTH_HUB_BASE_API}/auth/origin/multiplier`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${this.jwt}`,
                    // "x-client-id": this.clientId,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    multiplier,
                }),
            }).then((res) => res.json());
            if (!data.isError) {
                return;
            }
            else {
                throw new errors.APIError(data.message || "Failed to set Origin multiplier");
            }
        });
    }
    /**
     * Call a contract method.
     * @param {string} contractAddress The contract address.
     * @param {Abi} abi The contract ABI.
     * @param {string} methodName The method name.
     * @param {any[]} params The method parameters.
     * @param {CallOptions} [options] The call options.
     * @returns {Promise<any>} A promise that resolves with the result of the contract call or transaction hash.
     * @throws {Error} - Throws an error if the wallet client is not connected and the method is not a view function.
     */
    callContractMethod(contractAddress_1, abi_1, methodName_1, params_1) {
        return tslib_es6.__awaiter(this, arguments, void 0, function* (contractAddress, abi, methodName, params, options = {}) {
            const abiItem = viem.getAbiItem({ abi, name: methodName });
            const isView = abiItem &&
                "stateMutability" in abiItem &&
                (abiItem.stateMutability === "view" ||
                    abiItem.stateMutability === "pure");
            if (!isView && !this.viemClient) {
                throw new Error("WalletClient not connected.");
            }
            if (isView) {
                const publicClient = client.getPublicClient();
                const result = (yield publicClient.readContract({
                    address: contractAddress,
                    abi,
                    functionName: methodName,
                    args: params,
                })) || null;
                return result;
            }
            else {
                const [account] = yield this.viemClient.request({
                    method: "eth_requestAccounts",
                    params: [],
                });
                const data = viem.encodeFunctionData({
                    abi,
                    functionName: methodName,
                    args: params,
                });
                yield tslib_es6.__classPrivateFieldGet(this, _Origin_instances, "m", _Origin_ensureChainId).call(this, chains.testnet);
                try {
                    const txHash = yield this.viemClient.sendTransaction({
                        to: contractAddress,
                        data,
                        account,
                        value: options.value,
                        gas: options.gas,
                    });
                    if (typeof txHash !== "string") {
                        throw new Error("Transaction failed to send.");
                    }
                    if (!options.waitForReceipt) {
                        return txHash;
                    }
                    const receipt = yield tslib_es6.__classPrivateFieldGet(this, _Origin_instances, "m", _Origin_waitForTxReceipt).call(this, txHash);
                    return receipt;
                }
                catch (error) {
                    console.error("Transaction failed:", error);
                    throw new Error("Transaction failed: " + error);
                }
            }
        });
    }
    /**
     * Buy access to an asset by first checking its price via getTerms, then calling buyAccess.
     * @param {bigint} tokenId The token ID of the asset.
     * @param {number} periods The number of periods to buy access for.
     * @returns {Promise<any>} The result of the buyAccess call.
     */
    buyAccessSmart(tokenId, periods) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (!this.viemClient) {
                throw new Error("WalletClient not connected.");
            }
            const terms = yield this.getTerms(tokenId);
            if (!terms)
                throw new Error("Failed to fetch terms for asset");
            const { price, paymentToken } = terms;
            if (price === undefined || paymentToken === undefined) {
                throw new Error("Terms missing price or paymentToken");
            }
            const [account] = yield this.viemClient.request({
                method: "eth_requestAccounts",
                params: [],
            });
            const totalCost = price * BigInt(periods);
            const isNative = paymentToken === viem.zeroAddress;
            if (isNative) {
                return this.buyAccess(account, tokenId, periods, totalCost);
            }
            yield approveIfNeeded.approveIfNeeded({
                walletClient: this.viemClient,
                publicClient: client.getPublicClient(),
                tokenAddress: paymentToken,
                owner: account,
                spender: constants.MARKETPLACE_CONTRACT_ADDRESS,
                amount: totalCost,
            });
            return this.buyAccess(account, tokenId, periods);
        });
    }
    getData(tokenId) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${constants.AUTH_HUB_BASE_API}/auth/origin/data/${tokenId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${this.jwt}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            return response.json();
        });
    }
}
_Origin_generateURL = new WeakMap(), _Origin_setOriginStatus = new WeakMap(), _Origin_instances = new WeakSet(), _Origin_waitForTxReceipt = function _Origin_waitForTxReceipt(txHash) {
    return tslib_es6.__awaiter(this, void 0, void 0, function* () {
        if (!this.viemClient)
            throw new Error("WalletClient not connected.");
        while (true) {
            const receipt = yield this.viemClient.request({
                method: "eth_getTransactionReceipt",
                params: [txHash],
            });
            if (receipt && receipt.blockNumber) {
                return receipt;
            }
            yield new Promise((res) => setTimeout(res, 1000));
        }
    });
}, _Origin_ensureChainId = function _Origin_ensureChainId(chain) {
    return tslib_es6.__awaiter(this, void 0, void 0, function* () {
        // return;
        if (!this.viemClient)
            throw new Error("WalletClient not connected.");
        let currentChainId = yield this.viemClient.request({
            method: "eth_chainId",
            params: [],
        });
        if (typeof currentChainId === "string") {
            currentChainId = parseInt(currentChainId, 16);
        }
        if (currentChainId !== chain.id) {
            try {
                yield this.viemClient.request({
                    method: "wallet_switchEthereumChain",
                    params: [{ chainId: "0x" + BigInt(chain.id).toString(16) }],
                });
            }
            catch (switchError) {
                // Unrecognized chain
                if (switchError.code === 4902) {
                    yield this.viemClient.request({
                        method: "wallet_addEthereumChain",
                        params: [
                            {
                                chainId: "0x" + BigInt(chain.id).toString(16),
                                chainName: chain.name,
                                rpcUrls: chain.rpcUrls.default.http,
                                nativeCurrency: chain.nativeCurrency,
                            },
                        ],
                    });
                    yield this.viemClient.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: "0x" + BigInt(chain.id).toString(16) }],
                    });
                }
                else {
                    throw switchError;
                }
            }
        }
    });
};

exports.Origin = Origin;
