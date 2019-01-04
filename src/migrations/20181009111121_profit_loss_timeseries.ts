import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("profit_loss_timeseries").then((): PromiseLike<any> => {
    return knex.schema.createTable("profit_loss_timeseries", (table: Knex.CreateTableBuilder): void => {
      table.string("account", 42).notNullable();
      table.string("marketId", 42).notNullable();
      table.specificType("outcome", "integer NOT NULL CONSTRAINT nonnegativeOutcome CHECK (outcome >= 0)");
      table.string("transactionHash", 66).notNullable();
      table.string("moneySpent", 255);
      table.string("numOwned", 255);
      table.string("numEscrowed", 255);
      table.string("profit", 255);
      table.specificType("timestamp", "integer NOT NULL CONSTRAINT nonnegativeTimestamp CHECK (\"timestamp\" >= 0)");
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("profit_loss_timeseries");
};
