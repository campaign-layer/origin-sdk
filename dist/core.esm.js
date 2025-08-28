import e from"axios";import{custom as t,createWalletClient as n,createPublicClient as i,http as a,erc20Abi as r,getAbiItem as s,encodeFunctionData as o,zeroAddress as d,checksumAddress as u}from"viem";import{toAccount as l}from"viem/accounts";import{createSiweMessage as p}from"viem/siwe";
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
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */function c(e,t,n,i){return new(n||(n=Promise))((function(a,r){function s(e){try{d(i.next(e))}catch(e){r(e)}}function o(e){try{d(i.throw(e))}catch(e){r(e)}}function d(e){var t;e.done?a(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,o)}d((i=i.apply(e,t||[])).next())}))}function y(e,t,n,i){if("a"===n&&!i)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!i:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===n?i:"a"===n?i.call(e):i?i.value:t.get(e)}function h(e,t,n,i,a){if("m"===i)throw new TypeError("Private method is not writable");if("a"===i&&!a)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!a:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===i?a.call(e,n):a?a.value=n:t.set(e,n),n}"function"==typeof SuppressedError&&SuppressedError;class m extends Error{constructor(e,t){super(e),this.name="APIError",this.statusCode=t||500,Error.captureStackTrace(this,this.constructor)}toJSON(){return{error:this.name,message:this.message,statusCode:this.statusCode||500}}}
/**
 * Makes a GET request to the given URL with the provided headers.
 *
 * @param {string} url - The URL to send the GET request to.
 * @param {object} headers - The headers to include in the request.
 * @returns {Promise<object>} - The response data.
 * @throws {APIError} - Throws an error if the request fails.
 */function f(t){return c(this,arguments,void 0,(function*(t,n={}){try{return(yield e.get(t,{headers:n})).data}catch(e){if(e.response)throw new m(e.response.data.message||"API request failed",e.response.status);throw new m("Network error or server is unavailable",500)}}))}
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
function w(e,t={}){const n=function(e={}){return Object.keys(e).map((t=>`${encodeURIComponent(t)}=${encodeURIComponent(e[t])}`)).join("&")}(t);return n?`${e}?${n}`:e}const v="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/twitter",T="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/spotify";
/**
 * The TwitterAPI class.
 * @class
 * @classdesc The TwitterAPI class is used to interact with the Twitter API.
 */
