import {
  Address,
  DisputeCrowdsourcerContributionLog,
  DisputeCrowdsourcerRedeemedLog,
  MarketCreatedLog,
  OrderEventType,
  ParsedOrderEventLog,
  ParticipationTokensRedeemedLog,
  TimestampedLog,
  TradingProceedsClaimedLog,
} from '@augurproject/sdk-lite';
import { BigNumber } from 'bignumber.js';
import Dexie from 'dexie';
import * as t from 'io-ts';
import * as _ from 'lodash';
import { Augur } from '../../index';
import { convertAttoValueToDisplayValue } from '../../utils';
import { DB } from '../db/DB';
import { Getter } from './Router';
import { NULL_ADDRESS } from './types';

export interface PlatformActivityStatsResult {
  activeUsers: number;

  // OrderEvent table for fill events (eventType == 3) where they are the orderCreator or orderFiller address
  // if multiple fills in the same tx count as one trade then also counting just the unique tradeGroupId from those
  numberOfTrades: number;
  openInterest: string;

  // MarketCreated logs
  marketsCreated: number;

  volume: string;
  amountStaked: string;
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
    }),
  ]);

  @Getter('getPlatformActivityStatsParams')
  static async getPlatformActivityStats(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof Platform.getPlatformActivityStatsParams>
  ): Promise<PlatformActivityStatsResult> {
    const { universe } = params;
    const startTime = params.startTime || 0;
    const endTime =
      params.endTime ||
      (await augur.contracts.augur.getTimestamp_()).toNumber();

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
      disputedMarkets: await getDisputedMarkets(
        universe,
        startTime,
        endTime,
        db
      ),
    };
  }
}

async function getActiveUsers(
  universe: string,
  startTime: number,
  endTime: number,
  db: DB
): Promise<number> {
  const getField = makeGetField(universe, startTime, endTime);
  const users: Address[] = [
    ...(await getField<DisputeCrowdsourcerContributionLog>(
      'reporter',
      db.DisputeCrowdsourcerContribution
    )),
    ...(await getField<DisputeCrowdsourcerRedeemedLog>(
      'reporter',
      db.DisputeCrowdsourcerRedeemed
    )),
    ...(await getField<MarketCreatedLog>('marketCreator', db.MarketCreated)),
    // TODO should just get both fields at once
    ...(await getField<ParsedOrderEventLog>(
      'orderCreator',
      db.ParsedOrderEvent
    )),
    ...(await getField<ParsedOrderEventLog>(
      'orderFiller',
      db.ParsedOrderEvent
    )),
    ...(await getField<ParticipationTokensRedeemedLog>(
      'account',
      db.ParticipationTokensRedeemed
    )),
    ...(await getField<TradingProceedsClaimedLog>(
      'sender',
      db.TradingProceedsClaimed
    )),
  ];

  // Filter out null address then remove duplicates.
  return _.uniq(users.filter(user => user !== NULL_ADDRESS)).length;
}

async function getTradeCount(
  universe: string,
  startTime: number,
  endTime: number,
  db: DB
): Promise<number> {
  const orderFilledLogs = await db.ParsedOrderEvent.where('timestamp')
    .between(formatTimestamp(startTime), formatTimestamp(endTime), true, true)
    .and(log => {
      // @ts-ignore // TODO fix typescipte error here
      return log.eventType === OrderEventType.Fill && log.universe === universe;
    })
    .toArray();

  return _.uniqWith(
    orderFilledLogs,
    (a: ParsedOrderEventLog, b: ParsedOrderEventLog) => {
      return a.tradeGroupId === b.tradeGroupId;
    }
  ).length;
}

async function getOpenInterest(
  universe: string,
  augur: Augur
): Promise<string> {
  const universeContract = augur.contracts.universeFromAddress(universe);
  return (await universeContract.getOpenInterestInAttoCash_()).toFixed();
}

async function getMarketCount(
  universe: string,
  startTime: number,
  endTime: number,
  db: DB
): Promise<number> {
  const marketsCreatedLogs = await db.MarketCreated.where('timestamp')
    .between(formatTimestamp(startTime), formatTimestamp(endTime), true, true)
    .and(log => {
      return log.universe === universe;
    })
    .toArray();
  return marketsCreatedLogs.length;
}

async function getVolume(
  universe: string,
  startTime: number,
  endTime: number,
  db: DB
): Promise<string> {
  // TODO this is not an accurate measurement of volume in a time period if thats what this is supposed to be
  const marketsLogs = await db.Markets.where('timestamp')
    .between(formatTimestamp(startTime), formatTimestamp(endTime), true, true)
    .and(log => {
      return log.universe === universe;
    })
    .toArray();
  const volume = marketsLogs.reduce(
    (total, log) => total.plus(log.volume),
    new BigNumber(0)
  );

  return convertAttoValueToDisplayValue(volume).toFixed();
}

async function getAmountStaked(
  universe: string,
  startTime: number,
  endTime: number,
  db: DB
): Promise<string> {
  const initialReportLogs = await db.InitialReportSubmitted.where('timestamp')
    .between(formatTimestamp(startTime), formatTimestamp(endTime), true, true)
    .and(log => {
      return log.universe === universe;
    })
    .toArray();
  const disputeContributionLogs = await db.DisputeCrowdsourcerContribution.where(
    'timestamp'
  )
    .between(formatTimestamp(startTime), formatTimestamp(endTime), true, true)
    .and(log => {
      return log.universe === universe;
    })
    .toArray();
  return [
    ...initialReportLogs.map(log => new BigNumber(log.amountStaked)),
    ...disputeContributionLogs.map(log => new BigNumber(log.amountStaked)),
  ].reduce((previous, current) => previous.plus(current), new BigNumber(0)).toFixed();
}

async function getDisputedMarkets(
  universe: string,
  startTime: number,
  endTime: number,
  db: DB
): Promise<number> {
  const disputeCrowdsourcerCompletedLogs = await db.DisputeCrowdsourcerCompleted.where(
    'timestamp'
  )
    .between(formatTimestamp(startTime), formatTimestamp(endTime), true, true)
    .and(log => {
      return log.universe === universe;
    })
    .toArray();

  return _.uniqWith(
    disputeCrowdsourcerCompletedLogs,
    (a: any, b: any) => a.market === b.market
  ).length;
}

//
// Util
//

interface TimeConstraint {
  $and: Array<{
    timestamp: {
      $gte?: string;
      $lte?: string;
    };
  }>;
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

function makeGetField(universe: Address, startTime: number, endTime: number) {
  return async <L extends TimestampedLog>(
    field: keyof L & string,
    table: Dexie.Table<any, any>
  ) => {
    const logs = await table
      .where('timestamp')
      .between(formatTimestamp(startTime), formatTimestamp(endTime), true, true)
      .and(doc => doc.universe === universe)
      .toArray();
    return logs.map(log => String(log[field]));
  };
}
