"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { processUniverseForkedLog, processUniverseForkedLogRemoval } = require("../../../build/blockchain/log-processors/universe-forked");

describe("blockchain/log-processors/universe-forked", () => {
  const test = (t) => {
    const getForkingMarket = (db, params, callback) => db("markets").where({ universe: params.log.universe, forking: 1 }).asCallback(callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          processUniverseForkedLog(trx, t.params.augur, t.params.log, (err) => {
            assert.isNull(err);
            getForkingMarket(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processUniverseForkedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                assert.isNull(err);
                getForkingMarket(trx, t.params, (err, records) => {
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
    description: "New universe created",
    params: {
      log: {
        universe: "0x000000000000000000000000000000000000000b",
        blockNumber: 1500001,
      },
      augur: {
        api: {
          Universe: {
            getForkingMarket: (args, callback) => {
              return callback(null, "0x0000000000000000000000000000000000000211");
            },
          },
        },
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.isNull(err);
        assert.equal(records.length, 1);
        assert.equal(records[0].universe, "0x000000000000000000000000000000000000000b");
        assert.equal(records[0].marketId, "0x0000000000000000000000000000000000000211");
        assert.equal(records[0].forking, 1);
      },
      onRemoved: (err, records) => {
        assert.isNull(err);
        assert.equal(records.length, 0);
      },
    },
  });
});
