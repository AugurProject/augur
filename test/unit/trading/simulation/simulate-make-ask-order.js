"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var simulateMakeAskOrder = require("../../../../src/trading/simulation/simulate-make-ask-order");

describe("trading/simulation/simulate-make-ask-order", function () {
  var test = function (t) {
    it(t.description, function () {
      var output;
      try {
        output = simulateMakeAskOrder(t.params.numShares, t.params.price, t.params.maxPrice, t.params.outcomeID, t.params.shareBalances);
      } catch (exc) {
        output = exc;
      }
      t.assertions(output);
    });
  };
  test({
    description: "[0, 0] shares held, 1 maximum price, ask 2 shares of outcome 1 @ 0.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("0.6", 10),
      maxPrice: new BigNumber("1", 10),
      outcomeID: 1,
      shareBalances: [new BigNumber("0", 10), new BigNumber("0", 10)]
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        gasFees: new BigNumber("0", 10),
        sharesDepleted: new BigNumber("0", 10),
        tokensDepleted: new BigNumber("0.8", 10),
        shareBalances: [new BigNumber("0", 10), new BigNumber("0", 10)]
      });
    }
  });
  test({
    description: "[0, 4] shares held, 5 maximum price, ask 2 shares of outcome 1 @ 0.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("0.6", 10),
      maxPrice: new BigNumber("5", 10),
      outcomeID: 1,
      shareBalances: [new BigNumber("0", 10), new BigNumber("4", 10)]
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        gasFees: new BigNumber("0", 10),
        sharesDepleted: new BigNumber("0", 10),
        tokensDepleted: new BigNumber("8.8", 10),
        shareBalances: [new BigNumber("0", 10), new BigNumber("4", 10)]
      });
    }
  });
  test({
    description: "[3, 0] shares held, 5 maximum price, ask 2 shares of outcome 1 @ 0.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("0.6", 10),
      maxPrice: new BigNumber("5", 10),
      outcomeID: 1,
      shareBalances: [new BigNumber("3", 10), new BigNumber("0", 10)]
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        gasFees: new BigNumber("0", 10),
        sharesDepleted: new BigNumber("2", 10),
        tokensDepleted: new BigNumber("0", 10),
        shareBalances: [new BigNumber("1", 10), new BigNumber("0", 10)]
      });
    }
  });
  test({
    description: "[1, 0] shares held, 5 maximum price, ask 2 shares of outcome 1 @ 0.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("0.6", 10),
      maxPrice: new BigNumber("5", 10),
      outcomeID: 1,
      shareBalances: [new BigNumber("1", 10), new BigNumber("0", 10)]
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        gasFees: new BigNumber("0", 10),
        sharesDepleted: new BigNumber("1", 10),
        tokensDepleted: new BigNumber("4.4", 10),
        shareBalances: [new BigNumber("0", 10), new BigNumber("0", 10)]
      });
    }
  });
  test({
    description: "[1.2, 3.3] shares held, -2.1 maximum price, ask 1.9 shares of outcome 1 @ -2.6",
    params: {
      numShares: new BigNumber("1.9", 10),
      price: new BigNumber("-2.6", 10),
      maxPrice: new BigNumber("-2.1", 10),
      outcomeID: 1,
      shareBalances: [new BigNumber("1.2", 10), new BigNumber("3.3", 10)]
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        gasFees: new BigNumber("0", 10),
        sharesDepleted: new BigNumber("1.2", 10),
        tokensDepleted: new BigNumber("0.35", 10),
        shareBalances: [new BigNumber("0", 10), new BigNumber("3.3", 10)]
      });
    }
  });
  test({
    description: "[1, 0] shares held, 5 maximum price, ask 0 shares of outcome 1 @ 0.6",
    params: {
      numShares: new BigNumber("0", 10),
      price: new BigNumber("0.6", 10),
      maxPrice: new BigNumber("5", 10),
      outcomeID: 1,
      shareBalances: [new BigNumber("1", 10), new BigNumber("0", 10)]
    },
    assertions: function (output) {
      assert.deepEqual(output, new Error("Number of shares is too small"));
    }
  });
  test({
    description: "[1, 0] shares held, 5 maximum price, ask 2 shares of outcome 1 @ 5.1",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("5.1", 10),
      maxPrice: new BigNumber("5", 10),
      outcomeID: 1,
      shareBalances: [new BigNumber("1", 10), new BigNumber("0", 10)]
    },
    assertions: function (output) {
      assert.deepEqual(output, new Error("Price is above the maximum price"));
    }
  });
  test({
    description: "[3, 1] shares held, 7 minimum price, ask 2 shares of outcome 0 @ 6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("6", 10),
      minPrice: new BigNumber("7", 10),
      outcomeID: 0,
      shareBalances: [new BigNumber("3", 10), new BigNumber("1", 10)]
    },
    assertions: function (output) {
      assert.deepEqual(output, new Error("Invalid outcome ID"));
    }
  });
  test({
    description: "[3, 1] shares held, 7 minimum price, ask 2 shares of outcome 3 @ 6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("6", 10),
      minPrice: new BigNumber("7", 10),
      outcomeID: 3,
      shareBalances: [new BigNumber("3", 10), new BigNumber("1", 10)]
    },
    assertions: function (output) {
      assert.deepEqual(output, new Error("Invalid outcome ID"));
    }
  });
});
