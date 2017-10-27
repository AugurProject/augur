import { each } from "async";
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { Address, MarketsRowWithCreationTime, OutcomesRow, UIMarketInfo, UIMarketsInfo, UIOutcomeInfo, ErrorCallback } from "../../types";
import { reshapeOutcomesRowToUIOutcomeInfo, reshapeMarketsRowToUIMarketInfo, getMarketsWithReportingState } from "./get-market-info";
import { sortDirection } from "../../utils/sort-direction";

export function getMarketsInfo(db: Knex, universe: Address|null|undefined, marketIDs: Array<Address>|null|undefined, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: UIMarketsInfo) => void): void {
  let marketsQuery: Knex.QueryBuilder = getMarketsWithReportingState(db).orderBy("creationTime");
  if (universe == null && marketIDs == null) {
    return callback(new Error("must include universe or marketIDs parameters"));
  }
  if (universe != null) {
    marketsQuery = marketsQuery.where({ universe });
  }
  if (marketIDs != null) {
    marketsQuery = marketsQuery.whereIn("markets.marketID", marketIDs);
  }
  marketsQuery = marketsQuery.orderBy(sortBy || "markets.volume", sortDirection(isSortDescending, "desc"));
  if (limit != null) marketsQuery = marketsQuery.limit(limit);
  if (offset != null) marketsQuery = marketsQuery.offset(offset);
  marketsQuery.asCallback((err: Error|null, marketsRows?: Array<MarketsRowWithCreationTime>): void => {
    if (err) return callback(err);
    if (!marketsRows || !marketsRows.length) return callback(null);
    const marketsInfo: UIMarketsInfo = [];
    each(marketsRows, (marketsRow: MarketsRowWithCreationTime, nextMarketsRow: ErrorCallback): void => {
      db("outcomes").where("marketID", marketsRow.marketID).asCallback((err: Error|null, outcomesRows?: Array<OutcomesRow>): void => {
        if (err) return nextMarketsRow(err);
        const outcomesInfo: Array<UIOutcomeInfo> = outcomesRows!.map((outcomesRow: OutcomesRow): UIOutcomeInfo => reshapeOutcomesRowToUIOutcomeInfo(outcomesRow));
        marketsInfo.push(reshapeMarketsRowToUIMarketInfo(marketsRow, outcomesInfo));
        nextMarketsRow();
      });
    }, (err: Error|null): void => {
      if (err) return callback(err);
      callback(null, marketsInfo);
    });
  });
}
