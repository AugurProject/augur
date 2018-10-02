import * as Knex from "knex";
import * as _ from "lodash";
import { BigNumber } from "bignumber.js";
import { Address, OutcomesRow, UIMarketInfo, UIMarketsInfo, UIOutcomeInfo, PayoutRow, MarketsContractAddressRow } from "../../types";
import { reshapeOutcomesRowToUIOutcomeInfo, reshapeMarketsRowToUIMarketInfo, getMarketsWithReportingState, batchAndCombine, checkOptionalOrderingParams, SORT_LIMIT_KEYS } from "./database";

export interface GetMarketsInfoParams  {
  marketIds: Array<Address>;
}
export function extractGetMarketsInfoParams(params: any): GetMarketsInfoParams|undefined {
  const pickedParams = _.pick(params, ["marketIds"]);
  if (isGetMarketsInfoParams(pickedParams)) return pickedParams;
  return undefined;
}

export function isGetMarketsInfoParams(params: any): params is GetMarketsInfoParams {
  if (!_.isObject(params)) return false;
  if (!_.isArray(params.marketIds)) return false;
  return !(params.marketIds.filter((value: any) => typeof value !== "string" && value != null).length > 0);
}

export async function getMarketsInfo(db: Knex, augur: {}, params: GetMarketsInfoParams): Promise<UIMarketsInfo<string>> {
  if (params.marketIds == null || ! _.isArray(params.marketIds) ) throw new Error("must include marketIds parameter");
  const marketInfoComplete: Array<UIMarketInfo<string>> = await batchAndCombine<UIMarketInfo<string>, string>(params.marketIds, _.partial(getUIMarketsInfo, db));
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
