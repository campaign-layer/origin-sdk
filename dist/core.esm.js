import e from"axios";import{custom as t,createWalletClient as n,createPublicClient as i,http as a,erc20Abi as r,getAbiItem as s,encodeFunctionData as o,zeroAddress as d,checksumAddress as u}from"viem";import{toAccount as p}from"viem/accounts";import{createSiweMessage as l}from"viem/siwe";
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
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */function y(e,t,n,i){return new(n||(n=Promise))((function(a,r){function s(e){try{d(i.next(e))}catch(e){r(e)}}function o(e){try{d(i.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?a(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,o)}d((i=i.apply(e,t||[])).next())}))}function c(e,t,n,i){if("a"===n&&!i)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!i:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===n?i:"a"===n?i.call(e):i?i.value:t.get(e)}function h(e,t,n,i,a){if("m"===i)throw new TypeError("Private method is not writable");if("a"===i&&!a)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!a:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===i?a.call(e,n):a?a.value=n:t.set(e,n),n}"function"==typeof SuppressedError&&SuppressedError;class m extends Error{constructor(e,t){super(e),this.name="APIError",this.statusCode=t||500,Error.captureStackTrace(this,this.constructor)}toJSON(){return{error:this.name,message:this.message,statusCode:this.statusCode||500}}}
/**
 * Makes a GET request to the given URL with the provided headers.
 *
 * @param {string} url - The URL to send the GET request to.
 * @param {object} headers - The headers to include in the request.
 * @returns {Promise<object>} - The response data.
 * @throws {APIError} - Throws an error if the request fails.
 */function T(t){return y(this,arguments,void 0,(function*(t,n={}){try{return(yield e.get(t,{headers:n})).data}catch(e){if(e.response)throw new m(e.response.data.message||"API request failed",e.response.status);throw new m("Network error or server is unavailable",500)}}))}
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
function f(e,t={}){const n=function(e={}){return Object.keys(e).map((t=>`${encodeURIComponent(t)}=${encodeURIComponent(e[t])}`)).join("&")}(t);return n?`${e}?${n}`:e}const v="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/twitter",w="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/spotify";
/**
 * The TwitterAPI class.
 * @class
 * @classdesc The TwitterAPI class is used to interact with the Twitter API.
 */
class A{
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
     */fetchUserByUsername(e){return y(this,void 0,void 0,(function*(){const t=f(`${v}/user`,{twitterUserName:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetsByUsername(e){return y(this,arguments,void 0,(function*(e,t=1,n=10){const i=f(`${v}/tweets`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch followers by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The followers.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowersByUsername(e){return y(this,arguments,void 0,(function*(e,t=1,n=10){const i=f(`${v}/followers`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch following by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The following.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowingByUsername(e){return y(this,arguments,void 0,(function*(e,t=1,n=10){const i=f(`${v}/following`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch tweet by tweet ID.
     * @param {string} tweetId - The tweet ID.
     * @returns {Promise<object>} - The tweet.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetById(e){return y(this,void 0,void 0,(function*(){const t=f(`${v}/getTweetById`,{tweetId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch user by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The user data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(e){return y(this,arguments,void 0,(function*(e,t=1,n=10){const i=f(`${v}/wallet-twitter-data`,{walletAddress:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch reposted tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The reposted tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepostedByUsername(e){return y(this,arguments,void 0,(function*(e,t=1,n=10){const i=f(`${v}/reposted`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch replies by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The replies.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepliesByUsername(e){return y(this,arguments,void 0,(function*(e,t=1,n=10){const i=f(`${v}/replies`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch likes by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The likes.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchLikesByUsername(e){return y(this,arguments,void 0,(function*(e,t=1,n=10){const i=f(`${v}/event/likes/${e}`,{page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch follows by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The follows.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowsByUsername(e){return y(this,arguments,void 0,(function*(e,t=1,n=10){const i=f(`${v}/event/follows/${e}`,{page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch viewed tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The viewed tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchViewedTweetsByUsername(e){return y(this,arguments,void 0,(function*(e,t=1,n=10){const i=f(`${v}/event/viewed-tweets/${e}`,{page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(e){return y(this,void 0,void 0,(function*(){if(!this.apiKey)throw new m("API key is required for fetching data",401);try{return yield T(e,{"x-api-key":this.apiKey})}catch(e){throw new m(e.message,e.statusCode)}}))}}
/**
 * The SpotifyAPI class.
 * @class
 */class I{
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
     */fetchSavedTracksById(e){return y(this,void 0,void 0,(function*(){const t=f(`${w}/save-tracks`,{spotifyId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the played tracks of a user by Spotify ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The played tracks.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchPlayedTracksById(e){return y(this,void 0,void 0,(function*(){const t=f(`${w}/played-tracks`,{spotifyId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the user's saved albums by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved albums.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedAlbumsById(e){return y(this,void 0,void 0,(function*(){const t=f(`${w}/saved-albums`,{spotifyId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the user's saved playlists by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved playlists.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedPlaylistsById(e){return y(this,void 0,void 0,(function*(){const t=f(`${w}/saved-playlists`,{spotifyId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the tracks of an album by album ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} albumId - The album ID.
     * @returns {Promise<object>} - The tracks in the album.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInAlbum(e,t){return y(this,void 0,void 0,(function*(){const n=f(`${w}/album/tracks`,{spotifyId:e,albumId:t});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch the tracks in a playlist by playlist ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} playlistId - The playlist ID.
     * @returns {Promise<object>} - The tracks in the playlist.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInPlaylist(e,t){return y(this,void 0,void 0,(function*(){const n=f(`${w}/playlist/tracks`,{spotifyId:e,playlistId:t});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch the user's Spotify data by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @returns {Promise<object>} - The user's Spotify data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(e){return y(this,void 0,void 0,(function*(){const t=f(`${w}/wallet-spotify-data`,{walletAddress:e});return this._fetchDataWithAuth(t)}))}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(e){return y(this,void 0,void 0,(function*(){if(!this.apiKey)throw new m("API key is required for fetching data",401);try{return yield T(e,{"x-api-key":this.apiKey})}catch(e){throw new m(e.message,e.statusCode)}}))}}const g={id:123420001114,name:"Basecamp",nativeCurrency:{decimals:18,name:"Camp",symbol:"CAMP"},rpcUrls:{default:{http:["https://rpc-campnetwork.xyz","https://rpc.basecamp.t.raas.gelato.cloud"]}},blockExplorers:{default:{name:"Explorer",url:"https://basecamp.cloud.blockscout.com/"}}};
// @ts-ignore
let b=null,E=null;const _=()=>(E||(E=i({chain:g,transport:a()})),E);var C="Connect with Camp Network",S={USER_CONNECTED:"ed42542d-b676-4112-b6d9-6db98048b2e0",USER_DISCONNECTED:"20af31ac-e602-442e-9e0e-b589f4dd4016",TWITTER_LINKED:"7fbea086-90ef-4679-ba69-f47f9255b34c",DISCORD_LINKED:"d73f5ae3-a8e8-48f2-8532-85e0c7780d6a",SPOTIFY_LINKED:"fc1788b4-c984-42c8-96f4-c87f6bb0b8f7",TIKTOK_LINKED:"4a2ffdd3-f0e9-4784-8b49-ff76ec1c0a6a",TELEGRAM_LINKED:"9006bc5d-bcc9-4d01-a860-4f1a201e8e47"};const k={DEVELOPMENT:{NAME:"DEVELOPMENT",AUTH_HUB_BASE_API:"https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",AUTH_ENDPOINT:"auth",ORIGIN_DASHBOARD:"https://origin.campnetwork.xyz",DATANFT_CONTRACT_ADDRESS:"0xF90733b9eCDa3b49C250B2C3E3E42c96fC93324E",MARKETPLACE_CONTRACT_ADDRESS:"0x5c5e6b458b2e3924E7688b8Dee1Bb49088F6Fef5",CHAIN:g},PRODUCTION:{NAME:"PRODUCTION",AUTH_HUB_BASE_API:"https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",AUTH_ENDPOINT:"auth-mainnet",ORIGIN_DASHBOARD:"https://origin.campnetwork.xyz",DATANFT_CONTRACT_ADDRESS:"0x36207dC084076C2C77f3dA645cC7A85E96cB1237",MARKETPLACE_CONTRACT_ADDRESS:"0xcCc91BD4FfE8FB74D13Abd4b56d5238902776B30",CHAIN:{id:484,name:"Camp Network",nativeCurrency:{decimals:18,name:"Camp",symbol:"CAMP"},rpcUrls:{default:{http:["https://rpc.camp.raas.gelato.cloud/"]}},blockExplorers:{default:{name:"Explorer",url:"https://camp.cloud.blockscout.com/"}}},IPNFT_ABI:[{inputs:[{internalType:"string",name:"name_",type:"string"},{internalType:"string",name:"symbol_",type:"string"},{internalType:"uint256",name:"maxTermDuration_",type:"uint256"},{internalType:"address",name:"signer_",type:"address"},{internalType:"address",name:"wCAMP_",type:"address"},{internalType:"uint256",name:"minTermDuration_",type:"uint256"},{internalType:"uint256",name:"minPrice_",type:"uint256"},{internalType:"uint256",name:"maxRoyaltyBps_",type:"uint256"}],stateMutability:"nonpayable",type:"constructor"},{inputs:[{internalType:"address",name:"sender",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"address",name:"owner",type:"address"}],name:"ERC721IncorrectOwner",type:"error"},{inputs:[{internalType:"address",name:"operator",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"ERC721InsufficientApproval",type:"error"},{inputs:[{internalType:"address",name:"approver",type:"address"}],name:"ERC721InvalidApprover",type:"error"},{inputs:[{internalType:"address",name:"operator",type:"address"}],name:"ERC721InvalidOperator",type:"error"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"ERC721InvalidOwner",type:"error"},{inputs:[{internalType:"address",name:"receiver",type:"address"}],name:"ERC721InvalidReceiver",type:"error"},{inputs:[{internalType:"address",name:"sender",type:"address"}],name:"ERC721InvalidSender",type:"error"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"ERC721NonexistentToken",type:"error"},{inputs:[],name:"EnforcedPause",type:"error"},{inputs:[],name:"ExpectedPause",type:"error"},{inputs:[],name:"InvalidDeadline",type:"error"},{inputs:[],name:"InvalidDuration",type:"error"},{inputs:[],name:"InvalidPaymentToken",type:"error"},{inputs:[],name:"InvalidPrice",type:"error"},{inputs:[],name:"InvalidRoyalty",type:"error"},{inputs:[],name:"InvalidSignature",type:"error"},{inputs:[],name:"NotTokenOwner",type:"error"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"OwnableInvalidOwner",type:"error"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"OwnableUnauthorizedAccount",type:"error"},{inputs:[],name:"TokenAlreadyExists",type:"error"},{inputs:[],name:"Unauthorized",type:"error"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"buyer",type:"address"},{indexed:!1,internalType:"uint32",name:"periods",type:"uint32"},{indexed:!1,internalType:"uint256",name:"newExpiry",type:"uint256"},{indexed:!1,internalType:"uint256",name:"amountPaid",type:"uint256"}],name:"AccessPurchased",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"owner",type:"address"},{indexed:!0,internalType:"address",name:"approved",type:"address"},{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"}],name:"Approval",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"owner",type:"address"},{indexed:!0,internalType:"address",name:"operator",type:"address"},{indexed:!1,internalType:"bool",name:"approved",type:"bool"}],name:"ApprovalForAll",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"id",type:"uint256"},{indexed:!0,internalType:"uint256",name:"childIp",type:"uint256"},{indexed:!1,internalType:"uint256",name:"parentIp",type:"uint256"}],name:"ChildIpTagged",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"}],name:"DataDeleted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"bytes32",name:"contentHash",type:"bytes32"}],name:"DataMinted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"id",type:"uint256"},{indexed:!1,internalType:"bytes32",name:"counterEvidenceHash",type:"bytes32"}],name:"DisputeAssertion",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"id",type:"uint256"}],name:"DisputeCancelled",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"id",type:"uint256"},{indexed:!1,internalType:"bool",name:"judgement",type:"bool"}],name:"DisputeJudged",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"disputeModule",type:"address"}],name:"DisputeModuleUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"id",type:"uint256"},{indexed:!0,internalType:"address",name:"initiator",type:"address"},{indexed:!0,internalType:"uint256",name:"targetId",type:"uint256"},{indexed:!1,internalType:"bytes32",name:"disputeTag",type:"bytes32"}],name:"DisputeRaised",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"marketPlace",type:"address"}],name:"MarketPlaceUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"previousOwner",type:"address"},{indexed:!0,internalType:"address",name:"newOwner",type:"address"}],name:"OwnershipTransferred",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Paused",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint256",name:"royaltyAmount",type:"uint256"},{indexed:!1,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"uint256",name:"protocolAmount",type:"uint256"}],name:"RoyaltyPaid",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"signer",type:"address"}],name:"SignerUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"enum IIpNFT.DataStatus",name:"status",type:"uint8"}],name:"StatusUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint128",name:"newPrice",type:"uint128"},{indexed:!1,internalType:"uint32",name:"newDuration",type:"uint32"},{indexed:!1,internalType:"uint16",name:"newRoyaltyBps",type:"uint16"},{indexed:!1,internalType:"address",name:"paymentToken",type:"address"}],name:"TermsUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"from",type:"address"},{indexed:!0,internalType:"address",name:"to",type:"address"},{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"}],name:"Transfer",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Unpaused",type:"event"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"approve",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"balanceOf",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"dataStatus",outputs:[{internalType:"enum IIpNFT.DataStatus",name:"",type:"uint8"}],stateMutability:"view",type:"function"},{inputs:[],name:"disputeModule",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"finalizeDelete",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"getApproved",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"tokenOwner",type:"address"}],name:"getOrCreateRoyaltyVault",outputs:[{internalType:"address",name:"vault",type:"address"}],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"getTerms",outputs:[{components:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],internalType:"struct IIpNFT.LicenseTerms",name:"",type:"tuple"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"owner",type:"address"},{internalType:"address",name:"operator",type:"address"}],name:"isApprovedForAll",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"_tokenId",type:"uint256"}],name:"markDisputed",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"marketPlace",outputs:[{internalType:"contract IMarketplace",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"maxRoyaltyBps",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"maxTermDuration",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"minPrice",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"minTermDuration",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"bytes32",name:"creatorContentHash",type:"bytes32"},{internalType:"string",name:"uri",type:"string"},{components:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],internalType:"struct IIpNFT.LicenseTerms",name:"licenseTerms",type:"tuple"},{internalType:"uint256",name:"deadline",type:"uint256"},{internalType:"uint256[]",name:"parents",type:"uint256[]"},{internalType:"bytes",name:"signature",type:"bytes"}],name:"mintWithSignature",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"name",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[],name:"owner",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"ownerOf",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"pause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"paused",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"renounceOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"safeTransferFrom",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"bytes",name:"data",type:"bytes"}],name:"safeTransferFrom",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"operator",type:"address"},{internalType:"bool",name:"approved",type:"bool"}],name:"setApprovalForAll",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_disputeModule",type:"address"}],name:"setDisputeModule",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_marketPlace",type:"address"}],name:"setMarketPlace",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_signer",type:"address"}],name:"setSigner",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"signer",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"bytes4",name:"interfaceId",type:"bytes4"}],name:"supportsInterface",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"symbol",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"tokenInfo",outputs:[{internalType:"string",name:"tokenURI",type:"string"},{internalType:"bytes32",name:"contentHash",type:"bytes32"},{components:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],internalType:"struct IIpNFT.LicenseTerms",name:"terms",type:"tuple"},{internalType:"enum IIpNFT.DataStatus",name:"status",type:"uint8"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"_tokenId",type:"uint256"}],name:"tokenURI",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"transferFrom",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"newOwner",type:"address"}],name:"transferOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"unpause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"},{components:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],internalType:"struct IIpNFT.LicenseTerms",name:"newTerms",type:"tuple"}],name:"updateTerms",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"wCAMP",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"}],MARKETPLACE_ABI:[{inputs:[{internalType:"address",name:"dataNFT_",type:"address"},{internalType:"uint16",name:"protocolFeeBps_",type:"uint16"},{internalType:"address",name:"treasury_",type:"address"}],stateMutability:"nonpayable",type:"constructor"},{inputs:[],name:"EnforcedPause",type:"error"},{inputs:[],name:"ExpectedPause",type:"error"},{inputs:[],name:"InvalidParentIp",type:"error"},{inputs:[],name:"InvalidPayment",type:"error"},{inputs:[],name:"InvalidRoyalty",type:"error"},{inputs:[],name:"MaxParentsExceeded",type:"error"},{inputs:[],name:"MaxRoyaltyExceeded",type:"error"},{inputs:[],name:"NoSubscriptionFound",type:"error"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"OwnableInvalidOwner",type:"error"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"OwnableUnauthorizedAccount",type:"error"},{inputs:[],name:"ParentAlreadyExists",type:"error"},{inputs:[],name:"ParentIpAlreadyDeleted",type:"error"},{inputs:[],name:"ParentIpAlreadyDisputed",type:"error"},{inputs:[],name:"TermsMismatch",type:"error"},{inputs:[],name:"Unauthorized",type:"error"},{inputs:[],name:"ZeroAddress",type:"error"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"buyer",type:"address"},{indexed:!1,internalType:"uint32",name:"periods",type:"uint32"},{indexed:!1,internalType:"uint256",name:"newExpiry",type:"uint256"},{indexed:!1,internalType:"uint256",name:"amountPaid",type:"uint256"}],name:"AccessPurchased",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"id",type:"uint256"},{indexed:!0,internalType:"uint256",name:"childIp",type:"uint256"},{indexed:!1,internalType:"uint256",name:"parentIp",type:"uint256"}],name:"ChildIpTagged",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"}],name:"DataDeleted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"bytes32",name:"contentHash",type:"bytes32"}],name:"DataMinted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"id",type:"uint256"},{indexed:!1,internalType:"bytes32",name:"counterEvidenceHash",type:"bytes32"}],name:"DisputeAssertion",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"id",type:"uint256"}],name:"DisputeCancelled",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"id",type:"uint256"},{indexed:!1,internalType:"bool",name:"judgement",type:"bool"}],name:"DisputeJudged",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"disputeModule",type:"address"}],name:"DisputeModuleUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"id",type:"uint256"},{indexed:!0,internalType:"address",name:"initiator",type:"address"},{indexed:!0,internalType:"uint256",name:"targetId",type:"uint256"},{indexed:!1,internalType:"bytes32",name:"disputeTag",type:"bytes32"}],name:"DisputeRaised",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"marketPlace",type:"address"}],name:"MarketPlaceUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"previousOwner",type:"address"},{indexed:!0,internalType:"address",name:"newOwner",type:"address"}],name:"OwnershipTransferred",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Paused",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint256",name:"royaltyAmount",type:"uint256"},{indexed:!1,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"uint256",name:"protocolAmount",type:"uint256"}],name:"RoyaltyPaid",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"signer",type:"address"}],name:"SignerUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"enum IIpNFT.DataStatus",name:"status",type:"uint8"}],name:"StatusUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint128",name:"newPrice",type:"uint128"},{indexed:!1,internalType:"uint32",name:"newDuration",type:"uint32"},{indexed:!1,internalType:"uint16",name:"newRoyaltyBps",type:"uint16"},{indexed:!1,internalType:"address",name:"paymentToken",type:"address"}],name:"TermsUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Unpaused",type:"event"},{inputs:[],name:"MAX_PARENTS",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"buyer",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint256",name:"expectedPrice",type:"uint256"},{internalType:"uint32",name:"expectedDuration",type:"uint32"},{internalType:"address",name:"expectedPaymentToken",type:"address"}],name:"buyAccess",outputs:[],stateMutability:"payable",type:"function"},{inputs:[{internalType:"uint256",name:"ipId",type:"uint256"},{internalType:"uint256",name:"parent",type:"uint256"}],name:"hasParentIp",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"ipToken",outputs:[{internalType:"contract IIpNFT",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"owner",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"},{internalType:"uint256",name:"",type:"uint256"}],name:"parentRoyaltyPercent",outputs:[{internalType:"uint16",name:"",type:"uint16"}],stateMutability:"view",type:"function"},{inputs:[],name:"pause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"paused",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"protocolFeeBps",outputs:[{internalType:"uint16",name:"",type:"uint16"}],stateMutability:"view",type:"function"},{inputs:[],name:"renounceOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"royaltyStack",outputs:[{internalType:"uint16",name:"",type:"uint16"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"childIpId",type:"uint256"},{internalType:"uint256[]",name:"parents",type:"uint256[]"},{internalType:"address",name:"creator",type:"address"}],name:"setParentIpsAndRoyaltyPercents",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"},{internalType:"address",name:"",type:"address"}],name:"subscriptionExpiry",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"newOwner",type:"address"}],name:"transferOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"treasury",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"unpause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint16",name:"newFeeBps",type:"uint16"}],name:"updateProtocolFee",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"newTreasury",type:"address"}],name:"updateTreasury",outputs:[],stateMutability:"nonpayable",type:"function"}]}};let D=[];const N=()=>D,P=e=>{function t(t){D.some((e=>e.info.uuid===t.detail.info.uuid))||(D=[...D,t.detail],e(D))}if("undefined"!=typeof window)return window.addEventListener("eip6963:announceProvider",t),window.dispatchEvent(new Event("eip6963:requestProvider")),()=>window.removeEventListener("eip6963:announceProvider",t)};
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
 */function x(e,t,n,i,a,r,s,o){return y(this,void 0,void 0,(function*(){return console.log("mintWithSignature",this.environment),yield this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"mintWithSignature",
// [to, tokenId, parentId, hash, uri, licenseTerms, deadline, signature],
[e,t,i,a,r,s,[n],o],{waitForReceipt:!0})}))}
/**
 * Registers a Data NFT with the Origin service in order to obtain a signature for minting.
 * @param source The source of the Data NFT (e.g., "spotify", "twitter", "tiktok", or "file").
 * @param deadline The deadline for the registration operation.
 * @param fileKey Optional file key for file uploads.
 * @return A promise that resolves with the registration data.
 */function M(e,t,n,i,a,r){return y(this,void 0,void 0,(function*(){const s={source:e,deadline:Number(t),licenseTerms:{price:n.price.toString(),duration:n.duration,royaltyBps:n.royaltyBps,paymentToken:n.paymentToken},metadata:i,parentId:Number(r)||0};void 0!==a&&(s.fileKey=a);const o=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/auth/origin/register`,{method:"POST",headers:{Authorization:`Bearer ${this.getJwt()}`,"Content-Type":"application/json"},body:JSON.stringify(s)});if(!o.ok)throw new Error(`Failed to get signature: ${o.statusText}`);const d=yield o.json();if(d.isError)throw new Error(`Failed to get signature: ${d.message}`);return d.data}))}function B(e,t,n){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"updateTerms",[e,t,n],{waitForReceipt:!0})}function U(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"finalizeDelete",[e])}function O(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"getTerms",[e])}function F(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"ownerOf",[e])}function R(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"balanceOf",[e])}function $(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"contentHash",[e])}function H(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"tokenURI",[e])}function j(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"dataStatus",[e])}function L(e,t){return y(this,void 0,void 0,(function*(){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"royaltyInfo",[e,t])}))}function W(e){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"getApproved",[e])}function q(e,t){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"isApprovedForAll",[e,t])}function K(e,t,n){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"transferFrom",[e,t,n])}function z(e,t,n,i){const a=i?[e,t,n,i]:[e,t,n];return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"safeTransferFrom",a)}function J(e,t){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"approve",[e,t])}function G(e,t){return this.callContractMethod(this.environment.DATANFT_CONTRACT_ADDRESS,this.environment.IPNFT_ABI,"setApprovalForAll",[e,t])}function V(e,t,n,i){return this.callContractMethod(this.environment.MARKETPLACE_CONTRACT_ADDRESS,this.environment.MARKETPLACE_ABI,"buyAccess",[e,t,n],{waitForReceipt:!0,value:i})}function X(e,t,n,i){return this.callContractMethod(this.environment.MARKETPLACE_CONTRACT_ADDRESS,this.environment.MARKETPLACE_ABI,"renewAccess",[e,t,n],void 0!==i?{value:i}:void 0)}function Y(e,t){return this.callContractMethod(this.environment.MARKETPLACE_CONTRACT_ADDRESS,this.environment.MARKETPLACE_ABI,"hasAccess",[e,t])}function Z(e,t){return this.callContractMethod(this.environment.MARKETPLACE_CONTRACT_ADDRESS,this.environment.MARKETPLACE_ABI,"subscriptionExpiry",[e,t])}
/**
 * Approves a spender to spend a specified amount of tokens on behalf of the owner.
 * If the current allowance is less than the specified amount, it will perform the approval.
 * @param {ApproveParams} params - The parameters for the approval.
 */var Q,ee,te,ne,ie,ae,re,se,oe,de,ue,pe,le,ye,ce;
/**
 * The Origin class
 * Handles the upload of files to Origin, as well as querying the user's stats
 */class he{constructor(t,n,i){Q.add(this),ee.set(this,(e=>y(this,void 0,void 0,(function*(){try{const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/auth/origin/upload-url`,{method:"POST",body:JSON.stringify({name:e.name,type:e.type}),headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!t.ok)throw new Error(`HTTP ${t.status}: ${t.statusText}`);const n=yield t.json();if(n.isError)throw new Error(n.message||"Failed to generate upload URL");return n.data}catch(e){throw console.error("Failed to generate upload URL:",e),e}})))),te.set(this,((e,t)=>y(this,void 0,void 0,(function*(){try{const n=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/auth/origin/update-status`,{method:"PATCH",body:JSON.stringify({status:t,fileKey:e}),headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!n.ok){const e=yield n.text().catch((()=>"Unknown error"));throw new Error(`HTTP ${n.status}: ${e}`)}return!0}catch(e){throw console.error("Failed to update origin status:",e),e}})))),this.uploadFile=(t,n)=>y(this,void 0,void 0,(function*(){let i;try{i=yield c(this,ee,"f").call(this,t)}catch(e){throw console.error("Failed to generate upload URL:",e),new Error(`Failed to generate upload URL: ${e instanceof Error?e.message:String(e)}`)}if(!i)throw new Error("Failed to generate upload URL: No upload info returned");try{yield((t,n,i)=>new Promise(((a,r)=>{e.put(n,t,Object.assign({headers:{"Content-Type":t.type}},"undefined"!=typeof window&&"function"==typeof i?{onUploadProgress:e=>{if(e.total){const t=e.loaded/e.total*100;i(t)}}}:{})).then((e=>{a(e.data)})).catch((e=>{var t;const n=(null===(t=null==e?void 0:e.response)||void 0===t?void 0:t.data)||(null==e?void 0:e.message)||"Upload failed";r(n)}))})))(t,i.url,(null==n?void 0:n.progressCallback)||(()=>{}))}catch(e){try{yield c(this,te,"f").call(this,i.key,"failed")}catch(e){console.error("Failed to update status to failed:",e)}const t=e instanceof Error?e.message:String(e);throw new Error(`Failed to upload file: ${t}`)}try{yield c(this,te,"f").call(this,i.key,"success")}catch(e){console.error("Failed to update status to success:",e)}return i})),this.mintFile=(e,t,n,i,a)=>y(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");const r=yield this.uploadFile(e,a);if(!r||!r.key)throw new Error("Failed to upload file or get upload info.");const s=BigInt(Math.floor(Date.now()/1e3)+600),o=yield this.registerIpNFT("file",s,n,t,r.key,i),{tokenId:d,signerAddress:u,creatorContentHash:p,signature:l,uri:y}=o;// 10 minutes from now
if(!(d&&u&&p&&void 0!==l&&y))throw new Error("Failed to register IpNFT: Missing required fields in registration response.");const[c]=yield this.viemClient.request({method:"eth_requestAccounts",params:[]}),h=yield this.mintWithSignature(c,d,i||BigInt(0),p,y,n,s,l);if("0x1"!==h.status)throw console.error("Minting failed:",h),new Error(`Minting failed with status: ${h.status}`);return d.toString()})),this.mintSocial=(e,t,n)=>y(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");const i=BigInt(Math.floor(Date.now()/1e3)+600),a=yield this.registerIpNFT(e,i,n,t),{tokenId:r,signerAddress:s,creatorContentHash:o,signature:d,uri:u}=a;// 10 minutes from now
if(!(r&&s&&o&&void 0!==d&&u))throw new Error("Failed to register Social IpNFT: Missing required fields in registration response.");const[p]=yield this.viemClient.request({method:"eth_requestAccounts",params:[]}),l=yield this.mintWithSignature(p,r,BigInt(0),// parentId is not applicable for social IpNFTs
o,u,n,i,d);if("0x1"!==l.status)throw new Error(`Minting Social IpNFT failed with status: ${l.status}`);return r.toString()})),this.getOriginUploads=()=>y(this,void 0,void 0,(function*(){const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/auth/origin/files`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`}});if(!e.ok)return console.error("Failed to get origin uploads"),null;return(yield e.json()).data})),console.log("environment",n),this.jwt=t,this.viemClient=i,this.environment=n,
// DataNFT methods
this.mintWithSignature=x.bind(this),this.registerIpNFT=M.bind(this),this.updateTerms=B.bind(this),this.requestDelete=U.bind(this),this.getTerms=O.bind(this),this.ownerOf=F.bind(this),this.balanceOf=R.bind(this),this.contentHash=$.bind(this),this.tokenURI=H.bind(this),this.dataStatus=j.bind(this),this.royaltyInfo=L.bind(this),this.getApproved=W.bind(this),this.isApprovedForAll=q.bind(this),this.transferFrom=K.bind(this),this.safeTransferFrom=z.bind(this),this.approve=J.bind(this),this.setApprovalForAll=G.bind(this),
// Marketplace methods
this.buyAccess=V.bind(this),this.renewAccess=X.bind(this),this.hasAccess=Y.bind(this),this.subscriptionExpiry=Z.bind(this)}getJwt(){return this.jwt}setViemClient(e){this.viemClient=e,console.log("Origin setViemClient",this.viemClient)}
/**
     * Get the user's Origin stats (multiplier, consent, usage, etc.).
     * @returns {Promise<OriginUsageReturnType>} A promise that resolves with the user's Origin stats.
     */getOriginUsage(){return y(this,void 0,void 0,(function*(){const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/auth/origin/usage`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"}}).then((e=>e.json()));if(!e.isError&&e.data.user)return e;throw new m(e.message||"Failed to fetch Origin usage")}))}
/**
     * Set the user's consent for Origin usage.
     * @param {boolean} consent The user's consent.
     * @returns {Promise<void>}
     * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the consent is not provided.
     */setOriginConsent(e){return y(this,void 0,void 0,(function*(){if(void 0===e)throw new m("Consent is required");const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/auth/origin/status`,{method:"PATCH",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"},body:JSON.stringify({active:e})}).then((e=>e.json()));if(t.isError)throw new m(t.message||"Failed to set Origin consent")}))}
/**
     * Set the user's Origin multiplier.
     * @param {number} multiplier The user's Origin multiplier.
     * @returns {Promise<void>}
     * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the multiplier is not provided.
     */setOriginMultiplier(e){return y(this,void 0,void 0,(function*(){if(void 0===e)throw new m("Multiplier is required");const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/auth/origin/multiplier`,{method:"PATCH",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"},body:JSON.stringify({multiplier:e})}).then((e=>e.json()));if(t.isError)throw new m(t.message||"Failed to set Origin multiplier")}))}
/**
     * Call a contract method.
     * @param {string} contractAddress The contract address.
     * @param {Abi} abi The contract ABI.
     * @param {string} methodName The method name.
     * @param {any[]} params The method parameters.
     * @param {CallOptions} [options] The call options.
     * @returns {Promise<any>} A promise that resolves with the result of the contract call or transaction hash.
     * @throws {Error} - Throws an error if the wallet client is not connected and the method is not a view function.
     */callContractMethod(e,t,n,i){return y(this,arguments,void 0,(function*(e,t,n,i,a={}){const r=s({abi:t,name:n}),d=r&&"stateMutability"in r&&("view"===r.stateMutability||"pure"===r.stateMutability);if(!d&&!this.viemClient)throw new Error("WalletClient not connected.");if(d){const a=_();return(yield a.readContract({address:e,abi:t,functionName:n,args:i}))||null}{const[r]=yield this.viemClient.request({method:"eth_requestAccounts",params:[]}),s=o({abi:t,functionName:n,args:i});yield c(this,Q,"m",ie).call(this,this.environment.CHAIN);try{const t=yield this.viemClient.sendTransaction({to:e,data:s,account:r,value:a.value,gas:a.gas});if("string"!=typeof t)throw new Error("Transaction failed to send.");if(!a.waitForReceipt)return t;return yield c(this,Q,"m",ne).call(this,t)}catch(e){throw console.error("Transaction failed:",e),new Error("Transaction failed: "+e)}}}))}
/**
     * Buy access to an asset by first checking its price via getTerms, then calling buyAccess.
     * @param {bigint} tokenId The token ID of the asset.
     * @param {number} periods The number of periods to buy access for.
     * @returns {Promise<any>} The result of the buyAccess call.
     */buyAccessSmart(e,t){return y(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");const n=yield this.getTerms(e);if(!n)throw new Error("Failed to fetch terms for asset");const{price:i,paymentToken:a}=n;if(void 0===i||void 0===a)throw new Error("Terms missing price or paymentToken");const[s]=yield this.viemClient.request({method:"eth_requestAccounts",params:[]}),o=i*BigInt(t);return a===d?this.buyAccess(s,e,t,o):(yield function(e){return y(this,arguments,void 0,(function*({walletClient:e,publicClient:t,tokenAddress:n,owner:i,spender:a,amount:s}){(yield t.readContract({address:n,abi:r,functionName:"allowance",args:[i,a]}))<s&&(yield e.writeContract({address:n,account:i,abi:r,functionName:"approve",args:[a,s],chain:g}))}))}({walletClient:this.viemClient,publicClient:_(),tokenAddress:a,owner:s,spender:this.environment.MARKETPLACE_CONTRACT_ADDRESS,amount:o}),this.buyAccess(s,e,t))}))}getData(e){return y(this,void 0,void 0,(function*(){const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/auth/origin/data/${e}`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!t.ok)throw new Error("Failed to fetch data");return t.json()}))}}ee=new WeakMap,te=new WeakMap,Q=new WeakSet,ne=function(e){return y(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");for(;;){const t=yield this.viemClient.request({method:"eth_getTransactionReceipt",params:[e]});if(t&&t.blockNumber)return t;yield new Promise((e=>setTimeout(e,1e3)))}}))},ie=function(e){return y(this,void 0,void 0,(function*(){
// return;
if(!this.viemClient)throw new Error("WalletClient not connected.");let t=yield this.viemClient.request({method:"eth_chainId",params:[]});if("string"==typeof t&&(t=parseInt(t,16)),t!==e.id)try{yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16)}]})}catch(t){
// Unrecognized chain
if(4902!==t.code)throw t;yield this.viemClient.request({method:"wallet_addEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16),chainName:e.name,rpcUrls:e.rpcUrls.default.http,nativeCurrency:e.nativeCurrency}]}),yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16)}]})}}))};
/**
 * The Auth class.
 * @class
 * @classdesc The Auth class is used to authenticate the user.
 */
class me{
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
constructor({clientId:e,redirectUri:t,allowAnalytics:n=!0,ackeeInstance:i,environment:a="DEVELOPMENT"}){if(ae.add(this),re.set(this,void 0),se.set(this,void 0),!e)throw new Error("clientId is required");this.viem=null,this.environment=k[a],
// if (typeof window !== "undefined") {
//   if (window.ethereum) this.viem = getClient(window.ethereum);
// }
this.redirectUri=(e=>{const t=["twitter","discord","spotify"];return"object"==typeof e?t.reduce(((t,n)=>(t[n]=e[n]||("undefined"!=typeof window?window.location.href:""),t)),{}):"string"==typeof e?t.reduce(((t,n)=>(t[n]=e,t)),{}):e?{}:t.reduce(((e,t)=>(e[t]="undefined"!=typeof window?window.location.href:"",e)),{})})(t),i&&h(this,se,i,"f"),n&&c(this,se,"f"),this.clientId=e,this.isAuthenticated=!1,this.jwt=null,this.origin=null,this.walletAddress=null,this.userId=null,h(this,re,{},"f"),P((e=>{c(this,ae,"m",oe).call(this,"providers",e)})),c(this,ae,"m",de).call(this)}
/**
     * Subscribe to an event. Possible events are "state", "provider", "providers", and "viem".
     * @param {("state"|"provider"|"providers"|"viem")} event The event.
     * @param {function} callback The callback function.
     * @returns {void}
     * @example
     * auth.on("state", (state) => {
     *  console.log(state);
     * });
     */on(e,t){c(this,re,"f")[e]||(c(this,re,"f")[e]=[]),c(this,re,"f")[e].push(t),"providers"===e&&t(N())}
/**
     * Set the loading state.
     * @param {boolean} loading The loading state.
     * @returns {void}
     */setLoading(e){c(this,ae,"m",oe).call(this,"state",e?"loading":this.isAuthenticated?"authenticated":"unauthenticated")}
/**
     * Set the provider. This is useful for setting the provider when the user selects a provider from the UI or when dApp wishes to use a specific provider.
     * @param {object} options The options object. Includes the provider and the provider info.
     * @returns {void}
     * @throws {APIError} - Throws an error if the provider is not provided.
     */setProvider({provider:e,info:i,address:a}){if(!e)throw new m("provider is required");this.viem=((e,i="window.ethereum",
// chain: "mainnet" | "testnet" = "testnet",
a,r)=>{var s;if(!e&&!b)return console.warn("Provider is required to create a client."),null;if(!b||b.transport.name!==i&&e||r!==(null===(s=b.account)||void 0===s?void 0:s.address)&&e){const s={
// chain: chain === "mainnet" ? mainnet : testnet,
chain:a||g,transport:t(e,{name:i})};r&&(s.account=p(r)),b=n(s)}return b})(e,i.name,this.environment.CHAIN,a),console.log("setProvider",this.viem),this.origin&&this.origin.setViemClient(this.viem),
// TODO: only use one of these
c(this,ae,"m",oe).call(this,"viem",this.viem),c(this,ae,"m",oe).call(this,"provider",{provider:e,info:i}),localStorage.setItem("camp-sdk:provider",JSON.stringify(i))}
/**
     * Set the wallet address. This is useful for edge cases where the provider can't return the wallet address. Don't use this unless you know what you're doing.
     * @param {string} walletAddress The wallet address.
     * @returns {void}
     */setWalletAddress(e){this.walletAddress=e}recoverProvider(){return y(this,void 0,void 0,(function*(){var e,t,n,i,a,r,s,o,d,u,p,l,y,c,h;if(!this.walletAddress)return void console.warn("No wallet address found in local storage. Please connect your wallet again.");const m=JSON.parse(localStorage.getItem("camp-sdk:provider")||"{}");let T;const f=null!==(e=N())&&void 0!==e?e:[];
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
     */disconnect(){return y(this,void 0,void 0,(function*(){this.isAuthenticated&&(c(this,ae,"m",oe).call(this,"state","unauthenticated"),this.isAuthenticated=!1,this.walletAddress=null,this.userId=null,this.jwt=null,this.origin=null,localStorage.removeItem("camp-sdk:wallet-address"),localStorage.removeItem("camp-sdk:user-id"),localStorage.removeItem("camp-sdk:jwt"),localStorage.removeItem("camp-sdk:environment"))}))}
/**
     * Connect the user's wallet and sign the message.
     * @returns {Promise<{ success: boolean; message: string; walletAddress: string }>} A promise that resolves with the authentication result.
     * @throws {APIError} - Throws an error if the user cannot be authenticated.
     */connect(){return y(this,void 0,void 0,(function*(){c(this,ae,"m",oe).call(this,"state","loading");try{this.walletAddress||(yield c(this,ae,"m",ue).call(this)),this.walletAddress=u(this.walletAddress);const e=yield c(this,ae,"m",pe).call(this),t=c(this,ae,"m",ye).call(this,e),n=yield this.viem.signMessage({account:this.walletAddress,message:t}),i=yield c(this,ae,"m",le).call(this,t,n);if(i.success)return this.isAuthenticated=!0,this.userId=i.userId,this.jwt=i.token,this.origin=new he(this.jwt,this.environment,this.viem),localStorage.setItem("camp-sdk:jwt",this.jwt),localStorage.setItem("camp-sdk:wallet-address",this.walletAddress),localStorage.setItem("camp-sdk:user-id",this.userId),localStorage.setItem("camp-sdk:environment",this.environment.NAME),c(this,ae,"m",oe).call(this,"state","authenticated"),yield c(this,ae,"m",ce).call(this,S.USER_CONNECTED,"User Connected"),{success:!0,message:"Successfully authenticated",walletAddress:this.walletAddress};throw this.isAuthenticated=!1,c(this,ae,"m",oe).call(this,"state","unauthenticated"),new m("Failed to authenticate")}catch(e){throw this.isAuthenticated=!1,c(this,ae,"m",oe).call(this,"state","unauthenticated"),new m(e)}}))}
/**
     * Get the user's linked social accounts.
     * @returns {Promise<Record<string, boolean>>} A promise that resolves with the user's linked social accounts.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated or if the request fails.
     * @example
     * const auth = new Auth({ clientId: "your-client-id" });
     * const socials = await auth.getLinkedSocials();
     * console.log(socials);
     */getLinkedSocials(){return y(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/client-user/connections-sdk`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"}}).then((e=>e.json()));if(e.isError)throw new m(e.message||"Failed to fetch connections");{const t={};return Object.keys(e.data.data).forEach((n=>{t[n.split("User")[0]]=e.data.data[n]})),t}}))}
/**
     * Link the user's Twitter account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkTwitter(){return y(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");
// await this.#sendAnalyticsEvent(
//   constants.ACKEE_EVENTS.TWITTER_LINKED,
//   "Twitter Linked"
// );
window.location.href=`${this.environment.AUTH_HUB_BASE_API}/twitter/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.twitter}`}))}
/**
     * Link the user's Discord account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkDiscord(){return y(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");
// await this.#sendAnalyticsEvent(
//   constants.ACKEE_EVENTS.DISCORD_LINKED,
//   "Discord Linked"
// );
window.location.href=`${this.environment.AUTH_HUB_BASE_API}/discord/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.discord}`}))}
/**
     * Link the user's Spotify account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkSpotify(){return y(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");
// await this.#sendAnalyticsEvent(
//   constants.ACKEE_EVENTS.SPOTIFY_LINKED,
//   "Spotify Linked"
// );
window.location.href=`${this.environment.AUTH_HUB_BASE_API}/spotify/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.spotify}`}))}
/**
     * Link the user's TikTok account.
     * @param {string} handle The user's TikTok handle.
     * @returns {Promise<any>} A promise that resolves with the TikTok account data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */linkTikTok(e){return y(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/tiktok/connect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userHandle:e,clientId:this.clientId,userId:this.userId})}).then((e=>e.json()));if(t.isError)throw"Request failed with status code 502"===t.message?new m("TikTok service is currently unavailable, try again later"):new m(t.message||"Failed to link TikTok account");return c(this,ae,"m",ce).call(this,S.TIKTOK_LINKED,"TikTok Linked"),t.data}))}
/**
     * Send an OTP to the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @returns {Promise<any>} A promise that resolves with the OTP data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */sendTelegramOTP(e){return y(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!e)throw new m("Phone number is required");yield this.unlinkTelegram();const t=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/telegram/sendOTP-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:e})}).then((e=>e.json()));if(t.isError)throw new m(t.message||"Failed to send Telegram OTP");return t.data}))}
/**
     * Link the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @param {string} otp The OTP.
     * @param {string} phoneCodeHash The phone code hash.
     * @returns {Promise<object>} A promise that resolves with the Telegram account data.
     * @throws {APIError|Error} - Throws an error if the user is not authenticated. Also throws an error if the phone number, OTP, and phone code hash are not provided.
     */linkTelegram(e,t,n){return y(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!e||!t||!n)throw new m("Phone number, OTP, and phone code hash are required");const i=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/telegram/signIn-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:e,code:t,phone_code_hash:n,userId:this.userId,clientId:this.clientId})}).then((e=>e.json()));if(i.isError)throw new m(i.message||"Failed to link Telegram account");return c(this,ae,"m",ce).call(this,S.TELEGRAM_LINKED,"Telegram Linked"),i.data}))}
/**
     * Unlink the user's Twitter account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTwitter(){return y(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/twitter/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new m(e.message||"Failed to unlink Twitter account");return e.data}))}
/**
     * Unlink the user's Discord account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkDiscord(){return y(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new m("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/discord/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new m(e.message||"Failed to unlink Discord account");return e.data}))}
/**
     * Unlink the user's Spotify account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkSpotify(){return y(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new m("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/spotify/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new m(e.message||"Failed to unlink Spotify account");return e.data}))}
/**
     * Unlink the user's TikTok account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTikTok(){return y(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new m("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/tiktok/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((e=>e.json()));if(e.isError)throw new m(e.message||"Failed to unlink TikTok account");return e.data}))}
/**
     * Unlink the user's Telegram account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTelegram(){return y(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new m("User needs to be authenticated");const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/telegram/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((e=>e.json()));if(e.isError)throw new m(e.message||"Failed to unlink Telegram account");return e.data}))}}re=new WeakMap,se=new WeakMap,ae=new WeakSet,oe=function(e,t){c(this,re,"f")[e]&&c(this,re,"f")[e].forEach((e=>e(t)))},de=function(e){return y(this,void 0,void 0,(function*(){if("undefined"==typeof localStorage)return;const t=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:wallet-address"),n=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:user-id"),i=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:jwt"),a=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:environment");t&&n&&i&&(a===this.environment.NAME||!a)?(this.walletAddress=t,this.userId=n,this.jwt=i,this.origin=new he(this.jwt,this.environment),this.isAuthenticated=!0,e?this.setProvider({provider:e.provider,info:e.info||{name:"Unknown"},address:t}):(console.warn("No matching provider was given for the stored wallet address. Trying to recover provider."),yield this.recoverProvider())):this.isAuthenticated=!1}))},ue=function(){return y(this,void 0,void 0,(function*(){try{const[e]=yield this.viem.requestAddresses();return this.walletAddress=u(e),this.walletAddress}catch(e){throw new m(e)}}))},pe=function(){return y(this,void 0,void 0,(function*(){try{const e=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/client-user/nonce`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({walletAddress:this.walletAddress})}),t=yield e.json();return 200!==e.status?Promise.reject(t.message||"Failed to fetch nonce"):t.data}catch(e){throw new Error(e)}}))},le=function(e,t){return y(this,void 0,void 0,(function*(){try{const n=yield fetch(`${this.environment.AUTH_HUB_BASE_API}/${this.environment.AUTH_ENDPOINT}/client-user/verify`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({message:e,signature:t,walletAddress:this.walletAddress})}),i=yield n.json(),a=i.data.split(".")[1],r=JSON.parse(atob(a));return{success:!i.isError,userId:r.id,token:i.data}}catch(e){throw new m(e)}}))},ye=function(e){return l({domain:window.location.host,address:this.walletAddress,statement:C,uri:window.location.origin,version:"1",chainId:this.viem.chain.id,nonce:e})},ce=function(e,t){return y(this,arguments,void 0,(function*(e,t,n=1){
// if (this.#ackeeInstance)
//   await sendAnalyticsEvent(this.#ackeeInstance, event, message, count);
// else return;
}))};export{me as Auth,I as SpotifyAPI,A as TwitterAPI};
