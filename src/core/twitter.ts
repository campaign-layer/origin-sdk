import { fetchData, buildURL, baseTwitterURL as baseURL } from "../utils";
import { APIError } from "../errors";

/**
 * The TwitterAPI class.
 * @class
 * @classdesc The TwitterAPI class is used to interact with the Twitter API.
 */
class TwitterAPI {
  apiKey: string;
  /**
   * Constructor for the TwitterAPI class.
   * @param {object} options - The options object.
   * @param {string} options.apiKey - The API key. (Needed for data fetching)
   */
  constructor({ apiKey }: { apiKey: string }) {
    this.apiKey = apiKey;
  }

  /**
   * Fetch Twitter user details by username.
   * @param {string} twitterUserName - The Twitter username.
   * @returns {Promise<object>} - The user details.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchUserByUsername(twitterUserName: string): Promise<object> {
    const url = buildURL(`${baseURL}/user`, { twitterUserName });
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
  async fetchTweetsByUsername(twitterUserName: string, page: number = 1, limit: number = 10): Promise<object> {
    const url = buildURL(`${baseURL}/tweets`, {
      twitterUserName,
      page,
      limit,
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
  async fetchFollowersByUsername(twitterUserName: string, page: number = 1, limit: number = 10): Promise<object> {
    const url = buildURL(`${baseURL}/followers`, {
      twitterUserName,
      page,
      limit,
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
  async fetchFollowingByUsername(twitterUserName: string, page: number = 1, limit: number = 10): Promise<object> {
    const url = buildURL(`${baseURL}/following`, {
      twitterUserName,
      page,
      limit,
    });
    return this._fetchDataWithAuth(url);
  }

  /**
   * Fetch tweet by tweet ID.
   * @param {string} tweetId - The tweet ID.
   * @returns {Promise<object>} - The tweet.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchTweetById(tweetId: string): Promise<object> {
    const url = buildURL(`${baseURL}/getTweetById`, { tweetId });
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
  async fetchUserByWalletAddress(walletAddress: string, page: number = 1, limit: number = 10): Promise<object> {
    const url = buildURL(`${baseURL}/wallet-twitter-data`, {
      walletAddress,
      page,
      limit,
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
  async fetchRepostedByUsername(twitterUserName: string, page: number = 1, limit: number = 10): Promise<object> {
    const url = buildURL(`${baseURL}/reposted`, {
      twitterUserName,
      page,
      limit,
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
  async fetchRepliesByUsername(twitterUserName: string, page: number = 1, limit: number = 10): Promise<object> {
    const url = buildURL(`${baseURL}/replies`, {
      twitterUserName,
      page,
      limit,
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
  async fetchLikesByUsername(twitterUserName: string, page: number = 1, limit: number = 10): Promise<object> {
    const url = buildURL(`${baseURL}/event/likes/${twitterUserName}`, {
      page,
      limit,
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
  async fetchFollowsByUsername(twitterUserName: string, page: number = 1, limit: number = 10): Promise<object> {
    const url = buildURL(`${baseURL}/event/follows/${twitterUserName}`, {
      page,
      limit,
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
  async fetchViewedTweetsByUsername(twitterUserName: string, page: number = 1, limit: number = 10): Promise<object> {
    const url = buildURL(`${baseURL}/event/viewed-tweets/${twitterUserName}`, {
      page,
      limit,
    });
    return this._fetchDataWithAuth(url);
  }

  /**
   * Private method to fetch data with authorization header.
   * @param {string} url - The URL to fetch.
   * @returns {Promise<object>} - The response data.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async _fetchDataWithAuth(url: string): Promise<object> {
    if (!this.apiKey) {
      throw new APIError("API key is required for fetching data", 401);
    }
    try {
      return await fetchData(url, { "x-api-key": this.apiKey });
    } catch (error: any) {
      throw new APIError(error.message, error.statusCode);
    }
  }
}

export { TwitterAPI };
