import { forEachOf } from "async";
import * as Knex from "knex";
import { Address, ErrorCallback } from "../../../types";

export function updatePositionInMarket(db: Knex, account: Address, marketId: Address, positionInMarket: Array<string>, realizedProfitLoss: Array<string>, unrealizedProfitLoss: Array<string>, positionInMarketAdjustedForUserIntention: Array<string>, averagePrice: Array<string>, callback: ErrorCallback): void {
  forEachOf(positionInMarket, (numShares: string, outcome: number, nextOutcome: ErrorCallback): void => {
    db("positions").where({ account, marketId, outcome }).update({
      numShares,
      realizedProfitLoss: realizedProfitLoss[outcome],
      unrealizedProfitLoss: unrealizedProfitLoss[outcome],
      numSharesAdjustedForUserIntention: positionInMarketAdjustedForUserIntention[outcome],
      averagePrice: averagePrice[outcome],
    }).asCallback(nextOutcome);
  }, callback);
}
