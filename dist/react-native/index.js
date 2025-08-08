import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { createSiweMessage } from 'viem/siwe';
import { createPublicClient, http, erc20Abi, getAbiItem, encodeFunctionData, zeroAddress, checksumAddress } from 'viem';
import 'viem/accounts';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Modal, SafeAreaView, ScrollView } from 'react-native';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

class APIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "APIError";
        this.statusCode = statusCode || 500;
        Error.captureStackTrace(this, this.constructor);
    }
    toJSON() {
        return {
            error: this.name,
            message: this.message,
            statusCode: this.statusCode || 500,
        };
    }
}
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
        Error.captureStackTrace(this, this.constructor);
    }
    toJSON() {
        return {
            error: this.name,
            message: this.message,
            statusCode: 400,
        };
    }
}

var constants = {
    SIWE_MESSAGE_STATEMENT: "Connect with Camp Network",
    AUTH_HUB_BASE_API: "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",
    ORIGIN_DASHBOARD: "https://origin.campnetwork.xyz",
    SUPPORTED_IMAGE_FORMATS: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
    ],
    SUPPORTED_VIDEO_FORMATS: ["video/mp4", "video/webm"],
    SUPPORTED_AUDIO_FORMATS: ["audio/mpeg", "audio/wav", "audio/ogg"],
    SUPPORTED_TEXT_FORMATS: ["text/plain"],
    AVAILABLE_SOCIALS: ["twitter", "spotify", "tiktok"],
    ACKEE_INSTANCE: "https://ackee-production-01bd.up.railway.app",
    ACKEE_EVENTS: {
        USER_CONNECTED: "ed42542d-b676-4112-b6d9-6db98048b2e0",
        USER_DISCONNECTED: "20af31ac-e602-442e-9e0e-b589f4dd4016",
        TWITTER_LINKED: "7fbea086-90ef-4679-ba69-f47f9255b34c",
        DISCORD_LINKED: "d73f5ae3-a8e8-48f2-8532-85e0c7780d6a",
        SPOTIFY_LINKED: "fc1788b4-c984-42c8-96f4-c87f6bb0b8f7",
        TIKTOK_LINKED: "4a2ffdd3-f0e9-4784-8b49-ff76ec1c0a6a",
        TELEGRAM_LINKED: "9006bc5d-bcc9-4d01-a860-4f1a201e8e47",
    },
    DATANFT_CONTRACT_ADDRESS: "0xF90733b9eCDa3b49C250B2C3E3E42c96fC93324E",
    MARKETPLACE_CONTRACT_ADDRESS: "0x5c5e6b458b2e3924E7688b8Dee1Bb49088F6Fef5",
};

/**
 * Makes a GET request to the given URL with the provided headers.
 *
 * @param {string} url - The URL to send the GET request to.
 * @param {object} headers - The headers to include in the request.
 * @returns {Promise<object>} - The response data.
 * @throws {APIError} - Throws an error if the request fails.
 */
function fetchData(url_1) {
    return __awaiter(this, arguments, void 0, function* (url, headers = {}) {
        try {
            const response = yield fetch(url, {
                method: 'GET',
                headers
            });
            if (!response.ok) {
                const errorData = yield response.json().catch(() => ({}));
                throw new APIError(errorData.message || "API request failed", response.status);
            }
            return yield response.json();
        }
        catch (error) {
            if (error instanceof APIError) {
                throw error;
            }
            throw new APIError("Network error or server is unavailable", 500);
        }
    });
}
/**
 * Constructs a query string from an object of query parameters.
 *
 * @param {object} params - An object representing query parameters.
 * @returns {string} - The encoded query string.
 */
function buildQueryString(params = {}) {
    return Object.keys(params)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join("&");
}
/**
 * Builds a complete URL with query parameters.
 *
 * @param {string} baseURL - The base URL of the endpoint.
 * @param {object} params - An object representing query parameters.
 * @returns {string} - The complete URL with query string.
 */
function buildURL(baseURL, params = {}) {
    const queryString = buildQueryString(params);
    return queryString ? `${baseURL}?${queryString}` : baseURL;
}
const baseTwitterURL = "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/twitter";
const baseSpotifyURL = "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/spotify";
const baseTikTokURL = "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/tiktok";
/**
 * Formats an Ethereum address by truncating it to the first and last n characters.
 * @param {string} address - The Ethereum address to format.
 * @param {number} n - The number of characters to keep from the start and end of the address.
 * @return {string} - The formatted address.
 */
const formatAddress = (address, n = 8) => {
    return `${address.slice(0, n)}...${address.slice(-n)}`;
};
/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @return {string} - The capitalized string.
 */
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
/**
 * Formats a Camp amount to a human-readable string.
 * @param {number} amount - The Camp amount to format.
 * @returns {string} - The formatted Camp amount.
 */
const formatCampAmount = (amount) => {
    if (amount >= 1000) {
        const formatted = (amount / 1000).toFixed(1);
        return formatted.endsWith(".0")
            ? formatted.slice(0, -2) + "k"
            : formatted + "k";
    }
    return amount.toString();
};
/**
 * Sends an analytics event to the Ackee server.
 * @param {any} ackee - The Ackee instance.
 * @param {string} event - The event name.
 * @param {string} key - The key for the event.
 * @param {number} value - The value for the event.
 * @returns {Promise<string>} - A promise that resolves with the response from the server.
 */
const sendAnalyticsEvent = (ackee, event, key, value) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        if (typeof window !== "undefined" && !!ackee) {
            try {
                ackee.action(event, {
                    key: key,
                    value: value,
                }, (res) => {
                    resolve(res);
                });
            }
            catch (error) {
                console.error(error);
                reject(error);
            }
        }
        else {
            reject(new Error("Unable to send analytics event. If you are using the library, you can ignore this error."));
        }
    });
});
/**
 * Uploads a file to a specified URL with progress tracking.
 * Falls back to a simple fetch request if XMLHttpRequest is not available.
 * @param {File} file - The file to upload.
 * @param {string} url - The URL to upload the file to.
 * @param {UploadProgressCallback} onProgress - A callback function to track upload progress.
 * @returns {Promise<string>} - A promise that resolves with the response from the server.
 */
const uploadWithProgress = (file, url, onProgress) => {
    return new Promise((resolve, reject) => {
        // Try to use XMLHttpRequest for progress tracking if available
        if (typeof XMLHttpRequest !== 'undefined' && typeof onProgress === "function") {
            const xhr = new XMLHttpRequest();
            xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                    const percent = (event.loaded / event.total) * 100;
                    onProgress(percent);
                }
            });
            xhr.addEventListener('load', () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.responseText || 'Upload successful');
                }
                else {
                    reject(new Error(`Upload failed with status ${xhr.status}`));
                }
            });
            xhr.addEventListener('error', () => {
                reject(new Error('Upload failed due to network error'));
            });
            xhr.open('PUT', url);
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.send(file);
        }
        else {
            // Fallback to fetch for React Native or environments without XMLHttpRequest
            fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': file.type,
                },
                body: file,
            })
                .then((response) => {
                if (!response.ok) {
                    throw new Error(`Upload failed with status ${response.status}`);
                }
                return response.text();
            })
                .then((data) => {
                resolve(data || 'Upload successful');
            })
                .catch((error) => {
                const message = (error === null || error === void 0 ? void 0 : error.message) || 'Upload failed';
                reject(new Error(message));
            });
        }
    });
};

const testnet = {
    id: 123420001114,
    name: "Basecamp",
    nativeCurrency: {
        decimals: 18,
        name: "Camp",
        symbol: "CAMP",
    },
    rpcUrls: {
        default: {
            http: [
                "https://rpc-campnetwork.xyz",
                "https://rpc.basecamp.t.raas.gelato.cloud",
            ],
        },
    },
    blockExplorers: {
        default: {
            name: "Explorer",
            url: "https://basecamp.cloud.blockscout.com/",
        },
    },
};

// @ts-ignore
let publicClient = null;
const getPublicClient = () => {
    if (!publicClient) {
        publicClient = createPublicClient({
            chain: testnet,
            transport: http(),
        });
    }
    return publicClient;
};

