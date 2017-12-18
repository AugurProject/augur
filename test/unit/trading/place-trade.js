/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();

describe("trading/place-trade", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var placeTrade = proxyquire("../../../src/trading/place-trade", {
        "./get-better-worse-orders": t.mock.getBetterWorseOrders,
        "./trade-until-amount-is-zero": t.mock.tradeUntilAmountIsZero,
        "../api": t.mock.api,
      });
      placeTrade(Object.assign({}, t.params, {
        onSuccess: function (res) {
          t.params.onSuccess(res);
          done();
        },
      }));
    });
  };
  test({
    description: "immediate fill -> trade until amount is zero",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      amount: "10",
      limitPrice: "2",
      minPrice: "1",
      maxPrice: "3",
      tickSize: "0.0001",
      _direction: 0,
      _market: "MARKET_ADDRESS",
      _outcome: 2,
      _tradeGroupId: "0x1",
      doNotCreateOrders: false,
      onSent: function (res) {
        assert.strictEqual(res.hash, "TRANSACTION_HASH");
      },
      onSuccess: function (res) {
        assert.strictEqual(res.hash, "TRANSACTION_HASH");
      },
      onFailed: function (err) {
        throw new Error(err);
      },
    },
    mock: {
      getBetterWorseOrders: function (p, callback) {
        assert.deepEqual(p, {
          marketID: "MARKET_ADDRESS",
          orderType: "buy",
          outcome: 2,
          price: "0.5",
        });
        callback(null, { immediateFill: true });
      },
      tradeUntilAmountIsZero: function (p) {
        assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
        assert.strictEqual(p.meta.accountType, "privateKey");
        assert.strictEqual(p._direction, 0);
        assert.strictEqual(p._market, "MARKET_ADDRESS");
        assert.strictEqual(p._outcome, 2);
        assert.strictEqual(p._fxpAmount, "10");
        assert.strictEqual(p._price, "0.5");
        assert.strictEqual(p._tradeGroupId, "0x1");
        assert.isFunction(p.onSent);
        assert.isFunction(p.onSuccess);
        assert.isFunction(p.onFailed);
        p.onSent({ hash: "TRANSACTION_HASH" });
        p.onSuccess({ hash: "TRANSACTION_HASH" });
      },
      api: function () {
        return {
          CreateOrder: {
            publicCreateOrder: function (/*p*/) {
              assert.fail();
            },
          },
        };
      },
    },
  });
  test({
    description: "no immediate fill -> create order",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      amount: "10",
      limitPrice: "2",
      minPrice: "1",
      maxPrice: "3",
      tickSize: "0.0001",
      _direction: 0,
      _market: "MARKET_ADDRESS",
      _outcome: 2,
      _tradeGroupId: "0x1",
      doNotCreateOrders: false,
      onSent: function (res) {
        assert.strictEqual(res.hash, "TRANSACTION_HASH");
      },
      onSuccess: function (res) {
        assert.strictEqual(res.hash, "TRANSACTION_HASH");
      },
      onFailed: function (err) {
        throw new Error(err);
      },
    },
    mock: {
      getBetterWorseOrders: function (p, callback) {
        assert.deepEqual(p, {
          marketID: "MARKET_ADDRESS",
          outcome: 2,
          orderType: "buy",
          price: "0.5",
        });
        callback(null, { betterOrderID: "BETTER_ORDER_ID", worseOrderID: "WORSE_ORDER_ID" });
      },
      tradeUntilAmountIsZero: function (p) {
        assert.strictEqual(p._betterOrderID, "BETTER_ORDER_ID");
        assert.strictEqual(p._worseOrderID, "WORSE_ORDER_ID");

        p.onSent({ hash: "TRANSACTION_HASH" });
        p.onSuccess({ hash: "TRANSACTION_HASH" });
      },
      api: function () {
        return {
          CreateOrder: {
            publicCreateOrder: function (p) {
              assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
              assert.strictEqual(p.meta.accountType, "privateKey");
              assert.strictEqual(p._type, 0);
              assert.strictEqual(p._market, "MARKET_ADDRESS");
              assert.strictEqual(p._outcome, 2);
              assert.strictEqual(p._attoshares, "0x38d7ea4c68000");
              assert.strictEqual(p._displayPrice, "0x2710");
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
});
