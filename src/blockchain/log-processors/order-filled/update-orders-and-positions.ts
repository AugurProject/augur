import { Augur } from "augur.js";
import { parallel } from "async";
import * as Knex from "knex";
import { Address, Bytes32, AsyncCallback, ErrorCallback } from "../../../types";
import { upsertPositionInMarket } from "./upsert-position-in-market";
import { convertFixedPointToDecimal } from "../../../utils/convert-fixed-point-to-decimal";

interface OrderFilledOnContractData {
  amount: string;
  creatorPositionInMarket: Array<string>;
  fillerPositionInMarket: Array<string>;
}

export function updateOrdersAndPositions(db: Knex, augur: Augur, trx: Knex.Transaction, marketID: Address, orderID: Bytes32, creator: Address, filler: Address, numTicks: string|number, callback: ErrorCallback): void {
  parallel({
    amount: (next: AsyncCallback): void => augur.api.Orders.getAmount({ _orderId: orderID }, next),
    creatorPositionInMarket: (next: AsyncCallback): void => augur.trading.getPositionInMarket({ market: marketID, address: creator }, next),
    fillerPositionInMarket: (next: AsyncCallback): void => augur.trading.getPositionInMarket({ market: marketID, address: filler }, next),
  }, (err: Error|null, onContractData: OrderFilledOnContractData): void => {
    if (err) return callback(err);
    const { amount, creatorPositionInMarket, fillerPositionInMarket } = onContractData!;
    const amountRemainingInOrder = convertFixedPointToDecimal(amount, numTicks);
    const updateParams = amountRemainingInOrder === "0" ? { amount: amountRemainingInOrder, isRemoved: 1 } : { amount: amountRemainingInOrder };
    db("orders").transacting(trx).where({ orderID }).update(updateParams).asCallback((err: Error|null): void => {
      if (err) return callback(err);
      parallel([
        (next: AsyncCallback): void => upsertPositionInMarket(db, augur, trx, creator, marketID, numTicks, creatorPositionInMarket, next),
        (next: AsyncCallback): void => upsertPositionInMarket(db, augur, trx, filler, marketID, numTicks, fillerPositionInMarket, next),
      ], callback);
    });
  });
}
