"use strict";

const unlink = require("fs").unlink;
const join = require("path").join;
const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getMarketInfo } = require("../../../build/server/getters/get-market-info");

describe("server/getters/get-market-info", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        getMarketInfo(db, t.params.marketID, (err, marketInfo) => {
          t.assertions(err, marketInfo);
          done();
        });
      });
    });
  };
  test({
    description: "get market info if market exists",
    params: {
      marketID: "0x0000000000000000000000000000000000000001"
    },
    assertions: (err, marketInfo) => {
      assert.isNull(err);
      assert.deepEqual(marketInfo, {
        id: "0x0000000000000000000000000000000000000001",
        universe: "0x000000000000000000000000000000000000000b",
        type: "categorical",
        numOutcomes: 8,
        minPrice: 0,
        maxPrice: 1,
        cumulativeScale: "1",
        author: "0x0000000000000000000000000000000000000b0b",
        creationTime: 1506473474,
        creationBlock: 1400000,
        creationFee: 10,
        reportingFeeRate: 0.02,
        marketCreatorFeeRate: 0.01,
        marketCreatorFeesCollected: 0,
        category: "test category",
        tags: ["test tag 1", "test tag 2"],
        volume: 0,
        outstandingShares: 0,
        reportingWindow: "0x1000000000000000000000000000000000000000",
        endDate: 1506573470,
        finalizationTime: null,
        description: "This is a categorical test market created by b0b.",
        extraInfo: null,
        designatedReporter: "0x0000000000000000000000000000000000000b0b",
        designatedReportStake: 10,
        resolutionSource: "http://www.trusted-third-party.com",
        numTicks: 24,
        consensus: null,
        outcomes: [{
          id: 0,
          outstandingShares: 100,
          price: 0.125
        }, {
          id: 1,
          outstandingShares: 100,
          price: 0.125
        }, {
          id: 2,
          outstandingShares: 100,
          price: 0.125
        }, {
          id: 3,
          outstandingShares: 100,
          price: 0.125
        }, {
          id: 4,
          outstandingShares: 100,
          price: 0.125
        }, {
          id: 5,
          outstandingShares: 100,
          price: 0.125
        }, {
          id: 6,
          outstandingShares: 100,
          price: 0.125
        }, {
          id: 7,
          outstandingShares: 100,
          price: 0.125
        }]
      });
    }
  });
  test({
    description: "market does not exist",
    params: {
      marketID: "0x1010101010101010101010101010101010101010"
    },
    assertions: (err, marketInfo) => {
      assert.isNull(err);
      assert.isUndefined(marketInfo);
    }
  });
});
