"use strict";

const setupTestDb = require("../../test.database");
const { BigNumber } = require("bignumber.js");
const { processMintLog, processMintLogRemoval } = require("src/blockchain/log-processors/token/mint");

describe("blockchain/log-processors/tokens-minted", () => {
  const runTest = (t) => {
    const getTokenBalances = (db, params, callback) => db.select(["balances.owner", "balances.token", "balances.balance", "token_supply.supply"]).from("balances").join("token_supply", "balances.token", "token_supply.token").where("balances.token", params.log.token).asCallback(callback);
    test(t.description, async (done) => {
const db = await setupTestDb();
      db.transaction((trx) => {
        processMintLog(trx, t.params.augur, t.params.log, (err) => {
          expect(err).toBeFalsy();
          getTokenBalances(trx, t.params, (err, records) => {
            t.assertions.onAdded(err, records);
            processMintLogRemoval(trx, t.params.augur, t.params.log, (err) => {
              expect(err).toBeFalsy();
              getTokenBalances(trx, t.params, (err, records) => {
                t.assertions.onRemoved(err, records);
                db.destroy();
                done();
              });
            });
          });
        });
      });
    })
  };
  runTest({
    description: "Tokens minted",
    params: {
      log: {
        transactionHash: "TRANSACTION_HASH",
        logIndex: 0,
        blockNumber: 1400101,
        target: "FROM_ADDRESS",
        token: "TOKEN_ADDRESS",
        amount: new BigNumber("10", 10),
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
        expect(err).toBeFalsy();
        expect(records).toEqual([{
          owner: "FROM_ADDRESS",
          token: "TOKEN_ADDRESS",
          balance: new BigNumber("9011", 10),
          supply: new BigNumber("9011", 10),
        }]);
      },
      onRemoved: (err, records) => {
        expect(err).toBeFalsy();
        expect(records).toEqual([{
          owner: "FROM_ADDRESS",
          token: "TOKEN_ADDRESS",
          balance: new BigNumber("9001", 10),
          supply: new BigNumber("9001", 10),
        }]);
      },
    },
  });
});
