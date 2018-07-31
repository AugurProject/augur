import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("orders_canceled").then(async (): Promise<any> => {
    return knex.schema.createTable("orders_canceled", (table: Knex.CreateTableBuilder): void => {
      table.string("orderId", 42).primary().notNullable();
      table.specificType("blockNumber", "integer NOT NULL CONSTRAINT positiveOrderBlockNumber CHECK (\"blockNumber\" > 0)");
      table.string("transactionHash", 66).notNullable();
      table.specificType("logIndex", "integer NOT NULL CONSTRAINT \"nonnegativelogIndex\" CHECK (\"logIndex\" >= 0)");
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("orders_canceled");
};
