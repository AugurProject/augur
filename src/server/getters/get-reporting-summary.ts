import * as Knex from "knex";
import * as _ from "lodash";
import { Address } from "../../types";
import { getMarketsWithReportingState } from "./database";
import Augur from "augur.js";

export interface GetReportingSummaryParams {
  feeWindow: Address;
}

export function extractGetReportingSummaryParams(params: any): GetReportingSummaryParams|undefined {
  const pickedParams = _.pick(params, ["feeWindow"]);
  if (isGetReportingSummaryParams(pickedParams)) return pickedParams;
  return undefined;
}

export function isGetReportingSummaryParams(params: any): params is GetReportingSummaryParams {
  if (!_.isObject(params)) return false;
  if (!_.isString(params.feeWindow)) return false;
  return true;
}

// Look up reporting summary values. Should take feeWindow (address) as a parameter and the response should include total number of markets up for reporting, total number of markets up for dispute, total number of markets undergoing and/or resolved via each reporting "tier" (automated, limited, full, fork), etc.
export async function getReportingSummary(db: Knex, augur: Augur, params: GetReportingSummaryParams): Promise<{}> {
  const query = getMarketsWithReportingState(db, []).countDistinct("markets.marketId as count").where({ feeWindow: params.feeWindow });
  query.select("market_state.reportingState").groupBy("market_state.reportingState");
  const summaryRows: Array<any> = await query;
  if (!summaryRows) return {};
  return summaryRows.reduce((acc, cur) => {
    acc[cur.reportingState] = cur.count;
    return acc;
  }, {});
}
