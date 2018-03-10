"use strict";

const Augur = require("augur.js");
const assert = require("chai").assert;
const { parallel } = require("async");
const setupTestDb = require("../../test.database");
const { processMarketCreatedLog, processMarketCreatedLogRemoval } = require("../../../build/blockchain/log-processors/market-created");
const { getMarketsWithReportingState } = require("../../../build/server/getters/database");

describe("blockchain/log-processors/market-created", () => {
  const test = (t) => {
    const getState = (db, params, callback) => parallel({
      markets: next => getMarketsWithReportingState(db).where({"markets.marketId": params.log.market }).asCallback(next),
      categories: next => db("categories").where({ category: params.log.topic }).asCallback(next),
      outcomes: next => db("outcomes").where({ marketId: params.log.market }).asCallback(next),
      tokens: next => db("tokens").where({ marketId: params.log.market }).asCallback(next),
    }, callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          processMarketCreatedLog(trx, t.params.augur, t.params.log, (err) => {
            assert.isNull(err);
            getState(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processMarketCreatedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                getState(trx, t.params, (err, records) => {
                  t.assertions.onRemoved(err, records);
                  done();
                });
              });
            });
          });
        });
      });
    });
  };
  const constants = new Augur().constants;
  test({
    description: "binary market MarketCreated log and removal",
    params: {
      log: {
        blockNumber: 7,
        market: "0x1111111111111111111111111111111111111111",
        marketCreator: "0x0000000000000000000000000000000000000b0b",
        marketCreationFee: "0.1",
        topic: "TEST_CATEGORY",
        marketType: "0",
        minPrice: "0",
        maxPrice: "1",
        description: "this is a test market",
        extraInfo: {
          tags: ["TEST_TAG_1", "TEST_TAG_2"],
          longDescription: "this is the long description of a test market",
          resolutionSource: "https://www.trusted-third-party-co.com",
        },
      },
      augur: {
        api: {
          Market: {
            getNumberOfOutcomes: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "2");
            },
            getFeeWindow: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "0x1000000000000000000000000000000000000001");
            },
            getEndTime: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "4886718345");
            },
            getDesignatedReporter: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "0x000000000000000000000000000000000000b0b2");
            },
            getNumTicks: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "10000");
            },
            getUniverse: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "0x000000000000000000000000000000000000000b");
            },
            getMarketCreatorSettlementFeeDivisor: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "100");
            },
            getShareToken: (p, callback) => {
              callback(null, `SHARE_TOKEN_${p._outcome}`);
            },
          },
          Universe: {
            getOrCacheReportingFeeDivisor: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x000000000000000000000000000000000000000b");
              callback(null, "1000");
            },
            getOrCacheDesignatedReportStake: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x000000000000000000000000000000000000000b");
              callback(null, "16777216000000000000000000");
            },
          },
        },
        constants,
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          markets: [{
            marketId: "0x1111111111111111111111111111111111111111",
            universe: "0x000000000000000000000000000000000000000b",
            marketType: "binary",
            numOutcomes: 2,
            minPrice: "0",
            maxPrice: "1",
            marketCreator: "0x0000000000000000000000000000000000000b0b",
            creationBlockNumber: 7,
            creationFee: "0.1",
            creationTime: 10000000,
            reportingFeeRate: 0.001,
            reportingRoundsCompleted: 0,
            marketCreatorFeeRate: 0.01,
            marketCreatorFeesCollected: "0",
            marketCreatorFeesClaimed: "0",
            initialReportSize: null,
            category: "TEST_CATEGORY",
            tag1: "TEST_TAG_1",
            tag2: "TEST_TAG_2",
            volume: "0",
            sharesOutstanding: "0",
            reportingState: "PRE_REPORTING",
            feeWindow: "0x1000000000000000000000000000000000000001",
            endTime: 4886718345,
            finalizationTime: null,
            marketStateId: 17,
            shortDescription: "this is a test market",
            longDescription: "this is the long description of a test market",
            designatedReporter: "0x000000000000000000000000000000000000b0b2",
            designatedReportStake: "16777216",
            resolutionSource: "https://www.trusted-third-party-co.com",
            numTicks: "10000",
            consensusPayoutId: null,
            isInvalid: null,
          }],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [{
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 0,
            price: 0.5,
            volume: "0",
            description: null,
          }, {
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 1,
            price: 0.5,
            volume: "0",
            description: null,
          }],
          tokens: [{
            contractAddress: "SHARE_TOKEN_0",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 0,
          }, {
            contractAddress: "SHARE_TOKEN_1",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 1,
          }],
        });
      },
      onRemoved: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          markets: [],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [],
          tokens: [],
        });
      },
    },
  });
  test({
    description: "categorical market MarketCreated log and removal",
    params: {
      log: {
        blockNumber: 7,
        market: "0x1111111111111111111111111111111111111112",
        marketCreator: "0x0000000000000000000000000000000000000b0b",
        marketCreationFee: "0.1",
        topic: "TEST_CATEGORY",
        marketType: "1",
        minPrice: "0",
        maxPrice: "1",
        description: "this is a test market",
        outcomes: ["test outcome 0", "test outcome 1", "test outcome 2", "test outcome 3"],
        extraInfo: {
          tags: ["TEST_TAG_1", "TEST_TAG_2"],
          longDescription: "this is the long description of a test market",
          resolutionSource: "https://www.trusted-third-party-co.com",
        },
      },
      augur: {
        api: {
          Market: {
            getNumberOfOutcomes: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111112");
              callback(null, "4");
            },
            getFeeWindow: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111112");
              callback(null, "0x1000000000000000000000000000000000000001");
            },
            getEndTime: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111112");
              callback(null, "4886718345");
            },
            getDesignatedReporter: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111112");
              callback(null, "0x000000000000000000000000000000000000b0b2");
            },
            getNumTicks: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111112");
              callback(null, "10000");
            },
            getUniverse: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111112");
              callback(null, "0x000000000000000000000000000000000000000b");
            },
            getMarketCreatorSettlementFeeDivisor: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111112");
              callback(null, "100");
            },
            getShareToken: (p, callback) => {
              callback(null, `SHARE_TOKEN_${p._outcome}`);
            },
          },
          Universe: {
            getOrCacheReportingFeeDivisor: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x000000000000000000000000000000000000000b");
              callback(null, "1000");
            },
            getOrCacheDesignatedReportStake: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x000000000000000000000000000000000000000b");
              callback(null, "16777216000000000000000000");
            },
          },
        },
        constants,
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          markets: [{
            marketId: "0x1111111111111111111111111111111111111112",
            universe: "0x000000000000000000000000000000000000000b",
            marketType: "categorical",
            numOutcomes: 4,
            minPrice: "0",
            maxPrice: "1",
            marketCreator: "0x0000000000000000000000000000000000000b0b",
            creationBlockNumber: 7,
            creationFee: "0.1",
            creationTime: 10000000,
            reportingFeeRate: 0.001,
            reportingRoundsCompleted: 0,
            marketCreatorFeeRate: 0.01,
            marketCreatorFeesCollected: "0",
            marketCreatorFeesClaimed: "0",
            initialReportSize: null,
            category: "TEST_CATEGORY",
            tag1: "TEST_TAG_1",
            tag2: "TEST_TAG_2",
            volume: "0",
            sharesOutstanding: "0",
            reportingState: "PRE_REPORTING",
            feeWindow: "0x1000000000000000000000000000000000000001",
            endTime: 4886718345,
            finalizationTime: null,
            marketStateId: 17,
            shortDescription: "this is a test market",
            longDescription: "this is the long description of a test market",
            designatedReporter: "0x000000000000000000000000000000000000b0b2",
            designatedReportStake: "16777216",
            resolutionSource: "https://www.trusted-third-party-co.com",
            numTicks: "10000",
            consensusPayoutId: null,
            isInvalid: null,
          }],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [{
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 0,
            price: 0.25,
            volume: "0",
            description: "test outcome 0",
          }, {
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 1,
            price: 0.25,
            volume: "0",
            description: "test outcome 1",
          }, {
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 2,
            price: 0.25,
            volume: "0",
            description: "test outcome 2",
          }, {
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 3,
            price: 0.25,
            volume: "0",
            description: "test outcome 3",
          }],
          tokens: [{
            contractAddress: "SHARE_TOKEN_0",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 0,
          }, {
            contractAddress: "SHARE_TOKEN_1",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 1,
          }, {
            contractAddress: "SHARE_TOKEN_2",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 2,
          }, {
            contractAddress: "SHARE_TOKEN_3",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 3,
          }],
        });
      },
      onRemoved: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          markets: [],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [],
          tokens: [],
        });
      },
    },
  });
  test({
    description: "scalar market MarketCreated log and removal",
    params: {
      log: {
        blockNumber: 7,
        market: "0x1111111111111111111111111111111111111113",
        marketCreator: "0x0000000000000000000000000000000000000b0b",
        marketCreationFee: "0.1",
        topic: "TEST_CATEGORY",
        marketType: "2",
        minPrice: "-3",
        maxPrice: "15.2",
        description: "this is a test market",
        extraInfo: {
          tags: ["TEST_TAG_1", "TEST_TAG_2"],
          longDescription: "this is the long description of a test market",
          resolutionSource: "https://www.trusted-third-party-co.com",
        },
      },
      augur: {
        api: {
          Market: {
            getNumberOfOutcomes: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111113");
              callback(null, "2");
            },
            getFeeWindow: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111113");
              callback(null, "0x1000000000000000000000000000000000000001");
            },
            getEndTime: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111113");
              callback(null, "4886718345");
            },
            getDesignatedReporter: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111113");
              callback(null, "0x000000000000000000000000000000000000b0b2");
            },
            getNumTicks: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111113");
              callback(null, "10000");
            },
            getUniverse: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111113");
              callback(null, "0x000000000000000000000000000000000000000b");
            },
            getMarketCreatorSettlementFeeDivisor: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111113");
              callback(null, "100");
            },
            getShareToken: (p, callback) => {
              callback(null, `SHARE_TOKEN_${p._outcome}`);
            },
          },
          Universe: {
            getOrCacheReportingFeeDivisor: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x000000000000000000000000000000000000000b");
              callback(null, "1000");
            },
            getOrCacheDesignatedReportStake: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x000000000000000000000000000000000000000b");
              callback(null, "16777216000000000000000000");
            },
          },
        },
        constants,
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          markets: [{
            marketId: "0x1111111111111111111111111111111111111113",
            universe: "0x000000000000000000000000000000000000000b",
            marketType: "scalar",
            numOutcomes: 2,
            minPrice: "-3",
            maxPrice: "15.2",
            marketCreator: "0x0000000000000000000000000000000000000b0b",
            creationBlockNumber: 7,
            creationFee: "0.1",
            creationTime: 10000000,
            reportingFeeRate: 0.001,
            reportingRoundsCompleted: 0,
            marketCreatorFeeRate: 0.01,
            marketCreatorFeesCollected: "0",
            marketCreatorFeesClaimed: "0",
            initialReportSize: null,
            category: "TEST_CATEGORY",
            tag1: "TEST_TAG_1",
            tag2: "TEST_TAG_2",
            volume: "0",
            sharesOutstanding: "0",
            reportingState: "PRE_REPORTING",
            feeWindow: "0x1000000000000000000000000000000000000001",
            endTime: 4886718345,
            finalizationTime: null,
            marketStateId: 17,
            shortDescription: "this is a test market",
            longDescription: "this is the long description of a test market",
            designatedReporter: "0x000000000000000000000000000000000000b0b2",
            designatedReportStake: "16777216",
            resolutionSource: "https://www.trusted-third-party-co.com",
            numTicks: "10000",
            consensusPayoutId: null,
            isInvalid: null,
          }],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [{
            marketId: "0x1111111111111111111111111111111111111113",
            outcome: 0,
            price: 6.1,
            volume: "0",
            description: null,
          }, {
            marketId: "0x1111111111111111111111111111111111111113",
            outcome: 1,
            price: 6.1,
            volume: "0",
            description: null,
          }],
          tokens: [{
            contractAddress: "SHARE_TOKEN_0",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111113",
            outcome: 0,
          }, {
            contractAddress: "SHARE_TOKEN_1",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111113",
            outcome: 1,
          }],
        });
      },
      onRemoved: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          markets: [],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [],
          tokens: [],
        });
      },
    },
  });
  test({
    description: "binary market MarketCreated log and removal, with NULL extraInfo",
    params: {
      log: {
        blockNumber: 7,
        market: "0x1111111111111111111111111111111111111111",
        marketCreator: "0x0000000000000000000000000000000000000b0b",
        marketCreationFee: "0.1",
        topic: "TEST_CATEGORY",
        marketType: "0",
        minPrice: "0",
        maxPrice: "1",
        description: "this is a test market",
        extraInfo: null,
      },
      augur: {
        api: {
          Market: {
            getNumberOfOutcomes: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "2");
            },
            getFeeWindow: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "0x1000000000000000000000000000000000000001");
            },
            getEndTime: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "4886718345");
            },
            getDesignatedReporter: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "0x000000000000000000000000000000000000b0b2");
            },
            getNumTicks: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "10000");
            },
            getUniverse: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "0x000000000000000000000000000000000000000b");
            },
            getMarketCreatorSettlementFeeDivisor: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "100");
            },
            getShareToken: (p, callback) => {
              callback(null, `SHARE_TOKEN_${p._outcome}`);
            },
          },
          Universe: {
            getOrCacheReportingFeeDivisor: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x000000000000000000000000000000000000000b");
              callback(null, "1000");
            },
            getOrCacheDesignatedReportStake: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x000000000000000000000000000000000000000b");
              callback(null, "16777216000000000000000000");
            },
          },
        },
        constants,
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          markets: [{
            marketId: "0x1111111111111111111111111111111111111111",
            universe: "0x000000000000000000000000000000000000000b",
            marketType: "binary",
            numOutcomes: 2,
            minPrice: "0",
            maxPrice: "1",
            marketCreator: "0x0000000000000000000000000000000000000b0b",
            creationBlockNumber: 7,
            creationFee: "0.1",
            creationTime: 10000000,
            reportingFeeRate: 0.001,
            reportingRoundsCompleted: 0,
            marketCreatorFeeRate: 0.01,
            marketCreatorFeesCollected: "0",
            marketCreatorFeesClaimed: "0",
            initialReportSize: null,
            category: "TEST_CATEGORY",
            tag1: null,
            tag2: null,
            volume: "0",
            sharesOutstanding: "0",
            reportingState: "PRE_REPORTING",
            feeWindow: "0x1000000000000000000000000000000000000001",
            endTime: 4886718345,
            finalizationTime: null,
            marketStateId: 17,
            shortDescription: "this is a test market",
            longDescription: null,
            designatedReporter: "0x000000000000000000000000000000000000b0b2",
            designatedReportStake: "16777216",
            resolutionSource: null,
            numTicks: "10000",
            consensusPayoutId: null,
            isInvalid: null,
          }],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [{
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 0,
            price: 0.5,
            volume: "0",
            description: null,
          }, {
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 1,
            price: 0.5,
            volume: "0",
            description: null,
          }],
          tokens: [{
            contractAddress: "SHARE_TOKEN_0",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 0,
          }, {
            contractAddress: "SHARE_TOKEN_1",
            symbol: "shares",
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 1,
          }],
        });
      },
      onRemoved: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          markets: [],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [],
          tokens: [],
        });
      },
    },
  });
});
