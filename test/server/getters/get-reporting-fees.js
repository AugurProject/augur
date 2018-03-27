"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getReportingFees } = require("../../../build/server/getters/get-reporting-fees");


describe("server/getters/get-reporting-fees", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((dbErr, db) => {
        if (dbErr) assert.fail(dbErr);
        getReportingFees(db, t.params.augur, t.params.reporter, t.params.universe, t.params.feeWindow, (err, marketsMatched) => {
          t.assertions(err, marketsMatched);
          done();
        });
      });
    });
  };
  test({
    description: "get markets in universe b",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reporter: "0x0000000000000000000000000000000000000b0b",
      augur: {
        version: "the-version-string",
        contracts: {
          addresses: {
            974: {
              Cash: "CASH",
            },
          },
        },
        rpc: {
          getNetworkID: () => 974,
        },
      },
    },
    assertions: (err, marketsMatched) => {
      assert.isNull(err);
      assert.deepEqual(marketsMatched, {
        "unclaimedEth": "1",
        "unclaimedRepStaked": "2",
        "unclaimedRepEarned": "3",
        "claimedEth": "4",
        "claimedRepStaked": "5",
        "claimedRepEarned": "6",
      });
    },
  });
});
