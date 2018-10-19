const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-better-worse-orders", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
const db = await setupTestDb();
      t.method = "getBetterWorseOrders";
      dispatchJsonRpcRequest(db, t, {}, (err, betterWorseOrders) => {
        t.assertions(err, betterWorseOrders);
        db.destroy();
        done();
      });
    })
  };
  runTest({
    description: "get better worse with no orders",
    params: {
      marketId: "0x00000000000000000000000000000fffffffff11",
      outcome: 1,
      orderType: "buy",
      price: "2",
    },
    assertions: (err, betterWorseOrders) => {
      expect(err).toBeFalsy();
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
    assertions: (err, betterWorseOrders) => {
      expect(err).toBeFalsy();
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
    assertions: (err, betterWorseOrders) => {
      expect(err).toBeFalsy();
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
    assertions: (err, betterWorseOrders) => {
      expect(err).toBeFalsy();
      expect(betterWorseOrders).toEqual({
        betterOrderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
        worseOrderId: "0x2000000000000000000000000000000000000000000000000000000000000000",
      });
    },
  });
});
