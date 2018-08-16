import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  await knex("search_en").delete();
};

exports.down = async (knex: Knex): Promise<any> => {
  knex("search_en").delete();
};
