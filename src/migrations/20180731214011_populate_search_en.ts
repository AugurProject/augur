import * as Knex from "knex";
import { contentSearchBuilder } from "../utils/content-search-builder";

exports.up = async (knex: Knex): Promise<any> => {
  const markets = await knex.select('*').from('markets');
  for (let market of markets) {
    await knex("search_en").insert({marketId: market.marketId, content: contentSearchBuilder(market)});
  }
};

exports.down = async (knex: Knex): Promise<any> => {
  knex("search_en").delete();
};
