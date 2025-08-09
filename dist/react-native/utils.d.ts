/**
 * Makes a GET request to the given URL with the provided headers.
 *
 * @param {string} url - The URL to send the GET request to.
 * @param {object} headers - The headers to include in the request.
 * @returns {Promise<object>} - The response data.
 * @throws {APIError} - Throws an error if the request fails.
 */
declare function fetchData(url: string, headers?: Record<string, string>): Promise<object>;
/**
 * Constructs a query string from an object of query parameters.
 *
 * @param {object} params - An object representing query parameters.
 * @returns {string} - The encoded query string.
 */
declare function buildQueryString(params?: Record<string, any>): string;
/**
 * Builds a complete URL with query parameters.
 *
 * @param {string} baseURL - The base URL of the endpoint.
 * @param {object} params - An object representing query parameters.
 * @returns {string} - The complete URL with query string.
 */
declare function buildURL(baseURL: string, params?: Record<string, any>): string;
declare const baseTwitterURL: string;
declare const baseSpotifyURL: string;
declare const baseTikTokURL: string;
/**
 * Formats an Ethereum address by truncating it to the first and last n characters.
 * @param {string} address - The Ethereum address to format.
 * @param {number} n - The number of characters to keep from the start and end of the address.
 * @return {string} - The formatted address.
 */
declare const formatAddress: (address: string, n?: number) => string;
/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @return {string} - The capitalized string.
 */
declare const capitalize: (str: string) => string;
/**
 * Formats a Camp amount to a human-readable string.
 * @param {number} amount - The Camp amount to format.
 * @returns {string} - The formatted Camp amount.
 */
export declare const formatCampAmount: (amount: number) => string;
/**
 * Sends an analytics event to the Ackee server.
 * @param {any} ackee - The Ackee instance.
 * @param {string} event - The event name.
 * @param {string} key - The key for the event.
 * @param {number} value - The value for the event.
 * @returns {Promise<string>} - A promise that resolves with the response from the server.
 */
export declare const sendAnalyticsEvent: (ackee: any, event: string, key: string, value: number) => Promise<string>;
interface UploadProgressCallback {
    (percent: number): void;
}
interface UploadWithProgress {
    (file: File, url: string, onProgress: UploadProgressCallback): Promise<string>;
}
/**
 * Uploads a file to a specified URL with progress tracking.
 * Falls back to a simple fetch request if XMLHttpRequest is not available.
 * @param {File} file - The file to upload.
 * @param {string} url - The URL to upload the file to.
 * @param {UploadProgressCallback} onProgress - A callback function to track upload progress.
 * @returns {Promise<string>} - A promise that resolves with the response from the server.
 */
export declare const uploadWithProgress: UploadWithProgress;
export { fetchData, buildQueryString, buildURL, baseTwitterURL, baseSpotifyURL, baseTikTokURL, formatAddress, capitalize, };
