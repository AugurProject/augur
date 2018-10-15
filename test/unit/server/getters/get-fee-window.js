"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("../../../../src/server/dispatch-json-rpc-request");
const { setOverrideTimestamp, removeOverrideTimestamp } = require("../../../../src/blockchain/process-block");

const augurMock = {
  constants: {
    CONTRACT_INTERVAL: {
      DISPUTE_ROUND_DURATION_SECONDS: 7 * 24 * 3600,
    },
  },
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
};

describe("server/getters/get-fee-window", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        setOverrideTimestamp(db, t.params.overrideTimestamp || 1, (err) => {
          assert.ifError(err);
          t.method = "getFeeWindow";
          dispatchJsonRpcRequest(db,  t, t.params.augur, (err, feeWindow) => {
            t.assertions(err, feeWindow);
            removeOverrideTimestamp(db, t.params.overrideTimestamp || 1, (err) => {
              assert.isNotNull(err);
              db.destroy();
              done();
            });
          });
        });
      });
    });
  };
  test({
    description: "get feeWindow",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      augur: augurMock,
      overrideTimestamp: 1509065475,
      feeWindowState: "CuRrENT",
    },
    assertions: (err, feeWindow) => {
      assert.ifError(err);
      assert.deepEqual(feeWindow, {
        endTime: 1509670273,
        feeWindow: "0x2000000000000000000000000000000000000000",
        feeToken: "FEE_TOKEN_2",
        feeWindowId: 457,
        feeWindowFeeTokens: "100",
        feeWindowParticipationTokens: "1000",
        startTime: 1509065473,
        feeWindowEthFees: "2000",
        feeWindowRepStaked: "1100",
        universe: "0x000000000000000000000000000000000000000b",
      });
    },
  });
  test({
    description: "get specific feeWindow",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      augur: augurMock,
      overrideTimestamp: 2,
      feeWindow: "0x2000000000000000000000000000000000000000",
    },
    assertions: (err, feeWindow) => {
      assert.ifError(err);
      assert.deepEqual(feeWindow, {
        endTime: 1509670273,
        feeWindow: "0x2000000000000000000000000000000000000000",
        feeToken: "FEE_TOKEN_2",
        feeWindowId: 457,
        startTime: 1509065473,
        feeWindowEthFees: "2000",
        feeWindowRepStaked: "1100",
        feeWindowFeeTokens: "100",
        feeWindowParticipationTokens: "1000",
        universe: "0x000000000000000000000000000000000000000b",
      });
    },
  });
  test({
    description: "get feeWindow current with account b0b on fee window 0x2",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reporter: "0x0000000000000000000000000000000000000b0b",
      feeWindowState: "current",
      overrideTimestamp: 1509065473,
      augur: augurMock,
    },
    assertions: (err, feeWindow) => {
      assert.ifError(err);
      assert.deepEqual(feeWindow, {
        endTime: 1509670273,
        feeWindow: "0x2000000000000000000000000000000000000000",
        feeToken: "FEE_TOKEN_2",
        feeWindowId: 457,
        startTime: 1509065473,
        totalStake: "132",
        participantContributions: "102",
        participantContributionsCrowdsourcer: "0",
        participantContributionsInitialReport: "102",
        participationTokens: "30",
        participantParticipationTokens: "30",
        feeWindowEthFees: "2000",
        feeWindowRepStaked: "1100",
        feeWindowFeeTokens: "100",
        feeWindowParticipationTokens: "1000",
        universe: "0x000000000000000000000000000000000000000b",
      });
    },
  });
  test({
    description: "get feeWindow with no account on fee window that does not yet exist",
    params: {
      universe: "CHILD_UNIVERSE",
      overrideTimestamp: 1626620468,
      feeWindowState: "current",
      augur: augurMock,
    },
    assertions: (err, feeWindow) => {
      assert.ifError(err);
      assert.deepEqual(feeWindow, {
        endTime: 1626912000,
        feeWindow: null,
        feeWindowId: 2689,
        startTime: 1626307200,
        universe: "CHILD_UNIVERSE",
      });
    },
  });
  test({
    description: "get feeWindow with no account on a next fee window",
    params: {
      universe: "CHILD_UNIVERSE",
      overrideTimestamp: 1508565473,
      feeWindowState: "next",
      augur: augurMock,
    },
    assertions: (err, feeWindow) => {
      assert.ifError(err);
      assert.deepEqual(feeWindow, {
        endTime: 1511657473,
        feeToken: "FEE_TOKEN_CHILD_UNIVERSE",
        feeWindow: "0x4000000000000000000000000000000000000000",
        feeWindowEthFees: "0",
        feeWindowId: 459,
        feeWindowRepStaked: "0",
        feeWindowFeeTokens: "0",
        feeWindowParticipationTokens: "0",
        startTime: 1509065473,
        universe: "CHILD_UNIVERSE",
      });
    },
  });
  test({
    description: "get feeWindow that exists, but lacks any stake",
    params: {
      universe: "0x000000000000000000000000000000000000000d",
      overrideTimestamp: 1526620468,
      feeWindowState: "current",
      augur: augurMock,
    },
    assertions: (err, feeWindow) => {
      assert.ifError(err);
      assert.deepEqual(feeWindow, {
        endTime: 1527120000,
        feeWindow: null,
        feeWindowId: 2524,
        startTime: 1526515200,
        universe: "0x000000000000000000000000000000000000000d",
      });
    },
  });
  test({
    description: "get feeWindow with non-existent account on fee window 0x2",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reporter: "0x0000000000000000000000000000000000n0n0n0",
      overrideTimestamp: 1509065474,
      feeWindowState: "current",
      augur: augurMock,
    },
    assertions: (err, feeWindow) => {
      assert.ifError(err);
      assert.deepEqual(feeWindow, {
        endTime: 1509670273,
        feeWindow: "0x2000000000000000000000000000000000000000",
        feeToken: "FEE_TOKEN_2",
        feeWindowId: 457,
        startTime: 1509065473,
        totalStake: "0",
        participantContributions: "0",
        participantContributionsCrowdsourcer: "0",
        participantContributionsInitialReport: "0",
        participationTokens: "0",
        participantParticipationTokens: "0",
        feeWindowEthFees: "2000",
        feeWindowRepStaked: "1100",
        feeWindowFeeTokens: "100",
        feeWindowParticipationTokens: "1000",
        universe: "0x000000000000000000000000000000000000000b",
      });
    },
  });
  test({
    description: "nonexistent universe",
    params: {
      universe: "0x1010101010101010101010101010101010101010",
      feeWindowState: "current",
      augur: augurMock,
    },
    assertions: (err) => {
      assert.isNotNull(err);
    },
  });
});
