"use strict";

const assert = require("chai").assert;
const { parallel } = require("async");
const setupTestDb = require("../../test.database");
const { processOrderCreatedLog, processOrderCreatedLogRemoval } = require("../../../build/blockchain/log-processors/order-created");

describe("blockchain/log-processors/order-created", () => {
  const test = (t) => {
    const getState = (db, params, callback) => db("orders").where("orderId", params.log.orderId).asCallback(callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          processOrderCreatedLog(db, t.params.augur, trx, t.params.log, (err) => {
            assert.isNull(err);
            getState(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processOrderCreatedLogRemoval(db, t.params.augur, trx, t.params.log, (err) => {
                getState(trx, t.params, (err, records) => {
                  t.assertions.onRemoved(err, records);
                  done();
                });
              });
            });
          });
        });
      });
    });
  };
  test({
    description: "OrderCreated log and removal",
    params: {
      log: {
        shareToken: "0x1000000000000000000000000000000000000000",
        creator: "CREATOR_ADDRESS",
        orderId: "ORDER_ID",
        tradeGroupId: "TRADE_GROUP_ID",
        blockNumber: 1400100
      },
      augur: {
        api: {
          Orders: {
            getTradeType: (p, callback) => {
              assert.deepEqual(p, { _orderId: "ORDER_ID" });
              callback(null, "0x0");
            },
            getPrice: (p, callback) => {
              assert.deepEqual(p, { _orderId: "ORDER_ID" });
              callback(null, "0x1f80"); // = 0.75 * 10752
            },
            getAmount: (p, callback) => {
              assert.deepEqual(p, { _orderId: "ORDER_ID" });
              callback(null, "0x7e00"); // = 3 * 10752
            },
            getOrderSharesEscrowed: (p, callback) => {
              assert.deepEqual(p, { _orderId: "ORDER_ID" });
              callback(null, "0x0");
            },
            getOrderMoneyEscrowed: (p, callback) => {
              assert.deepEqual(p, { _orderId: "ORDER_ID" });
              callback(null, "0x1f399b1438a10000"); // = 0.75 * 3 * 10^18
            },
            getBetterOrderId: (p, callback) => {
              assert.deepEqual(p, { _orderId: "ORDER_ID" });
              callback(null, "BETTER_ORDER_ID");
            },
            getWorseOrderId: (p, callback) => {
              assert.deepEqual(p, { _orderId: "ORDER_ID" });
              callback(null, "WORSE_ORDER_ID");
            },
          },
        },
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, [{
          orderID: "ORDER_ID",
          marketID: "0x0000000000000000000000000000000000000001",
          outcome: 0,
          shareToken: "0x1000000000000000000000000000000000000000",
          orderType: "buy",
          orderCreator: "CREATOR_ADDRESS",
          creationBlockNumber: 1400100,
          fullPrecisionPrice: 0.75,
          fullPrecisionAmount: 3,
          price: 0.75,
          amount: 3,
          tokensEscrowed: 2.25,
          sharesEscrowed: 0,
          betterOrderID: "BETTER_ORDER_ID",
          worseOrderID: "WORSE_ORDER_ID",
          tradeGroupID: "TRADE_GROUP_ID",
          isRemoved: null
        }]);
      },
      onRemoved: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, [{
          orderID: "ORDER_ID",
          marketID: "0x0000000000000000000000000000000000000001",
          outcome: 0,
          shareToken: "0x1000000000000000000000000000000000000000",
          orderType: "buy",
          orderCreator: "CREATOR_ADDRESS",
          creationBlockNumber: 1400100,
          fullPrecisionPrice: 0.75,
          fullPrecisionAmount: 3,
          price: 0.75,
          amount: 3,
          tokensEscrowed: 2.25,
          sharesEscrowed: 0,
          betterOrderID: "BETTER_ORDER_ID",
          worseOrderID: "WORSE_ORDER_ID",
          tradeGroupID: "TRADE_GROUP_ID",
          isRemoved: 1
        }]);
      },
    }
  });
});
