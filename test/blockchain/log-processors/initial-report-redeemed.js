"use strict";

const Augur = require("augur.js");

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { processInitialReporterRedeemedLog, processInitialReporterRedeemedLogRemoval } = require("../../../build/blockchain/log-processors/initial-report-redeemed");

const getInitialReport = (db, params, callback) => {
  db("initial_reports").first(["redeemed"]).where("initial_reports.marketID", params.log.market).asCallback(callback);
};

describe("blockchain/log-processors/initial-report-redeemed", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          processInitialReporterRedeemedLog(db, t.params.augur, trx, t.params.log, (err) => {
            assert.isNull(err);
            getInitialReport(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processInitialReporterRedeemedLogRemoval(db, t.params.augur, trx, t.params.log, (err) => {
                getInitialReport(trx, t.params, (err, records) => {
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
        api: {},
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          redeemed: 1,
        });
      },
      onRemoved: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          redeemed: 0,
        });
      },
    },
  });
});
