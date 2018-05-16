import * as Knex from "knex";
import { Address, AllOrdersRow } from "../../types";
import { formatBigNumberAsFixed } from "../../utils/format-big-number-as-fixed";

export function getAllOrders(db: Knex, account: Address, callback: (err: Error|null, result?: any) => void): void {
  const query = db.select(["orderId", "tokensEscrowed", "sharesEscrowed"]).from("orders").where("orderCreator", account);
  query.asCallback((err: Error|null, allOrders?: Array<AllOrdersRow<BigNumber>>): void => {
    if (err) return callback(err);
    if (!allOrders) return callback(err, []);
    callback(null, allOrders.map((row: AllOrdersRow<BigNumber>) => {
      return formatBigNumberAsFixed<AllOrdersRow<BigNumber>, AllOrdersRow<string>>({
        orderId: row.orderId,
        tokensEscrowed: row.tokensEscrowed,
        sharesEscrowed: row.sharesEscrowed,
      });
    }));
  });
}
