const TwitterAPI = require("./twitter");
const axios = require("axios");
jest.mock("axios");

describe("TwitterAPI", () => {
  let twitterAPI;
  const mockApiKey = process.env.MOCK_API_KEY;

  beforeEach(() => {
    if (!mockApiKey) {
      throw new Error("MOCK_API_KEY environment variable is not set");
    }
    twitterAPI = new TwitterAPI(mockApiKey);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should throw an error if API key is not provided", () => {
    expect(() => new TwitterAPI()).toThrow("API key is required.");
  });

  test("should fetch user by username", async () => {
    const mockUserData = { name: "John Doe", username: "johndoe" };
    axios.get.mockResolvedValue({ data: mockUserData });

    const result = await twitterAPI.fetchUserByUsername("johndoe");
    expect(result).toEqual(mockUserData);
    expect(axios.get).toHaveBeenCalledWith("/user", {
      params: { twitterUserName: "johndoe" },
    });
  });

  test("should fetch tweets by username", async () => {
    const mockTweets = [{ id: 1, text: "Hello world!" }];
    axios.get.mockResolvedValue({ data: mockTweets });

    const result = await twitterAPI.fetchTweetsByUsername("johndoe", 1, 10);
    expect(result).toEqual(mockTweets);
    expect(axios.get).toHaveBeenCalledWith("/tweets", {
      params: { twitterUserName: "johndoe", page: 1, limit: 10 },
    });
  });

  test("should fetch followers by username", async () => {
    const mockFollowers = [{ id: 1, name: "Jane Doe" }];
    axios.get.mockResolvedValue({ data: mockFollowers });

    const result = await twitterAPI.fetchFollowersByUsername("johndoe", 1, 10);
    expect(result).toEqual(mockFollowers);
    expect(axios.get).toHaveBeenCalledWith("/followers", {
      params: { twitterUserName: "johndoe", page: 1, limit: 10 },
    });
  });

  test("should fetch following by username", async () => {
    const mockFollowing = [{ id: 1, name: "Jane Doe" }];
    axios.get.mockResolvedValue({ data: mockFollowing });

    const result = await twitterAPI.fetchFollowingByUsername("johndoe", 1, 10);
    expect(result).toEqual(mockFollowing);
    expect(axios.get).toHaveBeenCalledWith("/following", {
      params: { twitterUserName: "johndoe", page: 1, limit: 10 },
    });
  });

  test("should fetch tweet by tweet ID", async () => {
    const mockTweet = { id: 123, text: "Sample tweet" };
    axios.get.mockResolvedValue({ data: mockTweet });

    const result = await twitterAPI.fetchTweetById("123");
    expect(result).toEqual(mockTweet);
    expect(axios.get).toHaveBeenCalledWith("/gettweetbyid", {
      params: { tweetId: "123" },
    });
  });

  test("should fetch user by wallet address", async () => {
    const mockUserData = { name: "John Doe", walletAddress: "0x123" };
    axios.get.mockResolvedValue({ data: mockUserData });

    const result = await twitterAPI.fetchUserByWalletAddress("0x123");
    expect(result).toEqual(mockUserData);
    expect(axios.get).toHaveBeenCalledWith("/wallet-twitter-data", {
      params: { walletAddress: "0x123" },
    });
  });

  test("should handle API errors gracefully", async () => {
    axios.get.mockRejectedValue({
      response: {
        data: { message: "User not found" },
        status: 404,
      },
    });

    await expect(
      twitterAPI.fetchUserByUsername("nonexistentuser")
    ).rejects.toThrow("Error fetching user: User not found");
  });

  test("should handle network errors gracefully", async () => {
    axios.get.mockRejectedValue(new Error("Network error"));

    await expect(twitterAPI.fetchUserByUsername("johndoe")).rejects.toThrow(
      "Error fetching user: Network error"
    );
  });
});
