/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var sumSimulatedResults = require("../../../../src/trading/simulation/sum-simulated-results");
var constants = require("../../../../src/constants");
var ZERO = constants.ZERO;

describe("trading/simulation/sum-simulated-results", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(sumSimulatedResults(t.params.sumOfSimulatedResults, t.params.simulatedResults));
    });
  };
  test({
    description: "all zeros",
    params: {
      sumOfSimulatedResults: {
        sharesToCover: ZERO,
        settlementFees: ZERO,
        gasFees: ZERO,
        sharesDepleted: ZERO,
        otherSharesDepleted: ZERO,
        tokensDepleted: ZERO,
        shareBalances: [ZERO, ZERO],
      },
      simulatedResults: {
        settlementFees: ZERO,
        gasFees: ZERO,
        sharesDepleted: ZERO,
        otherSharesDepleted: ZERO,
        tokensDepleted: ZERO,
        shareBalances: [ZERO, ZERO],
      },
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        sharesToCover: ZERO,
        settlementFees: ZERO,
        gasFees: ZERO,
        sharesDepleted: ZERO,
        otherSharesDepleted: ZERO,
        tokensDepleted: ZERO,
        shareBalances: [ZERO, ZERO],
      });
    },
  });
  test({
    description: "not all zeros",
    params: {
      sumOfSimulatedResults: {
        sharesToCover: new BigNumber("1", 10),
        settlementFees: new BigNumber("1", 10),
        gasFees: new BigNumber("1", 10),
        sharesDepleted: new BigNumber("1", 10),
        otherSharesDepleted: new BigNumber("1", 10),
        tokensDepleted: new BigNumber("1", 10),
        shareBalances: [new BigNumber("10", 10), new BigNumber("9", 10)],
      },
      simulatedResults: {
        settlementFees: new BigNumber("2", 10),
        gasFees: new BigNumber("3", 10),
        sharesDepleted: new BigNumber("4", 10),
        otherSharesDepleted: new BigNumber("5", 10),
        tokensDepleted: new BigNumber("6", 10),
        shareBalances: [new BigNumber("8", 10), new BigNumber("7", 10)],
      },
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        sharesToCover: new BigNumber("1", 10),
        settlementFees: new BigNumber("3", 10),
        gasFees: new BigNumber("4", 10),
        sharesDepleted: new BigNumber("5", 10),
        otherSharesDepleted: new BigNumber("6", 10),
        tokensDepleted: new BigNumber("7", 10),
        shareBalances: [new BigNumber("8", 10), new BigNumber("7", 10)],
      });
    },
  });
});
