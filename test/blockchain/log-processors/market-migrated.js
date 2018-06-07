"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const {processMarketMigratedLog, processMarketMigratedLogRemoval} = require("../../../build/blockchain/log-processors/market-migrated");
const {getMarketsWithReportingState} = require("../../../build/server/getters/database");
const ReportingState = require("../../../build/types").ReportingState;

const getMarket = (db, params, callback) => {
  getMarketsWithReportingState(db, ["markets.marketId", "markets.universe", "markets.needsMigration", "markets.needsDisavowal", "feeWindow", "reportingState"])
    .from("markets").where({"markets.marketId": params.log.market}).asCallback(callback);
};

describe("blockchain/log-processors/market-migrated", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.ifError(err);
        db.transaction((trx) => {
          trx("markets").update("needsMigration", 1).where("marketId", t.params.log.market).asCallback((err) => {
            assert.ifError(err);
            trx("markets").update("needsDisavowal", 1).where("marketId", t.params.log.market).asCallback((err) => {
              assert.ifError(err);
              processMarketMigratedLog(trx, t.params.augur, t.params.log, (err) => {
                assert.ifError(err);
                getMarket(trx, t.params, (err, marketRow) => {
                  t.assertions.onAdded(err, marketRow);
                  processMarketMigratedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                    // assert.ifError(err);
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
      });
    });
  };
  test({
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
        assert.ifError(err);
        assert.deepEqual(marketRow, [
          {
            "marketId": "0x0000000000000000000000000000000000000211",
            "universe": "NEW_UNIVERSE",
            "needsMigration": 0,
            "needsDisavowal": 0,
            "feeWindow": "0x0000000000000000000000000000000000FEE000",
            "reportingState": ReportingState.CROWDSOURCING_DISPUTE,
          },
        ]);
      },
      onRemoved: (err, marketRow) => {
        assert.ifError(err);
        assert.deepEqual(marketRow, [
          {
            "marketId": "0x0000000000000000000000000000000000000211",
            "universe": "ORIGINAL_UNIVERSE",
            "needsMigration": 1,
            "needsDisavowal": 1,
            "feeWindow": "0x0000000000000000000000000000000000FEE000",
            "reportingState": ReportingState.CROWDSOURCING_DISPUTE,
          },
        ]);
      },
    },
  });
});
