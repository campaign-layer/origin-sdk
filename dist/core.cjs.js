'use strict';

var axios = require('axios');

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

// TODO: This looks cool. Need to check the performance of `new RegExp` versus defined inline though.
// https://twitter.com/GabrielVergnaud/status/1622906834343366657
function execTyped(regex, string) {
  const match = regex.exec(string);
  return match?.groups;
}

// https://regexr.com/7f7rv
const tupleRegex = /^tuple(?<array>(\[(\d*)\])*)$/;
/**
 * Formats {@link AbiParameter} to human-readable ABI parameter.
 *
 * @param abiParameter - ABI parameter
 * @returns Human-readable ABI parameter
 *
 * @example
 * const result = formatAbiParameter({ type: 'address', name: 'from' })
 * //    ^? const result: 'address from'
 */
function formatAbiParameter(abiParameter) {
  let type = abiParameter.type;
  if (tupleRegex.test(abiParameter.type) && 'components' in abiParameter) {
    type = '(';
    const length = abiParameter.components.length;
    for (let i = 0; i < length; i++) {
      const component = abiParameter.components[i];
      type += formatAbiParameter(component);
      if (i < length - 1) type += ', ';
    }
    const result = execTyped(tupleRegex, abiParameter.type);
    type += `)${result?.array ?? ''}`;
    return formatAbiParameter({
      ...abiParameter,
      type
    });
  }
  // Add `indexed` to type if in `abiParameter`
  if ('indexed' in abiParameter && abiParameter.indexed) type = `${type} indexed`;
  // Return human-readable ABI parameter
  if (abiParameter.name) return `${type} ${abiParameter.name}`;
  return type;
}

/**
 * Formats {@link AbiParameter}s to human-readable ABI parameters.
 *
 * @param abiParameters - ABI parameters
 * @returns Human-readable ABI parameters
 *
 * @example
 * const result = formatAbiParameters([
 *   //  ^? const result: 'address from, uint256 tokenId'
 *   { type: 'address', name: 'from' },
 *   { type: 'uint256', name: 'tokenId' },
 * ])
 */
function formatAbiParameters(abiParameters) {
  let params = '';
  const length = abiParameters.length;
  for (let i = 0; i < length; i++) {
    const abiParameter = abiParameters[i];
    params += formatAbiParameter(abiParameter);
    if (i !== length - 1) params += ', ';
  }
  return params;
}

/**
 * Formats ABI item (e.g. error, event, function) into human-readable ABI item
 *
 * @param abiItem - ABI item
 * @returns Human-readable ABI item
 */
function formatAbiItem$1(abiItem) {
  if (abiItem.type === 'function') return `function ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability && abiItem.stateMutability !== 'nonpayable' ? ` ${abiItem.stateMutability}` : ''}${abiItem.outputs.length ? ` returns (${formatAbiParameters(abiItem.outputs)})` : ''}`;
  if (abiItem.type === 'event') return `event ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
  if (abiItem.type === 'error') return `error ${abiItem.name}(${formatAbiParameters(abiItem.inputs)})`;
  if (abiItem.type === 'constructor') return `constructor(${formatAbiParameters(abiItem.inputs)})${abiItem.stateMutability === 'payable' ? ' payable' : ''}`;
  if (abiItem.type === 'fallback') return 'fallback()';
  return 'receive() external payable';
}

/**
 * Retrieves and returns an action from the client (if exists), and falls
 * back to the tree-shakable action.
 *
 * Useful for extracting overridden actions from a client (ie. if a consumer
 * wants to override the `sendTransaction` implementation).
 */
function getAction(client, actionFn,
// Some minifiers drop `Function.prototype.name`, or replace it with short letters,
// meaning that `actionFn.name` will not always work. For that case, the consumer
// needs to pass the name explicitly.
name) {
  const action_implicit = client[actionFn.name];
  if (typeof action_implicit === 'function') return action_implicit;
  const action_explicit = client[name];
  if (typeof action_explicit === 'function') return action_explicit;
  return params => actionFn(client, params);
}

function formatAbiItem(abiItem, {
  includeName = false
} = {}) {
  if (abiItem.type !== 'function' && abiItem.type !== 'event' && abiItem.type !== 'error') throw new InvalidDefinitionTypeError(abiItem.type);
  return `${abiItem.name}(${formatAbiParams(abiItem.inputs, {
    includeName
  })})`;
}
function formatAbiParams(params, {
  includeName = false
} = {}) {
  if (!params) return '';
  return params.map(param => formatAbiParam(param, {
    includeName
  })).join(includeName ? ', ' : ',');
}
function formatAbiParam(param, {
  includeName
}) {
  if (param.type.startsWith('tuple')) {
    return `(${formatAbiParams(param.components, {
      includeName
    })})${param.type.slice('tuple'.length)}`;
  }
  return param.type + (includeName && param.name ? ` ${param.name}` : '');
}

function isHex(value, {
  strict = true
} = {}) {
  if (!value) return false;
  if (typeof value !== 'string') return false;
  return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith('0x');
}

/**
 * @description Retrieves the size of the value (in bytes).
 *
 * @param value The value (hex or byte array) to retrieve the size of.
 * @returns The size of the value (in bytes).
 */
function size$1(value) {
  if (isHex(value, {
    strict: false
  })) return Math.ceil((value.length - 2) / 2);
  return value.length;
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

class AbiConstructorNotFoundError extends BaseError {
  constructor({
    docsPath
  }) {
    super(['A constructor was not found on the ABI.', 'Make sure you are using the correct ABI and that the constructor exists on it.'].join('\n'), {
      docsPath,
      name: 'AbiConstructorNotFoundError'
    });
  }
}
class AbiConstructorParamsNotFoundError extends BaseError {
  constructor({
    docsPath
  }) {
    super(['Constructor arguments were provided (`args`), but a constructor parameters (`inputs`) were not found on the ABI.', 'Make sure you are using the correct ABI, and that the `inputs` attribute on the constructor exists.'].join('\n'), {
      docsPath,
      name: 'AbiConstructorParamsNotFoundError'
    });
  }
}
class AbiDecodingDataSizeTooSmallError extends BaseError {
  constructor({
    data,
    params,
    size
  }) {
    super([`Data size of ${size} bytes is too small for given parameters.`].join('\n'), {
      metaMessages: [`Params: (${formatAbiParams(params, {
        includeName: true
      })})`, `Data:   ${data} (${size} bytes)`],
      name: 'AbiDecodingDataSizeTooSmallError'
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "params", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "size", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.data = data;
    this.params = params;
    this.size = size;
  }
}
class AbiDecodingZeroDataError extends BaseError {
  constructor() {
    super('Cannot decode zero data ("0x") with ABI parameters.', {
      name: 'AbiDecodingZeroDataError'
    });
  }
}
class AbiEncodingArrayLengthMismatchError extends BaseError {
  constructor({
    expectedLength,
    givenLength,
    type
  }) {
    super([`ABI encoding array length mismatch for type ${type}.`, `Expected length: ${expectedLength}`, `Given length: ${givenLength}`].join('\n'), {
      name: 'AbiEncodingArrayLengthMismatchError'
    });
  }
}
class AbiEncodingBytesSizeMismatchError extends BaseError {
  constructor({
    expectedSize,
    value
  }) {
    super(`Size of bytes "${value}" (bytes${size$1(value)}) does not match expected size (bytes${expectedSize}).`, {
      name: 'AbiEncodingBytesSizeMismatchError'
    });
  }
}
class AbiEncodingLengthMismatchError extends BaseError {
  constructor({
    expectedLength,
    givenLength
  }) {
    super(['ABI encoding params/values length mismatch.', `Expected length (params): ${expectedLength}`, `Given length (values): ${givenLength}`].join('\n'), {
      name: 'AbiEncodingLengthMismatchError'
    });
  }
}
class AbiErrorSignatureNotFoundError extends BaseError {
  constructor(signature, {
    docsPath
  }) {
    super([`Encoded error signature "${signature}" not found on ABI.`, 'Make sure you are using the correct ABI and that the error exists on it.', `You can look up the decoded signature here: https://openchain.xyz/signatures?query=${signature}.`].join('\n'), {
      docsPath,
      name: 'AbiErrorSignatureNotFoundError'
    });
    Object.defineProperty(this, "signature", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.signature = signature;
  }
}
class AbiFunctionNotFoundError extends BaseError {
  constructor(functionName, {
    docsPath
  } = {}) {
    super([`Function ${functionName ? `"${functionName}" ` : ''}not found on ABI.`, 'Make sure you are using the correct ABI and that the function exists on it.'].join('\n'), {
      docsPath,
      name: 'AbiFunctionNotFoundError'
    });
  }
}
class AbiItemAmbiguityError extends BaseError {
  constructor(x, y) {
    super('Found ambiguous types in overloaded ABI items.', {
      metaMessages: [`\`${x.type}\` in \`${formatAbiItem(x.abiItem)}\`, and`, `\`${y.type}\` in \`${formatAbiItem(y.abiItem)}\``, '', 'These types encode differently and cannot be distinguished at runtime.', 'Remove one of the ambiguous items in the ABI.'],
      name: 'AbiItemAmbiguityError'
    });
  }
}
class BytesSizeMismatchError extends BaseError {
  constructor({
    expectedSize,
    givenSize
  }) {
    super(`Expected bytes${expectedSize}, got bytes${givenSize}.`, {
      name: 'BytesSizeMismatchError'
    });
  }
}
class InvalidAbiEncodingTypeError extends BaseError {
  constructor(type, {
    docsPath
  }) {
    super([`Type "${type}" is not a valid encoding type.`, 'Please provide a valid ABI type.'].join('\n'), {
      docsPath,
      name: 'InvalidAbiEncodingType'
    });
  }
}
class InvalidAbiDecodingTypeError extends BaseError {
  constructor(type, {
    docsPath
  }) {
    super([`Type "${type}" is not a valid decoding type.`, 'Please provide a valid ABI type.'].join('\n'), {
      docsPath,
      name: 'InvalidAbiDecodingType'
    });
  }
}
class InvalidArrayError extends BaseError {
  constructor(value) {
    super([`Value "${value}" is not a valid array.`].join('\n'), {
      name: 'InvalidArrayError'
    });
  }
}
class InvalidDefinitionTypeError extends BaseError {
  constructor(type) {
    super([`"${type}" is not a valid definition type.`, 'Valid types: "function", "event", "error"'].join('\n'), {
      name: 'InvalidDefinitionTypeError'
    });
  }
}

