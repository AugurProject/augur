import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("initial_reports").then( (): PromiseLike<any> => {
    return  knex.schema.createTable("initial_reports", (table: Knex.CreateTableBuilder): void => {
      table.increments("initialReportID");
      table.string("marketID", 42).notNullable();
      table.string("reporter", 42).notNullable();
      table.boolean("isDesignatedReporter").notNullable();
      table.specificType("amountStaked", "numeric").defaultTo(0);
      table.string("initialReporter").notNullable();
      table.boolean("redeemed").notNullable();
      table.integer("payoutID").notNullable();

      table.index(["reporter"]);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("initial_reports");
};
