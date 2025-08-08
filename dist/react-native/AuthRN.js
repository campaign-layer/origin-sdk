import { _ as __awaiter, a as __classPrivateFieldGet, b as __classPrivateFieldSet } from './tslib.es6.js';
import { createSiweMessage } from 'viem/siwe';
import { createPublicClient, http, erc20Abi, getAbiItem, encodeFunctionData, zeroAddress, checksumAddress } from 'viem';
import '../errors';
import 'viem/accounts';
import { Storage } from './storage.js';

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

export { AuthRN as A, constants as c };
