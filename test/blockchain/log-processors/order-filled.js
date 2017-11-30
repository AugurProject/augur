"use strict";

const assert = require("chai").assert;
const { parallel } = require("async");
const setupTestDb = require("../../test.database");
const { processOrderFilledLog, processOrderFilledLogRemoval } = require("../../../build/blockchain/log-processors/order-filled");

describe("blockchain/log-processors/order-filled", () => {
  const test = (t) => {
    const getState = (db, params, aux, callback) => parallel({
      orders: next => db("orders").where("orderID", params.log.orderId).asCallback(next),
      trades: next => db("trades").where("orderID", params.log.orderId).asCallback(next),
      markets: next => db.first("volume", "sharesOutstanding").from("markets").where("marketID", aux.marketID).asCallback(next),
      outcomes: next => db.select("price", "volume").from("outcomes").where({ marketID: aux.marketID }).asCallback(next),
      categories: next => db.first("popularity").from("categories").where("category", aux.category).asCallback(next),
    }, callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          processOrderFilledLog(db, t.params.augur, trx, t.params.log, (err) => {
            assert.isNull(err);
            getState(trx, t.params, t.aux, (err, records) => {
              t.assertions.onAdded(err, records);
              processOrderFilledLogRemoval(db, t.params.augur, trx, t.params.log, (err) => {
                getState(trx, t.params, t.aux, (err, records) => {
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
        numCreatorTokens: "1000000000000000000",
        numFillerShares: "20000",
        numFillerTokens: "0",
        marketCreatorFees: "0",
        reporterFees: "0",
        tradeGroupId: "TRADE_GROUP_ID",
        blockNumber: 1400101,
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000F00",
        logIndex: 0,
      },
      augur: {
        api: {
          Market: {
            getShareToken: (p, callback) => {
              assert.deepEqual(p, { _outcome: 0, tx: { to: "0x0000000000000000000000000000000000000001" } });
              callback(null, "0x1000000000000000000000000000000000000000");
            },
          },
          Orders: {
            getAmount: (p, callback) => {
              assert.deepEqual(p, { _orderId: "0x1000000000000000000000000000000000000000000000000000000000000000" });
              callback(null, "20000");
            },
            getLastOutcomePrice: (p, callback) => {
              assert.strictEqual(p._market, "0x0000000000000000000000000000000000000001");
              if (p._outcome === 0) {
                callback(null, "7000");
              } else {
                callback(null, "1250");
              }
            },
            getVolume: (p, callback) => {
              assert.deepEqual(p, { _market: "0x0000000000000000000000000000000000000001" });
              callback(null, "20000");
            },
          },
          ShareToken: {
            totalSupply: (p, callback) => {
              assert.deepEqual(p, { tx: { to: "0x1000000000000000000000000000000000000000" } });
              callback(null, "20000");
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
            callback(null, ["2", "0", "0", "0", "0", "0", "0", "0"]);
          },
          normalizePrice: p => p.price,
        },
      },
    },
    aux: {
      marketID: "0x0000000000000000000000000000000000000001",
      category: "test category",
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
            amount: 2,
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
            numCreatorTokens: 1,
            numCreatorShares: 0,
            numFillerTokens: 0,
            numFillerShares: 2,
            marketCreatorFees: 0,
            reporterFees: 0,
            price: 0.7,
            amount: 1.4285714285714286,
            tradeGroupID: "TRADE_GROUP_ID",
          }],
          markets: {
            volume: 1.4285714285714286,
            sharesOutstanding: 20000,
          },
          outcomes: [
            { price: 0.7, volume: 101.4285714285714286 },
            { price: 0.125, volume: 100 },
            { price: 0.125, volume: 100 },
            { price: 0.125, volume: 100 },
            { price: 0.125, volume: 100 },
            { price: 0.125, volume: 100 },
            { price: 0.125, volume: 100 },
            { price: 0.125, volume: 100 },
          ],
          categories: {
            popularity: 1.4285714285714286,
          },
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
            amount: 2,
            tokensEscrowed: 0.7,
            sharesEscrowed: 0,
            tradeGroupID: null,
            isRemoved: null,
          }],
          trades: [],
          markets: {
            volume: 0,
            sharesOutstanding: 20000,
          },
          outcomes: [
            { price: 0.7, volume: 100 },
            { price: 0.125, volume: 100 },
            { price: 0.125, volume: 100 },
            { price: 0.125, volume: 100 },
            { price: 0.125, volume: 100 },
            { price: 0.125, volume: 100 },
            { price: 0.125, volume: 100 },
            { price: 0.125, volume: 100 },
          ],
          categories: {
            popularity: 0,
          },
        });
      },
    },
  });
});
