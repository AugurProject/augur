"use strict";

const Augur = require("augur.js");

const setupTestDb = require("../../test.database");
const { processInitialReporterRedeemedLog, processInitialReporterRedeemedLogRemoval } = require("src/blockchain/log-processors/initial-report-redeemed");

const getInitialReport = (db, params, callback) => {
  db("initial_reports").first(["redeemed"]).where("initial_reports.marketId", params.log.market).asCallback(callback);
};

describe("blockchain/log-processors/initial-report-redeemed", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
const db = await setupTestDb();
      db.transaction((trx) => {
        processInitialReporterRedeemedLog(trx, t.params.augur, t.params.log, (err) => {
          expect(err).toBeFalsy();
          getInitialReport(trx, t.params, (err, records) => {
            t.assertions.onAdded(err, records);
            processInitialReporterRedeemedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
              expect(err).toBeFalsy();
              getInitialReport(trx, t.params, (err, records) => {
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
    description: "Initial report redeemed",
    params: {
      log: {
        universe: "0x000000000000000000000000000000000000000b",
        reporter: "0x0000000000000000000000000000000000000b0b",
        market: "0x0000000000000000000000000000000000000011",
        amountRedeemed: 42,
        repReceived: 63,
        reportingFeesReceived: 1,
        payoutNumerators: [0, 1],
      },
      augur: {
        constants: new Augur().constants,
      },
    },
    assertions: {
      onAdded: (err, records) => {
        expect(err).toBeFalsy();
        expect(records).toEqual({
          redeemed: 1,
        });
      },
      onRemoved: (err, records) => {
        expect(err).toBeFalsy();
        expect(records).toEqual({
          redeemed: 0,
        });
      },
    },
  });
});
