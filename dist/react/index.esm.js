'use client';
import React, { createContext, useState, useContext, useEffect, useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import { custom, createWalletClient, createPublicClient, http, erc20Abi, getAbiItem, encodeFunctionData, zeroAddress, checksumAddress } from 'viem';
import { toAccount } from 'viem/accounts';
import { createSiweMessage } from 'viem/siwe';
import axios from 'axios';
import { WagmiContext, useAccount, useConnectorClient } from 'wagmi';
import ReactDOM, { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';

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


function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

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
let client = null;
let publicClient = null;
const getClient = (provider, name = "window.ethereum", address) => {
    var _a;
    if (!provider && !client) {
        console.warn("Provider is required to create a client.");
        return null;
    }
    if (!client ||
        (client.transport.name !== name && provider) ||
        (address !== ((_a = client.account) === null || _a === void 0 ? void 0 : _a.address) && provider)) {
        const obj = {
            chain: testnet,
            transport: custom(provider, {
                name: name,
            }),
        };
        if (address) {
            obj.account = toAccount(address);
        }
        client = createWalletClient(obj);
    }
    return client;
};
const getPublicClient = () => {
    if (!publicClient) {
        publicClient = createPublicClient({
            chain: testnet,
            transport: http(),
        });
    }
    return publicClient;
};

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

let providers = [];
const providerStore = {
    value: () => providers,
    subscribe: (callback) => {
        function onAnnouncement(event) {
            if (providers.some((p) => p.info.uuid === event.detail.info.uuid))
                return;
            providers = [...providers, event.detail];
            callback(providers);
        }
        if (typeof window === "undefined")
            return;
        window.addEventListener("eip6963:announceProvider", onAnnouncement);
        window.dispatchEvent(new Event("eip6963:requestProvider"));
        return () => window.removeEventListener("eip6963:announceProvider", onAnnouncement);
    },
};

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
 * Uploads a file to a specified URL with progress tracking.
 * Falls back to a simple fetch request if XMLHttpRequest is not available.
 * @param {File} file - The file to upload.
 * @param {string} url - The URL to upload the file to.
 * @param {UploadProgressCallback} onProgress - A callback function to track upload progress.
 * @returns {Promise<string>} - A promise that resolves with the response from the server.
 */
const uploadWithProgress = (file, url, onProgress) => {
    return new Promise((resolve, reject) => {
        axios
            .put(url, file, Object.assign({ headers: {
                "Content-Type": file.type,
            } }, (typeof window !== "undefined" && typeof onProgress === "function"
            ? {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = (progressEvent.loaded / progressEvent.total) * 100;
                        onProgress(percent);
                    }
                },
            }
            : {})))
            .then((res) => {
            resolve(res.data);
        })
            .catch((error) => {
            var _a;
            const message = ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || (error === null || error === void 0 ? void 0 : error.message) || "Upload failed";
            reject(message);
        });
    });
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

function updateTerms(tokenId, newTerms) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, abi$1, "updateTerms", [tokenId, newTerms], { waitForReceipt: true });
}

function requestDelete(tokenId) {
    return this.callContractMethod(constants.DATANFT_CONTRACT_ADDRESS, abi$1, "requestDelete", [tokenId]);
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

function buyAccess(tokenId, periods, value // only for native token payments
) {
    return this.callContractMethod(constants.MARKETPLACE_CONTRACT_ADDRESS, abi, "buyAccess", [tokenId, periods], { waitForReceipt: true, value });
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
            const deadline = BigInt(Math.floor(Date.now()) + 600); // 10 minutes from now
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
        this.mintSocial = (source, license) => __awaiter(this, void 0, void 0, function* () {
            // try {
            const deadline = BigInt(Math.floor(Date.now()) + 600); // 10 minutes from now (temp)
            const metadata = {
                name: `${source} IpNFT`,
                description: `This is a ${source} IpNFT`,
            };
            const registration = yield this.registerIpNFT(source, deadline, license, metadata);
            if (!registration) {
                // console.error("Failed to register IpNFT");
                // return null;
                throw new Error("Failed to register Social IpNFT");
            }
            return registration.tokenId.toString();
            // } catch (error) {
            //   console.error("Failed to mint social IpNFT:", error);
            //   return null;
            // }
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
            const totalCost = price * BigInt(periods);
            const isNative = paymentToken === zeroAddress;
            if (isNative) {
                return this.buyAccess(tokenId, periods, totalCost);
            }
            const owner = yield this.viemClient.getAddress();
            yield approveIfNeeded({
                walletClient: this.viemClient,
                publicClient: getPublicClient(),
                tokenAddress: paymentToken,
                owner,
                spender: constants.MARKETPLACE_CONTRACT_ADDRESS,
                amount: totalCost,
            });
            return this.buyAccess(tokenId, periods);
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

var _Auth_instances, _Auth_triggers, _Auth_ackeeInstance, _Auth_trigger, _Auth_loadAuthStatusFromStorage, _Auth_requestAccount, _Auth_fetchNonce, _Auth_verifySignature, _Auth_createMessage, _Auth_sendAnalyticsEvent;
const createRedirectUriObject = (redirectUri) => {
    const keys = ["twitter", "discord", "spotify"];
    if (typeof redirectUri === "object") {
        return keys.reduce((object, key) => {
            object[key] =
                redirectUri[key] ||
                    (typeof window !== "undefined" ? window.location.href : "");
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
            object[key] = typeof window !== "undefined" ? window.location.href : "";
            return object;
        }, {});
    }
    return {};
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
     * @param {boolean} [options.allowAnalytics=true] Whether to allow analytics to be sent.
     * @param {object} [options.ackeeInstance] The Ackee instance.
     * @throws {APIError} - Throws an error if the clientId is not provided.
     */
    constructor({ clientId, redirectUri, allowAnalytics = true, ackeeInstance, }) {
        _Auth_instances.add(this);
        _Auth_triggers.set(this, void 0);
        _Auth_ackeeInstance.set(this, void 0);
        if (!clientId) {
            throw new Error("clientId is required");
        }
        this.viem = null;
        // if (typeof window !== "undefined") {
        //   if (window.ethereum) this.viem = getClient(window.ethereum);
        // }
        this.redirectUri = createRedirectUriObject(redirectUri);
        if (ackeeInstance)
            __classPrivateFieldSet(this, _Auth_ackeeInstance, ackeeInstance, "f");
        if (allowAnalytics &&
            !__classPrivateFieldGet(this, _Auth_ackeeInstance, "f") &&
            typeof window !== "undefined") ;
        this.clientId = clientId;
        this.isAuthenticated = false;
        this.jwt = null;
        this.origin = null;
        this.walletAddress = null;
        this.userId = null;
        __classPrivateFieldSet(this, _Auth_triggers, {}, "f");
        providerStore.subscribe((providers) => {
            __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_trigger).call(this, "providers", providers);
        });
        __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_loadAuthStatusFromStorage).call(this);
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
        if (!__classPrivateFieldGet(this, _Auth_triggers, "f")[event]) {
            __classPrivateFieldGet(this, _Auth_triggers, "f")[event] = [];
        }
        __classPrivateFieldGet(this, _Auth_triggers, "f")[event].push(callback);
        if (event === "providers") {
            callback(providerStore.value());
        }
    }
    /**
     * Set the loading state.
     * @param {boolean} loading The loading state.
     * @returns {void}
     */
    setLoading(loading) {
        __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_trigger).call(this, "state", loading
            ? "loading"
            : this.isAuthenticated
                ? "authenticated"
                : "unauthenticated");
    }
    /**
     * Set the provider. This is useful for setting the provider when the user selects a provider from the UI or when dApp wishes to use a specific provider.
     * @param {object} options The options object. Includes the provider and the provider info.
     * @returns {void}
     * @throws {APIError} - Throws an error if the provider is not provided.
     */
    setProvider({ provider, info, address, }) {
        if (!provider) {
            throw new APIError("provider is required");
        }
        this.viem = getClient(provider, info.name, address);
        if (this.origin) {
            this.origin.setViemClient(this.viem);
        }
        // TODO: only use one of these
        __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_trigger).call(this, "viem", this.viem);
        __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_trigger).call(this, "provider", { provider, info });
    }
    /**
     * Set the wallet address. This is useful for edge cases where the provider can't return the wallet address. Don't use this unless you know what you're doing.
     * @param {string} walletAddress The wallet address.
     * @returns {void}
     */
    setWalletAddress(walletAddress) {
        this.walletAddress = walletAddress;
    }
    recoverProvider() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (!this.walletAddress) {
                console.warn("No wallet address found in local storage. Please connect your wallet again.");
                return;
            }
            let provider;
            const providers = (_a = providerStore.value()) !== null && _a !== void 0 ? _a : [];
            for (const p of providers) {
                try {
                    const accounts = yield p.provider.request({
                        method: "eth_requestAccounts",
                    });
                    if (((_b = accounts[0]) === null || _b === void 0 ? void 0 : _b.toLowerCase()) === ((_c = this.walletAddress) === null || _c === void 0 ? void 0 : _c.toLowerCase())) {
                        provider = p;
                        break;
                    }
                }
                catch (err) {
                    console.warn("Failed to fetch accounts from provider:", err);
                }
            }
            if (provider) {
                this.setProvider({
                    provider: provider.provider,
                    info: provider.info || {
                        name: "Unknown",
                    },
                    address: this.walletAddress,
                });
            }
            else {
                console.warn("No matching provider found for the stored wallet address. Please connect your wallet again.");
            }
        });
    }
    /**
     * Disconnect the user.
     * @returns {Promise<void>}
     */
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                return;
            }
            __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_trigger).call(this, "state", "unauthenticated");
            this.isAuthenticated = false;
            this.walletAddress = null;
            this.userId = null;
            this.jwt = null;
            this.origin = null;
            localStorage.removeItem("camp-sdk:wallet-address");
            localStorage.removeItem("camp-sdk:user-id");
            localStorage.removeItem("camp-sdk:jwt");
            // await this.#sendAnalyticsEvent(
            //   constants.ACKEE_EVENTS.USER_DISCONNECTED,
            //   "User Disconnected"
            // );
        });
    }
    /**
     * Connect the user's wallet and sign the message.
     * @returns {Promise<{ success: boolean; message: string; walletAddress: string }>} A promise that resolves with the authentication result.
     * @throws {APIError} - Throws an error if the user cannot be authenticated.
     */
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_trigger).call(this, "state", "loading");
            try {
                if (!this.walletAddress) {
                    yield __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_requestAccount).call(this);
                }
                this.walletAddress = checksumAddress(this.walletAddress);
                const nonce = yield __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_fetchNonce).call(this);
                const message = __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_createMessage).call(this, nonce);
                const signature = yield this.viem.signMessage({
                    account: this.walletAddress,
                    message: message,
                });
                const res = yield __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_verifySignature).call(this, message, signature);
                if (res.success) {
                    this.isAuthenticated = true;
                    this.userId = res.userId;
                    this.jwt = res.token;
                    this.origin = new Origin(this.jwt, this.viem);
                    localStorage.setItem("camp-sdk:jwt", this.jwt);
                    localStorage.setItem("camp-sdk:wallet-address", this.walletAddress);
                    localStorage.setItem("camp-sdk:user-id", this.userId);
                    __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_trigger).call(this, "state", "authenticated");
                    yield __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_sendAnalyticsEvent).call(this, constants.ACKEE_EVENTS.USER_CONNECTED, "User Connected");
                    return {
                        success: true,
                        message: "Successfully authenticated",
                        walletAddress: this.walletAddress,
                    };
                }
                else {
                    this.isAuthenticated = false;
                    __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_trigger).call(this, "state", "unauthenticated");
                    throw new APIError("Failed to authenticate");
                }
            }
            catch (e) {
                this.isAuthenticated = false;
                __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_trigger).call(this, "state", "unauthenticated");
                throw new APIError(e);
            }
        });
    }
    /**
     * Get the user's linked social accounts.
     * @returns {Promise<Record<string, boolean>>} A promise that resolves with the user's linked social accounts.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated or if the request fails.
     * @example
     * const auth = new Auth({ clientId: "your-client-id" });
     * const socials = await auth.getLinkedSocials();
     * console.log(socials);
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
    /**
     * Link the user's Twitter account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */
    linkTwitter() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new Error("User needs to be authenticated");
            }
            // await this.#sendAnalyticsEvent(
            //   constants.ACKEE_EVENTS.TWITTER_LINKED,
            //   "Twitter Linked"
            // );
            window.location.href = `${constants.AUTH_HUB_BASE_API}/twitter/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri["twitter"]}`;
        });
    }
    /**
     * Link the user's Discord account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */
    linkDiscord() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new Error("User needs to be authenticated");
            }
            // await this.#sendAnalyticsEvent(
            //   constants.ACKEE_EVENTS.DISCORD_LINKED,
            //   "Discord Linked"
            // );
            window.location.href = `${constants.AUTH_HUB_BASE_API}/discord/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri["discord"]}`;
        });
    }
    /**
     * Link the user's Spotify account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */
    linkSpotify() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new Error("User needs to be authenticated");
            }
            // await this.#sendAnalyticsEvent(
            //   constants.ACKEE_EVENTS.SPOTIFY_LINKED,
            //   "Spotify Linked"
            // );
            window.location.href = `${constants.AUTH_HUB_BASE_API}/spotify/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri["spotify"]}`;
        });
    }
    /**
     * Link the user's TikTok account.
     * @param {string} handle The user's TikTok handle.
     * @returns {Promise<any>} A promise that resolves with the TikTok account data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */
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
                __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_sendAnalyticsEvent).call(this, constants.ACKEE_EVENTS.TIKTOK_LINKED, "TikTok Linked");
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
    /**
     * Send an OTP to the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @returns {Promise<any>} A promise that resolves with the OTP data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */
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
    /**
     * Link the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @param {string} otp The OTP.
     * @param {string} phoneCodeHash The phone code hash.
     * @returns {Promise<object>} A promise that resolves with the Telegram account data.
     * @throws {APIError|Error} - Throws an error if the user is not authenticated. Also throws an error if the phone number, OTP, and phone code hash are not provided.
     */
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
                __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_sendAnalyticsEvent).call(this, constants.ACKEE_EVENTS.TELEGRAM_LINKED, "Telegram Linked");
                return data.data;
            }
            else {
                throw new APIError(data.message || "Failed to link Telegram account");
            }
        });
    }
    /**
     * Unlink the user's Twitter account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */
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
    /**
     * Unlink the user's Discord account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */
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
    /**
     * Unlink the user's Spotify account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */
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
    /**
     * Unlink the user's TikTok account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */
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
    /**
     * Unlink the user's Telegram account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */
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
}
_Auth_triggers = new WeakMap(), _Auth_ackeeInstance = new WeakMap(), _Auth_instances = new WeakSet(), _Auth_trigger = function _Auth_trigger(event, data) {
    if (__classPrivateFieldGet(this, _Auth_triggers, "f")[event]) {
        __classPrivateFieldGet(this, _Auth_triggers, "f")[event].forEach((callback) => callback(data));
    }
}, _Auth_loadAuthStatusFromStorage = function _Auth_loadAuthStatusFromStorage(provider) {
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof localStorage === "undefined") {
            return;
        }
        const walletAddress = localStorage === null || localStorage === void 0 ? void 0 : localStorage.getItem("camp-sdk:wallet-address");
        const userId = localStorage === null || localStorage === void 0 ? void 0 : localStorage.getItem("camp-sdk:user-id");
        const jwt = localStorage === null || localStorage === void 0 ? void 0 : localStorage.getItem("camp-sdk:jwt");
        if (walletAddress && userId && jwt) {
            this.walletAddress = walletAddress;
            this.userId = userId;
            this.jwt = jwt;
            this.origin = new Origin(this.jwt);
            this.isAuthenticated = true;
            /*
            let selectedProvider = provider;
      
            if (!selectedProvider) {
              const providers = providerStore.value() ?? [];
              for (const p of providers) {
                try {
                  const accounts = await p.provider.request({
                    method: "eth_requestAccounts",
                  });
                  if (accounts[0]?.toLowerCase() === walletAddress.toLowerCase()) {
                    selectedProvider = p;
                    break;
                  }
                } catch (err) {
                  console.warn("Failed to fetch accounts from provider:", err);
                }
              }
            }
              */
            if (provider) {
                this.setProvider({
                    provider: provider.provider,
                    info: provider.info || {
                        name: "Unknown",
                    },
                    address: walletAddress,
                });
            }
        }
        else {
            this.isAuthenticated = false;
        }
    });
}, _Auth_requestAccount = function _Auth_requestAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const [account] = yield this.viem.requestAddresses();
            this.walletAddress = checksumAddress(account);
            return this.walletAddress;
        }
        catch (e) {
            throw new APIError(e);
        }
    });
}, _Auth_fetchNonce = function _Auth_fetchNonce() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(`${constants.AUTH_HUB_BASE_API}/auth/client-user/nonce`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-client-id": this.clientId,
                },
                body: JSON.stringify({ walletAddress: this.walletAddress }),
            });
            const data = yield res.json();
            if (res.status !== 200) {
                return Promise.reject(data.message || "Failed to fetch nonce");
            }
            return data.data;
        }
        catch (e) {
            throw new Error(e);
        }
    });
}, _Auth_verifySignature = function _Auth_verifySignature(message, signature) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(`${constants.AUTH_HUB_BASE_API}/auth/client-user/verify`, {
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
            });
            const data = yield res.json();
            const payload = data.data.split(".")[1];
            const decoded = JSON.parse(atob(payload));
            return {
                success: !data.isError,
                userId: decoded.id,
                token: data.data,
            };
        }
        catch (e) {
            throw new APIError(e);
        }
    });
}, _Auth_createMessage = function _Auth_createMessage(nonce) {
    return createSiweMessage({
        domain: window.location.host,
        address: this.walletAddress,
        statement: constants.SIWE_MESSAGE_STATEMENT,
        uri: window.location.origin,
        version: "1",
        chainId: this.viem.chain.id,
        nonce: nonce,
    });
}, _Auth_sendAnalyticsEvent = function _Auth_sendAnalyticsEvent(event_1, message_1) {
    return __awaiter(this, arguments, void 0, function* (event, message, count = 1) {
        // if (this.#ackeeInstance)
        //   await sendAnalyticsEvent(this.#ackeeInstance, event, message, count);
        // else return;
    });
};

const ModalContext = createContext({
    isButtonDisabled: false,
    setIsButtonDisabled: () => { },
    isVisible: false,
    setIsVisible: () => { },
    isLinkingVisible: false,
    setIsLinkingVisible: () => { },
    currentlyLinking: null,
    setCurrentlyLinking: () => { },
});
const ModalProvider = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLinkingVisible, setIsLinkingVisible] = useState(false);
    const [currentlyLinking, setCurrentlyLinking] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    return (React.createElement(ModalContext.Provider, { value: {
            isButtonDisabled,
            setIsButtonDisabled,
            isVisible,
            setIsVisible,
            isLinkingVisible,
            setIsLinkingVisible,
            currentlyLinking,
            setCurrentlyLinking,
        } }, children));
};

