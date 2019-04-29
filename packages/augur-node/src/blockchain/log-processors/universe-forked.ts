import { Address, Augur, FormattedEventLog, MarketsContractAddressRow, ReportingState } from "../../types";
import Knex from "knex";
import { updateMarketState } from "./database";
import { augurEmitter } from "../../events";
import { getMarketsWithReportingState } from "../../server/getters/database";
import { each } from "bluebird";
import { SubscriptionEventNames } from "../../constants";

// set all crowdsourcers completed to 0, and markets.disputeRounds = null if no initial report, 0 if there is
async function uncompleteNonforkingCrowdsourcers(db: Knex, universe: Address, forkingMarket: Address) {
  await db("crowdsourcers").update("completed", 0)
    .whereIn("marketId", (queryBuilder) => queryBuilder.from("markets").select("marketId").where({ universe }).whereNot("marketId", forkingMarket));
  await db("markets").update({ disputeRounds: null }).where({ universe }).whereNot("marketId", forkingMarket);
  await db("markets").update({ disputeRounds: 0 }).where({ universe }).whereNot("marketId", forkingMarket)
    .whereIn("marketId", (queryBuilder) => queryBuilder.from("initial_reports").select("marketId"));
}

export async function processUniverseForkedLog(augur: Augur, log: FormattedEventLog) {
  const forkingMarket: Address|undefined = await augur.contracts.universe.getForkingMarket_();
  return async (db: Knex) => {
    if (forkingMarket == null) throw new Error(`Could not retrieve forking market for universe ${log.universe}`);
    await db("markets").update("forking", 1).where("marketId", forkingMarket);
    await updateMarketState(db, forkingMarket, log.blockNumber, ReportingState.FORKING);
    augurEmitter.emit(SubscriptionEventNames.MarketState, {
      universe: log.universe,
      marketId: forkingMarket,
      reportingState: ReportingState.FORKING,
    });
    await db("markets").increment("needsDisavowal", 1).where({ universe: log.universe }).whereNot("marketId", forkingMarket);
    await db("universes").update("forked", true).where({ universe: log.universe });
    const marketsToRevert: Array<MarketsContractAddressRow> = await getMarketsWithReportingState(db).from("markets").select("markets.marketId")
      .where({ universe: log.universe })
      .whereIn("reportingState", [ReportingState.AWAITING_FINALIZATION, ReportingState.CROWDSOURCING_DISPUTE, ReportingState.AWAITING_NEXT_WINDOW]);
    await each(marketsToRevert, async (marketIdRow: MarketsContractAddressRow) => {
      await updateMarketState(db, marketIdRow.marketId, log.blockNumber, ReportingState.AWAITING_FORK_MIGRATION);
      augurEmitter.emit(SubscriptionEventNames.MarketState, {
        universe: log.universe,
        marketId: marketIdRow.marketId,
        reportingState: ReportingState.AWAITING_FORK_MIGRATION,
      });
      await db("payouts").where({ marketId: marketIdRow.marketId }).update({ winning: db.raw("null"), tentativeWinning: 0 });
      return db("payouts").update("tentativeWinning", 1)
        .join("initial_reports", "payouts.payoutId", "initial_reports.payoutId")
        .where({ marketId: marketIdRow.marketId });
    });
    return uncompleteNonforkingCrowdsourcers(db, log.universe, forkingMarket);
  };
}

export async function processUniverseForkedLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    const forkingMarket: { marketId: Address } = await db("markets").select("marketId").where({ forking: 1, universe: log.universe }).first();
    if (forkingMarket == null) throw new Error(`Could not retrieve forking market to rollback for universe ${log.universe}`);
    await db("markets").update("forking", 0).where("marketId", forkingMarket.marketId);
    augurEmitter.emit(SubscriptionEventNames.MarketState, {
      universe: log.universe,
      marketId: forkingMarket,
      reportingState: ReportingState.CROWDSOURCING_DISPUTE,
    });
    await db("markets").decrement("needsDisavowal", 1).where({ universe: log.universe }).whereNot("marketId", forkingMarket.marketId);
    await db("universes").update("forked", false).where({ universe: log.universe });
  };
}
