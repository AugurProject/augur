"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getInitialReporters } = require("../../../build/server/getters/get-initial-reporters");

describe("server/getters/get-initial-reporters", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        getInitialReporters(db, t.params.reporter, t.params.redeemed, (err, initialReporters) => {
          t.assertions(err, initialReporters);
          done();
        });
      });
    });
  };
  test({
    description: "get the initial reporter contracts owned by this reporter",
    params: {
      reporter: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (err, initialReporters) => {
      assert.isNull(err);
      assert.deepEqual(initialReporters, [{
        marketId: "0x0000000000000000000000000000000000000011",
        reporter: "0x0000000000000000000000000000000000000b0b",
        amountStaked: 102,
        initialReporter: "0x0000000000000000000000000000000000abe123",
        redeemed: 0,
      }, {
        marketId: "0x0000000000000000000000000000000000000211",
        reporter: "0x0000000000000000000000000000000000000b0b",
        amountStaked: 102,
        initialReporter: "0x0000000000000000000000000000000000abe321",
        redeemed: 0,
      }]);
    },
  });
});
