const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-dispute-tokens", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  afterEach(async () => {
    await db.destroy();
  });

  const runTest = (t) => {
    test(t.description, async () => {
      t.method = "getDisputeTokens";
      const stakeTokens = await dispatchJsonRpcRequest(db, t, {});
      t.assertions(stakeTokens);
    });
  };
  runTest({
    description: "get unfinalized tokens for user that actually exists",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      account: "0x0000000000000000000000000000000000000021",
      stakeTokenState: "UNFINALIZED",
    },
    assertions: (stakeTokens) => {
      expect(stakeTokens).toEqual({
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
  runTest({
    description: "get unclaimed tokens for user reported correctly",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      account: "0x0000000000000000000000000000000000000021",
      stakeTokenState: "UNCLAIMED",
    },
    assertions: (stakeTokens) => {
      expect(stakeTokens).toEqual({
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
  runTest({
    description: "get unclaimed tokens for user with no tokens",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      account: "0x0000000000000000000000000000000000000024",
      stakeTokenState: "UNCLAIMED",
    },
    assertions: (stakeTokens) => {
      expect(stakeTokens).toEqual({});
    },
  });
  runTest({
    description: "all stake tokens for 0x0000000000000000000000000000000000000021",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      account: "0x0000000000000000000000000000000000000021",
      stakeTokenState: "ALL",
    },
    assertions: (stakeTokens) => {
      expect(stakeTokens).toEqual({
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

  test("unknown stakeTokenState", async () => {
    const params = {
      universe: "0x000000000000000000000000000000000000000b",
      account: "0x0000000000000000000000000000000000000021",
      stakeTokenState: "FILLER_VALUE",
    };
    try {
      await dispatchJsonRpcRequest(db, { method: "getDisputeTokens", params }, {}).catch(console.log);
      throw new Error("Did not fail on unknown");
    } catch (e) {
      expect(e.message).toContain("Invalid request object");
    }
  });
});
