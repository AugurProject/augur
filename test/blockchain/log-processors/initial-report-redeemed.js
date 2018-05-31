"use strict";

const Augur = require("augur.js");

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { processInitialReporterRedeemedLog, processInitialReporterRedeemedLogRemoval } = require("../../../build/blockchain/log-processors/initial-report-redeemed");

const getInitialReport = (db, params, callback) => {
  db("initial_reports").first(["redeemed"]).where("initial_reports.marketId", params.log.market).asCallback(callback);
};

describe("blockchain/log-processors/initial-report-redeemed", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        db.transaction((trx) => {
          processInitialReporterRedeemedLog(trx, t.params.augur, t.params.log, (err) => {
            assert.ifError(err);
            getInitialReport(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processInitialReporterRedeemedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
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
        assert.ifError(err);
        assert.deepEqual(records, {
          redeemed: 1,
        });
      },
      onRemoved: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, {
          redeemed: 0,
        });
      },
    },
  });
});
