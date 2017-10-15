/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var proxyquire = require("proxyquire").noPreserveCache();

describe("create-market/get-market-creation-cost", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var getMarketCreationCost = proxyquire("../../../src/create-market/get-market-creation-cost", {
        "../api": t.stub.api
      });
      getMarketCreationCost(t.params, function (err, marketCreationCost) {
        t.assertions(err, marketCreationCost);
        done();
      });
    });
  };
  test({
    description: "total market creation cost",
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
            getMarketCreationCost: function (p, callback) {
              assert.deepEqual(p, { _reportingWindow: "REPORTING_WINDOW_ADDRESS" });
              callback(null, "0x3a4965bf58a40000");
            }
          }
        };
      }
    },
    assertions: function (err, marketCreationCost) {
      assert.isNull(err);
      assert.strictEqual(marketCreationCost, "4.2");
    }
  });
});
