import { Augur, CalculatedProfitLoss } from "augur.js";
import { forEachOf } from "async";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { Address, Int256, PositionsRow, AsyncCallback, ErrorCallback } from "../../../types";
import { calculateProfitLossInOutcome } from "./calculate-profit-loss-in-outcome";
import { insertPositionInMarket } from "./insert-position-in-market";
import { updatePositionInMarket } from "./update-position-in-market";

export function upsertPositionInMarket(db: Knex, augur: Augur, account: Address, marketId: Address, minPrice: BigNumber, tickSize: BigNumber, positionInMarket: Array<string>, callback: ErrorCallback): void {
  db.select("outcome").from("positions").where({ account, marketId }).asCallback((err: Error|null, positionsRows?: Array<PositionsRow<BigNumber>>): void => {
    if (err) return callback(err);
    const numOutcomes = positionInMarket.length;
    const realizedProfitLoss = new Array(numOutcomes);
    const unrealizedProfitLoss = new Array(numOutcomes);
    const positionInMarketAdjustedForUserIntention = new Array(numOutcomes);
    const averagePrice = new Array(numOutcomes);
    forEachOf(positionInMarket, (numShares: string, outcome: number, nextOutcome: AsyncCallback): void => {
      augur.api.Orders.getLastOutcomePrice({ _market: marketId, _outcome: outcome }, (err: Error|null, lastOutcomePrice: Int256): void => {
        if (err) return callback(err);
        const lastPrice = new BigNumber(lastOutcomePrice, 10);
        const price = augur.utils.convertOnChainPriceToDisplayPrice(lastPrice, minPrice, tickSize).toFixed();
        db("outcomes").where({ marketId, outcome }).update({ price }).asCallback((err: Error|null): void => {
          if (err) return callback(err);
          calculateProfitLossInOutcome(db, augur, account, marketId, outcome, (err: Error|null, profitLossInOutcome?: CalculatedProfitLoss): void => {
            if (err) return nextOutcome(err);
            const { realized, unrealized, position, meanOpenPrice } = profitLossInOutcome!;
            realizedProfitLoss[outcome] = realized;
            unrealizedProfitLoss[outcome] = unrealized;
            positionInMarketAdjustedForUserIntention[outcome] = position;
            averagePrice[outcome] = meanOpenPrice;
            nextOutcome();
          });
        });
      });
    }, (err: Error|null): void => {
      if (err) return callback(err);
      (!positionsRows!.length ? insertPositionInMarket : updatePositionInMarket)(db, account, marketId, positionInMarket, realizedProfitLoss, unrealizedProfitLoss, positionInMarketAdjustedForUserIntention, averagePrice, callback);
    });
  });
}
