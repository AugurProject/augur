"use strict";

const setupTestDb = require("../../test.database");
const { processUniverseCreatedLog, processUniverseCreatedLogRemoval } = require("src/blockchain/log-processors/universe-created");

describe("blockchain/log-processors/universe-created", () => {
  const runTest = (t) => {
    const getUniverse = (db, params, callback) => db("universes").first().where({ universe: params.log.childUniverse }).asCallback(callback);
    test(t.description, async (done) => {
const db = await setupTestDb();
      db.transaction((trx) => {
        processUniverseCreatedLog(trx, t.params.augur, t.params.log, (err) => {
          expect(err).toBeFalsy();
          getUniverse(trx, t.params, (err, records) => {
            t.assertions.onAdded(err, records);
            processUniverseCreatedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
              expect(err).toBeFalsy();
              getUniverse(trx, t.params, (err, records) => {
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
        expect(err).toBeFalsy();
        expect(records.universe).toEqual("0x000000000000000000000000000000000000000c");
        expect(records.parentUniverse).toEqual("0x000000000000000000000000000000000000000b");
        expect(records.reputationToken).toEqual("0x0000000000000000000000000000000000000222");
        expect(records.forked).toEqual(false);
        expect(typeof records.payoutId).toBe("number");
      },
      onRemoved: (err, records) => {
        expect(err).toBeFalsy();
        expect(records).not.toBeDefined();
      },
    },
  });
});
