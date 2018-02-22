import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("market_state").then( (): PromiseLike<any> => {
    return  knex.schema.createTable("market_state", (table: Knex.CreateTableBuilder) => {
      table.increments("marketStateId");
      table.string("marketId", 66).notNullable();
      table.string("reportingState", 30).notNullable();
      table.integer("blockNumber").notNullable();
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("market_state");
};
