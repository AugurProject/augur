"use strict";

const assert = require("chai").assert;
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
      numShares: "1.2",
      numTokens: "0",
      price: "0.2",
    },
    assertions: (numberOfSharesTraded) => {
      assert.strictEqual(numberOfSharesTraded, "1.2");
    },
  });
  test({
    description: "tokens only",
    params: {
      numShares: "0",
      numTokens: "2.1",
      price: "0.2",
    },
    assertions: (numberOfSharesTraded) => {
      assert.strictEqual(numberOfSharesTraded, "10.5");
    },
  });
});
