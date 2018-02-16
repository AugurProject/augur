import { Augur } from "augur.js";
import { parallel } from "async";
import * as Knex from "knex";
import { Address, FormattedEventLog, MarketsRow, ErrorCallback, AsyncCallback } from "../../../types";
import { augurEmitter } from "../../../events";
import { upsertPositionInMarket } from "../order-filled/upsert-position-in-market";
import { convertNumTicksToTickSize } from "../../../utils/convert-fixed-point-to-decimal";

interface ShareTokenTransferData {
    fromPositionInMarket: Array<string>;
    toPositionInMarket: Array<string>;
  }

export function updateShareTokenTransfer(db: Knex, augur: Augur, trx: Knex.Transaction, marketID: Address, from: Address, to: Address, callback: ErrorCallback): void {
  trx.first("minPrice", "maxPrice", "numTicks", "category").from("markets").where({ marketID }).asCallback((err: Error|null, marketsRow?: Partial<MarketsRow>): void => {
    if (err) return callback(err);
    if (!marketsRow) return callback(new Error("market min price, max price, and/or num ticks not found"));
    const minPrice = marketsRow.minPrice!;
    const maxPrice = marketsRow.maxPrice!;
    const numTicks = marketsRow.numTicks!;
    const tickSize = convertNumTicksToTickSize(numTicks, minPrice, maxPrice);
    parallel({
        fromPositionInMarket: (next: AsyncCallback): void => augur.trading.getPositionInMarket({ market: marketID, address: from, tickSize }, next),
        toPositionInMarket: (next: AsyncCallback): void => augur.trading.getPositionInMarket({ market: marketID, address: to, tickSize }, next),
      }, (err: Error|null, transferData: ShareTokenTransferData): void => {
        if (err) return callback(err);
        const { fromPositionInMarket, toPositionInMarket } = transferData!;
        parallel([
            (next: AsyncCallback): void => upsertPositionInMarket(db, augur, trx, from, marketID, numTicks, fromPositionInMarket, next),
            (next: AsyncCallback): void => upsertPositionInMarket(db, augur, trx, to, marketID, numTicks, toPositionInMarket, next),
          ], callback);
      });
  });
}