const SocialsContext = createContext({
    query: null,
});
const SocialsProvider = ({ children }) => {
    const { authenticated } = useAuthState();
    const { auth } = useContext(CampContext);
    if (!auth && typeof window !== "undefined") {
        throw new Error("Auth instance is not available");
    }
    const query = useQuery({
        queryKey: ["socials", authenticated],
        queryFn: () => { var _a; return (_a = auth === null || auth === void 0 ? void 0 : auth.getLinkedSocials()) !== null && _a !== void 0 ? _a : Promise.resolve(null); }
    });
    return (React.createElement(SocialsContext.Provider, { value: {
            query,
        } }, children));
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$3 = ".toasts-module_toast-container__Bhoiq{bottom:10px;display:flex;flex-direction:column-reverse;gap:10px;position:fixed;right:10px;z-index:1000}.toasts-module_toast__C-fnX{word-wrap:break-word;border-radius:5px;box-shadow:0 2px 10px rgba(0,0,0,.1);color:#fff;cursor:pointer;font-family:Satoshi,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;font-size:14px;max-width:300px;opacity:.9;padding:10px 20px;position:relative}.toasts-module_toast-info__ho5FH{background-color:#007bff}.toasts-module_toast-warning__KTUFG{background-color:#cc4e02}.toasts-module_toast-error__-y03G{background-color:#dc3545}.toasts-module_toast-success__qgwDJ{background-color:#28a745}.toasts-module_toast-enter__Gduwi{animation:toasts-module_toast-in__uFYoe .3s forwards}.toasts-module_toast-exit__obsng{animation:toasts-module_toast-out__-c3s6 .3s forwards}@keyframes toasts-module_toast-in__uFYoe{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toasts-module_toast-out__-c3s6{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(20px)}}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvYXN0cy5tb2R1bGUuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNDQUVFLFdBQVksQ0FHWixZQUFhLENBQ2IsNkJBQThCLENBQzlCLFFBQVMsQ0FOVCxjQUFlLENBRWYsVUFBVyxDQUNYLFlBSUYsQ0FFQSw0QkFVRSxvQkFBcUIsQ0FSckIsaUJBQWtCLENBR2xCLG9DQUF5QyxDQUZ6QyxVQUFXLENBSVgsY0FBZSxDQUlmLDBJQUVZLENBVFosY0FBZSxDQUtmLGVBQWdCLENBSGhCLFVBQVksQ0FMWixpQkFBa0IsQ0FPbEIsaUJBTUYsQ0FFQSxpQ0FDRSx3QkFDRixDQUVBLG9DQUNFLHdCQUNGLENBRUEsa0NBQ0Usd0JBQ0YsQ0FFQSxvQ0FDRSx3QkFDRixDQUVBLGtDQUNFLG9EQUNGLENBRUEsaUNBQ0UscURBQ0YsQ0FFQSx5Q0FDRSxHQUNFLFNBQVUsQ0FDViwwQkFDRixDQUNBLEdBQ0UsU0FBVSxDQUNWLHVCQUNGLENBQ0YsQ0FFQSwwQ0FDRSxHQUNFLFNBQVUsQ0FDVix1QkFDRixDQUNBLEdBQ0UsU0FBVSxDQUNWLDBCQUNGLENBQ0YiLCJmaWxlIjoidG9hc3RzLm1vZHVsZS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIudG9hc3QtY29udGFpbmVyIHtcclxuICBwb3NpdGlvbjogZml4ZWQ7XHJcbiAgYm90dG9tOiAxMHB4O1xyXG4gIHJpZ2h0OiAxMHB4O1xyXG4gIHotaW5kZXg6IDEwMDA7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uLXJldmVyc2U7XHJcbiAgZ2FwOiAxMHB4O1xyXG59XHJcblxyXG4udG9hc3Qge1xyXG4gIHBhZGRpbmc6IDEwcHggMjBweDtcclxuICBib3JkZXItcmFkaXVzOiA1cHg7XHJcbiAgY29sb3I6ICNmZmY7XHJcbiAgZm9udC1zaXplOiAxNHB4O1xyXG4gIGJveC1zaGFkb3c6IDAgMnB4IDEwcHggcmdiYSgwLCAwLCAwLCAwLjEpO1xyXG4gIG9wYWNpdHk6IDAuOTtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIG1heC13aWR0aDogMzAwcHg7XHJcbiAgd29yZC13cmFwOiBicmVhay13b3JkO1xyXG4gIGZvbnQtZmFtaWx5OiBcIlNhdG9zaGlcIiwgc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsXHJcbiAgICBcIlNlZ29lIFVJXCIsIFJvYm90bywgT3h5Z2VuLCBVYnVudHUsIENhbnRhcmVsbCwgXCJPcGVuIFNhbnNcIiwgXCJIZWx2ZXRpY2EgTmV1ZVwiLFxyXG4gICAgc2Fucy1zZXJpZjtcclxufVxyXG5cclxuLnRvYXN0LWluZm8ge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDdiZmY7XHJcbn1cclxuXHJcbi50b2FzdC13YXJuaW5nIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2M0ZTAyO1xyXG59XHJcblxyXG4udG9hc3QtZXJyb3Ige1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNkYzM1NDU7XHJcbn1cclxuXHJcbi50b2FzdC1zdWNjZXNzIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMjhhNzQ1O1xyXG59XHJcblxyXG4udG9hc3QtZW50ZXIge1xyXG4gIGFuaW1hdGlvbjogdG9hc3QtaW4gMC4zcyBmb3J3YXJkcztcclxufVxyXG5cclxuLnRvYXN0LWV4aXQge1xyXG4gIGFuaW1hdGlvbjogdG9hc3Qtb3V0IDAuM3MgZm9yd2FyZHM7XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgdG9hc3QtaW4ge1xyXG4gIGZyb20ge1xyXG4gICAgb3BhY2l0eTogMDtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgyMHB4KTtcclxuICB9XHJcbiAgdG8ge1xyXG4gICAgb3BhY2l0eTogMTtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcclxuICB9XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgdG9hc3Qtb3V0IHtcclxuICBmcm9tIHtcclxuICAgIG9wYWNpdHk6IDE7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XHJcbiAgfVxyXG4gIHRvIHtcclxuICAgIG9wYWNpdHk6IDA7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMjBweCk7XHJcbiAgfVxyXG59XHJcbiJdfQ== */";
var styles$2 = {"toast-container":"toasts-module_toast-container__Bhoiq","toast":"toasts-module_toast__C-fnX","toast-info":"toasts-module_toast-info__ho5FH","toast-warning":"toasts-module_toast-warning__KTUFG","toast-error":"toasts-module_toast-error__-y03G","toast-success":"toasts-module_toast-success__qgwDJ","toast-enter":"toasts-module_toast-enter__Gduwi","toast-in":"toasts-module_toast-in__uFYoe","toast-exit":"toasts-module_toast-exit__obsng","toast-out":"toasts-module_toast-out__-c3s6"};
styleInject(css_248z$3);

var css_248z$2 = ".tooltip-module_tooltip-container__X8blY{display:inline-block;min-height:-moz-fit-content;min-height:fit-content;position:relative}.tooltip-module_tooltip__IN7yd{border-radius:.25rem;font-family:Satoshi,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;font-size:.875rem;font-weight:500;min-height:-moz-fit-content;min-height:fit-content;opacity:0;padding:.5rem;position:absolute;transition:opacity .2s ease,visibility .2s ease;visibility:hidden;white-space:nowrap;z-index:100}@keyframes tooltip-module_fadeIn__KR3aX{0%{opacity:0;visibility:hidden}to{opacity:1;visibility:visible}}@keyframes tooltip-module_fadeOut__JJntn{0%{opacity:1;visibility:visible}to{opacity:0;visibility:hidden}}.tooltip-module_tooltip__IN7yd.tooltip-module_show__0eq9c{animation:tooltip-module_fadeIn__KR3aX .2s ease-in-out forwards}.tooltip-module_tooltip__IN7yd.tooltip-module_top__5rD4C{bottom:100%;left:50%;margin-bottom:.5rem;transform:translateX(-50%)}.tooltip-module_tooltip__IN7yd.tooltip-module_bottom__Bk3EH{left:50%;margin-top:.5rem;top:100%;transform:translateX(-50%)}.tooltip-module_tooltip__IN7yd.tooltip-module_left__PRFtS{margin-right:.5rem;right:100%;top:50%;transform:translateY(-50%)}.tooltip-module_tooltip__IN7yd.tooltip-module_right__nQugl{left:100%;margin-left:.5rem;top:50%;transform:translateY(-50%)}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2x0aXAubW9kdWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx5Q0FFRSxvQkFBcUIsQ0FDckIsMkJBQXVCLENBQXZCLHNCQUF1QixDQUZ2QixpQkFJRixDQUVBLCtCQUdFLG9CQUFzQixDQVN0QiwwSUFFWSxDQVZaLGlCQUFtQixDQUNuQixlQUFnQixDQU1oQiwyQkFBdUIsQ0FBdkIsc0JBQXVCLENBSHZCLFNBQVUsQ0FOVixhQUFlLENBRGYsaUJBQWtCLENBU2xCLCtDQUFtRCxDQURuRCxpQkFBa0IsQ0FIbEIsa0JBQW1CLENBQ25CLFdBUUYsQ0FFQSx3Q0FDRSxHQUNFLFNBQVUsQ0FDVixpQkFDRixDQUNBLEdBQ0UsU0FBVSxDQUNWLGtCQUNGLENBQ0YsQ0FFQSx5Q0FDRSxHQUNFLFNBQVUsQ0FDVixrQkFDRixDQUNBLEdBQ0UsU0FBVSxDQUNWLGlCQUNGLENBQ0YsQ0FDQSwwREFDRSwrREFDRixDQUVBLHlEQUNFLFdBQVksQ0FDWixRQUFTLENBRVQsbUJBQXFCLENBRHJCLDBCQUVGLENBRUEsNERBRUUsUUFBUyxDQUVULGdCQUFrQixDQUhsQixRQUFTLENBRVQsMEJBRUYsQ0FFQSwwREFJRSxrQkFBb0IsQ0FIcEIsVUFBVyxDQUNYLE9BQVEsQ0FDUiwwQkFFRixDQUVBLDJEQUNFLFNBQVUsQ0FHVixpQkFBbUIsQ0FGbkIsT0FBUSxDQUNSLDBCQUVGIiwiZmlsZSI6InRvb2x0aXAubW9kdWxlLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi50b29sdGlwLWNvbnRhaW5lciB7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcclxuICBtaW4taGVpZ2h0OiBmaXQtY29udGVudDtcclxuICBcclxufVxyXG5cclxuLnRvb2x0aXAge1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICBwYWRkaW5nOiAwLjVyZW07XHJcbiAgYm9yZGVyLXJhZGl1czogMC4yNXJlbTtcclxuICBmb250LXNpemU6IDAuODc1cmVtO1xyXG4gIGZvbnQtd2VpZ2h0OiA1MDA7XHJcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuICB6LWluZGV4OiAxMDA7XHJcbiAgb3BhY2l0eTogMDtcclxuICB2aXNpYmlsaXR5OiBoaWRkZW47XHJcbiAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjJzIGVhc2UsIHZpc2liaWxpdHkgMC4ycyBlYXNlO1xyXG4gIG1pbi1oZWlnaHQ6IGZpdC1jb250ZW50O1xyXG4gIGZvbnQtZmFtaWx5OiBcIlNhdG9zaGlcIiwgc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsXHJcbiAgICBcIlNlZ29lIFVJXCIsIFJvYm90bywgT3h5Z2VuLCBVYnVudHUsIENhbnRhcmVsbCwgXCJPcGVuIFNhbnNcIiwgXCJIZWx2ZXRpY2EgTmV1ZVwiLFxyXG4gICAgc2Fucy1zZXJpZjtcclxufVxyXG5cclxuQGtleWZyYW1lcyBmYWRlSW4ge1xyXG4gIDAlIHtcclxuICAgIG9wYWNpdHk6IDA7XHJcbiAgICB2aXNpYmlsaXR5OiBoaWRkZW47XHJcbiAgfVxyXG4gIDEwMCUge1xyXG4gICAgb3BhY2l0eTogMTtcclxuICAgIHZpc2liaWxpdHk6IHZpc2libGU7XHJcbiAgfVxyXG59XHJcblxyXG5Aa2V5ZnJhbWVzIGZhZGVPdXQge1xyXG4gIDAlIHtcclxuICAgIG9wYWNpdHk6IDE7XHJcbiAgICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xyXG4gIH1cclxuICAxMDAlIHtcclxuICAgIG9wYWNpdHk6IDA7XHJcbiAgICB2aXNpYmlsaXR5OiBoaWRkZW47XHJcbiAgfVxyXG59XHJcbi50b29sdGlwLnNob3cge1xyXG4gIGFuaW1hdGlvbjogZmFkZUluIDAuMnMgZWFzZS1pbi1vdXQgZm9yd2FyZHM7XHJcbn1cclxuXHJcbi50b29sdGlwLnRvcCB7XHJcbiAgYm90dG9tOiAxMDAlO1xyXG4gIGxlZnQ6IDUwJTtcclxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSk7XHJcbiAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xyXG59XHJcblxyXG4udG9vbHRpcC5ib3R0b20ge1xyXG4gIHRvcDogMTAwJTtcclxuICBsZWZ0OiA1MCU7XHJcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpO1xyXG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcclxufVxyXG5cclxuLnRvb2x0aXAubGVmdCB7XHJcbiAgcmlnaHQ6IDEwMCU7XHJcbiAgdG9wOiA1MCU7XHJcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xyXG4gIG1hcmdpbi1yaWdodDogMC41cmVtO1xyXG59XHJcblxyXG4udG9vbHRpcC5yaWdodCB7XHJcbiAgbGVmdDogMTAwJTtcclxuICB0b3A6IDUwJTtcclxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7XHJcbiAgbWFyZ2luLWxlZnQ6IDAuNXJlbTtcclxufVxyXG4iXX0= */";
var styles$1 = {"tooltip-container":"tooltip-module_tooltip-container__X8blY","tooltip":"tooltip-module_tooltip__IN7yd","show":"tooltip-module_show__0eq9c","fadeIn":"tooltip-module_fadeIn__KR3aX","top":"tooltip-module_top__5rD4C","bottom":"tooltip-module_bottom__Bk3EH","left":"tooltip-module_left__PRFtS","right":"tooltip-module_right__nQugl","fadeOut":"tooltip-module_fadeOut__JJntn"};
styleInject(css_248z$2);

/**
 * Tooltip component to wrap other components and display a tooltip on hover.
 * Uses portals to render the tooltip outside of its parent container.
 * @param {TooltipProps} props The props for the Tooltip component.
 * @returns {JSX.Element} The Tooltip component.
 */
const Tooltip = ({ content, position = "top", backgroundColor = "#333", textColor = "#fff", containerStyle = {}, children, }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [tooltipPosition, setTooltipPosition] = useState(null);
    const handleMouseEnter = (e) => {
        setIsVisible(true);
        setTooltipPosition(e.currentTarget.getBoundingClientRect());
    };
    const handleMouseLeave = () => {
        setIsVisible(false);
        setTooltipPosition(null);
    };
    const tooltipStyles = Object.assign({ backgroundColor, color: textColor, position: "absolute", zIndex: 1000 }, getTooltipPosition(tooltipPosition, position));
    return (React.createElement("div", { className: styles$1["tooltip-container"], onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, style: containerStyle },
        children,
        isVisible &&
            tooltipPosition &&
            typeof document !== "undefined" &&
            ReactDOM.createPortal(React.createElement("div", { className: `${styles$1.tooltip} ${styles$1[position]} ${styles$1["show"]}`, style: tooltipStyles }, content), document.body)));
};
/**
 * Calculate the position of the tooltip based on the target element's position and the desired tooltip position.
 * Adjusts the position to ensure the tooltip stays within the viewport.
 * @param {DOMRect | null} rect The bounding client rect of the target element.
 * @param {"top" | "bottom" | "left" | "right"} position The desired tooltip position.
 * @returns {CSSProperties} The calculated position styles for the tooltip.
 */
const getTooltipPosition = (rect, position) => {
    if (!rect)
        return {};
    if (typeof window === "undefined")
        return {};
    const spacing = 8; // Space between the tooltip and the target element
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    let top = 0, left = 0, transform = "";
    switch (position) {
        case "top":
            top = rect.top - spacing;
            left = rect.left + rect.width / 2;
            transform = "translate(-50%, -100%)";
            if (top < 0) {
                top = rect.bottom + spacing;
                transform = "translate(-50%, 0)";
            }
            break;
        case "bottom":
            top = rect.bottom + spacing;
            left = rect.left + rect.width / 2;
            transform = "translate(-50%, 0)";
            if (top > viewportHeight) {
                top = rect.top - spacing;
                transform = "translate(-50%, -100%)";
            }
            break;
        case "left":
            top = rect.top + rect.height / 2;
            left = rect.left - spacing;
            transform = "translate(-100%, -50%)";
            if (left < 0) {
                left = rect.right + spacing;
                transform = "translate(0, -50%)";
            }
            break;
        case "right":
            top = rect.top + rect.height / 2;
            left = rect.right + spacing;
            transform = "translate(0, -50%)";
            if (left > viewportWidth) {
                left = rect.left - spacing;
                transform = "translate(-100%, -50%)";
            }
            break;
    }
    return { top, left, transform };
};

var css_248z$1 = "@import url(\"https://api.fontshare.com/v2/css?f[]=satoshi@1&display=swap\");.auth-module_modal__yyg5L{-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);background-color:#000;background-color:rgba(0,0,0,.4);height:100%;left:0;overflow:auto;position:fixed;top:0;transition:all .3s;width:100%;z-index:85}.auth-module_modal__yyg5L .auth-module_outer-container__RraOQ{align-items:center;box-sizing:border-box;display:flex;flex-direction:row;font-family:Satoshi,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;justify-content:center;left:50%;position:absolute;top:50%;transform:translate(-50%,-50%);@media screen and (max-width:440px){border-bottom-left-radius:0;border-bottom-right-radius:0;bottom:0;top:auto;transform:translate(-50%);width:100%}}.auth-module_outer-container__RraOQ .auth-module_container__7utns{align-items:center;background-color:#fefefe;border:1px solid #888;border-radius:1.5rem;box-sizing:border-box;flex-direction:column;justify-content:center;padding:1.5rem 1.5rem 1rem;position:relative;text-align:center;width:400px;@media screen and (max-width:440px){border-radius:0;height:auto;max-height:100vh;overflow-y:auto;padding-bottom:1rem;padding-bottom:.5rem;padding-left:1rem;padding-right:1rem;padding-top:1rem;width:100%}}.auth-module_container__7utns.auth-module_linking-container__mYNwD{max-width:300px;@media screen and (max-width:440px){max-width:100%}}.auth-module_origin-tab__miOUK{align-items:center;display:flex;flex-direction:column;gap:.5rem;height:100%;justify-content:space-between;width:100%}.auth-module_origin-section__UBhBB{align-items:center;display:flex;flex-direction:row;gap:.5rem;justify-content:space-evenly;width:100%}.auth-module_origin-section__UBhBB .auth-module_origin-container__ZIk4c{align-items:center;color:#333;display:flex;flex-direction:column;font-size:.875rem;font-weight:400;justify-content:center;margin-bottom:.5rem;margin-top:.5rem;min-height:3rem;min-width:1rem;text-align:center;width:100%}.auth-module_origin-wrapper__JQfEI{align-items:center;display:flex;flex-direction:column;gap:.5rem;justify-content:center;width:100%}.auth-module_origin-container__ZIk4c .auth-module_origin-label__l-1q9{color:#777;font-size:.75rem;font-weight:400;margin-bottom:.25rem;text-align:center}.auth-module_horizontal-divider__YfWCy{background-color:#ddd;height:1px;margin-bottom:.5rem;margin-top:.5rem;width:100%}.auth-module_origin-section__UBhBB .auth-module_divider__z65Me{background-color:#ddd;height:1rem;width:1px}.auth-module_origin-dashboard-button__-pch4{align-items:center;border:none;color:#ff6f00;display:flex;flex-direction:row;font-size:.875rem;gap:.5rem;justify-content:center;padding:.25rem;width:100%}.auth-module_origin-dashboard-button__-pch4:hover{color:#cc4e02;cursor:pointer}.auth-module_origin-dashboard-button__-pch4:disabled{background-color:#ccc;cursor:not-allowed}.auth-module_container__7utns h2{font-size:1.25rem;margin-bottom:1rem;margin-top:0}.auth-module_container__7utns .auth-module_header__pX9nM{align-items:center;color:#333;display:flex;flex-direction:row;font-weight:700;gap:.5rem;justify-content:flex-start;margin-bottom:1rem;text-align:left;width:100%;@media screen and (max-width:440px){margin-bottom:.5rem;margin-top:0}}.auth-module_linking-container__mYNwD .auth-module_header__pX9nM{justify-content:center}.auth-module_container__7utns .auth-module_auth-header__LsM1f{align-items:center;color:#333;display:flex;flex-direction:column;font-weight:700;justify-content:center;margin-bottom:1rem;text-align:center;width:100%}.auth-module_container__7utns .auth-module_header__pX9nM .auth-module_small-modal-icon__YayD1{height:2rem;margin-bottom:.5rem;margin-top:.5rem;width:2rem}.auth-module_container__7utns .auth-module_header__pX9nM .auth-module_wallet-address__AVVA5{color:#777;font-size:.75rem;font-weight:400;margin-top:.2rem}.auth-module_container__7utns .auth-module_close-button__uZrho{background-color:#fff;border:2px solid #ddd;border-radius:100%;color:#aaa;font-size:1.5rem;height:1.25rem;position:absolute;right:1rem;top:1rem;transition:color .15s;width:1.25rem}.auth-module_close-button__uZrho>.auth-module_close-icon__SSCni{display:block;height:1rem;padding:.15rem;position:relative;width:1rem}.auth-module_container__7utns .auth-module_close-button__uZrho:hover{background-color:#ddd;color:#888;cursor:pointer}.auth-module_container__7utns .auth-module_linking-text__uz3ud{color:#777;font-size:1rem;text-align:center}.auth-module_provider-list__6vISy{box-sizing:border-box;display:flex;flex-direction:column;gap:.5rem;margin-bottom:.75rem;max-height:17.9rem;overflow-y:auto;padding-left:.5rem;padding-right:.5rem;scrollbar-color:#ccc #f1f1f1;scrollbar-width:thin;width:100%}.auth-module_provider-list__6vISy.auth-module_big__jQxvN{max-height:16rem}.auth-module_provider-list__6vISy::-webkit-scrollbar{border-radius:.25rem;width:.5rem}.auth-module_provider-list__6vISy::-webkit-scrollbar-thumb{background-color:#ccc;border-radius:.25rem}.auth-module_provider-list__6vISy::-webkit-scrollbar-track{background-color:#f1f1f1;border-radius:.25rem}.auth-module_spinner__hfzlH:after{animation:auth-module_spin__tm9l6 1s linear infinite;border:.25rem solid #f3f3f3;border-radius:50%;border-top-color:#ff6f00;content:\"\";display:block;height:1rem;width:1rem}.auth-module_spinner__hfzlH{align-self:center;display:flex;justify-content:center;margin-left:auto;margin-right:.25rem}@keyframes auth-module_spin__tm9l6{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}.auth-module_modal-icon__CV7ah{align-items:center;display:flex;height:4rem;justify-content:center;margin-bottom:.25rem;margin-top:.5rem;padding:.35rem;width:4rem}.auth-module_modal-icon__CV7ah svg{height:3.6rem;width:3.6rem}.auth-module_container__7utns a.auth-module_footer-text__CQnh6{color:#bbb;font-size:.75rem;text-decoration:none}.auth-module_container__7utns a.auth-module_footer-text__CQnh6:hover{text-decoration:underline}.auth-module_disconnect-button__bsu-3{background-color:#ff6f00;border:none;border-radius:.75rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);color:#fff;font-size:1rem;height:2.5rem;margin-bottom:.75rem;margin-top:1rem;padding:1rem;padding-block:0;width:100%}.auth-module_disconnect-button__bsu-3:hover{background-color:#cc4e02;cursor:pointer}.auth-module_disconnect-button__bsu-3:disabled{background-color:#ccc;cursor:not-allowed}.auth-module_linking-button__g1GlL{background-color:#ff6f00;border:none;border-radius:.75rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);color:#fff;font-size:1rem;height:2.5rem;margin-bottom:.75rem;margin-top:1rem;padding:1rem;padding-block:0;width:100%}.auth-module_linking-button__g1GlL:hover{background-color:#cc4e02;cursor:pointer}.auth-module_linking-button__g1GlL:disabled{background-color:#ccc;cursor:not-allowed}.auth-module_socials-wrapper__PshV3{display:flex;flex-direction:column;gap:1rem;margin-block:.5rem;width:100%}.auth-module_socials-container__iDzfJ{display:flex;flex-direction:column;gap:.5rem;width:100%}.auth-module_socials-container__iDzfJ .auth-module_connector-container__4wn11{align-items:center;display:flex;gap:.25rem;justify-content:flex-start;position:relative}.auth-module_socials-container__iDzfJ .auth-module_connector-button__j79HA{align-items:center;background-color:#fefefe;border:1px solid #ddd;border-radius:.75rem;color:#333;display:flex;font-size:.875rem;gap:.25rem;height:2.5rem;padding:.75rem;position:relative;width:100%}.auth-module_socials-container__iDzfJ .auth-module_connector-button__j79HA:hover{background-color:#ddd;cursor:pointer}.auth-module_socials-container__iDzfJ .auth-module_connector-button__j79HA:disabled{background-color:#fefefe;cursor:default}.auth-module_socials-container__iDzfJ .auth-module_connector-button__j79HA svg{color:#333;height:1.5rem;margin-right:.5rem;width:1.5rem}.auth-module_socials-container__iDzfJ .auth-module_connector-connected__JvDQb{align-items:center;background-color:#eee;border:1px solid #ddd;border-radius:.25rem;color:#333;display:flex;flex:1;font-size:.875rem;gap:.25rem;padding:.5rem .75rem;position:relative;width:100%}.auth-module_socials-container__iDzfJ .auth-module_connector-connected__JvDQb svg{color:#333;height:1.5rem;margin-right:.5rem;width:1.5rem}.auth-module_socials-container__iDzfJ h3{color:#333;margin:0}.auth-module_connector-button__j79HA .auth-module_connector-checkmark__ZS6zU{height:1rem!important;position:absolute;right:-.5rem;top:-.5rem;width:1rem!important}.auth-module_unlink-connector-button__6Fwkp{align-items:center;background-color:#999;border:none;border-radius:.5rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);color:#fff;display:flex;font-size:.75rem;gap:.25rem;padding:.25rem .675rem .25rem .5rem;position:absolute;right:.375rem;text-align:center;transition:background-color .15s}.auth-module_unlink-connector-button__6Fwkp svg{stroke:#fff!important;height:.875rem!important;margin-right:0!important;width:.875rem!important}.auth-module_unlink-connector-button__6Fwkp:hover{background-color:#888;cursor:pointer}.auth-module_unlink-connector-button__6Fwkp:disabled{background-color:#ccc;cursor:not-allowed}@keyframes auth-module_loader__gH3ZC{0%{transform:translateX(0)}50%{transform:translateX(100%)}to{transform:translateX(0)}}.auth-module_loader__gH3ZC{background-color:#ddd;border-radius:.125rem;height:.4rem;margin-bottom:.5rem;margin-top:.5rem;position:relative;width:4rem}.auth-module_loader__gH3ZC:before{animation:auth-module_loader__gH3ZC 1.5s ease-in-out infinite;background-color:#ff6f00;border-radius:.125rem;content:\"\";display:block;height:.4rem;left:0;position:absolute;width:2rem}.auth-module_no-socials__wEx0t{color:#777;font-size:.875rem;margin-top:.5rem;text-align:center}.auth-module_divider__z65Me{align-items:center;display:flex;gap:.5rem;margin-bottom:.5rem;margin-top:.5rem}.auth-module_divider__z65Me:after,.auth-module_divider__z65Me:before{border-bottom:1px solid #ddd;content:\"\";flex:1}input.auth-module_tiktok-input__FeqdG{border:1px solid gray;border-radius:.75rem;color:#000;font-family:Satoshi,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;font-size:1rem;font-weight:600;height:2.75rem;line-height:1.333rem;margin-top:1rem;padding-inline:1rem;width:100%}input.auth-module_tiktok-input__FeqdG.auth-module_invalid__qqgK6{border-color:#dc3545;outline-color:#dc3545}.auth-module_otp-input-container__B2NH6{display:flex;gap:.5rem;justify-content:center;margin-top:1rem}.auth-module_otp-input__vjImt{border:1px solid #ccc;border-radius:.5rem;font-size:1.5rem;height:2.5rem;outline:none;text-align:center;transition:border-color .2s;width:2rem}.auth-module_otp-input__vjImt:focus{border-color:#ff6f00}.auth-module_tabs__RcUmV{display:flex;justify-content:flex-start;margin-bottom:calc(-.5rem - 1px);max-width:100%;overflow-x:auto}.auth-module_tabs__RcUmV::-webkit-scrollbar{display:none}.auth-module_tabs__RcUmV::-webkit-scrollbar-thumb{background-color:#ccc;border-radius:.25rem}.auth-module_tab-button__HT6wc{background-color:#fefefe;border:2px transparent;border-radius:0;border-right:2px solid #ddd;color:#333;cursor:pointer;font-size:.875rem;font-weight:400;padding:.75rem 1rem;text-align:left;transition:background-color .2s}.auth-module_tab-button__HT6wc:hover{background-color:#eee;border-color:#ddd}.auth-module_tab-button__HT6wc:focus{border-color:#ff6f00;outline:none}.auth-module_active-tab__l6P44{border-right-color:#ff6f00}.auth-module_tab-content__noHF0{height:20rem;margin-top:.25rem;min-height:20rem;width:100%}.auth-module_vertical-tabs-container__6sAOL{box-sizing:border-box;display:flex;flex-direction:row;gap:.5rem;width:100%}.auth-module_vertical-tabs__-ba-W{display:flex;flex-direction:column;gap:.25rem;height:100%;margin-left:-1rem;min-width:-moz-fit-content!important;min-width:fit-content!important;overflow-y:auto}.auth-module_vertical-tab-content__wTqKF{background-color:#f9f9f9;border:1px solid #ddd;border-radius:.25rem;flex:1 1 0%;height:22rem;max-width:100%;min-height:22rem;overflow:hidden;padding:1rem}.auth-module_ip-tab-container__ck0F8{justify-content:space-between}.auth-module_ip-tab-container__ck0F8,.auth-module_ip-tab-content__VI4zC{align-items:center;display:flex;flex-direction:column;gap:1rem;height:100%;width:100%}.auth-module_ip-tab-content__VI4zC{justify-content:center}.auth-module_ip-tab-content-text__y2BRh{color:#777;font-size:.875rem;margin-top:.5rem;text-align:center}.auth-module_contract-button-container__7HH9n{align-items:center;display:flex;flex-direction:column;gap:1rem;margin-top:1rem}.auth-module_contract-input__4BYcs{border:1px solid #ccc;border-radius:.5rem;color:#333;font-size:1rem;max-width:300px;outline:none;padding:.5rem;transition:border-color .2s;width:100%}.auth-module_contract-input__4BYcs:focus{border-color:#ff6f00}.auth-module_contract-button__Cq6zI{background-color:#ff6f00;border:none;border-radius:.5rem;color:#fff;cursor:pointer;font-size:1rem;padding:.75rem 1.5rem;transition:background-color .2s}.auth-module_contract-button__Cq6zI:hover{background-color:#cc4e02}.auth-module_contract-button__Cq6zI:disabled{background-color:#ccc;cursor:not-allowed}.auth-module_no-provider-warning__YzGd-{align-items:center;background-color:#fff3cd;border:1px solid #ffeeba;border-radius:.75rem;box-shadow:0 2px 4px rgba(255,223,0,.05);color:#856404;cursor:pointer;display:flex;font-size:1rem;justify-content:center;line-height:1.4;margin-top:1rem;min-height:3.25rem;padding:.5rem;text-align:center;transition:background-color .2s,color .2s,border-color .2s;white-space:normal;width:100%}.auth-module_no-provider-warning__YzGd-:hover{background-color:#ffe8a1;border-color:#ffd966;color:#7a5c00}.auth-module_no-provider-warning__YzGd-:active{background-color:#ffe8a1;border-color:#ffd966;color:#5c4300}.auth-module_no-provider-warning__YzGd-:focus{outline:2px solid #ff6f00;outline-offset:2px}.auth-module_tab-provider-required-overlay__dvmIR{align-items:center;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);background:hsla(0,0%,100%,.7);border-radius:inherit;color:#333;display:flex;font-size:1.1rem;font-weight:600;height:100%;justify-content:center;left:0;position:absolute;text-align:center;top:0;width:100%;z-index:10}\n/*# sourceMappingURL=data:application/json;base64,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RSxDQUNoRSxrQkFBbUIsQ0FObkIsVUFZRixDQUVBLDhDQUNFLHdCQUF5QixDQUV6QixvQkFBcUIsQ0FEckIsYUFFRixDQUVBLCtDQUNFLHdCQUF5QixDQUV6QixvQkFBcUIsQ0FEckIsYUFFRixDQUVBLDhDQUNFLHlCQUEwQixDQUMxQixrQkFDRixDQUVBLGtEQVVFLGtCQUFtQixDQUhuQixpQ0FBMEIsQ0FBMUIseUJBQTBCLENBRDFCLDZCQUFvQyxDQVVwQyxxQkFBc0IsQ0FGdEIsVUFBVyxDQUxYLFlBQWEsQ0FJYixnQkFBaUIsQ0FEakIsZUFBZ0IsQ0FQaEIsV0FBWSxDQU1aLHNCQUF1QixDQVJ2QixNQUFPLENBRlAsaUJBQWtCLENBY2xCLGlCQUFrQixDQWJsQixLQUFNLENBRU4sVUFBVyxDQUlYLFVBU0YiLCJmaWxlIjoiYXV0aC5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCB1cmwoXCJodHRwczovL2FwaS5mb250c2hhcmUuY29tL3YyL2Nzcz9mW109c2F0b3NoaUAxJmRpc3BsYXk9c3dhcFwiKTtcclxuXHJcbi5tb2RhbCB7XHJcbiAgcG9zaXRpb246IGZpeGVkO1xyXG4gIHotaW5kZXg6IDg1O1xyXG4gIGxlZnQ6IDA7XHJcbiAgdG9wOiAwO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIGhlaWdodDogMTAwJTtcclxuICBvdmVyZmxvdzogYXV0bztcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMCwgMCwgMCk7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjQpO1xyXG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigycHgpO1xyXG4gIHRyYW5zaXRpb246IGFsbCAwLjNzO1xyXG59XHJcblxyXG4ubW9kYWwgLm91dGVyLWNvbnRhaW5lciB7XHJcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICBmb250LWZhbWlseTogXCJTYXRvc2hpXCIsIHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LFxyXG4gICAgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIE94eWdlbiwgVWJ1bnR1LCBDYW50YXJlbGwsIFwiT3BlbiBTYW5zXCIsIFwiSGVsdmV0aWNhIE5ldWVcIixcclxuICAgIHNhbnMtc2VyaWY7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHRvcDogNTAlO1xyXG4gIGxlZnQ6IDUwJTtcclxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcclxuXHJcbiAgLyogZGlhbG9nIG9uIG1vYmlsZSAqL1xyXG4gIEBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDQ0MHB4KSB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDA7XHJcbiAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcclxuICAgIGJvdHRvbTogMDtcclxuICAgIHRvcDogYXV0bztcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIDApO1xyXG4gIH1cclxufVxyXG5cclxuLm91dGVyLWNvbnRhaW5lciAuY29udGFpbmVyIHtcclxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZWZlZmU7XHJcbiAgYm9yZGVyOiAxcHggc29saWQgIzg4ODtcclxuICBib3JkZXItcmFkaXVzOiAxLjVyZW07XHJcbiAgd2lkdGg6IDQwMHB4OyAvKiB0ZW1wb3JhcnkgKi9cclxuICBwYWRkaW5nOiAxLjVyZW07XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICBwYWRkaW5nLWJvdHRvbTogMXJlbTtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuXHJcbiAgQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNDQwcHgpIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgYm9yZGVyLXJhZGl1czogMDtcclxuICAgIHBhZGRpbmc6IDFyZW07XHJcbiAgICBwYWRkaW5nLWJvdHRvbTogMC41cmVtO1xyXG4gICAgaGVpZ2h0OiBhdXRvO1xyXG4gICAgbWF4LWhlaWdodDogMTAwdmg7XHJcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xyXG4gIH1cclxufVxyXG5cclxuLmNvbnRhaW5lci5saW5raW5nLWNvbnRhaW5lciB7XHJcbiAgbWF4LXdpZHRoOiAzMDBweDtcclxuXHJcbiAgQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNDQwcHgpIHtcclxuICAgIG1heC13aWR0aDogMTAwJTtcclxuICB9XHJcbn1cclxuXHJcbi5vcmlnaW4tdGFiIHtcclxuICBoZWlnaHQ6IDEwMCU7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGdhcDogMC41cmVtO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG59XHJcbi5vcmlnaW4tc2VjdGlvbiB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgZ2FwOiAwLjVyZW07XHJcbiAgd2lkdGg6IDEwMCU7XHJcbn1cclxuXHJcbi5vcmlnaW4tc2VjdGlvbiAub3JpZ2luLWNvbnRhaW5lciB7XHJcbiAgbWluLXdpZHRoOiAxcmVtO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIG1pbi1oZWlnaHQ6IDNyZW07XHJcbiAgZm9udC1zaXplOiAwLjg3NXJlbTtcclxuICBmb250LXdlaWdodDogNDAwO1xyXG4gIGNvbG9yOiAjMzMzO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIG1hcmdpbi1ib3R0b206IDAuNXJlbTtcclxuICBtYXJnaW4tdG9wOiAwLjVyZW07XHJcbn1cclxuXHJcbi5vcmlnaW4td3JhcHBlciB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgZ2FwOiAwLjVyZW07XHJcbiAgd2lkdGg6IDEwMCU7XHJcbn1cclxuXHJcbi5vcmlnaW4tY29udGFpbmVyIC5vcmlnaW4tbGFiZWwge1xyXG4gIGZvbnQtc2l6ZTogMC43NXJlbTtcclxuICBmb250LXdlaWdodDogNDAwO1xyXG4gIGNvbG9yOiAjNzc3Nzc3O1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICBtYXJnaW4tYm90dG9tOiAwLjI1cmVtO1xyXG59XHJcblxyXG4uaG9yaXpvbnRhbC1kaXZpZGVyIHtcclxuICB3aWR0aDogMTAwJTtcclxuICBoZWlnaHQ6IDFweDtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGRkO1xyXG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcclxuICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XHJcbn1cclxuXHJcbi5vcmlnaW4tc2VjdGlvbiAuZGl2aWRlciB7XHJcbiAgd2lkdGg6IDFweDtcclxuICBoZWlnaHQ6IDFyZW07XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2RkZDtcclxufVxyXG5cclxuLm9yaWdpbi1kYXNoYm9hcmQtYnV0dG9uIHtcclxuICAvKiBiYWNrZ3JvdW5kLWNvbG9yOiAjZmY2ZjAwOyAqL1xyXG4gIGNvbG9yOiAjZmY2ZjAwO1xyXG4gIGJvcmRlcjogbm9uZTtcclxuICAvKiBib3JkZXItcmFkaXVzOiAwLjc1cmVtOyAqL1xyXG4gIHBhZGRpbmc6IDAuMjVyZW07XHJcbiAgZm9udC1zaXplOiAwLjg3NXJlbTtcclxuICB3aWR0aDogMTAwJTtcclxuICAvKiBib3gtc2hhZG93OiBoc2xhKDAsIDAlLCAxMDAlLCAwLjE1KSAwIDJweCAwIGluc2V0LFxyXG4gICAgcmdiYSgwLCAwLCAwLCAwLjA1KSAwIC0ycHggNHB4IGluc2V0LCByZ2JhKDQ2LCA1NCwgODAsIDAuMDc1KSAwIDFweCAxcHg7ICovXHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgZ2FwOiAwLjVyZW07XHJcbn1cclxuXHJcbi5vcmlnaW4tZGFzaGJvYXJkLWJ1dHRvbjpob3ZlciB7XHJcbiAgLyogYmFja2dyb3VuZC1jb2xvcjogI2NjNGUwMjsgKi9cclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgY29sb3I6ICNjYzRlMDI7XHJcbn1cclxuXHJcbi5vcmlnaW4tZGFzaGJvYXJkLWJ1dHRvbjpkaXNhYmxlZCB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2NjYztcclxuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xyXG59XHJcblxyXG4uY29udGFpbmVyIGgyIHtcclxuICBtYXJnaW4tdG9wOiAwO1xyXG4gIG1hcmdpbi1ib3R0b206IDFyZW07XHJcbiAgZm9udC1zaXplOiAxLjI1cmVtO1xyXG59XHJcblxyXG4uY29udGFpbmVyIC5oZWFkZXIge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICBjb2xvcjogIzMzMztcclxuICB3aWR0aDogMTAwJTtcclxuICB0ZXh0LWFsaWduOiBsZWZ0O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcclxuICAvKiBtYXJnaW4tdG9wOiAtMC42cmVtOyAqL1xyXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG4gIGdhcDogMC41cmVtO1xyXG5cclxuICBAbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA0NDBweCkge1xyXG4gICAgbWFyZ2luLXRvcDogMDtcclxuICAgIG1hcmdpbi1ib3R0b206IDAuNXJlbTtcclxuICB9XHJcbn1cclxuXHJcbi5saW5raW5nLWNvbnRhaW5lciAuaGVhZGVyIHtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxufVxyXG5cclxuLmNvbnRhaW5lciAuYXV0aC1oZWFkZXIge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGNvbG9yOiAjMzMzO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xyXG4gIGZvbnQtd2VpZ2h0OiBib2xkO1xyXG59XHJcblxyXG4uY29udGFpbmVyIC5oZWFkZXIgLnNtYWxsLW1vZGFsLWljb24ge1xyXG4gIHdpZHRoOiAycmVtO1xyXG4gIGhlaWdodDogMnJlbTtcclxuICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XHJcbiAgbWFyZ2luLXRvcDogMC41cmVtO1xyXG59XHJcblxyXG4uY29udGFpbmVyIC5oZWFkZXIgLndhbGxldC1hZGRyZXNzIHtcclxuICBmb250LXNpemU6IDAuNzVyZW07XHJcbiAgY29sb3I6ICM3Nzc7XHJcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcclxuICBtYXJnaW4tdG9wOiAwLjJyZW07XHJcbn1cclxuXHJcbi5jb250YWluZXIgLmNsb3NlLWJ1dHRvbiB7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHRvcDogMXJlbTtcclxuICByaWdodDogMXJlbTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcclxuICBib3JkZXI6IDJweCBzb2xpZCAjZGRkO1xyXG4gIGJvcmRlci1yYWRpdXM6IDEwMCU7XHJcbiAgZm9udC1zaXplOiAxLjVyZW07XHJcbiAgY29sb3I6ICNhYWE7XHJcbiAgd2lkdGg6IDEuMjVyZW07XHJcbiAgaGVpZ2h0OiAxLjI1cmVtO1xyXG4gIHRyYW5zaXRpb246IGNvbG9yIDAuMTVzO1xyXG59XHJcblxyXG4uY2xvc2UtYnV0dG9uID4gLmNsb3NlLWljb24ge1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBkaXNwbGF5OiBibG9jaztcclxuICB3aWR0aDogMXJlbTtcclxuICBoZWlnaHQ6IDFyZW07XHJcbiAgcGFkZGluZzogMC4xNXJlbTtcclxufVxyXG5cclxuLmNvbnRhaW5lciAuY2xvc2UtYnV0dG9uOmhvdmVyIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGRkO1xyXG4gIGNvbG9yOiAjODg4O1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5cclxuLmNvbnRhaW5lciAubGlua2luZy10ZXh0IHtcclxuICBjb2xvcjogIzc3NztcclxuICBmb250LXNpemU6IDFyZW07XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIC8qIG1hcmdpbi10b3A6IDA7ICovXHJcbiAgLyogbWFyZ2luLWJvdHRvbTogMnJlbTsgKi9cclxufVxyXG5cclxuLnByb3ZpZGVyLWxpc3Qge1xyXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGdhcDogMC41cmVtO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIG1hcmdpbi1ib3R0b206IDAuNzVyZW07XHJcbiAgbWF4LWhlaWdodDogMTcuOXJlbTtcclxuICBvdmVyZmxvdy15OiBhdXRvO1xyXG4gIHBhZGRpbmctcmlnaHQ6IDAuNXJlbTtcclxuICBwYWRkaW5nLWxlZnQ6IDAuNXJlbTtcclxuICBzY3JvbGxiYXItd2lkdGg6IHRoaW47XHJcbiAgc2Nyb2xsYmFyLWNvbG9yOiAjY2NjICNmMWYxZjE7XHJcbn1cclxuXHJcbi5wcm92aWRlci1saXN0LmJpZyB7XHJcbiAgbWF4LWhlaWdodDogMTZyZW07XHJcbn1cclxuXHJcbi5wcm92aWRlci1saXN0Ojotd2Via2l0LXNjcm9sbGJhciB7XHJcbiAgd2lkdGg6IDAuNXJlbTtcclxuICBib3JkZXItcmFkaXVzOiAwLjI1cmVtO1xyXG59XHJcbi5wcm92aWRlci1saXN0Ojotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2NjYztcclxuICBib3JkZXItcmFkaXVzOiAwLjI1cmVtO1xyXG59XHJcbi5wcm92aWRlci1saXN0Ojotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2YxZjFmMTtcclxuICBib3JkZXItcmFkaXVzOiAwLjI1cmVtO1xyXG59XHJcblxyXG4uc3Bpbm5lcjo6YWZ0ZXIge1xyXG4gIGNvbnRlbnQ6IFwiXCI7XHJcbiAgZGlzcGxheTogYmxvY2s7XHJcbiAgd2lkdGg6IDFyZW07XHJcbiAgaGVpZ2h0OiAxcmVtO1xyXG4gIGJvcmRlcjogMC4yNXJlbSBzb2xpZCAjZjNmM2YzO1xyXG4gIGJvcmRlci10b3A6IDAuMjVyZW0gc29saWQgI2ZmNmYwMDtcclxuICBib3JkZXItcmFkaXVzOiA1MCU7XHJcbiAgYW5pbWF0aW9uOiBzcGluIDFzIGxpbmVhciBpbmZpbml0ZTtcclxufVxyXG4uc3Bpbm5lciB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBtYXJnaW4tbGVmdDogYXV0bztcclxuICBtYXJnaW4tcmlnaHQ6IDAuMjVyZW07XHJcbiAgYWxpZ24tc2VsZjogY2VudGVyO1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG59XHJcblxyXG5Aa2V5ZnJhbWVzIHNwaW4ge1xyXG4gIDAlIHtcclxuICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpO1xyXG4gIH1cclxuICAxMDAlIHtcclxuICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XHJcbiAgfVxyXG59XHJcblxyXG4ubW9kYWwtaWNvbiB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIHdpZHRoOiA0cmVtO1xyXG4gIGhlaWdodDogNHJlbTtcclxuICBtYXJnaW4tdG9wOiAwLjVyZW07XHJcbiAgbWFyZ2luLWJvdHRvbTogMC4yNXJlbTtcclxuICBwYWRkaW5nOiAwLjM1cmVtO1xyXG59XHJcbi5tb2RhbC1pY29uIHN2ZyB7XHJcbiAgd2lkdGg6IDMuNnJlbTtcclxuICBoZWlnaHQ6IDMuNnJlbTtcclxufVxyXG5cclxuLmNvbnRhaW5lciBhLmZvb3Rlci10ZXh0IHtcclxuICAvKiBtYXJnaW4tdG9wOiAxcmVtOyAqL1xyXG4gIGZvbnQtc2l6ZTogMC43NXJlbTtcclxuICBjb2xvcjogI2JiYmJiYjtcclxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XHJcbn1cclxuXHJcbi5jb250YWluZXIgYS5mb290ZXItdGV4dDpob3ZlciB7XHJcbiAgdGV4dC1kZWNvcmF0aW9uOiB1bmRlcmxpbmU7XHJcbn1cclxuXHJcbi5kaXNjb25uZWN0LWJ1dHRvbiB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmNmYwMDtcclxuICBjb2xvcjogd2hpdGU7XHJcbiAgYm9yZGVyOiBub25lO1xyXG4gIGJvcmRlci1yYWRpdXM6IDAuNzVyZW07XHJcbiAgcGFkZGluZzogMXJlbTtcclxuICBwYWRkaW5nLWJsb2NrOiAwO1xyXG4gIGZvbnQtc2l6ZTogMXJlbTtcclxuICB3aWR0aDogMTAwJTtcclxuICBtYXJnaW4tYm90dG9tOiAwLjc1cmVtO1xyXG4gIG1hcmdpbi10b3A6IDFyZW07XHJcbiAgaGVpZ2h0OiAyLjVyZW07XHJcbiAgYm94LXNoYWRvdzogaHNsYSgwLCAwJSwgMTAwJSwgMC4xNSkgMCAycHggMCBpbnNldCxcclxuICAgIHJnYmEoMCwgMCwgMCwgMC4wNSkgMCAtMnB4IDRweCBpbnNldCwgcmdiYSg0NiwgNTQsIDgwLCAwLjA3NSkgMCAxcHggMXB4O1xyXG59XHJcblxyXG4uZGlzY29ubmVjdC1idXR0b246aG92ZXIge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNjYzRlMDI7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcblxyXG4uZGlzY29ubmVjdC1idXR0b246ZGlzYWJsZWQge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNjY2M7XHJcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcclxufVxyXG5cclxuLmxpbmtpbmctYnV0dG9uIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmY2ZjAwO1xyXG4gIGNvbG9yOiB3aGl0ZTtcclxuICBib3JkZXI6IG5vbmU7XHJcbiAgYm9yZGVyLXJhZGl1czogMC43NXJlbTtcclxuICBwYWRkaW5nOiAxcmVtO1xyXG4gIHBhZGRpbmctYmxvY2s6IDA7XHJcbiAgZm9udC1zaXplOiAxcmVtO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIG1hcmdpbi1ib3R0b206IDAuNzVyZW07XHJcbiAgbWFyZ2luLXRvcDogMXJlbTtcclxuICBoZWlnaHQ6IDIuNXJlbTtcclxuICBib3gtc2hhZG93OiBoc2xhKDAsIDAlLCAxMDAlLCAwLjE1KSAwIDJweCAwIGluc2V0LFxyXG4gICAgcmdiYSgwLCAwLCAwLCAwLjA1KSAwIC0ycHggNHB4IGluc2V0LCByZ2JhKDQ2LCA1NCwgODAsIDAuMDc1KSAwIDFweCAxcHg7XHJcbn1cclxuXHJcbi5saW5raW5nLWJ1dHRvbjpob3ZlciB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2NjNGUwMjtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbn1cclxuXHJcbi5saW5raW5nLWJ1dHRvbjpkaXNhYmxlZCB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2NjYztcclxuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xyXG59XHJcblxyXG4uc29jaWFscy13cmFwcGVyIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgZ2FwOiAxcmVtO1xyXG4gIG1hcmdpbi1ibG9jazogMC41cmVtO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG59XHJcblxyXG4uc29jaWFscy1jb250YWluZXIge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICBnYXA6IDAuNXJlbTtcclxuICB3aWR0aDogMTAwJTtcclxufVxyXG5cclxuLnNvY2lhbHMtY29udGFpbmVyIC5jb25uZWN0b3ItY29udGFpbmVyIHtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBnYXA6IDAuMjVyZW07XHJcbn1cclxuXHJcbi5zb2NpYWxzLWNvbnRhaW5lciAuY29ubmVjdG9yLWJ1dHRvbiB7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBnYXA6IDAuMjVyZW07XHJcbiAgcGFkZGluZzogMC43NXJlbTtcclxuICBib3JkZXItcmFkaXVzOiAwLjc1cmVtO1xyXG4gIGZvbnQtc2l6ZTogMC44NzVyZW07XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZlZmVmZTtcclxuICBjb2xvcjogIzMzMztcclxuICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIGhlaWdodDogMi41cmVtO1xyXG59XHJcblxyXG4uc29jaWFscy1jb250YWluZXIgLmNvbm5lY3Rvci1idXR0b246aG92ZXIge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNkZGQ7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcblxyXG4uc29jaWFscy1jb250YWluZXIgLmNvbm5lY3Rvci1idXR0b246ZGlzYWJsZWQge1xyXG4gIGN1cnNvcjogZGVmYXVsdDtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmVmZWZlO1xyXG59XHJcblxyXG4uc29jaWFscy1jb250YWluZXIgLmNvbm5lY3Rvci1idXR0b24gc3ZnIHtcclxuICB3aWR0aDogMS41cmVtO1xyXG4gIGhlaWdodDogMS41cmVtO1xyXG4gIGNvbG9yOiAjMzMzO1xyXG4gIG1hcmdpbi1yaWdodDogMC41cmVtO1xyXG59XHJcblxyXG4uc29jaWFscy1jb250YWluZXIgLmNvbm5lY3Rvci1jb25uZWN0ZWQge1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgZ2FwOiAwLjI1cmVtO1xyXG4gIHBhZGRpbmc6IDAuNzVyZW07XHJcbiAgcGFkZGluZy10b3A6IDAuNXJlbTtcclxuICBwYWRkaW5nLWJvdHRvbTogMC41cmVtO1xyXG4gIGZvbnQtc2l6ZTogMC44NzVyZW07XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2VlZTtcclxuICBib3JkZXItcmFkaXVzOiAwLjI1cmVtO1xyXG4gIGNvbG9yOiAjMzMzO1xyXG4gIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgZmxleDogMTtcclxufVxyXG5cclxuLnNvY2lhbHMtY29udGFpbmVyIC5jb25uZWN0b3ItY29ubmVjdGVkIHN2ZyB7XHJcbiAgd2lkdGg6IDEuNXJlbTtcclxuICBoZWlnaHQ6IDEuNXJlbTtcclxuICBjb2xvcjogIzMzMztcclxuICBtYXJnaW4tcmlnaHQ6IDAuNXJlbTtcclxufVxyXG5cclxuLnNvY2lhbHMtY29udGFpbmVyIGgzIHtcclxuICBjb2xvcjogIzMzMztcclxuICBtYXJnaW46IDA7XHJcbn1cclxuXHJcbi5jb25uZWN0b3ItYnV0dG9uIC5jb25uZWN0b3ItY2hlY2ttYXJrIHtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgdG9wOiAtMC41cmVtO1xyXG4gIHJpZ2h0OiAtMC41cmVtO1xyXG4gIHdpZHRoOiAxcmVtICFpbXBvcnRhbnQ7XHJcbiAgaGVpZ2h0OiAxcmVtICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi51bmxpbmstY29ubmVjdG9yLWJ1dHRvbiB7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHJpZ2h0OiAwLjM3NXJlbTtcclxuICBib3JkZXI6IG5vbmU7XHJcbiAgZm9udC1zaXplOiAwLjc1cmVtO1xyXG4gIHBhZGRpbmc6IDAuMjVyZW0gMC41cmVtO1xyXG4gIHBhZGRpbmctcmlnaHQ6IDAuNjc1cmVtO1xyXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogIzk5OTtcclxuICBjb2xvcjogd2hpdGU7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGdhcDogMC4yNXJlbTtcclxuICBib3gtc2hhZG93OiBoc2xhKDAsIDAlLCAxMDAlLCAwLjE1KSAwIDJweCAwIGluc2V0LFxyXG4gICAgcmdiYSgwLCAwLCAwLCAwLjA1KSAwIC0ycHggNHB4IGluc2V0LCByZ2JhKDQ2LCA1NCwgODAsIDAuMDc1KSAwIDFweCAxcHg7XHJcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjE1cztcclxufVxyXG5cclxuLnVubGluay1jb25uZWN0b3ItYnV0dG9uIHN2ZyB7XHJcbiAgc3Ryb2tlOiB3aGl0ZSAhaW1wb3J0YW50O1xyXG4gIHdpZHRoOiAwLjg3NXJlbSAhaW1wb3J0YW50O1xyXG4gIGhlaWdodDogMC44NzVyZW0gIWltcG9ydGFudDtcclxuICBtYXJnaW4tcmlnaHQ6IDAgIWltcG9ydGFudDtcclxufVxyXG5cclxuLnVubGluay1jb25uZWN0b3ItYnV0dG9uOmhvdmVyIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjODg4O1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5cclxuLnVubGluay1jb25uZWN0b3ItYnV0dG9uOmRpc2FibGVkIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xyXG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgbG9hZGVyIHtcclxuICAwJSB7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCUpO1xyXG4gIH1cclxuICA1MCUge1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDEwMCUpO1xyXG4gIH1cclxuICAxMDAlIHtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwJSk7XHJcbiAgfVxyXG59XHJcblxyXG4ubG9hZGVyIHtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgd2lkdGg6IDRyZW07XHJcbiAgaGVpZ2h0OiAwLjRyZW07XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2RkZDtcclxuICBtYXJnaW4tdG9wOiAwLjVyZW07XHJcbiAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xyXG4gIGJvcmRlci1yYWRpdXM6IDAuMTI1cmVtO1xyXG59XHJcblxyXG4ubG9hZGVyOjpiZWZvcmUge1xyXG4gIGNvbnRlbnQ6IFwiXCI7XHJcbiAgZGlzcGxheTogYmxvY2s7XHJcbiAgd2lkdGg6IDJyZW07XHJcbiAgaGVpZ2h0OiAwLjRyZW07XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmNmYwMDtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgbGVmdDogMDtcclxuICBhbmltYXRpb246IGxvYWRlciAxLjVzIGVhc2UtaW4tb3V0IGluZmluaXRlO1xyXG4gIGJvcmRlci1yYWRpdXM6IDAuMTI1cmVtO1xyXG59XHJcblxyXG4ubm8tc29jaWFscyB7XHJcbiAgY29sb3I6ICM3Nzc7XHJcbiAgZm9udC1zaXplOiAwLjg3NXJlbTtcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgbWFyZ2luLXRvcDogMC41cmVtO1xyXG59XHJcblxyXG4uZGl2aWRlciB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGdhcDogMC41cmVtO1xyXG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcclxuICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XHJcbn1cclxuXHJcbi5kaXZpZGVyOjpiZWZvcmUsXHJcbi5kaXZpZGVyOjphZnRlciB7XHJcbiAgY29udGVudDogXCJcIjtcclxuICBmbGV4OiAxO1xyXG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZGRkO1xyXG59XHJcblxyXG5pbnB1dC50aWt0b2staW5wdXQge1xyXG4gIGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XHJcbiAgYm9yZGVyLXJhZGl1czogMC43NXJlbTtcclxuICBjb2xvcjogYmxhY2s7XHJcbiAgZm9udC1mYW1pbHk6IFNhdG9zaGksIHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBTZWdvZSBVSSxcclxuICAgIFJvYm90bywgT3h5Z2VuLCBVYnVudHUsIENhbnRhcmVsbCwgT3BlbiBTYW5zLCBIZWx2ZXRpY2EgTmV1ZSwgc2Fucy1zZXJpZjtcclxuICBmb250LXNpemU6IDFyZW07XHJcbiAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICBoZWlnaHQ6IDIuNzVyZW07XHJcbiAgbGluZS1oZWlnaHQ6IDEuMzMzcmVtO1xyXG4gIHBhZGRpbmctaW5saW5lOiAxcmVtO1xyXG4gIG1hcmdpbi10b3A6IDFyZW07XHJcbiAgd2lkdGg6IDEwMCU7XHJcbn1cclxuXHJcbmlucHV0LnRpa3Rvay1pbnB1dC5pbnZhbGlkIHtcclxuICBib3JkZXItY29sb3I6ICNkYzM1NDU7XHJcbiAgb3V0bGluZS1jb2xvcjogI2RjMzU0NTtcclxufVxyXG5cclxuLm90cC1pbnB1dC1jb250YWluZXIge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgZ2FwOiAwLjVyZW07XHJcbiAgbWFyZ2luLXRvcDogMXJlbTtcclxufVxyXG5cclxuLm90cC1pbnB1dCB7XHJcbiAgd2lkdGg6IDJyZW07XHJcbiAgaGVpZ2h0OiAyLjVyZW07XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xyXG4gIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XHJcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xyXG4gIG91dGxpbmU6IG5vbmU7XHJcbiAgdHJhbnNpdGlvbjogYm9yZGVyLWNvbG9yIDAuMnM7XHJcbn1cclxuXHJcbi5vdHAtaW5wdXQ6Zm9jdXMge1xyXG4gIGJvcmRlci1jb2xvcjogI2ZmNmYwMDtcclxufVxyXG5cclxuLnRhYnMge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xyXG4gIG1hcmdpbi1ib3R0b206IGNhbGMoLTAuNXJlbSAtIDFweCk7XHJcbiAgbWF4LXdpZHRoOiAxMDAlO1xyXG4gIG92ZXJmbG93LXg6IGF1dG87XHJcbn1cclxuLnRhYnM6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcclxuICBkaXNwbGF5OiBub25lO1xyXG59XHJcbi50YWJzOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2NjYztcclxuICBib3JkZXItcmFkaXVzOiAwLjI1cmVtO1xyXG59XHJcblxyXG4udGFiLWJ1dHRvbiB7XHJcbiAgYm9yZGVyLXJhZGl1czogMDtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmVmZWZlO1xyXG4gIGJvcmRlcjogMnB4IHRyYW5zcGFyZW50O1xyXG4gIGJvcmRlci1yaWdodDogMnB4IHNvbGlkICNkZGQ7XHJcbiAgcGFkZGluZzogMC43NXJlbSAxcmVtO1xyXG4gIGZvbnQtc2l6ZTogMC44NzVyZW07XHJcbiAgZm9udC13ZWlnaHQ6IDQwMDtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzO1xyXG4gIHRleHQtYWxpZ246IGxlZnQ7XHJcbiAgY29sb3I6ICMzMzM7XHJcbn1cclxuXHJcbi50YWItYnV0dG9uOmhvdmVyIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZWVlO1xyXG4gIGJvcmRlci1jb2xvcjogI2RkZDtcclxufVxyXG5cclxuLnRhYi1idXR0b246Zm9jdXMge1xyXG4gIG91dGxpbmU6IG5vbmU7XHJcbiAgYm9yZGVyLWNvbG9yOiAjZmY2ZjAwO1xyXG59XHJcblxyXG4uYWN0aXZlLXRhYiB7XHJcbiAgYm9yZGVyLXJpZ2h0LWNvbG9yOiAjZmY2ZjAwO1xyXG59XHJcblxyXG4udGFiLWNvbnRlbnQge1xyXG4gIG1hcmdpbi10b3A6IDAuMjVyZW07XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgbWluLWhlaWdodDogMjByZW07XHJcbiAgaGVpZ2h0OiAyMHJlbTtcclxufVxyXG5cclxuLnZlcnRpY2FsLXRhYnMtY29udGFpbmVyIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgZ2FwOiAwLjVyZW07XHJcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICB3aWR0aDogMTAwJTtcclxufVxyXG5cclxuLnZlcnRpY2FsLXRhYnMge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICBnYXA6IDAuMjVyZW07XHJcbiAgbWluLXdpZHRoOiBmaXQtY29udGVudCAhaW1wb3J0YW50O1xyXG4gIG1hcmdpbi1sZWZ0OiAtMXJlbTtcclxuICBoZWlnaHQ6IDEwMCU7XHJcbiAgb3ZlcmZsb3cteTogYXV0bztcclxufVxyXG5cclxuLnZlcnRpY2FsLXRhYi1jb250ZW50IHtcclxuICBmbGV4OiAxIDEgMCU7XHJcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcclxuICBtaW4taGVpZ2h0OiAyMnJlbTtcclxuICBoZWlnaHQ6IDIycmVtO1xyXG4gIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XHJcbiAgYm9yZGVyLXJhZGl1czogMC4yNXJlbTtcclxuICBwYWRkaW5nOiAxcmVtO1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmOWY5Zjk7XHJcbiAgbWF4LXdpZHRoOiAxMDAlO1xyXG59XHJcblxyXG4uaXAtdGFiLWNvbnRhaW5lciB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGdhcDogMXJlbTtcclxuICB3aWR0aDogMTAwJTtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBoZWlnaHQ6IDEwMCU7XHJcbn1cclxuXHJcbi5pcC10YWItY29udGVudCB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGdhcDogMXJlbTtcclxuICB3aWR0aDogMTAwJTtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGhlaWdodDogMTAwJTtcclxufVxyXG5cclxuLmlwLXRhYi1jb250ZW50LXRleHQge1xyXG4gIGNvbG9yOiAjNzc3O1xyXG4gIGZvbnQtc2l6ZTogMC44NzVyZW07XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcclxufVxyXG5cclxuLmNvbnRyYWN0LWJ1dHRvbi1jb250YWluZXIge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGdhcDogMXJlbTtcclxuICBtYXJnaW4tdG9wOiAxcmVtO1xyXG59XHJcblxyXG4uY29udHJhY3QtaW5wdXQge1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIG1heC13aWR0aDogMzAwcHg7XHJcbiAgcGFkZGluZzogMC41cmVtO1xyXG4gIGZvbnQtc2l6ZTogMXJlbTtcclxuICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xyXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcclxuICBvdXRsaW5lOiBub25lO1xyXG4gIHRyYW5zaXRpb246IGJvcmRlci1jb2xvciAwLjJzO1xyXG4gIGNvbG9yOiAjMzMzO1xyXG59XHJcblxyXG4uY29udHJhY3QtaW5wdXQ6Zm9jdXMge1xyXG4gIGJvcmRlci1jb2xvcjogI2ZmNmYwMDtcclxufVxyXG5cclxuLmNvbnRyYWN0LWJ1dHRvbiB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmNmYwMDtcclxuICBjb2xvcjogd2hpdGU7XHJcbiAgYm9yZGVyOiBub25lO1xyXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcclxuICBwYWRkaW5nOiAwLjc1cmVtIDEuNXJlbTtcclxuICBmb250LXNpemU6IDFyZW07XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycztcclxufVxyXG5cclxuLmNvbnRyYWN0LWJ1dHRvbjpob3ZlciB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2NjNGUwMjtcclxufVxyXG5cclxuLmNvbnRyYWN0LWJ1dHRvbjpkaXNhYmxlZCB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2NjYztcclxuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xyXG59XHJcblxyXG4ubm8tcHJvdmlkZXItd2FybmluZyB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjNjZDtcclxuICBjb2xvcjogIzg1NjQwNDtcclxuICBib3JkZXI6IDFweCBzb2xpZCAjZmZlZWJhO1xyXG4gIGJvcmRlci1yYWRpdXM6IDAuNzVyZW07XHJcbiAgcGFkZGluZzogMC41cmVtO1xyXG4gIGZvbnQtc2l6ZTogMXJlbTtcclxuICB3aWR0aDogMTAwJTtcclxuICBtYXJnaW4tdG9wOiAxcmVtO1xyXG4gIG1pbi1oZWlnaHQ6IDMuMjVyZW07XHJcbiAgYm94LXNoYWRvdzogMCAycHggNHB4IHJnYmEoMjU1LCAyMjMsIDAsIDAuMDUpO1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMnMsIGNvbG9yIDAuMnMsIGJvcmRlci1jb2xvciAwLjJzO1xyXG4gIHdoaXRlLXNwYWNlOiBub3JtYWw7XHJcbiAgbGluZS1oZWlnaHQ6IDEuNDtcclxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG59XHJcblxyXG4ubm8tcHJvdmlkZXItd2FybmluZzpob3ZlciB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZThhMTtcclxuICBjb2xvcjogIzdhNWMwMDtcclxuICBib3JkZXItY29sb3I6ICNmZmQ5NjY7XHJcbn1cclxuXHJcbi5uby1wcm92aWRlci13YXJuaW5nOmFjdGl2ZSB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZThhMTtcclxuICBjb2xvcjogIzVjNDMwMDtcclxuICBib3JkZXItY29sb3I6ICNmZmQ5NjY7XHJcbn1cclxuXHJcbi5uby1wcm92aWRlci13YXJuaW5nOmZvY3VzIHtcclxuICBvdXRsaW5lOiAycHggc29saWQgI2ZmNmYwMDtcclxuICBvdXRsaW5lLW9mZnNldDogMnB4O1xyXG59XHJcblxyXG4udGFiLXByb3ZpZGVyLXJlcXVpcmVkLW92ZXJsYXkge1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICB0b3A6IDA7XHJcbiAgbGVmdDogMDtcclxuICB3aWR0aDogMTAwJTtcclxuICBoZWlnaHQ6IDEwMCU7XHJcbiAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjcpO1xyXG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cig0cHgpO1xyXG4gIHotaW5kZXg6IDEwO1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICBmb250LXdlaWdodDogNjAwO1xyXG4gIGZvbnQtc2l6ZTogMS4xcmVtO1xyXG4gIGNvbG9yOiAjMzMzO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICBib3JkZXItcmFkaXVzOiBpbmhlcml0O1xyXG59XHJcbiJdfQ== */";
var styles = {"modal":"auth-module_modal__yyg5L","outer-container":"auth-module_outer-container__RraOQ","container":"auth-module_container__7utns","linking-container":"auth-module_linking-container__mYNwD","origin-tab":"auth-module_origin-tab__miOUK","origin-section":"auth-module_origin-section__UBhBB","origin-container":"auth-module_origin-container__ZIk4c","origin-wrapper":"auth-module_origin-wrapper__JQfEI","origin-label":"auth-module_origin-label__l-1q9","horizontal-divider":"auth-module_horizontal-divider__YfWCy","divider":"auth-module_divider__z65Me","origin-dashboard-button":"auth-module_origin-dashboard-button__-pch4","header":"auth-module_header__pX9nM","auth-header":"auth-module_auth-header__LsM1f","small-modal-icon":"auth-module_small-modal-icon__YayD1","wallet-address":"auth-module_wallet-address__AVVA5","close-button":"auth-module_close-button__uZrho","close-icon":"auth-module_close-icon__SSCni","linking-text":"auth-module_linking-text__uz3ud","provider-list":"auth-module_provider-list__6vISy","big":"auth-module_big__jQxvN","spinner":"auth-module_spinner__hfzlH","spin":"auth-module_spin__tm9l6","modal-icon":"auth-module_modal-icon__CV7ah","footer-text":"auth-module_footer-text__CQnh6","disconnect-button":"auth-module_disconnect-button__bsu-3","linking-button":"auth-module_linking-button__g1GlL","socials-wrapper":"auth-module_socials-wrapper__PshV3","socials-container":"auth-module_socials-container__iDzfJ","connector-container":"auth-module_connector-container__4wn11","connector-button":"auth-module_connector-button__j79HA","connector-connected":"auth-module_connector-connected__JvDQb","connector-checkmark":"auth-module_connector-checkmark__ZS6zU","unlink-connector-button":"auth-module_unlink-connector-button__6Fwkp","loader":"auth-module_loader__gH3ZC","no-socials":"auth-module_no-socials__wEx0t","tiktok-input":"auth-module_tiktok-input__FeqdG","invalid":"auth-module_invalid__qqgK6","otp-input-container":"auth-module_otp-input-container__B2NH6","otp-input":"auth-module_otp-input__vjImt","tabs":"auth-module_tabs__RcUmV","tab-button":"auth-module_tab-button__HT6wc","active-tab":"auth-module_active-tab__l6P44","tab-content":"auth-module_tab-content__noHF0","vertical-tabs-container":"auth-module_vertical-tabs-container__6sAOL","vertical-tabs":"auth-module_vertical-tabs__-ba-W","vertical-tab-content":"auth-module_vertical-tab-content__wTqKF","ip-tab-container":"auth-module_ip-tab-container__ck0F8","ip-tab-content":"auth-module_ip-tab-content__VI4zC","ip-tab-content-text":"auth-module_ip-tab-content-text__y2BRh","contract-button-container":"auth-module_contract-button-container__7HH9n","contract-input":"auth-module_contract-input__4BYcs","contract-button":"auth-module_contract-button__Cq6zI","no-provider-warning":"auth-module_no-provider-warning__YzGd-","tab-provider-required-overlay":"auth-module_tab-provider-required-overlay__dvmIR"};
styleInject(css_248z$1);

const getIconBySocial = (social) => {
    switch (social) {
        case "twitter":
            return TwitterIcon;
        case "spotify":
            return SpotifyIcon;
        case "discord":
            return DiscordIcon;
        case "tiktok":
            return TikTokIcon;
        case "telegram":
            return TelegramIcon;
        default:
            return () => React.createElement(React.Fragment, null);
    }
};
const CheckMarkIcon = ({ w, h }) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", width: w || "1rem", height: h || "1rem" },
    React.createElement("path", { d: "M20 6L9 17l-5-5" })));