class SliceOffsetOutOfBoundsError extends BaseError {
  constructor({
    offset,
    position,
    size
  }) {
    super(`Slice ${position === 'start' ? 'starting' : 'ending'} at offset "${offset}" is out-of-bounds (size: ${size}).`, {
      name: 'SliceOffsetOutOfBoundsError'
    });
  }
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
class InvalidBytesLengthError extends BaseError {
  constructor({
    size,
    targetSize,
    type
  }) {
    super(`${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()} is expected to be ${targetSize} ${type} long, but is ${size} ${type} long.`, {
      name: 'InvalidBytesLengthError'
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
class InvalidBytesBooleanError extends BaseError {
  constructor(bytes) {
    super(`Bytes value "${bytes}" is not a valid boolean. The bytes array must contain a single byte of either a 0 or 1 value.`, {
      name: 'InvalidBytesBooleanError'
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

function trim(hexOrBytes, {
  dir = 'left'
} = {}) {
  let data = typeof hexOrBytes === 'string' ? hexOrBytes.replace('0x', '') : hexOrBytes;
  let sliceLength = 0;
  for (let i = 0; i < data.length - 1; i++) {
    if (data[dir === 'left' ? i : data.length - i - 1].toString() === '0') sliceLength++;else break;
  }
  data = dir === 'left' ? data.slice(sliceLength) : data.slice(0, data.length - sliceLength);
  if (typeof hexOrBytes === 'string') {
    if (data.length === 1 && dir === 'right') data = `${data}0`;
    return `0x${data.length % 2 === 1 ? `0${data}` : data}`;
  }
  return data;
}

function assertSize(hexOrBytes, {
  size
}) {
  if (size$1(hexOrBytes) > size) throw new SizeOverflowError({
    givenSize: size$1(hexOrBytes),
    maxSize: size
  });
}
/**
 * Decodes a hex value into a bigint.
 *
 * - Docs: https://viem.sh/docs/utilities/fromHex#hextobigint
 *
 * @param hex Hex value to decode.
 * @param opts Options.
 * @returns BigInt value.
 *
 * @example
 * import { hexToBigInt } from 'viem'
 * const data = hexToBigInt('0x1a4', { signed: true })
 * // 420n
 *
 * @example
 * import { hexToBigInt } from 'viem'
 * const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
 * // 420n
 */
function hexToBigInt(hex, opts = {}) {
  const {
    signed
  } = opts;
  if (opts.size) assertSize(hex, {
    size: opts.size
  });
  const value = BigInt(hex);
  if (!signed) return value;
  const size = (hex.length - 2) / 2;
  const max = (1n << BigInt(size) * 8n - 1n) - 1n;
  if (value <= max) return value;
  return value - BigInt(`0x${'f'.padStart(size * 2, 'f')}`) - 1n;
}
/**
 * Decodes a hex string into a number.
 *
 * - Docs: https://viem.sh/docs/utilities/fromHex#hextonumber
 *
 * @param hex Hex value to decode.
 * @param opts Options.
 * @returns Number value.
 *
 * @example
 * import { hexToNumber } from 'viem'
 * const data = hexToNumber('0x1a4')
 * // 420
 *
 * @example
 * import { hexToNumber } from 'viem'
 * const data = hexToBigInt('0x00000000000000000000000000000000000000000000000000000000000001a4', { size: 32 })
 * // 420
 */
function hexToNumber$1(hex, opts = {}) {
  return Number(hexToBigInt(hex, opts));
}

const hexes$1 = /*#__PURE__*/Array.from({
  length: 256
}, (_v, i) => i.toString(16).padStart(2, '0'));
/**
 * Encodes a string, number, bigint, or ByteArray into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex
 * - Example: https://viem.sh/docs/utilities/toHex#usage
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { toHex } from 'viem'
 * const data = toHex('Hello world')
 * // '0x48656c6c6f20776f726c6421'
 *
 * @example
 * import { toHex } from 'viem'
 * const data = toHex(420)
 * // '0x1a4'
 *
 * @example
 * import { toHex } from 'viem'
 * const data = toHex('Hello world', { size: 32 })
 * // '0x48656c6c6f20776f726c64210000000000000000000000000000000000000000'
 */
function toHex(value, opts = {}) {
  if (typeof value === 'number' || typeof value === 'bigint') return numberToHex(value, opts);
  if (typeof value === 'string') {
    return stringToHex(value, opts);
  }
  if (typeof value === 'boolean') return boolToHex(value, opts);
  return bytesToHex$1(value, opts);
}
/**
 * Encodes a boolean into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#booltohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { boolToHex } from 'viem'
 * const data = boolToHex(true)
 * // '0x1'
 *
 * @example
 * import { boolToHex } from 'viem'
 * const data = boolToHex(false)
 * // '0x0'
 *
 * @example
 * import { boolToHex } from 'viem'
 * const data = boolToHex(true, { size: 32 })
 * // '0x0000000000000000000000000000000000000000000000000000000000000001'
 */
function boolToHex(value, opts = {}) {
  const hex = `0x${Number(value)}`;
  if (typeof opts.size === 'number') {
    assertSize(hex, {
      size: opts.size
    });
    return pad(hex, {
      size: opts.size
    });
  }
  return hex;
}
/**
 * Encodes a bytes array into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#bytestohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { bytesToHex } from 'viem'
 * const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33])
 * // '0x48656c6c6f20576f726c6421'
 *
 * @example
 * import { bytesToHex } from 'viem'
 * const data = bytesToHex(Uint8Array.from([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]), { size: 32 })
 * // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
 */
function bytesToHex$1(value, opts = {}) {
  let string = '';
  for (let i = 0; i < value.length; i++) {
    string += hexes$1[value[i]];
  }
  const hex = `0x${string}`;
  if (typeof opts.size === 'number') {
    assertSize(hex, {
      size: opts.size
    });
    return pad(hex, {
      dir: 'right',
      size: opts.size
    });
  }
  return hex;
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
const encoder$1 = /*#__PURE__*/new TextEncoder();
/**
 * Encodes a UTF-8 string into a hex string
 *
 * - Docs: https://viem.sh/docs/utilities/toHex#stringtohex
 *
 * @param value Value to encode.
 * @param opts Options.
 * @returns Hex value.
 *
 * @example
 * import { stringToHex } from 'viem'
 * const data = stringToHex('Hello World!')
 * // '0x48656c6c6f20576f726c6421'
 *
 * @example
 * import { stringToHex } from 'viem'
 * const data = stringToHex('Hello World!', { size: 32 })
 * // '0x48656c6c6f20576f726c64210000000000000000000000000000000000000000'
 */
function stringToHex(value_, opts = {}) {
  const value = encoder$1.encode(value_);
  return bytesToHex$1(value, opts);
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
function toBytes$1(value, opts = {}) {
  if (typeof value === 'number' || typeof value === 'bigint') return numberToBytes(value, opts);
  if (typeof value === 'boolean') return boolToBytes(value, opts);
  if (isHex(value)) return hexToBytes$1(value, opts);
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
function hexToBytes$1(hex_, opts = {}) {
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
  return hexToBytes$1(hex);
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

function number(n) {
  if (!Number.isSafeInteger(n) || n < 0) throw new Error(`positive integer expected, not ${n}`);
}
// copied from utils
function isBytes$1(a) {
  return a instanceof Uint8Array || a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array';
}
function bytes(b, ...lengths) {
  if (!isBytes$1(b)) throw new Error('Uint8Array expected');
  if (lengths.length > 0 && !lengths.includes(b.length)) throw new Error(`Uint8Array expected of length ${lengths}, not of length=${b.length}`);
}
function hash$1(h) {
  if (typeof h !== 'function' || typeof h.create !== 'function') throw new Error('Hash should be wrapped by utils.wrapConstructor');
  number(h.outputLen);
  number(h.blockLen);
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

const crypto = typeof globalThis === 'object' && 'crypto' in globalThis ? globalThis.crypto : undefined;

/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// We use WebCrypto aka globalThis.crypto, which exists in browsers and node.js 16+.
// node.js versions earlier than v19 don't declare it in global scope.
// For node.js, package.json#exports field mapping rewrites import
// from `crypto` to `cryptoNode`, which imports native module.
// Makes the utils un-importable in browsers without a bundler.
// Once node.js 18 is deprecated (2025-04-30), we can just drop the import.
const u32 = arr => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
// Cast array to view
const createView = arr => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
// The rotate right (circular right shift) operation for uint32
const rotr = (word, shift) => word << 32 - shift | word >>> shift;
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
function utf8ToBytes$1(str) {
  if (typeof str !== 'string') throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
/**
 * Normalizes (non-hex) string or Uint8Array to Uint8Array.
 * Warning: when Uint8Array is passed, it would NOT get copied.
 * Keep in mind for future mutable operations.
 */
function toBytes(data) {
  if (typeof data === 'string') data = utf8ToBytes$1(data);
  bytes(data);
  return data;
}
/**
 * Copies several Uint8Arrays into one.
 */
function concatBytes$2(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    bytes(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
// For runtime check if class implements interface
class Hash {
  // Safe version that clones internal state
  clone() {
    return this._cloneInto();
  }
}
function wrapConstructor(hashCons) {
  const hashC = msg => hashCons().update(toBytes(msg)).digest();
  const tmp = hashCons();
  hashC.outputLen = tmp.outputLen;
  hashC.blockLen = tmp.blockLen;
  hashC.create = () => hashCons();
  return hashC;
}
/**
 * Secure PRNG. Uses `crypto.getRandomValues`, which defers to OS.
 */
function randomBytes(bytesLength = 32) {
  if (crypto && typeof crypto.getRandomValues === 'function') {
    return crypto.getRandomValues(new Uint8Array(bytesLength));
  }
  // Legacy Node.js compatibility
  if (crypto && typeof crypto.randomBytes === 'function') {
    return crypto.randomBytes(bytesLength);
  }
  throw new Error('crypto.getRandomValues must be defined');
}

// SHA3 (keccak) is based on a new design: basically, the internal state is bigger than output size.
// It's called a sponge function.
// Various per round constants calculations
const SHA3_PI = [];
const SHA3_ROTL = [];
const _SHA3_IOTA = [];
const _0n$4 = /* @__PURE__ */BigInt(0);
const _1n$5 = /* @__PURE__ */BigInt(1);
const _2n$3 = /* @__PURE__ */BigInt(2);
const _7n = /* @__PURE__ */BigInt(7);
const _256n = /* @__PURE__ */BigInt(256);
const _0x71n = /* @__PURE__ */BigInt(0x71);
for (let round = 0, R = _1n$5, x = 1, y = 0; round < 24; round++) {
  // Pi
  [x, y] = [y, (2 * x + 3 * y) % 5];
  SHA3_PI.push(2 * (5 * y + x));
  // Rotational
  SHA3_ROTL.push((round + 1) * (round + 2) / 2 % 64);
  // Iota
  let t = _0n$4;
  for (let j = 0; j < 7; j++) {
    R = (R << _1n$5 ^ (R >> _7n) * _0x71n) % _256n;
    if (R & _2n$3) t ^= _1n$5 << (_1n$5 << /* @__PURE__ */BigInt(j)) - _1n$5;
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
    data = toBytes(data);
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

function keccak256(value, to_) {
  const to = to_ || 'hex';
  const bytes = keccak_256(isHex(value, {
    strict: false
  }) ? toBytes$1(value) : value);
  if (to === 'bytes') return bytes;
  return toHex(bytes);
}

const hash = value => keccak256(toBytes$1(value));
function hashSignature(sig) {
  return hash(sig);
}

function normalizeSignature(signature) {
  let active = true;
  let current = '';
  let level = 0;
  let result = '';
  let valid = false;
  for (let i = 0; i < signature.length; i++) {
    const char = signature[i];
    // If the character is a separator, we want to reactivate.
    if (['(', ')', ','].includes(char)) active = true;
    // If the character is a "level" token, we want to increment/decrement.
    if (char === '(') level++;
    if (char === ')') level--;
    // If we aren't active, we don't want to mutate the result.
    if (!active) continue;
    // If level === 0, we are at the definition level.
    if (level === 0) {
      if (char === ' ' && ['event', 'function', ''].includes(result)) result = '';else {
        result += char;
        // If we are at the end of the definition, we must be finished.
        if (char === ')') {
          valid = true;
          break;
        }
      }
      continue;
    }
    // Ignore spaces
    if (char === ' ') {
      // If the previous character is a separator, and the current section isn't empty, we want to deactivate.
      if (signature[i - 1] !== ',' && current !== ',' && current !== ',(') {
        current = '';
        active = false;
      }
      continue;
    }
    result += char;
    current += char;
  }
  if (!valid) throw new BaseError('Unable to normalize signature.');
  return result;
}

/**
 * Returns the signature for a given function or event definition.
 *
 * @example
 * const signature = toSignature('function ownerOf(uint256 tokenId)')
 * // 'ownerOf(uint256)'
 *
 * @example
 * const signature_3 = toSignature({
 *   name: 'ownerOf',
 *   type: 'function',
 *   inputs: [{ name: 'tokenId', type: 'uint256' }],
 *   outputs: [],
 *   stateMutability: 'view',
 * })
 * // 'ownerOf(uint256)'
 */
const toSignature = def => {
  const def_ = (() => {
    if (typeof def === 'string') return def;
    return formatAbiItem$1(def);
  })();
  return normalizeSignature(def_);
};

/**
 * Returns the hash (of the function/event signature) for a given event or function definition.
 */
function toSignatureHash(fn) {
  return hashSignature(toSignature(fn));
}

/**
 * Returns the event selector for a given event definition.
 *
 * @example
 * const selector = toEventSelector('Transfer(address indexed from, address indexed to, uint256 amount)')
 * // 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef
 */
const toEventSelector = toSignatureHash;

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
  const hash = keccak256(stringToBytes(hexAddress), 'bytes');
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

function concat(values) {
  if (typeof values[0] === 'string') return concatHex(values);
  return concatBytes$1(values);
}
function concatBytes$1(values) {
  let length = 0;
  for (const arr of values) {
    length += arr.length;
  }
  const result = new Uint8Array(length);
  let offset = 0;
  for (const arr of values) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}
function concatHex(values) {
  return `0x${values.reduce((acc, x) => acc + x.replace('0x', ''), '')}`;
}

/**
 * @description Returns a section of the hex or byte array given a start/end bytes offset.
 *
 * @param value The hex or byte array to slice.
 * @param start The start offset (in bytes).
 * @param end The end offset (in bytes).
 */
function slice(value, start, end, {
  strict
} = {}) {
  if (isHex(value, {
    strict: false
  })) return sliceHex(value, start, end, {
    strict
  });
  return sliceBytes(value, start, end, {
    strict
  });
}
function assertStartOffset(value, start) {
  if (typeof start === 'number' && start > 0 && start > size$1(value) - 1) throw new SliceOffsetOutOfBoundsError({
    offset: start,
    position: 'start',
    size: size$1(value)
  });
}
function assertEndOffset(value, start, end) {
  if (typeof start === 'number' && typeof end === 'number' && size$1(value) !== end - start) {
    throw new SliceOffsetOutOfBoundsError({
      offset: end,
      position: 'end',
      size: size$1(value)
    });
  }
}
/**
 * @description Returns a section of the byte array given a start/end bytes offset.
 *
 * @param value The byte array to slice.
 * @param start The start offset (in bytes).
 * @param end The end offset (in bytes).
 */
function sliceBytes(value_, start, end, {
  strict
} = {}) {
  assertStartOffset(value_, start);
  const value = value_.slice(start, end);
  if (strict) assertEndOffset(value, start, end);
  return value;
}
/**
 * @description Returns a section of the hex value given a start/end bytes offset.
 *
 * @param value The hex value to slice.
 * @param start The start offset (in bytes).
 * @param end The end offset (in bytes).
 */
function sliceHex(value_, start, end, {
  strict
} = {}) {
  assertStartOffset(value_, start);
  const value = `0x${value_.replace('0x', '').slice((start ?? 0) * 2, (end ?? value_.length) * 2)}`;
  if (strict) assertEndOffset(value, start, end);
  return value;
}

/**
 * @description Encodes a list of primitive values into an ABI-encoded hex value.
 *
 * - Docs: https://viem.sh/docs/abi/encodeAbiParameters#encodeabiparameters
 *
 *   Generates ABI encoded data using the [ABI specification](https://docs.soliditylang.org/en/latest/abi-spec), given a set of ABI parameters (inputs/outputs) and their corresponding values.
 *
 * @param params - a set of ABI Parameters (params), that can be in the shape of the inputs or outputs attribute of an ABI Item.
 * @param values - a set of values (values) that correspond to the given params.
 * @example
 * ```typescript
 * import { encodeAbiParameters } from 'viem'
 *
 * const encodedData = encodeAbiParameters(
 *   [
 *     { name: 'x', type: 'string' },
 *     { name: 'y', type: 'uint' },
 *     { name: 'z', type: 'bool' }
 *   ],
 *   ['wagmi', 420n, true]
 * )
 * ```
 *
 * You can also pass in Human Readable parameters with the parseAbiParameters utility.
 *
 * @example
 * ```typescript
 * import { encodeAbiParameters, parseAbiParameters } from 'viem'
 *
 * const encodedData = encodeAbiParameters(
 *   parseAbiParameters('string x, uint y, bool z'),
 *   ['wagmi', 420n, true]
 * )
 * ```
 */
function encodeAbiParameters(params, values) {
  if (params.length !== values.length) throw new AbiEncodingLengthMismatchError({
    expectedLength: params.length,
    givenLength: values.length
  });
  // Prepare the parameters to determine dynamic types to encode.
  const preparedParams = prepareParams({
    params: params,
    values: values
  });
  const data = encodeParams(preparedParams);
  if (data.length === 0) return '0x';
  return data;
}
function prepareParams({
  params,
  values
}) {
  const preparedParams = [];
  for (let i = 0; i < params.length; i++) {
    preparedParams.push(prepareParam({
      param: params[i],
      value: values[i]
    }));
  }
  return preparedParams;
}
function prepareParam({
  param,
  value
}) {
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return encodeArray(value, {
      length,
      param: {
        ...param,
        type
      }
    });
  }
  if (param.type === 'tuple') {
    return encodeTuple(value, {
      param: param
    });
  }
  if (param.type === 'address') {
    return encodeAddress(value);
  }
  if (param.type === 'bool') {
    return encodeBool(value);
  }
  if (param.type.startsWith('uint') || param.type.startsWith('int')) {
    const signed = param.type.startsWith('int');
    return encodeNumber(value, {
      signed
    });
  }
  if (param.type.startsWith('bytes')) {
    return encodeBytes(value, {
      param
    });
  }
  if (param.type === 'string') {
    return encodeString(value);
  }
  throw new InvalidAbiEncodingTypeError(param.type, {
    docsPath: '/docs/contract/encodeAbiParameters'
  });
}
function encodeParams(preparedParams) {
  // 1. Compute the size of the static part of the parameters.
  let staticSize = 0;
  for (let i = 0; i < preparedParams.length; i++) {
    const {
      dynamic,
      encoded
    } = preparedParams[i];
    if (dynamic) staticSize += 32;else staticSize += size$1(encoded);
  }
  // 2. Split the parameters into static and dynamic parts.
  const staticParams = [];
  const dynamicParams = [];
  let dynamicSize = 0;
  for (let i = 0; i < preparedParams.length; i++) {
    const {
      dynamic,
      encoded
    } = preparedParams[i];
    if (dynamic) {
      staticParams.push(numberToHex(staticSize + dynamicSize, {
        size: 32
      }));
      dynamicParams.push(encoded);
      dynamicSize += size$1(encoded);
    } else {
      staticParams.push(encoded);
    }
  }
  // 3. Concatenate static and dynamic parts.
  return concat([...staticParams, ...dynamicParams]);
}
function encodeAddress(value) {
  if (!isAddress(value)) throw new InvalidAddressError({
    address: value
  });
  return {
    dynamic: false,
    encoded: padHex(value.toLowerCase())
  };
}
function encodeArray(value, {
  length,
  param
}) {
  const dynamic = length === null;
  if (!Array.isArray(value)) throw new InvalidArrayError(value);
  if (!dynamic && value.length !== length) throw new AbiEncodingArrayLengthMismatchError({
    expectedLength: length,
    givenLength: value.length,
    type: `${param.type}[${length}]`
  });
  let dynamicChild = false;
  const preparedParams = [];
  for (let i = 0; i < value.length; i++) {
    const preparedParam = prepareParam({
      param,
      value: value[i]
    });
    if (preparedParam.dynamic) dynamicChild = true;
    preparedParams.push(preparedParam);
  }
  if (dynamic || dynamicChild) {
    const data = encodeParams(preparedParams);
    if (dynamic) {
      const length = numberToHex(preparedParams.length, {
        size: 32
      });
      return {
        dynamic: true,
        encoded: preparedParams.length > 0 ? concat([length, data]) : length
      };
    }
    if (dynamicChild) return {
      dynamic: true,
      encoded: data
    };
  }
  return {
    dynamic: false,
    encoded: concat(preparedParams.map(({
      encoded
    }) => encoded))
  };
}
function encodeBytes(value, {
  param
}) {
  const [, paramSize] = param.type.split('bytes');
  const bytesSize = size$1(value);
  if (!paramSize) {
    let value_ = value;
    // If the size is not divisible by 32 bytes, pad the end
    // with empty bytes to the ceiling 32 bytes.
    if (bytesSize % 32 !== 0) value_ = padHex(value_, {
      dir: 'right',
      size: Math.ceil((value.length - 2) / 2 / 32) * 32
    });
    return {
      dynamic: true,
      encoded: concat([padHex(numberToHex(bytesSize, {
        size: 32
      })), value_])
    };
  }
  if (bytesSize !== Number.parseInt(paramSize)) throw new AbiEncodingBytesSizeMismatchError({
    expectedSize: Number.parseInt(paramSize),
    value
  });
  return {
    dynamic: false,
    encoded: padHex(value, {
      dir: 'right'
    })
  };
}
function encodeBool(value) {
  if (typeof value !== 'boolean') throw new BaseError(`Invalid boolean value: "${value}" (type: ${typeof value}). Expected: \`true\` or \`false\`.`);
  return {
    dynamic: false,
    encoded: padHex(boolToHex(value))
  };
}
function encodeNumber(value, {
  signed
}) {
  return {
    dynamic: false,
    encoded: numberToHex(value, {
      size: 32,
      signed
    })
  };
}
function encodeString(value) {
  const hexValue = stringToHex(value);
  const partsLength = Math.ceil(size$1(hexValue) / 32);
  const parts = [];
  for (let i = 0; i < partsLength; i++) {
    parts.push(padHex(slice(hexValue, i * 32, (i + 1) * 32), {
      dir: 'right'
    }));
  }
  return {
    dynamic: true,
    encoded: concat([padHex(numberToHex(size$1(hexValue), {
      size: 32
    })), ...parts])
  };
}
function encodeTuple(value, {
  param
}) {
  let dynamic = false;
  const preparedParams = [];
  for (let i = 0; i < param.components.length; i++) {
    const param_ = param.components[i];
    const index = Array.isArray(value) ? i : param_.name;
    const preparedParam = prepareParam({
      param: param_,
      value: value[index]
    });
    preparedParams.push(preparedParam);
    if (preparedParam.dynamic) dynamic = true;
  }
  return {
    dynamic,
    encoded: dynamic ? encodeParams(preparedParams) : concat(preparedParams.map(({
      encoded
    }) => encoded))
  };
}
function getArrayComponents(type) {
  const matches = type.match(/^(.*)\[(\d+)?\]$/);
  return matches ?
  // Return `null` if the array is dynamic.
  [matches[2] ? Number(matches[2]) : null, matches[1]] : undefined;
}

/**
 * Returns the function selector for a given function definition.
 *
 * @example
 * const selector = toFunctionSelector('function ownerOf(uint256 tokenId)')
 * // 0x6352211e
 */
const toFunctionSelector = fn => slice(toSignatureHash(fn), 0, 4);

function getAbiItem(parameters) {
  const {
    abi,
    args = [],
    name
  } = parameters;
  const isSelector = isHex(name, {
    strict: false
  });
  const abiItems = abi.filter(abiItem => {
    if (isSelector) {
      if (abiItem.type === 'function') return toFunctionSelector(abiItem) === name;
      if (abiItem.type === 'event') return toEventSelector(abiItem) === name;
      return false;
    }
    return 'name' in abiItem && abiItem.name === name;
  });
  if (abiItems.length === 0) return undefined;
  if (abiItems.length === 1) return abiItems[0];
  let matchedAbiItem = undefined;
  for (const abiItem of abiItems) {
    if (!('inputs' in abiItem)) continue;
    if (!args || args.length === 0) {
      if (!abiItem.inputs || abiItem.inputs.length === 0) return abiItem;
      continue;
    }
    if (!abiItem.inputs) continue;
    if (abiItem.inputs.length === 0) continue;
    if (abiItem.inputs.length !== args.length) continue;
    const matched = args.every((arg, index) => {
      const abiParameter = 'inputs' in abiItem && abiItem.inputs[index];
      if (!abiParameter) return false;
      return isArgOfType(arg, abiParameter);
    });
    if (matched) {
      // Check for ambiguity against already matched parameters (e.g. `address` vs `bytes20`).
      if (matchedAbiItem && 'inputs' in matchedAbiItem && matchedAbiItem.inputs) {
        const ambiguousTypes = getAmbiguousTypes(abiItem.inputs, matchedAbiItem.inputs, args);
        if (ambiguousTypes) throw new AbiItemAmbiguityError({
          abiItem,
          type: ambiguousTypes[0]
        }, {
          abiItem: matchedAbiItem,
          type: ambiguousTypes[1]
        });
      }
      matchedAbiItem = abiItem;
    }
  }
  if (matchedAbiItem) return matchedAbiItem;
  return abiItems[0];
}
/** @internal */
function isArgOfType(arg, abiParameter) {
  const argType = typeof arg;
  const abiParameterType = abiParameter.type;
  switch (abiParameterType) {
    case 'address':
      return isAddress(arg, {
        strict: false
      });
    case 'bool':
      return argType === 'boolean';
    case 'function':
      return argType === 'string';
    case 'string':
      return argType === 'string';
    default:
      {
        if (abiParameterType === 'tuple' && 'components' in abiParameter) return Object.values(abiParameter.components).every((component, index) => {
          return isArgOfType(Object.values(arg)[index], component);
        });
        // `(u)int<M>`: (un)signed integer type of `M` bits, `0 < M <= 256`, `M % 8 == 0`
        // https://regexr.com/6v8hp
        if (/^u?int(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/.test(abiParameterType)) return argType === 'number' || argType === 'bigint';
        // `bytes<M>`: binary type of `M` bytes, `0 < M <= 32`
        // https://regexr.com/6va55
        if (/^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/.test(abiParameterType)) return argType === 'string' || arg instanceof Uint8Array;
        // fixed-length (`<type>[M]`) and dynamic (`<type>[]`) arrays
        // https://regexr.com/6va6i
        if (/[a-z]+[1-9]{0,3}(\[[0-9]{0,}\])+$/.test(abiParameterType)) {
          return Array.isArray(arg) && arg.every(x => isArgOfType(x, {
            ...abiParameter,
            // Pop off `[]` or `[M]` from end of type
            type: abiParameterType.replace(/(\[[0-9]{0,}\])$/, '')
          }));
        }
        return false;
      }
  }
}
/** @internal */
function getAmbiguousTypes(sourceParameters, targetParameters, args) {
  for (const parameterIndex in sourceParameters) {
    const sourceParameter = sourceParameters[parameterIndex];
    const targetParameter = targetParameters[parameterIndex];
    if (sourceParameter.type === 'tuple' && targetParameter.type === 'tuple' && 'components' in sourceParameter && 'components' in targetParameter) return getAmbiguousTypes(sourceParameter.components, targetParameter.components, args[parameterIndex]);
    const types = [sourceParameter.type, targetParameter.type];
    const ambiguous = (() => {
      if (types.includes('address') && types.includes('bytes20')) return true;
      if (types.includes('address') && types.includes('string')) return isAddress(args[parameterIndex], {
        strict: false
      });
      if (types.includes('address') && types.includes('bytes')) return isAddress(args[parameterIndex], {
        strict: false
      });
      return false;
    })();
    if (ambiguous) return types;
  }
  return;
}

function parseAccount(account) {
  if (typeof account === 'string') return {
    address: account,
    type: 'json-rpc'
  };
  return account;
}

const docsPath$1 = '/docs/contract/encodeFunctionData';
function prepareEncodeFunctionData(parameters) {
  const {
    abi,
    args,
    functionName
  } = parameters;
  let abiItem = abi[0];
  if (functionName) {
    const item = getAbiItem({
      abi,
      args,
      name: functionName
    });
    if (!item) throw new AbiFunctionNotFoundError(functionName, {
      docsPath: docsPath$1
    });
    abiItem = item;
  }
  if (abiItem.type !== 'function') throw new AbiFunctionNotFoundError(undefined, {
    docsPath: docsPath$1
  });
  return {
    abi: [abiItem],
    functionName: toFunctionSelector(formatAbiItem(abiItem))
  };
}

function encodeFunctionData(parameters) {
  const {
    args
  } = parameters;
  const {
    abi,
    functionName
  } = (() => {
    if (parameters.abi.length === 1 && parameters.functionName?.startsWith('0x')) return parameters;
    return prepareEncodeFunctionData(parameters);
  })();
  const abiItem = abi[0];
  const signature = functionName;
  const data = 'inputs' in abiItem && abiItem.inputs ? encodeAbiParameters(abiItem.inputs, args ?? []) : undefined;
  return concatHex([signature, data ?? '0x']);
}

// https://docs.soliditylang.org/en/v0.8.16/control-structures.html#panic-via-assert-and-error-via-require
const panicReasons = {
  1: 'An `assert` condition failed.',
  17: 'Arithmetic operation resulted in underflow or overflow.',
  18: 'Division or modulo by zero (e.g. `5 / 0` or `23 % 0`).',
  33: 'Attempted to convert to an invalid type.',
  34: 'Attempted to access a storage byte array that is incorrectly encoded.',
  49: 'Performed `.pop()` on an empty array',
  50: 'Array index is out of bounds.',
  65: 'Allocated too much memory or created an array which is too large.',
  81: 'Attempted to call a zero-initialized variable of internal function type.'
};
const solidityError = {
  inputs: [{
    name: 'message',
    type: 'string'
  }],
  name: 'Error',
  type: 'error'
};
const solidityPanic = {
  inputs: [{
    name: 'reason',
    type: 'uint256'
  }],
  name: 'Panic',
  type: 'error'
};

class NegativeOffsetError extends BaseError {
  constructor({
    offset
  }) {
    super(`Offset \`${offset}\` cannot be negative.`, {
      name: 'NegativeOffsetError'
    });
  }
}
class PositionOutOfBoundsError extends BaseError {
  constructor({
    length,
    position
  }) {
    super(`Position \`${position}\` is out of bounds (\`0 < position < ${length}\`).`, {
      name: 'PositionOutOfBoundsError'
    });
  }
}
class RecursiveReadLimitExceededError extends BaseError {
  constructor({
    count,
    limit
  }) {
    super(`Recursive read limit of \`${limit}\` exceeded (recursive read count: \`${count}\`).`, {
      name: 'RecursiveReadLimitExceededError'
    });
  }
}

const staticCursor = {
  bytes: new Uint8Array(),
  dataView: new DataView(new ArrayBuffer(0)),
  position: 0,
  positionReadCount: new Map(),
  recursiveReadCount: 0,
  recursiveReadLimit: Number.POSITIVE_INFINITY,
  assertReadLimit() {
    if (this.recursiveReadCount >= this.recursiveReadLimit) throw new RecursiveReadLimitExceededError({
      count: this.recursiveReadCount + 1,
      limit: this.recursiveReadLimit
    });
  },
  assertPosition(position) {
    if (position < 0 || position > this.bytes.length - 1) throw new PositionOutOfBoundsError({
      length: this.bytes.length,
      position
    });
  },
  decrementPosition(offset) {
    if (offset < 0) throw new NegativeOffsetError({
      offset
    });
    const position = this.position - offset;
    this.assertPosition(position);
    this.position = position;
  },
  getReadCount(position) {
    return this.positionReadCount.get(position || this.position) || 0;
  },
  incrementPosition(offset) {
    if (offset < 0) throw new NegativeOffsetError({
      offset
    });
    const position = this.position + offset;
    this.assertPosition(position);
    this.position = position;
  },
  inspectByte(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position);
    return this.bytes[position];
  },
  inspectBytes(length, position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position + length - 1);
    return this.bytes.subarray(position, position + length);
  },
  inspectUint8(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position);
    return this.bytes[position];
  },
  inspectUint16(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position + 1);
    return this.dataView.getUint16(position);
  },
  inspectUint24(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position + 2);
    return (this.dataView.getUint16(position) << 8) + this.dataView.getUint8(position + 2);
  },
  inspectUint32(position_) {
    const position = position_ ?? this.position;
    this.assertPosition(position + 3);
    return this.dataView.getUint32(position);
  },
  pushByte(byte) {
    this.assertPosition(this.position);
    this.bytes[this.position] = byte;
    this.position++;
  },
  pushBytes(bytes) {
    this.assertPosition(this.position + bytes.length - 1);
    this.bytes.set(bytes, this.position);
    this.position += bytes.length;
  },
  pushUint8(value) {
    this.assertPosition(this.position);
    this.bytes[this.position] = value;
    this.position++;
  },
  pushUint16(value) {
    this.assertPosition(this.position + 1);
    this.dataView.setUint16(this.position, value);
    this.position += 2;
  },
  pushUint24(value) {
    this.assertPosition(this.position + 2);
    this.dataView.setUint16(this.position, value >> 8);
    this.dataView.setUint8(this.position + 2, value & ~4294967040);
    this.position += 3;
  },
  pushUint32(value) {
    this.assertPosition(this.position + 3);
    this.dataView.setUint32(this.position, value);
    this.position += 4;
  },
  readByte() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectByte();
    this.position++;
    return value;
  },
  readBytes(length, size) {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectBytes(length);
    this.position += size ?? length;
    return value;
  },
  readUint8() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectUint8();
    this.position += 1;
    return value;
  },
  readUint16() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectUint16();
    this.position += 2;
    return value;
  },
  readUint24() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectUint24();
    this.position += 3;
    return value;
  },
  readUint32() {
    this.assertReadLimit();
    this._touch();
    const value = this.inspectUint32();
    this.position += 4;
    return value;
  },
  get remaining() {
    return this.bytes.length - this.position;
  },
  setPosition(position) {
    const oldPosition = this.position;
    this.assertPosition(position);
    this.position = position;
    return () => this.position = oldPosition;
  },
  _touch() {
    if (this.recursiveReadLimit === Number.POSITIVE_INFINITY) return;
    const count = this.getReadCount();
    this.positionReadCount.set(this.position, count + 1);
    if (count > 0) this.recursiveReadCount++;
  }
};
function createCursor(bytes, {
  recursiveReadLimit = 8_192
} = {}) {
  const cursor = Object.create(staticCursor);
  cursor.bytes = bytes;
  cursor.dataView = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  cursor.positionReadCount = new Map();
  cursor.recursiveReadLimit = recursiveReadLimit;
  return cursor;
}

/**
 * Decodes a byte array into a bigint.
 *
 * - Docs: https://viem.sh/docs/utilities/fromBytes#bytestobigint
 *
 * @param bytes Byte array to decode.
 * @param opts Options.
 * @returns BigInt value.
 *
 * @example
 * import { bytesToBigInt } from 'viem'
 * const data = bytesToBigInt(new Uint8Array([1, 164]))
 * // 420n
 */
function bytesToBigInt(bytes, opts = {}) {
  if (typeof opts.size !== 'undefined') assertSize(bytes, {
    size: opts.size
  });
  const hex = bytesToHex$1(bytes, opts);
  return hexToBigInt(hex, opts);
}
/**
 * Decodes a byte array into a boolean.
 *
 * - Docs: https://viem.sh/docs/utilities/fromBytes#bytestobool
 *
 * @param bytes Byte array to decode.
 * @param opts Options.
 * @returns Boolean value.
 *
 * @example
 * import { bytesToBool } from 'viem'
 * const data = bytesToBool(new Uint8Array([1]))
 * // true
 */
function bytesToBool(bytes_, opts = {}) {
  let bytes = bytes_;
  if (typeof opts.size !== 'undefined') {
    assertSize(bytes, {
      size: opts.size
    });
    bytes = trim(bytes);
  }
  if (bytes.length > 1 || bytes[0] > 1) throw new InvalidBytesBooleanError(bytes);
  return Boolean(bytes[0]);
}
/**
 * Decodes a byte array into a number.
 *
 * - Docs: https://viem.sh/docs/utilities/fromBytes#bytestonumber
 *
 * @param bytes Byte array to decode.
 * @param opts Options.
 * @returns Number value.
 *
 * @example
 * import { bytesToNumber } from 'viem'
 * const data = bytesToNumber(new Uint8Array([1, 164]))
 * // 420
 */
function bytesToNumber(bytes, opts = {}) {
  if (typeof opts.size !== 'undefined') assertSize(bytes, {
    size: opts.size
  });
  const hex = bytesToHex$1(bytes, opts);
  return hexToNumber$1(hex, opts);
}
/**
 * Decodes a byte array into a UTF-8 string.
 *
 * - Docs: https://viem.sh/docs/utilities/fromBytes#bytestostring
 *
 * @param bytes Byte array to decode.
 * @param opts Options.
 * @returns String value.
 *
 * @example
 * import { bytesToString } from 'viem'
 * const data = bytesToString(new Uint8Array([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100, 33]))
 * // 'Hello world'
 */
function bytesToString(bytes_, opts = {}) {
  let bytes = bytes_;
  if (typeof opts.size !== 'undefined') {
    assertSize(bytes, {
      size: opts.size
    });
    bytes = trim(bytes, {
      dir: 'right'
    });
  }
  return new TextDecoder().decode(bytes);
}

function decodeAbiParameters(params, data) {
  const bytes = typeof data === 'string' ? hexToBytes$1(data) : data;
  const cursor = createCursor(bytes);
  if (size$1(bytes) === 0 && params.length > 0) throw new AbiDecodingZeroDataError();
  if (size$1(data) && size$1(data) < 32) throw new AbiDecodingDataSizeTooSmallError({
    data: typeof data === 'string' ? data : bytesToHex$1(data),
    params: params,
    size: size$1(data)
  });
  let consumed = 0;
  const values = [];
  for (let i = 0; i < params.length; ++i) {
    const param = params[i];
    cursor.setPosition(consumed);
    const [data, consumed_] = decodeParameter(cursor, param, {
      staticPosition: 0
    });
    consumed += consumed_;
    values.push(data);
  }
  return values;
}
function decodeParameter(cursor, param, {
  staticPosition
}) {
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents) {
    const [length, type] = arrayComponents;
    return decodeArray(cursor, {
      ...param,
      type
    }, {
      length,
      staticPosition
    });
  }
  if (param.type === 'tuple') return decodeTuple(cursor, param, {
    staticPosition
  });
  if (param.type === 'address') return decodeAddress(cursor);
  if (param.type === 'bool') return decodeBool(cursor);
  if (param.type.startsWith('bytes')) return decodeBytes(cursor, param, {
    staticPosition
  });
  if (param.type.startsWith('uint') || param.type.startsWith('int')) return decodeNumber(cursor, param);
  if (param.type === 'string') return decodeString(cursor, {
    staticPosition
  });
  throw new InvalidAbiDecodingTypeError(param.type, {
    docsPath: '/docs/contract/decodeAbiParameters'
  });
}
////////////////////////////////////////////////////////////////////
// Type Decoders
const sizeOfLength = 32;
const sizeOfOffset = 32;
function decodeAddress(cursor) {
  const value = cursor.readBytes(32);
  return [checksumAddress(bytesToHex$1(sliceBytes(value, -20))), 32];
}
function decodeArray(cursor, param, {
  length,
  staticPosition
}) {
  // If the length of the array is not known in advance (dynamic array),
  // this means we will need to wonder off to the pointer and decode.
  if (!length) {
    // Dealing with a dynamic type, so get the offset of the array data.
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    // Start is the static position of current slot + offset.
    const start = staticPosition + offset;
    const startOfData = start + sizeOfLength;
    // Get the length of the array from the offset.
    cursor.setPosition(start);
    const length = bytesToNumber(cursor.readBytes(sizeOfLength));
    // Check if the array has any dynamic children.
    const dynamicChild = hasDynamicChild(param);
    let consumed = 0;
    const value = [];
    for (let i = 0; i < length; ++i) {
      // If any of the children is dynamic, then all elements will be offset pointer, thus size of one slot (32 bytes).
      // Otherwise, elements will be the size of their encoding (consumed bytes).
      cursor.setPosition(startOfData + (dynamicChild ? i * 32 : consumed));
      const [data, consumed_] = decodeParameter(cursor, param, {
        staticPosition: startOfData
      });
      consumed += consumed_;
      value.push(data);
    }
    // As we have gone wondering, restore to the original position + next slot.
    cursor.setPosition(staticPosition + 32);
    return [value, 32];
  }
  // If the length of the array is known in advance,
  // and the length of an element deeply nested in the array is not known,
  // we need to decode the offset of the array data.
  if (hasDynamicChild(param)) {
    // Dealing with dynamic types, so get the offset of the array data.
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    // Start is the static position of current slot + offset.
    const start = staticPosition + offset;
    const value = [];
    for (let i = 0; i < length; ++i) {
      // Move cursor along to the next slot (next offset pointer).
      cursor.setPosition(start + i * 32);
      const [data] = decodeParameter(cursor, param, {
        staticPosition: start
      });
      value.push(data);
    }
    // As we have gone wondering, restore to the original position + next slot.
    cursor.setPosition(staticPosition + 32);
    return [value, 32];
  }
  // If the length of the array is known in advance and the array is deeply static,
  // then we can just decode each element in sequence.
  let consumed = 0;
  const value = [];
  for (let i = 0; i < length; ++i) {
    const [data, consumed_] = decodeParameter(cursor, param, {
      staticPosition: staticPosition + consumed
    });
    consumed += consumed_;
    value.push(data);
  }
  return [value, consumed];
}
function decodeBool(cursor) {
  return [bytesToBool(cursor.readBytes(32), {
    size: 32
  }), 32];
}
function decodeBytes(cursor, param, {
  staticPosition
}) {
  const [_, size] = param.type.split('bytes');
  if (!size) {
    // Dealing with dynamic types, so get the offset of the bytes data.
    const offset = bytesToNumber(cursor.readBytes(32));
    // Set position of the cursor to start of bytes data.
    cursor.setPosition(staticPosition + offset);
    const length = bytesToNumber(cursor.readBytes(32));
    // If there is no length, we have zero data.
    if (length === 0) {
      // As we have gone wondering, restore to the original position + next slot.
      cursor.setPosition(staticPosition + 32);
      return ['0x', 32];
    }
    const data = cursor.readBytes(length);
    // As we have gone wondering, restore to the original position + next slot.
    cursor.setPosition(staticPosition + 32);
    return [bytesToHex$1(data), 32];
  }
  const value = bytesToHex$1(cursor.readBytes(Number.parseInt(size), 32));
  return [value, 32];
}
function decodeNumber(cursor, param) {
  const signed = param.type.startsWith('int');
  const size = Number.parseInt(param.type.split('int')[1] || '256');
  const value = cursor.readBytes(32);
  return [size > 48 ? bytesToBigInt(value, {
    signed
  }) : bytesToNumber(value, {
    signed
  }), 32];
}
function decodeTuple(cursor, param, {
  staticPosition
}) {
  // Tuples can have unnamed components (i.e. they are arrays), so we must
  // determine whether the tuple is named or unnamed. In the case of a named
  // tuple, the value will be an object where each property is the name of the
  // component. In the case of an unnamed tuple, the value will be an array.
  const hasUnnamedChild = param.components.length === 0 || param.components.some(({
    name
  }) => !name);
  // Initialize the value to an object or an array, depending on whether the
  // tuple is named or unnamed.
  const value = hasUnnamedChild ? [] : {};
  let consumed = 0;
  // If the tuple has a dynamic child, we must first decode the offset to the
  // tuple data.
  if (hasDynamicChild(param)) {
    // Dealing with dynamic types, so get the offset of the tuple data.
    const offset = bytesToNumber(cursor.readBytes(sizeOfOffset));
    // Start is the static position of referencing slot + offset.
    const start = staticPosition + offset;
    for (let i = 0; i < param.components.length; ++i) {
      const component = param.components[i];
      cursor.setPosition(start + consumed);
      const [data, consumed_] = decodeParameter(cursor, component, {
        staticPosition: start
      });
      consumed += consumed_;
      value[hasUnnamedChild ? i : component?.name] = data;
    }
    // As we have gone wondering, restore to the original position + next slot.
    cursor.setPosition(staticPosition + 32);
    return [value, 32];
  }
  // If the tuple has static children, we can just decode each component
  // in sequence.
  for (let i = 0; i < param.components.length; ++i) {
    const component = param.components[i];
    const [data, consumed_] = decodeParameter(cursor, component, {
      staticPosition
    });
    value[hasUnnamedChild ? i : component?.name] = data;
    consumed += consumed_;
  }
  return [value, consumed];
}
function decodeString(cursor, {
  staticPosition
}) {
  // Get offset to start of string data.
  const offset = bytesToNumber(cursor.readBytes(32));
  // Start is the static position of current slot + offset.
  const start = staticPosition + offset;
  cursor.setPosition(start);
  const length = bytesToNumber(cursor.readBytes(32));
  // If there is no length, we have zero data (empty string).
  if (length === 0) {
    cursor.setPosition(staticPosition + 32);
    return ['', 32];
  }
  const data = cursor.readBytes(length, 32);
  const value = bytesToString(trim(data));
  // As we have gone wondering, restore to the original position + next slot.
  cursor.setPosition(staticPosition + 32);
  return [value, 32];
}
function hasDynamicChild(param) {
  const {
    type
  } = param;
  if (type === 'string') return true;
  if (type === 'bytes') return true;
  if (type.endsWith('[]')) return true;
  if (type === 'tuple') return param.components?.some(hasDynamicChild);
  const arrayComponents = getArrayComponents(param.type);
  if (arrayComponents && hasDynamicChild({
    ...param,
    type: arrayComponents[1]
  })) return true;
  return false;
}

function decodeErrorResult(parameters) {
  const {
    abi,
    data
  } = parameters;
  const signature = slice(data, 0, 4);
  if (signature === '0x') throw new AbiDecodingZeroDataError();
  const abi_ = [...(abi || []), solidityError, solidityPanic];
  const abiItem = abi_.find(x => x.type === 'error' && signature === toFunctionSelector(formatAbiItem(x)));
  if (!abiItem) throw new AbiErrorSignatureNotFoundError(signature, {
    docsPath: '/docs/contract/decodeErrorResult'
  });
  return {
    abiItem,
    args: 'inputs' in abiItem && abiItem.inputs && abiItem.inputs.length > 0 ? decodeAbiParameters(abiItem.inputs, slice(data, 4)) : undefined,
    errorName: abiItem.name
  };
}

const stringify = (value, replacer, space) => JSON.stringify(value, (key, value_) => {
  const value = typeof value_ === 'bigint' ? value_.toString() : value_;
  return value;
}, space);

function formatAbiItemWithArgs({
  abiItem,
  args,
  includeFunctionName = true,
  includeName = false
}) {
  if (!('name' in abiItem)) return;
  if (!('inputs' in abiItem)) return;
  if (!abiItem.inputs) return;
  return `${includeFunctionName ? abiItem.name : ''}(${abiItem.inputs.map((input, i) => `${includeName && input.name ? `${input.name}: ` : ''}${typeof args[i] === 'object' ? stringify(args[i]) : args[i]}`).join(', ')})`;
}

const etherUnits = {
  gwei: 9,
  wei: 18
};
const gweiUnits = {
  ether: -9,
  wei: 9
};

/**
 *  Divides a number by a given exponent of base 10 (10exponent), and formats it into a string representation of the number..
 *
 * - Docs: https://viem.sh/docs/utilities/formatUnits
 *
 * @example
 * import { formatUnits } from 'viem'
 *
 * formatUnits(420000000000n, 9)
 * // '420'
 */
function formatUnits(value, decimals) {
  let display = value.toString();
  const negative = display.startsWith('-');
  if (negative) display = display.slice(1);
  display = display.padStart(decimals, '0');
  let [integer, fraction] = [display.slice(0, display.length - decimals), display.slice(display.length - decimals)];
  fraction = fraction.replace(/(0+)$/, '');
  return `${negative ? '-' : ''}${integer || '0'}${fraction ? `.${fraction}` : ''}`;
}

/**
 * Converts numerical wei to a string representation of ether.
 *
 * - Docs: https://viem.sh/docs/utilities/formatEther
 *
 * @example
 * import { formatEther } from 'viem'
 *
 * formatEther(1000000000000000000n)
 * // '1'
 */
function formatEther(wei, unit = 'wei') {
  return formatUnits(wei, etherUnits[unit]);
}

/**
 * Converts numerical wei to a string representation of gwei.
 *
 * - Docs: https://viem.sh/docs/utilities/formatGwei
 *
 * @example
 * import { formatGwei } from 'viem'
 *
 * formatGwei(1000000000n)
 * // '1'
 */
function formatGwei(wei, unit = 'wei') {
  return formatUnits(wei, gweiUnits[unit]);
}

class AccountStateConflictError extends BaseError {
  constructor({
    address
  }) {
    super(`State for account "${address}" is set multiple times.`, {
      name: 'AccountStateConflictError'
    });
  }
}
class StateAssignmentConflictError extends BaseError {
  constructor() {
    super('state and stateDiff are set on the same account.', {
      name: 'StateAssignmentConflictError'
    });
  }
}

function prettyPrint(args) {
  const entries = Object.entries(args).map(([key, value]) => {
    if (value === undefined || value === false) return null;
    return [key, value];
  }).filter(Boolean);
  const maxLength = entries.reduce((acc, [key]) => Math.max(acc, key.length), 0);
  return entries.map(([key, value]) => `  ${`${key}:`.padEnd(maxLength + 1)}  ${value}`).join('\n');
}
class FeeConflictError extends BaseError {
  constructor() {
    super(['Cannot specify both a `gasPrice` and a `maxFeePerGas`/`maxPriorityFeePerGas`.', 'Use `maxFeePerGas`/`maxPriorityFeePerGas` for EIP-1559 compatible networks, and `gasPrice` for others.'].join('\n'), {
      name: 'FeeConflictError'
    });
  }
}
class InvalidSerializableTransactionError extends BaseError {
  constructor({
    transaction
  }) {
    super('Cannot infer a transaction type from provided transaction.', {
      metaMessages: ['Provided Transaction:', '{', prettyPrint(transaction), '}', '', 'To infer the type, either provide:', '- a `type` to the Transaction, or', '- an EIP-1559 Transaction with `maxFeePerGas`, or', '- an EIP-2930 Transaction with `gasPrice` & `accessList`, or', '- an EIP-4844 Transaction with `blobs`, `blobVersionedHashes`, `sidecars`, or', '- an EIP-7702 Transaction with `authorizationList`, or', '- a Legacy Transaction with `gasPrice`'],
      name: 'InvalidSerializableTransactionError'
    });
  }
}
class TransactionExecutionError extends BaseError {
  constructor(cause, {
    account,
    docsPath,
    chain,
    data,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    to,
    value
  }) {
    const prettyArgs = prettyPrint({
      chain: chain && `${chain?.name} (id: ${chain?.id})`,
      from: account?.address,
      to,
      value: typeof value !== 'undefined' && `${formatEther(value)} ${chain?.nativeCurrency?.symbol || 'ETH'}`,
      data,
      gas,
      gasPrice: typeof gasPrice !== 'undefined' && `${formatGwei(gasPrice)} gwei`,
      maxFeePerGas: typeof maxFeePerGas !== 'undefined' && `${formatGwei(maxFeePerGas)} gwei`,
      maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== 'undefined' && `${formatGwei(maxPriorityFeePerGas)} gwei`,
      nonce
    });
    super(cause.shortMessage, {
      cause,
      docsPath,
      metaMessages: [...(cause.metaMessages ? [...cause.metaMessages, ' '] : []), 'Request Arguments:', prettyArgs].filter(Boolean),
      name: 'TransactionExecutionError'
    });
    Object.defineProperty(this, "cause", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.cause = cause;
  }
}

const getContractAddress = address => address;
const getUrl = url => url;

class ContractFunctionExecutionError extends BaseError {
  constructor(cause, {
    abi,
    args,
    contractAddress,
    docsPath,
    functionName,
    sender
  }) {
    const abiItem = getAbiItem({
      abi,
      args,
      name: functionName
    });
    const formattedArgs = abiItem ? formatAbiItemWithArgs({
      abiItem,
      args,
      includeFunctionName: false,
      includeName: false
    }) : undefined;
    const functionWithParams = abiItem ? formatAbiItem(abiItem, {
      includeName: true
    }) : undefined;
    const prettyArgs = prettyPrint({
      address: contractAddress && getContractAddress(contractAddress),
      function: functionWithParams,
      args: formattedArgs && formattedArgs !== '()' && `${[...Array(functionName?.length ?? 0).keys()].map(() => ' ').join('')}${formattedArgs}`,
      sender
    });
    super(cause.shortMessage || `An unknown error occurred while executing the contract function "${functionName}".`, {
      cause,
      docsPath,
      metaMessages: [...(cause.metaMessages ? [...cause.metaMessages, ' '] : []), prettyArgs && 'Contract Call:', prettyArgs].filter(Boolean),
      name: 'ContractFunctionExecutionError'
    });
    Object.defineProperty(this, "abi", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "args", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "cause", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "contractAddress", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "formattedArgs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "functionName", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "sender", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.abi = abi;
    this.args = args;
    this.cause = cause;
    this.contractAddress = contractAddress;
    this.functionName = functionName;
    this.sender = sender;
  }
}
class ContractFunctionRevertedError extends BaseError {
  constructor({
    abi,
    data,
    functionName,
    message
  }) {
    let cause;
    let decodedData = undefined;
    let metaMessages;
    let reason;
    if (data && data !== '0x') {
      try {
        decodedData = decodeErrorResult({
          abi,
          data
        });
        const {
          abiItem,
          errorName,
          args: errorArgs
        } = decodedData;
        if (errorName === 'Error') {
          reason = errorArgs[0];
        } else if (errorName === 'Panic') {
          const [firstArg] = errorArgs;
          reason = panicReasons[firstArg];
        } else {
          const errorWithParams = abiItem ? formatAbiItem(abiItem, {
            includeName: true
          }) : undefined;
          const formattedArgs = abiItem && errorArgs ? formatAbiItemWithArgs({
            abiItem,
            args: errorArgs,
            includeFunctionName: false,
            includeName: false
          }) : undefined;
          metaMessages = [errorWithParams ? `Error: ${errorWithParams}` : '', formattedArgs && formattedArgs !== '()' ? `       ${[...Array(errorName?.length ?? 0).keys()].map(() => ' ').join('')}${formattedArgs}` : ''];
        }
      } catch (err) {
        cause = err;
      }
    } else if (message) reason = message;
    let signature;
    if (cause instanceof AbiErrorSignatureNotFoundError) {
      signature = cause.signature;
      metaMessages = [`Unable to decode signature "${signature}" as it was not found on the provided ABI.`, 'Make sure you are using the correct ABI and that the error exists on it.', `You can look up the decoded signature here: https://openchain.xyz/signatures?query=${signature}.`];
    }
    super(reason && reason !== 'execution reverted' || signature ? [`The contract function "${functionName}" reverted with the following ${signature ? 'signature' : 'reason'}:`, reason || signature].join('\n') : `The contract function "${functionName}" reverted.`, {
      cause,
      metaMessages,
      name: 'ContractFunctionRevertedError'
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "reason", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "signature", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.data = decodedData;
    this.reason = reason;
    this.signature = signature;
  }
}
class ContractFunctionZeroDataError extends BaseError {
  constructor({
    functionName
  }) {
    super(`The contract function "${functionName}" returned no data ("0x").`, {
      metaMessages: ['This could be due to any of the following:', `  - The contract does not have the function "${functionName}",`, '  - The parameters passed to the contract function may be invalid, or', '  - The address is not a contract.'],
      name: 'ContractFunctionZeroDataError'
    });
  }
}
class RawContractError extends BaseError {
  constructor({
    data,
    message
  }) {
    super(message || '', {
      name: 'RawContractError'
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 3
    });
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.data = data;
  }
}

class HttpRequestError extends BaseError {
  constructor({
    body,
    cause,
    details,
    headers,
    status,
    url
  }) {
    super('HTTP request failed.', {
      cause,
      details,
      metaMessages: [status && `Status: ${status}`, `URL: ${getUrl(url)}`, body && `Request body: ${stringify(body)}`].filter(Boolean),
      name: 'HttpRequestError'
    });
    Object.defineProperty(this, "body", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "headers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "status", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "url", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.body = body;
    this.headers = headers;
    this.status = status;
    this.url = url;
  }
}
class RpcRequestError extends BaseError {
  constructor({
    body,
    error,
    url
  }) {
    super('RPC Request failed.', {
      cause: error,
      details: error.message,
      metaMessages: [`URL: ${getUrl(url)}`, `Request body: ${stringify(body)}`],
      name: 'RpcRequestError'
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.code = error.code;
  }
}

const unknownErrorCode = -1;
class RpcError extends BaseError {
  constructor(cause, {
    code,
    docsPath,
    metaMessages,
    name,
    shortMessage
  }) {
    super(shortMessage, {
      cause,
      docsPath,
      metaMessages: metaMessages || cause?.metaMessages,
      name: name || 'RpcError'
    });
    Object.defineProperty(this, "code", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.name = name || cause.name;
    this.code = cause instanceof RpcRequestError ? cause.code : code ?? unknownErrorCode;
  }
}
class ProviderRpcError extends RpcError {
  constructor(cause, options) {
    super(cause, options);
    Object.defineProperty(this, "data", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.data = options.data;
  }
}
class ParseRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: ParseRpcError.code,
      name: 'ParseRpcError',
      shortMessage: 'Invalid JSON was received by the server. An error occurred on the server while parsing the JSON text.'
    });
  }
}
Object.defineProperty(ParseRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32700
});
class InvalidRequestRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: InvalidRequestRpcError.code,
      name: 'InvalidRequestRpcError',
      shortMessage: 'JSON is not a valid request object.'
    });
  }
}
Object.defineProperty(InvalidRequestRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32600
});
class MethodNotFoundRpcError extends RpcError {
  constructor(cause, {
    method
  } = {}) {
    super(cause, {
      code: MethodNotFoundRpcError.code,
      name: 'MethodNotFoundRpcError',
      shortMessage: `The method${method ? ` "${method}"` : ''} does not exist / is not available.`
    });
  }
}
Object.defineProperty(MethodNotFoundRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32601
});
class InvalidParamsRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: InvalidParamsRpcError.code,
      name: 'InvalidParamsRpcError',
      shortMessage: ['Invalid parameters were provided to the RPC method.', 'Double check you have provided the correct parameters.'].join('\n')
    });
  }
}
Object.defineProperty(InvalidParamsRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32602
});
class InternalRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: InternalRpcError.code,
      name: 'InternalRpcError',
      shortMessage: 'An internal error was received.'
    });
  }
}
Object.defineProperty(InternalRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32603
});
class InvalidInputRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: InvalidInputRpcError.code,
      name: 'InvalidInputRpcError',
      shortMessage: ['Missing or invalid parameters.', 'Double check you have provided the correct parameters.'].join('\n')
    });
  }
}
Object.defineProperty(InvalidInputRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32000
});
class ResourceNotFoundRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: ResourceNotFoundRpcError.code,
      name: 'ResourceNotFoundRpcError',
      shortMessage: 'Requested resource not found.'
    });
    Object.defineProperty(this, "name", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 'ResourceNotFoundRpcError'
    });
  }
}
Object.defineProperty(ResourceNotFoundRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32001
});
class ResourceUnavailableRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: ResourceUnavailableRpcError.code,
      name: 'ResourceUnavailableRpcError',
      shortMessage: 'Requested resource not available.'
    });
  }
}
Object.defineProperty(ResourceUnavailableRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32002
});
class TransactionRejectedRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: TransactionRejectedRpcError.code,
      name: 'TransactionRejectedRpcError',
      shortMessage: 'Transaction creation failed.'
    });
  }
}
Object.defineProperty(TransactionRejectedRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32003
});
class MethodNotSupportedRpcError extends RpcError {
  constructor(cause, {
    method
  } = {}) {
    super(cause, {
      code: MethodNotSupportedRpcError.code,
      name: 'MethodNotSupportedRpcError',
      shortMessage: `Method${method ? ` "${method}"` : ''} is not implemented.`
    });
  }
}
Object.defineProperty(MethodNotSupportedRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32004
});
class LimitExceededRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: LimitExceededRpcError.code,
      name: 'LimitExceededRpcError',
      shortMessage: 'Request exceeds defined limit.'
    });
  }
}
Object.defineProperty(LimitExceededRpcError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32005
});
class JsonRpcVersionUnsupportedError extends RpcError {
  constructor(cause) {
    super(cause, {
      code: JsonRpcVersionUnsupportedError.code,
      name: 'JsonRpcVersionUnsupportedError',
      shortMessage: 'Version of JSON-RPC protocol is not supported.'
    });
  }
}
Object.defineProperty(JsonRpcVersionUnsupportedError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: -32006
});
class UserRejectedRequestError extends ProviderRpcError {
  constructor(cause) {
    super(cause, {
      code: UserRejectedRequestError.code,
      name: 'UserRejectedRequestError',
      shortMessage: 'User rejected the request.'
    });
  }
}
Object.defineProperty(UserRejectedRequestError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4001
});
class UnauthorizedProviderError extends ProviderRpcError {
  constructor(cause) {
    super(cause, {
      code: UnauthorizedProviderError.code,
      name: 'UnauthorizedProviderError',
      shortMessage: 'The requested method and/or account has not been authorized by the user.'
    });
  }
}
Object.defineProperty(UnauthorizedProviderError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4100
});
class UnsupportedProviderMethodError extends ProviderRpcError {
  constructor(cause, {
    method
  } = {}) {
    super(cause, {
      code: UnsupportedProviderMethodError.code,
      name: 'UnsupportedProviderMethodError',
      shortMessage: `The Provider does not support the requested method${method ? ` " ${method}"` : ''}.`
    });
  }
}
Object.defineProperty(UnsupportedProviderMethodError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4200
});
class ProviderDisconnectedError extends ProviderRpcError {
  constructor(cause) {
    super(cause, {
      code: ProviderDisconnectedError.code,
      name: 'ProviderDisconnectedError',
      shortMessage: 'The Provider is disconnected from all chains.'
    });
  }
}
Object.defineProperty(ProviderDisconnectedError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4900
});
class ChainDisconnectedError extends ProviderRpcError {
  constructor(cause) {
    super(cause, {
      code: ChainDisconnectedError.code,
      name: 'ChainDisconnectedError',
      shortMessage: 'The Provider is not connected to the requested chain.'
    });
  }
}
Object.defineProperty(ChainDisconnectedError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4901
});
class SwitchChainError extends ProviderRpcError {
  constructor(cause) {
    super(cause, {
      code: SwitchChainError.code,
      name: 'SwitchChainError',
      shortMessage: 'An error occurred when attempting to switch chain.'
    });
  }
}
Object.defineProperty(SwitchChainError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 4902
});
class UnknownRpcError extends RpcError {
  constructor(cause) {
    super(cause, {
      name: 'UnknownRpcError',
      shortMessage: 'An unknown RPC error occurred.'
    });
  }
}

