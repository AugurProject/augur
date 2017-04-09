"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var splitOrder = require('../../../src/modules/splitOrder');
// 2 tests total

describe("splitOrder", function () {
  // 2 tests total
  var test = function (t) {
    it(t.description, function () {
      t.assertions(splitOrder(t.numShares, t.position));
    });
  };
  test({
    description: "Should handle an ask order",
    numShares: new BigNumber(50),
    position: new BigNumber(100),
    assertions: function (order) {
      assert.deepEqual(order, { askShares: new BigNumber(50), shortAskShares: 0});
    }
  });
  test({
    description: "Should handle an ask order",
    numShares: new BigNumber(50),
    position: new BigNumber(10),
    assertions: function (order) {
      assert.deepEqual(order, { askShares: "10", shortAskShares: "40"});
    }
  });
});
