"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getStakeTokens } = require("../../../build/server/getters/get-stake-tokens");

describe("server/getters/get-stake-tokens", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        getStakeTokens(db, t.params.universe, t.params.account, t.params.stakeTokenState, (err, stakeTokens) => {
          t.assertions(err, stakeTokens);
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
      stakeTokenState: "UNFINALIZED",
    },
    assertions: (err, stakeTokens) => {
      assert.isNull(err);
      assert.deepEqual(stakeTokens, {
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
          isInvalid: false,
          amountStaked: 17,
          winningToken: null,
          claimed: false,
          reportingState: "FIRST_REPORTING",
        },
      });
    },
  });
  test({
    description: "get unclaimed tokens for user reported correctly",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      account: "0x0000000000000000000000000000000000000021",
      stakeTokenState: "UNCLAIMED",
    },
    assertions: (err, stakeTokens) => {
      assert.isNull(err);
      assert.deepEqual(stakeTokens, {
        "0x0000000000000000001000000000000000000003": {
          stakeToken: "0x0000000000000000001000000000000000000003",
          marketID: "0x0000000000000000000000000000000000000019",
          payout0: 1,
          payout1: 1,
          payout2: null,
          payout3: null,
          payout4: null,
          payout5: null,
          payout6: null,
          payout7: null,
          isInvalid: false,
          amountStaked: 229,
          winningToken: true,
          claimed: false,
          reportingState: "FINALIZED",
        },
      });
    },
  });
  test({
    description: "unknown stakeTokenState",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      account: "0x0000000000000000000000000000000000000021",
      stakeTokenState: "FILLER_VALUE",
    },
    assertions: (err, stakeTokens) => {
      assert.isNotNull(err);
    },
  });
  test({
    description: "all stake tokens for 0x0000000000000000000000000000000000000021",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      account: "0x0000000000000000000000000000000000000021",
      stakeTokenState: "ALL",
    },
    assertions: (err, stakeTokens) => {
      assert.isNull(err);
      assert.deepEqual(stakeTokens, {
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
          isInvalid: false,
          amountStaked: 17,
          winningToken: null,
          claimed: false,
          reportingState: "FIRST_REPORTING",
        },
        "0x0000000000000000001000000000000000000003": {
          stakeToken: "0x0000000000000000001000000000000000000003",
          marketID: "0x0000000000000000000000000000000000000019",
          payout0: 1,
          payout1: 1,
          payout2: null,
          payout3: null,
          payout4: null,
          payout5: null,
          payout6: null,
          payout7: null,
          isInvalid: false,
          amountStaked: 229,
          winningToken: true,
          claimed: false,
          reportingState: "FINALIZED",
        },
      });
    },
  });
});
