'use client';
import React, { createContext, useState, useContext, useEffect, useLayoutEffect, useRef, useSyncExternalStore } from 'react';
import { custom, createWalletClient, createPublicClient, http, encodeFunctionData, checksumAddress, zeroAddress, keccak256, toBytes, erc20Abi, getAbiItem, formatEther, formatUnits, parseEther } from 'viem';
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
const mainnet = {
    id: 484,
    name: "Camp Network",
    nativeCurrency: {
        decimals: 18,
        name: "Camp",
        symbol: "CAMP",
    },
    rpcUrls: {
        default: {
            http: ["https://rpc.camp.raas.gelato.cloud/"],
        },
    },
    blockExplorers: {
        default: {
            name: "Explorer",
            url: "https://camp.cloud.blockscout.com/",
        },
    },
};

// @ts-ignore
let client = null;
let publicClient = null;
let currentChain = null;
const getClient = (provider, name = "window.ethereum", chain, address) => {
    var _a, _b;
    if (!provider && !client) {
        console.warn("Provider is required to create a client.");
        return null;
    }
    const selectedChain = chain || testnet;
    if (!client ||
        (client.transport.name !== name && provider) ||
        (address !== ((_a = client.account) === null || _a === void 0 ? void 0 : _a.address) && provider) ||
        (currentChain === null || currentChain === void 0 ? void 0 : currentChain.id) !== selectedChain.id) {
        const obj = {
            chain: selectedChain,
            transport: custom(provider, {
                name: name,
            }),
        };
        if (address) {
            obj.account = toAccount(address);
        }
        client = createWalletClient(obj);
        currentChain = selectedChain;
        if (publicClient && ((_b = publicClient.chain) === null || _b === void 0 ? void 0 : _b.id) !== selectedChain.id) {
            publicClient = null;
        }
    }
    return client;
};
const getPublicClient = (chain) => {
    var _a;
    const selectedChain = currentChain || testnet;
    if (!publicClient || ((_a = publicClient.chain) === null || _a === void 0 ? void 0 : _a.id) !== selectedChain.id) {
        publicClient = createPublicClient({
            chain: selectedChain,
            transport: http(),
        });
    }
    return publicClient;
};
const setChain = (chain) => {
    currentChain = chain;
    publicClient = null; // reset public client to be recreated with new chain
};

