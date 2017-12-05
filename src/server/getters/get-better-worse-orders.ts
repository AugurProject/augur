import { parallel } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { Address, MarketsContractAddressRow, AsyncCallback } from "../../types";
import { queryModifier, getMarketsWithReportingState } from "./database";

interface PricesResult {
  higherPriceRow: {orderID: string|null};
  lowerPriceRow: {orderID: string|null};
}

export function getBetterWorseOrders(db: Knex, marketID: Address, outcome: number, orderType: string, price: number, callback: (err?: Error|null, result?: any) => void): void {
  if (marketID == null || outcome == null || orderType == null || price == null) return callback(new Error("Must provide marketID, outcome, orderType, and price"));
  if (orderType !== "buy" && orderType !== "sell") return callback(new Error(`orderType must be either "bid" or "ask"`));
  const ordersQuery = db("orders").first("orderID").where({ orderState: "OPEN", marketID, outcome, orderType });
  parallel({
    higherPriceRow: (next: AsyncCallback) => ordersQuery.clone().where("price", ">", price).orderBy("price", "ASC").asCallback(next),
    lowerPriceRow: (next: AsyncCallback) => ordersQuery.clone().where("price", "<", price).orderBy("price", "DESC").asCallback(next),
  }, (err: Error|null, pricesResult: PricesResult ): void => {
    if (err) return callback(err);
    const { higherPriceRow, lowerPriceRow } = pricesResult;
    if (orderType === "buy") {
      return callback(null, {
        betterOrderID: (higherPriceRow ? higherPriceRow.orderID : null),
        worseOrderID: (lowerPriceRow ? lowerPriceRow.orderID : null),
      });
    } else {
      return callback(null, {
        betterOrderID: (lowerPriceRow ? lowerPriceRow.orderID : null),
        worseOrderID: (higherPriceRow ? higherPriceRow.orderID : null),
      });
    }
  });
}
