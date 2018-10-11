import Augur from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { Bytes32, FormattedEventLog, ErrorCallback, OrderState } from "../../types";
import { augurEmitter } from "../../events";
import { SubscriptionEventNames } from "../../constants";
import { updateOutcomeValueFromOrders, removeOutcomeValue } from "./profit-loss/update-outcome-value";
import { updateProfitLossNumEscrowed, updateProfitLossRemoveRow } from "./profit-loss/update-profit-loss";

interface MarketIDAndOutcomeAndPrice {
  marketId: Bytes32;
  outcome: number;
  price: string|number;
  orderType: string|number;
  orderCreator: string;
  sharesEscrowed: string|number;
}

interface MarketNumOutcomes {
  numOutcomes: number;
}

export function processOrderCanceledLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const orderTypeLabel = log.orderType === "0" ? "buy" : "sell";
  db.from("orders").where("orderId", log.orderId).update({ orderState: OrderState.CANCELED }).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    db.into("orders_canceled").insert({ orderId: log.orderId, transactionHash: log.transactionHash, logIndex: log.logIndex, blockNumber: log.blockNumber }).asCallback((err: Error|null): void => {
      if (err) return callback(err);
      db.first("marketId", "outcome", "price", "sharesEscrowed", "orderCreator").from("orders").where("orderId", log.orderId).asCallback((err: Error|null, ordersRow: MarketIDAndOutcomeAndPrice): void => {
        if (err) return callback(err);
        updateOutcomeValueFromOrders(db, ordersRow.marketId, ordersRow.outcome, log.transactionHash, (err: Error) => {
          if (err) return callback(err);
          const sharesEscrowed = new BigNumber(ordersRow.sharesEscrowed);
          if (sharesEscrowed.eq(0)) return callback(null);
          db.first("numOutcomes").from("markets").where({ marketId: ordersRow.marketId }).asCallback((err: Error, marketNumOutcomes: MarketNumOutcomes) => {
            if (err) return callback(err);
            const numOutcomes = marketNumOutcomes.numOutcomes;
            const otherOutcomes = Array.from(Array(numOutcomes).keys())
            otherOutcomes.splice(ordersRow.outcome, 1);
            const outcomes = orderTypeLabel == "buy" ? otherOutcomes : [ordersRow.outcome];
            updateProfitLossNumEscrowed(db, ordersRow.marketId, sharesEscrowed.negated(), ordersRow.orderCreator, outcomes, log.transactionHash, (err: Error) => {
              if (err) return callback(err);
              ordersRow.orderType = orderTypeLabel;
              augurEmitter.emit(SubscriptionEventNames.OrderCanceled, Object.assign({}, log, ordersRow));
              return callback(null);
            });
          });
        });
      });
    });
  });
}

export function processOrderCanceledLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const orderTypeLabel = log.orderType === "0" ? "buy" : "sell";
  db.from("orders").where("orderId", log.orderId).update({ orderState: OrderState.OPEN }).asCallback((err: Error|null): void => {
    if (err) return callback(err);
    db.from("orders_canceled").where("orderId", log.orderId).delete().asCallback((err: Error|null): void => {
      if (err) return callback(err);
      db.first("marketId", "outcome", "price").from("orders").where("orderId", log.orderId).asCallback((err: Error|null, ordersRow?: MarketIDAndOutcomeAndPrice): void => {
        if (err) return callback(err);
        removeOutcomeValue(db, log.transactionHash, (err: Error|null): void => {
          if (err) return callback(err);
          if (ordersRow) ordersRow.orderType = orderTypeLabel;
          updateProfitLossRemoveRow(db, log.transactionHash, (err: Error) => {
            if (err) return callback(err);
            augurEmitter.emit(SubscriptionEventNames.OrderCanceled, Object.assign({}, log, ordersRow));
            return callback(null);
          })
        });
      });
    });
  });
}
