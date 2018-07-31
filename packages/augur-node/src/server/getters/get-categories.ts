import * as Knex from "knex";
import { Address } from "../../types";
import { queryModifier } from "./database";

export interface CategoriesRow {
  category: string;
  popularity: number|string;
}

export function getCategories(db: Knex, universe: Address, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: Array<CategoriesRow>) => void): void {
  const query = db.select(["category", "popularity"]).from("categories").where({ universe });
  queryModifier(db, query, "popularity", "desc", sortBy, isSortDescending, limit, offset, (err: Error|null, categoriesInfo?: Array<CategoriesRow>): void => {
    if (err) return callback(err);
    if (!categoriesInfo) return callback(null);
    callback(null, categoriesInfo.map((categoryInfo: CategoriesRow): CategoriesRow => Object.assign(categoryInfo, { popularity: categoryInfo.popularity.toString() })));
  });
}
