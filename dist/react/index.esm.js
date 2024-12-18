'use client';
import React, { createContext, useState, useContext, useEffect, useLayoutEffect, useSyncExternalStore } from 'react';
import { createWalletClient, custom } from 'viem';
import { createSiweMessage } from 'viem/siwe';
import { WagmiContext, useAccount, useConnectorClient } from 'wagmi';
import 'axios';
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _arrayWithoutHoles(r) {
  if (Array.isArray(r)) return _arrayLikeToArray(r);
}
function _assertClassBrand(e, t, n) {
  if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
  throw new TypeError("Private element is not present on this object");
}
function asyncGeneratorStep(n, t, e, r, o, a, c) {
  try {
    var i = n[a](c),
      u = i.value;
  } catch (n) {
    return void e(n);
  }
  i.done ? t(u) : Promise.resolve(u).then(r, o);
}
function _asyncToGenerator(n) {
  return function () {
    var t = this,
      e = arguments;
    return new Promise(function (r, o) {
      var a = n.apply(t, e);
      function _next(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "next", n);
      }
      function _throw(n) {
        asyncGeneratorStep(a, r, o, _next, _throw, "throw", n);
      }
      _next(void 0);
    });
  };
}
function _checkPrivateRedeclaration(e, t) {
  if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
}
function _classPrivateFieldGet2(s, a) {
  return s.get(_assertClassBrand(s, a));
}
function _classPrivateFieldInitSpec(e, t, a) {
  _checkPrivateRedeclaration(e, t), t.set(e, a);
}
function _classPrivateFieldSet2(s, a, r) {
  return s.set(_assertClassBrand(s, a), r), r;
}
function _classPrivateMethodInitSpec(e, a) {
  _checkPrivateRedeclaration(e, a), a.add(e);
}
function _createForOfIteratorHelper(r, e) {
  var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (!t) {
    if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) {
      t && (r = t);
      var n = 0,
        F = function () {};
      return {
        s: F,
        n: function () {
          return n >= r.length ? {
            done: !0
          } : {
            done: !1,
            value: r[n++]
          };
        },
        e: function (r) {
          throw r;
        },
        f: F
      };
    }
    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  var o,
    a = !0,
    u = !1;
  return {
    s: function () {
      t = t.call(r);
    },
    n: function () {
      var r = t.next();
      return a = r.done, r;
    },
    e: function (r) {
      u = !0, o = r;
    },
    f: function () {
      try {
        a || null == t.return || t.return();
      } finally {
        if (u) throw o;
      }
    }
  };
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
    value: t,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : e[r] = t, e;
}
function _iterableToArray(r) {
  if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r);
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = !0,
      o = !1;
    try {
      if (i = (t = t.call(r)).next, 0 === l) {
        if (Object(t) !== t) return;
        f = !1;
      } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      o = !0, n = r;
    } finally {
      try {
        if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function ownKeys(e, r) {
  var t = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    r && (o = o.filter(function (r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function _objectSpread2(e) {
  for (var r = 1; r < arguments.length; r++) {
    var t = null != arguments[r] ? arguments[r] : {};
    r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
      _defineProperty(e, r, t[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
    });
  }
  return e;
}
function _objectWithoutProperties(e, t) {
  if (null == e) return {};
  var o,
    r,
    i = _objectWithoutPropertiesLoose(e, t);
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(e);
    for (r = 0; r < s.length; r++) o = s[r], t.includes(o) || {}.propertyIsEnumerable.call(e, o) && (i[o] = e[o]);
  }
  return i;
}
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (e.includes(n)) continue;
    t[n] = r[n];
  }
  return t;
}
function _regeneratorRuntime() {
  _regeneratorRuntime = function () {
    return e;
  };
  var t,
    e = {},
    r = Object.prototype,
    n = r.hasOwnProperty,
    o = Object.defineProperty || function (t, e, r) {
      t[e] = r.value;
    },
    i = "function" == typeof Symbol ? Symbol : {},
    a = i.iterator || "@@iterator",
    c = i.asyncIterator || "@@asyncIterator",
    u = i.toStringTag || "@@toStringTag";
  function define(t, e, r) {
    return Object.defineProperty(t, e, {
      value: r,
      enumerable: !0,
      configurable: !0,
      writable: !0
    }), t[e];
  }
  try {
    define({}, "");
  } catch (t) {
    define = function (t, e, r) {
      return t[e] = r;
    };
  }
  function wrap(t, e, r, n) {
    var i = e && e.prototype instanceof Generator ? e : Generator,
      a = Object.create(i.prototype),
      c = new Context(n || []);
    return o(a, "_invoke", {
      value: makeInvokeMethod(t, r, c)
    }), a;
  }
  function tryCatch(t, e, r) {
    try {
      return {
        type: "normal",
        arg: t.call(e, r)
      };
    } catch (t) {
      return {
        type: "throw",
        arg: t
      };
    }
  }
  e.wrap = wrap;
  var h = "suspendedStart",
    l = "suspendedYield",
    f = "executing",
    s = "completed",
    y = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var p = {};
  define(p, a, function () {
    return this;
  });
  var d = Object.getPrototypeOf,
    v = d && d(d(values([])));
  v && v !== r && n.call(v, a) && (p = v);
  var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
  function defineIteratorMethods(t) {
    ["next", "throw", "return"].forEach(function (e) {
      define(t, e, function (t) {
        return this._invoke(e, t);
      });
    });
  }
  function AsyncIterator(t, e) {
    function invoke(r, o, i, a) {
      var c = tryCatch(t[r], t, o);
      if ("throw" !== c.type) {
        var u = c.arg,
          h = u.value;
        return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
          invoke("next", t, i, a);
        }, function (t) {
          invoke("throw", t, i, a);
        }) : e.resolve(h).then(function (t) {
          u.value = t, i(u);
        }, function (t) {
          return invoke("throw", t, i, a);
        });
      }
      a(c.arg);
    }
    var r;
    o(this, "_invoke", {
      value: function (t, n) {
        function callInvokeWithMethodAndArg() {
          return new e(function (e, r) {
            invoke(t, n, e, r);
          });
        }
        return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
      }
    });
  }
  function makeInvokeMethod(e, r, n) {
    var o = h;
    return function (i, a) {
      if (o === f) throw Error("Generator is already running");
      if (o === s) {
        if ("throw" === i) throw a;
        return {
          value: t,
          done: !0
        };
      }
      for (n.method = i, n.arg = a;;) {
        var c = n.delegate;
        if (c) {
          var u = maybeInvokeDelegate(c, n);
          if (u) {
            if (u === y) continue;
            return u;
          }
        }
        if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
          if (o === h) throw o = s, n.arg;
          n.dispatchException(n.arg);
        } else "return" === n.method && n.abrupt("return", n.arg);
        o = f;
        var p = tryCatch(e, r, n);
        if ("normal" === p.type) {
          if (o = n.done ? s : l, p.arg === y) continue;
          return {
            value: p.arg,
            done: n.done
          };
        }
        "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
      }
    };
  }
  function maybeInvokeDelegate(e, r) {
    var n = r.method,
      o = e.iterator[n];
    if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
    var i = tryCatch(o, e.iterator, r.arg);
    if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
    var a = i.arg;
    return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
  }
  function pushTryEntry(t) {
    var e = {
      tryLoc: t[0]
    };
    1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
  }
  function resetTryEntry(t) {
    var e = t.completion || {};
    e.type = "normal", delete e.arg, t.completion = e;
  }
  function Context(t) {
    this.tryEntries = [{
      tryLoc: "root"
    }], t.forEach(pushTryEntry, this), this.reset(!0);
  }
  function values(e) {
    if (e || "" === e) {
      var r = e[a];
      if (r) return r.call(e);
      if ("function" == typeof e.next) return e;
      if (!isNaN(e.length)) {
        var o = -1,
          i = function next() {
            for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
            return next.value = t, next.done = !0, next;
          };
        return i.next = i;
      }
    }
    throw new TypeError(typeof e + " is not iterable");
  }
  return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
    value: GeneratorFunctionPrototype,
    configurable: !0
  }), o(GeneratorFunctionPrototype, "constructor", {
    value: GeneratorFunction,
    configurable: !0
  }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
    var e = "function" == typeof t && t.constructor;
    return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
  }, e.mark = function (t) {
    return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
  }, e.awrap = function (t) {
    return {
      __await: t
    };
  }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
    return this;
  }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
    void 0 === i && (i = Promise);
    var a = new AsyncIterator(wrap(t, r, n, o), i);
    return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
      return t.done ? t.value : a.next();
    });
  }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
    return this;
  }), define(g, "toString", function () {
    return "[object Generator]";
  }), e.keys = function (t) {
    var e = Object(t),
      r = [];
    for (var n in e) r.push(n);
    return r.reverse(), function next() {
      for (; r.length;) {
        var t = r.pop();
        if (t in e) return next.value = t, next.done = !1, next;
      }
      return next.done = !0, next;
    };
  }, e.values = values, Context.prototype = {
    constructor: Context,
    reset: function (e) {
      if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
    },
    stop: function () {
      this.done = !0;
      var t = this.tryEntries[0].completion;
      if ("throw" === t.type) throw t.arg;
      return this.rval;
    },
    dispatchException: function (e) {
      if (this.done) throw e;
      var r = this;
      function handle(n, o) {
        return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o],
          a = i.completion;
        if ("root" === i.tryLoc) return handle("end");
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc"),
            u = n.call(i, "finallyLoc");
          if (c && u) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          } else if (c) {
            if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
          } else {
            if (!u) throw Error("try statement without catch or finally");
            if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
          }
        }
      }
    },
    abrupt: function (t, e) {
      for (var r = this.tryEntries.length - 1; r >= 0; --r) {
        var o = this.tryEntries[r];
        if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
          var i = o;
          break;
        }
      }
      i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
      var a = i ? i.completion : {};
      return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
    },
    complete: function (t, e) {
      if ("throw" === t.type) throw t.arg;
      return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
    },
    finish: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
      }
    },
    catch: function (t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc === t) {
          var n = r.completion;
          if ("throw" === n.type) {
            var o = n.arg;
            resetTryEntry(r);
          }
          return o;
        }
      }
      throw Error("illegal catch attempt");
    },
    delegateYield: function (e, r, n) {
      return this.delegate = {
        iterator: values(e),
        resultName: r,
        nextLoc: n
      }, "next" === this.method && (this.arg = t), y;
    }
  }, e;
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _toConsumableArray(r) {
  return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
}
function _toPrimitive(t, r) {
  if ("object" != typeof t || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (void 0 !== e) {
    var i = e.call(t, r || "default");
    if ("object" != typeof i) return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return ("string" === r ? String : Number)(t);
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, "string");
  return "symbol" == typeof i ? i : i + "";
}
function _typeof(o) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
    return typeof o;
  } : function (o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
  }, _typeof(o);
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ("string" == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
  }
}

class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "APIError";
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
  toJSON() {
    return {
      error: this.name,
      message: this.message,
      statusCode: this.statusCode || 500
    };
  }
}

var testnet = {
  id: 325000,
  name: "Camp Network Testnet V2",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH"
  },
  rpcUrls: {
    "default": {
      http: ["https://rpc-campnetwork.xyz"]
    }
  },
  blockExplorers: {
    "default": {
      name: "Explorer",
      url: "https://camp-network-testnet.blockscout.com"
    }
  }
};

var client = null;
var getClient = function getClient(provider) {
  var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "window.ethereum";
  if (!provider && !client) {
    console.warn("Provider is required to create a client.");
    return null;
  }
  if (!client || client.transport.name !== name && provider) {
    client = createWalletClient({
      chain: testnet,
      transport: custom(provider, {
        name: name
      })
    });
  }
  return client;
};

var constants = {
  SIWE_MESSAGE_STATEMENT: "Connect with Camp Network",
  AUTH_HUB_BASE_API: "https://wv2h4to5qa.execute-api.us-east-2.amazonaws.com/dev"
};

var providers = [];
var providerStore = {
  value: function value() {
    return providers;
  },
  subscribe: function subscribe(callback) {
    function onAnnouncement(event) {
      if (providers.some(function (p) {
        return p.info.uuid === event.detail.info.uuid;
      })) return;
      providers = [].concat(_toConsumableArray(providers), [event.detail]);
      callback(providers);
    }
    if (typeof window === "undefined") return;
    window.addEventListener("eip6963:announceProvider", onAnnouncement);
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    return function () {
      return window.removeEventListener("eip6963:announceProvider", onAnnouncement);
    };
  }
};

var createRedirectUriObject = function createRedirectUriObject(redirectUri) {
  var keys = ["twitter", "discord", "spotify"];
  if (_typeof(redirectUri) === "object") {
    return keys.reduce(function (object, key) {
      object[key] = redirectUri[key] || (typeof window !== "undefined" ? window.location.href : "");
      return object;
    }, {});
  } else if (typeof redirectUri === "string") {
    return keys.reduce(function (object, key) {
      object[key] = redirectUri;
      return object;
    }, {});
  } else if (!redirectUri) {
    return keys.reduce(function (object, key) {
      object[key] = typeof window !== "undefined" ? window.location.href : "";
      return object;
    }, {});
  }
};

/**
 * The Auth class.
 * @class
 * @classdesc The Auth class is used to authenticate the user.
 */
var _triggers = /*#__PURE__*/new WeakMap();
var _Auth_brand = /*#__PURE__*/new WeakSet();
class Auth {
  constructor(_ref) {
    var _this = this;
    var clientId = _ref.clientId,
      redirectUri = _ref.redirectUri;
    /**
     * Trigger an event.
     * @private
     * @param {string} event The event.
     * @param {object} data The data.
     * @returns {void}
     */
    _classPrivateMethodInitSpec(this, _Auth_brand);
    /**
     * Constructor for the Auth class.
     * @param {object} options The options object.
     * @param {string} options.clientId The client ID.
     * @param {string|object} options.redirectUri The redirect URI used for oauth. Leave empty if you want to use the current URL. If you want different redirect URIs for different socials, pass an object with the socials as keys and the redirect URIs as values.
     * @throws {APIError} - Throws an error if the clientId is not provided.
     */
    _classPrivateFieldInitSpec(this, _triggers, void 0);
    if (!clientId) {
      throw new Error("clientId is required");
    }
    this.viem = null;
    if (typeof window !== "undefined") {
      if (window.ethereum) this.viem = getClient(window.ethereum);
    }
    this.redirectUri = createRedirectUriObject(redirectUri);
    this.clientId = clientId;
    this.isAuthenticated = false;
    this.jwt = null;
    this.walletAddress = null;
    this.userId = null;
    _classPrivateFieldSet2(_triggers, this, []);
    providerStore.subscribe(function (providers) {
      _assertClassBrand(_Auth_brand, _this, _trigger).call(_this, "providers", providers);
    });
    _assertClassBrand(_Auth_brand, this, _loadAuthStatusFromStorage).call(this);
  }

