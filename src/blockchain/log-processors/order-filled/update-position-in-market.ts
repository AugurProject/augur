import { forEachOf } from "async";
import * as Knex from "knex";
import { Address, ErrorCallback } from "../../../types";

export function updatePositionInMarket(db: Knex, trx: Knex.Transaction, account: Address, marketID: Address, positionInMarket: Array<string>, realizedProfitLoss: Array<string>, unrealizedProfitLoss: Array<string>, positionInMarketAdjustedForUserIntention: Array<string>, callback: ErrorCallback): void {
  forEachOf(positionInMarket, (numShares: string, outcome: number, nextOutcome: ErrorCallback): void => {
    db("positions").transacting(trx).where({ account, marketID, outcome }).update({
      numShares,
      realizedProfitLoss: realizedProfitLoss[outcome],
      unrealizedProfitLoss: unrealizedProfitLoss[outcome],
      numSharesAdjustedForUserIntention: positionInMarketAdjustedForUserIntention[outcome],
    }).asCallback(nextOutcome);
  }, callback);
}
