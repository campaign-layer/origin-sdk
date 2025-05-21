import t from"axios";import{custom as e,createWalletClient as i,createPublicClient as n,http as s,getAbiItem as r,encodeFunctionData as o}from"viem";import{toAccount as a}from"viem/accounts";import{createSiweMessage as d}from"viem/siwe";
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
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */function h(t,e,i,n){return new(i||(i=Promise))((function(s,r){function o(t){try{d(n.next(t))}catch(t){r(t)}}function a(t){try{d(n.throw(t))}catch(t){r(t)}}function d(t){var e;t.done?s(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(o,a)}d((n=n.apply(t,e||[])).next())}))}function c(t,e,i,n){if("a"===i&&!n)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof e?t!==e||!n:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===i?n:"a"===i?n.call(t):n?n.value:e.get(t)}function l(t,e,i,n,s){if("m"===n)throw new TypeError("Private method is not writable");if("a"===n&&!s)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof e?t!==e||!s:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===n?s.call(t,i):s?s.value=i:e.set(t,i),i}"function"==typeof SuppressedError&&SuppressedError;class u extends Error{constructor(t,e){super(t),this.name="APIError",this.statusCode=e||500,Error.captureStackTrace(this,this.constructor)}toJSON(){return{error:this.name,message:this.message,statusCode:this.statusCode||500}}}
/**
 * Makes a GET request to the given URL with the provided headers.
 *
 * @param {string} url - The URL to send the GET request to.
 * @param {object} headers - The headers to include in the request.
 * @returns {Promise<object>} - The response data.
 * @throws {APIError} - Throws an error if the request fails.
 */function f(e){return h(this,arguments,void 0,(function*(e,i={}){try{return(yield t.get(e,{headers:i})).data}catch(t){if(t.response)throw new u(t.response.data.message||"API request failed",t.response.status);throw new u("Network error or server is unavailable",500)}}))}
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
function w(t,e={}){const i=function(t={}){return Object.keys(t).map((e=>`${encodeURIComponent(e)}=${encodeURIComponent(t[e])}`)).join("&")}(e);return i?`${t}?${i}`:t}const m="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/twitter",p="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/spotify";
/**
 * The TwitterAPI class.
 * @class
 * @classdesc The TwitterAPI class is used to interact with the Twitter API.
 */
class v{
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
     */fetchUserByUsername(t){return h(this,void 0,void 0,(function*(){const e=w(`${m}/user`,{twitterUserName:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetsByUsername(t){return h(this,arguments,void 0,(function*(t,e=1,i=10){const n=w(`${m}/tweets`,{twitterUserName:t,page:e,limit:i});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch followers by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The followers.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowersByUsername(t){return h(this,arguments,void 0,(function*(t,e=1,i=10){const n=w(`${m}/followers`,{twitterUserName:t,page:e,limit:i});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch following by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The following.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowingByUsername(t){return h(this,arguments,void 0,(function*(t,e=1,i=10){const n=w(`${m}/following`,{twitterUserName:t,page:e,limit:i});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch tweet by tweet ID.
     * @param {string} tweetId - The tweet ID.
     * @returns {Promise<object>} - The tweet.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetById(t){return h(this,void 0,void 0,(function*(){const e=w(`${m}/getTweetById`,{tweetId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch user by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The user data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(t){return h(this,arguments,void 0,(function*(t,e=1,i=10){const n=w(`${m}/wallet-twitter-data`,{walletAddress:t,page:e,limit:i});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch reposted tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The reposted tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepostedByUsername(t){return h(this,arguments,void 0,(function*(t,e=1,i=10){const n=w(`${m}/reposted`,{twitterUserName:t,page:e,limit:i});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch replies by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The replies.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepliesByUsername(t){return h(this,arguments,void 0,(function*(t,e=1,i=10){const n=w(`${m}/replies`,{twitterUserName:t,page:e,limit:i});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch likes by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The likes.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchLikesByUsername(t){return h(this,arguments,void 0,(function*(t,e=1,i=10){const n=w(`${m}/event/likes/${t}`,{page:e,limit:i});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch follows by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The follows.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowsByUsername(t){return h(this,arguments,void 0,(function*(t,e=1,i=10){const n=w(`${m}/event/follows/${t}`,{page:e,limit:i});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch viewed tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The viewed tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchViewedTweetsByUsername(t){return h(this,arguments,void 0,(function*(t,e=1,i=10){const n=w(`${m}/event/viewed-tweets/${t}`,{page:e,limit:i});return this._fetchDataWithAuth(n)}))}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(t){return h(this,void 0,void 0,(function*(){if(!this.apiKey)throw new u("API key is required for fetching data",401);try{return yield f(t,{"x-api-key":this.apiKey})}catch(t){throw new u(t.message,t.statusCode)}}))}}
/**
 * The SpotifyAPI class.
 * @class
 */class y{
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
     */fetchSavedTracksById(t){return h(this,void 0,void 0,(function*(){const e=w(`${p}/save-tracks`,{spotifyId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch the played tracks of a user by Spotify ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The played tracks.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchPlayedTracksById(t){return h(this,void 0,void 0,(function*(){const e=w(`${p}/played-tracks`,{spotifyId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch the user's saved albums by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved albums.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedAlbumsById(t){return h(this,void 0,void 0,(function*(){const e=w(`${p}/saved-albums`,{spotifyId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch the user's saved playlists by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved playlists.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedPlaylistsById(t){return h(this,void 0,void 0,(function*(){const e=w(`${p}/saved-playlists`,{spotifyId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch the tracks of an album by album ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} albumId - The album ID.
     * @returns {Promise<object>} - The tracks in the album.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInAlbum(t,e){return h(this,void 0,void 0,(function*(){const i=w(`${p}/album/tracks`,{spotifyId:t,albumId:e});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch the tracks in a playlist by playlist ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} playlistId - The playlist ID.
     * @returns {Promise<object>} - The tracks in the playlist.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInPlaylist(t,e){return h(this,void 0,void 0,(function*(){const i=w(`${p}/playlist/tracks`,{spotifyId:t,playlistId:e});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch the user's Spotify data by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @returns {Promise<object>} - The user's Spotify data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(t){return h(this,void 0,void 0,(function*(){const e=w(`${p}/wallet-spotify-data`,{walletAddress:t});return this._fetchDataWithAuth(e)}))}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(t){return h(this,void 0,void 0,(function*(){if(!this.apiKey)throw new u("API key is required for fetching data",401);try{return yield f(t,{"x-api-key":this.apiKey})}catch(t){throw new u(t.message,t.statusCode)}}))}}const g={id:123420001114,name:"Basecamp",nativeCurrency:{decimals:18,name:"Camp",symbol:"CAMP"},rpcUrls:{default:{http:["https://rpc-campnetwork.xyz","https://rpc.basecamp.t.raas.gelato.cloud"]}},blockExplorers:{default:{name:"Explorer",url:"https://basecamp.cloud.blockscout.com/"}}};
// @ts-ignore
let I=null,k=null;const T=(t,n="window.ethereum",s)=>{var r;if(!t&&!I)return console.warn("Provider is required to create a client."),null;if(!I||I.transport.name!==n&&t||s!==(null===(r=I.account)||void 0===r?void 0:r.address)&&t){const r={chain:g,transport:e(t,{name:n})};s&&(r.account=a(s)),I=i(r)}return I},A=()=>(k||(k=n({chain:g,transport:s()})),k);var E="Connect with Camp Network",b="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",$={USER_CONNECTED:"ed42542d-b676-4112-b6d9-6db98048b2e0",USER_DISCONNECTED:"20af31ac-e602-442e-9e0e-b589f4dd4016",TWITTER_LINKED:"7fbea086-90ef-4679-ba69-f47f9255b34c",DISCORD_LINKED:"d73f5ae3-a8e8-48f2-8532-85e0c7780d6a",SPOTIFY_LINKED:"fc1788b4-c984-42c8-96f4-c87f6bb0b8f7",TIKTOK_LINKED:"4a2ffdd3-f0e9-4784-8b49-ff76ec1c0a6a",TELEGRAM_LINKED:"9006bc5d-bcc9-4d01-a860-4f1a201e8e47"};let S=[];const j=()=>S,C=t=>{function e(e){S.some((t=>t.info.uuid===e.detail.info.uuid))||(S=[...S,e.detail],t(S))}if("undefined"!=typeof window)return window.addEventListener("eip6963:announceProvider",e),window.dispatchEvent(new Event("eip6963:requestProvider")),()=>window.removeEventListener("eip6963:announceProvider",e)};var U,O,N,P,_,D,B,W,x,F,q,K,z,L;
/**
 * The Origin class
 * Handles the upload of files to Origin, as well as querying the user's stats
 */class J{constructor(e){U.set(this,(t=>h(this,void 0,void 0,(function*(){const e=yield fetch(`${b}/auth/origin/upload-url`,{method:"POST",body:JSON.stringify({name:t.name,type:t.type}),headers:{Authorization:`Bearer ${this.jwt}`}}),i=yield e.json();return i.isError?i.message:i.data})))),O.set(this,((t,e)=>h(this,void 0,void 0,(function*(){(yield fetch(`${b}/auth/origin/update-status`,{method:"PATCH",body:JSON.stringify({status:e,fileKey:t}),headers:{Authorization:`Bearer ${this.jwt}`,"Content-Type":"application/json"}})).ok||console.error("Failed to update origin status")})))),this.uploadFile=(e,i)=>h(this,void 0,void 0,(function*(){const n=yield c(this,U,"f").call(this,e);if(n){try{yield((e,i,n)=>new Promise(((s,r)=>{t.put(i,e,Object.assign({headers:{"Content-Type":e.type}},"undefined"!=typeof window&&"function"==typeof n?{onUploadProgress:t=>{if(t.total){const e=t.loaded/t.total*100;n(e)}}}:{})).then((t=>{s(t.data)})).catch((t=>{var e;const i=(null===(e=null==t?void 0:t.response)||void 0===e?void 0:e.data)||(null==t?void 0:t.message)||"Upload failed";r(i)}))})))(e,n.url,(null==i?void 0:i.progressCallback)||(()=>{}))}catch(t){throw yield c(this,O,"f").call(this,n.key,"failed"),new Error("Failed to upload file: "+t)}yield c(this,O,"f").call(this,n.key,"success")}else console.error("Failed to generate upload URL")})),this.getOriginUploads=()=>h(this,void 0,void 0,(function*(){const t=yield fetch(`${b}/auth/origin/files`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`}});if(!t.ok)return console.error("Failed to get origin uploads"),null;return(yield t.json()).data})),this.jwt=e}
/**
     * Get the user's Origin stats (multiplier, consent, usage, etc.).
     * @returns {Promise<OriginUsageReturnType>} A promise that resolves with the user's Origin stats.
     */getOriginUsage(){return h(this,void 0,void 0,(function*(){const t=yield fetch(`${b}/auth/origin/usage`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"}}).then((t=>t.json()));if(!t.isError&&t.data.user)return t;throw new u(t.message||"Failed to fetch Origin usage")}))}
/**
     * Set the user's consent for Origin usage.
     * @param {boolean} consent The user's consent.
     * @returns {Promise<void>}
     * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the consent is not provided.
     */setOriginConsent(t){return h(this,void 0,void 0,(function*(){if(void 0===t)throw new u("Consent is required");const e=yield fetch(`${b}/auth/origin/status`,{method:"PATCH",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"},body:JSON.stringify({active:t})}).then((t=>t.json()));if(e.isError)throw new u(e.message||"Failed to set Origin consent")}))}
/**
     * Set the user's Origin multiplier.
     * @param {number} multiplier The user's Origin multiplier.
     * @returns {Promise<void>}
     * @throws {Error|APIError} - Throws an error if the user is not authenticated. Also throws an error if the multiplier is not provided.
     */setOriginMultiplier(t){return h(this,void 0,void 0,(function*(){if(void 0===t)throw new u("Multiplier is required");const e=yield fetch(`${b}/auth/origin/multiplier`,{method:"PATCH",headers:{Authorization:`Bearer ${this.jwt}`,
// "x-client-id": this.clientId,
"Content-Type":"application/json"},body:JSON.stringify({multiplier:t})}).then((t=>t.json()));if(e.isError)throw new u(e.message||"Failed to set Origin multiplier")}))}}U=new WeakMap,O=new WeakMap;
/**
 * The Auth class.
 * @class
 * @classdesc The Auth class is used to authenticate the user.
 */
class R{
/**
     * Constructor for the Auth class.
     * @param {object} options The options object.
     * @param {string} options.clientId The client ID.
     * @param {string|object} options.redirectUri The redirect URI used for oauth. Leave empty if you want to use the current URL. If you want different redirect URIs for different socials, pass an object with the socials as keys and the redirect URIs as values.
     * @param {boolean} [options.allowAnalytics=true] Whether to allow analytics to be sent.
     * @param {object} [options.ackeeInstance] The Ackee instance.
     * @throws {APIError} - Throws an error if the clientId is not provided.
     */
constructor({clientId:t,redirectUri:e,allowAnalytics:i=!0,ackeeInstance:n}){if(N.add(this),P.set(this,void 0),_.set(this,void 0),!t)throw new Error("clientId is required");this.viem=null,
// if (typeof window !== "undefined") {
//   if (window.ethereum) this.viem = getClient(window.ethereum);
// }
this.redirectUri=(t=>{const e=["twitter","discord","spotify"];return"object"==typeof t?e.reduce(((e,i)=>(e[i]=t[i]||("undefined"!=typeof window?window.location.href:""),e)),{}):"string"==typeof t?e.reduce(((e,i)=>(e[i]=t,e)),{}):t?{}:e.reduce(((t,e)=>(t[e]="undefined"!=typeof window?window.location.href:"",t)),{})})(e),n&&l(this,_,n,"f"),i&&c(this,_,"f"),this.clientId=t,this.isAuthenticated=!1,this.jwt=null,this.origin=null,this.walletAddress=null,this.userId=null,l(this,P,{},"f"),C((t=>{c(this,N,"m",D).call(this,"providers",t)})),c(this,N,"m",B).call(this)}
/**
     * Subscribe to an event. Possible events are "state", "provider", "providers", and "viem".
     * @param {("state"|"provider"|"providers"|"viem")} event The event.
     * @param {function} callback The callback function.
     * @returns {void}
     * @example
     * auth.on("state", (state) => {
     *  console.log(state);
     * });
     */on(t,e){c(this,P,"f")[t]||(c(this,P,"f")[t]=[]),c(this,P,"f")[t].push(e),"providers"===t&&e(j())}
/**
     * Set the loading state.
     * @param {boolean} loading The loading state.
     * @returns {void}
     */setLoading(t){c(this,N,"m",D).call(this,"state",t?"loading":this.isAuthenticated?"authenticated":"unauthenticated")}
/**
     * Set the provider. This is useful for setting the provider when the user selects a provider from the UI or when dApp wishes to use a specific provider.
     * @param {object} options The options object. Includes the provider and the provider info.
     * @returns {void}
     * @throws {APIError} - Throws an error if the provider is not provided.
     */setProvider({provider:t,info:e,address:i}){if(!t)throw new u("provider is required");this.viem=T(t,e.name,i),c(this,N,"m",D).call(this,"viem",this.viem),c(this,N,"m",D).call(this,"provider",{provider:t,info:e})}
/**
     * Set the wallet address. This is useful for edge cases where the provider can't return the wallet address. Don't use this unless you know what you're doing.
     * @param {string} walletAddress The wallet address.
     * @returns {void}
     */setWalletAddress(t){this.walletAddress=t}
/**
     * Disconnect the user.
     * @returns {Promise<void>}
     */disconnect(){return h(this,void 0,void 0,(function*(){this.isAuthenticated&&(this.isAuthenticated=!1,this.walletAddress=null,this.userId=null,this.jwt=null,this.origin=null,localStorage.removeItem("camp-sdk:wallet-address"),localStorage.removeItem("camp-sdk:user-id"),localStorage.removeItem("camp-sdk:jwt"),c(this,N,"m",D).call(this,"state","unauthenticated"),yield c(this,N,"m",K).call(this,$.USER_DISCONNECTED,"User Disconnected"))}))}
/**
     * Connect the user's wallet and sign the message.
     * @returns {Promise<{ success: boolean; message: string; walletAddress: string }>} A promise that resolves with the authentication result.
     * @throws {APIError} - Throws an error if the user cannot be authenticated.
     */connect(){return h(this,void 0,void 0,(function*(){c(this,N,"m",D).call(this,"state","loading");try{this.walletAddress||(yield c(this,N,"m",W).call(this));const t=yield c(this,N,"m",x).call(this),e=c(this,N,"m",q).call(this,t),i=yield this.viem.signMessage({account:this.walletAddress,message:e}),n=yield c(this,N,"m",F).call(this,e,i);if(n.success)return this.isAuthenticated=!0,this.userId=n.userId,this.jwt=n.token,this.origin=new J(this.jwt),localStorage.setItem("camp-sdk:jwt",this.jwt),localStorage.setItem("camp-sdk:wallet-address",this.walletAddress),localStorage.setItem("camp-sdk:user-id",this.userId),c(this,N,"m",D).call(this,"state","authenticated"),yield c(this,N,"m",K).call(this,$.USER_CONNECTED,"User Connected"),{success:!0,message:"Successfully authenticated",walletAddress:this.walletAddress};throw this.isAuthenticated=!1,c(this,N,"m",D).call(this,"state","unauthenticated"),new u("Failed to authenticate")}catch(t){throw this.isAuthenticated=!1,c(this,N,"m",D).call(this,"state","unauthenticated"),new u(t)}}))}
/**
     * Get the user's linked social accounts.
     * @returns {Promise<Record<string, boolean>>} A promise that resolves with the user's linked social accounts.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated or if the request fails.
     * @example
     * const auth = new Auth({ clientId: "your-client-id" });
     * const socials = await auth.getLinkedSocials();
     * console.log(socials);
     */getLinkedSocials(){return h(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const t=yield fetch(`${b}/auth/client-user/connections-sdk`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"}}).then((t=>t.json()));if(t.isError)throw new u(t.message||"Failed to fetch connections");{const e={};return Object.keys(t.data.data).forEach((i=>{e[i.split("User")[0]]=t.data.data[i]})),e}}))}
/**
     * Link the user's Twitter account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkTwitter(){return h(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");
// await this.#sendAnalyticsEvent(
//   constants.ACKEE_EVENTS.TWITTER_LINKED,
//   "Twitter Linked"
// );
window.location.href=`${b}/twitter/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.twitter}`}))}
/**
     * Link the user's Discord account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkDiscord(){return h(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");
// await this.#sendAnalyticsEvent(
//   constants.ACKEE_EVENTS.DISCORD_LINKED,
//   "Discord Linked"
// );
window.location.href=`${b}/discord/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.discord}`}))}
/**
     * Link the user's Spotify account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkSpotify(){return h(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");
// await this.#sendAnalyticsEvent(
//   constants.ACKEE_EVENTS.SPOTIFY_LINKED,
//   "Spotify Linked"
// );
window.location.href=`${b}/spotify/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.spotify}`}))}
/**
     * Link the user's TikTok account.
     * @param {string} handle The user's TikTok handle.
     * @returns {Promise<any>} A promise that resolves with the TikTok account data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */linkTikTok(t){return h(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${b}/tiktok/connect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userHandle:t,clientId:this.clientId,userId:this.userId})}).then((t=>t.json()));if(e.isError)throw"Request failed with status code 502"===e.message?new u("TikTok service is currently unavailable, try again later"):new u(e.message||"Failed to link TikTok account");return c(this,N,"m",K).call(this,$.TIKTOK_LINKED,"TikTok Linked"),e.data}))}
/**
     * Send an OTP to the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @returns {Promise<any>} A promise that resolves with the OTP data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */sendTelegramOTP(t){return h(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!t)throw new u("Phone number is required");yield this.unlinkTelegram();const e=yield fetch(`${b}/telegram/sendOTP-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:t})}).then((t=>t.json()));if(e.isError)throw new u(e.message||"Failed to send Telegram OTP");return e.data}))}
/**
     * Link the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @param {string} otp The OTP.
     * @param {string} phoneCodeHash The phone code hash.
     * @returns {Promise<object>} A promise that resolves with the Telegram account data.
     * @throws {APIError|Error} - Throws an error if the user is not authenticated. Also throws an error if the phone number, OTP, and phone code hash are not provided.
     */linkTelegram(t,e,i){return h(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!t||!e||!i)throw new u("Phone number, OTP, and phone code hash are required");const n=yield fetch(`${b}/telegram/signIn-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:t,code:e,phone_code_hash:i,userId:this.userId,clientId:this.clientId})}).then((t=>t.json()));if(n.isError)throw new u(n.message||"Failed to link Telegram account");return c(this,N,"m",K).call(this,$.TELEGRAM_LINKED,"Telegram Linked"),n.data}))}
/**
     * Unlink the user's Twitter account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTwitter(){return h(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const t=yield fetch(`${b}/twitter/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((t=>t.json()));if(t.isError)throw new u(t.message||"Failed to unlink Twitter account");return t.data}))}
/**
     * Unlink the user's Discord account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkDiscord(){return h(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new u("User needs to be authenticated");const t=yield fetch(`${b}/discord/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((t=>t.json()));if(t.isError)throw new u(t.message||"Failed to unlink Discord account");return t.data}))}
/**
     * Unlink the user's Spotify account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkSpotify(){return h(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new u("User needs to be authenticated");const t=yield fetch(`${b}/spotify/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((t=>t.json()));if(t.isError)throw new u(t.message||"Failed to unlink Spotify account");return t.data}))}
/**
     * Unlink the user's TikTok account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTikTok(){return h(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new u("User needs to be authenticated");const t=yield fetch(`${b}/tiktok/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((t=>t.json()));if(t.isError)throw new u(t.message||"Failed to unlink TikTok account");return t.data}))}
/**
     * Unlink the user's Telegram account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTelegram(){return h(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new u("User needs to be authenticated");const t=yield fetch(`${b}/telegram/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((t=>t.json()));if(t.isError)throw new u(t.message||"Failed to unlink Telegram account");return t.data}))}
/**
     * Call a contract method.
     * @param {string} contractAddress The contract address.
     * @param {Abi} abi The contract ABI.
     * @param {string} methodName The method name.
     * @param {any[]} params The method parameters.
     * @param {CallOptions} [options] The call options.
     * @returns {Promise<any>} A promise that resolves with the result of the contract call or transaction hash.
     * @throws {Error} - Throws an error if the wallet client is not connected or if the method is not a view function.
     */callContractMethod(t,e,i,n){return h(this,arguments,void 0,(function*(t,e,i,n,s={}){const a=r({abi:e,name:i}),d=a&&"stateMutability"in a&&("view"===a.stateMutability||"pure"===a.stateMutability);if(!d&&!this.viem)throw new Error("WalletClient not connected.");if(d){const s=A();return(yield s.readContract({address:t,abi:e,functionName:i,args:n}))||null}{const[r]=yield this.viem.getAddresses(),a=o({abi:e,functionName:i,args:n});yield c(this,N,"m",L).call(this,g);const d=yield this.viem.sendTransaction({to:t,data:a,account:r,value:s.value,gas:s.gas});if(s.waitForReceipt){return yield c(this,N,"m",z).call(this,d)}return d}}))}}P=new WeakMap,_=new WeakMap,N=new WeakSet,D=function(t,e){c(this,P,"f")[t]&&c(this,P,"f")[t].forEach((t=>t(e)))},B=function(t){return h(this,void 0,void 0,(function*(){var e,i;if("undefined"==typeof localStorage)return;const n=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:wallet-address"),s=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:user-id"),r=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:jwt");if(n&&s&&r){this.walletAddress=n,this.userId=s,this.jwt=r,this.origin=new J(this.jwt),this.isAuthenticated=!0;let o=t;if(!o){const t=null!==(e=j())&&void 0!==e?e:[];for(const e of t)try{if((null===(i=(yield e.provider.request({method:"eth_accounts"}))[0])||void 0===i?void 0:i.toLowerCase())===n.toLowerCase()){o=e.provider;break}}catch(t){console.warn("Failed to fetch accounts from provider:",t)}}o&&(this.viem=T(o,(new Date).getTime().toString(),n),c(this,N,"m",D).call(this,"viem",this.viem))}else this.isAuthenticated=!1}))},W=function(){return h(this,void 0,void 0,(function*(){try{const[t]=yield this.viem.requestAddresses();return this.walletAddress=t,t}catch(t){throw new u(t)}}))},x=function(){return h(this,void 0,void 0,(function*(){try{const t=yield fetch(`${b}/auth/client-user/nonce`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({walletAddress:this.walletAddress})}),e=yield t.json();return 200!==t.status?Promise.reject(e.message||"Failed to fetch nonce"):e.data}catch(t){throw new Error(t)}}))},F=function(t,e){return h(this,void 0,void 0,(function*(){try{const i=yield fetch(`${b}/auth/client-user/verify`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({message:t,signature:e,walletAddress:this.walletAddress})}),n=yield i.json(),s=n.data.split(".")[1],r=JSON.parse(atob(s));return{success:!n.isError,userId:r.id,token:n.data}}catch(t){throw new u(t)}}))},q=function(t){return d({domain:window.location.host,address:this.walletAddress,statement:E,uri:window.location.origin,version:"1",chainId:this.viem.chain.id,nonce:t})},K=function(t,e){return h(this,arguments,void 0,(function*(t,e,i=1){
// if (this.#ackeeInstance)
//   await sendAnalyticsEvent(this.#ackeeInstance, event, message, count);
// else return;
}))},z=function(t){return h(this,void 0,void 0,(function*(){if(!this.viem)throw new Error("WalletClient not connected.");for(;;){const e=yield this.viem.request({method:"eth_getTransactionReceipt",params:[t]});if(e&&e.blockNumber)return e;yield new Promise((t=>setTimeout(t,1e3)))}}))},L=function(t){return h(this,void 0,void 0,(function*(){
// return;
if(!this.viem)throw new Error("WalletClient not connected.");let e=yield this.viem.request({method:"eth_chainId",params:[]});if("string"==typeof e&&(e=parseInt(e,16)),e!==t.id)try{yield this.viem.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(t.id).toString(16)}]})}catch(e){
// Unrecognized chain
if(4902!==e.code)throw e;yield this.viem.request({method:"wallet_addEthereumChain",params:[{chainId:"0x"+BigInt(t.id).toString(16),chainName:t.name,rpcUrls:t.rpcUrls.default.http,nativeCurrency:t.nativeCurrency}]}),yield this.viem.request({method:"wallet_switchEthereumChain",params:[{chainId:"0x"+BigInt(t.id).toString(16)}]})}}))};export{R as Auth,y as SpotifyAPI,v as TwitterAPI};
