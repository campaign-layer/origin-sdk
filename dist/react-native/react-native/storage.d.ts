/**
 * Storage utility for React Native
 * Wraps AsyncStorage with localStorage-like interface
 * Uses dynamic import to avoid build-time dependency
 */
export declare class Storage {
    static getItem(key: string): Promise<string | null>;
    static setItem(key: string, value: string): Promise<void>;
    static removeItem(key: string): Promise<void>;
    static multiGet(keys: string[]): Promise<Array<[string, string | null]>>;
    static multiSet(keyValuePairs: Array<[string, string]>): Promise<void>;
    static multiRemove(keys: string[]): Promise<void>;
}
