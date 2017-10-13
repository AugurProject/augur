import * as Knex from "knex";
import { Address } from "../../types";

export function getMarketsInCategory(db: Knex, category: Address, sortBy: string|null|undefined, limit: number|null|undefined, callback: (err?: Error|null, result?: Array<Address>) => void): void {
  let query: Knex.QueryBuilder = db.select("market_id").from("markets").where({ category });
  if (sortBy != null) query = query.orderBy(sortBy, "desc");
  if (limit != null) query = query.limit(limit);
  console.log("query:", query.toSQL());
  query.asCallback((err?: Error|null, marketsInCategory?: Array<Address>): void => {
    if (err) return callback(err);
    if (!marketsInCategory || !marketsInCategory.length) return callback(null);
    callback(null, marketsInCategory);
  });
}
