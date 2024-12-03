const { Auth } = require("../dist/core.cjs");
class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }
}
describe("Auth Class", () => {
  let auth;
  const clientId = "test-client-id";
  const redirectUri = "http://localhost";

  beforeEach(() => {
    auth = new Auth({ clientId, redirectUri });
    global.localStorage = new LocalStorageMock();
    global.window = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      location: {
        href: "http://localhost",
      },
      dispatchEvent: jest.fn(),
    };
  });

  test("should throw error if clientId is not provided", () => {
    expect(() => new Auth({})).toThrow("clientId is required");
  });

  test("should initialize with correct properties", () => {
    expect(auth.clientId).toBe(clientId);
    expect(auth.redirectUri).toEqual({
      twitter: redirectUri,
      discord: redirectUri,
      spotify: redirectUri,
    });
    expect(auth.isAuthenticated).toBe(false);
  });

  test("should set loading state", () => {
    const mockCallback = jest.fn();
    auth.on("state", mockCallback);
    auth.setLoading(true);
    expect(mockCallback).toHaveBeenCalledWith("loading");
  });

  test("should set provider", () => {
    const provider = { name: "test-provider", request: jest.fn() };
    const info = { name: "test-info" };
    auth.setProvider({ provider, info });
    expect(auth.viem).not.toBeNull();
  });

  test("should set wallet address", () => {
    const walletAddress = "0x123";
    auth.setWalletAddress(walletAddress);
    expect(auth.walletAddress).toBe(walletAddress);
  });

  test("should disconnect user", async () => {
    localStorage.setItem("camp-sdk:wallet-address", "0x123");
    localStorage.setItem("camp-sdk:user-id", "user-id");
    localStorage.setItem("camp-sdk:jwt", "jwt-token");
    await auth.disconnect();
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.walletAddress).toBeNull();
    expect(auth.userId).toBeNull();
    expect(auth.jwt).toBeNull();
  });

  test("should throw error if user is not authenticated when linking socials", () => {
    expect(() => auth.linkTwitter()).toThrow("User needs to be authenticated");
    expect(() => auth.linkDiscord()).toThrow("User needs to be authenticated");
    expect(() => auth.linkSpotify()).toThrow("User needs to be authenticated");
  });
});
