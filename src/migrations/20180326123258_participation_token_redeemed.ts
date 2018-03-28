import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("participation_token_redeemed").then((): PromiseLike<any> => {
    return knex.schema.createTable("participation_token_redeemed", (table: Knex.CreateTableBuilder): void => {
      table.string("reporter", 42).notNullable();
      table.string("feeWindow", 42).notNullable();
      table.specificType("blockNumber", "integer NOT NULL CONSTRAINT positiveOrderBlockNumber CHECK (\"blockNumber\" > 0)");
      table.string("transactionHash", 66).notNullable();
      table.specificType("logIndex", "integer NOT NULL CONSTRAINT \"nonnegativelogIndex\" CHECK (\"logIndex\" >= 0)");
      table.string("amountRedeemed", 255);
      table.string("reportingFeesReceived", 255);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("participation_token_redeemed");
};
