import { Augur, CalculatedProfitLoss } from "augur.js";
import { forEachOf } from "async";
import * as Knex from "knex";
import { Address, Int256, PositionsRow, AsyncCallback, ErrorCallback } from "../../../types";
import { calculateProfitLossInOutcome } from "./calculate-profit-loss-in-outcome";
import { insertPositionInMarket } from "./insert-position-in-market";
import { updatePositionInMarket } from "./update-position-in-market";
import { convertFixedPointToDecimal } from "../../../utils/convert-fixed-point-to-decimal";

export function upsertPositionInMarket(db: Knex, augur: Augur, trx: Knex.Transaction, account: Address, marketID: Address, numTicks: string|number, positionInMarket: Array<string>, callback: ErrorCallback): void {
  trx.select("outcome").from("positions").where({ account, marketID }).asCallback((err: Error|null, positionsRows?: Array<PositionsRow>): void => {
    if (err) return callback(err);
    const numOutcomes = positionInMarket.length;
    const realizedProfitLoss = new Array(numOutcomes);
    const unrealizedProfitLoss = new Array(numOutcomes);
    const positionInMarketAdjustedForUserIntention = new Array(numOutcomes);
    forEachOf(positionInMarket, (numShares: string, outcome: number, nextOutcome: AsyncCallback): void => {
      augur.api.Orders.getLastOutcomePrice({ _market: marketID, _outcome: outcome }, (err: Error|null, lastOutcomePrice: Int256): void => {
        if (err) return callback(err);
        const price = convertFixedPointToDecimal(lastOutcomePrice, numTicks);
        db("outcomes").transacting(trx).where({ marketID, outcome }).update({ price }).asCallback((err: Error|null): void => {
          if (err) return callback(err);
          calculateProfitLossInOutcome(augur, trx, account, marketID, outcome, (err: Error|null, profitLossInOutcome?: CalculatedProfitLoss): void => {
            if (err) return nextOutcome(err);
            const { realized, unrealized, position } = profitLossInOutcome!;
            realizedProfitLoss[outcome] = realized;
            unrealizedProfitLoss[outcome] = unrealized;
            positionInMarketAdjustedForUserIntention[outcome] = position;
            nextOutcome();
          });
        });
      });
    }, (err: Error|null): void => {
      if (err) return callback(err);
      (!positionsRows!.length ? insertPositionInMarket : updatePositionInMarket)(db, trx, account, marketID, positionInMarket, realizedProfitLoss, unrealizedProfitLoss, positionInMarketAdjustedForUserIntention, callback);
    });
  });
}
