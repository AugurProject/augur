"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getReportingHistory } = require("../../../build/server/getters/get-reporting-history");

describe("server/getters/get-reporting-history", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        getReportingHistory(db, t.params.reporter, t.params.universe, t.params.marketID, t.params.reportingWindow, t.params.sortBy, t.params.isSortDescending, t.params.limit, t.params.offset, (err, reportingHistory) => {
          t.assertions(err, reportingHistory);
          done();
        });
      });
    });
  };
  test({
    description: "get reporter history that actually exists",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reporter: "0x0000000000000000000000000000000000000021",
    },
    assertions: (err, reportingHistory) => {
      assert.isNull(err);
      assert.deepEqual(reportingHistory, {
        "0x000000000000000000000000000000000000000b": {
          "0x0000000000000000000000000000000000000011": [{
            marketID: "0x0000000000000000000000000000000000000011",
            reportingWindow: "0x1000000000000000000000000000000000000000",
            payoutNumerators: [0, 2],
            amountStaked: 17,
            stakeToken: "0x0000000000000000001000000000000000000001",
            isCategorical: false,
            isScalar: false,
            isIndeterminate: false,
            isSubmitted: true,
          }],
          "0x0000000000000000000000000000000000000019": [{
            marketID: "0x0000000000000000000000000000000000000019",
            reportingWindow: "0x1000000000000000000000000000000000000000",
            payoutNumerators: [1, 1],
            amountStaked: 229,
            stakeToken: "0x0000000000000000001000000000000000000003",
            isCategorical: false,
            isScalar: false,
            isIndeterminate: false,
            isSubmitted: true,
          }],
        },
      });
    },
  });
  test({
    description: "reporter has not submitted any reports",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reporter: "0x2100000000000000000000000000000000000021",
    },
    assertions: (err, reportingHistory) => {
      assert.isNull(err);
      assert.deepEqual(reportingHistory, {});
    },
  });
});
