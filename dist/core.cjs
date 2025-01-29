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
function n(t,e,i,n){return new(i||(i=Promise))((function(s,r){function o(t){try{c(n.next(t))}catch(t){r(t)}}function a(t){try{c(n.throw(t))}catch(t){r(t)}}function c(t){var e;t.done?s(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(o,a)}c((n=n.apply(t,e||[])).next())}))}function s(t,e,i,n){if("a"===i&&!n)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof e?t!==e||!n:!e.has(t))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===i?n:"a"===i?n.call(t):n?n.value:e.get(t)}function r(t,e,i,n,s){if("m"===n)throw new TypeError("Private method is not writable");if("a"===n&&!s)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof e?t!==e||!s:!e.has(t))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===n?s.call(t,i):s?s.value=i:e.set(t,i),i}"function"==typeof SuppressedError&&SuppressedError;class o extends Error{constructor(t,e){super(t),this.name="APIError",this.statusCode=e||500,Error.captureStackTrace(this,this.constructor)}toJSON(){return{error:this.name,message:this.message,statusCode:this.statusCode||500}}}
/**
 * Makes a GET request to the given URL with the provided headers.
 *
 * @param {string} url - The URL to send the GET request to.
 * @param {object} headers - The headers to include in the request.
 * @returns {Promise<object>} - The response data.
 * @throws {APIError} - Throws an error if the request fails.
 */function a(e){return n(this,arguments,void 0,(function*(e,i={}){try{return(yield t.get(e,{headers:i})).data}catch(t){if(t.response)throw new o(t.response.data.message||"API request failed",t.response.status);throw new o("Network error or server is unavailable",500)}}))}
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
function c(t,e={}){const i=function(t={}){return Object.keys(t).map((e=>`${encodeURIComponent(e)}=${encodeURIComponent(t[e])}`)).join("&")}(e);return i?`${t}?${i}`:t}const d="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/twitter",u="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/spotify";const h={id:325e3,name:"Camp Network Testnet V2",nativeCurrency:{decimals:18,name:"Ether",symbol:"ETH"},rpcUrls:{default:{http:["https://rpc-campnetwork.xyz"]}},blockExplorers:{default:{name:"Explorer",url:"https://camp-network-testnet.blockscout.com"}}};function l(t){if(!Number.isSafeInteger(t)||t<0)throw new Error(`positive integer expected, not ${t}`)}
// copied from utils
function f(t,...e){if(!((i=t)instanceof Uint8Array||null!=i&&"object"==typeof i&&"Uint8Array"===i.constructor.name))throw new Error("Uint8Array expected");var i;if(e.length>0&&!e.includes(t.length))throw new Error(`Uint8Array expected of length ${e}, not of length=${t.length}`)}function w(t,e=!0){if(t.destroyed)throw new Error("Hash instance has been destroyed");if(e&&t.finished)throw new Error("Hash#digest() has already been called")}
/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
// node.js versions earlier than v19 don't declare it in global scope.
// For node.js, package.json#exports field mapping rewrites import
// from `crypto` to `cryptoNode`, which imports native module.
// Makes the utils un-importable in browsers without a bundler.
// Once node.js 18 is deprecated (2025-04-30), we can just drop the import.
const p=68===new Uint8Array(new Uint32Array([287454020]).buffer)[0];
// In place byte swap for Uint32Array
function y(t){for(let i=0;i<t.length;i++)t[i]=(e=t[i])<<24&4278190080|e<<8&16711680|e>>>8&65280|e>>>24&255;var e}
/**
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
/**
 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
 * Warning: when Uint8Array is passed, it would NOT get copied.
 * Keep in mind for future mutable operations.
 */
function g(t){return"string"==typeof t&&(t=function(t){if("string"!=typeof t)throw new Error("utf8ToBytes expected string, got "+typeof t);return new Uint8Array((new TextEncoder).encode(t));// https://bugzil.la/1681809
}(t)),f(t),t}
// For runtime check if class implements interface
class m{
// Safe version that clones internal state
clone(){return this._cloneInto()}}const v=BigInt(2**32-1),b=BigInt(32);
// We are not using BigUint64Array, because they are extremely slow as per 2022
function I(t,e=!1){return e?{h:Number(t&v),l:Number(t>>b&v)}:{h:0|Number(t>>b&v),l:0|Number(t&v)}}function A(t,e=!1){let i=new Uint32Array(t.length),n=new Uint32Array(t.length);for(let s=0;s<t.length;s++){const{h:r,l:o}=I(t[s],e);[i[s],n[s]]=[r,o]}return[i,n]}
// Left rotate for Shift in [1, 32)
const k="2.21.37";let $=({docsBaseUrl:t,docsPath:e="",docsSlug:i})=>e?`${t??"https://viem.sh"}${e}${i?`#${i}`:""}`:void 0,T=`viem@${k}`;class E extends Error{constructor(t,e={}){const i=e.cause instanceof E?e.cause.details:e.cause?.message?e.cause.message:e.details,n=e.cause instanceof E&&e.cause.docsPath||e.docsPath,s=$?.({...e,docsPath:n});super([t||"An error occurred.","",...e.metaMessages?[...e.metaMessages,""]:[],...s?[`Docs: ${s}`]:[],...i?[`Details: ${i}`]:[],...T?[`Version: ${T}`]:[]].join("\n"),e.cause?{cause:e.cause}:void 0),Object.defineProperty(this,"details",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"docsPath",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"metaMessages",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"shortMessage",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"version",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),Object.defineProperty(this,"name",{enumerable:!0,configurable:!0,writable:!0,value:"BaseError"}),this.details=i,this.docsPath=n,this.metaMessages=e.metaMessages,this.name=e.name??this.name,this.shortMessage=t,this.version=k}walk(t){return S(this,t)}}function S(t,e){return e?.(t)?t:t&&"object"==typeof t&&"cause"in t?S(t.cause,e):e?null:t}class x extends E{constructor({max:t,min:e,signed:i,size:n,value:s}){super(`Number "${s}" is not in safe ${n?`${8*n}-bit ${i?"signed":"unsigned"} `:""}integer range ${t?`(${e} to ${t})`:`(above ${e})`}`,{name:"IntegerOutOfRangeError"})}}class O extends E{constructor({givenSize:t,maxSize:e}){super(`Size cannot exceed ${e} bytes. Given size: ${t} bytes.`,{name:"SizeOverflowError"})}}class U extends E{constructor({size:t,targetSize:e,type:i}){super(`${i.charAt(0).toUpperCase()}${i.slice(1).toLowerCase()} size (${t}) exceeds padding size (${e}).`,{name:"SizeExceedsPaddingSizeError"})}}function z(t,{dir:e,size:i=32}={}){return"string"==typeof t?function(t,{dir:e,size:i=32}={}){if(null===i)return t;const n=t.replace("0x","");if(n.length>2*i)throw new U({size:Math.ceil(n.length/2),targetSize:i,type:"hex"});return`0x${n["right"===e?"padEnd":"padStart"](2*i,"0")}`}(t,{dir:e,size:i}):function(t,{dir:e,size:i=32}={}){if(null===i)return t;if(t.length>i)throw new U({size:t.length,targetSize:i,type:"bytes"});const n=new Uint8Array(i);for(let s=0;s<i;s++){const r="right"===e;n[r?s:i-s-1]=t[r?s:t.length-s-1]}return n}(t,{dir:e,size:i})}function j(t,{strict:e=!0}={}){return!!t&&("string"==typeof t&&(e?/^0x[0-9a-fA-F]*$/.test(t):t.startsWith("0x")))}
/**
 * @description Retrieves the size of the value (in bytes).
 *
 * @param value The value (hex or byte array) to retrieve the size of.
 * @returns The size of the value (in bytes).
 */function D(t){return j(t,{strict:!1})?Math.ceil((t.length-2)/2):t.length}const P=new TextEncoder;
