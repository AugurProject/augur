"use strict";

const Augur = require("augur.js");
const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getUserTradingPositions } = require("../../../../src/server/getters/get-user-trading-positions");

describe("server/getters/get-user-trading-positions", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);

        getUserTradingPositions(db, new Augur(), t.params.universe, t.params.account, t.params.marketId, t.params.outcome, t.params.sortBy, t.params.isSortDescending, t.params.limit, t.params.offset, (error, userTradingPositions) => {
          try {
            t.assertions(error, userTradingPositions);
            db.destroy();
            done();
          } catch (e) {
            done(e);
          }
        });
      });
    });
  };
  test({
    description: "get user's full position",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      account: "0x000000000000000000000000000000000000d00d",
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: null,
      sortBy: null,
      isSortDescending: null,
      limit: null,
      offset: null,
    },
    assertions: (err, userTradingPositions) => {
      assert.ifError(err);
      assert.deepEqual(userTradingPositions, [{
        "marketId": "0x0000000000000000000000000000000000000001",
        "outcome": 0,
        "numShares": "1.8",
        "numSharesAdjustedForUserIntention": "-1.8",
        "realizedProfitLoss": "-0.26",
        "unrealizedProfitLoss": "0",
        "averagePrice": "4.2",
      }, {
        "marketId": "0x0000000000000000000000000000000000000001",
        "outcome": 1,
        "numShares": "0",
        "numSharesAdjustedForUserIntention": "0",
        "realizedProfitLoss": "0",
        "unrealizedProfitLoss": "0",
        "averagePrice": "0",
      }, {
        "marketId": "0x0000000000000000000000000000000000000001",
        "outcome": 2,
        "numShares": "0",
        "numSharesAdjustedForUserIntention": "0",
        "realizedProfitLoss": "0",
        "unrealizedProfitLoss": "0",
        "averagePrice": "0",
      }, {
        "marketId": "0x0000000000000000000000000000000000000001",
        "outcome": 3,
        "numShares": "0",
        "numSharesAdjustedForUserIntention": "0",
        "realizedProfitLoss": "0",
        "unrealizedProfitLoss": "0",
        "averagePrice": "0",
      }, {
        "marketId": "0x0000000000000000000000000000000000000001",
        "outcome": 4,
        "numShares": "0",
        "numSharesAdjustedForUserIntention": "0",
        "realizedProfitLoss": "0",
        "unrealizedProfitLoss": "0",
        "averagePrice": "0",
      }, {
        "marketId": "0x0000000000000000000000000000000000000001",
        "outcome": 5,
        "numShares": "0",
        "numSharesAdjustedForUserIntention": "0",
        "realizedProfitLoss": "0",
        "unrealizedProfitLoss": "0",
        "averagePrice": "0",
      }, {
        "marketId": "0x0000000000000000000000000000000000000001",
        "outcome": 6,
        "numShares": "0",
        "numSharesAdjustedForUserIntention": "0",
        "realizedProfitLoss": "0",
        "unrealizedProfitLoss": "0",
        "averagePrice": "0",
      }, {
        "marketId": "0x0000000000000000000000000000000000000001",
        "outcome": 7,
        "numShares": "0",
        "numSharesAdjustedForUserIntention": "0",
        "realizedProfitLoss": "0",
        "unrealizedProfitLoss": "0",
        "averagePrice": "0",
      }]);
    },
  });
  test({
    description: "get a user's position in one outcome of a categorical market where the user has no position",
    params: {
      account: "0x000000000000000000000000000000000000d00d",
      marketId: "0x0000000000000000000000000000000000000001",
      outcome: 4,
      sortBy: null,
      isSortDescending: null,
      limit: null,
      offset: null,
    },
    assertions: (err, userTradingPositions) => {
      assert.ifError(err);
      assert.deepEqual(userTradingPositions, [{
        "marketId": "0x0000000000000000000000000000000000000001",
        "outcome": 4,
        "numShares": "0",
        "numSharesAdjustedForUserIntention": "0",
        "realizedProfitLoss": "0",
        "unrealizedProfitLoss": "0",
        "averagePrice": "0",
      }]);
    },
  });
  test({
    description: "get a user's position in one outcome of a categorical market where the user is long",
    params: {
      account: "0x000000000000000000000000000000000b0bd00d",
      marketId: "0x1000000000000000000000000000000000000001",
      outcome: 0,
      sortBy: null,
      isSortDescending: null,
      limit: null,
      offset: null,
    },
    assertions: (err, userTradingPositions) => {
      assert.ifError(err);
      assert.deepEqual(userTradingPositions, [{
        "marketId": "0x1000000000000000000000000000000000000001",
        "outcome": 0,
        "numShares": "0.2",
        "numSharesAdjustedForUserIntention": "0.2",
        "realizedProfitLoss": "0",
        "unrealizedProfitLoss": "0",
        "averagePrice": "5.5",
      }]);
    },
  });
  test({
    description: "get a user's position in one outcome of a categorical market where the user is short",
    params: {
      account: "0x000000000000000000000000000000000d00db0b",
      marketId: "0x1000000000000000000000000000000000000001",
      outcome: 0,
      sortBy: null,
      isSortDescending: null,
      limit: null,
      offset: null,
    },
    assertions: (err, userTradingPositions) => {
      assert.ifError(err);
      assert.deepEqual(userTradingPositions, [{
        "marketId": "0x1000000000000000000000000000000000000001",
        "outcome": 0,
        "numShares": "0.2",
        "numSharesAdjustedForUserIntention": "-0.2",
        "realizedProfitLoss": "0",
        "unrealizedProfitLoss": "0",
        "averagePrice": "5.5",
      }]);
    },
  });
  test({
    description: "get a user's position where they have no position",
    params: {
      account: "0x0000000000000000000000000000000000nobody",
      marketId: "0x0000000000000000000000000000000000000002",
      outcome: 1,
      sortBy: null,
      isSortDescending: null,
      limit: null,
      offset: null,
    },
    assertions: (err, userTradingPositions) => {
      assert.ifError(err);
      assert.deepEqual(userTradingPositions, []);
    },
  });
});
