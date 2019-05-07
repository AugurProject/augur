import * as t from "io-ts";
import * as Knex from "knex";

export interface AccountTimeRangeResult {
  positions: number;
  marketsCreated: number;
  numberOfTrades: number;
  successfulDisputes: number;
  marketsTraded: number;
  redeemedPositions: number;
}

export const AccountTimeRangedStatsParams = t.type({
  universe: t.string,
  account: t.string,
  endTime: t.union([t.number, t.null]),
  startTime: t.union([t.number, t.null]),
});
export type AccountTimeRangedStatsParamsType = t.TypeOf<typeof AccountTimeRangedStatsParams>;

export async function getAccountTimeRangedStats(db: Knex, augur: {}, params: AccountTimeRangedStatsParamsType): Promise<AccountTimeRangeResult> {
  const positions = 0;
  const marketsCreated = 0;
  const numberOfTrades = 0;
  const successfulDisputes = 0;
  const marketsTraded = 0;
  const redeemedPositions = 0;
  const result: AccountTimeRangeResult = {
    positions,
    marketsCreated,
    numberOfTrades,
    successfulDisputes,
    marketsTraded,
    redeemedPositions,
  };

  return result;
}
