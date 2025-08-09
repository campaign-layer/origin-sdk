"use strict";var e=require("viem"),t=require("viem/accounts"),n=require("viem/siwe");
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
function i(e,t,n,i){return new(n||(n=Promise))((function(a,r){function s(e){try{d(i.next(e))}catch(e){r(e)}}function o(e){try{d(i.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?a(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,o)}d((i=i.apply(e,t||[])).next())}))}function a(e,t,n,i){if("a"===n&&!i)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!i:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===n?i:"a"===n?i.call(e):i?i.value:t.get(e)}function r(e,t,n,i,a){if("m"===i)throw new TypeError("Private method is not writable");if("a"===i&&!a)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!a:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===i?a.call(e,n):a?a.value=n:t.set(e,n),n}"function"==typeof SuppressedError&&SuppressedError;class s extends Error{constructor(e,t){super(e),this.name="APIError",this.statusCode=t||500,Error.captureStackTrace(this,this.constructor)}toJSON(){return{error:this.name,message:this.message,statusCode:this.statusCode||500}}}
/**
 * Makes a GET request to the given URL with the provided headers.
 *
 * @param {string} url - The URL to send the GET request to.
 * @param {object} headers - The headers to include in the request.
 * @returns {Promise<object>} - The response data.
 * @throws {APIError} - Throws an error if the request fails.
 */function o(e){return i(this,arguments,void 0,(function*(e,t={}){try{const n=yield fetch(e,{method:"GET",headers:t});if(!n.ok){const e=yield n.json().catch((()=>({})));throw new s(e.message||"API request failed",n.status)}return yield n.json()}catch(e){if(e instanceof s)throw e;throw new s("Network error or server is unavailable",500)}}))}
/**
 * Constructs a query string from an object of query parameters.
 *
 * @param {object} params - An object representing query parameters.
 * @returns {string} - The encoded query string.
 */
/**
 * Builds a complete URL with query parameters.
 *
 * @param {string} baseURL - The base URL of the endpoint.
 * @param {object} params - An object representing query parameters.
 * @returns {string} - The complete URL with query string.
 */
function d(e,t={}){const n=function(e={}){return Object.keys(e).map((t=>`${encodeURIComponent(t)}=${encodeURIComponent(e[t])}`)).join("&")}(t);return n?`${e}?${n}`:e}const u="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/twitter",l="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/spotify";const p={id:123420001114,name:"Basecamp",nativeCurrency:{decimals:18,name:"Camp",symbol:"CAMP"},rpcUrls:{default:{http:["https://rpc-campnetwork.xyz","https://rpc.basecamp.t.raas.gelato.cloud"]}},blockExplorers:{default:{name:"Explorer",url:"https://basecamp.cloud.blockscout.com/"}}};
// @ts-ignore
let c=null,y=null;const h=()=>(y||(y=e.createPublicClient({chain:p,transport:e.http()})),y);var m="Connect with Camp Network",f="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",w={USER_CONNECTED:"ed42542d-b676-4112-b6d9-6db98048b2e0",USER_DISCONNECTED:"20af31ac-e602-442e-9e0e-b589f4dd4016",TWITTER_LINKED:"7fbea086-90ef-4679-ba69-f47f9255b34c",DISCORD_LINKED:"d73f5ae3-a8e8-48f2-8532-85e0c7780d6a",SPOTIFY_LINKED:"fc1788b4-c984-42c8-96f4-c87f6bb0b8f7",TIKTOK_LINKED:"4a2ffdd3-f0e9-4784-8b49-ff76ec1c0a6a",TELEGRAM_LINKED:"9006bc5d-bcc9-4d01-a860-4f1a201e8e47"},T="0xF90733b9eCDa3b49C250B2C3E3E42c96fC93324E",v="0x5c5e6b458b2e3924E7688b8Dee1Bb49088F6Fef5";let b=[];const g=()=>b,I=e=>{function t(t){b.some((e=>e.info.uuid===t.detail.info.uuid))||(b=[...b,t.detail],e(b))}if("undefined"!=typeof window)return window.addEventListener("eip6963:announceProvider",t),window.dispatchEvent(new Event("eip6963:requestProvider")),()=>window.removeEventListener("eip6963:announceProvider",t)};var A=[{inputs:[{internalType:"string",name:"name_",type:"string"},{internalType:"string",name:"symbol_",type:"string"},{internalType:"uint256",name:"maxTermDuration_",type:"uint256"},{internalType:"address",name:"signer_",type:"address"}],stateMutability:"nonpayable",type:"constructor"},{inputs:[],name:"DurationZero",type:"error"},{inputs:[{internalType:"address",name:"sender",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"address",name:"owner",type:"address"}],name:"ERC721IncorrectOwner",type:"error"},{inputs:[{internalType:"address",name:"operator",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"ERC721InsufficientApproval",type:"error"},{inputs:[{internalType:"address",name:"approver",type:"address"}],name:"ERC721InvalidApprover",type:"error"},{inputs:[{internalType:"address",name:"operator",type:"address"}],name:"ERC721InvalidOperator",type:"error"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"ERC721InvalidOwner",type:"error"},{inputs:[{internalType:"address",name:"receiver",type:"address"}],name:"ERC721InvalidReceiver",type:"error"},{inputs:[{internalType:"address",name:"sender",type:"address"}],name:"ERC721InvalidSender",type:"error"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"ERC721NonexistentToken",type:"error"},{inputs:[],name:"EnforcedPause",type:"error"},{inputs:[],name:"ExpectedPause",type:"error"},{inputs:[],name:"InvalidDeadline",type:"error"},{inputs:[],name:"InvalidDuration",type:"error"},{inputs:[{internalType:"uint16",name:"royaltyBps",type:"uint16"}],name:"InvalidRoyalty",type:"error"},{inputs:[],name:"InvalidSignature",type:"error"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"address",name:"caller",type:"address"}],name:"NotTokenOwner",type:"error"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"OwnableInvalidOwner",type:"error"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"OwnableUnauthorizedAccount",type:"error"},{inputs:[],name:"SignatureAlreadyUsed",type:"error"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"TokenAlreadyExists",type:"error"},{inputs:[],name:"Unauthorized",type:"error"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"buyer",type:"address"},{indexed:!1,internalType:"uint32",name:"periods",type:"uint32"},{indexed:!1,internalType:"uint256",name:"newExpiry",type:"uint256"},{indexed:!1,internalType:"uint256",name:"amountPaid",type:"uint256"}],name:"AccessPurchased",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"owner",type:"address"},{indexed:!0,internalType:"address",name:"approved",type:"address"},{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"}],name:"Approval",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"owner",type:"address"},{indexed:!0,internalType:"address",name:"operator",type:"address"},{indexed:!1,internalType:"bool",name:"approved",type:"bool"}],name:"ApprovalForAll",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"}],name:"DataDeleted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"bytes32",name:"contentHash",type:"bytes32"}],name:"DataMinted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"previousOwner",type:"address"},{indexed:!0,internalType:"address",name:"newOwner",type:"address"}],name:"OwnershipTransferred",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Paused",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint256",name:"royaltyAmount",type:"uint256"},{indexed:!1,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"uint256",name:"protocolAmount",type:"uint256"}],name:"RoyaltyPaid",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint128",name:"newPrice",type:"uint128"},{indexed:!1,internalType:"uint32",name:"newDuration",type:"uint32"},{indexed:!1,internalType:"uint16",name:"newRoyaltyBps",type:"uint16"},{indexed:!1,internalType:"address",name:"paymentToken",type:"address"}],name:"TermsUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"from",type:"address"},{indexed:!0,internalType:"address",name:"to",type:"address"},{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"}],name:"Transfer",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Unpaused",type:"event"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"approve",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"balanceOf",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"contentHash",outputs:[{internalType:"bytes32",name:"",type:"bytes32"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"dataStatus",outputs:[{internalType:"enum IpNFT.DataStatus",name:"",type:"uint8"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"finalizeDelete",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"getApproved",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"getTerms",outputs:[{components:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],internalType:"struct IpNFT.LicenseTerms",name:"",type:"tuple"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"owner",type:"address"},{internalType:"address",name:"operator",type:"address"}],name:"isApprovedForAll",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"maxTermDuration",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint256",name:"parentId",type:"uint256"},{internalType:"bytes32",name:"creatorContentHash",type:"bytes32"},{internalType:"string",name:"uri",type:"string"},{components:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],internalType:"struct IpNFT.LicenseTerms",name:"licenseTerms",type:"tuple"},{internalType:"uint256",name:"deadline",type:"uint256"},{internalType:"bytes",name:"signature",type:"bytes"}],name:"mintWithSignature",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"name",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[],name:"owner",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"ownerOf",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"parentIpOf",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"pause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"paused",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"renounceOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint256",name:"salePrice",type:"uint256"}],name:"royaltyInfo",outputs:[{internalType:"address",name:"receiver",type:"address"},{internalType:"uint256",name:"royaltyAmount",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"royaltyPercentages",outputs:[{internalType:"uint16",name:"",type:"uint16"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"royaltyReceivers",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"safeTransferFrom",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"bytes",name:"data",type:"bytes"}],name:"safeTransferFrom",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"operator",type:"address"},{internalType:"bool",name:"approved",type:"bool"}],name:"setApprovalForAll",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_signer",type:"address"}],name:"setSigner",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"signer",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"bytes4",name:"interfaceId",type:"bytes4"}],name:"supportsInterface",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"symbol",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"terms",outputs:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"_tokenId",type:"uint256"}],name:"tokenURI",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"transferFrom",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"newOwner",type:"address"}],name:"transferOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"unpause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"address",name:"_royaltyReceiver",type:"address"},{components:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],internalType:"struct IpNFT.LicenseTerms",name:"newTerms",type:"tuple"}],name:"updateTerms",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes32",name:"",type:"bytes32"}],name:"usedNonces",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"}];
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
 */function k(e,t,n,a,r,s,o,d){return i(this,void 0,void 0,(function*(){return yield this.callContractMethod(T,A,"mintWithSignature",[e,t,n,a,r,s,o,d],{waitForReceipt:!0})}))}
