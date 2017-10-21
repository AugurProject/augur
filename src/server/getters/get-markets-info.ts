import { each } from "async";
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { Address, MarketsRow, OutcomesRow, UIMarketInfo, UIMarketsInfo, UIOutcomeInfo, ErrorCallback } from "../../types";
import { reshapeOutcomesRowToUIOutcomeInfo, reshapeMarketsRowToUIMarketInfo } from "./get-market-info";

export function getMarketsInfo(db: Knex, universe: Address|null|undefined, marketIDs: Array<Address>|null|undefined, callback: (err: Error|null, result?: UIMarketsInfo) => void): void {
  let marketsQuery: Knex.QueryBuilder = db.select().from("markets").orderBy("creationTime");
  if (universe == null && marketIDs == null) {
    return callback(new Error("must include universe or marketIDs parameters"));
  }
  if (universe != null) {
    marketsQuery = marketsQuery.where({ universe });
  }
  if (marketIDs != null) {
    marketsQuery = marketsQuery.whereIn("marketID", marketIDs);
  }
  marketsQuery.asCallback((err: Error|null, marketsRows?: Array<MarketsRow>): void => {
    if (err) return callback(err);
    if (!marketsRows || !marketsRows.length) return callback(null);
    const marketsInfo: UIMarketsInfo = [];
    each(marketsRows, (marketsRow: MarketsRow, nextMarketsRow: ErrorCallback): void => {
      db.select().from("outcomes").where("marketID", marketsRow.marketID).asCallback((err: Error|null, outcomesRows?: Array<OutcomesRow>): void => {
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
