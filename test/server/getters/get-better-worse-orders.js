"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getBetterWorseOrders } = require("../../../build/server/getters/get-better-worse-orders");

describe("server/getters/get-better-worse-orders", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        getBetterWorseOrders(db, t.params.marketId, t.params.outcome, t.params.orderType, t.params.price, (err, betterWorseOrders) => {
          t.assertions(err, betterWorseOrders);
          db.destroy();
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
      price: "2",
    },
    assertions: (err, betterWorseOrders) => {
      assert.ifError(err);
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
      price: "0.4",
    },
    assertions: (err, betterWorseOrders) => {
      assert.ifError(err);
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
      price: "0.99",
    },
    assertions: (err, betterWorseOrders) => {
      assert.ifError(err);
      assert.deepEqual(betterWorseOrders, {
        betterOrderId: null,
        worseOrderId: "0x5000000000000000000000000000000000000000000000000000000000000000",
      });
    },
  });
  test({
    description: "get better worse with better and worse orders",
    params: {
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 0,
      orderType: "buy",
      price: "0.65",
    },
    assertions: (err, betterWorseOrders) => {
      assert.ifError(err);
      assert.deepEqual(betterWorseOrders, {
        betterOrderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
        worseOrderId: "0x2000000000000000000000000000000000000000000000000000000000000000",
      });
    },
  });
});
