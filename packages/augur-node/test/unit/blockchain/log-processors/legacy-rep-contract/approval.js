"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../../test.database");
const { processApprovalLog, processApprovalLogRemoval } = require("src/blockchain/log-processors/token/approval");

describe("blockchain/log-processors/token/approval", () => {
  const runTest = (t) => {
    const getState = (db, params, callback) => db("approvals").where({ transactionHash: params.log.transactionHash, logIndex: params.log.logIndex }).asCallback(callback);
    it(t.description, async (done) => {
      const db = await setupTestDb();
      db.transaction((trx) => {
        processApprovalLog(trx, t.params.augur, t.params.log, (err) => {
          expect(err).toBeFalsy();
          getState(trx, t.params, (err, records) => {
            t.assertions.onAdded(err, records);
            processApprovalLogRemoval(trx, t.params.augur, t.params.log, (err) => {
              expect(err).toBeFalsy();
              getState(trx, t.params, (err, records) => {
                t.assertions.onRemoved(err, records);
                db.destroy();
                done();
              });
            });
          });
        });
      });
    });
  };
  runTest({
    description: "LegacyReputationToken Approval log and removal",
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
        expect(err).toBeFalsy();
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
        expect(err).toBeFalsy();
        assert.deepEqual(records, []);
      },
    },
  });
});
