import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("trading_proceeds").then( (): PromiseLike<any> => {
    return knex.schema.createTable("trading_proceeds", (table: Knex.CreateTableBuilder): void => {
      table.string("marketId", 42).notNullable();
      table.string("account", 42).notNullable();
      table.string("shareToken", 42).notNullable();
      table.string("numShares", 255).defaultTo("0");
      table.string("numPayoutTokens", 255).defaultTo("0");
      table.specificType("blockNumber", "integer NOT NULL CONSTRAINT positiveOrderBlockNumber CHECK (\"blockNumber\" > 0)");
      table.string("transactionHash", 66).notNullable();
      table.specificType("logIndex", "integer NOT NULL CONSTRAINT \"nonnegativelogIndex\" CHECK (\"logIndex\" >= 0)");

      table.unique(["transactionHash", "logIndex"]);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("trading_proceeds");
};
