import * as Knex from "knex";
import { Address } from "../../types";

interface MarketIDMarketsRow {
  market_id: Address;
}

export function getMarketsInCategory(db: Knex, category: Address, sortBy: string|null|undefined, limit: number|null|undefined, callback: (err?: Error|null, result?: Array<Address>) => void): void {
  let query: Knex.QueryBuilder = db.select("market_id").from("markets").where({ category });
  if (sortBy != null) query = query.orderBy(sortBy);
  if (limit != null) query = query.limit(limit);
  query.asCallback((err?: Error|null, marketsInCategory?: Array<MarketIDMarketsRow>): void => {
    if (err) return callback(err);
    if (!marketsInCategory || !marketsInCategory.length) return callback(null);
    callback(null, marketsInCategory.map((marketInCategory: MarketIDMarketsRow) => marketInCategory.market_id));
  });
}
