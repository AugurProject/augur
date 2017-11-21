import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("reports").then( (): PromiseLike<any> => {
    return knex.schema.createTable("reports", (table: Knex.CreateTableBuilder): void => {
      table.increments("reportID").primary().notNullable();
      table.string("transactionHash", 66).notNullable(),
      table.specificType("logIndex", "integer NOT NULL CONSTRAINT \"nonnegativelogIndex\" CHECK (\"logIndex\" >= 0)"),
      table.specificType("blockNumber", "integer NOT NULL CONSTRAINT positiveOrderBlockNumber CHECK (\"blockNumber\" > 0)");
      table.string("reporter", 66).notNullable();
      table.string("marketID", 66).notNullable();
      table.string("stakeToken", 42).notNullable();
      table.specificType("amountStaked", "NUMERIC");
      table.integer("winningToken").nullable();
      table.integer("claimed").notNullable();

      table.unique(["transactionHash", "logIndex"]);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("reports");
};
