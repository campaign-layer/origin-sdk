"use strict";var t=require("axios"),e=require("viem"),i=require("viem/siwe");
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
function s(t,e,i,s){return new(i||(i=Promise))((function(n,r){function o(t){try{d(s.next(t))}catch(t){r(t)}}function a(t){try{d(s.throw(t))}catch(t){r(t)}}function d(t){var e;t.done?n(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(o,a)}d((s=s.apply(t,e||[])).next())}))}function n(t,e,i,s){if("a"===i&&!s)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof e?t!==e||!s:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===i?s:"a"===i?s.call(t):s?s.value:e.get(t)}"function"==typeof SuppressedError&&SuppressedError;class r extends Error{constructor(t,e){super(t),this.name="APIError",this.statusCode=e||500,Error.captureStackTrace(this,this.constructor)}toJSON(){return{error:this.name,message:this.message,statusCode:this.statusCode||500}}}
/**
 * Makes a GET request to the given URL with the provided headers.
 *
 * @param {string} url - The URL to send the GET request to.
 * @param {object} headers - The headers to include in the request.
 * @returns {Promise<object>} - The response data.
 * @throws {APIError} - Throws an error if the request fails.
 */function o(e){return s(this,arguments,void 0,(function*(e,i={}){try{return(yield t.get(e,{headers:i})).data}catch(t){if(t.response)throw new r(t.response.data.message||"API request failed",t.response.status);throw new r("Network error or server is unavailable",500)}}))}
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
function a(t,e={}){const i=function(t={}){return Object.keys(t).map((e=>`${encodeURIComponent(e)}=${encodeURIComponent(t[e])}`)).join("&")}(e);return i?`${t}?${i}`:t}const d="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/twitter",h="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/spotify";const c={id:325e3,name:"Camp Network Testnet V2",nativeCurrency:{decimals:18,name:"Ether",symbol:"ETH"},rpcUrls:{default:{http:["https://rpc-campnetwork.xyz"]}},blockExplorers:{default:{name:"Explorer",url:"https://camp-network-testnet.blockscout.com"}}};
// @ts-ignore
let l=null;const u=(t,i="window.ethereum")=>t||l?((!l||l.transport.name!==i&&t)&&(l=e.createWalletClient({chain:c,transport:e.custom(t,{name:i})})),l):(console.warn("Provider is required to create a client."),null);var f="Connect with Camp Network",w="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev";let p=[];const m=()=>p,y=t=>{function e(e){p.some((t=>t.info.uuid===e.detail.info.uuid))||(p=[...p,e.detail],t(p))}if("undefined"!=typeof window)return window.addEventListener("eip6963:announceProvider",e),window.dispatchEvent(new Event("eip6963:requestProvider")),()=>window.removeEventListener("eip6963:announceProvider",e)};var v,g,I,k,A,T,$,S;g=new WeakMap,v=new WeakSet,I=function(t,e){n(this,g,"f")[t]&&n(this,g,"f")[t].forEach((t=>t(e)))},k=function(){if("undefined"==typeof localStorage)return;const t=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:wallet-address"),e=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:user-id"),i=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:jwt");t&&e&&i?(this.walletAddress=t,this.userId=e,this.jwt=i,this.isAuthenticated=!0):this.isAuthenticated=!1},A=function(){return s(this,void 0,void 0,(function*(){try{const[t]=yield this.viem.requestAddresses();return this.walletAddress=t,t}catch(t){throw new r(t)}}))},T=function(){return s(this,void 0,void 0,(function*(){try{const t=yield fetch(`${w}/auth/client-user/nonce`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({walletAddress:this.walletAddress})}),e=yield t.json();return 200!==t.status?Promise.reject(e.message||"Failed to fetch nonce"):e.data}catch(t){throw new Error(t)}}))},$=function(t,e){return s(this,void 0,void 0,(function*(){try{const i=yield fetch(`${w}/auth/client-user/verify`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({message:t,signature:e,walletAddress:this.walletAddress})}),s=yield i.json(),n=s.data.split(".")[1],r=JSON.parse(atob(n));return{success:!s.isError,userId:r.id,token:s.data}}catch(t){throw new r(t)}}))},S=function(t){return i.createSiweMessage({domain:window.location.host,address:this.walletAddress,statement:f,uri:window.location.origin,version:"1",chainId:this.viem.chain.id,nonce:t})},exports.Auth=
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
     * @throws {APIError} - Throws an error if the clientId is not provided.
     */
constructor({clientId:t,redirectUri:e}){if(v.add(this),g.set(this,void 0),!t)throw new Error("clientId is required");this.viem=null,"undefined"!=typeof window&&window.ethereum&&(this.viem=u(window.ethereum)),this.redirectUri=(t=>{const e=["twitter","discord","spotify"];return"object"==typeof t?e.reduce(((e,i)=>(e[i]=t[i]||("undefined"!=typeof window?window.location.href:""),e)),{}):"string"==typeof t?e.reduce(((e,i)=>(e[i]=t,e)),{}):t?{}:e.reduce(((t,e)=>(t[e]="undefined"!=typeof window?window.location.href:"",t)),{})})(e),this.clientId=t,this.isAuthenticated=!1,this.jwt=null,this.walletAddress=null,this.userId=null,function(t,e,i,s,n){if("m"===s)throw new TypeError("Private method is not writable");if("a"===s&&!n)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof e?t!==e||!n:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");"a"===s?n.call(t,i):n?n.value=i:e.set(t,i)}(this,g,{},"f"),y((t=>{n(this,v,"m",I).call(this,"providers",t)})),n(this,v,"m",k).call(this)}
/**
     * Subscribe to an event. Possible events are "state", "provider", and "providers".
     * @param {("state"|"provider"|"providers")} event The event.
     * @param {function} callback The callback function.
     * @returns {void}
     * @example
     * auth.on("state", (state) => {
     *  console.log(state);
     * });
     */on(t,e){n(this,g,"f")[t]||(n(this,g,"f")[t]=[]),n(this,g,"f")[t].push(e),"providers"===t&&e(m())}
/**
     * Set the loading state.
     * @param {boolean} loading The loading state.
     * @returns {void}
     */setLoading(t){n(this,v,"m",I).call(this,"state",t?"loading":this.isAuthenticated?"authenticated":"unauthenticated")}
/**
     * Set the provider. This is useful for setting the provider when the user selects a provider from the UI or when dApp wishes to use a specific provider.
     * @param {object} options The options object. Includes the provider and the provider info.
     * @returns {void}
     * @throws {APIError} - Throws an error if the provider is not provided.
     */setProvider({provider:t,info:e}){if(!t)throw new r("provider is required");this.viem=u(t,e.name),n(this,v,"m",I).call(this,"provider",{provider:t,info:e})}
/**
     * Set the wallet address. This is useful for edge cases where the provider can't return the wallet address. Don't use this unless you know what you're doing.
     * @param {string} walletAddress The wallet address.
     * @returns {void}
     */setWalletAddress(t){this.walletAddress=t}
/**
     * Disconnect the user.
     * @returns {void}
     */disconnect(){return s(this,void 0,void 0,(function*(){this.isAuthenticated=!1,this.walletAddress=null,this.userId=null,this.jwt=null,localStorage.removeItem("camp-sdk:wallet-address"),localStorage.removeItem("camp-sdk:user-id"),localStorage.removeItem("camp-sdk:jwt"),n(this,v,"m",I).call(this,"state","unauthenticated")}))}
/**
     * Connect the user's wallet and sign the message.
     * @returns {Promise<object>} A promise that resolves with the authentication result.
     * @throws {APIError} - Throws an error if the user cannot be authenticated.
     */connect(){return s(this,void 0,void 0,(function*(){n(this,v,"m",I).call(this,"state","loading");try{this.walletAddress||(yield n(this,v,"m",A).call(this));const t=yield n(this,v,"m",T).call(this),e=n(this,v,"m",S).call(this,t),i=yield this.viem.signMessage({account:this.walletAddress,message:e}),s=yield n(this,v,"m",$).call(this,e,i);if(s.success)return this.isAuthenticated=!0,this.userId=s.userId,this.jwt=s.token,localStorage.setItem("camp-sdk:jwt",this.jwt),localStorage.setItem("camp-sdk:wallet-address",this.walletAddress),localStorage.setItem("camp-sdk:user-id",this.userId),n(this,v,"m",I).call(this,"state","authenticated"),{success:!0,message:"Successfully authenticated",walletAddress:this.walletAddress};throw this.isAuthenticated=!1,n(this,v,"m",I).call(this,"state","unauthenticated"),new r("Failed to authenticate")}catch(t){throw this.isAuthenticated=!1,n(this,v,"m",I).call(this,"state","unauthenticated"),new r(t)}}))}
/**
     * Get the user's linked social accounts.
     * @returns {Promise<object>} A promise that resolves with the user's linked social accounts.
     * @throws {APIError} - Throws an error if the user is not authenticated or if the request fails.
     * @example
     * const auth = new Auth({ clientId: "your-client-id" });
     * const socials = await auth.getLinkedSocials();
     * console.log(socials);
     */getLinkedSocials(){return s(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new r("User needs to be authenticated");const t=yield fetch(`${w}/auth/client-user/connections-sdk`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"}}).then((t=>t.json()));if(t.isError)throw new r(t.message||"Failed to fetch connections");{const e={};return Object.keys(t.data.data).forEach((i=>{e[i.split("User")[0]]=t.data.data[i]})),e}}))}
/**
     * Link the user's Twitter account.
     * @returns {void}
     * @throws {APIError} - Throws an error if the user is not authenticated.
     */linkTwitter(){if(!this.isAuthenticated)throw new r("User needs to be authenticated");window.location.href=`${w}/twitter/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.twitter}`}
/**
     * Link the user's Discord account.
     * @returns {void}
     * @throws {APIError} - Throws an error if the user is not authenticated.
     */linkDiscord(){if(!this.isAuthenticated)throw new r("User needs to be authenticated");window.location.href=`${w}/discord/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.discord}`}
/**
     * Link the user's Spotify account.
     * @returns {void}
     * @throws {APIError} - Throws an error if the user is not authenticated.
     */linkSpotify(){if(!this.isAuthenticated)throw new r("User needs to be authenticated");window.location.href=`${w}/spotify/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.spotify}`}
/**
     * Link the user's TikTok account.
     * @param {string} handle The user's TikTok handle.
     * @returns {void}
     * @throws {APIError} - Throws an error if the user is not authenticated.
     */linkTikTok(t){return s(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new r("User needs to be authenticated");const e=yield fetch(`${w}/tiktok/connect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userHandle:t,clientId:this.clientId,userId:this.userId})}).then((t=>t.json()));if(e.isError)throw"Request failed with status code 502"===e.message?new r("TikTok service is currently unavailable, try again later"):new r(e.message||"Failed to link TikTok account");return e.data}))}
/**
     * Send an OTP to the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @returns {void}
     * @throws {APIError} - Throws an error if the user is not authenticated.
     */sendTelegramOTP(t){return s(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new r("User needs to be authenticated");if(!t)throw new r("Phone number is required");yield this.unlinkTelegram();const e=yield fetch(`${w}/telegram/sendOTP-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:t})}).then((t=>t.json()));if(e.isError)throw new r(e.message||"Failed to send Telegram OTP");return e.data}))}
/**
     * Link the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @param {string} otp The OTP.
     * @param {string} phoneCodeHash The phone code hash.
     * @returns {void}
     * @throws {APIError} - Throws an error if the user is not authenticated. Also throws an error if the phone number, OTP, and phone code hash are not provided.
     */linkTelegram(t,e,i){return s(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new r("User needs to be authenticated");if(!t||!e||!i)throw new r("Phone number, OTP, and phone code hash are required");const s=yield fetch(`${w}/telegram/signIn-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:t,code:e,phone_code_hash:i,userId:this.userId,clientId:this.clientId})}).then((t=>t.json()));if(s.isError)throw new r(s.message||"Failed to link Telegram account");return s.data}))}
/**
     * Unlink the user's Twitter account.
     */unlinkTwitter(){return s(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new r("User needs to be authenticated");const t=yield fetch(`${w}/twitter/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((t=>t.json()));if(t.isError)throw new r(t.message||"Failed to unlink Twitter account");return t.data}))}
