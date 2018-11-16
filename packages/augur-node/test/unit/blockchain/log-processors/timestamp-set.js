"use strict";

const setupTestDb = require("../../test.database");
const {processTimestampSetLog, processTimestampSetLogRemoval} = require("src/blockchain/log-processors/timestamp-set");
const {getOverrideTimestamp} = require("src/blockchain/process-block");

function initializeNetwork(db, callback) {
  db.insert({networkId: 9999}).into("network_id").asCallback(callback);
}

describe("blockchain/log-processors/timestamp-set", () => {
  const runTest = (t) => {
    const getTimestampState = (db, params, callback) => db.select("overrideTimestamp").from("network_id").first().asCallback(callback);
    test(t.description, async (done) => {
const db = await setupTestDb();
      db.transaction((trx) => {
        initializeNetwork(trx, (err) => {
          expect(err).toBeFalsy();
          processTimestampSetLog(trx, t.params.augur, t.params.log1, (err) => {
            expect(err).toBeFalsy();
            getTimestampState(trx, t.params, (err, records) => {
              t.assertions.onAdded1(err, records, getOverrideTimestamp());
              processTimestampSetLog(trx, t.params.augur, t.params.log2, (err) => {
                expect(err).toBeFalsy();
                getTimestampState(trx, t.params, (err, records) => {
                  t.assertions.onAdded2(err, records, getOverrideTimestamp());
                  processTimestampSetLogRemoval(trx, t.params.augur, t.params.log2, (err) => {
                    expect(err).toBeFalsy();
                    getTimestampState(trx, t.params, (err, records) => {
                      t.assertions.onRemoved2(err, records, getOverrideTimestamp());
                      processTimestampSetLogRemoval(trx, t.params.augur, t.params.log1, (err) => {
                        t.assertions.onRemoved1(err, records, getOverrideTimestamp());
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
      });
    })
  };
  runTest({
    description: "set timestamp",
    params: {
      log1: {
        blockNumber: 1400002,
        newTimestamp: 919191,
      },
      log2: {
        blockNumber: 1400001,
        newTimestamp: 828282,
      },
    },
    assertions: {
      onAdded1: (err, records, overrideTimestamp) => {
        expect(err).toBeFalsy();
        expect(overrideTimestamp).toEqual(919191);
        expect(records).toEqual({
          overrideTimestamp: 919191,
        });
      },
      onAdded2: (err, records, overrideTimestamp) => {
        expect(err).toBeFalsy();
        expect(overrideTimestamp).toEqual(828282);
        expect(records).toEqual({
          overrideTimestamp: 828282,
        });
      },
      onRemoved1: (err, records, overrideTimestamp) => {
        expect(err).not.toBeNull();
      },
      onRemoved2: (err, records, overrideTimestamp) => {
        expect(err).toBeFalsy();
        expect(overrideTimestamp).toEqual(919191);
        expect(records).toEqual({
          overrideTimestamp: 919191,
        });
      },
    },
  });
});
