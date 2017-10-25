"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getUserTradingPositions } = require("../../../build/server/getters/get-user-trading-positions");

describe("server/getters/get-user-trading-positions", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        getUserTradingPositions(db, t.params.account, t.params.marketID, t.params.outcome, t.params.sortBy, t.params.isSortDescending, t.params.limit, t.params.offset, (err, userTradingPositions) => {
          t.assertions(err, userTradingPositions);
          done();
        });
      });
    });
  };
  test({
    description: "get user's full position",
    params: {
      account: "0x000000000000000000000000000000000000d00d",
      marketID: null,
      outcome: null,
      sortBy: null,
      isSortDescending: null,
      limit: null,
      offset: null
    },
    assertions: (err, userTradingPositions) => {
      assert.isNull(err);
      assert.deepEqual(userTradingPositions, [{
        "marketID": "0x0000000000000000000000000000000000000001",
        "outcome": 0,
        "numShares": 0.2,
        "numSharesAdjustedForUserIntention": 0.2,
        "realizedProfitLoss": 0,
        "unrealizedProfitLoss": 11
      }, {
        "marketID": "0x0000000000000000000000000000000000000001",
        "outcome": 1,
        "numShares": 0,
        "numSharesAdjustedForUserIntention": 0,
        "realizedProfitLoss": 0,
        "unrealizedProfitLoss": 0
      }, {
        "marketID": "0x0000000000000000000000000000000000000001",
        "outcome": 2,
        "numShares": 0,
        "numSharesAdjustedForUserIntention": 0,
        "realizedProfitLoss": 0,
        "unrealizedProfitLoss": 0
      }, {
        "marketID": "0x0000000000000000000000000000000000000001",
        "outcome": 3,
        "numShares": 0,
        "numSharesAdjustedForUserIntention": 0,
        "realizedProfitLoss": 0,
        "unrealizedProfitLoss": 0
      }, {
        "marketID": "0x0000000000000000000000000000000000000001",
        "outcome": 4,
        "numShares": 0,
        "numSharesAdjustedForUserIntention": 0,
        "realizedProfitLoss": 0,
        "unrealizedProfitLoss": 0
      }, {
        "marketID": "0x0000000000000000000000000000000000000001",
        "outcome": 5,
        "numShares": 0,
        "numSharesAdjustedForUserIntention": 0,
        "realizedProfitLoss": 0,
        "unrealizedProfitLoss": 0
      }, {
        "marketID": "0x0000000000000000000000000000000000000001",
        "outcome": 6,
        "numShares": 0,
        "numSharesAdjustedForUserIntention": 0,
        "realizedProfitLoss": 0,
        "unrealizedProfitLoss": 0
      }, {
        "marketID": "0x0000000000000000000000000000000000000001",
        "outcome": 7,
        "numShares": 0,
        "numSharesAdjustedForUserIntention": 0,
        "realizedProfitLoss": 0,
        "unrealizedProfitLoss": 0
      }]);
    }
  });
  test({
    description: "get a user's position in one outcome of one market",
    params: {
      account: "0x000000000000000000000000000000000000d00d",
      marketID: "0x0000000000000000000000000000000000000001",
      outcome: 4,
      sortBy: null,
      isSortDescending: null,
      limit: null,
      offset: null
    },
    assertions: (err, userTradingPositions) => {
      assert.isNull(err);
      assert.deepEqual(userTradingPositions, [{
        "marketID": "0x0000000000000000000000000000000000000001",
        "outcome": 4,
        "numShares": 0,
        "numSharesAdjustedForUserIntention": 0,
        "realizedProfitLoss": 0,
        "unrealizedProfitLoss": 0
      }]);
    }
  });
});