/**
 * Encodes a UTF-8 string, hex value, bigint, number or boolean to a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes
 * - Example: https://viem.sh/docs/utilities/toBytes#usage
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { toBytes } from 'viem'
 * const data = toBytes('Hello world')
 * // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
 *
 * @example
 * import { toBytes } from 'viem'
 * const data = toBytes(420)
 * // Uint8Array([1, 164])
 *
 * @example
 * import { toBytes } from 'viem'
 * const data = toBytes(420, { size: 4 })
 * // Uint8Array([0, 0, 1, 164])
 */function N(t,e={}){return"number"==typeof t||"bigint"==typeof t?
/**
 * Encodes a number into a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes#numbertobytes
 *
 * @param value Number to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { numberToBytes } from 'viem'
 * const data = numberToBytes(420)
 * // Uint8Array([1, 164])
 *
 * @example
 * import { numberToBytes } from 'viem'
 * const data = numberToBytes(420, { size: 4 })
 * // Uint8Array([0, 0, 1, 164])
 */
function(t,e){const i=
/**
 * Encodes a number or bigint into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#numbertohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { numberToHex } from 'viem'
 * const data = numberToHex(420)
 * // '0x1a4'
 *
 * @example
 * import { numberToHex } from 'viem'
 * const data = numberToHex(420, { size: 32 })
 * // '0x00000000000000000000000000000000000000000000000000000000000001a4'
 */
function(t,e={}){const{signed:i,size:n}=e,s=BigInt(t);let r;n?r=i?(1n<<8n*BigInt(n)-1n)-1n:2n**(8n*BigInt(n))-1n:"number"==typeof t&&(r=BigInt(Number.MAX_SAFE_INTEGER));const o="bigint"==typeof r&&i?-r-1n:0;if(r&&s>r||s<o){const e="bigint"==typeof t?"n":"";throw new x({max:r?`${r}${e}`:void 0,min:`${o}${e}`,signed:i,size:n,value:`${t}${e}`})}const a=`0x${(i&&s<0?(1n<<BigInt(8*n))+BigInt(s):s).toString(16)}`;return n?z(a,{size:n}):a}(t,e);return _(i)}
/**
 * Encodes a UTF-8 string into a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes#stringtobytes
 *
 * @param value String to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { stringToBytes } from 'viem'
 * const data = stringToBytes('Hello world!')
 * // Uint8Array([72, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100, 33])
 *
 * @example
 * import { stringToBytes } from 'viem'
 * const data = stringToBytes('Hello world!', { size: 32 })
 * // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
 */(t,e):"boolean"==typeof t?
/**
 * Encodes a boolean into a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes#booltobytes
 *
 * @param value Boolean value to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { boolToBytes } from 'viem'
 * const data = boolToBytes(true)
 * // Uint8Array([1])
 *
 * @example
 * import { boolToBytes } from 'viem'
 * const data = boolToBytes(true, { size: 32 })
 * // Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1])
 */
function(t,e={}){const i=new Uint8Array(1);if(i[0]=Number(t),"number"==typeof e.size)return W(i,{size:e.size}),z(i,{size:e.size});return i}
// We use very optimized technique to convert hex string to byte array
(t,e):j(t)?_(t,e):B(t,e)}const C={zero:48,nine:57,A:65,F:70,a:97,f:102};function L(t){return t>=C.zero&&t<=C.nine?t-C.zero:t>=C.A&&t<=C.F?t-(C.A-10):t>=C.a&&t<=C.f?t-(C.a-10):void 0}
/**
 * Encodes a hex string into a byte array.
 *
 * - Docs: https://viem.sh/docs/utilities/toBytes#hextobytes
 *
 * @param hex Hex string to encode.
 * @param opts Options.
 * @returns Byte array value.
 *
 * @example
 * import { hexToBytes } from 'viem'
 * const data = hexToBytes('0x48656c6c6f20776f726c6421')
 * // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
 *
 * @example
 * import { hexToBytes } from 'viem'
 * const data = hexToBytes('0x48656c6c6f20776f726c6421', { size: 32 })
 * // Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
 */function _(t,e={}){let i=t;e.size&&(W(i,{size:e.size}),i=z(i,{dir:"right",size:e.size}));let n=i.slice(2);n.length%2&&(n=`0${n}`);const s=n.length/2,r=new Uint8Array(s);for(let t=0,e=0;t<s;t++){const i=L(n.charCodeAt(e++)),s=L(n.charCodeAt(e++));if(void 0===i||void 0===s)throw new E(`Invalid byte sequence ("${n[e-2]}${n[e-1]}" in "${n}").`);r[t]=16*i+s}return r}function B(t,e={}){const i=P.encode(t);return"number"==typeof e.size?(W(i,{size:e.size}),z(i,{dir:"right",size:e.size})):i}function W(t,{size:e}){if(D(t)>e)throw new O({givenSize:D(t),maxSize:e})}class M extends E{constructor({address:t}){super(`Address "${t}" is invalid.`,{metaMessages:["- Address must be a hex value of 20 bytes (40 hex characters).","- Address must match its checksum counterpart."],name:"InvalidAddressError"})}}
