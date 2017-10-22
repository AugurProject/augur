import * as Knex from "knex";
import { Address } from "../../types";
import { sortDirection } from "../../utils/sort-direction";

export interface CategoriesRow {
  category: string;
  popularity: number|string;
}

export function getCategories(db: Knex, universe: Address, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: Array<CategoriesRow>) => void): void {
  let query = db.select(["category", "popularity"]).from("categories").where({ universe });
  query = query.orderBy(sortBy || "popularity", sortDirection(isSortDescending, "desc"));
  if (limit != null) query = query.limit(limit);
  if (offset != null) query = query.offset(offset);
  query.asCallback((err: Error|null, categoriesInfo?: Array<CategoriesRow>): void => {
    if (err) return callback(err);
    if (!categoriesInfo || !categoriesInfo.length) return callback(null);
    callback(null, categoriesInfo);
  });
}
