"use strict";

var assert = require("chai").assert;
var BigNumber = require("bignumber.js");
var simulateMakeAskOrder = require("../../../../src/trading/simulation/simulate-make-ask-order");

describe("trading/simulation/simulate-make-ask-order", function () {
  var test = function (t) {
    it(t.description, function () {
      var output;
      try {
        output = simulateMakeAskOrder(t.params.numShares, t.params.price, t.params.maxPrice, t.params.sharesHeld);
      } catch (exc) {
        output = exc;
      }
      t.assertions(output);
    });
  };
  test({
    description: "0 shares held, 1 maximum price, ask 2 @ 0.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("0.6", 10),
      maxPrice: new BigNumber("1", 10),
      sharesHeld: new BigNumber("0", 10)
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        gasFees: new BigNumber("0", 10),
        sharesDepleted: new BigNumber("0", 10),
        tokensDepleted: new BigNumber("0.8", 10)
      });
    }
  });
  test({
    description: "0 shares held, 5 maximum price, ask 2 @ 0.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("0.6", 10),
      maxPrice: new BigNumber("5", 10),
      sharesHeld: new BigNumber("0", 10)
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        gasFees: new BigNumber("0", 10),
        sharesDepleted: new BigNumber("0", 10),
        tokensDepleted: new BigNumber("8.8", 10)
      });
    }
  });
  test({
    description: "3 shares held, 5 maximum price, ask 2 @ 0.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("0.6", 10),
      maxPrice: new BigNumber("5", 10),
      sharesHeld: new BigNumber("3", 10)
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
    description: "1 share held, 5 maximum price, ask 2 @ 0.6",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("0.6", 10),
      maxPrice: new BigNumber("5", 10),
      sharesHeld: new BigNumber("1", 10)
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        gasFees: new BigNumber("0", 10),
        sharesDepleted: new BigNumber("1", 10),
        tokensDepleted: new BigNumber("4.4", 10)
      });
    }
  });
  test({
    description: "1.2 shares held, -2.1 maximum price, ask 1.9 @ -2.6",
    params: {
      numShares: new BigNumber("1.9", 10),
      price: new BigNumber("-2.6", 10),
      maxPrice: new BigNumber("-2.1", 10),
      sharesHeld: new BigNumber("1.2", 10)
    },
    assertions: function (output) {
      assert.deepEqual(output, {
        gasFees: new BigNumber("0", 10),
        sharesDepleted: new BigNumber("1.2", 10),
        tokensDepleted: new BigNumber("0.35", 10)
      });
    }
  });
  test({
    description: "1 share held, 5 maximum price, ask 0 @ 0.6",
    params: {
      numShares: new BigNumber("0", 10),
      price: new BigNumber("0.6", 10),
      maxPrice: new BigNumber("5", 10),
      sharesHeld: new BigNumber("1", 10)
    },
    assertions: function (output) {
      assert.deepEqual(output, new Error("Number of shares is too small"));
    }
  });
  test({
    description: "1 share held, 5 maximum price, ask 2 @ 5.1",
    params: {
      numShares: new BigNumber("2", 10),
      price: new BigNumber("5.1", 10),
      maxPrice: new BigNumber("5", 10),
      sharesHeld: new BigNumber("1", 10)
    },
    assertions: function (output) {
      assert.deepEqual(output, new Error("Price is above the maximum price"));
    }
  });
});
