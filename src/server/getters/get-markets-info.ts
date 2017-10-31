import { each } from "async";
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { Address, MarketsRowWithCreationTime, OutcomesRow, UIMarketInfo, UIMarketsInfo, UIOutcomeInfo, ErrorCallback } from "../../types";
import { reshapeOutcomesRowToUIOutcomeInfo, reshapeMarketsRowToUIMarketInfo, getMarketsWithReportingState } from "./database";
import { queryModifier } from "./database";

export function getMarketsInfo(db: Knex, marketIDs: Array<Address>|null|undefined, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: UIMarketsInfo) => void): void {
  let query: Knex.QueryBuilder = getMarketsWithReportingState(db);
  if (marketIDs == null || !marketIDs.length) return callback(new Error("must include marketIDs parameter"));
  query = query.whereIn("markets.marketID", marketIDs);
  query.asCallback((err: Error|null, marketsRows?: Array<MarketsRowWithCreationTime>): void => {
    if (err) return callback(err);
    if (!marketsRows || !marketsRows.length) return callback(null);
    const marketsInfo: UIMarketsInfo = [];
    each(marketsRows, (marketsRow: MarketsRowWithCreationTime, nextMarketsRow: ErrorCallback): void => {
      db("outcomes").where("marketID", marketsRow.marketID).asCallback((err: Error|null, outcomesRows?: Array<OutcomesRow>): void => {
        if (err) return nextMarketsRow(err);
        const outcomesInfo: Array<UIOutcomeInfo> = outcomesRows!.map((outcomesRow: OutcomesRow): UIOutcomeInfo => reshapeOutcomesRowToUIOutcomeInfo(outcomesRow));
        const marketsIndex = marketIDs.indexOf(marketsRow.marketID);
        marketsInfo[marketsIndex] = reshapeMarketsRowToUIMarketInfo(marketsRow, outcomesInfo);
        nextMarketsRow();
      });
    }, (err: Error|null): void => {
      if (err) return callback(err);
      callback(null, marketsInfo);
    });
  });
}
