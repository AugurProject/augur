const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");

describe("server/getters/get-orders", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
      const db = await setupTestDb();
      t.method = "getOrders";
      const openOrders = await dispatchJsonRpcRequest(db, t, {});
      t.assertions(openOrders);
      db.destroy();
      done();
    });
  };
  runTest({
    description: "get open buy orders for market 1",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: null,
      orderType: "buy",
      creator: null,
      orderState: "OPEN",
    },
    assertions: (openOrders) => {
      expect(openOrders).toEqual({
        "0x0000000000000000000000000000000000000001": {
          0: {
            buy: {
              "0x1000000000000000000000000000000000000000000000000000000000000000": {
                orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
                shareToken: "0x0100000000000000000000000000000000000000",
                transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
                logIndex: 0,
                owner: "0x0000000000000000000000000000000000000b0b",
                creationTime: 1506473500,
                creationBlockNumber: 1400001,
                orderState: "OPEN",
                price: "0.7",
                amount: "1",
                originalAmount: "1",
                fullPrecisionPrice: "0.7",
                fullPrecisionAmount: "1",
                originalFullPrecisionAmount: "1",
                tokensEscrowed: "0.7",
                sharesEscrowed: "0",
              },
              "0x2000000000000000000000000000000000000000000000000000000000000000": {
                orderId: "0x2000000000000000000000000000000000000000000000000000000000000000",
                shareToken: "0x0100000000000000000000000000000000000000",
                transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A01",
                logIndex: 0,
                owner: "0x000000000000000000000000000000000000d00d",
                creationTime: 1506473515,
                creationBlockNumber: 1400002,
                orderState: "OPEN",
                price: "0.6",
                amount: "2",
                originalAmount: "2",
                fullPrecisionPrice: "0.600001",
                fullPrecisionAmount: "2",
                originalFullPrecisionAmount: "2",
                tokensEscrowed: "1.200002",
                sharesEscrowed: "0",
              },
              "0x5000000000000000000000000000000000000000000000000000000000000000": {
                orderId: "0x5000000000000000000000000000000000000000000000000000000000000000",
                amount: "1",
                originalAmount: "1",
                creationBlockNumber: 1400001,
                creationTime: 1506473500,
                transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A06",
                logIndex: 0,
                fullPrecisionAmount: "1",
                originalFullPrecisionAmount: "1",
                fullPrecisionPrice: "0.73",
                orderState: "OPEN",
                owner: "0x0000000000000000000000000000000000000b0b",
                price: "0.73",
                shareToken: "0x0100000000000000000000000000000000000000",
                sharesEscrowed: "0",
                tokensEscrowed: "0.73",
              },
            },
          },
          1: {
            buy: {
              "0x3000000000000000000000000000000000000000000000000000000000000000": {
                orderId: "0x3000000000000000000000000000000000000000000000000000000000000000",
                shareToken: "0x2000000000000000000000000000000000000000",
                transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A02",
                logIndex: 0,
                owner: "0x000000000000000000000000000000000000d00d",
                creationTime: 1506473515,
                creationBlockNumber: 1400002,
                orderState: "OPEN",
                price: "0.6",
                amount: "2",
                originalAmount: "2",
                fullPrecisionPrice: "0.6",
                fullPrecisionAmount: "2.0000001",
                originalFullPrecisionAmount: "2.0000001",
                tokensEscrowed: "1.20000006",
                sharesEscrowed: "0",
              },
            },
          },
        },
      });
    },
  });
  runTest({
    description: "get open sell orders for market 1",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: null,
      orderType: "sell",
      creator: null,
      orderState: "OPEN",
    },
    assertions: (openOrders) => {
      expect(openOrders).toEqual({
        "0x0000000000000000000000000000000000000001": {
          1: {
            sell: {
              "0x4000000000000000000000000000000000000000000000000000000000000000": {
                orderId: "0x4000000000000000000000000000000000000000000000000000000000000000",
                shareToken: "0x2000000000000000000000000000000000000000",
                transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A03",
                logIndex: 0,
                owner: "0x000000000000000000000000000000000000d00d",
                creationTime: 1506473515,
                creationBlockNumber: 1400002,
                orderState: "OPEN",
                price: "0.6",
                amount: "2",
                originalAmount: "2",
                fullPrecisionPrice: "0.6",
                fullPrecisionAmount: "2",
                originalFullPrecisionAmount: "2",
                tokensEscrowed: "1.2",
                sharesEscrowed: "0",
              },
            },
          },
        },
      });
    },
  });
  runTest({
    description: "get closed sell orders for market 1",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: null,
      orderType: "sell",
      creator: null,
      orderState: "FILLED",
    },
    assertions: (openOrders) => {
      expect(openOrders).toEqual({
        "0x0000000000000000000000000000000000000001": {
          1: {
            sell: {
              "0x4100000000000000000000000000000000000000000000000000000000000000": {
                orderId: "0x4100000000000000000000000000000000000000000000000000000000000000",
                shareToken: "0x2000000000000000000000000000000000000000",
                transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A04",
                logIndex: 0,
                owner: "0x000000000000000000000000000000000000d00d",
                creationTime: 1506473515,
                creationBlockNumber: 1400002,
                orderState: "FILLED",
                price: "0.7",
                amount: "2",
                originalAmount: "2",
                fullPrecisionPrice: "0.7",
                fullPrecisionAmount: "2",
                originalFullPrecisionAmount: "2",
                tokensEscrowed: "1.2",
                sharesEscrowed: "0",
              },
            },
          },
        },
      });
    },
  });
  runTest({
    description: "get cancelled sell orders for market 1",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: null,
      orderType: "sell",
      creator: null,
      orderState: "CANCELED",
    },
    assertions: (openOrders) => {
      expect(openOrders).toEqual({
        "0x0000000000000000000000000000000000000001": {
          1: {
            sell: {
              "0x4200000000000000000000000000000000000000000000000000000000000000": {
                orderId: "0x4200000000000000000000000000000000000000000000000000000000000000",
                shareToken: "0x2000000000000000000000000000000000000000",
                transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A05",
                logIndex: 0,
                owner: "0x000000000000000000000000000000000000d00d",
                creationTime: 1506473515,
                creationBlockNumber: 1400002,
                orderState: "CANCELED",
                price: "0.8",
                amount: "2",
                originalAmount: "2",
                fullPrecisionPrice: "0.8",
                fullPrecisionAmount: "2",
                originalFullPrecisionAmount: "2",
                tokensEscrowed: "1.2",
                sharesEscrowed: "0",
                canceledBlockNumber: 1500001,
                canceledTransactionHash: "0x000000000000000000000000000000000000000000000000000000000000AA05",
                canceledTime: 1509065474,
              },
            },
          },
        },
      });
    },
  });
  runTest({
    description: "get orders created by user b0b",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      marketId: null,
      outcome: null,
      orderType: null,
      creator: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (openOrders) => {
      expect(openOrders).toEqual({
        "0x0000000000000000000000000000000000000001": {
          0: {
            buy: {
              "0x1000000000000000000000000000000000000000000000000000000000000000": {
                orderId: "0x1000000000000000000000000000000000000000000000000000000000000000",
                amount: "1",
                originalAmount: "1",
                creationBlockNumber: 1400001,
                creationTime: 1506473500,
                transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
                logIndex: 0,
                fullPrecisionAmount: "1",
                originalFullPrecisionAmount: "1",
                fullPrecisionPrice: "0.7",
                orderState: "OPEN",
                owner: "0x0000000000000000000000000000000000000b0b",
                price: "0.7",
                shareToken: "0x0100000000000000000000000000000000000000",
                sharesEscrowed: "0",
                tokensEscrowed: "0.7",
              },
              "0x5000000000000000000000000000000000000000000000000000000000000000": {
                orderId: "0x5000000000000000000000000000000000000000000000000000000000000000",
                amount: "1",
                originalAmount: "1",
                creationBlockNumber: 1400001,
                creationTime: 1506473500,
                transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A06",
                logIndex: 0,
                fullPrecisionAmount: "1",
                originalFullPrecisionAmount: "1",
                fullPrecisionPrice: "0.73",
                orderState: "OPEN",
                owner: "0x0000000000000000000000000000000000000b0b",
                price: "0.73",
                shareToken: "0x0100000000000000000000000000000000000000",
                sharesEscrowed: "0",
                tokensEscrowed: "0.73",
              },
            },
          },
        },
        "0x0000000000000000000000000000000000000011": {
          1: {
            buy: {
              "0x7000000000000000000000000000000000000000000000000000000000000000": {
                orderId: "0x7000000000000000000000000000000000000000000000000000000000000000",
                amount: "2",
                originalAmount: "2",
                creationBlockNumber: 1400002,
                creationTime: 1506473515,
                transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A08",
                logIndex: 0,
                fullPrecisionAmount: "2.0000001",
                originalFullPrecisionAmount: "2.0000001",
                fullPrecisionPrice: "0.6",
                orderState: "OPEN",
                owner: "0x0000000000000000000000000000000000000b0b",
                price: "0.6",
                shareToken: "0x2000000000000000000000000000000000000000",
                sharesEscrowed: "0",
                tokensEscrowed: "1.20000006",
              },
            },
          },
        },
        "0x0000000000000000000000000000000000000018": {
          0: {
            buy: {
              "0x6000000000000000000000000000000000000000000000000000000000000000": {
                orderId: "0x6000000000000000000000000000000000000000000000000000000000000000",
                amount: "2",
                originalAmount: "2",
                creationBlockNumber: 1400002,
                creationTime: 1506473515,
                transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A07",
                logIndex: 0,
                fullPrecisionAmount: "2",
                originalFullPrecisionAmount: "2",
                fullPrecisionPrice: "0.600001",
                orderState: "OPEN",
                owner: "0x0000000000000000000000000000000000000b0b",
                price: "0.6",
                shareToken: "0x0100000000000000000000000000000000000000",
                sharesEscrowed: "0",
                tokensEscrowed: "1.200002",
              },
            },
          },
        },
      });
    },
  });
  runTest({
    description: "get orders created by user b0b filtered by date",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      marketId: null,
      outcome: null,
      orderType: null,
      creator: "0x0000000000000000000000000000000000000b0b",
      earliestCreationTime: 1506473501,
      latestCreationTime: 1506473515,
    },
    assertions: (openOrders) => {
      expect(openOrders).toEqual({
        "0x0000000000000000000000000000000000000011": {
          1: {
            buy: {
              "0x7000000000000000000000000000000000000000000000000000000000000000": {
                orderId: "0x7000000000000000000000000000000000000000000000000000000000000000",
                amount: "2",
                originalAmount: "2",
                creationBlockNumber: 1400002,
                creationTime: 1506473515,
                transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A08",
                logIndex: 0,
                fullPrecisionAmount: "2.0000001",
                originalFullPrecisionAmount: "2.0000001",
                fullPrecisionPrice: "0.6",
                orderState: "OPEN",
                owner: "0x0000000000000000000000000000000000000b0b",
                price: "0.6",
                shareToken: "0x2000000000000000000000000000000000000000",
                sharesEscrowed: "0",
                tokensEscrowed: "1.20000006",
              },
            },
          },
        },
        "0x0000000000000000000000000000000000000018": {
          0: {
            buy: {
              "0x6000000000000000000000000000000000000000000000000000000000000000": {
                orderId: "0x6000000000000000000000000000000000000000000000000000000000000000",
                amount: "2",
                originalAmount: "2",
                creationBlockNumber: 1400002,
                creationTime: 1506473515,
                transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A07",
                logIndex: 0,
                fullPrecisionAmount: "2",
                originalFullPrecisionAmount: "2",
                fullPrecisionPrice: "0.600001",
                orderState: "OPEN",
                owner: "0x0000000000000000000000000000000000000b0b",
                price: "0.6",
                shareToken: "0x0100000000000000000000000000000000000000",
                sharesEscrowed: "0",
                tokensEscrowed: "1.200002",
              },
            },
          },
        },
      });
    },
  });
  runTest({
    description: "get open orders for nonexistent market",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      marketId: "0x1010101010101010101010101010101010101010",
      outcome: null,
      orderType: null,
      creator: null,
    },
    assertions: (openOrders) => {
      expect(openOrders).toEqual({});
    },
  });
  runTest({
    description: "get orphaned orders",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      marketId: "0x0000000000000000000000000000000000000003",
      outcome: null,
      orderType: null,
      creator: null,
      orphaned: true,
    },
    assertions: (openOrders) => {
      expect(openOrders).toEqual({
        "0x0000000000000000000000000000000000000003": {
          1: {
            sell: {
              "0x8000000000000000000000000000000000000000000000000000000000000000": {
                amount: "2",
                creationBlockNumber: 1400002,
                creationTime: 1506473515,
                fullPrecisionAmount: "2",
                fullPrecisionPrice: "0.6",
                logIndex: 0,
                orderId: "0x8000000000000000000000000000000000000000000000000000000000000000",
                orderState: "OPEN",
                originalAmount: "2",
                originalFullPrecisionAmount: "2",
                owner: "0x0000000000000000000000000000000000000b0b",
                price: "0.6",
                shareToken: "0x2000000000000000000000000000000000000000",
                sharesEscrowed: "0",
                tokensEscrowed: "1.2",
                transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A09",
              },
            },
          },
        },
      });
    },
  });
});
