"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getFeeWindowCurrent } = require("../../../build/server/getters/get-fee-window-current");


describe("server/getters/get-fee-window-current", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        getFeeWindowCurrent(db, t.params.universe, (err, feeWindow) => {
          t.assertions(err, feeWindow);
          done();
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
      assert.isNull(err);
      assert.deepEqual(feeWindow, {
        endBlockNumber: null,
        endTime: 1511657473,
        feeWindow: "0x2000000000000000000000000000000000000000",
        feeWindowID: 457,
        fees: 0,
        startBlockNumber: 1500001,
        startTime: 1509065473,
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
      assert.isNull(err);
      assert.isNull(feeWindow);
    },
  });
});
