"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const {getMarketPriceCandlesticks} = require("../../../build/server/getters/get-market-price-candlesticks");

describe("server/getters/get-market-price-candlesticks", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        getMarketPriceCandlesticks(db, t.params.marketId, t.params.outcome, t.params.start, t.params.end, t.params.period, (err, marketPriceHistory) => {
          t.assertions(err, marketPriceHistory);
          done();
        });
      });
    });
  };
  test({
    description: "market has a one candlestick",
    params: {
      marketId: "0x0000000000000000000000000000000000000015",
    },
    assertions: (err, marketPriceHistory) => {
      assert.isNull(err);
      assert.deepEqual(marketPriceHistory, {
        0: [{
          end: "4.2",
          max: "5.5",
          min: "4.2",
          start: "5.5",
          startTimestamp: 1506474480,
        }],
      });
    },
  });
  test({
    description: "market has a two candlesticks with 20s period",
    params: {
      marketId: "0x0000000000000000000000000000000000000015",
      period: 20,
      start: 1506474473,
    },
    assertions: (err, marketPriceHistory) => {
      assert.isNull(err);
      assert.deepEqual(marketPriceHistory, {
        0: [{
          end: "5.5",
          max: "5.5",
          min: "5.5",
          start: "5.5",
          startTimestamp: 1506474493,
        },
        {
          end: "4.2",
          max: "4.2",
          min: "4.2",
          start: "4.2",
          startTimestamp: 1506474513,
        }],
      });
    },
  });
  test({
    description: "market has a one candlesticks with 20s period, due to different start time",
    params: {
      marketId: "0x0000000000000000000000000000000000000015",
      period: 20,
      start: 1506474478,
    },
    assertions: (err, marketPriceHistory) => {
      assert.isNull(err);
      assert.deepEqual(marketPriceHistory, {
        0: [{
          end: "4.2",
          max: "5.5",
          min: "4.2",
          start: "5.5",
          startTimestamp: 1506474498,
        }],
      });
    },
  });
  test({
    description: "market has no candlesticks",
    params: {
      marketId: "0x0000000000000000000000000000000000001111",
    },
    assertions: (err, marketPriceHistory) => {
      assert.isNull(err);
      assert.deepEqual(marketPriceHistory, {});
    },
  });
});