  /**
   * Subscribe to an event. Possible events are "state", "provider", and "providers".
   * @param {("state"|"provider"|"providers")} event The event.
   * @param {function} callback The callback function.
   * @returns {void}
   * @example
   * auth.on("state", (state) => {
   *  console.log(state);
   * });
   */
  on(event, callback) {
    if (!_classPrivateFieldGet2(_triggers, this)[event]) {
      _classPrivateFieldGet2(_triggers, this)[event] = [];
    }
    _classPrivateFieldGet2(_triggers, this)[event].push(callback);
    if (event === "providers") {
      callback(providerStore.value());
    }
  }
  /**
   * Set the loading state.
   * @param {boolean} loading The loading state.
   * @returns {void}
   */
  setLoading(loading) {
    _assertClassBrand(_Auth_brand, this, _trigger).call(this, "state", loading ? "loading" : this.isAuthenticated ? "authenticated" : "unauthenticated");
  }

  /**
   * Set the provider. This is useful for setting the provider when the user selects a provider from the UI or when dApp wishes to use a specific provider.
   * @param {object} options The options object. Includes the provider and the provider info.
   * @returns {void}
   * @throws {APIError} - Throws an error if the provider is not provided.
   */
  setProvider(_ref2) {
    var provider = _ref2.provider,
      info = _ref2.info;
    if (!provider) {
      throw new APIError("provider is required");
    }
    this.viem = getClient(provider, info.name);
    _assertClassBrand(_Auth_brand, this, _trigger).call(this, "provider", {
      provider: provider,
      info: info
    });
  }

  /**
   * Set the wallet address. This is useful for edge cases where the provider can't return the wallet address. Don't use this unless you know what you're doing.
   * @param {string} walletAddress The wallet address.
   * @returns {void}
   */
  setWalletAddress(walletAddress) {
    this.walletAddress = walletAddress;
  }

  /**
   * Load the authentication status from local storage.
   * @private
   * @returns {void}
   */

  /**
   * Disconnect the user.
   * @returns {void}
   */
  disconnect() {
    var _this2 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _this2.isAuthenticated = false;
            _this2.walletAddress = null;
            _this2.userId = null;
            _this2.jwt = null;
            localStorage.removeItem("camp-sdk:wallet-address");
            localStorage.removeItem("camp-sdk:user-id");
            localStorage.removeItem("camp-sdk:jwt");
            _assertClassBrand(_Auth_brand, _this2, _trigger).call(_this2, "state", "unauthenticated");
          case 8:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  }

  /**
   * Connect the user's wallet and sign the message.
   * @returns {Promise<object>} A promise that resolves with the authentication result.
   * @throws {APIError} - Throws an error if the user cannot be authenticated.
   */
  connect() {
    var _this3 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var nonce, message, signature, res;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _assertClassBrand(_Auth_brand, _this3, _trigger).call(_this3, "state", "loading");
            _context2.prev = 1;
            if (_this3.walletAddress) {
              _context2.next = 5;
              break;
            }
            _context2.next = 5;
            return _assertClassBrand(_Auth_brand, _this3, _requestAccount).call(_this3);
          case 5:
            _context2.next = 7;
            return _assertClassBrand(_Auth_brand, _this3, _fetchNonce).call(_this3);
          case 7:
            nonce = _context2.sent;
            message = _assertClassBrand(_Auth_brand, _this3, _createMessage).call(_this3, nonce);
            _context2.next = 11;
            return _this3.viem.signMessage({
              account: _this3.walletAddress,
              message: message
            });
          case 11:
            signature = _context2.sent;
            _context2.next = 14;
            return _assertClassBrand(_Auth_brand, _this3, _verifySignature).call(_this3, message, signature, nonce);
          case 14:
            res = _context2.sent;
            if (!res.success) {
              _context2.next = 26;
              break;
            }
            _this3.isAuthenticated = true;
            _this3.userId = res.userId;
            _this3.jwt = res.token;
            localStorage.setItem("camp-sdk:jwt", _this3.jwt);
            localStorage.setItem("camp-sdk:wallet-address", _this3.walletAddress);
            localStorage.setItem("camp-sdk:user-id", _this3.userId);
            _assertClassBrand(_Auth_brand, _this3, _trigger).call(_this3, "state", "authenticated");
            return _context2.abrupt("return", {
              success: true,
              message: "Successfully authenticated",
              walletAddress: _this3.walletAddress
            });
          case 26:
            _this3.isAuthenticated = false;
            _assertClassBrand(_Auth_brand, _this3, _trigger).call(_this3, "state", "unauthenticated");
            throw new APIError("Failed to authenticate");
          case 29:
            _context2.next = 36;
            break;
          case 31:
            _context2.prev = 31;
            _context2.t0 = _context2["catch"](1);
            _this3.isAuthenticated = false;
            _assertClassBrand(_Auth_brand, _this3, _trigger).call(_this3, "state", "unauthenticated");
            throw new APIError(_context2.t0);
          case 36:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[1, 31]]);
    }))();
  }

  /**
   * Get the user's linked social accounts.
   * @returns {Promise<object>} A promise that resolves with the user's linked social accounts.
   * @throws {APIError} - Throws an error if the user is not authenticated or if the request fails.
   * @example
   * const auth = new Auth({ clientId: "your-client-id" });
   * const socials = await auth.getLinkedSocials();
   * console.log(socials);
   */
  getLinkedSocials() {
    var _this4 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var connections, socials;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (_this4.isAuthenticated) {
              _context3.next = 2;
              break;
            }
            throw new APIError("User needs to be authenticated");
          case 2:
            _context3.next = 4;
            return fetch("".concat(constants.AUTH_HUB_BASE_API, "/auth/client-user/connections-sdk"), {
              method: "GET",
              headers: {
                Authorization: "Bearer ".concat(_this4.jwt),
                "x-client-id": _this4.clientId,
                "Content-Type": "application/json"
              }
            }).then(function (res) {
              return res.json();
            });
          case 4:
            connections = _context3.sent;
            if (connections.isError) {
              _context3.next = 11;
              break;
            }
            socials = {};
            Object.keys(connections.data.data).forEach(function (key) {
              socials[key.split("User")[0]] = connections.data.data[key];
            });
            return _context3.abrupt("return", socials);
          case 11:
            throw new APIError(connections.message || "Failed to fetch connections");
          case 12:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }))();
  }

  /**
   * Link the user's Twitter account.
   * @returns {void}
   * @throws {APIError} - Throws an error if the user is not authenticated.
   */
  linkTwitter() {
    if (!this.isAuthenticated) {
      throw new APIError("User needs to be authenticated");
    }
    window.location.href = "".concat(constants.AUTH_HUB_BASE_API, "/twitter/connect?clientId=").concat(this.clientId, "&userId=").concat(this.userId, "&redirect_url=").concat(this.redirectUri["twitter"]);
  }

  /**
   * Link the user's Discord account.
   * @returns {void}
   * @throws {APIError} - Throws an error if the user is not authenticated.
   */
  linkDiscord() {
    if (!this.isAuthenticated) {
      throw new APIError("User needs to be authenticated");
    }
    window.location.href = "".concat(constants.AUTH_HUB_BASE_API, "/discord/connect?clientId=").concat(this.clientId, "&userId=").concat(this.userId, "&redirect_url=").concat(this.redirectUri["discord"]);
  }

  /**
   * Link the user's Spotify account.
   * @returns {void}
   * @throws {APIError} - Throws an error if the user is not authenticated.
   */
  linkSpotify() {
    if (!this.isAuthenticated) {
      throw new APIError("User needs to be authenticated");
    }
    window.location.href = "".concat(constants.AUTH_HUB_BASE_API, "/spotify/connect?clientId=").concat(this.clientId, "&userId=").concat(this.userId, "&redirect_url=").concat(this.redirectUri["spotify"]);
  }

  /**
   * Unlink the user's Twitter account.
   */
  unlinkTwitter() {
    var _this5 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      var data;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            if (_this5.isAuthenticated) {
              _context4.next = 2;
              break;
            }
            throw new APIError("User needs to be authenticated");
          case 2:
            _context4.next = 4;
            return fetch("".concat(constants.AUTH_HUB_BASE_API, "/twitter/disconnect-sdk"), {
              method: "POST",
              redirect: "follow",
              headers: {
                Authorization: "Bearer ".concat(_this5.jwt),
                "x-client-id": _this5.clientId,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                id: _this5.userId
              })
            }).then(function (res) {
              return res.json();
            });
          case 4:
            data = _context4.sent;
            if (data.isError) {
              _context4.next = 9;
              break;
            }
            return _context4.abrupt("return", data.data);
          case 9:
            throw new APIError(data.message || "Failed to unlink Twitter account");
          case 10:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }))();
  }

  /**
   * Unlink the user's Discord account.
   */
  unlinkDiscord() {
    var _this6 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      var data;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            if (_this6.isAuthenticated) {
              _context5.next = 2;
              break;
            }
            throw new APIError("User needs to be authenticated");
          case 2:
            _context5.next = 4;
            return fetch("".concat(constants.AUTH_HUB_BASE_API, "/discord/disconnect-sdk"), {
              method: "POST",
              redirect: "follow",
              headers: {
                Authorization: "Bearer ".concat(_this6.jwt),
                "x-client-id": _this6.clientId,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                id: _this6.userId
              })
            }).then(function (res) {
              return res.json();
            });
          case 4:
            data = _context5.sent;
            if (data.isError) {
              _context5.next = 9;
              break;
            }
            return _context5.abrupt("return", data.data);
          case 9:
            throw new APIError(data.message || "Failed to unlink Discord account");
          case 10:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }))();
  }

  /**
   * Unlink the user's Spotify account.
   */
  unlinkSpotify() {
    var _this7 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      var data;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            if (_this7.isAuthenticated) {
              _context6.next = 2;
              break;
            }
            throw new APIError("User needs to be authenticated");
          case 2:
            _context6.next = 4;
            return fetch("".concat(constants.AUTH_HUB_BASE_API, "/spotify/disconnect-sdk"), {
              method: "POST",
              redirect: "follow",
              headers: {
                Authorization: "Bearer ".concat(_this7.jwt),
                "x-client-id": _this7.clientId,
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                id: _this7.userId
              })
            }).then(function (res) {
              return res.json();
            });
          case 4:
            data = _context6.sent;
            if (data.isError) {
              _context6.next = 9;
              break;
            }
            return _context6.abrupt("return", data.data);
          case 9:
            throw new APIError(data.message || "Failed to unlink Spotify account");
          case 10:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }))();
  }
}
function _trigger(event, data) {
  if (_classPrivateFieldGet2(_triggers, this)[event]) {
    _classPrivateFieldGet2(_triggers, this)[event].forEach(function (callback) {
      return callback(data);
    });
  }
}
function _loadAuthStatusFromStorage() {
  var _localStorage, _localStorage2, _localStorage3;
  if (typeof localStorage === "undefined") {
    return;
  }
  var walletAddress = (_localStorage = localStorage) === null || _localStorage === void 0 ? void 0 : _localStorage.getItem("camp-sdk:wallet-address");
  var userId = (_localStorage2 = localStorage) === null || _localStorage2 === void 0 ? void 0 : _localStorage2.getItem("camp-sdk:user-id");
  var jwt = (_localStorage3 = localStorage) === null || _localStorage3 === void 0 ? void 0 : _localStorage3.getItem("camp-sdk:jwt");
  if (walletAddress && userId && jwt) {
    this.walletAddress = walletAddress;
    this.userId = userId;
    this.jwt = jwt;
    this.isAuthenticated = true;
  } else {
    this.isAuthenticated = false;
  }
}
/**
 * Request the user to connect their wallet.
 * @private
 * @returns {Promise<void>} A promise that resolves when the user connects their wallet.
 * @throws {APIError} - Throws an error if the user does not connect their wallet.
 */
function _requestAccount() {
  return _requestAccount2.apply(this, arguments);
}
function _requestAccount2() {
  _requestAccount2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
    var _yield$this$viem$requ, _yield$this$viem$requ2, account;
    return _regeneratorRuntime().wrap(function _callee7$(_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _context7.next = 3;
          return this.viem.requestAddresses();
        case 3:
          _yield$this$viem$requ = _context7.sent;
          _yield$this$viem$requ2 = _slicedToArray(_yield$this$viem$requ, 1);
          account = _yield$this$viem$requ2[0];
          this.walletAddress = account;
          return _context7.abrupt("return", account);
        case 10:
          _context7.prev = 10;
          _context7.t0 = _context7["catch"](0);
          throw new APIError(_context7.t0);
        case 13:
        case "end":
          return _context7.stop();
      }
    }, _callee7, this, [[0, 10]]);
  }));
  return _requestAccount2.apply(this, arguments);
}
/**
 * Fetch the nonce from the server.
 * @private
 * @returns {Promise<string>} A promise that resolves with the nonce.
 * @throws {APIError} - Throws an error if the nonce cannot be fetched.
 */
