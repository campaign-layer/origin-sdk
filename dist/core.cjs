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
function a(e,t,n,i){return new(n||(n=Promise))((function(a,r){function s(e){try{d(i.next(e))}catch(e){r(e)}}function o(e){try{d(i.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?a(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,o)}d((i=i.apply(e,t||[])).next())}))}function r(e,t,n,i){if("a"===n&&!i)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!i:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===n?i:"a"===n?i.call(e):i?i.value:t.get(e)}function s(e,t,n,i,a){if("m"===i)throw new TypeError("Private method is not writable");if("a"===i&&!a)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!a:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===i?a.call(e,n):a?a.value=n:t.set(e,n),n}"function"==typeof SuppressedError&&SuppressedError;class o extends Error{constructor(e,t){super(e),this.name="APIError",this.statusCode=t||500,Error.captureStackTrace(this,this.constructor)}toJSON(){return{error:this.name,message:this.message,statusCode:this.statusCode||500}}}const d={id:123420001114,name:"Basecamp",nativeCurrency:{decimals:18,name:"Camp",symbol:"CAMP"},rpcUrls:{default:{http:["https://rpc-campnetwork.xyz","https://rpc.basecamp.t.raas.gelato.cloud"]}},blockExplorers:{default:{name:"Explorer",url:"https://basecamp.cloud.blockscout.com/"}}},u={id:484,name:"Camp Network",nativeCurrency:{decimals:18,name:"Camp",symbol:"CAMP"},rpcUrls:{default:{http:["https://rpc.camp.raas.gelato.cloud/"]}},blockExplorers:{default:{name:"Explorer",url:"https://camp.cloud.blockscout.com/"}}};
// @ts-ignore
let p=null,l=null,y=null;const c=t=>{var n;const i=y||d;return l&&(null===(n=l.chain)||void 0===n?void 0:n.id)===i.id||(l=e.createPublicClient({chain:i,transport:e.http()})),l};var m=[{type:"function",name:"UPGRADE_INTERFACE_VERSION",inputs:[],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"approve",inputs:[{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"balanceOf",inputs:[{name:"owner",type:"address",internalType:"address"}],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"dataStatus",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"uint8",internalType:"enum IIpNFT.DataStatus"}],stateMutability:"view"},{type:"function",name:"disputeModule",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"erc6551Account",inputs:[],outputs:[{name:"",type:"address",internalType:"contract IERC6551Account"}],stateMutability:"view"},{type:"function",name:"erc6551Registry",inputs:[],outputs:[{name:"",type:"address",internalType:"contract IERC6551Registry"}],stateMutability:"view"},{type:"function",name:"finalizeDelete",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"getAccount",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"account",type:"address",internalType:"address"}],stateMutability:"nonpayable"},{type:"function",name:"getApproved",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"getTerms",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"tuple",internalType:"struct IIpNFT.LicenseTerms",components:[{name:"price",type:"uint128",internalType:"uint128"},{name:"duration",type:"uint32",internalType:"uint32"},{name:"royaltyBps",type:"uint16",internalType:"uint16"},{name:"paymentToken",type:"address",internalType:"address"}]}],stateMutability:"view"},{type:"function",name:"initialize",inputs:[{name:"name_",type:"string",internalType:"string"},{name:"symbol_",type:"string",internalType:"string"},{name:"maxTermDuration_",type:"uint256",internalType:"uint256"},{name:"signer_",type:"address",internalType:"address"},{name:"wCAMP_",type:"address",internalType:"address"},{name:"minTermDuration_",type:"uint256",internalType:"uint256"},{name:"minPrice_",type:"uint256",internalType:"uint256"},{name:"maxRoyaltyBps_",type:"uint256",internalType:"uint256"},{name:"registry_",type:"address",internalType:"contract IERC6551Registry"},{name:"implementation_",type:"address",internalType:"contract IERC6551Account"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"isApprovedForAll",inputs:[{name:"owner",type:"address",internalType:"address"},{name:"operator",type:"address",internalType:"address"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"markDisputed",inputs:[{name:"_tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"marketPlace",inputs:[],outputs:[{name:"",type:"address",internalType:"contract IMarketplace"}],stateMutability:"view"},{type:"function",name:"maxRoyaltyBps",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"maxTermDuration",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"minPrice",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"minTermDuration",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"mintWithSignature",inputs:[{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"creatorContentHash",type:"bytes32",internalType:"bytes32"},{name:"uri",type:"string",internalType:"string"},{name:"licenseTerms",type:"tuple",internalType:"struct IIpNFT.LicenseTerms",components:[{name:"price",type:"uint128",internalType:"uint128"},{name:"duration",type:"uint32",internalType:"uint32"},{name:"royaltyBps",type:"uint16",internalType:"uint16"},{name:"paymentToken",type:"address",internalType:"address"}]},{name:"deadline",type:"uint256",internalType:"uint256"},{name:"parents",type:"uint256[]",internalType:"uint256[]"},{name:"isIP",type:"bool",internalType:"bool"},{name:"signature",type:"bytes",internalType:"bytes"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"name",inputs:[],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"owner",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"ownerOf",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"pause",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"paused",inputs:[],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"proxiableUUID",inputs:[],outputs:[{name:"",type:"bytes32",internalType:"bytes32"}],stateMutability:"view"},{type:"function",name:"renounceOwnership",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"safeTransferFrom",inputs:[{name:"from",type:"address",internalType:"address"},{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"safeTransferFrom",inputs:[{name:"from",type:"address",internalType:"address"},{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"data",type:"bytes",internalType:"bytes"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"setApprovalForAll",inputs:[{name:"operator",type:"address",internalType:"address"},{name:"approved",type:"bool",internalType:"bool"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"setDisputeModule",inputs:[{name:"_disputeModule",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"setMarketPlace",inputs:[{name:"_marketPlace",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"setSigner",inputs:[{name:"_signer",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"signer",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"supportsInterface",inputs:[{name:"interfaceId",type:"bytes4",internalType:"bytes4"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"symbol",inputs:[],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"tokenInfo",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"tuple",internalType:"struct IIpNFT.TokenInfo",components:[{name:"tokenURI",type:"string",internalType:"string"},{name:"isIP",type:"bool",internalType:"bool"},{name:"contentHash",type:"bytes32",internalType:"bytes32"},{name:"terms",type:"tuple",internalType:"struct IIpNFT.LicenseTerms",components:[{name:"price",type:"uint128",internalType:"uint128"},{name:"duration",type:"uint32",internalType:"uint32"},{name:"royaltyBps",type:"uint16",internalType:"uint16"},{name:"paymentToken",type:"address",internalType:"address"}]},{name:"status",type:"uint8",internalType:"enum IIpNFT.DataStatus"}]}],stateMutability:"view"},{type:"function",name:"tokenURI",inputs:[{name:"_tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"transferFrom",inputs:[{name:"from",type:"address",internalType:"address"},{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"transferOwnership",inputs:[{name:"newOwner",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"unpause",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"updateTerms",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"newTerms",type:"tuple",internalType:"struct IIpNFT.LicenseTerms",components:[{name:"price",type:"uint128",internalType:"uint128"},{name:"duration",type:"uint32",internalType:"uint32"},{name:"royaltyBps",type:"uint16",internalType:"uint16"},{name:"paymentToken",type:"address",internalType:"address"}]}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"upgradeToAndCall",inputs:[{name:"newImplementation",type:"address",internalType:"address"},{name:"data",type:"bytes",internalType:"bytes"}],outputs:[],stateMutability:"payable"},{type:"function",name:"wCAMP",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"event",name:"AccessPurchased",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"buyer",type:"address",indexed:!0,internalType:"address"},{name:"periods",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newExpiry",type:"uint256",indexed:!1,internalType:"uint256"},{name:"amountPaid",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"AgentRegistered",inputs:[{name:"agentId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"ipNftId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"agentAddress",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"Approval",inputs:[{name:"owner",type:"address",indexed:!0,internalType:"address"},{name:"approved",type:"address",indexed:!0,internalType:"address"},{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"}],anonymous:!1},{type:"event",name:"ApprovalForAll",inputs:[{name:"owner",type:"address",indexed:!0,internalType:"address"},{name:"operator",type:"address",indexed:!0,internalType:"address"},{name:"approved",type:"bool",indexed:!1,internalType:"bool"}],anonymous:!1},{type:"event",name:"ChildIpTagged",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"childIp",type:"uint256",indexed:!0,internalType:"uint256"},{name:"parentIp",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"DataDeleted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"DataMinted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"},{name:"contentHash",type:"bytes32",indexed:!1,internalType:"bytes32"},{name:"parents",type:"uint256[]",indexed:!1,internalType:"uint256[]"}],anonymous:!1},{type:"event",name:"DisputeAssertion",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"counterEvidenceHash",type:"bytes32",indexed:!1,internalType:"bytes32"}],anonymous:!1},{type:"event",name:"DisputeCancelled",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"}],anonymous:!1},{type:"event",name:"DisputeJudged",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"judgement",type:"bool",indexed:!1,internalType:"bool"}],anonymous:!1},{type:"event",name:"DisputeModuleUpdated",inputs:[{name:"disputeModule",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"DisputeRaised",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"initiator",type:"address",indexed:!0,internalType:"address"},{name:"targetId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"disputeTag",type:"bytes32",indexed:!1,internalType:"bytes32"}],anonymous:!1},{type:"event",name:"Initialized",inputs:[{name:"version",type:"uint64",indexed:!1,internalType:"uint64"}],anonymous:!1},{type:"event",name:"MarketPlaceUpdated",inputs:[{name:"marketPlace",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"OwnershipTransferred",inputs:[{name:"previousOwner",type:"address",indexed:!0,internalType:"address"},{name:"newOwner",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"Paused",inputs:[{name:"account",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"RoyaltyPaid",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"royaltyAmount",type:"uint256",indexed:!1,internalType:"uint256"},{name:"creator",type:"address",indexed:!1,internalType:"address"},{name:"protocolAmount",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"SignerUpdated",inputs:[{name:"signer",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"StatusUpdated",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"status",type:"uint8",indexed:!1,internalType:"enum IIpNFT.DataStatus"}],anonymous:!1},{type:"event",name:"TermsUpdated",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"newPrice",type:"uint128",indexed:!1,internalType:"uint128"},{name:"newDuration",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newRoyaltyBps",type:"uint16",indexed:!1,internalType:"uint16"},{name:"paymentToken",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"Transfer",inputs:[{name:"from",type:"address",indexed:!0,internalType:"address"},{name:"to",type:"address",indexed:!0,internalType:"address"},{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"}],anonymous:!1},{type:"event",name:"Unpaused",inputs:[{name:"account",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"Upgraded",inputs:[{name:"implementation",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"error",name:"AddressEmptyCode",inputs:[{name:"target",type:"address",internalType:"address"}]},{type:"error",name:"ERC1967InvalidImplementation",inputs:[{name:"implementation",type:"address",internalType:"address"}]},{type:"error",name:"ERC1967NonPayable",inputs:[]},{type:"error",name:"ERC721IncorrectOwner",inputs:[{name:"sender",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"owner",type:"address",internalType:"address"}]},{type:"error",name:"ERC721InsufficientApproval",inputs:[{name:"operator",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"}]},{type:"error",name:"ERC721InvalidApprover",inputs:[{name:"approver",type:"address",internalType:"address"}]},{type:"error",name:"ERC721InvalidOperator",inputs:[{name:"operator",type:"address",internalType:"address"}]},{type:"error",name:"ERC721InvalidOwner",inputs:[{name:"owner",type:"address",internalType:"address"}]},{type:"error",name:"ERC721InvalidReceiver",inputs:[{name:"receiver",type:"address",internalType:"address"}]},{type:"error",name:"ERC721InvalidSender",inputs:[{name:"sender",type:"address",internalType:"address"}]},{type:"error",name:"ERC721NonexistentToken",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}]},{type:"error",name:"EnforcedPause",inputs:[]},{type:"error",name:"ExpectedPause",inputs:[]},{type:"error",name:"FailedCall",inputs:[]},{type:"error",name:"InvalidDeadline",inputs:[]},{type:"error",name:"InvalidDuration",inputs:[]},{type:"error",name:"InvalidInitialization",inputs:[]},{type:"error",name:"InvalidPaymentToken",inputs:[]},{type:"error",name:"InvalidPrice",inputs:[]},{type:"error",name:"InvalidRoyalty",inputs:[]},{type:"error",name:"InvalidSignature",inputs:[]},{type:"error",name:"NotInitializing",inputs:[]},{type:"error",name:"NotTokenOwner",inputs:[]},{type:"error",name:"OwnableInvalidOwner",inputs:[{name:"owner",type:"address",internalType:"address"}]},{type:"error",name:"OwnableUnauthorizedAccount",inputs:[{name:"account",type:"address",internalType:"address"}]},{type:"error",name:"TokenAlreadyExists",inputs:[]},{type:"error",name:"UUPSUnauthorizedCallContext",inputs:[]},{type:"error",name:"UUPSUnsupportedProxiableUUID",inputs:[{name:"slot",type:"bytes32",internalType:"bytes32"}]},{type:"error",name:"Unauthorized",inputs:[]}],h=[{type:"function",name:"MAX_PARENTS",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"UPGRADE_INTERFACE_VERSION",inputs:[],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"buyAccess",inputs:[{name:"buyer",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"expectedPrice",type:"uint256",internalType:"uint256"},{name:"expectedDuration",type:"uint32",internalType:"uint32"},{name:"expectedPaymentToken",type:"address",internalType:"address"}],outputs:[],stateMutability:"payable"},{type:"function",name:"hasParentIp",inputs:[{name:"ipId",type:"uint256",internalType:"uint256"},{name:"parent",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"initialize",inputs:[{name:"dataNFT_",type:"address",internalType:"address"},{name:"protocolFeeBps_",type:"uint16",internalType:"uint16"},{name:"treasury_",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"ipToken",inputs:[],outputs:[{name:"",type:"address",internalType:"contract IIpNFT"}],stateMutability:"view"},{type:"function",name:"owner",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"parentRoyaltyPercent",inputs:[{name:"",type:"uint256",internalType:"uint256"},{name:"",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"uint16",internalType:"uint16"}],stateMutability:"view"},{type:"function",name:"pause",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"paused",inputs:[],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"protocolFeeBps",inputs:[],outputs:[{name:"",type:"uint16",internalType:"uint16"}],stateMutability:"view"},{type:"function",name:"proxiableUUID",inputs:[],outputs:[{name:"",type:"bytes32",internalType:"bytes32"}],stateMutability:"view"},{type:"function",name:"renounceOwnership",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"royaltyStack",inputs:[{name:"",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"uint16",internalType:"uint16"}],stateMutability:"view"},{type:"function",name:"setParentIpsAndRoyaltyPercents",inputs:[{name:"childIpId",type:"uint256",internalType:"uint256"},{name:"parents",type:"uint256[]",internalType:"uint256[]"},{name:"creator",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"subscriptionExpiry",inputs:[{name:"",type:"uint256",internalType:"uint256"},{name:"",type:"address",internalType:"address"}],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"transferOwnership",inputs:[{name:"newOwner",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"treasury",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"unpause",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"updateProtocolFee",inputs:[{name:"newFeeBps",type:"uint16",internalType:"uint16"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"updateTreasury",inputs:[{name:"newTreasury",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"upgradeToAndCall",inputs:[{name:"newImplementation",type:"address",internalType:"address"},{name:"data",type:"bytes",internalType:"bytes"}],outputs:[],stateMutability:"payable"},{type:"event",name:"AccessPurchased",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"buyer",type:"address",indexed:!0,internalType:"address"},{name:"periods",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newExpiry",type:"uint256",indexed:!1,internalType:"uint256"},{name:"amountPaid",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"AgentRegistered",inputs:[{name:"agentId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"ipNftId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"agentAddress",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"ChildIpTagged",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"childIp",type:"uint256",indexed:!0,internalType:"uint256"},{name:"parentIp",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"DataDeleted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"DataMinted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"},{name:"contentHash",type:"bytes32",indexed:!1,internalType:"bytes32"},{name:"parents",type:"uint256[]",indexed:!1,internalType:"uint256[]"}],anonymous:!1},{type:"event",name:"DisputeAssertion",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"counterEvidenceHash",type:"bytes32",indexed:!1,internalType:"bytes32"}],anonymous:!1},{type:"event",name:"DisputeCancelled",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"}],anonymous:!1},{type:"event",name:"DisputeJudged",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"judgement",type:"bool",indexed:!1,internalType:"bool"}],anonymous:!1},{type:"event",name:"DisputeModuleUpdated",inputs:[{name:"disputeModule",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"DisputeRaised",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"initiator",type:"address",indexed:!0,internalType:"address"},{name:"targetId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"disputeTag",type:"bytes32",indexed:!1,internalType:"bytes32"}],anonymous:!1},{type:"event",name:"Initialized",inputs:[{name:"version",type:"uint64",indexed:!1,internalType:"uint64"}],anonymous:!1},{type:"event",name:"MarketPlaceUpdated",inputs:[{name:"marketPlace",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"OwnershipTransferred",inputs:[{name:"previousOwner",type:"address",indexed:!0,internalType:"address"},{name:"newOwner",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"Paused",inputs:[{name:"account",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"RoyaltyPaid",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"royaltyAmount",type:"uint256",indexed:!1,internalType:"uint256"},{name:"creator",type:"address",indexed:!1,internalType:"address"},{name:"protocolAmount",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"SignerUpdated",inputs:[{name:"signer",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"StatusUpdated",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"status",type:"uint8",indexed:!1,internalType:"enum IIpNFT.DataStatus"}],anonymous:!1},{type:"event",name:"TermsUpdated",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"newPrice",type:"uint128",indexed:!1,internalType:"uint128"},{name:"newDuration",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newRoyaltyBps",type:"uint16",indexed:!1,internalType:"uint16"},{name:"paymentToken",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"Unpaused",inputs:[{name:"account",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"Upgraded",inputs:[{name:"implementation",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"error",name:"AddressEmptyCode",inputs:[{name:"target",type:"address",internalType:"address"}]},{type:"error",name:"ERC1967InvalidImplementation",inputs:[{name:"implementation",type:"address",internalType:"address"}]},{type:"error",name:"ERC1967NonPayable",inputs:[]},{type:"error",name:"EnforcedPause",inputs:[]},{type:"error",name:"ExpectedPause",inputs:[]},{type:"error",name:"FailedCall",inputs:[]},{type:"error",name:"InvalidInitialization",inputs:[]},{type:"error",name:"InvalidParentIp",inputs:[]},{type:"error",name:"InvalidPayment",inputs:[]},{type:"error",name:"InvalidRoyalty",inputs:[]},{type:"error",name:"MaxParentsExceeded",inputs:[]},{type:"error",name:"MaxRoyaltyExceeded",inputs:[]},{type:"error",name:"NoSubscriptionFound",inputs:[]},{type:"error",name:"NotInitializing",inputs:[]},{type:"error",name:"OwnableInvalidOwner",inputs:[{name:"owner",type:"address",internalType:"address"}]},{type:"error",name:"OwnableUnauthorizedAccount",inputs:[{name:"account",type:"address",internalType:"address"}]},{type:"error",name:"ParentAlreadyExists",inputs:[]},{type:"error",name:"ParentIpAlreadyDeleted",inputs:[]},{type:"error",name:"ParentIpAlreadyDisputed",inputs:[]},{type:"error",name:"SubscriptionNotAllowed",inputs:[]},{type:"error",name:"TermsMismatch",inputs:[]},{type:"error",name:"UUPSUnauthorizedCallContext",inputs:[]},{type:"error",name:"UUPSUnsupportedProxiableUUID",inputs:[{name:"slot",type:"bytes32",internalType:"bytes32"}]},{type:"error",name:"Unauthorized",inputs:[]},{type:"error",name:"ZeroAddress",inputs:[]}],T=[{type:"constructor",inputs:[{name:"_owner",type:"address",internalType:"address"}],stateMutability:"nonpayable"},{type:"receive",stateMutability:"payable"},{type:"function",name:"claimRoyalty",inputs:[{name:"token",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"owner",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"renounceOwnership",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"transferOwnership",inputs:[{name:"newOwner",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"event",name:"OwnershipTransferred",inputs:[{name:"previousOwner",type:"address",indexed:!0,internalType:"address"},{name:"newOwner",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"error",name:"OwnableInvalidOwner",inputs:[{name:"owner",type:"address",internalType:"address"}]},{type:"error",name:"OwnableUnauthorizedAccount",inputs:[{name:"account",type:"address",internalType:"address"}]}],f=[{type:"receive",stateMutability:"payable"},{type:"function",name:"execute",inputs:[{name:"to",type:"address",internalType:"address"},{name:"value",type:"uint256",internalType:"uint256"},{name:"data",type:"bytes",internalType:"bytes"},{name:"operation",type:"uint8",internalType:"uint8"}],outputs:[{name:"result",type:"bytes",internalType:"bytes"}],stateMutability:"payable"},{type:"function",name:"isValidSignature",inputs:[{name:"hash",type:"bytes32",internalType:"bytes32"},{name:"signature",type:"bytes",internalType:"bytes"}],outputs:[{name:"magicValue",type:"bytes4",internalType:"bytes4"}],stateMutability:"view"},{type:"function",name:"isValidSigner",inputs:[{name:"signer",type:"address",internalType:"address"},{name:"",type:"bytes",internalType:"bytes"}],outputs:[{name:"",type:"bytes4",internalType:"bytes4"}],stateMutability:"view"},{type:"function",name:"owner",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"state",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"supportsInterface",inputs:[{name:"interfaceId",type:"bytes4",internalType:"bytes4"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"token",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"},{name:"",type:"address",internalType:"address"},{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"}],v="Connect with Camp Network",w=2628e3,A=86400,g=1e15,I=1,b=1e4;const E={DEVELOPMENT:{NAME:"DEVELOPMENT",AUTH_HUB_BASE_API:"https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",AUTH_ENDPOINT:"auth-testnet",ORIGIN_DASHBOARD:"https://origin.campnetwork.xyz",DATANFT_CONTRACT_ADDRESS:"0xB53F5723Dd4E46da32e1769Bd36A5aD880e707A5",MARKETPLACE_CONTRACT_ADDRESS:"0x97b0A18B2888e904940fFd19E480a28aeec3F055",CHAIN:d,IPNFT_ABI:m,MARKETPLACE_ABI:h,ROYALTY_VAULT_ABI:T,TBA_ABI:f},PRODUCTION:{NAME:"PRODUCTION",AUTH_HUB_BASE_API:"https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",AUTH_ENDPOINT:"auth-mainnet",ORIGIN_DASHBOARD:"https://origin.campnetwork.xyz",DATANFT_CONTRACT_ADDRESS:"0x39EeE1C3989f0dD543Dee60f8582F7F81F522C38",MARKETPLACE_CONTRACT_ADDRESS:"0xc69BAa987757d054455fC0f2d9797684E9FB8b9C",CHAIN:u,IPNFT_ABI:m,MARKETPLACE_ABI:h,ROYALTY_VAULT_ABI:T,TBA_ABI:f}};let C=[];const x=()=>C,k=e=>{function t(t){C.some((e=>e.info.uuid===t.detail.info.uuid))||(C=[...C,t.detail],e(C))}if("undefined"!=typeof window)return window.addEventListener("eip6963:announceProvider",t),window.dispatchEvent(new Event("eip6963:requestProvider")),()=>window.removeEventListener("eip6963:announceProvider",t)};
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
 * @returns A promise that resolves when the minting is complete.
 */
function _(e,t,n,i,r,s,o,d,u){return a(this,void 0,void 0,(function*(){return yield this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"mintWithSignature",[e,t,r,s,o,d,n,i,u],{waitForReceipt:!0})}))}
/**
 * Registers a Data NFT with the Origin service in order to obtain a signature for minting.
 * @param source The source of the Data NFT (e.g., "spotify", "twitter", "tiktok", or "file").
 * @param deadline The deadline for the registration operation.
 * @param licenseTerms The terms of the license for the NFT.
 * @param metadata The metadata associated with the NFT.
 * @param fileKey The file key(s) if the source is "file".
 * @param parents The IDs of the parent NFTs, if applicable.
 * @return A promise that resolves with the registration data.
 */function S(e,t,n,i,r,s){return a(this,void 0,void 0,(function*(){const a={source:e,deadline:Number(t),licenseTerms:{price:n.price.toString(),duration:n.duration,royaltyBps:n.royaltyBps,paymentToken:n.paymentToken},metadata:i,parentId:s?s.map((e=>e.toString())):[]};void 0!==r&&(a.fileKey=r);const o=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/register`,{method:"POST",headers:{Authorization:`Bearer ${this.getJwt()}`,"Content-Type":"application/json"},body:JSON.stringify(a)});if(!o.ok)throw new Error(`Failed to get signature: ${o.statusText}`);const d=yield o.json();if(d.isError)throw new Error(`Failed to get signature: ${d.message}`);return d.data}))}
/**
 * Updates the license terms of a specified IPNFT.
 * @param tokenId The ID of the IPNFT to update.
 * @param newTerms The new license terms to set.
 * @returns A promise that resolves when the transaction is complete.
 */function M(e,t){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"updateTerms",[e,t],{waitForReceipt:!0})}
/**
 * Sets the IPNFT as deleted
 * @param tokenId The token ID to set as deleted.
 * @returns A promise that resolves when the transaction is complete.
 */function P(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"finalizeDelete",[e])}
/**
 * Calls the getOrCreateRoyaltyVault method on the IPNFT contract.
 * @param tokenOwner The address of the token owner for whom to get or create the royalty vault.
 * @param simulateOnly If true, simulates the transaction without executing it.
 * @returns The address of the royalty vault associated with the specified token owner.
 */function N(e){return a(this,arguments,void 0,(function*(e,t=!1){const n=yield this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"getOrCreateRoyaltyVault",[e],{waitForReceipt:!0,simulate:t});return t?n:n.simulatedResult}))}
/**
 * Returns the license terms associated with a specific token ID.
 * @param tokenId The token ID to query.
 * @returns The license terms of the token ID.
 */function D(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"getTerms",[e])}
/**
 * Returns the owner of the specified IPNFT.
 * @param tokenId The ID of the IPNFT to query.
 * @returns The address of the owner of the IPNFT.
 */function F(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"ownerOf",[e])}
/**
 * Returns the number of IPNFTs owned by the given address.
 * @param owner The address to query.
 * @returns The number of IPNFTs owned by the address.
 */function O(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"balanceOf",[e])}
/**
 * Returns the metadata URI associated with a specific token ID.
 * @param tokenId The token ID to query.
 * @returns The metadata URI of the token ID.
 */function R(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"tokenURI",[e])}
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
 */function B(e,t){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"isApprovedForAll",[e,t])}function $(e,t,n){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"transferFrom",[e,t,n])}function H(e,t,n,i){const a=i?[e,t,n,i]:[e,t,n];return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"safeTransferFrom",a)}function j(e,t){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"approve",[e,t])}function L(e,t){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"setApprovalForAll",[e,t])}
/**
 * Buys access to a data NFT for a specified duration.
 * @param buyer The address of the buyer.
 * @param tokenId The ID of the data NFT.
 * @param expectedPrice The expected price for the access.
 * @param expectedDuration The expected duration of the access in seconds.
 * @param expectedPaymentToken The address of the payment token (use zero address for native token).
 * @param value The amount of native token to send (only required if paying with native token).
 * @returns A promise that resolves when the transaction is confirmed.
 */function z(e,t,n,i,a,r){return this.callContractMethod(this.environment.MARKETPLACE_CONTRACT_ADDRESS,this.environment.MARKETPLACE_ABI,"buyAccess",[e,t,n,i,a],{waitForReceipt:!0,value:r})}
/**
 * Checks if a user has access to a specific token based on subscription expiry.
 * @param user - The address of the user.
 * @param tokenId - The ID of the token.
 * @returns A promise that resolves to a boolean indicating if the user has access.
 */function q(e,t){return a(this,void 0,void 0,(function*(){try{const n=yield this.subscriptionExpiry(t,e);return n>BigInt(Math.floor(Date.now()/1e3))}catch(e){return!1}}))}function W(e,t){return this.callContractMethod(this.environment.MARKETPLACE_CONTRACT_ADDRESS,this.environment.MARKETPLACE_ABI,"subscriptionExpiry",[e,t])}
/**
 * Approves a spender to spend a specified amount of tokens on behalf of the owner.
 * If the current allowance is less than the specified amount, it will perform the approval.
 * @param {ApproveParams} params - The parameters for the approval.
 */var J;
/**
 * Enum representing the status of data in the system.
 * * - ACTIVE: The data is currently active and available.
 * * - PENDING_DELETE: The data is scheduled for deletion but not yet removed.
 * * - DELETED: The data has been deleted and is no longer available.
 */
exports.DataStatus=void 0,(J=exports.DataStatus||(exports.DataStatus={}))[J.ACTIVE=0]="ACTIVE",J[J.PENDING_DELETE=1]="PENDING_DELETE",J[J.DELETED=2]="DELETED";var V,K,G,Y,X,Z,Q,ee,te,ne,ie,ae,re,se,oe,de,ue,pe,le;
/**
 * The Origin class
 * Handles the upload of files to Origin, as well as querying the user's stats
 */class ye{constructor(e,t,n,i){V.add(this),this.jwt=e,this.viemClient=n,this.environment=t,this.baseParentId=i,
// DataNFT methods
this.mintWithSignature=_.bind(this),this.registerIpNFT=S.bind(this),this.updateTerms=M.bind(this),this.finalizeDelete=P.bind(this),this.getOrCreateRoyaltyVault=N.bind(this),this.getTerms=D.bind(this),this.ownerOf=F.bind(this),this.balanceOf=O.bind(this),this.tokenURI=R.bind(this),this.dataStatus=U.bind(this),this.isApprovedForAll=B.bind(this),this.transferFrom=$.bind(this),this.safeTransferFrom=H.bind(this),this.approve=j.bind(this),this.setApprovalForAll=L.bind(this),
// Marketplace methods
this.buyAccess=z.bind(this),this.hasAccess=q.bind(this),this.subscriptionExpiry=W.bind(this)}getJwt(){return this.jwt}setViemClient(e){this.viemClient=e}mintFile(e,t,n,i,s){return a(this,void 0,void 0,(function*(){let a,o=null;try{o=yield r(this,V,"m",Q).call(this)}catch(e){throw new Error("Failed to mint file IP. Wallet not connected.")}try{if(a=yield r(this,V,"m",Y).call(this,e,s),!a||!a.key)throw new Error("Failed to upload file or get upload info.")}catch(e){throw new Error(`File upload failed: ${e instanceof Error?e.message:String(e)}`)}e.type&&(t.mimetype=e.type);const d=BigInt(Date.now()+6e5);// 10 minutes from now
let u;this.baseParentId&&(i||(i=[]),i.unshift(this.baseParentId));try{u=yield this.registerIpNFT("file",d,n,t,a.key,i)}catch(e){throw yield r(this,V,"m",G).call(this,a.key,"failed"),new Error(`Failed to register IpNFT: ${e instanceof Error?e.message:String(e)}`)}const{tokenId:p,signerAddress:l,creatorContentHash:y,signature:c,uri:m}=u;if(!(p&&l&&y&&void 0!==c&&m))throw new Error("Failed to register IpNFT: Missing required fields in registration response.");try{const e=yield this.mintWithSignature(o,p,i||[],!0,y,m,n,d,c);if(-1===["0x1","success"].indexOf(e.receipt.status))throw yield r(this,V,"m",G).call(this,a.key,"failed"),new Error(`Minting failed with status: ${e.receipt.status}`)}catch(e){throw yield r(this,V,"m",G).call(this,a.key,"failed"),new Error(`Minting transaction failed: ${e instanceof Error?e.message:String(e)}`)}return p.toString()}))}mintSocial(e,t,n){return a(this,void 0,void 0,(function*(){let i=null;try{i=yield r(this,V,"m",Q).call(this)}catch(e){throw new Error("Failed to mint social IP. Wallet not connected.")}t.mimetype=`social/${e}`;const a=BigInt(Math.floor(Date.now()/1e3)+600);// 10 minutes from now
let s,o=this.baseParentId?[this.baseParentId]:[];try{s=yield this.registerIpNFT(e,a,n,t,void 0,o)}catch(e){throw new Error(`Failed to register Social IpNFT: ${e instanceof Error?e.message:String(e)}`)}const{tokenId:d,signerAddress:u,creatorContentHash:p,signature:l,uri:y}=s;if(!(d&&u&&p&&void 0!==l&&y))throw new Error("Failed to register Social IpNFT: Missing required fields in registration response.");try{const e=yield this.mintWithSignature(i,d,o,!0,p,y,n,a,l);if(-1===["0x1","success"].indexOf(e.receipt.status))throw new Error(`Minting Social IpNFT failed with status: ${e.receipt.status}`)}catch(e){throw new Error(`Minting transaction failed: ${e instanceof Error?e.message:String(e)}`)}return d.toString()}))}
/**
     * Call a contract method.
     * @param {string} contractAddress The contract address.
     * @param {Abi} abi The contract ABI.
     * @param {string} methodName The method name.
     * @param {any[]} params The method parameters.
     * @param {CallOptions} [options] The call options.
     * @returns {Promise<any>} A promise that resolves with the result of the contract call or transaction hash.
     * @throws {Error} - Throws an error if the wallet client is not connected and the method is not a view function.
     */callContractMethod(t,n,i,s){return a(this,arguments,void 0,(function*(t,n,i,a,s={}){var o;let d=null;try{d=yield r(this,V,"m",Q).call(this)}catch(e){throw new Error("Failed to call contract method. Wallet not connected.")}const u=e.getAbiItem({abi:n,name:i});if(u&&"stateMutability"in u&&("view"===u.stateMutability||"pure"===u.stateMutability)){const e=c();return(yield e.readContract({address:t,abi:n,functionName:i,args:a}))||null}yield r(this,V,"m",Z).call(this,this.environment.CHAIN);const p=c(),{result:l,request:y}=yield p.simulateContract({account:d,address:t,abi:n,functionName:i,args:a,value:s.value});
// simulate
if(s.simulate)return l;try{const e=yield null===(o=this.viemClient)||void 0===o?void 0:o.writeContract(y);if("string"!=typeof e)throw new Error("Transaction failed to send.");if(!s.waitForReceipt)return{txHash:e,simulatedResult:l};return{txHash:e,receipt:yield r(this,V,"m",X).call(this,e),simulatedResult:l}}catch(e){throw console.error("Transaction failed:",e),new Error("Transaction failed: "+e)}}))}
/**
     * Buy access to an asset by first checking its price via getTerms, then calling buyAccess.
     * @param {bigint} tokenId The token ID of the asset.
     * @returns {Promise<any>} The result of the buyAccess call.
     */buyAccessSmart(t){return a(this,void 0,void 0,(function*(){let n=null;try{n=yield r(this,V,"m",Q).call(this)}catch(e){throw new Error("Failed to buy access. Wallet not connected.")}const i=yield this.getTerms(t);if(!i)throw new Error("Failed to fetch terms for asset");const{price:s,paymentToken:o,duration:u}=i;if(void 0===s||void 0===o||void 0===u)throw new Error("Terms missing price, paymentToken, or duration");const p=s;return o===e.zeroAddress?this.buyAccess(n,t,p,u,o,p):(yield function(t){return a(this,arguments,void 0,(function*({walletClient:t,publicClient:n,tokenAddress:i,owner:a,spender:r,amount:s}){(yield n.readContract({address:i,abi:e.erc20Abi,functionName:"allowance",args:[a,r]}))<s&&(yield t.writeContract({address:i,account:a,abi:e.erc20Abi,functionName:"approve",args:[r,s],chain:d}))}))}({walletClient:this.viemClient,publicClient:c(),tokenAddress:o,owner:n,spender:this.environment.MARKETPLACE_CONTRACT_ADDRESS,amount:p}),this.buyAccess(n,t,p,u,o))}))}getData(e){return a(this,void 0,void 0,(function*(){const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/data/${e}`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!t.ok)throw new Error("Failed to fetch data");return t.json()}))}
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
     */getRoyalties(t,n){return a(this,void 0,void 0,(function*(){try{const i=yield this.getTokenBoundAccount(t),a=c();let r,s;if(n&&n!==e.zeroAddress){
// erc20 (wrapped camp)
const t=[{inputs:[{name:"owner",type:"address"}],name:"balanceOf",outputs:[{name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"decimals",outputs:[{name:"",type:"uint8"}],stateMutability:"view",type:"function"}];r=yield this.callContractMethod(n,t,"balanceOf",[i]);const a=yield this.callContractMethod(n,t,"decimals",[]);s=e.formatUnits(r,a)}else r=yield a.getBalance({address:i}),s=e.formatEther(r);return{tokenBoundAccount:i,balance:r,balanceFormatted:s}}catch(e){throw new Error(`Failed to retrieve royalties for token ${t}: ${e instanceof Error?e.message:String(e)}`)}}))}
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
     */claimRoyalties(t,n,i){return a(this,void 0,void 0,(function*(){const a=yield r(this,V,"m",ee).call(this,n),s=yield this.getTokenBoundAccount(t),o=(yield this.getRoyalties(t,i)).balance;if(o===BigInt(0))throw new Error("No royalties available to claim");let d,u,p;
// Call execute on the TBA
return i&&i!==e.zeroAddress?(
// ERC20 token transfer
d=i,u=BigInt(0),
// Encode ERC20 transfer call: transfer(address to, uint256 amount)
p=e.encodeFunctionData({abi:[{inputs:[{name:"to",type:"address"},{name:"amount",type:"uint256"}],name:"transfer",outputs:[{name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"}],functionName:"transfer",args:[a,o]})):(
// Native token transfer
d=a,u=o,p="0x"),this.callContractMethod(s,this.environment.TBA_ABI,"execute",[d,u,p,0],// operation: 0 = CALL
{waitForReceipt:!0,value:BigInt(0)})}))}}V=new WeakSet,K=function(e){return a(this,void 0,void 0,(function*(){try{const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/upload-url`,{method:"POST",body:JSON.stringify({name:e.name,type:e.type}),headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!t.ok)throw new Error(`HTTP ${t.status}: ${t.statusText}`);const n=yield t.json();if(n.isError)throw new Error(n.message||"Failed to generate upload URL");return n.data}catch(e){throw console.error("Failed to generate upload URL:",e),e}}))},G=function(e,t){return a(this,void 0,void 0,(function*(){try{const n=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/update-status`,{method:"PATCH",body:JSON.stringify({status:t,fileKey:e}),headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!n.ok){const e=yield n.text().catch((()=>"Unknown error"));throw new Error(`HTTP ${n.status}: ${e}`)}return!0}catch(e){throw console.error("Failed to update origin status:",e),e}}))},Y=function(e,t){return a(this,void 0,void 0,(function*(){let n;try{n=yield r(this,V,"m",K).call(this,e)}catch(e){throw console.error("Failed to generate upload URL:",e),new Error(`Failed to generate upload URL: ${e instanceof Error?e.message:String(e)}`)}if(!n)throw new Error("Failed to generate upload URL: No upload info returned");try{yield((e,t,n)=>new Promise(((a,r)=>{i.put(t,e,Object.assign({headers:{"Content-Type":e.type}},"undefined"!=typeof window&&"function"==typeof n?{onUploadProgress:e=>{if(e.total){const t=e.loaded/e.total*100;n(t)}}}:{})).then((e=>{a(e.data)})).catch((e=>{var t;const n=(null===(t=null==e?void 0:e.response)||void 0===t?void 0:t.data)||(null==e?void 0:e.message)||"Upload failed";r(n)}))})))(e,n.url,(null==t?void 0:t.progressCallback)||(()=>{}))}catch(e){try{yield r(this,V,"m",G).call(this,n.key,"failed")}catch(e){console.error("Failed to update status to failed:",e)}const t=e instanceof Error?e.message:String(e);throw new Error(`Failed to upload file: ${t}`)}try{yield r(this,V,"m",G).call(this,n.key,"success")}catch(e){console.error("Failed to update status to success:",e)}return n}))},X=function(e){return a(this,arguments,void 0,(function*(e,t={}){var n,i,a;const r=c();let s=e;const o=null!==(n=t.confirmations)&&void 0!==n?n:1,d=null!==(i=t.timeoutMs)&&void 0!==i?i:18e4,u=null!==(a=t.pollingIntervalMs)&&void 0!==a?a:1500;try{return yield r.waitForTransactionReceipt({hash:s,confirmations:o,timeout:d,pollingInterval:u,onReplaced:e=>{s=e.transaction.hash}})}catch(e){
// fallback
const t=Date.now();for(;Date.now()-t<d;){try{const e=yield r.getTransactionReceipt({hash:s});if(e&&e.blockNumber)return e}catch(e){}yield new Promise((e=>setTimeout(e,u)))}throw e}}))},Z=function(e){return a(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected. Could not ensure chain ID.");let t=yield this.viemClient.request({method:"eth_chainId",params:[]});if("string"==typeof t&&(t=parseInt(t,16)),t!==e.id){(e=>{y=e,l=null})// reset public client to be recreated with new chain
(e);try{yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16)}]})}catch(t){
// Unrecognized chain
if(4902!==t.code)throw t;yield this.viemClient.request({method:"wallet_addEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16),chainName:e.name,rpcUrls:e.rpcUrls.default.http,nativeCurrency:e.nativeCurrency}]}),yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16)}]})}}}))},Q=function(){return a(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected. Please connect a wallet.");
// If account is already set on the client, return it directly
if(this.viemClient.account)return this.viemClient.account.address;
// Otherwise request accounts (browser wallet flow)
const e=yield this.viemClient.request({method:"eth_requestAccounts",params:[]});if(!e||0===e.length)throw new Error("No accounts found in connected wallet.");return e[0]}))},ee=function(e){return a(this,void 0,void 0,(function*(){if(e)return e;if(!this.viemClient)throw new Error("No wallet address provided and no wallet client connected. Please provide an owner address or connect a wallet.");try{const e=yield this.viemClient.request({method:"eth_requestAccounts",params:[]});if(!e||0===e.length)throw new Error("No accounts found in connected wallet.");return e[0]}catch(e){throw new Error(`Failed to get wallet address: ${e instanceof Error?e.message:String(e)}`)}}))};
/**
 * Adapter for viem WalletClient
 */
class ce{constructor(e){this.type="viem",this.signer=e}getAddress(){return a(this,void 0,void 0,(function*(){if(this.signer.account)return this.signer.account.address;const e=yield this.signer.request({method:"eth_requestAccounts",params:[]});if(!e||0===e.length)throw new Error("No accounts found in viem wallet client");return e[0]}))}signMessage(e){return a(this,void 0,void 0,(function*(){const t=yield this.getAddress();return yield this.signer.signMessage({account:t,message:e})}))}getChainId(){return a(this,void 0,void 0,(function*(){var e;return(null===(e=this.signer.chain)||void 0===e?void 0:e.id)||1}))}}
/**
 * Adapter for ethers Signer (v5 and v6)
 */class me{constructor(e){this.type="ethers",this.signer=e}getAddress(){return a(this,void 0,void 0,(function*(){
// Works for both ethers v5 and v6
if("function"==typeof this.signer.getAddress)return yield this.signer.getAddress();if(this.signer.address)return this.signer.address;throw new Error("Unable to get address from ethers signer")}))}signMessage(e){return a(this,void 0,void 0,(function*(){if("function"!=typeof this.signer.signMessage)throw new Error("Signer does not support signMessage");return yield this.signer.signMessage(e)}))}getChainId(){return a(this,void 0,void 0,(function*(){
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
 */class he{constructor(e){this.type="custom",this.signer=e}getAddress(){return a(this,void 0,void 0,(function*(){if("function"==typeof this.signer.getAddress)return yield this.signer.getAddress();if(this.signer.address)return this.signer.address;throw new Error("Custom signer must implement getAddress() or have address property")}))}signMessage(e){return a(this,void 0,void 0,(function*(){if("function"!=typeof this.signer.signMessage)throw new Error("Custom signer must implement signMessage()");return yield this.signer.signMessage(e)}))}getChainId(){return a(this,void 0,void 0,(function*(){if("function"==typeof this.signer.getChainId){const e=yield this.signer.getChainId();return"bigint"==typeof e?Number(e):e}return void 0!==this.signer.chainId?"bigint"==typeof this.signer.chainId?Number(this.signer.chainId):this.signer.chainId:484;
// Default to mainnet
}))}}
/**
 * Factory function to create appropriate adapter based on signer type
 */function Te(e){
// Check for viem WalletClient
return e.transport&&e.chain&&"function"==typeof e.signMessage?new ce(e):
// Check for ethers signer (v5 or v6)
e._isSigner||e.provider&&"function"==typeof e.signMessage?new me(e):new he(e)}
/**
 * Browser localStorage adapter
 */class fe{getItem(e){return a(this,void 0,void 0,(function*(){return"undefined"==typeof localStorage?null:localStorage.getItem(e)}))}setItem(e,t){return a(this,void 0,void 0,(function*(){"undefined"!=typeof localStorage&&localStorage.setItem(e,t)}))}removeItem(e){return a(this,void 0,void 0,(function*(){"undefined"!=typeof localStorage&&localStorage.removeItem(e)}))}}
/**
 * In-memory storage adapter for Node.js
 */class ve{constructor(){this.storage=new Map}getItem(e){return a(this,void 0,void 0,(function*(){return this.storage.get(e)||null}))}setItem(e,t){return a(this,void 0,void 0,(function*(){this.storage.set(e,t)}))}removeItem(e){return a(this,void 0,void 0,(function*(){this.storage.delete(e)}))}clear(){this.storage.clear()}}ne=new WeakMap,ie=new WeakMap,ae=new WeakMap,re=new WeakMap,te=new WeakSet,se=function(e,t){r(this,ne,"f")[e]&&r(this,ne,"f")[e].forEach((e=>e(t)))},oe=function(e){return a(this,void 0,void 0,(function*(){const t=yield r(this,re,"f").getItem("camp-sdk:wallet-address"),n=yield r(this,re,"f").getItem("camp-sdk:user-id"),i=yield r(this,re,"f").getItem("camp-sdk:jwt"),a=yield r(this,re,"f").getItem("camp-sdk:environment");t&&n&&i&&(a===this.environment.NAME||!a)?(this.walletAddress=t,this.userId=n,this.jwt=i,this.origin=new ye(this.jwt,this.environment,this.viem,this.baseParentId),this.isAuthenticated=!0,e?this.setProvider({provider:e.provider,info:e.info||{name:"Unknown"},address:t}):r(this,ie,"f")||(console.warn("No matching provider was given for the stored wallet address. Trying to recover provider."),yield this.recoverProvider())):this.isAuthenticated=!1}))},de=function(){return a(this,void 0,void 0,(function*(){try{const[t]=yield this.viem.requestAddresses();return this.walletAddress=e.checksumAddress(t),this.walletAddress}catch(e){throw new o(e)}}))},ue=function(){return a(this,void 0,void 0,(function*(){try{const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/client-user/nonce`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({walletAddress:this.walletAddress})}),t=yield e.json();return 200!==e.status?Promise.reject(t.message||"Failed to fetch nonce"):t.data}catch(e){throw new Error(e)}}))},pe=function(e,t){return a(this,void 0,void 0,(function*(){try{const n=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/client-user/verify`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({message:e,signature:t,walletAddress:this.walletAddress})}),i=yield n.json(),a=i.data.split(".")[1],r=JSON.parse(atob(a));return{success:!i.isError,userId:r.id,token:i.data}}catch(e){throw new o(e)}}))},le=function(e,t,i){return n.createSiweMessage({domain:t||(r(this,ie,"f")?"localhost":window.location.host),address:this.walletAddress,statement:v,uri:i||(r(this,ie,"f")?"http://localhost":window.location.origin),version:"1",chainId:this.environment.CHAIN.id,nonce:e})},exports.Auth=
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
constructor({clientId:e,redirectUri:t,environment:n="DEVELOPMENT",baseParentId:i,storage:a}){if(te.add(this),ne.set(this,void 0),ie.set(this,void 0),ae.set(this,void 0),re.set(this,void 0),!e)throw new Error("clientId is required");if(-1===["PRODUCTION","DEVELOPMENT"].indexOf(n))throw new Error("Invalid environment, must be DEVELOPMENT or PRODUCTION");s(this,ie,"undefined"==typeof window,"f"),s(this,re,a||(r(this,ie,"f")?new ve:new fe),"f"),this.viem=null,this.environment=E[n],this.baseParentId=i,this.redirectUri=(e=>{const t=["twitter","spotify"];return"object"==typeof e?t.reduce(((t,n)=>(t[n]=e[n]||("undefined"!=typeof window?window.location.href:""),t)),{}):"string"==typeof e?t.reduce(((t,n)=>(t[n]=e,t)),{}):e?{}:t.reduce(((e,t)=>(e[t]="undefined"!=typeof window?window.location.href:"",e)),{})})(t),this.clientId=e,this.isAuthenticated=!1,this.jwt=null,this.origin=null,this.walletAddress=null,this.userId=null,s(this,ne,{},"f"),
// only subscribe to providers in browser environment
r(this,ie,"f")||k((e=>{r(this,te,"m",se).call(this,"providers",e)})),r(this,te,"m",oe).call(this)}
/**
     * Subscribe to an event. Possible events are "state", "provider", "providers", and "viem".
     * @param {("state"|"provider"|"providers"|"viem")} event The event.
     * @param {function} callback The callback function.
     * @returns {void}
     * @example
     * auth.on("state", (state) => {
     *  console.log(state);
     * });
     */on(e,t){r(this,ne,"f")[e]||(r(this,ne,"f")[e]=[]),r(this,ne,"f")[e].push(t),"providers"===e&&t(x())}
/**
     * Unsubscribe from an event. Possible events are "state", "provider", "providers", and "viem".
     * @param {("state"|"provider"|"providers"|"viem")} event The event.
     * @param {function} callback The callback function.
     * @returns {void}
     */off(e,t){r(this,ne,"f")[e]&&(r(this,ne,"f")[e]=r(this,ne,"f")[e].filter((e=>e!==t)))}
/**
     * Set the loading state.
     * @param {boolean} loading The loading state.
     * @returns {void}
     */setLoading(e){r(this,te,"m",se).call(this,"state",e?"loading":this.isAuthenticated?"authenticated":"unauthenticated")}
/**
     * Set the provider. This is useful for setting the provider when the user selects a provider from the UI or when dApp wishes to use a specific provider.
     * @param {object} options The options object. Includes the provider and the provider info.
     * @returns {void}
     * @throws {APIError} - Throws an error if the provider is not provided.
     */setProvider({provider:n,info:i,address:a}){if(!n)throw new o("provider is required");this.viem=((n,i="window.ethereum",a,r)=>{var s,o;if(!n&&!p)return console.warn("Provider is required to create a client."),null;const u=a||d;if(!p||p.transport.name!==i&&n||r!==(null===(s=p.account)||void 0===s?void 0:s.address)&&n||(null==y?void 0:y.id)!==u.id){const a={chain:u,transport:e.custom(n,{name:i})};r&&(a.account=t.toAccount(r)),p=e.createWalletClient(a),y=u,l&&(null===(o=l.chain)||void 0===o?void 0:o.id)!==u.id&&(l=null)}return p})(n,i.name,this.environment.CHAIN,a),this.origin&&this.origin.setViemClient(this.viem),
// TODO: only use one of these
r(this,te,"m",se).call(this,"viem",this.viem),r(this,te,"m",se).call(this,"provider",{provider:n,info:i}),r(this,re,"f").setItem("camp-sdk:provider",JSON.stringify(i))}
/**
     * Set the wallet address. This is useful for edge cases where the provider can't return the wallet address. Don't use this unless you know what you're doing.
     * @param {string} walletAddress The wallet address.
     * @returns {void}
     */setWalletAddress(e){this.walletAddress=e}
/**
     * Recover the provider from local storage.
     * @returns {Promise<void>}
     */recoverProvider(){return a(this,void 0,void 0,(function*(){var e,t,n,i,a,s,o,d,u,p,l,y,c;if(!this.walletAddress)return void console.warn("No wallet address found in local storage. Please connect your wallet again.");const m=yield r(this,re,"f").getItem("camp-sdk:provider");if(!m)return;const h=JSON.parse(m);let T;const f=null!==(e=x())&&void 0!==e?e:[];
// first pass: try to find provider by UUID/name and check if it has the right address
// without prompting (using eth_accounts)
for(const e of f)try{if(h.uuid&&(null===(t=e.info)||void 0===t?void 0:t.uuid)===h.uuid||h.name&&(null===(n=e.info)||void 0===n?void 0:n.name)===h.name){
// silently check if the wallet address matches first
const t=yield e.provider.request({method:"eth_accounts"});if(t.length>0&&(null===(i=t[0])||void 0===i?void 0:i.toLowerCase())===(null===(a=this.walletAddress)||void 0===a?void 0:a.toLowerCase())){T=e;break}}}catch(e){console.warn("Failed to fetch accounts from provider:",e)}
// second pass: if no provider found by UUID/name match, try to find by address only
// but still avoid prompting
if(!T)for(const e of f)try{
// skip providers we already checked in the first pass
if(h.uuid&&(null===(s=e.info)||void 0===s?void 0:s.uuid)===h.uuid||h.name&&(null===(o=e.info)||void 0===o?void 0:o.name)===h.name)continue;const t=yield e.provider.request({method:"eth_accounts"});if(t.length>0&&(null===(d=t[0])||void 0===d?void 0:d.toLowerCase())===(null===(u=this.walletAddress)||void 0===u?void 0:u.toLowerCase())){T=e;break}}catch(e){console.warn("Failed to fetch accounts from provider:",e)}
// third pass: if still no provider found and we have UUID/name info,
// try prompting the user (only for the stored provider)
if(!T&&(h.uuid||h.name))for(const e of f)try{if(h.uuid&&(null===(p=e.info)||void 0===p?void 0:p.uuid)===h.uuid||h.name&&(null===(l=e.info)||void 0===l?void 0:l.name)===h.name){const t=yield e.provider.request({method:"eth_requestAccounts"});if(t.length>0&&(null===(y=t[0])||void 0===y?void 0:y.toLowerCase())===(null===(c=this.walletAddress)||void 0===c?void 0:c.toLowerCase())){T=e;break}}}catch(e){console.warn("Failed to reconnect to stored provider:",e)}T?this.setProvider({provider:T.provider,info:T.info||{name:"Unknown"},address:this.walletAddress}):console.warn("No matching provider found for the stored wallet address. Please connect your wallet again.")}))}
/**
     * Disconnect the user.
     * @returns {Promise<void>}
     */disconnect(){return a(this,void 0,void 0,(function*(){this.isAuthenticated&&(r(this,te,"m",se).call(this,"state","unauthenticated"),this.isAuthenticated=!1,this.walletAddress=null,this.userId=null,this.jwt=null,this.origin=null,s(this,ae,void 0,"f"),yield r(this,re,"f").removeItem("camp-sdk:wallet-address"),yield r(this,re,"f").removeItem("camp-sdk:user-id"),yield r(this,re,"f").removeItem("camp-sdk:jwt"),yield r(this,re,"f").removeItem("camp-sdk:environment"))}))}
/**
     * Connect the user's wallet and sign the message.
     * @returns {Promise<{ success: boolean; message: string; walletAddress: string }>} A promise that resolves with the authentication result.
     * @throws {APIError} - Throws an error if the user cannot be authenticated.
     */connect(){return a(this,void 0,void 0,(function*(){r(this,te,"m",se).call(this,"state","loading");try{this.walletAddress||(yield r(this,te,"m",de).call(this)),this.walletAddress=e.checksumAddress(this.walletAddress);const t=yield r(this,te,"m",ue).call(this),n=r(this,te,"m",le).call(this,t),i=yield this.viem.signMessage({account:this.walletAddress,message:n}),a=yield r(this,te,"m",pe).call(this,n,i);if(a.success)return this.isAuthenticated=!0,this.userId=a.userId,this.jwt=a.token,this.origin=new ye(this.jwt,this.environment,this.viem,this.baseParentId),yield r(this,re,"f").setItem("camp-sdk:jwt",this.jwt),yield r(this,re,"f").setItem("camp-sdk:wallet-address",this.walletAddress),yield r(this,re,"f").setItem("camp-sdk:user-id",this.userId),yield r(this,re,"f").setItem("camp-sdk:environment",this.environment.NAME),r(this,te,"m",se).call(this,"state","authenticated"),{success:!0,message:"Successfully authenticated",walletAddress:this.walletAddress};throw this.isAuthenticated=!1,r(this,te,"m",se).call(this,"state","unauthenticated"),new o("Failed to authenticate")}catch(e){throw this.isAuthenticated=!1,r(this,te,"m",se).call(this,"state","unauthenticated"),new o(e)}}))}
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
     */connectWithSigner(t,n){return a(this,void 0,void 0,(function*(){r(this,te,"m",se).call(this,"state","loading");try{s(this,ae,Te(t),"f"),this.walletAddress=e.checksumAddress(yield r(this,ae,"f").getAddress()),
// store the signer as viem client if it's a viem client, otherwise keep adapter
"viem"===r(this,ae,"f").type&&(this.viem=t);const i=yield r(this,te,"m",ue).call(this),a=r(this,te,"m",le).call(this,i,null==n?void 0:n.domain,null==n?void 0:n.uri),d=yield r(this,ae,"f").signMessage(a),u=yield r(this,te,"m",pe).call(this,a,d);if(u.success)return this.isAuthenticated=!0,this.userId=u.userId,this.jwt=u.token,this.origin=new ye(this.jwt,this.environment,this.viem,this.baseParentId),yield r(this,re,"f").setItem("camp-sdk:jwt",this.jwt),yield r(this,re,"f").setItem("camp-sdk:wallet-address",this.walletAddress),yield r(this,re,"f").setItem("camp-sdk:user-id",this.userId),yield r(this,re,"f").setItem("camp-sdk:environment",this.environment.NAME),r(this,te,"m",se).call(this,"state","authenticated"),{success:!0,message:"Successfully authenticated",walletAddress:this.walletAddress};throw this.isAuthenticated=!1,r(this,te,"m",se).call(this,"state","unauthenticated"),new o("Failed to authenticate")}catch(e){throw this.isAuthenticated=!1,s(this,ae,void 0,"f"),r(this,te,"m",se).call(this,"state","unauthenticated"),new o(e)}}))}
/**
     * Get the user's linked social accounts.
     * @returns {Promise<Record<string, boolean>>} A promise that resolves with the user's linked social accounts.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated or if the request fails.
     * @example
     * const auth = new Auth({ clientId: "your-client-id" });
     * const socials = await auth.getLinkedSocials();
     * console.log(socials);
     */getLinkedSocials(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/client-user/connections-sdk`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"}}).then((e=>e.json()));if(e.isError)throw new o(e.message||"Failed to fetch connections");{const t={};return Object.keys(e.data.data).forEach((n=>{t[n.split("User")[0]]=e.data.data[n]})),t}}))}
/**
     * Link the user's Twitter account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated or in Node.js environment.
     */linkTwitter(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(r(this,ie,"f"))throw new Error("Social linking requires browser environment for OAuth flow");window.location.href=`${this.environment.AUTH_HUB_BASE_API}/twitter/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.twitter}`}))}
/**
     * Link the user's Discord account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated or in Node.js environment.
     */linkDiscord(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(r(this,ie,"f"))throw new Error("Social linking requires browser environment for OAuth flow");window.location.href=`${this.environment.AUTH_HUB_BASE_API}/discord/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.discord}`}))}
/**
     * Link the user's Spotify account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated or in Node.js environment.
     */linkSpotify(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(r(this,ie,"f"))throw new Error("Social linking requires browser environment for OAuth flow");window.location.href=`${this.environment.AUTH_HUB_BASE_API}/spotify/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.spotify}`}))}
/**
     * Link the user's TikTok account.
     * @param {string} handle The user's TikTok handle.
     * @returns {Promise<any>} A promise that resolves with the TikTok account data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */linkTikTok(e){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/tiktok/connect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userHandle:e,clientId:this.clientId,userId:this.userId})}).then((e=>e.json()));if(t.isError)throw"Request failed with status code 502"===t.message?new o("TikTok service is currently unavailable, try again later"):new o(t.message||"Failed to link TikTok account");return t.data}))}
/**
     * Send an OTP to the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @returns {Promise<any>} A promise that resolves with the OTP data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */sendTelegramOTP(e){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!e)throw new o("Phone number is required");yield this.unlinkTelegram();const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/telegram/sendOTP-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:e})}).then((e=>e.json()));if(t.isError)throw new o(t.message||"Failed to send Telegram OTP");return t.data}))}
/**
     * Link the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @param {string} otp The OTP.
     * @param {string} phoneCodeHash The phone code hash.
     * @returns {Promise<object>} A promise that resolves with the Telegram account data.
     * @throws {APIError|Error} - Throws an error if the user is not authenticated. Also throws an error if the phone number, OTP, and phone code hash are not provided.
     */linkTelegram(e,t,n){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!e||!t||!n)throw new o("Phone number, OTP, and phone code hash are required");const i=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/telegram/signIn-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:e,code:t,phone_code_hash:n,userId:this.userId,clientId:this.clientId})}).then((e=>e.json()));if(i.isError)throw new o(i.message||"Failed to link Telegram account");return i.data}))}
/**
     * Unlink the user's Twitter account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTwitter(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/twitter/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new o(e.message||"Failed to unlink Twitter account");return e.data}))}
/**
     * Unlink the user's Discord account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkDiscord(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new o("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/discord/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new o(e.message||"Failed to unlink Discord account");return e.data}))}
/**
     * Unlink the user's Spotify account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkSpotify(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new o("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/spotify/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new o(e.message||"Failed to unlink Spotify account");return e.data}))}
/**
     * Unlink the user's TikTok account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTikTok(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new o("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/tiktok/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((e=>e.json()));if(e.isError)throw new o(e.message||"Failed to unlink TikTok account");return e.data}))}
/**
     * Unlink the user's Telegram account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTelegram(){return a(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new o("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/telegram/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((e=>e.json()));if(e.isError)throw new o(e.message||"Failed to unlink Telegram account");return e.data}))}},exports.BrowserStorage=fe,exports.CustomSignerAdapter=he,exports.EthersSignerAdapter=me,exports.MemoryStorage=ve,exports.ViemSignerAdapter=ce,exports.campMainnet=u,exports.campTestnet=d,exports.createLicenseTerms=(e,t,n,i)=>{if(n<I||n>b)throw new Error(`Royalty basis points must be between ${I} and ${b}`);if(t<A||t>w)throw new Error(`Duration must be between ${A} and ${w} seconds`);if(e<g)throw new Error(`Price must be at least ${g} wei`);return{price:e,duration:t,royaltyBps:n,paymentToken:i}},exports.createNodeWalletClient=
/**
 * Create a wallet client for Node.js environment
 * @param account The viem account
 * @param chain The chain to use
 * @param rpcUrl Optional RPC URL (defaults to chain's default RPC)
 * @returns WalletClient
 */
function(t,n,i){return e.createWalletClient({account:t,chain:n,transport:e.http(i)})},exports.createSignerAdapter=Te;