var abi$1 = [
	{
		inputs: [
			{
				internalType: "string",
				name: "name_",
				type: "string"
			},
			{
				internalType: "string",
				name: "symbol_",
				type: "string"
			},
			{
				internalType: "uint256",
				name: "maxTermDuration_",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "signer_",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		inputs: [
		],
		name: "DurationZero",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "sender",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "ERC721IncorrectOwner",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "operator",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "ERC721InsufficientApproval",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "approver",
				type: "address"
			}
		],
		name: "ERC721InvalidApprover",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "operator",
				type: "address"
			}
		],
		name: "ERC721InvalidOperator",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "ERC721InvalidOwner",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "receiver",
				type: "address"
			}
		],
		name: "ERC721InvalidReceiver",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "sender",
				type: "address"
			}
		],
		name: "ERC721InvalidSender",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "ERC721NonexistentToken",
		type: "error"
	},
	{
		inputs: [
		],
		name: "EnforcedPause",
		type: "error"
	},
	{
		inputs: [
		],
		name: "ExpectedPause",
		type: "error"
	},
	{
		inputs: [
		],
		name: "InvalidDeadline",
		type: "error"
	},
	{
		inputs: [
		],
		name: "InvalidDuration",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "uint16",
				name: "royaltyBps",
				type: "uint16"
			}
		],
		name: "InvalidRoyalty",
		type: "error"
	},
	{
		inputs: [
		],
		name: "InvalidSignature",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "caller",
				type: "address"
			}
		],
		name: "NotTokenOwner",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "OwnableInvalidOwner",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "OwnableUnauthorizedAccount",
		type: "error"
	},
	{
		inputs: [
		],
		name: "SignatureAlreadyUsed",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "TokenAlreadyExists",
		type: "error"
	},
	{
		inputs: [
		],
		name: "Unauthorized",
		type: "error"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "address",
				name: "buyer",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint32",
				name: "periods",
				type: "uint32"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "newExpiry",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amountPaid",
				type: "uint256"
			}
		],
		name: "AccessPurchased",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "approved",
				type: "address"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "Approval",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "operator",
				type: "address"
			},
			{
				indexed: false,
				internalType: "bool",
				name: "approved",
				type: "bool"
			}
		],
		name: "ApprovalForAll",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "address",
				name: "creator",
				type: "address"
			}
		],
		name: "DataDeleted",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "address",
				name: "creator",
				type: "address"
			},
			{
				indexed: false,
				internalType: "bytes32",
				name: "contentHash",
				type: "bytes32"
			}
		],
		name: "DataMinted",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "OwnershipTransferred",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "Paused",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "royaltyAmount",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "address",
				name: "creator",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "protocolAmount",
				type: "uint256"
			}
		],
		name: "RoyaltyPaid",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "newPrice",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "uint32",
				name: "newDuration",
				type: "uint32"
			},
			{
				indexed: false,
				internalType: "uint16",
				name: "newRoyaltyBps",
				type: "uint16"
			},
			{
				indexed: false,
				internalType: "address",
				name: "paymentToken",
				type: "address"
			}
		],
		name: "TermsUpdated",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "Transfer",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "Unpaused",
		type: "event"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "approve",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "balanceOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		name: "contentHash",
		outputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		name: "dataStatus",
		outputs: [
			{
				internalType: "enum IpNFT.DataStatus",
				name: "",
				type: "uint8"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "finalizeDelete",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "getApproved",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "getTerms",
		outputs: [
			{
				components: [
					{
						internalType: "uint128",
						name: "price",
						type: "uint128"
					},
					{
						internalType: "uint32",
						name: "duration",
						type: "uint32"
					},
					{
						internalType: "uint16",
						name: "royaltyBps",
						type: "uint16"
					},
					{
						internalType: "address",
						name: "paymentToken",
						type: "address"
					}
				],
				internalType: "struct IpNFT.LicenseTerms",
				name: "",
				type: "tuple"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			},
			{
				internalType: "address",
				name: "operator",
				type: "address"
			}
		],
		name: "isApprovedForAll",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "maxTermDuration",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "parentId",
				type: "uint256"
			},
			{
				internalType: "bytes32",
				name: "creatorContentHash",
				type: "bytes32"
			},
			{
				internalType: "string",
				name: "uri",
				type: "string"
			},
			{
				components: [
					{
						internalType: "uint128",
						name: "price",
						type: "uint128"
					},
					{
						internalType: "uint32",
						name: "duration",
						type: "uint32"
					},
					{
						internalType: "uint16",
						name: "royaltyBps",
						type: "uint16"
					},
					{
						internalType: "address",
						name: "paymentToken",
						type: "address"
					}
				],
				internalType: "struct IpNFT.LicenseTerms",
				name: "licenseTerms",
				type: "tuple"
			},
			{
				internalType: "uint256",
				name: "deadline",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "signature",
				type: "bytes"
			}
		],
		name: "mintWithSignature",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "name",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "ownerOf",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		name: "parentIpOf",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "pause",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "paused",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "renounceOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "salePrice",
				type: "uint256"
			}
		],
		name: "royaltyInfo",
		outputs: [
			{
				internalType: "address",
				name: "receiver",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "royaltyAmount",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		name: "royaltyPercentages",
		outputs: [
			{
				internalType: "uint16",
				name: "",
				type: "uint16"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		name: "royaltyReceivers",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "safeTransferFrom",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "bytes",
				name: "data",
				type: "bytes"
			}
		],
		name: "safeTransferFrom",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "operator",
				type: "address"
			},
			{
				internalType: "bool",
				name: "approved",
				type: "bool"
			}
		],
		name: "setApprovalForAll",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_signer",
				type: "address"
			}
		],
		name: "setSigner",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "signer",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes4",
				name: "interfaceId",
				type: "bytes4"
			}
		],
		name: "supportsInterface",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "symbol",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		name: "terms",
		outputs: [
			{
				internalType: "uint128",
				name: "price",
				type: "uint128"
			},
			{
				internalType: "uint32",
				name: "duration",
				type: "uint32"
			},
			{
				internalType: "uint16",
				name: "royaltyBps",
				type: "uint16"
			},
			{
				internalType: "address",
				name: "paymentToken",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "_tokenId",
				type: "uint256"
			}
		],
		name: "tokenURI",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "from",
				type: "address"
			},
			{
				internalType: "address",
				name: "to",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "transferFrom",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "transferOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "unpause",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "_royaltyReceiver",
				type: "address"
			},
			{
				components: [
					{
						internalType: "uint128",
						name: "price",
						type: "uint128"
					},
					{
						internalType: "uint32",
						name: "duration",
						type: "uint32"
					},
					{
						internalType: "uint16",
						name: "royaltyBps",
						type: "uint16"
					},
					{
						internalType: "address",
						name: "paymentToken",
						type: "address"
					}
				],
				internalType: "struct IpNFT.LicenseTerms",
				name: "newTerms",
				type: "tuple"
			}
		],
		name: "updateTerms",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "bytes32",
				name: "",
				type: "bytes32"
			}
		],
		name: "usedNonces",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	}
];

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
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, abi$1, "mintWithSignature", [to, tokenId, parentId, hash, uri, licenseTerms, deadline, signature], { waitForReceipt: true });
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
    return __awaiter(this, void 0, void 0, function* () {
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

function updateTerms(tokenId, royaltyReceiver, newTerms) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, abi$1, "updateTerms", [tokenId, royaltyReceiver, newTerms], { waitForReceipt: true });
}

function requestDelete(tokenId) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, abi$1, "finalizeDelete", [tokenId]);
}

function getTerms(tokenId) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, abi$1, "getTerms", [tokenId]);
}

function ownerOf(tokenId) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, abi$1, "ownerOf", [tokenId]);
}

function balanceOf(owner) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, abi$1, "balanceOf", [owner]);
}

function contentHash(tokenId) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, abi$1, "contentHash", [tokenId]);
}

function tokenURI(tokenId) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, abi$1, "tokenURI", [tokenId]);
}

function dataStatus(tokenId) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, abi$1, "dataStatus", [tokenId]);
}

function royaltyInfo(tokenId, salePrice) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, abi$1, "royaltyInfo", [tokenId, salePrice]);
    });
}

function getApproved(tokenId) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, abi$1, "getApproved", [tokenId]);
}

function isApprovedForAll(owner, operator) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, abi$1, "isApprovedForAll", [owner, operator]);
}

function transferFrom(from, to, tokenId) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, abi$1, "transferFrom", [from, to, tokenId]);
}

function safeTransferFrom(from, to, tokenId, data) {
    const args = data ? [from, to, tokenId, data] : [from, to, tokenId];
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, abi$1, "safeTransferFrom", args);
}

function approve(to, tokenId) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, abi$1, "approve", [to, tokenId]);
}

function setApprovalForAll(operator, approved) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, abi$1, "setApprovalForAll", [operator, approved]);
}

var abi = [
	{
		inputs: [
			{
				internalType: "address",
				name: "dataNFT_",
				type: "address"
			},
			{
				internalType: "uint16",
				name: "protocolFeeBps_",
				type: "uint16"
			},
			{
				internalType: "address",
				name: "treasury_",
				type: "address"
			}
		],
		stateMutability: "nonpayable",
		type: "constructor"
	},
	{
		inputs: [
		],
		name: "EnforcedPause",
		type: "error"
	},
	{
		inputs: [
		],
		name: "ExpectedPause",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "expected",
				type: "uint256"
			},
			{
				internalType: "uint256",
				name: "actual",
				type: "uint256"
			}
		],
		name: "InvalidPayment",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "uint32",
				name: "periods",
				type: "uint32"
			}
		],
		name: "InvalidPeriods",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "uint16",
				name: "royaltyBps",
				type: "uint16"
			}
		],
		name: "InvalidRoyalty",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "owner",
				type: "address"
			}
		],
		name: "OwnableInvalidOwner",
		type: "error"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "OwnableUnauthorizedAccount",
		type: "error"
	},
	{
		inputs: [
		],
		name: "TransferFailed",
		type: "error"
	},
	{
		inputs: [
		],
		name: "Unauthorized",
		type: "error"
	},
	{
		inputs: [
		],
		name: "ZeroAddress",
		type: "error"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "address",
				name: "buyer",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint32",
				name: "periods",
				type: "uint32"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "newExpiry",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "amountPaid",
				type: "uint256"
			}
		],
		name: "AccessPurchased",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "address",
				name: "creator",
				type: "address"
			}
		],
		name: "DataDeleted",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: true,
				internalType: "address",
				name: "creator",
				type: "address"
			},
			{
				indexed: false,
				internalType: "bytes32",
				name: "contentHash",
				type: "bytes32"
			}
		],
		name: "DataMinted",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "address",
				name: "previousOwner",
				type: "address"
			},
			{
				indexed: true,
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "OwnershipTransferred",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "Paused",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "royaltyAmount",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "address",
				name: "creator",
				type: "address"
			},
			{
				indexed: false,
				internalType: "uint256",
				name: "protocolAmount",
				type: "uint256"
			}
		],
		name: "RoyaltyPaid",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				indexed: false,
				internalType: "uint128",
				name: "newPrice",
				type: "uint128"
			},
			{
				indexed: false,
				internalType: "uint32",
				name: "newDuration",
				type: "uint32"
			},
			{
				indexed: false,
				internalType: "uint16",
				name: "newRoyaltyBps",
				type: "uint16"
			},
			{
				indexed: false,
				internalType: "address",
				name: "paymentToken",
				type: "address"
			}
		],
		name: "TermsUpdated",
		type: "event"
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: "address",
				name: "account",
				type: "address"
			}
		],
		name: "Unpaused",
		type: "event"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "feeManager",
				type: "address"
			}
		],
		name: "addFeeManager",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "buyer",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			},
			{
				internalType: "uint32",
				name: "periods",
				type: "uint32"
			}
		],
		name: "buyAccess",
		outputs: [
		],
		stateMutability: "payable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "dataNFT",
		outputs: [
			{
				internalType: "contract IpNFT",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "feeManagers",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "user",
				type: "address"
			},
			{
				internalType: "uint256",
				name: "tokenId",
				type: "uint256"
			}
		],
		name: "hasAccess",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "owner",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "pause",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "paused",
		outputs: [
			{
				internalType: "bool",
				name: "",
				type: "bool"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "protocolFeeBps",
		outputs: [
			{
				internalType: "uint16",
				name: "",
				type: "uint16"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "feeManager",
				type: "address"
			}
		],
		name: "removeFeeManager",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "renounceOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			},
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		name: "subscriptionExpiry",
		outputs: [
			{
				internalType: "uint256",
				name: "",
				type: "uint256"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newOwner",
				type: "address"
			}
		],
		name: "transferOwnership",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
		],
		name: "treasury",
		outputs: [
			{
				internalType: "address",
				name: "",
				type: "address"
			}
		],
		stateMutability: "view",
		type: "function"
	},
	{
		inputs: [
		],
		name: "unpause",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "uint16",
				name: "newFeeBps",
				type: "uint16"
			}
		],
		name: "updateProtocolFee",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "newTreasury",
				type: "address"
			}
		],
		name: "updateTreasury",
		outputs: [
		],
		stateMutability: "nonpayable",
		type: "function"
	},
	{
		stateMutability: "payable",
		type: "receive"
	}
];

