"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { BigNumber } = require("bignumber.js");
const { processBurnLog, processBurnLogRemoval } = require("../../../../src/blockchain/log-processors/token/burn");

describe("blockchain/log-processors/tokens-burned", () => {
  const test = (t) => {
    const getTokenBalances = (db, params, callback) => db.select(["balances.owner", "balances.token", "balances.balance", "token_supply.supply"]).from("balances").join("token_supply", "balances.token", "token_supply.token").where("balances.token", params.log.token).asCallback(callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        db.transaction((trx) => {
          processBurnLog(trx, t.params.augur, t.params.log, (err) => {
            assert.ifError(err);
            getTokenBalances(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processBurnLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                assert.ifError(err);
                getTokenBalances(trx, t.params, (err, records) => {
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
    description: "Tokens burned",
    params: {
      log: {
        transactionHash: "TRANSACTION_HASH",
        logIndex: 0,
        blockNumber: 1400101,
        target: "FROM_ADDRESS",
        token: "TOKEN_ADDRESS",
        amount: new BigNumber("9000", 10),
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
          owner: "FROM_ADDRESS",
          token: "TOKEN_ADDRESS",
          balance: new BigNumber("1", 10),
          supply: new BigNumber("1", 10),
        }]);
      },
      onRemoved: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, [{
          owner: "FROM_ADDRESS",
          token: "TOKEN_ADDRESS",
          balance: new BigNumber("9001", 10),
          supply: new BigNumber("9001", 10),
        }]);
      },
    },
  });
});
