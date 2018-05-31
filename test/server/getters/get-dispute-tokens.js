"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getDisputeTokens } = require("../../../build/server/getters/get-dispute-tokens");

describe("server/getters/get-dispute-tokens", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        getDisputeTokens(db, t.params.universe, t.params.account, t.params.stakeTokenState, (err, stakeTokens) => {
          t.assertions(err, stakeTokens);
          db.destroy();
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
      assert.ifError(err);
      assert.deepEqual(stakeTokens, {
        "0x0000000000000000001000000000000000000001": {
          disputeToken: "0x0000000000000000001000000000000000000001",
          marketId: "0x0000000000000000000000000000000000000011",
          payout0: "0",
          payout1: "2",
          payout2: null,
          payout3: null,
          payout4: null,
          payout5: null,
          payout6: null,
          payout7: null,
          isInvalid: false,
          balance: "17",
          winningToken: null,
          tentativeWinning: 0,
          claimed: false,
          reportingState: "CROWDSOURCING_DISPUTE",
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
      assert.ifError(err);
      assert.deepEqual(stakeTokens, {
        "0x0000000000000000001000000000000000000003": {
          disputeToken: "0x0000000000000000001000000000000000000003",
          marketId: "0x0000000000000000000000000000000000000019",
          payout0: "10000",
          payout1: "0",
          payout2: "0",
          payout3: "0",
          payout4: "0",
          payout5: null,
          payout6: null,
          payout7: null,
          isInvalid: false,
          balance: "229",
          tentativeWinning: 0,
          winningToken: true,
          claimed: false,
          reportingState: "FINALIZED",
        },
      });
    },
  });
  test({
    description: "get unclaimed tokens for user with no tokens",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      account: "0x0000000000000000000000000000000000000024",
      stakeTokenState: "UNCLAIMED",
    },
    assertions: (err, stakeTokens) => {
      assert.ifError(err);
      assert.deepEqual(stakeTokens, {});
    },
  });
  test({
    description: "unknown stakeTokenState",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      account: "0x0000000000000000000000000000000000000021",
      stakeTokenState: "FILLER_VALUE",
    },
    assertions: (err, stakeTokens) => { // assert stakeTokens
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
      assert.ifError(err);
      assert.deepEqual(stakeTokens, {
        "0x0000000000000000001000000000000000000001": {
          disputeToken: "0x0000000000000000001000000000000000000001",
          marketId: "0x0000000000000000000000000000000000000011",
          payout0: "0",
          payout1: "2",
          payout2: null,
          payout3: null,
          payout4: null,
          payout5: null,
          payout6: null,
          payout7: null,
          isInvalid: false,
          balance: "17",
          tentativeWinning: 0,
          winningToken: null,
          claimed: false,
          reportingState: "CROWDSOURCING_DISPUTE",
        },
        "0x0000000000000000001000000000000000000003": {
          disputeToken: "0x0000000000000000001000000000000000000003",
          marketId: "0x0000000000000000000000000000000000000019",
          payout0: "10000",
          payout1: "0",
          payout2: "0",
          payout3: "0",
          payout4: "0",
          payout5: null,
          payout6: null,
          payout7: null,
          isInvalid: false,
          balance: "229",
          tentativeWinning: 0,
          winningToken: true,
          claimed: false,
          reportingState: "FINALIZED",
        },
      });
    },
  });
});
