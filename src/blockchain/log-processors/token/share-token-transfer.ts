import { Augur } from "augur.js";
import { parallel } from "async";
import * as Knex from "knex";
import { Address, ErrorCallback, AsyncCallback } from "../../../types";
import { refreshPositionInMarket } from "../order-filled/refresh-position-in-market";

export function updateShareTokenTransfer(db: Knex, augur: Augur, marketId: Address, from: Address, to: Address, callback: ErrorCallback): void {
  parallel([
    (next: AsyncCallback): void => refreshPositionInMarket(db, augur, marketId, from, next),
    (next: AsyncCallback): void => refreshPositionInMarket(db, augur, marketId, to, next),
  ], callback);
}
