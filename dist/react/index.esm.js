'use client';
import React, { createContext, useState, useContext, useLayoutEffect, useEffect, useRef, useSyncExternalStore } from 'react';
import { Auth } from '../core.esm';
import { WagmiContext, useAccount, useConnectorClient } from 'wagmi';
import 'axios';
import 'viem';
import 'viem/accounts';
import 'viem/siwe';
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';

const ModalContext = createContext({
    isButtonDisabled: false,
    setIsButtonDisabled: () => { },
    isVisible: false,
    setIsVisible: () => { },
    isLinkingVisible: false,
    setIsLinkingVisible: () => { },
    currentlyLinking: null,
    setCurrentlyLinking: () => { },
});
const ModalProvider = ({ children }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isLinkingVisible, setIsLinkingVisible] = useState(false);
    const [currentlyLinking, setCurrentlyLinking] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    return (React.createElement(ModalContext.Provider, { value: {
            isButtonDisabled,
            setIsButtonDisabled,
            isVisible,
            setIsVisible,
            isLinkingVisible,
            setIsLinkingVisible,
            currentlyLinking,
            setCurrentlyLinking,
        } }, children));
};

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */


function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 * Formats an Ethereum address by truncating it to the first and last n characters.
 * @param {string} address - The Ethereum address to format.
 * @param {number} n - The number of characters to keep from the start and end of the address.
 * @return {string} - The formatted address.
 */
const formatAddress = (address, n = 8) => {
    return `${address.slice(0, n)}...${address.slice(-n)}`;
};
/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @return {string} - The capitalized string.
 */
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
/**
 * Formats a Camp amount to a human-readable string.
 * @param {number} amount - The Camp amount to format.
 * @returns {string} - The formatted Camp amount.
 */
const formatCampAmount = (amount) => {
    if (amount >= 1000) {
        const formatted = (amount / 1000).toFixed(1);
        return formatted.endsWith(".0")
            ? formatted.slice(0, -2) + "k"
            : formatted + "k";
    }
    return amount.toString();
};

const testnet = {
    id: 325000,
    name: "Camp Network Testnet V2",
    nativeCurrency: {
        decimals: 18,
        name: "Ether",
        symbol: "ETH",
    },
    rpcUrls: {
        default: {
            http: ["https://rpc-campnetwork.xyz"],
        },
    },
    blockExplorers: {
        default: {
            name: "Explorer",
            url: "https://camp-network-testnet.blockscout.com",
        },
    },
};

var constants = {
    SIWE_MESSAGE_STATEMENT: "Connect with Camp Network",
    AUTH_HUB_BASE_API: "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev",
    AVAILABLE_SOCIALS: ["twitter", "discord", "spotify", "tiktok", "telegram"],
    ACKEE_INSTANCE: "https://ackee-production-01bd.up.railway.app",
    ACKEE_EVENTS: {
        USER_CONNECTED: "ed42542d-b676-4112-b6d9-6db98048b2e0",
        USER_DISCONNECTED: "20af31ac-e602-442e-9e0e-b589f4dd4016",
        TWITTER_LINKED: "7fbea086-90ef-4679-ba69-f47f9255b34c",
        DISCORD_LINKED: "d73f5ae3-a8e8-48f2-8532-85e0c7780d6a",
        SPOTIFY_LINKED: "fc1788b4-c984-42c8-96f4-c87f6bb0b8f7",
        TIKTOK_LINKED: "4a2ffdd3-f0e9-4784-8b49-ff76ec1c0a6a",
        TELEGRAM_LINKED: "9006bc5d-bcc9-4d01-a860-4f1a201e8e47",
    },
};

let providers = [];
const providerStore = {
    value: () => providers,
    subscribe: (callback) => {
        function onAnnouncement(event) {
            if (providers.some((p) => p.info.uuid === event.detail.info.uuid))
                return;
            providers = [...providers, event.detail];
            callback(providers);
        }
        if (typeof window === "undefined")
            return;
        window.addEventListener("eip6963:announceProvider", onAnnouncement);
        window.dispatchEvent(new Event("eip6963:requestProvider"));
        return () => window.removeEventListener("eip6963:announceProvider", onAnnouncement);
    },
};

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
const isBrowser = typeof window !== "undefined";
const navigator = isBrowser
    ? window === null || window === void 0 ? void 0 : window.navigator
    : {
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
        language: "en",
        languages: [],
        platform: "",
        vendor: "",
        maxTouchPoints: 0,
        hardwareConcurrency: 0,
        deviceMemory: 0,
    };
const location = isBrowser
    ? window === null || window === void 0 ? void 0 : window.location
    : {
        href: "",
        protocol: "",
        host: "",
        hostname: "",
        port: "",
        pathname: "",
        search: "",
        hash: "",
    };
/**
 * Validates options and sets defaults for undefined properties.
 * @param {?Object} opts
 * @returns {Object} opts - Validated options.
 */
const validate = function (opts = {}) {
    // Create new object to avoid changes by reference
    const _opts = {};
    // Defaults to false
    _opts.detailed = opts.detailed === true;
    // Defaults to true
    _opts.ignoreLocalhost = opts.ignoreLocalhost !== false;
    // Defaults to true
    _opts.ignoreOwnVisits = opts.ignoreOwnVisits !== false;
    return _opts;
};
/**
 * Determines if a host is a localhost.
 * @param {String} hostname - Hostname that should be tested.
 * @returns {Boolean} isLocalhost
 */
const isLocalhost = function (hostname) {
    return (hostname === "" ||
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "::1");
};
/**
 * Determines if user agent is a bot. Approach is to get most bots, assuming other bots don't run JS.
 * Source: https://stackoverflow.com/questions/20084513/detect-search-crawlers-via-javascript/20084661
 * @param {String} userAgent - User agent that should be tested.
 * @returns {Boolean} isBot
 */
const isBot = function (userAgent) {
    return /bot|crawler|spider|crawling/i.test(userAgent);
};
/**
 * Checks if an id is a fake id. This is the case when Ackee ignores you because of the `ackee_ignore` cookie.
 * @param {String} id - Id that should be tested.
 * @returns {Boolean} isFakeId
 */
const isFakeId = function (id) {
    return id === "88888888-8888-8888-8888-888888888888";
};
/**
 * Checks if the website is in background (e.g. user has minimzed or switched tabs).
 * @returns {boolean}
 */
const isInBackground = function () {
    return document.visibilityState === "hidden";
};
/**
 * Get the optional source parameter.
 * @returns {String} source
 */
const source = function () {
    const source = (location.search.split(`source=`)[1] || "").split("&")[0];
    return source === "" ? undefined : source;
};
/**
 * Gathers all platform-, screen- and user-related information.
 * @param {Boolean} detailed - Include personal data.
 * @returns {Object} attributes - User-related information.
 */
const attributes = function (detailed = false) {
    var _a;
    const defaultData = {
        siteLocation: (_a = window === null || window === void 0 ? void 0 : window.location) === null || _a === void 0 ? void 0 : _a.href,
        siteReferrer: document.referrer,
        source: source(),
    };
    const detailedData = {
        siteLanguage: navigator
            ? ((navigator === null || navigator === void 0 ? void 0 : navigator.language) || (navigator === null || navigator === void 0 ? void 0 : navigator.language) || "").substr(0, 2)
            : "",
        screenWidth: screen.width,
        screenHeight: screen.height,
        screenColorDepth: screen.colorDepth,
        browserWidth: window === null || window === void 0 ? void 0 : window.outerWidth,
        browserHeight: window === null || window === void 0 ? void 0 : window.outerHeight,
    };
    return Object.assign(Object.assign({}, defaultData), (detailed === true ? detailedData : {}));
};
/**
 * Creates an object with a query and variables property to create a record on the server.
 * @param {String} domainId - Id of the domain.
 * @param {Object} input - Data that should be transferred to the server.
 * @returns {Object} Create record body.
 */
const createRecordBody = function (domainId, input) {
    return {
        query: `
			mutation createRecord($domainId: ID!, $input: CreateRecordInput!) {
				createRecord(domainId: $domainId, input: $input) {
					payload {
						id
					}
				}
			}
		`,
        variables: {
            domainId,
            input,
        },
    };
};
/**
 * Creates an object with a query and variables property to update a record on the server.
 * @param {String} recordId - Id of the record.
 * @returns {Object} Update record body.
 */
const updateRecordBody = function (recordId) {
    return {
        query: `
			mutation updateRecord($recordId: ID!) {
				updateRecord(id: $recordId) {
					success
				}
			}
		`,
        variables: {
            recordId,
        },
    };
};
/**
 * Creates an object with a query and variables property to create an action on the server.
 * @param {String} eventId - Id of the event.
 * @param {Object} input - Data that should be transferred to the server.
 * @returns {Object} Create action body.
 */
const createActionBody = function (eventId, input) {
    return {
        query: `
			mutation createAction($eventId: ID!, $input: CreateActionInput!) {
				createAction(eventId: $eventId, input: $input) {
					payload {
						id
					}
				}
			}
		`,
        variables: {
            eventId,
            input,
        },
    };
};
/**
 * Creates an object with a query and variables property to update an action on the server.
 * @param {String} actionId - Id of the action.
 * @param {Object} input - Data that should be transferred to the server.
 * @returns {Object} Update action body.
 */
const updateActionBody = function (actionId, input) {
    return {
        query: `
			mutation updateAction($actionId: ID!, $input: UpdateActionInput!) {
				updateAction(id: $actionId, input: $input) {
					success
				}
			}
		`,
        variables: {
            actionId,
            input,
        },
    };
};
/**
 * Construct URL to the GraphQL endpoint of Ackee.
 * @param {String} server - URL of the Ackee server.
 * @returns {String} endpoint - URL to the GraphQL endpoint of the Ackee server.
 */
const endpoint = function (server) {
    const hasTrailingSlash = server.substr(-1) === "/";
    return server + (hasTrailingSlash === true ? "" : "/") + "api";
};
/**
 * Sends a request to a specified URL.
 * Won't catch all errors as some are already logged by the browser.
 * In this case the callback won't fire.
 * @param {String} url - URL to the GraphQL endpoint of the Ackee server.
 * @param {Object} body - JSON which will be send to the server.
 * @param {Object} opts - Options.
 * @param {?Function} next - The callback that handles the response. Receives the following properties: json.
 */
const send = function (url, body, opts, next) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.onload = () => {
        if (xhr.status !== 200) {
            throw new Error("Server returned with an unhandled status");
        }
        let json = null;
        try {
            json = JSON.parse(xhr.responseText);
        }
        catch (e) {
            throw new Error("Failed to parse response from server");
        }
        if (json.errors != null) {
            throw new Error(json.errors[0].message);
        }
        if (typeof next === "function") {
            return next(json);
        }
    };
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    //   xhr.withCredentials = opts.ignoreOwnVisits ?? false;
    xhr.withCredentials = false;
    xhr.send(JSON.stringify(body));
};
/**
 * Looks for an element with Ackee attributes and executes Ackee with the given attributes.
 * Fails silently.
 */
const detect = function () {
    const elem = document.querySelector("[data-ackee-domain-id]");
    if (elem == null)
        return;
    const server = elem.getAttribute("data-ackee-server") || "";
    const domainId = elem.getAttribute("data-ackee-domain-id") || "";
    const opts = elem.getAttribute("data-ackee-opts") || "{}";
    create(server, JSON.parse(opts)).record(domainId);
};
/**
 * Creates a new instance.
 * @param {String} server - URL of the Ackee server.
 * @param {?Object} opts
 * @returns {Object} instance
 */
const create = function (server, opts) {
    opts = validate(opts);
    const url = endpoint(server);
    const noop = () => { };
    // Fake instance when Ackee ignores you
    const fakeInstance = {
        record: () => ({ stop: noop }),
        updateRecord: () => ({ stop: noop }),
        action: noop,
        updateAction: noop,
    };
    if (opts.ignoreLocalhost === true &&
        isLocalhost(location.hostname) === true &&
        isBrowser === true) {
        // console.warn("Ackee ignores you because you are on localhost");
        return fakeInstance;
    }
    if (isBot(navigator ? navigator.userAgent : "") === true) {
        // console.warn("Ackee ignores you because you are a bot");
        return fakeInstance;
    }
    // Creates a new record on the server and updates the record
    // very x seconds to track the duration of the visit. Tries to use
    // the default attributes when there're no custom attributes defined.
    const _record = (domainId, attrs = attributes(opts.detailed), next) => {
        // Function to stop updating the record
        let isStopped = false;
        const stop = () => {
            isStopped = true;
        };
        send(url, createRecordBody(domainId, attrs), opts, (json) => {
            const recordId = json.data.createRecord.payload.id;
            if (isFakeId(recordId) === true) {
                // return console.warn("Ackee ignores you because this is your own site");
                return;
            }
            const interval = setInterval(() => {
                if (isStopped === true) {
                    clearInterval(interval);
                    return;
                }
                if (isInBackground() === true)
                    return;
                send(url, updateRecordBody(recordId), opts);
            }, 15000);
            if (typeof next === "function") {
                return next(recordId);
            }
        });
        return { stop };
    };
    // Updates a record very x seconds to track the duration of the visit
    const _updateRecord = (recordId) => {
        // Function to stop updating the record
        let isStopped = false;
        const stop = () => {
            isStopped = true;
        };
        if (isFakeId(recordId) === true) {
            // console.warn("Ackee ignores you because this is your own site");
            return { stop };
        }
        const interval = setInterval(() => {
            if (isStopped === true) {
                clearInterval(interval);
                return;
            }
            if (isInBackground() === true)
                return;
            send(url, updateRecordBody(recordId));
        }, 15000);
        return { stop };
    };
    // Creates a new action on the server
    const _action = (eventId, attrs, next) => {
        send(url, createActionBody(eventId, attrs), opts, (json) => {
            const actionId = json.data.createAction.payload.id;
            if (isFakeId(actionId) === true) {
                // return console.warn("Ackee ignores you because this is your own site");
                return;
            }
            if (typeof next === "function") {
                return next(actionId);
            }
        });
    };
    // Updates an action
    const _updateAction = (actionId, attrs) => {
        if (isFakeId(actionId) === true) {
            // return console.warn("Ackee ignores you because this is your own site");
            return;
        }
        send(url, updateActionBody(actionId, attrs));
    };
    // Return the real instance
    return {
        record: _record,
        updateRecord: _updateRecord,
        action: _action,
        updateAction: _updateAction,
    };
};
// Only run Ackee automatically when executed in a browser environment
if (isBrowser === true) {
    detect();
}

const SocialsContext = createContext({
    query: null,
});
const SocialsProvider = ({ children }) => {
    const { authenticated } = useAuthState();
    const { auth } = useContext(CampContext);
    if (!auth) {
        throw new Error("Auth instance is not available");
    }
    const query = useQuery({
        queryKey: ["socials", authenticated],
        queryFn: () => auth.getLinkedSocials(),
    });
    return (React.createElement(SocialsContext.Provider, { value: {
            query,
        } }, children));
};

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z$3 = ".toasts-module_toast-container__Bhoiq{bottom:10px;display:flex;flex-direction:column-reverse;gap:10px;position:fixed;right:10px;z-index:1000}.toasts-module_toast__C-fnX{word-wrap:break-word;border-radius:5px;box-shadow:0 2px 10px rgba(0,0,0,.1);color:#fff;cursor:pointer;font-size:14px;max-width:300px;opacity:.9;padding:10px 20px;position:relative}.toasts-module_toast-info__ho5FH{background-color:#007bff}.toasts-module_toast-warning__KTUFG{background-color:#cc4e02}.toasts-module_toast-error__-y03G{background-color:#dc3545}.toasts-module_toast-success__qgwDJ{background-color:#28a745}.toasts-module_toast-enter__Gduwi{animation:toasts-module_toast-in__uFYoe .3s forwards}.toasts-module_toast-exit__obsng{animation:toasts-module_toast-out__-c3s6 .3s forwards}@keyframes toasts-module_toast-in__uFYoe{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes toasts-module_toast-out__-c3s6{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(20px)}}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvYXN0cy5tb2R1bGUuY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLHNDQUVFLFdBQVksQ0FHWixZQUFhLENBQ2IsNkJBQThCLENBQzlCLFFBQVMsQ0FOVCxjQUFlLENBRWYsVUFBVyxDQUNYLFlBSUYsQ0FFQSw0QkFVRSxvQkFBcUIsQ0FSckIsaUJBQWtCLENBR2xCLG9DQUF5QyxDQUZ6QyxVQUFXLENBSVgsY0FBZSxDQUhmLGNBQWUsQ0FLZixlQUFnQixDQUhoQixVQUFZLENBTFosaUJBQWtCLENBT2xCLGlCQUdGLENBRUEsaUNBQ0Usd0JBQ0YsQ0FFQSxvQ0FDRSx3QkFDRixDQUVBLGtDQUNFLHdCQUNGLENBRUEsb0NBQ0Usd0JBQ0YsQ0FFQSxrQ0FDRSxvREFDRixDQUVBLGlDQUNFLHFEQUNGLENBRUEseUNBQ0UsR0FDRSxTQUFVLENBQ1YsMEJBQ0YsQ0FDQSxHQUNFLFNBQVUsQ0FDVix1QkFDRixDQUNGLENBRUEsMENBQ0UsR0FDRSxTQUFVLENBQ1YsdUJBQ0YsQ0FDQSxHQUNFLFNBQVUsQ0FDViwwQkFDRixDQUNGIiwiZmlsZSI6InRvYXN0cy5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnRvYXN0LWNvbnRhaW5lciB7XHJcbiAgcG9zaXRpb246IGZpeGVkO1xyXG4gIGJvdHRvbTogMTBweDtcclxuICByaWdodDogMTBweDtcclxuICB6LWluZGV4OiAxMDAwO1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbi1yZXZlcnNlO1xyXG4gIGdhcDogMTBweDtcclxufVxyXG5cclxuLnRvYXN0IHtcclxuICBwYWRkaW5nOiAxMHB4IDIwcHg7XHJcbiAgYm9yZGVyLXJhZGl1czogNXB4O1xyXG4gIGNvbG9yOiAjZmZmO1xyXG4gIGZvbnQtc2l6ZTogMTRweDtcclxuICBib3gtc2hhZG93OiAwIDJweCAxMHB4IHJnYmEoMCwgMCwgMCwgMC4xKTtcclxuICBvcGFjaXR5OiAwLjk7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBtYXgtd2lkdGg6IDMwMHB4O1xyXG4gIHdvcmQtd3JhcDogYnJlYWstd29yZDtcclxufVxyXG5cclxuLnRvYXN0LWluZm8ge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDdiZmY7XHJcbn1cclxuXHJcbi50b2FzdC13YXJuaW5nIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2M0ZTAyO1xyXG59XHJcblxyXG4udG9hc3QtZXJyb3Ige1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNkYzM1NDU7XHJcbn1cclxuXHJcbi50b2FzdC1zdWNjZXNzIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMjhhNzQ1O1xyXG59XHJcblxyXG4udG9hc3QtZW50ZXIge1xyXG4gIGFuaW1hdGlvbjogdG9hc3QtaW4gMC4zcyBmb3J3YXJkcztcclxufVxyXG5cclxuLnRvYXN0LWV4aXQge1xyXG4gIGFuaW1hdGlvbjogdG9hc3Qtb3V0IDAuM3MgZm9yd2FyZHM7XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgdG9hc3QtaW4ge1xyXG4gIGZyb20ge1xyXG4gICAgb3BhY2l0eTogMDtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgyMHB4KTtcclxuICB9XHJcbiAgdG8ge1xyXG4gICAgb3BhY2l0eTogMTtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcclxuICB9XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgdG9hc3Qtb3V0IHtcclxuICBmcm9tIHtcclxuICAgIG9wYWNpdHk6IDE7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMCk7XHJcbiAgfVxyXG4gIHRvIHtcclxuICAgIG9wYWNpdHk6IDA7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoMjBweCk7XHJcbiAgfVxyXG59XHJcbiJdfQ== */";
var styles$2 = {"toast-container":"toasts-module_toast-container__Bhoiq","toast":"toasts-module_toast__C-fnX","toast-info":"toasts-module_toast-info__ho5FH","toast-warning":"toasts-module_toast-warning__KTUFG","toast-error":"toasts-module_toast-error__-y03G","toast-success":"toasts-module_toast-success__qgwDJ","toast-enter":"toasts-module_toast-enter__Gduwi","toast-in":"toasts-module_toast-in__uFYoe","toast-exit":"toasts-module_toast-exit__obsng","toast-out":"toasts-module_toast-out__-c3s6"};
styleInject(css_248z$3);

