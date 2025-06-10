"use strict";var t=require("axios"),e=require("viem"),n=require("viem/accounts"),i=require("viem/siwe");
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
function a(t,e,n,i){return new(n||(n=Promise))((function(a,r){function s(t){try{d(i.next(t))}catch(t){r(t)}}function o(t){try{d(i.throw(t))}catch(t){r(t)}}function d(t){var e;t.done?a(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(s,o)}d((i=i.apply(t,e||[])).next())}))}function r(t,e,n,i){if("a"===n&&!i)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof e?t!==e||!i:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===n?i:"a"===n?i.call(t):i?i.value:e.get(t)}function s(t,e,n,i,a){if("m"===i)throw new TypeError("Private method is not writable");if("a"===i&&!a)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof e?t!==e||!a:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===i?a.call(t,n):a?a.value=n:e.set(t,n),n}"function"==typeof SuppressedError&&SuppressedError;class o extends Error{constructor(t,e){super(t),this.name="APIError",this.statusCode=e||500,Error.captureStackTrace(this,this.constructor)}toJSON(){return{error:this.name,message:this.message,statusCode:this.statusCode||500}}}
/**
 * Makes a GET request to the given URL with the provided headers.
 *
 * @param {string} url - The URL to send the GET request to.
 * @param {object} headers - The headers to include in the request.
 * @returns {Promise<object>} - The response data.
 * @throws {APIError} - Throws an error if the request fails.
 */function d(e){return a(this,arguments,void 0,(function*(e,n={}){try{return(yield t.get(e,{headers:n})).data}catch(t){if(t.response)throw new o(t.response.data.message||"API request failed",t.response.status);throw new o("Network error or server is unavailable",500)}}))}
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
function u(t,e={}){const n=function(t={}){return Object.keys(t).map((e=>`${encodeURIComponent(e)}=${encodeURIComponent(t[e])}`)).join("&")}(e);return n?`${t}?${n}`:t}const l="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/twitter",p="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/spotify";const c={id:123420001114,name:"Basecamp",nativeCurrency:{decimals:18,name:"Camp",symbol:"CAMP"},rpcUrls:{default:{http:["https://rpc-campnetwork.xyz","https://rpc.basecamp.t.raas.gelato.cloud"]}},blockExplorers:{default:{name:"Explorer",url:"https://basecamp.cloud.blockscout.com/"}}};
// @ts-ignore
let y=null,h=null;const m=()=>(h||(h=e.createPublicClient({chain:c,transport:e.http()})),h);var f="Connect with Camp Network",w="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",v={USER_CONNECTED:"ed42542d-b676-4112-b6d9-6db98048b2e0",USER_DISCONNECTED:"20af31ac-e602-442e-9e0e-b589f4dd4016",TWITTER_LINKED:"7fbea086-90ef-4679-ba69-f47f9255b34c",DISCORD_LINKED:"d73f5ae3-a8e8-48f2-8532-85e0c7780d6a",SPOTIFY_LINKED:"fc1788b4-c984-42c8-96f4-c87f6bb0b8f7",TIKTOK_LINKED:"4a2ffdd3-f0e9-4784-8b49-ff76ec1c0a6a",TELEGRAM_LINKED:"9006bc5d-bcc9-4d01-a860-4f1a201e8e47"},T="0xd064817Dc0Af032c3fb5dd4671fd10E0a5F0515D",b="0x3B782d053de8910cC0EF3DC09EEA055229a70c6b";let g=[];const I=()=>g,A=t=>{function e(e){g.some((t=>t.info.uuid===e.detail.info.uuid))||(g=[...g,e.detail],t(g))}if("undefined"!=typeof window)return window.addEventListener("eip6963:announceProvider",e),window.dispatchEvent(new Event("eip6963:requestProvider")),()=>window.removeEventListener("eip6963:announceProvider",e)};var k=[{inputs:[{internalType:"string",name:"_name",type:"string"},{internalType:"string",name:"_symbol",type:"string"},{internalType:"string",name:"_baseURI",type:"string"}],stateMutability:"nonpayable",type:"constructor"},{inputs:[],name:"DurationZero",type:"error"},{inputs:[{internalType:"uint16",name:"royaltyBps",type:"uint16"}],name:"InvalidRoyalty",type:"error"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"address",name:"caller",type:"address"}],name:"NotTokenOwner",type:"error"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"TokenAlreadyExists",type:"error"},{inputs:[],name:"URIQueryForNonexistentToken",type:"error"},{inputs:[],name:"Unauthorized",type:"error"},{inputs:[],name:"Verifier_InvalidDeadline",type:"error"},{inputs:[],name:"Verifier_InvalidSignature",type:"error"},{inputs:[],name:"ZeroAddress",type:"error"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"buyer",type:"address"},{indexed:!1,internalType:"uint32",name:"periods",type:"uint32"},{indexed:!1,internalType:"uint64",name:"newExpiry",type:"uint64"},{indexed:!1,internalType:"uint256",name:"amountPaid",type:"uint256"}],name:"AccessPurchased",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"owner",type:"address"},{indexed:!0,internalType:"address",name:"approved",type:"address"},{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"}],name:"Approval",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"owner",type:"address"},{indexed:!0,internalType:"address",name:"operator",type:"address"},{indexed:!1,internalType:"bool",name:"approved",type:"bool"}],name:"ApprovalForAll",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"}],name:"DataDeleted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"}],name:"DataDeletionRequested",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"bytes32",name:"contentHash",type:"bytes32"}],name:"DataMinted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint256",name:"royaltyAmount",type:"uint256"},{indexed:!1,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"uint256",name:"protocolAmount",type:"uint256"}],name:"RoyaltyPaid",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint128",name:"newPrice",type:"uint128"},{indexed:!1,internalType:"uint32",name:"newDuration",type:"uint32"},{indexed:!1,internalType:"uint16",name:"newRoyaltyBps",type:"uint16"},{indexed:!1,internalType:"address",name:"paymentToken",type:"address"}],name:"TermsUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"from",type:"address"},{indexed:!0,internalType:"address",name:"to",type:"address"},{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"}],name:"Transfer",type:"event"},{inputs:[{internalType:"address",name:"creator",type:"address"}],name:"addCreator",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"pauser",type:"address"}],name:"addPauser",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"approve",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"owner_",type:"address"}],name:"balanceOf",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"baseURI",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"contentHash",outputs:[{internalType:"bytes32",name:"",type:"bytes32"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"}],name:"creators",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"dataStatus",outputs:[{internalType:"enum DataNFT.DataStatus",name:"",type:"uint8"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"finalizeDelete",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"getApproved",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"getTerms",outputs:[{components:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],internalType:"struct DataNFT.LicenseTerms",name:"",type:"tuple"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"owner_",type:"address"},{internalType:"address",name:"operator",type:"address"}],name:"isApprovedForAll",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"bytes32",name:"hash",type:"bytes32"},{internalType:"string",name:"uri",type:"string"},{components:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],internalType:"struct DataNFT.LicenseTerms",name:"licenseTerms",type:"tuple"},{internalType:"uint256",name:"deadline",type:"uint256"},{internalType:"uint8",name:"v",type:"uint8"},{internalType:"bytes32",name:"r",type:"bytes32"},{internalType:"bytes32",name:"s",type:"bytes32"}],name:"mintWithSignature",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"name",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[],name:"owner",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"ownerOf",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"pause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"paused",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"}],name:"pausers",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"creator",type:"address"}],name:"removeCreator",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"pauser",type:"address"}],name:"removePauser",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"requestDelete",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint256",name:"salePrice",type:"uint256"}],name:"royaltyInfo",outputs:[{internalType:"address",name:"receiver",type:"address"},{internalType:"uint256",name:"royaltyAmount",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"royaltyPercentages",outputs:[{internalType:"uint16",name:"",type:"uint16"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"royaltyReceivers",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"safeTransferFrom",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"bytes",name:"data",type:"bytes"}],name:"safeTransferFrom",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"operator",type:"address"},{internalType:"bool",name:"approved",type:"bool"}],name:"setApprovalForAll",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"symbol",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"terms",outputs:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"tokenURI",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"transferFrom",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"unpause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"},{components:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],internalType:"struct DataNFT.LicenseTerms",name:"newTerms",type:"tuple"}],name:"updateTerms",outputs:[],stateMutability:"nonpayable",type:"function"}];
/**
 * Mints a Data NFT with a signature.
 * @param to The address to mint the NFT to.
 * @param tokenId The ID of the token to mint.
 * @param hash The hash of the data associated with the NFT.
 * @param uri The URI of the NFT metadata.
 * @param licenseTerms The terms of the license for the NFT.
 * @param deadline The deadline for the minting operation.
 * @param signature The signature for the minting operation.
 * @returns A promise that resolves when the minting is complete.
 */function C(t,e,n,i,r,s,o){return a(this,void 0,void 0,(function*(){return yield this.callContractMethod(T,k,"mintWithSignature",[t,e,n,i,r,s,o.v,o.r,o.s],{waitForReceipt:!0})}))}
