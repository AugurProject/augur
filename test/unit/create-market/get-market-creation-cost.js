/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();

describe("create-market/get-market-creation-cost", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var getMarketCreationCost = proxyquire("../../../src/create-market/get-market-creation-cost", {
        "../api": t.stub.api,
      });
      getMarketCreationCost(t.params, function (err, marketCreationCost) {
        t.assertions(err, marketCreationCost);
        done();
      });
    });
  };
  test({
    description: "happy path",
    params: {
      universe: "UNIVERSE_ADDRESS",
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
    },
    stub: {
      api: function () {
        return {
          Universe: {
            getOrCacheDesignatedReportNoShowBond: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS", send: false } });
              callback(null, "0xde0b6b3a7640000");
            },
            getOrCacheMarketCreationCost: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS", send: false } });
              callback(null, "0x3a4965bf58a40000");
            },
          },
        };
      },
    },
    assertions: function (err, marketCreationCost) {
      assert.isNull(err);
      assert.deepEqual(marketCreationCost, {
        designatedReportNoShowReputationBond: "1",
        etherRequiredToCreateMarket: "4.2",
      });
    },
  });
});
