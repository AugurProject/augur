"use strict";

const setupTestDb = require("../../test.database");
const {processReportingParticipantDisavowedLog, processReportingParticipantDisavowedLogRemoval} = require("src/blockchain/log-processors/reporting-participant-disavowed");
const {series} = require("async");

const getParticipantState = (db, params, callback) => {
  series({
    initialReporter: (next) => db("initial_reports").first(["initialReporter", "disavowed"]).where("initialReporter", params.log.reportingParticipant).asCallback(next),
    crowdsourcer: (next) => db("crowdsourcers").first(["crowdsourcerId", "disavowed"]).where("crowdsourcerId", params.log.reportingParticipant).asCallback(next),
  }, callback);
};

describe("blockchain/log-processors/reporting-participant-disavowed", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
const db = await setupTestDb();
      db.transaction((trx) => {
        processReportingParticipantDisavowedLog(trx, t.params.augur, t.params.log, (err) => {
          expect(err).toBeFalsy();
          getParticipantState(trx, t.params, (err, records) => {
            t.assertions.onAdded(err, records);
            processReportingParticipantDisavowedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
              expect(err).toBeFalsy();
              getParticipantState(trx, t.params, (err, records) => {
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
        expect(err).toBeFalsy();
        expect(records.initialReporter).toEqual({
          disavowed: 1,
          initialReporter: "0x0000000000000000000000000000000000abe123",
        });
      },
      onRemoved: (err, records) => {
        expect(err).toBeFalsy();
        expect(records.initialReporter).toEqual({
          disavowed: 0,
          initialReporter: "0x0000000000000000000000000000000000abe123",
        });
      },
    },
  });
  runTest({
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
        expect(err).toBeFalsy();
        expect(records.crowdsourcer).toEqual({
          disavowed: 1,
          crowdsourcerId: "0x0000000000000000001000000000000000000005",
        });
      },
      onRemoved: (err, records) => {
        expect(err).toBeFalsy();
        expect(records.crowdsourcer).toEqual({
          disavowed: 0,
          crowdsourcerId: "0x0000000000000000001000000000000000000005",
        });
      },
    },
  });
});
