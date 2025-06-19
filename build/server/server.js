"use strict";
(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
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

  // node_modules/.pnpm/@communityox+oxmysql@1.4.3/node_modules/@communityox/oxmysql/MySQL.js
  var require_MySQL = __commonJS({
    "node_modules/.pnpm/@communityox+oxmysql@1.4.3/node_modules/@communityox/oxmysql/MySQL.js"(exports2) {
      "use strict";
      Object.defineProperty(exports2, "__esModule", { value: true });
      exports2.oxmysql = void 0;
      var QueryStore = [];
      function assert(condition, message) {
        if (!condition)
          throw new TypeError(message);
      }
      var safeArgs = (query, params, cb, transaction) => {
        if (typeof query === "number") {
          query = QueryStore[query];
          assert(typeof query === "string", "First argument received invalid query store reference");
        }
        if (transaction) {
          assert(typeof query === "object", `First argument expected object, recieved ${typeof query}`);
        } else {
          assert(typeof query === "string", `First argument expected string, received ${typeof query}`);
        }
        if (params) {
          const paramType = typeof params;
          assert(paramType === "object" || paramType === "function", `Second argument expected object or function, received ${paramType}`);
          if (!cb && paramType === "function") {
            cb = params;
            params = void 0;
          }
        }
        if (cb !== void 0)
          assert(typeof cb === "function", `Third argument expected function, received ${typeof cb}`);
        return [query, params, cb];
      };
      var exp = global.exports.oxmysql;
      var currentResourceName = GetCurrentResourceName();
      function execute(method, query, params) {
        return new Promise((resolve, reject) => {
          exp[method](query, params, (result, error) => {
            if (error)
              return reject(error);
            resolve(result);
          }, currentResourceName, true);
        });
      }
      exports2.oxmysql = {
        store(query) {
          assert(typeof query !== "string", `Query expects a string, received ${typeof query}`);
          return QueryStore.push(query);
        },
        ready(callback) {
          setImmediate(async () => {
            while (GetResourceState("oxmysql") !== "started")
              await new Promise((resolve) => setTimeout(resolve, 50, null));
            callback();
          });
        },
        async query(query, params, cb) {
          [query, params, cb] = safeArgs(query, params, cb);
          const result = await execute("query", query, params);
          return cb ? cb(result) : result;
        },
        async single(query, params, cb) {
          [query, params, cb] = safeArgs(query, params, cb);
          const result = await execute("single", query, params);
          return cb ? cb(result) : result;
        },
        async scalar(query, params, cb) {
          [query, params, cb] = safeArgs(query, params, cb);
          const result = await execute("scalar", query, params);
          return cb ? cb(result) : result;
        },
        async update(query, params, cb) {
          [query, params, cb] = safeArgs(query, params, cb);
          const result = await execute("update", query, params);
          return cb ? cb(result) : result;
        },
        async insert(query, params, cb) {
          [query, params, cb] = safeArgs(query, params, cb);
          const result = await execute("insert", query, params);
          return cb ? cb(result) : result;
        },
        async prepare(query, params, cb) {
          [query, params, cb] = safeArgs(query, params, cb);
          const result = await execute("prepare", query, params);
          return cb ? cb(result) : result;
        },
        async rawExecute(query, params, cb) {
          [query, params, cb] = safeArgs(query, params, cb);
          const result = await execute("rawExecute", query, params);
          return cb ? cb(result) : result;
        },
        async transaction(query, params, cb) {
          [query, params, cb] = safeArgs(query, params, cb, true);
          const result = await execute("transaction", query, params);
          return cb ? cb(result) : result;
        },
        isReady() {
          return exp.isReady();
        },
        async awaitConnection() {
          return await exp.awaitConnection();
        },
        async startTransaction(cb) {
          return exp.startTransaction(cb, currentResourceName);
        }
      };
    }
  });

  // node_modules/.pnpm/@communityox+ox_lib@3.30.10/node_modules/@communityox/ox_lib/shared/resource/cache/index.js
  var cacheEvents = {};
  var cache = new Proxy({
    resource: GetCurrentResourceName(),
    game: GetGameName()
  }, {
    get(target, key) {
      const result = key ? target[key] : target;
      if (result !== void 0)
        return result;
      cacheEvents[key] = [];
      AddEventHandler(`ox_lib:cache:${key}`, (value) => {
        const oldValue = target[key];
        const events = cacheEvents[key];
        events.forEach((cb) => cb(value, oldValue));
        target[key] = value;
      });
      target[key] = exports.ox_lib.cache(key) || false;
      return target[key];
    }
  });

  // node_modules/.pnpm/@communityox+ox_lib@3.30.10/node_modules/@communityox/ox_lib/server/resource/callback/index.js
  var pendingCallbacks = {};
  var callbackTimeout = GetConvarInt("ox:callbackTimeout", 3e5);
  onNet(`__ox_cb_${cache.resource}`, (key, ...args) => {
    const resolve = pendingCallbacks[key];
    if (!resolve)
      return;
    delete pendingCallbacks[key];
    resolve(...args);
  });
  function onClientCallback(eventName, cb) {
    exports.ox_lib.setValidCallback(eventName, true);
    onNet(`__ox_cb_${eventName}`, async (resource, key, ...args) => {
      const src = source;
      let response;
      try {
        response = await cb(src, ...args);
      } catch (e) {
        console.error(`an error occurred while handling callback event ${eventName}`);
        console.log(`^3${e.stack}^0`);
      }
      emitNet(`__ox_cb_${resource}`, src, key, response);
    });
  }

  // src/server/server.ts
  var import_oxmysql = __toESM(require_MySQL());
  onClientCallback("rk_experimental:submitReport", async (playerId, yourName, phoneNumber, incidentDescription) => {
    try {
      await import_oxmysql.oxmysql.insert("INSERT INTO reports (your_name, phone_number, incident_description) VALUES (?, ?, ?)", [
        yourName,
        phoneNumber,
        incidentDescription
      ]);
      return {
        success: true,
        message: "Report submitted successfully"
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to submit report"
      };
    }
  });
  onClientCallback("rk_experimental:getReports", async (playerId) => {
    try {
      if (!IsPlayerAceAllowed(playerId, "police.reports")) {
        return null;
      }
      const reports = await import_oxmysql.oxmysql.query("SELECT * FROM reports ORDER BY created_at DESC");
      return reports;
    } catch (error) {
      return null;
    }
  });
  onClientCallback("rk_experimental:deleteReport", async (playerId, reportId) => {
    try {
      if (!IsPlayerAceAllowed(playerId, "police.reports")) {
        return { success: false, message: "No permission" };
      }
      await import_oxmysql.oxmysql.query("DELETE FROM reports WHERE id = ?", [reportId]);
      return {
        success: true,
        message: "Report deleted successfully"
      };
    } catch (error) {
      return {
        success: false,
        message: "Failed to delete report"
      };
    }
  });
})();
