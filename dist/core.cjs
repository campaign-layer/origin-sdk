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
function a(e,t,n,i){return new(n||(n=Promise))((function(a,r){function s(e){try{d(i.next(e))}catch(e){r(e)}}function o(e){try{d(i.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?a(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,o)}d((i=i.apply(e,t||[])).next())}))}function r(e,t,n,i){if("a"===n&&!i)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!i:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===n?i:"a"===n?i.call(e):i?i.value:t.get(e)}"function"==typeof SuppressedError&&SuppressedError;class s extends Error{constructor(e,t){super(e),this.name="APIError",this.statusCode=t||500,Error.captureStackTrace(this,this.constructor)}toJSON(){return{error:this.name,message:this.message,statusCode:this.statusCode||500}}}
/**
 * Makes a GET request to the given URL with the provided headers.
 *
 * @param {string} url - The URL to send the GET request to.
 * @param {object} headers - The headers to include in the request.
 * @returns {Promise<object>} - The response data.
 * @throws {APIError} - Throws an error if the request fails.
 */function o(t){return a(this,arguments,void 0,(function*(t,n={}){try{return(yield e.get(t,{headers:n})).data}catch(e){if(e.response)throw new s(e.response.data.message||"API request failed",e.response.status);throw new s("Network error or server is unavailable",500)}}))}
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
function d(e,t={}){const n=function(e={}){return Object.keys(e).map((t=>`${encodeURIComponent(t)}=${encodeURIComponent(e[t])}`)).join("&")}(t);return n?`${e}?${n}`:e}const u="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/twitter",p="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/spotify";const l={id:123420001114,name:"Basecamp",nativeCurrency:{decimals:18,name:"Camp",symbol:"CAMP"},rpcUrls:{default:{http:["https://rpc-campnetwork.xyz","https://rpc.basecamp.t.raas.gelato.cloud"]}},blockExplorers:{default:{name:"Explorer",url:"https://basecamp.cloud.blockscout.com/"}}};
// @ts-ignore
let y=null,c=null,h=null;const m=e=>{var n;const i=h||l;return c&&(null===(n=c.chain)||void 0===n?void 0:n.id)===i.id||(c=t.createPublicClient({chain:i,transport:t.http()})),c};var T=[{inputs:[{internalType:"string",name:"name_",type:"string"},{internalType:"string",name:"symbol_",type:"string"},{internalType:"uint256",name:"maxTermDuration_",type:"uint256"},{internalType:"address",name:"signer_",type:"address"},{internalType:"address",name:"wCAMP_",type:"address"},{internalType:"uint256",name:"minTermDuration_",type:"uint256"},{internalType:"uint256",name:"minPrice_",type:"uint256"},{internalType:"uint256",name:"maxRoyaltyBps_",type:"uint256"}],stateMutability:"nonpayable",type:"constructor"},{inputs:[{internalType:"address",name:"sender",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"address",name:"owner",type:"address"}],name:"ERC721IncorrectOwner",type:"error"},{inputs:[{internalType:"address",name:"operator",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"ERC721InsufficientApproval",type:"error"},{inputs:[{internalType:"address",name:"approver",type:"address"}],name:"ERC721InvalidApprover",type:"error"},{inputs:[{internalType:"address",name:"operator",type:"address"}],name:"ERC721InvalidOperator",type:"error"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"ERC721InvalidOwner",type:"error"},{inputs:[{internalType:"address",name:"receiver",type:"address"}],name:"ERC721InvalidReceiver",type:"error"},{inputs:[{internalType:"address",name:"sender",type:"address"}],name:"ERC721InvalidSender",type:"error"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"ERC721NonexistentToken",type:"error"},{inputs:[],name:"EnforcedPause",type:"error"},{inputs:[],name:"ExpectedPause",type:"error"},{inputs:[],name:"InvalidDeadline",type:"error"},{inputs:[],name:"InvalidDuration",type:"error"},{inputs:[],name:"InvalidPaymentToken",type:"error"},{inputs:[],name:"InvalidPrice",type:"error"},{inputs:[],name:"InvalidRoyalty",type:"error"},{inputs:[],name:"InvalidSignature",type:"error"},{inputs:[],name:"NotTokenOwner",type:"error"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"OwnableInvalidOwner",type:"error"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"OwnableUnauthorizedAccount",type:"error"},{inputs:[],name:"TokenAlreadyExists",type:"error"},{inputs:[],name:"Unauthorized",type:"error"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"buyer",type:"address"},{indexed:!1,internalType:"uint32",name:"periods",type:"uint32"},{indexed:!1,internalType:"uint256",name:"newExpiry",type:"uint256"},{indexed:!1,internalType:"uint256",name:"amountPaid",type:"uint256"}],name:"AccessPurchased",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"owner",type:"address"},{indexed:!0,internalType:"address",name:"approved",type:"address"},{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"}],name:"Approval",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"owner",type:"address"},{indexed:!0,internalType:"address",name:"operator",type:"address"},{indexed:!1,internalType:"bool",name:"approved",type:"bool"}],name:"ApprovalForAll",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"id",type:"uint256"},{indexed:!0,internalType:"uint256",name:"childIp",type:"uint256"},{indexed:!1,internalType:"uint256",name:"parentIp",type:"uint256"}],name:"ChildIpTagged",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"}],name:"DataDeleted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"bytes32",name:"contentHash",type:"bytes32"},{indexed:!1,internalType:"uint256[]",name:"parents",type:"uint256[]"}],name:"DataMinted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"id",type:"uint256"},{indexed:!1,internalType:"bytes32",name:"counterEvidenceHash",type:"bytes32"}],name:"DisputeAssertion",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"id",type:"uint256"}],name:"DisputeCancelled",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"id",type:"uint256"},{indexed:!1,internalType:"bool",name:"judgement",type:"bool"}],name:"DisputeJudged",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"disputeModule",type:"address"}],name:"DisputeModuleUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"id",type:"uint256"},{indexed:!0,internalType:"address",name:"initiator",type:"address"},{indexed:!0,internalType:"uint256",name:"targetId",type:"uint256"},{indexed:!1,internalType:"bytes32",name:"disputeTag",type:"bytes32"}],name:"DisputeRaised",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"marketPlace",type:"address"}],name:"MarketPlaceUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"previousOwner",type:"address"},{indexed:!0,internalType:"address",name:"newOwner",type:"address"}],name:"OwnershipTransferred",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Paused",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint256",name:"royaltyAmount",type:"uint256"},{indexed:!1,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"uint256",name:"protocolAmount",type:"uint256"}],name:"RoyaltyPaid",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"signer",type:"address"}],name:"SignerUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"enum IIpNFT.DataStatus",name:"status",type:"uint8"}],name:"StatusUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint128",name:"newPrice",type:"uint128"},{indexed:!1,internalType:"uint32",name:"newDuration",type:"uint32"},{indexed:!1,internalType:"uint16",name:"newRoyaltyBps",type:"uint16"},{indexed:!1,internalType:"address",name:"paymentToken",type:"address"}],name:"TermsUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"from",type:"address"},{indexed:!0,internalType:"address",name:"to",type:"address"},{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"}],name:"Transfer",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Unpaused",type:"event"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"approve",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"balanceOf",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"dataStatus",outputs:[{internalType:"enum IIpNFT.DataStatus",name:"",type:"uint8"}],stateMutability:"view",type:"function"},{inputs:[],name:"disputeModule",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"finalizeDelete",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"getApproved",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"tokenOwner",type:"address"}],name:"getOrCreateRoyaltyVault",outputs:[{internalType:"address",name:"vault",type:"address"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"getTerms",outputs:[{components:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],internalType:"struct IIpNFT.LicenseTerms",name:"",type:"tuple"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"owner",type:"address"},{internalType:"address",name:"operator",type:"address"}],name:"isApprovedForAll",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"_tokenId",type:"uint256"}],name:"markDisputed",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"marketPlace",outputs:[{internalType:"contract IMarketplace",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"maxRoyaltyBps",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"maxTermDuration",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"minPrice",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"minTermDuration",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"bytes32",name:"creatorContentHash",type:"bytes32"},{internalType:"string",name:"uri",type:"string"},{components:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],internalType:"struct IIpNFT.LicenseTerms",name:"licenseTerms",type:"tuple"},{internalType:"uint256",name:"deadline",type:"uint256"},{internalType:"uint256[]",name:"parents",type:"uint256[]"},{internalType:"bytes",name:"signature",type:"bytes"}],name:"mintWithSignature",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"name",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[],name:"owner",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"ownerOf",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"pause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"paused",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"renounceOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"safeTransferFrom",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"bytes",name:"data",type:"bytes"}],name:"safeTransferFrom",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"operator",type:"address"},{internalType:"bool",name:"approved",type:"bool"}],name:"setApprovalForAll",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_disputeModule",type:"address"}],name:"setDisputeModule",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_marketPlace",type:"address"}],name:"setMarketPlace",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_signer",type:"address"}],name:"setSigner",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"signer",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"bytes4",name:"interfaceId",type:"bytes4"}],name:"supportsInterface",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"symbol",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"tokenInfo",outputs:[{internalType:"string",name:"tokenURI",type:"string"},{internalType:"bytes32",name:"contentHash",type:"bytes32"},{components:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],internalType:"struct IIpNFT.LicenseTerms",name:"terms",type:"tuple"},{internalType:"enum IIpNFT.DataStatus",name:"status",type:"uint8"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"_tokenId",type:"uint256"}],name:"tokenURI",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"transferFrom",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"newOwner",type:"address"}],name:"transferOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"unpause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"},{components:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],internalType:"struct IIpNFT.LicenseTerms",name:"newTerms",type:"tuple"}],name:"updateTerms",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"wCAMP",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"}],f=[{inputs:[{internalType:"address",name:"dataNFT_",type:"address"},{internalType:"uint16",name:"protocolFeeBps_",type:"uint16"},{internalType:"address",name:"treasury_",type:"address"}],stateMutability:"nonpayable",type:"constructor"},{inputs:[],name:"EnforcedPause",type:"error"},{inputs:[],name:"ExpectedPause",type:"error"},{inputs:[],name:"InvalidParentIp",type:"error"},{inputs:[],name:"InvalidPayment",type:"error"},{inputs:[],name:"InvalidRoyalty",type:"error"},{inputs:[],name:"MaxParentsExceeded",type:"error"},{inputs:[],name:"MaxRoyaltyExceeded",type:"error"},{inputs:[],name:"NoSubscriptionFound",type:"error"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"OwnableInvalidOwner",type:"error"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"OwnableUnauthorizedAccount",type:"error"},{inputs:[],name:"ParentAlreadyExists",type:"error"},{inputs:[],name:"ParentIpAlreadyDeleted",type:"error"},{inputs:[],name:"ParentIpAlreadyDisputed",type:"error"},{inputs:[],name:"TermsMismatch",type:"error"},{inputs:[],name:"Unauthorized",type:"error"},{inputs:[],name:"ZeroAddress",type:"error"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"buyer",type:"address"},{indexed:!1,internalType:"uint32",name:"periods",type:"uint32"},{indexed:!1,internalType:"uint256",name:"newExpiry",type:"uint256"},{indexed:!1,internalType:"uint256",name:"amountPaid",type:"uint256"}],name:"AccessPurchased",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"id",type:"uint256"},{indexed:!0,internalType:"uint256",name:"childIp",type:"uint256"},{indexed:!1,internalType:"uint256",name:"parentIp",type:"uint256"}],name:"ChildIpTagged",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"}],name:"DataDeleted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"bytes32",name:"contentHash",type:"bytes32"}],name:"DataMinted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"id",type:"uint256"},{indexed:!1,internalType:"bytes32",name:"counterEvidenceHash",type:"bytes32"}],name:"DisputeAssertion",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"id",type:"uint256"}],name:"DisputeCancelled",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"id",type:"uint256"},{indexed:!1,internalType:"bool",name:"judgement",type:"bool"}],name:"DisputeJudged",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"disputeModule",type:"address"}],name:"DisputeModuleUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"id",type:"uint256"},{indexed:!0,internalType:"address",name:"initiator",type:"address"},{indexed:!0,internalType:"uint256",name:"targetId",type:"uint256"},{indexed:!1,internalType:"bytes32",name:"disputeTag",type:"bytes32"}],name:"DisputeRaised",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"marketPlace",type:"address"}],name:"MarketPlaceUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"previousOwner",type:"address"},{indexed:!0,internalType:"address",name:"newOwner",type:"address"}],name:"OwnershipTransferred",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Paused",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint256",name:"royaltyAmount",type:"uint256"},{indexed:!1,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"uint256",name:"protocolAmount",type:"uint256"}],name:"RoyaltyPaid",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"signer",type:"address"}],name:"SignerUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"enum IIpNFT.DataStatus",name:"status",type:"uint8"}],name:"StatusUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint128",name:"newPrice",type:"uint128"},{indexed:!1,internalType:"uint32",name:"newDuration",type:"uint32"},{indexed:!1,internalType:"uint16",name:"newRoyaltyBps",type:"uint16"},{indexed:!1,internalType:"address",name:"paymentToken",type:"address"}],name:"TermsUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Unpaused",type:"event"},{inputs:[],name:"MAX_PARENTS",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"buyer",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint256",name:"expectedPrice",type:"uint256"},{internalType:"uint32",name:"expectedDuration",type:"uint32"},{internalType:"address",name:"expectedPaymentToken",type:"address"}],name:"buyAccess",outputs:[],stateMutability:"payable",type:"function"},{inputs:[{internalType:"uint256",name:"ipId",type:"uint256"},{internalType:"uint256",name:"parent",type:"uint256"}],name:"hasParentIp",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"ipToken",outputs:[{internalType:"contract IIpNFT",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"owner",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"},{internalType:"uint256",name:"",type:"uint256"}],name:"parentRoyaltyPercent",outputs:[{internalType:"uint16",name:"",type:"uint16"}],stateMutability:"view",type:"function"},{inputs:[],name:"pause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"paused",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"protocolFeeBps",outputs:[{internalType:"uint16",name:"",type:"uint16"}],stateMutability:"view",type:"function"},{inputs:[],name:"renounceOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"royaltyStack",outputs:[{internalType:"uint16",name:"",type:"uint16"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"childIpId",type:"uint256"},{internalType:"uint256[]",name:"parents",type:"uint256[]"},{internalType:"address",name:"creator",type:"address"}],name:"setParentIpsAndRoyaltyPercents",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"},{internalType:"address",name:"",type:"address"}],name:"subscriptionExpiry",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"newOwner",type:"address"}],name:"transferOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"treasury",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"unpause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint16",name:"newFeeBps",type:"uint16"}],name:"updateProtocolFee",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"newTreasury",type:"address"}],name:"updateTreasury",outputs:[],stateMutability:"nonpayable",type:"function"}],v=[{type:"constructor",inputs:[{name:"_owner",type:"address",internalType:"address"}],stateMutability:"nonpayable"},{type:"receive",stateMutability:"payable"},{type:"function",name:"claimRoyalty",inputs:[{name:"token",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"owner",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"renounceOwnership",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"transferOwnership",inputs:[{name:"newOwner",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"event",name:"OwnershipTransferred",inputs:[{name:"previousOwner",type:"address",indexed:!0,internalType:"address"},{name:"newOwner",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"error",name:"OwnableInvalidOwner",inputs:[{name:"owner",type:"address",internalType:"address"}]},{type:"error",name:"OwnableUnauthorizedAccount",inputs:[{name:"account",type:"address",internalType:"address"}]}],w="Connect with Camp Network",A={USER_CONNECTED:"ed42542d-b676-4112-b6d9-6db98048b2e0",USER_DISCONNECTED:"20af31ac-e602-442e-9e0e-b589f4dd4016",TWITTER_LINKED:"7fbea086-90ef-4679-ba69-f47f9255b34c",DISCORD_LINKED:"d73f5ae3-a8e8-48f2-8532-85e0c7780d6a",SPOTIFY_LINKED:"fc1788b4-c984-42c8-96f4-c87f6bb0b8f7",TIKTOK_LINKED:"4a2ffdd3-f0e9-4784-8b49-ff76ec1c0a6a",TELEGRAM_LINKED:"9006bc5d-bcc9-4d01-a860-4f1a201e8e47"};const I={DEVELOPMENT:{NAME:"DEVELOPMENT",AUTH_HUB_BASE_API:"https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",AUTH_ENDPOINT:"auth-testnet",ORIGIN_DASHBOARD:"https://origin.campnetwork.xyz",DATANFT_CONTRACT_ADDRESS:"0x8EB0E8C3bA99c04F05ab01A5BED34F00c6c3BE4D",MARKETPLACE_CONTRACT_ADDRESS:"0x2947eE8a352158fda08F2cf5c0AE8e5b1DFCfDc9",CHAIN:l,IPNFT_ABI:T,MARKETPLACE_ABI:f,ROYALTY_VAULT_ABI:v},PRODUCTION:{NAME:"PRODUCTION",AUTH_HUB_BASE_API:"https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",AUTH_ENDPOINT:"auth-mainnet",ORIGIN_DASHBOARD:"https://origin.campnetwork.xyz",DATANFT_CONTRACT_ADDRESS:"0x54d8490f034e3A4D07CD220a7Dc88D9B91B82c25",MARKETPLACE_CONTRACT_ADDRESS:"0x5D2be63c94931f82B602Ecd1538064ab4196F8e7",CHAIN:{id:484,name:"Camp Network",nativeCurrency:{decimals:18,name:"Camp",symbol:"CAMP"},rpcUrls:{default:{http:["https://rpc.camp.raas.gelato.cloud/"]}},blockExplorers:{default:{name:"Explorer",url:"https://camp.cloud.blockscout.com/"}}},IPNFT_ABI:T,MARKETPLACE_ABI:f,ROYALTY_VAULT_ABI:v}};let b=[];const g=()=>b,E=e=>{function t(t){b.some((e=>e.info.uuid===t.detail.info.uuid))||(b=[...b,t.detail],e(b))}if("undefined"!=typeof window)return window.addEventListener("eip6963:announceProvider",t),window.dispatchEvent(new Event("eip6963:requestProvider")),()=>window.removeEventListener("eip6963:announceProvider",t)};
/**
 * Mints a Data NFT with a signature.
 * @param to The address to mint the NFT to.
 * @param tokenId The ID of the token to mint.
 * @param parents The IDs of the parent NFTs, if applicable.
 * @param hash The hash of the data associated with the NFT.
 * @param uri The URI of the NFT metadata.
 * @param licenseTerms The terms of the license for the NFT.
 * @param deadline The deadline for the minting operation.
 * @param signature The signature for the minting operation.
 * @returns A promise that resolves when the minting is complete.
 */function _(e,t,n,i,r,s,o,d){return a(this,void 0,void 0,(function*(){return yield this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"mintWithSignature",[e,t,i,r,s,o,n,d],{waitForReceipt:!0})}))}