var css_248z$2 = ".tooltip-module_tooltip-container__X8blY{display:inline-block;position:relative}.tooltip-module_tooltip__IN7yd{border-radius:.25rem;font-size:.875rem;font-weight:500;opacity:0;padding:.5rem;position:absolute;transition:opacity .2s ease,visibility .2s ease;visibility:hidden;white-space:nowrap;z-index:100}.tooltip-module_tooltip-container__X8blY:hover .tooltip-module_tooltip__IN7yd{opacity:1;visibility:visible}.tooltip-module_tooltip__IN7yd.tooltip-module_top__5rD4C{bottom:100%;left:50%;margin-bottom:.5rem;transform:translateX(-50%)}.tooltip-module_tooltip__IN7yd.tooltip-module_bottom__Bk3EH{left:50%;margin-top:.5rem;top:100%;transform:translateX(-50%)}.tooltip-module_tooltip__IN7yd.tooltip-module_left__PRFtS{margin-right:.5rem;right:100%;top:50%;transform:translateY(-50%)}.tooltip-module_tooltip__IN7yd.tooltip-module_right__nQugl{left:100%;margin-left:.5rem;top:50%;transform:translateY(-50%)}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRvb2x0aXAubW9kdWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx5Q0FFRSxvQkFBcUIsQ0FEckIsaUJBRUYsQ0FFQSwrQkFHRSxvQkFBc0IsQ0FDdEIsaUJBQW1CLENBQ25CLGVBQWdCLENBR2hCLFNBQVUsQ0FOVixhQUFlLENBRGYsaUJBQWtCLENBU2xCLCtDQUFtRCxDQURuRCxpQkFBa0IsQ0FIbEIsa0JBQW1CLENBQ25CLFdBSUYsQ0FFQSw4RUFDRSxTQUFVLENBQ1Ysa0JBQ0YsQ0FFQSx5REFDRSxXQUFZLENBQ1osUUFBUyxDQUVULG1CQUFxQixDQURyQiwwQkFFRixDQUVBLDREQUVFLFFBQVMsQ0FFVCxnQkFBa0IsQ0FIbEIsUUFBUyxDQUVULDBCQUVGLENBRUEsMERBSUUsa0JBQW9CLENBSHBCLFVBQVcsQ0FDWCxPQUFRLENBQ1IsMEJBRUYsQ0FFQSwyREFDRSxTQUFVLENBR1YsaUJBQW1CLENBRm5CLE9BQVEsQ0FDUiwwQkFFRiIsImZpbGUiOiJ0b29sdGlwLm1vZHVsZS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyIudG9vbHRpcC1jb250YWluZXIge1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XHJcbn1cclxuXHJcbi50b29sdGlwIHtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgcGFkZGluZzogMC41cmVtO1xyXG4gIGJvcmRlci1yYWRpdXM6IDAuMjVyZW07XHJcbiAgZm9udC1zaXplOiAwLjg3NXJlbTtcclxuICBmb250LXdlaWdodDogNTAwO1xyXG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XHJcbiAgei1pbmRleDogMTAwO1xyXG4gIG9wYWNpdHk6IDA7XHJcbiAgdmlzaWJpbGl0eTogaGlkZGVuO1xyXG4gIHRyYW5zaXRpb246IG9wYWNpdHkgMC4ycyBlYXNlLCB2aXNpYmlsaXR5IDAuMnMgZWFzZTtcclxufVxyXG5cclxuLnRvb2x0aXAtY29udGFpbmVyOmhvdmVyIC50b29sdGlwIHtcclxuICBvcGFjaXR5OiAxO1xyXG4gIHZpc2liaWxpdHk6IHZpc2libGU7XHJcbn1cclxuXHJcbi50b29sdGlwLnRvcCB7XHJcbiAgYm90dG9tOiAxMDAlO1xyXG4gIGxlZnQ6IDUwJTtcclxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTUwJSk7XHJcbiAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xyXG59XHJcblxyXG4udG9vbHRpcC5ib3R0b20ge1xyXG4gIHRvcDogMTAwJTtcclxuICBsZWZ0OiA1MCU7XHJcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC01MCUpO1xyXG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcclxufVxyXG5cclxuLnRvb2x0aXAubGVmdCB7XHJcbiAgcmlnaHQ6IDEwMCU7XHJcbiAgdG9wOiA1MCU7XHJcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xyXG4gIG1hcmdpbi1yaWdodDogMC41cmVtO1xyXG59XHJcblxyXG4udG9vbHRpcC5yaWdodCB7XHJcbiAgbGVmdDogMTAwJTtcclxuICB0b3A6IDUwJTtcclxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7XHJcbiAgbWFyZ2luLWxlZnQ6IDAuNXJlbTtcclxufVxyXG4iXX0= */";
var styles$1 = {"tooltip-container":"tooltip-module_tooltip-container__X8blY","tooltip":"tooltip-module_tooltip__IN7yd","top":"tooltip-module_top__5rD4C","bottom":"tooltip-module_bottom__Bk3EH","left":"tooltip-module_left__PRFtS","right":"tooltip-module_right__nQugl"};
styleInject(css_248z$2);

/**
 * Tooltip component to wrap other components and display a tooltip on hover.
 * @param {TooltipProps} props The props for the Tooltip component.
 * @returns {JSX.Element} The Tooltip component.
 */
const Tooltip = ({ content, position = "top", backgroundColor = "#333", textColor = "#fff", containerStyle = {}, children, }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (React.createElement("div", { className: styles$1["tooltip-container"], onMouseEnter: () => setIsVisible(true), onMouseLeave: () => setIsVisible(false), style: containerStyle },
        children,
        isVisible && (React.createElement("div", { className: `${styles$1.tooltip} ${styles$1[position]}`, style: { backgroundColor, color: textColor } }, content))));
};

