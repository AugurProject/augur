import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("trades").then(async (): Promise<any> => {
    return knex.schema.createTable("trades", (table: Knex.CreateTableBuilder): void => {
      table.string("transactionHash", 66).notNullable(),
      table.specificType("logIndex", "integer NOT NULL CONSTRAINT \"nonnegativelogIndex\" CHECK (\"logIndex\" >= 0)"),
      table.specificType("blockNumber", "integer NOT NULL CONSTRAINT positiveOrderBlockNumber CHECK (\"blockNumber\" > 0)");
      table.string("orderId", 42).notNullable();
      table.string("marketId", 42).notNullable();
      table.specificType("outcome", "integer NOT NULL CONSTRAINT \"nonnegativeTradeOutcome\" CHECK (outcome >= 0)");
      table.string("shareToken", 42).notNullable();
      table.specificType("orderType", "varchar(4) NOT NULL CONSTRAINT \"enumTradeOrderTypes\" CHECK (\"orderType\" = 'buy' OR \"orderType\" = 'sell')");
      table.string("creator", 42).notNullable();
      table.string("filler", 42).notNullable();
      table.string("numCreatorTokens", 255);
      table.string("numCreatorShares", 255);
      table.string("numFillerTokens", 255);
      table.string("numFillerShares", 255);
      table.string("reporterFees", 255);
      table.string("marketCreatorFees", 255);
      table.string("price", 255).notNullable();
      table.string("amount", 255).notNullable();
      table.integer("tradeGroupId");

      table.unique(["transactionHash", "logIndex"]);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("trades");
};
