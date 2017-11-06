import { parallel } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { Address, MarketsRowWithCreationTime, OutcomesRow, UIMarketInfo, UIMarketsInfo, UIOutcomeInfo, ErrorCallback, AsyncCallback} from "../../types";
import { reshapeOutcomesRowToUIOutcomeInfo, reshapeMarketsRowToUIMarketInfo, getMarketsWithReportingState } from "./database";

interface MarketOutcomeResult {
  marketsRows: Array<MarketsRowWithCreationTime>;
  outcomesRows: Array<OutcomesRow>;
}

export function getMarketsInfo(db: Knex, marketIDs: Array<Address>|null|undefined, callback: (err: Error|null, result?: UIMarketsInfo) => void): void {
  let marketsQuery: Knex.QueryBuilder = getMarketsWithReportingState(db);
  if (marketIDs == null || !marketIDs.length) return callback(new Error("must include marketIDs parameter"));
  marketsQuery = marketsQuery.whereIn("markets.marketID", marketIDs);

  parallel({
    marketsRows: (next: AsyncCallback) => marketsQuery.asCallback(next),
    outcomesRows: (next: AsyncCallback) => db("outcomes").whereIn("marketID", marketIDs).asCallback(next),
  }, (err: Error|null, marketOutcomeResult: MarketOutcomeResult ): void => {
    const { marketsRows, outcomesRows } = marketOutcomeResult;
    if (err) return callback(err);
    if (!marketsRows) return callback(null);
    const marketsRowsByMarket = _.keyBy(marketsRows, (r: MarketsRowWithCreationTime): string => r.marketID);
    const outcomesRowsByMarket = _.groupBy(outcomesRows, (r: OutcomesRow): string => r.marketID);

    const marketsInfo: UIMarketsInfo = _.map(marketIDs, (marketID: string): UIMarketInfo|null => {
      const market = marketsRowsByMarket[marketID];
      if ( !market ) {
        return null;
      }
      const outcomes = _.map(outcomesRowsByMarket[marketID], (outcomesRow: OutcomesRow): UIOutcomeInfo => reshapeOutcomesRowToUIOutcomeInfo(outcomesRow));
      return reshapeMarketsRowToUIMarketInfo(market, outcomes);
    });

    callback(null, marketsInfo);
  });
}
