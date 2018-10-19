"use strict";

const Augur = require("augur.js");

const setupTestDb = require("../../test.database");
const { processInitialReporterTransferredLog, processInitialReporterTransferredLogRemoval } = require("src/blockchain/log-processors/initial-report-transferred");

const getInitialReport = (db, params, callback) => {
  db("initial_reports").first(["reporter"]).where("initial_reports.marketId", params.log.market).asCallback(callback);
};

describe("blockchain/log-processors/initial-report-transferred", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
const db = await setupTestDb();
      db.transaction((trx) => {
        processInitialReporterTransferredLog(trx, t.params.augur, t.params.log, (err) => {
          expect(err).toBeFalsy();
          getInitialReport(trx, t.params, (err, records) => {
            t.assertions.onAdded(err, records);
            processInitialReporterTransferredLogRemoval(trx, t.params.augur, t.params.log, (err) => {
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
    description: "Initial report transferred",
    params: {
      log: {
        market: "0x0000000000000000000000000000000000000011",
        from: "0x0000000000000000000000000000000000000b0b",
        to: "0x0000000000000000000000000000000000000d0d",
      },
      augur: {
        constants: new Augur().constants,
      },
    },
    assertions: {
      onAdded: (err, records) => {
        expect(err).toBeFalsy();
        expect(records).toEqual({
          reporter: "0x0000000000000000000000000000000000000d0d",
        });
      },
      onRemoved: (err, records) => {
        expect(err).toBeFalsy();
        expect(records).toEqual({
          reporter: "0x0000000000000000000000000000000000000b0b",
        });
      },
    },
  });
});