function _fetchNonce() {
  return _fetchNonce2.apply(this, arguments);
}
function _fetchNonce2() {
  _fetchNonce2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
    var res, data;
    return _regeneratorRuntime().wrap(function _callee8$(_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          _context8.next = 3;
          return fetch("".concat(constants.AUTH_HUB_BASE_API, "/auth/client-user/nonce"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-client-id": this.clientId
            },
            body: JSON.stringify({
              walletAddress: this.walletAddress
            })
          });
        case 3:
          res = _context8.sent;
          _context8.next = 6;
          return res.json();
        case 6:
          data = _context8.sent;
          if (!(res.status !== 200)) {
            _context8.next = 9;
            break;
          }
          return _context8.abrupt("return", Promise.reject(data.message || "Failed to fetch nonce"));
        case 9:
          return _context8.abrupt("return", data.data);
        case 12:
          _context8.prev = 12;
          _context8.t0 = _context8["catch"](0);
          throw new Error(_context8.t0);
        case 15:
        case "end":
          return _context8.stop();
      }
    }, _callee8, this, [[0, 12]]);
  }));
  return _fetchNonce2.apply(this, arguments);
}
/**
 * Verify the signature.
 * @private
 * @param {string} message The message.
 * @param {string} signature The signature.
 * @returns {Promise<object>} A promise that resolves with the verification result.
 * @throws {APIError} - Throws an error if the signature cannot be verified.
 */
function _verifySignature(_x, _x2) {
  return _verifySignature2.apply(this, arguments);
}
function _verifySignature2() {
  _verifySignature2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(message, signature) {
    var res, data, payload, decoded;
    return _regeneratorRuntime().wrap(function _callee9$(_context9) {
      while (1) switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return fetch("".concat(constants.AUTH_HUB_BASE_API, "/auth/client-user/verify"), {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-client-id": this.clientId
            },
            body: JSON.stringify({
              message: message,
              signature: signature,
              walletAddress: this.walletAddress
            })
          });
        case 3:
          res = _context9.sent;
          _context9.next = 6;
          return res.json();
        case 6:
          data = _context9.sent;
          payload = data.data.split(".")[1];
          decoded = JSON.parse(atob(payload));
          return _context9.abrupt("return", {
            success: !data.isError,
            userId: decoded.id,
            token: data.data
          });
        case 12:
          _context9.prev = 12;
          _context9.t0 = _context9["catch"](0);
          throw new APIError(_context9.t0);
        case 15:
        case "end":
          return _context9.stop();
      }
    }, _callee9, this, [[0, 12]]);
  }));
  return _verifySignature2.apply(this, arguments);
}
/**
 * Create the SIWE message.
 * @private
 * @param {string} nonce The nonce.
 * @returns {string} The EIP-4361 formatted message.
 */
function _createMessage(nonce) {
  return createSiweMessage({
    domain: window.location.host,
    address: this.walletAddress,
    statement: constants.SIWE_MESSAGE_STATEMENT,
    uri: window.location.origin,
    version: "1",
    chainId: this.viem.chain.id,
    nonce: nonce
  });
}

var ModalContext = /*#__PURE__*/createContext({
  isVisible: false,
  setIsVisible: function setIsVisible() {},
  isLinkingVisible: false,
  setIsLinkingVisible: function setIsLinkingVisible() {},
  currentlyLinking: null,
  setCurrentlyLinking: function setCurrentlyLinking() {}
});
var ModalProvider = function ModalProvider(_ref) {
  var children = _ref.children;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isVisible = _useState2[0],
    setIsVisible = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    isLinkingVisible = _useState4[0],
    setIsLinkingVisible = _useState4[1];
  var _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    currentlyLinking = _useState6[0],
    setCurrentlyLinking = _useState6[1];
  return /*#__PURE__*/React.createElement(ModalContext.Provider, {
    value: {
      isVisible: isVisible,
      setIsVisible: setIsVisible,
      isLinkingVisible: isLinkingVisible,
      setIsLinkingVisible: setIsLinkingVisible,
      currentlyLinking: currentlyLinking,
      setCurrentlyLinking: setCurrentlyLinking
    }
  }, children);
};

var SocialsContext = /*#__PURE__*/createContext({
  query: null
});
var SocialsProvider = function SocialsProvider(_ref) {
  var children = _ref.children;
  var _useAuthState = useAuthState(),
    authenticated = _useAuthState.authenticated;
  var _useContext = useContext(CampContext),
    auth = _useContext.auth;
  var query = useQuery({
    queryKey: ["socials", authenticated],
    queryFn: function queryFn() {
      return auth.getLinkedSocials();
    }
  });
  return /*#__PURE__*/React.createElement(SocialsContext.Provider, {
    value: {
      query: query
    }
  }, children);
};

/**
 * CampContext
 * @type {React.Context}
 * @property {string} clientId The Camp client ID
 * @property {Auth} auth The Camp Auth instance
 * @property {function} setAuth The function to set the Camp Auth instance
 * @property {boolean} wagmiAvailable Whether Wagmi is available
 */
var CampContext = /*#__PURE__*/createContext({
  clientId: null,
  auth: null,
  setAuth: function setAuth() {},
  wagmiAvailable: false
});

/**
 * CampProvider
 * @param {Object} props The props
 * @param {string} props.clientId The Camp client ID
 * @param {string} props.redirectUri The redirect URI to use after social oauths
 * @param {React.ReactNode} props.children The children components
 * @returns {JSX.Element} The CampProvider component
 */
var CampProvider = function CampProvider(_ref) {
  var clientId = _ref.clientId,
    redirectUri = _ref.redirectUri,
    children = _ref.children;
  var _useState = useState(new Auth({
      clientId: clientId,
      redirectUri: redirectUri
    })),
    _useState2 = _slicedToArray(_useState, 2),
    auth = _useState2[0],
    setAuth = _useState2[1];
  var wagmiContext = useContext(WagmiContext);
  return /*#__PURE__*/React.createElement(CampContext.Provider, {
    value: {
      clientId: clientId,
      auth: auth,
      setAuth: setAuth,
      wagmiAvailable: wagmiContext !== undefined
    }
  }, /*#__PURE__*/React.createElement(SocialsProvider, null, /*#__PURE__*/React.createElement(ModalProvider, null, children)));
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

var css_248z$1 = "@import url(\"https://api.fontshare.com/v2/css?f[]=satoshi@1&display=swap\");.auth-module_modal__yyg5L{-webkit-backdrop-filter:blur(2px);backdrop-filter:blur(2px);background-color:#000;background-color:rgba(0,0,0,.4);height:100%;left:0;overflow:auto;position:fixed;top:0;transition:all .3s;width:100%;z-index:85}.auth-module_modal__yyg5L .auth-module_container__7utns{align-items:center;background-color:#fefefe;border:1px solid #888;border-radius:1.5rem;box-sizing:border-box;display:flex;flex-direction:column;font-family:Satoshi,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;justify-content:center;left:50%;padding:1.5rem 1.5rem 1rem;position:absolute;top:50%;transform:translate(-50%,-50%);width:300px;@media screen and (max-width:440px){border-bottom-left-radius:0;border-bottom-right-radius:0;bottom:0;top:auto;transform:translate(-50%);width:100%}}.auth-module_container__7utns h2{font-size:1.25rem;margin-bottom:1rem;margin-top:0}.auth-module_container__7utns .auth-module_header__pX9nM{align-items:center;color:#333;display:flex;flex-direction:column;font-size:1.2rem;font-weight:700;justify-content:center;margin-bottom:1rem;text-align:center;width:100%}.auth-module_container__7utns .auth-module_header__pX9nM .auth-module_small-modal-icon__YayD1{height:2rem;margin-bottom:.5rem;margin-top:.5rem;width:2rem}.auth-module_container__7utns .auth-module_header__pX9nM .auth-module_wallet-address__AVVA5{color:#777;font-size:.75rem;font-weight:400;margin-top:.5rem}.auth-module_container__7utns .auth-module_close-button__uZrho{background-color:#fff;border:2px solid #ddd;border-radius:100%;color:#aaa;font-size:1.5rem;height:1.25rem;position:absolute;right:1rem;top:1rem;transition:color .15s;width:1.25rem}.auth-module_close-button__uZrho>.auth-module_close-icon__SSCni{display:block;height:1rem;padding:.15rem;position:relative;width:1rem}.auth-module_container__7utns .auth-module_close-button__uZrho:hover{background-color:#ddd;color:#888;cursor:pointer}.auth-module_container__7utns .auth-module_linking-text__uz3ud{color:#777;font-size:1rem;text-align:center}.auth-module_provider-list__6vISy{box-sizing:border-box;display:flex;flex-direction:column;gap:.5rem;margin-bottom:.75rem;max-height:17.9rem;overflow-y:auto;padding-left:.5rem;padding-right:.5rem;scrollbar-color:#ccc #f1f1f1;scrollbar-width:thin;width:100%}.auth-module_provider-list__6vISy.auth-module_big__jQxvN{max-height:16rem}.auth-module_provider-list__6vISy::-webkit-scrollbar{border-radius:.25rem;width:.5rem}.auth-module_provider-list__6vISy::-webkit-scrollbar-thumb{background-color:#ccc;border-radius:.25rem}.auth-module_provider-list__6vISy::-webkit-scrollbar-track{background-color:#f1f1f1;border-radius:.25rem}.auth-module_spinner__hfzlH:after{animation:auth-module_spin__tm9l6 1s linear infinite;border:.25rem solid #f3f3f3;border-radius:50%;border-top-color:#ff6f00;content:\"\";display:block;height:1rem;width:1rem}.auth-module_spinner__hfzlH{align-self:center;display:flex;justify-content:center;margin-left:auto;margin-right:.25rem}@keyframes auth-module_spin__tm9l6{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}.auth-module_modal-icon__CV7ah{align-items:center;display:flex;height:4rem;justify-content:center;margin-bottom:.25rem;margin-top:.5rem;padding:.35rem;width:4rem}.auth-module_modal-icon__CV7ah svg{height:3.6rem;width:3.6rem}.auth-module_container__7utns a.auth-module_footer-text__CQnh6{color:#bbb;font-size:.75rem;text-decoration:none}.auth-module_container__7utns a.auth-module_footer-text__CQnh6:hover{text-decoration:underline}.auth-module_disconnect-button__bsu-3{background-color:#ff6f00;border:none;border-radius:.75rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);color:#fff;font-size:1rem;height:2.5rem;margin-bottom:.75rem;margin-top:1rem;padding:1rem;padding-block:0;width:100%}.auth-module_disconnect-button__bsu-3:hover{background-color:#cc4e02;cursor:pointer}.auth-module_disconnect-button__bsu-3:disabled{background-color:#ccc;cursor:not-allowed}.auth-module_linking-button__g1GlL{background-color:#ff6f00;border:none;border-radius:.75rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);color:#fff;font-size:1rem;height:2.5rem;margin-bottom:.75rem;margin-top:1rem;padding:1rem;padding-block:0;width:100%}.auth-module_linking-button__g1GlL:hover{background-color:#cc4e02;cursor:pointer}.auth-module_linking-button__g1GlL:disabled{background-color:#ccc;cursor:not-allowed}.auth-module_socials-wrapper__PshV3{display:flex;flex-direction:column;gap:1rem;margin-block:.5rem;width:100%}.auth-module_socials-container__iDzfJ{display:flex;flex-direction:column;gap:.5rem;width:100%}.auth-module_socials-container__iDzfJ .auth-module_connector-container__4wn11{align-items:center;display:flex;gap:.25rem;justify-content:flex-start;position:relative}.auth-module_socials-container__iDzfJ .auth-module_connector-button__j79HA{align-items:center;background-color:#fefefe;border:1px solid #ddd;border-radius:.75rem;color:#333;display:flex;font-size:.875rem;gap:.25rem;height:2.5rem;padding:.75rem;position:relative;width:100%}.auth-module_socials-container__iDzfJ .auth-module_connector-button__j79HA:hover{background-color:#ddd;cursor:pointer}.auth-module_socials-container__iDzfJ .auth-module_connector-button__j79HA:disabled{background-color:#fefefe;cursor:default}.auth-module_socials-container__iDzfJ .auth-module_connector-button__j79HA svg{color:#333;height:1.5rem;margin-right:.5rem;width:1.5rem}.auth-module_socials-container__iDzfJ .auth-module_connector-connected__JvDQb{align-items:center;background-color:#eee;border:1px solid #ddd;border-radius:.25rem;color:#333;display:flex;flex:1;font-size:.875rem;gap:.25rem;padding:.5rem .75rem;position:relative;width:100%}.auth-module_socials-container__iDzfJ .auth-module_connector-connected__JvDQb svg{color:#333;height:1.5rem;margin-right:.5rem;width:1.5rem}.auth-module_socials-container__iDzfJ h3{color:#333;margin:0}.auth-module_connector-button__j79HA .auth-module_connector-checkmark__ZS6zU{height:1rem!important;position:absolute;right:-.5rem;top:-.5rem;width:1rem!important}.auth-module_unlink-connector-button__6Fwkp{align-items:center;background-color:#999;border:none;border-radius:.5rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);color:#fff;display:flex;font-size:.75rem;gap:.25rem;padding:.25rem .675rem .25rem .5rem;position:absolute;right:.375rem;text-align:center;transition:background-color .15s}.auth-module_unlink-connector-button__6Fwkp svg{stroke:#fff!important;height:.875rem!important;margin-right:0!important;width:.875rem!important}.auth-module_unlink-connector-button__6Fwkp:hover{background-color:#888;cursor:pointer}.auth-module_unlink-connector-button__6Fwkp:disabled{background-color:#ccc;cursor:not-allowed}@keyframes auth-module_loader__gH3ZC{0%{transform:translateX(0)}50%{transform:translateX(100%)}to{transform:translateX(0)}}.auth-module_loader__gH3ZC{background-color:#ddd;border-radius:.125rem;height:.4rem;margin-bottom:.5rem;margin-top:.5rem;position:relative;width:4rem}.auth-module_loader__gH3ZC:before{animation:auth-module_loader__gH3ZC 1.5s ease-in-out infinite;background-color:#ff6f00;border-radius:.125rem;content:\"\";display:block;height:.4rem;left:0;position:absolute;width:2rem}.auth-module_no-socials__wEx0t{color:#777;font-size:.875rem;margin-top:.5rem;text-align:center}.auth-module_divider__z65Me{align-items:center;display:flex;gap:.5rem;margin-bottom:.5rem;margin-top:.5rem}.auth-module_divider__z65Me:after,.auth-module_divider__z65Me:before{border-bottom:1px solid #ddd;content:\"\";flex:1}";
var styles = {"modal":"auth-module_modal__yyg5L","container":"auth-module_container__7utns","header":"auth-module_header__pX9nM","small-modal-icon":"auth-module_small-modal-icon__YayD1","wallet-address":"auth-module_wallet-address__AVVA5","close-button":"auth-module_close-button__uZrho","close-icon":"auth-module_close-icon__SSCni","linking-text":"auth-module_linking-text__uz3ud","provider-list":"auth-module_provider-list__6vISy","big":"auth-module_big__jQxvN","spinner":"auth-module_spinner__hfzlH","spin":"auth-module_spin__tm9l6","modal-icon":"auth-module_modal-icon__CV7ah","footer-text":"auth-module_footer-text__CQnh6","disconnect-button":"auth-module_disconnect-button__bsu-3","linking-button":"auth-module_linking-button__g1GlL","socials-wrapper":"auth-module_socials-wrapper__PshV3","socials-container":"auth-module_socials-container__iDzfJ","connector-container":"auth-module_connector-container__4wn11","connector-button":"auth-module_connector-button__j79HA","connector-connected":"auth-module_connector-connected__JvDQb","connector-checkmark":"auth-module_connector-checkmark__ZS6zU","unlink-connector-button":"auth-module_unlink-connector-button__6Fwkp","loader":"auth-module_loader__gH3ZC","no-socials":"auth-module_no-socials__wEx0t","divider":"auth-module_divider__z65Me"};
styleInject(css_248z$1);

var formatAddress = function formatAddress(address) {
  var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 8;
  return "".concat(address.slice(0, n), "...").concat(address.slice(-n));
};
var capitalize = function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

var getWalletConnectProvider = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(projectId) {
    var provider;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return EthereumProvider.init({
            optionalChains: [testnet.id],
            projectId: projectId,
            showQrModal: true,
            methods: ["personal_sign"]
          });
        case 2:
          provider = _context.sent;
          return _context.abrupt("return", provider);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function getWalletConnectProvider(_x) {
    return _ref.apply(this, arguments);
  };
}();
var useWalletConnectProvider = function useWalletConnectProvider(projectId) {
  var _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    walletConnectProvider = _useState2[0],
    setWalletConnectProvider = _useState2[1];
  useEffect(function () {
    var fetchWalletConnectProvider = /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        var provider;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              _context2.next = 3;
              return getWalletConnectProvider(projectId);
            case 3:
              provider = _context2.sent;
              setWalletConnectProvider(provider);
              _context2.next = 10;
              break;
            case 7:
              _context2.prev = 7;
              _context2.t0 = _context2["catch"](0);
              console.error("Error getting WalletConnect provider:", _context2.t0);
            case 10:
            case "end":
              return _context2.stop();
          }
        }, _callee2, null, [[0, 7]]);
      }));
      return function fetchWalletConnectProvider() {
        return _ref2.apply(this, arguments);
      };
    }();
    fetchWalletConnectProvider();
  }, []);
  return walletConnectProvider;
};

