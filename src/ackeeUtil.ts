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
  ? window?.navigator
  : {
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
      language: "en",
      languages: [],
      platform: "",
      vendor: "",
      maxTouchPoints: 0,
      hardwareConcurrency: 0,
      deviceMemory: 0,
    };
const location = isBrowser
  ? window?.location
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

interface RecordBody {
  query: string;
  variables: {
    domainId: string;
    input: any;
  };
}

interface ActionBody {
  query: string;
  variables: {
    eventId: string;
    input: any;
  };
}

interface UpdateBody {
  query: string;
  variables: {
    recordId?: string;
    actionId?: string;
    input?: any;
  };
}

/**
 * Validates options and sets defaults for undefined properties.
 * @param {?Object} opts
 * @returns {Object} opts - Validated options.
 */
const validate = function (opts: Options = {}): Options {
  // Create new object to avoid changes by reference
  const _opts: Options = {};

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
const isLocalhost = function (hostname: string): boolean {
  return (
    hostname === "" ||
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  );
};

/**
 * Determines if user agent is a bot. Approach is to get most bots, assuming other bots don't run JS.
 * Source: https://stackoverflow.com/questions/20084513/detect-search-crawlers-via-javascript/20084661
 * @param {String} userAgent - User agent that should be tested.
 * @returns {Boolean} isBot
 */
const isBot = function (userAgent: string): boolean {
  return /bot|crawler|spider|crawling/i.test(userAgent);
};

/**
 * Checks if an id is a fake id. This is the case when Ackee ignores you because of the `ackee_ignore` cookie.
 * @param {String} id - Id that should be tested.
 * @returns {Boolean} isFakeId
 */
const isFakeId = function (id: string): boolean {
  return id === "88888888-8888-8888-8888-888888888888";
};

/**
 * Checks if the website is in background (e.g. user has minimzed or switched tabs).
 * @returns {boolean}
 */
const isInBackground = function (): boolean {
  return isBrowser ? document.visibilityState === "hidden" : false;
};

/**
 * Get the optional source parameter.
 * @returns {String} source
 */
const source = function (): string | undefined {
  const source = (location.search.split(`source=`)[1] || "").split("&")[0];

  return source === "" ? undefined : source;
};

/**
 * Gathers all platform-, screen- and user-related information.
 * @param {Boolean} detailed - Include personal data.
 * @returns {Object} attributes - User-related information.
 */
export const attributes = function (detailed: boolean = false): Attributes {
  const defaultData = {
    siteLocation: isBrowser ? window?.location?.href : "",
    siteReferrer: isBrowser ? document.referrer : "",
    source: source(),
  };

  const detailedData = {
    siteLanguage: isBrowser
      ? (navigator?.language || navigator?.language || "").substr(0, 2)
      : "",
    screenWidth: isBrowser ? screen.width : 0,
    screenHeight: isBrowser ? screen.height : 0,
    screenColorDepth: isBrowser ? screen.colorDepth : 0,
    browserWidth: isBrowser ? window?.outerWidth : 0,
    browserHeight: isBrowser ? window?.outerHeight : 0,
  };

  return {
    ...defaultData,
    ...(detailed === true ? detailedData : {}),
  };
};

/**
 * Creates an object with a query and variables property to create a record on the server.
 * @param {String} domainId - Id of the domain.
 * @param {Object} input - Data that should be transferred to the server.
 * @returns {Object} Create record body.
 */
const createRecordBody = function (domainId: string, input: any): RecordBody {
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
const updateRecordBody = function (recordId: string): UpdateBody {
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
const createActionBody = function (eventId: string, input: any): ActionBody {
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
const updateActionBody = function (actionId: string, input: any): UpdateBody {
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
const endpoint = function (server: string): string {
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
const send = function (
  url: string,
  body: any,
  opts: Options,
  next?: (json: any) => void
): void {
  const xhr = new XMLHttpRequest();

  xhr.open("POST", url);

  xhr.onload = () => {
    if (xhr.status !== 200) {
      throw new Error("Server returned with an unhandled status");
    }

    let json = null;

    try {
      json = JSON.parse(xhr.responseText);
    } catch (e) {
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
export const detect = function (): void {
  if (isBrowser === false) return;
  const elem = document.querySelector("[data-ackee-domain-id]");

  if (elem == null) return;

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
export const create = function (server: string, opts?: Options) {
  opts = validate(opts);
  const url = endpoint(server);
  const noop = () => {};

  // Fake instance when Ackee ignores you
  const fakeInstance = {
    record: () => ({ stop: noop }),
    updateRecord: () => ({ stop: noop }),
    action: noop,
    updateAction: noop,
  };

  if (
    opts.ignoreLocalhost === true &&
    isLocalhost(location.hostname) === true &&
    isBrowser === true
  ) {
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
  const _record = (
    domainId: string,
    attrs: Attributes = attributes(opts.detailed),
    next?: (recordId: string) => void
  ) => {
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

        if (isInBackground() === true) return;

        send(url, updateRecordBody(recordId), opts);
      }, 15000);

      if (typeof next === "function") {
        return next(recordId);
      }
    });

    return { stop };
  };

  // Updates a record very x seconds to track the duration of the visit
  const _updateRecord = (recordId: string) => {
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

      if (isInBackground() === true) return;

      send(url, updateRecordBody(recordId), opts);
    }, 15000);

    return { stop };
  };

  // Creates a new action on the server
  const _action = (
    eventId: string,
    attrs: any,
    next?: (actionId: string) => void
  ) => {
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
  const _updateAction = (actionId: string, attrs: any) => {
    if (isFakeId(actionId) === true) {
      // return console.warn("Ackee ignores you because this is your own site");
      return;
    }

    send(url, updateActionBody(actionId, attrs), opts);
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
