import * as t from "io-ts";
import * as Knex from "knex";
import { Address, MarketsContractAddressRow, SortLimitParams } from "../../types";
import { queryModifier } from "./database";

export const MarketsClosingInDateRangeParamsSpecific = t.type({
  universe: t.string,
  earliestClosingTime: t.number,
  latestClosingTime: t.number,
});

export const MarketsClosingInDateRangeParams = t.intersection([
  MarketsClosingInDateRangeParamsSpecific,
  SortLimitParams,
]);

export async function getMarketsClosingInDateRange(db: Knex, augur: {}, params: t.TypeOf<typeof MarketsClosingInDateRangeParams>): Promise<Array<Address>> {
  const query = db.select("marketId").from("markets").whereBetween("endTime", [params.earliestClosingTime, params.latestClosingTime]).where("universe", params.universe);
  const rows = await queryModifier<MarketsContractAddressRow>(db, query, "endTime", "desc", params);
  return rows.map((row: MarketsContractAddressRow): Address => row.marketId);
}
