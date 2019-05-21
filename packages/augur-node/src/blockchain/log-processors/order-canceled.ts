import { Augur, BigNumber, Bytes32, FormattedEventLog, OrderState } from "../../types";
import Knex from "knex";

import { augurEmitter } from "../../events";
import { SubscriptionEventNames } from "../../constants";
import { updateProfitLossNumEscrowed, updateProfitLossRemoveRow } from "./profit-loss/update-profit-loss";

interface MarketIDAndOutcomeAndPrice {
  marketId: Bytes32;
  outcome: number;
  price: BigNumber;
  orderType: string|number;
  orderCreator: string;
  sharesEscrowed: BigNumber;
}

interface MarketNumOutcomes {
  numOutcomes: number;
}

export async function processOrderCanceledLog(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    const orderTypeLabel = log.orderType === "0" ? "buy" : "sell";
    await db.from("orders").where("orderId", log.orderId).update({ orderState: OrderState.CANCELED });
    await  db.into("orders_canceled").insert({ orderId: log.orderId, transactionHash: log.transactionHash, logIndex: log.logIndex, blockNumber: log.blockNumber });
    const ordersRow: MarketIDAndOutcomeAndPrice = await  db.first("marketId", "outcome", "price", "sharesEscrowed", "orderCreator").from("orders").where("orderId", log.orderId);

    if (ordersRow.sharesEscrowed.eq(0)) return;

    const marketNumOutcomes: MarketNumOutcomes = await db.first("numOutcomes").from("markets").where({ marketId: ordersRow.marketId });
    const numOutcomes = marketNumOutcomes.numOutcomes;
    const otherOutcomes = Array.from(Array(numOutcomes).keys());
    otherOutcomes.splice(ordersRow.outcome, 1);
    const outcomes = orderTypeLabel === "buy" ? otherOutcomes : [ordersRow.outcome];
    await updateProfitLossNumEscrowed(db, ordersRow.marketId, ordersRow.sharesEscrowed.multipliedBy(new BigNumber(-1)), ordersRow.orderCreator, outcomes, log.transactionHash);

    ordersRow.orderType = orderTypeLabel;
    augurEmitter.emit(SubscriptionEventNames.OrderEvent, Object.assign({}, log, ordersRow));

  };
}

export async function processOrderCanceledLogRemoval(augur: Augur, log: FormattedEventLog) {
  return async (db: Knex) => {
    const orderTypeLabel = log.orderType === "0" ? "buy" : "sell";
    await db.from("orders").where("orderId", log.orderId).update({ orderState: OrderState.OPEN });
    await db.from("orders_canceled").where("orderId", log.orderId).delete();
    const ordersRow: MarketIDAndOutcomeAndPrice = await db.first("marketId", "outcome", "price").from("orders").where("orderId", log.orderId);
    if (ordersRow) ordersRow.orderType = orderTypeLabel;
    await updateProfitLossRemoveRow(db, log.transactionHash);
    augurEmitter.emit(SubscriptionEventNames.OrderEvent, Object.assign({}, log, ordersRow));
  };
}