var _excluded = ["children"];

/**
 * Creates a wrapper element and appends it to the body.
 * @param { string } wrapperId The wrapper ID.
 * @returns { HTMLElement } The wrapper element.
 */
var createWrapperAndAppendToBody = function createWrapperAndAppendToBody(wrapperId) {
  var wrapperElement = document.createElement("div");
  wrapperElement.setAttribute("id", wrapperId);
  document.body.appendChild(wrapperElement);
  return wrapperElement;
};

/**
 * The ReactPortal component. Renders children in a portal.
 * @param { { children: JSX.Element, wrapperId: string } } props The props.
 * @returns { JSX.Element } The ReactPortal component.
 */
var ReactPortal = function ReactPortal(_ref) {
  var children = _ref.children,
    _ref$wrapperId = _ref.wrapperId,
    wrapperId = _ref$wrapperId === void 0 ? "react-portal-wrapper" : _ref$wrapperId;
  var _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    wrapperElement = _useState2[0],
    setWrapperElement = _useState2[1];
  useLayoutEffect(function () {
    var element = document.getElementById(wrapperId);
    var systemCreated = false;
    if (!element) {
      systemCreated = true;
      element = createWrapperAndAppendToBody(wrapperId);
    }
    setWrapperElement(element);
    return function () {
      if (systemCreated && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [wrapperId]);
  if (wrapperElement === null) return null;
  return /*#__PURE__*/createPortal(children, wrapperElement);
};

/**
 * The ClientOnly component. Renders children only on the client. Needed for Next.js.
 * @param { { children: JSX.Element } } props The props.
 * @returns { JSX.Element } The ClientOnly component.
 */
var ClientOnly = function ClientOnly(_ref2) {
  var children = _ref2.children,
    delegated = _objectWithoutProperties(_ref2, _excluded);
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    hasMounted = _useState4[0],
    setHasMounted = _useState4[1];
  useEffect(function () {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }
  return /*#__PURE__*/React.createElement("div", delegated, children);
};
var getIconByConnectorName = function getIconByConnectorName(name) {
  switch (name) {
    case "AppKit Auth":
      return "data:image/svg+xml,%3Csvg width='56' height='56' viewBox='0 0 56 56' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='56' height='56' rx='16.3333' fill='%23FF573B'/%3E%3Cpath d='M11.6667 33.8333H44.3334V38.5C44.3334 39.7886 43.2501 40.8333 41.9137 40.8333H14.0865C12.7501 40.8333 11.6667 39.7886 11.6667 38.5V33.8333Z' fill='%23202020'/%3E%3Cpath d='M11.6667 24.5H44.3334V31.5H11.6667V24.5Z' fill='%23202020'/%3E%3Cpath d='M11.6667 17.5C11.6667 16.2113 12.7501 15.1666 14.0865 15.1666H41.9137C43.2501 15.1666 44.3334 16.2113 44.3334 17.5V22.1666H11.6667V17.5Z' fill='%23202020'/%3E%3C/svg%3E";
    case "Privy Wallet":
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='-25 -25 410 514' fill='none' id='svg-669804622_503'%3E%3Cpath d='M180 359.794C279.396 359.794 360 279.236 360 179.897C360 80.5579 279.396 0 180 0C80.604 0 0 80.5579 0 179.897C0 279.236 80.604 359.794 180 359.794Z' fill='%23010110'/%3E%3Cpath d='M180 463.997C247.932 463.997 303.012 452.411 303.012 438.2C303.012 423.988 247.968 412.402 180 412.402C112.032 412.402 56.9883 423.988 56.9883 438.2C56.9883 452.411 112.032 463.997 180 463.997Z' fill='%23010110'/%3E%3C/svg%3E";
    default:
      if (name.toLowerCase().includes("privy")) {
        return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56' viewBox='-25 -25 410 514' fill='none' id='svg-669804622_503'%3E%3Cpath d='M180 359.794C279.396 359.794 360 279.236 360 179.897C360 80.5579 279.396 0 180 0C80.604 0 0 80.5579 0 179.897C0 279.236 80.604 359.794 180 359.794Z' fill='%23010110'/%3E%3Cpath d='M180 463.997C247.932 463.997 303.012 452.411 303.012 438.2C303.012 423.988 247.968 412.402 180 412.402C112.032 412.402 56.9883 423.988 56.9883 438.2C56.9883 452.411 112.032 463.997 180 463.997Z' fill='%23010110'/%3E%3C/svg%3E";
      } else if (name.toLowerCase().includes("appkit")) {
        return "data:image/svg+xml,%3Csvg width='56' height='56' viewBox='0 0 56 56' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='56' height='56' rx='16.3333' fill='%23FF573B'/%3E%3Cpath d='M11.6667 33.8333H44.3334V38.5C44.3334 39.7886 43.2501 40.8333 41.9137 40.8333H14.0865C12.7501 40.8333 11.6667 39.7886 11.6667 38.5V33.8333Z' fill='%23202020'/%3E%3Cpath d='M11.6667 24.5H44.3334V31.5H11.6667V24.5Z' fill='%23202020'/%3E%3Cpath d='M11.6667 17.5C11.6667 16.2113 12.7501 15.1666 14.0865 15.1666H41.9137C43.2501 15.1666 44.3334 16.2113 44.3334 17.5V22.1666H11.6667V17.5Z' fill='%23202020'/%3E%3C/svg%3E";
      } else return "";
  }
};

var getIconBySocial = function getIconBySocial(social) {
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
      return null;
  }
};
var CampIcon = function CampIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 571.95 611.12",
    height: "1rem",
    width: "1rem"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m563.25 431.49-66.17-51.46c-11.11-8.64-27.28-5.06-33.82 7.4-16.24 30.9-41.69 56.36-70.85 73.73l-69.35-69.35c-3.73-3.73-8.79-5.83-14.07-5.83s-10.34 2.1-14.07 5.83l-73.78 73.78c-57.37-30.39-96.55-90.71-96.55-160.03 0-99.79 81.19-180.98 180.98-180.98 60.35 0 118.17 26.28 156.39 89.44 6.85 11.32 21.92 14.33 32.59 6.51l64.21-47.06c9.53-6.98 12.06-20.15 5.78-30.16C508.83 54.41 411.43 0 305.56 0 137.07 0 0 137.07 0 305.56s137.07 305.56 305.56 305.56c57.6 0 113.72-16.13 162.31-46.63A306.573 306.573 0 0 0 568.8 460.8c5.78-9.78 3.42-22.34-5.55-29.31Zm-301.42 49.69 47.15-47.15 44.69 44.69c-15.92 5.1-32.2 7.83-48.1 7.83-15.08 0-29.72-1.87-43.74-5.36Zm42.36-222.47c-.07 1.49-.08 21.29 49.54 55.11 37.02 25.24 19.68 75.52 12.1 92.05a147.07 147.07 0 0 0-20.12-38.91c-12.73-17.59-26.87-28.9-36.74-35.59-10.38 6.36-27.41 18.74-41.07 40.02-8.27 12.89-12.82 25.16-15.42 34.48l-.03-.05c-15.1-40.6-9.75-60.88-1.95-71.9 6.12-8.65 17.24-20.6 17.24-20.6 9.71-9.66 19.96-19.06 29.82-38.17 6.06-11.75 6.59-15.84 6.63-16.45Z",
    fill: "#000",
    strokeWidth: "0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M267.74 313.33s-11.11 11.95-17.24 20.6c-7.8 11.02-13.14 31.3 1.95 71.9-86.02-75.3 2.56-152.15.79-146.3-6.58 21.75 14.49 53.8 14.49 53.8Zm20.98-23.66c3.01-4.27 5.97-9.06 8.8-14.55 6.62-12.83 6.64-16.54 6.64-16.54s-2.09 20.02 49.53 55.21c37.02 25.24 19.68 75.52 12.1 92.05 0 0 43.69-27.86 37.49-74.92-7.45-56.61-38.08-51.5-60.84-93.43-21.23-39.11 15.03-70.44 15.03-70.44s-48.54-2.61-70.76 48.42c-23.42 53.77 2 74.21 2 74.21Z",
    fill: "#ff6d01",
    strokeWidth: "0"
  }));
};
var DiscordIcon = function DiscordIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 42 32",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M41.1302 23.4469V24.2363C41.0328 24.2948 41.0717 24.3923 41.062 24.4702C41.0328 24.8991 40.9938 25.3279 40.9645 25.7568C40.9548 25.9322 40.8866 26.0589 40.7306 26.1661C37.7092 28.3396 34.4247 30.0062 30.8672 31.1173C30.6528 31.1856 30.5358 31.1563 30.3994 30.9711C29.6879 29.977 29.0446 28.9439 28.4696 27.862C28.3624 27.6573 28.4111 27.5989 28.6061 27.5209C29.532 27.17 30.4286 26.7509 31.2961 26.2733C31.8419 25.981 31.8224 25.9907 31.3546 25.5911C31.1109 25.3767 30.9062 25.3474 30.5943 25.4936C27.7971 26.7509 24.8634 27.4624 21.7933 27.5989C18.0507 27.7645 14.4542 27.092 11.0235 25.6008C10.5069 25.3767 10.1463 25.3669 9.75645 25.7763C9.59076 25.9517 9.54202 25.9907 9.77594 26.1271C10.7213 26.6534 11.6862 27.131 12.6999 27.5014C12.963 27.5989 12.963 27.6963 12.8461 27.9205C12.2905 28.9634 11.6667 29.9575 10.9942 30.9224C10.8383 31.1466 10.6921 31.1953 10.429 31.1173C6.91049 29.9965 3.65518 28.3591 0.663021 26.2051C0.497331 26.0784 0.419365 25.9615 0.409619 25.747C0.409619 25.4156 0.360879 25.094 0.341386 24.7626C0.156204 21.9752 0.292661 19.2072 0.789729 16.4489C1.66691 11.5952 3.61619 7.18007 6.33545 3.08656C6.43291 2.94037 6.54012 2.8429 6.69607 2.76493C9.25938 1.61485 11.9202 0.805904 14.6784 0.308836C14.8538 0.279597 14.961 0.308829 15.0488 0.484265C15.3217 1.04956 15.6141 1.6051 15.887 2.17039C15.9844 2.37507 16.0624 2.4628 16.3158 2.42381C19.2397 2.01446 22.1734 2.02421 25.0973 2.42381C25.2923 2.45305 25.3702 2.39457 25.4385 2.22889C25.7114 1.65385 26.0038 1.08854 26.2767 0.513503C26.3644 0.32832 26.4813 0.26985 26.686 0.308836C29.4248 0.805904 32.066 1.61486 34.6099 2.74545C34.7853 2.82342 34.912 2.94037 35.0192 3.10606C38.4305 8.18395 40.5454 13.7297 40.9938 19.8699C41.0133 20.1623 40.9548 20.4742 41.101 20.7666V21.4976C41.0035 21.634 41.0328 21.7997 41.0425 21.9459C41.0718 22.4527 40.9645 22.9693 41.101 23.4761L41.1302 23.4469ZM23.8108 17.063C23.8108 18.0961 24.035 18.9148 24.5223 19.6458C25.8868 21.7218 28.5963 21.9069 30.1655 20.0259C31.53 18.3885 31.4618 15.8349 29.9998 14.2755C28.7815 12.9792 26.8225 12.8038 25.419 13.8856C24.3371 14.7238 23.8595 15.8739 23.8206 17.063H23.8108ZM17.5731 17.3748C17.5731 16.6244 17.4756 16.0103 17.2027 15.4353C16.5595 14.1 15.5361 13.2424 14.0059 13.1936C12.4952 13.1449 11.4328 13.9246 10.7408 15.2111C9.88315 16.829 10.1366 18.7881 11.3549 20.1623C12.5829 21.5463 14.6102 21.7315 16.0526 20.5619C17.0955 19.714 17.5438 18.5737 17.5828 17.3748H17.5731Z",
    fill: "#5865F2"
  }));
};
var TwitterIcon = function TwitterIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 33 27",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M32.3127 3.1985C31.3088 3.64684 30.2075 3.92949 29.1257 4.10493C29.6422 4.01721 30.3927 3.09129 30.6948 2.71118C31.1529 2.13614 31.5428 1.48313 31.7572 0.781387C31.7864 0.722908 31.8059 0.654685 31.7572 0.615699C31.689 0.58646 31.6402 0.605947 31.5915 0.62544C30.3829 1.26871 29.1354 1.73654 27.8099 2.07766C27.7027 2.1069 27.615 2.07766 27.5467 2.00943C27.4395 1.88273 27.3323 1.76578 27.2153 1.66832C26.6598 1.19074 26.0555 0.820367 25.383 0.547467C24.4961 0.186849 23.5312 0.0309141 22.576 0.0991391C21.6501 0.157618 20.734 0.420776 19.9055 0.849619C19.0771 1.27846 18.3461 1.88273 17.7516 2.60397C17.1473 3.35444 16.6989 4.24137 16.465 5.17702C16.2409 6.08344 16.2603 6.98012 16.3968 7.89629C16.4163 8.05223 16.3968 8.07173 16.2701 8.05224C11.0752 7.28227 6.76732 5.42069 3.26834 1.4344C3.1124 1.25896 3.03443 1.25897 2.90773 1.44415C1.37754 3.73457 2.11826 7.41871 4.02857 9.23155C4.28197 9.47521 4.54513 9.71887 4.82777 9.93329C4.72056 9.95278 3.45353 9.81633 2.32294 9.23155C2.167 9.13408 2.09877 9.19257 2.07928 9.35826C2.06953 9.60192 2.07928 9.83583 2.11827 10.099C2.41066 12.4284 4.01882 14.5726 6.23126 15.4108C6.49442 15.518 6.78681 15.6155 7.06946 15.6642C6.56264 15.7714 6.04608 15.8494 4.61335 15.7422C4.43792 15.7032 4.36969 15.8006 4.43792 15.9663C5.51977 18.9195 7.85892 19.7967 9.60353 20.2938C9.83744 20.3327 10.0714 20.3327 10.3053 20.3912C10.2955 20.4107 10.276 20.4107 10.2663 20.4302C9.6815 21.3171 7.67374 21.9701 6.73808 22.3015C5.03245 22.8961 3.18063 23.169 1.37754 22.9838C1.08514 22.9448 1.02666 22.9448 0.948692 22.9838C0.870721 23.0325 0.938946 23.1007 1.02666 23.1787C1.39703 23.4224 1.76739 23.6368 2.1475 23.8415C3.28784 24.4457 4.48665 24.9331 5.73419 25.2742C12.1766 27.0578 19.4279 25.742 24.2622 20.937C28.0633 17.1652 29.3888 11.9605 29.3888 6.7462C29.3888 6.54153 29.6325 6.43433 29.7689 6.31737C30.7533 5.57664 31.5525 4.68971 32.2932 3.69558C32.4589 3.47141 32.4589 3.27648 32.4589 3.18876V3.15952C32.4589 3.0718 32.4589 3.10104 32.3322 3.15952L32.3127 3.1985Z",
    fill: "#1F9CEA"
  }));
};
var SpotifyIcon = function SpotifyIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    role: "img",
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg",
    fill: "#1DB954"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
  }));
};
var TikTokIcon = function TikTokIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    role: "img",
    viewBox: "-2 -2 28 28",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("title", null, "TikTok"), /*#__PURE__*/React.createElement("path", {
    d: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
  }));
};
var TelegramIcon = function TelegramIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "35 40 170 170"
  }, /*#__PURE__*/React.createElement("g", {
    fill: "black",
    fillRule: "nonzero",
    stroke: "none",
    strokeWidth: "1",
    strokeLinecap: "butt",
    strokeLinejoin: "miter",
    strokeMiterlimit: "10",
    strokeDasharray: "",
    strokeDashoffset: "0",
    fontFamily: "none",
    fontWeight: "none",
    fontSize: "none",
    textAnchor: "none",
    style: {
      mixBlendMode: "normal"
    }
  }, /*#__PURE__*/React.createElement("g", {
    transform: "scale(5.33333,5.33333)"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M24,4c-11.04569,0 -20,8.95431 -20,20c0,11.04569 8.95431,20 20,20c11.04569,0 20,-8.95431 20,-20c0,-11.04569 -8.95431,-20 -20,-20z",
    "fill-opacity": "0",
    fill: "#0088cc"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M33.95,15l-3.746,19.126c0,0 -0.161,0.874 -1.245,0.874c-0.576,0 -0.873,-0.274 -0.873,-0.274l-8.114,-6.733l-3.97,-2.001l-5.095,-1.355c0,0 -0.907,-0.262 -0.907,-1.012c0,-0.625 0.933,-0.923 0.933,-0.923l21.316,-8.468c-0.001,-0.001 0.651,-0.235 1.126,-0.234c0.292,0 0.625,0.125 0.625,0.5c0,0.25 -0.05,0.5 -0.05,0.5z",
    fill: "#0088cc"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M23,30.505l-3.426,3.374c0,0 -0.149,0.115 -0.348,0.12c-0.069,0.002 -0.143,-0.009 -0.219,-0.043l0.964,-5.965z",
    fill: "#0088cc"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M29.897,18.196c-0.169,-0.22 -0.481,-0.26 -0.701,-0.093l-13.196,7.897c0,0 2.106,5.892 2.427,6.912c0.322,1.021 0.58,1.045 0.58,1.045l0.964,-5.965l9.832,-9.096c0.22,-0.167 0.261,-0.48 0.094,-0.7z",
    fill: "#0088cc"
  }))));
};
var CloseIcon = function CloseIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    className: styles["close-icon"],
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M18 6L6 18",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 6L18 18",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
};

