"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getCategories } = require("../../../build/server/getters/get-categories");

describe("server/getters/get-categories", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        getCategories(db, t.params.universe, t.params.sortBy, t.params.isSortDescending, t.params.limit, t.params.offset, (err, categoriesInfo) => {
          t.assertions(err, categoriesInfo);
          db.destroy();
          done();
        });
      });
    });
  };
  test({
    description: "get categories in universe b sorted by popularity",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      sortBy: "popularity",
      isSortDescending: true,
    },
    assertions: (err, categoriesInfo) => {
      assert.ifError(err);
      assert.deepEqual(categoriesInfo, [
        { category: "finance", popularity: "12345" },
        { category: "politics", popularity: "5000" },
        { category: "ethereum", popularity: "1000" },
        { category: "augur", popularity: "500" },
        { category: "test category", popularity: "0" },
      ]);
    },
  });
  test({
    description: "nonexistent universe",
    params: {
      universe: "0x1010101010101010101010101010101010101010",
    },
    assertions: (err, categoriesInfo) => {
      assert.ifError(err);
      assert.deepEqual(categoriesInfo, []);
    },
  });
});
