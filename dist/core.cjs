"use strict";var e=require("viem"),t=require("viem/accounts"),n=require("viem/siwe"),i=require("axios");
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
function a(e,t,n,i){return new(n||(n=Promise))((function(a,s){function r(e){try{d(i.next(e))}catch(e){s(e)}}function o(e){try{d(i.throw(e))}catch(e){s(e)}}function d(e){var t;e.done?a(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(r,o)}d((i=i.apply(e,t||[])).next())}))}function s(e,t,n,i){if("a"===n&&!i)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!i:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===n?i:"a"===n?i.call(e):i?i.value:t.get(e)}function r(e,t,n,i,a){if("m"===i)throw new TypeError("Private method is not writable");if("a"===i&&!a)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!a:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===i?a.call(e,n):a?a.value=n:t.set(e,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * Adapter for viem WalletClient
 */
class o{constructor(e){this.type="viem",this.signer=e}getAddress(){return a(this,void 0,void 0,(function*(){if(this.signer.account)return this.signer.account.address;const e=yield this.signer.request({method:"eth_requestAccounts",params:[]});if(!e||0===e.length)throw new Error("No accounts found in viem wallet client");return e[0]}))}signMessage(e){return a(this,void 0,void 0,(function*(){const t=yield this.getAddress();return yield this.signer.signMessage({account:t,message:e})}))}signTypedData(e,t,n){return a(this,void 0,void 0,(function*(){throw new Error("Viem WalletClient does not support signTypedData")}))}getChainId(){return a(this,void 0,void 0,(function*(){var e;return(null===(e=this.signer.chain)||void 0===e?void 0:e.id)||1}))}}
/**
 * Adapter for ethers Signer (v5 and v6)
 */class d{constructor(e){this.type="ethers",this.signer=e}getAddress(){return a(this,void 0,void 0,(function*(){
// Works for both ethers v5 and v6
if("function"==typeof this.signer.getAddress)return yield this.signer.getAddress();if(this.signer.address)return this.signer.address;throw new Error("Unable to get address from ethers signer")}))}signMessage(e){return a(this,void 0,void 0,(function*(){if("function"!=typeof this.signer.signMessage)throw new Error("Signer does not support signMessage");return yield this.signer.signMessage(e)}))}signTypedData(e,t,n){return a(this,void 0,void 0,(function*(){if("function"==typeof this.signer._signTypedData)return yield this.signer._signTypedData(e,t,n);if("function"!=typeof this.signer.signTypedData)throw new Error("Signer does not support signTypedData or _signTypedData");return yield this.signer.signTypedData(e,t,n)}))}getChainId(){return a(this,void 0,void 0,(function*(){
// Try ethers v6 first
if(this.signer.provider&&"function"==typeof this.signer.provider.getNetwork){const e=yield this.signer.provider.getNetwork();
// ethers v6 returns bigint, v5 returns number
return"bigint"==typeof e.chainId?Number(e.chainId):e.chainId}
// Fallback for ethers v5
return"function"==typeof this.signer.getChainId?yield this.signer.getChainId():484;
// Default to mainnet if we can't determine
}))}}
/**
 * Adapter for custom signer implementations
 */class u{constructor(e){this.type="custom",this.signer=e}getAddress(){return a(this,void 0,void 0,(function*(){if("function"==typeof this.signer.getAddress)return yield this.signer.getAddress();if(this.signer.address)return this.signer.address;throw new Error("Custom signer must implement getAddress() or have address property")}))}signMessage(e){return a(this,void 0,void 0,(function*(){if("function"!=typeof this.signer.signMessage)throw new Error("Custom signer must implement signMessage()");return yield this.signer.signMessage(e)}))}signTypedData(e,t,n){return a(this,void 0,void 0,(function*(){if("function"!=typeof this.signer.signTypedData)throw new Error("Custom signer must implement signTypedData()");return yield this.signer.signTypedData(e,t,n)}))}getChainId(){return a(this,void 0,void 0,(function*(){if("function"==typeof this.signer.getChainId){const e=yield this.signer.getChainId();return"bigint"==typeof e?Number(e):e}return void 0!==this.signer.chainId?"bigint"==typeof this.signer.chainId?Number(this.signer.chainId):this.signer.chainId:484;
// Default to mainnet
}))}}
/**
 * Factory function to create appropriate adapter based on signer type
 */function p(e){
// Check for viem WalletClient
return e.transport&&e.chain&&"function"==typeof e.signMessage?new o(e):
// Check for ethers signer (v5 or v6)
e._isSigner||e.provider&&"function"==typeof e.signMessage?new d(e):new u(e)}
/**
 * Browser localStorage adapter
 */class l{getItem(e){return a(this,void 0,void 0,(function*(){return"undefined"==typeof localStorage?null:localStorage.getItem(e)}))}setItem(e,t){return a(this,void 0,void 0,(function*(){"undefined"!=typeof localStorage&&localStorage.setItem(e,t)}))}removeItem(e){return a(this,void 0,void 0,(function*(){"undefined"!=typeof localStorage&&localStorage.removeItem(e)}))}}
/**
 * In-memory storage adapter for Node.js
 */class y{constructor(){this.storage=new Map}getItem(e){return a(this,void 0,void 0,(function*(){return this.storage.get(e)||null}))}setItem(e,t){return a(this,void 0,void 0,(function*(){this.storage.set(e,t)}))}removeItem(e){return a(this,void 0,void 0,(function*(){this.storage.delete(e)}))}clear(){this.storage.clear()}}
/**
 * Create a wallet client for Node.js environment
 * @param account The viem account
 * @param chain The chain to use
 * @param rpcUrl Optional RPC URL (defaults to chain's default RPC)
 * @returns WalletClient
 */const c={id:123420001114,name:"Basecamp",nativeCurrency:{decimals:18,name:"Camp",symbol:"CAMP"},rpcUrls:{default:{http:["https://rpc-campnetwork.xyz","https://rpc.basecamp.t.raas.gelato.cloud"]}},blockExplorers:{default:{name:"Explorer",url:"https://basecamp.cloud.blockscout.com/"}}},m={id:484,name:"Camp Network",nativeCurrency:{decimals:18,name:"Camp",symbol:"CAMP"},rpcUrls:{default:{http:["https://rpc.camp.raas.gelato.cloud/"]}},blockExplorers:{default:{name:"Explorer",url:"https://camp.cloud.blockscout.com/"}}};class h extends Error{constructor(e,t){super(e),this.name="APIError",this.statusCode=t||500,Error.captureStackTrace(this,this.constructor)}toJSON(){return{error:this.name,message:this.message,statusCode:this.statusCode||500}}}
// @ts-ignore
let T=null,v=null,f=null;const A=t=>{var n;const i=f||c;return v&&(null===(n=v.chain)||void 0===n?void 0:n.id)===i.id||(v=e.createPublicClient({chain:i,transport:e.http()})),v};var w=[{type:"function",name:"UPGRADE_INTERFACE_VERSION",inputs:[],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"approve",inputs:[{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"balanceOf",inputs:[{name:"owner",type:"address",internalType:"address"}],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"dataStatus",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"uint8",internalType:"enum IIpNFT.DataStatus"}],stateMutability:"view"},{type:"function",name:"disputeModule",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"erc6551Account",inputs:[],outputs:[{name:"",type:"address",internalType:"contract IERC6551Account"}],stateMutability:"view"},{type:"function",name:"erc6551Registry",inputs:[],outputs:[{name:"",type:"address",internalType:"contract IERC6551Registry"}],stateMutability:"view"},{type:"function",name:"finalizeDelete",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"getAccount",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"account",type:"address",internalType:"address"}],stateMutability:"nonpayable"},{type:"function",name:"getApproved",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"getTerms",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"tuple",internalType:"struct IIpNFT.LicenseTerms",components:[{name:"price",type:"uint128",internalType:"uint128"},{name:"duration",type:"uint32",internalType:"uint32"},{name:"royaltyBps",type:"uint16",internalType:"uint16"},{name:"paymentToken",type:"address",internalType:"address"}]}],stateMutability:"view"},{type:"function",name:"initialize",inputs:[{name:"name_",type:"string",internalType:"string"},{name:"symbol_",type:"string",internalType:"string"},{name:"maxTermDuration_",type:"uint256",internalType:"uint256"},{name:"signer_",type:"address",internalType:"address"},{name:"wCAMP_",type:"address",internalType:"address"},{name:"minTermDuration_",type:"uint256",internalType:"uint256"},{name:"minPrice_",type:"uint256",internalType:"uint256"},{name:"maxRoyaltyBps_",type:"uint256",internalType:"uint256"},{name:"registry_",type:"address",internalType:"contract IERC6551Registry"},{name:"implementation_",type:"address",internalType:"contract IERC6551Account"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"isApprovedForAll",inputs:[{name:"owner",type:"address",internalType:"address"},{name:"operator",type:"address",internalType:"address"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"markDisputed",inputs:[{name:"_tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"marketPlace",inputs:[],outputs:[{name:"",type:"address",internalType:"contract IMarketplace"}],stateMutability:"view"},{type:"function",name:"maxRoyaltyBps",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"maxTermDuration",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"minPrice",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"minTermDuration",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"mintWithSignature",inputs:[{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"creatorContentHash",type:"bytes32",internalType:"bytes32"},{name:"uri",type:"string",internalType:"string"},{name:"licenseTerms",type:"tuple",internalType:"struct IIpNFT.LicenseTerms",components:[{name:"price",type:"uint128",internalType:"uint128"},{name:"duration",type:"uint32",internalType:"uint32"},{name:"royaltyBps",type:"uint16",internalType:"uint16"},{name:"paymentToken",type:"address",internalType:"address"}]},{name:"deadline",type:"uint256",internalType:"uint256"},{name:"parents",type:"uint256[]",internalType:"uint256[]"},{name:"isIP",type:"bool",internalType:"bool"},{name:"signature",type:"bytes",internalType:"bytes"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"name",inputs:[],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"owner",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"ownerOf",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"pause",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"paused",inputs:[],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"proxiableUUID",inputs:[],outputs:[{name:"",type:"bytes32",internalType:"bytes32"}],stateMutability:"view"},{type:"function",name:"renounceOwnership",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"safeTransferFrom",inputs:[{name:"from",type:"address",internalType:"address"},{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"safeTransferFrom",inputs:[{name:"from",type:"address",internalType:"address"},{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"data",type:"bytes",internalType:"bytes"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"setApprovalForAll",inputs:[{name:"operator",type:"address",internalType:"address"},{name:"approved",type:"bool",internalType:"bool"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"setDisputeModule",inputs:[{name:"_disputeModule",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"setMarketPlace",inputs:[{name:"_marketPlace",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"setSigner",inputs:[{name:"_signer",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"signer",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"supportsInterface",inputs:[{name:"interfaceId",type:"bytes4",internalType:"bytes4"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"symbol",inputs:[],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"tokenInfo",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"tuple",internalType:"struct IIpNFT.TokenInfo",components:[{name:"tokenURI",type:"string",internalType:"string"},{name:"isIP",type:"bool",internalType:"bool"},{name:"contentHash",type:"bytes32",internalType:"bytes32"},{name:"terms",type:"tuple",internalType:"struct IIpNFT.LicenseTerms",components:[{name:"price",type:"uint128",internalType:"uint128"},{name:"duration",type:"uint32",internalType:"uint32"},{name:"royaltyBps",type:"uint16",internalType:"uint16"},{name:"paymentToken",type:"address",internalType:"address"}]},{name:"status",type:"uint8",internalType:"enum IIpNFT.DataStatus"}]}],stateMutability:"view"},{type:"function",name:"tokenURI",inputs:[{name:"_tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"transferFrom",inputs:[{name:"from",type:"address",internalType:"address"},{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"transferOwnership",inputs:[{name:"newOwner",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"unpause",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"updateTerms",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"newTerms",type:"tuple",internalType:"struct IIpNFT.LicenseTerms",components:[{name:"price",type:"uint128",internalType:"uint128"},{name:"duration",type:"uint32",internalType:"uint32"},{name:"royaltyBps",type:"uint16",internalType:"uint16"},{name:"paymentToken",type:"address",internalType:"address"}]}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"upgradeToAndCall",inputs:[{name:"newImplementation",type:"address",internalType:"address"},{name:"data",type:"bytes",internalType:"bytes"}],outputs:[],stateMutability:"payable"},{type:"function",name:"wCAMP",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"event",name:"AccessPurchased",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"buyer",type:"address",indexed:!0,internalType:"address"},{name:"periods",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newExpiry",type:"uint256",indexed:!1,internalType:"uint256"},{name:"amountPaid",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"AgentRegistered",inputs:[{name:"agentId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"ipNftId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"agentAddress",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"Approval",inputs:[{name:"owner",type:"address",indexed:!0,internalType:"address"},{name:"approved",type:"address",indexed:!0,internalType:"address"},{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"}],anonymous:!1},{type:"event",name:"ApprovalForAll",inputs:[{name:"owner",type:"address",indexed:!0,internalType:"address"},{name:"operator",type:"address",indexed:!0,internalType:"address"},{name:"approved",type:"bool",indexed:!1,internalType:"bool"}],anonymous:!1},{type:"event",name:"ChildIpTagged",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"childIp",type:"uint256",indexed:!0,internalType:"uint256"},{name:"parentIp",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"DataDeleted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"DataMinted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"},{name:"contentHash",type:"bytes32",indexed:!1,internalType:"bytes32"},{name:"parents",type:"uint256[]",indexed:!1,internalType:"uint256[]"}],anonymous:!1},{type:"event",name:"DisputeAssertion",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"counterEvidenceHash",type:"bytes32",indexed:!1,internalType:"bytes32"}],anonymous:!1},{type:"event",name:"DisputeCancelled",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"}],anonymous:!1},{type:"event",name:"DisputeJudged",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"judgement",type:"bool",indexed:!1,internalType:"bool"}],anonymous:!1},{type:"event",name:"DisputeModuleUpdated",inputs:[{name:"disputeModule",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"DisputeRaised",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"initiator",type:"address",indexed:!0,internalType:"address"},{name:"targetId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"disputeTag",type:"bytes32",indexed:!1,internalType:"bytes32"}],anonymous:!1},{type:"event",name:"Initialized",inputs:[{name:"version",type:"uint64",indexed:!1,internalType:"uint64"}],anonymous:!1},{type:"event",name:"MarketPlaceUpdated",inputs:[{name:"marketPlace",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"OwnershipTransferred",inputs:[{name:"previousOwner",type:"address",indexed:!0,internalType:"address"},{name:"newOwner",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"Paused",inputs:[{name:"account",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"RoyaltyPaid",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"royaltyAmount",type:"uint256",indexed:!1,internalType:"uint256"},{name:"creator",type:"address",indexed:!1,internalType:"address"},{name:"protocolAmount",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"SignerUpdated",inputs:[{name:"signer",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"StatusUpdated",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"status",type:"uint8",indexed:!1,internalType:"enum IIpNFT.DataStatus"}],anonymous:!1},{type:"event",name:"TermsUpdated",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"newPrice",type:"uint128",indexed:!1,internalType:"uint128"},{name:"newDuration",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newRoyaltyBps",type:"uint16",indexed:!1,internalType:"uint16"},{name:"paymentToken",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"Transfer",inputs:[{name:"from",type:"address",indexed:!0,internalType:"address"},{name:"to",type:"address",indexed:!0,internalType:"address"},{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"}],anonymous:!1},{type:"event",name:"Unpaused",inputs:[{name:"account",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"Upgraded",inputs:[{name:"implementation",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"error",name:"AddressEmptyCode",inputs:[{name:"target",type:"address",internalType:"address"}]},{type:"error",name:"ERC1967InvalidImplementation",inputs:[{name:"implementation",type:"address",internalType:"address"}]},{type:"error",name:"ERC1967NonPayable",inputs:[]},{type:"error",name:"ERC721IncorrectOwner",inputs:[{name:"sender",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"owner",type:"address",internalType:"address"}]},{type:"error",name:"ERC721InsufficientApproval",inputs:[{name:"operator",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"}]},{type:"error",name:"ERC721InvalidApprover",inputs:[{name:"approver",type:"address",internalType:"address"}]},{type:"error",name:"ERC721InvalidOperator",inputs:[{name:"operator",type:"address",internalType:"address"}]},{type:"error",name:"ERC721InvalidOwner",inputs:[{name:"owner",type:"address",internalType:"address"}]},{type:"error",name:"ERC721InvalidReceiver",inputs:[{name:"receiver",type:"address",internalType:"address"}]},{type:"error",name:"ERC721InvalidSender",inputs:[{name:"sender",type:"address",internalType:"address"}]},{type:"error",name:"ERC721NonexistentToken",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}]},{type:"error",name:"EnforcedPause",inputs:[]},{type:"error",name:"ExpectedPause",inputs:[]},{type:"error",name:"FailedCall",inputs:[]},{type:"error",name:"InvalidDeadline",inputs:[]},{type:"error",name:"InvalidDuration",inputs:[]},{type:"error",name:"InvalidInitialization",inputs:[]},{type:"error",name:"InvalidPaymentToken",inputs:[]},{type:"error",name:"InvalidPrice",inputs:[]},{type:"error",name:"InvalidRoyalty",inputs:[]},{type:"error",name:"InvalidSignature",inputs:[]},{type:"error",name:"NotInitializing",inputs:[]},{type:"error",name:"NotTokenOwner",inputs:[]},{type:"error",name:"OwnableInvalidOwner",inputs:[{name:"owner",type:"address",internalType:"address"}]},{type:"error",name:"OwnableUnauthorizedAccount",inputs:[{name:"account",type:"address",internalType:"address"}]},{type:"error",name:"TokenAlreadyExists",inputs:[]},{type:"error",name:"UUPSUnauthorizedCallContext",inputs:[]},{type:"error",name:"UUPSUnsupportedProxiableUUID",inputs:[{name:"slot",type:"bytes32",internalType:"bytes32"}]},{type:"error",name:"Unauthorized",inputs:[]}],I=[{type:"function",name:"MAX_PARENTS",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"UPGRADE_INTERFACE_VERSION",inputs:[],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"buyAccess",inputs:[{name:"buyer",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"expectedPrice",type:"uint256",internalType:"uint256"},{name:"expectedDuration",type:"uint32",internalType:"uint32"},{name:"expectedPaymentToken",type:"address",internalType:"address"}],outputs:[],stateMutability:"payable"},{type:"function",name:"hasParentIp",inputs:[{name:"ipId",type:"uint256",internalType:"uint256"},{name:"parent",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"initialize",inputs:[{name:"dataNFT_",type:"address",internalType:"address"},{name:"protocolFeeBps_",type:"uint16",internalType:"uint16"},{name:"treasury_",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"ipToken",inputs:[],outputs:[{name:"",type:"address",internalType:"contract IIpNFT"}],stateMutability:"view"},{type:"function",name:"owner",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"parentRoyaltyPercent",inputs:[{name:"",type:"uint256",internalType:"uint256"},{name:"",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"uint16",internalType:"uint16"}],stateMutability:"view"},{type:"function",name:"pause",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"paused",inputs:[],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"protocolFeeBps",inputs:[],outputs:[{name:"",type:"uint16",internalType:"uint16"}],stateMutability:"view"},{type:"function",name:"proxiableUUID",inputs:[],outputs:[{name:"",type:"bytes32",internalType:"bytes32"}],stateMutability:"view"},{type:"function",name:"renounceOwnership",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"royaltyStack",inputs:[{name:"",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"uint16",internalType:"uint16"}],stateMutability:"view"},{type:"function",name:"setParentIpsAndRoyaltyPercents",inputs:[{name:"childIpId",type:"uint256",internalType:"uint256"},{name:"parents",type:"uint256[]",internalType:"uint256[]"},{name:"creator",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"subscriptionExpiry",inputs:[{name:"",type:"uint256",internalType:"uint256"},{name:"",type:"address",internalType:"address"}],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"transferOwnership",inputs:[{name:"newOwner",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"treasury",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"unpause",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"updateProtocolFee",inputs:[{name:"newFeeBps",type:"uint16",internalType:"uint16"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"updateTreasury",inputs:[{name:"newTreasury",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"upgradeToAndCall",inputs:[{name:"newImplementation",type:"address",internalType:"address"},{name:"data",type:"bytes",internalType:"bytes"}],outputs:[],stateMutability:"payable"},{type:"event",name:"AccessPurchased",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"buyer",type:"address",indexed:!0,internalType:"address"},{name:"periods",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newExpiry",type:"uint256",indexed:!1,internalType:"uint256"},{name:"amountPaid",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"AgentRegistered",inputs:[{name:"agentId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"ipNftId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"agentAddress",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"ChildIpTagged",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"childIp",type:"uint256",indexed:!0,internalType:"uint256"},{name:"parentIp",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"DataDeleted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"DataMinted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"},{name:"contentHash",type:"bytes32",indexed:!1,internalType:"bytes32"},{name:"parents",type:"uint256[]",indexed:!1,internalType:"uint256[]"}],anonymous:!1},{type:"event",name:"DisputeAssertion",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"counterEvidenceHash",type:"bytes32",indexed:!1,internalType:"bytes32"}],anonymous:!1},{type:"event",name:"DisputeCancelled",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"}],anonymous:!1},{type:"event",name:"DisputeJudged",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"judgement",type:"bool",indexed:!1,internalType:"bool"}],anonymous:!1},{type:"event",name:"DisputeModuleUpdated",inputs:[{name:"disputeModule",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"DisputeRaised",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"initiator",type:"address",indexed:!0,internalType:"address"},{name:"targetId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"disputeTag",type:"bytes32",indexed:!1,internalType:"bytes32"}],anonymous:!1},{type:"event",name:"Initialized",inputs:[{name:"version",type:"uint64",indexed:!1,internalType:"uint64"}],anonymous:!1},{type:"event",name:"MarketPlaceUpdated",inputs:[{name:"marketPlace",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"OwnershipTransferred",inputs:[{name:"previousOwner",type:"address",indexed:!0,internalType:"address"},{name:"newOwner",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"Paused",inputs:[{name:"account",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"RoyaltyPaid",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"royaltyAmount",type:"uint256",indexed:!1,internalType:"uint256"},{name:"creator",type:"address",indexed:!1,internalType:"address"},{name:"protocolAmount",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"SignerUpdated",inputs:[{name:"signer",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"StatusUpdated",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"status",type:"uint8",indexed:!1,internalType:"enum IIpNFT.DataStatus"}],anonymous:!1},{type:"event",name:"TermsUpdated",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"newPrice",type:"uint128",indexed:!1,internalType:"uint128"},{name:"newDuration",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newRoyaltyBps",type:"uint16",indexed:!1,internalType:"uint16"},{name:"paymentToken",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"Unpaused",inputs:[{name:"account",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"Upgraded",inputs:[{name:"implementation",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"error",name:"AddressEmptyCode",inputs:[{name:"target",type:"address",internalType:"address"}]},{type:"error",name:"ERC1967InvalidImplementation",inputs:[{name:"implementation",type:"address",internalType:"address"}]},{type:"error",name:"ERC1967NonPayable",inputs:[]},{type:"error",name:"EnforcedPause",inputs:[]},{type:"error",name:"ExpectedPause",inputs:[]},{type:"error",name:"FailedCall",inputs:[]},{type:"error",name:"InvalidInitialization",inputs:[]},{type:"error",name:"InvalidParentIp",inputs:[]},{type:"error",name:"InvalidPayment",inputs:[]},{type:"error",name:"InvalidRoyalty",inputs:[]},{type:"error",name:"MaxParentsExceeded",inputs:[]},{type:"error",name:"MaxRoyaltyExceeded",inputs:[]},{type:"error",name:"NoSubscriptionFound",inputs:[]},{type:"error",name:"NotInitializing",inputs:[]},{type:"error",name:"OwnableInvalidOwner",inputs:[{name:"owner",type:"address",internalType:"address"}]},{type:"error",name:"OwnableUnauthorizedAccount",inputs:[{name:"account",type:"address",internalType:"address"}]},{type:"error",name:"ParentAlreadyExists",inputs:[]},{type:"error",name:"ParentIpAlreadyDeleted",inputs:[]},{type:"error",name:"ParentIpAlreadyDisputed",inputs:[]},{type:"error",name:"SubscriptionNotAllowed",inputs:[]},{type:"error",name:"TermsMismatch",inputs:[]},{type:"error",name:"UUPSUnauthorizedCallContext",inputs:[]},{type:"error",name:"UUPSUnsupportedProxiableUUID",inputs:[{name:"slot",type:"bytes32",internalType:"bytes32"}]},{type:"error",name:"Unauthorized",inputs:[]},{type:"error",name:"ZeroAddress",inputs:[]}],g=[{type:"receive",stateMutability:"payable"},{type:"function",name:"execute",inputs:[{name:"to",type:"address",internalType:"address"},{name:"value",type:"uint256",internalType:"uint256"},{name:"data",type:"bytes",internalType:"bytes"},{name:"operation",type:"uint8",internalType:"uint8"}],outputs:[{name:"result",type:"bytes",internalType:"bytes"}],stateMutability:"payable"},{type:"function",name:"isValidSignature",inputs:[{name:"hash",type:"bytes32",internalType:"bytes32"},{name:"signature",type:"bytes",internalType:"bytes"}],outputs:[{name:"magicValue",type:"bytes4",internalType:"bytes4"}],stateMutability:"view"},{type:"function",name:"isValidSigner",inputs:[{name:"signer",type:"address",internalType:"address"},{name:"",type:"bytes",internalType:"bytes"}],outputs:[{name:"",type:"bytes4",internalType:"bytes4"}],stateMutability:"view"},{type:"function",name:"owner",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"state",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"supportsInterface",inputs:[{name:"interfaceId",type:"bytes4",internalType:"bytes4"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"token",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"},{name:"",type:"address",internalType:"address"},{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"}],b=[{inputs:[{internalType:"address",name:"_marketplace",type:"address"},{internalType:"address",name:"_ipNFT",type:"address"}],stateMutability:"nonpayable",type:"constructor"},{inputs:[],name:"EmptyPurchaseList",type:"error"},{inputs:[],name:"InvalidTotalPayment",type:"error"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"string",name:"reason",type:"string"}],name:"PurchaseFailed",type:"error"},{inputs:[],name:"RefundFailed",type:"error"},{inputs:[],name:"ZeroAddress",type:"error"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"buyer",type:"address"},{indexed:!1,internalType:"uint256",name:"count",type:"uint256"},{indexed:!1,internalType:"uint256",name:"totalPaid",type:"uint256"}],name:"BulkPurchaseExecuted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"buyer",type:"address"},{indexed:!1,internalType:"uint256",name:"successCount",type:"uint256"},{indexed:!1,internalType:"uint256",name:"failureCount",type:"uint256"},{indexed:!1,internalType:"uint256[]",name:"failedTokenIds",type:"uint256[]"}],name:"BulkPurchasePartial",type:"event"},{inputs:[{internalType:"address",name:"buyer",type:"address"},{components:[{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint256",name:"expectedPrice",type:"uint256"},{internalType:"uint32",name:"expectedDuration",type:"uint32"},{internalType:"address",name:"expectedPaymentToken",type:"address"}],internalType:"struct IBatchPurchase.BuyParams[]",name:"purchases",type:"tuple[]"}],name:"bulkBuyAccess",outputs:[{internalType:"uint256",name:"totalPaid",type:"uint256"}],stateMutability:"payable",type:"function"},{inputs:[{internalType:"address",name:"buyer",type:"address"},{components:[{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint256",name:"expectedPrice",type:"uint256"},{internalType:"uint32",name:"expectedDuration",type:"uint32"},{internalType:"address",name:"expectedPaymentToken",type:"address"}],internalType:"struct IBatchPurchase.BuyParams[]",name:"purchases",type:"tuple[]"}],name:"bulkBuyAccessTolerant",outputs:[{components:[{internalType:"uint256",name:"successCount",type:"uint256"},{internalType:"uint256",name:"failureCount",type:"uint256"},{internalType:"uint256",name:"totalSpent",type:"uint256"},{internalType:"uint256",name:"refundAmount",type:"uint256"},{internalType:"uint256[]",name:"failedTokenIds",type:"uint256[]"}],internalType:"struct IBatchPurchase.TolerantResult",name:"result",type:"tuple"}],stateMutability:"payable",type:"function"},{inputs:[{internalType:"uint256[]",name:"tokenIds",type:"uint256[]"}],name:"buildPurchaseParams",outputs:[{components:[{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint256",name:"expectedPrice",type:"uint256"},{internalType:"uint32",name:"expectedDuration",type:"uint32"},{internalType:"address",name:"expectedPaymentToken",type:"address"}],internalType:"struct IBatchPurchase.BuyParams[]",name:"purchases",type:"tuple[]"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256[]",name:"tokenIds",type:"uint256[]"}],name:"checkActiveStatus",outputs:[{internalType:"bool[]",name:"activeFlags",type:"bool[]"}],stateMutability:"view",type:"function"},{inputs:[],name:"ipNFT",outputs:[{internalType:"contract IIpNFT",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"marketplace",outputs:[{internalType:"contract IMarketplace",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256[]",name:"tokenIds",type:"uint256[]"}],name:"previewBulkCost",outputs:[{components:[{internalType:"uint256",name:"totalNativeCost",type:"uint256"},{internalType:"uint256",name:"totalERC20Cost",type:"uint256"},{internalType:"uint256",name:"validCount",type:"uint256"},{internalType:"uint256[]",name:"invalidTokenIds",type:"uint256[]"}],internalType:"struct IBatchPurchase.BulkCostPreview",name:"preview",type:"tuple"}],stateMutability:"view",type:"function"}],C=[{type:"constructor",inputs:[],stateMutability:"nonpayable"},{type:"function",name:"UPGRADE_INTERFACE_VERSION",inputs:[],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"cancelDispute",inputs:[{name:"id",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"disputeAssertion",inputs:[{name:"id",type:"uint256",internalType:"uint256"},{name:"_counterEvidenceHash",type:"bytes32",internalType:"bytes32"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"disputeBond",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"disputeCoolDownPeriod",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"disputeCounter",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"disputeJudgementPeriod",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"disputeQuorum",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"disputeToken",inputs:[],outputs:[{name:"",type:"address",internalType:"contract IERC20"}],stateMutability:"view"},{type:"function",name:"disputes",inputs:[{name:"",type:"uint256",internalType:"uint256"}],outputs:[{name:"initiator",type:"address",internalType:"address"},{name:"targetId",type:"uint256",internalType:"uint256"},{name:"disputeTag",type:"bytes32",internalType:"bytes32"},{name:"disputeEvidenceHash",type:"bytes32",internalType:"bytes32"},{name:"counterEvidenceHash",type:"bytes32",internalType:"bytes32"},{name:"disputeTimestamp",type:"uint256",internalType:"uint256"},{name:"assertionTimestamp",type:"uint256",internalType:"uint256"},{name:"yesVotes",type:"uint256",internalType:"uint256"},{name:"noVotes",type:"uint256",internalType:"uint256"},{name:"status",type:"uint8",internalType:"enum DisputeModule.DisputeStatus"},{name:"bondAmount",type:"uint256",internalType:"uint256"},{name:"protocolFeeAmount",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"hasVoted",inputs:[{name:"",type:"uint256",internalType:"uint256"},{name:"",type:"address",internalType:"address"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"initialize",inputs:[{name:"_ipToken",type:"address",internalType:"contract IIpNFT"},{name:"_marketplace",type:"address",internalType:"contract IMarketplace"},{name:"_disputeToken",type:"address",internalType:"contract IERC20"},{name:"_disputeBond",type:"uint256",internalType:"uint256"},{name:"_disputeCoolDownPeriod",type:"uint256",internalType:"uint256"},{name:"_disputeJudgementPeriod",type:"uint256",internalType:"uint256"},{name:"_bondFeeBPS",type:"uint16",internalType:"uint16"},{name:"_stakingThreshold",type:"uint256",internalType:"uint256"},{name:"_stakingVault",type:"address",internalType:"contract ICampStakingVault"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"ipToken",inputs:[],outputs:[{name:"",type:"address",internalType:"contract IIpNFT"}],stateMutability:"view"},{type:"function",name:"isUsedEvidenceHash",inputs:[{name:"",type:"bytes32",internalType:"bytes32"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"marketplace",inputs:[],outputs:[{name:"",type:"address",internalType:"contract IMarketplace"}],stateMutability:"view"},{type:"function",name:"owner",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"protocolDisputeFee",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"proxiableUUID",inputs:[],outputs:[{name:"",type:"bytes32",internalType:"bytes32"}],stateMutability:"view"},{type:"function",name:"raiseDispute",inputs:[{name:"_targetIpId",type:"uint256",internalType:"uint256"},{name:"_disputeEvidenceHash",type:"bytes32",internalType:"bytes32"},{name:"_disputeTag",type:"bytes32",internalType:"bytes32"}],outputs:[{name:"id",type:"uint256",internalType:"uint256"}],stateMutability:"nonpayable"},{type:"function",name:"renounceOwnership",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"resolveDispute",inputs:[{name:"id",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"setDisputeQuorum",inputs:[{name:"_disputeQuorum",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"stakingThreshold",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"stakingVault",inputs:[],outputs:[{name:"",type:"address",internalType:"contract ICampStakingVault"}],stateMutability:"view"},{type:"function",name:"tagChildIp",inputs:[{name:"_childIpId",type:"uint256",internalType:"uint256"},{name:"_infringerDisputeId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"transferOwnership",inputs:[{name:"newOwner",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"upgradeToAndCall",inputs:[{name:"newImplementation",type:"address",internalType:"address"},{name:"data",type:"bytes",internalType:"bytes"}],outputs:[],stateMutability:"payable"},{type:"function",name:"voteOnDispute",inputs:[{name:"id",type:"uint256",internalType:"uint256"},{name:"support",type:"bool",internalType:"bool"}],outputs:[],stateMutability:"nonpayable"},{type:"event",name:"AccessPurchased",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"buyer",type:"address",indexed:!0,internalType:"address"},{name:"periods",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newExpiry",type:"uint256",indexed:!1,internalType:"uint256"},{name:"amountPaid",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"AgentRegistered",inputs:[{name:"agentId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"ipNftId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"agentAddress",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"AppRegistryUpdated",inputs:[{name:"appRegistry",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"ChildIpTagged",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"childIp",type:"uint256",indexed:!0,internalType:"uint256"},{name:"parentIp",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"DataDeleted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"DataMinted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"},{name:"contentHash",type:"bytes32",indexed:!1,internalType:"bytes32"},{name:"parents",type:"uint256[]",indexed:!1,internalType:"uint256[]"}],anonymous:!1},{type:"event",name:"DisputeAssertion",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"counterEvidenceHash",type:"bytes32",indexed:!1,internalType:"bytes32"}],anonymous:!1},{type:"event",name:"DisputeCancelled",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"}],anonymous:!1},{type:"event",name:"DisputeJudged",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"judgement",type:"bool",indexed:!1,internalType:"bool"}],anonymous:!1},{type:"event",name:"DisputeModuleUpdated",inputs:[{name:"disputeModule",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"DisputeRaised",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"initiator",type:"address",indexed:!0,internalType:"address"},{name:"targetId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"disputeTag",type:"bytes32",indexed:!1,internalType:"bytes32"}],anonymous:!1},{type:"event",name:"Initialized",inputs:[{name:"version",type:"uint64",indexed:!1,internalType:"uint64"}],anonymous:!1},{type:"event",name:"MarketPlaceUpdated",inputs:[{name:"marketPlace",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"OwnershipTransferred",inputs:[{name:"previousOwner",type:"address",indexed:!0,internalType:"address"},{name:"newOwner",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"ParentIpsSet",inputs:[{name:"childIpId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"parentIds",type:"uint256[]",indexed:!1,internalType:"uint256[]"},{name:"totalRoyaltyBps",type:"uint16",indexed:!1,internalType:"uint16"}],anonymous:!1},{type:"event",name:"ProtocolFeeUpdated",inputs:[{name:"newFeeBps",type:"uint16",indexed:!1,internalType:"uint16"}],anonymous:!1},{type:"event",name:"RoyaltyPaid",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"royaltyAmount",type:"uint256",indexed:!1,internalType:"uint256"},{name:"creator",type:"address",indexed:!1,internalType:"address"},{name:"protocolAmount",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"SignerUpdated",inputs:[{name:"signer",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"StatusUpdated",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"status",type:"uint8",indexed:!1,internalType:"enum IIpNFT.DataStatus"}],anonymous:!1},{type:"event",name:"TermsUpdated",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"newPrice",type:"uint128",indexed:!1,internalType:"uint128"},{name:"newDuration",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newRoyaltyBps",type:"uint16",indexed:!1,internalType:"uint16"},{name:"paymentToken",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"TreasuryUpdated",inputs:[{name:"newTreasury",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"Upgraded",inputs:[{name:"implementation",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"Voted",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"voter",type:"address",indexed:!0,internalType:"address"},{name:"support",type:"bool",indexed:!1,internalType:"bool"},{name:"weight",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"error",name:"AddressEmptyCode",inputs:[{name:"target",type:"address",internalType:"address"}]},{type:"error",name:"AlreadyVoted",inputs:[]},{type:"error",name:"CoolDownPeriodActive",inputs:[]},{type:"error",name:"CoolDownPeriodOver",inputs:[]},{type:"error",name:"ERC1967InvalidImplementation",inputs:[{name:"implementation",type:"address",internalType:"address"}]},{type:"error",name:"ERC1967NonPayable",inputs:[]},{type:"error",name:"EvidenceAlreadyUsed",inputs:[]},{type:"error",name:"FailedCall",inputs:[]},{type:"error",name:"InvalidBondFeeBps",inputs:[]},{type:"error",name:"InvalidChildIpId",inputs:[]},{type:"error",name:"InvalidDisputeStatus",inputs:[]},{type:"error",name:"InvalidDisputeTag",inputs:[]},{type:"error",name:"InvalidEvidenceHash",inputs:[]},{type:"error",name:"InvalidInitialization",inputs:[]},{type:"error",name:"InvalidTargetIp",inputs:[]},{type:"error",name:"NoVotingPower",inputs:[]},{type:"error",name:"NotAParentIp",inputs:[]},{type:"error",name:"NotInitializing",inputs:[]},{type:"error",name:"NotInitiator",inputs:[]},{type:"error",name:"NotTokenOwner",inputs:[]},{type:"error",name:"OwnableInvalidOwner",inputs:[{name:"owner",type:"address",internalType:"address"}]},{type:"error",name:"OwnableUnauthorizedAccount",inputs:[{name:"account",type:"address",internalType:"address"}]},{type:"error",name:"ParentNotDisputed",inputs:[]},{type:"error",name:"SelfAssertionNotAllowed",inputs:[]},{type:"error",name:"StakedAfterDispute",inputs:[]},{type:"error",name:"TagNotAllowed",inputs:[]},{type:"error",name:"UUPSUnauthorizedCallContext",inputs:[]},{type:"error",name:"UUPSUnsupportedProxiableUUID",inputs:[{name:"slot",type:"bytes32",internalType:"bytes32"}]},{type:"error",name:"VotingPeriodActive",inputs:[]},{type:"error",name:"VotingPeriodOver",inputs:[]}],E=[{type:"constructor",inputs:[{name:"ipNFT_",type:"address",internalType:"contract IIpNFT"},{name:"exchangeRate_",type:"uint256",internalType:"uint256"}],stateMutability:"nonpayable"},{type:"function",name:"exchangeRate",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"fractionalize",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"getTokenForNFT",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"ipNFT",inputs:[],outputs:[{name:"",type:"address",internalType:"contract IIpNFT"}],stateMutability:"view"},{type:"function",name:"nftToToken",inputs:[{name:"",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"address",internalType:"contract FractionalToken"}],stateMutability:"view"},{type:"function",name:"onERC721Received",inputs:[{name:"",type:"address",internalType:"address"},{name:"",type:"address",internalType:"address"},{name:"",type:"uint256",internalType:"uint256"},{name:"",type:"bytes",internalType:"bytes"}],outputs:[{name:"",type:"bytes4",internalType:"bytes4"}],stateMutability:"pure"},{type:"function",name:"redeem",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"event",name:"Fractionalized",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"depositor",type:"address",indexed:!0,internalType:"address"},{name:"token",type:"address",indexed:!1,internalType:"address"},{name:"supply",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"Redeemed",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"redeemer",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"error",name:"AlreadyFractionalized",inputs:[]},{type:"error",name:"InsufficientFractionalTokens",inputs:[]},{type:"error",name:"InvalidExchangeRate",inputs:[]},{type:"error",name:"NotFractionalized",inputs:[]},{type:"error",name:"NotTokenOwner",inputs:[]},{type:"error",name:"ZeroAddress",inputs:[]}],S=[{type:"constructor",inputs:[],stateMutability:"nonpayable"},{type:"function",name:"UPGRADE_INTERFACE_VERSION",inputs:[],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"appExists",inputs:[{name:"",type:"string",internalType:"string"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"apps",inputs:[{name:"",type:"string",internalType:"string"}],outputs:[{name:"treasury",type:"address",internalType:"address"},{name:"revenueShareBps",type:"uint16",internalType:"uint16"},{name:"isActive",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"deactivateApp",inputs:[{name:"appId",type:"string",internalType:"string"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"getAppInfo",inputs:[{name:"appId",type:"string",internalType:"string"}],outputs:[{name:"",type:"tuple",internalType:"struct AppRegistry.AppInfo",components:[{name:"treasury",type:"address",internalType:"address"},{name:"revenueShareBps",type:"uint16",internalType:"uint16"},{name:"isActive",type:"bool",internalType:"bool"}]}],stateMutability:"view"},{type:"function",name:"initialize",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"owner",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"proxiableUUID",inputs:[],outputs:[{name:"",type:"bytes32",internalType:"bytes32"}],stateMutability:"view"},{type:"function",name:"reactivateApp",inputs:[{name:"appId",type:"string",internalType:"string"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"registerApp",inputs:[{name:"appId",type:"string",internalType:"string"},{name:"treasury",type:"address",internalType:"address"},{name:"revenueShareBps",type:"uint16",internalType:"uint16"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"renounceOwnership",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"transferOwnership",inputs:[{name:"newOwner",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"updateApp",inputs:[{name:"appId",type:"string",internalType:"string"},{name:"treasury",type:"address",internalType:"address"},{name:"revenueShareBps",type:"uint16",internalType:"uint16"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"upgradeToAndCall",inputs:[{name:"newImplementation",type:"address",internalType:"address"},{name:"data",type:"bytes",internalType:"bytes"}],outputs:[],stateMutability:"payable"},{type:"event",name:"AppDeactivated",inputs:[{name:"appId",type:"string",indexed:!0,internalType:"string"}],anonymous:!1},{type:"event",name:"AppReactivated",inputs:[{name:"appId",type:"string",indexed:!0,internalType:"string"}],anonymous:!1},{type:"event",name:"AppRegistered",inputs:[{name:"appId",type:"string",indexed:!0,internalType:"string"},{name:"treasury",type:"address",indexed:!1,internalType:"address"},{name:"revenueShareBps",type:"uint16",indexed:!1,internalType:"uint16"}],anonymous:!1},{type:"event",name:"AppUpdated",inputs:[{name:"appId",type:"string",indexed:!0,internalType:"string"},{name:"treasury",type:"address",indexed:!1,internalType:"address"},{name:"revenueShareBps",type:"uint16",indexed:!1,internalType:"uint16"}],anonymous:!1},{type:"event",name:"Initialized",inputs:[{name:"version",type:"uint64",indexed:!1,internalType:"uint64"}],anonymous:!1},{type:"event",name:"OwnershipTransferred",inputs:[{name:"previousOwner",type:"address",indexed:!0,internalType:"address"},{name:"newOwner",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"Upgraded",inputs:[{name:"implementation",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"error",name:"AddressEmptyCode",inputs:[{name:"target",type:"address",internalType:"address"}]},{type:"error",name:"AppAlreadyActive",inputs:[]},{type:"error",name:"AppAlreadyExists",inputs:[]},{type:"error",name:"AppAlreadyInactive",inputs:[]},{type:"error",name:"AppNotFound",inputs:[]},{type:"error",name:"ERC1967InvalidImplementation",inputs:[{name:"implementation",type:"address",internalType:"address"}]},{type:"error",name:"ERC1967NonPayable",inputs:[]},{type:"error",name:"FailedCall",inputs:[]},{type:"error",name:"InvalidAppId",inputs:[]},{type:"error",name:"InvalidInitialization",inputs:[]},{type:"error",name:"InvalidRoyalty",inputs:[]},{type:"error",name:"NotInitializing",inputs:[]},{type:"error",name:"OwnableInvalidOwner",inputs:[{name:"owner",type:"address",internalType:"address"}]},{type:"error",name:"OwnableUnauthorizedAccount",inputs:[{name:"account",type:"address",internalType:"address"}]},{type:"error",name:"UUPSUnauthorizedCallContext",inputs:[]},{type:"error",name:"UUPSUnsupportedProxiableUUID",inputs:[{name:"slot",type:"bytes32",internalType:"bytes32"}]},{type:"error",name:"ZeroAddress",inputs:[]}],_="Connect with Camp Network",D=2628e3,R=86400,P=1e15,N=1,x=1e4;const k={DEVELOPMENT:{NAME:"DEVELOPMENT",AUTH_HUB_BASE_API:"https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",AUTH_ENDPOINT:"auth-testnet",ORIGIN_DASHBOARD:"https://origin.campnetwork.xyz",DATANFT_CONTRACT_ADDRESS:"0xB53F5723Dd4E46da32e1769Bd36A5aD880e707A5",MARKETPLACE_CONTRACT_ADDRESS:"0x97b0A18B2888e904940fFd19E480a28aeec3F055",BATCH_PURCHASE_CONTRACT_ADDRESS:"0xaF0cF04DBfeeAcEdC77Dc68A91381AFB967B8518",
// TODO: Add actual contract addresses when deployed
DISPUTE_CONTRACT_ADDRESS:"",FRACTIONALIZER_CONTRACT_ADDRESS:"",APP_REGISTRY_CONTRACT_ADDRESS:"",CHAIN:c,IPNFT_ABI:w,MARKETPLACE_ABI:I,TBA_ABI:g,BATCH_PURCHASE_ABI:b,DISPUTE_ABI:C,FRACTIONALIZER_ABI:E,APP_REGISTRY_ABI:S},PRODUCTION:{NAME:"PRODUCTION",AUTH_HUB_BASE_API:"https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",AUTH_ENDPOINT:"auth-mainnet",ORIGIN_DASHBOARD:"https://origin.campnetwork.xyz",DATANFT_CONTRACT_ADDRESS:"0x39EeE1C3989f0dD543Dee60f8582F7F81F522C38",MARKETPLACE_CONTRACT_ADDRESS:"0xc69BAa987757d054455fC0f2d9797684E9FB8b9C",BATCH_PURCHASE_CONTRACT_ADDRESS:"0x31885cD2A445322067dF890bACf6CeFE9b233BCC",
// TODO: Add actual contract addresses when deployed
DISPUTE_CONTRACT_ADDRESS:"",FRACTIONALIZER_CONTRACT_ADDRESS:"",APP_REGISTRY_CONTRACT_ADDRESS:"",CHAIN:m,IPNFT_ABI:w,MARKETPLACE_ABI:I,TBA_ABI:g,BATCH_PURCHASE_ABI:b,DISPUTE_ABI:C,FRACTIONALIZER_ABI:E,APP_REGISTRY_ABI:S}};let M=[];const O=()=>M,B=e=>{function t(t){M.some((e=>e.info.uuid===t.detail.info.uuid))||(M=[...M,t.detail],e(M))}if("undefined"!=typeof window)return window.addEventListener("eip6963:announceProvider",t),window.dispatchEvent(new Event("eip6963:requestProvider")),()=>window.removeEventListener("eip6963:announceProvider",t)};
/**
 * Uploads a file to a specified URL with progress tracking.
 * Falls back to a simple fetch request if XMLHttpRequest is not available.
 * @param {File} file - The file to upload.
 * @param {string} url - The URL to upload the file to.
 * @param {UploadProgressCallback} onProgress - A callback function to track upload progress.
 * @returns {Promise<string>} - A promise that resolves with the response from the server.
 */
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
 * @param appId Optional app ID for the minting operation. Defaults to the SDK's appId (clientId).
 * @returns A promise that resolves when the minting is complete.
 */
function F(e,t,n,i,s,r,o,d,u,p){return a(this,void 0,void 0,(function*(){var a;
// use provided appId, or fall back to SDK's appId, or use empty string
const l=null!==(a=null!=p?p:this.appId)&&void 0!==a?a:"";return yield this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"mintWithSignature",[e,t,s,r,o,d,n,i,l,u],{waitForReceipt:!0})}))}
/**
 * Registers a Data NFT with the Origin service in order to obtain a signature for minting.
 * @param source The source of the Data NFT (e.g., "spotify", "twitter", "tiktok", or "file").
 * @param deadline The deadline for the registration operation.
 * @param licenseTerms The terms of the license for the NFT.
 * @param metadata The metadata associated with the NFT.
 * @param fileKey The file key(s) if the source is "file".
 * @param parents The IDs of the parent NFTs, if applicable.
 * @return A promise that resolves with the registration data.
 */function U(e,t,n,i,s,r){return a(this,void 0,void 0,(function*(){const a={source:e,deadline:Number(t),licenseTerms:{price:n.price.toString(),duration:n.duration,royaltyBps:n.royaltyBps,paymentToken:n.paymentToken,licenseType:n.licenseType},metadata:i,parentId:r?r.map((e=>e.toString())):[]};void 0!==s&&(a.fileKey=s);const o=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/register`,{method:"POST",headers:{Authorization:`Bearer ${this.getJwt()}`,"Content-Type":"application/json"},body:JSON.stringify(a)}),d=yield o.json();if(d.isError)throw new Error(`Failed to get signature: ${d.message}`);if(!o.ok)throw new Error(`Failed to get signature: ${o.statusText}`);return d.data}))}
/**
 * Updates the license terms of a specified IPNFT.
 * @param tokenId The ID of the IPNFT to update.
 * @param newTerms The new license terms to set.
 * @returns A promise that resolves when the transaction is complete.
 */function H(e,t){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"updateTerms",[e,t],{waitForReceipt:!0})}
/**
 * Sets the IPNFT as deleted
 * @param tokenId The token ID to set as deleted.
 * @returns A promise that resolves when the transaction is complete.
 */function j(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"finalizeDelete",[e])}
/**
 * Calls the getOrCreateRoyaltyVault method on the IPNFT contract.
 * @param tokenOwner The address of the token owner for whom to get or create the royalty vault.
 * @param simulateOnly If true, simulates the transaction without executing it.
 * @returns The address of the royalty vault associated with the specified token owner.
 */function $(e){return a(this,arguments,void 0,(function*(e,t=!1){const n=yield this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"getOrCreateRoyaltyVault",[e],{waitForReceipt:!0,simulate:t});return t?n:n.simulatedResult}))}
/**
 * Returns the license terms associated with a specific token ID.
 * @param tokenId The token ID to query.
 * @returns The license terms of the token ID.
 */function L(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"getTerms",[e])}
/**
 * Returns the owner of the specified IPNFT.
 * @param tokenId The ID of the IPNFT to query.
 * @returns The address of the owner of the IPNFT.
 */function z(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"ownerOf",[e])}
/**
 * Returns the number of IPNFTs owned by the given address.
 * @param owner The address to query.
 * @returns The number of IPNFTs owned by the address.
 */function q(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"balanceOf",[e])}
/**
 * Returns the metadata URI associated with a specific token ID.
 * @param tokenId The token ID to query.
 * @returns The metadata URI of the token ID.
 */function V(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"tokenURI",[e])}
/**
 * Returns the data status of the given token ID.
 * @param tokenId The token ID to query.
 * @returns The data status of the token ID.
 */function W(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"dataStatus",[e])}
/**
 * Checks if an operator is approved to manage all assets of a given owner.
 * @param owner The address of the asset owner.
 * @param operator The address of the operator to check.
 * @return A promise that resolves to a boolean indicating if the operator is approved for all assets of the owner.
 */function J(e,t){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"isApprovedForAll",[e,t])}function G(e,t,n){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"transferFrom",[e,t,n])}function Y(e,t,n,i){const a=i?[e,t,n,i]:[e,t,n];return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"safeTransferFrom",a)}function Z(e,t){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"approve",[e,t])}function K(e,t){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"setApprovalForAll",[e,t])}
/**
 * Buys access to a data NFT for a specified duration.
 * @param buyer The address of the buyer.
 * @param tokenId The ID of the data NFT.
 * @param expectedPrice The expected price for the access.
 * @param expectedDuration The expected duration of the access in seconds.
 * @param expectedPaymentToken The address of the payment token (use zero address for native token).
 * @param expectedProtocolFeeBps The expected protocol fee in basis points (0-10000). Defaults to 0.
 * @param expectedAppFeeBps The expected app fee in basis points (0-10000). Defaults to 0.
 * @param value The amount of native token to send (only required if paying with native token).
 * @returns A promise that resolves when the transaction is confirmed.
 */function X(e,t,n,i,a,s=0,r=0,o){return this.callContractMethod(this.environment.MARKETPLACE_CONTRACT_ADDRESS,this.environment.MARKETPLACE_ABI,"buyAccess",[e,t,n,i,a,s,r],{waitForReceipt:!0,value:o})}
/**
 * Checks if a user has access to a specific token based on subscription expiry.
 * @param user - The address of the user.
 * @param tokenId - The ID of the token.
 * @returns A promise that resolves to a boolean indicating if the user has access.
 */function Q(e,t){return a(this,void 0,void 0,(function*(){try{const n=yield this.subscriptionExpiry(t,e);return n>BigInt(Math.floor(Date.now()/1e3))}catch(e){return!1}}))}function ee(e,t){return this.callContractMethod(this.environment.MARKETPLACE_CONTRACT_ADDRESS,this.environment.MARKETPLACE_ABI,"subscriptionExpiry",[e,t])}
/**
 * Fetches the protocol fee from the marketplace contract.
 */function te(e){return a(this,void 0,void 0,(function*(){try{const t=yield e.callContractMethod(e.environment.MARKETPLACE_CONTRACT_ADDRESS,e.environment.MARKETPLACE_ABI,"protocolFeeBps",[]);return Number(t)}catch(e){return console.warn("Failed to fetch protocol fee, defaulting to 0:",e),0}}))}
/**
 * Fetches the app fee for a specific token from the AppRegistry.
 */function ne(e,t){return a(this,void 0,void 0,(function*(){try{const n=yield e.callContractMethod(e.environment.DATANFT_CONTRACT_ADDRESS,e.environment.IPNFT_ABI,"tokenInfo",[t]),i=null==n?void 0:n.appId;if(!i||""===i)return 0;if(!e.environment.APP_REGISTRY_CONTRACT_ADDRESS||!e.environment.APP_REGISTRY_ABI)return 0;const a=yield e.callContractMethod(e.environment.APP_REGISTRY_CONTRACT_ADDRESS,e.environment.APP_REGISTRY_ABI,"getAppInfo",[i]);return(null==a?void 0:a.isActive)?Number(a.revenueShareBps):0}catch(e){return console.warn("Failed to fetch app fee, defaulting to 0:",e),0}}))}
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
 */function ie(t,n){return a(this,void 0,void 0,(function*(){if(!t.marketplaceAction)throw new Error("No marketplace action found in X402 response");const{marketplaceAction:i}=t;if("buyAccess"!==i.method)throw new Error(`Unsupported marketplace action method: ${i.method}`);const a=BigInt(i.tokenId),s=i.payer;if(yield this.hasAccess(s,a))return console.log("User already has access to this item"),null;const r=BigInt(i.amount),o=BigInt(i.duration),d=i.asset,u="0x0000000000000000000000000000000000000000"===d,l=u?r:BigInt(0),[y,c]=yield Promise.all([te(this),ne(this,a)]);if(n){const t=p(n),i=this.environment.MARKETPLACE_CONTRACT_ADDRESS,u=this.environment.MARKETPLACE_ABI,m=e.encodeFunctionData({abi:u,functionName:"buyAccess",args:[s,a,r,o,d,y,c]});if("viem"===t.type){const e=t.signer,n=yield e.sendTransaction({to:i,data:m,value:l,account:yield t.getAddress()});return{txHash:n,receipt:yield e.waitForTransactionReceipt({hash:n})}}if("ethers"===t.type){const e=t.signer,n=yield e.sendTransaction({to:i,data:m,value:l.toString()}),a=yield n.wait();return{txHash:n.hash,receipt:a}}{const e=t.signer;if("function"!=typeof e.sendTransaction)throw new Error("Custom signer must implement sendTransaction() method");const n=yield e.sendTransaction({to:i,data:m,value:l.toString()});if(n.wait&&"function"==typeof n.wait){const e=yield n.wait();return{txHash:n.hash,receipt:e}}return{txHash:n.hash||n}}}if(!this.viemClient)throw new Error("No signer or wallet client provided for settleX402");return yield this.buyAccess(s,a,r,o,d,y,c,u?l:void 0)}))}
/**
 * Resolves a wallet address from an optional address parameter or connected wallet.
 * Checks viemClient.account first, then falls back to eth_requestAccounts.
 *
 * @param viemClient The viem WalletClient instance.
 * @param address Optional address to use directly.
 * @returns The resolved wallet address.
 * @throws Error if no address provided and no wallet connected or no accounts found.
 */function ae(e,t){return a(this,void 0,void 0,(function*(){if(t)return t;if(!e)throw new Error("No address provided and no wallet connected. Please provide an address or connect a wallet.");if(e.account)return e.account.address;const n=yield e.request({method:"eth_requestAccounts",params:[]});if(!n||0===n.length)throw new Error("No accounts found in connected wallet.");return n[0]}))}
/**
 * Enum representing the type of license for an IP NFT.
 * - DURATION_BASED: License expires after a set duration (subscription model).
 * - SINGLE_PAYMENT: One-time payment for perpetual access.
 * - X402: HTTP 402-based micropayment license (no on-chain payments).
 */var se,re,oe;exports.LicenseType=void 0,(se=exports.LicenseType||(exports.LicenseType={}))[se.DURATION_BASED=0]="DURATION_BASED",se[se.SINGLE_PAYMENT=1]="SINGLE_PAYMENT",se[se.X402=2]="X402",
/**
 * Enum representing the status of data in the system.
 * - ACTIVE: The data is currently active and available.
 * - DELETED: The data has been deleted and is no longer available.
 * - DISPUTED: The data has been disputed and marked as potentially infringing.
 */
exports.DataStatus=void 0,(re=exports.DataStatus||(exports.DataStatus={}))[re.ACTIVE=0]="ACTIVE",re[re.DELETED=1]="DELETED",re[re.DISPUTED=2]="DISPUTED",
/**
 * Enum representing the status of a dispute.
 * - Uninitialized: Dispute does not exist.
 * - Raised: Dispute has been raised but not yet asserted by IP owner.
 * - Asserted: IP owner has responded to the dispute.
 * - Resolved: Dispute has been resolved (either valid or invalid).
 * - Cancelled: Dispute was cancelled by the initiator.
 */
exports.DisputeStatus=void 0,(oe=exports.DisputeStatus||(exports.DisputeStatus={}))[oe.Uninitialized=0]="Uninitialized",oe[oe.Raised=1]="Raised",oe[oe.Asserted=2]="Asserted",oe[oe.Resolved=3]="Resolved",oe[oe.Cancelled=4]="Cancelled";
/**
 * Creates license terms for a digital asset.
 * @param price The price of the asset in wei.
 * @param duration The duration of the license in seconds (use 0 for SINGLE_PAYMENT and X402).
 * @param royaltyBps The royalty percentage in basis points (0-10000).
 * @param paymentToken The address of the payment token (ERC20 / address(0) for native currency).
 * @param licenseType The type of license (defaults to DURATION_BASED).
 * @returns The created license terms.
 */
const de={X402Intent:[{name:"payer",type:"address"},{name:"asset",type:"address"},{name:"amount",type:"uint256"},{name:"httpMethod",type:"string"},{name:"payTo",type:"address"},{name:"tokenId",type:"uint256"},{name:"duration",type:"uint32"},{name:"expiresAt",type:"uint256"},{name:"nonce",type:"bytes32"}]},ue=(e,t,n)=>a(void 0,void 0,void 0,(function*(){return yield fetch(`${e.environment.AUTH_HUB_BASE_API}/${e.environment.AUTH_ENDPOINT}/origin/data/${t}`,{method:"GET",headers:Object.assign({"Content-Type":"application/json"},n)})}))
/**
 * EXPERIMENTAL METHOD
 * Fetch data with X402 payment handling.
 * @param {bigint} tokenId The token ID to fetch data for.
 * @param {any} [signer] Optional signer object for signing the X402 intent.
 * @returns {Promise<any>} A promise that resolves with the fetched data.
 * @throws {Error} Throws an error if the data cannot be fetched or if no signer/wallet client is provided.
 */;
/**
 * Defines the EIP-712 typed data structure for X402 Intent signatures.
 */function pe(t,n,i){return a(this,void 0,void 0,(function*(){var a;const s=this.viemClient;if(!n&&!s)throw new Error("No signer or wallet client provided for X402 intent.");const r=yield ue(this,t,{});if(402!==r.status){if(!r.ok)throw new Error("Failed to fetch data");return r.json()}const o=s||p(n),d=s?yield ce.call(this):yield o.getAddress(),u=yield r.json();if(u.error)throw new Error(u.error);const l=u.accepts[0],y=yield le.call(this,l,e.checksumAddress(d),o),c=btoa(JSON.stringify(y)),m=yield ue(this,t,{"X-PAYMENT":c});if(402===m.status){
// subscription required
if(i){const e=yield m.json();if(yield i(e.marketplaceAction)){const i=yield this.settlePaymentIntent(e,n||s);if(i&&!i.txHash)throw new Error(`Failed to settle payment intent for token ID ${t}`);
// retry fetching data after settlement
return yield this.getDataWithIntent(t,n,void 0)}
// user declined to proceed with payment
return{error:"User declined to proceed with payment",data:null}}return m.json()}if(!m.ok)throw new Error("Failed to fetch data after X402 payment");const h=yield m.json();return{error:null,data:null!==(a=h.data)&&void 0!==a?a:h}}))}
/**
 * Build the X402 payment payload.
 * @private
 */function le(t,n,i){return a(this,void 0,void 0,(function*(){const a="native"===t.asset?e.zeroAddress:t.asset,s=BigInt(t.maxAmountRequired||0),r=t.extra.duration,o=ye.call(this),d=de,u=crypto.randomUUID(),l=e.keccak256(e.toBytes(u)),y={payer:n,asset:a,amount:s.toString(),httpMethod:"GET",payTo:e.checksumAddress(this.environment.MARKETPLACE_CONTRACT_ADDRESS),tokenId:t.extra.tokenId,duration:r,expiresAt:Math.floor(Date.now()/1e3)+t.maxTimeoutSeconds,nonce:l},c=p(i),m=yield c.signTypedData(o,d,y);return{x402Version:1,scheme:"exact",network:t.network,payload:Object.assign(Object.assign({},y),{sigType:"eip712",signature:m,license:{tokenId:t.extra.tokenId,duration:r}})}}))}
/**
 * Create the X402 Intent domain for EIP-712 signing.
 * @private
 */function ye(){return{name:"Origin X402 Intent",version:"1",chainId:this.environment.CHAIN.id,verifyingContract:this.environment.MARKETPLACE_CONTRACT_ADDRESS}}
/**
 * Get the current account address.
 * @private
 */function ce(){return a(this,void 0,void 0,(function*(){const e=this.viemClient;if(!e)throw new Error("WalletClient not connected. Please connect a wallet.");
// If account is already set on the client, return it directly
if(e.account)return e.account.address;
// Otherwise request accounts (browser wallet flow)
const t=yield e.request({method:"eth_requestAccounts",params:[]});if(!t||0===t.length)throw new Error("No accounts found in connected wallet.");return t[0]}))}
/**
 * Raises a dispute against an IP NFT.
 * Requires the caller to have the dispute bond amount in dispute tokens.
 *
 * @param targetIpId The token ID of the IP NFT to dispute.
 * @param evidenceHash The hash of evidence supporting the dispute.
 * @param disputeTag A tag identifying the type of dispute.
 * @returns A promise that resolves with the transaction result including the dispute ID.
 *
 * @example
 * ```typescript
 * const result = await origin.raiseDispute(
 *   1n,
 *   "0x1234...", // evidence hash
 *   "0x5678..." // dispute tag (e.g., "infringement", "fraud")
 * );
 * ```
 */function me(e,t,n){return a(this,void 0,void 0,(function*(){return this.callContractMethod(this.environment.DISPUTE_CONTRACT_ADDRESS,this.environment.DISPUTE_ABI,"raiseDispute",[e,t,n],{waitForReceipt:!0})}))}
/**
 * Asserts a dispute as the IP owner with counter-evidence.
 * Must be called by the owner of the disputed IP within the cooldown period.
 *
 * @param disputeId The ID of the dispute to assert.
 * @param counterEvidenceHash The hash of evidence countering the dispute.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * await origin.disputeAssertion(1n, "0x1234..."); // counter-evidence hash
 * ```
 */function he(e,t){return a(this,void 0,void 0,(function*(){return this.callContractMethod(this.environment.DISPUTE_CONTRACT_ADDRESS,this.environment.DISPUTE_ABI,"disputeAssertion",[e,t],{waitForReceipt:!0})}))}
/**
 * Votes on a dispute as a CAMP token staker.
 * Only users who staked before the dispute was raised can vote.
 * Requires the caller to have voting power >= staking threshold.
 *
 * @param disputeId The ID of the dispute to vote on.
 * @param support True to vote in favor of the dispute, false to vote against.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * // Vote in favor of the dispute
 * await origin.voteOnDispute(1n, true);
 *
 * // Vote against the dispute
 * await origin.voteOnDispute(1n, false);
 * ```
 */function Te(e,t){return a(this,void 0,void 0,(function*(){return this.callContractMethod(this.environment.DISPUTE_CONTRACT_ADDRESS,this.environment.DISPUTE_ABI,"voteOnDispute",[e,t],{waitForReceipt:!0})}))}
/**
 * Resolves a dispute after the voting period has ended.
 * Can be called by anyone - resolution is deterministic based on votes and quorum.
 * If the dispute is valid, the IP is marked as disputed and bond is returned.
 * If invalid, the bond is split between the IP owner and resolver (protocol fee to caller).
 *
 * @param disputeId The ID of the dispute to resolve.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * await origin.resolveDispute(1n);
 * ```
 */function ve(e){return a(this,void 0,void 0,(function*(){return this.callContractMethod(this.environment.DISPUTE_CONTRACT_ADDRESS,this.environment.DISPUTE_ABI,"resolveDispute",[e],{waitForReceipt:!0})}))}
/**
 * Cancels a dispute that is still in the raised state.
 * Can only be called by the dispute initiator during the cooldown period.
 * The bond is returned to the initiator.
 *
 * @param disputeId The ID of the dispute to cancel.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * await origin.cancelDispute(1n);
 * ```
 */function fe(e){return a(this,void 0,void 0,(function*(){return this.callContractMethod(this.environment.DISPUTE_CONTRACT_ADDRESS,this.environment.DISPUTE_ABI,"cancelDispute",[e],{waitForReceipt:!0})}))}
/**
 * Tags a child IP as disputed if its parent has been successfully disputed.
 * This propagates the dispute status to derivative IPs.
 *
 * @param childIpId The token ID of the child IP to tag.
 * @param infringerDisputeId The ID of the resolved dispute against the parent IP.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * // After parent IP (tokenId 1) has been disputed, tag child IP (tokenId 2)
 * await origin.tagChildIp(2n, 1n); // childIpId, disputeId of parent
 * ```
 */function Ae(e,t){return a(this,void 0,void 0,(function*(){return this.callContractMethod(this.environment.DISPUTE_CONTRACT_ADDRESS,this.environment.DISPUTE_ABI,"tagChildIp",[e,t],{waitForReceipt:!0})}))}
/**
 * Gets the details of a dispute by its ID.
 *
 * @param disputeId The ID of the dispute to fetch.
 * @returns A promise that resolves with the dispute details.
 *
 * @example
 * ```typescript
 * const dispute = await origin.getDispute(1n);
 * console.log(`Status: ${dispute.status}`);
 * console.log(`Yes votes: ${dispute.yesVotes}`);
 * console.log(`No votes: ${dispute.noVotes}`);
 * ```
 */function we(e){return a(this,void 0,void 0,(function*(){return this.callContractMethod(this.environment.DISPUTE_CONTRACT_ADDRESS,this.environment.DISPUTE_ABI,"disputes",[e])}))}
// minimal ABI for staking vault
const Ie=[{inputs:[{name:"account",type:"address"}],name:"balanceOf",outputs:[{name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{name:"account",type:"address"}],name:"userStakeTimestamp",outputs:[{name:"",type:"uint256"}],stateMutability:"view",type:"function"}];
/**
 * Checks if a user meets the requirements to vote on a dispute.
 * Returns detailed information about eligibility and reason if ineligible.
 *
 * @param disputeId The ID of the dispute to check.
 * @param voter Optional address to check. If not provided, uses connected wallet.
 * @returns A promise that resolves with the vote eligibility details.
 *
 * @example
 * ```typescript
 * const eligibility = await origin.canVoteOnDispute(1n);
 *
 * if (eligibility.canVote) {
 *   console.log(`You can vote with weight: ${eligibility.votingWeight}`);
 *   await origin.voteOnDispute(1n, true);
 * } else {
 *   console.log(`Cannot vote: ${eligibility.reason}`);
 * }
 * ```
 */function ge(e,t){return a(this,void 0,void 0,(function*(){const n=yield ae(this.viemClient,t),i=A(),a=this.environment.DISPUTE_CONTRACT_ADDRESS,s=this.environment.DISPUTE_ABI,[r,o,d,u,p,l]=yield Promise.all([this.getDispute(e),i.readContract({address:a,abi:s,functionName:"stakingVault",args:[]}),i.readContract({address:a,abi:s,functionName:"stakingThreshold",args:[]}),i.readContract({address:a,abi:s,functionName:"disputeCoolDownPeriod",args:[]}),i.readContract({address:a,abi:s,functionName:"disputeJudgementPeriod",args:[]}),i.readContract({address:a,abi:s,functionName:"hasVoted",args:[e,n]})]),y=r.status,c=r.disputeTimestamp,m=r.assertionTimestamp,[h,T]=yield Promise.all([i.readContract({address:o,abi:Ie,functionName:"userStakeTimestamp",args:[n]}),i.readContract({address:o,abi:Ie,functionName:"balanceOf",args:[n]})]),v=BigInt(Math.floor(Date.now()/1e3));let f,w=!1;y===exports.DisputeStatus.Asserted?(
// for asserted disputes, voting period is relative to assertion timestamp
f=m+p,w=v<=f):y===exports.DisputeStatus.Raised&&(
// for raised disputes, voting period extends from cooldown through judgement
f=c+u+p,w=v<=f);
// build base result
const I={canVote:!1,votingWeight:T,stakingThreshold:d,hasAlreadyVoted:l,userStakeTimestamp:h,disputeTimestamp:c,disputeStatus:y,isVotingPeriodActive:w};
// check all requirements
return y!==exports.DisputeStatus.Raised&&y!==exports.DisputeStatus.Asserted?Object.assign(Object.assign({},I),{reason:`Dispute is not in a voteable status (current: ${exports.DisputeStatus[y]})`}):w?l?Object.assign(Object.assign({},I),{reason:"You have already voted on this dispute"}):h===BigInt(0)?Object.assign(Object.assign({},I),{reason:"You have never staked CAMP tokens"}):h>=c?Object.assign(Object.assign({},I),{reason:"You staked after this dispute was raised (vote recycling prevention)"}):T<d?Object.assign(Object.assign({},I),{reason:`Insufficient stake: you have ${T} but need at least ${d}`}):Object.assign(Object.assign({},I),{canVote:!0}):Object.assign(Object.assign({},I),{reason:"Voting period has ended"})}))}
/**
 * Gets detailed progress and voting statistics for a dispute.
 * Includes vote counts, percentages, quorum progress, and timeline.
 *
 * @param disputeId The ID of the dispute to check.
 * @returns A promise that resolves with the dispute progress details.
 *
 * @example
 * ```typescript
 * const progress = await origin.getDisputeProgress(1n);
 *
 * console.log(`Yes: ${progress.yesPercentage}% | No: ${progress.noPercentage}%`);
 * console.log(`Quorum: ${progress.quorumPercentage}% (${progress.quorumMet ? 'met' : 'not met'})`);
 * console.log(`Projected outcome: ${progress.projectedOutcome}`);
 *
 * if (progress.timeline.canResolveNow) {
 *   await origin.resolveDispute(1n);
 * } else {
 *   console.log(`Can resolve in ${progress.timeline.timeUntilResolution} seconds`);
 * }
 * ```
 */function be(e){return a(this,void 0,void 0,(function*(){var t,n,i,a,s,r,o,d,u;const p=A(),l=this.environment.DISPUTE_CONTRACT_ADDRESS,y=this.environment.DISPUTE_ABI,[c,m,h,T]=yield Promise.all([p.readContract({address:l,abi:y,functionName:"disputes",args:[e]}),p.readContract({address:l,abi:y,functionName:"disputeQuorum",args:[]}),p.readContract({address:l,abi:y,functionName:"disputeCoolDownPeriod",args:[]}),p.readContract({address:l,abi:y,functionName:"disputeJudgementPeriod",args:[]})]),v=Number(null!==(t=c.status)&&void 0!==t?t:c[9]),f=BigInt(null!==(i=null!==(n=c.disputeTimestamp)&&void 0!==n?n:c[5])&&void 0!==i?i:0),w=BigInt(null!==(s=null!==(a=c.assertionTimestamp)&&void 0!==a?a:c[6])&&void 0!==s?s:0),I=BigInt(null!==(o=null!==(r=c.yesVotes)&&void 0!==r?r:c[7])&&void 0!==o?o:0),g=BigInt(null!==(u=null!==(d=c.noVotes)&&void 0!==d?d:c[8])&&void 0!==u?u:0),b=I+g;let C=0,E=0;b>BigInt(0)&&(C=Number(I*BigInt(1e4)/b)/100,E=Number(g*BigInt(1e4)/b)/100);
// calculate quorum progress
let S=0;m>BigInt(0)&&(S=Number(b*BigInt(1e4)/m)/100);const _=b>=m;
// determine projected outcome
let D;D=_?I>g?"dispute_succeeds":"dispute_fails":"no_quorum";
// calculate timeline
const R=BigInt(Math.floor(Date.now()/1e3)),P=new Date(1e3*Number(f)),N=new Date(1e3*Number(f+h));let x,k;v===exports.DisputeStatus.Asserted?(
// for asserted disputes, voting ends relative to assertion
x=new Date(1e3*Number(w+T)),k=w+T):(
// for raised disputes, voting ends after cooldown + judgement
x=new Date(1e3*Number(f+h+T)),k=f+h+T);const M=(v===exports.DisputeStatus.Raised||v===exports.DisputeStatus.Asserted)&&R>k,O=M?0:Number(k-R);return{disputeId:e,status:v,yesVotes:I,noVotes:g,totalVotes:b,yesPercentage:C,noPercentage:E,quorum:m,quorumPercentage:S,quorumMet:_,projectedOutcome:D,timeline:{raisedAt:P,cooldownEndsAt:N,votingEndsAt:x,canResolveNow:M,timeUntilResolution:O}}}))}
/**
 * Fractionalizes an IP NFT into fungible ERC20 tokens.
 * The NFT is transferred to the fractionalizer contract and a new ERC20 token is created.
 * The caller receives the full supply of fractional tokens.
 *
 * @param tokenId The token ID of the IP NFT to fractionalize.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * // First approve the fractionalizer contract to transfer your NFT
 * await origin.approve(fractionalizerAddress, tokenId);
 *
 * // Then fractionalize
 * const result = await origin.fractionalize(1n);
 * ```
 */function Ce(e){return a(this,void 0,void 0,(function*(){return this.callContractMethod(this.environment.FRACTIONALIZER_CONTRACT_ADDRESS,this.environment.FRACTIONALIZER_ABI,"fractionalize",[e],{waitForReceipt:!0})}))}
/**
 * Redeems an IP NFT by burning all of its fractional tokens.
 * The caller must hold the entire supply of the NFT's fractional token.
 * After redemption, the NFT is transferred back to the caller.
 *
 * @param tokenId The token ID of the IP NFT to redeem.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * // Requires holding 100% of the fractional token supply
 * await origin.redeem(1n);
 * ```
 */function Ee(e){return a(this,void 0,void 0,(function*(){return this.callContractMethod(this.environment.FRACTIONALIZER_CONTRACT_ADDRESS,this.environment.FRACTIONALIZER_ABI,"redeem",[e],{waitForReceipt:!0})}))}
/**
 * Gets the fractional ERC20 token address for a specific IP NFT.
 * Returns zero address if the NFT has not been fractionalized.
 *
 * @param tokenId The token ID of the IP NFT.
 * @returns A promise that resolves with the fractional token address.
 *
 * @example
 * ```typescript
 * const fractionalToken = await origin.getTokenForNFT(1n);
 * if (fractionalToken !== zeroAddress) {
 *   console.log(`Fractional token: ${fractionalToken}`);
 * } else {
 *   console.log("NFT has not been fractionalized");
 * }
 * ```
 */function Se(e){return a(this,void 0,void 0,(function*(){return this.callContractMethod(this.environment.FRACTIONALIZER_CONTRACT_ADDRESS,this.environment.FRACTIONALIZER_ABI,"getTokenForNFT",[e])}))}
/**
 * Fractionalizes an IP NFT with automatic approval.
 * This method first approves the fractionalizer contract to transfer your NFT,
 * then calls fractionalize. This is the recommended method for most use cases.
 *
 * @param tokenId The token ID of the IP NFT to fractionalize.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * // Single call handles approval and fractionalization
 * const result = await origin.fractionalizeWithApproval(1n);
 * ```
 */function _e(e){return a(this,void 0,void 0,(function*(){return yield this.approve(this.environment.FRACTIONALIZER_CONTRACT_ADDRESS,e),this.callContractMethod(this.environment.FRACTIONALIZER_CONTRACT_ADDRESS,this.environment.FRACTIONALIZER_ABI,"fractionalize",[e],{waitForReceipt:!0})}))}
/**
 * Redeems fractional tokens for the underlying NFT, but only if the caller owns 100% of the supply.
 * This method checks the caller's balance before attempting to redeem, providing a clear error
 * if they don't hold the full supply.
 *
 * @param tokenId The token ID of the original NFT to redeem.
 * @returns A promise that resolves with the transaction result.
 * @throws Error if the caller doesn't own 100% of the fractional tokens.
 *
 * @example
 * ```typescript
 * try {
 *   const result = await origin.redeemIfComplete(1n);
 *   console.log("NFT redeemed successfully!");
 * } catch (error) {
 *   console.log("You don't own all fractional tokens yet");
 * }
 * ```
 */function De(e){return a(this,void 0,void 0,(function*(){
// get the ERC20 token address for this NFT
const t=yield this.getTokenForNFT(e);if(!t||"0x0000000000000000000000000000000000000000"===t)throw new Error("This NFT has not been fractionalized");
// get current wallet address
const n=yield ae(this.viemClient),i=[{inputs:[{name:"owner",type:"address"}],name:"balanceOf",outputs:[{name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"totalSupply",outputs:[{name:"",type:"uint256"}],stateMutability:"view",type:"function"}],a=A(),[s,r]=yield Promise.all([a.readContract({address:t,abi:i,functionName:"balanceOf",args:[n]}),a.readContract({address:t,abi:i,functionName:"totalSupply",args:[]})]);
// check caller's balance and total supply
if(s<r){const e=s*BigInt(1e4)/r;throw new Error(`Cannot redeem: you own ${e/BigInt(100)}.${e%BigInt(100)}% of the fractional tokens (${s}/${r}). You need 100% to redeem.`)}
// proceed with redemption
return this.callContractMethod(this.environment.FRACTIONALIZER_CONTRACT_ADDRESS,this.environment.FRACTIONALIZER_ABI,"redeem",[e],{waitForReceipt:!0})}))}
// minimal ERC20 ABI
const Re=[{inputs:[{name:"owner",type:"address"}],name:"balanceOf",outputs:[{name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"totalSupply",outputs:[{name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"decimals",outputs:[{name:"",type:"uint8"}],stateMutability:"view",type:"function"}];
/**
 * Gets a user's ownership percentage of a fractionalized NFT.
 * Returns detailed information about the user's fractional token holdings.
 *
 * @param tokenId The token ID of the original NFT.
 * @param owner Optional address to check. If not provided, uses connected wallet.
 * @returns A promise that resolves with the ownership details.
 *
 * @example
 * ```typescript
 * const ownership = await origin.getFractionOwnership(1n);
 *
 * if (!ownership.isFractionalized) {
 *   console.log("This NFT has not been fractionalized");
 * } else {
 *   console.log(`You own ${ownership.ownershipPercentage}% of this NFT`);
 *   console.log(`Balance: ${ownership.balance} / ${ownership.totalSupply}`);
 *
 *   if (ownership.canRedeem) {
 *     console.log("You can redeem the original NFT!");
 *     await origin.redeem(1n);
 *   }
 * }
 * ```
 */function Pe(t,n){return a(this,void 0,void 0,(function*(){const i=yield ae(this.viemClient,n),a=yield this.getTokenForNFT(t);
// get the ERC20 token address for this NFT
// check if fractionalized
if(!a||a===e.zeroAddress)return{tokenId:t,erc20Address:e.zeroAddress,isFractionalized:!1,balance:BigInt(0),totalSupply:BigInt(0),ownershipPercentage:0,canRedeem:!1,decimals:18};const s=A(),[r,o,d]=yield Promise.all([s.readContract({address:a,abi:Re,functionName:"balanceOf",args:[i]}),s.readContract({address:a,abi:Re,functionName:"totalSupply",args:[]}),s.readContract({address:a,abi:Re,functionName:"decimals",args:[]})]);
// fetch ERC20 data
// calculate ownership percentage
let u=0;o>BigInt(0)&&(u=Number(r*BigInt(1e4)/o)/100);const p=r>=o&&o>BigInt(0);return{tokenId:t,erc20Address:a,isFractionalized:!0,balance:r,totalSupply:o,ownershipPercentage:u,canRedeem:p,decimals:d}}))}
/**
 * Checks if a user can fractionalize an NFT and why not if they can't.
 * Returns detailed information about eligibility requirements.
 *
 * @param tokenId The token ID of the NFT to check.
 * @param owner Optional address to check. If not provided, uses connected wallet.
 * @returns A promise that resolves with the fractionalize eligibility details.
 *
 * @example
 * ```typescript
 * const eligibility = await origin.canFractionalize(1n);
 *
 * if (eligibility.canFractionalize) {
 *   if (eligibility.needsApproval) {
 *     // Use fractionalizeWithApproval for convenience
 *     await origin.fractionalizeWithApproval(1n);
 *   } else {
 *     await origin.fractionalize(1n);
 *   }
 * } else {
 *   console.log(`Cannot fractionalize: ${eligibility.reason}`);
 * }
 * ```
 */function Ne(t,n){return a(this,void 0,void 0,(function*(){const i=yield ae(this.viemClient,n),a=A(),s=this.environment.FRACTIONALIZER_CONTRACT_ADDRESS,[r,o,d,u,p]=yield Promise.all([this.ownerOf(t),this.dataStatus(t),this.getTokenForNFT(t),a.readContract({address:this.environment.DATANFT_CONTRACT_ADDRESS,abi:this.environment.IPNFT_ABI,functionName:"getApproved",args:[t]}),a.readContract({address:this.environment.DATANFT_CONTRACT_ADDRESS,abi:this.environment.IPNFT_ABI,functionName:"isApprovedForAll",args:[i,s]})]),l=r.toLowerCase()===i.toLowerCase(),y=d&&d!==e.zeroAddress,c=p||u.toLowerCase()===s.toLowerCase(),m={canFractionalize:!1,isOwner:l,currentOwner:r,isAlreadyFractionalized:!!y,existingErc20Address:y?d:void 0,dataStatus:o,isApproved:c,needsApproval:!c};
// check requirements
return l?y?Object.assign(Object.assign({},m),{reason:`This NFT is already fractionalized. ERC20: ${d}`}):o===exports.DataStatus.DELETED?Object.assign(Object.assign({},m),{reason:"This NFT has been deleted and cannot be fractionalized"}):o===exports.DataStatus.DISPUTED?Object.assign(Object.assign({},m),{reason:"This NFT is disputed and cannot be fractionalized"}):Object.assign(Object.assign({},m),{canFractionalize:!0}):Object.assign(Object.assign({},m),{reason:`You don't own this NFT. Current owner: ${r}`})}))}
/**
 * Gets information about a registered app from the AppRegistry.
 *
 * @param appId The app ID to look up.
 * @returns A promise that resolves with the app information.
 *
 * @example
 * ```typescript
 * const appInfo = await origin.getAppInfo("my-app-id");
 * console.log(`Treasury: ${appInfo.treasury}`);
 * console.log(`Revenue Share: ${appInfo.revenueShareBps / 100}%`);
 * console.log(`Active: ${appInfo.isActive}`);
 * ```
 */function xe(e){return a(this,void 0,void 0,(function*(){return this.callContractMethod(this.environment.APP_REGISTRY_CONTRACT_ADDRESS,this.environment.APP_REGISTRY_ABI,"getAppInfo",[e])}))}
/**
 * Approves a spender to spend a specified amount of tokens on behalf of the owner.
 * If the current allowance is less than the specified amount, it will perform the approval.
 * @param {ApproveParams} params - The parameters for the approval.
 */function ke(t){return a(this,arguments,void 0,(function*({walletClient:t,publicClient:n,tokenAddress:i,owner:a,spender:s,amount:r}){(yield n.readContract({address:i,abi:e.erc20Abi,functionName:"allowance",args:[a,s]}))<r&&(yield t.writeContract({address:i,account:a,abi:e.erc20Abi,functionName:"approve",args:[s,r],chain:c}))}))}
/**
 * Executes an atomic bulk purchase of multiple IP-NFT licenses.
 * All purchases succeed or all fail together.
 *
 * @param buyer The address that will receive the licenses.
 * @param purchases Array of purchase parameters for each token.
 * @param value Total native token value to send (sum of all native token purchases).
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * const purchases = [
 *   { tokenId: 1n, expectedPrice: 1000000000000000n, expectedDuration: 86400, expectedPaymentToken: zeroAddress },
 *   { tokenId: 2n, expectedPrice: 2000000000000000n, expectedDuration: 86400, expectedPaymentToken: zeroAddress },
 * ];
 * const totalValue = 3000000000000000n;
 * await origin.bulkBuyAccess(buyerAddress, purchases, totalValue);
 * ```
 */function Me(e,t,n){return this.callContractMethod(this.environment.BATCH_PURCHASE_CONTRACT_ADDRESS,this.environment.BATCH_PURCHASE_ABI,"bulkBuyAccess",[e,t],{waitForReceipt:!0,value:n})}
/**
 * Executes a fault-tolerant bulk purchase of multiple IP-NFT licenses.
 * Individual purchases can fail without reverting the entire transaction.
 * Unused funds are automatically refunded.
 *
 * @param buyer The address that will receive the licenses.
 * @param purchases Array of purchase parameters for each token.
 * @param value Total native token value to send (can be more than needed; excess is refunded).
 * @returns A promise that resolves with the tolerant result including success/failure counts.
 *
 * @example
 * ```typescript
 * const result = await origin.bulkBuyAccessTolerant(buyerAddress, purchases, totalValue);
 * console.log(`Purchased ${result.successCount} of ${purchases.length} IPs`);
 * console.log(`Failed tokens: ${result.failedTokenIds}`);
 * ```
 */function Oe(e,t,n){return this.callContractMethod(this.environment.BATCH_PURCHASE_CONTRACT_ADDRESS,this.environment.BATCH_PURCHASE_ABI,"bulkBuyAccessTolerant",[e,t],{waitForReceipt:!0,value:n})}
/**
 * Previews the total cost of purchasing multiple IP-NFT licenses.
 * This is a view function that doesn't require a transaction.
 *
 * @param tokenIds Array of token IDs to preview costs for.
 * @returns A promise that resolves with the cost preview including total costs and invalid tokens.
 *
 * @example
 * ```typescript
 * const preview = await origin.previewBulkCost([1n, 2n, 3n]);
 * console.log(`Total cost: ${preview.totalNativeCost} wei`);
 * console.log(`Valid tokens: ${preview.validCount}`);
 * ```
 */function Be(e){return this.callContractMethod(this.environment.BATCH_PURCHASE_CONTRACT_ADDRESS,this.environment.BATCH_PURCHASE_ABI,"previewBulkCost",[e])}
/**
 * Builds purchase parameters for multiple tokens by fetching their current license terms.
 * This is a view function that doesn't require a transaction.
 *
 * @param tokenIds Array of token IDs to build parameters for.
 * @returns A promise that resolves with an array of BuyParams ready for bulk purchase.
 *
 * @example
 * ```typescript
 * const params = await origin.buildPurchaseParams([1n, 2n, 3n]);
 * await origin.bulkBuyAccess(buyer, params, totalValue);
 * ```
 */function Fe(e){return this.callContractMethod(this.environment.BATCH_PURCHASE_CONTRACT_ADDRESS,this.environment.BATCH_PURCHASE_ABI,"buildPurchaseParams",[e])}
/**
 * Checks the active status of multiple tokens.
 *
 * @param tokenIds Array of token IDs to check.
 * @returns A promise that resolves with an array of boolean flags indicating active status.
 *
 * @example
 * ```typescript
 * const activeFlags = await origin.checkActiveStatus([1n, 2n, 3n]);
 * const activeTokens = tokenIds.filter((_, i) => activeFlags[i]);
 * ```
 */function Ue(e){return this.callContractMethod(this.environment.BATCH_PURCHASE_CONTRACT_ADDRESS,this.environment.BATCH_PURCHASE_ABI,"checkActiveStatus",[e])}
/**
 * Smart bulk purchase that automatically fetches terms and handles the entire purchase flow.
 * This is the recommended method for most use cases.
 *
 * @param tokenIds Array of token IDs to purchase.
 * @param options Optional configuration for the purchase.
 * @returns A promise that resolves with the transaction result.
 *
 * @example
 * ```typescript
 * // Atomic purchase - all succeed or all fail
 * const result = await origin.bulkBuyAccessSmart([1n, 2n, 3n]);
 *
 * // Tolerant purchase - continue even if some fail
 * const result = await origin.bulkBuyAccessSmart([1n, 2n, 3n], { tolerant: true });
 * ```
 */function He(t,n){return a(this,void 0,void 0,(function*(){if(!t||0===t.length)throw new Error("No token IDs provided for bulk purchase");
// Get the buyer's wallet address
const i=this.viemClient;if(!i)throw new Error("WalletClient not connected. Please connect a wallet.");let a;if(i.account)a=i.account.address;else{const e=yield i.request({method:"eth_requestAccounts",params:[]});if(!e||0===e.length)throw new Error("No accounts found in connected wallet.");a=e[0]}
// Build purchase params from on-chain data
const s=yield this.buildPurchaseParams(t);
// Calculate total native token cost
let r=BigInt(0);const o=[];for(const t of s)if(t.expectedPaymentToken===e.zeroAddress)r+=t.expectedPrice;else{
// Group ERC20 purchases by token
const e=o.find((e=>e.token===t.expectedPaymentToken));e?e.amount+=t.expectedPrice:o.push({token:t.expectedPaymentToken,amount:t.expectedPrice})}
// Approve ERC20 tokens if needed
const d=A();for(const e of o)yield ke({walletClient:i,publicClient:d,tokenAddress:e.token,owner:a,spender:this.environment.BATCH_PURCHASE_CONTRACT_ADDRESS,amount:e.amount});
// Execute the purchase
return(null==n?void 0:n.tolerant)?this.bulkBuyAccessTolerant(a,s,r):this.bulkBuyAccess(a,s,r)}))}var je,$e,Le,ze,qe,Ve,We,Je,Ge,Ye,Ze,Ke,Xe,Qe,et,tt,nt,it,at,st,rt,ot;
/**
 * The Origin class
 * Handles interactions with Origin protocol.
 */class dt{constructor(e,t,n,i,a){je.add(this),t?this.jwt=t:console.warn("JWT not provided. Some features may be unavailable."),this.viemClient=n,this.environment="string"==typeof e?k[e]:e||k.DEVELOPMENT,this.baseParentId=i,this.appId=a,
// DataNFT methods
this.mintWithSignature=F.bind(this),this.registerIpNFT=U.bind(this),this.updateTerms=H.bind(this),this.finalizeDelete=j.bind(this),this.getOrCreateRoyaltyVault=$.bind(this),this.getTerms=L.bind(this),this.ownerOf=z.bind(this),this.balanceOf=q.bind(this),this.tokenURI=V.bind(this),this.dataStatus=W.bind(this),this.isApprovedForAll=J.bind(this),this.transferFrom=G.bind(this),this.safeTransferFrom=Y.bind(this),this.approve=Z.bind(this),this.setApprovalForAll=K.bind(this),
// Marketplace methods
this.buyAccess=X.bind(this),this.hasAccess=Q.bind(this),this.subscriptionExpiry=ee.bind(this),this.settlePaymentIntent=ie.bind(this),this.getDataWithIntent=pe.bind(this),
// Bulk purchase methods
this.bulkBuyAccess=Me.bind(this),this.bulkBuyAccessTolerant=Oe.bind(this),this.bulkBuyAccessSmart=He.bind(this),this.previewBulkCost=Be.bind(this),this.buildPurchaseParams=Fe.bind(this),this.checkActiveStatus=Ue.bind(this),
// Dispute module methods
this.raiseDispute=me.bind(this),this.disputeAssertion=he.bind(this),this.voteOnDispute=Te.bind(this),this.resolveDispute=ve.bind(this),this.cancelDispute=fe.bind(this),this.tagChildIp=Ae.bind(this),this.getDispute=we.bind(this),this.canVoteOnDispute=ge.bind(this),this.getDisputeProgress=be.bind(this),
// Fractionalizer module methods
this.fractionalize=Ce.bind(this),this.redeem=Ee.bind(this),this.getTokenForNFT=Se.bind(this),this.fractionalizeWithApproval=_e.bind(this),this.redeemIfComplete=De.bind(this),this.getFractionOwnership=Pe.bind(this),this.canFractionalize=Ne.bind(this),
// AppRegistry module methods
this.getAppInfo=xe.bind(this)}getJwt(){return this.jwt}setViemClient(e){this.viemClient=e}
/**
     * Mints a file-based IpNFT.
     * @param file The file to mint.
     * @param metadata The metadata associated with the file.
     * @param license The license terms for the IpNFT.
     * @param parents Optional parent token IDs for lineage tracking.
     * @param options Optional parameters including progress callback, preview image, and use asset as preview flag.
     * @returns The token ID of the minted IpNFT as a string, or null if minting failed.
     */mintFile(e,t,n,i,r){return a(this,void 0,void 0,(function*(){let a,o=null;try{o=yield s(this,je,"m",Je).call(this)}catch(e){throw new Error("Failed to mint file IP. Wallet not connected.")}try{if(a=yield s(this,je,"m",qe).call(this,e,r),!a||!a.key)throw new Error("Failed to upload file or get upload info.")}catch(e){throw new Error(`File upload failed: ${e instanceof Error?e.message:String(e)}`)}e.type&&(t.mimetype=e.type);let d=null;(null==r?void 0:r.previewImage)&&(null==r?void 0:r.previewImage.type.startsWith("image/"))?d=yield s(this,je,"m",ze).call(this,r.previewImage):(null==r?void 0:r.useAssetAsPreview)&&e.type.startsWith("image/")&&(d=yield s(this,je,"m",ze).call(this,e)),d&&(t.image=`ipfs://${d}`);const u=BigInt(Date.now()+6e5);// 10 minutes from now
let p;this.baseParentId&&(i||(i=[]),i.unshift(this.baseParentId));try{p=yield this.registerIpNFT("file",u,n,t,a.key,i)}catch(e){throw yield s(this,je,"m",Le).call(this,a.key,"failed"),new Error(`Failed to register IpNFT: ${e instanceof Error?e.message:String(e)}`)}const{tokenId:l,signerAddress:y,creatorContentHash:c,signature:m,uri:h}=p;if(!(l&&y&&c&&void 0!==m&&h))throw new Error("Failed to register IpNFT: Missing required fields in registration response.");try{const e=yield this.mintWithSignature(o,l,i||[],!0,c,h,n,u,m);if(-1===["0x1","success"].indexOf(e.receipt.status))throw yield s(this,je,"m",Le).call(this,a.key,"failed"),new Error(`Minting failed with status: ${e.receipt.status}`)}catch(e){throw yield s(this,je,"m",Le).call(this,a.key,"failed"),new Error(`Minting transaction failed: ${e instanceof Error?e.message:String(e)}`)}return l.toString()}))}
/**
     * Mints a social IpNFT.
     * @param source The social media source (spotify, twitter, tiktok).
     * @param metadata The metadata associated with the social media content.
     * @param license The license terms for the IpNFT.
     * @return The token ID of the minted IpNFT as a string, or null if minting failed.
     */mintSocial(e,t,n){return a(this,void 0,void 0,(function*(){let i=null;try{i=yield s(this,je,"m",Je).call(this)}catch(e){throw new Error("Failed to mint social IP. Wallet not connected.")}t.mimetype=`social/${e}`;const a=BigInt(Math.floor(Date.now()/1e3)+600);// 10 minutes from now
let r,o=this.baseParentId?[this.baseParentId]:[];try{r=yield this.registerIpNFT(e,a,n,t,void 0,o)}catch(e){throw new Error(`Failed to register Social IpNFT: ${e instanceof Error?e.message:String(e)}`)}const{tokenId:d,signerAddress:u,creatorContentHash:p,signature:l,uri:y}=r;if(!(d&&u&&p&&void 0!==l&&y))throw new Error("Failed to register Social IpNFT: Missing required fields in registration response.");try{const e=yield this.mintWithSignature(i,d,o,!0,p,y,n,a,l);if(-1===["0x1","success"].indexOf(e.receipt.status))throw new Error(`Minting Social IpNFT failed with status: ${e.receipt.status}`)}catch(e){throw new Error(`Minting transaction failed: ${e instanceof Error?e.message:String(e)}`)}return d.toString()}))}
/**
     * Call a contract method.
     * @param {string} contractAddress The contract address.
     * @param {Abi} abi The contract ABI.
     * @param {string} methodName The method name.
     * @param {any[]} params The method parameters.
     * @param {CallOptions} [options] The call options.
     * @returns {Promise<any>} A promise that resolves with the result of the contract call or transaction hash.
     * @throws {Error} - Throws an error if the wallet client is not connected and the method is not a view function.
     */callContractMethod(t,n,i,r){return a(this,arguments,void 0,(function*(t,n,i,a,r={}){var o;let d=null;try{d=yield s(this,je,"m",Je).call(this)}catch(e){throw new Error("Failed to call contract method. Wallet not connected.")}const u=e.getAbiItem({abi:n,name:i});if(u&&"stateMutability"in u&&("view"===u.stateMutability||"pure"===u.stateMutability)){const e=A();return(yield e.readContract({address:t,abi:n,functionName:i,args:a}))||null}yield s(this,je,"m",We).call(this,this.environment.CHAIN);const p=A(),{result:l,request:y}=yield p.simulateContract({account:d,address:t,abi:n,functionName:i,args:a,value:r.value});
// simulate
if(r.simulate)return l;try{const e=yield null===(o=this.viemClient)||void 0===o?void 0:o.writeContract(y);if("string"!=typeof e)throw new Error("Transaction failed to send.");if(!r.waitForReceipt)return{txHash:e,simulatedResult:l};return{txHash:e,receipt:yield s(this,je,"m",Ve).call(this,e),simulatedResult:l}}catch(e){throw console.error("Transaction failed:",e),new Error("Transaction failed: "+e)}}))}
/**
     * Gets comprehensive token information in a single call.
     * Combines owner, status, terms, URI, and access information.
     *
     * @param tokenId The token ID to get information for.
     * @param owner Optional address to check access for. If not provided, uses connected wallet.
     * @returns A promise that resolves with comprehensive token information.
     *
     * @example
     * ```typescript
     * const info = await origin.getTokenInfoSmart(1n);
     * console.log(`Owner: ${info.owner}`);
     * console.log(`Price: ${info.terms.price}`);
     * console.log(`Has access: ${info.hasAccess}`);
     * ```
     */getTokenInfoSmart(e,t){return a(this,void 0,void 0,(function*(){var n;
// Resolve the address to check access for
let i;if(t)i=t;else if(null===(n=this.viemClient)||void 0===n?void 0:n.account)i=this.viemClient.account.address;else if(this.viemClient)try{const e=yield this.viemClient.request({method:"eth_requestAccounts",params:[]});i=e&&e.length>0?e[0]:"0x0000000000000000000000000000000000000000"}catch(e){i="0x0000000000000000000000000000000000000000"}else i="0x0000000000000000000000000000000000000000";
// Fetch all information in parallel
const[a,s,r,o,d]=yield Promise.all([this.ownerOf(e),this.tokenURI(e),this.dataStatus(e),this.getTerms(e),this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"tokenInfo",[e]).catch((()=>({appId:""})))]);
// Get access info if we have a valid address
let u=!1,p=null;if("0x0000000000000000000000000000000000000000"!==i)try{[u,p]=yield Promise.all([this.hasAccess(i,e),this.subscriptionExpiry(e,i)])}catch(e){
// Access check failed, defaults are fine
}return{tokenId:e,owner:a,uri:s,status:r,terms:o,hasAccess:u,accessExpiry:p,appId:(null==d?void 0:d.appId)||""}}))}
/**
     * Buy access to an asset by first checking its price via getTerms, then calling buyAccess.
     * Automatically fetches protocol and app fees from the contracts.
     * If the user already has access, returns null without making a transaction.
     *
     * @param tokenId The token ID of the asset.
     * @returns The result of the buyAccess call, or null if user already has access.
     *
     * @example
     * ```typescript
     * const result = await origin.buyAccessSmart(1n);
     * if (result === null) {
     *   console.log("You already have access to this asset");
     * } else {
     *   console.log("Access purchased:", result.txHash);
     * }
     * ```
     */buyAccessSmart(t){return a(this,void 0,void 0,(function*(){let n=null;try{n=yield s(this,je,"m",Je).call(this)}catch(e){throw new Error("Failed to buy access. Wallet not connected.")}
// Check if user already has access
if(yield this.hasAccess(n,t))return console.log("User already has access to this asset"),null;const i=yield this.getTerms(t);if(!i)throw new Error("Failed to fetch terms for asset");const{price:a,paymentToken:r,duration:o}=i;if(void 0===a||void 0===r||void 0===o)throw new Error("Terms missing price, paymentToken, or duration");
// Fetch protocol fee from marketplace
const d=yield s(this,je,"m",Ge).call(this),u=yield s(this,je,"m",Ye).call(this,t),p=a;
// Fetch app fee from token's appId
return r===e.zeroAddress?this.buyAccess(n,t,p,o,r,d,u,p):(yield ke({walletClient:this.viemClient,publicClient:A(),tokenAddress:r,owner:n,spender:this.environment.MARKETPLACE_CONTRACT_ADDRESS,amount:p}),this.buyAccess(n,t,p,o,r,d,u))}))}
/**
     * Fetch the underlying data associated with a specific token ID.
     * @param {bigint} tokenId - The token ID to fetch data for.
     * @returns {Promise<any>} A promise that resolves with the fetched data.
     * @throws {Error} Throws an error if the data cannot be fetched.
     */getData(e){return a(this,void 0,void 0,(function*(){const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/data/${e}`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!t.ok)throw new Error("Failed to fetch data");return t.json()}))}
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
     */getTokenBoundAccount(e){return a(this,void 0,void 0,(function*(){try{return yield this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"getAccount",[e],{simulate:!0})}catch(t){throw new Error(`Failed to get Token Bound Account for token ${e}: ${t instanceof Error?t.message:String(t)}`)}}))}
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
     */getRoyalties(t,n){return a(this,void 0,void 0,(function*(){try{const i=yield this.getTokenBoundAccount(t),a=A();let s,r;if(n&&n!==e.zeroAddress){
// erc20 (wrapped camp)
const t=[{inputs:[{name:"owner",type:"address"}],name:"balanceOf",outputs:[{name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"decimals",outputs:[{name:"",type:"uint8"}],stateMutability:"view",type:"function"}];s=yield this.callContractMethod(n,t,"balanceOf",[i]);const a=yield this.callContractMethod(n,t,"decimals",[]);r=e.formatUnits(s,a)}else s=yield a.getBalance({address:i}),r=e.formatEther(s);return{tokenBoundAccount:i,balance:s,balanceFormatted:r}}catch(e){throw new Error(`Failed to retrieve royalties for token ${t}: ${e instanceof Error?e.message:String(e)}`)}}))}
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
     */claimRoyalties(t,n,i){return a(this,void 0,void 0,(function*(){const a=yield s(this,je,"m",Ze).call(this,n),r=yield this.getTokenBoundAccount(t),o=(yield this.getRoyalties(t,i)).balance;if(o===BigInt(0))throw new Error("No royalties available to claim");let d,u,p;
// Call execute on the TBA
return i&&i!==e.zeroAddress?(
// ERC20 token transfer
d=i,u=BigInt(0),
// Encode ERC20 transfer call: transfer(address to, uint256 amount)
p=e.encodeFunctionData({abi:[{inputs:[{name:"to",type:"address"},{name:"amount",type:"uint256"}],name:"transfer",outputs:[{name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"}],functionName:"transfer",args:[a,o]})):(
// Native token transfer
d=a,u=o,p="0x"),this.callContractMethod(r,this.environment.TBA_ABI,"execute",[d,u,p,0],// operation: 0 = CALL
{waitForReceipt:!0,value:BigInt(0)})}))}}je=new WeakSet,$e=function(e){return a(this,void 0,void 0,(function*(){try{const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/upload-url`,{method:"POST",body:JSON.stringify({name:e.name,type:e.type}),headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!t.ok)throw new Error(`HTTP ${t.status}: ${t.statusText}`);const n=yield t.json();if(n.isError)throw new Error(n.message||"Failed to generate upload URL");return n.data}catch(e){throw console.error("Failed to generate upload URL:",e),e}}))},Le=function(e,t){return a(this,void 0,void 0,(function*(){try{const n=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/update-status`,{method:"PATCH",body:JSON.stringify({status:t,fileKey:e}),headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!n.ok){const e=yield n.text().catch((()=>"Unknown error"));throw new Error(`HTTP ${n.status}: ${e}`)}return!0}catch(e){throw console.error("Failed to update origin status:",e),e}}))},ze=function(e){return a(this,void 0,void 0,(function*(){var t;if(!e)return null;try{const n=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/upload-url-ipfs`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.jwt}`},body:JSON.stringify({fileName:e.name,fileType:e.type})});if(!n.ok){const e=yield n.text().catch((()=>"Unknown error"));throw new Error(`Failed to get presigned URL (HTTP ${n.status}): ${e}`)}const i=yield n.json(),{isError:a,data:s,message:r}=i;if(a||!s)throw new Error(`Failed to get presigned URL: ${r||"No URL returned from server"}`);const o=new FormData;o.append("file",e);const d=yield fetch(s,{method:"POST",body:o});if(!d.ok){const e=yield d.text().catch((()=>d.statusText));throw new Error(`Failed to upload preview image to IPFS (HTTP ${d.status}): ${e}`)}const u=yield d.json();if(!u||!u.data)throw new Error("Invalid response from IPFS upload: Missing data field");return null===(t=u.data)||void 0===t?void 0:t.cid}catch(e){const t=e instanceof Error?e.message:String(e);throw console.error("Error uploading preview image to IPFS:",t),new Error(`Failed to upload preview image to IPFS: ${t}`)}}))},qe=function(e,t){return a(this,void 0,void 0,(function*(){let n;try{n=yield s(this,je,"m",$e).call(this,e)}catch(e){throw console.error("Failed to generate upload URL:",e),new Error(`Failed to generate upload URL: ${e instanceof Error?e.message:String(e)}`)}if(!n)throw new Error("Failed to generate upload URL: No upload info returned");try{yield((e,t,n)=>new Promise(((a,s)=>{i.put(t,e,Object.assign({headers:{"Content-Type":e.type}},"undefined"!=typeof window&&"function"==typeof n?{onUploadProgress:e=>{if(e.total){const t=e.loaded/e.total*100;n(t)}}}:{})).then((e=>{a(e.data)})).catch((e=>{var t;const n=(null===(t=null==e?void 0:e.response)||void 0===t?void 0:t.data)||(null==e?void 0:e.message)||"Upload failed";s(n)}))})))(e,n.url,(null==t?void 0:t.progressCallback)||(()=>{}))}catch(e){try{yield s(this,je,"m",Le).call(this,n.key,"failed")}catch(e){console.error("Failed to update status to failed:",e)}const t=e instanceof Error?e.message:String(e);throw new Error(`Failed to upload file: ${t}`)}try{yield s(this,je,"m",Le).call(this,n.key,"success")}catch(e){console.error("Failed to update status to success:",e)}return n}))},Ve=function(e){return a(this,arguments,void 0,(function*(e,t={}){var n,i,a;const s=A();let r=e;const o=null!==(n=t.confirmations)&&void 0!==n?n:1,d=null!==(i=t.timeoutMs)&&void 0!==i?i:18e4,u=null!==(a=t.pollingIntervalMs)&&void 0!==a?a:1500;try{return yield s.waitForTransactionReceipt({hash:r,confirmations:o,timeout:d,pollingInterval:u,onReplaced:e=>{r=e.transaction.hash}})}catch(e){
// fallback
const t=Date.now();for(;Date.now()-t<d;){try{const e=yield s.getTransactionReceipt({hash:r});if(e&&e.blockNumber)return e}catch(e){}yield new Promise((e=>setTimeout(e,u)))}throw e}}))},We=function(e){return a(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected. Could not ensure chain ID.");let t=yield this.viemClient.request({method:"eth_chainId",params:[]});if("string"==typeof t&&(t=parseInt(t,16)),t!==e.id){(e=>{f=e,v=null})// reset public client to be recreated with new chain
(e);try{yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16)}]})}catch(t){
// Unrecognized chain
if(4902!==t.code)throw t;yield this.viemClient.request({method:"wallet_addEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16),chainName:e.name,rpcUrls:e.rpcUrls.default.http,nativeCurrency:e.nativeCurrency}]}),yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16)}]})}}}))},Je=function(){return a(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected. Please connect a wallet.");
// If account is already set on the client, return it directly
if(this.viemClient.account)return this.viemClient.account.address;
// Otherwise request accounts (browser wallet flow)
const e=yield this.viemClient.request({method:"eth_requestAccounts",params:[]});if(!e||0===e.length)throw new Error("No accounts found in connected wallet.");return e[0]}))},Ge=function(){return a(this,void 0,void 0,(function*(){try{const e=yield this.callContractMethod(this.environment.MARKETPLACE_CONTRACT_ADDRESS,this.environment.MARKETPLACE_ABI,"protocolFeeBps",[]);return Number(e)}catch(e){return console.warn("Failed to fetch protocol fee, defaulting to 0:",e),0}}))},Ye=function(e){return a(this,void 0,void 0,(function*(){try{
// First, get the token info to find its appId
const t=yield this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"tokenInfo",[e]),n=null==t?void 0:t.appId;if(!n||""===n)return 0;
// Check if app registry is configured
if(!this.environment.APP_REGISTRY_CONTRACT_ADDRESS||!this.environment.APP_REGISTRY_ABI)return 0;
// Fetch app info from registry
const i=yield this.callContractMethod(this.environment.APP_REGISTRY_CONTRACT_ADDRESS,this.environment.APP_REGISTRY_ABI,"getAppInfo",[n]);
// Only return fee if app is active
return(null==i?void 0:i.isActive)?Number(i.revenueShareBps):0}catch(e){return console.warn("Failed to fetch app fee, defaulting to 0:",e),0}}))},Ze=function(e){return a(this,void 0,void 0,(function*(){if(e)return e;if(!this.viemClient)throw new Error("No wallet address provided and no wallet client connected. Please provide an owner address or connect a wallet.");
// If account is already set on the client, return it directly
if(this.viemClient.account)return this.viemClient.account.address;
// Otherwise request accounts (browser wallet flow)
const t=yield this.viemClient.request({method:"eth_requestAccounts",params:[]});if(!t||0===t.length)throw new Error("No accounts found in connected wallet.");return t[0]}))};Xe=new WeakMap,Qe=new WeakMap,et=new WeakMap,tt=new WeakMap,Ke=new WeakSet,nt=function(e,t){s(this,Xe,"f")[e]&&s(this,Xe,"f")[e].forEach((e=>e(t)))},it=function(e){return a(this,void 0,void 0,(function*(){const t=yield s(this,tt,"f").getItem("camp-sdk:wallet-address"),n=yield s(this,tt,"f").getItem("camp-sdk:user-id"),i=yield s(this,tt,"f").getItem("camp-sdk:jwt"),a=yield s(this,tt,"f").getItem("camp-sdk:environment");t&&n&&i&&(a===this.environment.NAME||!a)?(this.walletAddress=t,this.userId=n,this.jwt=i,this.origin=new dt(this.environment,this.jwt,this.viem,this.baseParentId,this.clientId),this.isAuthenticated=!0,e?this.setProvider({provider:e.provider,info:e.info||{name:"Unknown"},address:t}):s(this,Qe,"f")||(console.warn("No matching provider was given for the stored wallet address. Trying to recover provider."),yield this.recoverProvider())):this.isAuthenticated=!1}))},at=function(){return a(this,void 0,void 0,(function*(){try{const[t]=yield this.viem.requestAddresses();return this.walletAddress=e.checksumAddress(t),this.walletAddress}catch(e){throw new h(e)}}))},st=function(){return a(this,void 0,void 0,(function*(){try{const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/client-user/nonce`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({walletAddress:this.walletAddress})}),t=yield e.json();return 200!==e.status?Promise.reject(t.message||"Failed to fetch nonce"):t.data}catch(e){throw new Error(e)}}))},rt=function(e,t){return a(this,void 0,void 0,(function*(){try{const n=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/client-user/verify`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({message:e,signature:t,walletAddress:this.walletAddress})}),i=yield n.json(),a=i.data.split(".")[1],s=JSON.parse(atob(a));return{success:!i.isError,userId:s.id,token:i.data}}catch(e){throw new h(e)}}))},ot=function(e,t,i){return n.createSiweMessage({domain:t||(s(this,Qe,"f")?"localhost":window.location.host),address:this.walletAddress,statement:_,uri:i||(s(this,Qe,"f")?"http://localhost":window.location.origin),version:"1",chainId:this.environment.CHAIN.id,nonce:e})},exports.Auth=
/**
 * The Auth class.
 * @class
 * @classdesc The Auth class is used to authenticate the user.
 */
class{
/**
     * Constructor for the Auth class.
     * @param {object} options The options object.
     * @param {string} options.clientId The client ID.
     * @param {string|object} options.redirectUri The redirect URI used for oauth. Leave empty if you want to use the current URL. If you want different redirect URIs for different socials, pass an object with the socials as keys and the redirect URIs as values.
     * @param {("DEVELOPMENT"|"PRODUCTION")} [options.environment="DEVELOPMENT"] The environment to use.
     * @param {StorageAdapter} [options.storage] Custom storage adapter. Defaults to localStorage in browser, memory storage in Node.js.
     * @throws {APIError} - Throws an error if the clientId is not provided.
     */
constructor({clientId:e,redirectUri:t,environment:n="DEVELOPMENT",baseParentId:i,storage:a}){if(Ke.add(this),Xe.set(this,void 0),Qe.set(this,void 0),et.set(this,void 0),tt.set(this,void 0),!e)throw new Error("clientId is required");if(-1===["PRODUCTION","DEVELOPMENT"].indexOf(n))throw new Error("Invalid environment, must be DEVELOPMENT or PRODUCTION");r(this,Qe,"undefined"==typeof window,"f"),r(this,tt,a||(s(this,Qe,"f")?new y:new l),"f"),this.viem=null,this.environment=k[n],this.baseParentId=i,this.redirectUri=(e=>{const t=["twitter","spotify"];return"object"==typeof e?t.reduce(((t,n)=>(t[n]=e[n]||("undefined"!=typeof window?window.location.href:""),t)),{}):"string"==typeof e?t.reduce(((t,n)=>(t[n]=e,t)),{}):e?{}:t.reduce(((e,t)=>(e[t]="undefined"!=typeof window?window.location.href:"",e)),{})})(t),this.clientId=e,this.isAuthenticated=!1,this.jwt=null,this.origin=null,this.walletAddress=null,this.userId=null,r(this,Xe,{},"f"),
// only subscribe to providers in browser environment
s(this,Qe,"f")||B((e=>{s(this,Ke,"m",nt).call(this,"providers",e)})),s(this,Ke,"m",it).call(this)}
/**
     * Subscribe to an event. Possible events are "state", "provider", "providers", and "viem".
     * @param {("state"|"provider"|"providers"|"viem")} event The event.
     * @param {function} callback The callback function.
     * @returns {void}
     * @example
     * auth.on("state", (state) => {
     *  console.log(state);
     * });
     */on(e,t){s(this,Xe,"f")[e]||(s(this,Xe,"f")[e]=[]),s(this,Xe,"f")[e].push(t),"providers"===e&&t(O())}
/**
     * Unsubscribe from an event. Possible events are "state", "provider", "providers", and "viem".
     * @param {("state"|"provider"|"providers"|"viem")} event The event.
     * @param {function} callback The callback function.
     * @returns {void}
     */off(e,t){s(this,Xe,"f")[e]&&(s(this,Xe,"f")[e]=s(this,Xe,"f")[e].filter((e=>e!==t)))}
/**
     * Set the loading state.
     * @param {boolean} loading The loading state.
     * @returns {void}
     */setLoading(e){s(this,Ke,"m",nt).call(this,"state",e?"loading":this.isAuthenticated?"authenticated":"unauthenticated")}
/**
     * Set the provider. This is useful for setting the provider when the user selects a provider from the UI or when dApp wishes to use a specific provider.
     * @param {object} options The options object. Includes the provider and the provider info.
     * @returns {void}
     * @throws {APIError} - Throws an error if the provider is not provided.
     */setProvider({provider:n,info:i,address:a}){if(!n)throw new h("provider is required");this.viem=((n,i="window.ethereum",a,s)=>{var r,o;if(!n&&!T)return console.warn("Provider is required to create a client."),null;const d=a||c;if(!T||T.transport.name!==i&&n||s!==(null===(r=T.account)||void 0===r?void 0:r.address)&&n||(null==f?void 0:f.id)!==d.id){const a={chain:d,transport:e.custom(n,{name:i})};s&&(a.account=t.toAccount(s)),T=e.createWalletClient(a),f=d,v&&(null===(o=v.chain)||void 0===o?void 0:o.id)!==d.id&&(v=null)}return T})(n,i.name,this.environment.CHAIN,a),this.origin&&this.origin.setViemClient(this.viem),
// TODO: only use one of these
s(this,Ke,"m",nt).call(this,"viem",this.viem),s(this,Ke,"m",nt).call(this,"provider",{provider:n,info:i}),s(this,tt,"f").setItem("camp-sdk:provider",JSON.stringify(i))}
/**
     * Set the wallet address. This is useful for edge cases where the provider can't return the wallet address. Don't use this unless you know what you're doing.
     * @param {string} walletAddress The wallet address.
     * @returns {void}
     */setWalletAddress(e){this.walletAddress=e}
/**
     * Recover the provider from local storage.
     * @returns {Promise<void>}
     */recoverProvider(){return a(this,void 0,void 0,(function*(){var e,t,n,i,a,r,o,d,u,p,l,y,c;if(!this.walletAddress)return void console.warn("No wallet address found in local storage. Please connect your wallet again.");const m=yield s(this,tt,"f").getItem("camp-sdk:provider");if(!m)return;const h=JSON.parse(m);let T;const v=null!==(e=O())&&void 0!==e?e:[];
// first pass: try to find provider by UUID/name and check if it has the right address
// without prompting (using eth_accounts)
for(const e of v)try{if(h.uuid&&(null===(t=e.info)||void 0===t?void 0:t.uuid)===h.uuid||h.name&&(null===(n=e.info)||void 0===n?void 0:n.name)===h.name){
// silently check if the wallet address matches first
const t=yield e.provider.request({method:"eth_accounts"});if(t.length>0&&(null===(i=t[0])||void 0===i?void 0:i.toLowerCase())===(null===(a=this.walletAddress)||void 0===a?void 0:a.toLowerCase())){T=e;break}}}catch(e){console.warn("Failed to fetch accounts from provider:",e)}
// second pass: if no provider found by UUID/name match, try to find by address only
// but still avoid prompting
if(!T)for(const e of v)try{
// skip providers we already checked in the first pass
if(h.uuid&&(null===(r=e.info)||void 0===r?void 0:r.uuid)===h.uuid||h.name&&(null===(o=e.info)||void 0===o?void 0:o.name)===h.name)continue;const t=yield e.provider.request({method:"eth_accounts"});if(t.length>0&&(null===(d=t[0])||void 0===d?void 0:d.toLowerCase())===(null===(u=this.walletAddress)||void 0===u?void 0:u.toLowerCase())){T=e;break}}catch(e){console.warn("Failed to fetch accounts from provider:",e)}
// third pass: if still no provider found and we have UUID/name info,
// try prompting the user (only for the stored provider)
if(!T&&(h.uuid||h.name))for(const e of v)try{if(h.uuid&&(null===(p=e.info)||void 0===p?void 0:p.uuid)===h.uuid||h.name&&(null===(l=e.info)||void 0===l?void 0:l.name)===h.name){const t=yield e.provider.request({method:"eth_requestAccounts"});if(t.length>0&&(null===(y=t[0])||void 0===y?void 0:y.toLowerCase())===(null===(c=this.walletAddress)||void 0===c?void 0:c.toLowerCase())){T=e;break}}}catch(e){console.warn("Failed to reconnect to stored provider:",e)}T?this.setProvider({provider:T.provider,info:T.info||{name:"Unknown"},address:this.walletAddress}):console.warn("No matching provider found for the stored wallet address. Please connect your wallet again.")}))}
/**
     * Disconnect the user.
     * @returns {Promise<void>}
     */disconnect(){return a(this,void 0,void 0,(function*(){this.isAuthenticated&&(s(this,Ke,"m",nt).call(this,"state","unauthenticated"),this.isAuthenticated=!1,this.walletAddress=null,this.userId=null,this.jwt=null,this.origin=null,r(this,et,void 0,"f"),yield s(this,tt,"f").removeItem("camp-sdk:wallet-address"),yield s(this,tt,"f").removeItem("camp-sdk:user-id"),yield s(this,tt,"f").removeItem("camp-sdk:jwt"),yield s(this,tt,"f").removeItem("camp-sdk:environment"))}))}
/**
     * Connect the user's wallet and sign the message.
     * @returns {Promise<{ success: boolean; message: string; walletAddress: string }>} A promise that resolves with the authentication result.
     * @throws {APIError} - Throws an error if the user cannot be authenticated.
     */connect(){return a(this,void 0,void 0,(function*(){s(this,Ke,"m",nt).call(this,"state","loading");try{this.walletAddress||(yield s(this,Ke,"m",at).call(this)),this.walletAddress=e.checksumAddress(this.walletAddress);const t=yield s(this,Ke,"m",st).call(this),n=s(this,Ke,"m",ot).call(this,t),i=yield this.viem.signMessage({account:this.walletAddress,message:n}),a=yield s(this,Ke,"m",rt).call(this,n,i);if(a.success)return this.isAuthenticated=!0,this.userId=a.userId,this.jwt=a.token,this.origin=new dt(this.environment,this.jwt,this.viem,this.baseParentId,this.clientId),yield s(this,tt,"f").setItem("camp-sdk:jwt",this.jwt),yield s(this,tt,"f").setItem("camp-sdk:wallet-address",this.walletAddress),yield s(this,tt,"f").setItem("camp-sdk:user-id",this.userId),yield s(this,tt,"f").setItem("camp-sdk:environment",this.environment.NAME),s(this,Ke,"m",nt).call(this,"state","authenticated"),{success:!0,message:"Successfully authenticated",walletAddress:this.walletAddress};throw this.isAuthenticated=!1,s(this,Ke,"m",nt).call(this,"state","unauthenticated"),new h("Failed to authenticate")}catch(e){throw this.isAuthenticated=!1,s(this,Ke,"m",nt).call(this,"state","unauthenticated"),new h(e)}}))}
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
     */connectWithSigner(t,n){return a(this,void 0,void 0,(function*(){s(this,Ke,"m",nt).call(this,"state","loading");try{r(this,et,p(t),"f"),this.walletAddress=e.checksumAddress(yield s(this,et,"f").getAddress()),
// store the signer as viem client if it's a viem client, otherwise keep adapter
"viem"===s(this,et,"f").type&&(this.viem=t);const i=yield s(this,Ke,"m",st).call(this),a=s(this,Ke,"m",ot).call(this,i,null==n?void 0:n.domain,null==n?void 0:n.uri),o=yield s(this,et,"f").signMessage(a),d=yield s(this,Ke,"m",rt).call(this,a,o);if(d.success)return this.isAuthenticated=!0,this.userId=d.userId,this.jwt=d.token,this.origin=new dt(this.environment,this.jwt,this.viem,this.baseParentId,this.clientId),yield s(this,tt,"f").setItem("camp-sdk:jwt",this.jwt),yield s(this,tt,"f").setItem("camp-sdk:wallet-address",this.walletAddress),yield s(this,tt,"f").setItem("camp-sdk:user-id",this.userId),yield s(this,tt,"f").setItem("camp-sdk:environment",this.environment.NAME),s(this,Ke,"m",nt).call(this,"state","authenticated"),{success:!0,message:"Successfully authenticated",walletAddress:this.walletAddress};throw this.isAuthenticated=!1,s(this,Ke,"m",nt).call(this,"state","unauthenticated"),new h("Failed to authenticate")}catch(e){throw this.isAuthenticated=!1,r(this,et,void 0,"f"),s(this,Ke,"m",nt).call(this,"state","unauthenticated"),new h(e)}}))}
/**
     * Get the user's linked social accounts.
     * @returns {Promise<Record<string, boolean>>} A promise that resolves with the user's linked social accounts.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated or if the request fails.
     * @example
     * const auth = new Auth({ clientId: "your-client-id" });
     * const socials = await auth.getLinkedSocials();
     * console.log(socials);
     */getLinkedSocials(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/client-user/connections-sdk`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"}}).then((e=>e.json()));if(e.isError)throw new h(e.message||"Failed to fetch connections");{const t={};return Object.keys(e.data.data).forEach((n=>{t[n.split("User")[0]]=e.data.data[n]})),t}}))}
/**
     * Link the user's Twitter account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated or in Node.js environment.
     */linkTwitter(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(s(this,Qe,"f"))throw new Error("Social linking requires browser environment for OAuth flow");window.location.href=`${this.environment.AUTH_HUB_BASE_API}/twitter/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.twitter}`}))}
/**
     * Link the user's Discord account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated or in Node.js environment.
     */linkDiscord(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(s(this,Qe,"f"))throw new Error("Social linking requires browser environment for OAuth flow");window.location.href=`${this.environment.AUTH_HUB_BASE_API}/discord/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.discord}`}))}
/**
     * Link the user's Spotify account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated or in Node.js environment.
     */linkSpotify(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(s(this,Qe,"f"))throw new Error("Social linking requires browser environment for OAuth flow");window.location.href=`${this.environment.AUTH_HUB_BASE_API}/spotify/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.spotify}`}))}
/**
     * Link the user's TikTok account.
     * @param {string} handle The user's TikTok handle.
     * @returns {Promise<any>} A promise that resolves with the TikTok account data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */linkTikTok(e){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/tiktok/connect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userHandle:e,clientId:this.clientId,userId:this.userId})}).then((e=>e.json()));if(t.isError)throw"Request failed with status code 502"===t.message?new h("TikTok service is currently unavailable, try again later"):new h(t.message||"Failed to link TikTok account");return t.data}))}
/**
     * Send an OTP to the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @returns {Promise<any>} A promise that resolves with the OTP data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */sendTelegramOTP(e){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!e)throw new h("Phone number is required");yield this.unlinkTelegram();const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/telegram/sendOTP-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:e})}).then((e=>e.json()));if(t.isError)throw new h(t.message||"Failed to send Telegram OTP");return t.data}))}
/**
     * Link the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @param {string} otp The OTP.
     * @param {string} phoneCodeHash The phone code hash.
     * @returns {Promise<object>} A promise that resolves with the Telegram account data.
     * @throws {APIError|Error} - Throws an error if the user is not authenticated. Also throws an error if the phone number, OTP, and phone code hash are not provided.
     */linkTelegram(e,t,n){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!e||!t||!n)throw new h("Phone number, OTP, and phone code hash are required");const i=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/telegram/signIn-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:e,code:t,phone_code_hash:n,userId:this.userId,clientId:this.clientId})}).then((e=>e.json()));if(i.isError)throw new h(i.message||"Failed to link Telegram account");return i.data}))}
/**
     * Unlink the user's Twitter account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTwitter(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/twitter/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new h(e.message||"Failed to unlink Twitter account");return e.data}))}
/**
     * Unlink the user's Discord account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkDiscord(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new h("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/discord/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new h(e.message||"Failed to unlink Discord account");return e.data}))}
/**
     * Unlink the user's Spotify account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkSpotify(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new h("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/spotify/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new h(e.message||"Failed to unlink Spotify account");return e.data}))}
/**
     * Unlink the user's TikTok account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTikTok(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new h("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/tiktok/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((e=>e.json()));if(e.isError)throw new h(e.message||"Failed to unlink TikTok account");return e.data}))}
/**
     * Unlink the user's Telegram account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTelegram(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new h("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/telegram/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((e=>e.json()));if(e.isError)throw new h(e.message||"Failed to unlink Telegram account");return e.data}))}},exports.BrowserStorage=l,exports.CustomSignerAdapter=u,exports.EthersSignerAdapter=d,exports.MemoryStorage=y,exports.Origin=dt,exports.ViemSignerAdapter=o,exports.campMainnet=m,exports.campTestnet=c,exports.createLicenseTerms=(e,t,n,i,a=exports.LicenseType.DURATION_BASED)=>{if(n<N||n>x)throw new Error(`Royalty basis points must be between ${N} and ${x}`);if(a===exports.LicenseType.DURATION_BASED){if(t<R||t>D)throw new Error(`Duration must be between ${R} and ${D} seconds for DURATION_BASED licenses`)}else if((a===exports.LicenseType.SINGLE_PAYMENT||a===exports.LicenseType.X402)&&t>0)throw new Error(`Duration must be 0 for ${exports.LicenseType[a]} licenses`);if(e<P)throw new Error(`Price must be at least ${P} wei`);return{price:e,duration:t,royaltyBps:n,paymentToken:i,licenseType:a}},exports.createNodeWalletClient=function(t,n,i){return e.createWalletClient({account:t,chain:n,transport:e.http(i)})},exports.createSignerAdapter=p;