const EXECUTION_REVERTED_ERROR_CODE = 3;
function getContractError(err, {
  abi,
  address,
  args,
  docsPath,
  functionName,
  sender
}) {
  const {
    code,
    data,
    message,
    shortMessage
  } = err instanceof RawContractError ? err : err instanceof BaseError ? err.walk(err => 'data' in err) || err.walk() : {};
  const cause = (() => {
    if (err instanceof AbiDecodingZeroDataError) return new ContractFunctionZeroDataError({
      functionName
    });
    if ([EXECUTION_REVERTED_ERROR_CODE, InternalRpcError.code].includes(code) && (data || message || shortMessage)) {
      return new ContractFunctionRevertedError({
        abi,
        data: typeof data === 'object' ? data.data : data,
        functionName,
        message: shortMessage ?? message
      });
    }
    return err;
  })();
  return new ContractFunctionExecutionError(cause, {
    abi,
    args,
    contractAddress: address,
    docsPath,
    functionName,
    sender
  });
}

/**
 * @description Converts an ECDSA public key to an address.
 *
 * @param publicKey The public key to convert.
 *
 * @returns The address.
 */
function publicKeyToAddress(publicKey) {
  const address = keccak256(`0x${publicKey.substring(4)}`).substring(26);
  return checksumAddress(`0x${address}`);
}

async function recoverPublicKey({
  hash,
  signature
}) {
  const hashHex = isHex(hash) ? hash : toHex(hash);
  const {
    secp256k1
  } = await Promise.resolve().then(function () { return secp256k1$1; });
  const signature_ = (() => {
    // typeof signature: `Signature`
    if (typeof signature === 'object' && 'r' in signature && 's' in signature) {
      const {
        r,
        s,
        v,
        yParity
      } = signature;
      const yParityOrV = Number(yParity ?? v);
      const recoveryBit = toRecoveryBit(yParityOrV);
      return new secp256k1.Signature(hexToBigInt(r), hexToBigInt(s)).addRecoveryBit(recoveryBit);
    }
    // typeof signature: `Hex | ByteArray`
    const signatureHex = isHex(signature) ? signature : toHex(signature);
    const yParityOrV = hexToNumber$1(`0x${signatureHex.slice(130)}`);
    const recoveryBit = toRecoveryBit(yParityOrV);
    return secp256k1.Signature.fromCompact(signatureHex.substring(2, 130)).addRecoveryBit(recoveryBit);
  })();
  const publicKey = signature_.recoverPublicKey(hashHex.substring(2)).toHex(false);
  return `0x${publicKey}`;
}
function toRecoveryBit(yParityOrV) {
  if (yParityOrV === 0 || yParityOrV === 1) return yParityOrV;
  if (yParityOrV === 27) return 0;
  if (yParityOrV === 28) return 1;
  throw new Error('Invalid yParityOrV value');
}

async function recoverAddress({
  hash,
  signature
}) {
  return publicKeyToAddress(await recoverPublicKey({
    hash: hash,
    signature
  }));
}

function toRlp(bytes, to = 'hex') {
  const encodable = getEncodable(bytes);
  const cursor = createCursor(new Uint8Array(encodable.length));
  encodable.encode(cursor);
  if (to === 'hex') return bytesToHex$1(cursor.bytes);
  return cursor.bytes;
}
function getEncodable(bytes) {
  if (Array.isArray(bytes)) return getEncodableList(bytes.map(x => getEncodable(x)));
  return getEncodableBytes(bytes);
}
function getEncodableList(list) {
  const bodyLength = list.reduce((acc, x) => acc + x.length, 0);
  const sizeOfBodyLength = getSizeOfLength(bodyLength);
  const length = (() => {
    if (bodyLength <= 55) return 1 + bodyLength;
    return 1 + sizeOfBodyLength + bodyLength;
  })();
  return {
    length,
    encode(cursor) {
      if (bodyLength <= 55) {
        cursor.pushByte(0xc0 + bodyLength);
      } else {
        cursor.pushByte(0xc0 + 55 + sizeOfBodyLength);
        if (sizeOfBodyLength === 1) cursor.pushUint8(bodyLength);else if (sizeOfBodyLength === 2) cursor.pushUint16(bodyLength);else if (sizeOfBodyLength === 3) cursor.pushUint24(bodyLength);else cursor.pushUint32(bodyLength);
      }
      for (const {
        encode
      } of list) {
        encode(cursor);
      }
    }
  };
}
function getEncodableBytes(bytesOrHex) {
  const bytes = typeof bytesOrHex === 'string' ? hexToBytes$1(bytesOrHex) : bytesOrHex;
  const sizeOfBytesLength = getSizeOfLength(bytes.length);
  const length = (() => {
    if (bytes.length === 1 && bytes[0] < 0x80) return 1;
    if (bytes.length <= 55) return 1 + bytes.length;
    return 1 + sizeOfBytesLength + bytes.length;
  })();
  return {
    length,
    encode(cursor) {
      if (bytes.length === 1 && bytes[0] < 0x80) {
        cursor.pushBytes(bytes);
      } else if (bytes.length <= 55) {
        cursor.pushByte(0x80 + bytes.length);
        cursor.pushBytes(bytes);
      } else {
        cursor.pushByte(0x80 + 55 + sizeOfBytesLength);
        if (sizeOfBytesLength === 1) cursor.pushUint8(bytes.length);else if (sizeOfBytesLength === 2) cursor.pushUint16(bytes.length);else if (sizeOfBytesLength === 3) cursor.pushUint24(bytes.length);else cursor.pushUint32(bytes.length);
        cursor.pushBytes(bytes);
      }
    }
  };
}
function getSizeOfLength(length) {
  if (length < 2 ** 8) return 1;
  if (length < 2 ** 16) return 2;
  if (length < 2 ** 24) return 3;
  if (length < 2 ** 32) return 4;
  throw new BaseError('Length is too large.');
}

/**
 * Computes an Authorization hash in [EIP-7702 format](https://eips.ethereum.org/EIPS/eip-7702): `keccak256('0x05' || rlp([chain_id, address, nonce]))`.
 */
function hashAuthorization(parameters) {
  const {
    chainId,
    contractAddress,
    nonce,
    to
  } = parameters;
  const hash = keccak256(concatHex(['0x05', toRlp([chainId ? numberToHex(chainId) : '0x', contractAddress, nonce ? numberToHex(nonce) : '0x'])]));
  if (to === 'bytes') return hexToBytes$1(hash);
  return hash;
}

async function recoverAuthorizationAddress(parameters) {
  const {
    authorization,
    signature
  } = parameters;
  return recoverAddress({
    hash: hashAuthorization(authorization),
    signature: signature ?? authorization
  });
}

class EstimateGasExecutionError extends BaseError {
  constructor(cause, {
    account,
    docsPath,
    chain,
    data,
    gas,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    to,
    value
  }) {
    const prettyArgs = prettyPrint({
      from: account?.address,
      to,
      value: typeof value !== 'undefined' && `${formatEther(value)} ${chain?.nativeCurrency?.symbol || 'ETH'}`,
      data,
      gas,
      gasPrice: typeof gasPrice !== 'undefined' && `${formatGwei(gasPrice)} gwei`,
      maxFeePerGas: typeof maxFeePerGas !== 'undefined' && `${formatGwei(maxFeePerGas)} gwei`,
      maxPriorityFeePerGas: typeof maxPriorityFeePerGas !== 'undefined' && `${formatGwei(maxPriorityFeePerGas)} gwei`,
      nonce
    });
    super(cause.shortMessage, {
      cause,
      docsPath,
      metaMessages: [...(cause.metaMessages ? [...cause.metaMessages, ' '] : []), 'Estimate Gas Arguments:', prettyArgs].filter(Boolean),
      name: 'EstimateGasExecutionError'
    });
    Object.defineProperty(this, "cause", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.cause = cause;
  }
}

class ExecutionRevertedError extends BaseError {
  constructor({
    cause,
    message
  } = {}) {
    const reason = message?.replace('execution reverted: ', '')?.replace('execution reverted', '');
    super(`Execution reverted ${reason ? `with reason: ${reason}` : 'for an unknown reason'}.`, {
      cause,
      name: 'ExecutionRevertedError'
    });
  }
}
Object.defineProperty(ExecutionRevertedError, "code", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 3
});
Object.defineProperty(ExecutionRevertedError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /execution reverted/
});
class FeeCapTooHighError extends BaseError {
  constructor({
    cause,
    maxFeePerGas
  } = {}) {
    super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ''}) cannot be higher than the maximum allowed value (2^256-1).`, {
      cause,
      name: 'FeeCapTooHighError'
    });
  }
}
Object.defineProperty(FeeCapTooHighError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /max fee per gas higher than 2\^256-1|fee cap higher than 2\^256-1/
});
class FeeCapTooLowError extends BaseError {
  constructor({
    cause,
    maxFeePerGas
  } = {}) {
    super(`The fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)}` : ''} gwei) cannot be lower than the block base fee.`, {
      cause,
      name: 'FeeCapTooLowError'
    });
  }
}
Object.defineProperty(FeeCapTooLowError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /max fee per gas less than block base fee|fee cap less than block base fee|transaction is outdated/
});
class NonceTooHighError extends BaseError {
  constructor({
    cause,
    nonce
  } = {}) {
    super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ''}is higher than the next one expected.`, {
      cause,
      name: 'NonceTooHighError'
    });
  }
}
Object.defineProperty(NonceTooHighError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /nonce too high/
});
class NonceTooLowError extends BaseError {
  constructor({
    cause,
    nonce
  } = {}) {
    super([`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ''}is lower than the current nonce of the account.`, 'Try increasing the nonce or find the latest nonce with `getTransactionCount`.'].join('\n'), {
      cause,
      name: 'NonceTooLowError'
    });
  }
}
Object.defineProperty(NonceTooLowError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /nonce too low|transaction already imported|already known/
});
class NonceMaxValueError extends BaseError {
  constructor({
    cause,
    nonce
  } = {}) {
    super(`Nonce provided for the transaction ${nonce ? `(${nonce}) ` : ''}exceeds the maximum allowed nonce.`, {
      cause,
      name: 'NonceMaxValueError'
    });
  }
}
Object.defineProperty(NonceMaxValueError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /nonce has max value/
});
class InsufficientFundsError extends BaseError {
  constructor({
    cause
  } = {}) {
    super(['The total cost (gas * gas fee + value) of executing this transaction exceeds the balance of the account.'].join('\n'), {
      cause,
      metaMessages: ['This error could arise when the account does not have enough funds to:', ' - pay for the total gas fee,', ' - pay for the value to send.', ' ', 'The cost of the transaction is calculated as `gas * gas fee + value`, where:', ' - `gas` is the amount of gas needed for transaction to execute,', ' - `gas fee` is the gas fee,', ' - `value` is the amount of ether to send to the recipient.'],
      name: 'InsufficientFundsError'
    });
  }
}
Object.defineProperty(InsufficientFundsError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /insufficient funds|exceeds transaction sender account balance/
});
class IntrinsicGasTooHighError extends BaseError {
  constructor({
    cause,
    gas
  } = {}) {
    super(`The amount of gas ${gas ? `(${gas}) ` : ''}provided for the transaction exceeds the limit allowed for the block.`, {
      cause,
      name: 'IntrinsicGasTooHighError'
    });
  }
}
Object.defineProperty(IntrinsicGasTooHighError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /intrinsic gas too high|gas limit reached/
});
class IntrinsicGasTooLowError extends BaseError {
  constructor({
    cause,
    gas
  } = {}) {
    super(`The amount of gas ${gas ? `(${gas}) ` : ''}provided for the transaction is too low.`, {
      cause,
      name: 'IntrinsicGasTooLowError'
    });
  }
}
Object.defineProperty(IntrinsicGasTooLowError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /intrinsic gas too low/
});
class TransactionTypeNotSupportedError extends BaseError {
  constructor({
    cause
  }) {
    super('The transaction type is not supported for this chain.', {
      cause,
      name: 'TransactionTypeNotSupportedError'
    });
  }
}
Object.defineProperty(TransactionTypeNotSupportedError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /transaction type not valid/
});
class TipAboveFeeCapError extends BaseError {
  constructor({
    cause,
    maxPriorityFeePerGas,
    maxFeePerGas
  } = {}) {
    super([`The provided tip (\`maxPriorityFeePerGas\`${maxPriorityFeePerGas ? ` = ${formatGwei(maxPriorityFeePerGas)} gwei` : ''}) cannot be higher than the fee cap (\`maxFeePerGas\`${maxFeePerGas ? ` = ${formatGwei(maxFeePerGas)} gwei` : ''}).`].join('\n'), {
      cause,
      name: 'TipAboveFeeCapError'
    });
  }
}
Object.defineProperty(TipAboveFeeCapError, "nodeMessage", {
  enumerable: true,
  configurable: true,
  writable: true,
  value: /max priority fee per gas higher than max fee per gas|tip higher than fee cap/
});
class UnknownNodeError extends BaseError {
  constructor({
    cause
  }) {
    super(`An error occurred while executing: ${cause?.shortMessage}`, {
      cause,
      name: 'UnknownNodeError'
    });
  }
}

function getNodeError(err, args) {
  const message = (err.details || '').toLowerCase();
  const executionRevertedError = err instanceof BaseError ? err.walk(e => e?.code === ExecutionRevertedError.code) : err;
  if (executionRevertedError instanceof BaseError) return new ExecutionRevertedError({
    cause: err,
    message: executionRevertedError.details
  });
  if (ExecutionRevertedError.nodeMessage.test(message)) return new ExecutionRevertedError({
    cause: err,
    message: err.details
  });
  if (FeeCapTooHighError.nodeMessage.test(message)) return new FeeCapTooHighError({
    cause: err,
    maxFeePerGas: args?.maxFeePerGas
  });
  if (FeeCapTooLowError.nodeMessage.test(message)) return new FeeCapTooLowError({
    cause: err,
    maxFeePerGas: args?.maxFeePerGas
  });
  if (NonceTooHighError.nodeMessage.test(message)) return new NonceTooHighError({
    cause: err,
    nonce: args?.nonce
  });
  if (NonceTooLowError.nodeMessage.test(message)) return new NonceTooLowError({
    cause: err,
    nonce: args?.nonce
  });
  if (NonceMaxValueError.nodeMessage.test(message)) return new NonceMaxValueError({
    cause: err,
    nonce: args?.nonce
  });
  if (InsufficientFundsError.nodeMessage.test(message)) return new InsufficientFundsError({
    cause: err
  });
  if (IntrinsicGasTooHighError.nodeMessage.test(message)) return new IntrinsicGasTooHighError({
    cause: err,
    gas: args?.gas
  });
  if (IntrinsicGasTooLowError.nodeMessage.test(message)) return new IntrinsicGasTooLowError({
    cause: err,
    gas: args?.gas
  });
  if (TransactionTypeNotSupportedError.nodeMessage.test(message)) return new TransactionTypeNotSupportedError({
    cause: err
  });
  if (TipAboveFeeCapError.nodeMessage.test(message)) return new TipAboveFeeCapError({
    cause: err,
    maxFeePerGas: args?.maxFeePerGas,
    maxPriorityFeePerGas: args?.maxPriorityFeePerGas
  });
  return new UnknownNodeError({
    cause: err
  });
}

function getEstimateGasError(err, {
  docsPath,
  ...args
}) {
  const cause = (() => {
    const cause = getNodeError(err, args);
    if (cause instanceof UnknownNodeError) return err;
    return cause;
  })();
  return new EstimateGasExecutionError(cause, {
    docsPath,
    ...args
  });
}

/**
 * @description Picks out the keys from `value` that exist in the formatter..
 */
function extract(value_, {
  format
}) {
  if (!format) return {};
  const value = {};
  function extract_(formatted) {
    const keys = Object.keys(formatted);
    for (const key of keys) {
      if (key in value_) value[key] = value_[key];
      if (formatted[key] && typeof formatted[key] === 'object' && !Array.isArray(formatted[key])) extract_(formatted[key]);
    }
  }
  const formatted = format(value_ || {});
  extract_(formatted);
  return value;
}

const rpcTransactionType = {
  legacy: '0x0',
  eip2930: '0x1',
  eip1559: '0x2',
  eip4844: '0x3',
  eip7702: '0x4'
};
function formatTransactionRequest(request) {
  const rpcRequest = {};
  if (typeof request.authorizationList !== 'undefined') rpcRequest.authorizationList = formatAuthorizationList$1(request.authorizationList);
  if (typeof request.accessList !== 'undefined') rpcRequest.accessList = request.accessList;
  if (typeof request.blobVersionedHashes !== 'undefined') rpcRequest.blobVersionedHashes = request.blobVersionedHashes;
  if (typeof request.blobs !== 'undefined') {
    if (typeof request.blobs[0] !== 'string') rpcRequest.blobs = request.blobs.map(x => bytesToHex$1(x));else rpcRequest.blobs = request.blobs;
  }
  if (typeof request.data !== 'undefined') rpcRequest.data = request.data;
  if (typeof request.from !== 'undefined') rpcRequest.from = request.from;
  if (typeof request.gas !== 'undefined') rpcRequest.gas = numberToHex(request.gas);
  if (typeof request.gasPrice !== 'undefined') rpcRequest.gasPrice = numberToHex(request.gasPrice);
  if (typeof request.maxFeePerBlobGas !== 'undefined') rpcRequest.maxFeePerBlobGas = numberToHex(request.maxFeePerBlobGas);
  if (typeof request.maxFeePerGas !== 'undefined') rpcRequest.maxFeePerGas = numberToHex(request.maxFeePerGas);
  if (typeof request.maxPriorityFeePerGas !== 'undefined') rpcRequest.maxPriorityFeePerGas = numberToHex(request.maxPriorityFeePerGas);
  if (typeof request.nonce !== 'undefined') rpcRequest.nonce = numberToHex(request.nonce);
  if (typeof request.to !== 'undefined') rpcRequest.to = request.to;
  if (typeof request.type !== 'undefined') rpcRequest.type = rpcTransactionType[request.type];
  if (typeof request.value !== 'undefined') rpcRequest.value = numberToHex(request.value);
  return rpcRequest;
}
//////////////////////////////////////////////////////////////////////////////
function formatAuthorizationList$1(authorizationList) {
  return authorizationList.map(authorization => ({
    address: authorization.contractAddress,
    r: authorization.r,
    s: authorization.s,
    chainId: numberToHex(authorization.chainId),
    nonce: numberToHex(authorization.nonce),
    ...(typeof authorization.yParity !== 'undefined' ? {
      yParity: numberToHex(authorization.yParity)
    } : {}),
    ...(typeof authorization.v !== 'undefined' && typeof authorization.yParity === 'undefined' ? {
      v: numberToHex(authorization.v)
    } : {})
  }));
}

/** @internal */
function serializeStateMapping(stateMapping) {
  if (!stateMapping || stateMapping.length === 0) return undefined;
  return stateMapping.reduce((acc, {
    slot,
    value
  }) => {
    if (slot.length !== 66) throw new InvalidBytesLengthError({
      size: slot.length,
      targetSize: 66,
      type: 'hex'
    });
    if (value.length !== 66) throw new InvalidBytesLengthError({
      size: value.length,
      targetSize: 66,
      type: 'hex'
    });
    acc[slot] = value;
    return acc;
  }, {});
}
/** @internal */
function serializeAccountStateOverride(parameters) {
  const {
    balance,
    nonce,
    state,
    stateDiff,
    code
  } = parameters;
  const rpcAccountStateOverride = {};
  if (code !== undefined) rpcAccountStateOverride.code = code;
  if (balance !== undefined) rpcAccountStateOverride.balance = numberToHex(balance);
  if (nonce !== undefined) rpcAccountStateOverride.nonce = numberToHex(nonce);
  if (state !== undefined) rpcAccountStateOverride.state = serializeStateMapping(state);
  if (stateDiff !== undefined) {
    if (rpcAccountStateOverride.state) throw new StateAssignmentConflictError();
    rpcAccountStateOverride.stateDiff = serializeStateMapping(stateDiff);
  }
  return rpcAccountStateOverride;
}
/** @internal */
function serializeStateOverride(parameters) {
  if (!parameters) return undefined;
  const rpcStateOverride = {};
  for (const {
    address,
    ...accountState
  } of parameters) {
    if (!isAddress(address, {
      strict: false
    })) throw new InvalidAddressError({
      address
    });
    if (rpcStateOverride[address]) throw new AccountStateConflictError({
      address: address
    });
    rpcStateOverride[address] = serializeAccountStateOverride(accountState);
  }
  return rpcStateOverride;
}

const maxUint256 = 2n ** 256n - 1n;

function assertRequest(args) {
  const {
    account: account_,
    gasPrice,
    maxFeePerGas,
    maxPriorityFeePerGas,
    to
  } = args;
  const account = account_ ? parseAccount(account_) : undefined;
  if (account && !isAddress(account.address)) throw new InvalidAddressError({
    address: account.address
  });
  if (to && !isAddress(to)) throw new InvalidAddressError({
    address: to
  });
  if (typeof gasPrice !== 'undefined' && (typeof maxFeePerGas !== 'undefined' || typeof maxPriorityFeePerGas !== 'undefined')) throw new FeeConflictError();
  if (maxFeePerGas && maxFeePerGas > maxUint256) throw new FeeCapTooHighError({
    maxFeePerGas
  });
  if (maxPriorityFeePerGas && maxFeePerGas && maxPriorityFeePerGas > maxFeePerGas) throw new TipAboveFeeCapError({
    maxFeePerGas,
    maxPriorityFeePerGas
  });
}

class BaseFeeScalarError extends BaseError {
  constructor() {
    super('`baseFeeMultiplier` must be greater than 1.', {
      name: 'BaseFeeScalarError'
    });
  }
}
class Eip1559FeesNotSupportedError extends BaseError {
  constructor() {
    super('Chain does not support EIP-1559 fees.', {
      name: 'Eip1559FeesNotSupportedError'
    });
  }
}
class MaxFeePerGasTooLowError extends BaseError {
  constructor({
    maxPriorityFeePerGas
  }) {
    super(`\`maxFeePerGas\` cannot be less than the \`maxPriorityFeePerGas\` (${formatGwei(maxPriorityFeePerGas)} gwei).`, {
      name: 'MaxFeePerGasTooLowError'
    });
  }
}

class BlockNotFoundError extends BaseError {
  constructor({
    blockHash,
    blockNumber
  }) {
    let identifier = 'Block';
    if (blockHash) identifier = `Block at hash "${blockHash}"`;
    if (blockNumber) identifier = `Block at number "${blockNumber}"`;
    super(`${identifier} could not be found.`, {
      name: 'BlockNotFoundError'
    });
  }
}

