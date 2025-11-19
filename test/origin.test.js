const { Auth } = require("../dist/core.cjs");
const fetchMock = require("jest-fetch-mock");

describe("Origin Integration", () => {
  let auth;
  const clientId = "test-client-id";
  const redirectUri = "http://localhost";

  beforeAll(() => {
    fetchMock.enableMocks();
  });

  beforeEach(async () => {
    fetchMock.resetMocks();
    global.localStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
    };
    auth = new Auth({ clientId, redirectUri });
    auth.environment = {
      ...auth.environment,
      AUTH_HUB_BASE_API: "https://api",
      AUTH_ENDPOINT: "auth",
    };
    auth.viem = {
      requestAddresses: jest
        .fn()
        .mockResolvedValue(["0xAbCDEFabcdefABCDEFabcdefABCDEFabcdefABCD"]),
      signMessage: jest.fn().mockResolvedValue("0xsignature"),
      chain: { id: 1 },
      request: jest
        .fn()
        .mockResolvedValue(["0xAbCDEFabcdefABCDEFabcdefABCDEFabcdefABCD"]),
    };
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
    global.atob = jest.fn(() => JSON.stringify({ id: "user-id" }));
    // Mock fetch for nonce and verifySignature during connect
    fetchMock
      .mockResponseOnce(JSON.stringify({ data: "nonce123" })) // #fetchNonce
      .mockResponseOnce(
        JSON.stringify({ data: "header.payload.signature", isError: false })
      ); // #verifySignature
    auth.walletAddress = "0xAbCDEFabcdefABCDEFabcdefABCDEFabcdefABCD";
    await auth.connect();
    // Now auth.origin is set
  });

  test("getData returns data for tokenId", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({ data: { tokenId: 123, name: "test" } })
    );
    const data = await auth.origin.getData(123n);
    expect(data.data).toEqual({ tokenId: 123, name: "test" });
  });

  test("getJwt returns jwt", () => {
    expect(auth.origin.getJwt()).toBe(auth.jwt);
  });

  test("setViemClient sets viemClient", () => {
    const viemMock = { foo: "bar" };
    auth.origin.setViemClient(viemMock);
    // Accessing private field is not possible, but we can check no error thrown
    expect(() => auth.origin.setViemClient(viemMock)).not.toThrow();
  });

  test("claimRoyalties throws if no accounts found", async () => {
    auth.origin.setViemClient({ request: jest.fn().mockResolvedValue([]) });
    await expect(auth.origin.claimRoyalties()).rejects.toThrow(
      "No accounts found in connected wallet"
    );
  });
});
