import { Augur } from "augur.js";
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { Address, Bytes32, TradesRow, ErrorCallback } from "../../../types";
import { calculateFillPrice } from "./calculate-fill-price";
import { calculateNumberOfSharesTraded } from "./calculate-number-of-shares-traded";
import { convertFixedPointToDecimal, convertOnChainSharesToHumanReadableShares } from "../../../utils/convert-fixed-point-to-decimal";

export function updateVolumetrics(db: Knex, augur: Augur, trx: Knex.Transaction, category: string, marketID: Address, outcome: number, blockNumber: number, orderID: Bytes32, orderCreator: Address, tickSize: string, minPrice: string|number, maxPrice: string|number, isIncrease: boolean, callback: ErrorCallback): void {
  augur.api.Market.getShareToken({ _outcome: outcome, tx: { to: marketID } }, (err: Error|null, shareToken: Address): void => {
    if (err) return callback(err);
    const shareTokenPayload = { tx: { to: shareToken } };
    augur.api.ShareToken.totalSupply(shareTokenPayload, (err: Error|null, sharesOutstanding?: any): void => {
      if (err) return callback(err);
      db("markets").transacting(trx).where({ marketID }).update({ sharesOutstanding: convertOnChainSharesToHumanReadableShares(sharesOutstanding, tickSize) }).asCallback((err: Error|null): void => {
        if (err) return callback(err);
        trx.first("numCreatorShares", "numCreatorTokens", "price", "orderType").from("trades").where({ marketID, outcome, orderID, blockNumber }).asCallback((err: Error|null, tradesRow?: Partial<TradesRow>): void => {
          if (err) return callback(err);
          if (!tradesRow) return callback(new Error("trade not found"));
          const { numCreatorShares, numCreatorTokens, price, orderType } = tradesRow;
          let amount = new BigNumber(calculateNumberOfSharesTraded(numCreatorShares!, numCreatorTokens!, calculateFillPrice(augur, price!, minPrice, maxPrice, orderType!)), 10);
          if (isIncrease !== true) amount = amount.neg();
          trx.raw(`UPDATE markets SET volume = volume + :amount WHERE "marketID" = :marketID`, { amount: amount.toFixed(), marketID }).asCallback((err: Error|null): void => {
            if (err) return callback(err);
            trx.raw(`UPDATE outcomes SET volume = volume + :amount WHERE "marketID" = :marketID AND outcome = :outcome`, { amount: amount.toFixed(), marketID, outcome }).asCallback((err: Error|null): void => {
              if (err) return callback(err);
              trx.raw(`UPDATE categories SET popularity = popularity + :amount WHERE category = :category`, { amount: amount.toFixed(), category }).asCallback((err: Error|null): void => {
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
