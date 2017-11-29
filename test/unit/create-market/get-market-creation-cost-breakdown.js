/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();

describe("create-market/get-market-creation-cost-breakdown", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var getMarketCreationCostBreakdown = proxyquire("../../../src/create-market/get-market-creation-cost-breakdown", {
        "../api": t.stub.api,
      });
      getMarketCreationCostBreakdown(t.params, function (err, marketCreationCostBreakdown) {
        t.assertions(err, marketCreationCostBreakdown);
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
            getOrCacheTargetReporterGasCosts: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS", send: false } });
              callback(null, "0x10a741a462780000");
            },
            getOrCacheValidityBond: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS", send: false } });
              callback(null, "0x29a2241af62c0000");
            },
            getOrCacheMarketCreationCost: function (/*p*/) {
              assert.fail();
            },
          },
        };
      },
    },
    assertions: function (err, marketCreationCostBreakdown) {
      assert.isNull(err);
      assert.deepEqual(marketCreationCostBreakdown, {
        designatedReportNoShowReputationBond: "1",
        targetReporterGasCosts: "1.2",
        validityBond: "3",
      });
    },
  });
});
