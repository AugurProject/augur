import { Augur } from "augur.js";
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { Address, Bytes32, TradesRow, ErrorCallback } from "../../../types";
import { calculateFillPrice } from "./calculate-fill-price";
import { calculateNumberOfSharesTraded } from "./calculate-number-of-shares-traded";

export function updateVolumetrics(db: Knex, augur: Augur, category: string, marketId: Address, outcome: number, blockNumber: number, orderId: Bytes32, orderCreator: Address, tickSize: string, minPrice: string|number, maxPrice: string|number, isIncrease: boolean, callback: ErrorCallback): void {
  augur.api.Market.getShareToken({ _outcome: outcome, tx: { to: marketId } }, (err: Error|null, shareToken: Address): void => {
    if (err) return callback(err);
    const shareTokenPayload = { tx: { to: shareToken } };
    augur.api.ShareToken.totalSupply(shareTokenPayload, (err: Error|null, sharesOutstanding?: any): void => {
      if (err) return callback(err);
      db("markets").where({ marketId }).update({ sharesOutstanding: augur.utils.convertOnChainAmountToDisplayAmount(new BigNumber(sharesOutstanding, 10), new BigNumber(tickSize, 10)).toFixed() }).asCallback((err: Error|null): void => {
        if (err) return callback(err);
        db.first("numCreatorShares", "numCreatorTokens", "price", "orderType").from("trades").where({ marketId, outcome, orderId, blockNumber }).asCallback((err: Error|null, tradesRow?: Partial<TradesRow>): void => {
          if (err) return callback(err);
          if (!tradesRow) return callback(new Error("trade not found"));
          const { numCreatorShares, numCreatorTokens, price, orderType } = tradesRow;
          let amount = new BigNumber(calculateNumberOfSharesTraded(numCreatorShares!, numCreatorTokens!, calculateFillPrice(augur, price!, minPrice, maxPrice, orderType!)), 10);
          if (isIncrease !== true) amount = amount.neg();
          db.raw(`UPDATE markets SET volume = volume + :amount WHERE "marketId" = :marketId`, { amount: amount.toFixed(), marketId }).asCallback((err: Error|null): void => {
            if (err) return callback(err);
            db.raw(`UPDATE outcomes SET volume = volume + :amount WHERE "marketId" = :marketId AND outcome = :outcome`, { amount: amount.toFixed(), marketId, outcome }).asCallback((err: Error|null): void => {
              if (err) return callback(err);
              db.raw(`UPDATE categories SET popularity = popularity + :amount WHERE category = :category`, { amount: amount.toFixed(), category }).asCallback((err: Error|null): void => {
                if (err) return callback(err);
                callback(null);
              });
            });
          });
        });
      });
    });
  });
}
