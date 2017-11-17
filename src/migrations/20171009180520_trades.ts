import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("trades").then(async (): Promise<any> => {
    return knex.schema.createTable("trades", (table: Knex.CreateTableBuilder): void => {
      table.string("transactionHash", 66).notNullable(),
      table.specificType("transactionIndex", "integer NOT NULL CONSTRAINT \"nonnegativeTransactionIndex\" CHECK (\"transactionIndex\" >= 0)"),
      table.specificType("blockNumber", "integer NOT NULL CONSTRAINT positiveOrderBlockNumber CHECK (\"blockNumber\" > 0)");
      table.string("blockHash", 66).notNullable(),
      table.string("orderID", 42).notNullable();
      table.string("marketID", 42).notNullable();
      table.specificType("outcome", "integer NOT NULL CONSTRAINT \"nonnegativeTradeOutcome\" CHECK (outcome >= 0)");
      table.string("shareToken", 42).notNullable();
      table.specificType("orderType", "varchar(4) NOT NULL CONSTRAINT \"enumTradeOrderTypes\" CHECK (\"orderType\" = 'buy' OR \"orderType\" = 'sell')");
      table.string("creator", 42).notNullable();
      table.string("filler", 42).notNullable();
      table.specificType("numCreatorTokens", "numeric NOT NULL CONSTRAINT \"nonnegativeNumCreatorTokens\" CHECK (\"numCreatorTokens\" >= 0)");
      table.specificType("numCreatorShares", "numeric NOT NULL CONSTRAINT \"nonnegativeNumCreatorShares\" CHECK (\"numCreatorShares\" >= 0)");
      table.specificType("numFillerTokens", "numeric NOT NULL CONSTRAINT \"nonnegativeNumFillerTokens\" CHECK (\"numFillerTokens\" >= 0)");
      table.specificType("numFillerShares", "numeric NOT NULL CONSTRAINT \"nonnegativeNumFillerShares\" CHECK (\"numFillerShares\" >= 0)");
      table.specificType("settlementFees", "numeric NOT NULL CONSTRAINT \"nonnegativeSettlementFees\" CHECK (\"settlementFees\" >= 0)");
      table.specificType("price", "NUMERIC").notNullable();
      table.specificType("amount", "NUMERIC").notNullable();
      table.integer("tradeGroupID");

      table.unique(["transactionHash", "transactionIndex"]);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("trades");
};
