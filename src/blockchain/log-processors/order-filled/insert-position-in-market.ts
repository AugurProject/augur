import { Augur } from "augur.js";
import * as Knex from "knex";
import { Address, PositionsRow, ErrorCallback } from "../../../types";

export function insertPositionInMarket(db: Knex, trx: Knex.Transaction, account: Address, marketID: Address, positionInMarket: Array<string>, realizedProfitLoss: Array<string>, unrealizedProfitLoss: Array<string>, positionInMarketAdjustedForUserIntention: Array<string>, callback: ErrorCallback): void {
  db.batchInsert("positions", positionInMarket.map((numShares: string, outcome: number): PositionsRow => ({
    account,
    marketID,
    outcome,
    numShares,
    realizedProfitLoss: realizedProfitLoss[outcome],
    unrealizedProfitLoss: unrealizedProfitLoss[outcome],
    numSharesAdjustedForUserIntention: positionInMarketAdjustedForUserIntention[outcome],
  })), 1000).transacting(trx).asCallback(callback);
}
