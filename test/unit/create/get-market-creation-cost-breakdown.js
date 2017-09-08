/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();

describe("create/get-market-creation-cost-breakdown", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var getMarketCreationCostBreakdown = proxyquire("../../../src/create/get-market-creation-cost-breakdown", {
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
      branchID: "BRANCH_ADDRESS",
      _endTime: 1234567890
    },
    stub: {
      api: function () {
        return {
          Branch: {
            getReportingWindowByTimestamp: function (p, callback) {
              assert.deepEqual(p, {
                tx: { to: "BRANCH_ADDRESS" },
                _timestamp: 1234567890
              });
              callback("REPORTING_WINDOW_ADDRESS");
            }
          },
          MarketFeeCalculator: {
            getTargetReporterGasCosts: function (callback) {
              callback("0x10a741a462780000");
            },
            getValidityBond: function (p, callback) {
              assert.deepEqual(p, { _reportingWindow: "REPORTING_WINDOW_ADDRESS" });
              callback("0x29a2241af62c0000");
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
