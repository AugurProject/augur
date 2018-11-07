const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-better-worse-orders", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  afterEach(async () => {
    await db.destroy();
  });

  const runTest = (t) => {
    test(t.description, async () => {
      t.method = "getBetterWorseOrders";
      const betterWorseOrders = await dispatchJsonRpcRequest(db, t, {});
      t.assertions(betterWorseOrders);
    });
  };
  runTest({
    description: "get better worse with no orders",
    params: {
      marketId: "0x00000000000000000000000000000fffffffff11",
      outcome: 1,
      orderType: "buy",
      price: "2",
    },
    assertions: (betterWorseOrders) => {
      expect(betterWorseOrders).toEqual({
        betterOrderId: null,
        worseOrderId: null,
      });
    },
  });
  runTest({
    description: "get better worse with better orders",
    params: {
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 0,
      orderType: "buy",
      price: "0.4",
    },
    assertions: (betterWorseOrders) => {
      expect(betterWorseOrders).toEqual({
        betterOrderId: "0x2000000000000000000000000000000000000000000000000000000000000000",
        worseOrderId: null,
      });
    },
  });
  runTest({
    description: "get better worse with worse orders",
    params: {
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 0,
      orderType: "buy",
      price: "0.99",
    },
    assertions: (betterWorseOrders) => {
      expect(betterWorseOrders).toEqual({
        betterOrderId: null,
        worseOrderId: "0x5000000000000000000000000000000000000000000000000000000000000000",
      });
    },
  });
  runTest({
    description: "get better worse with better and worse orders",
    params: {
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 0,
      orderType: "buy",
      price: "0.65",
    },
    assertions: (betterWorseOrders) => {
      expect(betterWorseOrders).toEqual({
        betterOrderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
        worseOrderId: "0x2000000000000000000000000000000000000000000000000000000000000000",
      });
    },
  });
});
