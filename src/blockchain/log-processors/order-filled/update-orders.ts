import { Augur } from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { ZERO } from "../../../constants";
import { Address, Bytes32, ErrorCallback, OrderState } from "../../../types";
import { formatOrderAmount } from "../../../utils/format-order";
import { formatBigNumberAsFixed } from "../../../utils/format-big-number-as-fixed";

interface OrderFilledRow {
  fullPrecisionAmount: BigNumber;
  outcome: number;
  price: BigNumber;
}

interface OrderFilledUpdateParams {
  orderState: OrderState,
  price?: BigNumber,
}

function isBestOrder(db: Knex, marketId: Address, outcome: number, price: BigNumber, callback: (err: Error|null, isBest?: boolean) => void) {
  callback(null, true);
}

export function updateOrders(db: Knex, augur: Augur, marketId: Address, orderId: Bytes32, amount: BigNumber, creator: Address, filler: Address, tickSize: BigNumber, callback: ErrorCallback): void {
  db("orders").first("fullPrecisionAmount", "outcome", "price").where({ orderId }).asCallback((err: Error|null, orderRow?: OrderFilledRow): void => {
    if (err) return callback(err);
    if (orderRow == null) return callback(new Error(`Could not fetch order amount for order ${orderId}`));
    const fullPrecisionAmountRemainingInOrder = orderRow.fullPrecisionAmount.minus(amount);
    const amountRemainingInOrder = formatOrderAmount(fullPrecisionAmountRemainingInOrder);
    const updateAmountsParams = { fullPrecisionAmount: fullPrecisionAmountRemainingInOrder, amount: amountRemainingInOrder };
    const orderState = fullPrecisionAmountRemainingInOrder.eq(ZERO) ? OrderState.FILLED : OrderState.OPEN;
    const updateParams: OrderFilledUpdateParams = Object.assign({ orderState }, updateAmountsParams);
    isBestOrder(db, marketId, orderRow.outcome, orderRow.price, (err: Error|null, isBest?: boolean) => {
      if (err) return callback(err);
      if (isBest) {
        updateParams.price = orderRow.price;
      }
      console.log(updateParams);
      db("orders").where({ orderId }).update(formatBigNumberAsFixed(updateParams)).asCallback(callback);
    });
  });
}

