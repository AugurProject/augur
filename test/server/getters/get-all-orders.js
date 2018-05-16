"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getAllOrders } = require("../../../build/server/getters/get-all-orders");

describe("server/getters/get-all-orders", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        getAllOrders(db, t.params.account, (err, orders) => {
          t.assertions(err, orders);
          done();
        });
      });
    });
  };
  test({
    description: "get all orders from the account",
    params: {
      account: "0x000000000000000000000000000000000000d00d",
    },
    assertions: (err, orders) => {
      assert.isNull(err);
      assert.deepEqual(orders, [
        {
          "orderId": "0x2000000000000000000000000000000000000000000000000000000000000000",
          "sharesEscrowed": "0",
          "tokensEscrowed": "1.200002",
        },
        {
          "orderId": "0x3000000000000000000000000000000000000000000000000000000000000000",
          "sharesEscrowed": "0",
          "tokensEscrowed": "1.20000006",
        },
        {
          "orderId": "0x4000000000000000000000000000000000000000000000000000000000000000",
          "sharesEscrowed": "0",
          "tokensEscrowed": "1.2",
        },
        {
          "orderId": "0x4100000000000000000000000000000000000000000000000000000000000000",
          "sharesEscrowed": "0",
          "tokensEscrowed": "1.2",
        },
        {
          "orderId": "0x4200000000000000000000000000000000000000000000000000000000000000",
          "sharesEscrowed": "0",
          "tokensEscrowed": "1.2",
        },
      ]);
    },
  });
});
