"use strict";

const unlink = require("fs").unlink;
const join = require("path").join;
const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getMarketsAwaitingReporting } = require("../../../build/server/getters/get-markets-awaiting-reporting");

describe("server/getters/get-markets-awaiting-reporting", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        getMarketsAwaitingReporting(db, t.params.reportingWindow, t.params.reportingPhase, t.params.sortBy, t.params.isSortDescending, t.params.limit, t.params.offset, (err, marketsAwaitingReporting) => {
          t.assertions(err, marketsAwaitingReporting);
          done();
        });
      });
    });
  };
  test({
    description: "get markets awaiting unknown reportingWindow",
    params: {
      reportingWindow: "0xf0f0f0f0f0f0f0f0b0b0b0b0b0b0b0f0f0f0f0b0"
    },
    assertions: (err, marketsAwaitingReporting) => {
      assert.isNull(err);
      assert.deepEqual(marketsAwaitingReporting, [])
    }
  });
});
