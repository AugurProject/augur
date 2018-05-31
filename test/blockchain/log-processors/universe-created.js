"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { processUniverseCreatedLog, processUniverseCreatedLogRemoval } = require("../../../build/blockchain/log-processors/universe-created");

describe("blockchain/log-processors/universe-created", () => {
  const test = (t) => {
    const getUniverse = (db, params, callback) => db("universes").first().where({ universe: params.log.childUniverse }).asCallback(callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        db.transaction((trx) => {
          processUniverseCreatedLog(trx, t.params.augur, t.params.log, (err) => {
            assert.ifError(err);
            getUniverse(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processUniverseCreatedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                assert.ifError(err);
                getUniverse(trx, t.params, (err, records) => {
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
    description: "New universe created",
    params: {
      log: {
        childUniverse: "0x000000000000000000000000000000000000000c",
        parentUniverse: "0x000000000000000000000000000000000000000b",
        payoutNumerators: [0, 10000],
        invalid: false,
      },
      augur: {
        api: {
          Universe: {
            getReputationToken: (args, callback) => {
              return callback(null, "0x0000000000000000000000000000000000000222");
            },
          },
        },
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.ifError(err);
        assert.equal(records.universe, "0x000000000000000000000000000000000000000c");
        assert.equal(records.parentUniverse, "0x000000000000000000000000000000000000000b");
        assert.equal(records.reputationToken, "0x0000000000000000000000000000000000000222");
        assert.equal(records.forked, false);
        assert.isNumber(records.payoutId);
      },
      onRemoved: (err, records) => {
        assert.ifError(err);
        assert.isUndefined(records);
      },
    },
  });
});