/**
 * Map with a LRU (Least recently used) policy.
 *
 * @link https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU
 */class F extends Map{constructor(t){super(),Object.defineProperty(this,"maxSize",{enumerable:!0,configurable:!0,writable:!0,value:void 0}),this.maxSize=t}get(t){const e=super.get(t);return super.has(t)&&void 0!==e&&(this.delete(t),super.set(t,e)),e}set(t,e){if(super.set(t,e),this.maxSize&&this.size>this.maxSize){const t=this.keys().next().value;t&&this.delete(t)}return this}}
// SHA3 (keccak) is based on a new design: basically, the internal state is bigger than output size.
// It's called a sponge function.
// Various per round constants calculations
const R=[],q=[],K=[],J=BigInt(0),H=BigInt(1),X=BigInt(2),G=BigInt(7),V=BigInt(256),Y=BigInt(113);for(let t=0,e=H,i=1,n=0;t<24;t++){
// Pi
[i,n]=[n,(2*i+3*n)%5],R.push(2*(5*n+i)),
// Rotational
q.push((t+1)*(t+2)/2%64);
// Iota
let s=J;for(let t=0;t<7;t++)e=(e<<H^(e>>G)*Y)%V,e&X&&(s^=H<<(H<<BigInt(t))-H);K.push(s)}const[Q,Z]=A(K,!0),tt=(t,e,i)=>i>32?((t,e,i)=>e<<i-32|t>>>64-i)(t,e,i):((t,e,i)=>t<<i|e>>>32-i)(t,e,i),et=(t,e,i)=>i>32?((t,e,i)=>t<<i-32|e>>>64-i)(t,e,i):((t,e,i)=>e<<i|t>>>32-i)
// Left rotate for Shift in (32, 64), NOTE: 32 is special case.
(t,e,i)
// Same as keccakf1600, but allows to skip some rounds;
// Left rotation (without 0, 32, 64)
class it extends m{
// NOTE: we accept arguments in bytes instead of bits here.
constructor(t,e,i,n=!1,s=24){
// 1600 = 5x5 matrix of 64bit.  1600 bits === 200 bytes
if(super(),this.blockLen=t,this.suffix=e,this.outputLen=i,this.enableXOF=n,this.rounds=s,this.pos=0,this.posOut=0,this.finished=!1,this.destroyed=!1,
// Can be passed from user as dkLen
l(i),0>=this.blockLen||this.blockLen>=200)throw new Error("Sha3 supports only keccak-f1600 function");var r;this.state=new Uint8Array(200),this.state32=(r=this.state,new Uint32Array(r.buffer,r.byteOffset,Math.floor(r.byteLength/4)))}keccak(){p||y(this.state32),function(t,e=24){const i=new Uint32Array(10);
// NOTE: all indices are x2 since we store state as u32 instead of u64 (bigints to slow in js)
for(let n=24-e;n<24;n++){
// Theta θ
for(let e=0;e<10;e++)i[e]=t[e]^t[e+10]^t[e+20]^t[e+30]^t[e+40];for(let e=0;e<10;e+=2){const n=(e+8)%10,s=(e+2)%10,r=i[s],o=i[s+1],a=tt(r,o,1)^i[n],c=et(r,o,1)^i[n+1];for(let i=0;i<50;i+=10)t[e+i]^=a,t[e+i+1]^=c}
// Rho (ρ) and Pi (π)
let e=t[2],s=t[3];for(let i=0;i<24;i++){const n=q[i],r=tt(e,s,n),o=et(e,s,n),a=R[i];e=t[a],s=t[a+1],t[a]=r,t[a+1]=o}
// Chi (χ)
for(let e=0;e<50;e+=10){for(let n=0;n<10;n++)i[n]=t[e+n];for(let n=0;n<10;n++)t[e+n]^=~i[(n+2)%10]&i[(n+4)%10]}
// Iota (ι)
t[0]^=Q[n],t[1]^=Z[n]}i.fill(0)}(this.state32,this.rounds),p||y(this.state32),this.posOut=0,this.pos=0}update(t){w(this);const{blockLen:e,state:i}=this,n=(t=g(t)).length;for(let s=0;s<n;){const r=Math.min(e-this.pos,n-s);for(let e=0;e<r;e++)i[this.pos++]^=t[s++];this.pos===e&&this.keccak()}return this}finish(){if(this.finished)return;this.finished=!0;const{state:t,suffix:e,pos:i,blockLen:n}=this;
// Do the padding
t[i]^=e,128&e&&i===n-1&&this.keccak(),t[n-1]^=128,this.keccak()}writeInto(t){w(this,!1),f(t),this.finish();const e=this.state,{blockLen:i}=this;for(let n=0,s=t.length;n<s;){this.posOut>=i&&this.keccak();const r=Math.min(i-this.posOut,s-n);t.set(e.subarray(this.posOut,this.posOut+r),n),this.posOut+=r,n+=r}return t}xofInto(t){
// Sha3/Keccak usage with XOF is probably mistake, only SHAKE instances can do XOF
if(!this.enableXOF)throw new Error("XOF is not possible for this instance");return this.writeInto(t)}xof(t){return l(t),this.xofInto(new Uint8Array(t))}digestInto(t){if(function(t,e){f(t);const i=e.outputLen;if(t.length<i)throw new Error(`digestInto() expects output buffer of length at least ${i}`)}(t,this),this.finished)throw new Error("digest() was already called");return this.writeInto(t),this.destroy(),t}digest(){return this.digestInto(new Uint8Array(this.outputLen))}destroy(){this.destroyed=!0,this.state.fill(0)}_cloneInto(t){const{blockLen:e,suffix:i,outputLen:n,rounds:s,enableXOF:r}=this;return t||(t=new it(e,i,n,r,s)),t.state32.set(this.state32),t.pos=this.pos,t.posOut=this.posOut,t.finished=this.finished,t.rounds=s,
// Suffix can change in cSHAKE
t.suffix=i,t.outputLen=n,t.enableXOF=r,t.destroyed=this.destroyed,t}}const nt=((t,e,i)=>function(t){const e=e=>t().update(g(e)).digest(),i=t();return e.outputLen=i.outputLen,e.blockLen=i.blockLen,e.create=()=>t(),e}((()=>new it(e,t,i))))
/**
 * keccak-256 hash function. Different from SHA3-256.
 * @param message - that would be hashed
 */(1,136,32);const st=new F(8192);function rt(t,
/**
 * Warning: EIP-1191 checksum addresses are generally not backwards compatible with the
 * wider Ethereum ecosystem, meaning it will break when validated against an application/tool
 * that relies on EIP-55 checksum encoding (checksum without chainId).
 *
 * It is highly recommended to not use this feature unless you
 * know what you are doing.
 *
 * See more: https://github.com/ethereum/EIPs/issues/1121
 */
e){if(st.has(`${t}.${e}`))return st.get(`${t}.${e}`);const i=t.substring(2).toLowerCase(),n=(s=B(i),nt(j(s,{strict:!1})?N(s):s));var s;const r=i.split("");for(let t=0;t<40;t+=2)n[t>>1]>>4>=8&&r[t]&&(r[t]=r[t].toUpperCase()),(15&n[t>>1])>=8&&r[t+1]&&(r[t+1]=r[t+1].toUpperCase());const o=`0x${r.join("")}`;return st.set(`${t}.${e}`,o),o}const ot=/^0x[a-fA-F0-9]{40}$/,at=new F(8192);
/** @internal */function ct(t,e){const{strict:i=!0}=e??{},n=`${t}.${i}`;if(at.has(n))return at.get(n);const s=!(!ot.test(t)||t.toLowerCase()!==t&&i&&rt(t)!==t);return at.set(n,s),s}
// TODO(v3): Rename to `toLocalAccount` + add `source` property to define source (privateKey, mnemonic, hdKey, etc).
/**
 * @description Creates an Account from a custom signing implementation.
 *
 * @returns A Local Account.
 */
