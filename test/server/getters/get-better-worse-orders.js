"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { BigNumber } = require("bignumber.js");
const { getBetterWorseOrders } = require("../../../build/server/getters/get-better-worse-orders");

describe("server/getters/get-better-worse-orders", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        getBetterWorseOrders(db, t.params.marketId, t.params.outcome, t.params.orderType, t.params.price, (err, betterWorseOrders) => {
          t.assertions(err, betterWorseOrders);
          done();
        });
      });
    });
  };
  test({
    description: "get better worse with no orders",
    params: {
      marketId: "0x00000000000000000000000000000fffffffff11",
      outcome: 1,
      orderType: "buy",
      price: new BigNumber("2", 10),
    },
    assertions: (err, betterWorseOrders) => {
      assert.isNull(err);
      assert.deepEqual(betterWorseOrders, {
        betterOrderId: null,
        worseOrderId: null,
      });
    },
  });
  test({
    description: "get better worse with better orders",
    params: {
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 0,
      orderType: "buy",
      price: new BigNumber("0.4", 10),
    },
    assertions: (err, betterWorseOrders) => {
      assert.isNull(err);
      assert.deepEqual(betterWorseOrders, {
        betterOrderId: "0x2000000000000000000000000000000000000000000000000000000000000000",
        worseOrderId: null,
      });
    },
  });
  test({
    description: "get better worse with worse orders",
    params: {
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 0,
      orderType: "buy",
      price: new BigNumber("0.99", 10),
    },
    assertions: (err, betterWorseOrders) => {
      assert.isNull(err);
      assert.deepEqual(betterWorseOrders, {
        betterOrderId: null,
        worseOrderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
      });
    },
  });
  test({
    description: "get better worse with better and worse orders",
    params: {
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 0,
      orderType: "buy",
      price: new BigNumber("0.65", 10),
    },
    assertions: (err, betterWorseOrders) => {
      assert.isNull(err);
      assert.deepEqual(betterWorseOrders, {
        betterOrderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
        worseOrderId: "0x2000000000000000000000000000000000000000000000000000000000000000",
      });
    },
  });
});