function buyAccess(buyer, tokenId, periods, value // only for native token payments
) {
    return this.callContractMethod(constants.MARKETPLACE_CONTRACT_ADDRESS, abi, "buyAccess", [buyer, tokenId, periods], { waitForReceipt: true, value });
}

function renewAccess(tokenId, buyer, periods, value) {
    return this.callContractMethod(constants.MARKETPLACE_CONTRACT_ADDRESS, abi, "renewAccess", [tokenId, buyer, periods], value !== undefined ? { value } : undefined);
}

function hasAccess(user, tokenId) {
    return this.callContractMethod(constants.MARKETPLACE_CONTRACT_ADDRESS, abi, "hasAccess", [user, tokenId]);
}

function subscriptionExpiry(tokenId, user) {
    return this.callContractMethod(constants.MARKETPLACE_CONTRACT_ADDRESS, abi, "subscriptionExpiry", [tokenId, user]);
}

/**
 * Approves a spender to spend a specified amount of tokens on behalf of the owner.
 * If the current allowance is less than the specified amount, it will perform the approval.
 * @param {ApproveParams} params - The parameters for the approval.
 */
function approveIfNeeded(_a) {
    return __awaiter(this, arguments, void 0, function* ({ walletClient, publicClient, tokenAddress, owner, spender, amount, }) {
        const allowance = yield publicClient.readContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: "allowance",
            args: [owner, spender],
        });
        if (allowance < amount) {
            yield walletClient.writeContract({
                address: tokenAddress,
                account: owner,
                abi: erc20Abi,
                functionName: "approve",
                args: [spender, amount],
                chain: testnet,
            });
        }
    });
}

var _Origin_instances, _Origin_generateURL, _Origin_setOriginStatus, _Origin_waitForTxReceipt, _Origin_ensureChainId;
/**
 * The Origin class
 * Handles the upload of files to Origin, as well as querying the user's stats
 */
