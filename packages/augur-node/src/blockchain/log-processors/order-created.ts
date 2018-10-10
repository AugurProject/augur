import Augur from "augur.js";
import * as Knex from "knex";
import { BigNumber } from "bignumber.js";
import { Address, FormattedEventLog, MarketsRow, OrdersRow, TokensRow, OrderState, ErrorCallback } from "../../types";
import { augurEmitter } from "../../events";
import { fixedPointToDecimal, numTicksToTickSize } from "../../utils/convert-fixed-point-to-decimal";
import { formatOrderAmount, formatOrderPrice } from "../../utils/format-order";
import { BN_WEI_PER_ETHER, SubscriptionEventNames } from "../../constants";
import { QueryBuilder } from "knex";

export function processOrderCreatedLog(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  const amount: BigNumber = new BigNumber(log.amount, 10);
  const price: BigNumber = new BigNumber(log.price, 10);
  const orderType: string = log.orderType;
  const moneyEscrowed: BigNumber = new BigNumber(log.moneyEscrowed, 10);
  const sharesEscrowed: BigNumber = new BigNumber(log.sharesEscrowed, 10);
  const shareToken: Address = log.shareToken;
  db.first("marketId", "outcome").from("tokens").where({ contractAddress: shareToken }).asCallback((err: Error|null, tokensRow?: TokensRow): void => {
    if (err) return callback(err);
    if (!tokensRow) return callback(new Error(`market and outcome not found for shareToken ${shareToken} (${log.transactionHash}`));
    const marketId = tokensRow.marketId!;
    const outcome = tokensRow.outcome!;
    db.first("minPrice", "maxPrice", "numTicks").from("markets").where({ marketId }).asCallback((err: Error|null, marketsRow?: MarketsRow<BigNumber>): void => {
      if (err) return callback(err);
      if (!marketsRow) return callback(new Error(`market min price, max price, and/or num ticks not found for market: ${marketId} (${log.transactionHash}`));
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
      db.select("marketId").from("orders").where(orderId).asCallback((err: Error|null, ordersRows?: Array<Partial<OrdersRow<BigNumber>>>): void => {
        if (err) return callback(err);
        let upsertOrder: QueryBuilder;
        if (!ordersRows || !ordersRows.length) {
          upsertOrder = db.insert(Object.assign(orderData, orderId)).into("orders");
        } else {
          upsertOrder = db.from("orders").where(orderId).update(orderData);
        }
        upsertOrder.asCallback((err: Error|null): void => {
          if (err) return callback(err);
          checkForOrphanedOrders(db, augur, orderData, (err) => {
            if (err) return callback(err);
            augurEmitter.emit(SubscriptionEventNames.OrderCreated, Object.assign({}, log, orderData));
            callback(null);
          });
        });
      });
    });
  });
}

export function processOrderCreatedLogRemoval(db: Knex, augur: Augur, log: FormattedEventLog, callback: ErrorCallback): void {
  db.from("orders").where("orderId", log.orderId).delete().asCallback((err: Error|null): void => {
    if (err) return callback(err);
    augurEmitter.emit(SubscriptionEventNames.OrderCreated, log);
    return callback(null);
  });
}

function checkForOrphanedOrders(db: Knex, augur: Augur, orderData: OrdersRow<string>, callback: ErrorCallback): void {
  const queryData = {
    marketId: orderData.marketId,
    outcome: orderData.outcome,
    orderType: orderData.orderType,
    orderState: OrderState.OPEN,
    orphaned: 0,
  };
  db.first(db.raw("count(*) as numOrders")).from("orders").where(queryData).asCallback((err: Error|null, results: { numOrders: number }): void => {
    if (err) return callback(err);
    const requestData = {
      _type: orderData.orderType === "buy" ? 0 : 1,
      _market: orderData.marketId,
      _outcome: orderData.outcome,
    };
    // Use the function that will return the least amount of data assuming we're close to the right number of orders currently. Failure is expected when syncing and will correct later
    let getExistingOrders: (p: any, cb: any) => void;
    if (results.numOrders >= 500) {
      getExistingOrders = augur.api.OrdersFinder.getExistingOrders1000;
    } else if (results.numOrders >= 200) {
      getExistingOrders = augur.api.OrdersFinder.getExistingOrders500;
    } else if (results.numOrders >= 100) {
      getExistingOrders = augur.api.OrdersFinder.getExistingOrders200;
    } else if (results.numOrders >= 50) {
      getExistingOrders = augur.api.OrdersFinder.getExistingOrders100;
    } else if (results.numOrders >= 20) {
      getExistingOrders = augur.api.OrdersFinder.getExistingOrders50;
    } else if (results.numOrders >= 10) {
      getExistingOrders = augur.api.OrdersFinder.getExistingOrders20;
    } else if (results.numOrders >= 5) {
      getExistingOrders = augur.api.OrdersFinder.getExistingOrders10;
    } else {
      getExistingOrders = augur.api.OrdersFinder.getExistingOrders5;
    }
    getExistingOrders(requestData, (err: Error| null, orderIds: Array<string>): void => {
      // Erroring here is expected in the case where we have more orders than are supported by the call used. We correct at some future order creation which must occur for there to be more orders now
      if (err) return callback(null);
      db.from("orders").whereNotIn("orderId", orderIds).where(queryData).update({orphaned: true}).asCallback(callback);
    });
  });
}
