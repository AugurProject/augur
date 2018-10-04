import * as Knex from "knex";
import * as _ from "lodash";
import Augur from "augur.js";
import { SortLimitParams } from "../../types";
import { groupByAndSum, queryModifierParams } from "./database";
import * as t from "io-ts";

export const CategoriesParamsSpecific = t.type({
  universe: t.string,
});

export const CategoriesParams = t.intersection([
  CategoriesParamsSpecific,
  SortLimitParams,
]);

export interface CategoriesRow {
  category: string;
  popularity: number|string;
}

export async function getCategories(db: Knex, augur: Augur, params: t.TypeOf<typeof CategoriesParams>): Promise<Array<CategoriesRow>> {
  const query = db.select(["category", "popularity"]).from("categories").where({ universe: params.universe });
  const categoriesInfo = await queryModifierParams<CategoriesRow>(db, query, "popularity", "desc", params);
  // Group categories by upper case in case DB has not been fully sync'd with upper casing code. This can be removed once DB version > 2
  const upperCaseCategoryInfo = categoriesInfo.map((category) => {
    return {
      category: category.category.toUpperCase(),
      popularity: category.popularity,
    };
  });
  const groupedCategoryInfo = groupByAndSum(upperCaseCategoryInfo, ["category"], ["popularity"]);
  return groupedCategoryInfo.map((categoryInfo: CategoriesRow): CategoriesRow => ({ popularity: categoryInfo.popularity.toString(), category: categoryInfo.category }));
}
