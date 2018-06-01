/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var speedomatic = require("speedomatic");
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
    },
    stub: {
      api: function () {
        return {
          Universe: {
            getOrCacheDesignatedReportNoShowBond: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS", send: false } });
              callback(null, speedomatic.fix("1", "string"));
            },
            getOrCacheTargetReporterGasCosts: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS", send: false } });
              callback(null, speedomatic.fix("1.2", "string"));
            },
            getOrCacheValidityBond: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS", send: false } });
              callback(null, speedomatic.fix("3", "string"));
            },
            getOrCacheReportingFeeDivisor: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS", send: false } });
              callback(null, speedomatic.fix("1", "string"));
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
        reportingFeeDivisor: "1",
        targetReporterGasCosts: "1.2",
        validityBond: "3",
      });
    },
  });
});