// @ts-ignore
let dt=null;const ut=(t,i="window.ethereum",n)=>{var s;if(!t&&!dt)return console.warn("Provider is required to create a client."),null;if(!dt||dt.transport.name!==i&&t||n!==(null===(s=dt.account)||void 0===s?void 0:s.address)&&t){const s={chain:h,transport:e.custom(t,{name:i})};n&&(s.account=function(t){if("string"==typeof t){if(!ct(t,{strict:!1}))throw new M({address:t});return{address:t,type:"json-rpc"}}if(!ct(t.address,{strict:!1}))throw new M({address:t.address});return{address:t.address,nonceManager:t.nonceManager,sign:t.sign,experimental_signAuthorization:t.experimental_signAuthorization,signMessage:t.signMessage,signTransaction:t.signTransaction,signTypedData:t.signTypedData,source:"custom",type:"local"}}(n)),dt=e.createWalletClient(s)}return dt};var ht="Connect with Camp Network",lt="https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",ft="https://ackee-production-01bd.up.railway.app",wt={USER_CONNECTED:"ed42542d-b676-4112-b6d9-6db98048b2e0",USER_DISCONNECTED:"20af31ac-e602-442e-9e0e-b589f4dd4016",TWITTER_LINKED:"7fbea086-90ef-4679-ba69-f47f9255b34c",DISCORD_LINKED:"d73f5ae3-a8e8-48f2-8532-85e0c7780d6a",SPOTIFY_LINKED:"fc1788b4-c984-42c8-96f4-c87f6bb0b8f7",TIKTOK_LINKED:"4a2ffdd3-f0e9-4784-8b49-ff76ec1c0a6a",TELEGRAM_LINKED:"9006bc5d-bcc9-4d01-a860-4f1a201e8e47"};let pt=[];const yt=()=>pt,gt=t=>{function e(e){pt.some((t=>t.info.uuid===e.detail.info.uuid))||(pt=[...pt,e.detail],t(pt))}if("undefined"!=typeof window)return window.addEventListener("eip6963:announceProvider",e),window.dispatchEvent(new Event("eip6963:requestProvider")),()=>window.removeEventListener("eip6963:announceProvider",e)};var mt,vt,bt,It,At,kt,$t,Tt,Et,St;vt=new WeakMap,bt=new WeakMap,mt=new WeakSet,It=function(t,e){s(this,vt,"f")[t]&&s(this,vt,"f")[t].forEach((t=>t(e)))},At=function(){if("undefined"==typeof localStorage)return;const t=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:wallet-address"),e=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:user-id"),i=null===localStorage||void 0===localStorage?void 0:localStorage.getItem("camp-sdk:jwt");t&&e&&i?(this.walletAddress=t,this.userId=e,this.jwt=i,this.isAuthenticated=!0):this.isAuthenticated=!1},kt=function(){return n(this,void 0,void 0,(function*(){try{const[t]=yield this.viem.requestAddresses();return this.walletAddress=t,t}catch(t){throw new o(t)}}))},$t=function(){return n(this,void 0,void 0,(function*(){try{const t=yield fetch(`${lt}/auth/client-user/nonce`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({walletAddress:this.walletAddress})}),e=yield t.json();return 200!==t.status?Promise.reject(e.message||"Failed to fetch nonce"):e.data}catch(t){throw new Error(t)}}))},Tt=function(t,e){return n(this,void 0,void 0,(function*(){try{const i=yield fetch(`${lt}/auth/client-user/verify`,{method:"POST",headers:{"Content-Type":"application/json","x-client-id":this.clientId},body:JSON.stringify({message:t,signature:e,walletAddress:this.walletAddress})}),n=yield i.json(),s=n.data.split(".")[1],r=JSON.parse(atob(s));return{success:!n.isError,userId:r.id,token:n.data}}catch(t){throw new o(t)}}))},Et=function(t){return i.createSiweMessage({domain:window.location.host,address:this.walletAddress,statement:ht,uri:window.location.origin,version:"1",chainId:this.viem.chain.id,nonce:t})},St=function(t,e){return n(this,arguments,void 0,(function*(t,e,i=1){yield((t,e,i,s)=>n(void 0,void 0,void 0,(function*(){return new Promise(((n,r)=>{if("undefined"!=typeof window&&null!==t)try{t.action(e,{key:i,value:s},(t=>{n(t)}))}catch(t){console.error(t),r(t)}else r(new Error("Unable to send analytics event. If you are using the library, you can ignore this error."))}))})))
/**
 * The TwitterAPI class.
 * @class
 * @classdesc The TwitterAPI class is used to interact with the Twitter API.
 */(s(this,bt,"f"),t,e,i)}))};
