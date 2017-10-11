import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("blockchain_sync_history").then(() => {
    return knex.schema.createTable("blockchain_sync_history", (table): void => {
      table.increments('id').primary().notNullable();
      table.integer("highest_block_number").notNullable();
      table.timestamp('sync_time').defaultTo(knex.fn.now()).notNullable();
    }).then( (): void => {
      knex.schema.raw(`ALTER TABLE blockchain_sync_history ADD CONSTAINT nonnegative_highest_block_number CHECK (highest_block_number >= 0)`);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("blockchain_sync_history");
};