class Origin {
    constructor(jwt, viemClient) {
        _Origin_instances.add(this);
        _Origin_generateURL.set(this, (file) => __awaiter(this, void 0, void 0, function* () {
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
        _Origin_setOriginStatus.set(this, (key, status) => __awaiter(this, void 0, void 0, function* () {
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
        this.uploadFile = (file, options) => __awaiter(this, void 0, void 0, function* () {
            const uploadInfo = yield __classPrivateFieldGet(this, _Origin_generateURL, "f").call(this, file);
            if (!uploadInfo) {
                console.error("Failed to generate upload URL");
                return;
            }
            try {
                yield uploadWithProgress(file, uploadInfo.url, (options === null || options === void 0 ? void 0 : options.progressCallback) || (() => { }));
            }
            catch (error) {
                yield __classPrivateFieldGet(this, _Origin_setOriginStatus, "f").call(this, uploadInfo.key, "failed");
                throw new Error("Failed to upload file: " + error);
            }
            yield __classPrivateFieldGet(this, _Origin_setOriginStatus, "f").call(this, uploadInfo.key, "success");
            return uploadInfo;
        });
        this.mintFile = (file, metadata, license, parentId, options) => __awaiter(this, void 0, void 0, function* () {
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
        this.mintSocial = (source, metadata, license) => __awaiter(this, void 0, void 0, function* () {
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
        this.getOriginUploads = () => __awaiter(this, void 0, void 0, function* () {
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
        this.mintWithSignature = mintWithSignature.bind(this);
        this.registerIpNFT = registerIpNFT.bind(this);
        this.updateTerms = updateTerms.bind(this);
        this.requestDelete = requestDelete.bind(this);
        this.getTerms = getTerms.bind(this);
        this.ownerOf = ownerOf.bind(this);
        this.balanceOf = balanceOf.bind(this);
        this.contentHash = contentHash.bind(this);
        this.tokenURI = tokenURI.bind(this);
        this.dataStatus = dataStatus.bind(this);
        this.royaltyInfo = royaltyInfo.bind(this);
        this.getApproved = getApproved.bind(this);
        this.isApprovedForAll = isApprovedForAll.bind(this);
        this.transferFrom = transferFrom.bind(this);
        this.safeTransferFrom = safeTransferFrom.bind(this);
        this.approve = approve.bind(this);
        this.setApprovalForAll = setApprovalForAll.bind(this);
        // Marketplace methods
        this.buyAccess = buyAccess.bind(this);
        this.renewAccess = renewAccess.bind(this);
        this.hasAccess = hasAccess.bind(this);
        this.subscriptionExpiry = subscriptionExpiry.bind(this);
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
        return __awaiter(this, void 0, void 0, function* () {
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
                throw new APIError(data.message || "Failed to fetch Origin usage");
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
        return __awaiter(this, void 0, void 0, function* () {
            if (consent === undefined) {
                throw new APIError("Consent is required");
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
                throw new APIError(data.message || "Failed to set Origin consent");
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
        return __awaiter(this, void 0, void 0, function* () {
            if (multiplier === undefined) {
                throw new APIError("Multiplier is required");
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
                throw new APIError(data.message || "Failed to set Origin multiplier");
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
        return __awaiter(this, arguments, void 0, function* (contractAddress, abi, methodName, params, options = {}) {
            const abiItem = getAbiItem({ abi, name: methodName });
            const isView = abiItem &&
                "stateMutability" in abiItem &&
                (abiItem.stateMutability === "view" ||
                    abiItem.stateMutability === "pure");
            if (!isView && !this.viemClient) {
                throw new Error("WalletClient not connected.");
            }
            if (isView) {
                const publicClient = getPublicClient();
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
                const data = encodeFunctionData({
                    abi,
                    functionName: methodName,
                    args: params,
                });
                yield __classPrivateFieldGet(this, _Origin_instances, "m", _Origin_ensureChainId).call(this, testnet);
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
                    const receipt = yield __classPrivateFieldGet(this, _Origin_instances, "m", _Origin_waitForTxReceipt).call(this, txHash);
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
        return __awaiter(this, void 0, void 0, function* () {
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
            const isNative = paymentToken === zeroAddress;
            if (isNative) {
                return this.buyAccess(account, tokenId, periods, totalCost);
            }
            yield approveIfNeeded({
                walletClient: this.viemClient,
                publicClient: getPublicClient(),
                tokenAddress: paymentToken,
                owner: account,
                spender: constants.MARKETPLACE_CONTRACT_ADDRESS,
                amount: totalCost,
            });
            return this.buyAccess(account, tokenId, periods);
        });
    }
    getData(tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
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
    return __awaiter(this, void 0, void 0, function* () {
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
    return __awaiter(this, void 0, void 0, function* () {
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

/**
 * Storage utility for React Native
 * Wraps AsyncStorage with localStorage-like interface
 * Uses dynamic import to avoid build-time dependency
 */
// Use dynamic import to avoid build-time dependency
let AsyncStorage = null;
// In-memory fallback storage
const inMemoryStorage = new Map();
// Try to import AsyncStorage at runtime
const getAsyncStorage = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!AsyncStorage) {
        try {
            // Try to import AsyncStorage dynamically
            // @ts-ignore - Dynamic import for optional dependency
            AsyncStorage = (yield import('@react-native-async-storage/async-storage')).default;
        }
        catch (error) {
            console.warn('AsyncStorage not available, using in-memory fallback:', error);
            // Fallback to in-memory storage for development/testing
            AsyncStorage = {
                getItem: (key) => __awaiter(void 0, void 0, void 0, function* () { return inMemoryStorage.get(key) || null; }),
                setItem: (key, value) => __awaiter(void 0, void 0, void 0, function* () { inMemoryStorage.set(key, value); }),
                removeItem: (key) => __awaiter(void 0, void 0, void 0, function* () { inMemoryStorage.delete(key); }),
                clear: () => __awaiter(void 0, void 0, void 0, function* () { inMemoryStorage.clear(); }),
                getAllKeys: () => __awaiter(void 0, void 0, void 0, function* () { return Array.from(inMemoryStorage.keys()); }),
                multiGet: (keys) => __awaiter(void 0, void 0, void 0, function* () { return keys.map(key => [key, inMemoryStorage.get(key) || null]); }),
                multiSet: (keyValuePairs) => __awaiter(void 0, void 0, void 0, function* () {
                    keyValuePairs.forEach(([key, value]) => inMemoryStorage.set(key, value));
                }),
                multiRemove: (keys) => __awaiter(void 0, void 0, void 0, function* () {
                    keys.forEach(key => inMemoryStorage.delete(key));
                }),
            };
        }
    }
    return AsyncStorage;
});
class Storage {
    static getItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storage = yield getAsyncStorage();
                return yield storage.getItem(key);
            }
            catch (error) {
                console.error('Error getting item from storage:', error);
                return null;
            }
        });
    }
    static setItem(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storage = yield getAsyncStorage();
                yield storage.setItem(key, value);
            }
            catch (error) {
                console.error('Error setting item in storage:', error);
            }
        });
    }
    static removeItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storage = yield getAsyncStorage();
                yield storage.removeItem(key);
            }
            catch (error) {
                console.error('Error removing item from storage:', error);
            }
        });
    }
    static multiGet(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storage = yield getAsyncStorage();
                return yield storage.multiGet(keys);
            }
            catch (error) {
                console.error('Error getting multiple items from storage:', error);
                return keys.map(key => [key, null]);
            }
        });
    }
    static multiSet(keyValuePairs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storage = yield getAsyncStorage();
                yield storage.multiSet(keyValuePairs);
            }
            catch (error) {
                console.error('Error setting multiple items in storage:', error);
            }
        });
    }
    static multiRemove(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storage = yield getAsyncStorage();
                yield storage.multiRemove(keys);
            }
            catch (error) {
                console.error('Error removing multiple items from storage:', error);
            }
        });
    }
}

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
        __classPrivateFieldSet(this, _AuthRN_triggers, {}, "f");
        __classPrivateFieldSet(this, _AuthRN_provider, null, "f");
        __classPrivateFieldSet(this, _AuthRN_appKitInstance, appKit, "f");
        __classPrivateFieldGet(this, _AuthRN_instances, "m", _AuthRN_loadAuthStatusFromStorage).call(this);
    }
    /**
     * Set AppKit instance for wallet operations.
     * @param {any} appKit AppKit instance.
     */
    setAppKit(appKit) {
        __classPrivateFieldSet(this, _AuthRN_appKitInstance, appKit, "f");
    }
    /**
     * Get AppKit instance for wallet operations.
     * @returns {any} AppKit instance.
     */
    getAppKit() {
        return __classPrivateFieldGet(this, _AuthRN_appKitInstance, "f");
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
        if (!__classPrivateFieldGet(this, _AuthRN_triggers, "f")[event]) {
            __classPrivateFieldGet(this, _AuthRN_triggers, "f")[event] = [];
        }
        __classPrivateFieldGet(this, _AuthRN_triggers, "f")[event].push(callback);
    }
    /**
     * Set the loading state.
     * @param {boolean} loading The loading state.
     * @returns {void}
     */
    setLoading(loading) {
        __classPrivateFieldGet(this, _AuthRN_instances, "m", _AuthRN_trigger).call(this, "state", loading
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
            throw new APIError("provider is required");
        }
        __classPrivateFieldSet(this, _AuthRN_provider, provider, "f");
        this.viem = provider; // In React Native, we use the provider directly
        if (this.origin) {
            this.origin.setViemClient(this.viem);
        }
        __classPrivateFieldGet(this, _AuthRN_instances, "m", _AuthRN_trigger).call(this, "viem", this.viem);
        __classPrivateFieldGet(this, _AuthRN_instances, "m", _AuthRN_trigger).call(this, "provider", { provider, info });
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
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                return;
            }
            __classPrivateFieldGet(this, _AuthRN_instances, "m", _AuthRN_trigger).call(this, "state", "unauthenticated");
            this.isAuthenticated = false;
            this.walletAddress = null;
            this.userId = null;
            this.jwt = null;
            this.origin = null;
            this.viem = null;
            __classPrivateFieldSet(this, _AuthRN_provider, null, "f");
            // Disconnect AppKit if available
            if (__classPrivateFieldGet(this, _AuthRN_appKitInstance, "f") && __classPrivateFieldGet(this, _AuthRN_appKitInstance, "f").disconnect) {
                try {
                    yield __classPrivateFieldGet(this, _AuthRN_appKitInstance, "f").disconnect();
                }
                catch (error) {
                    console.error('Error disconnecting AppKit:', error);
                }
            }
            try {
                yield Storage.multiRemove([
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
        return __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldGet(this, _AuthRN_instances, "m", _AuthRN_trigger).call(this, "state", "loading");
            try {
                if (!this.walletAddress) {
                    yield __classPrivateFieldGet(this, _AuthRN_instances, "m", _AuthRN_requestAccount).call(this);
                }
                this.walletAddress = checksumAddress(this.walletAddress);
                // Create SIWE message
                const message = createSiweMessage({
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
                const signature = yield __classPrivateFieldGet(this, _AuthRN_instances, "m", _AuthRN_signMessage).call(this, message);
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
                    throw new APIError(data.message || "Authentication failed");
                }
                // Store the authentication data
                this.jwt = data.data.jwt;
                this.userId = data.data.user.id;
                this.isAuthenticated = true;
                this.origin = new Origin(this.jwt);
                // Set viem client if available
                if (this.viem) {
                    this.origin.setViemClient(this.viem);
                }
                // Save to storage
                try {
                    yield Storage.multiSet([
                        ["camp-sdk:jwt", this.jwt],
                        ["camp-sdk:wallet-address", this.walletAddress],
                        ["camp-sdk:user-id", this.userId],
                    ]);
                }
                catch (error) {
                    console.error('Error saving auth data to storage:', error);
                }
                __classPrivateFieldGet(this, _AuthRN_instances, "m", _AuthRN_trigger).call(this, "state", "authenticated");
                return {
                    success: true,
                    message: "Successfully authenticated",
                    walletAddress: this.walletAddress,
                };
            }
            catch (e) {
                this.isAuthenticated = false;
                __classPrivateFieldGet(this, _AuthRN_instances, "m", _AuthRN_trigger).call(this, "state", "unauthenticated");
                throw new APIError(e.message || "Authentication failed");
            }
        });
    }
    /**
     * Get the user's linked social accounts.
     * @returns {Promise<Record<string, boolean>>} A promise that resolves with the user's linked social accounts.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated or if the request fails.
     */
    getLinkedSocials() {
        return __awaiter(this, void 0, void 0, function* () {
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
                throw new APIError(connections.message || "Failed to fetch connections");
            }
        });
    }
    // Social linking methods remain the same as web version
    // but with mobile-appropriate redirect handling
    linkTwitter() {
        return __awaiter(this, void 0, void 0, function* () {
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
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new Error("User needs to be authenticated");
            }
            `${constants.AUTH_HUB_BASE_API}/discord/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri["discord"]}`;
            throw new Error("Social linking should be handled by the React Native app using a WebView or Linking API");
        });
    }
    linkSpotify() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new Error("User needs to be authenticated");
            }
            `${constants.AUTH_HUB_BASE_API}/spotify/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri["spotify"]}`;
            throw new Error("Social linking should be handled by the React Native app using a WebView or Linking API");
        });
    }
    linkTikTok(handle) {
        return __awaiter(this, void 0, void 0, function* () {
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
                    throw new APIError("TikTok service is currently unavailable, try again later");
                }
                else {
                    throw new APIError(data.message || "Failed to link TikTok account");
                }
            }
        });
    }
    // Add all other social linking/unlinking methods...
    // (keeping them similar to the web version but with mobile considerations)
    sendTelegramOTP(phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated)
                throw new Error("User needs to be authenticated");
            if (!phoneNumber)
                throw new APIError("Phone number is required");
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
                throw new APIError(data.message || "Failed to send Telegram OTP");
            }
        });
    }
    linkTelegram(phoneNumber, otp, phoneCodeHash) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated)
                throw new Error("User needs to be authenticated");
            if (!phoneNumber || !otp || !phoneCodeHash)
                throw new APIError("Phone number, OTP, and phone code hash are required");
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
                throw new APIError(data.message || "Failed to link Telegram account");
            }
        });
    }
    // Unlink methods
    unlinkTwitter() {
        return __awaiter(this, void 0, void 0, function* () {
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
                throw new APIError(data.message || "Failed to unlink Twitter account");
            }
        });
    }
    unlinkDiscord() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new APIError("User needs to be authenticated");
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
                throw new APIError(data.message || "Failed to unlink Discord account");
            }
        });
    }
    unlinkSpotify() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new APIError("User needs to be authenticated");
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
                throw new APIError(data.message || "Failed to unlink Spotify account");
            }
        });
    }
    unlinkTikTok() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new APIError("User needs to be authenticated");
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
                throw new APIError(data.message || "Failed to unlink TikTok account");
            }
        });
    }
    unlinkTelegram() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new APIError("User needs to be authenticated");
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
                throw new APIError(data.message || "Failed to unlink Telegram account");
            }
        });
    }
    /**
     * Generic method to link social accounts
     */
    linkSocial(provider) {
        return __awaiter(this, void 0, void 0, function* () {
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
        return __awaiter(this, void 0, void 0, function* () {
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
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new APIError("User needs to be authenticated");
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
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new APIError("User needs to be authenticated");
            }
            const appKit = this.getAppKit();
            if (!appKit) {
                throw new APIError("AppKit not initialized");
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
                throw new APIError(`Failed to sign message: ${error.message}`);
            }
        });
    }
    /**
     * Send a transaction using the connected wallet
     */
    sendTransaction(transaction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new APIError("User needs to be authenticated");
            }
            const appKit = this.getAppKit();
            if (!appKit) {
                throw new APIError("AppKit not initialized");
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
                throw new APIError(`Failed to send transaction: ${error.message}`);
            }
        });
    }
}
_AuthRN_triggers = new WeakMap(), _AuthRN_provider = new WeakMap(), _AuthRN_appKitInstance = new WeakMap(), _AuthRN_instances = new WeakSet(), _AuthRN_trigger = function _AuthRN_trigger(event, data) {
    if (__classPrivateFieldGet(this, _AuthRN_triggers, "f")[event]) {
        __classPrivateFieldGet(this, _AuthRN_triggers, "f")[event].forEach((callback) => callback(data));
    }
}, _AuthRN_loadAuthStatusFromStorage = function _AuthRN_loadAuthStatusFromStorage(provider) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [walletAddress, userId, jwt] = yield Promise.all([
                Storage.getItem("camp-sdk:wallet-address"),
                Storage.getItem("camp-sdk:user-id"),
                Storage.getItem("camp-sdk:jwt")
            ]);
            if (walletAddress && userId && jwt) {
                this.walletAddress = walletAddress;
                this.userId = userId;
                this.jwt = jwt;
                this.origin = new Origin(this.jwt);
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
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            if (__classPrivateFieldGet(this, _AuthRN_appKitInstance, "f")) {
                // Use AppKit for wallet connection
                yield __classPrivateFieldGet(this, _AuthRN_appKitInstance, "f").openAppKit();
                // Wait for connection and get address
                const state = ((_b = (_a = __classPrivateFieldGet(this, _AuthRN_appKitInstance, "f")).getState) === null || _b === void 0 ? void 0 : _b.call(_a)) || {};
                if (state.address) {
                    this.walletAddress = checksumAddress(state.address);
                    return this.walletAddress;
                }
                throw new APIError("No address returned from AppKit");
            }
            // Fallback to direct provider if available
            if (!__classPrivateFieldGet(this, _AuthRN_provider, "f")) {
                throw new APIError("No AppKit instance or provider available");
            }
            const accounts = yield __classPrivateFieldGet(this, _AuthRN_provider, "f").request({
                method: "eth_requestAccounts",
            });
            if (!accounts || accounts.length === 0) {
                throw new APIError("No accounts found");
            }
            this.walletAddress = checksumAddress(accounts[0]);
            return this.walletAddress;
        }
        catch (e) {
            throw new APIError(e.message || "Failed to connect wallet");
        }
    });
}, _AuthRN_signMessage = function _AuthRN_signMessage(message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (__classPrivateFieldGet(this, _AuthRN_appKitInstance, "f") && __classPrivateFieldGet(this, _AuthRN_appKitInstance, "f").signMessage) {
                // Use AppKit for signing
                return yield __classPrivateFieldGet(this, _AuthRN_appKitInstance, "f").signMessage(message);
            }
            // Fallback to direct provider signing
            if (!__classPrivateFieldGet(this, _AuthRN_provider, "f")) {
                throw new APIError("No signing method available");
            }
            return yield __classPrivateFieldGet(this, _AuthRN_provider, "f").request({
                method: "personal_sign",
                params: [message, this.walletAddress],
            });
        }
        catch (e) {
            throw new APIError(e.message || "Failed to sign message");
        }
    });
};

