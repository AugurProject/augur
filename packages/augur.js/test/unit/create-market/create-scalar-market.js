/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();

describe("create-market/create-scalar-market", function () {
  var extraInfo = {
    longDescription: "One Market to rule them all, One Market to bind them, One Market to bring them all, and in the darkness bind them.",
    tags: ["Ancient evil", "Large flaming eyes"],
  };
  var test = function (t) {
    it(t.description, function (done) {
      var createScalarMarket = proxyquire("../../../src/create-market/create-scalar-market", {
        "./get-market-creation-cost": t.stub.getMarketCreationCost,
        "./get-market-from-create-market-receipt": t.stub.getMarketFromCreateMarketReceipt,
        "../api": t.stub.api,
      });
      createScalarMarket(Object.assign({}, t.params, {
        onSuccess: function (res) {
          t.params.onSuccess(res);
          done();
        },
      }));
    });
  };
  test({
    description: "create a scalar market",
    params: {
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
      universe: "UNIVERSE_ADDRESS",
      _endTime: 2345678901,
      _description: "Will this market be the One Market?",
      _minPrice: "-2",
      _maxPrice: "15.6",
      _feePerEthInWei: "0x4321",
      _denominationToken: "TOKEN_ADDRESS",
      _designatedReporterAddress: "DESIGNATED_REPORTER_ADDRESS",
      _topic: "TOPIC",
      _extraInfo: extraInfo,
      onSent: function (res) {
        assert.deepEqual(res, { hash: "TRANSACTION_HASH", callReturn: null });
      },
      onSuccess: function (res) {
        assert.deepEqual(res, { hash: "TRANSACTION_HASH", callReturn: "MARKET_ADDRESS" });
      },
      onFailed: function (err) {
        throw new Error(err);
      },
    },
    stub: {
      getMarketCreationCost: function (p, callback) {
        assert.strictEqual(p.universe, "UNIVERSE_ADDRESS");
        callback(null, { etherRequiredToCreateMarket: "1.1" });
      },
      getMarketFromCreateMarketReceipt: function (transactionHash, callback) {
        assert.strictEqual(transactionHash, "TRANSACTION_HASH");
        callback(null, "MARKET_ADDRESS");
      },
      api: function () {
        return {
          Universe: {
            createScalarMarket: function (p) {
              assert.deepEqual(p.tx, {
                to: "UNIVERSE_ADDRESS",
                value: "0xf43fc2c04ee0000",
              });
              assert.strictEqual(p._endTime, 2345678901);
              assert.strictEqual(p._feePerEthInWei, "0x4321");
              assert.strictEqual(p._denominationToken, "TOKEN_ADDRESS");
              assert.strictEqual(p._designatedReporterAddress, "DESIGNATED_REPORTER_ADDRESS");
              assert.strictEqual(p._topic, "0x544f504943000000000000000000000000000000000000000000000000000000");
              assert.deepEqual(JSON.parse(p._extraInfo), extraInfo);
              assert.strictEqual(p._description, "Will this market be the One Market?");
              assert.strictEqual(p._numTicks, "0x2af80");
              assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
              assert.strictEqual(p.meta.accountType, "privateKey");
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              p.onSent({ hash: "TRANSACTION_HASH", callReturn: null });
              p.onSuccess({ hash: "TRANSACTION_HASH", callReturn: null });
            },
          },
        };
      },
    },
  });
});
