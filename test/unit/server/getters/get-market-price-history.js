const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-market-price-history", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  afterEach(async () => {
    await db.destroy();
  });

  const runTest = (t) => {
    test(t.description, async () => {
      t.method = "getMarketPriceHistory";
      const marketPriceHistory = await dispatchJsonRpcRequest(db, t, null);
      t.assertions(marketPriceHistory);
    });
  };
  runTest({
    description: "market has a single price point",
    params: {
      marketId: "0x0000000000000000000000000000000000000001",
      sortBy: null,
      isSortDescending: null,
      limit: null,
      offset: null,
    },
    assertions: (marketPriceHistory) => {
      expect(marketPriceHistory).toEqual({
        0: [{
          price: "5.5",
          amount: "0.2",
          timestamp: 1506474500,
        }, {
          amount: "2",
          price: "4.2",
          timestamp: 1509065474,
        }],
      });
    },
  });
  runTest({
    description: "market has no price history",
    params: {
      marketId: "0x0000000000000000000000000000000000001111",
      sortBy: null,
      isSortDescending: null,
      limit: null,
      offset: null,
    },
    assertions: (marketPriceHistory) => {
      expect(marketPriceHistory).toEqual({});
    },
  });
});
