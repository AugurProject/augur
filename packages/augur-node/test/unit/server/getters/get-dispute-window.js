const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");
const { setOverrideTimestamp, removeOverrideTimestamp } = require("src/blockchain/process-block");

const augur = {
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
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  const runTest = (t) => {
    test(t.description, async () => {
      const timestamp = t.params.overrideTimestamp || 1;
      await setOverrideTimestamp(db, timestamp);
      t.method = "getDisputeWindow";
      const disputeWindow = await dispatchJsonRpcRequest(db, t, augur);
      t.assertions(disputeWindow);
      expect(removeOverrideTimestamp(db, timestamp)).rejects.toEqual(new Error(`Timestamp removal failed ${timestamp} ${timestamp}`));
    });
  };
  runTest({
    description: "get disputeWindow",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      overrideTimestamp: 1509065475,
      disputeWindowState: "CuRrENT",
    },
    assertions: (disputeWindow) => {
      expect(disputeWindow).toEqual({
        endTime: 1509670273,
        disputeWindow: "0x2000000000000000000000000000000000000000",
        feeToken: "FEE_TOKEN_2",
        disputeWindowId: 457,
        disputeWindowFeeTokens: "100",
        disputeWindowParticipationTokens: "1000",
        startTime: 1509065473,
        disputeWindowEthFees: "2000",
        disputeWindowRepStaked: "1100",
        universe: "0x000000000000000000000000000000000000000b",
      });
    },
  });
  runTest({
    description: "get specific disputeWindow",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      overrideTimestamp: 2,
      disputeWindow: "0x2000000000000000000000000000000000000000",
    },
    assertions: (disputeWindow) => {
      expect(disputeWindow).toEqual({
        endTime: 1509670273,
        disputeWindow: "0x2000000000000000000000000000000000000000",
        feeToken: "FEE_TOKEN_2",
        disputeWindowId: 457,
        startTime: 1509065473,
        disputeWindowEthFees: "2000",
        disputeWindowRepStaked: "1100",
        disputeWindowFeeTokens: "100",
        disputeWindowParticipationTokens: "1000",
        universe: "0x000000000000000000000000000000000000000b",
      });
    },
  });
  runTest({
    description: "get disputeWindow current with account b0b on dispute window 0x2",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reporter: "0x0000000000000000000000000000000000000b0b",
      disputeWindowState: "current",
      overrideTimestamp: 1509065473,
    },
    assertions: (disputeWindow) => {
      expect(disputeWindow).toEqual({
        endTime: 1509670273,
        disputeWindow: "0x2000000000000000000000000000000000000000",
        feeToken: "FEE_TOKEN_2",
        disputeWindowId: 457,
        startTime: 1509065473,
        totalStake: "132",
        participantContributions: "102",
        participantContributionsCrowdsourcer: "0",
        participantContributionsInitialReport: "102",
        participationTokens: "30",
        participantParticipationTokens: "30",
        disputeWindowEthFees: "2000",
        disputeWindowRepStaked: "1100",
        disputeWindowFeeTokens: "100",
        disputeWindowParticipationTokens: "1000",
        universe: "0x000000000000000000000000000000000000000b",
      });
    },
  });
  runTest({
    description: "get disputeWindow with no account on dispute window that does not yet exist",
    params: {
      universe: "CHILD_UNIVERSE",
      overrideTimestamp: 1626620468,
      disputeWindowState: "current",
    },
    assertions: (disputeWindow) => {
      expect(disputeWindow).toEqual({
        endTime: 1626912000,
        disputeWindow: null,
        disputeWindowId: 2689,
        startTime: 1626307200,
        universe: "CHILD_UNIVERSE",
      });
    },
  });
  runTest({
    description: "get disputeWindow with no account on a next dispute window",
    params: {
      universe: "CHILD_UNIVERSE",
      overrideTimestamp: 1508565473,
      disputeWindowState: "next",
    },
    assertions: (disputeWindow) => {
      expect(disputeWindow).toEqual({
        endTime: 1511657473,
        feeToken: "FEE_TOKEN_CHILD_UNIVERSE",
        disputeWindow: "0x4000000000000000000000000000000000000000",
        disputeWindowEthFees: "0",
        disputeWindowId: 459,
        disputeWindowRepStaked: "0",
        disputeWindowFeeTokens: "0",
        disputeWindowParticipationTokens: "0",
        startTime: 1509065473,
        universe: "CHILD_UNIVERSE",
      });
    },
  });
  runTest({
    description: "get disputeWindow that exists, but lacks any stake",
    params: {
      universe: "0x000000000000000000000000000000000000000d",
      overrideTimestamp: 1526620468,
      disputeWindowState: "current",
    },
    assertions: (disputeWindow) => {
      expect(disputeWindow).toEqual({
        endTime: 1527120000,
        disputeWindow: null,
        disputeWindowId: 2524,
        startTime: 1526515200,
        universe: "0x000000000000000000000000000000000000000d",
      });
    },
  });
  runTest({
    description: "get disputeWindow with non-existent account on dispute window 0x2",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reporter: "0x0000000000000000000000000000000000n0n0n0",
      overrideTimestamp: 1509065474,
      disputeWindowState: "current",
    },
    assertions: (disputeWindow) => {
      expect(disputeWindow).toEqual({
        endTime: 1509670273,
        disputeWindow: "0x2000000000000000000000000000000000000000",
        feeToken: "FEE_TOKEN_2",
        disputeWindowId: 457,
        startTime: 1509065473,
        totalStake: "0",
        participantContributions: "0",
        participantContributionsCrowdsourcer: "0",
        participantContributionsInitialReport: "0",
        participationTokens: "0",
        participantParticipationTokens: "0",
        disputeWindowEthFees: "2000",
        disputeWindowRepStaked: "1100",
        disputeWindowFeeTokens: "100",
        disputeWindowParticipationTokens: "1000",
        universe: "0x000000000000000000000000000000000000000b",
      });
    },
  });
  test("nonexistent universe", async () => {
    const params = {
      universe: "0x1010101010101010101010101010101010101010",
      disputeWindowState: "current",
    };
    await expect(dispatchJsonRpcRequest(db, {
      method: "getDisputeWindow",
      params,
    }, augur)).rejects.toEqual(new Error("Universe does not exist"));
  });

  afterEach(async () => {
    await db.destroy();
  });
});
