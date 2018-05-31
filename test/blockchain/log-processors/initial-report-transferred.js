"use strict";

const Augur = require("augur.js");

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { processInitialReporterTransferredLog, processInitialReporterTransferredLogRemoval } = require("../../../build/blockchain/log-processors/initial-report-transferred");

const getInitialReport = (db, params, callback) => {
  db("initial_reports").first(["reporter"]).where("initial_reports.marketId", params.log.market).asCallback(callback);
};

describe("blockchain/log-processors/initial-report-transferred", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        db.transaction((trx) => {
          processInitialReporterTransferredLog(trx, t.params.augur, t.params.log, (err) => {
            assert.ifError(err);
            getInitialReport(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processInitialReporterTransferredLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                assert.ifError(err);
                getInitialReport(trx, t.params, (err, records) => {
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
        assert.ifError(err);
        assert.deepEqual(records, {
          reporter: "0x0000000000000000000000000000000000000d0d",
        });
      },
      onRemoved: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, {
          reporter: "0x0000000000000000000000000000000000000b0b",
        });
      },
    },
  });
});