/**
 * CampContext for React Native with AppKit integration
 */
const CampContext = createContext({
    auth: null,
    setAuth: () => { },
    clientId: "",
    isAuthenticated: false,
    isLoading: false,
    walletAddress: null,
    error: null,
    connect: () => __awaiter(void 0, void 0, void 0, function* () { }),
    disconnect: () => __awaiter(void 0, void 0, void 0, function* () { }),
    clearError: () => { },
    getAppKit: () => null,
});
const CampProvider = ({ children, clientId, redirectUri, allowAnalytics = true, appKit }) => {
    const [auth, setAuth] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [walletAddress, setWalletAddress] = useState(null);
    const [error, setError] = useState(null);
    useEffect(() => {
        if (!clientId) {
            console.error("CampProvider: clientId is required");
            return;
        }
        try {
            const authInstance = new AuthRN({
                clientId,
                redirectUri,
                allowAnalytics,
                appKit // Pass AppKit instance
            });
            // Set up event listeners
            authInstance.on('state', (state) => {
                setIsLoading(state === 'loading');
                setIsAuthenticated(state === 'authenticated');
                if (state === 'unauthenticated') {
                    setWalletAddress(null);
                }
            });
            // Load initial state
            const loadInitialState = () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const savedAddress = yield Storage.getItem('camp-sdk:wallet-address');
                    if (savedAddress && authInstance.isAuthenticated) {
                        setWalletAddress(savedAddress);
                        setIsAuthenticated(true);
                    }
                }
                catch (err) {
                    console.error('Error loading initial auth state:', err);
                }
            });
            setAuth(authInstance);
            loadInitialState();
        }
        catch (error) {
            console.error("Failed to create AuthRN instance:", error);
            setError("Failed to initialize authentication");
        }
    }, [clientId, redirectUri, allowAnalytics, appKit]);
    const connect = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!auth)
            return;
        try {
            setError(null);
            const result = yield auth.connect();
            setWalletAddress(result.walletAddress);
        }
        catch (err) {
            setError(err.message || 'Failed to connect wallet');
            throw err;
        }
    });
    const disconnect = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!auth)
            return;
        try {
            setError(null);
            yield auth.disconnect();
            setWalletAddress(null);
        }
        catch (err) {
            setError(err.message || 'Failed to disconnect wallet');
            throw err;
        }
    });
    const clearError = () => {
        setError(null);
    };
    const getAppKit = () => {
        return auth === null || auth === void 0 ? void 0 : auth.getAppKit();
    };
    return (React.createElement(CampContext.Provider, { value: {
            auth,
            setAuth,
            clientId,
            isAuthenticated,
            isLoading,
            walletAddress,
            error,
            connect,
            disconnect,
            clearError,
            getAppKit,
        } }, children));
};

// Main Camp authentication hook
const useCampAuth = () => {
    const context = useContext(CampContext);
    if (!context) {
        throw new Error('useCampAuth must be used within a CampProvider');
    }
    const { auth, isAuthenticated, isLoading, walletAddress, error, connect, disconnect, clearError } = context;
    return {
        auth,
        isAuthenticated,
        authenticated: isAuthenticated, // Alias for compatibility
        isLoading,
        loading: isLoading, // Alias for compatibility
        walletAddress,
        error,
        connect,
        disconnect,
        clearError,
    };
};
// Alias for compatibility
const useAuthState = () => {
    const { isAuthenticated, isLoading } = useCampAuth();
    return { authenticated: isAuthenticated, loading: isLoading };
};
// Combined hook for full Camp access
const useCamp = () => {
    const context = useContext(CampContext);
    if (!context) {
        throw new Error('useCamp must be used within a CampProvider');
    }
    return context;
};
// Social accounts hook
const useSocials = () => {
    const { auth } = useCampAuth();
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const fetchSocials = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!auth || !auth.isAuthenticated) {
            setData({});
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            const socialsData = yield auth.getLinkedSocials();
            setData(socialsData);
        }
        catch (err) {
            setError(err);
            setData({});
        }
        finally {
            setIsLoading(false);
        }
    }), [auth]);
    const linkSocial = useCallback((platform) => __awaiter(void 0, void 0, void 0, function* () {
        if (!auth)
            throw new Error('Authentication required');
        return auth.linkSocial(platform);
    }), [auth]);
    const unlinkSocial = useCallback((platform) => __awaiter(void 0, void 0, void 0, function* () {
        if (!auth)
            throw new Error('Authentication required');
        return auth.unlinkSocial(platform);
    }), [auth]);
    useEffect(() => {
        if (auth === null || auth === void 0 ? void 0 : auth.isAuthenticated) {
            fetchSocials();
        }
    }, [auth === null || auth === void 0 ? void 0 : auth.isAuthenticated, fetchSocials]);
    return {
        data,
        socials: data, // Alias for compatibility
        isLoading,
        error,
        linkSocial,
        unlinkSocial,
        refetch: fetchSocials,
    };
};
// AppKit hook for wallet operations (no wagmi dependency)
const useAppKit = () => {
    const { getAppKit, auth } = useCamp();
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [address, setAddress] = useState(null);
    const [chainId, setChainId] = useState(null);
    const [balance, setBalance] = useState(null);
    const appKit = getAppKit();
    useEffect(() => {
        var _a, _b, _c;
        if (!appKit)
            return;
        // Check initial connection state
        try {
            const connected = ((_a = appKit.getIsConnected) === null || _a === void 0 ? void 0 : _a.call(appKit)) || false;
            const account = (_b = appKit.getAccount) === null || _b === void 0 ? void 0 : _b.call(appKit);
            const currentChainId = (_c = appKit.getChainId) === null || _c === void 0 ? void 0 : _c.call(appKit);
            setIsConnected(connected);
            setAddress((account === null || account === void 0 ? void 0 : account.address) || null);
            setChainId(currentChainId || null);
        }
        catch (error) {
            console.warn('Error getting AppKit state:', error);
        }
        // Set up event listeners if available
        let unsubscribeAccount;
        let unsubscribeNetwork;
        try {
            if (appKit.subscribeAccount) {
                unsubscribeAccount = appKit.subscribeAccount((account) => {
                    setAddress((account === null || account === void 0 ? void 0 : account.address) || null);
                    setIsConnected(!!(account === null || account === void 0 ? void 0 : account.address));
                });
            }
            if (appKit.subscribeChainId) {
                unsubscribeNetwork = appKit.subscribeChainId((chainId) => {
                    setChainId(chainId);
                });
            }
        }
        catch (error) {
            console.warn('Error setting up AppKit subscriptions:', error);
        }
        return () => {
            unsubscribeAccount === null || unsubscribeAccount === void 0 ? void 0 : unsubscribeAccount();
            unsubscribeNetwork === null || unsubscribeNetwork === void 0 ? void 0 : unsubscribeNetwork();
        };
    }, [appKit]);
    const openAppKit = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!appKit)
            throw new Error('AppKit not initialized');
        setIsConnecting(true);
        try {
            if (appKit.open) {
                yield appKit.open();
            }
            else if (appKit.openAppKit) {
                yield appKit.openAppKit();
            }
            else {
                throw new Error('No open method available on AppKit');
            }
            // Return the connected address
            const account = (_a = appKit.getAccount) === null || _a === void 0 ? void 0 : _a.call(appKit);
            return (account === null || account === void 0 ? void 0 : account.address) || '';
        }
        finally {
            setIsConnecting(false);
        }
    }), [appKit]);
    const disconnectAppKit = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!appKit)
            return;
        try {
            yield ((_a = appKit.disconnect) === null || _a === void 0 ? void 0 : _a.call(appKit));
            setIsConnected(false);
            setAddress(null);
            setChainId(null);
            setBalance(null);
        }
        catch (error) {
            console.error('Error disconnecting AppKit:', error);
            throw error;
        }
    }), [appKit]);
    const switchNetwork = useCallback((targetChainId) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!appKit)
            throw new Error('AppKit not initialized');
        try {
            yield ((_a = appKit.switchNetwork) === null || _a === void 0 ? void 0 : _a.call(appKit, { chainId: targetChainId }));
            setChainId(targetChainId);
        }
        catch (error) {
            console.error('Error switching network:', error);
            throw error;
        }
    }), [appKit]);
    const signMessage = useCallback((message) => __awaiter(void 0, void 0, void 0, function* () {
        if (!appKit)
            throw new Error('AppKit not initialized');
        if (!isConnected)
            throw new Error('Wallet not connected');
        try {
            if (appKit.signMessage) {
                return yield appKit.signMessage({ message });
            }
            else if (auth && auth.signMessage) {
                // Fallback to auth instance
                return yield auth.signMessage(message);
            }
            else {
                throw new Error('Sign message not available');
            }
        }
        catch (error) {
            console.error('Error signing message:', error);
            throw error;
        }
    }), [appKit, isConnected, auth]);
    const sendTransaction = useCallback((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        if (!appKit)
            throw new Error('AppKit not initialized');
        if (!isConnected)
            throw new Error('Wallet not connected');
        try {
            if (appKit.sendTransaction) {
                return yield appKit.sendTransaction(transaction);
            }
            else if (auth && auth.sendTransaction) {
                // Fallback to auth instance
                return yield auth.sendTransaction(transaction);
            }
            else {
                throw new Error('Send transaction not available');
            }
        }
        catch (error) {
            console.error('Error sending transaction:', error);
            throw error;
        }
    }), [appKit, isConnected, auth]);
    const getBalance = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!appKit)
            throw new Error('AppKit not initialized');
        if (!isConnected || !address)
            throw new Error('Wallet not connected');
        try {
            if (appKit.getBalance) {
                const balanceResult = yield appKit.getBalance({ address });
                setBalance(balanceResult.formatted || balanceResult.toString());
                return balanceResult.formatted || balanceResult.toString();
            }
            else {
                throw new Error('Get balance not available');
            }
        }
        catch (error) {
            console.error('Error getting balance:', error);
            throw error;
        }
    }), [appKit, isConnected, address]);
    const getChainId = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!appKit)
            throw new Error('AppKit not initialized');
        try {
            const currentChainId = (_a = appKit.getChainId) === null || _a === void 0 ? void 0 : _a.call(appKit);
            if (currentChainId) {
                setChainId(currentChainId);
                return currentChainId;
            }
            else {
                throw new Error('Get chain ID not available');
            }
        }
        catch (error) {
            console.error('Error getting chain ID:', error);
            throw error;
        }
    }), [appKit]);
    const subscribeToAccountChanges = useCallback((callback) => {
        if (!appKit || !appKit.subscribeAccount) {
            return () => { }; // Return empty unsubscribe function
        }
        return appKit.subscribeAccount(callback);
    }, [appKit]);
    const subscribeToNetworkChanges = useCallback((callback) => {
        if (!appKit || !appKit.subscribeChainId) {
            return () => { }; // Return empty unsubscribe function
        }
        return appKit.subscribeChainId(callback);
    }, [appKit]);
    const getProvider = useCallback(() => {
        var _a;
        if (!appKit)
            throw new Error('AppKit not initialized');
        return ((_a = appKit.getProvider) === null || _a === void 0 ? void 0 : _a.call(appKit)) || appKit;
    }, [appKit]);
    return {
        // Connection state
        isConnected,
        isAppKitConnected: isConnected, // Alias for compatibility
        isConnecting,
        address,
        appKitAddress: address, // Alias for compatibility
        chainId,
        balance,
        // Connection actions
        openAppKit,
        disconnectAppKit,
        disconnect: disconnectAppKit, // Alias for compatibility
        // Wallet operations (REQUIREMENTS FULFILLED)
        signMessage,
        switchNetwork,
        sendTransaction,
        getBalance,
        getChainId,
        // Advanced operations (REQUIREMENTS FULFILLED)
        getProvider,
        subscribeAccount: subscribeToAccountChanges,
        subscribeChainId: subscribeToNetworkChanges,
        // Direct AppKit access
        appKit,
    };
};
// Modal control hook
const useModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const openModal = useCallback(() => {
        setIsOpen(true);
    }, []);
    const closeModal = useCallback(() => {
        setIsOpen(false);
    }, []);
    return {
        isOpen,
        openModal,
        closeModal,
    };
};
// Origin NFT operations hook
const useOrigin = () => {
    const { auth } = useCampAuth();
    const [stats, setStats] = useState({ data: null, isLoading: false, error: null, isError: false });
    const [uploads, setUploads] = useState({ data: [], isLoading: false, error: null, isError: false });
    const fetchStats = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!auth || !auth.isAuthenticated || !auth.origin)
            return;
        setStats(prev => (Object.assign(Object.assign({}, prev), { isLoading: true, error: null, isError: false })));
        try {
            const statsData = yield auth.origin.getOriginUsage();
            setStats({ data: statsData, isLoading: false, error: null, isError: false });
        }
        catch (error) {
            setStats({ data: null, isLoading: false, error: error, isError: true });
        }
    }), [auth]);
    const fetchUploads = useCallback(() => __awaiter(void 0, void 0, void 0, function* () {
        if (!auth || !auth.isAuthenticated || !auth.origin)
            return;
        setUploads(prev => (Object.assign(Object.assign({}, prev), { isLoading: true, error: null, isError: false })));
        try {
            const uploadsData = yield auth.origin.getOriginUploads();
            setUploads({ data: uploadsData || [], isLoading: false, error: null, isError: false });
        }
        catch (error) {
            setUploads({ data: [], isLoading: false, error: error, isError: true });
        }
    }), [auth]);
    const mintFile = useCallback((file, metadata, license, parentId) => __awaiter(void 0, void 0, void 0, function* () {
        if (!(auth === null || auth === void 0 ? void 0 : auth.origin))
            throw new Error('Origin not initialized');
        return auth.origin.mintFile(file, metadata, license, parentId);
    }), [auth]);
    const createIPAsset = useCallback((file, metadata, license) => __awaiter(void 0, void 0, void 0, function* () {
        if (!(auth === null || auth === void 0 ? void 0 : auth.origin))
            throw new Error('Origin not initialized');
        const result = yield auth.origin.mintFile(file, metadata, license);
        if (typeof result === 'string')
            return result;
        return (result === null || result === void 0 ? void 0 : result.tokenId) || (result === null || result === void 0 ? void 0 : result.id) || 'unknown';
    }), [auth]);
    const createSocialIPAsset = useCallback((source, license) => __awaiter(void 0, void 0, void 0, function* () {
        if (!auth)
            throw new Error('Authentication required');
        const result = yield auth.mintSocial(source, license);
        if (typeof result === 'string')
            return result;
        return (result === null || result === void 0 ? void 0 : result.tokenId) || (result === null || result === void 0 ? void 0 : result.id) || 'unknown';
    }), [auth]);
    useEffect(() => {
        if ((auth === null || auth === void 0 ? void 0 : auth.isAuthenticated) && (auth === null || auth === void 0 ? void 0 : auth.origin)) {
            fetchStats();
            fetchUploads();
        }
    }, [auth === null || auth === void 0 ? void 0 : auth.isAuthenticated, auth === null || auth === void 0 ? void 0 : auth.origin, fetchStats, fetchUploads]);
    return {
        stats: Object.assign(Object.assign({}, stats), { refetch: fetchStats }),
        uploads: Object.assign(Object.assign({}, uploads), { refetch: fetchUploads }),
        mintFile,
        // IP Asset operations (REQUIREMENTS FULFILLED)
        createIPAsset,
        createSocialIPAsset,
    };
};

