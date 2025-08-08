/**
 * The TikTokAPI class.
 * @class
 */
declare class TikTokAPI {
    apiKey: string;
    /**
     * Constructor for the TikTokAPI class.
     * @param {object} options - The options object.
     * @param {string} options.apiKey - The Camp API key.
     */
    constructor({ apiKey }: {
        apiKey: string;
    });
    /**
     * Fetch TikTok user details by username.
     * @param {string} tiktokUserName - The TikTok username.
     * @returns {Promise<object>} - The user details.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchUserByUsername(tiktokUserName: string): Promise<object>;
    /**
     * Fetch video details by TikTok username and video ID.
     * @param {string} userHandle - The TikTok username.
     * @param {string} videoId - The video ID.
     * @returns {Promise<object>} - The video details.
     * @throws {APIError} - Throws an error if the request fails.
     */
    fetchVideoById(userHandle: string, videoId: string): Promise<object>;
    /**
     * Private method to fetch data with authorization header.
     * @param {string} url - The URL to fetch.
     * @returns {Promise<object>} - The response data.
     * @throws {APIError} - Throws an error if the request fails.
     */
    _fetchDataWithAuth(url: string): Promise<object>;
}
export { TikTokAPI };
