"use strict";

const Augur = require("augur.js");
const assert = require("chai").assert;
const {parallel} = require("async");
const {BigNumber} = require("bignumber.js");
const setupTestDb = require("../../test.database");
const {processMarketCreatedLog, processMarketCreatedLogRemoval} = require("../../../build/blockchain/log-processors/market-created");
const {getMarketsWithReportingState} = require("../../../build/server/getters/database");

describe("blockchain/log-processors/market-created", () => {
  const test = (t) => {
    const getState = (db, params, callback) => parallel({
      markets: next => getMarketsWithReportingState(db).where({"markets.marketId": params.log.market}).asCallback(next),
      categories: next => db("categories").where({category: params.log.topic}).asCallback(next),
      outcomes: next => db("outcomes").where({marketId: params.log.market}).asCallback(next),
      tokens: next => db("tokens").select(["contractAddress", "symbol", "marketId", "outcome"]).where({marketId: params.log.market}).asCallback(next),
    }, callback);
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        db.transaction((trx) => {
          processMarketCreatedLog(trx, t.params.augur, t.params.log, (err) => {
            assert.ifError(err);
            getState(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processMarketCreatedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                assert.ifError(err);
                getState(trx, t.params, (err, records) => {
                  t.assertions.onRemoved(err, records);
                  db.destroy();
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
    description: "yesNo market MarketCreated log and removal",
    params: {
      log: {
        blockNumber: 7,
        universe: "0x000000000000000000000000000000000000000b",
        market: "0x1111111111111111111111111111111111111111",
        marketCreator: "0x0000000000000000000000000000000000000b0b",
        marketCreationFee: "0.1",
        topic: "TEST_CATEGORY",
        marketType: "0",
        minPrice: (new BigNumber("0", 10)).toFixed(),
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
            getMarketCreatorSettlementFeeDivisor: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "100");
            },
            getMarketCreatorMailbox: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "0xbbb1111111111111111111111111111111111111");
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
          },
        },
        constants,
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, {
          markets: [{
            marketId: "0x1111111111111111111111111111111111111111",
            universe: "0x000000000000000000000000000000000000000b",
            marketType: "yesNo",
            numOutcomes: 2,
            minPrice: new BigNumber("0", 10),
            maxPrice: new BigNumber("1", 10),
            marketCreator: "0x0000000000000000000000000000000000000b0b",
            creationBlockNumber: 7,
            creationFee: new BigNumber("0.1", 10),
            creationTime: 10000000,
            reportingFeeRate: new BigNumber("0.001", 10),
            disputeRounds: null,
            marketCreatorFeeRate: new BigNumber("0.01", 10),
            marketCreatorFeesBalance: new BigNumber("0", 10),
            marketCreatorMailbox: "0xbbb1111111111111111111111111111111111111",
            marketCreatorMailboxOwner: "0x0000000000000000000000000000000000000b0b",
            initialReportSize: null,
            category: "TEST_CATEGORY",
            tag1: "TEST_TAG_1",
            tag2: "TEST_TAG_2",
            volume: new BigNumber("0", 10),
            sharesOutstanding: new BigNumber("0", 10),
            reportingState: "PRE_REPORTING",
            feeWindow: "0x1000000000000000000000000000000000000001",
            endTime: 4886718345,
            finalizationBlockNumber: null,
            marketStateId: 18,
            shortDescription: "this is a test market",
            longDescription: "this is the long description of a test market",
            scalarDenomination: null,
            designatedReporter: "0x000000000000000000000000000000000000b0b2",
            designatedReportStake: new BigNumber("16777216", 10),
            resolutionSource: "https://www.trusted-third-party-co.com",
            numTicks: new BigNumber("10000", 10),
            consensusPayoutId: null,
            isInvalid: null,
            forking: 0,
            needsMigration: 0,
            needsDisavowal: 0,
          }],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [{
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 0,
            price: new BigNumber("0.5", 10),
            volume: new BigNumber("0", 10),
            description: null,
          }, {
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 1,
            price: new BigNumber("0.5", 10),
            volume: new BigNumber("0", 10),
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
        assert.ifError(err);
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
        universe: "0x000000000000000000000000000000000000000b",
        market: "0x1111111111111111111111111111111111111112",
        marketCreator: "0x0000000000000000000000000000000000000b0b",
        marketCreationFee: "0.1",
        topic: "TEST_CATEGORY",
        marketType: "1",
        minPrice: (new BigNumber("0", 10)).toFixed(),
        maxPrice: (new BigNumber("1", 10)).toFixed(),
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
            getMarketCreatorSettlementFeeDivisor: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111112");
              callback(null, "100");
            },
            getMarketCreatorMailbox: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111112");
              callback(null, "0xbbb1111111111111111111111111111111111112");
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
          },
        },
        constants,
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, {
          markets: [{
            marketId: "0x1111111111111111111111111111111111111112",
            universe: "0x000000000000000000000000000000000000000b",
            marketType: "categorical",
            numOutcomes: 4,
            minPrice: new BigNumber("0", 10),
            maxPrice: new BigNumber("1", 10),
            marketCreator: "0x0000000000000000000000000000000000000b0b",
            creationBlockNumber: 7,
            creationFee: new BigNumber("0.1", 10),
            creationTime: 10000000,
            reportingFeeRate: new BigNumber("0.001", 10),
            disputeRounds: null,
            marketCreatorFeeRate: new BigNumber("0.01", 10),
            marketCreatorFeesBalance: new BigNumber("0", 10),
            marketCreatorMailbox: "0xbbb1111111111111111111111111111111111112",
            marketCreatorMailboxOwner: "0x0000000000000000000000000000000000000b0b",
            initialReportSize: null,
            category: "TEST_CATEGORY",
            tag1: "TEST_TAG_1",
            tag2: "TEST_TAG_2",
            volume: new BigNumber("0", 10),
            sharesOutstanding: new BigNumber("0", 10),
            reportingState: "PRE_REPORTING",
            feeWindow: "0x1000000000000000000000000000000000000001",
            endTime: 4886718345,
            finalizationBlockNumber: null,
            marketStateId: 18,
            shortDescription: "this is a test market",
            longDescription: "this is the long description of a test market",
            scalarDenomination: null,
            designatedReporter: "0x000000000000000000000000000000000000b0b2",
            designatedReportStake: new BigNumber("16777216", 10),
            resolutionSource: "https://www.trusted-third-party-co.com",
            numTicks: new BigNumber("10000", 10),
            consensusPayoutId: null,
            isInvalid: null,
            forking: 0,
            needsMigration: 0,
            needsDisavowal: 0,
          }],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [{
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 0,
            price: new BigNumber("0.25", 10),
            volume: new BigNumber("0", 10),
            description: "test outcome 0",
          }, {
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 1,
            price: new BigNumber("0.25", 10),
            volume: new BigNumber("0", 10),
            description: "test outcome 1",
          }, {
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 2,
            price: new BigNumber("0.25", 10),
            volume: new BigNumber("0", 10),
            description: "test outcome 2",
          }, {
            marketId: "0x1111111111111111111111111111111111111112",
            outcome: 3,
            price: new BigNumber("0.25", 10),
            volume: new BigNumber("0", 10),
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
        assert.ifError(err);
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
        universe: "0x000000000000000000000000000000000000000b",
        market: "0x1111111111111111111111111111111111111113",
        marketCreator: "0x0000000000000000000000000000000000000b0b",
        marketCreationFee: "0.1",
        topic: "TEST_CATEGORY",
        marketType: "2",
        minPrice: (new BigNumber("-3", 10)).toFixed(),
        maxPrice: (new BigNumber("15.2", 10)).toFixed(),
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
            getMarketCreatorSettlementFeeDivisor: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111113");
              callback(null, "100");
            },
            getMarketCreatorMailbox: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111113");
              callback(null, "0xbbb1111111111111111111111111111111111113");
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
          },
        },
        constants,
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, {
          markets: [{
            marketId: "0x1111111111111111111111111111111111111113",
            universe: "0x000000000000000000000000000000000000000b",
            marketType: "scalar",
            numOutcomes: 2,
            minPrice: new BigNumber("-3", 10),
            maxPrice: new BigNumber("15.2", 10),
            marketCreator: "0x0000000000000000000000000000000000000b0b",
            creationBlockNumber: 7,
            creationFee: new BigNumber("0.1", 10),
            creationTime: 10000000,
            reportingFeeRate: new BigNumber("0.001", 10),
            disputeRounds: null,
            marketCreatorFeeRate: new BigNumber("0.01", 10),
            marketCreatorFeesBalance: new BigNumber("0", 10),
            marketCreatorMailbox: "0xbbb1111111111111111111111111111111111113",
            marketCreatorMailboxOwner: "0x0000000000000000000000000000000000000b0b",
            initialReportSize: null,
            category: "TEST_CATEGORY",
            tag1: "TEST_TAG_1",
            tag2: "TEST_TAG_2",
            volume: new BigNumber("0", 10),
            sharesOutstanding: new BigNumber("0", 10),
            reportingState: "PRE_REPORTING",
            feeWindow: "0x1000000000000000000000000000000000000001",
            endTime: 4886718345,
            finalizationBlockNumber: null,
            marketStateId: 18,
            shortDescription: "this is a test market",
            longDescription: "this is the long description of a test market",
            scalarDenomination: null,
            designatedReporter: "0x000000000000000000000000000000000000b0b2",
            designatedReportStake: new BigNumber("16777216", 10),
            resolutionSource: "https://www.trusted-third-party-co.com",
            numTicks: new BigNumber("10000", 10),
            consensusPayoutId: null,
            isInvalid: null,
            forking: 0,
            needsMigration: 0,
            needsDisavowal: 0,
          }],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [{
            marketId: "0x1111111111111111111111111111111111111113",
            outcome: 0,
            price: new BigNumber("6.1", 10),
            volume: new BigNumber("0", 10),
            description: null,
          }, {
            marketId: "0x1111111111111111111111111111111111111113",
            outcome: 1,
            price: new BigNumber("6.1", 10),
            volume: new BigNumber("0", 10),
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
        assert.ifError(err);
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
    description: "yesNo market MarketCreated log and removal, with NULL extraInfo",
    params: {
      log: {
        blockNumber: 7,
        universe: "0x000000000000000000000000000000000000000b",
        market: "0x1111111111111111111111111111111111111111",
        marketCreator: "0x0000000000000000000000000000000000000b0b",
        marketCreationFee: "0.1",
        topic: "TEST_CATEGORY",
        marketType: "0",
        minPrice: (new BigNumber("0", 10)).toFixed(),
        maxPrice: (new BigNumber("1", 10)).toFixed(),
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
            getMarketCreatorSettlementFeeDivisor: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "100");
            },
            getMarketCreatorMailbox: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "0xbbb1111111111111111111111111111111111111");
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
          },
        },
        constants,
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, {
          markets: [{
            marketId: "0x1111111111111111111111111111111111111111",
            universe: "0x000000000000000000000000000000000000000b",
            marketType: "yesNo",
            numOutcomes: 2,
            minPrice: new BigNumber("0", 10),
            maxPrice: new BigNumber("1", 10),
            marketCreator: "0x0000000000000000000000000000000000000b0b",
            creationBlockNumber: 7,
            creationFee: new BigNumber("0.1", 10),
            creationTime: 10000000,
            reportingFeeRate: new BigNumber("0.001", 10),
            disputeRounds: null,
            marketCreatorFeeRate: new BigNumber("0.01", 10),
            marketCreatorFeesBalance: new BigNumber("0", 10),
            marketCreatorMailbox: "0xbbb1111111111111111111111111111111111111",
            marketCreatorMailboxOwner: "0x0000000000000000000000000000000000000b0b",
            initialReportSize: null,
            category: "TEST_CATEGORY",
            tag1: null,
            tag2: null,
            volume: new BigNumber("0", 10),
            sharesOutstanding: new BigNumber("0", 10),
            reportingState: "PRE_REPORTING",
            feeWindow: "0x1000000000000000000000000000000000000001",
            endTime: 4886718345,
            finalizationBlockNumber: null,
            marketStateId: 18,
            shortDescription: "this is a test market",
            longDescription: null,
            scalarDenomination: null,
            designatedReporter: "0x000000000000000000000000000000000000b0b2",
            designatedReportStake: new BigNumber("16777216", 10),
            resolutionSource: null,
            numTicks: new BigNumber("10000", 10),
            consensusPayoutId: null,
            isInvalid: null,
            forking: 0,
            needsMigration: 0,
            needsDisavowal: 0,
          }],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [{
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 0,
            price: new BigNumber("0.5", 10),
            volume: new BigNumber("0", 10),
            description: null,
          }, {
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 1,
            price: new BigNumber("0.5", 10),
            volume: new BigNumber("0", 10),
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
        assert.ifError(err);
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
    description: "yesNo market MarketCreated log and removal, with 0 creator fee rate",
    params: {
      log: {
        blockNumber: 7,
        universe: "0x000000000000000000000000000000000000000b",
        market: "0x1111111111111111111111111111111111111111",
        marketCreator: "0x0000000000000000000000000000000000000b0b",
        marketCreationFee: "0",
        topic: "TEST_CATEGORY",
        marketType: "0",
        minPrice: (new BigNumber("0", 10)).toFixed(),
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
            getMarketCreatorSettlementFeeDivisor: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "100");
            },
            getMarketCreatorMailbox: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "0xbbb1111111111111111111111111111111111111");
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
          },
        },
        constants,
      },
    },
    assertions: {
      onAdded: (err, records) => {
        assert.ifError(err);
        assert.deepEqual(records, {
          markets: [{
            marketId: "0x1111111111111111111111111111111111111111",
            universe: "0x000000000000000000000000000000000000000b",
            marketType: "yesNo",
            numOutcomes: 2,
            minPrice: new BigNumber("0", 10),
            maxPrice: new BigNumber("1", 10),
            marketCreator: "0x0000000000000000000000000000000000000b0b",
            creationBlockNumber: 7,
            creationFee: new BigNumber("0", 10),
            creationTime: 10000000,
            reportingFeeRate: new BigNumber("0.001", 10),
            disputeRounds: null,
            marketCreatorFeeRate: new BigNumber("0.01", 10),
            marketCreatorFeesBalance: new BigNumber("0", 10),
            marketCreatorMailbox: "0xbbb1111111111111111111111111111111111111",
            marketCreatorMailboxOwner: "0x0000000000000000000000000000000000000b0b",
            initialReportSize: null,
            category: "TEST_CATEGORY",
            tag1: "TEST_TAG_1",
            tag2: "TEST_TAG_2",
            volume: new BigNumber("0", 10),
            sharesOutstanding: new BigNumber("0", 10),
            reportingState: "PRE_REPORTING",
            feeWindow: "0x1000000000000000000000000000000000000001",
            endTime: 4886718345,
            finalizationBlockNumber: null,
            marketStateId: 18,
            shortDescription: "this is a test market",
            longDescription: "this is the long description of a test market",
            scalarDenomination: null,
            designatedReporter: "0x000000000000000000000000000000000000b0b2",
            designatedReportStake: new BigNumber("16777216", 10),
            resolutionSource: "https://www.trusted-third-party-co.com",
            numTicks: new BigNumber("10000", 10),
            consensusPayoutId: null,
            isInvalid: null,
            forking: 0,
            needsMigration: 0,
            needsDisavowal: 0,
          }],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [{
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 0,
            price: new BigNumber("0.5", 10),
            volume: new BigNumber("0", 10),
            description: null,
          }, {
            marketId: "0x1111111111111111111111111111111111111111",
            outcome: 1,
            price: new BigNumber("0.5", 10),
            volume: new BigNumber("0", 10),
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
        assert.ifError(err);
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
