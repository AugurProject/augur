import * as t from "io-ts";
import { DB } from "../db/DB";
import { Getter } from './Router';
import { Augur } from '../../index';
import * as _ from 'lodash';
import { DisputeCrowdsourcerRedeemed, MarketFinalized, ProfitLossChanged, OrderEvent } from "../../event-handlers";

export interface AccountTimeRangedStatsResult {
  // Yea. The ProfitLossChanged event then
  // Sum of unique entries (defined by market + outcome) with non-zero netPosition
  positions: number;

  // OrderEvent table for fill events (eventType == 3) where they are the orderCreator or orderFiller address
  // if multiple fills in the same tx count as one trade then also counting just the unique tradeGroupId from those
  numberOfTrades: number;

  marketsCreated: number;

  // Trades? uniq the market
  marketsTraded: number;

  // DisputeCrowdsourcerRedeemed where the payoutNumerators match the MarketFinalized winningPayoutNumerators
  successfulDisputes: number;

  // For getAccountTimeRangedStats.redeemedPositions use the InitialReporterRedeemed and DisputeCrowdsourcerRedeemed log?
  redeemedPositions: number;
}

export class AccountTimeRangedStats {
  static getAccountTimeRangedStatsParams = t.intersection([
    t.type({
      universe: t.string,
      account: t.string,
    }),
    t.partial({
      endTime: t.number,
      startTime: t.number,
    })]);

  @Getter("getAccountTimeRangedStatsParams")
  static async getAccountTimeRangedStats(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof AccountTimeRangedStats.getAccountTimeRangedStatsParams>
  ): Promise<AccountTimeRangedStatsResult> {

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
      $and: [
        { universe: params.universe },
        { timestamp: { $gte: `0x${startTime.toString(16)}` } },
        { timestamp: { $lte: `0x${endTime.toString(16)}` } },
      ],
    };

    const marketsRequest = {
      selector: {
        $and: [
          { marketCreator: params.account },
          { universe: params.universe },
          { timestamp: { $gte: `0x${startTime.toString(16)}` } },
          { timestamp: { $lte: `0x${endTime.toString(16)}` } },
        ],
      },
    };

    const initialReporterRequest = {
      selector: {
        $and: [
          { reporter: params.account },
          { universe: params.universe },
          { timestamp: { $gte: `0x${startTime.toString(16)}` } },
          { timestamp: { $lte: `0x${endTime.toString(16)}` } },
        ],
      },
    };

    const disputeCrowdourcerRequest = {
      selector: {
        $and: [
          { reporter: params.account },
          { universe: params.universe },
          { timestamp: { $gte: `0x${startTime.toString(16)}` } },
          { timestamp: { $lte: `0x${endTime.toString(16)}` } },
        ],
      },
    };

    const profitLossChangedRequest = {
      selector: {
        $and: [
          { account: params.account },
          { netPosition: { $ne: 0 } },
          { universe: params.universe },
          { timestamp: { $gte: `0x${startTime.toString(16)}` } },
          { timestamp: { $lte: `0x${endTime.toString(16)}` } },
        ],
      },
    };

    const orderFilledRequest = {
      selector: {
        $or: [
          { orderCeator: params.account },
          { orderFiller: params.account },
        ],
        $and: [
          { universe: params.universe },
          { timestamp: { $gte: `0x${startTime.toString(16)}` } },
          { timestamp: { $lte: `0x${endTime.toString(16)}` } },
        ],
      },
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
    const initialReporterReedeemedLogs = await db.findInitialReporterRedeemedLogs(initialReporterRequest);
    const disputeCrowdsourcerReedeemedLogs = await db.findDisputeCrowdsourcerRedeemedLogs(disputeCrowdourcerRequest);

    const successfulDisputes = _.sum(await Promise.all((disputeCrowdsourcerReedeemedLogs as any as DisputeCrowdsourcerRedeemed[])
      .map(async (log: DisputeCrowdsourcerRedeemed) => {
        const marketFinalization = {
          selector: {
            $and: [
              { market: log.market },
              { universe: params.universe },
              { timestamp: { $gte: `0x${startTime.toString(16)}` } },
              { timestamp: { $lte: `0x${endTime.toString(16)}` } },
            ],
          },
        };

        const markets = (await db.findMarketFinalizedLogs(marketFinalization)) as any as MarketFinalized[];

        if (markets.length) {
          return compareArrays(markets[0].winningPayoutNumerators, log.payoutNumerators);
        }
        else {
          return 0;
        }
      })));


    const redeemedPositions = initialReporterReedeemedLogs.length + successfulDisputes;

    const orderFilledLogs = await db.findOrderFilledLogs(orderFilledRequest);
    const numberOfTrades = _.uniqWith(orderFilledLogs as any as OrderEvent[], (a: OrderEvent, b: OrderEvent) => {
      return a.tradeGroupId === b.tradeGroupId;
    }).length;

    const marketsTraded = _.uniqWith(orderFilledLogs as any as OrderEvent[], (a: OrderEvent, b: OrderEvent) => {
      return a.market === b.market;
    }).length;

    const profitLossChangedLogs = await db.findProfitLossChangedLogs(params.account, profitLossChangedRequest);
    const positions = _.uniqWith(profitLossChangedLogs as any as ProfitLossChanged[], (a: ProfitLossChanged, b: ProfitLossChanged) => {
      return a.market === b.market && a.outcome === b.outcome;
    }).length;

    return {
      positions,
      numberOfTrades,
      marketsCreated,
      marketsTraded,
      successfulDisputes,
      redeemedPositions,
    };
  }

}
