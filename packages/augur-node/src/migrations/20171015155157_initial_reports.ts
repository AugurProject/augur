import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("initial_reports").then( (): PromiseLike<any> => {
    return  knex.schema.createTable("initial_reports", (table: Knex.CreateTableBuilder): void => {
      table.increments("initialReportId");

      table.specificType("blockNumber", "integer NOT NULL CONSTRAINT positiveOrderBlockNumber CHECK (\"blockNumber\" > 0)");
      table.string("transactionHash", 66).notNullable();
      table.specificType("logIndex", "integer NOT NULL CONSTRAINT \"nonnegativelogIndex\" CHECK (\"logIndex\" >= 0)");

      table.string("marketId", 42).notNullable();
      table.string("reporter", 42).notNullable();
      table.boolean("isDesignatedReporter").notNullable();
      table.string("amountStaked", 255).defaultTo("0").notNullable();
      table.string("initialReporter").notNullable();
      table.boolean("redeemed").notNullable();
      table.integer("payoutId").notNullable();
      table.integer("disavowed").defaultTo(0);

      table.index(["reporter"]);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("initial_reports");
};