/**
 * Registers a Data NFT with the Origin service in order to obtain a signature for minting.
 * @param source The source of the Data NFT (e.g., "spotify", "twitter", "tiktok", or "file").
 * @param deadline The deadline for the registration operation.
 * @param fileKey Optional file key for file uploads.
 * @return A promise that resolves with the registration data.
 */function C(e,t,n,a,r,s){return i(this,void 0,void 0,(function*(){const i={source:e,deadline:Number(t),licenseTerms:{price:n.price.toString(),duration:n.duration,royaltyBps:n.royaltyBps,paymentToken:n.paymentToken},metadata:a,parentId:Number(s)||0};void 0!==r&&(i.fileKey=r);const o=yield fetch(`${f}/auth/origin/register`,{method:"POST",headers:{Authorization:`Bearer ${this.getJwt()}`},body:JSON.stringify(i)});if(!o.ok)throw new Error(`Failed to get signature: ${o.statusText}`);const d=yield o.json();if(d.isError)throw new Error(`Failed to get signature: ${d.message}`);return d.data}))}function E(e,t,n){return this.callContractMethod(T,A,"updateTerms",[e,t,n],{waitForReceipt:!0})}function M(e){return this.callContractMethod(T,A,"finalizeDelete",[e])}function x(e){return this.callContractMethod(T,A,"getTerms",[e])}function S(e){return this.callContractMethod(T,A,"ownerOf",[e])}function $(e){return this.callContractMethod(T,A,"balanceOf",[e])}function O(e){return this.callContractMethod(T,A,"contentHash",[e])}function F(e){return this.callContractMethod(T,A,"tokenURI",[e])}function j(e){return this.callContractMethod(T,A,"dataStatus",[e])}function P(e,t){return i(this,void 0,void 0,(function*(){return this.callContractMethod(T,A,"royaltyInfo",[e,t])}))}function U(e){return this.callContractMethod(T,A,"getApproved",[e])}function N(e,t){return this.callContractMethod(T,A,"isApprovedForAll",[e,t])}function D(e,t,n){return this.callContractMethod(T,A,"transferFrom",[e,t,n])}function B(e,t,n,i){const a=i?[e,t,n,i]:[e,t,n];return this.callContractMethod(T,A,"safeTransferFrom",a)}function _(e,t){return this.callContractMethod(T,A,"approve",[e,t])}function W(e,t){return this.callContractMethod(T,A,"setApprovalForAll",[e,t])}var R,q,z,L,K,J,H,G,V,X,Z,Y,Q,ee,te,ne=[{inputs:[{internalType:"address",name:"dataNFT_",type:"address"},{internalType:"uint16",name:"protocolFeeBps_",type:"uint16"},{internalType:"address",name:"treasury_",type:"address"}],stateMutability:"nonpayable",type:"constructor"},{inputs:[],name:"EnforcedPause",type:"error"},{inputs:[],name:"ExpectedPause",type:"error"},{inputs:[{internalType:"uint256",name:"expected",type:"uint256"},{internalType:"uint256",name:"actual",type:"uint256"}],name:"InvalidPayment",type:"error"},{inputs:[{internalType:"uint32",name:"periods",type:"uint32"}],name:"InvalidPeriods",type:"error"},{inputs:[{internalType:"uint16",name:"royaltyBps",type:"uint16"}],name:"InvalidRoyalty",type:"error"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"OwnableInvalidOwner",type:"error"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"OwnableUnauthorizedAccount",type:"error"},{inputs:[],name:"TransferFailed",type:"error"},{inputs:[],name:"Unauthorized",type:"error"},{inputs:[],name:"ZeroAddress",type:"error"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"buyer",type:"address"},{indexed:!1,internalType:"uint32",name:"periods",type:"uint32"},{indexed:!1,internalType:"uint256",name:"newExpiry",type:"uint256"},{indexed:!1,internalType:"uint256",name:"amountPaid",type:"uint256"}],name:"AccessPurchased",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"}],name:"DataDeleted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"bytes32",name:"contentHash",type:"bytes32"}],name:"DataMinted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"previousOwner",type:"address"},{indexed:!0,internalType:"address",name:"newOwner",type:"address"}],name:"OwnershipTransferred",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Paused",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint256",name:"royaltyAmount",type:"uint256"},{indexed:!1,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"uint256",name:"protocolAmount",type:"uint256"}],name:"RoyaltyPaid",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint128",name:"newPrice",type:"uint128"},{indexed:!1,internalType:"uint32",name:"newDuration",type:"uint32"},{indexed:!1,internalType:"uint16",name:"newRoyaltyBps",type:"uint16"},{indexed:!1,internalType:"address",name:"paymentToken",type:"address"}],name:"TermsUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Unpaused",type:"event"},{inputs:[{internalType:"address",name:"feeManager",type:"address"}],name:"addFeeManager",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"buyer",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint32",name:"periods",type:"uint32"}],name:"buyAccess",outputs:[],stateMutability:"payable",type:"function"},{inputs:[],name:"dataNFT",outputs:[{internalType:"contract IpNFT",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"}],name:"feeManagers",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"user",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"hasAccess",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"owner",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"pause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"paused",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"protocolFeeBps",outputs:[{internalType:"uint16",name:"",type:"uint16"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"feeManager",type:"address"}],name:"removeFeeManager",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"renounceOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"},{internalType:"address",name:"",type:"address"}],name:"subscriptionExpiry",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"newOwner",type:"address"}],name:"transferOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"treasury",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"unpause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint16",name:"newFeeBps",type:"uint16"}],name:"updateProtocolFee",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"newTreasury",type:"address"}],name:"updateTreasury",outputs:[],stateMutability:"nonpayable",type:"function"},{stateMutability:"payable",type:"receive"}];function ie(e,t,n,i){return this.callContractMethod(v,ne,"buyAccess",[e,t,n],{waitForReceipt:!0,value:i})}function ae(e,t,n,i){return this.callContractMethod(v,ne,"renewAccess",[e,t,n],void 0!==i?{value:i}:void 0)}function re(e,t){return this.callContractMethod(v,ne,"hasAccess",[e,t])}function se(e,t){return this.callContractMethod(v,ne,"subscriptionExpiry",[e,t])}
