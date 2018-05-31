"use strict";

const { BigNumber } = require("bignumber.js");
const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getFeeWindows } = require("../../../build/server/getters/get-fee-windows");
const { setOverrideTimestamp } = require("../../../build/blockchain/process-block");

describe("server/getters/get-fee-windows", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        setOverrideTimestamp(db, 1509065471, (err) => {
          assert.ifError(err);
          getFeeWindows(db, t.params.augur, t.params.universe, t.params.account, t.params.includeCurrent, (err, feeWindows) => {
            t.assertions(err, feeWindows);
            db.destroy();
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
      assert.ifError(err);
      assert.deepEqual(feeWindows, {
        "0x1000000000000000000000000000000000000000": {
          startTime: 1506473473,
          endTime: 1506473515,
          balance: "100",
          expectedFees: new BigNumber("100").times(1000).dividedBy(300).toFixed(),
        },
        "0x2000000000000000000000000000000000000000": {
          startTime: 1509065473,
          endTime: 1509670273,
          balance: "500",
          expectedFees: new BigNumber("500").times(2000).dividedBy(1100).toFixed(),
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
      assert.ifError(err);
      assert.deepEqual(feeWindows, {
        "0x1000000000000000000000000000000000000000": {
          startTime: 1506473473,
          endTime: 1506473515,
          balance: "100",
          expectedFees: new BigNumber("100").times(1000).dividedBy(300).toFixed(),
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
      assert.ifError(err);
      assert.deepEqual(feeWindows, {});
    },
  });
});
