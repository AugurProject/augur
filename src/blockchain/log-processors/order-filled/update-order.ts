import { Augur } from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { ZERO } from "../../../constants";
import { Address, Bytes32, Int256, OrderState } from "../../../types";
import { formatOrderAmount } from "../../../utils/format-order";
import { formatBigNumberAsFixed } from "../../../utils/format-big-number-as-fixed";

interface OrderFilledRow {
  fullPrecisionAmount: BigNumber;
  outcome: number;
  price: BigNumber;
}

export async function updateOrder(db: Knex, augur: Augur, marketId: Address, orderId: Bytes32, amount: BigNumber, creator: Address, filler: Address, tickSize: BigNumber, minPrice: BigNumber) {
  const orderRow: OrderFilledRow = await db("orders").first("fullPrecisionAmount", "outcome", "price").where({ orderId });
  if (orderRow == null) throw new Error(`Could not fetch order amount for order ${orderId}`);
  const fullPrecisionAmountRemainingInOrder = orderRow.fullPrecisionAmount.minus(amount);
  const amountRemainingInOrder = formatOrderAmount(fullPrecisionAmountRemainingInOrder);
  const updateAmountsParams = { fullPrecisionAmount: fullPrecisionAmountRemainingInOrder, amount: amountRemainingInOrder };
  const orderState = fullPrecisionAmountRemainingInOrder.eq(ZERO) ? OrderState.FILLED : OrderState.OPEN;
  const updateParams = Object.assign({ orderState }, updateAmountsParams);
  const lastOutcomePrice: Int256 = await augur.api.Orders.getLastOutcomePrice({ _market: marketId, _outcome: orderRow.outcome });
  const lastOutcomePriceBN = new BigNumber(lastOutcomePrice, 10);
  const lastOutcomeDisplayPrice = augur.utils.convertOnChainPriceToDisplayPrice(lastOutcomePriceBN, minPrice, tickSize).toString();
  await db("outcomes").where({ marketId, outcome: orderRow.outcome }).update({ price: lastOutcomeDisplayPrice });
  await db("orders").where({ orderId }).update(formatBigNumberAsFixed(updateParams));
}
