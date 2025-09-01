import e from"axios";import{custom as t,createWalletClient as n,createPublicClient as i,http as r,erc20Abi as a,getAbiItem as s,encodeFunctionData as o,zeroAddress as d,checksumAddress as u}from"viem";import{toAccount as l}from"viem/accounts";import{createSiweMessage as p}from"viem/siwe";
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
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */function c(e,t,n,i){return new(n||(n=Promise))((function(r,a){function s(e){try{d(i.next(e))}catch(e){a(e)}}function o(e){try{d(i.throw(e))}catch(e){a(e)}}function d(e){var t;e.done?r(e.value):(t=e.value,t instanceof n?t:new n((function(e){e(t)}))).then(s,o)}d((i=i.apply(e,t||[])).next())}))}function y(e,t,n,i){if("a"===n&&!i)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!i:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===n?i:"a"===n?i.call(e):i?i.value:t.get(e)}function h(e,t,n,i,r){if("m"===i)throw new TypeError("Private method is not writable");if("a"===i&&!r)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!r:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===i?r.call(e,n):r?r.value=n:t.set(e,n),n}"function"==typeof SuppressedError&&SuppressedError;class m extends Error{constructor(e,t){super(e),this.name="APIError",this.statusCode=t||500,Error.captureStackTrace(this,this.constructor)}toJSON(){return{error:this.name,message:this.message,statusCode:this.statusCode||500}}}class f extends Error{constructor(e){super(e),this.name="ValidationError",Error.captureStackTrace(this,this.constructor)}toJSON(){return{error:this.name,message:this.message,statusCode:400}}}
/**
 * Makes a GET request to the given URL with the provided headers.
 *
 * @param {string} url - The URL to send the GET request to.
 * @param {object} headers - The headers to include in the request.
 * @returns {Promise<object>} - The response data.
 * @throws {APIError} - Throws an error if the request fails.
 */function w(t){return c(this,arguments,void 0,(function*(t,n={}){try{return(yield e.get(t,{headers:n})).data}catch(e){if(e.response)throw new m(e.response.data.message||"API request failed",e.response.status);throw new m("Network error or server is unavailable",500)}}))}
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
function v(e,t={}){const n=function(e={}){return Object.keys(e).map((t=>`${encodeURIComponent(t)}=${encodeURIComponent(e[t])}`)).join("&")}(t);return n?`${e}?${n}`:e}const T="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/twitter",g="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/spotify";
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
constructor({apiKey:e}){if(!e||"string"!=typeof e||""===e.trim())throw new f("API key is required and must be a non-empty string");this.apiKey=e.trim()}
/**
     * Fetch Twitter user details by username.
     * @param {string} twitterUserName - The Twitter username.
     * @returns {Promise<object>} - The user details.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByUsername(e){return c(this,void 0,void 0,(function*(){if(!e||"string"!=typeof e||""===e.trim())throw new f("Twitter username is required and must be a non-empty string");const t=e.trim();
// Basic Twitter username validation (no @ symbol, alphanumeric + underscore)
if(!/^[a-zA-Z0-9_]{1,15}$/.test(t))throw new f("Invalid Twitter username format");const n=v(`${T}/user`,{twitterUserName:t});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetsByUsername(e){return c(this,arguments,void 0,(function*(e,t=1,n=10){if(!e||"string"!=typeof e||""===e.trim())throw new f("Twitter username is required and must be a non-empty string");const i=e.trim();if(!/^[a-zA-Z0-9_]{1,15}$/.test(i))throw new f("Invalid Twitter username format");if(!Number.isInteger(t)||t<1)throw new f("Page must be a positive integer");if(!Number.isInteger(n)||n<1||n>100)throw new f("Limit must be a positive integer between 1 and 100");const r=v(`${T}/tweets`,{twitterUserName:i,page:t,limit:n});return this._fetchDataWithAuth(r)}))}
/**
     * Fetch followers by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The followers.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowersByUsername(e){return c(this,arguments,void 0,(function*(e,t=1,n=10){const{validatedUsername:i,validatedPage:r,validatedLimit:a}=this._validateUsernamePageLimit(e,t,n),s=v(`${T}/followers`,{twitterUserName:i,page:r,limit:a});return this._fetchDataWithAuth(s)}))}
/**
     * Fetch following by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The following.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowingByUsername(e){return c(this,arguments,void 0,(function*(e,t=1,n=10){const{validatedUsername:i,validatedPage:r,validatedLimit:a}=this._validateUsernamePageLimit(e,t,n),s=v(`${T}/following`,{twitterUserName:i,page:r,limit:a});return this._fetchDataWithAuth(s)}))}
/**
     * Fetch tweet by tweet ID.
     * @param {string} tweetId - The tweet ID.
     * @returns {Promise<object>} - The tweet.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetById(e){return c(this,void 0,void 0,(function*(){if(!e||"string"!=typeof e||""===e.trim())throw new f("Tweet ID is required and must be a non-empty string");const t=e.trim();
// Basic tweet ID validation (should be numeric)
if(!/^\d+$/.test(t))throw new f("Invalid tweet ID format");const n=v(`${T}/getTweetById`,{tweetId:t});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch user by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The user data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(e){return c(this,arguments,void 0,(function*(e,t=1,n=10){if(!e||"string"!=typeof e||""===e.trim())throw new f("Wallet address is required and must be a non-empty string");const i=e.trim();if(!/^0x[a-fA-F0-9]{40}$/.test(i))throw new f("Invalid wallet address format");if(!Number.isInteger(t)||t<1)throw new f("Page must be a positive integer");if(!Number.isInteger(n)||n<1||n>100)throw new f("Limit must be a positive integer between 1 and 100");const r=v(`${T}/wallet-twitter-data`,{walletAddress:i,page:t,limit:n});return this._fetchDataWithAuth(r)}))}
/**
     * Fetch reposted tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The reposted tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepostedByUsername(e){return c(this,arguments,void 0,(function*(e,t=1,n=10){const{validatedUsername:i,validatedPage:r,validatedLimit:a}=this._validateUsernamePageLimit(e,t,n),s=v(`${T}/reposted`,{twitterUserName:i,page:r,limit:a});return this._fetchDataWithAuth(s)}))}
/**
     * Fetch replies by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The replies.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepliesByUsername(e){return c(this,arguments,void 0,(function*(e,t=1,n=10){const{validatedUsername:i,validatedPage:r,validatedLimit:a}=this._validateUsernamePageLimit(e,t,n),s=v(`${T}/replies`,{twitterUserName:i,page:r,limit:a});return this._fetchDataWithAuth(s)}))}
/**
     * Fetch likes by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The likes.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchLikesByUsername(e){return c(this,arguments,void 0,(function*(e,t=1,n=10){const{validatedUsername:i,validatedPage:r,validatedLimit:a}=this._validateUsernamePageLimit(e,t,n),s=v(`${T}/event/likes/${i}`,{page:r,limit:a});return this._fetchDataWithAuth(s)}))}
/**
     * Fetch follows by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The follows.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowsByUsername(e){return c(this,arguments,void 0,(function*(e,t=1,n=10){const{validatedUsername:i,validatedPage:r,validatedLimit:a}=this._validateUsernamePageLimit(e,t,n),s=v(`${T}/event/follows/${i}`,{page:r,limit:a});return this._fetchDataWithAuth(s)}))}
/**
     * Fetch viewed tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The viewed tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchViewedTweetsByUsername(e){return c(this,arguments,void 0,(function*(e,t=1,n=10){const{validatedUsername:i,validatedPage:r,validatedLimit:a}=this._validateUsernamePageLimit(e,t,n),s=v(`${T}/event/viewed-tweets/${i}`,{page:r,limit:a});return this._fetchDataWithAuth(s)}))}
/**
     * Private method to validate username, page, and limit parameters.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The limit number.
     * @returns {object} - Validated parameters.
     * @throws {ValidationError} - Throws an error if validation fails.
     */_validateUsernamePageLimit(e,t,n){if(!e||"string"!=typeof e||""===e.trim())throw new f("Twitter username is required and must be a non-empty string");const i=e.trim();if(!/^[a-zA-Z0-9_]{1,15}$/.test(i))throw new f("Invalid Twitter username format");if(!Number.isInteger(t)||t<1)throw new f("Page must be a positive integer");if(!Number.isInteger(n)||n<1||n>100)throw new f("Limit must be a positive integer between 1 and 100");return{validatedUsername:i,validatedPage:t,validatedLimit:n}}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(e){return c(this,void 0,void 0,(function*(){if(!this.apiKey)throw new m("API key is required for fetching data",401);try{return yield w(e,{"x-api-key":this.apiKey})}catch(e){throw new m(e.message,e.statusCode)}}))}}
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
constructor(e){if(!e||!e.apiKey||"string"!=typeof e.apiKey||""===e.apiKey.trim())throw new f("API key is required and must be a non-empty string");this.apiKey=e.apiKey.trim()}
/**
     * Fetch the user's saved tracks by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved tracks.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedTracksById(e){return c(this,void 0,void 0,(function*(){if(!e||"string"!=typeof e||""===e.trim())throw new f("Spotify ID is required and must be a non-empty string");const t=v(`${g}/save-tracks`,{spotifyId:e.trim()});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the played tracks of a user by Spotify ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The played tracks.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchPlayedTracksById(e){return c(this,void 0,void 0,(function*(){if(!e||"string"!=typeof e||""===e.trim())throw new f("Spotify ID is required and must be a non-empty string");const t=v(`${g}/played-tracks`,{spotifyId:e.trim()});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the user's saved albums by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved albums.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedAlbumsById(e){return c(this,void 0,void 0,(function*(){if(!e||"string"!=typeof e||""===e.trim())throw new f("Spotify ID is required and must be a non-empty string");const t=v(`${g}/saved-albums`,{spotifyId:e.trim()});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the user's saved playlists by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved playlists.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedPlaylistsById(e){return c(this,void 0,void 0,(function*(){if(!e||"string"!=typeof e||""===e.trim())throw new f("Spotify ID is required and must be a non-empty string");const t=v(`${g}/saved-playlists`,{spotifyId:e.trim()});return this._fetchDataWithAuth(t)}))}
/**
     * Fetch the tracks of an album by album ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} albumId - The album ID.
     * @returns {Promise<object>} - The tracks in the album.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInAlbum(e,t){return c(this,void 0,void 0,(function*(){if(!e||"string"!=typeof e||""===e.trim())throw new f("Spotify ID is required and must be a non-empty string");if(!t||"string"!=typeof t||""===t.trim())throw new f("Album ID is required and must be a non-empty string");const n=v(`${g}/album/tracks`,{spotifyId:e.trim(),albumId:t.trim()});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch the tracks in a playlist by playlist ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} playlistId - The playlist ID.
     * @returns {Promise<object>} - The tracks in the playlist.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInPlaylist(e,t){return c(this,void 0,void 0,(function*(){if(!e||"string"!=typeof e||""===e.trim())throw new f("Spotify ID is required and must be a non-empty string");if(!t||"string"!=typeof t||""===t.trim())throw new f("Playlist ID is required and must be a non-empty string");const n=v(`${g}/playlist/tracks`,{spotifyId:e.trim(),playlistId:t.trim()});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch the user's Spotify data by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @returns {Promise<object>} - The user's Spotify data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(e){return c(this,void 0,void 0,(function*(){if(!e||"string"!=typeof e||""===e.trim())throw new f("Wallet address is required and must be a non-empty string");
// Basic Ethereum address format validation
const t=e.trim();if(!/^0x[a-fA-F0-9]{40}$/.test(t))throw new f("Invalid wallet address format");const n=v(`${g}/wallet-spotify-data`,{walletAddress:t});return this._fetchDataWithAuth(n)}))}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(e){return c(this,void 0,void 0,(function*(){if(!this.apiKey)throw new m("API key is required for fetching data",401);try{return yield w(e,{"x-api-key":this.apiKey})}catch(e){throw new m(e.message,e.statusCode)}}))}}const A={id:123420001114,name:"Basecamp",nativeCurrency:{decimals:18,name:"Camp",symbol:"CAMP"},rpcUrls:{default:{http:["https://rpc-campnetwork.xyz","https://rpc.basecamp.t.raas.gelato.cloud"]}},blockExplorers:{default:{name:"Explorer",url:"https://basecamp.cloud.blockscout.com/"}}};
// @ts-ignore
let k=null,C=null;const E=()=>(C||(C=i({chain:A,transport:r()})),C);var x="Connect with Camp Network",M="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",S={USER_CONNECTED:"ed42542d-b676-4112-b6d9-6db98048b2e0",USER_DISCONNECTED:"20af31ac-e602-442e-9e0e-b589f4dd4016",TWITTER_LINKED:"7fbea086-90ef-4679-ba69-f47f9255b34c",DISCORD_LINKED:"d73f5ae3-a8e8-48f2-8532-85e0c7780d6a",SPOTIFY_LINKED:"fc1788b4-c984-42c8-96f4-c87f6bb0b8f7",TIKTOK_LINKED:"4a2ffdd3-f0e9-4784-8b49-ff76ec1c0a6a",TELEGRAM_LINKED:"9006bc5d-bcc9-4d01-a860-4f1a201e8e47"},P="0xF90733b9eCDa3b49C250B2C3E3E42c96fC93324E",$="0x5c5e6b458b2e3924E7688b8Dee1Bb49088F6Fef5";let U=[];const F=()=>U,O=e=>{function t(t){U.some((e=>e.info.uuid===t.detail.info.uuid))||(U=[...U,t.detail],e(U))}if("undefined"!=typeof window)return window.addEventListener("eip6963:announceProvider",t),window.dispatchEvent(new Event("eip6963:requestProvider")),()=>window.removeEventListener("eip6963:announceProvider",t)};var N=[{inputs:[{internalType:"string",name:"name_",type:"string"},{internalType:"string",name:"symbol_",type:"string"},{internalType:"uint256",name:"maxTermDuration_",type:"uint256"},{internalType:"address",name:"signer_",type:"address"}],stateMutability:"nonpayable",type:"constructor"},{inputs:[],name:"DurationZero",type:"error"},{inputs:[{internalType:"address",name:"sender",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"address",name:"owner",type:"address"}],name:"ERC721IncorrectOwner",type:"error"},{inputs:[{internalType:"address",name:"operator",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"ERC721InsufficientApproval",type:"error"},{inputs:[{internalType:"address",name:"approver",type:"address"}],name:"ERC721InvalidApprover",type:"error"},{inputs:[{internalType:"address",name:"operator",type:"address"}],name:"ERC721InvalidOperator",type:"error"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"ERC721InvalidOwner",type:"error"},{inputs:[{internalType:"address",name:"receiver",type:"address"}],name:"ERC721InvalidReceiver",type:"error"},{inputs:[{internalType:"address",name:"sender",type:"address"}],name:"ERC721InvalidSender",type:"error"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"ERC721NonexistentToken",type:"error"},{inputs:[],name:"EnforcedPause",type:"error"},{inputs:[],name:"ExpectedPause",type:"error"},{inputs:[],name:"InvalidDeadline",type:"error"},{inputs:[],name:"InvalidDuration",type:"error"},{inputs:[{internalType:"uint16",name:"royaltyBps",type:"uint16"}],name:"InvalidRoyalty",type:"error"},{inputs:[],name:"InvalidSignature",type:"error"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"address",name:"caller",type:"address"}],name:"NotTokenOwner",type:"error"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"OwnableInvalidOwner",type:"error"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"OwnableUnauthorizedAccount",type:"error"},{inputs:[],name:"SignatureAlreadyUsed",type:"error"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"TokenAlreadyExists",type:"error"},{inputs:[],name:"Unauthorized",type:"error"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"buyer",type:"address"},{indexed:!1,internalType:"uint32",name:"periods",type:"uint32"},{indexed:!1,internalType:"uint256",name:"newExpiry",type:"uint256"},{indexed:!1,internalType:"uint256",name:"amountPaid",type:"uint256"}],name:"AccessPurchased",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"owner",type:"address"},{indexed:!0,internalType:"address",name:"approved",type:"address"},{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"}],name:"Approval",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"owner",type:"address"},{indexed:!0,internalType:"address",name:"operator",type:"address"},{indexed:!1,internalType:"bool",name:"approved",type:"bool"}],name:"ApprovalForAll",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"}],name:"DataDeleted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"bytes32",name:"contentHash",type:"bytes32"}],name:"DataMinted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"previousOwner",type:"address"},{indexed:!0,internalType:"address",name:"newOwner",type:"address"}],name:"OwnershipTransferred",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Paused",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint256",name:"royaltyAmount",type:"uint256"},{indexed:!1,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"uint256",name:"protocolAmount",type:"uint256"}],name:"RoyaltyPaid",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint128",name:"newPrice",type:"uint128"},{indexed:!1,internalType:"uint32",name:"newDuration",type:"uint32"},{indexed:!1,internalType:"uint16",name:"newRoyaltyBps",type:"uint16"},{indexed:!1,internalType:"address",name:"paymentToken",type:"address"}],name:"TermsUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"from",type:"address"},{indexed:!0,internalType:"address",name:"to",type:"address"},{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"}],name:"Transfer",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Unpaused",type:"event"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"approve",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"balanceOf",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"contentHash",outputs:[{internalType:"bytes32",name:"",type:"bytes32"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"dataStatus",outputs:[{internalType:"enum IpNFT.DataStatus",name:"",type:"uint8"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"finalizeDelete",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"getApproved",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"getTerms",outputs:[{components:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],internalType:"struct IpNFT.LicenseTerms",name:"",type:"tuple"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"owner",type:"address"},{internalType:"address",name:"operator",type:"address"}],name:"isApprovedForAll",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"maxTermDuration",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint256",name:"parentId",type:"uint256"},{internalType:"bytes32",name:"creatorContentHash",type:"bytes32"},{internalType:"string",name:"uri",type:"string"},{components:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],internalType:"struct IpNFT.LicenseTerms",name:"licenseTerms",type:"tuple"},{internalType:"uint256",name:"deadline",type:"uint256"},{internalType:"bytes",name:"signature",type:"bytes"}],name:"mintWithSignature",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"name",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[],name:"owner",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"ownerOf",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"parentIpOf",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[],name:"pause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"paused",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"renounceOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint256",name:"salePrice",type:"uint256"}],name:"royaltyInfo",outputs:[{internalType:"address",name:"receiver",type:"address"},{internalType:"uint256",name:"royaltyAmount",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"royaltyPercentages",outputs:[{internalType:"uint16",name:"",type:"uint16"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"royaltyReceivers",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"safeTransferFrom",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"bytes",name:"data",type:"bytes"}],name:"safeTransferFrom",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"operator",type:"address"},{internalType:"bool",name:"approved",type:"bool"}],name:"setApprovalForAll",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"_signer",type:"address"}],name:"setSigner",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"signer",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"bytes4",name:"interfaceId",type:"bytes4"}],name:"supportsInterface",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"symbol",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"}],name:"terms",outputs:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"uint256",name:"_tokenId",type:"uint256"}],name:"tokenURI",outputs:[{internalType:"string",name:"",type:"string"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"from",type:"address"},{internalType:"address",name:"to",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"transferFrom",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"newOwner",type:"address"}],name:"transferOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"unpause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"address",name:"_royaltyReceiver",type:"address"},{components:[{internalType:"uint128",name:"price",type:"uint128"},{internalType:"uint32",name:"duration",type:"uint32"},{internalType:"uint16",name:"royaltyBps",type:"uint16"},{internalType:"address",name:"paymentToken",type:"address"}],internalType:"struct IpNFT.LicenseTerms",name:"newTerms",type:"tuple"}],name:"updateTerms",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"bytes32",name:"",type:"bytes32"}],name:"usedNonces",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"}];
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
 */function j(e,t,n,i,r,a,s,o){return c(this,void 0,void 0,(function*(){return yield this.callContractMethod(P,N,"mintWithSignature",[e,t,n,i,r,a,s,o],{waitForReceipt:!0})}))}
