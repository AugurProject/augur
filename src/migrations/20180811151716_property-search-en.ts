import * as Knex from "knex";
import { getFullTextSearchProvider } from "../database/full_text_search";

exports.up = async (knex: Knex): Promise<any> => {
  const provider = getFullTextSearchProvider(knex);
  if (provider !== null) await provider.migrateUp();
};

exports.down = async (knex: Knex): Promise<any> => {
  const provider = getFullTextSearchProvider(knex);
  if (provider !== null) await provider.migrateDown();
};
