"use strict";

const setupTestDb = require("../../test.database");
const {series} = require("async");
const {processUniverseForkedLog, processUniverseForkedLogRemoval} = require("src/blockchain/log-processors/universe-forked");

const otherMarket = "0x0000000000000000000000000000000000000222";

const getForkRows = (db, params, callback) => series({
  forkingMarket: next => db("markets").where({universe: params.log.universe, forking: 1}).asCallback(next),
  otherMarket: next => db("markets").where({marketId: otherMarket}).asCallback(next),
  universe: next => db("universes").where({universe: params.log.universe}).asCallback(next),
}, callback);

describe("blockchain/log-processors/universe-forked", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
const db = await setupTestDb();
      db.transaction((trx) => {
        processUniverseForkedLog(trx, t.params.augur, t.params.log, (err) => {
          expect(err).toBeFalsy();
          getForkRows(trx, t.params, (err, records) => {
            t.assertions.onAdded(err, records);
            processUniverseForkedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
              expect(err).toBeFalsy();
              getForkRows(trx, t.params, (err, records) => {
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
        expect(err).toBeFalsy();
        expect(records.forkingMarket.length).toEqual(2);
        expect(records.forkingMarket[0].universe).toEqual("0x000000000000000000000000000000000000000b");
        expect(records.forkingMarket[0].marketId).toEqual("0x0000000000000000000000000000000000000211");
        expect(records.forkingMarket[0].forking).toEqual(1);
        // Pre-existing hard-coded forked market
        expect(records.forkingMarket[1].universe).toEqual("0x000000000000000000000000000000000000000b");
        expect(records.forkingMarket[1].marketId).toEqual("0x00000000000000000000000000000000000000f1");
        expect(records.forkingMarket[1].forking).toEqual(1);
        expect(records.otherMarket[0].needsDisavowal).toEqual(1);
        expect(records.universe[0].forked).toEqual(1);
      },
      onRemoved: (err, records) => {
        expect(err).toBeFalsy();
        expect(records.forkingMarket.length).toEqual(1);
        expect(records.forkingMarket[0].universe).toEqual("0x000000000000000000000000000000000000000b");
        expect(records.forkingMarket[0].marketId).toEqual("0x00000000000000000000000000000000000000f1");
        expect(records.forkingMarket[0].forking).toEqual(1);
        expect(records.otherMarket[0].needsDisavowal).toEqual(0);
        expect(records.universe[0].forked).toEqual(0);
      },
    },
  });
});
