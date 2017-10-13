"use strict";

const join = require("path").join;
const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getMarketsInCategory } = require("../../../build/server/getters/get-markets-in-category");

const augurDbPath = join(__dirname, "augur.db");

describe("server/getters/get-markets-in-category", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        getMarketsInCategory(db, t.params.category, t.params.sortBy, t.params.limit, (err, marketsCreatedByUser) => {
          t.assertions(err, marketsCreatedByUser);
          done();
        });
      });
    });
  };
  test({
    description: "category with markets in it",
    params: {
      category: "test topic"
    },
    assertions: (err, marketsCreatedByUser) => {
      assert.isNull(err);
      assert.deepEqual(marketsCreatedByUser, [
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000002"
      ]);
    }
  });
});
