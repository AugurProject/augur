import Augur from "augur.js";
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { Address, Bytes32, FormattedEventLog, MarketsRow, OrdersRow, TokensRow, OrderState, ErrorCallback, AsyncCallback } from "../../types";
import { processOrderCanceledLog } from "./order-canceled";
import { augurEmitter } from "../../events";
import { convertFixedPointToDecimal } from "../../utils/convert-fixed-point-to-decimal";
import { denormalizePrice } from "../../utils/denormalize-price";
import { formatOrderAmount, formatOrderPrice } from "../../utils/format-order";
import { WEI_PER_ETHER, ZERO } from "../../constants";

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
  const amount: string = log.amount;
  const price: string = log.price;
  const orderType: string = log.orderType;
  const moneyEscrowed: string = log.moneyEscrowed;
  const sharesEscrowed: string = log.sharesEscrowed;
  const shareToken: Address = log.shareToken;
  trx.first("marketID", "outcome").from("tokens").where({ contractAddress: shareToken }).asCallback((err: Error|null, tokensRow?: TokensRow): void => {
    if (err) return callback(err);
    if (!tokensRow) return callback(new Error("market and outcome not found"));
    const marketID = tokensRow.marketID!;
    const outcome = tokensRow.outcome!;
    trx.first("minPrice", "maxPrice", "numTicks").from("markets").where({ marketID }).asCallback((err: Error|null, marketsRow?: MarketsRow): void => {
      if (err) return callback(err);
      if (!marketsRow) return callback(new Error("market min price, max price, and/or num ticks not found"));
      const minPrice = marketsRow.minPrice!;
      const maxPrice = marketsRow.maxPrice!;
      const numTicks = marketsRow.numTicks!;
      const ordersPayload = { _orderId: log.orderId };
      const fullPrecisionAmount = convertFixedPointToDecimal(amount, WEI_PER_ETHER);
      const fullPrecisionPrice = denormalizePrice(minPrice, maxPrice, convertFixedPointToDecimal(price, numTicks));
      const orderTypeLabel = orderType === "0" ? "buy" : "sell";
      const orderData: OrdersRow = {
        marketID,
        blockNumber: log.blockNumber,
        transactionHash: log.transactionHash,
        logIndex: log.logIndex,
        outcome,
        shareToken,
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
      trx.select("marketID").from("orders").where(orderID).asCallback((err: Error|null, ordersRows?: Array<Partial<OrdersRow>>): void => {
        if (err) return callback(err);
        if (!ordersRows || !ordersRows.length) {
          db.transacting(trx).insert(Object.assign(orderData, orderID)).into("orders").asCallback(callback);
        } else {
          db.transacting(trx).from("orders").where(orderID).update(orderData).asCallback(callback);
        }
      });
    });
  });
}

export function processOrderCreatedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedEventLog, callback: ErrorCallback): void {
  augurEmitter.emit("OrderCreated", log);
  db.transacting(trx).from("orders").where("orderID", log.orderId).update({ isRemoved: 1 }).asCallback(callback);
}
