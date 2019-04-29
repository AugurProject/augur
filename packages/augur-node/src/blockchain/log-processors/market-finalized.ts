import { Address, Augur, FormattedEventLog, ReportingState } from "../../types";
import Knex from "knex";
import { refreshMarketMailboxEthBalance, rollbackMarketState, updateMarketState } from "./database";
import {
  updateCategoryAggregationsOnMarketFinalized,
  updateCategoryAggregationsOnMarketFinalizedRollback
} from "./category-aggregations";
import { removeOutcomeValue, updateOutcomeValuesFromFinalization } from "./profit-loss/update-outcome-value";

async function flagMarketsNeedingMigration(db: Knex, finalizedMarketId: Address, universe: Address) {
  const isForkingMarket: { forking: number } = await db("markets").first("forking").where("marketId", finalizedMarketId);
  if (isForkingMarket.forking !== 1) return;
  return db("markets").increment("needsMigration", 1).where({ universe }).whereNot("marketId", finalizedMarketId);
}

export async function processMarketFinalizedLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await updateMarketState(db, log.market, log.blockNumber, ReportingState.FINALIZED);
    await db("markets").where({ marketId: log.market }).update({ finalizationBlockNumber: log.blockNumber });
    await flagMarketsNeedingMigration(db, log.market, log.universe);
    await refreshMarketMailboxEthBalance(db, augur, log.market);
    await updateOutcomeValuesFromFinalization(db, augur, log.market, log.transactionHash);
    await updateCategoryAggregationsOnMarketFinalized({ db, marketId: log.market });
  };
}

export async function processMarketFinalizedLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await rollbackMarketState(db, log.market, ReportingState.FINALIZED);
    await db("markets").where({ marketId: log.market }).update({ finalizationBlockNumber: null });
    await db("markets").where({ universe: log.universe }).update({ needsMigration: 0 });
    await refreshMarketMailboxEthBalance(db, augur, log.market);
    await removeOutcomeValue(db, log.transactionHash);
    await updateCategoryAggregationsOnMarketFinalizedRollback({ db, marketId: log.market });
  };
}