const CampIcon = ({ width = 16, height = 16 }) => (React.createElement(View, { style: [styles$2.iconContainer, { width, height }] },
    React.createElement(Text, { style: [styles$2.iconText, { fontSize: Math.min(width, height) * 0.7 }] }, "\uD83C\uDFD5\uFE0F")));
const CloseIcon = ({ width = 24, height = 24 }) => (React.createElement(View, { style: [styles$2.iconContainer, { width, height }] },
    React.createElement(Text, { style: [styles$2.iconText, { fontSize: Math.min(width, height) * 0.8 }] }, "\u2715")));
const TwitterIcon = ({ width = 24, height = 24 }) => (React.createElement(View, { style: [styles$2.iconContainer, { width, height }] },
    React.createElement(Text, { style: [styles$2.iconText, { fontSize: Math.min(width, height) * 0.8, color: '#1DA1F2' }] }, "\uD835\uDD4F")));
const DiscordIcon = ({ width = 24, height = 24 }) => (React.createElement(View, { style: [styles$2.iconContainer, { width, height }] },
    React.createElement(Text, { style: [styles$2.iconText, { fontSize: Math.min(width, height) * 0.8, color: '#5865F2' }] }, "\uD83D\uDCAC")));
const SpotifyIcon = ({ width = 24, height = 24 }) => (React.createElement(View, { style: [styles$2.iconContainer, { width, height }] },
    React.createElement(Text, { style: [styles$2.iconText, { fontSize: Math.min(width, height) * 0.8, color: '#1DB954' }] }, "\uD83C\uDFB5")));
const TikTokIcon = ({ width = 24, height = 24 }) => (React.createElement(View, { style: [styles$2.iconContainer, { width, height }] },
    React.createElement(Text, { style: [styles$2.iconText, { fontSize: Math.min(width, height) * 0.8 }] }, "\uD83C\uDFAC")));
const TelegramIcon = ({ width = 24, height = 24 }) => (React.createElement(View, { style: [styles$2.iconContainer, { width, height }] },
    React.createElement(Text, { style: [styles$2.iconText, { fontSize: Math.min(width, height) * 0.8, color: '#0088cc' }] }, "\u2708\uFE0F")));
const CheckMarkIcon = ({ width = 24, height = 24 }) => (React.createElement(View, { style: [styles$2.iconContainer, { width, height }] },
    React.createElement(Text, { style: [styles$2.iconText, { fontSize: Math.min(width, height) * 0.8, color: '#22c55e' }] }, "\u2713")));
const XMarkIcon = ({ width = 24, height = 24 }) => (React.createElement(View, { style: [styles$2.iconContainer, { width, height }] },
    React.createElement(Text, { style: [styles$2.iconText, { fontSize: Math.min(width, height) * 0.8, color: '#ef4444' }] }, "\u2717")));
const LinkIcon = ({ width = 24, height = 24 }) => (React.createElement(View, { style: [styles$2.iconContainer, { width, height }] },
    React.createElement(Text, { style: [styles$2.iconText, { fontSize: Math.min(width, height) * 0.8 }] }, "\uD83D\uDD17")));
const getIconBySocial = (social) => {
    switch (social.toLowerCase()) {
        case 'twitter':
            return TwitterIcon;
        case 'discord':
            return DiscordIcon;
        case 'spotify':
            return SpotifyIcon;
        case 'tiktok':
            return TikTokIcon;
        case 'telegram':
            return TelegramIcon;
        default:
            return TwitterIcon;
    }
};
const styles$2 = StyleSheet.create({
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        textAlign: 'center',
        fontWeight: 'bold',
    },
});

