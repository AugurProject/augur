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
        marketID: "0x0000000000000000000000000000000000000001",
        universe: "0x000000000000000000000000000000000000000b",
        marketType: "categorical",
        numOutcomes: 8,
        minPrice: 0,
        maxPrice: 1000000000000000000,
        marketCreator: "0x0000000000000000000000000000000000000b0b",
        creationTime: 1506473474,
        creationBlockNumber: 1400000,
        creationFee: 1000000000000000000,
        marketCreatorFeeRate: 1,
        marketCreatorFeesCollected: 0,
        topic: "test topic",
        tag1: "test tag 1",
        tag2: "test tag 2",
        volume: 0,
        sharesOutstanding: 0,
        reportingWindow: "0x1000000000000000000000000000000000000000",
        endTime: 1506573470,
        finalizationTime: null,
        shortDescription: "This is a categorical test market created by b0b.",
        longDescription: null,
        designatedReporter: "0x0000000000000000000000000000000000000b0b",
        resolutionSource: "http://www.trusted-third-party.com"
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