/**
     * Unlink the user's Discord account.
     */unlinkDiscord(){return s(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new r("User needs to be authenticated");const t=yield fetch(`${w}/discord/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((t=>t.json()));if(t.isError)throw new r(t.message||"Failed to unlink Discord account");return t.data}))}
/**
     * Unlink the user's Spotify account.
     */unlinkSpotify(){return s(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new r("User needs to be authenticated");const t=yield fetch(`${w}/spotify/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((t=>t.json()));if(t.isError)throw new r(t.message||"Failed to unlink Spotify account");return t.data}))}unlinkTikTok(){return s(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new r("User needs to be authenticated");const t=yield fetch(`${w}/tiktok/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((t=>t.json()));if(t.isError)throw new r(t.message||"Failed to unlink TikTok account");return t.data}))}unlinkTelegram(){return s(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new r("User needs to be authenticated");const t=yield fetch(`${w}/telegram/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((t=>t.json()));if(t.isError)throw new r(t.message||"Failed to unlink Telegram account");return t.data}))}},exports.SpotifyAPI=
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
     */fetchSavedTracksById(t){return s(this,void 0,void 0,(function*(){const e=a(`${h}/save-tracks`,{spotifyId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch the played tracks of a user by Spotify ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The played tracks.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchPlayedTracksById(t){return s(this,void 0,void 0,(function*(){const e=a(`${h}/played-tracks`,{spotifyId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch the user's saved albums by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved albums.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedAlbumsById(t){return s(this,void 0,void 0,(function*(){const e=a(`${h}/saved-albums`,{spotifyId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch the user's saved playlists by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved playlists.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedPlaylistsById(t){return s(this,void 0,void 0,(function*(){const e=a(`${h}/saved-playlists`,{spotifyId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch the tracks of an album by album ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} albumId - The album ID.
     * @returns {Promise<object>} - The tracks in the album.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInAlbum(t,e){return s(this,void 0,void 0,(function*(){const i=a(`${h}/album/tracks`,{spotifyId:t,albumId:e});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch the tracks in a playlist by playlist ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} playlistId - The playlist ID.
     * @returns {Promise<object>} - The tracks in the playlist.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInPlaylist(t,e){return s(this,void 0,void 0,(function*(){const i=a(`${h}/playlist/tracks`,{spotifyId:t,playlistId:e});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch the user's Spotify data by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @returns {Promise<object>} - The user's Spotify data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(t){return s(this,void 0,void 0,(function*(){const e=a(`${h}/wallet-spotify-data`,{walletAddress:t});return this._fetchDataWithAuth(e)}))}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(t){return s(this,void 0,void 0,(function*(){if(!this.apiKey)throw new r("API key is required for fetching data",401);try{return yield o(t,{"x-api-key":this.apiKey})}catch(t){throw new r(t.message,t.statusCode)}}))}},exports.TwitterAPI=
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
     */fetchUserByUsername(t){return s(this,void 0,void 0,(function*(){const e=a(`${d}/user`,{twitterUserName:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetsByUsername(t){return s(this,arguments,void 0,(function*(t,e=1,i=10){const s=a(`${d}/tweets`,{twitterUserName:t,page:e,limit:i});return this._fetchDataWithAuth(s)}))}
/**
     * Fetch followers by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The followers.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowersByUsername(t){return s(this,arguments,void 0,(function*(t,e=1,i=10){const s=a(`${d}/followers`,{twitterUserName:t,page:e,limit:i});return this._fetchDataWithAuth(s)}))}
/**
     * Fetch following by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The following.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowingByUsername(t){return s(this,arguments,void 0,(function*(t,e=1,i=10){const s=a(`${d}/following`,{twitterUserName:t,page:e,limit:i});return this._fetchDataWithAuth(s)}))}
/**
     * Fetch tweet by tweet ID.
     * @param {string} tweetId - The tweet ID.
     * @returns {Promise<object>} - The tweet.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetById(t){return s(this,void 0,void 0,(function*(){const e=a(`${d}/getTweetById`,{tweetId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch user by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The user data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(t){return s(this,arguments,void 0,(function*(t,e=1,i=10){const s=a(`${d}/wallet-twitter-data`,{walletAddress:t,page:e,limit:i});return this._fetchDataWithAuth(s)}))}
/**
     * Fetch reposted tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The reposted tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepostedByUsername(t){return s(this,arguments,void 0,(function*(t,e=1,i=10){const s=a(`${d}/reposted`,{twitterUserName:t,page:e,limit:i});return this._fetchDataWithAuth(s)}))}
/**
     * Fetch replies by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The replies.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepliesByUsername(t){return s(this,arguments,void 0,(function*(t,e=1,i=10){const s=a(`${d}/replies`,{twitterUserName:t,page:e,limit:i});return this._fetchDataWithAuth(s)}))}
/**
     * Fetch likes by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The likes.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchLikesByUsername(t){return s(this,arguments,void 0,(function*(t,e=1,i=10){const s=a(`${d}/event/likes/${t}`,{page:e,limit:i});return this._fetchDataWithAuth(s)}))}
/**
     * Fetch follows by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The follows.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowsByUsername(t){return s(this,arguments,void 0,(function*(t,e=1,i=10){const s=a(`${d}/event/follows/${t}`,{page:e,limit:i});return this._fetchDataWithAuth(s)}))}
/**
     * Fetch viewed tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The viewed tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchViewedTweetsByUsername(t){return s(this,arguments,void 0,(function*(t,e=1,i=10){const s=a(`${d}/event/viewed-tweets/${t}`,{page:e,limit:i});return this._fetchDataWithAuth(s)}))}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(t){return s(this,void 0,void 0,(function*(){if(!this.apiKey)throw new r("API key is required for fetching data",401);try{return yield o(t,{"x-api-key":this.apiKey})}catch(t){throw new r(t.message,t.statusCode)}}))}};
