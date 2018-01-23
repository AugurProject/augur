"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { processReportSubmittedLog, processReportSubmittedLogRemoval } = require("../../../build/blockchain/log-processors/report-submitted");

const getReport = (db, params, callback) => {
  db("reports").first(["marketID", "reporter", "stakeToken", "amountStaked"]).where({transactionHash: params.log.transactionHash}).asCallback(callback);
};

describe("blockchain/log-processors/report-submitted", () => {
  const test = (t) => {
    xit(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          processReportSubmittedLog(db, t.params.augur, trx, t.params.log, (err) => {
            assert.isNull(err);
            getReport(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processReportSubmittedLogRemoval(db, t.params.augur, trx, t.params.log, (err) => {
                getReport(trx, t.params, (err, records) => {
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
    description: "report submitted",
    params: {
      log: {
        universe: "0x000000000000000000000000000000000000000b",
        market: "0x0000000000000000000000000000000000000001",
        stakeToken: "0x1000000000000000000000000000000000000000",
        reporter: "0x0000000000000000000000000000000000000b0b",
        amountStaked: 19381,
        payoutNumerators: [0, 1],
        blockNumber: 1400100,
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000B00",
        logIndex: 0,
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          marketID: "0x0000000000000000000000000000000000000001",
          stakeToken: "0x1000000000000000000000000000000000000000",
          reporter: "0x0000000000000000000000000000000000000b0b",
          amountStaked: 19381,
        });
      },
      onRemoved: (err, records) => {
        assert.isNull(err);
        assert.isUndefined(records);
      },
    },
  });
});