const XMarkIcon = ({ w, h }) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", width: w || "1rem", height: h || "1rem" },
    React.createElement("path", { d: "M18 6L6 18" }),
    React.createElement("path", { d: "M6 6l12 12" })));
const LinkIcon = ({ w, h }) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", width: w || "1rem", height: h || "1rem" },
    React.createElement("path", { d: "M14 4h-13v18h20v-11h1v12h-22v-20h14v1zm10 5h-1v-6.293l-11.646 11.647-.708-.708 11.647-11.646h-6.293v-1h8v8z" })));
const BinIcon = ({ w, h }) => (React.createElement("svg", { clipRule: "evenodd", fillRule: "evenodd", strokeLinejoin: "round", strokeMiterlimit: "2", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", fill: "currentColor", width: w || "1rem", height: h || "1rem" },
    React.createElement("path", { d: "m4.015 5.494h-.253c-.413 0-.747-.335-.747-.747s.334-.747.747-.747h5.253v-1c0-.535.474-1 1-1h4c.526 0 1 .465 1 1v1h5.254c.412 0 .746.335.746.747s-.334.747-.746.747h-.254v15.435c0 .591-.448 1.071-1 1.071-2.873 0-11.127 0-14 0-.552 0-1-.48-1-1.071zm14.5 0h-13v15.006h13zm-4.25 2.506c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75s.75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75zm-4.5 0c-.414 0-.75.336-.75.75v8.5c0 .414.336.75.75.75s.75-.336.75-.75v-8.5c0-.414-.336-.75-.75-.75zm3.75-4v-.5h-3v.5z", fillRule: "nonzero" })));
const CampIcon = ({ customStyles }) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 571.95 611.12", height: "1rem", width: "1rem", fill: "currentColor", style: customStyles },
    React.createElement("path", { d: "m563.25 431.49-66.17-51.46c-11.11-8.64-27.28-5.06-33.82 7.4-16.24 30.9-41.69 56.36-70.85 73.73l-69.35-69.35c-3.73-3.73-8.79-5.83-14.07-5.83s-10.34 2.1-14.07 5.83l-73.78 73.78c-57.37-30.39-96.55-90.71-96.55-160.03 0-99.79 81.19-180.98 180.98-180.98 60.35 0 118.17 26.28 156.39 89.44 6.85 11.32 21.92 14.33 32.59 6.51l64.21-47.06c9.53-6.98 12.06-20.15 5.78-30.16C508.83 54.41 411.43 0 305.56 0 137.07 0 0 137.07 0 305.56s137.07 305.56 305.56 305.56c57.6 0 113.72-16.13 162.31-46.63A306.573 306.573 0 0 0 568.8 460.8c5.78-9.78 3.42-22.34-5.55-29.31Zm-301.42 49.69 47.15-47.15 44.69 44.69c-15.92 5.1-32.2 7.83-48.1 7.83-15.08 0-29.72-1.87-43.74-5.36Zm42.36-222.47c-.07 1.49-.08 21.29 49.54 55.11 37.02 25.24 19.68 75.52 12.1 92.05a147.07 147.07 0 0 0-20.12-38.91c-12.73-17.59-26.87-28.9-36.74-35.59-10.38 6.36-27.41 18.74-41.07 40.02-8.27 12.89-12.82 25.16-15.42 34.48l-.03-.05c-15.1-40.6-9.75-60.88-1.95-71.9 6.12-8.65 17.24-20.6 17.24-20.6 9.71-9.66 19.96-19.06 29.82-38.17 6.06-11.75 6.59-15.84 6.63-16.45Z", fill: "#000", strokeWidth: "0" }),
    React.createElement("path", { d: "M267.74 313.33s-11.11 11.95-17.24 20.6c-7.8 11.02-13.14 31.3 1.95 71.9-86.02-75.3 2.56-152.15.79-146.3-6.58 21.75 14.49 53.8 14.49 53.8Zm20.98-23.66c3.01-4.27 5.97-9.06 8.8-14.55 6.62-12.83 6.64-16.54 6.64-16.54s-2.09 20.02 49.53 55.21c37.02 25.24 19.68 75.52 12.1 92.05 0 0 43.69-27.86 37.49-74.92-7.45-56.61-38.08-51.5-60.84-93.43-21.23-39.11 15.03-70.44 15.03-70.44s-48.54-2.61-70.76 48.42c-23.42 53.77 2 74.21 2 74.21Z", fill: "#ff6d01", strokeWidth: "0" })));
