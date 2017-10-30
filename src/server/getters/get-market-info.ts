import * as Knex from "knex";
import { Address, MarketsRowWithCreationTime, OutcomesRow, UIMarketInfo, UIConsensusInfo, UIOutcomeInfo } from "../../types";
import { reshapeMarketsRowToUIMarketInfo, reshapeOutcomesRowToUIOutcomeInfo, getMarketsWithReportingState } from "./database";

export function getMarketInfo(db: Knex, marketID: string, callback: (err: Error|null, result?: UIMarketInfo) => void): void {
  getMarketsWithReportingState(db).where({ "markets.marketID": marketID }).limit(1).asCallback((err: Error | null, rows?: Array<MarketsRowWithCreationTime>): void => {
    if (err) return callback(err);
    if (!rows || !rows.length) return callback(null);
    const marketsRow: MarketsRowWithCreationTime = rows[0];
    db("outcomes").where({ marketID }).asCallback((err: Error|null, outcomesRows?: Array<OutcomesRow>): void => {
      if (err) return callback(err);
      const outcomesInfo: Array<UIOutcomeInfo> = outcomesRows!.map((outcomesRow: OutcomesRow): UIOutcomeInfo => reshapeOutcomesRowToUIOutcomeInfo(outcomesRow));
      callback(null, reshapeMarketsRowToUIMarketInfo(marketsRow, outcomesInfo));
    });
  });
}
