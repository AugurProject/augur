import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  if (knex.client.config.client !== "pg") return;

  await knex("search_en").delete();
};

exports.down = async (knex: Knex): Promise<any> => {
  if (knex.client.config.client !== "pg") return;

  knex("search_en").delete();
};
