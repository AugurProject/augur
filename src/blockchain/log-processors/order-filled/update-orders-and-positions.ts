import { Augur } from "augur.js";
import { parallel } from "async";
import * as Knex from "knex";
import { Address, Bytes32, AsyncCallback, ErrorCallback } from "../../../types";
import { upsertPositionInMarket } from "./upsert-position-in-market";
import { convertOnChainSharesToHumanReadableShares } from "../../../utils/convert-fixed-point-to-decimal";
import { formatOrderAmount } from "../../../utils/format-order";
import { refreshPositionInMarket } from "./refresh-position-in-market";

interface OrderFilledOnContractData {
  amount: string;
}

export function updateOrdersAndPositions(db: Knex, augur: Augur, marketID: Address, orderID: Bytes32, creator: Address, filler: Address, numTicks: string|number, tickSize: string, callback: ErrorCallback): void {
  parallel({
    amount: (next: AsyncCallback): void => augur.api.Orders.getAmount({ _orderId: orderID }, next),
    creatorPositionInMarket: (next: AsyncCallback): void => refreshPositionInMarket(db, augur, marketID, creator, next),
    fillerPositionInMarket: (next: AsyncCallback): void => refreshPositionInMarket(db, augur, marketID, filler, next),
  }, (err: Error|null, onContractData: OrderFilledOnContractData): void => {
    if (err) return callback(err);
    const { amount } = onContractData!;
    const fullPrecisionAmountRemainingInOrder = convertOnChainSharesToHumanReadableShares(amount, tickSize);
    const amountRemainingInOrder = formatOrderAmount(fullPrecisionAmountRemainingInOrder);
    const updateAmountsParams = { fullPrecisionAmount: fullPrecisionAmountRemainingInOrder, amount: amountRemainingInOrder };
    const updateParams = fullPrecisionAmountRemainingInOrder === "0" ? Object.assign({}, updateAmountsParams, { isRemoved: 1 }) : updateAmountsParams;
    db("orders").where({ orderID }).update(updateParams).asCallback(callback);
  });
}
