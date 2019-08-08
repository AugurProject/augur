import * as t from "io-ts";
import { BigNumber } from 'bignumber.js';
import { DB } from "../db/DB";
import { Getter } from './Router';
import { Augur } from '../../index';
import * as _ from 'lodash';
import { DisputeCrowdsourcerRedeemed, MarketFinalized, ProfitLossChanged, OrderEvent } from "../../event-handlers";

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

export class PlatformActivityStats {
  static getPlatformActivityStatsParams = t.intersection([
    t.type({
      universe: t.string,
    }),
    t.partial({
      endTime: t.number,
      startTime: t.number,
    })]);

  @Getter("getPlatformActivityStatsParams")
  static async getPlatformActivityStats(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof PlatformActivityStats.getPlatformActivityStatsParams>
  ): Promise<PlatformActivityStatsResult> {

    // guards
    if (!(await augur.contracts.augur.isKnownUniverse_(params.universe))) {
      throw new Error('Unknown universe: ' + params.universe);
    }

    const startTime = params.startTime ? params.startTime : 0;
    const endTime = params.endTime ? params.endTime : await augur.contracts.augur.getTimestamp_();

    if (params.startTime > params.endTime) {
      throw new Error("startTime must be less than or equal to endTime");
    }

    const baseRequest = {
      universe: params.universe,
      $and: [
        { timestamp: { $gte: `0x${startTime.toString(16)}` } },
        { timestamp: { $lte: `0x${endTime.toString(16)}` } },
      ],
    };

    const marketsRequest = {
      selector: Object.assign({}, baseRequest),
    };

    const disputeCrowdourcerRequest = {
      selector: Object.assign({}, baseRequest),
    };

    const orderFilledRequest = {
      selector: Object.assign({}, baseRequest),
    };

    const compareArrays = (lhs: string[], rhs: string[]): number => {
      let equal = 1;

      lhs.forEach((item: string, index: number) => {
        if (index >= rhs.length || item !== rhs[index]) {
          equal = 0;
        }
      });

      return equal;
    };

    const marketsCreatedLog = await db.findMarketCreatedLogs(marketsRequest);
    const marketsCreated = marketsCreatedLog.length;

    const orderFilledLogs = await db.findOrderFilledLogs(orderFilledRequest);
    const numberOfTrades = _.uniqWith(orderFilledLogs as any as OrderEvent[], (a: OrderEvent, b: OrderEvent) => {
      return a.tradeGroupId === b.tradeGroupId;
    }).length;

    return {
      activeUsers: 0,
      numberOfTrades,
      openInterest: new BigNumber(0),
      marketsCreated,
      volume: new BigNumber(0),
      amountStaked: new BigNumber(0),
      disputedMarkets: 0,
    };
  }
}

