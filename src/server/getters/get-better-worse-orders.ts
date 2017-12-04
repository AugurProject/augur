import { each } from "async";
import * as Knex from "knex";
import * as _ from "lodash";
import { Address, MarketsContractAddressRow } from "../../types";
import { queryModifier, getMarketsWithReportingState } from "./database";

/*
Logic:
immediateFill = There's two ways an order can be resolved.
     1.) An open order for the same outcome !orderType (buy->sell) with >=amount or "better" price (means diff things based on buy|sell)
     2.) If binary/scalar, an open order for the OPPOSITE outcome, with a price that allows us to reach that of complete set

*/

interface OrderPrice {
  orderID: Address;
  fullPrecisionPrice: string;
  orderType: string;
}

export function getBetterWorseOrders(db: Knex, marketID: Address, outcome: number, orderType: string, amount: string, price: string|number, callback: (err?: Error|null, result?: any) => void): void {
  if (marketID == null || outcome == null || price == null) return callback(new Error("Must provide marketID, outcome, and price"));
  if ( orderType !== "buy" && orderType !== "sell" ) return callback(new Error(`orderType must be either buy|sell`));
  const query: Knex.QueryBuilder = db.select("orderID", "fullPrecisionPrice", "orderType").from("orders").where({ marketID, outcome });
  query.orderBy("fullPrecisionPrice", "asc");
  let betterOrderID: string;
  let worseOrderID: string;
  query.asCallback((err: Error|null, orderPrices?: Array<OrderPrice>): void => {
    let immediateFill = false;
    if (orderPrices == null || orderPrices.length == 0) { 
      return callback(null, {immediateFill: false,
        betterOrderID: "",
        worseOrderID: "",
      });
    } else {
      const typedOrders = _.keyBy(orderPrices, (order) => order.orderType );
      const counterSide = (orderType == "sell") ? "buy" : "sell";
      let bestOrder: OrderPrice;
      let worseOrder = orderPrices[orderPrices.length];
      if ( orderType === "buy" ) {
        bestOrder = orderPrices[0];
        worseOrder = orderPrices[orderPrices.length];        
      } else if (orderType === "sell" ) {

      } else {
        return callback(new Error(`orderType must be "buy" or "sell"`))
      }
      console.log(typedOrders );
      callback(null, {immediateFill: true,
        betterOrderID: 0,
        worseOrderID: 0,
      });
    }  
  });
}