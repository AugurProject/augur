/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();

var counter = 0;

describe("trading/trade-until-amount-is-zero", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var tradeUntilAmountIsZero = proxyquire("../../../src/trading/trade-until-amount-is-zero", {
        "./get-trade-amount-remaining": t.mock.getTradeAmountRemaining,
        "../api": t.mock.api,
      });
      tradeUntilAmountIsZero(Object.assign({}, t.params, {
        onSuccess: function (res) {
          t.params.onSuccess(res);
          done();
        },
      }));
    });
  };
  test({
    description: "buy 10 outcome 2 @ 0.5",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      _direction: 0,
      _market: "MARKET_ADDRESS",
      _outcome: 2,
      _fxpAmount: "10",
      _price: "0.5",
      numTicks: "10000",
      tickSize: "0.0001",
      _tradeGroupId: "0x1",
      doNotCreateOrders: false,
      onSent: function (res) {
        assert.strictEqual(res.hash, "TRANSACTION_HASH");
      },
      onSuccess: function (res) {
        assert.isNull(res);
      },
      onFailed: function (err) {
        throw new Error(err);
      },
    },
    mock: {
      getTradeAmountRemaining: function (p, callback) {
        callback(null, "0");
      },
      api: function () {
        return {
          Trade: {
            publicTakeBestOrder: function () {
              assert.fail();
            },
            publicTrade: function (p) {
              assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
              assert.strictEqual(p.meta.accountType, "privateKey");
              assert.strictEqual(p._direction, 0);
              assert.strictEqual(p._market, "MARKET_ADDRESS");
              assert.strictEqual(p._outcome, 2);
              assert.strictEqual(p._fxpAmount, "0x38d7ea4c68000");
              assert.strictEqual(p._price, "0x1388");
              assert.strictEqual(p._tradeGroupId, "0x1");
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              p.onSent({ hash: "TRANSACTION_HASH" });
              p.onSuccess({ hash: "TRANSACTION_HASH" });
            },
          },
        };
      },
    },
  });
  test({
    description: "buy 10 outcome 2 @ 0.5 (3 remaining)",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      _direction: 0,
      _market: "MARKET_ADDRESS",
      _outcome: 2,
      _fxpAmount: "10",
      _price: "0.5",
      numTicks: "10000",
      tickSize: "0.0001",
      _tradeGroupId: "0x1",
      doNotCreateOrders: false,
      onSent: function (res) {
        assert.strictEqual(res.hash, "TRANSACTION_HASH_1");
      },
      onSuccess: function (res) {
        assert.isNull(res);
        assert.strictEqual(counter, 2);
      },
      onFailed: function (err) {
        throw new Error(err);
      },
    },
    mock: {
      getTradeAmountRemaining: function (p, callback) {
        if (p.transactionHash === "TRANSACTION_HASH_1") {
          callback(null, "300000000000000");
        } else {
          callback(null, "0");
        }
      },
      api: function () {
        return {
          Trade: {
            publicTakeBestOrder: function () {
              assert.fail();
            },
            publicTrade: function (p) {
              assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
              assert.strictEqual(p.meta.accountType, "privateKey");
              assert.strictEqual(p._direction, 0);
              assert.strictEqual(p._market, "MARKET_ADDRESS");
              assert.strictEqual(p._outcome, 2);
              console.log("amount:", p._fxpAmount);
              assert.oneOf(p._fxpAmount, ["0x38d7ea4c68000", "0x110d9316ec000"]);
              assert.strictEqual(p._price, "0x1388");
              assert.strictEqual(p._tradeGroupId, "0x1");
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              if (p._fxpAmount === "0x38d7ea4c68000") {
                assert.strictEqual(counter, 0);
                counter++;
                p.onSent({ hash: "TRANSACTION_HASH_1" });
                p.onSuccess({ hash: "TRANSACTION_HASH_1" });
              } else {
                assert.strictEqual(counter, 1);
                counter++;
                p.onSent({ hash: "TRANSACTION_HASH_2" });
                p.onSuccess({ hash: "TRANSACTION_HASH_2" });
              }
            },
          },
        };
      },
    },
  });
  test({
    description: "sell 10 outcome 2 @ 0.5",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      _direction: 1,
      _market: "MARKET_ADDRESS",
      _outcome: 2,
      _fxpAmount: "10",
      _price: "0.5",
      numTicks: "10000",
      tickSize: "0.0001",
      _tradeGroupId: "0x1",
      doNotCreateOrders: false,
      onSent: function (res) {
        assert.strictEqual(res.hash, "TRANSACTION_HASH");
      },
      onSuccess: function (res) {
        assert.isNull(res);
      },
      onFailed: function (err) {
        throw new Error(err);
      },
    },
    mock: {
      getTradeAmountRemaining: function (p, callback) {
        callback(null, "0");
      },
      api: function () {
        return {
          Trade: {
            publicTakeBestOrder: function () {
              assert.fail();
            },
            publicTrade: function (p) {
              assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
              assert.strictEqual(p.meta.accountType, "privateKey");
              assert.strictEqual(p._direction, 1);
              assert.strictEqual(p._market, "MARKET_ADDRESS");
              assert.strictEqual(p._outcome, 2);
              assert.strictEqual(p._fxpAmount, "0x38d7ea4c68000");
              assert.strictEqual(p._price, "0x1388");
              assert.strictEqual(p._tradeGroupId, "0x1");
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              p.onSent({ hash: "TRANSACTION_HASH" });
              p.onSuccess({ hash: "TRANSACTION_HASH" });
            },
          },
        };
      },
    },
  });
  test({
    description: "close position (take-only) 10 outcome 2 @ 0.5",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      _direction: 1,
      _market: "MARKET_ADDRESS",
      _outcome: 2,
      _fxpAmount: "10",
      _price: "0.5",
      numTicks: "10000",
      tickSize: "0.0001",
      _tradeGroupId: "0x1",
      doNotCreateOrders: true,
      onSent: function (res) {
        assert.strictEqual(res.hash, "TRANSACTION_HASH");
      },
      onSuccess: function (res) {
        assert.isNull(res);
      },
      onFailed: function (err) {
        throw new Error(err);
      },
    },
    mock: {
      getTradeAmountRemaining: function (p, callback) {
        callback(null, "0");
      },
      api: function () {
        return {
          Trade: {
            publicTakeBestOrder: function (p) {
              assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
              assert.strictEqual(p.meta.accountType, "privateKey");
              assert.strictEqual(p._direction, 1);
              assert.strictEqual(p._market, "MARKET_ADDRESS");
              assert.strictEqual(p._outcome, 2);
              assert.strictEqual(p._fxpAmount, "0x38d7ea4c68000");
              assert.strictEqual(p._price, "0x1388");
              assert.strictEqual(p._tradeGroupId, "0x1");
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              p.onSent({ hash: "TRANSACTION_HASH" });
              p.onSuccess({ hash: "TRANSACTION_HASH" });
            },
            publicTrade: function () {
              assert.fail();
            },
          },
        };
      },
    },
  });
});
