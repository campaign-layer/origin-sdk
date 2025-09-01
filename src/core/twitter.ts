import { fetchData, buildURL, baseTwitterURL as baseURL } from "../utils";
import { APIError, ValidationError } from "../errors";

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
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
      throw new ValidationError("API key is required and must be a non-empty string");
    }
    this.apiKey = apiKey.trim();
  }

  /**
   * Fetch Twitter user details by username.
   * @param {string} twitterUserName - The Twitter username.
   * @returns {Promise<object>} - The user details.
   * @throws {APIError} - Throws an error if the request fails.
   */
  async fetchUserByUsername(twitterUserName: string): Promise<object> {
    if (!twitterUserName || typeof twitterUserName !== 'string' || twitterUserName.trim() === '') {
      throw new ValidationError("Twitter username is required and must be a non-empty string");
    }
    const trimmedUsername = twitterUserName.trim();
    // Basic Twitter(X) username validation (no @ symbol, alphanumeric + underscore)
    if (!/^[a-zA-Z0-9_]{1,15}$/.test(trimmedUsername)) {
      throw new ValidationError("Invalid Twitter username format");
    }
    const url = buildURL(`${baseURL}/user`, { twitterUserName: trimmedUsername });
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
  async fetchTweetsByUsername(
    twitterUserName: string,
    page: number = 1,
    limit: number = 10
  ): Promise<object> {
    if (!twitterUserName || typeof twitterUserName !== 'string' || twitterUserName.trim() === '') {
      throw new ValidationError("Twitter username is required and must be a non-empty string");
    }
    const trimmedUsername = twitterUserName.trim();
    if (!/^[a-zA-Z0-9_]{1,15}$/.test(trimmedUsername)) {
      throw new ValidationError("Invalid Twitter username format");
    }
    if (!Number.isInteger(page) || page < 1) {
      throw new ValidationError("Page must be a positive integer");
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new ValidationError("Limit must be a positive integer between 1 and 100");
    }
    const url = buildURL(`${baseURL}/tweets`, {
      twitterUserName: trimmedUsername,
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
  async fetchFollowersByUsername(
    twitterUserName: string,
    page: number = 1,
    limit: number = 10
  ): Promise<object> {
    const { validatedUsername, validatedPage, validatedLimit } = this._validateUsernamePageLimit(twitterUserName, page, limit);
    const url = buildURL(`${baseURL}/followers`, {
      twitterUserName: validatedUsername,
      page: validatedPage,
      limit: validatedLimit,
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
  async fetchFollowingByUsername(
    twitterUserName: string,
    page: number = 1,
    limit: number = 10
  ): Promise<object> {
    const { validatedUsername, validatedPage, validatedLimit } = this._validateUsernamePageLimit(twitterUserName, page, limit);
    const url = buildURL(`${baseURL}/following`, {
      twitterUserName: validatedUsername,
      page: validatedPage,
      limit: validatedLimit,
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
    if (!tweetId || typeof tweetId !== 'string' || tweetId.trim() === '') {
      throw new ValidationError("Tweet ID is required and must be a non-empty string");
    }
    const trimmedTweetId = tweetId.trim();
    // Basic tweet ID validation (should be numeric)
    if (!/^\d+$/.test(trimmedTweetId)) {
      throw new ValidationError("Invalid tweet ID format");
    }
    const url = buildURL(`${baseURL}/getTweetById`, { tweetId: trimmedTweetId });
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
  async fetchUserByWalletAddress(
    walletAddress: string,
    page: number = 1,
    limit: number = 10
  ): Promise<object> {
    if (!walletAddress || typeof walletAddress !== 'string' || walletAddress.trim() === '') {
      throw new ValidationError("Wallet address is required and must be a non-empty string");
    }
    const trimmedAddress = walletAddress.trim();
    if (!/^0x[a-fA-F0-9]{40}$/.test(trimmedAddress)) {
      throw new ValidationError("Invalid wallet address format");
    }
    if (!Number.isInteger(page) || page < 1) {
      throw new ValidationError("Page must be a positive integer");
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new ValidationError("Limit must be a positive integer between 1 and 100");
    }
    const url = buildURL(`${baseURL}/wallet-twitter-data`, {
      walletAddress: trimmedAddress,
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
  async fetchRepostedByUsername(
    twitterUserName: string,
    page: number = 1,
    limit: number = 10
  ): Promise<object> {
    const { validatedUsername, validatedPage, validatedLimit } = this._validateUsernamePageLimit(twitterUserName, page, limit);
    const url = buildURL(`${baseURL}/reposted`, {
      twitterUserName: validatedUsername,
      page: validatedPage,
      limit: validatedLimit,
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
  async fetchRepliesByUsername(
    twitterUserName: string,
    page: number = 1,
    limit: number = 10
  ): Promise<object> {
    const { validatedUsername, validatedPage, validatedLimit } = this._validateUsernamePageLimit(twitterUserName, page, limit);
    const url = buildURL(`${baseURL}/replies`, {
      twitterUserName: validatedUsername,
      page: validatedPage,
      limit: validatedLimit,
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
  async fetchLikesByUsername(
    twitterUserName: string,
    page: number = 1,
    limit: number = 10
  ): Promise<object> {
    const { validatedUsername, validatedPage, validatedLimit } = this._validateUsernamePageLimit(twitterUserName, page, limit);
    const url = buildURL(`${baseURL}/event/likes/${validatedUsername}`, {
      page: validatedPage,
      limit: validatedLimit,
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
  async fetchFollowsByUsername(
    twitterUserName: string,
    page: number = 1,
    limit: number = 10
  ): Promise<object> {
    const { validatedUsername, validatedPage, validatedLimit } = this._validateUsernamePageLimit(twitterUserName, page, limit);
    const url = buildURL(`${baseURL}/event/follows/${validatedUsername}`, {
      page: validatedPage,
      limit: validatedLimit,
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
  async fetchViewedTweetsByUsername(
    twitterUserName: string,
    page: number = 1,
    limit: number = 10
  ): Promise<object> {
    const { validatedUsername, validatedPage, validatedLimit } = this._validateUsernamePageLimit(twitterUserName, page, limit);
    const url = buildURL(`${baseURL}/event/viewed-tweets/${validatedUsername}`, {
      page: validatedPage,
      limit: validatedLimit,
    });
    return this._fetchDataWithAuth(url);
  }

  /**
   * Private method to validate username, page, and limit parameters.
   * @param {string} twitterUserName - The Twitter username.
   * @param {number} page - The page number.
   * @param {number} limit - The limit number.
   * @returns {object} - Validated parameters.
   * @throws {ValidationError} - Throws an error if validation fails.
   */
  private _validateUsernamePageLimit(twitterUserName: string, page: number, limit: number) {
    if (!twitterUserName || typeof twitterUserName !== 'string' || twitterUserName.trim() === '') {
      throw new ValidationError("Twitter username is required and must be a non-empty string");
    }
    const trimmedUsername = twitterUserName.trim();
    if (!/^[a-zA-Z0-9_]{1,15}$/.test(trimmedUsername)) {
      throw new ValidationError("Invalid Twitter username format");
    }
    if (!Number.isInteger(page) || page < 1) {
      throw new ValidationError("Page must be a positive integer");
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      throw new ValidationError("Limit must be a positive integer between 1 and 100");
    }
    return {
      validatedUsername: trimmedUsername,
      validatedPage: page,
      validatedLimit: limit
    };
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
