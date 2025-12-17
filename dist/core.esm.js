import{createWalletClient as e,http as t,custom as n,createPublicClient as i,encodeFunctionData as a,checksumAddress as r,zeroAddress as s,keccak256 as o,toBytes as d,erc20Abi as u,getAbiItem as p,formatEther as l,formatUnits as y}from"viem";import{toAccount as c}from"viem/accounts";import{createSiweMessage as m}from"viem/siwe";import h from"axios";
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
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */function T(e,t,n,i){return new(n||(n=Promise))((function(a,r){function s(e){try{d(i.next(e))}catch(e){r(e)}}function o(e){try{d(i.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?a(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,o)}d((i=i.apply(e,t||[])).next())}))}function f(e,t,n,i){if("a"===n&&!i)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!i:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===n?i:"a"===n?i.call(e):i?i.value:t.get(e)}function v(e,t,n,i,a){if("m"===i)throw new TypeError("Private method is not writable");if("a"===i&&!a)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!a:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===i?a.call(e,n):a?a.value=n:t.set(e,n),n}"function"==typeof SuppressedError&&SuppressedError;
/**
 * Adapter for viem WalletClient
 */
class w{constructor(e){this.type="viem",this.signer=e}getAddress(){return T(this,void 0,void 0,(function*(){if(this.signer.account)return this.signer.account.address;const e=yield this.signer.request({method:"eth_requestAccounts",params:[]});if(!e||0===e.length)throw new Error("No accounts found in viem wallet client");return e[0]}))}signMessage(e){return T(this,void 0,void 0,(function*(){const t=yield this.getAddress();return yield this.signer.signMessage({account:t,message:e})}))}signTypedData(e,t,n){return T(this,void 0,void 0,(function*(){throw new Error("Viem WalletClient does not support signTypedData")}))}getChainId(){return T(this,void 0,void 0,(function*(){var e;return(null===(e=this.signer.chain)||void 0===e?void 0:e.id)||1}))}}
/**
 * Adapter for ethers Signer (v5 and v6)
 */class A{constructor(e){this.type="ethers",this.signer=e}getAddress(){return T(this,void 0,void 0,(function*(){
// Works for both ethers v5 and v6
if("function"==typeof this.signer.getAddress)return yield this.signer.getAddress();if(this.signer.address)return this.signer.address;throw new Error("Unable to get address from ethers signer")}))}signMessage(e){return T(this,void 0,void 0,(function*(){if("function"!=typeof this.signer.signMessage)throw new Error("Signer does not support signMessage");return yield this.signer.signMessage(e)}))}signTypedData(e,t,n){return T(this,void 0,void 0,(function*(){if("function"==typeof this.signer._signTypedData)return yield this.signer._signTypedData(e,t,n);if("function"!=typeof this.signer.signTypedData)throw new Error("Signer does not support signTypedData or _signTypedData");return yield this.signer.signTypedData(e,t,n)}))}getChainId(){return T(this,void 0,void 0,(function*(){
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
 */class g{constructor(e){this.type="custom",this.signer=e}getAddress(){return T(this,void 0,void 0,(function*(){if("function"==typeof this.signer.getAddress)return yield this.signer.getAddress();if(this.signer.address)return this.signer.address;throw new Error("Custom signer must implement getAddress() or have address property")}))}signMessage(e){return T(this,void 0,void 0,(function*(){if("function"!=typeof this.signer.signMessage)throw new Error("Custom signer must implement signMessage()");return yield this.signer.signMessage(e)}))}signTypedData(e,t,n){return T(this,void 0,void 0,(function*(){if("function"!=typeof this.signer.signTypedData)throw new Error("Custom signer must implement signTypedData()");return yield this.signer.signTypedData(e,t,n)}))}getChainId(){return T(this,void 0,void 0,(function*(){if("function"==typeof this.signer.getChainId){const e=yield this.signer.getChainId();return"bigint"==typeof e?Number(e):e}return void 0!==this.signer.chainId?"bigint"==typeof this.signer.chainId?Number(this.signer.chainId):this.signer.chainId:484;
// Default to mainnet
}))}}
/**
 * Factory function to create appropriate adapter based on signer type
 */function I(e){
// Check for viem WalletClient
return e.transport&&e.chain&&"function"==typeof e.signMessage?new w(e):
// Check for ethers signer (v5 or v6)
e._isSigner||e.provider&&"function"==typeof e.signMessage?new A(e):new g(e)}
/**
 * Browser localStorage adapter
 */class b{getItem(e){return T(this,void 0,void 0,(function*(){return"undefined"==typeof localStorage?null:localStorage.getItem(e)}))}setItem(e,t){return T(this,void 0,void 0,(function*(){"undefined"!=typeof localStorage&&localStorage.setItem(e,t)}))}removeItem(e){return T(this,void 0,void 0,(function*(){"undefined"!=typeof localStorage&&localStorage.removeItem(e)}))}}
/**
 * In-memory storage adapter for Node.js
 */class E{constructor(){this.storage=new Map}getItem(e){return T(this,void 0,void 0,(function*(){return this.storage.get(e)||null}))}setItem(e,t){return T(this,void 0,void 0,(function*(){this.storage.set(e,t)}))}removeItem(e){return T(this,void 0,void 0,(function*(){this.storage.delete(e)}))}clear(){this.storage.clear()}}
/**
 * Create a wallet client for Node.js environment
 * @param account The viem account
 * @param chain The chain to use
 * @param rpcUrl Optional RPC URL (defaults to chain's default RPC)
 * @returns WalletClient
 */function C(n,i,a){return e({account:n,chain:i,transport:t(a)})}const P={id:123420001114,name:"Basecamp",nativeCurrency:{decimals:18,name:"Camp",symbol:"CAMP"},rpcUrls:{default:{http:["https://rpc-campnetwork.xyz","https://rpc.basecamp.t.raas.gelato.cloud"]}},blockExplorers:{default:{name:"Explorer",url:"https://basecamp.cloud.blockscout.com/"}}},k={id:484,name:"Camp Network",nativeCurrency:{decimals:18,name:"Camp",symbol:"CAMP"},rpcUrls:{default:{http:["https://rpc.camp.raas.gelato.cloud/"]}},blockExplorers:{default:{name:"Explorer",url:"https://camp.cloud.blockscout.com/"}}};class _ extends Error{constructor(e,t){super(e),this.name="APIError",this.statusCode=t||500,Error.captureStackTrace(this,this.constructor)}toJSON(){return{error:this.name,message:this.message,statusCode:this.statusCode||500}}}
// @ts-ignore
let S=null,x=null,N=null;const D=e=>{var n;const a=N||P;return x&&(null===(n=x.chain)||void 0===n?void 0:n.id)===a.id||(x=i({chain:a,transport:t()})),x};var M=[{type:"function",name:"UPGRADE_INTERFACE_VERSION",inputs:[],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"approve",inputs:[{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"balanceOf",inputs:[{name:"owner",type:"address",internalType:"address"}],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"dataStatus",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"uint8",internalType:"enum IIpNFT.DataStatus"}],stateMutability:"view"},{type:"function",name:"disputeModule",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"erc6551Account",inputs:[],outputs:[{name:"",type:"address",internalType:"contract IERC6551Account"}],stateMutability:"view"},{type:"function",name:"erc6551Registry",inputs:[],outputs:[{name:"",type:"address",internalType:"contract IERC6551Registry"}],stateMutability:"view"},{type:"function",name:"finalizeDelete",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"getAccount",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"account",type:"address",internalType:"address"}],stateMutability:"nonpayable"},{type:"function",name:"getApproved",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"getTerms",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"tuple",internalType:"struct IIpNFT.LicenseTerms",components:[{name:"price",type:"uint128",internalType:"uint128"},{name:"duration",type:"uint32",internalType:"uint32"},{name:"royaltyBps",type:"uint16",internalType:"uint16"},{name:"paymentToken",type:"address",internalType:"address"}]}],stateMutability:"view"},{type:"function",name:"initialize",inputs:[{name:"name_",type:"string",internalType:"string"},{name:"symbol_",type:"string",internalType:"string"},{name:"maxTermDuration_",type:"uint256",internalType:"uint256"},{name:"signer_",type:"address",internalType:"address"},{name:"wCAMP_",type:"address",internalType:"address"},{name:"minTermDuration_",type:"uint256",internalType:"uint256"},{name:"minPrice_",type:"uint256",internalType:"uint256"},{name:"maxRoyaltyBps_",type:"uint256",internalType:"uint256"},{name:"registry_",type:"address",internalType:"contract IERC6551Registry"},{name:"implementation_",type:"address",internalType:"contract IERC6551Account"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"isApprovedForAll",inputs:[{name:"owner",type:"address",internalType:"address"},{name:"operator",type:"address",internalType:"address"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"markDisputed",inputs:[{name:"_tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"marketPlace",inputs:[],outputs:[{name:"",type:"address",internalType:"contract IMarketplace"}],stateMutability:"view"},{type:"function",name:"maxRoyaltyBps",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"maxTermDuration",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"minPrice",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"minTermDuration",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"mintWithSignature",inputs:[{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"creatorContentHash",type:"bytes32",internalType:"bytes32"},{name:"uri",type:"string",internalType:"string"},{name:"licenseTerms",type:"tuple",internalType:"struct IIpNFT.LicenseTerms",components:[{name:"price",type:"uint128",internalType:"uint128"},{name:"duration",type:"uint32",internalType:"uint32"},{name:"royaltyBps",type:"uint16",internalType:"uint16"},{name:"paymentToken",type:"address",internalType:"address"}]},{name:"deadline",type:"uint256",internalType:"uint256"},{name:"parents",type:"uint256[]",internalType:"uint256[]"},{name:"isIP",type:"bool",internalType:"bool"},{name:"signature",type:"bytes",internalType:"bytes"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"name",inputs:[],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"owner",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"ownerOf",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"pause",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"paused",inputs:[],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"proxiableUUID",inputs:[],outputs:[{name:"",type:"bytes32",internalType:"bytes32"}],stateMutability:"view"},{type:"function",name:"renounceOwnership",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"safeTransferFrom",inputs:[{name:"from",type:"address",internalType:"address"},{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"safeTransferFrom",inputs:[{name:"from",type:"address",internalType:"address"},{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"data",type:"bytes",internalType:"bytes"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"setApprovalForAll",inputs:[{name:"operator",type:"address",internalType:"address"},{name:"approved",type:"bool",internalType:"bool"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"setDisputeModule",inputs:[{name:"_disputeModule",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"setMarketPlace",inputs:[{name:"_marketPlace",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"setSigner",inputs:[{name:"_signer",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"signer",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"supportsInterface",inputs:[{name:"interfaceId",type:"bytes4",internalType:"bytes4"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"symbol",inputs:[],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"tokenInfo",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"tuple",internalType:"struct IIpNFT.TokenInfo",components:[{name:"tokenURI",type:"string",internalType:"string"},{name:"isIP",type:"bool",internalType:"bool"},{name:"contentHash",type:"bytes32",internalType:"bytes32"},{name:"terms",type:"tuple",internalType:"struct IIpNFT.LicenseTerms",components:[{name:"price",type:"uint128",internalType:"uint128"},{name:"duration",type:"uint32",internalType:"uint32"},{name:"royaltyBps",type:"uint16",internalType:"uint16"},{name:"paymentToken",type:"address",internalType:"address"}]},{name:"status",type:"uint8",internalType:"enum IIpNFT.DataStatus"}]}],stateMutability:"view"},{type:"function",name:"tokenURI",inputs:[{name:"_tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"transferFrom",inputs:[{name:"from",type:"address",internalType:"address"},{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"transferOwnership",inputs:[{name:"newOwner",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"unpause",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"updateTerms",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"newTerms",type:"tuple",internalType:"struct IIpNFT.LicenseTerms",components:[{name:"price",type:"uint128",internalType:"uint128"},{name:"duration",type:"uint32",internalType:"uint32"},{name:"royaltyBps",type:"uint16",internalType:"uint16"},{name:"paymentToken",type:"address",internalType:"address"}]}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"upgradeToAndCall",inputs:[{name:"newImplementation",type:"address",internalType:"address"},{name:"data",type:"bytes",internalType:"bytes"}],outputs:[],stateMutability:"payable"},{type:"function",name:"wCAMP",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"event",name:"AccessPurchased",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"buyer",type:"address",indexed:!0,internalType:"address"},{name:"periods",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newExpiry",type:"uint256",indexed:!1,internalType:"uint256"},{name:"amountPaid",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"AgentRegistered",inputs:[{name:"agentId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"ipNftId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"agentAddress",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"Approval",inputs:[{name:"owner",type:"address",indexed:!0,internalType:"address"},{name:"approved",type:"address",indexed:!0,internalType:"address"},{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"}],anonymous:!1},{type:"event",name:"ApprovalForAll",inputs:[{name:"owner",type:"address",indexed:!0,internalType:"address"},{name:"operator",type:"address",indexed:!0,internalType:"address"},{name:"approved",type:"bool",indexed:!1,internalType:"bool"}],anonymous:!1},{type:"event",name:"ChildIpTagged",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"childIp",type:"uint256",indexed:!0,internalType:"uint256"},{name:"parentIp",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"DataDeleted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"DataMinted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"},{name:"contentHash",type:"bytes32",indexed:!1,internalType:"bytes32"},{name:"parents",type:"uint256[]",indexed:!1,internalType:"uint256[]"}],anonymous:!1},{type:"event",name:"DisputeAssertion",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"counterEvidenceHash",type:"bytes32",indexed:!1,internalType:"bytes32"}],anonymous:!1},{type:"event",name:"DisputeCancelled",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"}],anonymous:!1},{type:"event",name:"DisputeJudged",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"judgement",type:"bool",indexed:!1,internalType:"bool"}],anonymous:!1},{type:"event",name:"DisputeModuleUpdated",inputs:[{name:"disputeModule",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"DisputeRaised",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"initiator",type:"address",indexed:!0,internalType:"address"},{name:"targetId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"disputeTag",type:"bytes32",indexed:!1,internalType:"bytes32"}],anonymous:!1},{type:"event",name:"Initialized",inputs:[{name:"version",type:"uint64",indexed:!1,internalType:"uint64"}],anonymous:!1},{type:"event",name:"MarketPlaceUpdated",inputs:[{name:"marketPlace",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"OwnershipTransferred",inputs:[{name:"previousOwner",type:"address",indexed:!0,internalType:"address"},{name:"newOwner",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"Paused",inputs:[{name:"account",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"RoyaltyPaid",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"royaltyAmount",type:"uint256",indexed:!1,internalType:"uint256"},{name:"creator",type:"address",indexed:!1,internalType:"address"},{name:"protocolAmount",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"SignerUpdated",inputs:[{name:"signer",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"StatusUpdated",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"status",type:"uint8",indexed:!1,internalType:"enum IIpNFT.DataStatus"}],anonymous:!1},{type:"event",name:"TermsUpdated",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"newPrice",type:"uint128",indexed:!1,internalType:"uint128"},{name:"newDuration",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newRoyaltyBps",type:"uint16",indexed:!1,internalType:"uint16"},{name:"paymentToken",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"Transfer",inputs:[{name:"from",type:"address",indexed:!0,internalType:"address"},{name:"to",type:"address",indexed:!0,internalType:"address"},{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"}],anonymous:!1},{type:"event",name:"Unpaused",inputs:[{name:"account",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"Upgraded",inputs:[{name:"implementation",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"error",name:"AddressEmptyCode",inputs:[{name:"target",type:"address",internalType:"address"}]},{type:"error",name:"ERC1967InvalidImplementation",inputs:[{name:"implementation",type:"address",internalType:"address"}]},{type:"error",name:"ERC1967NonPayable",inputs:[]},{type:"error",name:"ERC721IncorrectOwner",inputs:[{name:"sender",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"owner",type:"address",internalType:"address"}]},{type:"error",name:"ERC721InsufficientApproval",inputs:[{name:"operator",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"}]},{type:"error",name:"ERC721InvalidApprover",inputs:[{name:"approver",type:"address",internalType:"address"}]},{type:"error",name:"ERC721InvalidOperator",inputs:[{name:"operator",type:"address",internalType:"address"}]},{type:"error",name:"ERC721InvalidOwner",inputs:[{name:"owner",type:"address",internalType:"address"}]},{type:"error",name:"ERC721InvalidReceiver",inputs:[{name:"receiver",type:"address",internalType:"address"}]},{type:"error",name:"ERC721InvalidSender",inputs:[{name:"sender",type:"address",internalType:"address"}]},{type:"error",name:"ERC721NonexistentToken",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}]},{type:"error",name:"EnforcedPause",inputs:[]},{type:"error",name:"ExpectedPause",inputs:[]},{type:"error",name:"FailedCall",inputs:[]},{type:"error",name:"InvalidDeadline",inputs:[]},{type:"error",name:"InvalidDuration",inputs:[]},{type:"error",name:"InvalidInitialization",inputs:[]},{type:"error",name:"InvalidPaymentToken",inputs:[]},{type:"error",name:"InvalidPrice",inputs:[]},{type:"error",name:"InvalidRoyalty",inputs:[]},{type:"error",name:"InvalidSignature",inputs:[]},{type:"error",name:"NotInitializing",inputs:[]},{type:"error",name:"NotTokenOwner",inputs:[]},{type:"error",name:"OwnableInvalidOwner",inputs:[{name:"owner",type:"address",internalType:"address"}]},{type:"error",name:"OwnableUnauthorizedAccount",inputs:[{name:"account",type:"address",internalType:"address"}]},{type:"error",name:"TokenAlreadyExists",inputs:[]},{type:"error",name:"UUPSUnauthorizedCallContext",inputs:[]},{type:"error",name:"UUPSUnsupportedProxiableUUID",inputs:[{name:"slot",type:"bytes32",internalType:"bytes32"}]},{type:"error",name:"Unauthorized",inputs:[]}],R=[{type:"function",name:"MAX_PARENTS",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"UPGRADE_INTERFACE_VERSION",inputs:[],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"buyAccess",inputs:[{name:"buyer",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"expectedPrice",type:"uint256",internalType:"uint256"},{name:"expectedDuration",type:"uint32",internalType:"uint32"},{name:"expectedPaymentToken",type:"address",internalType:"address"}],outputs:[],stateMutability:"payable"},{type:"function",name:"hasParentIp",inputs:[{name:"ipId",type:"uint256",internalType:"uint256"},{name:"parent",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"initialize",inputs:[{name:"dataNFT_",type:"address",internalType:"address"},{name:"protocolFeeBps_",type:"uint16",internalType:"uint16"},{name:"treasury_",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"ipToken",inputs:[],outputs:[{name:"",type:"address",internalType:"contract IIpNFT"}],stateMutability:"view"},{type:"function",name:"owner",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"parentRoyaltyPercent",inputs:[{name:"",type:"uint256",internalType:"uint256"},{name:"",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"uint16",internalType:"uint16"}],stateMutability:"view"},{type:"function",name:"pause",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"paused",inputs:[],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"protocolFeeBps",inputs:[],outputs:[{name:"",type:"uint16",internalType:"uint16"}],stateMutability:"view"},{type:"function",name:"proxiableUUID",inputs:[],outputs:[{name:"",type:"bytes32",internalType:"bytes32"}],stateMutability:"view"},{type:"function",name:"renounceOwnership",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"royaltyStack",inputs:[{name:"",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"uint16",internalType:"uint16"}],stateMutability:"view"},{type:"function",name:"setParentIpsAndRoyaltyPercents",inputs:[{name:"childIpId",type:"uint256",internalType:"uint256"},{name:"parents",type:"uint256[]",internalType:"uint256[]"},{name:"creator",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"subscriptionExpiry",inputs:[{name:"",type:"uint256",internalType:"uint256"},{name:"",type:"address",internalType:"address"}],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"transferOwnership",inputs:[{name:"newOwner",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"treasury",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"unpause",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"updateProtocolFee",inputs:[{name:"newFeeBps",type:"uint16",internalType:"uint16"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"updateTreasury",inputs:[{name:"newTreasury",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"upgradeToAndCall",inputs:[{name:"newImplementation",type:"address",internalType:"address"},{name:"data",type:"bytes",internalType:"bytes"}],outputs:[],stateMutability:"payable"},{type:"event",name:"AccessPurchased",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"buyer",type:"address",indexed:!0,internalType:"address"},{name:"periods",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newExpiry",type:"uint256",indexed:!1,internalType:"uint256"},{name:"amountPaid",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"AgentRegistered",inputs:[{name:"agentId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"ipNftId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"agentAddress",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"ChildIpTagged",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"childIp",type:"uint256",indexed:!0,internalType:"uint256"},{name:"parentIp",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"DataDeleted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"DataMinted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"},{name:"contentHash",type:"bytes32",indexed:!1,internalType:"bytes32"},{name:"parents",type:"uint256[]",indexed:!1,internalType:"uint256[]"}],anonymous:!1},{type:"event",name:"DisputeAssertion",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"counterEvidenceHash",type:"bytes32",indexed:!1,internalType:"bytes32"}],anonymous:!1},{type:"event",name:"DisputeCancelled",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"}],anonymous:!1},{type:"event",name:"DisputeJudged",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"judgement",type:"bool",indexed:!1,internalType:"bool"}],anonymous:!1},{type:"event",name:"DisputeModuleUpdated",inputs:[{name:"disputeModule",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"DisputeRaised",inputs:[{name:"id",type:"uint256",indexed:!0,internalType:"uint256"},{name:"initiator",type:"address",indexed:!0,internalType:"address"},{name:"targetId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"disputeTag",type:"bytes32",indexed:!1,internalType:"bytes32"}],anonymous:!1},{type:"event",name:"Initialized",inputs:[{name:"version",type:"uint64",indexed:!1,internalType:"uint64"}],anonymous:!1},{type:"event",name:"MarketPlaceUpdated",inputs:[{name:"marketPlace",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"OwnershipTransferred",inputs:[{name:"previousOwner",type:"address",indexed:!0,internalType:"address"},{name:"newOwner",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"Paused",inputs:[{name:"account",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"RoyaltyPaid",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"royaltyAmount",type:"uint256",indexed:!1,internalType:"uint256"},{name:"creator",type:"address",indexed:!1,internalType:"address"},{name:"protocolAmount",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"SignerUpdated",inputs:[{name:"signer",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"StatusUpdated",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"status",type:"uint8",indexed:!1,internalType:"enum IIpNFT.DataStatus"}],anonymous:!1},{type:"event",name:"TermsUpdated",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"newPrice",type:"uint128",indexed:!1,internalType:"uint128"},{name:"newDuration",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newRoyaltyBps",type:"uint16",indexed:!1,internalType:"uint16"},{name:"paymentToken",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"Unpaused",inputs:[{name:"account",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"Upgraded",inputs:[{name:"implementation",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"error",name:"AddressEmptyCode",inputs:[{name:"target",type:"address",internalType:"address"}]},{type:"error",name:"ERC1967InvalidImplementation",inputs:[{name:"implementation",type:"address",internalType:"address"}]},{type:"error",name:"ERC1967NonPayable",inputs:[]},{type:"error",name:"EnforcedPause",inputs:[]},{type:"error",name:"ExpectedPause",inputs:[]},{type:"error",name:"FailedCall",inputs:[]},{type:"error",name:"InvalidInitialization",inputs:[]},{type:"error",name:"InvalidParentIp",inputs:[]},{type:"error",name:"InvalidPayment",inputs:[]},{type:"error",name:"InvalidRoyalty",inputs:[]},{type:"error",name:"MaxParentsExceeded",inputs:[]},{type:"error",name:"MaxRoyaltyExceeded",inputs:[]},{type:"error",name:"NoSubscriptionFound",inputs:[]},{type:"error",name:"NotInitializing",inputs:[]},{type:"error",name:"OwnableInvalidOwner",inputs:[{name:"owner",type:"address",internalType:"address"}]},{type:"error",name:"OwnableUnauthorizedAccount",inputs:[{name:"account",type:"address",internalType:"address"}]},{type:"error",name:"ParentAlreadyExists",inputs:[]},{type:"error",name:"ParentIpAlreadyDeleted",inputs:[]},{type:"error",name:"ParentIpAlreadyDisputed",inputs:[]},{type:"error",name:"SubscriptionNotAllowed",inputs:[]},{type:"error",name:"TermsMismatch",inputs:[]},{type:"error",name:"UUPSUnauthorizedCallContext",inputs:[]},{type:"error",name:"UUPSUnsupportedProxiableUUID",inputs:[{name:"slot",type:"bytes32",internalType:"bytes32"}]},{type:"error",name:"Unauthorized",inputs:[]},{type:"error",name:"ZeroAddress",inputs:[]}],B=[{type:"receive",stateMutability:"payable"},{type:"function",name:"execute",inputs:[{name:"to",type:"address",internalType:"address"},{name:"value",type:"uint256",internalType:"uint256"},{name:"data",type:"bytes",internalType:"bytes"},{name:"operation",type:"uint8",internalType:"uint8"}],outputs:[{name:"result",type:"bytes",internalType:"bytes"}],stateMutability:"payable"},{type:"function",name:"isValidSignature",inputs:[{name:"hash",type:"bytes32",internalType:"bytes32"},{name:"signature",type:"bytes",internalType:"bytes"}],outputs:[{name:"magicValue",type:"bytes4",internalType:"bytes4"}],stateMutability:"view"},{type:"function",name:"isValidSigner",inputs:[{name:"signer",type:"address",internalType:"address"},{name:"",type:"bytes",internalType:"bytes"}],outputs:[{name:"",type:"bytes4",internalType:"bytes4"}],stateMutability:"view"},{type:"function",name:"owner",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"state",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"supportsInterface",inputs:[{name:"interfaceId",type:"bytes4",internalType:"bytes4"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"token",inputs:[],outputs:[{name:"",type:"uint256",internalType:"uint256"},{name:"",type:"address",internalType:"address"},{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"}],U=[{inputs:[{internalType:"address",name:"_marketplace",type:"address"},{internalType:"address",name:"_ipNFT",type:"address"}],stateMutability:"nonpayable",type:"constructor"},{inputs:[],name:"EmptyPurchaseList",type:"error"},{inputs:[],name:"InvalidTotalPayment",type:"error"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"string",name:"reason",type:"string"}],name:"PurchaseFailed",type:"error"},{inputs:[],name:"RefundFailed",type:"error"},{inputs:[],name:"ZeroAddress",type:"error"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"buyer",type:"address"},{indexed:!1,internalType:"uint256",name:"count",type:"uint256"},{indexed:!1,internalType:"uint256",name:"totalPaid",type:"uint256"}],name:"BulkPurchaseExecuted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"buyer",type:"address"},{indexed:!1,internalType:"uint256",name:"successCount",type:"uint256"},{indexed:!1,internalType:"uint256",name:"failureCount",type:"uint256"},{indexed:!1,internalType:"uint256[]",name:"failedTokenIds",type:"uint256[]"}],name:"BulkPurchasePartial",type:"event"},{inputs:[{internalType:"address",name:"buyer",type:"address"},{components:[{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint256",name:"expectedPrice",type:"uint256"},{internalType:"uint32",name:"expectedDuration",type:"uint32"},{internalType:"address",name:"expectedPaymentToken",type:"address"}],internalType:"struct IBatchPurchase.BuyParams[]",name:"purchases",type:"tuple[]"}],name:"bulkBuyAccess",outputs:[{internalType:"uint256",name:"totalPaid",type:"uint256"}],stateMutability:"payable",type:"function"},{inputs:[{internalType:"address",name:"buyer",type:"address"},{components:[{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint256",name:"expectedPrice",type:"uint256"},{internalType:"uint32",name:"expectedDuration",type:"uint32"},{internalType:"address",name:"expectedPaymentToken",type:"address"}],internalType:"struct IBatchPurchase.BuyParams[]",name:"purchases",type:"tuple[]"}],name:"bulkBuyAccessTolerant",outputs:[{components:[{internalType:"uint256",name:"successCount",type:"uint256"},{internalType:"uint256",name:"failureCount",type:"uint256"},{internalType:"uint256",name:"totalSpent",type:"uint256"},{internalType:"uint256",name:"refundAmount",type:"uint256"},{internalType:"uint256[]",name:"failedTokenIds",type:"uint256[]"}],internalType:"struct IBatchPurchase.TolerantResult",name:"result",type:"tuple"}],stateMutability:"payable",type:"function"},{inputs:[{internalType:"uint256[]",name:"tokenIds",type:"uint256[]"}],name:"buildPurchaseParams",outputs:[{components:[{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint256",name:"expectedPrice",type:"uint256"},{internalType:"uint32",name:"expectedDuration",type:"uint32"},{internalType:"address",name:"expectedPaymentToken",type:"address"}],internalType:"struct IBatchPurchase.BuyParams[]",name:"purchases",type:"tuple[]"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256[]",name:"tokenIds",type:"uint256[]"}],name:"checkActiveStatus",outputs:[{internalType:"bool[]",name:"activeFlags",type:"bool[]"}],stateMutability:"view",type:"function"},{inputs:[],name:"ipNFT",outputs:[{internalType:"contract IIpNFT",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"marketplace",outputs:[{internalType:"contract IMarketplace",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256[]",name:"tokenIds",type:"uint256[]"}],name:"previewBulkCost",outputs:[{components:[{internalType:"uint256",name:"totalNativeCost",type:"uint256"},{internalType:"uint256",name:"totalERC20Cost",type:"uint256"},{internalType:"uint256",name:"validCount",type:"uint256"},{internalType:"uint256[]",name:"invalidTokenIds",type:"uint256[]"}],internalType:"struct IBatchPurchase.BulkCostPreview",name:"preview",type:"tuple"}],stateMutability:"view",type:"function"}],F="Connect with Camp Network",O=2628e3,H=86400,$=1e15,j=1,L=1e4;const z={DEVELOPMENT:{NAME:"DEVELOPMENT",AUTH_HUB_BASE_API:"https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",AUTH_ENDPOINT:"auth-testnet",ORIGIN_DASHBOARD:"https://origin.campnetwork.xyz",DATANFT_CONTRACT_ADDRESS:"0xB53F5723Dd4E46da32e1769Bd36A5aD880e707A5",MARKETPLACE_CONTRACT_ADDRESS:"0x97b0A18B2888e904940fFd19E480a28aeec3F055",BATCH_PURCHASE_CONTRACT_ADDRESS:"0xaF0cF04DBfeeAcEdC77Dc68A91381AFB967B8518",CHAIN:P,IPNFT_ABI:M,MARKETPLACE_ABI:R,TBA_ABI:B,BATCH_PURCHASE_ABI:U},PRODUCTION:{NAME:"PRODUCTION",AUTH_HUB_BASE_API:"https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",AUTH_ENDPOINT:"auth-mainnet",ORIGIN_DASHBOARD:"https://origin.campnetwork.xyz",DATANFT_CONTRACT_ADDRESS:"0x39EeE1C3989f0dD543Dee60f8582F7F81F522C38",MARKETPLACE_CONTRACT_ADDRESS:"0xc69BAa987757d054455fC0f2d9797684E9FB8b9C",BATCH_PURCHASE_CONTRACT_ADDRESS:"0x31885cD2A445322067dF890bACf6CeFE9b233BCC",CHAIN:k,IPNFT_ABI:M,MARKETPLACE_ABI:R,TBA_ABI:B,BATCH_PURCHASE_ABI:U}};let q=[];const W=()=>q,J=e=>{function t(t){q.some((e=>e.info.uuid===t.detail.info.uuid))||(q=[...q,t.detail],e(q))}if("undefined"!=typeof window)return window.addEventListener("eip6963:announceProvider",t),window.dispatchEvent(new Event("eip6963:requestProvider")),()=>window.removeEventListener("eip6963:announceProvider",t)};
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
function V(e,t,n,i,a,r,s,o,d){return T(this,void 0,void 0,(function*(){return yield this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"mintWithSignature",[e,t,a,r,s,o,n,i,d],{waitForReceipt:!0})}))}
/**
 * Registers a Data NFT with the Origin service in order to obtain a signature for minting.
 * @param source The source of the Data NFT (e.g., "spotify", "twitter", "tiktok", or "file").
 * @param deadline The deadline for the registration operation.
 * @param licenseTerms The terms of the license for the NFT.
 * @param metadata The metadata associated with the NFT.
 * @param fileKey The file key(s) if the source is "file".
 * @param parents The IDs of the parent NFTs, if applicable.
 * @return A promise that resolves with the registration data.
 */function K(e,t,n,i,a,r){return T(this,void 0,void 0,(function*(){const s={source:e,deadline:Number(t),licenseTerms:{price:n.price.toString(),duration:n.duration,royaltyBps:n.royaltyBps,paymentToken:n.paymentToken},metadata:i,parentId:r?r.map((e=>e.toString())):[]};void 0!==a&&(s.fileKey=a);const o=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/register`,{method:"POST",headers:{Authorization:`Bearer ${this.getJwt()}`,"Content-Type":"application/json"},body:JSON.stringify(s)}),d=yield o.json();if(d.isError)throw new Error(`Failed to get signature: ${d.message}`);if(!o.ok)throw new Error(`Failed to get signature: ${o.statusText}`);return d.data}))}
/**
 * Updates the license terms of a specified IPNFT.
 * @param tokenId The ID of the IPNFT to update.
 * @param newTerms The new license terms to set.
 * @returns A promise that resolves when the transaction is complete.
 */function G(e,t){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"updateTerms",[e,t],{waitForReceipt:!0})}
/**
 * Sets the IPNFT as deleted
 * @param tokenId The token ID to set as deleted.
 * @returns A promise that resolves when the transaction is complete.
 */function X(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"finalizeDelete",[e])}
/**
 * Calls the getOrCreateRoyaltyVault method on the IPNFT contract.
 * @param tokenOwner The address of the token owner for whom to get or create the royalty vault.
 * @param simulateOnly If true, simulates the transaction without executing it.
 * @returns The address of the royalty vault associated with the specified token owner.
 */function Z(e){return T(this,arguments,void 0,(function*(e,t=!1){const n=yield this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"getOrCreateRoyaltyVault",[e],{waitForReceipt:!0,simulate:t});return t?n:n.simulatedResult}))}
/**
 * Returns the license terms associated with a specific token ID.
 * @param tokenId The token ID to query.
 * @returns The license terms of the token ID.
 */function Y(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"getTerms",[e])}
/**
 * Returns the owner of the specified IPNFT.
 * @param tokenId The ID of the IPNFT to query.
 * @returns The address of the owner of the IPNFT.
 */function Q(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"ownerOf",[e])}
/**
 * Returns the number of IPNFTs owned by the given address.
 * @param owner The address to query.
 * @returns The number of IPNFTs owned by the address.
 */function ee(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"balanceOf",[e])}
/**
 * Returns the metadata URI associated with a specific token ID.
 * @param tokenId The token ID to query.
 * @returns The metadata URI of the token ID.
 */function te(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"tokenURI",[e])}
/**
 * Returns the data status of the given token ID.
 * @param tokenId The token ID to query.
 * @returns The data status of the token ID.
 */function ne(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"dataStatus",[e])}
/**
 * Checks if an operator is approved to manage all assets of a given owner.
 * @param owner The address of the asset owner.
 * @param operator The address of the operator to check.
 * @return A promise that resolves to a boolean indicating if the operator is approved for all assets of the owner.
 */function ie(e,t){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"isApprovedForAll",[e,t])}function ae(e,t,n){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"transferFrom",[e,t,n])}function re(e,t,n,i){const a=i?[e,t,n,i]:[e,t,n];return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"safeTransferFrom",a)}function se(e,t){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"approve",[e,t])}function oe(e,t){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"setApprovalForAll",[e,t])}
/**
 * Buys access to a data NFT for a specified duration.
 * @param buyer The address of the buyer.
 * @param tokenId The ID of the data NFT.
 * @param expectedPrice The expected price for the access.
 * @param expectedDuration The expected duration of the access in seconds.
 * @param expectedPaymentToken The address of the payment token (use zero address for native token).
 * @param value The amount of native token to send (only required if paying with native token).
 * @returns A promise that resolves when the transaction is confirmed.
 */function de(e,t,n,i,a,r){return this.callContractMethod(this.environment.MARKETPLACE_CONTRACT_ADDRESS,this.environment.MARKETPLACE_ABI,"buyAccess",[e,t,n,i,a],{waitForReceipt:!0,value:r})}
/**
 * Checks if a user has access to a specific token based on subscription expiry.
 * @param user - The address of the user.
 * @param tokenId - The ID of the token.
 * @returns A promise that resolves to a boolean indicating if the user has access.
 */function ue(e,t){return T(this,void 0,void 0,(function*(){try{const n=yield this.subscriptionExpiry(t,e);return n>BigInt(Math.floor(Date.now()/1e3))}catch(e){return!1}}))}function pe(e,t){return this.callContractMethod(this.environment.MARKETPLACE_CONTRACT_ADDRESS,this.environment.MARKETPLACE_ABI,"subscriptionExpiry",[e,t])}
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
 */function le(e,t){return T(this,void 0,void 0,(function*(){if(!e.marketplaceAction)throw new Error("No marketplace action found in X402 response");const{marketplaceAction:n}=e;if("buyAccess"!==n.method)throw new Error(`Unsupported marketplace action method: ${n.method}`);const i=BigInt(n.tokenId),r=n.payer;if(yield this.hasAccess(r,i))return console.log("User already has access to this item"),null;const s=BigInt(n.amount),o=BigInt(n.duration),d=n.asset,u="0x0000000000000000000000000000000000000000"===d,p=u?s:BigInt(0);if(t){const e=I(t),n=this.environment.MARKETPLACE_CONTRACT_ADDRESS,u=this.environment.MARKETPLACE_ABI,l=a({abi:u,functionName:"buyAccess",args:[r,i,s,o,d]});if("viem"===e.type){const t=e.signer,i=yield t.sendTransaction({to:n,data:l,value:p,account:yield e.getAddress()});return{txHash:i,receipt:yield t.waitForTransactionReceipt({hash:i})}}if("ethers"===e.type){const t=e.signer,i=yield t.sendTransaction({to:n,data:l,value:p.toString()}),a=yield i.wait();return{txHash:i.hash,receipt:a}}{const t=e.signer;if("function"!=typeof t.sendTransaction)throw new Error("Custom signer must implement sendTransaction() method");const i=yield t.sendTransaction({to:n,data:l,value:p.toString()});if(i.wait&&"function"==typeof i.wait){const e=yield i.wait();return{txHash:i.hash,receipt:e}}return{txHash:i.hash||i}}}if(!this.viemClient)throw new Error("No signer or wallet client provided for settleX402");return yield this.buyAccess(r,i,s,o,d,u?p:void 0)}))}
/**
 * Enum representing the status of data in the system.
 * * - ACTIVE: The data is currently active and available.
 * * - PENDING_DELETE: The data is scheduled for deletion but not yet removed.
 * * - DELETED: The data has been deleted and is no longer available.
 */var ye;!function(e){e[e.ACTIVE=0]="ACTIVE",e[e.PENDING_DELETE=1]="PENDING_DELETE",e[e.DELETED=2]="DELETED"}(ye||(ye={}));
/**
 * Creates license terms for a digital asset.
 * @param price The price of the asset in wei.
 * @param duration The duration of the license in seconds.
 * @param royaltyBps The royalty percentage in basis points (0-10000).
 * @param paymentToken The address of the payment token (ERC20 / address(0) for native currency).
 * @returns The created license terms.
 */
const ce=(e,t,n,i)=>{if(n<j||n>L)throw new Error(`Royalty basis points must be between ${j} and ${L}`);if(t<H||t>O)throw new Error(`Duration must be between ${H} and ${O} seconds`);if(e<$)throw new Error(`Price must be at least ${$} wei`);return{price:e,duration:t,royaltyBps:n,paymentToken:i}},me={X402Intent:[{name:"payer",type:"address"},{name:"asset",type:"address"},{name:"amount",type:"uint256"},{name:"httpMethod",type:"string"},{name:"payTo",type:"address"},{name:"tokenId",type:"uint256"},{name:"duration",type:"uint32"},{name:"expiresAt",type:"uint256"},{name:"nonce",type:"bytes32"}]},he=(e,t,n)=>T(void 0,void 0,void 0,(function*(){return yield fetch(`${e.environment.AUTH_HUB_BASE_API}/${e.environment.AUTH_ENDPOINT}/origin/data/${t}`,{method:"GET",headers:Object.assign({"Content-Type":"application/json"},n)})}))
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
 */function Te(e,t,n){return T(this,void 0,void 0,(function*(){var i;const a=this.viemClient;if(!t&&!a)throw new Error("No signer or wallet client provided for X402 intent.");const s=yield he(this,e,{});if(402!==s.status){if(!s.ok)throw new Error("Failed to fetch data");return s.json()}const o=a||I(t),d=a?yield we.call(this):yield o.getAddress(),u=yield s.json();if(u.error)throw new Error(u.error);const p=u.accepts[0],l=yield fe.call(this,p,r(d),o),y=btoa(JSON.stringify(l)),c=yield he(this,e,{"X-PAYMENT":y});if(402===c.status){
// subscription required
if(n){const i=yield c.json();if(yield n(i.marketplaceAction)){const n=yield this.settlePaymentIntent(i,t||a);if(n&&!n.txHash)throw new Error(`Failed to settle payment intent for token ID ${e}`);
// retry fetching data after settlement
return yield this.getDataWithIntent(e,t,void 0)}
// user declined to proceed with payment
return{error:"User declined to proceed with payment",data:null}}return c.json()}if(!c.ok)throw new Error("Failed to fetch data after X402 payment");const m=yield c.json();return{error:null,data:null!==(i=m.data)&&void 0!==i?i:m}}))}
/**
 * Build the X402 payment payload.
 * @private
 */function fe(e,t,n){return T(this,void 0,void 0,(function*(){const i="native"===e.asset?s:e.asset,a=BigInt(e.maxAmountRequired||0),u=e.extra.duration,p=ve.call(this),l=me,y=crypto.randomUUID(),c=o(d(y)),m={payer:t,asset:i,amount:a.toString(),httpMethod:"GET",payTo:r(this.environment.MARKETPLACE_CONTRACT_ADDRESS),tokenId:e.extra.tokenId,duration:u,expiresAt:Math.floor(Date.now()/1e3)+e.maxTimeoutSeconds,nonce:c},h=I(n),T=yield h.signTypedData(p,l,m);return{x402Version:1,scheme:"exact",network:e.network,payload:Object.assign(Object.assign({},m),{sigType:"eip712",signature:T,license:{tokenId:e.extra.tokenId,duration:u}})}}))}
/**
 * Create the X402 Intent domain for EIP-712 signing.
 * @private
 */function ve(){return{name:"Origin X402 Intent",version:"1",chainId:this.environment.CHAIN.id,verifyingContract:this.environment.MARKETPLACE_CONTRACT_ADDRESS}}
/**
 * Get the current account address.
 * @private
 */function we(){return T(this,void 0,void 0,(function*(){const e=this.viemClient;if(!e)throw new Error("WalletClient not connected. Please connect a wallet.");
// If account is already set on the client, return it directly
if(e.account)return e.account.address;
// Otherwise request accounts (browser wallet flow)
const t=yield e.request({method:"eth_requestAccounts",params:[]});if(!t||0===t.length)throw new Error("No accounts found in connected wallet.");return t[0]}))}
/**
 * Approves a spender to spend a specified amount of tokens on behalf of the owner.
 * If the current allowance is less than the specified amount, it will perform the approval.
 * @param {ApproveParams} params - The parameters for the approval.
 */function Ae(e){return T(this,arguments,void 0,(function*({walletClient:e,publicClient:t,tokenAddress:n,owner:i,spender:a,amount:r}){(yield t.readContract({address:n,abi:u,functionName:"allowance",args:[i,a]}))<r&&(yield e.writeContract({address:n,account:i,abi:u,functionName:"approve",args:[a,r],chain:P}))}))}
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
 */function ge(e,t,n){return this.callContractMethod(this.environment.BATCH_PURCHASE_CONTRACT_ADDRESS,this.environment.BATCH_PURCHASE_ABI,"bulkBuyAccess",[e,t],{waitForReceipt:!0,value:n})}
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
 */function Ie(e,t,n){return this.callContractMethod(this.environment.BATCH_PURCHASE_CONTRACT_ADDRESS,this.environment.BATCH_PURCHASE_ABI,"bulkBuyAccessTolerant",[e,t],{waitForReceipt:!0,value:n})}
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
 */function be(e){return this.callContractMethod(this.environment.BATCH_PURCHASE_CONTRACT_ADDRESS,this.environment.BATCH_PURCHASE_ABI,"previewBulkCost",[e])}
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
 */function Ee(e){return this.callContractMethod(this.environment.BATCH_PURCHASE_CONTRACT_ADDRESS,this.environment.BATCH_PURCHASE_ABI,"buildPurchaseParams",[e])}
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
 */function Ce(e){return this.callContractMethod(this.environment.BATCH_PURCHASE_CONTRACT_ADDRESS,this.environment.BATCH_PURCHASE_ABI,"checkActiveStatus",[e])}
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
 */function Pe(e,t){return T(this,void 0,void 0,(function*(){if(!e||0===e.length)throw new Error("No token IDs provided for bulk purchase");
// Get the buyer's wallet address
const n=this.viemClient;if(!n)throw new Error("WalletClient not connected. Please connect a wallet.");let i;if(n.account)i=n.account.address;else{const e=yield n.request({method:"eth_requestAccounts",params:[]});if(!e||0===e.length)throw new Error("No accounts found in connected wallet.");i=e[0]}
// Build purchase params from on-chain data
const a=yield this.buildPurchaseParams(e);
// Calculate total native token cost
let r=BigInt(0);const o=[];for(const e of a)if(e.expectedPaymentToken===s)r+=e.expectedPrice;else{
// Group ERC20 purchases by token
const t=o.find((t=>t.token===e.expectedPaymentToken));t?t.amount+=e.expectedPrice:o.push({token:e.expectedPaymentToken,amount:e.expectedPrice})}
// Approve ERC20 tokens if needed
const d=D();for(const e of o)yield Ae({walletClient:n,publicClient:d,tokenAddress:e.token,owner:i,spender:this.environment.BATCH_PURCHASE_CONTRACT_ADDRESS,amount:e.amount});
// Execute the purchase
return(null==t?void 0:t.tolerant)?this.bulkBuyAccessTolerant(i,a,r):this.bulkBuyAccess(i,a,r)}))}var ke,_e,Se,xe,Ne,De,Me,Re,Be,Ue,Fe,Oe,He,$e,je,Le,ze,qe,We,Je;
/**
 * The Origin class
 * Handles interactions with Origin protocol.
 */class Ve{constructor(e,t,n,i){ke.add(this),t?this.jwt=t:console.warn("JWT not provided. Some features may be unavailable."),this.viemClient=n,this.environment="string"==typeof e?z[e]:e||z.DEVELOPMENT,this.baseParentId=i,
// DataNFT methods
this.mintWithSignature=V.bind(this),this.registerIpNFT=K.bind(this),this.updateTerms=G.bind(this),this.finalizeDelete=X.bind(this),this.getOrCreateRoyaltyVault=Z.bind(this),this.getTerms=Y.bind(this),this.ownerOf=Q.bind(this),this.balanceOf=ee.bind(this),this.tokenURI=te.bind(this),this.dataStatus=ne.bind(this),this.isApprovedForAll=ie.bind(this),this.transferFrom=ae.bind(this),this.safeTransferFrom=re.bind(this),this.approve=se.bind(this),this.setApprovalForAll=oe.bind(this),
// Marketplace methods
this.buyAccess=de.bind(this),this.hasAccess=ue.bind(this),this.subscriptionExpiry=pe.bind(this),this.settlePaymentIntent=le.bind(this),this.getDataWithIntent=Te.bind(this),
// Bulk purchase methods
this.bulkBuyAccess=ge.bind(this),this.bulkBuyAccessTolerant=Ie.bind(this),this.bulkBuyAccessSmart=Pe.bind(this),this.previewBulkCost=be.bind(this),this.buildPurchaseParams=Ee.bind(this),this.checkActiveStatus=Ce.bind(this)}getJwt(){return this.jwt}setViemClient(e){this.viemClient=e}
/**
     * Mints a file-based IpNFT.
     * @param file The file to mint.
     * @param metadata The metadata associated with the file.
     * @param license The license terms for the IpNFT.
     * @param parents Optional parent token IDs for lineage tracking.
     * @param options Optional parameters including progress callback, preview image, and use asset as preview flag.
     * @returns The token ID of the minted IpNFT as a string, or null if minting failed.
     */mintFile(e,t,n,i,a){return T(this,void 0,void 0,(function*(){let r,s=null;try{s=yield f(this,ke,"m",Re).call(this)}catch(e){throw new Error("Failed to mint file IP. Wallet not connected.")}try{if(r=yield f(this,ke,"m",Ne).call(this,e,a),!r||!r.key)throw new Error("Failed to upload file or get upload info.")}catch(e){throw new Error(`File upload failed: ${e instanceof Error?e.message:String(e)}`)}e.type&&(t.mimetype=e.type);let o=null;(null==a?void 0:a.previewImage)&&(null==a?void 0:a.previewImage.type.startsWith("image/"))?o=yield f(this,ke,"m",xe).call(this,a.previewImage):(null==a?void 0:a.useAssetAsPreview)&&e.type.startsWith("image/")&&(o=yield f(this,ke,"m",xe).call(this,e)),o&&(t.image=`ipfs://${o}`);const d=BigInt(Date.now()+6e5);// 10 minutes from now
let u;this.baseParentId&&(i||(i=[]),i.unshift(this.baseParentId));try{u=yield this.registerIpNFT("file",d,n,t,r.key,i)}catch(e){throw yield f(this,ke,"m",Se).call(this,r.key,"failed"),new Error(`Failed to register IpNFT: ${e instanceof Error?e.message:String(e)}`)}const{tokenId:p,signerAddress:l,creatorContentHash:y,signature:c,uri:m}=u;if(!(p&&l&&y&&void 0!==c&&m))throw new Error("Failed to register IpNFT: Missing required fields in registration response.");try{const e=yield this.mintWithSignature(s,p,i||[],!0,y,m,n,d,c);if(-1===["0x1","success"].indexOf(e.receipt.status))throw yield f(this,ke,"m",Se).call(this,r.key,"failed"),new Error(`Minting failed with status: ${e.receipt.status}`)}catch(e){throw yield f(this,ke,"m",Se).call(this,r.key,"failed"),new Error(`Minting transaction failed: ${e instanceof Error?e.message:String(e)}`)}return p.toString()}))}
/**
     * Mints a social IpNFT.
     * @param source The social media source (spotify, twitter, tiktok).
     * @param metadata The metadata associated with the social media content.
     * @param license The license terms for the IpNFT.
     * @return The token ID of the minted IpNFT as a string, or null if minting failed.
     */mintSocial(e,t,n){return T(this,void 0,void 0,(function*(){let i=null;try{i=yield f(this,ke,"m",Re).call(this)}catch(e){throw new Error("Failed to mint social IP. Wallet not connected.")}t.mimetype=`social/${e}`;const a=BigInt(Math.floor(Date.now()/1e3)+600);// 10 minutes from now
let r,s=this.baseParentId?[this.baseParentId]:[];try{r=yield this.registerIpNFT(e,a,n,t,void 0,s)}catch(e){throw new Error(`Failed to register Social IpNFT: ${e instanceof Error?e.message:String(e)}`)}const{tokenId:o,signerAddress:d,creatorContentHash:u,signature:p,uri:l}=r;if(!(o&&d&&u&&void 0!==p&&l))throw new Error("Failed to register Social IpNFT: Missing required fields in registration response.");try{const e=yield this.mintWithSignature(i,o,s,!0,u,l,n,a,p);if(-1===["0x1","success"].indexOf(e.receipt.status))throw new Error(`Minting Social IpNFT failed with status: ${e.receipt.status}`)}catch(e){throw new Error(`Minting transaction failed: ${e instanceof Error?e.message:String(e)}`)}return o.toString()}))}
/**
     * Call a contract method.
     * @param {string} contractAddress The contract address.
     * @param {Abi} abi The contract ABI.
     * @param {string} methodName The method name.
     * @param {any[]} params The method parameters.
     * @param {CallOptions} [options] The call options.
     * @returns {Promise<any>} A promise that resolves with the result of the contract call or transaction hash.
     * @throws {Error} - Throws an error if the wallet client is not connected and the method is not a view function.
     */callContractMethod(e,t,n,i){return T(this,arguments,void 0,(function*(e,t,n,i,a={}){var r;let s=null;try{s=yield f(this,ke,"m",Re).call(this)}catch(e){throw new Error("Failed to call contract method. Wallet not connected.")}const o=p({abi:t,name:n});if(o&&"stateMutability"in o&&("view"===o.stateMutability||"pure"===o.stateMutability)){const a=D();return(yield a.readContract({address:e,abi:t,functionName:n,args:i}))||null}yield f(this,ke,"m",Me).call(this,this.environment.CHAIN);const d=D(),{result:u,request:l}=yield d.simulateContract({account:s,address:e,abi:t,functionName:n,args:i,value:a.value});
// simulate
if(a.simulate)return u;try{const e=yield null===(r=this.viemClient)||void 0===r?void 0:r.writeContract(l);if("string"!=typeof e)throw new Error("Transaction failed to send.");if(!a.waitForReceipt)return{txHash:e,simulatedResult:u};return{txHash:e,receipt:yield f(this,ke,"m",De).call(this,e),simulatedResult:u}}catch(e){throw console.error("Transaction failed:",e),new Error("Transaction failed: "+e)}}))}
/**
     * Buy access to an asset by first checking its price via getTerms, then calling buyAccess.
     * @param {bigint} tokenId The token ID of the asset.
     * @returns {Promise<any>} The result of the buyAccess call.
     */buyAccessSmart(e){return T(this,void 0,void 0,(function*(){let t=null;try{t=yield f(this,ke,"m",Re).call(this)}catch(e){throw new Error("Failed to buy access. Wallet not connected.")}const n=yield this.getTerms(e);if(!n)throw new Error("Failed to fetch terms for asset");const{price:i,paymentToken:a,duration:r}=n;if(void 0===i||void 0===a||void 0===r)throw new Error("Terms missing price, paymentToken, or duration");const o=i;return a===s?this.buyAccess(t,e,o,r,a,o):(yield Ae({walletClient:this.viemClient,publicClient:D(),tokenAddress:a,owner:t,spender:this.environment.MARKETPLACE_CONTRACT_ADDRESS,amount:o}),this.buyAccess(t,e,o,r,a))}))}
/**
     * Fetch the underlying data associated with a specific token ID.
     * @param {bigint} tokenId - The token ID to fetch data for.
     * @returns {Promise<any>} A promise that resolves with the fetched data.
     * @throws {Error} Throws an error if the data cannot be fetched.
     */getData(e){return T(this,void 0,void 0,(function*(){const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/data/${e}`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!t.ok)throw new Error("Failed to fetch data");return t.json()}))}
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
     */getTokenBoundAccount(e){return T(this,void 0,void 0,(function*(){try{return yield this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"getAccount",[e],{simulate:!0})}catch(t){throw new Error(`Failed to get Token Bound Account for token ${e}: ${t instanceof Error?t.message:String(t)}`)}}))}
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
     */getRoyalties(e,t){return T(this,void 0,void 0,(function*(){try{const n=yield this.getTokenBoundAccount(e),i=D();let a,r;if(t&&t!==s){
// erc20 (wrapped camp)
const e=[{inputs:[{name:"owner",type:"address"}],name:"balanceOf",outputs:[{name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"decimals",outputs:[{name:"",type:"uint8"}],stateMutability:"view",type:"function"}];a=yield this.callContractMethod(t,e,"balanceOf",[n]);const i=yield this.callContractMethod(t,e,"decimals",[]);r=y(a,i)}else a=yield i.getBalance({address:n}),r=l(a);return{tokenBoundAccount:n,balance:a,balanceFormatted:r}}catch(t){throw new Error(`Failed to retrieve royalties for token ${e}: ${t instanceof Error?t.message:String(t)}`)}}))}
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
     */claimRoyalties(e,t,n){return T(this,void 0,void 0,(function*(){const i=yield f(this,ke,"m",Be).call(this,t),r=yield this.getTokenBoundAccount(e),o=(yield this.getRoyalties(e,n)).balance;if(o===BigInt(0))throw new Error("No royalties available to claim");let d,u,p;
// Call execute on the TBA
return n&&n!==s?(
// ERC20 token transfer
d=n,u=BigInt(0),
// Encode ERC20 transfer call: transfer(address to, uint256 amount)
p=a({abi:[{inputs:[{name:"to",type:"address"},{name:"amount",type:"uint256"}],name:"transfer",outputs:[{name:"",type:"bool"}],stateMutability:"nonpayable",type:"function"}],functionName:"transfer",args:[i,o]})):(
// Native token transfer
d=i,u=o,p="0x"),this.callContractMethod(r,this.environment.TBA_ABI,"execute",[d,u,p,0],// operation: 0 = CALL
{waitForReceipt:!0,value:BigInt(0)})}))}}ke=new WeakSet,_e=function(e){return T(this,void 0,void 0,(function*(){try{const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/upload-url`,{method:"POST",body:JSON.stringify({name:e.name,type:e.type}),headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!t.ok)throw new Error(`HTTP ${t.status}: ${t.statusText}`);const n=yield t.json();if(n.isError)throw new Error(n.message||"Failed to generate upload URL");return n.data}catch(e){throw console.error("Failed to generate upload URL:",e),e}}))},Se=function(e,t){return T(this,void 0,void 0,(function*(){try{const n=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/update-status`,{method:"PATCH",body:JSON.stringify({status:t,fileKey:e}),headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!n.ok){const e=yield n.text().catch((()=>"Unknown error"));throw new Error(`HTTP ${n.status}: ${e}`)}return!0}catch(e){throw console.error("Failed to update origin status:",e),e}}))},xe=function(e){return T(this,void 0,void 0,(function*(){var t;if(!e)return null;try{const n=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/origin/upload-url-ipfs`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${this.jwt}`},body:JSON.stringify({fileName:e.name,fileType:e.type})});if(!n.ok){const e=yield n.text().catch((()=>"Unknown error"));throw new Error(`Failed to get presigned URL (HTTP ${n.status}): ${e}`)}const i=yield n.json(),{isError:a,data:r,message:s}=i;if(a||!r)throw new Error(`Failed to get presigned URL: ${s||"No URL returned from server"}`);const o=new FormData;o.append("file",e);const d=yield fetch(r,{method:"POST",body:o});if(!d.ok){const e=yield d.text().catch((()=>d.statusText));throw new Error(`Failed to upload preview image to IPFS (HTTP ${d.status}): ${e}`)}const u=yield d.json();if(!u||!u.data)throw new Error("Invalid response from IPFS upload: Missing data field");return null===(t=u.data)||void 0===t?void 0:t.cid}catch(e){const t=e instanceof Error?e.message:String(e);throw console.error("Error uploading preview image to IPFS:",t),new Error(`Failed to upload preview image to IPFS: ${t}`)}}))},Ne=function(e,t){return T(this,void 0,void 0,(function*(){let n;try{n=yield f(this,ke,"m",_e).call(this,e)}catch(e){throw console.error("Failed to generate upload URL:",e),new Error(`Failed to generate upload URL: ${e instanceof Error?e.message:String(e)}`)}if(!n)throw new Error("Failed to generate upload URL: No upload info returned");try{yield((e,t,n)=>new Promise(((i,a)=>{h.put(t,e,Object.assign({headers:{"Content-Type":e.type}},"undefined"!=typeof window&&"function"==typeof n?{onUploadProgress:e=>{if(e.total){const t=e.loaded/e.total*100;n(t)}}}:{})).then((e=>{i(e.data)})).catch((e=>{var t;const n=(null===(t=null==e?void 0:e.response)||void 0===t?void 0:t.data)||(null==e?void 0:e.message)||"Upload failed";a(n)}))})))(e,n.url,(null==t?void 0:t.progressCallback)||(()=>{}))}catch(e){try{yield f(this,ke,"m",Se).call(this,n.key,"failed")}catch(e){console.error("Failed to update status to failed:",e)}const t=e instanceof Error?e.message:String(e);throw new Error(`Failed to upload file: ${t}`)}try{yield f(this,ke,"m",Se).call(this,n.key,"success")}catch(e){console.error("Failed to update status to success:",e)}return n}))},De=function(e){return T(this,arguments,void 0,(function*(e,t={}){var n,i,a;const r=D();let s=e;const o=null!==(n=t.confirmations)&&void 0!==n?n:1,d=null!==(i=t.timeoutMs)&&void 0!==i?i:18e4,u=null!==(a=t.pollingIntervalMs)&&void 0!==a?a:1500;try{return yield r.waitForTransactionReceipt({hash:s,confirmations:o,timeout:d,pollingInterval:u,onReplaced:e=>{s=e.transaction.hash}})}catch(e){
// fallback
const t=Date.now();for(;Date.now()-t<d;){try{const e=yield r.getTransactionReceipt({hash:s});if(e&&e.blockNumber)return e}catch(e){}yield new Promise((e=>setTimeout(e,u)))}throw e}}))},Me=function(e){return T(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected. Could not ensure chain ID.");let t=yield this.viemClient.request({method:"eth_chainId",params:[]});if("string"==typeof t&&(t=parseInt(t,16)),t!==e.id){(e=>{N=e,x=null})// reset public client to be recreated with new chain
(e);try{yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16)}]})}catch(t){
// Unrecognized chain
if(4902!==t.code)throw t;yield this.viemClient.request({method:"wallet_addEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16),chainName:e.name,rpcUrls:e.rpcUrls.default.http,nativeCurrency:e.nativeCurrency}]}),yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16)}]})}}}))},Re=function(){return T(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected. Please connect a wallet.");
// If account is already set on the client, return it directly
if(this.viemClient.account)return this.viemClient.account.address;
// Otherwise request accounts (browser wallet flow)
const e=yield this.viemClient.request({method:"eth_requestAccounts",params:[]});if(!e||0===e.length)throw new Error("No accounts found in connected wallet.");return e[0]}))},Be=function(e){return T(this,void 0,void 0,(function*(){if(e)return e;if(!this.viemClient)throw new Error("No wallet address provided and no wallet client connected. Please provide an owner address or connect a wallet.");try{const e=yield this.viemClient.request({method:"eth_requestAccounts",params:[]});if(!e||0===e.length)throw new Error("No accounts found in connected wallet.");return e[0]}catch(e){throw new Error(`Failed to get wallet address: ${e instanceof Error?e.message:String(e)}`)}}))};
/**
 * The Auth class.
 * @class
 * @classdesc The Auth class is used to authenticate the user.
 */
class Ke{
/**
     * Constructor for the Auth class.
     * @param {object} options The options object.
     * @param {string} options.clientId The client ID.
     * @param {string|object} options.redirectUri The redirect URI used for oauth. Leave empty if you want to use the current URL. If you want different redirect URIs for different socials, pass an object with the socials as keys and the redirect URIs as values.
     * @param {("DEVELOPMENT"|"PRODUCTION")} [options.environment="DEVELOPMENT"] The environment to use.
     * @param {StorageAdapter} [options.storage] Custom storage adapter. Defaults to localStorage in browser, memory storage in Node.js.
     * @throws {APIError} - Throws an error if the clientId is not provided.
     */
constructor({clientId:e,redirectUri:t,environment:n="DEVELOPMENT",baseParentId:i,storage:a}){if(Ue.add(this),Fe.set(this,void 0),Oe.set(this,void 0),He.set(this,void 0),$e.set(this,void 0),!e)throw new Error("clientId is required");if(-1===["PRODUCTION","DEVELOPMENT"].indexOf(n))throw new Error("Invalid environment, must be DEVELOPMENT or PRODUCTION");v(this,Oe,"undefined"==typeof window,"f"),v(this,$e,a||(f(this,Oe,"f")?new E:new b),"f"),this.viem=null,this.environment=z[n],this.baseParentId=i,this.redirectUri=(e=>{const t=["twitter","spotify"];return"object"==typeof e?t.reduce(((t,n)=>(t[n]=e[n]||("undefined"!=typeof window?window.location.href:""),t)),{}):"string"==typeof e?t.reduce(((t,n)=>(t[n]=e,t)),{}):e?{}:t.reduce(((e,t)=>(e[t]="undefined"!=typeof window?window.location.href:"",e)),{})})(t),this.clientId=e,this.isAuthenticated=!1,this.jwt=null,this.origin=null,this.walletAddress=null,this.userId=null,v(this,Fe,{},"f"),
// only subscribe to providers in browser environment
f(this,Oe,"f")||J((e=>{f(this,Ue,"m",je).call(this,"providers",e)})),f(this,Ue,"m",Le).call(this)}
/**
     * Subscribe to an event. Possible events are "state", "provider", "providers", and "viem".
     * @param {("state"|"provider"|"providers"|"viem")} event The event.
     * @param {function} callback The callback function.
     * @returns {void}
     * @example
     * auth.on("state", (state) => {
     *  console.log(state);
     * });
     */on(e,t){f(this,Fe,"f")[e]||(f(this,Fe,"f")[e]=[]),f(this,Fe,"f")[e].push(t),"providers"===e&&t(W())}
/**
     * Unsubscribe from an event. Possible events are "state", "provider", "providers", and "viem".
     * @param {("state"|"provider"|"providers"|"viem")} event The event.
     * @param {function} callback The callback function.
     * @returns {void}
     */off(e,t){f(this,Fe,"f")[e]&&(f(this,Fe,"f")[e]=f(this,Fe,"f")[e].filter((e=>e!==t)))}
/**
     * Set the loading state.
     * @param {boolean} loading The loading state.
     * @returns {void}
     */setLoading(e){f(this,Ue,"m",je).call(this,"state",e?"loading":this.isAuthenticated?"authenticated":"unauthenticated")}
/**
     * Set the provider. This is useful for setting the provider when the user selects a provider from the UI or when dApp wishes to use a specific provider.
     * @param {object} options The options object. Includes the provider and the provider info.
     * @returns {void}
     * @throws {APIError} - Throws an error if the provider is not provided.
     */setProvider({provider:t,info:i,address:a}){if(!t)throw new _("provider is required");this.viem=((t,i="window.ethereum",a,r)=>{var s,o;if(!t&&!S)return console.warn("Provider is required to create a client."),null;const d=a||P;if(!S||S.transport.name!==i&&t||r!==(null===(s=S.account)||void 0===s?void 0:s.address)&&t||(null==N?void 0:N.id)!==d.id){const a={chain:d,transport:n(t,{name:i})};r&&(a.account=c(r)),S=e(a),N=d,x&&(null===(o=x.chain)||void 0===o?void 0:o.id)!==d.id&&(x=null)}return S})(t,i.name,this.environment.CHAIN,a),this.origin&&this.origin.setViemClient(this.viem),
// TODO: only use one of these
f(this,Ue,"m",je).call(this,"viem",this.viem),f(this,Ue,"m",je).call(this,"provider",{provider:t,info:i}),f(this,$e,"f").setItem("camp-sdk:provider",JSON.stringify(i))}
/**
     * Set the wallet address. This is useful for edge cases where the provider can't return the wallet address. Don't use this unless you know what you're doing.
     * @param {string} walletAddress The wallet address.
     * @returns {void}
     */setWalletAddress(e){this.walletAddress=e}
/**
     * Recover the provider from local storage.
     * @returns {Promise<void>}
     */recoverProvider(){return T(this,void 0,void 0,(function*(){var e,t,n,i,a,r,s,o,d,u,p,l,y;if(!this.walletAddress)return void console.warn("No wallet address found in local storage. Please connect your wallet again.");const c=yield f(this,$e,"f").getItem("camp-sdk:provider");if(!c)return;const m=JSON.parse(c);let h;const T=null!==(e=W())&&void 0!==e?e:[];
// first pass: try to find provider by UUID/name and check if it has the right address
// without prompting (using eth_accounts)
for(const e of T)try{if(m.uuid&&(null===(t=e.info)||void 0===t?void 0:t.uuid)===m.uuid||m.name&&(null===(n=e.info)||void 0===n?void 0:n.name)===m.name){
// silently check if the wallet address matches first
const t=yield e.provider.request({method:"eth_accounts"});if(t.length>0&&(null===(i=t[0])||void 0===i?void 0:i.toLowerCase())===(null===(a=this.walletAddress)||void 0===a?void 0:a.toLowerCase())){h=e;break}}}catch(e){console.warn("Failed to fetch accounts from provider:",e)}
// second pass: if no provider found by UUID/name match, try to find by address only
// but still avoid prompting
if(!h)for(const e of T)try{
// skip providers we already checked in the first pass
if(m.uuid&&(null===(r=e.info)||void 0===r?void 0:r.uuid)===m.uuid||m.name&&(null===(s=e.info)||void 0===s?void 0:s.name)===m.name)continue;const t=yield e.provider.request({method:"eth_accounts"});if(t.length>0&&(null===(o=t[0])||void 0===o?void 0:o.toLowerCase())===(null===(d=this.walletAddress)||void 0===d?void 0:d.toLowerCase())){h=e;break}}catch(e){console.warn("Failed to fetch accounts from provider:",e)}
// third pass: if still no provider found and we have UUID/name info,
// try prompting the user (only for the stored provider)
if(!h&&(m.uuid||m.name))for(const e of T)try{if(m.uuid&&(null===(u=e.info)||void 0===u?void 0:u.uuid)===m.uuid||m.name&&(null===(p=e.info)||void 0===p?void 0:p.name)===m.name){const t=yield e.provider.request({method:"eth_requestAccounts"});if(t.length>0&&(null===(l=t[0])||void 0===l?void 0:l.toLowerCase())===(null===(y=this.walletAddress)||void 0===y?void 0:y.toLowerCase())){h=e;break}}}catch(e){console.warn("Failed to reconnect to stored provider:",e)}h?this.setProvider({provider:h.provider,info:h.info||{name:"Unknown"},address:this.walletAddress}):console.warn("No matching provider found for the stored wallet address. Please connect your wallet again.")}))}
/**
     * Disconnect the user.
     * @returns {Promise<void>}
     */disconnect(){return T(this,void 0,void 0,(function*(){this.isAuthenticated&&(f(this,Ue,"m",je).call(this,"state","unauthenticated"),this.isAuthenticated=!1,this.walletAddress=null,this.userId=null,this.jwt=null,this.origin=null,v(this,He,void 0,"f"),yield f(this,$e,"f").removeItem("camp-sdk:wallet-address"),yield f(this,$e,"f").removeItem("camp-sdk:user-id"),yield f(this,$e,"f").removeItem("camp-sdk:jwt"),yield f(this,$e,"f").removeItem("camp-sdk:environment"))}))}
/**
     * Connect the user's wallet and sign the message.
     * @returns {Promise<{ success: boolean; message: string; walletAddress: string }>} A promise that resolves with the authentication result.
     * @throws {APIError} - Throws an error if the user cannot be authenticated.
     */connect(){return T(this,void 0,void 0,(function*(){f(this,Ue,"m",je).call(this,"state","loading");try{this.walletAddress||(yield f(this,Ue,"m",ze).call(this)),this.walletAddress=r(this.walletAddress);const e=yield f(this,Ue,"m",qe).call(this),t=f(this,Ue,"m",Je).call(this,e),n=yield this.viem.signMessage({account:this.walletAddress,message:t}),i=yield f(this,Ue,"m",We).call(this,t,n);if(i.success)return this.isAuthenticated=!0,this.userId=i.userId,this.jwt=i.token,this.origin=new Ve(this.environment,this.jwt,this.viem,this.baseParentId),yield f(this,$e,"f").setItem("camp-sdk:jwt",this.jwt),yield f(this,$e,"f").setItem("camp-sdk:wallet-address",this.walletAddress),yield f(this,$e,"f").setItem("camp-sdk:user-id",this.userId),yield f(this,$e,"f").setItem("camp-sdk:environment",this.environment.NAME),f(this,Ue,"m",je).call(this,"state","authenticated"),{success:!0,message:"Successfully authenticated",walletAddress:this.walletAddress};throw this.isAuthenticated=!1,f(this,Ue,"m",je).call(this,"state","unauthenticated"),new _("Failed to authenticate")}catch(e){throw this.isAuthenticated=!1,f(this,Ue,"m",je).call(this,"state","unauthenticated"),new _(e)}}))}
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
     */connectWithSigner(e,t){return T(this,void 0,void 0,(function*(){f(this,Ue,"m",je).call(this,"state","loading");try{v(this,He,I(e),"f"),this.walletAddress=r(yield f(this,He,"f").getAddress()),
// store the signer as viem client if it's a viem client, otherwise keep adapter
"viem"===f(this,He,"f").type&&(this.viem=e);const n=yield f(this,Ue,"m",qe).call(this),i=f(this,Ue,"m",Je).call(this,n,null==t?void 0:t.domain,null==t?void 0:t.uri),a=yield f(this,He,"f").signMessage(i),s=yield f(this,Ue,"m",We).call(this,i,a);if(s.success)return this.isAuthenticated=!0,this.userId=s.userId,this.jwt=s.token,this.origin=new Ve(this.environment,this.jwt,this.viem,this.baseParentId),yield f(this,$e,"f").setItem("camp-sdk:jwt",this.jwt),yield f(this,$e,"f").setItem("camp-sdk:wallet-address",this.walletAddress),yield f(this,$e,"f").setItem("camp-sdk:user-id",this.userId),yield f(this,$e,"f").setItem("camp-sdk:environment",this.environment.NAME),f(this,Ue,"m",je).call(this,"state","authenticated"),{success:!0,message:"Successfully authenticated",walletAddress:this.walletAddress};throw this.isAuthenticated=!1,f(this,Ue,"m",je).call(this,"state","unauthenticated"),new _("Failed to authenticate")}catch(e){throw this.isAuthenticated=!1,v(this,He,void 0,"f"),f(this,Ue,"m",je).call(this,"state","unauthenticated"),new _(e)}}))}
/**
     * Get the user's linked social accounts.
     * @returns {Promise<Record<string, boolean>>} A promise that resolves with the user's linked social accounts.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated or if the request fails.
     * @example
     * const auth = new Auth({ clientId: "your-client-id" });
     * const socials = await auth.getLinkedSocials();
     * console.log(socials);
     */getLinkedSocials(){return T(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/client-user/connections-sdk`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"}}).then((e=>e.json()));if(e.isError)throw new _(e.message||"Failed to fetch connections");{const t={};return Object.keys(e.data.data).forEach((n=>{t[n.split("User")[0]]=e.data.data[n]})),t}}))}
/**
     * Link the user's Twitter account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated or in Node.js environment.
     */linkTwitter(){return T(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(f(this,Oe,"f"))throw new Error("Social linking requires browser environment for OAuth flow");window.location.href=`${this.environment.AUTH_HUB_BASE_API}/twitter/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.twitter}`}))}
/**
     * Link the user's Discord account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated or in Node.js environment.
     */linkDiscord(){return T(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(f(this,Oe,"f"))throw new Error("Social linking requires browser environment for OAuth flow");window.location.href=`${this.environment.AUTH_HUB_BASE_API}/discord/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.discord}`}))}
/**
     * Link the user's Spotify account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated or in Node.js environment.
     */linkSpotify(){return T(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(f(this,Oe,"f"))throw new Error("Social linking requires browser environment for OAuth flow");window.location.href=`${this.environment.AUTH_HUB_BASE_API}/spotify/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.spotify}`}))}
/**
     * Link the user's TikTok account.
     * @param {string} handle The user's TikTok handle.
     * @returns {Promise<any>} A promise that resolves with the TikTok account data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */linkTikTok(e){return T(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/tiktok/connect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userHandle:e,clientId:this.clientId,userId:this.userId})}).then((e=>e.json()));if(t.isError)throw"Request failed with status code 502"===t.message?new _("TikTok service is currently unavailable, try again later"):new _(t.message||"Failed to link TikTok account");return t.data}))}
/**
     * Send an OTP to the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @returns {Promise<any>} A promise that resolves with the OTP data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */sendTelegramOTP(e){return T(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!e)throw new _("Phone number is required");yield this.unlinkTelegram();const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/telegram/sendOTP-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:e})}).then((e=>e.json()));if(t.isError)throw new _(t.message||"Failed to send Telegram OTP");return t.data}))}
