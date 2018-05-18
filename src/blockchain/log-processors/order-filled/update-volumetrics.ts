import { Augur } from "augur.js";
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { parallel } from "async";

import { Address, Bytes32, TradesRow, ErrorCallback, GenericCallback } from "../../../types";
import { calculateFillPrice } from "./calculate-fill-price";
import { calculateNumberOfSharesTraded } from "./calculate-number-of-shares-traded";

function incrementMarketVolume(db: Knex, marketId: Address, amount: BigNumber, callback: GenericCallback<BigNumber> ) {
  db("markets").first("volume").where({ marketId }).asCallback((err: Error|null, result: {volume: BigNumber}) => {
    if (err) return callback(err);

    const volume = result.volume;
    const incremented = amount.plus(volume);
    db("markets").update({ volume: incremented.toString() }).where({ marketId, volume: volume.toString() }).asCallback((err: Error|null, affectedRowsCount: number) => {
      if (err) return callback(err);
      if (affectedRowsCount === 0) return process.nextTick(() => incrementMarketVolume(db, marketId, amount, callback));

      callback(null, incremented);
    });
  });
}

function incrementOutcomeVolume(db: Knex, marketId: Address, outcome: number, amount: BigNumber, callback: GenericCallback<BigNumber> ) {
  db("outcomes").first("volume").where({ marketId, outcome }).asCallback((err: Error|null, result: {volume: BigNumber}) => {
    if (err) return callback(err);

    const volume = result.volume;
    const incremented = amount.plus(volume);
    db("outcomes").update({ volume: incremented.toString() }).where({ marketId, outcome, volume: volume.toString() }).asCallback((err: Error|null, affectedRowsCount: number) => {
      if (err) return callback(err);
      if (affectedRowsCount === 0) return process.nextTick(() => incrementOutcomeVolume(db, marketId, outcome, amount, callback));

      callback(null, incremented);
    });
  });
}

function incrementCategoryPopularity(db: Knex, category: string, amount: BigNumber, callback: ErrorCallback) {
  db.raw(`UPDATE categories SET popularity = popularity + :amount WHERE category = :category`, { amount: amount.toFixed(), category }).asCallback(callback);
}

export function updateVolumetrics(db: Knex, augur: Augur, category: string, marketId: Address, outcome: number, blockNumber: number, orderId: Bytes32, orderCreator: Address, tickSize: BigNumber, minPrice: BigNumber, maxPrice: BigNumber, isIncrease: boolean, callback: ErrorCallback): void {
  augur.api.Market.getShareToken({ _outcome: outcome, tx: { to: marketId } }, (err: Error|null, shareToken: Address): void => {
    if (err) return callback(err);
    const shareTokenPayload = { tx: { to: shareToken } };
    augur.api.ShareToken.totalSupply(shareTokenPayload, (err: Error|null, sharesOutstanding: string): void => {
      if (err) return callback(err);
      db("markets").where({ marketId }).update({ sharesOutstanding: augur.utils.convertOnChainAmountToDisplayAmount(new BigNumber(sharesOutstanding, 10), tickSize).toFixed() }).asCallback((err: Error|null): void => {
        if (err) return callback(err);
        db.first("numCreatorShares", "numCreatorTokens", "price", "orderType").from("trades").where({ marketId, outcome, orderId, blockNumber }).asCallback((err: Error|null, tradesRow?: Partial<TradesRow<BigNumber>>): void => {
          if (err) return callback(err);
          if (!tradesRow) return callback(new Error("trade not found"));
          const { numCreatorShares, numCreatorTokens, price, orderType } = tradesRow;
          let amount = calculateNumberOfSharesTraded(numCreatorShares!, numCreatorTokens!, calculateFillPrice(augur, price!, minPrice, maxPrice, orderType!));
          if (!isIncrease) amount = amount.negated();

          parallel({
            market: (next) => incrementMarketVolume(db, marketId, amount, next),
            outcome: (next) => incrementOutcomeVolume(db, marketId, outcome, amount, next),
            category: (next) => incrementCategoryPopularity(db, category, amount, next),
          }, callback);
        });
      });
    });
  });
}
