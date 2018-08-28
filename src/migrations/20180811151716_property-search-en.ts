import * as Knex from "knex";
import { contentSearchBuilder } from "../utils/content-search-builder";

exports.up = async (knex: Knex): Promise<any> => {
  await knex.schema.dropTableIfExists("search_en");
  await knex.schema.raw(`CREATE VIRTUAL TABLE search_en USING fts4(marketId, category, tags, shortDescription, longDescription, scalarDenomination, resolutionSource)`);
  const markets = await knex.select("*").from("markets");
  for (const market of markets) {
    const marketSearchDataToInsert = contentSearchBuilder(market);
    await knex("search_en").insert(marketSearchDataToInsert).into("search_en");
  }
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("search_en");
};