/**
The MIT License (MIT)

Copyright (c) Tobias Reich

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
const xt="undefined"!=typeof window,Ot=xt?window.navigator:{userAgent:"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",language:"en",languages:[],platform:"",vendor:"",maxTouchPoints:0,hardwareConcurrency:0,deviceMemory:0},Ut=function(t){return"88888888-8888-8888-8888-888888888888"===t},zt=function(){return"hidden"===document.visibilityState},jt=function(){const t=(location.search.split("source=")[1]||"").split("&")[0];return""===t?void 0:t},Dt=function(t=!1){const e={siteLocation:window.location.href,siteReferrer:document.referrer,source:jt()},i={siteLanguage:Ot?((null==Ot?void 0:Ot.language)||(null==Ot?void 0:Ot.language)||"").substr(0,2):"",screenWidth:screen.width,screenHeight:screen.height,screenColorDepth:screen.colorDepth,browserWidth:window.outerWidth,browserHeight:window.outerHeight};return Object.assign(Object.assign({},e),!0===t?i:{})},Pt=function(t){return{query:"\n\t\t\tmutation updateRecord($recordId: ID!) {\n\t\t\t\tupdateRecord(id: $recordId) {\n\t\t\t\t\tsuccess\n\t\t\t\t}\n\t\t\t}\n\t\t",variables:{recordId:t}}},Nt=function(t,e,i,n){const s=new XMLHttpRequest;s.open("POST",t),s.onload=()=>{if(200!==s.status)throw new Error("Server returned with an unhandled status");let t=null;try{t=JSON.parse(s.responseText)}catch(t){throw new Error("Failed to parse response from server")}if(null!=t.errors)throw new Error(t.errors[0].message);if("function"==typeof n)return n(t)},s.setRequestHeader("Content-Type","application/json;charset=UTF-8"),
//   xhr.withCredentials = opts.ignoreOwnVisits ?? false;
s.withCredentials=!1,s.send(JSON.stringify(e))},Ct=function(){const t=document.querySelector("[data-ackee-domain-id]");if(null==t)return;const e=t.getAttribute("data-ackee-server")||"",i=t.getAttribute("data-ackee-domain-id")||"",n=t.getAttribute("data-ackee-opts")||"{}";Lt(e,JSON.parse(n)).record(i)},Lt=function(t,e){e=function(t={}){
// Create new object to avoid changes by reference
const e={};
// Defaults to false
return e.detailed=!0===t.detailed,
// Defaults to true
e.ignoreLocalhost=!1!==t.ignoreLocalhost,
// Defaults to true
e.ignoreOwnVisits=!1!==t.ignoreOwnVisits,e}(e);const i=function(t){const e="/"===t.substr(-1);return t+(!0===e?"":"/")+"api"}(t),n=()=>{},s={record:()=>({stop:n}),updateRecord:()=>({stop:n}),action:n,updateAction:n};if(!0===e.ignoreLocalhost&&!0==(""===(r=location.hostname)||"localhost"===r||"127.0.0.1"===r||"::1"===r))return console.warn("Ackee ignores you because you are on localhost"),s;var r,o;if(!0===(o=Ot?Ot.userAgent:"",/bot|crawler|spider|crawling/i.test(o)))return console.warn("Ackee ignores you because you are a bot"),s;
// Creates a new record on the server and updates the record
// very x seconds to track the duration of the visit. Tries to use
// the default attributes when there're no custom attributes defined.
// Return the real instance
return{record:(t,n=Dt(e.detailed),s)=>{
// Function to stop updating the record
let r=!1;return Nt(i,function(t,e){return{query:"\n\t\t\tmutation createRecord($domainId: ID!, $input: CreateRecordInput!) {\n\t\t\t\tcreateRecord(domainId: $domainId, input: $input) {\n\t\t\t\t\tpayload {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t",variables:{domainId:t,input:e}}}(t,n),0,(t=>{const e=t.data.createRecord.payload.id;if(!0===Ut(e))return console.warn("Ackee ignores you because this is your own site");const n=setInterval((()=>{!0!==r?!0!==zt()&&Nt(i,Pt(e)):clearInterval(n)}),15e3);return"function"==typeof s?s(e):void 0})),{stop:()=>{r=!0}}},updateRecord:t=>{
// Function to stop updating the record
let e=!1;const n=()=>{e=!0};if(!0===Ut(t))return console.warn("Ackee ignores you because this is your own site"),{stop:n};const s=setInterval((()=>{!0!==e?!0!==zt()&&Nt(i,Pt(t)):clearInterval(s)}),15e3);return{stop:n}},action:(t,e,n)=>{Nt(i,function(t,e){return{query:"\n\t\t\tmutation createAction($eventId: ID!, $input: CreateActionInput!) {\n\t\t\t\tcreateAction(eventId: $eventId, input: $input) {\n\t\t\t\t\tpayload {\n\t\t\t\t\t\tid\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t",variables:{eventId:t,input:e}}}(t,e),0,(t=>{const e=t.data.createAction.payload.id;return!0===Ut(e)?console.warn("Ackee ignores you because this is your own site"):"function"==typeof n?n(e):void 0}))},updateAction:(t,e)=>{if(!0===Ut(t))return console.warn("Ackee ignores you because this is your own site");Nt(i,function(t,e){return{query:"\n\t\t\tmutation updateAction($actionId: ID!, $input: UpdateActionInput!) {\n\t\t\t\tupdateAction(id: $actionId, input: $input) {\n\t\t\t\t\tsuccess\n\t\t\t\t}\n\t\t\t}\n\t\t",variables:{actionId:t,input:e}}}(t,e))}}};
// Only run Ackee automatically when executed in a browser environment
!0===xt&&Ct();var _t=Object.freeze({__proto__:null,attributes:Dt,create:Lt,detect:Ct});exports.Ackee=_t,exports.Auth=
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
constructor({clientId:t,redirectUri:e,allowAnalytics:i=!0,ackeeInstance:n}){if(mt.add(this),vt.set(this,void 0),bt.set(this,void 0),!t)throw new Error("clientId is required");this.viem=null,"undefined"!=typeof window&&window.ethereum&&(this.viem=ut(window.ethereum)),this.redirectUri=(t=>{const e=["twitter","discord","spotify"];return"object"==typeof t?e.reduce(((e,i)=>(e[i]=t[i]||("undefined"!=typeof window?window.location.href:""),e)),{}):"string"==typeof t?e.reduce(((e,i)=>(e[i]=t,e)),{}):t?{}:e.reduce(((t,e)=>(t[e]="undefined"!=typeof window?window.location.href:"",t)),{})})(e),n&&r(this,bt,n,"f"),i&&!s(this,bt,"f")&&r(this,bt,Lt(ft,{detailed:!1,ignoreLocalhost:!0,ignoreOwnVisits:!1}),"f"),this.clientId=t,this.isAuthenticated=!1,this.jwt=null,this.walletAddress=null,this.userId=null,r(this,vt,{},"f"),gt((t=>{s(this,mt,"m",It).call(this,"providers",t)})),s(this,mt,"m",At).call(this)}
/**
     * Subscribe to an event. Possible events are "state", "provider", and "providers".
     * @param {("state"|"provider"|"providers")} event The event.
     * @param {function} callback The callback function.
     * @returns {void}
     * @example
     * auth.on("state", (state) => {
     *  console.log(state);
     * });
     */on(t,e){s(this,vt,"f")[t]||(s(this,vt,"f")[t]=[]),s(this,vt,"f")[t].push(e),"providers"===t&&e(yt())}
