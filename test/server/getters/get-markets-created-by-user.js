"use strict";

const unlink = require("fs").unlink;
const join = require("path").join;
const assert = require("chai").assert;
const sqlite3 = require("sqlite3").verbose();
const { checkAugurDbSetup } = require("../../../build/setup/check-augur-db-setup");
const { getMarketsCreatedByUser } = require("../../../build/server/getters/get-markets-created-by-user");

const augurDbPath = join(__dirname, "augur.db");

describe("server/getters/get-markets-created-by-user", () => {
  const test = (t) => {
    it(t.description, (done) => {
      const db = new sqlite3.Database(augurDbPath);
      checkAugurDbSetup(db, (err) => {
        getMarketsCreatedByUser(db, t.params.creator, (err, marketsCreatedByUser) => {
          t.assertions(err, marketsCreatedByUser);
          unlink(augurDbPath, done);
        });
      });
    });
  };
  test({
    description: "user has created 2 markets",
    params: {
      creator: "0x0000000000000000000000000000000000000b0b"
    },
    assertions: (err, marketsCreatedByUser) => {
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
    assertions: (err, marketsCreatedByUser) => {
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
    assertions: (err, marketsCreatedByUser) => {
      assert.isNull(err);
      assert.isUndefined(marketsCreatedByUser);
    }
  });
});