/**
 * Registers a Data NFT with the Origin service in order to obtain a signature for minting.
 * @param source The source of the Data NFT (e.g., "spotify", "twitter", "tiktok", or "file").
 * @param deadline The deadline for the registration operation.
 * @param fileKey Optional file key for file uploads.
 * @return A promise that resolves with the registration data.
 */function D(e,t,n,i,r,a){return c(this,void 0,void 0,(function*(){const s={source:e,deadline:Number(t),licenseTerms:{price:n.price.toString(),duration:n.duration,royaltyBps:n.royaltyBps,paymentToken:n.paymentToken},metadata:i,parentId:Number(a)||0};void 0!==r&&(s.fileKey=r);const o=yield fetch(`${M}/auth/origin/register`,{method:"POST",headers:{Authorization:`Bearer ${this.getJwt()}`,"Content-Type":"application/json"},body:JSON.stringify(s)});if(!o.ok)throw new Error(`Failed to get signature: ${o.statusText}`);const d=yield o.json();if(d.isError)throw new Error(`Failed to get signature: ${d.message}`);return d.data}))}function _(e,t,n){return this.callContractMethod(P,N,"updateTerms",[e,t,n],{waitForReceipt:!0})}function B(e){return this.callContractMethod(P,N,"finalizeDelete",[e])}function q(e){return this.callContractMethod(P,N,"getTerms",[e])}function L(e){return this.callContractMethod(P,N,"ownerOf",[e])}function W(e){return this.callContractMethod(P,N,"balanceOf",[e])}function R(e){return this.callContractMethod(P,N,"contentHash",[e])}function z(e){return this.callContractMethod(P,N,"tokenURI",[e])}function K(e){return this.callContractMethod(P,N,"dataStatus",[e])}function J(e,t){return c(this,void 0,void 0,(function*(){return this.callContractMethod(P,N,"royaltyInfo",[e,t])}))}function H(e){return this.callContractMethod(P,N,"getApproved",[e])}function G(e,t){return this.callContractMethod(P,N,"isApprovedForAll",[e,t])}function Z(e,t,n){return this.callContractMethod(P,N,"transferFrom",[e,t,n])}function V(e,t,n,i){const r=i?[e,t,n,i]:[e,t,n];return this.callContractMethod(P,N,"safeTransferFrom",r)}function Y(e,t){return this.callContractMethod(P,N,"approve",[e,t])}function Q(e,t){return this.callContractMethod(P,N,"setApprovalForAll",[e,t])}var X,ee,te,ne,ie,re,ae,se,oe,de,ue,le,pe,ce,ye,he=[{inputs:[{internalType:"address",name:"dataNFT_",type:"address"},{internalType:"uint16",name:"protocolFeeBps_",type:"uint16"},{internalType:"address",name:"treasury_",type:"address"}],stateMutability:"nonpayable",type:"constructor"},{inputs:[],name:"EnforcedPause",type:"error"},{inputs:[],name:"ExpectedPause",type:"error"},{inputs:[{internalType:"uint256",name:"expected",type:"uint256"},{internalType:"uint256",name:"actual",type:"uint256"}],name:"InvalidPayment",type:"error"},{inputs:[{internalType:"uint32",name:"periods",type:"uint32"}],name:"InvalidPeriods",type:"error"},{inputs:[{internalType:"uint16",name:"royaltyBps",type:"uint16"}],name:"InvalidRoyalty",type:"error"},{inputs:[{internalType:"address",name:"owner",type:"address"}],name:"OwnableInvalidOwner",type:"error"},{inputs:[{internalType:"address",name:"account",type:"address"}],name:"OwnableUnauthorizedAccount",type:"error"},{inputs:[],name:"TransferFailed",type:"error"},{inputs:[],name:"Unauthorized",type:"error"},{inputs:[],name:"ZeroAddress",type:"error"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"buyer",type:"address"},{indexed:!1,internalType:"uint32",name:"periods",type:"uint32"},{indexed:!1,internalType:"uint256",name:"newExpiry",type:"uint256"},{indexed:!1,internalType:"uint256",name:"amountPaid",type:"uint256"}],name:"AccessPurchased",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"}],name:"DataDeleted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!0,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"bytes32",name:"contentHash",type:"bytes32"}],name:"DataMinted",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"address",name:"previousOwner",type:"address"},{indexed:!0,internalType:"address",name:"newOwner",type:"address"}],name:"OwnershipTransferred",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Paused",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint256",name:"royaltyAmount",type:"uint256"},{indexed:!1,internalType:"address",name:"creator",type:"address"},{indexed:!1,internalType:"uint256",name:"protocolAmount",type:"uint256"}],name:"RoyaltyPaid",type:"event"},{anonymous:!1,inputs:[{indexed:!0,internalType:"uint256",name:"tokenId",type:"uint256"},{indexed:!1,internalType:"uint128",name:"newPrice",type:"uint128"},{indexed:!1,internalType:"uint32",name:"newDuration",type:"uint32"},{indexed:!1,internalType:"uint16",name:"newRoyaltyBps",type:"uint16"},{indexed:!1,internalType:"address",name:"paymentToken",type:"address"}],name:"TermsUpdated",type:"event"},{anonymous:!1,inputs:[{indexed:!1,internalType:"address",name:"account",type:"address"}],name:"Unpaused",type:"event"},{inputs:[{internalType:"address",name:"feeManager",type:"address"}],name:"addFeeManager",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"buyer",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"},{internalType:"uint32",name:"periods",type:"uint32"}],name:"buyAccess",outputs:[],stateMutability:"payable",type:"function"},{inputs:[],name:"dataNFT",outputs:[{internalType:"contract IpNFT",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"",type:"address"}],name:"feeManagers",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"user",type:"address"},{internalType:"uint256",name:"tokenId",type:"uint256"}],name:"hasAccess",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"owner",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"pause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"paused",outputs:[{internalType:"bool",name:"",type:"bool"}],stateMutability:"view",type:"function"},{inputs:[],name:"protocolFeeBps",outputs:[{internalType:"uint16",name:"",type:"uint16"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"feeManager",type:"address"}],name:"removeFeeManager",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"renounceOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint256",name:"",type:"uint256"},{internalType:"address",name:"",type:"address"}],name:"subscriptionExpiry",outputs:[{internalType:"uint256",name:"",type:"uint256"}],stateMutability:"view",type:"function"},{inputs:[{internalType:"address",name:"newOwner",type:"address"}],name:"transferOwnership",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[],name:"treasury",outputs:[{internalType:"address",name:"",type:"address"}],stateMutability:"view",type:"function"},{inputs:[],name:"unpause",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"uint16",name:"newFeeBps",type:"uint16"}],name:"updateProtocolFee",outputs:[],stateMutability:"nonpayable",type:"function"},{inputs:[{internalType:"address",name:"newTreasury",type:"address"}],name:"updateTreasury",outputs:[],stateMutability:"nonpayable",type:"function"},{stateMutability:"payable",type:"receive"}];function me(e,t,n,i){return this.callContractMethod($,he,"buyAccess",[e,t,n],{waitForReceipt:!0,value:i})}function fe(e,t,n,i){return this.callContractMethod($,he,"renewAccess",[e,t,n],void 0!==i?{value:i}:void 0)}function we(e,t){return this.callContractMethod($,he,"hasAccess",[e,t])}function ve(e,t){return this.callContractMethod($,he,"subscriptionExpiry",[e,t])}
