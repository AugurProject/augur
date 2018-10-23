"use strict";

const setupTestDb = require("../../test.database");
const {processFeeWindowRedeemedLog, processFeeWindowRedeemedLogRemoval} = require("src/blockchain/log-processors/fee-window-redeemed");

describe("blockchain/log-processors/fee-window-redeemed", () => {
  const runTest = (t) => {
    const getRedeemed = (db, params, callback) => db.select(["reporter", "feeWindow", "amountRedeemed", "reportingFeesReceived"]).from("participation_token_redeemed").asCallback(callback);
    test(t.description, async (done) => {
const db = await setupTestDb();
      db.transaction((trx) => {
        processFeeWindowRedeemedLog(trx, t.params.augur, t.params.log, (err) => {
          expect(err).toBeFalsy();
          getRedeemed(trx, t.params, (err, records) => {
            t.assertions.onAdded(err, records);
            processFeeWindowRedeemedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
              expect(err).toBeFalsy();
              getRedeemed(trx, t.params, (err, records) => {
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
        expect(err).toBeFalsy();
        expect(records).toEqual([{
          amountRedeemed: "200",
          feeWindow: "FEE_WINDOW",
          reporter: "REPORTER",
          reportingFeesReceived: "900",
        }]);
      },
      onRemoved: (err, records) => {
        expect(err).toBeFalsy();
        expect(records).toEqual([]);
      },
    },
  });
});