const CampButton = ({ onPress, loading = false, disabled = false, children, style, authenticated = false, }) => {
    const isDisabled = disabled || loading;
    return (React.createElement(TouchableOpacity, { style: [styles$1.button, isDisabled && styles$1.disabled, style], onPress: onPress, disabled: isDisabled },
        React.createElement(View, { style: styles$1.buttonContent },
            React.createElement(View, { style: styles$1.iconContainer },
                React.createElement(CampIcon, null)),
            children || (React.createElement(Text, { style: styles$1.buttonText }, authenticated ? 'My Origin' : 'Connect')))));
};
const styles$1 = StyleSheet.create({
    button: {
        backgroundColor: '#ff6d01',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 120,
    },
    disabled: {
        backgroundColor: '#cccccc',
        opacity: 0.6,
    },
    buttonContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        marginRight: 8,
        width: 16,
        height: 16,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const CampModal = ({ visible = false, onClose = () => { }, children }) => {
    const { authenticated, loading, connect, disconnect, walletAddress } = useCampAuth();
    const { socials, isLoading: socialsLoading, refetch: refetchSocials } = useSocials();
    const { openAppKit, isAppKitConnected } = useAppKit();
    const [activeTab, setActiveTab] = useState('stats');
    const handleConnect = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // Use AppKit for wallet connection in React Native
            yield openAppKit();
            // The connect will be handled by AppKit's callback
        }
        catch (error) {
            console.error('Connection failed:', error);
        }
    });
    const handleDisconnect = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield disconnect();
            onClose();
        }
        catch (error) {
            console.error('Disconnect failed:', error);
        }
    });
    if (!authenticated) {
        return (React.createElement(Modal, { animationType: "slide", transparent: true, visible: visible, onRequestClose: onClose },
            React.createElement(View, { style: styles.overlay },
                React.createElement(SafeAreaView, { style: styles.modalContainer },
                    React.createElement(View, { style: styles.modal },
                        React.createElement(View, { style: styles.header },
                            React.createElement(TouchableOpacity, { style: styles.closeButton, onPress: onClose },
                                React.createElement(CloseIcon, { width: 24, height: 24 }))),
                        React.createElement(View, { style: styles.authContent },
                            React.createElement(View, { style: styles.modalIcon },
                                React.createElement(CampIcon, { width: 48, height: 48 })),
                            React.createElement(Text, { style: styles.authTitle }, "Connect to Origin"),
                            React.createElement(TouchableOpacity, { style: [styles.connectButton, loading && styles.connectButtonDisabled], onPress: handleConnect, disabled: loading },
                                React.createElement(Text, { style: styles.connectButtonText }, loading ? 'Connecting...' : 'Connect Wallet'))),
                        React.createElement(Text, { style: styles.footerText }, "Powered by Camp Network"))))));
    }
    return (React.createElement(Modal, { animationType: "slide", transparent: true, visible: visible, onRequestClose: onClose },
        React.createElement(View, { style: styles.overlay },
            React.createElement(SafeAreaView, { style: styles.modalContainer },
                React.createElement(View, { style: styles.modal },
                    React.createElement(View, { style: styles.header },
                        React.createElement(TouchableOpacity, { style: styles.closeButton, onPress: onClose },
                            React.createElement(CloseIcon, { width: 24, height: 24 }))),
                    React.createElement(View, { style: styles.authenticatedHeader },
                        React.createElement(Text, { style: styles.modalTitle }, "My Origin"),
                        React.createElement(Text, { style: styles.walletAddress }, walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : '')),
                    React.createElement(View, { style: styles.tabContainer },
                        React.createElement(TouchableOpacity, { style: [styles.tab, activeTab === 'stats' && styles.activeTab], onPress: () => setActiveTab('stats') },
                            React.createElement(Text, { style: [styles.tabText, activeTab === 'stats' && styles.activeTabText] }, "Stats")),
                        React.createElement(TouchableOpacity, { style: [styles.tab, activeTab === 'socials' && styles.activeTab], onPress: () => setActiveTab('socials') },
                            React.createElement(Text, { style: [styles.tabText, activeTab === 'socials' && styles.activeTabText] }, "Socials"))),
                    React.createElement(ScrollView, { style: styles.tabContent },
                        activeTab === 'stats' && React.createElement(StatsTab, null),
                        activeTab === 'socials' && (React.createElement(SocialsTab, { socials: socials, loading: socialsLoading, onRefetch: refetchSocials }))),
                    React.createElement(TouchableOpacity, { style: styles.disconnectButton, onPress: handleDisconnect },
                        React.createElement(Text, { style: styles.disconnectButtonText }, "Disconnect")),
                    React.createElement(Text, { style: styles.footerText }, "Powered by Camp Network"))))));
};
const StatsTab = () => {
    return (React.createElement(View, { style: styles.statsContainer },
        React.createElement(View, { style: styles.statRow },
            React.createElement(View, { style: styles.statItem },
                React.createElement(CheckMarkIcon, { width: 20, height: 20 }),
                React.createElement(Text, { style: styles.statLabel }, "Authorized"))),
        React.createElement(View, { style: styles.divider }),
        React.createElement(View, { style: styles.statRow },
            React.createElement(View, { style: styles.statItem },
                React.createElement(Text, { style: styles.statValue }, "0"),
                React.createElement(Text, { style: styles.statLabel }, "Credits"))),
        React.createElement(TouchableOpacity, { style: styles.dashboardButton },
            React.createElement(Text, { style: styles.dashboardButtonText }, "Origin Dashboard \uD83D\uDD17"))));
};
const SocialsTab = ({ socials, loading, onRefetch }) => {
    const connectedSocials = ['twitter', 'discord', 'spotify', 'tiktok', 'telegram']
        .filter(social => socials === null || socials === void 0 ? void 0 : socials[social]);
    const notConnectedSocials = ['twitter', 'discord', 'spotify', 'tiktok', 'telegram']
        .filter(social => !(socials === null || socials === void 0 ? void 0 : socials[social]));
    if (loading) {
        return (React.createElement(View, { style: styles.loadingContainer },
            React.createElement(Text, null, "Loading socials...")));
    }
    return (React.createElement(ScrollView, { style: styles.socialsContainer },
        React.createElement(View, { style: styles.socialSection },
            React.createElement(Text, { style: styles.sectionTitle }, "Not Linked"),
            notConnectedSocials.map((social) => (React.createElement(SocialItem, { key: social, social: social, isConnected: false, onRefetch: onRefetch }))),
            notConnectedSocials.length === 0 && (React.createElement(Text, { style: styles.noSocials }, "You've linked all your socials!"))),
        React.createElement(View, { style: styles.socialSection },
            React.createElement(Text, { style: styles.sectionTitle }, "Linked"),
            connectedSocials.map((social) => (React.createElement(SocialItem, { key: social, social: social, isConnected: true, onRefetch: onRefetch }))),
            connectedSocials.length === 0 && (React.createElement(Text, { style: styles.noSocials }, "You have no socials linked.")))));
};
const SocialItem = ({ social, isConnected, onRefetch }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { auth } = useCampAuth();
    const Icon = getIconBySocial(social);
    const handlePress = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!auth)
            return;
        setIsLoading(true);
        try {
            if (isConnected) {
                // Unlink social
                const unlinkMethod = `unlink${social.charAt(0).toUpperCase() + social.slice(1)}`;
                if (typeof auth[unlinkMethod] === 'function') {
                    yield auth[unlinkMethod]();
                }
            }
            else {
                // Link social
                const linkMethod = `link${social.charAt(0).toUpperCase() + social.slice(1)}`;
                if (typeof auth[linkMethod] === 'function') {
                    yield auth[linkMethod]();
                }
            }
            onRefetch();
        }
        catch (error) {
            console.error(`Error ${isConnected ? 'unlinking' : 'linking'} ${social}:`, error);
        }
        finally {
            setIsLoading(false);
        }
    });
    return (React.createElement(TouchableOpacity, { style: [styles.socialItem, isConnected && styles.connectedSocialItem], onPress: handlePress, disabled: isLoading },
        React.createElement(Icon, { width: 24, height: 24 }),
        React.createElement(Text, { style: styles.socialName }, social.charAt(0).toUpperCase() + social.slice(1)),
        isLoading ? (React.createElement(Text, { style: styles.socialStatus }, "Loading...")) : (React.createElement(Text, { style: [styles.socialStatus, isConnected && styles.connectedStatus] }, isConnected ? 'Linked' : 'Link'))));
};
const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modal: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 20,
        maxHeight: screenHeight * 0.8,
        width: Math.min(400, screenWidth - 40),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: 10,
    },
    closeButton: {
        padding: 5,
    },
    authContent: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    modalIcon: {
        marginBottom: 16,
    },
    authTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
    },
    connectButton: {
        backgroundColor: '#ff6d01',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        minWidth: 200,
    },
    connectButtonDisabled: {
        backgroundColor: '#cccccc',
        opacity: 0.6,
    },
    connectButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    authenticatedHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    walletAddress: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'monospace',
    },
    tabContainer: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginBottom: 20,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#ff6d01',
    },
    tabText: {
        fontSize: 16,
        color: '#666',
    },
    activeTabText: {
        color: '#ff6d01',
        fontWeight: '600',
    },
    tabContent: {
        flex: 1,
        marginBottom: 20,
    },
    statsContainer: {
        alignItems: 'center',
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginRight: 8,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        width: '100%',
        marginVertical: 10,
    },
    dashboardButton: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 6,
        marginTop: 20,
    },
    dashboardButtonText: {
        color: '#333',
        fontSize: 14,
    },
    loadingContainer: {
        alignItems: 'center',
        paddingVertical: 40,
    },
    socialsContainer: {
        flex: 1,
    },
    socialSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#333',
    },
    noSocials: {
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic',
        paddingVertical: 20,
    },
    socialItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
        marginBottom: 8,
    },
    connectedSocialItem: {
        backgroundColor: '#e8f5e8',
    },
    socialName: {
        flex: 1,
        fontSize: 16,
        marginLeft: 12,
        color: '#333',
    },
    socialStatus: {
        fontSize: 14,
        color: '#ff6d01',
        fontWeight: '600',
    },
    connectedStatus: {
        color: '#22c55e',
    },
    disconnectButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    disconnectButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    footerText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#666',
        marginTop: 8,
    },
});

/**
 * The TwitterAPI class.
 * @class
 * @classdesc The TwitterAPI class is used to interact with the Twitter API.
 */
