/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();

describe("create-market/get-market-creation-cost-breakdown", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var getMarketCreationCostBreakdown = proxyquire("../../../src/create-market/get-market-creation-cost-breakdown", {
        "../api": t.stub.api
      });
      getMarketCreationCostBreakdown(t.params, function (err, marketCreationCostBreakdown) {
        t.assertions(err, marketCreationCostBreakdown);
        done();
      });
    });
  };
  test({
    description: "market creation cost breakdown",
    params: {
      universeID: "UNIVERSE_ADDRESS",
      _endTime: 1234567890
    },
    stub: {
      api: function () {
        return {
          Universe: {
            getReportingWindowByTimestamp: function (p, callback) {
              assert.deepEqual(p, {
                tx: { to: "UNIVERSE_ADDRESS" },
                _timestamp: 1234567890
              });
              callback(null, "REPORTING_WINDOW_ADDRESS");
            }
          },
          MarketFeeCalculator: {
            getTargetReporterGasCosts: function (callback) {
              callback(null, "0x10a741a462780000");
            },
            getValidityBond: function (p, callback) {
              assert.deepEqual(p, { _reportingWindow: "REPORTING_WINDOW_ADDRESS" });
              callback(null, "0x29a2241af62c0000");
            }
          }
        };
      }
    },
    assertions: function (err, marketCreationCostBreakdown) {
      assert.isNull(err);
      assert.deepEqual(marketCreationCostBreakdown, {
        targetReporterGasCosts: "1.2",
        validityBond: "3"
      });
    }
  });
});
