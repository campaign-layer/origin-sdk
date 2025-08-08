'use strict';

var tslib_es6 = require('../../node_modules/tslib/tslib.es6.js');
var utils = require('../utils.js');
var errors = require('../errors.js');

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
     */
    constructor({ apiKey }) {
        this.apiKey = apiKey;
    }
    /**
     * Fetch Twitter user details by username.
     * @param {string} twitterUserName - The Twitter username.
     * @returns {Promise<object>} - The user details.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchUserByUsername(twitterUserName) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            const url = utils.buildURL(`${utils.baseTwitterURL}/user`, { twitterUserName });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchTweetsByUsername(twitterUserName_1) {
        return tslib_es6.__awaiter(this, arguments, void 0, function* (twitterUserName, page = 1, limit = 10) {
            const url = utils.buildURL(`${utils.baseTwitterURL}/tweets`, {
                twitterUserName,
                page,
                limit,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch followers by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The followers.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchFollowersByUsername(twitterUserName_1) {
        return tslib_es6.__awaiter(this, arguments, void 0, function* (twitterUserName, page = 1, limit = 10) {
            const url = utils.buildURL(`${utils.baseTwitterURL}/followers`, {
                twitterUserName,
                page,
                limit,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch following by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The following.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchFollowingByUsername(twitterUserName_1) {
        return tslib_es6.__awaiter(this, arguments, void 0, function* (twitterUserName, page = 1, limit = 10) {
            const url = utils.buildURL(`${utils.baseTwitterURL}/following`, {
                twitterUserName,
                page,
                limit,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch tweet by tweet ID.
     * @param {string} tweetId - The tweet ID.
     * @returns {Promise<object>} - The tweet.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchTweetById(tweetId) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            const url = utils.buildURL(`${utils.baseTwitterURL}/getTweetById`, { tweetId });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch user by wallet address.
     * @param {string} walletAddress - The wallet address.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The user data.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchUserByWalletAddress(walletAddress_1) {
        return tslib_es6.__awaiter(this, arguments, void 0, function* (walletAddress, page = 1, limit = 10) {
            const url = utils.buildURL(`${utils.baseTwitterURL}/wallet-twitter-data`, {
                walletAddress,
                page,
                limit,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch reposted tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The reposted tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchRepostedByUsername(twitterUserName_1) {
        return tslib_es6.__awaiter(this, arguments, void 0, function* (twitterUserName, page = 1, limit = 10) {
            const url = utils.buildURL(`${utils.baseTwitterURL}/reposted`, {
                twitterUserName,
                page,
                limit,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch replies by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The replies.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchRepliesByUsername(twitterUserName_1) {
        return tslib_es6.__awaiter(this, arguments, void 0, function* (twitterUserName, page = 1, limit = 10) {
            const url = utils.buildURL(`${utils.baseTwitterURL}/replies`, {
                twitterUserName,
                page,
                limit,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch likes by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The likes.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchLikesByUsername(twitterUserName_1) {
        return tslib_es6.__awaiter(this, arguments, void 0, function* (twitterUserName, page = 1, limit = 10) {
            const url = utils.buildURL(`${utils.baseTwitterURL}/event/likes/${twitterUserName}`, {
                page,
                limit,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch follows by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The follows.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchFollowsByUsername(twitterUserName_1) {
        return tslib_es6.__awaiter(this, arguments, void 0, function* (twitterUserName, page = 1, limit = 10) {
            const url = utils.buildURL(`${utils.baseTwitterURL}/event/follows/${twitterUserName}`, {
                page,
                limit,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch viewed tweets by Twitter username.
     * @param {string} twitterUserName - The Twitter username.
     * @param {number} page - The page number.
     * @param {number} limit - The number of items per page.
     * @returns {Promise<object>} - The viewed tweets.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchViewedTweetsByUsername(twitterUserName_1) {
        return tslib_es6.__awaiter(this, arguments, void 0, function* (twitterUserName, page = 1, limit = 10) {
            const url = utils.buildURL(`${utils.baseTwitterURL}/event/viewed-tweets/${twitterUserName}`, {
                page,
                limit,
            });
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */
    _fetchDataWithAuth(url) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            if (!this.apiKey) {
                throw new errors.APIError("API key is required for fetching data", 401);
            }
            try {
                return yield utils.fetchData(url, { "x-api-key": this.apiKey });
            }
            catch (error) {
                throw new errors.APIError(error.message, error.statusCode);
            }
        });
    }
}

exports.TwitterAPI = TwitterAPI;