const transactionType = {
  '0x0': 'legacy',
  '0x1': 'eip2930',
  '0x2': 'eip1559',
  '0x3': 'eip4844',
  '0x4': 'eip7702'
};
function formatTransaction(transaction) {
  const transaction_ = {
    ...transaction,
    blockHash: transaction.blockHash ? transaction.blockHash : null,
    blockNumber: transaction.blockNumber ? BigInt(transaction.blockNumber) : null,
    chainId: transaction.chainId ? hexToNumber$1(transaction.chainId) : undefined,
    gas: transaction.gas ? BigInt(transaction.gas) : undefined,
    gasPrice: transaction.gasPrice ? BigInt(transaction.gasPrice) : undefined,
    maxFeePerBlobGas: transaction.maxFeePerBlobGas ? BigInt(transaction.maxFeePerBlobGas) : undefined,
    maxFeePerGas: transaction.maxFeePerGas ? BigInt(transaction.maxFeePerGas) : undefined,
    maxPriorityFeePerGas: transaction.maxPriorityFeePerGas ? BigInt(transaction.maxPriorityFeePerGas) : undefined,
    nonce: transaction.nonce ? hexToNumber$1(transaction.nonce) : undefined,
    to: transaction.to ? transaction.to : null,
    transactionIndex: transaction.transactionIndex ? Number(transaction.transactionIndex) : null,
    type: transaction.type ? transactionType[transaction.type] : undefined,
    typeHex: transaction.type ? transaction.type : undefined,
    value: transaction.value ? BigInt(transaction.value) : undefined,
    v: transaction.v ? BigInt(transaction.v) : undefined
  };
  if (transaction.authorizationList) transaction_.authorizationList = formatAuthorizationList(transaction.authorizationList);
  transaction_.yParity = (() => {
    // If `yParity` is provided, we will use it.
    if (transaction.yParity) return Number(transaction.yParity);
    // If no `yParity` provided, try derive from `v`.
    if (typeof transaction_.v === 'bigint') {
      if (transaction_.v === 0n || transaction_.v === 27n) return 0;
      if (transaction_.v === 1n || transaction_.v === 28n) return 1;
      if (transaction_.v >= 35n) return transaction_.v % 2n === 0n ? 1 : 0;
    }
    return undefined;
  })();
  if (transaction_.type === 'legacy') {
    delete transaction_.accessList;
    delete transaction_.maxFeePerBlobGas;
    delete transaction_.maxFeePerGas;
    delete transaction_.maxPriorityFeePerGas;
    delete transaction_.yParity;
  }
  if (transaction_.type === 'eip2930') {
    delete transaction_.maxFeePerBlobGas;
    delete transaction_.maxFeePerGas;
    delete transaction_.maxPriorityFeePerGas;
  }
  if (transaction_.type === 'eip1559') {
    delete transaction_.maxFeePerBlobGas;
  }
  return transaction_;
}
//////////////////////////////////////////////////////////////////////////////
function formatAuthorizationList(authorizationList) {
  return authorizationList.map(authorization => ({
    contractAddress: authorization.address,
    chainId: Number(authorization.chainId),
    nonce: Number(authorization.nonce),
    r: authorization.r,
    s: authorization.s,
    yParity: Number(authorization.yParity)
  }));
}

function formatBlock(block) {
  const transactions = block.transactions?.map(transaction => {
    if (typeof transaction === 'string') return transaction;
    return formatTransaction(transaction);
  });
  return {
    ...block,
    baseFeePerGas: block.baseFeePerGas ? BigInt(block.baseFeePerGas) : null,
    blobGasUsed: block.blobGasUsed ? BigInt(block.blobGasUsed) : undefined,
    difficulty: block.difficulty ? BigInt(block.difficulty) : undefined,
    excessBlobGas: block.excessBlobGas ? BigInt(block.excessBlobGas) : undefined,
    gasLimit: block.gasLimit ? BigInt(block.gasLimit) : undefined,
    gasUsed: block.gasUsed ? BigInt(block.gasUsed) : undefined,
    hash: block.hash ? block.hash : null,
    logsBloom: block.logsBloom ? block.logsBloom : null,
    nonce: block.nonce ? block.nonce : null,
    number: block.number ? BigInt(block.number) : null,
    size: block.size ? BigInt(block.size) : undefined,
    timestamp: block.timestamp ? BigInt(block.timestamp) : undefined,
    transactions,
    totalDifficulty: block.totalDifficulty ? BigInt(block.totalDifficulty) : null
  };
}

/**
 * Returns information about a block at a block number, hash, or tag.
 *
 * - Docs: https://viem.sh/docs/actions/public/getBlock
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/blocks/fetching-blocks
 * - JSON-RPC Methods:
 *   - Calls [`eth_getBlockByNumber`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbynumber) for `blockNumber` & `blockTag`.
 *   - Calls [`eth_getBlockByHash`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getblockbyhash) for `blockHash`.
 *
 * @param client - Client to use
 * @param parameters - {@link GetBlockParameters}
 * @returns Information about the block. {@link GetBlockReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getBlock } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const block = await getBlock(client)
 */
async function getBlock(client, {
  blockHash,
  blockNumber,
  blockTag: blockTag_,
  includeTransactions: includeTransactions_
} = {}) {
  const blockTag = blockTag_ ?? 'latest';
  const includeTransactions = includeTransactions_ ?? false;
  const blockNumberHex = blockNumber !== undefined ? numberToHex(blockNumber) : undefined;
  let block = null;
  if (blockHash) {
    block = await client.request({
      method: 'eth_getBlockByHash',
      params: [blockHash, includeTransactions]
    }, {
      dedupe: true
    });
  } else {
    block = await client.request({
      method: 'eth_getBlockByNumber',
      params: [blockNumberHex || blockTag, includeTransactions]
    }, {
      dedupe: Boolean(blockNumberHex)
    });
  }
  if (!block) throw new BlockNotFoundError({
    blockHash,
    blockNumber
  });
  const format = client.chain?.formatters?.block?.format || formatBlock;
  return format(block);
}

/**
 * Returns the current price of gas (in wei).
 *
 * - Docs: https://viem.sh/docs/actions/public/getGasPrice
 * - JSON-RPC Methods: [`eth_gasPrice`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gasprice)
 *
 * @param client - Client to use
 * @returns The gas price (in wei). {@link GetGasPriceReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getGasPrice } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const gasPrice = await getGasPrice(client)
 */
async function getGasPrice(client) {
  const gasPrice = await client.request({
    method: 'eth_gasPrice'
  });
  return BigInt(gasPrice);
}

async function internal_estimateMaxPriorityFeePerGas(client, args) {
  const {
    block: block_,
    chain = client.chain,
    request
  } = args || {};
  try {
    const maxPriorityFeePerGas = chain?.fees?.maxPriorityFeePerGas ?? chain?.fees?.defaultPriorityFee;
    if (typeof maxPriorityFeePerGas === 'function') {
      const block = block_ || (await getAction(client, getBlock, 'getBlock')({}));
      const maxPriorityFeePerGas_ = await maxPriorityFeePerGas({
        block,
        client,
        request
      });
      if (maxPriorityFeePerGas_ === null) throw new Error();
      return maxPriorityFeePerGas_;
    }
    if (typeof maxPriorityFeePerGas !== 'undefined') return maxPriorityFeePerGas;
    const maxPriorityFeePerGasHex = await client.request({
      method: 'eth_maxPriorityFeePerGas'
    });
    return hexToBigInt(maxPriorityFeePerGasHex);
  } catch {
    // If the RPC Provider does not support `eth_maxPriorityFeePerGas`
    // fall back to calculating it manually via `gasPrice - baseFeePerGas`.
    // See: https://github.com/ethereum/pm/issues/328#:~:text=eth_maxPriorityFeePerGas%20after%20London%20will%20effectively%20return%20eth_gasPrice%20%2D%20baseFee
    const [block, gasPrice] = await Promise.all([block_ ? Promise.resolve(block_) : getAction(client, getBlock, 'getBlock')({}), getAction(client, getGasPrice, 'getGasPrice')({})]);
    if (typeof block.baseFeePerGas !== 'bigint') throw new Eip1559FeesNotSupportedError();
    const maxPriorityFeePerGas = gasPrice - block.baseFeePerGas;
    if (maxPriorityFeePerGas < 0n) return 0n;
    return maxPriorityFeePerGas;
  }
}

async function internal_estimateFeesPerGas(client, args) {
  const {
    block: block_,
    chain = client.chain,
    request,
    type = 'eip1559'
  } = args || {};
  const baseFeeMultiplier = await (async () => {
    if (typeof chain?.fees?.baseFeeMultiplier === 'function') return chain.fees.baseFeeMultiplier({
      block: block_,
      client,
      request
    });
    return chain?.fees?.baseFeeMultiplier ?? 1.2;
  })();
  if (baseFeeMultiplier < 1) throw new BaseFeeScalarError();
  const decimals = baseFeeMultiplier.toString().split('.')[1]?.length ?? 0;
  const denominator = 10 ** decimals;
  const multiply = base => base * BigInt(Math.ceil(baseFeeMultiplier * denominator)) / BigInt(denominator);
  const block = block_ ? block_ : await getAction(client, getBlock, 'getBlock')({});
  if (typeof chain?.fees?.estimateFeesPerGas === 'function') {
    const fees = await chain.fees.estimateFeesPerGas({
      block: block_,
      client,
      multiply,
      request,
      type
    });
    if (fees !== null) return fees;
  }
  if (type === 'eip1559') {
    if (typeof block.baseFeePerGas !== 'bigint') throw new Eip1559FeesNotSupportedError();
    const maxPriorityFeePerGas = typeof request?.maxPriorityFeePerGas === 'bigint' ? request.maxPriorityFeePerGas : await internal_estimateMaxPriorityFeePerGas(client, {
      block: block,
      chain,
      request
    });
    const baseFeePerGas = multiply(block.baseFeePerGas);
    const maxFeePerGas = request?.maxFeePerGas ?? baseFeePerGas + maxPriorityFeePerGas;
    return {
      maxFeePerGas,
      maxPriorityFeePerGas
    };
  }
  const gasPrice = request?.gasPrice ?? multiply(await getAction(client, getGasPrice, 'getGasPrice')({}));
  return {
    gasPrice
  };
}

/**
 * Returns the number of [Transactions](https://viem.sh/docs/glossary/terms#transaction) an Account has sent.
 *
 * - Docs: https://viem.sh/docs/actions/public/getTransactionCount
 * - JSON-RPC Methods: [`eth_getTransactionCount`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_gettransactioncount)
 *
 * @param client - Client to use
 * @param parameters - {@link GetTransactionCountParameters}
 * @returns The number of transactions an account has sent. {@link GetTransactionCountReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getTransactionCount } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const transactionCount = await getTransactionCount(client, {
 *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 * })
 */
async function getTransactionCount(client, {
  address,
  blockTag = 'latest',
  blockNumber
}) {
  const count = await client.request({
    method: 'eth_getTransactionCount',
    params: [address, blockNumber ? numberToHex(blockNumber) : blockTag]
  }, {
    dedupe: Boolean(blockNumber)
  });
  return hexToNumber$1(count);
}

/**
 * Compute commitments from a list of blobs.
 *
 * @example
 * ```ts
 * import { blobsToCommitments, toBlobs } from 'viem'
 * import { kzg } from './kzg'
 *
 * const blobs = toBlobs({ data: '0x1234' })
 * const commitments = blobsToCommitments({ blobs, kzg })
 * ```
 */
function blobsToCommitments(parameters) {
  const {
    kzg
  } = parameters;
  const to = parameters.to ?? (typeof parameters.blobs[0] === 'string' ? 'hex' : 'bytes');
  const blobs = typeof parameters.blobs[0] === 'string' ? parameters.blobs.map(x => hexToBytes$1(x)) : parameters.blobs;
  const commitments = [];
  for (const blob of blobs) commitments.push(Uint8Array.from(kzg.blobToKzgCommitment(blob)));
  return to === 'bytes' ? commitments : commitments.map(x => bytesToHex$1(x));
}

/**
 * Compute the proofs for a list of blobs and their commitments.
 *
 * @example
 * ```ts
 * import {
 *   blobsToCommitments,
 *   toBlobs
 * } from 'viem'
 * import { kzg } from './kzg'
 *
 * const blobs = toBlobs({ data: '0x1234' })
 * const commitments = blobsToCommitments({ blobs, kzg })
 * const proofs = blobsToProofs({ blobs, commitments, kzg })
 * ```
 */
function blobsToProofs(parameters) {
  const {
    kzg
  } = parameters;
  const to = parameters.to ?? (typeof parameters.blobs[0] === 'string' ? 'hex' : 'bytes');
  const blobs = typeof parameters.blobs[0] === 'string' ? parameters.blobs.map(x => hexToBytes$1(x)) : parameters.blobs;
  const commitments = typeof parameters.commitments[0] === 'string' ? parameters.commitments.map(x => hexToBytes$1(x)) : parameters.commitments;
  const proofs = [];
  for (let i = 0; i < blobs.length; i++) {
    const blob = blobs[i];
    const commitment = commitments[i];
    proofs.push(Uint8Array.from(kzg.computeBlobKzgProof(blob, commitment)));
  }
  return to === 'bytes' ? proofs : proofs.map(x => bytesToHex$1(x));
}

/**
 * Polyfill for Safari 14
 */
function setBigUint64(view, byteOffset, value, isLE) {
  if (typeof view.setBigUint64 === 'function') return view.setBigUint64(byteOffset, value, isLE);
  const _32n = BigInt(32);
  const _u32_max = BigInt(0xffffffff);
  const wh = Number(value >> _32n & _u32_max);
  const wl = Number(value & _u32_max);
  const h = isLE ? 4 : 0;
  const l = isLE ? 0 : 4;
  view.setUint32(byteOffset + h, wh, isLE);
  view.setUint32(byteOffset + l, wl, isLE);
}
/**
 * Choice: a ? b : c
 */
const Chi = (a, b, c) => a & b ^ ~a & c;
/**
 * Majority function, true if any two inputs is true
 */
const Maj = (a, b, c) => a & b ^ a & c ^ b & c;
/**
 * Merkle-Damgard hash construction base class.
 * Could be used to create MD5, RIPEMD, SHA1, SHA2.
 */
class HashMD extends Hash {
  constructor(blockLen, outputLen, padOffset, isLE) {
    super();
    this.blockLen = blockLen;
    this.outputLen = outputLen;
    this.padOffset = padOffset;
    this.isLE = isLE;
    this.finished = false;
    this.length = 0;
    this.pos = 0;
    this.destroyed = false;
    this.buffer = new Uint8Array(blockLen);
    this.view = createView(this.buffer);
  }
  update(data) {
    exists(this);
    const {
      view,
      buffer,
      blockLen
    } = this;
    data = toBytes(data);
    const len = data.length;
    for (let pos = 0; pos < len;) {
      const take = Math.min(blockLen - this.pos, len - pos);
      // Fast path: we have at least one block in input, cast it to view and process
      if (take === blockLen) {
        const dataView = createView(data);
        for (; blockLen <= len - pos; pos += blockLen) this.process(dataView, pos);
        continue;
      }
      buffer.set(data.subarray(pos, pos + take), this.pos);
      this.pos += take;
      pos += take;
      if (this.pos === blockLen) {
        this.process(view, 0);
        this.pos = 0;
      }
    }
    this.length += data.length;
    this.roundClean();
    return this;
  }
  digestInto(out) {
    exists(this);
    output(out, this);
    this.finished = true;
    // Padding
    // We can avoid allocation of buffer for padding completely if it
    // was previously not allocated here. But it won't change performance.
    const {
      buffer,
      view,
      blockLen,
      isLE
    } = this;
    let {
      pos
    } = this;
    // append the bit '1' to the message
    buffer[pos++] = 0b10000000;
    this.buffer.subarray(pos).fill(0);
    // we have less than padOffset left in buffer, so we cannot put length in
    // current block, need process it and pad again
    if (this.padOffset > blockLen - pos) {
      this.process(view, 0);
      pos = 0;
    }
    // Pad until full block byte with zeros
    for (let i = pos; i < blockLen; i++) buffer[i] = 0;
    // Note: sha512 requires length to be 128bit integer, but length in JS will overflow before that
    // You need to write around 2 exabytes (u64_max / 8 / (1024**6)) for this to happen.
    // So we just write lowest 64 bits of that value.
    setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
    this.process(view, 0);
    const oview = createView(out);
    const len = this.outputLen;
    // NOTE: we do division by 4 later, which should be fused in single op with modulo by JIT
    if (len % 4) throw new Error('_sha2: outputLen should be aligned to 32bit');
    const outLen = len / 4;
    const state = this.get();
    if (outLen > state.length) throw new Error('_sha2: outputLen bigger than state');
    for (let i = 0; i < outLen; i++) oview.setUint32(4 * i, state[i], isLE);
  }
  digest() {
    const {
      buffer,
      outputLen
    } = this;
    this.digestInto(buffer);
    const res = buffer.slice(0, outputLen);
    this.destroy();
    return res;
  }
  _cloneInto(to) {
    to || (to = new this.constructor());
    to.set(...this.get());
    const {
      blockLen,
      buffer,
      length,
      finished,
      destroyed,
      pos
    } = this;
    to.length = length;
    to.pos = pos;
    to.finished = finished;
    to.destroyed = destroyed;
    if (length % blockLen) to.buffer.set(buffer);
    return to;
  }
}

// SHA2-256 need to try 2^128 hashes to execute birthday attack.
// BTC network is doing 2^67 hashes/sec as per early 2023.
// Round constants:
// first 32 bits of the fractional parts of the cube roots of the first 64 primes 2..311)
// prettier-ignore
const SHA256_K = /* @__PURE__ */new Uint32Array([0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2]);
// Initial state:
// first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19
// prettier-ignore
const SHA256_IV = /* @__PURE__ */new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
// Temporary buffer, not used to store anything between runs
// Named this way because it matches specification.
const SHA256_W = /* @__PURE__ */new Uint32Array(64);
class SHA256 extends HashMD {
  constructor() {
    super(64, 32, 8, false);
    // We cannot use array here since array allows indexing by variable
    // which means optimizer/compiler cannot use registers.
    this.A = SHA256_IV[0] | 0;
    this.B = SHA256_IV[1] | 0;
    this.C = SHA256_IV[2] | 0;
    this.D = SHA256_IV[3] | 0;
    this.E = SHA256_IV[4] | 0;
    this.F = SHA256_IV[5] | 0;
    this.G = SHA256_IV[6] | 0;
    this.H = SHA256_IV[7] | 0;
  }
  get() {
    const {
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H
    } = this;
    return [A, B, C, D, E, F, G, H];
  }
  // prettier-ignore
  set(A, B, C, D, E, F, G, H) {
    this.A = A | 0;
    this.B = B | 0;
    this.C = C | 0;
    this.D = D | 0;
    this.E = E | 0;
    this.F = F | 0;
    this.G = G | 0;
    this.H = H | 0;
  }
  process(view, offset) {
    // Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array
    for (let i = 0; i < 16; i++, offset += 4) SHA256_W[i] = view.getUint32(offset, false);
    for (let i = 16; i < 64; i++) {
      const W15 = SHA256_W[i - 15];
      const W2 = SHA256_W[i - 2];
      const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
      const s1 = rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10;
      SHA256_W[i] = s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
    }
    // Compression function main loop, 64 rounds
    let {
      A,
      B,
      C,
      D,
      E,
      F,
      G,
      H
    } = this;
    for (let i = 0; i < 64; i++) {
      const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
      const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
      const sigma0 = rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22);
      const T2 = sigma0 + Maj(A, B, C) | 0;
      H = G;
      G = F;
      F = E;
      E = D + T1 | 0;
      D = C;
      C = B;
      B = A;
      A = T1 + T2 | 0;
    }
    // Add the compressed chunk to the current hash value
    A = A + this.A | 0;
    B = B + this.B | 0;
    C = C + this.C | 0;
    D = D + this.D | 0;
    E = E + this.E | 0;
    F = F + this.F | 0;
    G = G + this.G | 0;
    H = H + this.H | 0;
    this.set(A, B, C, D, E, F, G, H);
  }
  roundClean() {
    SHA256_W.fill(0);
  }
  destroy() {
    this.set(0, 0, 0, 0, 0, 0, 0, 0);
    this.buffer.fill(0);
  }
}
/**
 * SHA2-256 hash function
 * @param message - data that would be hashed
 */
const sha256$1 = /* @__PURE__ */wrapConstructor(() => new SHA256());

function sha256(value, to_) {
  const bytes = sha256$1(isHex(value, {
    strict: false
  }) ? toBytes$1(value) : value);
  return bytes;
}

/**
 * Transform a commitment to it's versioned hash.
 *
 * @example
 * ```ts
 * import {
 *   blobsToCommitments,
 *   commitmentToVersionedHash,
 *   toBlobs
 * } from 'viem'
 * import { kzg } from './kzg'
 *
 * const blobs = toBlobs({ data: '0x1234' })
 * const [commitment] = blobsToCommitments({ blobs, kzg })
 * const versionedHash = commitmentToVersionedHash({ commitment })
 * ```
 */
function commitmentToVersionedHash(parameters) {
  const {
    commitment,
    version = 1
  } = parameters;
  const to = parameters.to ?? (typeof commitment === 'string' ? 'hex' : 'bytes');
  const versionedHash = sha256(commitment);
  versionedHash.set([version], 0);
  return to === 'bytes' ? versionedHash : bytesToHex$1(versionedHash);
}

/**
 * Transform a list of commitments to their versioned hashes.
 *
 * @example
 * ```ts
 * import {
 *   blobsToCommitments,
 *   commitmentsToVersionedHashes,
 *   toBlobs
 * } from 'viem'
 * import { kzg } from './kzg'
 *
 * const blobs = toBlobs({ data: '0x1234' })
 * const commitments = blobsToCommitments({ blobs, kzg })
 * const versionedHashes = commitmentsToVersionedHashes({ commitments })
 * ```
 */
function commitmentsToVersionedHashes(parameters) {
  const {
    commitments,
    version
  } = parameters;
  const to = parameters.to ?? (typeof commitments[0] === 'string' ? 'hex' : 'bytes');
  const hashes = [];
  for (const commitment of commitments) {
    hashes.push(commitmentToVersionedHash({
      commitment,
      to,
      version
    }));
  }
  return hashes;
}

// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-4844.md#parameters
/** Blob limit per transaction. */
const blobsPerTransaction = 6;
/** The number of bytes in a BLS scalar field element. */
const bytesPerFieldElement = 32;
/** The number of field elements in a blob. */
const fieldElementsPerBlob = 4096;
/** The number of bytes in a blob. */
const bytesPerBlob = bytesPerFieldElement * fieldElementsPerBlob;
/** Blob bytes limit per transaction. */
const maxBytesPerTransaction = bytesPerBlob * blobsPerTransaction -
// terminator byte (0x80).
1 -
// zero byte (0x00) appended to each field element.
1 * fieldElementsPerBlob * blobsPerTransaction;

class BlobSizeTooLargeError extends BaseError {
  constructor({
    maxSize,
    size
  }) {
    super('Blob size is too large.', {
      metaMessages: [`Max: ${maxSize} bytes`, `Given: ${size} bytes`],
      name: 'BlobSizeTooLargeError'
    });
  }
}
class EmptyBlobError extends BaseError {
  constructor() {
    super('Blob data must not be empty.', {
      name: 'EmptyBlobError'
    });
  }
}

/**
 * Transforms arbitrary data to blobs.
 *
 * @example
 * ```ts
 * import { toBlobs, stringToHex } from 'viem'
 *
 * const blobs = toBlobs({ data: stringToHex('hello world') })
 * ```
 */
function toBlobs(parameters) {
  const to = parameters.to ?? (typeof parameters.data === 'string' ? 'hex' : 'bytes');
  const data = typeof parameters.data === 'string' ? hexToBytes$1(parameters.data) : parameters.data;
  const size_ = size$1(data);
  if (!size_) throw new EmptyBlobError();
  if (size_ > maxBytesPerTransaction) throw new BlobSizeTooLargeError({
    maxSize: maxBytesPerTransaction,
    size: size_
  });
  const blobs = [];
  let active = true;
  let position = 0;
  while (active) {
    const blob = createCursor(new Uint8Array(bytesPerBlob));
    let size = 0;
    while (size < fieldElementsPerBlob) {
      const bytes = data.slice(position, position + (bytesPerFieldElement - 1));
      // Push a zero byte so the field element doesn't overflow the BLS modulus.
      blob.pushByte(0x00);
      // Push the current segment of data bytes.
      blob.pushBytes(bytes);
      // If we detect that the current segment of data bytes is less than 31 bytes,
      // we can stop processing and push a terminator byte to indicate the end of the blob.
      if (bytes.length < 31) {
        blob.pushByte(0x80);
        active = false;
        break;
      }
      size++;
      position += 31;
    }
    blobs.push(blob);
  }
  return to === 'bytes' ? blobs.map(x => x.bytes) : blobs.map(x => bytesToHex$1(x.bytes));
}

/**
 * Transforms arbitrary data (or blobs, commitments, & proofs) into a sidecar array.
 *
 * @example
 * ```ts
 * import { toBlobSidecars, stringToHex } from 'viem'
 *
 * const sidecars = toBlobSidecars({ data: stringToHex('hello world') })
 * ```
 *
 * @example
 * ```ts
 * import {
 *   blobsToCommitments,
 *   toBlobs,
 *   blobsToProofs,
 *   toBlobSidecars,
 *   stringToHex
 * } from 'viem'
 *
 * const blobs = toBlobs({ data: stringToHex('hello world') })
 * const commitments = blobsToCommitments({ blobs, kzg })
 * const proofs = blobsToProofs({ blobs, commitments, kzg })
 *
 * const sidecars = toBlobSidecars({ blobs, commitments, proofs })
 * ```
 */
function toBlobSidecars(parameters) {
  const {
    data,
    kzg,
    to
  } = parameters;
  const blobs = parameters.blobs ?? toBlobs({
    data: data,
    to
  });
  const commitments = parameters.commitments ?? blobsToCommitments({
    blobs,
    kzg: kzg,
    to
  });
  const proofs = parameters.proofs ?? blobsToProofs({
    blobs,
    commitments,
    kzg: kzg,
    to
  });
  const sidecars = [];
  for (let i = 0; i < blobs.length; i++) sidecars.push({
    blob: blobs[i],
    commitment: commitments[i],
    proof: proofs[i]
  });
  return sidecars;
}

function getTransactionType(transaction) {
  if (transaction.type) return transaction.type;
  if (typeof transaction.authorizationList !== 'undefined') return 'eip7702';
  if (typeof transaction.blobs !== 'undefined' || typeof transaction.blobVersionedHashes !== 'undefined' || typeof transaction.maxFeePerBlobGas !== 'undefined' || typeof transaction.sidecars !== 'undefined') return 'eip4844';
  if (typeof transaction.maxFeePerGas !== 'undefined' || typeof transaction.maxPriorityFeePerGas !== 'undefined') {
    return 'eip1559';
  }
  if (typeof transaction.gasPrice !== 'undefined') {
    if (typeof transaction.accessList !== 'undefined') return 'eip2930';
    return 'legacy';
  }
  throw new InvalidSerializableTransactionError({
    transaction
  });
}

/**
 * Returns the chain ID associated with the current network.
 *
 * - Docs: https://viem.sh/docs/actions/public/getChainId
 * - JSON-RPC Methods: [`eth_chainId`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_chainid)
 *
 * @param client - Client to use
 * @returns The current chain ID. {@link GetChainIdReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getChainId } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const chainId = await getChainId(client)
 * // 1
 */
async function getChainId(client) {
  const chainIdHex = await client.request({
    method: 'eth_chainId'
  }, {
    dedupe: true
  });
  return hexToNumber$1(chainIdHex);
}

const defaultParameters = ['blobVersionedHashes', 'chainId', 'fees', 'gas', 'nonce', 'type'];
/**
 * Prepares a transaction request for signing.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/prepareTransactionRequest
 *
 * @param args - {@link PrepareTransactionRequestParameters}
 * @returns The transaction request. {@link PrepareTransactionRequestReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { prepareTransactionRequest } from 'viem/actions'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const request = await prepareTransactionRequest(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   to: '0x0000000000000000000000000000000000000000',
 *   value: 1n,
 * })
 *
 * @example
 * // Account Hoisting
 * import { createWalletClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { prepareTransactionRequest } from 'viem/actions'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const request = await prepareTransactionRequest(client, {
 *   to: '0x0000000000000000000000000000000000000000',
 *   value: 1n,
 * })
 */
async function prepareTransactionRequest(client, args) {
  const {
    account: account_ = client.account,
    blobs,
    chain,
    gas,
    kzg,
    nonce,
    nonceManager,
    parameters = defaultParameters,
    type
  } = args;
  const account = account_ ? parseAccount(account_) : account_;
  const request = {
    ...args,
    ...(account ? {
      from: account?.address
    } : {})
  };
  let block;
  async function getBlock$1() {
    if (block) return block;
    block = await getAction(client, getBlock, 'getBlock')({
      blockTag: 'latest'
    });
    return block;
  }
  let chainId;
  async function getChainId$1() {
    if (chainId) return chainId;
    if (chain) return chain.id;
    if (typeof args.chainId !== 'undefined') return args.chainId;
    const chainId_ = await getAction(client, getChainId, 'getChainId')({});
    chainId = chainId_;
    return chainId;
  }
  if ((parameters.includes('blobVersionedHashes') || parameters.includes('sidecars')) && blobs && kzg) {
    const commitments = blobsToCommitments({
      blobs,
      kzg
    });
    if (parameters.includes('blobVersionedHashes')) {
      const versionedHashes = commitmentsToVersionedHashes({
        commitments,
        to: 'hex'
      });
      request.blobVersionedHashes = versionedHashes;
    }
    if (parameters.includes('sidecars')) {
      const proofs = blobsToProofs({
        blobs,
        commitments,
        kzg
      });
      const sidecars = toBlobSidecars({
        blobs,
        commitments,
        proofs,
        to: 'hex'
      });
      request.sidecars = sidecars;
    }
  }
  if (parameters.includes('chainId')) request.chainId = await getChainId$1();
  if (parameters.includes('nonce') && typeof nonce === 'undefined' && account) {
    if (nonceManager) {
      const chainId = await getChainId$1();
      request.nonce = await nonceManager.consume({
        address: account.address,
        chainId,
        client
      });
    } else {
      request.nonce = await getAction(client, getTransactionCount, 'getTransactionCount')({
        address: account.address,
        blockTag: 'pending'
      });
    }
  }
  if ((parameters.includes('fees') || parameters.includes('type')) && typeof type === 'undefined') {
    try {
      request.type = getTransactionType(request);
    } catch {
      // infer type from block
      const block = await getBlock$1();
      request.type = typeof block?.baseFeePerGas === 'bigint' ? 'eip1559' : 'legacy';
    }
  }
  if (parameters.includes('fees')) {
    // TODO(4844): derive blob base fees once https://github.com/ethereum/execution-apis/pull/486 is merged.
    if (request.type !== 'legacy' && request.type !== 'eip2930') {
      // EIP-1559 fees
      if (typeof request.maxFeePerGas === 'undefined' || typeof request.maxPriorityFeePerGas === 'undefined') {
        const block = await getBlock$1();
        const {
          maxFeePerGas,
          maxPriorityFeePerGas
        } = await internal_estimateFeesPerGas(client, {
          block: block,
          chain,
          request: request
        });
        if (typeof args.maxPriorityFeePerGas === 'undefined' && args.maxFeePerGas && args.maxFeePerGas < maxPriorityFeePerGas) throw new MaxFeePerGasTooLowError({
          maxPriorityFeePerGas
        });
        request.maxPriorityFeePerGas = maxPriorityFeePerGas;
        request.maxFeePerGas = maxFeePerGas;
      }
    } else {
      // Legacy fees
      if (typeof args.maxFeePerGas !== 'undefined' || typeof args.maxPriorityFeePerGas !== 'undefined') throw new Eip1559FeesNotSupportedError();
      const block = await getBlock$1();
      const {
        gasPrice: gasPrice_
      } = await internal_estimateFeesPerGas(client, {
        block: block,
        chain,
        request: request,
        type: 'legacy'
      });
      request.gasPrice = gasPrice_;
    }
  }
  if (parameters.includes('gas') && typeof gas === 'undefined') request.gas = await getAction(client, estimateGas, 'estimateGas')({
    ...request,
    account: account ? {
      address: account.address,
      type: 'json-rpc'
    } : account
  });
  assertRequest(request);
  delete request.parameters;
  return request;
}

/**
 * Returns the balance of an address in wei.
 *
 * - Docs: https://viem.sh/docs/actions/public/getBalance
 * - JSON-RPC Methods: [`eth_getBalance`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_getbalance)
 *
 * You can convert the balance to ether units with [`formatEther`](https://viem.sh/docs/utilities/formatEther).
 *
 * ```ts
 * const balance = await getBalance(client, {
 *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   blockTag: 'safe'
 * })
 * const balanceAsEther = formatEther(balance)
 * // "6.942"
 * ```
 *
 * @param client - Client to use
 * @param parameters - {@link GetBalanceParameters}
 * @returns The balance of the address in wei. {@link GetBalanceReturnType}
 *
 * @example
 * import { createPublicClient, http } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getBalance } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const balance = await getBalance(client, {
 *   address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 * })
 * // 10000000000000000000000n (wei)
 */
async function getBalance(client, {
  address,
  blockNumber,
  blockTag = 'latest'
}) {
  const blockNumberHex = blockNumber ? numberToHex(blockNumber) : undefined;
  const balance = await client.request({
    method: 'eth_getBalance',
    params: [address, blockNumberHex || blockTag]
  });
  return BigInt(balance);
}

