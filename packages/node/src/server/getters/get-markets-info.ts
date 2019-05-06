import * as t from "io-ts";
import Knex from "knex";
import * as _ from "lodash";
import {
  Address,
  BigNumber,
  MarketsContractAddressRow,
  OutcomesRow,
  PayoutRow,
  UIMarketInfo,
  UIMarketsInfo,
  UIOutcomeInfo
} from "../../types";
import {
  batchAndCombine,
  getMarketsWithReportingState,
  reshapeMarketsRowToUIMarketInfo,
  reshapeOutcomesRowToUIOutcomeInfo
} from "./database";

export const MarketsInfoParams = t.type({
  marketIds: t.array(t.union([t.string, t.null, t.undefined])),
});

export async function getMarketsInfo(db: Knex, augur: {}, params: t.TypeOf<typeof MarketsInfoParams>): Promise<UIMarketsInfo<string>> {
  if (params.marketIds == null || ! _.isArray(params.marketIds) ) throw new Error("must include marketIds parameter");
  const marketInfoComplete: Array<UIMarketInfo<string>> = await batchAndCombine(params.marketIds, _.partial(getUIMarketsInfo, db));
  const marketsInfoByMarket = _.keyBy(marketInfoComplete, (r): string => r.id);
  return _.map(params.marketIds, (marketId: string): UIMarketInfo<string>|null => {
    return marketsInfoByMarket[marketId] || null;
  });
}

export async function getUIMarketsInfo(db: Knex, marketIds: Array<Address>): Promise<Array<UIMarketInfo<string>>> {
  const marketsQuery: Knex.QueryBuilder = getMarketsWithReportingState(db);
  const cleanedMarketIds = _.compact(marketIds);
  marketsQuery.whereIn("markets.marketId", cleanedMarketIds);
  marketsQuery.leftJoin("blocks as finalizationBlockNumber", "finalizationBlockNumber.blockNumber", "markets.finalizationBlockNumber").select("finalizationBlockNumber.timestamp as finalizationTime");
  marketsQuery.leftJoin("blocks as lastTradeBlock", "lastTradeBlock.blockNumber", "markets.lastTradeBlockNumber").select("lastTradeBlock.timestamp as lastTradeTime");
  const marketsRows = await marketsQuery;
  const outcomesRows = await db("outcomes").whereIn("marketId", cleanedMarketIds);
  const winningPayoutRows = await db("payouts").whereIn("marketId", cleanedMarketIds).where("winning", 1);
  if (!marketsRows) return [];
  const outcomesRowsByMarket = _.groupBy(outcomesRows, (r: OutcomesRow<BigNumber>): string => r.marketId);
  const winningPayoutByMarket = _.keyBy(winningPayoutRows, (r: PayoutRow<BigNumber> & MarketsContractAddressRow): string => r.marketId);
  const marketsInfo: Array<UIMarketInfo<string>> = _.map(marketsRows, (market): UIMarketInfo<string> => {
    const outcomes = _.map(outcomesRowsByMarket[market.marketId], (outcomesRow: OutcomesRow<BigNumber>): UIOutcomeInfo<BigNumber> => reshapeOutcomesRowToUIOutcomeInfo(outcomesRow));
    return reshapeMarketsRowToUIMarketInfo(market, outcomes, winningPayoutByMarket[market.marketId]);
  });
  return marketsInfo;
}
