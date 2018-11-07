const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-markets-closing-in-date-range", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  afterEach(async () => {
    await db.destroy();
  });

  const runTest = (t) => {
    test(t.description, async () => {
      t.method = "getMarketsClosingInDateRange";
      const marketsClosingInDateRange = await dispatchJsonRpcRequest(db, t, null);
      t.assertions(marketsClosingInDateRange);
    });
  };
  runTest({
    description: "date range with 1 market closing",
    params: {
      earliestClosingTime: 1506573450,
      latestClosingTime: 1506573470,
      universe: "0x000000000000000000000000000000000000000b",
      limit: 10,
    },
    assertions: (marketsClosingInDateRange) => {
      expect(marketsClosingInDateRange).toEqual([
        "0x0000000000000000000000000000000000000001",
      ]);
    },
  });
  runTest({
    description: "date range with 3 markets closing",
    params: {
      earliestClosingTime: 1506573450,
      latestClosingTime: 1506573510,
      universe: "0x000000000000000000000000000000000000000b",
      limit: 3,
    },
    assertions: (marketsClosingInDateRange) => {
      expect(marketsClosingInDateRange).toEqual([
        "0x0000000000000000000000000000000000000003",
        "0x0000000000000000000000000000000000000002",
        "0x0000000000000000000000000000000000000001",
      ]);
    },
  });
  runTest({
    description: "date range with 3 markets closing (limit 2)",
    params: {
      earliestClosingTime: 1506573450,
      latestClosingTime: 1506573510,
      universe: "0x000000000000000000000000000000000000000b",
      limit: 2,
    },
    assertions: (marketsClosingInDateRange) => {
      expect(marketsClosingInDateRange).toEqual([
        "0x0000000000000000000000000000000000000003",
        "0x0000000000000000000000000000000000000002",
      ]);
    },
  });
  runTest({
    description: "date range with no market closings",
    params: {
      earliestClosingTime: 1506573450,
      latestClosingTime: 1506573469,
      universe: "0x000000000000000000000000000000000000000b",
      limit: 10,
    },
    assertions: (marketsClosingInDateRange) => {
      expect(marketsClosingInDateRange).toEqual([]);
    },
  });
});
