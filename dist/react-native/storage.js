import { _ as __awaiter } from './tslib.es6.js';

/**
 * Storage utility for React Native
 * Wraps AsyncStorage with localStorage-like interface
 * Uses dynamic import to avoid build-time dependency
 */
// Use dynamic import to avoid build-time dependency
let AsyncStorage = null;
// In-memory fallback storage
const inMemoryStorage = new Map();
// Try to import AsyncStorage at runtime
const getAsyncStorage = () => __awaiter(void 0, void 0, void 0, function* () {
    if (!AsyncStorage) {
        try {
            // Try to import AsyncStorage dynamically
            // @ts-ignore - Dynamic import for optional dependency
            AsyncStorage = (yield import('@react-native-async-storage/async-storage')).default;
        }
        catch (error) {
            console.warn('AsyncStorage not available, using in-memory fallback:', error);
            // Fallback to in-memory storage for development/testing
            AsyncStorage = {
                getItem: (key) => __awaiter(void 0, void 0, void 0, function* () { return inMemoryStorage.get(key) || null; }),
                setItem: (key, value) => __awaiter(void 0, void 0, void 0, function* () { inMemoryStorage.set(key, value); }),
                removeItem: (key) => __awaiter(void 0, void 0, void 0, function* () { inMemoryStorage.delete(key); }),
                clear: () => __awaiter(void 0, void 0, void 0, function* () { inMemoryStorage.clear(); }),
                getAllKeys: () => __awaiter(void 0, void 0, void 0, function* () { return Array.from(inMemoryStorage.keys()); }),
                multiGet: (keys) => __awaiter(void 0, void 0, void 0, function* () { return keys.map(key => [key, inMemoryStorage.get(key) || null]); }),
                multiSet: (keyValuePairs) => __awaiter(void 0, void 0, void 0, function* () {
                    keyValuePairs.forEach(([key, value]) => inMemoryStorage.set(key, value));
                }),
                multiRemove: (keys) => __awaiter(void 0, void 0, void 0, function* () {
                    keys.forEach(key => inMemoryStorage.delete(key));
                }),
            };
        }
    }
    return AsyncStorage;
});
class Storage {
    static getItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storage = yield getAsyncStorage();
                return yield storage.getItem(key);
            }
            catch (error) {
                console.error('Error getting item from storage:', error);
                return null;
            }
        });
    }
    static setItem(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storage = yield getAsyncStorage();
                yield storage.setItem(key, value);
            }
            catch (error) {
                console.error('Error setting item in storage:', error);
            }
        });
    }
    static removeItem(key) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storage = yield getAsyncStorage();
                yield storage.removeItem(key);
            }
            catch (error) {
                console.error('Error removing item from storage:', error);
            }
        });
    }
    static multiGet(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storage = yield getAsyncStorage();
                return yield storage.multiGet(keys);
            }
            catch (error) {
                console.error('Error getting multiple items from storage:', error);
                return keys.map(key => [key, null]);
            }
        });
    }
    static multiSet(keyValuePairs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storage = yield getAsyncStorage();
                yield storage.multiSet(keyValuePairs);
            }
            catch (error) {
                console.error('Error setting multiple items in storage:', error);
            }
        });
    }
    static multiRemove(keys) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const storage = yield getAsyncStorage();
                yield storage.multiRemove(keys);
            }
            catch (error) {
                console.error('Error removing multiple items from storage:', error);
            }
        });
    }
}

export { Storage };
