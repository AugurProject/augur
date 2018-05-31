"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const {processReportingParticipantDisavowedLog, processReportingParticipantDisavowedLogRemoval} = require("../../../build/blockchain/log-processors/reporting-participant-disavowed");
const {parallel} = require("async");

const getParticipantState = (db, params, callback) => {
  parallel({
    initialReporter: (next) => db("initial_reports").first(["initialReporter", "disavowed"]).where("initialReporter", params.log.reportingParticipant).asCallback(next),
    crowdsourcer: (next) => db("crowdsourcers").first(["crowdsourcerId", "disavowed"]).where("crowdsourcerId", params.log.reportingParticipant).asCallback(next),
  }, callback);
};

describe("blockchain/log-processors/reporting-participant-disavowed", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        db.transaction((trx) => {
          processReportingParticipantDisavowedLog(trx, t.params.augur, t.params.log, (err) => {
            assert.ifError(err);
            getParticipantState(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processReportingParticipantDisavowedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                assert.ifError(err);
                getParticipantState(trx, t.params, (err, records) => {
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
    description: "initialReporter",
    params: {
      log: {
        universe: "0x000000000000000000000000000000000000000b",
        market: "0x0000000000000000000000000000000000000211",
        reportingParticipant: "0x0000000000000000000000000000000000abe123",
        blockNumber: 1400001,
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
        logIndex: 0,
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records.initialReporter, {
          disavowed: 1,
          initialReporter: "0x0000000000000000000000000000000000abe123",
        });
      },
      onRemoved: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records.initialReporter, {
          disavowed: 0,
          initialReporter: "0x0000000000000000000000000000000000abe123",
        });
      },
    },
  });
  test({
    description: "crowdsourcer",
    params: {
      log: {
        universe: "0x000000000000000000000000000000000000000b",
        market: "0x0000000000000000000000000000000000000011",
        reportingParticipant: "0x0000000000000000001000000000000000000005",
        blockNumber: 1400001,
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
        logIndex: 0,
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records.crowdsourcer, {
          disavowed: 1,
          crowdsourcerId: "0x0000000000000000001000000000000000000005",
        });
      },
      onRemoved: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records.crowdsourcer, {
          disavowed: 0,
          crowdsourcerId: "0x0000000000000000001000000000000000000005",
        });
      },
    },
  });
});
