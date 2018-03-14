"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getFeeWindows } = require("../../../build/server/getters/get-fee-windows");
const { setOverrideTimestamp } = require("../../../build/blockchain/process-block");

describe("server/getters/get-fee-windows", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        setOverrideTimestamp(db, 1509065471, (err) => {
          assert.isNull(err);
          getFeeWindows(db, t.params.augur, t.params.universe, t.params.account, t.params.includeCurrent, (err, feeWindows) => {
            t.assertions(err, feeWindows);
            done();
          });
        });
      });
    });
  };
  test({
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
    assertions: (err, feeWindows) => {
      assert.isNull(err);
      assert.deepEqual(feeWindows, {
        "0x1000000000000000000000000000000000000000": {
          startTime: 1506473473,
          endTime: 1506473515,
          balance: 100,
          expectedFees: 100 * 1000 / 300,
        },
        "0x2000000000000000000000000000000000000000": {
          startTime: 1509065473,
          endTime: 1511657473,
          balance: 500,
          expectedFees: 500 * 2000 / 1100,
        },
      });
    },
  });
  test({
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
    assertions: (err, feeWindows) => {
      assert.isNull(err);
      assert.deepEqual(feeWindows, {
        "0x1000000000000000000000000000000000000000": {
          startTime: 1506473473,
          endTime: 1506473515,
          balance: 100,
          expectedFees: 100 * 1000 / 300,
        },
      });
    },
  });
  test({
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
    assertions: (err, feeWindows) => {
      assert.isNull(err);
      assert.deepEqual(feeWindows, {});
    },
  });
});
