"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getMarketPriceHistory } = require("../../../build/server/getters/get-market-price-history");

describe("server/getters/get-market-price-history", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        getMarketPriceHistory(db, t.params.marketId, (err, marketPriceHistory) => {
          t.assertions(err, marketPriceHistory);
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
      assert.isNull(err);
      assert.deepEqual(marketPriceHistory, {
        0: [{
          price: new BigNumber("5.5", 10),
          amount: new BigNumber("0.2", 10),
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
      assert.isNull(err);
      assert.deepEqual(marketPriceHistory, {});
    },
  });
});
