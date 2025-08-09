/**
 * Storage utility for React Native
 * Wraps AsyncStorage with localStorage-like interface
 * Uses dynamic import to avoid build-time dependency
 */

// Use dynamic import to avoid build-time dependency
let AsyncStorage: any = null;

// In-memory fallback storage
const inMemoryStorage = new Map<string, string>();

// Try to import AsyncStorage at runtime
const getAsyncStorage = async () => {
  if (!AsyncStorage) {
    try {
      // Try to import AsyncStorage dynamically
      // @ts-ignore - Dynamic import for optional dependency
      AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    } catch (error) {
      console.warn('AsyncStorage not available, using in-memory fallback:', error);
      // Fallback to in-memory storage for development/testing
      AsyncStorage = {
        getItem: async (key: string) => inMemoryStorage.get(key) || null,
        setItem: async (key: string, value: string) => { inMemoryStorage.set(key, value); },
        removeItem: async (key: string) => { inMemoryStorage.delete(key); },
        clear: async () => { inMemoryStorage.clear(); },
        getAllKeys: async () => Array.from(inMemoryStorage.keys()),
        multiGet: async (keys: string[]) => keys.map(key => [key, inMemoryStorage.get(key) || null]),
        multiSet: async (keyValuePairs: [string, string][]) => {
          keyValuePairs.forEach(([key, value]) => inMemoryStorage.set(key, value));
        },
        multiRemove: async (keys: string[]) => {
          keys.forEach(key => inMemoryStorage.delete(key));
        },
      };
    }
  }
  return AsyncStorage;
};

export class Storage {
  static async getItem(key: string): Promise<string | null> {
    try {
      const storage = await getAsyncStorage();
      return await storage.getItem(key);
    } catch (error) {
      console.error('Error getting item from storage:', error);
      return null;
    }
  }

  static async setItem(key: string, value: string): Promise<void> {
    try {
      const storage = await getAsyncStorage();
      await storage.setItem(key, value);
    } catch (error) {
      console.error('Error setting item in storage:', error);
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      const storage = await getAsyncStorage();
      await storage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from storage:', error);
    }
  }

  static async multiGet(keys: string[]): Promise<Array<[string, string | null]>> {
    try {
      const storage = await getAsyncStorage();
      return await storage.multiGet(keys);
    } catch (error) {
      console.error('Error getting multiple items from storage:', error);
      return keys.map(key => [key, null]);
    }
  }

  static async multiSet(keyValuePairs: Array<[string, string]>): Promise<void> {
    try {
      const storage = await getAsyncStorage();
      await storage.multiSet(keyValuePairs);
    } catch (error) {
      console.error('Error setting multiple items in storage:', error);
    }
  }

  static async multiRemove(keys: string[]): Promise<void> {
    try {
      const storage = await getAsyncStorage();
      await storage.multiRemove(keys);
    } catch (error) {
      console.error('Error removing multiple items from storage:', error);
    }
  }
}
