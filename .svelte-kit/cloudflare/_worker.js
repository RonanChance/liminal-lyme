var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key2 of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key2) && key2 !== except)
        __defProp(to, key2, { get: () => from[key2], enumerable: !(desc = __getOwnPropDesc(from, key2)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// .svelte-kit/output/server/chunks/ssr.js
function noop() {
}
function run(fn) {
  return fn();
}
function blank_object() {
  return /* @__PURE__ */ Object.create(null);
}
function run_all(fns) {
  fns.forEach(run);
}
function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === "object" || typeof a === "function";
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    for (const callback of callbacks) {
      callback(void 0);
    }
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function compute_rest_props(props, keys) {
  const rest = {};
  keys = new Set(keys);
  for (const k in props)
    if (!keys.has(k) && k[0] !== "$")
      rest[k] = props[k];
  return rest;
}
function set_current_component(component8) {
  current_component = component8;
}
function get_current_component() {
  if (!current_component)
    throw new Error("Function called outside component initialization");
  return current_component;
}
function setContext(key2, context) {
  get_current_component().$$.context.set(key2, context);
  return context;
}
function getContext(key2) {
  return get_current_component().$$.context.get(key2);
}
function spread(args, attrs_to_add) {
  const attributes = Object.assign({}, ...args);
  if (attrs_to_add) {
    const classes_to_add = attrs_to_add.classes;
    const styles_to_add = attrs_to_add.styles;
    if (classes_to_add) {
      if (attributes.class == null) {
        attributes.class = classes_to_add;
      } else {
        attributes.class += " " + classes_to_add;
      }
    }
    if (styles_to_add) {
      if (attributes.style == null) {
        attributes.style = style_object_to_string(styles_to_add);
      } else {
        attributes.style = style_object_to_string(
          merge_ssr_styles(attributes.style, styles_to_add)
        );
      }
    }
  }
  let str2 = "";
  Object.keys(attributes).forEach((name) => {
    if (invalid_attribute_name_character.test(name))
      return;
    const value = attributes[name];
    if (value === true)
      str2 += " " + name;
    else if (boolean_attributes.has(name.toLowerCase())) {
      if (value)
        str2 += " " + name;
    } else if (value != null) {
      str2 += ` ${name}="${value}"`;
    }
  });
  return str2;
}
function merge_ssr_styles(style_attribute, style_directive) {
  const style_object = {};
  for (const individual_style of style_attribute.split(";")) {
    const colon_index = individual_style.indexOf(":");
    const name = individual_style.slice(0, colon_index).trim();
    const value = individual_style.slice(colon_index + 1).trim();
    if (!name)
      continue;
    style_object[name] = value;
  }
  for (const name in style_directive) {
    const value = style_directive[name];
    if (value) {
      style_object[name] = value;
    } else {
      delete style_object[name];
    }
  }
  return style_object;
}
function escape(value, is_attr = false) {
  const str2 = String(value);
  const pattern2 = is_attr ? ATTR_REGEX : CONTENT_REGEX;
  pattern2.lastIndex = 0;
  let escaped2 = "";
  let last = 0;
  while (pattern2.test(str2)) {
    const i2 = pattern2.lastIndex - 1;
    const ch = str2[i2];
    escaped2 += str2.substring(last, i2) + (ch === "&" ? "&amp;" : ch === '"' ? "&quot;" : "&lt;");
    last = i2 + 1;
  }
  return escaped2 + str2.substring(last);
}
function escape_attribute_value(value) {
  const should_escape = typeof value === "string" || value && typeof value === "object";
  return should_escape ? escape(value, true) : value;
}
function escape_object(obj) {
  const result = {};
  for (const key2 in obj) {
    result[key2] = escape_attribute_value(obj[key2]);
  }
  return result;
}
function validate_component(component8, name) {
  if (!component8 || !component8.$$render) {
    if (name === "svelte:component")
      name += " this={...}";
    throw new Error(
      `<${name}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules. Otherwise you may need to fix a <${name}>.`
    );
  }
  return component8;
}
function create_ssr_component(fn) {
  function $$render(result, props, bindings, slots, context) {
    const parent_component = current_component;
    const $$ = {
      on_destroy,
      context: new Map(context || (parent_component ? parent_component.$$.context : [])),
      // these will be immediately discarded
      on_mount: [],
      before_update: [],
      after_update: [],
      callbacks: blank_object()
    };
    set_current_component({ $$ });
    const html = fn(result, props, bindings, slots);
    set_current_component(parent_component);
    return html;
  }
  return {
    render: (props = {}, { $$slots = {}, context = /* @__PURE__ */ new Map() } = {}) => {
      on_destroy = [];
      const result = { title: "", head: "", css: /* @__PURE__ */ new Set() };
      const html = $$render(result, props, {}, $$slots, context);
      run_all(on_destroy);
      return {
        html,
        css: {
          code: Array.from(result.css).map((css6) => css6.code).join("\n"),
          map: null
          // TODO
        },
        head: result.title + result.head
      };
    },
    $$render
  };
}
function add_attribute(name, value, boolean) {
  if (value == null || boolean && !value)
    return "";
  const assignment = boolean && value === true ? "" : `="${escape(value, true)}"`;
  return ` ${name}${assignment}`;
}
function style_object_to_string(style_object) {
  return Object.keys(style_object).filter((key2) => style_object[key2]).map((key2) => `${key2}: ${escape_attribute_value(style_object[key2])};`).join(" ");
}
var current_component, _boolean_attributes, boolean_attributes, invalid_attribute_name_character, ATTR_REGEX, CONTENT_REGEX, missing_component, on_destroy;
var init_ssr = __esm({
  ".svelte-kit/output/server/chunks/ssr.js"() {
    _boolean_attributes = /** @type {const} */
    [
      "allowfullscreen",
      "allowpaymentrequest",
      "async",
      "autofocus",
      "autoplay",
      "checked",
      "controls",
      "default",
      "defer",
      "disabled",
      "formnovalidate",
      "hidden",
      "inert",
      "ismap",
      "loop",
      "multiple",
      "muted",
      "nomodule",
      "novalidate",
      "open",
      "playsinline",
      "readonly",
      "required",
      "reversed",
      "selected"
    ];
    boolean_attributes = /* @__PURE__ */ new Set([..._boolean_attributes]);
    invalid_attribute_name_character = /[\s'">/=\u{FDD0}-\u{FDEF}\u{FFFE}\u{FFFF}\u{1FFFE}\u{1FFFF}\u{2FFFE}\u{2FFFF}\u{3FFFE}\u{3FFFF}\u{4FFFE}\u{4FFFF}\u{5FFFE}\u{5FFFF}\u{6FFFE}\u{6FFFF}\u{7FFFE}\u{7FFFF}\u{8FFFE}\u{8FFFF}\u{9FFFE}\u{9FFFF}\u{AFFFE}\u{AFFFF}\u{BFFFE}\u{BFFFF}\u{CFFFE}\u{CFFFF}\u{DFFFE}\u{DFFFF}\u{EFFFE}\u{EFFFF}\u{FFFFE}\u{FFFFF}\u{10FFFE}\u{10FFFF}]/u;
    ATTR_REGEX = /[&"]/g;
    CONTENT_REGEX = /[&<]/g;
    missing_component = {
      $$render: () => ""
    };
  }
});

// node_modules/pocketbase/dist/pocketbase.es.mjs
function __awaiter(e3, t3, i2, s4) {
  return new (i2 || (i2 = Promise))(function(n2, o2) {
    function fulfilled(e4) {
      try {
        step(s4.next(e4));
      } catch (e5) {
        o2(e5);
      }
    }
    function rejected(e4) {
      try {
        step(s4.throw(e4));
      } catch (e5) {
        o2(e5);
      }
    }
    function step(e4) {
      e4.done ? n2(e4.value) : function adopt(e5) {
        return e5 instanceof i2 ? e5 : new i2(function(t4) {
          t4(e5);
        });
      }(e4.value).then(fulfilled, rejected);
    }
    step((s4 = s4.apply(e3, t3 || [])).next());
  });
}
function cookieParse(e3, t3) {
  const i2 = {};
  if ("string" != typeof e3)
    return i2;
  const s4 = Object.assign({}, t3 || {}).decode || defaultDecode;
  let n2 = 0;
  for (; n2 < e3.length; ) {
    const t4 = e3.indexOf("=", n2);
    if (-1 === t4)
      break;
    let o2 = e3.indexOf(";", n2);
    if (-1 === o2)
      o2 = e3.length;
    else if (o2 < t4) {
      n2 = e3.lastIndexOf(";", t4 - 1) + 1;
      continue;
    }
    const r3 = e3.slice(n2, t4).trim();
    if (void 0 === i2[r3]) {
      let n3 = e3.slice(t4 + 1, o2).trim();
      34 === n3.charCodeAt(0) && (n3 = n3.slice(1, -1));
      try {
        i2[r3] = s4(n3);
      } catch (e4) {
        i2[r3] = n3;
      }
    }
    n2 = o2 + 1;
  }
  return i2;
}
function cookieSerialize(t3, i2, s4) {
  const n2 = Object.assign({}, s4 || {}), o2 = n2.encode || defaultEncode;
  if (!e.test(t3))
    throw new TypeError("argument name is invalid");
  const r3 = o2(i2);
  if (r3 && !e.test(r3))
    throw new TypeError("argument val is invalid");
  let a = t3 + "=" + r3;
  if (null != n2.maxAge) {
    const e3 = n2.maxAge - 0;
    if (isNaN(e3) || !isFinite(e3))
      throw new TypeError("option maxAge is invalid");
    a += "; Max-Age=" + Math.floor(e3);
  }
  if (n2.domain) {
    if (!e.test(n2.domain))
      throw new TypeError("option domain is invalid");
    a += "; Domain=" + n2.domain;
  }
  if (n2.path) {
    if (!e.test(n2.path))
      throw new TypeError("option path is invalid");
    a += "; Path=" + n2.path;
  }
  if (n2.expires) {
    if (!function isDate(e3) {
      return "[object Date]" === Object.prototype.toString.call(e3) || e3 instanceof Date;
    }(n2.expires) || isNaN(n2.expires.valueOf()))
      throw new TypeError("option expires is invalid");
    a += "; Expires=" + n2.expires.toUTCString();
  }
  if (n2.httpOnly && (a += "; HttpOnly"), n2.secure && (a += "; Secure"), n2.priority) {
    switch ("string" == typeof n2.priority ? n2.priority.toLowerCase() : n2.priority) {
      case "low":
        a += "; Priority=Low";
        break;
      case "medium":
        a += "; Priority=Medium";
        break;
      case "high":
        a += "; Priority=High";
        break;
      default:
        throw new TypeError("option priority is invalid");
    }
  }
  if (n2.sameSite) {
    switch ("string" == typeof n2.sameSite ? n2.sameSite.toLowerCase() : n2.sameSite) {
      case true:
        a += "; SameSite=Strict";
        break;
      case "lax":
        a += "; SameSite=Lax";
        break;
      case "strict":
        a += "; SameSite=Strict";
        break;
      case "none":
        a += "; SameSite=None";
        break;
      default:
        throw new TypeError("option sameSite is invalid");
    }
  }
  return a;
}
function defaultDecode(e3) {
  return -1 !== e3.indexOf("%") ? decodeURIComponent(e3) : e3;
}
function defaultEncode(e3) {
  return encodeURIComponent(e3);
}
function getTokenPayload(e3) {
  if (e3)
    try {
      const i2 = decodeURIComponent(t(e3.split(".")[1]).split("").map(function(e4) {
        return "%" + ("00" + e4.charCodeAt(0).toString(16)).slice(-2);
      }).join(""));
      return JSON.parse(i2) || {};
    } catch (e4) {
    }
  return {};
}
function isTokenExpired(e3, t3 = 0) {
  let i2 = getTokenPayload(e3);
  return !(Object.keys(i2).length > 0 && (!i2.exp || i2.exp - t3 > Date.now() / 1e3));
}
function normalizeLegacyOptionsArgs(e3, t3, i2, s4) {
  const n2 = void 0 !== s4;
  return n2 || void 0 !== i2 ? n2 ? (console.warn(e3), t3.body = Object.assign({}, t3.body, i2), t3.query = Object.assign({}, t3.query, s4), t3) : Object.assign(t3, i2) : t3;
}
function resetAutoRefresh(e3) {
  var t3, i2;
  null === (i2 = (t3 = e3)._resetAutoRefresh) || void 0 === i2 || i2.call(t3);
}
function openBrowserPopup(e3) {
  if ("undefined" == typeof window || !(null === window || void 0 === window ? void 0 : window.open))
    throw new ClientResponseError(new Error("Not in a browser context - please pass a custom urlCallback function."));
  let t3 = 1024, i2 = 768, s4 = window.innerWidth, n2 = window.innerHeight;
  t3 = t3 > s4 ? s4 : t3, i2 = i2 > n2 ? n2 : i2;
  let o2 = s4 / 2 - t3 / 2, r3 = n2 / 2 - i2 / 2;
  return window.open(e3, "popup_window", "width=" + t3 + ",height=" + i2 + ",top=" + r3 + ",left=" + o2 + ",resizable,menubar=no");
}
var ClientResponseError, e, t, i, BaseAuthStore, LocalAuthStore, BaseService, SettingsService, CrudService, AdminService, RealtimeService, RecordService, CollectionService, LogService, HealthService, FileService, BackupService, s, Client;
var init_pocketbase_es = __esm({
  "node_modules/pocketbase/dist/pocketbase.es.mjs"() {
    ClientResponseError = class _ClientResponseError extends Error {
      constructor(e3) {
        var t3, i2, s4, n2;
        super("ClientResponseError"), this.url = "", this.status = 0, this.response = {}, this.isAbort = false, this.originalError = null, Object.setPrototypeOf(this, _ClientResponseError.prototype), null !== e3 && "object" == typeof e3 && (this.url = "string" == typeof e3.url ? e3.url : "", this.status = "number" == typeof e3.status ? e3.status : 0, this.isAbort = !!e3.isAbort, this.originalError = e3.originalError, null !== e3.response && "object" == typeof e3.response ? this.response = e3.response : null !== e3.data && "object" == typeof e3.data ? this.response = e3.data : this.response = {}), this.originalError || e3 instanceof _ClientResponseError || (this.originalError = e3), "undefined" != typeof DOMException && e3 instanceof DOMException && (this.isAbort = true), this.name = "ClientResponseError " + this.status, this.message = null === (t3 = this.response) || void 0 === t3 ? void 0 : t3.message, this.message || (this.isAbort ? this.message = "The request was autocancelled. You can find more info in https://github.com/pocketbase/js-sdk#auto-cancellation." : (null === (n2 = null === (s4 = null === (i2 = this.originalError) || void 0 === i2 ? void 0 : i2.cause) || void 0 === s4 ? void 0 : s4.message) || void 0 === n2 ? void 0 : n2.includes("ECONNREFUSED ::1")) ? this.message = "Failed to connect to the PocketBase server. Try changing the SDK URL from localhost to 127.0.0.1 (https://github.com/pocketbase/js-sdk/issues/21)." : this.message = "Something went wrong while processing your request.");
      }
      get data() {
        return this.response;
      }
      toJSON() {
        return Object.assign({}, this);
      }
    };
    e = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
    t = "function" == typeof atob ? atob : (e3) => {
      let t3 = String(e3).replace(/=+$/, "");
      if (t3.length % 4 == 1)
        throw new Error("'atob' failed: The string to be decoded is not correctly encoded.");
      for (var i2, s4, n2 = 0, o2 = 0, r3 = ""; s4 = t3.charAt(o2++); ~s4 && (i2 = n2 % 4 ? 64 * i2 + s4 : s4, n2++ % 4) ? r3 += String.fromCharCode(255 & i2 >> (-2 * n2 & 6)) : 0)
        s4 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(s4);
      return r3;
    };
    i = "pb_auth";
    BaseAuthStore = class {
      constructor() {
        this.baseToken = "", this.baseModel = null, this._onChangeCallbacks = [];
      }
      get token() {
        return this.baseToken;
      }
      get model() {
        return this.baseModel;
      }
      get isValid() {
        return !isTokenExpired(this.token);
      }
      get isAdmin() {
        return "admin" === getTokenPayload(this.token).type;
      }
      get isAuthRecord() {
        return "authRecord" === getTokenPayload(this.token).type;
      }
      save(e3, t3) {
        this.baseToken = e3 || "", this.baseModel = t3 || null, this.triggerChange();
      }
      clear() {
        this.baseToken = "", this.baseModel = null, this.triggerChange();
      }
      loadFromCookie(e3, t3 = i) {
        const s4 = cookieParse(e3 || "")[t3] || "";
        let n2 = {};
        try {
          n2 = JSON.parse(s4), (null === typeof n2 || "object" != typeof n2 || Array.isArray(n2)) && (n2 = {});
        } catch (e4) {
        }
        this.save(n2.token || "", n2.model || null);
      }
      exportToCookie(e3, t3 = i) {
        var s4, n2;
        const o2 = { secure: true, sameSite: true, httpOnly: true, path: "/" }, r3 = getTokenPayload(this.token);
        (null == r3 ? void 0 : r3.exp) ? o2.expires = new Date(1e3 * r3.exp) : o2.expires = /* @__PURE__ */ new Date("1970-01-01"), e3 = Object.assign({}, o2, e3);
        const a = { token: this.token, model: this.model ? JSON.parse(JSON.stringify(this.model)) : null };
        let l = cookieSerialize(t3, JSON.stringify(a), e3);
        const c2 = "undefined" != typeof Blob ? new Blob([l]).size : l.length;
        if (a.model && c2 > 4096) {
          a.model = { id: null === (s4 = null == a ? void 0 : a.model) || void 0 === s4 ? void 0 : s4.id, email: null === (n2 = null == a ? void 0 : a.model) || void 0 === n2 ? void 0 : n2.email };
          const i2 = ["collectionId", "username", "verified"];
          for (const e4 in this.model)
            i2.includes(e4) && (a.model[e4] = this.model[e4]);
          l = cookieSerialize(t3, JSON.stringify(a), e3);
        }
        return l;
      }
      onChange(e3, t3 = false) {
        return this._onChangeCallbacks.push(e3), t3 && e3(this.token, this.model), () => {
          for (let t4 = this._onChangeCallbacks.length - 1; t4 >= 0; t4--)
            if (this._onChangeCallbacks[t4] == e3)
              return delete this._onChangeCallbacks[t4], void this._onChangeCallbacks.splice(t4, 1);
        };
      }
      triggerChange() {
        for (const e3 of this._onChangeCallbacks)
          e3 && e3(this.token, this.model);
      }
    };
    LocalAuthStore = class extends BaseAuthStore {
      constructor(e3 = "pocketbase_auth") {
        super(), this.storageFallback = {}, this.storageKey = e3, this._bindStorageEvent();
      }
      get token() {
        return (this._storageGet(this.storageKey) || {}).token || "";
      }
      get model() {
        return (this._storageGet(this.storageKey) || {}).model || null;
      }
      save(e3, t3) {
        this._storageSet(this.storageKey, { token: e3, model: t3 }), super.save(e3, t3);
      }
      clear() {
        this._storageRemove(this.storageKey), super.clear();
      }
      _storageGet(e3) {
        if ("undefined" != typeof window && (null === window || void 0 === window ? void 0 : window.localStorage)) {
          const t3 = window.localStorage.getItem(e3) || "";
          try {
            return JSON.parse(t3);
          } catch (e4) {
            return t3;
          }
        }
        return this.storageFallback[e3];
      }
      _storageSet(e3, t3) {
        if ("undefined" != typeof window && (null === window || void 0 === window ? void 0 : window.localStorage)) {
          let i2 = t3;
          "string" != typeof t3 && (i2 = JSON.stringify(t3)), window.localStorage.setItem(e3, i2);
        } else
          this.storageFallback[e3] = t3;
      }
      _storageRemove(e3) {
        var t3;
        "undefined" != typeof window && (null === window || void 0 === window ? void 0 : window.localStorage) && (null === (t3 = window.localStorage) || void 0 === t3 || t3.removeItem(e3)), delete this.storageFallback[e3];
      }
      _bindStorageEvent() {
        "undefined" != typeof window && (null === window || void 0 === window ? void 0 : window.localStorage) && window.addEventListener && window.addEventListener("storage", (e3) => {
          if (e3.key != this.storageKey)
            return;
          const t3 = this._storageGet(this.storageKey) || {};
          super.save(t3.token || "", t3.model || null);
        });
      }
    };
    BaseService = class {
      constructor(e3) {
        this.client = e3;
      }
    };
    SettingsService = class extends BaseService {
      getAll(e3) {
        return e3 = Object.assign({ method: "GET" }, e3), this.client.send("/api/settings", e3);
      }
      update(e3, t3) {
        return t3 = Object.assign({ method: "PATCH", body: e3 }, t3), this.client.send("/api/settings", t3);
      }
      testS3(e3 = "storage", t3) {
        return t3 = Object.assign({ method: "POST", body: { filesystem: e3 } }, t3), this.client.send("/api/settings/test/s3", t3).then(() => true);
      }
      testEmail(e3, t3, i2) {
        return i2 = Object.assign({ method: "POST", body: { email: e3, template: t3 } }, i2), this.client.send("/api/settings/test/email", i2).then(() => true);
      }
      generateAppleClientSecret(e3, t3, i2, s4, n2, o2) {
        return o2 = Object.assign({ method: "POST", body: { clientId: e3, teamId: t3, keyId: i2, privateKey: s4, duration: n2 } }, o2), this.client.send("/api/settings/apple/generate-client-secret", o2);
      }
    };
    CrudService = class extends BaseService {
      decode(e3) {
        return e3;
      }
      getFullList(e3, t3) {
        if ("number" == typeof e3)
          return this._getFullList(e3, t3);
        let i2 = 500;
        return (t3 = Object.assign({}, e3, t3)).batch && (i2 = t3.batch, delete t3.batch), this._getFullList(i2, t3);
      }
      getList(e3 = 1, t3 = 30, i2) {
        return (i2 = Object.assign({ method: "GET" }, i2)).query = Object.assign({ page: e3, perPage: t3 }, i2.query), this.client.send(this.baseCrudPath, i2).then((e4) => {
          var t4;
          return e4.items = (null === (t4 = e4.items) || void 0 === t4 ? void 0 : t4.map((e5) => this.decode(e5))) || [], e4;
        });
      }
      getFirstListItem(e3, t3) {
        return (t3 = Object.assign({ requestKey: "one_by_filter_" + this.baseCrudPath + "_" + e3 }, t3)).query = Object.assign({ filter: e3, skipTotal: 1 }, t3.query), this.getList(1, 1, t3).then((e4) => {
          var t4;
          if (!(null === (t4 = null == e4 ? void 0 : e4.items) || void 0 === t4 ? void 0 : t4.length))
            throw new ClientResponseError({ status: 404, data: { code: 404, message: "The requested resource wasn't found.", data: {} } });
          return e4.items[0];
        });
      }
      getOne(e3, t3) {
        return t3 = Object.assign({ method: "GET" }, t3), this.client.send(this.baseCrudPath + "/" + encodeURIComponent(e3), t3).then((e4) => this.decode(e4));
      }
      create(e3, t3) {
        return t3 = Object.assign({ method: "POST", body: e3 }, t3), this.client.send(this.baseCrudPath, t3).then((e4) => this.decode(e4));
      }
      update(e3, t3, i2) {
        return i2 = Object.assign({ method: "PATCH", body: t3 }, i2), this.client.send(this.baseCrudPath + "/" + encodeURIComponent(e3), i2).then((e4) => this.decode(e4));
      }
      delete(e3, t3) {
        return t3 = Object.assign({ method: "DELETE" }, t3), this.client.send(this.baseCrudPath + "/" + encodeURIComponent(e3), t3).then(() => true);
      }
      _getFullList(e3 = 500, t3) {
        (t3 = t3 || {}).query = Object.assign({ skipTotal: 1 }, t3.query);
        let i2 = [], request = (s4) => __awaiter(this, void 0, void 0, function* () {
          return this.getList(s4, e3 || 500, t3).then((e4) => {
            const t4 = e4.items;
            return i2 = i2.concat(t4), t4.length == e4.perPage ? request(s4 + 1) : i2;
          });
        });
        return request(1);
      }
    };
    AdminService = class extends CrudService {
      get baseCrudPath() {
        return "/api/admins";
      }
      update(e3, t3, i2) {
        return super.update(e3, t3, i2).then((e4) => {
          var t4, i3;
          return (null === (t4 = this.client.authStore.model) || void 0 === t4 ? void 0 : t4.id) === e4.id && void 0 === (null === (i3 = this.client.authStore.model) || void 0 === i3 ? void 0 : i3.collectionId) && this.client.authStore.save(this.client.authStore.token, e4), e4;
        });
      }
      delete(e3, t3) {
        return super.delete(e3, t3).then((t4) => {
          var i2, s4;
          return t4 && (null === (i2 = this.client.authStore.model) || void 0 === i2 ? void 0 : i2.id) === e3 && void 0 === (null === (s4 = this.client.authStore.model) || void 0 === s4 ? void 0 : s4.collectionId) && this.client.authStore.clear(), t4;
        });
      }
      authResponse(e3) {
        const t3 = this.decode((null == e3 ? void 0 : e3.admin) || {});
        return (null == e3 ? void 0 : e3.token) && (null == e3 ? void 0 : e3.admin) && this.client.authStore.save(e3.token, t3), Object.assign({}, e3, { token: (null == e3 ? void 0 : e3.token) || "", admin: t3 });
      }
      authWithPassword(e3, t3, i2, s4) {
        return __awaiter(this, void 0, void 0, function* () {
          let n2 = { method: "POST", body: { identity: e3, password: t3 } };
          n2 = normalizeLegacyOptionsArgs("This form of authWithPassword(email, pass, body?, query?) is deprecated. Consider replacing it with authWithPassword(email, pass, options?).", n2, i2, s4);
          const o2 = n2.autoRefreshThreshold;
          delete n2.autoRefreshThreshold, n2.autoRefresh || resetAutoRefresh(this.client);
          let r3 = yield this.client.send(this.baseCrudPath + "/auth-with-password", n2);
          return r3 = this.authResponse(r3), o2 && function registerAutoRefresh(e4, t4, i3, s5) {
            resetAutoRefresh(e4);
            const n3 = e4.beforeSend, o3 = e4.authStore.model, r4 = e4.authStore.onChange((t5, i4) => {
              (!t5 || (null == i4 ? void 0 : i4.id) != (null == o3 ? void 0 : o3.id) || ((null == i4 ? void 0 : i4.collectionId) || (null == o3 ? void 0 : o3.collectionId)) && (null == i4 ? void 0 : i4.collectionId) != (null == o3 ? void 0 : o3.collectionId)) && resetAutoRefresh(e4);
            });
            e4._resetAutoRefresh = function() {
              r4(), e4.beforeSend = n3, delete e4._resetAutoRefresh;
            }, e4.beforeSend = (o4, r5) => __awaiter(this, void 0, void 0, function* () {
              var a;
              const l = e4.authStore.token;
              if (null === (a = r5.query) || void 0 === a ? void 0 : a.autoRefresh)
                return n3 ? n3(o4, r5) : { url: o4, sendOptions: r5 };
              let c2 = e4.authStore.isValid;
              if (c2 && isTokenExpired(e4.authStore.token, t4))
                try {
                  yield i3();
                } catch (e5) {
                  c2 = false;
                }
              c2 || (yield s5());
              const d = r5.headers || {};
              for (let t5 in d)
                if ("authorization" == t5.toLowerCase() && l == d[t5] && e4.authStore.token) {
                  d[t5] = e4.authStore.token;
                  break;
                }
              return r5.headers = d, n3 ? n3(o4, r5) : { url: o4, sendOptions: r5 };
            });
          }(this.client, o2, () => this.authRefresh({ autoRefresh: true }), () => this.authWithPassword(e3, t3, Object.assign({ autoRefresh: true }, n2))), r3;
        });
      }
      authRefresh(e3, t3) {
        let i2 = { method: "POST" };
        return i2 = normalizeLegacyOptionsArgs("This form of authRefresh(body?, query?) is deprecated. Consider replacing it with authRefresh(options?).", i2, e3, t3), this.client.send(this.baseCrudPath + "/auth-refresh", i2).then(this.authResponse.bind(this));
      }
      requestPasswordReset(e3, t3, i2) {
        let s4 = { method: "POST", body: { email: e3 } };
        return s4 = normalizeLegacyOptionsArgs("This form of requestPasswordReset(email, body?, query?) is deprecated. Consider replacing it with requestPasswordReset(email, options?).", s4, t3, i2), this.client.send(this.baseCrudPath + "/request-password-reset", s4).then(() => true);
      }
      confirmPasswordReset(e3, t3, i2, s4, n2) {
        let o2 = { method: "POST", body: { token: e3, password: t3, passwordConfirm: i2 } };
        return o2 = normalizeLegacyOptionsArgs("This form of confirmPasswordReset(resetToken, password, passwordConfirm, body?, query?) is deprecated. Consider replacing it with confirmPasswordReset(resetToken, password, passwordConfirm, options?).", o2, s4, n2), this.client.send(this.baseCrudPath + "/confirm-password-reset", o2).then(() => true);
      }
    };
    RealtimeService = class extends BaseService {
      constructor() {
        super(...arguments), this.clientId = "", this.eventSource = null, this.subscriptions = {}, this.lastSentTopics = [], this.maxConnectTimeout = 15e3, this.reconnectAttempts = 0, this.maxReconnectAttempts = 1 / 0, this.predefinedReconnectIntervals = [200, 300, 500, 1e3, 1200, 1500, 2e3], this.pendingConnects = [];
      }
      get isConnected() {
        return !!this.eventSource && !!this.clientId && !this.pendingConnects.length;
      }
      subscribe(e3, t3) {
        var i2;
        return __awaiter(this, void 0, void 0, function* () {
          if (!e3)
            throw new Error("topic must be set.");
          const listener = function(e4) {
            const i3 = e4;
            let s4;
            try {
              s4 = JSON.parse(null == i3 ? void 0 : i3.data);
            } catch (e5) {
            }
            t3(s4 || {});
          };
          return this.subscriptions[e3] || (this.subscriptions[e3] = []), this.subscriptions[e3].push(listener), this.isConnected ? 1 === this.subscriptions[e3].length ? yield this.submitSubscriptions() : null === (i2 = this.eventSource) || void 0 === i2 || i2.addEventListener(e3, listener) : yield this.connect(), () => __awaiter(this, void 0, void 0, function* () {
            return this.unsubscribeByTopicAndListener(e3, listener);
          });
        });
      }
      unsubscribe(e3) {
        var t3;
        return __awaiter(this, void 0, void 0, function* () {
          if (this.hasSubscriptionListeners(e3)) {
            if (e3) {
              for (let i2 of this.subscriptions[e3])
                null === (t3 = this.eventSource) || void 0 === t3 || t3.removeEventListener(e3, i2);
              delete this.subscriptions[e3];
            } else
              this.subscriptions = {};
            this.hasSubscriptionListeners() ? this.hasSubscriptionListeners(e3) || (yield this.submitSubscriptions()) : this.disconnect();
          }
        });
      }
      unsubscribeByPrefix(e3) {
        var t3;
        return __awaiter(this, void 0, void 0, function* () {
          let i2 = false;
          for (let s4 in this.subscriptions)
            if (s4.startsWith(e3)) {
              i2 = true;
              for (let e4 of this.subscriptions[s4])
                null === (t3 = this.eventSource) || void 0 === t3 || t3.removeEventListener(s4, e4);
              delete this.subscriptions[s4];
            }
          i2 && (this.hasSubscriptionListeners() ? yield this.submitSubscriptions() : this.disconnect());
        });
      }
      unsubscribeByTopicAndListener(e3, t3) {
        var i2;
        return __awaiter(this, void 0, void 0, function* () {
          if (!Array.isArray(this.subscriptions[e3]) || !this.subscriptions[e3].length)
            return;
          let s4 = false;
          for (let n2 = this.subscriptions[e3].length - 1; n2 >= 0; n2--)
            this.subscriptions[e3][n2] === t3 && (s4 = true, delete this.subscriptions[e3][n2], this.subscriptions[e3].splice(n2, 1), null === (i2 = this.eventSource) || void 0 === i2 || i2.removeEventListener(e3, t3));
          s4 && (this.subscriptions[e3].length || delete this.subscriptions[e3], this.hasSubscriptionListeners() ? this.hasSubscriptionListeners(e3) || (yield this.submitSubscriptions()) : this.disconnect());
        });
      }
      hasSubscriptionListeners(e3) {
        var t3, i2;
        if (this.subscriptions = this.subscriptions || {}, e3)
          return !!(null === (t3 = this.subscriptions[e3]) || void 0 === t3 ? void 0 : t3.length);
        for (let e4 in this.subscriptions)
          if (null === (i2 = this.subscriptions[e4]) || void 0 === i2 ? void 0 : i2.length)
            return true;
        return false;
      }
      submitSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
          if (this.clientId)
            return this.addAllSubscriptionListeners(), this.lastSentTopics = this.getNonEmptySubscriptionTopics(), this.client.send("/api/realtime", { method: "POST", body: { clientId: this.clientId, subscriptions: this.lastSentTopics }, query: { requestKey: this.getSubscriptionsCancelKey() } }).catch((e3) => {
              if (!(null == e3 ? void 0 : e3.isAbort))
                throw e3;
            });
        });
      }
      getSubscriptionsCancelKey() {
        return "realtime_" + this.clientId;
      }
      getNonEmptySubscriptionTopics() {
        const e3 = [];
        for (let t3 in this.subscriptions)
          this.subscriptions[t3].length && e3.push(t3);
        return e3;
      }
      addAllSubscriptionListeners() {
        if (this.eventSource) {
          this.removeAllSubscriptionListeners();
          for (let e3 in this.subscriptions)
            for (let t3 of this.subscriptions[e3])
              this.eventSource.addEventListener(e3, t3);
        }
      }
      removeAllSubscriptionListeners() {
        if (this.eventSource)
          for (let e3 in this.subscriptions)
            for (let t3 of this.subscriptions[e3])
              this.eventSource.removeEventListener(e3, t3);
      }
      connect() {
        return __awaiter(this, void 0, void 0, function* () {
          if (!(this.reconnectAttempts > 0))
            return new Promise((e3, t3) => {
              this.pendingConnects.push({ resolve: e3, reject: t3 }), this.pendingConnects.length > 1 || this.initConnect();
            });
        });
      }
      initConnect() {
        this.disconnect(true), clearTimeout(this.connectTimeoutId), this.connectTimeoutId = setTimeout(() => {
          this.connectErrorHandler(new Error("EventSource connect took too long."));
        }, this.maxConnectTimeout), this.eventSource = new EventSource(this.client.buildUrl("/api/realtime")), this.eventSource.onerror = (e3) => {
          this.connectErrorHandler(new Error("Failed to establish realtime connection."));
        }, this.eventSource.addEventListener("PB_CONNECT", (e3) => {
          const t3 = e3;
          this.clientId = null == t3 ? void 0 : t3.lastEventId, this.submitSubscriptions().then(() => __awaiter(this, void 0, void 0, function* () {
            let e4 = 3;
            for (; this.hasUnsentSubscriptions() && e4 > 0; )
              e4--, yield this.submitSubscriptions();
          })).then(() => {
            for (let e4 of this.pendingConnects)
              e4.resolve();
            this.pendingConnects = [], this.reconnectAttempts = 0, clearTimeout(this.reconnectTimeoutId), clearTimeout(this.connectTimeoutId);
          }).catch((e4) => {
            this.clientId = "", this.connectErrorHandler(e4);
          });
        });
      }
      hasUnsentSubscriptions() {
        const e3 = this.getNonEmptySubscriptionTopics();
        if (e3.length != this.lastSentTopics.length)
          return true;
        for (const t3 of e3)
          if (!this.lastSentTopics.includes(t3))
            return true;
        return false;
      }
      connectErrorHandler(e3) {
        if (clearTimeout(this.connectTimeoutId), clearTimeout(this.reconnectTimeoutId), !this.clientId && !this.reconnectAttempts || this.reconnectAttempts > this.maxReconnectAttempts) {
          for (let t4 of this.pendingConnects)
            t4.reject(new ClientResponseError(e3));
          return this.pendingConnects = [], void this.disconnect();
        }
        this.disconnect(true);
        const t3 = this.predefinedReconnectIntervals[this.reconnectAttempts] || this.predefinedReconnectIntervals[this.predefinedReconnectIntervals.length - 1];
        this.reconnectAttempts++, this.reconnectTimeoutId = setTimeout(() => {
          this.initConnect();
        }, t3);
      }
      disconnect(e3 = false) {
        var t3;
        if (clearTimeout(this.connectTimeoutId), clearTimeout(this.reconnectTimeoutId), this.removeAllSubscriptionListeners(), this.client.cancelRequest(this.getSubscriptionsCancelKey()), null === (t3 = this.eventSource) || void 0 === t3 || t3.close(), this.eventSource = null, this.clientId = "", !e3) {
          this.reconnectAttempts = 0;
          for (let e4 of this.pendingConnects)
            e4.resolve();
          this.pendingConnects = [];
        }
      }
    };
    RecordService = class extends CrudService {
      constructor(e3, t3) {
        super(e3), this.collectionIdOrName = t3;
      }
      get baseCrudPath() {
        return this.baseCollectionPath + "/records";
      }
      get baseCollectionPath() {
        return "/api/collections/" + encodeURIComponent(this.collectionIdOrName);
      }
      subscribeOne(e3, t3) {
        return __awaiter(this, void 0, void 0, function* () {
          return console.warn("PocketBase: subscribeOne(recordId, callback) is deprecated. Please replace it with subscribe(recordId, callback)."), this.client.realtime.subscribe(this.collectionIdOrName + "/" + e3, t3);
        });
      }
      subscribe(e3, t3) {
        return __awaiter(this, void 0, void 0, function* () {
          if ("function" == typeof e3)
            return console.warn("PocketBase: subscribe(callback) is deprecated. Please replace it with subscribe('*', callback)."), this.client.realtime.subscribe(this.collectionIdOrName, e3);
          if (!t3)
            throw new Error("Missing subscription callback.");
          if ("" === e3)
            throw new Error("Missing topic.");
          let i2 = this.collectionIdOrName;
          return "*" !== e3 && (i2 += "/" + e3), this.client.realtime.subscribe(i2, t3);
        });
      }
      unsubscribe(e3) {
        return __awaiter(this, void 0, void 0, function* () {
          return "*" === e3 ? this.client.realtime.unsubscribe(this.collectionIdOrName) : e3 ? this.client.realtime.unsubscribe(this.collectionIdOrName + "/" + e3) : this.client.realtime.unsubscribeByPrefix(this.collectionIdOrName);
        });
      }
      getFullList(e3, t3) {
        if ("number" == typeof e3)
          return super.getFullList(e3, t3);
        const i2 = Object.assign({}, e3, t3);
        return super.getFullList(i2);
      }
      getList(e3 = 1, t3 = 30, i2) {
        return super.getList(e3, t3, i2);
      }
      getFirstListItem(e3, t3) {
        return super.getFirstListItem(e3, t3);
      }
      getOne(e3, t3) {
        return super.getOne(e3, t3);
      }
      create(e3, t3) {
        return super.create(e3, t3);
      }
      update(e3, t3, i2) {
        return super.update(e3, t3, i2).then((e4) => {
          var t4, i3, s4;
          return (null === (t4 = this.client.authStore.model) || void 0 === t4 ? void 0 : t4.id) !== (null == e4 ? void 0 : e4.id) || (null === (i3 = this.client.authStore.model) || void 0 === i3 ? void 0 : i3.collectionId) !== this.collectionIdOrName && (null === (s4 = this.client.authStore.model) || void 0 === s4 ? void 0 : s4.collectionName) !== this.collectionIdOrName || this.client.authStore.save(this.client.authStore.token, e4), e4;
        });
      }
      delete(e3, t3) {
        return super.delete(e3, t3).then((t4) => {
          var i2, s4, n2;
          return !t4 || (null === (i2 = this.client.authStore.model) || void 0 === i2 ? void 0 : i2.id) !== e3 || (null === (s4 = this.client.authStore.model) || void 0 === s4 ? void 0 : s4.collectionId) !== this.collectionIdOrName && (null === (n2 = this.client.authStore.model) || void 0 === n2 ? void 0 : n2.collectionName) !== this.collectionIdOrName || this.client.authStore.clear(), t4;
        });
      }
      authResponse(e3) {
        const t3 = this.decode((null == e3 ? void 0 : e3.record) || {});
        return this.client.authStore.save(null == e3 ? void 0 : e3.token, t3), Object.assign({}, e3, { token: (null == e3 ? void 0 : e3.token) || "", record: t3 });
      }
      listAuthMethods(e3) {
        return e3 = Object.assign({ method: "GET" }, e3), this.client.send(this.baseCollectionPath + "/auth-methods", e3).then((e4) => Object.assign({}, e4, { usernamePassword: !!(null == e4 ? void 0 : e4.usernamePassword), emailPassword: !!(null == e4 ? void 0 : e4.emailPassword), authProviders: Array.isArray(null == e4 ? void 0 : e4.authProviders) ? null == e4 ? void 0 : e4.authProviders : [] }));
      }
      authWithPassword(e3, t3, i2, s4) {
        let n2 = { method: "POST", body: { identity: e3, password: t3 } };
        return n2 = normalizeLegacyOptionsArgs("This form of authWithPassword(usernameOrEmail, pass, body?, query?) is deprecated. Consider replacing it with authWithPassword(usernameOrEmail, pass, options?).", n2, i2, s4), this.client.send(this.baseCollectionPath + "/auth-with-password", n2).then((e4) => this.authResponse(e4));
      }
      authWithOAuth2Code(e3, t3, i2, s4, n2, o2, r3) {
        let a = { method: "POST", body: { provider: e3, code: t3, codeVerifier: i2, redirectUrl: s4, createData: n2 } };
        return a = normalizeLegacyOptionsArgs("This form of authWithOAuth2Code(provider, code, codeVerifier, redirectUrl, createData?, body?, query?) is deprecated. Consider replacing it with authWithOAuth2Code(provider, code, codeVerifier, redirectUrl, createData?, options?).", a, o2, r3), this.client.send(this.baseCollectionPath + "/auth-with-oauth2", a).then((e4) => this.authResponse(e4));
      }
      authWithOAuth2(...e3) {
        return __awaiter(this, void 0, void 0, function* () {
          if (e3.length > 1 || "string" == typeof (null == e3 ? void 0 : e3[0]))
            return console.warn("PocketBase: This form of authWithOAuth2() is deprecated and may get removed in the future. Please replace with authWithOAuth2Code() OR use the authWithOAuth2() realtime form as shown in https://pocketbase.io/docs/authentication/#oauth2-integration."), this.authWithOAuth2Code((null == e3 ? void 0 : e3[0]) || "", (null == e3 ? void 0 : e3[1]) || "", (null == e3 ? void 0 : e3[2]) || "", (null == e3 ? void 0 : e3[3]) || "", (null == e3 ? void 0 : e3[4]) || {}, (null == e3 ? void 0 : e3[5]) || {}, (null == e3 ? void 0 : e3[6]) || {});
          const t3 = (null == e3 ? void 0 : e3[0]) || {}, i2 = (yield this.listAuthMethods()).authProviders.find((e4) => e4.name === t3.provider);
          if (!i2)
            throw new ClientResponseError(new Error(`Missing or invalid provider "${t3.provider}".`));
          const s4 = this.client.buildUrl("/api/oauth2-redirect"), n2 = new RealtimeService(this.client);
          let o2 = null;
          function cleanup() {
            null == o2 || o2.close(), n2.unsubscribe();
          }
          return t3.urlCallback || (o2 = openBrowserPopup(void 0)), new Promise((e4, r3) => __awaiter(this, void 0, void 0, function* () {
            var a;
            try {
              yield n2.subscribe("@oauth2", (o3) => __awaiter(this, void 0, void 0, function* () {
                const a2 = n2.clientId;
                try {
                  if (!o3.state || a2 !== o3.state)
                    throw new Error("State parameters don't match.");
                  const n3 = Object.assign({}, t3);
                  delete n3.provider, delete n3.scopes, delete n3.createData, delete n3.urlCallback;
                  const r4 = yield this.authWithOAuth2Code(i2.name, o3.code, i2.codeVerifier, s4, t3.createData, n3);
                  e4(r4);
                } catch (e5) {
                  r3(new ClientResponseError(e5));
                }
                cleanup();
              }));
              const l = { state: n2.clientId };
              (null === (a = t3.scopes) || void 0 === a ? void 0 : a.length) && (l.scope = t3.scopes.join(" "));
              const c2 = this._replaceQueryParams(i2.authUrl + s4, l);
              let d = t3.urlCallback || function(e5) {
                o2 ? o2.location.href = e5 : o2 = openBrowserPopup(e5);
              };
              yield d(c2);
            } catch (e5) {
              cleanup(), r3(new ClientResponseError(e5));
            }
          }));
        });
      }
      authRefresh(e3, t3) {
        let i2 = { method: "POST" };
        return i2 = normalizeLegacyOptionsArgs("This form of authRefresh(body?, query?) is deprecated. Consider replacing it with authRefresh(options?).", i2, e3, t3), this.client.send(this.baseCollectionPath + "/auth-refresh", i2).then((e4) => this.authResponse(e4));
      }
      requestPasswordReset(e3, t3, i2) {
        let s4 = { method: "POST", body: { email: e3 } };
        return s4 = normalizeLegacyOptionsArgs("This form of requestPasswordReset(email, body?, query?) is deprecated. Consider replacing it with requestPasswordReset(email, options?).", s4, t3, i2), this.client.send(this.baseCollectionPath + "/request-password-reset", s4).then(() => true);
      }
      confirmPasswordReset(e3, t3, i2, s4, n2) {
        let o2 = { method: "POST", body: { token: e3, password: t3, passwordConfirm: i2 } };
        return o2 = normalizeLegacyOptionsArgs("This form of confirmPasswordReset(token, password, passwordConfirm, body?, query?) is deprecated. Consider replacing it with confirmPasswordReset(token, password, passwordConfirm, options?).", o2, s4, n2), this.client.send(this.baseCollectionPath + "/confirm-password-reset", o2).then(() => true);
      }
      requestVerification(e3, t3, i2) {
        let s4 = { method: "POST", body: { email: e3 } };
        return s4 = normalizeLegacyOptionsArgs("This form of requestVerification(email, body?, query?) is deprecated. Consider replacing it with requestVerification(email, options?).", s4, t3, i2), this.client.send(this.baseCollectionPath + "/request-verification", s4).then(() => true);
      }
      confirmVerification(e3, t3, i2) {
        let s4 = { method: "POST", body: { token: e3 } };
        return s4 = normalizeLegacyOptionsArgs("This form of confirmVerification(token, body?, query?) is deprecated. Consider replacing it with confirmVerification(token, options?).", s4, t3, i2), this.client.send(this.baseCollectionPath + "/confirm-verification", s4).then(() => true);
      }
      requestEmailChange(e3, t3, i2) {
        let s4 = { method: "POST", body: { newEmail: e3 } };
        return s4 = normalizeLegacyOptionsArgs("This form of requestEmailChange(newEmail, body?, query?) is deprecated. Consider replacing it with requestEmailChange(newEmail, options?).", s4, t3, i2), this.client.send(this.baseCollectionPath + "/request-email-change", s4).then(() => true);
      }
      confirmEmailChange(e3, t3, i2, s4) {
        let n2 = { method: "POST", body: { token: e3, password: t3 } };
        return n2 = normalizeLegacyOptionsArgs("This form of confirmEmailChange(token, password, body?, query?) is deprecated. Consider replacing it with confirmEmailChange(token, password, options?).", n2, i2, s4), this.client.send(this.baseCollectionPath + "/confirm-email-change", n2).then(() => true);
      }
      listExternalAuths(e3, t3) {
        return t3 = Object.assign({ method: "GET" }, t3), this.client.send(this.baseCrudPath + "/" + encodeURIComponent(e3) + "/external-auths", t3);
      }
      unlinkExternalAuth(e3, t3, i2) {
        return i2 = Object.assign({ method: "DELETE" }, i2), this.client.send(this.baseCrudPath + "/" + encodeURIComponent(e3) + "/external-auths/" + encodeURIComponent(t3), i2).then(() => true);
      }
      _replaceQueryParams(e3, t3 = {}) {
        let i2 = e3, s4 = "";
        e3.indexOf("?") >= 0 && (i2 = e3.substring(0, e3.indexOf("?")), s4 = e3.substring(e3.indexOf("?") + 1));
        const n2 = {}, o2 = s4.split("&");
        for (const e4 of o2) {
          if ("" == e4)
            continue;
          const t4 = e4.split("=");
          n2[decodeURIComponent(t4[0].replace(/\+/g, " "))] = decodeURIComponent((t4[1] || "").replace(/\+/g, " "));
        }
        for (let e4 in t3)
          t3.hasOwnProperty(e4) && (null == t3[e4] ? delete n2[e4] : n2[e4] = t3[e4]);
        s4 = "";
        for (let e4 in n2)
          n2.hasOwnProperty(e4) && ("" != s4 && (s4 += "&"), s4 += encodeURIComponent(e4.replace(/%20/g, "+")) + "=" + encodeURIComponent(n2[e4].replace(/%20/g, "+")));
        return "" != s4 ? i2 + "?" + s4 : i2;
      }
    };
    CollectionService = class extends CrudService {
      get baseCrudPath() {
        return "/api/collections";
      }
      import(e3, t3 = false, i2) {
        return __awaiter(this, void 0, void 0, function* () {
          return i2 = Object.assign({ method: "PUT", body: { collections: e3, deleteMissing: t3 } }, i2), this.client.send(this.baseCrudPath + "/import", i2).then(() => true);
        });
      }
    };
    LogService = class extends BaseService {
      getRequestsList(e3 = 1, t3 = 30, i2) {
        return (i2 = Object.assign({ method: "GET" }, i2)).query = Object.assign({ page: e3, perPage: t3 }, i2.query), this.client.send("/api/logs/requests", i2);
      }
      getRequest(e3, t3) {
        return t3 = Object.assign({ method: "GET" }, t3), this.client.send("/api/logs/requests/" + encodeURIComponent(e3), t3);
      }
      getRequestsStats(e3) {
        return e3 = Object.assign({ method: "GET" }, e3), this.client.send("/api/logs/requests/stats", e3);
      }
    };
    HealthService = class extends BaseService {
      check(e3) {
        return e3 = Object.assign({ method: "GET" }, e3), this.client.send("/api/health", e3);
      }
    };
    FileService = class extends BaseService {
      getUrl(e3, t3, i2 = {}) {
        if (!t3 || !(null == e3 ? void 0 : e3.id) || !(null == e3 ? void 0 : e3.collectionId) && !(null == e3 ? void 0 : e3.collectionName))
          return "";
        const s4 = [];
        s4.push("api"), s4.push("files"), s4.push(encodeURIComponent(e3.collectionId || e3.collectionName)), s4.push(encodeURIComponent(e3.id)), s4.push(encodeURIComponent(t3));
        let n2 = this.client.buildUrl(s4.join("/"));
        if (Object.keys(i2).length) {
          false === i2.download && delete i2.download;
          const e4 = new URLSearchParams(i2);
          n2 += (n2.includes("?") ? "&" : "?") + e4;
        }
        return n2;
      }
      getToken(e3) {
        return e3 = Object.assign({ method: "POST" }, e3), this.client.send("/api/files/token", e3).then((e4) => (null == e4 ? void 0 : e4.token) || "");
      }
    };
    BackupService = class extends BaseService {
      getFullList(e3) {
        return e3 = Object.assign({ method: "GET" }, e3), this.client.send("/api/backups", e3);
      }
      create(e3, t3) {
        return t3 = Object.assign({ method: "POST", body: { name: e3 } }, t3), this.client.send("/api/backups", t3).then(() => true);
      }
      upload(e3, t3) {
        return t3 = Object.assign({ method: "POST", body: e3 }, t3), this.client.send("/api/backups/upload", t3).then(() => true);
      }
      delete(e3, t3) {
        return t3 = Object.assign({ method: "DELETE" }, t3), this.client.send(`/api/backups/${encodeURIComponent(e3)}`, t3).then(() => true);
      }
      restore(e3, t3) {
        return t3 = Object.assign({ method: "POST" }, t3), this.client.send(`/api/backups/${encodeURIComponent(e3)}/restore`, t3).then(() => true);
      }
      getDownloadUrl(e3, t3) {
        return this.client.buildUrl(`/api/backups/${encodeURIComponent(t3)}?token=${encodeURIComponent(e3)}`);
      }
    };
    s = ["requestKey", "$cancelKey", "$autoCancel", "fetch", "headers", "body", "query", "params", "cache", "credentials", "headers", "integrity", "keepalive", "method", "mode", "redirect", "referrer", "referrerPolicy", "signal", "window"];
    Client = class {
      constructor(e3 = "/", t3, i2 = "en-US") {
        this.cancelControllers = {}, this.recordServices = {}, this.enableAutoCancellation = true, this.baseUrl = e3, this.lang = i2, this.authStore = t3 || new LocalAuthStore(), this.admins = new AdminService(this), this.collections = new CollectionService(this), this.files = new FileService(this), this.logs = new LogService(this), this.settings = new SettingsService(this), this.realtime = new RealtimeService(this), this.health = new HealthService(this), this.backups = new BackupService(this);
      }
      collection(e3) {
        return this.recordServices[e3] || (this.recordServices[e3] = new RecordService(this, e3)), this.recordServices[e3];
      }
      autoCancellation(e3) {
        return this.enableAutoCancellation = !!e3, this;
      }
      cancelRequest(e3) {
        return this.cancelControllers[e3] && (this.cancelControllers[e3].abort(), delete this.cancelControllers[e3]), this;
      }
      cancelAllRequests() {
        for (let e3 in this.cancelControllers)
          this.cancelControllers[e3].abort();
        return this.cancelControllers = {}, this;
      }
      getFileUrl(e3, t3, i2 = {}) {
        return this.files.getUrl(e3, t3, i2);
      }
      buildUrl(e3) {
        var t3;
        let i2 = this.baseUrl;
        return "undefined" == typeof window || !window.location || i2.startsWith("https://") || i2.startsWith("http://") || (i2 = (null === (t3 = window.location.origin) || void 0 === t3 ? void 0 : t3.endsWith("/")) ? window.location.origin.substring(0, window.location.origin.length - 1) : window.location.origin || "", this.baseUrl.startsWith("/") || (i2 += window.location.pathname || "/", i2 += i2.endsWith("/") ? "" : "/"), i2 += this.baseUrl), e3 && (i2 += i2.endsWith("/") ? "" : "/", i2 += e3.startsWith("/") ? e3.substring(1) : e3), i2;
      }
      send(e3, t3) {
        return __awaiter(this, void 0, void 0, function* () {
          t3 = this.initSendOptions(e3, t3);
          let i2 = this.buildUrl(e3);
          if (this.beforeSend) {
            const e4 = Object.assign({}, yield this.beforeSend(i2, t3));
            void 0 !== e4.url || void 0 !== e4.options ? (i2 = e4.url || i2, t3 = e4.options || t3) : Object.keys(e4).length && (t3 = e4, (null === console || void 0 === console ? void 0 : console.warn) && console.warn("Deprecated format of beforeSend return: please use `return { url, options }`, instead of `return options`."));
          }
          if (void 0 !== t3.query) {
            const e4 = this.serializeQueryParams(t3.query);
            e4 && (i2 += (i2.includes("?") ? "&" : "?") + e4), delete t3.query;
          }
          "application/json" == this.getHeader(t3.headers, "Content-Type") && t3.body && "string" != typeof t3.body && (t3.body = JSON.stringify(t3.body));
          return (t3.fetch || fetch)(i2, t3).then((e4) => __awaiter(this, void 0, void 0, function* () {
            let t4 = {};
            try {
              t4 = yield e4.json();
            } catch (e5) {
            }
            if (this.afterSend && (t4 = yield this.afterSend(e4, t4)), e4.status >= 400)
              throw new ClientResponseError({ url: e4.url, status: e4.status, data: t4 });
            return t4;
          })).catch((e4) => {
            throw new ClientResponseError(e4);
          });
        });
      }
      initSendOptions(e3, t3) {
        (t3 = Object.assign({ method: "GET" }, t3)).query = t3.query || {}, t3.body = this.convertToFormDataIfNeeded(t3.body);
        for (let e4 in t3)
          s.includes(e4) || (t3.query[e4] = t3[e4], delete t3[e4]);
        if (t3.query = Object.assign({}, t3.params, t3.query), void 0 === t3.requestKey && (false === t3.$autoCancel || false === t3.query.$autoCancel ? t3.requestKey = null : (t3.$cancelKey || t3.query.$cancelKey) && (t3.requestKey = t3.$cancelKey || t3.query.$cancelKey)), delete t3.$autoCancel, delete t3.query.$autoCancel, delete t3.$cancelKey, delete t3.query.$cancelKey, null !== this.getHeader(t3.headers, "Content-Type") || this.isFormData(t3.body) || (t3.headers = Object.assign({}, t3.headers, { "Content-Type": "application/json" })), null === this.getHeader(t3.headers, "Accept-Language") && (t3.headers = Object.assign({}, t3.headers, { "Accept-Language": this.lang })), this.authStore.token && null === this.getHeader(t3.headers, "Authorization") && (t3.headers = Object.assign({}, t3.headers, { Authorization: this.authStore.token })), this.enableAutoCancellation && null !== t3.requestKey) {
          const i2 = t3.requestKey || (t3.method || "GET") + e3;
          delete t3.requestKey, this.cancelRequest(i2);
          const s4 = new AbortController();
          this.cancelControllers[i2] = s4, t3.signal = s4.signal;
        }
        return t3;
      }
      convertToFormDataIfNeeded(e3) {
        if ("undefined" == typeof FormData || void 0 === e3 || "object" != typeof e3 || null === e3 || this.isFormData(e3) || !this.hasBlobField(e3))
          return e3;
        const t3 = new FormData();
        for (let i2 in e3) {
          const s4 = Array.isArray(e3[i2]) ? e3[i2] : [e3[i2]];
          for (let e4 of s4)
            t3.append(i2, e4);
        }
        return t3;
      }
      hasBlobField(e3) {
        for (let t3 in e3) {
          const i2 = Array.isArray(e3[t3]) ? e3[t3] : [e3[t3]];
          for (let e4 of i2)
            if ("undefined" != typeof Blob && e4 instanceof Blob || "undefined" != typeof File && e4 instanceof File)
              return true;
        }
        return false;
      }
      getHeader(e3, t3) {
        e3 = e3 || {}, t3 = t3.toLowerCase();
        for (let i2 in e3)
          if (i2.toLowerCase() == t3)
            return e3[i2];
        return null;
      }
      isFormData(e3) {
        return e3 && ("FormData" === e3.constructor.name || "undefined" != typeof FormData && e3 instanceof FormData);
      }
      serializeQueryParams(e3) {
        const t3 = [];
        for (const i2 in e3) {
          if (null === e3[i2])
            continue;
          const s4 = e3[i2], n2 = encodeURIComponent(i2);
          if (Array.isArray(s4))
            for (const e4 of s4)
              t3.push(n2 + "=" + encodeURIComponent(e4));
          else
            s4 instanceof Date ? t3.push(n2 + "=" + encodeURIComponent(s4.toISOString())) : null !== typeof s4 && "object" == typeof s4 ? t3.push(n2 + "=" + encodeURIComponent(JSON.stringify(s4))) : t3.push(n2 + "=" + encodeURIComponent(s4));
        }
        return t3.join("&");
      }
    };
  }
});

// .svelte-kit/output/server/chunks/index.js
function error(status, body) {
  if (isNaN(status) || status < 400 || status > 599) {
    throw new Error(`HTTP error status codes must be between 400 and 599 \u2014 ${status} is invalid`);
  }
  return new HttpError(status, body);
}
function redirect(status, location) {
  if (isNaN(status) || status < 300 || status > 308) {
    throw new Error("Invalid status code");
  }
  return new Redirect(status, location.toString());
}
function json(data, init2) {
  const body = JSON.stringify(data);
  const headers = new Headers(init2?.headers);
  if (!headers.has("content-length")) {
    headers.set("content-length", encoder.encode(body).byteLength.toString());
  }
  if (!headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  return new Response(body, {
    ...init2,
    headers
  });
}
function text(body, init2) {
  const headers = new Headers(init2?.headers);
  if (!headers.has("content-length")) {
    const encoded = encoder.encode(body);
    headers.set("content-length", encoded.byteLength.toString());
    return new Response(encoded, {
      ...init2,
      headers
    });
  }
  return new Response(body, {
    ...init2,
    headers
  });
}
var HttpError, Redirect, NotFound, ActionFailure, encoder;
var init_chunks = __esm({
  ".svelte-kit/output/server/chunks/index.js"() {
    HttpError = class {
      /**
       * @param {number} status
       * @param {{message: string} extends App.Error ? (App.Error | string | undefined) : App.Error} body
       */
      constructor(status, body) {
        this.status = status;
        if (typeof body === "string") {
          this.body = { message: body };
        } else if (body) {
          this.body = body;
        } else {
          this.body = { message: `Error: ${status}` };
        }
      }
      toString() {
        return JSON.stringify(this.body);
      }
    };
    Redirect = class {
      /**
       * @param {300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308} status
       * @param {string} location
       */
      constructor(status, location) {
        this.status = status;
        this.location = location;
      }
    };
    NotFound = class extends Error {
      /**
       * @param {string} pathname
       */
      constructor(pathname) {
        super();
        this.status = 404;
        this.message = `Not found: ${pathname}`;
      }
    };
    ActionFailure = class {
      /**
       * @param {number} status
       * @param {T} [data]
       */
      constructor(status, data) {
        this.status = status;
        this.data = data;
      }
    };
    encoder = new TextEncoder();
  }
});

// .svelte-kit/output/server/chunks/hooks.server.js
var hooks_server_exports = {};
__export(hooks_server_exports, {
  handle: () => handle
});
var handle;
var init_hooks_server = __esm({
  ".svelte-kit/output/server/chunks/hooks.server.js"() {
    init_pocketbase_es();
    init_chunks();
    handle = async ({ event, resolve: resolve2, cookies }) => {
      event.locals.pb = new Client("https://pb.openrxn.com");
      const response = await resolve2(event);
      return response;
    };
  }
});

// node_modules/cookie/index.js
var require_cookie = __commonJS({
  "node_modules/cookie/index.js"(exports) {
    "use strict";
    exports.parse = parse3;
    exports.serialize = serialize2;
    var __toString = Object.prototype.toString;
    var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
    function parse3(str2, options2) {
      if (typeof str2 !== "string") {
        throw new TypeError("argument str must be a string");
      }
      var obj = {};
      var opt = options2 || {};
      var dec = opt.decode || decode;
      var index8 = 0;
      while (index8 < str2.length) {
        var eqIdx = str2.indexOf("=", index8);
        if (eqIdx === -1) {
          break;
        }
        var endIdx = str2.indexOf(";", index8);
        if (endIdx === -1) {
          endIdx = str2.length;
        } else if (endIdx < eqIdx) {
          index8 = str2.lastIndexOf(";", eqIdx - 1) + 1;
          continue;
        }
        var key2 = str2.slice(index8, eqIdx).trim();
        if (void 0 === obj[key2]) {
          var val = str2.slice(eqIdx + 1, endIdx).trim();
          if (val.charCodeAt(0) === 34) {
            val = val.slice(1, -1);
          }
          obj[key2] = tryDecode(val, dec);
        }
        index8 = endIdx + 1;
      }
      return obj;
    }
    function serialize2(name, val, options2) {
      var opt = options2 || {};
      var enc = opt.encode || encode2;
      if (typeof enc !== "function") {
        throw new TypeError("option encode is invalid");
      }
      if (!fieldContentRegExp.test(name)) {
        throw new TypeError("argument name is invalid");
      }
      var value = enc(val);
      if (value && !fieldContentRegExp.test(value)) {
        throw new TypeError("argument val is invalid");
      }
      var str2 = name + "=" + value;
      if (null != opt.maxAge) {
        var maxAge = opt.maxAge - 0;
        if (isNaN(maxAge) || !isFinite(maxAge)) {
          throw new TypeError("option maxAge is invalid");
        }
        str2 += "; Max-Age=" + Math.floor(maxAge);
      }
      if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain)) {
          throw new TypeError("option domain is invalid");
        }
        str2 += "; Domain=" + opt.domain;
      }
      if (opt.path) {
        if (!fieldContentRegExp.test(opt.path)) {
          throw new TypeError("option path is invalid");
        }
        str2 += "; Path=" + opt.path;
      }
      if (opt.expires) {
        var expires = opt.expires;
        if (!isDate(expires) || isNaN(expires.valueOf())) {
          throw new TypeError("option expires is invalid");
        }
        str2 += "; Expires=" + expires.toUTCString();
      }
      if (opt.httpOnly) {
        str2 += "; HttpOnly";
      }
      if (opt.secure) {
        str2 += "; Secure";
      }
      if (opt.priority) {
        var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
        switch (priority) {
          case "low":
            str2 += "; Priority=Low";
            break;
          case "medium":
            str2 += "; Priority=Medium";
            break;
          case "high":
            str2 += "; Priority=High";
            break;
          default:
            throw new TypeError("option priority is invalid");
        }
      }
      if (opt.sameSite) {
        var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch (sameSite) {
          case true:
            str2 += "; SameSite=Strict";
            break;
          case "lax":
            str2 += "; SameSite=Lax";
            break;
          case "strict":
            str2 += "; SameSite=Strict";
            break;
          case "none":
            str2 += "; SameSite=None";
            break;
          default:
            throw new TypeError("option sameSite is invalid");
        }
      }
      return str2;
    }
    function decode(str2) {
      return str2.indexOf("%") !== -1 ? decodeURIComponent(str2) : str2;
    }
    function encode2(val) {
      return encodeURIComponent(val);
    }
    function isDate(val) {
      return __toString.call(val) === "[object Date]" || val instanceof Date;
    }
    function tryDecode(str2, decode2) {
      try {
        return decode2(str2);
      } catch (e3) {
        return str2;
      }
    }
  }
});

// node_modules/set-cookie-parser/lib/set-cookie.js
var require_set_cookie = __commonJS({
  "node_modules/set-cookie-parser/lib/set-cookie.js"(exports, module) {
    "use strict";
    var defaultParseOptions = {
      decodeValues: true,
      map: false,
      silent: false
    };
    function isNonEmptyString(str2) {
      return typeof str2 === "string" && !!str2.trim();
    }
    function parseString2(setCookieValue, options2) {
      var parts = setCookieValue.split(";").filter(isNonEmptyString);
      var nameValuePairStr = parts.shift();
      var parsed = parseNameValuePair(nameValuePairStr);
      var name = parsed.name;
      var value = parsed.value;
      options2 = options2 ? Object.assign({}, defaultParseOptions, options2) : defaultParseOptions;
      try {
        value = options2.decodeValues ? decodeURIComponent(value) : value;
      } catch (e3) {
        console.error(
          "set-cookie-parser encountered an error while decoding a cookie with value '" + value + "'. Set options.decodeValues to false to disable this feature.",
          e3
        );
      }
      var cookie = {
        name,
        value
      };
      parts.forEach(function(part) {
        var sides = part.split("=");
        var key2 = sides.shift().trimLeft().toLowerCase();
        var value2 = sides.join("=");
        if (key2 === "expires") {
          cookie.expires = new Date(value2);
        } else if (key2 === "max-age") {
          cookie.maxAge = parseInt(value2, 10);
        } else if (key2 === "secure") {
          cookie.secure = true;
        } else if (key2 === "httponly") {
          cookie.httpOnly = true;
        } else if (key2 === "samesite") {
          cookie.sameSite = value2;
        } else {
          cookie[key2] = value2;
        }
      });
      return cookie;
    }
    function parseNameValuePair(nameValuePairStr) {
      var name = "";
      var value = "";
      var nameValueArr = nameValuePairStr.split("=");
      if (nameValueArr.length > 1) {
        name = nameValueArr.shift();
        value = nameValueArr.join("=");
      } else {
        value = nameValuePairStr;
      }
      return { name, value };
    }
    function parse3(input, options2) {
      options2 = options2 ? Object.assign({}, defaultParseOptions, options2) : defaultParseOptions;
      if (!input) {
        if (!options2.map) {
          return [];
        } else {
          return {};
        }
      }
      if (input.headers) {
        if (typeof input.headers.getSetCookie === "function") {
          input = input.headers.getSetCookie();
        } else if (input.headers["set-cookie"]) {
          input = input.headers["set-cookie"];
        } else {
          var sch = input.headers[Object.keys(input.headers).find(function(key2) {
            return key2.toLowerCase() === "set-cookie";
          })];
          if (!sch && input.headers.cookie && !options2.silent) {
            console.warn(
              "Warning: set-cookie-parser appears to have been called on a request object. It is designed to parse Set-Cookie headers from responses, not Cookie headers from requests. Set the option {silent: true} to suppress this warning."
            );
          }
          input = sch;
        }
      }
      if (!Array.isArray(input)) {
        input = [input];
      }
      options2 = options2 ? Object.assign({}, defaultParseOptions, options2) : defaultParseOptions;
      if (!options2.map) {
        return input.filter(isNonEmptyString).map(function(str2) {
          return parseString2(str2, options2);
        });
      } else {
        var cookies = {};
        return input.filter(isNonEmptyString).reduce(function(cookies2, str2) {
          var cookie = parseString2(str2, options2);
          cookies2[cookie.name] = cookie;
          return cookies2;
        }, cookies);
      }
    }
    function splitCookiesString2(cookiesString) {
      if (Array.isArray(cookiesString)) {
        return cookiesString;
      }
      if (typeof cookiesString !== "string") {
        return [];
      }
      var cookiesStrings = [];
      var pos = 0;
      var start;
      var ch;
      var lastComma;
      var nextStart;
      var cookiesSeparatorFound;
      function skipWhitespace() {
        while (pos < cookiesString.length && /\s/.test(cookiesString.charAt(pos))) {
          pos += 1;
        }
        return pos < cookiesString.length;
      }
      function notSpecialChar() {
        ch = cookiesString.charAt(pos);
        return ch !== "=" && ch !== ";" && ch !== ",";
      }
      while (pos < cookiesString.length) {
        start = pos;
        cookiesSeparatorFound = false;
        while (skipWhitespace()) {
          ch = cookiesString.charAt(pos);
          if (ch === ",") {
            lastComma = pos;
            pos += 1;
            skipWhitespace();
            nextStart = pos;
            while (pos < cookiesString.length && notSpecialChar()) {
              pos += 1;
            }
            if (pos < cookiesString.length && cookiesString.charAt(pos) === "=") {
              cookiesSeparatorFound = true;
              pos = nextStart;
              cookiesStrings.push(cookiesString.substring(start, lastComma));
              start = pos;
            } else {
              pos = lastComma + 1;
            }
          } else {
            pos += 1;
          }
        }
        if (!cookiesSeparatorFound || pos >= cookiesString.length) {
          cookiesStrings.push(cookiesString.substring(start, cookiesString.length));
        }
      }
      return cookiesStrings;
    }
    module.exports = parse3;
    module.exports.parse = parse3;
    module.exports.parseString = parseString2;
    module.exports.splitCookiesString = splitCookiesString2;
  }
});

// .svelte-kit/output/server/entries/pages/_layout.svelte.js
var layout_svelte_exports = {};
__export(layout_svelte_exports, {
  default: () => Layout
});
var Layout;
var init_layout_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/_layout.svelte.js"() {
    init_ssr();
    Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return `${slots.default ? slots.default({}) : ``}`;
    });
  }
});

// .svelte-kit/output/server/nodes/0.js
var __exports = {};
__export(__exports, {
  component: () => component,
  fonts: () => fonts,
  imports: () => imports,
  index: () => index,
  stylesheets: () => stylesheets
});
var index, component_cache, component, imports, stylesheets, fonts;
var init__ = __esm({
  ".svelte-kit/output/server/nodes/0.js"() {
    index = 0;
    component = async () => component_cache ??= (await Promise.resolve().then(() => (init_layout_svelte(), layout_svelte_exports))).default;
    imports = ["_app/immutable/nodes/0.e994616b.js", "_app/immutable/chunks/scheduler.b62641ca.js", "_app/immutable/chunks/index.91daa77f.js"];
    stylesheets = ["_app/immutable/assets/0.3915aa75.css"];
    fonts = [];
  }
});

// .svelte-kit/output/server/chunks/stores.js
var getStores, page;
var init_stores = __esm({
  ".svelte-kit/output/server/chunks/stores.js"() {
    init_ssr();
    getStores = () => {
      const stores = getContext("__svelte__");
      return {
        /** @type {typeof page} */
        page: {
          subscribe: stores.page.subscribe
        },
        /** @type {typeof navigating} */
        navigating: {
          subscribe: stores.navigating.subscribe
        },
        /** @type {typeof updated} */
        updated: stores.updated
      };
    };
    page = {
      subscribe(fn) {
        const store = getStores().page;
        return store.subscribe(fn);
      }
    };
  }
});

// .svelte-kit/output/server/entries/fallbacks/error.svelte.js
var error_svelte_exports = {};
__export(error_svelte_exports, {
  default: () => Error2
});
var Error2;
var init_error_svelte = __esm({
  ".svelte-kit/output/server/entries/fallbacks/error.svelte.js"() {
    init_ssr();
    init_stores();
    Error2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $page, $$unsubscribe_page;
      $$unsubscribe_page = subscribe(page, (value) => $page = value);
      $$unsubscribe_page();
      return `<h1>${escape($page.status)}</h1> <p>${escape($page.error?.message)}</p>`;
    });
  }
});

// .svelte-kit/output/server/nodes/1.js
var __exports2 = {};
__export(__exports2, {
  component: () => component2,
  fonts: () => fonts2,
  imports: () => imports2,
  index: () => index2,
  stylesheets: () => stylesheets2
});
var index2, component_cache2, component2, imports2, stylesheets2, fonts2;
var init__2 = __esm({
  ".svelte-kit/output/server/nodes/1.js"() {
    index2 = 1;
    component2 = async () => component_cache2 ??= (await Promise.resolve().then(() => (init_error_svelte(), error_svelte_exports))).default;
    imports2 = ["_app/immutable/nodes/1.ed726968.js", "_app/immutable/chunks/scheduler.b62641ca.js", "_app/immutable/chunks/index.91daa77f.js", "_app/immutable/chunks/stores.283e6d03.js", "_app/immutable/chunks/singletons.ad51fe39.js"];
    stylesheets2 = [];
    fonts2 = [];
  }
});

// node_modules/tailwind-merge/dist/lib/tw-join.mjs
function twJoin() {
  var index8 = 0;
  var argument;
  var resolvedValue;
  var string = "";
  while (index8 < arguments.length) {
    if (argument = arguments[index8++]) {
      if (resolvedValue = toValue(argument)) {
        string && (string += " ");
        string += resolvedValue;
      }
    }
  }
  return string;
}
function toValue(mix) {
  if (typeof mix === "string") {
    return mix;
  }
  var resolvedValue;
  var string = "";
  for (var k = 0; k < mix.length; k++) {
    if (mix[k]) {
      if (resolvedValue = toValue(mix[k])) {
        string && (string += " ");
        string += resolvedValue;
      }
    }
  }
  return string;
}
var init_tw_join = __esm({
  "node_modules/tailwind-merge/dist/lib/tw-join.mjs"() {
  }
});

// node_modules/tailwind-merge/dist/lib/class-utils.mjs
function createClassUtils(config) {
  var classMap = createClassMap(config);
  var conflictingClassGroups = config.conflictingClassGroups, _config$conflictingCl = config.conflictingClassGroupModifiers, conflictingClassGroupModifiers = _config$conflictingCl === void 0 ? {} : _config$conflictingCl;
  function getClassGroupId(className) {
    var classParts = className.split(CLASS_PART_SEPARATOR);
    if (classParts[0] === "" && classParts.length !== 1) {
      classParts.shift();
    }
    return getGroupRecursive(classParts, classMap) || getGroupIdForArbitraryProperty(className);
  }
  function getConflictingClassGroupIds(classGroupId, hasPostfixModifier) {
    var conflicts = conflictingClassGroups[classGroupId] || [];
    if (hasPostfixModifier && conflictingClassGroupModifiers[classGroupId]) {
      return [].concat(conflicts, conflictingClassGroupModifiers[classGroupId]);
    }
    return conflicts;
  }
  return {
    getClassGroupId,
    getConflictingClassGroupIds
  };
}
function getGroupRecursive(classParts, classPartObject) {
  if (classParts.length === 0) {
    return classPartObject.classGroupId;
  }
  var currentClassPart = classParts[0];
  var nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
  var classGroupFromNextClassPart = nextClassPartObject ? getGroupRecursive(classParts.slice(1), nextClassPartObject) : void 0;
  if (classGroupFromNextClassPart) {
    return classGroupFromNextClassPart;
  }
  if (classPartObject.validators.length === 0) {
    return void 0;
  }
  var classRest = classParts.join(CLASS_PART_SEPARATOR);
  return classPartObject.validators.find(function(_ref) {
    var validator2 = _ref.validator;
    return validator2(classRest);
  })?.classGroupId;
}
function getGroupIdForArbitraryProperty(className) {
  if (arbitraryPropertyRegex.test(className)) {
    var arbitraryPropertyClassName = arbitraryPropertyRegex.exec(className)[1];
    var property = arbitraryPropertyClassName?.substring(0, arbitraryPropertyClassName.indexOf(":"));
    if (property) {
      return "arbitrary.." + property;
    }
  }
}
function createClassMap(config) {
  var theme = config.theme, prefix = config.prefix;
  var classMap = {
    nextPart: /* @__PURE__ */ new Map(),
    validators: []
  };
  var prefixedClassGroupEntries = getPrefixedClassGroupEntries(Object.entries(config.classGroups), prefix);
  prefixedClassGroupEntries.forEach(function(_ref2) {
    var classGroupId = _ref2[0], classGroup = _ref2[1];
    processClassesRecursively(classGroup, classMap, classGroupId, theme);
  });
  return classMap;
}
function processClassesRecursively(classGroup, classPartObject, classGroupId, theme) {
  classGroup.forEach(function(classDefinition) {
    if (typeof classDefinition === "string") {
      var classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
      classPartObjectToEdit.classGroupId = classGroupId;
      return;
    }
    if (typeof classDefinition === "function") {
      if (isThemeGetter(classDefinition)) {
        processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
        return;
      }
      classPartObject.validators.push({
        validator: classDefinition,
        classGroupId
      });
      return;
    }
    Object.entries(classDefinition).forEach(function(_ref3) {
      var key2 = _ref3[0], classGroup2 = _ref3[1];
      processClassesRecursively(classGroup2, getPart(classPartObject, key2), classGroupId, theme);
    });
  });
}
function getPart(classPartObject, path) {
  var currentClassPartObject = classPartObject;
  path.split(CLASS_PART_SEPARATOR).forEach(function(pathPart) {
    if (!currentClassPartObject.nextPart.has(pathPart)) {
      currentClassPartObject.nextPart.set(pathPart, {
        nextPart: /* @__PURE__ */ new Map(),
        validators: []
      });
    }
    currentClassPartObject = currentClassPartObject.nextPart.get(pathPart);
  });
  return currentClassPartObject;
}
function isThemeGetter(func) {
  return func.isThemeGetter;
}
function getPrefixedClassGroupEntries(classGroupEntries, prefix) {
  if (!prefix) {
    return classGroupEntries;
  }
  return classGroupEntries.map(function(_ref4) {
    var classGroupId = _ref4[0], classGroup = _ref4[1];
    var prefixedClassGroup = classGroup.map(function(classDefinition) {
      if (typeof classDefinition === "string") {
        return prefix + classDefinition;
      }
      if (typeof classDefinition === "object") {
        return Object.fromEntries(Object.entries(classDefinition).map(function(_ref5) {
          var key2 = _ref5[0], value = _ref5[1];
          return [prefix + key2, value];
        }));
      }
      return classDefinition;
    });
    return [classGroupId, prefixedClassGroup];
  });
}
var CLASS_PART_SEPARATOR, arbitraryPropertyRegex;
var init_class_utils = __esm({
  "node_modules/tailwind-merge/dist/lib/class-utils.mjs"() {
    CLASS_PART_SEPARATOR = "-";
    arbitraryPropertyRegex = /^\[(.+)\]$/;
  }
});

// node_modules/tailwind-merge/dist/lib/lru-cache.mjs
function createLruCache(maxCacheSize) {
  if (maxCacheSize < 1) {
    return {
      get: function get() {
        return void 0;
      },
      set: function set() {
      }
    };
  }
  var cacheSize = 0;
  var cache = /* @__PURE__ */ new Map();
  var previousCache = /* @__PURE__ */ new Map();
  function update(key2, value) {
    cache.set(key2, value);
    cacheSize++;
    if (cacheSize > maxCacheSize) {
      cacheSize = 0;
      previousCache = cache;
      cache = /* @__PURE__ */ new Map();
    }
  }
  return {
    get: function get(key2) {
      var value = cache.get(key2);
      if (value !== void 0) {
        return value;
      }
      if ((value = previousCache.get(key2)) !== void 0) {
        update(key2, value);
        return value;
      }
    },
    set: function set(key2, value) {
      if (cache.has(key2)) {
        cache.set(key2, value);
      } else {
        update(key2, value);
      }
    }
  };
}
var init_lru_cache = __esm({
  "node_modules/tailwind-merge/dist/lib/lru-cache.mjs"() {
  }
});

// node_modules/tailwind-merge/dist/lib/modifier-utils.mjs
function createSplitModifiers(config) {
  var separator = config.separator || ":";
  var isSeparatorSingleCharacter = separator.length === 1;
  var firstSeparatorCharacter = separator[0];
  var separatorLength = separator.length;
  return function splitModifiers(className) {
    var modifiers = [];
    var bracketDepth = 0;
    var modifierStart = 0;
    var postfixModifierPosition;
    for (var index8 = 0; index8 < className.length; index8++) {
      var currentCharacter = className[index8];
      if (bracketDepth === 0) {
        if (currentCharacter === firstSeparatorCharacter && (isSeparatorSingleCharacter || className.slice(index8, index8 + separatorLength) === separator)) {
          modifiers.push(className.slice(modifierStart, index8));
          modifierStart = index8 + separatorLength;
          continue;
        }
        if (currentCharacter === "/") {
          postfixModifierPosition = index8;
          continue;
        }
      }
      if (currentCharacter === "[") {
        bracketDepth++;
      } else if (currentCharacter === "]") {
        bracketDepth--;
      }
    }
    var baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.substring(modifierStart);
    var hasImportantModifier = baseClassNameWithImportantModifier.startsWith(IMPORTANT_MODIFIER);
    var baseClassName = hasImportantModifier ? baseClassNameWithImportantModifier.substring(1) : baseClassNameWithImportantModifier;
    var maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0;
    return {
      modifiers,
      hasImportantModifier,
      baseClassName,
      maybePostfixModifierPosition
    };
  };
}
function sortModifiers(modifiers) {
  if (modifiers.length <= 1) {
    return modifiers;
  }
  var sortedModifiers = [];
  var unsortedModifiers = [];
  modifiers.forEach(function(modifier) {
    var isArbitraryVariant = modifier[0] === "[";
    if (isArbitraryVariant) {
      sortedModifiers.push.apply(sortedModifiers, unsortedModifiers.sort().concat([modifier]));
      unsortedModifiers = [];
    } else {
      unsortedModifiers.push(modifier);
    }
  });
  sortedModifiers.push.apply(sortedModifiers, unsortedModifiers.sort());
  return sortedModifiers;
}
var IMPORTANT_MODIFIER;
var init_modifier_utils = __esm({
  "node_modules/tailwind-merge/dist/lib/modifier-utils.mjs"() {
    IMPORTANT_MODIFIER = "!";
  }
});

// node_modules/tailwind-merge/dist/lib/config-utils.mjs
function createConfigUtils(config) {
  return {
    cache: createLruCache(config.cacheSize),
    splitModifiers: createSplitModifiers(config),
    ...createClassUtils(config)
  };
}
var init_config_utils = __esm({
  "node_modules/tailwind-merge/dist/lib/config-utils.mjs"() {
    init_class_utils();
    init_lru_cache();
    init_modifier_utils();
  }
});

// node_modules/tailwind-merge/dist/lib/merge-classlist.mjs
function mergeClassList(classList, configUtils) {
  var splitModifiers = configUtils.splitModifiers, getClassGroupId = configUtils.getClassGroupId, getConflictingClassGroupIds = configUtils.getConflictingClassGroupIds;
  var classGroupsInConflict = /* @__PURE__ */ new Set();
  return classList.trim().split(SPLIT_CLASSES_REGEX).map(function(originalClassName) {
    var _splitModifiers = splitModifiers(originalClassName), modifiers = _splitModifiers.modifiers, hasImportantModifier = _splitModifiers.hasImportantModifier, baseClassName = _splitModifiers.baseClassName, maybePostfixModifierPosition = _splitModifiers.maybePostfixModifierPosition;
    var classGroupId = getClassGroupId(maybePostfixModifierPosition ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
    var hasPostfixModifier = Boolean(maybePostfixModifierPosition);
    if (!classGroupId) {
      if (!maybePostfixModifierPosition) {
        return {
          isTailwindClass: false,
          originalClassName
        };
      }
      classGroupId = getClassGroupId(baseClassName);
      if (!classGroupId) {
        return {
          isTailwindClass: false,
          originalClassName
        };
      }
      hasPostfixModifier = false;
    }
    var variantModifier = sortModifiers(modifiers).join(":");
    var modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
    return {
      isTailwindClass: true,
      modifierId,
      classGroupId,
      originalClassName,
      hasPostfixModifier
    };
  }).reverse().filter(function(parsed) {
    if (!parsed.isTailwindClass) {
      return true;
    }
    var modifierId = parsed.modifierId, classGroupId = parsed.classGroupId, hasPostfixModifier = parsed.hasPostfixModifier;
    var classId = modifierId + classGroupId;
    if (classGroupsInConflict.has(classId)) {
      return false;
    }
    classGroupsInConflict.add(classId);
    getConflictingClassGroupIds(classGroupId, hasPostfixModifier).forEach(function(group) {
      return classGroupsInConflict.add(modifierId + group);
    });
    return true;
  }).reverse().map(function(parsed) {
    return parsed.originalClassName;
  }).join(" ");
}
var SPLIT_CLASSES_REGEX;
var init_merge_classlist = __esm({
  "node_modules/tailwind-merge/dist/lib/merge-classlist.mjs"() {
    init_modifier_utils();
    SPLIT_CLASSES_REGEX = /\s+/;
  }
});

// node_modules/tailwind-merge/dist/lib/create-tailwind-merge.mjs
function createTailwindMerge() {
  for (var _len = arguments.length, createConfig = new Array(_len), _key = 0; _key < _len; _key++) {
    createConfig[_key] = arguments[_key];
  }
  var configUtils;
  var cacheGet;
  var cacheSet;
  var functionToCall = initTailwindMerge;
  function initTailwindMerge(classList) {
    var firstCreateConfig = createConfig[0], restCreateConfig = createConfig.slice(1);
    var config = restCreateConfig.reduce(function(previousConfig, createConfigCurrent) {
      return createConfigCurrent(previousConfig);
    }, firstCreateConfig());
    configUtils = createConfigUtils(config);
    cacheGet = configUtils.cache.get;
    cacheSet = configUtils.cache.set;
    functionToCall = tailwindMerge;
    return tailwindMerge(classList);
  }
  function tailwindMerge(classList) {
    var cachedResult = cacheGet(classList);
    if (cachedResult) {
      return cachedResult;
    }
    var result = mergeClassList(classList, configUtils);
    cacheSet(classList, result);
    return result;
  }
  return function callTailwindMerge() {
    return functionToCall(twJoin.apply(null, arguments));
  };
}
var init_create_tailwind_merge = __esm({
  "node_modules/tailwind-merge/dist/lib/create-tailwind-merge.mjs"() {
    init_config_utils();
    init_merge_classlist();
    init_tw_join();
  }
});

// node_modules/tailwind-merge/dist/lib/from-theme.mjs
function fromTheme(key2) {
  var themeGetter = function themeGetter2(theme) {
    return theme[key2] || [];
  };
  themeGetter.isThemeGetter = true;
  return themeGetter;
}
var init_from_theme = __esm({
  "node_modules/tailwind-merge/dist/lib/from-theme.mjs"() {
  }
});

// node_modules/tailwind-merge/dist/lib/validators.mjs
function isLength(value) {
  return isNumber(value) || stringLengths.has(value) || fractionRegex.test(value) || isArbitraryLength(value);
}
function isArbitraryLength(value) {
  return getIsArbitraryValue(value, "length", isLengthOnly);
}
function isArbitrarySize(value) {
  return getIsArbitraryValue(value, "size", isNever);
}
function isArbitraryPosition(value) {
  return getIsArbitraryValue(value, "position", isNever);
}
function isArbitraryUrl(value) {
  return getIsArbitraryValue(value, "url", isUrl);
}
function isArbitraryNumber(value) {
  return getIsArbitraryValue(value, "number", isNumber);
}
function isNumber(value) {
  return !Number.isNaN(Number(value));
}
function isPercent(value) {
  return value.endsWith("%") && isNumber(value.slice(0, -1));
}
function isInteger(value) {
  return isIntegerOnly(value) || getIsArbitraryValue(value, "number", isIntegerOnly);
}
function isArbitraryValue(value) {
  return arbitraryValueRegex.test(value);
}
function isAny() {
  return true;
}
function isTshirtSize(value) {
  return tshirtUnitRegex.test(value);
}
function isArbitraryShadow(value) {
  return getIsArbitraryValue(value, "", isShadow);
}
function getIsArbitraryValue(value, label, testValue) {
  var result = arbitraryValueRegex.exec(value);
  if (result) {
    if (result[1]) {
      return result[1] === label;
    }
    return testValue(result[2]);
  }
  return false;
}
function isLengthOnly(value) {
  return lengthUnitRegex.test(value);
}
function isNever() {
  return false;
}
function isUrl(value) {
  return value.startsWith("url(");
}
function isIntegerOnly(value) {
  return Number.isInteger(Number(value));
}
function isShadow(value) {
  return shadowRegex.test(value);
}
var arbitraryValueRegex, fractionRegex, stringLengths, tshirtUnitRegex, lengthUnitRegex, shadowRegex;
var init_validators = __esm({
  "node_modules/tailwind-merge/dist/lib/validators.mjs"() {
    arbitraryValueRegex = /^\[(?:([a-z-]+):)?(.+)\]$/i;
    fractionRegex = /^\d+\/\d+$/;
    stringLengths = /* @__PURE__ */ new Set(["px", "full", "screen"]);
    tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
    lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
    shadowRegex = /^-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
  }
});

// node_modules/tailwind-merge/dist/lib/default-config.mjs
function getDefaultConfig() {
  var colors = fromTheme("colors");
  var spacing = fromTheme("spacing");
  var blur = fromTheme("blur");
  var brightness = fromTheme("brightness");
  var borderColor = fromTheme("borderColor");
  var borderRadius = fromTheme("borderRadius");
  var borderSpacing = fromTheme("borderSpacing");
  var borderWidth = fromTheme("borderWidth");
  var contrast = fromTheme("contrast");
  var grayscale = fromTheme("grayscale");
  var hueRotate = fromTheme("hueRotate");
  var invert = fromTheme("invert");
  var gap = fromTheme("gap");
  var gradientColorStops = fromTheme("gradientColorStops");
  var gradientColorStopPositions = fromTheme("gradientColorStopPositions");
  var inset = fromTheme("inset");
  var margin = fromTheme("margin");
  var opacity = fromTheme("opacity");
  var padding = fromTheme("padding");
  var saturate = fromTheme("saturate");
  var scale = fromTheme("scale");
  var sepia = fromTheme("sepia");
  var skew = fromTheme("skew");
  var space = fromTheme("space");
  var translate = fromTheme("translate");
  var getOverscroll = function getOverscroll2() {
    return ["auto", "contain", "none"];
  };
  var getOverflow = function getOverflow2() {
    return ["auto", "hidden", "clip", "visible", "scroll"];
  };
  var getSpacingWithAutoAndArbitrary = function getSpacingWithAutoAndArbitrary2() {
    return ["auto", isArbitraryValue, spacing];
  };
  var getSpacingWithArbitrary = function getSpacingWithArbitrary2() {
    return [isArbitraryValue, spacing];
  };
  var getLengthWithEmpty = function getLengthWithEmpty2() {
    return ["", isLength];
  };
  var getNumberWithAutoAndArbitrary = function getNumberWithAutoAndArbitrary2() {
    return ["auto", isNumber, isArbitraryValue];
  };
  var getPositions = function getPositions2() {
    return ["bottom", "center", "left", "left-bottom", "left-top", "right", "right-bottom", "right-top", "top"];
  };
  var getLineStyles = function getLineStyles2() {
    return ["solid", "dashed", "dotted", "double", "none"];
  };
  var getBlendModes = function getBlendModes2() {
    return ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity", "plus-lighter"];
  };
  var getAlign = function getAlign2() {
    return ["start", "end", "center", "between", "around", "evenly", "stretch"];
  };
  var getZeroAndEmpty = function getZeroAndEmpty2() {
    return ["", "0", isArbitraryValue];
  };
  var getBreaks = function getBreaks2() {
    return ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"];
  };
  var getNumber = function getNumber2() {
    return [isNumber, isArbitraryNumber];
  };
  var getNumberAndArbitrary = function getNumberAndArbitrary2() {
    return [isNumber, isArbitraryValue];
  };
  return {
    cacheSize: 500,
    theme: {
      colors: [isAny],
      spacing: [isLength],
      blur: ["none", "", isTshirtSize, isArbitraryValue],
      brightness: getNumber(),
      borderColor: [colors],
      borderRadius: ["none", "", "full", isTshirtSize, isArbitraryValue],
      borderSpacing: getSpacingWithArbitrary(),
      borderWidth: getLengthWithEmpty(),
      contrast: getNumber(),
      grayscale: getZeroAndEmpty(),
      hueRotate: getNumberAndArbitrary(),
      invert: getZeroAndEmpty(),
      gap: getSpacingWithArbitrary(),
      gradientColorStops: [colors],
      gradientColorStopPositions: [isPercent, isArbitraryLength],
      inset: getSpacingWithAutoAndArbitrary(),
      margin: getSpacingWithAutoAndArbitrary(),
      opacity: getNumber(),
      padding: getSpacingWithArbitrary(),
      saturate: getNumber(),
      scale: getNumber(),
      sepia: getZeroAndEmpty(),
      skew: getNumberAndArbitrary(),
      space: getSpacingWithArbitrary(),
      translate: getSpacingWithArbitrary()
    },
    classGroups: {
      // Layout
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", "video", isArbitraryValue]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [isTshirtSize]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": getBreaks()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": getBreaks()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      "float": [{
        "float": ["right", "left", "none"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: [].concat(getPositions(), [isArbitraryValue])
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: getOverflow()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": getOverflow()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": getOverflow()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: getOverscroll()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": getOverscroll()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": getOverscroll()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: [inset]
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": [inset]
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": [inset]
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: [inset]
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: [inset]
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: [inset]
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: [inset]
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: [inset]
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: [inset]
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: ["auto", isInteger]
      }],
      // Flexbox and Grid
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: getSpacingWithAutoAndArbitrary()
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["wrap", "wrap-reverse", "nowrap"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: ["1", "auto", "initial", "none", isArbitraryValue]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: getZeroAndEmpty()
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: getZeroAndEmpty()
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: ["first", "last", "none", isInteger]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": [isAny]
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ["auto", {
          span: ["full", isInteger]
        }, isArbitraryValue]
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": [isAny]
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ["auto", {
          span: [isInteger]
        }, isArbitraryValue]
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": getNumberWithAutoAndArbitrary()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": ["auto", "min", "max", "fr", isArbitraryValue]
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": ["auto", "min", "max", "fr", isArbitraryValue]
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: [gap]
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": [gap]
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": [gap]
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: ["normal"].concat(getAlign())
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": ["start", "end", "center", "stretch"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", "start", "end", "center", "stretch"]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal"].concat(getAlign(), ["baseline"])
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", "start", "end", "center", "stretch", "baseline"]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": [].concat(getAlign(), ["baseline"])
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": ["start", "end", "center", "baseline", "stretch"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", "start", "end", "center", "stretch"]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: [padding]
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: [padding]
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: [padding]
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: [padding]
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: [padding]
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: [padding]
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: [padding]
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: [padding]
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: [padding]
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: [margin]
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: [margin]
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: [margin]
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: [margin]
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: [margin]
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: [margin]
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: [margin]
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: [margin]
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: [margin]
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/space
       */
      "space-x": [{
        "space-x": [space]
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/space
       */
      "space-y": [{
        "space-y": [space]
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/space
       */
      "space-y-reverse": ["space-y-reverse"],
      // Sizing
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: ["auto", "min", "max", "fit", isArbitraryValue, spacing]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": ["min", "max", "fit", isArbitraryValue, isLength]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": ["0", "none", "full", "min", "max", "fit", "prose", {
          screen: [isTshirtSize]
        }, isTshirtSize, isArbitraryValue]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: [isArbitraryValue, spacing, "auto", "min", "max", "fit"]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["min", "max", "fit", isArbitraryValue, isLength]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": [isArbitraryValue, spacing, "min", "max", "fit"]
      }],
      // Typography
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", isTshirtSize, isArbitraryLength]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black", isArbitraryNumber]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [isAny]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractons"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest", isArbitraryValue]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": ["none", isNumber, isArbitraryNumber]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose", isArbitraryValue, isLength]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", isArbitraryValue]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["none", "disc", "decimal", isArbitraryValue]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: [colors]
      }],
      /**
       * Placeholder Opacity
       * @see https://tailwindcss.com/docs/placeholder-opacity
       */
      "placeholder-opacity": [{
        "placeholder-opacity": [opacity]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: [colors]
      }],
      /**
       * Text Opacity
       * @see https://tailwindcss.com/docs/text-opacity
       */
      "text-opacity": [{
        "text-opacity": [opacity]
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [].concat(getLineStyles(), ["wavy"])
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: ["auto", "from-font", isLength]
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": ["auto", isArbitraryValue, isLength]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: [colors]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: getSpacingWithArbitrary()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", isArbitraryValue]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      "break": [{
        "break": ["normal", "words", "all", "keep"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", isArbitraryValue]
      }],
      // Backgrounds
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Opacity
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/background-opacity
       */
      "bg-opacity": [{
        "bg-opacity": [opacity]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: [].concat(getPositions(), [isArbitraryPosition])
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: ["no-repeat", {
          repeat: ["", "x", "y", "round", "space"]
        }]
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: ["auto", "cover", "contain", isArbitrarySize]
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          "gradient-to": ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
        }, isArbitraryUrl]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: [colors]
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: [gradientColorStopPositions]
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: [gradientColorStops]
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: [gradientColorStops]
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: [gradientColorStops]
      }],
      // Borders
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: [borderRadius]
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": [borderRadius]
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": [borderRadius]
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": [borderRadius]
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": [borderRadius]
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": [borderRadius]
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": [borderRadius]
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": [borderRadius]
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": [borderRadius]
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": [borderRadius]
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": [borderRadius]
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": [borderRadius]
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": [borderRadius]
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": [borderRadius]
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": [borderRadius]
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: [borderWidth]
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": [borderWidth]
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": [borderWidth]
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": [borderWidth]
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": [borderWidth]
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": [borderWidth]
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": [borderWidth]
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": [borderWidth]
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": [borderWidth]
      }],
      /**
       * Border Opacity
       * @see https://tailwindcss.com/docs/border-opacity
       */
      "border-opacity": [{
        "border-opacity": [opacity]
      }],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [].concat(getLineStyles(), ["hidden"])
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x": [{
        "divide-x": [borderWidth]
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y": [{
        "divide-y": [borderWidth]
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/divide-width
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Divide Opacity
       * @see https://tailwindcss.com/docs/divide-opacity
       */
      "divide-opacity": [{
        "divide-opacity": [opacity]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/divide-style
       */
      "divide-style": [{
        divide: getLineStyles()
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: [borderColor]
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": [borderColor]
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": [borderColor]
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": [borderColor]
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": [borderColor]
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": [borderColor]
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": [borderColor]
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: [borderColor]
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [""].concat(getLineStyles())
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [isArbitraryValue, isLength]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: [isLength]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: [colors]
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w": [{
        ring: getLengthWithEmpty()
      }],
      /**
       * Ring Width Inset
       * @see https://tailwindcss.com/docs/ring-width
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/ring-color
       */
      "ring-color": [{
        ring: [colors]
      }],
      /**
       * Ring Opacity
       * @see https://tailwindcss.com/docs/ring-opacity
       */
      "ring-opacity": [{
        "ring-opacity": [opacity]
      }],
      /**
       * Ring Offset Width
       * @see https://tailwindcss.com/docs/ring-offset-width
       */
      "ring-offset-w": [{
        "ring-offset": [isLength]
      }],
      /**
       * Ring Offset Color
       * @see https://tailwindcss.com/docs/ring-offset-color
       */
      "ring-offset-color": [{
        "ring-offset": [colors]
      }],
      // Effects
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: ["", "inner", "none", isTshirtSize, isArbitraryShadow]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow-color
       */
      "shadow-color": [{
        shadow: [isAny]
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [opacity]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": getBlendModes()
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": getBlendModes()
      }],
      // Filters
      /**
       * Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: ["", "none"]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: [blur]
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [brightness]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [contrast]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": ["", "none", isTshirtSize, isArbitraryValue]
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: [grayscale]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [hueRotate]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: [invert]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [saturate]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: [sepia]
      }],
      /**
       * Backdrop Filter
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": ["", "none"]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": [blur]
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [brightness]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [contrast]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": [grayscale]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [hueRotate]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": [invert]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [opacity]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [saturate]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": [sepia]
      }],
      // Tables
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": [borderSpacing]
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": [borderSpacing]
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": [borderSpacing]
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // Transitions and Animation
      /**
       * Tranisition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["none", "all", "", "colors", "opacity", "shadow", "transform", isArbitraryValue]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: getNumberAndArbitrary()
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "in", "out", "in-out", isArbitraryValue]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: getNumberAndArbitrary()
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", "spin", "ping", "pulse", "bounce", isArbitraryValue]
      }],
      // Transforms
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: ["", "gpu", "none"]
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: [scale]
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": [scale]
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": [scale]
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: [isInteger, isArbitraryValue]
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": [translate]
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": [translate]
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": [skew]
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": [skew]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: ["center", "top", "top-right", "right", "bottom-right", "bottom", "bottom-left", "left", "top-left", isArbitraryValue]
      }],
      // Interactivity
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: ["auto", colors]
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: ["appearance-none"],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", isArbitraryValue]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: [colors]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["none", "auto"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "y", "x", ""]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": getSpacingWithArbitrary()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "pinch-zoom", "manipulation", {
          pan: ["x", "left", "right", "y", "up", "down"]
        }]
      }],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", isArbitraryValue]
      }],
      // SVG
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: [colors, "none"]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [isLength, isArbitraryNumber]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: [colors, "none"]
      }],
      // Accessibility
      /**
       * Screen Readers
       * @see https://tailwindcss.com/docs/screen-readers
       */
      sr: ["sr-only", "not-sr-only"]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    }
  };
}
var init_default_config = __esm({
  "node_modules/tailwind-merge/dist/lib/default-config.mjs"() {
    init_from_theme();
    init_validators();
  }
});

// node_modules/tailwind-merge/dist/lib/tw-merge.mjs
var twMerge;
var init_tw_merge = __esm({
  "node_modules/tailwind-merge/dist/lib/tw-merge.mjs"() {
    init_create_tailwind_merge();
    init_default_config();
    twMerge = /* @__PURE__ */ createTailwindMerge(getDefaultConfig);
  }
});

// node_modules/tailwind-merge/dist/tailwind-merge.mjs
var init_tailwind_merge = __esm({
  "node_modules/tailwind-merge/dist/tailwind-merge.mjs"() {
    init_tw_merge();
  }
});

// .svelte-kit/output/server/chunks/TopBanner.js
var NavBrand, css, TopBanner;
var init_TopBanner = __esm({
  ".svelte-kit/output/server/chunks/TopBanner.js"() {
    init_ssr();
    init_tailwind_merge();
    NavBrand = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$restProps = compute_rest_props($$props, ["href"]);
      let { href = "" } = $$props;
      if ($$props.href === void 0 && $$bindings.href && href !== void 0)
        $$bindings.href(href);
      return `<a${spread(
        [
          { href: escape_attribute_value(href) },
          escape_object($$restProps),
          {
            class: escape_attribute_value(twMerge("flex items-center", $$props.class))
          }
        ],
        {}
      )}>${slots.default ? slots.default({}) : ``}</a> `;
    });
    css = {
      code: ".nav-links.svelte-120htaj{display:flex;gap:10px;color:var(--offwhite);font-weight:600}.navbar.svelte-120htaj{position:sticky;top:0px;z-index:1;background:rgba(14, 43, 74, 0.888);display:flex;align-items:center;justify-content:space-between;padding-top:2%;padding-left:8%;padding-right:8%;max-height:100px}.mainlogo.svelte-120htaj{transform:scale(95%);transition:transform 0.2s}.mainlogo.svelte-120htaj:hover{transform:scale(100%)}@media(max-width: 768px){.navbar.svelte-120htaj{padding-top:3%;padding-bottom:3%;padding-left:3%;padding-right:3%}}@media(min-width: 1500px){.navbar.svelte-120htaj{padding-top:2%;padding-bottom:2%;padding-left:20%;padding-right:20%}}",
      map: null
    };
    TopBanner = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css);
      return `<div class="navbar svelte-120htaj"><div>${validate_component(NavBrand, "NavBrand").$$render($$result, { href: "/" }, {}, {
        default: () => {
          return `<img src="/logo.png" class="mainlogo svelte-120htaj" alt="OpenRXN">`;
        }
      })}</div> <nav class="nav-links svelte-120htaj">${``} <button href="/home" style="${"text-decoration: " + escape("none", true)}">Home</button>
      |
      <button href="/about" style="${"text-decoration: " + escape("none", true)}">About</button></nav> </div>`;
    });
  }
});

// .svelte-kit/output/server/entries/pages/_page.svelte.js
var page_svelte_exports = {};
__export(page_svelte_exports, {
  default: () => Page
});
var css$2, interval, IntroInfo, css$1, LandingPageContent, css2, Page;
var init_page_svelte = __esm({
  ".svelte-kit/output/server/entries/pages/_page.svelte.js"() {
    init_ssr();
    init_TopBanner();
    css$2 = {
      code: "h1.svelte-1ww5z53{font-weight:600}.sub-heading.svelte-1ww5z53{width:100%;margin-bottom:15pt}.bold.svelte-1ww5z53{font-weight:bold}.rotating-text.svelte-1ww5z53{display:flex;margin-top:10pt;margin-bottom:10pt}.half.svelte-1ww5z53{flex-basis:50%;display:flex}.fixed-word.svelte-1ww5z53{margin-left:auto}.highlighted-word.svelte-1ww5z53{margin-right:auto}@media(max-width: 768px){.rotating-text.svelte-1ww5z53{padding-bottom:2%}h2.svelte-1ww5z53{font-size:20px}.fixed-word.svelte-1ww5z53{margin-right:0}.highlighted-word.svelte-1ww5z53{margin-left:0}}",
      map: null
    };
    interval = 2e3;
    IntroInfo = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      const words = [" Health.", " Medication.", "Journey.", "Insight."];
      let currentIndex = 0;
      let currentWord = words[currentIndex];
      const rotateText = () => {
        currentIndex = (currentIndex + 1) % words.length;
        currentWord = words[currentIndex];
      };
      setInterval(rotateText, interval);
      $$result.css.add(css$2);
      return `<div class="rotating-text svelte-1ww5z53"><div class="half svelte-1ww5z53" data-svelte-h="svelte-1a73zgs"><h1 class="fixed-word svelte-1ww5z53">Your</h1></div>
  \xA0\xA0
  <div class="half svelte-1ww5z53"><h1 class="highlighted-word svelte-1ww5z53">${escape(currentWord)}</h1></div></div> ${``}`;
    });
    css$1 = {
      code: ".imgdiv.svelte-ymxa46{min-width:50%;max-width:50%;height:auto;width:auto}.content-container.svelte-ymxa46{display:flex;flex-direction:column;gap:20px}.text-info.svelte-ymxa46{max-width:50%;padding-left:4%;padding-right:4%;display:flex;flex-direction:column;justify-content:center;color:white;font-size:12pt}.info-row.svelte-ymxa46{display:flex;flex-direction:row;justify-content:space-around;padding-left:2%;padding-right:2%;padding-top:5%;padding-bottom:5%}.disclaimer-container.svelte-ymxa46{padding-top:5%;max-width:90%;margin:auto;padding-bottom:5%}.numbersdiv.svelte-ymxa46{display:flex;flex-direction:column;align-items:center;padding-top:4%}hr.svelte-ymxa46{opacity:0.5;width:80%;margin:auto}.transparenttext.svelte-ymxa46{padding-top:2%;color:white;opacity:0.5}.numbertext.svelte-ymxa46{color:white;font-weight:bold;font-size:50pt}.divbg.svelte-ymxa46{max-width:50%;margin:auto}.buttondiv.svelte-ymxa46{padding-top:3%}.infonote.svelte-ymxa46{margin:auto;max-width:90%;padding-top:5%;padding-bottom:10%;text-align:center}@media(max-width: 768px){.disclaimer-container.svelte-ymxa46{padding-bottom:10%}.buttondiv.svelte-ymxa46{padding-top:5%}.divbg.svelte-ymxa46{max-width:95%;margin:auto}.infonote.svelte-ymxa46{padding-top:10%}}",
      map: null
    };
    LandingPageContent = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css$1);
      return `${``}`;
    });
    css2 = {
      code: ".intro-container.svelte-1y6roqi{padding-top:10%;padding-left:8%;padding-right:8%}",
      map: null
    };
    Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css2);
      return `${validate_component(TopBanner, "TopBanner").$$render($$result, {}, {}, {})} <div class="intro-container svelte-1y6roqi">${validate_component(IntroInfo, "IntroInfo").$$render($$result, {}, {}, {})}</div> ${validate_component(LandingPageContent, "LandingPageContent").$$render($$result, {}, {}, {})}`;
    });
  }
});

// .svelte-kit/output/server/nodes/2.js
var __exports3 = {};
__export(__exports3, {
  component: () => component3,
  fonts: () => fonts3,
  imports: () => imports3,
  index: () => index3,
  stylesheets: () => stylesheets3
});
var index3, component_cache3, component3, imports3, stylesheets3, fonts3;
var init__3 = __esm({
  ".svelte-kit/output/server/nodes/2.js"() {
    index3 = 2;
    component3 = async () => component_cache3 ??= (await Promise.resolve().then(() => (init_page_svelte(), page_svelte_exports))).default;
    imports3 = ["_app/immutable/nodes/2.058b4447.js", "_app/immutable/chunks/scheduler.b62641ca.js", "_app/immutable/chunks/index.91daa77f.js", "_app/immutable/chunks/TopBanner.b7ca72bd.js", "_app/immutable/chunks/singletons.ad51fe39.js", "_app/immutable/chunks/MedicalDisclaimer.d621663c.js"];
    stylesheets3 = ["_app/immutable/assets/2.1621713b.css", "_app/immutable/assets/TopBanner.05adf756.css", "_app/immutable/assets/MedicalDisclaimer.e07ba00b.css"];
    fonts3 = [];
  }
});

// .svelte-kit/output/server/entries/pages/about/_page.svelte.js
var page_svelte_exports2 = {};
__export(page_svelte_exports2, {
  default: () => Page2
});
var css3, Page2;
var init_page_svelte2 = __esm({
  ".svelte-kit/output/server/entries/pages/about/_page.svelte.js"() {
    init_ssr();
    init_TopBanner();
    css3 = {
      code: "#what_conditions_are_supported.svelte-12339hj.svelte-12339hj{scroll-margin-top:75px}#what_medications_are_supported.svelte-12339hj.svelte-12339hj{scroll-margin-top:75px}h2.svelte-12339hj.svelte-12339hj{text-align:center;margin-top:2rem;margin-bottom:2rem;color:white;font-style:italic;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:8px;text-decoration-style:solid;text-decoration-skip-ink:none}p.svelte-12339hj.svelte-12339hj{font-size:medium;color:white}.textbox.svelte-12339hj.svelte-12339hj{padding-top:1rem;padding-bottom:2rem;margin-left:10%;margin-right:10%}.columnscontainer.svelte-12339hj.svelte-12339hj{display:flex}.column.svelte-12339hj.svelte-12339hj{text-align:center;flex:1}.columnscontainer.svelte-12339hj li.svelte-12339hj::marker{color:rgba(255, 255, 255, 0)}.githublinkedin.svelte-12339hj.svelte-12339hj{display:flex;justify-content:space-evenly}@media(max-width: 768px){p.svelte-12339hj.svelte-12339hj{font-size:14pt}a.svelte-12339hj.svelte-12339hj{font-size:14pt}.columnscontainer.svelte-12339hj.svelte-12339hj{flex-wrap:wrap}.column.svelte-12339hj.svelte-12339hj{width:100%;flex:0 0 100%;text-align:left}}",
      map: null
    };
    Page2 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      $$result.css.add(css3);
      return `${validate_component(TopBanner, "TopBanner").$$render($$result, {}, {}, {})} ${``}`;
    });
  }
});

// .svelte-kit/output/server/nodes/3.js
var __exports4 = {};
__export(__exports4, {
  component: () => component4,
  fonts: () => fonts4,
  imports: () => imports4,
  index: () => index4,
  stylesheets: () => stylesheets4
});
var index4, component_cache4, component4, imports4, stylesheets4, fonts4;
var init__4 = __esm({
  ".svelte-kit/output/server/nodes/3.js"() {
    index4 = 3;
    component4 = async () => component_cache4 ??= (await Promise.resolve().then(() => (init_page_svelte2(), page_svelte_exports2))).default;
    imports4 = ["_app/immutable/nodes/3.22f8a320.js", "_app/immutable/chunks/scheduler.b62641ca.js", "_app/immutable/chunks/index.91daa77f.js", "_app/immutable/chunks/each.7fd2ffb1.js", "_app/immutable/chunks/TopBanner.b7ca72bd.js", "_app/immutable/chunks/singletons.ad51fe39.js"];
    stylesheets4 = ["_app/immutable/assets/3.68c340a0.css", "_app/immutable/assets/TopBanner.05adf756.css"];
    fonts4 = [];
  }
});

// .svelte-kit/output/server/entries/pages/auth/_page.server.js
var page_server_exports = {};
var init_page_server = __esm({
  ".svelte-kit/output/server/entries/pages/auth/_page.server.js"() {
  }
});

// .svelte-kit/output/server/entries/pages/auth/_page.svelte.js
var page_svelte_exports3 = {};
__export(page_svelte_exports3, {
  default: () => Page3
});
var css4, Page3;
var init_page_svelte3 = __esm({
  ".svelte-kit/output/server/entries/pages/auth/_page.svelte.js"() {
    init_ssr();
    init_TopBanner();
    init_pocketbase_es();
    css4 = {
      code: "ul.svelte-1ggxx7h.svelte-1ggxx7h{list-style-type:disc;font-size:12pt;color:white;padding-left:1rem}h1.svelte-1ggxx7h.svelte-1ggxx7h{text-align:center;padding-top:2rem;padding-bottom:2rem}h3.svelte-1ggxx7h.svelte-1ggxx7h{text-align:left;font-size:16pt;padding-top:2rem}li.svelte-1ggxx7h.svelte-1ggxx7h{padding-top:1rem;font-size:12pt}.textbox.svelte-1ggxx7h.svelte-1ggxx7h{margin-left:10%;margin-right:10%}.buttondiv.svelte-1ggxx7h.svelte-1ggxx7h{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px}.gsi-material-button.svelte-1ggxx7h.svelte-1ggxx7h{-moz-user-select:none;-webkit-user-select:none;-ms-user-select:none;-webkit-appearance:none;background-color:WHITE;background-image:none;border:1px solid #747775;-webkit-border-radius:4px;border-radius:4px;-webkit-box-sizing:border-box;box-sizing:border-box;color:#1f1f1f;cursor:pointer;font-family:'Roboto', arial, sans-serif;font-size:14px;height:40px;letter-spacing:0.25px;outline:none;overflow:hidden;padding:0 12px;position:relative;text-align:center;-webkit-transition:background-color .218s, border-color .218s, box-shadow .218s;transition:background-color .218s, border-color .218s, box-shadow .218s;vertical-align:middle;white-space:nowrap;width:auto;max-width:400px;min-width:min-content}.gsi-material-button.svelte-1ggxx7h .gsi-material-button-icon.svelte-1ggxx7h{height:20px;margin-right:12px;min-width:20px;width:20px}.gsi-material-button.svelte-1ggxx7h .gsi-material-button-content-wrapper.svelte-1ggxx7h{-webkit-align-items:center;align-items:center;display:flex;-webkit-flex-direction:row;flex-direction:row;-webkit-flex-wrap:nowrap;flex-wrap:nowrap;height:100%;justify-content:space-between;position:relative;width:100%}.gsi-material-button.svelte-1ggxx7h .gsi-material-button-contents.svelte-1ggxx7h{-webkit-flex-grow:1;flex-grow:1;font-family:'Roboto', arial, sans-serif;font-weight:500;overflow:hidden;text-overflow:ellipsis;vertical-align:top}.gsi-material-button.svelte-1ggxx7h .gsi-material-button-state.svelte-1ggxx7h{-webkit-transition:opacity .218s;transition:opacity .218s;bottom:0;left:0;opacity:0;position:absolute;right:0;top:0}.gsi-material-button.svelte-1ggxx7h.svelte-1ggxx7h:disabled{cursor:default;background-color:#ffffff61;border-color:#1f1f1f1f}.gsi-material-button.svelte-1ggxx7h:disabled .gsi-material-button-contents.svelte-1ggxx7h{opacity:38%}.gsi-material-button.svelte-1ggxx7h:disabled .gsi-material-button-icon.svelte-1ggxx7h{opacity:38%}.gsi-material-button.svelte-1ggxx7h:not(:disabled):active .gsi-material-button-state.svelte-1ggxx7h,.gsi-material-button.svelte-1ggxx7h:not(:disabled):focus .gsi-material-button-state.svelte-1ggxx7h{background-color:#303030;opacity:12%}.gsi-material-button.svelte-1ggxx7h.svelte-1ggxx7h:not(:disabled):hover{-webkit-box-shadow:0 1px 2px 0 rgba(60, 64, 67, .30), 0 1px 3px 1px rgba(60, 64, 67, .15);box-shadow:0 1px 2px 0 rgba(60, 64, 67, .30), 0 1px 3px 1px rgba(60, 64, 67, .15)}.gsi-material-button.svelte-1ggxx7h:not(:disabled):hover .gsi-material-button-state.svelte-1ggxx7h{background-color:#303030;opacity:8%}",
      map: null
    };
    Page3 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      new Client("https://pb.openrxn.com");
      $$result.css.add(css4);
      return `${validate_component(TopBanner, "TopBanner").$$render($$result, {}, {}, {})} ${``}`;
    });
  }
});

// .svelte-kit/output/server/nodes/4.js
var __exports5 = {};
__export(__exports5, {
  component: () => component5,
  fonts: () => fonts5,
  imports: () => imports5,
  index: () => index5,
  server: () => page_server_exports,
  server_id: () => server_id,
  stylesheets: () => stylesheets5
});
var index5, component_cache5, component5, server_id, imports5, stylesheets5, fonts5;
var init__5 = __esm({
  ".svelte-kit/output/server/nodes/4.js"() {
    init_page_server();
    index5 = 4;
    component5 = async () => component_cache5 ??= (await Promise.resolve().then(() => (init_page_svelte3(), page_svelte_exports3))).default;
    server_id = "src/routes/auth/+page.server.js";
    imports5 = ["_app/immutable/nodes/4.71e6f5ee.js", "_app/immutable/chunks/scheduler.b62641ca.js", "_app/immutable/chunks/index.91daa77f.js", "_app/immutable/chunks/TopBanner.b7ca72bd.js", "_app/immutable/chunks/singletons.ad51fe39.js", "_app/immutable/chunks/pocketbase.es.baadb37e.js"];
    stylesheets5 = ["_app/immutable/assets/4.1af319d0.css", "_app/immutable/assets/TopBanner.05adf756.css"];
    fonts5 = [];
  }
});

// .svelte-kit/output/server/entries/pages/home/_page.server.js
var page_server_exports2 = {};
__export(page_server_exports2, {
  load: () => load
});
async function load({ request, params }) {
  return {
    credits_remaining: 10
  };
}
var init_page_server2 = __esm({
  ".svelte-kit/output/server/entries/pages/home/_page.server.js"() {
    init_chunks();
  }
});

// .svelte-kit/output/server/entries/pages/home/_page.svelte.js
var page_svelte_exports4 = {};
__export(page_svelte_exports4, {
  default: () => Page4
});
function is_void(name) {
  return void_element_names.test(name) || name.toLowerCase() === "!doctype";
}
var void_element_names, Button, ButtonGroup, MessagesSolid, css5, Page4;
var init_page_svelte4 = __esm({
  ".svelte-kit/output/server/entries/pages/home/_page.svelte.js"() {
    init_ssr();
    init_TopBanner();
    init_pocketbase_es();
    init_tailwind_merge();
    init_stores();
    void_element_names = /^(?:area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/;
    Button = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$restProps = compute_rest_props($$props, ["pill", "outline", "size", "href", "type", "color", "shadow"]);
      const group = getContext("group");
      let { pill = false } = $$props;
      let { outline = false } = $$props;
      let { size = group ? "sm" : "md" } = $$props;
      let { href = void 0 } = $$props;
      let { type = "button" } = $$props;
      let { color = group ? outline ? "dark" : "alternative" : "primary" } = $$props;
      let { shadow = false } = $$props;
      const colorClasses = {
        alternative: "text-gray-900 bg-white border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-400 hover:text-primary-700 focus:text-primary-700 dark:focus:text-white dark:hover:text-white",
        blue: "text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700",
        dark: "text-white bg-gray-800 hover:bg-gray-900 dark:bg-gray-800 dark:hover:bg-gray-700",
        green: "text-white bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700",
        light: "text-gray-900 bg-white border border-gray-300 hover:bg-gray-100 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600",
        primary: "text-white bg-primary-700 hover:bg-primary-800 dark:bg-primary-600 dark:hover:bg-primary-700",
        purple: "text-white bg-purple-700 hover:bg-purple-800 dark:bg-purple-600 dark:hover:bg-purple-700",
        red: "text-white bg-red-700 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700",
        yellow: "text-white bg-yellow-400 hover:bg-yellow-500 ",
        none: ""
      };
      const coloredFocusClasses = {
        alternative: "focus:ring-gray-200 dark:focus:ring-gray-700",
        blue: "focus:ring-blue-300 dark:focus:ring-blue-800",
        dark: "focus:ring-gray-300 dark:focus:ring-gray-700",
        green: "focus:ring-green-300 dark:focus:ring-green-800",
        light: "focus:ring-gray-200 dark:focus:ring-gray-700",
        primary: "focus:ring-primary-300 dark:focus:ring-primary-800",
        purple: "focus:ring-purple-300 dark:focus:ring-purple-900",
        red: "focus:ring-red-300 dark:focus:ring-red-900",
        yellow: "focus:ring-yellow-300 dark:focus:ring-yellow-900",
        none: ""
      };
      const coloredShadowClasses = {
        alternative: "shadow-gray-500/50 dark:shadow-gray-800/80",
        blue: "shadow-blue-500/50 dark:shadow-blue-800/80",
        dark: "shadow-gray-500/50 dark:shadow-gray-800/80",
        green: "shadow-green-500/50 dark:shadow-green-800/80",
        light: "shadow-gray-500/50 dark:shadow-gray-800/80",
        primary: "shadow-primary-500/50 dark:shadow-primary-800/80",
        purple: "shadow-purple-500/50 dark:shadow-purple-800/80",
        red: "shadow-red-500/50 dark:shadow-red-800/80 ",
        yellow: "shadow-yellow-500/50 dark:shadow-yellow-800/80 ",
        none: ""
      };
      const outlineClasses = {
        alternative: "text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:bg-gray-900 focus:text-white focus:ring-gray-300 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800",
        blue: "text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600",
        dark: "text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:bg-gray-900 focus:text-white dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-600",
        green: "text-green-700 hover:text-white border border-green-700 hover:bg-green-800 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600",
        light: "text-gray-500 hover:text-gray-900 bg-white border border-gray-200 dark:border-gray-600 dark:hover:text-white dark:text-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600",
        primary: "text-primary-700 hover:text-white border border-primary-700 hover:bg-primary-700 dark:border-primary-500 dark:text-primary-500 dark:hover:text-white dark:hover:bg-primary-600",
        purple: "text-purple-700 hover:text-white border border-purple-700 hover:bg-purple-800 dark:border-purple-400 dark:text-purple-400 dark:hover:text-white dark:hover:bg-purple-500",
        red: "text-red-700 hover:text-white border border-red-700 hover:bg-red-800 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600",
        yellow: "text-yellow-400 hover:text-white border border-yellow-400 hover:bg-yellow-500 dark:border-yellow-300 dark:text-yellow-300 dark:hover:text-white dark:hover:bg-yellow-400",
        none: ""
      };
      const sizeClasses = {
        xs: "px-3 py-2 text-xs",
        sm: "px-4 py-2 text-sm",
        md: "px-5 py-2.5 text-sm",
        lg: "px-5 py-3 text-base",
        xl: "px-6 py-3.5 text-base"
      };
      const hasBorder = () => outline || color === "alternative" || color === "light";
      let buttonClass;
      if ($$props.pill === void 0 && $$bindings.pill && pill !== void 0)
        $$bindings.pill(pill);
      if ($$props.outline === void 0 && $$bindings.outline && outline !== void 0)
        $$bindings.outline(outline);
      if ($$props.size === void 0 && $$bindings.size && size !== void 0)
        $$bindings.size(size);
      if ($$props.href === void 0 && $$bindings.href && href !== void 0)
        $$bindings.href(href);
      if ($$props.type === void 0 && $$bindings.type && type !== void 0)
        $$bindings.type(type);
      if ($$props.color === void 0 && $$bindings.color && color !== void 0)
        $$bindings.color(color);
      if ($$props.shadow === void 0 && $$bindings.shadow && shadow !== void 0)
        $$bindings.shadow(shadow);
      buttonClass = twMerge(
        "text-center font-medium",
        group ? "focus:ring-2" : "focus:ring-4",
        group && "focus:z-10",
        group || "focus:outline-none",
        "inline-flex items-center justify-center " + sizeClasses[size],
        outline ? outlineClasses[color] : colorClasses[color],
        color === "alternative" && (group ? "dark:bg-gray-700 dark:text-white dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-600" : "dark:bg-transparent dark:border-gray-600 dark:hover:border-gray-700"),
        outline && color === "dark" && (group ? "dark:text-white dark:border-white" : "dark:text-gray-400 dark:border-gray-700"),
        coloredFocusClasses[color],
        hasBorder() && group && "border-l-0 first:border-l",
        group ? pill && "first:rounded-l-full last:rounded-r-full" || "first:rounded-l-lg last:rounded-r-lg" : pill && "rounded-full" || "rounded-lg",
        shadow && "shadow-lg",
        shadow && coloredShadowClasses[color],
        $$props.disabled && "cursor-not-allowed opacity-50",
        $$props.class
      );
      return `${((tag) => {
        return tag ? `<${href ? "a" : "button"}${spread(
          [
            {
              type: escape_attribute_value(href ? void 0 : type)
            },
            { href: escape_attribute_value(href) },
            {
              role: escape_attribute_value(href ? "link" : "button")
            },
            escape_object($$restProps),
            {
              class: escape_attribute_value(buttonClass)
            }
          ],
          {}
        )}>${is_void(tag) ? "" : `${slots.default ? slots.default({}) : ``}`}${is_void(tag) ? "" : `</${tag}>`}` : "";
      })(href ? "a" : "button")} `;
    });
    ButtonGroup = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$restProps = compute_rest_props($$props, ["size", "divClass"]);
      let { size = "md" } = $$props;
      let { divClass = "inline-flex rounded-lg shadow-sm" } = $$props;
      setContext("group", { size });
      if ($$props.size === void 0 && $$bindings.size && size !== void 0)
        $$bindings.size(size);
      if ($$props.divClass === void 0 && $$bindings.divClass && divClass !== void 0)
        $$bindings.divClass(divClass);
      return `<div${spread(
        [
          escape_object($$restProps),
          {
            class: escape_attribute_value(twMerge(divClass, $$props.class))
          },
          { role: "group" }
        ],
        {}
      )}>${slots.default ? slots.default({}) : ``}</div> `;
    });
    MessagesSolid = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $$restProps = compute_rest_props($$props, ["size", "role", "ariaLabel"]);
      const ctx = getContext("iconCtx") ?? {};
      const sizes = {
        xs: "w-3 h-3",
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
        xl: "w-8 h-8"
      };
      let { size = ctx.size || "md" } = $$props;
      let { role = ctx.role || "img" } = $$props;
      let { ariaLabel = "messages solid" } = $$props;
      if ($$props.size === void 0 && $$bindings.size && size !== void 0)
        $$bindings.size(size);
      if ($$props.role === void 0 && $$bindings.role && role !== void 0)
        $$bindings.role(role);
      if ($$props.ariaLabel === void 0 && $$bindings.ariaLabel && ariaLabel !== void 0)
        $$bindings.ariaLabel(ariaLabel);
      return `<svg${spread(
        [
          { xmlns: "http://www.w3.org/2000/svg" },
          { fill: "currentColor" },
          escape_object($$restProps),
          {
            class: escape_attribute_value(twMerge("shrink-0", sizes[size], $$props.class))
          },
          { role: escape_attribute_value(role) },
          {
            "aria-label": escape_attribute_value(ariaLabel)
          },
          { viewBox: "0 0 20 18" }
        ],
        {}
      )}><path fill="#fff" d="M8 5h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-2v3l-4-3H8a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"></path><path fill="currentColor" d="M18 4h-2v5a4 4 0 0 1-4 4H9l-2.162 1.621c.338.245.744.378 1.162.379h3.667l3.733 2.8A1 1 0 0 0 17 17v-2h1a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"></path><path fill="#fff" d="M12 1H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h2v3l4-3h4a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"></path><path fill="currentColor" d="M4 14a1 1 0 0 1-1-1v-2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H8.333L4.6 13.8a1 1 0 0 1-.6.2Z"></path></svg> `;
    });
    css5 = {
      code: "p.svelte-46yqq4{color:#202142;font-size:12pt;font-weight:bold}.entirepage.svelte-46yqq4{height:100vh;display:flex;flex-direction:column}.divbg.svelte-46yqq4{display:flex;flex-direction:column;margin-top:20px;flex:1;margin-bottom:20px}.buttongroup.svelte-46yqq4{display:flex;justify-content:center}@media(max-width: 768px){.divbg.svelte-46yqq4{margin-left:0px;margin-right:0px;margin-bottom:0px;border-radius:20px}}",
      map: null
    };
    Page4 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      let $page, $$unsubscribe_page;
      $$unsubscribe_page = subscribe(page, (value) => $page = value);
      const path = $page.url.searchParams.get("path");
      let { data } = $$props;
      let currentTab = "searchTab";
      if (path === "searchTab") {
        currentTab = "searchTab";
      } else if (path === "chatTab") {
        currentTab = "chatTab";
      } else if (path === "anecdoteTab") {
        currentTab = "anecdoteTab";
      }
      if ($$props.data === void 0 && $$bindings.data && data !== void 0)
        $$bindings.data(data);
      $$result.css.add(css5);
      $$unsubscribe_page();
      return `<div class="entirepage svelte-46yqq4">${validate_component(TopBanner, "TopBanner").$$render($$result, {}, {}, {})} <div class="buttongroup svelte-46yqq4">${validate_component(ButtonGroup, "ButtonGroup").$$render($$result, {}, {}, {
        default: () => {
          return `${validate_component(Button, "Button").$$render(
            $$result,
            {
              class: "bg-slate-200",
              style: "color: " + (currentTab === "searchTab" ? "#43bbde" : "gray")
            },
            {},
            {
              default: () => {
                return `<svg class="w-5 h-5 me-2" height="200px" width="200px" version="1.1" id="_x32_" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xml:space="preserve"${add_attribute("fill", currentTab === "searchTab" ? "#43bbde" : "gray", 0)}><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><style type="text/css">.st0{fill:{currentTab === 'searchTab' ? '#43bbde' : 'gray'};} </style><g><path class="st0" d="M172.625,102.4c-42.674,0-77.392,34.739-77.392,77.438c0,5.932,4.806,10.74,10.733,10.74 c5.928,0,10.733-4.808,10.733-10.74c0-30.856,25.088-55.959,55.926-55.959c5.928,0,10.733-4.808,10.733-10.74 C183.358,107.208,178.553,102.4,172.625,102.4z"></path><path class="st0" d="M361.657,301.511c19.402-30.436,30.645-66.546,30.645-105.244C392.302,88.036,304.318,0,196.151,0 c-38.676,0-74.765,11.25-105.182,30.663C66.734,46.123,46.11,66.759,30.659,91.008C11.257,121.444,0,157.568,0,196.267 c0,108.217,87.998,196.266,196.151,196.266c38.676,0,74.779-11.264,105.197-30.677C325.582,346.396,346.206,325.76,361.657,301.511 z M259.758,320.242c-19.075,9.842-40.708,15.403-63.607,15.403c-76.797,0-139.296-62.535-139.296-139.378 c0-22.912,5.558-44.558,15.394-63.644c13.318-25.856,34.483-47.019,60.323-60.331c19.075-9.842,40.694-15.403,63.578-15.403 c76.812,0,139.296,62.521,139.296,139.378c0,22.898-5.558,44.53-15.394,63.616C306.749,285.739,285.598,306.916,259.758,320.242z"></path><path class="st0" d="M499.516,439.154L386.275,326.13c-16.119,23.552-36.771,44.202-60.309,60.345l113.241,113.024 c8.329,8.334,19.246,12.501,30.148,12.501c10.916,0,21.833-4.167,30.162-12.501C516.161,482.83,516.161,455.822,499.516,439.154z"></path></g></g></svg> <p class="svelte-46yqq4" data-svelte-h="svelte-1a6y03c">Search</p>`;
              }
            }
          )} ${validate_component(Button, "Button").$$render(
            $$result,
            {
              class: "bg-slate-200",
              style: "color: " + (currentTab === "chatTab" ? "#43bbde" : "gray")
            },
            {},
            {
              default: () => {
                return `${validate_component(MessagesSolid, "MessagesSolid").$$render($$result, { class: "w-5 h-5 me-2" }, {}, {})} <p class="svelte-46yqq4" data-svelte-h="svelte-1cwnydq">Chat</p>`;
              }
            }
          )}  `;
        }
      })}</div> ${``} </div>`;
    });
  }
});

// .svelte-kit/output/server/nodes/5.js
var __exports6 = {};
__export(__exports6, {
  component: () => component6,
  fonts: () => fonts6,
  imports: () => imports6,
  index: () => index6,
  server: () => page_server_exports2,
  server_id: () => server_id2,
  stylesheets: () => stylesheets6
});
var index6, component_cache6, component6, server_id2, imports6, stylesheets6, fonts6;
var init__6 = __esm({
  ".svelte-kit/output/server/nodes/5.js"() {
    init_page_server2();
    index6 = 5;
    component6 = async () => component_cache6 ??= (await Promise.resolve().then(() => (init_page_svelte4(), page_svelte_exports4))).default;
    server_id2 = "src/routes/home/+page.server.js";
    imports6 = ["_app/immutable/nodes/5.a7811060.js", "_app/immutable/chunks/scheduler.b62641ca.js", "_app/immutable/chunks/index.91daa77f.js", "_app/immutable/chunks/TopBanner.b7ca72bd.js", "_app/immutable/chunks/singletons.ad51fe39.js", "_app/immutable/chunks/pocketbase.es.baadb37e.js", "_app/immutable/chunks/each.7fd2ffb1.js", "_app/immutable/chunks/MedicalDisclaimer.d621663c.js", "_app/immutable/chunks/stores.283e6d03.js"];
    stylesheets6 = ["_app/immutable/assets/5.b0a755f4.css", "_app/immutable/assets/TopBanner.05adf756.css", "_app/immutable/assets/MedicalDisclaimer.e07ba00b.css"];
    fonts6 = [];
  }
});

// .svelte-kit/output/server/entries/pages/logout/_page.server.js
var page_server_exports3 = {};
__export(page_server_exports3, {
  load: () => load2
});
var load2;
var init_page_server3 = __esm({
  ".svelte-kit/output/server/entries/pages/logout/_page.server.js"() {
    init_chunks();
    load2 = async ({ request, locals, cookies }) => {
      locals.pb.authStore.clear();
      cookies.set("pb_auth", JSON.stringify({ token: "" }), { path: "/", httpOnly: true, secure: false });
      cookies.set("email", "", { path: "/", httpOnly: false, secure: false });
      throw redirect(302, "/auth");
    };
  }
});

// .svelte-kit/output/server/entries/pages/logout/_page.svelte.js
var page_svelte_exports5 = {};
__export(page_svelte_exports5, {
  default: () => Page5
});
var Page5;
var init_page_svelte5 = __esm({
  ".svelte-kit/output/server/entries/pages/logout/_page.svelte.js"() {
    init_ssr();
    Page5 = create_ssr_component(($$result, $$props, $$bindings, slots) => {
      return ``;
    });
  }
});

// .svelte-kit/output/server/nodes/6.js
var __exports7 = {};
__export(__exports7, {
  component: () => component7,
  fonts: () => fonts7,
  imports: () => imports7,
  index: () => index7,
  server: () => page_server_exports3,
  server_id: () => server_id3,
  stylesheets: () => stylesheets7
});
var index7, component_cache7, component7, server_id3, imports7, stylesheets7, fonts7;
var init__7 = __esm({
  ".svelte-kit/output/server/nodes/6.js"() {
    init_page_server3();
    index7 = 6;
    component7 = async () => component_cache7 ??= (await Promise.resolve().then(() => (init_page_svelte5(), page_svelte_exports5))).default;
    server_id3 = "src/routes/logout/+page.server.js";
    imports7 = ["_app/immutable/nodes/6.850f15ff.js", "_app/immutable/chunks/scheduler.b62641ca.js", "_app/immutable/chunks/index.91daa77f.js"];
    stylesheets7 = [];
    fonts7 = [];
  }
});

// .svelte-kit/output/server/chunks/private.js
var SECRET_EMAIL, SECRET_PASSWORD, OPENAI_KEY, OPENAI_ID;
var init_private = __esm({
  ".svelte-kit/output/server/chunks/private.js"() {
    SECRET_EMAIL = "pareisago@gmail.com";
    SECRET_PASSWORD = "FS*%H9Vbm4Cif*n@8!JSpwRG7";
    OPENAI_KEY = "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";
    OPENAI_ID = "asst_3cIA9dtY4q7IqFa4OdNN21kd";
  }
});

// .svelte-kit/output/server/entries/endpoints/api/auth/_server.js
var server_exports = {};
__export(server_exports, {
  POST: () => POST
});
async function POST({ request, cookies }) {
  const { email, token } = await request.json();
  if (!email) {
    return Response.json({ error: "No login info" }, { status: 400 });
  }
  let pb = new Client("https://pb.openrxn.com");
  await pb.admins.authWithPassword(SECRET_EMAIL, SECRET_PASSWORD);
  try {
    const filterQuery = 'email="' + email + '"';
    const record = await pb.collection("user_data").getFirstListItem(filterQuery);
    if (record) {
    }
  } catch (error2) {
    const data = {
      "email": email,
      "searches_remaining": 100
    };
    await pb.collection("user_data").create(data);
  }
  cookies.set("pb_auth", JSON.stringify({ token }), { path: "/", httpOnly: true, secure: false });
  cookies.set("email", email, { path: "/", httpOnly: false, secure: false });
  throw redirect(303, "/home");
}
var init_server = __esm({
  ".svelte-kit/output/server/entries/endpoints/api/auth/_server.js"() {
    init_chunks();
    init_private();
    init_pocketbase_es();
  }
});

// .svelte-kit/output/server/entries/endpoints/api/credits/get/_server.js
var server_exports2 = {};
var init_server2 = __esm({
  ".svelte-kit/output/server/entries/endpoints/api/credits/get/_server.js"() {
  }
});

// node_modules/openai/version.mjs
var VERSION;
var init_version = __esm({
  "node_modules/openai/version.mjs"() {
    VERSION = "4.24.3";
  }
});

// node_modules/openai/_shims/registry.mjs
function setShims(shims, options2 = { auto: false }) {
  if (auto) {
    throw new Error(`you must \`import 'openai/shims/${shims.kind}'\` before importing anything else from openai`);
  }
  if (kind) {
    throw new Error(`can't \`import 'openai/shims/${shims.kind}'\` after \`import 'openai/shims/${kind}'\``);
  }
  auto = options2.auto;
  kind = shims.kind;
  fetch2 = shims.fetch;
  Request2 = shims.Request;
  Response2 = shims.Response;
  Headers2 = shims.Headers;
  FormData2 = shims.FormData;
  Blob2 = shims.Blob;
  File2 = shims.File;
  ReadableStream2 = shims.ReadableStream;
  getMultipartRequestOptions = shims.getMultipartRequestOptions;
  getDefaultAgent = shims.getDefaultAgent;
  fileFromPath = shims.fileFromPath;
  isFsReadStream = shims.isFsReadStream;
}
var auto, kind, fetch2, Request2, Response2, Headers2, FormData2, Blob2, File2, ReadableStream2, getMultipartRequestOptions, getDefaultAgent, fileFromPath, isFsReadStream;
var init_registry = __esm({
  "node_modules/openai/_shims/registry.mjs"() {
    auto = false;
    kind = void 0;
    fetch2 = void 0;
    Request2 = void 0;
    Response2 = void 0;
    Headers2 = void 0;
    FormData2 = void 0;
    Blob2 = void 0;
    File2 = void 0;
    ReadableStream2 = void 0;
    getMultipartRequestOptions = void 0;
    getDefaultAgent = void 0;
    fileFromPath = void 0;
    isFsReadStream = void 0;
  }
});

// node_modules/openai/_shims/MultipartBody.mjs
var MultipartBody;
var init_MultipartBody = __esm({
  "node_modules/openai/_shims/MultipartBody.mjs"() {
    MultipartBody = class {
      constructor(body) {
        this.body = body;
      }
      get [Symbol.toStringTag]() {
        return "MultipartBody";
      }
    };
  }
});

// node_modules/openai/_shims/web-runtime.mjs
function getRuntime({ manuallyImported } = {}) {
  const recommendation = manuallyImported ? `You may need to use polyfills` : `Add one of these imports before your first \`import \u2026 from 'openai'\`:
- \`import 'openai/shims/node'\` (if you're running on Node)
- \`import 'openai/shims/web'\` (otherwise)
`;
  let _fetch, _Request, _Response, _Headers;
  try {
    _fetch = fetch;
    _Request = Request;
    _Response = Response;
    _Headers = Headers;
  } catch (error2) {
    throw new Error(`this environment is missing the following Web Fetch API type: ${error2.message}. ${recommendation}`);
  }
  return {
    kind: "web",
    fetch: _fetch,
    Request: _Request,
    Response: _Response,
    Headers: _Headers,
    FormData: (
      // @ts-ignore
      typeof FormData !== "undefined" ? FormData : class FormData {
        // @ts-ignore
        constructor() {
          throw new Error(`file uploads aren't supported in this environment yet as 'FormData' is undefined. ${recommendation}`);
        }
      }
    ),
    Blob: typeof Blob !== "undefined" ? Blob : class Blob {
      constructor() {
        throw new Error(`file uploads aren't supported in this environment yet as 'Blob' is undefined. ${recommendation}`);
      }
    },
    File: (
      // @ts-ignore
      typeof File !== "undefined" ? File : class File {
        // @ts-ignore
        constructor() {
          throw new Error(`file uploads aren't supported in this environment yet as 'File' is undefined. ${recommendation}`);
        }
      }
    ),
    ReadableStream: (
      // @ts-ignore
      typeof ReadableStream !== "undefined" ? ReadableStream : class ReadableStream {
        // @ts-ignore
        constructor() {
          throw new Error(`streaming isn't supported in this environment yet as 'ReadableStream' is undefined. ${recommendation}`);
        }
      }
    ),
    getMultipartRequestOptions: async (form, opts) => ({
      ...opts,
      body: new MultipartBody(form)
    }),
    getDefaultAgent: (url) => void 0,
    fileFromPath: () => {
      throw new Error("The `fileFromPath` function is only supported in Node. See the README for more details: https://www.github.com/openai/openai-node#file-uploads");
    },
    isFsReadStream: (value) => false
  };
}
var init_web_runtime = __esm({
  "node_modules/openai/_shims/web-runtime.mjs"() {
    init_MultipartBody();
  }
});

// node_modules/openai/_shims/auto/runtime.mjs
var init_runtime = __esm({
  "node_modules/openai/_shims/auto/runtime.mjs"() {
    init_web_runtime();
  }
});

// node_modules/openai/_shims/index.mjs
var init_shims = __esm({
  "node_modules/openai/_shims/index.mjs"() {
    init_registry();
    init_runtime();
    init_registry();
    if (!kind)
      setShims(getRuntime(), { auto: true });
  }
});

// node_modules/openai/error.mjs
var error_exports = {};
__export(error_exports, {
  APIConnectionError: () => APIConnectionError,
  APIConnectionTimeoutError: () => APIConnectionTimeoutError,
  APIError: () => APIError,
  APIUserAbortError: () => APIUserAbortError,
  AuthenticationError: () => AuthenticationError,
  BadRequestError: () => BadRequestError,
  ConflictError: () => ConflictError,
  InternalServerError: () => InternalServerError,
  NotFoundError: () => NotFoundError,
  OpenAIError: () => OpenAIError,
  PermissionDeniedError: () => PermissionDeniedError,
  RateLimitError: () => RateLimitError,
  UnprocessableEntityError: () => UnprocessableEntityError
});
var OpenAIError, APIError, APIUserAbortError, APIConnectionError, APIConnectionTimeoutError, BadRequestError, AuthenticationError, PermissionDeniedError, NotFoundError, ConflictError, UnprocessableEntityError, RateLimitError, InternalServerError;
var init_error = __esm({
  "node_modules/openai/error.mjs"() {
    init_core();
    OpenAIError = class extends Error {
    };
    APIError = class _APIError extends OpenAIError {
      constructor(status, error2, message, headers) {
        super(`${_APIError.makeMessage(status, error2, message)}`);
        this.status = status;
        this.headers = headers;
        const data = error2;
        this.error = data;
        this.code = data?.["code"];
        this.param = data?.["param"];
        this.type = data?.["type"];
      }
      static makeMessage(status, error2, message) {
        const msg = error2?.message ? typeof error2.message === "string" ? error2.message : JSON.stringify(error2.message) : error2 ? JSON.stringify(error2) : message;
        if (status && msg) {
          return `${status} ${msg}`;
        }
        if (status) {
          return `${status} status code (no body)`;
        }
        if (msg) {
          return msg;
        }
        return "(no status code or body)";
      }
      static generate(status, errorResponse, message, headers) {
        if (!status) {
          return new APIConnectionError({ cause: castToError(errorResponse) });
        }
        const error2 = errorResponse?.["error"];
        if (status === 400) {
          return new BadRequestError(status, error2, message, headers);
        }
        if (status === 401) {
          return new AuthenticationError(status, error2, message, headers);
        }
        if (status === 403) {
          return new PermissionDeniedError(status, error2, message, headers);
        }
        if (status === 404) {
          return new NotFoundError(status, error2, message, headers);
        }
        if (status === 409) {
          return new ConflictError(status, error2, message, headers);
        }
        if (status === 422) {
          return new UnprocessableEntityError(status, error2, message, headers);
        }
        if (status === 429) {
          return new RateLimitError(status, error2, message, headers);
        }
        if (status >= 500) {
          return new InternalServerError(status, error2, message, headers);
        }
        return new _APIError(status, error2, message, headers);
      }
    };
    APIUserAbortError = class extends APIError {
      constructor({ message } = {}) {
        super(void 0, void 0, message || "Request was aborted.", void 0);
        this.status = void 0;
      }
    };
    APIConnectionError = class extends APIError {
      constructor({ message, cause }) {
        super(void 0, void 0, message || "Connection error.", void 0);
        this.status = void 0;
        if (cause)
          this.cause = cause;
      }
    };
    APIConnectionTimeoutError = class extends APIConnectionError {
      constructor({ message } = {}) {
        super({ message: message ?? "Request timed out." });
      }
    };
    BadRequestError = class extends APIError {
      constructor() {
        super(...arguments);
        this.status = 400;
      }
    };
    AuthenticationError = class extends APIError {
      constructor() {
        super(...arguments);
        this.status = 401;
      }
    };
    PermissionDeniedError = class extends APIError {
      constructor() {
        super(...arguments);
        this.status = 403;
      }
    };
    NotFoundError = class extends APIError {
      constructor() {
        super(...arguments);
        this.status = 404;
      }
    };
    ConflictError = class extends APIError {
      constructor() {
        super(...arguments);
        this.status = 409;
      }
    };
    UnprocessableEntityError = class extends APIError {
      constructor() {
        super(...arguments);
        this.status = 422;
      }
    };
    RateLimitError = class extends APIError {
      constructor() {
        super(...arguments);
        this.status = 429;
      }
    };
    InternalServerError = class extends APIError {
    };
  }
});

// node_modules/openai/streaming.mjs
function partition(str2, delimiter) {
  const index8 = str2.indexOf(delimiter);
  if (index8 !== -1) {
    return [str2.substring(0, index8), delimiter, str2.substring(index8 + delimiter.length)];
  }
  return [str2, "", ""];
}
function readableStreamAsyncIterable(stream) {
  if (stream[Symbol.asyncIterator])
    return stream;
  const reader = stream.getReader();
  return {
    async next() {
      try {
        const result = await reader.read();
        if (result?.done)
          reader.releaseLock();
        return result;
      } catch (e3) {
        reader.releaseLock();
        throw e3;
      }
    },
    async return() {
      const cancelPromise = reader.cancel();
      reader.releaseLock();
      await cancelPromise;
      return { done: true, value: void 0 };
    },
    [Symbol.asyncIterator]() {
      return this;
    }
  };
}
var Stream, SSEDecoder, LineDecoder;
var init_streaming = __esm({
  "node_modules/openai/streaming.mjs"() {
    init_shims();
    init_error();
    init_error();
    Stream = class _Stream {
      constructor(iterator, controller) {
        this.iterator = iterator;
        this.controller = controller;
      }
      static fromSSEResponse(response, controller) {
        let consumed = false;
        const decoder = new SSEDecoder();
        async function* iterMessages() {
          if (!response.body) {
            controller.abort();
            throw new OpenAIError(`Attempted to iterate over a response with no body`);
          }
          const lineDecoder = new LineDecoder();
          const iter = readableStreamAsyncIterable(response.body);
          for await (const chunk of iter) {
            for (const line of lineDecoder.decode(chunk)) {
              const sse = decoder.decode(line);
              if (sse)
                yield sse;
            }
          }
          for (const line of lineDecoder.flush()) {
            const sse = decoder.decode(line);
            if (sse)
              yield sse;
          }
        }
        async function* iterator() {
          if (consumed) {
            throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
          }
          consumed = true;
          let done = false;
          try {
            for await (const sse of iterMessages()) {
              if (done)
                continue;
              if (sse.data.startsWith("[DONE]")) {
                done = true;
                continue;
              }
              if (sse.event === null) {
                let data;
                try {
                  data = JSON.parse(sse.data);
                } catch (e3) {
                  console.error(`Could not parse message into JSON:`, sse.data);
                  console.error(`From chunk:`, sse.raw);
                  throw e3;
                }
                if (data && data.error) {
                  throw new APIError(void 0, data.error, void 0, void 0);
                }
                yield data;
              }
            }
            done = true;
          } catch (e3) {
            if (e3 instanceof Error && e3.name === "AbortError")
              return;
            throw e3;
          } finally {
            if (!done)
              controller.abort();
          }
        }
        return new _Stream(iterator, controller);
      }
      /**
       * Generates a Stream from a newline-separated ReadableStream
       * where each item is a JSON value.
       */
      static fromReadableStream(readableStream, controller) {
        let consumed = false;
        async function* iterLines() {
          const lineDecoder = new LineDecoder();
          const iter = readableStreamAsyncIterable(readableStream);
          for await (const chunk of iter) {
            for (const line of lineDecoder.decode(chunk)) {
              yield line;
            }
          }
          for (const line of lineDecoder.flush()) {
            yield line;
          }
        }
        async function* iterator() {
          if (consumed) {
            throw new Error("Cannot iterate over a consumed stream, use `.tee()` to split the stream.");
          }
          consumed = true;
          let done = false;
          try {
            for await (const line of iterLines()) {
              if (done)
                continue;
              if (line)
                yield JSON.parse(line);
            }
            done = true;
          } catch (e3) {
            if (e3 instanceof Error && e3.name === "AbortError")
              return;
            throw e3;
          } finally {
            if (!done)
              controller.abort();
          }
        }
        return new _Stream(iterator, controller);
      }
      [Symbol.asyncIterator]() {
        return this.iterator();
      }
      /**
       * Splits the stream into two streams which can be
       * independently read from at different speeds.
       */
      tee() {
        const left = [];
        const right = [];
        const iterator = this.iterator();
        const teeIterator = (queue) => {
          return {
            next: () => {
              if (queue.length === 0) {
                const result = iterator.next();
                left.push(result);
                right.push(result);
              }
              return queue.shift();
            }
          };
        };
        return [
          new _Stream(() => teeIterator(left), this.controller),
          new _Stream(() => teeIterator(right), this.controller)
        ];
      }
      /**
       * Converts this stream to a newline-separated ReadableStream of
       * JSON stringified values in the stream
       * which can be turned back into a Stream with `Stream.fromReadableStream()`.
       */
      toReadableStream() {
        const self = this;
        let iter;
        const encoder3 = new TextEncoder();
        return new ReadableStream2({
          async start() {
            iter = self[Symbol.asyncIterator]();
          },
          async pull(ctrl) {
            try {
              const { value, done } = await iter.next();
              if (done)
                return ctrl.close();
              const bytes = encoder3.encode(JSON.stringify(value) + "\n");
              ctrl.enqueue(bytes);
            } catch (err) {
              ctrl.error(err);
            }
          },
          async cancel() {
            await iter.return?.();
          }
        });
      }
    };
    SSEDecoder = class {
      constructor() {
        this.event = null;
        this.data = [];
        this.chunks = [];
      }
      decode(line) {
        if (line.endsWith("\r")) {
          line = line.substring(0, line.length - 1);
        }
        if (!line) {
          if (!this.event && !this.data.length)
            return null;
          const sse = {
            event: this.event,
            data: this.data.join("\n"),
            raw: this.chunks
          };
          this.event = null;
          this.data = [];
          this.chunks = [];
          return sse;
        }
        this.chunks.push(line);
        if (line.startsWith(":")) {
          return null;
        }
        let [fieldname, _, value] = partition(line, ":");
        if (value.startsWith(" ")) {
          value = value.substring(1);
        }
        if (fieldname === "event") {
          this.event = value;
        } else if (fieldname === "data") {
          this.data.push(value);
        }
        return null;
      }
    };
    LineDecoder = class _LineDecoder {
      constructor() {
        this.buffer = [];
        this.trailingCR = false;
      }
      decode(chunk) {
        let text2 = this.decodeText(chunk);
        if (this.trailingCR) {
          text2 = "\r" + text2;
          this.trailingCR = false;
        }
        if (text2.endsWith("\r")) {
          this.trailingCR = true;
          text2 = text2.slice(0, -1);
        }
        if (!text2) {
          return [];
        }
        const trailingNewline = _LineDecoder.NEWLINE_CHARS.has(text2[text2.length - 1] || "");
        let lines = text2.split(_LineDecoder.NEWLINE_REGEXP);
        if (lines.length === 1 && !trailingNewline) {
          this.buffer.push(lines[0]);
          return [];
        }
        if (this.buffer.length > 0) {
          lines = [this.buffer.join("") + lines[0], ...lines.slice(1)];
          this.buffer = [];
        }
        if (!trailingNewline) {
          this.buffer = [lines.pop() || ""];
        }
        return lines;
      }
      decodeText(bytes) {
        if (bytes == null)
          return "";
        if (typeof bytes === "string")
          return bytes;
        if (typeof Buffer !== "undefined") {
          if (bytes instanceof Buffer) {
            return bytes.toString();
          }
          if (bytes instanceof Uint8Array) {
            return Buffer.from(bytes).toString();
          }
          throw new OpenAIError(`Unexpected: received non-Uint8Array (${bytes.constructor.name}) stream chunk in an environment with a global "Buffer" defined, which this library assumes to be Node. Please report this error.`);
        }
        if (typeof TextDecoder !== "undefined") {
          if (bytes instanceof Uint8Array || bytes instanceof ArrayBuffer) {
            this.textDecoder ?? (this.textDecoder = new TextDecoder("utf8"));
            return this.textDecoder.decode(bytes);
          }
          throw new OpenAIError(`Unexpected: received non-Uint8Array/ArrayBuffer (${bytes.constructor.name}) in a web platform. Please report this error.`);
        }
        throw new OpenAIError(`Unexpected: neither Buffer nor TextDecoder are available as globals. Please report this error.`);
      }
      flush() {
        if (!this.buffer.length && !this.trailingCR) {
          return [];
        }
        const lines = [this.buffer.join("")];
        this.buffer = [];
        this.trailingCR = false;
        return lines;
      }
    };
    LineDecoder.NEWLINE_CHARS = /* @__PURE__ */ new Set(["\n", "\r", "\v", "\f", "", "", "", "\x85", "\u2028", "\u2029"]);
    LineDecoder.NEWLINE_REGEXP = /\r\n|[\n\r\x0b\x0c\x1c\x1d\x1e\x85\u2028\u2029]/g;
  }
});

// node_modules/openai/uploads.mjs
async function toFile(value, name, options2 = {}) {
  value = await value;
  if (isResponseLike(value)) {
    const blob = await value.blob();
    name || (name = new URL(value.url).pathname.split(/[\\/]/).pop() ?? "unknown_file");
    return new File2([blob], name, options2);
  }
  const bits = await getBytes(value);
  name || (name = getName(value) ?? "unknown_file");
  if (!options2.type) {
    const type = bits[0]?.type;
    if (typeof type === "string") {
      options2 = { ...options2, type };
    }
  }
  return new File2(bits, name, options2);
}
async function getBytes(value) {
  let parts = [];
  if (typeof value === "string" || ArrayBuffer.isView(value) || // includes Uint8Array, Buffer, etc.
  value instanceof ArrayBuffer) {
    parts.push(value);
  } else if (isBlobLike(value)) {
    parts.push(await value.arrayBuffer());
  } else if (isAsyncIterableIterator(value)) {
    for await (const chunk of value) {
      parts.push(chunk);
    }
  } else {
    throw new Error(`Unexpected data type: ${typeof value}; constructor: ${value?.constructor?.name}; props: ${propsForError(value)}`);
  }
  return parts;
}
function propsForError(value) {
  const props = Object.getOwnPropertyNames(value);
  return `[${props.map((p) => `"${p}"`).join(", ")}]`;
}
function getName(value) {
  return getStringFromMaybeBuffer(value.name) || getStringFromMaybeBuffer(value.filename) || // For fs.ReadStream
  getStringFromMaybeBuffer(value.path)?.split(/[\\/]/).pop();
}
var isResponseLike, isFileLike, isBlobLike, isUploadable, getStringFromMaybeBuffer, isAsyncIterableIterator, isMultipartBody, multipartFormRequestOptions, createForm, addFormValue;
var init_uploads = __esm({
  "node_modules/openai/uploads.mjs"() {
    init_shims();
    init_shims();
    isResponseLike = (value) => value != null && typeof value === "object" && typeof value.url === "string" && typeof value.blob === "function";
    isFileLike = (value) => value != null && typeof value === "object" && typeof value.name === "string" && typeof value.lastModified === "number" && isBlobLike(value);
    isBlobLike = (value) => value != null && typeof value === "object" && typeof value.size === "number" && typeof value.type === "string" && typeof value.text === "function" && typeof value.slice === "function" && typeof value.arrayBuffer === "function";
    isUploadable = (value) => {
      return isFileLike(value) || isResponseLike(value) || isFsReadStream(value);
    };
    getStringFromMaybeBuffer = (x) => {
      if (typeof x === "string")
        return x;
      if (typeof Buffer !== "undefined" && x instanceof Buffer)
        return String(x);
      return void 0;
    };
    isAsyncIterableIterator = (value) => value != null && typeof value === "object" && typeof value[Symbol.asyncIterator] === "function";
    isMultipartBody = (body) => body && typeof body === "object" && body.body && body[Symbol.toStringTag] === "MultipartBody";
    multipartFormRequestOptions = async (opts) => {
      const form = await createForm(opts.body);
      return getMultipartRequestOptions(form, opts);
    };
    createForm = async (body) => {
      const form = new FormData2();
      await Promise.all(Object.entries(body || {}).map(([key2, value]) => addFormValue(form, key2, value)));
      return form;
    };
    addFormValue = async (form, key2, value) => {
      if (value === void 0)
        return;
      if (value == null) {
        throw new TypeError(`Received null for "${key2}"; to pass null in FormData, you must use the string 'null'`);
      }
      if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
        form.append(key2, String(value));
      } else if (isUploadable(value)) {
        const file = await toFile(value);
        form.append(key2, file);
      } else if (Array.isArray(value)) {
        await Promise.all(value.map((entry) => addFormValue(form, key2 + "[]", entry)));
      } else if (typeof value === "object") {
        await Promise.all(Object.entries(value).map(([name, prop]) => addFormValue(form, `${key2}[${name}]`, prop)));
      } else {
        throw new TypeError(`Invalid value given to form, expected a string, number, boolean, object, Array, File or Blob but got ${value} instead`);
      }
    };
  }
});

// node_modules/openai/core.mjs
async function defaultParseResponse(props) {
  const { response } = props;
  if (props.options.stream) {
    debug("response", response.status, response.url, response.headers, response.body);
    return Stream.fromSSEResponse(response, props.controller);
  }
  if (response.status === 204) {
    return null;
  }
  if (props.options.__binaryResponse) {
    return response;
  }
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    const json2 = await response.json();
    debug("response", response.status, response.url, response.headers, json2);
    return json2;
  }
  const text2 = await response.text();
  debug("response", response.status, response.url, response.headers, text2);
  return text2;
}
function getBrowserInfo() {
  if (typeof navigator === "undefined" || !navigator) {
    return null;
  }
  const browserPatterns = [
    { key: "edge", pattern: /Edge(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /MSIE(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "ie", pattern: /Trident(?:.*rv\:(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "chrome", pattern: /Chrome(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "firefox", pattern: /Firefox(?:\W+(\d+)\.(\d+)(?:\.(\d+))?)?/ },
    { key: "safari", pattern: /(?:Version\W+(\d+)\.(\d+)(?:\.(\d+))?)?(?:\W+Mobile\S*)?\W+Safari/ }
  ];
  for (const { key: key2, pattern: pattern2 } of browserPatterns) {
    const match = pattern2.exec(navigator.userAgent);
    if (match) {
      const major = match[1] || 0;
      const minor = match[2] || 0;
      const patch = match[3] || 0;
      return { browser: key2, version: `${major}.${minor}.${patch}` };
    }
  }
  return null;
}
function isEmptyObj(obj) {
  if (!obj)
    return true;
  for (const _k in obj)
    return false;
  return true;
}
function hasOwn(obj, key2) {
  return Object.prototype.hasOwnProperty.call(obj, key2);
}
function applyHeadersMut(targetHeaders, newHeaders) {
  for (const k in newHeaders) {
    if (!hasOwn(newHeaders, k))
      continue;
    const lowerKey = k.toLowerCase();
    if (!lowerKey)
      continue;
    const val = newHeaders[k];
    if (val === null) {
      delete targetHeaders[lowerKey];
    } else if (val !== void 0) {
      targetHeaders[lowerKey] = val;
    }
  }
}
function debug(action, ...args) {
  if (typeof process !== "undefined" && process.env["DEBUG"] === "true") {
    console.log(`OpenAI:DEBUG:${action}`, ...args);
  }
}
var __classPrivateFieldSet, __classPrivateFieldGet, _AbstractPage_client, APIPromise, APIClient, AbstractPage, PagePromise, createResponseHeaders, requestOptionsKeys, isRequestOptions, getPlatformProperties, normalizeArch, normalizePlatform, _platformHeaders, getPlatformHeaders, safeJSON, startsWithSchemeRegexp, isAbsoluteURL, sleep, validatePositiveInteger, castToError, readEnv, uuid4, isRunningInBrowser;
var init_core = __esm({
  "node_modules/openai/core.mjs"() {
    init_version();
    init_streaming();
    init_error();
    init_shims();
    init_uploads();
    init_uploads();
    __classPrivateFieldSet = function(receiver, state, value, kind2, f) {
      if (kind2 === "m")
        throw new TypeError("Private method is not writable");
      if (kind2 === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind2 === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    __classPrivateFieldGet = function(receiver, state, kind2, f) {
      if (kind2 === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    APIPromise = class _APIPromise extends Promise {
      constructor(responsePromise, parseResponse = defaultParseResponse) {
        super((resolve2) => {
          resolve2(null);
        });
        this.responsePromise = responsePromise;
        this.parseResponse = parseResponse;
      }
      _thenUnwrap(transform) {
        return new _APIPromise(this.responsePromise, async (props) => transform(await this.parseResponse(props)));
      }
      /**
       * Gets the raw `Response` instance instead of parsing the response
       * data.
       *
       * If you want to parse the response body but still get the `Response`
       * instance, you can use {@link withResponse()}.
       *
       * 👋 Getting the wrong TypeScript type for `Response`?
       * Try setting `"moduleResolution": "NodeNext"` if you can,
       * or add one of these imports before your first `import … from 'openai'`:
       * - `import 'openai/shims/node'` (if you're running on Node)
       * - `import 'openai/shims/web'` (otherwise)
       */
      asResponse() {
        return this.responsePromise.then((p) => p.response);
      }
      /**
       * Gets the parsed response data and the raw `Response` instance.
       *
       * If you just want to get the raw `Response` instance without parsing it,
       * you can use {@link asResponse()}.
       *
       *
       * 👋 Getting the wrong TypeScript type for `Response`?
       * Try setting `"moduleResolution": "NodeNext"` if you can,
       * or add one of these imports before your first `import … from 'openai'`:
       * - `import 'openai/shims/node'` (if you're running on Node)
       * - `import 'openai/shims/web'` (otherwise)
       */
      async withResponse() {
        const [data, response] = await Promise.all([this.parse(), this.asResponse()]);
        return { data, response };
      }
      parse() {
        if (!this.parsedPromise) {
          this.parsedPromise = this.responsePromise.then(this.parseResponse);
        }
        return this.parsedPromise;
      }
      then(onfulfilled, onrejected) {
        return this.parse().then(onfulfilled, onrejected);
      }
      catch(onrejected) {
        return this.parse().catch(onrejected);
      }
      finally(onfinally) {
        return this.parse().finally(onfinally);
      }
    };
    APIClient = class {
      constructor({
        baseURL,
        maxRetries = 2,
        timeout = 6e5,
        // 10 minutes
        httpAgent,
        fetch: overridenFetch
      }) {
        this.baseURL = baseURL;
        this.maxRetries = validatePositiveInteger("maxRetries", maxRetries);
        this.timeout = validatePositiveInteger("timeout", timeout);
        this.httpAgent = httpAgent;
        this.fetch = overridenFetch ?? fetch2;
      }
      authHeaders(opts) {
        return {};
      }
      /**
       * Override this to add your own default headers, for example:
       *
       *  {
       *    ...super.defaultHeaders(),
       *    Authorization: 'Bearer 123',
       *  }
       */
      defaultHeaders(opts) {
        return {
          Accept: "application/json",
          "Content-Type": "application/json",
          "User-Agent": this.getUserAgent(),
          ...getPlatformHeaders(),
          ...this.authHeaders(opts)
        };
      }
      /**
       * Override this to add your own headers validation:
       */
      validateHeaders(headers, customHeaders) {
      }
      defaultIdempotencyKey() {
        return `stainless-node-retry-${uuid4()}`;
      }
      get(path, opts) {
        return this.methodRequest("get", path, opts);
      }
      post(path, opts) {
        return this.methodRequest("post", path, opts);
      }
      patch(path, opts) {
        return this.methodRequest("patch", path, opts);
      }
      put(path, opts) {
        return this.methodRequest("put", path, opts);
      }
      delete(path, opts) {
        return this.methodRequest("delete", path, opts);
      }
      methodRequest(method, path, opts) {
        return this.request(Promise.resolve(opts).then((opts2) => ({ method, path, ...opts2 })));
      }
      getAPIList(path, Page7, opts) {
        return this.requestAPIList(Page7, { method: "get", path, ...opts });
      }
      calculateContentLength(body) {
        if (typeof body === "string") {
          if (typeof Buffer !== "undefined") {
            return Buffer.byteLength(body, "utf8").toString();
          }
          if (typeof TextEncoder !== "undefined") {
            const encoder3 = new TextEncoder();
            const encoded = encoder3.encode(body);
            return encoded.length.toString();
          }
        }
        return null;
      }
      buildRequest(options2) {
        const { method, path, query, headers = {} } = options2;
        const body = isMultipartBody(options2.body) ? options2.body.body : options2.body ? JSON.stringify(options2.body, null, 2) : null;
        const contentLength = this.calculateContentLength(body);
        const url = this.buildURL(path, query);
        if ("timeout" in options2)
          validatePositiveInteger("timeout", options2.timeout);
        const timeout = options2.timeout ?? this.timeout;
        const httpAgent = options2.httpAgent ?? this.httpAgent ?? getDefaultAgent(url);
        const minAgentTimeout = timeout + 1e3;
        if (typeof httpAgent?.options?.timeout === "number" && minAgentTimeout > (httpAgent.options.timeout ?? 0)) {
          httpAgent.options.timeout = minAgentTimeout;
        }
        if (this.idempotencyHeader && method !== "get") {
          if (!options2.idempotencyKey)
            options2.idempotencyKey = this.defaultIdempotencyKey();
          headers[this.idempotencyHeader] = options2.idempotencyKey;
        }
        const reqHeaders = this.buildHeaders({ options: options2, headers, contentLength });
        const req = {
          method,
          ...body && { body },
          headers: reqHeaders,
          ...httpAgent && { agent: httpAgent },
          // @ts-ignore node-fetch uses a custom AbortSignal type that is
          // not compatible with standard web types
          signal: options2.signal ?? null
        };
        return { req, url, timeout };
      }
      buildHeaders({ options: options2, headers, contentLength }) {
        const reqHeaders = {};
        if (contentLength) {
          reqHeaders["content-length"] = contentLength;
        }
        const defaultHeaders = this.defaultHeaders(options2);
        applyHeadersMut(reqHeaders, defaultHeaders);
        applyHeadersMut(reqHeaders, headers);
        if (isMultipartBody(options2.body) && kind !== "node") {
          delete reqHeaders["content-type"];
        }
        this.validateHeaders(reqHeaders, headers);
        return reqHeaders;
      }
      /**
       * Used as a callback for mutating the given `RequestInit` object.
       *
       * This is useful for cases where you want to add certain headers based off of
       * the request properties, e.g. `method` or `url`.
       */
      async prepareRequest(request, { url, options: options2 }) {
      }
      parseHeaders(headers) {
        return !headers ? {} : Symbol.iterator in headers ? Object.fromEntries(Array.from(headers).map((header) => [...header])) : { ...headers };
      }
      makeStatusError(status, error2, message, headers) {
        return APIError.generate(status, error2, message, headers);
      }
      request(options2, remainingRetries = null) {
        return new APIPromise(this.makeRequest(options2, remainingRetries));
      }
      async makeRequest(optionsInput, retriesRemaining) {
        const options2 = await optionsInput;
        if (retriesRemaining == null) {
          retriesRemaining = options2.maxRetries ?? this.maxRetries;
        }
        const { req, url, timeout } = this.buildRequest(options2);
        await this.prepareRequest(req, { url, options: options2 });
        debug("request", url, options2, req.headers);
        if (options2.signal?.aborted) {
          throw new APIUserAbortError();
        }
        const controller = new AbortController();
        const response = await this.fetchWithTimeout(url, req, timeout, controller).catch(castToError);
        if (response instanceof Error) {
          if (options2.signal?.aborted) {
            throw new APIUserAbortError();
          }
          if (retriesRemaining) {
            return this.retryRequest(options2, retriesRemaining);
          }
          if (response.name === "AbortError") {
            throw new APIConnectionTimeoutError();
          }
          throw new APIConnectionError({ cause: response });
        }
        const responseHeaders = createResponseHeaders(response.headers);
        if (!response.ok) {
          if (retriesRemaining && this.shouldRetry(response)) {
            return this.retryRequest(options2, retriesRemaining, responseHeaders);
          }
          const errText = await response.text().catch((e3) => castToError(e3).message);
          const errJSON = safeJSON(errText);
          const errMessage = errJSON ? void 0 : errText;
          debug("response", response.status, url, responseHeaders, errMessage);
          const err = this.makeStatusError(response.status, errJSON, errMessage, responseHeaders);
          throw err;
        }
        return { response, options: options2, controller };
      }
      requestAPIList(Page7, options2) {
        const request = this.makeRequest(options2, null);
        return new PagePromise(this, request, Page7);
      }
      buildURL(path, query) {
        const url = isAbsoluteURL(path) ? new URL(path) : new URL(this.baseURL + (this.baseURL.endsWith("/") && path.startsWith("/") ? path.slice(1) : path));
        const defaultQuery = this.defaultQuery();
        if (!isEmptyObj(defaultQuery)) {
          query = { ...defaultQuery, ...query };
        }
        if (query) {
          url.search = this.stringifyQuery(query);
        }
        return url.toString();
      }
      stringifyQuery(query) {
        return Object.entries(query).filter(([_, value]) => typeof value !== "undefined").map(([key2, value]) => {
          if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
            return `${encodeURIComponent(key2)}=${encodeURIComponent(value)}`;
          }
          if (value === null) {
            return `${encodeURIComponent(key2)}=`;
          }
          throw new OpenAIError(`Cannot stringify type ${typeof value}; Expected string, number, boolean, or null. If you need to pass nested query parameters, you can manually encode them, e.g. { query: { 'foo[key1]': value1, 'foo[key2]': value2 } }, and please open a GitHub issue requesting better support for your use case.`);
        }).join("&");
      }
      async fetchWithTimeout(url, init2, ms, controller) {
        const { signal, ...options2 } = init2 || {};
        if (signal)
          signal.addEventListener("abort", () => controller.abort());
        const timeout = setTimeout(() => controller.abort(), ms);
        return this.getRequestClient().fetch.call(void 0, url, { signal: controller.signal, ...options2 }).finally(() => {
          clearTimeout(timeout);
        });
      }
      getRequestClient() {
        return { fetch: this.fetch };
      }
      shouldRetry(response) {
        const shouldRetryHeader = response.headers.get("x-should-retry");
        if (shouldRetryHeader === "true")
          return true;
        if (shouldRetryHeader === "false")
          return false;
        if (response.status === 408)
          return true;
        if (response.status === 409)
          return true;
        if (response.status === 429)
          return true;
        if (response.status >= 500)
          return true;
        return false;
      }
      async retryRequest(options2, retriesRemaining, responseHeaders) {
        let timeoutMillis;
        const retryAfterHeader = responseHeaders?.["retry-after"];
        if (retryAfterHeader) {
          const timeoutSeconds = parseInt(retryAfterHeader);
          if (!Number.isNaN(timeoutSeconds)) {
            timeoutMillis = timeoutSeconds * 1e3;
          } else {
            timeoutMillis = Date.parse(retryAfterHeader) - Date.now();
          }
        }
        if (!timeoutMillis || !Number.isInteger(timeoutMillis) || timeoutMillis <= 0 || timeoutMillis > 60 * 1e3) {
          const maxRetries = options2.maxRetries ?? this.maxRetries;
          timeoutMillis = this.calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries);
        }
        await sleep(timeoutMillis);
        return this.makeRequest(options2, retriesRemaining - 1);
      }
      calculateDefaultRetryTimeoutMillis(retriesRemaining, maxRetries) {
        const initialRetryDelay = 0.5;
        const maxRetryDelay = 8;
        const numRetries = maxRetries - retriesRemaining;
        const sleepSeconds = Math.min(initialRetryDelay * Math.pow(2, numRetries), maxRetryDelay);
        const jitter = 1 - Math.random() * 0.25;
        return sleepSeconds * jitter * 1e3;
      }
      getUserAgent() {
        return `${this.constructor.name}/JS ${VERSION}`;
      }
    };
    AbstractPage = class {
      constructor(client, response, body, options2) {
        _AbstractPage_client.set(this, void 0);
        __classPrivateFieldSet(this, _AbstractPage_client, client, "f");
        this.options = options2;
        this.response = response;
        this.body = body;
      }
      hasNextPage() {
        const items = this.getPaginatedItems();
        if (!items.length)
          return false;
        return this.nextPageInfo() != null;
      }
      async getNextPage() {
        const nextInfo = this.nextPageInfo();
        if (!nextInfo) {
          throw new OpenAIError("No next page expected; please check `.hasNextPage()` before calling `.getNextPage()`.");
        }
        const nextOptions = { ...this.options };
        if ("params" in nextInfo && typeof nextOptions.query === "object") {
          nextOptions.query = { ...nextOptions.query, ...nextInfo.params };
        } else if ("url" in nextInfo) {
          const params = [...Object.entries(nextOptions.query || {}), ...nextInfo.url.searchParams.entries()];
          for (const [key2, value] of params) {
            nextInfo.url.searchParams.set(key2, value);
          }
          nextOptions.query = void 0;
          nextOptions.path = nextInfo.url.toString();
        }
        return await __classPrivateFieldGet(this, _AbstractPage_client, "f").requestAPIList(this.constructor, nextOptions);
      }
      async *iterPages() {
        let page2 = this;
        yield page2;
        while (page2.hasNextPage()) {
          page2 = await page2.getNextPage();
          yield page2;
        }
      }
      async *[(_AbstractPage_client = /* @__PURE__ */ new WeakMap(), Symbol.asyncIterator)]() {
        for await (const page2 of this.iterPages()) {
          for (const item of page2.getPaginatedItems()) {
            yield item;
          }
        }
      }
    };
    PagePromise = class extends APIPromise {
      constructor(client, request, Page7) {
        super(request, async (props) => new Page7(client, props.response, await defaultParseResponse(props), props.options));
      }
      /**
       * Allow auto-paginating iteration on an unawaited list call, eg:
       *
       *    for await (const item of client.items.list()) {
       *      console.log(item)
       *    }
       */
      async *[Symbol.asyncIterator]() {
        const page2 = await this;
        for await (const item of page2) {
          yield item;
        }
      }
    };
    createResponseHeaders = (headers) => {
      return new Proxy(Object.fromEntries(
        // @ts-ignore
        headers.entries()
      ), {
        get(target, name) {
          const key2 = name.toString();
          return target[key2.toLowerCase()] || target[key2];
        }
      });
    };
    requestOptionsKeys = {
      method: true,
      path: true,
      query: true,
      body: true,
      headers: true,
      maxRetries: true,
      stream: true,
      timeout: true,
      httpAgent: true,
      signal: true,
      idempotencyKey: true,
      __binaryResponse: true
    };
    isRequestOptions = (obj) => {
      return typeof obj === "object" && obj !== null && !isEmptyObj(obj) && Object.keys(obj).every((k) => hasOwn(requestOptionsKeys, k));
    };
    getPlatformProperties = () => {
      if (typeof Deno !== "undefined" && Deno.build != null) {
        return {
          "X-Stainless-Lang": "js",
          "X-Stainless-Package-Version": VERSION,
          "X-Stainless-OS": normalizePlatform(Deno.build.os),
          "X-Stainless-Arch": normalizeArch(Deno.build.arch),
          "X-Stainless-Runtime": "deno",
          "X-Stainless-Runtime-Version": Deno.version
        };
      }
      if (typeof EdgeRuntime !== "undefined") {
        return {
          "X-Stainless-Lang": "js",
          "X-Stainless-Package-Version": VERSION,
          "X-Stainless-OS": "Unknown",
          "X-Stainless-Arch": `other:${EdgeRuntime}`,
          "X-Stainless-Runtime": "edge",
          "X-Stainless-Runtime-Version": process.version
        };
      }
      if (Object.prototype.toString.call(typeof process !== "undefined" ? process : 0) === "[object process]") {
        return {
          "X-Stainless-Lang": "js",
          "X-Stainless-Package-Version": VERSION,
          "X-Stainless-OS": normalizePlatform(process.platform),
          "X-Stainless-Arch": normalizeArch(process.arch),
          "X-Stainless-Runtime": "node",
          "X-Stainless-Runtime-Version": process.version
        };
      }
      const browserInfo = getBrowserInfo();
      if (browserInfo) {
        return {
          "X-Stainless-Lang": "js",
          "X-Stainless-Package-Version": VERSION,
          "X-Stainless-OS": "Unknown",
          "X-Stainless-Arch": "unknown",
          "X-Stainless-Runtime": `browser:${browserInfo.browser}`,
          "X-Stainless-Runtime-Version": browserInfo.version
        };
      }
      return {
        "X-Stainless-Lang": "js",
        "X-Stainless-Package-Version": VERSION,
        "X-Stainless-OS": "Unknown",
        "X-Stainless-Arch": "unknown",
        "X-Stainless-Runtime": "unknown",
        "X-Stainless-Runtime-Version": "unknown"
      };
    };
    normalizeArch = (arch) => {
      if (arch === "x32")
        return "x32";
      if (arch === "x86_64" || arch === "x64")
        return "x64";
      if (arch === "arm")
        return "arm";
      if (arch === "aarch64" || arch === "arm64")
        return "arm64";
      if (arch)
        return `other:${arch}`;
      return "unknown";
    };
    normalizePlatform = (platform) => {
      platform = platform.toLowerCase();
      if (platform.includes("ios"))
        return "iOS";
      if (platform === "android")
        return "Android";
      if (platform === "darwin")
        return "MacOS";
      if (platform === "win32")
        return "Windows";
      if (platform === "freebsd")
        return "FreeBSD";
      if (platform === "openbsd")
        return "OpenBSD";
      if (platform === "linux")
        return "Linux";
      if (platform)
        return `Other:${platform}`;
      return "Unknown";
    };
    getPlatformHeaders = () => {
      return _platformHeaders ?? (_platformHeaders = getPlatformProperties());
    };
    safeJSON = (text2) => {
      try {
        return JSON.parse(text2);
      } catch (err) {
        return void 0;
      }
    };
    startsWithSchemeRegexp = new RegExp("^(?:[a-z]+:)?//", "i");
    isAbsoluteURL = (url) => {
      return startsWithSchemeRegexp.test(url);
    };
    sleep = (ms) => new Promise((resolve2) => setTimeout(resolve2, ms));
    validatePositiveInteger = (name, n2) => {
      if (typeof n2 !== "number" || !Number.isInteger(n2)) {
        throw new OpenAIError(`${name} must be an integer`);
      }
      if (n2 < 0) {
        throw new OpenAIError(`${name} must be a positive integer`);
      }
      return n2;
    };
    castToError = (err) => {
      if (err instanceof Error)
        return err;
      return new Error(err);
    };
    readEnv = (env) => {
      if (typeof process !== "undefined") {
        return process.env?.[env]?.trim() ?? void 0;
      }
      if (typeof Deno !== "undefined") {
        return Deno.env?.get?.(env)?.trim();
      }
      return void 0;
    };
    uuid4 = () => {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c2) => {
        const r3 = Math.random() * 16 | 0;
        const v = c2 === "x" ? r3 : r3 & 3 | 8;
        return v.toString(16);
      });
    };
    isRunningInBrowser = () => {
      return (
        // @ts-ignore
        typeof window !== "undefined" && // @ts-ignore
        typeof window.document !== "undefined" && // @ts-ignore
        typeof navigator !== "undefined"
      );
    };
  }
});

// node_modules/openai/pagination.mjs
var Page6, CursorPage;
var init_pagination = __esm({
  "node_modules/openai/pagination.mjs"() {
    init_core();
    Page6 = class extends AbstractPage {
      constructor(client, response, body, options2) {
        super(client, response, body, options2);
        this.data = body.data || [];
        this.object = body.object;
      }
      getPaginatedItems() {
        return this.data ?? [];
      }
      // @deprecated Please use `nextPageInfo()` instead
      /**
       * This page represents a response that isn't actually paginated at the API level
       * so there will never be any next page params.
       */
      nextPageParams() {
        return null;
      }
      nextPageInfo() {
        return null;
      }
    };
    CursorPage = class extends AbstractPage {
      constructor(client, response, body, options2) {
        super(client, response, body, options2);
        this.data = body.data || [];
      }
      getPaginatedItems() {
        return this.data ?? [];
      }
      // @deprecated Please use `nextPageInfo()` instead
      nextPageParams() {
        const info = this.nextPageInfo();
        if (!info)
          return null;
        if ("params" in info)
          return info.params;
        const params = Object.fromEntries(info.url.searchParams);
        if (!Object.keys(params).length)
          return null;
        return params;
      }
      nextPageInfo() {
        const data = this.getPaginatedItems();
        if (!data.length) {
          return null;
        }
        const id = data[data.length - 1]?.id;
        if (!id) {
          return null;
        }
        return { params: { after: id } };
      }
    };
  }
});

// node_modules/openai/resource.mjs
var APIResource;
var init_resource = __esm({
  "node_modules/openai/resource.mjs"() {
    APIResource = class {
      constructor(client) {
        this._client = client;
      }
    };
  }
});

// node_modules/openai/resources/chat/completions.mjs
var Completions;
var init_completions = __esm({
  "node_modules/openai/resources/chat/completions.mjs"() {
    init_resource();
    Completions = class extends APIResource {
      create(body, options2) {
        return this._client.post("/chat/completions", { body, ...options2, stream: body.stream ?? false });
      }
    };
    /* @__PURE__ */ (function(Completions4) {
    })(Completions || (Completions = {}));
  }
});

// node_modules/openai/resources/chat/chat.mjs
var Chat;
var init_chat = __esm({
  "node_modules/openai/resources/chat/chat.mjs"() {
    init_resource();
    init_completions();
    Chat = class extends APIResource {
      constructor() {
        super(...arguments);
        this.completions = new Completions(this._client);
      }
    };
    (function(Chat3) {
      Chat3.Completions = Completions;
    })(Chat || (Chat = {}));
  }
});

// node_modules/openai/resources/chat/index.mjs
var init_chat2 = __esm({
  "node_modules/openai/resources/chat/index.mjs"() {
    init_chat();
  }
});

// node_modules/openai/resources/shared.mjs
var init_shared = __esm({
  "node_modules/openai/resources/shared.mjs"() {
  }
});

// node_modules/openai/resources/audio/speech.mjs
var Speech;
var init_speech = __esm({
  "node_modules/openai/resources/audio/speech.mjs"() {
    init_resource();
    Speech = class extends APIResource {
      /**
       * Generates audio from the input text.
       */
      create(body, options2) {
        return this._client.post("/audio/speech", { body, ...options2, __binaryResponse: true });
      }
    };
    /* @__PURE__ */ (function(Speech2) {
    })(Speech || (Speech = {}));
  }
});

// node_modules/openai/resources/audio/transcriptions.mjs
var Transcriptions;
var init_transcriptions = __esm({
  "node_modules/openai/resources/audio/transcriptions.mjs"() {
    init_resource();
    init_core();
    Transcriptions = class extends APIResource {
      /**
       * Transcribes audio into the input language.
       */
      create(body, options2) {
        return this._client.post("/audio/transcriptions", multipartFormRequestOptions({ body, ...options2 }));
      }
    };
    /* @__PURE__ */ (function(Transcriptions2) {
    })(Transcriptions || (Transcriptions = {}));
  }
});

// node_modules/openai/resources/audio/translations.mjs
var Translations;
var init_translations = __esm({
  "node_modules/openai/resources/audio/translations.mjs"() {
    init_resource();
    init_core();
    Translations = class extends APIResource {
      /**
       * Translates audio into English.
       */
      create(body, options2) {
        return this._client.post("/audio/translations", multipartFormRequestOptions({ body, ...options2 }));
      }
    };
    /* @__PURE__ */ (function(Translations2) {
    })(Translations || (Translations = {}));
  }
});

// node_modules/openai/resources/audio/audio.mjs
var Audio;
var init_audio = __esm({
  "node_modules/openai/resources/audio/audio.mjs"() {
    init_resource();
    init_speech();
    init_transcriptions();
    init_translations();
    Audio = class extends APIResource {
      constructor() {
        super(...arguments);
        this.transcriptions = new Transcriptions(this._client);
        this.translations = new Translations(this._client);
        this.speech = new Speech(this._client);
      }
    };
    (function(Audio2) {
      Audio2.Transcriptions = Transcriptions;
      Audio2.Translations = Translations;
      Audio2.Speech = Speech;
    })(Audio || (Audio = {}));
  }
});

// node_modules/openai/resources/beta/assistants/files.mjs
var Files, AssistantFilesPage;
var init_files = __esm({
  "node_modules/openai/resources/beta/assistants/files.mjs"() {
    init_resource();
    init_core();
    init_files();
    init_pagination();
    Files = class extends APIResource {
      /**
       * Create an assistant file by attaching a
       * [File](https://platform.openai.com/docs/api-reference/files) to an
       * [assistant](https://platform.openai.com/docs/api-reference/assistants).
       */
      create(assistantId, body, options2) {
        return this._client.post(`/assistants/${assistantId}/files`, {
          body,
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
      /**
       * Retrieves an AssistantFile.
       */
      retrieve(assistantId, fileId, options2) {
        return this._client.get(`/assistants/${assistantId}/files/${fileId}`, {
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
      list(assistantId, query = {}, options2) {
        if (isRequestOptions(query)) {
          return this.list(assistantId, {}, query);
        }
        return this._client.getAPIList(`/assistants/${assistantId}/files`, AssistantFilesPage, {
          query,
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
      /**
       * Delete an assistant file.
       */
      del(assistantId, fileId, options2) {
        return this._client.delete(`/assistants/${assistantId}/files/${fileId}`, {
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
    };
    AssistantFilesPage = class extends CursorPage {
    };
    (function(Files4) {
      Files4.AssistantFilesPage = AssistantFilesPage;
    })(Files || (Files = {}));
  }
});

// node_modules/openai/resources/beta/assistants/assistants.mjs
var Assistants, AssistantsPage;
var init_assistants = __esm({
  "node_modules/openai/resources/beta/assistants/assistants.mjs"() {
    init_resource();
    init_core();
    init_assistants();
    init_files();
    init_pagination();
    Assistants = class extends APIResource {
      constructor() {
        super(...arguments);
        this.files = new Files(this._client);
      }
      /**
       * Create an assistant with a model and instructions.
       */
      create(body, options2) {
        return this._client.post("/assistants", {
          body,
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
      /**
       * Retrieves an assistant.
       */
      retrieve(assistantId, options2) {
        return this._client.get(`/assistants/${assistantId}`, {
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
      /**
       * Modifies an assistant.
       */
      update(assistantId, body, options2) {
        return this._client.post(`/assistants/${assistantId}`, {
          body,
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
      list(query = {}, options2) {
        if (isRequestOptions(query)) {
          return this.list({}, query);
        }
        return this._client.getAPIList("/assistants", AssistantsPage, {
          query,
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
      /**
       * Delete an assistant.
       */
      del(assistantId, options2) {
        return this._client.delete(`/assistants/${assistantId}`, {
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
    };
    AssistantsPage = class extends CursorPage {
    };
    (function(Assistants2) {
      Assistants2.AssistantsPage = AssistantsPage;
      Assistants2.Files = Files;
      Assistants2.AssistantFilesPage = AssistantFilesPage;
    })(Assistants || (Assistants = {}));
  }
});

// node_modules/openai/lib/RunnableFunction.mjs
function isRunnableFunctionWithParse(fn) {
  return typeof fn.parse === "function";
}
var init_RunnableFunction = __esm({
  "node_modules/openai/lib/RunnableFunction.mjs"() {
  }
});

// node_modules/openai/lib/chatCompletionUtils.mjs
var isAssistantMessage, isFunctionMessage, isToolMessage;
var init_chatCompletionUtils = __esm({
  "node_modules/openai/lib/chatCompletionUtils.mjs"() {
    isAssistantMessage = (message) => {
      return message?.role === "assistant";
    };
    isFunctionMessage = (message) => {
      return message?.role === "function";
    };
    isToolMessage = (message) => {
      return message?.role === "tool";
    };
  }
});

// node_modules/openai/lib/AbstractChatCompletionRunner.mjs
var __classPrivateFieldSet2, __classPrivateFieldGet2, _AbstractChatCompletionRunner_instances, _AbstractChatCompletionRunner_connectedPromise, _AbstractChatCompletionRunner_resolveConnectedPromise, _AbstractChatCompletionRunner_rejectConnectedPromise, _AbstractChatCompletionRunner_endPromise, _AbstractChatCompletionRunner_resolveEndPromise, _AbstractChatCompletionRunner_rejectEndPromise, _AbstractChatCompletionRunner_listeners, _AbstractChatCompletionRunner_ended, _AbstractChatCompletionRunner_errored, _AbstractChatCompletionRunner_aborted, _AbstractChatCompletionRunner_catchingPromiseCreated, _AbstractChatCompletionRunner_getFinalContent, _AbstractChatCompletionRunner_getFinalMessage, _AbstractChatCompletionRunner_getFinalFunctionCall, _AbstractChatCompletionRunner_getFinalFunctionCallResult, _AbstractChatCompletionRunner_calculateTotalUsage, _AbstractChatCompletionRunner_handleError, _AbstractChatCompletionRunner_validateParams, _AbstractChatCompletionRunner_stringifyFunctionCallResult, DEFAULT_MAX_CHAT_COMPLETIONS, AbstractChatCompletionRunner;
var init_AbstractChatCompletionRunner = __esm({
  "node_modules/openai/lib/AbstractChatCompletionRunner.mjs"() {
    init_error();
    init_RunnableFunction();
    init_chatCompletionUtils();
    __classPrivateFieldSet2 = function(receiver, state, value, kind2, f) {
      if (kind2 === "m")
        throw new TypeError("Private method is not writable");
      if (kind2 === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind2 === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    __classPrivateFieldGet2 = function(receiver, state, kind2, f) {
      if (kind2 === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    DEFAULT_MAX_CHAT_COMPLETIONS = 10;
    AbstractChatCompletionRunner = class {
      constructor() {
        _AbstractChatCompletionRunner_instances.add(this);
        this.controller = new AbortController();
        _AbstractChatCompletionRunner_connectedPromise.set(this, void 0);
        _AbstractChatCompletionRunner_resolveConnectedPromise.set(this, () => {
        });
        _AbstractChatCompletionRunner_rejectConnectedPromise.set(this, () => {
        });
        _AbstractChatCompletionRunner_endPromise.set(this, void 0);
        _AbstractChatCompletionRunner_resolveEndPromise.set(this, () => {
        });
        _AbstractChatCompletionRunner_rejectEndPromise.set(this, () => {
        });
        _AbstractChatCompletionRunner_listeners.set(this, {});
        this._chatCompletions = [];
        this.messages = [];
        _AbstractChatCompletionRunner_ended.set(this, false);
        _AbstractChatCompletionRunner_errored.set(this, false);
        _AbstractChatCompletionRunner_aborted.set(this, false);
        _AbstractChatCompletionRunner_catchingPromiseCreated.set(this, false);
        _AbstractChatCompletionRunner_handleError.set(this, (error2) => {
          __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_errored, true, "f");
          if (error2 instanceof Error && error2.name === "AbortError") {
            error2 = new APIUserAbortError();
          }
          if (error2 instanceof APIUserAbortError) {
            __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_aborted, true, "f");
            return this._emit("abort", error2);
          }
          if (error2 instanceof OpenAIError) {
            return this._emit("error", error2);
          }
          if (error2 instanceof Error) {
            const openAIError = new OpenAIError(error2.message);
            openAIError.cause = error2;
            return this._emit("error", openAIError);
          }
          return this._emit("error", new OpenAIError(String(error2)));
        });
        __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_connectedPromise, new Promise((resolve2, reject) => {
          __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_resolveConnectedPromise, resolve2, "f");
          __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_rejectConnectedPromise, reject, "f");
        }), "f");
        __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_endPromise, new Promise((resolve2, reject) => {
          __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_resolveEndPromise, resolve2, "f");
          __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_rejectEndPromise, reject, "f");
        }), "f");
        __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_connectedPromise, "f").catch(() => {
        });
        __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_endPromise, "f").catch(() => {
        });
      }
      _run(executor) {
        setTimeout(() => {
          executor().then(() => {
            this._emitFinal();
            this._emit("end");
          }, __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_handleError, "f"));
        }, 0);
      }
      _addChatCompletion(chatCompletion) {
        this._chatCompletions.push(chatCompletion);
        this._emit("chatCompletion", chatCompletion);
        const message = chatCompletion.choices[0]?.message;
        if (message)
          this._addMessage(message);
        return chatCompletion;
      }
      _addMessage(message, emit = true) {
        if (!("content" in message))
          message.content = null;
        this.messages.push(message);
        if (emit) {
          this._emit("message", message);
          if ((isFunctionMessage(message) || isToolMessage(message)) && message.content) {
            this._emit("functionCallResult", message.content);
          } else if (isAssistantMessage(message) && message.function_call) {
            this._emit("functionCall", message.function_call);
          } else if (isAssistantMessage(message) && message.tool_calls) {
            for (const tool_call of message.tool_calls) {
              if (tool_call.type === "function") {
                this._emit("functionCall", tool_call.function);
              }
            }
          }
        }
      }
      _connected() {
        if (this.ended)
          return;
        __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_resolveConnectedPromise, "f").call(this);
        this._emit("connect");
      }
      get ended() {
        return __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_ended, "f");
      }
      get errored() {
        return __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_errored, "f");
      }
      get aborted() {
        return __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_aborted, "f");
      }
      abort() {
        this.controller.abort();
      }
      /**
       * Adds the listener function to the end of the listeners array for the event.
       * No checks are made to see if the listener has already been added. Multiple calls passing
       * the same combination of event and listener will result in the listener being added, and
       * called, multiple times.
       * @returns this ChatCompletionStream, so that calls can be chained
       */
      on(event, listener) {
        const listeners = __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_listeners, "f")[event] || (__classPrivateFieldGet2(this, _AbstractChatCompletionRunner_listeners, "f")[event] = []);
        listeners.push({ listener });
        return this;
      }
      /**
       * Removes the specified listener from the listener array for the event.
       * off() will remove, at most, one instance of a listener from the listener array. If any single
       * listener has been added multiple times to the listener array for the specified event, then
       * off() must be called multiple times to remove each instance.
       * @returns this ChatCompletionStream, so that calls can be chained
       */
      off(event, listener) {
        const listeners = __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_listeners, "f")[event];
        if (!listeners)
          return this;
        const index8 = listeners.findIndex((l) => l.listener === listener);
        if (index8 >= 0)
          listeners.splice(index8, 1);
        return this;
      }
      /**
       * Adds a one-time listener function for the event. The next time the event is triggered,
       * this listener is removed and then invoked.
       * @returns this ChatCompletionStream, so that calls can be chained
       */
      once(event, listener) {
        const listeners = __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_listeners, "f")[event] || (__classPrivateFieldGet2(this, _AbstractChatCompletionRunner_listeners, "f")[event] = []);
        listeners.push({ listener, once: true });
        return this;
      }
      /**
       * This is similar to `.once()`, but returns a Promise that resolves the next time
       * the event is triggered, instead of calling a listener callback.
       * @returns a Promise that resolves the next time given event is triggered,
       * or rejects if an error is emitted.  (If you request the 'error' event,
       * returns a promise that resolves with the error).
       *
       * Example:
       *
       *   const message = await stream.emitted('message') // rejects if the stream errors
       */
      emitted(event) {
        return new Promise((resolve2, reject) => {
          __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_catchingPromiseCreated, true, "f");
          if (event !== "error")
            this.once("error", reject);
          this.once(event, resolve2);
        });
      }
      async done() {
        __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_catchingPromiseCreated, true, "f");
        await __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_endPromise, "f");
      }
      /**
       * @returns a promise that resolves with the final ChatCompletion, or rejects
       * if an error occurred or the stream ended prematurely without producing a ChatCompletion.
       */
      async finalChatCompletion() {
        await this.done();
        const completion = this._chatCompletions[this._chatCompletions.length - 1];
        if (!completion)
          throw new OpenAIError("stream ended without producing a ChatCompletion");
        return completion;
      }
      /**
       * @returns a promise that resolves with the content of the final ChatCompletionMessage, or rejects
       * if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
       */
      async finalContent() {
        await this.done();
        return __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalContent).call(this);
      }
      /**
       * @returns a promise that resolves with the the final assistant ChatCompletionMessage response,
       * or rejects if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
       */
      async finalMessage() {
        await this.done();
        return __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalMessage).call(this);
      }
      /**
       * @returns a promise that resolves with the content of the final FunctionCall, or rejects
       * if an error occurred or the stream ended prematurely without producing a ChatCompletionMessage.
       */
      async finalFunctionCall() {
        await this.done();
        return __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionCall).call(this);
      }
      async finalFunctionCallResult() {
        await this.done();
        return __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionCallResult).call(this);
      }
      async totalUsage() {
        await this.done();
        return __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_calculateTotalUsage).call(this);
      }
      allChatCompletions() {
        return [...this._chatCompletions];
      }
      _emit(event, ...args) {
        if (__classPrivateFieldGet2(this, _AbstractChatCompletionRunner_ended, "f")) {
          return;
        }
        if (event === "end") {
          __classPrivateFieldSet2(this, _AbstractChatCompletionRunner_ended, true, "f");
          __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_resolveEndPromise, "f").call(this);
        }
        const listeners = __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_listeners, "f")[event];
        if (listeners) {
          __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_listeners, "f")[event] = listeners.filter((l) => !l.once);
          listeners.forEach(({ listener }) => listener(...args));
        }
        if (event === "abort") {
          const error2 = args[0];
          if (!__classPrivateFieldGet2(this, _AbstractChatCompletionRunner_catchingPromiseCreated, "f") && !listeners?.length) {
            Promise.reject(error2);
          }
          __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_rejectConnectedPromise, "f").call(this, error2);
          __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_rejectEndPromise, "f").call(this, error2);
          this._emit("end");
          return;
        }
        if (event === "error") {
          const error2 = args[0];
          if (!__classPrivateFieldGet2(this, _AbstractChatCompletionRunner_catchingPromiseCreated, "f") && !listeners?.length) {
            Promise.reject(error2);
          }
          __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_rejectConnectedPromise, "f").call(this, error2);
          __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_rejectEndPromise, "f").call(this, error2);
          this._emit("end");
        }
      }
      _emitFinal() {
        const completion = this._chatCompletions[this._chatCompletions.length - 1];
        if (completion)
          this._emit("finalChatCompletion", completion);
        const finalMessage = __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalMessage).call(this);
        if (finalMessage)
          this._emit("finalMessage", finalMessage);
        const finalContent = __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalContent).call(this);
        if (finalContent)
          this._emit("finalContent", finalContent);
        const finalFunctionCall = __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionCall).call(this);
        if (finalFunctionCall)
          this._emit("finalFunctionCall", finalFunctionCall);
        const finalFunctionCallResult = __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalFunctionCallResult).call(this);
        if (finalFunctionCallResult != null)
          this._emit("finalFunctionCallResult", finalFunctionCallResult);
        if (this._chatCompletions.some((c2) => c2.usage)) {
          this._emit("totalUsage", __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_calculateTotalUsage).call(this));
        }
      }
      async _createChatCompletion(completions, params, options2) {
        const signal = options2?.signal;
        if (signal) {
          if (signal.aborted)
            this.controller.abort();
          signal.addEventListener("abort", () => this.controller.abort());
        }
        __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_validateParams).call(this, params);
        const chatCompletion = await completions.create({ ...params, stream: false }, { ...options2, signal: this.controller.signal });
        this._connected();
        return this._addChatCompletion(chatCompletion);
      }
      async _runChatCompletion(completions, params, options2) {
        for (const message of params.messages) {
          this._addMessage(message, false);
        }
        return await this._createChatCompletion(completions, params, options2);
      }
      async _runFunctions(completions, params, options2) {
        const role = "function";
        const { function_call = "auto", stream, ...restParams } = params;
        const singleFunctionToCall = typeof function_call !== "string" && function_call?.name;
        const { maxChatCompletions = DEFAULT_MAX_CHAT_COMPLETIONS } = options2 || {};
        const functionsByName = {};
        for (const f of params.functions) {
          functionsByName[f.name || f.function.name] = f;
        }
        const functions = params.functions.map((f) => ({
          name: f.name || f.function.name,
          parameters: f.parameters,
          description: f.description
        }));
        for (const message of params.messages) {
          this._addMessage(message, false);
        }
        for (let i2 = 0; i2 < maxChatCompletions; ++i2) {
          const chatCompletion = await this._createChatCompletion(completions, {
            ...restParams,
            function_call,
            functions,
            messages: [...this.messages]
          }, options2);
          const message = chatCompletion.choices[0]?.message;
          if (!message) {
            throw new OpenAIError(`missing message in ChatCompletion response`);
          }
          if (!message.function_call)
            return;
          const { name, arguments: args } = message.function_call;
          const fn = functionsByName[name];
          if (!fn) {
            const content2 = `Invalid function_call: ${JSON.stringify(name)}. Available options are: ${functions.map((f) => JSON.stringify(f.name)).join(", ")}. Please try again`;
            this._addMessage({ role, name, content: content2 });
            continue;
          } else if (singleFunctionToCall && singleFunctionToCall !== name) {
            const content2 = `Invalid function_call: ${JSON.stringify(name)}. ${JSON.stringify(singleFunctionToCall)} requested. Please try again`;
            this._addMessage({ role, name, content: content2 });
            continue;
          }
          let parsed;
          try {
            parsed = isRunnableFunctionWithParse(fn) ? await fn.parse(args) : args;
          } catch (error2) {
            this._addMessage({
              role,
              name,
              content: error2 instanceof Error ? error2.message : String(error2)
            });
            continue;
          }
          const rawContent = await fn.function(parsed, this);
          const content = __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_stringifyFunctionCallResult).call(this, rawContent);
          this._addMessage({ role, name, content });
          if (singleFunctionToCall)
            return;
        }
      }
      async _runTools(completions, params, options2) {
        const role = "tool";
        const { tool_choice = "auto", stream, ...restParams } = params;
        const singleFunctionToCall = typeof tool_choice !== "string" && tool_choice?.function?.name;
        const { maxChatCompletions = DEFAULT_MAX_CHAT_COMPLETIONS } = options2 || {};
        const functionsByName = {};
        for (const f of params.tools) {
          if (f.type === "function") {
            functionsByName[f.function.name || f.function.function.name] = f.function;
          }
        }
        const tools = "tools" in params ? params.tools.map((t3) => t3.type === "function" ? {
          type: "function",
          function: {
            name: t3.function.name || t3.function.function.name,
            parameters: t3.function.parameters,
            description: t3.function.description
          }
        } : t3) : void 0;
        for (const message of params.messages) {
          this._addMessage(message, false);
        }
        for (let i2 = 0; i2 < maxChatCompletions; ++i2) {
          const chatCompletion = await this._createChatCompletion(completions, {
            ...restParams,
            tool_choice,
            tools,
            messages: [...this.messages]
          }, options2);
          const message = chatCompletion.choices[0]?.message;
          if (!message) {
            throw new OpenAIError(`missing message in ChatCompletion response`);
          }
          if (!message.tool_calls) {
            return;
          }
          for (const tool_call of message.tool_calls) {
            if (tool_call.type !== "function")
              continue;
            const tool_call_id = tool_call.id;
            const { name, arguments: args } = tool_call.function;
            const fn = functionsByName[name];
            if (!fn) {
              const content2 = `Invalid tool_call: ${JSON.stringify(name)}. Available options are: ${tools.map((f) => JSON.stringify(f.function.name)).join(", ")}. Please try again`;
              this._addMessage({ role, tool_call_id, content: content2 });
              continue;
            } else if (singleFunctionToCall && singleFunctionToCall !== name) {
              const content2 = `Invalid tool_call: ${JSON.stringify(name)}. ${JSON.stringify(singleFunctionToCall)} requested. Please try again`;
              this._addMessage({ role, tool_call_id, content: content2 });
              continue;
            }
            let parsed;
            try {
              parsed = isRunnableFunctionWithParse(fn) ? await fn.parse(args) : args;
            } catch (error2) {
              const content2 = error2 instanceof Error ? error2.message : String(error2);
              this._addMessage({ role, tool_call_id, content: content2 });
              continue;
            }
            const rawContent = await fn.function(parsed, this);
            const content = __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_stringifyFunctionCallResult).call(this, rawContent);
            this._addMessage({ role, tool_call_id, content });
            if (singleFunctionToCall) {
              return;
            }
          }
        }
        return;
      }
    };
    _AbstractChatCompletionRunner_connectedPromise = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_resolveConnectedPromise = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_rejectConnectedPromise = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_endPromise = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_resolveEndPromise = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_rejectEndPromise = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_listeners = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_ended = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_errored = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_aborted = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_catchingPromiseCreated = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_handleError = /* @__PURE__ */ new WeakMap(), _AbstractChatCompletionRunner_instances = /* @__PURE__ */ new WeakSet(), _AbstractChatCompletionRunner_getFinalContent = function _AbstractChatCompletionRunner_getFinalContent2() {
      return __classPrivateFieldGet2(this, _AbstractChatCompletionRunner_instances, "m", _AbstractChatCompletionRunner_getFinalMessage).call(this).content ?? null;
    }, _AbstractChatCompletionRunner_getFinalMessage = function _AbstractChatCompletionRunner_getFinalMessage2() {
      let i2 = this.messages.length;
      while (i2-- > 0) {
        const message = this.messages[i2];
        if (isAssistantMessage(message)) {
          return { ...message, content: message.content ?? null };
        }
      }
      throw new OpenAIError("stream ended without producing a ChatCompletionMessage with role=assistant");
    }, _AbstractChatCompletionRunner_getFinalFunctionCall = function _AbstractChatCompletionRunner_getFinalFunctionCall2() {
      for (let i2 = this.messages.length - 1; i2 >= 0; i2--) {
        const message = this.messages[i2];
        if (isAssistantMessage(message) && message?.function_call) {
          return message.function_call;
        }
        if (isAssistantMessage(message) && message?.tool_calls?.length) {
          return message.tool_calls.at(-1)?.function;
        }
      }
      return;
    }, _AbstractChatCompletionRunner_getFinalFunctionCallResult = function _AbstractChatCompletionRunner_getFinalFunctionCallResult2() {
      for (let i2 = this.messages.length - 1; i2 >= 0; i2--) {
        const message = this.messages[i2];
        if (isFunctionMessage(message) && message.content != null) {
          return message.content;
        }
        if (isToolMessage(message) && message.content != null && this.messages.some((x) => x.role === "assistant" && x.tool_calls?.some((y) => y.type === "function" && y.id === message.tool_call_id))) {
          return message.content;
        }
      }
      return;
    }, _AbstractChatCompletionRunner_calculateTotalUsage = function _AbstractChatCompletionRunner_calculateTotalUsage2() {
      const total = {
        completion_tokens: 0,
        prompt_tokens: 0,
        total_tokens: 0
      };
      for (const { usage } of this._chatCompletions) {
        if (usage) {
          total.completion_tokens += usage.completion_tokens;
          total.prompt_tokens += usage.prompt_tokens;
          total.total_tokens += usage.total_tokens;
        }
      }
      return total;
    }, _AbstractChatCompletionRunner_validateParams = function _AbstractChatCompletionRunner_validateParams2(params) {
      if (params.n != null && params.n > 1) {
        throw new OpenAIError("ChatCompletion convenience helpers only support n=1 at this time. To use n>1, please use chat.completions.create() directly.");
      }
    }, _AbstractChatCompletionRunner_stringifyFunctionCallResult = function _AbstractChatCompletionRunner_stringifyFunctionCallResult2(rawContent) {
      return typeof rawContent === "string" ? rawContent : rawContent === void 0 ? "undefined" : JSON.stringify(rawContent);
    };
  }
});

// node_modules/openai/lib/ChatCompletionRunner.mjs
var ChatCompletionRunner;
var init_ChatCompletionRunner = __esm({
  "node_modules/openai/lib/ChatCompletionRunner.mjs"() {
    init_AbstractChatCompletionRunner();
    init_chatCompletionUtils();
    ChatCompletionRunner = class _ChatCompletionRunner extends AbstractChatCompletionRunner {
      /** @deprecated - please use `runTools` instead. */
      static runFunctions(completions, params, options2) {
        const runner = new _ChatCompletionRunner();
        const opts = {
          ...options2,
          headers: { ...options2?.headers, "X-Stainless-Helper-Method": "runFunctions" }
        };
        runner._run(() => runner._runFunctions(completions, params, opts));
        return runner;
      }
      static runTools(completions, params, options2) {
        const runner = new _ChatCompletionRunner();
        const opts = {
          ...options2,
          headers: { ...options2?.headers, "X-Stainless-Helper-Method": "runTools" }
        };
        runner._run(() => runner._runTools(completions, params, opts));
        return runner;
      }
      _addMessage(message) {
        super._addMessage(message);
        if (isAssistantMessage(message) && message.content) {
          this._emit("content", message.content);
        }
      }
    };
  }
});

// node_modules/openai/lib/ChatCompletionStream.mjs
function finalizeChatCompletion(snapshot) {
  const { id, choices, created, model } = snapshot;
  return {
    id,
    choices: choices.map(({ message, finish_reason, index: index8, logprobs }) => {
      if (!finish_reason)
        throw new OpenAIError(`missing finish_reason for choice ${index8}`);
      const { content = null, function_call, tool_calls } = message;
      const role = message.role;
      if (!role)
        throw new OpenAIError(`missing role for choice ${index8}`);
      if (function_call) {
        const { arguments: args, name } = function_call;
        if (args == null)
          throw new OpenAIError(`missing function_call.arguments for choice ${index8}`);
        if (!name)
          throw new OpenAIError(`missing function_call.name for choice ${index8}`);
        return {
          message: { content, function_call: { arguments: args, name }, role },
          finish_reason,
          index: index8,
          logprobs
        };
      }
      if (tool_calls) {
        return {
          index: index8,
          finish_reason,
          logprobs,
          message: {
            role,
            content,
            tool_calls: tool_calls.map((tool_call, i2) => {
              const { function: fn, type, id: id2 } = tool_call;
              const { arguments: args, name } = fn || {};
              if (id2 == null)
                throw new OpenAIError(`missing choices[${index8}].tool_calls[${i2}].id
${str(snapshot)}`);
              if (type == null)
                throw new OpenAIError(`missing choices[${index8}].tool_calls[${i2}].type
${str(snapshot)}`);
              if (name == null)
                throw new OpenAIError(`missing choices[${index8}].tool_calls[${i2}].function.name
${str(snapshot)}`);
              if (args == null)
                throw new OpenAIError(`missing choices[${index8}].tool_calls[${i2}].function.arguments
${str(snapshot)}`);
              return { id: id2, type, function: { name, arguments: args } };
            })
          }
        };
      }
      return { message: { content, role }, finish_reason, index: index8, logprobs };
    }),
    created,
    model,
    object: "chat.completion"
  };
}
function str(x) {
  return JSON.stringify(x);
}
var __classPrivateFieldGet3, __classPrivateFieldSet3, _ChatCompletionStream_instances, _ChatCompletionStream_currentChatCompletionSnapshot, _ChatCompletionStream_beginRequest, _ChatCompletionStream_addChunk, _ChatCompletionStream_endRequest, _ChatCompletionStream_accumulateChatCompletion, ChatCompletionStream;
var init_ChatCompletionStream = __esm({
  "node_modules/openai/lib/ChatCompletionStream.mjs"() {
    init_error();
    init_AbstractChatCompletionRunner();
    init_streaming();
    __classPrivateFieldGet3 = function(receiver, state, kind2, f) {
      if (kind2 === "a" && !f)
        throw new TypeError("Private accessor was defined without a getter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot read private member from an object whose class did not declare it");
      return kind2 === "m" ? f : kind2 === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
    };
    __classPrivateFieldSet3 = function(receiver, state, value, kind2, f) {
      if (kind2 === "m")
        throw new TypeError("Private method is not writable");
      if (kind2 === "a" && !f)
        throw new TypeError("Private accessor was defined without a setter");
      if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
        throw new TypeError("Cannot write private member to an object whose class did not declare it");
      return kind2 === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
    };
    ChatCompletionStream = class _ChatCompletionStream extends AbstractChatCompletionRunner {
      constructor() {
        super(...arguments);
        _ChatCompletionStream_instances.add(this);
        _ChatCompletionStream_currentChatCompletionSnapshot.set(this, void 0);
      }
      get currentChatCompletionSnapshot() {
        return __classPrivateFieldGet3(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f");
      }
      /**
       * Intended for use on the frontend, consuming a stream produced with
       * `.toReadableStream()` on the backend.
       *
       * Note that messages sent to the model do not appear in `.on('message')`
       * in this context.
       */
      static fromReadableStream(stream) {
        const runner = new _ChatCompletionStream();
        runner._run(() => runner._fromReadableStream(stream));
        return runner;
      }
      static createChatCompletion(completions, params, options2) {
        const runner = new _ChatCompletionStream();
        runner._run(() => runner._runChatCompletion(completions, { ...params, stream: true }, { ...options2, headers: { ...options2?.headers, "X-Stainless-Helper-Method": "stream" } }));
        return runner;
      }
      async _createChatCompletion(completions, params, options2) {
        const signal = options2?.signal;
        if (signal) {
          if (signal.aborted)
            this.controller.abort();
          signal.addEventListener("abort", () => this.controller.abort());
        }
        __classPrivateFieldGet3(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_beginRequest).call(this);
        const stream = await completions.create({ ...params, stream: true }, { ...options2, signal: this.controller.signal });
        this._connected();
        for await (const chunk of stream) {
          __classPrivateFieldGet3(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_addChunk).call(this, chunk);
        }
        if (stream.controller.signal?.aborted) {
          throw new APIUserAbortError();
        }
        return this._addChatCompletion(__classPrivateFieldGet3(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
      }
      async _fromReadableStream(readableStream, options2) {
        const signal = options2?.signal;
        if (signal) {
          if (signal.aborted)
            this.controller.abort();
          signal.addEventListener("abort", () => this.controller.abort());
        }
        __classPrivateFieldGet3(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_beginRequest).call(this);
        this._connected();
        const stream = Stream.fromReadableStream(readableStream, this.controller);
        let chatId;
        for await (const chunk of stream) {
          if (chatId && chatId !== chunk.id) {
            this._addChatCompletion(__classPrivateFieldGet3(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
          }
          __classPrivateFieldGet3(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_addChunk).call(this, chunk);
          chatId = chunk.id;
        }
        if (stream.controller.signal?.aborted) {
          throw new APIUserAbortError();
        }
        return this._addChatCompletion(__classPrivateFieldGet3(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_endRequest).call(this));
      }
      [(_ChatCompletionStream_currentChatCompletionSnapshot = /* @__PURE__ */ new WeakMap(), _ChatCompletionStream_instances = /* @__PURE__ */ new WeakSet(), _ChatCompletionStream_beginRequest = function _ChatCompletionStream_beginRequest2() {
        if (this.ended)
          return;
        __classPrivateFieldSet3(this, _ChatCompletionStream_currentChatCompletionSnapshot, void 0, "f");
      }, _ChatCompletionStream_addChunk = function _ChatCompletionStream_addChunk2(chunk) {
        if (this.ended)
          return;
        const completion = __classPrivateFieldGet3(this, _ChatCompletionStream_instances, "m", _ChatCompletionStream_accumulateChatCompletion).call(this, chunk);
        this._emit("chunk", chunk, completion);
        const delta = chunk.choices[0]?.delta?.content;
        const snapshot = completion.choices[0]?.message;
        if (delta != null && snapshot?.role === "assistant" && snapshot?.content) {
          this._emit("content", delta, snapshot.content);
        }
      }, _ChatCompletionStream_endRequest = function _ChatCompletionStream_endRequest2() {
        if (this.ended) {
          throw new OpenAIError(`stream has ended, this shouldn't happen`);
        }
        const snapshot = __classPrivateFieldGet3(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f");
        if (!snapshot) {
          throw new OpenAIError(`request ended without sending any chunks`);
        }
        __classPrivateFieldSet3(this, _ChatCompletionStream_currentChatCompletionSnapshot, void 0, "f");
        return finalizeChatCompletion(snapshot);
      }, _ChatCompletionStream_accumulateChatCompletion = function _ChatCompletionStream_accumulateChatCompletion2(chunk) {
        var _a2, _b, _c;
        let snapshot = __classPrivateFieldGet3(this, _ChatCompletionStream_currentChatCompletionSnapshot, "f");
        const { choices, ...rest } = chunk;
        if (!snapshot) {
          snapshot = __classPrivateFieldSet3(this, _ChatCompletionStream_currentChatCompletionSnapshot, {
            ...rest,
            choices: []
          }, "f");
        } else {
          Object.assign(snapshot, rest);
        }
        for (const { delta, finish_reason, index: index8, logprobs = null, ...other } of chunk.choices) {
          let choice = snapshot.choices[index8];
          if (!choice) {
            snapshot.choices[index8] = { finish_reason, index: index8, message: delta, logprobs, ...other };
            continue;
          }
          if (logprobs) {
            if (!choice.logprobs) {
              choice.logprobs = logprobs;
            } else if (logprobs.content) {
              (_a2 = choice.logprobs).content ?? (_a2.content = []);
              choice.logprobs.content.push(...logprobs.content);
            }
          }
          if (finish_reason)
            choice.finish_reason = finish_reason;
          Object.assign(choice, other);
          if (!delta)
            continue;
          const { content, function_call, role, tool_calls } = delta;
          if (content)
            choice.message.content = (choice.message.content || "") + content;
          if (role)
            choice.message.role = role;
          if (function_call) {
            if (!choice.message.function_call) {
              choice.message.function_call = function_call;
            } else {
              if (function_call.name)
                choice.message.function_call.name = function_call.name;
              if (function_call.arguments) {
                (_b = choice.message.function_call).arguments ?? (_b.arguments = "");
                choice.message.function_call.arguments += function_call.arguments;
              }
            }
          }
          if (tool_calls) {
            if (!choice.message.tool_calls)
              choice.message.tool_calls = [];
            for (const { index: index9, id, type, function: fn } of tool_calls) {
              const tool_call = (_c = choice.message.tool_calls)[index9] ?? (_c[index9] = {});
              if (id)
                tool_call.id = id;
              if (type)
                tool_call.type = type;
              if (fn)
                tool_call.function ?? (tool_call.function = { arguments: "" });
              if (fn?.name)
                tool_call.function.name = fn.name;
              if (fn?.arguments)
                tool_call.function.arguments += fn.arguments;
            }
          }
        }
        return snapshot;
      }, Symbol.asyncIterator)]() {
        const pushQueue = [];
        const readQueue = [];
        let done = false;
        this.on("chunk", (chunk) => {
          const reader = readQueue.shift();
          if (reader) {
            reader(chunk);
          } else {
            pushQueue.push(chunk);
          }
        });
        this.on("end", () => {
          done = true;
          for (const reader of readQueue) {
            reader(void 0);
          }
          readQueue.length = 0;
        });
        return {
          next: async () => {
            if (!pushQueue.length) {
              if (done) {
                return { value: void 0, done: true };
              }
              return new Promise((resolve2) => readQueue.push(resolve2)).then((chunk2) => chunk2 ? { value: chunk2, done: false } : { value: void 0, done: true });
            }
            const chunk = pushQueue.shift();
            return { value: chunk, done: false };
          }
        };
      }
      toReadableStream() {
        const stream = new Stream(this[Symbol.asyncIterator].bind(this), this.controller);
        return stream.toReadableStream();
      }
    };
  }
});

// node_modules/openai/lib/ChatCompletionStreamingRunner.mjs
var ChatCompletionStreamingRunner;
var init_ChatCompletionStreamingRunner = __esm({
  "node_modules/openai/lib/ChatCompletionStreamingRunner.mjs"() {
    init_ChatCompletionStream();
    ChatCompletionStreamingRunner = class _ChatCompletionStreamingRunner extends ChatCompletionStream {
      static fromReadableStream(stream) {
        const runner = new _ChatCompletionStreamingRunner();
        runner._run(() => runner._fromReadableStream(stream));
        return runner;
      }
      /** @deprecated - please use `runTools` instead. */
      static runFunctions(completions, params, options2) {
        const runner = new _ChatCompletionStreamingRunner();
        const opts = {
          ...options2,
          headers: { ...options2?.headers, "X-Stainless-Helper-Method": "runFunctions" }
        };
        runner._run(() => runner._runFunctions(completions, params, opts));
        return runner;
      }
      static runTools(completions, params, options2) {
        const runner = new _ChatCompletionStreamingRunner();
        const opts = {
          ...options2,
          headers: { ...options2?.headers, "X-Stainless-Helper-Method": "runTools" }
        };
        runner._run(() => runner._runTools(completions, params, opts));
        return runner;
      }
    };
  }
});

// node_modules/openai/resources/beta/chat/completions.mjs
var Completions2;
var init_completions2 = __esm({
  "node_modules/openai/resources/beta/chat/completions.mjs"() {
    init_resource();
    init_ChatCompletionRunner();
    init_ChatCompletionStreamingRunner();
    init_ChatCompletionStream();
    Completions2 = class extends APIResource {
      runFunctions(body, options2) {
        if (body.stream) {
          return ChatCompletionStreamingRunner.runFunctions(this._client.chat.completions, body, options2);
        }
        return ChatCompletionRunner.runFunctions(this._client.chat.completions, body, options2);
      }
      runTools(body, options2) {
        if (body.stream) {
          return ChatCompletionStreamingRunner.runTools(this._client.chat.completions, body, options2);
        }
        return ChatCompletionRunner.runTools(this._client.chat.completions, body, options2);
      }
      /**
       * Creates a chat completion stream
       */
      stream(body, options2) {
        return ChatCompletionStream.createChatCompletion(this._client.chat.completions, body, options2);
      }
    };
  }
});

// node_modules/openai/resources/beta/chat/chat.mjs
var Chat2;
var init_chat3 = __esm({
  "node_modules/openai/resources/beta/chat/chat.mjs"() {
    init_resource();
    init_completions2();
    Chat2 = class extends APIResource {
      constructor() {
        super(...arguments);
        this.completions = new Completions2(this._client);
      }
    };
    (function(Chat3) {
      Chat3.Completions = Completions2;
    })(Chat2 || (Chat2 = {}));
  }
});

// node_modules/openai/resources/beta/threads/messages/files.mjs
var Files2, MessageFilesPage;
var init_files2 = __esm({
  "node_modules/openai/resources/beta/threads/messages/files.mjs"() {
    init_resource();
    init_core();
    init_files2();
    init_pagination();
    Files2 = class extends APIResource {
      /**
       * Retrieves a message file.
       */
      retrieve(threadId, messageId, fileId, options2) {
        return this._client.get(`/threads/${threadId}/messages/${messageId}/files/${fileId}`, {
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
      list(threadId, messageId, query = {}, options2) {
        if (isRequestOptions(query)) {
          return this.list(threadId, messageId, {}, query);
        }
        return this._client.getAPIList(`/threads/${threadId}/messages/${messageId}/files`, MessageFilesPage, {
          query,
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
    };
    MessageFilesPage = class extends CursorPage {
    };
    (function(Files4) {
      Files4.MessageFilesPage = MessageFilesPage;
    })(Files2 || (Files2 = {}));
  }
});

// node_modules/openai/resources/beta/threads/messages/messages.mjs
var Messages, ThreadMessagesPage;
var init_messages = __esm({
  "node_modules/openai/resources/beta/threads/messages/messages.mjs"() {
    init_resource();
    init_core();
    init_messages();
    init_files2();
    init_pagination();
    Messages = class extends APIResource {
      constructor() {
        super(...arguments);
        this.files = new Files2(this._client);
      }
      /**
       * Create a message.
       */
      create(threadId, body, options2) {
        return this._client.post(`/threads/${threadId}/messages`, {
          body,
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
      /**
       * Retrieve a message.
       */
      retrieve(threadId, messageId, options2) {
        return this._client.get(`/threads/${threadId}/messages/${messageId}`, {
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
      /**
       * Modifies a message.
       */
      update(threadId, messageId, body, options2) {
        return this._client.post(`/threads/${threadId}/messages/${messageId}`, {
          body,
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
      list(threadId, query = {}, options2) {
        if (isRequestOptions(query)) {
          return this.list(threadId, {}, query);
        }
        return this._client.getAPIList(`/threads/${threadId}/messages`, ThreadMessagesPage, {
          query,
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
    };
    ThreadMessagesPage = class extends CursorPage {
    };
    (function(Messages2) {
      Messages2.ThreadMessagesPage = ThreadMessagesPage;
      Messages2.Files = Files2;
      Messages2.MessageFilesPage = MessageFilesPage;
    })(Messages || (Messages = {}));
  }
});

// node_modules/openai/resources/beta/threads/runs/steps.mjs
var Steps, RunStepsPage;
var init_steps = __esm({
  "node_modules/openai/resources/beta/threads/runs/steps.mjs"() {
    init_resource();
    init_core();
    init_steps();
    init_pagination();
    Steps = class extends APIResource {
      /**
       * Retrieves a run step.
       */
      retrieve(threadId, runId, stepId, options2) {
        return this._client.get(`/threads/${threadId}/runs/${runId}/steps/${stepId}`, {
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
      list(threadId, runId, query = {}, options2) {
        if (isRequestOptions(query)) {
          return this.list(threadId, runId, {}, query);
        }
        return this._client.getAPIList(`/threads/${threadId}/runs/${runId}/steps`, RunStepsPage, {
          query,
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
    };
    RunStepsPage = class extends CursorPage {
    };
    (function(Steps2) {
      Steps2.RunStepsPage = RunStepsPage;
    })(Steps || (Steps = {}));
  }
});

// node_modules/openai/resources/beta/threads/runs/runs.mjs
var Runs, RunsPage;
var init_runs = __esm({
  "node_modules/openai/resources/beta/threads/runs/runs.mjs"() {
    init_resource();
    init_core();
    init_runs();
    init_steps();
    init_pagination();
    Runs = class extends APIResource {
      constructor() {
        super(...arguments);
        this.steps = new Steps(this._client);
      }
      /**
       * Create a run.
       */
      create(threadId, body, options2) {
        return this._client.post(`/threads/${threadId}/runs`, {
          body,
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
      /**
       * Retrieves a run.
       */
      retrieve(threadId, runId, options2) {
        return this._client.get(`/threads/${threadId}/runs/${runId}`, {
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
      /**
       * Modifies a run.
       */
      update(threadId, runId, body, options2) {
        return this._client.post(`/threads/${threadId}/runs/${runId}`, {
          body,
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
      list(threadId, query = {}, options2) {
        if (isRequestOptions(query)) {
          return this.list(threadId, {}, query);
        }
        return this._client.getAPIList(`/threads/${threadId}/runs`, RunsPage, {
          query,
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
      /**
       * Cancels a run that is `in_progress`.
       */
      cancel(threadId, runId, options2) {
        return this._client.post(`/threads/${threadId}/runs/${runId}/cancel`, {
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
      /**
       * When a run has the `status: "requires_action"` and `required_action.type` is
       * `submit_tool_outputs`, this endpoint can be used to submit the outputs from the
       * tool calls once they're all completed. All outputs must be submitted in a single
       * request.
       */
      submitToolOutputs(threadId, runId, body, options2) {
        return this._client.post(`/threads/${threadId}/runs/${runId}/submit_tool_outputs`, {
          body,
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
    };
    RunsPage = class extends CursorPage {
    };
    (function(Runs2) {
      Runs2.RunsPage = RunsPage;
      Runs2.Steps = Steps;
      Runs2.RunStepsPage = RunStepsPage;
    })(Runs || (Runs = {}));
  }
});

// node_modules/openai/resources/beta/threads/threads.mjs
var Threads;
var init_threads = __esm({
  "node_modules/openai/resources/beta/threads/threads.mjs"() {
    init_resource();
    init_core();
    init_messages();
    init_runs();
    Threads = class extends APIResource {
      constructor() {
        super(...arguments);
        this.runs = new Runs(this._client);
        this.messages = new Messages(this._client);
      }
      create(body = {}, options2) {
        if (isRequestOptions(body)) {
          return this.create({}, body);
        }
        return this._client.post("/threads", {
          body,
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
      /**
       * Retrieves a thread.
       */
      retrieve(threadId, options2) {
        return this._client.get(`/threads/${threadId}`, {
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
      /**
       * Modifies a thread.
       */
      update(threadId, body, options2) {
        return this._client.post(`/threads/${threadId}`, {
          body,
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
      /**
       * Delete a thread.
       */
      del(threadId, options2) {
        return this._client.delete(`/threads/${threadId}`, {
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
      /**
       * Create a thread and run it in one request.
       */
      createAndRun(body, options2) {
        return this._client.post("/threads/runs", {
          body,
          ...options2,
          headers: { "OpenAI-Beta": "assistants=v1", ...options2?.headers }
        });
      }
    };
    (function(Threads2) {
      Threads2.Runs = Runs;
      Threads2.RunsPage = RunsPage;
      Threads2.Messages = Messages;
      Threads2.ThreadMessagesPage = ThreadMessagesPage;
    })(Threads || (Threads = {}));
  }
});

// node_modules/openai/resources/beta/beta.mjs
var Beta;
var init_beta = __esm({
  "node_modules/openai/resources/beta/beta.mjs"() {
    init_resource();
    init_assistants();
    init_chat3();
    init_threads();
    Beta = class extends APIResource {
      constructor() {
        super(...arguments);
        this.chat = new Chat2(this._client);
        this.assistants = new Assistants(this._client);
        this.threads = new Threads(this._client);
      }
    };
    (function(Beta2) {
      Beta2.Chat = Chat2;
      Beta2.Assistants = Assistants;
      Beta2.AssistantsPage = AssistantsPage;
      Beta2.Threads = Threads;
    })(Beta || (Beta = {}));
  }
});

// node_modules/openai/resources/completions.mjs
var Completions3;
var init_completions3 = __esm({
  "node_modules/openai/resources/completions.mjs"() {
    init_resource();
    Completions3 = class extends APIResource {
      create(body, options2) {
        return this._client.post("/completions", { body, ...options2, stream: body.stream ?? false });
      }
    };
    /* @__PURE__ */ (function(Completions4) {
    })(Completions3 || (Completions3 = {}));
  }
});

// node_modules/openai/resources/embeddings.mjs
var Embeddings;
var init_embeddings = __esm({
  "node_modules/openai/resources/embeddings.mjs"() {
    init_resource();
    Embeddings = class extends APIResource {
      /**
       * Creates an embedding vector representing the input text.
       */
      create(body, options2) {
        return this._client.post("/embeddings", { body, ...options2 });
      }
    };
    /* @__PURE__ */ (function(Embeddings2) {
    })(Embeddings || (Embeddings = {}));
  }
});

// node_modules/openai/resources/edits.mjs
var Edits;
var init_edits = __esm({
  "node_modules/openai/resources/edits.mjs"() {
    init_resource();
    Edits = class extends APIResource {
      /**
       * Creates a new edit for the provided input, instruction, and parameters.
       *
       * @deprecated The Edits API is deprecated; please use Chat Completions instead.
       *
       * https://openai.com/blog/gpt-4-api-general-availability#deprecation-of-the-edits-api
       */
      create(body, options2) {
        return this._client.post("/edits", { body, ...options2 });
      }
    };
    /* @__PURE__ */ (function(Edits2) {
    })(Edits || (Edits = {}));
  }
});

// node_modules/openai/resources/files.mjs
var Files3, FileObjectsPage;
var init_files3 = __esm({
  "node_modules/openai/resources/files.mjs"() {
    init_resource();
    init_core();
    init_core();
    init_error();
    init_files3();
    init_core();
    init_pagination();
    Files3 = class extends APIResource {
      /**
       * Upload a file that can be used across various endpoints. The size of all the
       * files uploaded by one organization can be up to 100 GB.
       *
       * The size of individual files can be a maximum of 512 MB or 2 million tokens for
       * Assistants. See the
       * [Assistants Tools guide](https://platform.openai.com/docs/assistants/tools) to
       * learn more about the types of files supported. The Fine-tuning API only supports
       * `.jsonl` files.
       *
       * Please [contact us](https://help.openai.com/) if you need to increase these
       * storage limits.
       */
      create(body, options2) {
        return this._client.post("/files", multipartFormRequestOptions({ body, ...options2 }));
      }
      /**
       * Returns information about a specific file.
       */
      retrieve(fileId, options2) {
        return this._client.get(`/files/${fileId}`, options2);
      }
      list(query = {}, options2) {
        if (isRequestOptions(query)) {
          return this.list({}, query);
        }
        return this._client.getAPIList("/files", FileObjectsPage, { query, ...options2 });
      }
      /**
       * Delete a file.
       */
      del(fileId, options2) {
        return this._client.delete(`/files/${fileId}`, options2);
      }
      /**
       * Returns the contents of the specified file.
       */
      content(fileId, options2) {
        return this._client.get(`/files/${fileId}/content`, { ...options2, __binaryResponse: true });
      }
      /**
       * Returns the contents of the specified file.
       *
       * @deprecated The `.content()` method should be used instead
       */
      retrieveContent(fileId, options2) {
        return this._client.get(`/files/${fileId}/content`, {
          ...options2,
          headers: { Accept: "application/json", ...options2?.headers }
        });
      }
      /**
       * Waits for the given file to be processed, default timeout is 30 mins.
       */
      async waitForProcessing(id, { pollInterval = 5e3, maxWait = 30 * 60 * 1e3 } = {}) {
        const TERMINAL_STATES = /* @__PURE__ */ new Set(["processed", "error", "deleted"]);
        const start = Date.now();
        let file = await this.retrieve(id);
        while (!file.status || !TERMINAL_STATES.has(file.status)) {
          await sleep(pollInterval);
          file = await this.retrieve(id);
          if (Date.now() - start > maxWait) {
            throw new APIConnectionTimeoutError({
              message: `Giving up on waiting for file ${id} to finish processing after ${maxWait} milliseconds.`
            });
          }
        }
        return file;
      }
    };
    FileObjectsPage = class extends Page6 {
    };
    (function(Files4) {
      Files4.FileObjectsPage = FileObjectsPage;
    })(Files3 || (Files3 = {}));
  }
});

// node_modules/openai/resources/fine-tunes.mjs
var FineTunes, FineTunesPage;
var init_fine_tunes = __esm({
  "node_modules/openai/resources/fine-tunes.mjs"() {
    init_resource();
    init_fine_tunes();
    init_pagination();
    FineTunes = class extends APIResource {
      /**
       * Creates a job that fine-tunes a specified model from a given dataset.
       *
       * Response includes details of the enqueued job including job status and the name
       * of the fine-tuned models once complete.
       *
       * [Learn more about fine-tuning](https://platform.openai.com/docs/guides/legacy-fine-tuning)
       */
      create(body, options2) {
        return this._client.post("/fine-tunes", { body, ...options2 });
      }
      /**
       * Gets info about the fine-tune job.
       *
       * [Learn more about fine-tuning](https://platform.openai.com/docs/guides/legacy-fine-tuning)
       */
      retrieve(fineTuneId, options2) {
        return this._client.get(`/fine-tunes/${fineTuneId}`, options2);
      }
      /**
       * List your organization's fine-tuning jobs
       */
      list(options2) {
        return this._client.getAPIList("/fine-tunes", FineTunesPage, options2);
      }
      /**
       * Immediately cancel a fine-tune job.
       */
      cancel(fineTuneId, options2) {
        return this._client.post(`/fine-tunes/${fineTuneId}/cancel`, options2);
      }
      listEvents(fineTuneId, query, options2) {
        return this._client.get(`/fine-tunes/${fineTuneId}/events`, {
          query,
          timeout: 864e5,
          ...options2,
          stream: query?.stream ?? false
        });
      }
    };
    FineTunesPage = class extends Page6 {
    };
    (function(FineTunes2) {
      FineTunes2.FineTunesPage = FineTunesPage;
    })(FineTunes || (FineTunes = {}));
  }
});

// node_modules/openai/resources/fine-tuning/jobs.mjs
var Jobs, FineTuningJobsPage, FineTuningJobEventsPage;
var init_jobs = __esm({
  "node_modules/openai/resources/fine-tuning/jobs.mjs"() {
    init_resource();
    init_core();
    init_jobs();
    init_pagination();
    Jobs = class extends APIResource {
      /**
       * Creates a job that fine-tunes a specified model from a given dataset.
       *
       * Response includes details of the enqueued job including job status and the name
       * of the fine-tuned models once complete.
       *
       * [Learn more about fine-tuning](https://platform.openai.com/docs/guides/fine-tuning)
       */
      create(body, options2) {
        return this._client.post("/fine_tuning/jobs", { body, ...options2 });
      }
      /**
       * Get info about a fine-tuning job.
       *
       * [Learn more about fine-tuning](https://platform.openai.com/docs/guides/fine-tuning)
       */
      retrieve(fineTuningJobId, options2) {
        return this._client.get(`/fine_tuning/jobs/${fineTuningJobId}`, options2);
      }
      list(query = {}, options2) {
        if (isRequestOptions(query)) {
          return this.list({}, query);
        }
        return this._client.getAPIList("/fine_tuning/jobs", FineTuningJobsPage, { query, ...options2 });
      }
      /**
       * Immediately cancel a fine-tune job.
       */
      cancel(fineTuningJobId, options2) {
        return this._client.post(`/fine_tuning/jobs/${fineTuningJobId}/cancel`, options2);
      }
      listEvents(fineTuningJobId, query = {}, options2) {
        if (isRequestOptions(query)) {
          return this.listEvents(fineTuningJobId, {}, query);
        }
        return this._client.getAPIList(`/fine_tuning/jobs/${fineTuningJobId}/events`, FineTuningJobEventsPage, {
          query,
          ...options2
        });
      }
    };
    FineTuningJobsPage = class extends CursorPage {
    };
    FineTuningJobEventsPage = class extends CursorPage {
    };
    (function(Jobs2) {
      Jobs2.FineTuningJobsPage = FineTuningJobsPage;
      Jobs2.FineTuningJobEventsPage = FineTuningJobEventsPage;
    })(Jobs || (Jobs = {}));
  }
});

// node_modules/openai/resources/fine-tuning/fine-tuning.mjs
var FineTuning;
var init_fine_tuning = __esm({
  "node_modules/openai/resources/fine-tuning/fine-tuning.mjs"() {
    init_resource();
    init_jobs();
    FineTuning = class extends APIResource {
      constructor() {
        super(...arguments);
        this.jobs = new Jobs(this._client);
      }
    };
    (function(FineTuning2) {
      FineTuning2.Jobs = Jobs;
      FineTuning2.FineTuningJobsPage = FineTuningJobsPage;
      FineTuning2.FineTuningJobEventsPage = FineTuningJobEventsPage;
    })(FineTuning || (FineTuning = {}));
  }
});

// node_modules/openai/resources/images.mjs
var Images;
var init_images = __esm({
  "node_modules/openai/resources/images.mjs"() {
    init_resource();
    init_core();
    Images = class extends APIResource {
      /**
       * Creates a variation of a given image.
       */
      createVariation(body, options2) {
        return this._client.post("/images/variations", multipartFormRequestOptions({ body, ...options2 }));
      }
      /**
       * Creates an edited or extended image given an original image and a prompt.
       */
      edit(body, options2) {
        return this._client.post("/images/edits", multipartFormRequestOptions({ body, ...options2 }));
      }
      /**
       * Creates an image given a prompt.
       */
      generate(body, options2) {
        return this._client.post("/images/generations", { body, ...options2 });
      }
    };
    /* @__PURE__ */ (function(Images2) {
    })(Images || (Images = {}));
  }
});

// node_modules/openai/resources/models.mjs
var Models, ModelsPage;
var init_models = __esm({
  "node_modules/openai/resources/models.mjs"() {
    init_resource();
    init_models();
    init_pagination();
    Models = class extends APIResource {
      /**
       * Retrieves a model instance, providing basic information about the model such as
       * the owner and permissioning.
       */
      retrieve(model, options2) {
        return this._client.get(`/models/${model}`, options2);
      }
      /**
       * Lists the currently available models, and provides basic information about each
       * one such as the owner and availability.
       */
      list(options2) {
        return this._client.getAPIList("/models", ModelsPage, options2);
      }
      /**
       * Delete a fine-tuned model. You must have the Owner role in your organization to
       * delete a model.
       */
      del(model, options2) {
        return this._client.delete(`/models/${model}`, options2);
      }
    };
    ModelsPage = class extends Page6 {
    };
    (function(Models2) {
      Models2.ModelsPage = ModelsPage;
    })(Models || (Models = {}));
  }
});

// node_modules/openai/resources/moderations.mjs
var Moderations;
var init_moderations = __esm({
  "node_modules/openai/resources/moderations.mjs"() {
    init_resource();
    Moderations = class extends APIResource {
      /**
       * Classifies if text violates OpenAI's Content Policy
       */
      create(body, options2) {
        return this._client.post("/moderations", { body, ...options2 });
      }
    };
    /* @__PURE__ */ (function(Moderations2) {
    })(Moderations || (Moderations = {}));
  }
});

// node_modules/openai/resources/index.mjs
var init_resources = __esm({
  "node_modules/openai/resources/index.mjs"() {
    init_chat2();
    init_shared();
    init_audio();
    init_beta();
    init_completions3();
    init_embeddings();
    init_edits();
    init_files3();
    init_fine_tunes();
    init_fine_tuning();
    init_images();
    init_models();
    init_moderations();
  }
});

// node_modules/openai/index.mjs
var _a, OpenAI, OpenAIError2, APIError2, APIConnectionError2, APIConnectionTimeoutError2, APIUserAbortError2, NotFoundError2, ConflictError2, RateLimitError2, BadRequestError2, AuthenticationError2, InternalServerError2, PermissionDeniedError2, UnprocessableEntityError2, openai_default;
var init_openai = __esm({
  "node_modules/openai/index.mjs"() {
    init_core();
    init_pagination();
    init_error();
    init_uploads();
    init_resources();
    OpenAI = class extends APIClient {
      /**
       * API Client for interfacing with the OpenAI API.
       *
       * @param {string} [opts.apiKey=process.env['OPENAI_API_KEY'] ?? undefined]
       * @param {string | null} [opts.organization=process.env['OPENAI_ORG_ID'] ?? null]
       * @param {string} [opts.baseURL=process.env['OPENAI_BASE_URL'] ?? https://api.openai.com/v1] - Override the default base URL for the API.
       * @param {number} [opts.timeout=10 minutes] - The maximum amount of time (in milliseconds) the client will wait for a response before timing out.
       * @param {number} [opts.httpAgent] - An HTTP agent used to manage HTTP(s) connections.
       * @param {Core.Fetch} [opts.fetch] - Specify a custom `fetch` function implementation.
       * @param {number} [opts.maxRetries=2] - The maximum number of times the client will retry a request.
       * @param {Core.Headers} opts.defaultHeaders - Default headers to include with every request to the API.
       * @param {Core.DefaultQuery} opts.defaultQuery - Default query parameters to include with every request to the API.
       * @param {boolean} [opts.dangerouslyAllowBrowser=false] - By default, client-side use of this library is not allowed, as it risks exposing your secret API credentials to attackers.
       */
      constructor({ baseURL = readEnv("OPENAI_BASE_URL"), apiKey = readEnv("OPENAI_API_KEY"), organization = readEnv("OPENAI_ORG_ID") ?? null, ...opts } = {}) {
        if (apiKey === void 0) {
          throw new OpenAIError("The OPENAI_API_KEY environment variable is missing or empty; either provide it, or instantiate the OpenAI client with an apiKey option, like new OpenAI({ apiKey: 'My API Key' }).");
        }
        const options2 = {
          apiKey,
          organization,
          ...opts,
          baseURL: baseURL || `https://api.openai.com/v1`
        };
        if (!options2.dangerouslyAllowBrowser && isRunningInBrowser()) {
          throw new OpenAIError("It looks like you're running in a browser-like environment.\n\nThis is disabled by default, as it risks exposing your secret API credentials to attackers.\nIf you understand the risks and have appropriate mitigations in place,\nyou can set the `dangerouslyAllowBrowser` option to `true`, e.g.,\n\nnew OpenAI({ apiKey, dangerouslyAllowBrowser: true });\n\nhttps://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety\n");
        }
        super({
          baseURL: options2.baseURL,
          timeout: options2.timeout ?? 6e5,
          httpAgent: options2.httpAgent,
          maxRetries: options2.maxRetries,
          fetch: options2.fetch
        });
        this.completions = new Completions3(this);
        this.chat = new Chat(this);
        this.edits = new Edits(this);
        this.embeddings = new Embeddings(this);
        this.files = new Files3(this);
        this.images = new Images(this);
        this.audio = new Audio(this);
        this.moderations = new Moderations(this);
        this.models = new Models(this);
        this.fineTuning = new FineTuning(this);
        this.fineTunes = new FineTunes(this);
        this.beta = new Beta(this);
        this._options = options2;
        this.apiKey = apiKey;
        this.organization = organization;
      }
      defaultQuery() {
        return this._options.defaultQuery;
      }
      defaultHeaders(opts) {
        return {
          ...super.defaultHeaders(opts),
          "OpenAI-Organization": this.organization,
          ...this._options.defaultHeaders
        };
      }
      authHeaders(opts) {
        return { Authorization: `Bearer ${this.apiKey}` };
      }
    };
    _a = OpenAI;
    OpenAI.OpenAI = _a;
    OpenAI.OpenAIError = OpenAIError;
    OpenAI.APIError = APIError;
    OpenAI.APIConnectionError = APIConnectionError;
    OpenAI.APIConnectionTimeoutError = APIConnectionTimeoutError;
    OpenAI.APIUserAbortError = APIUserAbortError;
    OpenAI.NotFoundError = NotFoundError;
    OpenAI.ConflictError = ConflictError;
    OpenAI.RateLimitError = RateLimitError;
    OpenAI.BadRequestError = BadRequestError;
    OpenAI.AuthenticationError = AuthenticationError;
    OpenAI.InternalServerError = InternalServerError;
    OpenAI.PermissionDeniedError = PermissionDeniedError;
    OpenAI.UnprocessableEntityError = UnprocessableEntityError;
    ({ OpenAIError: OpenAIError2, APIError: APIError2, APIConnectionError: APIConnectionError2, APIConnectionTimeoutError: APIConnectionTimeoutError2, APIUserAbortError: APIUserAbortError2, NotFoundError: NotFoundError2, ConflictError: ConflictError2, RateLimitError: RateLimitError2, BadRequestError: BadRequestError2, AuthenticationError: AuthenticationError2, InternalServerError: InternalServerError2, PermissionDeniedError: PermissionDeniedError2, UnprocessableEntityError: UnprocessableEntityError2 } = error_exports);
    (function(OpenAI2) {
      OpenAI2.toFile = toFile;
      OpenAI2.fileFromPath = fileFromPath;
      OpenAI2.Page = Page6;
      OpenAI2.CursorPage = CursorPage;
      OpenAI2.Completions = Completions3;
      OpenAI2.Chat = Chat;
      OpenAI2.Edits = Edits;
      OpenAI2.Embeddings = Embeddings;
      OpenAI2.Files = Files3;
      OpenAI2.FileObjectsPage = FileObjectsPage;
      OpenAI2.Images = Images;
      OpenAI2.Audio = Audio;
      OpenAI2.Moderations = Moderations;
      OpenAI2.Models = Models;
      OpenAI2.ModelsPage = ModelsPage;
      OpenAI2.FineTuning = FineTuning;
      OpenAI2.FineTunes = FineTunes;
      OpenAI2.FineTunesPage = FineTunesPage;
      OpenAI2.Beta = Beta;
    })(OpenAI || (OpenAI = {}));
    openai_default = OpenAI;
  }
});

// .svelte-kit/output/server/entries/endpoints/api/message/create/_server.js
var server_exports3 = {};
__export(server_exports3, {
  POST: () => POST2
});
async function POST2({ request }) {
  const { message, threadId, roleType } = await request.json();
  if (!threadId || !message) {
    return Response.json({ error: "No thread ID or no Message" }, { status: 400 });
  }
  const openai = new openai_default({ apiKey: OPENAI_KEY });
  try {
    const threadMessages = await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message
    });
    return Response.json(threadMessages);
  } catch (error2) {
    return Response.json({ error: error2 });
  }
}
var init_server3 = __esm({
  ".svelte-kit/output/server/entries/endpoints/api/message/create/_server.js"() {
    init_openai();
    init_private();
  }
});

// .svelte-kit/output/server/entries/endpoints/api/message/list/_server.js
var server_exports4 = {};
__export(server_exports4, {
  GET: () => GET
});
async function GET({ url }) {
  const threadId = url.searchParams.get("threadId");
  if (!threadId) {
    return Response.json({ error: "No thread id provided" }, { status: 400 });
  }
  const openai = new openai_default({ apiKey: OPENAI_KEY });
  try {
    const response = await openai.beta.threads.messages.list(threadId);
    return Response.json({ messages: response.data });
  } catch (e3) {
    return Response.json({ error: e3 });
  }
}
var init_server4 = __esm({
  ".svelte-kit/output/server/entries/endpoints/api/message/list/_server.js"() {
    init_openai();
    init_private();
  }
});

// .svelte-kit/output/server/entries/endpoints/api/run/create/_server.js
var server_exports5 = {};
__export(server_exports5, {
  GET: () => GET2
});
async function GET2({ url }) {
  const threadId = url.searchParams.get("threadId");
  if (!threadId) {
    return Response.json({ error: "No thread id provided" }, { status: 400 });
  }
  const openai = new openai_default({ apiKey: OPENAI_KEY });
  try {
    const run2 = await openai.beta.threads.runs.create(threadId, {
      assistant_id: OPENAI_ID
    });
    return Response.json({ run: run2 });
  } catch (error2) {
    return Response.json({ error: error2 });
  }
}
var init_server5 = __esm({
  ".svelte-kit/output/server/entries/endpoints/api/run/create/_server.js"() {
    init_openai();
    init_private();
  }
});

// .svelte-kit/output/server/entries/endpoints/api/run/retrieve/_server.js
var server_exports6 = {};
__export(server_exports6, {
  GET: () => GET3
});
async function GET3({ url }) {
  const threadId = url.searchParams.get("threadId");
  const runId = url.searchParams.get("runId");
  if (!threadId) {
    return Response.json({ error: "No thread id provided" }, { status: 400 });
  }
  if (!runId) {
    return Response.json({ error: "No run id provided" }, { status: 400 });
  }
  const openai = new openai_default({ apiKey: OPENAI_KEY });
  try {
    const run2 = await openai.beta.threads.runs.retrieve(threadId, runId);
    return Response.json({ run: run2 });
  } catch (error2) {
    return Response.json({ error: error2 });
  }
}
var init_server6 = __esm({
  ".svelte-kit/output/server/entries/endpoints/api/run/retrieve/_server.js"() {
    init_openai();
    init_private();
  }
});

// .svelte-kit/output/server/entries/endpoints/api/thread/create/_server.js
var server_exports7 = {};
__export(server_exports7, {
  GET: () => GET4
});
async function GET4() {
  const openai = new openai_default({ apiKey: OPENAI_KEY });
  try {
    const thread = await openai.beta.threads.create();
    return Response.json({ thread });
  } catch (error2) {
    return Response.json({ error: error2 });
  }
}
var init_server7 = __esm({
  ".svelte-kit/output/server/entries/endpoints/api/thread/create/_server.js"() {
    init_openai();
    init_private();
  }
});

// .svelte-kit/output/server/entries/endpoints/api/thread/delete/_server.js
var server_exports8 = {};
__export(server_exports8, {
  GET: () => GET5
});
async function GET5(req) {
  const searchParams = req.searchParams;
  const threadId = searchParams.get("threadId");
  if (!threadId) {
    return Response.json({ error: "No thread Id provided" }, { status: 400 });
  }
  const openai = new openai_default({ apiKey: OPENAI_KEY });
  try {
    const thread = await openai.beta.threads.del(threadId);
    return Response.json({ thread });
  } catch (e3) {
    return Response.json({ error: e3 });
  }
}
var init_server8 = __esm({
  ".svelte-kit/output/server/entries/endpoints/api/thread/delete/_server.js"() {
    init_openai();
    init_private();
  }
});

// .svelte-kit/output/server/chunks/internal.js
init_ssr();
var base = "";
var assets = base;
var initial = { base, assets };
function reset() {
  base = initial.base;
  assets = initial.assets;
}
var public_env = {};
function set_private_env(environment) {
}
function set_public_env(environment) {
  public_env = environment;
}
function afterUpdate() {
}
var Root = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { stores } = $$props;
  let { page: page2 } = $$props;
  let { constructors } = $$props;
  let { components = [] } = $$props;
  let { form } = $$props;
  let { data_0 = null } = $$props;
  let { data_1 = null } = $$props;
  {
    setContext("__svelte__", stores);
  }
  afterUpdate(stores.page.notify);
  if ($$props.stores === void 0 && $$bindings.stores && stores !== void 0)
    $$bindings.stores(stores);
  if ($$props.page === void 0 && $$bindings.page && page2 !== void 0)
    $$bindings.page(page2);
  if ($$props.constructors === void 0 && $$bindings.constructors && constructors !== void 0)
    $$bindings.constructors(constructors);
  if ($$props.components === void 0 && $$bindings.components && components !== void 0)
    $$bindings.components(components);
  if ($$props.form === void 0 && $$bindings.form && form !== void 0)
    $$bindings.form(form);
  if ($$props.data_0 === void 0 && $$bindings.data_0 && data_0 !== void 0)
    $$bindings.data_0(data_0);
  if ($$props.data_1 === void 0 && $$bindings.data_1 && data_1 !== void 0)
    $$bindings.data_1(data_1);
  let $$settled;
  let $$rendered;
  let previous_head = $$result.head;
  do {
    $$settled = true;
    $$result.head = previous_head;
    {
      stores.page.set(page2);
    }
    $$rendered = `  ${constructors[1] ? `${validate_component(constructors[0] || missing_component, "svelte:component").$$render(
      $$result,
      { data: data_0, this: components[0] },
      {
        this: ($$value) => {
          components[0] = $$value;
          $$settled = false;
        }
      },
      {
        default: () => {
          return `${validate_component(constructors[1] || missing_component, "svelte:component").$$render(
            $$result,
            { data: data_1, form, this: components[1] },
            {
              this: ($$value) => {
                components[1] = $$value;
                $$settled = false;
              }
            },
            {}
          )}`;
        }
      }
    )}` : `${validate_component(constructors[0] || missing_component, "svelte:component").$$render(
      $$result,
      { data: data_0, form, this: components[0] },
      {
        this: ($$value) => {
          components[0] = $$value;
          $$settled = false;
        }
      },
      {}
    )}`} ${``}`;
  } while (!$$settled);
  return $$rendered;
});
var options = {
  app_template_contains_nonce: false,
  csp: { "mode": "auto", "directives": { "upgrade-insecure-requests": false, "block-all-mixed-content": false }, "reportOnly": { "upgrade-insecure-requests": false, "block-all-mixed-content": false } },
  csrf_check_origin: true,
  track_server_fetches: false,
  embedded: false,
  env_public_prefix: "PUBLIC_",
  env_private_prefix: "",
  hooks: null,
  // added lazily, via `get_hooks`
  preload_strategy: "modulepreload",
  root: Root,
  service_worker: false,
  templates: {
    app: ({ head, body, assets: assets2, nonce, env }) => '<!DOCTYPE html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" name="theme-color" content="#0e2a47"/>\n		<title>OpenRXN</title>\n		<link rel="icon" href="' + assets2 + '/favicon.png" />\n		<meta name="viewport" content="width=device-width, initial-scale=1" />\n		<link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.css" rel="stylesheet" />\n		' + head + '\n	</head>\n	<body data-sveltekit-preload-data="hover">\n		<script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.js"><\/script>\n		<div style="display: contents">' + body + "</div>\n	</body>\n</html>\n",
    error: ({ status, message }) => '<!doctype html>\n<html lang="en">\n	<head>\n		<meta charset="utf-8" />\n		<title>' + message + `</title>

		<style>
			body {
				--bg: white;
				--fg: #222;
				--divider: #ccc;
				background: var(--bg);
				color: var(--fg);
				font-family:
					system-ui,
					-apple-system,
					BlinkMacSystemFont,
					'Segoe UI',
					Roboto,
					Oxygen,
					Ubuntu,
					Cantarell,
					'Open Sans',
					'Helvetica Neue',
					sans-serif;
				display: flex;
				align-items: center;
				justify-content: center;
				height: 100vh;
				margin: 0;
			}

			.error {
				display: flex;
				align-items: center;
				max-width: 32rem;
				margin: 0 1rem;
			}

			.status {
				font-weight: 200;
				font-size: 3rem;
				line-height: 1;
				position: relative;
				top: -0.05rem;
			}

			.message {
				border-left: 1px solid var(--divider);
				padding: 0 0 0 1rem;
				margin: 0 0 0 1rem;
				min-height: 2.5rem;
				display: flex;
				align-items: center;
			}

			.message h1 {
				font-weight: 400;
				font-size: 1em;
				margin: 0;
			}

			@media (prefers-color-scheme: dark) {
				body {
					--bg: #222;
					--fg: #ddd;
					--divider: #666;
				}
			}
		</style>
	</head>
	<body>
		<div class="error">
			<span class="status">` + status + '</span>\n			<div class="message">\n				<h1>' + message + "</h1>\n			</div>\n		</div>\n	</body>\n</html>\n"
  },
  version_hash: "1o8iwu2"
};
function get_hooks() {
  return Promise.resolve().then(() => (init_hooks_server(), hooks_server_exports));
}

// .svelte-kit/output/server/index.js
init_chunks();

// node_modules/devalue/src/utils.js
var escaped = {
  "<": "\\u003C",
  "\\": "\\\\",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "	": "\\t",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var DevalueError = class extends Error {
  /**
   * @param {string} message
   * @param {string[]} keys
   */
  constructor(message, keys) {
    super(message);
    this.name = "DevalueError";
    this.path = keys.join("");
  }
};
function is_primitive(thing) {
  return Object(thing) !== thing;
}
var object_proto_names = /* @__PURE__ */ Object.getOwnPropertyNames(
  Object.prototype
).sort().join("\0");
function is_plain_object(thing) {
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getOwnPropertyNames(proto).sort().join("\0") === object_proto_names;
}
function get_type(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function get_escaped_char(char) {
  switch (char) {
    case '"':
      return '\\"';
    case "<":
      return "\\u003C";
    case "\\":
      return "\\\\";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return char < " " ? `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}` : "";
  }
}
function stringify_string(str2) {
  let result = "";
  let last_pos = 0;
  const len = str2.length;
  for (let i2 = 0; i2 < len; i2 += 1) {
    const char = str2[i2];
    const replacement = get_escaped_char(char);
    if (replacement) {
      result += str2.slice(last_pos, i2) + replacement;
      last_pos = i2 + 1;
    }
  }
  return `"${last_pos === 0 ? str2 : result + str2.slice(last_pos)}"`;
}

// node_modules/devalue/src/uneval.js
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
var unsafe_chars = /[<\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
function uneval(value, replacer) {
  const counts = /* @__PURE__ */ new Map();
  const keys = [];
  const custom = /* @__PURE__ */ new Map();
  function walk(thing) {
    if (typeof thing === "function") {
      throw new DevalueError(`Cannot stringify a function`, keys);
    }
    if (!is_primitive(thing)) {
      if (counts.has(thing)) {
        counts.set(thing, counts.get(thing) + 1);
        return;
      }
      counts.set(thing, 1);
      if (replacer) {
        const str3 = replacer(thing);
        if (typeof str3 === "string") {
          custom.set(thing, str3);
          return;
        }
      }
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "BigInt":
        case "String":
        case "Boolean":
        case "Date":
        case "RegExp":
          return;
        case "Array":
          thing.forEach((value2, i2) => {
            keys.push(`[${i2}]`);
            walk(value2);
            keys.pop();
          });
          break;
        case "Set":
          Array.from(thing).forEach(walk);
          break;
        case "Map":
          for (const [key2, value2] of thing) {
            keys.push(
              `.get(${is_primitive(key2) ? stringify_primitive(key2) : "..."})`
            );
            walk(value2);
            keys.pop();
          }
          break;
        default:
          if (!is_plain_object(thing)) {
            throw new DevalueError(
              `Cannot stringify arbitrary non-POJOs`,
              keys
            );
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new DevalueError(
              `Cannot stringify POJOs with symbolic keys`,
              keys
            );
          }
          for (const key2 in thing) {
            keys.push(`.${key2}`);
            walk(thing[key2]);
            keys.pop();
          }
      }
    }
  }
  walk(value);
  const names = /* @__PURE__ */ new Map();
  Array.from(counts).filter((entry) => entry[1] > 1).sort((a, b) => b[1] - a[1]).forEach((entry, i2) => {
    names.set(entry[0], get_name(i2));
  });
  function stringify2(thing) {
    if (names.has(thing)) {
      return names.get(thing);
    }
    if (is_primitive(thing)) {
      return stringify_primitive(thing);
    }
    if (custom.has(thing)) {
      return custom.get(thing);
    }
    const type = get_type(thing);
    switch (type) {
      case "Number":
      case "String":
      case "Boolean":
        return `Object(${stringify2(thing.valueOf())})`;
      case "RegExp":
        return `new RegExp(${stringify_string(thing.source)}, "${thing.flags}")`;
      case "Date":
        return `new Date(${thing.getTime()})`;
      case "Array":
        const members = (
          /** @type {any[]} */
          thing.map(
            (v, i2) => i2 in thing ? stringify2(v) : ""
          )
        );
        const tail = thing.length === 0 || thing.length - 1 in thing ? "" : ",";
        return `[${members.join(",")}${tail}]`;
      case "Set":
      case "Map":
        return `new ${type}([${Array.from(thing).map(stringify2).join(",")}])`;
      default:
        const obj = `{${Object.keys(thing).map((key2) => `${safe_key(key2)}:${stringify2(thing[key2])}`).join(",")}}`;
        const proto = Object.getPrototypeOf(thing);
        if (proto === null) {
          return Object.keys(thing).length > 0 ? `Object.assign(Object.create(null),${obj})` : `Object.create(null)`;
        }
        return obj;
    }
  }
  const str2 = stringify2(value);
  if (names.size) {
    const params = [];
    const statements = [];
    const values = [];
    names.forEach((name, thing) => {
      params.push(name);
      if (custom.has(thing)) {
        values.push(
          /** @type {string} */
          custom.get(thing)
        );
        return;
      }
      if (is_primitive(thing)) {
        values.push(stringify_primitive(thing));
        return;
      }
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          values.push(`Object(${stringify2(thing.valueOf())})`);
          break;
        case "RegExp":
          values.push(thing.toString());
          break;
        case "Date":
          values.push(`new Date(${thing.getTime()})`);
          break;
        case "Array":
          values.push(`Array(${thing.length})`);
          thing.forEach((v, i2) => {
            statements.push(`${name}[${i2}]=${stringify2(v)}`);
          });
          break;
        case "Set":
          values.push(`new Set`);
          statements.push(
            `${name}.${Array.from(thing).map((v) => `add(${stringify2(v)})`).join(".")}`
          );
          break;
        case "Map":
          values.push(`new Map`);
          statements.push(
            `${name}.${Array.from(thing).map(([k, v]) => `set(${stringify2(k)}, ${stringify2(v)})`).join(".")}`
          );
          break;
        default:
          values.push(
            Object.getPrototypeOf(thing) === null ? "Object.create(null)" : "{}"
          );
          Object.keys(thing).forEach((key2) => {
            statements.push(
              `${name}${safe_prop(key2)}=${stringify2(thing[key2])}`
            );
          });
      }
    });
    statements.push(`return ${str2}`);
    return `(function(${params.join(",")}){${statements.join(
      ";"
    )}}(${values.join(",")}))`;
  } else {
    return str2;
  }
}
function get_name(num) {
  let name = "";
  do {
    name = chars[num % chars.length] + name;
    num = ~~(num / chars.length) - 1;
  } while (num >= 0);
  return reserved.test(name) ? `${name}0` : name;
}
function escape_unsafe_char(c2) {
  return escaped[c2] || c2;
}
function escape_unsafe_chars(str2) {
  return str2.replace(unsafe_chars, escape_unsafe_char);
}
function safe_key(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? key2 : escape_unsafe_chars(JSON.stringify(key2));
}
function safe_prop(key2) {
  return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key2) ? `.${key2}` : `[${escape_unsafe_chars(JSON.stringify(key2))}]`;
}
function stringify_primitive(thing) {
  if (typeof thing === "string")
    return stringify_string(thing);
  if (thing === void 0)
    return "void 0";
  if (thing === 0 && 1 / thing < 0)
    return "-0";
  const str2 = String(thing);
  if (typeof thing === "number")
    return str2.replace(/^(-)?0\./, "$1.");
  if (typeof thing === "bigint")
    return thing + "n";
  return str2;
}

// node_modules/devalue/src/constants.js
var UNDEFINED = -1;
var HOLE = -2;
var NAN = -3;
var POSITIVE_INFINITY = -4;
var NEGATIVE_INFINITY = -5;
var NEGATIVE_ZERO = -6;

// node_modules/devalue/src/stringify.js
function stringify(value, reducers) {
  const stringified = [];
  const indexes = /* @__PURE__ */ new Map();
  const custom = [];
  for (const key2 in reducers) {
    custom.push({ key: key2, fn: reducers[key2] });
  }
  const keys = [];
  let p = 0;
  function flatten(thing) {
    if (typeof thing === "function") {
      throw new DevalueError(`Cannot stringify a function`, keys);
    }
    if (indexes.has(thing))
      return indexes.get(thing);
    if (thing === void 0)
      return UNDEFINED;
    if (Number.isNaN(thing))
      return NAN;
    if (thing === Infinity)
      return POSITIVE_INFINITY;
    if (thing === -Infinity)
      return NEGATIVE_INFINITY;
    if (thing === 0 && 1 / thing < 0)
      return NEGATIVE_ZERO;
    const index9 = p++;
    indexes.set(thing, index9);
    for (const { key: key2, fn } of custom) {
      const value2 = fn(thing);
      if (value2) {
        stringified[index9] = `["${key2}",${flatten(value2)}]`;
        return index9;
      }
    }
    let str2 = "";
    if (is_primitive(thing)) {
      str2 = stringify_primitive2(thing);
    } else {
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
          str2 = `["Object",${stringify_primitive2(thing)}]`;
          break;
        case "BigInt":
          str2 = `["BigInt",${thing}]`;
          break;
        case "Date":
          str2 = `["Date","${thing.toISOString()}"]`;
          break;
        case "RegExp":
          const { source, flags } = thing;
          str2 = flags ? `["RegExp",${stringify_string(source)},"${flags}"]` : `["RegExp",${stringify_string(source)}]`;
          break;
        case "Array":
          str2 = "[";
          for (let i2 = 0; i2 < thing.length; i2 += 1) {
            if (i2 > 0)
              str2 += ",";
            if (i2 in thing) {
              keys.push(`[${i2}]`);
              str2 += flatten(thing[i2]);
              keys.pop();
            } else {
              str2 += HOLE;
            }
          }
          str2 += "]";
          break;
        case "Set":
          str2 = '["Set"';
          for (const value2 of thing) {
            str2 += `,${flatten(value2)}`;
          }
          str2 += "]";
          break;
        case "Map":
          str2 = '["Map"';
          for (const [key2, value2] of thing) {
            keys.push(
              `.get(${is_primitive(key2) ? stringify_primitive2(key2) : "..."})`
            );
            str2 += `,${flatten(key2)},${flatten(value2)}`;
          }
          str2 += "]";
          break;
        default:
          if (!is_plain_object(thing)) {
            throw new DevalueError(
              `Cannot stringify arbitrary non-POJOs`,
              keys
            );
          }
          if (Object.getOwnPropertySymbols(thing).length > 0) {
            throw new DevalueError(
              `Cannot stringify POJOs with symbolic keys`,
              keys
            );
          }
          if (Object.getPrototypeOf(thing) === null) {
            str2 = '["null"';
            for (const key2 in thing) {
              keys.push(`.${key2}`);
              str2 += `,${stringify_string(key2)},${flatten(thing[key2])}`;
              keys.pop();
            }
            str2 += "]";
          } else {
            str2 = "{";
            let started = false;
            for (const key2 in thing) {
              if (started)
                str2 += ",";
              started = true;
              keys.push(`.${key2}`);
              str2 += `${stringify_string(key2)}:${flatten(thing[key2])}`;
              keys.pop();
            }
            str2 += "}";
          }
      }
    }
    stringified[index9] = str2;
    return index9;
  }
  const index8 = flatten(value);
  if (index8 < 0)
    return `${index8}`;
  return `[${stringified.join(",")}]`;
}
function stringify_primitive2(thing) {
  const type = typeof thing;
  if (type === "string")
    return stringify_string(thing);
  if (thing instanceof String)
    return stringify_string(thing.toString());
  if (thing === void 0)
    return UNDEFINED.toString();
  if (thing === 0 && 1 / thing < 0)
    return NEGATIVE_ZERO.toString();
  if (type === "bigint")
    return `["BigInt","${thing}"]`;
  return String(thing);
}

// .svelte-kit/output/server/index.js
init_ssr();
var import_cookie = __toESM(require_cookie(), 1);
var set_cookie_parser = __toESM(require_set_cookie(), 1);
var DEV = false;
var SVELTE_KIT_ASSETS = "/_svelte_kit_assets";
var ENDPOINT_METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"];
var PAGE_METHODS = ["GET", "POST", "HEAD"];
function negotiate(accept, types) {
  const parts = [];
  accept.split(",").forEach((str2, i2) => {
    const match = /([^/]+)\/([^;]+)(?:;q=([0-9.]+))?/.exec(str2);
    if (match) {
      const [, type, subtype, q = "1"] = match;
      parts.push({ type, subtype, q: +q, i: i2 });
    }
  });
  parts.sort((a, b) => {
    if (a.q !== b.q) {
      return b.q - a.q;
    }
    if (a.subtype === "*" !== (b.subtype === "*")) {
      return a.subtype === "*" ? 1 : -1;
    }
    if (a.type === "*" !== (b.type === "*")) {
      return a.type === "*" ? 1 : -1;
    }
    return a.i - b.i;
  });
  let accepted;
  let min_priority = Infinity;
  for (const mimetype of types) {
    const [type, subtype] = mimetype.split("/");
    const priority = parts.findIndex(
      (part) => (part.type === type || part.type === "*") && (part.subtype === subtype || part.subtype === "*")
    );
    if (priority !== -1 && priority < min_priority) {
      accepted = mimetype;
      min_priority = priority;
    }
  }
  return accepted;
}
function is_content_type(request, ...types) {
  const type = request.headers.get("content-type")?.split(";", 1)[0].trim() ?? "";
  return types.includes(type.toLowerCase());
}
function is_form_content_type(request) {
  return is_content_type(
    request,
    "application/x-www-form-urlencoded",
    "multipart/form-data",
    "text/plain"
  );
}
function exec(match, params, matchers) {
  const result = {};
  const values = match.slice(1);
  const values_needing_match = values.filter((value) => value !== void 0);
  let buffered = 0;
  for (let i2 = 0; i2 < params.length; i2 += 1) {
    const param = params[i2];
    let value = values[i2 - buffered];
    if (param.chained && param.rest && buffered) {
      value = values.slice(i2 - buffered, i2 + 1).filter((s22) => s22).join("/");
      buffered = 0;
    }
    if (value === void 0) {
      if (param.rest)
        result[param.name] = "";
      continue;
    }
    if (!param.matcher || matchers[param.matcher](value)) {
      result[param.name] = value;
      const next_param = params[i2 + 1];
      const next_value = values[i2 + 1];
      if (next_param && !next_param.rest && next_param.optional && next_value && param.chained) {
        buffered = 0;
      }
      if (!next_param && !next_value && Object.keys(result).length === values_needing_match.length) {
        buffered = 0;
      }
      continue;
    }
    if (param.optional && param.chained) {
      buffered++;
      continue;
    }
    return;
  }
  if (buffered)
    return;
  return result;
}
function coalesce_to_error(err) {
  return err instanceof Error || err && /** @type {any} */
  err.name && /** @type {any} */
  err.message ? (
    /** @type {Error} */
    err
  ) : new Error(JSON.stringify(err));
}
function normalize_error(error2) {
  return (
    /** @type {import('../runtime/control.js').Redirect | import('../runtime/control.js').HttpError | Error} */
    error2
  );
}
function method_not_allowed(mod, method) {
  return text(`${method} method not allowed`, {
    status: 405,
    headers: {
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
      // "The server must generate an Allow header field in a 405 status code response"
      allow: allowed_methods(mod).join(", ")
    }
  });
}
function allowed_methods(mod) {
  const allowed = ENDPOINT_METHODS.filter((method) => method in mod);
  if ("GET" in mod || "HEAD" in mod)
    allowed.push("HEAD");
  return allowed;
}
function static_error_page(options2, status, message) {
  let page2 = options2.templates.error({ status, message });
  return text(page2, {
    headers: { "content-type": "text/html; charset=utf-8" },
    status
  });
}
async function handle_fatal_error(event, options2, error2) {
  error2 = error2 instanceof HttpError ? error2 : coalesce_to_error(error2);
  const status = error2 instanceof HttpError ? error2.status : 500;
  const body = await handle_error_and_jsonify(event, options2, error2);
  const type = negotiate(event.request.headers.get("accept") || "text/html", [
    "application/json",
    "text/html"
  ]);
  if (event.isDataRequest || type === "application/json") {
    return json(body, {
      status
    });
  }
  return static_error_page(options2, status, body.message);
}
async function handle_error_and_jsonify(event, options2, error2) {
  if (error2 instanceof HttpError) {
    return error2.body;
  }
  return await options2.hooks.handleError({ error: error2, event }) ?? {
    message: event.route.id === null && error2 instanceof NotFound ? "Not Found" : "Internal Error"
  };
}
function redirect_response(status, location) {
  const response = new Response(void 0, {
    status,
    headers: { location }
  });
  return response;
}
function clarify_devalue_error(event, error2) {
  if (error2.path) {
    return `Data returned from \`load\` while rendering ${event.route.id} is not serializable: ${error2.message} (data${error2.path})`;
  }
  if (error2.path === "") {
    return `Data returned from \`load\` while rendering ${event.route.id} is not a plain object`;
  }
  return error2.message;
}
function stringify_uses(node) {
  const uses = [];
  if (node.uses && node.uses.dependencies.size > 0) {
    uses.push(`"dependencies":${JSON.stringify(Array.from(node.uses.dependencies))}`);
  }
  if (node.uses && node.uses.params.size > 0) {
    uses.push(`"params":${JSON.stringify(Array.from(node.uses.params))}`);
  }
  if (node.uses?.parent)
    uses.push('"parent":1');
  if (node.uses?.route)
    uses.push('"route":1');
  if (node.uses?.url)
    uses.push('"url":1');
  return `"uses":{${uses.join(",")}}`;
}
function warn_with_callsite(message, offset = 0) {
  console.warn(message);
}
async function render_endpoint(event, mod, state) {
  const method = (
    /** @type {import('types').HttpMethod} */
    event.request.method
  );
  let handler = mod[method] || mod.fallback;
  if (method === "HEAD" && mod.GET && !mod.HEAD) {
    handler = mod.GET;
  }
  if (!handler) {
    return method_not_allowed(mod, method);
  }
  const prerender = mod.prerender ?? state.prerender_default;
  if (prerender && (mod.POST || mod.PATCH || mod.PUT || mod.DELETE)) {
    throw new Error("Cannot prerender endpoints that have mutative methods");
  }
  if (state.prerendering && !prerender) {
    if (state.depth > 0) {
      throw new Error(`${event.route.id} is not prerenderable`);
    } else {
      return new Response(void 0, { status: 204 });
    }
  }
  try {
    let response = await handler(
      /** @type {import('@sveltejs/kit').RequestEvent<Record<string, any>>} */
      event
    );
    if (!(response instanceof Response)) {
      throw new Error(
        `Invalid response from route ${event.url.pathname}: handler should return a Response object`
      );
    }
    if (state.prerendering) {
      response = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: new Headers(response.headers)
      });
      response.headers.set("x-sveltekit-prerender", String(prerender));
    }
    return response;
  } catch (e3) {
    if (e3 instanceof Redirect) {
      return new Response(void 0, {
        status: e3.status,
        headers: { location: e3.location }
      });
    }
    throw e3;
  }
}
function is_endpoint_request(event) {
  const { method, headers } = event.request;
  if (ENDPOINT_METHODS.includes(method) && !PAGE_METHODS.includes(method)) {
    return true;
  }
  if (method === "POST" && headers.get("x-sveltekit-action") === "true")
    return false;
  const accept = event.request.headers.get("accept") ?? "*/*";
  return negotiate(accept, ["*", "text/html"]) !== "text/html";
}
function compact(arr) {
  return arr.filter(
    /** @returns {val is NonNullable<T>} */
    (val) => val != null
  );
}
var SCHEME = /^[a-z][a-z\d+\-.]+:/i;
var absolute = /^([a-z]+:)?\/?\//;
function resolve(base2, path) {
  if (SCHEME.test(path))
    return path;
  if (path[0] === "#")
    return base2 + path;
  const base_match = absolute.exec(base2);
  const path_match = absolute.exec(path);
  if (!base_match) {
    throw new Error(`bad base path: "${base2}"`);
  }
  const baseparts = path_match ? [] : base2.slice(base_match[0].length).split("/");
  const pathparts = path_match ? path.slice(path_match[0].length).split("/") : path.split("/");
  baseparts.pop();
  for (let i2 = 0; i2 < pathparts.length; i2 += 1) {
    const part = pathparts[i2];
    if (part === ".")
      continue;
    else if (part === "..")
      baseparts.pop();
    else
      baseparts.push(part);
  }
  const prefix = path_match && path_match[0] || base_match && base_match[0] || "";
  return `${prefix}${baseparts.join("/")}`;
}
function normalize_path(path, trailing_slash) {
  if (path === "/" || trailing_slash === "ignore")
    return path;
  if (trailing_slash === "never") {
    return path.endsWith("/") ? path.slice(0, -1) : path;
  } else if (trailing_slash === "always" && !path.endsWith("/")) {
    return path + "/";
  }
  return path;
}
function decode_pathname(pathname) {
  return pathname.split("%25").map(decodeURI).join("%25");
}
function decode_params(params) {
  for (const key2 in params) {
    params[key2] = decodeURIComponent(params[key2]);
  }
  return params;
}
var tracked_url_properties = (
  /** @type {const} */
  [
    "href",
    "pathname",
    "search",
    "searchParams",
    "toString",
    "toJSON"
  ]
);
function make_trackable(url, callback) {
  const tracked = new URL(url);
  for (const property of tracked_url_properties) {
    Object.defineProperty(tracked, property, {
      get() {
        callback();
        return url[property];
      },
      enumerable: true,
      configurable: true
    });
  }
  {
    tracked[Symbol.for("nodejs.util.inspect.custom")] = (depth, opts, inspect) => {
      return inspect(url, opts);
    };
  }
  disable_hash(tracked);
  return tracked;
}
function disable_hash(url) {
  allow_nodejs_console_log(url);
  Object.defineProperty(url, "hash", {
    get() {
      throw new Error(
        "Cannot access event.url.hash. Consider using `$page.url.hash` inside a component instead"
      );
    }
  });
}
function disable_search(url) {
  allow_nodejs_console_log(url);
  for (const property of ["search", "searchParams"]) {
    Object.defineProperty(url, property, {
      get() {
        throw new Error(`Cannot access url.${property} on a page with prerendering enabled`);
      }
    });
  }
}
function allow_nodejs_console_log(url) {
  {
    url[Symbol.for("nodejs.util.inspect.custom")] = (depth, opts, inspect) => {
      return inspect(new URL(url), opts);
    };
  }
}
var DATA_SUFFIX = "/__data.json";
function has_data_suffix(pathname) {
  return pathname.endsWith(DATA_SUFFIX);
}
function add_data_suffix(pathname) {
  return pathname.replace(/\/$/, "") + DATA_SUFFIX;
}
function strip_data_suffix(pathname) {
  return pathname.slice(0, -DATA_SUFFIX.length);
}
function is_action_json_request(event) {
  const accept = negotiate(event.request.headers.get("accept") ?? "*/*", [
    "application/json",
    "text/html"
  ]);
  return accept === "application/json" && event.request.method === "POST";
}
async function handle_action_json_request(event, options2, server2) {
  const actions = server2?.actions;
  if (!actions) {
    const no_actions_error = error(405, "POST method not allowed. No actions exist for this page");
    return action_json(
      {
        type: "error",
        error: await handle_error_and_jsonify(event, options2, no_actions_error)
      },
      {
        status: no_actions_error.status,
        headers: {
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
          // "The server must generate an Allow header field in a 405 status code response"
          allow: "GET"
        }
      }
    );
  }
  check_named_default_separate(actions);
  try {
    const data = await call_action(event, actions);
    if (false)
      ;
    if (data instanceof ActionFailure) {
      return action_json({
        type: "failure",
        status: data.status,
        // @ts-expect-error we assign a string to what is supposed to be an object. That's ok
        // because we don't use the object outside, and this way we have better code navigation
        // through knowing where the related interface is used.
        data: stringify_action_response(
          data.data,
          /** @type {string} */
          event.route.id
        )
      });
    } else {
      return action_json({
        type: "success",
        status: data ? 200 : 204,
        // @ts-expect-error see comment above
        data: stringify_action_response(
          data,
          /** @type {string} */
          event.route.id
        )
      });
    }
  } catch (e3) {
    const err = normalize_error(e3);
    if (err instanceof Redirect) {
      return action_json_redirect(err);
    }
    return action_json(
      {
        type: "error",
        error: await handle_error_and_jsonify(event, options2, check_incorrect_fail_use(err))
      },
      {
        status: err instanceof HttpError ? err.status : 500
      }
    );
  }
}
function check_incorrect_fail_use(error2) {
  return error2 instanceof ActionFailure ? new Error('Cannot "throw fail()". Use "return fail()"') : error2;
}
function action_json_redirect(redirect2) {
  return action_json({
    type: "redirect",
    status: redirect2.status,
    location: redirect2.location
  });
}
function action_json(data, init2) {
  return json(data, init2);
}
function is_action_request(event) {
  return event.request.method === "POST";
}
async function handle_action_request(event, server2) {
  const actions = server2?.actions;
  if (!actions) {
    event.setHeaders({
      // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/405
      // "The server must generate an Allow header field in a 405 status code response"
      allow: "GET"
    });
    return {
      type: "error",
      error: error(405, "POST method not allowed. No actions exist for this page")
    };
  }
  check_named_default_separate(actions);
  try {
    const data = await call_action(event, actions);
    if (false)
      ;
    if (data instanceof ActionFailure) {
      return {
        type: "failure",
        status: data.status,
        data: data.data
      };
    } else {
      return {
        type: "success",
        status: 200,
        // @ts-expect-error this will be removed upon serialization, so `undefined` is the same as omission
        data
      };
    }
  } catch (e3) {
    const err = normalize_error(e3);
    if (err instanceof Redirect) {
      return {
        type: "redirect",
        status: err.status,
        location: err.location
      };
    }
    return {
      type: "error",
      error: check_incorrect_fail_use(err)
    };
  }
}
function check_named_default_separate(actions) {
  if (actions.default && Object.keys(actions).length > 1) {
    throw new Error(
      "When using named actions, the default action cannot be used. See the docs for more info: https://kit.svelte.dev/docs/form-actions#named-actions"
    );
  }
}
async function call_action(event, actions) {
  const url = new URL(event.request.url);
  let name = "default";
  for (const param of url.searchParams) {
    if (param[0].startsWith("/")) {
      name = param[0].slice(1);
      if (name === "default") {
        throw new Error('Cannot use reserved action name "default"');
      }
      break;
    }
  }
  const action = actions[name];
  if (!action) {
    throw new Error(`No action with name '${name}' found`);
  }
  if (!is_form_content_type(event.request)) {
    throw new Error(
      `Actions expect form-encoded data (received ${event.request.headers.get("content-type")})`
    );
  }
  return action(event);
}
function uneval_action_response(data, route_id) {
  return try_deserialize(data, uneval, route_id);
}
function stringify_action_response(data, route_id) {
  return try_deserialize(data, stringify, route_id);
}
function try_deserialize(data, fn, route_id) {
  try {
    return fn(data);
  } catch (e3) {
    const error2 = (
      /** @type {any} */
      e3
    );
    if ("path" in error2) {
      let message = `Data returned from action inside ${route_id} is not serializable: ${error2.message}`;
      if (error2.path !== "")
        message += ` (data.${error2.path})`;
      throw new Error(message);
    }
    throw error2;
  }
}
async function unwrap_promises(object, id) {
  for (const key2 in object) {
    if (typeof object[key2]?.then === "function") {
      return Object.fromEntries(
        await Promise.all(Object.entries(object).map(async ([key3, value]) => [key3, await value]))
      );
    }
  }
  return object;
}
var INVALIDATED_PARAM = "x-sveltekit-invalidated";
var TRAILING_SLASH_PARAM = "x-sveltekit-trailing-slash";
async function load_server_data({
  event,
  state,
  node,
  parent,
  // TODO 2.0: Remove this
  track_server_fetches
}) {
  if (!node?.server)
    return null;
  const uses = {
    dependencies: /* @__PURE__ */ new Set(),
    params: /* @__PURE__ */ new Set(),
    parent: false,
    route: false,
    url: false
  };
  const url = make_trackable(event.url, () => {
    uses.url = true;
  });
  if (state.prerendering) {
    disable_search(url);
  }
  const result = await node.server.load?.call(null, {
    ...event,
    fetch: (info, init2) => {
      const url2 = new URL(info instanceof Request ? info.url : info, event.url);
      if (track_server_fetches) {
        uses.dependencies.add(url2.href);
      }
      return event.fetch(info, init2);
    },
    /** @param {string[]} deps */
    depends: (...deps) => {
      for (const dep of deps) {
        const { href } = new URL(dep, event.url);
        uses.dependencies.add(href);
      }
    },
    params: new Proxy(event.params, {
      get: (target, key2) => {
        uses.params.add(key2);
        return target[
          /** @type {string} */
          key2
        ];
      }
    }),
    parent: async () => {
      uses.parent = true;
      return parent();
    },
    route: new Proxy(event.route, {
      get: (target, key2) => {
        uses.route = true;
        return target[
          /** @type {'id'} */
          key2
        ];
      }
    }),
    url
  });
  const data = result ? await unwrap_promises(result, node.server_id) : null;
  return {
    type: "data",
    data,
    uses,
    slash: node.server.trailingSlash
  };
}
async function load_data({
  event,
  fetched,
  node,
  parent,
  server_data_promise,
  state,
  resolve_opts,
  csr
}) {
  const server_data_node = await server_data_promise;
  if (!node?.universal?.load) {
    return server_data_node?.data ?? null;
  }
  const result = await node.universal.load.call(null, {
    url: event.url,
    params: event.params,
    data: server_data_node?.data ?? null,
    route: event.route,
    fetch: create_universal_fetch(event, state, fetched, csr, resolve_opts),
    setHeaders: event.setHeaders,
    depends: () => {
    },
    parent
  });
  const data = result ? await unwrap_promises(result, node.universal_id) : null;
  return data;
}
function b64_encode(buffer) {
  if (globalThis.Buffer) {
    return Buffer.from(buffer).toString("base64");
  }
  const little_endian = new Uint8Array(new Uint16Array([1]).buffer)[0] > 0;
  return btoa(
    new TextDecoder(little_endian ? "utf-16le" : "utf-16be").decode(
      new Uint16Array(new Uint8Array(buffer))
    )
  );
}
function create_universal_fetch(event, state, fetched, csr, resolve_opts) {
  const universal_fetch = async (input, init2) => {
    const cloned_body = input instanceof Request && input.body ? input.clone().body : null;
    const cloned_headers = input instanceof Request && [...input.headers].length ? new Headers(input.headers) : init2?.headers;
    let response = await event.fetch(input, init2);
    const url = new URL(input instanceof Request ? input.url : input, event.url);
    const same_origin = url.origin === event.url.origin;
    let dependency;
    if (same_origin) {
      if (state.prerendering) {
        dependency = { response, body: null };
        state.prerendering.dependencies.set(url.pathname, dependency);
      }
    } else {
      const mode = input instanceof Request ? input.mode : init2?.mode ?? "cors";
      if (mode === "no-cors") {
        response = new Response("", {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      } else {
        const acao = response.headers.get("access-control-allow-origin");
        if (!acao || acao !== event.url.origin && acao !== "*") {
          throw new Error(
            `CORS error: ${acao ? "Incorrect" : "No"} 'Access-Control-Allow-Origin' header is present on the requested resource`
          );
        }
      }
    }
    const proxy = new Proxy(response, {
      get(response2, key2, _receiver) {
        async function push_fetched(body, is_b64) {
          const status_number = Number(response2.status);
          if (isNaN(status_number)) {
            throw new Error(
              `response.status is not a number. value: "${response2.status}" type: ${typeof response2.status}`
            );
          }
          fetched.push({
            url: same_origin ? url.href.slice(event.url.origin.length) : url.href,
            method: event.request.method,
            request_body: (
              /** @type {string | ArrayBufferView | undefined} */
              input instanceof Request && cloned_body ? await stream_to_string(cloned_body) : init2?.body
            ),
            request_headers: cloned_headers,
            response_body: body,
            response: response2,
            is_b64
          });
        }
        if (key2 === "arrayBuffer") {
          return async () => {
            const buffer = await response2.arrayBuffer();
            if (dependency) {
              dependency.body = new Uint8Array(buffer);
            }
            if (buffer instanceof ArrayBuffer) {
              await push_fetched(b64_encode(buffer), true);
            }
            return buffer;
          };
        }
        async function text2() {
          const body = await response2.text();
          if (!body || typeof body === "string") {
            await push_fetched(body, false);
          }
          if (dependency) {
            dependency.body = body;
          }
          return body;
        }
        if (key2 === "text") {
          return text2;
        }
        if (key2 === "json") {
          return async () => {
            return JSON.parse(await text2());
          };
        }
        return Reflect.get(response2, key2, response2);
      }
    });
    if (csr) {
      const get = response.headers.get;
      response.headers.get = (key2) => {
        const lower = key2.toLowerCase();
        const value = get.call(response.headers, lower);
        if (value && !lower.startsWith("x-sveltekit-")) {
          const included = resolve_opts.filterSerializedResponseHeaders(lower, value);
          if (!included) {
            throw new Error(
              `Failed to get response header "${lower}" \u2014 it must be included by the \`filterSerializedResponseHeaders\` option: https://kit.svelte.dev/docs/hooks#server-hooks-handle (at ${event.route.id})`
            );
          }
        }
        return value;
      };
    }
    return proxy;
  };
  return (input, init2) => {
    const response = universal_fetch(input, init2);
    response.catch(() => {
    });
    return response;
  };
}
async function stream_to_string(stream) {
  let result = "";
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    result += decoder.decode(value);
  }
  return result;
}
var subscriber_queue = [];
function readable(value, start) {
  return {
    subscribe: writable(value, start).subscribe
  };
}
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i2 = 0; i2 < subscriber_queue.length; i2 += 2) {
            subscriber_queue[i2][0](subscriber_queue[i2 + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set, update) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0 && stop) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update, subscribe: subscribe2 };
}
function hash(...values) {
  let hash2 = 5381;
  for (const value of values) {
    if (typeof value === "string") {
      let i2 = value.length;
      while (i2)
        hash2 = hash2 * 33 ^ value.charCodeAt(--i2);
    } else if (ArrayBuffer.isView(value)) {
      const buffer = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
      let i2 = buffer.length;
      while (i2)
        hash2 = hash2 * 33 ^ buffer[--i2];
    } else {
      throw new TypeError("value must be a string or TypedArray");
    }
  }
  return (hash2 >>> 0).toString(36);
}
var escape_html_attr_dict = {
  "&": "&amp;",
  '"': "&quot;"
};
var escape_html_attr_regex = new RegExp(
  // special characters
  `[${Object.keys(escape_html_attr_dict).join("")}]|[\\ud800-\\udbff](?![\\udc00-\\udfff])|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\udc00-\\udfff]`,
  "g"
);
function escape_html_attr(str2) {
  const escaped_str = str2.replace(escape_html_attr_regex, (match) => {
    if (match.length === 2) {
      return match;
    }
    return escape_html_attr_dict[match] ?? `&#${match.charCodeAt(0)};`;
  });
  return `"${escaped_str}"`;
}
var replacements = {
  "<": "\\u003C",
  "\u2028": "\\u2028",
  "\u2029": "\\u2029"
};
var pattern = new RegExp(`[${Object.keys(replacements).join("")}]`, "g");
function serialize_data(fetched, filter, prerendering = false) {
  const headers = {};
  let cache_control = null;
  let age = null;
  let varyAny = false;
  for (const [key2, value] of fetched.response.headers) {
    if (filter(key2, value)) {
      headers[key2] = value;
    }
    if (key2 === "cache-control")
      cache_control = value;
    else if (key2 === "age")
      age = value;
    else if (key2 === "vary" && value.trim() === "*")
      varyAny = true;
  }
  const payload = {
    status: fetched.response.status,
    statusText: fetched.response.statusText,
    headers,
    body: fetched.response_body
  };
  const safe_payload = JSON.stringify(payload).replace(pattern, (match) => replacements[match]);
  const attrs = [
    'type="application/json"',
    "data-sveltekit-fetched",
    `data-url=${escape_html_attr(fetched.url)}`
  ];
  if (fetched.is_b64) {
    attrs.push("data-b64");
  }
  if (fetched.request_headers || fetched.request_body) {
    const values = [];
    if (fetched.request_headers) {
      values.push([...new Headers(fetched.request_headers)].join(","));
    }
    if (fetched.request_body) {
      values.push(fetched.request_body);
    }
    attrs.push(`data-hash="${hash(...values)}"`);
  }
  if (!prerendering && fetched.method === "GET" && cache_control && !varyAny) {
    const match = /s-maxage=(\d+)/g.exec(cache_control) ?? /max-age=(\d+)/g.exec(cache_control);
    if (match) {
      const ttl = +match[1] - +(age ?? "0");
      attrs.push(`data-ttl="${ttl}"`);
    }
  }
  return `<script ${attrs.join(" ")}>${safe_payload}<\/script>`;
}
var s2 = JSON.stringify;
var encoder$2 = new TextEncoder();
function sha256(data) {
  if (!key[0])
    precompute();
  const out = init.slice(0);
  const array2 = encode(data);
  for (let i2 = 0; i2 < array2.length; i2 += 16) {
    const w = array2.subarray(i2, i2 + 16);
    let tmp;
    let a;
    let b;
    let out0 = out[0];
    let out1 = out[1];
    let out2 = out[2];
    let out3 = out[3];
    let out4 = out[4];
    let out5 = out[5];
    let out6 = out[6];
    let out7 = out[7];
    for (let i22 = 0; i22 < 64; i22++) {
      if (i22 < 16) {
        tmp = w[i22];
      } else {
        a = w[i22 + 1 & 15];
        b = w[i22 + 14 & 15];
        tmp = w[i22 & 15] = (a >>> 7 ^ a >>> 18 ^ a >>> 3 ^ a << 25 ^ a << 14) + (b >>> 17 ^ b >>> 19 ^ b >>> 10 ^ b << 15 ^ b << 13) + w[i22 & 15] + w[i22 + 9 & 15] | 0;
      }
      tmp = tmp + out7 + (out4 >>> 6 ^ out4 >>> 11 ^ out4 >>> 25 ^ out4 << 26 ^ out4 << 21 ^ out4 << 7) + (out6 ^ out4 & (out5 ^ out6)) + key[i22];
      out7 = out6;
      out6 = out5;
      out5 = out4;
      out4 = out3 + tmp | 0;
      out3 = out2;
      out2 = out1;
      out1 = out0;
      out0 = tmp + (out1 & out2 ^ out3 & (out1 ^ out2)) + (out1 >>> 2 ^ out1 >>> 13 ^ out1 >>> 22 ^ out1 << 30 ^ out1 << 19 ^ out1 << 10) | 0;
    }
    out[0] = out[0] + out0 | 0;
    out[1] = out[1] + out1 | 0;
    out[2] = out[2] + out2 | 0;
    out[3] = out[3] + out3 | 0;
    out[4] = out[4] + out4 | 0;
    out[5] = out[5] + out5 | 0;
    out[6] = out[6] + out6 | 0;
    out[7] = out[7] + out7 | 0;
  }
  const bytes = new Uint8Array(out.buffer);
  reverse_endianness(bytes);
  return base64(bytes);
}
var init = new Uint32Array(8);
var key = new Uint32Array(64);
function precompute() {
  function frac(x) {
    return (x - Math.floor(x)) * 4294967296;
  }
  let prime = 2;
  for (let i2 = 0; i2 < 64; prime++) {
    let is_prime = true;
    for (let factor = 2; factor * factor <= prime; factor++) {
      if (prime % factor === 0) {
        is_prime = false;
        break;
      }
    }
    if (is_prime) {
      if (i2 < 8) {
        init[i2] = frac(prime ** (1 / 2));
      }
      key[i2] = frac(prime ** (1 / 3));
      i2++;
    }
  }
}
function reverse_endianness(bytes) {
  for (let i2 = 0; i2 < bytes.length; i2 += 4) {
    const a = bytes[i2 + 0];
    const b = bytes[i2 + 1];
    const c2 = bytes[i2 + 2];
    const d = bytes[i2 + 3];
    bytes[i2 + 0] = d;
    bytes[i2 + 1] = c2;
    bytes[i2 + 2] = b;
    bytes[i2 + 3] = a;
  }
}
function encode(str2) {
  const encoded = encoder$2.encode(str2);
  const length = encoded.length * 8;
  const size = 512 * Math.ceil((length + 65) / 512);
  const bytes = new Uint8Array(size / 8);
  bytes.set(encoded);
  bytes[encoded.length] = 128;
  reverse_endianness(bytes);
  const words = new Uint32Array(bytes.buffer);
  words[words.length - 2] = Math.floor(length / 4294967296);
  words[words.length - 1] = length;
  return words;
}
var chars2 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split("");
function base64(bytes) {
  const l = bytes.length;
  let result = "";
  let i2;
  for (i2 = 2; i2 < l; i2 += 3) {
    result += chars2[bytes[i2 - 2] >> 2];
    result += chars2[(bytes[i2 - 2] & 3) << 4 | bytes[i2 - 1] >> 4];
    result += chars2[(bytes[i2 - 1] & 15) << 2 | bytes[i2] >> 6];
    result += chars2[bytes[i2] & 63];
  }
  if (i2 === l + 1) {
    result += chars2[bytes[i2 - 2] >> 2];
    result += chars2[(bytes[i2 - 2] & 3) << 4];
    result += "==";
  }
  if (i2 === l) {
    result += chars2[bytes[i2 - 2] >> 2];
    result += chars2[(bytes[i2 - 2] & 3) << 4 | bytes[i2 - 1] >> 4];
    result += chars2[(bytes[i2 - 1] & 15) << 2];
    result += "=";
  }
  return result;
}
var array = new Uint8Array(16);
function generate_nonce() {
  crypto.getRandomValues(array);
  return base64(array);
}
var quoted = /* @__PURE__ */ new Set([
  "self",
  "unsafe-eval",
  "unsafe-hashes",
  "unsafe-inline",
  "none",
  "strict-dynamic",
  "report-sample",
  "wasm-unsafe-eval",
  "script"
]);
var crypto_pattern = /^(nonce|sha\d\d\d)-/;
var BaseProvider = class {
  /** @type {boolean} */
  #use_hashes;
  /** @type {boolean} */
  #script_needs_csp;
  /** @type {boolean} */
  #style_needs_csp;
  /** @type {import('types').CspDirectives} */
  #directives;
  /** @type {import('types').Csp.Source[]} */
  #script_src;
  /** @type {import('types').Csp.Source[]} */
  #style_src;
  /** @type {string} */
  #nonce;
  /**
   * @param {boolean} use_hashes
   * @param {import('types').CspDirectives} directives
   * @param {string} nonce
   */
  constructor(use_hashes, directives, nonce) {
    this.#use_hashes = use_hashes;
    this.#directives = directives;
    const d = this.#directives;
    this.#script_src = [];
    this.#style_src = [];
    const effective_script_src = d["script-src"] || d["default-src"];
    const effective_style_src = d["style-src"] || d["default-src"];
    this.#script_needs_csp = !!effective_script_src && effective_script_src.filter((value) => value !== "unsafe-inline").length > 0;
    this.#style_needs_csp = !!effective_style_src && effective_style_src.filter((value) => value !== "unsafe-inline").length > 0;
    this.script_needs_nonce = this.#script_needs_csp && !this.#use_hashes;
    this.style_needs_nonce = this.#style_needs_csp && !this.#use_hashes;
    this.#nonce = nonce;
  }
  /** @param {string} content */
  add_script(content) {
    if (this.#script_needs_csp) {
      if (this.#use_hashes) {
        this.#script_src.push(`sha256-${sha256(content)}`);
      } else if (this.#script_src.length === 0) {
        this.#script_src.push(`nonce-${this.#nonce}`);
      }
    }
  }
  /** @param {string} content */
  add_style(content) {
    if (this.#style_needs_csp) {
      if (this.#use_hashes) {
        this.#style_src.push(`sha256-${sha256(content)}`);
      } else if (this.#style_src.length === 0) {
        this.#style_src.push(`nonce-${this.#nonce}`);
      }
    }
  }
  /**
   * @param {boolean} [is_meta]
   */
  get_header(is_meta = false) {
    const header = [];
    const directives = { ...this.#directives };
    if (this.#style_src.length > 0) {
      directives["style-src"] = [
        ...directives["style-src"] || directives["default-src"] || [],
        ...this.#style_src
      ];
    }
    if (this.#script_src.length > 0) {
      directives["script-src"] = [
        ...directives["script-src"] || directives["default-src"] || [],
        ...this.#script_src
      ];
    }
    for (const key2 in directives) {
      if (is_meta && (key2 === "frame-ancestors" || key2 === "report-uri" || key2 === "sandbox")) {
        continue;
      }
      const value = (
        /** @type {string[] | true} */
        directives[key2]
      );
      if (!value)
        continue;
      const directive = [key2];
      if (Array.isArray(value)) {
        value.forEach((value2) => {
          if (quoted.has(value2) || crypto_pattern.test(value2)) {
            directive.push(`'${value2}'`);
          } else {
            directive.push(value2);
          }
        });
      }
      header.push(directive.join(" "));
    }
    return header.join("; ");
  }
};
var CspProvider = class extends BaseProvider {
  get_meta() {
    const content = this.get_header(true);
    if (!content) {
      return;
    }
    return `<meta http-equiv="content-security-policy" content=${escape_html_attr(content)}>`;
  }
};
var CspReportOnlyProvider = class extends BaseProvider {
  /**
   * @param {boolean} use_hashes
   * @param {import('types').CspDirectives} directives
   * @param {string} nonce
   */
  constructor(use_hashes, directives, nonce) {
    super(use_hashes, directives, nonce);
    if (Object.values(directives).filter((v) => !!v).length > 0) {
      const has_report_to = directives["report-to"]?.length ?? 0 > 0;
      const has_report_uri = directives["report-uri"]?.length ?? 0 > 0;
      if (!has_report_to && !has_report_uri) {
        throw Error(
          "`content-security-policy-report-only` must be specified with either the `report-to` or `report-uri` directives, or both"
        );
      }
    }
  }
};
var Csp = class {
  /** @readonly */
  nonce = generate_nonce();
  /** @type {CspProvider} */
  csp_provider;
  /** @type {CspReportOnlyProvider} */
  report_only_provider;
  /**
   * @param {import('./types.js').CspConfig} config
   * @param {import('./types.js').CspOpts} opts
   */
  constructor({ mode, directives, reportOnly }, { prerender }) {
    const use_hashes = mode === "hash" || mode === "auto" && prerender;
    this.csp_provider = new CspProvider(use_hashes, directives, this.nonce);
    this.report_only_provider = new CspReportOnlyProvider(use_hashes, reportOnly, this.nonce);
  }
  get script_needs_nonce() {
    return this.csp_provider.script_needs_nonce || this.report_only_provider.script_needs_nonce;
  }
  get style_needs_nonce() {
    return this.csp_provider.style_needs_nonce || this.report_only_provider.style_needs_nonce;
  }
  /** @param {string} content */
  add_script(content) {
    this.csp_provider.add_script(content);
    this.report_only_provider.add_script(content);
  }
  /** @param {string} content */
  add_style(content) {
    this.csp_provider.add_style(content);
    this.report_only_provider.add_style(content);
  }
};
function defer() {
  let fulfil;
  let reject;
  const promise = new Promise((f, r3) => {
    fulfil = f;
    reject = r3;
  });
  return { promise, fulfil, reject };
}
function create_async_iterator() {
  const deferred = [defer()];
  return {
    iterator: {
      [Symbol.asyncIterator]() {
        return {
          next: async () => {
            const next = await deferred[0].promise;
            if (!next.done)
              deferred.shift();
            return next;
          }
        };
      }
    },
    push: (value) => {
      deferred[deferred.length - 1].fulfil({
        value,
        done: false
      });
      deferred.push(defer());
    },
    done: () => {
      deferred[deferred.length - 1].fulfil({ done: true });
    }
  };
}
var updated = {
  ...readable(false),
  check: () => false
};
var encoder$1 = new TextEncoder();
async function render_response({
  branch,
  fetched,
  options: options2,
  manifest: manifest2,
  state,
  page_config,
  status,
  error: error2 = null,
  event,
  resolve_opts,
  action_result
}) {
  if (state.prerendering) {
    if (options2.csp.mode === "nonce") {
      throw new Error('Cannot use prerendering if config.kit.csp.mode === "nonce"');
    }
    if (options2.app_template_contains_nonce) {
      throw new Error("Cannot use prerendering if page template contains %sveltekit.nonce%");
    }
  }
  const { client } = manifest2._;
  const modulepreloads = new Set(client.imports);
  const stylesheets8 = new Set(client.stylesheets);
  const fonts8 = new Set(client.fonts);
  const link_header_preloads = /* @__PURE__ */ new Set();
  const inline_styles = /* @__PURE__ */ new Map();
  let rendered;
  const form_value = action_result?.type === "success" || action_result?.type === "failure" ? action_result.data ?? null : null;
  let base$1 = base;
  let assets$1 = assets;
  let base_expression = s2(base);
  if (!state.prerendering?.fallback) {
    const segments = event.url.pathname.slice(base.length).split("/").slice(2);
    base$1 = segments.map(() => "..").join("/") || ".";
    base_expression = `new URL(${s2(base$1)}, location).pathname.slice(0, -1)`;
    if (!assets || assets[0] === "/" && assets !== SVELTE_KIT_ASSETS) {
      assets$1 = base$1;
    }
  }
  if (page_config.ssr) {
    const props = {
      stores: {
        page: writable(null),
        navigating: writable(null),
        updated
      },
      constructors: await Promise.all(branch.map(({ node }) => node.component())),
      form: form_value
    };
    let data2 = {};
    for (let i2 = 0; i2 < branch.length; i2 += 1) {
      data2 = { ...data2, ...branch[i2].data };
      props[`data_${i2}`] = data2;
    }
    props.page = {
      error: error2,
      params: (
        /** @type {Record<string, any>} */
        event.params
      ),
      route: event.route,
      status,
      url: event.url,
      data: data2,
      form: form_value
    };
    {
      try {
        rendered = options2.root.render(props);
      } finally {
        reset();
      }
    }
    for (const { node } of branch) {
      for (const url of node.imports)
        modulepreloads.add(url);
      for (const url of node.stylesheets)
        stylesheets8.add(url);
      for (const url of node.fonts)
        fonts8.add(url);
      if (node.inline_styles) {
        Object.entries(await node.inline_styles()).forEach(([k, v]) => inline_styles.set(k, v));
      }
    }
  } else {
    rendered = { head: "", html: "", css: { code: "", map: null } };
  }
  let head = "";
  let body = rendered.html;
  const csp = new Csp(options2.csp, {
    prerender: !!state.prerendering
  });
  const prefixed = (path) => {
    if (path.startsWith("/")) {
      return base + path;
    }
    return `${assets$1}/${path}`;
  };
  if (inline_styles.size > 0) {
    const content = Array.from(inline_styles.values()).join("\n");
    const attributes = [];
    if (csp.style_needs_nonce)
      attributes.push(` nonce="${csp.nonce}"`);
    csp.add_style(content);
    head += `
	<style${attributes.join("")}>${content}</style>`;
  }
  for (const dep of stylesheets8) {
    const path = prefixed(dep);
    const attributes = ['rel="stylesheet"'];
    if (inline_styles.has(dep)) {
      attributes.push("disabled", 'media="(max-width: 0)"');
    } else {
      if (resolve_opts.preload({ type: "css", path })) {
        const preload_atts = ['rel="preload"', 'as="style"'];
        link_header_preloads.add(`<${encodeURI(path)}>; ${preload_atts.join(";")}; nopush`);
      }
    }
    head += `
		<link href="${path}" ${attributes.join(" ")}>`;
  }
  for (const dep of fonts8) {
    const path = prefixed(dep);
    if (resolve_opts.preload({ type: "font", path })) {
      const ext = dep.slice(dep.lastIndexOf(".") + 1);
      const attributes = [
        'rel="preload"',
        'as="font"',
        `type="font/${ext}"`,
        `href="${path}"`,
        "crossorigin"
      ];
      head += `
		<link ${attributes.join(" ")}>`;
    }
  }
  const global = `__sveltekit_${options2.version_hash}`;
  const { data, chunks } = get_data(
    event,
    options2,
    branch.map((b) => b.server_data),
    global
  );
  if (page_config.ssr && page_config.csr) {
    body += `
			${fetched.map(
      (item) => serialize_data(item, resolve_opts.filterSerializedResponseHeaders, !!state.prerendering)
    ).join("\n			")}`;
  }
  if (page_config.csr) {
    const included_modulepreloads = Array.from(modulepreloads, (dep) => prefixed(dep)).filter(
      (path) => resolve_opts.preload({ type: "js", path })
    );
    for (const path of included_modulepreloads) {
      link_header_preloads.add(`<${encodeURI(path)}>; rel="modulepreload"; nopush`);
      if (options2.preload_strategy !== "modulepreload") {
        head += `
		<link rel="preload" as="script" crossorigin="anonymous" href="${path}">`;
      } else if (state.prerendering) {
        head += `
		<link rel="modulepreload" href="${path}">`;
      }
    }
    const blocks = [];
    const properties = [
      assets && `assets: ${s2(assets)}`,
      `base: ${base_expression}`,
      `env: ${s2(public_env)}`
    ].filter(Boolean);
    if (chunks) {
      blocks.push("const deferred = new Map();");
      properties.push(`defer: (id) => new Promise((fulfil, reject) => {
							deferred.set(id, { fulfil, reject });
						})`);
      properties.push(`resolve: ({ id, data, error }) => {
							const { fulfil, reject } = deferred.get(id);
							deferred.delete(id);

							if (error) reject(error);
							else fulfil(data);
						}`);
    }
    blocks.push(`${global} = {
						${properties.join(",\n						")}
					};`);
    const args = ["app", "element"];
    blocks.push("const element = document.currentScript.parentElement;");
    if (page_config.ssr) {
      const serialized = { form: "null", error: "null" };
      blocks.push(`const data = ${data};`);
      if (form_value) {
        serialized.form = uneval_action_response(
          form_value,
          /** @type {string} */
          event.route.id
        );
      }
      if (error2) {
        serialized.error = uneval(error2);
      }
      const hydrate = [
        `node_ids: [${branch.map(({ node }) => node.index).join(", ")}]`,
        "data",
        `form: ${serialized.form}`,
        `error: ${serialized.error}`
      ];
      if (status !== 200) {
        hydrate.push(`status: ${status}`);
      }
      if (options2.embedded) {
        hydrate.push(`params: ${uneval(event.params)}`, `route: ${s2(event.route)}`);
      }
      args.push(`{
							${hydrate.join(",\n							")}
						}`);
    }
    blocks.push(`Promise.all([
						import(${s2(prefixed(client.start))}),
						import(${s2(prefixed(client.app))})
					]).then(([kit, app]) => {
						kit.start(${args.join(", ")});
					});`);
    if (options2.service_worker) {
      const opts = "";
      blocks.push(`if ('serviceWorker' in navigator) {
						addEventListener('load', function () {
							navigator.serviceWorker.register('${prefixed("service-worker.js")}'${opts});
						});
					}`);
    }
    const init_app = `
				{
					${blocks.join("\n\n					")}
				}
			`;
    csp.add_script(init_app);
    body += `
			<script${csp.script_needs_nonce ? ` nonce="${csp.nonce}"` : ""}>${init_app}<\/script>
		`;
  }
  const headers = new Headers({
    "x-sveltekit-page": "true",
    "content-type": "text/html"
  });
  if (state.prerendering) {
    const http_equiv = [];
    const csp_headers = csp.csp_provider.get_meta();
    if (csp_headers) {
      http_equiv.push(csp_headers);
    }
    if (state.prerendering.cache) {
      http_equiv.push(`<meta http-equiv="cache-control" content="${state.prerendering.cache}">`);
    }
    if (http_equiv.length > 0) {
      head = http_equiv.join("\n") + head;
    }
  } else {
    const csp_header = csp.csp_provider.get_header();
    if (csp_header) {
      headers.set("content-security-policy", csp_header);
    }
    const report_only_header = csp.report_only_provider.get_header();
    if (report_only_header) {
      headers.set("content-security-policy-report-only", report_only_header);
    }
    if (link_header_preloads.size) {
      headers.set("link", Array.from(link_header_preloads).join(", "));
    }
  }
  head += rendered.head;
  const html = options2.templates.app({
    head,
    body,
    assets: assets$1,
    nonce: (
      /** @type {string} */
      csp.nonce
    ),
    env: public_env
  });
  const transformed = await resolve_opts.transformPageChunk({
    html,
    done: true
  }) || "";
  if (!chunks) {
    headers.set("etag", `"${hash(transformed)}"`);
  }
  return !chunks ? text(transformed, {
    status,
    headers
  }) : new Response(
    new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder$1.encode(transformed + "\n"));
        for await (const chunk of chunks) {
          controller.enqueue(encoder$1.encode(chunk));
        }
        controller.close();
      },
      type: "bytes"
    }),
    {
      headers: {
        "content-type": "text/html"
      }
    }
  );
}
function get_data(event, options2, nodes, global) {
  let promise_id = 1;
  let count = 0;
  const { iterator, push, done } = create_async_iterator();
  function replacer(thing) {
    if (typeof thing?.then === "function") {
      const id = promise_id++;
      count += 1;
      thing.then(
        /** @param {any} data */
        (data) => ({ data })
      ).catch(
        /** @param {any} error */
        async (error2) => ({
          error: await handle_error_and_jsonify(event, options2, error2)
        })
      ).then(
        /**
         * @param {{data: any; error: any}} result
         */
        async ({ data, error: error2 }) => {
          count -= 1;
          let str2;
          try {
            str2 = uneval({ id, data, error: error2 }, replacer);
          } catch (e3) {
            error2 = await handle_error_and_jsonify(
              event,
              options2,
              new Error(`Failed to serialize promise while rendering ${event.route.id}`)
            );
            data = void 0;
            str2 = uneval({ id, data, error: error2 }, replacer);
          }
          push(`<script>${global}.resolve(${str2})<\/script>
`);
          if (count === 0)
            done();
        }
      );
      return `${global}.defer(${id})`;
    }
  }
  try {
    const strings = nodes.map((node) => {
      if (!node)
        return "null";
      return `{"type":"data","data":${uneval(node.data, replacer)},${stringify_uses(node)}${node.slash ? `,"slash":${JSON.stringify(node.slash)}` : ""}}`;
    });
    return {
      data: `[${strings.join(",")}]`,
      chunks: count > 0 ? iterator : null
    };
  } catch (e3) {
    throw new Error(clarify_devalue_error(
      event,
      /** @type {any} */
      e3
    ));
  }
}
function get_option(nodes, option) {
  return nodes.reduce(
    (value, node) => {
      return (
        /** @type {Value} TypeScript's too dumb to understand this */
        node?.universal?.[option] ?? node?.server?.[option] ?? value
      );
    },
    /** @type {Value | undefined} */
    void 0
  );
}
async function respond_with_error({
  event,
  options: options2,
  manifest: manifest2,
  state,
  status,
  error: error2,
  resolve_opts
}) {
  if (event.request.headers.get("x-sveltekit-error")) {
    return static_error_page(
      options2,
      status,
      /** @type {Error} */
      error2.message
    );
  }
  const fetched = [];
  try {
    const branch = [];
    const default_layout = await manifest2._.nodes[0]();
    const ssr = get_option([default_layout], "ssr") ?? true;
    const csr = get_option([default_layout], "csr") ?? true;
    if (ssr) {
      state.error = true;
      const server_data_promise = load_server_data({
        event,
        state,
        node: default_layout,
        parent: async () => ({}),
        track_server_fetches: options2.track_server_fetches
      });
      const server_data = await server_data_promise;
      const data = await load_data({
        event,
        fetched,
        node: default_layout,
        parent: async () => ({}),
        resolve_opts,
        server_data_promise,
        state,
        csr
      });
      branch.push(
        {
          node: default_layout,
          server_data,
          data
        },
        {
          node: await manifest2._.nodes[1](),
          // 1 is always the root error
          data: null,
          server_data: null
        }
      );
    }
    return await render_response({
      options: options2,
      manifest: manifest2,
      state,
      page_config: {
        ssr,
        csr: get_option([default_layout], "csr") ?? true
      },
      status,
      error: await handle_error_and_jsonify(event, options2, error2),
      branch,
      fetched,
      event,
      resolve_opts
    });
  } catch (e3) {
    if (e3 instanceof Redirect) {
      return redirect_response(e3.status, e3.location);
    }
    return static_error_page(
      options2,
      e3 instanceof HttpError ? e3.status : 500,
      (await handle_error_and_jsonify(event, options2, e3)).message
    );
  }
}
function once(fn) {
  let done = false;
  let result;
  return () => {
    if (done)
      return result;
    done = true;
    return result = fn();
  };
}
var encoder2 = new TextEncoder();
async function render_data(event, route, options2, manifest2, state, invalidated_data_nodes, trailing_slash) {
  if (!route.page) {
    return new Response(void 0, {
      status: 404
    });
  }
  try {
    const node_ids = [...route.page.layouts, route.page.leaf];
    const invalidated = invalidated_data_nodes ?? node_ids.map(() => true);
    let aborted = false;
    const url = new URL(event.url);
    url.pathname = normalize_path(url.pathname, trailing_slash);
    const new_event = { ...event, url };
    const functions = node_ids.map((n2, i2) => {
      return once(async () => {
        try {
          if (aborted) {
            return (
              /** @type {import('types').ServerDataSkippedNode} */
              {
                type: "skip"
              }
            );
          }
          const node = n2 == void 0 ? n2 : await manifest2._.nodes[n2]();
          return load_server_data({
            event: new_event,
            state,
            node,
            parent: async () => {
              const data2 = {};
              for (let j = 0; j < i2; j += 1) {
                const parent = (
                  /** @type {import('types').ServerDataNode | null} */
                  await functions[j]()
                );
                if (parent) {
                  Object.assign(data2, parent.data);
                }
              }
              return data2;
            },
            track_server_fetches: options2.track_server_fetches
          });
        } catch (e3) {
          aborted = true;
          throw e3;
        }
      });
    });
    const promises = functions.map(async (fn, i2) => {
      if (!invalidated[i2]) {
        return (
          /** @type {import('types').ServerDataSkippedNode} */
          {
            type: "skip"
          }
        );
      }
      return fn();
    });
    let length = promises.length;
    const nodes = await Promise.all(
      promises.map(
        (p, i2) => p.catch(async (error2) => {
          if (error2 instanceof Redirect) {
            throw error2;
          }
          length = Math.min(length, i2 + 1);
          return (
            /** @type {import('types').ServerErrorNode} */
            {
              type: "error",
              error: await handle_error_and_jsonify(event, options2, error2),
              status: error2 instanceof HttpError ? error2.status : void 0
            }
          );
        })
      )
    );
    const { data, chunks } = get_data_json(event, options2, nodes);
    if (!chunks) {
      return json_response(data);
    }
    return new Response(
      new ReadableStream({
        async start(controller) {
          controller.enqueue(encoder2.encode(data));
          for await (const chunk of chunks) {
            controller.enqueue(encoder2.encode(chunk));
          }
          controller.close();
        },
        type: "bytes"
      }),
      {
        headers: {
          // we use a proprietary content type to prevent buffering.
          // the `text` prefix makes it inspectable
          "content-type": "text/sveltekit-data",
          "cache-control": "private, no-store"
        }
      }
    );
  } catch (e3) {
    const error2 = normalize_error(e3);
    if (error2 instanceof Redirect) {
      return redirect_json_response(error2);
    } else {
      return json_response(await handle_error_and_jsonify(event, options2, error2), 500);
    }
  }
}
function json_response(json2, status = 200) {
  return text(typeof json2 === "string" ? json2 : JSON.stringify(json2), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "private, no-store"
    }
  });
}
function redirect_json_response(redirect2) {
  return json_response({
    type: "redirect",
    location: redirect2.location
  });
}
function get_data_json(event, options2, nodes) {
  let promise_id = 1;
  let count = 0;
  const { iterator, push, done } = create_async_iterator();
  const reducers = {
    /** @param {any} thing */
    Promise: (thing) => {
      if (typeof thing?.then === "function") {
        const id = promise_id++;
        count += 1;
        let key2 = "data";
        thing.catch(
          /** @param {any} e */
          async (e3) => {
            key2 = "error";
            return handle_error_and_jsonify(
              event,
              options2,
              /** @type {any} */
              e3
            );
          }
        ).then(
          /** @param {any} value */
          async (value) => {
            let str2;
            try {
              str2 = stringify(value, reducers);
            } catch (e3) {
              const error2 = await handle_error_and_jsonify(
                event,
                options2,
                new Error(`Failed to serialize promise while rendering ${event.route.id}`)
              );
              key2 = "error";
              str2 = stringify(error2, reducers);
            }
            count -= 1;
            push(`{"type":"chunk","id":${id},"${key2}":${str2}}
`);
            if (count === 0)
              done();
          }
        );
        return id;
      }
    }
  };
  try {
    const strings = nodes.map((node) => {
      if (!node)
        return "null";
      if (node.type === "error" || node.type === "skip") {
        return JSON.stringify(node);
      }
      return `{"type":"data","data":${stringify(node.data, reducers)},${stringify_uses(
        node
      )}${node.slash ? `,"slash":${JSON.stringify(node.slash)}` : ""}}`;
    });
    return {
      data: `{"type":"data","nodes":[${strings.join(",")}]}
`,
      chunks: count > 0 ? iterator : null
    };
  } catch (e3) {
    throw new Error(clarify_devalue_error(
      event,
      /** @type {any} */
      e3
    ));
  }
}
var MAX_DEPTH = 10;
async function render_page(event, page2, options2, manifest2, state, resolve_opts) {
  if (state.depth > MAX_DEPTH) {
    return text(`Not found: ${event.url.pathname}`, {
      status: 404
      // TODO in some cases this should be 500. not sure how to differentiate
    });
  }
  if (is_action_json_request(event)) {
    const node = await manifest2._.nodes[page2.leaf]();
    return handle_action_json_request(event, options2, node?.server);
  }
  try {
    const nodes = await Promise.all([
      // we use == here rather than === because [undefined] serializes as "[null]"
      ...page2.layouts.map((n2) => n2 == void 0 ? n2 : manifest2._.nodes[n2]()),
      manifest2._.nodes[page2.leaf]()
    ]);
    const leaf_node = (
      /** @type {import('types').SSRNode} */
      nodes.at(-1)
    );
    let status = 200;
    let action_result = void 0;
    if (is_action_request(event)) {
      action_result = await handle_action_request(event, leaf_node.server);
      if (action_result?.type === "redirect") {
        return redirect_response(action_result.status, action_result.location);
      }
      if (action_result?.type === "error") {
        const error2 = action_result.error;
        status = error2 instanceof HttpError ? error2.status : 500;
      }
      if (action_result?.type === "failure") {
        status = action_result.status;
      }
    }
    const should_prerender_data = nodes.some((node) => node?.server);
    const data_pathname = add_data_suffix(event.url.pathname);
    const should_prerender = get_option(nodes, "prerender") ?? false;
    if (should_prerender) {
      const mod = leaf_node.server;
      if (mod?.actions) {
        throw new Error("Cannot prerender pages with actions");
      }
    } else if (state.prerendering) {
      return new Response(void 0, {
        status: 204
      });
    }
    state.prerender_default = should_prerender;
    const fetched = [];
    if (get_option(nodes, "ssr") === false && !state.prerendering) {
      return await render_response({
        branch: [],
        fetched,
        page_config: {
          ssr: false,
          csr: get_option(nodes, "csr") ?? true
        },
        status,
        error: null,
        event,
        options: options2,
        manifest: manifest2,
        state,
        resolve_opts
      });
    }
    const branch = [];
    let load_error = null;
    const server_promises = nodes.map((node, i2) => {
      if (load_error) {
        throw load_error;
      }
      return Promise.resolve().then(async () => {
        try {
          if (node === leaf_node && action_result?.type === "error") {
            throw action_result.error;
          }
          return await load_server_data({
            event,
            state,
            node,
            parent: async () => {
              const data = {};
              for (let j = 0; j < i2; j += 1) {
                const parent = await server_promises[j];
                if (parent)
                  Object.assign(data, await parent.data);
              }
              return data;
            },
            track_server_fetches: options2.track_server_fetches
          });
        } catch (e3) {
          load_error = /** @type {Error} */
          e3;
          throw load_error;
        }
      });
    });
    const csr = get_option(nodes, "csr") ?? true;
    const load_promises = nodes.map((node, i2) => {
      if (load_error)
        throw load_error;
      return Promise.resolve().then(async () => {
        try {
          return await load_data({
            event,
            fetched,
            node,
            parent: async () => {
              const data = {};
              for (let j = 0; j < i2; j += 1) {
                Object.assign(data, await load_promises[j]);
              }
              return data;
            },
            resolve_opts,
            server_data_promise: server_promises[i2],
            state,
            csr
          });
        } catch (e3) {
          load_error = /** @type {Error} */
          e3;
          throw load_error;
        }
      });
    });
    for (const p of server_promises)
      p.catch(() => {
      });
    for (const p of load_promises)
      p.catch(() => {
      });
    for (let i2 = 0; i2 < nodes.length; i2 += 1) {
      const node = nodes[i2];
      if (node) {
        try {
          const server_data = await server_promises[i2];
          const data = await load_promises[i2];
          branch.push({ node, server_data, data });
        } catch (e3) {
          const err = normalize_error(e3);
          if (err instanceof Redirect) {
            if (state.prerendering && should_prerender_data) {
              const body = JSON.stringify({
                type: "redirect",
                location: err.location
              });
              state.prerendering.dependencies.set(data_pathname, {
                response: text(body),
                body
              });
            }
            return redirect_response(err.status, err.location);
          }
          const status2 = err instanceof HttpError ? err.status : 500;
          const error2 = await handle_error_and_jsonify(event, options2, err);
          while (i2--) {
            if (page2.errors[i2]) {
              const index8 = (
                /** @type {number} */
                page2.errors[i2]
              );
              const node2 = await manifest2._.nodes[index8]();
              let j = i2;
              while (!branch[j])
                j -= 1;
              return await render_response({
                event,
                options: options2,
                manifest: manifest2,
                state,
                resolve_opts,
                page_config: { ssr: true, csr: true },
                status: status2,
                error: error2,
                branch: compact(branch.slice(0, j + 1)).concat({
                  node: node2,
                  data: null,
                  server_data: null
                }),
                fetched
              });
            }
          }
          return static_error_page(options2, status2, error2.message);
        }
      } else {
        branch.push(null);
      }
    }
    if (state.prerendering && should_prerender_data) {
      let { data, chunks } = get_data_json(
        event,
        options2,
        branch.map((node) => node?.server_data)
      );
      if (chunks) {
        for await (const chunk of chunks) {
          data += chunk;
        }
      }
      state.prerendering.dependencies.set(data_pathname, {
        response: text(data),
        body: data
      });
    }
    return await render_response({
      event,
      options: options2,
      manifest: manifest2,
      state,
      resolve_opts,
      page_config: {
        csr: get_option(nodes, "csr") ?? true,
        ssr: get_option(nodes, "ssr") ?? true
      },
      status,
      error: null,
      branch: compact(branch),
      action_result,
      fetched
    });
  } catch (e3) {
    return await respond_with_error({
      event,
      options: options2,
      manifest: manifest2,
      state,
      status: 500,
      error: e3,
      resolve_opts
    });
  }
}
function deprecate_missing_path(opts, method) {
  if (opts.path === void 0) {
    warn_with_callsite(
      `Calling \`cookies.${method}(...)\` without specifying a \`path\` is deprecated, and will be disallowed in SvelteKit 2.0. Relative paths can be used`,
      1
    );
  }
  if (opts.path === "") {
    warn_with_callsite(
      `Calling \`cookies.${method}(...)\` with \`path: ''\` will behave differently in SvelteKit 2.0. Instead of using the browser default behaviour, it will set the cookie path to the current pathname`,
      1
    );
  }
}
function get_cookies(request, url, trailing_slash) {
  const header = request.headers.get("cookie") ?? "";
  const initial_cookies = (0, import_cookie.parse)(header, { decode: (value) => value });
  const normalized_url = normalize_path(url.pathname, trailing_slash);
  const default_path = normalized_url.split("/").slice(0, -1).join("/") || "/";
  const new_cookies = {};
  const defaults = {
    httpOnly: true,
    sameSite: "lax",
    secure: url.hostname === "localhost" && url.protocol === "http:" ? false : true
  };
  const cookies = {
    // The JSDoc param annotations appearing below for get, set and delete
    // are necessary to expose the `cookie` library types to
    // typescript users. `@type {import('@sveltejs/kit').Cookies}` above is not
    // sufficient to do so.
    /**
     * @param {string} name
     * @param {import('cookie').CookieParseOptions} opts
     */
    get(name, opts) {
      const c2 = new_cookies[name];
      if (c2 && domain_matches(url.hostname, c2.options.domain) && path_matches(url.pathname, c2.options.path)) {
        return c2.value;
      }
      const decoder = opts?.decode || decodeURIComponent;
      const req_cookies = (0, import_cookie.parse)(header, { decode: decoder });
      const cookie = req_cookies[name];
      return cookie;
    },
    /**
     * @param {import('cookie').CookieParseOptions} opts
     */
    getAll(opts) {
      const decoder = opts?.decode || decodeURIComponent;
      const cookies2 = (0, import_cookie.parse)(header, { decode: decoder });
      for (const c2 of Object.values(new_cookies)) {
        if (domain_matches(url.hostname, c2.options.domain) && path_matches(url.pathname, c2.options.path)) {
          cookies2[c2.name] = c2.value;
        }
      }
      return Object.entries(cookies2).map(([name, value]) => ({ name, value }));
    },
    /**
     * @param {string} name
     * @param {string} value
     * @param {import('cookie').CookieSerializeOptions} opts
     */
    set(name, value, opts = {}) {
      deprecate_missing_path(opts, "set");
      set_internal(name, value, { ...defaults, ...opts });
    },
    /**
     * @param {string} name
     * @param {import('cookie').CookieSerializeOptions} opts
     */
    delete(name, opts = {}) {
      deprecate_missing_path(opts, "delete");
      cookies.set(name, "", {
        path: default_path,
        // TODO 2.0 remove this
        ...opts,
        maxAge: 0
      });
    },
    /**
     * @param {string} name
     * @param {string} value
     * @param {import('cookie').CookieSerializeOptions} opts
     */
    serialize(name, value, opts = {}) {
      deprecate_missing_path(opts, "serialize");
      return (0, import_cookie.serialize)(name, value, {
        ...defaults,
        ...opts
      });
    }
  };
  function get_cookie_header(destination, header2) {
    const combined_cookies = {
      // cookies sent by the user agent have lowest precedence
      ...initial_cookies
    };
    for (const key2 in new_cookies) {
      const cookie = new_cookies[key2];
      if (!domain_matches(destination.hostname, cookie.options.domain))
        continue;
      if (!path_matches(destination.pathname, cookie.options.path))
        continue;
      const encoder22 = cookie.options.encode || encodeURIComponent;
      combined_cookies[cookie.name] = encoder22(cookie.value);
    }
    if (header2) {
      const parsed = (0, import_cookie.parse)(header2, { decode: (value) => value });
      for (const name in parsed) {
        combined_cookies[name] = parsed[name];
      }
    }
    return Object.entries(combined_cookies).map(([name, value]) => `${name}=${value}`).join("; ");
  }
  function set_internal(name, value, opts) {
    let path = opts.path;
    if (!opts.domain || opts.domain === url.hostname) {
      if (path) {
        if (path[0] === ".")
          path = resolve(url.pathname, path);
      } else {
        path = default_path;
      }
    }
    new_cookies[name] = {
      name,
      value,
      options: {
        ...opts,
        path
      }
    };
  }
  return { cookies, new_cookies, get_cookie_header, set_internal };
}
function domain_matches(hostname, constraint) {
  if (!constraint)
    return true;
  const normalized = constraint[0] === "." ? constraint.slice(1) : constraint;
  if (hostname === normalized)
    return true;
  return hostname.endsWith("." + normalized);
}
function path_matches(path, constraint) {
  if (!constraint)
    return true;
  const normalized = constraint.endsWith("/") ? constraint.slice(0, -1) : constraint;
  if (path === normalized)
    return true;
  return path.startsWith(normalized + "/");
}
function add_cookies_to_headers(headers, cookies) {
  for (const new_cookie of cookies) {
    const { name, value, options: options2 } = new_cookie;
    headers.append("set-cookie", (0, import_cookie.serialize)(name, value, options2));
  }
}
function create_fetch({ event, options: options2, manifest: manifest2, state, get_cookie_header, set_internal }) {
  const server_fetch = async (info, init2) => {
    const original_request = normalize_fetch_input(info, init2, event.url);
    let mode = (info instanceof Request ? info.mode : init2?.mode) ?? "cors";
    let credentials = (info instanceof Request ? info.credentials : init2?.credentials) ?? "same-origin";
    return options2.hooks.handleFetch({
      event,
      request: original_request,
      fetch: async (info2, init3) => {
        const request = normalize_fetch_input(info2, init3, event.url);
        const url = new URL(request.url);
        if (!request.headers.has("origin")) {
          request.headers.set("origin", event.url.origin);
        }
        if (info2 !== original_request) {
          mode = (info2 instanceof Request ? info2.mode : init3?.mode) ?? "cors";
          credentials = (info2 instanceof Request ? info2.credentials : init3?.credentials) ?? "same-origin";
        }
        if ((request.method === "GET" || request.method === "HEAD") && (mode === "no-cors" && url.origin !== event.url.origin || url.origin === event.url.origin)) {
          request.headers.delete("origin");
        }
        if (url.origin !== event.url.origin) {
          if (`.${url.hostname}`.endsWith(`.${event.url.hostname}`) && credentials !== "omit") {
            const cookie = get_cookie_header(url, request.headers.get("cookie"));
            if (cookie)
              request.headers.set("cookie", cookie);
          }
          return fetch(request);
        }
        const prefix = assets || base;
        const decoded = decodeURIComponent(url.pathname);
        const filename = (decoded.startsWith(prefix) ? decoded.slice(prefix.length) : decoded).slice(1);
        const filename_html = `${filename}/index.html`;
        const is_asset = manifest2.assets.has(filename);
        const is_asset_html = manifest2.assets.has(filename_html);
        if (is_asset || is_asset_html) {
          const file = is_asset ? filename : filename_html;
          if (state.read) {
            const type = is_asset ? manifest2.mimeTypes[filename.slice(filename.lastIndexOf("."))] : "text/html";
            return new Response(state.read(file), {
              headers: type ? { "content-type": type } : {}
            });
          }
          return await fetch(request);
        }
        if (credentials !== "omit") {
          const cookie = get_cookie_header(url, request.headers.get("cookie"));
          if (cookie) {
            request.headers.set("cookie", cookie);
          }
          const authorization = event.request.headers.get("authorization");
          if (authorization && !request.headers.has("authorization")) {
            request.headers.set("authorization", authorization);
          }
        }
        if (!request.headers.has("accept")) {
          request.headers.set("accept", "*/*");
        }
        if (!request.headers.has("accept-language")) {
          request.headers.set(
            "accept-language",
            /** @type {string} */
            event.request.headers.get("accept-language")
          );
        }
        const response = await respond(request, options2, manifest2, {
          ...state,
          depth: state.depth + 1
        });
        const set_cookie = response.headers.get("set-cookie");
        if (set_cookie) {
          for (const str2 of set_cookie_parser.splitCookiesString(set_cookie)) {
            const { name, value, ...options3 } = set_cookie_parser.parseString(str2);
            set_internal(
              name,
              value,
              /** @type {import('cookie').CookieSerializeOptions} */
              options3
            );
          }
        }
        return response;
      }
    });
  };
  return (input, init2) => {
    const response = server_fetch(input, init2);
    response.catch(() => {
    });
    return response;
  };
}
function normalize_fetch_input(info, init2, url) {
  if (info instanceof Request) {
    return info;
  }
  return new Request(typeof info === "string" ? new URL(info, url) : info, init2);
}
function validator(expected) {
  function validate(module, file) {
    if (!module)
      return;
    for (const key2 in module) {
      if (key2[0] === "_" || expected.has(key2))
        continue;
      const values = [...expected.values()];
      const hint = hint_for_supported_files(key2, file?.slice(file.lastIndexOf("."))) ?? `valid exports are ${values.join(", ")}, or anything with a '_' prefix`;
      throw new Error(`Invalid export '${key2}'${file ? ` in ${file}` : ""} (${hint})`);
    }
  }
  return validate;
}
function hint_for_supported_files(key2, ext = ".js") {
  const supported_files = [];
  if (valid_layout_exports.has(key2)) {
    supported_files.push(`+layout${ext}`);
  }
  if (valid_page_exports.has(key2)) {
    supported_files.push(`+page${ext}`);
  }
  if (valid_layout_server_exports.has(key2)) {
    supported_files.push(`+layout.server${ext}`);
  }
  if (valid_page_server_exports.has(key2)) {
    supported_files.push(`+page.server${ext}`);
  }
  if (valid_server_exports.has(key2)) {
    supported_files.push(`+server${ext}`);
  }
  if (supported_files.length > 0) {
    return `'${key2}' is a valid export in ${supported_files.slice(0, -1).join(", ")}${supported_files.length > 1 ? " or " : ""}${supported_files.at(-1)}`;
  }
}
var valid_layout_exports = /* @__PURE__ */ new Set([
  "load",
  "prerender",
  "csr",
  "ssr",
  "trailingSlash",
  "config"
]);
var valid_page_exports = /* @__PURE__ */ new Set([...valid_layout_exports, "entries"]);
var valid_layout_server_exports = /* @__PURE__ */ new Set([...valid_layout_exports]);
var valid_page_server_exports = /* @__PURE__ */ new Set([...valid_layout_server_exports, "actions", "entries"]);
var valid_server_exports = /* @__PURE__ */ new Set([
  "GET",
  "POST",
  "PATCH",
  "PUT",
  "DELETE",
  "OPTIONS",
  "HEAD",
  "fallback",
  "prerender",
  "trailingSlash",
  "config",
  "entries"
]);
var validate_layout_exports = validator(valid_layout_exports);
var validate_page_exports = validator(valid_page_exports);
var validate_layout_server_exports = validator(valid_layout_server_exports);
var validate_page_server_exports = validator(valid_page_server_exports);
var validate_server_exports = validator(valid_server_exports);
var default_transform = ({ html }) => html;
var default_filter = () => false;
var default_preload = ({ type }) => type === "js" || type === "css";
var page_methods = /* @__PURE__ */ new Set(["GET", "HEAD", "POST"]);
var allowed_page_methods = /* @__PURE__ */ new Set(["GET", "HEAD", "OPTIONS"]);
async function respond(request, options2, manifest2, state) {
  const url = new URL(request.url);
  if (options2.csrf_check_origin) {
    const forbidden = is_form_content_type(request) && (request.method === "POST" || request.method === "PUT" || request.method === "PATCH" || request.method === "DELETE") && request.headers.get("origin") !== url.origin;
    if (forbidden) {
      const csrf_error = error(403, `Cross-site ${request.method} form submissions are forbidden`);
      if (request.headers.get("accept") === "application/json") {
        return json(csrf_error.body, { status: csrf_error.status });
      }
      return text(csrf_error.body.message, { status: csrf_error.status });
    }
  }
  let decoded;
  try {
    decoded = decode_pathname(url.pathname);
  } catch {
    return text("Malformed URI", { status: 400 });
  }
  let route = null;
  let params = {};
  if (base && !state.prerendering?.fallback) {
    if (!decoded.startsWith(base)) {
      return text("Not found", { status: 404 });
    }
    decoded = decoded.slice(base.length) || "/";
  }
  const is_data_request = has_data_suffix(decoded);
  let invalidated_data_nodes;
  if (is_data_request) {
    decoded = strip_data_suffix(decoded) || "/";
    url.pathname = strip_data_suffix(url.pathname) + (url.searchParams.get(TRAILING_SLASH_PARAM) === "1" ? "/" : "") || "/";
    url.searchParams.delete(TRAILING_SLASH_PARAM);
    invalidated_data_nodes = url.searchParams.get(INVALIDATED_PARAM)?.split("").map((node) => node === "1");
    url.searchParams.delete(INVALIDATED_PARAM);
  }
  if (!state.prerendering?.fallback) {
    const matchers = await manifest2._.matchers();
    for (const candidate of manifest2._.routes) {
      const match = candidate.pattern.exec(decoded);
      if (!match)
        continue;
      const matched = exec(match, candidate.params, matchers);
      if (matched) {
        route = candidate;
        params = decode_params(matched);
        break;
      }
    }
  }
  let trailing_slash = void 0;
  const headers = {};
  let cookies_to_add = {};
  const event = {
    // @ts-expect-error `cookies` and `fetch` need to be created after the `event` itself
    cookies: null,
    // @ts-expect-error
    fetch: null,
    getClientAddress: state.getClientAddress || (() => {
      throw new Error(
        `${"@sveltejs/adapter-cloudflare"} does not specify getClientAddress. Please raise an issue`
      );
    }),
    locals: {},
    params,
    platform: state.platform,
    request,
    route: { id: route?.id ?? null },
    setHeaders: (new_headers) => {
      for (const key2 in new_headers) {
        const lower = key2.toLowerCase();
        const value = new_headers[key2];
        if (lower === "set-cookie") {
          throw new Error(
            "Use `event.cookies.set(name, value, options)` instead of `event.setHeaders` to set cookies"
          );
        } else if (lower in headers) {
          throw new Error(`"${key2}" header is already set`);
        } else {
          headers[lower] = value;
          if (state.prerendering && lower === "cache-control") {
            state.prerendering.cache = /** @type {string} */
            value;
          }
        }
      }
    },
    url,
    isDataRequest: is_data_request,
    isSubRequest: state.depth > 0
  };
  let resolve_opts = {
    transformPageChunk: default_transform,
    filterSerializedResponseHeaders: default_filter,
    preload: default_preload
  };
  try {
    if (route) {
      if (url.pathname === base || url.pathname === base + "/") {
        trailing_slash = "always";
      } else if (route.page) {
        const nodes = await Promise.all([
          // we use == here rather than === because [undefined] serializes as "[null]"
          ...route.page.layouts.map((n2) => n2 == void 0 ? n2 : manifest2._.nodes[n2]()),
          manifest2._.nodes[route.page.leaf]()
        ]);
        if (DEV)
          ;
        trailing_slash = get_option(nodes, "trailingSlash");
      } else if (route.endpoint) {
        const node = await route.endpoint();
        trailing_slash = node.trailingSlash;
        if (DEV)
          ;
      }
      if (!is_data_request) {
        const normalized = normalize_path(url.pathname, trailing_slash ?? "never");
        if (normalized !== url.pathname && !state.prerendering?.fallback) {
          return new Response(void 0, {
            status: 308,
            headers: {
              "x-sveltekit-normalize": "1",
              location: (
                // ensure paths starting with '//' are not treated as protocol-relative
                (normalized.startsWith("//") ? url.origin + normalized : normalized) + (url.search === "?" ? "" : url.search)
              )
            }
          });
        }
      }
    }
    const { cookies, new_cookies, get_cookie_header, set_internal } = get_cookies(
      request,
      url,
      trailing_slash ?? "never"
    );
    cookies_to_add = new_cookies;
    event.cookies = cookies;
    event.fetch = create_fetch({
      event,
      options: options2,
      manifest: manifest2,
      state,
      get_cookie_header,
      set_internal
    });
    if (state.prerendering && !state.prerendering.fallback)
      disable_search(url);
    const response = await options2.hooks.handle({
      event,
      resolve: (event2, opts) => resolve2(event2, opts).then((response2) => {
        for (const key2 in headers) {
          const value = headers[key2];
          response2.headers.set(
            key2,
            /** @type {string} */
            value
          );
        }
        add_cookies_to_headers(response2.headers, Object.values(cookies_to_add));
        if (state.prerendering && event2.route.id !== null) {
          response2.headers.set("x-sveltekit-routeid", encodeURI(event2.route.id));
        }
        return response2;
      })
    });
    if (response.status === 200 && response.headers.has("etag")) {
      let if_none_match_value = request.headers.get("if-none-match");
      if (if_none_match_value?.startsWith('W/"')) {
        if_none_match_value = if_none_match_value.substring(2);
      }
      const etag = (
        /** @type {string} */
        response.headers.get("etag")
      );
      if (if_none_match_value === etag) {
        const headers2 = new Headers({ etag });
        for (const key2 of [
          "cache-control",
          "content-location",
          "date",
          "expires",
          "vary",
          "set-cookie"
        ]) {
          const value = response.headers.get(key2);
          if (value)
            headers2.set(key2, value);
        }
        return new Response(void 0, {
          status: 304,
          headers: headers2
        });
      }
    }
    if (is_data_request && response.status >= 300 && response.status <= 308) {
      const location = response.headers.get("location");
      if (location) {
        return redirect_json_response(new Redirect(
          /** @type {any} */
          response.status,
          location
        ));
      }
    }
    return response;
  } catch (e3) {
    if (e3 instanceof Redirect) {
      const response = is_data_request ? redirect_json_response(e3) : route?.page && is_action_json_request(event) ? action_json_redirect(e3) : redirect_response(e3.status, e3.location);
      add_cookies_to_headers(response.headers, Object.values(cookies_to_add));
      return response;
    }
    return await handle_fatal_error(event, options2, e3);
  }
  async function resolve2(event2, opts) {
    try {
      if (opts) {
        if ("ssr" in opts) {
          throw new Error(
            "ssr has been removed, set it in the appropriate +layout.js instead. See the PR for more information: https://github.com/sveltejs/kit/pull/6197"
          );
        }
        resolve_opts = {
          transformPageChunk: opts.transformPageChunk || default_transform,
          filterSerializedResponseHeaders: opts.filterSerializedResponseHeaders || default_filter,
          preload: opts.preload || default_preload
        };
      }
      if (state.prerendering?.fallback) {
        return await render_response({
          event: event2,
          options: options2,
          manifest: manifest2,
          state,
          page_config: { ssr: false, csr: true },
          status: 200,
          error: null,
          branch: [],
          fetched: [],
          resolve_opts
        });
      }
      if (route) {
        const method = (
          /** @type {import('types').HttpMethod} */
          event2.request.method
        );
        let response;
        if (is_data_request) {
          response = await render_data(
            event2,
            route,
            options2,
            manifest2,
            state,
            invalidated_data_nodes,
            trailing_slash ?? "never"
          );
        } else if (route.endpoint && (!route.page || is_endpoint_request(event2))) {
          response = await render_endpoint(event2, await route.endpoint(), state);
        } else if (route.page) {
          if (page_methods.has(method)) {
            response = await render_page(event2, route.page, options2, manifest2, state, resolve_opts);
          } else {
            const allowed_methods2 = new Set(allowed_page_methods);
            const node = await manifest2._.nodes[route.page.leaf]();
            if (node?.server?.actions) {
              allowed_methods2.add("POST");
            }
            if (method === "OPTIONS") {
              response = new Response(null, {
                status: 204,
                headers: {
                  allow: Array.from(allowed_methods2.values()).join(", ")
                }
              });
            } else {
              const mod = [...allowed_methods2].reduce(
                (acc, curr) => {
                  acc[curr] = true;
                  return acc;
                },
                /** @type {Record<string, any>} */
                {}
              );
              response = method_not_allowed(mod, method);
            }
          }
        } else {
          throw new Error("This should never happen");
        }
        if (request.method === "GET" && route.page && route.endpoint) {
          const vary = response.headers.get("vary")?.split(",")?.map((v) => v.trim().toLowerCase());
          if (!(vary?.includes("accept") || vary?.includes("*"))) {
            response = new Response(response.body, {
              status: response.status,
              statusText: response.statusText,
              headers: new Headers(response.headers)
            });
            response.headers.append("Vary", "Accept");
          }
        }
        return response;
      }
      if (state.error && event2.isSubRequest) {
        return await fetch(request, {
          headers: {
            "x-sveltekit-error": "true"
          }
        });
      }
      if (state.error) {
        return text("Internal Server Error", {
          status: 500
        });
      }
      if (state.depth === 0) {
        return await respond_with_error({
          event: event2,
          options: options2,
          manifest: manifest2,
          state,
          status: 404,
          error: new NotFound(event2.url.pathname),
          resolve_opts
        });
      }
      if (state.prerendering) {
        return text("not found", { status: 404 });
      }
      return await fetch(request);
    } catch (e3) {
      return await handle_fatal_error(event2, options2, e3);
    } finally {
      event2.cookies.set = () => {
        throw new Error("Cannot use `cookies.set(...)` after the response has been generated");
      };
      event2.setHeaders = () => {
        throw new Error("Cannot use `setHeaders(...)` after the response has been generated");
      };
    }
  }
}
function filter_private_env(env, { public_prefix, private_prefix }) {
  return Object.fromEntries(
    Object.entries(env).filter(
      ([k]) => k.startsWith(private_prefix) && (public_prefix === "" || !k.startsWith(public_prefix))
    )
  );
}
function filter_public_env(env, { public_prefix, private_prefix }) {
  return Object.fromEntries(
    Object.entries(env).filter(
      ([k]) => k.startsWith(public_prefix) && (private_prefix === "" || !k.startsWith(private_prefix))
    )
  );
}
var Server = class {
  /** @type {import('types').SSROptions} */
  #options;
  /** @type {import('@sveltejs/kit').SSRManifest} */
  #manifest;
  /** @param {import('@sveltejs/kit').SSRManifest} manifest */
  constructor(manifest2) {
    this.#options = options;
    this.#manifest = manifest2;
  }
  /**
   * @param {{
   *   env: Record<string, string>
   * }} opts
   */
  async init({ env }) {
    set_private_env(
      filter_private_env(env, {
        public_prefix: this.#options.env_public_prefix,
        private_prefix: this.#options.env_private_prefix
      })
    );
    set_public_env(
      filter_public_env(env, {
        public_prefix: this.#options.env_public_prefix,
        private_prefix: this.#options.env_private_prefix
      })
    );
    if (!this.#options.hooks) {
      try {
        const module = await get_hooks();
        this.#options.hooks = {
          handle: module.handle || (({ event, resolve: resolve2 }) => resolve2(event)),
          handleError: module.handleError || (({ error: error2 }) => console.error(error2)),
          handleFetch: module.handleFetch || (({ request, fetch: fetch22 }) => fetch22(request))
        };
      } catch (error2) {
        {
          throw error2;
        }
      }
    }
  }
  /**
   * @param {Request} request
   * @param {import('types').RequestOptions} options
   */
  async respond(request, options2) {
    if (!(request instanceof Request)) {
      throw new Error(
        "The first argument to server.respond must be a Request object. See https://github.com/sveltejs/kit/pull/3384 for details"
      );
    }
    return respond(request, this.#options, this.#manifest, {
      ...options2,
      error: false,
      depth: 0
    });
  }
};

// .svelte-kit/cloudflare-tmp/manifest.js
var manifest = (() => {
  function __memo(fn) {
    let value;
    return () => value ??= value = fn();
  }
  return {
    appDir: "_app",
    appPath: "_app",
    assets: /* @__PURE__ */ new Set(["bacteria_images/img1.png", "bacteria_images/img2.png", "bacteria_images/img3.png", "bacteria_images/img4.png", "favicon.png", "favicon_old.png", "logo.png", "websitedemo.png"]),
    mimeTypes: { ".png": "image/png" },
    _: {
      client: { "start": "_app/immutable/entry/start.f4aab951.js", "app": "_app/immutable/entry/app.d1b549b6.js", "imports": ["_app/immutable/entry/start.f4aab951.js", "_app/immutable/chunks/scheduler.b62641ca.js", "_app/immutable/chunks/singletons.ad51fe39.js", "_app/immutable/entry/app.d1b549b6.js", "_app/immutable/chunks/scheduler.b62641ca.js", "_app/immutable/chunks/index.91daa77f.js"], "stylesheets": [], "fonts": [] },
      nodes: [
        __memo(() => Promise.resolve().then(() => (init__(), __exports))),
        __memo(() => Promise.resolve().then(() => (init__2(), __exports2))),
        __memo(() => Promise.resolve().then(() => (init__3(), __exports3))),
        __memo(() => Promise.resolve().then(() => (init__4(), __exports4))),
        __memo(() => Promise.resolve().then(() => (init__5(), __exports5))),
        __memo(() => Promise.resolve().then(() => (init__6(), __exports6))),
        __memo(() => Promise.resolve().then(() => (init__7(), __exports7)))
      ],
      routes: [
        {
          id: "/",
          pattern: /^\/$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 2 },
          endpoint: null
        },
        {
          id: "/about",
          pattern: /^\/about\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 3 },
          endpoint: null
        },
        {
          id: "/api/auth",
          pattern: /^\/api\/auth\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server(), server_exports)))
        },
        {
          id: "/api/credits/get",
          pattern: /^\/api\/credits\/get\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server2(), server_exports2)))
        },
        {
          id: "/api/message/create",
          pattern: /^\/api\/message\/create\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server3(), server_exports3)))
        },
        {
          id: "/api/message/list",
          pattern: /^\/api\/message\/list\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server4(), server_exports4)))
        },
        {
          id: "/api/run/create",
          pattern: /^\/api\/run\/create\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server5(), server_exports5)))
        },
        {
          id: "/api/run/retrieve",
          pattern: /^\/api\/run\/retrieve\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server6(), server_exports6)))
        },
        {
          id: "/api/thread/create",
          pattern: /^\/api\/thread\/create\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server7(), server_exports7)))
        },
        {
          id: "/api/thread/delete",
          pattern: /^\/api\/thread\/delete\/?$/,
          params: [],
          page: null,
          endpoint: __memo(() => Promise.resolve().then(() => (init_server8(), server_exports8)))
        },
        {
          id: "/auth",
          pattern: /^\/auth\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 4 },
          endpoint: null
        },
        {
          id: "/home",
          pattern: /^\/home\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 5 },
          endpoint: null
        },
        {
          id: "/logout",
          pattern: /^\/logout\/?$/,
          params: [],
          page: { layouts: [0], errors: [1], leaf: 6 },
          endpoint: null
        }
      ],
      matchers: async () => {
        return {};
      }
    }
  };
})();
var prerendered = /* @__PURE__ */ new Set([]);

// .svelte-kit/cloudflare-tmp/_worker.js
async function e2(e3, t22) {
  let n2 = "string" != typeof t22 && "HEAD" === t22.method;
  n2 && (t22 = new Request(t22, { method: "GET" }));
  let r3 = await e3.match(t22);
  return n2 && r3 && (r3 = new Response(null, r3)), r3;
}
function t2(e3, t22, n2, o2) {
  return ("string" == typeof t22 || "GET" === t22.method) && r(n2) && (n2.headers.has("Set-Cookie") && (n2 = new Response(n2.body, n2)).headers.append("Cache-Control", "private=Set-Cookie"), o2.waitUntil(e3.put(t22, n2.clone()))), n2;
}
var n = /* @__PURE__ */ new Set([200, 203, 204, 300, 301, 404, 405, 410, 414, 501]);
function r(e3) {
  if (!n.has(e3.status))
    return false;
  if (~(e3.headers.get("Vary") || "").indexOf("*"))
    return false;
  let t22 = e3.headers.get("Cache-Control") || "";
  return !/(private|no-cache|no-store)/i.test(t22);
}
function o(n2) {
  return async function(r3, o2) {
    let a = await e2(n2, r3);
    if (a)
      return a;
    o2.defer((e3) => {
      t2(n2, r3, e3, o2);
    });
  };
}
var s3 = caches.default;
var c = t2.bind(0, s3);
var r2 = e2.bind(0, s3);
var e22 = o.bind(0, s3);
var server = new Server(manifest);
var worker = {
  async fetch(req, env, context) {
    await server.init({ env });
    let pragma = req.headers.get("cache-control") || "";
    let res = !pragma.includes("no-cache") && await r2(req);
    if (res)
      return res;
    let { pathname } = new URL(req.url);
    try {
      pathname = decodeURIComponent(pathname);
    } catch {
    }
    const stripped_pathname = pathname.replace(/\/$/, "");
    let is_static_asset = false;
    const filename = stripped_pathname.substring(1);
    if (filename) {
      is_static_asset = manifest.assets.has(filename) || manifest.assets.has(filename + "/index.html");
    }
    const location = pathname.at(-1) === "/" ? stripped_pathname : pathname + "/";
    if (is_static_asset || prerendered.has(pathname)) {
      res = await env.ASSETS.fetch(req);
    } else if (location && prerendered.has(location)) {
      res = new Response("", {
        status: 308,
        headers: {
          location
        }
      });
    } else {
      res = await server.respond(req, {
        // @ts-ignore
        platform: { env, context, caches, cf: req.cf },
        getClientAddress() {
          return req.headers.get("cf-connecting-ip");
        }
      });
    }
    pragma = res.headers.get("cache-control") || "";
    return pragma && res.status < 400 ? c(req, res, context) : res;
  }
};
var worker_default = worker;
export {
  worker_default as default
};
/*! Bundled license information:

cookie/index.js:
  (*!
   * cookie
   * Copyright(c) 2012-2014 Roman Shtylman
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
//# sourceMappingURL=_worker.js.map
