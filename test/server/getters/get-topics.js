"use strict";

const unlink = require("fs").unlink;
const join = require("path").join;
const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getTopics } = require("../../../build/server/getters/get-topics");

describe("server/getters/get-topics", (): void => {
  const test = (t): void => {
    it(t.description, (done): void => {
      setupTestDb((err, db): void => {
        if (err) assert.fail(err);
        getTopics(db, t.params.universe, (err, topicsInfo): void => {
          t.assertions(err, topicsInfo);
          done();
        });
      });
    });
  };
  test({
    description: "get topics in universe b sorted by popularity",
    params: {
      universe: "0x000000000000000000000000000000000000000b"
    },
    assertions: (err, topicsInfo): void => {
      assert.isNull(err);
      assert.deepEqual(topicsInfo, [
        { topic: "finance", popularity: 12345 },
        { topic: "politics", popularity: 5000 },
        { topic: "ethereum", popularity: 1000 },
        { topic: "augur", popularity: 500 },
        { topic: "test topic", popularity: 0 }
      ]);
    }
  });
  test({
    description: "nonexistent universe",
    params: {
      universe: "0x1010101010101010101010101010101010101010"
    },
    assertions: (err, topicsInfo): void => {
      assert.isNull(err);
      assert.isUndefined(topicsInfo);
    }
  });
});
