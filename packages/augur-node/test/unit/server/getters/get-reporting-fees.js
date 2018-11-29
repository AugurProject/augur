const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

const augur = {
  constants: {
    REPORTING_STATE: {
      AWAITING_FINALIZATION: "AWAITING_FINALIZATION",
      FINALIZED: "FINALIZED",
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

describe("server/getters/get-reporting-fees", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  afterEach(async () => {
    await db.destroy();
  });

  const runTest = (t) => {
    test(t.description, async () => {
      t.method = "getReportingFees";
      const reportingFees = await dispatchJsonRpcRequest(db, t, t.params.augur);
      t.assertions(reportingFees);
    });
  };

  test("Get reporting fees that exist in forked universe", async () => {
    const params = {
      universe: "0x000000000000000000000000000000000000000b",
      reporter: "0x0000000000000000000000000000000000000b0b",
    };
    await expect(await dispatchJsonRpcRequest(db, { method: "getReportingFees", params }, augur)).toEqual({
      total: {
        "unclaimedRepEarned": "0",
        "unclaimedRepStaked": "331",
        "unclaimedForkRepStaked": "331",
        "lostRep": "0",
      },
      forkedMarket: {
        crowdsourcers: [
          {
            crowdsourcerId: "0x0000000000000000001000000000000000000006",
            needsFork: true,
          },
        ],
        initialReporter: {
          initialReporterId: "0x0000000000000000000000000000000000abe222",
          needsFork: true,
        },
        isFinalized: 1,
        marketId: "0x00000000000000000000000000000000000000f1",
        universe: "0x000000000000000000000000000000000000000b",
      },
      nonforkedMarkets: [
        {
          "marketId": "0x0000000000000000000000000000000000000019",
          "crowdsourcers": ["0x0000000000000000001000000000000000000003"],
          "crowdsourcersAreDisavowed": false,
          "initialReporter": "0x0000000000000000000000000000000000abe111",
          "isFinalized": true,
          "isMigrated": true,
          "universe": "0x000000000000000000000000000000000000000b",
        },
      ],
    });
  });

  runTest({
    description: "Get reporting fees that exist in child universe",
    params: {
      universe: "CHILD_UNIVERSE",
      reporter: "0x0000000000000000000000000000000000000b0b",
      augur: {
        constants: {
          REPORTING_STATE: {
            AWAITING_FINALIZATION: "AWAITING_FINALIZATION",
            FINALIZED: "FINALIZED",
          },
        },
        rpc: {
          getNetworkID: () => 974,
        },
      },
    },
    assertions: (marketsMatched) => {
      expect(marketsMatched).toEqual({
        total: {
          "unclaimedRepStaked": "0",
          "unclaimedRepEarned": "0",
          "unclaimedForkRepStaked": "0",
          "lostRep": "0",
        },
        forkedMarket: undefined,
        "nonforkedMarkets": [],
      });
    },
  });
  runTest({
    description: "Get reporting fees for user that does not exist",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reporter: "0x00000000000000000000000000000000000n0b0b",
      augur: {
        constants: {
          REPORTING_STATE: {
            AWAITING_FINALIZATION: "AWAITING_FINALIZATION",
            FINALIZED: "FINALIZED",
          },
        },
        rpc: {
          getNetworkID: () => 974,
        },
      },
    },
    assertions: (marketsMatched) => {
      expect(marketsMatched).toEqual({
        total: {
          "unclaimedRepStaked": "0",
          "unclaimedRepEarned": "0",
          "unclaimedForkRepStaked": "0",
          "lostRep": "0",
        },
        forkedMarket: {
          "isFinalized": 1,
          "crowdsourcers": [],
          "marketId": "0x00000000000000000000000000000000000000f1",
          "universe": "0x000000000000000000000000000000000000000b",
        },
        nonforkedMarkets: [],
      });
    },
  });
  test("Get reporting fees for universe that does not exist", async () => {
    const params = {
      universe: "0x000000000000000000000000000000000000n0n0",
      reporter: "0x0000000000000000000000000000000000000b0b",
    };
    await expect(dispatchJsonRpcRequest(db, {
      method: "getReportingFees",
      params,
    }, augur)).rejects.toEqual(new Error("Universe not found"));
  });
});
