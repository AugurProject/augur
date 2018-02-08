"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getMarketsUpcomingDesignatedReporting } = require("../../../build/server/getters/get-markets-upcoming-designated-reporting");

describe("server/getters/get-markets-upcoming-designated-reporting", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        getMarketsUpcomingDesignatedReporting(db, t.params.universe, t.params.designatedReporter, t.params.sortBy, t.params.isSortDescending, t.params.limit, t.params.offset, (err, marketsUpcomingDesignatedReporting) => {
          t.assertions(err, marketsUpcomingDesignatedReporting);
          done();
        });
      });
    });
  };
  test({
    description: "get markets upcoming, unknown designated reporter",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      designatedReporter: "0xf0f0f0f0f0f0f0f0b0b0b0b0b0b0b0f0f0f0f0b0",
    },
    assertions: (err, marketsUpcomingDesignatedReporting) => {
      assert.isNull(err);
      assert.deepEqual(marketsUpcomingDesignatedReporting, []);
    },
  });
  test({
    description: "get all markets upcoming designated reporting, sorted ascending by volume",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      sortBy: "volume",
      isSortDescending: false,
    },
    assertions: (err, marketsUpcomingDesignatedReporting) => {
      assert.isNull(err);
      assert.deepEqual(marketsUpcomingDesignatedReporting, [
        "0x0000000000000000000000000000000000000222",
      ]);
    },
  });
  test({
    description: "get all markets upcoming designated reporting by b0b",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      designatedReporter: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (err, marketsInfo) => {
      assert.isNull(err);
      assert.deepEqual(marketsInfo, [
        "0x0000000000000000000000000000000000000222",
      ]);
    },
  });
});
