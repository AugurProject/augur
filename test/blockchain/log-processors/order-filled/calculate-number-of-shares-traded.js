"use strict";

const assert = require("chai").assert;
const { BigNumber } = require("bignumber.js");
const { calculateNumberOfSharesTraded } = require("../../../../build/blockchain/log-processors/order-filled/calculate-number-of-shares-traded");

describe("blockchain/log-processors/order-filled/calculate-number-of-shares-traded", () => {
  const test = (t) => {
    it(t.description, () => {
      t.assertions(calculateNumberOfSharesTraded(t.params.numShares, t.params.numTokens, t.params.price));
    });
  };
  test({
    description: "shares only",
    params: {
      numShares: new BigNumber("1.2", 10),
      numTokens: new BigNumber("0", 10),
      price: new BigNumber("0.2", 10),
    },
    assertions: (numberOfSharesTraded) => {
      assert.strictEqual(numberOfSharesTraded.toFixed(), "1.2");
    },
  });
  test({
    description: "tokens only",
    params: {
      numShares: new BigNumber("0", 10),
      numTokens: new BigNumber("2.1", 10),
      price: new BigNumber("0.2", 10),
    },
    assertions: (numberOfSharesTraded) => {
      assert.strictEqual(numberOfSharesTraded.toFixed(), "10.5");
    },
  });
});
