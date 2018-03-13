import BigNumber from "bignumber.js";
import { Augur } from "augur.js";
import { parallel } from "async";
import * as Knex from "knex";
import { Address, Bytes32, AsyncCallback, ErrorCallback } from "../../../types";
import { formatOrderAmount } from "../../../utils/format-order";
import { refreshPositionInMarket } from "./refresh-position-in-market";

interface OrderFilledOnContractData {
  amount: string;
}

export function updateOrdersAndPositions(db: Knex, augur: Augur, marketId: Address, orderId: Bytes32, creator: Address, filler: Address, numTicks: string|number, tickSize: string, callback: ErrorCallback): void {
  parallel({
    amount: (next: AsyncCallback): void => augur.api.Orders.getAmount({ _orderId: orderId }, next),
    creatorPositionInMarket: (next: AsyncCallback): void => refreshPositionInMarket(db, augur, marketId, creator, next),
    fillerPositionInMarket: (next: AsyncCallback): void => refreshPositionInMarket(db, augur, marketId, filler, next),
  }, (err: Error|null, onContractData: OrderFilledOnContractData): void => {
    if (err) return callback(err);
    const { amount } = onContractData!;
    const fullPrecisionAmountRemainingInOrder = augur.utils.convertOnChainAmountToDisplayAmount(new BigNumber(amount, 10), new BigNumber(tickSize, 10)).toFixed();
    const amountRemainingInOrder = formatOrderAmount(fullPrecisionAmountRemainingInOrder);
    const updateAmountsParams = { fullPrecisionAmount: fullPrecisionAmountRemainingInOrder, amount: amountRemainingInOrder };
    const updateParams = fullPrecisionAmountRemainingInOrder === "0" ? Object.assign({}, updateAmountsParams, { isRemoved: 1 }) : updateAmountsParams;
    db("orders").where({ orderId }).update(updateParams).asCallback(callback);
  });
}
