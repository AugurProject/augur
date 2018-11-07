import Augur from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { Bytes32, FormattedEventLog, OrderState } from "../../types";
import { augurEmitter } from "../../events";
import { SubscriptionEventNames } from "../../constants";
import { updateOutcomeValueFromOrders, removeOutcomeValue } from "./profit-loss/update-outcome-value";
import { updateProfitLossNumEscrowed, updateProfitLossRemoveRow } from "./profit-loss/update-profit-loss";

interface MarketIDAndOutcomeAndPrice {
  marketId: Bytes32;
  outcome: number;
  price: BigNumber,
  orderType: string|number;
  orderCreator: string;
  sharesEscrowed: BigNumber
}

interface MarketNumOutcomes {
  numOutcomes: number;
}

export async function processOrderCanceledLog(db: Knex, augur: Augur, log: FormattedEventLog) {
  const orderTypeLabel = log.orderType === "0" ? "buy" : "sell";
  await db.from("orders").where("orderId", log.orderId).update({ orderState: OrderState.CANCELED });
  await  db.into("orders_canceled").insert({ orderId: log.orderId, transactionHash: log.transactionHash, logIndex: log.logIndex, blockNumber: log.blockNumber });
  const ordersRow: MarketIDAndOutcomeAndPrice = await  db.first("marketId", "outcome", "price", "sharesEscrowed", "orderCreator").from("orders").where("orderId", log.orderId);
  await updateOutcomeValueFromOrders(db, ordersRow.marketId, ordersRow.outcome, log.transactionHash);

  if (ordersRow.sharesEscrowed.eq(0)) return;

  const marketNumOutcomes: MarketNumOutcomes = await db.first("numOutcomes").from("markets").where({ marketId: ordersRow.marketId });
  const numOutcomes = marketNumOutcomes.numOutcomes;
  const otherOutcomes = Array.from(Array(numOutcomes).keys())
  otherOutcomes.splice(ordersRow.outcome, 1);
  const outcomes = orderTypeLabel == "buy" ? otherOutcomes : [ordersRow.outcome];
  await updateProfitLossNumEscrowed(db, ordersRow.marketId, ordersRow.sharesEscrowed.negated(), ordersRow.orderCreator, outcomes, log.transactionHash);

  ordersRow.orderType = orderTypeLabel;
  augurEmitter.emit(SubscriptionEventNames.OrderCanceled, Object.assign({}, log, ordersRow));
}

export async function processOrderCanceledLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog) {
  const orderTypeLabel = log.orderType === "0" ? "buy" : "sell";
  await db.from("orders").where("orderId", log.orderId).update({ orderState: OrderState.OPEN });
  await db.from("orders_canceled").where("orderId", log.orderId).delete();
  const ordersRow: MarketIDAndOutcomeAndPrice = await db.first("marketId", "outcome", "price").from("orders").where("orderId", log.orderId);
  removeOutcomeValue(db, log.transactionHash);
  if (ordersRow) ordersRow.orderType = orderTypeLabel;
  await updateProfitLossRemoveRow(db, log.transactionHash);
  augurEmitter.emit(SubscriptionEventNames.OrderCanceled, Object.assign({}, log, ordersRow));
}
