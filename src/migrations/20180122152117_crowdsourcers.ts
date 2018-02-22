import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("crowdsourcers").then( (): PromiseLike<any> => {
    return knex.schema.createTable("crowdsourcers", (table: Knex.CreateTableBuilder): void => {
      table.string("crowdsourcerId", 42).primary().notNullable();

      table.specificType("blockNumber", "integer NOT NULL CONSTRAINT positiveOrderBlockNumber CHECK (\"blockNumber\" > 0)");
      table.string("transactionHash", 66).notNullable();
      table.specificType("logIndex", "integer NOT NULL CONSTRAINT \"nonnegativelogIndex\" CHECK (\"logIndex\" >= 0)");

      table.string("marketId", 42).notNullable();
      table.string("feeWindow", 42).notNullable();
      table.integer("payoutId").notNullable();

      table.specificType("size", "numeric NOT NULL CONSTRAINT \"nonnegativeSize\" CHECK (\"size\" >= 0)");
      table.specificType("amountStaked", "numeric").defaultTo(0);
      table.integer("completed").nullable();

      table.index(["marketId"]);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("crowdsourcers");
};
