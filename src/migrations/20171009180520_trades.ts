import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("trades").then(async (): Promise<any> => {
    return knex.schema.createTable("trades", (table: Knex.CreateTableBuilder): void => {
      table.string("transactionHash", 66).notNullable();
      table.specificType("logIndex", "integer NOT NULL CONSTRAINT \"nonnegativelogIndex\" CHECK (\"logIndex\" >= 0)");
      table.specificType("blockNumber", "integer NOT NULL CONSTRAINT positiveOrderBlockNumber CHECK (\"blockNumber\" > 0)");
      table.string("orderId", 42).notNullable();
      table.string("marketId", 42).notNullable();
      table.specificType("outcome", "integer NOT NULL CONSTRAINT \"nonnegativeTradeOutcome\" CHECK (outcome >= 0)");
      table.string("shareToken", 42).notNullable();
      table.specificType("orderType", "varchar(4) NOT NULL CONSTRAINT \"enumTradeOrderTypes\" CHECK (\"orderType\" = 'buy' OR \"orderType\" = 'sell')");
      table.string("creator", 42).notNullable();
      table.string("filler", 42).notNullable();
      table.specificType("numCreatorTokens", "varchar(255) NOT NULL CONSTRAINT \"nonnegativeNumCreatorTokens\" CHECK (ltrim(\"numCreatorTokens\", '-') = \"numCreatortokens\")");
      table.specificType("numCreatorShares", "varchar(255) NOT NULL CONSTRAINT \"nonnegativeNumCreatorShares\" CHECK (ltrim(\"numCreatorShares\", '-') = \"numCreatorShares\")");
      table.specificType("numFillerTokens", "varchar(255) NOT NULL CONSTRAINT \"nonnegativeNumFillerTokens\" CHECK (ltrim(\"numFillerTokens\", '-') = \"numFillerTokens\")");
      table.specificType("numFillerShares", "varchar(255) NOT NULL CONSTRAINT \"nonnegativeNumFillerShares\" CHECK (ltrim(\"numFillerShares\", '-') = \"numFillerShares\")");
      table.specificType("reporterFees", "varchar(255) NOT NULL CONSTRAINT \"nonnegativeSettlementFees\" CHECK (ltrim(\"reporterFees\", '-') = \"reporterFees\")");
      table.specificType("marketCreatorFees", "varchar(255) NOT NULL CONSTRAINT \"nonnegativeSettlementFees\" CHECK (ltrim(\"marketCreatorFees\", '-') = \"marketCreatorFees\")");
      table.specificType("price", "varchar(255)");
      table.specificType("amount", "varchar(255) CONSTRAINT \"nonnegativeAmount\" CHECK (ltrim(\"amount\", '-') = \"amount\")");
      table.integer("tradeGroupId");

      table.unique(["transactionHash", "logIndex"]);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("trades");
};
