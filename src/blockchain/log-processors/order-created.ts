import Augur from "augur.js";
import BigNumber from "bignumber.js";
import * as Knex from "knex";
import { Address, FormattedLog, OrdersRow, ErrorCallback } from "../../types";
import { processOrderCanceledLog } from "./order-canceled";
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

export function processOrderCreatedLog(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  trx.select(["marketID", "outcome"]).from("tokens").where({ contractAddress: log.shareToken }).asCallback((err: Error|null, tokensRows?: Array<TokensRow>): void => {
    if (err) return callback(err);
    if (!tokensRows || !tokensRows.length) return callback(new Error("market and outcome not found"));
    const { marketID, outcome } = tokensRows[0];
    trx.select(["minPrice", "maxPrice", "numTicks"]).from("markets").where({ marketID }).asCallback((err: Error|null, marketsRows?: Array<MarketsRow>): void => {
      if (err) return callback(err);
      if (!marketsRows || !marketsRows.length) return callback(new Error("market min price, max price, and/or num ticks not found"));
      const { minPrice, maxPrice, numTicks } = marketsRows[0];
      const fullPrecisionPrice = denormalizePrice(minPrice, maxPrice, convertFixedPointToDecimal(log.price, numTicks));
      const fullPrecisionAmount = convertFixedPointToDecimal(log.amount, numTicks);
      const orderData: OrdersRow = {
        marketID,
        outcome,
        shareToken: log.shareToken,
        orderType: log.orderType,
        orderCreator: log.creator,
        creationBlockNumber: log.blockNumber,
        price: formatOrderPrice(log.orderType, minPrice, maxPrice, fullPrecisionPrice),
        amount: formatOrderAmount(minPrice, maxPrice, fullPrecisionAmount),
        fullPrecisionPrice,
        fullPrecisionAmount,
        tokensEscrowed: convertFixedPointToDecimal(log.tokensEscrowed, WEI_PER_ETHER),
        sharesEscrowed: convertFixedPointToDecimal(log.sharesEscrowed, numTicks),
        betterOrderID: log.betterOrderID,
        worseOrderID: log.worseOrderID,
        tradeGroupID: log.tradeGroupID,
      };
      const orderID = { orderID: log.orderId };
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
}

export function processOrderCreatedLogRemoval(db: Knex, augur: Augur, trx: Knex.Transaction, log: FormattedLog, callback: ErrorCallback): void {
  processOrderCanceledLog(db, augur, trx, log, callback);
}
