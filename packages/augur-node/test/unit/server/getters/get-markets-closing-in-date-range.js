"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("../../../../src/server/dispatch-json-rpc-request");

describe("server/getters/get-markets-closing-in-date-range", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        t.method = "getMarketsClosingInDateRange";
        dispatchJsonRpcRequest(db, t, null, (err, marketsClosingInDateRange) => {
          t.assertions(err, marketsClosingInDateRange);
          db.destroy();
          done();
        });
      });
    });
  };
  test({
    description: "date range with 1 market closing",
    params: {
      earliestClosingTime: 1506573450,
      latestClosingTime: 1506573470,
      universe: "0x000000000000000000000000000000000000000b",
      limit: 10,
    },
    assertions: (err, marketsClosingInDateRange) => {
      assert.ifError(err);
      assert.deepEqual(marketsClosingInDateRange, [
        "0x0000000000000000000000000000000000000001",
      ]);
    },
  });
  test({
    description: "date range with 3 markets closing",
    params: {
      earliestClosingTime: 1506573450,
      latestClosingTime: 1506573510,
      universe: "0x000000000000000000000000000000000000000b",
      limit: 3,
    },
    assertions: (err, marketsClosingInDateRange) => {
      assert.ifError(err);
      assert.deepEqual(marketsClosingInDateRange, [
        "0x0000000000000000000000000000000000000003",
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000001",
      ]);
    },
  });
  test({
    description: "date range with 3 markets closing (limit 2)",
    params: {
      earliestClosingTime: 1506573450,
      latestClosingTime: 1506573510,
      universe: "0x000000000000000000000000000000000000000b",
      limit: 2,
    },
    assertions: (err, marketsClosingInDateRange) => {
      assert.ifError(err);
      assert.deepEqual(marketsClosingInDateRange, [
        "0x0000000000000000000000000000000000000003",
        "0x0000000000000000000000000000000000000002",
      ]);
    },
  });
  test({
    description: "date range with no market closings",
    params: {
      earliestClosingTime: 1506573450,
      latestClosingTime: 1506573469,
      universe: "0x000000000000000000000000000000000000000b",
      limit: 10,
    },
    assertions: (err, marketsClosingInDateRange) => {
      assert.ifError(err);
      assert.deepEqual(marketsClosingInDateRange, []);
    },
  });
});
