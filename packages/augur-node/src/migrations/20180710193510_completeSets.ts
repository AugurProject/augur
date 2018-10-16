import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("completeSets").then((): PromiseLike<any> => {
    return knex.schema.createTable("completeSets", (table: Knex.CreateTableBuilder): void => {
      table.string("transactionHash", 66).notNullable();
      table.specificType("logIndex", "integer NOT NULL CONSTRAINT \"nonnegativelogIndex\" CHECK (\"logIndex\" >= 0)");
      table.string("account", 42).notNullable();
      table.string("marketId", 42).notNullable();
      table.integer("tradeGroupId");
      table.text("eventName").nullable();
      table.string("universe", 42).notNullable();
      table.specificType("numCompleteSets", "varchar(255) CONSTRAINT \"nonnegativeNumCompleteSets\" CHECK (ltrim(\"numCompleteSets\", '-') = \"numCompleteSets\")");
      table.specificType("numPurchasedOrSold", "varchar(255) CONSTRAINT \"nonnegativeNumPurchasedOrSold\" CHECK (ltrim(\"numPurchasedOrSold\", '-') = \"numPurchasedOrSold\")");
      table.specificType("blockNumber", "integer NOT NULL CONSTRAINT positiveCompleteSetsBlockNumber CHECK (\"blockNumber\" > 0)");
      table.unique(["transactionHash", "logIndex"]);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("completeSets");
};
