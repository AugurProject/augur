import * as Knex from "knex";
import { Address } from "../../types";
import { getMarketsWithReportingState } from "./database";

// Look up reporting summary values. Should take reportingWindow (address) as a parameter and the response should include total number of markets up for reporting, total number of markets up for dispute, total number of markets undergoing and/or resolved via each reporting "tier" (automated, limited, full, fork), etc.
export function getReportingSummary(db: Knex, reportingWindow: Address, callback: (err: Error|null, result?: any) => void): void {
    const query = getMarketsWithReportingState(db, []).countDistinct("markets.marketID as count").where({ reportingWindow });
    query.select("market_state.reportingState").groupBy("market_state.reportingState");
    query.asCallback((err?: Error|null, summaryRows?: Array<any>): void => {
      if (err) return callback(err);
      if (!summaryRows) return callback(null);
      callback(null, summaryRows.reduce((acc, cur) => {acc[cur.reportingState] = cur.count; return acc; }, {}));
    });
}
