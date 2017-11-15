/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();

var counter = 0;

describe("create-market/get-market-creation-cost-breakdown", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var getMarketCreationCostBreakdown = proxyquire("../../../src/create-market/get-market-creation-cost-breakdown", {
        "../api": t.stub.api,
        "./create-current-reporting-window": proxyquire("../../../src/create-market/create-current-reporting-window", {
          "../api": t.stub.api,
        }),
      });
      getMarketCreationCostBreakdown(t.params, function (err, marketCreationCostBreakdown) {
        t.assertions(err, marketCreationCostBreakdown);
        done();
      });
    });
  };
  test({
    description: "current reporting window exists",
    params: {
      universe: "UNIVERSE_ADDRESS",
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
    },
    stub: {
      api: function () {
        return {
          Universe: {
            getDesignatedReportNoShowBond: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS" } });
              callback(null, "0xde0b6b3a7640000");
            },
            getTargetReporterGasCosts: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS" } });
              callback(null, "0x10a741a462780000");
            },
            getValidityBond: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS" } });
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
  test({
    description: "current reporting window does not exist",
    params: {
      universe: "UNIVERSE_ADDRESS",
      meta: { signer: Buffer.from("PRIVATE_KEY", "utf8"), accountType: "privateKey" },
    },
    stub: {
      api: function () {
        return {
          Universe: {
            getDesignatedReportNoShowBond: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS" } });
              if (counter === 0) {
                counter++;
                callback(null, "0x0");
              } else {
                callback(null, "0xde0b6b3a7640000");
              }
            },
            getTargetReporterGasCosts: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS" } });
              callback(null, "0x10a741a462780000");
            },
            getValidityBond: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS" } });
              callback(null, "0x29a2241af62c0000");
            },
            getOrCacheMarketCreationCost: function (p) {
              assert.deepEqual(p.tx, { to: "UNIVERSE_ADDRESS" });
              assert.strictEqual(p.meta.signer.toString("utf8"), "PRIVATE_KEY");
              assert.strictEqual(p.meta.accountType, "privateKey");
              assert.isFunction(p.onSent);
              assert.isFunction(p.onSuccess);
              assert.isFunction(p.onFailed);
              p.onSuccess({ callReturn: "0x3a4965bf58a40000" });
            },
          },
        };
      },
    },
    assertions: function (err, marketCreationCostBreakdown) {
      assert.isNull(err);
      assert.strictEqual(counter, 1);
      assert.deepEqual(marketCreationCostBreakdown, {
        designatedReportNoShowReputationBond: "1",
        targetReporterGasCosts: "1.2",
        validityBond: "3",
      });
    },
  });
});
