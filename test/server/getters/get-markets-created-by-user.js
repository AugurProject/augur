"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getMarketsCreatedByUser } = require("../../../build/server/getters/get-markets-created-by-user");

describe("server/getters/get-markets-created-by-user", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        getMarketsCreatedByUser(db, t.params.universe, t.params.creator, t.params.earliestCreationTime, t.params.latestCreationTime, t.params.sortBy, t.params.isSortDescending, t.params.limit, t.params.offset, (err, marketsCreatedByUser) => {
          t.assertions(err, marketsCreatedByUser);
          db.destroy();
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
      assert.ifError(err);
      assert.deepEqual(marketsCreatedByUser, [
        "0x0000000000000000000000000000000000000016",
        "0x0000000000000000000000000000000000000012",
        "0x0000000000000000000000000000000000000013",
        "0x0000000000000000000000000000000000000014",
        "0x0000000000000000000000000000000000000015",
        "0x0000000000000000000000000000000000000017",
        "0x0000000000000000000000000000000000000018",
        "0x0000000000000000000000000000000000000019",
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000011",
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000211",
        "0x0000000000000000000000000000000000000222",
        "0x00000000000000000000000000000000000000f1",
      ]);
    },
  });
  test({
    description: "user has created many markets but we filter by time",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      creator: "0x0000000000000000000000000000000000000b0b",
      earliestCreationTime: 1506474500,
    },
    assertions: (err, marketsCreatedByUser) => {
      assert.ifError(err);
      assert.deepEqual(marketsCreatedByUser, [
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000211",
        "0x0000000000000000000000000000000000000222",
        "0x00000000000000000000000000000000000000f1",
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
      assert.ifError(err);
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
      assert.ifError(err);
      assert.deepEqual(marketsCreatedByUser, []);
    },
  });
});
