"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getBetterWorseOrders } = require("../../../build/server/getters/get-better-worse-orders");

describe("server/getters/get-better-worse-orders", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        getBetterWorseOrders(db, t.params.marketID, t.params.outcome, t.params.orderType, t.params.price, (err, betterWorseOrders) => {
          t.assertions(err, betterWorseOrders);
          done();
        });
      });
    });
  };
  test({
    description: "get better worse with no orders",
    params: {
      marketID: "0x00000000000000000000000000000fffffffff11",
      outcome: 1,
      orderType: "buy",
      price: 2,
    },
    assertions: (err, betterWorseOrders) => {
      assert.isNull(err);
      assert.deepEqual(betterWorseOrders, {
        betterOrderID: null,
        worseOrderID: null,
      });
    },
  });
  test({
    description: "get better worse with better orders",
    params: {
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: 0,
      orderType: "buy",
      price: 0.4,
    },
    assertions: (err, betterWorseOrders) => {
      assert.isNull(err);
      assert.deepEqual(betterWorseOrders, {
        betterOrderID: "0x2000000000000000000000000000000000000000000000000000000000000000",
        worseOrderID: null,
      });
    },
  });
  test({
    description: "get better worse with worse orders",
    params: {
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: 0,
      orderType: "buy",
      price: 0.99,
    },
    assertions: (err, betterWorseOrders) => {
      assert.isNull(err);
      assert.deepEqual(betterWorseOrders, {
        betterOrderID: null,
        worseOrderID: "0x1000000000000000000000000000000000000000000000000000000000000000",
      });
    },
  });
  test({
    description: "get better worse with better and worse orders",
    params: {
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: 0,
      orderType: "buy",
      price: 0.65,
    },
    assertions: (err, betterWorseOrders) => {
      assert.isNull(err);
      assert.deepEqual(betterWorseOrders, {
        betterOrderID: "0x1000000000000000000000000000000000000000000000000000000000000000",
        worseOrderID: "0x2000000000000000000000000000000000000000000000000000000000000000",
      });
    },
  });
});
