"use strict";

const Augur = require("augur.js");

const {BigNumber} = require("bignumber.js");
const setupTestDb = require("../../test.database");
const {processInitialReportSubmittedLog, processInitialReportSubmittedLogRemoval} = require("src/blockchain/log-processors/initial-report-submitted");
const {setOverrideTimestamp, removeOverrideTimestamp} = require("src/blockchain/process-block");

const getReportingState = (db, params, callback) => {
  db("markets").first(["reportingState", "initialReportSize", "marketCreatorFeesBalance"]).where("markets.marketId", params.log.market).join("market_state", "market_state.marketStateId", "markets.marketStateId").asCallback(callback);
};

const getInitialReport = (db, params, callback) => {
  db("initial_reports").first(["reporter", "amountStaked", "initialReporter"]).where("initial_reports.marketId", params.log.market).asCallback(callback);
};

describe("blockchain/log-processors/initial-report-submitted", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
const db = await setupTestDb();
      db.transaction((trx) => {
        setOverrideTimestamp(trx, t.params.overrideTimestamp, (err) => {
          expect(err).toBeFalsy();
          processInitialReportSubmittedLog(trx, t.params.augur, t.params.log, (err) => {
            expect(err).toBeFalsy();
            getReportingState(trx, t.params, (err, records) => {
              expect(err).toBeFalsy();
              t.assertions.onAdded(err, records);
              getInitialReport(trx, t.params, (err, records) => {
                expect(err).toBeFalsy();
                t.assertions.onAddedInitialReport(err, records);
                processInitialReportSubmittedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                  expect(err).toBeFalsy();
                  getReportingState(trx, t.params, (err, records) => {
                    t.assertions.onRemoved(err, records);
                    removeOverrideTimestamp(trx, t.params.overrideTimestamp, (err) => {
                      expect(err).not.toBeNull();
                      db.destroy();
                      done();
                    });
                  });
                });
              });
            });
          });
        });
      });
    })
  };
  runTest({
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
          Universe: {
            getFeeWindowByTimestamp: (p, callback) => {
              expect(p.tx.to).toBe("0x000000000000000000000000000000000000000b");
              const feeWindowByTimestamp = {
                1509085473: "0x2000000000000000000000000000000000000000",
                1509690273: "0x2100000000000000000000000000000000000000",
              };
              const feeWindow = feeWindowByTimestamp[p._timestamp];
              expect(typeof feeWindow).toBe("string");
              callback(null, feeWindow);
            },
          },
        },
        rpc: {
          eth: {
            getBalance: (p, callback) => {
              expect(p).toEqual(["0xbbb0000000000000000000000000000000000001", "latest"]);
              callback(null, "0x22");
            },
          },
        },
      },
      overrideTimestamp: 1509085473,
    },
    assertions: {
      onAdded: (err, records) => {
        expect(err).toBeFalsy();
        expect(records).toEqual({
          initialReportSize: new BigNumber("2829", 10),
          reportingState: "AWAITING_NEXT_WINDOW",
          marketCreatorFeesBalance: new BigNumber("0x22", 16),
        });
      },
      onAddedInitialReport: (err, records) => {
        expect(err).toBeFalsy();
        expect(records).toEqual({
          reporter: "0x0000000000000000000000000000000000000b0b",
          amountStaked: new BigNumber("2829", 10),
          initialReporter: "0x0000000000000000000000000000000000abe123",
        });
      },
      onRemoved: (err, records) => {
        expect(err).toBeFalsy();
        expect(records).toEqual({
          initialReportSize: null,
          reportingState: "DESIGNATED_REPORTING",
          marketCreatorFeesBalance: new BigNumber("0x22", 16),
        });
      },
    },
  });
});
