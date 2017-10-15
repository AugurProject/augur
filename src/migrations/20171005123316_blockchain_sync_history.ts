import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("blockchain_sync_history").then(async (): Promise<any> => {
    return knex.schema.createTable("blockchain_sync_history", (table: Knex.CreateTableBuilder): void => {
      table.increments("id").primary().notNullable();
      table.integer("highestBlockNumber").notNullable();
      table.timestamp("syncTime").defaultTo(knex.fn.now()).notNullable();
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("blockchain_sync_history");
};
