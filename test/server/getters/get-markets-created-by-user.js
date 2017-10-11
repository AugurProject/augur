"use strict";

const unlink = require("fs").unlink;
const join = require("path").join;
const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getMarketsCreatedByUser } = require("../../../build/server/getters/get-markets-created-by-user");

const augurDbPath = join(__dirname, "augur.db");

describe("server/getters/get-markets-created-by-user", (): void => {
  const test = (t): void => {
    it(t.description, (done): void => {
      setupTestDb((err, db): void => {
        if (err) assert.fail(err);
        getMarketsCreatedByUser(db, t.params.creator, (err, marketsCreatedByUser): void => {
          t.assertions(err, marketsCreatedByUser);
          done();
        });
      });
    });
  };
  test({
    description: "user has created 2 markets",
    params: {
      creator: "0x0000000000000000000000000000000000000b0b"
    },
    assertions: (err, marketsCreatedByUser): void => {
      assert.isNull(err);
      assert.deepEqual(marketsCreatedByUser, [
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000002"
      ]);
    }
  });
  test({
    description: "user has created 1 market",
    params: {
      creator: "0x000000000000000000000000000000000000d00d"
    },
    assertions: (err, marketsCreatedByUser): void => {
      assert.isNull(err);
      assert.deepEqual(marketsCreatedByUser, [
        "0x0000000000000000000000000000000000000003"
      ]);
    }
  });
  test({
    description: "user has not created any markets",
    params: {
      creator: "0x0000000000000000000000000000000000000bbb"
    },
    assertions: (err, marketsCreatedByUser): void => {
      assert.isNull(err);
      assert.isUndefined(marketsCreatedByUser);
    }
  });
});
