import { Augur } from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { ZERO } from "../../../constants";
import { Address, Bytes32, ErrorCallback, OrderState } from "../../../types";
import { formatOrderAmount } from "../../../utils/format-order";
import { formatBigNumberAsFixed } from "../../../utils/format-big-number-as-fixed";

interface OrderFilledOnContractData {
  amount: { fullPrecisionAmount?: BigNumber };
}

export function updateOrders(db: Knex, augur: Augur, marketId: Address, orderId: Bytes32, amount: BigNumber, creator: Address, filler: Address, tickSize: BigNumber, callback: ErrorCallback): void {
  // If the user is taking their own order we don't refresh twice
  db("orders").first("fullPrecisionAmount").where({ orderId }).asCallback((err: Error|null, onContractData: OrderFilledOnContractData): void => {
    if (err) return callback(err);
    if (onContractData.amount.fullPrecisionAmount == null) return callback(new Error(`Could not fetch order amount for order ${orderId}`));
    const fullPrecisionAmountRemainingInOrder = onContractData.amount.fullPrecisionAmount.minus(amount);
    const amountRemainingInOrder = formatOrderAmount(fullPrecisionAmountRemainingInOrder);
    const updateAmountsParams = { fullPrecisionAmount: fullPrecisionAmountRemainingInOrder, amount: amountRemainingInOrder };
    const orderState = fullPrecisionAmountRemainingInOrder.eq(ZERO) ? OrderState.FILLED : OrderState.OPEN;
    const updateParams = Object.assign({ orderState }, updateAmountsParams);
    db("orders").where({ orderId }).update(formatBigNumberAsFixed(updateParams)).asCallback(callback);
  });
}
