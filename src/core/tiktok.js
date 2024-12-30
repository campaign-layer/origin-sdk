import { fetchData, buildURL, baseTikTokURL as baseURL } from "../utils";
import { APIError } from "../errors";

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
  async fetchUserByUsername(tiktokUserName) {
    const url = `${baseURL}/user/${tiktokUserName}`;
    return this._fetchDataWithAuth(url);
  }

  /**
   * Fetch video details by TikTok username and video ID.
   * @param {string} userHandle - The TikTok username.
   * @param {string} videoId - The video ID.
   * @returns {Promise<object>} - The video details.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchVideoById(userHandle, videoId) {
    const url = `${baseURL}/video/${userHandle}/${videoId}`;
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
      return await fetchData(url, { "x-api-key": this.apiKey });
    } catch (error) {
      throw new APIError(error.message, error.statusCode);
    }
  }
}

export { TikTokAPI };