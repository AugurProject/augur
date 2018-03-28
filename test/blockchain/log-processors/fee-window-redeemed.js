"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const {processFeeWindowRedeemedLog, processFeeWindowRedeemedLogRemoval} = require("../../../build/blockchain/log-processors/fee-window-redeemed");

describe("blockchain/log-processors/fee-window-redeemed", () => {
  const test = (t) => {
    const getRedeemed = (db, params, callback) => db.select(["reporter", "feeWindow", "ethFees", "repFees"]).from("redeemed").asCallback(callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          processFeeWindowRedeemedLog(trx, t.params.augur, t.params.log, (err) => {
            assert.isNull(err);
            getRedeemed(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processFeeWindowRedeemedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                assert.isNull(err);
                getRedeemed(trx, t.params, (err, records) => {
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
    description: "Redeemed",
    params: {
      log: {
        transactionHash: "TRANSACTION_HASH",
        logIndex: 0,
        blockNumber: 1400101,
        reporter: "REPORTER",
        feeWindow: "FEE_WINDOW",
        amountRedeemed: "200",
        reportingFeesReceived: "900",
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, [{
          ethFees: "200",
          feeWindow: "FEE_WINDOW",
          repFees: "900",
          reporter: "REPORTER",
        }]);
      },
      onRemoved: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, []);
      },
    },
  });
});
