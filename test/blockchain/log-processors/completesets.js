"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { BigNumber } = require("bignumber.js");
const { processCompleteSetsPurchasedOrSoldLog, processCompleteSetsPurchasedOrSoldLogRemoval } = require("../../../build/blockchain/log-processors/completesets");

describe("blockchain/log-processors/completesets", () => {
  const test = (t) => {
    const getState = (db, params, callback) => db("positions").where({
      account: params.log.account,
      marketId: params.log.market,
    }).asCallback(callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        db.transaction((trx) => {
          processCompleteSetsPurchasedOrSoldLog(trx, t.params.augur, t.params.log, (err) => {
            assert.ifError(err);
            getState(trx, t.params, (err, positions) => {
              t.assertions.onUpdated(err, positions);
              processCompleteSetsPurchasedOrSoldLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                assert.ifError(err);
                getState(trx, t.params, (err, positions) => {
                  t.assertions.onUpdated(err, positions);
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
    description: "CompleteSetsPurchased log and removal",
    params: {
      log: {
        market: "0x0000000000000000000000000000000000000002",
        account: "0x0000000000000000000000000000000000000b0b",
        numCompleteSets: "2",
      },
      augur: {
        api: {
          Orders: {
            getLastOutcomePrice: (p, callback) => {
              assert.strictEqual(p._market, "0x0000000000000000000000000000000000000002");
              if (p._outcome === 0) {
                callback(null, "7000");
              } else {
                callback(null, "1250");
              }
            },
          },
        },
        utils: {
          convertOnChainPriceToDisplayPrice: (onChainPrice, minDisplayPrice, tickSize) => {
            return onChainPrice.times(tickSize).plus(minDisplayPrice);
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
            assert.strictEqual(p.market, "0x0000000000000000000000000000000000000002");
            assert.strictEqual(p.address, "0x0000000000000000000000000000000000000b0b");
            callback(null, ["2", "2", "2", "2", "2", "2", "2", "2"]);
          },
          normalizePrice: p => p.price,
        },
      },
    },
    assertions: {
      onUpdated: (err, positions) => {
        assert.ifError(err);
        assert.deepEqual(positions, [{
          positionId: 21,
          account: "0x0000000000000000000000000000000000000b0b",
          marketId: "0x0000000000000000000000000000000000000002",
          outcome: 0,
          numShares: new BigNumber("2", 10),
          numSharesAdjustedForUserIntention: new BigNumber("2", 10),
          realizedProfitLoss: new BigNumber("0", 10),
          unrealizedProfitLoss: new BigNumber("0", 10),
          averagePrice: new BigNumber("0.75", 10),
          lastUpdated: positions[0].lastUpdated,
        }, {
          positionId: 22,
          account: "0x0000000000000000000000000000000000000b0b",
          marketId: "0x0000000000000000000000000000000000000002",
          outcome: 1,
          numShares: new BigNumber("2", 10),
          numSharesAdjustedForUserIntention: new BigNumber("0", 10),
          realizedProfitLoss: new BigNumber("0", 10),
          unrealizedProfitLoss: new BigNumber("0", 10),
          averagePrice: new BigNumber("0", 10),
          lastUpdated: positions[0].lastUpdated,
        }, {
          positionId: 23,
          account: "0x0000000000000000000000000000000000000b0b",
          marketId: "0x0000000000000000000000000000000000000002",
          outcome: 2,
          numShares: new BigNumber("2", 10),
          numSharesAdjustedForUserIntention: new BigNumber("0", 10),
          realizedProfitLoss: new BigNumber("0", 10),
          unrealizedProfitLoss: new BigNumber("0", 10),
          averagePrice: new BigNumber("0", 10),
          lastUpdated: positions[0].lastUpdated,
        }, {
          positionId: 24,
          account: "0x0000000000000000000000000000000000000b0b",
          marketId: "0x0000000000000000000000000000000000000002",
          outcome: 3,
          numShares: new BigNumber("2", 10),
          numSharesAdjustedForUserIntention: new BigNumber("0", 10),
          realizedProfitLoss: new BigNumber("0", 10),
          unrealizedProfitLoss: new BigNumber("0", 10),
          averagePrice: new BigNumber("0", 10),
          lastUpdated: positions[0].lastUpdated,
        }, {
          positionId: 25,
          account: "0x0000000000000000000000000000000000000b0b",
          marketId: "0x0000000000000000000000000000000000000002",
          outcome: 4,
          numShares: new BigNumber("2", 10),
          numSharesAdjustedForUserIntention: new BigNumber("0", 10),
          realizedProfitLoss: new BigNumber("0", 10),
          unrealizedProfitLoss: new BigNumber("0", 10),
          averagePrice: new BigNumber("0", 10),
          lastUpdated: positions[0].lastUpdated,
        }, {
          positionId: 26,
          account: "0x0000000000000000000000000000000000000b0b",
          marketId: "0x0000000000000000000000000000000000000002",
          outcome: 5,
          numShares: new BigNumber("2", 10),
          numSharesAdjustedForUserIntention: new BigNumber("0", 10),
          realizedProfitLoss: new BigNumber("0", 10),
          unrealizedProfitLoss: new BigNumber("0", 10),
          averagePrice: new BigNumber("0", 10),
          lastUpdated: positions[0].lastUpdated,
        }, {
          positionId: 27,
          account: "0x0000000000000000000000000000000000000b0b",
          marketId: "0x0000000000000000000000000000000000000002",
          outcome: 6,
          numShares: new BigNumber("2", 10),
          numSharesAdjustedForUserIntention: new BigNumber("0", 10),
          realizedProfitLoss: new BigNumber("0", 10),
          unrealizedProfitLoss: new BigNumber("0", 10),
          averagePrice: new BigNumber("0", 10),
          lastUpdated: positions[0].lastUpdated,
        }, {
          positionId: 28,
          account: "0x0000000000000000000000000000000000000b0b",
          marketId: "0x0000000000000000000000000000000000000002",
          outcome: 7,
          numShares: new BigNumber("2", 10),
          numSharesAdjustedForUserIntention: new BigNumber("0", 10),
          realizedProfitLoss: new BigNumber("0", 10),
          unrealizedProfitLoss: new BigNumber("0", 10),
          averagePrice: new BigNumber("0", 10),
          lastUpdated: positions[0].lastUpdated,
        }]);
      },
    },
  });
});
