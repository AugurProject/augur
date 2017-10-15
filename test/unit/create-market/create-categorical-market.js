/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();

describe("create-market/create-categorical-market", function () {
  var extraInfo = {
    marketType: "categorical",
    shortDescription: "Will this market be the One Market?",
    longDescription: "One Market to rule them all, One Market to bind them, One Market to bring them all, and in the darkness bind them.",
    outcomeNames: ["Yes", "Strong Yes", "Emphatic Yes"],
    tags: ["Ancient evil", "Large flaming eyes"],
    creationTimestamp: 1234567890
  };
  var test = function (t) {
    it(t.description, function (done) {
      var createCategoricalMarket = proxyquire("../../../src/create-market/create-categorical-market", {
        "./get-market-creation-cost": t.stub.getMarketCreationCost,
        "../api": t.stub.api
      });
      createCategoricalMarket(Object.assign({}, t.params, {
        onSuccess: function (res) {
          t.params.onSuccess(res);
          done();
        }
      }));
    });
  };
  test({
    description: "create a categorical market",
    params: {
      _signer: Buffer.from("PRIVATE_KEY", "utf8"),
      _universe: "UNIVERSE_ADDRESS",
      _endTime: 2345678901,
      _numOutcomes: 3,
      _feePerEthInWei: "4321",
      _denominationToken: "TOKEN_ADDRESS",
      _automatedReporterAddress: "AUTOMATED_REPORTER_ADDRESS",
      _topic: "TOPIC",
      _extraInfo: extraInfo,
      onSent: function (res) {
        assert.deepEqual(res, { callReturn: "1" });
      },
      onSuccess: function (res) {
        assert.deepEqual(res, { callReturn: "1" });
      },
      onFailed: function (err) {
        throw new Error(err);
      }
    },
    stub: {
      getMarketCreationCost: function (p, callback) {
        assert.deepEqual(p, {
          universeID: "UNIVERSE_ADDRESS",
          _endTime: 2345678901
        });
        callback(null, "MARKET_CREATION_COST");
      },
      api: function () {
        return {
          MarketCreation: {
            createCategoricalMarket: function (p) {
              assert.deepEqual(p.tx, { value: "MARKET_CREATION_COST" });
              assert.strictEqual(p._universe, "UNIVERSE_ADDRESS");
              assert.strictEqual(p._endTime, 2345678901);
              assert.strictEqual(p._numOutcomes, 3);
              assert.strictEqual(p._feePerEthInWei, "4321");
              assert.strictEqual(p._denominationToken, "TOKEN_ADDRESS");
              assert.strictEqual(p._automatedReporterAddress, "AUTOMATED_REPORTER_ADDRESS");
              assert.strictEqual(p._topic, "0x544f504943000000000000000000000000000000000000000000000000000000");
              assert.strictEqual(p._extraInfo, JSON.stringify(extraInfo));
              assert.strictEqual(p._signer.toString("utf8"), "PRIVATE_KEY");
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              p.onSent({ callReturn: "1" });
              p.onSuccess({ callReturn: "1" });
            }
          }
        };
      }
    }
  });
});
