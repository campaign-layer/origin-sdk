const { Auth } = require("../dist/core.cjs");
const fetchMock = require("jest-fetch-mock");

describe("Auth Integration", () => {
  let auth;
  const clientId = "test-client-id";
  const redirectUri = "http://localhost";

  beforeAll(() => {
    fetchMock.enableMocks();
  });

  beforeEach(() => {
    fetchMock.resetMocks();
    auth = new Auth({ clientId, redirectUri });
    // Mock viem client
    auth.viem = {
      requestAddresses: jest
        .fn()
        .mockResolvedValue(["0xAbCDEFabcdefABCDEFabcdefABCDEFabcdefABCD"]),
      signMessage: jest.fn().mockResolvedValue("0xsignature"),
      chain: { id: 1 },
    };
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    // Mock window object
    global.window = {
      location: {
        href: "http://localhost",
        host: "localhost",
        origin: "http://localhost",
      },
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    };
  });

  test("connect flow: fetch nonce, sign message, verify signature", async () => {
    fetchMock
      .mockResponseOnce(JSON.stringify({ data: "nonce123" })) // #fetchNonce
      .mockResponseOnce(
        JSON.stringify({ data: "header.payload.signature", isError: false })
      ); // #verifySignature

    // Mock atob for JWT decoding
    global.atob = jest.fn(() => JSON.stringify({ id: "user-id" }));

    auth.walletAddress = "0xAbCDEFabcdefABCDEFabcdefABCDEFabcdefABCD";
    const result = await auth.connect();
    expect(result.success).toBe(true);
    expect(auth.isAuthenticated).toBe(true);
    expect(auth.userId).toBe("user-id");
    expect(auth.jwt).toBe("header.payload.signature");
  });

  test("getLinkedSocials returns correct data", async () => {
    auth.isAuthenticated = true;
    auth.jwt = "jwt";
    fetchMock.mockResponseOnce(
      JSON.stringify({
        isError: false,
        data: { data: { twitterUser: true, spotifyUser: false } },
      })
    );
    const socials = await auth.getLinkedSocials();
    expect(socials).toEqual({ twitter: true, spotify: false });
  });

  test("linkTwitter redirects when authenticated", async () => {
    auth.isAuthenticated = true;
    auth.userId = "user-id";
    auth.clientId = clientId;
    auth.redirectUri = { twitter: "http://localhost" };
    auth.environment = {
      ...auth.environment,
      AUTH_HUB_BASE_API: "https://api",
      AUTH_ENDPOINT: "auth",
    };
    global.window.location.href = "";
    await auth.linkTwitter();
    expect(global.window.location.href).toContain("/twitter/connect");
  });

  test("linkSpotify redirects when authenticated", async () => {
    auth.isAuthenticated = true;
    auth.userId = "user-id";
    auth.clientId = clientId;
    auth.redirectUri = { spotify: "http://localhost" };
    auth.environment = {
      ...auth.environment,
      AUTH_HUB_BASE_API: "https://api",
      AUTH_ENDPOINT: "auth",
    };
    global.window.location.href = "";
    await auth.linkSpotify();
    expect(global.window.location.href).toContain("/spotify/connect");
  });

  test("linkTikTok returns data when authenticated", async () => {
    auth.isAuthenticated = true;
    auth.userId = "user-id";
    auth.clientId = clientId;
    auth.jwt = "jwt";
    fetchMock.mockResponseOnce(
      JSON.stringify({ isError: false, data: { tiktok: true } })
    );
    const result = await auth.linkTikTok("handle");
    expect(result).toEqual({ tiktok: true });
  });

  test("linkTikTok throws error on 502", async () => {
    auth.isAuthenticated = true;
    auth.userId = "user-id";
    auth.clientId = clientId;
    auth.jwt = "jwt";
    fetchMock.mockResponseOnce(
      JSON.stringify({
        isError: true,
        message: "Request failed with status code 502",
      })
    );
    await expect(auth.linkTikTok("handle")).rejects.toThrow(
      "TikTok service is currently unavailable"
    );
  });

  test("unlinkTwitter returns data when authenticated", async () => {
    auth.isAuthenticated = true;
    auth.userId = "user-id";
    auth.clientId = clientId;
    auth.jwt = "jwt";
    fetchMock.mockResponseOnce(
      JSON.stringify({ isError: false, data: { twitter: false } })
    );
    const result = await auth.unlinkTwitter();
    expect(result).toEqual({ twitter: false });
  });

  test("unlinkSpotify returns data when authenticated", async () => {
    auth.isAuthenticated = true;
    auth.userId = "user-id";
    auth.clientId = clientId;
    auth.jwt = "jwt";
    fetchMock.mockResponseOnce(
      JSON.stringify({ isError: false, data: { spotify: false } })
    );
    const result = await auth.unlinkSpotify();
    expect(result).toEqual({ spotify: false });
  });

  test("unlinkTikTok returns data when authenticated", async () => {
    auth.isAuthenticated = true;
    auth.userId = "user-id";
    auth.clientId = clientId;
    auth.jwt = "jwt";
    fetchMock.mockResponseOnce(
      JSON.stringify({ isError: false, data: { tiktok: false } })
    );
    const result = await auth.unlinkTikTok();
    expect(result).toEqual({ tiktok: false });
  });

  test("recoverProvider does not throw when walletAddress is missing", async () => {
    auth.walletAddress = null;
    await expect(auth.recoverProvider()).resolves.toBeUndefined();
  });
});
