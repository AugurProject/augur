import * as Knex from "knex";
import { Address } from "../../types";
import { getMarketsWithReportingState } from "./database";

export interface GetReportingSummaryParams {
  marketIds: Array<Address>;
  account: Address|null;
}

export function extractGetDisputeInfoParams(params: any): GetReportingSummaryParams|undefined {
  const pickedParams = _.pick(params, ["feeWindow"]);
  if (isGetReportingSummaryParams(pickedParams)) return pickedParams;
  return undefined;
}

export function isGetReportingSummaryParams(params: any): params is GetReportingSummaryParams {
  if ( ! _.isObject(params) ) return false;
  if ( ! _.isString(params.feeWindow) ) return false;
  return true;
}

// Look up reporting summary values. Should take feeWindow (address) as a parameter and the response should include total number of markets up for reporting, total number of markets up for dispute, total number of markets undergoing and/or resolved via each reporting "tier" (automated, limited, full, fork), etc.
export function getReportingSummary(db: Knex, feeWindow: Address, callback: (err: Error|null, result?: any) => void): void {
    const query = getMarketsWithReportingState(db, []).countDistinct("markets.marketId as count").where({ feeWindow });
    query.select("market_state.reportingState").groupBy("market_state.reportingState");
    query.asCallback((err?: Error|null, summaryRows?: Array<any>): void => {
      if (err) return callback(err);
      if (!summaryRows) return callback(null);
      callback(null, summaryRows.reduce((acc, cur) => {acc[cur.reportingState] = cur.count; return acc; }, {}));
    });
}
