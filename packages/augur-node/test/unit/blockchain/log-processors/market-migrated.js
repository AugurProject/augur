"use strict";

const setupTestDb = require("../../test.database");
const {processMarketMigratedLog, processMarketMigratedLogRemoval} = require("src/blockchain/log-processors/market-migrated");
const {getMarketsWithReportingState} = require("src/server/getters/database");
const ReportingState = require("src/types").ReportingState;
const updateMarketState = require("src/blockchain/log-processors/database").updateMarketState;

const getMarket = (db, params, callback) => {
  getMarketsWithReportingState(db, ["markets.marketId", "markets.universe", "markets.needsMigration", "markets.needsDisavowal", "feeWindow", "reportingState"])
    .from("markets").where({"markets.marketId": params.log.market}).asCallback(callback);
};

describe("blockchain/log-processors/market-migrated", () => {
  const runTest = (t) => {
    test(t.description, async (done) => {
const db = await setupTestDb();
      db.transaction((trx) => {
        trx("markets").update({
          needsMigration: 1,
          needsDisavowal: 1
        }).where("marketId", t.params.log.market).asCallback((err) => {
          expect(err).toBeFalsy();
          updateMarketState(trx, t.params.log.market, 999, ReportingState.AWAITING_FORK_MIGRATION, (err) => {
            expect(err).toBeFalsy();
            processMarketMigratedLog(trx, t.params.augur, t.params.log, (err) => {
              expect(err).toBeFalsy();
              getMarket(trx, t.params, (err, marketRow) => {
                t.assertions.onAdded(err, marketRow);
                processMarketMigratedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                  expect(err).toBeFalsy();
                  getMarket(trx, t.params, (err, marketRow) => {
                    t.assertions.onRemoved(err, marketRow);
                    db.destroy();
                    done();
                  });
                });
              });
            });
          });
        });
      });
    })
  };
  runTest({
    description: "yesNo market MarketMigrated log and removal",
    params: {
      log: {
        market: "0x0000000000000000000000000000000000000211",
        originalUniverse: "ORIGINAL_UNIVERSE",
        newUniverse: "NEW_UNIVERSE",
        blockNumber: 1400001,
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
        logIndex: 0,
      },
      augur: {
        constants: {
          CONTRACT_INTERVAL: {
            DISPUTE_ROUND_DURATION_SECONDS: 999,
          },
        },
        api: {
          Universe: {
            getFeeWindowByTimestamp: (args, callback) => {
              return callback(null, "0x0000000000000000000000000000000000FEE000");
            },
          },
        },
      },
    },
    assertions: {
      onAdded: (err, marketRow) => {
        expect(err).toBeFalsy();
        expect(marketRow).toEqual([
          {
            "marketId": "0x0000000000000000000000000000000000000211",
            "universe": "NEW_UNIVERSE",
            "needsMigration": 0,
            "needsDisavowal": 0,
            "feeWindow": "0x0000000000000000000000000000000000FEE000",
            "reportingState": ReportingState.AWAITING_NEXT_WINDOW,
          },
        ]);
      },
      onRemoved: (err, marketRow) => {
        expect(err).toBeFalsy();
        expect(marketRow).toEqual([
          {
            "marketId": "0x0000000000000000000000000000000000000211",
            "universe": "ORIGINAL_UNIVERSE",
            "needsMigration": 1,
            "needsDisavowal": 1,
            "feeWindow": "0x0000000000000000000000000000000000FEE000",
            "reportingState": ReportingState.AWAITING_FORK_MIGRATION,
          },
        ]);
      },
    },
  });
});
