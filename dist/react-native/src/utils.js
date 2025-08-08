'use strict';

var tslib_es6 = require('../node_modules/tslib/tslib.es6.js');
var axios = require('axios');
var errors = require('./errors.js');

/**
 * Makes a GET request to the given URL with the provided headers.
 *
 * @param {string} url - The URL to send the GET request to.
 * @param {object} headers - The headers to include in the request.
 * @returns {Promise<object>} - The response data.
 * @throws {APIError} - Throws an error if the request fails.
 */
function fetchData(url_1) {
    return tslib_es6.__awaiter(this, arguments, void 0, function* (url, headers = {}) {
        try {
            const response = yield axios.get(url, { headers });
            return response.data;
        }
        catch (error) {
            if (error.response) {
                throw new errors.APIError(error.response.data.message || "API request failed", error.response.status);
            }
            throw new errors.APIError("Network error or server is unavailable", 500);
        }
    });
}
/**
 * Constructs a query string from an object of query parameters.
 *
 * @param {object} params - An object representing query parameters.
 * @returns {string} - The encoded query string.
 */
function buildQueryString(params = {}) {
    return Object.keys(params)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join("&");
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
const baseTwitterURL = "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/twitter";
const baseSpotifyURL = "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/spotify";
const baseTikTokURL = "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev/tiktok";
/**
 * Formats an Ethereum address by truncating it to the first and last n characters.
 * @param {string} address - The Ethereum address to format.
 * @param {number} n - The number of characters to keep from the start and end of the address.
 * @return {string} - The formatted address.
 */
const formatAddress = (address, n = 8) => {
    return `${address.slice(0, n)}...${address.slice(-n)}`;
};
/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @return {string} - The capitalized string.
 */
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
/**
 * Formats a Camp amount to a human-readable string.
 * @param {number} amount - The Camp amount to format.
 * @returns {string} - The formatted Camp amount.
 */
const formatCampAmount = (amount) => {
    if (amount >= 1000) {
        const formatted = (amount / 1000).toFixed(1);
        return formatted.endsWith(".0")
            ? formatted.slice(0, -2) + "k"
            : formatted + "k";
    }
    return amount.toString();
};
/**
 * Sends an analytics event to the Ackee server.
 * @param {any} ackee - The Ackee instance.
 * @param {string} event - The event name.
 * @param {string} key - The key for the event.
 * @param {number} value - The value for the event.
 * @returns {Promise<string>} - A promise that resolves with the response from the server.
 */
const sendAnalyticsEvent = (ackee, event, key, value) => tslib_es6.__awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        if (typeof window !== "undefined" && !!ackee) {
            try {
                ackee.action(event, {
                    key: key,
                    value: value,
                }, (res) => {
                    resolve(res);
                });
            }
            catch (error) {
                console.error(error);
                reject(error);
            }
        }
        else {
            reject(new Error("Unable to send analytics event. If you are using the library, you can ignore this error."));
        }
    });
});
/**
 * Uploads a file to a specified URL with progress tracking.
 * Falls back to a simple fetch request if XMLHttpRequest is not available.
 * @param {File} file - The file to upload.
 * @param {string} url - The URL to upload the file to.
 * @param {UploadProgressCallback} onProgress - A callback function to track upload progress.
 * @returns {Promise<string>} - A promise that resolves with the response from the server.
 */
const uploadWithProgress = (file, url, onProgress) => {
    return new Promise((resolve, reject) => {
        axios
            .put(url, file, Object.assign({ headers: {
                "Content-Type": file.type,
            } }, (typeof window !== "undefined" && typeof onProgress === "function"
            ? {
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = (progressEvent.loaded / progressEvent.total) * 100;
                        onProgress(percent);
                    }
                },
            }
            : {})))
            .then((res) => {
            resolve(res.data);
        })
            .catch((error) => {
            var _a;
            const message = ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data) || (error === null || error === void 0 ? void 0 : error.message) || "Upload failed";
            reject(message);
        });
    });
};

exports.baseSpotifyURL = baseSpotifyURL;
exports.baseTikTokURL = baseTikTokURL;
exports.baseTwitterURL = baseTwitterURL;
exports.buildQueryString = buildQueryString;
exports.buildURL = buildURL;
exports.capitalize = capitalize;
exports.fetchData = fetchData;
exports.formatAddress = formatAddress;
exports.formatCampAmount = formatCampAmount;
exports.sendAnalyticsEvent = sendAnalyticsEvent;
exports.uploadWithProgress = uploadWithProgress;
