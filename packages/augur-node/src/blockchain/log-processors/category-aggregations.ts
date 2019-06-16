import Knex from "knex";
import { BigNumber, ReportingState } from "../../types";

interface MarketOpenInterestChangedParams {
  db: Knex;
  categoryName: string;
  newOpenInterest: BigNumber;
  oldOpenInterest: BigNumber;
  reportingState: ReportingState;
}

interface MarketFinalizedParams {
  db: Knex;
  marketId: string;
}

export async function updateCategoryAggregationsOnMarketOpenInterestChanged(params: MarketOpenInterestChangedParams): Promise<void> {
  const row: {
    openInterest: BigNumber,
    nonFinalizedOpenInterest: BigNumber,
  } | undefined = await params.db.first(["openInterest", "nonFinalizedOpenInterest"])
    .from("categories")
    .where({ category: params.categoryName });
  if (row === undefined) throw new Error(`No category found with name ${params.categoryName}`);

  const oiDelta: BigNumber = params.newOpenInterest.minus(params.oldOpenInterest);

  const updates: any = {
    // 1. update category.openInterest to reflect change in market's OI
    openInterest: row.openInterest.plus(oiDelta).toString(),
  };

  if (params.reportingState !== ReportingState.FINALIZED) {
    // 2. update category.nonFinalizedOpenInterest to reflect change in non-finalized market's OI
    updates.nonFinalizedOpenInterest = row.nonFinalizedOpenInterest.plus(oiDelta).toString();
  }

  await params.db("categories").update(updates).where({ category: params.categoryName });
}

// precondition: market reportingState == FINALIZED in the db
export async function updateCategoryAggregationsOnMarketFinalized(params: MarketFinalizedParams): Promise<void> {
  // 1. update category.nonFinalizedOpenInterest because a finalized market is newly excluded from nonFinalizedOpenInterest
  const data = await marketFinalizedHelper(params.db, params.marketId);
  await params.db("categories").update({
    nonFinalizedOpenInterest: data.categoryNonFinalizedOpenInterest.minus(data.marketOpenInterest).toString(),
  }).where({ category: data.categoryName });
}

// precondition: market reportingState != FINALIZED in the db
export async function updateCategoryAggregationsOnMarketFinalizedRollback(params: MarketFinalizedParams): Promise<void> {
  // 1. update category.nonFinalizedOpenInterest because an un-finalized market is newly included in nonFinalizedOpenInterest
  const data = await marketFinalizedHelper(params.db, params.marketId);
  await params.db("categories").update({
    nonFinalizedOpenInterest: data.categoryNonFinalizedOpenInterest.plus(data.marketOpenInterest).toString(),
  }).where({ category: data.categoryName });
}

async function marketFinalizedHelper(db: Knex, marketId: string): Promise<{
  categoryName: string,
  categoryNonFinalizedOpenInterest: BigNumber,
  marketOpenInterest: BigNumber,
}> {
  const mRow: {
    category: string,
    openInterest: BigNumber,
  } | undefined = await db.first([
    "category",
    "openInterest",
  ]).from("markets")
    .where({ marketId });
  if (mRow === undefined) throw new Error(`No market with marketId ${marketId}`);

  const cRow: {
    nonFinalizedOpenInterest: BigNumber,
  } | undefined = await db.first(["nonFinalizedOpenInterest"])
    .from("categories")
    .where({ category: mRow.category });
  if (cRow === undefined) throw new Error(`No category found with name ${mRow.category}`);

  return {
    categoryName: mRow.category,
    categoryNonFinalizedOpenInterest: cRow.nonFinalizedOpenInterest,
    marketOpenInterest: mRow.openInterest,
  };
}
