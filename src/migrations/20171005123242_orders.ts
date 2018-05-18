import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("orders").then(async (): Promise<any> => {
    return knex.schema.createTable("orders", (table: Knex.CreateTableBuilder): void => {
      table.string("orderId", 42).primary().notNullable();
      table.specificType("blockNumber", "integer NOT NULL CONSTRAINT positiveOrderBlockNumber CHECK (\"blockNumber\" > 0)");
      table.string("transactionHash", 66).notNullable();
      table.specificType("logIndex", "integer NOT NULL CONSTRAINT \"nonnegativelogIndex\" CHECK (\"logIndex\" >= 0)");
      table.string("marketId", 42).notNullable();
      table.specificType("outcome", "integer NOT NULL CONSTRAINT nonnegativeOutcome CHECK (outcome >= 0)");
      table.string("shareToken", 42).notNullable();
      table.specificType("orderType", "varchar(4) NOT NULL CONSTRAINT enumOrderTypes CHECK (\"orderType\" = 'buy' OR \"orderType\" = 'sell')");
      table.string("orderCreator", 42).notNullable();
      table.specificType("orderState", "varchar(9) NOT NULL CONSTRAINT enumOrderStates CHECK (\"orderState\" = 'OPEN' OR \"orderState\" = 'CLOSED' OR \"orderState\" = 'CANCELED')");
      table.string("fullPrecisionPrice", 255).notNullable();
      table.string("fullPrecisionAmount", 255).notNullable();
      table.string("price", 255).notNullable();
      table.specificType("amount", "varchar(255) NOT NULL CONSTRAINT nonnegativeAmount CHECK (ltrim(\"amount\", '-') = \"amount\")");
      table.specificType("tokensEscrowed", "varchar(255) NOT NULL CONSTRAINT nonnegativeTokensEscrowed CHECK (ltrim(\"tokensEscrowed\", '-') = \"tokensEscrowed\")");
      table.specificType("sharesEscrowed", "varchar(255) NOT NULL CONSTRAINT nonnegativeSharesEscrowed CHECK (ltrim(\"sharesEscrowed\", '-') = \"sharesEscrowed\")");
      table.string("tradeGroupId", 42);
      table.integer("isRemoved").nullable();
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("orders");
};
