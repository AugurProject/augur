import { mapLimit, series } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { BigNumber } from "bignumber.js";
import { Address, MarketsRowWithTime, OutcomesRow, UIMarketInfo, UIMarketsInfo, UIOutcomeInfo, AsyncCallback, PayoutRow, MarketsContractAddressRow } from "../../types";
import { reshapeOutcomesRowToUIOutcomeInfo, reshapeMarketsRowToUIMarketInfo, getMarketsWithReportingState } from "./database";

interface MarketOutcomeResult {
  marketsRows: Array<MarketsRowWithTime>;
  outcomesRows: Array<OutcomesRow<BigNumber>>;
  winningPayoutRows: Array<PayoutRow<BigNumber> & MarketsContractAddressRow>;
}

// move to database utils.
async function batchAndCombine<T, K>(lookupIds: Array<K>, dataFetch: (chunkLookupIds: Array<K>) => Promise<Array<T>>) {
  const chunkedIds = _.chunk(lookupIds, 2);
  const result: Array<Array<T>> = [];

    for (const chunkId in chunkedIds) {
    result.push(await dataFetch(chunkedIds[chunkId]));
  }
  const fullResults = _.flatten(result);
  // sort results
  // limit results
  return fullResults;
}

export function getMarketsInfo(db: Knex, marketIds: Array<Address>, callback: (err: Error|null, result?: UIMarketsInfo<string>) => void) {
  if (marketIds == null || ! _.isArray(marketIds) ) return callback(new Error("must include marketIds parameter"));
  batchAndCombine(marketIds, _.partial(getMarketsInfoReal, db)).then((res) => {
    callback(null, res);
  }).catch(callback);
}

export async function getMarketsInfoReal(db: Knex, marketIds: Array<Address>): Promise<UIMarketsInfo<string>> {
  const marketsQuery: Knex.QueryBuilder = getMarketsWithReportingState(db);
  const cleanedMarketIds = _.compact(marketIds);
  marketsQuery.whereIn("markets.marketId", cleanedMarketIds);
  marketsQuery.leftJoin("blocks as finalizationBlockNumber", "finalizationBlockNumber.blockNumber", "markets.finalizationBlockNumber").select("finalizationBlockNumber.timestamp as finalizationTime");
  marketsQuery.leftJoin("blocks as lastTradeBlock", "lastTradeBlock.blockNumber", "markets.lastTradeBlockNumber").select("lastTradeBlock.timestamp as lastTradeTime");


  const marketsRows = await marketsQuery;
  const outcomesRows = await db("outcomes").whereIn("marketId", cleanedMarketIds);
  const winningPayoutRows = await db("payouts").whereIn("marketId", cleanedMarketIds).where("winning", 1);

  if (!marketsRows) return [];
  const marketsRowsByMarket = _.keyBy(marketsRows, (r: MarketsRowWithTime): string => r.marketId);
  const outcomesRowsByMarket = _.groupBy(outcomesRows, (r: OutcomesRow<BigNumber>): string => r.marketId);
  const winningPayoutByMarket = _.keyBy(winningPayoutRows, (r: PayoutRow<BigNumber> & MarketsContractAddressRow): string => r.marketId);
  const marketsInfo: UIMarketsInfo<string> = _.map(marketIds, (marketId: string): UIMarketInfo<string>|null => {
    const market = marketsRowsByMarket[marketId];
    if ( !market ) {
      return null;
    }
    const outcomes = _.map(outcomesRowsByMarket[marketId], (outcomesRow: OutcomesRow<BigNumber>): UIOutcomeInfo<BigNumber> => reshapeOutcomesRowToUIOutcomeInfo(outcomesRow));
    return reshapeMarketsRowToUIMarketInfo(market, outcomes, winningPayoutByMarket[marketId]);
  });

  return marketsInfo || [];

}