/**
 * Approves a spender to spend a specified amount of tokens on behalf of the owner.
 * If the current allowance is less than the specified amount, it will perform the approval.
 * @param {ApproveParams} params - The parameters for the approval.
 */
/**
 * The Origin class
 * Handles the upload of files to Origin, as well as querying the user's stats
 */
class oe{constructor(e,t){R.add(this),q.set(this,(e=>i(this,void 0,void 0,(function*(){const t=yield fetch(`${f}/auth/origin/upload-url`,{method:"POST",body:JSON.stringify({name:e.name,type:e.type}),headers:{Authorization:`Bearer ${this.jwt}`}}),n=yield t.json();return n.isError?n.message:n.data})))),z.set(this,((e,t)=>i(this,void 0,void 0,(function*(){(yield fetch(`${f}/auth/origin/update-status`,{method:"PATCH",body:JSON.stringify({status:t,fileKey:e}),headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}})).ok||console.error("Failed to update origin status")})))),this.uploadFile=(e,t)=>i(this,void 0,void 0,(function*(){const n=yield a(this,q,"f").call(this,e);if(n){try{yield((e,t,n)=>new Promise(((i,a)=>{
// Try to use XMLHttpRequest for progress tracking if available
if("undefined"!=typeof XMLHttpRequest&&"function"==typeof n){const r=new XMLHttpRequest;r.upload.addEventListener("progress",(e=>{if(e.lengthComputable){const t=e.loaded/e.total*100;n(t)}})),r.addEventListener("load",(()=>{r.status>=200&&r.status<300?i(r.responseText||"Upload successful"):a(new Error(`Upload failed with status ${r.status}`))})),r.addEventListener("error",(()=>{a(new Error("Upload failed due to network error"))})),r.open("PUT",t),r.setRequestHeader("Content-Type",e.type),r.send(e)}else
// Fallback to fetch for React Native or environments without XMLHttpRequest
fetch(t,{method:"PUT",headers:{"Content-Type":e.type},body:e}).then((e=>{if(!e.ok)throw new Error(`Upload failed with status ${e.status}`);return e.text()})).then((e=>{i(e||"Upload successful")})).catch((e=>{const t=(null==e?void 0:e.message)||"Upload failed";a(new Error(t))}))})))(e,n.url,(null==t?void 0:t.progressCallback)||(()=>{}))}catch(e){throw yield a(this,z,"f").call(this,n.key,"failed"),new Error("Failed to upload file: "+e)}return yield a(this,z,"f").call(this,n.key,"success"),n}console.error("Failed to generate upload URL")})),this.mintFile=(e,t,n,a,r)=>i(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");const i=yield this.uploadFile(e,r);if(!i||!i.key)throw new Error("Failed to upload file or get upload info.");const s=BigInt(Math.floor(Date.now()/1e3)+600),o=yield this.registerIpNFT("file",s,n,t,i.key,a),{tokenId:d,signerAddress:u,creatorContentHash:l,signature:p,uri:c}=o;// 10 minutes from now
if(!(d&&u&&l&&void 0!==p&&c))throw new Error("Failed to register IpNFT: Missing required fields in registration response.");const[y]=yield this.viemClient.request({method:"eth_requestAccounts",params:[]}),h=yield this.mintWithSignature(y,d,a||BigInt(0),l,c,n,s,p);if("0x1"!==h.status)throw new Error(`Minting failed with status: ${h.status}`);return d.toString()})),this.mintSocial=(e,t,n)=>i(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");const i=BigInt(Math.floor(Date.now()/1e3)+600),a=yield this.registerIpNFT(e,i,n,t),{tokenId:r,signerAddress:s,creatorContentHash:o,signature:d,uri:u}=a;// 10 minutes from now
if(!(r&&s&&o&&void 0!==d&&u))throw new Error("Failed to register Social IpNFT: Missing required fields in registration response.");const[l]=yield this.viemClient.request({method:"eth_requestAccounts",params:[]}),p=yield this.mintWithSignature(l,r,BigInt(0),// parentId is not applicable for social IpNFTs
o,u,n,i,d);if("0x1"!==p.status)throw new Error(`Minting Social IpNFT failed with status: ${p.status}`);return r.toString()})),this.getOriginUploads=()=>i(this,void 0,void 0,(function*(){const e=yield fetch(`${f}/auth/origin/files`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`}});if(!e.ok)return console.error("Failed to get origin uploads"),null;return(yield e.json()).data})),this.jwt=e,this.viemClient=t,
// DataNFT methods
this.mintWithSignature=k.bind(this),this.registerIpNFT=C.bind(this),this.updateTerms=E.bind(this),this.requestDelete=M.bind(this),this.getTerms=x.bind(this),this.ownerOf=S.bind(this),this.balanceOf=$.bind(this),this.contentHash=O.bind(this),this.tokenURI=F.bind(this),this.dataStatus=j.bind(this),this.royaltyInfo=P.bind(this),this.getApproved=U.bind(this),this.isApprovedForAll=N.bind(this),this.transferFrom=D.bind(this),this.safeTransferFrom=B.bind(this),this.approve=_.bind(this),this.setApprovalForAll=W.bind(this),
// Marketplace methods
this.buyAccess=ie.bind(this),this.renewAccess=ae.bind(this),this.hasAccess=re.bind(this),this.subscriptionExpiry=se.bind(this)}getJwt(){return this.jwt}setViemClient(e){this.viemClient=e}
/**
     * Get the user's Origin stats (multiplier, consent, usage, etc.).
     * @returns {Promise<OriginUsageReturnType>} A promise that resolves with the user's Origin stats.
     */getOriginUsage(){return i(this,void 0,void 0,(function*(){const e=yield fetch(`${f}/auth/origin/usage`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"}}).then((e=>e.json()));if(!e.isError&&e.data.user)return e;throw new s(e.message||"Failed to fetch Origin usage")}))}
/**
     * Set the user's consent for Origin usage.
     * @param {boolean} consent The user's consent.
     * @returns {Promise<void>}
     * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the consent is not provided.
     */setOriginConsent(e){return i(this,void 0,void 0,(function*(){if(void 0===e)throw new s("Consent is required");const t=yield fetch(`${f}/auth/origin/status`,{method:"PATCH",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"},body:JSON.stringify({active:e})}).then((e=>e.json()));if(t.isError)throw new s(t.message||"Failed to set Origin consent")}))}
/**
     * Set the user's Origin multiplier.
     * @param {number} multiplier The user's Origin multiplier.
     * @returns {Promise<void>}
     * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the multiplier is not provided.
     */setOriginMultiplier(e){return i(this,void 0,void 0,(function*(){if(void 0===e)throw new s("Multiplier is required");const t=yield fetch(`${f}/auth/origin/multiplier`,{method:"PATCH",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"},body:JSON.stringify({multiplier:e})}).then((e=>e.json()));if(t.isError)throw new s(t.message||"Failed to set Origin multiplier")}))}
/**
     * Call a contract method.
     * @param {string} contractAddress The contract address.
     * @param {Abi} abi The contract ABI.
     * @param {string} methodName The method name.
     * @param {any[]} params The method parameters.
     * @param {CallOptions} [options] The call options.
     * @returns {Promise<any>} A promise that resolves with the result of the contract call or transaction hash.
     * @throws {Error} - Throws an error if the wallet client is not connected and the method is not a view function.
     */callContractMethod(t,n,r,s){return i(this,arguments,void 0,(function*(t,n,i,r,s={}){const o=e.getAbiItem({abi:n,name:i}),d=o&&"stateMutability"in o&&("view"===o.stateMutability||"pure"===o.stateMutability);if(!d&&!this.viemClient)throw new Error("WalletClient not connected.");if(d){const e=h();return(yield e.readContract({address:t,abi:n,functionName:i,args:r}))||null}{const[o]=yield this.viemClient.request({method:"eth_requestAccounts",params:[]}),d=e.encodeFunctionData({abi:n,functionName:i,args:r});yield a(this,R,"m",K).call(this,p);try{const e=yield this.viemClient.sendTransaction({to:t,data:d,account:o,value:s.value,gas:s.gas});if("string"!=typeof e)throw new Error("Transaction failed to send.");if(!s.waitForReceipt)return e;return yield a(this,R,"m",L).call(this,e)}catch(e){throw console.error("Transaction failed:",e),new Error("Transaction failed: "+e)}}}))}
/**
     * Buy access to an asset by first checking its price via getTerms, then calling buyAccess.
     * @param {bigint} tokenId The token ID of the asset.
     * @param {number} periods The number of periods to buy access for.
     * @returns {Promise<any>} The result of the buyAccess call.
     */buyAccessSmart(t,n){return i(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");const a=yield this.getTerms(t);if(!a)throw new Error("Failed to fetch terms for asset");const{price:r,paymentToken:s}=a;if(void 0===r||void 0===s)throw new Error("Terms missing price or paymentToken");const[o]=yield this.viemClient.request({method:"eth_requestAccounts",params:[]}),d=r*BigInt(n);return s===e.zeroAddress?this.buyAccess(o,t,n,d):(yield function(t){return i(this,arguments,void 0,(function*({walletClient:t,publicClient:n,tokenAddress:i,owner:a,spender:r,amount:s}){(yield n.readContract({address:i,abi:e.erc20Abi,functionName:"allowance",args:[a,r]}))<s&&(yield t.writeContract({address:i,account:a,abi:e.erc20Abi,functionName:"approve",args:[r,s],chain:p}))}))}({walletClient:this.viemClient,publicClient:h(),tokenAddress:s,owner:o,spender:v,amount:d}),this.buyAccess(o,t,n))}))}getData(e){return i(this,void 0,void 0,(function*(){const t=yield fetch(`${f}/auth/origin/data/${e}`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!t.ok)throw new Error("Failed to fetch data");return t.json()}))}}q=new WeakMap,z=new WeakMap,R=new WeakSet,L=function(e){return i(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");for(;;){const t=yield this.viemClient.request({method:"eth_getTransactionReceipt",params:[e]});if(t&&t.blockNumber)return t;yield new Promise((e=>setTimeout(e,1e3)))}}))},K=function(e){return i(this,void 0,void 0,(function*(){
// return;
if(!this.viemClient)throw new Error("WalletClient not connected.");let t=yield this.viemClient.request({method:"eth_chainId",params:[]});if("string"==typeof t&&(t=parseInt(t,16)),t!==e.id)try{yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16)}]})}catch(t){
// Unrecognized chain
if(4902!==t.code)throw t;yield this.viemClient.request({method:"wallet_addEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16),chainName:e.name,rpcUrls:e.rpcUrls.default.http,nativeCurrency:e.nativeCurrency}]}),yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16)}]})}}))};H=new WeakMap,G=new WeakMap,J=new WeakSet,V=function(e,t){a(this,H,"f")[e]&&a(this,H,"f")[e].forEach((e=>e(t)))},X=function(e){return i(this,void 0,void 0,(function*(){if("undefined"==typeof localStorage)return;const t=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:wallet-address"),n=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:user-id"),i=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:jwt");t&&n&&i?(this.walletAddress=t,this.userId=n,this.jwt=i,this.origin=new oe(this.jwt),this.isAuthenticated=!0,
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
e&&this.setProvider({provider:e.provider,info:e.info||{name:"Unknown"},address:t})):this.isAuthenticated=!1}))},Z=function(){return i(this,void 0,void 0,(function*(){try{const[t]=yield this.viem.requestAddresses();return this.walletAddress=e.checksumAddress(t),this.walletAddress}catch(e){throw new s(e)}}))},Y=function(){return i(this,void 0,void 0,(function*(){try{const e=yield fetch(`${f}/auth/client-user/nonce`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({walletAddress:this.walletAddress})}),t=yield e.json();return 200!==e.status?Promise.reject(t.message||"Failed to fetch nonce"):t.data}catch(e){throw new Error(e)}}))},Q=function(e,t){return i(this,void 0,void 0,(function*(){try{const n=yield fetch(`${f}/auth/client-user/verify`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({message:e,signature:t,walletAddress:this.walletAddress})}),i=yield n.json(),a=i.data.split(".")[1],r=JSON.parse(atob(a));return{success:!i.isError,userId:r.id,token:i.data}}catch(e){throw new s(e)}}))},ee=function(e){return n.createSiweMessage({domain:window.location.host,address:this.walletAddress,statement:m,uri:window.location.origin,version:"1",chainId:this.viem.chain.id,nonce:e})},te=function(e,t){return i(this,arguments,void 0,(function*(e,t,n=1){
// if (this.#ackeeInstance)
//   await sendAnalyticsEvent(this.#ackeeInstance, event, message, count);
// else return;
}))},exports.Auth=
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
     * @param {boolean} [options.allowAnalytics=true] Whether to allow analytics to be sent.
     * @param {object} [options.ackeeInstance] The Ackee instance.
     * @throws {APIError} - Throws an error if the clientId is not provided.
     */
constructor({clientId:e,redirectUri:t,allowAnalytics:n=!0,ackeeInstance:i}){if(J.add(this),H.set(this,void 0),G.set(this,void 0),!e)throw new Error("clientId is required");this.viem=null,
// if (typeof window !== "undefined") {
//   if (window.ethereum) this.viem = getClient(window.ethereum);
// }
this.redirectUri=(e=>{const t=["twitter","discord","spotify"];return"object"==typeof e?t.reduce(((t,n)=>(t[n]=e[n]||("undefined"!=typeof window?window.location.href:""),t)),{}):"string"==typeof e?t.reduce(((t,n)=>(t[n]=e,t)),{}):e?{}:t.reduce(((e,t)=>(e[t]="undefined"!=typeof window?window.location.href:"",e)),{})})(t),i&&r(this,G,i,"f"),n&&a(this,G,"f"),this.clientId=e,this.isAuthenticated=!1,this.jwt=null,this.origin=null,this.walletAddress=null,this.userId=null,r(this,H,{},"f"),I((e=>{a(this,J,"m",V).call(this,"providers",e)})),a(this,J,"m",X).call(this)}
/**
     * Subscribe to an event. Possible events are "state", "provider", "providers", and "viem".
     * @param {("state"|"provider"|"providers"|"viem")} event The event.
     * @param {function} callback The callback function.
     * @returns {void}
     * @example
     * auth.on("state", (state) => {
     *  console.log(state);
     * });
     */on(e,t){a(this,H,"f")[e]||(a(this,H,"f")[e]=[]),a(this,H,"f")[e].push(t),"providers"===e&&t(g())}
/**
     * Set the loading state.
     * @param {boolean} loading The loading state.
     * @returns {void}
     */setLoading(e){a(this,J,"m",V).call(this,"state",e?"loading":this.isAuthenticated?"authenticated":"unauthenticated")}
/**
     * Set the provider. This is useful for setting the provider when the user selects a provider from the UI or when dApp wishes to use a specific provider.
     * @param {object} options The options object. Includes the provider and the provider info.
     * @returns {void}
     * @throws {APIError} - Throws an error if the provider is not provided.
     */setProvider({provider:n,info:i,address:r}){if(!n)throw new s("provider is required");this.viem=((n,i="window.ethereum",a)=>{var r;if(!n&&!c)return console.warn("Provider is required to create a client."),null;if(!c||c.transport.name!==i&&n||a!==(null===(r=c.account)||void 0===r?void 0:r.address)&&n){const r={chain:p,transport:e.custom(n,{name:i})};a&&(r.account=t.toAccount(a)),c=e.createWalletClient(r)}return c})(n,i.name,r),this.origin&&this.origin.setViemClient(this.viem),
// TODO: only use one of these
a(this,J,"m",V).call(this,"viem",this.viem),a(this,J,"m",V).call(this,"provider",{provider:n,info:i})}
/**
     * Set the wallet address. This is useful for edge cases where the provider can't return the wallet address. Don't use this unless you know what you're doing.
     * @param {string} walletAddress The wallet address.
     * @returns {void}
     */setWalletAddress(e){this.walletAddress=e}recoverProvider(){return i(this,void 0,void 0,(function*(){var e,t,n;if(!this.walletAddress)return void console.warn("No wallet address found in local storage. Please connect your wallet again.");let i;const a=null!==(e=g())&&void 0!==e?e:[];for(const e of a)try{if((null===(t=(yield e.provider.request({method:"eth_requestAccounts"}))[0])||void 0===t?void 0:t.toLowerCase())===(null===(n=this.walletAddress)||void 0===n?void 0:n.toLowerCase())){i=e;break}}catch(e){console.warn("Failed to fetch accounts from provider:",e)}i?this.setProvider({provider:i.provider,info:i.info||{name:"Unknown"},address:this.walletAddress}):console.warn("No matching provider found for the stored wallet address. Please connect your wallet again.")}))}
/**
     * Disconnect the user.
     * @returns {Promise<void>}
     */disconnect(){return i(this,void 0,void 0,(function*(){this.isAuthenticated&&(a(this,J,"m",V).call(this,"state","unauthenticated"),this.isAuthenticated=!1,this.walletAddress=null,this.userId=null,this.jwt=null,this.origin=null,localStorage.removeItem("camp-sdk:wallet-address"),localStorage.removeItem("camp-sdk:user-id"),localStorage.removeItem("camp-sdk:jwt"))}))}
/**
     * Connect the user's wallet and sign the message.
     * @returns {Promise<{ success: boolean; message: string; walletAddress: string }>} A promise that resolves with the authentication result.
     * @throws {APIError} - Throws an error if the user cannot be authenticated.
     */connect(){return i(this,void 0,void 0,(function*(){a(this,J,"m",V).call(this,"state","loading");try{this.walletAddress||(yield a(this,J,"m",Z).call(this)),this.walletAddress=e.checksumAddress(this.walletAddress);const t=yield a(this,J,"m",Y).call(this),n=a(this,J,"m",ee).call(this,t),i=yield this.viem.signMessage({account:this.walletAddress,message:n}),r=yield a(this,J,"m",Q).call(this,n,i);if(r.success)return this.isAuthenticated=!0,this.userId=r.userId,this.jwt=r.token,this.origin=new oe(this.jwt,this.viem),localStorage.setItem("camp-sdk:jwt",this.jwt),localStorage.setItem("camp-sdk:wallet-address",this.walletAddress),localStorage.setItem("camp-sdk:user-id",this.userId),a(this,J,"m",V).call(this,"state","authenticated"),yield a(this,J,"m",te).call(this,w.USER_CONNECTED,"User Connected"),{success:!0,message:"Successfully authenticated",walletAddress:this.walletAddress};throw this.isAuthenticated=!1,a(this,J,"m",V).call(this,"state","unauthenticated"),new s("Failed to authenticate")}catch(e){throw this.isAuthenticated=!1,a(this,J,"m",V).call(this,"state","unauthenticated"),new s(e)}}))}
/**
     * Get the user's linked social accounts.
     * @returns {Promise<Record<string, boolean>>} A promise that resolves with the user's linked social accounts.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated or if the request fails.
     * @example
     * const auth = new Auth({ clientId: "your-client-id" });
     * const socials = await auth.getLinkedSocials();
     * console.log(socials);
     */getLinkedSocials(){return i(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${f}/auth/client-user/connections-sdk`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"}}).then((e=>e.json()));if(e.isError)throw new s(e.message||"Failed to fetch connections");{const t={};return Object.keys(e.data.data).forEach((n=>{t[n.split("User")[0]]=e.data.data[n]})),t}}))}
/**
     * Link the user's Twitter account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkTwitter(){return i(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");
// await this.#sendAnalyticsEvent(
//   constants.ACKEE_EVENTS.TWITTER_LINKED,
//   "Twitter Linked"
// );
window.location.href=`${f}/twitter/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.twitter}`}))}
/**
     * Link the user's Discord account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkDiscord(){return i(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");
// await this.#sendAnalyticsEvent(
//   constants.ACKEE_EVENTS.DISCORD_LINKED,
//   "Discord Linked"
// );
window.location.href=`${f}/discord/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.discord}`}))}
/**
     * Link the user's Spotify account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkSpotify(){return i(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");
// await this.#sendAnalyticsEvent(
//   constants.ACKEE_EVENTS.SPOTIFY_LINKED,
//   "Spotify Linked"
// );
window.location.href=`${f}/spotify/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.spotify}`}))}
/**
     * Link the user's TikTok account.
     * @param {string} handle The user's TikTok handle.
     * @returns {Promise<any>} A promise that resolves with the TikTok account data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */linkTikTok(e){return i(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const t=yield fetch(`${f}/tiktok/connect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userHandle:e,clientId:this.clientId,userId:this.userId})}).then((e=>e.json()));if(t.isError)throw"Request failed with status code 502"===t.message?new s("TikTok service is currently unavailable, try again later"):new s(t.message||"Failed to link TikTok account");return a(this,J,"m",te).call(this,w.TIKTOK_LINKED,"TikTok Linked"),t.data}))}
/**
     * Send an OTP to the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @returns {Promise<any>} A promise that resolves with the OTP data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */sendTelegramOTP(e){return i(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!e)throw new s("Phone number is required");yield this.unlinkTelegram();const t=yield fetch(`${f}/telegram/sendOTP-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:e})}).then((e=>e.json()));if(t.isError)throw new s(t.message||"Failed to send Telegram OTP");return t.data}))}