class b{
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
     */fetchUserByUsername(e){return c(this,void 0,void 0,(function*(){const t=w(`${v}/user`,{twitterUserName:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetsByUsername(e){return c(this,arguments,void 0,(function*(e,t=1,n=10){const i=w(`${v}/tweets`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch followers by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The followers.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowersByUsername(e){return c(this,arguments,void 0,(function*(e,t=1,n=10){const i=w(`${v}/followers`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch following by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The following.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowingByUsername(e){return c(this,arguments,void 0,(function*(e,t=1,n=10){const i=w(`${v}/following`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch tweet by tweet ID.
     * @param {string} tweetId - The tweet ID.
     * @returns {Promise<object>} - The tweet.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetById(e){return c(this,void 0,void 0,(function*(){const t=w(`${v}/getTweetById`,{tweetId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch user by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The user data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(e){return c(this,arguments,void 0,(function*(e,t=1,n=10){const i=w(`${v}/wallet-twitter-data`,{walletAddress:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch reposted tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The reposted tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepostedByUsername(e){return c(this,arguments,void 0,(function*(e,t=1,n=10){const i=w(`${v}/reposted`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch replies by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The replies.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepliesByUsername(e){return c(this,arguments,void 0,(function*(e,t=1,n=10){const i=w(`${v}/replies`,{twitterUserName:e,page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch likes by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The likes.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchLikesByUsername(e){return c(this,arguments,void 0,(function*(e,t=1,n=10){const i=w(`${v}/event/likes/${e}`,{page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch follows by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The follows.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowsByUsername(e){return c(this,arguments,void 0,(function*(e,t=1,n=10){const i=w(`${v}/event/follows/${e}`,{page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch viewed tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The viewed tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchViewedTweetsByUsername(e){return c(this,arguments,void 0,(function*(e,t=1,n=10){const i=w(`${v}/event/viewed-tweets/${e}`,{page:t,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(e){return c(this,void 0,void 0,(function*(){if(!this.apiKey)throw new m("API key is required for fetching data",401);try{return yield f(e,{"x-api-key":this.apiKey})}catch(e){throw new m(e.message,e.statusCode)}}))}}
/**
 * The SpotifyAPI class.
 * @class
 */class g{
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
     */fetchSavedTracksById(e){return c(this,void 0,void 0,(function*(){const t=w(`${T}/save-tracks`,{spotifyId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the played tracks of a user by Spotify ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The played tracks.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchPlayedTracksById(e){return c(this,void 0,void 0,(function*(){const t=w(`${T}/played-tracks`,{spotifyId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the user's saved albums by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved albums.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedAlbumsById(e){return c(this,void 0,void 0,(function*(){const t=w(`${T}/saved-albums`,{spotifyId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the user's saved playlists by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved playlists.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedPlaylistsById(e){return c(this,void 0,void 0,(function*(){const t=w(`${T}/saved-playlists`,{spotifyId:e});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the tracks of an album by album ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} albumId - The album ID.
     * @returns {Promise<object>} - The tracks in the album.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInAlbum(e,t){return c(this,void 0,void 0,(function*(){const n=w(`${T}/album/tracks`,{spotifyId:e,albumId:t});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch the tracks in a playlist by playlist ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} playlistId - The playlist ID.
     * @returns {Promise<object>} - The tracks in the playlist.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInPlaylist(e,t){return c(this,void 0,void 0,(function*(){const n=w(`${T}/playlist/tracks`,{spotifyId:e,playlistId:t});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch the user's Spotify data by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @returns {Promise<object>} - The user's Spotify data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(e){return c(this,void 0,void 0,(function*(){const t=w(`${T}/wallet-spotify-data`,{walletAddress:e});return this._fetchDataWithAuth(t)}))}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(e){return c(this,void 0,void 0,(function*(){if(!this.apiKey)throw new m("API key is required for fetching data",401);try{return yield f(e,{"x-api-key":this.apiKey})}catch(e){throw new m(e.message,e.statusCode)}}))}}const I={id:123420001114,name:"Basecamp",nativeCurrency:{decimals:18,name:"Camp",symbol:"CAMP"},rpcUrls:{default:{http:["https://rpc-campnetwork.xyz","https://rpc.basecamp.t.raas.gelato.cloud"]}},blockExplorers:{default:{name:"Explorer",url:"https://basecamp.cloud.blockscout.com/"}}};
// @ts-ignore
let k=null,A=null;const C=()=>(A||(A=i({chain:I,transport:a()})),A);var E="Connect with Camp Network",x="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",M={USER_CONNECTED:"ed42542d-b676-4112-b6d9-6db98048b2e0",USER_DISCONNECTED:"20af31ac-e602-442e-9e0e-b589f4dd4016",TWITTER_LINKED:"7fbea086-90ef-4679-ba69-f47f9255b34c",DISCORD_LINKED:"d73f5ae3-a8e8-48f2-8532-85e0c7780d6a",SPOTIFY_LINKED:"fc1788b4-c984-42c8-96f4-c87f6bb0b8f7",TIKTOK_LINKED:"4a2ffdd3-f0e9-4784-8b49-ff76ec1c0a6a",TELEGRAM_LINKED:"9006bc5d-bcc9-4d01-a860-4f1a201e8e47"},S="0xF90733b9eCDa3b49C250B2C3E3E42c96fC93324E",$="0x5c5e6b458b2e3924E7688b8Dee1Bb49088F6Fef5";let F=[];const O=()=>F,j=e=>{function t(t){F.some((e=>e.info.uuid===t.detail.info.uuid))||(F=[...F,t.detail],e(F))}if("undefined"!=typeof window)return window.addEventListener("eip6963:announceProvider",t),window.dispatchEvent(new Event("eip6963:requestProvider")),()=>window.removeEventListener("eip6963:announceProvider",t)};var P=[{inputs:[{internalType:"string",name:"name_",type:"string"},{internalType:"string",name:"symbol_",type:"string"},{internalType:"uint256",name:"maxTermDuration_",type:"uint256"},{internalType:"address",name:"signer_",type:"address"}],stateMutability:"nonpayable",type:"constructor"},{inputs:[],name:"DurationZero",type:"error"},{inputs:[{internalType:"address",name:"sender",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"address",name:"owner",type:"address"}],name:"ERC721IncorrectOwner",type:"error"},{inputs:[{internalType:"address",name:"operator",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"ERC721InsufficientApproval",type:"error"},{inputs:[{internalType:"address",name:"approver",type:"address"}],name:"ERC721InvalidApprover",type:"error"},{inputs:[{internalType:"address",name:"operator",type:"address"}],name:"ERC721InvalidOperator",type:"error"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"ERC721InvalidOwner",type:"error"},{inputs:[{internalType:"address",name:"receiver",type:"address"}],name:"ERC721InvalidReceiver",type:"error"},{inputs:[{internalType:"address",name:"sender",type:"address"}],name:"ERC721InvalidSender",type:"error"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"ERC721NonexistentToken",type:"error"},{inputs:[],name:"EnforcedPause",type:"error"},{inputs:[],name:"ExpectedPause",type:"error"},{inputs:[],name:"InvalidDeadline",type:"error"},{inputs:[],name:"InvalidDuration",type:"error"},{inputs:[{internalType:"uint16",name:"royaltyBps",type:"uint16"}],name:"InvalidRoyalty",type:"error"},{inputs:[],name:"InvalidSignature",type:"error"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"address",name:"caller",type:"address"}],name:"NotTokenOwner",type:"error"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"OwnableInvalidOwner",type:"error"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"OwnableUnauthorizedAccount",type:"error"},{inputs:[],name:"SignatureAlreadyUsed",type:"error"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"TokenAlreadyExists",type:"error"},{inputs:[],name:"Unauthorized",type:"error"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"buyer",type:"address"},{indexed:!1,internalType:"uint32",name:"periods",type:"uint32"},{indexed:!1,internalType:"uint256",name:"newExpiry",type:"uint256"},{indexed:!1,internalType:"uint256",name:"amountPaid",type:"uint256"}],name:"AccessPurchased",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"owner",type:"address"},{indexed:!0,internalType:"address",name:"approved",type:"address"},{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"}],name:"Approval",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"owner",type:"address"},{indexed:!0,internalType:"address",name:"operator",type:"address"},{indexed:!1,internalType:"bool",name:"approved",type:"bool"}],name:"ApprovalForAll",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"}],name:"DataDeleted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"bytes32",name:"contentHash",type:"bytes32"}],name:"DataMinted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"previousOwner",type:"address"},{indexed:!0,internalType:"address",name:"newOwner",type:"address"}],name:"OwnershipTransferred",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Paused",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint256",name:"royaltyAmount",type:"uint256"},{indexed:!1,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"uint256",name:"protocolAmount",type:"uint256"}],name:"RoyaltyPaid",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint128",name:"newPrice",type:"uint128"},{indexed:!1,internalType:"uint32",name:"newDuration",type:"uint32"},{indexed:!1,internalType:"uint16",name:"newRoyaltyBps",type:"uint16"},{indexed:!1,internalType:"address",name:"paymentToken",type:"address"}],name:"TermsUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"from",type:"address"},{indexed:!0,internalType:"address",name:"to",type:"address"},{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"}],name:"Transfer",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Unpaused",type:"event"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"approve",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"balanceOf",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"contentHash",outputs:[{internalType:"bytes32",name:"",type:"bytes32"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"dataStatus",outputs:[{internalType:"enum IpNFT.DataStatus",name:"",type:"uint8"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"finalizeDelete",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"getApproved",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"getTerms",outputs:[{components:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],internalType:"struct IpNFT.LicenseTerms",name:"",type:"tuple"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"owner",type:"address"},{internalType:"address",name:"operator",type:"address"}],name:"isApprovedForAll",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"maxTermDuration",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint256",name:"parentId",type:"uint256"},{internalType:"bytes32",name:"creatorContentHash",type:"bytes32"},{internalType:"string",name:"uri",type:"string"},{components:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],internalType:"struct IpNFT.LicenseTerms",name:"licenseTerms",type:"tuple"},{internalType:"uint256",name:"deadline",type:"uint256"},{internalType:"bytes",name:"signature",type:"bytes"}],name:"mintWithSignature",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"name",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[],name:"owner",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"ownerOf",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"parentIpOf",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"pause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"paused",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"renounceOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint256",name:"salePrice",type:"uint256"}],name:"royaltyInfo",outputs:[{internalType:"address",name:"receiver",type:"address"},{internalType:"uint256",name:"royaltyAmount",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"royaltyPercentages",outputs:[{internalType:"uint16",name:"",type:"uint16"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"royaltyReceivers",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"safeTransferFrom",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"bytes",name:"data",type:"bytes"}],name:"safeTransferFrom",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"operator",type:"address"},{internalType:"bool",name:"approved",type:"bool"}],name:"setApprovalForAll",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_signer",type:"address"}],name:"setSigner",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"signer",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"bytes4",name:"interfaceId",type:"bytes4"}],name:"supportsInterface",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"symbol",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"terms",outputs:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"_tokenId",type:"uint256"}],name:"tokenURI",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"transferFrom",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"newOwner",type:"address"}],name:"transferOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"unpause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"address",name:"_royaltyReceiver",type:"address"},{components:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],internalType:"struct IpNFT.LicenseTerms",name:"newTerms",type:"tuple"}],name:"updateTerms",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes32",name:"",type:"bytes32"}],name:"usedNonces",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"}];
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
 */function U(e,t,n,i,a,r,s,o){return c(this,void 0,void 0,(function*(){return yield this.callContractMethod(S,P,"mintWithSignature",[e,t,n,i,a,r,s,o],{waitForReceipt:!0})}))}
/**
 * Registers a Data NFT with the Origin service in order to obtain a signature for minting.
 * @param source The source of the Data NFT (e.g., "spotify", "twitter", "tiktok", or "file").
 * @param deadline The deadline for the registration operation.
 * @param fileKey Optional file key for file uploads.
 * @return A promise that resolves with the registration data.
 */function N(e,t,n,i,a,r){return c(this,void 0,void 0,(function*(){const s={source:e,deadline:Number(t),licenseTerms:{price:n.price.toString(),duration:n.duration,royaltyBps:n.royaltyBps,paymentToken:n.paymentToken},metadata:i,parentId:Number(r)||0};void 0!==a&&(s.fileKey=a);const o=yield fetch(`${x}/auth/origin/register`,{method:"POST",headers:{Authorization:`Bearer ${this.getJwt()}`,"Content-Type":"application/json"},body:JSON.stringify(s)});if(!o.ok)throw new Error(`Failed to get signature: ${o.statusText}`);const d=yield o.json();if(d.isError)throw new Error(`Failed to get signature: ${d.message}`);return d.data}))}function B(e,t,n){return this.callContractMethod(S,P,"updateTerms",[e,t,n],{waitForReceipt:!0})}function D(e){return this.callContractMethod(S,P,"finalizeDelete",[e])}function _(e){return this.callContractMethod(S,P,"getTerms",[e])}function R(e){return this.callContractMethod(S,P,"ownerOf",[e])}function W(e){return this.callContractMethod(S,P,"balanceOf",[e])}function q(e){return this.callContractMethod(S,P,"contentHash",[e])}function L(e){return this.callContractMethod(S,P,"tokenURI",[e])}function z(e){return this.callContractMethod(S,P,"dataStatus",[e])}function J(e,t){return c(this,void 0,void 0,(function*(){return this.callContractMethod(S,P,"royaltyInfo",[e,t])}))}function K(e){return this.callContractMethod(S,P,"getApproved",[e])}function H(e,t){return this.callContractMethod(S,P,"isApprovedForAll",[e,t])}function G(e,t,n){return this.callContractMethod(S,P,"transferFrom",[e,t,n])}function V(e,t,n,i){const a=i?[e,t,n,i]:[e,t,n];return this.callContractMethod(S,P,"safeTransferFrom",a)}function Z(e,t){return this.callContractMethod(S,P,"approve",[e,t])}function Y(e,t){return this.callContractMethod(S,P,"setApprovalForAll",[e,t])}var Q,X,ee,te,ne,ie,ae,re,se,oe,de,ue,le,pe,ce,ye=[{inputs:[{internalType:"address",name:"dataNFT_",type:"address"},{internalType:"uint16",name:"protocolFeeBps_",type:"uint16"},{internalType:"address",name:"treasury_",type:"address"}],stateMutability:"nonpayable",type:"constructor"},{inputs:[],name:"EnforcedPause",type:"error"},{inputs:[],name:"ExpectedPause",type:"error"},{inputs:[{internalType:"uint256",name:"expected",type:"uint256"},{internalType:"uint256",name:"actual",type:"uint256"}],name:"InvalidPayment",type:"error"},{inputs:[{internalType:"uint32",name:"periods",type:"uint32"}],name:"InvalidPeriods",type:"error"},{inputs:[{internalType:"uint16",name:"royaltyBps",type:"uint16"}],name:"InvalidRoyalty",type:"error"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"OwnableInvalidOwner",type:"error"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"OwnableUnauthorizedAccount",type:"error"},{inputs:[],name:"TransferFailed",type:"error"},{inputs:[],name:"Unauthorized",type:"error"},{inputs:[],name:"ZeroAddress",type:"error"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"buyer",type:"address"},{indexed:!1,internalType:"uint32",name:"periods",type:"uint32"},{indexed:!1,internalType:"uint256",name:"newExpiry",type:"uint256"},{indexed:!1,internalType:"uint256",name:"amountPaid",type:"uint256"}],name:"AccessPurchased",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"}],name:"DataDeleted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"bytes32",name:"contentHash",type:"bytes32"}],name:"DataMinted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"previousOwner",type:"address"},{indexed:!0,internalType:"address",name:"newOwner",type:"address"}],name:"OwnershipTransferred",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Paused",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint256",name:"royaltyAmount",type:"uint256"},{indexed:!1,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"uint256",name:"protocolAmount",type:"uint256"}],name:"RoyaltyPaid",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint128",name:"newPrice",type:"uint128"},{indexed:!1,internalType:"uint32",name:"newDuration",type:"uint32"},{indexed:!1,internalType:"uint16",name:"newRoyaltyBps",type:"uint16"},{indexed:!1,internalType:"address",name:"paymentToken",type:"address"}],name:"TermsUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Unpaused",type:"event"},{inputs:[{internalType:"address",name:"feeManager",type:"address"}],name:"addFeeManager",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"buyer",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint32",name:"periods",type:"uint32"}],name:"buyAccess",outputs:[],stateMutability:"payable",type:"function"},{inputs:[],name:"dataNFT",outputs:[{internalType:"contract IpNFT",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"}],name:"feeManagers",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"user",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"hasAccess",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"owner",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"pause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"paused",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"protocolFeeBps",outputs:[{internalType:"uint16",name:"",type:"uint16"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"feeManager",type:"address"}],name:"removeFeeManager",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"renounceOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"},{internalType:"address",name:"",type:"address"}],name:"subscriptionExpiry",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"newOwner",type:"address"}],name:"transferOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"treasury",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"unpause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint16",name:"newFeeBps",type:"uint16"}],name:"updateProtocolFee",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"newTreasury",type:"address"}],name:"updateTreasury",outputs:[],stateMutability:"nonpayable",type:"function"},{stateMutability:"payable",type:"receive"}];function he(e,t,n,i){return this.callContractMethod($,ye,"buyAccess",[e,t,n],{waitForReceipt:!0,value:i})}function me(e,t,n,i){return this.callContractMethod($,ye,"renewAccess",[e,t,n],void 0!==i?{value:i}:void 0)}function fe(e,t){return this.callContractMethod($,ye,"hasAccess",[e,t])}function we(e,t){return this.callContractMethod($,ye,"subscriptionExpiry",[e,t])}
/**
 * Approves a spender to spend a specified amount of tokens on behalf of the owner.
 * If the current allowance is less than the specified amount, it will perform the approval.
 * @param {ApproveParams} params - The parameters for the approval.
 */
/**
 * The Origin class
 * Handles the upload of files to Origin, as well as querying the user's stats
 */
class ve{constructor(t,n){Q.add(this),X.set(this,(e=>c(this,void 0,void 0,(function*(){try{const t=yield fetch(`${x}/auth/origin/upload-url`,{method:"POST",body:JSON.stringify({name:e.name,type:e.type}),headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!t.ok)throw new Error(`HTTP ${t.status}: ${t.statusText}`);const n=yield t.json();if(n.isError)throw new Error(n.message||"Failed to generate upload URL");return n.data}catch(e){throw console.error("Failed to generate upload URL:",e),e}})))),ee.set(this,((e,t)=>c(this,void 0,void 0,(function*(){try{const n=yield fetch(`${x}/auth/origin/update-status`,{method:"PATCH",body:JSON.stringify({status:t,fileKey:e}),headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!n.ok){const e=yield n.text().catch((()=>"Unknown error"));throw new Error(`HTTP ${n.status}: ${e}`)}return!0}catch(e){throw console.error("Failed to update origin status:",e),e}})))),this.uploadFile=(t,n)=>c(this,void 0,void 0,(function*(){let i;try{i=yield y(this,X,"f").call(this,t)}catch(e){throw console.error("Failed to generate upload URL:",e),new Error(`Failed to generate upload URL: ${e instanceof Error?e.message:String(e)}`)}if(!i)throw new Error("Failed to generate upload URL: No upload info returned");try{yield((t,n,i)=>new Promise(((a,r)=>{e.put(n,t,Object.assign({headers:{"Content-Type":t.type}},"undefined"!=typeof window&&"function"==typeof i?{onUploadProgress:e=>{if(e.total){const t=e.loaded/e.total*100;i(t)}}}:{})).then((e=>{a(e.data)})).catch((e=>{var t;const n=(null===(t=null==e?void 0:e.response)||void 0===t?void 0:t.data)||(null==e?void 0:e.message)||"Upload failed";r(n)}))})))(t,i.url,(null==n?void 0:n.progressCallback)||(()=>{}))}catch(e){try{yield y(this,ee,"f").call(this,i.key,"failed")}catch(e){console.error("Failed to update status to failed:",e)}const t=e instanceof Error?e.message:String(e);throw new Error(`Failed to upload file: ${t}`)}try{yield y(this,ee,"f").call(this,i.key,"success")}catch(e){console.error("Failed to update status to success:",e)}return i})),this.mintFile=(e,t,n,i,a)=>c(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");const r=yield this.uploadFile(e,a);if(!r||!r.key)throw new Error("Failed to upload file or get upload info.");const s=BigInt(Math.floor(Date.now()/1e3)+600),o=yield this.registerIpNFT("file",s,n,t,r.key,i),{tokenId:d,signerAddress:u,creatorContentHash:l,signature:p,uri:c}=o;// 10 minutes from now
if(!(d&&u&&l&&void 0!==p&&c))throw new Error("Failed to register IpNFT: Missing required fields in registration response.");const[y]=yield this.viemClient.request({method:"eth_requestAccounts",params:[]}),h=yield this.mintWithSignature(y,d,i||BigInt(0),l,c,n,s,p);if("0x1"!==h.status)throw new Error(`Minting failed with status: ${h.status}`);return d.toString()})),this.mintSocial=(e,t,n)=>c(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");const i=BigInt(Math.floor(Date.now()/1e3)+600),a=yield this.registerIpNFT(e,i,n,t),{tokenId:r,signerAddress:s,creatorContentHash:o,signature:d,uri:u}=a;// 10 minutes from now
if(!(r&&s&&o&&void 0!==d&&u))throw new Error("Failed to register Social IpNFT: Missing required fields in registration response.");const[l]=yield this.viemClient.request({method:"eth_requestAccounts",params:[]}),p=yield this.mintWithSignature(l,r,BigInt(0),// parentId is not applicable for social IpNFTs
o,u,n,i,d);if("0x1"!==p.status)throw new Error(`Minting Social IpNFT failed with status: ${p.status}`);return r.toString()})),this.getOriginUploads=()=>c(this,void 0,void 0,(function*(){const e=yield fetch(`${x}/auth/origin/files`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`}});if(!e.ok)return console.error("Failed to get origin uploads"),null;return(yield e.json()).data})),this.jwt=t,this.viemClient=n,
// DataNFT methods
this.mintWithSignature=U.bind(this),this.registerIpNFT=N.bind(this),this.updateTerms=B.bind(this),this.requestDelete=D.bind(this),this.getTerms=_.bind(this),this.ownerOf=R.bind(this),this.balanceOf=W.bind(this),this.contentHash=q.bind(this),this.tokenURI=L.bind(this),this.dataStatus=z.bind(this),this.royaltyInfo=J.bind(this),this.getApproved=K.bind(this),this.isApprovedForAll=H.bind(this),this.transferFrom=G.bind(this),this.safeTransferFrom=V.bind(this),this.approve=Z.bind(this),this.setApprovalForAll=Y.bind(this),
// Marketplace methods
this.buyAccess=he.bind(this),this.renewAccess=me.bind(this),this.hasAccess=fe.bind(this),this.subscriptionExpiry=we.bind(this)}getJwt(){return this.jwt}setViemClient(e){this.viemClient=e}
/**
     * Get the user's Origin stats (multiplier, consent, usage, etc.).
     * @returns {Promise<OriginUsageReturnType>} A promise that resolves with the user's Origin stats.
     */getOriginUsage(){return c(this,void 0,void 0,(function*(){const e=yield fetch(`${x}/auth/origin/usage`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"}}).then((e=>e.json()));if(!e.isError&&e.data.user)return e;throw new m(e.message||"Failed to fetch Origin usage")}))}
/**
     * Set the user's consent for Origin usage.
     * @param {boolean} consent The user's consent.
     * @returns {Promise<void>}
     * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the consent is not provided.
     */setOriginConsent(e){return c(this,void 0,void 0,(function*(){if(void 0===e)throw new m("Consent is required");const t=yield fetch(`${x}/auth/origin/status`,{method:"PATCH",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"},body:JSON.stringify({active:e})}).then((e=>e.json()));if(t.isError)throw new m(t.message||"Failed to set Origin consent")}))}
/**
     * Set the user's Origin multiplier.
     * @param {number} multiplier The user's Origin multiplier.
     * @returns {Promise<void>}
     * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the multiplier is not provided.
     */setOriginMultiplier(e){return c(this,void 0,void 0,(function*(){if(void 0===e)throw new m("Multiplier is required");const t=yield fetch(`${x}/auth/origin/multiplier`,{method:"PATCH",headers:{Authorization:`Bearer ${this.jwt}`,
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
     */callContractMethod(e,t,n,i){return c(this,arguments,void 0,(function*(e,t,n,i,a={}){const r=s({abi:t,name:n}),d=r&&"stateMutability"in r&&("view"===r.stateMutability||"pure"===r.stateMutability);if(!d&&!this.viemClient)throw new Error("WalletClient not connected.");if(d){const a=C();return(yield a.readContract({address:e,abi:t,functionName:n,args:i}))||null}{const[r]=yield this.viemClient.request({method:"eth_requestAccounts",params:[]}),s=o({abi:t,functionName:n,args:i});yield y(this,Q,"m",ne).call(this,I);try{const t=yield this.viemClient.sendTransaction({to:e,data:s,account:r,value:a.value,gas:a.gas});if("string"!=typeof t)throw new Error("Transaction failed to send.");if(!a.waitForReceipt)return t;return yield y(this,Q,"m",te).call(this,t)}catch(e){throw console.error("Transaction failed:",e),new Error("Transaction failed: "+e)}}}))}
/**
     * Buy access to an asset by first checking its price via getTerms, then calling buyAccess.
     * @param {bigint} tokenId The token ID of the asset.
     * @param {number} periods The number of periods to buy access for.
     * @returns {Promise<any>} The result of the buyAccess call.
     */buyAccessSmart(e,t){return c(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");const n=yield this.getTerms(e);if(!n)throw new Error("Failed to fetch terms for asset");const{price:i,paymentToken:a}=n;if(void 0===i||void 0===a)throw new Error("Terms missing price or paymentToken");const[s]=yield this.viemClient.request({method:"eth_requestAccounts",params:[]}),o=i*BigInt(t);return a===d?this.buyAccess(s,e,t,o):(yield function(e){return c(this,arguments,void 0,(function*({walletClient:e,publicClient:t,tokenAddress:n,owner:i,spender:a,amount:s}){(yield t.readContract({address:n,abi:r,functionName:"allowance",args:[i,a]}))<s&&(yield e.writeContract({address:n,account:i,abi:r,functionName:"approve",args:[a,s],chain:I}))}))}({walletClient:this.viemClient,publicClient:C(),tokenAddress:a,owner:s,spender:$,amount:o}),this.buyAccess(s,e,t))}))}getData(e){return c(this,void 0,void 0,(function*(){const t=yield fetch(`${x}/auth/origin/data/${e}`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!t.ok)throw new Error("Failed to fetch data");return t.json()}))}}X=new WeakMap,ee=new WeakMap,Q=new WeakSet,te=function(e){return c(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");for(;;){const t=yield this.viemClient.request({method:"eth_getTransactionReceipt",params:[e]});if(t&&t.blockNumber)return t;yield new Promise((e=>setTimeout(e,1e3)))}}))},ne=function(e){return c(this,void 0,void 0,(function*(){
// return;
if(!this.viemClient)throw new Error("WalletClient not connected.");let t=yield this.viemClient.request({method:"eth_chainId",params:[]});if("string"==typeof t&&(t=parseInt(t,16)),t!==e.id)try{yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16)}]})}catch(t){
// Unrecognized chain
if(4902!==t.code)throw t;yield this.viemClient.request({method:"wallet_addEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16),chainName:e.name,rpcUrls:e.rpcUrls.default.http,nativeCurrency:e.nativeCurrency}]}),yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16)}]})}}))};
/**
 * The Auth class.
 * @class
 * @classdesc The Auth class is used to authenticate the user.
 */
class Te{
/**
     * Constructor for the Auth class.
     * @param {object} options The options object.
     * @param {string} options.clientId The client ID.
     * @param {string|object} options.redirectUri The redirect URI used for oauth. Leave empty if you want to use the current URL. If you want different redirect URIs for different socials, pass an object with the socials as keys and the redirect URIs as values.
     * @param {boolean} [options.allowAnalytics=true] Whether to allow analytics to be sent.
     * @param {object} [options.ackeeInstance] The Ackee instance.
     * @throws {APIError} - Throws an error if the clientId is not provided.
     */
constructor({clientId:e,redirectUri:t,allowAnalytics:n=!0,ackeeInstance:i}){if(ie.add(this),ae.set(this,void 0),re.set(this,void 0),!e)throw new Error("clientId is required");this.viem=null,
// if (typeof window !== "undefined") {
//   if (window.ethereum) this.viem = getClient(window.ethereum);
// }
this.redirectUri=(e=>{const t=["twitter","discord","spotify"];return"object"==typeof e?t.reduce(((t,n)=>(t[n]=e[n]||("undefined"!=typeof window?window.location.href:""),t)),{}):"string"==typeof e?t.reduce(((t,n)=>(t[n]=e,t)),{}):e?{}:t.reduce(((e,t)=>(e[t]="undefined"!=typeof window?window.location.href:"",e)),{})})(t),i&&h(this,re,i,"f"),n&&y(this,re,"f"),this.clientId=e,this.isAuthenticated=!1,this.jwt=null,this.origin=null,this.walletAddress=null,this.userId=null,h(this,ae,{},"f"),j((e=>{y(this,ie,"m",se).call(this,"providers",e)})),y(this,ie,"m",oe).call(this)}
/**
     * Subscribe to an event. Possible events are "state", "provider", "providers", and "viem".
     * @param {("state"|"provider"|"providers"|"viem")} event The event.
     * @param {function} callback The callback function.
     * @returns {void}
     * @example
     * auth.on("state", (state) => {
     *  console.log(state);
     * });
     */on(e,t){y(this,ae,"f")[e]||(y(this,ae,"f")[e]=[]),y(this,ae,"f")[e].push(t),"providers"===e&&t(O())}
/**
     * Set the loading state.
     * @param {boolean} loading The loading state.
     * @returns {void}
     */setLoading(e){y(this,ie,"m",se).call(this,"state",e?"loading":this.isAuthenticated?"authenticated":"unauthenticated")}
/**
     * Set the provider. This is useful for setting the provider when the user selects a provider from the UI or when dApp wishes to use a specific provider.
     * @param {object} options The options object. Includes the provider and the provider info.
     * @returns {void}
     * @throws {APIError} - Throws an error if the provider is not provided.
     */setProvider({provider:e,info:i,address:a}){if(!e)throw new m("provider is required");this.viem=((e,i="window.ethereum",a)=>{var r;if(!e&&!k)return console.warn("Provider is required to create a client."),null;if(!k||k.transport.name!==i&&e||a!==(null===(r=k.account)||void 0===r?void 0:r.address)&&e){const r={chain:I,transport:t(e,{name:i})};a&&(r.account=l(a)),k=n(r)}return k})(e,i.name,a),this.origin&&this.origin.setViemClient(this.viem),
// TODO: only use one of these
y(this,ie,"m",se).call(this,"viem",this.viem),y(this,ie,"m",se).call(this,"provider",{provider:e,info:i}),localStorage.setItem("camp-sdk:provider",JSON.stringify(i))}
/**
     * Set the wallet address. This is useful for edge cases where the provider can't return the wallet address. Don't use this unless you know what you're doing.
     * @param {string} walletAddress The wallet address.
     * @returns {void}
     */setWalletAddress(e){this.walletAddress=e}recoverProvider(){return c(this,void 0,void 0,(function*(){var e,t,n,i,a,r,s,o,d,u,l,p,c,y,h;if(!this.walletAddress)return void console.warn("No wallet address found in local storage. Please connect your wallet again.");const m=JSON.parse(localStorage.getItem("camp-sdk:provider")||"{}");let f;const w=null!==(e=O())&&void 0!==e?e:[];
// first pass: try to find provider by UUID/name and check if it has the right address
// without prompting (using eth_accounts)
for(const e of w)try{if(m.uuid&&(null===(t=e.info)||void 0===t?void 0:t.uuid)===m.uuid||m.name&&(null===(n=e.info)||void 0===n?void 0:n.name)===m.name){
// silently check if the wallet address matches first
const t=yield e.provider.request({method:"eth_accounts"});if(t.length>0&&(null===(i=t[0])||void 0===i?void 0:i.toLowerCase())===(null===(a=this.walletAddress)||void 0===a?void 0:a.toLowerCase())){f=e;break}}}catch(e){console.warn("Failed to fetch accounts from provider:",e)}
// second pass: If no provider found by UUID/name match, try to find by address only
// but still avoid prompting
if(!f)for(const e of w)try{
// skip providers we already checked in the first pass
if(m.uuid&&(null===(r=e.info)||void 0===r?void 0:r.uuid)===m.uuid||m.name&&(null===(s=e.info)||void 0===s?void 0:s.name)===m.name)continue;const t=yield e.provider.request({method:"eth_accounts"});if(t.length>0&&(null===(o=t[0])||void 0===o?void 0:o.toLowerCase())===(null===(d=this.walletAddress)||void 0===d?void 0:d.toLowerCase())){f=e;break}}catch(e){console.warn("Failed to fetch accounts from provider:",e)}
// third pass: if still no provider found and we have UUID/name info,
// try prompting the user (only for the stored provider)
if(!f&&(m.uuid||m.name))for(const e of w)try{if(m.uuid&&(null===(u=e.info)||void 0===u?void 0:u.uuid)===m.uuid||m.name&&(null===(l=e.info)||void 0===l?void 0:l.name)===m.name){console.log("Attempting to reconnect to stored provider:",(null===(p=e.info)||void 0===p?void 0:p.name)||(null===(c=e.info)||void 0===c?void 0:c.uuid));const t=yield e.provider.request({method:"eth_requestAccounts"});if(t.length>0&&(null===(y=t[0])||void 0===y?void 0:y.toLowerCase())===(null===(h=this.walletAddress)||void 0===h?void 0:h.toLowerCase())){f=e;break}}}catch(e){console.warn("Failed to reconnect to stored provider:",e)}f?this.setProvider({provider:f.provider,info:f.info||{name:"Unknown"},address:this.walletAddress}):console.warn("No matching provider found for the stored wallet address. Please connect your wallet again.")}))}
/**
     * Disconnect the user.
     * @returns {Promise<void>}
     */disconnect(){return c(this,void 0,void 0,(function*(){this.isAuthenticated&&(y(this,ie,"m",se).call(this,"state","unauthenticated"),this.isAuthenticated=!1,this.walletAddress=null,this.userId=null,this.jwt=null,this.origin=null,localStorage.removeItem("camp-sdk:wallet-address"),localStorage.removeItem("camp-sdk:user-id"),localStorage.removeItem("camp-sdk:jwt"))}))}
/**
     * Connect the user's wallet and sign the message.
     * @returns {Promise<{ success: boolean; message: string; walletAddress: string }>} A promise that resolves with the authentication result.
     * @throws {APIError} - Throws an error if the user cannot be authenticated.
     */connect(){return c(this,void 0,void 0,(function*(){y(this,ie,"m",se).call(this,"state","loading");try{this.walletAddress||(yield y(this,ie,"m",de).call(this)),this.walletAddress=u(this.walletAddress);const e=yield y(this,ie,"m",ue).call(this),t=y(this,ie,"m",pe).call(this,e),n=yield this.viem.signMessage({account:this.walletAddress,message:t}),i=yield y(this,ie,"m",le).call(this,t,n);if(i.success)return this.isAuthenticated=!0,this.userId=i.userId,this.jwt=i.token,this.origin=new ve(this.jwt,this.viem),localStorage.setItem("camp-sdk:jwt",this.jwt),localStorage.setItem("camp-sdk:wallet-address",this.walletAddress),localStorage.setItem("camp-sdk:user-id",this.userId),y(this,ie,"m",se).call(this,"state","authenticated"),yield y(this,ie,"m",ce).call(this,M.USER_CONNECTED,"User Connected"),{success:!0,message:"Successfully authenticated",walletAddress:this.walletAddress};throw this.isAuthenticated=!1,y(this,ie,"m",se).call(this,"state","unauthenticated"),new m("Failed to authenticate")}catch(e){throw this.isAuthenticated=!1,y(this,ie,"m",se).call(this,"state","unauthenticated"),new m(e)}}))}
/**
     * Get the user's linked social accounts.
     * @returns {Promise<Record<string, boolean>>} A promise that resolves with the user's linked social accounts.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated or if the request fails.
     * @example
     * const auth = new Auth({ clientId: "your-client-id" });
     * const socials = await auth.getLinkedSocials();
     * console.log(socials);
     */getLinkedSocials(){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${x}/auth/client-user/connections-sdk`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"}}).then((e=>e.json()));if(e.isError)throw new m(e.message||"Failed to fetch connections");{const t={};return Object.keys(e.data.data).forEach((n=>{t[n.split("User")[0]]=e.data.data[n]})),t}}))}
/**
     * Link the user's Twitter account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkTwitter(){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");
// await this.#sendAnalyticsEvent(
//   constants.ACKEE_EVENTS.TWITTER_LINKED,
//   "Twitter Linked"
// );
window.location.href=`${x}/twitter/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.twitter}`}))}
/**
     * Link the user's Discord account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkDiscord(){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");
// await this.#sendAnalyticsEvent(
//   constants.ACKEE_EVENTS.DISCORD_LINKED,
//   "Discord Linked"
// );
window.location.href=`${x}/discord/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.discord}`}))}
/**
     * Link the user's Spotify account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkSpotify(){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");
// await this.#sendAnalyticsEvent(
//   constants.ACKEE_EVENTS.SPOTIFY_LINKED,
//   "Spotify Linked"
// );
window.location.href=`${x}/spotify/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.spotify}`}))}
/**
     * Link the user's TikTok account.
     * @param {string} handle The user's TikTok handle.
     * @returns {Promise<any>} A promise that resolves with the TikTok account data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */linkTikTok(e){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const t=yield fetch(`${x}/tiktok/connect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userHandle:e,clientId:this.clientId,userId:this.userId})}).then((e=>e.json()));if(t.isError)throw"Request failed with status code 502"===t.message?new m("TikTok service is currently unavailable, try again later"):new m(t.message||"Failed to link TikTok account");return y(this,ie,"m",ce).call(this,M.TIKTOK_LINKED,"TikTok Linked"),t.data}))}
/**
     * Send an OTP to the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @returns {Promise<any>} A promise that resolves with the OTP data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */sendTelegramOTP(e){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!e)throw new m("Phone number is required");yield this.unlinkTelegram();const t=yield fetch(`${x}/telegram/sendOTP-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:e})}).then((e=>e.json()));if(t.isError)throw new m(t.message||"Failed to send Telegram OTP");return t.data}))}
/**
     * Link the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @param {string} otp The OTP.
     * @param {string} phoneCodeHash The phone code hash.
     * @returns {Promise<object>} A promise that resolves with the Telegram account data.
     * @throws {APIError|Error} - Throws an error if the user is not authenticated. Also throws an error if the phone number, OTP, and phone code hash are not provided.
     */linkTelegram(e,t,n){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!e||!t||!n)throw new m("Phone number, OTP, and phone code hash are required");const i=yield fetch(`${x}/telegram/signIn-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:e,code:t,phone_code_hash:n,userId:this.userId,clientId:this.clientId})}).then((e=>e.json()));if(i.isError)throw new m(i.message||"Failed to link Telegram account");return y(this,ie,"m",ce).call(this,M.TELEGRAM_LINKED,"Telegram Linked"),i.data}))}
/**
     * Unlink the user's Twitter account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTwitter(){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${x}/twitter/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new m(e.message||"Failed to unlink Twitter account");return e.data}))}
/**
     * Unlink the user's Discord account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkDiscord(){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new m("User needs to be authenticated");const e=yield fetch(`${x}/discord/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new m(e.message||"Failed to unlink Discord account");return e.data}))}
/**
     * Unlink the user's Spotify account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkSpotify(){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new m("User needs to be authenticated");const e=yield fetch(`${x}/spotify/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new m(e.message||"Failed to unlink Spotify account");return e.data}))}
/**
     * Unlink the user's TikTok account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTikTok(){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new m("User needs to be authenticated");const e=yield fetch(`${x}/tiktok/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((e=>e.json()));if(e.isError)throw new m(e.message||"Failed to unlink TikTok account");return e.data}))}
/**
     * Unlink the user's Telegram account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTelegram(){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new m("User needs to be authenticated");const e=yield fetch(`${x}/telegram/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((e=>e.json()));if(e.isError)throw new m(e.message||"Failed to unlink Telegram account");return e.data}))}}ae=new WeakMap,re=new WeakMap,ie=new WeakSet,se=function(e,t){y(this,ae,"f")[e]&&y(this,ae,"f")[e].forEach((e=>e(t)))},oe=function(e){return c(this,void 0,void 0,(function*(){if("undefined"==typeof localStorage)return;const t=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:wallet-address"),n=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:user-id"),i=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:jwt");t&&n&&i?(this.walletAddress=t,this.userId=n,this.jwt=i,this.origin=new ve(this.jwt),this.isAuthenticated=!0,e?this.setProvider({provider:e.provider,info:e.info||{name:"Unknown"},address:t}):(console.warn("No matching provider was given for the stored wallet address. Trying to recover provider."),yield this.recoverProvider())):this.isAuthenticated=!1}))},de=function(){return c(this,void 0,void 0,(function*(){try{const[e]=yield this.viem.requestAddresses();return this.walletAddress=u(e),this.walletAddress}catch(e){throw new m(e)}}))},ue=function(){return c(this,void 0,void 0,(function*(){try{const e=yield fetch(`${x}/auth/client-user/nonce`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({walletAddress:this.walletAddress})}),t=yield e.json();return 200!==e.status?Promise.reject(t.message||"Failed to fetch nonce"):t.data}catch(e){throw new Error(e)}}))},le=function(e,t){return c(this,void 0,void 0,(function*(){try{const n=yield fetch(`${x}/auth/client-user/verify`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({message:e,signature:t,walletAddress:this.walletAddress})}),i=yield n.json(),a=i.data.split(".")[1],r=JSON.parse(atob(a));return{success:!i.isError,userId:r.id,token:i.data}}catch(e){throw new m(e)}}))},pe=function(e){return p({domain:window.location.host,address:this.walletAddress,statement:E,uri:window.location.origin,version:"1",chainId:this.viem.chain.id,nonce:e})},ce=function(e,t){return c(this,arguments,void 0,(function*(e,t,n=1){
// if (this.#ackeeInstance)
//   await sendAnalyticsEvent(this.#ackeeInstance, event, message, count);
// else return;
}))};export{Te as Auth,g as SpotifyAPI,b as TwitterAPI};
