const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-market-price-candlesticks", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  const runTest = (t) => {
    test(t.description, async () => {
      t.method = "getMarketPriceCandlesticks";
      const marketPriceHistory = await dispatchJsonRpcRequest(db, t, null);
      t.assertions(marketPriceHistory);
    });
  };
  runTest({
    description: "market has a one candlestick",
    params: {
      marketId: "0x0000000000000000000000000000000000000015",
    },
    assertions: (marketPriceHistory) => {
      expect(marketPriceHistory).toEqual({
        0: [{
          end: "4.2",
          max: "5.5",
          min: "4.2",
          start: "5.5",
          startTimestamp: 1506474480,
          volume: "0.3",
        }],
      });
    },
  });
  runTest({
    description: "market has a two candlesticks with 20s period",
    params: {
      marketId: "0x0000000000000000000000000000000000000015",
      period: 20,
      start: 1506474473,
    },
    assertions: (marketPriceHistory) => {
      expect(marketPriceHistory).toEqual({
        0: [{
          end: "5.5",
          max: "5.5",
          min: "5.5",
          start: "5.5",
          startTimestamp: 1506474493,
          volume: "0.2",
        },
        {
          end: "4.2",
          max: "4.2",
          min: "4.2",
          start: "4.2",
          startTimestamp: 1506474513,
          volume: "0.1",
        }],
      });
    },
  });
  runTest({
    description: "market has a one candlesticks with 20s period, due to different start time",
    params: {
      marketId: "0x0000000000000000000000000000000000000015",
      period: 20,
      start: 1506474478,
    },
    assertions: (marketPriceHistory) => {
      expect(marketPriceHistory).toEqual({
        0: [{
          end: "4.2",
          max: "5.5",
          min: "4.2",
          start: "5.5",
          startTimestamp: 1506474498,
          volume: "0.3",
        }],
      });
    },
  });
  runTest({
    description: "market has no candlesticks",
    params: {
      marketId: "0x0000000000000000000000000000000000001111",
    },
    assertions: (marketPriceHistory) => {
      expect(marketPriceHistory).toEqual({});
    },
  });

  test("Not passing in marketId", async () => {
    const params = {};
    try {
      await dispatchJsonRpcRequest(db, { method: "getMarketPriceCandlesticks", params }, null);
      throw new Error("Did not fail");
    } catch (err) {
      expect(err.message).toContain("Invalid request object");
    }
  });

  afterEach(async () => {
    await db.destroy();
  });
});