var css_248z = ".buttons-module_connect-button__CJhUa{background-color:#ff6f00;border:none;border-radius:.75rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);color:#fff;font-family:Satoshi,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Open Sans,Helvetica Neue,sans-serif;font-size:1rem;font-weight:600;height:2.75rem;line-height:1.333rem;padding-inline:2.5rem;padding-left:5rem;position:relative;transition:background-color .15s;width:12rem}.buttons-module_connect-button__CJhUa .buttons-module_button-icon__JM4-2{background:hsla(0,0%,100%,.75);border-radius:.75rem 0 0 .75rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05);display:grid;height:100%;left:0;margin-right:.5rem;place-items:center;position:absolute;top:50%;transform:translateY(-50%);transition:background-color .15s;width:3rem}.buttons-module_connect-button__CJhUa .buttons-module_button-icon__JM4-2 svg{height:1.25rem;width:1.25rem}.buttons-module_connect-button__CJhUa:hover{background-color:#cc4e02;border-color:#cc4e02;cursor:pointer}.buttons-module_connect-button__CJhUa:hover .buttons-module_button-icon__JM4-2{background:hsla(0,0%,100%,.675)}.buttons-module_connect-button__CJhUa:focus{outline:none}.buttons-module_connect-button__CJhUa:disabled{background-color:#ccc;cursor:not-allowed}.buttons-module_provider-button__6JY7s{align-items:center;background-color:#fefefe;border:1px solid #ddd;border-radius:.5rem;display:flex;font-family:inherit;gap:.5rem;justify-content:flex-start;padding:.5rem;transition:background-color .15s;width:100%}.buttons-module_provider-button__6JY7s:focus{outline:1px solid #43b7c4}.buttons-module_provider-button__6JY7s:hover{border-color:#43b7c4}.buttons-module_provider-button__6JY7s:hover:not(:disabled){background-color:#ddd;cursor:pointer}.buttons-module_provider-button__6JY7s img{height:2rem;width:2rem}.buttons-module_provider-button__6JY7s .buttons-module_provider-icon__MOhr8{border-radius:.2rem}.buttons-module_provider-button__6JY7s span{line-height:1rem;margin-left:.5rem}.buttons-module_provider-button__6JY7s span.buttons-module_provider-name__tHWO2{color:#333;font-size:.875rem}.buttons-module_provider-button__6JY7s span.buttons-module_provider-label__CEGRr{color:#777;font-size:.7rem}.buttons-module_link-button-default__EcKUT{background-color:#ff6f00;border:none;border-radius:.75rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);box-sizing:border-box;cursor:pointer;height:2.6rem;position:relative;width:7rem}.buttons-module_link-button-default__EcKUT:disabled{background-color:#b8b8b8;cursor:not-allowed}.buttons-module_link-button-default__EcKUT:after{background-color:transparent;border-radius:.75rem;bottom:0;content:\"\";left:0;position:absolute;right:0;top:0;transition:background-color .15s}.buttons-module_link-button-default__EcKUT:disabled:after{background-color:rgba(0,0,0,.35);border-radius:.35rem;color:#fff;content:\"Not connected\";display:grid;font-size:.75rem;height:2rem;left:0;opacity:0;padding:.25rem;place-items:center;position:absolute;right:0;top:-2.7rem;transform:translateY(-.5rem);transition:all .25s;-webkit-user-select:none;-moz-user-select:none;user-select:none;visibility:hidden}.buttons-module_link-button-default__EcKUT:disabled:hover:after{opacity:1;transform:translateY(0);visibility:visible}.buttons-module_link-button-default__EcKUT:not(:disabled):hover:after{background-color:rgba(0,0,0,.1)}.buttons-module_link-button-default__EcKUT:not(:disabled).buttons-module_twitter__9sRaz{background-color:#1da1f2}.buttons-module_link-button-default__EcKUT:not(:disabled).buttons-module_spotify__-fiKQ{background-color:#1db954}.buttons-module_link-button-default__EcKUT:not(:disabled).buttons-module_discord__I-YjZ{background-color:#7289da}.buttons-module_link-button-default__EcKUT:not(:disabled).buttons-module_tiktok__a80-0{background-color:#000}.buttons-module_link-button-default__EcKUT:not(:disabled).buttons-module_telegram__ExOTS{background-color:#08c}.buttons-module_link-button-default__EcKUT .buttons-module_button-container__-oPqd{align-items:center;display:flex;flex-direction:row;gap:.5rem;justify-content:center;padding:.5rem}.buttons-module_button-container__-oPqd .buttons-module_social-icon__DPdPe{align-items:center;color:#fff;display:flex;height:1.5rem;justify-content:center;width:1.5rem}.buttons-module_button-container__-oPqd .buttons-module_social-icon__DPdPe svg{fill:#fff!important;height:1.5rem;width:1.5rem}.buttons-module_button-container__-oPqd .buttons-module_social-icon__DPdPe svg path{fill:#fff!important}.buttons-module_button-container__-oPqd .buttons-module_link-icon__8V8FP{align-items:center;color:hsla(0,0%,100%,.8);display:flex;height:1.25rem;justify-content:center;width:1.25rem}.buttons-module_button-container__-oPqd .buttons-module_camp-logo__slNl0{align-items:center;background-color:#fff;border-radius:50%;box-sizing:border-box;display:flex;height:1.5rem;justify-content:center;padding:.15rem;width:1.5rem}.buttons-module_link-button-default__EcKUT:disabled .buttons-module_button-container__-oPqd .buttons-module_camp-logo__slNl0 svg path{fill:#b8b8b8!important}.buttons-module_link-button-icon__llX8m{background-color:#ff6f00;border:none;border-radius:.75rem;box-shadow:inset 0 2px 0 hsla(0,0%,100%,.15),inset 0 -2px 4px rgba(0,0,0,.05),0 1px 1px rgba(46,54,80,.075);box-sizing:border-box;cursor:pointer;height:3rem;min-height:3rem;min-width:3rem;padding:0;position:relative;width:3rem}.buttons-module_link-button-icon__llX8m:disabled{background-color:#b8b8b8;cursor:not-allowed}.buttons-module_link-button-icon__llX8m:disabled:after{background-color:rgba(0,0,0,.35);border-radius:.35rem;box-sizing:border-box;color:#fff;content:\"Not connected\";display:grid;font-size:.75rem;height:-moz-fit-content;height:fit-content;left:-1rem;opacity:0;padding:.25rem;place-items:center;position:absolute;right:-1rem;top:-2.7rem;transform:translateY(-.5rem);transition:all .25s}.buttons-module_link-button-icon__llX8m:disabled:hover:after{opacity:1;transform:translateY(0)}.buttons-module_link-button-icon__llX8m:after{background-color:transparent;border-radius:.75rem;bottom:0;content:\"\";left:0;position:absolute;right:0;top:0;transition:background-color .15s}.buttons-module_link-button-icon__llX8m:not(:disabled):hover:after{background-color:rgba(0,0,0,.1)}.buttons-module_link-button-icon__llX8m:not(:disabled).buttons-module_twitter__9sRaz{background-color:#1da1f2}.buttons-module_link-button-icon__llX8m:not(:disabled).buttons-module_spotify__-fiKQ{background-color:#1db954}.buttons-module_link-button-icon__llX8m:not(:disabled).buttons-module_discord__I-YjZ{background-color:#7289da}.buttons-module_link-button-icon__llX8m:not(:disabled).buttons-module_tiktok__a80-0{background-color:#000}.buttons-module_link-button-icon__llX8m:not(:disabled).buttons-module_telegram__ExOTS{background-color:#08c}.buttons-module_link-button-icon__llX8m .buttons-module_icon-container__Q5bI1{align-items:center;display:flex;flex:1;height:100%;justify-content:center;position:relative;width:100%}.buttons-module_link-button-icon__llX8m .buttons-module_icon-container__Q5bI1>svg{fill:#fff!important;height:1.5rem;width:1.5rem}.buttons-module_link-button-icon__llX8m .buttons-module_icon-container__Q5bI1>svg path{fill:#fff!important}.buttons-module_link-button-icon__llX8m .buttons-module_camp-logo__slNl0{align-items:center;background-color:#fff;border-radius:50%;bottom:-.5rem;box-sizing:border-box;display:flex;height:1.5rem;justify-content:center;position:absolute;right:-.5rem;width:1.5rem}.buttons-module_link-button-icon__llX8m .buttons-module_camp-logo__slNl0 svg{height:1.1rem;width:1.1rem}.buttons-module_link-button-icon__llX8m:disabled .buttons-module_camp-logo__slNl0 svg path,.buttons-module_not-linked__ua4va svg path{fill:#b8b8b8!important}";
var buttonStyles = {"connect-button":"buttons-module_connect-button__CJhUa","button-icon":"buttons-module_button-icon__JM4-2","provider-button":"buttons-module_provider-button__6JY7s","provider-icon":"buttons-module_provider-icon__MOhr8","provider-name":"buttons-module_provider-name__tHWO2","provider-label":"buttons-module_provider-label__CEGRr","link-button-default":"buttons-module_link-button-default__EcKUT","twitter":"buttons-module_twitter__9sRaz","spotify":"buttons-module_spotify__-fiKQ","discord":"buttons-module_discord__I-YjZ","tiktok":"buttons-module_tiktok__a80-0","telegram":"buttons-module_telegram__ExOTS","button-container":"buttons-module_button-container__-oPqd","social-icon":"buttons-module_social-icon__DPdPe","link-icon":"buttons-module_link-icon__8V8FP","camp-logo":"buttons-module_camp-logo__slNl0","link-button-icon":"buttons-module_link-button-icon__llX8m","icon-container":"buttons-module_icon-container__Q5bI1","not-linked":"buttons-module_not-linked__ua4va"};
styleInject(css_248z);

