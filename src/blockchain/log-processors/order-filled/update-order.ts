import { Augur } from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { ZERO } from "../../../constants";
import { Address, Bytes32, ErrorCallback, Int256, OrderState } from "../../../types";
import { formatOrderAmount } from "../../../utils/format-order";
import { formatBigNumberAsFixed } from "../../../utils/format-big-number-as-fixed";

interface OrderFilledRow {
  fullPrecisionAmount: BigNumber;
  outcome: number;
  price: BigNumber;
}

export function updateOrder(db: Knex, augur: Augur, marketId: Address, orderId: Bytes32, amount: BigNumber, creator: Address, filler: Address, tickSize: BigNumber, minPrice: BigNumber, callback: ErrorCallback): void {
  db("orders").first("fullPrecisionAmount", "outcome", "price").where({ orderId }).asCallback((err: Error|null, orderRow?: OrderFilledRow): void => {
    if (err) return callback(err);
    if (orderRow == null) return callback(new Error(`Could not fetch order amount for order ${orderId}`));
    const fullPrecisionAmountRemainingInOrder = orderRow.fullPrecisionAmount.minus(amount);
    const amountRemainingInOrder = formatOrderAmount(fullPrecisionAmountRemainingInOrder);
    const updateAmountsParams = { fullPrecisionAmount: fullPrecisionAmountRemainingInOrder, amount: amountRemainingInOrder };
    const orderState = fullPrecisionAmountRemainingInOrder.eq(ZERO) ? OrderState.FILLED : OrderState.OPEN;
    const updateParams = Object.assign({ orderState }, updateAmountsParams);
    augur.api.Orders.getLastOutcomePrice({ _market: marketId, _outcome: orderRow.outcome }, (err: Error|null, lastOutcomePrice: Int256): void => {
      if (err) return callback(err);
      const lastOutcomePriceBN = new BigNumber(lastOutcomePrice, 10);
      const lastOutcomeDisplayPrice =  augur.utils.convertOnChainPriceToDisplayPrice(lastOutcomePriceBN, minPrice, tickSize).toFixed();
      db("outcomes").where({marketId, outcome: orderRow.outcome}).update({price: lastOutcomeDisplayPrice}).asCallback((err) => {
        if (err) return callback(err);
        db("orders").where({ orderId }).update(formatBigNumberAsFixed(updateParams)).asCallback(callback);
      });
    });
  });
}
