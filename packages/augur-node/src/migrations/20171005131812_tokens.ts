import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("tokens").then((): PromiseLike<any> => {
    return knex.schema.createTable("tokens", (table: Knex.CreateTableBuilder): void => {
      table.string("contractAddress", 66).primary();
      table.string("symbol", 255).notNullable();
      table.string("marketId", 66).nullable();
      table.integer("outcome").nullable();
      table.string("feeWindow", 66).nullable();

      table.unique(["marketId", "symbol", "outcome"]);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("tokens");
};
