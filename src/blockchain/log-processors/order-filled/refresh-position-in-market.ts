import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { numTicksToTickSize } from "../../../utils/convert-fixed-point-to-decimal";
import { Augur } from "augur.js";
import { Address, MarketsRow } from "../../../types";
import { upsertPositionInMarket } from "./upsert-position-in-market";

export function refreshPositionInMarket(db: Knex, augur: Augur, marketId: Address, account: Address, callback: (err: Error|null, positions?: Array<string>) => void) {
  db.first("minPrice", "maxPrice", "numTicks", "category").from("markets").where({ marketId }).asCallback((err: Error|null, marketsRow?: Partial<MarketsRow<BigNumber>>): void => {
    if (err) return callback(err);
    if (!marketsRow) return callback(new Error("market min price, max price, and/or num ticks not found"));
    const minPrice = marketsRow.minPrice!;
    const maxPrice = marketsRow.maxPrice!;
    const numTicks = marketsRow.numTicks!;
    const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
    augur.trading.getPositionInMarket({
      market: marketId,
      address: account,
      tickSize: tickSize.toFixed(),
    }, (err: Error|null, positions: Array<string>): void => {
      if (err) return callback(err);
      upsertPositionInMarket(db, augur, account, marketId, minPrice, tickSize, positions, (err: Error|null) => {
        if (err) return callback(err);
        callback(err, positions);
      });
    });
  });
}
