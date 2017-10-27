"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../../test.database");
const { processApprovalLog, processApprovalLogRemoval } = require("../../../../build/blockchain/log-processors/legacy-rep-contract/approval");

describe("blockchain/log-processors/legacy-rep-contract/approval", () => {
  const test = (t) => {
    const getState = (db, params, callback) => db("approvals").where({ transactionHash: params.log.transactionHash, logIndex: params.log.logIndex }).asCallback(callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          processApprovalLog(db, t.params.augur, trx, t.params.log, (err) => {
            assert.isNull(err);
            getState(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processApprovalLogRemoval(db, t.params.augur, trx, t.params.log, (err) => {
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
    description: "LegacyRepContract Approval log and removal",
    params: {
      log: {
        transactionHash: "TRANSACTION_HASH",
        logIndex: 0,
        owner: "OWNER_ADDRESS",
        spender: "SPENDER_ADDRESS",
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
          owner: "OWNER_ADDRESS",
          spender: "SPENDER_ADDRESS",
          token: "LEGACY_REP_CONTRACT_ADDRESS",
          value: 9000,
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
