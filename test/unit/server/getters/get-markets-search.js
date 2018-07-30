"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getMarketsSearch } = require("../../../../build/server/getters/get-markets-search");

describe("server/getters/get-markets-search", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        getMarketsSearch(db, t.params.universe, t.params.search, t.params.sortBy, t.params.isSortDescending, t.params.limit, t.params.offset, (err, marketsMatched) => {
          t.assertions(err, marketsMatched);
          db.destroy();
          done();
        });
      });
    });
  };
  test({
    description: "search for bob",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      search: "bob",
    },
    assertions: (err, marketsMatched) => {
      assert.ifError(err);
      assert.deepEqual(marketsMatched, [
        "0x0000000000000000000000000000000000000012",
        "0x0000000000000000000000000000000000000015",
      ]);
    },
  });
  test({
    description: "search for sue",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      search: "sue",
    },
    assertions: (err, marketsCreatedByUser) => {
      assert.ifError(err);
      assert.deepEqual(marketsCreatedByUser, [
        "0x0000000000000000000000000000000000000014",
        "0x0000000000000000000000000000000000000015",
        "0x0000000000000000000000000000000000000016",
        "0x0000000000000000000000000000000000000017",
        "0x0000000000000000000000000000000000000018",
        "0x0000000000000000000000000000000000000019",
      ]);
    },
  });
  test({
    description: "search for 'to the store'",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      search: "to the store",
    },
    assertions: (err, marketsCreatedByUser) => {
      assert.ifError(err);
      assert.deepEqual(marketsCreatedByUser, [
        "0x0000000000000000000000000000000000000018",
        "0x0000000000000000000000000000000000000019",
      ]);
    },
  });
});