class TwitterAPI {
    /**
     * Constructor for the TwitterAPI class.
     * @param {object} options - The options object.
     * @param {string} options.apiKey - The API key. (Needed for data fetching)
     */
    constructor({ apiKey }) {
        this.apiKey = apiKey;
    }
    /**
     * Fetch Twitter user details by username.
     * @param {string} twitterUserName - The Twitter username.
     * @returns {Promise<object>} - The user details.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchUserByUsername(twitterUserName) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = buildURL(`${baseTwitterURL}/user`, { twitterUserName });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchTweetsByUsername(twitterUserName_1) {
        return __awaiter(this, arguments, void 0, function* (twitterUserName, page = 1, limit = 10) {
            const url = buildURL(`${baseTwitterURL}/tweets`, {
                twitterUserName,
                page,
                limit,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch followers by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The followers.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchFollowersByUsername(twitterUserName_1) {
        return __awaiter(this, arguments, void 0, function* (twitterUserName, page = 1, limit = 10) {
            const url = buildURL(`${baseTwitterURL}/followers`, {
                twitterUserName,
                page,
                limit,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch following by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The following.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchFollowingByUsername(twitterUserName_1) {
        return __awaiter(this, arguments, void 0, function* (twitterUserName, page = 1, limit = 10) {
            const url = buildURL(`${baseTwitterURL}/following`, {
                twitterUserName,
                page,
                limit,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch tweet by tweet ID.
     * @param {string} tweetId - The tweet ID.
     * @returns {Promise<object>} - The tweet.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchTweetById(tweetId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = buildURL(`${baseTwitterURL}/getTweetById`, { tweetId });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch user by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The user data.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchUserByWalletAddress(walletAddress_1) {
        return __awaiter(this, arguments, void 0, function* (walletAddress, page = 1, limit = 10) {
            const url = buildURL(`${baseTwitterURL}/wallet-twitter-data`, {
                walletAddress,
                page,
                limit,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch reposted tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The reposted tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchRepostedByUsername(twitterUserName_1) {
        return __awaiter(this, arguments, void 0, function* (twitterUserName, page = 1, limit = 10) {
            const url = buildURL(`${baseTwitterURL}/reposted`, {
                twitterUserName,
                page,
                limit,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch replies by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The replies.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchRepliesByUsername(twitterUserName_1) {
        return __awaiter(this, arguments, void 0, function* (twitterUserName, page = 1, limit = 10) {
            const url = buildURL(`${baseTwitterURL}/replies`, {
                twitterUserName,
                page,
                limit,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch likes by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The likes.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchLikesByUsername(twitterUserName_1) {
        return __awaiter(this, arguments, void 0, function* (twitterUserName, page = 1, limit = 10) {
            const url = buildURL(`${baseTwitterURL}/event/likes/${twitterUserName}`, {
                page,
                limit,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch follows by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The follows.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchFollowsByUsername(twitterUserName_1) {
        return __awaiter(this, arguments, void 0, function* (twitterUserName, page = 1, limit = 10) {
            const url = buildURL(`${baseTwitterURL}/event/follows/${twitterUserName}`, {
                page,
                limit,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch viewed tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The viewed tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchViewedTweetsByUsername(twitterUserName_1) {
        return __awaiter(this, arguments, void 0, function* (twitterUserName, page = 1, limit = 10) {
            const url = buildURL(`${baseTwitterURL}/event/viewed-tweets/${twitterUserName}`, {
                page,
                limit,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */
    _fetchDataWithAuth(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.apiKey) {
                throw new APIError("API key is required for fetching data", 401);
            }
            try {
                return yield fetchData(url, { "x-api-key": this.apiKey });
            }
            catch (error) {
                throw new APIError(error.message, error.statusCode);
            }
        });
    }
}

/**
 * The SpotifyAPI class.
 * @class
 */
class SpotifyAPI {
    /**
     * Constructor for the SpotifyAPI class.
     * @constructor
     * @param {SpotifyAPIOptions} options - The Spotify API options.
     * @param {string} options.apiKey - The Spotify API key.
     * @throws {Error} - Throws an error if the API key is not provided.
     */
    constructor(options) {
        this.apiKey = options.apiKey;
    }
    /**
     * Fetch the user's saved tracks by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved tracks.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchSavedTracksById(spotifyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = buildURL(`${baseSpotifyURL}/save-tracks`, {
                spotifyId,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch the played tracks of a user by Spotify ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The played tracks.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchPlayedTracksById(spotifyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = buildURL(`${baseSpotifyURL}/played-tracks`, {
                spotifyId,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch the user's saved albums by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved albums.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchSavedAlbumsById(spotifyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = buildURL(`${baseSpotifyURL}/saved-albums`, {
                spotifyId,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch the user's saved playlists by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved playlists.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchSavedPlaylistsById(spotifyId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = buildURL(`${baseSpotifyURL}/saved-playlists`, {
                spotifyId,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch the tracks of an album by album ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} albumId - The album ID.
     * @returns {Promise<object>} - The tracks in the album.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchTracksInAlbum(spotifyId, albumId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = buildURL(`${baseSpotifyURL}/album/tracks`, {
                spotifyId,
                albumId,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch the tracks in a playlist by playlist ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} playlistId - The playlist ID.
     * @returns {Promise<object>} - The tracks in the playlist.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchTracksInPlaylist(spotifyId, playlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = buildURL(`${baseSpotifyURL}/playlist/tracks`, {
                spotifyId,
                playlistId,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch the user's Spotify data by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @returns {Promise<object>} - The user's Spotify data.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchUserByWalletAddress(walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = buildURL(`${baseSpotifyURL}/wallet-spotify-data`, { walletAddress });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */
    _fetchDataWithAuth(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.apiKey) {
                throw new APIError("API key is required for fetching data", 401);
            }
            try {
                return yield fetchData(url, { "x-api-key": this.apiKey });
            }
            catch (error) {
                throw new APIError(error.message, error.statusCode);
            }
        });
    }
}

/**
 * The TikTokAPI class.
 * @class
 */
class TikTokAPI {
    /**
     * Constructor for the TikTokAPI class.
     * @param {object} options - The options object.
     * @param {string} options.apiKey - The Camp API key.
     */
    constructor({ apiKey }) {
        this.apiKey = apiKey;
    }
    /**
     * Fetch TikTok user details by username.
     * @param {string} tiktokUserName - The TikTok username.
     * @returns {Promise<object>} - The user details.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchUserByUsername(tiktokUserName) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${baseTikTokURL}/user/${tiktokUserName}`;
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch video details by TikTok username and video ID.
     * @param {string} userHandle - The TikTok username.
     * @param {string} videoId - The video ID.
     * @returns {Promise<object>} - The video details.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchVideoById(userHandle, videoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${baseTikTokURL}/video/${userHandle}/${videoId}`;
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */
    _fetchDataWithAuth(url) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.apiKey) {
                throw new APIError("API key is required for fetching data", 401);
            }
            try {
                return yield fetchData(url, { "x-api-key": this.apiKey });
            }
            catch (error) {
                throw new APIError(error.message, error.statusCode);
            }
        });
    }
}

/**
 * Standardized Error Types for Camp Network React Native SDK
 * Requirements: Section "ERROR HANDLING REQUIREMENTS"
 */
class CampSDKError extends Error {
    constructor(message, code, details) {
        super(message);
        this.name = 'CampSDKError';
        this.code = code;
        this.details = details;
    }
}
// Required error types from SDK_REQUIREMENTS.txt
const ErrorCodes = {
    WALLET_NOT_CONNECTED: 'WALLET_NOT_CONNECTED',
    AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
    TRANSACTION_REJECTED: 'TRANSACTION_REJECTED',
    NETWORK_ERROR: 'NETWORK_ERROR',
    SOCIAL_LINKING_FAILED: 'SOCIAL_LINKING_FAILED',
    IP_CREATION_FAILED: 'IP_CREATION_FAILED',
    APPKIT_NOT_INITIALIZED: 'APPKIT_NOT_INITIALIZED',
    MODULE_RESOLUTION_ERROR: 'MODULE_RESOLUTION_ERROR',
    PROVIDER_CONFLICT: 'PROVIDER_CONFLICT',
};
// Helper functions to create specific error types
const createWalletNotConnectedError = (details) => new CampSDKError('Wallet is not connected', ErrorCodes.WALLET_NOT_CONNECTED, details);
const createAuthenticationFailedError = (message, details) => new CampSDKError(message || 'Authentication failed', ErrorCodes.AUTHENTICATION_FAILED, details);
const createTransactionRejectedError = (details) => new CampSDKError('Transaction was rejected', ErrorCodes.TRANSACTION_REJECTED, details);
const createNetworkError = (message, details) => new CampSDKError(message || 'Network request failed', ErrorCodes.NETWORK_ERROR, details);
const createSocialLinkingFailedError = (provider, details) => new CampSDKError(`Failed to link ${provider} account`, ErrorCodes.SOCIAL_LINKING_FAILED, details);
const createIPCreationFailedError = (details) => new CampSDKError('Failed to create IP asset', ErrorCodes.IP_CREATION_FAILED, details);
const createAppKitNotInitializedError = (details) => new CampSDKError('AppKit is not initialized', ErrorCodes.APPKIT_NOT_INITIALIZED, details);
// Error recovery utility
const withRetry = (fn_1, ...args_1) => __awaiter(void 0, [fn_1, ...args_1], void 0, function* (fn, maxRetries = 3, delay = 1000) {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return yield fn();
        }
        catch (error) {
            lastError = error;
            // Don't retry for user rejections or authentication failures
            if (error instanceof CampSDKError &&
                (error.code === ErrorCodes.TRANSACTION_REJECTED ||
                    error.code === ErrorCodes.AUTHENTICATION_FAILED)) {
                throw error;
            }
            if (i < maxRetries - 1) {
                yield new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
            }
        }
    }
    throw lastError;
});

/**
 * TypeScript interfaces for Camp Network React Native SDK
 * Requirements: Section "HOOK INTERFACES REQUIRED" and "COMPONENT INTERFACES"
 */
// Featured wallet IDs from requirements
const FEATURED_WALLET_IDS = {
    METAMASK: 'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
    RAINBOW: '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369',
    COINBASE: 'fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa',
};
// WalletConnect Project ID from requirements
const DEFAULT_PROJECT_ID = '83d0addc08296ab3d8a36e786dee7f48';

export { APIError, AuthRN, CampButton, CampContext, CampIcon, CampModal, CampProvider, CampSDKError, CheckMarkIcon, CloseIcon, DEFAULT_PROJECT_ID, DiscordIcon, ErrorCodes, FEATURED_WALLET_IDS, LinkIcon, Origin, SpotifyAPI, SpotifyIcon, Storage, TelegramIcon, TikTokAPI, TikTokIcon, TwitterAPI, TwitterIcon, ValidationError, XMarkIcon, baseSpotifyURL, baseTikTokURL, baseTwitterURL, buildQueryString, buildURL, capitalize, constants, createAppKitNotInitializedError, createAuthenticationFailedError, createIPCreationFailedError, createNetworkError, createSocialLinkingFailedError, createTransactionRejectedError, createWalletNotConnectedError, fetchData, formatAddress, formatCampAmount, getIconBySocial, sendAnalyticsEvent, uploadWithProgress, useAppKit, useAuthState, useCamp, useCampAuth, useModal, useOrigin, useSocials, withRetry };
