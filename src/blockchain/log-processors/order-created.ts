import Augur from "augur.js";
import { parallel } from "async";
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { Address, Bytes32, FormattedEventLog, OrdersRow, OrderState, ErrorCallback, AsyncCallback } from "../../types";
import { processOrderCanceledLog } from "./order-canceled";
import { augurEmitter } from "../../events";
import { convertFixedPointToDecimal } from "../../utils/convert-fixed-point-to-decimal";
import { denormalizePrice } from "../../utils/denormalize-price";
import { formatOrderAmount, formatOrderPrice } from "../../utils/format-order";
import { WEI_PER_ETHER } from "../../constants";

interface BlocksRow {
  timestamp: number;
}

interface TokensRow {
  marketID: Address;
  outcome: number;
}

interface MarketsRow {
  minPrice: string|number;
  maxPrice: string|number;
  numTicks: string|number;
}

interface OrderCreatedOnContractData {
  orderType: string;
  price: string;
  amount: string;
  sharesEscrowed: string;
  moneyEscrowed: string;
  creator: Address;
  betterOrderID: Bytes32;
  worseOrderID: Bytes32;
}

export function processOrderCreatedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  trx.select(["marketID", "outcome"]).from("tokens").where({ contractAddress: log.shareToken }).asCallback((err: Error|null, tokensRows?: Array<TokensRow>): void => {
    if (err) return callback(err);
    if (!tokensRows || !tokensRows.length) return callback(new Error("market and outcome not found"));
    const { marketID, outcome } = tokensRows[0];
    trx.select(["minPrice", "maxPrice", "numTicks"]).from("markets").where({ marketID }).asCallback((err: Error|null, marketsRows?: Array<MarketsRow>): void => {
      if (err) return callback(err);
      if (!marketsRows || !marketsRows.length) return callback(new Error("market min price, max price, and/or num ticks not found"));
      const { minPrice, maxPrice, numTicks } = marketsRows[0];
      const ordersPayload = { _orderId: log.orderId };
      parallel({
        orderType: (next: AsyncCallback): void => augur.api.Orders.getOrderType(ordersPayload, next),
        price: (next: AsyncCallback): void => augur.api.Orders.getPrice(ordersPayload, next),
        amount: (next: AsyncCallback): void => augur.api.Orders.getAmount(ordersPayload, next),
        sharesEscrowed: (next: AsyncCallback): void => augur.api.Orders.getOrderSharesEscrowed(ordersPayload, next),
        moneyEscrowed: (next: AsyncCallback): void => augur.api.Orders.getOrderMoneyEscrowed(ordersPayload, next),
      }, (err: Error|null, onContractData: OrderCreatedOnContractData): void => {
        if (err) return callback(err);
        const { price, amount, orderType, moneyEscrowed, sharesEscrowed } = onContractData;
        const fullPrecisionAmount = convertFixedPointToDecimal(amount, WEI_PER_ETHER);
        const fullPrecisionPrice = denormalizePrice(minPrice, maxPrice, convertFixedPointToDecimal(price, numTicks));
        const orderTypeLabel = orderType === "0" ? "buy" : "sell";
        const orderData: OrdersRow = {
          marketID,
          blockNumber: log.blockNumber,
          transactionHash: log.transactionHash,
          logIndex: log.logIndex,
          outcome,
          shareToken: log.shareToken,
          orderCreator: log.creator,
          orderState: OrderState.OPEN,
          tradeGroupID: log.tradeGroupId,
          orderType: orderTypeLabel,
          price: formatOrderPrice(orderTypeLabel, minPrice, maxPrice, fullPrecisionPrice),
          amount: formatOrderAmount(minPrice, maxPrice, fullPrecisionAmount),
          fullPrecisionPrice,
          fullPrecisionAmount,
          tokensEscrowed: convertFixedPointToDecimal(moneyEscrowed, WEI_PER_ETHER),
          sharesEscrowed: convertFixedPointToDecimal(sharesEscrowed, WEI_PER_ETHER),
        };
        const orderID = { orderID: log.orderId };
        augurEmitter.emit("OrderCreated", Object.assign(orderData, orderID));
        trx.select(["marketID"]).from("orders").where(orderID).asCallback((err: Error|null, ordersRows?: any): void => {
          if (err) return callback(err);
          if (!ordersRows || !ordersRows.length) {
            db.transacting(trx).insert(Object.assign(orderData, orderID)).into("orders").asCallback(callback);
          } else {
            db.transacting(trx).from("orders").where(orderID).update(orderData).asCallback(callback);
          }
        });
      });
    });
  });
}

export function processOrderCreatedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  augurEmitter.emit("OrderCreated", log);
  db.transacting(trx).from("orders").where("orderID", log.orderId).update({ isRemoved: 1 }).asCallback(callback);
}
