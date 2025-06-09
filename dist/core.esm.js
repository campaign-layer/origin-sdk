import t from"axios";import{custom as e,createWalletClient as n,createPublicClient as i,http as a,getAbiItem as r,encodeFunctionData as s}from"viem";import{toAccount as o}from"viem/accounts";import{createSiweMessage as d}from"viem/siwe";
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
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */function u(t,e,n,i){return new(n||(n=Promise))((function(a,r){function s(t){try{d(i.next(t))}catch(t){r(t)}}function o(t){try{d(i.throw(t))}catch(t){r(t)}}function d(t){var e;t.done?a(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(s,o)}d((i=i.apply(t,e||[])).next())}))}function l(t,e,n,i){if("a"===n&&!i)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof e?t!==e||!i:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===n?i:"a"===n?i.call(t):i?i.value:e.get(t)}function c(t,e,n,i,a){if("m"===i)throw new TypeError("Private method is not writable");if("a"===i&&!a)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof e?t!==e||!a:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===i?a.call(t,n):a?a.value=n:e.set(t,n),n}"function"==typeof SuppressedError&&SuppressedError;class p extends Error{constructor(t,e){super(t),this.name="APIError",this.statusCode=e||500,Error.captureStackTrace(this,this.constructor)}toJSON(){return{error:this.name,message:this.message,statusCode:this.statusCode||500}}}
/**
 * Makes a GET request to the given URL with the provided headers.
 *
 * @param {string} url - The URL to send the GET request to.
 * @param {object} headers - The headers to include in the request.
 * @returns {Promise<object>} - The response data.
 * @throws {APIError} - Throws an error if the request fails.
 */function h(e){return u(this,arguments,void 0,(function*(e,n={}){try{return(yield t.get(e,{headers:n})).data}catch(t){if(t.response)throw new p(t.response.data.message||"API request failed",t.response.status);throw new p("Network error or server is unavailable",500)}}))}
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
function y(t,e={}){const n=function(t={}){return Object.keys(t).map((e=>`${encodeURIComponent(e)}=${encodeURIComponent(t[e])}`)).join("&")}(e);return n?`${t}?${n}`:t}const m="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/twitter",f="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/spotify";
/**
 * The TwitterAPI class.
 * @class
 * @classdesc The TwitterAPI class is used to interact with the Twitter API.
 */
class w{
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
     */fetchUserByUsername(t){return u(this,void 0,void 0,(function*(){const e=y(`${m}/user`,{twitterUserName:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetsByUsername(t){return u(this,arguments,void 0,(function*(t,e=1,n=10){const i=y(`${m}/tweets`,{twitterUserName:t,page:e,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch followers by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The followers.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowersByUsername(t){return u(this,arguments,void 0,(function*(t,e=1,n=10){const i=y(`${m}/followers`,{twitterUserName:t,page:e,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch following by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The following.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowingByUsername(t){return u(this,arguments,void 0,(function*(t,e=1,n=10){const i=y(`${m}/following`,{twitterUserName:t,page:e,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch tweet by tweet ID.
     * @param {string} tweetId - The tweet ID.
     * @returns {Promise<object>} - The tweet.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetById(t){return u(this,void 0,void 0,(function*(){const e=y(`${m}/getTweetById`,{tweetId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch user by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The user data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(t){return u(this,arguments,void 0,(function*(t,e=1,n=10){const i=y(`${m}/wallet-twitter-data`,{walletAddress:t,page:e,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch reposted tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The reposted tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepostedByUsername(t){return u(this,arguments,void 0,(function*(t,e=1,n=10){const i=y(`${m}/reposted`,{twitterUserName:t,page:e,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch replies by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The replies.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepliesByUsername(t){return u(this,arguments,void 0,(function*(t,e=1,n=10){const i=y(`${m}/replies`,{twitterUserName:t,page:e,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch likes by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The likes.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchLikesByUsername(t){return u(this,arguments,void 0,(function*(t,e=1,n=10){const i=y(`${m}/event/likes/${t}`,{page:e,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch follows by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The follows.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowsByUsername(t){return u(this,arguments,void 0,(function*(t,e=1,n=10){const i=y(`${m}/event/follows/${t}`,{page:e,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch viewed tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The viewed tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchViewedTweetsByUsername(t){return u(this,arguments,void 0,(function*(t,e=1,n=10){const i=y(`${m}/event/viewed-tweets/${t}`,{page:e,limit:n});return this._fetchDataWithAuth(i)}))}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(t){return u(this,void 0,void 0,(function*(){if(!this.apiKey)throw new p("API key is required for fetching data",401);try{return yield h(t,{"x-api-key":this.apiKey})}catch(t){throw new p(t.message,t.statusCode)}}))}}
/**
 * The SpotifyAPI class.
 * @class
 */class v{
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
     */fetchSavedTracksById(t){return u(this,void 0,void 0,(function*(){const e=y(`${f}/save-tracks`,{spotifyId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch the played tracks of a user by Spotify ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The played tracks.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchPlayedTracksById(t){return u(this,void 0,void 0,(function*(){const e=y(`${f}/played-tracks`,{spotifyId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch the user's saved albums by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved albums.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedAlbumsById(t){return u(this,void 0,void 0,(function*(){const e=y(`${f}/saved-albums`,{spotifyId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch the user's saved playlists by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved playlists.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedPlaylistsById(t){return u(this,void 0,void 0,(function*(){const e=y(`${f}/saved-playlists`,{spotifyId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch the tracks of an album by album ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} albumId - The album ID.
     * @returns {Promise<object>} - The tracks in the album.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInAlbum(t,e){return u(this,void 0,void 0,(function*(){const n=y(`${f}/album/tracks`,{spotifyId:t,albumId:e});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch the tracks in a playlist by playlist ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} playlistId - The playlist ID.
     * @returns {Promise<object>} - The tracks in the playlist.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInPlaylist(t,e){return u(this,void 0,void 0,(function*(){const n=y(`${f}/playlist/tracks`,{spotifyId:t,playlistId:e});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch the user's Spotify data by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @returns {Promise<object>} - The user's Spotify data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(t){return u(this,void 0,void 0,(function*(){const e=y(`${f}/wallet-spotify-data`,{walletAddress:t});return this._fetchDataWithAuth(e)}))}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(t){return u(this,void 0,void 0,(function*(){if(!this.apiKey)throw new p("API key is required for fetching data",401);try{return yield h(t,{"x-api-key":this.apiKey})}catch(t){throw new p(t.message,t.statusCode)}}))}}const T={id:123420001114,name:"Basecamp",nativeCurrency:{decimals:18,name:"Camp",symbol:"CAMP"},rpcUrls:{default:{http:["https://rpc-campnetwork.xyz","https://rpc.basecamp.t.raas.gelato.cloud"]}},blockExplorers:{default:{name:"Explorer",url:"https://basecamp.cloud.blockscout.com/"}}};
// @ts-ignore
let g=null,b=null;const I=()=>(b||(b=i({chain:T,transport:a()})),b);var k="Connect with Camp Network",A="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",C={USER_CONNECTED:"ed42542d-b676-4112-b6d9-6db98048b2e0",USER_DISCONNECTED:"20af31ac-e602-442e-9e0e-b589f4dd4016",TWITTER_LINKED:"7fbea086-90ef-4679-ba69-f47f9255b34c",DISCORD_LINKED:"d73f5ae3-a8e8-48f2-8532-85e0c7780d6a",SPOTIFY_LINKED:"fc1788b4-c984-42c8-96f4-c87f6bb0b8f7",TIKTOK_LINKED:"4a2ffdd3-f0e9-4784-8b49-ff76ec1c0a6a",TELEGRAM_LINKED:"9006bc5d-bcc9-4d01-a860-4f1a201e8e47"},E="0xd064817Dc0Af032c3fb5dd4671fd10E0a5F0515D";let S=[];const $=()=>S,M=t=>{function e(e){S.some((t=>t.info.uuid===e.detail.info.uuid))||(S=[...S,e.detail],t(S))}if("undefined"!=typeof window)return window.addEventListener("eip6963:announceProvider",e),window.dispatchEvent(new Event("eip6963:requestProvider")),()=>window.removeEventListener("eip6963:announceProvider",e)};var j,x,U,D,O,P,N,_,F,B,W,R,q,z,L,K=[{type:"constructor",inputs:[{name:"_name",type:"string",internalType:"string"},{name:"_symbol",type:"string",internalType:"string"},{name:"_baseURI",type:"string",internalType:"string"}],stateMutability:"nonpayable"},{type:"function",name:"addCreator",inputs:[{name:"creator",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"addPauser",inputs:[{name:"pauser",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"approve",inputs:[{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"balanceOf",inputs:[{name:"owner_",type:"address",internalType:"address"}],outputs:[{name:"",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"baseURI",inputs:[],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"contentHash",inputs:[{name:"",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"bytes32",internalType:"bytes32"}],stateMutability:"view"},{type:"function",name:"creators",inputs:[{name:"",type:"address",internalType:"address"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"dataStatus",inputs:[{name:"",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"uint8",internalType:"enum DataNFT.DataStatus"}],stateMutability:"view"},{type:"function",name:"finalizeDelete",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"getApproved",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"getTerms",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"tuple",internalType:"struct DataNFT.LicenseTerms",components:[{name:"price",type:"uint128",internalType:"uint128"},{name:"duration",type:"uint32",internalType:"uint32"},{name:"royaltyBps",type:"uint16",internalType:"uint16"},{name:"paymentToken",type:"address",internalType:"address"}]}],stateMutability:"view"},{type:"function",name:"isApprovedForAll",inputs:[{name:"owner_",type:"address",internalType:"address"},{name:"operator",type:"address",internalType:"address"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"mintWithSignature",inputs:[{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"hash",type:"bytes32",internalType:"bytes32"},{name:"uri",type:"string",internalType:"string"},{name:"licenseTerms",type:"tuple",internalType:"struct DataNFT.LicenseTerms",components:[{name:"price",type:"uint128",internalType:"uint128"},{name:"duration",type:"uint32",internalType:"uint32"},{name:"royaltyBps",type:"uint16",internalType:"uint16"},{name:"paymentToken",type:"address",internalType:"address"}]},{name:"deadline",type:"uint256",internalType:"uint256"},{name:"v",type:"uint8",internalType:"uint8"},{name:"r",type:"bytes32",internalType:"bytes32"},{name:"s",type:"bytes32",internalType:"bytes32"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"name",inputs:[],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"owner",inputs:[],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"ownerOf",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"pause",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"paused",inputs:[],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"pausers",inputs:[{name:"",type:"address",internalType:"address"}],outputs:[{name:"",type:"bool",internalType:"bool"}],stateMutability:"view"},{type:"function",name:"removeCreator",inputs:[{name:"creator",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"removePauser",inputs:[{name:"pauser",type:"address",internalType:"address"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"requestDelete",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"royaltyInfo",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"salePrice",type:"uint256",internalType:"uint256"}],outputs:[{name:"receiver",type:"address",internalType:"address"},{name:"royaltyAmount",type:"uint256",internalType:"uint256"}],stateMutability:"view"},{type:"function",name:"royaltyPercentages",inputs:[{name:"",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"uint16",internalType:"uint16"}],stateMutability:"view"},{type:"function",name:"royaltyReceivers",inputs:[{name:"",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"safeTransferFrom",inputs:[{name:"from",type:"address",internalType:"address"},{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"safeTransferFrom",inputs:[{name:"from",type:"address",internalType:"address"},{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"data",type:"bytes",internalType:"bytes"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"setApprovalForAll",inputs:[{name:"operator",type:"address",internalType:"address"},{name:"approved",type:"bool",internalType:"bool"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"symbol",inputs:[],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"terms",inputs:[{name:"",type:"uint256",internalType:"uint256"}],outputs:[{name:"price",type:"uint128",internalType:"uint128"},{name:"duration",type:"uint32",internalType:"uint32"},{name:"royaltyBps",type:"uint16",internalType:"uint16"},{name:"paymentToken",type:"address",internalType:"address"}],stateMutability:"view"},{type:"function",name:"tokenURI",inputs:[{name:"",type:"uint256",internalType:"uint256"}],outputs:[{name:"",type:"string",internalType:"string"}],stateMutability:"view"},{type:"function",name:"transferFrom",inputs:[{name:"from",type:"address",internalType:"address"},{name:"to",type:"address",internalType:"address"},{name:"tokenId",type:"uint256",internalType:"uint256"}],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"unpause",inputs:[],outputs:[],stateMutability:"nonpayable"},{type:"function",name:"updateTerms",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"newTerms",type:"tuple",internalType:"struct DataNFT.LicenseTerms",components:[{name:"price",type:"uint128",internalType:"uint128"},{name:"duration",type:"uint32",internalType:"uint32"},{name:"royaltyBps",type:"uint16",internalType:"uint16"},{name:"paymentToken",type:"address",internalType:"address"}]}],outputs:[],stateMutability:"nonpayable"},{type:"event",name:"AccessPurchased",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"buyer",type:"address",indexed:!0,internalType:"address"},{name:"periods",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newExpiry",type:"uint64",indexed:!1,internalType:"uint64"},{name:"amountPaid",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"Approval",inputs:[{name:"owner",type:"address",indexed:!0,internalType:"address"},{name:"approved",type:"address",indexed:!0,internalType:"address"},{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"}],anonymous:!1},{type:"event",name:"ApprovalForAll",inputs:[{name:"owner",type:"address",indexed:!0,internalType:"address"},{name:"operator",type:"address",indexed:!0,internalType:"address"},{name:"approved",type:"bool",indexed:!1,internalType:"bool"}],anonymous:!1},{type:"event",name:"DataDeleted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"}],anonymous:!1},{type:"event",name:"DataDeletionRequested",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"}],anonymous:!1},{type:"event",name:"DataMinted",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"creator",type:"address",indexed:!0,internalType:"address"},{name:"contentHash",type:"bytes32",indexed:!1,internalType:"bytes32"}],anonymous:!1},{type:"event",name:"RoyaltyPaid",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"royaltyAmount",type:"uint256",indexed:!1,internalType:"uint256"},{name:"creator",type:"address",indexed:!1,internalType:"address"},{name:"protocolAmount",type:"uint256",indexed:!1,internalType:"uint256"}],anonymous:!1},{type:"event",name:"TermsUpdated",inputs:[{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"},{name:"newPrice",type:"uint128",indexed:!1,internalType:"uint128"},{name:"newDuration",type:"uint32",indexed:!1,internalType:"uint32"},{name:"newRoyaltyBps",type:"uint16",indexed:!1,internalType:"uint16"},{name:"paymentToken",type:"address",indexed:!1,internalType:"address"}],anonymous:!1},{type:"event",name:"Transfer",inputs:[{name:"from",type:"address",indexed:!0,internalType:"address"},{name:"to",type:"address",indexed:!0,internalType:"address"},{name:"tokenId",type:"uint256",indexed:!0,internalType:"uint256"}],anonymous:!1},{type:"error",name:"DurationZero",inputs:[]},{type:"error",name:"InvalidRoyalty",inputs:[{name:"royaltyBps",type:"uint16",internalType:"uint16"}]},{type:"error",name:"NotTokenOwner",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"},{name:"caller",type:"address",internalType:"address"}]},{type:"error",name:"TokenAlreadyExists",inputs:[{name:"tokenId",type:"uint256",internalType:"uint256"}]},{type:"error",name:"URIQueryForNonexistentToken",inputs:[]},{type:"error",name:"Unauthorized",inputs:[]},{type:"error",name:"Verifier_InvalidDeadline",inputs:[]},{type:"error",name:"Verifier_InvalidSignature",inputs:[]},{type:"error",name:"ZeroAddress",inputs:[]}];
/**
 * The Origin class
 * Handles the upload of files to Origin, as well as querying the user's stats
 */
class J{constructor(e,n){j.add(this),x.set(this,(t=>u(this,void 0,void 0,(function*(){const e=yield fetch(`${A}/auth/origin/upload-url`,{method:"POST",body:JSON.stringify({name:t.name,type:t.type}),headers:{Authorization:`Bearer ${this.jwt}`}}),n=yield e.json();return n.isError?n.message:n.data})))),U.set(this,((t,e)=>u(this,void 0,void 0,(function*(){(yield fetch(`${A}/auth/origin/update-status`,{method:"PATCH",body:JSON.stringify({status:e,fileKey:t}),headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}})).ok||console.error("Failed to update origin status")})))),this.uploadFile=(e,n)=>u(this,void 0,void 0,(function*(){const i=yield l(this,x,"f").call(this,e);if(i){try{yield((e,n,i)=>new Promise(((a,r)=>{t.put(n,e,Object.assign({headers:{"Content-Type":e.type}},"undefined"!=typeof window&&"function"==typeof i?{onUploadProgress:t=>{if(t.total){const e=t.loaded/t.total*100;i(e)}}}:{})).then((t=>{a(t.data)})).catch((t=>{var e;const n=(null===(e=null==t?void 0:t.response)||void 0===e?void 0:e.data)||(null==t?void 0:t.message)||"Upload failed";r(n)}))})))(e,i.url,(null==n?void 0:n.progressCallback)||(()=>{}))}catch(t){throw yield l(this,U,"f").call(this,i.key,"failed"),new Error("Failed to upload file: "+t)}yield l(this,U,"f").call(this,i.key,"success")}else console.error("Failed to generate upload URL")})),this.getOriginUploads=()=>u(this,void 0,void 0,(function*(){const t=yield fetch(`${A}/auth/origin/files`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`}});if(!t.ok)return console.error("Failed to get origin uploads"),null;return(yield t.json()).data})),this.jwt=e,this.viemClient=n}setViemClient(t){this.viemClient=t}
/**
     * Get the user's Origin stats (multiplier, consent, usage, etc.).
     * @returns {Promise<OriginUsageReturnType>} A promise that resolves with the user's Origin stats.
     */getOriginUsage(){return u(this,void 0,void 0,(function*(){const t=yield fetch(`${A}/auth/origin/usage`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"}}).then((t=>t.json()));if(!t.isError&&t.data.user)return t;throw new p(t.message||"Failed to fetch Origin usage")}))}
/**
     * Set the user's consent for Origin usage.
     * @param {boolean} consent The user's consent.
     * @returns {Promise<void>}
     * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the consent is not provided.
     */setOriginConsent(t){return u(this,void 0,void 0,(function*(){if(void 0===t)throw new p("Consent is required");const e=yield fetch(`${A}/auth/origin/status`,{method:"PATCH",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"},body:JSON.stringify({active:t})}).then((t=>t.json()));if(e.isError)throw new p(e.message||"Failed to set Origin consent")}))}
/**
     * Set the user's Origin multiplier.
     * @param {number} multiplier The user's Origin multiplier.
     * @returns {Promise<void>}
     * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the multiplier is not provided.
     */setOriginMultiplier(t){return u(this,void 0,void 0,(function*(){if(void 0===t)throw new p("Multiplier is required");const e=yield fetch(`${A}/auth/origin/multiplier`,{method:"PATCH",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"},body:JSON.stringify({multiplier:t})}).then((t=>t.json()));if(e.isError)throw new p(e.message||"Failed to set Origin multiplier")}))}
/**
     * Call a contract method.
     * @param {string} contractAddress The contract address.
     * @param {Abi} abi The contract ABI.
     * @param {string} methodName The method name.
     * @param {any[]} params The method parameters.
     * @param {CallOptions} [options] The call options.
     * @returns {Promise<any>} A promise that resolves with the result of the contract call or transaction hash.
     * @throws {Error} - Throws an error if the wallet client is not connected and the method is not a view function.
     */callContractMethod(t,e,n,i){return u(this,arguments,void 0,(function*(t,e,n,i,a={}){const o=r({abi:e,name:n}),d=o&&"stateMutability"in o&&("view"===o.stateMutability||"pure"===o.stateMutability);if(!d&&!this.viemClient)throw new Error("WalletClient not connected.");if(d){const a=I();return(yield a.readContract({address:t,abi:e,functionName:n,args:i}))||null}{const[r]=yield this.viemClient.getAddresses(),o=s({abi:e,functionName:n,args:i});yield l(this,j,"m",O).call(this,T);const d=yield this.viemClient.sendTransaction({to:t,data:o,account:r,value:a.value,gas:a.gas});if(a.waitForReceipt){return yield l(this,j,"m",D).call(this,d)}return d}}))}}x=new WeakMap,U=new WeakMap,j=new WeakSet,D=function(t){return u(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");for(;;){const e=yield this.viemClient.request({method:"eth_getTransactionReceipt",params:[t]});if(e&&e.blockNumber)return e;yield new Promise((t=>setTimeout(t,1e3)))}}))},O=function(t){return u(this,void 0,void 0,(function*(){
// return;
if(!this.viemClient)throw new Error("WalletClient not connected.");let e=yield this.viemClient.request({method:"eth_chainId",params:[]});if("string"==typeof e&&(e=parseInt(e,16)),e!==t.id)try{yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(t.id).toString(16)}]})}catch(e){
// Unrecognized chain
if(4902!==e.code)throw e;yield this.viemClient.request({method:"wallet_addEthereumChain",params:[{chainId:"0x"+BigInt(t.id).toString(16),chainName:t.name,rpcUrls:t.rpcUrls.default.http,nativeCurrency:t.nativeCurrency}]}),yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(t.id).toString(16)}]})}}))},J.prototype.mintWithSignature=function(t,e,n,i,a,r,s){return this.callContractMethod(E,K,"mintWithSignature",[t,e,n,i,a,r,s.v,s.r,s.s])},J.prototype.updateTerms=function(t,e){return this.callContractMethod(E,K,"updateTerms",[t,e])},J.prototype.requestDelete=function(t){return this.callContractMethod(E,K,"requestDelete",[t])},J.prototype.getTerms=function(t){return this.callContractMethod(E,K,"getTerms",[t])},J.prototype.ownerOf=function(t){return this.callContractMethod(E,K,"ownerOf",[t])},J.prototype.balanceOf=function(t){return this.callContractMethod(E,K,"balanceOf",[t])},J.prototype.contentHash=function(t){return this.callContractMethod(E,K,"contentHash",[t])},J.prototype.tokenURI=function(t){return this.callContractMethod(E,K,"tokenURI",[t])},J.prototype.dataStatus=function(t){return this.callContractMethod(E,K,"dataStatus",[t])},J.prototype.royaltyInfo=function(t,e){return u(this,void 0,void 0,(function*(){return this.callContractMethod(E,K,"royaltyInfo",[t,e])}))},J.prototype.getApproved=function(t){return this.callContractMethod(E,K,"getApproved",[t])},J.prototype.isApprovedForAll=function(t,e){return this.callContractMethod(E,K,"isApprovedForAll",[t,e])},J.prototype.transferFrom=function(t,e,n){return this.callContractMethod(E,K,"transferFrom",[t,e,n])},J.prototype.safeTransferFrom=function(t,e,n,i){const a=i?[t,e,n,i]:[t,e,n];return this.callContractMethod(E,K,"safeTransferFrom",a)},J.prototype.approve=function(t,e){return this.callContractMethod(E,K,"approve",[t,e])},J.prototype.setApprovalForAll=function(t,e){return this.callContractMethod(E,K,"setApprovalForAll",[t,e])};
/**
 * The Auth class.
 * @class
 * @classdesc The Auth class is used to authenticate the user.
 */
class H{
/**
     * Constructor for the Auth class.
     * @param {object} options The options object.
     * @param {string} options.clientId The client ID.
     * @param {string|object} options.redirectUri The redirect URI used for oauth. Leave empty if you want to use the current URL. If you want different redirect URIs for different socials, pass an object with the socials as keys and the redirect URIs as values.
     * @param {boolean} [options.allowAnalytics=true] Whether to allow analytics to be sent.
     * @param {object} [options.ackeeInstance] The Ackee instance.
     * @throws {APIError} - Throws an error if the clientId is not provided.
     */
constructor({clientId:t,redirectUri:e,allowAnalytics:n=!0,ackeeInstance:i}){if(P.add(this),N.set(this,void 0),_.set(this,void 0),!t)throw new Error("clientId is required");this.viem=null,
// if (typeof window !== "undefined") {
//   if (window.ethereum) this.viem = getClient(window.ethereum);
// }
this.redirectUri=(t=>{const e=["twitter","discord","spotify"];return"object"==typeof t?e.reduce(((e,n)=>(e[n]=t[n]||("undefined"!=typeof window?window.location.href:""),e)),{}):"string"==typeof t?e.reduce(((e,n)=>(e[n]=t,e)),{}):t?{}:e.reduce(((t,e)=>(t[e]="undefined"!=typeof window?window.location.href:"",t)),{})})(e),i&&c(this,_,i,"f"),n&&l(this,_,"f"),this.clientId=t,this.isAuthenticated=!1,this.jwt=null,this.origin=null,this.walletAddress=null,this.userId=null,c(this,N,{},"f"),M((t=>{l(this,P,"m",F).call(this,"providers",t)})),l(this,P,"m",B).call(this)}
/**
     * Subscribe to an event. Possible events are "state", "provider", "providers", and "viem".
     * @param {("state"|"provider"|"providers"|"viem")} event The event.
     * @param {function} callback The callback function.
     * @returns {void}
     * @example
     * auth.on("state", (state) => {
     *  console.log(state);
     * });
     */on(t,e){l(this,N,"f")[t]||(l(this,N,"f")[t]=[]),l(this,N,"f")[t].push(e),"providers"===t&&e($())}
/**
     * Set the loading state.
     * @param {boolean} loading The loading state.
     * @returns {void}
     */setLoading(t){l(this,P,"m",F).call(this,"state",t?"loading":this.isAuthenticated?"authenticated":"unauthenticated")}
/**
     * Set the provider. This is useful for setting the provider when the user selects a provider from the UI or when dApp wishes to use a specific provider.
     * @param {object} options The options object. Includes the provider and the provider info.
     * @returns {void}
     * @throws {APIError} - Throws an error if the provider is not provided.
     */setProvider({provider:t,info:i,address:a}){if(!t)throw new p("provider is required");this.viem=((t,i="window.ethereum",a)=>{var r;if(!t&&!g)return console.warn("Provider is required to create a client."),null;if(!g||g.transport.name!==i&&t||a!==(null===(r=g.account)||void 0===r?void 0:r.address)&&t){const r={chain:T,transport:e(t,{name:i})};a&&(r.account=o(a)),g=n(r)}return g})(t,i.name,a),this.origin&&this.origin.setViemClient(this.viem),l(this,P,"m",F).call(this,"viem",this.viem),l(this,P,"m",F).call(this,"provider",{provider:t,info:i})}
/**
     * Set the wallet address. This is useful for edge cases where the provider can't return the wallet address. Don't use this unless you know what you're doing.
     * @param {string} walletAddress The wallet address.
     * @returns {void}
     */setWalletAddress(t){this.walletAddress=t}
/**
     * Disconnect the user.
     * @returns {Promise<void>}
     */disconnect(){return u(this,void 0,void 0,(function*(){this.isAuthenticated&&(this.isAuthenticated=!1,this.walletAddress=null,this.userId=null,this.jwt=null,this.origin=null,localStorage.removeItem("camp-sdk:wallet-address"),localStorage.removeItem("camp-sdk:user-id"),localStorage.removeItem("camp-sdk:jwt"),l(this,P,"m",F).call(this,"state","unauthenticated"),yield l(this,P,"m",L).call(this,C.USER_DISCONNECTED,"User Disconnected"))}))}
/**
     * Connect the user's wallet and sign the message.
     * @returns {Promise<{ success: boolean; message: string; walletAddress: string }>} A promise that resolves with the authentication result.
     * @throws {APIError} - Throws an error if the user cannot be authenticated.
     */connect(){return u(this,void 0,void 0,(function*(){l(this,P,"m",F).call(this,"state","loading");try{this.walletAddress||(yield l(this,P,"m",W).call(this));const t=yield l(this,P,"m",R).call(this),e=l(this,P,"m",z).call(this,t),n=yield this.viem.signMessage({account:this.walletAddress,message:e}),i=yield l(this,P,"m",q).call(this,e,n);if(i.success)return this.isAuthenticated=!0,this.userId=i.userId,this.jwt=i.token,this.origin=new J(this.jwt,this.viem),localStorage.setItem("camp-sdk:jwt",this.jwt),localStorage.setItem("camp-sdk:wallet-address",this.walletAddress),localStorage.setItem("camp-sdk:user-id",this.userId),l(this,P,"m",F).call(this,"state","authenticated"),yield l(this,P,"m",L).call(this,C.USER_CONNECTED,"User Connected"),{success:!0,message:"Successfully authenticated",walletAddress:this.walletAddress};throw this.isAuthenticated=!1,l(this,P,"m",F).call(this,"state","unauthenticated"),new p("Failed to authenticate")}catch(t){throw this.isAuthenticated=!1,l(this,P,"m",F).call(this,"state","unauthenticated"),new p(t)}}))}
/**
     * Get the user's linked social accounts.
     * @returns {Promise<Record<string, boolean>>} A promise that resolves with the user's linked social accounts.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated or if the request fails.
     * @example
     * const auth = new Auth({ clientId: "your-client-id" });
     * const socials = await auth.getLinkedSocials();
     * console.log(socials);
     */getLinkedSocials(){return u(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const t=yield fetch(`${A}/auth/client-user/connections-sdk`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"}}).then((t=>t.json()));if(t.isError)throw new p(t.message||"Failed to fetch connections");{const e={};return Object.keys(t.data.data).forEach((n=>{e[n.split("User")[0]]=t.data.data[n]})),e}}))}
/**
     * Link the user's Twitter account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkTwitter(){return u(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");
// await this.#sendAnalyticsEvent(
//   constants.ACKEE_EVENTS.TWITTER_LINKED,
//   "Twitter Linked"
// );
window.location.href=`${A}/twitter/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.twitter}`}))}
/**
     * Link the user's Discord account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkDiscord(){return u(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");
// await this.#sendAnalyticsEvent(
//   constants.ACKEE_EVENTS.DISCORD_LINKED,
//   "Discord Linked"
// );
window.location.href=`${A}/discord/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.discord}`}))}
/**
     * Link the user's Spotify account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkSpotify(){return u(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");
// await this.#sendAnalyticsEvent(
//   constants.ACKEE_EVENTS.SPOTIFY_LINKED,
//   "Spotify Linked"
// );
window.location.href=`${A}/spotify/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.spotify}`}))}
/**
     * Link the user's TikTok account.
     * @param {string} handle The user's TikTok handle.
     * @returns {Promise<any>} A promise that resolves with the TikTok account data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */linkTikTok(t){return u(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${A}/tiktok/connect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userHandle:t,clientId:this.clientId,userId:this.userId})}).then((t=>t.json()));if(e.isError)throw"Request failed with status code 502"===e.message?new p("TikTok service is currently unavailable, try again later"):new p(e.message||"Failed to link TikTok account");return l(this,P,"m",L).call(this,C.TIKTOK_LINKED,"TikTok Linked"),e.data}))}
/**
     * Send an OTP to the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @returns {Promise<any>} A promise that resolves with the OTP data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */sendTelegramOTP(t){return u(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!t)throw new p("Phone number is required");yield this.unlinkTelegram();const e=yield fetch(`${A}/telegram/sendOTP-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:t})}).then((t=>t.json()));if(e.isError)throw new p(e.message||"Failed to send Telegram OTP");return e.data}))}
/**
     * Link the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @param {string} otp The OTP.
     * @param {string} phoneCodeHash The phone code hash.
     * @returns {Promise<object>} A promise that resolves with the Telegram account data.
     * @throws {APIError|Error} - Throws an error if the user is not authenticated. Also throws an error if the phone number, OTP, and phone code hash are not provided.
     */linkTelegram(t,e,n){return u(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!t||!e||!n)throw new p("Phone number, OTP, and phone code hash are required");const i=yield fetch(`${A}/telegram/signIn-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:t,code:e,phone_code_hash:n,userId:this.userId,clientId:this.clientId})}).then((t=>t.json()));if(i.isError)throw new p(i.message||"Failed to link Telegram account");return l(this,P,"m",L).call(this,C.TELEGRAM_LINKED,"Telegram Linked"),i.data}))}
/**
     * Unlink the user's Twitter account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTwitter(){return u(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const t=yield fetch(`${A}/twitter/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((t=>t.json()));if(t.isError)throw new p(t.message||"Failed to unlink Twitter account");return t.data}))}
/**
     * Unlink the user's Discord account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkDiscord(){return u(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new p("User needs to be authenticated");const t=yield fetch(`${A}/discord/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((t=>t.json()));if(t.isError)throw new p(t.message||"Failed to unlink Discord account");return t.data}))}
/**
     * Unlink the user's Spotify account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkSpotify(){return u(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new p("User needs to be authenticated");const t=yield fetch(`${A}/spotify/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((t=>t.json()));if(t.isError)throw new p(t.message||"Failed to unlink Spotify account");return t.data}))}
/**
     * Unlink the user's TikTok account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTikTok(){return u(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new p("User needs to be authenticated");const t=yield fetch(`${A}/tiktok/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((t=>t.json()));if(t.isError)throw new p(t.message||"Failed to unlink TikTok account");return t.data}))}
/**
     * Unlink the user's Telegram account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTelegram(){return u(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new p("User needs to be authenticated");const t=yield fetch(`${A}/telegram/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((t=>t.json()));if(t.isError)throw new p(t.message||"Failed to unlink Telegram account");return t.data}))}}N=new WeakMap,_=new WeakMap,P=new WeakSet,F=function(t,e){l(this,N,"f")[t]&&l(this,N,"f")[t].forEach((t=>t(e)))},B=function(t){return u(this,void 0,void 0,(function*(){var e,n;if("undefined"==typeof localStorage)return;const i=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:wallet-address"),a=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:user-id"),r=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:jwt");if(i&&a&&r){this.walletAddress=i,this.userId=a,this.jwt=r,this.origin=new J(this.jwt),this.isAuthenticated=!0;let s=t;if(!s){const t=null!==(e=$())&&void 0!==e?e:[];for(const e of t)try{if((null===(n=(yield e.provider.request({method:"eth_accounts"}))[0])||void 0===n?void 0:n.toLowerCase())===i.toLowerCase()){s=e.provider;break}}catch(t){console.warn("Failed to fetch accounts from provider:",t)}}s&&
// this.viem = getClient(
//   selectedProvider,
//   new Date().getTime().toString(),
//   walletAddress
// );
// this.#trigger("viem", this.viem);
this.setProvider({provider:s,info:{name:"reinitialized",version:"1.0.0"},address:i})}else this.isAuthenticated=!1}))},W=function(){return u(this,void 0,void 0,(function*(){try{const[t]=yield this.viem.requestAddresses();return this.walletAddress=t,t}catch(t){throw new p(t)}}))},R=function(){return u(this,void 0,void 0,(function*(){try{const t=yield fetch(`${A}/auth/client-user/nonce`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({walletAddress:this.walletAddress})}),e=yield t.json();return 200!==t.status?Promise.reject(e.message||"Failed to fetch nonce"):e.data}catch(t){throw new Error(t)}}))},q=function(t,e){return u(this,void 0,void 0,(function*(){try{const n=yield fetch(`${A}/auth/client-user/verify`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({message:t,signature:e,walletAddress:this.walletAddress})}),i=yield n.json(),a=i.data.split(".")[1],r=JSON.parse(atob(a));return{success:!i.isError,userId:r.id,token:i.data}}catch(t){throw new p(t)}}))},z=function(t){return d({domain:window.location.host,address:this.walletAddress,statement:k,uri:window.location.origin,version:"1",chainId:this.viem.chain.id,nonce:t})},L=function(t,e){return u(this,arguments,void 0,(function*(t,e,n=1){
// if (this.#ackeeInstance)
//   await sendAnalyticsEvent(this.#ackeeInstance, event, message, count);
// else return;
}))};export{H as Auth,v as SpotifyAPI,w as TwitterAPI};
