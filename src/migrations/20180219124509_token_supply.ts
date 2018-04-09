import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("token_supply").then( (): PromiseLike<any> => {
    return knex.schema.createTable("token_supply", (table: Knex.CreateTableBuilder): void => {
      table.string("token", 42).primary().notNullable();
      table.string("supply", 255).defaultTo("0");
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("token_supply");
};
