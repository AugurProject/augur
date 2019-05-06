import { Address, Augur, BigNumber, FormattedEventLog, MarketsRow, OrdersRow, OrderState, TokensRow } from "../../types";
import Knex from "knex";
import { QueryBuilder } from "knex";
import { augurEmitter } from "../../events";
import { fixedPointToDecimal, numTicksToTickSize } from "../../utils/convert-fixed-point-to-decimal";
import { formatOrderAmount, formatOrderPrice } from "../../utils/format-order";
import { BN_WEI_PER_ETHER, SubscriptionEventNames } from "../../constants";
import { updateProfitLossNumEscrowed, updateProfitLossRemoveRow } from "./profit-loss/update-profit-loss";
import { convertOnChainAmountToDisplayAmount, convertOnChainPriceToDisplayPrice } from "../../utils";

export async function processOrderCreatedLog(augur: Augur, log: FormattedEventLog) {
  return async(db: Knex) => {
    const amount: BigNumber = new BigNumber(log.amount);
    const price: BigNumber = new BigNumber(log.price);
    const orderType: string = log.orderType;
    const moneyEscrowed: BigNumber = new BigNumber(log.moneyEscrowed);
    const sharesEscrowed: BigNumber = new BigNumber(log.sharesEscrowed);
    const shareToken: Address = log.shareToken;
    const tokensRow: TokensRow|undefined = await db.first("marketId", "outcome").from("tokens").where({ contractAddress: shareToken });
    if (!tokensRow) throw new Error(`ORDER CREATED: market and outcome not found for shareToken ${shareToken} (${log.transactionHash}`);
    const marketId = tokensRow.marketId;
    const outcome = tokensRow.outcome!;
    const marketsRow: MarketsRow<BigNumber> = await db.first("minPrice", "maxPrice", "numTicks", "numOutcomes").from("markets").where({ marketId });
    if (!marketsRow) throw new Error(`market not found: ${marketId}`);
    const minPrice = marketsRow.minPrice;
    const maxPrice = marketsRow.maxPrice;
    const numTicks = marketsRow.numTicks;
    const tickSize = numTicksToTickSize(numTicks, minPrice, maxPrice);
    const numOutcomes = marketsRow.numOutcomes;
    const fullPrecisionAmount = convertOnChainAmountToDisplayAmount(amount, tickSize);
    const fullPrecisionPrice = convertOnChainPriceToDisplayPrice(price, minPrice, tickSize);
    const orderTypeLabel = orderType === "0" ? "buy" : "sell";
    const displaySharesEscrowed = convertOnChainAmountToDisplayAmount(sharesEscrowed, tickSize).toString();
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
      sharesEscrowed: displaySharesEscrowed,
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
    await marketPendingOrphanCheck(db, orderData);

    const otherOutcomes = Array.from(Array(numOutcomes).keys());
    otherOutcomes.splice(outcome, 1);
    const outcomes = orderTypeLabel === "buy" ? otherOutcomes : [outcome];

    await updateProfitLossNumEscrowed(db, marketId, displaySharesEscrowed, log.creator, outcomes, log.transactionHash);
    augurEmitter.emit(SubscriptionEventNames.OrderEvent, Object.assign({}, log, orderData));
  };
}

export async function processOrderCreatedLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    await db.from("orders").where("orderId", log.orderId).delete();
    await updateProfitLossRemoveRow(db, log.transactionHash);
    augurEmitter.emit(SubscriptionEventNames.OrderEvent, log);
  };
}

async function marketPendingOrphanCheck(db: Knex, orderData: OrdersRow<string>) {
  const pendingOrderData = {
    marketId: orderData.marketId,
    outcome: orderData.outcome,
    orderType: orderData.orderType,
  };
  const result: { count: number } = await db.first(db.raw("count(*) as count")).from("pending_orphan_checks").where(pendingOrderData);
  if (result.count > 0) return;
  return await db.insert(pendingOrderData).into("pending_orphan_checks");
}