/**
     * Set the loading state.
     * @param {boolean} loading The loading state.
     * @returns {void}
     */setLoading(t){s(this,mt,"m",It).call(this,"state",t?"loading":this.isAuthenticated?"authenticated":"unauthenticated")}
/**
     * Set the provider. This is useful for setting the provider when the user selects a provider from the UI or when dApp wishes to use a specific provider.
     * @param {object} options The options object. Includes the provider and the provider info.
     * @returns {void}
     * @throws {APIError} - Throws an error if the provider is not provided.
     */setProvider({provider:t,info:e,address:i}){if(!t)throw new o("provider is required");this.viem=ut(t,e.name,i),s(this,mt,"m",It).call(this,"provider",{provider:t,info:e})}
/**
     * Set the wallet address. This is useful for edge cases where the provider can't return the wallet address. Don't use this unless you know what you're doing.
     * @param {string} walletAddress The wallet address.
     * @returns {void}
     */setWalletAddress(t){this.walletAddress=t}
/**
     * Disconnect the user.
     * @returns {Promise<void>}
     */disconnect(){return n(this,void 0,void 0,(function*(){this.isAuthenticated&&(this.isAuthenticated=!1,this.walletAddress=null,this.userId=null,this.jwt=null,localStorage.removeItem("camp-sdk:wallet-address"),localStorage.removeItem("camp-sdk:user-id"),localStorage.removeItem("camp-sdk:jwt"),s(this,mt,"m",It).call(this,"state","unauthenticated"),yield s(this,mt,"m",St).call(this,wt.USER_DISCONNECTED,"User Disconnected"))}))}
