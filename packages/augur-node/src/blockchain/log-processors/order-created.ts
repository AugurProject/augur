import Augur, { ApiFunction } from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { Address, FormattedEventLog, MarketsRow, OrdersRow, TokensRow, OrderState } from "../../types";
import { augurEmitter } from "../../events";
import { fixedPointToDecimal, numTicksToTickSize } from "../../utils/convert-fixed-point-to-decimal";
import { formatOrderAmount, formatOrderPrice } from "../../utils/format-order";
import { BN_WEI_PER_ETHER, SubscriptionEventNames } from "../../constants";
import { QueryBuilder } from "knex";

export async function processOrderCreatedLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    const amount: BigNumber = new BigNumber(log.amount, 10);
    const price: BigNumber = new BigNumber(log.price, 10);
    const orderType: string = log.orderType;
    const moneyEscrowed: BigNumber = new BigNumber(log.moneyEscrowed, 10);
    const sharesEscrowed: BigNumber = new BigNumber(log.sharesEscrowed, 10);
    const shareToken: Address = log.shareToken;
    const tokensRow: TokensRow|undefined = await db.first("marketId", "outcome").from("tokens").where({ contractAddress: shareToken });
    if (!tokensRow) throw new Error(`ORDER CREATED: market and outcome not found for shareToken ${shareToken} (${log.transactionHash}`);
    const marketId = tokensRow.marketId;
    const outcome = tokensRow.outcome!;
    const marketsRow: MarketsRow<BigNumber> = await db.first("minPrice", "maxPrice", "numTicks").from("markets").where({ marketId });
    if (!marketsRow) throw new Error(`market min price, max price, and/or num ticks not found for market: ${marketId} (${log.transactionHash}`);
    const minPrice = marketsRow.minPrice!;
    const maxPrice = marketsRow.maxPrice!;
    const numTicks = marketsRow.numTicks!;
    const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
    const fullPrecisionAmount = augur.utils.convertOnChainAmountToDisplayAmount(amount, tickSize);
    const fullPrecisionPrice = augur.utils.convertOnChainPriceToDisplayPrice(price, minPrice, tickSize);
    const orderTypeLabel = orderType === "0" ? "buy" : "sell";
    const orderData: OrdersRow<string> = {
      marketId,
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash,
      logIndex: log.logIndex,
      outcome,
      shareToken,
      orderCreator: log.creator,
      orderState: OrderState.OPEN,
      tradeGroupId: log.tradeGroupId,
      orderType: orderTypeLabel,
      price: formatOrderPrice(orderTypeLabel, minPrice, maxPrice, fullPrecisionPrice),
      amount: formatOrderAmount(fullPrecisionAmount),
      originalAmount: formatOrderAmount(fullPrecisionAmount),
      fullPrecisionPrice: fullPrecisionPrice.toString(),
      fullPrecisionAmount: fullPrecisionAmount.toString(),
      originalFullPrecisionAmount: fullPrecisionAmount.toString(),
      tokensEscrowed: fixedPointToDecimal(moneyEscrowed, BN_WEI_PER_ETHER).toString(),
      sharesEscrowed: augur.utils.convertOnChainAmountToDisplayAmount(sharesEscrowed, tickSize).toString(),
    };
    const orderId = { orderId: log.orderId };
    const ordersRows: Array<Partial<OrdersRow<BigNumber>>> = await db.select("marketId").from("orders").where(orderId);
    let upsertOrder: QueryBuilder;
    if (!ordersRows || !ordersRows.length) {
      upsertOrder = db.insert(Object.assign(orderData, orderId)).into("orders");
    } else {
      upsertOrder = db.from("orders").where(orderId).update(orderData);
    }
    await upsertOrder;
    augurEmitter.emit(SubscriptionEventNames.OrderCreated, Object.assign({}, log, orderData));
  };
}

export async function processOrderCreatedLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await db.from("orders").where("orderId", log.orderId).delete();
    augurEmitter.emit(SubscriptionEventNames.OrderCreated, log);
  };
}
