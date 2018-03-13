"use strict";

const assert = require("chai").assert;
const { parallel } = require("async");
const { BigNumber } = require("bignumber.js");
const { fix } = require("speedomatic");
const setupTestDb = require("../../../test.database");
const { convertHumanReadableSharesToOnChainShares } = require("../../../../build/utils/convert-fixed-point-to-decimal");
const { processOrderFilledLog, processOrderFilledLogRemoval } = require("../../../../build/blockchain/log-processors/order-filled");

describe("blockchain/log-processors/order-filled", () => {
  const test = (t) => {
    const getState = (db, params, aux, callback) => parallel({
      orders: next => db("orders").where("orderId", params.log.orderId).asCallback(next),
      trades: next => db("trades").where("orderId", params.log.orderId).asCallback(next),
      markets: next => db.first("volume", "sharesOutstanding").from("markets").where("marketId", aux.marketId).asCallback(next),
      outcomes: next => db.select("price", "volume").from("outcomes").where({ marketId: aux.marketId }).asCallback(next),
      categories: next => db.first("popularity").from("categories").where("category", aux.category).asCallback(next),
      positions: next => db("positions").where("account", params.log.filler).asCallback(next),
    }, callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          processOrderFilledLog(trx, t.params.augur, t.params.log, (err) => {
            assert.isNull(err);
            getState(trx, t.params, t.aux, (err, records) => {
              t.assertions.onAdded(err, records);
              processOrderFilledLogRemoval(trx, t.params.augur, t.params.log, (err) => {
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
        numCreatorTokens: fix("1", "string"),
        numFillerShares: convertHumanReadableSharesToOnChainShares("2", "0.0001"),
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
              callback(null, convertHumanReadableSharesToOnChainShares("2", "0.0001"));
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
              callback(null, convertHumanReadableSharesToOnChainShares("2", "0.0001"));
            },
          },
          ShareToken: {
            totalSupply: (p, callback) => {
              assert.deepEqual(p, { tx: { to: "0x1000000000000000000000000000000000000000" } });
              callback(null, convertHumanReadableSharesToOnChainShares("2", "0.0001"));
            },
          },
        },
        trading: {
          calculateProfitLoss: (p) => ({
            position: "2",
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
      marketId: "0x0000000000000000000000000000000000000001",
      category: "test category",
    },
    assertions: {
      onAdded: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records.orders, [{
          orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
          blockNumber: 1400001,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
          logIndex: 0,
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 0,
          shareToken: "0x1000000000000000000000000000000000000000",
          orderType: "buy",
          orderCreator: "0x0000000000000000000000000000000000000b0b",
          orderState: "OPEN",
          fullPrecisionPrice: 0.7,
          fullPrecisionAmount: 2,
          price: 0.7,
          amount: 2,
          tokensEscrowed: 0.7,
          sharesEscrowed: 0,
          tradeGroupId: null,
          isRemoved: null,
        }]);
        assert.deepEqual(records.trades, [{
          orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
          blockNumber: 1400101,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000F00",
          logIndex: 0,
          marketId: "0x0000000000000000000000000000000000000001",
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
          amount: 3.3333333333333335,
          tradeGroupId: "TRADE_GROUP_ID",
        }]);
        assert.deepEqual(records.markets, {
          volume: new BigNumber("3.33333333333333333333", 10),
          sharesOutstanding: new BigNumber("2", 10),
        });
        assert.deepEqual(records.outcomes, [
          { price: 0.7, volume: new BigNumber("103.33333333333333333333", 10) },
          { price: 0.125, volume: new BigNumber("100", 10) },
          { price: 0.125, volume: new BigNumber("100", 10) },
          { price: 0.125, volume: new BigNumber("100", 10) },
          { price: 0.125, volume: new BigNumber("100", 10) },
          { price: 0.125, volume: new BigNumber("100", 10) },
          { price: 0.125, volume: new BigNumber("100", 10) },
          { price: 0.125, volume: new BigNumber("100", 10) },
        ]);
        assert.deepEqual(records.categories, {
          popularity: 3.3333333333333335,
        });
        assert.deepEqual(records.positions, [{
          positionId: 21,
          account: "FILLER_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 0,
          numShares: 2,
          numSharesAdjustedForUserIntention: 2,
          realizedProfitLoss: 0,
          unrealizedProfitLoss: 0,
          averagePrice: 0,
          lastUpdated: records.positions[0].lastUpdated,
        }, {
          positionId: 22,
          account: "FILLER_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 1,
          numShares: 0,
          numSharesAdjustedForUserIntention: 0,
          realizedProfitLoss: 0,
          unrealizedProfitLoss: 0,
          averagePrice: 0,
          lastUpdated: records.positions[0].lastUpdated,
        }, {
          positionId: 23,
          account: "FILLER_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 2,
          numShares: 0,
          numSharesAdjustedForUserIntention: 0,
          realizedProfitLoss: 0,
          unrealizedProfitLoss: 0,
          averagePrice: 0,
          lastUpdated: records.positions[0].lastUpdated,
        }, {
          positionId: 24,
          account: "FILLER_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 3,
          numShares: 0,
          numSharesAdjustedForUserIntention: 0,
          realizedProfitLoss: 0,
          unrealizedProfitLoss: 0,
          averagePrice: 0,
          lastUpdated: records.positions[0].lastUpdated,
        }, {
          positionId: 25,
          account: "FILLER_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 4,
          numShares: 0,
          numSharesAdjustedForUserIntention: 0,
          realizedProfitLoss: 0,
          unrealizedProfitLoss: 0,
          averagePrice: 0,
          lastUpdated: records.positions[0].lastUpdated,
        }, {
          positionId: 26,
          account: "FILLER_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 5,
          numShares: 0,
          numSharesAdjustedForUserIntention: 0,
          realizedProfitLoss: 0,
          unrealizedProfitLoss: 0,
          averagePrice: 0,
          lastUpdated: records.positions[0].lastUpdated,
        }, {
          positionId: 27,
          account: "FILLER_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 6,
          numShares: 0,
          numSharesAdjustedForUserIntention: 0,
          realizedProfitLoss: 0,
          unrealizedProfitLoss: 0,
          averagePrice: 0,
          lastUpdated: records.positions[0].lastUpdated,
        }, {
          positionId: 28,
          account: "FILLER_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 7,
          numShares: 0,
          numSharesAdjustedForUserIntention: 0,
          realizedProfitLoss: 0,
          unrealizedProfitLoss: 0,
          averagePrice: 0,
          lastUpdated: records.positions[0].lastUpdated,
        }]);
      },
      onRemoved: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records.orders, [{
          orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
          blockNumber: 1400001,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
          logIndex: 0,
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 0,
          shareToken: "0x1000000000000000000000000000000000000000",
          orderType: "buy",
          orderCreator: "0x0000000000000000000000000000000000000b0b",
          orderState: "OPEN",
          fullPrecisionPrice: 0.7,
          fullPrecisionAmount: 2,
          price: 0.7,
          amount: 2,
          tokensEscrowed: 0.7,
          sharesEscrowed: 0,
          tradeGroupId: null,
          isRemoved: null,
        }]);
        assert.deepEqual(records.trades, []);
        assert.deepEqual(records.markets, {
          volume: new BigNumber("0", 10),
          sharesOutstanding: new BigNumber("2", 10),
        });
        assert.deepEqual(records.outcomes, [
          { price: 0.7, volume: new BigNumber("100", 10) },
          { price: 0.125, volume: new BigNumber("100", 10) },
          { price: 0.125, volume: new BigNumber("100", 10) },
          { price: 0.125, volume: new BigNumber("100", 10) },
          { price: 0.125, volume: new BigNumber("100", 10) },
          { price: 0.125, volume: new BigNumber("100", 10) },
          { price: 0.125, volume: new BigNumber("100", 10) },
          { price: 0.125, volume: new BigNumber("100", 10) },
        ]);
        assert.deepEqual(records.categories, {
          popularity: 0,
        });
        assert.deepEqual(records.positions, [{
          positionId: 21,
          account: "FILLER_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 0,
          numShares: 2,
          numSharesAdjustedForUserIntention: 0,
          realizedProfitLoss: 0,
          unrealizedProfitLoss: 0,
          averagePrice: 0,
          lastUpdated: records.positions[0].lastUpdated,
        }, {
          positionId: 22,
          account: "FILLER_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 1,
          numShares: 0,
          numSharesAdjustedForUserIntention: 0,
          realizedProfitLoss: 0,
          unrealizedProfitLoss: 0,
          averagePrice: 0,
          lastUpdated: records.positions[0].lastUpdated,
        }, {
          positionId: 23,
          account: "FILLER_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 2,
          numShares: 0,
          numSharesAdjustedForUserIntention: 0,
          realizedProfitLoss: 0,
          unrealizedProfitLoss: 0,
          averagePrice: 0,
          lastUpdated: records.positions[0].lastUpdated,
        }, {
          positionId: 24,
          account: "FILLER_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 3,
          numShares: 0,
          numSharesAdjustedForUserIntention: 0,
          realizedProfitLoss: 0,
          unrealizedProfitLoss: 0,
          averagePrice: 0,
          lastUpdated: records.positions[0].lastUpdated,
        }, {
          positionId: 25,
          account: "FILLER_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 4,
          numShares: 0,
          numSharesAdjustedForUserIntention: 0,
          realizedProfitLoss: 0,
          unrealizedProfitLoss: 0,
          averagePrice: 0,
          lastUpdated: records.positions[0].lastUpdated,
        }, {
          positionId: 26,
          account: "FILLER_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 5,
          numShares: 0,
          numSharesAdjustedForUserIntention: 0,
          realizedProfitLoss: 0,
          unrealizedProfitLoss: 0,
          averagePrice: 0,
          lastUpdated: records.positions[0].lastUpdated,
        }, {
          positionId: 27,
          account: "FILLER_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 6,
          numShares: 0,
          numSharesAdjustedForUserIntention: 0,
          realizedProfitLoss: 0,
          unrealizedProfitLoss: 0,
          averagePrice: 0,
          lastUpdated: records.positions[0].lastUpdated,
        }, {
          positionId: 28,
          account: "FILLER_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000001",
          outcome: 7,
          numShares: 0,
          numSharesAdjustedForUserIntention: 0,
          realizedProfitLoss: 0,
          unrealizedProfitLoss: 0,
          averagePrice: 0,
          lastUpdated: records.positions[0].lastUpdated,
        }]);
      },
    },
  });
});