/**
     * Link the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @param {string} otp The OTP.
     * @param {string} phoneCodeHash The phone code hash.
     * @returns {Promise<object>} A promise that resolves with the Telegram account data.
     * @throws {APIError|Error} - Throws an error if the user is not authenticated. Also throws an error if the phone number, OTP, and phone code hash are not provided.
     */linkTelegram(e,t,n){return i(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!e||!t||!n)throw new s("Phone number, OTP, and phone code hash are required");const i=yield fetch(`${f}/telegram/signIn-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:e,code:t,phone_code_hash:n,userId:this.userId,clientId:this.clientId})}).then((e=>e.json()));if(i.isError)throw new s(i.message||"Failed to link Telegram account");return a(this,J,"m",te).call(this,w.TELEGRAM_LINKED,"Telegram Linked"),i.data}))}
/**
     * Unlink the user's Twitter account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTwitter(){return i(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${f}/twitter/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new s(e.message||"Failed to unlink Twitter account");return e.data}))}
/**
     * Unlink the user's Discord account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkDiscord(){return i(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new s("User needs to be authenticated");const e=yield fetch(`${f}/discord/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new s(e.message||"Failed to unlink Discord account");return e.data}))}
/**
     * Unlink the user's Spotify account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkSpotify(){return i(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new s("User needs to be authenticated");const e=yield fetch(`${f}/spotify/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new s(e.message||"Failed to unlink Spotify account");return e.data}))}
/**
     * Unlink the user's TikTok account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTikTok(){return i(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new s("User needs to be authenticated");const e=yield fetch(`${f}/tiktok/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((e=>e.json()));if(e.isError)throw new s(e.message||"Failed to unlink TikTok account");return e.data}))}
/**
     * Unlink the user's Telegram account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTelegram(){return i(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new s("User needs to be authenticated");const e=yield fetch(`${f}/telegram/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((e=>e.json()));if(e.isError)throw new s(e.message||"Failed to unlink Telegram account");return e.data}))}},exports.SpotifyAPI=
/**
 * The SpotifyAPI class.
 * @class
 */
