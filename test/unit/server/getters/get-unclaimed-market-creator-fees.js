const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-unclaimed-market-creator-fees", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
      const db = await setupTestDb();
      t.method = "getUnclaimedMarketCreatorFees";
      const marketFees = await dispatchJsonRpcRequest(db, t, t.params.augur);
      t.assertions(marketFees);
      db.destroy();
      done();
    });
  };
  runTest({
    description: "get fees by specifying unfinalized market IDs",
    params: {
      marketIds: [
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000002",
      ],
      augur: {
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
    assertions: (marketFees) => {
      expect(marketFees).toEqual([
        {
          marketId: "0x0000000000000000000000000000000000000001",
          unclaimedFee: "0",
        },
        {
          marketId: "0x0000000000000000000000000000000000000002",
          unclaimedFee: "0",
        },
      ]);
    },
  });
  runTest({
    description: "Empty marketIds array",
    params: {
      marketIds: [],
      augur: {
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
    assertions: (marketFees) => {
      expect(marketFees).toEqual([]);
    },
  });
});
