'use strict';

var tslib_es6 = require('../../../node_modules/tslib/tslib.es6.js');
var DataNFT = require('./contracts/DataNFT.json.js');
var constants = require('../../constants.js');

/**
 * Mints a Data NFT with a signature.
 * @param to The address to mint the NFT to.
 * @param tokenId The ID of the token to mint.
 * @param parentId The ID of the parent NFT, if applicable.
 * @param hash The hash of the data associated with the NFT.
 * @param uri The URI of the NFT metadata.
 * @param licenseTerms The terms of the license for the NFT.
 * @param deadline The deadline for the minting operation.
 * @param signature The signature for the minting operation.
 * @returns A promise that resolves when the minting is complete.
 */
function mintWithSignature(to, tokenId, parentId, hash, uri, licenseTerms, deadline, signature) {
    return tslib_es6.__awaiter(this, void 0, void 0, function* () {
        return yield this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, DataNFT, "mintWithSignature", [to, tokenId, parentId, hash, uri, licenseTerms, deadline, signature], { waitForReceipt: true });
    });
}
/**
 * Registers a Data NFT with the Origin service in order to obtain a signature for minting.
 * @param source The source of the Data NFT (e.g., "spotify", "twitter", "tiktok", or "file").
 * @param deadline The deadline for the registration operation.
 * @param fileKey Optional file key for file uploads.
 * @return A promise that resolves with the registration data.
 */
function registerIpNFT(source, deadline, licenseTerms, metadata, fileKey, parentId) {
    return tslib_es6.__awaiter(this, void 0, void 0, function* () {
        const body = {
            source,
            deadline: Number(deadline),
            licenseTerms: {
                price: licenseTerms.price.toString(),
                duration: licenseTerms.duration,
                royaltyBps: licenseTerms.royaltyBps,
                paymentToken: licenseTerms.paymentToken,
            },
            metadata,
            parentId: Number(parentId) || 0,
        };
        if (fileKey !== undefined) {
            body.fileKey = fileKey;
        }
        const res = yield fetch(`${constants.AUTH_HUB_BASE_API}/auth/origin/register`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.getJwt()}`,
            },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            throw new Error(`Failed to get signature: ${res.statusText}`);
        }
        const data = yield res.json();
        if (data.isError) {
            throw new Error(`Failed to get signature: ${data.message}`);
        }
        return data.data;
    });
}

exports.mintWithSignature = mintWithSignature;
exports.registerIpNFT = registerIpNFT;
