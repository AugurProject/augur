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

      table.string("size", 255);
      table.string("amountStaked", 255).defaultTo("0").notNullable();
      table.integer("completed").nullable();
      table.boolean("disavowed").defaultTo(0).notNullable();

      table.index(["marketId"]);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("crowdsourcers");
};
