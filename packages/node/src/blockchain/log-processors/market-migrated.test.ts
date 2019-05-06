import { setupTestDb } from 'test/unit/test.database';
import { processMarketMigratedLog, processMarketMigratedLogRemoval } from './market-migrated';
import { getMarketsWithReportingState } from 'src/server/getters/database';
import { ReportingState } from 'src/types';
import { updateMarketState } from './database';

function getMarket(db, log) {
  return getMarketsWithReportingState(db, ["markets.marketId", "markets.universe", "markets.needsMigration", "markets.needsDisavowal", "disputeWindow", "reportingState"])
    .from("markets").where({ "markets.marketId": log.market });
}

const augur = {
  constants: {
    CONTRACT_INTERVAL: {
      DISPUTE_ROUND_DURATION_SECONDS: 999,
    },
  },
  api: {
    Universe: {
      getDisputeWindowByTimestamp: () =>
        Promise.resolve("0x0000000000000000000000000000000000FEE000"),
    },
  },
};

describe("blockchain/log-processors/market-migrated", () => {
  let db;
  beforeEach(async () => {
    db = await setupTestDb();
  });

  const log = {
    market: "0x0000000000000000000000000000000000000211",
    originalUniverse: "ORIGINAL_UNIVERSE",
    newUniverse: "NEW_UNIVERSE",
    blockNumber: 1400001,
    transactionHash: "0x0000000000000000000000000000000000000000000000000000000000000A00",
    logIndex: 0,
  };

  test("yesNo market MarketMigrated log and removal", async () => {
    return db.transaction(async (trx) => {
      await trx("markets").update({
        needsMigration: 1,
        needsDisavowal: 1,
      }).where("marketId", log.market);
      await updateMarketState(trx, log.market, 999, ReportingState.AWAITING_FORK_MIGRATION);

      await(await processMarketMigratedLog(augur, log))(trx);
      await expect(getMarket(trx, log)).resolves.toEqual([
        {
          "marketId": "0x0000000000000000000000000000000000000211",
          "universe": "NEW_UNIVERSE",
          "needsMigration": 0,
          "needsDisavowal": 0,
          "disputeWindow": "0x0000000000000000000000000000000000FEE000",
          "reportingState": ReportingState.AWAITING_NEXT_WINDOW,
        },
      ]);

      await(await processMarketMigratedLogRemoval(augur, log))(trx);
      await expect(getMarket(trx, log)).resolves.toEqual([
        {
          "marketId": "0x0000000000000000000000000000000000000211",
          "universe": "ORIGINAL_UNIVERSE",
          "needsMigration": 1,
          "needsDisavowal": 1,
          "disputeWindow": "0x0000000000000000000000000000000000FEE000",
          "reportingState": ReportingState.AWAITING_FORK_MIGRATION,
        },
      ]);
    });
  });

  afterEach(async () => {
    await db.destroy();
  });
});
