import * as t from "io-ts";
import { DB } from "../db/DB";
import { Getter } from "./Router";

export interface AccountTimeRangedStatsResult {
  positions: number;
  marketsCreated: number;
  numberOfTrades: number;
  successfulDisputes: number;
  marketsTraded: number;
  redeemedPositions: number;
}

export class AccountTimeRangedStats {
  static getAccountTimeRangedStatsParams = t.type({
    universe: t.string,
    creator: t.string,
    endTime: t.union([t.number, t.null]),
    startTime: t.union([t.number, t.null]),
  });

  @Getter("AccountTimeRangedStatsParams")
  public static async getAccountTimeRangedStats(
    augur: Augur,
    db: DB,
    params: t.TypeOf<typeof AccountTimeRangedStats.getAccountTimeRangedStatsParams>
  ): Promise<AccountTimeRangedStatsResult> {
    // guards
    if (params.startTime && params.endTime && params.startTime > params.endTime) {
      throw new Error("startTime must be less than or equal to endTime");
    }
    let startTime = params.startTime;
    if (!params.startTime) startTime = 0;

    let endTime = params.endTime;
    if (!endTime) {
      const now = await augur.contracts.augur.getTimestamp_();
      endTime = now.toNumber();
    }

    const request = {
      selector: {
        universe: params.universe,
        marketcreator: params.creator,
        $and: [
          { timestamp: { $lte: params.startTime } },
          { timestamp: { $gte: params.endTime } },
        ],
      },
    };

    if (params.startTime !== 0) {
      request.selector = Object.assign(request.selector, {
        starttime: { $lt: `0x${params.startTime.toString(16)}` },
      });
    }

    if (params.endTime !== 0) {
      request.selector = Object.assign(request.selector, {
        endtime: { $lt: `0x${params.endTime.toString(16)}` },
      });
    }
    const marketLogs = await db.findMarketCreatedLogs(request);

    console.log(marketLogs);

    return {} as AccountTimeRangedStatsResult;
  }
}
