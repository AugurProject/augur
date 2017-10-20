import { each } from "async";
import * as Knex from "knex";
import { Address, MarketsRow, UIMarketInfo, UIMarketsInfo, ErrorCallback } from "../../types";
import { reshapeMarketsRowToUIMarketInfo } from "./get-market-info";

// Look up all markets that are currently awaiting designated (automated) reporting.
// Should accept a designatedReporterAddress parameter that filters by designated reporter address.
export function getMarketsAwaitingDesignatedReporting(db: Knex, designatedReporter: Address, callback: (err?: Error|null, result?: any) => void): void {
    const marketsInfo: UIMarketsInfo = [];
    let queryData: {} = {};
    if ( designatedReporter != null ) {
        queryData = { designatedReporter };
    }
    // TODO: should we also consider a market_state's phase IS NULL?
    db.select().from("markets").where(queryData).whereNull("marketStateID").asCallback((err?: Error|null, marketsRows?: Array<MarketsRow>): void => {
        if (err) return callback(err);
        if (!marketsRows || !marketsRows.length) return callback(null);
        each(marketsRows, (marketsRow: MarketsRow, nextMarketsRow: ErrorCallback): void => {
            if (err) return callback(err);
            marketsInfo.push(reshapeMarketsRowToUIMarketInfo(marketsRow, []) as UIMarketInfo);
        });
        callback(null, marketsInfo);
    });
}