/**
 * Registers a Data NFT with the Origin service in order to obtain a signature for minting.
 * @param source The source of the Data NFT (e.g., "spotify", "twitter", "tiktok", or "file").
 * @param deadline The deadline for the registration operation.
 * @param fileKey Optional file key for file uploads.
 * @return A promise that resolves with the registration data.
 */function C(e,t,n,i,r,s){return a(this,void 0,void 0,(function*(){const a={source:e,deadline:Number(t),licenseTerms:{price:n.price.toString(),duration:n.duration,royaltyBps:n.royaltyBps,paymentToken:n.paymentToken},metadata:i,parentId:s||[]};void 0!==r&&(a.fileKey=r);const o=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/register`,{method:"POST",headers:{Authorization:`Bearer ${this.getJwt()}`,"Content-Type":"application/json"},body:JSON.stringify(a)});if(!o.ok)throw new Error(`Failed to get signature: ${o.statusText}`);const d=yield o.json();if(d.isError)throw new Error(`Failed to get signature: ${d.message}`);return d.data}))}
/**
 * Updates the license terms of a specified IPNFT.
 * @param tokenId The ID of the IPNFT to update.
 * @param newTerms The new license terms to set.
 * @returns A promise that resolves when the transaction is complete.
 */function k(e,t){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"updateTerms",[e,t],{waitForReceipt:!0})}
/**
 * Sets the IPNFT as deleted
 * @param tokenId The token ID to set as deleted.
 * @returns A promise that resolves when the transaction is complete.
 */function S(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"finalizeDelete",[e])}
/**
 * Calls the getOrCreateRoyaltyVault method on the IPNFT contract.
 * @param tokenOwner The address of the token owner for whom to get or create the royalty vault.
 * @param simulateOnly If true, simulates the transaction without executing it.
 * @returns The address of the royalty vault associated with the specified token owner.
 */function D(e){return a(this,arguments,void 0,(function*(e,t=!1){const n=yield this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"getOrCreateRoyaltyVault",[e],{waitForReceipt:!0,simulate:t});return t?n:n.simulatedResult}))}
/**
 * Returns the license terms associated with a specific token ID.
 * @param tokenId The token ID to query.
 * @returns The license terms of the token ID.
 */function N(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"getTerms",[e])}
/**
 * Returns the owner of the specified IPNFT.
 * @param tokenId The ID of the IPNFT to query.
 * @returns The address of the owner of the IPNFT.
 */function P(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"ownerOf",[e])}
/**
 * Returns the number of IPNFTs owned by the given address.
 * @param owner The address to query.
 * @returns The number of IPNFTs owned by the address.
 */function x(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"balanceOf",[e])}
/**
 * Returns the metadata URI associated with a specific token ID.
 * @param tokenId The token ID to query.
 * @returns The metadata URI of the token ID.
 */function O(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"tokenURI",[e])}
/**
 * Returns the data status of the given token ID.
 * @param tokenId The token ID to query.
 * @returns The data status of the token ID.
 */function U(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"dataStatus",[e])}
/**
 * Checks if an operator is approved to manage all assets of a given owner.
 * @param owner The address of the asset owner.
 * @param operator The address of the operator to check.
 * @return A promise that resolves to a boolean indicating if the operator is approved for all assets of the owner.
 */function M(e,t){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"isApprovedForAll",[e,t])}function B(e,t,n){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"transferFrom",[e,t,n])}function R(e,t,n,i){const a=i?[e,t,n,i]:[e,t,n];return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"safeTransferFrom",a)}function F(e,t){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"approve",[e,t])}function $(e,t){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"setApprovalForAll",[e,t])}
/**
 * Buys access to a data NFT for a specified duration.
 * @param buyer The address of the buyer.
 * @param tokenId The ID of the data NFT.
 * @param expectedPrice The expected price for the access.
 * @param expectedDuration The expected duration of the access in seconds.
 * @param expectedPaymentToken The address of the payment token (use zero address for native token).
 * @param value The amount of native token to send (only required if paying with native token).
 * @returns A promise that resolves when the transaction is confirmed.
 */function H(e,t,n,i,a,r){return this.callContractMethod(this.environment.MARKETPLACE_CONTRACT_ADDRESS,this.environment.MARKETPLACE_ABI,"buyAccess",[e,t,n,i,a],{waitForReceipt:!0,value:r})}
/**
 * Checks if a user has access to a specific token based on subscription expiry.
 * @param user - The address of the user.
 * @param tokenId - The ID of the token.
 * @returns A promise that resolves to a boolean indicating if the user has access.
 */function j(e,t){return a(this,void 0,void 0,(function*(){try{const n=yield this.subscriptionExpiry(t,e);return n>BigInt(Math.floor(Date.now()/1e3))}catch(e){return!1}}))}function L(e,t){return this.callContractMethod(this.environment.MARKETPLACE_CONTRACT_ADDRESS,this.environment.MARKETPLACE_ABI,"subscriptionExpiry",[e,t])}
/**
 * Approves a spender to spend a specified amount of tokens on behalf of the owner.
 * If the current allowance is less than the specified amount, it will perform the approval.
 * @param {ApproveParams} params - The parameters for the approval.
 */var q,W,z,K,J,V,G,Y,X,Z,Q,ee,te,ne,ie,ae;
/**
 * The Origin class
 * Handles the upload of files to Origin, as well as querying the user's stats
 */class re{constructor(e,t,n){q.add(this),this.jwt=e,this.viemClient=n,this.environment=t,
// DataNFT methods
this.mintWithSignature=_.bind(this),this.registerIpNFT=C.bind(this),this.updateTerms=k.bind(this),this.finalizeDelete=S.bind(this),this.getOrCreateRoyaltyVault=D.bind(this),this.getTerms=N.bind(this),this.ownerOf=P.bind(this),this.balanceOf=x.bind(this),this.tokenURI=O.bind(this),this.dataStatus=U.bind(this),this.isApprovedForAll=M.bind(this),this.transferFrom=B.bind(this),this.safeTransferFrom=R.bind(this),this.approve=F.bind(this),this.setApprovalForAll=$.bind(this),
// Marketplace methods
this.buyAccess=H.bind(this),this.hasAccess=j.bind(this),this.subscriptionExpiry=L.bind(this)}getJwt(){return this.jwt}setViemClient(e){this.viemClient=e}uploadFile(t,n){return a(this,void 0,void 0,(function*(){let i;try{i=yield r(this,q,"m",W).call(this,t)}catch(e){throw console.error("Failed to generate upload URL:",e),new Error(`Failed to generate upload URL: ${e instanceof Error?e.message:String(e)}`)}if(!i)throw new Error("Failed to generate upload URL: No upload info returned");try{yield((t,n,i)=>new Promise(((a,r)=>{e.put(n,t,Object.assign({headers:{"Content-Type":t.type}},"undefined"!=typeof window&&"function"==typeof i?{onUploadProgress:e=>{if(e.total){const t=e.loaded/e.total*100;i(t)}}}:{})).then((e=>{a(e.data)})).catch((e=>{var t;const n=(null===(t=null==e?void 0:e.response)||void 0===t?void 0:t.data)||(null==e?void 0:e.message)||"Upload failed";r(n)}))})))(t,i.url,(null==n?void 0:n.progressCallback)||(()=>{}))}catch(e){try{yield r(this,q,"m",z).call(this,i.key,"failed")}catch(e){console.error("Failed to update status to failed:",e)}const t=e instanceof Error?e.message:String(e);throw new Error(`Failed to upload file: ${t}`)}try{yield r(this,q,"m",z).call(this,i.key,"success")}catch(e){console.error("Failed to update status to success:",e)}return i}))}mintFile(e,t,n,i,r){return a(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");const a=yield this.uploadFile(e,r);if(!a||!a.key)throw new Error("Failed to upload file or get upload info.");const s=BigInt(Date.now()+6e5),o=yield this.registerIpNFT("file",s,n,t,a.key,i),{tokenId:d,signerAddress:u,creatorContentHash:p,signature:l,uri:y}=o;// 10 minutes from now
if(!(d&&u&&p&&void 0!==l&&y))throw new Error("Failed to register IpNFT: Missing required fields in registration response.");const c=(yield this.viemClient.request({method:"eth_requestAccounts",params:[]}))[0],h=yield this.mintWithSignature(c,d,i||[],p,y,n,s,l);if("0x1"!==h.status)throw console.error("Minting failed:",h),new Error(`Minting failed with status: ${h.status}`);return d.toString()}))}mintSocial(e,t,n){return a(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");const i=BigInt(Math.floor(Date.now()/1e3)+600),a=yield this.registerIpNFT(e,i,n,t),{tokenId:r,signerAddress:s,creatorContentHash:o,signature:d,uri:u}=a;// 10 minutes from now
if(!(r&&s&&o&&void 0!==d&&u))throw new Error("Failed to register Social IpNFT: Missing required fields in registration response.");const p=(yield this.viemClient.request({method:"eth_requestAccounts",params:[]}))[0],l=yield this.mintWithSignature(p,r,[],o,u,n,i,d);if("0x1"!==l.status)throw new Error(`Minting Social IpNFT failed with status: ${l.status}`);return r.toString()}))}getOriginUploads(){return a(this,void 0,void 0,(function*(){const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/files`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`}});if(!e.ok)return console.error("Failed to get origin uploads"),null;return(yield e.json()).data}))}
/**
     * Get the user's Origin stats (multiplier, consent, usage, etc.).
     * @returns {Promise<OriginUsageReturnType>} A promise that resolves with the user's Origin stats.
     */getOriginUsage(){return a(this,void 0,void 0,(function*(){const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/usage`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}}).then((e=>e.json()));if(!e.isError&&e.data.user)return e;throw new s(e.message||"Failed to fetch Origin usage")}))}
