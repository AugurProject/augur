/* eslint-env mocha */

"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");

describe("decreasePosition", function () {
  var test = function (t) {
    it(t.description, function () {
      t.assertions(require("../../../../src/trading/positions/decrease-position")(t.position, t.adjustment));
    });
  };
  test({
    description: "no position, no adjustment",
    position: ["0", "0"],
    adjustment: new BigNumber("0"),
    assertions: function (output) {
      assert.deepEqual(output, ["0", "0"]);
    }
  });
  test({
    description: "position [1, 1], adjustment 1",
    position: ["1", "1"],
    adjustment: new BigNumber("1", 10),
    assertions: function (output) {
      assert.deepEqual(output, ["0", "0"]);
    }
  });
  test({
    description: "position [1, 1], adjustment 0.75",
    position: ["1", "1"],
    adjustment: new BigNumber("0.75", 10),
    assertions: function (output) {
      assert.deepEqual(output, ["0.25", "0.25"]);
    }
  });
  test({
    description: "position [2, 1], adjustment 2",
    position: ["2", "1"],
    adjustment: new BigNumber("2", 10),
    assertions: function (output) {
      assert.deepEqual(output, ["0", "-1"]);
    }
  });
  test({
    description: "position [2.1, 0.9], adjustment 0.2",
    position: ["2.1", "0.9"],
    adjustment: new BigNumber("0.2", 10),
    assertions: function (output) {
      assert.deepEqual(output, ["1.9", "0.7"]);
    }
  });
  test({
    description: "position [2.1, 0.9], adjustment 0.9",
    position: ["2.1", "0.9"],
    adjustment: new BigNumber("0.9", 10),
    assertions: function (output) {
      assert.deepEqual(output, ["1.2", "0"]);
    }
  });
  test({
    description: "position [2.1, 0.9], adjustment 2",
    position: ["2.1", "0.9"],
    adjustment: new BigNumber("2", 10),
    assertions: function (output) {
      assert.deepEqual(output, ["0.1", "-1.1"]);
    }
  });
});
