const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-all-orders", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
const db = await setupTestDb();
      t.method = "getAllOrders";
      dispatchJsonRpcRequest(db, t, {}, (err, orders) => {
        t.assertions(err, orders);
        db.destroy();
        done();
      });
    })
  };
  runTest({
    description: "get all orders from the account",
    params: {
      account: "0x000000000000000000000000000000000000d00d",
    },
    assertions: (err, orders) => {
      expect(err).toBeFalsy();
      expect(orders).toEqual({
        "0x2000000000000000000000000000000000000000000000000000000000000000": {
          "orderId": "0x2000000000000000000000000000000000000000000000000000000000000000",
          "sharesEscrowed": "0",
          "tokensEscrowed": "1.200002",
          "marketId": "0x0000000000000000000000000000000000000001",
        },
        "0x3000000000000000000000000000000000000000000000000000000000000000": {
          "orderId": "0x3000000000000000000000000000000000000000000000000000000000000000",
          "sharesEscrowed": "0",
          "tokensEscrowed": "1.20000006",
          "marketId": "0x0000000000000000000000000000000000000001",
        },
        "0x4000000000000000000000000000000000000000000000000000000000000000": {
          "orderId": "0x4000000000000000000000000000000000000000000000000000000000000000",
          "sharesEscrowed": "0",
          "tokensEscrowed": "1.2",
          "marketId": "0x0000000000000000000000000000000000000001",
        },
      });
    },
  });
});
