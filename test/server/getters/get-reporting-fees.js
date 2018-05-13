"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const {getReportingFees} = require("../../../build/server/getters/get-reporting-fees");


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
      assert.isNull(err);
      assert.deepEqual(marketsMatched, {
        total: {
          "unclaimedEth": "107.87878787878787879",
          "unclaimedRepEarned": "114.5",
          "unclaimedRepStaked": "229",
          "lostRep": "0",
        },
        feeWindows: [
          "0x1000000000000000000000000000000000000000",
          "0x2000000000000000000000000000000000000000",
          "0x2100000000000000000000000000000000000000",
          "0x3000000000000000000000000000000000000000",
        ],
        forkedMarket: {
          crowdsourcers: [
            {
              crowdsourcerId: "0x0000000000000000001000000000000000000006",
              needsFork: true,
            },
            {
              crowdsourcerId: "0x0000000000000000001000000000000000000007",
              needsFork: false,
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
  test({
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
      assert.isNull(err);
      assert.deepEqual(marketsMatched, {
        total: {
          "unclaimedEth": "0",
          "unclaimedRepStaked": "0",
          "unclaimedRepEarned": "0",
          "lostRep": "0",
        },
        feeWindows: [
          "0x4000000000000000000000000000000000000000",
        ],
        forkedMarket: undefined,
        "nonforkedMarkets": [],
      });
    },
  });
  test({
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
      assert.isNull(err);
      assert.deepEqual(marketsMatched, {
        total: {
          "unclaimedEth": "0",
          "unclaimedRepStaked": "0",
          "unclaimedRepEarned": "0",
          "lostRep": "0",
        },
        feeWindows: [
          "0x1000000000000000000000000000000000000000",
          "0x2000000000000000000000000000000000000000",
          "0x2100000000000000000000000000000000000000",
          "0x3000000000000000000000000000000000000000",
        ],
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
  test({
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
      assert.deepEqual(err, Error("Universe or feeWindow not found"));
      assert.equal(marketsMatched, null);
    },
  });
  test({
    description: "Get reporting fees by feeWindow",
    params: {
      feeWindow: "0x1000000000000000000000000000000000000000",
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
      assert.isNull(err);
      assert.deepEqual(marketsMatched, {
        total: {
          "unclaimedEth": "53.33333333333333333",
          "unclaimedRepEarned": "114.5",
          "unclaimedRepStaked": "229",
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
            {
              crowdsourcerId: "0x0000000000000000001000000000000000000007",
              needsFork: false,
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
});
