declare module "twitter" {
  export class TwitterAPI {
    constructor(apiKey: string);

    /**
     * Fetch Twitter user details by username.
     * @param twitterUserName - The Twitter username.
     * @returns A promise that resolves to the user details.
     */
    fetchUserByUsername(twitterUserName: string): Promise<object>;

    /**
     * Fetch tweets by Twitter username.
     * @param twitterUserName - The Twitter username.
     * @param page - The page number (default is 1).
     * @param limit - The number of items per page (default is 10).
     * @returns A promise that resolves to the tweets.
     */
    fetchTweetsByUsername(
      twitterUserName: string,
      page?: number,
      limit?: number
    ): Promise<object>;

    /**
     * Fetch followers by Twitter username.
     * @param twitterUserName - The Twitter username.
     * @param page - The page number (default is 1).
     * @param limit - The number of items per page (default is 10).
     * @returns A promise that resolves to the followers.
     */
    fetchFollowersByUsername(
      twitterUserName: string,
      page?: number,
      limit?: number
    ): Promise<object>;

    /**
     * Fetch following by Twitter username.
     * @param twitterUserName - The Twitter username.
     * @param page - The page number (default is 1).
     * @param limit - The number of items per page (default is 10).
     * @returns A promise that resolves to the following users.
     */
    fetchFollowingByUsername(
      twitterUserName: string,
      page?: number,
      limit?: number
    ): Promise<object>;

    /**
     * Fetch tweet by tweet ID.
     * @param tweetId - The tweet ID.
     * @returns A promise that resolves to the tweet details.
     */
    fetchTweetById(tweetId: string): Promise<object>;

    /**
     * Fetch user by wallet address.
     * @param walletAddress - The wallet address.
     * @returns A promise that resolves to the user data.
     */
    fetchUserByWalletAddress(walletAddress: string): Promise<object>;

    /**
     * Fetch reposted tweets by Twitter username.
     * @param twitterUserName - The Twitter username.
     * @param page - The page number (default is 1).
     * @param limit - The number of items per page (default is 10).
     * @returns A promise that resolves to the reposted tweets.
     */
    fetchRepostedByUsername(
      twitterUserName: string,
      page?: number,
      limit?: number
    ): Promise<object>;

    /**
     * Fetch replies by Twitter username.
     * @param twitterUserName - The Twitter username.
     * @param page - The page number (default is 1).
     * @param limit - The number of items per page (default is 10).
     * @returns A promise that resolves to the replies.
     */
    fetchRepliesByUsername(
      twitterUserName: string,
      page?: number,
      limit?: number
    ): Promise<object>;

    /**
     * Fetch likes by Twitter username.
     * @param twitterUserName - The Twitter username.
     * @returns A promise that resolves to the likes.
     */
    fetchLikesByUsername(twitterUserName: string): Promise<object>;

    /**
     * Fetch follows by Twitter username.
     * @param twitterUserName - The Twitter username.
     * @returns A promise that resolves to the follows.
     */
    fetchFollowsByUsername(twitterUserName: string): Promise<object>;

    /**
     * Fetch viewed tweets by Twitter username.
     * @param twitterUserName - The Twitter username.
     * @returns A promise that resolves to the viewed tweets.
     */
    fetchViewedTweetsByUsername(twitterUserName: string): Promise<object>;
  }
}