/**
     * Set the user's consent for Origin usage.
     * @param {boolean} consent The user's consent.
     * @returns {Promise<void>}
     * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the consent is not provided.
     */setOriginConsent(e){return a(this,void 0,void 0,(function*(){if(void 0===e)throw new s("Consent is required");const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/status`,{method:"PATCH",headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"},body:JSON.stringify({active:e})}).then((e=>e.json()));if(t.isError)throw new s(t.message||"Failed to set Origin consent")}))}
/**
     * Call a contract method.
     * @param {string} contractAddress The contract address.
     * @param {Abi} abi The contract ABI.
     * @param {string} methodName The method name.
     * @param {any[]} params The method parameters.
     * @param {CallOptions} [options] The call options.
     * @returns {Promise<any>} A promise that resolves with the result of the contract call or transaction hash.
     * @throws {Error} - Throws an error if the wallet client is not connected and the method is not a view function.
     */callContractMethod(e,n,i,s){return a(this,arguments,void 0,(function*(e,n,i,a,s={}){const o=t.getAbiItem({abi:n,name:i});if(o&&"stateMutability"in o&&("view"===o.stateMutability||"pure"===o.stateMutability)){const t=m();return(yield t.readContract({address:e,abi:n,functionName:i,args:a}))||null}if(!this.viemClient)throw new Error("WalletClient not connected.");const[d]=yield this.viemClient.request({method:"eth_requestAccounts",params:[]});yield r(this,q,"m",J).call(this,this.environment.CHAIN);const u=m(),{result:p,request:l}=yield u.simulateContract({account:d,address:e,abi:n,functionName:i,args:a,value:s.value});
// simulate
if(s.simulate)return p;try{const e=yield this.viemClient.writeContract(l);if("string"!=typeof e)throw new Error("Transaction failed to send.");if(!s.waitForReceipt)return{txHash:e,simulatedResult:p};return{txHash:e,receipt:yield r(this,q,"m",K).call(this,e),simulatedResult:p}}catch(e){throw console.error("Transaction failed:",e),new Error("Transaction failed: "+e)}}))}
/**
     * Buy access to an asset by first checking its price via getTerms, then calling buyAccess.
     * @param {bigint} tokenId The token ID of the asset.
     * @returns {Promise<any>} The result of the buyAccess call.
     */buyAccessSmart(e){return a(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");const n=yield this.getTerms(e);if(!n)throw new Error("Failed to fetch terms for asset");const{price:i,paymentToken:r,duration:s}=n;if(void 0===i||void 0===r||void 0===s)throw new Error("Terms missing price, paymentToken, or duration");const o=(yield this.viemClient.request({method:"eth_requestAccounts",params:[]}))[0],d=i;return r===t.zeroAddress?this.buyAccess(o,e,d,s,r,d):(yield function(e){return a(this,arguments,void 0,(function*({walletClient:e,publicClient:n,tokenAddress:i,owner:a,spender:r,amount:s}){(yield n.readContract({address:i,abi:t.erc20Abi,functionName:"allowance",args:[a,r]}))<s&&(yield e.writeContract({address:i,account:a,abi:t.erc20Abi,functionName:"approve",args:[r,s],chain:l}))}))}({walletClient:this.viemClient,publicClient:m(),tokenAddress:r,owner:o,spender:this.environment.MARKETPLACE_CONTRACT_ADDRESS,amount:d}),this.buyAccess(o,e,d,s,r))}))}getData(e){return a(this,void 0,void 0,(function*(){const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/data/${e}`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!t.ok)throw new Error("Failed to fetch data");return t.json()}))}
