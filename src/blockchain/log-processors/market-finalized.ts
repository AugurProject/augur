import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, Address} from "../../types";
import { refreshMarketMailboxEthBalance, rollbackMarketState, updateMarketState } from "./database";
import { series } from "async";
import { updateOutcomeValuesFromFinalization, removeOutcomeValue } from "./profit-loss/update-outcome-value";

async function flagMarketsNeedingMigration(db: Knex, finalizedMarketId: Address, universe: Address) {
  const isForkingMarket: { forking: number } = await db("markets").first("forking").where("marketId", finalizedMarketId);
  if (isForkingMarket.forking !== 1) return;
  return db("markets").increment("needsMigration", 1).where({ universe }).whereNot("marketId", finalizedMarketId);
}

export async function processMarketFinalizedLog(db: Knex, augur: Augur, log: FormattedEventLog) {
  await updateMarketState(db, log.market, log.blockNumber, augur.constants.REPORTING_STATE.FINALIZED);
  await db("markets").where({ marketId: log.market }).update({ finalizationBlockNumber: log.blockNumber });
  await flagMarketsNeedingMigration(db, log.market, log.universe);
  await refreshMarketMailboxEthBalance(db, augur, log.market);
  await updateOutcomeValuesFromFinalization(db, augur, log.market, log.transactionHash);
}

export async function processMarketFinalizedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog) {

  await rollbackMarketState(db, log.market, augur.constants.REPORTING_STATE.FINALIZED);
  await db("markets").where({ marketId: log.market }).update({ finalizationBlockNumber: null });
  await db("markets").where({ universe: log.universe }).update({ needsMigration: 0 });
  await refreshMarketMailboxEthBalance(db, augur, log.market);
  await removeOutcomeValue(db, log.transactionHash);
}
