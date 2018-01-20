import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("payouts").then( (): PromiseLike<any> => {
    return knex.schema.createTable("payouts", (table: Knex.CreateTableBuilder): void => {
      table.increments("payoutID");
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
