"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getMarketPriceHistory } = require("../../../build/server/getters/get-market-price-history");

describe("server/getters/get-market-price-history", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        getMarketPriceHistory(db, t.params.marketId, (err, marketPriceHistory) => {
          t.assertions(err, marketPriceHistory);
          db.destroy();
          done();
        });
      });
    });
  };
  test({
    description: "market has a single price point",
    params: {
      marketId: "0x0000000000000000000000000000000000000001",
      sortBy: null,
      isSortDescending: null,
      limit: null,
      offset: null,
    },
    assertions: (err, marketPriceHistory) => {
      assert.ifError(err);
      assert.deepEqual(marketPriceHistory, {
        0: [{
          price: "5.5",
          amount: "0.2",
          timestamp: 1506474500,
        }],
      });
    },
  });
  test({
    description: "market has no price history",
    params: {
      marketId: "0x0000000000000000000000000000000000001111",
      sortBy: null,
      isSortDescending: null,
      limit: null,
      offset: null,
    },
    assertions: (err, marketPriceHistory) => {
      assert.ifError(err);
      assert.deepEqual(marketPriceHistory, {});
    },
  });
});