/**
     * Link the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @param {string} otp The OTP.
     * @param {string} phoneCodeHash The phone code hash.
     * @returns {Promise<object>} A promise that resolves with the Telegram account data.
     * @throws {APIError|Error} - Throws an error if the user is not authenticated. Also throws an error if the phone number, OTP, and phone code hash are not provided.
     */linkTelegram(e,t,n){return T(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!e||!t||!n)throw new _("Phone number, OTP, and phone code hash are required");const i=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/telegram/signIn-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:e,code:t,phone_code_hash:n,userId:this.userId,clientId:this.clientId})}).then((e=>e.json()));if(i.isError)throw new _(i.message||"Failed to link Telegram account");return i.data}))}
/**
     * Unlink the user's Twitter account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTwitter(){return T(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/twitter/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new _(e.message||"Failed to unlink Twitter account");return e.data}))}
/**
     * Unlink the user's Discord account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkDiscord(){return T(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new _("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/discord/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new _(e.message||"Failed to unlink Discord account");return e.data}))}
/**
     * Unlink the user's Spotify account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkSpotify(){return T(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new _("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/spotify/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new _(e.message||"Failed to unlink Spotify account");return e.data}))}
/**
     * Unlink the user's TikTok account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTikTok(){return T(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new _("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/tiktok/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((e=>e.json()));if(e.isError)throw new _(e.message||"Failed to unlink TikTok account");return e.data}))}
/**
     * Unlink the user's Telegram account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTelegram(){return T(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new _("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/telegram/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((e=>e.json()));if(e.isError)throw new _(e.message||"Failed to unlink Telegram account");return e.data}))}}Fe=new WeakMap,Oe=new WeakMap,He=new WeakMap,$e=new WeakMap,Ue=new WeakSet,je=function(e,t){f(this,Fe,"f")[e]&&f(this,Fe,"f")[e].forEach((e=>e(t)))},Le=function(e){return T(this,void 0,void 0,(function*(){const t=yield f(this,$e,"f").getItem("camp-sdk:wallet-address"),n=yield f(this,$e,"f").getItem("camp-sdk:user-id"),i=yield f(this,$e,"f").getItem("camp-sdk:jwt"),a=yield f(this,$e,"f").getItem("camp-sdk:environment");t&&n&&i&&(a===this.environment.NAME||!a)?(this.walletAddress=t,this.userId=n,this.jwt=i,this.origin=new Ve(this.environment,this.jwt,this.viem,this.baseParentId),this.isAuthenticated=!0,e?this.setProvider({provider:e.provider,info:e.info||{name:"Unknown"},address:t}):f(this,Oe,"f")||(console.warn("No matching provider was given for the stored wallet address. Trying to recover provider."),yield this.recoverProvider())):this.isAuthenticated=!1}))},ze=function(){return T(this,void 0,void 0,(function*(){try{const[e]=yield this.viem.requestAddresses();return this.walletAddress=r(e),this.walletAddress}catch(e){throw new _(e)}}))},qe=function(){return T(this,void 0,void 0,(function*(){try{const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/client-user/nonce`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({walletAddress:this.walletAddress})}),t=yield e.json();return 200!==e.status?Promise.reject(t.message||"Failed to fetch nonce"):t.data}catch(e){throw new Error(e)}}))},We=function(e,t){return T(this,void 0,void 0,(function*(){try{const n=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/client-user/verify`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({message:e,signature:t,walletAddress:this.walletAddress})}),i=yield n.json(),a=i.data.split(".")[1],r=JSON.parse(atob(a));return{success:!i.isError,userId:r.id,token:i.data}}catch(e){throw new _(e)}}))},Je=function(e,t,n){return m({domain:t||(f(this,Oe,"f")?"localhost":window.location.host),address:this.walletAddress,statement:F,uri:n||(f(this,Oe,"f")?"http://localhost":window.location.origin),version:"1",chainId:this.environment.CHAIN.id,nonce:e})};export{Ke as Auth,b as BrowserStorage,g as CustomSignerAdapter,ye as DataStatus,A as EthersSignerAdapter,E as MemoryStorage,Ve as Origin,w as ViemSignerAdapter,k as campMainnet,P as campTestnet,ce as createLicenseTerms,C as createNodeWalletClient,I as createSignerAdapter};
