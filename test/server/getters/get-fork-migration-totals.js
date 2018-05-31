"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getForkMigrationTotals } = require("../../../build/server/getters/get-fork-migration-totals");

describe("server/getters/get-fork-migration-totals", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        getForkMigrationTotals(db, t.params.augur, t.params.parentUniverse, (err, forkMigrationTotals) => {
          t.assertions(err, forkMigrationTotals);
          db.destroy();
          done();
        });
      });
    });
  };
  test({
    description: "get the fork migration totals",
    params: {
      parentUniverse: "0x000000000000000000000000000000000000000b",
      augur: {},
    },
    assertions: (err, forkMigrationTotals) => {
      assert.ifError(err);
      assert.deepEqual(forkMigrationTotals, {
        "CHILD_UNIVERSE": {
          "isInvalid": 0,
          "payout": [
            "0",
            "10000",
          ],
          "repTotal": "2000",
          "universe": "CHILD_UNIVERSE",
        },
      });
    },
  });
});
