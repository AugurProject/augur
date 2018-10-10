/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var speedomatic = require("speedomatic");
var proxyquire = require("proxyquire").noPreserveCache();

describe("reporting/get-stake-required-for-designated-reporter", function () {
  var test = function (t) {
    it(t.description, function (done) {
      var getStakeRequiredForDesignatedReporter = proxyquire("../../../src/reporting/get-stake-required-for-designated-reporter", {
        "../api": t.stub.api,
      });
      getStakeRequiredForDesignatedReporter(t.params, function (err, stakeRequiredForDesignatedReporter) {
        t.assertions(err, stakeRequiredForDesignatedReporter);
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
            getOrCacheDesignatedReportStake: function (p, callback) {
              assert.deepEqual(p, { tx: { to: "UNIVERSE_ADDRESS", send: false } });
              callback(null, speedomatic.fix("1.2345", "string"));
            },
          },
        };
      },
    },
    assertions: function (err, stakeRequiredForDesignatedReporter) {
      assert.isNull(err);
      assert.strictEqual(stakeRequiredForDesignatedReporter, "1.2345");
    },
  });
});
