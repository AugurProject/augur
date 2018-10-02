import * as Knex from "knex";
import * as _ from "lodash";
import Augur from "augur.js";
import { Address, SortLimit } from "../../types";
import { checkOptionalOrderingParams, groupByAndSum, queryModifierParams, SORT_LIMIT_KEYS } from "./database";

export interface CategoriesRow {
  category: string;
  popularity: number|string;
}

export interface GetCategoriesParams extends SortLimit {
  universe: Address;
}

export function extractGetCategoriesParams(params: any): GetCategoriesParams|undefined {
  const pickedParams = _.pick(params, ["universe", ...SORT_LIMIT_KEYS]);
  if (!checkOptionalOrderingParams(pickedParams)) return undefined;
  if (!isGetCategoriesParams(pickedParams)) return undefined;
  return pickedParams;
}

export function isGetCategoriesParams(params: any): params is GetCategoriesParams {
  if (!_.isObject(params)) return false;
  return _.isString(params.universe);

}

//        //(db, request.params.universe, request.params.sortBy, request.params.isSortDescending, request.params.limit, request.params.offset, callback);

export async function getCategories(db: Knex, augur: Augur, params: GetCategoriesParams): Promise<Array<CategoriesRow>> {
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
