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
    description: "trade until amount is zero, without better/worse",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      amount: "10",
      sharesProvided: "0",
      limitPrice: "2",
      minPrice: "1",
      maxPrice: "3",
      numTicks: "10000",
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
          marketId: "MARKET_ADDRESS",
          orderType: "buy",
          outcome: 2,
          price: "2",
        });
        callback(null, { betterOrderId: null, worseOrderId: null });
      },
      tradeUntilAmountIsZero: function (p) {
        assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
        assert.strictEqual(p.meta.accountType, "privateKey");
        assert.strictEqual(p._direction, 0);
        assert.strictEqual(p._market, "MARKET_ADDRESS");
        assert.strictEqual(p._outcome, 2);
        assert.strictEqual(p._fxpAmount, "10");
        assert.strictEqual(p._price, "2");
        assert.strictEqual(p._tradeGroupId, "0x1");
        assert.strictEqual(p._betterOrderId, "0x0");
        assert.strictEqual(p._worseOrderId, "0x0");
        assert.isFunction(p.onSent);
        assert.isFunction(p.onSuccess);
        assert.isFunction(p.onFailed);
        p.onSent({ hash: "TRANSACTION_HASH" });
        p.onSuccess({ hash: "TRANSACTION_HASH" });
      },
    },
  });
  test({
    description: "trade until amount is zero, with better/worse",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      amount: "10",
      sharesProvided: "0",
      limitPrice: "2",
      minPrice: "1",
      maxPrice: "3",
      numTicks: "10000",
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
          marketId: "MARKET_ADDRESS",
          outcome: 2,
          orderType: "buy",
          price: "2",
        });
        callback(null, { betterOrderId: "BETTER_ORDER_ID", worseOrderId: "WORSE_ORDER_ID" });
      },
      tradeUntilAmountIsZero: function (p) {
        assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
        assert.strictEqual(p.meta.accountType, "privateKey");
        assert.strictEqual(p._direction, 0);
        assert.strictEqual(p._market, "MARKET_ADDRESS");
        assert.strictEqual(p._outcome, 2);
        assert.strictEqual(p._fxpAmount, "10");
        assert.strictEqual(p._price, "2");
        assert.strictEqual(p._tradeGroupId, "0x1");
        assert.strictEqual(p._betterOrderId, "BETTER_ORDER_ID");
        assert.strictEqual(p._worseOrderId, "WORSE_ORDER_ID");
        p.onSent({ hash: "TRANSACTION_HASH" });
        p.onSuccess({ hash: "TRANSACTION_HASH" });
      },
    },
  });
});
