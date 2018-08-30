import * as Knex from "knex";
import { createSearchProvider } from "../database/fts";

exports.up = async (knex: Knex): Promise<any> => {
  const provider = createSearchProvider(knex);
  if (provider !== null) await provider.migrateUp();
};

exports.down = async (knex: Knex): Promise<any> => {
  const provider = createSearchProvider(knex);
  if (provider !== null) await provider.migrateDown();
};
