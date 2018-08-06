import * as Knex from "knex";
import { Address } from "../../types";
import { groupByAndSum, queryModifier } from "./database";

export interface CategoriesRow {
  category: string;
  popularity: number|string;
}

export function getCategories(db: Knex, universe: Address, sortBy: string|null|undefined, isSortDescending: boolean|null|undefined, limit: number|null|undefined, offset: number|null|undefined, callback: (err: Error|null, result?: Array<CategoriesRow>) => void): void {
  const query = db.select(["category", "popularity"]).from("categories").where({ universe });
  queryModifier(db, query, "popularity", "desc", sortBy, isSortDescending, limit, offset, (err: Error|null, categoriesInfo?: Array<CategoriesRow>): void => {
    if (err) return callback(err);
    if (!categoriesInfo) return callback(null);
    // Group categories by upper case in case DB has not been fully sync'd with upper casing code. This can be removed once DB version > 2
    const upperCaseCategoryInfo = categoriesInfo.map((category) => {
      return {
        category: category.category.toUpperCase(),
        popularity: category.popularity,
      };
    });
    const groupedCategoryInfo = groupByAndSum(upperCaseCategoryInfo, ["category"], ["popularity"]);
    callback(null, groupedCategoryInfo.map((categoryInfo: CategoriesRow): CategoriesRow => ({ popularity: categoryInfo.popularity.toString(), category: categoryInfo.category })));
  });
}
