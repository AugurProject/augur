"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getBetterWorseOrders } = require("../../../build/server/getters/get-better-worse-orders");

describe("server/getters/get-better-worse-orders", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        getBetterWorseOrders(db, t.params.marketID, t.params.outcome, t.params.amount, t.params.normalizedPrice, (err, betterWorseOrders) => {
          t.assertions(err, betterWorseOrders);
          done();
        });
      });
    });
  };
  test({
    description: "get better worse with no orders",
    params: {
      marketID: "0x0000000000000000000000000000000000000011",
      outcome: 1,
      amount: 1,
      normalizedPrice: 2,
    },
    assertions: (err, betterWorseOrders) => {
      assert.isNull(err);
      assert.deepEqual(betterWorseOrders, {
        immediateFill: true,
        betterOrderID: 0,
        worseOrderID: 0,
      });
    },
  });
});
