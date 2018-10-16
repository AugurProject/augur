/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var calculateNearlyCompleteSets = require("../../../../src/trading/simulation/calculate-nearly-complete-sets");

describe("trading/simulation/calculate-nearly-complete-sets", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(calculateNearlyCompleteSets(t.params.outcome, t.params.desiredShares, t.params.shareBalances));
    });
  };
  test({
    description: "Two outcomes, 1 desired share, exclude outcome 1",
    params: {
      outcome: 1,
      desiredShares: new BigNumber("1", 10),
      shareBalances: [new BigNumber("3", 10), new BigNumber("3", 10)],
    },
    assertions: function (output) {
      assert.deepEqual(output, new BigNumber("1", 10));
    },
  });
  test({
    description: "Two outcomes, 10 desired shares, exclude outcome 1",
    params: {
      outcome: 1,
      desiredShares: new BigNumber("10", 10),
      shareBalances: [new BigNumber("4", 10), new BigNumber("3", 10)],
    },
    assertions: function (output) {
      assert.deepEqual(output, new BigNumber("4", 10));
    },
  });
  test({
    description: "Five outcomes, 10 desired shares, exclude outcome 0",
    params: {
      outcome: 0,
      desiredShares: new BigNumber("2", 10),
      shareBalances: [
        new BigNumber("4", 10),
        new BigNumber("3.1", 10),
        new BigNumber("2", 10),
        new BigNumber("2", 10),
        new BigNumber("13.37", 10),
      ],
    },
    assertions: function (output) {
      assert.deepEqual(output, new BigNumber("2", 10));
    },
  });
});
