"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { BigNumber } = require("bignumber.js");
const { processTokensTransferredLog, processTokensTransferredLogRemoval } = require("../../../../build/blockchain/log-processors/tokens-transferred");

describe("blockchain/log-processors/tokens-transferred", () => {
  const test = (t) => {
    const getState = (db, params, callback) => db("transfers").where({ transactionHash: params.log.transactionHash, logIndex: params.log.logIndex }).asCallback(callback);
    const getTokenBalances = (db, params, callback) => db("balances").where({ token: params.log.token }).asCallback(callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        db.transaction((trx) => {
          processTokensTransferredLog(trx, t.params.augur, t.params.log, (err) => {
            assert.ifError(err);
            getState(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
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
      augur: {
        contracts: {
          addresses: {
            974: {
              LegacyReputationToken: "OTHER_ADDRESS",
            },
          },
        },
        rpc: {
          getNetworkID: () => 974,
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
          value: new BigNumber("9000", 10),
          blockNumber: 1400101,
        }]);
      },
      onRemoved: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, []);
      },
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
    description: "TokensTransferred log and removal, LegacyReputationToken",
    params: {
      log: {
        transactionHash: "TRANSACTION_HASH",
        logIndex: 0,
        from: "FROM_ADDRESS",
        to: "TO_ADDRESS",
        token: "LEGACY_REPUTATION_ADDRESS",
        value: "9000",
        blockNumber: 1400101,
      },
      augur: {
        contracts: {
          addresses: {
            974: {
              LegacyReputationToken: "LEGACY_REPUTATION_ADDRESS",
            },
          },
        },
        rpc: {
          getNetworkID: () => 974,
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
          token: "LEGACY_REPUTATION_ADDRESS",
          value: new BigNumber("9000", 10),
          blockNumber: 1400101,
        }]);
      },
      onRemoved: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, []);
      },
      onInitialBalances: (err, balances) => {
        assert.ifError(err);
        assert.deepEqual(balances, []);
      },
      onRemovedBalances: (err, balances) => {
        assert.ifError(err);
        assert.deepEqual(balances, []);
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
        contracts: {
          addresses: {
            974: {
              LegacyReputationToken: "OTHER_ADDRESS",
            },
          },
        },
        rpc: {
          getNetworkID: () => 974,
        },
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
    },
  });
});