/**
 * Registers a Data NFT with the Origin service in order to obtain a signature for minting.
 * @param source The source of the Data NFT (e.g., "spotify", "twitter", "tiktok", or "file").
 * @param deadline The deadline for the registration operation.
 * @param fileKey Optional file key for file uploads.
 * @return A promise that resolves with the registration data.
 */function M(t,e,n){return a(this,void 0,void 0,(function*(){const i={source:t,deadline:e.toString()};void 0!==n&&(i.fileKey=n);const a=yield fetch(`${w}/auth/origin/register`,{method:"POST",headers:{Authorization:`Bearer ${this.getJwt()}`},body:JSON.stringify(i)});if(!a.ok)throw new Error(`Failed to get signature: ${a.statusText}`);const r=yield a.json();if(r.isError)throw new Error(`Failed to get signature: ${r.message}`);return r.data}))}function E(t,e){return this.callContractMethod(T,k,"updateTerms",[t,e],{waitForReceipt:!0})}function x(t){return this.callContractMethod(T,k,"requestDelete",[t])}function S(t){return this.callContractMethod(T,k,"getTerms",[t])}function $(t){return this.callContractMethod(T,k,"ownerOf",[t])}function D(t){return this.callContractMethod(T,k,"balanceOf",[t])}function F(t){return this.callContractMethod(T,k,"contentHash",[t])}function j(t){return this.callContractMethod(T,k,"tokenURI",[t])}function P(t){return this.callContractMethod(T,k,"dataStatus",[t])}function U(t,e){return a(this,void 0,void 0,(function*(){return this.callContractMethod(T,k,"royaltyInfo",[t,e])}))}function N(t){return this.callContractMethod(T,k,"getApproved",[t])}function O(t,e){return this.callContractMethod(T,k,"isApprovedForAll",[t,e])}function B(t,e,n){return this.callContractMethod(T,k,"transferFrom",[t,e,n])}function _(t,e,n,i){const a=i?[t,e,n,i]:[t,e,n];return this.callContractMethod(T,k,"safeTransferFrom",a)}function W(t,e){return this.callContractMethod(T,k,"approve",[t,e])}function q(t,e){return this.callContractMethod(T,k,"setApprovalForAll",[t,e])}var R,z,L,K,J,H,G,V,Z,Q,Y,X,tt,et,nt,it=[{type:"constructor",inputs:[{name:"dataNFT_",type:"address",internalType:"address"},{name:"router_",type:"address",internalType:"address"},{name:"protocolFeeBps_",type:"uint16",internalType:"uint16"}],stateMutability:"nonpayable"},{type:"function",name:"addFeeManager",inputs:[{name:"feeManager",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"addPauser",inputs:[{name:"pauser",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"buyAccess",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"periods",type:"uint32",internalType:"uint32"}],outputs:[],stateMutability:"payable"},{type:"function",name:"dataNFT",inputs:[],outputs:[{name:"",type:"address",internalType:"contract DataNFT"}],stateMutability:"view"},{type:"function",name:"feeManagers",inputs:[{name:"",type:"address",internalType:"address"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"hasAccess",inputs:[{name:"user",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"owner",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"pause",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"paused",inputs:[],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"pausers",inputs:[{name:"",type:"address",internalType:"address"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"protocolFeeBps",inputs:[],outputs:[{name:"",type:"uint16",internalType:"uint16"}],stateMutability:"view"},{type:"function",name:"removeFeeManager",inputs:[{name:"feeManager",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"removePauser",inputs:[{name:"pauser",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"renewAccess",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"buyer",type:"address",internalType:"address"},{name:"periods",type:"uint32",internalType:"uint32"}],outputs:[],stateMutability:"payable"},{type:"function",name:"router",inputs:[],outputs:[{name:"",type:"address",internalType:"contract RoyaltyRouter"}],stateMutability:"view"},{type:"function",name:"subscriptionExpiry",inputs:[{name:"",type:"uint256",internalType:"uint256"},{name:"",type:"address",internalType:"address"}],outputs:[{name:"",type:"uint64",internalType:"uint64"}],stateMutability:"view"},{type:"function",name:"unpause",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"updateProtocolFee",inputs:[{name:"newFeeBps",type:"uint16",internalType:"uint16"}],outputs:[],stateMutability:"nonpayable"},{type:"event",name:"AccessPurchased",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"buyer",type:"address",indexed:!0,internalType:"address"},{name:"periods",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newExpiry",type:"uint64",indexed:!1,internalType:"uint64"},{name:"amountPaid",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"DataDeleted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"}],anonymous:!1},{type:"event",name:"DataDeletionRequested",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"DataMinted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"},{name:"contentHash",type:"bytes32",indexed:!1,internalType:"bytes32"}],anonymous:!1},{type:"event",name:"RoyaltyPaid",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"royaltyAmount",type:"uint256",indexed:!1,internalType:"uint256"},{name:"creator",type:"address",indexed:!1,internalType:"address"},{name:"protocolAmount",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"TermsUpdated",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"newPrice",type:"uint128",indexed:!1,internalType:"uint128"},{name:"newDuration",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newRoyaltyBps",type:"uint16",indexed:!1,internalType:"uint16"},{name:"paymentToken",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"error",name:"DurationZero",inputs:[]},{type:"error",name:"InvalidPayment",inputs:[{name:"expected",type:"uint256",internalType:"uint256"},{name:"actual",type:"uint256",internalType:"uint256"}]},{type:"error",name:"InvalidPeriods",inputs:[{name:"periods",type:"uint32",internalType:"uint32"}]},{type:"error",name:"InvalidRoyalty",inputs:[{name:"royaltyBps",type:"uint16",internalType:"uint16"}]},{type:"error",name:"Unauthorized",inputs:[]},{type:"error",name:"ZeroAddress",inputs:[]}];function at(t,e,n){return this.callContractMethod(b,it,"buyAccess",[t,e],{waitForReceipt:!0,value:n})}function rt(t,e,n,i){return this.callContractMethod(b,it,"renewAccess",[t,e,n],void 0!==i?{value:i}:void 0)}function st(t,e){return this.callContractMethod(b,it,"hasAccess",[t,e])}function ot(t,e){return this.callContractMethod(b,it,"subscriptionExpiry",[t,e])}
/**
 * Approves a spender to spend a specified amount of tokens on behalf of the owner.
 * If the current allowance is less than the specified amount, it will perform the approval.
 * @param {ApproveParams} params - The parameters for the approval.
 */
/**
 * The Origin class
 * Handles the upload of files to Origin, as well as querying the user's stats
 */
class dt{constructor(e,n){R.add(this),z.set(this,(t=>a(this,void 0,void 0,(function*(){const e=yield fetch(`${w}/auth/origin/upload-url`,{method:"POST",body:JSON.stringify({name:t.name,type:t.type}),headers:{Authorization:`Bearer ${this.jwt}`}}),n=yield e.json();return n.isError?n.message:n.data})))),L.set(this,((t,e)=>a(this,void 0,void 0,(function*(){(yield fetch(`${w}/auth/origin/update-status`,{method:"PATCH",body:JSON.stringify({status:e,fileKey:t}),headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}})).ok||console.error("Failed to update origin status")})))),this.uploadFile=(e,n)=>a(this,void 0,void 0,(function*(){const i=yield r(this,z,"f").call(this,e);if(i){try{yield((e,n,i)=>new Promise(((a,r)=>{t.put(n,e,Object.assign({headers:{"Content-Type":e.type}},"undefined"!=typeof window&&"function"==typeof i?{onUploadProgress:t=>{if(t.total){const e=t.loaded/t.total*100;i(e)}}}:{})).then((t=>{a(t.data)})).catch((t=>{var e;const n=(null===(e=null==t?void 0:t.response)||void 0===e?void 0:e.data)||(null==t?void 0:t.message)||"Upload failed";r(n)}))})))(e,i.url,(null==n?void 0:n.progressCallback)||(()=>{}))}catch(t){throw yield r(this,L,"f").call(this,i.key,"failed"),new Error("Failed to upload file: "+t)}return yield r(this,L,"f").call(this,i.key,"success"),i}console.error("Failed to generate upload URL")})),this.mintFile=(t,e,n)=>a(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");try{const i=yield this.uploadFile(t,n);if(!i||!i.key)return console.error("Invalid upload info:",i),null;const a=BigInt(Math.floor(Date.now()/1e3)+600),r=yield this.registerDataNFT("file",a,i.key),{tokenId:s,signerAddress:o,hash:d,v:u,r:l,s:p}=r;// 10 minutes from now
if(!s||!o||!d||void 0===u||void 0===l||void 0===p)return console.error("Invalid registration data:",r),null;const[c]=yield this.viemClient.request({method:"eth_requestAccounts",params:[]}),y={v:u,r:l,s:p};yield this.mintWithSignature(c,s,d,i.url,e,a,y);return s.toString()}catch(t){return console.error("Failed to upload file:",t),null}})),this.mintSocial=t=>a(this,void 0,void 0,(function*(){try{const e=BigInt(Math.floor(Date.now()/1e3)+600),n=yield this.registerDataNFT(t,e);// 10 minutes from now (temp)
return n?n.tokenId.toString():(console.error("Failed to register DataNFT"),null)}catch(t){return console.error("Failed to mint social DataNFT:",t),null}})),this.getOriginUploads=()=>a(this,void 0,void 0,(function*(){const t=yield fetch(`${w}/auth/origin/files`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`}});if(!t.ok)return console.error("Failed to get origin uploads"),null;return(yield t.json()).data})),this.jwt=e,this.viemClient=n,
// DataNFT methods
this.mintWithSignature=C.bind(this),this.registerDataNFT=M.bind(this),this.updateTerms=E.bind(this),this.requestDelete=x.bind(this),this.getTerms=S.bind(this),this.ownerOf=$.bind(this),this.balanceOf=D.bind(this),this.contentHash=F.bind(this),this.tokenURI=j.bind(this),this.dataStatus=P.bind(this),this.royaltyInfo=U.bind(this),this.getApproved=N.bind(this),this.isApprovedForAll=O.bind(this),this.transferFrom=B.bind(this),this.safeTransferFrom=_.bind(this),this.approve=W.bind(this),this.setApprovalForAll=q.bind(this),
// Marketplace methods
this.buyAccess=at.bind(this),this.renewAccess=rt.bind(this),this.hasAccess=st.bind(this),this.subscriptionExpiry=ot.bind(this)}getJwt(){return this.jwt}setViemClient(t){this.viemClient=t}
/**
     * Get the user's Origin stats (multiplier, consent, usage, etc.).
     * @returns {Promise<OriginUsageReturnType>} A promise that resolves with the user's Origin stats.
     */getOriginUsage(){return a(this,void 0,void 0,(function*(){const t=yield fetch(`${w}/auth/origin/usage`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"}}).then((t=>t.json()));if(!t.isError&&t.data.user)return t;throw new o(t.message||"Failed to fetch Origin usage")}))}
/**
     * Set the user's consent for Origin usage.
     * @param {boolean} consent The user's consent.
     * @returns {Promise<void>}
     * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the consent is not provided.
     */setOriginConsent(t){return a(this,void 0,void 0,(function*(){if(void 0===t)throw new o("Consent is required");const e=yield fetch(`${w}/auth/origin/status`,{method:"PATCH",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"},body:JSON.stringify({active:t})}).then((t=>t.json()));if(e.isError)throw new o(e.message||"Failed to set Origin consent")}))}
/**
     * Set the user's Origin multiplier.
     * @param {number} multiplier The user's Origin multiplier.
     * @returns {Promise<void>}
     * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the multiplier is not provided.
     */setOriginMultiplier(t){return a(this,void 0,void 0,(function*(){if(void 0===t)throw new o("Multiplier is required");const e=yield fetch(`${w}/auth/origin/multiplier`,{method:"PATCH",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"},body:JSON.stringify({multiplier:t})}).then((t=>t.json()));if(e.isError)throw new o(e.message||"Failed to set Origin multiplier")}))}
/**
     * Call a contract method.
     * @param {string} contractAddress The contract address.
     * @param {Abi} abi The contract ABI.
     * @param {string} methodName The method name.
     * @param {any[]} params The method parameters.
     * @param {CallOptions} [options] The call options.
     * @returns {Promise<any>} A promise that resolves with the result of the contract call or transaction hash.
     * @throws {Error} - Throws an error if the wallet client is not connected and the method is not a view function.
     */callContractMethod(t,n,i,s){return a(this,arguments,void 0,(function*(t,n,i,a,s={}){const o=e.getAbiItem({abi:n,name:i}),d=o&&"stateMutability"in o&&("view"===o.stateMutability||"pure"===o.stateMutability);if(!d&&!this.viemClient)throw new Error("WalletClient not connected.");if(d){const e=m();return(yield e.readContract({address:t,abi:n,functionName:i,args:a}))||null}{const[o]=yield this.viemClient.request({method:"eth_requestAccounts",params:[]}),d=e.encodeFunctionData({abi:n,functionName:i,args:a});yield r(this,R,"m",J).call(this,c);const u=yield this.viemClient.sendTransaction({to:t,data:d,account:o,value:s.value,gas:s.gas});if("string"!=typeof u)throw new Error("Transaction failed to send.");if(!s.waitForReceipt)return u;return yield r(this,R,"m",K).call(this,u)}}))}
/**
     * Buy access to an asset by first checking its price via getTerms, then calling buyAccess.
     * @param {bigint} tokenId The token ID of the asset.
     * @param {number} periods The number of periods to buy access for.
     * @returns {Promise<any>} The result of the buyAccess call.
     */buyAccessSmart(t,n){return a(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");const i=yield this.getTerms(t);if(!i)throw new Error("Failed to fetch terms for asset");const{price:r,paymentToken:s}=i;if(void 0===r||void 0===s)throw new Error("Terms missing price or paymentToken");const o=r*BigInt(n);if(s===e.zeroAddress)return this.buyAccess(t,n,o);const d=yield this.viemClient.getAddress();return yield function(t){return a(this,arguments,void 0,(function*({walletClient:t,publicClient:n,tokenAddress:i,owner:a,spender:r,amount:s}){(yield n.readContract({address:i,abi:e.erc20Abi,functionName:"allowance",args:[a,r]}))<s&&(yield t.writeContract({address:i,account:a,abi:e.erc20Abi,functionName:"approve",args:[r,s],chain:c}))}))}({walletClient:this.viemClient,publicClient:m(),tokenAddress:s,owner:d,spender:b,amount:o}),this.buyAccess(t,n)}))}getData(t){return a(this,void 0,void 0,(function*(){const e=yield fetch(`${w}/auth/origin/data/${t}`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!e.ok)throw new Error("Failed to fetch data");return e.json()}))}}z=new WeakMap,L=new WeakMap,R=new WeakSet,K=function(t){return a(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");for(;;){const e=yield this.viemClient.request({method:"eth_getTransactionReceipt",params:[t]});if(e&&e.blockNumber)return e;yield new Promise((t=>setTimeout(t,1e3)))}}))},J=function(t){return a(this,void 0,void 0,(function*(){
// return;
if(!this.viemClient)throw new Error("WalletClient not connected.");let e=yield this.viemClient.request({method:"eth_chainId",params:[]});if("string"==typeof e&&(e=parseInt(e,16)),e!==t.id)try{yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(t.id).toString(16)}]})}catch(e){
// Unrecognized chain
if(4902!==e.code)throw e;yield this.viemClient.request({method:"wallet_addEthereumChain",params:[{chainId:"0x"+BigInt(t.id).toString(16),chainName:t.name,rpcUrls:t.rpcUrls.default.http,nativeCurrency:t.nativeCurrency}]}),yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(t.id).toString(16)}]})}}))};G=new WeakMap,V=new WeakMap,H=new WeakSet,Z=function(t,e){r(this,G,"f")[t]&&r(this,G,"f")[t].forEach((t=>t(e)))},Q=function(t){return a(this,void 0,void 0,(function*(){var e,n;if("undefined"==typeof localStorage)return;const i=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:wallet-address"),a=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:user-id"),r=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:jwt");if(i&&a&&r){this.walletAddress=i,this.userId=a,this.jwt=r,this.origin=new dt(this.jwt),this.isAuthenticated=!0;let s=t;if(!s){const t=null!==(e=I())&&void 0!==e?e:[];for(const e of t)try{if((null===(n=(yield e.provider.request({method:"eth_requestAccounts"}))[0])||void 0===n?void 0:n.toLowerCase())===i.toLowerCase()){s=e;break}}catch(t){console.warn("Failed to fetch accounts from provider:",t)}}s?this.setProvider({provider:s.provider,info:s.info||{name:"Unknown"},address:i}):
// await this.disconnect();
console.warn("No matching provider found for the stored wallet address. User disconnected.")}else this.isAuthenticated=!1}))},Y=function(){return a(this,void 0,void 0,(function*(){try{const[t]=yield this.viem.requestAddresses();return this.walletAddress=t,t}catch(t){throw new o(t)}}))},X=function(){return a(this,void 0,void 0,(function*(){try{const t=yield fetch(`${w}/auth/client-user/nonce`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({walletAddress:this.walletAddress})}),e=yield t.json();return 200!==t.status?Promise.reject(e.message||"Failed to fetch nonce"):e.data}catch(t){throw new Error(t)}}))},tt=function(t,e){return a(this,void 0,void 0,(function*(){try{const n=yield fetch(`${w}/auth/client-user/verify`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({message:t,signature:e,walletAddress:this.walletAddress})}),i=yield n.json(),a=i.data.split(".")[1],r=JSON.parse(atob(a));return{success:!i.isError,userId:r.id,token:i.data}}catch(t){throw new o(t)}}))},et=function(t){return i.createSiweMessage({domain:window.location.host,address:this.walletAddress,statement:f,uri:window.location.origin,version:"1",chainId:this.viem.chain.id,nonce:t})},nt=function(t,e){return a(this,arguments,void 0,(function*(t,e,n=1){
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
constructor({clientId:t,redirectUri:e,allowAnalytics:n=!0,ackeeInstance:i}){if(H.add(this),G.set(this,void 0),V.set(this,void 0),!t)throw new Error("clientId is required");this.viem=null,
// if (typeof window !== "undefined") {
//   if (window.ethereum) this.viem = getClient(window.ethereum);
// }
this.redirectUri=(t=>{const e=["twitter","discord","spotify"];return"object"==typeof t?e.reduce(((e,n)=>(e[n]=t[n]||("undefined"!=typeof window?window.location.href:""),e)),{}):"string"==typeof t?e.reduce(((e,n)=>(e[n]=t,e)),{}):t?{}:e.reduce(((t,e)=>(t[e]="undefined"!=typeof window?window.location.href:"",t)),{})})(e),i&&s(this,V,i,"f"),n&&r(this,V,"f"),this.clientId=t,this.isAuthenticated=!1,this.jwt=null,this.origin=null,this.walletAddress=null,this.userId=null,s(this,G,{},"f"),A((t=>{r(this,H,"m",Z).call(this,"providers",t)})),r(this,H,"m",Q).call(this)}
/**
     * Subscribe to an event. Possible events are "state", "provider", "providers", and "viem".
     * @param {("state"|"provider"|"providers"|"viem")} event The event.
     * @param {function} callback The callback function.
     * @returns {void}
     * @example
     * auth.on("state", (state) => {
     *  console.log(state);
     * });
     */on(t,e){r(this,G,"f")[t]||(r(this,G,"f")[t]=[]),r(this,G,"f")[t].push(e),"providers"===t&&e(I())}
/**
     * Set the loading state.
     * @param {boolean} loading The loading state.
     * @returns {void}
     */setLoading(t){r(this,H,"m",Z).call(this,"state",t?"loading":this.isAuthenticated?"authenticated":"unauthenticated")}
/**
     * Set the provider. This is useful for setting the provider when the user selects a provider from the UI or when dApp wishes to use a specific provider.
     * @param {object} options The options object. Includes the provider and the provider info.
     * @returns {void}
     * @throws {APIError} - Throws an error if the provider is not provided.
     */setProvider({provider:t,info:i,address:a}){if(!t)throw new o("provider is required");this.viem=((t,i="window.ethereum",a)=>{var r;if(!t&&!y)return console.warn("Provider is required to create a client."),null;if(!y||y.transport.name!==i&&t||a!==(null===(r=y.account)||void 0===r?void 0:r.address)&&t){const r={chain:c,transport:e.custom(t,{name:i})};a&&(r.account=n.toAccount(a)),y=e.createWalletClient(r)}return y})(t,i.name,a),this.origin&&this.origin.setViemClient(this.viem),r(this,H,"m",Z).call(this,"viem",this.viem),r(this,H,"m",Z).call(this,"provider",{provider:t,info:i})}
/**
     * Set the wallet address. This is useful for edge cases where the provider can't return the wallet address. Don't use this unless you know what you're doing.
     * @param {string} walletAddress The wallet address.
     * @returns {void}
     */setWalletAddress(t){this.walletAddress=t}
/**
     * Disconnect the user.
     * @returns {Promise<void>}
     */disconnect(){return a(this,void 0,void 0,(function*(){this.isAuthenticated&&(r(this,H,"m",Z).call(this,"state","unauthenticated"),this.isAuthenticated=!1,this.walletAddress=null,this.userId=null,this.jwt=null,this.origin=null,localStorage.removeItem("camp-sdk:wallet-address"),localStorage.removeItem("camp-sdk:user-id"),localStorage.removeItem("camp-sdk:jwt"))}))}
/**
     * Connect the user's wallet and sign the message.
     * @returns {Promise<{ success: boolean; message: string; walletAddress: string }>} A promise that resolves with the authentication result.
     * @throws {APIError} - Throws an error if the user cannot be authenticated.
     */connect(){return a(this,void 0,void 0,(function*(){r(this,H,"m",Z).call(this,"state","loading");try{this.walletAddress||(yield r(this,H,"m",Y).call(this));const t=yield r(this,H,"m",X).call(this),e=r(this,H,"m",et).call(this,t),n=yield this.viem.signMessage({account:this.walletAddress,message:e}),i=yield r(this,H,"m",tt).call(this,e,n);if(i.success)return this.isAuthenticated=!0,this.userId=i.userId,this.jwt=i.token,this.origin=new dt(this.jwt,this.viem),localStorage.setItem("camp-sdk:jwt",this.jwt),localStorage.setItem("camp-sdk:wallet-address",this.walletAddress),localStorage.setItem("camp-sdk:user-id",this.userId),r(this,H,"m",Z).call(this,"state","authenticated"),yield r(this,H,"m",nt).call(this,v.USER_CONNECTED,"User Connected"),{success:!0,message:"Successfully authenticated",walletAddress:this.walletAddress};throw this.isAuthenticated=!1,r(this,H,"m",Z).call(this,"state","unauthenticated"),new o("Failed to authenticate")}catch(t){throw this.isAuthenticated=!1,r(this,H,"m",Z).call(this,"state","unauthenticated"),new o(t)}}))}
/**
     * Get the user's linked social accounts.
     * @returns {Promise<Record<string, boolean>>} A promise that resolves with the user's linked social accounts.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated or if the request fails.
     * @example
     * const auth = new Auth({ clientId: "your-client-id" });
     * const socials = await auth.getLinkedSocials();
     * console.log(socials);
     */getLinkedSocials(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const t=yield fetch(`${w}/auth/client-user/connections-sdk`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"}}).then((t=>t.json()));if(t.isError)throw new o(t.message||"Failed to fetch connections");{const e={};return Object.keys(t.data.data).forEach((n=>{e[n.split("User")[0]]=t.data.data[n]})),e}}))}
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
     */linkTikTok(t){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${w}/tiktok/connect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userHandle:t,clientId:this.clientId,userId:this.userId})}).then((t=>t.json()));if(e.isError)throw"Request failed with status code 502"===e.message?new o("TikTok service is currently unavailable, try again later"):new o(e.message||"Failed to link TikTok account");return r(this,H,"m",nt).call(this,v.TIKTOK_LINKED,"TikTok Linked"),e.data}))}
/**
     * Send an OTP to the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @returns {Promise<any>} A promise that resolves with the OTP data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */sendTelegramOTP(t){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!t)throw new o("Phone number is required");yield this.unlinkTelegram();const e=yield fetch(`${w}/telegram/sendOTP-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:t})}).then((t=>t.json()));if(e.isError)throw new o(e.message||"Failed to send Telegram OTP");return e.data}))}
/**
     * Link the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @param {string} otp The OTP.
     * @param {string} phoneCodeHash The phone code hash.
     * @returns {Promise<object>} A promise that resolves with the Telegram account data.
     * @throws {APIError|Error} - Throws an error if the user is not authenticated. Also throws an error if the phone number, OTP, and phone code hash are not provided.
     */linkTelegram(t,e,n){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!t||!e||!n)throw new o("Phone number, OTP, and phone code hash are required");const i=yield fetch(`${w}/telegram/signIn-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:t,code:e,phone_code_hash:n,userId:this.userId,clientId:this.clientId})}).then((t=>t.json()));if(i.isError)throw new o(i.message||"Failed to link Telegram account");return r(this,H,"m",nt).call(this,v.TELEGRAM_LINKED,"Telegram Linked"),i.data}))}
/**
     * Unlink the user's Twitter account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTwitter(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const t=yield fetch(`${w}/twitter/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((t=>t.json()));if(t.isError)throw new o(t.message||"Failed to unlink Twitter account");return t.data}))}
/**
     * Unlink the user's Discord account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkDiscord(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new o("User needs to be authenticated");const t=yield fetch(`${w}/discord/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((t=>t.json()));if(t.isError)throw new o(t.message||"Failed to unlink Discord account");return t.data}))}
/**
     * Unlink the user's Spotify account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkSpotify(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new o("User needs to be authenticated");const t=yield fetch(`${w}/spotify/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((t=>t.json()));if(t.isError)throw new o(t.message||"Failed to unlink Spotify account");return t.data}))}
/**
     * Unlink the user's TikTok account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTikTok(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new o("User needs to be authenticated");const t=yield fetch(`${w}/tiktok/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((t=>t.json()));if(t.isError)throw new o(t.message||"Failed to unlink TikTok account");return t.data}))}
/**
     * Unlink the user's Telegram account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTelegram(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new o("User needs to be authenticated");const t=yield fetch(`${w}/telegram/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((t=>t.json()));if(t.isError)throw new o(t.message||"Failed to unlink Telegram account");return t.data}))}},exports.SpotifyAPI=
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
constructor(t){this.apiKey=t.apiKey}
/**
     * Fetch the user's saved tracks by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved tracks.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedTracksById(t){return a(this,void 0,void 0,(function*(){const e=u(`${p}/save-tracks`,{spotifyId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch the played tracks of a user by Spotify ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The played tracks.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchPlayedTracksById(t){return a(this,void 0,void 0,(function*(){const e=u(`${p}/played-tracks`,{spotifyId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch the user's saved albums by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved albums.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedAlbumsById(t){return a(this,void 0,void 0,(function*(){const e=u(`${p}/saved-albums`,{spotifyId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch the user's saved playlists by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved playlists.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedPlaylistsById(t){return a(this,void 0,void 0,(function*(){const e=u(`${p}/saved-playlists`,{spotifyId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch the tracks of an album by album ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} albumId - The album ID.
     * @returns {Promise<object>} - The tracks in the album.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInAlbum(t,e){return a(this,void 0,void 0,(function*(){const n=u(`${p}/album/tracks`,{spotifyId:t,albumId:e});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch the tracks in a playlist by playlist ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} playlistId - The playlist ID.
     * @returns {Promise<object>} - The tracks in the playlist.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInPlaylist(t,e){return a(this,void 0,void 0,(function*(){const n=u(`${p}/playlist/tracks`,{spotifyId:t,playlistId:e});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch the user's Spotify data by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @returns {Promise<object>} - The user's Spotify data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(t){return a(this,void 0,void 0,(function*(){const e=u(`${p}/wallet-spotify-data`,{walletAddress:t});return this._fetchDataWithAuth(e)}))}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(t){return a(this,void 0,void 0,(function*(){if(!this.apiKey)throw new o("API key is required for fetching data",401);try{return yield d(t,{"x-api-key":this.apiKey})}catch(t){throw new o(t.message,t.statusCode)}}))}},exports.TwitterAPI=
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
constructor({apiKey:t}){this.apiKey=t}
/**
     * Fetch Twitter user details by username.
     * @param {string} twitterUserName - The Twitter username.
     * @returns {Promise<object>} - The user details.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByUsername(t){return a(this,void 0,void 0,(function*(){const e=u(`${l}/user`,{twitterUserName:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetsByUsername(t){return a(this,arguments,void 0,(function*(t,e=1,n=10){const i=u(`${l}/tweets`,{twitterUserName:t,page:e,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch followers by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The followers.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowersByUsername(t){return a(this,arguments,void 0,(function*(t,e=1,n=10){const i=u(`${l}/followers`,{twitterUserName:t,page:e,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch following by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The following.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowingByUsername(t){return a(this,arguments,void 0,(function*(t,e=1,n=10){const i=u(`${l}/following`,{twitterUserName:t,page:e,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch tweet by tweet ID.
     * @param {string} tweetId - The tweet ID.
     * @returns {Promise<object>} - The tweet.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetById(t){return a(this,void 0,void 0,(function*(){const e=u(`${l}/getTweetById`,{tweetId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch user by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The user data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(t){return a(this,arguments,void 0,(function*(t,e=1,n=10){const i=u(`${l}/wallet-twitter-data`,{walletAddress:t,page:e,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch reposted tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The reposted tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepostedByUsername(t){return a(this,arguments,void 0,(function*(t,e=1,n=10){const i=u(`${l}/reposted`,{twitterUserName:t,page:e,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch replies by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The replies.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepliesByUsername(t){return a(this,arguments,void 0,(function*(t,e=1,n=10){const i=u(`${l}/replies`,{twitterUserName:t,page:e,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch likes by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The likes.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchLikesByUsername(t){return a(this,arguments,void 0,(function*(t,e=1,n=10){const i=u(`${l}/event/likes/${t}`,{page:e,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch follows by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The follows.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowsByUsername(t){return a(this,arguments,void 0,(function*(t,e=1,n=10){const i=u(`${l}/event/follows/${t}`,{page:e,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch viewed tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The viewed tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchViewedTweetsByUsername(t){return a(this,arguments,void 0,(function*(t,e=1,n=10){const i=u(`${l}/event/viewed-tweets/${t}`,{page:e,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(t){return a(this,void 0,void 0,(function*(){if(!this.apiKey)throw new o("API key is required for fetching data",401);try{return yield d(t,{"x-api-key":this.apiKey})}catch(t){throw new o(t.message,t.statusCode)}}))}};
