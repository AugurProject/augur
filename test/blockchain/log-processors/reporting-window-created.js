"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { processReportingWindowCreatedLog, processReportingWindowCreatedLogRemoval } = require("../../../build/blockchain/log-processors/reporting-window-created");

const getReportingWindow = (db, params, callback) => {
  db("reporting_windows").first(["reportingWindow", "reportingWindowID", "endTime"]).where({reportingWindow: params.log.reportingWindow}).asCallback(callback);
};

describe("blockchain/log-processors/reporting-window-created", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          processReportingWindowCreatedLog(db, t.params.augur, trx, t.params.log, (err) => {
            assert.isNull(err);
            getReportingWindow(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processReportingWindowCreatedLogRemoval(db, t.params.augur, trx, t.params.log, (err) => {
                getReportingWindow(trx, t.params, (err, records) => {
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
    description: "reporting window created ",
    params: {
      log: {
        universe: "0x000000000000000000000000000000000000000b",
        reportingWindow: "0xf000000000000000000000000000000000000000",
        startTime: 1510065473,
        endTime: 1512657473,
        id: 40304,
        blockNumber: 160101,
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          endTime: 1512657473,
          reportingWindow: "0xf000000000000000000000000000000000000000",
          reportingwindowID: 40304,
        });
      },
      onRemoved: (err, records) => {
        assert.isNull(err);
        assert.isUndefined(records);
      },
    },
  });
});
