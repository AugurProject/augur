"use strict";

const assert = require("chai").assert;
const setupTestDb = require("../../test.database");
const {processMarketMigratedLog, processMarketMigratedLogRemoval} = require("../../../build/blockchain/log-processors/market-migrated");

const getMarket = (db, params, callback) => {
  db.select(["markets.marketId", "markets.universe", "markets.needsMigration"]).from("markets").where({"markets.marketId": params.log.market}).asCallback(callback);
};

describe("blockchain/log-processors/market-migrated", () => {
  const test = (t) => {
    it(t.description, (done) => {
      setupTestDb((err, db) => {
        assert.isNull(err);
        db.transaction((trx) => {
          trx("markets").update("needsMigration", 1).where("marketId", t.params.log.market).asCallback((err) => {
            assert.isNull(err);
            processMarketMigratedLog(trx, t.params.augur, t.params.log, (err) => {
              assert.isNull(err);
              getMarket(trx, t.params, (err, marketRow) => {
                t.assertions.onAdded(err, marketRow);
                processMarketMigratedLogRemoval(trx, t.params.augur, t.params.log, (err) => {
                  assert.isNull(err);
                  getMarket(trx, t.params, (err, marketRow) => {
                    t.assertions.onRemoved(err, marketRow);
                    done();
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
    description: "binary market MarketMigrated log and removal",
    params: {
      log: {
        market: "0x0000000000000000000000000000000000000211",
        originalUniverse: "ORIGINAL_UNIVERSE",
        newUniverse: "NEW_UNIVERSE",
        blockNumber: 1400001,
        transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
        logIndex: 0,
      },
    },
    assertions: {
      onAdded: (err, marketRow) => {
        assert.isNull(err);
        assert.deepEqual(marketRow, [
          {
            "marketId": "0x0000000000000000000000000000000000000211",
            "universe": "NEW_UNIVERSE",
            "needsMigration": 0,
          },
        ]);
      },
      onRemoved: (err, marketRow) => {
        assert.isNull(err);
        assert.deepEqual(marketRow, [
          {
            "marketId": "0x0000000000000000000000000000000000000211",
            "universe": "ORIGINAL_UNIVERSE",
            "needsMigration": 1,
          },
        ]);
      },
    },
  });
});
