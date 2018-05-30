"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getMarketsInCategory } = require("../../../build/server/getters/get-markets-in-category");

describe("server/getters/get-markets-in-category", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        getMarketsInCategory(db, t.params.universe, t.params.category, t.params.sortBy, t.params.isSortDescending, t.params.limit, t.params.offset, (err, marketsInCategory) => {
          t.assertions(err, marketsInCategory);
          db.destroy();
          done();
        });
      });
    });
  };
  test({
    description: "category with markets in it",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      category: "test category",
    },
    assertions: (err, marketsInCategory) => {
      assert.ifError(err);
      assert.deepEqual(marketsInCategory, [
        "0x0000000000000000000000000000000000000015",
        "0x0000000000000000000000000000000000000012",
        "0x0000000000000000000000000000000000000013",
        "0x0000000000000000000000000000000000000014",
        "0x0000000000000000000000000000000000000016",
        "0x0000000000000000000000000000000000000017",
        "0x0000000000000000000000000000000000000018",
        "0x0000000000000000000000000000000000000019",
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000003",
        "0x0000000000000000000000000000000000000011",
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000211",
        "0x0000000000000000000000000000000000000222",
        "0x00000000000000000000000000000000000000f1",
      ]);
    },
  });
  test({
    description: "category with markets in it, limit 2",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      category: "test category",
      limit: 2,
    },
    assertions: (err, marketsInCategory) => {
      assert.ifError(err);
      assert.deepEqual(marketsInCategory, [
        "0x0000000000000000000000000000000000000015",
        "0x0000000000000000000000000000000000000012",
      ]);
    },
  });
  test({
    description: "empty category",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      category: "empty category",
    },
    assertions: (err, marketsInCategory) => {
      assert.ifError(err);
      assert.deepEqual(marketsInCategory, []);
    },
  });
});