const DiscordIcon = () => (React.createElement("svg", { viewBox: "0 0 42 32", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M41.1302 23.4469V24.2363C41.0328 24.2948 41.0717 24.3923 41.062 24.4702C41.0328 24.8991 40.9938 25.3279 40.9645 25.7568C40.9548 25.9322 40.8866 26.0589 40.7306 26.1661C37.7092 28.3396 34.4247 30.0062 30.8672 31.1173C30.6528 31.1856 30.5358 31.1563 30.3994 30.9711C29.6879 29.977 29.0446 28.9439 28.4696 27.862C28.3624 27.6573 28.4111 27.5989 28.6061 27.5209C29.532 27.17 30.4286 26.7509 31.2961 26.2733C31.8419 25.981 31.8224 25.9907 31.3546 25.5911C31.1109 25.3767 30.9062 25.3474 30.5943 25.4936C27.7971 26.7509 24.8634 27.4624 21.7933 27.5989C18.0507 27.7645 14.4542 27.092 11.0235 25.6008C10.5069 25.3767 10.1463 25.3669 9.75645 25.7763C9.59076 25.9517 9.54202 25.9907 9.77594 26.1271C10.7213 26.6534 11.6862 27.131 12.6999 27.5014C12.963 27.5989 12.963 27.6963 12.8461 27.9205C12.2905 28.9634 11.6667 29.9575 10.9942 30.9224C10.8383 31.1466 10.6921 31.1953 10.429 31.1173C6.91049 29.9965 3.65518 28.3591 0.663021 26.2051C0.497331 26.0784 0.419365 25.9615 0.409619 25.747C0.409619 25.4156 0.360879 25.094 0.341386 24.7626C0.156204 21.9752 0.292661 19.2072 0.789729 16.4489C1.66691 11.5952 3.61619 7.18007 6.33545 3.08656C6.43291 2.94037 6.54012 2.8429 6.69607 2.76493C9.25938 1.61485 11.9202 0.805904 14.6784 0.308836C14.8538 0.279597 14.961 0.308829 15.0488 0.484265C15.3217 1.04956 15.6141 1.6051 15.887 2.17039C15.9844 2.37507 16.0624 2.4628 16.3158 2.42381C19.2397 2.01446 22.1734 2.02421 25.0973 2.42381C25.2923 2.45305 25.3702 2.39457 25.4385 2.22889C25.7114 1.65385 26.0038 1.08854 26.2767 0.513503C26.3644 0.32832 26.4813 0.26985 26.686 0.308836C29.4248 0.805904 32.066 1.61486 34.6099 2.74545C34.7853 2.82342 34.912 2.94037 35.0192 3.10606C38.4305 8.18395 40.5454 13.7297 40.9938 19.8699C41.0133 20.1623 40.9548 20.4742 41.101 20.7666V21.4976C41.0035 21.634 41.0328 21.7997 41.0425 21.9459C41.0718 22.4527 40.9645 22.9693 41.101 23.4761L41.1302 23.4469ZM23.8108 17.063C23.8108 18.0961 24.035 18.9148 24.5223 19.6458C25.8868 21.7218 28.5963 21.9069 30.1655 20.0259C31.53 18.3885 31.4618 15.8349 29.9998 14.2755C28.7815 12.9792 26.8225 12.8038 25.419 13.8856C24.3371 14.7238 23.8595 15.8739 23.8206 17.063H23.8108ZM17.5731 17.3748C17.5731 16.6244 17.4756 16.0103 17.2027 15.4353C16.5595 14.1 15.5361 13.2424 14.0059 13.1936C12.4952 13.1449 11.4328 13.9246 10.7408 15.2111C9.88315 16.829 10.1366 18.7881 11.3549 20.1623C12.5829 21.5463 14.6102 21.7315 16.0526 20.5619C17.0955 19.714 17.5438 18.5737 17.5828 17.3748H17.5731Z", fill: "#5865F2" })));
const TwitterIcon = () => (React.createElement("svg", { viewBox: "0 0 33 27", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M32.3127 3.1985C31.3088 3.64684 30.2075 3.92949 29.1257 4.10493C29.6422 4.01721 30.3927 3.09129 30.6948 2.71118C31.1529 2.13614 31.5428 1.48313 31.7572 0.781387C31.7864 0.722908 31.8059 0.654685 31.7572 0.615699C31.689 0.58646 31.6402 0.605947 31.5915 0.62544C30.3829 1.26871 29.1354 1.73654 27.8099 2.07766C27.7027 2.1069 27.615 2.07766 27.5467 2.00943C27.4395 1.88273 27.3323 1.76578 27.2153 1.66832C26.6598 1.19074 26.0555 0.820367 25.383 0.547467C24.4961 0.186849 23.5312 0.0309141 22.576 0.0991391C21.6501 0.157618 20.734 0.420776 19.9055 0.849619C19.0771 1.27846 18.3461 1.88273 17.7516 2.60397C17.1473 3.35444 16.6989 4.24137 16.465 5.17702C16.2409 6.08344 16.2603 6.98012 16.3968 7.89629C16.4163 8.05223 16.3968 8.07173 16.2701 8.05224C11.0752 7.28227 6.76732 5.42069 3.26834 1.4344C3.1124 1.25896 3.03443 1.25897 2.90773 1.44415C1.37754 3.73457 2.11826 7.41871 4.02857 9.23155C4.28197 9.47521 4.54513 9.71887 4.82777 9.93329C4.72056 9.95278 3.45353 9.81633 2.32294 9.23155C2.167 9.13408 2.09877 9.19257 2.07928 9.35826C2.06953 9.60192 2.07928 9.83583 2.11827 10.099C2.41066 12.4284 4.01882 14.5726 6.23126 15.4108C6.49442 15.518 6.78681 15.6155 7.06946 15.6642C6.56264 15.7714 6.04608 15.8494 4.61335 15.7422C4.43792 15.7032 4.36969 15.8006 4.43792 15.9663C5.51977 18.9195 7.85892 19.7967 9.60353 20.2938C9.83744 20.3327 10.0714 20.3327 10.3053 20.3912C10.2955 20.4107 10.276 20.4107 10.2663 20.4302C9.6815 21.3171 7.67374 21.9701 6.73808 22.3015C5.03245 22.8961 3.18063 23.169 1.37754 22.9838C1.08514 22.9448 1.02666 22.9448 0.948692 22.9838C0.870721 23.0325 0.938946 23.1007 1.02666 23.1787C1.39703 23.4224 1.76739 23.6368 2.1475 23.8415C3.28784 24.4457 4.48665 24.9331 5.73419 25.2742C12.1766 27.0578 19.4279 25.742 24.2622 20.937C28.0633 17.1652 29.3888 11.9605 29.3888 6.7462C29.3888 6.54153 29.6325 6.43433 29.7689 6.31737C30.7533 5.57664 31.5525 4.68971 32.2932 3.69558C32.4589 3.47141 32.4589 3.27648 32.4589 3.18876V3.15952C32.4589 3.0718 32.4589 3.10104 32.3322 3.15952L32.3127 3.1985Z", fill: "#1F9CEA" })));
const SpotifyIcon = () => (React.createElement("svg", { role: "img", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", fill: "#1DB954" },
    React.createElement("path", { d: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" })));
const TikTokIcon = () => (React.createElement("svg", { role: "img", viewBox: "-2 -2 28 28", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("title", null, "TikTok"),
    React.createElement("path", { d: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" })));
const TelegramIcon = () => (React.createElement("svg", { role: "img", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", fill: "#0088cc" },
    React.createElement("title", null, "Telegram"),
    React.createElement("path", { d: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" })));
const CloseIcon = () => (React.createElement("svg", { className: styles["close-icon"], viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M18 6L6 18", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
    React.createElement("path", { d: "M6 6L18 18", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })));

/**
 * Creates a wrapper element and appends it to the body.
 * @param { string } wrapperId The wrapper ID.
 * @returns { HTMLElement } The wrapper element.
 */
const createWrapperAndAppendToBody = (wrapperId) => {
    if (typeof document === "undefined")
        return null;
    const wrapperElement = document.createElement("div");
    wrapperElement.setAttribute("id", wrapperId);
    document.body.appendChild(wrapperElement);
    return wrapperElement;
};
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;
/**
 * The ReactPortal component. Renders children in a portal.
 * @param { { children: JSX.Element, wrapperId: string } } props The props.
 * @returns { JSX.Element } The ReactPortal component.
 */
const ReactPortal = ({ children, wrapperId = "react-portal-wrapper", }) => {
    const [wrapperElement, setWrapperElement] = useState(null);
    useIsomorphicLayoutEffect(() => {
        if (typeof document === "undefined")
            return;
        let element = document.getElementById(wrapperId);
        let systemCreated = false;
        if (!element) {
            systemCreated = true;
            element = createWrapperAndAppendToBody(wrapperId);
        }
        setWrapperElement(element);
        return () => {
            if (systemCreated && (element === null || element === void 0 ? void 0 : element.parentNode)) {
                element.parentNode.removeChild(element);
            }
        };
    }, [wrapperId]);
    if (wrapperElement === null)
        return null;
    return createPortal(children, wrapperElement);
};
/**
 * The ClientOnly component. Renders children only on the client. Needed for Next.js.
 * @param { { children: JSX.Element } } props The props.
 * @returns { JSX.Element } The ClientOnly component.
 */
const ClientOnly = (_a) => {
    var { children } = _a, delegated = __rest(_a, ["children"]);
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);
    if (!hasMounted) {
        return null;
    }
    return React.createElement("div", Object.assign({}, delegated), children);
};
/**
 * Returns the icon URL based on the connector name.
 * @param {string} name - The connector name.
 * @returns {string} The icon URL.
 */
const getIconByConnectorName = (name) => {
    switch (name) {
        case "AppKit Auth":
            return "data:image/svg+xml,%3Csvg width='56' height='56' viewBox='0 0 56 56' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='56' height='56' rx='16.3333' fill='%23FF573B'/%3E%3Cpath d='M11.6667 33.8333H44.3334V38.5C44.3334 39.7886 43.2501 40.8333 41.9137 40.8333H14.0865C12.7501 40.8333 11.6667 39.7886 11.6667 38.5V33.8333Z' fill='%23202020'/%3E%3Cpath d='M11.6667 24.5H44.3334V31.5H11.6667V24.5Z' fill='%23202020'/%3E%3Cpath d='M11.6667 17.5C11.6667 16.2113 12.7501 15.1666 14.0865 15.1666H41.9137C43.2501 15.1666 44.3334 16.2113 44.3334 17.5V22.1666H11.6667V17.5Z' fill='%23202020'/%3E%3C/svg%3E";
        case "Privy Wallet":
            return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='-25 -25 410 514' fill='none' id='svg-669804622_503'%3E%3Cpath d='M180 359.794C279.396 359.794 360 279.236 360 179.897C360 80.5579 279.396 0 180 0C80.604 0 0 80.5579 0 179.897C0 279.236 80.604 359.794 180 359.794Z' fill='%23010110'/%3E%3Cpath d='M180 463.997C247.932 463.997 303.012 452.411 303.012 438.2C303.012 423.988 247.968 412.402 180 412.402C112.032 412.402 56.9883 423.988 56.9883 438.2C56.9883 452.411 112.032 463.997 180 463.997Z' fill='%23010110'/%3E%3C/svg%3E";
        default:
            if (name.toLowerCase().includes("privy")) {
                return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='-25 -25 410 514' fill='none' id='svg-669804622_503'%3E%3Cpath d='M180 359.794C279.396 359.794 360 279.236 360 179.897C360 80.5579 279.396 0 180 0C80.604 0 0 80.5579 0 179.897C0 279.236 80.604 359.794 180 359.794Z' fill='%23010110'/%3E%3Cpath d='M180 463.997C247.932 463.997 303.012 452.411 303.012 438.2C303.012 423.988 247.968 412.402 180 412.402C112.032 412.402 56.9883 423.988 56.9883 438.2C56.9883 452.411 112.032 463.997 180 463.997Z' fill='%23010110'/%3E%3C/svg%3E";
            }
            else if (name.toLowerCase().includes("appkit")) {
                return "data:image/svg+xml,%3Csvg width='56' height='56' viewBox='0 0 56 56' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='56' height='56' rx='16.3333' fill='%23FF573B'/%3E%3Cpath d='M11.6667 33.8333H44.3334V38.5C44.3334 39.7886 43.2501 40.8333 41.9137 40.8333H14.0865C12.7501 40.8333 11.6667 39.7886 11.6667 38.5V33.8333Z' fill='%23202020'/%3E%3Cpath d='M11.6667 24.5H44.3334V31.5H11.6667V24.5Z' fill='%23202020'/%3E%3Cpath d='M11.6667 17.5C11.6667 16.2113 12.7501 15.1666 14.0865 15.1666H41.9137C43.2501 15.1666 44.3334 16.2113 44.3334 17.5V22.1666H11.6667V17.5Z' fill='%23202020'/%3E%3C/svg%3E";
            }
            else
                return "";
    }
};

const ToastContext = React.createContext(undefined);
const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});
    const remainingTimes = useRef({});
    const startTimes = useRef({});
    const isHovering = useRef(false);
    const addToast = (message, type = "info", duration = 3000) => {
        const id = Date.now();
        setToasts((prevToasts) => [
            ...prevToasts,
            { id, message, type, isVisible: true },
        ]);
        remainingTimes.current[id] = duration;
        startTimes.current[id] = Date.now();
        timers.current[id] = setTimeout(() => removeToast(id), duration);
    };
    const removeToast = (id) => {
        setToasts((prevToasts) => prevToasts.map((toast) => toast.id === id ? Object.assign(Object.assign({}, toast), { isVisible: false }) : toast));
        setTimeout(() => {
            setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
            delete timers.current[id];
            delete remainingTimes.current[id];
            delete startTimes.current[id];
        }, 300);
    };
    const handleMouseEnter = () => {
        isHovering.current = true;
        Object.keys(timers.current).forEach((id) => {
            clearTimeout(timers.current[Number(id)]);
            remainingTimes.current[Number(id)] -=
                Date.now() - startTimes.current[Number(id)];
        });
    };
    const handleMouseLeave = () => {
        isHovering.current = false;
        Object.keys(remainingTimes.current).forEach((id) => {
            if (remainingTimes.current[Number(id)] > 0) {
                startTimes.current[Number(id)] = Date.now();
                timers.current[Number(id)] = setTimeout(() => removeToast(Number(id)), remainingTimes.current[Number(id)]);
            }
        });
    };
    return (React.createElement(ToastContext.Provider, { value: { addToast } },
        children,
        React.createElement(ClientOnly, null,
            React.createElement(ReactPortal, { wrapperId: "toast-wrapper" },
                React.createElement("div", { className: styles$2["toast-container"], onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }, toasts.map((toast) => (React.createElement("div", { key: toast.id, className: `${styles$2.toast} ${styles$2[`toast-${toast.type}`]} ${toast.isVisible ? styles$2["toast-enter"] : styles$2["toast-exit"]}`, onClick: () => removeToast(toast.id) }, toast.message))))))));
};
const useToast = () => {
    const context = React.useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

const OriginContext = createContext({
    statsQuery: null,
    uploadsQuery: null,
});
const OriginProvider = ({ children }) => {
    const { authenticated } = useAuthState();
    const { auth } = useContext(CampContext);
    if (!auth && typeof window !== "undefined") {
        throw new Error("Auth instance is not available");
    }
    const statsQuery = useQuery({
        queryKey: ["origin-stats", authenticated],
        queryFn: () => { var _a, _b; return (_b = (_a = auth === null || auth === void 0 ? void 0 : auth.origin) === null || _a === void 0 ? void 0 : _a.getOriginUsage()) !== null && _b !== void 0 ? _b : Promise.resolve(null); },
    });
    const uploadsQuery = useQuery({
        queryKey: ["origin-uploads", authenticated],
        queryFn: () => { var _a, _b; return (_b = (_a = auth === null || auth === void 0 ? void 0 : auth.origin) === null || _a === void 0 ? void 0 : _a.getOriginUploads()) !== null && _b !== void 0 ? _b : Promise.resolve(null); },
    });
    return (React.createElement(OriginContext.Provider, { value: {
            statsQuery: statsQuery,
            uploadsQuery: uploadsQuery,
        } }, children));
};

const CampContext = createContext({
    clientId: null,
    auth: null,
    setAuth: () => { },
    wagmiAvailable: false,
    ackee: null,
    setAckee: () => { },
});
/**
 * CampProvider
 * @param {Object} props The props
 * @param {string} props.clientId The Camp client ID
 * @param {string} props.redirectUri The redirect URI to use after social oauths
 * @param {React.ReactNode} props.children The children components
 * @param {boolean} props.allowAnalytics Whether to allow analytics to be sent
 * @returns {JSX.Element} The CampProvider component
 */
const CampProvider = ({ clientId, redirectUri, children, allowAnalytics = true, }) => {
    const isServer = typeof window === "undefined";
    // const ackeeInstance =
    //   allowAnalytics && !isServer
    //     ? Ackee.create(constants.ACKEE_INSTANCE, {
    //         detailed: false,
    //         ignoreLocalhost: true,
    //         ignoreOwnVisits: false,
    //       })
    //     : null;
    // const [ackee, setAckee] = useState(ackeeInstance);
    const [auth, setAuth] = useState(!isServer ? new Auth({
        clientId,
        redirectUri: redirectUri
            ? redirectUri
            : !isServer
                ? window.location.href
                : "",
        // ackeeInstance,
    }) : null);
    // const wagmiContext = useContext(WagmiContext);
    const wagmiContext = typeof window !== "undefined" ? useContext(WagmiContext) : undefined;
    return (React.createElement(CampContext.Provider, { value: {
            clientId,
            auth,
            setAuth,
            wagmiAvailable: wagmiContext !== undefined,
            ackee: null,
            setAckee: () => { },
        } },
        React.createElement(SocialsProvider, null,
            React.createElement(OriginProvider, null,
                React.createElement(ToastProvider, null,
                    React.createElement(ModalProvider, null, children))))));
};

const getWalletConnectProvider = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const { EthereumProvider } = yield import('@walletconnect/ethereum-provider');
    const provider = yield EthereumProvider.init({
        optionalChains: [testnet.id],
        chains: [testnet.id],
        projectId,
        showQrModal: true,
        methods: ["personal_sign"],
    });
    return provider;
});
const useWalletConnectProvider = (projectId) => {
    const [walletConnectProvider, setWalletConnectProvider] = useState(null);
    useEffect(() => {
        const fetchWalletConnectProvider = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const provider = yield getWalletConnectProvider(projectId);
                setWalletConnectProvider(provider);
            }
            catch (error) {
                console.error("Error getting WalletConnect provider:", error);
            }
        });
        fetchWalletConnectProvider();
    }, [projectId]);
    return walletConnectProvider;
};

/**
 * Enum representing the status of data in the system.
 * * - ACTIVE: The data is currently active and available.
 * * - PENDING_DELETE: The data is scheduled for deletion but not yet removed.
 * * - DELETED: The data has been deleted and is no longer available.
 */
var DataStatus;
(function (DataStatus) {
    DataStatus[DataStatus["ACTIVE"] = 0] = "ACTIVE";
    DataStatus[DataStatus["PENDING_DELETE"] = 1] = "PENDING_DELETE";
    DataStatus[DataStatus["DELETED"] = 2] = "DELETED";
})(DataStatus || (DataStatus = {}));
/**
 * Creates license terms for a digital asset.
 * @param price The price of the asset in wei.
 * @param duration The duration of the license in seconds.
 * @param royaltyBps The royalty percentage in basis points (0-10000).
 * @param paymentToken The address of the payment token (ERC20 / address(0) for native currency).
 * @returns The created license terms.
 */
const createLicenseTerms = (price, duration, royaltyBps, paymentToken) => {
    return {
        price,
        duration,
        royaltyBps,
        paymentToken,
    };
};

var css_248z = ".buttons-module_connect-button__CJhUa{background-color:#ff6f00;border:none;border-radius:.75rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);color:#fff;font-family:Satoshi,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;font-size:1rem;font-weight:600;height:2.75rem;line-height:1.333rem;padding-inline:2.5rem;padding-left:5rem;position:relative;transition:background-color .15s;width:12rem}.buttons-module_connect-button__CJhUa .buttons-module_button-icon__JM4-2{background:hsla(0,0%,100%,.75);border-radius:.75rem 0 0 .75rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05);display:grid;height:100%;left:0;margin-right:.5rem;place-items:center;position:absolute;top:50%;transform:translateY(-50%);transition:background-color .15s;width:3rem}.buttons-module_connect-button__CJhUa .buttons-module_button-icon__JM4-2 svg{height:1.25rem;width:1.25rem}.buttons-module_connect-button__CJhUa:hover{background-color:#cc4e02;border-color:#cc4e02;cursor:pointer}.buttons-module_connect-button__CJhUa:hover .buttons-module_button-icon__JM4-2{background:hsla(0,0%,100%,.675)}.buttons-module_connect-button__CJhUa:focus{outline:none}.buttons-module_connect-button__CJhUa:disabled{background-color:#ccc;cursor:not-allowed}.buttons-module_provider-button__6JY7s{align-items:center;background-color:#fefefe;border:1px solid #ddd;border-radius:.5rem;display:flex;font-family:inherit;gap:.5rem;justify-content:flex-start;padding:.5rem;transition:background-color .15s;width:100%}.buttons-module_provider-button__6JY7s:focus{outline:1px solid #43b7c4}.buttons-module_provider-button__6JY7s:hover{border-color:#43b7c4}.buttons-module_provider-button__6JY7s:hover:not(:disabled){background-color:#ddd;cursor:pointer}.buttons-module_provider-button__6JY7s img{height:2rem;width:2rem}.buttons-module_provider-button__6JY7s .buttons-module_provider-icon__MOhr8{border-radius:.2rem}.buttons-module_provider-button__6JY7s span{line-height:1rem;margin-left:.5rem}.buttons-module_provider-button__6JY7s span.buttons-module_provider-name__tHWO2{color:#333;font-size:.875rem}.buttons-module_provider-button__6JY7s span.buttons-module_provider-label__CEGRr{color:#777;font-size:.7rem}.buttons-module_link-button-default__EcKUT{background-color:#ff6f00;border:none;border-radius:.75rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);box-sizing:border-box;cursor:pointer;height:2.6rem;position:relative;width:7rem}.buttons-module_link-button-default__EcKUT:disabled{background-color:#b8b8b8;cursor:not-allowed}.buttons-module_link-button-default__EcKUT:after{background-color:transparent;border-radius:.75rem;bottom:0;content:\"\";left:0;position:absolute;right:0;top:0;transition:background-color .15s}.buttons-module_link-button-default__EcKUT:disabled:after{background-color:rgba(0,0,0,.35);border-radius:.35rem;color:#fff;content:\"Not connected\";display:grid;font-size:.75rem;height:2rem;left:0;opacity:0;padding:.25rem;place-items:center;position:absolute;right:0;top:-2.7rem;transform:translateY(-.5rem);transition:all .25s;-webkit-user-select:none;-moz-user-select:none;user-select:none;visibility:hidden}.buttons-module_link-button-default__EcKUT:disabled:hover:after{opacity:1;transform:translateY(0);visibility:visible}.buttons-module_link-button-default__EcKUT:not(:disabled):hover:after{background-color:rgba(0,0,0,.1)}.buttons-module_link-button-default__EcKUT:not(:disabled).buttons-module_twitter__9sRaz{background-color:#1da1f2}.buttons-module_link-button-default__EcKUT:not(:disabled).buttons-module_spotify__-fiKQ{background-color:#1db954}.buttons-module_link-button-default__EcKUT:not(:disabled).buttons-module_discord__I-YjZ{background-color:#7289da}.buttons-module_link-button-default__EcKUT:not(:disabled).buttons-module_tiktok__a80-0{background-color:#000}.buttons-module_link-button-default__EcKUT:not(:disabled).buttons-module_telegram__ExOTS{background-color:#08c}.buttons-module_link-button-default__EcKUT .buttons-module_button-container__-oPqd{align-items:center;display:flex;flex-direction:row;gap:.5rem;justify-content:center;padding:.5rem}.buttons-module_button-container__-oPqd .buttons-module_social-icon__DPdPe{align-items:center;color:#fff;display:flex;height:1.5rem;justify-content:center;width:1.5rem}.buttons-module_button-container__-oPqd .buttons-module_social-icon__DPdPe svg{fill:#fff!important;height:1.5rem;width:1.5rem}.buttons-module_button-container__-oPqd .buttons-module_social-icon__DPdPe svg path{fill:#fff!important}.buttons-module_button-container__-oPqd .buttons-module_link-icon__8V8FP{align-items:center;color:hsla(0,0%,100%,.8);display:flex;height:1.25rem;justify-content:center;width:1.25rem}.buttons-module_button-container__-oPqd .buttons-module_camp-logo__slNl0{align-items:center;background-color:#fff;border-radius:50%;box-sizing:border-box;display:flex;height:1.5rem;justify-content:center;padding:.15rem;width:1.5rem}.buttons-module_link-button-default__EcKUT:disabled .buttons-module_button-container__-oPqd .buttons-module_camp-logo__slNl0 svg path{fill:#b8b8b8!important}.buttons-module_link-button-icon__llX8m{background-color:#ff6f00;border:none;border-radius:.75rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);box-sizing:border-box;cursor:pointer;height:3rem;min-height:3rem;min-width:3rem;padding:0;position:relative;width:3rem}.buttons-module_link-button-icon__llX8m:disabled{background-color:#b8b8b8;cursor:not-allowed}.buttons-module_link-button-icon__llX8m:disabled:after{background-color:rgba(0,0,0,.35);border-radius:.35rem;box-sizing:border-box;color:#fff;content:\"Not connected\";display:grid;font-size:.75rem;height:-moz-fit-content;height:fit-content;left:-1rem;opacity:0;padding:.25rem;place-items:center;position:absolute;right:-1rem;top:-2.7rem;transform:translateY(-.5rem);transition:all .25s}.buttons-module_link-button-icon__llX8m:disabled:hover:after{opacity:1;transform:translateY(0)}.buttons-module_link-button-icon__llX8m:after{background-color:transparent;border-radius:.75rem;bottom:0;content:\"\";left:0;position:absolute;right:0;top:0;transition:background-color .15s}.buttons-module_link-button-icon__llX8m:not(:disabled):hover:after{background-color:rgba(0,0,0,.1)}.buttons-module_link-button-icon__llX8m:not(:disabled).buttons-module_twitter__9sRaz{background-color:#1da1f2}.buttons-module_link-button-icon__llX8m:not(:disabled).buttons-module_spotify__-fiKQ{background-color:#1db954}.buttons-module_link-button-icon__llX8m:not(:disabled).buttons-module_discord__I-YjZ{background-color:#7289da}.buttons-module_link-button-icon__llX8m:not(:disabled).buttons-module_tiktok__a80-0{background-color:#000}.buttons-module_link-button-icon__llX8m:not(:disabled).buttons-module_telegram__ExOTS{background-color:#08c}.buttons-module_link-button-icon__llX8m .buttons-module_icon-container__Q5bI1{align-items:center;display:flex;flex:1;height:100%;justify-content:center;position:relative;width:100%}.buttons-module_link-button-icon__llX8m .buttons-module_icon-container__Q5bI1>svg{fill:#fff!important;height:1.5rem;width:1.5rem}.buttons-module_link-button-icon__llX8m .buttons-module_icon-container__Q5bI1>svg path{fill:#fff!important}.buttons-module_link-button-icon__llX8m .buttons-module_camp-logo__slNl0{align-items:center;background-color:#fff;border-radius:50%;bottom:-.5rem;box-sizing:border-box;display:flex;height:1.5rem;justify-content:center;position:absolute;right:-.5rem;width:1.5rem}.buttons-module_link-button-icon__llX8m .buttons-module_camp-logo__slNl0 svg{height:1.1rem;width:1.1rem}.buttons-module_link-button-icon__llX8m:disabled .buttons-module_camp-logo__slNl0 svg path,.buttons-module_not-linked__ua4va svg path{fill:#b8b8b8!important}.buttons-module_file-upload-container__le7Cg{align-items:center;border:2px dashed #ccc;border-radius:.75rem;box-sizing:border-box;color:#777;cursor:pointer;display:flex;flex-direction:column;justify-content:center;max-width:100%;min-height:12rem;min-width:0;padding:1rem;position:relative;text-align:center;transition:background-color .2s,border-color .2s;width:100%}.buttons-module_file-upload-container__le7Cg:hover{border-color:#e2e2e2}.buttons-module_file-upload-container__le7Cg.buttons-module_dragging__cfggZ{background-color:#f9f9f9;border-color:#ff6f00}.buttons-module_file-upload-container__le7Cg.buttons-module_dragging__cfggZ .buttons-module_file-preview__yuM5i{opacity:.2;transition:opacity .2s}.buttons-module_file-upload-container__le7Cg.buttons-module_file-selected__YY6ms{background-color:#f9f9f9;border:none;height:auto;min-height:auto;padding:0}.buttons-module_file-input__gbD5T{display:none}.buttons-module_selected-file-container__E1AXM{align-items:center;display:flex;flex-direction:column;gap:.25rem;height:100%;justify-content:space-between;max-width:100%;position:relative;width:100%}.buttons-module_remove-file-button__Q1FMa{border:1px solid #ff6f00;border-radius:.5rem;color:#fff;color:#ff6f00;cursor:pointer;font-size:.875rem;padding:.5rem;text-align:center;transition:background-color .2s}.buttons-module_remove-file-button__Q1FMa:hover{background-color:#cc4e02;border-color:#cc4e02;color:#fff;cursor:pointer}.buttons-module_upload-file-button__vTwWd{background-color:#ff6f00;border:none;border-radius:.5rem;color:#fff;cursor:pointer;font-size:.875rem;padding:.5rem;text-align:center;transition:background-color .2s;width:100%}.buttons-module_upload-file-button__vTwWd:hover{background-color:#cc4e02;cursor:pointer}.buttons-module_file-preview__yuM5i{border-radius:.5rem;max-height:8rem;max-width:100%}.buttons-module_file-preview-text__80Ju0{color:#333;font-size:.875rem;margin-bottom:.5rem}.buttons-module_file-name__3iskR{color:#333;font-size:.875rem;max-width:100%;min-height:-moz-fit-content;min-height:fit-content;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.buttons-module_upload-buttons__3SAw6{align-items:center;display:flex;gap:.25rem;justify-content:space-between;width:100%}.buttons-module_upload-buttons__3SAw6 .buttons-module_upload-file-button__vTwWd{flex-grow:1}.buttons-module_upload-buttons__3SAw6 .buttons-module_remove-file-button__Q1FMa{flex-grow:0}.buttons-module_accepted-types__Ys-D2{color:#777;font-size:.875rem;font-style:italic;margin-top:.5rem}.buttons-module_loading-bar-container__nrgPX{background-color:#e0e0e0;border-radius:4px;height:8px;margin-top:8px;overflow:hidden;width:100%}.buttons-module_loading-bar__IUAg1{background-color:#ff6f00;height:100%;transition:width .3s ease}.buttons-module_date-picker__V6gRM{display:flex;flex-direction:column;font-family:sans-serif;gap:6px;width:100%}.buttons-module_date-picker__V6gRM input{border:1px solid #ccc;border-radius:4px;font-size:14px;padding:6px 10px}.buttons-module_percentage-slider__M84tC{display:flex;flex-direction:row;font-family:sans-serif;gap:8px;justify-content:space-between;width:100%}.buttons-module_percentage-slider__M84tC input[type=range]{width:100%}.buttons-module_percentage-slider__M84tC label{min-width:50px}.buttons-module_price-input-container__teIRS{display:flex;flex-direction:column;font-family:sans-serif;gap:6px;width:100%}.buttons-module_price-input__22j0n{border:1px solid #ccc;border-radius:4px;font-family:sans-serif;padding:6px 10px}.buttons-module_duration-input-container__Rh9Na{display:flex;flex-direction:column;font-family:sans-serif;gap:6px;width:100%}.buttons-module_duration-input__-gt3p{border:1px solid #ccc;border-radius:4px;font-family:sans-serif;padding:6px 10px}\n/*# sourceMappingURL=data:application/json;base64,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QixpQkFBa0IsQ0FIbEIsc0JBQXVCLENBQ3ZCLGdCQUdGIiwiZmlsZSI6ImJ1dHRvbnMubW9kdWxlLmNzcyIsInNvdXJjZXNDb250ZW50IjpbIi5jb25uZWN0LWJ1dHRvbiB7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZjZmMDA7XHJcbiAgY29sb3I6IHdoaXRlO1xyXG4gIGJvcmRlcjogbm9uZTtcclxuICBib3JkZXItcmFkaXVzOiAwLjc1cmVtO1xyXG4gIHBhZGRpbmctaW5saW5lOiAyLjVyZW07XHJcbiAgcGFkZGluZy1sZWZ0OiA1cmVtO1xyXG4gIGhlaWdodDogMi43NXJlbTtcclxuICBsaW5lLWhlaWdodDogMS4zMzNyZW07XHJcbiAgZm9udC1zaXplOiAxcmVtO1xyXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgd2lkdGg6IDEycmVtO1xyXG4gIGZvbnQtZmFtaWx5OiBcIlNhdG9zaGlcIiwgc3lzdGVtLXVpLCAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsXHJcbiAgICBcIlNlZ29lIFVJXCIsIFJvYm90bywgT3h5Z2VuLCBVYnVudHUsIENhbnRhcmVsbCwgXCJPcGVuIFNhbnNcIiwgXCJIZWx2ZXRpY2EgTmV1ZVwiLFxyXG4gICAgc2Fucy1zZXJpZjtcclxuICBib3gtc2hhZG93OiBoc2xhKDAsIDAlLCAxMDAlLCAwLjE1KSAwIDJweCAwIGluc2V0LFxyXG4gICAgcmdiYSgwLCAwLCAwLCAwLjA1KSAwIC0ycHggNHB4IGluc2V0LCByZ2JhKDQ2LCA1NCwgODAsIDAuMDc1KSAwIDFweCAxcHg7XHJcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjE1cztcclxufVxyXG5cclxuLmNvbm5lY3QtYnV0dG9uIC5idXR0b24taWNvbiB7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHRvcDogNTAlO1xyXG4gIGxlZnQ6IDA7XHJcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xyXG4gIHdpZHRoOiAzcmVtO1xyXG4gIGhlaWdodDogMTAwJTtcclxuICBtYXJnaW4tcmlnaHQ6IDAuNXJlbTtcclxuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNzUpO1xyXG4gIGJveC1zaGFkb3c6IGhzbGEoMCwgMCUsIDEwMCUsIDAuMTUpIDAgMnB4IDAgaW5zZXQsXHJcbiAgICByZ2JhKDAsIDAsIDAsIDAuMDUpIDAgLTJweCA0cHggaW5zZXQ7XHJcbiAgZGlzcGxheTogZ3JpZDtcclxuICBwbGFjZS1pdGVtczogY2VudGVyO1xyXG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4xNXM7XHJcbiAgYm9yZGVyLXJhZGl1czogMC43NXJlbSAwIDAgMC43NXJlbTtcclxufVxyXG5cclxuLmNvbm5lY3QtYnV0dG9uIC5idXR0b24taWNvbiBzdmcge1xyXG4gIHdpZHRoOiAxLjI1cmVtO1xyXG4gIGhlaWdodDogMS4yNXJlbTtcclxufVxyXG5cclxuLmNvbm5lY3QtYnV0dG9uOmhvdmVyIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2M0ZTAyO1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxuICBib3JkZXItY29sb3I6ICNjYzRlMDI7XHJcbn1cclxuXHJcbi5jb25uZWN0LWJ1dHRvbjpob3ZlciAuYnV0dG9uLWljb24ge1xyXG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC42NzUpO1xyXG59XHJcblxyXG4uY29ubmVjdC1idXR0b246Zm9jdXMge1xyXG4gIG91dGxpbmU6IG5vbmU7XHJcbn1cclxuXHJcbi5jb25uZWN0LWJ1dHRvbjpkaXNhYmxlZCB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2NjYztcclxuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xyXG59XHJcblxyXG4ucHJvdmlkZXItYnV0dG9uIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIHBhZGRpbmc6IDAuNXJlbTtcclxuICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xyXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmVmZWZlO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xyXG4gIGdhcDogMC41cmVtO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4xNXM7XHJcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XHJcbn1cclxuXHJcbi5wcm92aWRlci1idXR0b246Zm9jdXMge1xyXG4gIG91dGxpbmU6IDFweCBzb2xpZCAjNDNiN2M0O1xyXG59XHJcblxyXG4ucHJvdmlkZXItYnV0dG9uOmhvdmVyIHtcclxuICBib3JkZXItY29sb3I6ICM0M2I3YzQ7XHJcbn1cclxuXHJcbi5wcm92aWRlci1idXR0b246aG92ZXI6bm90KDpkaXNhYmxlZCkge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNkZGQ7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcblxyXG4ucHJvdmlkZXItYnV0dG9uIGltZyB7XHJcbiAgd2lkdGg6IDJyZW07XHJcbiAgaGVpZ2h0OiAycmVtO1xyXG59XHJcblxyXG4ucHJvdmlkZXItYnV0dG9uIC5wcm92aWRlci1pY29uIHtcclxuICBib3JkZXItcmFkaXVzOiAwLjJyZW07XHJcbn1cclxuXHJcbi5wcm92aWRlci1idXR0b24gc3BhbiB7XHJcbiAgbWFyZ2luLWxlZnQ6IDAuNXJlbTtcclxuICBsaW5lLWhlaWdodDogMXJlbTtcclxufVxyXG5cclxuLnByb3ZpZGVyLWJ1dHRvbiBzcGFuLnByb3ZpZGVyLW5hbWUge1xyXG4gIGNvbG9yOiAjMzMzO1xyXG4gIGZvbnQtc2l6ZTogMC44NzVyZW07XHJcbn1cclxuXHJcbi5wcm92aWRlci1idXR0b24gc3Bhbi5wcm92aWRlci1sYWJlbCB7XHJcbiAgY29sb3I6ICM3Nzc7XHJcbiAgZm9udC1zaXplOiAwLjdyZW07XHJcbn1cclxuXHJcbi8qIFwiZGVmYXVsdFwiIHZhcmlhbnQgKi9cclxuLmxpbmstYnV0dG9uLWRlZmF1bHQge1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gIGJvcmRlcjogbm9uZTtcclxuICB3aWR0aDogN3JlbTtcclxuICBoZWlnaHQ6IDIuNnJlbTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmY2ZjAwO1xyXG4gIGJvcmRlci1yYWRpdXM6IDAuNzVyZW07XHJcbiAgYm94LXNoYWRvdzogaHNsYSgwLCAwJSwgMTAwJSwgMC4xNSkgMCAycHggMCBpbnNldCxcclxuICAgIHJnYmEoMCwgMCwgMCwgMC4wNSkgMCAtMnB4IDRweCBpbnNldCwgcmdiYSg0NiwgNTQsIDgwLCAwLjA3NSkgMCAxcHggMXB4O1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5cclxuLmxpbmstYnV0dG9uLWRlZmF1bHQ6ZGlzYWJsZWQge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNiOGI4Yjg7XHJcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcclxufVxyXG5cclxuLmxpbmstYnV0dG9uLWRlZmF1bHQ6OmFmdGVyIHtcclxuICBjb250ZW50OiBcIlwiO1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICB0b3A6IDA7XHJcbiAgbGVmdDogMDtcclxuICByaWdodDogMDtcclxuICBib3R0b206IDA7XHJcbiAgYm9yZGVyLXJhZGl1czogMC43NXJlbTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDApO1xyXG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4xNXM7XHJcbn1cclxuXHJcbi5saW5rLWJ1dHRvbi1kZWZhdWx0OmRpc2FibGVkOjphZnRlciB7XHJcbiAgY29udGVudDogXCJOb3QgY29ubmVjdGVkXCI7XHJcbiAgdmlzaWJpbGl0eTogaGlkZGVuO1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICB0b3A6IC0yLjdyZW07XHJcbiAgbGVmdDogMDtcclxuICByaWdodDogMDtcclxuICBoZWlnaHQ6IDJyZW07XHJcbiAgYm9yZGVyLXJhZGl1czogMC4zNXJlbTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMzUpO1xyXG4gIGNvbG9yOiB3aGl0ZTtcclxuICBkaXNwbGF5OiBncmlkO1xyXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XHJcbiAgZm9udC1zaXplOiAwLjc1cmVtO1xyXG4gIHBhZGRpbmc6IDAuMjVyZW07XHJcbiAgb3BhY2l0eTogMDtcclxuICB0cmFuc2l0aW9uOiBhbGwgMC4yNXM7XHJcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0wLjVyZW0pO1xyXG4gIHVzZXItc2VsZWN0OiBub25lO1xyXG59XHJcblxyXG4ubGluay1idXR0b24tZGVmYXVsdDpkaXNhYmxlZDpob3Zlcjo6YWZ0ZXIge1xyXG4gIHZpc2liaWxpdHk6IHZpc2libGU7XHJcbiAgb3BhY2l0eTogMTtcclxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XHJcbn1cclxuXHJcbi5saW5rLWJ1dHRvbi1kZWZhdWx0Om5vdCg6ZGlzYWJsZWQpOmhvdmVyOjphZnRlciB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjEpO1xyXG59XHJcblxyXG4ubGluay1idXR0b24tZGVmYXVsdDpub3QoOmRpc2FibGVkKS50d2l0dGVyIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMWRhMWYyO1xyXG59XHJcblxyXG4ubGluay1idXR0b24tZGVmYXVsdDpub3QoOmRpc2FibGVkKS5zcG90aWZ5IHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMWRiOTU0O1xyXG59XHJcblxyXG4ubGluay1idXR0b24tZGVmYXVsdDpub3QoOmRpc2FibGVkKS5kaXNjb3JkIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNzI4OWRhO1xyXG59XHJcblxyXG4ubGluay1idXR0b24tZGVmYXVsdDpub3QoOmRpc2FibGVkKS50aWt0b2sge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7XHJcbn1cclxuXHJcbi5saW5rLWJ1dHRvbi1kZWZhdWx0Om5vdCg6ZGlzYWJsZWQpLnRlbGVncmFtIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDA4OGNjO1xyXG59XHJcblxyXG4ubGluay1idXR0b24tZGVmYXVsdCAuYnV0dG9uLWNvbnRhaW5lciB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gIGdhcDogMC41cmVtO1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgcGFkZGluZzogMC41cmVtO1xyXG59XHJcblxyXG4uYnV0dG9uLWNvbnRhaW5lciAuc29jaWFsLWljb24ge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgd2lkdGg6IDEuNXJlbTtcclxuICBoZWlnaHQ6IDEuNXJlbTtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGNvbG9yOiB3aGl0ZTtcclxufVxyXG5cclxuLmJ1dHRvbi1jb250YWluZXIgLnNvY2lhbC1pY29uIHN2ZyB7XHJcbiAgd2lkdGg6IDEuNXJlbTtcclxuICBoZWlnaHQ6IDEuNXJlbTtcclxuICBmaWxsOiB3aGl0ZSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4uYnV0dG9uLWNvbnRhaW5lciAuc29jaWFsLWljb24gc3ZnIHBhdGgge1xyXG4gIGZpbGw6IHdoaXRlICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5idXR0b24tY29udGFpbmVyIC5saW5rLWljb24ge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgd2lkdGg6IDEuMjVyZW07XHJcbiAgaGVpZ2h0OiAxLjI1cmVtO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC44KTtcclxufVxyXG5cclxuLmJ1dHRvbi1jb250YWluZXIgLmNhbXAtbG9nbyB7XHJcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIHdpZHRoOiAxLjVyZW07XHJcbiAgaGVpZ2h0OiAxLjVyZW07XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcclxuICBib3JkZXItcmFkaXVzOiA1MCU7XHJcbiAgcGFkZGluZzogMC4xNXJlbTtcclxufVxyXG5cclxuLmxpbmstYnV0dG9uLWRlZmF1bHQ6ZGlzYWJsZWQgLmJ1dHRvbi1jb250YWluZXIgLmNhbXAtbG9nbyBzdmcgcGF0aCB7XHJcbiAgZmlsbDogI2I4YjhiOCAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4vKiBcImljb25cIiB2YXJpYW50ICovXHJcbi5saW5rLWJ1dHRvbi1pY29uIHtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICBtaW4td2lkdGg6IDNyZW07XHJcbiAgbWluLWhlaWdodDogM3JlbTtcclxuICB3aWR0aDogM3JlbTtcclxuICBoZWlnaHQ6IDNyZW07XHJcbiAgYm9yZGVyOiBub25lO1xyXG4gIHBhZGRpbmc6IDByZW07XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmNmYwMDtcclxuICBib3JkZXItcmFkaXVzOiAwLjc1cmVtO1xyXG4gIGJveC1zaGFkb3c6IGhzbGEoMCwgMCUsIDEwMCUsIDAuMTUpIDAgMnB4IDAgaW5zZXQsXHJcbiAgICByZ2JhKDAsIDAsIDAsIDAuMDUpIDAgLTJweCA0cHggaW5zZXQsIHJnYmEoNDYsIDU0LCA4MCwgMC4wNzUpIDAgMXB4IDFweDtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbn1cclxuXHJcbi5saW5rLWJ1dHRvbi1pY29uOmRpc2FibGVkIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYjhiOGI4O1xyXG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XHJcbn1cclxuXHJcbi5saW5rLWJ1dHRvbi1pY29uOmRpc2FibGVkOjphZnRlciB7XHJcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICBjb250ZW50OiBcIk5vdCBjb25uZWN0ZWRcIjtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgdG9wOiAtMi43cmVtO1xyXG4gIGxlZnQ6IC0xcmVtO1xyXG4gIHJpZ2h0OiAtMXJlbTtcclxuICBoZWlnaHQ6IGZpdC1jb250ZW50O1xyXG4gIGJvcmRlci1yYWRpdXM6IDAuMzVyZW07XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjM1KTtcclxuICBjb2xvcjogd2hpdGU7XHJcbiAgZGlzcGxheTogZ3JpZDtcclxuICBwbGFjZS1pdGVtczogY2VudGVyO1xyXG4gIGZvbnQtc2l6ZTogMC43NXJlbTtcclxuICBwYWRkaW5nOiAwLjI1cmVtO1xyXG4gIG9wYWNpdHk6IDA7XHJcbiAgdHJhbnNpdGlvbjogYWxsIDAuMjVzO1xyXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMC41cmVtKTtcclxufVxyXG5cclxuLmxpbmstYnV0dG9uLWljb246ZGlzYWJsZWQ6aG92ZXI6OmFmdGVyIHtcclxuICBvcGFjaXR5OiAxO1xyXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcclxufVxyXG5cclxuLmxpbmstYnV0dG9uLWljb246OmFmdGVyIHtcclxuICBjb250ZW50OiBcIlwiO1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICB0b3A6IDA7XHJcbiAgbGVmdDogMDtcclxuICByaWdodDogMDtcclxuICBib3R0b206IDA7XHJcbiAgYm9yZGVyLXJhZGl1czogMC43NXJlbTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDApO1xyXG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4xNXM7XHJcbn1cclxuXHJcbi5saW5rLWJ1dHRvbi1pY29uOm5vdCg6ZGlzYWJsZWQpOmhvdmVyOjphZnRlciB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjEpO1xyXG59XHJcblxyXG4ubGluay1idXR0b24taWNvbjpub3QoOmRpc2FibGVkKS50d2l0dGVyIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMWRhMWYyO1xyXG59XHJcblxyXG4ubGluay1idXR0b24taWNvbjpub3QoOmRpc2FibGVkKS5zcG90aWZ5IHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMWRiOTU0O1xyXG59XHJcblxyXG4ubGluay1idXR0b24taWNvbjpub3QoOmRpc2FibGVkKS5kaXNjb3JkIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNzI4OWRhO1xyXG59XHJcblxyXG4ubGluay1idXR0b24taWNvbjpub3QoOmRpc2FibGVkKS50aWt0b2sge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDAwMDA7XHJcbn1cclxuXHJcbi5saW5rLWJ1dHRvbi1pY29uOm5vdCg6ZGlzYWJsZWQpLnRlbGVncmFtIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDA4OGNjO1xyXG59XHJcblxyXG4ubGluay1idXR0b24taWNvbiAuaWNvbi1jb250YWluZXIge1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIGhlaWdodDogMTAwJTtcclxuICBmbGV4OiAxO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbn1cclxuXHJcbi5saW5rLWJ1dHRvbi1pY29uIC5pY29uLWNvbnRhaW5lciA+IHN2ZyB7XHJcbiAgd2lkdGg6IDEuNXJlbTtcclxuICBoZWlnaHQ6IDEuNXJlbTtcclxuICBmaWxsOiB3aGl0ZSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubGluay1idXR0b24taWNvbiAuaWNvbi1jb250YWluZXIgPiBzdmcgcGF0aCB7XHJcbiAgZmlsbDogd2hpdGUgIWltcG9ydGFudDtcclxufVxyXG5cclxuLmxpbmstYnV0dG9uLWljb24gLmNhbXAtbG9nbyB7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICB3aWR0aDogMS41cmVtO1xyXG4gIGhlaWdodDogMS41cmVtO1xyXG4gIHJpZ2h0OiAtMC41cmVtO1xyXG4gIGJvdHRvbTogLTAuNXJlbTtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xyXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcclxufVxyXG5cclxuLmxpbmstYnV0dG9uLWljb24gLmNhbXAtbG9nbyBzdmcge1xyXG4gIHdpZHRoOiAxLjFyZW07XHJcbiAgaGVpZ2h0OiAxLjFyZW07XHJcbn1cclxuXHJcbi5saW5rLWJ1dHRvbi1pY29uOmRpc2FibGVkIC5jYW1wLWxvZ28gc3ZnIHBhdGgge1xyXG4gIGZpbGw6ICNiOGI4YjggIWltcG9ydGFudDtcclxufVxyXG5cclxuLm5vdC1saW5rZWQgc3ZnIHBhdGgge1xyXG4gIGZpbGw6ICNiOGI4YjggIWltcG9ydGFudDtcclxufVxyXG5cclxuLmZpbGUtdXBsb2FkLWNvbnRhaW5lciB7XHJcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICBib3JkZXI6IDJweCBkYXNoZWQgI2NjYztcclxuICBib3JkZXItcmFkaXVzOiAwLjc1cmVtO1xyXG4gIHBhZGRpbmc6IDFyZW07XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIGNvbG9yOiAjNzc3O1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMnMsIGJvcmRlci1jb2xvciAwLjJzO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIG1pbi13aWR0aDogMDtcclxuICBtYXgtd2lkdGg6IDEwMCU7XHJcbiAgbWluLWhlaWdodDogMTJyZW07XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG59XHJcblxyXG4uZmlsZS11cGxvYWQtY29udGFpbmVyOmhvdmVyIHtcclxuICBib3JkZXItY29sb3I6ICNlMmUyZTI7XHJcbn1cclxuXHJcbi5maWxlLXVwbG9hZC1jb250YWluZXIuZHJhZ2dpbmcge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmOWY5Zjk7XHJcbiAgYm9yZGVyLWNvbG9yOiAjZmY2ZjAwO1xyXG59XHJcblxyXG4uZmlsZS11cGxvYWQtY29udGFpbmVyLmRyYWdnaW5nIC5maWxlLXByZXZpZXcge1xyXG4gIG9wYWNpdHk6IDAuMjtcclxuICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuMnM7XHJcbn1cclxuXHJcbi5maWxlLXVwbG9hZC1jb250YWluZXIuZmlsZS1zZWxlY3RlZCB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y5ZjlmOTtcclxuICBib3JkZXI6IG5vbmU7XHJcbiAgcGFkZGluZzogMDtcclxuICBoZWlnaHQ6IGF1dG87XHJcbiAgbWluLWhlaWdodDogYXV0bztcclxufVxyXG5cclxuLmZpbGUtaW5wdXQge1xyXG4gIGRpc3BsYXk6IG5vbmU7XHJcbn1cclxuXHJcbi5zZWxlY3RlZC1maWxlLWNvbnRhaW5lciB7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgaGVpZ2h0OiAxMDAlO1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgbWF4LXdpZHRoOiAxMDAlO1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIGdhcDogMC4yNXJlbTtcclxufVxyXG5cclxuLnJlbW92ZS1maWxlLWJ1dHRvbiB7XHJcbiAgY29sb3I6IHdoaXRlO1xyXG4gIGJvcmRlcjogMXB4IHNvbGlkICNmZjZmMDA7XHJcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xyXG4gIHBhZGRpbmc6IDAuNXJlbTtcclxuICBmb250LXNpemU6IDAuODc1cmVtO1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMnM7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIGNvbG9yOiAjZmY2ZjAwO1xyXG59XHJcblxyXG4ucmVtb3ZlLWZpbGUtYnV0dG9uOmhvdmVyIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2M0ZTAyO1xyXG4gIGJvcmRlci1jb2xvcjogI2NjNGUwMjtcclxuICBjb2xvcjogd2hpdGU7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcblxyXG4udXBsb2FkLWZpbGUtYnV0dG9uIHtcclxuICBjb2xvcjogd2hpdGU7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmNmYwMDtcclxuICBib3JkZXI6IG5vbmU7XHJcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xyXG4gIHBhZGRpbmc6IDAuNXJlbTtcclxuICBmb250LXNpemU6IDAuODc1cmVtO1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMnM7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG59XHJcbi51cGxvYWQtZmlsZS1idXR0b246aG92ZXIge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNjYzRlMDI7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcblxyXG4uZmlsZS1wcmV2aWV3IHtcclxuICBtYXgtd2lkdGg6IDEwMCU7XHJcbiAgbWF4LWhlaWdodDogOHJlbTtcclxuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XHJcbn1cclxuXHJcbi5maWxlLXByZXZpZXctdGV4dCB7XHJcbiAgZm9udC1zaXplOiAwLjg3NXJlbTtcclxuICBjb2xvcjogIzMzMztcclxuICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XHJcbn1cclxuXHJcbi5maWxlLW5hbWUge1xyXG4gIGZvbnQtc2l6ZTogMC44NzVyZW07XHJcbiAgY29sb3I6ICMzMzM7XHJcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcclxuICBvdmVyZmxvdzogaGlkZGVuO1xyXG4gIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xyXG4gIG1pbi1oZWlnaHQ6IGZpdC1jb250ZW50O1xyXG4gIG1heC13aWR0aDogMTAwJTtcclxufVxyXG5cclxuLnVwbG9hZC1idXR0b25zIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGdhcDogMC4yNXJlbTtcclxuICB3aWR0aDogMTAwJTtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxufVxyXG5cclxuLnVwbG9hZC1idXR0b25zIC51cGxvYWQtZmlsZS1idXR0b24ge1xyXG4gIGZsZXgtZ3JvdzogMTtcclxufVxyXG5cclxuLnVwbG9hZC1idXR0b25zIC5yZW1vdmUtZmlsZS1idXR0b24ge1xyXG4gIGZsZXgtZ3JvdzogMDtcclxufVxyXG5cclxuLmFjY2VwdGVkLXR5cGVzIHtcclxuICBmb250LXNpemU6IDAuODc1cmVtO1xyXG4gIGNvbG9yOiAjNzc3O1xyXG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcclxuICBmb250LXN0eWxlOiBpdGFsaWM7XHJcbn1cclxuXHJcbi5sb2FkaW5nLWJhci1jb250YWluZXIge1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIGhlaWdodDogOHB4O1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNlMGUwZTA7XHJcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG4gIG92ZXJmbG93OiBoaWRkZW47XHJcbiAgbWFyZ2luLXRvcDogOHB4O1xyXG59XHJcblxyXG4ubG9hZGluZy1iYXIge1xyXG4gIGhlaWdodDogMTAwJTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmY2ZjAwO1xyXG4gIHRyYW5zaXRpb246IHdpZHRoIDAuM3MgZWFzZTtcclxufVxyXG5cclxuLmRhdGUtcGlja2VyIHtcclxuICB3aWR0aDogMTAwJTtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgZ2FwOiA2cHg7XHJcbiAgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7XHJcbn1cclxuXHJcbi5kYXRlLXBpY2tlciBpbnB1dCB7XHJcbiAgcGFkZGluZzogNnB4IDEwcHg7XHJcbiAgZm9udC1zaXplOiAxNHB4O1xyXG4gIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XHJcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG59XHJcblxyXG4ucGVyY2VudGFnZS1zbGlkZXIge1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICBnYXA6IDhweDtcclxuICBmb250LWZhbWlseTogc2Fucy1zZXJpZjtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbn1cclxuXHJcbi5wZXJjZW50YWdlLXNsaWRlciBpbnB1dFt0eXBlPVwicmFuZ2VcIl0ge1xyXG4gIHdpZHRoOiAxMDAlO1xyXG59XHJcblxyXG4ucGVyY2VudGFnZS1zbGlkZXIgbGFiZWwge1xyXG4gIG1pbi13aWR0aDogNTBweDtcclxufVxyXG5cclxuLnByaWNlLWlucHV0LWNvbnRhaW5lciB7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGdhcDogNnB4O1xyXG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xyXG59XHJcblxyXG4ucHJpY2UtaW5wdXQge1xyXG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xyXG4gIHBhZGRpbmc6IDZweCAxMHB4O1xyXG4gIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XHJcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG59XHJcblxyXG5cclxuLmR1cmF0aW9uLWlucHV0LWNvbnRhaW5lciB7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGdhcDogNnB4O1xyXG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xyXG59XHJcblxyXG4uZHVyYXRpb24taW5wdXQge1xyXG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xyXG4gIHBhZGRpbmc6IDZweCAxMHB4O1xyXG4gIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XHJcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xyXG59XHJcbiJdfQ== */";
var buttonStyles = {"connect-button":"buttons-module_connect-button__CJhUa","button-icon":"buttons-module_button-icon__JM4-2","provider-button":"buttons-module_provider-button__6JY7s","provider-icon":"buttons-module_provider-icon__MOhr8","provider-name":"buttons-module_provider-name__tHWO2","provider-label":"buttons-module_provider-label__CEGRr","link-button-default":"buttons-module_link-button-default__EcKUT","twitter":"buttons-module_twitter__9sRaz","spotify":"buttons-module_spotify__-fiKQ","discord":"buttons-module_discord__I-YjZ","tiktok":"buttons-module_tiktok__a80-0","telegram":"buttons-module_telegram__ExOTS","button-container":"buttons-module_button-container__-oPqd","social-icon":"buttons-module_social-icon__DPdPe","link-icon":"buttons-module_link-icon__8V8FP","camp-logo":"buttons-module_camp-logo__slNl0","link-button-icon":"buttons-module_link-button-icon__llX8m","icon-container":"buttons-module_icon-container__Q5bI1","not-linked":"buttons-module_not-linked__ua4va","file-upload-container":"buttons-module_file-upload-container__le7Cg","dragging":"buttons-module_dragging__cfggZ","file-preview":"buttons-module_file-preview__yuM5i","file-selected":"buttons-module_file-selected__YY6ms","file-input":"buttons-module_file-input__gbD5T","selected-file-container":"buttons-module_selected-file-container__E1AXM","remove-file-button":"buttons-module_remove-file-button__Q1FMa","upload-file-button":"buttons-module_upload-file-button__vTwWd","file-preview-text":"buttons-module_file-preview-text__80Ju0","file-name":"buttons-module_file-name__3iskR","upload-buttons":"buttons-module_upload-buttons__3SAw6","accepted-types":"buttons-module_accepted-types__Ys-D2","loading-bar-container":"buttons-module_loading-bar-container__nrgPX","loading-bar":"buttons-module_loading-bar__IUAg1","date-picker":"buttons-module_date-picker__V6gRM","percentage-slider":"buttons-module_percentage-slider__M84tC","price-input-container":"buttons-module_price-input-container__teIRS","price-input":"buttons-module_price-input__22j0n","duration-input-container":"buttons-module_duration-input-container__Rh9Na","duration-input":"buttons-module_duration-input__-gt3p"};
styleInject(css_248z);

/**
 * The injected CampButton component.
 * @param { { onClick: function, authenticated: boolean } } props The props.
 * @returns { JSX.Element } The CampButton component.
 */
const CampButton = ({ onClick, authenticated, disabled, }) => {
    return (React.createElement("button", { className: buttonStyles["connect-button"], onClick: onClick, disabled: disabled },
        React.createElement("div", { className: buttonStyles["button-icon"] },
            React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 571.95 611.12", height: "1rem", width: "1rem" },
                React.createElement("path", { d: "m563.25 431.49-66.17-51.46c-11.11-8.64-27.28-5.06-33.82 7.4-16.24 30.9-41.69 56.36-70.85 73.73l-69.35-69.35c-3.73-3.73-8.79-5.83-14.07-5.83s-10.34 2.1-14.07 5.83l-73.78 73.78c-57.37-30.39-96.55-90.71-96.55-160.03 0-99.79 81.19-180.98 180.98-180.98 60.35 0 118.17 26.28 156.39 89.44 6.85 11.32 21.92 14.33 32.59 6.51l64.21-47.06c9.53-6.98 12.06-20.15 5.78-30.16C508.83 54.41 411.43 0 305.56 0 137.07 0 0 137.07 0 305.56s137.07 305.56 305.56 305.56c57.6 0 113.72-16.13 162.31-46.63A306.573 306.573 0 0 0 568.8 460.8c5.78-9.78 3.42-22.34-5.55-29.31Zm-301.42 49.69 47.15-47.15 44.69 44.69c-15.92 5.1-32.2 7.83-48.1 7.83-15.08 0-29.72-1.87-43.74-5.36Zm42.36-222.47c-.07 1.49-.08 21.29 49.54 55.11 37.02 25.24 19.68 75.52 12.1 92.05a147.07 147.07 0 0 0-20.12-38.91c-12.73-17.59-26.87-28.9-36.74-35.59-10.38 6.36-27.41 18.74-41.07 40.02-8.27 12.89-12.82 25.16-15.42 34.48l-.03-.05c-15.1-40.6-9.75-60.88-1.95-71.9 6.12-8.65 17.24-20.6 17.24-20.6 9.71-9.66 19.96-19.06 29.82-38.17 6.06-11.75 6.59-15.84 6.63-16.45Z", fill: "#000", strokeWidth: "0" }),
                React.createElement("path", { d: "M267.74 313.33s-11.11 11.95-17.24 20.6c-7.8 11.02-13.14 31.3 1.95 71.9-86.02-75.3 2.56-152.15.79-146.3-6.58 21.75 14.49 53.8 14.49 53.8Zm20.98-23.66c3.01-4.27 5.97-9.06 8.8-14.55 6.62-12.83 6.64-16.54 6.64-16.54s-2.09 20.02 49.53 55.21c37.02 25.24 19.68 75.52 12.1 92.05 0 0 43.69-27.86 37.49-74.92-7.45-56.61-38.08-51.5-60.84-93.43-21.23-39.11 15.03-70.44 15.03-70.44s-48.54-2.61-70.76 48.42c-23.42 53.77 2 74.21 2 74.21Z", fill: "#ff6d01", strokeWidth: "0" }))),
        authenticated ? "My Origin" : "Connect"));
};
/**
 * The GoToOriginDashboard component. Handles the action of going to the Origin Dashboard.
 * @param { { text?: string } } props The props.
 * @param { string } [props.text] The text to display on the button.
 * @param { string } [props.text="Origin Dashboard"] The default text to display on the button.
 * @returns { JSX.Element } The GoToOriginDashboard component.
 */
const GoToOriginDashboard = ({ text = "Origin Dashboard", }) => (React.createElement("a", { className: styles["origin-dashboard-button"], href: constants.ORIGIN_DASHBOARD, target: "_blank", rel: "noopener noreferrer" },
    text,
    " ",
    React.createElement(LinkIcon, { w: "0.875rem" })));
/**
 * The TabButton component.
 * @param { { label: string, isActive: boolean, onClick: function } } props The props.
 * @returns { JSX.Element } The TabButton component.
 */
const TabButton = ({ label, isActive, onClick, }) => {
    return (React.createElement("button", { className: `${styles["tab-button"]} ${isActive ? styles["active-tab"] : ""}`, onClick: onClick }, label));
};
const StandaloneCampButton = () => {
    const modalContext = useContext(ModalContext);
    const { openModal } = useModal();
    const { authenticated } = useAuthState();
    if (!modalContext) {
        console.error("CampButton must be used within a ModalProvider");
        return null;
    }
    const { isButtonDisabled } = modalContext;
    return (React.createElement(CampButton, { onClick: openModal, authenticated: authenticated, disabled: isButtonDisabled }));
};
/**
 * The ProviderButton component.
 * @param { { provider: { provider: string, info: { name: string, icon: string } }, handleConnect: function, loading: boolean, label: string } } props The props.
 * @returns { JSX.Element } The ProviderButton component.
 */
const ProviderButton = ({ provider, handleConnect, loading, label, }) => {
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const handleClick = () => {
        handleConnect(provider);
        setIsButtonLoading(true);
    };
    useEffect(() => {
        if (!loading) {
            setIsButtonLoading(false);
        }
    }, [loading]);
    return (React.createElement("button", { className: buttonStyles["provider-button"], onClick: handleClick, disabled: loading },
        React.createElement("img", { src: provider.info.icon ||
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='%23777777' d='M21 7.28V5c0-1.1-.9-2-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-2.28A2 2 0 0 0 22 15V9a2 2 0 0 0-1-1.72M20 9v6h-7V9zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2z'/%3E%3Ccircle cx='16' cy='12' r='1.5' fill='%23777777'/%3E%3C/svg%3E", className: buttonStyles["provider-icon"], alt: provider.info.name }),
        React.createElement("div", { style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
            } },
            React.createElement("span", { className: buttonStyles["provider-name"] }, provider.info.name),
            label && (React.createElement("span", { className: buttonStyles["provider-label"] },
                "(",
                label,
                ")"))),
        isButtonLoading && React.createElement("div", { className: styles.spinner })));
};
const ConnectorButton = ({ name, link, unlink, icon, isConnected, refetch, }) => {
    const [isUnlinking, setIsUnlinking] = useState(false);
    const handleClick = () => {
        link();
    };
    const handleDisconnect = () => __awaiter(void 0, void 0, void 0, function* () {
        setIsUnlinking(true);
        try {
            yield unlink();
            yield refetch();
            setIsUnlinking(false);
        }
        catch (error) {
            setIsUnlinking(false);
            console.error(error);
        }
    });
    return (React.createElement("div", { className: styles["connector-container"] }, isConnected ? (React.createElement("div", { className: styles["connector-connected"], "data-connected": isConnected },
        icon,
        React.createElement("span", null, name),
        isUnlinking ? (React.createElement("div", { className: styles.loader, style: {
                alignSelf: "flex-end",
                position: "absolute",
                right: "0.375rem",
            } })) : (React.createElement("button", { className: styles["unlink-connector-button"], onClick: handleDisconnect, disabled: isUnlinking },
            React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", stroke: "currentColor" },
                React.createElement("path", { fill: "none", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M17 22v-2m-8-5l6-6m-4-3l.463-.536a5 5 0 0 1 7.071 7.072L18 13m-5 5l-.397.534a5.07 5.07 0 0 1-7.127 0a4.97 4.97 0 0 1 0-7.071L6 11m14 6h2M2 7h2m3-5v2" })),
            "Unlink")))) : (React.createElement("button", { onClick: handleClick, className: styles["connector-button"], disabled: isConnected },
        icon,
        React.createElement("span", null, name)))));
};
/**
 * The LinkButton component.
 * A button that will open the modal to link or unlink a social account.
 * @param { { variant: ("default"|"icon"), social: ("twitter"|"spotify"|"discord"), theme: ("default"|"camp") } } props The props.
 * @returns { JSX.Element } The LinkButton component.
 */
const LinkButton = ({ variant = "default", social, theme = "default", }) => {
    const { handleOpen } = useLinkModal();
    if (["default", "icon"].indexOf(variant) === -1) {
        throw new Error("Invalid variant, must be 'default' or 'icon'");
    }
    if (constants.AVAILABLE_SOCIALS.indexOf(social) === -1) {
        console.error(`Invalid LinkButton social, must be one of ${constants.AVAILABLE_SOCIALS.join(", ")}`);
        return null;
    }
    if (["default", "camp"].indexOf(theme) === -1) {
        throw new Error("Invalid theme, must be 'default' or 'camp'");
    }
    const { socials } = useSocials();
    const { authenticated } = useAuthState();
    const isLinked = socials && socials[social];
    const handleClick = () => {
        handleOpen(social);
    };
    const Icon = getIconBySocial(social);
    return (React.createElement("button", { disabled: !authenticated, className: `${buttonStyles[`link-button-${variant}`]} 
        ${theme === "default" ? buttonStyles[social] : ""}
      `, onClick: handleClick }, variant === "icon" ? (React.createElement("div", { className: buttonStyles["icon-container"] },
        React.createElement(Icon, null),
        React.createElement("div", { className: `${buttonStyles["camp-logo"]} ${!isLinked ? buttonStyles["not-linked"] : ""}` },
            React.createElement(CampIcon, null)))) : (React.createElement("div", { className: buttonStyles["button-container"] },
        React.createElement("div", { className: `${buttonStyles["camp-logo"]} ${!isLinked ? buttonStyles["not-linked"] : ""}` },
            React.createElement(CampIcon, null)),
        React.createElement("div", { className: buttonStyles["link-icon"] },
            React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor" },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" }))),
        React.createElement("div", { className: buttonStyles["social-icon"] },
            React.createElement(Icon, null))))));
};
/**
 * LoadingBar component to display upload progress.
 * @param { { progress: number } } props The props.
 * @returns { JSX.Element } The LoadingBar component.
 */
const LoadingBar = ({ progress }) => {
    return (React.createElement("div", { className: buttonStyles["loading-bar-container"] },
        React.createElement("div", { className: buttonStyles["loading-bar"], style: { width: `${progress}%` } })));
};
const PercentageSlider = ({ onChange, }) => {
    const [value, setValue] = useState(0);
    const handleChange = (e) => {
        const val = Number(e.target.value);
        setValue(val);
        onChange(val);
    };
    return (React.createElement("div", { className: buttonStyles["percentage-slider"] },
        React.createElement("input", { id: "slider", type: "range", min: "0", max: "100", value: value, onChange: handleChange }),
        React.createElement("label", { htmlFor: "slider" },
            value,
            "%")));
};
/**
 * The FileUpload component.
 * Provides a file upload field with drag-and-drop support.
 * @param { { onFileUpload?: function, accept?: string, maxFileSize?: number } } props The props.
 * @returns { JSX.Element } The FileUpload component.
 */
const FileUpload = ({ onFileUpload, accept, maxFileSize, }) => {
    const auth = useAuth();
    const { uploads } = useOrigin();
    const { refetch } = uploads;
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);
    const { addToast } = useToast();
    const [price, setPrice] = useState(BigInt(0)); // price in wei
    const [royaltyBps, setRoyaltyBps] = useState(0); // royalty basis points (0-10000)
    const [licenseDuration, setLicenseDuration] = useState(Math.floor(60 * 60 * 24 * 30) // 30 days in seconds
    );
    const handleUpload = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (selectedFile) {
            setIsUploading(true);
            try {
                const license = createLicenseTerms(price, // price in wei
                licenseDuration, // duration in seconds
                royaltyBps, // royalty basis points
                zeroAddress // payment token
                );
                const metadata = {
                    name: selectedFile.name,
                    description: `This is a file uploaded by ${auth === null || auth === void 0 ? void 0 : auth.walletAddress}`,
                };
                const res = yield ((_a = auth === null || auth === void 0 ? void 0 : auth.origin) === null || _a === void 0 ? void 0 : _a.mintFile(selectedFile, metadata, license, BigInt(0), {
                    progressCallback(percent) {
                        setUploadProgress(percent);
                    },
                }));
                if (onFileUpload) {
                    onFileUpload([selectedFile]);
                }
                addToast(`File minted successfully. Token ID: ${res}`, "success", 5000);
                refetch();
            }
            catch (error) {
                addToast(`Error minting file: ${error}`, "error", 5000);
                setIsUploading(false);
            }
            finally {
                setSelectedFile(null);
                setIsUploading(false);
                setUploadProgress(0);
            }
        }
    });
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => {
        setIsDragging(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (accept) {
            const acceptedTypes = accept.split(",");
            const invalidFiles = files.filter((file) => !acceptedTypes.some((type) => file.type.match(type.trim())));
            if (invalidFiles.length > 0) {
                addToast(`File not supported. Accepted types: ${accept}`, "error", 5000);
                return;
            }
        }
        const file = files[0];
        if (maxFileSize && file.size > maxFileSize) {
            addToast(`File size exceeds the limit of ${(maxFileSize /
                1024 /
                1024).toPrecision(2)} MB`, "error", 5000);
            return;
        }
        setSelectedFile(file);
    };
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const file = files[0];
            if (maxFileSize && file.size > maxFileSize) {
                addToast(`File size exceeds the limit of ${(maxFileSize /
                    1024 /
                    1024).toPrecision(2)} MB`, "error", 5000);
                return;
            }
            setSelectedFile(file);
        }
    };
    const handleClick = () => {
        var _a;
        (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click();
    };
    const handleRemoveFile = () => {
        setSelectedFile(null);
        fileInputRef.current.value = "";
    };
    const renderFilePreview = () => {
        if (!selectedFile)
            return null;
        if (selectedFile.type.startsWith("image/")) {
            return (React.createElement("img", { src: URL.createObjectURL(selectedFile), alt: "Preview", className: buttonStyles["file-preview"] }));
        }
        if (selectedFile.type.startsWith("audio/")) {
            return (React.createElement("audio", { controls: true, src: URL.createObjectURL(selectedFile), className: buttonStyles["file-preview"] }));
        }
        if (selectedFile.type.startsWith("video/")) {
            return (React.createElement("video", { controls: true, src: URL.createObjectURL(selectedFile), className: buttonStyles["file-preview"] }));
        }
        if (selectedFile.type.startsWith("text/")) {
            return (React.createElement("iframe", { src: URL.createObjectURL(selectedFile), className: buttonStyles["file-preview"], title: "File Preview" }));
        }
        return (React.createElement("p", { className: buttonStyles["file-preview-text"] },
            "File selected: ",
            selectedFile.name));
    };
    return (React.createElement("div", { className: `${buttonStyles["file-upload-container"]} ${isDragging
            ? buttonStyles["dragging"]
            : selectedFile
                ? buttonStyles["file-selected"]
                : ""}`, onDragOver: handleDragOver, onDragLeave: handleDragLeave, onDrop: handleDrop, onClick: !selectedFile ? handleClick : undefined },
        React.createElement("input", { type: "file", accept: accept, className: buttonStyles["file-input"], onChange: handleFileChange, ref: fileInputRef }),
        selectedFile ? (React.createElement("div", { className: buttonStyles["selected-file-container"] },
            renderFilePreview(),
            React.createElement("span", { className: buttonStyles["file-name"] }, selectedFile.name),
            isUploading && React.createElement(LoadingBar, { progress: uploadProgress }),
            React.createElement("div", { className: buttonStyles["price-input-container"] },
                React.createElement("input", { type: "number", placeholder: "Price in wei", className: buttonStyles["price-input"], value: price > 0 ? price.toString() : "", onChange: (e) => {
                        const value = e.target.value;
                        setPrice(value ? BigInt(value) : BigInt(0));
                    } })),
            React.createElement("div", { className: buttonStyles["duration-input-container"] },
                React.createElement("input", { type: "number", placeholder: "License duration (seconds)", className: buttonStyles["duration-input"], value: licenseDuration > 0 ? licenseDuration.toString() : "", onChange: (e) => {
                        const value = e.target.value;
                        setLicenseDuration(value ? Number(value) : 0);
                    } })),
            React.createElement(PercentageSlider, { onChange: (value) => {
                    const royaltyBps = Math.round((value / 100) * 10000);
                    setRoyaltyBps(royaltyBps);
                } }),
            React.createElement("div", { className: buttonStyles["upload-buttons"] },
                React.createElement("button", { className: buttonStyles["remove-file-button"], disabled: isUploading, onClick: handleRemoveFile },
                    React.createElement(BinIcon, { w: "1rem", h: "1rem" })),
                React.createElement("button", { className: buttonStyles["upload-file-button"], onClick: handleUpload, disabled: !selectedFile || isUploading }, "Mint")))) : (React.createElement("p", null,
            "Drag and drop your file here, or click to select a file.",
            React.createElement("br", null),
            accept && (React.createElement("span", { className: buttonStyles["accepted-types"] }, accept
                .split(",")
                .map((type) => type.trim().split("/")[1].replace(/-/g, " "))
                .join(", ")
                .replace("plain", "txt")
                .replace(/, ([^,]*)$/, ", or $1"))),
            React.createElement("br", null),
            maxFileSize && (React.createElement("span", { className: buttonStyles["accepted-types"] },
                "Max size: ",
                (maxFileSize / 1024 / 1024).toPrecision(2),
                " MB"))))));
};

/**
 * The Auth modal component.
 * @param { { setIsVisible: function, wcProvider: object, loading: boolean, onlyWagmi: boolean, defaultProvider: object } } props The props.
 * @returns { JSX.Element } The Auth modal component.
 */
const AuthModal = ({ setIsVisible, wcProvider, loading, onlyWagmi, defaultProvider, }) => {
    const { connect } = useConnect();
    const { setProvider } = useProvider();
    const { auth, wagmiAvailable } = useContext(CampContext);
    const [customProvider, setCustomProvider] = useState(null);
    const providers = useProviders();
    const [customConnector, setCustomConnector] = useState(null);
    const [customAccount, setCustomAccount] = useState(null);
    let wagmiConnectorClient;
    let wagmiAccount;
    if (wagmiAvailable) {
        wagmiConnectorClient = useConnectorClient();
        wagmiAccount = useAccount();
    }
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const handleWalletConnect = (_a) => __awaiter(void 0, [_a], void 0, function* ({ provider }) {
        auth.setLoading(true);
        try {
            if (provider.connected)
                yield provider.disconnect();
            yield provider.connect();
        }
        catch (error) {
            auth.setLoading(false);
        }
    });
    useEffect(() => {
        if (wagmiAvailable && !defaultProvider) {
            setCustomConnector(wagmiConnectorClient);
            setCustomAccount(wagmiAccount);
        }
    }, [
        wagmiAvailable,
        defaultProvider,
        wagmiAccount,
        wagmiConnectorClient === null || wagmiConnectorClient === void 0 ? void 0 : wagmiConnectorClient.data,
    ]);
    useEffect(() => {
        if (defaultProvider && defaultProvider.provider && defaultProvider.info) {
            let addr = defaultProvider.provider.address;
            const acc = {
                connector: Object.assign(Object.assign({}, defaultProvider.info), { icon: defaultProvider.info.icon ||
                        getIconByConnectorName(defaultProvider.info.name) }),
                address: addr,
            };
            if (!addr) {
                defaultProvider.provider
                    .request({
                    method: "eth_requestAccounts",
                })
                    .then((accounts) => {
                    setCustomAccount(Object.assign(Object.assign({}, acc), { address: accounts[0] }));
                });
            }
            else {
                setCustomAccount(acc);
            }
            setCustomProvider(defaultProvider.provider);
        }
    }, [defaultProvider]);
    useEffect(() => {
        if (wagmiAvailable && customConnector) {
            const provider = customConnector.data;
            if (provider) {
                setCustomProvider(provider);
            }
        }
    }, [customConnector, customConnector === null || customConnector === void 0 ? void 0 : customConnector.data, wagmiAvailable, customProvider]);
    useEffect(() => {
        const doConnect = () => __awaiter(void 0, void 0, void 0, function* () {
            handleConnect({
                provider: wcProvider,
                info: { name: "WalletConnect" },
            });
        });
        if (wcProvider) {
            wcProvider.on("connect", doConnect);
        }
        return () => {
            if (wcProvider) {
                wcProvider.off("connect", doConnect);
            }
        };
    }, [wcProvider]);
    const handleConnect = (provider) => {
        var _a, _b;
        if (provider) {
            let addr = null;
            if (((_a = provider === null || provider === void 0 ? void 0 : provider.provider) === null || _a === void 0 ? void 0 : _a.uid) === (customProvider === null || customProvider === void 0 ? void 0 : customProvider.uid)) {
                addr = customAccount === null || customAccount === void 0 ? void 0 : customAccount.address;
            }
            setProvider(Object.assign(Object.assign({}, provider), { address: addr }));
            if (addr) {
                auth.setWalletAddress(addr);
            }
        }
        // necessary for appkit, as it doesn't seem to support the "eth_requestAccounts" method
        if ((customAccount === null || customAccount === void 0 ? void 0 : customAccount.address) &&
            (customProvider === null || customProvider === void 0 ? void 0 : customProvider.uid) &&
            ((_b = provider === null || provider === void 0 ? void 0 : provider.provider) === null || _b === void 0 ? void 0 : _b.uid) === (customProvider === null || customProvider === void 0 ? void 0 : customProvider.uid)) {
            auth.setWalletAddress(customAccount === null || customAccount === void 0 ? void 0 : customAccount.address);
        }
        connect();
    };
    return (React.createElement("div", { className: styles["outer-container"] },
        React.createElement("div", { className: `${styles.container} ${styles["linking-container"]}` },
            React.createElement("div", { className: styles["close-button"], onClick: () => setIsVisible(false) },
                React.createElement(CloseIcon, null)),
            React.createElement("div", { className: styles["auth-header"] },
                React.createElement("div", { className: styles["modal-icon"] },
                    React.createElement(CampIcon, null)),
                React.createElement("span", null, "Connect to Origin")),
            React.createElement("div", { className: `${(customAccount === null || customAccount === void 0 ? void 0 : customAccount.connector) ? styles["big"] : ""} ${styles["provider-list"]}` },
                (customAccount === null || customAccount === void 0 ? void 0 : customAccount.connector) && (React.createElement(React.Fragment, null,
                    React.createElement(ProviderButton, { provider: {
                            provider: customProvider || window.ethereum,
                            info: {
                                name: customAccount.connector.name,
                                icon: customAccount.connector.icon ||
                                    getIconByConnectorName(customAccount.connector.name),
                            },
                        }, label: formatAddress(customAccount.address), handleConnect: handleConnect, loading: loading }),
                    (providers.length || wcProvider || window.ethereum) &&
                        !onlyWagmi &&
                        !(defaultProvider === null || defaultProvider === void 0 ? void 0 : defaultProvider.exclusive) && (React.createElement("div", { className: styles["divider"] })))),
                !onlyWagmi &&
                    !(defaultProvider === null || defaultProvider === void 0 ? void 0 : defaultProvider.exclusive) &&
                    providers.map((provider) => (React.createElement(ProviderButton, { provider: provider, handleConnect: handleConnect, loading: loading, key: provider.info.uuid }))),
                !onlyWagmi && !(defaultProvider === null || defaultProvider === void 0 ? void 0 : defaultProvider.exclusive) && wcProvider && (React.createElement(ProviderButton, { provider: {
                        provider: wcProvider,
                        info: {
                            name: "WalletConnect",
                            icon: "data:image/svg+xml,%3Csvg fill='%233B99FC' role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.913 7.519c3.915-3.831 10.26-3.831 14.174 0l.471.461a.483.483 0 0 1 0 .694l-1.611 1.577a.252.252 0 0 1-.354 0l-.649-.634c-2.73-2.673-7.157-2.673-9.887 0l-.694.68a.255.255 0 0 1-.355 0L4.397 8.719a.482.482 0 0 1 0-.693l.516-.507Zm17.506 3.263 1.434 1.404a.483.483 0 0 1 0 .694l-6.466 6.331a.508.508 0 0 1-.709 0l-4.588-4.493a.126.126 0 0 0-.178 0l-4.589 4.493a.508.508 0 0 1-.709 0L.147 12.88a.483.483 0 0 1 0-.694l1.434-1.404a.508.508 0 0 1 .709 0l4.589 4.493c.05.048.129.048.178 0l4.589-4.493a.508.508 0 0 1 .709 0l4.589 4.493c.05.048.128.048.178 0l4.589-4.493a.507.507 0 0 1 .708 0Z'/%3E%3C/svg%3E",
                        },
                    }, handleConnect: handleWalletConnect, loading: loading })),
                !onlyWagmi && !(defaultProvider === null || defaultProvider === void 0 ? void 0 : defaultProvider.exclusive) && window.ethereum && (React.createElement(ProviderButton, { provider: {
                        provider: window.ethereum,
                        info: {
                            name: "Browser Wallet",
                        },
                    }, label: "window.ethereum", handleConnect: handleConnect, loading: loading }))),
            React.createElement("a", { href: "https://campnetwork.xyz", className: styles["footer-text"], target: "_blank", rel: "noopener noreferrer" }, "Powered by Camp Network"))));
};
/**
 * The CampModal component.
 * @param { { injectButton?: boolean, wcProjectId?: string, onlyWagmi?: boolean, defaultProvider?: object } } props The props.
 * @returns { JSX.Element } The CampModal component.
 */
const CampModal = ({ injectButton = true, wcProjectId, onlyWagmi = false, defaultProvider, }) => {
    // const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const { auth } = useContext(CampContext);
    const { authenticated, loading } = useAuthState();
    const { isVisible, setIsVisible, isButtonDisabled, setIsButtonDisabled } = useContext(ModalContext);
    const { isLinkingVisible } = useContext(ModalContext);
    const { provider } = useProvider();
    const providers = useProviders();
    const { wagmiAvailable } = useContext(CampContext);
    let customAccount;
    if (wagmiAvailable) {
        customAccount = useAccount();
    }
    const walletConnectProvider = wcProjectId
        ? useWalletConnectProvider(wcProjectId)
        : null;
    const handleModalButton = () => {
        setIsVisible(true);
    };
    useEffect(() => {
        if (authenticated) {
            if (isVisible) {
                setIsVisible(false);
            }
        }
    }, [authenticated]);
    useEffect(() => {
        const recoverProvider = () => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            try {
                if (auth) {
                    if (defaultProvider && defaultProvider.provider) {
                        const provider = defaultProvider.provider;
                        const [address] = yield provider.request({
                            method: "eth_requestAccounts",
                        });
                        if (address.toLowerCase() === ((_a = auth.walletAddress) === null || _a === void 0 ? void 0 : _a.toLowerCase())) {
                            auth.setProvider(Object.assign(Object.assign({}, defaultProvider), { address }));
                        }
                        else {
                            console.error("Address mismatch. Default provider address does not match authenticated address.");
                        }
                    }
                    else if (walletConnectProvider) {
                        const [address] = yield walletConnectProvider.request({
                            method: "eth_requestAccounts",
                        });
                        if (address.toLowerCase() === ((_b = auth.walletAddress) === null || _b === void 0 ? void 0 : _b.toLowerCase())) {
                            auth.setProvider({
                                provider: walletConnectProvider,
                                info: {
                                    name: "WalletConnect",
                                },
                                address,
                            });
                        }
                        else {
                            console.error("Address mismatch. WalletConnect provider address does not match authenticated address.");
                        }
                    }
                }
            }
            catch (error) {
                console.error("Error recovering provider:", error);
            }
        });
        if (authenticated) {
            recoverProvider();
        }
    }, [authenticated, defaultProvider, defaultProvider === null || defaultProvider === void 0 ? void 0 : defaultProvider.provider, auth]);
    // Cases where the button should be disabled
    useEffect(() => {
        const noProvider = !provider.provider;
        const noWagmiOrAccount = !wagmiAvailable || !(customAccount === null || customAccount === void 0 ? void 0 : customAccount.isConnected);
        const noWalletConnectProvider = !walletConnectProvider;
        const noProviders = !providers.length;
        const onlyWagmiNoAccount = onlyWagmi && !(customAccount === null || customAccount === void 0 ? void 0 : customAccount.isConnected);
        const noDefaultProvider = !defaultProvider || !defaultProvider.provider;
        const defaultProviderExclusive = defaultProvider === null || defaultProvider === void 0 ? void 0 : defaultProvider.exclusive;
        const noAvailableProviders = noProvider &&
            noWagmiOrAccount &&
            noWalletConnectProvider &&
            noProviders &&
            noDefaultProvider;
        const shouldDisableButton = (noAvailableProviders ||
            onlyWagmiNoAccount ||
            (noDefaultProvider && defaultProviderExclusive)) &&
            !authenticated;
        setIsButtonDisabled(shouldDisableButton);
    }, [
        provider,
        wagmiAvailable,
        customAccount,
        walletConnectProvider,
        providers,
        authenticated,
        defaultProvider,
    ]);
    return (React.createElement(ClientOnly, null,
        React.createElement("div", null,
            injectButton && (React.createElement(CampButton, { disabled: isButtonDisabled, onClick: handleModalButton, authenticated: authenticated })),
            React.createElement(ReactPortal, { wrapperId: "camp-modal-wrapper" },
                isLinkingVisible && React.createElement(LinkingModal, null),
                isVisible && (React.createElement("div", { className: styles.modal, onClick: (e) => {
                        if (e.target === e.currentTarget) {
                            setIsVisible(false);
                        }
                    } }, authenticated ? (React.createElement(MyCampModal, { wcProvider: walletConnectProvider })) : (React.createElement(AuthModal, { setIsVisible: setIsVisible, wcProvider: walletConnectProvider, loading: loading, onlyWagmi: onlyWagmi, defaultProvider: defaultProvider }))))))));
};
/**
 * The TikTokFlow component. Handles linking and unlinking of TikTok accounts.
 * @returns { JSX.Element } The TikTokFlow component.
 */
const TikTokFlow = () => {
    const { setIsLinkingVisible, currentlyLinking } = useContext(ModalContext);
    const { socials, refetch, isLoading: isSocialsLoading } = useSocials();
    const { auth } = useContext(CampContext);
    const [IsLoading, setIsLoading] = useState(false);
    const [handleInput, setHandleInput] = useState("");
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const resetState = () => {
        setIsLoading(false);
        setIsLinkingVisible(false);
        setHandleInput("");
    };
    const handleLink = () => __awaiter(void 0, void 0, void 0, function* () {
        if (isSocialsLoading)
            return;
        setIsLoading(true);
        if (socials[currentlyLinking]) {
            try {
                yield auth.unlinkTikTok();
            }
            catch (error) {
                resetState();
                console.error(error);
                return;
            }
        }
        else {
            if (!handleInput)
                return;
            try {
                yield auth.linkTikTok(handleInput);
            }
            catch (error) {
                resetState();
                console.error(error);
                return;
            }
        }
        refetch();
        resetState();
    });
    return (React.createElement("div", null,
        React.createElement("div", { className: styles["linking-text"] }, currentlyLinking && socials[currentlyLinking] ? (React.createElement("div", null,
            "Your ",
            capitalize(currentlyLinking),
            " account is currently linked.")) : (React.createElement("div", null,
            React.createElement("b", null, window.location.host),
            " is requesting to link your",
            " ",
            capitalize(currentlyLinking),
            " account.",
            React.createElement("div", null,
                React.createElement("input", { value: handleInput, onChange: (e) => setHandleInput(e.target.value), type: "text", placeholder: "Enter your TikTok username", className: styles["tiktok-input"] }))))),
        React.createElement("button", { className: styles["linking-button"], onClick: handleLink, disabled: IsLoading }, !IsLoading ? (currentlyLinking && socials[currentlyLinking] ? ("Unlink") : ("Link")) : (React.createElement("div", { className: styles.spinner })))));
};
/**
 * The OTPInput component. Handles OTP input with customizable number of inputs.
 * @param { { numInputs: number, onChange: function } } props The props.
 * @returns { JSX.Element } The OTPInput component.
 */
const OTPInput = ({ numInputs, onChange }) => {
    const [otp, setOtp] = useState(Array(numInputs).fill(""));
    const inputRefs = useRef([]);
    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value))
            return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        onChange(newOtp.join(""));
        if (value && index < numInputs - 1) {
            inputRefs.current[index + 1].focus();
        }
    };
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };
    const handleFocus = (e) => e.target.select();
    return (React.createElement("div", { className: styles["otp-input-container"] }, otp.map((_, index) => (React.createElement("input", { key: index, ref: (el) => {
            inputRefs.current[index] = el;
        }, type: "text", maxLength: 1, value: otp[index], onChange: (e) => handleChange(e.target.value, index), onKeyDown: (e) => handleKeyDown(e, index), onFocus: handleFocus, className: styles["otp-input"] })))));
};
/**
 * The TelegramFlow component. Handles linking and unlinking of Telegram accounts.
 * @returns { JSX.Element } The TelegramFlow component.
 */
const TelegramFlow = () => {
    const { setIsLinkingVisible, currentlyLinking } = useContext(ModalContext);
    const { socials, refetch, isLoading: isSocialsLoading } = useSocials();
    const { auth } = useContext(CampContext);
    const [IsLoading, setIsLoading] = useState(false);
    const [phoneInput, setPhoneInput] = useState("");
    const [otpInput, setOtpInput] = useState("");
    const [phoneCodeHash, setPhoneCodeHash] = useState("");
    const [isOTPSent, setIsOTPSent] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(true);
    const { addToast: toast } = useToast();
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const resetState = () => {
        setIsLoading(false);
        setPhoneInput("");
        setOtpInput("");
    };
    const handlePhoneInput = (e) => {
        setPhoneInput(e.target.value);
        setIsPhoneValid(verifyPhoneNumber(e.target.value) || !e.target.value);
    };
    const verifyPhoneNumber = (phone) => {
        const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
        return phoneRegex.test(phone.replace(/\s/g, "").replace(/[-()]/g, ""));
    };
    const handleAction = () => __awaiter(void 0, void 0, void 0, function* () {
        if (isSocialsLoading)
            return;
        if (isOTPSent) {
            if (!otpInput)
                return;
            setIsLoading(true);
            try {
                yield auth.linkTelegram(phoneInput, otpInput, phoneCodeHash);
                refetch();
                resetState();
                setIsLinkingVisible(false);
            }
            catch (error) {
                resetState();
                console.error(error);
                return;
            }
        }
        else {
            if (!verifyPhoneNumber(phoneInput)) {
                toast("Invalid phone number, it should be in the format +1234567890", "warning", 5000);
                return;
            }
            setIsLoading(true);
            try {
                const res = yield auth.sendTelegramOTP(phoneInput);
                setIsOTPSent(true);
                setIsLoading(false);
                setPhoneCodeHash(res.phone_code_hash);
            }
            catch (error) {
                resetState();
                console.error(error);
                return;
            }
        }
    });
    return (React.createElement("div", null,
        React.createElement("div", { className: styles["linking-text"] }, currentlyLinking && socials[currentlyLinking] ? (React.createElement("div", null,
            "Your ",
            capitalize(currentlyLinking),
            " account is currently linked.")) : (React.createElement("div", null, isOTPSent ? (React.createElement("div", null,
            React.createElement("span", null, "Enter the OTP sent to your phone number."),
            React.createElement("div", null,
                React.createElement(OTPInput, { numInputs: 5, onChange: setOtpInput })))) : (React.createElement("div", null,
            React.createElement("b", null, window.location.host),
            " is requesting to link your",
            " ",
            capitalize(currentlyLinking),
            " account. ",
            React.createElement("br", null),
            React.createElement("span", null, "This will only work if you have 2FA disabled on your Telegram account."),
            React.createElement("div", null,
                React.createElement("input", { value: phoneInput, onChange: handlePhoneInput, type: "tel", placeholder: "Enter your phone number", className: `${styles["tiktok-input"]} ${!isPhoneValid ? styles["invalid"] : ""}` }))))))),
        React.createElement("button", { className: styles["linking-button"], onClick: handleAction, disabled: IsLoading ||
                (!isPhoneValid && !isOTPSent) ||
                (!phoneInput && !isOTPSent) ||
                (isOTPSent && otpInput.length < 5) }, !IsLoading ? (currentlyLinking && socials[currentlyLinking] ? ("Unlink") : isOTPSent ? ("Link") : ("Send OTP")) : (React.createElement("div", { className: styles.spinner })))));
};
/**
 * The BasicFlow component. Handles linking and unlinking of socials through redirecting to the appropriate OAuth flow.
 * @returns { JSX.Element } The BasicFlow component.
 */
const BasicFlow = () => {
    const { setIsLinkingVisible, currentlyLinking } = useContext(ModalContext);
    const { socials, refetch, isLoading: isSocialsLoading } = useSocials();
    const { auth } = useContext(CampContext);
    const [isUnlinking, setIsUnlinking] = useState(false);
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const handleLink = () => __awaiter(void 0, void 0, void 0, function* () {
        if (isSocialsLoading)
            return;
        if (socials[currentlyLinking]) {
            setIsUnlinking(true);
            try {
                yield auth[`unlink${capitalize(currentlyLinking)}`]();
            }
            catch (error) {
                setIsUnlinking(false);
                setIsLinkingVisible(false);
                console.error(error);
                return;
            }
            refetch();
            setIsLinkingVisible(false);
            setIsUnlinking(false);
        }
        else {
            try {
                yield auth[`link${capitalize(currentlyLinking)}`]();
            }
            catch (error) {
                setIsLinkingVisible(false);
                console.error(error);
                return;
            }
        }
    });
    return (React.createElement("div", null,
        React.createElement("div", { className: styles["linking-text"] }, currentlyLinking && socials[currentlyLinking] ? (React.createElement("div", null,
            "Your ",
            capitalize(currentlyLinking),
            " account is currently linked.")) : (React.createElement("div", null,
            React.createElement("b", null, window.location.host),
            " is requesting to link your",
            " ",
            capitalize(currentlyLinking),
            " account."))),
        React.createElement("button", { className: styles["linking-button"], onClick: handleLink, disabled: isUnlinking }, !isUnlinking ? (currentlyLinking && socials[currentlyLinking] ? ("Unlink") : ("Link")) : (React.createElement("div", { className: styles.spinner })))));
};
/**
 * The LinkingModal component. Handles the linking and unlinking of socials.
 * @returns { JSX.Element } The LinkingModal component.
 */
const LinkingModal = () => {
    const { isLoading: isSocialsLoading } = useSocials();
    const { setIsLinkingVisible, currentlyLinking } = useContext(ModalContext);
    const [flow, setFlow] = useState("basic");
    useEffect(() => {
        if (["twitter", "discord", "spotify"].includes(currentlyLinking)) {
            setFlow("basic");
        }
        else if (currentlyLinking === "tiktok") {
            setFlow("tiktok");
        }
        else if (currentlyLinking === "telegram") {
            setFlow("telegram");
        }
    }, [currentlyLinking]);
    const Icon = getIconBySocial(currentlyLinking);
    return (React.createElement("div", { className: styles.modal, onClick: (e) => {
            if (e.target === e.currentTarget) {
                setIsLinkingVisible(false);
            }
        }, style: {
            zIndex: 86,
        } },
        React.createElement("div", { className: styles["outer-container"] },
            React.createElement("div", { className: `${styles.container} ${styles["linking-container"]}` },
                React.createElement("div", { className: styles["close-button"], onClick: () => setIsLinkingVisible(false) },
                    React.createElement(CloseIcon, null)),
                isSocialsLoading ? (React.createElement("div", { style: {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "4rem",
                        marginBottom: "1rem",
                    } },
                    React.createElement("div", { className: styles.spinner, style: {
                            marginRight: "auto",
                        } }))) : (React.createElement("div", null,
                    React.createElement("div", { className: styles.header },
                        React.createElement("div", { className: styles["small-modal-icon"] },
                            React.createElement(Icon, null))),
                    flow === "basic" && React.createElement(BasicFlow, null),
                    flow === "tiktok" && React.createElement(TikTokFlow, null),
                    flow === "telegram" && React.createElement(TelegramFlow, null))),
                React.createElement("a", { href: "https://campnetwork.xyz", className: styles["footer-text"], target: "_blank", rel: "noopener noreferrer", style: { marginTop: 0 } }, "Powered by Camp Network")))));
};
/**
 * The OriginSection component. Displays the Origin status, royalty multiplier, and royalty credits.
 * @returns { JSX.Element } The OriginSection component.
 */
const OriginSection = () => {
    const { stats, uploads } = useOrigin();
    const [isOriginAuthorized, setIsOriginAuthorized] = useState(true);
    const [royaltyMultiplier, setRoyaltyMultiplier] = useState(1);
    const [royaltyCredits, setRoyaltyCredits] = useState(0);
    const [uploadedImages, setUploadedImages] = useState(0);
    const [uploadedVideos, setUploadedVideos] = useState(0);
    const [uploadedAudio, setUploadedAudio] = useState(0);
    const [uploadedText, setUploadedText] = useState(0);
    useEffect(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (!stats.isLoading && !stats.isError) {
            setIsOriginAuthorized((_d = (_c = (_b = (_a = stats.data) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.user) === null || _c === void 0 ? void 0 : _c.active) !== null && _d !== void 0 ? _d : true);
            setRoyaltyMultiplier((_h = (_g = (_f = (_e = stats.data) === null || _e === void 0 ? void 0 : _e.data) === null || _f === void 0 ? void 0 : _f.user) === null || _g === void 0 ? void 0 : _g.multiplier) !== null && _h !== void 0 ? _h : 1);
            setRoyaltyCredits((_m = (_l = (_k = (_j = stats.data) === null || _j === void 0 ? void 0 : _j.data) === null || _k === void 0 ? void 0 : _k.user) === null || _l === void 0 ? void 0 : _l.points) !== null && _m !== void 0 ? _m : 0);
        }
        if (stats.isError) {
            setIsOriginAuthorized(true);
            setRoyaltyMultiplier(1);
            setRoyaltyCredits(0);
        }
    }, [stats.data, stats.isError, stats.isLoading]);
    useEffect(() => {
        if (uploads.data) {
            let imagesCount = 0;
            let videosCount = 0;
            let audioCount = 0;
            let textCount = 0;
            uploads.data.forEach((upload) => {
                if (upload.type.startsWith("image")) {
                    imagesCount++;
                }
                else if (upload.type.startsWith("video")) {
                    videosCount++;
                }
                else if (upload.type.startsWith("audio")) {
                    audioCount++;
                }
                else if (upload.type.startsWith("text")) {
                    textCount++;
                }
            });
            setUploadedImages(imagesCount);
            setUploadedVideos(videosCount);
            setUploadedAudio(audioCount);
            setUploadedText(textCount);
        }
    }, [uploads.data]);
    return stats.isLoading ? (React.createElement("div", { style: { marginTop: "1rem", marginBottom: "1rem", flex: 1 } },
        React.createElement("div", { className: styles.spinner }))) : (React.createElement("div", { className: styles["origin-wrapper"] },
        React.createElement("div", { className: styles["origin-section"] },
            React.createElement(Tooltip, { content: isOriginAuthorized ? "Origin Authorized" : "Origin Unauthorized", position: "top", containerStyle: { width: "100%" } },
                React.createElement("div", { className: styles["origin-container"] },
                    React.createElement("span", null, isOriginAuthorized ? (React.createElement(CheckMarkIcon, { w: "1.2rem", h: "1.2rem" })) : (React.createElement(XMarkIcon, { w: "1.2rem", h: "1.2rem" }))),
                    React.createElement("span", { className: styles["origin-label"] }, isOriginAuthorized ? "Authorized" : "Unauthorized"))),
            React.createElement("div", { className: styles["divider"] }),
            React.createElement(Tooltip, { content: `Royalty Credits: ${royaltyCredits.toLocaleString()}`, position: "top", containerStyle: { width: "100%" } },
                React.createElement("div", { className: styles["origin-container"] },
                    React.createElement("span", null, formatCampAmount(royaltyCredits)),
                    React.createElement("span", { className: styles["origin-label"] }, "Credits")))),
        React.createElement("div", { className: styles["origin-section"] },
            React.createElement(Tooltip, { content: `Images uploaded: ${uploadedImages.toLocaleString()}`, position: "top", containerStyle: { width: "100%" } },
                React.createElement("div", { className: styles["origin-container"] },
                    React.createElement("span", null, formatCampAmount(uploadedImages)),
                    React.createElement("span", { className: styles["origin-label"] }, "Images"))),
            React.createElement("div", { className: styles["divider"] }),
            React.createElement(Tooltip, { content: `Audio uploaded: ${uploadedAudio.toLocaleString()}`, position: "top", containerStyle: { width: "100%" } },
                React.createElement("div", { className: styles["origin-container"] },
                    React.createElement("span", null, formatCampAmount(uploadedAudio)),
                    React.createElement("span", { className: styles["origin-label"] }, "Audio"))),
            React.createElement("div", { className: styles["divider"] }),
            React.createElement(Tooltip, { content: `Videos uploaded: ${uploadedVideos.toLocaleString()}`, position: "top", containerStyle: { width: "100%" } },
                React.createElement("div", { className: styles["origin-container"] },
                    React.createElement("span", null, formatCampAmount(uploadedVideos)),
                    React.createElement("span", { className: styles["origin-label"] }, "Videos"))),
            React.createElement("div", { className: styles["divider"] }),
            React.createElement(Tooltip, { content: `Text uploaded: ${uploadedText.toLocaleString()}`, position: "top", containerStyle: { width: "100%" } },
                React.createElement("div", { className: styles["origin-container"] },
                    React.createElement("span", null, formatCampAmount(uploadedText)),
                    React.createElement("span", { className: styles["origin-label"] }, "Text"))))));
};
/**
 * The MyCampModal component.
 * @param { { wcProvider: object } } props The props.
 * @returns { JSX.Element } The MyCampModal component.
 */
const MyCampModal = ({ wcProvider, }) => {
    const { auth } = useContext(CampContext);
    const { setIsVisible: setIsVisible } = useContext(ModalContext);
    const { disconnect } = useConnect();
    const { socials, isLoading, refetch } = useSocials();
    const [isLoadingSocials, setIsLoadingSocials] = useState(true);
    const { linkTiktok, linkTelegram } = useLinkModal();
    const [activeTab, setActiveTab] = useState("socials");
    const { provider } = useProvider();
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const handleDisconnect = () => {
        wcProvider === null || wcProvider === void 0 ? void 0 : wcProvider.disconnect();
        disconnect();
        setIsVisible(false);
    };
    useEffect(() => {
        if (socials)
            setIsLoadingSocials(false);
    }, [socials]);
    const connectedSocials = [
        {
            name: "Discord",
            link: auth.linkDiscord.bind(auth),
            unlink: auth.unlinkDiscord.bind(auth),
            isConnected: socials === null || socials === void 0 ? void 0 : socials.discord,
            icon: React.createElement(DiscordIcon, null),
        },
        {
            name: "Twitter",
            link: auth.linkTwitter.bind(auth),
            unlink: auth.unlinkTwitter.bind(auth),
            isConnected: socials === null || socials === void 0 ? void 0 : socials.twitter,
            icon: React.createElement(TwitterIcon, null),
        },
        {
            name: "Spotify",
            link: auth.linkSpotify.bind(auth),
            unlink: auth.unlinkSpotify.bind(auth),
            isConnected: socials === null || socials === void 0 ? void 0 : socials.spotify,
            icon: React.createElement(SpotifyIcon, null),
        },
        {
            name: "TikTok",
            link: linkTiktok,
            unlink: auth.unlinkTikTok.bind(auth),
            isConnected: socials === null || socials === void 0 ? void 0 : socials.tiktok,
            icon: React.createElement(TikTokIcon, null),
        },
        {
            name: "Telegram",
            link: linkTelegram,
            unlink: auth.unlinkTelegram.bind(auth),
            isConnected: socials === null || socials === void 0 ? void 0 : socials.telegram,
            icon: React.createElement(TelegramIcon, null),
        },
    ].filter((social) => constants.AVAILABLE_SOCIALS.includes(social.name.toLowerCase()));
    const connected = connectedSocials.filter((social) => social.isConnected);
    const notConnected = connectedSocials.filter((social) => !social.isConnected);
    return (React.createElement("div", { className: styles["outer-container"] },
        React.createElement("div", { className: styles.container },
            React.createElement("div", { className: styles["close-button"], onClick: () => setIsVisible(false) },
                React.createElement(CloseIcon, null)),
            React.createElement("div", { className: styles.header },
                React.createElement("span", null, "My Origin"),
                React.createElement("span", { className: styles["wallet-address"] }, formatAddress(auth.walletAddress, 6))),
            React.createElement("div", { className: styles["vertical-tabs-container"] },
                React.createElement("div", { className: styles["vertical-tabs"] },
                    React.createElement(TabButton, { label: "Stats", isActive: activeTab === "origin", onClick: () => setActiveTab("origin") }),
                    React.createElement(TabButton, { label: "Socials", isActive: activeTab === "socials", onClick: () => setActiveTab("socials") }),
                    React.createElement(TabButton, { label: "Images", isActive: activeTab === "images", onClick: () => setActiveTab("images") }),
                    React.createElement(TabButton, { label: "Audio", isActive: activeTab === "audio", onClick: () => setActiveTab("audio") }),
                    React.createElement(TabButton, { label: "Videos", isActive: activeTab === "videos", onClick: () => setActiveTab("videos") }),
                    React.createElement(TabButton, { label: "Text", isActive: activeTab === "text", onClick: () => setActiveTab("text") })),
                React.createElement("div", { className: styles["vertical-tab-content"] },
                    activeTab === "origin" && React.createElement(OriginTab, null),
                    activeTab === "socials" && (React.createElement(SocialsTab, { connectedSocials: connected, notConnectedSocials: notConnected, refetch: refetch, isLoading: isLoading, isLoadingSocials: isLoadingSocials })),
                    activeTab === "images" && React.createElement(ImagesTab, null),
                    activeTab === "audio" && React.createElement(AudioTab, null),
                    activeTab === "videos" && React.createElement(VideosTab, null),
                    activeTab === "text" && React.createElement(TextTab, null))),
            !provider.provider && (React.createElement("button", { className: styles["no-provider-warning"], onClick: () => auth.recoverProvider(), style: { cursor: "pointer" }, type: "button" },
                "Click to try reconnecting your wallet. ",
                React.createElement("br", null),
                "If this doesn't work, please disconnect and connect again.")),
            React.createElement("button", { className: styles["disconnect-button"], onClick: handleDisconnect }, "Disconnect"),
            React.createElement("a", { href: "https://campnetwork.xyz", className: styles["footer-text"], target: "_blank", rel: "noopener noreferrer", style: { marginTop: 0 } }, "Powered by Camp Network"))));
};
const TabContent = ({ children, className, requiresProvider = false, }) => {
    const { provider } = useProvider();
    const isProviderAvailable = provider === null || provider === void 0 ? void 0 : provider.provider;
    return (React.createElement("div", { className: className, style: { position: "relative" } },
        requiresProvider && !isProviderAvailable && (React.createElement("div", { className: styles["tab-provider-required-overlay"] }, "You need to connect your wallet to use this feature.")),
        children));
};
const OriginTab = () => {
    return (React.createElement(TabContent, { className: styles["origin-tab"] },
        React.createElement(OriginSection, null),
        React.createElement(GoToOriginDashboard, null)));
};
const SocialsTab = ({ connectedSocials, notConnectedSocials, refetch, isLoading, isLoadingSocials, }) => {
    return (React.createElement(TabContent, { className: styles["socials-wrapper"] }, isLoading || isLoadingSocials ? (React.createElement("div", { className: styles.spinner, style: {
            margin: "auto",
            marginTop: "6rem",
            marginBottom: "6rem",
        } })) : (React.createElement(React.Fragment, null,
        React.createElement("div", { className: styles["socials-container"] },
            React.createElement("h3", null, "Not Linked"),
            notConnectedSocials.map((social) => (React.createElement(ConnectorButton, { key: social.name, name: social.name, link: social.link, unlink: social.unlink, isConnected: !!social.isConnected, refetch: refetch, icon: social.icon }))),
            notConnectedSocials.length === 0 && (React.createElement("span", { className: styles["no-socials"] }, "You've linked all your socials!"))),
        React.createElement("div", { className: styles["socials-container"] },
            React.createElement("h3", null, "Linked"),
            connectedSocials.map((social) => (React.createElement(ConnectorButton, { key: social.name, name: social.name, link: social.link, unlink: social.unlink, isConnected: !!social.isConnected, refetch: refetch, icon: social.icon }))),
            connectedSocials.length === 0 && (React.createElement("span", { className: styles["no-socials"] }, "You have no socials linked.")))))));
};
const ImagesTab = () => {
    const { uploads } = useOrigin();
    const { isLoading } = uploads;
    return (React.createElement(TabContent, { requiresProvider: true, className: styles["ip-tab-container"] },
        React.createElement(FileUpload, { accept: constants.SUPPORTED_IMAGE_FORMATS.join(","), maxFileSize: 1.049e7 }),
        React.createElement("div", { className: styles["ip-tab-content"] }, isLoading ? (React.createElement("div", { className: styles.spinner, style: { marginRight: "auto" } })) : null),
        React.createElement(GoToOriginDashboard, { text: "Manage on Origin Dashboard" })));
};
const AudioTab = () => {
    const { uploads } = useOrigin();
    const { isLoading } = uploads;
    return (React.createElement(TabContent, { requiresProvider: true, className: styles["ip-tab-container"] },
        React.createElement(FileUpload, { accept: constants.SUPPORTED_AUDIO_FORMATS.join(","), maxFileSize: 1.573e7 }),
        React.createElement("div", { className: styles["ip-tab-content"] }, isLoading ? (React.createElement("div", { className: styles.spinner, style: { marginRight: "auto" } })) : null),
        React.createElement(GoToOriginDashboard, { text: "Manage on Origin Dashboard" })));
};
const VideosTab = () => {
    const { uploads } = useOrigin();
    const { isLoading } = uploads;
    return (React.createElement(TabContent, { requiresProvider: true, className: styles["ip-tab-container"] },
        React.createElement(FileUpload, { accept: constants.SUPPORTED_VIDEO_FORMATS.join(","), maxFileSize: 2.097e7 }),
        React.createElement("div", { className: styles["ip-tab-content"] }, isLoading ? (React.createElement("div", { className: styles.spinner, style: { marginRight: "auto" } })) : null),
        React.createElement(GoToOriginDashboard, { text: "Manage on Origin Dashboard" })));
};
const TextTab = () => {
    const { uploads } = useOrigin();
    const { isLoading } = uploads;
    return (React.createElement(TabContent, { requiresProvider: true, className: styles["ip-tab-container"] },
        React.createElement(FileUpload, { accept: constants.SUPPORTED_TEXT_FORMATS.join(","), maxFileSize: 1.049e7 }),
        React.createElement("div", { className: styles["ip-tab-content"] }, isLoading ? (React.createElement("div", { className: styles.spinner, style: { marginRight: "auto" } })) : null),
        React.createElement(GoToOriginDashboard, { text: "Manage on Origin Dashboard" })));
};

const isBrowser = typeof window !== "undefined";
const getAuthProperties = (auth) => {
    const prototype = Object.getPrototypeOf(auth);
    const properties = Object.getOwnPropertyNames(prototype);
    const object = {};
    for (const property of properties) {
        if (typeof auth[property] === "function") {
            object[property] = auth[property].bind(auth);
        }
    }
    return object;
};
const getAuthVariables = (auth) => {
    const variables = Object.keys(auth);
    const object = {};
    for (const variable of variables) {
        object[variable] = auth[variable];
    }
    return object;
};
/**
 * Returns the Auth instance provided by the context.
 * @returns { Auth } The Auth instance provided by the context.
 * @example
 * const auth = useAuth();
 * auth.connect();
 */
const useAuth = () => {
    if (!isBrowser) {
        return {};
    }
    const { auth } = useContext(CampContext);
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const [authProperties, setAuthProperties] = useState(getAuthProperties(auth));
    const [authVariables, setAuthVariables] = useState(getAuthVariables(auth));
    const updateAuth = () => {
        setAuthVariables(getAuthVariables(auth));
        setAuthProperties(getAuthProperties(auth));
    };
    useEffect(() => {
        if (!isBrowser) {
            return;
        }
        auth.on("state", updateAuth);
        auth.on("provider", updateAuth);
    }, [auth]);
    return Object.assign(Object.assign({}, authVariables), authProperties);
};
/**
 * Returns the functions to link and unlink socials.
 * @returns { { linkTwitter: function, unlinkTwitter: function, linkDiscord: function, unlinkDiscord: function, linkSpotify: function, unlinkSpotify: function } } The functions to link and unlink socials.
 * @example
 * const { linkTwitter, unlinkTwitter, linkDiscord, unlinkDiscord, linkSpotify, unlinkSpotify } = useLinkSocials();
 * linkTwitter();
 */
const useLinkSocials = () => {
    const { auth } = useContext(CampContext);
    if (!auth) {
        return {};
    }
    const prototype = Object.getPrototypeOf(auth);
    const linkingProps = Object.getOwnPropertyNames(prototype).filter((prop) => (prop.startsWith("link") || prop.startsWith("unlink")) &&
        (constants.AVAILABLE_SOCIALS.includes(prop.slice(4).toLowerCase()) ||
            constants.AVAILABLE_SOCIALS.includes(prop.slice(6).toLowerCase())));
    const linkingFunctions = linkingProps.reduce((acc, prop) => {
        acc[prop] = auth[prop].bind(auth);
        return acc;
    }, {
        sendTelegramOTP: auth.sendTelegramOTP.bind(auth),
    });
    return linkingFunctions;
};
/**
 * Fetches the provider from the context and sets the provider in the auth instance.
 * @returns { { provider: { provider: string, info: { name: string } }, setProvider: function } } The provider and a function to set the provider.
 */
const useProvider = () => {
    var _a, _b, _c;
    if (!isBrowser) {
        return {
            provider: { provider: null, info: { name: "" } },
            setProvider: () => { },
        };
    }
    const { auth } = useContext(CampContext);
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const [provider, setProvider] = useState({
        provider: isBrowser ? (_a = auth.viem) === null || _a === void 0 ? void 0 : _a.transport : null,
        info: { name: isBrowser ? (_c = (_b = auth.viem) === null || _b === void 0 ? void 0 : _b.transport) === null || _c === void 0 ? void 0 : _c.name : "" },
    });
    useEffect(() => {
        if (isBrowser) {
            auth.on("provider", ({ provider, info }) => {
                setProvider({ provider, info });
            });
        }
    }, [auth]);
    const authSetProvider = auth.setProvider.bind(auth);
    return { provider, setProvider: authSetProvider };
};
/**
 * Returns the authenticated state and loading state.
 * @returns { { authenticated: boolean, loading: boolean } } The authenticated state and loading state.
 */
const useAuthState = () => {
    if (!isBrowser) {
        return { authenticated: false, loading: false };
    }
    const { auth } = useContext(CampContext);
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setAuthenticated(auth.isAuthenticated);
        auth.on("state", (state) => {
            if (state === "loading")
                setLoading(true);
            else {
                if (state === "authenticated")
                    setAuthenticated(true);
                else if (state === "unauthenticated")
                    setAuthenticated(false);
                setLoading(false);
            }
        });
    }, [auth]);
    return { authenticated, loading };
};
const useViem = () => {
    if (!isBrowser) {
        return { client: null };
    }
    const { auth } = useContext(CampContext);
    const [client, setClient] = useState(null);
    useEffect(() => {
        setClient(auth === null || auth === void 0 ? void 0 : auth.viem);
        auth === null || auth === void 0 ? void 0 : auth.on("viem", (client) => {
            setClient(client);
        });
    }, [auth]);
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    return {
        client,
    };
};
/**
 * Connects and disconnects the user.
 * @returns { { connect: function, disconnect: function } } The connect and disconnect functions.
 */
const useConnect = () => {
    if (!isBrowser) {
        return {
            connect: () => Promise.resolve({ success: false, message: "", walletAddress: "" }),
            disconnect: () => Promise.resolve(),
        };
    }
    const { auth } = useContext(CampContext);
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const connect = auth.connect.bind(auth);
    const disconnect = auth.disconnect.bind(auth);
    return { connect, disconnect };
};
/**
 * Returns the array of providers.
 * @returns { Array } The array of providers and the loading state.
 */
const useProviders = () => {
    if (!isBrowser) {
        return [];
    }
    return useSyncExternalStore(providerStore.subscribe, providerStore.value, providerStore.value);
};
/**
 * Returns the modal state and functions to open and close the modal.
 * @returns { { isOpen: boolean, openModal: function, closeModal: function } } The modal state and functions to open and close the modal.
 */
const useModal = () => {
    const { isVisible, setIsVisible } = useContext(ModalContext);
    const handleOpen = () => {
        setIsVisible(true);
    };
    const handleClose = () => {
        setIsVisible(false);
    };
    return {
        isOpen: isVisible,
        openModal: handleOpen,
        closeModal: handleClose,
    };
};
/**
 * Returns the functions to open and close the link modal.
 * @returns { { isLinkingOpen: boolean, closeModal: function, handleOpen: function } } The link modal state and functions to open and close the modal.
 */
const useLinkModal = () => {
    const { socials } = useSocials();
    const { isLinkingVisible, setIsLinkingVisible, setCurrentlyLinking } = useContext(ModalContext);
    const handleOpen = (social) => {
        if (!socials) {
            console.error("User is not authenticated");
            return;
        }
        setCurrentlyLinking(social);
        setIsLinkingVisible(true);
    };
    const handleLink = (social) => {
        if (!socials) {
            console.error("User is not authenticated");
            return;
        }
        if (socials && !socials[social]) {
            setCurrentlyLinking(social);
            setIsLinkingVisible(true);
        }
        else {
            setIsLinkingVisible(false);
            console.warn(`User already linked ${social}`);
        }
    };
    const handleUnlink = (social) => {
        if (!socials) {
            console.error("User is not authenticated");
            return;
        }
        if (socials && socials[social]) {
            setCurrentlyLinking(social);
            setIsLinkingVisible(true);
        }
        else {
            setIsLinkingVisible(false);
            console.warn(`User isn't linked to ${social}`);
        }
    };
    const handleClose = () => {
        setIsLinkingVisible(false);
    };
    const obj = {};
    constants.AVAILABLE_SOCIALS.forEach((social) => {
        obj[`link${social.charAt(0).toUpperCase() + social.slice(1)}`] = () => handleLink(social);
        obj[`unlink${social.charAt(0).toUpperCase() + social.slice(1)}`] = () => handleUnlink(social);
        obj[`open${social.charAt(0).toUpperCase() + social.slice(1)}Modal`] = () => handleOpen(social);
    });
    return Object.assign(Object.assign({ isLinkingOpen: isLinkingVisible }, obj), { closeModal: handleClose, handleOpen });
};
/**
 * Fetches the socials linked to the user.
 * @returns { { data: {}, socials: {}, error: Error, isLoading: boolean, refetch: () => {} } } react-query query object.
 */
const useSocials = () => {
    const { query } = useContext(SocialsContext);
    const socials = (query === null || query === void 0 ? void 0 : query.data) || {};
    return Object.assign(Object.assign({}, query), { socials });
};
/**
 * Fetches the Origin usage data and uploads data.
 * @returns { usage: { data: any, isError: boolean, isLoading: boolean, refetch: () => void }, uploads: { data: any, isError: boolean, isLoading: boolean, refetch: () => void } } The Origin usage data and uploads data.
 */
const useOrigin = () => {
    const { statsQuery, uploadsQuery } = useContext(OriginContext);
    return {
        stats: {
            data: statsQuery === null || statsQuery === void 0 ? void 0 : statsQuery.data,
            isError: statsQuery === null || statsQuery === void 0 ? void 0 : statsQuery.isError,
            isLoading: statsQuery === null || statsQuery === void 0 ? void 0 : statsQuery.isLoading,
            refetch: statsQuery === null || statsQuery === void 0 ? void 0 : statsQuery.refetch,
        },
        uploads: {
            data: (uploadsQuery === null || uploadsQuery === void 0 ? void 0 : uploadsQuery.data) || [],
            isError: uploadsQuery === null || uploadsQuery === void 0 ? void 0 : uploadsQuery.isError,
            isLoading: uploadsQuery === null || uploadsQuery === void 0 ? void 0 : uploadsQuery.isLoading,
            refetch: uploadsQuery === null || uploadsQuery === void 0 ? void 0 : uploadsQuery.refetch,
        },
    };
};

export { StandaloneCampButton as CampButton, CampContext, CampModal, CampProvider, LinkButton, ModalContext, MyCampModal, useAuth, useAuthState, useConnect, useLinkModal, useLinkSocials, useModal, useOrigin, useProvider, useProviders, useSocials, useViem };
