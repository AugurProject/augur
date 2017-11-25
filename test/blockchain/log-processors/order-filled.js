"use strict";

const assert = require("chai").assert;
const { parallel } = require("async");
const setupTestDb = require("../../test.database");
const { processOrderFilledLog, processOrderFilledLogRemoval } = require("../../../build/blockchain/log-processors/order-filled");

describe("blockchain/log-processors/order-filled", () => {
  const test = (t) => {
    const getState = (db, params, callback) => parallel({
      orders: next => db("orders").where("orderID", params.log.orderId).asCallback(next),
      trades: next => db("trades").where("orderID", params.log.orderId).asCallback(next),
    }, callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          processOrderFilledLog(db, t.params.augur, trx, t.params.log, (err) => {
            assert.isNull(err);
            getState(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processOrderFilledLogRemoval(db, t.params.augur, trx, t.params.log, (err) => {
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
    description: "OrderFilled log and removal",
    params: {
      log: {
        shareToken: "0x1000000000000000000000000000000000000000",
        filler: "FILLER_ADDRESS",
        orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
        numCreatorShares: "0",
        numCreatorTokens: "1125000000000000000",
        numFillerShares: "17280",
        numFillerTokens: "0",
        settlementFees: "0",
        tradeGroupId: "TRADE_GROUP_ID",
        blockNumber: 1400101,
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000F00",
        logIndex: 0,
      },
      augur: {
        api: {
          Orders: {
            getAmount: (p, callback) => {
              assert.deepEqual(p, { _orderId: "0x1000000000000000000000000000000000000000000000000000000000000000" });
              callback(null, "14976");
            },
          },
        },
        trading: {
          calculateProfitLoss: (p) => ({
            realized: "0",
            unrealized: "0",
            meanOpenPrice: "0.75",
            queued: "0",
          }),
          getPositionInMarket: (p, callback) => {
            assert.strictEqual(p.market, "0x0000000000000000000000000000000000000001");
            assert.oneOf(p.address, ["0x0000000000000000000000000000000000000b0b", "FILLER_ADDRESS"]);
            callback(null, ["1.6071428571428572", "0", "0", "0", "0", "0", "0", "0"]);
          },
        },
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          orders: [{
            orderID: "0x1000000000000000000000000000000000000000000000000000000000000000",
            blockNumber: 1400001,
            transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
            logIndex: 0,
            marketID: "0x0000000000000000000000000000000000000001",
            outcome: 0,
            shareToken: "0x1000000000000000000000000000000000000000",
            orderType: "buy",
            orderCreator: "0x0000000000000000000000000000000000000b0b",
            orderState: "OPEN",
            fullPrecisionPrice: 0.7,
            fullPrecisionAmount: 1,
            price: 0.7,
            amount: 1.3928571428571428,
            tokensEscrowed: 0.7,
            sharesEscrowed: 0,
            tradeGroupID: null,
            isRemoved: null,
          }],
          trades: [{
            orderID: "0x1000000000000000000000000000000000000000000000000000000000000000",
            blockNumber: 1400101,
            transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000F00",
            logIndex: 0,
            marketID: "0x0000000000000000000000000000000000000001",
            outcome: 0,
            shareToken: "0x1000000000000000000000000000000000000000",
            orderType: "buy",
            creator: "0x0000000000000000000000000000000000000b0b",
            filler: "FILLER_ADDRESS",
            numCreatorTokens: 1.125,
            numCreatorShares: 0,
            numFillerTokens: 0,
            numFillerShares: 1.6071428571428572,
            settlementFees: 0,
            price: 0.7,
            amount: 1.6071428571428572,
            tradeGroupID: "TRADE_GROUP_ID",
          }],
        });
      },
      onRemoved: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          orders: [{
            orderID: "0x1000000000000000000000000000000000000000000000000000000000000000",
            blockNumber: 1400001,
            transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
            logIndex: 0,
            marketID: "0x0000000000000000000000000000000000000001",
            outcome: 0,
            shareToken: "0x1000000000000000000000000000000000000000",
            orderType: "buy",
            orderCreator: "0x0000000000000000000000000000000000000b0b",
            orderState: "OPEN",
            fullPrecisionPrice: 0.7,
            fullPrecisionAmount: 1,
            price: 0.7,
            amount: 1.3928571428571428,
            tokensEscrowed: 0.7,
            sharesEscrowed: 0,
            tradeGroupID: null,
            isRemoved: null,
          }],
          trades: [],
        });
      },
    },
  });
});