/**
 * The injected CampButton component.
 * @param { { onClick: function, authenticated: boolean } } props The props.
 * @returns { JSX.Element } The CampButton component.
 */
var CampButton = function CampButton(_ref) {
  var onClick = _ref.onClick,
    authenticated = _ref.authenticated,
    disabled = _ref.disabled;
  return /*#__PURE__*/React.createElement("button", {
    className: buttonStyles["connect-button"],
    onClick: onClick,
    disabled: disabled
  }, /*#__PURE__*/React.createElement("div", {
    className: buttonStyles["button-icon"]
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 571.95 611.12",
    height: "1rem",
    width: "1rem"
  }, /*#__PURE__*/React.createElement("path", {
    d: "m563.25 431.49-66.17-51.46c-11.11-8.64-27.28-5.06-33.82 7.4-16.24 30.9-41.69 56.36-70.85 73.73l-69.35-69.35c-3.73-3.73-8.79-5.83-14.07-5.83s-10.34 2.1-14.07 5.83l-73.78 73.78c-57.37-30.39-96.55-90.71-96.55-160.03 0-99.79 81.19-180.98 180.98-180.98 60.35 0 118.17 26.28 156.39 89.44 6.85 11.32 21.92 14.33 32.59 6.51l64.21-47.06c9.53-6.98 12.06-20.15 5.78-30.16C508.83 54.41 411.43 0 305.56 0 137.07 0 0 137.07 0 305.56s137.07 305.56 305.56 305.56c57.6 0 113.72-16.13 162.31-46.63A306.573 306.573 0 0 0 568.8 460.8c5.78-9.78 3.42-22.34-5.55-29.31Zm-301.42 49.69 47.15-47.15 44.69 44.69c-15.92 5.1-32.2 7.83-48.1 7.83-15.08 0-29.72-1.87-43.74-5.36Zm42.36-222.47c-.07 1.49-.08 21.29 49.54 55.11 37.02 25.24 19.68 75.52 12.1 92.05a147.07 147.07 0 0 0-20.12-38.91c-12.73-17.59-26.87-28.9-36.74-35.59-10.38 6.36-27.41 18.74-41.07 40.02-8.27 12.89-12.82 25.16-15.42 34.48l-.03-.05c-15.1-40.6-9.75-60.88-1.95-71.9 6.12-8.65 17.24-20.6 17.24-20.6 9.71-9.66 19.96-19.06 29.82-38.17 6.06-11.75 6.59-15.84 6.63-16.45Z",
    fill: "#000",
    strokeWidth: "0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M267.74 313.33s-11.11 11.95-17.24 20.6c-7.8 11.02-13.14 31.3 1.95 71.9-86.02-75.3 2.56-152.15.79-146.3-6.58 21.75 14.49 53.8 14.49 53.8Zm20.98-23.66c3.01-4.27 5.97-9.06 8.8-14.55 6.62-12.83 6.64-16.54 6.64-16.54s-2.09 20.02 49.53 55.21c37.02 25.24 19.68 75.52 12.1 92.05 0 0 43.69-27.86 37.49-74.92-7.45-56.61-38.08-51.5-60.84-93.43-21.23-39.11 15.03-70.44 15.03-70.44s-48.54-2.61-70.76 48.42c-23.42 53.77 2 74.21 2 74.21Z",
    fill: "#ff6d01",
    strokeWidth: "0"
  }))), authenticated ? "My Camp" : "Connect");
};

/**
 * The ProviderButton component.
 * @param { { provider: { provider: string, info: { name: string, icon: string } }, handleConnect: function, loading: boolean, label: string } } props The props.
 * @returns { JSX.Element } The ProviderButton component.
 */
var ProviderButton = function ProviderButton(_ref2) {
  var provider = _ref2.provider,
    handleConnect = _ref2.handleConnect,
    loading = _ref2.loading,
    label = _ref2.label;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isButtonLoading = _useState2[0],
    setIsButtonLoading = _useState2[1];
  var handleClick = function handleClick() {
    handleConnect(provider);
    setIsButtonLoading(true);
  };
  useEffect(function () {
    if (!loading) {
      setIsButtonLoading(false);
    }
  }, [loading]);
  return /*#__PURE__*/React.createElement("button", {
    className: buttonStyles["provider-button"],
    onClick: handleClick,
    disabled: loading
  }, /*#__PURE__*/React.createElement("img", {
    src: provider.info.icon || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24'%3E%3Cpath fill='%23777777' d='M21 7.28V5c0-1.1-.9-2-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2v-2.28A2 2 0 0 0 22 15V9a2 2 0 0 0-1-1.72M20 9v6h-7V9zM5 19V5h14v2h-6c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h6v2z'/%3E%3Ccircle cx='16' cy='12' r='1.5' fill='%23777777'/%3E%3C/svg%3E",
    className: buttonStyles["provider-icon"],
    alt: provider.info.name
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: buttonStyles["provider-name"]
  }, provider.info.name), label && /*#__PURE__*/React.createElement("span", {
    className: buttonStyles["provider-label"]
  }, "(", label, ")")), isButtonLoading && /*#__PURE__*/React.createElement("div", {
    className: styles.spinner
  }));
};
var ConnectorButton = function ConnectorButton(_ref3) {
  var name = _ref3.name,
    link = _ref3.link,
    unlink = _ref3.unlink,
    icon = _ref3.icon,
    isConnected = _ref3.isConnected,
    refetch = _ref3.refetch;
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    isUnlinking = _useState4[0],
    setIsUnlinking = _useState4[1];
  var handleClick = function handleClick() {
    link();
  };
  var handleDisconnect = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            setIsUnlinking(true);
            _context.prev = 1;
            _context.next = 4;
            return unlink();
          case 4:
            _context.next = 6;
            return refetch();
          case 6:
            setIsUnlinking(false);
            _context.next = 13;
            break;
          case 9:
            _context.prev = 9;
            _context.t0 = _context["catch"](1);
            setIsUnlinking(false);
            console.error(_context.t0);
          case 13:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[1, 9]]);
    }));
    return function handleDisconnect() {
      return _ref4.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/React.createElement("div", {
    className: styles["connector-container"]
  }, isConnected ? /*#__PURE__*/React.createElement("div", {
    className: styles["connector-connected"],
    "data-connected": isConnected
  }, icon, /*#__PURE__*/React.createElement("span", null, name), isUnlinking ? /*#__PURE__*/React.createElement("div", {
    className: styles.loader,
    style: {
      alignSelf: "flex-end",
      position: "absolute",
      right: "0.375rem"
    }
  }) : /*#__PURE__*/React.createElement("button", {
    className: styles["unlink-connector-button"],
    onClick: handleDisconnect,
    disabled: isUnlinking
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "2",
    d: "M17 22v-2m-8-5l6-6m-4-3l.463-.536a5 5 0 0 1 7.071 7.072L18 13m-5 5l-.397.534a5.07 5.07 0 0 1-7.127 0a4.97 4.97 0 0 1 0-7.071L6 11m14 6h2M2 7h2m3-5v2"
  })), "Unlink")) : /*#__PURE__*/React.createElement("button", {
    onClick: handleClick,
    className: styles["connector-button"],
    disabled: isConnected
  }, icon, /*#__PURE__*/React.createElement("span", null, name)));
};

/**
 * The LinkButton component.
 * A button that will open the modal to link or unlink a social account.
 * @param { { variant: ("default"|"icon"), social: ("twitter"|"spotify"|"discord"), theme: ("default"|"camp") } } props The props.
 * @returns { JSX.Element } The LinkButton component.
 */
var LinkButton = function LinkButton(_ref6) {
  var _ref6$variant = _ref6.variant,
    variant = _ref6$variant === void 0 ? "default" : _ref6$variant,
    social = _ref6.social,
    _ref6$theme = _ref6.theme,
    theme = _ref6$theme === void 0 ? "default" : _ref6$theme;
  var _useLinkModal = useLinkModal(),
    handleOpen = _useLinkModal.handleOpen;
  if (["default", "icon"].indexOf(variant) === -1) {
    throw new Error("Invalid variant, must be 'default' or 'icon'");
  }
  if (["twitter", "spotify", "discord", "tiktok", "telegram"].indexOf(social) === -1) {
    throw new Error("Invalid social, must be 'twitter', 'spotify', 'discord', 'tiktok', or 'telegram'");
  }
  if (["default", "camp"].indexOf(theme) === -1) {
    throw new Error("Invalid theme, must be 'default' or 'camp'");
  }
  var _useSocials = useSocials(),
    socials = _useSocials.data;
  var _useAuthState = useAuthState(),
    authenticated = _useAuthState.authenticated;
  var isLinked = socials && socials[social];
  var handleClick = function handleClick() {
    handleOpen(social);
  };
  var Icon = getIconBySocial(social);
  return /*#__PURE__*/React.createElement("button", {
    disabled: !authenticated,
    className: "".concat(buttonStyles["link-button-".concat(variant)], " \n        ").concat(theme === "default" ? buttonStyles[social] : "", "\n      "),
    onClick: handleClick
  }, variant === "icon" ? /*#__PURE__*/React.createElement("div", {
    className: buttonStyles["icon-container"]
  }, /*#__PURE__*/React.createElement(Icon, null), /*#__PURE__*/React.createElement("div", {
    className: "".concat(buttonStyles["camp-logo"], " ").concat(!isLinked ? buttonStyles["not-linked"] : "")
  }, /*#__PURE__*/React.createElement(CampIcon, null))) : /*#__PURE__*/React.createElement("div", {
    className: buttonStyles["button-container"]
  }, /*#__PURE__*/React.createElement("div", {
    className: "".concat(buttonStyles["camp-logo"], " ").concat(!isLinked ? buttonStyles["not-linked"] : "")
  }, /*#__PURE__*/React.createElement(CampIcon, null)), /*#__PURE__*/React.createElement("div", {
    className: buttonStyles["link-icon"]
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: "1.5",
    stroke: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
  }))), /*#__PURE__*/React.createElement("div", {
    className: buttonStyles["social-icon"]
  }, /*#__PURE__*/React.createElement(Icon, null))));
};

/**
 * The Auth modal component.
 * @param { { setIsVisible: function, wcProvider: object, loading: boolean, onlyWagmi: boolean, defaultProvider: object } } props The props.
 * @returns { JSX.Element } The Auth modal component.
 */
