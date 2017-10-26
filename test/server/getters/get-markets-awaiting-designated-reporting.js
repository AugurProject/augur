"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getMarketsAwaitingDesignatedReporting } = require("../../../build/server/getters/get-markets-awaiting-designated-reporting");

describe("server/getters/get-markets-awaiting-designated-reporting", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        getMarketsAwaitingDesignatedReporting(db, t.params.designatedReporter, t.params.sortBy, t.params.isSortDescending, t.params.limit, t.params.offset, (err, marketsAwaitingDesignatedReporting) => {
          t.assertions(err, marketsAwaitingDesignatedReporting);
          done();
        });
      });
    });
  };
  test({
    description: "get markets awaiting unknown designated reporter",
    params: {
      designatedReporter: "0xf0f0f0f0f0f0f0f0b0b0b0b0b0b0b0f0f0f0f0b0",
    },
    assertions: (err, marketsAwaitingDesignatedReporting) => {
      assert.isNull(err);
      assert.deepEqual(marketsAwaitingDesignatedReporting, []);
    },
  });
  test({
    description: "get all markets awaiting designated reporting, sorted ascending by volume",
    params: {
      sortBy: "volume",
      isSortDescending: false,
    },
    assertions: (err, marketsInfo) => {
      assert.isNull(err);
      assert.deepEqual(marketsInfo, [
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000003",
      ]);
    },
  });
  test({
    description: "get all markets awaiting designated reporting by d00d",
    params: {
      designatedReporter: "0x000000000000000000000000000000000000d00d",
    },
    assertions: (err, marketsInfo) => {
      assert.isNull(err);
      assert.deepEqual(marketsInfo, [
        "0x0000000000000000000000000000000000000003",
      ]);
    },
  });
});
