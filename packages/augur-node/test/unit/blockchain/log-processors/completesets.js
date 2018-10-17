"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const { processCompleteSetsPurchasedOrSoldLog, processCompleteSetsPurchasedOrSoldLogRemoval } = require("../../../../src/blockchain/log-processors/completesets");
const Augur = require("augur.js");
const augur = new Augur();

describe("blockchain/log-processors/completesets", () => {
  const getState = (db, params, callback) => db("completeSets").where({
    account: params.log.account,
    marketId: params.log.market,
  }).asCallback(callback);

  it("CompleteSetsPurchased log and removal", (done) => {
    const params = {
      log: {
        universe: "0x0000000000000000000000000000000000000001",
        market: "0x0000000000000000000000000000000000000002",
        account: "0x0000000000000000000000000000000000000b0b",
        numCompleteSets: "200000000000000",
        numPurchasedOrSold: "200000000000000",
        eventName: "CompleteSetsPurchased",
        blockNumber: 437,
        transactionHash: "0x00000000000000000000000000000000deadbeef",
        logIndex: 0,
        tradeGroupId: 12,
      },
      augur: {
        api: {
          Orders: {
            getLastOutcomePrice: (p, callback) => {
              assert.strictEqual(p._market, "0x0000000000000000000000000000000000000002");
              if (p._outcome === 0) {
                callback(null, "7000");
              } else {
                callback(null, "1250");
              }
            },
          },
        },
        utils: augur.utils,
        trading: {
          calculateProfitLoss: (p) => {
            assert.isObject(p);
            return {
              position: "2",
              realized: "0",
              unrealized: "0",
              meanOpenPrice: "0.75",
              queued: "0",
            };
          },
          getPositionInMarket: (p, callback) => {
            assert.strictEqual(p.market, "0x0000000000000000000000000000000000000002");
            assert.strictEqual(p.address, "0x0000000000000000000000000000000000000b0b");
            callback(null, ["2", "2", "2", "2", "2", "2", "2", "2"]);
          },
          normalizePrice: p => p.price,
        },
      },
    };

    setupTestDb((err, db) => {
      assert.ifError(err);
      db.transaction((trx) => {
        processCompleteSetsPurchasedOrSoldLog(trx, params.augur, params.log, (err) => {
          assert.ifError(err);
          getState(trx, params, (err, completeSetsRows) => {
            assert.ifError(err);
            assert.deepEqual(completeSetsRows, [{
              account: "0x0000000000000000000000000000000000000b0b",
              blockNumber: 437,
              logIndex: 0,
              eventName: "CompleteSetsPurchased",
              marketId: "0x0000000000000000000000000000000000000002",
              numCompleteSets: "2",
              numPurchasedOrSold: "2",
              tradeGroupId: 12,
              transactionHash: "0x00000000000000000000000000000000deadbeef",
              universe: "0x0000000000000000000000000000000000000001",
            }]);
            processCompleteSetsPurchasedOrSoldLogRemoval(trx, params.augur, params.log, (err) => {
              assert.ifError(err);
              getState(trx, params, (err, completeSetsRows) => {
                assert.ifError(err);
                assert.deepEqual(completeSetsRows, []);
                db.destroy();
                done();
              });
            });
          });
        });
      });
    });


  }).timeout(20000);
});
