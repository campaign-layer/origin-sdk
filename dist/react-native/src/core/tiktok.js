'use strict';

var tslib_es6 = require('../../node_modules/tslib/tslib.es6.js');
var utils = require('../utils.js');
var errors = require('../errors.js');

/**
 * The TikTokAPI class.
 * @class
 */
class TikTokAPI {
    /**
     * Constructor for the TikTokAPI class.
     * @param {object} options - The options object.
     * @param {string} options.apiKey - The Camp API key.
     */
    constructor({ apiKey }) {
        this.apiKey = apiKey;
    }
    /**
     * Fetch TikTok user details by username.
     * @param {string} tiktokUserName - The TikTok username.
     * @returns {Promise<object>} - The user details.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchUserByUsername(tiktokUserName) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            const url = `${utils.baseTikTokURL}/user/${tiktokUserName}`;
            return this._fetchDataWithAuth(url);
        });
    }
    /**
     * Fetch video details by TikTok username and video ID.
     * @param {string} userHandle - The TikTok username.
     * @param {string} videoId - The video ID.
     * @returns {Promise<object>} - The video details.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchVideoById(userHandle, videoId) {
        return tslib_es6.__awaiter(this, void 0, void 0, function* () {
            const url = `${utils.baseTikTokURL}/video/${userHandle}/${videoId}`;
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

exports.TikTokAPI = TikTokAPI;
