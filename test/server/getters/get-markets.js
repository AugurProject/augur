"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getMarkets } = require("../../../build/server/getters/get-markets");


describe("server/getters/get-markets", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        getMarkets(db, t.params.universe, t.params.sortBy, t.params.isSortDescending, t.params.limit, t.params.offset, (err, marketsMatched) => {
          t.assertions(err, marketsMatched);
          done();
        });
      });
    });
  };
  test({
    description: "get markets in universe b",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
    },
    assertions: (err, marketsMatched) => {
      assert.isNull(err);
      assert.deepEqual(marketsMatched, [
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000003",
        "0x0000000000000000000000000000000000000011",
      ]);
    },
  });
  test({
    description: "nonexistent universe",
    params: {
      universe: "0x1010101010101010101010101010101010101010",
    },
    assertions: (err, marketsMatched) => {
      assert.isNull(err);
      assert.deepEqual(marketsMatched, []);
    },
  });
});
