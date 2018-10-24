const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-initial-reporters", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
      const db = await setupTestDb();
      t.method = "getInitialReporters";
      const initialReporters = await dispatchJsonRpcRequest(db, t, t.params.augur);
      t.assertions(initialReporters);
      db.destroy();
      done();
    });
  };
  runTest({
    description: "get the initial reporter contracts owned by this reporter",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reporter: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (initialReporters) => {
      expect(initialReporters).toEqual({
        "0x0000000000000000000000000000000000abe111": {
          amountStaked: "102",
          blockNumber: 1400100,
          initialReporter: "0x0000000000000000000000000000000000abe111",
          isDesignatedReporter: 1,
          logIndex: 0,
          marketId: "0x0000000000000000000000000000000000000019",
          redeemed: 0,
          repBalance: "4000000",
          reporter: "0x0000000000000000000000000000000000000b0b",
          timestamp: 1506480000,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000E00",
        },
        "0x0000000000000000000000000000000000abe123": {
          marketId: "0x0000000000000000000000000000000000000011",
          blockNumber: 1400100,
          logIndex: 0,
          timestamp: 1506480000,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000E00",
          reporter: "0x0000000000000000000000000000000000000b0b",
          amountStaked: "102",
          initialReporter: "0x0000000000000000000000000000000000abe123",
          redeemed: 0,
          isDesignatedReporter: 0,
          repBalance: "2000",
        },
        "0x0000000000000000000000000000000000abe321": {
          marketId: "0x0000000000000000000000000000000000000211",
          blockNumber: 1400100,
          logIndex: 0,
          timestamp: 1506480000,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000E00",
          reporter: "0x0000000000000000000000000000000000000b0b",
          amountStaked: "102",
          initialReporter: "0x0000000000000000000000000000000000abe321",
          redeemed: 0,
          isDesignatedReporter: 1,
          repBalance: "2000",
        },
      });
    },
  });
});
