import * as t from "io-ts";
import { DB } from "../db/DB";
import { Getter } from './Router';
import { Augur } from '../../index';
import * as _ from 'lodash';
import { DisputeCrowdsourcerRedeemed, MarketFinalized, ProfitLossChanged, OrderEvent } from "../../event-handlers";
import PouchDB from "pouchdb";

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

    PouchDB.debug.enable("*");

    const marketsRequest = {
      selector: {
        universe: params.universe,
        marketCreator: params.account,
        $and: [
          { timestamp: { $lte: `0x${endTime.toString(16)}` } },
          { timestamp: { $gte: `0x${startTime.toString(16)}` } },
        ],
      },
    };

    const marketsRequest2 = {
      selector: {
        $and: [
          { universe: params.universe },
          { marketCreator: params.account },
          { timestamp: { $lte: `0x${endTime.toString(16)}` } },
          { timestamp: { $gte: `0x${startTime.toString(16)}` } },
        ],
      },
    };

    const marketsRequest3 = {
      selector: {
        universe: params.universe,
        marketCreator: params.account,
      },
    };

    console.log("Market search selector", marketsRequest);
    console.log("Market search selector2", marketsRequest2);
    console.log("Market search selector3", marketsRequest2);

    const marketDB = db.getSyncableDatabase(db.getDatabaseName("MarketCreated"));
    await marketDB.db.createIndex({
      index: { fields: ['universe', 'marketCreator', 'timestamp'] },
    });

    const searchResults = await db.findMarketCreatedLogs(marketsRequest);
    const searchResults2 = await db.findMarketCreatedLogs(marketsRequest2);
    const searchResults3 = await db.findMarketCreatedLogs(marketsRequest3);

    // console.log("Market search result ", searchResults);

    return {
      positions: 0,
      numberOfTrades: 0,
      marketsCreated: 0,
      marketsTraded: 0,
      successfulDisputes: 0,
      redeemedPositions: 0,
    };
  }
}
