"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const {processTimestampSetLog, processTimestampSetLogRemoval} = require("../../../build/blockchain/log-processors/timestamp-set");
const {getOverrideTimestamp} = require("../../../build/blockchain/process-block");

function initializeNetwork(db, callback) {
  db.insert({networkId: 9999}).into("network_id").asCallback(callback);
}

describe("blockchain/log-processors/timestamp-set", () => {
  const test = (t) => {
    const getTimestampState = (db, params, callback) => db.select("overrideTimestamp").from("network_id").first().asCallback(callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        db.transaction((trx) => {
          initializeNetwork(trx, (err) => {
            assert.ifError(err);
            processTimestampSetLog(trx, t.params.augur, t.params.log1, (err) => {
              assert.ifError(err);
              getTimestampState(trx, t.params, (err, records) => {
                t.assertions.onAdded1(err, records, getOverrideTimestamp());
                processTimestampSetLog(trx, t.params.augur, t.params.log2, (err) => {
                  assert.ifError(err);
                  getTimestampState(trx, t.params, (err, records) => {
                    t.assertions.onAdded2(err, records, getOverrideTimestamp());
                    processTimestampSetLogRemoval(trx, t.params.augur, t.params.log2, (err) => {
                      assert.ifError(err);
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
      });
    });
  };
  test({
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
        assert.ifError(err);
        assert.equal(overrideTimestamp, 919191);
        assert.deepEqual(records, {
          overrideTimestamp: 919191,
        });
      },
      onAdded2: (err, records, overrideTimestamp) => {
        assert.ifError(err);
        assert.equal(overrideTimestamp, 828282);
        assert.deepEqual(records, {
          overrideTimestamp: 828282,
        });
      },
      onRemoved1: (err, records, overrideTimestamp) => {
        assert.isNotNull(err);
      },
      onRemoved2: (err, records, overrideTimestamp) => {
        assert.ifError(err);
        assert.equal(overrideTimestamp, 919191);
        assert.deepEqual(records, {
          overrideTimestamp: 919191,
        });
      },
    },
  });
});
