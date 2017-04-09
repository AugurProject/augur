"use strict";

var assert = require("chai").assert;
var parametrizeOrder = require("../../../src/modules/parametrizeOrder");
// 4 tests total

describe("parametrizeOrder.getScalarMinimum", function() {
  // 2 tests total
  var test = function(t) {
    it(t.description, function() {
      t.assertions(parametrizeOrder.getScalarMinimum(t.type, t.minValue));
    });
  };
  test({
    description: 'Should return an empty object for non scalar markets',
    type: 'binary',
    minValue: 0,
    assertions: function(scalarMinimum) {
      assert.deepEqual(scalarMinimum, {});
    }
  });
  test({
    description: 'Should return an object with a minValue key set to the minValue passed if type is scalar',
    type: 'scalar',
    minValue: 20,
    assertions: function(scalarMinimum) {
      assert.deepEqual(scalarMinimum, { minValue: 20 });
    }
  });
});
describe("parametrizeOrder.parametrizeOrder", function() {
  // 2 tests total
  var test = function(t) {
    it(t.description, function() {
      t.assertions(parametrizeOrder.parametrizeOrder(t.market, t.outcomeID, t.numShares, t.limitPrice, t.tradeGroupID));
    });
  };
  test({
    description: 'Should handle a binary market',
    market: { type: 'binary', minValue: 0, id: '0xa1' },
    outcomeID: 1,
    numShares: '100',
    limitPrice: '0.5',
    tradeGroupID: '0xab12',
    assertions: function(parametrizedOrder) {
      assert.deepEqual(parametrizedOrder, {
        amount: '100',
        price: '0.5',
        market: '0xa1',
        outcome: 1,
        tradeGroupID: '0xab12',
        scalarMinMax: {}
      });
    }
  });
  test({
    description: 'Should handle a scalar market and correctly add a minValue to the scalarMinMax object',
    market: { type: 'scalar', minValue: 10, id: '0xa1' },
    outcomeID: 1,
    numShares: '100',
    limitPrice: '0.5',
    tradeGroupID: '0xab12',
    assertions: function(parametrizedOrder) {
      assert.deepEqual(parametrizedOrder, {
        amount: '100',
        price: '0.5',
        market: '0xa1',
        outcome: 1,
        tradeGroupID: '0xab12',
        scalarMinMax: { minValue: 10 }
      });
    }
  });
});
