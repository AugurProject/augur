"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getMarketsCreatedByUser } = require("../../../build/server/getters/get-markets-created-by-user");

describe("server/getters/get-markets-created-by-user", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        getMarketsCreatedByUser(db, t.params.universe, t.params.creator, t.params.sortBy, t.params.isSortDescending, t.params.limit, t.params.offset, (err, marketsCreatedByUser) => {
          t.assertions(err, marketsCreatedByUser);
          done();
        });
      });
    });
  };
  test({
    description: "user has created 3 markets",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      creator: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (err, marketsCreatedByUser) => {
      assert.isNull(err);
      assert.deepEqual(marketsCreatedByUser, [
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000011",
      ]);
    },
  });
  test({
    description: "user has created 1 market",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      creator: "0x000000000000000000000000000000000000d00d",
    },
    assertions: (err, marketsCreatedByUser) => {
      assert.isNull(err);
      assert.deepEqual(marketsCreatedByUser, [
        "0x0000000000000000000000000000000000000003",
      ]);
    },
  });
  test({
    description: "user has not created any markets",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      creator: "0x0000000000000000000000000000000000000bbb",
    },
    assertions: (err, marketsCreatedByUser) => {
      assert.isNull(err);
      assert.deepEqual(marketsCreatedByUser, []);
    },
  });
});
