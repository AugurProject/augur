"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getUnfinalizedStakeTokens } = require("../../../build/server/getters/get-unfinalized-stake-tokens");

describe("server/getters/get-unfinalized-stake-tokens", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        getUnfinalizedStakeTokens(db, t.params.universe, t.params.account, (err, unfinalizedStakeTokens) => {
          t.assertions(err, unfinalizedStakeTokens);
          done();
        });
      });
    });
  };
  test({
    description: "get unfinalized tokens for user that actually exists",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      account: "0x0000000000000000000000000000000000000021",
    },
    assertions: (err, reportingHistory) => {
      assert.isNull(err);
      assert.deepEqual(reportingHistory, {
        "0x0000000000000000001000000000000000000001": {
          stakeToken: "0x0000000000000000001000000000000000000001",
          marketID: "0x0000000000000000000000000000000000000011",
          payout0: 0,
          payout1: 2,
          payout2: null,
          payout3: null,
          payout4: null,
          payout5: null,
          payout6: null,
          payout7: null,
          isInvalid: 0,
          amountStaked: 17,
          reportingState: "FIRST_REPORTING",
        },
      });
    },
  });
  test({
    description: "reporter has not submitted any reports",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      account: "0x2100000000000000000000000000000000000021",
    },
    assertions: (err, reportingHistory) => {
      assert.isNull(err);
      assert.deepEqual(reportingHistory, {});
    },
  });
});