var css_248z$1 = "@import url(\"https://api.fontshare.com/v2/css?f[]=satoshi@1&display=swap\");.auth-module_modal__yyg5L{-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);background-color:#000;background-color:rgba(0,0,0,.4);height:100%;left:0;overflow:auto;position:fixed;top:0;transition:all .3s;width:100%;z-index:85}.auth-module_modal__yyg5L .auth-module_outer-container__RraOQ{align-items:center;box-sizing:border-box;display:flex;flex-direction:row;font-family:Satoshi,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;justify-content:center;left:50%;position:absolute;top:50%;transform:translate(-50%,-50%);@media screen and (max-width:440px){border-bottom-left-radius:0;border-bottom-right-radius:0;bottom:0;top:auto;transform:translate(-50%);width:100%}}.auth-module_outer-container__RraOQ .auth-module_container__7utns{align-items:center;background-color:#fefefe;border:1px solid #888;border-radius:1.5rem;box-sizing:border-box;flex-direction:column;justify-content:center;padding:1.5rem 1.5rem 1rem;position:relative;text-align:center;width:400px;@media screen and (max-width:440px){border-radius:0;height:auto;max-height:100vh;overflow-y:auto;padding-bottom:1rem;padding-bottom:.5rem;padding-left:1rem;padding-right:1rem;padding-top:1rem;width:100%}}.auth-module_origin-tab__miOUK{flex-direction:column;height:100%;justify-content:space-between}.auth-module_origin-section__UBhBB,.auth-module_origin-tab__miOUK{align-items:center;display:flex;gap:.5rem;margin-top:.25rem;width:100%}.auth-module_origin-section__UBhBB{flex-direction:row;justify-content:space-evenly}.auth-module_origin-section__UBhBB .auth-module_origin-container__ZIk4c{align-items:center;color:#333;display:flex;flex-direction:column;font-size:.875rem;font-weight:400;justify-content:center;margin-bottom:.5rem;margin-top:.5rem;min-height:3rem;min-width:1rem;text-align:center;width:100%}.auth-module_origin-container__ZIk4c .auth-module_origin-label__l-1q9{color:#777;font-size:.75rem;font-weight:400;margin-bottom:.25rem;text-align:center}.auth-module_horizontal-divider__YfWCy{background-color:#ddd;height:1px;margin-bottom:.5rem;margin-top:.5rem;width:100%}.auth-module_origin-section__UBhBB .auth-module_divider__z65Me{background-color:#ddd;height:1rem;width:1px}.auth-module_origin-dashboard-button__-pch4{align-items:center;border:none;color:#ff6f00;display:flex;flex-direction:row;font-size:.875rem;gap:.5rem;justify-content:center;padding:.25rem;width:100%}.auth-module_origin-dashboard-button__-pch4:hover{color:#cc4e02;cursor:pointer}.auth-module_origin-dashboard-button__-pch4:disabled{background-color:#ccc;cursor:not-allowed}.auth-module_container__7utns h2{font-size:1.25rem;margin-bottom:1rem;margin-top:0}.auth-module_container__7utns .auth-module_header__pX9nM{align-items:center;color:#333;display:flex;flex-direction:row;font-weight:700;gap:.5rem;justify-content:flex-start;margin-bottom:1rem;text-align:left;width:100%;@media screen and (max-width:440px){margin-bottom:.5rem;margin-top:0}}.auth-module_container__7utns .auth-module_header__pX9nM .auth-module_small-modal-icon__YayD1{height:2rem;margin-bottom:.5rem;margin-top:.5rem;width:2rem}.auth-module_container__7utns .auth-module_header__pX9nM .auth-module_wallet-address__AVVA5{color:#777;font-size:.75rem;font-weight:400;margin-top:.2rem}.auth-module_container__7utns .auth-module_close-button__uZrho{background-color:#fff;border:2px solid #ddd;border-radius:100%;color:#aaa;font-size:1.5rem;height:1.25rem;position:absolute;right:1rem;top:1rem;transition:color .15s;width:1.25rem}.auth-module_close-button__uZrho>.auth-module_close-icon__SSCni{display:block;height:1rem;padding:.15rem;position:relative;width:1rem}.auth-module_container__7utns .auth-module_close-button__uZrho:hover{background-color:#ddd;color:#888;cursor:pointer}.auth-module_container__7utns .auth-module_linking-text__uz3ud{color:#777;font-size:1rem;text-align:center}.auth-module_provider-list__6vISy{box-sizing:border-box;display:flex;flex-direction:column;gap:.5rem;margin-bottom:.75rem;max-height:17.9rem;overflow-y:auto;padding-left:.5rem;padding-right:.5rem;scrollbar-color:#ccc #f1f1f1;scrollbar-width:thin;width:100%}.auth-module_provider-list__6vISy.auth-module_big__jQxvN{max-height:16rem}.auth-module_provider-list__6vISy::-webkit-scrollbar{border-radius:.25rem;width:.5rem}.auth-module_provider-list__6vISy::-webkit-scrollbar-thumb{background-color:#ccc;border-radius:.25rem}.auth-module_provider-list__6vISy::-webkit-scrollbar-track{background-color:#f1f1f1;border-radius:.25rem}.auth-module_spinner__hfzlH:after{animation:auth-module_spin__tm9l6 1s linear infinite;border:.25rem solid #f3f3f3;border-radius:50%;border-top-color:#ff6f00;content:\"\";display:block;height:1rem;width:1rem}.auth-module_spinner__hfzlH{align-self:center;display:flex;justify-content:center;margin-left:auto;margin-right:.25rem}@keyframes auth-module_spin__tm9l6{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}.auth-module_modal-icon__CV7ah{align-items:center;display:flex;height:4rem;justify-content:center;margin-bottom:.25rem;margin-top:.5rem;padding:.35rem;width:4rem}.auth-module_modal-icon__CV7ah svg{height:3.6rem;width:3.6rem}.auth-module_container__7utns a.auth-module_footer-text__CQnh6{color:#bbb;font-size:.75rem;text-decoration:none}.auth-module_container__7utns a.auth-module_footer-text__CQnh6:hover{text-decoration:underline}.auth-module_disconnect-button__bsu-3{background-color:#ff6f00;border:none;border-radius:.75rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);color:#fff;font-size:1rem;height:2.5rem;margin-bottom:.75rem;margin-top:1rem;padding:1rem;padding-block:0;width:100%}.auth-module_disconnect-button__bsu-3:hover{background-color:#cc4e02;cursor:pointer}.auth-module_disconnect-button__bsu-3:disabled{background-color:#ccc;cursor:not-allowed}.auth-module_linking-button__g1GlL{background-color:#ff6f00;border:none;border-radius:.75rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);color:#fff;font-size:1rem;height:2.5rem;margin-bottom:.75rem;margin-top:1rem;padding:1rem;padding-block:0;width:100%}.auth-module_linking-button__g1GlL:hover{background-color:#cc4e02;cursor:pointer}.auth-module_linking-button__g1GlL:disabled{background-color:#ccc;cursor:not-allowed}.auth-module_socials-wrapper__PshV3{display:flex;flex-direction:column;gap:1rem;margin-block:.5rem;width:100%}.auth-module_socials-container__iDzfJ{display:flex;flex-direction:column;gap:.5rem;width:100%}.auth-module_socials-container__iDzfJ .auth-module_connector-container__4wn11{align-items:center;display:flex;gap:.25rem;justify-content:flex-start;position:relative}.auth-module_socials-container__iDzfJ .auth-module_connector-button__j79HA{align-items:center;background-color:#fefefe;border:1px solid #ddd;border-radius:.75rem;color:#333;display:flex;font-size:.875rem;gap:.25rem;height:2.5rem;padding:.75rem;position:relative;width:100%}.auth-module_socials-container__iDzfJ .auth-module_connector-button__j79HA:hover{background-color:#ddd;cursor:pointer}.auth-module_socials-container__iDzfJ .auth-module_connector-button__j79HA:disabled{background-color:#fefefe;cursor:default}.auth-module_socials-container__iDzfJ .auth-module_connector-button__j79HA svg{color:#333;height:1.5rem;margin-right:.5rem;width:1.5rem}.auth-module_socials-container__iDzfJ .auth-module_connector-connected__JvDQb{align-items:center;background-color:#eee;border:1px solid #ddd;border-radius:.25rem;color:#333;display:flex;flex:1;font-size:.875rem;gap:.25rem;padding:.5rem .75rem;position:relative;width:100%}.auth-module_socials-container__iDzfJ .auth-module_connector-connected__JvDQb svg{color:#333;height:1.5rem;margin-right:.5rem;width:1.5rem}.auth-module_socials-container__iDzfJ h3{color:#333;margin:0}.auth-module_connector-button__j79HA .auth-module_connector-checkmark__ZS6zU{height:1rem!important;position:absolute;right:-.5rem;top:-.5rem;width:1rem!important}.auth-module_unlink-connector-button__6Fwkp{align-items:center;background-color:#999;border:none;border-radius:.5rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);color:#fff;display:flex;font-size:.75rem;gap:.25rem;padding:.25rem .675rem .25rem .5rem;position:absolute;right:.375rem;text-align:center;transition:background-color .15s}.auth-module_unlink-connector-button__6Fwkp svg{stroke:#fff!important;height:.875rem!important;margin-right:0!important;width:.875rem!important}.auth-module_unlink-connector-button__6Fwkp:hover{background-color:#888;cursor:pointer}.auth-module_unlink-connector-button__6Fwkp:disabled{background-color:#ccc;cursor:not-allowed}@keyframes auth-module_loader__gH3ZC{0%{transform:translateX(0)}50%{transform:translateX(100%)}to{transform:translateX(0)}}.auth-module_loader__gH3ZC{background-color:#ddd;border-radius:.125rem;height:.4rem;margin-bottom:.5rem;margin-top:.5rem;position:relative;width:4rem}.auth-module_loader__gH3ZC:before{animation:auth-module_loader__gH3ZC 1.5s ease-in-out infinite;background-color:#ff6f00;border-radius:.125rem;content:\"\";display:block;height:.4rem;left:0;position:absolute;width:2rem}.auth-module_no-socials__wEx0t{color:#777;font-size:.875rem;margin-top:.5rem;text-align:center}.auth-module_divider__z65Me{align-items:center;display:flex;gap:.5rem;margin-bottom:.5rem;margin-top:.5rem}.auth-module_divider__z65Me:after,.auth-module_divider__z65Me:before{border-bottom:1px solid #ddd;content:\"\";flex:1}input.auth-module_tiktok-input__FeqdG{border:1px solid gray;border-radius:.75rem;color:#000;font-family:Satoshi,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;font-size:1rem;font-weight:600;height:2.75rem;line-height:1.333rem;margin-top:1rem;padding-inline:1rem;width:100%}input.auth-module_tiktok-input__FeqdG.auth-module_invalid__qqgK6{border-color:#dc3545;outline-color:#dc3545}.auth-module_otp-input-container__B2NH6{display:flex;gap:.5rem;justify-content:center;margin-top:1rem}.auth-module_otp-input__vjImt{border:1px solid #ccc;border-radius:.5rem;font-size:1.5rem;height:2.5rem;outline:none;text-align:center;transition:border-color .2s;width:2rem}.auth-module_otp-input__vjImt:focus{border-color:#ff6f00}.auth-module_tabs__RcUmV{display:flex;justify-content:flex-start;margin-bottom:calc(-.5rem - 1px);max-width:100%;overflow-x:auto}.auth-module_tabs__RcUmV::-webkit-scrollbar{display:none}.auth-module_tabs__RcUmV::-webkit-scrollbar-thumb{background-color:#ccc;border-radius:.25rem}.auth-module_tab-button__HT6wc{background-color:#fefefe;border-right:2px solid #ddd;cursor:pointer;font-size:.875rem;padding:.5rem 1rem;text-align:left;transition:background-color .2s}.auth-module_tab-button__HT6wc:hover{background-color:#eee}.auth-module_active-tab__l6P44{border-right-color:#ff6f00}.auth-module_tab-content__noHF0{height:20rem;margin-top:.25rem;min-height:20rem;width:100%}.auth-module_vertical-tabs-container__6sAOL{display:flex;flex-direction:row;gap:.5rem}.auth-module_vertical-tabs__-ba-W{display:flex;flex-direction:column;gap:.25rem;height:100%;margin-left:-1rem;overflow-y:auto;width:auto}.auth-module_vertical-tab-content__wTqKF{background-color:#f9f9f9;border:1px solid #ddd;border-radius:.25rem;flex-grow:1;height:22rem;min-height:22rem;padding:1rem}\n/*# sourceMappingURL=data:application/json;base64,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Q0YsQ0FFQSxpRUFDRSxvQkFBcUIsQ0FDckIscUJBQ0YsQ0FFQSx3Q0FDRSxZQUFhLENBRWIsU0FBVyxDQURYLHNCQUF1QixDQUV2QixlQUNGLENBRUEsOEJBS0UscUJBQXNCLENBQ3RCLG1CQUFxQixDQUZyQixnQkFBaUIsQ0FGakIsYUFBYyxDQUtkLFlBQWEsQ0FKYixpQkFBa0IsQ0FLbEIsMkJBQTZCLENBUDdCLFVBUUYsQ0FFQSxvQ0FDRSxvQkFDRixDQUVBLHlCQUNFLFlBQWEsQ0FDYiwwQkFBMkIsQ0FDM0IsZ0NBQWtDLENBQ2xDLGNBQWUsQ0FDZixlQUNGLENBQ0EsNENBQ0UsWUFDRixDQUNBLGtEQUNFLHFCQUFzQixDQUN0QixvQkFDRixDQUVBLCtCQUNFLHdCQUF5QixDQUN6QiwyQkFBNEIsQ0FLNUIsY0FBZSxDQURmLGlCQUFtQixDQURuQixrQkFBb0IsQ0FJcEIsZUFBZ0IsQ0FEaEIsK0JBRUYsQ0FFQSxxQ0FDRSxxQkFDRixDQUVBLCtCQUNFLDBCQUNGLENBRUEsZ0NBSUUsWUFBYSxDQUhiLGlCQUFtQixDQUVuQixnQkFBaUIsQ0FEakIsVUFHRixDQUVBLDRDQUNFLFlBQWEsQ0FDYixrQkFBbUIsQ0FDbkIsU0FDRixDQUVBLGtDQUNFLFlBQWEsQ0FDYixxQkFBc0IsQ0FDdEIsVUFBWSxDQUdaLFdBQVksQ0FEWixpQkFBa0IsQ0FFbEIsZUFBZ0IsQ0FIaEIsVUFJRixDQUVBLHlDQU9FLHdCQUF5QixDQUh6QixxQkFBc0IsQ0FDdEIsb0JBQXNCLENBSnRCLFdBQVksQ0FFWixZQUFhLENBRGIsZ0JBQWlCLENBSWpCLFlBRUYiLCJmaWxlIjoiYXV0aC5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCB1cmwoXCJodHRwczovL2FwaS5mb250c2hhcmUuY29tL3YyL2Nzcz9mW109c2F0b3NoaUAxJmRpc3BsYXk9c3dhcFwiKTtcclxuXHJcbi5tb2RhbCB7XHJcbiAgcG9zaXRpb246IGZpeGVkO1xyXG4gIHotaW5kZXg6IDg1O1xyXG4gIGxlZnQ6IDA7XHJcbiAgdG9wOiAwO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIGhlaWdodDogMTAwJTtcclxuICBvdmVyZmxvdzogYXV0bztcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2IoMCwgMCwgMCk7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAwLCAwLjQpO1xyXG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigycHgpO1xyXG4gIHRyYW5zaXRpb246IGFsbCAwLjNzO1xyXG59XHJcblxyXG4ubW9kYWwgLm91dGVyLWNvbnRhaW5lciB7XHJcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICBmb250LWZhbWlseTogXCJTYXRvc2hpXCIsIHN5c3RlbS11aSwgLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LFxyXG4gICAgXCJTZWdvZSBVSVwiLCBSb2JvdG8sIE94eWdlbiwgVWJ1bnR1LCBDYW50YXJlbGwsIFwiT3BlbiBTYW5zXCIsIFwiSGVsdmV0aWNhIE5ldWVcIixcclxuICAgIHNhbnMtc2VyaWY7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHRvcDogNTAlO1xyXG4gIGxlZnQ6IDUwJTtcclxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcclxuXHJcbiAgLyogZGlhbG9nIG9uIG1vYmlsZSAqL1xyXG4gIEBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDQ0MHB4KSB7XHJcbiAgICB3aWR0aDogMTAwJTtcclxuICAgIGJvcmRlci1ib3R0b20tbGVmdC1yYWRpdXM6IDA7XHJcbiAgICBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMDtcclxuICAgIGJvdHRvbTogMDtcclxuICAgIHRvcDogYXV0bztcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsIDApO1xyXG4gIH1cclxufVxyXG5cclxuLm91dGVyLWNvbnRhaW5lciAuY29udGFpbmVyIHtcclxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZWZlZmU7XHJcbiAgYm9yZGVyOiAxcHggc29saWQgIzg4ODtcclxuICBib3JkZXItcmFkaXVzOiAxLjVyZW07XHJcbiAgd2lkdGg6IDQwMHB4OyAvKiB0ZW1wb3JhcnkgKi9cclxuICBwYWRkaW5nOiAxLjVyZW07XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICBwYWRkaW5nLWJvdHRvbTogMXJlbTtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuXHJcbiAgQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNDQwcHgpIHtcclxuICAgIHdpZHRoOiAxMDAlO1xyXG4gICAgYm9yZGVyLXJhZGl1czogMDtcclxuICAgIHBhZGRpbmc6IDFyZW07XHJcbiAgICBwYWRkaW5nLWJvdHRvbTogMC41cmVtO1xyXG4gICAgaGVpZ2h0OiBhdXRvO1xyXG4gICAgbWF4LWhlaWdodDogMTAwdmg7XHJcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xyXG4gIH1cclxufVxyXG4ub3JpZ2luLXRhYiB7XHJcbiAgaGVpZ2h0OiAxMDAlO1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBnYXA6IDAuNXJlbTtcclxuICBtYXJnaW4tdG9wOiAwLjI1cmVtO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG59XHJcbi5vcmlnaW4tc2VjdGlvbiB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtZXZlbmx5O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgZ2FwOiAwLjVyZW07XHJcbiAgbWFyZ2luLXRvcDogMC4yNXJlbTtcclxuICB3aWR0aDogMTAwJTtcclxufVxyXG5cclxuLm9yaWdpbi1zZWN0aW9uIC5vcmlnaW4tY29udGFpbmVyIHtcclxuICBtaW4td2lkdGg6IDFyZW07XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgbWluLWhlaWdodDogM3JlbTtcclxuICBmb250LXNpemU6IDAuODc1cmVtO1xyXG4gIGZvbnQtd2VpZ2h0OiA0MDA7XHJcbiAgY29sb3I6ICMzMzM7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xyXG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcclxufVxyXG5cclxuLm9yaWdpbi1jb250YWluZXIgLm9yaWdpbi1sYWJlbCB7XHJcbiAgZm9udC1zaXplOiAwLjc1cmVtO1xyXG4gIGZvbnQtd2VpZ2h0OiA0MDA7XHJcbiAgY29sb3I6ICM3Nzc3Nzc7XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIG1hcmdpbi1ib3R0b206IDAuMjVyZW07XHJcbn1cclxuXHJcbi5ob3Jpem9udGFsLWRpdmlkZXIge1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIGhlaWdodDogMXB4O1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNkZGQ7XHJcbiAgbWFyZ2luLXRvcDogMC41cmVtO1xyXG4gIG1hcmdpbi1ib3R0b206IDAuNXJlbTtcclxufVxyXG5cclxuLm9yaWdpbi1zZWN0aW9uIC5kaXZpZGVyIHtcclxuICB3aWR0aDogMXB4O1xyXG4gIGhlaWdodDogMXJlbTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGRkO1xyXG59XHJcblxyXG4ub3JpZ2luLWRhc2hib2FyZC1idXR0b24ge1xyXG4gIC8qIGJhY2tncm91bmQtY29sb3I6ICNmZjZmMDA7ICovXHJcbiAgY29sb3I6ICNmZjZmMDA7XHJcbiAgYm9yZGVyOiBub25lO1xyXG4gIC8qIGJvcmRlci1yYWRpdXM6IDAuNzVyZW07ICovXHJcbiAgcGFkZGluZzogMC4yNXJlbTtcclxuICBmb250LXNpemU6IDAuODc1cmVtO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIC8qIGJveC1zaGFkb3c6IGhzbGEoMCwgMCUsIDEwMCUsIDAuMTUpIDAgMnB4IDAgaW5zZXQsXHJcbiAgICByZ2JhKDAsIDAsIDAsIDAuMDUpIDAgLTJweCA0cHggaW5zZXQsIHJnYmEoNDYsIDU0LCA4MCwgMC4wNzUpIDAgMXB4IDFweDsgKi9cclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBnYXA6IDAuNXJlbTtcclxufVxyXG5cclxuLm9yaWdpbi1kYXNoYm9hcmQtYnV0dG9uOmhvdmVyIHtcclxuICAvKiBiYWNrZ3JvdW5kLWNvbG9yOiAjY2M0ZTAyOyAqL1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxuICBjb2xvcjogI2NjNGUwMjtcclxufVxyXG5cclxuLm9yaWdpbi1kYXNoYm9hcmQtYnV0dG9uOmRpc2FibGVkIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xyXG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XHJcbn1cclxuXHJcbi5jb250YWluZXIgaDIge1xyXG4gIG1hcmdpbi10b3A6IDA7XHJcbiAgbWFyZ2luLWJvdHRvbTogMXJlbTtcclxuICBmb250LXNpemU6IDEuMjVyZW07XHJcbn1cclxuXHJcbi5jb250YWluZXIgLmhlYWRlciB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBmbGV4LWRpcmVjdGlvbjogcm93O1xyXG4gIGNvbG9yOiAjMzMzO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIHRleHQtYWxpZ246IGxlZnQ7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xyXG4gIC8qIG1hcmdpbi10b3A6IC0wLjZyZW07ICovXHJcbiAgZm9udC13ZWlnaHQ6IGJvbGQ7XHJcbiAgZ2FwOiAwLjVyZW07XHJcblxyXG4gIEBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDQ0MHB4KSB7XHJcbiAgICBtYXJnaW4tdG9wOiAwO1xyXG4gICAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xyXG4gIH1cclxufVxyXG5cclxuLmNvbnRhaW5lciAuaGVhZGVyIC5zbWFsbC1tb2RhbC1pY29uIHtcclxuICB3aWR0aDogMnJlbTtcclxuICBoZWlnaHQ6IDJyZW07XHJcbiAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xyXG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcclxufVxyXG5cclxuLmNvbnRhaW5lciAuaGVhZGVyIC53YWxsZXQtYWRkcmVzcyB7XHJcbiAgZm9udC1zaXplOiAwLjc1cmVtO1xyXG4gIGNvbG9yOiAjNzc3O1xyXG4gIGZvbnQtd2VpZ2h0OiBub3JtYWw7XHJcbiAgbWFyZ2luLXRvcDogMC4ycmVtO1xyXG59XHJcblxyXG4uY29udGFpbmVyIC5jbG9zZS1idXR0b24ge1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICB0b3A6IDFyZW07XHJcbiAgcmlnaHQ6IDFyZW07XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XHJcbiAgYm9yZGVyOiAycHggc29saWQgI2RkZDtcclxuICBib3JkZXItcmFkaXVzOiAxMDAlO1xyXG4gIGZvbnQtc2l6ZTogMS41cmVtO1xyXG4gIGNvbG9yOiAjYWFhO1xyXG4gIHdpZHRoOiAxLjI1cmVtO1xyXG4gIGhlaWdodDogMS4yNXJlbTtcclxuICB0cmFuc2l0aW9uOiBjb2xvciAwLjE1cztcclxufVxyXG5cclxuLmNsb3NlLWJ1dHRvbiA+IC5jbG9zZS1pY29uIHtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgZGlzcGxheTogYmxvY2s7XHJcbiAgd2lkdGg6IDFyZW07XHJcbiAgaGVpZ2h0OiAxcmVtO1xyXG4gIHBhZGRpbmc6IDAuMTVyZW07XHJcbn1cclxuXHJcbi5jb250YWluZXIgLmNsb3NlLWJ1dHRvbjpob3ZlciB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2RkZDtcclxuICBjb2xvcjogIzg4ODtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbn1cclxuXHJcbi5jb250YWluZXIgLmxpbmtpbmctdGV4dCB7XHJcbiAgY29sb3I6ICM3Nzc7XHJcbiAgZm9udC1zaXplOiAxcmVtO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICAvKiBtYXJnaW4tdG9wOiAwOyAqL1xyXG4gIC8qIG1hcmdpbi1ib3R0b206IDJyZW07ICovXHJcbn1cclxuXHJcbi5wcm92aWRlci1saXN0IHtcclxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICBnYXA6IDAuNXJlbTtcclxuICB3aWR0aDogMTAwJTtcclxuICBtYXJnaW4tYm90dG9tOiAwLjc1cmVtO1xyXG4gIG1heC1oZWlnaHQ6IDE3LjlyZW07XHJcbiAgb3ZlcmZsb3cteTogYXV0bztcclxuICBwYWRkaW5nLXJpZ2h0OiAwLjVyZW07XHJcbiAgcGFkZGluZy1sZWZ0OiAwLjVyZW07XHJcbiAgc2Nyb2xsYmFyLXdpZHRoOiB0aGluO1xyXG4gIHNjcm9sbGJhci1jb2xvcjogI2NjYyAjZjFmMWYxO1xyXG59XHJcblxyXG4ucHJvdmlkZXItbGlzdC5iaWcge1xyXG4gIG1heC1oZWlnaHQ6IDE2cmVtO1xyXG59XHJcblxyXG4ucHJvdmlkZXItbGlzdDo6LXdlYmtpdC1zY3JvbGxiYXIge1xyXG4gIHdpZHRoOiAwLjVyZW07XHJcbiAgYm9yZGVyLXJhZGl1czogMC4yNXJlbTtcclxufVxyXG4ucHJvdmlkZXItbGlzdDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNjY2M7XHJcbiAgYm9yZGVyLXJhZGl1czogMC4yNXJlbTtcclxufVxyXG4ucHJvdmlkZXItbGlzdDo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmMWYxZjE7XHJcbiAgYm9yZGVyLXJhZGl1czogMC4yNXJlbTtcclxufVxyXG5cclxuLnNwaW5uZXI6OmFmdGVyIHtcclxuICBjb250ZW50OiBcIlwiO1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIHdpZHRoOiAxcmVtO1xyXG4gIGhlaWdodDogMXJlbTtcclxuICBib3JkZXI6IDAuMjVyZW0gc29saWQgI2YzZjNmMztcclxuICBib3JkZXItdG9wOiAwLjI1cmVtIHNvbGlkICNmZjZmMDA7XHJcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xyXG4gIGFuaW1hdGlvbjogc3BpbiAxcyBsaW5lYXIgaW5maW5pdGU7XHJcbn1cclxuLnNwaW5uZXIge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgbWFyZ2luLWxlZnQ6IGF1dG87XHJcbiAgbWFyZ2luLXJpZ2h0OiAwLjI1cmVtO1xyXG4gIGFsaWduLXNlbGY6IGNlbnRlcjtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxufVxyXG5cclxuQGtleWZyYW1lcyBzcGluIHtcclxuICAwJSB7XHJcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcclxuICB9XHJcbiAgMTAwJSB7XHJcbiAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xyXG4gIH1cclxufVxyXG5cclxuLm1vZGFsLWljb24ge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICB3aWR0aDogNHJlbTtcclxuICBoZWlnaHQ6IDRyZW07XHJcbiAgbWFyZ2luLXRvcDogMC41cmVtO1xyXG4gIG1hcmdpbi1ib3R0b206IDAuMjVyZW07XHJcbiAgcGFkZGluZzogMC4zNXJlbTtcclxufVxyXG4ubW9kYWwtaWNvbiBzdmcge1xyXG4gIHdpZHRoOiAzLjZyZW07XHJcbiAgaGVpZ2h0OiAzLjZyZW07XHJcbn1cclxuXHJcbi5jb250YWluZXIgYS5mb290ZXItdGV4dCB7XHJcbiAgLyogbWFyZ2luLXRvcDogMXJlbTsgKi9cclxuICBmb250LXNpemU6IDAuNzVyZW07XHJcbiAgY29sb3I6ICNiYmJiYmI7XHJcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xyXG59XHJcblxyXG4uY29udGFpbmVyIGEuZm9vdGVyLXRleHQ6aG92ZXIge1xyXG4gIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xyXG59XHJcblxyXG4uZGlzY29ubmVjdC1idXR0b24ge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZjZmMDA7XHJcbiAgY29sb3I6IHdoaXRlO1xyXG4gIGJvcmRlcjogbm9uZTtcclxuICBib3JkZXItcmFkaXVzOiAwLjc1cmVtO1xyXG4gIHBhZGRpbmc6IDFyZW07XHJcbiAgcGFkZGluZy1ibG9jazogMDtcclxuICBmb250LXNpemU6IDFyZW07XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgbWFyZ2luLWJvdHRvbTogMC43NXJlbTtcclxuICBtYXJnaW4tdG9wOiAxcmVtO1xyXG4gIGhlaWdodDogMi41cmVtO1xyXG4gIGJveC1zaGFkb3c6IGhzbGEoMCwgMCUsIDEwMCUsIDAuMTUpIDAgMnB4IDAgaW5zZXQsXHJcbiAgICByZ2JhKDAsIDAsIDAsIDAuMDUpIDAgLTJweCA0cHggaW5zZXQsIHJnYmEoNDYsIDU0LCA4MCwgMC4wNzUpIDAgMXB4IDFweDtcclxufVxyXG5cclxuLmRpc2Nvbm5lY3QtYnV0dG9uOmhvdmVyIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2M0ZTAyO1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5cclxuLmRpc2Nvbm5lY3QtYnV0dG9uOmRpc2FibGVkIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xyXG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XHJcbn1cclxuXHJcbi5saW5raW5nLWJ1dHRvbiB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmNmYwMDtcclxuICBjb2xvcjogd2hpdGU7XHJcbiAgYm9yZGVyOiBub25lO1xyXG4gIGJvcmRlci1yYWRpdXM6IDAuNzVyZW07XHJcbiAgcGFkZGluZzogMXJlbTtcclxuICBwYWRkaW5nLWJsb2NrOiAwO1xyXG4gIGZvbnQtc2l6ZTogMXJlbTtcclxuICB3aWR0aDogMTAwJTtcclxuICBtYXJnaW4tYm90dG9tOiAwLjc1cmVtO1xyXG4gIG1hcmdpbi10b3A6IDFyZW07XHJcbiAgaGVpZ2h0OiAyLjVyZW07XHJcbiAgYm94LXNoYWRvdzogaHNsYSgwLCAwJSwgMTAwJSwgMC4xNSkgMCAycHggMCBpbnNldCxcclxuICAgIHJnYmEoMCwgMCwgMCwgMC4wNSkgMCAtMnB4IDRweCBpbnNldCwgcmdiYSg0NiwgNTQsIDgwLCAwLjA3NSkgMCAxcHggMXB4O1xyXG59XHJcblxyXG4ubGlua2luZy1idXR0b246aG92ZXIge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNjYzRlMDI7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcblxyXG4ubGlua2luZy1idXR0b246ZGlzYWJsZWQge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNjY2M7XHJcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcclxufVxyXG5cclxuLnNvY2lhbHMtd3JhcHBlciB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gIGdhcDogMXJlbTtcclxuICBtYXJnaW4tYmxvY2s6IDAuNXJlbTtcclxuICB3aWR0aDogMTAwJTtcclxufVxyXG5cclxuLnNvY2lhbHMtY29udGFpbmVyIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgZ2FwOiAwLjVyZW07XHJcbiAgd2lkdGg6IDEwMCU7XHJcbn1cclxuXHJcbi5zb2NpYWxzLWNvbnRhaW5lciAuY29ubmVjdG9yLWNvbnRhaW5lciB7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAganVzdGlmeS1jb250ZW50OiBmbGV4LXN0YXJ0O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgZ2FwOiAwLjI1cmVtO1xyXG59XHJcblxyXG4uc29jaWFscy1jb250YWluZXIgLmNvbm5lY3Rvci1idXR0b24ge1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAgZ2FwOiAwLjI1cmVtO1xyXG4gIHBhZGRpbmc6IDAuNzVyZW07XHJcbiAgYm9yZGVyLXJhZGl1czogMC43NXJlbTtcclxuICBmb250LXNpemU6IDAuODc1cmVtO1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZWZlZmU7XHJcbiAgY29sb3I6ICMzMzM7XHJcbiAgYm9yZGVyOiAxcHggc29saWQgI2RkZDtcclxuICB3aWR0aDogMTAwJTtcclxuICBoZWlnaHQ6IDIuNXJlbTtcclxufVxyXG5cclxuLnNvY2lhbHMtY29udGFpbmVyIC5jb25uZWN0b3ItYnV0dG9uOmhvdmVyIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZGRkO1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5cclxuLnNvY2lhbHMtY29udGFpbmVyIC5jb25uZWN0b3ItYnV0dG9uOmRpc2FibGVkIHtcclxuICBjdXJzb3I6IGRlZmF1bHQ7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZlZmVmZTtcclxufVxyXG5cclxuLnNvY2lhbHMtY29udGFpbmVyIC5jb25uZWN0b3ItYnV0dG9uIHN2ZyB7XHJcbiAgd2lkdGg6IDEuNXJlbTtcclxuICBoZWlnaHQ6IDEuNXJlbTtcclxuICBjb2xvcjogIzMzMztcclxuICBtYXJnaW4tcmlnaHQ6IDAuNXJlbTtcclxufVxyXG5cclxuLnNvY2lhbHMtY29udGFpbmVyIC5jb25uZWN0b3ItY29ubmVjdGVkIHtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGdhcDogMC4yNXJlbTtcclxuICBwYWRkaW5nOiAwLjc1cmVtO1xyXG4gIHBhZGRpbmctdG9wOiAwLjVyZW07XHJcbiAgcGFkZGluZy1ib3R0b206IDAuNXJlbTtcclxuICBmb250LXNpemU6IDAuODc1cmVtO1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNlZWU7XHJcbiAgYm9yZGVyLXJhZGl1czogMC4yNXJlbTtcclxuICBjb2xvcjogIzMzMztcclxuICBib3JkZXI6IDFweCBzb2xpZCAjZGRkO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG4gIGZsZXg6IDE7XHJcbn1cclxuXHJcbi5zb2NpYWxzLWNvbnRhaW5lciAuY29ubmVjdG9yLWNvbm5lY3RlZCBzdmcge1xyXG4gIHdpZHRoOiAxLjVyZW07XHJcbiAgaGVpZ2h0OiAxLjVyZW07XHJcbiAgY29sb3I6ICMzMzM7XHJcbiAgbWFyZ2luLXJpZ2h0OiAwLjVyZW07XHJcbn1cclxuXHJcbi5zb2NpYWxzLWNvbnRhaW5lciBoMyB7XHJcbiAgY29sb3I6ICMzMzM7XHJcbiAgbWFyZ2luOiAwO1xyXG59XHJcblxyXG4uY29ubmVjdG9yLWJ1dHRvbiAuY29ubmVjdG9yLWNoZWNrbWFyayB7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHRvcDogLTAuNXJlbTtcclxuICByaWdodDogLTAuNXJlbTtcclxuICB3aWR0aDogMXJlbSAhaW1wb3J0YW50O1xyXG4gIGhlaWdodDogMXJlbSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4udW5saW5rLWNvbm5lY3Rvci1idXR0b24ge1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICByaWdodDogMC4zNzVyZW07XHJcbiAgYm9yZGVyOiBub25lO1xyXG4gIGZvbnQtc2l6ZTogMC43NXJlbTtcclxuICBwYWRkaW5nOiAwLjI1cmVtIDAuNXJlbTtcclxuICBwYWRkaW5nLXJpZ2h0OiAwLjY3NXJlbTtcclxuICBib3JkZXItcmFkaXVzOiAwLjVyZW07XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICM5OTk7XHJcbiAgY29sb3I6IHdoaXRlO1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBnYXA6IDAuMjVyZW07XHJcbiAgYm94LXNoYWRvdzogaHNsYSgwLCAwJSwgMTAwJSwgMC4xNSkgMCAycHggMCBpbnNldCxcclxuICAgIHJnYmEoMCwgMCwgMCwgMC4wNSkgMCAtMnB4IDRweCBpbnNldCwgcmdiYSg0NiwgNTQsIDgwLCAwLjA3NSkgMCAxcHggMXB4O1xyXG4gIHRyYW5zaXRpb246IGJhY2tncm91bmQtY29sb3IgMC4xNXM7XHJcbn1cclxuXHJcbi51bmxpbmstY29ubmVjdG9yLWJ1dHRvbiBzdmcge1xyXG4gIHN0cm9rZTogd2hpdGUgIWltcG9ydGFudDtcclxuICB3aWR0aDogMC44NzVyZW0gIWltcG9ydGFudDtcclxuICBoZWlnaHQ6IDAuODc1cmVtICFpbXBvcnRhbnQ7XHJcbiAgbWFyZ2luLXJpZ2h0OiAwICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi51bmxpbmstY29ubmVjdG9yLWJ1dHRvbjpob3ZlciB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogIzg4ODtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbn1cclxuXHJcbi51bmxpbmstY29ubmVjdG9yLWJ1dHRvbjpkaXNhYmxlZCB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2NjYztcclxuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xyXG59XHJcblxyXG5Aa2V5ZnJhbWVzIGxvYWRlciB7XHJcbiAgMCUge1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDAlKTtcclxuICB9XHJcbiAgNTAlIHtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxMDAlKTtcclxuICB9XHJcbiAgMTAwJSB7XHJcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCUpO1xyXG4gIH1cclxufVxyXG5cclxuLmxvYWRlciB7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIHdpZHRoOiA0cmVtO1xyXG4gIGhlaWdodDogMC40cmVtO1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNkZGQ7XHJcbiAgbWFyZ2luLXRvcDogMC41cmVtO1xyXG4gIG1hcmdpbi1ib3R0b206IDAuNXJlbTtcclxuICBib3JkZXItcmFkaXVzOiAwLjEyNXJlbTtcclxufVxyXG5cclxuLmxvYWRlcjo6YmVmb3JlIHtcclxuICBjb250ZW50OiBcIlwiO1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIHdpZHRoOiAycmVtO1xyXG4gIGhlaWdodDogMC40cmVtO1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZjZmMDA7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIGxlZnQ6IDA7XHJcbiAgYW5pbWF0aW9uOiBsb2FkZXIgMS41cyBlYXNlLWluLW91dCBpbmZpbml0ZTtcclxuICBib3JkZXItcmFkaXVzOiAwLjEyNXJlbTtcclxufVxyXG5cclxuLm5vLXNvY2lhbHMge1xyXG4gIGNvbG9yOiAjNzc3O1xyXG4gIGZvbnQtc2l6ZTogMC44NzVyZW07XHJcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xyXG4gIG1hcmdpbi10b3A6IDAuNXJlbTtcclxufVxyXG5cclxuLmRpdmlkZXIge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBnYXA6IDAuNXJlbTtcclxuICBtYXJnaW4tdG9wOiAwLjVyZW07XHJcbiAgbWFyZ2luLWJvdHRvbTogMC41cmVtO1xyXG59XHJcblxyXG4uZGl2aWRlcjo6YmVmb3JlLFxyXG4uZGl2aWRlcjo6YWZ0ZXIge1xyXG4gIGNvbnRlbnQ6IFwiXCI7XHJcbiAgZmxleDogMTtcclxuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2RkZDtcclxufVxyXG5cclxuaW5wdXQudGlrdG9rLWlucHV0IHtcclxuICBib3JkZXI6IDFweCBzb2xpZCBncmF5O1xyXG4gIGJvcmRlci1yYWRpdXM6IDAuNzVyZW07XHJcbiAgY29sb3I6IGJsYWNrO1xyXG4gIGZvbnQtZmFtaWx5OiBTYXRvc2hpLCBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCwgU2Vnb2UgVUksXHJcbiAgICBSb2JvdG8sIE94eWdlbiwgVWJ1bnR1LCBDYW50YXJlbGwsIE9wZW4gU2FucywgSGVsdmV0aWNhIE5ldWUsIHNhbnMtc2VyaWY7XHJcbiAgZm9udC1zaXplOiAxcmVtO1xyXG4gIGZvbnQtd2VpZ2h0OiA2MDA7XHJcbiAgaGVpZ2h0OiAyLjc1cmVtO1xyXG4gIGxpbmUtaGVpZ2h0OiAxLjMzM3JlbTtcclxuICBwYWRkaW5nLWlubGluZTogMXJlbTtcclxuICBtYXJnaW4tdG9wOiAxcmVtO1xyXG4gIHdpZHRoOiAxMDAlO1xyXG59XHJcblxyXG5pbnB1dC50aWt0b2staW5wdXQuaW52YWxpZCB7XHJcbiAgYm9yZGVyLWNvbG9yOiAjZGMzNTQ1O1xyXG4gIG91dGxpbmUtY29sb3I6ICNkYzM1NDU7XHJcbn1cclxuXHJcbi5vdHAtaW5wdXQtY29udGFpbmVyIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGdhcDogMC41cmVtO1xyXG4gIG1hcmdpbi10b3A6IDFyZW07XHJcbn1cclxuXHJcbi5vdHAtaW5wdXQge1xyXG4gIHdpZHRoOiAycmVtO1xyXG4gIGhlaWdodDogMi41cmVtO1xyXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcclxuICBmb250LXNpemU6IDEuNXJlbTtcclxuICBib3JkZXI6IDFweCBzb2xpZCAjY2NjO1xyXG4gIGJvcmRlci1yYWRpdXM6IDAuNXJlbTtcclxuICBvdXRsaW5lOiBub25lO1xyXG4gIHRyYW5zaXRpb246IGJvcmRlci1jb2xvciAwLjJzO1xyXG59XHJcblxyXG4ub3RwLWlucHV0OmZvY3VzIHtcclxuICBib3JkZXItY29sb3I6ICNmZjZmMDA7XHJcbn1cclxuXHJcbi50YWJzIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcclxuICBtYXJnaW4tYm90dG9tOiBjYWxjKC0wLjVyZW0gLSAxcHgpO1xyXG4gIG1heC13aWR0aDogMTAwJTtcclxuICBvdmVyZmxvdy14OiBhdXRvO1xyXG59XHJcbi50YWJzOjotd2Via2l0LXNjcm9sbGJhciB7XHJcbiAgZGlzcGxheTogbm9uZTtcclxufVxyXG4udGFiczo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNjY2M7XHJcbiAgYm9yZGVyLXJhZGl1czogMC4yNXJlbTtcclxufVxyXG5cclxuLnRhYi1idXR0b24ge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZWZlZmU7XHJcbiAgYm9yZGVyLXJpZ2h0OiAycHggc29saWQgI2RkZDtcclxuICAvKiBib3JkZXItdG9wLXJpZ2h0LXJhZGl1czogMC4yNXJlbTsgKi9cclxuICAvKiBib3JkZXItYm90dG9tLXJpZ2h0LXJhZGl1czogMC4yNXJlbTsgKi9cclxuICBwYWRkaW5nOiAwLjVyZW0gMXJlbTtcclxuICBmb250LXNpemU6IDAuODc1cmVtO1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMnM7XHJcbiAgdGV4dC1hbGlnbjogbGVmdDtcclxufVxyXG5cclxuLnRhYi1idXR0b246aG92ZXIge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNlZWU7XHJcbn1cclxuXHJcbi5hY3RpdmUtdGFiIHtcclxuICBib3JkZXItcmlnaHQtY29sb3I6ICNmZjZmMDA7XHJcbn1cclxuXHJcbi50YWItY29udGVudCB7XHJcbiAgbWFyZ2luLXRvcDogMC4yNXJlbTtcclxuICB3aWR0aDogMTAwJTtcclxuICBtaW4taGVpZ2h0OiAyMHJlbTtcclxuICBoZWlnaHQ6IDIwcmVtO1xyXG59XHJcblxyXG4udmVydGljYWwtdGFicy1jb250YWluZXIge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IHJvdztcclxuICBnYXA6IDAuNXJlbTtcclxufVxyXG5cclxuLnZlcnRpY2FsLXRhYnMge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcclxuICBnYXA6IDAuMjVyZW07XHJcbiAgd2lkdGg6IGF1dG87XHJcbiAgbWFyZ2luLWxlZnQ6IC0xcmVtO1xyXG4gIGhlaWdodDogMTAwJTtcclxuICBvdmVyZmxvdy15OiBhdXRvO1xyXG59XHJcblxyXG4udmVydGljYWwtdGFiLWNvbnRlbnQge1xyXG4gIGZsZXgtZ3JvdzogMTtcclxuICBtaW4taGVpZ2h0OiAyMnJlbTtcclxuICBoZWlnaHQ6IDIycmVtO1xyXG4gIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XHJcbiAgYm9yZGVyLXJhZGl1czogMC4yNXJlbTtcclxuICBwYWRkaW5nOiAxcmVtO1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmOWY5Zjk7XHJcbn1cclxuIl19 */";
var styles = {"modal":"auth-module_modal__yyg5L","outer-container":"auth-module_outer-container__RraOQ","container":"auth-module_container__7utns","origin-tab":"auth-module_origin-tab__miOUK","origin-section":"auth-module_origin-section__UBhBB","origin-container":"auth-module_origin-container__ZIk4c","origin-label":"auth-module_origin-label__l-1q9","horizontal-divider":"auth-module_horizontal-divider__YfWCy","divider":"auth-module_divider__z65Me","origin-dashboard-button":"auth-module_origin-dashboard-button__-pch4","header":"auth-module_header__pX9nM","small-modal-icon":"auth-module_small-modal-icon__YayD1","wallet-address":"auth-module_wallet-address__AVVA5","close-button":"auth-module_close-button__uZrho","close-icon":"auth-module_close-icon__SSCni","linking-text":"auth-module_linking-text__uz3ud","provider-list":"auth-module_provider-list__6vISy","big":"auth-module_big__jQxvN","spinner":"auth-module_spinner__hfzlH","spin":"auth-module_spin__tm9l6","modal-icon":"auth-module_modal-icon__CV7ah","footer-text":"auth-module_footer-text__CQnh6","disconnect-button":"auth-module_disconnect-button__bsu-3","linking-button":"auth-module_linking-button__g1GlL","socials-wrapper":"auth-module_socials-wrapper__PshV3","socials-container":"auth-module_socials-container__iDzfJ","connector-container":"auth-module_connector-container__4wn11","connector-button":"auth-module_connector-button__j79HA","connector-connected":"auth-module_connector-connected__JvDQb","connector-checkmark":"auth-module_connector-checkmark__ZS6zU","unlink-connector-button":"auth-module_unlink-connector-button__6Fwkp","loader":"auth-module_loader__gH3ZC","no-socials":"auth-module_no-socials__wEx0t","tiktok-input":"auth-module_tiktok-input__FeqdG","invalid":"auth-module_invalid__qqgK6","otp-input-container":"auth-module_otp-input-container__B2NH6","otp-input":"auth-module_otp-input__vjImt","tabs":"auth-module_tabs__RcUmV","tab-button":"auth-module_tab-button__HT6wc","active-tab":"auth-module_active-tab__l6P44","tab-content":"auth-module_tab-content__noHF0","vertical-tabs-container":"auth-module_vertical-tabs-container__6sAOL","vertical-tabs":"auth-module_vertical-tabs__-ba-W","vertical-tab-content":"auth-module_vertical-tab-content__wTqKF"};
styleInject(css_248z$1);

