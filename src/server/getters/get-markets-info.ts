import { each } from "async";
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { Address, MarketsRow, OutcomesRow, UIMarketInfo, UIOutcomeInfo, ErrorCallback } from "../../types";
import { reshapeOutcomesRowToUIOutcomeInfo, reshapeMarketsRowToUIMarketInfo } from "./get-market-info";

interface UIMarketsInfo {
  [marketID: string]: UIMarketInfo;
}

export function getMarketsInfo(db: Knex, universe: Address|null|undefined, marketIDs: Array<Address>|null|undefined, callback: (err?: Error|null, result?: UIMarketsInfo) => void): void {
  let query: string = "SELECT * FROM markets WHERE";
  let queryParams: Array<Address|Array<Address>>;
  if (universe == null && marketIDs == null) {
    return callback(new Error("must include universe or marketIDs parameters"));
  } else if (universe != null && marketIDs != null) {
    query = `${query} universe = ? AND market_id IN (??)`;
    queryParams = [universe!, marketIDs!];
  } else if (universe != null) {
    query = `${query} universe = ?`;
    queryParams = [universe!];
  } else {
    query = `${query} market_id IN (??)`;
    queryParams = [marketIDs!];
  }
  db.raw(query, queryParams).asCallback((err?: Error|null, marketsRows?: Array<MarketsRow>): void => {
    if (err) return callback(err);
    if (!marketsRows || !marketsRows.length) return callback(null);
    const marketsInfo: UIMarketsInfo = {};
    each(marketsRows, (marketsRow: MarketsRow, nextMarketsRow: ErrorCallback): void => {
      db.raw("SELECT * FROM outcomes WHERE market_id = ?", [marketsRow.market_id]).asCallback((err?: Error|null, outcomesRows?: Array<OutcomesRow>): void => {
        if (err) return nextMarketsRow(err);
        const outcomesInfo: Array<UIOutcomeInfo> = outcomesRows!.map((outcomesRow: OutcomesRow): UIOutcomeInfo => reshapeOutcomesRowToUIOutcomeInfo(outcomesRow));
        marketsInfo[marketsRow.market_id] = reshapeMarketsRowToUIMarketInfo(marketsRow, outcomesInfo) as UIMarketInfo;
        nextMarketsRow();
      });
    }, (err?: Error|null) => {
      if (err) return callback(err);
      callback(null, marketsInfo);
    });
  });
}