class{
/**
     * Constructor for the SpotifyAPI class.
     * @constructor
     * @param {SpotifyAPIOptions} options - The Spotify API options.
     * @param {string} options.apiKey - The Spotify API key.
     * @throws {Error} - Throws an error if the API key is not provided.
     */
constructor(e){this.apiKey=e.apiKey}
/**
     * Fetch the user's saved tracks by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved tracks.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedTracksById(e){return i(this,void 0,void 0,(function*(){const t=d(`${l}/save-tracks`,{spotifyId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the played tracks of a user by Spotify ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The played tracks.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchPlayedTracksById(e){return i(this,void 0,void 0,(function*(){const t=d(`${l}/played-tracks`,{spotifyId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the user's saved albums by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved albums.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedAlbumsById(e){return i(this,void 0,void 0,(function*(){const t=d(`${l}/saved-albums`,{spotifyId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the user's saved playlists by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved playlists.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedPlaylistsById(e){return i(this,void 0,void 0,(function*(){const t=d(`${l}/saved-playlists`,{spotifyId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the tracks of an album by album ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} albumId - The album ID.
     * @returns {Promise<object>} - The tracks in the album.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInAlbum(e,t){return i(this,void 0,void 0,(function*(){const n=d(`${l}/album/tracks`,{spotifyId:e,albumId:t});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch the tracks in a playlist by playlist ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} playlistId - The playlist ID.
     * @returns {Promise<object>} - The tracks in the playlist.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInPlaylist(e,t){return i(this,void 0,void 0,(function*(){const n=d(`${l}/playlist/tracks`,{spotifyId:e,playlistId:t});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch the user's Spotify data by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @returns {Promise<object>} - The user's Spotify data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(e){return i(this,void 0,void 0,(function*(){const t=d(`${l}/wallet-spotify-data`,{walletAddress:e});return this._fetchDataWithAuth(t)}))}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(e){return i(this,void 0,void 0,(function*(){if(!this.apiKey)throw new s("API key is required for fetching data",401);try{return yield o(e,{"x-api-key":this.apiKey})}catch(e){throw new s(e.message,e.statusCode)}}))}},exports.TwitterAPI=
/**
 * The TwitterAPI class.
 * @class
 * @classdesc The TwitterAPI class is used to interact with the Twitter API.
 */
class{
/**
     * Constructor for the TwitterAPI class.
     * @param {object} options - The options object.
     * @param {string} options.apiKey - The API key. (Needed for data fetching)
     */
constructor({apiKey:e}){this.apiKey=e}
/**
     * Fetch Twitter user details by username.
     * @param {string} twitterUserName - The Twitter username.
     * @returns {Promise<object>} - The user details.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByUsername(e){return i(this,void 0,void 0,(function*(){const t=d(`${u}/user`,{twitterUserName:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetsByUsername(e){return i(this,arguments,void 0,(function*(e,t=1,n=10){const i=d(`${u}/tweets`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch followers by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The followers.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowersByUsername(e){return i(this,arguments,void 0,(function*(e,t=1,n=10){const i=d(`${u}/followers`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch following by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The following.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowingByUsername(e){return i(this,arguments,void 0,(function*(e,t=1,n=10){const i=d(`${u}/following`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch tweet by tweet ID.
     * @param {string} tweetId - The tweet ID.
     * @returns {Promise<object>} - The tweet.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetById(e){return i(this,void 0,void 0,(function*(){const t=d(`${u}/getTweetById`,{tweetId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch user by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The user data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(e){return i(this,arguments,void 0,(function*(e,t=1,n=10){const i=d(`${u}/wallet-twitter-data`,{walletAddress:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch reposted tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The reposted tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepostedByUsername(e){return i(this,arguments,void 0,(function*(e,t=1,n=10){const i=d(`${u}/reposted`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch replies by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The replies.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepliesByUsername(e){return i(this,arguments,void 0,(function*(e,t=1,n=10){const i=d(`${u}/replies`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch likes by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The likes.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchLikesByUsername(e){return i(this,arguments,void 0,(function*(e,t=1,n=10){const i=d(`${u}/event/likes/${e}`,{page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch follows by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The follows.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowsByUsername(e){return i(this,arguments,void 0,(function*(e,t=1,n=10){const i=d(`${u}/event/follows/${e}`,{page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch viewed tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The viewed tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchViewedTweetsByUsername(e){return i(this,arguments,void 0,(function*(e,t=1,n=10){const i=d(`${u}/event/viewed-tweets/${e}`,{page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(e){return i(this,void 0,void 0,(function*(){if(!this.apiKey)throw new s("API key is required for fetching data",401);try{return yield o(e,{"x-api-key":this.apiKey})}catch(e){throw new s(e.message,e.statusCode)}}))}};
