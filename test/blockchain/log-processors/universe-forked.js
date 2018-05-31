"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const {parallel} = require("async");
const {processUniverseForkedLog, processUniverseForkedLogRemoval} = require("../../../build/blockchain/log-processors/universe-forked");

const otherMarket = "0x0000000000000000000000000000000000000222";

const getForkRows = (db, params, callback) => parallel({
  forkingMarket: next => db("markets").where({universe: params.log.universe, forking: 1}).asCallback(next),
  otherMarket: next => db("markets").where({marketId: otherMarket}).asCallback(next),
  universe: next => db("universes").where({universe: params.log.universe}).asCallback(next),
}, callback);

describe("blockchain/log-processors/universe-forked", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        db.transaction((trx) => {
          processUniverseForkedLog(trx, t.params.augur, t.params.log, (err) => {
            assert.ifError(err);
            getForkRows(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processUniverseForkedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                assert.ifError(err);
                getForkRows(trx, t.params, (err, records) => {
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
        assert.ifError(err);
        assert.equal(records.forkingMarket.length, 2);
        assert.equal(records.forkingMarket[0].universe, "0x000000000000000000000000000000000000000b");
        assert.equal(records.forkingMarket[0].marketId, "0x0000000000000000000000000000000000000211");
        assert.equal(records.forkingMarket[0].forking, 1);
        // Pre-existing hard-coded forked market
        assert.equal(records.forkingMarket[1].universe, "0x000000000000000000000000000000000000000b");
        assert.equal(records.forkingMarket[1].marketId, "0x00000000000000000000000000000000000000f1");
        assert.equal(records.forkingMarket[1].forking, 1);
        assert.equal(records.otherMarket[0].needsDisavowal, 1);
        assert.equal(records.universe[0].forked, 1);
      },
      onRemoved: (err, records) => {
        assert.ifError(err);
        assert.equal(records.forkingMarket.length, 1);
        assert.equal(records.forkingMarket[0].universe, "0x000000000000000000000000000000000000000b");
        assert.equal(records.forkingMarket[0].marketId, "0x00000000000000000000000000000000000000f1");
        assert.equal(records.forkingMarket[0].forking, 1);
        assert.equal(records.otherMarket[0].needsDisavowal, 0);
        assert.equal(records.universe[0].forked, 0);
      },
    },
  });
});
