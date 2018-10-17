"use strict";

const setupTestDb = require("../../test.database");
const { getMarketsInCategory } = require("src/server/getters/get-markets-in-category");

describe("server/getters/get-markets-in-category", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
const db = await setupTestDb();
      getMarketsInCategory(db, t.params.universe, t.params.category, t.params.sortBy, t.params.isSortDescending, t.params.limit, t.params.offset, (err, marketsInCategory) => {
        t.assertions(err, marketsInCategory);
        db.destroy();
        done();
      });
    })
  };
  runTest({
    description: "category with markets in it",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      category: "TEST CATEGORY",
    },
    assertions: (err, marketsInCategory) => {
      expect(err).toBeFalsy();
      expect(marketsInCategory).toEqual([
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
  runTest({
    description: "category with markets in it, limit 2",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      category: "TEST CATEGORY",
      limit: 2,
    },
    assertions: (err, marketsInCategory) => {
      expect(err).toBeFalsy();
      expect(marketsInCategory).toEqual([
        "0x0000000000000000000000000000000000000015",
        "0x0000000000000000000000000000000000000012",
      ]);
    },
  });
  runTest({
    description: "empty category",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      category: "empty category",
    },
    assertions: (err, marketsInCategory) => {
      expect(err).toBeFalsy();
      expect(marketsInCategory).toEqual([]);
    },
  });
});
