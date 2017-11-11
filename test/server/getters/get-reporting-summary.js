"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getReportingSummary } = require("../../../build/server/getters/get-reporting-summary");

describe("server/getters/get-reporting-summary", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        getReportingSummary(db, t.params.reportingWindow, (err, reportingSummary) => {
          t.assertions(err, reportingSummary);
          done();
        });
      });
    });
  };
  test({
    description: "get valid reporting window",
    params: {
      reportingWindow: "0x1000000000000000000000000000000000000000",
    },
    assertions: (err, reportingSummary) => {
      assert.isNull(err);
      assert.deepEqual(reportingSummary, {
        "DESIGNATED_REPORTING": 3,
        "FIRST_REPORTING": 1,
      });
    },
  });
  test({
    description: "non-existent reporting window",
    params: {
      reportingWindow: "0xfffffffffffff000000000000000000000000000",
    },
    assertions: (err, reportingSummary) => {
      assert.isNull(err);
      assert.deepEqual(reportingSummary, {});
    },
  });
});
