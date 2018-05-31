"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { BigNumber } = require("bignumber.js");
const { processTokensTransferredLog, processTokensTransferredLogRemoval } = require("../../../build/blockchain/log-processors/tokens-transferred");

describe("blockchain/log-processors/tokens-transferred", () => {
  const test = (t) => {
    const getState = (db, params, callback) => db("transfers").where({ transactionHash: params.log.transactionHash, logIndex: params.log.logIndex }).asCallback(callback);
    const getPositionsState = (db, params, callback) => db("positions").where({ account: params.log.from, marketId: params.log.market }).asCallback(callback);
    const getTokenBalances = (db, params, callback) => db("balances").where({ token: params.log.token }).asCallback(callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        db.transaction((trx) => {
          processTokensTransferredLog(trx, t.params.augur, t.params.log, (err) => {
            assert.ifError(err);
            getState(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              getPositionsState(trx, t.params, (err, positions) => {
                t.assertions.onUpdatedPositions(err, positions);
                getTokenBalances(trx, t.params, (err, balances) => {
                  t.assertions.onInitialBalances(err, balances);
                  processTokensTransferredLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                    assert.ifError(err);
                    getState(trx, t.params, (err, records) => {
                      t.assertions.onRemoved(err, records);
                      getTokenBalances(trx, t.params, (err, balances) => {
                        t.assertions.onRemovedBalances(err, balances);
                        db.destroy();
                        done();
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  };
  test({
    description: "TokensTransferred log and removal",
    params: {
      log: {
        transactionHash: "TRANSACTION_HASH",
        logIndex: 0,
        from: "FROM_ADDRESS",
        to: "TO_ADDRESS",
        token: "TOKEN_ADDRESS",
        value: "9000",
        blockNumber: 1400101,
      },
      augur: {},
    },
    assertions: {
      onAdded: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, [{
          transactionHash: "TRANSACTION_HASH",
          logIndex: 0,
          sender: "FROM_ADDRESS",
          recipient: "TO_ADDRESS",
          token: "TOKEN_ADDRESS",
          value: new BigNumber("9000", 10),
          blockNumber: 1400101,
        }]);
      },
      onRemoved: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, []);
      },
      onUpdatedPositions: (err, records) => {},
      onInitialBalances: (err, balances) => {
        assert.ifError(err);
        assert.deepEqual(balances, [{
          token: "TOKEN_ADDRESS",
          owner: "FROM_ADDRESS",
          balance: new BigNumber("1", 10),
        }, {
          token: "TOKEN_ADDRESS",
          owner: "TO_ADDRESS",
          balance: new BigNumber("9000", 10),
        }]);
      },
      onRemovedBalances: (err, balances) => {
        assert.ifError(err);
        assert.deepEqual(balances, [{
          token: "TOKEN_ADDRESS",
          owner: "FROM_ADDRESS",
          balance: new BigNumber("9001", 10),
        }, {
          token: "TOKEN_ADDRESS",
          owner: "TO_ADDRESS",
          balance: new BigNumber("0", 10),
        }]);
      },
    },
  });
  test({
    description: "TokensTransferred for ShareToken log and removal",
    params: {
      log: {
        transactionHash: "TRANSACTION_HASH",
        logIndex: 0,
        from: "FROM_ADDRESS",
        to: "TO_ADDRESS",
        token: "TOKEN_ADDRESS",
        value: new BigNumber("2", 10),
        tokenType: 1,
        market: "0x0000000000000000000000000000000000000002",
        blockNumber: 1400101,
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
            assert.oneOf(p.address, ["FROM_ADDRESS", "TO_ADDRESS"]);
            callback(null, ["2", "0", "0", "0", "0", "0", "0", "0"]);
          },
          normalizePrice: p => p.price,
        },
        utils: {
          convertOnChainPriceToDisplayPrice: (onChainPrice, minDisplayPrice, tickSize) => {
            return onChainPrice.times(tickSize).plus(minDisplayPrice);
          },
        },
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, [{
          transactionHash: "TRANSACTION_HASH",
          logIndex: 0,
          sender: "FROM_ADDRESS",
          recipient: "TO_ADDRESS",
          token: "TOKEN_ADDRESS",
          value: new BigNumber("2", 10),
          blockNumber: 1400101,
        }]);
      },
      onRemoved: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, []);
      },
      onInitialBalances: (err, balances) => {
        assert.ifError(err);
        assert.deepEqual(balances, [
          {
            owner: "FROM_ADDRESS",
            token: "TOKEN_ADDRESS",
            balance: new BigNumber("8999"),
          },
          {
            owner: "TO_ADDRESS",
            token: "TOKEN_ADDRESS",
            balance: new BigNumber("2"),
          },
        ]);
      },
      onRemovedBalances: (err, balances) => {
        assert.ifError(err);
      },
      onUpdatedPositions: (err, positions) => {
        assert.ifError(err);
        assert.lengthOf(positions, 8);
        assert.deepEqual(positions, [{
          positionId: positions[0].positionId,
          account: "FROM_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000002",
          outcome: 0,
          numShares: new BigNumber("2", 10),
          numSharesAdjustedForUserIntention: new BigNumber("0", 10),
          realizedProfitLoss: new BigNumber("0", 10),
          unrealizedProfitLoss: new BigNumber("0", 10),
          averagePrice: new BigNumber("0", 10),
          lastUpdated: positions[0].lastUpdated,
        }, {
          positionId: positions[1].positionId,
          account: "FROM_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000002",
          outcome: 1,
          numShares: new BigNumber("0", 10),
          numSharesAdjustedForUserIntention: new BigNumber("0", 10),
          realizedProfitLoss: new BigNumber("0", 10),
          unrealizedProfitLoss: new BigNumber("0", 10),
          averagePrice: new BigNumber("0", 10),
          lastUpdated: positions[0].lastUpdated,
        }, {
          positionId: positions[2].positionId,
          account: "FROM_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000002",
          outcome: 2,
          numShares: new BigNumber("0", 10),
          numSharesAdjustedForUserIntention: new BigNumber("0", 10),
          realizedProfitLoss: new BigNumber("0", 10),
          unrealizedProfitLoss: new BigNumber("0", 10),
          averagePrice: new BigNumber("0", 10),
          lastUpdated: positions[0].lastUpdated,
        }, {
          positionId: positions[3].positionId,
          account: "FROM_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000002",
          outcome: 3,
          numShares: new BigNumber("0", 10),
          numSharesAdjustedForUserIntention: new BigNumber("0", 10),
          realizedProfitLoss: new BigNumber("0", 10),
          unrealizedProfitLoss: new BigNumber("0", 10),
          averagePrice: new BigNumber("0", 10),
          lastUpdated: positions[0].lastUpdated,
        }, {
          positionId: positions[4].positionId,
          account: "FROM_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000002",
          outcome: 4,
          numShares: new BigNumber("0", 10),
          numSharesAdjustedForUserIntention: new BigNumber("0", 10),
          realizedProfitLoss: new BigNumber("0", 10),
          unrealizedProfitLoss: new BigNumber("0", 10),
          averagePrice: new BigNumber("0", 10),
          lastUpdated: positions[0].lastUpdated,
        }, {
          positionId: positions[5].positionId,
          account: "FROM_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000002",
          outcome: 5,
          numShares: new BigNumber("0", 10),
          numSharesAdjustedForUserIntention: new BigNumber("0", 10),
          realizedProfitLoss: new BigNumber("0", 10),
          unrealizedProfitLoss: new BigNumber("0", 10),
          averagePrice: new BigNumber("0", 10),
          lastUpdated: positions[0].lastUpdated,
        }, {
          positionId: positions[6].positionId,
          account: "FROM_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000002",
          outcome: 6,
          numShares: new BigNumber("0", 10),
          numSharesAdjustedForUserIntention: new BigNumber("0", 10),
          realizedProfitLoss: new BigNumber("0", 10),
          unrealizedProfitLoss: new BigNumber("0", 10),
          averagePrice: new BigNumber("0", 10),
          lastUpdated: positions[0].lastUpdated,
        }, {
          positionId: positions[7].positionId,
          account: "FROM_ADDRESS",
          marketId: "0x0000000000000000000000000000000000000002",
          outcome: 7,
          numShares: new BigNumber("0", 10),
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
