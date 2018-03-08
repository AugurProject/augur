"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { processUniverseCreatedLog, processUniverseCreatedLogRemoval } = require("../../../build/blockchain/log-processors/universe-created");

describe("blockchain/log-processors/universe-created", () => {
  const test = (t) => {
    const getUniverse = (db, params, callback) => db("universes").first().where({ universe: params.log.childUniverse }).asCallback(callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          processUniverseCreatedLog(trx, t.params.augur, t.params.log, (err) => {
            assert.isNull(err);
            getUniverse(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processUniverseCreatedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                assert.isNull(err);
                getUniverse(trx, t.params, (err, records) => {
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
        childUniverse: "0x000000000000000000000000000000000000000c",
        parentUniverse: "0x000000000000000000000000000000000000000b",
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          universe: "0x000000000000000000000000000000000000000c",
          parentUniverse: "0x000000000000000000000000000000000000000b",
        });
      },
      onRemoved: (err, records) => {
        assert.isNull(err);
        assert.isUndefined(records);
      },
    },
  });
});
