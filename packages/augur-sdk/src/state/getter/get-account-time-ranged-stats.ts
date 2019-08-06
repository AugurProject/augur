import * as t from "io-ts";
import { DB } from "../db/DB";
import { Getter } from './Router';
import { Augur } from '../../index';

export interface AccountTimeRangedStatsResult {
  // Yea. The ProfitLossChanged event then
  // Sum of unique entries (defined by market + outcome) with non-zero netPosition
  positions: number;

  // OrderEvent table for fill events (eventType == 3) where they are the orderCreator or orderFiller address
  // if multiple fills in the same tx count as one trade then also couldting just the unique tradeGroupId from those
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
      creator: t.string,
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

    console.log("params", params);

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
      selector: Object.assign({
        marketcreator: params.creator,
      }, baseRequest),
    };

    console.log("marketsRequest", marketsRequest);

    const initialReporterRequest = {
      selector: Object.assign({
        reporter: params.creator,
      }, baseRequest),
    };

    const disputeCrowdourcerRequest = {
      selector: Object.assign({
        disputeCrowdsourcerer: params.creator,
      }, baseRequest),
    };

    const profitLossChangedRequest = {
      selector: Object.assign({
        account: params.creator,

      }, baseRequest),
    };

    const orderFilledRequest = {
      selector: Object.assign({
      }, baseRequest),
    };

    const markets = await db.findMarketCreatedLogs(marketsRequest as any as PouchDB.Find.FindRequest<{}>);
    const initialReporterReedeemedLogs = await db.findInitialReporterRedeemedLogs(initialReporterRequest as any as PouchDB.Find.FindRequest<{}>);
    const disputeCrowdsourcerReedeemedLogs = await db.findDisputeCrowdsourcerCompletedLogs(disputeCrowdourcerRequest as any as PouchDB.Find.FindRequest<{}>);
    const redeemedPositions = initialReporterReedeemedLogs.length + disputeCrowdsourcerReedeemedLogs.length;

    const profitLossChangedLogs = await db.findProfitLossChangedLogs(params.creator, profitLossChangedRequest as any as PouchDB.Find.FindRequest<{}>);
    const orderFilledLogs = await db.findOrderFilledLogs(orderFilledRequest as any as PouchDB.Find.FindRequest<{}>);

    console.log("MarketLogs", markets.length);
    console.log("RedeemedPositions", redeemedPositions);
    console.log("ProfitLoss", profitLossChangedLogs);
    console.log("OrderFilled", orderFilledLogs);

    return {} as AccountTimeRangedStatsResult;
  }
}
