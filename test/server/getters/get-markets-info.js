"use strict";

const unlink = require("fs").unlink;
const join = require("path").join;
const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { getMarketsInfo } = require("../../../build/server/getters/get-markets-info");


describe("server/getters/get-markets-info", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        if (err) assert.fail(err);
        getMarketsInfo(db, t.params.universe, t.params.marketIDs, t.params.sortBy, t.params.isSortDescending, t.params.limit, t.params.offset, (err, marketsInfo) => {
          t.assertions(err, marketsInfo);
          done();
        });
      });
    });
  };
  test({
    description: "get markets in universe b",
    params: {
      universe: "0x000000000000000000000000000000000000000b",
      marketIDs: null
    },
    assertions: (err, marketsInfo) => {
      assert.isNull(err);
      assert.deepEqual(marketsInfo, [
        {
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
            price: 0.125,
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
        },
        {
          id: "0x0000000000000000000000000000000000000002",
          universe: "0x000000000000000000000000000000000000000b",
          type: "binary",
          numOutcomes: 2,
          minPrice: 0,
          maxPrice: 1,
          cumulativeScale: "1",
          author: "0x0000000000000000000000000000000000000b0b",
          creationTime: 1506480000,
          creationBlock: 1400100,
          creationFee: 10,
          reportingFeeRate: 0.02,
          marketCreatorFeeRate: 0.01,
          marketCreatorFeesCollected: 0,
          category: "test category",
          tags: ["test tag 1", "test tag 2"],
          volume: 0,
          outstandingShares: 0,
          reportingWindow: "0x1000000000000000000000000000000000000000",
          endDate: 1506573480,
          finalizationTime: null,
          description: "This is a binary test market created by b0b.",
          extraInfo: null,
          designatedReporter: "0x0000000000000000000000000000000000000b0b",
          designatedReportStake: 10,
          resolutionSource: "http://www.trusted-third-party.com",
          numTicks: 2,
          consensus: null,
          outcomes: [{
            id: 0,
            outstandingShares: 1000,
            price: 0.5
          }, {
            id: 1,
            outstandingShares: 1000,
            price: 0.5
          }]
        },
        {
          id: "0x0000000000000000000000000000000000000003",
          universe: "0x000000000000000000000000000000000000000b",
          type: "binary",
          numOutcomes: 2,
          minPrice: 0,
          maxPrice: 1,
          cumulativeScale: "1",
          author: "0x000000000000000000000000000000000000d00d",
          creationTime: 1506480015,
          creationBlock: 1400101,
          creationFee: 10,
          reportingFeeRate: 0.02,
          marketCreatorFeeRate: 0.01,
          marketCreatorFeesCollected: 0,
          category: "test category",
          tags: ["test tag 1", "test tag 2"],
          volume: 0,
          outstandingShares: 0,
          reportingWindow: "0x1000000000000000000000000000000000000000",
          endDate: 1506573500,
          finalizationTime: null,
          description: "This is another binary test market created by d00d.",
          extraInfo: null,
          designatedReporter: "0x000000000000000000000000000000000000d00d",
          designatedReportStake: 10,
          resolutionSource: "http://www.ttp-inc.com/0000000000000000000000000000000000000003",
          numTicks: 16,
          consensus: null,
          outcomes: [{
            id: 0,
            outstandingShares: 10,
            price: 0.5
          }, {
            id: 1,
            outstandingShares: 10,
            price: 0.5
          }]
        }]
      );
    }
  });
  test({
    description: "get markets by specifying market IDs",
    params: {
      universe: null,
      marketIDs: [
        "0x0000000000000000000000000000000000000001",
        "0x0000000000000000000000000000000000000002"
      ]
    },
    assertions: (err, marketsInfo) => {
      assert.isNull(err);
      assert.deepEqual(marketsInfo, [
        {
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
            price: 0.125,
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
        },
        {
          id: "0x0000000000000000000000000000000000000002",
          universe: "0x000000000000000000000000000000000000000b",
          type: "binary",
          numOutcomes: 2,
          minPrice: 0,
          maxPrice: 1,
          cumulativeScale: "1",
          author: "0x0000000000000000000000000000000000000b0b",
          creationTime: 1506480000,
          creationBlock: 1400100,
          creationFee: 10,
          reportingFeeRate: 0.02,
          marketCreatorFeeRate: 0.01,
          marketCreatorFeesCollected: 0,
          category: "test category",
          tags: ["test tag 1", "test tag 2"],
          volume: 0,
          outstandingShares: 0,
          reportingWindow: "0x1000000000000000000000000000000000000000",
          endDate: 1506573480,
          finalizationTime: null,
          description: "This is a binary test market created by b0b.",
          extraInfo: null,
          designatedReporter: "0x0000000000000000000000000000000000000b0b",
          designatedReportStake: 10,
          resolutionSource: "http://www.trusted-third-party.com",
          numTicks: 2,
          consensus: null,
          outcomes: [{
            id: 0,
            outstandingShares: 1000,
            price: 0.5
          }, {
            id: 1,
            outstandingShares: 1000,
            price: 0.5
          }]
        }]
      );
    }
  });
  test({
    description: "nonexistent universe, no market IDs",
    params: {
      universe: "0x1010101010101010101010101010101010101010",
      marketIDs: undefined
    },
    assertions: (err, marketsInfo) => {
      assert.isNull(err);
      assert.isUndefined(marketsInfo);
    }
  });
});
