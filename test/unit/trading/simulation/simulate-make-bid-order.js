"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var simulateMakeBidOrder = require("../../../../src/trading/simulation/simulate-make-bid-order");

describe("trading/simulation/simulate-make-bid-order", function () {
  var test = function (t) {
    it(t.description, function () {
      var output;
      try {
        output = simulateMakeBidOrder(t.params.numShares, t.params.price, t.params.minPrice, t.params.shareBalances);
      } catch (exc) {
        output = exc;
      }
      t.assertions(output);
    });
  };
  test({
    description: "[0, 0] shares held, 0 minimum price, bid 2 @ 0.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("0.6", 10),
      minPrice: new BigNumber("0", 10),
      shareBalances: ["0", "0"]
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        gasFees: new BigNumber("0", 10),
        sharesDepleted: new BigNumber("0", 10),
        tokensDepleted: new BigNumber("1.2", 10)
      });
    }
  });
  test({
    description: "[0, 0] shares held, 7 minimum price, bid 2 @ 7.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("7.6", 10),
      minPrice: new BigNumber("7", 10),
      shareBalances: ["0", "0"]
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        gasFees: new BigNumber("0", 10),
        sharesDepleted: new BigNumber("0", 10),
        tokensDepleted: new BigNumber("1.2", 10)
      });
    }
  });
  test({
    description: "[3, 0] shares held, 7 minimum price, bid 2 @ 7.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("7.6", 10),
      minPrice: new BigNumber("7", 10),
      shareBalances: ["3", "0"]
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        gasFees: new BigNumber("0", 10),
        sharesDepleted: new BigNumber("0", 10),
        tokensDepleted: new BigNumber("1.2", 10)
      });
    }
  });
  test({
    description: "[3, 4] shares held, 7 minimum price, bid 2 @ 7.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("7.6", 10),
      minPrice: new BigNumber("7", 10),
      shareBalances: ["3", "4"]
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        gasFees: new BigNumber("0", 10),
        sharesDepleted: new BigNumber("2", 10),
        tokensDepleted: new BigNumber("0", 10)
      });
    }
  });
  test({
    description: "[3, 1] shares held, 7 minimum price, bid 2 @ 7.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("7.6", 10),
      minPrice: new BigNumber("7", 10),
      shareBalances: ["3", "1"]
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        gasFees: new BigNumber("0", 10),
        sharesDepleted: new BigNumber("1", 10),
        tokensDepleted: new BigNumber("0.6", 10)
      });
    }
  });
  test({
    description: "[3.1, 1.2] shares held, 6.9 minimum price, bid 2.4 @ 7.6",
    params: {
      numShares: new BigNumber("2.4", 10),
      price: new BigNumber("7.6", 10),
      minPrice: new BigNumber("6.9", 10),
      shareBalances: ["3.1", "1.2"]
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        gasFees: new BigNumber("0", 10),
        sharesDepleted: new BigNumber("1.2", 10),
        tokensDepleted: new BigNumber("0.84", 10)
      });
    }
  });
  test({
    description: "[3, 1] shares held, 7 minimum price, bid 0 @ 7.6",
    params: {
      numShares: new BigNumber("0", 10),
      price: new BigNumber("7.6", 10),
      minPrice: new BigNumber("7", 10),
      shareBalances: ["3", "1"]
    },
    assertions: function (output) {
      assert.deepEqual(output, new Error("Number of shares is too small"));
    }
  });
  test({
    description: "[3, 1] shares held, 7 minimum price, bid 2 @ 6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("6", 10),
      minPrice: new BigNumber("7", 10),
      shareBalances: ["3", "1"]
    },
    assertions: function (output) {
      assert.deepEqual(output, new Error("Price is below the minimum price"));
    }
  });
});