var AuthModal = function AuthModal(_ref) {
  var _wagmiConnectorClient;
  var setIsVisible = _ref.setIsVisible,
    wcProvider = _ref.wcProvider,
    loading = _ref.loading,
    onlyWagmi = _ref.onlyWagmi,
    defaultProvider = _ref.defaultProvider;
  var _useConnect = useConnect(),
    connect = _useConnect.connect;
  var _useProvider = useProvider(),
    setProvider = _useProvider.setProvider;
  var _useContext = useContext(CampContext),
    auth = _useContext.auth,
    wagmiAvailable = _useContext.wagmiAvailable;
  var _useState = useState(null),
    _useState2 = _slicedToArray(_useState, 2),
    customProvider = _useState2[0],
    setCustomProvider = _useState2[1];
  var providers = useProviders();
  var _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    customConnector = _useState4[0],
    setCustomConnector = _useState4[1];
  var _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    customAccount = _useState6[0],
    setCustomAccount = _useState6[1];
  var wagmiConnectorClient;
  var wagmiAccount;
  if (wagmiAvailable) {
    wagmiConnectorClient = useConnectorClient();
    wagmiAccount = useAccount();
  }
  var handleWalletConnect = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(_ref2) {
      var provider;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            provider = _ref2.provider;
            auth.setLoading(true);
            _context.prev = 2;
            if (!provider.connected) {
              _context.next = 6;
              break;
            }
            _context.next = 6;
            return provider.disconnect();
          case 6:
            _context.next = 8;
            return provider.connect();
          case 8:
            _context.next = 13;
            break;
          case 10:
            _context.prev = 10;
            _context.t0 = _context["catch"](2);
            auth.setLoading(false);
          case 13:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[2, 10]]);
    }));
    return function handleWalletConnect(_x) {
      return _ref3.apply(this, arguments);
    };
  }();
  useEffect(function () {
    if (wagmiAvailable && !defaultProvider) {
      setCustomConnector(wagmiConnectorClient);
      setCustomAccount(wagmiAccount);
    }
  }, [wagmiAvailable, defaultProvider, wagmiAccount, (_wagmiConnectorClient = wagmiConnectorClient) === null || _wagmiConnectorClient === void 0 ? void 0 : _wagmiConnectorClient.data]);
  useEffect(function () {
    if (defaultProvider && defaultProvider.provider && defaultProvider.info) {
      var addr = defaultProvider.provider.address;
      var acc = {
        connector: _objectSpread2(_objectSpread2({}, defaultProvider.info), {}, {
          icon: defaultProvider.info.icon || getIconByConnectorName(defaultProvider.info.name)
        }),
        address: addr
      };
      if (!addr) {
        defaultProvider.provider.request({
          method: "eth_requestAccounts"
        }).then(function (accounts) {
          setCustomAccount(_objectSpread2(_objectSpread2({}, acc), {}, {
            address: accounts[0]
          }));
        });
      } else {
        setCustomAccount(acc);
      }
      setCustomProvider(defaultProvider.provider);
    }
  }, [defaultProvider]);
  useEffect(function () {
    if (wagmiAvailable && customConnector) {
      var provider = customConnector.data;
      if (provider) {
        setCustomProvider(provider);
      }
    }
  }, [customConnector, customConnector === null || customConnector === void 0 ? void 0 : customConnector.data, wagmiAvailable, customProvider]);
  useEffect(function () {
    var doConnect = /*#__PURE__*/function () {
      var _ref4 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              handleConnect({
                provider: wcProvider,
                info: {
                  name: "WalletConnect"
                }
              });
            case 1:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      return function doConnect() {
        return _ref4.apply(this, arguments);
      };
    }();
    if (wcProvider) {
      wcProvider.on("connect", doConnect);
    }
    return function () {
      if (wcProvider) {
        wcProvider.off("connect", doConnect);
      }
    };
  }, [wcProvider]);
  var handleConnect = function handleConnect(provider) {
    var _provider$provider;
    if (provider) setProvider(provider);
    // necessary for appkit, as it doesn't seem to support the "eth_requestAccounts" method
    if (customAccount !== null && customAccount !== void 0 && customAccount.address && customProvider !== null && customProvider !== void 0 && customProvider.uid && (provider === null || provider === void 0 || (_provider$provider = provider.provider) === null || _provider$provider === void 0 ? void 0 : _provider$provider.uid) === (customProvider === null || customProvider === void 0 ? void 0 : customProvider.uid)) {
      auth.setWalletAddress(customAccount === null || customAccount === void 0 ? void 0 : customAccount.address);
    }
    connect();
  };
  return /*#__PURE__*/React.createElement("div", {
    className: styles.container
  }, /*#__PURE__*/React.createElement("div", {
    className: styles["close-button"],
    onClick: function onClick() {
      return setIsVisible(false);
    }
  }, /*#__PURE__*/React.createElement(CloseIcon, null)), /*#__PURE__*/React.createElement("div", {
    className: styles.header
  }, /*#__PURE__*/React.createElement("div", {
    className: styles["modal-icon"]
  }, /*#__PURE__*/React.createElement(CampIcon, null)), /*#__PURE__*/React.createElement("span", null, "Connect with Camp")), /*#__PURE__*/React.createElement("div", {
    className: "".concat(customAccount !== null && customAccount !== void 0 && customAccount.connector ? styles["big"] : "", " ").concat(styles["provider-list"])
  }, (customAccount === null || customAccount === void 0 ? void 0 : customAccount.connector) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ProviderButton, {
    provider: {
      provider: customProvider || window.ethereum,
      info: {
        name: customAccount.connector.name,
        icon: customAccount.connector.icon || getIconByConnectorName(customAccount.connector.name)
      }
    },
    label: formatAddress(customAccount.address),
    handleConnect: handleConnect,
    loading: loading
  }), (providers.length || wcProvider || window.ethereum) && !onlyWagmi && !(defaultProvider !== null && defaultProvider !== void 0 && defaultProvider.exclusive) && /*#__PURE__*/React.createElement("div", {
    className: styles["divider"]
  })), !onlyWagmi && !(defaultProvider !== null && defaultProvider !== void 0 && defaultProvider.exclusive) && providers.map(function (provider) {
    return /*#__PURE__*/React.createElement(ProviderButton, {
      provider: provider,
      handleConnect: handleConnect,
      loading: loading,
      key: provider.info.uuid
    });
  }), !onlyWagmi && !(defaultProvider !== null && defaultProvider !== void 0 && defaultProvider.exclusive) && wcProvider && /*#__PURE__*/React.createElement(ProviderButton, {
    provider: {
      provider: wcProvider,
      info: {
        name: "WalletConnect",
        icon: "data:image/svg+xml,%3Csvg fill='%233B99FC' role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4.913 7.519c3.915-3.831 10.26-3.831 14.174 0l.471.461a.483.483 0 0 1 0 .694l-1.611 1.577a.252.252 0 0 1-.354 0l-.649-.634c-2.73-2.673-7.157-2.673-9.887 0l-.694.68a.255.255 0 0 1-.355 0L4.397 8.719a.482.482 0 0 1 0-.693l.516-.507Zm17.506 3.263 1.434 1.404a.483.483 0 0 1 0 .694l-6.466 6.331a.508.508 0 0 1-.709 0l-4.588-4.493a.126.126 0 0 0-.178 0l-4.589 4.493a.508.508 0 0 1-.709 0L.147 12.88a.483.483 0 0 1 0-.694l1.434-1.404a.508.508 0 0 1 .709 0l4.589 4.493c.05.048.129.048.178 0l4.589-4.493a.508.508 0 0 1 .709 0l4.589 4.493c.05.048.128.048.178 0l4.589-4.493a.507.507 0 0 1 .708 0Z'/%3E%3C/svg%3E"
      }
    },
    handleConnect: handleWalletConnect,
    loading: loading
  }), !onlyWagmi && !(defaultProvider !== null && defaultProvider !== void 0 && defaultProvider.exclusive) && window.ethereum && /*#__PURE__*/React.createElement(ProviderButton, {
    provider: {
      provider: window.ethereum,
      info: {
        name: "Browser Wallet"
      }
    },
    label: "window.ethereum",
    handleConnect: handleConnect,
    loading: loading
  })), /*#__PURE__*/React.createElement("a", {
    href: "https://campnetwork.xyz",
    className: styles["footer-text"],
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Powered by Camp Network"));
};

/**
 * The CampModal component.
 * @param { { injectButton?: boolean, wcProjectId?: string, onlyWagmi?: boolean, defaultProvider?: object } } props The props.
 * @returns { JSX.Element } The CampModal component.
 */
var CampModal = function CampModal(_ref5) {
  var _ref5$injectButton = _ref5.injectButton,
    injectButton = _ref5$injectButton === void 0 ? true : _ref5$injectButton,
    wcProjectId = _ref5.wcProjectId,
    _ref5$onlyWagmi = _ref5.onlyWagmi,
    onlyWagmi = _ref5$onlyWagmi === void 0 ? false : _ref5$onlyWagmi,
    defaultProvider = _ref5.defaultProvider;
  var _useState7 = useState(false),
    _useState8 = _slicedToArray(_useState7, 2),
    isButtonDisabled = _useState8[0],
    setIsButtonDisabled = _useState8[1];
  var _useAuthState = useAuthState(),
    authenticated = _useAuthState.authenticated,
    loading = _useAuthState.loading;
  var _useContext2 = useContext(ModalContext),
    isVisible = _useContext2.isVisible,
    setIsVisible = _useContext2.setIsVisible;
  var _useContext3 = useContext(ModalContext),
    isLinkingVisible = _useContext3.isLinkingVisible;
  var _useProvider2 = useProvider(),
    provider = _useProvider2.provider;
  var providers = useProviders();
  var _useContext4 = useContext(CampContext),
    wagmiAvailable = _useContext4.wagmiAvailable;
  var customAccount;
  if (wagmiAvailable) {
    customAccount = useAccount();
  }
  var walletConnectProvider = wcProjectId ? useWalletConnectProvider(wcProjectId) : null;
  var handleModalButton = function handleModalButton() {
    setIsVisible(true);
  };
  useEffect(function () {
    if (authenticated) {
      if (isVisible) {
        setIsVisible(false);
      }
    }
  }, [authenticated]);

  // Cases where the button should be disabled
  useEffect(function () {
    var _customAccount, _customAccount2;
    var noProvider = !provider.provider;
    var noWagmiOrAccount = !wagmiAvailable || !((_customAccount = customAccount) !== null && _customAccount !== void 0 && _customAccount.isConnected);
    var noWalletConnectProvider = !walletConnectProvider;
    var noProviders = !providers.length;
    var onlyWagmiNoAccount = onlyWagmi && !((_customAccount2 = customAccount) !== null && _customAccount2 !== void 0 && _customAccount2.isConnected);
    var noDefaultProvider = !defaultProvider || !defaultProvider.provider;
    var defaultProviderExclusive = defaultProvider === null || defaultProvider === void 0 ? void 0 : defaultProvider.exclusive;
    var noAvailableProviders = noProvider && noWagmiOrAccount && noWalletConnectProvider && noProviders && noDefaultProvider;
    var shouldDisableButton = (noAvailableProviders || onlyWagmiNoAccount || noDefaultProvider && defaultProviderExclusive) && !authenticated;
    setIsButtonDisabled(shouldDisableButton);
  }, [provider, wagmiAvailable, customAccount, walletConnectProvider, providers, authenticated, defaultProvider]);
  return /*#__PURE__*/React.createElement(ClientOnly, null, /*#__PURE__*/React.createElement("div", null, injectButton && /*#__PURE__*/React.createElement(CampButton, {
    disabled: isButtonDisabled,
    onClick: handleModalButton,
    authenticated: authenticated
  }), /*#__PURE__*/React.createElement(ReactPortal, {
    wrapperId: "camp-modal-wrapper"
  }, isLinkingVisible && /*#__PURE__*/React.createElement(LinkingModal, null), isVisible && /*#__PURE__*/React.createElement("div", {
    className: styles.modal,
    onClick: function onClick(e) {
      if (e.target === e.currentTarget) {
        setIsVisible(false);
      }
    }
  }, authenticated ? /*#__PURE__*/React.createElement(MyCampModal, {
    wcProvider: walletConnectProvider
  }) : /*#__PURE__*/React.createElement(AuthModal, {
    setIsVisible: setIsVisible,
    wcProvider: walletConnectProvider,
    loading: loading,
    onlyWagmi: onlyWagmi,
    defaultProvider: defaultProvider
  })))));
};
var TikTokFlow = function TikTokFlow() {};
var TelegramFlow = function TelegramFlow() {};

/**
 * The BasicFlow component. Handles linking and unlinking of socials through redirecting to the appropriate OAuth flow.
 * @returns { JSX.Element } The BasicFlow component.
 */
var BasicFlow = function BasicFlow() {
  var _useContext5 = useContext(ModalContext),
    setIsLinkingVisible = _useContext5.setIsLinkingVisible,
    currentlyLinking = _useContext5.currentlyLinking;
  var _useSocials = useSocials(),
    socials = _useSocials.data,
    refetch = _useSocials.refetch,
    isSocialsLoading = _useSocials.isLoading;
  var _useContext6 = useContext(CampContext),
    auth = _useContext6.auth;
  var _useState9 = useState(false),
    _useState10 = _slicedToArray(_useState9, 2),
    isUnlinking = _useState10[0],
    setIsUnlinking = _useState10[1];
  var handleLink = /*#__PURE__*/function () {
    var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (!isSocialsLoading) {
              _context3.next = 2;
              break;
            }
            return _context3.abrupt("return");
          case 2:
            if (!socials[currentlyLinking]) {
              _context3.next = 20;
              break;
            }
            setIsUnlinking(true);
            _context3.prev = 4;
            _context3.next = 7;
            return auth["unlink".concat(capitalize(currentlyLinking))]();
          case 7:
            _context3.next = 15;
            break;
          case 9:
            _context3.prev = 9;
            _context3.t0 = _context3["catch"](4);
            setIsUnlinking(false);
            setIsLinkingVisible(false);
            console.error(_context3.t0);
            return _context3.abrupt("return");
          case 15:
            refetch();
            setIsLinkingVisible(false);
            setIsUnlinking(false);
            _context3.next = 29;
            break;
          case 20:
            _context3.prev = 20;
            auth["link".concat(capitalize(currentlyLinking))]();
            _context3.next = 29;
            break;
          case 24:
            _context3.prev = 24;
            _context3.t1 = _context3["catch"](20);
            setIsLinkingVisible(false);
            console.error(_context3.t1);
            return _context3.abrupt("return");
          case 29:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[4, 9], [20, 24]]);
    }));
    return function handleLink() {
      return _ref6.apply(this, arguments);
    };
  }();
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: styles["linking-text"]
  }, currentlyLinking && socials[currentlyLinking] ? /*#__PURE__*/React.createElement("div", null, "Your ", capitalize(currentlyLinking), " account is currently linked.") : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("b", null, window.location.host), " is requesting to link your", " ", capitalize(currentlyLinking), " account.")), /*#__PURE__*/React.createElement("button", {
    className: styles["linking-button"],
    onClick: handleLink,
    disabled: isUnlinking
  }, !isUnlinking ? currentlyLinking && socials[currentlyLinking] ? "Unlink" : "Link" : /*#__PURE__*/React.createElement("div", {
    className: styles.spinner
  })));
};
var LinkingModal = function LinkingModal() {
  var _useSocials2 = useSocials(),
    isSocialsLoading = _useSocials2.isLoading;
  var _useContext7 = useContext(ModalContext),
    setIsLinkingVisible = _useContext7.setIsLinkingVisible,
    currentlyLinking = _useContext7.currentlyLinking;
  var _useState11 = useState(null),
    _useState12 = _slicedToArray(_useState11, 2),
    flow = _useState12[0],
    setFlow = _useState12[1];
  useEffect(function () {
    if (["twitter", "discord", "spotify"].includes(currentlyLinking)) {
      setFlow("basic");
    } else if (currentlyLinking === "tiktok") {
      setFlow("tiktok");
    } else if (currentlyLinking === "telegram") {
      setFlow("telegram");
    }
  }, [currentlyLinking]);
  var Icon = getIconBySocial(currentlyLinking);
  return /*#__PURE__*/React.createElement("div", {
    className: styles.modal,
    onClick: function onClick(e) {
      if (e.target === e.currentTarget) {
        setIsLinkingVisible(false);
      }
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.container
  }, /*#__PURE__*/React.createElement("div", {
    className: styles["close-button"],
    onClick: function onClick() {
      return setIsLinkingVisible(false);
    }
  }, /*#__PURE__*/React.createElement(CloseIcon, null)), isSocialsLoading ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "4rem",
      marginBottom: "1rem"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: styles.spinner
  })) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: styles.header
  }, /*#__PURE__*/React.createElement("div", {
    className: styles["small-modal-icon"]
  }, /*#__PURE__*/React.createElement(Icon, null))), flow === "basic" && /*#__PURE__*/React.createElement(BasicFlow, null), flow === "tiktok" && /*#__PURE__*/React.createElement(TikTokFlow, null), flow === "telegram" && /*#__PURE__*/React.createElement(TelegramFlow, null)), /*#__PURE__*/React.createElement("a", {
    href: "https://campnetwork.xyz",
    className: styles["footer-text"],
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      marginTop: 0
    }
  }, "Powered by Camp Network")));
};

