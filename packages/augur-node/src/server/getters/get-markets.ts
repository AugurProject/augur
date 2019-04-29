import * as t from "io-ts";
import Knex from "knex";
import { Address, MarketsContractAddressRow, SortLimitParams } from "../../types";
import { getMarketsWithReportingState, queryModifier } from "./database";
import { createSearchProvider } from "../../database/fts";

export const GetMarketsParamsSpecific = t.type({
  universe: t.string,
  creator: t.union([t.string, t.null, t.undefined]),
  category: t.union([t.string, t.null, t.undefined]),
  search: t.union([t.string, t.null, t.undefined]),
  reportingState: t.union([t.string, t.null, t.undefined]),
  disputeWindow: t.union([t.string, t.null, t.undefined]),
  designatedReporter: t.union([t.string, t.null, t.undefined]),
  maxFee: t.union([t.number, t.null, t.undefined]),
  hasOrders: t.union([t.boolean, t.null, t.undefined]),
});

export const GetMarketsParams = t.intersection([
  GetMarketsParamsSpecific,
  SortLimitParams,
]);

// Returning marketIds should likely be more generalized, since it is a single line change for most getters (awaiting reporting, by user, etc)
export async function getMarkets(db: Knex, augur: {}, params: t.TypeOf<typeof GetMarketsParams>) {
  const columns = ["markets.marketId", "marketStateBlock.timestamp as reportingStateUpdatedOn"];
  const query = getMarketsWithReportingState(db, columns);
  query.join("blocks as marketStateBlock", "marketStateBlock.blockNumber", "market_state.blockNumber");
  query.leftJoin("blocks as lastTradeBlock", "lastTradeBlock.blockNumber", "markets.lastTradeBlockNumber").select("lastTradeBlock.timestamp as lastTradeTime");

  if (params.universe != null) query.where("universe", params.universe);
  if (params.creator != null) query.where({ marketCreator: params.creator });
  if (params.category != null) query.whereRaw("LOWER(markets.category) = ?", [params.category.toLowerCase()]);
  if (params.reportingState != null) query.where("reportingState", params.reportingState);
  if (params.disputeWindow != null) query.where("disputeWindow", params.disputeWindow);
  if (params.designatedReporter != null) query.where("designatedReporter", params.designatedReporter);
  if (params.hasOrders != null && params.hasOrders) {
    const ordersQuery = db("orders").select("orders.marketId").where("orderstate", "OPEN");
    query.whereIn("markets.marketId", ordersQuery);
  }

  const searchProvider = createSearchProvider(db);
  if (params.search != null && searchProvider !== null) {
    query.whereIn("markets.marketId", function (this: Knex.QueryBuilder) {
      searchProvider.searchBuilder(this, params.search!);
    });
  }

  if (params.maxFee) {
    query.whereRaw("(CAST(markets.reportingFeeRate as numeric) + CAST(markets.marketCreatorFeeRate as numeric)) < ?", [params.maxFee]);
  }

  const marketsRows = await queryModifier<MarketsContractAddressRow>(db, query, "volume", "desc", params);

  return marketsRows.map((marketsRow: MarketsContractAddressRow): Address => marketsRow.marketId);
}
