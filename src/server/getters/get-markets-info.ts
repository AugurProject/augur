import { parallel } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { Address, MarketsRowWithCreationTime, OutcomesRow, UIMarketInfo, UIMarketsInfo, UIOutcomeInfo, AsyncCallback} from "../../types";
import { reshapeOutcomesRowToUIOutcomeInfo, reshapeMarketsRowToUIMarketInfo, getMarketsWithReportingState } from "./database";

interface MarketOutcomeResult {
  marketsRows: Array<MarketsRowWithCreationTime>;
  outcomesRows: Array<OutcomesRow>;
}

export function getMarketsInfo(db: Knex, marketIds: Array<Address>, callback: (err: Error|null, result?: UIMarketsInfo) => void): void {
  let marketsQuery: Knex.QueryBuilder = getMarketsWithReportingState(db);
  if (marketIds == null) return callback(new Error("must include marketIds parameter"));
  marketsQuery = marketsQuery.whereIn("markets.marketId", marketIds);

  parallel({
    marketsRows: (next: AsyncCallback) => marketsQuery.asCallback(next),
    outcomesRows: (next: AsyncCallback) => db("outcomes").whereIn("marketId", marketIds).asCallback(next),
  }, (err: Error|null, marketOutcomeResult: MarketOutcomeResult ): void => {
    const { marketsRows, outcomesRows } = marketOutcomeResult;
    if (err) return callback(err);
    if (!marketsRows) return callback(null);
    const marketsRowsByMarket = _.keyBy(marketsRows, (r: MarketsRowWithCreationTime): string => r.marketId);
    const outcomesRowsByMarket = _.groupBy(outcomesRows, (r: OutcomesRow): string => r.marketId);

    const marketsInfo: UIMarketsInfo = _.map(marketIds, (marketId: string): UIMarketInfo|null => {
      const market = marketsRowsByMarket[marketId];
      if ( !market ) {
        return null;
      }
      const outcomes = _.map(outcomesRowsByMarket[marketId], (outcomesRow: OutcomesRow): UIOutcomeInfo => reshapeOutcomesRowToUIOutcomeInfo(outcomesRow));
      return reshapeMarketsRowToUIMarketInfo(market, outcomes);
    });

    callback(null, marketsInfo);
  });
}
