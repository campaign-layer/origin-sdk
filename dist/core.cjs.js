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

let client = null;
const getClient = async () => {
  if (!client) {
    client = viem.createWalletClient({
      chain: testnet,
      transport: viem.http()
    });
  }
  return client;
};

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
    const [account] = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });
    console.log(account);
    this.walletAddress = account;
  }
  async fetchNonce() {
    // call backend to get nonce
    return '123456';
  }
  async sign() {
    // get nonce from backend
    // sign the nonce with the wallet using siwe
    // call backend to verify the signature
    // if signature is verified, set isAuthenticated to true
  }
}

exports.Auth = Auth;
exports.SpotifyAPI = SpotifyAPI;
exports.TwitterAPI = TwitterAPI;
