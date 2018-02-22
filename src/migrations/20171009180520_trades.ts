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
      table.specificType("numCreatorTokens", "numeric NOT NULL CONSTRAINT \"nonnegativeNumCreatorTokens\" CHECK (\"numCreatorTokens\" >= 0)");
      table.specificType("numCreatorShares", "numeric NOT NULL CONSTRAINT \"nonnegativeNumCreatorShares\" CHECK (\"numCreatorShares\" >= 0)");
      table.specificType("numFillerTokens", "numeric NOT NULL CONSTRAINT \"nonnegativeNumFillerTokens\" CHECK (\"numFillerTokens\" >= 0)");
      table.specificType("numFillerShares", "numeric NOT NULL CONSTRAINT \"nonnegativeNumFillerShares\" CHECK (\"numFillerShares\" >= 0)");
      table.specificType("reporterFees", "numeric NOT NULL CONSTRAINT \"nonnegativeReporterFees\" CHECK (\"reporterFees\" >= 0)");
      table.specificType("marketCreatorFees", "numeric NOT NULL CONSTRAINT \"nonnegativeMarketCreatorFees\" CHECK (\"marketCreatorFees\" >= 0)");
      table.specificType("price", "numeric").notNullable();
      table.specificType("amount", "numeric").notNullable();
      table.integer("tradeGroupId");

      table.unique(["transactionHash", "logIndex"]);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("trades");
};
