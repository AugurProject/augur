"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { dispatchJsonRpcRequest } = require("../../../../src/server/dispatch-json-rpc-request");

describe("server/getters/get-market-price-history", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        t.method = "getMarketPriceHistory";
        dispatchJsonRpcRequest(db, t, null, (err, marketPriceHistory) => {
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
        }, {
          amount: "2",
          price: "4.2",
          timestamp: 1509065474,
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
