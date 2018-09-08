import * as Knex from "knex";
import * as _ from "lodash";
import { BigNumber } from "bignumber.js";
import { Address, OutcomesRow, UIMarketInfo, UIMarketsInfo, UIOutcomeInfo, PayoutRow, MarketsContractAddressRow } from "../../types";
import { reshapeOutcomesRowToUIOutcomeInfo, reshapeMarketsRowToUIMarketInfo, getMarketsWithReportingState, batchAndCombine } from "./database";

export function getMarketsInfo(db: Knex, marketIds: Array<Address>, callback: (err: Error|null, result?: UIMarketsInfo<string>) => void) {
  if (marketIds == null || ! _.isArray(marketIds) ) return callback(new Error("must include marketIds parameter"));
  batchAndCombine<UIMarketInfo<string>, string>(marketIds, _.partial(getUIMarketsInfo, db)).then((marketInfoComplete: Array<UIMarketInfo<string>>) => {
    const marketsInfoByMarket = _.keyBy(marketInfoComplete, (r): string => r.id);
    callback(null, _.map(marketIds, (marketId: string): UIMarketInfo<string>|null => {
      return marketsInfoByMarket[marketId] || null;
    }));
  }).catch(callback);
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
