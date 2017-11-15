import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("stake_tokens").then( (): PromiseLike<any> => {
    return knex.schema.createTable("stake_tokens", (table: Knex.CreateTableBuilder): void => {
      table.string("stakeToken", 42).primary().notNullable();
      table.string("marketID", 42).notNullable();
      for (let i: number = 0; i <= 7; i++ ) {
        table.specificType(`payout${i}`, "NUMERIC").nullable();
      }
      table.integer("isInvalid");
      table.index(["marketID"]);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("stake_tokens");
};
