import * as Knex from "knex";
import { Address } from "../../types";

export interface CategoriesRow {
  category: string;
  popularity: number;
}

export type CategoriesInfo = Array<CategoriesRow>;

export function getCategories(db: Knex, universe: Address, callback: (err?: Error|null, result?: CategoriesInfo) => void): void {
  db.raw(`SELECT category, popularity FROM categories WHERE universe = ? ORDER BY popularity DESC`, [universe]).asCallback((err?: Error|null, categoriesInfo?: CategoriesInfo): void => {
    if (err) return callback(err);
    if (!categoriesInfo || !categoriesInfo.length) return callback(null);
    callback(null, categoriesInfo);
  });
}
