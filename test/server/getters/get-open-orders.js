"use strict";

const join = require("path").join;
const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getOpenOrders } = require("../../../build/server/getters/get-open-orders");

describe("server/getters/get-open-orders", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        getOpenOrders(db, t.params.marketID, t.params.outcome, t.params.orderType, t.params.creator, t.params.sortBy, t.params.isSortDescending, t.params.limit, t.params.offset, (err, openOrders) => {
          t.assertions(err, openOrders);
          done();
        });
      });
    });
  };
  test({
    description: "get open buy orders for market 1",
    params: {
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: null,
      orderType: "buy",
      creator: null
    },
    assertions: (err, openOrders) => {
      assert.isNull(err);
      assert.deepEqual(openOrders, {
        "0x0000000000000000000000000000000000000001": {
          0: {
            buy: {
              "0x1000000000000000000000000000000000000000000000000000000000000000": {
                shareToken: "0x1000000000000000000000000000000000000000",
                owner: "0x0000000000000000000000000000000000000b0b",
                creationTime: 1506473500,
                creationBlockNumber: 1400001,
                price: 0.7,
                amount: 1,
                fullPrecisionPrice: 0.7,
                fullPrecisionAmount: 1,
                tokensEscrowed: 0.7,
                sharesEscrowed: 0,
                betterOrderID: null,
                worseOrderID: null
              },
              "0x2000000000000000000000000000000000000000000000000000000000000000": {
                shareToken: "0x1000000000000000000000000000000000000000",
                owner: "0x000000000000000000000000000000000000d00d",
                creationTime: 1506473515,
                creationBlockNumber: 1400002,
                price: 0.6,
                amount: 2,
                fullPrecisionPrice: 0.600001,
                fullPrecisionAmount: 2,
                tokensEscrowed: 1.200002,
                sharesEscrowed: 0,
                betterOrderID: null,
                worseOrderID: null
              }
            }
          },
          1: {
            buy: {
              "0x3000000000000000000000000000000000000000000000000000000000000000": {
                shareToken: "0x2000000000000000000000000000000000000000",
                owner: "0x000000000000000000000000000000000000d00d",
                creationTime: 1506473515,
                creationBlockNumber: 1400002,
                price: 0.6,
                amount: 2,
                fullPrecisionPrice: 0.6,
                fullPrecisionAmount: 2.0000001,
                tokensEscrowed: 1.20000006,
                sharesEscrowed: 0,
                betterOrderID: null,
                worseOrderID: null
              }
            }
          }
        }
      });
    }
  });
  test({
    description: "get open sell orders for market 1",
    params: {
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: null,
      orderType: "sell",
      creator: null
    },
    assertions: (err, openOrders) => {
      assert.isNull(err);
      assert.deepEqual(openOrders, {
        "0x0000000000000000000000000000000000000001": {
          1: {
            sell: {
              "0x4000000000000000000000000000000000000000000000000000000000000000": {
                shareToken: "0x2000000000000000000000000000000000000000",
                owner: "0x000000000000000000000000000000000000d00d",
                creationTime: 1506473515,
                creationBlockNumber: 1400002,
                price: 0.6,
                amount: 2,
                fullPrecisionPrice: 0.6,
                fullPrecisionAmount: 2,
                tokensEscrowed: 1.2,
                sharesEscrowed: 0,
                betterOrderID: null,
                worseOrderID: null
              }
            }
          }
        }
      });
    }
  });
  test({
    description: "get orders created by user b0b",
    params: {
      marketID: null,
      outcome: null,
      orderType: null,
      creator: "0x0000000000000000000000000000000000000b0b"
    },
    assertions: (err, openOrders) => {
      assert.isNull(err);
      assert.deepEqual(openOrders, {
        "0x0000000000000000000000000000000000000001": {
          0: {
            buy: {
              "0x1000000000000000000000000000000000000000000000000000000000000000": {
                shareToken: "0x1000000000000000000000000000000000000000",
                owner: "0x0000000000000000000000000000000000000b0b",
                creationTime: 1506473500,
                creationBlockNumber: 1400001,
                price: 0.7,
                amount: 1,
                fullPrecisionPrice: 0.7,
                fullPrecisionAmount: 1,
                tokensEscrowed: 0.7,
                sharesEscrowed: 0,
                betterOrderID: null,
                worseOrderID: null
              }
            }
          }
        }
      });
    }
  });
  test({
    description: "get open orders for nonexistent market",
    params: {
      marketID: "0x1010101010101010101010101010101010101010",
      outcome: null,
      orderType: null,
      creator: null
    },
    assertions: (err, openOrders) => {
      assert.isNull(err);
      assert.isUndefined(openOrders);
    }
  });
});
