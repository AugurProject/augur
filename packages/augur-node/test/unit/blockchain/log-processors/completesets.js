"use strict";

const setupTestDb = require("../../test.database");
const { processCompleteSetsPurchasedOrSoldLog, processCompleteSetsPurchasedOrSoldLogRemoval } = require("src/blockchain/log-processors/completesets");
const Augur = require("augur.js");
const augur = new Augur();

describe("blockchain/log-processors/completesets", () => {
  const getState = (db, params, callback) => db("completeSets").where({
    account: params.log.account,
    marketId: params.log.market,
  }).asCallback(callback);

  test("CompleteSetsPurchased log and removal", async (done) => {
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
              expect(p._market).toBe("0x0000000000000000000000000000000000000002");
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
            expect(typeof p).toBe("object");
            return {
              position: "2",
              realized: "0",
              unrealized: "0",
              meanOpenPrice: "0.75",
              queued: "0",
            };
          },
          getPositionInMarket: (p, callback) => {
            expect(p.market).toBe("0x0000000000000000000000000000000000000002");
            expect(p.address).toBe("0x0000000000000000000000000000000000000b0b");
            callback(null, ["2", "2", "2", "2", "2", "2", "2", "2"]);
          },
          normalizePrice: p => p.price,
        },
      },
    };

    const db = await setupTestDb();
    db.transaction((trx) => {
      processCompleteSetsPurchasedOrSoldLog(trx, params.augur, params.log, (err) => {
        expect(err).toBeFalsy();
        getState(trx, params, (err, completeSetsRows) => {
          expect(err).toBeFalsy();
          expect(completeSetsRows).toEqual([{
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
            expect(err).toBeFalsy();
            getState(trx, params, (err, completeSetsRows) => {
              expect(err).toBeFalsy();
              expect(completeSetsRows).toEqual([]);
              db.destroy();
              done();
            });
          });
        });
      });
    });
  });
});
