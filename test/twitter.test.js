const { TwitterAPI } = require("../dist/core.cjs");

describe("TwitterAPI", () => {
  let twitterAPI;

  beforeAll(() => {
    twitterAPI = new TwitterAPI({ apiKey: "test-api-key" });
  });

  test("fetchUserByUsername should fetch user details", async () => {
    const mockResponse = { id: "123", name: "testuser" };
    jest
      .spyOn(twitterAPI, "_fetchDataWithAuth")
      .mockResolvedValue(mockResponse);

    const result = await twitterAPI.fetchUserByUsername("testuser");
    expect(result).toEqual(mockResponse);
  });

  test("fetchTweetsByUsername should fetch tweets", async () => {
    const mockResponse = { tweets: [] };
    jest
      .spyOn(twitterAPI, "_fetchDataWithAuth")
      .mockResolvedValue(mockResponse);

    const result = await twitterAPI.fetchTweetsByUsername("testuser");
    expect(result).toEqual(mockResponse);
  });

  test("fetchFollowersByUsername should fetch followers", async () => {
    const mockResponse = { followers: [] };
    jest
      .spyOn(twitterAPI, "_fetchDataWithAuth")
      .mockResolvedValue(mockResponse);

    const result = await twitterAPI.fetchFollowersByUsername("testuser");
    expect(result).toEqual(mockResponse);
  });

  test("fetchFollowingByUsername should fetch following", async () => {
    const mockResponse = { following: [] };
    jest
      .spyOn(twitterAPI, "_fetchDataWithAuth")
      .mockResolvedValue(mockResponse);

    const result = await twitterAPI.fetchFollowingByUsername("testuser");
    expect(result).toEqual(mockResponse);
  });

  test("fetchTweetById should fetch a tweet by ID", async () => {
    const mockResponse = { id: "tweet123", text: "Hello World" };
    jest
      .spyOn(twitterAPI, "_fetchDataWithAuth")
      .mockResolvedValue(mockResponse);

    const result = await twitterAPI.fetchTweetById("tweet123");
    expect(result).toEqual(mockResponse);
  });

  test("fetchUserByWalletAddress should fetch user data by wallet address", async () => {
    const mockResponse = { id: "user123", walletAddress: "0x123" };
    jest
      .spyOn(twitterAPI, "_fetchDataWithAuth")
      .mockResolvedValue(mockResponse);

    const result = await twitterAPI.fetchUserByWalletAddress("0x123");
    expect(result).toEqual(mockResponse);
  });

  test("fetchRepostedByUsername should fetch reposted tweets", async () => {
    const mockResponse = { reposts: [] };
    jest
      .spyOn(twitterAPI, "_fetchDataWithAuth")
      .mockResolvedValue(mockResponse);

    const result = await twitterAPI.fetchRepostedByUsername("testuser");
    expect(result).toEqual(mockResponse);
  });

  test("fetchRepliesByUsername should fetch replies", async () => {
    const mockResponse = { replies: [] };
    jest
      .spyOn(twitterAPI, "_fetchDataWithAuth")
      .mockResolvedValue(mockResponse);

    const result = await twitterAPI.fetchRepliesByUsername("testuser");
    expect(result).toEqual(mockResponse);
  });

  test("fetchLikesByUsername should fetch likes", async () => {
    const mockResponse = { likes: [] };
    jest
      .spyOn(twitterAPI, "_fetchDataWithAuth")
      .mockResolvedValue(mockResponse);

    const result = await twitterAPI.fetchLikesByUsername("testuser");
    expect(result).toEqual(mockResponse);
  });

  test("fetchFollowsByUsername should fetch follows", async () => {
    const mockResponse = { follows: [] };
    jest
      .spyOn(twitterAPI, "_fetchDataWithAuth")
      .mockResolvedValue(mockResponse);

    const result = await twitterAPI.fetchFollowsByUsername("testuser");
    expect(result).toEqual(mockResponse);
  });

  test("fetchViewedTweetsByUsername should fetch viewed tweets", async () => {
    const mockResponse = { views: [] };
    jest
      .spyOn(twitterAPI, "_fetchDataWithAuth")
      .mockResolvedValue(mockResponse);

    const result = await twitterAPI.fetchViewedTweetsByUsername("testuser");
    expect(result).toEqual(mockResponse);
  });
});
