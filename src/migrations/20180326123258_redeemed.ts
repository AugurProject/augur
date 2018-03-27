import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("redeemed").then((): PromiseLike<any> => {
    // TODO: re-add to balance CONSTRAINT nonnegativeBalance CHECK (balance >= 0)
    return knex.schema.createTable("redeemed", (table: Knex.CreateTableBuilder): void => {
      table.string("owner", 42).notNullable();
      table.string("feeWindow", 42).notNullable();
      table.specificType("blockNumber", "integer NOT NULL CONSTRAINT positiveOrderBlockNumber CHECK (\"blockNumber\" > 0)");
      table.string("transactionHash", 66).notNullable();
      table.specificType("logIndex", "integer NOT NULL CONSTRAINT \"nonnegativelogIndex\" CHECK (\"logIndex\" >= 0)");
      table.string("ethFees", 255);
      table.string("repFees", 255);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("redeemed");
};
