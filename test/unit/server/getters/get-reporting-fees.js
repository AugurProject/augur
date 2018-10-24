const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-reporting-fees", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
      const db = await setupTestDb();
      t.method = "getReportingFees";
      dispatchJsonRpcRequest(db, t, t.params.augur, (err, reportingFees) => {
        t.assertions(err, reportingFees);
        db.destroy();
        done();
      });
    });
  };
  runTest({
    description: "Get reporting fees that exist in forked universe",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reporter: "0x0000000000000000000000000000000000000b0b",
      augur: {
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
      },
    },
    assertions: (err, marketsMatched) => {
      expect(err).toBeFalsy();
      expect(marketsMatched).toEqual({
        total: {
          "unclaimedEth": "1200",
          "unclaimedRepEarned": "0",
          "unclaimedRepStaked": "391",
          "unclaimedForkEth": "0",
          "unclaimedForkRepStaked": "331",
          "lostRep": "0",
        },
        feeWindows: [
          "0x1000000000000000000000000000000000000000",
        ],
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
    },
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
      expect(err).toBeFalsy();
      expect(marketsMatched).toEqual({
        total: {
          "unclaimedEth": "0",
          "unclaimedRepStaked": "0",
          "unclaimedRepEarned": "0",
          "unclaimedForkEth": "0",
          "unclaimedForkRepStaked": "0",
          "lostRep": "0",
        },
        feeWindows: [],
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
      expect(err).toBeFalsy();
      expect(marketsMatched).toEqual({
        total: {
          "unclaimedEth": "0",
          "unclaimedRepStaked": "0",
          "unclaimedRepEarned": "0",
          "unclaimedForkEth": "0",
          "unclaimedForkRepStaked": "0",
          "lostRep": "0",
        },
        feeWindows: [],
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
  runTest({
    description: "Get reporting fees for universe that does not exist",
    params: {
      universe: "0x000000000000000000000000000000000000n0n0",
      reporter: "0x0000000000000000000000000000000000000b0b",
      augur: {
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
      },
    },
    assertions: (err, marketsMatched) => {
      expect(err).toEqual(Error("Universe not found"));
      expect(marketsMatched).toEqual(undefined);
    },
  });
});
