import * as t from 'io-ts';
import { BigNumber } from 'bignumber.js';
import { DB } from '../db/DB';
import { Getter } from './Router';
import { Augur } from '../../index';
import * as _ from 'lodash';
import { ParsedOrderEventLog } from '../logs/types';

export interface PlatformActivityStatsResult {
  activeUsers: number;

  // OrderEvent table for fill events (eventType == 3) where they are the orderCreator or orderFiller address
  // if multiple fills in the same tx count as one trade then also counting just the unique tradeGroupId from those
  numberOfTrades: number;
  openInterest: BigNumber;

  // MarketCreated logs
  marketsCreated: number;

  volume: BigNumber;
  amountStaked: BigNumber;
  disputedMarkets: number;
}

export class Platform {
  static getPlatformActivityStatsParams = t.intersection([
    t.type({
      universe: t.string,
    }),
    t.partial({
      endTime: t.number,
      startTime: t.number,
    })]);

  @Getter('getPlatformActivityStatsParams')
  static async getPlatformActivityStats(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Platform.getPlatformActivityStatsParams>
  ): Promise<PlatformActivityStatsResult> {
    const { universe } = params;
    const startTime = params.startTime || 0;
    const endTime = params.endTime || (await augur.contracts.augur.getTimestamp_()).toNumber();

    if (Number(startTime) > Number(endTime)) {
      throw new Error('startTime must be less than or equal to endTime');
    }

    return {
      activeUsers: await getActiveUsers(universe, startTime, endTime, db),
      numberOfTrades: await getTradeCount(universe, startTime, endTime, db),
      openInterest: await getOpenInterest(universe, augur),
      marketsCreated: await getMarketCount(universe, startTime, endTime, db),
      volume: await getVolume(universe, startTime, endTime, db),
      amountStaked: await getAmountStaked(universe, startTime, endTime, db),
      disputedMarkets: await getDisputedMarkets(universe, startTime, endTime, db),
    };
  }
}

async function getOpenInterest(universe: string, augur: Augur): Promise<BigNumber> {
  const universeContract = augur.contracts.universeFromAddress(universe);
  return universeContract.getOpenInterestInAttoCash_();
}

async function getActiveUsers(
  universe: string,
  startTime: number,
  endTime: number,
  db: DB
): Promise<number> {
  return 0;
}

async function getDisputedMarkets(
  universe: string,
  startTime: number,
  endTime: number,
  db: DB
): Promise<number> {
  const disputeCrowdsourcerCompletedLogs = await db.findDisputeCrowdsourcerCompletedLogs({
    selector: {
      universe,
      ...timeConstraint(startTime, endTime),
    },
  });
  console.log('HEART', disputeCrowdsourcerCompletedLogs[0]);
  return 0;
}

async function getAmountStaked(
  universe: string,
  startTime: number,
  endTime: number,
  db: DB
): Promise<BigNumber> {
  return new BigNumber(0);
}

async function getTradeCount(
  universe: string,
  startTime: number,
  endTime: number,
  db: DB
): Promise<number> {
  const orderFilledLogs = await db.findOrderFilledLogs({
    selector: {
      universe,
      ...timeConstraint(startTime, endTime),
    },
  });

  return _.uniqWith(orderFilledLogs, (a: ParsedOrderEventLog, b: ParsedOrderEventLog) => {
    return a.tradeGroupId === b.tradeGroupId;
  }).length;
}

async function getMarketCount(
  universe: string,
  startTime: number,
  endTime: number,
  db: DB
): Promise<number> {
  const marketsCreatedLogs = await db.findMarketCreatedLogs({
    selector: {
      universe,
      ...timeConstraint(startTime, endTime),
    },
  });
  return marketsCreatedLogs.length;
}

async function getVolume(
  universe: string,
  startTime: number,
  endTime: number,
  db: DB
): Promise<BigNumber> {
  const marketsLogs = await db.findMarkets({
    selector: {
      universe,
      ...timeConstraint(startTime, endTime),
    },
    fields: [ 'volume' ],
  });
  return marketsLogs.reduce(
    (total, log) => total.plus(log.volume),
    new BigNumber(0));
}

interface TimeConstraint {
  $and: Array<{timestamp: {
    $gte?: string;
    $lte?: string;
  }}>;
}
function timeConstraint(startTime: number, endTime: number): TimeConstraint {
  const formattedStartTime = formatTimestamp(startTime);
  const formattedEndTime = formatTimestamp(endTime);

  return {
    $and: [
      { timestamp: { $gte: formattedStartTime } },
      { timestamp: { $lte: formattedEndTime } },
    ],
  };
}

function formatTimestamp(timestamp: number): string {
  return `0x${new BigNumber(timestamp).toString(16)}`;
}
