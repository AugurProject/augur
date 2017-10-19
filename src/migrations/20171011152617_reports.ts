import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("reports").then( (): PromiseLike<any> => {
    return knex.schema.createTable("reports", (table: Knex.CreateTableBuilder): void => {
      table.increments("reportID").primary().notNullable();
      table.string("reporter", 66).notNullable();
      table.string("marketID", 66).notNullable();
      table.string("reportingToken", 66).notNullable();
      table.specificType("amountStaked", "NUMERIC");
      for (let i: number = 0; i <= 7; i++ ) {
        table.specificType(`payout${i}`, "NUMERIC").nullable();
      }
      table.integer("isInvalid");
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("reports");
};
