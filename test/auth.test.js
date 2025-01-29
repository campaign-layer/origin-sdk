const { Auth } = require("../dist/core.cjs");
const xmlhttprequest = require("xmlhttprequest");
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
    auth = new Auth({ clientId, redirectUri, allowAnalytics: false });
    global.localStorage = new LocalStorageMock();
    global.navigator = {
      userAgent: "node.js",
      platform: "node",
      appName: "Netscape",
      appVersion: "5.0 (Windows)",
      onLine: true,
      language: "en-US",
      languages: ["en-US", "en"],
    };
    global.location = {
      href: "http://localhost",
    };
    global.window = {
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      location: {
        href: "http://localhost",
      },
      dispatchEvent: jest.fn(),
    };
    global.XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
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
    auth.isAuthenticated = true;
    localStorage.setItem("camp-sdk:wallet-address", "0x123");
    localStorage.setItem("camp-sdk:user-id", "user-id");
    localStorage.setItem("camp-sdk:jwt", "jwt-token");
    await auth.disconnect();
    expect(auth.isAuthenticated).toBe(false);
    expect(auth.walletAddress).toBeNull();
    expect(auth.userId).toBeNull();
    expect(auth.jwt).toBeNull();
  });

  test("should throw error if user is not authenticated when linking socials", async () => {
    await expect(auth.linkTwitter()).rejects.toThrow(
      "User needs to be authenticated"
    );
  });
});
