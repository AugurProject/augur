import { parallel } from "async";
import * as Knex from "knex";
import { Address, AsyncCallback } from "../../types";

interface PricesResult {
  higherPriceRow: {orderId: string|null};
  lowerPriceRow: {orderId: string|null};
}

export function getBetterWorseOrders(db: Knex, marketId: Address, outcome: number, orderType: string, price: number, callback: (err?: Error|null, result?: any) => void): void {
  if (marketId == null || outcome == null || orderType == null || price == null) return callback(new Error("Must provide marketId, outcome, orderType, and price"));
  if (orderType !== "buy" && orderType !== "sell") return callback(new Error(`orderType must be either "buy" or "sell"`));
  const ordersQuery = db("orders").first("orderId").where({ orderState: "OPEN", marketId, outcome, orderType });
  parallel({
    higherPriceRow: (next: AsyncCallback) => ordersQuery.clone().where("price", ">", price).orderBy("price", "ASC").asCallback(next),
    lowerPriceRow: (next: AsyncCallback) => ordersQuery.clone().where("price", "<", price).orderBy("price", "DESC").asCallback(next),
  }, (err: Error|null, pricesResult: PricesResult ): void => {
    if (err) return callback(err);
    const { higherPriceRow, lowerPriceRow } = pricesResult;
    if (orderType === "buy") {
      return callback(null, {
        betterOrderId: (higherPriceRow ? higherPriceRow.orderId : null),
        worseOrderId: (lowerPriceRow ? lowerPriceRow.orderId : null),
      });
    } else {
      return callback(null, {
        betterOrderId: (lowerPriceRow ? lowerPriceRow.orderId : null),
        worseOrderId: (higherPriceRow ? higherPriceRow.orderId : null),
      });
    }
  });
}
