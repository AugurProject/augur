import { Address, Augur, BigNumber, Bytes32, Int256, OrderState } from "../../../types";
import Knex from "knex";
import { ZERO } from "../../../constants";
import { formatOrderAmount } from "../../../utils/format-order";
import { formatBigNumberAsFixed } from "../../../utils/format-big-number-as-fixed";
import { convertOnChainPriceToDisplayPrice } from "../../../utils";

interface OrderFilledRow {
  fullPrecisionAmount: BigNumber;
  sharesEscrowed: BigNumber;
  outcome: number;
  price: BigNumber;
}

export async function updateOrder(db: Knex, augur: Augur, marketId: Address, orderId: Bytes32, amount: BigNumber, creator: Address, filler: Address, tickSize: BigNumber, minPrice: BigNumber) {
  const orders = augur.getOrders()
  const orderRow: OrderFilledRow = await db("orders").first("fullPrecisionAmount", "outcome", "price").where({ orderId });
  if (orderRow == null) throw new Error(`Could not fetch order amount for order ${orderId}`);
  const fullPrecisionAmountRemainingInOrder = orderRow.fullPrecisionAmount.minus(amount);
  const amountRemainingInOrder = formatOrderAmount(fullPrecisionAmountRemainingInOrder);
  const updateAmountsParams = { fullPrecisionAmount: fullPrecisionAmountRemainingInOrder, amount: amountRemainingInOrder };
  const orderState = fullPrecisionAmountRemainingInOrder.eq(ZERO) ? OrderState.FILLED : OrderState.OPEN;
  const updateParams = Object.assign({ orderState }, updateAmountsParams);
  const lastOutcomePrice = await orders.getLastOutcomePrice_(marketId, new BigNumber(orderRow.outcome));
  const lastOutcomeDisplayPrice = convertOnChainPriceToDisplayPrice(lastOutcomePrice, minPrice, tickSize).toString();
  await db("outcomes").where({ marketId, outcome: orderRow.outcome }).update({ price: lastOutcomeDisplayPrice });
  await db("orders").where({ orderId }).update(formatBigNumberAsFixed(updateParams));
}