/**
     * Get royalty information for a wallet address, including the royalty vault address and its balance.
     * @param {Address} [token] - Optional token address to check royalties for. If not provided, checks for native token.
     * @param {Address} [owner] - Optional wallet address to check royalties for. If not provided, uses the connected wallet.
     * @returns {Promise<RoyaltyInfo>} A promise that resolves with the royalty vault address and balance information.
     * @throws {Error} Throws an error if no wallet is connected and no owner address is provided.
     * @example
     * ```typescript
     * // Get royalties for connected wallet
     * const royalties = await origin.getRoyalties();
     *
     * // Get royalties for specific address
     * const royalties = await origin.getRoyalties("0x1234...");
     * ```
     */getRoyalties(e,n){return a(this,void 0,void 0,(function*(){const i=yield r(this,q,"m",V).call(this,n);try{const n=yield this.getOrCreateRoyaltyVault(i,!0),a=m();let r,s;if(e&&e!==t.zeroAddress){
// erc20 (wrapped camp)
const i=[{inputs:[{name:"owner",type:"address"}],name:"balanceOf",outputs:[{name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"decimals",outputs:[{name:"",type:"uint8"}],stateMutability:"view",type:"function"}];r=yield this.callContractMethod(e,i,"balanceOf",[n]);const a=yield this.callContractMethod(e,i,"decimals",[]);s=t.formatUnits(r,a)}else r=yield a.getBalance({address:n}),s=t.formatEther(r);return{royaltyVault:n,balance:r,balanceFormatted:s}}catch(e){throw new Error(`Failed to retrieve royalties for address ${i}: ${e instanceof Error?e.message:String(e)}`)}}))}
/**
     * Claim royalties from the royalty vault.
     * @param {Address} [token] - Optional token address to claim royalties in. If not provided, claims in native token.
     * @param {Address} [owner] - Optional wallet address to claim royalties for. If not provided, uses the connected wallet.
     * @returns {Promise<any>} A promise that resolves when the claim transaction is confirmed.
     * @throws {Error} Throws an error if no wallet is connected and no owner address is provided.
     */claimRoyalties(e,n){return a(this,void 0,void 0,(function*(){const i=yield r(this,q,"m",V).call(this,n),a=yield this.getOrCreateRoyaltyVault(i,!0);return this.callContractMethod(a,this.environment.ROYALTY_VAULT_ABI,"claimRoyalty",[null!=e?e:t.zeroAddress],{waitForReceipt:!0})}))}}q=new WeakSet,W=function(e){return a(this,void 0,void 0,(function*(){try{const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/upload-url`,{method:"POST",body:JSON.stringify({name:e.name,type:e.type}),headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!t.ok)throw new Error(`HTTP ${t.status}: ${t.statusText}`);const n=yield t.json();if(n.isError)throw new Error(n.message||"Failed to generate upload URL");return n.data}catch(e){throw console.error("Failed to generate upload URL:",e),e}}))},z=function(e,t){return a(this,void 0,void 0,(function*(){try{const n=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/update-status`,{method:"PATCH",body:JSON.stringify({status:t,fileKey:e}),headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!n.ok){const e=yield n.text().catch((()=>"Unknown error"));throw new Error(`HTTP ${n.status}: ${e}`)}return!0}catch(e){throw console.error("Failed to update origin status:",e),e}}))},K=function(e){return a(this,arguments,void 0,(function*(e,t={}){var n,i,a;const r=m();let s=e;const o=null!==(n=t.confirmations)&&void 0!==n?n:1,d=null!==(i=t.timeoutMs)&&void 0!==i?i:18e4,u=null!==(a=t.pollingIntervalMs)&&void 0!==a?a:1500;try{return yield r.waitForTransactionReceipt({hash:s,confirmations:o,timeout:d,pollingInterval:u,onReplaced:e=>{s=e.transaction.hash}})}catch(e){
// fallback
const t=Date.now();for(;Date.now()-t<d;){try{const e=yield r.getTransactionReceipt({hash:s});if(e&&e.blockNumber)return e}catch(e){}yield new Promise((e=>setTimeout(e,u)))}throw e}}))},J=function(e){return a(this,void 0,void 0,(function*(){
// return;
if(!this.viemClient)throw new Error("WalletClient not connected.");let t=yield this.viemClient.request({method:"eth_chainId",params:[]});if("string"==typeof t&&(t=parseInt(t,16)),t!==e.id){(e=>{h=e,c=null})// reset public client to be recreated with new chain
(e);try{yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16)}]})}catch(t){
// Unrecognized chain
if(4902!==t.code)throw t;yield this.viemClient.request({method:"wallet_addEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16),chainName:e.name,rpcUrls:e.rpcUrls.default.http,nativeCurrency:e.nativeCurrency}]}),yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16)}]})}}}))},V=function(e){return a(this,void 0,void 0,(function*(){if(e)return e;if(!this.viemClient)throw new Error("No wallet address provided and no wallet client connected. Please provide an owner address or connect a wallet.");try{const e=yield this.viemClient.request({method:"eth_requestAccounts",params:[]});if(!e||0===e.length)throw new Error("No accounts found in connected wallet.");return e[0]}catch(e){throw new Error(`Failed to get wallet address: ${e instanceof Error?e.message:String(e)}`)}}))};Y=new WeakMap,X=new WeakMap,G=new WeakSet,Z=function(e,t){r(this,Y,"f")[e]&&r(this,Y,"f")[e].forEach((e=>e(t)))},Q=function(e){return a(this,void 0,void 0,(function*(){if("undefined"==typeof localStorage)return;const t=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:wallet-address"),n=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:user-id"),i=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:jwt"),a=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:environment");t&&n&&i&&(a===this.environment.NAME||!a)?(this.walletAddress=t,this.userId=n,this.jwt=i,this.origin=new re(this.jwt,this.environment),this.isAuthenticated=!0,e?this.setProvider({provider:e.provider,info:e.info||{name:"Unknown"},address:t}):(console.warn("No matching provider was given for the stored wallet address. Trying to recover provider."),yield this.recoverProvider())):this.isAuthenticated=!1}))},ee=function(){return a(this,void 0,void 0,(function*(){try{const[e]=yield this.viem.requestAddresses();return this.walletAddress=t.checksumAddress(e),this.walletAddress}catch(e){throw new s(e)}}))},te=function(){return a(this,void 0,void 0,(function*(){try{const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/client-user/nonce`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({walletAddress:this.walletAddress})}),t=yield e.json();return 200!==e.status?Promise.reject(t.message||"Failed to fetch nonce"):t.data}catch(e){throw new Error(e)}}))},ne=function(e,t){return a(this,void 0,void 0,(function*(){try{const n=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/client-user/verify`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({message:e,signature:t,walletAddress:this.walletAddress})}),i=yield n.json(),a=i.data.split(".")[1],r=JSON.parse(atob(a));return{success:!i.isError,userId:r.id,token:i.data}}catch(e){throw new s(e)}}))},ie=function(e){return i.createSiweMessage({domain:window.location.host,address:this.walletAddress,statement:w,uri:window.location.origin,version:"1",chainId:this.viem.chain.id,nonce:e})},ae=function(e,t){return a(this,arguments,void 0,(function*(e,t,n=1){
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
     * @param {("DEVELOPMENT"|"PRODUCTION")} [options.environment="DEVELOPMENT"] The environment to use.
     * @throws {APIError} - Throws an error if the clientId is not provided.
     */
constructor({clientId:e,redirectUri:t,allowAnalytics:n=!0,ackeeInstance:i,environment:a="DEVELOPMENT"}){if(G.add(this),Y.set(this,void 0),X.set(this,void 0),!e)throw new Error("clientId is required");if(-1===["PRODUCTION","DEVELOPMENT"].indexOf(a))throw new Error("Invalid environment, must be DEVELOPMENT or PRODUCTION");this.viem=null,this.environment=I[a],this.redirectUri=(e=>{const t=["twitter","discord","spotify"];return"object"==typeof e?t.reduce(((t,n)=>(t[n]=e[n]||("undefined"!=typeof window?window.location.href:""),t)),{}):"string"==typeof e?t.reduce(((t,n)=>(t[n]=e,t)),{}):e?{}:t.reduce(((e,t)=>(e[t]="undefined"!=typeof window?window.location.href:"",e)),{})})(t),this.clientId=e,this.isAuthenticated=!1,this.jwt=null,this.origin=null,this.walletAddress=null,this.userId=null,function(e,t,n,i,a){if("m"===i)throw new TypeError("Private method is not writable");if("a"===i&&!a)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!a:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");"a"===i?a.call(e,n):a?a.value=n:t.set(e,n)}(this,Y,{},"f"),E((e=>{r(this,G,"m",Z).call(this,"providers",e)})),r(this,G,"m",Q).call(this)}
/**
     * Subscribe to an event. Possible events are "state", "provider", "providers", and "viem".
     * @param {("state"|"provider"|"providers"|"viem")} event The event.
     * @param {function} callback The callback function.
     * @returns {void}
     * @example
     * auth.on("state", (state) => {
     *  console.log(state);
     * });
     */on(e,t){r(this,Y,"f")[e]||(r(this,Y,"f")[e]=[]),r(this,Y,"f")[e].push(t),"providers"===e&&t(g())}
/**
     * Set the loading state.
     * @param {boolean} loading The loading state.
     * @returns {void}
     */setLoading(e){r(this,G,"m",Z).call(this,"state",e?"loading":this.isAuthenticated?"authenticated":"unauthenticated")}
/**
     * Set the provider. This is useful for setting the provider when the user selects a provider from the UI or when dApp wishes to use a specific provider.
     * @param {object} options The options object. Includes the provider and the provider info.
     * @returns {void}
     * @throws {APIError} - Throws an error if the provider is not provided.
     */setProvider({provider:e,info:i,address:a}){if(!e)throw new s("provider is required");this.viem=((e,i="window.ethereum",a,r)=>{var s,o;if(!e&&!y)return console.warn("Provider is required to create a client."),null;const d=a||l;if(!y||y.transport.name!==i&&e||r!==(null===(s=y.account)||void 0===s?void 0:s.address)&&e||(null==h?void 0:h.id)!==d.id){const a={chain:d,transport:t.custom(e,{name:i})};r&&(a.account=n.toAccount(r)),y=t.createWalletClient(a),h=d,c&&(null===(o=c.chain)||void 0===o?void 0:o.id)!==d.id&&(c=null)}return y})(e,i.name,this.environment.CHAIN,a),this.origin&&this.origin.setViemClient(this.viem),
// TODO: only use one of these
r(this,G,"m",Z).call(this,"viem",this.viem),r(this,G,"m",Z).call(this,"provider",{provider:e,info:i}),localStorage.setItem("camp-sdk:provider",JSON.stringify(i))}
/**
     * Set the wallet address. This is useful for edge cases where the provider can't return the wallet address. Don't use this unless you know what you're doing.
     * @param {string} walletAddress The wallet address.
     * @returns {void}
     */setWalletAddress(e){this.walletAddress=e}
/**
     * Recover the provider from local storage.
     * @returns {Promise<void>}
     */recoverProvider(){return a(this,void 0,void 0,(function*(){var e,t,n,i,a,r,s,o,d,u,p,l,y,c,h;if(!this.walletAddress)return void console.warn("No wallet address found in local storage. Please connect your wallet again.");const m=JSON.parse(localStorage.getItem("camp-sdk:provider")||"{}");let T;const f=null!==(e=g())&&void 0!==e?e:[];
// first pass: try to find provider by UUID/name and check if it has the right address
// without prompting (using eth_accounts)
for(const e of f)try{if(m.uuid&&(null===(t=e.info)||void 0===t?void 0:t.uuid)===m.uuid||m.name&&(null===(n=e.info)||void 0===n?void 0:n.name)===m.name){
// silently check if the wallet address matches first
const t=yield e.provider.request({method:"eth_accounts"});if(t.length>0&&(null===(i=t[0])||void 0===i?void 0:i.toLowerCase())===(null===(a=this.walletAddress)||void 0===a?void 0:a.toLowerCase())){T=e;break}}}catch(e){console.warn("Failed to fetch accounts from provider:",e)}
// second pass: if no provider found by UUID/name match, try to find by address only
// but still avoid prompting
if(!T)for(const e of f)try{
// skip providers we already checked in the first pass
if(m.uuid&&(null===(r=e.info)||void 0===r?void 0:r.uuid)===m.uuid||m.name&&(null===(s=e.info)||void 0===s?void 0:s.name)===m.name)continue;const t=yield e.provider.request({method:"eth_accounts"});if(t.length>0&&(null===(o=t[0])||void 0===o?void 0:o.toLowerCase())===(null===(d=this.walletAddress)||void 0===d?void 0:d.toLowerCase())){T=e;break}}catch(e){console.warn("Failed to fetch accounts from provider:",e)}
// third pass: if still no provider found and we have UUID/name info,
// try prompting the user (only for the stored provider)
if(!T&&(m.uuid||m.name))for(const e of f)try{if(m.uuid&&(null===(u=e.info)||void 0===u?void 0:u.uuid)===m.uuid||m.name&&(null===(p=e.info)||void 0===p?void 0:p.name)===m.name){console.log("Attempting to reconnect to stored provider:",(null===(l=e.info)||void 0===l?void 0:l.name)||(null===(y=e.info)||void 0===y?void 0:y.uuid));const t=yield e.provider.request({method:"eth_requestAccounts"});if(t.length>0&&(null===(c=t[0])||void 0===c?void 0:c.toLowerCase())===(null===(h=this.walletAddress)||void 0===h?void 0:h.toLowerCase())){T=e;break}}}catch(e){console.warn("Failed to reconnect to stored provider:",e)}T?this.setProvider({provider:T.provider,info:T.info||{name:"Unknown"},address:this.walletAddress}):console.warn("No matching provider found for the stored wallet address. Please connect your wallet again.")}))}
/**
     * Disconnect the user.
     * @returns {Promise<void>}
     */disconnect(){return a(this,void 0,void 0,(function*(){this.isAuthenticated&&(r(this,G,"m",Z).call(this,"state","unauthenticated"),this.isAuthenticated=!1,this.walletAddress=null,this.userId=null,this.jwt=null,this.origin=null,localStorage.removeItem("camp-sdk:wallet-address"),localStorage.removeItem("camp-sdk:user-id"),localStorage.removeItem("camp-sdk:jwt"),localStorage.removeItem("camp-sdk:environment"))}))}
/**
     * Connect the user's wallet and sign the message.
     * @returns {Promise<{ success: boolean; message: string; walletAddress: string }>} A promise that resolves with the authentication result.
     * @throws {APIError} - Throws an error if the user cannot be authenticated.
     */connect(){return a(this,void 0,void 0,(function*(){r(this,G,"m",Z).call(this,"state","loading");try{this.walletAddress||(yield r(this,G,"m",ee).call(this)),this.walletAddress=t.checksumAddress(this.walletAddress);const e=yield r(this,G,"m",te).call(this),n=r(this,G,"m",ie).call(this,e),i=yield this.viem.signMessage({account:this.walletAddress,message:n}),a=yield r(this,G,"m",ne).call(this,n,i);if(a.success)return this.isAuthenticated=!0,this.userId=a.userId,this.jwt=a.token,this.origin=new re(this.jwt,this.environment,this.viem),localStorage.setItem("camp-sdk:jwt",this.jwt),localStorage.setItem("camp-sdk:wallet-address",this.walletAddress),localStorage.setItem("camp-sdk:user-id",this.userId),localStorage.setItem("camp-sdk:environment",this.environment.NAME),r(this,G,"m",Z).call(this,"state","authenticated"),yield r(this,G,"m",ae).call(this,A.USER_CONNECTED,"User Connected"),{success:!0,message:"Successfully authenticated",walletAddress:this.walletAddress};throw this.isAuthenticated=!1,r(this,G,"m",Z).call(this,"state","unauthenticated"),new s("Failed to authenticate")}catch(e){throw this.isAuthenticated=!1,r(this,G,"m",Z).call(this,"state","unauthenticated"),new s(e)}}))}
/**
     * Get the user's linked social accounts.
     * @returns {Promise<Record<string, boolean>>} A promise that resolves with the user's linked social accounts.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated or if the request fails.
     * @example
     * const auth = new Auth({ clientId: "your-client-id" });
     * const socials = await auth.getLinkedSocials();
     * console.log(socials);
     */getLinkedSocials(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/client-user/connections-sdk`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"}}).then((e=>e.json()));if(e.isError)throw new s(e.message||"Failed to fetch connections");{const t={};return Object.keys(e.data.data).forEach((n=>{t[n.split("User")[0]]=e.data.data[n]})),t}}))}
/**
     * Link the user's Twitter account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkTwitter(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");window.location.href=`${this.environment.AUTH_HUB_BASE_API}/twitter/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.twitter}`}))}
/**
     * Link the user's Discord account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkDiscord(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");window.location.href=`${this.environment.AUTH_HUB_BASE_API}/discord/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.discord}`}))}
/**
     * Link the user's Spotify account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkSpotify(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");window.location.href=`${this.environment.AUTH_HUB_BASE_API}/spotify/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.spotify}`}))}
/**
     * Link the user's TikTok account.
     * @param {string} handle The user's TikTok handle.
     * @returns {Promise<any>} A promise that resolves with the TikTok account data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */linkTikTok(e){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/tiktok/connect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userHandle:e,clientId:this.clientId,userId:this.userId})}).then((e=>e.json()));if(t.isError)throw"Request failed with status code 502"===t.message?new s("TikTok service is currently unavailable, try again later"):new s(t.message||"Failed to link TikTok account");return r(this,G,"m",ae).call(this,A.TIKTOK_LINKED,"TikTok Linked"),t.data}))}
/**
     * Send an OTP to the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @returns {Promise<any>} A promise that resolves with the OTP data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */sendTelegramOTP(e){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!e)throw new s("Phone number is required");yield this.unlinkTelegram();const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/telegram/sendOTP-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:e})}).then((e=>e.json()));if(t.isError)throw new s(t.message||"Failed to send Telegram OTP");return t.data}))}
/**
     * Link the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @param {string} otp The OTP.
     * @param {string} phoneCodeHash The phone code hash.
     * @returns {Promise<object>} A promise that resolves with the Telegram account data.
     * @throws {APIError|Error} - Throws an error if the user is not authenticated. Also throws an error if the phone number, OTP, and phone code hash are not provided.
     */linkTelegram(e,t,n){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!e||!t||!n)throw new s("Phone number, OTP, and phone code hash are required");const i=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/telegram/signIn-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:e,code:t,phone_code_hash:n,userId:this.userId,clientId:this.clientId})}).then((e=>e.json()));if(i.isError)throw new s(i.message||"Failed to link Telegram account");return r(this,G,"m",ae).call(this,A.TELEGRAM_LINKED,"Telegram Linked"),i.data}))}
/**
     * Unlink the user's Twitter account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTwitter(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/twitter/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new s(e.message||"Failed to unlink Twitter account");return e.data}))}
/**
     * Unlink the user's Discord account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkDiscord(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new s("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/discord/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new s(e.message||"Failed to unlink Discord account");return e.data}))}
/**
     * Unlink the user's Spotify account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkSpotify(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new s("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/spotify/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new s(e.message||"Failed to unlink Spotify account");return e.data}))}
/**
     * Unlink the user's TikTok account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTikTok(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new s("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/tiktok/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((e=>e.json()));if(e.isError)throw new s(e.message||"Failed to unlink TikTok account");return e.data}))}
/**
     * Unlink the user's Telegram account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTelegram(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new s("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/telegram/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((e=>e.json()));if(e.isError)throw new s(e.message||"Failed to unlink Telegram account");return e.data}))}},exports.SpotifyAPI=
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
     */fetchSavedTracksById(e){return a(this,void 0,void 0,(function*(){const t=d(`${p}/save-tracks`,{spotifyId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the played tracks of a user by Spotify ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The played tracks.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchPlayedTracksById(e){return a(this,void 0,void 0,(function*(){const t=d(`${p}/played-tracks`,{spotifyId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the user's saved albums by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved albums.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedAlbumsById(e){return a(this,void 0,void 0,(function*(){const t=d(`${p}/saved-albums`,{spotifyId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the user's saved playlists by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved playlists.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedPlaylistsById(e){return a(this,void 0,void 0,(function*(){const t=d(`${p}/saved-playlists`,{spotifyId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the tracks of an album by album ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} albumId - The album ID.
     * @returns {Promise<object>} - The tracks in the album.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInAlbum(e,t){return a(this,void 0,void 0,(function*(){const n=d(`${p}/album/tracks`,{spotifyId:e,albumId:t});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch the tracks in a playlist by playlist ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} playlistId - The playlist ID.
     * @returns {Promise<object>} - The tracks in the playlist.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInPlaylist(e,t){return a(this,void 0,void 0,(function*(){const n=d(`${p}/playlist/tracks`,{spotifyId:e,playlistId:t});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch the user's Spotify data by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @returns {Promise<object>} - The user's Spotify data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(e){return a(this,void 0,void 0,(function*(){const t=d(`${p}/wallet-spotify-data`,{walletAddress:e});return this._fetchDataWithAuth(t)}))}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(e){return a(this,void 0,void 0,(function*(){if(!this.apiKey)throw new s("API key is required for fetching data",401);try{return yield o(e,{"x-api-key":this.apiKey})}catch(e){throw new s(e.message,e.statusCode)}}))}},exports.TwitterAPI=
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
     */fetchUserByUsername(e){return a(this,void 0,void 0,(function*(){const t=d(`${u}/user`,{twitterUserName:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetsByUsername(e){return a(this,arguments,void 0,(function*(e,t=1,n=10){const i=d(`${u}/tweets`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch followers by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The followers.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowersByUsername(e){return a(this,arguments,void 0,(function*(e,t=1,n=10){const i=d(`${u}/followers`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch following by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The following.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowingByUsername(e){return a(this,arguments,void 0,(function*(e,t=1,n=10){const i=d(`${u}/following`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch tweet by tweet ID.
     * @param {string} tweetId - The tweet ID.
     * @returns {Promise<object>} - The tweet.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetById(e){return a(this,void 0,void 0,(function*(){const t=d(`${u}/getTweetById`,{tweetId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch user by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The user data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(e){return a(this,arguments,void 0,(function*(e,t=1,n=10){const i=d(`${u}/wallet-twitter-data`,{walletAddress:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch reposted tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The reposted tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepostedByUsername(e){return a(this,arguments,void 0,(function*(e,t=1,n=10){const i=d(`${u}/reposted`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch replies by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The replies.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepliesByUsername(e){return a(this,arguments,void 0,(function*(e,t=1,n=10){const i=d(`${u}/replies`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch likes by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The likes.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchLikesByUsername(e){return a(this,arguments,void 0,(function*(e,t=1,n=10){const i=d(`${u}/event/likes/${e}`,{page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch follows by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The follows.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowsByUsername(e){return a(this,arguments,void 0,(function*(e,t=1,n=10){const i=d(`${u}/event/follows/${e}`,{page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch viewed tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The viewed tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchViewedTweetsByUsername(e){return a(this,arguments,void 0,(function*(e,t=1,n=10){const i=d(`${u}/event/viewed-tweets/${e}`,{page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(e){return a(this,void 0,void 0,(function*(){if(!this.apiKey)throw new s("API key is required for fetching data",401);try{return yield o(e,{"x-api-key":this.apiKey})}catch(e){throw new s(e.message,e.statusCode)}}))}};
