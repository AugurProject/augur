"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const {getReportingFees} = require("../../../build/server/getters/get-reporting-fees");


describe("server/getters/get-reporting-fees", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((dbErr, db) => {
        if (dbErr) assert.fail(dbErr);
        getReportingFees(db, t.params.augur, t.params.reporter, t.params.universe, (err, marketsMatched) => {
          t.assertions(err, marketsMatched);
          db.destroy();
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
      assert.ifError(err);
      assert.deepEqual(marketsMatched, {
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
      assert.ifError(err);
      assert.deepEqual(marketsMatched, {
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
      assert.ifError(err);
      assert.deepEqual(marketsMatched, {
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
      assert.deepEqual(err, Error("Universe not found"));
      assert.equal(marketsMatched, null);
    },
  });
});
