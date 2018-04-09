"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../../test.database");
const { BigNumber } = require("bignumber.js");
const { processTransferLog, processTransferLogRemoval } = require("../../../../build/blockchain/log-processors/token/transfer");

describe("blockchain/log-processors/token/transfer", () => {
  const test = (t) => {
    const getState = (db, params, callback) => db("transfers").where({ transactionHash: params.log.transactionHash, logIndex: params.log.logIndex }).asCallback(callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          processTransferLog(trx, t.params.augur, t.params.log, (err) => {
            assert.isNull(err);
            getState(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processTransferLogRemoval(trx, t.params.augur, t.params.log, (err) => {
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
    description: "LegacyReputationToken Transfer log and removal",
    params: {
      log: {
        transactionHash: "TRANSACTION_HASH",
        logIndex: 0,
        from: "FROM_ADDRESS",
        to: "TO_ADDRESS",
        address: "LEGACY_REP_CONTRACT_ADDRESS",
        value: "9000",
        blockNumber: 1400101,
      },
      augur: {},
    },
    assertions: {
      onAdded: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, [{
          transactionHash: "TRANSACTION_HASH",
          logIndex: 0,
          sender: "FROM_ADDRESS",
          recipient: "TO_ADDRESS",
          token: "LEGACY_REP_CONTRACT_ADDRESS",
          value: new BigNumber("9000", 10),
          blockNumber: 1400101,
        }]);
      },
      onRemoved: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, []);
      },
    },
  });
});