/**
 * Estimates the gas necessary to complete a transaction without submitting it to the network.
 *
 * - Docs: https://viem.sh/docs/actions/public/estimateGas
 * - JSON-RPC Methods: [`eth_estimateGas`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_estimategas)
 *
 * @param client - Client to use
 * @param parameters - {@link EstimateGasParameters}
 * @returns The gas estimate (in wei). {@link EstimateGasReturnType}
 *
 * @example
 * import { createPublicClient, http, parseEther } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { estimateGas } from 'viem/public'
 *
 * const client = createPublicClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const gasEstimate = await estimateGas(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: parseEther('1'),
 * })
 */
async function estimateGas(client, args) {
  const {
    account: account_ = client.account
  } = args;
  const account = account_ ? parseAccount(account_) : undefined;
  try {
    const {
      accessList,
      authorizationList,
      blobs,
      blobVersionedHashes,
      blockNumber,
      blockTag,
      data,
      gas,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      value,
      stateOverride,
      ...rest
    } = await prepareTransactionRequest(client, {
      ...args,
      parameters:
      // Some RPC Providers do not compute versioned hashes from blobs. We will need
      // to compute them.
      account?.type === 'local' ? undefined : ['blobVersionedHashes']
    });
    const blockNumberHex = blockNumber ? numberToHex(blockNumber) : undefined;
    const block = blockNumberHex || blockTag;
    const rpcStateOverride = serializeStateOverride(stateOverride);
    const to = await (async () => {
      // If `to` exists on the parameters, use that.
      if (rest.to) return rest.to;
      // If no `to` exists, and we are sending a EIP-7702 transaction, use the
      // address of the first authorization in the list.
      if (authorizationList && authorizationList.length > 0) return await recoverAuthorizationAddress({
        authorization: authorizationList[0]
      }).catch(() => {
        throw new BaseError('`to` is required. Could not infer from `authorizationList`');
      });
      // Otherwise, we are sending a deployment transaction.
      return undefined;
    })();
    assertRequest(args);
    const chainFormat = client.chain?.formatters?.transactionRequest?.format;
    const format = chainFormat || formatTransactionRequest;
    const request = format({
      // Pick out extra data that might exist on the chain's transaction request type.
      ...extract(rest, {
        format: chainFormat
      }),
      from: account?.address,
      accessList,
      authorizationList,
      blobs,
      blobVersionedHashes,
      data,
      gas,
      gasPrice,
      maxFeePerBlobGas,
      maxFeePerGas,
      maxPriorityFeePerGas,
      nonce,
      to,
      value
    });
    function estimateGas_rpc(parameters) {
      const {
        block,
        request,
        rpcStateOverride
      } = parameters;
      return client.request({
        method: 'eth_estimateGas',
        params: rpcStateOverride ? [request, block ?? 'latest', rpcStateOverride] : block ? [request, block] : [request]
      });
    }
    let estimate = BigInt(await estimateGas_rpc({
      block,
      request,
      rpcStateOverride
    }));
    // TODO(7702): Remove this once https://github.com/ethereum/execution-apis/issues/561 is resolved.
    //       Authorization list schema is not implemented on JSON-RPC spec yet, so we need to
    //       manually estimate the gas.
    if (authorizationList) {
      const value = await getBalance(client, {
        address: request.from
      });
      const estimates = await Promise.all(authorizationList.map(async authorization => {
        const {
          contractAddress
        } = authorization;
        const estimate = await estimateGas_rpc({
          block,
          request: {
            authorizationList: undefined,
            data,
            from: account?.address,
            to: contractAddress,
            value: numberToHex(value)
          },
          rpcStateOverride
        }).catch(() => 100000n);
        return 2n * BigInt(estimate);
      }));
      estimate += estimates.reduce((acc, curr) => acc + curr, 0n);
    }
    return estimate;
  } catch (err) {
    throw getEstimateGasError(err, {
      ...args,
      account,
      chain: client.chain
    });
  }
}

class ChainMismatchError extends BaseError {
  constructor({
    chain,
    currentChainId
  }) {
    super(`The current chain of the wallet (id: ${currentChainId}) does not match the target chain for the transaction (id: ${chain.id} – ${chain.name}).`, {
      metaMessages: [`Current Chain ID:  ${currentChainId}`, `Expected Chain ID: ${chain.id} – ${chain.name}`],
      name: 'ChainMismatchError'
    });
  }
}
class ChainNotFoundError extends BaseError {
  constructor() {
    super(['No chain was provided to the request.', 'Please provide a chain with the `chain` argument on the Action, or by supplying a `chain` to WalletClient.'].join('\n'), {
      name: 'ChainNotFoundError'
    });
  }
}

const docsPath = '/docs/contract/encodeDeployData';
function encodeDeployData(parameters) {
  const {
    abi,
    args,
    bytecode
  } = parameters;
  if (!args || args.length === 0) return bytecode;
  const description = abi.find(x => 'type' in x && x.type === 'constructor');
  if (!description) throw new AbiConstructorNotFoundError({
    docsPath
  });
  if (!('inputs' in description)) throw new AbiConstructorParamsNotFoundError({
    docsPath
  });
  if (!description.inputs || description.inputs.length === 0) throw new AbiConstructorParamsNotFoundError({
    docsPath
  });
  const data = encodeAbiParameters(description.inputs, args);
  return concatHex([bytecode, data]);
}

async function wait(time) {
  return new Promise(res => setTimeout(res, time));
}

class AccountNotFoundError extends BaseError {
  constructor({
    docsPath
  } = {}) {
    super(['Could not find an Account to execute with this Action.', 'Please provide an Account with the `account` argument on the Action, or by supplying an `account` to the Client.'].join('\n'), {
      docsPath,
      docsSlug: 'account',
      name: 'AccountNotFoundError'
    });
  }
}
class AccountTypeNotSupportedError extends BaseError {
  constructor({
    docsPath,
    metaMessages,
    type
  }) {
    super(`Account type "${type}" is not supported.`, {
      docsPath,
      metaMessages,
      name: 'AccountTypeNotSupportedError'
    });
  }
}

function assertCurrentChain({
  chain,
  currentChainId
}) {
  if (!chain) throw new ChainNotFoundError();
  if (currentChainId !== chain.id) throw new ChainMismatchError({
    chain,
    currentChainId
  });
}

function getTransactionError(err, {
  docsPath,
  ...args
}) {
  const cause = (() => {
    const cause = getNodeError(err, args);
    if (cause instanceof UnknownNodeError) return err;
    return cause;
  })();
  return new TransactionExecutionError(cause, {
    docsPath,
    ...args
  });
}

/**
 * Sends a **signed** transaction to the network
 *
 * - Docs: https://viem.sh/docs/actions/wallet/sendRawTransaction
 * - JSON-RPC Method: [`eth_sendRawTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param client - Client to use
 * @param parameters - {@link SendRawTransactionParameters}
 * @returns The transaction hash. {@link SendRawTransactionReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { sendRawTransaction } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 *
 * const hash = await sendRawTransaction(client, {
 *   serializedTransaction: '0x02f850018203118080825208808080c080a04012522854168b27e5dc3d5839bab5e6b39e1a0ffd343901ce1622e3d64b48f1a04e00902ae0502c4728cbf12156290df99c3ed7de85b1dbfe20b5c36931733a33'
 * })
 */
async function sendRawTransaction(client, {
  serializedTransaction
}) {
  return client.request({
    method: 'eth_sendRawTransaction',
    params: [serializedTransaction]
  }, {
    retryCount: 0
  });
}

const supportsWalletNamespace = new LruMap(128);
/**
 * Creates, signs, and sends a new transaction to the network.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/sendTransaction
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/transactions/sending-transactions
 * - JSON-RPC Methods:
 *   - JSON-RPC Accounts: [`eth_sendTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendtransaction)
 *   - Local Accounts: [`eth_sendRawTransaction`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_sendrawtransaction)
 *
 * @param client - Client to use
 * @param parameters - {@link SendTransactionParameters}
 * @returns The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. {@link SendTransactionReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { sendTransaction } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const hash = await sendTransaction(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: 1000000000000000000n,
 * })
 *
 * @example
 * // Account Hoisting
 * import { createWalletClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { sendTransaction } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const hash = await sendTransaction(client, {
 *   to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
 *   value: 1000000000000000000n,
 * })
 */
async function sendTransaction(client, parameters) {
  const {
    account: account_ = client.account,
    chain = client.chain,
    accessList,
    authorizationList,
    blobs,
    data,
    gas,
    gasPrice,
    maxFeePerBlobGas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    value,
    ...rest
  } = parameters;
  if (typeof account_ === 'undefined') throw new AccountNotFoundError({
    docsPath: '/docs/actions/wallet/sendTransaction'
  });
  const account = account_ ? parseAccount(account_) : null;
  try {
    assertRequest(parameters);
    const to = await (async () => {
      // If `to` exists on the parameters, use that.
      if (parameters.to) return parameters.to;
      // If no `to` exists, and we are sending a EIP-7702 transaction, use the
      // address of the first authorization in the list.
      if (authorizationList && authorizationList.length > 0) return await recoverAuthorizationAddress({
        authorization: authorizationList[0]
      }).catch(() => {
        throw new BaseError('`to` is required. Could not infer from `authorizationList`.');
      });
      // Otherwise, we are sending a deployment transaction.
      return undefined;
    })();
    if (account?.type === 'json-rpc' || account === null) {
      let chainId;
      if (chain !== null) {
        chainId = await getAction(client, getChainId, 'getChainId')({});
        assertCurrentChain({
          currentChainId: chainId,
          chain
        });
      }
      const chainFormat = client.chain?.formatters?.transactionRequest?.format;
      const format = chainFormat || formatTransactionRequest;
      const request = format({
        // Pick out extra data that might exist on the chain's transaction request type.
        ...extract(rest, {
          format: chainFormat
        }),
        accessList,
        authorizationList,
        blobs,
        chainId,
        data,
        from: account?.address,
        gas,
        gasPrice,
        maxFeePerBlobGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        to,
        value
      });
      const method = supportsWalletNamespace.get(client.uid) ? 'wallet_sendTransaction' : 'eth_sendTransaction';
      try {
        return await client.request({
          method,
          params: [request]
        }, {
          retryCount: 0
        });
      } catch (e) {
        const error = e;
        // If the transport does not support the method or input, attempt to use the
        // `wallet_sendTransaction` method.
        if (error.name === 'InvalidInputRpcError' || error.name === 'InvalidParamsRpcError' || error.name === 'MethodNotFoundRpcError' || error.name === 'MethodNotSupportedRpcError') return await client.request({
          method: 'wallet_sendTransaction',
          params: [request]
        }, {
          retryCount: 0
        }).then(hash => {
          supportsWalletNamespace.set(client.uid, true);
          return hash;
        });
        throw error;
      }
    }
    if (account?.type === 'local') {
      // Prepare the request for signing (assign appropriate fees, etc.)
      const request = await getAction(client, prepareTransactionRequest, 'prepareTransactionRequest')({
        account,
        accessList,
        authorizationList,
        blobs,
        chain,
        data,
        gas,
        gasPrice,
        maxFeePerBlobGas,
        maxFeePerGas,
        maxPriorityFeePerGas,
        nonce,
        nonceManager: account.nonceManager,
        parameters: [...defaultParameters, 'sidecars'],
        value,
        ...rest,
        to
      });
      const serializer = chain?.serializers?.transaction;
      const serializedTransaction = await account.signTransaction(request, {
        serializer
      });
      return await getAction(client, sendRawTransaction, 'sendRawTransaction')({
        serializedTransaction
      });
    }
    if (account?.type === 'smart') throw new AccountTypeNotSupportedError({
      metaMessages: ['Consider using the `sendUserOperation` Action instead.'],
      docsPath: '/docs/actions/bundler/sendUserOperation',
      type: 'smart'
    });
    throw new AccountTypeNotSupportedError({
      docsPath: '/docs/actions/wallet/sendTransaction',
      type: account?.type
    });
  } catch (err) {
    if (err instanceof AccountTypeNotSupportedError) throw err;
    throw getTransactionError(err, {
      ...parameters,
      account,
      chain: parameters.chain || undefined
    });
  }
}

/**
 * Executes a write function on a contract.
 *
 * - Docs: https://viem.sh/docs/contract/writeContract
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts/writing-to-contracts
 *
 * A "write" function on a Solidity contract modifies the state of the blockchain. These types of functions require gas to be executed, and hence a [Transaction](https://viem.sh/docs/glossary/terms) is needed to be broadcast in order to change the state.
 *
 * Internally, uses a [Wallet Client](https://viem.sh/docs/clients/wallet) to call the [`sendTransaction` action](https://viem.sh/docs/actions/wallet/sendTransaction) with [ABI-encoded `data`](https://viem.sh/docs/contract/encodeFunctionData).
 *
 * __Warning: The `write` internally sends a transaction – it does not validate if the contract write will succeed (the contract may throw an error). It is highly recommended to [simulate the contract write with `contract.simulate`](https://viem.sh/docs/contract/writeContract#usage) before you execute it.__
 *
 * @param client - Client to use
 * @param parameters - {@link WriteContractParameters}
 * @returns A [Transaction Hash](https://viem.sh/docs/glossary/terms#hash). {@link WriteContractReturnType}
 *
 * @example
 * import { createWalletClient, custom, parseAbi } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { writeContract } from 'viem/contract'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const hash = await writeContract(client, {
 *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *   abi: parseAbi(['function mint(uint32 tokenId) nonpayable']),
 *   functionName: 'mint',
 *   args: [69420],
 * })
 *
 * @example
 * // With Validation
 * import { createWalletClient, http, parseAbi } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { simulateContract, writeContract } from 'viem/contract'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const { request } = await simulateContract(client, {
 *   address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
 *   abi: parseAbi(['function mint(uint32 tokenId) nonpayable']),
 *   functionName: 'mint',
 *   args: [69420],
 * }
 * const hash = await writeContract(client, request)
 */
async function writeContract(client, parameters) {
  const {
    abi,
    account: account_ = client.account,
    address,
    args,
    dataSuffix,
    functionName,
    ...request
  } = parameters;
  if (typeof account_ === 'undefined') throw new AccountNotFoundError({
    docsPath: '/docs/contract/writeContract'
  });
  const account = account_ ? parseAccount(account_) : null;
  const data = encodeFunctionData({
    abi,
    args,
    functionName
  });
  try {
    return await getAction(client, sendTransaction, 'sendTransaction')({
      data: `${data}${dataSuffix ? dataSuffix.replace('0x', '') : ''}`,
      to: address,
      account,
      ...request
    });
  } catch (error) {
    throw getContractError(error, {
      abi,
      address,
      args,
      docsPath: '/docs/contract/writeContract',
      functionName,
      sender: account?.address
    });
  }
}

/**
 * Adds an EVM chain to the wallet.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/addChain
 * - JSON-RPC Methods: [`eth_addEthereumChain`](https://eips.ethereum.org/EIPS/eip-3085)
 *
 * @param client - Client to use
 * @param parameters - {@link AddChainParameters}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { optimism } from 'viem/chains'
 * import { addChain } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   transport: custom(window.ethereum),
 * })
 * await addChain(client, { chain: optimism })
 */
async function addChain(client, {
  chain
}) {
  const {
    id,
    name,
    nativeCurrency,
    rpcUrls,
    blockExplorers
  } = chain;
  await client.request({
    method: 'wallet_addEthereumChain',
    params: [{
      chainId: numberToHex(id),
      chainName: name,
      nativeCurrency,
      rpcUrls: rpcUrls.default.http,
      blockExplorerUrls: blockExplorers ? Object.values(blockExplorers).map(({
        url
      }) => url) : undefined
    }]
  }, {
    dedupe: true,
    retryCount: 0
  });
}

const size = 256;
let index = size;
let buffer;
function uid(length = 11) {
  if (!buffer || index + length > size * 2) {
    buffer = '';
    index = 0;
    for (let i = 0; i < size; i++) {
      buffer += (256 + Math.random() * 256 | 0).toString(16).substring(1);
    }
  }
  return buffer.substring(index, index++ + length);
}

function createClient(parameters) {
  const {
    batch,
    cacheTime = parameters.pollingInterval ?? 4_000,
    ccipRead,
    key = 'base',
    name = 'Base Client',
    pollingInterval = 4_000,
    type = 'base'
  } = parameters;
  const chain = parameters.chain;
  const account = parameters.account ? parseAccount(parameters.account) : undefined;
  const {
    config,
    request,
    value
  } = parameters.transport({
    chain,
    pollingInterval
  });
  const transport = {
    ...config,
    ...value
  };
  const client = {
    account,
    batch,
    cacheTime,
    ccipRead,
    chain,
    key,
    name,
    pollingInterval,
    request,
    transport,
    type,
    uid: uid()
  };
  function extend(base) {
    return extendFn => {
      const extended = extendFn(base);
      for (const key in client) delete extended[key];
      const combined = {
        ...base,
        ...extended
      };
      return Object.assign(combined, {
        extend: extend(combined)
      });
    };
  }
  return Object.assign(client, {
    extend: extend(client)
  });
}

/** @internal */
const promiseCache = /*#__PURE__*/new LruMap(8192);
/** Deduplicates in-flight promises. */
function withDedupe(fn, {
  enabled = true,
  id
}) {
  if (!enabled || !id) return fn();
  if (promiseCache.get(id)) return promiseCache.get(id);
  const promise = fn().finally(() => promiseCache.delete(id));
  promiseCache.set(id, promise);
  return promise;
}

function withRetry(fn, {
  delay: delay_ = 100,
  retryCount = 2,
  shouldRetry = () => true
} = {}) {
  return new Promise((resolve, reject) => {
    const attemptRetry = async ({
      count = 0
    } = {}) => {
      const retry = async ({
        error
      }) => {
        const delay = typeof delay_ === 'function' ? delay_({
          count,
          error
        }) : delay_;
        if (delay) await wait(delay);
        attemptRetry({
          count: count + 1
        });
      };
      try {
        const data = await fn();
        resolve(data);
      } catch (err) {
        if (count < retryCount && (await shouldRetry({
          count,
          error: err
        }))) return retry({
          error: err
        });
        reject(err);
      }
    };
    attemptRetry();
  });
}

function buildRequest(request, options = {}) {
  return async (args, overrideOptions = {}) => {
    const {
      dedupe = false,
      retryDelay = 150,
      retryCount = 3,
      uid
    } = {
      ...options,
      ...overrideOptions
    };
    const requestId = dedupe ? keccak256(stringToHex(`${uid}.${stringify(args)}`)) : undefined;
    return withDedupe(() => withRetry(async () => {
      try {
        return await request(args);
      } catch (err_) {
        const err = err_;
        switch (err.code) {
          // -32700
          case ParseRpcError.code:
            throw new ParseRpcError(err);
          // -32600
          case InvalidRequestRpcError.code:
            throw new InvalidRequestRpcError(err);
          // -32601
          case MethodNotFoundRpcError.code:
            throw new MethodNotFoundRpcError(err, {
              method: args.method
            });
          // -32602
          case InvalidParamsRpcError.code:
            throw new InvalidParamsRpcError(err);
          // -32603
          case InternalRpcError.code:
            throw new InternalRpcError(err);
          // -32000
          case InvalidInputRpcError.code:
            throw new InvalidInputRpcError(err);
          // -32001
          case ResourceNotFoundRpcError.code:
            throw new ResourceNotFoundRpcError(err);
          // -32002
          case ResourceUnavailableRpcError.code:
            throw new ResourceUnavailableRpcError(err);
          // -32003
          case TransactionRejectedRpcError.code:
            throw new TransactionRejectedRpcError(err);
          // -32004
          case MethodNotSupportedRpcError.code:
            throw new MethodNotSupportedRpcError(err, {
              method: args.method
            });
          // -32005
          case LimitExceededRpcError.code:
            throw new LimitExceededRpcError(err);
          // -32006
          case JsonRpcVersionUnsupportedError.code:
            throw new JsonRpcVersionUnsupportedError(err);
          // 4001
          case UserRejectedRequestError.code:
            throw new UserRejectedRequestError(err);
          // 4100
          case UnauthorizedProviderError.code:
            throw new UnauthorizedProviderError(err);
          // 4200
          case UnsupportedProviderMethodError.code:
            throw new UnsupportedProviderMethodError(err);
          // 4900
          case ProviderDisconnectedError.code:
            throw new ProviderDisconnectedError(err);
          // 4901
          case ChainDisconnectedError.code:
            throw new ChainDisconnectedError(err);
          // 4902
          case SwitchChainError.code:
            throw new SwitchChainError(err);
          // CAIP-25: User Rejected Error
          // https://docs.walletconnect.com/2.0/specs/clients/sign/error-codes#rejected-caip-25
          case 5000:
            throw new UserRejectedRequestError(err);
          default:
            if (err_ instanceof BaseError) throw err_;
            throw new UnknownRpcError(err);
        }
      }
    }, {
      delay: ({
        count,
        error
      }) => {
        // If we find a Retry-After header, let's retry after the given time.
        if (error && error instanceof HttpRequestError) {
          const retryAfter = error?.headers?.get('Retry-After');
          if (retryAfter?.match(/\d/)) return Number.parseInt(retryAfter) * 1000;
        }
        // Otherwise, let's retry with an exponential backoff.
        return ~~(1 << count) * retryDelay;
      },
      retryCount,
      shouldRetry: ({
        error
      }) => shouldRetry(error)
    }), {
      enabled: dedupe,
      id: requestId
    });
  };
}
/** @internal */
function shouldRetry(error) {
  if ('code' in error && typeof error.code === 'number') {
    if (error.code === -1) return true; // Unknown error
    if (error.code === LimitExceededRpcError.code) return true;
    if (error.code === InternalRpcError.code) return true;
    return false;
  }
  if (error instanceof HttpRequestError && error.status) {
    // Forbidden
    if (error.status === 403) return true;
    // Request Timeout
    if (error.status === 408) return true;
    // Request Entity Too Large
    if (error.status === 413) return true;
    // Too Many Requests
    if (error.status === 429) return true;
    // Internal Server Error
    if (error.status === 500) return true;
    // Bad Gateway
    if (error.status === 502) return true;
    // Service Unavailable
    if (error.status === 503) return true;
    // Gateway Timeout
    if (error.status === 504) return true;
    return false;
  }
  return true;
}

/**
 * @description Creates an transport intended to be used with a client.
 */
function createTransport({
  key,
  name,
  request,
  retryCount = 3,
  retryDelay = 150,
  timeout,
  type
}, value) {
  const uid$1 = uid();
  return {
    config: {
      key,
      name,
      request,
      retryCount,
      retryDelay,
      timeout,
      type
    },
    request: buildRequest(request, {
      retryCount,
      retryDelay,
      uid: uid$1
    }),
    value
  };
}

/**
 * @description Creates a custom transport given an EIP-1193 compliant `request` attribute.
 */
function custom(provider, config = {}) {
  const {
    key = 'custom',
    name = 'Custom Provider',
    retryDelay
  } = config;
  return ({
    retryCount: defaultRetryCount
  }) => createTransport({
    key,
    name,
    request: provider.request.bind(provider),
    retryCount: config.retryCount ?? defaultRetryCount,
    retryDelay,
    type: 'custom'
  });
}

// `bytes<M>`: binary type of `M` bytes, `0 < M <= 32`
// https://regexr.com/6va55
const bytesRegex = /^bytes([1-9]|1[0-9]|2[0-9]|3[0-2])?$/;
// `(u)int<M>`: (un)signed integer type of `M` bits, `0 < M <= 256`, `M % 8 == 0`
// https://regexr.com/6v8hp
const integerRegex = /^(u?int)(8|16|24|32|40|48|56|64|72|80|88|96|104|112|120|128|136|144|152|160|168|176|184|192|200|208|216|224|232|240|248|256)?$/;

class InvalidPrimaryTypeError extends BaseError {
  constructor({
    primaryType,
    types
  }) {
    super(`Invalid primary type \`${primaryType}\` must be one of \`${JSON.stringify(Object.keys(types))}\`.`, {
      docsPath: '/api/glossary/Errors#typeddatainvalidprimarytypeerror',
      metaMessages: ['Check that the primary type is a key in `types`.']
    });
  }
}
class InvalidStructTypeError extends BaseError {
  constructor({
    type
  }) {
    super(`Struct type "${type}" is invalid.`, {
      metaMessages: ['Struct type must not be a Solidity type.'],
      name: 'InvalidStructTypeError'
    });
  }
}

function serializeTypedData(parameters) {
  const {
    domain: domain_,
    message: message_,
    primaryType,
    types
  } = parameters;
  const normalizeData = (struct, data_) => {
    const data = {
      ...data_
    };
    for (const param of struct) {
      const {
        name,
        type
      } = param;
      if (type === 'address') data[name] = data[name].toLowerCase();
    }
    return data;
  };
  const domain = (() => {
    if (!types.EIP712Domain) return {};
    if (!domain_) return {};
    return normalizeData(types.EIP712Domain, domain_);
  })();
  const message = (() => {
    if (primaryType === 'EIP712Domain') return undefined;
    return normalizeData(types[primaryType], message_);
  })();
  return stringify({
    domain,
    message,
    primaryType,
    types
  });
}
function validateTypedData(parameters) {
  const {
    domain,
    message,
    primaryType,
    types
  } = parameters;
  const validateData = (struct, data) => {
    for (const param of struct) {
      const {
        name,
        type
      } = param;
      const value = data[name];
      const integerMatch = type.match(integerRegex);
      if (integerMatch && (typeof value === 'number' || typeof value === 'bigint')) {
        const [_type, base, size_] = integerMatch;
        // If number cannot be cast to a sized hex value, it is out of range
        // and will throw.
        numberToHex(value, {
          signed: base === 'int',
          size: Number.parseInt(size_) / 8
        });
      }
      if (type === 'address' && typeof value === 'string' && !isAddress(value)) throw new InvalidAddressError({
        address: value
      });
      const bytesMatch = type.match(bytesRegex);
      if (bytesMatch) {
        const [_type, size_] = bytesMatch;
        if (size_ && size$1(value) !== Number.parseInt(size_)) throw new BytesSizeMismatchError({
          expectedSize: Number.parseInt(size_),
          givenSize: size$1(value)
        });
      }
      const struct = types[type];
      if (struct) {
        validateReference(type);
        validateData(struct, value);
      }
    }
  };
  // Validate domain types.
  if (types.EIP712Domain && domain) validateData(types.EIP712Domain, domain);
  // Validate message types.
  if (primaryType !== 'EIP712Domain') {
    if (types[primaryType]) validateData(types[primaryType], message);else throw new InvalidPrimaryTypeError({
      primaryType,
      types
    });
  }
}
function getTypesForEIP712Domain({
  domain
}) {
  return [typeof domain?.name === 'string' && {
    name: 'name',
    type: 'string'
  }, domain?.version && {
    name: 'version',
    type: 'string'
  }, typeof domain?.chainId === 'number' && {
    name: 'chainId',
    type: 'uint256'
  }, domain?.verifyingContract && {
    name: 'verifyingContract',
    type: 'address'
  }, domain?.salt && {
    name: 'salt',
    type: 'bytes32'
  }].filter(Boolean);
}
/** @internal */
function validateReference(type) {
  // Struct type must not be a Solidity type.
  if (type === 'address' || type === 'bool' || type === 'string' || type.startsWith('bytes') || type.startsWith('uint') || type.startsWith('int')) throw new InvalidStructTypeError({
    type
  });
}

// HMAC (RFC 2104)
class HMAC extends Hash {
  constructor(hash, _key) {
    super();
    this.finished = false;
    this.destroyed = false;
    hash$1(hash);
    const key = toBytes(_key);
    this.iHash = hash.create();
    if (typeof this.iHash.update !== 'function') throw new Error('Expected instance of class which extends utils.Hash');
    this.blockLen = this.iHash.blockLen;
    this.outputLen = this.iHash.outputLen;
    const blockLen = this.blockLen;
    const pad = new Uint8Array(blockLen);
    // blockLen can be bigger than outputLen
    pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
    for (let i = 0; i < pad.length; i++) pad[i] ^= 0x36;
    this.iHash.update(pad);
    // By doing update (processing of first block) of outer hash here we can re-use it between multiple calls via clone
    this.oHash = hash.create();
    // Undo internal XOR && apply outer XOR
    for (let i = 0; i < pad.length; i++) pad[i] ^= 0x36 ^ 0x5c;
    this.oHash.update(pad);
    pad.fill(0);
  }
  update(buf) {
    exists(this);
    this.iHash.update(buf);
    return this;
  }
  digestInto(out) {
    exists(this);
    bytes(out, this.outputLen);
    this.finished = true;
    this.iHash.digestInto(out);
    this.oHash.update(out);
    this.oHash.digestInto(out);
    this.destroy();
  }
  digest() {
    const out = new Uint8Array(this.oHash.outputLen);
    this.digestInto(out);
    return out;
  }
  _cloneInto(to) {
    // Create new instance without calling constructor since key already in state and we don't know it.
    to || (to = Object.create(Object.getPrototypeOf(this), {}));
    const {
      oHash,
      iHash,
      finished,
      destroyed,
      blockLen,
      outputLen
    } = this;
    to = to;
    to.finished = finished;
    to.destroyed = destroyed;
    to.blockLen = blockLen;
    to.outputLen = outputLen;
    to.oHash = oHash._cloneInto(to.oHash);
    to.iHash = iHash._cloneInto(to.iHash);
    return to;
  }
  destroy() {
    this.destroyed = true;
    this.oHash.destroy();
    this.iHash.destroy();
  }
}
/**
 * HMAC: RFC2104 message authentication code.
 * @param hash - function that would be used e.g. sha256
 * @param key - message key
 * @param message - message data
 * @example
 * import { hmac } from '@noble/hashes/hmac';
 * import { sha256 } from '@noble/hashes/sha2';
 * const mac1 = hmac(sha256, 'key', 'message');
 */
const hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
hmac.create = (hash, key) => new HMAC(hash, key);

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// 100 lines of code in the file are duplicated from noble-hashes (utils).
// This is OK: `abstract` directory does not use noble-hashes.
// User may opt-in into using different hashing library. This way, noble-hashes
// won't be included into their bundle.
const _0n$3 = /* @__PURE__ */BigInt(0);
const _1n$4 = /* @__PURE__ */BigInt(1);
const _2n$2 = /* @__PURE__ */BigInt(2);
function isBytes(a) {
  return a instanceof Uint8Array || a != null && typeof a === 'object' && a.constructor.name === 'Uint8Array';
}
function abytes(item) {
  if (!isBytes(item)) throw new Error('Uint8Array expected');
}
function abool(title, value) {
  if (typeof value !== 'boolean') throw new Error(`${title} must be valid boolean, got "${value}".`);
}
// Array where index 0xf0 (240) is mapped to string 'f0'
const hexes = /* @__PURE__ */Array.from({
  length: 256
}, (_, i) => i.toString(16).padStart(2, '0'));
/**
 * @example bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])) // 'cafe0123'
 */
function bytesToHex(bytes) {
  abytes(bytes);
  // pre-caching improves the speed 6x
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += hexes[bytes[i]];
  }
  return hex;
}
function numberToHexUnpadded(num) {
  const hex = num.toString(16);
  return hex.length & 1 ? `0${hex}` : hex;
}
function hexToNumber(hex) {
  if (typeof hex !== 'string') throw new Error('hex string expected, got ' + typeof hex);
  // Big Endian
  return BigInt(hex === '' ? '0' : `0x${hex}`);
}
// We use optimized technique to convert hex string to byte array
const asciis = {
  _0: 48,
  _9: 57,
  _A: 65,
  _F: 70,
  _a: 97,
  _f: 102
};
function asciiToBase16(char) {
  if (char >= asciis._0 && char <= asciis._9) return char - asciis._0;
  if (char >= asciis._A && char <= asciis._F) return char - (asciis._A - 10);
  if (char >= asciis._a && char <= asciis._f) return char - (asciis._a - 10);
  return;
}
/**
 * @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
 */