/**
 * Approves a spender to spend a specified amount of tokens on behalf of the owner.
 * If the current allowance is less than the specified amount, it will perform the approval.
 * @param {ApproveParams} params - The parameters for the approval.
 */
/**
 * The Origin class
 * Handles the upload of files to Origin, as well as querying the user's stats
 */
class Te{constructor(t,n){X.add(this),ee.set(this,(e=>c(this,void 0,void 0,(function*(){try{const t=yield fetch(`${M}/auth/origin/upload-url`,{method:"POST",body:JSON.stringify({name:e.name,type:e.type}),headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!t.ok)throw new Error(`HTTP ${t.status}: ${t.statusText}`);const n=yield t.json();if(n.isError)throw new Error(n.message||"Failed to generate upload URL");return n.data}catch(e){throw console.error("Failed to generate upload URL:",e),e}})))),te.set(this,((e,t)=>c(this,void 0,void 0,(function*(){try{const n=yield fetch(`${M}/auth/origin/update-status`,{method:"PATCH",body:JSON.stringify({status:t,fileKey:e}),headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!n.ok){const e=yield n.text().catch((()=>"Unknown error"));throw new Error(`HTTP ${n.status}: ${e}`)}return!0}catch(e){throw console.error("Failed to update origin status:",e),e}})))),this.uploadFile=(t,n)=>c(this,void 0,void 0,(function*(){let i;try{i=yield y(this,ee,"f").call(this,t)}catch(e){throw console.error("Failed to generate upload URL:",e),new Error(`Failed to generate upload URL: ${e instanceof Error?e.message:String(e)}`)}if(!i)throw new Error("Failed to generate upload URL: No upload info returned");try{yield((t,n,i)=>new Promise(((r,a)=>{e.put(n,t,Object.assign({headers:{"Content-Type":t.type}},"undefined"!=typeof window&&"function"==typeof i?{onUploadProgress:e=>{if(e.total){const t=e.loaded/e.total*100;i(t)}}}:{})).then((e=>{r(e.data)})).catch((e=>{var t;const n=(null===(t=null==e?void 0:e.response)||void 0===t?void 0:t.data)||(null==e?void 0:e.message)||"Upload failed";a(n)}))})))(t,i.url,(null==n?void 0:n.progressCallback)||(()=>{}))}catch(e){try{yield y(this,te,"f").call(this,i.key,"failed")}catch(e){console.error("Failed to update status to failed:",e)}const t=e instanceof Error?e.message:String(e);throw new Error(`Failed to upload file: ${t}`)}try{yield y(this,te,"f").call(this,i.key,"success")}catch(e){console.error("Failed to update status to success:",e)}return i})),this.mintFile=(e,t,n,i,r)=>c(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");const a=yield this.uploadFile(e,r);if(!a||!a.key)throw new Error("Failed to upload file or get upload info.");const s=BigInt(Math.floor(Date.now()/1e3)+600),o=yield this.registerIpNFT("file",s,n,t,a.key,i),{tokenId:d,signerAddress:u,creatorContentHash:l,signature:p,uri:c}=o;// 10 minutes from now
if(!(d&&u&&l&&void 0!==p&&c))throw new Error("Failed to register IpNFT: Missing required fields in registration response.");const[y]=yield this.viemClient.request({method:"eth_requestAccounts",params:[]}),h=yield this.mintWithSignature(y,d,i||BigInt(0),l,c,n,s,p);if("0x1"!==h.status)throw new Error(`Minting failed with status: ${h.status}`);return d.toString()})),this.mintSocial=(e,t,n)=>c(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");const i=BigInt(Math.floor(Date.now()/1e3)+600),r=yield this.registerIpNFT(e,i,n,t),{tokenId:a,signerAddress:s,creatorContentHash:o,signature:d,uri:u}=r;// 10 minutes from now
if(!(a&&s&&o&&void 0!==d&&u))throw new Error("Failed to register Social IpNFT: Missing required fields in registration response.");const[l]=yield this.viemClient.request({method:"eth_requestAccounts",params:[]}),p=yield this.mintWithSignature(l,a,BigInt(0),// parentId is not applicable for social IpNFTs
o,u,n,i,d);if("0x1"!==p.status)throw new Error(`Minting Social IpNFT failed with status: ${p.status}`);return a.toString()})),this.getOriginUploads=()=>c(this,void 0,void 0,(function*(){const e=yield fetch(`${M}/auth/origin/files`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`}});if(!e.ok)return console.error("Failed to get origin uploads"),null;return(yield e.json()).data})),this.jwt=t,this.viemClient=n,
// DataNFT methods
this.mintWithSignature=j.bind(this),this.registerIpNFT=D.bind(this),this.updateTerms=_.bind(this),this.requestDelete=B.bind(this),this.getTerms=q.bind(this),this.ownerOf=L.bind(this),this.balanceOf=W.bind(this),this.contentHash=R.bind(this),this.tokenURI=z.bind(this),this.dataStatus=K.bind(this),this.royaltyInfo=J.bind(this),this.getApproved=H.bind(this),this.isApprovedForAll=G.bind(this),this.transferFrom=Z.bind(this),this.safeTransferFrom=V.bind(this),this.approve=Y.bind(this),this.setApprovalForAll=Q.bind(this),
// Marketplace methods
this.buyAccess=me.bind(this),this.renewAccess=fe.bind(this),this.hasAccess=we.bind(this),this.subscriptionExpiry=ve.bind(this)}getJwt(){return this.jwt}setViemClient(e){this.viemClient=e}
/**
     * Get the user's Origin stats (multiplier, consent, usage, etc.).
     * @returns {Promise<OriginUsageReturnType>} A promise that resolves with the user's Origin stats.
     */getOriginUsage(){return c(this,void 0,void 0,(function*(){const e=yield fetch(`${M}/auth/origin/usage`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"}}).then((e=>e.json()));if(!e.isError&&e.data.user)return e;throw new m(e.message||"Failed to fetch Origin usage")}))}
/**
     * Set the user's consent for Origin usage.
     * @param {boolean} consent The user's consent.
     * @returns {Promise<void>}
     * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the consent is not provided.
     */setOriginConsent(e){return c(this,void 0,void 0,(function*(){if(void 0===e)throw new m("Consent is required");const t=yield fetch(`${M}/auth/origin/status`,{method:"PATCH",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"},body:JSON.stringify({active:e})}).then((e=>e.json()));if(t.isError)throw new m(t.message||"Failed to set Origin consent")}))}
/**
     * Set the user's Origin multiplier.
     * @param {number} multiplier The user's Origin multiplier.
     * @returns {Promise<void>}
     * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the multiplier is not provided.
     */setOriginMultiplier(e){return c(this,void 0,void 0,(function*(){if(void 0===e)throw new m("Multiplier is required");const t=yield fetch(`${M}/auth/origin/multiplier`,{method:"PATCH",headers:{Authorization:`Bearer ${this.jwt}`,
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
     */callContractMethod(e,t,n,i){return c(this,arguments,void 0,(function*(e,t,n,i,r={}){const a=s({abi:t,name:n}),d=a&&"stateMutability"in a&&("view"===a.stateMutability||"pure"===a.stateMutability);if(!d&&!this.viemClient)throw new Error("WalletClient not connected.");if(d){const r=E();return(yield r.readContract({address:e,abi:t,functionName:n,args:i}))||null}{const[a]=yield this.viemClient.request({method:"eth_requestAccounts",params:[]}),s=o({abi:t,functionName:n,args:i});yield y(this,X,"m",ie).call(this,A);try{const t=yield this.viemClient.sendTransaction({to:e,data:s,account:a,value:r.value,gas:r.gas});if("string"!=typeof t)throw new Error("Transaction failed to send.");if(!r.waitForReceipt)return t;return yield y(this,X,"m",ne).call(this,t)}catch(e){throw console.error("Transaction failed:",e),new Error("Transaction failed: "+e)}}}))}
/**
     * Buy access to an asset by first checking its price via getTerms, then calling buyAccess.
     * @param {bigint} tokenId The token ID of the asset.
     * @param {number} periods The number of periods to buy access for.
     * @returns {Promise<any>} The result of the buyAccess call.
     */buyAccessSmart(e,t){return c(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");const n=yield this.getTerms(e);if(!n)throw new Error("Failed to fetch terms for asset");const{price:i,paymentToken:r}=n;if(void 0===i||void 0===r)throw new Error("Terms missing price or paymentToken");const[s]=yield this.viemClient.request({method:"eth_requestAccounts",params:[]}),o=i*BigInt(t);return r===d?this.buyAccess(s,e,t,o):(yield function(e){return c(this,arguments,void 0,(function*({walletClient:e,publicClient:t,tokenAddress:n,owner:i,spender:r,amount:s}){(yield t.readContract({address:n,abi:a,functionName:"allowance",args:[i,r]}))<s&&(yield e.writeContract({address:n,account:i,abi:a,functionName:"approve",args:[r,s],chain:A}))}))}({walletClient:this.viemClient,publicClient:E(),tokenAddress:r,owner:s,spender:$,amount:o}),this.buyAccess(s,e,t))}))}getData(e){return c(this,void 0,void 0,(function*(){const t=yield fetch(`${M}/auth/origin/data/${e}`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}});if(!t.ok)throw new Error("Failed to fetch data");return t.json()}))}}ee=new WeakMap,te=new WeakMap,X=new WeakSet,ne=function(e){return c(this,void 0,void 0,(function*(){if(!this.viemClient)throw new Error("WalletClient not connected.");for(;;){const t=yield this.viemClient.request({method:"eth_getTransactionReceipt",params:[e]});if(t&&t.blockNumber)return t;yield new Promise((e=>setTimeout(e,1e3)))}}))},ie=function(e){return c(this,void 0,void 0,(function*(){
// return;
if(!this.viemClient)throw new Error("WalletClient not connected.");let t=yield this.viemClient.request({method:"eth_chainId",params:[]});if("string"==typeof t&&(t=parseInt(t,16)),t!==e.id)try{yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16)}]})}catch(t){
// Unrecognized chain
if(4902!==t.code)throw t;yield this.viemClient.request({method:"wallet_addEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16),chainName:e.name,rpcUrls:e.rpcUrls.default.http,nativeCurrency:e.nativeCurrency}]}),yield this.viemClient.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(e.id).toString(16)}]})}}))};
/**
 * The Auth class.
 * @class
 * @classdesc The Auth class is used to authenticate the user.
 */
class ge{
/**
     * Constructor for the Auth class.
     * @param {object} options The options object.
     * @param {string} options.clientId The client ID.
     * @param {string|object} options.redirectUri The redirect URI used for oauth. Leave empty if you want to use the current URL. If you want different redirect URIs for different socials, pass an object with the socials as keys and the redirect URIs as values.
     * @param {boolean} [options.allowAnalytics=true] Whether to allow analytics to be sent.
     * @param {object} [options.ackeeInstance] The Ackee instance.
     * @throws {APIError} - Throws an error if the clientId is not provided.
     */
constructor({clientId:e,redirectUri:t,allowAnalytics:n=!0,ackeeInstance:i}){if(re.add(this),ae.set(this,void 0),se.set(this,void 0),!e)throw new Error("clientId is required");this.viem=null,
// if (typeof window !== "undefined") {
//   if (window.ethereum) this.viem = getClient(window.ethereum);
// }
this.redirectUri=(e=>{const t=["twitter","discord","spotify"];return"object"==typeof e?t.reduce(((t,n)=>(t[n]=e[n]||("undefined"!=typeof window?window.location.href:""),t)),{}):"string"==typeof e?t.reduce(((t,n)=>(t[n]=e,t)),{}):e?{}:t.reduce(((e,t)=>(e[t]="undefined"!=typeof window?window.location.href:"",e)),{})})(t),i&&h(this,se,i,"f"),n&&y(this,se,"f"),this.clientId=e,this.isAuthenticated=!1,this.jwt=null,this.origin=null,this.walletAddress=null,this.userId=null,h(this,ae,{},"f"),O((e=>{y(this,re,"m",oe).call(this,"providers",e)})),y(this,re,"m",de).call(this)}
/**
     * Subscribe to an event. Possible events are "state", "provider", "providers", and "viem".
     * @param {("state"|"provider"|"providers"|"viem")} event The event.
     * @param {function} callback The callback function.
     * @returns {void}
     * @example
     * auth.on("state", (state) => {
     *  console.log(state);
     * });
     */on(e,t){y(this,ae,"f")[e]||(y(this,ae,"f")[e]=[]),y(this,ae,"f")[e].push(t),"providers"===e&&t(F())}
/**
     * Set the loading state.
     * @param {boolean} loading The loading state.
     * @returns {void}
     */setLoading(e){y(this,re,"m",oe).call(this,"state",e?"loading":this.isAuthenticated?"authenticated":"unauthenticated")}
/**
     * Set the provider. This is useful for setting the provider when the user selects a provider from the UI or when dApp wishes to use a specific provider.
     * @param {object} options The options object. Includes the provider and the provider info.
     * @returns {void}
     * @throws {APIError} - Throws an error if the provider is not provided.
     */setProvider({provider:e,info:i,address:r}){if(!e)throw new m("provider is required");this.viem=((e,i="window.ethereum",r)=>{var a;if(!e&&!k)return console.warn("Provider is required to create a client."),null;if(!k||k.transport.name!==i&&e||r!==(null===(a=k.account)||void 0===a?void 0:a.address)&&e){const a={chain:A,transport:t(e,{name:i})};r&&(a.account=l(r)),k=n(a)}return k})(e,i.name,r),this.origin&&this.origin.setViemClient(this.viem),
// TODO: only use one of these
y(this,re,"m",oe).call(this,"viem",this.viem),y(this,re,"m",oe).call(this,"provider",{provider:e,info:i}),localStorage.setItem("camp-sdk:provider",JSON.stringify(i))}
/**
     * Set the wallet address. This is useful for edge cases where the provider can't return the wallet address. Don't use this unless you know what you're doing.
     * @param {string} walletAddress The wallet address.
     * @returns {void}
     */setWalletAddress(e){this.walletAddress=e}recoverProvider(){return c(this,void 0,void 0,(function*(){var e,t,n,i,r,a,s,o,d,u,l,p,c,y,h;if(!this.walletAddress)return void console.warn("No wallet address found in local storage. Please connect your wallet again.");const m=JSON.parse(localStorage.getItem("camp-sdk:provider")||"{}");let f;const w=null!==(e=F())&&void 0!==e?e:[];
// first pass: try to find provider by UUID/name and check if it has the right address
// without prompting (using eth_accounts)
for(const e of w)try{if(m.uuid&&(null===(t=e.info)||void 0===t?void 0:t.uuid)===m.uuid||m.name&&(null===(n=e.info)||void 0===n?void 0:n.name)===m.name){
// silently check if the wallet address matches first
const t=yield e.provider.request({method:"eth_accounts"});if(t.length>0&&(null===(i=t[0])||void 0===i?void 0:i.toLowerCase())===(null===(r=this.walletAddress)||void 0===r?void 0:r.toLowerCase())){f=e;break}}}catch(e){console.warn("Failed to fetch accounts from provider:",e)}
// second pass: if no provider found by UUID/name match, try to find by address only
// but still avoid prompting
if(!f)for(const e of w)try{
// skip providers we already checked in the first pass
if(m.uuid&&(null===(a=e.info)||void 0===a?void 0:a.uuid)===m.uuid||m.name&&(null===(s=e.info)||void 0===s?void 0:s.name)===m.name)continue;const t=yield e.provider.request({method:"eth_accounts"});if(t.length>0&&(null===(o=t[0])||void 0===o?void 0:o.toLowerCase())===(null===(d=this.walletAddress)||void 0===d?void 0:d.toLowerCase())){f=e;break}}catch(e){console.warn("Failed to fetch accounts from provider:",e)}
// third pass: if still no provider found and we have UUID/name info,
// try prompting the user (only for the stored provider)
if(!f&&(m.uuid||m.name))for(const e of w)try{if(m.uuid&&(null===(u=e.info)||void 0===u?void 0:u.uuid)===m.uuid||m.name&&(null===(l=e.info)||void 0===l?void 0:l.name)===m.name){console.log("Attempting to reconnect to stored provider:",(null===(p=e.info)||void 0===p?void 0:p.name)||(null===(c=e.info)||void 0===c?void 0:c.uuid));const t=yield e.provider.request({method:"eth_requestAccounts"});if(t.length>0&&(null===(y=t[0])||void 0===y?void 0:y.toLowerCase())===(null===(h=this.walletAddress)||void 0===h?void 0:h.toLowerCase())){f=e;break}}}catch(e){console.warn("Failed to reconnect to stored provider:",e)}f?this.setProvider({provider:f.provider,info:f.info||{name:"Unknown"},address:this.walletAddress}):console.warn("No matching provider found for the stored wallet address. Please connect your wallet again.")}))}
/**
     * Disconnect the user.
     * @returns {Promise<void>}
     */disconnect(){return c(this,void 0,void 0,(function*(){this.isAuthenticated&&(y(this,re,"m",oe).call(this,"state","unauthenticated"),this.isAuthenticated=!1,this.walletAddress=null,this.userId=null,this.jwt=null,this.origin=null,localStorage.removeItem("camp-sdk:wallet-address"),localStorage.removeItem("camp-sdk:user-id"),localStorage.removeItem("camp-sdk:jwt"))}))}
/**
     * Connect the user's wallet and sign the message.
     * @returns {Promise<{ success: boolean; message: string; walletAddress: string }>} A promise that resolves with the authentication result.
     * @throws {APIError} - Throws an error if the user cannot be authenticated.
     */connect(){return c(this,void 0,void 0,(function*(){y(this,re,"m",oe).call(this,"state","loading");try{this.walletAddress||(yield y(this,re,"m",ue).call(this)),this.walletAddress=u(this.walletAddress);const e=yield y(this,re,"m",le).call(this),t=y(this,re,"m",ce).call(this,e),n=yield this.viem.signMessage({account:this.walletAddress,message:t}),i=yield y(this,re,"m",pe).call(this,t,n);if(i.success)return this.isAuthenticated=!0,this.userId=i.userId,this.jwt=i.token,this.origin=new Te(this.jwt,this.viem),localStorage.setItem("camp-sdk:jwt",this.jwt),localStorage.setItem("camp-sdk:wallet-address",this.walletAddress),localStorage.setItem("camp-sdk:user-id",this.userId),y(this,re,"m",oe).call(this,"state","authenticated"),yield y(this,re,"m",ye).call(this,S.USER_CONNECTED,"User Connected"),{success:!0,message:"Successfully authenticated",walletAddress:this.walletAddress};throw this.isAuthenticated=!1,y(this,re,"m",oe).call(this,"state","unauthenticated"),new m("Failed to authenticate")}catch(e){throw this.isAuthenticated=!1,y(this,re,"m",oe).call(this,"state","unauthenticated"),new m(e)}}))}
/**
     * Get the user's linked social accounts.
     * @returns {Promise<Record<string, boolean>>} A promise that resolves with the user's linked social accounts.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated or if the request fails.
     * @example
     * const auth = new Auth({ clientId: "your-client-id" });
     * const socials = await auth.getLinkedSocials();
     * console.log(socials);
     */getLinkedSocials(){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${M}/auth/client-user/connections-sdk`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"}}).then((e=>e.json()));if(e.isError)throw new m(e.message||"Failed to fetch connections");{const t={};return Object.keys(e.data.data).forEach((n=>{t[n.split("User")[0]]=e.data.data[n]})),t}}))}
/**
     * Link the user's Twitter account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkTwitter(){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");
// await this.#sendAnalyticsEvent(
//   constants.ACKEE_EVENTS.TWITTER_LINKED,
//   "Twitter Linked"
// );
window.location.href=`${M}/twitter/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.twitter}`}))}
/**
     * Link the user's Discord account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkDiscord(){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");
// await this.#sendAnalyticsEvent(
//   constants.ACKEE_EVENTS.DISCORD_LINKED,
//   "Discord Linked"
// );
window.location.href=`${M}/discord/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.discord}`}))}
/**
     * Link the user's Spotify account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkSpotify(){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");
// await this.#sendAnalyticsEvent(
//   constants.ACKEE_EVENTS.SPOTIFY_LINKED,
//   "Spotify Linked"
// );
window.location.href=`${M}/spotify/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.spotify}`}))}
/**
     * Link the user's TikTok account.
     * @param {string} handle The user's TikTok handle.
     * @returns {Promise<any>} A promise that resolves with the TikTok account data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */linkTikTok(e){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const t=yield fetch(`${M}/tiktok/connect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userHandle:e,clientId:this.clientId,userId:this.userId})}).then((e=>e.json()));if(t.isError)throw"Request failed with status code 502"===t.message?new m("TikTok service is currently unavailable, try again later"):new m(t.message||"Failed to link TikTok account");return y(this,re,"m",ye).call(this,S.TIKTOK_LINKED,"TikTok Linked"),t.data}))}
/**
     * Send an OTP to the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @returns {Promise<any>} A promise that resolves with the OTP data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */sendTelegramOTP(e){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!e)throw new m("Phone number is required");yield this.unlinkTelegram();const t=yield fetch(`${M}/telegram/sendOTP-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:e})}).then((e=>e.json()));if(t.isError)throw new m(t.message||"Failed to send Telegram OTP");return t.data}))}