var ipnftMainnetAbi = [
	{
		type: "function",
		name: "UPGRADE_INTERFACE_VERSION",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "string",
				internalType: "string"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "approve",
		inputs: [
			{
				name: "to",
				type: "address",
				internalType: "address"
			},
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			}
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "balanceOf",
		inputs: [
			{
				name: "owner",
				type: "address",
				internalType: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "uint256",
				internalType: "uint256"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "dataStatus",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			}
		],
		outputs: [
			{
				name: "",
				type: "uint8",
				internalType: "enum IIpNFT.DataStatus"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "disputeModule",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "address"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "erc6551Account",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "contract IERC6551Account"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "erc6551Registry",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "contract IERC6551Registry"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "finalizeDelete",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			}
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "getAccount",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			}
		],
		outputs: [
			{
				name: "account",
				type: "address",
				internalType: "address"
			}
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "getApproved",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			}
		],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "address"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "getTerms",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			}
		],
		outputs: [
			{
				name: "",
				type: "tuple",
				internalType: "struct IIpNFT.LicenseTerms",
				components: [
					{
						name: "price",
						type: "uint128",
						internalType: "uint128"
					},
					{
						name: "duration",
						type: "uint32",
						internalType: "uint32"
					},
					{
						name: "royaltyBps",
						type: "uint16",
						internalType: "uint16"
					},
					{
						name: "paymentToken",
						type: "address",
						internalType: "address"
					}
				]
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "initialize",
		inputs: [
			{
				name: "name_",
				type: "string",
				internalType: "string"
			},
			{
				name: "symbol_",
				type: "string",
				internalType: "string"
			},
			{
				name: "maxTermDuration_",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "signer_",
				type: "address",
				internalType: "address"
			},
			{
				name: "wCAMP_",
				type: "address",
				internalType: "address"
			},
			{
				name: "minTermDuration_",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "minPrice_",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "maxRoyaltyBps_",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "registry_",
				type: "address",
				internalType: "contract IERC6551Registry"
			},
			{
				name: "implementation_",
				type: "address",
				internalType: "contract IERC6551Account"
			}
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "isApprovedForAll",
		inputs: [
			{
				name: "owner",
				type: "address",
				internalType: "address"
			},
			{
				name: "operator",
				type: "address",
				internalType: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "bool",
				internalType: "bool"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "markDisputed",
		inputs: [
			{
				name: "_tokenId",
				type: "uint256",
				internalType: "uint256"
			}
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "marketPlace",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "contract IMarketplace"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "maxRoyaltyBps",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "uint256",
				internalType: "uint256"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "maxTermDuration",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "uint256",
				internalType: "uint256"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "minPrice",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "uint256",
				internalType: "uint256"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "minTermDuration",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "uint256",
				internalType: "uint256"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "mintWithSignature",
		inputs: [
			{
				name: "to",
				type: "address",
				internalType: "address"
			},
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "creatorContentHash",
				type: "bytes32",
				internalType: "bytes32"
			},
			{
				name: "uri",
				type: "string",
				internalType: "string"
			},
			{
				name: "licenseTerms",
				type: "tuple",
				internalType: "struct IIpNFT.LicenseTerms",
				components: [
					{
						name: "price",
						type: "uint128",
						internalType: "uint128"
					},
					{
						name: "duration",
						type: "uint32",
						internalType: "uint32"
					},
					{
						name: "royaltyBps",
						type: "uint16",
						internalType: "uint16"
					},
					{
						name: "paymentToken",
						type: "address",
						internalType: "address"
					}
				]
			},
			{
				name: "deadline",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "parents",
				type: "uint256[]",
				internalType: "uint256[]"
			},
			{
				name: "isIP",
				type: "bool",
				internalType: "bool"
			},
			{
				name: "signature",
				type: "bytes",
				internalType: "bytes"
			}
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "name",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "string",
				internalType: "string"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "owner",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "address"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "ownerOf",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			}
		],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "address"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "pause",
		inputs: [
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "paused",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "bool",
				internalType: "bool"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "proxiableUUID",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "bytes32",
				internalType: "bytes32"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "renounceOwnership",
		inputs: [
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "safeTransferFrom",
		inputs: [
			{
				name: "from",
				type: "address",
				internalType: "address"
			},
			{
				name: "to",
				type: "address",
				internalType: "address"
			},
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			}
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "safeTransferFrom",
		inputs: [
			{
				name: "from",
				type: "address",
				internalType: "address"
			},
			{
				name: "to",
				type: "address",
				internalType: "address"
			},
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "data",
				type: "bytes",
				internalType: "bytes"
			}
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "setApprovalForAll",
		inputs: [
			{
				name: "operator",
				type: "address",
				internalType: "address"
			},
			{
				name: "approved",
				type: "bool",
				internalType: "bool"
			}
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "setDisputeModule",
		inputs: [
			{
				name: "_disputeModule",
				type: "address",
				internalType: "address"
			}
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "setMarketPlace",
		inputs: [
			{
				name: "_marketPlace",
				type: "address",
				internalType: "address"
			}
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "setSigner",
		inputs: [
			{
				name: "_signer",
				type: "address",
				internalType: "address"
			}
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "signer",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "address"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "supportsInterface",
		inputs: [
			{
				name: "interfaceId",
				type: "bytes4",
				internalType: "bytes4"
			}
		],
		outputs: [
			{
				name: "",
				type: "bool",
				internalType: "bool"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "symbol",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "string",
				internalType: "string"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "tokenInfo",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			}
		],
		outputs: [
			{
				name: "",
				type: "tuple",
				internalType: "struct IIpNFT.TokenInfo",
				components: [
					{
						name: "tokenURI",
						type: "string",
						internalType: "string"
					},
					{
						name: "isIP",
						type: "bool",
						internalType: "bool"
					},
					{
						name: "contentHash",
						type: "bytes32",
						internalType: "bytes32"
					},
					{
						name: "terms",
						type: "tuple",
						internalType: "struct IIpNFT.LicenseTerms",
						components: [
							{
								name: "price",
								type: "uint128",
								internalType: "uint128"
							},
							{
								name: "duration",
								type: "uint32",
								internalType: "uint32"
							},
							{
								name: "royaltyBps",
								type: "uint16",
								internalType: "uint16"
							},
							{
								name: "paymentToken",
								type: "address",
								internalType: "address"
							}
						]
					},
					{
						name: "status",
						type: "uint8",
						internalType: "enum IIpNFT.DataStatus"
					}
				]
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "tokenURI",
		inputs: [
			{
				name: "_tokenId",
				type: "uint256",
				internalType: "uint256"
			}
		],
		outputs: [
			{
				name: "",
				type: "string",
				internalType: "string"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "transferFrom",
		inputs: [
			{
				name: "from",
				type: "address",
				internalType: "address"
			},
			{
				name: "to",
				type: "address",
				internalType: "address"
			},
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			}
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "transferOwnership",
		inputs: [
			{
				name: "newOwner",
				type: "address",
				internalType: "address"
			}
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "unpause",
		inputs: [
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "updateTerms",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "newTerms",
				type: "tuple",
				internalType: "struct IIpNFT.LicenseTerms",
				components: [
					{
						name: "price",
						type: "uint128",
						internalType: "uint128"
					},
					{
						name: "duration",
						type: "uint32",
						internalType: "uint32"
					},
					{
						name: "royaltyBps",
						type: "uint16",
						internalType: "uint16"
					},
					{
						name: "paymentToken",
						type: "address",
						internalType: "address"
					}
				]
			}
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "upgradeToAndCall",
		inputs: [
			{
				name: "newImplementation",
				type: "address",
				internalType: "address"
			},
			{
				name: "data",
				type: "bytes",
				internalType: "bytes"
			}
		],
		outputs: [
		],
		stateMutability: "payable"
	},
	{
		type: "function",
		name: "wCAMP",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "address"
			}
		],
		stateMutability: "view"
	},
	{
		type: "event",
		name: "AccessPurchased",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "buyer",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "periods",
				type: "uint32",
				indexed: false,
				internalType: "uint32"
			},
			{
				name: "newExpiry",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			},
			{
				name: "amountPaid",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "AgentRegistered",
		inputs: [
			{
				name: "agentId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "ipNftId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "agentAddress",
				type: "address",
				indexed: false,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "Approval",
		inputs: [
			{
				name: "owner",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "approved",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "tokenId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "ApprovalForAll",
		inputs: [
			{
				name: "owner",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "operator",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "approved",
				type: "bool",
				indexed: false,
				internalType: "bool"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "ChildIpTagged",
		inputs: [
			{
				name: "id",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "childIp",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "parentIp",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "DataDeleted",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "creator",
				type: "address",
				indexed: true,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "DataMinted",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "creator",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "contentHash",
				type: "bytes32",
				indexed: false,
				internalType: "bytes32"
			},
			{
				name: "parents",
				type: "uint256[]",
				indexed: false,
				internalType: "uint256[]"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "DisputeAssertion",
		inputs: [
			{
				name: "id",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "counterEvidenceHash",
				type: "bytes32",
				indexed: false,
				internalType: "bytes32"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "DisputeCancelled",
		inputs: [
			{
				name: "id",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "DisputeJudged",
		inputs: [
			{
				name: "id",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "judgement",
				type: "bool",
				indexed: false,
				internalType: "bool"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "DisputeModuleUpdated",
		inputs: [
			{
				name: "disputeModule",
				type: "address",
				indexed: true,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "DisputeRaised",
		inputs: [
			{
				name: "id",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "initiator",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "targetId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "disputeTag",
				type: "bytes32",
				indexed: false,
				internalType: "bytes32"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "Initialized",
		inputs: [
			{
				name: "version",
				type: "uint64",
				indexed: false,
				internalType: "uint64"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "MarketPlaceUpdated",
		inputs: [
			{
				name: "marketPlace",
				type: "address",
				indexed: true,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "OwnershipTransferred",
		inputs: [
			{
				name: "previousOwner",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "newOwner",
				type: "address",
				indexed: true,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "Paused",
		inputs: [
			{
				name: "account",
				type: "address",
				indexed: false,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "RoyaltyPaid",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "royaltyAmount",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			},
			{
				name: "creator",
				type: "address",
				indexed: false,
				internalType: "address"
			},
			{
				name: "protocolAmount",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "SignerUpdated",
		inputs: [
			{
				name: "signer",
				type: "address",
				indexed: true,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "StatusUpdated",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "status",
				type: "uint8",
				indexed: false,
				internalType: "enum IIpNFT.DataStatus"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "TermsUpdated",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "newPrice",
				type: "uint128",
				indexed: false,
				internalType: "uint128"
			},
			{
				name: "newDuration",
				type: "uint32",
				indexed: false,
				internalType: "uint32"
			},
			{
				name: "newRoyaltyBps",
				type: "uint16",
				indexed: false,
				internalType: "uint16"
			},
			{
				name: "paymentToken",
				type: "address",
				indexed: false,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "Transfer",
		inputs: [
			{
				name: "from",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "to",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "tokenId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "Unpaused",
		inputs: [
			{
				name: "account",
				type: "address",
				indexed: false,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "Upgraded",
		inputs: [
			{
				name: "implementation",
				type: "address",
				indexed: true,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "error",
		name: "AddressEmptyCode",
		inputs: [
			{
				name: "target",
				type: "address",
				internalType: "address"
			}
		]
	},
	{
		type: "error",
		name: "ERC1967InvalidImplementation",
		inputs: [
			{
				name: "implementation",
				type: "address",
				internalType: "address"
			}
		]
	},
	{
		type: "error",
		name: "ERC1967NonPayable",
		inputs: [
		]
	},
	{
		type: "error",
		name: "ERC721IncorrectOwner",
		inputs: [
			{
				name: "sender",
				type: "address",
				internalType: "address"
			},
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "owner",
				type: "address",
				internalType: "address"
			}
		]
	},
	{
		type: "error",
		name: "ERC721InsufficientApproval",
		inputs: [
			{
				name: "operator",
				type: "address",
				internalType: "address"
			},
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			}
		]
	},
	{
		type: "error",
		name: "ERC721InvalidApprover",
		inputs: [
			{
				name: "approver",
				type: "address",
				internalType: "address"
			}
		]
	},
	{
		type: "error",
		name: "ERC721InvalidOperator",
		inputs: [
			{
				name: "operator",
				type: "address",
				internalType: "address"
			}
		]
	},
	{
		type: "error",
		name: "ERC721InvalidOwner",
		inputs: [
			{
				name: "owner",
				type: "address",
				internalType: "address"
			}
		]
	},
	{
		type: "error",
		name: "ERC721InvalidReceiver",
		inputs: [
			{
				name: "receiver",
				type: "address",
				internalType: "address"
			}
		]
	},
	{
		type: "error",
		name: "ERC721InvalidSender",
		inputs: [
			{
				name: "sender",
				type: "address",
				internalType: "address"
			}
		]
	},
	{
		type: "error",
		name: "ERC721NonexistentToken",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			}
		]
	},
	{
		type: "error",
		name: "EnforcedPause",
		inputs: [
		]
	},
	{
		type: "error",
		name: "ExpectedPause",
		inputs: [
		]
	},
	{
		type: "error",
		name: "FailedCall",
		inputs: [
		]
	},
	{
		type: "error",
		name: "InvalidDeadline",
		inputs: [
		]
	},
	{
		type: "error",
		name: "InvalidDuration",
		inputs: [
		]
	},
	{
		type: "error",
		name: "InvalidInitialization",
		inputs: [
		]
	},
	{
		type: "error",
		name: "InvalidPaymentToken",
		inputs: [
		]
	},
	{
		type: "error",
		name: "InvalidPrice",
		inputs: [
		]
	},
	{
		type: "error",
		name: "InvalidRoyalty",
		inputs: [
		]
	},
	{
		type: "error",
		name: "InvalidSignature",
		inputs: [
		]
	},
	{
		type: "error",
		name: "NotInitializing",
		inputs: [
		]
	},
	{
		type: "error",
		name: "NotTokenOwner",
		inputs: [
		]
	},
	{
		type: "error",
		name: "OwnableInvalidOwner",
		inputs: [
			{
				name: "owner",
				type: "address",
				internalType: "address"
			}
		]
	},
	{
		type: "error",
		name: "OwnableUnauthorizedAccount",
		inputs: [
			{
				name: "account",
				type: "address",
				internalType: "address"
			}
		]
	},
	{
		type: "error",
		name: "TokenAlreadyExists",
		inputs: [
		]
	},
	{
		type: "error",
		name: "UUPSUnauthorizedCallContext",
		inputs: [
		]
	},
	{
		type: "error",
		name: "UUPSUnsupportedProxiableUUID",
		inputs: [
			{
				name: "slot",
				type: "bytes32",
				internalType: "bytes32"
			}
		]
	},
	{
		type: "error",
		name: "Unauthorized",
		inputs: [
		]
	}
];

var marketplaceMainnetAbi = [
	{
		type: "function",
		name: "MAX_PARENTS",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "uint256",
				internalType: "uint256"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "UPGRADE_INTERFACE_VERSION",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "string",
				internalType: "string"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "buyAccess",
		inputs: [
			{
				name: "buyer",
				type: "address",
				internalType: "address"
			},
			{
				name: "tokenId",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "expectedPrice",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "expectedDuration",
				type: "uint32",
				internalType: "uint32"
			},
			{
				name: "expectedPaymentToken",
				type: "address",
				internalType: "address"
			}
		],
		outputs: [
		],
		stateMutability: "payable"
	},
	{
		type: "function",
		name: "hasParentIp",
		inputs: [
			{
				name: "ipId",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "parent",
				type: "uint256",
				internalType: "uint256"
			}
		],
		outputs: [
			{
				name: "",
				type: "bool",
				internalType: "bool"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "initialize",
		inputs: [
			{
				name: "dataNFT_",
				type: "address",
				internalType: "address"
			},
			{
				name: "protocolFeeBps_",
				type: "uint16",
				internalType: "uint16"
			},
			{
				name: "treasury_",
				type: "address",
				internalType: "address"
			}
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "ipToken",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "contract IIpNFT"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "owner",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "address"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "parentRoyaltyPercent",
		inputs: [
			{
				name: "",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "",
				type: "uint256",
				internalType: "uint256"
			}
		],
		outputs: [
			{
				name: "",
				type: "uint16",
				internalType: "uint16"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "pause",
		inputs: [
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "paused",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "bool",
				internalType: "bool"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "protocolFeeBps",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "uint16",
				internalType: "uint16"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "proxiableUUID",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "bytes32",
				internalType: "bytes32"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "renounceOwnership",
		inputs: [
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "royaltyStack",
		inputs: [
			{
				name: "",
				type: "uint256",
				internalType: "uint256"
			}
		],
		outputs: [
			{
				name: "",
				type: "uint16",
				internalType: "uint16"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "setParentIpsAndRoyaltyPercents",
		inputs: [
			{
				name: "childIpId",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "parents",
				type: "uint256[]",
				internalType: "uint256[]"
			},
			{
				name: "creator",
				type: "address",
				internalType: "address"
			}
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "subscriptionExpiry",
		inputs: [
			{
				name: "",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "",
				type: "address",
				internalType: "address"
			}
		],
		outputs: [
			{
				name: "",
				type: "uint256",
				internalType: "uint256"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "transferOwnership",
		inputs: [
			{
				name: "newOwner",
				type: "address",
				internalType: "address"
			}
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "treasury",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "address"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "unpause",
		inputs: [
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "updateProtocolFee",
		inputs: [
			{
				name: "newFeeBps",
				type: "uint16",
				internalType: "uint16"
			}
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "updateTreasury",
		inputs: [
			{
				name: "newTreasury",
				type: "address",
				internalType: "address"
			}
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "upgradeToAndCall",
		inputs: [
			{
				name: "newImplementation",
				type: "address",
				internalType: "address"
			},
			{
				name: "data",
				type: "bytes",
				internalType: "bytes"
			}
		],
		outputs: [
		],
		stateMutability: "payable"
	},
	{
		type: "event",
		name: "AccessPurchased",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "buyer",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "periods",
				type: "uint32",
				indexed: false,
				internalType: "uint32"
			},
			{
				name: "newExpiry",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			},
			{
				name: "amountPaid",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "AgentRegistered",
		inputs: [
			{
				name: "agentId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "ipNftId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "agentAddress",
				type: "address",
				indexed: false,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "ChildIpTagged",
		inputs: [
			{
				name: "id",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "childIp",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "parentIp",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "DataDeleted",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "creator",
				type: "address",
				indexed: true,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "DataMinted",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "creator",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "contentHash",
				type: "bytes32",
				indexed: false,
				internalType: "bytes32"
			},
			{
				name: "parents",
				type: "uint256[]",
				indexed: false,
				internalType: "uint256[]"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "DisputeAssertion",
		inputs: [
			{
				name: "id",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "counterEvidenceHash",
				type: "bytes32",
				indexed: false,
				internalType: "bytes32"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "DisputeCancelled",
		inputs: [
			{
				name: "id",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "DisputeJudged",
		inputs: [
			{
				name: "id",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "judgement",
				type: "bool",
				indexed: false,
				internalType: "bool"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "DisputeModuleUpdated",
		inputs: [
			{
				name: "disputeModule",
				type: "address",
				indexed: true,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "DisputeRaised",
		inputs: [
			{
				name: "id",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "initiator",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "targetId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "disputeTag",
				type: "bytes32",
				indexed: false,
				internalType: "bytes32"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "Initialized",
		inputs: [
			{
				name: "version",
				type: "uint64",
				indexed: false,
				internalType: "uint64"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "MarketPlaceUpdated",
		inputs: [
			{
				name: "marketPlace",
				type: "address",
				indexed: true,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "OwnershipTransferred",
		inputs: [
			{
				name: "previousOwner",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "newOwner",
				type: "address",
				indexed: true,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "Paused",
		inputs: [
			{
				name: "account",
				type: "address",
				indexed: false,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "RoyaltyPaid",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "royaltyAmount",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			},
			{
				name: "creator",
				type: "address",
				indexed: false,
				internalType: "address"
			},
			{
				name: "protocolAmount",
				type: "uint256",
				indexed: false,
				internalType: "uint256"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "SignerUpdated",
		inputs: [
			{
				name: "signer",
				type: "address",
				indexed: true,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "StatusUpdated",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "status",
				type: "uint8",
				indexed: false,
				internalType: "enum IIpNFT.DataStatus"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "TermsUpdated",
		inputs: [
			{
				name: "tokenId",
				type: "uint256",
				indexed: true,
				internalType: "uint256"
			},
			{
				name: "newPrice",
				type: "uint128",
				indexed: false,
				internalType: "uint128"
			},
			{
				name: "newDuration",
				type: "uint32",
				indexed: false,
				internalType: "uint32"
			},
			{
				name: "newRoyaltyBps",
				type: "uint16",
				indexed: false,
				internalType: "uint16"
			},
			{
				name: "paymentToken",
				type: "address",
				indexed: false,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "Unpaused",
		inputs: [
			{
				name: "account",
				type: "address",
				indexed: false,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "event",
		name: "Upgraded",
		inputs: [
			{
				name: "implementation",
				type: "address",
				indexed: true,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "error",
		name: "AddressEmptyCode",
		inputs: [
			{
				name: "target",
				type: "address",
				internalType: "address"
			}
		]
	},
	{
		type: "error",
		name: "ERC1967InvalidImplementation",
		inputs: [
			{
				name: "implementation",
				type: "address",
				internalType: "address"
			}
		]
	},
	{
		type: "error",
		name: "ERC1967NonPayable",
		inputs: [
		]
	},
	{
		type: "error",
		name: "EnforcedPause",
		inputs: [
		]
	},
	{
		type: "error",
		name: "ExpectedPause",
		inputs: [
		]
	},
	{
		type: "error",
		name: "FailedCall",
		inputs: [
		]
	},
	{
		type: "error",
		name: "InvalidInitialization",
		inputs: [
		]
	},
	{
		type: "error",
		name: "InvalidParentIp",
		inputs: [
		]
	},
	{
		type: "error",
		name: "InvalidPayment",
		inputs: [
		]
	},
	{
		type: "error",
		name: "InvalidRoyalty",
		inputs: [
		]
	},
	{
		type: "error",
		name: "MaxParentsExceeded",
		inputs: [
		]
	},
	{
		type: "error",
		name: "MaxRoyaltyExceeded",
		inputs: [
		]
	},
	{
		type: "error",
		name: "NoSubscriptionFound",
		inputs: [
		]
	},
	{
		type: "error",
		name: "NotInitializing",
		inputs: [
		]
	},
	{
		type: "error",
		name: "OwnableInvalidOwner",
		inputs: [
			{
				name: "owner",
				type: "address",
				internalType: "address"
			}
		]
	},
	{
		type: "error",
		name: "OwnableUnauthorizedAccount",
		inputs: [
			{
				name: "account",
				type: "address",
				internalType: "address"
			}
		]
	},
	{
		type: "error",
		name: "ParentAlreadyExists",
		inputs: [
		]
	},
	{
		type: "error",
		name: "ParentIpAlreadyDeleted",
		inputs: [
		]
	},
	{
		type: "error",
		name: "ParentIpAlreadyDisputed",
		inputs: [
		]
	},
	{
		type: "error",
		name: "SubscriptionNotAllowed",
		inputs: [
		]
	},
	{
		type: "error",
		name: "TermsMismatch",
		inputs: [
		]
	},
	{
		type: "error",
		name: "UUPSUnauthorizedCallContext",
		inputs: [
		]
	},
	{
		type: "error",
		name: "UUPSUnsupportedProxiableUUID",
		inputs: [
			{
				name: "slot",
				type: "bytes32",
				internalType: "bytes32"
			}
		]
	},
	{
		type: "error",
		name: "Unauthorized",
		inputs: [
		]
	},
	{
		type: "error",
		name: "ZeroAddress",
		inputs: [
		]
	}
];

var royaltyVaultAbi = [
	{
		type: "constructor",
		inputs: [
			{
				name: "_owner",
				type: "address",
				internalType: "address"
			}
		],
		stateMutability: "nonpayable"
	},
	{
		type: "receive",
		stateMutability: "payable"
	},
	{
		type: "function",
		name: "claimRoyalty",
		inputs: [
			{
				name: "token",
				type: "address",
				internalType: "address"
			}
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "owner",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "address"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "renounceOwnership",
		inputs: [
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "function",
		name: "transferOwnership",
		inputs: [
			{
				name: "newOwner",
				type: "address",
				internalType: "address"
			}
		],
		outputs: [
		],
		stateMutability: "nonpayable"
	},
	{
		type: "event",
		name: "OwnershipTransferred",
		inputs: [
			{
				name: "previousOwner",
				type: "address",
				indexed: true,
				internalType: "address"
			},
			{
				name: "newOwner",
				type: "address",
				indexed: true,
				internalType: "address"
			}
		],
		anonymous: false
	},
	{
		type: "error",
		name: "OwnableInvalidOwner",
		inputs: [
			{
				name: "owner",
				type: "address",
				internalType: "address"
			}
		]
	},
	{
		type: "error",
		name: "OwnableUnauthorizedAccount",
		inputs: [
			{
				name: "account",
				type: "address",
				internalType: "address"
			}
		]
	}
];

var tbaAbi = [
	{
		type: "receive",
		stateMutability: "payable"
	},
	{
		type: "function",
		name: "execute",
		inputs: [
			{
				name: "to",
				type: "address",
				internalType: "address"
			},
			{
				name: "value",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "data",
				type: "bytes",
				internalType: "bytes"
			},
			{
				name: "operation",
				type: "uint8",
				internalType: "uint8"
			}
		],
		outputs: [
			{
				name: "result",
				type: "bytes",
				internalType: "bytes"
			}
		],
		stateMutability: "payable"
	},
	{
		type: "function",
		name: "isValidSignature",
		inputs: [
			{
				name: "hash",
				type: "bytes32",
				internalType: "bytes32"
			},
			{
				name: "signature",
				type: "bytes",
				internalType: "bytes"
			}
		],
		outputs: [
			{
				name: "magicValue",
				type: "bytes4",
				internalType: "bytes4"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "isValidSigner",
		inputs: [
			{
				name: "signer",
				type: "address",
				internalType: "address"
			},
			{
				name: "",
				type: "bytes",
				internalType: "bytes"
			}
		],
		outputs: [
			{
				name: "",
				type: "bytes4",
				internalType: "bytes4"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "owner",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "address"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "state",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "uint256",
				internalType: "uint256"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "supportsInterface",
		inputs: [
			{
				name: "interfaceId",
				type: "bytes4",
				internalType: "bytes4"
			}
		],
		outputs: [
			{
				name: "",
				type: "bool",
				internalType: "bool"
			}
		],
		stateMutability: "view"
	},
	{
		type: "function",
		name: "token",
		inputs: [
		],
		outputs: [
			{
				name: "",
				type: "uint256",
				internalType: "uint256"
			},
			{
				name: "",
				type: "address",
				internalType: "address"
			},
			{
				name: "",
				type: "uint256",
				internalType: "uint256"
			}
		],
		stateMutability: "view"
	}
];

var constants = {
    SIWE_MESSAGE_STATEMENT: "Connect with Camp Network",
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
    MAX_LICENSE_DURATION: 2628000, // 30 days in seconds
    MIN_LICENSE_DURATION: 86400, // 1 day in seconds
    MIN_PRICE: 1000000000000000, // 0.001 CAMP in wei
    MIN_ROYALTY_BPS: 1, // 0.01%
    MAX_ROYALTY_BPS: 10000, // 100%
};
const ENVIRONMENTS = {
    DEVELOPMENT: {
        NAME: "DEVELOPMENT",
        AUTH_HUB_BASE_API: "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",
        AUTH_ENDPOINT: "auth-testnet",
        ORIGIN_DASHBOARD: "https://origin.campnetwork.xyz",
        DATANFT_CONTRACT_ADDRESS: "0xB53F5723Dd4E46da32e1769Bd36A5aD880e707A5",
        MARKETPLACE_CONTRACT_ADDRESS: "0x97b0A18B2888e904940fFd19E480a28aeec3F055",
        CHAIN: testnet,
        IPNFT_ABI: ipnftMainnetAbi,
        MARKETPLACE_ABI: marketplaceMainnetAbi,
        ROYALTY_VAULT_ABI: royaltyVaultAbi,
        TBA_ABI: tbaAbi,
    },
    PRODUCTION: {
        NAME: "PRODUCTION",
        AUTH_HUB_BASE_API: "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",
        AUTH_ENDPOINT: "auth-mainnet",
        ORIGIN_DASHBOARD: "https://origin.campnetwork.xyz",
        DATANFT_CONTRACT_ADDRESS: "0x39EeE1C3989f0dD543Dee60f8582F7F81F522C38",
        MARKETPLACE_CONTRACT_ADDRESS: "0xc69BAa987757d054455fC0f2d9797684E9FB8b9C",
        CHAIN: mainnet,
        IPNFT_ABI: ipnftMainnetAbi,
        MARKETPLACE_ABI: marketplaceMainnetAbi,
        ROYALTY_VAULT_ABI: royaltyVaultAbi,
        TBA_ABI: tbaAbi,
    },
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
const SECONDS_IN_HOUR = 3600;
const SECONDS_IN_DAY = 86400;
const SECONDS_IN_WEEK = 604800;
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
const toSeconds = (duration, licenseDurationUnit) => {
    if (duration === "")
        return 0;
    const durationInSeconds = licenseDurationUnit === "hours"
        ? Number(duration) * SECONDS_IN_HOUR
        : licenseDurationUnit === "days"
            ? Number(duration) * SECONDS_IN_DAY
            : licenseDurationUnit === "weeks"
                ? Number(duration) * SECONDS_IN_WEEK
                : Number(duration);
    return durationInSeconds;
};
/**
 * Validates if the given price string represents a valid price in wei.
 * The price must be a non-empty string that, when converted to wei, is at least the minimum price defined in constants.
 * @param {string} price - The price string to validate (in CAMP).
 * @returns {boolean} - True if the price is valid, false otherwise.
 */
const validatePrice = (price) => {
    if (price && price.trim() !== "") {
        const priceInWei = BigInt(Math.floor(parseFloat(price) * Math.pow(10, 18)));
        return priceInWei >= BigInt(constants.MIN_PRICE);
    }
    else {
        return false;
    }
};
/**
 * Validates if the given duration is within the allowed license duration range.
 * The duration must be a number and, when converted to seconds, must be between the minimum and maximum license duration defined in constants.
 * @param {number | ""} duration - The duration to validate.
 * @param {string} licenseDurationUnit - The unit of the duration (e.g., "hours", "days", "weeks").
 * @returns {boolean} - True if the duration is valid, false otherwise.
 */
const validateDuration = (duration, licenseDurationUnit) => {
    let isValid = duration !== "" && !isNaN(Number(duration));
    if (isValid) {
        const durationInSeconds = licenseDurationUnit === "hours"
            ? Number(duration) * SECONDS_IN_HOUR
            : licenseDurationUnit === "days"
                ? Number(duration) * SECONDS_IN_DAY
                : licenseDurationUnit === "weeks"
                    ? Number(duration) * SECONDS_IN_WEEK
                    : Number(duration);
        isValid =
            durationInSeconds <= constants.MAX_LICENSE_DURATION &&
                durationInSeconds >= constants.MIN_LICENSE_DURATION;
    }
    return isValid;
};
const validateRoyaltyBps = (royaltyBps) => {
    if (royaltyBps && royaltyBps.trim() !== "") {
        const bps = Math.floor(parseFloat(royaltyBps) * 100);
        return bps >= constants.MIN_ROYALTY_BPS && bps <= constants.MAX_ROYALTY_BPS;
    }
    else {
        return false;
    }
};

/**
 * Mints a Data NFT with a signature.
 * @param to The address to mint the NFT to.
 * @param tokenId The ID of the token to mint.
 * @param parents The IDs of the parent NFTs, if applicable.
 * @param isIp Whether the NFT is an IP NFT.
 * @param hash The hash of the data associated with the NFT.
 * @param uri The URI of the NFT metadata.
 * @param licenseTerms The terms of the license for the NFT.
 * @param deadline The deadline for the minting operation.
 * @param signature The signature for the minting operation.
 * @returns A promise that resolves when the minting is complete.
 */
function mintWithSignature(to, tokenId, parents, isIp, hash, uri, licenseTerms, deadline, signature) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS, this.environment.IPNFT_ABI, "mintWithSignature", [to, tokenId, hash, uri, licenseTerms, deadline, parents, isIp, signature], { waitForReceipt: true });
    });
}
/**
 * Registers a Data NFT with the Origin service in order to obtain a signature for minting.
 * @param source The source of the Data NFT (e.g., "spotify", "twitter", "tiktok", or "file").
 * @param deadline The deadline for the registration operation.
 * @param licenseTerms The terms of the license for the NFT.
 * @param metadata The metadata associated with the NFT.
 * @param fileKey The file key(s) if the source is "file".
 * @param parents The IDs of the parent NFTs, if applicable.
 * @return A promise that resolves with the registration data.
 */
function registerIpNFT(source, deadline, licenseTerms, metadata, fileKey, parents) {
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
            parentId: parents ? parents.map((p) => p.toString()) : [],
        };
        if (fileKey !== undefined) {
            body.fileKey = fileKey;
        }
        const res = yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/register`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${this.getJwt()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });
        const data = yield res.json();
        if (data.isError) {
            throw new Error(`Failed to get signature: ${data.message}`);
        }
        if (!res.ok) {
            throw new Error(`Failed to get signature: ${res.statusText}`);
        }
        return data.data;
    });
}

/**
 * Updates the license terms of a specified IPNFT.
 * @param tokenId The ID of the IPNFT to update.
 * @param newTerms The new license terms to set.
 * @returns A promise that resolves when the transaction is complete.
 */
function updateTerms(tokenId, newTerms) {
    return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS, this.environment.IPNFT_ABI, "updateTerms", [tokenId, newTerms], { waitForReceipt: true });
}

/**
 * Sets the IPNFT as deleted
 * @param tokenId The token ID to set as deleted.
 * @returns A promise that resolves when the transaction is complete.
 */
function finalizeDelete(tokenId) {
    return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS, this.environment.IPNFT_ABI, "finalizeDelete", [tokenId]);
}

/**
 * Calls the getOrCreateRoyaltyVault method on the IPNFT contract.
 * @param tokenOwner The address of the token owner for whom to get or create the royalty vault.
 * @param simulateOnly If true, simulates the transaction without executing it.
 * @returns The address of the royalty vault associated with the specified token owner.
 */
function getOrCreateRoyaltyVault(tokenOwner_1) {
    return __awaiter(this, arguments, void 0, function* (tokenOwner, simulateOnly = false) {
        const royaltyVaultTx = yield this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS, this.environment.IPNFT_ABI, "getOrCreateRoyaltyVault", [tokenOwner], { waitForReceipt: true, simulate: simulateOnly });
        return simulateOnly
            ? royaltyVaultTx
            : royaltyVaultTx.simulatedResult;
    });
}

/**
 * Returns the license terms associated with a specific token ID.
 * @param tokenId The token ID to query.
 * @returns The license terms of the token ID.
 */
function getTerms(tokenId) {
    return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS, this.environment.IPNFT_ABI, "getTerms", [tokenId]);
}

/**
 * Returns the owner of the specified IPNFT.
 * @param tokenId The ID of the IPNFT to query.
 * @returns The address of the owner of the IPNFT.
 */
function ownerOf(tokenId) {
    return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS, this.environment.IPNFT_ABI, "ownerOf", [tokenId]);
}

/**
 * Returns the number of IPNFTs owned by the given address.
 * @param owner The address to query.
 * @returns The number of IPNFTs owned by the address.
 */
function balanceOf(owner) {
    return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS, this.environment.IPNFT_ABI, "balanceOf", [owner]);
}

/**
 * Returns the metadata URI associated with a specific token ID.
 * @param tokenId The token ID to query.
 * @returns The metadata URI of the token ID.
 */
function tokenURI(tokenId) {
    return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS, this.environment.IPNFT_ABI, "tokenURI", [tokenId]);
}

/**
 * Returns the data status of the given token ID.
 * @param tokenId The token ID to query.
 * @returns The data status of the token ID.
 */
function dataStatus(tokenId) {
    return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS, this.environment.IPNFT_ABI, "dataStatus", [tokenId]);
}

/**
 * Checks if an operator is approved to manage all assets of a given owner.
 * @param owner The address of the asset owner.
 * @param operator The address of the operator to check.
 * @return A promise that resolves to a boolean indicating if the operator is approved for all assets of the owner.
 */
function isApprovedForAll(owner, operator) {
    return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS, this.environment.IPNFT_ABI, "isApprovedForAll", [owner, operator]);
}

function transferFrom(from, to, tokenId) {
    return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS, this.environment.IPNFT_ABI, "transferFrom", [from, to, tokenId]);
}

function safeTransferFrom(from, to, tokenId, data) {
    const args = data ? [from, to, tokenId, data] : [from, to, tokenId];
    return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS, this.environment.IPNFT_ABI, "safeTransferFrom", args);
}

function approve(to, tokenId) {
    return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS, this.environment.IPNFT_ABI, "approve", [to, tokenId]);
}

function setApprovalForAll(operator, approved) {
    return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS, this.environment.IPNFT_ABI, "setApprovalForAll", [operator, approved]);
}

/**
 * Buys access to a data NFT for a specified duration.
 * @param buyer The address of the buyer.
 * @param tokenId The ID of the data NFT.
 * @param expectedPrice The expected price for the access.
 * @param expectedDuration The expected duration of the access in seconds.
 * @param expectedPaymentToken The address of the payment token (use zero address for native token).
 * @param value The amount of native token to send (only required if paying with native token).
 * @returns A promise that resolves when the transaction is confirmed.
 */
function buyAccess(buyer, tokenId, expectedPrice, expectedDuration, expectedPaymentToken, value // only for native token payments
) {
    return this.callContractMethod(this.environment.MARKETPLACE_CONTRACT_ADDRESS, this.environment.MARKETPLACE_ABI, "buyAccess", [buyer, tokenId, expectedPrice, expectedDuration, expectedPaymentToken], { waitForReceipt: true, value });
}

/**
 * Checks if a user has access to a specific token based on subscription expiry.
 * @param user - The address of the user.
 * @param tokenId - The ID of the token.
 * @returns A promise that resolves to a boolean indicating if the user has access.
 */
function hasAccess(user, tokenId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const expiryTimestamp = yield this.subscriptionExpiry(tokenId, user);
            const currentTimestamp = BigInt(Math.floor(Date.now() / 1000));
            return expiryTimestamp > currentTimestamp;
        }
        catch (error) {
            return false;
        }
    });
}

function subscriptionExpiry(tokenId, user) {
    return this.callContractMethod(this.environment.MARKETPLACE_CONTRACT_ADDRESS, this.environment.MARKETPLACE_ABI, "subscriptionExpiry", [tokenId, user]);
}

/**
 * Adapter for viem WalletClient
 */
class ViemSignerAdapter {
    constructor(signer) {
        this.type = "viem";
        this.signer = signer;
    }
    getAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.signer.account) {
                return this.signer.account.address;
            }
            const accounts = yield this.signer.request({
                method: "eth_requestAccounts",
                params: [],
            });
            if (!accounts || accounts.length === 0) {
                throw new Error("No accounts found in viem wallet client");
            }
            return accounts[0];
        });
    }
    signMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield this.getAddress();
            return yield this.signer.signMessage({
                account: address,
                message,
            });
        });
    }
    signTypedData(domain, types, value) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Viem WalletClient does not support signTypedData");
        });
    }
    getChainId() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            return ((_a = this.signer.chain) === null || _a === void 0 ? void 0 : _a.id) || 1;
        });
    }
}
/**
 * Adapter for ethers Signer (v5 and v6)
 */
class EthersSignerAdapter {
    constructor(signer) {
        this.type = "ethers";
        this.signer = signer;
    }
    getAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            // Works for both ethers v5 and v6
            if (typeof this.signer.getAddress === "function") {
                return yield this.signer.getAddress();
            }
            if (this.signer.address) {
                return this.signer.address;
            }
            throw new Error("Unable to get address from ethers signer");
        });
    }
    signMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.signer.signMessage !== "function") {
                throw new Error("Signer does not support signMessage");
            }
            return yield this.signer.signMessage(message);
        });
    }
    signTypedData(domain, types, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.signer._signTypedData === "function") {
                return yield this.signer._signTypedData(domain, types, value);
            }
            if (typeof this.signer.signTypedData !== "function") {
                throw new Error("Signer does not support signTypedData or _signTypedData");
            }
            return yield this.signer.signTypedData(domain, types, value);
        });
    }
    getChainId() {
        return __awaiter(this, void 0, void 0, function* () {
            // Try ethers v6 first
            if (this.signer.provider &&
                typeof this.signer.provider.getNetwork === "function") {
                const network = yield this.signer.provider.getNetwork();
                // ethers v6 returns bigint, v5 returns number
                return typeof network.chainId === "bigint"
                    ? Number(network.chainId)
                    : network.chainId;
            }
            // Fallback for ethers v5
            if (typeof this.signer.getChainId === "function") {
                return yield this.signer.getChainId();
            }
            // Default to mainnet if we can't determine
            return 484;
        });
    }
}
/**
 * Adapter for custom signer implementations
 */
class CustomSignerAdapter {
    constructor(signer) {
        this.type = "custom";
        this.signer = signer;
    }
    getAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.signer.getAddress === "function") {
                return yield this.signer.getAddress();
            }
            if (this.signer.address) {
                return this.signer.address;
            }
            throw new Error("Custom signer must implement getAddress() or have address property");
        });
    }
    signMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.signer.signMessage !== "function") {
                throw new Error("Custom signer must implement signMessage()");
            }
            return yield this.signer.signMessage(message);
        });
    }
    signTypedData(domain, types, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.signer.signTypedData !== "function") {
                throw new Error("Custom signer must implement signTypedData()");
            }
            return yield this.signer.signTypedData(domain, types, value);
        });
    }
    getChainId() {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof this.signer.getChainId === "function") {
                const chainId = yield this.signer.getChainId();
                return typeof chainId === "bigint" ? Number(chainId) : chainId;
            }
            if (this.signer.chainId !== undefined) {
                return typeof this.signer.chainId === "bigint"
                    ? Number(this.signer.chainId)
                    : this.signer.chainId;
            }
            // Default to mainnet
            return 484;
        });
    }
}
/**
 * Factory function to create appropriate adapter based on signer type
 */
function createSignerAdapter(signer) {
    // Check for viem WalletClient
    if (signer.transport &&
        signer.chain &&
        typeof signer.signMessage === "function") {
        return new ViemSignerAdapter(signer);
    }
    // Check for ethers signer (v5 or v6)
    if (signer._isSigner ||
        (signer.provider && typeof signer.signMessage === "function")) {
        return new EthersSignerAdapter(signer);
    }
    // Try custom adapter
    return new CustomSignerAdapter(signer);
}

/**
 * EXPERIMENTAL METHOD
 * Settles a payment intent response by purchasing access if needed.
 * This method checks if the user already has access to the item, and if not,
 * it calls buyAccess with the parameters from the payment intent response.
 * Supports viem WalletClient, ethers Signer, and custom signer implementations.
 *
 * @param paymentIntentResponse - The response from getDataWithIntent containing payment details.
 * @param signer - Optional signer object used to interact with the blockchain. If not provided, uses the connected wallet client.
 * @returns A promise that resolves with the transaction hash and receipt, or null if access already exists.
 * @throws {Error} If the response doesn't contain marketplace action or if the method is not buyAccess.
 */
function settlePaymentIntent(paymentIntentResponse, signer) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!paymentIntentResponse.marketplaceAction) {
            throw new Error("No marketplace action found in X402 response");
        }
        const { marketplaceAction } = paymentIntentResponse;
        if (marketplaceAction.method !== "buyAccess") {
            throw new Error(`Unsupported marketplace action method: ${marketplaceAction.method}`);
        }
        const tokenId = BigInt(marketplaceAction.tokenId);
        const payerAddress = marketplaceAction.payer;
        const alreadyHasAccess = yield this.hasAccess(payerAddress, tokenId);
        if (alreadyHasAccess) {
            console.log("User already has access to this item");
            return null;
        }
        const expectedPrice = BigInt(marketplaceAction.amount);
        const expectedDuration = BigInt(marketplaceAction.duration);
        const expectedPaymentToken = marketplaceAction.asset;
        const isNativeToken = expectedPaymentToken === "0x0000000000000000000000000000000000000000";
        const value = isNativeToken ? expectedPrice : BigInt(0);
        if (signer) {
            const signerAdapter = createSignerAdapter(signer);
            const marketplaceAddress = this.environment
                .MARKETPLACE_CONTRACT_ADDRESS;
            const abi = this.environment.MARKETPLACE_ABI;
            const data = encodeFunctionData({
                abi,
                functionName: "buyAccess",
                args: [
                    payerAddress,
                    tokenId,
                    expectedPrice,
                    expectedDuration,
                    expectedPaymentToken,
                ],
            });
            if (signerAdapter.type === "viem") {
                const viemSigner = signerAdapter.signer;
                const txHash = yield viemSigner.sendTransaction({
                    to: marketplaceAddress,
                    data,
                    value,
                    account: (yield signerAdapter.getAddress()),
                });
                const receipt = yield viemSigner.waitForTransactionReceipt({
                    hash: txHash,
                });
                return { txHash, receipt };
            }
            else if (signerAdapter.type === "ethers") {
                const ethersSigner = signerAdapter.signer;
                const tx = yield ethersSigner.sendTransaction({
                    to: marketplaceAddress,
                    data,
                    value: value.toString(),
                });
                const receipt = yield tx.wait();
                return { txHash: tx.hash, receipt };
            }
            else {
                const customSigner = signerAdapter.signer;
                if (typeof customSigner.sendTransaction !== "function") {
                    throw new Error("Custom signer must implement sendTransaction() method");
                }
                const tx = yield customSigner.sendTransaction({
                    to: marketplaceAddress,
                    data,
                    value: value.toString(),
                });
                if (tx.wait && typeof tx.wait === "function") {
                    const receipt = yield tx.wait();
                    return { txHash: tx.hash, receipt };
                }
                return { txHash: tx.hash || tx };
            }
        }
        if (!this.viemClient) {
            throw new Error("No signer or wallet client provided for settleX402");
        }
        return yield this.buyAccess(payerAddress, tokenId, expectedPrice, expectedDuration, expectedPaymentToken, isNativeToken ? value : undefined);
    });
}

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
    if (royaltyBps < constants.MIN_ROYALTY_BPS ||
        royaltyBps > constants.MAX_ROYALTY_BPS) {
        throw new Error(`Royalty basis points must be between ${constants.MIN_ROYALTY_BPS} and ${constants.MAX_ROYALTY_BPS}`);
    }
    if (duration < constants.MIN_LICENSE_DURATION ||
        duration > constants.MAX_LICENSE_DURATION) {
        throw new Error(`Duration must be between ${constants.MIN_LICENSE_DURATION} and ${constants.MAX_LICENSE_DURATION} seconds`);
    }
    if (price < constants.MIN_PRICE) {
        throw new Error(`Price must be at least ${constants.MIN_PRICE} wei`);
    }
    return {
        price,
        duration,
        royaltyBps,
        paymentToken,
    };
};
/**
 * Defines the EIP-712 typed data structure for X402 Intent signatures.
 */
const X402_INTENT_TYPES = {
    X402Intent: [
        { name: "payer", type: "address" },
        { name: "asset", type: "address" },
        { name: "amount", type: "uint256" },
        { name: "httpMethod", type: "string" },
        { name: "payTo", type: "address" },
        { name: "tokenId", type: "uint256" },
        { name: "duration", type: "uint32" },
        { name: "expiresAt", type: "uint256" },
        { name: "nonce", type: "bytes32" },
    ],
};

const fetchTokenData = (origin, tokenId, headers) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(`${origin.environment.AUTH_HUB_BASE_API}/${origin.environment.AUTH_ENDPOINT}/origin/data/${tokenId}`, {
        method: "GET",
        headers: Object.assign({ "Content-Type": "application/json" }, headers),
    });
    return response;
});
/**
 * EXPERIMENTAL METHOD
 * Fetch data with X402 payment handling.
 * @param {bigint} tokenId The token ID to fetch data for.
 * @param {any} [signer] Optional signer object for signing the X402 intent.
 * @returns {Promise<any>} A promise that resolves with the fetched data.
 * @throws {Error} Throws an error if the data cannot be fetched or if no signer/wallet client is provided.
 */
function getDataWithIntent(tokenId, signer, decide) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const viemClient = this.viemClient;
        if (!signer && !viemClient) {
            throw new Error("No signer or wallet client provided for X402 intent.");
        }
        const initialResponse = yield fetchTokenData(this, tokenId, {});
        if (initialResponse.status !== 402) {
            if (!initialResponse.ok) {
                throw new Error("Failed to fetch data");
            }
            return initialResponse.json();
        }
        const sig = viemClient || createSignerAdapter(signer);
        const walletAddress = viemClient
            ? yield getCurrentAccount.call(this)
            : yield sig.getAddress();
        const intentData = yield initialResponse.json();
        if (intentData.error) {
            throw new Error(intentData.error);
        }
        const requirements = intentData.accepts[0];
        const x402Payload = yield buildX402Payload.call(this, requirements, checksumAddress(walletAddress), sig);
        const header = btoa(JSON.stringify(x402Payload));
        const retryResponse = yield fetchTokenData(this, tokenId, {
            "X-PAYMENT": header,
        });
        if (retryResponse.status === 402) {
            // subscription required
            if (decide) {
                const resJson = yield retryResponse.json();
                const accepted = yield decide(resJson.marketplaceAction);
                if (accepted) {
                    const settlement = yield this.settlePaymentIntent(resJson, signer || viemClient);
                    if (settlement && !settlement.txHash) {
                        throw new Error(`Failed to settle payment intent for token ID ${tokenId}`);
                    }
                    // retry fetching data after settlement
                    const finalResponse = yield this.getDataWithIntent(tokenId, signer, undefined);
                    return finalResponse;
                }
                else {
                    // user declined to proceed with payment
                    return {
                        error: "User declined to proceed with payment",
                        data: null,
                    };
                }
            }
            else {
                return retryResponse.json();
            }
        }
        if (!retryResponse.ok) {
            throw new Error("Failed to fetch data after X402 payment");
        }
        const res = yield retryResponse.json();
        return {
            error: null,
            data: (_a = res.data) !== null && _a !== void 0 ? _a : res,
        };
    });
}
/**
 * Build the X402 payment payload.
 * @private
 */
function buildX402Payload(requirements, payer, signer) {
    return __awaiter(this, void 0, void 0, function* () {
        const asset = requirements.asset === "native" ? zeroAddress : requirements.asset;
        const amount = BigInt(requirements.maxAmountRequired || 0);
        const duration = requirements.extra.duration;
        const domain = makeX402IntentDomain.call(this);
        const types = X402_INTENT_TYPES;
        const nonce = crypto.randomUUID();
        const nonceBytes32 = keccak256(toBytes(nonce));
        const payment = {
            payer: payer,
            asset: asset,
            amount: amount.toString(),
            httpMethod: "GET",
            payTo: checksumAddress(this.environment.MARKETPLACE_CONTRACT_ADDRESS),
            tokenId: requirements.extra.tokenId,
            duration: duration,
            expiresAt: Math.floor(Date.now() / 1000) + requirements.maxTimeoutSeconds,
            nonce: nonceBytes32,
        };
        const signerAdapter = createSignerAdapter(signer);
        const signature = yield signerAdapter.signTypedData(domain, types, payment);
        const x402Payload = {
            x402Version: 1,
            scheme: "exact",
            network: requirements.network,
            payload: Object.assign(Object.assign({}, payment), { sigType: "eip712", signature: signature, license: {
                    tokenId: requirements.extra.tokenId,
                    duration: duration,
                } }),
        };
        return x402Payload;
    });
}
/**
 * Create the X402 Intent domain for EIP-712 signing.
 * @private
 */
function makeX402IntentDomain() {
    return {
        name: "Origin X402 Intent",
        version: "1",
        chainId: this.environment.CHAIN.id,
        verifyingContract: this.environment
            .MARKETPLACE_CONTRACT_ADDRESS,
    };
}
/**
 * Get the current account address.
 * @private
 */
function getCurrentAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        const viemClient = this.viemClient;
        if (!viemClient) {
            throw new Error("WalletClient not connected. Please connect a wallet.");
        }
        // If account is already set on the client, return it directly
        if (viemClient.account) {
            return viemClient.account.address;
        }
        // Otherwise request accounts (browser wallet flow)
        const accounts = yield viemClient.request({
            method: "eth_requestAccounts",
            params: [],
        });
        if (!accounts || accounts.length === 0) {
            throw new Error("No accounts found in connected wallet.");
        }
        return accounts[0];
    });
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

var _Origin_instances, _Origin_generateURL, _Origin_setOriginStatus, _Origin_uploadToIPFS, _Origin_uploadFile, _Origin_waitForTxReceipt, _Origin_ensureChainId, _Origin_getCurrentAccount, _Origin_resolveWalletAddress;
/**
 * The Origin class
 * Handles interactions with Origin protocol.
 */
class Origin {
    constructor(environment, jwt, viemClient, baseParentId) {
        _Origin_instances.add(this);
        if (jwt) {
            this.jwt = jwt;
        }
        else {
            console.warn("JWT not provided. Some features may be unavailable.");
        }
        this.viemClient = viemClient;
        this.environment =
            typeof environment === "string"
                ? ENVIRONMENTS[environment]
                : environment || ENVIRONMENTS["DEVELOPMENT"];
        this.baseParentId = baseParentId;
        // DataNFT methods
        this.mintWithSignature = mintWithSignature.bind(this);
        this.registerIpNFT = registerIpNFT.bind(this);
        this.updateTerms = updateTerms.bind(this);
        this.finalizeDelete = finalizeDelete.bind(this);
        this.getOrCreateRoyaltyVault = getOrCreateRoyaltyVault.bind(this);
        this.getTerms = getTerms.bind(this);
        this.ownerOf = ownerOf.bind(this);
        this.balanceOf = balanceOf.bind(this);
        this.tokenURI = tokenURI.bind(this);
        this.dataStatus = dataStatus.bind(this);
        this.isApprovedForAll = isApprovedForAll.bind(this);
        this.transferFrom = transferFrom.bind(this);
        this.safeTransferFrom = safeTransferFrom.bind(this);
        this.approve = approve.bind(this);
        this.setApprovalForAll = setApprovalForAll.bind(this);
        // Marketplace methods
        this.buyAccess = buyAccess.bind(this);
        this.hasAccess = hasAccess.bind(this);
        this.subscriptionExpiry = subscriptionExpiry.bind(this);
        this.settlePaymentIntent = settlePaymentIntent.bind(this);
        this.getDataWithIntent = getDataWithIntent.bind(this);
    }
    getJwt() {
        return this.jwt;
    }
    setViemClient(client) {
        this.viemClient = client;
    }
    /**
     * Mints a file-based IpNFT.
     * @param file The file to mint.
     * @param metadata The metadata associated with the file.
     * @param license The license terms for the IpNFT.
     * @param parents Optional parent token IDs for lineage tracking.
     * @param options Optional parameters including progress callback, preview image, and use asset as preview flag.
     * @returns The token ID of the minted IpNFT as a string, or null if minting failed.
     */
    mintFile(file, metadata, license, parents, options) {
        return __awaiter(this, void 0, void 0, function* () {
            let account = null;
            try {
                account = yield __classPrivateFieldGet(this, _Origin_instances, "m", _Origin_getCurrentAccount).call(this);
            }
            catch (error) {
                throw new Error("Failed to mint file IP. Wallet not connected.");
            }
            let info;
            try {
                info = yield __classPrivateFieldGet(this, _Origin_instances, "m", _Origin_uploadFile).call(this, file, options);
                if (!info || !info.key) {
                    throw new Error("Failed to upload file or get upload info.");
                }
            }
            catch (error) {
                throw new Error(`File upload failed: ${error instanceof Error ? error.message : String(error)}`);
            }
            if (file.type) {
                metadata.mimetype = file.type;
            }
            let previewImageIpfsHash = null;
            if ((options === null || options === void 0 ? void 0 : options.previewImage) &&
                (options === null || options === void 0 ? void 0 : options.previewImage.type.startsWith("image/"))) {
                previewImageIpfsHash = yield __classPrivateFieldGet(this, _Origin_instances, "m", _Origin_uploadToIPFS).call(this, options.previewImage);
            }
            else if ((options === null || options === void 0 ? void 0 : options.useAssetAsPreview) && file.type.startsWith("image/")) {
                previewImageIpfsHash = yield __classPrivateFieldGet(this, _Origin_instances, "m", _Origin_uploadToIPFS).call(this, file);
            }
            if (previewImageIpfsHash) {
                metadata.image = `ipfs://${previewImageIpfsHash}`;
            }
            const deadline = BigInt(Date.now() + 600000); // 10 minutes from now
            if (this.baseParentId) {
                if (!parents) {
                    parents = [];
                }
                parents.unshift(this.baseParentId);
            }
            let registration;
            try {
                registration = yield this.registerIpNFT("file", deadline, license, metadata, info.key, parents);
            }
            catch (error) {
                yield __classPrivateFieldGet(this, _Origin_instances, "m", _Origin_setOriginStatus).call(this, info.key, "failed");
                throw new Error(`Failed to register IpNFT: ${error instanceof Error ? error.message : String(error)}`);
            }
            const { tokenId, signerAddress, creatorContentHash, signature, uri } = registration;
            if (!tokenId ||
                !signerAddress ||
                !creatorContentHash ||
                signature === undefined ||
                !uri) {
                throw new Error("Failed to register IpNFT: Missing required fields in registration response.");
            }
            try {
                const mintResult = yield this.mintWithSignature(account, tokenId, parents || [], true, creatorContentHash, uri, license, deadline, signature);
                if (["0x1", "success"].indexOf(mintResult.receipt.status) === -1) {
                    yield __classPrivateFieldGet(this, _Origin_instances, "m", _Origin_setOriginStatus).call(this, info.key, "failed");
                    throw new Error(`Minting failed with status: ${mintResult.receipt.status}`);
                }
            }
            catch (error) {
                yield __classPrivateFieldGet(this, _Origin_instances, "m", _Origin_setOriginStatus).call(this, info.key, "failed");
                throw new Error(`Minting transaction failed: ${error instanceof Error ? error.message : String(error)}`);
            }
            return tokenId.toString();
        });
    }
    /**
     * Mints a social IpNFT.
     * @param source The social media source (spotify, twitter, tiktok).
     * @param metadata The metadata associated with the social media content.
     * @param license The license terms for the IpNFT.
     * @return The token ID of the minted IpNFT as a string, or null if minting failed.
     */
    mintSocial(source, metadata, license) {
        return __awaiter(this, void 0, void 0, function* () {
            let account = null;
            try {
                account = yield __classPrivateFieldGet(this, _Origin_instances, "m", _Origin_getCurrentAccount).call(this);
            }
            catch (error) {
                throw new Error("Failed to mint social IP. Wallet not connected.");
            }
            metadata.mimetype = `social/${source}`;
            const deadline = BigInt(Math.floor(Date.now() / 1000) + 600); // 10 minutes from now
            let parents = this.baseParentId ? [this.baseParentId] : [];
            let registration;
            try {
                registration = yield this.registerIpNFT(source, deadline, license, metadata, undefined, parents);
            }
            catch (error) {
                throw new Error(`Failed to register Social IpNFT: ${error instanceof Error ? error.message : String(error)}`);
            }
            const { tokenId, signerAddress, creatorContentHash, signature, uri } = registration;
            if (!tokenId ||
                !signerAddress ||
                !creatorContentHash ||
                signature === undefined ||
                !uri) {
                throw new Error("Failed to register Social IpNFT: Missing required fields in registration response.");
            }
            try {
                const mintResult = yield this.mintWithSignature(account, tokenId, parents, true, creatorContentHash, uri, license, deadline, signature);
                if (["0x1", "success"].indexOf(mintResult.receipt.status) === -1) {
                    throw new Error(`Minting Social IpNFT failed with status: ${mintResult.receipt.status}`);
                }
            }
            catch (error) {
                throw new Error(`Minting transaction failed: ${error instanceof Error ? error.message : String(error)}`);
            }
            return tokenId.toString();
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
            var _a;
            let account = null;
            try {
                account = yield __classPrivateFieldGet(this, _Origin_instances, "m", _Origin_getCurrentAccount).call(this);
            }
            catch (error) {
                throw new Error("Failed to call contract method. Wallet not connected.");
            }
            const abiItem = getAbiItem({ abi, name: methodName });
            const isView = abiItem &&
                "stateMutability" in abiItem &&
                (abiItem.stateMutability === "view" ||
                    abiItem.stateMutability === "pure");
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
            yield __classPrivateFieldGet(this, _Origin_instances, "m", _Origin_ensureChainId).call(this, this.environment.CHAIN);
            const publicClient = getPublicClient();
            // simulate
            const { result: simulatedResult, request } = yield publicClient.simulateContract({
                account: account,
                address: contractAddress,
                abi,
                functionName: methodName,
                args: params,
                value: options.value,
            });
            if (options.simulate) {
                return simulatedResult;
            }
            try {
                const txHash = yield ((_a = this.viemClient) === null || _a === void 0 ? void 0 : _a.writeContract(request));
                if (typeof txHash !== "string") {
                    throw new Error("Transaction failed to send.");
                }
                if (!options.waitForReceipt) {
                    return { txHash, simulatedResult };
                }
                const receipt = yield __classPrivateFieldGet(this, _Origin_instances, "m", _Origin_waitForTxReceipt).call(this, txHash);
                return { txHash, receipt, simulatedResult };
            }
            catch (error) {
                console.error("Transaction failed:", error);
                throw new Error("Transaction failed: " + error);
            }
        });
    }
    /**
     * Buy access to an asset by first checking its price via getTerms, then calling buyAccess.
     * @param {bigint} tokenId The token ID of the asset.
     * @returns {Promise<any>} The result of the buyAccess call.
     */
    buyAccessSmart(tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            let account = null;
            try {
                account = yield __classPrivateFieldGet(this, _Origin_instances, "m", _Origin_getCurrentAccount).call(this);
            }
            catch (error) {
                throw new Error("Failed to buy access. Wallet not connected.");
            }
            const terms = yield this.getTerms(tokenId);
            if (!terms)
                throw new Error("Failed to fetch terms for asset");
            const { price, paymentToken, duration } = terms;
            if (price === undefined ||
                paymentToken === undefined ||
                duration === undefined) {
                throw new Error("Terms missing price, paymentToken, or duration");
            }
            const totalCost = price;
            const isNative = paymentToken === zeroAddress;
            if (isNative) {
                return this.buyAccess(account, tokenId, totalCost, duration, paymentToken, totalCost);
            }
            yield approveIfNeeded({
                walletClient: this.viemClient,
                publicClient: getPublicClient(),
                tokenAddress: paymentToken,
                owner: account,
                spender: this.environment.MARKETPLACE_CONTRACT_ADDRESS,
                amount: totalCost,
            });
            return this.buyAccess(account, tokenId, totalCost, duration, paymentToken);
        });
    }
    /**
     * Fetch the underlying data associated with a specific token ID.
     * @param {bigint} tokenId - The token ID to fetch data for.
     * @returns {Promise<any>} A promise that resolves with the fetched data.
     * @throws {Error} Throws an error if the data cannot be fetched.
     */
    getData(tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/data/${tokenId}`, {
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
    /**
     * Get the Token Bound Account (TBA) address for a specific token ID.
     * @param {bigint} tokenId - The token ID to get the TBA address for.
     * @returns {Promise<Address>} A promise that resolves with the TBA address.
     * @throws {Error} Throws an error if the TBA address cannot be retrieved.
     * @example
     * ```typescript
     * const tbaAddress = await origin.getTokenBoundAccount(1n);
     * console.log(`TBA Address: ${tbaAddress}`);
     * ```
     */
    getTokenBoundAccount(tokenId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tbaAddress = yield this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS, this.environment.IPNFT_ABI, "getAccount", [tokenId], { simulate: true });
                return tbaAddress;
            }
            catch (error) {
                throw new Error(`Failed to get Token Bound Account for token ${tokenId}: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    /**
     * Get royalty information for a token ID, including the token bound account address and its balance.
     * @param {bigint} tokenId - The token ID to check royalties for.
     * @param {Address} [token] - Optional token address to check royalties for. If not provided, checks for native token.
     * @returns {Promise<RoyaltyInfo>} A promise that resolves with the token bound account address and balance information.
     * @throws {Error} Throws an error if the token bound account cannot be retrieved.
     * @example
     * ```typescript
     * // Get royalties for a specific token
     * const royalties = await origin.getRoyalties(1n);
     *
     * // Get ERC20 token royalties for a specific token
     * const royalties = await origin.getRoyalties(1n, "0x1234...");
     * ```
     */
    getRoyalties(tokenId, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tokenBoundAccount = yield this.getTokenBoundAccount(tokenId);
                const publicClient = getPublicClient();
                let balance;
                let balanceFormatted;
                if (!token || token === zeroAddress) {
                    balance = yield publicClient.getBalance({
                        address: tokenBoundAccount,
                    });
                    balanceFormatted = formatEther(balance);
                }
                else {
                    // erc20 (wrapped camp)
                    const erc20Abi = [
                        {
                            inputs: [{ name: "owner", type: "address" }],
                            name: "balanceOf",
                            outputs: [{ name: "", type: "uint256" }],
                            stateMutability: "view",
                            type: "function",
                        },
                        {
                            inputs: [],
                            name: "decimals",
                            outputs: [{ name: "", type: "uint8" }],
                            stateMutability: "view",
                            type: "function",
                        },
                    ];
                    balance = yield this.callContractMethod(token, erc20Abi, "balanceOf", [
                        tokenBoundAccount,
                    ]);
                    const decimals = yield this.callContractMethod(token, erc20Abi, "decimals", []);
                    balanceFormatted = formatUnits(balance, decimals);
                }
                return {
                    tokenBoundAccount,
                    balance,
                    balanceFormatted,
                };
            }
            catch (error) {
                throw new Error(`Failed to retrieve royalties for token ${tokenId}: ${error instanceof Error ? error.message : String(error)}`);
            }
        });
    }
    /**
     * Claim royalties from a token's Token Bound Account (TBA).
     * @param {bigint} tokenId - The token ID to claim royalties from.
     * @param {Address} [recipient] - Optional recipient address. If not provided, uses the connected wallet.
     * @param {Address} [token] - Optional token address to claim royalties in. If not provided, claims in native token.
     * @returns {Promise<any>} A promise that resolves when the claim transaction is confirmed.
     * @throws {Error} Throws an error if no wallet is connected and no recipient address is provided.
     * @example
     * ```typescript
     * // Claim native token royalties for token #1 to connected wallet
     * await origin.claimRoyalties(1n);
     *
     * // Claim ERC20 token royalties to a specific address
     * await origin.claimRoyalties(1n, "0xRecipient...", "0xToken...");
     * ```
     */
    claimRoyalties(tokenId, recipient, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const recipientAddress = yield __classPrivateFieldGet(this, _Origin_instances, "m", _Origin_resolveWalletAddress).call(this, recipient);
            const tokenBoundAccount = yield this.getTokenBoundAccount(tokenId);
            // Get the balance to transfer
            const royaltyInfo = yield this.getRoyalties(tokenId, token);
            const balance = royaltyInfo.balance;
            if (balance === BigInt(0)) {
                throw new Error("No royalties available to claim");
            }
            let to;
            let value;
            let data;
            if (!token || token === zeroAddress) {
                // Native token transfer
                to = recipientAddress;
                value = balance;
                data = "0x";
            }
            else {
                // ERC20 token transfer
                to = token;
                value = BigInt(0);
                // Encode ERC20 transfer call: transfer(address to, uint256 amount)
                data = encodeFunctionData({
                    abi: [
                        {
                            inputs: [
                                { name: "to", type: "address" },
                                { name: "amount", type: "uint256" },
                            ],
                            name: "transfer",
                            outputs: [{ name: "", type: "bool" }],
                            stateMutability: "nonpayable",
                            type: "function",
                        },
                    ],
                    functionName: "transfer",
                    args: [recipientAddress, balance],
                });
            }
            // Call execute on the TBA
            return this.callContractMethod(tokenBoundAccount, this.environment.TBA_ABI, "execute", [to, value, data, 0], // operation: 0 = CALL
            { waitForReceipt: true, value: BigInt(0) });
        });
    }
}
_Origin_instances = new WeakSet(), _Origin_generateURL = function _Origin_generateURL(file) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const uploadRes = yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/upload-url`, {
                method: "POST",
                body: JSON.stringify({
                    name: file.name,
                    type: file.type,
                }),
                headers: {
                    Authorization: `Bearer ${this.jwt}`,
                    "Content-Type": "application/json",
                },
            });
            if (!uploadRes.ok) {
                throw new Error(`HTTP ${uploadRes.status}: ${uploadRes.statusText}`);
            }
            const data = yield uploadRes.json();
            if (data.isError) {
                throw new Error(data.message || "Failed to generate upload URL");
            }
            return data.data;
        }
        catch (error) {
            console.error("Failed to generate upload URL:", error);
            throw error;
        }
    });
}, _Origin_setOriginStatus = function _Origin_setOriginStatus(key, status) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/update-status`, {
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
                const errorText = yield res.text().catch(() => "Unknown error");
                throw new Error(`HTTP ${res.status}: ${errorText}`);
            }
            return true;
        }
        catch (error) {
            console.error("Failed to update origin status:", error);
            throw error;
        }
    });
}, _Origin_uploadToIPFS = function _Origin_uploadToIPFS(image) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!image)
            return null;
        try {
            const presignedResponse = yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/upload-url-ipfs`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.jwt}`,
                },
                body: JSON.stringify({
                    fileName: image.name,
                    fileType: image.type,
                }),
            });
            if (!presignedResponse.ok) {
                const errorText = yield presignedResponse
                    .text()
                    .catch(() => "Unknown error");
                throw new Error(`Failed to get presigned URL (HTTP ${presignedResponse.status}): ${errorText}`);
            }
            const presignedData = yield presignedResponse.json();
            const { isError, data: presignedUrl, message } = presignedData;
            if (isError || !presignedUrl) {
                throw new Error(`Failed to get presigned URL: ${message || "No URL returned from server"}`);
            }
            const formData = new FormData();
            formData.append("file", image);
            const uploadResponse = yield fetch(presignedUrl, {
                method: "POST",
                body: formData,
            });
            if (!uploadResponse.ok) {
                const errorText = yield uploadResponse
                    .text()
                    .catch(() => uploadResponse.statusText);
                throw new Error(`Failed to upload preview image to IPFS (HTTP ${uploadResponse.status}): ${errorText}`);
            }
            const ipfsData = yield uploadResponse.json();
            if (!ipfsData || !ipfsData.data) {
                throw new Error("Invalid response from IPFS upload: Missing data field");
            }
            return (_a = ipfsData.data) === null || _a === void 0 ? void 0 : _a.cid;
        }
        catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error("Error uploading preview image to IPFS:", errorMessage);
            throw new Error(`Failed to upload preview image to IPFS: ${errorMessage}`);
        }
    });
}, _Origin_uploadFile = function _Origin_uploadFile(file, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let uploadInfo;
        try {
            uploadInfo = yield __classPrivateFieldGet(this, _Origin_instances, "m", _Origin_generateURL).call(this, file);
        }
        catch (error) {
            console.error("Failed to generate upload URL:", error);
            throw new Error(`Failed to generate upload URL: ${error instanceof Error ? error.message : String(error)}`);
        }
        if (!uploadInfo) {
            throw new Error("Failed to generate upload URL: No upload info returned");
        }
        try {
            yield uploadWithProgress(file, uploadInfo.url, (options === null || options === void 0 ? void 0 : options.progressCallback) || (() => { }));
        }
        catch (error) {
            try {
                yield __classPrivateFieldGet(this, _Origin_instances, "m", _Origin_setOriginStatus).call(this, uploadInfo.key, "failed");
            }
            catch (statusError) {
                console.error("Failed to update status to failed:", statusError);
            }
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to upload file: ${errorMessage}`);
        }
        try {
            yield __classPrivateFieldGet(this, _Origin_instances, "m", _Origin_setOriginStatus).call(this, uploadInfo.key, "success");
        }
        catch (statusError) {
            console.error("Failed to update status to success:", statusError);
        }
        return uploadInfo;
    });
}, _Origin_waitForTxReceipt = function _Origin_waitForTxReceipt(txHash_1) {
    return __awaiter(this, arguments, void 0, function* (txHash, opts = {}) {
        var _a, _b, _c;
        const publicClient = getPublicClient();
        let currentHash = txHash;
        const confirmations = (_a = opts.confirmations) !== null && _a !== void 0 ? _a : 1;
        const timeout = (_b = opts.timeoutMs) !== null && _b !== void 0 ? _b : 180000;
        const pollingInterval = (_c = opts.pollingIntervalMs) !== null && _c !== void 0 ? _c : 1500;
        try {
            const receipt = yield publicClient.waitForTransactionReceipt({
                hash: currentHash,
                confirmations,
                timeout,
                pollingInterval,
                onReplaced: (replacement) => {
                    currentHash = replacement.transaction.hash;
                },
            });
            return receipt;
        }
        catch (err) {
            // fallback
            const start = Date.now();
            while (Date.now() - start < timeout) {
                try {
                    const receipt = yield publicClient.getTransactionReceipt({
                        hash: currentHash,
                    });
                    if (receipt && receipt.blockNumber)
                        return receipt;
                }
                catch (_d) { }
                yield new Promise((r) => setTimeout(r, pollingInterval));
            }
            throw err;
        }
    });
}, _Origin_ensureChainId = function _Origin_ensureChainId(chain) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.viemClient)
            throw new Error("WalletClient not connected. Could not ensure chain ID.");
        let currentChainId = (yield this.viemClient.request({
            method: "eth_chainId",
            params: [],
        }));
        if (typeof currentChainId === "string") {
            currentChainId = parseInt(currentChainId, 16);
        }
        if (currentChainId !== chain.id) {
            setChain(chain);
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
}, _Origin_getCurrentAccount = function _Origin_getCurrentAccount() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!this.viemClient) {
            throw new Error("WalletClient not connected. Please connect a wallet.");
        }
        // If account is already set on the client, return it directly
        if (this.viemClient.account) {
            return this.viemClient.account.address;
        }
        // Otherwise request accounts (browser wallet flow)
        const accounts = yield this.viemClient.request({
            method: "eth_requestAccounts",
            params: [],
        });
        if (!accounts || accounts.length === 0) {
            throw new Error("No accounts found in connected wallet.");
        }
        return accounts[0];
    });
}, _Origin_resolveWalletAddress = function _Origin_resolveWalletAddress(owner) {
    return __awaiter(this, void 0, void 0, function* () {
        if (owner) {
            return owner;
        }
        if (!this.viemClient) {
            throw new Error("No wallet address provided and no wallet client connected. Please provide an owner address or connect a wallet.");
        }
        try {
            const accounts = yield this.viemClient.request({
                method: "eth_requestAccounts",
                params: [],
            });
            if (!accounts || accounts.length === 0) {
                throw new Error("No accounts found in connected wallet.");
            }
            return accounts[0];
        }
        catch (error) {
            throw new Error(`Failed to get wallet address: ${error instanceof Error ? error.message : String(error)}`);
        }
    });
};

/**
 * Browser localStorage adapter
 */
class BrowserStorage {
    getItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof localStorage === "undefined") {
                return null;
            }
            return localStorage.getItem(key);
        });
    }
    setItem(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof localStorage !== "undefined") {
                localStorage.setItem(key, value);
            }
        });
    }
    removeItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof localStorage !== "undefined") {
                localStorage.removeItem(key);
            }
        });
    }
}
/**
 * In-memory storage adapter for Node.js
 */
class MemoryStorage {
    constructor() {
        this.storage = new Map();
    }
    getItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.storage.get(key) || null;
        });
    }
    setItem(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.storage.set(key, value);
        });
    }
    removeItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            this.storage.delete(key);
        });
    }
    clear() {
        this.storage.clear();
    }
}

var _Auth_instances, _Auth_triggers, _Auth_isNodeEnvironment, _Auth_signerAdapter, _Auth_storage, _Auth_trigger, _Auth_loadAuthStatusFromStorage, _Auth_requestAccount, _Auth_fetchNonce, _Auth_verifySignature, _Auth_createMessage;
const createRedirectUriObject = (redirectUri) => {
    const keys = ["twitter", "spotify"];
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
     * @param {("DEVELOPMENT"|"PRODUCTION")} [options.environment="DEVELOPMENT"] The environment to use.
     * @param {StorageAdapter} [options.storage] Custom storage adapter. Defaults to localStorage in browser, memory storage in Node.js.
     * @throws {APIError} - Throws an error if the clientId is not provided.
     */
    constructor({ clientId, redirectUri, environment = "DEVELOPMENT", baseParentId, storage, }) {
        _Auth_instances.add(this);
        _Auth_triggers.set(this, void 0);
        _Auth_isNodeEnvironment.set(this, void 0);
        _Auth_signerAdapter.set(this, void 0);
        _Auth_storage.set(this, void 0);
        if (!clientId) {
            throw new Error("clientId is required");
        }
        if (["PRODUCTION", "DEVELOPMENT"].indexOf(environment) === -1) {
            throw new Error("Invalid environment, must be DEVELOPMENT or PRODUCTION");
        }
        __classPrivateFieldSet(this, _Auth_isNodeEnvironment, typeof window === "undefined", "f");
        __classPrivateFieldSet(this, _Auth_storage, storage ||
            (__classPrivateFieldGet(this, _Auth_isNodeEnvironment, "f") ? new MemoryStorage() : new BrowserStorage()), "f");
        this.viem = null;
        this.environment = ENVIRONMENTS[environment];
        this.baseParentId = baseParentId;
        this.redirectUri = createRedirectUriObject(redirectUri);
        this.clientId = clientId;
        this.isAuthenticated = false;
        this.jwt = null;
        this.origin = null;
        this.walletAddress = null;
        this.userId = null;
        __classPrivateFieldSet(this, _Auth_triggers, {}, "f");
        // only subscribe to providers in browser environment
        if (!__classPrivateFieldGet(this, _Auth_isNodeEnvironment, "f")) {
            providerStore.subscribe((providers) => {
                __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_trigger).call(this, "providers", providers);
            });
        }
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
     * Unsubscribe from an event. Possible events are "state", "provider", "providers", and "viem".
     * @param {("state"|"provider"|"providers"|"viem")} event The event.
     * @param {function} callback The callback function.
     * @returns {void}
     */
    off(event, callback) {
        if (__classPrivateFieldGet(this, _Auth_triggers, "f")[event]) {
            __classPrivateFieldGet(this, _Auth_triggers, "f")[event] = __classPrivateFieldGet(this, _Auth_triggers, "f")[event].filter((cb) => cb !== callback);
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
        this.viem = getClient(provider, info.name, this.environment.CHAIN, address);
        if (this.origin) {
            this.origin.setViemClient(this.viem);
        }
        // TODO: only use one of these
        __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_trigger).call(this, "viem", this.viem);
        __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_trigger).call(this, "provider", { provider, info });
        __classPrivateFieldGet(this, _Auth_storage, "f").setItem("camp-sdk:provider", JSON.stringify(info));
    }
    /**
     * Set the wallet address. This is useful for edge cases where the provider can't return the wallet address. Don't use this unless you know what you're doing.
     * @param {string} walletAddress The wallet address.
     * @returns {void}
     */
    setWalletAddress(walletAddress) {
        this.walletAddress = walletAddress;
    }
    /**
     * Recover the provider from local storage.
     * @returns {Promise<void>}
     */
    recoverProvider() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            if (!this.walletAddress) {
                console.warn("No wallet address found in local storage. Please connect your wallet again.");
                return;
            }
            const providerJson = yield __classPrivateFieldGet(this, _Auth_storage, "f").getItem("camp-sdk:provider");
            if (!providerJson) {
                return;
            }
            const lastProvider = JSON.parse(providerJson);
            let provider;
            const providers = (_a = providerStore.value()) !== null && _a !== void 0 ? _a : [];
            // first pass: try to find provider by UUID/name and check if it has the right address
            // without prompting (using eth_accounts)
            for (const p of providers) {
                try {
                    if ((lastProvider.uuid && ((_b = p.info) === null || _b === void 0 ? void 0 : _b.uuid) === lastProvider.uuid) ||
                        (lastProvider.name && ((_c = p.info) === null || _c === void 0 ? void 0 : _c.name) === lastProvider.name)) {
                        // silently check if the wallet address matches first
                        const accounts = yield p.provider.request({
                            method: "eth_accounts",
                        });
                        if (accounts.length > 0 &&
                            ((_d = accounts[0]) === null || _d === void 0 ? void 0 : _d.toLowerCase()) === ((_e = this.walletAddress) === null || _e === void 0 ? void 0 : _e.toLowerCase())) {
                            provider = p;
                            break;
                        }
                    }
                }
                catch (err) {
                    console.warn("Failed to fetch accounts from provider:", err);
                }
            }
            // second pass: if no provider found by UUID/name match, try to find by address only
            // but still avoid prompting
            if (!provider) {
                for (const p of providers) {
                    try {
                        // skip providers we already checked in the first pass
                        if ((lastProvider.uuid && ((_f = p.info) === null || _f === void 0 ? void 0 : _f.uuid) === lastProvider.uuid) ||
                            (lastProvider.name && ((_g = p.info) === null || _g === void 0 ? void 0 : _g.name) === lastProvider.name)) {
                            continue;
                        }
                        const accounts = yield p.provider.request({
                            method: "eth_accounts",
                        });
                        if (accounts.length > 0 &&
                            ((_h = accounts[0]) === null || _h === void 0 ? void 0 : _h.toLowerCase()) === ((_j = this.walletAddress) === null || _j === void 0 ? void 0 : _j.toLowerCase())) {
                            provider = p;
                            break;
                        }
                    }
                    catch (err) {
                        console.warn("Failed to fetch accounts from provider:", err);
                    }
                }
            }
            // third pass: if still no provider found and we have UUID/name info,
            // try prompting the user (only for the stored provider)
            if (!provider && (lastProvider.uuid || lastProvider.name)) {
                for (const p of providers) {
                    try {
                        if ((lastProvider.uuid && ((_k = p.info) === null || _k === void 0 ? void 0 : _k.uuid) === lastProvider.uuid) ||
                            (lastProvider.name && ((_l = p.info) === null || _l === void 0 ? void 0 : _l.name) === lastProvider.name)) {
                            const accounts = yield p.provider.request({
                                method: "eth_requestAccounts",
                            });
                            if (accounts.length > 0 &&
                                ((_m = accounts[0]) === null || _m === void 0 ? void 0 : _m.toLowerCase()) === ((_o = this.walletAddress) === null || _o === void 0 ? void 0 : _o.toLowerCase())) {
                                provider = p;
                                break;
                            }
                        }
                    }
                    catch (err) {
                        console.warn("Failed to reconnect to stored provider:", err);
                    }
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
            __classPrivateFieldSet(this, _Auth_signerAdapter, undefined, "f");
            yield __classPrivateFieldGet(this, _Auth_storage, "f").removeItem("camp-sdk:wallet-address");
            yield __classPrivateFieldGet(this, _Auth_storage, "f").removeItem("camp-sdk:user-id");
            yield __classPrivateFieldGet(this, _Auth_storage, "f").removeItem("camp-sdk:jwt");
            yield __classPrivateFieldGet(this, _Auth_storage, "f").removeItem("camp-sdk:environment");
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
                    this.origin = new Origin(this.environment, this.jwt, this.viem, this.baseParentId);
                    yield __classPrivateFieldGet(this, _Auth_storage, "f").setItem("camp-sdk:jwt", this.jwt);
                    yield __classPrivateFieldGet(this, _Auth_storage, "f").setItem("camp-sdk:wallet-address", this.walletAddress);
                    yield __classPrivateFieldGet(this, _Auth_storage, "f").setItem("camp-sdk:user-id", this.userId);
                    yield __classPrivateFieldGet(this, _Auth_storage, "f").setItem("camp-sdk:environment", this.environment.NAME);
                    __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_trigger).call(this, "state", "authenticated");
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
     * Connect with a custom signer (for Node.js or custom wallet implementations).
     * This method bypasses browser wallet interactions and uses the provided signer directly.
     * @param {any} signer The signer instance (viem WalletClient, ethers Signer, or custom signer).
     * @param {object} [options] Optional configuration.
     * @param {string} [options.domain] The domain to use in SIWE message (defaults to 'localhost').
     * @param {string} [options.uri] The URI to use in SIWE message (defaults to 'http://localhost').
     * @returns {Promise<{ success: boolean; message: string; walletAddress: string }>} A promise that resolves with the authentication result.
     * @throws {APIError} - Throws an error if authentication fails.
     * @example
     * // Using with ethers
     * const signer = new ethers.Wallet(privateKey, provider);
     * await auth.connectWithSigner(signer, { domain: 'myapp.com', uri: 'https://myapp.com' });
     *
     * // Using with viem
     * const account = privateKeyToAccount('0x...');
     * const client = createWalletClient({ account, chain: mainnet, transport: http() });
     * await auth.connectWithSigner(client);
     */
    connectWithSigner(signer, options) {
        return __awaiter(this, void 0, void 0, function* () {
            __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_trigger).call(this, "state", "loading");
            try {
                __classPrivateFieldSet(this, _Auth_signerAdapter, createSignerAdapter(signer), "f");
                this.walletAddress = checksumAddress((yield __classPrivateFieldGet(this, _Auth_signerAdapter, "f").getAddress()));
                // store the signer as viem client if it's a viem client, otherwise keep adapter
                if (__classPrivateFieldGet(this, _Auth_signerAdapter, "f").type === "viem") {
                    this.viem = signer;
                }
                const nonce = yield __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_fetchNonce).call(this);
                const message = __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_createMessage).call(this, nonce, options === null || options === void 0 ? void 0 : options.domain, options === null || options === void 0 ? void 0 : options.uri);
                const signature = yield __classPrivateFieldGet(this, _Auth_signerAdapter, "f").signMessage(message);
                const res = yield __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_verifySignature).call(this, message, signature);
                if (res.success) {
                    this.isAuthenticated = true;
                    this.userId = res.userId;
                    this.jwt = res.token;
                    this.origin = new Origin(this.environment, this.jwt, this.viem, this.baseParentId);
                    yield __classPrivateFieldGet(this, _Auth_storage, "f").setItem("camp-sdk:jwt", this.jwt);
                    yield __classPrivateFieldGet(this, _Auth_storage, "f").setItem("camp-sdk:wallet-address", this.walletAddress);
                    yield __classPrivateFieldGet(this, _Auth_storage, "f").setItem("camp-sdk:user-id", this.userId);
                    yield __classPrivateFieldGet(this, _Auth_storage, "f").setItem("camp-sdk:environment", this.environment.NAME);
                    __classPrivateFieldGet(this, _Auth_instances, "m", _Auth_trigger).call(this, "state", "authenticated");
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
                __classPrivateFieldSet(this, _Auth_signerAdapter, undefined, "f");
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
            const connections = yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/client-user/connections-sdk`, {
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
     * @throws {Error} - Throws an error if the user is not authenticated or in Node.js environment.
     */
    linkTwitter() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new Error("User needs to be authenticated");
            }
            if (__classPrivateFieldGet(this, _Auth_isNodeEnvironment, "f")) {
                throw new Error("Social linking requires browser environment for OAuth flow");
            }
            window.location.href = `${this.environment.AUTH_HUB_BASE_API}/twitter/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri["twitter"]}`;
        });
    }
    /**
     * Link the user's Discord account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated or in Node.js environment.
     */
    linkDiscord() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new Error("User needs to be authenticated");
            }
            if (__classPrivateFieldGet(this, _Auth_isNodeEnvironment, "f")) {
                throw new Error("Social linking requires browser environment for OAuth flow");
            }
            window.location.href = `${this.environment.AUTH_HUB_BASE_API}/discord/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri["discord"]}`;
        });
    }
    /**
     * Link the user's Spotify account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated or in Node.js environment.
     */
    linkSpotify() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isAuthenticated) {
                throw new Error("User needs to be authenticated");
            }
            if (__classPrivateFieldGet(this, _Auth_isNodeEnvironment, "f")) {
                throw new Error("Social linking requires browser environment for OAuth flow");
            }
            window.location.href = `${this.environment.AUTH_HUB_BASE_API}/spotify/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri["spotify"]}`;
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
            const data = yield fetch(`${this.environment.AUTH_HUB_BASE_API}/tiktok/connect-sdk`, {
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
            const data = yield fetch(`${this.environment.AUTH_HUB_BASE_API}/telegram/sendOTP-sdk`, {
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
            const data = yield fetch(`${this.environment.AUTH_HUB_BASE_API}/telegram/signIn-sdk`, {
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
            const data = yield fetch(`${this.environment.AUTH_HUB_BASE_API}/twitter/disconnect-sdk`, {
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
            const data = yield fetch(`${this.environment.AUTH_HUB_BASE_API}/discord/disconnect-sdk`, {
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
            const data = yield fetch(`${this.environment.AUTH_HUB_BASE_API}/spotify/disconnect-sdk`, {
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
            const data = yield fetch(`${this.environment.AUTH_HUB_BASE_API}/tiktok/disconnect-sdk`, {
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
            const data = yield fetch(`${this.environment.AUTH_HUB_BASE_API}/telegram/disconnect-sdk`, {
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
_Auth_triggers = new WeakMap(), _Auth_isNodeEnvironment = new WeakMap(), _Auth_signerAdapter = new WeakMap(), _Auth_storage = new WeakMap(), _Auth_instances = new WeakSet(), _Auth_trigger = function _Auth_trigger(event, data) {
    if (__classPrivateFieldGet(this, _Auth_triggers, "f")[event]) {
        __classPrivateFieldGet(this, _Auth_triggers, "f")[event].forEach((callback) => callback(data));
    }
}, _Auth_loadAuthStatusFromStorage = function _Auth_loadAuthStatusFromStorage(provider) {
    return __awaiter(this, void 0, void 0, function* () {
        const walletAddress = yield __classPrivateFieldGet(this, _Auth_storage, "f").getItem("camp-sdk:wallet-address");
        const userId = yield __classPrivateFieldGet(this, _Auth_storage, "f").getItem("camp-sdk:user-id");
        const jwt = yield __classPrivateFieldGet(this, _Auth_storage, "f").getItem("camp-sdk:jwt");
        const lastEnvironment = yield __classPrivateFieldGet(this, _Auth_storage, "f").getItem("camp-sdk:environment");
        if (walletAddress &&
            userId &&
            jwt &&
            (lastEnvironment === this.environment.NAME || !lastEnvironment)) {
            this.walletAddress = walletAddress;
            this.userId = userId;
            this.jwt = jwt;
            this.origin = new Origin(this.environment, this.jwt, this.viem, this.baseParentId);
            this.isAuthenticated = true;
            if (provider) {
                this.setProvider({
                    provider: provider.provider,
                    info: provider.info || {
                        name: "Unknown",
                    },
                    address: walletAddress,
                });
            }
            else if (!__classPrivateFieldGet(this, _Auth_isNodeEnvironment, "f")) {
                console.warn("No matching provider was given for the stored wallet address. Trying to recover provider.");
                yield this.recoverProvider();
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
            const res = yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/client-user/nonce`, {
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
            const res = yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/client-user/verify`, {
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
}, _Auth_createMessage = function _Auth_createMessage(nonce, domain, uri) {
    return createSiweMessage({
        domain: domain ||
            (__classPrivateFieldGet(this, _Auth_isNodeEnvironment, "f") ? "localhost" : window.location.host),
        address: this.walletAddress,
        statement: constants.SIWE_MESSAGE_STATEMENT,
        uri: uri ||
            (__classPrivateFieldGet(this, _Auth_isNodeEnvironment, "f") ? "http://localhost" : window.location.origin),
        version: "1",
        chainId: this.environment.CHAIN.id,
        nonce: nonce,
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
        queryFn: () => { var _a; return (_a = auth === null || auth === void 0 ? void 0 : auth.getLinkedSocials()) !== null && _a !== void 0 ? _a : Promise.resolve(null); },
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

var css_248z$3 = ".toasts-module_toast-container__39POD{bottom:10px;display:flex;flex-direction:column-reverse;gap:10px;position:fixed;right:10px;z-index:1000}.toasts-module_toast__z747D{word-wrap:break-word;box-shadow:0 2px 10px rgba(0,0,0,.1);color:#fff;cursor:pointer;font-family:Work Sans,sans-serif;font-size:14px;max-width:300px;opacity:.9;padding:10px 20px;position:relative}.toasts-module_toast-info__rM92k{background-color:#007bff}.toasts-module_toast-warning__WQSMC{background-color:#cc4e02}.toasts-module_toast-error__TpDbQ{background-color:#dc3545}.toasts-module_toast-success__Yk4FE{background-color:#28a745}.toasts-module_toast-enter__Gh-yK{animation:toasts-module_toast-in__CtZB9 .3s forwards}.toasts-module_toast-exit__fUAOs{animation:toasts-module_toast-out__YqBLr .3s forwards}@keyframes toasts-module_toast-in__CtZB9{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toasts-module_toast-out__YqBLr{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(20px)}}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvYXN0cy5tb2R1bGUuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNDQUVFLFdBQVksQ0FHWixZQUFhLENBQ2IsNkJBQThCLENBQzlCLFFBQVMsQ0FOVCxjQUFlLENBRWYsVUFBVyxDQUNYLFlBSUYsQ0FFQSw0QkFVRSxvQkFBcUIsQ0FMckIsb0NBQXlDLENBRnpDLFVBQVcsQ0FJWCxjQUFlLENBSWYsZ0NBQW9DLENBUHBDLGNBQWUsQ0FLZixlQUFnQixDQUhoQixVQUFZLENBTFosaUJBQWtCLENBT2xCLGlCQUlGLENBRUEsaUNBQ0Usd0JBQ0YsQ0FFQSxvQ0FDRSx3QkFDRixDQUVBLGtDQUNFLHdCQUNGLENBRUEsb0NBQ0Usd0JBQ0YsQ0FFQSxrQ0FDRSxvREFDRixDQUVBLGlDQUNFLHFEQUNGLENBRUEseUNBQ0UsR0FDRSxTQUFVLENBQ1YsMEJBQ0YsQ0FDQSxHQUNFLFNBQVUsQ0FDVix1QkFDRixDQUNGLENBRUEsMENBQ0UsR0FDRSxTQUFVLENBQ1YsdUJBQ0YsQ0FDQSxHQUNFLFNBQVUsQ0FDViwwQkFDRixDQUNGIiwiZmlsZSI6InRvYXN0cy5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnRvYXN0LWNvbnRhaW5lciB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgYm90dG9tOiAxMHB4O1xuICByaWdodDogMTBweDtcbiAgei1pbmRleDogMTAwMDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbi1yZXZlcnNlO1xuICBnYXA6IDEwcHg7XG59XG5cbi50b2FzdCB7XG4gIHBhZGRpbmc6IDEwcHggMjBweDtcbiAgLyogYm9yZGVyLXJhZGl1czogNXB4OyAqL1xuICBjb2xvcjogI2ZmZjtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBib3gtc2hhZG93OiAwIDJweCAxMHB4IHJnYmEoMCwgMCwgMCwgMC4xKTtcbiAgb3BhY2l0eTogMC45O1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgbWF4LXdpZHRoOiAzMDBweDtcbiAgd29yZC13cmFwOiBicmVhay13b3JkO1xuICBmb250LWZhbWlseTogXCJXb3JrIFNhbnNcIiwgc2Fucy1zZXJpZjtcbn1cblxuLnRvYXN0LWluZm8ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDA3YmZmO1xufVxuXG4udG9hc3Qtd2FybmluZyB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNjYzRlMDI7XG59XG5cbi50b2FzdC1lcnJvciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNkYzM1NDU7XG59XG5cbi50b2FzdC1zdWNjZXNzIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzI4YTc0NTtcbn1cblxuLnRvYXN0LWVudGVyIHtcbiAgYW5pbWF0aW9uOiB0b2FzdC1pbiAwLjNzIGZvcndhcmRzO1xufVxuXG4udG9hc3QtZXhpdCB7XG4gIGFuaW1hdGlvbjogdG9hc3Qtb3V0IDAuM3MgZm9yd2FyZHM7XG59XG5cbkBrZXlmcmFtZXMgdG9hc3QtaW4ge1xuICBmcm9tIHtcbiAgICBvcGFjaXR5OiAwO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgyMHB4KTtcbiAgfVxuICB0byB7XG4gICAgb3BhY2l0eTogMTtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XG4gIH1cbn1cblxuQGtleWZyYW1lcyB0b2FzdC1vdXQge1xuICBmcm9tIHtcbiAgICBvcGFjaXR5OiAxO1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbiAgfVxuICB0byB7XG4gICAgb3BhY2l0eTogMDtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMjBweCk7XG4gIH1cbn1cbiJdfQ== */";
var styles$2 = {"toast-container":"toasts-module_toast-container__39POD","toast":"toasts-module_toast__z747D","toast-info":"toasts-module_toast-info__rM92k","toast-warning":"toasts-module_toast-warning__WQSMC","toast-error":"toasts-module_toast-error__TpDbQ","toast-success":"toasts-module_toast-success__Yk4FE","toast-enter":"toasts-module_toast-enter__Gh-yK","toast-in":"toasts-module_toast-in__CtZB9","toast-exit":"toasts-module_toast-exit__fUAOs","toast-out":"toasts-module_toast-out__YqBLr"};
styleInject(css_248z$3);

var css_248z$2 = ".tooltip-module_tooltip-container__X8blY{display:inline-block;min-height:-moz-fit-content;min-height:fit-content;position:relative}.tooltip-module_tooltip__IN7yd{font-family:Work Sans,sans-serif;font-size:.875rem;font-weight:500;min-height:-moz-fit-content;min-height:fit-content;opacity:0;padding:.5rem .75rem;position:absolute;transition:opacity .2s ease,visibility .2s ease;visibility:hidden;white-space:nowrap;z-index:100}@keyframes tooltip-module_fadeIn__KR3aX{0%{opacity:0;visibility:hidden}to{opacity:1;visibility:visible}}@keyframes tooltip-module_fadeOut__JJntn{0%{opacity:1;visibility:visible}to{opacity:0;visibility:hidden}}.tooltip-module_tooltip__IN7yd.tooltip-module_show__0eq9c{animation:tooltip-module_fadeIn__KR3aX .2s ease-in-out forwards}.tooltip-module_tooltip__IN7yd.tooltip-module_top__5rD4C{bottom:100%;left:50%;margin-bottom:.5rem;transform:translateX(-50%)}.tooltip-module_tooltip__IN7yd.tooltip-module_bottom__Bk3EH{left:50%;margin-top:.5rem;top:100%;transform:translateX(-50%)}.tooltip-module_tooltip__IN7yd.tooltip-module_left__PRFtS{margin-right:.5rem;right:100%;top:50%;transform:translateY(-50%)}.tooltip-module_tooltip__IN7yd.tooltip-module_right__nQugl{left:100%;margin-left:.5rem;top:50%;transform:translateY(-50%)}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2x0aXAubW9kdWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx5Q0FFRSxvQkFBcUIsQ0FDckIsMkJBQXVCLENBQXZCLHNCQUF1QixDQUZ2QixpQkFHRixDQUVBLCtCQVlFLGdDQUFvQyxDQVJwQyxpQkFBbUIsQ0FDbkIsZUFBZ0IsQ0FNaEIsMkJBQXVCLENBQXZCLHNCQUF1QixDQUh2QixTQUFVLENBTlYsb0JBQXVCLENBRHZCLGlCQUFrQixDQVNsQiwrQ0FBbUQsQ0FEbkQsaUJBQWtCLENBSGxCLGtCQUFtQixDQUNuQixXQU1GLENBRUEsd0NBQ0UsR0FDRSxTQUFVLENBQ1YsaUJBQ0YsQ0FDQSxHQUNFLFNBQVUsQ0FDVixrQkFDRixDQUNGLENBRUEseUNBQ0UsR0FDRSxTQUFVLENBQ1Ysa0JBQ0YsQ0FDQSxHQUNFLFNBQVUsQ0FDVixpQkFDRixDQUNGLENBQ0EsMERBQ0UsK0RBQ0YsQ0FFQSx5REFDRSxXQUFZLENBQ1osUUFBUyxDQUVULG1CQUFxQixDQURyQiwwQkFFRixDQUVBLDREQUVFLFFBQVMsQ0FFVCxnQkFBa0IsQ0FIbEIsUUFBUyxDQUVULDBCQUVGLENBRUEsMERBSUUsa0JBQW9CLENBSHBCLFVBQVcsQ0FDWCxPQUFRLENBQ1IsMEJBRUYsQ0FFQSwyREFDRSxTQUFVLENBR1YsaUJBQW1CLENBRm5CLE9BQVEsQ0FDUiwwQkFFRiIsImZpbGUiOiJ0b29sdGlwLm1vZHVsZS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIudG9vbHRpcC1jb250YWluZXIge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcbiAgbWluLWhlaWdodDogZml0LWNvbnRlbnQ7XG59XG5cbi50b29sdGlwIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBwYWRkaW5nOiAwLjVyZW0gMC43NXJlbTtcbiAgLyogYm9yZGVyLXJhZGl1czogMC4yNXJlbTsgKi9cbiAgZm9udC1zaXplOiAwLjg3NXJlbTtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgei1pbmRleDogMTAwO1xuICBvcGFjaXR5OiAwO1xuICB2aXNpYmlsaXR5OiBoaWRkZW47XG4gIHRyYW5zaXRpb246IG9wYWNpdHkgMC4ycyBlYXNlLCB2aXNpYmlsaXR5IDAuMnMgZWFzZTtcbiAgbWluLWhlaWdodDogZml0LWNvbnRlbnQ7XG4gIGZvbnQtZmFtaWx5OiBcIldvcmsgU2Fuc1wiLCBzYW5zLXNlcmlmO1xufVxuXG5Aa2V5ZnJhbWVzIGZhZGVJbiB7XG4gIDAlIHtcbiAgICBvcGFjaXR5OiAwO1xuICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgfVxuICAxMDAlIHtcbiAgICBvcGFjaXR5OiAxO1xuICAgIHZpc2liaWxpdHk6IHZpc2libGU7XG4gIH1cbn1cblxuQGtleWZyYW1lcyBmYWRlT3V0IHtcbiAgMCUge1xuICAgIG9wYWNpdHk6IDE7XG4gICAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbiAgfVxuICAxMDAlIHtcbiAgICBvcGFjaXR5OiAwO1xuICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgfVxufVxuLnRvb2x0aXAuc2hvdyB7XG4gIGFuaW1hdGlvbjogZmFkZUluIDAuMnMgZWFzZS1pbi1vdXQgZm9yd2FyZHM7XG59XG5cbi50b29sdGlwLnRvcCB7XG4gIGJvdHRvbTogMTAwJTtcbiAgbGVmdDogNTAlO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSk7XG4gIG1hcmdpbi1ib3R0b206IDAuNXJlbTtcbn1cblxuLnRvb2x0aXAuYm90dG9tIHtcbiAgdG9wOiAxMDAlO1xuICBsZWZ0OiA1MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcbiAgbWFyZ2luLXRvcDogMC41cmVtO1xufVxuXG4udG9vbHRpcC5sZWZ0IHtcbiAgcmlnaHQ6IDEwMCU7XG4gIHRvcDogNTAlO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7XG4gIG1hcmdpbi1yaWdodDogMC41cmVtO1xufVxuXG4udG9vbHRpcC5yaWdodCB7XG4gIGxlZnQ6IDEwMCU7XG4gIHRvcDogNTAlO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7XG4gIG1hcmdpbi1sZWZ0OiAwLjVyZW07XG59XG4iXX0= */";
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

var css_248z$1 = "@import url(\"https://api.fontshare.com/v2/css?f[]=satoshi@1&display=swap\");@import url(\"https://fonts.googleapis.com/css2?family=Geist+Mono:wght@100..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap\");@import url(\"https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100..900;1,100..900&display=swap\");.auth-module_modal__yyg5L{-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);background-color:#000;background-color:rgba(0,0,0,.4);height:100%;left:0;overflow:auto;position:fixed;top:0;transition:all .3s;width:100%;z-index:85}.auth-module_modal__yyg5L .auth-module_outer-container__RraOQ{align-items:center;box-sizing:border-box;display:flex;flex-direction:row;font-family:Work Sans,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;justify-content:center;left:50%;position:absolute;top:50%;transform:translate(-50%,-50%);@media screen and (max-width:440px){border-bottom-left-radius:0;border-bottom-right-radius:0;bottom:0;top:auto;transform:translate(-50%);width:100%}}.auth-module_outer-container__RraOQ .auth-module_container__7utns{align-items:center;background-color:#fefefe;border:1px solid #888;box-sizing:border-box;flex-direction:column;justify-content:center;padding:1.5rem 1.5rem 1rem;position:relative;text-align:center;width:400px;@media screen and (max-width:440px){border-radius:0;height:auto;max-height:100vh;overflow-y:auto;padding-bottom:1rem;padding-bottom:.5rem;padding-left:1rem;padding-right:1rem;padding-top:1rem;width:100%}}.auth-module_container__7utns.auth-module_linking-container__mYNwD{max-width:300px;@media screen and (max-width:440px){max-width:100%}}.auth-module_origin-tab__miOUK{align-items:center;display:flex;flex-direction:column;gap:.5rem;height:100%;justify-content:space-between;width:100%}.auth-module_origin-section__UBhBB{align-items:center;display:flex;flex-direction:row;gap:.5rem;justify-content:space-evenly;position:relative;width:100%}.auth-module_origin-section__UBhBB .auth-module_origin-container__ZIk4c{align-items:center;color:#333;display:flex;flex-direction:column;font-size:.875rem;font-weight:400;justify-content:center;margin-bottom:.25rem;margin-top:.25rem;min-width:1rem;text-align:center;width:100%}.auth-module_claim-section__i68z0{justify-content:center;margin-bottom:.5rem;margin-top:auto}.auth-module_claim-section__i68z0,.auth-module_origin-wrapper__JQfEI{align-items:center;display:flex;flex-direction:column;gap:.5rem;width:100%}.auth-module_origin-wrapper__JQfEI{height:100%}.auth-module_origin-container__ZIk4c .auth-module_origin-label__l-1q9{color:#777;font-family:Geist Mono,monospace;font-size:.65rem;font-weight:400;margin-bottom:.25rem;text-align:center;text-transform:uppercase}.auth-module_horizontal-divider__YfWCy{background-color:#ddd;height:1px;margin-bottom:.5rem;margin-top:.5rem;width:100%}.auth-module_origin-section__UBhBB .auth-module_divider__z65Me{background-color:#ddd;height:1rem;width:1px}.auth-module_origin-dashboard-button__-pch4{align-items:center;border:none;color:#ff6f00;display:flex;flex-direction:row;font-size:.875rem;gap:.5rem;justify-content:center;padding:.25rem;width:100%}.auth-module_origin-dashboard-button__-pch4:hover{color:#cc4e02;cursor:pointer}.auth-module_origin-dashboard-button__-pch4:disabled{background-color:#ccc;cursor:not-allowed}.auth-module_container__7utns h2{font-size:1.25rem;margin-bottom:1rem;margin-top:0}.auth-module_container__7utns .auth-module_header__pX9nM{align-items:center;color:#333;display:flex;flex-direction:row;font-family:Geist Mono,monospace;gap:.5rem;justify-content:flex-start;margin-bottom:1rem;text-align:left;text-transform:uppercase;width:100%;@media screen and (max-width:440px){margin-bottom:.5rem;margin-top:0}}.auth-module_linking-container__mYNwD .auth-module_header__pX9nM{justify-content:center}.auth-module_container__7utns .auth-module_auth-header__LsM1f{align-items:center;color:#333;display:flex;flex-direction:column;font-family:Geist Mono,monospace;gap:.5rem;justify-content:center;margin-bottom:1rem;text-align:center;text-transform:uppercase;width:100%}.auth-module_container__7utns .auth-module_header__pX9nM .auth-module_small-modal-icon__YayD1{height:2rem;margin-bottom:.5rem;margin-top:.5rem;width:2rem}.auth-module_container__7utns .auth-module_header__pX9nM .auth-module_wallet-address__AVVA5{color:#777;display:flex;flex-direction:row;font-family:Geist Mono,monospace;font-size:.75rem;font-weight:400;gap:.25rem;text-transform:uppercase}.auth-module_container__7utns .auth-module_header__pX9nM .auth-module_wallet-address__AVVA5:hover{color:#555;cursor:pointer}.auth-module_container__7utns .auth-module_close-button__uZrho{background-color:#fff;border:1px solid #ddd;color:#aaa;font-size:1.5rem;height:1.25rem;padding:.075rem;position:absolute;right:1rem;top:1rem;transition:color .15s;width:1.25rem}.auth-module_close-button__uZrho>.auth-module_close-icon__SSCni{display:block;height:1rem;padding:.15rem;position:relative;width:1rem}.auth-module_container__7utns .auth-module_close-button__uZrho:hover{border-color:#ff6f00;color:#ff6f00;cursor:pointer}.auth-module_container__7utns .auth-module_linking-text__uz3ud{color:#777;font-size:1rem;text-align:center}.auth-module_provider-list__6vISy{box-sizing:border-box;display:flex;flex-direction:column;gap:.5rem;margin-bottom:.75rem;max-height:17.9rem;overflow-y:auto;padding:.25rem .5rem;scrollbar-color:#ccc #f1f1f1;scrollbar-width:thin;width:100%}.auth-module_provider-list__6vISy.auth-module_big__jQxvN{max-height:16rem}.auth-module_provider-list__6vISy::-webkit-scrollbar{border-radius:.25rem;width:.5rem}.auth-module_provider-list__6vISy::-webkit-scrollbar-thumb{background-color:#ccc;border-radius:.25rem}.auth-module_provider-list__6vISy::-webkit-scrollbar-track{background-color:#f1f1f1;border-radius:.25rem}.auth-module_spinner__hfzlH:after{animation:auth-module_spin__tm9l6 1s linear infinite;border:.25rem solid #f3f3f3;border-radius:50%;border-top-color:#ff6f00;content:\"\";display:block;height:1rem;width:1rem}.auth-module_spinner__hfzlH{align-self:center;display:flex;justify-content:center;margin-left:auto;margin-right:.25rem}@keyframes auth-module_spin__tm9l6{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}.auth-module_modal-icon__CV7ah{align-items:center;display:flex;height:4rem;justify-content:center;margin-bottom:.25rem;margin-top:.5rem;padding:.35rem;width:4rem}.auth-module_modal-icon__CV7ah svg{height:3.6rem;width:3.6rem}.auth-module_container__7utns a.auth-module_footer-text__CQnh6{color:#bbb;font-size:.75rem;text-decoration:none}.auth-module_container__7utns a.auth-module_footer-text__CQnh6:hover{text-decoration:underline}.auth-module_footer-container__UJBZk{align-items:center;display:flex;justify-content:center;position:relative;width:100%}.auth-module_environment-indicator__5loWh{border:2px solid #ff8c00;border-radius:50%;height:12px;position:absolute;right:0;width:12px}.auth-module_environment-tooltip__R0PTI{display:block!important;position:absolute!important;right:0!important}.auth-module_disconnect-button__bsu-3{background-color:#ff6f00;border:none;border-radius:.75rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);color:#fff;font-size:1rem;height:2.5rem;margin-bottom:.75rem;margin-top:1rem;padding:1rem;padding-block:0;width:100%}.auth-module_disconnect-button__bsu-3:hover{background-color:#cc4e02;cursor:pointer}.auth-module_disconnect-button__bsu-3:disabled{background-color:#ccc;cursor:not-allowed}.auth-module_linking-button__g1GlL{background-color:#ff6f00;border:none;border-radius:.75rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);color:#fff;font-size:1rem;height:2.5rem;margin-bottom:.75rem;margin-top:1rem;padding:1rem;padding-block:0;width:100%}.auth-module_linking-button__g1GlL:hover{background-color:#cc4e02;cursor:pointer}.auth-module_linking-button__g1GlL:disabled{background-color:#ccc;cursor:not-allowed}.auth-module_socials-wrapper__PshV3{display:flex;flex-direction:column;gap:1rem;margin-block:.5rem;width:100%}.auth-module_socials-container__iDzfJ{display:flex;flex-direction:column;gap:.5rem;width:100%}.auth-module_socials-container__iDzfJ .auth-module_connector-container__4wn11{align-items:center;display:flex;gap:.25rem;justify-content:flex-start;position:relative}.auth-module_socials-container__iDzfJ .auth-module_connector-button__j79HA{align-items:center;background-color:#fefefe;border:1px solid #ddd;color:#333;display:flex;font-size:.875rem;gap:.25rem;height:2.5rem;padding:.75rem;position:relative;width:100%}.auth-module_socials-container__iDzfJ .auth-module_connector-button__j79HA:hover{background-color:#ddd;cursor:pointer}.auth-module_socials-container__iDzfJ .auth-module_connector-button__j79HA:disabled{background-color:#fefefe;cursor:default}.auth-module_socials-container__iDzfJ .auth-module_connector-button__j79HA svg{color:#333;height:1.5rem;margin-right:.5rem;width:1.5rem}.auth-module_socials-container__iDzfJ .auth-module_connector-connected__JvDQb{align-items:center;background-color:#eee;border:1px solid #ddd;color:#333;display:flex;flex:1;font-size:.875rem;gap:.25rem;padding:.5rem .75rem;position:relative;width:100%}.auth-module_socials-container__iDzfJ .auth-module_connector-connected__JvDQb svg{color:#333;height:1.5rem;margin-right:.5rem;width:1.5rem}.auth-module_socials-container__iDzfJ h3{color:#333;font-family:Geist Mono;font-size:small;margin:0;text-transform:uppercase}.auth-module_connector-button__j79HA .auth-module_connector-checkmark__ZS6zU{height:1rem!important;position:absolute;right:-.5rem;top:-.5rem;width:1rem!important}.auth-module_unlink-connector-button__6Fwkp{align-items:center;border:none;color:#333;display:flex;font-size:.75rem;gap:.25rem;padding:.25rem .675rem .25rem .5rem;position:absolute;right:.375rem;text-align:center;transition:background-color .15s}.auth-module_unlink-connector-button__6Fwkp svg{stroke:#333!important;height:.875rem!important;margin-right:0!important;width:.875rem!important}.auth-module_unlink-connector-button__6Fwkp:hover{color:#000;cursor:pointer}.auth-module_unlink-connector-button__6Fwkp:disabled{color:#777;cursor:not-allowed}@keyframes auth-module_loader__gH3ZC{0%{transform:translateX(0)}50%{transform:translateX(100%)}to{transform:translateX(0)}}.auth-module_loader__gH3ZC{background-color:#ddd;border-radius:.125rem;height:.4rem;margin-bottom:.5rem;margin-top:.5rem;position:relative;width:4rem}.auth-module_loader__gH3ZC:before{animation:auth-module_loader__gH3ZC 1.5s ease-in-out infinite;background-color:#ff6f00;border-radius:.125rem;content:\"\";display:block;height:.4rem;left:0;position:absolute;width:2rem}.auth-module_no-socials__wEx0t{color:#777;font-size:.875rem;margin-top:.5rem;text-align:center}.auth-module_divider__z65Me{align-items:center;display:flex;gap:.5rem;margin-bottom:.5rem;margin-top:.5rem}.auth-module_divider__z65Me:after,.auth-module_divider__z65Me:before{border-bottom:1px solid #ddd;content:\"\";flex:1}input.auth-module_tiktok-input__FeqdG{border:1px solid gray;color:#000;font-family:Satoshi,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;font-size:1rem;font-weight:600;height:2.75rem;line-height:1.333rem;margin-top:1rem;padding-inline:1rem;width:100%}input.auth-module_tiktok-input__FeqdG.auth-module_invalid__qqgK6{border-color:#dc3545;outline-color:#dc3545}.auth-module_otp-input-container__B2NH6{display:flex;gap:.5rem;justify-content:center;margin-top:1rem}.auth-module_otp-input__vjImt{border:1px solid #ccc;font-size:1.5rem;height:2.5rem;outline:none;text-align:center;transition:border-color .2s;width:2rem}.auth-module_otp-input__vjImt:focus{border-color:#ff6f00}.auth-module_tabs__RcUmV{display:flex;justify-content:flex-start;margin-bottom:calc(-.5rem - 1px);max-width:100%;overflow-x:auto}.auth-module_tabs__RcUmV::-webkit-scrollbar{display:none}.auth-module_tabs__RcUmV::-webkit-scrollbar-thumb{background-color:#ccc;border-radius:.25rem}.auth-module_tab-button__HT6wc{background-color:#fefefe;border:2px transparent;border-radius:0;border-right:2px solid #ddd;color:#333;cursor:pointer;font-family:Geist Mono,monospace;font-size:.825rem;font-weight:400;padding:.5rem .75rem;text-align:left;text-transform:uppercase;transition:background-color .2s}.auth-module_tab-button__HT6wc:hover{background-color:#eee}.auth-module_active-tab__l6P44{border-right-color:#ff6f00}.auth-module_tab-content__noHF0{height:20rem;margin-top:.25rem;min-height:20rem;width:100%}.auth-module_vertical-tabs-container__6sAOL{box-sizing:border-box;display:flex;flex-direction:row;gap:.5rem;width:100%}.auth-module_vertical-tabs__-ba-W{display:flex;flex-direction:column;gap:.25rem;height:100%;margin-left:-1rem;min-width:-moz-fit-content!important;min-width:fit-content!important;overflow-y:auto}.auth-module_vertical-tab-content__wTqKF{background-color:#f9f7f4;border:1px solid #ddd;flex:1 1 0%;height:22rem;max-width:100%;min-height:22rem;overflow:hidden;padding:1rem;position:relative}.auth-module_ip-tab-container__ck0F8{justify-content:space-between}.auth-module_ip-tab-container__ck0F8,.auth-module_ip-tab-content__VI4zC{align-items:center;display:flex;flex-direction:column;gap:1rem;height:100%;width:100%}.auth-module_ip-tab-content__VI4zC{justify-content:center}.auth-module_ip-tab-content-text__y2BRh{color:#777;font-size:.875rem;margin-top:.5rem;text-align:center}.auth-module_contract-button-container__7HH9n{align-items:center;display:flex;flex-direction:column;gap:1rem;margin-top:1rem}.auth-module_no-provider-warning__YzGd-{align-items:center;background-color:#fff3cd;border:1px solid #ffeeba;box-shadow:0 2px 4px rgba(255,223,0,.05);color:#856404;cursor:pointer;display:flex;font-size:1rem;justify-content:center;line-height:1.4;margin-top:1rem;min-height:3.25rem;padding:.5rem;text-align:center;transition:background-color .2s,color .2s,border-color .2s;white-space:normal;width:100%}.auth-module_no-provider-warning__YzGd-:hover{background-color:#ffe8a1;border-color:#ffd966;color:#7a5c00}.auth-module_no-provider-warning__YzGd-:active{background-color:#ffe8a1;border-color:#ffd966;color:#5c4300}.auth-module_no-provider-warning__YzGd-:focus{outline:2px solid #ff6f00;outline-offset:2px}.auth-module_tab-provider-required-overlay__dvmIR{align-items:center;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);background:hsla(0,0%,100%,.7);border-radius:inherit;color:#333;display:flex;font-size:1.1rem;font-weight:600;height:100%;justify-content:center;left:0;position:absolute;text-align:center;top:0;width:100%;z-index:10}.auth-module_corner-svg__WYa3o{height:12px;pointer-events:none;position:absolute;width:12px;z-index:10}.auth-module_corner-top-left__mYKEQ{left:2px;top:2px}.auth-module_corner-top-right__LejG2{right:2px;top:2px}.auth-module_corner-bottom-left__gSw9-{bottom:2px;left:2px}.auth-module_corner-bottom-right__I-KCA{bottom:2px;right:2px}.auth-module_corner-square__eC1DH{pointer-events:none;position:absolute;z-index:10}\n/*# sourceMappingURL=data:application/json;base64,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MERBQWdFLENBQ2hFLGtCQUFtQixDQU5uQixVQVlGLENBRUEsOENBQ0Usd0JBQXlCLENBRXpCLG9CQUFxQixDQURyQixhQUVGLENBRUEsK0NBQ0Usd0JBQXlCLENBRXpCLG9CQUFxQixDQURyQixhQUVGLENBRUEsOENBQ0UseUJBQTBCLENBQzFCLGtCQUNGLENBRUEsa0RBVUUsa0JBQW1CLENBSG5CLGlDQUEwQixDQUExQix5QkFBMEIsQ0FEMUIsNkJBQW9DLENBVXBDLHFCQUFzQixDQUZ0QixVQUFXLENBTFgsWUFBYSxDQUliLGdCQUFpQixDQURqQixlQUFnQixDQVBoQixXQUFZLENBTVosc0JBQXVCLENBUnZCLE1BQU8sQ0FGUCxpQkFBa0IsQ0FjbEIsaUJBQWtCLENBYmxCLEtBQU0sQ0FFTixVQUFXLENBSVgsVUFTRixDQUdBLCtCQUdFLFdBQVksQ0FDWixtQkFBb0IsQ0FIcEIsaUJBQWtCLENBQ2xCLFVBQVcsQ0FHWCxVQUNGLENBRUEsb0NBRUUsUUFBUyxDQURULE9BRUYsQ0FFQSxxQ0FFRSxTQUFVLENBRFYsT0FFRixDQUVBLHVDQUNFLFVBQVcsQ0FDWCxRQUNGLENBRUEsd0NBQ0UsVUFBVyxDQUNYLFNBQ0YsQ0FFQSxrQ0FFRSxtQkFBb0IsQ0FEcEIsaUJBQWtCLENBRWxCLFVBQ0YiLCJmaWxlIjoiYXV0aC5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCB1cmwoXCJodHRwczovL2FwaS5mb250c2hhcmUuY29tL3YyL2Nzcz9mW109c2F0b3NoaUAxJmRpc3BsYXk9c3dhcFwiKTtcbkBpbXBvcnQgdXJsKFwiaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1HZWlzdCtNb25vOndnaHRAMTAwLi45MDAmZmFtaWx5PVJvYm90bzppdGFsLHdnaHRAMCwxMDA7MCwzMDA7MCw0MDA7MCw1MDA7MCw3MDA7MCw5MDA7MSwxMDA7MSwzMDA7MSw0MDA7MSw1MDA7MSw3MDA7MSw5MDAmZmFtaWx5PVdvcmsrU2FuczppdGFsLHdnaHRAMCwxMDAuLjkwMDsxLDEwMC4uOTAwJmRpc3BsYXk9c3dhcFwiKTtcbkBpbXBvcnQgdXJsKFwiaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1Xb3JrK1NhbnM6aXRhbCx3Z2h0QDAsMTAwLi45MDA7MSwxMDAuLjkwMCZkaXNwbGF5PXN3YXBcIik7XG5cbi5tb2RhbCB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgei1pbmRleDogODU7XG4gIGxlZnQ6IDA7XG4gIHRvcDogMDtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgb3ZlcmZsb3c6IGF1dG87XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYigwLCAwLCAwKTtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjQpO1xuICBiYWNrZHJvcC1maWx0ZXI6IGJsdXIoMnB4KTtcbiAgdHJhbnNpdGlvbjogYWxsIDAuM3M7XG59XG5cbi5tb2RhbCAub3V0ZXItY29udGFpbmVyIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgLyogZm9udC1mYW1pbHk6IFwiU2F0b3NoaVwiLCBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCxcbiAgICBcIlNlZ29lIFVJXCIsIFJvYm90bywgT3h5Z2VuLCBVYnVudHUsIENhbnRhcmVsbCwgXCJPcGVuIFNhbnNcIiwgXCJIZWx2ZXRpY2EgTmV1ZVwiLFxuICAgIHNhbnMtc2VyaWY7ICovXG4gIGZvbnQtZmFtaWx5OiBcIldvcmsgU2Fuc1wiLCBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCxcbiAgICBcIlNlZ29lIFVJXCIsIFJvYm90bywgT3h5Z2VuLCBVYnVudHUsIENhbnRhcmVsbCwgXCJPcGVuIFNhbnNcIiwgXCJIZWx2ZXRpY2EgTmV1ZVwiLFxuICAgIHNhbnMtc2VyaWY7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogNTAlO1xuICBsZWZ0OiA1MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIC01MCUpO1xuXG4gIC8qIGRpYWxvZyBvbiBtb2JpbGUgKi9cbiAgQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNDQwcHgpIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBib3JkZXItYm90dG9tLWxlZnQtcmFkaXVzOiAwO1xuICAgIGJvcmRlci1ib3R0b20tcmlnaHQtcmFkaXVzOiAwO1xuICAgIGJvdHRvbTogMDtcbiAgICB0b3A6IGF1dG87XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgMCk7XG4gIH1cbn1cblxuLm91dGVyLWNvbnRhaW5lciAuY29udGFpbmVyIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmVmZWZlO1xuICBib3JkZXI6IDFweCBzb2xpZCAjODg4O1xuICAvKiBib3JkZXItcmFkaXVzOiAxLjVyZW07ICovXG4gIHdpZHRoOiA0MDBweDsgLyogdGVtcG9yYXJ5ICovXG4gIHBhZGRpbmc6IDEuNXJlbTtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIHBhZGRpbmctYm90dG9tOiAxcmVtO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG5cbiAgQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNDQwcHgpIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBib3JkZXItcmFkaXVzOiAwO1xuICAgIHBhZGRpbmc6IDFyZW07XG4gICAgcGFkZGluZy1ib3R0b206IDAuNXJlbTtcbiAgICBoZWlnaHQ6IGF1dG87XG4gICAgbWF4LWhlaWdodDogMTAwdmg7XG4gICAgb3ZlcmZsb3cteTogYXV0bztcbiAgfVxufVxuXG4uY29udGFpbmVyLmxpbmtpbmctY29udGFpbmVyIHtcbiAgbWF4LXdpZHRoOiAzMDBweDtcblxuICBAbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA0NDBweCkge1xuICAgIG1heC13aWR0aDogMTAwJTtcbiAgfVxufVxuXG4ub3JpZ2luLXRhYiB7XG4gIGhlaWdodDogMTAwJTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDAuNXJlbTtcbiAgd2lkdGg6IDEwMCU7XG59XG4ub3JpZ2luLXNlY3Rpb24ge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDAuNXJlbTtcbiAgd2lkdGg6IDEwMCU7XG59XG5cbi5vcmlnaW4tc2VjdGlvbiAub3JpZ2luLWNvbnRhaW5lciB7XG4gIG1pbi13aWR0aDogMXJlbTtcbiAgd2lkdGg6IDEwMCU7XG4gIC8qIG1pbi1oZWlnaHQ6IDNyZW07ICovXG4gIGZvbnQtc2l6ZTogMC44NzVyZW07XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIGNvbG9yOiAjMzMzO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBtYXJnaW4tYm90dG9tOiAwLjI1cmVtO1xuICBtYXJnaW4tdG9wOiAwLjI1cmVtO1xufVxuXG4uY2xhaW0tc2VjdGlvbiB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDAuNXJlbTtcbiAgd2lkdGg6IDEwMCU7XG4gIG1hcmdpbi10b3A6IGF1dG87XG4gIG1hcmdpbi1ib3R0b206IDAuNXJlbTtcbn1cblxuLm9yaWdpbi13cmFwcGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAwLjVyZW07XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG59XG5cbi5vcmlnaW4tY29udGFpbmVyIC5vcmlnaW4tbGFiZWwge1xuICBmb250LXNpemU6IDAuNjVyZW07XG4gIGZvbnQtd2VpZ2h0OiA0MDA7XG4gIGNvbG9yOiAjNzc3Nzc3O1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIG1hcmdpbi1ib3R0b206IDAuMjVyZW07XG4gIGZvbnQtZmFtaWx5OiBcIkdlaXN0IE1vbm9cIiwgbW9ub3NwYWNlO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xufVxuXG4uaG9yaXpvbnRhbC1kaXZpZGVyIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMXB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGRkO1xuICBtYXJnaW4tdG9wOiAwLjVyZW07XG4gIG1hcmdpbi1ib3R0b206IDAuNXJlbTtcbn1cblxuLm9yaWdpbi1zZWN0aW9uIC5kaXZpZGVyIHtcbiAgd2lkdGg6IDFweDtcbiAgaGVpZ2h0OiAxcmVtO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGRkO1xufVxuXG4ub3JpZ2luLWRhc2hib2FyZC1idXR0b24ge1xuICAvKiBiYWNrZ3JvdW5kLWNvbG9yOiAjZmY2ZjAwOyAqL1xuICBjb2xvcjogI2ZmNmYwMDtcbiAgYm9yZGVyOiBub25lO1xuICAvKiBib3JkZXItcmFkaXVzOiAwLjc1cmVtOyAqL1xuICBwYWRkaW5nOiAwLjI1cmVtO1xuICBmb250LXNpemU6IDAuODc1cmVtO1xuICB3aWR0aDogMTAwJTtcbiAgLyogYm94LXNoYWRvdzogaHNsYSgwLCAwJSwgMTAwJSwgMC4xNSkgMCAycHggMCBpbnNldCxcbiAgICByZ2JhKDAsIDAsIDAsIDAuMDUpIDAgLTJweCA0cHggaW5zZXQsIHJnYmEoNDYsIDU0LCA4MCwgMC4wNzUpIDAgMXB4IDFweDsgKi9cbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMC41cmVtO1xufVxuXG4ub3JpZ2luLWRhc2hib2FyZC1idXR0b246aG92ZXIge1xuICAvKiBiYWNrZ3JvdW5kLWNvbG9yOiAjY2M0ZTAyOyAqL1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGNvbG9yOiAjY2M0ZTAyO1xufVxuXG4ub3JpZ2luLWRhc2hib2FyZC1idXR0b246ZGlzYWJsZWQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xufVxuXG4uY29udGFpbmVyIGgyIHtcbiAgbWFyZ2luLXRvcDogMDtcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbiAgZm9udC1zaXplOiAxLjI1cmVtO1xufVxuXG4uY29udGFpbmVyIC5oZWFkZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGNvbG9yOiAjMzMzO1xuICB3aWR0aDogMTAwJTtcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcbiAgLyogbWFyZ2luLXRvcDogLTAuNnJlbTsgKi9cbiAgLyogZm9udC13ZWlnaHQ6IGJvbGQ7ICovXG4gIGdhcDogMC41cmVtO1xuICBmb250LWZhbWlseTogXCJHZWlzdCBNb25vXCIsIG1vbm9zcGFjZTtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcblxuICBAbWVkaWEgc2NyZWVuIGFuZCAobWF4LXdpZHRoOiA0NDBweCkge1xuICAgIG1hcmdpbi10b3A6IDA7XG4gICAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xuICB9XG59XG5cbi5saW5raW5nLWNvbnRhaW5lciAuaGVhZGVyIHtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi5jb250YWluZXIgLmF1dGgtaGVhZGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGNvbG9yOiAjMzMzO1xuICB3aWR0aDogMTAwJTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xuICAvKiBmb250LXdlaWdodDogYm9sZDsgKi9cbiAgZ2FwOiAwLjVyZW07XG4gIGZvbnQtZmFtaWx5OiBcIkdlaXN0IE1vbm9cIiwgbW9ub3NwYWNlO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xufVxuXG4uY29udGFpbmVyIC5oZWFkZXIgLnNtYWxsLW1vZGFsLWljb24ge1xuICB3aWR0aDogMnJlbTtcbiAgaGVpZ2h0OiAycmVtO1xuICBtYXJnaW4tYm90dG9tOiAwLjVyZW07XG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcbn1cblxuLmNvbnRhaW5lciAuaGVhZGVyIC53YWxsZXQtYWRkcmVzcyB7XG4gIGZvbnQtc2l6ZTogMC43NXJlbTtcbiAgY29sb3I6ICM3Nzc7XG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XG4gIC8qIG1hcmdpbi10b3A6IDAuMnJlbTsgKi9cbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgZ2FwOiAwLjI1cmVtO1xuICBmb250LWZhbWlseTogXCJHZWlzdCBNb25vXCIsIG1vbm9zcGFjZTtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbn1cbi5jb250YWluZXIgLmhlYWRlciAud2FsbGV0LWFkZHJlc3M6aG92ZXIge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGNvbG9yOiAjNTU1O1xufVxuXG4uY29udGFpbmVyIC5jbG9zZS1idXR0b24ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMXJlbTtcbiAgcmlnaHQ6IDFyZW07XG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xuICAvKiBib3JkZXItcmFkaXVzOiAxMDAlOyAqL1xuICBwYWRkaW5nOiAwLjA3NXJlbTtcbiAgZm9udC1zaXplOiAxLjVyZW07XG4gIGNvbG9yOiAjYWFhO1xuICB3aWR0aDogMS4yNXJlbTtcbiAgaGVpZ2h0OiAxLjI1cmVtO1xuICB0cmFuc2l0aW9uOiBjb2xvciAwLjE1cztcbn1cblxuLmNsb3NlLWJ1dHRvbiA+IC5jbG9zZS1pY29uIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBkaXNwbGF5OiBibG9jaztcbiAgd2lkdGg6IDFyZW07XG4gIGhlaWdodDogMXJlbTtcbiAgcGFkZGluZzogMC4xNXJlbTtcbn1cblxuLmNvbnRhaW5lciAuY2xvc2UtYnV0dG9uOmhvdmVyIHtcbiAgYm9yZGVyLWNvbG9yOiAjZmY2ZjAwO1xuICBjb2xvcjogI2ZmNmYwMDtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4uY29udGFpbmVyIC5saW5raW5nLXRleHQge1xuICBjb2xvcjogIzc3NztcbiAgZm9udC1zaXplOiAxcmVtO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIC8qIG1hcmdpbi10b3A6IDA7ICovXG4gIC8qIG1hcmdpbi1ib3R0b206IDJyZW07ICovXG59XG5cbi5wcm92aWRlci1saXN0IHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZ2FwOiAwLjVyZW07XG4gIHdpZHRoOiAxMDAlO1xuICBtYXJnaW4tYm90dG9tOiAwLjc1cmVtO1xuICBtYXgtaGVpZ2h0OiAxNy45cmVtO1xuICBvdmVyZmxvdy15OiBhdXRvO1xuICBwYWRkaW5nLXJpZ2h0OiAwLjVyZW07XG4gIHBhZGRpbmctbGVmdDogMC41cmVtO1xuICBwYWRkaW5nLXRvcDogMC4yNXJlbTtcbiAgcGFkZGluZy1ib3R0b206IDAuMjVyZW07XG4gIHNjcm9sbGJhci13aWR0aDogdGhpbjtcbiAgc2Nyb2xsYmFyLWNvbG9yOiAjY2NjICNmMWYxZjE7XG59XG5cbi5wcm92aWRlci1saXN0LmJpZyB7XG4gIG1heC1oZWlnaHQ6IDE2cmVtO1xufVxuXG4ucHJvdmlkZXItbGlzdDo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICB3aWR0aDogMC41cmVtO1xuICBib3JkZXItcmFkaXVzOiAwLjI1cmVtO1xufVxuLnByb3ZpZGVyLWxpc3Q6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2NjYztcbiAgYm9yZGVyLXJhZGl1czogMC4yNXJlbTtcbn1cbi5wcm92aWRlci1saXN0Ojotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmMWYxZjE7XG4gIGJvcmRlci1yYWRpdXM6IDAuMjVyZW07XG59XG5cbi5zcGlubmVyOjphZnRlciB7XG4gIGNvbnRlbnQ6IFwiXCI7XG4gIGRpc3BsYXk6IGJsb2NrO1xuICB3aWR0aDogMXJlbTtcbiAgaGVpZ2h0OiAxcmVtO1xuICBib3JkZXI6IDAuMjVyZW0gc29saWQgI2YzZjNmMztcbiAgYm9yZGVyLXRvcDogMC4yNXJlbSBzb2xpZCAjZmY2ZjAwO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGFuaW1hdGlvbjogc3BpbiAxcyBsaW5lYXIgaW5maW5pdGU7XG59XG4uc3Bpbm5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIG1hcmdpbi1sZWZ0OiBhdXRvO1xuICBtYXJnaW4tcmlnaHQ6IDAuMjVyZW07XG4gIGFsaWduLXNlbGY6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgc3BpbiB7XG4gIDAlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcbiAgfVxuICAxMDAlIHtcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICB9XG59XG5cbi5tb2RhbC1pY29uIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHdpZHRoOiA0cmVtO1xuICBoZWlnaHQ6IDRyZW07XG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcbiAgbWFyZ2luLWJvdHRvbTogMC4yNXJlbTtcbiAgcGFkZGluZzogMC4zNXJlbTtcbn1cbi5tb2RhbC1pY29uIHN2ZyB7XG4gIHdpZHRoOiAzLjZyZW07XG4gIGhlaWdodDogMy42cmVtO1xufVxuXG4uY29udGFpbmVyIGEuZm9vdGVyLXRleHQge1xuICAvKiBtYXJnaW4tdG9wOiAxcmVtOyAqL1xuICBmb250LXNpemU6IDAuNzVyZW07XG4gIGNvbG9yOiAjYmJiYmJiO1xuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XG59XG5cbi5jb250YWluZXIgYS5mb290ZXItdGV4dDpob3ZlciB7XG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xufVxuXG4uZm9vdGVyLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4uZW52aXJvbm1lbnQtaW5kaWNhdG9yIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICByaWdodDogMDtcbiAgd2lkdGg6IDEycHg7XG4gIGhlaWdodDogMTJweDtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBib3JkZXI6IDJweCBzb2xpZCAjZmY4YzAwO1xufVxuXG4uZW52aXJvbm1lbnQtdG9vbHRpcCB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZSAhaW1wb3J0YW50O1xuICByaWdodDogMCAhaW1wb3J0YW50O1xuICBkaXNwbGF5OiBibG9jayAhaW1wb3J0YW50O1xufVxuXG4uZGlzY29ubmVjdC1idXR0b24ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmY2ZjAwO1xuICBjb2xvcjogd2hpdGU7XG4gIGJvcmRlcjogbm9uZTtcbiAgYm9yZGVyLXJhZGl1czogMC43NXJlbTtcbiAgcGFkZGluZzogMXJlbTtcbiAgcGFkZGluZy1ibG9jazogMDtcbiAgZm9udC1zaXplOiAxcmVtO1xuICB3aWR0aDogMTAwJTtcbiAgbWFyZ2luLWJvdHRvbTogMC43NXJlbTtcbiAgbWFyZ2luLXRvcDogMXJlbTtcbiAgaGVpZ2h0OiAyLjVyZW07XG4gIGJveC1zaGFkb3c6IGhzbGEoMCwgMCUsIDEwMCUsIDAuMTUpIDAgMnB4IDAgaW5zZXQsXG4gICAgcmdiYSgwLCAwLCAwLCAwLjA1KSAwIC0ycHggNHB4IGluc2V0LCByZ2JhKDQ2LCA1NCwgODAsIDAuMDc1KSAwIDFweCAxcHg7XG59XG5cbi5kaXNjb25uZWN0LWJ1dHRvbjpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNjYzRlMDI7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLmRpc2Nvbm5lY3QtYnV0dG9uOmRpc2FibGVkIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2NjYztcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbn1cblxuLmxpbmtpbmctYnV0dG9uIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmNmYwMDtcbiAgY29sb3I6IHdoaXRlO1xuICBib3JkZXI6IG5vbmU7XG4gIGJvcmRlci1yYWRpdXM6IDAuNzVyZW07XG4gIHBhZGRpbmc6IDFyZW07XG4gIHBhZGRpbmctYmxvY2s6IDA7XG4gIGZvbnQtc2l6ZTogMXJlbTtcbiAgd2lkdGg6IDEwMCU7XG4gIG1hcmdpbi1ib3R0b206IDAuNzVyZW07XG4gIG1hcmdpbi10b3A6IDFyZW07XG4gIGhlaWdodDogMi41cmVtO1xuICBib3gtc2hhZG93OiBoc2xhKDAsIDAlLCAxMDAlLCAwLjE1KSAwIDJweCAwIGluc2V0LFxuICAgIHJnYmEoMCwgMCwgMCwgMC4wNSkgMCAtMnB4IDRweCBpbnNldCwgcmdiYSg0NiwgNTQsIDgwLCAwLjA3NSkgMCAxcHggMXB4O1xufVxuXG4ubGlua2luZy1idXR0b246aG92ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2M0ZTAyO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5saW5raW5nLWJ1dHRvbjpkaXNhYmxlZCB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNjY2M7XG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XG59XG5cbi5zb2NpYWxzLXdyYXBwZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBnYXA6IDFyZW07XG4gIG1hcmdpbi1ibG9jazogMC41cmVtO1xuICB3aWR0aDogMTAwJTtcbn1cblxuLnNvY2lhbHMtY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZ2FwOiAwLjVyZW07XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4uc29jaWFscy1jb250YWluZXIgLmNvbm5lY3Rvci1jb250YWluZXIge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAwLjI1cmVtO1xufVxuXG4uc29jaWFscy1jb250YWluZXIgLmNvbm5lY3Rvci1idXR0b24ge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMC4yNXJlbTtcbiAgcGFkZGluZzogMC43NXJlbTtcbiAgLyogYm9yZGVyLXJhZGl1czogMC43NXJlbTsgKi9cbiAgZm9udC1zaXplOiAwLjg3NXJlbTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZlZmVmZTtcbiAgY29sb3I6ICMzMzM7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDIuNXJlbTtcbn1cblxuLnNvY2lhbHMtY29udGFpbmVyIC5jb25uZWN0b3ItYnV0dG9uOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2RkZDtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4uc29jaWFscy1jb250YWluZXIgLmNvbm5lY3Rvci1idXR0b246ZGlzYWJsZWQge1xuICBjdXJzb3I6IGRlZmF1bHQ7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZWZlZmU7XG59XG5cbi5zb2NpYWxzLWNvbnRhaW5lciAuY29ubmVjdG9yLWJ1dHRvbiBzdmcge1xuICB3aWR0aDogMS41cmVtO1xuICBoZWlnaHQ6IDEuNXJlbTtcbiAgY29sb3I6ICMzMzM7XG4gIG1hcmdpbi1yaWdodDogMC41cmVtO1xufVxuXG4uc29jaWFscy1jb250YWluZXIgLmNvbm5lY3Rvci1jb25uZWN0ZWQge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMC4yNXJlbTtcbiAgcGFkZGluZzogMC43NXJlbTtcbiAgcGFkZGluZy10b3A6IDAuNXJlbTtcbiAgcGFkZGluZy1ib3R0b206IDAuNXJlbTtcbiAgZm9udC1zaXplOiAwLjg3NXJlbTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2VlZTtcbiAgLyogYm9yZGVyLXJhZGl1czogMC4yNXJlbTsgKi9cbiAgY29sb3I6ICMzMzM7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XG4gIHdpZHRoOiAxMDAlO1xuICBmbGV4OiAxO1xufVxuXG4uc29jaWFscy1jb250YWluZXIgLmNvbm5lY3Rvci1jb25uZWN0ZWQgc3ZnIHtcbiAgd2lkdGg6IDEuNXJlbTtcbiAgaGVpZ2h0OiAxLjVyZW07XG4gIGNvbG9yOiAjMzMzO1xuICBtYXJnaW4tcmlnaHQ6IDAuNXJlbTtcbn1cblxuLnNvY2lhbHMtY29udGFpbmVyIGgzIHtcbiAgY29sb3I6ICMzMzM7XG4gIG1hcmdpbjogMDtcbiAgZm9udC1mYW1pbHk6IFwiR2Vpc3QgTW9ub1wiO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBmb250LXNpemU6IHNtYWxsO1xufVxuXG4uY29ubmVjdG9yLWJ1dHRvbiAuY29ubmVjdG9yLWNoZWNrbWFyayB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAtMC41cmVtO1xuICByaWdodDogLTAuNXJlbTtcbiAgd2lkdGg6IDFyZW0gIWltcG9ydGFudDtcbiAgaGVpZ2h0OiAxcmVtICFpbXBvcnRhbnQ7XG59XG5cbi51bmxpbmstY29ubmVjdG9yLWJ1dHRvbiB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgcmlnaHQ6IDAuMzc1cmVtO1xuICBib3JkZXI6IG5vbmU7XG4gIGZvbnQtc2l6ZTogMC43NXJlbTtcbiAgcGFkZGluZzogMC4yNXJlbSAwLjVyZW07XG4gIHBhZGRpbmctcmlnaHQ6IDAuNjc1cmVtO1xuICAvKiBib3JkZXItcmFkaXVzOiAwLjVyZW07ICovXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgLyogYmFja2dyb3VuZC1jb2xvcjogIzk5OTsgKi9cbiAgY29sb3I6ICMzMzM7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMC4yNXJlbTtcbiAgLyogYm94LXNoYWRvdzogaHNsYSgwLCAwJSwgMTAwJSwgMC4xNSkgMCAycHggMCBpbnNldCxcbiAgICByZ2JhKDAsIDAsIDAsIDAuMDUpIDAgLTJweCA0cHggaW5zZXQsIHJnYmEoNDYsIDU0LCA4MCwgMC4wNzUpIDAgMXB4IDFweDsgKi9cbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjE1cztcbn1cblxuLnVubGluay1jb25uZWN0b3ItYnV0dG9uIHN2ZyB7XG4gIHN0cm9rZTogIzMzMyAhaW1wb3J0YW50O1xuICB3aWR0aDogMC44NzVyZW0gIWltcG9ydGFudDtcbiAgaGVpZ2h0OiAwLjg3NXJlbSAhaW1wb3J0YW50O1xuICBtYXJnaW4tcmlnaHQ6IDAgIWltcG9ydGFudDtcbn1cblxuLnVubGluay1jb25uZWN0b3ItYnV0dG9uOmhvdmVyIHtcbiAgLyogYmFja2dyb3VuZC1jb2xvcjogIzg4ODsgKi9cbiAgY29sb3I6ICMwMDA7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLnVubGluay1jb25uZWN0b3ItYnV0dG9uOmRpc2FibGVkIHtcbiAgLyogYmFja2dyb3VuZC1jb2xvcjogI2NjYzsgKi9cbiAgY29sb3I6ICM3Nzc7XG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XG59XG5cbkBrZXlmcmFtZXMgbG9hZGVyIHtcbiAgMCUge1xuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwJSk7XG4gIH1cbiAgNTAlIHtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMTAwJSk7XG4gIH1cbiAgMTAwJSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDAlKTtcbiAgfVxufVxuXG4ubG9hZGVyIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB3aWR0aDogNHJlbTtcbiAgaGVpZ2h0OiAwLjRyZW07XG4gIGJhY2tncm91bmQtY29sb3I6ICNkZGQ7XG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcbiAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xuICBib3JkZXItcmFkaXVzOiAwLjEyNXJlbTtcbn1cblxuLmxvYWRlcjo6YmVmb3JlIHtcbiAgY29udGVudDogXCJcIjtcbiAgZGlzcGxheTogYmxvY2s7XG4gIHdpZHRoOiAycmVtO1xuICBoZWlnaHQ6IDAuNHJlbTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmNmYwMDtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBsZWZ0OiAwO1xuICBhbmltYXRpb246IGxvYWRlciAxLjVzIGVhc2UtaW4tb3V0IGluZmluaXRlO1xuICBib3JkZXItcmFkaXVzOiAwLjEyNXJlbTtcbn1cblxuLm5vLXNvY2lhbHMge1xuICBjb2xvcjogIzc3NztcbiAgZm9udC1zaXplOiAwLjg3NXJlbTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xuICBtYXJnaW4tdG9wOiAwLjVyZW07XG59XG5cbi5kaXZpZGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAwLjVyZW07XG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcbiAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xufVxuXG4uZGl2aWRlcjo6YmVmb3JlLFxuLmRpdmlkZXI6OmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgZmxleDogMTtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkICNkZGQ7XG59XG5cbmlucHV0LnRpa3Rvay1pbnB1dCB7XG4gIGJvcmRlcjogMXB4IHNvbGlkIGdyYXk7XG4gIC8qIGJvcmRlci1yYWRpdXM6IDAuNzVyZW07ICovXG4gIGNvbG9yOiBibGFjaztcbiAgZm9udC1mYW1pbHk6IFNhdG9zaGksIHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBTZWdvZSBVSSxcbiAgICBSb2JvdG8sIE94eWdlbiwgVWJ1bnR1LCBDYW50YXJlbGwsIE9wZW4gU2FucywgSGVsdmV0aWNhIE5ldWUsIHNhbnMtc2VyaWY7XG4gIGZvbnQtc2l6ZTogMXJlbTtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgaGVpZ2h0OiAyLjc1cmVtO1xuICBsaW5lLWhlaWdodDogMS4zMzNyZW07XG4gIHBhZGRpbmctaW5saW5lOiAxcmVtO1xuICBtYXJnaW4tdG9wOiAxcmVtO1xuICB3aWR0aDogMTAwJTtcbn1cblxuaW5wdXQudGlrdG9rLWlucHV0LmludmFsaWQge1xuICBib3JkZXItY29sb3I6ICNkYzM1NDU7XG4gIG91dGxpbmUtY29sb3I6ICNkYzM1NDU7XG59XG5cbi5vdHAtaW5wdXQtY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGdhcDogMC41cmVtO1xuICBtYXJnaW4tdG9wOiAxcmVtO1xufVxuXG4ub3RwLWlucHV0IHtcbiAgd2lkdGg6IDJyZW07XG4gIGhlaWdodDogMi41cmVtO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGZvbnQtc2l6ZTogMS41cmVtO1xuICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICAvKiBib3JkZXItcmFkaXVzOiAwLjVyZW07ICovXG4gIG91dGxpbmU6IG5vbmU7XG4gIHRyYW5zaXRpb246IGJvcmRlci1jb2xvciAwLjJzO1xufVxuXG4ub3RwLWlucHV0OmZvY3VzIHtcbiAgYm9yZGVyLWNvbG9yOiAjZmY2ZjAwO1xufVxuXG4udGFicyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgbWFyZ2luLWJvdHRvbTogY2FsYygtMC41cmVtIC0gMXB4KTtcbiAgbWF4LXdpZHRoOiAxMDAlO1xuICBvdmVyZmxvdy14OiBhdXRvO1xufVxuLnRhYnM6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgZGlzcGxheTogbm9uZTtcbn1cbi50YWJzOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNjY2M7XG4gIGJvcmRlci1yYWRpdXM6IDAuMjVyZW07XG59XG5cbi50YWItYnV0dG9uIHtcbiAgYm9yZGVyLXJhZGl1czogMDtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZlZmVmZTtcbiAgYm9yZGVyOiAycHggdHJhbnNwYXJlbnQ7XG4gIGJvcmRlci1yaWdodDogMnB4IHNvbGlkICNkZGQ7XG4gIHBhZGRpbmc6IDAuNXJlbSAwLjc1cmVtO1xuICBmb250LXNpemU6IDAuODI1cmVtO1xuICBmb250LXdlaWdodDogNDAwO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycztcbiAgdGV4dC1hbGlnbjogbGVmdDtcbiAgY29sb3I6ICMzMzM7XG4gIGZvbnQtZmFtaWx5OiBcIkdlaXN0IE1vbm9cIiwgbW9ub3NwYWNlO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xufVxuXG4udGFiLWJ1dHRvbjpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNlZWU7XG59XG5cbi5hY3RpdmUtdGFiIHtcbiAgYm9yZGVyLXJpZ2h0LWNvbG9yOiAjZmY2ZjAwO1xufVxuXG4udGFiLWNvbnRlbnQge1xuICBtYXJnaW4tdG9wOiAwLjI1cmVtO1xuICB3aWR0aDogMTAwJTtcbiAgbWluLWhlaWdodDogMjByZW07XG4gIGhlaWdodDogMjByZW07XG59XG5cbi52ZXJ0aWNhbC10YWJzLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gIGdhcDogMC41cmVtO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICB3aWR0aDogMTAwJTtcbn1cblxuLnZlcnRpY2FsLXRhYnMge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBnYXA6IDAuMjVyZW07XG4gIG1pbi13aWR0aDogZml0LWNvbnRlbnQgIWltcG9ydGFudDtcbiAgbWFyZ2luLWxlZnQ6IC0xcmVtO1xuICBoZWlnaHQ6IDEwMCU7XG4gIG92ZXJmbG93LXk6IGF1dG87XG59XG5cbi52ZXJ0aWNhbC10YWItY29udGVudCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZmxleDogMSAxIDAlO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBtaW4taGVpZ2h0OiAyMnJlbTtcbiAgaGVpZ2h0OiAyMnJlbTtcbiAgYm9yZGVyOiAxcHggc29saWQgI2RkZDtcbiAgLyogYm9yZGVyLXJhZGl1czogMC4yNXJlbTsgKi9cbiAgcGFkZGluZzogMXJlbTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y5ZjdmNDtcbiAgbWF4LXdpZHRoOiAxMDAlO1xufVxuXG4uaXAtdGFiLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGdhcDogMXJlbTtcbiAgd2lkdGg6IDEwMCU7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuXG4uaXAtdGFiLWNvbnRlbnQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBnYXA6IDFyZW07XG4gIHdpZHRoOiAxMDAlO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuXG4uaXAtdGFiLWNvbnRlbnQtdGV4dCB7XG4gIGNvbG9yOiAjNzc3O1xuICBmb250LXNpemU6IDAuODc1cmVtO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcbn1cblxuLmNvbnRyYWN0LWJ1dHRvbi1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDFyZW07XG4gIG1hcmdpbi10b3A6IDFyZW07XG59XG5cbi5uby1wcm92aWRlci13YXJuaW5nIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjNjZDtcbiAgY29sb3I6ICM4NTY0MDQ7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNmZmVlYmE7XG4gIC8qIGJvcmRlci1yYWRpdXM6IDAuNzVyZW07ICovXG4gIHBhZGRpbmc6IDAuNXJlbTtcbiAgZm9udC1zaXplOiAxcmVtO1xuICB3aWR0aDogMTAwJTtcbiAgbWFyZ2luLXRvcDogMXJlbTtcbiAgbWluLWhlaWdodDogMy4yNXJlbTtcbiAgYm94LXNoYWRvdzogMCAycHggNHB4IHJnYmEoMjU1LCAyMjMsIDAsIDAuMDUpO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4ycywgY29sb3IgMC4ycywgYm9yZGVyLWNvbG9yIDAuMnM7XG4gIHdoaXRlLXNwYWNlOiBub3JtYWw7XG4gIGxpbmUtaGVpZ2h0OiAxLjQ7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi5uby1wcm92aWRlci13YXJuaW5nOmhvdmVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZThhMTtcbiAgY29sb3I6ICM3YTVjMDA7XG4gIGJvcmRlci1jb2xvcjogI2ZmZDk2Njtcbn1cblxuLm5vLXByb3ZpZGVyLXdhcm5pbmc6YWN0aXZlIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZThhMTtcbiAgY29sb3I6ICM1YzQzMDA7XG4gIGJvcmRlci1jb2xvcjogI2ZmZDk2Njtcbn1cblxuLm5vLXByb3ZpZGVyLXdhcm5pbmc6Zm9jdXMge1xuICBvdXRsaW5lOiAycHggc29saWQgI2ZmNmYwMDtcbiAgb3V0bGluZS1vZmZzZXQ6IDJweDtcbn1cblxuLnRhYi1wcm92aWRlci1yZXF1aXJlZC1vdmVybGF5IHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC43KTtcbiAgYmFja2Ryb3AtZmlsdGVyOiBibHVyKDRweCk7XG4gIHotaW5kZXg6IDEwO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgZm9udC1zaXplOiAxLjFyZW07XG4gIGNvbG9yOiAjMzMzO1xuICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIGJvcmRlci1yYWRpdXM6IGluaGVyaXQ7XG59XG5cbi8qIENvcm5lciBTVkcgc3R5bGVzICovXG4uY29ybmVyLXN2ZyB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IDEycHg7XG4gIGhlaWdodDogMTJweDtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIHotaW5kZXg6IDEwO1xufVxuXG4uY29ybmVyLXRvcC1sZWZ0IHtcbiAgdG9wOiAycHg7XG4gIGxlZnQ6IDJweDtcbn1cblxuLmNvcm5lci10b3AtcmlnaHQge1xuICB0b3A6IDJweDtcbiAgcmlnaHQ6IDJweDtcbn1cblxuLmNvcm5lci1ib3R0b20tbGVmdCB7XG4gIGJvdHRvbTogMnB4O1xuICBsZWZ0OiAycHg7XG59XG5cbi5jb3JuZXItYm90dG9tLXJpZ2h0IHtcbiAgYm90dG9tOiAycHg7XG4gIHJpZ2h0OiAycHg7XG59XG5cbi5jb3JuZXItc3F1YXJlIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgei1pbmRleDogMTA7XG59XG4iXX0= */";
var styles = {"modal":"auth-module_modal__yyg5L","outer-container":"auth-module_outer-container__RraOQ","container":"auth-module_container__7utns","linking-container":"auth-module_linking-container__mYNwD","origin-tab":"auth-module_origin-tab__miOUK","origin-section":"auth-module_origin-section__UBhBB","origin-container":"auth-module_origin-container__ZIk4c","claim-section":"auth-module_claim-section__i68z0","origin-wrapper":"auth-module_origin-wrapper__JQfEI","origin-label":"auth-module_origin-label__l-1q9","horizontal-divider":"auth-module_horizontal-divider__YfWCy","divider":"auth-module_divider__z65Me","origin-dashboard-button":"auth-module_origin-dashboard-button__-pch4","header":"auth-module_header__pX9nM","auth-header":"auth-module_auth-header__LsM1f","small-modal-icon":"auth-module_small-modal-icon__YayD1","wallet-address":"auth-module_wallet-address__AVVA5","close-button":"auth-module_close-button__uZrho","close-icon":"auth-module_close-icon__SSCni","linking-text":"auth-module_linking-text__uz3ud","provider-list":"auth-module_provider-list__6vISy","big":"auth-module_big__jQxvN","spinner":"auth-module_spinner__hfzlH","spin":"auth-module_spin__tm9l6","modal-icon":"auth-module_modal-icon__CV7ah","footer-text":"auth-module_footer-text__CQnh6","footer-container":"auth-module_footer-container__UJBZk","environment-indicator":"auth-module_environment-indicator__5loWh","environment-tooltip":"auth-module_environment-tooltip__R0PTI","disconnect-button":"auth-module_disconnect-button__bsu-3","linking-button":"auth-module_linking-button__g1GlL","socials-wrapper":"auth-module_socials-wrapper__PshV3","socials-container":"auth-module_socials-container__iDzfJ","connector-container":"auth-module_connector-container__4wn11","connector-button":"auth-module_connector-button__j79HA","connector-connected":"auth-module_connector-connected__JvDQb","connector-checkmark":"auth-module_connector-checkmark__ZS6zU","unlink-connector-button":"auth-module_unlink-connector-button__6Fwkp","loader":"auth-module_loader__gH3ZC","no-socials":"auth-module_no-socials__wEx0t","tiktok-input":"auth-module_tiktok-input__FeqdG","invalid":"auth-module_invalid__qqgK6","otp-input-container":"auth-module_otp-input-container__B2NH6","otp-input":"auth-module_otp-input__vjImt","tabs":"auth-module_tabs__RcUmV","tab-button":"auth-module_tab-button__HT6wc","active-tab":"auth-module_active-tab__l6P44","tab-content":"auth-module_tab-content__noHF0","vertical-tabs-container":"auth-module_vertical-tabs-container__6sAOL","vertical-tabs":"auth-module_vertical-tabs__-ba-W","vertical-tab-content":"auth-module_vertical-tab-content__wTqKF","ip-tab-container":"auth-module_ip-tab-container__ck0F8","ip-tab-content":"auth-module_ip-tab-content__VI4zC","ip-tab-content-text":"auth-module_ip-tab-content-text__y2BRh","contract-button-container":"auth-module_contract-button-container__7HH9n","no-provider-warning":"auth-module_no-provider-warning__YzGd-","tab-provider-required-overlay":"auth-module_tab-provider-required-overlay__dvmIR","corner-svg":"auth-module_corner-svg__WYa3o","corner-top-left":"auth-module_corner-top-left__mYKEQ","corner-top-right":"auth-module_corner-top-right__LejG2","corner-bottom-left":"auth-module_corner-bottom-left__gSw9-","corner-bottom-right":"auth-module_corner-bottom-right__I-KCA","corner-square":"auth-module_corner-square__eC1DH"};
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
const CopyIcon = ({ w, h }) => (React.createElement("svg", { clipRule: "evenodd", fillRule: "evenodd", strokeLinejoin: "round", strokeMiterlimit: "2", width: w, height: h, viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "m6 19v2c0 .621.52 1 1 1h2v-1.5h-1.5v-1.5zm7.5 3h-3.5v-1.5h3.5zm4.5 0h-3.5v-1.5h3.5zm4-3h-1.5v1.5h-1.5v1.5h2c.478 0 1-.379 1-1zm-1.5-1v-3.363h1.5v3.363zm0-4.363v-3.637h1.5v3.637zm-13-3.637v3.637h-1.5v-3.637zm11.5-4v1.5h1.5v1.5h1.5v-2c0-.478-.379-1-1-1zm-10 0h-2c-.62 0-1 .519-1 1v2h1.5v-1.5h1.5zm4.5 1.5h-3.5v-1.5h3.5zm3-1.5v-2.5h-13v13h2.5v-1.863h1.5v3.363h-4.5c-.48 0-1-.379-1-1v-14c0-.481.38-1 1-1h14c.621 0 1 .522 1 1v4.5h-3.5v-1.5z", fillRule: "nonzero" })));
const CornerSVG = ({ position, padding = 2, color = "currentColor", thickness = 1, width = 12, height = 12, className = "", }) => {
    let rotation = 0;
    if (position === "top-right")
        rotation = 90;
    if (position === "bottom-right")
        rotation = 180;
    if (position === "bottom-left")
        rotation = 270;
    const strokeWidth = typeof thickness === "number" ? thickness : parseFloat(thickness);
    const positionClass = styles[`corner-${position.replace("-", "-")}`];
    return (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 25 25", fill: "none", className: `${styles["corner-svg"]} ${positionClass} ${className}`, style: Object.assign({ transform: `rotate(${rotation}deg)`, color, width: typeof width === "number" ? `${width}px` : width, height: typeof height === "number" ? `${height}px` : height }, (typeof padding === "number"
            ? {
                [position.includes("top") ? "top" : "bottom"]: `${padding}px`,
                [position.includes("left") ? "left" : "right"]: `${padding}px`,
            }
            : {
                [position.includes("top") ? "top" : "bottom"]: padding,
                [position.includes("left") ? "left" : "right"]: padding,
            })) },
        React.createElement("path", { d: "M1 25L0.999999 1L25 1", stroke: "currentColor", strokeWidth: strokeWidth })));
};
const CornerSquare = ({ position, padding = 4, color = "white", size = 4, className = "", opacity = 0.5, }) => {
    const positionClass = styles[`corner-${position.replace("-", "-")}`];
    return (React.createElement("div", { className: `${styles["corner-square"]} ${positionClass} ${className}`, style: Object.assign({ backgroundColor: color, width: typeof size === "number" ? `${size}px` : size, height: typeof size === "number" ? `${size}px` : size, opacity }, (typeof padding === "number"
            ? {
                [position.includes("top") ? "top" : "bottom"]: `${padding}px`,
                [position.includes("left") ? "left" : "right"]: `${padding}px`,
            }
            : {
                [position.includes("top") ? "top" : "bottom"]: padding,
                [position.includes("left") ? "left" : "right"]: padding,
            })) }));
};
const SquareCorners = ({ padding = 2, color = "white", size = 4, className = "", opacity = 0.5, }) => {
    return (React.createElement(React.Fragment, null,
        React.createElement(CornerSquare, { position: "top-left", padding: padding, color: color, size: size, className: className, opacity: opacity }),
        React.createElement(CornerSquare, { position: "top-right", padding: padding, color: color, size: size, className: className, opacity: opacity }),
        React.createElement(CornerSquare, { position: "bottom-left", padding: padding, color: color, size: size, className: className, opacity: opacity }),
        React.createElement(CornerSquare, { position: "bottom-right", padding: padding, color: color, size: size, className: className, opacity: opacity })));
};
const ArrowCorners = ({ padding = 2, color = "currentColor", thickness = 1, size = 12, className = "", }) => {
    return (React.createElement(React.Fragment, null,
        React.createElement(CornerSVG, { position: "top-left", padding: padding, color: color, thickness: thickness, width: size, height: size, className: className }),
        React.createElement(CornerSVG, { position: "top-right", padding: padding, color: color, thickness: thickness, width: size, height: size, className: className }),
        React.createElement(CornerSVG, { position: "bottom-left", padding: padding, color: color, thickness: thickness, width: size, height: size, className: className }),
        React.createElement(CornerSVG, { position: "bottom-right", padding: padding, color: color, thickness: thickness, width: size, height: size, className: className })));
};

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

const CampContext = createContext({
    clientId: null,
    auth: null,
    setAuth: () => { },
    wagmiAvailable: false,
    environment: ENVIRONMENTS.DEVELOPMENT,
});
/**
 * CampProvider
 * @param {Object} props The props
 * @param {string} props.clientId The Camp client ID
 * @param {string} props.redirectUri The redirect URI to use after social oauths
 * @param {React.ReactNode} props.children The children components
 * @param {string | bigint} props.baseParentId The base parent ID to use for minted NFTs
 * @param {string} props.environment The environment to use ("DEVELOPMENT" or "PRODUCTION")
 * @returns {JSX.Element} The CampProvider component
 */
const CampProvider = ({ clientId, redirectUri, children, environment = "DEVELOPMENT", baseParentId, }) => {
    const isServer = typeof window === "undefined";
    const normalizedBaseParentId = typeof baseParentId === "string" ? BigInt(baseParentId) : baseParentId;
    const [auth, setAuth] = useState(!isServer
        ? new Auth({
            clientId,
            redirectUri: redirectUri
                ? redirectUri
                : !isServer
                    ? window.location.href
                    : "",
            environment: environment,
            baseParentId: normalizedBaseParentId,
        })
        : null);
    const wagmiContext = typeof window !== "undefined" ? useContext(WagmiContext) : undefined;
    return (React.createElement(CampContext.Provider, { value: {
            clientId,
            auth,
            setAuth,
            wagmiAvailable: wagmiContext !== undefined,
            environment: ENVIRONMENTS[environment],
        } },
        React.createElement(SocialsProvider, null,
            React.createElement(ToastProvider, null,
                React.createElement(ModalProvider, null, children)))));
};

const getWalletConnectProvider = (projectId, chain) => __awaiter(void 0, void 0, void 0, function* () {
    const { EthereumProvider } = yield import('@walletconnect/ethereum-provider');
    const provider = yield EthereumProvider.init({
        optionalChains: [chain.id],
        chains: [chain.id],
        projectId,
        showQrModal: true,
        methods: ["personal_sign"],
    });
    return provider;
});
const useWalletConnectProvider = (projectId, chain) => {
    const [walletConnectProvider, setWalletConnectProvider] = useState(null);
    useEffect(() => {
        const fetchWalletConnectProvider = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const provider = yield getWalletConnectProvider(projectId, chain);
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

var css_248z = ".buttons-module_button__4Ogad{background-color:#ff6f00;border:none;border-radius:0;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);color:#fff;font-family:Geist Mono,monospace;font-size:1rem;font-size:.875rem;font-weight:600;height:2.5rem;margin-bottom:.75rem;margin-top:1rem;padding:1rem;padding-block:0;position:relative;text-transform:uppercase;width:100%}.buttons-module_button__4Ogad:hover{background-color:#cc4e02;cursor:pointer}.buttons-module_button__4Ogad:disabled{background-color:#ccc;cursor:not-allowed}.buttons-module_connect-button__CJhUa{background-color:#ff6f00;border:none;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);color:#fff;font-family:Geist Mono,monospace;font-size:1rem;font-weight:600;height:2.75rem;line-height:1.333rem;padding-inline:2.5rem;padding-left:5rem;position:relative;text-transform:uppercase;transition:background-color .15s;width:13rem}.buttons-module_connect-button__CJhUa .buttons-module_button-icon__JM4-2{background:hsla(0,0%,100%,.75);box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05);display:grid;height:100%;left:0;margin-right:.5rem;place-items:center;position:absolute;top:50%;transform:translateY(-50%);transition:background-color .15s;width:3rem}.buttons-module_connect-button__CJhUa .buttons-module_button-icon__JM4-2 svg{height:1.25rem;width:1.25rem}.buttons-module_connect-button__CJhUa:hover{background-color:#cc4e02;border-color:#cc4e02;cursor:pointer}.buttons-module_connect-button__CJhUa:hover .buttons-module_button-icon__JM4-2{background:hsla(0,0%,100%,.675)}.buttons-module_connect-button__CJhUa:focus{outline:none}.buttons-module_connect-button__CJhUa:disabled{background-color:#ccc;cursor:not-allowed}.buttons-module_provider-button__6JY7s{align-items:center;border:1px solid #ddd;display:flex;gap:.5rem;justify-content:flex-start;padding:.5rem;position:relative;transition:border-color .15s;width:100%}.buttons-module_provider-button__6JY7s:focus{outline:1px solid #ff6f00;outline-offset:2px}.buttons-module_provider-button__6JY7s:hover{border-color:#ff6f00}.buttons-module_provider-button__6JY7s:hover:not(:disabled){cursor:pointer}.buttons-module_provider-button__6JY7s img{height:2rem;width:2rem}.buttons-module_provider-button__6JY7s .buttons-module_provider-icon__MOhr8{border-radius:.2rem}.buttons-module_provider-button__6JY7s span{line-height:1rem;margin-left:.5rem}.buttons-module_provider-button__6JY7s span.buttons-module_provider-name__tHWO2{color:#333;font-size:.875rem}.buttons-module_provider-button__6JY7s span.buttons-module_provider-label__CEGRr{color:#777;font-family:Geist Mono,monospace;font-size:.7rem;text-transform:uppercase}.buttons-module_link-button-default__EcKUT{background-color:#ff6f00;border:none;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);box-sizing:border-box;cursor:pointer;height:2.6rem;position:relative;width:7rem}.buttons-module_link-button-default__EcKUT:disabled{background-color:#b8b8b8;cursor:not-allowed}.buttons-module_link-button-default__EcKUT:after{background-color:transparent;border-radius:.75rem;bottom:0;content:\"\";left:0;position:absolute;right:0;top:0;transition:background-color .15s}.buttons-module_link-button-default__EcKUT:disabled:after{background-color:rgba(0,0,0,.35);border-radius:.35rem;color:#fff;content:\"Not connected\";display:grid;font-size:.75rem;height:2rem;left:0;opacity:0;padding:.25rem;place-items:center;position:absolute;right:0;top:-2.7rem;transform:translateY(-.5rem);transition:all .25s;-webkit-user-select:none;-moz-user-select:none;user-select:none;visibility:hidden}.buttons-module_link-button-default__EcKUT:disabled:hover:after{opacity:1;transform:translateY(0);visibility:visible}.buttons-module_link-button-default__EcKUT:not(:disabled):hover:after{background-color:rgba(0,0,0,.1)}.buttons-module_link-button-default__EcKUT:not(:disabled).buttons-module_twitter__9sRaz{background-color:#1da1f2}.buttons-module_link-button-default__EcKUT:not(:disabled).buttons-module_spotify__-fiKQ{background-color:#1db954}.buttons-module_link-button-default__EcKUT:not(:disabled).buttons-module_discord__I-YjZ{background-color:#7289da}.buttons-module_link-button-default__EcKUT:not(:disabled).buttons-module_tiktok__a80-0{background-color:#000}.buttons-module_link-button-default__EcKUT:not(:disabled).buttons-module_telegram__ExOTS{background-color:#08c}.buttons-module_link-button-default__EcKUT .buttons-module_button-container__-oPqd{align-items:center;display:flex;flex-direction:row;gap:.5rem;justify-content:center;padding:.5rem}.buttons-module_button-container__-oPqd .buttons-module_social-icon__DPdPe{align-items:center;color:#fff;display:flex;height:1.5rem;justify-content:center;width:1.5rem}.buttons-module_button-container__-oPqd .buttons-module_social-icon__DPdPe svg{fill:#fff!important;height:1.5rem;width:1.5rem}.buttons-module_button-container__-oPqd .buttons-module_social-icon__DPdPe svg path{fill:#fff!important}.buttons-module_button-container__-oPqd .buttons-module_link-icon__8V8FP{align-items:center;color:hsla(0,0%,100%,.8);display:flex;height:1.25rem;justify-content:center;width:1.25rem}.buttons-module_button-container__-oPqd .buttons-module_camp-logo__slNl0{align-items:center;background-color:#fff;border-radius:50%;box-sizing:border-box;display:flex;height:1.5rem;justify-content:center;padding:.15rem;width:1.5rem}.buttons-module_link-button-default__EcKUT:disabled .buttons-module_button-container__-oPqd .buttons-module_camp-logo__slNl0 svg path{fill:#b8b8b8!important}.buttons-module_link-button-icon__llX8m{background-color:#ff6f00;border:none;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);box-sizing:border-box;cursor:pointer;height:3rem;min-height:3rem;min-width:3rem;padding:0;position:relative;width:3rem}.buttons-module_link-button-icon__llX8m:disabled{background-color:#b8b8b8;cursor:not-allowed}.buttons-module_link-button-icon__llX8m:disabled:after{background-color:rgba(0,0,0,.35);border-radius:.35rem;box-sizing:border-box;color:#fff;content:\"Not connected\";display:grid;font-size:.75rem;height:-moz-fit-content;height:fit-content;left:-1rem;opacity:0;padding:.25rem;place-items:center;position:absolute;right:-1rem;top:-2.7rem;transform:translateY(-.5rem);transition:all .25s}.buttons-module_link-button-icon__llX8m:disabled:hover:after{opacity:1;transform:translateY(0)}.buttons-module_link-button-icon__llX8m:after{background-color:transparent;border-radius:.75rem;bottom:0;content:\"\";left:0;position:absolute;right:0;top:0;transition:background-color .15s}.buttons-module_link-button-icon__llX8m:not(:disabled):hover:after{background-color:rgba(0,0,0,.1)}.buttons-module_link-button-icon__llX8m:not(:disabled).buttons-module_twitter__9sRaz{background-color:#1da1f2}.buttons-module_link-button-icon__llX8m:not(:disabled).buttons-module_spotify__-fiKQ{background-color:#1db954}.buttons-module_link-button-icon__llX8m:not(:disabled).buttons-module_discord__I-YjZ{background-color:#7289da}.buttons-module_link-button-icon__llX8m:not(:disabled).buttons-module_tiktok__a80-0{background-color:#000}.buttons-module_link-button-icon__llX8m:not(:disabled).buttons-module_telegram__ExOTS{background-color:#08c}.buttons-module_link-button-icon__llX8m .buttons-module_icon-container__Q5bI1{align-items:center;display:flex;flex:1;height:100%;justify-content:center;position:relative;width:100%}.buttons-module_link-button-icon__llX8m .buttons-module_icon-container__Q5bI1>svg{fill:#fff!important;height:1.5rem;width:1.5rem}.buttons-module_link-button-icon__llX8m .buttons-module_icon-container__Q5bI1>svg path{fill:#fff!important}.buttons-module_link-button-icon__llX8m .buttons-module_camp-logo__slNl0{align-items:center;background-color:#fff;border-radius:50%;bottom:-.5rem;box-sizing:border-box;display:flex;height:1.5rem;justify-content:center;position:absolute;right:-.5rem;width:1.5rem}.buttons-module_link-button-icon__llX8m .buttons-module_camp-logo__slNl0 svg{height:1.1rem;width:1.1rem}.buttons-module_link-button-icon__llX8m:disabled .buttons-module_camp-logo__slNl0 svg path,.buttons-module_not-linked__ua4va svg path{fill:#b8b8b8!important}.buttons-module_file-upload-container__le7Cg{align-items:center;border:2px dashed #ccc;box-sizing:border-box;color:#777;cursor:pointer;display:flex;flex-direction:column;justify-content:center;max-width:100%;min-height:12rem;min-width:0;overflow-y:auto;padding:1rem;position:relative;text-align:center;transition:background-color .2s,border-color .2s;width:100%}.buttons-module_file-upload-container__le7Cg:hover{border-color:#e2e2e2}.buttons-module_file-upload-container__le7Cg.buttons-module_dragging__cfggZ{background-color:#f9f9f9;border-color:#ff6f00}.buttons-module_file-upload-container__le7Cg.buttons-module_dragging__cfggZ .buttons-module_file-preview__yuM5i{opacity:.2;transition:opacity .2s}.buttons-module_file-upload-container__le7Cg.buttons-module_file-selected__YY6ms{background-color:#f9f9f9;border:none;padding:0 .5rem 0 0}.buttons-module_file-input__gbD5T{display:none}.buttons-module_selected-file-container__E1AXM{align-items:center;display:flex;flex-direction:column;gap:.25rem;height:100%;justify-content:space-between;max-width:100%;position:relative;width:100%}.buttons-module_remove-file-button__Q1FMa{border:1px solid #ff6f00;color:#fff;color:#ff6f00;cursor:pointer;font-size:.875rem;margin-bottom:.75rem;margin-top:1rem;padding:.5rem;text-align:center;transition:background-color .2s}.buttons-module_remove-file-button__Q1FMa:hover{background-color:#cc4e02;border-color:#cc4e02;color:#fff;cursor:pointer}.buttons-module_remove-file-button__Q1FMa:disabled{background-color:#b8b8b8;border-color:#b8b8b8;color:#fff;cursor:not-allowed}.buttons-module_upload-file-button__vTwWd{background-color:#ff6f00;border:none;border-radius:.5rem;color:#fff;cursor:pointer;font-size:.875rem;padding:.5rem;text-align:center;transition:background-color .2s;width:100%}.buttons-module_upload-file-button__vTwWd:hover{background-color:#cc4e02;cursor:pointer}.buttons-module_upload-file-button__vTwWd:disabled{background-color:#b8b8b8;cursor:not-allowed}.buttons-module_file-preview__yuM5i{max-height:8rem;max-width:100%}audio.buttons-module_file-preview__yuM5i{min-height:4rem}.buttons-module_file-preview-text__80Ju0{color:#333;font-size:.875rem;margin-bottom:.5rem}.buttons-module_file-name__3iskR{color:#333;font-size:.875rem;max-width:100%;min-height:-moz-fit-content;min-height:fit-content;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.buttons-module_upload-buttons__3SAw6{align-items:center;display:flex;gap:.25rem;justify-content:space-between;width:100%}.buttons-module_upload-buttons__3SAw6 .buttons-module_upload-file-button__vTwWd{flex-grow:1}.buttons-module_upload-buttons__3SAw6 .buttons-module_remove-file-button__Q1FMa{flex-grow:0}.buttons-module_accepted-types__Ys-D2{color:#777;font-size:.875rem;font-style:italic;margin-top:.5rem}.buttons-module_loading-bar-container__nrgPX{background-color:#e0e0e0;margin-top:8px;min-height:8px;overflow:hidden;width:100%}.buttons-module_loading-bar__IUAg1{background-color:#ff6f00;min-height:100%;transition:width .3s ease}.buttons-module_date-picker__V6gRM{display:flex;flex-direction:column;font-family:sans-serif;gap:6px;width:100%}.buttons-module_date-picker__V6gRM input{border:1px solid #ccc;border-radius:4px;font-size:14px;padding:6px 10px}.buttons-module_percentage-slider__M84tC{display:flex;flex-direction:row;font-family:sans-serif;gap:8px;justify-content:space-between;width:100%}.buttons-module_percentage-slider__M84tC input[type=range]{width:100%}.buttons-module_percentage-slider__M84tC label{min-width:50px}.buttons-module_fancy-input-container__s-zVw{align-items:center;border:1px solid #ccc;display:flex;font-family:sans-serif;gap:0;min-height:2.5rem;overflow:hidden;position:relative;width:100%}.buttons-module_fancy-input-container__s-zVw textarea.buttons-module_fancy-input__RpSOF{background:transparent;border:none;box-sizing:border-box;color:#222;font-family:inherit;font-size:1rem;line-height:1.4;max-height:12rem;outline:none;overflow-y:auto;padding:10px;resize:none;width:100%}.buttons-module_fancy-input__RpSOF{background:transparent;border:none;flex:1;font-family:sans-serif;outline:none;padding:6px 10px}.buttons-module_fancy-input-label__d-sG7{align-self:flex-start;color:#777;font-family:Geist Mono,monospace;font-size:.8rem;font-weight:500;margin-top:.25rem;padding:0 .25rem;pointer-events:none;text-transform:uppercase}.buttons-module_input-divider__RVasJ{background-color:#ccc;height:24px;margin:0;min-width:1px}.buttons-module_input-icon-container__MUYKL{align-items:center;background-color:#f8f9fa;display:flex;justify-content:center;min-width:40px;padding:6px 10px}.buttons-module_input-icon-container__MUYKL svg{height:16px;width:16px}.buttons-module_duration-input-container__Rh9Na{align-items:stretch;border:1px solid #ccc;box-sizing:border-box;display:flex;font-family:sans-serif;gap:0;min-height:2.5rem;overflow:hidden;width:100%}.buttons-module_duration-input__-gt3p{background:transparent;flex:1;min-width:0}.buttons-module_duration-input__-gt3p,.buttons-module_duration-unit-select__VKFf6{border:none;box-sizing:border-box;font-family:sans-serif;outline:none;padding:6px 10px}.buttons-module_duration-unit-select__VKFf6{background-color:#f8f9fa;border-left:1px solid #ccc;cursor:pointer;flex:0 0 auto;width:auto}.buttons-module_price-input-container__teIRS:focus-within{border-color:#ff6f00;box-shadow:0 0 0 1px #ff6f00}.buttons-module_duration-input-container__Rh9Na:focus-within{border-color:#ff6f00;box-shadow:0 0 0 1px #ff6f00}.buttons-module_duration-input-container__Rh9Na:hover,.buttons-module_price-input-container__teIRS:hover{border-color:#999}.buttons-module_duration-unit-select__VKFf6:focus,.buttons-module_duration-unit-select__VKFf6:hover{background-color:#e9ecef}.buttons-module_preview-option-container__0bzt-{align-items:center;display:flex;margin-top:.5rem;width:100%}.buttons-module_checkbox-label__ODwgG{align-items:center;color:#333;cursor:pointer;display:flex;font-size:.875rem;gap:.5rem;-webkit-user-select:none;-moz-user-select:none;user-select:none}.buttons-module_checkbox-input__FvUIp{accent-color:#ff6f00;cursor:pointer;height:1.125rem;width:1.125rem}.buttons-module_checkbox-label__ODwgG span{line-height:1.2}.buttons-module_preview-image-section__BjtiC{margin-top:.5rem}.buttons-module_preview-image-controls__l6gv5,.buttons-module_preview-image-section__BjtiC{display:flex;flex-direction:column;gap:.5rem;width:100%}.buttons-module_select-preview-button__0HQfm{background-color:#f8f9fa;border:1px solid #ccc;color:#333;cursor:pointer;font-family:Geist Mono,monospace;font-size:.875rem;padding:.75rem;text-transform:uppercase;transition:all .2s;width:100%}.buttons-module_select-preview-button__0HQfm:hover:not(:disabled){background-color:#e9ecef;border-color:#999}.buttons-module_select-preview-button__0HQfm:disabled{background-color:#e9ecef;color:#999;cursor:not-allowed;opacity:.6}.buttons-module_preview-image-preview__c-6n5{align-items:center;background-color:#f8f9fa;border:1px solid #ccc;display:flex;gap:.75rem;padding:.75rem}.buttons-module_preview-thumbnail__fJWXt{flex-shrink:0;height:3rem;-o-object-fit:cover;object-fit:cover;width:3rem}.buttons-module_preview-filename__FW-Gz{color:#333;flex:1;font-size:.875rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.buttons-module_remove-preview-button__Skqgb{align-items:center;background-color:transparent;border:1px solid #ff6f00;color:#ff6f00;cursor:pointer;display:flex;flex-shrink:0;justify-content:center;padding:.5rem;transition:all .2s}.buttons-module_remove-preview-button__Skqgb:hover:not(:disabled){background-color:#cc4e02;border-color:#cc4e02;color:#fff}.buttons-module_remove-preview-button__Skqgb:disabled{border-color:#ccc;color:#ccc;cursor:not-allowed;opacity:.6}.buttons-module_percentage-icon__MxmJh{color:#555;font-size:.875rem;font-weight:600}\n/*# sourceMappingURL=data:application/json;base64,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QVBuQiw0QkFBNkIsQ0FDN0Isd0JBQXlCLENBQ3pCLGFBQWMsQ0FDZCxjQUFlLENBR2YsWUFBYSxDQURiLGFBQWMsQ0FHZCxzQkFBdUIsQ0FUdkIsYUFBZSxDQUtmLGtCQUtGLENBRUEsa0VBQ0Usd0JBQXlCLENBQ3pCLG9CQUFxQixDQUNyQixVQUNGLENBRUEsc0RBQ0UsaUJBQWtCLENBQ2xCLFVBQVcsQ0FDWCxrQkFBbUIsQ0FDbkIsVUFDRixDQUVBLHVDQUdFLFVBQVcsQ0FGWCxpQkFBbUIsQ0FDbkIsZUFFRiIsImZpbGUiOiJidXR0b25zLm1vZHVsZS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuYnV0dG9uIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmY2ZjAwO1xuICBjb2xvcjogd2hpdGU7XG4gIGJvcmRlcjogbm9uZTtcbiAgYm9yZGVyLXJhZGl1czogMDtcbiAgcGFkZGluZzogMXJlbTtcbiAgcGFkZGluZy1ibG9jazogMDtcbiAgZm9udC1zaXplOiAxcmVtO1xuICB3aWR0aDogMTAwJTtcbiAgbWFyZ2luLWJvdHRvbTogMC43NXJlbTtcbiAgbWFyZ2luLXRvcDogMXJlbTtcbiAgaGVpZ2h0OiAyLjVyZW07XG4gIGJveC1zaGFkb3c6IGhzbGEoMCwgMCUsIDEwMCUsIDAuMTUpIDAgMnB4IDAgaW5zZXQsXG4gICAgcmdiYSgwLCAwLCAwLCAwLjA1KSAwIC0ycHggNHB4IGluc2V0LCByZ2JhKDQ2LCA1NCwgODAsIDAuMDc1KSAwIDFweCAxcHg7XG5cbiAgZm9udC1mYW1pbHk6IFwiR2Vpc3QgTW9ub1wiLCBtb25vc3BhY2U7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIGZvbnQtc2l6ZTogMC44NzVyZW07XG59XG5cbi5idXR0b246aG92ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2M0ZTAyO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5idXR0b246ZGlzYWJsZWQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xufVxuXG4uY29ubmVjdC1idXR0b24ge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZjZmMDA7XG4gIGNvbG9yOiB3aGl0ZTtcbiAgYm9yZGVyOiBub25lO1xuICAvKiBib3JkZXItcmFkaXVzOiAwLjc1cmVtOyAqL1xuICBwYWRkaW5nLWlubGluZTogMi41cmVtO1xuICBwYWRkaW5nLWxlZnQ6IDVyZW07XG4gIGhlaWdodDogMi43NXJlbTtcbiAgbGluZS1oZWlnaHQ6IDEuMzMzcmVtO1xuICBmb250LXNpemU6IDFyZW07XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIHdpZHRoOiAxM3JlbTtcbiAgZm9udC1mYW1pbHk6IFwiR2Vpc3QgTW9ub1wiLCBtb25vc3BhY2U7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIGJveC1zaGFkb3c6IGhzbGEoMCwgMCUsIDEwMCUsIDAuMTUpIDAgMnB4IDAgaW5zZXQsXG4gICAgcmdiYSgwLCAwLCAwLCAwLjA1KSAwIC0ycHggNHB4IGluc2V0LCByZ2JhKDQ2LCA1NCwgODAsIDAuMDc1KSAwIDFweCAxcHg7XG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4xNXM7XG59XG5cbi5jb25uZWN0LWJ1dHRvbiAuYnV0dG9uLWljb24ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogNTAlO1xuICBsZWZ0OiAwO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7XG4gIHdpZHRoOiAzcmVtO1xuICBoZWlnaHQ6IDEwMCU7XG4gIG1hcmdpbi1yaWdodDogMC41cmVtO1xuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuNzUpO1xuICBib3gtc2hhZG93OiBoc2xhKDAsIDAlLCAxMDAlLCAwLjE1KSAwIDJweCAwIGluc2V0LFxuICAgIHJnYmEoMCwgMCwgMCwgMC4wNSkgMCAtMnB4IDRweCBpbnNldDtcbiAgZGlzcGxheTogZ3JpZDtcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjE1cztcbiAgLyogYm9yZGVyLXJhZGl1czogMC43NXJlbSAwIDAgMC43NXJlbTsgKi9cbn1cblxuLmNvbm5lY3QtYnV0dG9uIC5idXR0b24taWNvbiBzdmcge1xuICB3aWR0aDogMS4yNXJlbTtcbiAgaGVpZ2h0OiAxLjI1cmVtO1xufVxuXG4uY29ubmVjdC1idXR0b246aG92ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2M0ZTAyO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGJvcmRlci1jb2xvcjogI2NjNGUwMjtcbn1cblxuLmNvbm5lY3QtYnV0dG9uOmhvdmVyIC5idXR0b24taWNvbiB7XG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC42NzUpO1xufVxuXG4uY29ubmVjdC1idXR0b246Zm9jdXMge1xuICBvdXRsaW5lOiBub25lO1xufVxuXG4uY29ubmVjdC1idXR0b246ZGlzYWJsZWQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xufVxuXG4ucHJvdmlkZXItYnV0dG9uIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nOiAwLjVyZW07XG4gIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XG4gIC8qIGJvcmRlci1yYWRpdXM6IDAuNXJlbTsgKi9cbiAgLyogYmFja2dyb3VuZC1jb2xvcjogI2ZlZmVmZTsgKi9cbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xuICBnYXA6IDAuNXJlbTtcbiAgd2lkdGg6IDEwMCU7XG4gIHRyYW5zaXRpb246IGJvcmRlci1jb2xvciAwLjE1cztcbn1cblxuLnByb3ZpZGVyLWJ1dHRvbjpmb2N1cyB7XG4gIG91dGxpbmU6IDFweCBzb2xpZCAjZmY2ZjAwO1xuICBvdXRsaW5lLW9mZnNldDogMnB4O1xufVxuXG4ucHJvdmlkZXItYnV0dG9uOmhvdmVyIHtcbiAgYm9yZGVyLWNvbG9yOiAjZmY2ZjAwO1xuICAvKiBiYWNrZ3JvdW5kLWNvbG9yOiAjZWVlOyAqL1xufVxuXG4ucHJvdmlkZXItYnV0dG9uOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHtcbiAgLyogYmFja2dyb3VuZC1jb2xvcjogI2RkZDsgKi9cbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4ucHJvdmlkZXItYnV0dG9uIGltZyB7XG4gIHdpZHRoOiAycmVtO1xuICBoZWlnaHQ6IDJyZW07XG59XG5cbi5wcm92aWRlci1idXR0b24gLnByb3ZpZGVyLWljb24ge1xuICBib3JkZXItcmFkaXVzOiAwLjJyZW07XG59XG5cbi5wcm92aWRlci1idXR0b24gc3BhbiB7XG4gIG1hcmdpbi1sZWZ0OiAwLjVyZW07XG4gIGxpbmUtaGVpZ2h0OiAxcmVtO1xufVxuXG4ucHJvdmlkZXItYnV0dG9uIHNwYW4ucHJvdmlkZXItbmFtZSB7XG4gIGNvbG9yOiAjMzMzO1xuICBmb250LXNpemU6IDAuODc1cmVtO1xufVxuXG4ucHJvdmlkZXItYnV0dG9uIHNwYW4ucHJvdmlkZXItbGFiZWwge1xuICBjb2xvcjogIzc3NztcbiAgZm9udC1zaXplOiAwLjdyZW07XG4gIGZvbnQtZmFtaWx5OiBcIkdlaXN0IE1vbm9cIiwgbW9ub3NwYWNlO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xufVxuXG4vKiBcImRlZmF1bHRcIiB2YXJpYW50ICovXG4ubGluay1idXR0b24tZGVmYXVsdCB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgYm9yZGVyOiBub25lO1xuICB3aWR0aDogN3JlbTtcbiAgaGVpZ2h0OiAyLjZyZW07XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZjZmMDA7XG4gIC8qIGJvcmRlci1yYWRpdXM6IDAuNzVyZW07ICovXG4gIGJveC1zaGFkb3c6IGhzbGEoMCwgMCUsIDEwMCUsIDAuMTUpIDAgMnB4IDAgaW5zZXQsXG4gICAgcmdiYSgwLCAwLCAwLCAwLjA1KSAwIC0ycHggNHB4IGluc2V0LCByZ2JhKDQ2LCA1NCwgODAsIDAuMDc1KSAwIDFweCAxcHg7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLmxpbmstYnV0dG9uLWRlZmF1bHQ6ZGlzYWJsZWQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYjhiOGI4O1xuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xufVxuXG4ubGluay1idXR0b24tZGVmYXVsdDo6YWZ0ZXIge1xuICBjb250ZW50OiBcIlwiO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHRvcDogMDtcbiAgbGVmdDogMDtcbiAgcmlnaHQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgYm9yZGVyLXJhZGl1czogMC43NXJlbTtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwKTtcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjE1cztcbn1cblxuLmxpbmstYnV0dG9uLWRlZmF1bHQ6ZGlzYWJsZWQ6OmFmdGVyIHtcbiAgY29udGVudDogXCJOb3QgY29ubmVjdGVkXCI7XG4gIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IC0yLjdyZW07XG4gIGxlZnQ6IDA7XG4gIHJpZ2h0OiAwO1xuICBoZWlnaHQ6IDJyZW07XG4gIGJvcmRlci1yYWRpdXM6IDAuMzVyZW07XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4zNSk7XG4gIGNvbG9yOiB3aGl0ZTtcbiAgZGlzcGxheTogZ3JpZDtcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcbiAgZm9udC1zaXplOiAwLjc1cmVtO1xuICBwYWRkaW5nOiAwLjI1cmVtO1xuICBvcGFjaXR5OiAwO1xuICB0cmFuc2l0aW9uOiBhbGwgMC4yNXM7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtMC41cmVtKTtcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG59XG5cbi5saW5rLWJ1dHRvbi1kZWZhdWx0OmRpc2FibGVkOmhvdmVyOjphZnRlciB7XG4gIHZpc2liaWxpdHk6IHZpc2libGU7XG4gIG9wYWNpdHk6IDE7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbn1cblxuLmxpbmstYnV0dG9uLWRlZmF1bHQ6bm90KDpkaXNhYmxlZCk6aG92ZXI6OmFmdGVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjEpO1xufVxuXG4ubGluay1idXR0b24tZGVmYXVsdDpub3QoOmRpc2FibGVkKS50d2l0dGVyIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzFkYTFmMjtcbn1cblxuLmxpbmstYnV0dG9uLWRlZmF1bHQ6bm90KDpkaXNhYmxlZCkuc3BvdGlmeSB7XG4gIGJhY2tncm91bmQtY29sb3I6ICMxZGI5NTQ7XG59XG5cbi5saW5rLWJ1dHRvbi1kZWZhdWx0Om5vdCg6ZGlzYWJsZWQpLmRpc2NvcmQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjNzI4OWRhO1xufVxuXG4ubGluay1idXR0b24tZGVmYXVsdDpub3QoOmRpc2FibGVkKS50aWt0b2sge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDAwMDAwO1xufVxuXG4ubGluay1idXR0b24tZGVmYXVsdDpub3QoOmRpc2FibGVkKS50ZWxlZ3JhbSB7XG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDg4Y2M7XG59XG5cbi5saW5rLWJ1dHRvbi1kZWZhdWx0IC5idXR0b24tY29udGFpbmVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgZ2FwOiAwLjVyZW07XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBwYWRkaW5nOiAwLjVyZW07XG59XG5cbi5idXR0b24tY29udGFpbmVyIC5zb2NpYWwtaWNvbiB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHdpZHRoOiAxLjVyZW07XG4gIGhlaWdodDogMS41cmVtO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgY29sb3I6IHdoaXRlO1xufVxuXG4uYnV0dG9uLWNvbnRhaW5lciAuc29jaWFsLWljb24gc3ZnIHtcbiAgd2lkdGg6IDEuNXJlbTtcbiAgaGVpZ2h0OiAxLjVyZW07XG4gIGZpbGw6IHdoaXRlICFpbXBvcnRhbnQ7XG59XG5cbi5idXR0b24tY29udGFpbmVyIC5zb2NpYWwtaWNvbiBzdmcgcGF0aCB7XG4gIGZpbGw6IHdoaXRlICFpbXBvcnRhbnQ7XG59XG5cbi5idXR0b24tY29udGFpbmVyIC5saW5rLWljb24ge1xuICBkaXNwbGF5OiBmbGV4O1xuICB3aWR0aDogMS4yNXJlbTtcbiAgaGVpZ2h0OiAxLjI1cmVtO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgY29sb3I6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC44KTtcbn1cblxuLmJ1dHRvbi1jb250YWluZXIgLmNhbXAtbG9nbyB7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHdpZHRoOiAxLjVyZW07XG4gIGhlaWdodDogMS41cmVtO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgcGFkZGluZzogMC4xNXJlbTtcbn1cblxuLmxpbmstYnV0dG9uLWRlZmF1bHQ6ZGlzYWJsZWQgLmJ1dHRvbi1jb250YWluZXIgLmNhbXAtbG9nbyBzdmcgcGF0aCB7XG4gIGZpbGw6ICNiOGI4YjggIWltcG9ydGFudDtcbn1cblxuLyogXCJpY29uXCIgdmFyaWFudCAqL1xuLmxpbmstYnV0dG9uLWljb24ge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIG1pbi13aWR0aDogM3JlbTtcbiAgbWluLWhlaWdodDogM3JlbTtcbiAgd2lkdGg6IDNyZW07XG4gIGhlaWdodDogM3JlbTtcbiAgYm9yZGVyOiBub25lO1xuICBwYWRkaW5nOiAwcmVtO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmY2ZjAwO1xuICAvKiBib3JkZXItcmFkaXVzOiAwLjc1cmVtOyAqL1xuICBib3gtc2hhZG93OiBoc2xhKDAsIDAlLCAxMDAlLCAwLjE1KSAwIDJweCAwIGluc2V0LFxuICAgIHJnYmEoMCwgMCwgMCwgMC4wNSkgMCAtMnB4IDRweCBpbnNldCwgcmdiYSg0NiwgNTQsIDgwLCAwLjA3NSkgMCAxcHggMXB4O1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5saW5rLWJ1dHRvbi1pY29uOmRpc2FibGVkIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2I4YjhiODtcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbn1cblxuLmxpbmstYnV0dG9uLWljb246ZGlzYWJsZWQ6OmFmdGVyIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgY29udGVudDogXCJOb3QgY29ubmVjdGVkXCI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAtMi43cmVtO1xuICBsZWZ0OiAtMXJlbTtcbiAgcmlnaHQ6IC0xcmVtO1xuICBoZWlnaHQ6IGZpdC1jb250ZW50O1xuICBib3JkZXItcmFkaXVzOiAwLjM1cmVtO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMzUpO1xuICBjb2xvcjogd2hpdGU7XG4gIGRpc3BsYXk6IGdyaWQ7XG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XG4gIGZvbnQtc2l6ZTogMC43NXJlbTtcbiAgcGFkZGluZzogMC4yNXJlbTtcbiAgb3BhY2l0eTogMDtcbiAgdHJhbnNpdGlvbjogYWxsIDAuMjVzO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTAuNXJlbSk7XG59XG5cbi5saW5rLWJ1dHRvbi1pY29uOmRpc2FibGVkOmhvdmVyOjphZnRlciB7XG4gIG9wYWNpdHk6IDE7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbn1cblxuLmxpbmstYnV0dG9uLWljb246OmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIHJpZ2h0OiAwO1xuICBib3R0b206IDA7XG4gIGJvcmRlci1yYWRpdXM6IDAuNzVyZW07XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMCk7XG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4xNXM7XG59XG5cbi5saW5rLWJ1dHRvbi1pY29uOm5vdCg6ZGlzYWJsZWQpOmhvdmVyOjphZnRlciB7XG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4xKTtcbn1cblxuLmxpbmstYnV0dG9uLWljb246bm90KDpkaXNhYmxlZCkudHdpdHRlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICMxZGExZjI7XG59XG5cbi5saW5rLWJ1dHRvbi1pY29uOm5vdCg6ZGlzYWJsZWQpLnNwb3RpZnkge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMWRiOTU0O1xufVxuXG4ubGluay1idXR0b24taWNvbjpub3QoOmRpc2FibGVkKS5kaXNjb3JkIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzcyODlkYTtcbn1cblxuLmxpbmstYnV0dG9uLWljb246bm90KDpkaXNhYmxlZCkudGlrdG9rIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDtcbn1cblxuLmxpbmstYnV0dG9uLWljb246bm90KDpkaXNhYmxlZCkudGVsZWdyYW0ge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMDA4OGNjO1xufVxuXG4ubGluay1idXR0b24taWNvbiAuaWNvbi1jb250YWluZXIge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHdpZHRoOiAxMDAlO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGZsZXg6IDE7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xufVxuXG4ubGluay1idXR0b24taWNvbiAuaWNvbi1jb250YWluZXIgPiBzdmcge1xuICB3aWR0aDogMS41cmVtO1xuICBoZWlnaHQ6IDEuNXJlbTtcbiAgZmlsbDogd2hpdGUgIWltcG9ydGFudDtcbn1cblxuLmxpbmstYnV0dG9uLWljb24gLmljb24tY29udGFpbmVyID4gc3ZnIHBhdGgge1xuICBmaWxsOiB3aGl0ZSAhaW1wb3J0YW50O1xufVxuXG4ubGluay1idXR0b24taWNvbiAuY2FtcC1sb2dvIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBkaXNwbGF5OiBmbGV4O1xuICB3aWR0aDogMS41cmVtO1xuICBoZWlnaHQ6IDEuNXJlbTtcbiAgcmlnaHQ6IC0wLjVyZW07XG4gIGJvdHRvbTogLTAuNXJlbTtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG59XG5cbi5saW5rLWJ1dHRvbi1pY29uIC5jYW1wLWxvZ28gc3ZnIHtcbiAgd2lkdGg6IDEuMXJlbTtcbiAgaGVpZ2h0OiAxLjFyZW07XG59XG5cbi5saW5rLWJ1dHRvbi1pY29uOmRpc2FibGVkIC5jYW1wLWxvZ28gc3ZnIHBhdGgge1xuICBmaWxsOiAjYjhiOGI4ICFpbXBvcnRhbnQ7XG59XG5cbi5ub3QtbGlua2VkIHN2ZyBwYXRoIHtcbiAgZmlsbDogI2I4YjhiOCAhaW1wb3J0YW50O1xufVxuXG4uZmlsZS11cGxvYWQtY29udGFpbmVyIHtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgYm9yZGVyOiAycHggZGFzaGVkICNjY2M7XG4gIC8qIGJvcmRlci1yYWRpdXM6IDAuNzVyZW07ICovXG4gIHBhZGRpbmc6IDFyZW07XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgY29sb3I6ICM3Nzc7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzLCBib3JkZXItY29sb3IgMC4ycztcbiAgd2lkdGg6IDEwMCU7XG4gIG1pbi13aWR0aDogMDtcbiAgbWF4LXdpZHRoOiAxMDAlO1xuICBtaW4taGVpZ2h0OiAxMnJlbTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgb3ZlcmZsb3cteTogYXV0bztcbiAgLyogaGVpZ2h0OiAzMDBweDsgKi9cbn1cblxuLmZpbGUtdXBsb2FkLWNvbnRhaW5lcjpob3ZlciB7XG4gIGJvcmRlci1jb2xvcjogI2UyZTJlMjtcbn1cblxuLmZpbGUtdXBsb2FkLWNvbnRhaW5lci5kcmFnZ2luZyB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmOWY5Zjk7XG4gIGJvcmRlci1jb2xvcjogI2ZmNmYwMDtcbn1cblxuLmZpbGUtdXBsb2FkLWNvbnRhaW5lci5kcmFnZ2luZyAuZmlsZS1wcmV2aWV3IHtcbiAgb3BhY2l0eTogMC4yO1xuICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuMnM7XG59XG5cbi5maWxlLXVwbG9hZC1jb250YWluZXIuZmlsZS1zZWxlY3RlZCB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmOWY5Zjk7XG4gIGJvcmRlcjogbm9uZTtcbiAgcGFkZGluZzogMDtcbiAgcGFkZGluZy1yaWdodDogMC41cmVtO1xuICAvKiBoZWlnaHQ6IGF1dG87ICovXG4gIC8qIG1pbi1oZWlnaHQ6IGF1dG87ICovXG59XG5cbi5maWxlLWlucHV0IHtcbiAgZGlzcGxheTogbm9uZTtcbn1cblxuLnNlbGVjdGVkLWZpbGUtY29udGFpbmVyIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgZGlzcGxheTogZmxleDtcbiAgbWF4LXdpZHRoOiAxMDAlO1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZ2FwOiAwLjI1cmVtO1xufVxuXG4ucmVtb3ZlLWZpbGUtYnV0dG9uIHtcbiAgY29sb3I6IHdoaXRlO1xuICBib3JkZXI6IDFweCBzb2xpZCAjZmY2ZjAwO1xuICAvKiBib3JkZXItcmFkaXVzOiAwLjVyZW07ICovXG4gIHBhZGRpbmc6IDAuNXJlbTtcbiAgZm9udC1zaXplOiAwLjg3NXJlbTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMnM7XG4gIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgbWFyZ2luLWJvdHRvbTogMC43NXJlbTtcbiAgbWFyZ2luLXRvcDogMXJlbTtcbiAgY29sb3I6ICNmZjZmMDA7XG59XG5cbi5yZW1vdmUtZmlsZS1idXR0b246aG92ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2M0ZTAyO1xuICBib3JkZXItY29sb3I6ICNjYzRlMDI7XG4gIGNvbG9yOiB3aGl0ZTtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4ucmVtb3ZlLWZpbGUtYnV0dG9uOmRpc2FibGVkIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2I4YjhiODtcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgYm9yZGVyLWNvbG9yOiAjYjhiOGI4O1xuICBjb2xvcjogd2hpdGU7XG59XG5cbi51cGxvYWQtZmlsZS1idXR0b24ge1xuICBjb2xvcjogd2hpdGU7XG4gIGJhY2tncm91bmQtY29sb3I6ICNmZjZmMDA7XG4gIGJvcmRlcjogbm9uZTtcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xuICBwYWRkaW5nOiAwLjVyZW07XG4gIGZvbnQtc2l6ZTogMC44NzVyZW07XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjJzO1xuICB3aWR0aDogMTAwJTtcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xufVxuLnVwbG9hZC1maWxlLWJ1dHRvbjpob3ZlciB7XG4gIGJhY2tncm91bmQtY29sb3I6ICNjYzRlMDI7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cbi51cGxvYWQtZmlsZS1idXR0b246ZGlzYWJsZWQge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjYjhiOGI4O1xuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xufVxuXG4uZmlsZS1wcmV2aWV3IHtcbiAgbWF4LXdpZHRoOiAxMDAlO1xuICBtYXgtaGVpZ2h0OiA4cmVtO1xufVxuYXVkaW8uZmlsZS1wcmV2aWV3IHtcbiAgbWluLWhlaWdodDogNHJlbTtcbn1cblxuLmZpbGUtcHJldmlldy10ZXh0IHtcbiAgZm9udC1zaXplOiAwLjg3NXJlbTtcbiAgY29sb3I6ICMzMzM7XG4gIG1hcmdpbi1ib3R0b206IDAuNXJlbTtcbn1cblxuLmZpbGUtbmFtZSB7XG4gIGZvbnQtc2l6ZTogMC44NzVyZW07XG4gIGNvbG9yOiAjMzMzO1xuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgbWluLWhlaWdodDogZml0LWNvbnRlbnQ7XG4gIG1heC13aWR0aDogMTAwJTtcbn1cblxuLnVwbG9hZC1idXR0b25zIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZ2FwOiAwLjI1cmVtO1xuICB3aWR0aDogMTAwJTtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xufVxuXG4udXBsb2FkLWJ1dHRvbnMgLnVwbG9hZC1maWxlLWJ1dHRvbiB7XG4gIGZsZXgtZ3JvdzogMTtcbn1cblxuLnVwbG9hZC1idXR0b25zIC5yZW1vdmUtZmlsZS1idXR0b24ge1xuICBmbGV4LWdyb3c6IDA7XG59XG5cbi5hY2NlcHRlZC10eXBlcyB7XG4gIGZvbnQtc2l6ZTogMC44NzVyZW07XG4gIGNvbG9yOiAjNzc3O1xuICBtYXJnaW4tdG9wOiAwLjVyZW07XG4gIGZvbnQtc3R5bGU6IGl0YWxpYztcbn1cblxuLmxvYWRpbmctYmFyLWNvbnRhaW5lciB7XG4gIHdpZHRoOiAxMDAlO1xuICBtaW4taGVpZ2h0OiA4cHg7XG4gIGJhY2tncm91bmQtY29sb3I6ICNlMGUwZTA7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIG1hcmdpbi10b3A6IDhweDtcbn1cblxuLmxvYWRpbmctYmFyIHtcbiAgbWluLWhlaWdodDogMTAwJTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmNmYwMDtcbiAgdHJhbnNpdGlvbjogd2lkdGggMC4zcyBlYXNlO1xufVxuXG4uZGF0ZS1waWNrZXIge1xuICB3aWR0aDogMTAwJTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZ2FwOiA2cHg7XG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xufVxuXG4uZGF0ZS1waWNrZXIgaW5wdXQge1xuICBwYWRkaW5nOiA2cHggMTBweDtcbiAgZm9udC1zaXplOiAxNHB4O1xuICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG59XG5cbi5wZXJjZW50YWdlLXNsaWRlciB7XG4gIHdpZHRoOiAxMDAlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogcm93O1xuICBnYXA6IDhweDtcbiAgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2Vlbjtcbn1cblxuLnBlcmNlbnRhZ2Utc2xpZGVyIGlucHV0W3R5cGU9XCJyYW5nZVwiXSB7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4ucGVyY2VudGFnZS1zbGlkZXIgbGFiZWwge1xuICBtaW4td2lkdGg6IDUwcHg7XG59XG5cbi5mYW5jeS1pbnB1dC1jb250YWluZXIge1xuICBtaW4taGVpZ2h0OiAyLjVyZW07XG4gIHdpZHRoOiAxMDAlO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGdhcDogMDtcbiAgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNjY2M7XG4gIG92ZXJmbG93OiBoaWRkZW47XG59XG5cbi5mYW5jeS1pbnB1dC1jb250YWluZXIgdGV4dGFyZWEuZmFuY3ktaW5wdXQge1xuICByZXNpemU6IG5vbmU7XG4gIG1heC1oZWlnaHQ6IDEycmVtO1xuICB3aWR0aDogMTAwJTtcbiAgZm9udC1mYW1pbHk6IGluaGVyaXQ7XG4gIHBhZGRpbmc6IDEwcHg7XG4gIGJvcmRlcjogbm9uZTtcbiAgb3V0bGluZTogbm9uZTtcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gIGZvbnQtc2l6ZTogMXJlbTtcbiAgY29sb3I6ICMyMjI7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGxpbmUtaGVpZ2h0OiAxLjQ7XG4gIG92ZXJmbG93LXk6IGF1dG87XG59XG5cbi5mYW5jeS1pbnB1dCB7XG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xuICBwYWRkaW5nOiA2cHggMTBweDtcbiAgYm9yZGVyOiBub25lO1xuICBvdXRsaW5lOiBub25lO1xuICBmbGV4OiAxO1xuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbn1cblxuLmZhbmN5LWlucHV0LWxhYmVsIHtcbiAgZm9udC1zaXplOiAwLjhyZW07XG4gIGNvbG9yOiAjNzc3O1xuICBhbGlnbi1zZWxmOiBmbGV4LXN0YXJ0O1xuICBwYWRkaW5nOiAwIDAuMjVyZW07XG4gIC8qIHotaW5kZXg6IDI7ICovXG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICBmb250LWZhbWlseTogXCJHZWlzdCBNb25vXCIsIG1vbm9zcGFjZTtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbiAgbWFyZ2luLXRvcDogMC4yNXJlbTtcbn1cblxuLmlucHV0LWRpdmlkZXIge1xuICBtaW4td2lkdGg6IDFweDtcbiAgaGVpZ2h0OiAyNHB4O1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xuICBtYXJnaW46IDA7XG59XG5cbi5pbnB1dC1pY29uLWNvbnRhaW5lciB7XG4gIHBhZGRpbmc6IDZweCAxMHB4O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y4ZjlmYTtcbiAgbWluLXdpZHRoOiA0MHB4O1xufVxuXG4uaW5wdXQtaWNvbi1jb250YWluZXIgc3ZnIHtcbiAgd2lkdGg6IDE2cHg7XG4gIGhlaWdodDogMTZweDtcbn1cblxuLmR1cmF0aW9uLWlucHV0LWNvbnRhaW5lciB7XG4gIG1pbi1oZWlnaHQ6IDIuNXJlbTtcbiAgd2lkdGg6IDEwMCU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBzdHJldGNoO1xuICBnYXA6IDA7XG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xuICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xuICAvKiBib3JkZXItcmFkaXVzOiA0cHg7ICovXG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbi5kdXJhdGlvbi1pbnB1dCB7XG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xuICBwYWRkaW5nOiA2cHggMTBweDtcbiAgYm9yZGVyOiBub25lO1xuICBvdXRsaW5lOiBub25lO1xuICBmbGV4OiAxO1xuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgbWluLXdpZHRoOiAwO1xufVxuXG4uZHVyYXRpb24tdW5pdC1zZWxlY3Qge1xuICBmb250LWZhbWlseTogc2Fucy1zZXJpZjtcbiAgcGFkZGluZzogNnB4IDEwcHg7XG4gIGJvcmRlcjogbm9uZTtcbiAgb3V0bGluZTogbm9uZTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y4ZjlmYTtcbiAgYm9yZGVyLWxlZnQ6IDFweCBzb2xpZCAjY2NjO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGZsZXg6IDAgMCBhdXRvO1xuICB3aWR0aDogYXV0bztcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuLnByaWNlLWlucHV0LWNvbnRhaW5lcjpmb2N1cy13aXRoaW4ge1xuICBib3JkZXItY29sb3I6ICNmZjZmMDA7XG4gIGJveC1zaGFkb3c6IDAgMCAwIDFweCAjZmY2ZjAwO1xufVxuXG4uZHVyYXRpb24taW5wdXQtY29udGFpbmVyOmZvY3VzLXdpdGhpbiB7XG4gIGJvcmRlci1jb2xvcjogI2ZmNmYwMDtcbiAgYm94LXNoYWRvdzogMCAwIDAgMXB4ICNmZjZmMDA7XG59XG5cbi5wcmljZS1pbnB1dC1jb250YWluZXI6aG92ZXIsXG4uZHVyYXRpb24taW5wdXQtY29udGFpbmVyOmhvdmVyIHtcbiAgYm9yZGVyLWNvbG9yOiAjOTk5O1xufVxuXG4uZHVyYXRpb24tdW5pdC1zZWxlY3Q6aG92ZXIge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTllY2VmO1xufVxuXG4uZHVyYXRpb24tdW5pdC1zZWxlY3Q6Zm9jdXMge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZTllY2VmO1xufVxuXG4ucHJldmlldy1vcHRpb24tY29udGFpbmVyIHtcbiAgd2lkdGg6IDEwMCU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcbn1cblxuLmNoZWNrYm94LWxhYmVsIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAwLjVyZW07XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgZm9udC1zaXplOiAwLjg3NXJlbTtcbiAgY29sb3I6ICMzMzM7XG4gIHVzZXItc2VsZWN0OiBub25lO1xufVxuXG4uY2hlY2tib3gtaW5wdXQge1xuICB3aWR0aDogMS4xMjVyZW07XG4gIGhlaWdodDogMS4xMjVyZW07XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgYWNjZW50LWNvbG9yOiAjZmY2ZjAwO1xufVxuXG4uY2hlY2tib3gtbGFiZWwgc3BhbiB7XG4gIGxpbmUtaGVpZ2h0OiAxLjI7XG59XG5cbi5wcmV2aWV3LWltYWdlLXNlY3Rpb24ge1xuICB3aWR0aDogMTAwJTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZ2FwOiAwLjVyZW07XG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcbn1cblxuLnByZXZpZXctaW1hZ2UtY29udHJvbHMge1xuICB3aWR0aDogMTAwJTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgZ2FwOiAwLjVyZW07XG59XG5cbi5zZWxlY3QtcHJldmlldy1idXR0b24ge1xuICB3aWR0aDogMTAwJTtcbiAgcGFkZGluZzogMC43NXJlbTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y4ZjlmYTtcbiAgYm9yZGVyOiAxcHggc29saWQgI2NjYztcbiAgY29sb3I6ICMzMzM7XG4gIGZvbnQtc2l6ZTogMC44NzVyZW07XG4gIGZvbnQtZmFtaWx5OiBcIkdlaXN0IE1vbm9cIiwgbW9ub3NwYWNlO1xuICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHRyYW5zaXRpb246IGFsbCAwLjJzO1xufVxuXG4uc2VsZWN0LXByZXZpZXctYnV0dG9uOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2U5ZWNlZjtcbiAgYm9yZGVyLWNvbG9yOiAjOTk5O1xufVxuXG4uc2VsZWN0LXByZXZpZXctYnV0dG9uOmRpc2FibGVkIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2U5ZWNlZjtcbiAgY29sb3I6ICM5OTk7XG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gIG9wYWNpdHk6IDAuNjtcbn1cblxuLnByZXZpZXctaW1hZ2UtcHJldmlldyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMC43NXJlbTtcbiAgcGFkZGluZzogMC43NXJlbTtcbiAgYmFja2dyb3VuZC1jb2xvcjogI2Y4ZjlmYTtcbiAgYm9yZGVyOiAxcHggc29saWQgI2NjYztcbn1cblxuLnByZXZpZXctdGh1bWJuYWlsIHtcbiAgd2lkdGg6IDNyZW07XG4gIGhlaWdodDogM3JlbTtcbiAgb2JqZWN0LWZpdDogY292ZXI7XG4gIGZsZXgtc2hyaW5rOiAwO1xufVxuXG4ucHJldmlldy1maWxlbmFtZSB7XG4gIGZsZXg6IDE7XG4gIGZvbnQtc2l6ZTogMC44NzVyZW07XG4gIGNvbG9yOiAjMzMzO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbn1cblxuLnJlbW92ZS1wcmV2aWV3LWJ1dHRvbiB7XG4gIHBhZGRpbmc6IDAuNXJlbTtcbiAgYmFja2dyb3VuZC1jb2xvcjogdHJhbnNwYXJlbnQ7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNmZjZmMDA7XG4gIGNvbG9yOiAjZmY2ZjAwO1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIHRyYW5zaXRpb246IGFsbCAwLjJzO1xuICBmbGV4LXNocmluazogMDtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi5yZW1vdmUtcHJldmlldy1idXR0b246aG92ZXI6bm90KDpkaXNhYmxlZCkge1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2M0ZTAyO1xuICBib3JkZXItY29sb3I6ICNjYzRlMDI7XG4gIGNvbG9yOiB3aGl0ZTtcbn1cblxuLnJlbW92ZS1wcmV2aWV3LWJ1dHRvbjpkaXNhYmxlZCB7XG4gIGJvcmRlci1jb2xvcjogI2NjYztcbiAgY29sb3I6ICNjY2M7XG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gIG9wYWNpdHk6IDAuNjtcbn1cblxuLnBlcmNlbnRhZ2UtaWNvbiB7XG4gIGZvbnQtc2l6ZTogMC44NzVyZW07XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIGNvbG9yOiAjNTU1O1xufVxuIl19 */";
var buttonStyles = {"button":"buttons-module_button__4Ogad","connect-button":"buttons-module_connect-button__CJhUa","button-icon":"buttons-module_button-icon__JM4-2","provider-button":"buttons-module_provider-button__6JY7s","provider-icon":"buttons-module_provider-icon__MOhr8","provider-name":"buttons-module_provider-name__tHWO2","provider-label":"buttons-module_provider-label__CEGRr","link-button-default":"buttons-module_link-button-default__EcKUT","twitter":"buttons-module_twitter__9sRaz","spotify":"buttons-module_spotify__-fiKQ","discord":"buttons-module_discord__I-YjZ","tiktok":"buttons-module_tiktok__a80-0","telegram":"buttons-module_telegram__ExOTS","button-container":"buttons-module_button-container__-oPqd","social-icon":"buttons-module_social-icon__DPdPe","link-icon":"buttons-module_link-icon__8V8FP","camp-logo":"buttons-module_camp-logo__slNl0","link-button-icon":"buttons-module_link-button-icon__llX8m","icon-container":"buttons-module_icon-container__Q5bI1","not-linked":"buttons-module_not-linked__ua4va","file-upload-container":"buttons-module_file-upload-container__le7Cg","dragging":"buttons-module_dragging__cfggZ","file-preview":"buttons-module_file-preview__yuM5i","file-selected":"buttons-module_file-selected__YY6ms","file-input":"buttons-module_file-input__gbD5T","selected-file-container":"buttons-module_selected-file-container__E1AXM","remove-file-button":"buttons-module_remove-file-button__Q1FMa","upload-file-button":"buttons-module_upload-file-button__vTwWd","file-preview-text":"buttons-module_file-preview-text__80Ju0","file-name":"buttons-module_file-name__3iskR","upload-buttons":"buttons-module_upload-buttons__3SAw6","accepted-types":"buttons-module_accepted-types__Ys-D2","loading-bar-container":"buttons-module_loading-bar-container__nrgPX","loading-bar":"buttons-module_loading-bar__IUAg1","date-picker":"buttons-module_date-picker__V6gRM","percentage-slider":"buttons-module_percentage-slider__M84tC","fancy-input-container":"buttons-module_fancy-input-container__s-zVw","fancy-input":"buttons-module_fancy-input__RpSOF","fancy-input-label":"buttons-module_fancy-input-label__d-sG7","input-divider":"buttons-module_input-divider__RVasJ","input-icon-container":"buttons-module_input-icon-container__MUYKL","duration-input-container":"buttons-module_duration-input-container__Rh9Na","duration-input":"buttons-module_duration-input__-gt3p","duration-unit-select":"buttons-module_duration-unit-select__VKFf6","price-input-container":"buttons-module_price-input-container__teIRS","preview-option-container":"buttons-module_preview-option-container__0bzt-","checkbox-label":"buttons-module_checkbox-label__ODwgG","checkbox-input":"buttons-module_checkbox-input__FvUIp","preview-image-section":"buttons-module_preview-image-section__BjtiC","preview-image-controls":"buttons-module_preview-image-controls__l6gv5","select-preview-button":"buttons-module_select-preview-button__0HQfm","preview-image-preview":"buttons-module_preview-image-preview__c-6n5","preview-thumbnail":"buttons-module_preview-thumbnail__fJWXt","preview-filename":"buttons-module_preview-filename__FW-Gz","remove-preview-button":"buttons-module_remove-preview-button__Skqgb","percentage-icon":"buttons-module_percentage-icon__MxmJh"};
styleInject(css_248z);

/**
 * The injected CampButton component.
 * @param { { onClick: function, authenticated: boolean } } props The props.
 * @returns { JSX.Element } The CampButton component.
 */
const CampButton = ({ onClick, authenticated, disabled, }) => {
    return (React.createElement("button", { className: buttonStyles["connect-button"], onClick: onClick, disabled: disabled },
        React.createElement(SquareCorners, null),
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
        React.createElement(SquareCorners, { color: "#ddd" }),
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
        React.createElement(SquareCorners, { color: "#ddd" }),
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
        React.createElement(SquareCorners, { color: "#ffffffaa" }),
        React.createElement(Icon, null),
        React.createElement("div", { className: `${buttonStyles["camp-logo"]} ${!isLinked ? buttonStyles["not-linked"] : ""}` },
            React.createElement(CampIcon, null)))) : (React.createElement("div", { className: buttonStyles["button-container"] },
        React.createElement(SquareCorners, { color: "#ffffffaa" }),
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
const LoadingBar = ({ progress, style }) => {
    return (React.createElement("div", { className: buttonStyles["loading-bar-container"], style: style },
        React.createElement("div", { className: buttonStyles["loading-bar"], style: { width: `${progress}%` } })));
};
const FancyInput = ({ value, onChange, step, placeholder, type = "text", icon, label, }) => {
    return (React.createElement(React.Fragment, null,
        label && (React.createElement("span", { className: buttonStyles["fancy-input-label"] }, label)),
        React.createElement("div", { className: buttonStyles["fancy-input-container"], style: type === "textarea" ? { minHeight: "5rem" } : {} },
            type === "textarea" ? (React.createElement("textarea", { value: value, onChange: onChange, placeholder: placeholder, className: buttonStyles["fancy-input"], rows: 3 })) : (React.createElement("input", { type: type, value: value, step: step, min: 0, onChange: onChange, placeholder: placeholder, className: buttonStyles["fancy-input"] })),
            icon && (React.createElement(React.Fragment, null,
                React.createElement("div", { className: buttonStyles["input-divider"] }),
                React.createElement("div", { className: buttonStyles["input-icon-container"] }, icon))))));
};
/**
 * The FileUpload component.
 * Provides a file upload field with drag-and-drop support.
 * @param { { onFileUpload?: function, accept?: string, maxFileSize?: number } } props The props.
 * @returns { JSX.Element } The FileUpload component.
 */
const FileUpload = ({ onFileUpload, accept, maxFileSize, }) => {
    const auth = useAuth();
    const [isDragging, setIsDragging] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);
    const previewImageInputRef = useRef(null);
    const { addToast } = useToast();
    const [price, setPrice] = useState("");
    const [royaltyBps, setRoyaltyBps] = useState("2.5"); // in percentage
    const [licenseDuration, setLicenseDuration] = useState(24);
    const [durationUnit, setDurationUnit] = useState("hours");
    const [isValidInput, setIsValidInput] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [useBaseAssetAsPreview, setUseBaseAssetAsPreview] = useState(false);
    const isAllImagesAccepted = accept
        ? accept.split(",").every((type) => type.trim().startsWith("image/"))
        : false;
    const validateInputs = () => {
        const isDurationValid = validateDuration(licenseDuration, durationUnit);
        let isPriceValid = validatePrice(price);
        const isRoyaltyValid = validateRoyaltyBps(royaltyBps);
        setIsValidInput(isDurationValid && isPriceValid && isRoyaltyValid);
    };
    useEffect(() => {
        validateInputs();
    }, [price, licenseDuration, durationUnit, royaltyBps]);
    useEffect(() => {
        // use base asset as preview is checked, clear custom preview image
        if (useBaseAssetAsPreview) {
            setPreviewImage(null);
            if (previewImageInputRef.current) {
                previewImageInputRef.current.value = "";
            }
        }
    }, [useBaseAssetAsPreview]);
    const handleUpload = () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (selectedFile) {
            setIsUploading(true);
            try {
                const durationInSeconds = toSeconds(licenseDuration, durationUnit);
                const priceInWei = parseEther(price || "0");
                const computedRoyaltyBps = Math.floor(parseFloat(royaltyBps) * 100); // percentage to basis points
                const license = createLicenseTerms(priceInWei, durationInSeconds, computedRoyaltyBps, zeroAddress);
                const metadata = {
                    name: selectedFile.name,
                    description: `File uploaded by ${auth === null || auth === void 0 ? void 0 : auth.walletAddress} via the Origin SDK`,
                };
                const res = yield ((_a = auth === null || auth === void 0 ? void 0 : auth.origin) === null || _a === void 0 ? void 0 : _a.mintFile(selectedFile, metadata, license, [], {
                    progressCallback(percent) {
                        setUploadProgress(percent);
                    },
                    previewImage: previewImage,
                    useAssetAsPreview: useBaseAssetAsPreview,
                }));
                if (onFileUpload) {
                    onFileUpload([selectedFile]);
                }
                addToast(`File minted successfully. Token ID: ${res}`, "success", 5000);
            }
            catch (error) {
                if (error.toString().includes("User rejected")) {
                    addToast("User rejected the transaction", "error", 5000);
                }
                else {
                    addToast(`Error minting file: ${error.message}`, "error", 5000);
                }
                setIsUploading(false);
            }
            finally {
                setSelectedFile(null);
                setIsUploading(false);
                setUploadProgress(0);
            }
        }
    });
    useEffect(() => {
        return () => {
            if (selectedFile && selectedFile.type.startsWith("image/")) {
                URL.revokeObjectURL(URL.createObjectURL(selectedFile));
            }
        };
    }, [selectedFile]);
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
        setPreviewImage(null);
        if (previewImageInputRef.current) {
            previewImageInputRef.current.value = "";
        }
        setUseBaseAssetAsPreview(false);
    };
    const handlePreviewImageChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const file = files[0];
            if (!file.type.startsWith("image/")) {
                addToast("Preview must be an image file", "error", 5000);
                return;
            }
            if (maxFileSize && file.size > maxFileSize) {
                addToast(`File size exceeds the limit of ${(maxFileSize /
                    1024 /
                    1024).toPrecision(2)} MB`, "error", 5000);
                return;
            }
            setPreviewImage(file);
        }
    };
    const handleRemovePreviewImage = () => {
        setPreviewImage(null);
        if (previewImageInputRef.current) {
            previewImageInputRef.current.value = "";
        }
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
            React.createElement(FancyInput, { type: "number", step: 0.0001, placeholder: "$CAMP", value: price, label: "Price in $CAMP", onChange: (e) => {
                    const value = e.target.value;
                    setPrice(value);
                }, icon: React.createElement(CampIcon, null) }),
            React.createElement("span", { className: buttonStyles["fancy-input-label"] }, "License Duration"),
            React.createElement("div", { className: buttonStyles["duration-input-container"] },
                React.createElement("input", { type: "number", placeholder: "Duration", className: buttonStyles["duration-input"], value: licenseDuration > 0 ? licenseDuration.toString() : "", onChange: (e) => {
                        const value = e.target.value;
                        setLicenseDuration(value ? Number(value) : 0);
                    } }),
                React.createElement("select", { className: buttonStyles["duration-unit-select"], value: durationUnit, onChange: (e) => {
                        setDurationUnit(e.target.value);
                    } },
                    React.createElement("option", { value: "hours" }, "Hours"),
                    React.createElement("option", { value: "days" }, "Days"),
                    React.createElement("option", { value: "weeks" }, "Weeks"))),
            React.createElement(FancyInput, { type: "number", step: 0.1, placeholder: "Royalty %", label: "Royalty %", value: royaltyBps.toString(), onChange: (e) => {
                    const value = e.target.value;
                    setRoyaltyBps(value);
                }, icon: React.createElement("span", { className: buttonStyles["percentage-icon"] }, "%") }),
            isAllImagesAccepted && (selectedFile === null || selectedFile === void 0 ? void 0 : selectedFile.type.startsWith("image/")) && (React.createElement("div", { className: buttonStyles["preview-option-container"] },
                React.createElement("label", { className: buttonStyles["checkbox-label"] },
                    React.createElement("input", { type: "checkbox", checked: useBaseAssetAsPreview, onChange: (e) => setUseBaseAssetAsPreview(e.target.checked), className: buttonStyles["checkbox-input"] }),
                    React.createElement("span", null, "Use base asset as preview")))),
            React.createElement("div", { className: buttonStyles["preview-image-section"] },
                React.createElement("span", { className: buttonStyles["fancy-input-label"] }, "Preview Image (optional)"),
                React.createElement("input", { type: "file", accept: "image/*", ref: previewImageInputRef, onChange: handlePreviewImageChange, disabled: useBaseAssetAsPreview, className: buttonStyles["file-input"], style: { display: "none" } }),
                React.createElement("div", { className: buttonStyles["preview-image-controls"] }, previewImage ? (React.createElement("div", { className: buttonStyles["preview-image-preview"] },
                    React.createElement("img", { src: URL.createObjectURL(previewImage), alt: "Preview", className: buttonStyles["preview-thumbnail"] }),
                    React.createElement("span", { className: buttonStyles["preview-filename"] }, previewImage.name),
                    React.createElement("button", { type: "button", className: buttonStyles["remove-preview-button"], onClick: handleRemovePreviewImage, disabled: useBaseAssetAsPreview },
                        React.createElement(BinIcon, { w: "1rem", h: "1rem" })))) : (React.createElement("button", { type: "button", className: buttonStyles["select-preview-button"], onClick: () => { var _a; return (_a = previewImageInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }, disabled: useBaseAssetAsPreview }, "Select Preview Image")))),
            isUploading && (React.createElement(LoadingBar, { progress: uploadProgress, style: { marginTop: "16px" } })),
            React.createElement("div", { className: buttonStyles["upload-buttons"] },
                React.createElement("button", { className: buttonStyles["remove-file-button"], disabled: isUploading, onClick: handleRemoveFile },
                    React.createElement(BinIcon, { w: "1.25rem", h: "1.25rem" })),
                React.createElement(Button, { onClick: handleUpload, disabled: !selectedFile || isUploading || !isValidInput }, "Mint")))) : (React.createElement("p", null,
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
const Button = ({ children, onClick, disabled, className, style, }) => {
    return (React.createElement("button", { className: `${buttonStyles["button"]} ${className}`, onClick: onClick, disabled: disabled, style: style },
        React.createElement(CornerSquare, { position: "top-left", padding: 4 }),
        React.createElement(CornerSquare, { position: "top-right", padding: 4 }),
        React.createElement(CornerSquare, { position: "bottom-left", padding: 4 }),
        React.createElement(CornerSquare, { position: "bottom-right", padding: 4 }),
        children));
};

/**
 * The Auth modal component.
 * @param { { setIsVisible: function, wcProvider: object, loading: boolean, onlyWagmi: boolean, defaultProvider: object } } props The props.
 * @returns { JSX.Element } The Auth modal component.
 */
const AuthModal = ({ setIsVisible, wcProvider, loading, onlyWagmi, defaultProvider, }) => {
    const { connect } = useConnect();
    const { setProvider } = useProvider();
    const { auth, wagmiAvailable, environment } = useContext(CampContext);
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
    const { addToast: toast } = useToast();
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
    const handleConnect = (provider) => __awaiter(void 0, void 0, void 0, function* () {
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
        try {
            yield connect();
        }
        catch (error) {
            console.error("Error during connect:", error);
            toast("Error connecting wallet. Please try again.", "error", 5000);
        }
    });
    return (React.createElement("div", { className: styles["outer-container"] },
        React.createElement("div", { className: `${styles.container} ${styles["linking-container"]}` },
            React.createElement(ArrowCorners, { padding: 8, color: "#AAA" }),
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
                        }, label: formatAddress(customAccount.address, 6), handleConnect: handleConnect, loading: loading }),
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
            React.createElement("div", { className: styles["footer-container"] },
                React.createElement("a", { href: "https://campnetwork.xyz", className: styles["footer-text"], target: "_blank", rel: "noopener noreferrer" }, "Powered by Camp Network")))));
};
/**
 * The CampModal component.
 * @param { { injectButton?: boolean, wcProjectId?: string, onlyWagmi?: boolean, defaultProvider?: object } } props The props.
 * @returns { JSX.Element } The CampModal component.
 */
const CampModal = ({ injectButton = true, wcProjectId, onlyWagmi = false, defaultProvider, }) => {
    // const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const { auth, environment } = useContext(CampContext);
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
        ? useWalletConnectProvider(wcProjectId, environment.CHAIN)
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
        // handles recovering the provider if it was passed as a defaultProvider or if WalletConnect was used
        // the core module handles the other cases (injected providers) automatically
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
                    else if (walletConnectProvider &&
                        walletConnectProvider.accounts.length) {
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
    }, [
        authenticated,
        defaultProvider,
        defaultProvider === null || defaultProvider === void 0 ? void 0 : defaultProvider.provider,
        auth,
        walletConnectProvider,
    ]);
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
    const { addToast: toast } = useToast();
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
                toast("Error unlinking TikTok account", "error", 5000);
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
                toast(error.message ? error.message : "Error linking TikTok account", "error", 5000);
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
        React.createElement(Button
        // className={styles["linking-button"]}
        , { 
            // className={styles["linking-button"]}
            onClick: handleLink, disabled: IsLoading }, !IsLoading ? (currentlyLinking && socials[currentlyLinking] ? ("Unlink") : ("Link")) : (React.createElement("div", { className: styles.spinner })))));
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
        React.createElement(Button
        // className={styles["linking-button"]}
        , { 
            // className={styles["linking-button"]}
            onClick: handleAction, disabled: IsLoading ||
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
        React.createElement(Button
        // className={styles["linking-button"]}
        , { 
            // className={styles["linking-button"]}
            onClick: handleLink, disabled: isUnlinking }, !isUnlinking ? (currentlyLinking && socials[currentlyLinking] ? ("Unlink") : ("Link")) : (React.createElement("div", { className: styles.spinner })))));
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
                React.createElement(ArrowCorners, { padding: 8, color: "#AAA" }),
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
                React.createElement("div", { className: styles["footer-container"] },
                    React.createElement("a", { href: "https://campnetwork.xyz", className: styles["footer-text"], target: "_blank", rel: "noopener noreferrer", style: { marginTop: 0 } }, "Powered by Camp Network"))))));
};
/**
 * The OriginSection component. Displays the Origin status, royalty multiplier, and royalty credits.
 * @returns { JSX.Element } The OriginSection component.
 */
const OriginSection = () => {
    const { environment } = useContext(CampContext);
    return (React.createElement("div", { className: styles["origin-wrapper"] },
        React.createElement("div", { className: styles["origin-section"] },
            React.createElement(Tooltip, { content: environment.NAME === "PRODUCTION"
                    ? "You are connected to Camp Mainnet"
                    : "You are connected to Camp Testnet", position: "top", containerStyle: { width: "100%" } },
                React.createElement("div", { className: styles["origin-container"] },
                    React.createElement("span", null, environment.NAME === "PRODUCTION" ? "Mainnet" : "Testnet"),
                    React.createElement("span", { className: styles["origin-label"] }, "Chain"))),
            React.createElement("div", { className: styles["divider"] }),
            React.createElement(Tooltip, { content: environment.DATANFT_CONTRACT_ADDRESS, position: "top", containerStyle: { width: "100%" } },
                React.createElement("div", { className: styles["origin-container"] },
                    React.createElement("span", null, formatAddress(environment.DATANFT_CONTRACT_ADDRESS, 4)),
                    React.createElement("span", { className: styles["origin-label"] }, "IP NFT"))),
            React.createElement("div", { className: styles["divider"] }),
            React.createElement(Tooltip, { content: environment.MARKETPLACE_CONTRACT_ADDRESS, position: "top", containerStyle: { width: "100%" } },
                React.createElement("div", { className: styles["origin-container"] },
                    React.createElement("span", null, formatAddress(environment.MARKETPLACE_CONTRACT_ADDRESS, 4)),
                    React.createElement("span", { className: styles["origin-label"] }, "Marketplace"))))));
};
/**
 * The MyCampModal component.
 * @param { { wcProvider: object } } props The props.
 * @returns { JSX.Element } The MyCampModal component.
 */
const MyCampModal = ({ wcProvider, }) => {
    const { auth, environment } = useContext(CampContext);
    const { setIsVisible: setIsVisible } = useContext(ModalContext);
    const { disconnect } = useConnect();
    const { socials, isLoading, refetch } = useSocials();
    const [isLoadingSocials, setIsLoadingSocials] = useState(true);
    const { linkTiktok, linkTelegram } = useLinkModal();
    const [activeTab, setActiveTab] = useState("socials");
    const { addToast: toast } = useToast();
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
            React.createElement(ArrowCorners, { padding: 8, color: "#AAA" }),
            React.createElement("div", { className: styles["close-button"], onClick: () => setIsVisible(false) },
                React.createElement(CloseIcon, null)),
            React.createElement("div", { className: styles.header },
                React.createElement(CampIcon, { customStyles: { marginRight: "0.5rem" } }),
                React.createElement("span", { className: styles["wallet-address"], onClick: () => __awaiter(void 0, void 0, void 0, function* () {
                        try {
                            yield navigator.clipboard.writeText(auth.walletAddress);
                            toast("Address copied to clipboard", "success", 3000);
                        }
                        catch (error) {
                            toast("Failed to copy address", "error", 3000);
                        }
                    }) },
                    formatAddress(auth.walletAddress, 6),
                    React.createElement(CopyIcon, { w: 16, h: 16 }))),
            React.createElement("div", { className: styles["vertical-tabs-container"] },
                React.createElement("div", { className: styles["vertical-tabs"] },
                    React.createElement(TabButton, { label: "Origin", isActive: activeTab === "origin", onClick: () => setActiveTab("origin") }),
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
                    activeTab === "text" && React.createElement(TextTab, null),
                    React.createElement(ArrowCorners, { padding: 8, color: "#DDD" }))),
            !provider.provider && (React.createElement("button", { className: styles["no-provider-warning"], onClick: () => auth.recoverProvider(), style: { cursor: "pointer" }, type: "button" },
                "Click to try reconnecting your wallet. ",
                React.createElement("br", null),
                "If this doesn't work, please disconnect and connect again.")),
            React.createElement(Button, { onClick: handleDisconnect }, "Disconnect"),
            React.createElement("div", { className: styles["footer-container"] },
                React.createElement("a", { href: "https://campnetwork.xyz", className: styles["footer-text"], target: "_blank", rel: "noopener noreferrer", style: { marginTop: 0 } }, "Powered by Camp Network")))));
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
    return (React.createElement(TabContent, { requiresProvider: true, className: styles["ip-tab-container"] },
        React.createElement(FileUpload, { accept: constants.SUPPORTED_IMAGE_FORMATS.join(","), maxFileSize: 1.049e7 })));
};
const AudioTab = () => {
    return (React.createElement(TabContent, { requiresProvider: true, className: styles["ip-tab-container"] },
        React.createElement(FileUpload, { accept: constants.SUPPORTED_AUDIO_FORMATS.join(","), maxFileSize: 1.573e7 })));
};
const VideosTab = () => {
    return (React.createElement(TabContent, { requiresProvider: true, className: styles["ip-tab-container"] },
        React.createElement(FileUpload, { accept: constants.SUPPORTED_VIDEO_FORMATS.join(","), maxFileSize: 2.097e7 })));
};
const TextTab = () => {
    return (React.createElement(TabContent, { requiresProvider: true, className: styles["ip-tab-container"] },
        React.createElement(FileUpload, { accept: constants.SUPPORTED_TEXT_FORMATS.join(","), maxFileSize: 1.049e7 })));
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

export { StandaloneCampButton as CampButton, CampContext, CampModal, CampProvider, LinkButton, ModalContext, MyCampModal, useAuth, useAuthState, useConnect, useLinkModal, useLinkSocials, useModal, useProvider, useProviders, useSocials, useViem };
