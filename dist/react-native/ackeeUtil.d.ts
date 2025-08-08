/**
The MIT License (MIT)

Copyright (c) Tobias Reich

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/
interface Options {
    detailed?: boolean;
    ignoreLocalhost?: boolean;
    ignoreOwnVisits?: boolean;
}
interface Attributes {
    siteLocation: string;
    siteReferrer: string;
    source?: string;
    siteLanguage?: string;
    screenWidth?: number;
    screenHeight?: number;
    screenColorDepth?: number;
    browserWidth?: number;
    browserHeight?: number;
}
/**
 * Gathers all platform-, screen- and user-related information.
 * @param {Boolean} detailed - Include personal data.
 * @returns {Object} attributes - User-related information.
 */
export declare const attributes: (detailed?: boolean) => Attributes;
/**
 * Looks for an element with Ackee attributes and executes Ackee with the given attributes.
 * Fails silently.
 */
export declare const detect: () => void;
/**
 * Creates a new instance.
 * @param {String} server - URL of the Ackee server.
 * @param {?Object} opts
 * @returns {Object} instance
 */
export declare const create: (server: string, opts?: Options) => {
    record: (domainId: string, attrs?: Attributes, next?: (recordId: string) => void) => {
        stop: () => void;
    };
    updateRecord: (recordId: string) => {
        stop: () => void;
    };
    action: (eventId: string, attrs: any, next?: (actionId: string) => void) => void;
    updateAction: (actionId: string, attrs: any) => void;
};
export {};
