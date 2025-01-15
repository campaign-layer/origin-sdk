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
declare const formatAddress: (address: string, n?: number) => string;
declare const capitalize: (str: string) => string;
export { fetchData, buildQueryString, buildURL, baseTwitterURL, baseSpotifyURL, baseTikTokURL, formatAddress, capitalize, };
