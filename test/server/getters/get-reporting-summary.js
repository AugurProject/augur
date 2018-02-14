"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const {getReportingSummary} = require("../../../build/server/getters/get-reporting-summary");

describe("server/getters/get-reporting-summary", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        getReportingSummary(db, t.params.feeWindow, (err, reportingSummary) => {
          t.assertions(err, reportingSummary);
          done();
        });
      });
    });
  };
  test({
    description: "get valid reporting window",
    params: {
      feeWindow: "0x1000000000000000000000000000000000000000",
    },
    assertions: (err, reportingSummary) => {
      assert.isNull(err);
      assert.deepEqual(reportingSummary, {
        "AWAITING_NEXT_WINDOW": 1,
        "DESIGNATED_REPORTING": 8,
        "CROWDSOURCING_DISPUTE": 2,
        "FINALIZED": 1,
        "PRE_REPORTING": 1,
      });
    },
  });
  test({
    description: "non-existent reporting window",
    params: {
      feeWindow: "0xfffffffffffff000000000000000000000000000",
    },
    assertions: (err, reportingSummary) => {
      assert.isNull(err);
      assert.deepEqual(reportingSummary, {});
    },
  });
});
