/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var assign = require("lodash").assign;
var proxyquire = require("proxyquire").noPreserveCache();
var noop = require("../../../src/utils/noop");

describe("reporting/finalize-market", function () {
  var test = function (t) {
    it(t.description, function () {
      var finalizeMarket = proxyquire("../../../src/reporting/finalize-market", {
        "../api": t.mock.api,
      });
      finalizeMarket(assign(t.params, {
        onSent: noop,
        onSuccess: t.assertions,
        onFailed: t.assertions,
      }));
    });
  };
  test({
    description: "market already finalized",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      market: "MARKET_CONTRACT_ADDRESS",
    },
    mock: {
      api: function () {
        return {
          Market: {
            isFinalized: function (payload, callback) {
              assert.deepEqual(payload, { tx: { to: "MARKET_CONTRACT_ADDRESS" } });
              callback(null, "0x1");
            },
            finalize: function () {
              assert.fail();
            },
          },
        };
      },
    },
    assertions: function (output) {
      assert.isTrue(output);
    },
  });
  test({
    description: "market is not ready to finalize",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      market: "MARKET_CONTRACT_ADDRESS",
    },
    mock: {
      api: function () {
        return {
          Market: {
            isFinalized: function (payload, callback) {
              assert.deepEqual(payload, { tx: { to: "MARKET_CONTRACT_ADDRESS" } });
              callback(null, "0x0");
            },
            finalize: function (payload, callback) {
              assert.deepEqual(payload.tx, { to: "MARKET_CONTRACT_ADDRESS", send: false });
              callback(null, "0x0");
            },
          },
        };
      },
    },
    assertions: function (output) {
      assert.isFalse(output);
    },
  });
  test({
    description: "finalize market",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      market: "MARKET_CONTRACT_ADDRESS",
    },
    mock: {
      api: function () {
        return {
          Market: {
            isFinalized: function (payload, callback) {
              assert.deepEqual(payload, { tx: { to: "MARKET_CONTRACT_ADDRESS" } });
              callback(null, "0x0");
            },
            finalize: function (payload, callback) {
              assert.strictEqual(payload.tx.to, "MARKET_CONTRACT_ADDRESS");
              if (payload.tx.send === false) return callback(null, true);
              assert.strictEqual(payload.meta.signer.toString("utf8"), "PRIVATE_KEY");
              assert.isFunction(payload.onSent);
              assert.isFunction(payload.onSuccess);
              assert.isFunction(payload.onFailed);
              payload.onSuccess({ callReturn: "TRY_FINALIZE" });
            },
          },
        };
      },
    },
    assertions: function (output) {
      assert.deepEqual(output, { callReturn: "TRY_FINALIZE" });
    },
  });
});
