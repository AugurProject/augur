import * as Knex from "knex";
import { formatBigNumberAsFixed } from "../../../utils/format-big-number-as-fixed";
import { Address, PositionsRow, ErrorCallback } from "../../../types";

export function insertPositionInMarket(db: Knex, account: Address, marketId: Address, positionInMarket: Array<string>, realizedProfitLoss: Array<string>, unrealizedProfitLoss: Array<string>, positionInMarketAdjustedForUserIntention: Array<string>, averagePrice: Array<string>, callback: ErrorCallback): void {
  db.batchInsert("positions", positionInMarket.map((numShares: string, outcome: number): PositionsRow<string> => formatBigNumberAsFixed({
    account,
    marketId,
    outcome,
    numShares,
    realizedProfitLoss: realizedProfitLoss[outcome],
    unrealizedProfitLoss: unrealizedProfitLoss[outcome],
    numSharesAdjustedForUserIntention: positionInMarketAdjustedForUserIntention[outcome],
    averagePrice: averagePrice[outcome],
  })), 1000).asCallback(callback);
}