/**
     * Connect the user's wallet and sign the message.
     * @returns {Promise<{ success: boolean; message: string; walletAddress: string }>} A promise that resolves with the authentication result.
     * @throws {APIError} - Throws an error if the user cannot be authenticated.
     */connect(){return n(this,void 0,void 0,(function*(){s(this,mt,"m",It).call(this,"state","loading");try{this.walletAddress||(yield s(this,mt,"m",kt).call(this));const t=yield s(this,mt,"m",$t).call(this),e=s(this,mt,"m",Et).call(this,t),i=yield this.viem.signMessage({account:this.walletAddress,message:e}),n=yield s(this,mt,"m",Tt).call(this,e,i);if(n.success)return this.isAuthenticated=!0,this.userId=n.userId,this.jwt=n.token,localStorage.setItem("camp-sdk:jwt",this.jwt),localStorage.setItem("camp-sdk:wallet-address",this.walletAddress),localStorage.setItem("camp-sdk:user-id",this.userId),s(this,mt,"m",It).call(this,"state","authenticated"),yield s(this,mt,"m",St).call(this,wt.USER_CONNECTED,"User Connected"),{success:!0,message:"Successfully authenticated",walletAddress:this.walletAddress};throw this.isAuthenticated=!1,s(this,mt,"m",It).call(this,"state","unauthenticated"),new o("Failed to authenticate")}catch(t){throw this.isAuthenticated=!1,s(this,mt,"m",It).call(this,"state","unauthenticated"),new o(t)}}))}
