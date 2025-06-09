"use strict";var e=require("axios"),t=require("viem"),n=require("viem/accounts"),i=require("viem/siwe");
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
function a(e,t,n,i){return new(n||(n=Promise))((function(a,r){function s(e){try{d(i.next(e))}catch(e){r(e)}}function o(e){try{d(i.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?a(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,o)}d((i=i.apply(e,t||[])).next())}))}function r(e,t,n,i){if("a"===n&&!i)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!i:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===n?i:"a"===n?i.call(e):i?i.value:t.get(e)}function s(e,t,n,i,a){if("m"===i)throw new TypeError("Private method is not writable");if("a"===i&&!a)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!a:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===i?a.call(e,n):a?a.value=n:t.set(e,n),n}"function"==typeof SuppressedError&&SuppressedError;class o extends Error{constructor(e,t){super(e),this.name="APIError",this.statusCode=t||500,Error.captureStackTrace(this,this.constructor)}toJSON(){return{error:this.name,message:this.message,statusCode:this.statusCode||500}}}
/**
 * Makes a GET request to the given URL with the provided headers.
 *
 * @param {string} url - The URL to send the GET request to.
 * @param {object} headers - The headers to include in the request.
 * @returns {Promise<object>} - The response data.
 * @throws {APIError} - Throws an error if the request fails.
 */function d(t){return a(this,arguments,void 0,(function*(t,n={}){try{return(yield e.get(t,{headers:n})).data}catch(e){if(e.response)throw new o(e.response.data.message||"API request failed",e.response.status);throw new o("Network error or server is unavailable",500)}}))}
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
function u(e,t={}){const n=function(e={}){return Object.keys(e).map((t=>`${encodeURIComponent(t)}=${encodeURIComponent(e[t])}`)).join("&")}(t);return n?`${e}?${n}`:e}const p="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/twitter",l="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/spotify";const y={id:123420001114,name:"Basecamp",nativeCurrency:{decimals:18,name:"Camp",symbol:"CAMP"},rpcUrls:{default:{http:["https://rpc-campnetwork.xyz","https://rpc.basecamp.t.raas.gelato.cloud"]}},blockExplorers:{default:{name:"Explorer",url:"https://basecamp.cloud.blockscout.com/"}}};
// @ts-ignore
let c=null,h=null;const m=()=>(h||(h=t.createPublicClient({chain:y,transport:t.http()})),h);var f="Connect with Camp Network",w="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",T={USER_CONNECTED:"ed42542d-b676-4112-b6d9-6db98048b2e0",USER_DISCONNECTED:"20af31ac-e602-442e-9e0e-b589f4dd4016",TWITTER_LINKED:"7fbea086-90ef-4679-ba69-f47f9255b34c",DISCORD_LINKED:"d73f5ae3-a8e8-48f2-8532-85e0c7780d6a",SPOTIFY_LINKED:"fc1788b4-c984-42c8-96f4-c87f6bb0b8f7",TIKTOK_LINKED:"4a2ffdd3-f0e9-4784-8b49-ff76ec1c0a6a",TELEGRAM_LINKED:"9006bc5d-bcc9-4d01-a860-4f1a201e8e47"},v="0xd064817Dc0Af032c3fb5dd4671fd10E0a5F0515D",b="0x3B782d053de8910cC0EF3DC09EEA055229a70c6b";let g=[];const I=()=>g,k=e=>{function t(t){g.some((e=>e.info.uuid===t.detail.info.uuid))||(g=[...g,t.detail],e(g))}if("undefined"!=typeof window)return window.addEventListener("eip6963:announceProvider",t),window.dispatchEvent(new Event("eip6963:requestProvider")),()=>window.removeEventListener("eip6963:announceProvider",t)};var A=[{type:"constructor",inputs:[{name:"_name",type:"string",internalType:"string"},{name:"_symbol",type:"string",internalType:"string"},{name:"_baseURI",type:"string",internalType:"string"}],stateMutability:"nonpayable"},{type:"function",name:"addCreator",inputs:[{name:"creator",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"addPauser",inputs:[{name:"pauser",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"approve",inputs:[{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"balanceOf",inputs:[{name:"owner_",type:"address",internalType:"address"}],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"baseURI",inputs:[],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"contentHash",inputs:[{name:"",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"bytes32",internalType:"bytes32"}],stateMutability:"view"},{type:"function",name:"creators",inputs:[{name:"",type:"address",internalType:"address"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"dataStatus",inputs:[{name:"",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"uint8",internalType:"enum DataNFT.DataStatus"}],stateMutability:"view"},{type:"function",name:"finalizeDelete",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"getApproved",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"getTerms",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"tuple",internalType:"struct DataNFT.LicenseTerms",components:[{name:"price",type:"uint128",internalType:"uint128"},{name:"duration",type:"uint32",internalType:"uint32"},{name:"royaltyBps",type:"uint16",internalType:"uint16"},{name:"paymentToken",type:"address",internalType:"address"}]}],stateMutability:"view"},{type:"function",name:"isApprovedForAll",inputs:[{name:"owner_",type:"address",internalType:"address"},{name:"operator",type:"address",internalType:"address"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"mintWithSignature",inputs:[{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"hash",type:"bytes32",internalType:"bytes32"},{name:"uri",type:"string",internalType:"string"},{name:"licenseTerms",type:"tuple",internalType:"struct DataNFT.LicenseTerms",components:[{name:"price",type:"uint128",internalType:"uint128"},{name:"duration",type:"uint32",internalType:"uint32"},{name:"royaltyBps",type:"uint16",internalType:"uint16"},{name:"paymentToken",type:"address",internalType:"address"}]},{name:"deadline",type:"uint256",internalType:"uint256"},{name:"v",type:"uint8",internalType:"uint8"},{name:"r",type:"bytes32",internalType:"bytes32"},{name:"s",type:"bytes32",internalType:"bytes32"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"name",inputs:[],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"owner",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"ownerOf",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"pause",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"paused",inputs:[],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"pausers",inputs:[{name:"",type:"address",internalType:"address"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"removeCreator",inputs:[{name:"creator",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"removePauser",inputs:[{name:"pauser",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"requestDelete",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"royaltyInfo",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"salePrice",type:"uint256",internalType:"uint256"}],outputs:[{name:"receiver",type:"address",internalType:"address"},{name:"royaltyAmount",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"royaltyPercentages",inputs:[{name:"",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"uint16",internalType:"uint16"}],stateMutability:"view"},{type:"function",name:"royaltyReceivers",inputs:[{name:"",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"safeTransferFrom",inputs:[{name:"from",type:"address",internalType:"address"},{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"safeTransferFrom",inputs:[{name:"from",type:"address",internalType:"address"},{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"data",type:"bytes",internalType:"bytes"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"setApprovalForAll",inputs:[{name:"operator",type:"address",internalType:"address"},{name:"approved",type:"bool",internalType:"bool"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"symbol",inputs:[],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"terms",inputs:[{name:"",type:"uint256",internalType:"uint256"}],outputs:[{name:"price",type:"uint128",internalType:"uint128"},{name:"duration",type:"uint32",internalType:"uint32"},{name:"royaltyBps",type:"uint16",internalType:"uint16"},{name:"paymentToken",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"tokenURI",inputs:[{name:"",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"transferFrom",inputs:[{name:"from",type:"address",internalType:"address"},{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"unpause",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"updateTerms",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"newTerms",type:"tuple",internalType:"struct DataNFT.LicenseTerms",components:[{name:"price",type:"uint128",internalType:"uint128"},{name:"duration",type:"uint32",internalType:"uint32"},{name:"royaltyBps",type:"uint16",internalType:"uint16"},{name:"paymentToken",type:"address",internalType:"address"}]}],outputs:[],stateMutability:"nonpayable"},{type:"event",name:"AccessPurchased",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"buyer",type:"address",indexed:!0,internalType:"address"},{name:"periods",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newExpiry",type:"uint64",indexed:!1,internalType:"uint64"},{name:"amountPaid",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"Approval",inputs:[{name:"owner",type:"address",indexed:!0,internalType:"address"},{name:"approved",type:"address",indexed:!0,internalType:"address"},{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"}],anonymous:!1},{type:"event",name:"ApprovalForAll",inputs:[{name:"owner",type:"address",indexed:!0,internalType:"address"},{name:"operator",type:"address",indexed:!0,internalType:"address"},{name:"approved",type:"bool",indexed:!1,internalType:"bool"}],anonymous:!1},{type:"event",name:"DataDeleted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"}],anonymous:!1},{type:"event",name:"DataDeletionRequested",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"DataMinted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"},{name:"contentHash",type:"bytes32",indexed:!1,internalType:"bytes32"}],anonymous:!1},{type:"event",name:"RoyaltyPaid",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"royaltyAmount",type:"uint256",indexed:!1,internalType:"uint256"},{name:"creator",type:"address",indexed:!1,internalType:"address"},{name:"protocolAmount",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"TermsUpdated",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"newPrice",type:"uint128",indexed:!1,internalType:"uint128"},{name:"newDuration",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newRoyaltyBps",type:"uint16",indexed:!1,internalType:"uint16"},{name:"paymentToken",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"Transfer",inputs:[{name:"from",type:"address",indexed:!0,internalType:"address"},{name:"to",type:"address",indexed:!0,internalType:"address"},{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"}],anonymous:!1},{type:"error",name:"DurationZero",inputs:[]},{type:"error",name:"InvalidRoyalty",inputs:[{name:"royaltyBps",type:"uint16",internalType:"uint16"}]},{type:"error",name:"NotTokenOwner",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"caller",type:"address",internalType:"address"}]},{type:"error",name:"TokenAlreadyExists",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}]},{type:"error",name:"URIQueryForNonexistentToken",inputs:[]},{type:"error",name:"Unauthorized",inputs:[]},{type:"error",name:"Verifier_InvalidDeadline",inputs:[]},{type:"error",name:"Verifier_InvalidSignature",inputs:[]},{type:"error",name:"ZeroAddress",inputs:[]}];var C,M,x,E,S,$,D,j,P,U,F,O,N,_,B,W=[{type:"constructor",inputs:[{name:"dataNFT_",type:"address",internalType:"address"},{name:"router_",type:"address",internalType:"address"},{name:"protocolFeeBps_",type:"uint16",internalType:"uint16"}],stateMutability:"nonpayable"},{type:"function",name:"addFeeManager",inputs:[{name:"feeManager",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"addPauser",inputs:[{name:"pauser",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"buyAccess",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"periods",type:"uint32",internalType:"uint32"}],outputs:[],stateMutability:"payable"},{type:"function",name:"dataNFT",inputs:[],outputs:[{name:"",type:"address",internalType:"contract DataNFT"}],stateMutability:"view"},{type:"function",name:"feeManagers",inputs:[{name:"",type:"address",internalType:"address"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"hasAccess",inputs:[{name:"user",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"owner",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"pause",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"paused",inputs:[],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"pausers",inputs:[{name:"",type:"address",internalType:"address"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"protocolFeeBps",inputs:[],outputs:[{name:"",type:"uint16",internalType:"uint16"}],stateMutability:"view"},{type:"function",name:"removeFeeManager",inputs:[{name:"feeManager",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"removePauser",inputs:[{name:"pauser",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"renewAccess",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"buyer",type:"address",internalType:"address"},{name:"periods",type:"uint32",internalType:"uint32"}],outputs:[],stateMutability:"payable"},{type:"function",name:"router",inputs:[],outputs:[{name:"",type:"address",internalType:"contract RoyaltyRouter"}],stateMutability:"view"},{type:"function",name:"subscriptionExpiry",inputs:[{name:"",type:"uint256",internalType:"uint256"},{name:"",type:"address",internalType:"address"}],outputs:[{name:"",type:"uint64",internalType:"uint64"}],stateMutability:"view"},{type:"function",name:"unpause",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"updateProtocolFee",inputs:[{name:"newFeeBps",type:"uint16",internalType:"uint16"}],outputs:[],stateMutability:"nonpayable"},{type:"event",name:"AccessPurchased",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"buyer",type:"address",indexed:!0,internalType:"address"},{name:"periods",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newExpiry",type:"uint64",indexed:!1,internalType:"uint64"},{name:"amountPaid",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"DataDeleted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"}],anonymous:!1},{type:"event",name:"DataDeletionRequested",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"DataMinted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"},{name:"contentHash",type:"bytes32",indexed:!1,internalType:"bytes32"}],anonymous:!1},{type:"event",name:"RoyaltyPaid",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"royaltyAmount",type:"uint256",indexed:!1,internalType:"uint256"},{name:"creator",type:"address",indexed:!1,internalType:"address"},{name:"protocolAmount",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"TermsUpdated",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"newPrice",type:"uint128",indexed:!1,internalType:"uint128"},{name:"newDuration",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newRoyaltyBps",type:"uint16",indexed:!1,internalType:"uint16"},{name:"paymentToken",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"error",name:"DurationZero",inputs:[]},{type:"error",name:"InvalidPayment",inputs:[{name:"expected",type:"uint256",internalType:"uint256"},{name:"actual",type:"uint256",internalType:"uint256"}]},{type:"error",name:"InvalidPeriods",inputs:[{name:"periods",type:"uint32",internalType:"uint32"}]},{type:"error",name:"InvalidRoyalty",inputs:[{name:"royaltyBps",type:"uint16",internalType:"uint16"}]},{type:"error",name:"Unauthorized",inputs:[]},{type:"error",name:"ZeroAddress",inputs:[]}];
/**
 * The Origin class
 * Handles the upload of files to Origin, as well as querying the user's stats
 */
class R{constructor(t,n){C.add(this),M.set(this,(e=>a(this,void 0,void 0,(function*(){const t=yield fetch(`${w}/auth/origin/upload-url`,{method:"POST",body:JSON.stringify({name:e.name,type:e.type}),headers:{Authorization:`Bearer ${this.jwt}`}}),n=yield t.json();return n.isError?n.message:n.data})))),x.set(this,((e,t)=>a(this,void 0,void 0,(function*(){(yield fetch(`${w}/auth/origin/update-status`,{method:"PATCH",body:JSON.stringify({status:t,fileKey:e}),headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}})).ok||console.error("Failed to update origin status")})))),this.uploadFile=(t,n)=>a(this,void 0,void 0,(function*(){const i=yield r(this,M,"f").call(this,t);if(i){try{yield((t,n,i)=>new Promise(((a,r)=>{e.put(n,t,Object.assign({headers:{"Content-Type":t.type}},"undefined"!=typeof window&&"function"==typeof i?{onUploadProgress:e=>{if(e.total){const t=e.loaded/e.total*100;i(t)}}}:{})).then((e=>{a(e.data)})).catch((e=>{var t;const n=(null===(t=null==e?void 0:e.response)||void 0===t?void 0:t.data)||(null==e?void 0:e.message)||"Upload failed";r(n)}))})))(t,i.url,(null==n?void 0:n.progressCallback)||(()=>{}))}catch(e){throw yield r(this,x,"f").call(this,i.key,"failed"),new Error("Failed to upload file: "+e)}yield r(this,x,"f").call(this,i.key,"success")}else console.error("Failed to generate upload URL")})),this.getOriginUploads=()=>a(this,void 0,void 0,(function*(){const e=yield fetch(`${w}/auth/origin/files`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`}});if(!e.ok)return console.error("Failed to get origin uploads"),null;return(yield e.json()).data})),this.jwt=t,this.viemClient=n}setViemClient(e){this.viemClient=e}
/**
     * Get the user's Origin stats (multiplier, consent, usage, etc.).
     * @returns {Promise<OriginUsageReturnType>} A promise that resolves with the user's Origin stats.
     */getOriginUsage(){return a(this,void 0,void 0,(function*(){const e=yield fetch(`${w}/auth/origin/usage`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"}}).then((e=>e.json()));if(!e.isError&&e.data.user)return e;throw new o(e.message||"Failed to fetch Origin usage")}))}
/**
     * Set the user's consent for Origin usage.
     * @param {boolean} consent The user's consent.
     * @returns {Promise<void>}
     * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the consent is not provided.
     */setOriginConsent(e){return a(this,void 0,void 0,(function*(){if(void 0===e)throw new o("Consent is required");const t=yield fetch(`${w}/auth/origin/status`,{method:"PATCH",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"},body:JSON.stringify({active:e})}).then((e=>e.json()));if(t.isError)throw new o(t.message||"Failed to set Origin consent")}))}
/**
     * Set the user's Origin multiplier.
     * @param {number} multiplier The user's Origin multiplier.
     * @returns {Promise<void>}
     * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the multiplier is not provided.
     */setOriginMultiplier(e){return a(this,void 0,void 0,(function*(){if(void 0===e)throw new o("Multiplier is required");const t=yield fetch(`${w}/auth/origin/multiplier`,{method:"PATCH",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"},body:JSON.stringify({multiplier:e})}).then((e=>e.json()));if(t.isError)throw new o(t.message||"Failed to set Origin multiplier")}))}
/**
     * Call a contract method.
     * @param {string} contractAddress The contract address.
     * @param {Abi} abi The contract ABI.
     * @param {string} methodName The method name.
     * @param {any[]} params The method parameters.
     * @param {CallOptions} [options] The call options.
     * @returns {Promise<any>} A promise that resolves with the result of the contract call or transaction hash.
     * @throws {Error} - Throws an error if the wallet client is not connected and the method is not a view function.
     */callContractMethod(e,n,i,s){return a(this,arguments,void 0,(function*(e,n,i,a,s={}){const o=t.getAbiItem({abi:n,name:i}),d=o&&"stateMutability"in o&&("view"===o.stateMutability||"pure"===o.stateMutability);if(!d&&!this.viemClient)throw new Error("WalletClient not connected.");if(d){const t=m();return(yield t.readContract({address:e,abi:n,functionName:i,args:a}))||null}{const[o]=yield this.viemClient.getAddresses(),d=t.encodeFunctionData({abi:n,functionName:i,args:a});yield r(this,C,"m",S).call(this,y);const u=yield this.viemClient.sendTransaction({to:e,data:d,account:o,value:s.value,gas:s.gas});if("string"!=typeof u)throw new Error("Transaction failed to send.");if(!s.waitForReceipt)return u;return yield r(this,C,"m",E).call(this,u)}}))}}M=new WeakMap,x=new WeakMap,C=new WeakSet,E=function(e){return a(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");for(;;){const t=yield this.viemClient.request({method:"eth_getTransactionReceipt",params:[e]});if(t&&t.blockNumber)return t;yield new Promise((e=>setTimeout(e,1e3)))}}))},S=function(e){return a(this,void 0,void 0,(function*(){
// return;
if(!this.viemClient)throw new Error("WalletClient not connected.");let t=yield this.viemClient.request({method:"eth_chainId",params:[]});if("string"==typeof t&&(t=parseInt(t,16)),t!==e.id)try{yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16)}]})}catch(t){
// Unrecognized chain
if(4902!==t.code)throw t;yield this.viemClient.request({method:"wallet_addEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16),chainName:e.name,rpcUrls:e.rpcUrls.default.http,nativeCurrency:e.nativeCurrency}]}),yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16)}]})}}))},
// DataNFT methods
R.prototype.mintWithSignature=function(e,t,n,i,a,r,s){return this.callContractMethod(v,A,"mintWithSignature",[e,t,n,i,a,r,s.v,s.r,s.s])},R.prototype.updateTerms=function(e,t){return this.callContractMethod(v,A,"updateTerms",[e,t])},R.prototype.requestDelete=function(e){return this.callContractMethod(v,A,"requestDelete",[e])},R.prototype.getTerms=function(e){return this.callContractMethod(v,A,"getTerms",[e])},R.prototype.ownerOf=function(e){return this.callContractMethod(v,A,"ownerOf",[e])},R.prototype.balanceOf=function(e){return this.callContractMethod(v,A,"balanceOf",[e])},R.prototype.contentHash=function(e){return this.callContractMethod(v,A,"contentHash",[e])},R.prototype.tokenURI=function(e){return this.callContractMethod(v,A,"tokenURI",[e])},R.prototype.dataStatus=function(e){return this.callContractMethod(v,A,"dataStatus",[e])},R.prototype.royaltyInfo=function(e,t){return a(this,void 0,void 0,(function*(){return this.callContractMethod(v,A,"royaltyInfo",[e,t])}))},R.prototype.getApproved=function(e){return this.callContractMethod(v,A,"getApproved",[e])},R.prototype.isApprovedForAll=function(e,t){return this.callContractMethod(v,A,"isApprovedForAll",[e,t])},R.prototype.transferFrom=function(e,t,n){return this.callContractMethod(v,A,"transferFrom",[e,t,n])},R.prototype.safeTransferFrom=function(e,t,n,i){const a=i?[e,t,n,i]:[e,t,n];return this.callContractMethod(v,A,"safeTransferFrom",a)},R.prototype.approve=function(e,t){return this.callContractMethod(v,A,"approve",[e,t])},R.prototype.setApprovalForAll=function(e,t){return this.callContractMethod(v,A,"setApprovalForAll",[e,t])},
// Marketplace methods
R.prototype.buyAccess=function(e,t,n){return this.callContractMethod(b,W,"buyAccess",[e,t],void 0!==n?{value:n}:void 0)},R.prototype.renewAccess=function(e,t,n,i){return this.callContractMethod(b,W,"renewAccess",[e,t,n],void 0!==i?{value:i}:void 0)},R.prototype.hasAccess=function(e,t){return this.callContractMethod(b,W,"hasAccess",[e,t])},R.prototype.subscriptionExpiry=function(e,t){return this.callContractMethod(b,W,"subscriptionExpiry",[e,t])};D=new WeakMap,j=new WeakMap,$=new WeakSet,P=function(e,t){r(this,D,"f")[e]&&r(this,D,"f")[e].forEach((e=>e(t)))},U=function(e){return a(this,void 0,void 0,(function*(){var t,n;if("undefined"==typeof localStorage)return;const i=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:wallet-address"),a=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:user-id"),r=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:jwt");if(i&&a&&r){this.walletAddress=i,this.userId=a,this.jwt=r,this.origin=new R(this.jwt),this.isAuthenticated=!0;let s=e;if(!s){const e=null!==(t=I())&&void 0!==t?t:[];for(const t of e)try{if((null===(n=(yield t.provider.request({method:"eth_accounts"}))[0])||void 0===n?void 0:n.toLowerCase())===i.toLowerCase()){s=t.provider;break}}catch(e){console.warn("Failed to fetch accounts from provider:",e)}}s&&
// this.viem = getClient(
//   selectedProvider,
//   new Date().getTime().toString(),
//   walletAddress
// );
// this.#trigger("viem", this.viem);
this.setProvider({provider:s,info:{name:"reinitialized",version:"1.0.0"},address:i})}else this.isAuthenticated=!1}))},F=function(){return a(this,void 0,void 0,(function*(){try{const[e]=yield this.viem.requestAddresses();return this.walletAddress=e,e}catch(e){throw new o(e)}}))},O=function(){return a(this,void 0,void 0,(function*(){try{const e=yield fetch(`${w}/auth/client-user/nonce`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({walletAddress:this.walletAddress})}),t=yield e.json();return 200!==e.status?Promise.reject(t.message||"Failed to fetch nonce"):t.data}catch(e){throw new Error(e)}}))},N=function(e,t){return a(this,void 0,void 0,(function*(){try{const n=yield fetch(`${w}/auth/client-user/verify`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({message:e,signature:t,walletAddress:this.walletAddress})}),i=yield n.json(),a=i.data.split(".")[1],r=JSON.parse(atob(a));return{success:!i.isError,userId:r.id,token:i.data}}catch(e){throw new o(e)}}))},_=function(e){return i.createSiweMessage({domain:window.location.host,address:this.walletAddress,statement:f,uri:window.location.origin,version:"1",chainId:this.viem.chain.id,nonce:e})},B=function(e,t){return a(this,arguments,void 0,(function*(e,t,n=1){
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
constructor({clientId:e,redirectUri:t,allowAnalytics:n=!0,ackeeInstance:i}){if($.add(this),D.set(this,void 0),j.set(this,void 0),!e)throw new Error("clientId is required");this.viem=null,
// if (typeof window !== "undefined") {
//   if (window.ethereum) this.viem = getClient(window.ethereum);
// }
this.redirectUri=(e=>{const t=["twitter","discord","spotify"];return"object"==typeof e?t.reduce(((t,n)=>(t[n]=e[n]||("undefined"!=typeof window?window.location.href:""),t)),{}):"string"==typeof e?t.reduce(((t,n)=>(t[n]=e,t)),{}):e?{}:t.reduce(((e,t)=>(e[t]="undefined"!=typeof window?window.location.href:"",e)),{})})(t),i&&s(this,j,i,"f"),n&&r(this,j,"f"),this.clientId=e,this.isAuthenticated=!1,this.jwt=null,this.origin=null,this.walletAddress=null,this.userId=null,s(this,D,{},"f"),k((e=>{r(this,$,"m",P).call(this,"providers",e)})),r(this,$,"m",U).call(this)}
/**
     * Subscribe to an event. Possible events are "state", "provider", "providers", and "viem".
     * @param {("state"|"provider"|"providers"|"viem")} event The event.
     * @param {function} callback The callback function.
     * @returns {void}
     * @example
     * auth.on("state", (state) => {
     *  console.log(state);
     * });
     */on(e,t){r(this,D,"f")[e]||(r(this,D,"f")[e]=[]),r(this,D,"f")[e].push(t),"providers"===e&&t(I())}
/**
     * Set the loading state.
     * @param {boolean} loading The loading state.
     * @returns {void}
     */setLoading(e){r(this,$,"m",P).call(this,"state",e?"loading":this.isAuthenticated?"authenticated":"unauthenticated")}
/**
     * Set the provider. This is useful for setting the provider when the user selects a provider from the UI or when dApp wishes to use a specific provider.
     * @param {object} options The options object. Includes the provider and the provider info.
     * @returns {void}
     * @throws {APIError} - Throws an error if the provider is not provided.
     */setProvider({provider:e,info:i,address:a}){if(!e)throw new o("provider is required");this.viem=((e,i="window.ethereum",a)=>{var r;if(!e&&!c)return console.warn("Provider is required to create a client."),null;if(!c||c.transport.name!==i&&e||a!==(null===(r=c.account)||void 0===r?void 0:r.address)&&e){const r={chain:y,transport:t.custom(e,{name:i})};a&&(r.account=n.toAccount(a)),c=t.createWalletClient(r)}return c})(e,i.name,a),this.origin&&this.origin.setViemClient(this.viem),r(this,$,"m",P).call(this,"viem",this.viem),r(this,$,"m",P).call(this,"provider",{provider:e,info:i})}
/**
     * Set the wallet address. This is useful for edge cases where the provider can't return the wallet address. Don't use this unless you know what you're doing.
     * @param {string} walletAddress The wallet address.
     * @returns {void}
     */setWalletAddress(e){this.walletAddress=e}
/**
     * Disconnect the user.
     * @returns {Promise<void>}
     */disconnect(){return a(this,void 0,void 0,(function*(){this.isAuthenticated&&(this.isAuthenticated=!1,this.walletAddress=null,this.userId=null,this.jwt=null,this.origin=null,localStorage.removeItem("camp-sdk:wallet-address"),localStorage.removeItem("camp-sdk:user-id"),localStorage.removeItem("camp-sdk:jwt"),r(this,$,"m",P).call(this,"state","unauthenticated"),yield r(this,$,"m",B).call(this,T.USER_DISCONNECTED,"User Disconnected"))}))}
/**
     * Connect the user's wallet and sign the message.
     * @returns {Promise<{ success: boolean; message: string; walletAddress: string }>} A promise that resolves with the authentication result.
     * @throws {APIError} - Throws an error if the user cannot be authenticated.
     */connect(){return a(this,void 0,void 0,(function*(){r(this,$,"m",P).call(this,"state","loading");try{this.walletAddress||(yield r(this,$,"m",F).call(this));const e=yield r(this,$,"m",O).call(this),t=r(this,$,"m",_).call(this,e),n=yield this.viem.signMessage({account:this.walletAddress,message:t}),i=yield r(this,$,"m",N).call(this,t,n);if(i.success)return this.isAuthenticated=!0,this.userId=i.userId,this.jwt=i.token,this.origin=new R(this.jwt,this.viem),localStorage.setItem("camp-sdk:jwt",this.jwt),localStorage.setItem("camp-sdk:wallet-address",this.walletAddress),localStorage.setItem("camp-sdk:user-id",this.userId),r(this,$,"m",P).call(this,"state","authenticated"),yield r(this,$,"m",B).call(this,T.USER_CONNECTED,"User Connected"),{success:!0,message:"Successfully authenticated",walletAddress:this.walletAddress};throw this.isAuthenticated=!1,r(this,$,"m",P).call(this,"state","unauthenticated"),new o("Failed to authenticate")}catch(e){throw this.isAuthenticated=!1,r(this,$,"m",P).call(this,"state","unauthenticated"),new o(e)}}))}
/**
     * Get the user's linked social accounts.
     * @returns {Promise<Record<string, boolean>>} A promise that resolves with the user's linked social accounts.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated or if the request fails.
     * @example
     * const auth = new Auth({ clientId: "your-client-id" });
     * const socials = await auth.getLinkedSocials();
     * console.log(socials);
     */getLinkedSocials(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${w}/auth/client-user/connections-sdk`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"}}).then((e=>e.json()));if(e.isError)throw new o(e.message||"Failed to fetch connections");{const t={};return Object.keys(e.data.data).forEach((n=>{t[n.split("User")[0]]=e.data.data[n]})),t}}))}
/**
     * Link the user's Twitter account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkTwitter(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");
// await this.#sendAnalyticsEvent(
//   constants.ACKEE_EVENTS.TWITTER_LINKED,
//   "Twitter Linked"
// );
window.location.href=`${w}/twitter/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.twitter}`}))}
/**
     * Link the user's Discord account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkDiscord(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");
// await this.#sendAnalyticsEvent(
//   constants.ACKEE_EVENTS.DISCORD_LINKED,
//   "Discord Linked"
// );
window.location.href=`${w}/discord/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.discord}`}))}
/**
     * Link the user's Spotify account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkSpotify(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");
// await this.#sendAnalyticsEvent(
//   constants.ACKEE_EVENTS.SPOTIFY_LINKED,
//   "Spotify Linked"
// );
window.location.href=`${w}/spotify/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.spotify}`}))}
/**
     * Link the user's TikTok account.
     * @param {string} handle The user's TikTok handle.
     * @returns {Promise<any>} A promise that resolves with the TikTok account data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */linkTikTok(e){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const t=yield fetch(`${w}/tiktok/connect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userHandle:e,clientId:this.clientId,userId:this.userId})}).then((e=>e.json()));if(t.isError)throw"Request failed with status code 502"===t.message?new o("TikTok service is currently unavailable, try again later"):new o(t.message||"Failed to link TikTok account");return r(this,$,"m",B).call(this,T.TIKTOK_LINKED,"TikTok Linked"),t.data}))}
/**
     * Send an OTP to the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @returns {Promise<any>} A promise that resolves with the OTP data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */sendTelegramOTP(e){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!e)throw new o("Phone number is required");yield this.unlinkTelegram();const t=yield fetch(`${w}/telegram/sendOTP-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:e})}).then((e=>e.json()));if(t.isError)throw new o(t.message||"Failed to send Telegram OTP");return t.data}))}
/**
     * Link the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @param {string} otp The OTP.
     * @param {string} phoneCodeHash The phone code hash.
     * @returns {Promise<object>} A promise that resolves with the Telegram account data.
     * @throws {APIError|Error} - Throws an error if the user is not authenticated. Also throws an error if the phone number, OTP, and phone code hash are not provided.
     */linkTelegram(e,t,n){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!e||!t||!n)throw new o("Phone number, OTP, and phone code hash are required");const i=yield fetch(`${w}/telegram/signIn-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:e,code:t,phone_code_hash:n,userId:this.userId,clientId:this.clientId})}).then((e=>e.json()));if(i.isError)throw new o(i.message||"Failed to link Telegram account");return r(this,$,"m",B).call(this,T.TELEGRAM_LINKED,"Telegram Linked"),i.data}))}
/**
     * Unlink the user's Twitter account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTwitter(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${w}/twitter/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new o(e.message||"Failed to unlink Twitter account");return e.data}))}
/**
     * Unlink the user's Discord account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkDiscord(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new o("User needs to be authenticated");const e=yield fetch(`${w}/discord/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new o(e.message||"Failed to unlink Discord account");return e.data}))}
/**
     * Unlink the user's Spotify account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkSpotify(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new o("User needs to be authenticated");const e=yield fetch(`${w}/spotify/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new o(e.message||"Failed to unlink Spotify account");return e.data}))}
/**
     * Unlink the user's TikTok account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTikTok(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new o("User needs to be authenticated");const e=yield fetch(`${w}/tiktok/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((e=>e.json()));if(e.isError)throw new o(e.message||"Failed to unlink TikTok account");return e.data}))}
/**
     * Unlink the user's Telegram account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTelegram(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new o("User needs to be authenticated");const e=yield fetch(`${w}/telegram/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((e=>e.json()));if(e.isError)throw new o(e.message||"Failed to unlink Telegram account");return e.data}))}},exports.SpotifyAPI=
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
     */fetchSavedTracksById(e){return a(this,void 0,void 0,(function*(){const t=u(`${l}/save-tracks`,{spotifyId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the played tracks of a user by Spotify ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The played tracks.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchPlayedTracksById(e){return a(this,void 0,void 0,(function*(){const t=u(`${l}/played-tracks`,{spotifyId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the user's saved albums by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved albums.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedAlbumsById(e){return a(this,void 0,void 0,(function*(){const t=u(`${l}/saved-albums`,{spotifyId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the user's saved playlists by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved playlists.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedPlaylistsById(e){return a(this,void 0,void 0,(function*(){const t=u(`${l}/saved-playlists`,{spotifyId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the tracks of an album by album ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} albumId - The album ID.
     * @returns {Promise<object>} - The tracks in the album.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInAlbum(e,t){return a(this,void 0,void 0,(function*(){const n=u(`${l}/album/tracks`,{spotifyId:e,albumId:t});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch the tracks in a playlist by playlist ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} playlistId - The playlist ID.
     * @returns {Promise<object>} - The tracks in the playlist.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInPlaylist(e,t){return a(this,void 0,void 0,(function*(){const n=u(`${l}/playlist/tracks`,{spotifyId:e,playlistId:t});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch the user's Spotify data by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @returns {Promise<object>} - The user's Spotify data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(e){return a(this,void 0,void 0,(function*(){const t=u(`${l}/wallet-spotify-data`,{walletAddress:e});return this._fetchDataWithAuth(t)}))}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(e){return a(this,void 0,void 0,(function*(){if(!this.apiKey)throw new o("API key is required for fetching data",401);try{return yield d(e,{"x-api-key":this.apiKey})}catch(e){throw new o(e.message,e.statusCode)}}))}},exports.TwitterAPI=
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
     */fetchUserByUsername(e){return a(this,void 0,void 0,(function*(){const t=u(`${p}/user`,{twitterUserName:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetsByUsername(e){return a(this,arguments,void 0,(function*(e,t=1,n=10){const i=u(`${p}/tweets`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch followers by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The followers.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowersByUsername(e){return a(this,arguments,void 0,(function*(e,t=1,n=10){const i=u(`${p}/followers`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch following by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The following.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowingByUsername(e){return a(this,arguments,void 0,(function*(e,t=1,n=10){const i=u(`${p}/following`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch tweet by tweet ID.
     * @param {string} tweetId - The tweet ID.
     * @returns {Promise<object>} - The tweet.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetById(e){return a(this,void 0,void 0,(function*(){const t=u(`${p}/getTweetById`,{tweetId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch user by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The user data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(e){return a(this,arguments,void 0,(function*(e,t=1,n=10){const i=u(`${p}/wallet-twitter-data`,{walletAddress:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch reposted tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The reposted tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepostedByUsername(e){return a(this,arguments,void 0,(function*(e,t=1,n=10){const i=u(`${p}/reposted`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch replies by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The replies.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepliesByUsername(e){return a(this,arguments,void 0,(function*(e,t=1,n=10){const i=u(`${p}/replies`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch likes by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The likes.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchLikesByUsername(e){return a(this,arguments,void 0,(function*(e,t=1,n=10){const i=u(`${p}/event/likes/${e}`,{page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch follows by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The follows.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowsByUsername(e){return a(this,arguments,void 0,(function*(e,t=1,n=10){const i=u(`${p}/event/follows/${e}`,{page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch viewed tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The viewed tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchViewedTweetsByUsername(e){return a(this,arguments,void 0,(function*(e,t=1,n=10){const i=u(`${p}/event/viewed-tweets/${e}`,{page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(e){return a(this,void 0,void 0,(function*(){if(!this.apiKey)throw new o("API key is required for fetching data",401);try{return yield d(e,{"x-api-key":this.apiKey})}catch(e){throw new o(e.message,e.statusCode)}}))}};
