import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("market_state").then( (): PromiseLike<any> => {
    return  knex.schema.createTable("market_state", (table: Knex.CreateTableBuilder) => {
      table.increments("marketStateID");
      table.string("marketID", 66).notNullable();
      table.integer("reportingState").nullable();
      table.integer("blockNumber").notNullable();
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("market_state");
};