const getIconBySocial = (social) => {
    switch (social) {
        case "twitter":
            return TwitterIcon;
        case "spotify":
            return SpotifyIcon;
        case "discord":
            return DiscordIcon;
        case "tiktok":
            return TikTokIcon;
        case "telegram":
            return TelegramIcon;
        default:
            return () => React.createElement(React.Fragment, null);
    }
};
const CheckMarkIcon = ({ w, h }) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", width: w || "1rem", height: h || "1rem" },
    React.createElement("path", { d: "M20 6L9 17l-5-5" })));
const XMarkIcon = ({ w, h }) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", width: w || "1rem", height: h || "1rem" },
    React.createElement("path", { d: "M18 6L6 18" }),
    React.createElement("path", { d: "M6 6l12 12" })));
const LinkIcon = ({ w, h }) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", width: w || "1rem", height: h || "1rem" },
    React.createElement("path", { d: "M14 4h-13v18h20v-11h1v12h-22v-20h14v1zm10 5h-1v-6.293l-11.646 11.647-.708-.708 11.647-11.646h-6.293v-1h8v8z" })));
const CampIcon = ({ customStyles }) => (React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 571.95 611.12", height: "1rem", width: "1rem", fill: "currentColor", style: customStyles },
    React.createElement("path", { d: "m563.25 431.49-66.17-51.46c-11.11-8.64-27.28-5.06-33.82 7.4-16.24 30.9-41.69 56.36-70.85 73.73l-69.35-69.35c-3.73-3.73-8.79-5.83-14.07-5.83s-10.34 2.1-14.07 5.83l-73.78 73.78c-57.37-30.39-96.55-90.71-96.55-160.03 0-99.79 81.19-180.98 180.98-180.98 60.35 0 118.17 26.28 156.39 89.44 6.85 11.32 21.92 14.33 32.59 6.51l64.21-47.06c9.53-6.98 12.06-20.15 5.78-30.16C508.83 54.41 411.43 0 305.56 0 137.07 0 0 137.07 0 305.56s137.07 305.56 305.56 305.56c57.6 0 113.72-16.13 162.31-46.63A306.573 306.573 0 0 0 568.8 460.8c5.78-9.78 3.42-22.34-5.55-29.31Zm-301.42 49.69 47.15-47.15 44.69 44.69c-15.92 5.1-32.2 7.83-48.1 7.83-15.08 0-29.72-1.87-43.74-5.36Zm42.36-222.47c-.07 1.49-.08 21.29 49.54 55.11 37.02 25.24 19.68 75.52 12.1 92.05a147.07 147.07 0 0 0-20.12-38.91c-12.73-17.59-26.87-28.9-36.74-35.59-10.38 6.36-27.41 18.74-41.07 40.02-8.27 12.89-12.82 25.16-15.42 34.48l-.03-.05c-15.1-40.6-9.75-60.88-1.95-71.9 6.12-8.65 17.24-20.6 17.24-20.6 9.71-9.66 19.96-19.06 29.82-38.17 6.06-11.75 6.59-15.84 6.63-16.45Z", fill: "#000", strokeWidth: "0" }),
    React.createElement("path", { d: "M267.74 313.33s-11.11 11.95-17.24 20.6c-7.8 11.02-13.14 31.3 1.95 71.9-86.02-75.3 2.56-152.15.79-146.3-6.58 21.75 14.49 53.8 14.49 53.8Zm20.98-23.66c3.01-4.27 5.97-9.06 8.8-14.55 6.62-12.83 6.64-16.54 6.64-16.54s-2.09 20.02 49.53 55.21c37.02 25.24 19.68 75.52 12.1 92.05 0 0 43.69-27.86 37.49-74.92-7.45-56.61-38.08-51.5-60.84-93.43-21.23-39.11 15.03-70.44 15.03-70.44s-48.54-2.61-70.76 48.42c-23.42 53.77 2 74.21 2 74.21Z", fill: "#ff6d01", strokeWidth: "0" })));
