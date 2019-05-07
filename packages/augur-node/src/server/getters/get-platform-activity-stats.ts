import * as t from "io-ts";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";

interface VolumeRow<BigNumberType> {
  volume: BigNumberType;
}

interface StakedRow<BigNumberType> {
  amountStaked: BigNumberType;
}

export interface PlatformActivityResult {
  activeUsers: BigNumber;
  numberOfTrades: BigNumber;
  openInterest: BigNumber;
  marketsCreated: BigNumber;
  volume: BigNumber;
  amountStaked: BigNumber;
  disputedMarkets: BigNumber;
}

export const PlatformActivityStatsParams = t.type({
  universe: t.string,
  endTime: t.union([t.number, t.null]),
  startTime: t.union([t.number, t.null]),
});
export type PlatformActivityStatsParamsType = t.TypeOf<typeof PlatformActivityStatsParams>;

export async function getPlatformActivityStats(db: Knex, augur: {}, params: PlatformActivityStatsParamsType): Promise<PlatformActivityResult> {
  const activeUsers = 0;
  const numberOfTrades = 0;
  const openInterest = 0;
  const marketsCreated = 0;
  const volume = 0;
  const amountStaked = 0;
  const disputedMarkets = 0;

  const result: PlatformActivityResult = {
    activeUsers: new BigNumber(activeUsers, 10),
    numberOfTrades: new BigNumber(numberOfTrades, 10),
    openInterest: new BigNumber(openInterest, 10),
    marketsCreated: new BigNumber(marketsCreated, 10),
    volume: new BigNumber(volume, 10),
    amountStaked: new BigNumber(amountStaked, 10),
    disputedMarkets: new BigNumber(disputedMarkets, 10),
  };

  return result;
}