/**
     * Get the user's linked social accounts.
     * @returns {Promise<Record<string, boolean>>} A promise that resolves with the user's linked social accounts.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated or if the request fails.
     * @example
     * const auth = new Auth({ clientId: "your-client-id" });
     * const socials = await auth.getLinkedSocials();
     * console.log(socials);
     */getLinkedSocials(){return n(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const t=yield fetch(`${lt}/auth/client-user/connections-sdk`,{method:"GET",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"}}).then((t=>t.json()));if(t.isError)throw new o(t.message||"Failed to fetch connections");{const e={};return Object.keys(t.data.data).forEach((i=>{e[i.split("User")[0]]=t.data.data[i]})),e}}))}
/**
     * Link the user's Twitter account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkTwitter(){return n(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");yield s(this,mt,"m",St).call(this,wt.TWITTER_LINKED,"Twitter Linked"),window.location.href=`${lt}/twitter/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.twitter}`}))}
/**
     * Link the user's Discord account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkDiscord(){return n(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");yield s(this,mt,"m",St).call(this,wt.DISCORD_LINKED,"Discord Linked"),window.location.href=`${lt}/discord/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.discord}`}))}
/**
     * Link the user's Spotify account.
     * @returns {Promise<void>}
     * @throws {Error} - Throws an error if the user is not authenticated.
     */linkSpotify(){return n(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");yield s(this,mt,"m",St).call(this,wt.SPOTIFY_LINKED,"Spotify Linked"),window.location.href=`${lt}/spotify/connect?clientId=${this.clientId}&userId=${this.userId}&redirect_url=${this.redirectUri.spotify}`}))}
/**
     * Link the user's TikTok account.
     * @param {string} handle The user's TikTok handle.
     * @returns {Promise<any>} A promise that resolves with the TikTok account data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */linkTikTok(t){return n(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const e=yield fetch(`${lt}/tiktok/connect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userHandle:t,clientId:this.clientId,userId:this.userId})}).then((t=>t.json()));if(e.isError)throw"Request failed with status code 502"===e.message?new o("TikTok service is currently unavailable, try again later"):new o(e.message||"Failed to link TikTok account");return s(this,mt,"m",St).call(this,wt.TIKTOK_LINKED,"TikTok Linked"),e.data}))}
/**
     * Send an OTP to the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @returns {Promise<any>} A promise that resolves with the OTP data.
     * @throws {Error|APIError} - Throws an error if the user is not authenticated.
     */sendTelegramOTP(t){return n(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!t)throw new o("Phone number is required");yield this.unlinkTelegram();const e=yield fetch(`${lt}/telegram/sendOTP-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:t})}).then((t=>t.json()));if(e.isError)throw new o(e.message||"Failed to send Telegram OTP");return e.data}))}
/**
     * Link the user's Telegram account.
     * @param {string} phoneNumber The user's phone number.
     * @param {string} otp The OTP.
     * @param {string} phoneCodeHash The phone code hash.
     * @returns {Promise<object>} A promise that resolves with the Telegram account data.
     * @throws {APIError|Error} - Throws an error if the user is not authenticated. Also throws an error if the phone number, OTP, and phone code hash are not provided.
     */linkTelegram(t,e,i){return n(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");if(!t||!e||!i)throw new o("Phone number, OTP, and phone code hash are required");const n=yield fetch(`${lt}/telegram/signIn-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({phone:t,code:e,phone_code_hash:i,userId:this.userId,clientId:this.clientId})}).then((t=>t.json()));if(n.isError)throw new o(n.message||"Failed to link Telegram account");return s(this,mt,"m",St).call(this,wt.TELEGRAM_LINKED,"Telegram Linked"),n.data}))}
/**
     * Unlink the user's Twitter account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTwitter(){return n(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new Error("User needs to be authenticated");const t=yield fetch(`${lt}/twitter/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((t=>t.json()));if(t.isError)throw new o(t.message||"Failed to unlink Twitter account");return t.data}))}
/**
     * Unlink the user's Discord account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkDiscord(){return n(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new o("User needs to be authenticated");const t=yield fetch(`${lt}/discord/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((t=>t.json()));if(t.isError)throw new o(t.message||"Failed to unlink Discord account");return t.data}))}
/**
     * Unlink the user's Spotify account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkSpotify(){return n(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new o("User needs to be authenticated");const t=yield fetch(`${lt}/spotify/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({id:this.userId})}).then((t=>t.json()));if(t.isError)throw new o(t.message||"Failed to unlink Spotify account");return t.data}))}
/**
     * Unlink the user's TikTok account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTikTok(){return n(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new o("User needs to be authenticated");const t=yield fetch(`${lt}/tiktok/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((t=>t.json()));if(t.isError)throw new o(t.message||"Failed to unlink TikTok account");return t.data}))}
/**
     * Unlink the user's Telegram account.
     * @returns {Promise<any>} A promise that resolves with the unlink result.
     * @throws {Error} - Throws an error if the user is not authenticated.
     * @throws {APIError} - Throws an error if the request fails.
     */unlinkTelegram(){return n(this,void 0,void 0,(function*(){if(!this.isAuthenticated)throw new o("User needs to be authenticated");const t=yield fetch(`${lt}/telegram/disconnect-sdk`,{method:"POST",redirect:"follow",headers:{Authorization:`Bearer ${this.jwt}`,"x-client-id":this.clientId,"Content-Type":"application/json"},body:JSON.stringify({userId:this.userId})}).then((t=>t.json()));if(t.isError)throw new o(t.message||"Failed to unlink Telegram account");return t.data}))}},exports.SpotifyAPI=
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
     */fetchSavedTracksById(t){return n(this,void 0,void 0,(function*(){const e=c(`${u}/save-tracks`,{spotifyId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch the played tracks of a user by Spotify ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The played tracks.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchPlayedTracksById(t){return n(this,void 0,void 0,(function*(){const e=c(`${u}/played-tracks`,{spotifyId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch the user's saved albums by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved albums.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedAlbumsById(t){return n(this,void 0,void 0,(function*(){const e=c(`${u}/saved-albums`,{spotifyId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch the user's saved playlists by Spotify user ID.
     * @param {string} spotifyId - The user's Spotify ID.
     * @returns {Promise<object>} - The saved playlists.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchSavedPlaylistsById(t){return n(this,void 0,void 0,(function*(){const e=c(`${u}/saved-playlists`,{spotifyId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch the tracks of an album by album ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} albumId - The album ID.
     * @returns {Promise<object>} - The tracks in the album.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInAlbum(t,e){return n(this,void 0,void 0,(function*(){const i=c(`${u}/album/tracks`,{spotifyId:t,albumId:e});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch the tracks in a playlist by playlist ID.
     * @param {string} spotifyId - The Spotify ID of the user.
     * @param {string} playlistId - The playlist ID.
     * @returns {Promise<object>} - The tracks in the playlist.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTracksInPlaylist(t,e){return n(this,void 0,void 0,(function*(){const i=c(`${u}/playlist/tracks`,{spotifyId:t,playlistId:e});return this._fetchDataWithAuth(i)}))}
/**
     * Fetch the user's Spotify data by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @returns {Promise<object>} - The user's Spotify data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(t){return n(this,void 0,void 0,(function*(){const e=c(`${u}/wallet-spotify-data`,{walletAddress:t});return this._fetchDataWithAuth(e)}))}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(t){return n(this,void 0,void 0,(function*(){if(!this.apiKey)throw new o("API key is required for fetching data",401);try{return yield a(t,{"x-api-key":this.apiKey})}catch(t){throw new o(t.message,t.statusCode)}}))}},exports.TwitterAPI=class{
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
     */fetchUserByUsername(t){return n(this,void 0,void 0,(function*(){const e=c(`${d}/user`,{twitterUserName:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetsByUsername(t){return n(this,arguments,void 0,(function*(t,e=1,i=10){const n=c(`${d}/tweets`,{twitterUserName:t,page:e,limit:i});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch followers by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The followers.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowersByUsername(t){return n(this,arguments,void 0,(function*(t,e=1,i=10){const n=c(`${d}/followers`,{twitterUserName:t,page:e,limit:i});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch following by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The following.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowingByUsername(t){return n(this,arguments,void 0,(function*(t,e=1,i=10){const n=c(`${d}/following`,{twitterUserName:t,page:e,limit:i});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch tweet by tweet ID.
     * @param {string} tweetId - The tweet ID.
     * @returns {Promise<object>} - The tweet.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchTweetById(t){return n(this,void 0,void 0,(function*(){const e=c(`${d}/getTweetById`,{tweetId:t});return this._fetchDataWithAuth(e)}))}
/**
     * Fetch user by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The user data.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchUserByWalletAddress(t){return n(this,arguments,void 0,(function*(t,e=1,i=10){const n=c(`${d}/wallet-twitter-data`,{walletAddress:t,page:e,limit:i});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch reposted tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The reposted tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepostedByUsername(t){return n(this,arguments,void 0,(function*(t,e=1,i=10){const n=c(`${d}/reposted`,{twitterUserName:t,page:e,limit:i});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch replies by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The replies.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchRepliesByUsername(t){return n(this,arguments,void 0,(function*(t,e=1,i=10){const n=c(`${d}/replies`,{twitterUserName:t,page:e,limit:i});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch likes by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The likes.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchLikesByUsername(t){return n(this,arguments,void 0,(function*(t,e=1,i=10){const n=c(`${d}/event/likes/${t}`,{page:e,limit:i});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch follows by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The follows.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchFollowsByUsername(t){return n(this,arguments,void 0,(function*(t,e=1,i=10){const n=c(`${d}/event/follows/${t}`,{page:e,limit:i});return this._fetchDataWithAuth(n)}))}
/**
     * Fetch viewed tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The viewed tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */fetchViewedTweetsByUsername(t){return n(this,arguments,void 0,(function*(t,e=1,i=10){const n=c(`${d}/event/viewed-tweets/${t}`,{page:e,limit:i});return this._fetchDataWithAuth(n)}))}
/**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */_fetchDataWithAuth(t){return n(this,void 0,void 0,(function*(){if(!this.apiKey)throw new o("API key is required for fetching data",401);try{return yield a(t,{"x-api-key":this.apiKey})}catch(t){throw new o(t.message,t.statusCode)}}))}};