const DiscordIcon = () => (React.createElement("svg", { viewBox: "0 0 42 32", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M41.1302 23.4469V24.2363C41.0328 24.2948 41.0717 24.3923 41.062 24.4702C41.0328 24.8991 40.9938 25.3279 40.9645 25.7568C40.9548 25.9322 40.8866 26.0589 40.7306 26.1661C37.7092 28.3396 34.4247 30.0062 30.8672 31.1173C30.6528 31.1856 30.5358 31.1563 30.3994 30.9711C29.6879 29.977 29.0446 28.9439 28.4696 27.862C28.3624 27.6573 28.4111 27.5989 28.6061 27.5209C29.532 27.17 30.4286 26.7509 31.2961 26.2733C31.8419 25.981 31.8224 25.9907 31.3546 25.5911C31.1109 25.3767 30.9062 25.3474 30.5943 25.4936C27.7971 26.7509 24.8634 27.4624 21.7933 27.5989C18.0507 27.7645 14.4542 27.092 11.0235 25.6008C10.5069 25.3767 10.1463 25.3669 9.75645 25.7763C9.59076 25.9517 9.54202 25.9907 9.77594 26.1271C10.7213 26.6534 11.6862 27.131 12.6999 27.5014C12.963 27.5989 12.963 27.6963 12.8461 27.9205C12.2905 28.9634 11.6667 29.9575 10.9942 30.9224C10.8383 31.1466 10.6921 31.1953 10.429 31.1173C6.91049 29.9965 3.65518 28.3591 0.663021 26.2051C0.497331 26.0784 0.419365 25.9615 0.409619 25.747C0.409619 25.4156 0.360879 25.094 0.341386 24.7626C0.156204 21.9752 0.292661 19.2072 0.789729 16.4489C1.66691 11.5952 3.61619 7.18007 6.33545 3.08656C6.43291 2.94037 6.54012 2.8429 6.69607 2.76493C9.25938 1.61485 11.9202 0.805904 14.6784 0.308836C14.8538 0.279597 14.961 0.308829 15.0488 0.484265C15.3217 1.04956 15.6141 1.6051 15.887 2.17039C15.9844 2.37507 16.0624 2.4628 16.3158 2.42381C19.2397 2.01446 22.1734 2.02421 25.0973 2.42381C25.2923 2.45305 25.3702 2.39457 25.4385 2.22889C25.7114 1.65385 26.0038 1.08854 26.2767 0.513503C26.3644 0.32832 26.4813 0.26985 26.686 0.308836C29.4248 0.805904 32.066 1.61486 34.6099 2.74545C34.7853 2.82342 34.912 2.94037 35.0192 3.10606C38.4305 8.18395 40.5454 13.7297 40.9938 19.8699C41.0133 20.1623 40.9548 20.4742 41.101 20.7666V21.4976C41.0035 21.634 41.0328 21.7997 41.0425 21.9459C41.0718 22.4527 40.9645 22.9693 41.101 23.4761L41.1302 23.4469ZM23.8108 17.063C23.8108 18.0961 24.035 18.9148 24.5223 19.6458C25.8868 21.7218 28.5963 21.9069 30.1655 20.0259C31.53 18.3885 31.4618 15.8349 29.9998 14.2755C28.7815 12.9792 26.8225 12.8038 25.419 13.8856C24.3371 14.7238 23.8595 15.8739 23.8206 17.063H23.8108ZM17.5731 17.3748C17.5731 16.6244 17.4756 16.0103 17.2027 15.4353C16.5595 14.1 15.5361 13.2424 14.0059 13.1936C12.4952 13.1449 11.4328 13.9246 10.7408 15.2111C9.88315 16.829 10.1366 18.7881 11.3549 20.1623C12.5829 21.5463 14.6102 21.7315 16.0526 20.5619C17.0955 19.714 17.5438 18.5737 17.5828 17.3748H17.5731Z", fill: "#5865F2" })));
const TwitterIcon = () => (React.createElement("svg", { viewBox: "0 0 33 27", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M32.3127 3.1985C31.3088 3.64684 30.2075 3.92949 29.1257 4.10493C29.6422 4.01721 30.3927 3.09129 30.6948 2.71118C31.1529 2.13614 31.5428 1.48313 31.7572 0.781387C31.7864 0.722908 31.8059 0.654685 31.7572 0.615699C31.689 0.58646 31.6402 0.605947 31.5915 0.62544C30.3829 1.26871 29.1354 1.73654 27.8099 2.07766C27.7027 2.1069 27.615 2.07766 27.5467 2.00943C27.4395 1.88273 27.3323 1.76578 27.2153 1.66832C26.6598 1.19074 26.0555 0.820367 25.383 0.547467C24.4961 0.186849 23.5312 0.0309141 22.576 0.0991391C21.6501 0.157618 20.734 0.420776 19.9055 0.849619C19.0771 1.27846 18.3461 1.88273 17.7516 2.60397C17.1473 3.35444 16.6989 4.24137 16.465 5.17702C16.2409 6.08344 16.2603 6.98012 16.3968 7.89629C16.4163 8.05223 16.3968 8.07173 16.2701 8.05224C11.0752 7.28227 6.76732 5.42069 3.26834 1.4344C3.1124 1.25896 3.03443 1.25897 2.90773 1.44415C1.37754 3.73457 2.11826 7.41871 4.02857 9.23155C4.28197 9.47521 4.54513 9.71887 4.82777 9.93329C4.72056 9.95278 3.45353 9.81633 2.32294 9.23155C2.167 9.13408 2.09877 9.19257 2.07928 9.35826C2.06953 9.60192 2.07928 9.83583 2.11827 10.099C2.41066 12.4284 4.01882 14.5726 6.23126 15.4108C6.49442 15.518 6.78681 15.6155 7.06946 15.6642C6.56264 15.7714 6.04608 15.8494 4.61335 15.7422C4.43792 15.7032 4.36969 15.8006 4.43792 15.9663C5.51977 18.9195 7.85892 19.7967 9.60353 20.2938C9.83744 20.3327 10.0714 20.3327 10.3053 20.3912C10.2955 20.4107 10.276 20.4107 10.2663 20.4302C9.6815 21.3171 7.67374 21.9701 6.73808 22.3015C5.03245 22.8961 3.18063 23.169 1.37754 22.9838C1.08514 22.9448 1.02666 22.9448 0.948692 22.9838C0.870721 23.0325 0.938946 23.1007 1.02666 23.1787C1.39703 23.4224 1.76739 23.6368 2.1475 23.8415C3.28784 24.4457 4.48665 24.9331 5.73419 25.2742C12.1766 27.0578 19.4279 25.742 24.2622 20.937C28.0633 17.1652 29.3888 11.9605 29.3888 6.7462C29.3888 6.54153 29.6325 6.43433 29.7689 6.31737C30.7533 5.57664 31.5525 4.68971 32.2932 3.69558C32.4589 3.47141 32.4589 3.27648 32.4589 3.18876V3.15952C32.4589 3.0718 32.4589 3.10104 32.3322 3.15952L32.3127 3.1985Z", fill: "#1F9CEA" })));
const SpotifyIcon = () => (React.createElement("svg", { role: "img", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", fill: "#1DB954" },
    React.createElement("path", { d: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" })));
const TikTokIcon = () => (React.createElement("svg", { role: "img", viewBox: "-2 -2 28 28", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("title", null, "TikTok"),
    React.createElement("path", { d: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" })));
const TelegramIcon = () => (React.createElement("svg", { role: "img", viewBox: "0 0 24 24", xmlns: "http://www.w3.org/2000/svg", fill: "#0088cc" },
    React.createElement("title", null, "Telegram"),
    React.createElement("path", { d: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" })));
const CloseIcon = () => (React.createElement("svg", { className: styles["close-icon"], viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" },
    React.createElement("path", { d: "M18 6L6 18", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }),
    React.createElement("path", { d: "M6 6L18 18", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })));

/**
 * Creates a wrapper element and appends it to the body.
 * @param { string } wrapperId The wrapper ID.
 * @returns { HTMLElement } The wrapper element.
 */
const createWrapperAndAppendToBody = (wrapperId) => {
    const wrapperElement = document.createElement("div");
    wrapperElement.setAttribute("id", wrapperId);
    document.body.appendChild(wrapperElement);
    return wrapperElement;
};
/**
 * The ReactPortal component. Renders children in a portal.
 * @param { { children: JSX.Element, wrapperId: string } } props The props.
 * @returns { JSX.Element } The ReactPortal component.
 */
const ReactPortal = ({ children, wrapperId = "react-portal-wrapper", }) => {
    const [wrapperElement, setWrapperElement] = useState(null);
    useLayoutEffect(() => {
        let element = document.getElementById(wrapperId);
        let systemCreated = false;
        if (!element) {
            systemCreated = true;
            element = createWrapperAndAppendToBody(wrapperId);
        }
        setWrapperElement(element);
        return () => {
            if (systemCreated && (element === null || element === void 0 ? void 0 : element.parentNode)) {
                element.parentNode.removeChild(element);
            }
        };
    }, [wrapperId]);
    if (wrapperElement === null)
        return null;
    return createPortal(children, wrapperElement);
};
/**
 * The ClientOnly component. Renders children only on the client. Needed for Next.js.
 * @param { { children: JSX.Element } } props The props.
 * @returns { JSX.Element } The ClientOnly component.
 */
const ClientOnly = (_a) => {
    var { children } = _a, delegated = __rest(_a, ["children"]);
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);
    if (!hasMounted) {
        return null;
    }
    return React.createElement("div", Object.assign({}, delegated), children);
};
/**
 * Returns the icon URL based on the connector name.
 * @param {string} name - The connector name.
 * @returns {string} The icon URL.
 */
const getIconByConnectorName = (name) => {
    switch (name) {
        case "AppKit Auth":
            return "data:image/svg+xml,%3Csvg width='56' height='56' viewBox='0 0 56 56' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='56' height='56' rx='16.3333' fill='%23FF573B'/%3E%3Cpath d='M11.6667 33.8333H44.3334V38.5C44.3334 39.7886 43.2501 40.8333 41.9137 40.8333H14.0865C12.7501 40.8333 11.6667 39.7886 11.6667 38.5V33.8333Z' fill='%23202020'/%3E%3Cpath d='M11.6667 24.5H44.3334V31.5H11.6667V24.5Z' fill='%23202020'/%3E%3Cpath d='M11.6667 17.5C11.6667 16.2113 12.7501 15.1666 14.0865 15.1666H41.9137C43.2501 15.1666 44.3334 16.2113 44.3334 17.5V22.1666H11.6667V17.5Z' fill='%23202020'/%3E%3C/svg%3E";
        case "Privy Wallet":
            return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='-25 -25 410 514' fill='none' id='svg-669804622_503'%3E%3Cpath d='M180 359.794C279.396 359.794 360 279.236 360 179.897C360 80.5579 279.396 0 180 0C80.604 0 0 80.5579 0 179.897C0 279.236 80.604 359.794 180 359.794Z' fill='%23010110'/%3E%3Cpath d='M180 463.997C247.932 463.997 303.012 452.411 303.012 438.2C303.012 423.988 247.968 412.402 180 412.402C112.032 412.402 56.9883 423.988 56.9883 438.2C56.9883 452.411 112.032 463.997 180 463.997Z' fill='%23010110'/%3E%3C/svg%3E";
        default:
            if (name.toLowerCase().includes("privy")) {
                return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='-25 -25 410 514' fill='none' id='svg-669804622_503'%3E%3Cpath d='M180 359.794C279.396 359.794 360 279.236 360 179.897C360 80.5579 279.396 0 180 0C80.604 0 0 80.5579 0 179.897C0 279.236 80.604 359.794 180 359.794Z' fill='%23010110'/%3E%3Cpath d='M180 463.997C247.932 463.997 303.012 452.411 303.012 438.2C303.012 423.988 247.968 412.402 180 412.402C112.032 412.402 56.9883 423.988 56.9883 438.2C56.9883 452.411 112.032 463.997 180 463.997Z' fill='%23010110'/%3E%3C/svg%3E";
            }
            else if (name.toLowerCase().includes("appkit")) {
                return "data:image/svg+xml,%3Csvg width='56' height='56' viewBox='0 0 56 56' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='56' height='56' rx='16.3333' fill='%23FF573B'/%3E%3Cpath d='M11.6667 33.8333H44.3334V38.5C44.3334 39.7886 43.2501 40.8333 41.9137 40.8333H14.0865C12.7501 40.8333 11.6667 39.7886 11.6667 38.5V33.8333Z' fill='%23202020'/%3E%3Cpath d='M11.6667 24.5H44.3334V31.5H11.6667V24.5Z' fill='%23202020'/%3E%3Cpath d='M11.6667 17.5C11.6667 16.2113 12.7501 15.1666 14.0865 15.1666H41.9137C43.2501 15.1666 44.3334 16.2113 44.3334 17.5V22.1666H11.6667V17.5Z' fill='%23202020'/%3E%3C/svg%3E";
            }
            else
                return "";
    }
};

const ToastContext = React.createContext(undefined);
const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});
    const remainingTimes = useRef({});
    const startTimes = useRef({});
    const isHovering = useRef(false);
    const addToast = (message, type = "info", duration = 3000) => {
        const id = Date.now();
        setToasts((prevToasts) => [
            ...prevToasts,
            { id, message, type, isVisible: true },
        ]);
        remainingTimes.current[id] = duration;
        startTimes.current[id] = Date.now();
        timers.current[id] = setTimeout(() => removeToast(id), duration);
    };
    const removeToast = (id) => {
        setToasts((prevToasts) => prevToasts.map((toast) => toast.id === id ? Object.assign(Object.assign({}, toast), { isVisible: false }) : toast));
        setTimeout(() => {
            setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
            delete timers.current[id];
            delete remainingTimes.current[id];
            delete startTimes.current[id];
        }, 300);
    };
    const handleMouseEnter = () => {
        isHovering.current = true;
        Object.keys(timers.current).forEach((id) => {
            clearTimeout(timers.current[Number(id)]);
            remainingTimes.current[Number(id)] -=
                Date.now() - startTimes.current[Number(id)];
        });
    };
    const handleMouseLeave = () => {
        isHovering.current = false;
        Object.keys(remainingTimes.current).forEach((id) => {
            if (remainingTimes.current[Number(id)] > 0) {
                startTimes.current[Number(id)] = Date.now();
                timers.current[Number(id)] = setTimeout(() => removeToast(Number(id)), remainingTimes.current[Number(id)]);
            }
        });
    };
    return (React.createElement(ToastContext.Provider, { value: { addToast } },
        children,
        React.createElement(ReactPortal, { wrapperId: "toast-wrapper" },
            React.createElement("div", { className: styles$2["toast-container"], onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }, toasts.map((toast) => (React.createElement("div", { key: toast.id, className: `${styles$2.toast} ${styles$2[`toast-${toast.type}`]} ${toast.isVisible ? styles$2["toast-enter"] : styles$2["toast-exit"]}`, onClick: () => removeToast(toast.id) }, toast.message)))))));
};
const useToast = () => {
    const context = React.useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};

const OriginContext = createContext({
    query: null,
});
const OriginProvider = ({ children }) => {
    const { authenticated } = useAuthState();
    const { auth } = useContext(CampContext);
    if (!auth) {
        throw new Error("Auth instance is not available");
    }
    const query = useQuery({
        queryKey: ["origin", authenticated],
        queryFn: () => auth.getOriginUsage(),
    });
    return (React.createElement(OriginContext.Provider, { value: {
            query,
        } }, children));
};

const CampContext = createContext({
    clientId: null,
    auth: null,
    setAuth: () => { },
    wagmiAvailable: false,
    ackee: null,
    setAckee: () => { },
});
/**
 * CampProvider
 * @param {Object} props The props
 * @param {string} props.clientId The Camp client ID
 * @param {string} props.redirectUri The redirect URI to use after social oauths
 * @param {React.ReactNode} props.children The children components
 * @param {boolean} props.allowAnalytics Whether to allow analytics to be sent
 * @returns {JSX.Element} The CampProvider component
 */
const CampProvider = ({ clientId, redirectUri, children, allowAnalytics = true, }) => {
    const isServer = typeof window === "undefined";
    const ackeeInstance = allowAnalytics && !isServer
        ? create(constants.ACKEE_INSTANCE, {
            detailed: false,
            ignoreLocalhost: true,
            ignoreOwnVisits: false,
        })
        : null;
    const [ackee, setAckee] = useState(ackeeInstance);
    const [auth, setAuth] = useState(new Auth({
        clientId,
        redirectUri: redirectUri
            ? redirectUri
            : !isServer
                ? window.location.href
                : "",
        ackeeInstance,
    }));
    const wagmiContext = useContext(WagmiContext);
    return (React.createElement(CampContext.Provider, { value: {
            clientId,
            auth,
            setAuth,
            wagmiAvailable: wagmiContext !== undefined,
            ackee,
            setAckee,
        } },
        React.createElement(SocialsProvider, null,
            React.createElement(OriginProvider, null,
                React.createElement(ToastProvider, null,
                    React.createElement(ModalProvider, null, children))))));
};

const getWalletConnectProvider = (projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const provider = yield EthereumProvider.init({
        optionalChains: [testnet.id],
        projectId,
        showQrModal: true,
        methods: ["personal_sign"]
    });
    return provider;
});
const useWalletConnectProvider = (projectId) => {
    const [walletConnectProvider, setWalletConnectProvider] = useState(null);
    useEffect(() => {
        const fetchWalletConnectProvider = () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const provider = yield getWalletConnectProvider(projectId);
                setWalletConnectProvider(provider);
            }
            catch (error) {
                console.error("Error getting WalletConnect provider:", error);
            }
        });
        fetchWalletConnectProvider();
    }, [projectId]);
    return walletConnectProvider;
};

var css_248z = ".buttons-module_connect-button__CJhUa{background-color:#ff6f00;border:none;border-radius:.75rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);color:#fff;font-family:Satoshi,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;font-size:1rem;font-weight:600;height:2.75rem;line-height:1.333rem;padding-inline:2.5rem;padding-left:5rem;position:relative;transition:background-color .15s;width:12rem}.buttons-module_connect-button__CJhUa .buttons-module_button-icon__JM4-2{background:hsla(0,0%,100%,.75);border-radius:.75rem 0 0 .75rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05);display:grid;height:100%;left:0;margin-right:.5rem;place-items:center;position:absolute;top:50%;transform:translateY(-50%);transition:background-color .15s;width:3rem}.buttons-module_connect-button__CJhUa .buttons-module_button-icon__JM4-2 svg{height:1.25rem;width:1.25rem}.buttons-module_connect-button__CJhUa:hover{background-color:#cc4e02;border-color:#cc4e02;cursor:pointer}.buttons-module_connect-button__CJhUa:hover .buttons-module_button-icon__JM4-2{background:hsla(0,0%,100%,.675)}.buttons-module_connect-button__CJhUa:focus{outline:none}.buttons-module_connect-button__CJhUa:disabled{background-color:#ccc;cursor:not-allowed}.buttons-module_provider-button__6JY7s{align-items:center;background-color:#fefefe;border:1px solid #ddd;border-radius:.5rem;display:flex;font-family:inherit;gap:.5rem;justify-content:flex-start;padding:.5rem;transition:background-color .15s;width:100%}.buttons-module_provider-button__6JY7s:focus{outline:1px solid #43b7c4}.buttons-module_provider-button__6JY7s:hover{border-color:#43b7c4}.buttons-module_provider-button__6JY7s:hover:not(:disabled){background-color:#ddd;cursor:pointer}.buttons-module_provider-button__6JY7s img{height:2rem;width:2rem}.buttons-module_provider-button__6JY7s .buttons-module_provider-icon__MOhr8{border-radius:.2rem}.buttons-module_provider-button__6JY7s span{line-height:1rem;margin-left:.5rem}.buttons-module_provider-button__6JY7s span.buttons-module_provider-name__tHWO2{color:#333;font-size:.875rem}.buttons-module_provider-button__6JY7s span.buttons-module_provider-label__CEGRr{color:#777;font-size:.7rem}.buttons-module_link-button-default__EcKUT{background-color:#ff6f00;border:none;border-radius:.75rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);box-sizing:border-box;cursor:pointer;height:2.6rem;position:relative;width:7rem}.buttons-module_link-button-default__EcKUT:disabled{background-color:#b8b8b8;cursor:not-allowed}.buttons-module_link-button-default__EcKUT:after{background-color:transparent;border-radius:.75rem;bottom:0;content:\"\";left:0;position:absolute;right:0;top:0;transition:background-color .15s}.buttons-module_link-button-default__EcKUT:disabled:after{background-color:rgba(0,0,0,.35);border-radius:.35rem;color:#fff;content:\"Not connected\";display:grid;font-size:.75rem;height:2rem;left:0;opacity:0;padding:.25rem;place-items:center;position:absolute;right:0;top:-2.7rem;transform:translateY(-.5rem);transition:all .25s;-webkit-user-select:none;-moz-user-select:none;user-select:none;visibility:hidden}.buttons-module_link-button-default__EcKUT:disabled:hover:after{opacity:1;transform:translateY(0);visibility:visible}.buttons-module_link-button-default__EcKUT:not(:disabled):hover:after{background-color:rgba(0,0,0,.1)}.buttons-module_link-button-default__EcKUT:not(:disabled).buttons-module_twitter__9sRaz{background-color:#1da1f2}.buttons-module_link-button-default__EcKUT:not(:disabled).buttons-module_spotify__-fiKQ{background-color:#1db954}.buttons-module_link-button-default__EcKUT:not(:disabled).buttons-module_discord__I-YjZ{background-color:#7289da}.buttons-module_link-button-default__EcKUT:not(:disabled).buttons-module_tiktok__a80-0{background-color:#000}.buttons-module_link-button-default__EcKUT:not(:disabled).buttons-module_telegram__ExOTS{background-color:#08c}.buttons-module_link-button-default__EcKUT .buttons-module_button-container__-oPqd{align-items:center;display:flex;flex-direction:row;gap:.5rem;justify-content:center;padding:.5rem}.buttons-module_button-container__-oPqd .buttons-module_social-icon__DPdPe{align-items:center;color:#fff;display:flex;height:1.5rem;justify-content:center;width:1.5rem}.buttons-module_button-container__-oPqd .buttons-module_social-icon__DPdPe svg{fill:#fff!important;height:1.5rem;width:1.5rem}.buttons-module_button-container__-oPqd .buttons-module_social-icon__DPdPe svg path{fill:#fff!important}.buttons-module_button-container__-oPqd .buttons-module_link-icon__8V8FP{align-items:center;color:hsla(0,0%,100%,.8);display:flex;height:1.25rem;justify-content:center;width:1.25rem}.buttons-module_button-container__-oPqd .buttons-module_camp-logo__slNl0{align-items:center;background-color:#fff;border-radius:50%;box-sizing:border-box;display:flex;height:1.5rem;justify-content:center;padding:.15rem;width:1.5rem}.buttons-module_link-button-default__EcKUT:disabled .buttons-module_button-container__-oPqd .buttons-module_camp-logo__slNl0 svg path{fill:#b8b8b8!important}.buttons-module_link-button-icon__llX8m{background-color:#ff6f00;border:none;border-radius:.75rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);box-sizing:border-box;cursor:pointer;height:3rem;min-height:3rem;min-width:3rem;padding:0;position:relative;width:3rem}.buttons-module_link-button-icon__llX8m:disabled{background-color:#b8b8b8;cursor:not-allowed}.buttons-module_link-button-icon__llX8m:disabled:after{background-color:rgba(0,0,0,.35);border-radius:.35rem;box-sizing:border-box;color:#fff;content:\"Not connected\";display:grid;font-size:.75rem;height:-moz-fit-content;height:fit-content;left:-1rem;opacity:0;padding:.25rem;place-items:center;position:absolute;right:-1rem;top:-2.7rem;transform:translateY(-.5rem);transition:all .25s}.buttons-module_link-button-icon__llX8m:disabled:hover:after{opacity:1;transform:translateY(0)}.buttons-module_link-button-icon__llX8m:after{background-color:transparent;border-radius:.75rem;bottom:0;content:\"\";left:0;position:absolute;right:0;top:0;transition:background-color .15s}.buttons-module_link-button-icon__llX8m:not(:disabled):hover:after{background-color:rgba(0,0,0,.1)}.buttons-module_link-button-icon__llX8m:not(:disabled).buttons-module_twitter__9sRaz{background-color:#1da1f2}.buttons-module_link-button-icon__llX8m:not(:disabled).buttons-module_spotify__-fiKQ{background-color:#1db954}.buttons-module_link-button-icon__llX8m:not(:disabled).buttons-module_discord__I-YjZ{background-color:#7289da}.buttons-module_link-button-icon__llX8m:not(:disabled).buttons-module_tiktok__a80-0{background-color:#000}.buttons-module_link-button-icon__llX8m:not(:disabled).buttons-module_telegram__ExOTS{background-color:#08c}.buttons-module_link-button-icon__llX8m .buttons-module_icon-container__Q5bI1{align-items:center;display:flex;flex:1;height:100%;justify-content:center;position:relative;width:100%}.buttons-module_link-button-icon__llX8m .buttons-module_icon-container__Q5bI1>svg{fill:#fff!important;height:1.5rem;width:1.5rem}.buttons-module_link-button-icon__llX8m .buttons-module_icon-container__Q5bI1>svg path{fill:#fff!important}.buttons-module_link-button-icon__llX8m .buttons-module_camp-logo__slNl0{align-items:center;background-color:#fff;border-radius:50%;bottom:-.5rem;box-sizing:border-box;display:flex;height:1.5rem;justify-content:center;position:absolute;right:-.5rem;width:1.5rem}.buttons-module_link-button-icon__llX8m .buttons-module_camp-logo__slNl0 svg{height:1.1rem;width:1.1rem}.buttons-module_link-button-icon__llX8m:disabled .buttons-module_camp-logo__slNl0 svg path,.buttons-module_not-linked__ua4va svg path{fill:#b8b8b8!important}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJ1dHRvbnMubW9kdWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxzQ0FFRSx3QkFBeUIsQ0FFekIsV0FBWSxDQUNaLG9CQUFzQixDQVd0QiwyR0FDeUUsQ0FkekUsVUFBWSxDQVVaLDBJQUVZLENBTFosY0FBZSxDQUNmLGVBQWdCLENBSGhCLGNBQWUsQ0FDZixvQkFBcUIsQ0FIckIscUJBQXNCLENBQ3RCLGlCQUFrQixDQU5sQixpQkFBa0IsQ0FpQmxCLGdDQUFrQyxDQU5sQyxXQU9GLENBRUEseUVBUUUsOEJBQXFDLENBTXJDLCtCQUFrQyxDQUxsQyw2RUFDc0MsQ0FDdEMsWUFBYSxDQUxiLFdBQVksQ0FIWixNQUFPLENBSVAsa0JBQW9CLENBS3BCLGtCQUFtQixDQVhuQixpQkFBa0IsQ0FDbEIsT0FBUSxDQUVSLDBCQUEyQixDQVMzQixnQ0FBa0MsQ0FSbEMsVUFVRixDQUVBLDZFQUVFLGNBQWUsQ0FEZixhQUVGLENBRUEsNENBQ0Usd0JBQXlCLENBRXpCLG9CQUFxQixDQURyQixjQUVGLENBRUEsK0VBQ0UsK0JBQ0YsQ0FFQSw0Q0FDRSxZQUNGLENBRUEsK0NBQ0UscUJBQXNCLENBQ3RCLGtCQUNGLENBRUEsdUNBTUUsa0JBQW1CLENBRG5CLHdCQUF5QixDQUZ6QixxQkFBc0IsQ0FDdEIsbUJBQXFCLENBSHJCLFlBQWEsQ0FVYixtQkFBb0IsQ0FIcEIsU0FBVyxDQURYLDBCQUEyQixDQUwzQixhQUFlLENBUWYsZ0NBQWtDLENBRGxDLFVBR0YsQ0FFQSw2Q0FDRSx5QkFDRixDQUVBLDZDQUNFLG9CQUNGLENBRUEsNERBQ0UscUJBQXNCLENBQ3RCLGNBQ0YsQ0FFQSwyQ0FFRSxXQUFZLENBRFosVUFFRixDQUVBLDRFQUNFLG1CQUNGLENBRUEsNENBRUUsZ0JBQWlCLENBRGpCLGlCQUVGLENBRUEsZ0ZBQ0UsVUFBVyxDQUNYLGlCQUNGLENBRUEsaUZBQ0UsVUFBVyxDQUNYLGVBQ0YsQ0FHQSwyQ0FNRSx3QkFBeUIsQ0FIekIsV0FBWSxDQUlaLG9CQUFzQixDQUN0QiwyR0FDeUUsQ0FQekUscUJBQXNCLENBUXRCLGNBQWUsQ0FMZixhQUFjLENBSmQsaUJBQWtCLENBR2xCLFVBT0YsQ0FFQSxvREFDRSx3QkFBeUIsQ0FDekIsa0JBQ0YsQ0FFQSxpREFRRSw0QkFBa0MsQ0FEbEMsb0JBQXNCLENBRHRCLFFBQVMsQ0FMVCxVQUFXLENBR1gsTUFBTyxDQUZQLGlCQUFrQixDQUdsQixPQUFRLENBRlIsS0FBTSxDQU1OLGdDQUNGLENBRUEsMERBU0UsZ0NBQXFDLENBRHJDLG9CQUFzQixDQUV0QixVQUFZLENBVFosdUJBQXdCLENBVXhCLFlBQWEsQ0FFYixnQkFBa0IsQ0FObEIsV0FBWSxDQUZaLE1BQU8sQ0FVUCxTQUFVLENBRFYsY0FBZ0IsQ0FGaEIsa0JBQW1CLENBVG5CLGlCQUFrQixDQUdsQixPQUFRLENBRlIsV0FBWSxDQWFaLDRCQUE4QixDQUQ5QixtQkFBcUIsQ0FFckIsd0JBQWlCLENBQWpCLHFCQUFpQixDQUFqQixnQkFBaUIsQ0FoQmpCLGlCQWlCRixDQUVBLGdFQUVFLFNBQVUsQ0FDVix1QkFBd0IsQ0FGeEIsa0JBR0YsQ0FFQSxzRUFDRSwrQkFDRixDQUVBLHdGQUNFLHdCQUNGLENBRUEsd0ZBQ0Usd0JBQ0YsQ0FFQSx3RkFDRSx3QkFDRixDQUVBLHVGQUNFLHFCQUNGLENBRUEseUZBQ0UscUJBQ0YsQ0FFQSxtRkFLRSxrQkFBbUIsQ0FKbkIsWUFBYSxDQUNiLGtCQUFtQixDQUNuQixTQUFXLENBQ1gsc0JBQXVCLENBRXZCLGFBQ0YsQ0FFQSwyRUFJRSxrQkFBbUIsQ0FFbkIsVUFBWSxDQUxaLFlBQWEsQ0FFYixhQUFjLENBRWQsc0JBQXVCLENBSHZCLFlBS0YsQ0FFQSwrRUFHRSxtQkFBc0IsQ0FEdEIsYUFBYyxDQURkLFlBR0YsQ0FFQSxvRkFDRSxtQkFDRixDQUVBLHlFQUlFLGtCQUFtQixDQUVuQix3QkFBK0IsQ0FML0IsWUFBYSxDQUViLGNBQWUsQ0FFZixzQkFBdUIsQ0FIdkIsYUFLRixDQUVBLHlFQUtFLGtCQUFtQixDQUVuQixxQkFBdUIsQ0FDdkIsaUJBQWtCLENBUGxCLHFCQUFzQixDQUN0QixZQUFhLENBRWIsYUFBYyxDQUVkLHNCQUF1QixDQUd2QixjQUFnQixDQU5oQixZQU9GLENBRUEsc0lBQ0Usc0JBQ0YsQ0FHQSx3Q0FTRSx3QkFBeUIsQ0FGekIsV0FBWSxDQUdaLG9CQUFzQixDQUN0QiwyR0FDeUUsQ0FWekUscUJBQXNCLENBV3RCLGNBQWUsQ0FQZixXQUFZLENBRlosZUFBZ0IsQ0FEaEIsY0FBZSxDQUtmLFNBQWEsQ0FQYixpQkFBa0IsQ0FJbEIsVUFTRixDQUVBLGlEQUNFLHdCQUF5QixDQUN6QixrQkFDRixDQUVBLHVEQVNFLGdDQUFxQyxDQURyQyxvQkFBc0IsQ0FQdEIscUJBQXNCLENBU3RCLFVBQVksQ0FSWix1QkFBd0IsQ0FTeEIsWUFBYSxDQUViLGdCQUFrQixDQU5sQix1QkFBbUIsQ0FBbkIsa0JBQW1CLENBRm5CLFVBQVcsQ0FVWCxTQUFVLENBRFYsY0FBZ0IsQ0FGaEIsa0JBQW1CLENBVG5CLGlCQUFrQixDQUdsQixXQUFZLENBRlosV0FBWSxDQWFaLDRCQUE4QixDQUQ5QixtQkFFRixDQUVBLDZEQUNFLFNBQVUsQ0FDVix1QkFDRixDQUVBLDhDQVFFLDRCQUFrQyxDQURsQyxvQkFBc0IsQ0FEdEIsUUFBUyxDQUxULFVBQVcsQ0FHWCxNQUFPLENBRlAsaUJBQWtCLENBR2xCLE9BQVEsQ0FGUixLQUFNLENBTU4sZ0NBQ0YsQ0FFQSxtRUFDRSwrQkFDRixDQUVBLHFGQUNFLHdCQUNGLENBRUEscUZBQ0Usd0JBQ0YsQ0FFQSxxRkFDRSx3QkFDRixDQUVBLG9GQUNFLHFCQUNGLENBRUEsc0ZBQ0UscUJBQ0YsQ0FFQSw4RUFNRSxrQkFBbUIsQ0FKbkIsWUFBYSxDQUdiLE1BQU8sQ0FEUCxXQUFZLENBR1osc0JBQXVCLENBTnZCLGlCQUFrQixDQUVsQixVQUtGLENBRUEsa0ZBR0UsbUJBQXNCLENBRHRCLGFBQWMsQ0FEZCxZQUdGLENBRUEsdUZBQ0UsbUJBQ0YsQ0FFQSx5RUFRRSxrQkFBbUIsQ0FFbkIscUJBQXVCLENBQ3ZCLGlCQUFrQixDQUpsQixhQUFlLENBTGYscUJBQXNCLENBQ3RCLFlBQWEsQ0FFYixhQUFjLENBSWQsc0JBQXVCLENBUnZCLGlCQUFrQixDQUtsQixZQUFjLENBRmQsWUFRRixDQUVBLDZFQUVFLGFBQWMsQ0FEZCxZQUVGLENBTUEsc0lBQ0Usc0JBQ0YiLCJmaWxlIjoiYnV0dG9ucy5tb2R1bGUuY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNvbm5lY3QtYnV0dG9uIHtcclxuICBwb3NpdGlvbjogcmVsYXRpdmU7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmNmYwMDtcclxuICBjb2xvcjogd2hpdGU7XHJcbiAgYm9yZGVyOiBub25lO1xyXG4gIGJvcmRlci1yYWRpdXM6IDAuNzVyZW07XHJcbiAgcGFkZGluZy1pbmxpbmU6IDIuNXJlbTtcclxuICBwYWRkaW5nLWxlZnQ6IDVyZW07XHJcbiAgaGVpZ2h0OiAyLjc1cmVtO1xyXG4gIGxpbmUtaGVpZ2h0OiAxLjMzM3JlbTtcclxuICBmb250LXNpemU6IDFyZW07XHJcbiAgZm9udC13ZWlnaHQ6IDYwMDtcclxuICB3aWR0aDogMTJyZW07XHJcbiAgZm9udC1mYW1pbHk6IFwiU2F0b3NoaVwiLCBzeXN0ZW0tdWksIC1hcHBsZS1zeXN0ZW0sIEJsaW5rTWFjU3lzdGVtRm9udCxcclxuICAgIFwiU2Vnb2UgVUlcIiwgUm9ib3RvLCBPeHlnZW4sIFVidW50dSwgQ2FudGFyZWxsLCBcIk9wZW4gU2Fuc1wiLCBcIkhlbHZldGljYSBOZXVlXCIsXHJcbiAgICBzYW5zLXNlcmlmO1xyXG4gIGJveC1zaGFkb3c6IGhzbGEoMCwgMCUsIDEwMCUsIDAuMTUpIDAgMnB4IDAgaW5zZXQsXHJcbiAgICByZ2JhKDAsIDAsIDAsIDAuMDUpIDAgLTJweCA0cHggaW5zZXQsIHJnYmEoNDYsIDU0LCA4MCwgMC4wNzUpIDAgMXB4IDFweDtcclxuICB0cmFuc2l0aW9uOiBiYWNrZ3JvdW5kLWNvbG9yIDAuMTVzO1xyXG59XHJcblxyXG4uY29ubmVjdC1idXR0b24gLmJ1dHRvbi1pY29uIHtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgdG9wOiA1MCU7XHJcbiAgbGVmdDogMDtcclxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7XHJcbiAgd2lkdGg6IDNyZW07XHJcbiAgaGVpZ2h0OiAxMDAlO1xyXG4gIG1hcmdpbi1yaWdodDogMC41cmVtO1xyXG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC43NSk7XHJcbiAgYm94LXNoYWRvdzogaHNsYSgwLCAwJSwgMTAwJSwgMC4xNSkgMCAycHggMCBpbnNldCxcclxuICAgIHJnYmEoMCwgMCwgMCwgMC4wNSkgMCAtMnB4IDRweCBpbnNldDtcclxuICBkaXNwbGF5OiBncmlkO1xyXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XHJcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjE1cztcclxuICBib3JkZXItcmFkaXVzOiAwLjc1cmVtIDAgMCAwLjc1cmVtO1xyXG59XHJcblxyXG4uY29ubmVjdC1idXR0b24gLmJ1dHRvbi1pY29uIHN2ZyB7XHJcbiAgd2lkdGg6IDEuMjVyZW07XHJcbiAgaGVpZ2h0OiAxLjI1cmVtO1xyXG59XHJcblxyXG4uY29ubmVjdC1idXR0b246aG92ZXIge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNjYzRlMDI7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG4gIGJvcmRlci1jb2xvcjogI2NjNGUwMjtcclxufVxyXG5cclxuLmNvbm5lY3QtYnV0dG9uOmhvdmVyIC5idXR0b24taWNvbiB7XHJcbiAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjY3NSk7XHJcbn1cclxuXHJcbi5jb25uZWN0LWJ1dHRvbjpmb2N1cyB7XHJcbiAgb3V0bGluZTogbm9uZTtcclxufVxyXG5cclxuLmNvbm5lY3QtYnV0dG9uOmRpc2FibGVkIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjY2NjO1xyXG4gIGN1cnNvcjogbm90LWFsbG93ZWQ7XHJcbn1cclxuXHJcbi5wcm92aWRlci1idXR0b24ge1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgcGFkZGluZzogMC41cmVtO1xyXG4gIGJvcmRlcjogMXB4IHNvbGlkICNkZGQ7XHJcbiAgYm9yZGVyLXJhZGl1czogMC41cmVtO1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZWZlZmU7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XHJcbiAgZ2FwOiAwLjVyZW07XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjE1cztcclxuICBmb250LWZhbWlseTogaW5oZXJpdDtcclxufVxyXG5cclxuLnByb3ZpZGVyLWJ1dHRvbjpmb2N1cyB7XHJcbiAgb3V0bGluZTogMXB4IHNvbGlkICM0M2I3YzQ7XHJcbn1cclxuXHJcbi5wcm92aWRlci1idXR0b246aG92ZXIge1xyXG4gIGJvcmRlci1jb2xvcjogIzQzYjdjNDtcclxufVxyXG5cclxuLnByb3ZpZGVyLWJ1dHRvbjpob3Zlcjpub3QoOmRpc2FibGVkKSB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2RkZDtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbn1cclxuXHJcbi5wcm92aWRlci1idXR0b24gaW1nIHtcclxuICB3aWR0aDogMnJlbTtcclxuICBoZWlnaHQ6IDJyZW07XHJcbn1cclxuXHJcbi5wcm92aWRlci1idXR0b24gLnByb3ZpZGVyLWljb24ge1xyXG4gIGJvcmRlci1yYWRpdXM6IDAuMnJlbTtcclxufVxyXG5cclxuLnByb3ZpZGVyLWJ1dHRvbiBzcGFuIHtcclxuICBtYXJnaW4tbGVmdDogMC41cmVtO1xyXG4gIGxpbmUtaGVpZ2h0OiAxcmVtO1xyXG59XHJcblxyXG4ucHJvdmlkZXItYnV0dG9uIHNwYW4ucHJvdmlkZXItbmFtZSB7XHJcbiAgY29sb3I6ICMzMzM7XHJcbiAgZm9udC1zaXplOiAwLjg3NXJlbTtcclxufVxyXG5cclxuLnByb3ZpZGVyLWJ1dHRvbiBzcGFuLnByb3ZpZGVyLWxhYmVsIHtcclxuICBjb2xvcjogIzc3NztcclxuICBmb250LXNpemU6IDAuN3JlbTtcclxufVxyXG5cclxuLyogXCJkZWZhdWx0XCIgdmFyaWFudCAqL1xyXG4ubGluay1idXR0b24tZGVmYXVsdCB7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XHJcbiAgYm9yZGVyOiBub25lO1xyXG4gIHdpZHRoOiA3cmVtO1xyXG4gIGhlaWdodDogMi42cmVtO1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZjZmMDA7XHJcbiAgYm9yZGVyLXJhZGl1czogMC43NXJlbTtcclxuICBib3gtc2hhZG93OiBoc2xhKDAsIDAlLCAxMDAlLCAwLjE1KSAwIDJweCAwIGluc2V0LFxyXG4gICAgcmdiYSgwLCAwLCAwLCAwLjA1KSAwIC0ycHggNHB4IGluc2V0LCByZ2JhKDQ2LCA1NCwgODAsIDAuMDc1KSAwIDFweCAxcHg7XHJcbiAgY3Vyc29yOiBwb2ludGVyO1xyXG59XHJcblxyXG4ubGluay1idXR0b24tZGVmYXVsdDpkaXNhYmxlZCB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogI2I4YjhiODtcclxuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xyXG59XHJcblxyXG4ubGluay1idXR0b24tZGVmYXVsdDo6YWZ0ZXIge1xyXG4gIGNvbnRlbnQ6IFwiXCI7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHRvcDogMDtcclxuICBsZWZ0OiAwO1xyXG4gIHJpZ2h0OiAwO1xyXG4gIGJvdHRvbTogMDtcclxuICBib3JkZXItcmFkaXVzOiAwLjc1cmVtO1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMCk7XHJcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjE1cztcclxufVxyXG5cclxuLmxpbmstYnV0dG9uLWRlZmF1bHQ6ZGlzYWJsZWQ6OmFmdGVyIHtcclxuICBjb250ZW50OiBcIk5vdCBjb25uZWN0ZWRcIjtcclxuICB2aXNpYmlsaXR5OiBoaWRkZW47XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHRvcDogLTIuN3JlbTtcclxuICBsZWZ0OiAwO1xyXG4gIHJpZ2h0OiAwO1xyXG4gIGhlaWdodDogMnJlbTtcclxuICBib3JkZXItcmFkaXVzOiAwLjM1cmVtO1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4zNSk7XHJcbiAgY29sb3I6IHdoaXRlO1xyXG4gIGRpc3BsYXk6IGdyaWQ7XHJcbiAgcGxhY2UtaXRlbXM6IGNlbnRlcjtcclxuICBmb250LXNpemU6IDAuNzVyZW07XHJcbiAgcGFkZGluZzogMC4yNXJlbTtcclxuICBvcGFjaXR5OiAwO1xyXG4gIHRyYW5zaXRpb246IGFsbCAwLjI1cztcclxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTAuNXJlbSk7XHJcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XHJcbn1cclxuXHJcbi5saW5rLWJ1dHRvbi1kZWZhdWx0OmRpc2FibGVkOmhvdmVyOjphZnRlciB7XHJcbiAgdmlzaWJpbGl0eTogdmlzaWJsZTtcclxuICBvcGFjaXR5OiAxO1xyXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcclxufVxyXG5cclxuLmxpbmstYnV0dG9uLWRlZmF1bHQ6bm90KDpkaXNhYmxlZCk6aG92ZXI6OmFmdGVyIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMSk7XHJcbn1cclxuXHJcbi5saW5rLWJ1dHRvbi1kZWZhdWx0Om5vdCg6ZGlzYWJsZWQpLnR3aXR0ZXIge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICMxZGExZjI7XHJcbn1cclxuXHJcbi5saW5rLWJ1dHRvbi1kZWZhdWx0Om5vdCg6ZGlzYWJsZWQpLnNwb3RpZnkge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICMxZGI5NTQ7XHJcbn1cclxuXHJcbi5saW5rLWJ1dHRvbi1kZWZhdWx0Om5vdCg6ZGlzYWJsZWQpLmRpc2NvcmQge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICM3Mjg5ZGE7XHJcbn1cclxuXHJcbi5saW5rLWJ1dHRvbi1kZWZhdWx0Om5vdCg6ZGlzYWJsZWQpLnRpa3RvayB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDtcclxufVxyXG5cclxuLmxpbmstYnV0dG9uLWRlZmF1bHQ6bm90KDpkaXNhYmxlZCkudGVsZWdyYW0ge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDg4Y2M7XHJcbn1cclxuXHJcbi5saW5rLWJ1dHRvbi1kZWZhdWx0IC5idXR0b24tY29udGFpbmVyIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiByb3c7XHJcbiAgZ2FwOiAwLjVyZW07XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBwYWRkaW5nOiAwLjVyZW07XHJcbn1cclxuXHJcbi5idXR0b24tY29udGFpbmVyIC5zb2NpYWwtaWNvbiB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICB3aWR0aDogMS41cmVtO1xyXG4gIGhlaWdodDogMS41cmVtO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgY29sb3I6IHdoaXRlO1xyXG59XHJcblxyXG4uYnV0dG9uLWNvbnRhaW5lciAuc29jaWFsLWljb24gc3ZnIHtcclxuICB3aWR0aDogMS41cmVtO1xyXG4gIGhlaWdodDogMS41cmVtO1xyXG4gIGZpbGw6IHdoaXRlICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5idXR0b24tY29udGFpbmVyIC5zb2NpYWwtaWNvbiBzdmcgcGF0aCB7XHJcbiAgZmlsbDogd2hpdGUgIWltcG9ydGFudDtcclxufVxyXG5cclxuLmJ1dHRvbi1jb250YWluZXIgLmxpbmstaWNvbiB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICB3aWR0aDogMS4yNXJlbTtcclxuICBoZWlnaHQ6IDEuMjVyZW07XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxuICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjgpO1xyXG59XHJcblxyXG4uYnV0dG9uLWNvbnRhaW5lciAuY2FtcC1sb2dvIHtcclxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgd2lkdGg6IDEuNXJlbTtcclxuICBoZWlnaHQ6IDEuNXJlbTtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlO1xyXG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcclxuICBwYWRkaW5nOiAwLjE1cmVtO1xyXG59XHJcblxyXG4ubGluay1idXR0b24tZGVmYXVsdDpkaXNhYmxlZCAuYnV0dG9uLWNvbnRhaW5lciAuY2FtcC1sb2dvIHN2ZyBwYXRoIHtcclxuICBmaWxsOiAjYjhiOGI4ICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi8qIFwiaWNvblwiIHZhcmlhbnQgKi9cclxuLmxpbmstYnV0dG9uLWljb24ge1xyXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcclxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gIG1pbi13aWR0aDogM3JlbTtcclxuICBtaW4taGVpZ2h0OiAzcmVtO1xyXG4gIHdpZHRoOiAzcmVtO1xyXG4gIGhlaWdodDogM3JlbTtcclxuICBib3JkZXI6IG5vbmU7XHJcbiAgcGFkZGluZzogMHJlbTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmY2ZjAwO1xyXG4gIGJvcmRlci1yYWRpdXM6IDAuNzVyZW07XHJcbiAgYm94LXNoYWRvdzogaHNsYSgwLCAwJSwgMTAwJSwgMC4xNSkgMCAycHggMCBpbnNldCxcclxuICAgIHJnYmEoMCwgMCwgMCwgMC4wNSkgMCAtMnB4IDRweCBpbnNldCwgcmdiYSg0NiwgNTQsIDgwLCAwLjA3NSkgMCAxcHggMXB4O1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5cclxuLmxpbmstYnV0dG9uLWljb246ZGlzYWJsZWQge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICNiOGI4Yjg7XHJcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcclxufVxyXG5cclxuLmxpbmstYnV0dG9uLWljb246ZGlzYWJsZWQ6OmFmdGVyIHtcclxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xyXG4gIGNvbnRlbnQ6IFwiTm90IGNvbm5lY3RlZFwiO1xyXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcclxuICB0b3A6IC0yLjdyZW07XHJcbiAgbGVmdDogLTFyZW07XHJcbiAgcmlnaHQ6IC0xcmVtO1xyXG4gIGhlaWdodDogZml0LWNvbnRlbnQ7XHJcbiAgYm9yZGVyLXJhZGl1czogMC4zNXJlbTtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMzUpO1xyXG4gIGNvbG9yOiB3aGl0ZTtcclxuICBkaXNwbGF5OiBncmlkO1xyXG4gIHBsYWNlLWl0ZW1zOiBjZW50ZXI7XHJcbiAgZm9udC1zaXplOiAwLjc1cmVtO1xyXG4gIHBhZGRpbmc6IDAuMjVyZW07XHJcbiAgb3BhY2l0eTogMDtcclxuICB0cmFuc2l0aW9uOiBhbGwgMC4yNXM7XHJcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0wLjVyZW0pO1xyXG59XHJcblxyXG4ubGluay1idXR0b24taWNvbjpkaXNhYmxlZDpob3Zlcjo6YWZ0ZXIge1xyXG4gIG9wYWNpdHk6IDE7XHJcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDApO1xyXG59XHJcblxyXG4ubGluay1idXR0b24taWNvbjo6YWZ0ZXIge1xyXG4gIGNvbnRlbnQ6IFwiXCI7XHJcbiAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gIHRvcDogMDtcclxuICBsZWZ0OiAwO1xyXG4gIHJpZ2h0OiAwO1xyXG4gIGJvdHRvbTogMDtcclxuICBib3JkZXItcmFkaXVzOiAwLjc1cmVtO1xyXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMCk7XHJcbiAgdHJhbnNpdGlvbjogYmFja2dyb3VuZC1jb2xvciAwLjE1cztcclxufVxyXG5cclxuLmxpbmstYnV0dG9uLWljb246bm90KDpkaXNhYmxlZCk6aG92ZXI6OmFmdGVyIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuMSk7XHJcbn1cclxuXHJcbi5saW5rLWJ1dHRvbi1pY29uOm5vdCg6ZGlzYWJsZWQpLnR3aXR0ZXIge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICMxZGExZjI7XHJcbn1cclxuXHJcbi5saW5rLWJ1dHRvbi1pY29uOm5vdCg6ZGlzYWJsZWQpLnNwb3RpZnkge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICMxZGI5NTQ7XHJcbn1cclxuXHJcbi5saW5rLWJ1dHRvbi1pY29uOm5vdCg6ZGlzYWJsZWQpLmRpc2NvcmQge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICM3Mjg5ZGE7XHJcbn1cclxuXHJcbi5saW5rLWJ1dHRvbi1pY29uOm5vdCg6ZGlzYWJsZWQpLnRpa3RvayB7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDAwMDtcclxufVxyXG5cclxuLmxpbmstYnV0dG9uLWljb246bm90KDpkaXNhYmxlZCkudGVsZWdyYW0ge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDg4Y2M7XHJcbn1cclxuXHJcbi5saW5rLWJ1dHRvbi1pY29uIC5pY29uLWNvbnRhaW5lciB7XHJcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xyXG4gIGRpc3BsYXk6IGZsZXg7XHJcbiAgd2lkdGg6IDEwMCU7XHJcbiAgaGVpZ2h0OiAxMDAlO1xyXG4gIGZsZXg6IDE7XHJcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcclxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcclxufVxyXG5cclxuLmxpbmstYnV0dG9uLWljb24gLmljb24tY29udGFpbmVyID4gc3ZnIHtcclxuICB3aWR0aDogMS41cmVtO1xyXG4gIGhlaWdodDogMS41cmVtO1xyXG4gIGZpbGw6IHdoaXRlICFpbXBvcnRhbnQ7XHJcbn1cclxuXHJcbi5saW5rLWJ1dHRvbi1pY29uIC5pY29uLWNvbnRhaW5lciA+IHN2ZyBwYXRoIHtcclxuICBmaWxsOiB3aGl0ZSAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubGluay1idXR0b24taWNvbiAuY2FtcC1sb2dvIHtcclxuICBwb3NpdGlvbjogYWJzb2x1dGU7XHJcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIHdpZHRoOiAxLjVyZW07XHJcbiAgaGVpZ2h0OiAxLjVyZW07XHJcbiAgcmlnaHQ6IC0wLjVyZW07XHJcbiAgYm90dG9tOiAtMC41cmVtO1xyXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XHJcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XHJcbiAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGU7XHJcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xyXG59XHJcblxyXG4ubGluay1idXR0b24taWNvbiAuY2FtcC1sb2dvIHN2ZyB7XHJcbiAgd2lkdGg6IDEuMXJlbTtcclxuICBoZWlnaHQ6IDEuMXJlbTtcclxufVxyXG5cclxuLmxpbmstYnV0dG9uLWljb246ZGlzYWJsZWQgLmNhbXAtbG9nbyBzdmcgcGF0aCB7XHJcbiAgZmlsbDogI2I4YjhiOCAhaW1wb3J0YW50O1xyXG59XHJcblxyXG4ubm90LWxpbmtlZCBzdmcgcGF0aCB7XHJcbiAgZmlsbDogI2I4YjhiOCAhaW1wb3J0YW50O1xyXG59XHJcbiJdfQ== */";
var buttonStyles = {"connect-button":"buttons-module_connect-button__CJhUa","button-icon":"buttons-module_button-icon__JM4-2","provider-button":"buttons-module_provider-button__6JY7s","provider-icon":"buttons-module_provider-icon__MOhr8","provider-name":"buttons-module_provider-name__tHWO2","provider-label":"buttons-module_provider-label__CEGRr","link-button-default":"buttons-module_link-button-default__EcKUT","twitter":"buttons-module_twitter__9sRaz","spotify":"buttons-module_spotify__-fiKQ","discord":"buttons-module_discord__I-YjZ","tiktok":"buttons-module_tiktok__a80-0","telegram":"buttons-module_telegram__ExOTS","button-container":"buttons-module_button-container__-oPqd","social-icon":"buttons-module_social-icon__DPdPe","link-icon":"buttons-module_link-icon__8V8FP","camp-logo":"buttons-module_camp-logo__slNl0","link-button-icon":"buttons-module_link-button-icon__llX8m","icon-container":"buttons-module_icon-container__Q5bI1","not-linked":"buttons-module_not-linked__ua4va"};
styleInject(css_248z);

/**
 * The injected CampButton component.
 * @param { { onClick: function, authenticated: boolean } } props The props.
 * @returns { JSX.Element } The CampButton component.
 */
const CampButton = ({ onClick, authenticated, disabled, }) => {
    return (React.createElement("button", { className: buttonStyles["connect-button"], onClick: onClick, disabled: disabled },
        React.createElement("div", { className: buttonStyles["button-icon"] },
            React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 571.95 611.12", height: "1rem", width: "1rem" },
                React.createElement("path", { d: "m563.25 431.49-66.17-51.46c-11.11-8.64-27.28-5.06-33.82 7.4-16.24 30.9-41.69 56.36-70.85 73.73l-69.35-69.35c-3.73-3.73-8.79-5.83-14.07-5.83s-10.34 2.1-14.07 5.83l-73.78 73.78c-57.37-30.39-96.55-90.71-96.55-160.03 0-99.79 81.19-180.98 180.98-180.98 60.35 0 118.17 26.28 156.39 89.44 6.85 11.32 21.92 14.33 32.59 6.51l64.21-47.06c9.53-6.98 12.06-20.15 5.78-30.16C508.83 54.41 411.43 0 305.56 0 137.07 0 0 137.07 0 305.56s137.07 305.56 305.56 305.56c57.6 0 113.72-16.13 162.31-46.63A306.573 306.573 0 0 0 568.8 460.8c5.78-9.78 3.42-22.34-5.55-29.31Zm-301.42 49.69 47.15-47.15 44.69 44.69c-15.92 5.1-32.2 7.83-48.1 7.83-15.08 0-29.72-1.87-43.74-5.36Zm42.36-222.47c-.07 1.49-.08 21.29 49.54 55.11 37.02 25.24 19.68 75.52 12.1 92.05a147.07 147.07 0 0 0-20.12-38.91c-12.73-17.59-26.87-28.9-36.74-35.59-10.38 6.36-27.41 18.74-41.07 40.02-8.27 12.89-12.82 25.16-15.42 34.48l-.03-.05c-15.1-40.6-9.75-60.88-1.95-71.9 6.12-8.65 17.24-20.6 17.24-20.6 9.71-9.66 19.96-19.06 29.82-38.17 6.06-11.75 6.59-15.84 6.63-16.45Z", fill: "#000", strokeWidth: "0" }),
                React.createElement("path", { d: "M267.74 313.33s-11.11 11.95-17.24 20.6c-7.8 11.02-13.14 31.3 1.95 71.9-86.02-75.3 2.56-152.15.79-146.3-6.58 21.75 14.49 53.8 14.49 53.8Zm20.98-23.66c3.01-4.27 5.97-9.06 8.8-14.55 6.62-12.83 6.64-16.54 6.64-16.54s-2.09 20.02 49.53 55.21c37.02 25.24 19.68 75.52 12.1 92.05 0 0 43.69-27.86 37.49-74.92-7.45-56.61-38.08-51.5-60.84-93.43-21.23-39.11 15.03-70.44 15.03-70.44s-48.54-2.61-70.76 48.42c-23.42 53.77 2 74.21 2 74.21Z", fill: "#ff6d01", strokeWidth: "0" }))),
        authenticated ? "My Origin" : "Connect"));
};
/**
 * The GoToOriginDashboard component. Handles the action of going to the Origin Dashboard.
 * @returns { JSX.Element } The GoToOriginDashboard component.
 */
const GoToOriginDashboard = () => {
    const { auth } = useContext(CampContext);
    const { addToast: toast } = useToast();
    const handleClick = () => {
        if (!auth) {
            toast("Auth instance is not available.", "error", 5000);
            return;
        }
        // window.open(auth.getOriginDashboardLink(), "_blank");
    };
    return (React.createElement("button", { className: styles["origin-dashboard-button"], onClick: handleClick },
        "Origin Dashboard ",
        React.createElement(LinkIcon, { w: "0.875rem" })));
};
/**
 * The TabButton component.
 * @param { { label: string, isActive: boolean, onClick: function } } props The props.
 * @returns { JSX.Element } The TabButton component.
 */
const TabButton = ({ label, isActive, onClick, }) => {
    return (React.createElement("button", { className: `${styles["tab-button"]} ${isActive ? styles["active-tab"] : ""}`, onClick: onClick }, label));
};
const StandaloneCampButton = () => {
    const modalContext = useContext(ModalContext);
    const { openModal } = useModal();
    const { authenticated } = useAuthState();
    if (!modalContext) {
        console.error("CampButton must be used within a ModalProvider");
        return null;
    }
    const { isButtonDisabled } = modalContext;
    return (React.createElement(CampButton, { onClick: openModal, authenticated: authenticated, disabled: isButtonDisabled }));
};
/**
 * The ProviderButton component.
 * @param { { provider: { provider: string, info: { name: string, icon: string } }, handleConnect: function, loading: boolean, label: string } } props The props.
 * @returns { JSX.Element } The ProviderButton component.
 */
const ProviderButton = ({ provider, handleConnect, loading, label, }) => {
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const handleClick = () => {
        handleConnect(provider);
        setIsButtonLoading(true);
    };
    useEffect(() => {
        if (!loading) {
            setIsButtonLoading(false);
        }
    }, [loading]);
    return (React.createElement("button", { className: buttonStyles["provider-button"], onClick: handleClick, disabled: loading },
        React.createElement("img", { src: provider.info.icon ||
                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='%23777777' d='M21 7.28V5c0-1.1-.9-2-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-2.28A2 2 0 0 0 22 15V9a2 2 0 0 0-1-1.72M20 9v6h-7V9zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2z'/%3E%3Ccircle cx='16' cy='12' r='1.5' fill='%23777777'/%3E%3C/svg%3E", className: buttonStyles["provider-icon"], alt: provider.info.name }),
        React.createElement("div", { style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
            } },
            React.createElement("span", { className: buttonStyles["provider-name"] }, provider.info.name),
            label && (React.createElement("span", { className: buttonStyles["provider-label"] },
                "(",
                label,
                ")"))),
        isButtonLoading && React.createElement("div", { className: styles.spinner })));
};
const ConnectorButton = ({ name, link, unlink, icon, isConnected, refetch, }) => {
    const [isUnlinking, setIsUnlinking] = useState(false);
    const handleClick = () => {
        link();
    };
    const handleDisconnect = () => __awaiter(void 0, void 0, void 0, function* () {
        setIsUnlinking(true);
        try {
            yield unlink();
            yield refetch();
            setIsUnlinking(false);
        }
        catch (error) {
            setIsUnlinking(false);
            console.error(error);
        }
    });
    return (React.createElement("div", { className: styles["connector-container"] }, isConnected ? (React.createElement("div", { className: styles["connector-connected"], "data-connected": isConnected },
        icon,
        React.createElement("span", null, name),
        isUnlinking ? (React.createElement("div", { className: styles.loader, style: {
                alignSelf: "flex-end",
                position: "absolute",
                right: "0.375rem",
            } })) : (React.createElement("button", { className: styles["unlink-connector-button"], onClick: handleDisconnect, disabled: isUnlinking },
            React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", stroke: "currentColor" },
                React.createElement("path", { fill: "none", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M17 22v-2m-8-5l6-6m-4-3l.463-.536a5 5 0 0 1 7.071 7.072L18 13m-5 5l-.397.534a5.07 5.07 0 0 1-7.127 0a4.97 4.97 0 0 1 0-7.071L6 11m14 6h2M2 7h2m3-5v2" })),
            "Unlink")))) : (React.createElement("button", { onClick: handleClick, className: styles["connector-button"], disabled: isConnected },
        icon,
        React.createElement("span", null, name)))));
};
/**
 * The LinkButton component.
 * A button that will open the modal to link or unlink a social account.
 * @param { { variant: ("default"|"icon"), social: ("twitter"|"spotify"|"discord"), theme: ("default"|"camp") } } props The props.
 * @returns { JSX.Element } The LinkButton component.
 */
const LinkButton = ({ variant = "default", social, theme = "default", }) => {
    const { handleOpen } = useLinkModal();
    if (["default", "icon"].indexOf(variant) === -1) {
        throw new Error("Invalid variant, must be 'default' or 'icon'");
    }
    if (constants.AVAILABLE_SOCIALS.indexOf(social) === -1) {
        console.error(`Invalid LinkButton social, must be one of ${constants.AVAILABLE_SOCIALS.join(", ")}`);
        return null;
    }
    if (["default", "camp"].indexOf(theme) === -1) {
        throw new Error("Invalid theme, must be 'default' or 'camp'");
    }
    const { socials } = useSocials();
    const { authenticated } = useAuthState();
    const isLinked = socials && socials[social];
    const handleClick = () => {
        handleOpen(social);
    };
    const Icon = getIconBySocial(social);
    return (React.createElement("button", { disabled: !authenticated, className: `${buttonStyles[`link-button-${variant}`]} 
        ${theme === "default" ? buttonStyles[social] : ""}
      `, onClick: handleClick }, variant === "icon" ? (React.createElement("div", { className: buttonStyles["icon-container"] },
        React.createElement(Icon, null),
        React.createElement("div", { className: `${buttonStyles["camp-logo"]} ${!isLinked ? buttonStyles["not-linked"] : ""}` },
            React.createElement(CampIcon, null)))) : (React.createElement("div", { className: buttonStyles["button-container"] },
        React.createElement("div", { className: `${buttonStyles["camp-logo"]} ${!isLinked ? buttonStyles["not-linked"] : ""}` },
            React.createElement(CampIcon, null)),
        React.createElement("div", { className: buttonStyles["link-icon"] },
            React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: "1.5", stroke: "currentColor" },
                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" }))),
        React.createElement("div", { className: buttonStyles["social-icon"] },
            React.createElement(Icon, null))))));
};

/**
 * The Auth modal component.
 * @param { { setIsVisible: function, wcProvider: object, loading: boolean, onlyWagmi: boolean, defaultProvider: object } } props The props.
 * @returns { JSX.Element } The Auth modal component.
 */
const AuthModal = ({ setIsVisible, wcProvider, loading, onlyWagmi, defaultProvider, }) => {
    const { connect } = useConnect();
    const { setProvider } = useProvider();
    const { auth, wagmiAvailable } = useContext(CampContext);
    const [customProvider, setCustomProvider] = useState(null);
    const providers = useProviders();
    const [customConnector, setCustomConnector] = useState(null);
    const [customAccount, setCustomAccount] = useState(null);
    let wagmiConnectorClient;
    let wagmiAccount;
    if (wagmiAvailable) {
        wagmiConnectorClient = useConnectorClient();
        wagmiAccount = useAccount();
    }
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const handleWalletConnect = (_a) => __awaiter(void 0, [_a], void 0, function* ({ provider }) {
        auth.setLoading(true);
        try {
            if (provider.connected)
                yield provider.disconnect();
            yield provider.connect();
        }
        catch (error) {
            auth.setLoading(false);
        }
    });
    useEffect(() => {
        if (wagmiAvailable && !defaultProvider) {
            setCustomConnector(wagmiConnectorClient);
            setCustomAccount(wagmiAccount);
        }
    }, [
        wagmiAvailable,
        defaultProvider,
        wagmiAccount,
        wagmiConnectorClient === null || wagmiConnectorClient === void 0 ? void 0 : wagmiConnectorClient.data,
    ]);
    useEffect(() => {
        if (defaultProvider && defaultProvider.provider && defaultProvider.info) {
            let addr = defaultProvider.provider.address;
            const acc = {
                connector: Object.assign(Object.assign({}, defaultProvider.info), { icon: defaultProvider.info.icon ||
                        getIconByConnectorName(defaultProvider.info.name) }),
                address: addr,
            };
            if (!addr) {
                defaultProvider.provider
                    .request({
                    method: "eth_requestAccounts",
                })
                    .then((accounts) => {
                    setCustomAccount(Object.assign(Object.assign({}, acc), { address: accounts[0] }));
                });
            }
            else {
                setCustomAccount(acc);
            }
            setCustomProvider(defaultProvider.provider);
        }
    }, [defaultProvider]);
    useEffect(() => {
        if (wagmiAvailable && customConnector) {
            const provider = customConnector.data;
            if (provider) {
                setCustomProvider(provider);
            }
        }
    }, [customConnector, customConnector === null || customConnector === void 0 ? void 0 : customConnector.data, wagmiAvailable, customProvider]);
    useEffect(() => {
        const doConnect = () => __awaiter(void 0, void 0, void 0, function* () {
            handleConnect({
                provider: wcProvider,
                info: { name: "WalletConnect" },
            });
        });
        if (wcProvider) {
            wcProvider.on("connect", doConnect);
        }
        return () => {
            if (wcProvider) {
                wcProvider.off("connect", doConnect);
            }
        };
    }, [wcProvider]);
    const handleConnect = (provider) => {
        var _a;
        if (provider) {
            setProvider(Object.assign(Object.assign({}, provider), { address: customAccount === null || customAccount === void 0 ? void 0 : customAccount.address }));
            if (customAccount === null || customAccount === void 0 ? void 0 : customAccount.address) {
                auth.setWalletAddress(customAccount.address);
            }
        }
        // necessary for appkit, as it doesn't seem to support the "eth_requestAccounts" method
        if ((customAccount === null || customAccount === void 0 ? void 0 : customAccount.address) &&
            (customProvider === null || customProvider === void 0 ? void 0 : customProvider.uid) &&
            ((_a = provider === null || provider === void 0 ? void 0 : provider.provider) === null || _a === void 0 ? void 0 : _a.uid) === (customProvider === null || customProvider === void 0 ? void 0 : customProvider.uid)) {
            auth.setWalletAddress(customAccount === null || customAccount === void 0 ? void 0 : customAccount.address);
        }
        connect();
    };
    return (React.createElement("div", { className: styles.container },
        React.createElement("div", { className: styles["close-button"], onClick: () => setIsVisible(false) },
            React.createElement(CloseIcon, null)),
        React.createElement("div", { className: styles.header },
            React.createElement("div", { className: styles["modal-icon"] },
                React.createElement(CampIcon, null)),
            React.createElement("span", null, "Connect with Camp")),
        React.createElement("div", { className: `${(customAccount === null || customAccount === void 0 ? void 0 : customAccount.connector) ? styles["big"] : ""} ${styles["provider-list"]}` },
            (customAccount === null || customAccount === void 0 ? void 0 : customAccount.connector) && (React.createElement(React.Fragment, null,
                React.createElement(ProviderButton, { provider: {
                        provider: customProvider || window.ethereum,
                        info: {
                            name: customAccount.connector.name,
                            icon: customAccount.connector.icon ||
                                getIconByConnectorName(customAccount.connector.name),
                        },
                    }, label: formatAddress(customAccount.address), handleConnect: handleConnect, loading: loading }),
                (providers.length || wcProvider || window.ethereum) &&
                    !onlyWagmi &&
                    !(defaultProvider === null || defaultProvider === void 0 ? void 0 : defaultProvider.exclusive) && (React.createElement("div", { className: styles["divider"] })))),
            !onlyWagmi &&
                !(defaultProvider === null || defaultProvider === void 0 ? void 0 : defaultProvider.exclusive) &&
                providers.map((provider) => (React.createElement(ProviderButton, { provider: provider, handleConnect: handleConnect, loading: loading, key: provider.info.uuid }))),
            !onlyWagmi && !(defaultProvider === null || defaultProvider === void 0 ? void 0 : defaultProvider.exclusive) && wcProvider && (React.createElement(ProviderButton, { provider: {
                    provider: wcProvider,
                    info: {
                        name: "WalletConnect",
                        icon: "data:image/svg+xml,%3Csvg fill='%233B99FC' role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.913 7.519c3.915-3.831 10.26-3.831 14.174 0l.471.461a.483.483 0 0 1 0 .694l-1.611 1.577a.252.252 0 0 1-.354 0l-.649-.634c-2.73-2.673-7.157-2.673-9.887 0l-.694.68a.255.255 0 0 1-.355 0L4.397 8.719a.482.482 0 0 1 0-.693l.516-.507Zm17.506 3.263 1.434 1.404a.483.483 0 0 1 0 .694l-6.466 6.331a.508.508 0 0 1-.709 0l-4.588-4.493a.126.126 0 0 0-.178 0l-4.589 4.493a.508.508 0 0 1-.709 0L.147 12.88a.483.483 0 0 1 0-.694l1.434-1.404a.508.508 0 0 1 .709 0l4.589 4.493c.05.048.129.048.178 0l4.589-4.493a.508.508 0 0 1 .709 0l4.589 4.493c.05.048.128.048.178 0l4.589-4.493a.507.507 0 0 1 .708 0Z'/%3E%3C/svg%3E",
                    },
                }, handleConnect: handleWalletConnect, loading: loading })),
            !onlyWagmi && !(defaultProvider === null || defaultProvider === void 0 ? void 0 : defaultProvider.exclusive) && window.ethereum && (React.createElement(ProviderButton, { provider: {
                    provider: window.ethereum,
                    info: {
                        name: "Browser Wallet",
                    },
                }, label: "window.ethereum", handleConnect: handleConnect, loading: loading }))),
        React.createElement("a", { href: "https://campnetwork.xyz", className: styles["footer-text"], target: "_blank", rel: "noopener noreferrer" }, "Powered by Camp Network")));
};
/**
 * The CampModal component.
 * @param { { injectButton?: boolean, wcProjectId?: string, onlyWagmi?: boolean, defaultProvider?: object } } props The props.
 * @returns { JSX.Element } The CampModal component.
 */
const CampModal = ({ injectButton = true, wcProjectId, onlyWagmi = false, defaultProvider, }) => {
    // const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const { authenticated, loading } = useAuthState();
    const { isVisible, setIsVisible, isButtonDisabled, setIsButtonDisabled } = useContext(ModalContext);
    const { isLinkingVisible } = useContext(ModalContext);
    const { provider } = useProvider();
    const providers = useProviders();
    const { wagmiAvailable } = useContext(CampContext);
    let customAccount;
    if (wagmiAvailable) {
        customAccount = useAccount();
    }
    const walletConnectProvider = wcProjectId
        ? useWalletConnectProvider(wcProjectId)
        : null;
    const handleModalButton = () => {
        setIsVisible(true);
    };
    useEffect(() => {
        if (authenticated) {
            if (isVisible) {
                setIsVisible(false);
            }
        }
    }, [authenticated]);
    // Cases where the button should be disabled
    useEffect(() => {
        const noProvider = !provider.provider;
        const noWagmiOrAccount = !wagmiAvailable || !(customAccount === null || customAccount === void 0 ? void 0 : customAccount.isConnected);
        const noWalletConnectProvider = !walletConnectProvider;
        const noProviders = !providers.length;
        const onlyWagmiNoAccount = onlyWagmi && !(customAccount === null || customAccount === void 0 ? void 0 : customAccount.isConnected);
        const noDefaultProvider = !defaultProvider || !defaultProvider.provider;
        const defaultProviderExclusive = defaultProvider === null || defaultProvider === void 0 ? void 0 : defaultProvider.exclusive;
        const noAvailableProviders = noProvider &&
            noWagmiOrAccount &&
            noWalletConnectProvider &&
            noProviders &&
            noDefaultProvider;
        const shouldDisableButton = (noAvailableProviders ||
            onlyWagmiNoAccount ||
            (noDefaultProvider && defaultProviderExclusive)) &&
            !authenticated;
        setIsButtonDisabled(shouldDisableButton);
    }, [
        provider,
        wagmiAvailable,
        customAccount,
        walletConnectProvider,
        providers,
        authenticated,
        defaultProvider,
    ]);
    return (React.createElement(ClientOnly, null,
        React.createElement("div", null,
            injectButton && (React.createElement(CampButton, { disabled: isButtonDisabled, onClick: handleModalButton, authenticated: authenticated })),
            React.createElement(ReactPortal, { wrapperId: "camp-modal-wrapper" },
                isLinkingVisible && React.createElement(LinkingModal, null),
                isVisible && (React.createElement("div", { className: styles.modal, onClick: (e) => {
                        if (e.target === e.currentTarget) {
                            setIsVisible(false);
                        }
                    } }, authenticated ? (React.createElement(MyCampModal, { wcProvider: walletConnectProvider })) : (React.createElement(AuthModal, { setIsVisible: setIsVisible, wcProvider: walletConnectProvider, loading: loading, onlyWagmi: onlyWagmi, defaultProvider: defaultProvider }))))))));
};
/**
 * The TikTokFlow component. Handles linking and unlinking of TikTok accounts.
 * @returns { JSX.Element } The TikTokFlow component.
 */
const TikTokFlow = () => {
    const { setIsLinkingVisible, currentlyLinking } = useContext(ModalContext);
    const { socials, refetch, isLoading: isSocialsLoading } = useSocials();
    const { auth } = useContext(CampContext);
    const [IsLoading, setIsLoading] = useState(false);
    const [handleInput, setHandleInput] = useState("");
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const resetState = () => {
        setIsLoading(false);
        setIsLinkingVisible(false);
        setHandleInput("");
    };
    const handleLink = () => __awaiter(void 0, void 0, void 0, function* () {
        if (isSocialsLoading)
            return;
        setIsLoading(true);
        if (socials[currentlyLinking]) {
            try {
                yield auth.unlinkTikTok();
            }
            catch (error) {
                resetState();
                console.error(error);
                return;
            }
        }
        else {
            if (!handleInput)
                return;
            try {
                yield auth.linkTikTok(handleInput);
            }
            catch (error) {
                resetState();
                console.error(error);
                return;
            }
        }
        refetch();
        resetState();
    });
    return (React.createElement("div", null,
        React.createElement("div", { className: styles["linking-text"] }, currentlyLinking && socials[currentlyLinking] ? (React.createElement("div", null,
            "Your ",
            capitalize(currentlyLinking),
            " account is currently linked.")) : (React.createElement("div", null,
            React.createElement("b", null, window.location.host),
            " is requesting to link your",
            " ",
            capitalize(currentlyLinking),
            " account.",
            React.createElement("div", null,
                React.createElement("input", { value: handleInput, onChange: (e) => setHandleInput(e.target.value), type: "text", placeholder: "Enter your TikTok username", className: styles["tiktok-input"] }))))),
        React.createElement("button", { className: styles["linking-button"], onClick: handleLink, disabled: IsLoading }, !IsLoading ? (currentlyLinking && socials[currentlyLinking] ? ("Unlink") : ("Link")) : (React.createElement("div", { className: styles.spinner })))));
};
/**
 * The OTPInput component. Handles OTP input with customizable number of inputs.
 * @param { { numInputs: number, onChange: function } } props The props.
 * @returns { JSX.Element } The OTPInput component.
 */
const OTPInput = ({ numInputs, onChange }) => {
    const [otp, setOtp] = useState(Array(numInputs).fill(""));
    const inputRefs = useRef([]);
    const handleChange = (value, index) => {
        if (!/^\d*$/.test(value))
            return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        onChange(newOtp.join(""));
        if (value && index < numInputs - 1) {
            inputRefs.current[index + 1].focus();
        }
    };
    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };
    const handleFocus = (e) => e.target.select();
    return (React.createElement("div", { className: styles["otp-input-container"] }, otp.map((_, index) => (React.createElement("input", { key: index, ref: (el) => {
            inputRefs.current[index] = el;
        }, type: "text", maxLength: 1, value: otp[index], onChange: (e) => handleChange(e.target.value, index), onKeyDown: (e) => handleKeyDown(e, index), onFocus: handleFocus, className: styles["otp-input"] })))));
};
/**
 * The TelegramFlow component. Handles linking and unlinking of Telegram accounts.
 * @returns { JSX.Element } The TelegramFlow component.
 */
const TelegramFlow = () => {
    const { setIsLinkingVisible, currentlyLinking } = useContext(ModalContext);
    const { socials, refetch, isLoading: isSocialsLoading } = useSocials();
    const { auth } = useContext(CampContext);
    const [IsLoading, setIsLoading] = useState(false);
    const [phoneInput, setPhoneInput] = useState("");
    const [otpInput, setOtpInput] = useState("");
    const [phoneCodeHash, setPhoneCodeHash] = useState("");
    const [isOTPSent, setIsOTPSent] = useState(false);
    const [isPhoneValid, setIsPhoneValid] = useState(true);
    const { addToast: toast } = useToast();
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const resetState = () => {
        setIsLoading(false);
        setPhoneInput("");
        setOtpInput("");
    };
    const handlePhoneInput = (e) => {
        setPhoneInput(e.target.value);
        setIsPhoneValid(verifyPhoneNumber(e.target.value) || !e.target.value);
    };
    const verifyPhoneNumber = (phone) => {
        const phoneRegex = /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;
        return phoneRegex.test(phone.replace(/\s/g, "").replace(/[-()]/g, ""));
    };
    const handleAction = () => __awaiter(void 0, void 0, void 0, function* () {
        if (isSocialsLoading)
            return;
        if (isOTPSent) {
            if (!otpInput)
                return;
            setIsLoading(true);
            try {
                yield auth.linkTelegram(phoneInput, otpInput, phoneCodeHash);
                refetch();
                resetState();
                setIsLinkingVisible(false);
            }
            catch (error) {
                resetState();
                console.error(error);
                return;
            }
        }
        else {
            if (!verifyPhoneNumber(phoneInput)) {
                toast("Invalid phone number, it should be in the format +1234567890", "warning", 5000);
                return;
            }
            setIsLoading(true);
            try {
                const res = yield auth.sendTelegramOTP(phoneInput);
                setIsOTPSent(true);
                setIsLoading(false);
                setPhoneCodeHash(res.phone_code_hash);
            }
            catch (error) {
                resetState();
                console.error(error);
                return;
            }
        }
    });
    return (React.createElement("div", null,
        React.createElement("div", { className: styles["linking-text"] }, currentlyLinking && socials[currentlyLinking] ? (React.createElement("div", null,
            "Your ",
            capitalize(currentlyLinking),
            " account is currently linked.")) : (React.createElement("div", null, isOTPSent ? (React.createElement("div", null,
            React.createElement("span", null, "Enter the OTP sent to your phone number."),
            React.createElement("div", null,
                React.createElement(OTPInput, { numInputs: 5, onChange: setOtpInput })))) : (React.createElement("div", null,
            React.createElement("b", null, window.location.host),
            " is requesting to link your",
            " ",
            capitalize(currentlyLinking),
            " account. ",
            React.createElement("br", null),
            React.createElement("span", null, "This will only work if you have 2FA disabled on your Telegram account."),
            React.createElement("div", null,
                React.createElement("input", { value: phoneInput, onChange: handlePhoneInput, type: "tel", placeholder: "Enter your phone number", className: `${styles["tiktok-input"]} ${!isPhoneValid ? styles["invalid"] : ""}` }))))))),
        React.createElement("button", { className: styles["linking-button"], onClick: handleAction, disabled: IsLoading ||
                (!isPhoneValid && !isOTPSent) ||
                (!phoneInput && !isOTPSent) ||
                (isOTPSent && otpInput.length < 5) }, !IsLoading ? (currentlyLinking && socials[currentlyLinking] ? ("Unlink") : isOTPSent ? ("Link") : ("Send OTP")) : (React.createElement("div", { className: styles.spinner })))));
};
/**
 * The BasicFlow component. Handles linking and unlinking of socials through redirecting to the appropriate OAuth flow.
 * @returns { JSX.Element } The BasicFlow component.
 */
const BasicFlow = () => {
    const { setIsLinkingVisible, currentlyLinking } = useContext(ModalContext);
    const { socials, refetch, isLoading: isSocialsLoading } = useSocials();
    const { auth } = useContext(CampContext);
    const [isUnlinking, setIsUnlinking] = useState(false);
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const handleLink = () => __awaiter(void 0, void 0, void 0, function* () {
        console.log(isSocialsLoading, currentlyLinking, socials);
        if (isSocialsLoading)
            return;
        if (socials[currentlyLinking]) {
            setIsUnlinking(true);
            try {
                yield auth[`unlink${capitalize(currentlyLinking)}`]();
            }
            catch (error) {
                setIsUnlinking(false);
                setIsLinkingVisible(false);
                console.error(error);
                return;
            }
            refetch();
            setIsLinkingVisible(false);
            setIsUnlinking(false);
        }
        else {
            try {
                yield auth[`link${capitalize(currentlyLinking)}`]();
            }
            catch (error) {
                setIsLinkingVisible(false);
                console.error(error);
                return;
            }
        }
    });
    return (React.createElement("div", null,
        React.createElement("div", { className: styles["linking-text"] }, currentlyLinking && socials[currentlyLinking] ? (React.createElement("div", null,
            "Your ",
            capitalize(currentlyLinking),
            " account is currently linked.")) : (React.createElement("div", null,
            React.createElement("b", null, window.location.host),
            " is requesting to link your",
            " ",
            capitalize(currentlyLinking),
            " account."))),
        React.createElement("button", { className: styles["linking-button"], onClick: handleLink, disabled: isUnlinking }, !isUnlinking ? (currentlyLinking && socials[currentlyLinking] ? ("Unlink") : ("Link")) : (React.createElement("div", { className: styles.spinner })))));
};
/**
 * The LinkingModal component. Handles the linking and unlinking of socials.
 * @returns { JSX.Element } The LinkingModal component.
 */
const LinkingModal = () => {
    const { isLoading: isSocialsLoading } = useSocials();
    const { setIsLinkingVisible, currentlyLinking } = useContext(ModalContext);
    const [flow, setFlow] = useState("basic");
    useEffect(() => {
        if (["twitter", "discord", "spotify"].includes(currentlyLinking)) {
            setFlow("basic");
        }
        else if (currentlyLinking === "tiktok") {
            setFlow("tiktok");
        }
        else if (currentlyLinking === "telegram") {
            setFlow("telegram");
        }
    }, [currentlyLinking]);
    const Icon = getIconBySocial(currentlyLinking);
    return (React.createElement("div", { className: styles.modal, onClick: (e) => {
            if (e.target === e.currentTarget) {
                setIsLinkingVisible(false);
            }
        }, style: {
            zIndex: 86,
        } },
        React.createElement("div", { className: styles["outer-container"] },
            React.createElement("div", { className: styles.container },
                React.createElement("div", { className: styles["close-button"], onClick: () => setIsLinkingVisible(false) },
                    React.createElement(CloseIcon, null)),
                isSocialsLoading ? (React.createElement("div", { style: {
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "4rem",
                        marginBottom: "1rem",
                    } },
                    React.createElement("div", { className: styles.spinner }))) : (React.createElement("div", null,
                    React.createElement("div", { className: styles.header },
                        React.createElement("div", { className: styles["small-modal-icon"] },
                            React.createElement(Icon, null))),
                    flow === "basic" && React.createElement(BasicFlow, null),
                    flow === "tiktok" && React.createElement(TikTokFlow, null),
                    flow === "telegram" && React.createElement(TelegramFlow, null))),
                React.createElement("a", { href: "https://campnetwork.xyz", className: styles["footer-text"], target: "_blank", rel: "noopener noreferrer", style: { marginTop: 0 } }, "Powered by Camp Network")))));
};
/**
 * The OriginSection component. Displays the Origin status, royalty multiplier, and royalty credits.
 * @returns { JSX.Element } The OriginSection component.
 */
const OriginSection = () => {
    const { data, isError, isLoading } = useOrigin();
    const [isOriginAuthorized, setIsOriginAuthorized] = useState(true);
    const [royaltyMultiplier, setRoyaltyMultiplier] = useState(1);
    const [royaltyCredits, setRoyaltyCredits] = useState(0);
    useEffect(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (!isLoading && !isError) {
            setIsOriginAuthorized((_c = (_b = (_a = data === null || data === void 0 ? void 0 : data.data) === null || _a === void 0 ? void 0 : _a.user) === null || _b === void 0 ? void 0 : _b.active) !== null && _c !== void 0 ? _c : true);
            setRoyaltyMultiplier((_f = (_e = (_d = data === null || data === void 0 ? void 0 : data.data) === null || _d === void 0 ? void 0 : _d.user) === null || _e === void 0 ? void 0 : _e.multiplier) !== null && _f !== void 0 ? _f : 1);
            setRoyaltyCredits((_j = (_h = (_g = data === null || data === void 0 ? void 0 : data.data) === null || _g === void 0 ? void 0 : _g.user) === null || _h === void 0 ? void 0 : _h.points) !== null && _j !== void 0 ? _j : 0);
        }
        if (isError) {
            setIsOriginAuthorized(false);
            setRoyaltyMultiplier(2);
            setRoyaltyCredits(125125);
        }
    }, [data, isError, isLoading]);
    return isLoading ? (React.createElement("div", { style: { marginTop: "1rem", marginBottom: "1rem", flex: 1 } },
        React.createElement("div", { className: styles.spinner }))) : (React.createElement("div", { className: styles["origin-section"] },
        React.createElement(Tooltip, { content: isOriginAuthorized ? "Origin Authorized" : "Origin Unauthorized", position: "top", containerStyle: { width: "100%" } },
            React.createElement("div", { className: styles["origin-container"] },
                React.createElement("span", null, isOriginAuthorized ? (React.createElement(CheckMarkIcon, { w: "1.2rem", h: "1.2rem" })) : (React.createElement(XMarkIcon, { w: "1.2rem", h: "1.2rem" }))),
                React.createElement("span", { className: styles["origin-label"] }, isOriginAuthorized ? "Authorized" : "Unauthorized"))),
        React.createElement("div", { className: styles["divider"] }),
        React.createElement(Tooltip, { content: `Royalty Multiplier: ${royaltyMultiplier}x`, position: "top", containerStyle: { width: "100%" } },
            React.createElement("div", { className: styles["origin-container"] },
                React.createElement("span", null,
                    royaltyMultiplier,
                    "x"),
                React.createElement("span", { className: styles["origin-label"] }, "Multiplier"))),
        React.createElement("div", { className: styles["divider"] }),
        React.createElement(Tooltip, { content: `Royalty Credits: ${royaltyCredits.toLocaleString()}`, position: "top", containerStyle: { width: "100%" } },
            React.createElement("div", { className: styles["origin-container"] },
                React.createElement("span", null, formatCampAmount(royaltyCredits)),
                React.createElement("span", { className: styles["origin-label"] }, "Credits")))));
};
/**
 * The MyCampModal component.
 * @param { { wcProvider: object } } props The props.
 * @returns { JSX.Element } The MyCampModal component.
 */
const MyCampModal = ({ wcProvider, }) => {
    const { auth } = useContext(CampContext);
    const { setIsVisible: setIsVisible } = useContext(ModalContext);
    const { disconnect } = useConnect();
    const { socials, isLoading, refetch } = useSocials();
    const [isLoadingSocials, setIsLoadingSocials] = useState(true);
    const { linkTiktok, linkTelegram } = useLinkModal();
    const [activeTab, setActiveTab] = useState("origin");
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const handleDisconnect = () => {
        wcProvider === null || wcProvider === void 0 ? void 0 : wcProvider.disconnect();
        disconnect();
        setIsVisible(false);
    };
    useEffect(() => {
        if (socials)
            setIsLoadingSocials(false);
    }, [socials]);
    const connectedSocials = [
        {
            name: "Discord",
            link: auth.linkDiscord.bind(auth),
            unlink: auth.unlinkDiscord.bind(auth),
            isConnected: socials === null || socials === void 0 ? void 0 : socials.discord,
            icon: React.createElement(DiscordIcon, null),
        },
        {
            name: "Twitter",
            link: auth.linkTwitter.bind(auth),
            unlink: auth.unlinkTwitter.bind(auth),
            isConnected: socials === null || socials === void 0 ? void 0 : socials.twitter,
            icon: React.createElement(TwitterIcon, null),
        },
        {
            name: "Spotify",
            link: auth.linkSpotify.bind(auth),
            unlink: auth.unlinkSpotify.bind(auth),
            isConnected: socials === null || socials === void 0 ? void 0 : socials.spotify,
            icon: React.createElement(SpotifyIcon, null),
        },
        {
            name: "TikTok",
            link: linkTiktok,
            unlink: auth.unlinkTikTok.bind(auth),
            isConnected: socials === null || socials === void 0 ? void 0 : socials.tiktok,
            icon: React.createElement(TikTokIcon, null),
        },
        {
            name: "Telegram",
            link: linkTelegram,
            unlink: auth.unlinkTelegram.bind(auth),
            isConnected: socials === null || socials === void 0 ? void 0 : socials.telegram,
            icon: React.createElement(TelegramIcon, null),
        },
    ].filter((social) => constants.AVAILABLE_SOCIALS.includes(social.name.toLowerCase()));
    const connected = connectedSocials.filter((social) => social.isConnected);
    const notConnected = connectedSocials.filter((social) => !social.isConnected);
    return (React.createElement("div", { className: styles["outer-container"] },
        React.createElement("div", { className: styles.container },
            React.createElement("div", { className: styles["close-button"], onClick: () => setIsVisible(false) },
                React.createElement(CloseIcon, null)),
            React.createElement("div", { className: styles.header },
                React.createElement("span", null, "My Origin"),
                React.createElement("span", { className: styles["wallet-address"] }, formatAddress(auth.walletAddress, 6))),
            React.createElement("div", { className: styles["vertical-tabs-container"] },
                React.createElement("div", { className: styles["vertical-tabs"] },
                    React.createElement(TabButton, { label: "Stats", isActive: activeTab === "origin", onClick: () => setActiveTab("origin") }),
                    React.createElement(TabButton, { label: "Socials", isActive: activeTab === "socials", onClick: () => setActiveTab("socials") }),
                    React.createElement(TabButton, { label: "Images", isActive: activeTab === "images", onClick: () => setActiveTab("images") }),
                    React.createElement(TabButton, { label: "Audio", isActive: activeTab === "audio", onClick: () => setActiveTab("audio") })),
                React.createElement("div", { className: styles["vertical-tab-content"] },
                    activeTab === "origin" && React.createElement(OriginTab, null),
                    activeTab === "socials" && (React.createElement(SocialsTab, { connectedSocials: connected, notConnectedSocials: notConnected, refetch: refetch, isLoading: isLoading, isLoadingSocials: isLoadingSocials })))),
            React.createElement("button", { className: styles["disconnect-button"], onClick: handleDisconnect }, "Disconnect"),
            React.createElement("a", { href: "https://campnetwork.xyz", className: styles["footer-text"], target: "_blank", rel: "noopener noreferrer", style: { marginTop: 0 } }, "Powered by Camp Network"))));
};
const OriginTab = () => {
    return (React.createElement("div", { className: styles["origin-tab"] },
        React.createElement(OriginSection, null),
        React.createElement(GoToOriginDashboard, null)));
};
const SocialsTab = ({ connectedSocials, notConnectedSocials, refetch, isLoading, isLoadingSocials, }) => {
    return (React.createElement("div", { className: styles["socials-wrapper"] }, isLoading || isLoadingSocials ? (React.createElement("div", { className: styles.spinner, style: {
            margin: "auto",
            marginTop: "6rem",
            marginBottom: "6rem",
        } })) : (React.createElement(React.Fragment, null,
        React.createElement("div", { className: styles["socials-container"] },
            React.createElement("h3", null, "Not Linked"),
            notConnectedSocials.map((social) => (React.createElement(ConnectorButton, { key: social.name, name: social.name, link: social.link, unlink: social.unlink, isConnected: !!social.isConnected, refetch: refetch, icon: social.icon }))),
            notConnectedSocials.length === 0 && (React.createElement("span", { className: styles["no-socials"] }, "You've linked all your socials!"))),
        React.createElement("div", { className: styles["socials-container"] },
            React.createElement("h3", null, "Linked"),
            connectedSocials.map((social) => (React.createElement(ConnectorButton, { key: social.name, name: social.name, link: social.link, unlink: social.unlink, isConnected: !!social.isConnected, refetch: refetch, icon: social.icon }))),
            connectedSocials.length === 0 && (React.createElement("span", { className: styles["no-socials"] }, "You have no socials linked.")))))));
};

const getAuthProperties = (auth) => {
    const prototype = Object.getPrototypeOf(auth);
    const properties = Object.getOwnPropertyNames(prototype);
    const object = {};
    for (const property of properties) {
        if (typeof auth[property] === "function") {
            object[property] = auth[property].bind(auth);
        }
    }
    return object;
};
const getAuthVariables = (auth) => {
    const variables = Object.keys(auth);
    const object = {};
    for (const variable of variables) {
        object[variable] = auth[variable];
    }
    return object;
};
/**
 * Returns the Auth instance provided by the context.
 * @returns { Auth } The Auth instance provided by the context.
 * @example
 * const auth = useAuth();
 * auth.connect();
 */
const useAuth = () => {
    const { auth } = useContext(CampContext);
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const [authProperties, setAuthProperties] = useState(getAuthProperties(auth));
    const [authVariables, setAuthVariables] = useState(getAuthVariables(auth));
    const updateAuth = () => {
        setAuthVariables(getAuthVariables(auth));
        setAuthProperties(getAuthProperties(auth));
    };
    useEffect(() => {
        auth.on("state", updateAuth);
        auth.on("provider", updateAuth);
    }, [auth]);
    return Object.assign(Object.assign({}, authVariables), authProperties);
};
/**
 * Returns the functions to link and unlink socials.
 * @returns { { linkTwitter: function, unlinkTwitter: function, linkDiscord: function, unlinkDiscord: function, linkSpotify: function, unlinkSpotify: function } } The functions to link and unlink socials.
 * @example
 * const { linkTwitter, unlinkTwitter, linkDiscord, unlinkDiscord, linkSpotify, unlinkSpotify } = useLinkSocials();
 * linkTwitter();
 */
const useLinkSocials = () => {
    const { auth } = useContext(CampContext);
    if (!auth) {
        return {};
    }
    const prototype = Object.getPrototypeOf(auth);
    const linkingProps = Object.getOwnPropertyNames(prototype).filter((prop) => (prop.startsWith("link") || prop.startsWith("unlink")) &&
        (constants.AVAILABLE_SOCIALS.includes(prop.slice(4).toLowerCase()) ||
            constants.AVAILABLE_SOCIALS.includes(prop.slice(6).toLowerCase())));
    const linkingFunctions = linkingProps.reduce((acc, prop) => {
        acc[prop] = auth[prop].bind(auth);
        return acc;
    }, {
        sendTelegramOTP: auth.sendTelegramOTP.bind(auth),
    });
    return linkingFunctions;
};
/**
 * Fetches the provider from the context and sets the provider in the auth instance.
 * @returns { { provider: { provider: string, info: { name: string } }, setProvider: function } } The provider and a function to set the provider.
 */
const useProvider = () => {
    var _a, _b, _c;
    const { auth } = useContext(CampContext);
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const [provider, setProvider] = useState({
        provider: (_a = auth.viem) === null || _a === void 0 ? void 0 : _a.transport,
        info: { name: (_c = (_b = auth.viem) === null || _b === void 0 ? void 0 : _b.transport) === null || _c === void 0 ? void 0 : _c.name },
    });
    useEffect(() => {
        auth.on("provider", ({ provider, info }) => {
            setProvider({ provider, info });
        });
    }, [auth]);
    const authSetProvider = auth.setProvider.bind(auth);
    return { provider, setProvider: authSetProvider };
};
/**
 * Returns the authenticated state and loading state.
 * @returns { { authenticated: boolean, loading: boolean } } The authenticated state and loading state.
 */
const useAuthState = () => {
    const { auth } = useContext(CampContext);
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setAuthenticated(auth.isAuthenticated);
        auth.on("state", (state) => {
            setAuthenticated(state === "authenticated");
            setLoading(state === "loading");
        });
    }, [auth]);
    return { authenticated, loading };
};
/**
 * Connects and disconnects the user.
 * @returns { { connect: function, disconnect: function } } The connect and disconnect functions.
 */
const useConnect = () => {
    const { auth } = useContext(CampContext);
    if (!auth) {
        throw new Error("Auth instance is not available. Make sure to wrap your component with CampProvider.");
    }
    const connect = auth.connect.bind(auth);
    const disconnect = auth.disconnect.bind(auth);
    return { connect, disconnect };
};
/**
 * Returns the array of providers.
 * @returns { Array } The array of providers and the loading state.
 */
const useProviders = () => useSyncExternalStore(providerStore.subscribe, providerStore.value, providerStore.value);
/**
 * Returns the modal state and functions to open and close the modal.
 * @returns { { isOpen: boolean, openModal: function, closeModal: function } } The modal state and functions to open and close the modal.
 */
const useModal = () => {
    const { isVisible, setIsVisible } = useContext(ModalContext);
    const handleOpen = () => {
        setIsVisible(true);
    };
    const handleClose = () => {
        setIsVisible(false);
    };
    return {
        isOpen: isVisible,
        openModal: handleOpen,
        closeModal: handleClose,
    };
};
/**
 * Returns the functions to open and close the link modal.
 * @returns { { isLinkingOpen: boolean, closeModal: function, handleOpen: function } } The link modal state and functions to open and close the modal.
 */
const useLinkModal = () => {
    const { socials } = useSocials();
    const { isLinkingVisible, setIsLinkingVisible, setCurrentlyLinking } = useContext(ModalContext);
    const handleOpen = (social) => {
        if (!socials) {
            console.error("User is not authenticated");
            return;
        }
        setCurrentlyLinking(social);
        setIsLinkingVisible(true);
    };
    const handleLink = (social) => {
        if (!socials) {
            console.error("User is not authenticated");
            return;
        }
        if (socials && !socials[social]) {
            setCurrentlyLinking(social);
            setIsLinkingVisible(true);
        }
        else {
            setIsLinkingVisible(false);
            console.warn(`User already linked ${social}`);
        }
    };
    const handleUnlink = (social) => {
        if (!socials) {
            console.error("User is not authenticated");
            return;
        }
        if (socials && socials[social]) {
            setCurrentlyLinking(social);
            setIsLinkingVisible(true);
        }
        else {
            setIsLinkingVisible(false);
            console.warn(`User isn't linked to ${social}`);
        }
    };
    const handleClose = () => {
        setIsLinkingVisible(false);
    };
    const obj = {};
    constants.AVAILABLE_SOCIALS.forEach((social) => {
        obj[`link${social.charAt(0).toUpperCase() + social.slice(1)}`] = () => handleLink(social);
        obj[`unlink${social.charAt(0).toUpperCase() + social.slice(1)}`] = () => handleUnlink(social);
        obj[`open${social.charAt(0).toUpperCase() + social.slice(1)}Modal`] = () => handleOpen(social);
    });
    return Object.assign(Object.assign({ isLinkingOpen: isLinkingVisible }, obj), { closeModal: handleClose, handleOpen });
};
/**
 * Fetches the socials linked to the user.
 * @returns { { data: Array, socials: Array, error: Error, isLoading: boolean, refetch: () => {} } } react-query query object.
 */
const useSocials = () => {
    const { query } = useContext(SocialsContext);
    const socials = query === null || query === void 0 ? void 0 : query.data;
    return Object.assign(Object.assign({}, query), { socials });
};
/**
 * Fetches the Origin usage data.
 * @returns { { data: Array, error: Error, isLoading: boolean, refetch: () => {} } } react-query query object.
 */
const useOrigin = () => {
    const { query } = useContext(OriginContext);
    return query;
};

export { StandaloneCampButton as CampButton, CampContext, CampModal, CampProvider, LinkButton, ModalContext, MyCampModal, useAuth, useAuthState, useConnect, useLinkModal, useLinkSocials, useModal, useOrigin, useProvider, useProviders, useSocials };
