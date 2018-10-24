const { BigNumber } = require("bignumber.js");
const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("src/server/dispatch-json-rpc-request");
const { setOverrideTimestamp } = require("src/blockchain/process-block");

describe("server/getters/get-fee-windows", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
      const db = await setupTestDb();
      await setOverrideTimestamp(db, 1509065471);
      t.method = "getFeeWindows";
      const feeWindows = await dispatchJsonRpcRequest(db, t, t.params.augur);
      t.assertions(feeWindows);
      db.destroy();
      done();
    });
  };
  runTest({
    description: "get fee windows for the user",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      account: "0x0000000000000000000000000000000000000021",
      includeCurrent: true,
      augur: {
        contracts: {
          addresses: {
            1: {
              Cash: "CASH",
            },
          },
        },
        rpc: {
          getNetworkID: () => {
            return 1;
          },
        },
      },
    },
    assertions: (feeWindows) => {
            expect(feeWindows).toEqual({
        "0x1000000000000000000000000000000000000000": {
          startTime: 1506473473,
          endTime: 1506473515,
          balance: "100",
          expectedFees: new BigNumber("100").times(1000).dividedBy(300).toString(),
        },
        "0x2000000000000000000000000000000000000000": {
          startTime: 1509065473,
          endTime: 1509670273,
          balance: "500",
          expectedFees: new BigNumber("500").times(2000).dividedBy(1100).toString(),
        },
      });
    },
  });
  runTest({
    description: "get fee windows for the user except current one",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      account: "0x0000000000000000000000000000000000000021",
      includeCurrent: false,
      augur: {
        contracts: {
          addresses: {
            1: {
              Cash: "CASH",
            },
          },
        },
        rpc: {
          getNetworkID: () => {
            return 1;
          },
        },
      },
    },
    assertions: (feeWindows) => {
            expect(feeWindows).toEqual({
        "0x1000000000000000000000000000000000000000": {
          startTime: 1506473473,
          endTime: 1506473515,
          balance: "100",
          expectedFees: new BigNumber("100").times(1000).dividedBy(300).toString(),
        },
      });
    },
  });
  runTest({
    description: "get fee windows for user with no participation token balance",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      account: "0x00000000000000000000000000000000000000b0b",
      includeCurrent: true,
      augur: {
        contracts: {
          addresses: {
            1: {
              Cash: "CASH",
            },
          },
        },
        rpc: {
          getNetworkID: () => {
            return 1;
          },
        },
      },
    },
    assertions: (feeWindows) => {
            expect(feeWindows).toEqual({});
    },
  });
});
