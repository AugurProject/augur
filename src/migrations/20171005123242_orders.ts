import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("orders").then(async (): Promise<any> => {
    return knex.schema.createTable("orders", (table: Knex.CreateTableBuilder): void => {
      table.string("orderId", 66).primary().notNullable();
      table.specificType("blockNumber", "integer NOT NULL CONSTRAINT positiveOrderBlockNumber CHECK (\"blockNumber\" > 0)");
      table.string("transactionHash", 66).notNullable();
      table.specificType("logIndex", "integer NOT NULL CONSTRAINT \"nonnegativelogIndex\" CHECK (\"logIndex\" >= 0)");
      table.string("marketId", 42).notNullable();
      table.specificType("outcome", "integer NOT NULL CONSTRAINT nonnegativeOutcome CHECK (outcome >= 0)");
      table.string("shareToken", 42).notNullable();
      table.specificType("orderType", "varchar(4) NOT NULL CONSTRAINT enumOrderTypes CHECK (\"orderType\" = 'buy' OR \"orderType\" = 'sell')");
      table.string("orderCreator", 42).notNullable();
      table.specificType("orderState", "varchar(9) NOT NULL CONSTRAINT enumOrderStates CHECK (\"orderState\" = 'OPEN' OR \"orderState\" = 'FILLED' OR \"orderState\" = 'CANCELED')");
      table.string("fullPrecisionPrice", 255).notNullable();
      table.string("fullPrecisionAmount", 255).notNullable();
      table.string("originalFullPrecisionAmount", 255).notNullable();
      table.string("price", 255).notNullable();
      table.specificType("amount", "varchar(255) NOT NULL CONSTRAINT nonnegativeAmount CHECK (ltrim(\"amount\", '-') = \"amount\")");
      // Originally this constraint was called nonnegativeAmount,
      // but it is not allowed in Postgres to have two constraints with the same name.
      // So the constraint is renamed but for SQLite3 it is the same to keep compatibility.
      table.specificType("originalAmount", `varchar(255) NOT NULL CONSTRAINT ${knex.client.config.client === "sqlite3" ? "nonnegativeAmount" : "nonnegativeOriginalAmount"} CHECK (ltrim(\"amount\", '-') = \"amount\")`);
      table.specificType("tokensEscrowed", "varchar(255) NOT NULL CONSTRAINT nonnegativeTokensEscrowed CHECK (ltrim(\"tokensEscrowed\", '-') = \"tokensEscrowed\")");
      table.specificType("sharesEscrowed", "varchar(255) NOT NULL CONSTRAINT nonnegativeSharesEscrowed CHECK (ltrim(\"sharesEscrowed\", '-') = \"sharesEscrowed\")");
      table.string("tradeGroupId", 42);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("orders");
};