function hexToBytes(hex) {
  if (typeof hex !== 'string') throw new Error('hex string expected, got ' + typeof hex);
  const hl = hex.length;
  const al = hl / 2;
  if (hl % 2) throw new Error('padded hex string expected, got unpadded hex of length ' + hl);
  const array = new Uint8Array(al);
  for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
    const n1 = asciiToBase16(hex.charCodeAt(hi));
    const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
    if (n1 === undefined || n2 === undefined) {
      const char = hex[hi] + hex[hi + 1];
      throw new Error('hex string expected, got non-hex character "' + char + '" at index ' + hi);
    }
    array[ai] = n1 * 16 + n2;
  }
  return array;
}
// BE: Big Endian, LE: Little Endian
function bytesToNumberBE(bytes) {
  return hexToNumber(bytesToHex(bytes));
}
function bytesToNumberLE(bytes) {
  abytes(bytes);
  return hexToNumber(bytesToHex(Uint8Array.from(bytes).reverse()));
}
function numberToBytesBE(n, len) {
  return hexToBytes(n.toString(16).padStart(len * 2, '0'));
}
function numberToBytesLE(n, len) {
  return numberToBytesBE(n, len).reverse();
}
// Unpadded, rarely used
function numberToVarBytesBE(n) {
  return hexToBytes(numberToHexUnpadded(n));
}
/**
 * Takes hex string or Uint8Array, converts to Uint8Array.
 * Validates output length.
 * Will throw error for other types.
 * @param title descriptive title for an error e.g. 'private key'
 * @param hex hex string or Uint8Array
 * @param expectedLength optional, will compare to result array's length
 * @returns
 */
function ensureBytes(title, hex, expectedLength) {
  let res;
  if (typeof hex === 'string') {
    try {
      res = hexToBytes(hex);
    } catch (e) {
      throw new Error(`${title} must be valid hex string, got "${hex}". Cause: ${e}`);
    }
  } else if (isBytes(hex)) {
    // Uint8Array.from() instead of hash.slice() because node.js Buffer
    // is instance of Uint8Array, and its slice() creates **mutable** copy
    res = Uint8Array.from(hex);
  } else {
    throw new Error(`${title} must be hex string or Uint8Array`);
  }
  const len = res.length;
  if (typeof expectedLength === 'number' && len !== expectedLength) throw new Error(`${title} expected ${expectedLength} bytes, got ${len}`);
  return res;
}
/**
 * Copies several Uint8Arrays into one.
 */
function concatBytes(...arrays) {
  let sum = 0;
  for (let i = 0; i < arrays.length; i++) {
    const a = arrays[i];
    abytes(a);
    sum += a.length;
  }
  const res = new Uint8Array(sum);
  for (let i = 0, pad = 0; i < arrays.length; i++) {
    const a = arrays[i];
    res.set(a, pad);
    pad += a.length;
  }
  return res;
}
// Compares 2 u8a-s in kinda constant time
function equalBytes(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}
/**
 * @example utf8ToBytes('abc') // new Uint8Array([97, 98, 99])
 */
function utf8ToBytes(str) {
  if (typeof str !== 'string') throw new Error(`utf8ToBytes expected string, got ${typeof str}`);
  return new Uint8Array(new TextEncoder().encode(str)); // https://bugzil.la/1681809
}
// Is positive bigint
const isPosBig = n => typeof n === 'bigint' && _0n$3 <= n;
function inRange(n, min, max) {
  return isPosBig(n) && isPosBig(min) && isPosBig(max) && min <= n && n < max;
}
/**
 * Asserts min <= n < max. NOTE: It's < max and not <= max.
 * @example
 * aInRange('x', x, 1n, 256n); // would assume x is in (1n..255n)
 */
function aInRange(title, n, min, max) {
  // Why min <= n < max and not a (min < n < max) OR b (min <= n <= max)?
  // consider P=256n, min=0n, max=P
  // - a for min=0 would require -1:          `inRange('x', x, -1n, P)`
  // - b would commonly require subtraction:  `inRange('x', x, 0n, P - 1n)`
  // - our way is the cleanest:               `inRange('x', x, 0n, P)
  if (!inRange(n, min, max)) throw new Error(`expected valid ${title}: ${min} <= n < ${max}, got ${typeof n} ${n}`);
}
// Bit operations
/**
 * Calculates amount of bits in a bigint.
 * Same as `n.toString(2).length`
 */
function bitLen(n) {
  let len;
  for (len = 0; n > _0n$3; n >>= _1n$4, len += 1);
  return len;
}
/**
 * Gets single bit at position.
 * NOTE: first bit position is 0 (same as arrays)
 * Same as `!!+Array.from(n.toString(2)).reverse()[pos]`
 */
function bitGet(n, pos) {
  return n >> BigInt(pos) & _1n$4;
}
/**
 * Sets single bit at position.
 */
function bitSet(n, pos, value) {
  return n | (value ? _1n$4 : _0n$3) << BigInt(pos);
}
/**
 * Calculate mask for N bits. Not using ** operator with bigints because of old engines.
 * Same as BigInt(`0b${Array(i).fill('1').join('')}`)
 */
const bitMask = n => (_2n$2 << BigInt(n - 1)) - _1n$4;
// DRBG
const u8n = data => new Uint8Array(data); // creates Uint8Array
const u8fr = arr => Uint8Array.from(arr); // another shortcut
/**
 * Minimal HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
 * @returns function that will call DRBG until 2nd arg returns something meaningful
 * @example
 *   const drbg = createHmacDRBG<Key>(32, 32, hmac);
 *   drbg(seed, bytesToKey); // bytesToKey must return Key or undefined
 */
function createHmacDrbg(hashLen, qByteLen, hmacFn) {
  if (typeof hashLen !== 'number' || hashLen < 2) throw new Error('hashLen must be a number');
  if (typeof qByteLen !== 'number' || qByteLen < 2) throw new Error('qByteLen must be a number');
  if (typeof hmacFn !== 'function') throw new Error('hmacFn must be a function');
  // Step B, Step C: set hashLen to 8*ceil(hlen/8)
  let v = u8n(hashLen); // Minimal non-full-spec HMAC-DRBG from NIST 800-90 for RFC6979 sigs.
  let k = u8n(hashLen); // Steps B and C of RFC6979 3.2: set hashLen, in our case always same
  let i = 0; // Iterations counter, will throw when over 1000
  const reset = () => {
    v.fill(1);
    k.fill(0);
    i = 0;
  };
  const h = (...b) => hmacFn(k, v, ...b); // hmac(k)(v, ...values)
  const reseed = (seed = u8n()) => {
    // HMAC-DRBG reseed() function. Steps D-G
    k = h(u8fr([0x00]), seed); // k = hmac(k || v || 0x00 || seed)
    v = h(); // v = hmac(k || v)
    if (seed.length === 0) return;
    k = h(u8fr([0x01]), seed); // k = hmac(k || v || 0x01 || seed)
    v = h(); // v = hmac(k || v)
  };
  const gen = () => {
    // HMAC-DRBG generate() function
    if (i++ >= 1000) throw new Error('drbg: tried 1000 values');
    let len = 0;
    const out = [];
    while (len < qByteLen) {
      v = h();
      const sl = v.slice();
      out.push(sl);
      len += v.length;
    }
    return concatBytes(...out);
  };
  const genUntil = (seed, pred) => {
    reset();
    reseed(seed); // Steps D-G
    let res = undefined; // Step H: grind until k is in [1..n-1]
    while (!(res = pred(gen()))) reseed();
    reset();
    return res;
  };
  return genUntil;
}
// Validating curves and fields
const validatorFns = {
  bigint: val => typeof val === 'bigint',
  function: val => typeof val === 'function',
  boolean: val => typeof val === 'boolean',
  string: val => typeof val === 'string',
  stringOrUint8Array: val => typeof val === 'string' || isBytes(val),
  isSafeInteger: val => Number.isSafeInteger(val),
  array: val => Array.isArray(val),
  field: (val, object) => object.Fp.isValid(val),
  hash: val => typeof val === 'function' && Number.isSafeInteger(val.outputLen)
};
// type Record<K extends string | number | symbol, T> = { [P in K]: T; }
function validateObject(object, validators, optValidators = {}) {
  const checkField = (fieldName, type, isOptional) => {
    const checkVal = validatorFns[type];
    if (typeof checkVal !== 'function') throw new Error(`Invalid validator "${type}", expected function`);
    const val = object[fieldName];
    if (isOptional && val === undefined) return;
    if (!checkVal(val, object)) {
      throw new Error(`Invalid param ${String(fieldName)}=${val} (${typeof val}), expected ${type}`);
    }
  };
  for (const [fieldName, type] of Object.entries(validators)) checkField(fieldName, type, false);
  for (const [fieldName, type] of Object.entries(optValidators)) checkField(fieldName, type, true);
  return object;
}
// validate type tests
// const o: { a: number; b: number; c: number } = { a: 1, b: 5, c: 6 };
// const z0 = validateObject(o, { a: 'isSafeInteger' }, { c: 'bigint' }); // Ok!
// // Should fail type-check
// const z1 = validateObject(o, { a: 'tmp' }, { c: 'zz' });
// const z2 = validateObject(o, { a: 'isSafeInteger' }, { c: 'zz' });
// const z3 = validateObject(o, { test: 'boolean', z: 'bug' });
// const z4 = validateObject(o, { a: 'boolean', z: 'bug' });
/**
 * throws not implemented error
 */
const notImplemented = () => {
  throw new Error('not implemented');
};
/**
 * Memoizes (caches) computation result.
 * Uses WeakMap: the value is going auto-cleaned by GC after last reference is removed.
 */
function memoized(fn) {
  const map = new WeakMap();
  return (arg, ...args) => {
    const val = map.get(arg);
    if (val !== undefined) return val;
    const computed = fn(arg, ...args);
    map.set(arg, computed);
    return computed;
  };
}

var ut = /*#__PURE__*/Object.freeze({
  __proto__: null,
  aInRange: aInRange,
  abool: abool,
  abytes: abytes,
  bitGet: bitGet,
  bitLen: bitLen,
  bitMask: bitMask,
  bitSet: bitSet,
  bytesToHex: bytesToHex,
  bytesToNumberBE: bytesToNumberBE,
  bytesToNumberLE: bytesToNumberLE,
  concatBytes: concatBytes,
  createHmacDrbg: createHmacDrbg,
  ensureBytes: ensureBytes,
  equalBytes: equalBytes,
  hexToBytes: hexToBytes,
  hexToNumber: hexToNumber,
  inRange: inRange,
  isBytes: isBytes,
  memoized: memoized,
  notImplemented: notImplemented,
  numberToBytesBE: numberToBytesBE,
  numberToBytesLE: numberToBytesLE,
  numberToHexUnpadded: numberToHexUnpadded,
  numberToVarBytesBE: numberToVarBytesBE,
  utf8ToBytes: utf8ToBytes,
  validateObject: validateObject
});

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// Utilities for modular arithmetics and finite fields
// prettier-ignore
const _0n$2 = BigInt(0),
  _1n$3 = BigInt(1),
  _2n$1 = BigInt(2),
  _3n$1 = BigInt(3);
// prettier-ignore
const _4n = BigInt(4),
  _5n = BigInt(5),
  _8n = BigInt(8);
// prettier-ignore
BigInt(9);
  BigInt(16);
// Calculates a modulo b
function mod(a, b) {
  const result = a % b;
  return result >= _0n$2 ? result : b + result;
}
/**
 * Efficiently raise num to power and do modular division.
 * Unsafe in some contexts: uses ladder, so can expose bigint bits.
 * @example
 * pow(2n, 6n, 11n) // 64n % 11n == 9n
 */
