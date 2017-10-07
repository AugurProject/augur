"use strict";

const unlink = require("fs").unlink;
const join = require("path").join;
const assert = require("chai").assert;
const db = require("../../test.database");
const { checkAugurDbSetup } = require("../../../build/setup/check-augur-db-setup");
const { getMarketsInfo } = require("../../../build/server/getters/get-markets-info");


describe("server/getters/get-markets-info", () => {
  const test = (t) => {
    it(t.description, (done) => {
      checkAugurDbSetup(db, (err) => {
        getMarketsInfo(db, t.params.universe, (err, marketsInfo) => {
          t.assertions(err, marketsInfo);
          db.seed.run().then(function() { done(); });
        });
      });
    });
  };
  test({
    description: "get markets in universe b",
    params: {
      universe: "0x000000000000000000000000000000000000000b"
    },
    assertions: (err, marketsInfo) => {
      assert.isNull(err);
      assert.deepEqual(marketsInfo, {
        "0x0000000000000000000000000000000000000001": {
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
        },
        "0x0000000000000000000000000000000000000002": {
          marketID: "0x0000000000000000000000000000000000000002",
          universe: "0x000000000000000000000000000000000000000b",
          marketType: "binary",
          numOutcomes: 2,
          minPrice: 0,
          maxPrice: 1000000000000000000,
          marketCreator: "0x0000000000000000000000000000000000000b0b",
          creationTime: 1506480000,
          creationBlockNumber: 1400100,
          creationFee: 1000000000000000000,
          marketCreatorFeeRate: 1,
          marketCreatorFeesCollected: 0,
          topic: "test topic",
          tag1: "test tag 1",
          tag2: "test tag 2",
          volume: 0,
          sharesOutstanding: 0,
          reportingWindow: "0x1000000000000000000000000000000000000000",
          endTime: 1506573480,
          finalizationTime: null,
          shortDescription: "This is a binary test market created by b0b.",
          longDescription: null,
          designatedReporter: "0x0000000000000000000000000000000000000b0b",
          resolutionSource: "http://www.trusted-third-party.com"
        },
        "0x0000000000000000000000000000000000000003": {
          marketID: "0x0000000000000000000000000000000000000003",
          universe: "0x000000000000000000000000000000000000000b",
          marketType: "binary",
          numOutcomes: 2,
          minPrice: 0,
          maxPrice: 1000000000000000000,
          marketCreator: "0x000000000000000000000000000000000000d00d",
          creationTime: 1506480015,
          creationBlockNumber: 1400101,
          creationFee: 1000000000000000000,
          marketCreatorFeeRate: 1,
          marketCreatorFeesCollected: 0,
          topic: "test topic",
          tag1: "test tag 1",
          tag2: "test tag 2",
          volume: 0,
          sharesOutstanding: 0,
          reportingWindow: "0x1000000000000000000000000000000000000000",
          endTime: 1506573500,
          finalizationTime: null,
          shortDescription: "This is another binary test market created by d00d.",
          longDescription: null,
          designatedReporter: "0x000000000000000000000000000000000000d00d",
          resolutionSource: "http://www.ttp-inc.com/0000000000000000000000000000000000000003"
        }
      });
    }
  });
  test({
    description: "nonexistent universe",
    params: {
      universe: "0x1010101010101010101010101010101010101010"
    },
    assertions: (err, marketsInfo) => {
      assert.isNull(err);
      assert.isUndefined(marketsInfo);
    }
  });
});
