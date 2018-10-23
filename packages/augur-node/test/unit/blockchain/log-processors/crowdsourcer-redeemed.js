"use strict";

const setupTestDb = require("../../test.database");
const {processDisputeCrowdsourcerRedeemedLog, processDisputeCrowdsourcerRedeemedLogRemoval} = require("src/blockchain/log-processors/crowdsourcer");

describe("blockchain/log-processors/crowdsourcer-redeemed", () => {
  const runTest = (t) => {
    const getRedeemed = (db, params, callback) => db.select(["reporter", "crowdsourcer", "amountRedeemed", "repReceived", "reportingFeesReceived"]).from("crowdsourcer_redeemed").asCallback(callback);
    test(t.description, async (done) => {
const db = await setupTestDb();
      db.transaction((trx) => {
        processDisputeCrowdsourcerRedeemedLog(trx, t.params.augur, t.params.log, (err) => {
          expect(err).toBeFalsy();
          getRedeemed(trx, t.params, (err, records) => {
            t.assertions.onAdded(err, records);
            processDisputeCrowdsourcerRedeemedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
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
        disputeCrowdsourcer: "DISPUTE_CROWDSOURCER",
        amountRedeemed: "200",
        repReceived: "400",
        reportingFeesReceived: "900",
      },
    },
    assertions: {
      onAdded: (err, records) => {
        expect(err).toBeFalsy();
        expect(records).toEqual([{
          amountRedeemed: "200",
          crowdsourcer: "DISPUTE_CROWDSOURCER",
          repReceived: "400",
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
