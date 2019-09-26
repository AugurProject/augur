import * as t from 'io-ts';
import { BigNumber } from 'bignumber.js';
import { DB } from '../db/DB';
import { Getter } from './Router';
import { Augur } from '../../index';
import * as _ from 'lodash';
import {
  Address,
  CompleteSetsPurchasedLog,
  CompleteSetsSoldLog,
  DisputeCrowdsourcerContributionLog,
  DisputeCrowdsourcerRedeemedLog,
  InitialReporterRedeemedLog,
  InitialReportSubmittedLog,
  Log,
  MarketCreatedLog,
  ParsedOrderEventLog,
  ParticipationTokensRedeemedLog,
  Timestamped,
  TradingProceedsClaimedLog
} from "../logs/types";
import { NULL_ADDRESS } from "./types";

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

async function getActiveUsers(
  universe: string,
  startTime: number,
  endTime: number,
  db: DB
): Promise<number> {
  const getField = makeGetField(universe, startTime, endTime);
  const users: Address[] = [
    ...await getField<CompleteSetsPurchasedLog>('account', db.findCompleteSetsPurchasedLogs.bind(db)),
    ...await getField<CompleteSetsSoldLog>('account', db.findCompleteSetsSoldLogs.bind(db)),
    ...await getField<DisputeCrowdsourcerContributionLog>('reporter', db.findDisputeCrowdsourcerContributionLogs.bind(db)),
    ...await getField<DisputeCrowdsourcerRedeemedLog>('reporter', db.findDisputeCrowdsourcerRedeemedLogs.bind(db)),
    ...await getField<InitialReporterRedeemedLog>('initialReporter', db.findInitialReporterRedeemedLogs.bind(db)),
    ...await getField<InitialReportSubmittedLog>('reporter', db.findInitialReportSubmittedLogs.bind(db)),
    ...await getField<MarketCreatedLog>('marketCreator', db.findMarketCreatedLogs.bind(db)),
    // Order logs are compressed so we parse them first. Our db helper methods make this easy.
    ...await getField<ParsedOrderEventLog>('orderCreator', db.findOrderCreatedLogs.bind(db)),
    ...await getField<ParsedOrderEventLog>('orderCreator', db.findOrderCanceledLogs.bind(db)),
    ...await getField<ParsedOrderEventLog>('orderFiller', db.findOrderFilledLogs.bind(db)),
    ...await getField<ParticipationTokensRedeemedLog>('account', db.findParticipationTokensRedeemedLogs.bind(db)),
    ...await getField<TradingProceedsClaimedLog>('sender', db.findTradingProceedsClaimedLogs.bind(db)),
  ];

  // Filter out null address then remove duplicates.
  return _.uniq(users.filter((user) => user !== NULL_ADDRESS)).length;
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

async function getOpenInterest(universe: string, augur: Augur): Promise<BigNumber> {
  const universeContract = augur.contracts.universeFromAddress(universe);
  return universeContract.getOpenInterestInAttoCash_();
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

async function getAmountStaked(
  universe: string,
  startTime: number,
  endTime: number,
  db: DB
): Promise<BigNumber> {
  const initialReportLogs = await db.findInitialReportSubmittedLogs({
    selector: {
      universe,
      ...timeConstraint(startTime, endTime),
    },
    fields: [ 'amountStaked' ],
  });
  const disputeContributionLogs = await db.findDisputeCrowdsourcerContributionLogs({
    selector: {
      universe,
      ...timeConstraint(startTime, endTime),
    },
    fields: [ 'amountStaked' ],
  });

  return [
    ...initialReportLogs.map((log) => new BigNumber(log.amountStaked)),
    ...disputeContributionLogs.map((log) => new BigNumber(log.amountStaked)),
  ].reduce((previous, current) => previous.plus(current), new BigNumber(0));
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
      nextWindowStartTime: { $lte: formatTimestamp(endTime)},
      nextWindowEndTime: { $gte: formatTimestamp(startTime)},
    },
    fields: [ 'market' ],
  });

  return _.uniqWith(disputeCrowdsourcerCompletedLogs, (a, b) => a.market === b.market).length;
}

//
// Util
//

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

function makeGetField(universe: Address, startTime: number, endTime: number) {
  const selector = {
    universe,
    ...timeConstraint(startTime, endTime),
  };

  return async <L extends Log & Timestamped>(field: keyof L & string, fn: (request: PouchDB.Find.FindRequest<{}>) => Promise<L[]>) => {
    const logs = await fn({
      selector,
      fields: [field],
    });
    return logs.map((log) => String(log[field]));
  };
}
