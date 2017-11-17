import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("orders").then(async (): Promise<any> => {
    return knex.schema.createTable("orders", (table: Knex.CreateTableBuilder): void => {
      table.string("orderID", 42).primary().notNullable();
      table.specificType("blockNumber", "integer NOT NULL CONSTRAINT positiveOrderBlockNumber CHECK (\"blockNumber\" > 0)");
      table.string("blockHash", 66).notNullable(),
      table.string("transactionHash", 66).notNullable(),
      table.specificType("transactionIndex", "integer NOT NULL CONSTRAINT \"nonnegativeTransactionIndex\" CHECK (\"transactionIndex\" >= 0)"),
      table.string("marketID", 42).notNullable();
      table.specificType("outcome", "integer NOT NULL CONSTRAINT nonnegativeOutcome CHECK (outcome >= 0)");
      table.string("shareToken", 42).notNullable();
      table.specificType("orderType", "varchar(4) NOT NULL CONSTRAINT enumOrderTypes CHECK (\"orderType\" = 'buy' OR \"orderType\" = 'sell')");
      table.string("orderCreator", 42).notNullable();
      table.specificType("orderState", "varchar(9) NOT NULL CONSTRAINT enumOrderStates CHECK (\"orderState\" = 'OPEN' OR \"orderState\" = 'CLOSED' OR \"orderState\" = 'CANCELED')");
      table.specificType("fullPrecisionPrice", "NUMERIC").notNullable();
      table.specificType("fullPrecisionAmount", "NUMERIC").notNullable();
      table.specificType("price", "NUMERIC").notNullable();
      table.specificType("amount", "numeric NOT NULL CONSTRAINT nonnegativeAmount CHECK (\"amount\" >= 0)").notNullable();
      table.specificType("tokensEscrowed", "numeric NOT NULL CONSTRAINT nonnegativeTokensEscrowed CHECK (\"tokensEscrowed\" >= 0)").notNullable();
      table.specificType("sharesEscrowed", "numeric NOT NULL CONSTRAINT nonnegativeSharesEscrowed CHECK (\"sharesEscrowed\" >= 0)").notNullable();
      table.string("tradeGroupID", 42);
      table.integer("isRemoved").nullable();
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("orders");
};