/**
     * Link the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @param {string} otp The OTP.
     * @param {string} phoneCodeHash The phone code hash.
     * @returns {Promise<object>} A promise that resolves with the Telegram account data.
     * @throws {APIError|Error} - Throws an error if the user is not authenticated. Also throws an error if the phone number, OTP, and phone code hash are not provided.
     */linkTelegram(e,t,n){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!e||!t||!n)throw new m("Phone number, OTP, and phone code hash are required");const i=yield fetch(`${M}/telegram/signIn-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:e,code:t,phone_code_hash:n,userId:this.userId,clientId:this.clientId})}).then((e=>e.json()));if(i.isError)throw new m(i.message||"Failed to link Telegram account");return y(this,re,"m",ye).call(this,S.TELEGRAM_LINKED,"Telegram Linked"),i.data}))}
/**
     * Unlink the user's Twitter account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTwitter(){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${M}/twitter/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new m(e.message||"Failed to unlink Twitter account");return e.data}))}
/**
     * Unlink the user's Discord account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkDiscord(){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new m("User needs to be authenticated");const e=yield fetch(`${M}/discord/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new m(e.message||"Failed to unlink Discord account");return e.data}))}
/**
     * Unlink the user's Spotify account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkSpotify(){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new m("User needs to be authenticated");const e=yield fetch(`${M}/spotify/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((e=>e.json()));if(e.isError)throw new m(e.message||"Failed to unlink Spotify account");return e.data}))}
/**
     * Unlink the user's TikTok account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTikTok(){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new m("User needs to be authenticated");const e=yield fetch(`${M}/tiktok/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((e=>e.json()));if(e.isError)throw new m(e.message||"Failed to unlink TikTok account");return e.data}))}
/**
     * Unlink the user's Telegram account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTelegram(){return c(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new m("User needs to be authenticated");const e=yield fetch(`${M}/telegram/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((e=>e.json()));if(e.isError)throw new m(e.message||"Failed to unlink Telegram account");return e.data}))}}ae=new WeakMap,se=new WeakMap,re=new WeakSet,oe=function(e,t){y(this,ae,"f")[e]&&y(this,ae,"f")[e].forEach((e=>e(t)))},de=function(e){return c(this,void 0,void 0,(function*(){if("undefined"==typeof localStorage)return;const t=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:wallet-address"),n=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:user-id"),i=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:jwt");t&&n&&i?(this.walletAddress=t,this.userId=n,this.jwt=i,this.origin=new Te(this.jwt),this.isAuthenticated=!0,e?this.setProvider({provider:e.provider,info:e.info||{name:"Unknown"},address:t}):(console.warn("No matching provider was given for the stored wallet address. Trying to recover provider."),yield this.recoverProvider())):this.isAuthenticated=!1}))},ue=function(){return c(this,void 0,void 0,(function*(){try{const[e]=yield this.viem.requestAddresses();return this.walletAddress=u(e),this.walletAddress}catch(e){throw new m(e)}}))},le=function(){return c(this,void 0,void 0,(function*(){try{const e=yield fetch(`${M}/auth/client-user/nonce`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({walletAddress:this.walletAddress})}),t=yield e.json();return 200!==e.status?Promise.reject(t.message||"Failed to fetch nonce"):t.data}catch(e){throw new Error(e)}}))},pe=function(e,t){return c(this,void 0,void 0,(function*(){try{const n=yield fetch(`${M}/auth/client-user/verify`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({message:e,signature:t,walletAddress:this.walletAddress})}),i=yield n.json(),r=i.data.split(".")[1],a=JSON.parse(atob(r));return{success:!i.isError,userId:a.id,token:i.data}}catch(e){throw new m(e)}}))},ce=function(e){return p({domain:window.location.host,address:this.walletAddress,statement:x,uri:window.location.origin,version:"1",chainId:this.viem.chain.id,nonce:e})},ye=function(e,t){return c(this,arguments,void 0,(function*(e,t,n=1){
// if (this.#ackeeInstance)
//   await sendAnalyticsEvent(this.#ackeeInstance, event, message, count);
// else return;
}))};export{ge as Auth,I as SpotifyAPI,b as TwitterAPI};
