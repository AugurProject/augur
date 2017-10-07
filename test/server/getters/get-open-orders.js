"use strict";

const unlink = require("fs").unlink;
const join = require("path").join;
const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getOpenOrders } = require("../../../build/server/getters/get-open-orders");

const augurDbPath = join(__dirname, "augur.db");

describe("server/getters/get-open-orders", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) asset.error(err);
        getOpenOrders(db, t.params.marketID, t.params.outcome, t.params.orderType, t.params.creator, (err, openOrders) => {
          t.assertions(err, openOrders);
          db.seed.run().then(function() { done(); });
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
                orderCreator: "0x0000000000000000000000000000000000000b0b",
                creationTime: 1506473500,
                creationBlockNumber: 1400001,
                price: 700000000000000000,
                amount: 1000000000000000000,
                tokensEscrowed: 700000000000000000,
                sharesEscrowed: 0
              },
              "0x2000000000000000000000000000000000000000000000000000000000000000": {
                shareToken: "0x1000000000000000000000000000000000000000",
                orderCreator: "0x000000000000000000000000000000000000d00d",
                creationTime: 1506473515,
                creationBlockNumber: 1400002,
                price: 600000000000000000,
                amount: 2000000000000000000,
                tokensEscrowed: 1200000000000000000,
                sharesEscrowed: 0
              }
            }
          },
          1: {
            buy: {
              "0x3000000000000000000000000000000000000000000000000000000000000000": {
                shareToken: "0x2000000000000000000000000000000000000000",
                orderCreator: "0x000000000000000000000000000000000000d00d",
                creationTime: 1506473515,
                creationBlockNumber: 1400002,
                price: 600000000000000000,
                amount: 2000000000000000000,
                tokensEscrowed: 1200000000000000000,
                sharesEscrowed: 0
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
                orderCreator: "0x000000000000000000000000000000000000d00d",
                creationTime: 1506473515,
                creationBlockNumber: 1400002,
                price: 600000000000000000,
                amount: 2000000000000000000,
                tokensEscrowed: 1200000000000000000,
                sharesEscrowed: 0
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
                orderCreator: "0x0000000000000000000000000000000000000b0b",
                creationTime: 1506473500,
                creationBlockNumber: 1400001,
                price: 700000000000000000,
                amount: 1000000000000000000,
                tokensEscrowed: 700000000000000000,
                sharesEscrowed: 0
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
