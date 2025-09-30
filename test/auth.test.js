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
      spotify: redirectUri,
      twitter: redirectUri,
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
    await expect(auth.linkTwitter()).rejects.toThrow("User needs to be authenticated");
    await expect(auth.linkSpotify()).rejects.toThrow("User needs to be authenticated");
    await expect(auth.linkTikTok("handle")).rejects.toThrow("User needs to be authenticated");
  });

  test("should throw error if user is not authenticated when unlinking socials", async () => {
    await expect(auth.unlinkTwitter()).rejects.toThrow();
    await expect(auth.unlinkSpotify()).rejects.toThrow();
    await expect(auth.unlinkTikTok()).rejects.toThrow();
  });

  test("should throw error if not authenticated for getLinkedSocials", async () => {
    await expect(auth.getLinkedSocials()).rejects.toThrow("User needs to be authenticated");
  });

  test("should trigger and unsubscribe events", () => {
    const cb = jest.fn();
    auth.on("state", cb);
    auth.setLoading(true);
    expect(cb).toHaveBeenCalledWith("loading");
    auth.off("state", cb);
    auth.setLoading(false);
    expect(cb).toHaveBeenCalledTimes(1);
  });

  test("should set provider and trigger viem/provider events", () => {
    const viemCb = jest.fn();
    const providerCb = jest.fn();
    auth.on("viem", viemCb);
    auth.on("provider", providerCb);
    const provider = { name: "test-provider", request: jest.fn() };
    const info = { name: "test-info" };
    auth.setProvider({ provider, info });
    expect(viemCb).toHaveBeenCalled();
    expect(providerCb).toHaveBeenCalledWith({ provider, info });
  });

  test("should set and recover wallet address", async () => {
    auth.walletAddress = "0x123";
    localStorage.setItem("camp-sdk:provider", JSON.stringify({ name: "test-provider" }));
    await expect(auth.recoverProvider()).resolves.toBeUndefined();
  });
});
