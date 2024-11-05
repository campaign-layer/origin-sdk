'use strict';

var axios = require('axios');
var viem = require('viem');

class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
  toJSON() {
    return {
      error: this.name,
      message: this.message,
      statusCode: this.statusCode || 500
    };
  }
}

// const axios = require("axios");

/**
 * Makes a GET request to the given URL with the provided headers.
 *
 * @param {string} url - The URL to send the GET request to.
 * @param {object} headers - The headers to include in the request.
 * @returns {Promise<object>} - The response data.
 * @throws {APIError} - Throws an error if the request fails.
 */
async function fetchData(url, headers = {}) {
  try {
    const response = await axios.get(url, {
      headers
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new APIError(error.response.data.message || "API request failed", error.response.status);
    }
    throw new APIError("Network error or server is unavailable", 500);
  }
}

/**
 * Constructs a query string from an object of query parameters.
 *
 * @param {object} params - An object representing query parameters.
 * @returns {string} - The encoded query string.
 */
function buildQueryString(params = {}) {
  return Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join("&");
}

/**
 * Builds a complete URL with query parameters.
 *
 * @param {string} baseURL - The base URL of the endpoint.
 * @param {object} params - An object representing query parameters.
 * @returns {string} - The complete URL with query string.
 */
function buildURL(baseURL, params = {}) {
  const queryString = buildQueryString(params);
  return queryString ? `${baseURL}?${queryString}` : baseURL;
}
const baseURL = "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/twitter";

/**
 * The TwitterAPI class.
 * @class
 * @classdesc The TwitterAPI class is used to interact with the Twitter API.
 */
class TwitterAPI {
  /**
   * Constructor for the TwitterAPI class.
   * @param {object} options - The options object.
   * @param {string} options.apiKey - The API key. (Needed for data fetching)
   * @param {string} options.clientId - The client ID. (Needed for authentication)
   */
  constructor({
    apiKey,
    clientId
  }) {
    this.apiKey = apiKey;
    this.clientId = clientId;
  }

  /**
   * Fetch Twitter user details by username.
   * @param {string} twitterUserName - The Twitter username.
   * @returns {Promise<object>} - The user details.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchUserByUsername(twitterUserName) {
    const url = buildURL(`${baseURL}/user`, {
      twitterUserName
    });
    return this._fetchDataWithAuth(url);
  }

  /**
   * Fetch tweets by Twitter username.
   * @param {string} twitterUserName - The Twitter username.
   * @param {number} page - The page number.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<object>} - The tweets.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchTweetsByUsername(twitterUserName, page = 1, limit = 10) {
    const url = buildURL(`${baseURL}/tweets`, {
      twitterUserName,
      page,
      limit
    });
    return this._fetchDataWithAuth(url);
  }

  /**
   * Fetch followers by Twitter username.
   * @param {string} twitterUserName - The Twitter username.
   * @param {number} page - The page number.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<object>} - The followers.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchFollowersByUsername(twitterUserName, page = 1, limit = 10) {
    const url = buildURL(`${baseURL}/followers`, {
      twitterUserName,
      page,
      limit
    });
    return this._fetchDataWithAuth(url);
  }

  /**
   * Fetch following by Twitter username.
   * @param {string} twitterUserName - The Twitter username.
   * @param {number} page - The page number.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<object>} - The following.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchFollowingByUsername(twitterUserName, page = 1, limit = 10) {
    const url = buildURL(`${baseURL}/following`, {
      twitterUserName,
      page,
      limit
    });
    return this._fetchDataWithAuth(url);
  }

  /**
   * Fetch tweet by tweet ID.
   * @param {string} tweetId - The tweet ID.
   * @returns {Promise<object>} - The tweet.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchTweetById(tweetId) {
    const url = buildURL(`${baseURL}/getTweetById`, {
      tweetId
    });
    return this._fetchDataWithAuth(url);
  }

  /**
   * Fetch user by wallet address.
   * @param {string} walletAddress - The wallet address.
   * @param {number} page - The page number.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<object>} - The user data.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchUserByWalletAddress(walletAddress, page = 1, limit = 10) {
    const url = buildURL(`${baseURL}/wallet-twitter-data`, {
      walletAddress,
      page,
      limit
    });
    return this._fetchDataWithAuth(url);
  }

  /**
   * Fetch reposted tweets by Twitter username.
   * @param {string} twitterUserName - The Twitter username.
   * @param {number} page - The page number.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<object>} - The reposted tweets.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchRepostedByUsername(twitterUserName, page = 1, limit = 10) {
    const url = buildURL(`${baseURL}/reposted`, {
      twitterUserName,
      page,
      limit
    });
    return this._fetchDataWithAuth(url);
  }

  /**
   * Fetch replies by Twitter username.
   * @param {string} twitterUserName - The Twitter username.
   * @param {number} page - The page number.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<object>} - The replies.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchRepliesByUsername(twitterUserName, page = 1, limit = 10) {
    const url = buildURL(`${baseURL}/replies`, {
      twitterUserName,
      page,
      limit
    });
    return this._fetchDataWithAuth(url);
  }

  /**
   * Fetch likes by Twitter username.
   * @param {string} twitterUserName - The Twitter username.
   * @param {number} page - The page number.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<object>} - The likes.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchLikesByUsername(twitterUserName, page = 1, limit = 10) {
    const url = buildURL(`${baseURL}/event/likes/${twitterUserName}`, {
      page,
      limit
    });
    return this._fetchDataWithAuth(url);
  }

  /**
   * Fetch follows by Twitter username.
   * @param {string} twitterUserName - The Twitter username.
   * @param {number} page - The page number.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<object>} - The follows.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchFollowsByUsername(twitterUserName, page = 1, limit = 10) {
    const url = buildURL(`${baseURL}/event/follows/${twitterUserName}`, {
      page,
      limit
    });
    return this._fetchDataWithAuth(url);
  }

  /**
   * Fetch viewed tweets by Twitter username.
   * @param {string} twitterUserName - The Twitter username.
   * @param {number} page - The page number.
   * @param {number} limit - The number of items per page.
   * @returns {Promise<object>} - The viewed tweets.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchViewedTweetsByUsername(twitterUserName, page = 1, limit = 10) {
    const url = buildURL(`${baseURL}/event/viewed-tweets/${twitterUserName}`, {
      page,
      limit
    });
    return this._fetchDataWithAuth(url);
  }

  /**
   * Private method to fetch data with authorization header.
   * @param {string} url - The URL to fetch.
   * @returns {Promise<object>} - The response data.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async _fetchDataWithAuth(url) {
    if (!this.apiKey) {
      throw new APIError("API key is required for fetching data", 401);
    }
    try {
      return await fetchData(url, {
        "x-api-key": this.apiKey
      });
    } catch (error) {
      throw new APIError(error.message, error.statusCode);
    }
  }
}

const SpotifyAPI = {};

const testnet = {
  id: 325000,
  name: "Camp Network Testnet V2",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH"
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-campnetwork.xyz"]
    }
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://camp-network-testnet.blockscout.com"
    }
  }
};

let client = null;
const getClient = (provider, name = "window.ethereum") => {
  if (!client || client.transport.name !== name && provider) {
    client = viem.createWalletClient({
      chain: testnet,
      transport: viem.custom(provider, {
        name: name
      })
    });
  }
  return client;
};

function number(n) {
  if (!Number.isSafeInteger(n) || n < 0) throw new Error(`positive integer expected, not ${n}`);
}
// copied from utils
function isBytes(a) {
  return a instanceof Uint8Array || a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array';
}
function bytes(b, ...lengths) {
  if (!isBytes(b)) throw new Error('Uint8Array expected');
  if (lengths.length > 0 && !lengths.includes(b.length)) throw new Error(`Uint8Array expected of length ${lengths}, not of length=${b.length}`);
}
function exists(instance, checkFinished = true) {
  if (instance.destroyed) throw new Error('Hash instance has been destroyed');
  if (checkFinished && instance.finished) throw new Error('Hash#digest() has already been called');
}
function output(out, instance) {
  bytes(out);
  const min = instance.outputLen;
  if (out.length < min) {
    throw new Error(`digestInto() expects output buffer of length at least ${min}`);
  }
}

const U32_MASK64 = /* @__PURE__ */BigInt(2 ** 32 - 1);
const _32n = /* @__PURE__ */BigInt(32);
// We are not using BigUint64Array, because they are extremely slow as per 2022
function fromBig(n, le = false) {
  if (le) return {
    h: Number(n & U32_MASK64),
    l: Number(n >> _32n & U32_MASK64)
  };
  return {
    h: Number(n >> _32n & U32_MASK64) | 0,
    l: Number(n & U32_MASK64) | 0
  };
}
function split(lst, le = false) {
  let Ah = new Uint32Array(lst.length);
  let Al = new Uint32Array(lst.length);
  for (let i = 0; i < lst.length; i++) {
    const {
      h,
      l
    } = fromBig(lst[i], le);
    [Ah[i], Al[i]] = [h, l];
  }
  return [Ah, Al];
}
// Left rotate for Shift in [1, 32)
const rotlSH = (h, l, s) => h << s | l >>> 32 - s;
const rotlSL = (h, l, s) => l << s | h >>> 32 - s;
// Left rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotlBH = (h, l, s) => l << s - 32 | h >>> 64 - s;
const rotlBL = (h, l, s) => h << s - 32 | l >>> 64 - s;

/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
// node.js versions earlier than v19 don't declare it in global scope.
// For node.js, package.json#exports field mapping rewrites import
// from `crypto` to `cryptoNode`, which imports native module.
// Makes the utils un-importable in browsers without a bundler.
// Once node.js 18 is deprecated (2025-04-30), we can just drop the import.
const u32 = arr => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
const isLE = new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44;
// The byte swap operation for uint32
const byteSwap = word => word << 24 & 0xff000000 | word << 8 & 0xff0000 | word >>> 8 & 0xff00 | word >>> 24 & 0xff;
// In place byte swap for Uint32Array
function byteSwap32(arr) {
  for (let i = 0; i < arr.length; i++) {
    arr[i] = byteSwap(arr[i]);
  }
}
/**
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
function utf8ToBytes(str) {
  if (typeof str !== 'string') throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
/**
 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
 * Warning: when Uint8Array is passed, it would NOT get copied.
 * Keep in mind for future mutable operations.
 */
function toBytes$1(data) {
  if (typeof data === 'string') data = utf8ToBytes(data);
  bytes(data);
  return data;
}
// For runtime check if class implements interface
class Hash {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function wrapConstructor(hashCons) {
  const hashC = msg => hashCons().update(toBytes$1(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}

// SHA3 (keccak) is based on a new design: basically, the internal state is bigger than output size.
// It's called a sponge function.
// Various per round constants calculations
const SHA3_PI = [];
const SHA3_ROTL = [];
const _SHA3_IOTA = [];
const _0n = /* @__PURE__ */BigInt(0);
const _1n = /* @__PURE__ */BigInt(1);
const _2n = /* @__PURE__ */BigInt(2);
const _7n = /* @__PURE__ */BigInt(7);
const _256n = /* @__PURE__ */BigInt(256);
const _0x71n = /* @__PURE__ */BigInt(0x71);
for (let round = 0, R = _1n, x = 1, y = 0; round < 24; round++) {
  // Pi
  [x, y] = [y, (2 * x + 3 * y) % 5];
  SHA3_PI.push(2 * (5 * y + x));
  // Rotational
  SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
  // Iota
  let t = _0n;
  for (let j = 0; j < 7; j++) {
    R = (R << _1n ^ (R >> _7n) * _0x71n) % _256n;
    if (R & _2n) t ^= _1n << (_1n << /* @__PURE__ */BigInt(j)) - _1n;
  }
  _SHA3_IOTA.push(t);
}
const [SHA3_IOTA_H, SHA3_IOTA_L] = /* @__PURE__ */split(_SHA3_IOTA, true);
// Left rotation (without 0, 32, 64)
const rotlH = (h, l, s) => s > 32 ? rotlBH(h, l, s) : rotlSH(h, l, s);
const rotlL = (h, l, s) => s > 32 ? rotlBL(h, l, s) : rotlSL(h, l, s);
// Same as keccakf1600, but allows to skip some rounds
function keccakP(s, rounds = 24) {
  const B = new Uint32Array(5 * 2);
  // NOTE: all indices are x2 since we store state as u32 instead of u64 (bigints to slow in js)
  for (let round = 24 - rounds; round < 24; round++) {
    // Theta θ
    for (let x = 0; x < 10; x++) B[x] = s[x] ^ s[x + 10] ^ s[x + 20] ^ s[x + 30] ^ s[x + 40];
    for (let x = 0; x < 10; x += 2) {
      const idx1 = (x + 8) % 10;
      const idx0 = (x + 2) % 10;
      const B0 = B[idx0];
      const B1 = B[idx0 + 1];
      const Th = rotlH(B0, B1, 1) ^ B[idx1];
      const Tl = rotlL(B0, B1, 1) ^ B[idx1 + 1];
      for (let y = 0; y < 50; y += 10) {
        s[x + y] ^= Th;
        s[x + y + 1] ^= Tl;
      }
    }
    // Rho (ρ) and Pi (π)
    let curH = s[2];
    let curL = s[3];
    for (let t = 0; t < 24; t++) {
      const shift = SHA3_ROTL[t];
      const Th = rotlH(curH, curL, shift);
      const Tl = rotlL(curH, curL, shift);
      const PI = SHA3_PI[t];
      curH = s[PI];
      curL = s[PI + 1];
      s[PI] = Th;
      s[PI + 1] = Tl;
    }
    // Chi (χ)
    for (let y = 0; y < 50; y += 10) {
      for (let x = 0; x < 10; x++) B[x] = s[y + x];
      for (let x = 0; x < 10; x++) s[y + x] ^= ~B[(x + 2) % 10] & B[(x + 4) % 10];
    }
    // Iota (ι)
    s[0] ^= SHA3_IOTA_H[round];
    s[1] ^= SHA3_IOTA_L[round];
  }
  B.fill(0);
}
class Keccak extends Hash {
  // NOTE: we accept arguments in bytes instead of bits here.
  constructor(blockLen, suffix, outputLen, enableXOF = false, rounds = 24) {
    super();
    this.blockLen = blockLen;
    this.suffix = suffix;
    this.outputLen = outputLen;
    this.enableXOF = enableXOF;
    this.rounds = rounds;
    this.pos = 0;
    this.posOut = 0;
    this.finished = false;
    this.destroyed = false;
    // Can be passed from user as dkLen
    number(outputLen);
    // 1600 = 5x5 matrix of 64bit.  1600 bits === 200 bytes
    if (0 >= this.blockLen || this.blockLen >= 200) throw new Error('Sha3 supports only keccak-f1600 function');
    this.state = new Uint8Array(200);
    this.state32 = u32(this.state);
  }
  keccak() {
    if (!isLE) byteSwap32(this.state32);
    keccakP(this.state32, this.rounds);
    if (!isLE) byteSwap32(this.state32);
    this.posOut = 0;
    this.pos = 0;
  }
  update(data) {
    exists(this);
    const {
      blockLen,
      state
    } = this;
    data = toBytes$1(data);
    const len = data.length;
    for (let pos = 0; pos < len;) {
      const take = Math.min(blockLen - this.pos, len - pos);
      for (let i = 0; i < take; i++) state[this.pos++] ^= data[pos++];
      if (this.pos === blockLen) this.keccak();
    }
    return this;
  }
  finish() {
    if (this.finished) return;
    this.finished = true;
    const {
      state,
      suffix,
      pos,
      blockLen
    } = this;
    // Do the padding
    state[pos] ^= suffix;
    if ((suffix & 0x80) !== 0 && pos === blockLen - 1) this.keccak();
    state[blockLen - 1] ^= 0x80;
    this.keccak();
  }
  writeInto(out) {
    exists(this, false);
    bytes(out);
    this.finish();
    const bufferOut = this.state;
    const {
      blockLen
    } = this;
    for (let pos = 0, len = out.length; pos < len;) {
      if (this.posOut >= blockLen) this.keccak();
      const take = Math.min(blockLen - this.posOut, len - pos);
      out.set(bufferOut.subarray(this.posOut, this.posOut + take), pos);
      this.posOut += take;
      pos += take;
    }
    return out;
  }
  xofInto(out) {
    // Sha3/Keccak usage with XOF is probably mistake, only SHAKE instances can do XOF
    if (!this.enableXOF) throw new Error('XOF is not possible for this instance');
    return this.writeInto(out);
  }
  xof(bytes) {
    number(bytes);
    return this.xofInto(new Uint8Array(bytes));
  }
  digestInto(out) {
    output(out, this);
    if (this.finished) throw new Error('digest() was already called');
    this.writeInto(out);
    this.destroy();
    return out;
  }
  digest() {
    return this.digestInto(new Uint8Array(this.outputLen));
  }
  destroy() {
    this.destroyed = true;
    this.state.fill(0);
  }
  _cloneInto(to) {
    const {
      blockLen,
      suffix,
      outputLen,
      rounds,
      enableXOF
    } = this;
    to || (to = new Keccak(blockLen, suffix, outputLen, enableXOF, rounds));
    to.state32.set(this.state32);
    to.pos = this.pos;
    to.posOut = this.posOut;
    to.finished = this.finished;
    to.rounds = rounds;
    // Suffix can change in cSHAKE
    to.suffix = suffix;
    to.outputLen = outputLen;
    to.enableXOF = enableXOF;
    to.destroyed = this.destroyed;
    return to;
  }
}
const gen = (suffix, blockLen, outputLen) => wrapConstructor(() => new Keccak(blockLen, suffix, outputLen));
/**
 * keccak-256 hash function. Different from SHA3-256.
 * @param message - that would be hashed
 */
const keccak_256 = /* @__PURE__ */gen(0x01, 136, 256 / 8);

function isHex(value, {
  strict = true
} = {}) {
  if (!value) return false;
  if (typeof value !== 'string') return false;
  return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith('0x');
}

const version = '2.21.37';

let errorConfig = {
  getDocsUrl: ({
    docsBaseUrl,
    docsPath = '',
    docsSlug
  }) => docsPath ? `${docsBaseUrl ?? 'https://viem.sh'}${docsPath}${docsSlug ? `#${docsSlug}` : ''}` : undefined,
  version: `viem@${version}`
};
class BaseError extends Error {
  constructor(shortMessage, args = {}) {
    const details = (() => {
      if (args.cause instanceof BaseError) return args.cause.details;
      if (args.cause?.message) return args.cause.message;
      return args.details;
    })();
    const docsPath = (() => {
      if (args.cause instanceof BaseError) return args.cause.docsPath || args.docsPath;
      return args.docsPath;
    })();
    const docsUrl = errorConfig.getDocsUrl?.({
      ...args,
      docsPath
    });
    const message = [shortMessage || 'An error occurred.', '', ...(args.metaMessages ? [...args.metaMessages, ''] : []), ...(docsUrl ? [`Docs: ${docsUrl}`] : []), ...(details ? [`Details: ${details}`] : []), ...(errorConfig.version ? [`Version: ${errorConfig.version}`] : [])].join('\n');
    super(message, args.cause ? {
      cause: args.cause
    } : undefined);
    Object.defineProperty(this, "details", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "docsPath", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "metaMessages", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "shortMessage", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "version", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 'BaseError'
    });
    this.details = details;
    this.docsPath = docsPath;
    this.metaMessages = args.metaMessages;
    this.name = args.name ?? this.name;
    this.shortMessage = shortMessage;
    this.version = version;
  }
  walk(fn) {
    return walk(this, fn);
  }
}
function walk(err, fn) {
  if (fn?.(err)) return err;
  if (err && typeof err === 'object' && 'cause' in err) return walk(err.cause, fn);
  return fn ? null : err;
}

class SizeExceedsPaddingSizeError extends BaseError {
  constructor({
    size,
    targetSize,
    type
  }) {
    super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} size (${size}) exceeds padding size (${targetSize}).`, {
      name: 'SizeExceedsPaddingSizeError'
    });
  }
}

function pad(hexOrBytes, {
  dir,
  size = 32
} = {}) {
  if (typeof hexOrBytes === 'string') return padHex(hexOrBytes, {
    dir,
    size
  });
  return padBytes(hexOrBytes, {
    dir,
    size
  });
}
function padHex(hex_, {
  dir,
  size = 32
} = {}) {
  if (size === null) return hex_;
  const hex = hex_.replace('0x', '');
  if (hex.length > size * 2) throw new SizeExceedsPaddingSizeError({
    size: Math.ceil(hex.length / 2),
    targetSize: size,
    type: 'hex'
  });
  return `0x${hex[dir === 'right' ? 'padEnd' : 'padStart'](size * 2, '0')}`;
}
function padBytes(bytes, {
  dir,
  size = 32
} = {}) {
  if (size === null) return bytes;
  if (bytes.length > size) throw new SizeExceedsPaddingSizeError({
    size: bytes.length,
    targetSize: size,
    type: 'bytes'
  });
  const paddedBytes = new Uint8Array(size);
  for (let i = 0; i < size; i++) {
    const padEnd = dir === 'right';
    paddedBytes[padEnd ? i : size - i - 1] = bytes[padEnd ? i : bytes.length - i - 1];
  }
  return paddedBytes;
}

class IntegerOutOfRangeError extends BaseError {
  constructor({
    max,
    min,
    signed,
    size,
    value
  }) {
    super(`Number "${value}" is not in safe ${size ? `${size * 8}-bit ${signed ? 'signed' : 'unsigned'} ` : ''}integer range ${max ? `(${min} to ${max})` : `(above ${min})`}`, {
      name: 'IntegerOutOfRangeError'
    });
  }
}
class SizeOverflowError extends BaseError {
  constructor({
    givenSize,
    maxSize
  }) {
    super(`Size cannot exceed ${maxSize} bytes. Given size: ${givenSize} bytes.`, {
      name: 'SizeOverflowError'
    });
  }
}

/**
 * @description Retrieves the size of the value (in bytes).
 *
 * @param value The value (hex or byte array) to retrieve the size of.
 * @returns The size of the value (in bytes).
 */
function size(value) {
  if (isHex(value, {
    strict: false
  })) return Math.ceil((value.length - 2) / 2);
  return value.length;
}

function assertSize(hexOrBytes, {
  size: size$1
}) {
  if (size(hexOrBytes) > size$1) throw new SizeOverflowError({
    givenSize: size(hexOrBytes),
    maxSize: size$1
  });
}

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
function numberToHex(value_, opts = {}) {
  const {
    signed,
    size
  } = opts;
  const value = BigInt(value_);
  let maxValue;
  if (size) {
    if (signed) maxValue = (1n << BigInt(size) * 8n - 1n) - 1n;else maxValue = 2n ** (BigInt(size) * 8n) - 1n;
  } else if (typeof value_ === 'number') {
    maxValue = BigInt(Number.MAX_SAFE_INTEGER);
  }
  const minValue = typeof maxValue === 'bigint' && signed ? -maxValue - 1n : 0;
  if (maxValue && value > maxValue || value < minValue) {
    const suffix = typeof value_ === 'bigint' ? 'n' : '';
    throw new IntegerOutOfRangeError({
      max: maxValue ? `${maxValue}${suffix}` : undefined,
      min: `${minValue}${suffix}`,
      signed,
      size,
      value: `${value_}${suffix}`
    });
  }
  const hex = `0x${(signed && value < 0 ? (1n << BigInt(size * 8)) + BigInt(value) : value).toString(16)}`;
  if (size) return pad(hex, {
    size
  });
  return hex;
}

const encoder = /*#__PURE__*/new TextEncoder();
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
 */
function toBytes(value, opts = {}) {
  if (typeof value === 'number' || typeof value === 'bigint') return numberToBytes(value, opts);
  if (typeof value === 'boolean') return boolToBytes(value, opts);
  if (isHex(value)) return hexToBytes(value, opts);
  return stringToBytes(value, opts);
}
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
function boolToBytes(value, opts = {}) {
  const bytes = new Uint8Array(1);
  bytes[0] = Number(value);
  if (typeof opts.size === 'number') {
    assertSize(bytes, {
      size: opts.size
    });
    return pad(bytes, {
      size: opts.size
    });
  }
  return bytes;
}
// We use very optimized technique to convert hex string to byte array
const charCodeMap = {
  zero: 48,
  nine: 57,
  A: 65,
  F: 70,
  a: 97,
  f: 102
};
function charCodeToBase16(char) {
  if (char >= charCodeMap.zero && char <= charCodeMap.nine) return char - charCodeMap.zero;
  if (char >= charCodeMap.A && char <= charCodeMap.F) return char - (charCodeMap.A - 10);
  if (char >= charCodeMap.a && char <= charCodeMap.f) return char - (charCodeMap.a - 10);
  return undefined;
}
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
 */
function hexToBytes(hex_, opts = {}) {
  let hex = hex_;
  if (opts.size) {
    assertSize(hex, {
      size: opts.size
    });
    hex = pad(hex, {
      dir: 'right',
      size: opts.size
    });
  }
  let hexString = hex.slice(2);
  if (hexString.length % 2) hexString = `0${hexString}`;
  const length = hexString.length / 2;
  const bytes = new Uint8Array(length);
  for (let index = 0, j = 0; index < length; index++) {
    const nibbleLeft = charCodeToBase16(hexString.charCodeAt(j++));
    const nibbleRight = charCodeToBase16(hexString.charCodeAt(j++));
    if (nibbleLeft === undefined || nibbleRight === undefined) {
      throw new BaseError(`Invalid byte sequence ("${hexString[j - 2]}${hexString[j - 1]}" in "${hexString}").`);
    }
    bytes[index] = nibbleLeft * 16 + nibbleRight;
  }
  return bytes;
}
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
function numberToBytes(value, opts) {
  const hex = numberToHex(value, opts);
  return hexToBytes(hex);
}
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
 */
function stringToBytes(value, opts = {}) {
  const bytes = encoder.encode(value);
  if (typeof opts.size === 'number') {
    assertSize(bytes, {
      size: opts.size
    });
    return pad(bytes, {
      dir: 'right',
      size: opts.size
    });
  }
  return bytes;
}

function keccak256(value, to_) {
  const bytes = keccak_256(isHex(value, {
    strict: false
  }) ? toBytes(value) : value);
  return bytes;
}

class InvalidAddressError extends BaseError {
  constructor({
    address
  }) {
    super(`Address "${address}" is invalid.`, {
      metaMessages: ['- Address must be a hex value of 20 bytes (40 hex characters).', '- Address must match its checksum counterpart.'],
      name: 'InvalidAddressError'
    });
  }
}

/**
 * Map with a LRU (Least recently used) policy.
 *
 * @link https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU
 */
class LruMap extends Map {
  constructor(size) {
    super();
    Object.defineProperty(this, "maxSize", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.maxSize = size;
  }
  get(key) {
    const value = super.get(key);
    if (super.has(key) && value !== undefined) {
      this.delete(key);
      super.set(key, value);
    }
    return value;
  }
  set(key, value) {
    super.set(key, value);
    if (this.maxSize && this.size > this.maxSize) {
      const firstKey = this.keys().next().value;
      if (firstKey) this.delete(firstKey);
    }
    return this;
  }
}

const checksumAddressCache = /*#__PURE__*/new LruMap(8192);
function checksumAddress(address_,
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
chainId) {
  if (checksumAddressCache.has(`${address_}.${chainId}`)) return checksumAddressCache.get(`${address_}.${chainId}`);
  const hexAddress = address_.substring(2).toLowerCase();
  const hash = keccak256(stringToBytes(hexAddress));
  const address = (hexAddress).split('');
  for (let i = 0; i < 40; i += 2) {
    if (hash[i >> 1] >> 4 >= 8 && address[i]) {
      address[i] = address[i].toUpperCase();
    }
    if ((hash[i >> 1] & 0x0f) >= 8 && address[i + 1]) {
      address[i + 1] = address[i + 1].toUpperCase();
    }
  }
  const result = `0x${address.join('')}`;
  checksumAddressCache.set(`${address_}.${chainId}`, result);
  return result;
}
function getAddress(address,
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
chainId) {
  if (!isAddress(address, {
    strict: false
  })) throw new InvalidAddressError({
    address
  });
  return checksumAddress(address, chainId);
}

const addressRegex = /^0x[a-fA-F0-9]{40}$/;
/** @internal */
const isAddressCache = /*#__PURE__*/new LruMap(8192);
function isAddress(address, options) {
  const {
    strict = true
  } = options ?? {};
  const cacheKey = `${address}.${strict}`;
  if (isAddressCache.has(cacheKey)) return isAddressCache.get(cacheKey);
  const result = (() => {
    if (!addressRegex.test(address)) return false;
    if (address.toLowerCase() === address) return true;
    if (strict) return checksumAddress(address) === address;
    return true;
  })();
  isAddressCache.set(cacheKey, result);
  return result;
}

class SiweInvalidMessageFieldError extends BaseError {
  constructor(parameters) {
    const {
      docsPath,
      field,
      metaMessages
    } = parameters;
    super(`Invalid Sign-In with Ethereum message field "${field}".`, {
      docsPath,
      metaMessages,
      name: 'SiweInvalidMessageFieldError'
    });
  }
}

function isUri(value) {
  // based on https://github.com/ogt/valid-url
  // check for illegal characters
  if (/[^a-z0-9\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=\.\-\_\~\%]/i.test(value)) return false;
  // check for hex escapes that aren't complete
  if (/%[^0-9a-f]/i.test(value)) return false;
  if (/%[0-9a-f](:?[^0-9a-f]|$)/i.test(value)) return false;
  // from RFC 3986
  const splitted = splitUri(value);
  const scheme = splitted[1];
  const authority = splitted[2];
  const path = splitted[3];
  const query = splitted[4];
  const fragment = splitted[5];
  // scheme and path are required, though the path can be empty
  if (!(scheme?.length && path.length >= 0)) return false;
  // if authority is present, the path must be empty or begin with a /
  if (authority?.length) {
    if (!(path.length === 0 || /^\//.test(path))) return false;
  } else {
    // if authority is not present, the path must not start with //
    if (/^\/\//.test(path)) return false;
  }
  // scheme must begin with a letter, then consist of letters, digits, +, ., or -
  if (!/^[a-z][a-z0-9\+\-\.]*$/.test(scheme.toLowerCase())) return false;
  let out = '';
  // re-assemble the URL per section 5.3 in RFC 3986
  out += `${scheme}:`;
  if (authority?.length) out += `//${authority}`;
  out += path;
  if (query?.length) out += `?${query}`;
  if (fragment?.length) out += `#${fragment}`;
  return out;
}
function splitUri(value) {
  return value.match(/(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/);
}

/**
 * @description Creates EIP-4361 formatted message.
 *
 * @example
 * const message = createMessage({
 *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   chainId: 1,
 *   domain: 'example.com',
 *   nonce: 'foobarbaz',
 *   uri: 'https://example.com/path',
 *   version: '1',
 * })
 *
 * @see https://eips.ethereum.org/EIPS/eip-4361
 */
function createSiweMessage(parameters) {
  const {
    chainId,
    domain,
    expirationTime,
    issuedAt = new Date(),
    nonce,
    notBefore,
    requestId,
    resources,
    scheme,
    uri,
    version
  } = parameters;
  // Validate fields
  {
    // Required fields
    if (chainId !== Math.floor(chainId)) throw new SiweInvalidMessageFieldError({
      field: 'chainId',
      metaMessages: ['- Chain ID must be a EIP-155 chain ID.', '- See https://eips.ethereum.org/EIPS/eip-155', '', `Provided value: ${chainId}`]
    });
    if (!(domainRegex.test(domain) || ipRegex.test(domain) || localhostRegex.test(domain))) throw new SiweInvalidMessageFieldError({
      field: 'domain',
      metaMessages: ['- Domain must be an RFC 3986 authority.', '- See https://www.rfc-editor.org/rfc/rfc3986', '', `Provided value: ${domain}`]
    });
    if (!nonceRegex.test(nonce)) throw new SiweInvalidMessageFieldError({
      field: 'nonce',
      metaMessages: ['- Nonce must be at least 8 characters.', '- Nonce must be alphanumeric.', '', `Provided value: ${nonce}`]
    });
    if (!isUri(uri)) throw new SiweInvalidMessageFieldError({
      field: 'uri',
      metaMessages: ['- URI must be a RFC 3986 URI referring to the resource that is the subject of the signing.', '- See https://www.rfc-editor.org/rfc/rfc3986', '', `Provided value: ${uri}`]
    });
    if (version !== '1') throw new SiweInvalidMessageFieldError({
      field: 'version',
      metaMessages: ["- Version must be '1'.", '', `Provided value: ${version}`]
    });
    // Optional fields
    if (scheme && !schemeRegex.test(scheme)) throw new SiweInvalidMessageFieldError({
      field: 'scheme',
      metaMessages: ['- Scheme must be an RFC 3986 URI scheme.', '- See https://www.rfc-editor.org/rfc/rfc3986#section-3.1', '', `Provided value: ${scheme}`]
    });
    const statement = parameters.statement;
    if (statement?.includes('\n')) throw new SiweInvalidMessageFieldError({
      field: 'statement',
      metaMessages: ["- Statement must not include '\\n'.", '', `Provided value: ${statement}`]
    });
  }
  // Construct message
  const address = getAddress(parameters.address);
  const origin = (() => {
    if (scheme) return `${scheme}://${domain}`;
    return domain;
  })();
  const statement = (() => {
    if (!parameters.statement) return '';
    return `${parameters.statement}\n`;
  })();
  const prefix = `${origin} wants you to sign in with your Ethereum account:\n${address}\n\n${statement}`;
  let suffix = `URI: ${uri}\nVersion: ${version}\nChain ID: ${chainId}\nNonce: ${nonce}\nIssued At: ${issuedAt.toISOString()}`;
  if (expirationTime) suffix += `\nExpiration Time: ${expirationTime.toISOString()}`;
  if (notBefore) suffix += `\nNot Before: ${notBefore.toISOString()}`;
  if (requestId) suffix += `\nRequest ID: ${requestId}`;
  if (resources) {
    let content = '\nResources:';
    for (const resource of resources) {
      if (!isUri(resource)) throw new SiweInvalidMessageFieldError({
        field: 'resources',
        metaMessages: ['- Every resource must be a RFC 3986 URI.', '- See https://www.rfc-editor.org/rfc/rfc3986', '', `Provided value: ${resource}`]
      });
      content += `\n- ${resource}`;
    }
    suffix += content;
  }
  return `${prefix}\n${suffix}`;
}
const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(:[0-9]{1,5})?$/;
const ipRegex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(:[0-9]{1,5})?$/;
const localhostRegex = /^localhost(:[0-9]{1,5})?$/;
const nonceRegex = /^[a-zA-Z0-9]{8,}$/;
const schemeRegex = /^([a-zA-Z][a-zA-Z0-9+-.]*)$/;

var constants = {
  SIWE_API: 'http://localhost:3000',
  SIWE_API_VERIFY: 'http://localhost:3000/verify',
  SIWE_API_NONCE: 'http://localhost:3000/nonce',
  SIWE_MESSAGE_STATEMENT: 'Connect with Camp Network',
  AUTH_HUB_BASE_API: 'http://localhost:3000'
};

let providers = [];
const providerStore = {
  value: () => providers,
  subscribe: callback => {
    function onAnnouncement(event) {
      if (providers.some(p => p.info.uuid === event.detail.info.uuid)) return;
      providers = [...providers, event.detail];
      callback(providers);
    }
    window.addEventListener("eip6963:announceProvider", onAnnouncement);
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    return () => window.removeEventListener("eip6963:announceProvider", onAnnouncement);
  }
};

/**
 * The Auth class.
 * @class
 * @classdesc The Auth class is used to authenticate the user.
 */
class Auth {
  /**
   * Constructor for the Auth class.
   * @param {object} options The options object.
   * @param {string} options.clientId The client ID.
   * @param {string} options.redirectUri The redirect URI used for oauth.
   * @throws {APIError} - Throws an error if the clientId is not provided.
   */

  constructor({
    clientId,
    redirectUri
  }) {
    if (!clientId) {
      throw new APIError("clientId is required");
    }
    this.viem = getClient(window.ethereum);
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.isAuthenticated = false;
    this.jwt = null;
    this.walletAddress = null;
    this.userId = null;
    this.providerCallbacks = [];
    this.#loadAuthStatusFromStorage();
    providerStore.subscribe(provs => {
      this.providerCallbacks.forEach(callback => callback(provs));
    });
  }

  /**
   * Subscribe to provider updates. This is useful for updating the UI when new providers are announced.
   * @param {function} callback The callback function that gets called when the provider list is updated. Will fire once upon subscription with the current provider list.
   * @returns {void}
   */
  subscribeToProviders(callback) {
    this.providerCallbacks.push(callback);
    callback(providerStore.value());
  }

  /**
   * Set the provider. This is useful for setting the provider when the user selects a provider from the UI or when dApp wishes to use a specific provider.
   * @param {object} options The options object. Includes the provider and the provider info.
   * @returns {void}
   * @throws {APIError} - Throws an error if the provider is not provided.
   */
  setProvider({
    provider,
    info
  }) {
    if (!provider) {
      throw new APIError("provider is required");
    }
    this.viem = getClient(provider, info.name);
  }

  /**
   * Load the authentication status from local storage.
   * @private
   * @returns {void}
   */
  #loadAuthStatusFromStorage() {
    const walletAddress = localStorage.getItem("camp-sdk:wallet-address");
    const userId = localStorage.getItem("camp-sdk:user-id");
    const jwt = localStorage.getItem("camp-sdk:jwt");
    if (walletAddress && userId && jwt) {
      this.walletAddress = walletAddress;
      this.userId = userId;
      this.jwt = jwt;
      this.isAuthenticated = true;
    } else {
      this.isAuthenticated = false;
    }
  }

  /**
   * Request the user to connect their wallet.
   * @private
   * @returns {Promise<void>} A promise that resolves when the user connects their wallet.
   * @throws {APIError} - Throws an error if the user does not connect their wallet.
   */
  async #requestAccount() {
    try {
      const [account] = await this.viem.requestAddresses();
      this.walletAddress = account;
      return account;
    } catch (e) {
      throw new APIError(e);
    }
  }

  /**
   * Fetch the nonce from the server.
   * @private
   * @returns {Promise<string>} A promise that resolves with the nonce.
   * @throws {APIError} - Throws an error if the nonce cannot be fetched.
   */
  async #fetchNonce() {
    try {
      const res = await fetch(constants.SIWE_API_NONCE, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await res.json();
      return data.nonce;
    } catch (e) {
      throw new APIError(e);
    }
  }

  /**
   * Verify the signature.
   * @private
   * @param {string} message The message.
   * @param {string} signature The signature.
   * @returns {Promise<object>} A promise that resolves with the verification result.
   * @throws {APIError} - Throws an error if the signature cannot be verified.
   */
  async #verifySignature(message, signature) {
    try {
      const res = await fetch(constants.SIWE_API_VERIFY, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message,
          signature
        })
      });
      const data = await res.json();
      return data;
    } catch (e) {
      throw new APIError(e);
    }
  }

  /**
   * Create the SIWE message.
   * @private
   * @param {string} nonce The nonce.
   * @returns {string} The EIP-4361 formatted message.
   */
  #createMessage(nonce) {
    return createSiweMessage({
      domain: window.location.host,
      address: this.walletAddress,
      statement: constants.SIWE_MESSAGE_STATEMENT,
      uri: window.location.origin,
      version: "1",
      chainId: this.viem.chain.id,
      nonce: nonce
    });
  }

  /**
   * Disconnect the user.
   * @returns {void}
   */
  async disconnect() {
    this.isAuthenticated = false;
    this.walletAddress = null;
    this.userId = null;
    this.jwt = null;
    localStorage.removeItem("camp-sdk:wallet-address");
    localStorage.removeItem("camp-sdk:user-id");
    localStorage.removeItem("camp-sdk:jwt");
  }

  /**
   * Connect the user's wallet and sign the message.
   * @returns {Promise<object>} A promise that resolves with the authentication result.
   * @throws {APIError} - Throws an error if the user cannot be authenticated.
   */
  async connect() {
    try {
      if (!this.walletAddress) {
        await this.#requestAccount();
      }
      const nonce = await this.#fetchNonce();
      const message = this.#createMessage(nonce);
      const signature = await this.viem.signMessage({
        account: this.walletAddress,
        message: message
      });
      const res = await this.#verifySignature(message, signature, nonce);
      if (res.success) {
        console.log(res);
        this.isAuthenticated = true;
        this.userId = res.userId;
        this.jwt = res.token;
        localStorage.setItem("camp-sdk:jwt", this.jwt);
        localStorage.setItem("camp-sdk:wallet-address", this.walletAddress);
        localStorage.setItem("camp-sdk:user-id", this.userId);
        return {
          success: true,
          message: "Successfully authenticated",
          walletAddress: this.walletAddress
        };
      } else {
        this.isAuthenticated = false;
        throw new APIError("Failed to authenticate");
      }
    } catch (e) {
      throw new APIError(e);
    }
  }

  /**
   * Get the user's wallet address.
   * @returns {string} The user's wallet address.
   */
  getWalletAddress() {
    return this.walletAddress;
  }

  /**
   * Get the user's ID.
   * @returns {string} The user's ID.
   */
  getUserId() {
    return this.userId;
  }

  /**
   * Check if the user is authenticated.
   * @returns {boolean} True if the user is authenticated, false otherwise.
   */
  isAuthenticated() {
    return this.isAuthenticated;
  }

  /**
   * Get the user's linked social accounts.
   * @returns {Promise<object>} A promise that resolves with the user's linked social accounts.
   *
   * @example
   * const auth = new Auth({ clientId: "your-client-id" });
   * const socials = await auth.getLinkedSocials();
   * console.log(socials);
   */
  async getLinkedSocials() {
    const connections = await fetch(`${constants.AUTH_HUB_BASE_API}/auth/client-user/connections`, {
      method: "GET",
      redirect: "follow",
      headers: {
        "x-client-id": clientId,
        "Content-Type": "application/json"
      }
    }).then(res => res.json());
    if (!connections.isError) {
      return connections.data;
    } else {
      return [];
    }
  }

  /**
   * Link the user's Twitter account.
   * @returns {void}
   * @throws {APIError} - Throws an error if the user is not authenticated.
   */
  linkTwitter() {
    if (!this.isAuthenticated) {
      throw new APIError("User needs to be authenticated");
    }
    window.location.href = `${constants.AUTH_HUB_BASE_API}/twitter/connect?clientId=${this.clientId}&userId=${this.userId}&redirectUri=${this.redirectUri}`;
  }
}

exports.Auth = Auth;
exports.SpotifyAPI = SpotifyAPI;
exports.TwitterAPI = TwitterAPI;
