"use strict";

const assert = require("chai").assert;
const { fix } = require("speedomatic");
const setupTestDb = require("../../test.database");
const { convertHumanReadableSharesToOnChainShares } = require("../../../build/utils/convert-fixed-point-to-decimal");
const { processOrderCreatedLog, processOrderCreatedLogRemoval } = require("../../../build/blockchain/log-processors/order-created");

describe("blockchain/log-processors/order-created", () => {
  const test = (t) => {
    const getState = (db, params, callback) => db("orders").where("orderId", params.log.orderId).asCallback(callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          processOrderCreatedLog(trx, t.params.augur, t.params.log, (err) => {
            assert.isNull(err);
            getState(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processOrderCreatedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
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
        orderType: "0",
        shareToken: "0x1000000000000000000000000000000000000000",
        price: "7500",
        amount: convertHumanReadableSharesToOnChainShares("3", "0.0001"),
        sharesEscrowed: "0",
        moneyEscrowed: fix("2.25", "string"),
        creator: "CREATOR_ADDRESS",
        orderId: "ORDER_ID",
        tradeGroupId: "TRADE_GROUP_ID",
        blockNumber: 1400100,
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000B00",
        logIndex: 0,
      },
      augur: {
        api: {
          Orders: {
            getOrderType: (p, callback) => {
              assert.deepEqual(p, { _orderId: "ORDER_ID" });
              callback(null, "0");
            },
            getPrice: (p, callback) => {
              assert.deepEqual(p, { _orderId: "ORDER_ID" });
              callback(null, "7500"); // = 0.75 * 10752
            },
            getAmount: (p, callback) => {
              assert.deepEqual(p, { _orderId: "ORDER_ID" });
              callback(null, "3000000000000000000");
            },
            getOrderSharesEscrowed: (p, callback) => {
              assert.deepEqual(p, { _orderId: "ORDER_ID" });
              callback(null, "0");
            },
            getOrderMoneyEscrowed: (p, callback) => {
              assert.deepEqual(p, { _orderId: "ORDER_ID" });
              callback(null, "2250000000000000000"); // = 0.75 * 3000000000000000000
            },
          },
        },
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, [{
          orderId: "ORDER_ID",
          blockNumber: 1400100,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000B00",
          logIndex: 0,
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 0,
          shareToken: "0x1000000000000000000000000000000000000000",
          orderType: "buy",
          orderCreator: "CREATOR_ADDRESS",
          orderState: "OPEN",
          fullPrecisionPrice: new BigNumber("0.75", 10),
          fullPrecisionAmount: new BigNumber("3", 10),
          price: new BigNumber("0.75", 10),
          amount: new BigNumber("3", 10),
          tokensEscrowed: new BigNumber("2.25", 10),
          sharesEscrowed: new BigNumber("0", 10),
          tradeGroupId: "TRADE_GROUP_ID",
          isRemoved: null,
        }]);
      },
      onRemoved: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, [{
          orderId: "ORDER_ID",
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000B00",
          logIndex: 0,
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 0,
          shareToken: "0x1000000000000000000000000000000000000000",
          orderType: "buy",
          orderCreator: "CREATOR_ADDRESS",
          orderState: "OPEN",
          blockNumber: 1400100,
          fullPrecisionPrice: new BigNumber("0.75", 10),
          fullPrecisionAmount: new BigNumber("3", 10),
          price: new BigNumber("0.75", 10),
          amount: new BigNumber("3", 10),
          tokensEscrowed: new BigNumber("2.25", 10),
          sharesEscrowed: new BigNumber("0", 10),
          tradeGroupId: "TRADE_GROUP_ID",
          isRemoved: 1,
        }]);
      },
    },
  });
});
