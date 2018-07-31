/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var speedomatic = require("speedomatic");
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
    },
    stub: {
      api: function () {
        return {
          Universe: {
            getOrCacheDesignatedReportNoShowBond: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS", send: false } });
              callback(null, speedomatic.fix("1", "string"));
            },
            getOrCacheMarketCreationCost: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS", send: false } });
              callback(null, speedomatic.fix("4.2", "string"));
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
