import * as Knex from "knex";
import { Address, AllOrdersRow } from "../../types";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";

export interface AllOrders {
  [orderId: string]: AllOrdersRow<string>;
}

export function getAllOrders(db: Knex, account: Address, callback: (err: Error|null, result?: AllOrders) => void): void {
  const query = db.select(["orderId", "tokensEscrowed", "sharesEscrowed", "marketId"]).from("orders")
    .where("orderCreator", account)
    .whereNull("isRemoved")
    .where("orderState", "OPEN");
  query.asCallback((err: Error|null, allOrders?: Array<AllOrdersRow<BigNumber>>): void => {
    if (err) return callback(err);
    if (!allOrders) return callback(err, {});
    callback(null, allOrders.reduce((acc: AllOrders, cur: AllOrdersRow<BigNumber>) => {
      acc[cur.orderId] = formatBigNumberAsFixed<AllOrdersRow<BigNumber>, AllOrdersRow<string>>({
        orderId: cur.orderId,
        tokensEscrowed: cur.tokensEscrowed,
        sharesEscrowed: cur.sharesEscrowed,
        marketId: cur.marketId,
      });
      return acc;
    }, {}));
  });
}
