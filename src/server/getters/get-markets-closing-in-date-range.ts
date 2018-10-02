import * as Knex from "knex";
import { Address, MarketsContractAddressRow, SortLimit } from "../../types";
import { checkOptionalOrderingParams, queryModifierParams, SORT_LIMIT_KEYS } from "./database";
import * as _ from "lodash";

export interface GetMarketsClosingInDateRangeParams extends SortLimit {
  universe: Address;
  earliestClosingTime: number;
  latestClosingTime: number;
}

export function extractGetMarketsClosingInDateRangeParams(params: any): GetMarketsClosingInDateRangeParams|undefined {
  const pickedParams = _.pick(params, ["universe", "earliestClosingTime", "latestClosingTime", ...SORT_LIMIT_KEYS]);
  if (!checkOptionalOrderingParams(pickedParams)) return undefined;
  if (!isGetMarketsClosingInDateRangeParams(pickedParams)) return undefined;
  return pickedParams;
}

export function isGetMarketsClosingInDateRangeParams(params: any): params is GetMarketsClosingInDateRangeParams {
  if (!_.isObject(params)) return false;
  if (!_.isString(params.universe)) return false;
  if (!_.isNumber(params.earliestClosingTime)) return false;
  return _.isNumber(params.latestClosingTime);

}

export async function getMarketsClosingInDateRange(db: Knex, augur: {}, params: GetMarketsClosingInDateRangeParams): Promise<Array<Address>> {
  const query = db.select("marketId").from("markets").whereBetween("endTime", [params.earliestClosingTime, params.latestClosingTime]).where("universe", params.universe);
  const rows = await queryModifierParams<MarketsContractAddressRow>(db, query, "endTime", "desc", params);
  return rows.map((row: MarketsContractAddressRow): Address => row.marketId);
}