/**
 * The MyCampModal component.
 * @param { { wcProvider: object } } props The props.
 * @returns { JSX.Element } The MyCampModal component.
 */
var MyCampModal = function MyCampModal(_ref7) {
  var wcProvider = _ref7.wcProvider;
  var _useContext8 = useContext(CampContext),
    auth = _useContext8.auth;
  var _useContext9 = useContext(ModalContext),
    setIsVisible = _useContext9.setIsVisible;
  var _useConnect2 = useConnect(),
    disconnect = _useConnect2.disconnect;
  var _useSocials3 = useSocials(),
    socials = _useSocials3.data,
    loading = _useSocials3.loading,
    refetch = _useSocials3.refetch;
  var _useState13 = useState(true),
    _useState14 = _slicedToArray(_useState13, 2),
    isLoadingSocials = _useState14[0],
    setIsLoadingSocials = _useState14[1];
  var handleDisconnect = function handleDisconnect() {
    wcProvider === null || wcProvider === void 0 || wcProvider.disconnect();
    disconnect();
    setIsVisible(false);
  };
  useEffect(function () {
    if (socials) setIsLoadingSocials(false);
  }, [socials]);
  var connectedSocials = [{
    name: "Discord",
    link: auth.linkDiscord.bind(auth),
    unlink: auth.unlinkDiscord.bind(auth),
    isConnected: socials === null || socials === void 0 ? void 0 : socials.discord,
    icon: /*#__PURE__*/React.createElement(DiscordIcon, null)
  }, {
    name: "Twitter",
    link: auth.linkTwitter.bind(auth),
    unlink: auth.unlinkTwitter.bind(auth),
    isConnected: socials === null || socials === void 0 ? void 0 : socials.twitter,
    icon: /*#__PURE__*/React.createElement(TwitterIcon, null)
  }, {
    name: "Spotify",
    link: auth.linkSpotify.bind(auth),
    unlink: auth.unlinkSpotify.bind(auth),
    isConnected: socials === null || socials === void 0 ? void 0 : socials.spotify,
    icon: /*#__PURE__*/React.createElement(SpotifyIcon, null)
  }];
  var connected = connectedSocials.filter(function (social) {
    return social.isConnected;
  });
  var notConnected = connectedSocials.filter(function (social) {
    return !social.isConnected;
  });
  return /*#__PURE__*/React.createElement("div", {
    className: styles.container
  }, /*#__PURE__*/React.createElement("div", {
    className: styles["close-button"],
    onClick: function onClick() {
      return setIsVisible(false);
    }
  }, /*#__PURE__*/React.createElement(CloseIcon, null)), /*#__PURE__*/React.createElement("div", {
    className: styles.header
  }, /*#__PURE__*/React.createElement("span", null, "My Camp"), /*#__PURE__*/React.createElement("span", {
    className: styles["wallet-address"]
  }, formatAddress(auth.walletAddress))), /*#__PURE__*/React.createElement("div", {
    className: styles["socials-wrapper"]
  }, loading || isLoadingSocials ? /*#__PURE__*/React.createElement("div", {
    className: styles.spinner,
    style: {
      margin: "auto",
      marginTop: "6rem",
      marginBottom: "6rem"
    }
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: styles["socials-container"]
  }, /*#__PURE__*/React.createElement("h3", null, "Not Linked"), notConnected.map(function (social) {
    return /*#__PURE__*/React.createElement(ConnectorButton, {
      key: social.name,
      name: social.name,
      link: social.link,
      unlink: social.unlink,
      isConnected: social.isConnected,
      refetch: refetch,
      icon: social.icon
    });
  }), notConnected.length === 0 && /*#__PURE__*/React.createElement("span", {
    className: styles["no-socials"]
  }, "You've linked all your socials!")), /*#__PURE__*/React.createElement("div", {
    className: styles["socials-container"]
  }, /*#__PURE__*/React.createElement("h3", null, "Linked"), connected.map(function (social) {
    return /*#__PURE__*/React.createElement(ConnectorButton, {
      key: social.name,
      name: social.name,
      link: social.link,
      unlink: social.unlink,
      isConnected: social.isConnected,
      refetch: refetch,
      icon: social.icon
    });
  }), connected.length === 0 && /*#__PURE__*/React.createElement("span", {
    className: styles["no-socials"]
  }, "You have no socials linked.")))), /*#__PURE__*/React.createElement("button", {
    className: styles["disconnect-button"],
    onClick: handleDisconnect
  }, "Disconnect"), /*#__PURE__*/React.createElement("a", {
    href: "https://campnetwork.xyz",
    className: styles["footer-text"],
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      marginTop: 0
    }
  }, "Powered by Camp Network"));
};

/**
 * Returns the instance of the Auth class.
 * @returns { Auth } The instance of the Auth class.
 * @example
 */
var getAuthProperties = function getAuthProperties(auth) {
  var prototype = Object.getPrototypeOf(auth);
  var properties = Object.getOwnPropertyNames(prototype);
  var object = {};
  var _iterator = _createForOfIteratorHelper(properties),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var property = _step.value;
      if (typeof auth[property] === "function") {
        object[property] = auth[property].bind(auth);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return object;
};
var getAuthVariables = function getAuthVariables(auth) {
  var variables = Object.keys(auth);
  var object = {};
  for (var _i = 0, _variables = variables; _i < _variables.length; _i++) {
    var variable = _variables[_i];
    object[variable] = auth[variable];
  }
  return object;
};
var useAuth = function useAuth() {
  var _useContext = useContext(CampContext),
    auth = _useContext.auth;
  if (!auth) {
    return null;
  }
  var properties = getAuthProperties(auth);
  var variables = getAuthVariables(auth);
  return _objectSpread2(_objectSpread2({}, variables), properties);
};

/**
 * Returns the functions to link and unlink socials.
 * @returns { { linkTwitter: function, unlinkTwitter: function, linkDiscord: function, unlinkDiscord: function, linkSpotify: function, unlinkSpotify: function } } The functions to link and unlink socials.
 * @example
 * const { linkTwitter, unlinkTwitter, linkDiscord, unlinkDiscord, linkSpotify, unlinkSpotify } = useLinkSocials();
 * linkTwitter();
 */
var useLinkSocials = function useLinkSocials() {
  var _useContext2 = useContext(CampContext),
    auth = _useContext2.auth;
  if (!auth) {
    return {};
  }
  var prototype = Object.getPrototypeOf(auth);
  var linkingProps = Object.getOwnPropertyNames(prototype).filter(function (prop) {
    return prop.startsWith("link") || prop.startsWith("unlink");
  });
  var linkingFunctions = linkingProps.reduce(function (acc, prop) {
    acc[prop] = auth[prop].bind(auth);
    return acc;
  }, {});
  return linkingFunctions;
};

/**
 * Fetches the provider from the context and sets the provider in the auth instance.
 * @returns { { provider: { provider: string, info: { name: string } }, setProvider: function } } The provider and a function to set the provider.
 */
var useProvider = function useProvider() {
  var _auth$viem, _auth$viem2;
  var _useContext3 = useContext(CampContext),
    auth = _useContext3.auth;
  var _useState = useState({
      provider: (_auth$viem = auth.viem) === null || _auth$viem === void 0 ? void 0 : _auth$viem.transport,
      info: {
        name: (_auth$viem2 = auth.viem) === null || _auth$viem2 === void 0 || (_auth$viem2 = _auth$viem2.transport) === null || _auth$viem2 === void 0 ? void 0 : _auth$viem2.name
      }
    }),
    _useState2 = _slicedToArray(_useState, 2),
    provider = _useState2[0],
    setProvider = _useState2[1];
  useEffect(function () {
    auth.on("provider", function (_ref) {
      var provider = _ref.provider,
        info = _ref.info;
      setProvider({
        provider: provider,
        info: info
      });
    });
  }, [auth]);
  var authSetProvider = auth.setProvider.bind(auth);
  return {
    provider: provider,
    setProvider: authSetProvider
  };
};

/**
 * Returns the authenticated state and loading state.
 * @returns { { authenticated: boolean, loading: boolean } } The authenticated state and loading state.
 */
var useAuthState = function useAuthState() {
  var _useContext4 = useContext(CampContext),
    auth = _useContext4.auth;
  var _useState3 = useState(auth.isAuthenticated),
    _useState4 = _slicedToArray(_useState3, 2),
    authenticated = _useState4[0],
    setAuthenticated = _useState4[1];
  var _useState5 = useState(false),
    _useState6 = _slicedToArray(_useState5, 2),
    loading = _useState6[0],
    setLoading = _useState6[1];
  useEffect(function () {
    auth.on("state", function (state) {
      setAuthenticated(state === "authenticated");
      setLoading(state === "loading");
    });
  }, [auth]);
  return {
    authenticated: authenticated,
    loading: loading
  };
};

/**
 * Connects and disconnects the user.
 * @returns { { connect: function, disconnect: function } } The connect and disconnect functions.
 */
var useConnect = function useConnect() {
  var _useContext5 = useContext(CampContext),
    auth = _useContext5.auth;
  var connect = auth.connect.bind(auth);
  var disconnect = auth.disconnect.bind(auth);
  return {
    connect: connect,
    disconnect: disconnect
  };
};

/**
 * Returns the array of providers.
 * @returns { Array } The array of providers and the loading state.
 */
var useProviders = function useProviders() {
  return useSyncExternalStore(providerStore.subscribe, providerStore.value, providerStore.value);
};

/**
 * Returns the modal state and functions to open and close the modal.
 * @returns { { isOpen: boolean, openModal: function, closeModal: function } } The modal state and functions to open and close the modal.
 */
var useModal = function useModal() {
  var _useContext6 = useContext(ModalContext),
    isVisible = _useContext6.isVisible,
    setIsVisible = _useContext6.setIsVisible;
  var handleOpen = function handleOpen() {
    setIsVisible(true);
  };
  var handleClose = function handleClose() {
    setIsVisible(false);
  };
  return {
    isOpen: isVisible,
    openModal: handleOpen,
    closeModal: handleClose
  };
};
var useLinkModal = function useLinkModal() {
  var _useSocials = useSocials(),
    socials = _useSocials.data;
  var _useContext7 = useContext(ModalContext),
    isLinkingVisible = _useContext7.isLinkingVisible,
    setIsLinkingVisible = _useContext7.setIsLinkingVisible,
    setCurrentlyLinking = _useContext7.setCurrentlyLinking;
  var handleOpen = function handleOpen(social) {
    if (!socials) {
      console.error("User is not authenticated");
      return;
    }
    setCurrentlyLinking(social);
    setIsLinkingVisible(true);
  };
  var handleLink = function handleLink(social) {
    if (!socials) {
      console.error("User is not authenticated");
      return;
    }
    if (socials && !socials[social]) {
      setCurrentlyLinking(social);
      setIsLinkingVisible(true);
    } else {
      setIsLinkingVisible(false);
      console.warn("User already linked ".concat(social));
    }
  };
  var handleUnlink = function handleUnlink(social) {
    if (!socials) {
      console.error("User is not authenticated");
      return;
    }
    if (socials && socials[social]) {
      setCurrentlyLinking(social);
      setIsLinkingVisible(true);
    } else {
      setIsLinkingVisible(false);
      console.warn("User isn't linked to ".concat(social));
    }
  };
  var handleClose = function handleClose() {
    setIsLinkingVisible(false);
  };
  return {
    isLinkingOpen: isLinkingVisible,
    openTwitterModal: function openTwitterModal() {
      return handleOpen("twitter");
    },
    openDiscordModal: function openDiscordModal() {
      return handleOpen("discord");
    },
    openSpotifyModal: function openSpotifyModal() {
      return handleOpen("spotify");
    },
    linkTwitter: function linkTwitter() {
      return handleLink("twitter");
    },
    linkDiscord: function linkDiscord() {
      return handleLink("discord");
    },
    linkSpotify: function linkSpotify() {
      return handleLink("spotify");
    },
    unlinkTwitter: function unlinkTwitter() {
      return handleUnlink("twitter");
    },
    unlinkDiscord: function unlinkDiscord() {
      return handleUnlink("discord");
    },
    unlinkSpotify: function unlinkSpotify() {
      return handleUnlink("spotify");
    },
    closeModal: handleClose,
    handleOpen: handleOpen
  };
};

/**
 * Fetches the socials linked to the user.
 * @returns { { data: Array, error: Error, isLoading: boolean, refetch: () => {} } } The socials linked to the user.
 */
var useSocials = function useSocials() {
  var _useContext8 = useContext(SocialsContext),
    query = _useContext8.query;
  return query;
};

export { CampContext, CampModal, CampProvider, LinkButton, ModalContext, MyCampModal, useAuth, useAuthState, useConnect, useLinkModal, useLinkSocials, useModal, useProvider, useProviders, useSocials };
