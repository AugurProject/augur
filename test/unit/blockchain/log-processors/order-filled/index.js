"use strict";

const assert = require("chai").assert;
const { parallel } = require("async");
const { BigNumber } = require("bignumber.js");
const { fix } = require("speedomatic");
const setupTestDb = require("../../../test.database");
const { processOrderFilledLog, processOrderFilledLogRemoval } = require("../../../../../build/blockchain/log-processors/order-filled");
const Augur = require("augur.js");
const augur = new Augur();

describe("blockchain/log-processors/order-filled", () => {
  const test = (t) => {
    const getState = (db, params, aux, callback) => parallel({
      orders: next => db("orders").where("orderId", params.log.orderId).asCallback(next),
      trades: next => db("trades").where("orderId", params.log.orderId).asCallback(next),
      markets: next => db.first("volume", "sharesOutstanding").from("markets").where("marketId", aux.marketId).asCallback(next),
      outcomes: next => db.select("price", "volume").from("outcomes").where({ marketId: aux.marketId }).asCallback(next),
      categories: next => db.first("popularity").from("categories").where("category", aux.category).asCallback(next),
    }, callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        db.transaction((trx) => {
          t.params.augur.utils = augur.utils;
          processOrderFilledLog(trx, t.params.augur, t.params.log, (err) => {
            assert.ifError(err);
            getState(trx, t.params, t.aux, (err, records) => {
              t.assertions.onAdded(err, records);
              processOrderFilledLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                assert.ifError(err);
                getState(trx, t.params, t.aux, (err, records) => {
                  t.assertions.onRemoved(err, records);
                  db.destroy();
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
    description: "OrderFilled full log and removal",
    params: {
      log: {
        shareToken: "0x0100000000000000000000000000000000000000",
        filler: "FILLER_ADDRESS",
        orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
        amountFilled: "100000000000000",
        numCreatorShares: "0",
        numCreatorTokens: fix("1", "string"),
        numFillerShares: augur.utils.convertDisplayAmountToOnChainAmount("2", new BigNumber(1), new BigNumber(10000)).toFixed(),
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
          Orders: {
            getLastOutcomePrice: (p, callback) => {
              assert.strictEqual(p._market, "0x0000000000000000000000000000000000000001");
              if (p._outcome === 0) {
                callback(null, "7000");
              } else {
                callback(null, "1250");
              }
            },
          },
        },
        trading: {
          calculateProfitLoss: (p) => {
            assert.isObject(p);
            return {
              position: "2",
              realized: "0",
              unrealized: "0",
              meanOpenPrice: "0.75",
              queued: "0",
            };
          },
          getPositionInMarket: (p, callback) => {
            assert.strictEqual(p.market, "0x0000000000000000000000000000000000000001");
            assert.oneOf(p.address, ["0x0000000000000000000000000000000000000b0b", "FILLER_ADDRESS"]);
            callback(null, ["2", "0", "0", "0", "0", "0", "0", "0"]);
          },
          normalizePrice: p => p.price,
        },
      },
      utils: {
        convertOnChainPriceToDisplayPrice: (onChainPrice, minDisplayPrice, tickSize) => {
          return onChainPrice.times(tickSize).plus(minDisplayPrice);
        },
      },
    },
    aux: {
      marketId: "0x0000000000000000000000000000000000000001",
      category: "test category",
    },
    assertions: {
      onAdded: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records.orders, [{
          orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
          blockNumber: 1400001,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
          logIndex: 0,
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 0,
          shareToken: "0x0100000000000000000000000000000000000000",
          orderType: "buy",
          orderCreator: "0x0000000000000000000000000000000000000b0b",
          orderState: "FILLED",
          fullPrecisionPrice: new BigNumber("0.7", 10),
          originalFullPrecisionAmount: new BigNumber("1", 10),
          fullPrecisionAmount: new BigNumber("0", 10),
          price: new BigNumber("0.7", 10),
          amount: new BigNumber("0", 10),
          originalAmount: new BigNumber("1", 10),
          tokensEscrowed: new BigNumber("0.7", 10),
          sharesEscrowed: new BigNumber("0", 10),
          tradeGroupId: null,
          orphaned: 0,
        }]);
        assert.deepEqual(records.trades, [{
          orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
          blockNumber: 1400101,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000F00",
          logIndex: 0,
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 0,
          shareToken: "0x0100000000000000000000000000000000000000",
          orderType: "buy",
          creator: "0x0000000000000000000000000000000000000b0b",
          filler: "FILLER_ADDRESS",
          numCreatorTokens: new BigNumber("1", 10),
          numCreatorShares: new BigNumber("0", 10),
          numFillerTokens: new BigNumber("0", 10),
          numFillerShares: new BigNumber("2", 10),
          marketCreatorFees: new BigNumber("0", 10),
          reporterFees: new BigNumber("0", 10),
          price: new BigNumber("0.7", 10),
          amount: new BigNumber("1", 10),
          tradeGroupId: "TRADE_GROUP_ID",
        }]);
        assert.deepEqual(records.markets, {
          volume: new BigNumber("1", 10),
          sharesOutstanding: new BigNumber("2", 10),
        });
        assert.deepEqual(records.outcomes, [
          { price: new BigNumber("0.7", 10), volume: new BigNumber("101", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
        ]);
        assert.deepEqual(records.categories, {
          popularity: 1,
        });
      },
      onRemoved: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records.orders, [{
          orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
          blockNumber: 1400001,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
          logIndex: 0,
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 0,
          shareToken: "0x0100000000000000000000000000000000000000",
          orderType: "buy",
          orderCreator: "0x0000000000000000000000000000000000000b0b",
          orderState: "OPEN",
          fullPrecisionPrice: new BigNumber("0.7", 10),
          fullPrecisionAmount: new BigNumber("1", 10),
          originalFullPrecisionAmount: new BigNumber("1", 10),
          price: new BigNumber("0.7", 10),
          amount: new BigNumber("1", 10),
          originalAmount: new BigNumber("1", 10),
          tokensEscrowed: new BigNumber("0.7", 10),
          sharesEscrowed: new BigNumber("0", 10),
          tradeGroupId: null,
          orphaned: 0,
        }]);
        assert.deepEqual(records.trades, []);
        assert.deepEqual(records.markets, {
          volume: new BigNumber("0", 10),
          sharesOutstanding: new BigNumber("2", 10),
        });
        assert.deepEqual(records.outcomes, [
          { price: new BigNumber("0.7", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
        ]);
        assert.deepEqual(records.categories, {
          popularity: 0,
        });
      },
    },
  });
  test({
    description: "OrderFilled partial log and removal",
    params: {
      log: {
        shareToken: "0x0100000000000000000000000000000000000000",
        filler: "FILLER_ADDRESS",
        orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
        amountFilled: "40000000000000",
        numCreatorShares: "0",
        numCreatorTokens: fix("0.4", "string"),
        numFillerShares: augur.utils.convertDisplayAmountToOnChainAmount("2", new BigNumber(1), new BigNumber(10000)).toFixed(),
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
          Orders: {
            getLastOutcomePrice: (p, callback) => {
              assert.strictEqual(p._market, "0x0000000000000000000000000000000000000001");
              if (p._outcome === 0) {
                callback(null, "7000");
              } else {
                callback(null, "1250");
              }
            },
          },
        },
        trading: {
          calculateProfitLoss: (p) => {
            assert.isObject(p);
            return {
              position: "2",
              realized: "0",
              unrealized: "0",
              meanOpenPrice: "0.75",
              queued: "0",
            };
          },
          getPositionInMarket: (p, callback) => {
            assert.strictEqual(p.market, "0x0000000000000000000000000000000000000001");
            assert.oneOf(p.address, ["0x0000000000000000000000000000000000000b0b", "FILLER_ADDRESS"]);
            callback(null, ["2", "0", "0", "0", "0", "0", "0", "0"]);
          },
          normalizePrice: p => p.price,
        },
      },
      utils: {
        convertOnChainPriceToDisplayPrice: (onChainPrice, minDisplayPrice, tickSize) => {
          return onChainPrice.times(tickSize).plus(minDisplayPrice);
        },
      },
    },
    aux: {
      marketId: "0x0000000000000000000000000000000000000001",
      category: "test category",
    },
    assertions: {
      onAdded: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records.orders, [{
          orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
          blockNumber: 1400001,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
          logIndex: 0,
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 0,
          shareToken: "0x0100000000000000000000000000000000000000",
          orderType: "buy",
          orderCreator: "0x0000000000000000000000000000000000000b0b",
          orderState: "OPEN",
          fullPrecisionPrice: new BigNumber("0.7", 10),
          originalFullPrecisionAmount: new BigNumber("1", 10),
          fullPrecisionAmount: new BigNumber("0.6", 10),
          price: new BigNumber("0.7", 10),
          amount: new BigNumber("0.6", 10),
          originalAmount: new BigNumber("1", 10),
          tokensEscrowed: new BigNumber("0.7", 10),
          sharesEscrowed: new BigNumber("0", 10),
          tradeGroupId: null,
          orphaned: 0,
        }]);
        assert.deepEqual(records.trades, [{
          orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
          blockNumber: 1400101,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000F00",
          logIndex: 0,
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 0,
          shareToken: "0x0100000000000000000000000000000000000000",
          orderType: "buy",
          creator: "0x0000000000000000000000000000000000000b0b",
          filler: "FILLER_ADDRESS",
          numCreatorTokens: new BigNumber("0.4", 10),
          numCreatorShares: new BigNumber("0", 10),
          numFillerTokens: new BigNumber("0", 10),
          numFillerShares: new BigNumber("2", 10),
          marketCreatorFees: new BigNumber("0", 10),
          reporterFees: new BigNumber("0", 10),
          price: new BigNumber("0.7", 10),
          amount: new BigNumber("0.4", 10),
          tradeGroupId: "TRADE_GROUP_ID",
        }]);
        assert.deepEqual(records.markets, {
          volume: new BigNumber("0.4", 10),
          sharesOutstanding: new BigNumber("2", 10),
        });
        assert.deepEqual(records.outcomes, [
          { price: new BigNumber("0.7", 10), volume: new BigNumber("100.4", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
        ]);
        assert.deepEqual(records.categories, {
          popularity: 0.4,
        });
      },
      onRemoved: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records.orders, [{
          orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
          blockNumber: 1400001,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
          logIndex: 0,
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 0,
          shareToken: "0x0100000000000000000000000000000000000000",
          orderType: "buy",
          orderCreator: "0x0000000000000000000000000000000000000b0b",
          orderState: "OPEN",
          fullPrecisionPrice: new BigNumber("0.7", 10),
          fullPrecisionAmount: new BigNumber("1", 10),
          originalFullPrecisionAmount: new BigNumber("1", 10),
          price: new BigNumber("0.7", 10),
          amount: new BigNumber("1", 10),
          originalAmount: new BigNumber("1", 10),
          tokensEscrowed: new BigNumber("0.7", 10),
          sharesEscrowed: new BigNumber("0", 10),
          tradeGroupId: null,
          orphaned: 0,
        }]);
        assert.deepEqual(records.trades, []);
        assert.deepEqual(records.markets, {
          volume: new BigNumber("0", 10),
          sharesOutstanding: new BigNumber("2", 10),
        });
        assert.deepEqual(records.outcomes, [
          { price: new BigNumber("0.7", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
          { price: new BigNumber("0.125", 10), volume: new BigNumber("100", 10) },
        ]);
        assert.deepEqual(records.categories, {
          popularity: 0,
        });
      },
    },
  });
});
