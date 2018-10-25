import * as t from "io-ts";
import * as Knex from "knex";
import * as _ from "lodash";
import Augur from "augur.js";
import { groupByAndSum } from "./database";

export const CategoriesParams = t.type({
  universe: t.string,
});

export interface UICategory {
  category: string;
  popularity: string;
  tags: TagCount;
}

interface TagCount {
  [tag: string]: number;
}

interface TagRow {
  category: string;
  tag1: string;
  tag2: string;
}

export interface CategoryPopularity {
  category: string;
  popularity: string;
}

async function getCategoriesPopularity(db: Knex, universe: string): Promise<Array<CategoryPopularity>> {
  const categoriesInfo = await db.select(["category", "popularity"]).from("categories").where({ universe }).orderBy("popularity", "desc");
  // Group categories by upper case in case DB has not been fully sync'd with upper casing code. This can be removed once DB version > 2
  const upperCaseCategoryInfo = categoriesInfo.map((category: CategoryPopularity) => {
    return {
      category: category.category.toUpperCase(),
      popularity: category.popularity,
    };
  });
  const groupedCategoryInfo = groupByAndSum(upperCaseCategoryInfo, ["category"], ["popularity"]);
  return groupedCategoryInfo.map((categoryInfo: CategoryPopularity): CategoryPopularity => ({ popularity: categoryInfo.popularity.toString(), category: categoryInfo.category }));
}

function convertTagsToArray(tagRows: Array<TagRow>): TagCount {
  return _.chain(tagRows).map((t) => [(t.tag1 || "").toUpperCase(), (t.tag2 || "").toUpperCase()])
    .flatten()
    .filter((tag) => tag !== "")
    .countBy()
    .value();
}

async function getTagsCountByCategory(db: Knex, universe: string): Promise<{ [category: string]: TagCount }> {
  const tagsRows: Array<TagRow> = await db.select(["tag1", "tag2", "category"]).from("markets").where({ universe });
  return _.chain(tagsRows)
    .groupBy((tagRow) => tagRow.category.toUpperCase())
    .mapValues(convertTagsToArray)
    .value();
}

export async function getCategories(db: Knex, augur: Augur, params: t.TypeOf<typeof CategoriesParams>): Promise<Array<UICategory>> {
  const universeInfo = await db.first(["universe"]).from("universes").where({ universe: params.universe });
  if (universeInfo === undefined) throw new Error(`Universe ${params.universe} does not exist`);
  const tagCountByCategory = await getTagsCountByCategory(db, params.universe);
  const categoriesResponse = await getCategoriesPopularity(db, params.universe);
  return _.map(categoriesResponse, (categoryResponse) => {
    const category = categoryResponse.category;
    return Object.assign(
      { tags: tagCountByCategory[category] || [] },
      categoryResponse,
    );
  });
}
