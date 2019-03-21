import * as Knex from "knex";
import { Address, Augur, FormattedEventLog, ReportingState } from "../../types";
import { rollbackMarketState, updateMarketDisputeWindow, updateMarketState } from "./database";
import { getMarketsWithReportingState } from "../../server/getters/database";
import { createCategoryIfNotExists } from "./market-created";

async function advanceToAwaitingNextWindow(db: Knex, marketId: Address, blockNumber: number) {
  const reportingStateRow: { reportingState: ReportingState, disputeWindow: Address } = await getMarketsWithReportingState(db, ["reportingState", "disputeWindow"]).first().where("markets.marketId", marketId);
  if (reportingStateRow == null) throw new Error("Could not fetch prior reportingState");
  if (reportingStateRow.reportingState === ReportingState.AWAITING_FORK_MIGRATION) {
    const initialReportMade = reportingStateRow.disputeWindow !== "0x0000000000000000000000000000000000000000";
    const reportingState = initialReportMade ? ReportingState.AWAITING_NEXT_WINDOW : ReportingState.OPEN_REPORTING;
    return updateMarketState(db, marketId, blockNumber, reportingState);
  }
}

export async function processMarketMigratedLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await advanceToAwaitingNextWindow(db, log.market, log.blockNumber);
    await updateMarketDisputeWindow(db, augur, log.newUniverse, log.market, true);
    await db.update({
      universe: log.newUniverse,
      needsMigration: db.raw("needsMigration - 1"),
      needsDisavowal: db.raw("needsDisavowal - 1"),
    }).into("markets").where("marketId", log.market);
    await db.update({
      disavowed: db.raw("disavowed + 1"),
    }).into("crowdsourcers").where("marketId", log.market);
    const categoryRows: { category: string } = await db.first("category").from("markets").where({ marketId: log.market });
    if (!categoryRows || categoryRows.category == null) return;
    await createCategoryIfNotExists(db, log.newUniverse, categoryRows.category); // NB `categoryName = categoryRows.category` is expected to already be canonicalized when the market was first ingested into augur-node, see canonicalizeCategoryName().
  };
}

export async function processMarketMigratedLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await rollbackMarketState(db, log.market, ReportingState.AWAITING_NEXT_WINDOW);
    await db.update({
      universe: log.originalUniverse,
      needsMigration: db.raw("needsMigration + 1"),
      needsDisavowal: db.raw("needsDisavowal + 1"),
    }).into("markets").where("marketId", log.market);
    return db.update({
      disavowed: db.raw("disavowed - 1"),
    }).into("crowdsourcers").where("marketId", log.market);
  };
}
