"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const {getFeeWindowCurrent} = require("../../../build/server/getters/get-fee-window-current");
const {setOverrideTimestamp, removeOverrideTimestamp} = require("../../../build/blockchain/process-block.js");


describe("server/getters/get-fee-window-current", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        setOverrideTimestamp(db, t.params.overrideTimestamp || 1, (err) => {
          assert.ifError(err);
          getFeeWindowCurrent(db, t.params.augur, t.params.universe, t.params.reporter, (err, feeWindow) => {
            t.assertions(err, feeWindow);
            removeOverrideTimestamp(db, t.params.overrideTimestamp || 1, (err) => {
              assert.isNotNull(err);
              db.destroy();
              done();
            });
          });
        });
      });
    });
  };
  test({
    description: "get feeWindow",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
    },
    assertions: (err, feeWindow) => {
      assert.ifError(err);
      assert.deepEqual(feeWindow, {
        endTime: 1509670273,
        feeWindow: "0x2000000000000000000000000000000000000000",
        feeWindowId: 457,
        startTime: 1509065473,
        universe: "0x000000000000000000000000000000000000000b",
      });
    },
  });
  test({
    description: "get feeWindow with account b0b on fee window 0x2",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reporter: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (err, feeWindow) => {
      assert.ifError(err);
      assert.deepEqual(feeWindow, {
        endTime: 1509670273,
        feeWindow: "0x2000000000000000000000000000000000000000",
        feeWindowId: 457,
        startTime: 1509065473,
        totalStake: "132",
        participantContributions: "102",
        participationTokens: "30",
        universe: "0x000000000000000000000000000000000000000b",
      });
    },
  });
  test({
    description: "get feeWindow with no account on fee window that does not yet exist",
    params: {
      universe: "0x000000000000000000000000000000000000000d",
      overrideTimestamp: 1526620468,
      augur: {
        constants: {
          CONTRACT_INTERVAL: {
            DISPUTE_ROUND_DURATION_SECONDS: 7 * 24 * 3600,
          },
        },
      },
    },
    assertions: (err, feeWindow) => {
      assert.ifError(err);
      assert.deepEqual(feeWindow, {
        endTime: 1527120000,
        feeWindow: null,
        feeWindowId: 2524,
        startTime: 1526515200,
        universe: "0x000000000000000000000000000000000000000d",
      });
    },
  });
  test({
    description: "get feeWindow with non-existent account on fee window 0x2",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reporter: "0x0000000000000000000000000000000000n0n0n0",
    },
    assertions: (err, feeWindow) => {
      assert.ifError(err);
      assert.deepEqual(feeWindow, {
        endTime: 1509670273,
        feeWindow: "0x2000000000000000000000000000000000000000",
        feeWindowId: 457,
        startTime: 1509065473,
        totalStake: "0",
        participantContributions: "0",
        participationTokens: "0",
        universe: "0x000000000000000000000000000000000000000b",
      });
    },
  });
  test({
    description: "nonexistent universe",
    params: {
      universe: "0x1010101010101010101010101010101010101010",
    },
    assertions: (err, feeWindow) => {
      assert.ifError(err);
      assert.isNull(feeWindow);
    },
  });
});
