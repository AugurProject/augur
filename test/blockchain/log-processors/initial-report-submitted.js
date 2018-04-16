"use strict";

const Augur = require("augur.js");

const assert = require("chai").assert;
const {BigNumber} = require("bignumber.js");
const setupTestDb = require("../../test.database");
const {processInitialReportSubmittedLog, processInitialReportSubmittedLogRemoval} = require("../../../build/blockchain/log-processors/initial-report-submitted");
const {setOverrideTimestamp, removeOverrideTimestamp} = require("../../../build/blockchain/process-block.js");

const getReportingState = (db, params, callback) => {
  db("markets").first(["reportingState", "initialReportSize"]).where("markets.marketId", params.log.market).join("market_state", "market_state.marketStateId", "markets.marketStateId").asCallback(callback);
};

const getInitialReport = (db, params, callback) => {
  db("initial_reports").first(["reporter", "amountStaked", "initialReporter"]).where("initial_reports.marketId", params.log.market).asCallback(callback);
};

describe("blockchain/log-processors/initial-report-submitted", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          setOverrideTimestamp(trx, t.params.overrideTimestamp, (err) => {
            assert.isNull(err);
            processInitialReportSubmittedLog(trx, t.params.augur, t.params.log, (err) => {
              assert.isNull(err);
              getReportingState(trx, t.params, (err, records) => {
                assert.isNull(err);
                t.assertions.onAdded(err, records);
                getInitialReport(trx, t.params, (err, records) => {
                  assert.isNull(err);
                  t.assertions.onAddedInitialReport(err, records);
                  processInitialReportSubmittedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                    assert.isNull(err);
                    getReportingState(trx, t.params, (err, records) => {
                      t.assertions.onRemoved(err, records);
                      removeOverrideTimestamp(trx, t.params.overrideTimestamp, (err) => {
                        assert.isNotNull(err);
                        done();
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  };
  test({
    description: "Initial report submitted",
    params: {
      log: {
        universe: "0x000000000000000000000000000000000000000b",
        market: "0x0000000000000000000000000000000000000001",
        stakeToken: "0x1000000000000000000000000000000000000000",
        reporter: "0x0000000000000000000000000000000000000b0b",
        isDesignatedReporter: true,
        payoutNumerators: [0, 1],
        invalid: false,
        blockNumber: 1500001,
        amountStaked: "2829",
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000B00",
        logIndex: 0,
      },
      augur: {
        constants: new Augur().constants,
        api: {
          Market: {
            getInitialReporter: (p, callback) => {
              callback(null, "0x0000000000000000000000000000000000abe123");
            },
          },
        },
      },
      overrideTimestamp: 1509085473,
    },
    assertions: {
      onAdded: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          initialReportSize: new BigNumber("2829", 10),
          reportingState: "AWAITING_NEXT_WINDOW",
        });
      },
      onAddedInitialReport: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          reporter: "0x0000000000000000000000000000000000000b0b",
          amountStaked: new BigNumber("2829", 10),
          initialReporter: "0x0000000000000000000000000000000000abe123",
        });
      },
      onRemoved: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          initialReportSize: null,
          reportingState: "DESIGNATED_REPORTING",
        });
      },
    },
  });
});
