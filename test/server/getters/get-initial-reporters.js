"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getInitialReporters } = require("../../../build/server/getters/get-initial-reporters");

describe("server/getters/get-initial-reporters", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        getInitialReporters(db, t.params.augur, t.params.universe, t.params.reporter, t.params.redeemed, t.params.withRepBalance, (err, initialReporters) => {
          t.assertions(err, initialReporters);
          db.destroy();
          done();
        });
      });
    });
  };
  test({
    description: "get the initial reporter contracts owned by this reporter",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      reporter: "0x0000000000000000000000000000000000000b0b",
    },
    assertions: (err, initialReporters) => {
      assert.ifError(err);
      assert.deepEqual(initialReporters, {
        "0x0000000000000000000000000000000000abe111": {
          amountStaked: "102",
          blockNumber: 1400100,
          initialReporter: "0x0000000000000000000000000000000000abe111",
          isDesignatedReporter: 1,
          logIndex: 0,
          marketId: "0x0000000000000000000000000000000000000019",
          redeemed: 0,
          repBalance: "4000000",
          reporter: "0x0000000000000000000000000000000000000b0b",
          timestamp: 1506480000,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000E00",
        },
        "0x0000000000000000000000000000000000abe123": {
          marketId: "0x0000000000000000000000000000000000000011",
          blockNumber: 1400100,
          logIndex: 0,
          timestamp: 1506480000,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000E00",
          reporter: "0x0000000000000000000000000000000000000b0b",
          amountStaked: "102",
          initialReporter: "0x0000000000000000000000000000000000abe123",
          redeemed: 0,
          isDesignatedReporter: 0,
          repBalance: "2000",
        },
        "0x0000000000000000000000000000000000abe321": {
          marketId: "0x0000000000000000000000000000000000000211",
          blockNumber: 1400100,
          logIndex: 0,
          timestamp: 1506480000,
          transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000E00",
          reporter: "0x0000000000000000000000000000000000000b0b",
          amountStaked: "102",
          initialReporter: "0x0000000000000000000000000000000000abe321",
          redeemed: 0,
          isDesignatedReporter: 1,
          repBalance: "2000",
        },
      });
    },
  });
});
