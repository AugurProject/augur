import Knex from "knex";

import { BigNumber, ReportingState } from "../types";

interface MarketRow {
  category: string;
  openInterest: string;
}

// When augur-node is running, categories.openInterest/nonFinalizedOpenInterest
// is updated incrementally each time a single market.openInterest
// changes. This gives O(1) updates, instead of O(markets), to
// categories.openInterest/nonFinalizedOpenInterest, but creates a need to backfill
// each category's open interest before it may be then updated incrementally.
async function backfillCategoryOpenInterestFromMarkets(knex: Knex, marketRows: Array<MarketRow>, categoryColumnName: "openInterest" | "nonFinalizedOpenInterest"): Promise<void> {
  const oiByCategory: Map<string, BigNumber> = new Map();
  marketRows.forEach((r: MarketRow) => {
    const oi = oiByCategory.get(r.category);
    if (oi === undefined) {
      oiByCategory.set(r.category, new BigNumber(r.openInterest));
    } else {
      oiByCategory.set(r.category, oi.plus(new BigNumber(r.openInterest)));
    }
  });

  for (const [category, oi] of oiByCategory) {
    await knex("categories").where("category", "=", category).update({ [categoryColumnName]: oi.toString() });
  }
}

exports.up = async (knex: Knex): Promise<any> => {
  // 1. Add and backfill categories.openInterest
  const doesOpenInterestExist: boolean = await knex.schema.hasColumn("categories", "openInterest");
  if (!doesOpenInterestExist) {
    await knex.schema.table("categories", (t) => t.string("openInterest").defaultTo("0"));

    const marketRows: Array<MarketRow> = await knex.select(["category", "openInterest"]).from("markets");
    await backfillCategoryOpenInterestFromMarkets(knex, marketRows, "openInterest");
  }

  // 2. Add and backfill categories.nonFinalizedOpenInterest
  const doesNonFinalizedOpenInterestExist: boolean = await knex.schema.hasColumn("categories", "nonFinalizedOpenInterest");
  if (!doesNonFinalizedOpenInterestExist) {
    await knex.schema.table("categories", (t) => t.string("nonFinalizedOpenInterest").defaultTo("0"));

    const marketRows: Array<MarketRow> = await knex.select([
      "markets.category as category",
      "markets.openInterest as openInterest",
    ]).from("markets")
      .leftJoin("market_state", "markets.marketStateId", "market_state.marketStateId")
      .where("market_state.reportingState", "!=", ReportingState.FINALIZED);
    await backfillCategoryOpenInterestFromMarkets(knex, marketRows, "nonFinalizedOpenInterest");
  }
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.table("categories", (table: Knex.CreateTableBuilder): void => {
    table.dropColumns("nonFinalizedOpenInterest", "openInterest");
  });
};
