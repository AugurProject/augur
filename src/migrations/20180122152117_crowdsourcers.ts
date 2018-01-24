import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("crowdsourcers").then( (): PromiseLike<any> => {
    return knex.schema.createTable("crowdsourcers", (table: Knex.CreateTableBuilder): void => {
      table.string("crowdsourcerID", 42).primary().notNullable();

      table.specificType("blockNumber", "integer NOT NULL CONSTRAINT positiveOrderBlockNumber CHECK (\"blockNumber\" > 0)");
      table.string("transactionHash", 66).notNullable();
      table.specificType("logIndex", "integer NOT NULL CONSTRAINT \"nonnegativelogIndex\" CHECK (\"logIndex\" >= 0)");

      table.string("marketID", 42).notNullable();
      table.integer("payoutID").notNullable();

      table.specificType("size", "numeric NOT NULL CONSTRAINT \"nonnegativeSize\" CHECK (\"size\" >= 0)");
      table.integer("completed").nullable();

      table.index(["marketID"]);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("crowdsourcers");
};
