"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("../../../../src/server/dispatch-json-rpc-request");

describe("server/getters/get-categories", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        t.method = "getCategories";
        dispatchJsonRpcRequest(db, t, null, (err, categoriesInfo) => {
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
        { category: "FINANCE", popularity: "12345" },
        { category: "POLITICS", popularity: "5000" },
        { category: "ETHEREUM", popularity: "1000" },
        { category: "AUGUR", popularity: "500" },
        { category: "TEST CATEGORY", popularity: "0" },
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
