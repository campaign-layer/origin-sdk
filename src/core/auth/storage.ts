export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

/**
 * Browser localStorage adapter
 */
export class BrowserStorage implements StorageAdapter {
  async getItem(key: string): Promise<string | null> {
    if (typeof localStorage === "undefined") {
      return null;
    }
    return localStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, value);
    }
  }

  async removeItem(key: string): Promise<void> {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem(key);
    }
  }
}

/**
 * In-memory storage adapter for Node.js
 */
export class MemoryStorage implements StorageAdapter {
  private storage: Map<string, string> = new Map();

  async getItem(key: string): Promise<string | null> {
    return this.storage.get(key) || null;
  }

  async setItem(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  clear(): void {
    this.storage.clear();
  }
}
