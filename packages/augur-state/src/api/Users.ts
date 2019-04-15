import { DB } from "../db/DB";
import { Getter } from "./Router";

import * as t from "io-ts";

export class Users {
  public static GetUserTradingPositionsParams = t.intersection([t.type({
    universe: t.string,
  }), t.partial({
    creator: t.string,
    category: t.string,
    search: t.string,
    reportingState: t.string,
    disputeWindow: t.string,
    designatedReporter: t.string,
    maxFee: t.number,
    hasOrders: t.boolean,
  })]);

  @Getter("GetUserTradingPositionsParams")
  public async getUserTradingPositions(params: t.TypeOf<typeof Users.GetUserTradingPositionsParams>): Promise<void> {
    // TODO
  }

  @Getter("GetUserTradingPositionsParams")
  public async getProfitLoss(params: t.TypeOf<typeof Users.GetUserTradingPositionsParams>): Promise<void> {
    // TODO
  }

  @Getter("GetUserTradingPositionsParams")
  public async getProfitLossSummary(params: t.TypeOf<typeof Users.GetUserTradingPositionsParams>): Promise<void> {
    // TODO
  }
}