// TODO: use field version && remove
function pow(num, power, modulo) {
  if (modulo <= _0n$2 || power < _0n$2) throw new Error('Expected power/modulo > 0');
  if (modulo === _1n$3) return _0n$2;
  let res = _1n$3;
  while (power > _0n$2) {
    if (power & _1n$3) res = res * num % modulo;
    num = num * num % modulo;
    power >>= _1n$3;
  }
  return res;
}
// Does x ^ (2 ^ power) mod p. pow2(30, 4) == 30 ^ (2 ^ 4)
function pow2(x, power, modulo) {
  let res = x;
  while (power-- > _0n$2) {
    res *= res;
    res %= modulo;
  }
  return res;
}
// Inverses number over modulo
function invert(number, modulo) {
  if (number === _0n$2 || modulo <= _0n$2) {
    throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`);
  }
  // Euclidean GCD https://brilliant.org/wiki/extended-euclidean-algorithm/
  // Fermat's little theorem "CT-like" version inv(n) = n^(m-2) mod m is 30x slower.
  let a = mod(number, modulo);
  let b = modulo;
  // prettier-ignore
  let x = _0n$2,
    u = _1n$3;
  while (a !== _0n$2) {
    // JIT applies optimization if those two lines follow each other
    const q = b / a;
    const r = b % a;
    const m = x - u * q;
    // prettier-ignore
    b = a, a = r, x = u, u = m;
  }
  const gcd = b;
  if (gcd !== _1n$3) throw new Error('invert: does not exist');
  return mod(x, modulo);
}
/**
 * Tonelli-Shanks square root search algorithm.
 * 1. https://eprint.iacr.org/2012/685.pdf (page 12)
 * 2. Square Roots from 1; 24, 51, 10 to Dan Shanks
 * Will start an infinite loop if field order P is not prime.
 * @param P field order
 * @returns function that takes field Fp (created from P) and number n
 */
function tonelliShanks(P) {
  // Legendre constant: used to calculate Legendre symbol (a | p),
  // which denotes the value of a^((p-1)/2) (mod p).
  // (a | p) ≡ 1    if a is a square (mod p)
  // (a | p) ≡ -1   if a is not a square (mod p)
  // (a | p) ≡ 0    if a ≡ 0 (mod p)
  const legendreC = (P - _1n$3) / _2n$1;
  let Q, S, Z;
  // Step 1: By factoring out powers of 2 from p - 1,
  // find q and s such that p - 1 = q*(2^s) with q odd
  for (Q = P - _1n$3, S = 0; Q % _2n$1 === _0n$2; Q /= _2n$1, S++);
  // Step 2: Select a non-square z such that (z | p) ≡ -1 and set c ≡ zq
  for (Z = _2n$1; Z < P && pow(Z, legendreC, P) !== P - _1n$3; Z++);
  // Fast-path
  if (S === 1) {
    const p1div4 = (P + _1n$3) / _4n;
    return function tonelliFast(Fp, n) {
      const root = Fp.pow(n, p1div4);
      if (!Fp.eql(Fp.sqr(root), n)) throw new Error('Cannot find square root');
      return root;
    };
  }
  // Slow-path
  const Q1div2 = (Q + _1n$3) / _2n$1;
  return function tonelliSlow(Fp, n) {
    // Step 0: Check that n is indeed a square: (n | p) should not be ≡ -1
    if (Fp.pow(n, legendreC) === Fp.neg(Fp.ONE)) throw new Error('Cannot find square root');
    let r = S;
    // TODO: will fail at Fp2/etc
    let g = Fp.pow(Fp.mul(Fp.ONE, Z), Q); // will update both x and b
    let x = Fp.pow(n, Q1div2); // first guess at the square root
    let b = Fp.pow(n, Q); // first guess at the fudge factor
    while (!Fp.eql(b, Fp.ONE)) {
      if (Fp.eql(b, Fp.ZERO)) return Fp.ZERO; // https://en.wikipedia.org/wiki/Tonelli%E2%80%93Shanks_algorithm (4. If t = 0, return r = 0)
      // Find m such b^(2^m)==1
      let m = 1;
      for (let t2 = Fp.sqr(b); m < r; m++) {
        if (Fp.eql(t2, Fp.ONE)) break;
        t2 = Fp.sqr(t2); // t2 *= t2
      }
      // NOTE: r-m-1 can be bigger than 32, need to convert to bigint before shift, otherwise there will be overflow
      const ge = Fp.pow(g, _1n$3 << BigInt(r - m - 1)); // ge = 2^(r-m-1)
      g = Fp.sqr(ge); // g = ge * ge
      x = Fp.mul(x, ge); // x *= ge
      b = Fp.mul(b, g); // b *= g
      r = m;
    }
    return x;
  };
}
function FpSqrt(P) {
  // NOTE: different algorithms can give different roots, it is up to user to decide which one they want.
  // For example there is FpSqrtOdd/FpSqrtEven to choice root based on oddness (used for hash-to-curve).
  // P ≡ 3 (mod 4)
  // √n = n^((P+1)/4)
  if (P % _4n === _3n$1) {
    // Not all roots possible!
    // const ORDER =
    //   0x1a0111ea397fe69a4b1ba7b6434bacd764774b84f38512bf6730d2a0f6b0f6241eabfffeb153ffffb9feffffffffaaabn;
    // const NUM = 72057594037927816n;
    const p1div4 = (P + _1n$3) / _4n;
    return function sqrt3mod4(Fp, n) {
      const root = Fp.pow(n, p1div4);
      // Throw if root**2 != n
      if (!Fp.eql(Fp.sqr(root), n)) throw new Error('Cannot find square root');
      return root;
    };
  }
  // Atkin algorithm for q ≡ 5 (mod 8), https://eprint.iacr.org/2012/685.pdf (page 10)
  if (P % _8n === _5n) {
    const c1 = (P - _5n) / _8n;
    return function sqrt5mod8(Fp, n) {
      const n2 = Fp.mul(n, _2n$1);
      const v = Fp.pow(n2, c1);
      const nv = Fp.mul(n, v);
      const i = Fp.mul(Fp.mul(nv, _2n$1), v);
      const root = Fp.mul(nv, Fp.sub(i, Fp.ONE));
      if (!Fp.eql(Fp.sqr(root), n)) throw new Error('Cannot find square root');
      return root;
    };
  }
  // Other cases: Tonelli-Shanks algorithm
  return tonelliShanks(P);
}
// prettier-ignore
const FIELD_FIELDS = ['create', 'isValid', 'is0', 'neg', 'inv', 'sqrt', 'sqr', 'eql', 'add', 'sub', 'mul', 'pow', 'div', 'addN', 'subN', 'mulN', 'sqrN'];
function validateField(field) {
  const initial = {
    ORDER: 'bigint',
    MASK: 'bigint',
    BYTES: 'isSafeInteger',
    BITS: 'isSafeInteger'
  };
  const opts = FIELD_FIELDS.reduce((map, val) => {
    map[val] = 'function';
    return map;
  }, initial);
  return validateObject(field, opts);
}
// Generic field functions
/**
 * Same as `pow` but for Fp: non-constant-time.
 * Unsafe in some contexts: uses ladder, so can expose bigint bits.
 */
function FpPow(f, num, power) {
  // Should have same speed as pow for bigints
  // TODO: benchmark!
  if (power < _0n$2) throw new Error('Expected power > 0');
  if (power === _0n$2) return f.ONE;
  if (power === _1n$3) return num;
  let p = f.ONE;
  let d = num;
  while (power > _0n$2) {
    if (power & _1n$3) p = f.mul(p, d);
    d = f.sqr(d);
    power >>= _1n$3;
  }
  return p;
}
/**
 * Efficiently invert an array of Field elements.
 * `inv(0)` will return `undefined` here: make sure to throw an error.
 */
function FpInvertBatch(f, nums) {
  const tmp = new Array(nums.length);
  // Walk from first to last, multiply them by each other MOD p
  const lastMultiplied = nums.reduce((acc, num, i) => {
    if (f.is0(num)) return acc;
    tmp[i] = acc;
    return f.mul(acc, num);
  }, f.ONE);
  // Invert last element
  const inverted = f.inv(lastMultiplied);
  // Walk from last to first, multiply them by inverted each other MOD p
  nums.reduceRight((acc, num, i) => {
    if (f.is0(num)) return acc;
    tmp[i] = f.mul(acc, tmp[i]);
    return f.mul(acc, num);
  }, inverted);
  return tmp;
}
// CURVE.n lengths
function nLength(n, nBitLength) {
  // Bit size, byte size of CURVE.n
  const _nBitLength = nBitLength !== undefined ? nBitLength : n.toString(2).length;
  const nByteLength = Math.ceil(_nBitLength / 8);
  return {
    nBitLength: _nBitLength,
    nByteLength
  };
}
/**
 * Initializes a finite field over prime. **Non-primes are not supported.**
 * Do not init in loop: slow. Very fragile: always run a benchmark on a change.
 * Major performance optimizations:
 * * a) denormalized operations like mulN instead of mul
 * * b) same object shape: never add or remove keys
 * * c) Object.freeze
 * NOTE: operations don't check 'isValid' for all elements for performance reasons,
 * it is caller responsibility to check this.
 * This is low-level code, please make sure you know what you doing.
 * @param ORDER prime positive bigint
 * @param bitLen how many bits the field consumes
 * @param isLE (def: false) if encoding / decoding should be in little-endian
 * @param redef optional faster redefinitions of sqrt and other methods
 */
function Field(ORDER, bitLen, isLE = false, redef = {}) {
  if (ORDER <= _0n$2) throw new Error(`Expected Field ORDER > 0, got ${ORDER}`);
  const {
    nBitLength: BITS,
    nByteLength: BYTES
  } = nLength(ORDER, bitLen);
  if (BYTES > 2048) throw new Error('Field lengths over 2048 bytes are not supported');
  const sqrtP = FpSqrt(ORDER);
  const f = Object.freeze({
    ORDER,
    BITS,
    BYTES,
    MASK: bitMask(BITS),
    ZERO: _0n$2,
    ONE: _1n$3,
    create: num => mod(num, ORDER),
    isValid: num => {
      if (typeof num !== 'bigint') throw new Error(`Invalid field element: expected bigint, got ${typeof num}`);
      return _0n$2 <= num && num < ORDER; // 0 is valid element, but it's not invertible
    },
    is0: num => num === _0n$2,
    isOdd: num => (num & _1n$3) === _1n$3,
    neg: num => mod(-num, ORDER),
    eql: (lhs, rhs) => lhs === rhs,
    sqr: num => mod(num * num, ORDER),
    add: (lhs, rhs) => mod(lhs + rhs, ORDER),
    sub: (lhs, rhs) => mod(lhs - rhs, ORDER),
    mul: (lhs, rhs) => mod(lhs * rhs, ORDER),
    pow: (num, power) => FpPow(f, num, power),
    div: (lhs, rhs) => mod(lhs * invert(rhs, ORDER), ORDER),
    // Same as above, but doesn't normalize
    sqrN: num => num * num,
    addN: (lhs, rhs) => lhs + rhs,
    subN: (lhs, rhs) => lhs - rhs,
    mulN: (lhs, rhs) => lhs * rhs,
    inv: num => invert(num, ORDER),
    sqrt: redef.sqrt || (n => sqrtP(f, n)),
    invertBatch: lst => FpInvertBatch(f, lst),
    // TODO: do we really need constant cmov?
    // We don't have const-time bigints anyway, so probably will be not very useful
    cmov: (a, b, c) => c ? b : a,
    toBytes: num => isLE ? numberToBytesLE(num, BYTES) : numberToBytesBE(num, BYTES),
    fromBytes: bytes => {
      if (bytes.length !== BYTES) throw new Error(`Fp.fromBytes: expected ${BYTES}, got ${bytes.length}`);
      return isLE ? bytesToNumberLE(bytes) : bytesToNumberBE(bytes);
    }
  });
  return Object.freeze(f);
}
/**
 * Returns total number of bytes consumed by the field element.
 * For example, 32 bytes for usual 256-bit weierstrass curve.
 * @param fieldOrder number of field elements, usually CURVE.n
 * @returns byte length of field
 */
function getFieldBytesLength(fieldOrder) {
  if (typeof fieldOrder !== 'bigint') throw new Error('field order must be bigint');
  const bitLength = fieldOrder.toString(2).length;
  return Math.ceil(bitLength / 8);
}
/**
 * Returns minimal amount of bytes that can be safely reduced
 * by field order.
 * Should be 2^-128 for 128-bit curve such as P256.
 * @param fieldOrder number of field elements, usually CURVE.n
 * @returns byte length of target hash
 */
function getMinHashLength(fieldOrder) {
  const length = getFieldBytesLength(fieldOrder);
  return length + Math.ceil(length / 2);
}
/**
 * "Constant-time" private key generation utility.
 * Can take (n + n/2) or more bytes of uniform input e.g. from CSPRNG or KDF
 * and convert them into private scalar, with the modulo bias being negligible.
 * Needs at least 48 bytes of input for 32-byte private key.
 * https://research.kudelskisecurity.com/2020/07/28/the-definitive-guide-to-modulo-bias-and-how-to-avoid-it/
 * FIPS 186-5, A.2 https://csrc.nist.gov/publications/detail/fips/186/5/final
 * RFC 9380, https://www.rfc-editor.org/rfc/rfc9380#section-5
 * @param hash hash output from SHA3 or a similar function
 * @param groupOrder size of subgroup - (e.g. secp256k1.CURVE.n)
 * @param isLE interpret hash bytes as LE num
 * @returns valid private scalar
 */
function mapHashToField(key, fieldOrder, isLE = false) {
  const len = key.length;
  const fieldLen = getFieldBytesLength(fieldOrder);
  const minLen = getMinHashLength(fieldOrder);
  // No small numbers: need to understand bias story. No huge numbers: easier to detect JS timings.
  if (len < 16 || len < minLen || len > 1024) throw new Error(`expected ${minLen}-1024 bytes of input, got ${len}`);
  const num = isLE ? bytesToNumberBE(key) : bytesToNumberLE(key);
  // `mod(x, 11)` can sometimes produce 0. `mod(x, 10) + 1` is the same, but no 0
  const reduced = mod(num, fieldOrder - _1n$3) + _1n$3;
  return isLE ? numberToBytesLE(reduced, fieldLen) : numberToBytesBE(reduced, fieldLen);
}

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// Abelian group utilities
const _0n$1 = BigInt(0);
const _1n$2 = BigInt(1);
// Since points in different groups cannot be equal (different object constructor),
// we can have single place to store precomputes
const pointPrecomputes = new WeakMap();
const pointWindowSizes = new WeakMap(); // This allows use make points immutable (nothing changes inside)
// Elliptic curve multiplication of Point by scalar. Fragile.
// Scalars should always be less than curve order: this should be checked inside of a curve itself.
// Creates precomputation tables for fast multiplication:
// - private scalar is split by fixed size windows of W bits
// - every window point is collected from window's table & added to accumulator
// - since windows are different, same point inside tables won't be accessed more than once per calc
// - each multiplication is 'Math.ceil(CURVE_ORDER / 𝑊) + 1' point additions (fixed for any scalar)
// - +1 window is neccessary for wNAF
// - wNAF reduces table size: 2x less memory + 2x faster generation, but 10% slower multiplication
// TODO: Research returning 2d JS array of windows, instead of a single window. This would allow
// windows to be in different memory locations
function wNAF(c, bits) {
  const constTimeNegate = (condition, item) => {
    const neg = item.negate();
    return condition ? neg : item;
  };
  const validateW = W => {
    if (!Number.isSafeInteger(W) || W <= 0 || W > bits) throw new Error(`Wrong window size=${W}, should be [1..${bits}]`);
  };
  const opts = W => {
    validateW(W);
    const windows = Math.ceil(bits / W) + 1; // +1, because
    const windowSize = 2 ** (W - 1); // -1 because we skip zero
    return {
      windows,
      windowSize
    };
  };
  return {
    constTimeNegate,
    // non-const time multiplication ladder
    unsafeLadder(elm, n) {
      let p = c.ZERO;
      let d = elm;
      while (n > _0n$1) {
        if (n & _1n$2) p = p.add(d);
        d = d.double();
        n >>= _1n$2;
      }
      return p;
    },
    /**
     * Creates a wNAF precomputation window. Used for caching.
     * Default window size is set by `utils.precompute()` and is equal to 8.
     * Number of precomputed points depends on the curve size:
     * 2^(𝑊−1) * (Math.ceil(𝑛 / 𝑊) + 1), where:
     * - 𝑊 is the window size
     * - 𝑛 is the bitlength of the curve order.
     * For a 256-bit curve and window size 8, the number of precomputed points is 128 * 33 = 4224.
     * @returns precomputed point tables flattened to a single array
     */
    precomputeWindow(elm, W) {
      const {
        windows,
        windowSize
      } = opts(W);
      const points = [];
      let p = elm;
      let base = p;
      for (let window = 0; window < windows; window++) {
        base = p;
        points.push(base);
        // =1, because we skip zero
        for (let i = 1; i < windowSize; i++) {
          base = base.add(p);
          points.push(base);
        }
        p = base.double();
      }
      return points;
    },
    /**
     * Implements ec multiplication using precomputed tables and w-ary non-adjacent form.
     * @param W window size
     * @param precomputes precomputed tables
     * @param n scalar (we don't check here, but should be less than curve order)
     * @returns real and fake (for const-time) points
     */
    wNAF(W, precomputes, n) {
      // TODO: maybe check that scalar is less than group order? wNAF behavious is undefined otherwise
      // But need to carefully remove other checks before wNAF. ORDER == bits here
      const {
        windows,
        windowSize
      } = opts(W);
      let p = c.ZERO;
      let f = c.BASE;
      const mask = BigInt(2 ** W - 1); // Create mask with W ones: 0b1111 for W=4 etc.
      const maxNumber = 2 ** W;
      const shiftBy = BigInt(W);
      for (let window = 0; window < windows; window++) {
        const offset = window * windowSize;
        // Extract W bits.
        let wbits = Number(n & mask);
        // Shift number by W bits.
        n >>= shiftBy;
        // If the bits are bigger than max size, we'll split those.
        // +224 => 256 - 32
        if (wbits > windowSize) {
          wbits -= maxNumber;
          n += _1n$2;
        }
        // This code was first written with assumption that 'f' and 'p' will never be infinity point:
        // since each addition is multiplied by 2 ** W, it cannot cancel each other. However,
        // there is negate now: it is possible that negated element from low value
        // would be the same as high element, which will create carry into next window.
        // It's not obvious how this can fail, but still worth investigating later.
        // Check if we're onto Zero point.
        // Add random point inside current window to f.
        const offset1 = offset;
        const offset2 = offset + Math.abs(wbits) - 1; // -1 because we skip zero
        const cond1 = window % 2 !== 0;
        const cond2 = wbits < 0;
        if (wbits === 0) {
          // The most important part for const-time getPublicKey
          f = f.add(constTimeNegate(cond1, precomputes[offset1]));
        } else {
          p = p.add(constTimeNegate(cond2, precomputes[offset2]));
        }
      }
      // JIT-compiler should not eliminate f here, since it will later be used in normalizeZ()
      // Even if the variable is still unused, there are some checks which will
      // throw an exception, so compiler needs to prove they won't happen, which is hard.
      // At this point there is a way to F be infinity-point even if p is not,
      // which makes it less const-time: around 1 bigint multiply.
      return {
        p,
        f
      };
    },
    wNAFCached(P, n, transform) {
      const W = pointWindowSizes.get(P) || 1;
      // Calculate precomputes on a first run, reuse them after
      let comp = pointPrecomputes.get(P);
      if (!comp) {
        comp = this.precomputeWindow(P, W);
        if (W !== 1) pointPrecomputes.set(P, transform(comp));
      }
      return this.wNAF(W, comp, n);
    },
    // We calculate precomputes for elliptic curve point multiplication
    // using windowed method. This specifies window size and
    // stores precomputed values. Usually only base point would be precomputed.
    setWindowSize(P, W) {
      validateW(W);
      pointWindowSizes.set(P, W);
      pointPrecomputes.delete(P);
    }
  };
}
/**
 * Pippenger algorithm for multi-scalar multiplication (MSM).
 * MSM is basically (Pa + Qb + Rc + ...).
 * 30x faster vs naive addition on L=4096, 10x faster with precomputes.
 * For N=254bit, L=1, it does: 1024 ADD + 254 DBL. For L=5: 1536 ADD + 254 DBL.
 * Algorithmically constant-time (for same L), even when 1 point + scalar, or when scalar = 0.
 * @param c Curve Point constructor
 * @param field field over CURVE.N - important that it's not over CURVE.P
 * @param points array of L curve points
 * @param scalars array of L scalars (aka private keys / bigints)
 */
function pippenger(c, field, points, scalars) {
  // If we split scalars by some window (let's say 8 bits), every chunk will only
  // take 256 buckets even if there are 4096 scalars, also re-uses double.
  // TODO:
  // - https://eprint.iacr.org/2024/750.pdf
  // - https://tches.iacr.org/index.php/TCHES/article/view/10287
  // 0 is accepted in scalars
  if (!Array.isArray(points) || !Array.isArray(scalars) || scalars.length !== points.length) throw new Error('arrays of points and scalars must have equal length');
  scalars.forEach((s, i) => {
    if (!field.isValid(s)) throw new Error(`wrong scalar at index ${i}`);
  });
  points.forEach((p, i) => {
    if (!(p instanceof c)) throw new Error(`wrong point at index ${i}`);
  });
  const wbits = bitLen(BigInt(points.length));
  const windowSize = wbits > 12 ? wbits - 3 : wbits > 4 ? wbits - 2 : wbits ? 2 : 1; // in bits
  const MASK = (1 << windowSize) - 1;
  const buckets = new Array(MASK + 1).fill(c.ZERO); // +1 for zero array
  const lastBits = Math.floor((field.BITS - 1) / windowSize) * windowSize;
  let sum = c.ZERO;
  for (let i = lastBits; i >= 0; i -= windowSize) {
    buckets.fill(c.ZERO);
    for (let j = 0; j < scalars.length; j++) {
      const scalar = scalars[j];
      const wbits = Number(scalar >> BigInt(i) & BigInt(MASK));
      buckets[wbits] = buckets[wbits].add(points[j]);
    }
    let resI = c.ZERO; // not using this will do small speed-up, but will lose ct
    // Skip first bucket, because it is zero
    for (let j = buckets.length - 1, sumI = c.ZERO; j > 0; j--) {
      sumI = sumI.add(buckets[j]);
      resI = resI.add(sumI);
    }
    sum = sum.add(resI);
    if (i !== 0) for (let j = 0; j < windowSize; j++) sum = sum.double();
  }
  return sum;
}
function validateBasic(curve) {
  validateField(curve.Fp);
  validateObject(curve, {
    n: 'bigint',
    h: 'bigint',
    Gx: 'field',
    Gy: 'field'
  }, {
    nBitLength: 'isSafeInteger',
    nByteLength: 'isSafeInteger'
  });
  // Set defaults
  return Object.freeze({
    ...nLength(curve.n, curve.nBitLength),
    ...curve,
    ...{
      p: curve.Fp.ORDER
    }
  });
}

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// Short Weierstrass curve. The formula is: y² = x³ + ax + b
function validateSigVerOpts(opts) {
  if (opts.lowS !== undefined) abool('lowS', opts.lowS);
  if (opts.prehash !== undefined) abool('prehash', opts.prehash);
}
function validatePointOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(opts, {
    a: 'field',
    b: 'field'
  }, {
    allowedPrivateKeyLengths: 'array',
    wrapPrivateKey: 'boolean',
    isTorsionFree: 'function',
    clearCofactor: 'function',
    allowInfinityPoint: 'boolean',
    fromBytes: 'function',
    toBytes: 'function'
  });
  const {
    endo,
    Fp,
    a
  } = opts;
  if (endo) {
    if (!Fp.eql(a, Fp.ZERO)) {
      throw new Error('Endomorphism can only be defined for Koblitz curves that have a=0');
    }
    if (typeof endo !== 'object' || typeof endo.beta !== 'bigint' || typeof endo.splitScalar !== 'function') {
      throw new Error('Expected endomorphism with beta: bigint and splitScalar: function');
    }
  }
  return Object.freeze({
    ...opts
  });
}
const {
  bytesToNumberBE: b2n,
  hexToBytes: h2b
} = ut;
/**
 * ASN.1 DER encoding utilities. ASN is very complex & fragile. Format:
 *
 *     [0x30 (SEQUENCE), bytelength, 0x02 (INTEGER), intLength, R, 0x02 (INTEGER), intLength, S]
 *
 * Docs: https://letsencrypt.org/docs/a-warm-welcome-to-asn1-and-der/, https://luca.ntop.org/Teaching/Appunti/asn1.html
 */
const DER = {
  // asn.1 DER encoding utils
  Err: class DERErr extends Error {
    constructor(m = '') {
      super(m);
    }
  },
  // Basic building block is TLV (Tag-Length-Value)
  _tlv: {
    encode: (tag, data) => {
      const {
        Err: E
      } = DER;
      if (tag < 0 || tag > 256) throw new E('tlv.encode: wrong tag');
      if (data.length & 1) throw new E('tlv.encode: unpadded data');
      const dataLen = data.length / 2;
      const len = numberToHexUnpadded(dataLen);
      if (len.length / 2 & 128) throw new E('tlv.encode: long form length too big');
      // length of length with long form flag
      const lenLen = dataLen > 127 ? numberToHexUnpadded(len.length / 2 | 128) : '';
      return `${numberToHexUnpadded(tag)}${lenLen}${len}${data}`;
    },
    // v - value, l - left bytes (unparsed)
    decode(tag, data) {
      const {
        Err: E
      } = DER;
      let pos = 0;
      if (tag < 0 || tag > 256) throw new E('tlv.encode: wrong tag');
      if (data.length < 2 || data[pos++] !== tag) throw new E('tlv.decode: wrong tlv');
      const first = data[pos++];
      const isLong = !!(first & 128); // First bit of first length byte is flag for short/long form
      let length = 0;
      if (!isLong) length = first;else {
        // Long form: [longFlag(1bit), lengthLength(7bit), length (BE)]
        const lenLen = first & 127;
        if (!lenLen) throw new E('tlv.decode(long): indefinite length not supported');
        if (lenLen > 4) throw new E('tlv.decode(long): byte length is too big'); // this will overflow u32 in js
        const lengthBytes = data.subarray(pos, pos + lenLen);
        if (lengthBytes.length !== lenLen) throw new E('tlv.decode: length bytes not complete');
        if (lengthBytes[0] === 0) throw new E('tlv.decode(long): zero leftmost byte');
        for (const b of lengthBytes) length = length << 8 | b;
        pos += lenLen;
        if (length < 128) throw new E('tlv.decode(long): not minimal encoding');
      }
      const v = data.subarray(pos, pos + length);
      if (v.length !== length) throw new E('tlv.decode: wrong value length');
      return {
        v,
        l: data.subarray(pos + length)
      };
    }
  },
  // https://crypto.stackexchange.com/a/57734 Leftmost bit of first byte is 'negative' flag,
  // since we always use positive integers here. It must always be empty:
  // - add zero byte if exists
  // - if next byte doesn't have a flag, leading zero is not allowed (minimal encoding)
  _int: {
    encode(num) {
      const {
        Err: E
      } = DER;
      if (num < _0n) throw new E('integer: negative integers are not allowed');
      let hex = numberToHexUnpadded(num);
      // Pad with zero byte if negative flag is present
      if (Number.parseInt(hex[0], 16) & 0b1000) hex = '00' + hex;
      if (hex.length & 1) throw new E('unexpected assertion');
      return hex;
    },
    decode(data) {
      const {
        Err: E
      } = DER;
      if (data[0] & 128) throw new E('Invalid signature integer: negative');
      if (data[0] === 0x00 && !(data[1] & 128)) throw new E('Invalid signature integer: unnecessary leading zero');
      return b2n(data);
    }
  },
  toSig(hex) {
    // parse DER signature
    const {
      Err: E,
      _int: int,
      _tlv: tlv
    } = DER;
    const data = typeof hex === 'string' ? h2b(hex) : hex;
    abytes(data);
    const {
      v: seqBytes,
      l: seqLeftBytes
    } = tlv.decode(0x30, data);
    if (seqLeftBytes.length) throw new E('Invalid signature: left bytes after parsing');
    const {
      v: rBytes,
      l: rLeftBytes
    } = tlv.decode(0x02, seqBytes);
    const {
      v: sBytes,
      l: sLeftBytes
    } = tlv.decode(0x02, rLeftBytes);
    if (sLeftBytes.length) throw new E('Invalid signature: left bytes after parsing');
    return {
      r: int.decode(rBytes),
      s: int.decode(sBytes)
    };
  },
  hexFromSig(sig) {
    const {
      _tlv: tlv,
      _int: int
    } = DER;
    const seq = `${tlv.encode(0x02, int.encode(sig.r))}${tlv.encode(0x02, int.encode(sig.s))}`;
    return tlv.encode(0x30, seq);
  }
};
// Be friendly to bad ECMAScript parsers by not using bigint literals
// prettier-ignore
const _0n = BigInt(0),
  _1n$1 = BigInt(1);
  BigInt(2);
  const _3n = BigInt(3);
  BigInt(4);
function weierstrassPoints(opts) {
  const CURVE = validatePointOpts(opts);
  const {
    Fp
  } = CURVE; // All curves has same field / group length as for now, but they can differ
  const Fn = Field(CURVE.n, CURVE.nBitLength);
  const toBytes = CURVE.toBytes || ((_c, point, _isCompressed) => {
    const a = point.toAffine();
    return concatBytes(Uint8Array.from([0x04]), Fp.toBytes(a.x), Fp.toBytes(a.y));
  });
  const fromBytes = CURVE.fromBytes || (bytes => {
    // const head = bytes[0];
    const tail = bytes.subarray(1);
    // if (head !== 0x04) throw new Error('Only non-compressed encoding is supported');
    const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
    const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
    return {
      x,
      y
    };
  });
  /**
   * y² = x³ + ax + b: Short weierstrass curve formula
   * @returns y²
   */
  function weierstrassEquation(x) {
    const {
      a,
      b
    } = CURVE;
    const x2 = Fp.sqr(x); // x * x
    const x3 = Fp.mul(x2, x); // x2 * x
    return Fp.add(Fp.add(x3, Fp.mul(x, a)), b); // x3 + a * x + b
  }
  // Validate whether the passed curve params are valid.
  // We check if curve equation works for generator point.
  // `assertValidity()` won't work: `isTorsionFree()` is not available at this point in bls12-381.
  // ProjectivePoint class has not been initialized yet.
  if (!Fp.eql(Fp.sqr(CURVE.Gy), weierstrassEquation(CURVE.Gx))) throw new Error('bad generator point: equation left != right');
  // Valid group elements reside in range 1..n-1
  function isWithinCurveOrder(num) {
    return inRange(num, _1n$1, CURVE.n);
  }
  // Validates if priv key is valid and converts it to bigint.
  // Supports options allowedPrivateKeyLengths and wrapPrivateKey.
  function normPrivateKeyToScalar(key) {
    const {
      allowedPrivateKeyLengths: lengths,
      nByteLength,
      wrapPrivateKey,
      n: N
    } = CURVE;
    if (lengths && typeof key !== 'bigint') {
      if (isBytes(key)) key = bytesToHex(key);
      // Normalize to hex string, pad. E.g. P521 would norm 130-132 char hex to 132-char bytes
      if (typeof key !== 'string' || !lengths.includes(key.length)) throw new Error('Invalid key');
      key = key.padStart(nByteLength * 2, '0');
    }
    let num;
    try {
      num = typeof key === 'bigint' ? key : bytesToNumberBE(ensureBytes('private key', key, nByteLength));
    } catch (error) {
      throw new Error(`private key must be ${nByteLength} bytes, hex or bigint, not ${typeof key}`);
    }
    if (wrapPrivateKey) num = mod(num, N); // disabled by default, enabled for BLS
    aInRange('private key', num, _1n$1, N); // num in range [1..N-1]
    return num;
  }
  function assertPrjPoint(other) {
    if (!(other instanceof Point)) throw new Error('ProjectivePoint expected');
  }
  // Memoized toAffine / validity check. They are heavy. Points are immutable.
  // Converts Projective point to affine (x, y) coordinates.
  // Can accept precomputed Z^-1 - for example, from invertBatch.
  // (x, y, z) ∋ (x=x/z, y=y/z)
  const toAffineMemo = memoized((p, iz) => {
    const {
      px: x,
      py: y,
      pz: z
    } = p;
    // Fast-path for normalized points
    if (Fp.eql(z, Fp.ONE)) return {
      x,
      y
    };
    const is0 = p.is0();
    // If invZ was 0, we return zero point. However we still want to execute
    // all operations, so we replace invZ with a random number, 1.
    if (iz == null) iz = is0 ? Fp.ONE : Fp.inv(z);
    const ax = Fp.mul(x, iz);
    const ay = Fp.mul(y, iz);
    const zz = Fp.mul(z, iz);
    if (is0) return {
      x: Fp.ZERO,
      y: Fp.ZERO
    };
    if (!Fp.eql(zz, Fp.ONE)) throw new Error('invZ was invalid');
    return {
      x: ax,
      y: ay
    };
  });
  // NOTE: on exception this will crash 'cached' and no value will be set.
  // Otherwise true will be return
  const assertValidMemo = memoized(p => {
    if (p.is0()) {
      // (0, 1, 0) aka ZERO is invalid in most contexts.
      // In BLS, ZERO can be serialized, so we allow it.
      // (0, 0, 0) is wrong representation of ZERO and is always invalid.
      if (CURVE.allowInfinityPoint && !Fp.is0(p.py)) return;
      throw new Error('bad point: ZERO');
    }
    // Some 3rd-party test vectors require different wording between here & `fromCompressedHex`
    const {
      x,
      y
    } = p.toAffine();
    // Check if x, y are valid field elements
    if (!Fp.isValid(x) || !Fp.isValid(y)) throw new Error('bad point: x or y not FE');
    const left = Fp.sqr(y); // y²
    const right = weierstrassEquation(x); // x³ + ax + b
    if (!Fp.eql(left, right)) throw new Error('bad point: equation left != right');
    if (!p.isTorsionFree()) throw new Error('bad point: not in prime-order subgroup');
    return true;
  });
  /**
   * Projective Point works in 3d / projective (homogeneous) coordinates: (x, y, z) ∋ (x=x/z, y=y/z)
   * Default Point works in 2d / affine coordinates: (x, y)
   * We're doing calculations in projective, because its operations don't require costly inversion.
   */
  class Point {
    constructor(px, py, pz) {
      this.px = px;
      this.py = py;
      this.pz = pz;
      if (px == null || !Fp.isValid(px)) throw new Error('x required');
      if (py == null || !Fp.isValid(py)) throw new Error('y required');
      if (pz == null || !Fp.isValid(pz)) throw new Error('z required');
      Object.freeze(this);
    }
    // Does not validate if the point is on-curve.
    // Use fromHex instead, or call assertValidity() later.
    static fromAffine(p) {
      const {
        x,
        y
      } = p || {};
      if (!p || !Fp.isValid(x) || !Fp.isValid(y)) throw new Error('invalid affine point');
      if (p instanceof Point) throw new Error('projective point not allowed');
      const is0 = i => Fp.eql(i, Fp.ZERO);
      // fromAffine(x:0, y:0) would produce (x:0, y:0, z:1), but we need (x:0, y:1, z:0)
      if (is0(x) && is0(y)) return Point.ZERO;
      return new Point(x, y, Fp.ONE);
    }
    get x() {
      return this.toAffine().x;
    }
    get y() {
      return this.toAffine().y;
    }
    /**
     * Takes a bunch of Projective Points but executes only one
     * inversion on all of them. Inversion is very slow operation,
     * so this improves performance massively.
     * Optimization: converts a list of projective points to a list of identical points with Z=1.
     */
    static normalizeZ(points) {
      const toInv = Fp.invertBatch(points.map(p => p.pz));
      return points.map((p, i) => p.toAffine(toInv[i])).map(Point.fromAffine);
    }
    /**
     * Converts hash string or Uint8Array to Point.
     * @param hex short/long ECDSA hex
     */
    static fromHex(hex) {
      const P = Point.fromAffine(fromBytes(ensureBytes('pointHex', hex)));
      P.assertValidity();
      return P;
    }
    // Multiplies generator point by privateKey.
    static fromPrivateKey(privateKey) {
      return Point.BASE.multiply(normPrivateKeyToScalar(privateKey));
    }
    // Multiscalar Multiplication
    static msm(points, scalars) {
      return pippenger(Point, Fn, points, scalars);
    }
    // "Private method", don't use it directly
    _setWindowSize(windowSize) {
      wnaf.setWindowSize(this, windowSize);
    }
    // A point on curve is valid if it conforms to equation.
    assertValidity() {
      assertValidMemo(this);
    }
    hasEvenY() {
      const {
        y
      } = this.toAffine();
      if (Fp.isOdd) return !Fp.isOdd(y);
      throw new Error("Field doesn't support isOdd");
    }
    /**
     * Compare one point to another.
     */
    equals(other) {
      assertPrjPoint(other);
      const {
        px: X1,
        py: Y1,
        pz: Z1
      } = this;
      const {
        px: X2,
        py: Y2,
        pz: Z2
      } = other;
      const U1 = Fp.eql(Fp.mul(X1, Z2), Fp.mul(X2, Z1));
      const U2 = Fp.eql(Fp.mul(Y1, Z2), Fp.mul(Y2, Z1));
      return U1 && U2;
    }
    /**
     * Flips point to one corresponding to (x, -y) in Affine coordinates.
     */
    negate() {
      return new Point(this.px, Fp.neg(this.py), this.pz);
    }
    // Renes-Costello-Batina exception-free doubling formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 3
    // Cost: 8M + 3S + 3*a + 2*b3 + 15add.
    double() {
      const {
        a,
        b
      } = CURVE;
      const b3 = Fp.mul(b, _3n);
      const {
        px: X1,
        py: Y1,
        pz: Z1
      } = this;
      let X3 = Fp.ZERO,
        Y3 = Fp.ZERO,
        Z3 = Fp.ZERO; // prettier-ignore
      let t0 = Fp.mul(X1, X1); // step 1
      let t1 = Fp.mul(Y1, Y1);
      let t2 = Fp.mul(Z1, Z1);
      let t3 = Fp.mul(X1, Y1);
      t3 = Fp.add(t3, t3); // step 5
      Z3 = Fp.mul(X1, Z1);
      Z3 = Fp.add(Z3, Z3);
      X3 = Fp.mul(a, Z3);
      Y3 = Fp.mul(b3, t2);
      Y3 = Fp.add(X3, Y3); // step 10
      X3 = Fp.sub(t1, Y3);
      Y3 = Fp.add(t1, Y3);
      Y3 = Fp.mul(X3, Y3);
      X3 = Fp.mul(t3, X3);
      Z3 = Fp.mul(b3, Z3); // step 15
      t2 = Fp.mul(a, t2);
      t3 = Fp.sub(t0, t2);
      t3 = Fp.mul(a, t3);
      t3 = Fp.add(t3, Z3);
      Z3 = Fp.add(t0, t0); // step 20
      t0 = Fp.add(Z3, t0);
      t0 = Fp.add(t0, t2);
      t0 = Fp.mul(t0, t3);
      Y3 = Fp.add(Y3, t0);
      t2 = Fp.mul(Y1, Z1); // step 25
      t2 = Fp.add(t2, t2);
      t0 = Fp.mul(t2, t3);
      X3 = Fp.sub(X3, t0);
      Z3 = Fp.mul(t2, t1);
      Z3 = Fp.add(Z3, Z3); // step 30
      Z3 = Fp.add(Z3, Z3);
      return new Point(X3, Y3, Z3);
    }
    // Renes-Costello-Batina exception-free addition formula.
    // There is 30% faster Jacobian formula, but it is not complete.
    // https://eprint.iacr.org/2015/1060, algorithm 1
    // Cost: 12M + 0S + 3*a + 3*b3 + 23add.
    add(other) {
      assertPrjPoint(other);
      const {
        px: X1,
        py: Y1,
        pz: Z1
      } = this;
      const {
        px: X2,
        py: Y2,
        pz: Z2
      } = other;
      let X3 = Fp.ZERO,
        Y3 = Fp.ZERO,
        Z3 = Fp.ZERO; // prettier-ignore
      const a = CURVE.a;
      const b3 = Fp.mul(CURVE.b, _3n);
      let t0 = Fp.mul(X1, X2); // step 1
      let t1 = Fp.mul(Y1, Y2);
      let t2 = Fp.mul(Z1, Z2);
      let t3 = Fp.add(X1, Y1);
      let t4 = Fp.add(X2, Y2); // step 5
      t3 = Fp.mul(t3, t4);
      t4 = Fp.add(t0, t1);
      t3 = Fp.sub(t3, t4);
      t4 = Fp.add(X1, Z1);
      let t5 = Fp.add(X2, Z2); // step 10
      t4 = Fp.mul(t4, t5);
      t5 = Fp.add(t0, t2);
      t4 = Fp.sub(t4, t5);
      t5 = Fp.add(Y1, Z1);
      X3 = Fp.add(Y2, Z2); // step 15
      t5 = Fp.mul(t5, X3);
      X3 = Fp.add(t1, t2);
      t5 = Fp.sub(t5, X3);
      Z3 = Fp.mul(a, t4);
      X3 = Fp.mul(b3, t2); // step 20
      Z3 = Fp.add(X3, Z3);
      X3 = Fp.sub(t1, Z3);
      Z3 = Fp.add(t1, Z3);
      Y3 = Fp.mul(X3, Z3);
      t1 = Fp.add(t0, t0); // step 25
      t1 = Fp.add(t1, t0);
      t2 = Fp.mul(a, t2);
      t4 = Fp.mul(b3, t4);
      t1 = Fp.add(t1, t2);
      t2 = Fp.sub(t0, t2); // step 30
      t2 = Fp.mul(a, t2);
      t4 = Fp.add(t4, t2);
      t0 = Fp.mul(t1, t4);
      Y3 = Fp.add(Y3, t0);
      t0 = Fp.mul(t5, t4); // step 35
      X3 = Fp.mul(t3, X3);
      X3 = Fp.sub(X3, t0);
      t0 = Fp.mul(t3, t1);
      Z3 = Fp.mul(t5, Z3);
      Z3 = Fp.add(Z3, t0); // step 40
      return new Point(X3, Y3, Z3);
    }
    subtract(other) {
      return this.add(other.negate());
    }
    is0() {
      return this.equals(Point.ZERO);
    }
    wNAF(n) {
      return wnaf.wNAFCached(this, n, Point.normalizeZ);
    }
    /**
     * Non-constant-time multiplication. Uses double-and-add algorithm.
     * It's faster, but should only be used when you don't care about
     * an exposed private key e.g. sig verification, which works over *public* keys.
     */
    multiplyUnsafe(sc) {
      aInRange('scalar', sc, _0n, CURVE.n);
      const I = Point.ZERO;
      if (sc === _0n) return I;
      if (sc === _1n$1) return this;
      const {
        endo
      } = CURVE;
      if (!endo) return wnaf.unsafeLadder(this, sc);
      // Apply endomorphism
      let {
        k1neg,
        k1,
        k2neg,
        k2
      } = endo.splitScalar(sc);
      let k1p = I;
      let k2p = I;
      let d = this;
      while (k1 > _0n || k2 > _0n) {
        if (k1 & _1n$1) k1p = k1p.add(d);
        if (k2 & _1n$1) k2p = k2p.add(d);
        d = d.double();
        k1 >>= _1n$1;
        k2 >>= _1n$1;
      }
      if (k1neg) k1p = k1p.negate();
      if (k2neg) k2p = k2p.negate();
      k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
      return k1p.add(k2p);
    }
    /**
     * Constant time multiplication.
     * Uses wNAF method. Windowed method may be 10% faster,
     * but takes 2x longer to generate and consumes 2x memory.
     * Uses precomputes when available.
     * Uses endomorphism for Koblitz curves.
     * @param scalar by which the point would be multiplied
     * @returns New point
     */
    multiply(scalar) {
      const {
        endo,
        n: N
      } = CURVE;
      aInRange('scalar', scalar, _1n$1, N);
      let point, fake; // Fake point is used to const-time mult
      if (endo) {
        const {
          k1neg,
          k1,
          k2neg,
          k2
        } = endo.splitScalar(scalar);
        let {
          p: k1p,
          f: f1p
        } = this.wNAF(k1);
        let {
          p: k2p,
          f: f2p
        } = this.wNAF(k2);
        k1p = wnaf.constTimeNegate(k1neg, k1p);
        k2p = wnaf.constTimeNegate(k2neg, k2p);
        k2p = new Point(Fp.mul(k2p.px, endo.beta), k2p.py, k2p.pz);
        point = k1p.add(k2p);
        fake = f1p.add(f2p);
      } else {
        const {
          p,
          f
        } = this.wNAF(scalar);
        point = p;
        fake = f;
      }
      // Normalize `z` for both points, but return only real one
      return Point.normalizeZ([point, fake])[0];
    }
    /**
     * Efficiently calculate `aP + bQ`. Unsafe, can expose private key, if used incorrectly.
     * Not using Strauss-Shamir trick: precomputation tables are faster.
     * The trick could be useful if both P and Q are not G (not in our case).
     * @returns non-zero affine point
     */
    multiplyAndAddUnsafe(Q, a, b) {
      const G = Point.BASE; // No Strauss-Shamir trick: we have 10% faster G precomputes
      const mul = (P, a // Select faster multiply() method
      ) => a === _0n || a === _1n$1 || !P.equals(G) ? P.multiplyUnsafe(a) : P.multiply(a);
      const sum = mul(this, a).add(mul(Q, b));
      return sum.is0() ? undefined : sum;
    }
    // Converts Projective point to affine (x, y) coordinates.
    // Can accept precomputed Z^-1 - for example, from invertBatch.
    // (x, y, z) ∋ (x=x/z, y=y/z)
    toAffine(iz) {
      return toAffineMemo(this, iz);
    }
    isTorsionFree() {
      const {
        h: cofactor,
        isTorsionFree
      } = CURVE;
      if (cofactor === _1n$1) return true; // No subgroups, always torsion-free
      if (isTorsionFree) return isTorsionFree(Point, this);
      throw new Error('isTorsionFree() has not been declared for the elliptic curve');
    }
    clearCofactor() {
      const {
        h: cofactor,
        clearCofactor
      } = CURVE;
      if (cofactor === _1n$1) return this; // Fast-path
      if (clearCofactor) return clearCofactor(Point, this);
      return this.multiplyUnsafe(CURVE.h);
    }
    toRawBytes(isCompressed = true) {
      abool('isCompressed', isCompressed);
      this.assertValidity();
      return toBytes(Point, this, isCompressed);
    }
    toHex(isCompressed = true) {
      abool('isCompressed', isCompressed);
      return bytesToHex(this.toRawBytes(isCompressed));
    }
  }
  Point.BASE = new Point(CURVE.Gx, CURVE.Gy, Fp.ONE);
  Point.ZERO = new Point(Fp.ZERO, Fp.ONE, Fp.ZERO);
  const _bits = CURVE.nBitLength;
  const wnaf = wNAF(Point, CURVE.endo ? Math.ceil(_bits / 2) : _bits);
  // Validate if generator point is on curve
  return {
    CURVE,
    ProjectivePoint: Point,
    normPrivateKeyToScalar,
    weierstrassEquation,
    isWithinCurveOrder
  };
}
function validateOpts(curve) {
  const opts = validateBasic(curve);
  validateObject(opts, {
    hash: 'hash',
    hmac: 'function',
    randomBytes: 'function'
  }, {
    bits2int: 'function',
    bits2int_modN: 'function',
    lowS: 'boolean'
  });
  return Object.freeze({
    lowS: true,
    ...opts
  });
}
/**
 * Creates short weierstrass curve and ECDSA signature methods for it.
 * @example
 * import { Field } from '@noble/curves/abstract/modular';
 * // Before that, define BigInt-s: a, b, p, n, Gx, Gy
 * const curve = weierstrass({ a, b, Fp: Field(p), n, Gx, Gy, h: 1n })
 */
function weierstrass(curveDef) {
  const CURVE = validateOpts(curveDef);
  const {
    Fp,
    n: CURVE_ORDER
  } = CURVE;
  const compressedLen = Fp.BYTES + 1; // e.g. 33 for 32
  const uncompressedLen = 2 * Fp.BYTES + 1; // e.g. 65 for 32
  function modN(a) {
    return mod(a, CURVE_ORDER);
  }
  function invN(a) {
    return invert(a, CURVE_ORDER);
  }
  const {
    ProjectivePoint: Point,
    normPrivateKeyToScalar,
    weierstrassEquation,
    isWithinCurveOrder
  } = weierstrassPoints({
    ...CURVE,
    toBytes(_c, point, isCompressed) {
      const a = point.toAffine();
      const x = Fp.toBytes(a.x);
      const cat = concatBytes;
      abool('isCompressed', isCompressed);
      if (isCompressed) {
        return cat(Uint8Array.from([point.hasEvenY() ? 0x02 : 0x03]), x);
      } else {
        return cat(Uint8Array.from([0x04]), x, Fp.toBytes(a.y));
      }
    },
    fromBytes(bytes) {
      const len = bytes.length;
      const head = bytes[0];
      const tail = bytes.subarray(1);
      // this.assertValidity() is done inside of fromHex
      if (len === compressedLen && (head === 0x02 || head === 0x03)) {
        const x = bytesToNumberBE(tail);
        if (!inRange(x, _1n$1, Fp.ORDER)) throw new Error('Point is not on curve');
        const y2 = weierstrassEquation(x); // y² = x³ + ax + b
        let y;
        try {
          y = Fp.sqrt(y2); // y = y² ^ (p+1)/4
        } catch (sqrtError) {
          const suffix = sqrtError instanceof Error ? ': ' + sqrtError.message : '';
          throw new Error('Point is not on curve' + suffix);
        }
        const isYOdd = (y & _1n$1) === _1n$1;
        // ECDSA
        const isHeadOdd = (head & 1) === 1;
        if (isHeadOdd !== isYOdd) y = Fp.neg(y);
        return {
          x,
          y
        };
      } else if (len === uncompressedLen && head === 0x04) {
        const x = Fp.fromBytes(tail.subarray(0, Fp.BYTES));
        const y = Fp.fromBytes(tail.subarray(Fp.BYTES, 2 * Fp.BYTES));
        return {
          x,
          y
        };
      } else {
        throw new Error(`Point of length ${len} was invalid. Expected ${compressedLen} compressed bytes or ${uncompressedLen} uncompressed bytes`);
      }
    }
  });
  const numToNByteStr = num => bytesToHex(numberToBytesBE(num, CURVE.nByteLength));
  function isBiggerThanHalfOrder(number) {
    const HALF = CURVE_ORDER >> _1n$1;
    return number > HALF;
  }
  function normalizeS(s) {
    return isBiggerThanHalfOrder(s) ? modN(-s) : s;
  }
  // slice bytes num
  const slcNum = (b, from, to) => bytesToNumberBE(b.slice(from, to));
  /**
   * ECDSA signature with its (r, s) properties. Supports DER & compact representations.
   */
  class Signature {
    constructor(r, s, recovery) {
      this.r = r;
      this.s = s;
      this.recovery = recovery;
      this.assertValidity();
    }
    // pair (bytes of r, bytes of s)
    static fromCompact(hex) {
      const l = CURVE.nByteLength;
      hex = ensureBytes('compactSignature', hex, l * 2);
      return new Signature(slcNum(hex, 0, l), slcNum(hex, l, 2 * l));
    }
    // DER encoded ECDSA signature
    // https://bitcoin.stackexchange.com/questions/57644/what-are-the-parts-of-a-bitcoin-transaction-input-script
    static fromDER(hex) {
      const {
        r,
        s
      } = DER.toSig(ensureBytes('DER', hex));
      return new Signature(r, s);
    }
    assertValidity() {
      aInRange('r', this.r, _1n$1, CURVE_ORDER); // r in [1..N]
      aInRange('s', this.s, _1n$1, CURVE_ORDER); // s in [1..N]
    }
    addRecoveryBit(recovery) {
      return new Signature(this.r, this.s, recovery);
    }
    recoverPublicKey(msgHash) {
      const {
        r,
        s,
        recovery: rec
      } = this;
      const h = bits2int_modN(ensureBytes('msgHash', msgHash)); // Truncate hash
      if (rec == null || ![0, 1, 2, 3].includes(rec)) throw new Error('recovery id invalid');
      const radj = rec === 2 || rec === 3 ? r + CURVE.n : r;
      if (radj >= Fp.ORDER) throw new Error('recovery id 2 or 3 invalid');
      const prefix = (rec & 1) === 0 ? '02' : '03';
      const R = Point.fromHex(prefix + numToNByteStr(radj));
      const ir = invN(radj); // r^-1
      const u1 = modN(-h * ir); // -hr^-1
      const u2 = modN(s * ir); // sr^-1
      const Q = Point.BASE.multiplyAndAddUnsafe(R, u1, u2); // (sr^-1)R-(hr^-1)G = -(hr^-1)G + (sr^-1)
      if (!Q) throw new Error('point at infinify'); // unsafe is fine: no priv data leaked
      Q.assertValidity();
      return Q;
    }
    // Signatures should be low-s, to prevent malleability.
    hasHighS() {
      return isBiggerThanHalfOrder(this.s);
    }
    normalizeS() {
      return this.hasHighS() ? new Signature(this.r, modN(-this.s), this.recovery) : this;
    }
    // DER-encoded
    toDERRawBytes() {
      return hexToBytes(this.toDERHex());
    }
    toDERHex() {
      return DER.hexFromSig({
        r: this.r,
        s: this.s
      });
    }
    // padded bytes of r, then padded bytes of s
    toCompactRawBytes() {
      return hexToBytes(this.toCompactHex());
    }
    toCompactHex() {
      return numToNByteStr(this.r) + numToNByteStr(this.s);
    }
  }
  const utils = {
    isValidPrivateKey(privateKey) {
      try {
        normPrivateKeyToScalar(privateKey);
        return true;
      } catch (error) {
        return false;
      }
    },
    normPrivateKeyToScalar: normPrivateKeyToScalar,
    /**
     * Produces cryptographically secure private key from random of size
     * (groupLen + ceil(groupLen / 2)) with modulo bias being negligible.
     */
    randomPrivateKey: () => {
      const length = getMinHashLength(CURVE.n);
      return mapHashToField(CURVE.randomBytes(length), CURVE.n);
    },
    /**
     * Creates precompute table for an arbitrary EC point. Makes point "cached".
     * Allows to massively speed-up `point.multiply(scalar)`.
     * @returns cached point
     * @example
     * const fast = utils.precompute(8, ProjectivePoint.fromHex(someonesPubKey));
     * fast.multiply(privKey); // much faster ECDH now
     */
    precompute(windowSize = 8, point = Point.BASE) {
      point._setWindowSize(windowSize);
      point.multiply(BigInt(3)); // 3 is arbitrary, just need any number here
      return point;
    }
  };
  /**
   * Computes public key for a private key. Checks for validity of the private key.
   * @param privateKey private key
   * @param isCompressed whether to return compact (default), or full key
   * @returns Public key, full when isCompressed=false; short when isCompressed=true
   */
  function getPublicKey(privateKey, isCompressed = true) {
    return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
  }
  /**
   * Quick and dirty check for item being public key. Does not validate hex, or being on-curve.
   */
  function isProbPub(item) {
    const arr = isBytes(item);
    const str = typeof item === 'string';
    const len = (arr || str) && item.length;
    if (arr) return len === compressedLen || len === uncompressedLen;
    if (str) return len === 2 * compressedLen || len === 2 * uncompressedLen;
    if (item instanceof Point) return true;
    return false;
  }
  /**
   * ECDH (Elliptic Curve Diffie Hellman).
   * Computes shared public key from private key and public key.
   * Checks: 1) private key validity 2) shared key is on-curve.
   * Does NOT hash the result.
   * @param privateA private key
   * @param publicB different public key
   * @param isCompressed whether to return compact (default), or full key
   * @returns shared public key
   */
  function getSharedSecret(privateA, publicB, isCompressed = true) {
    if (isProbPub(privateA)) throw new Error('first arg must be private key');
    if (!isProbPub(publicB)) throw new Error('second arg must be public key');
    const b = Point.fromHex(publicB); // check for being on-curve
    return b.multiply(normPrivateKeyToScalar(privateA)).toRawBytes(isCompressed);
  }
  // RFC6979: ensure ECDSA msg is X bytes and < N. RFC suggests optional truncating via bits2octets.
  // FIPS 186-4 4.6 suggests the leftmost min(nBitLen, outLen) bits, which matches bits2int.
  // bits2int can produce res>N, we can do mod(res, N) since the bitLen is the same.
  // int2octets can't be used; pads small msgs with 0: unacceptatble for trunc as per RFC vectors
  const bits2int = CURVE.bits2int || function (bytes) {
    // For curves with nBitLength % 8 !== 0: bits2octets(bits2octets(m)) !== bits2octets(m)
    // for some cases, since bytes.length * 8 is not actual bitLength.
    const num = bytesToNumberBE(bytes); // check for == u8 done here
    const delta = bytes.length * 8 - CURVE.nBitLength; // truncate to nBitLength leftmost bits
    return delta > 0 ? num >> BigInt(delta) : num;
  };
  const bits2int_modN = CURVE.bits2int_modN || function (bytes) {
    return modN(bits2int(bytes)); // can't use bytesToNumberBE here
  };
  // NOTE: pads output with zero as per spec
  const ORDER_MASK = bitMask(CURVE.nBitLength);
  /**
   * Converts to bytes. Checks if num in `[0..ORDER_MASK-1]` e.g.: `[0..2^256-1]`.
   */
  function int2octets(num) {
    aInRange(`num < 2^${CURVE.nBitLength}`, num, _0n, ORDER_MASK);
    // works with order, can have different size than numToField!
    return numberToBytesBE(num, CURVE.nByteLength);
  }
  // Steps A, D of RFC6979 3.2
  // Creates RFC6979 seed; converts msg/privKey to numbers.
  // Used only in sign, not in verify.
  // NOTE: we cannot assume here that msgHash has same amount of bytes as curve order, this will be wrong at least for P521.
  // Also it can be bigger for P224 + SHA256
  function prepSig(msgHash, privateKey, opts = defaultSigOpts) {
    if (['recovered', 'canonical'].some(k => k in opts)) throw new Error('sign() legacy options not supported');
    const {
      hash,
      randomBytes
    } = CURVE;
    let {
      lowS,
      prehash,
      extraEntropy: ent
    } = opts; // generates low-s sigs by default
    if (lowS == null) lowS = true; // RFC6979 3.2: we skip step A, because we already provide hash
    msgHash = ensureBytes('msgHash', msgHash);
    validateSigVerOpts(opts);
    if (prehash) msgHash = ensureBytes('prehashed msgHash', hash(msgHash));
    // We can't later call bits2octets, since nested bits2int is broken for curves
    // with nBitLength % 8 !== 0. Because of that, we unwrap it here as int2octets call.
    // const bits2octets = (bits) => int2octets(bits2int_modN(bits))
    const h1int = bits2int_modN(msgHash);
    const d = normPrivateKeyToScalar(privateKey); // validate private key, convert to bigint
    const seedArgs = [int2octets(d), int2octets(h1int)];
    // extraEntropy. RFC6979 3.6: additional k' (optional).
    if (ent != null && ent !== false) {
      // K = HMAC_K(V || 0x00 || int2octets(x) || bits2octets(h1) || k')
      const e = ent === true ? randomBytes(Fp.BYTES) : ent; // generate random bytes OR pass as-is
      seedArgs.push(ensureBytes('extraEntropy', e)); // check for being bytes
    }
    const seed = concatBytes(...seedArgs); // Step D of RFC6979 3.2
    const m = h1int; // NOTE: no need to call bits2int second time here, it is inside truncateHash!
    // Converts signature params into point w r/s, checks result for validity.
    function k2sig(kBytes) {
      // RFC 6979 Section 3.2, step 3: k = bits2int(T)
      const k = bits2int(kBytes); // Cannot use fields methods, since it is group element
      if (!isWithinCurveOrder(k)) return; // Important: all mod() calls here must be done over N
      const ik = invN(k); // k^-1 mod n
      const q = Point.BASE.multiply(k).toAffine(); // q = Gk
      const r = modN(q.x); // r = q.x mod n
      if (r === _0n) return;
      // Can use scalar blinding b^-1(bm + bdr) where b ∈ [1,q−1] according to
      // https://tches.iacr.org/index.php/TCHES/article/view/7337/6509. We've decided against it:
      // a) dependency on CSPRNG b) 15% slowdown c) doesn't really help since bigints are not CT
      const s = modN(ik * modN(m + r * d)); // Not using blinding here
      if (s === _0n) return;
      let recovery = (q.x === r ? 0 : 2) | Number(q.y & _1n$1); // recovery bit (2 or 3, when q.x > n)
      let normS = s;
      if (lowS && isBiggerThanHalfOrder(s)) {
        normS = normalizeS(s); // if lowS was passed, ensure s is always
        recovery ^= 1; // // in the bottom half of N
      }
      return new Signature(r, normS, recovery); // use normS, not s
    }
    return {
      seed,
      k2sig
    };
  }
  const defaultSigOpts = {
    lowS: CURVE.lowS,
    prehash: false
  };
  const defaultVerOpts = {
    lowS: CURVE.lowS,
    prehash: false
  };
  /**
   * Signs message hash with a private key.
   * ```
   * sign(m, d, k) where
   *   (x, y) = G × k
   *   r = x mod n
   *   s = (m + dr)/k mod n
   * ```
   * @param msgHash NOT message. msg needs to be hashed to `msgHash`, or use `prehash`.
   * @param privKey private key
   * @param opts lowS for non-malleable sigs. extraEntropy for mixing randomness into k. prehash will hash first arg.
   * @returns signature with recovery param
   */
  function sign(msgHash, privKey, opts = defaultSigOpts) {
    const {
      seed,
      k2sig
    } = prepSig(msgHash, privKey, opts); // Steps A, D of RFC6979 3.2.
    const C = CURVE;
    const drbg = createHmacDrbg(C.hash.outputLen, C.nByteLength, C.hmac);
    return drbg(seed, k2sig); // Steps B, C, D, E, F, G
  }
  // Enable precomputes. Slows down first publicKey computation by 20ms.
  Point.BASE._setWindowSize(8);
  // utils.precompute(8, ProjectivePoint.BASE)
  /**
   * Verifies a signature against message hash and public key.
   * Rejects lowS signatures by default: to override,
   * specify option `{lowS: false}`. Implements section 4.1.4 from https://www.secg.org/sec1-v2.pdf:
   *
   * ```
   * verify(r, s, h, P) where
   *   U1 = hs^-1 mod n
   *   U2 = rs^-1 mod n
   *   R = U1⋅G - U2⋅P
   *   mod(R.x, n) == r
   * ```
   */
  function verify(signature, msgHash, publicKey, opts = defaultVerOpts) {
    const sg = signature;
    msgHash = ensureBytes('msgHash', msgHash);
    publicKey = ensureBytes('publicKey', publicKey);
    if ('strict' in opts) throw new Error('options.strict was renamed to lowS');
    validateSigVerOpts(opts);
    const {
      lowS,
      prehash
    } = opts;
    let _sig = undefined;
    let P;
    try {
      if (typeof sg === 'string' || isBytes(sg)) {
        // Signature can be represented in 2 ways: compact (2*nByteLength) & DER (variable-length).
        // Since DER can also be 2*nByteLength bytes, we check for it first.
        try {
          _sig = Signature.fromDER(sg);
        } catch (derError) {
          if (!(derError instanceof DER.Err)) throw derError;
          _sig = Signature.fromCompact(sg);
        }
      } else if (typeof sg === 'object' && typeof sg.r === 'bigint' && typeof sg.s === 'bigint') {
        const {
          r,
          s
        } = sg;
        _sig = new Signature(r, s);
      } else {
        throw new Error('PARSE');
      }
      P = Point.fromHex(publicKey);
    } catch (error) {
      if (error.message === 'PARSE') throw new Error(`signature must be Signature instance, Uint8Array or hex string`);
      return false;
    }
    if (lowS && _sig.hasHighS()) return false;
    if (prehash) msgHash = CURVE.hash(msgHash);
    const {
      r,
      s
    } = _sig;
    const h = bits2int_modN(msgHash); // Cannot use fields methods, since it is group element
    const is = invN(s); // s^-1
    const u1 = modN(h * is); // u1 = hs^-1 mod n
    const u2 = modN(r * is); // u2 = rs^-1 mod n
    const R = Point.BASE.multiplyAndAddUnsafe(P, u1, u2)?.toAffine(); // R = u1⋅G + u2⋅P
    if (!R) return false;
    const v = modN(R.x);
    return v === r;
  }
  return {
    CURVE,
    getPublicKey,
    getSharedSecret,
    sign,
    verify,
    ProjectivePoint: Point,
    Signature,
    utils
  };
}

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
// connects noble-curves to noble-hashes
function getHash(hash) {
  return {
    hash,
    hmac: (key, ...msgs) => hmac(hash, key, concatBytes$2(...msgs)),
    randomBytes
  };
}
function createCurve(curveDef, defHash) {
  const create = hash => weierstrass({
    ...curveDef,
    ...getHash(hash)
  });
  return Object.freeze({
    ...create(defHash),
    create
  });
}

/*! noble-curves - MIT License (c) 2022 Paul Miller (paulmillr.com) */
const secp256k1P = BigInt('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f');
const secp256k1N = BigInt('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141');
const _1n = BigInt(1);
const _2n = BigInt(2);
const divNearest = (a, b) => (a + b / _2n) / b;
/**
 * √n = n^((p+1)/4) for fields p = 3 mod 4. We unwrap the loop and multiply bit-by-bit.
 * (P+1n/4n).toString(2) would produce bits [223x 1, 0, 22x 1, 4x 0, 11, 00]
 */
function sqrtMod(y) {
  const P = secp256k1P;
  // prettier-ignore
  const _3n = BigInt(3),
    _6n = BigInt(6),
    _11n = BigInt(11),
    _22n = BigInt(22);
  // prettier-ignore
  const _23n = BigInt(23),
    _44n = BigInt(44),
    _88n = BigInt(88);
  const b2 = y * y * y % P; // x^3, 11
  const b3 = b2 * b2 * y % P; // x^7
  const b6 = pow2(b3, _3n, P) * b3 % P;
  const b9 = pow2(b6, _3n, P) * b3 % P;
  const b11 = pow2(b9, _2n, P) * b2 % P;
  const b22 = pow2(b11, _11n, P) * b11 % P;
  const b44 = pow2(b22, _22n, P) * b22 % P;
  const b88 = pow2(b44, _44n, P) * b44 % P;
  const b176 = pow2(b88, _88n, P) * b88 % P;
  const b220 = pow2(b176, _44n, P) * b44 % P;
  const b223 = pow2(b220, _3n, P) * b3 % P;
  const t1 = pow2(b223, _23n, P) * b22 % P;
  const t2 = pow2(t1, _6n, P) * b2 % P;
  const root = pow2(t2, _2n, P);
  if (!Fp.eql(Fp.sqr(root), y)) throw new Error('Cannot find square root');
  return root;
}
const Fp = Field(secp256k1P, undefined, undefined, {
  sqrt: sqrtMod
});
/**
 * secp256k1 short weierstrass curve and ECDSA signatures over it.
 */
const secp256k1 = createCurve({
  a: BigInt(0),
  // equation params: a, b
  b: BigInt(7),
  // Seem to be rigid: bitcointalk.org/index.php?topic=289795.msg3183975#msg3183975
  Fp,
  // Field's prime: 2n**256n - 2n**32n - 2n**9n - 2n**8n - 2n**7n - 2n**6n - 2n**4n - 1n
  n: secp256k1N,
  // Curve order, total count of valid points in the field
  // Base point (x, y) aka generator point
  Gx: BigInt('55066263022277343669578718895168534326250603453777594175500187360389116729240'),
  Gy: BigInt('32670510020758816978083085130507043184471273380659243275938904335757337482424'),
  h: BigInt(1),
  // Cofactor
  lowS: true,
  // Allow only low-S signatures by default in sign() and verify()
  /**
   * secp256k1 belongs to Koblitz curves: it has efficiently computable endomorphism.
   * Endomorphism uses 2x less RAM, speeds up precomputation by 2x and ECDH / key recovery by 20%.
   * For precomputed wNAF it trades off 1/2 init time & 1/3 ram for 20% perf hit.
   * Explanation: https://gist.github.com/paulmillr/eb670806793e84df628a7c434a873066
   */
  endo: {
    beta: BigInt('0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee'),
    splitScalar: k => {
      const n = secp256k1N;
      const a1 = BigInt('0x3086d221a7d46bcde86c90e49284eb15');
      const b1 = -_1n * BigInt('0xe4437ed6010e88286f547fa90abfe4c3');
      const a2 = BigInt('0x114ca50f7a8e2f3f657c1108d9d44cfd8');
      const b2 = a1;
      const POW_2_128 = BigInt('0x100000000000000000000000000000000'); // (2n**128n).toString(16)
      const c1 = divNearest(b2 * k, n);
      const c2 = divNearest(-b1 * k, n);
      let k1 = mod(k - c1 * a1 - c2 * a2, n);
      let k2 = mod(-c1 * b1 - c2 * b2, n);
      const k1neg = k1 > POW_2_128;
      const k2neg = k2 > POW_2_128;
      if (k1neg) k1 = n - k1;
      if (k2neg) k2 = n - k2;
      if (k1 > POW_2_128 || k2 > POW_2_128) {
        throw new Error('splitScalar: Endomorphism failed, k=' + k);
      }
      return {
        k1neg,
        k1,
        k2neg,
        k2
      };
    }
  }
}, sha256$1);
// Schnorr signatures are superior to ECDSA from above. Below is Schnorr-specific BIP0340 code.
// https://github.com/bitcoin/bips/blob/master/bip-0340.mediawiki
BigInt(0);
secp256k1.ProjectivePoint;

var secp256k1$1 = /*#__PURE__*/Object.freeze({
  __proto__: null,
  secp256k1: secp256k1
});

/**
 * Deploys a contract to the network, given bytecode and constructor arguments.
 *
 * - Docs: https://viem.sh/docs/contract/deployContract
 * - Examples: https://stackblitz.com/github/wevm/viem/tree/main/examples/contracts/deploying-contracts
 *
 * @param client - Client to use
 * @param parameters - {@link DeployContractParameters}
 * @returns The [Transaction](https://viem.sh/docs/glossary/terms#transaction) hash. {@link DeployContractReturnType}
 *
 * @example
 * import { createWalletClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { deployContract } from 'viem/contract'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const hash = await deployContract(client, {
 *   abi: [],
 *   account: '0x…,
 *   bytecode: '0x608060405260405161083e38038061083e833981016040819052610...',
 * })
 */
function deployContract(walletClient, parameters) {
  const {
    abi,
    args,
    bytecode,
    ...request
  } = parameters;
  const calldata = encodeDeployData({
    abi,
    args,
    bytecode
  });
  return sendTransaction(walletClient, {
    ...request,
    data: calldata
  });
}

/**
 * Returns a list of account addresses owned by the wallet or client.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/getAddresses
 * - JSON-RPC Methods: [`eth_accounts`](https://ethereum.org/en/developers/docs/apis/json-rpc/#eth_accounts)
 *
 * @param client - Client to use
 * @returns List of account addresses owned by the wallet or client. {@link GetAddressesReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getAddresses } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const accounts = await getAddresses(client)
 */
async function getAddresses(client) {
  if (client.account?.type === 'local') return [client.account.address];
  const addresses = await client.request({
    method: 'eth_accounts'
  }, {
    dedupe: true
  });
  return addresses.map(address => checksumAddress(address));
}

/**
 * Gets the wallets current permissions.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/getPermissions
 * - JSON-RPC Methods: [`wallet_getPermissions`](https://eips.ethereum.org/EIPS/eip-2255)
 *
 * @param client - Client to use
 * @returns The wallet permissions. {@link GetPermissionsReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { getPermissions } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const permissions = await getPermissions(client)
 */
async function getPermissions(client) {
  const permissions = await client.request({
    method: 'wallet_getPermissions'
  }, {
    dedupe: true
  });
  return permissions;
}

/**
 * Requests a list of accounts managed by a wallet.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/requestAddresses
 * - JSON-RPC Methods: [`eth_requestAccounts`](https://eips.ethereum.org/EIPS/eip-1102)
 *
 * Sends a request to the wallet, asking for permission to access the user's accounts. After the user accepts the request, it will return a list of accounts (addresses).
 *
 * This API can be useful for dapps that need to access the user's accounts in order to execute transactions or interact with smart contracts.
 *
 * @param client - Client to use
 * @returns List of accounts managed by a wallet {@link RequestAddressesReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { requestAddresses } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const accounts = await requestAddresses(client)
 */
async function requestAddresses(client) {
  const addresses = await client.request({
    method: 'eth_requestAccounts'
  }, {
    dedupe: true,
    retryCount: 0
  });
  return addresses.map(address => getAddress(address));
}

/**
 * Requests permissions for a wallet.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/requestPermissions
 * - JSON-RPC Methods: [`wallet_requestPermissions`](https://eips.ethereum.org/EIPS/eip-2255)
 *
 * @param client - Client to use
 * @param parameters - {@link RequestPermissionsParameters}
 * @returns The wallet permissions. {@link RequestPermissionsReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { requestPermissions } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const permissions = await requestPermissions(client, {
 *   eth_accounts: {}
 * })
 */
async function requestPermissions(client, permissions) {
  return client.request({
    method: 'wallet_requestPermissions',
    params: [permissions]
  }, {
    retryCount: 0
  });
}

/**
 * Calculates an Ethereum-specific signature in [EIP-191 format](https://eips.ethereum.org/EIPS/eip-191): `keccak256("\x19Ethereum Signed Message:\n" + len(message) + message))`.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/signMessage
 * - JSON-RPC Methods:
 *   - JSON-RPC Accounts: [`personal_sign`](https://docs.metamask.io/guide/signing-data#personal-sign)
 *   - Local Accounts: Signs locally. No JSON-RPC request.
 *
 * With the calculated signature, you can:
 * - use [`verifyMessage`](https://viem.sh/docs/utilities/verifyMessage) to verify the signature,
 * - use [`recoverMessageAddress`](https://viem.sh/docs/utilities/recoverMessageAddress) to recover the signing address from a signature.
 *
 * @param client - Client to use
 * @param parameters - {@link SignMessageParameters}
 * @returns The signed message. {@link SignMessageReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { signMessage } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const signature = await signMessage(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   message: 'hello world',
 * })
 *
 * @example
 * // Account Hoisting
 * import { createWalletClient, custom } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { signMessage } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const signature = await signMessage(client, {
 *   message: 'hello world',
 * })
 */
async function signMessage(client, {
  account: account_ = client.account,
  message
}) {
  if (!account_) throw new AccountNotFoundError({
    docsPath: '/docs/actions/wallet/signMessage'
  });
  const account = parseAccount(account_);
  if (account.signMessage) return account.signMessage({
    message
  });
  const message_ = (() => {
    if (typeof message === 'string') return stringToHex(message);
    if (message.raw instanceof Uint8Array) return toHex(message.raw);
    return message.raw;
  })();
  return client.request({
    method: 'personal_sign',
    params: [message_, account.address]
  }, {
    retryCount: 0
  });
}

/**
 * Signs a transaction.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/signTransaction
 * - JSON-RPC Methods:
 *   - JSON-RPC Accounts: [`eth_signTransaction`](https://ethereum.github.io/execution-apis/api-documentation/)
 *   - Local Accounts: Signs locally. No JSON-RPC request.
 *
 * @param args - {@link SignTransactionParameters}
 * @returns The signed serialized transaction. {@link SignTransactionReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { signTransaction } from 'viem/actions'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const signature = await signTransaction(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   to: '0x0000000000000000000000000000000000000000',
 *   value: 1n,
 * })
 *
 * @example
 * // Account Hoisting
 * import { createWalletClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { signTransaction } from 'viem/actions'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const signature = await signTransaction(client, {
 *   to: '0x0000000000000000000000000000000000000000',
 *   value: 1n,
 * })
 */
async function signTransaction(client, parameters) {
  const {
    account: account_ = client.account,
    chain = client.chain,
    ...transaction
  } = parameters;
  if (!account_) throw new AccountNotFoundError({
    docsPath: '/docs/actions/wallet/signTransaction'
  });
  const account = parseAccount(account_);
  assertRequest({
    account,
    ...parameters
  });
  const chainId = await getAction(client, getChainId, 'getChainId')({});
  if (chain !== null) assertCurrentChain({
    currentChainId: chainId,
    chain
  });
  const formatters = chain?.formatters || client.chain?.formatters;
  const format = formatters?.transactionRequest?.format || formatTransactionRequest;
  if (account.signTransaction) return account.signTransaction({
    ...transaction,
    chainId
  }, {
    serializer: client.chain?.serializers?.transaction
  });
  return await client.request({
    method: 'eth_signTransaction',
    params: [{
      ...format(transaction),
      chainId: numberToHex(chainId),
      from: account.address
    }]
  }, {
    retryCount: 0
  });
}

/**
 * Signs typed data and calculates an Ethereum-specific signature in [https://eips.ethereum.org/EIPS/eip-712](https://eips.ethereum.org/EIPS/eip-712): `sign(keccak256("\x19\x01" ‖ domainSeparator ‖ hashStruct(message)))`
 *
 * - Docs: https://viem.sh/docs/actions/wallet/signTypedData
 * - JSON-RPC Methods:
 *   - JSON-RPC Accounts: [`eth_signTypedData_v4`](https://docs.metamask.io/guide/signing-data#signtypeddata-v4)
 *   - Local Accounts: Signs locally. No JSON-RPC request.
 *
 * @param client - Client to use
 * @param parameters - {@link SignTypedDataParameters}
 * @returns The signed data. {@link SignTypedDataReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { signTypedData } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const signature = await signTypedData(client, {
 *   account: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
 *   domain: {
 *     name: 'Ether Mail',
 *     version: '1',
 *     chainId: 1,
 *     verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
 *   },
 *   types: {
 *     Person: [
 *       { name: 'name', type: 'string' },
 *       { name: 'wallet', type: 'address' },
 *     ],
 *     Mail: [
 *       { name: 'from', type: 'Person' },
 *       { name: 'to', type: 'Person' },
 *       { name: 'contents', type: 'string' },
 *     ],
 *   },
 *   primaryType: 'Mail',
 *   message: {
 *     from: {
 *       name: 'Cow',
 *       wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
 *     },
 *     to: {
 *       name: 'Bob',
 *       wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
 *     },
 *     contents: 'Hello, Bob!',
 *   },
 * })
 *
 * @example
 * // Account Hoisting
 * import { createWalletClient, http } from 'viem'
 * import { privateKeyToAccount } from 'viem/accounts'
 * import { mainnet } from 'viem/chains'
 * import { signTypedData } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   account: privateKeyToAccount('0x…'),
 *   chain: mainnet,
 *   transport: http(),
 * })
 * const signature = await signTypedData(client, {
 *   domain: {
 *     name: 'Ether Mail',
 *     version: '1',
 *     chainId: 1,
 *     verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
 *   },
 *   types: {
 *     Person: [
 *       { name: 'name', type: 'string' },
 *       { name: 'wallet', type: 'address' },
 *     ],
 *     Mail: [
 *       { name: 'from', type: 'Person' },
 *       { name: 'to', type: 'Person' },
 *       { name: 'contents', type: 'string' },
 *     ],
 *   },
 *   primaryType: 'Mail',
 *   message: {
 *     from: {
 *       name: 'Cow',
 *       wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
 *     },
 *     to: {
 *       name: 'Bob',
 *       wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
 *     },
 *     contents: 'Hello, Bob!',
 *   },
 * })
 */
async function signTypedData(client, parameters) {
  const {
    account: account_ = client.account,
    domain,
    message,
    primaryType
  } = parameters;
  if (!account_) throw new AccountNotFoundError({
    docsPath: '/docs/actions/wallet/signTypedData'
  });
  const account = parseAccount(account_);
  const types = {
    EIP712Domain: getTypesForEIP712Domain({
      domain
    }),
    ...parameters.types
  };
  // Need to do a runtime validation check on addresses, byte ranges, integer ranges, etc
  // as we can't statically check this with TypeScript.
  validateTypedData({
    domain,
    message,
    primaryType,
    types
  });
  if (account.signTypedData) return account.signTypedData({
    domain,
    message,
    primaryType,
    types
  });
  const typedData = serializeTypedData({
    domain,
    message,
    primaryType,
    types
  });
  return client.request({
    method: 'eth_signTypedData_v4',
    params: [account.address, typedData]
  }, {
    retryCount: 0
  });
}

/**
 * Switch the target chain in a wallet.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/switchChain
 * - JSON-RPC Methods: [`eth_switchEthereumChain`](https://eips.ethereum.org/EIPS/eip-3326)
 *
 * @param client - Client to use
 * @param parameters - {@link SwitchChainParameters}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet, optimism } from 'viem/chains'
 * import { switchChain } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * await switchChain(client, { id: optimism.id })
 */
async function switchChain(client, {
  id
}) {
  await client.request({
    method: 'wallet_switchEthereumChain',
    params: [{
      chainId: numberToHex(id)
    }]
  }, {
    retryCount: 0
  });
}

/**
 * Adds an EVM chain to the wallet.
 *
 * - Docs: https://viem.sh/docs/actions/wallet/watchAsset
 * - JSON-RPC Methods: [`eth_switchEthereumChain`](https://eips.ethereum.org/EIPS/eip-747)
 *
 * @param client - Client to use
 * @param parameters - {@link WatchAssetParameters}
 * @returns Boolean indicating if the token was successfully added. {@link WatchAssetReturnType}
 *
 * @example
 * import { createWalletClient, custom } from 'viem'
 * import { mainnet } from 'viem/chains'
 * import { watchAsset } from 'viem/wallet'
 *
 * const client = createWalletClient({
 *   chain: mainnet,
 *   transport: custom(window.ethereum),
 * })
 * const success = await watchAsset(client, {
 *   type: 'ERC20',
 *   options: {
 *     address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
 *     decimals: 18,
 *     symbol: 'WETH',
 *   },
 * })
 */
async function watchAsset(client, params) {
  const added = await client.request({
    method: 'wallet_watchAsset',
    params
  }, {
    retryCount: 0
  });
  return added;
}

function walletActions(client) {
  return {
    addChain: args => addChain(client, args),
    deployContract: args => deployContract(client, args),
    getAddresses: () => getAddresses(client),
    getChainId: () => getChainId(client),
    getPermissions: () => getPermissions(client),
    prepareTransactionRequest: args => prepareTransactionRequest(client, args),
    requestAddresses: () => requestAddresses(client),
    requestPermissions: args => requestPermissions(client, args),
    sendRawTransaction: args => sendRawTransaction(client, args),
    sendTransaction: args => sendTransaction(client, args),
    signMessage: args => signMessage(client, args),
    signTransaction: args => signTransaction(client, args),
    signTypedData: args => signTypedData(client, args),
    switchChain: args => switchChain(client, args),
    watchAsset: args => watchAsset(client, args),
    writeContract: args => writeContract(client, args)
  };
}

function createWalletClient(parameters) {
  const {
    key = 'wallet',
    name = 'Wallet Client',
    transport
  } = parameters;
  const client = createClient({
    ...parameters,
    key,
    name,
    transport,
    type: 'walletClient'
  });
  return client.extend(walletActions);
}

const testnet = {
  id: 325000,
  name: 'Camp Network Testnet V2',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH'
  },
  rpcUrls: {
    default: {
      http: ['https://rpc-campnetwork.xyz']
    }
  },
  blockExplorers: {
    default: {
      name: 'Explorer',
      url: 'https://camp-network-testnet.blockscout.com'
    }
  }
};
// https://rpc.camp-network-testnet.gelato.digital

let client = null;
const getClient = () => {
  if (!client) {
    client = createWalletClient({
      chain: testnet,
      transport: custom(window.ethereum)
    });
  }
  return client;
};

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

/**
 * @description Generates random EIP-4361 nonce.
 *
 * @example
 * const nonce = generateNonce()
 *
 * @see https://eips.ethereum.org/EIPS/eip-4361
 *
 * @returns A randomly generated EIP-4361 nonce.
 */
function generateSiweNonce() {
  return uid(96);
}

/**
 * The Auth class.
 * @class
 * @classdesc The Auth class is used to authenticate the user.
 */
class Auth {
  /**
   * Constructor for the Auth class.
   * @param {object} options - The options object.
   * @param {string} options.clientId - The client ID.
   * @throws {APIError} - Throws an error if the clientId is not provided.
   */
  constructor({
    clientId
  }) {
    if (!clientId) {
      throw new APIError('clientId is required');
    }
    this.viem = getClient();
    this.clientId = clientId;
    this.isAuthenticated = false;
    this.walletAddress = '';
  }
  async requestAccount() {
    // const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const [account] = await this.viem.getAddresses();
    this.walletAddress = account;
    console.log(this.walletAddress);
  }
  async fetchNonce() {
    // call backend to get nonce
    return generateSiweNonce();
  }
  async sign() {
    if (!this.walletAddress) {
      await this.requestAccount();
    }
    createSiweMessage({
      domain: window.location.host,
      address: this.walletAddress,
      statement: 'Connect with Camp Network',
      uri: window.location.origin,
      version: '1',
      chainId: this.viem.chain.id,
      nonce: await this.fetchNonce()
    });
    const signature = await this.viem.signMessage({
      account: this.walletAddress,
      message: 'hello'
    });
    // const signature = await this.viem.request({
    //     method: 'personal_sign',
    //     params: [this.walletAddress, this.walletAddress]
    // })
    // await window.ethereum.request({
    //     "method": "personal_sign",
    //     "params": [
    //      "0x506c65617365207369676e2074686973206d65737361676520746f20636f6e6669726d20796f7572206964656e746974792e",
    //      "0xeab0028b493e029b41f5a4386f789507c00fdc84"
    //    ],
    //    });
    console.log(signature);

    // const signature = await this.viem.signMessage(nonce);
    // console.log(signature);
    // get nonce from backend
    // sign the nonce with the wallet using siwe
    // call backend to verify the signature
    // if signature is verified, set isAuthenticated to true
  }
}

exports.Auth = Auth;
exports.SpotifyAPI = SpotifyAPI;
exports.TwitterAPI = TwitterAPI;
