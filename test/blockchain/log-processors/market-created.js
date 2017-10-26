"use strict";

const assert = require("chai").assert;
const { parallel } = require("async");
const setupTestDb = require("../../test.database");
const { processMarketCreatedLog, processMarketCreatedLogRemoval } = require("../../../build/blockchain/log-processors/market-created");

describe("blockchain/log-processors/market-created", () => {
  const test = (t) => {
    const getState = (db, params, callback) => {
      parallel({
        markets: next => db("markets").where({ marketID: params.log.market }).asCallback(next),
        categories: next => db("categories").where({ category: params.log.extraInfo.category }).asCallback(next),
        outcomes: next => db("outcomes").where({ marketID: params.log.market }).asCallback(next),
        tokens: next => db("tokens").where({ marketID: params.log.market }).asCallback(next),
      }, callback);
    };
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          processMarketCreatedLog(db, t.params.augur, trx, t.params.log, (err) => {
            assert.isNull(err);
            getState(trx, t.params, (err, records) => {
              t.assertions.onAdded(err, records);
              processMarketCreatedLogRemoval(db, t.params.augur, trx, t.params.log, (err) => {
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
  test({
    description: "market created log and removal",
    params: {
      log: {
        blockNumber: 7,
        market: "0x1111111111111111111111111111111111111111",
        marketCreator: "0x0000000000000000000000000000000000000b0b",
        marketCreationFee: "0.1",
        extraInfo: {
          marketType: "binary",
          minPrice: "0",
          maxPrice: "1",
          category: "TEST_CATEGORY",
          tag1: "TEST_TAG_1",
          tag2: "TEST_TAG_2",
          shortDescription: "this is a test market",
          longDescription: "this is the long description of a test market",
          resolutionSource: "https://www.trusted-third-party-co.com",
        }
      },
      augur: {
        api: {
          Market: {
            getNumberOfOutcomes: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "0x2");
            },
            getReportingWindow: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "0x1000000000000000000000000000000000000001");
            },
            getEndTime: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "0x123456789");
            },
            getDesignatedReporter: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "0x000000000000000000000000000000000000b0b2");
            },
            getDesignatedReportStake: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "0x1000000");
            },
            getNumTicks: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "0x2a00");
            },
            getUniverse: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "0x000000000000000000000000000000000000000b");
            },
            getMarketCreatorSettlementFeeDivisor: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x1111111111111111111111111111111111111111");
              callback(null, "0x64");
            },
            getShareToken: (p, callback) => {
              callback(null, `SHARE_TOKEN_${p._outcome}`);
            },
          },
          Universe: {
            getReportingFeeDivisor: (p, callback) => {
              assert.strictEqual(p.tx.to, "0x000000000000000000000000000000000000000b");
              callback(null, "0x3e8");
            }
          }
        }
      }
    },
    assertions: {
      onAdded: (err, records) => {
        assert.isNull(err);
        assert.deepEqual(records, {
          markets: [{
            marketID: "0x1111111111111111111111111111111111111111",
            universe: "0x000000000000000000000000000000000000000b",
            marketType: "binary",
            numOutcomes: 2,
            minPrice: 0,
            maxPrice: 1,
            marketCreator: "0x0000000000000000000000000000000000000b0b",
            creationBlockNumber: 7,
            creationFee: 0.1,
            reportingFeeRate: 0.001,
            marketCreatorFeeRate: 0.01,
            marketCreatorFeesCollected: 0,
            category: "TEST_CATEGORY",
            tag1: "TEST_TAG_1",
            tag2: "TEST_TAG_2",
            volume: 0,
            sharesOutstanding: 0,
            reportingWindow: "0x1000000000000000000000000000000000000001",
            endTime: 4886718345,
            finalizationTime: null,
            marketStateID: null,
            shortDescription: "this is a test market",
            longDescription: "this is the long description of a test market",
            designatedReporter: "0x000000000000000000000000000000000000b0b2",
            designatedReportStake: 16777216,
            resolutionSource: "https://www.trusted-third-party-co.com",
            numTicks: 10752,
            consensusOutcome: null,
            isInvalid: null,
          }],
          categories: [{
            category: "TEST_CATEGORY",
            popularity: 0,
            universe: "0x000000000000000000000000000000000000000b",
          }],
          outcomes: [{
            marketID: "0x1111111111111111111111111111111111111111",
            outcome: 0,
            price: 0.5,
            sharesOutstanding: 0,
          }, {
            marketID: "0x1111111111111111111111111111111111111111",
            outcome: 1,
            price: 0.5,
            sharesOutstanding: 0,
          }],
          tokens: [{
            contractAddress: "SHARE_TOKEN_0",
            symbol: "shares",
            marketID: "0x1111111111111111111111111111111111111111",
            outcome: 0,
          }, {
            contractAddress: "SHARE_TOKEN_1",
            symbol: "shares",
            marketID: "0x1111111111111111111111111111111111111111",
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
    }
  });
});
