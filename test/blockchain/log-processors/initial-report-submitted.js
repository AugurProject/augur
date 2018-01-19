"use strict";

const Augur = require("augur.js");

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { processDesignatedReportSubmittedLog, processDesignatedReportSubmittedLogRemoval } = require("../../../build/blockchain/log-processors/designated-report-submitted");

const getReportingState = (db, params, callback) => {
  db("markets").first("reportingState").where("markets.marketID", params.log.market).join("market_state", "market_state.marketStateID", "markets.marketStateID").asCallback(callback);
};

describe("blockchain/log-processors/designated-report-submitted", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          processDesignatedReportSubmittedLog(db, t.params.augur, trx, t.params.log, (err) => {
            assert.isNull(err);
            getReportingState(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processDesignatedReportSubmittedLogRemoval(db, t.params.augur, trx, t.params.log, (err) => {
                getReportingState(trx, t.params, (err, records) => {
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
    description: "Designated report submitted",
    params: {
      log: {
        universe: "0x000000000000000000000000000000000000000b",
        market: "0x0000000000000000000000000000000000000001",
        stakeToken: "0x1000000000000000000000000000000000000000",
        reporter: "0x0000000000000000000000000000000000000b0b",
        payoutNumerators: [0, 1],
        blockNumber: 1400100,
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000B00",
        logIndex: 0,
      },
      augur: {constants: new Augur().constants},
    },
    assertions: {
      onAdded: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          reportingState: "DESIGNATED_DISPUTE",
        });
      },
      onRemoved: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          reportingState: "DESIGNATED_REPORTING",
        });
      },
    },
  });
});
