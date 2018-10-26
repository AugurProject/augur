import Augur from "augur.js";
import * as Knex from "knex";
import { FormattedEventLog, CategoriesRow, CategoryRow, ReportingState, Address } from "../../types";
import { rollbackMarketState, updateMarketFeeWindow, updateMarketState } from "./database";
import { getMarketsWithReportingState } from "../../server/getters/database";

async function advanceToAwaitingNextWindow(db: Knex, marketId: Address, blockNumber: number) {
  const reportingStateRow: { reportingState: ReportingState, feeWindow: Address } = await getMarketsWithReportingState(db, ["reportingState", "feeWindow"]).first().where("markets.marketId", marketId);
  if (reportingStateRow == null) throw new Error("Could not fetch prior reportingState");
  if (reportingStateRow.reportingState === ReportingState.AWAITING_FORK_MIGRATION) {
    const initialReportMade = reportingStateRow.feeWindow !== "0x0000000000000000000000000000000000000000";
    const reportingState = initialReportMade ? ReportingState.AWAITING_NEXT_WINDOW : ReportingState.OPEN_REPORTING;
    return updateMarketState(db, marketId, blockNumber, reportingState);
  }
}

export async function processMarketMigratedLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await advanceToAwaitingNextWindow(db, log.market, log.blockNumber);
    await updateMarketFeeWindow(db, augur, log.newUniverse, log.market, true);
    await db.update({
      universe: log.newUniverse,
      needsMigration: db.raw("needsMigration - 1"),
      needsDisavowal: db.raw("needsDisavowal - 1"),
    }).into("markets").where("marketId", log.market);
    await db.update({
      disavowed: db.raw("disavowed + 1"),
    }).into("crowdsourcers").where("marketId", log.market);
    const categoryRows: CategoryRow = await db.first("category").from("markets").where({ marketId: log.market });
    if (!categoryRows || categoryRows.category == null) return;
    const category = categoryRows.category.toUpperCase();
    const categoriesRows: CategoriesRow = await db.first("popularity").from("categories").where({ category, universe: log.newUniverse });
    if (categoriesRows) return;
    return db.insert({ category, universe: log.newUniverse }).into("categories");
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
