import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("outcome_value_timeseries").then((): PromiseLike<any> => {
    return knex.schema.createTable("outcome_value_timeseries", (table: Knex.CreateTableBuilder): void => {
      table.string("marketId", 42).notNullable();
      table.specificType("outcome", "integer NOT NULL CONSTRAINT nonnegativeOutcome CHECK (outcome >= 0)");
      table.string("transactionHash", 66).notNullable();
      table.string("value", 255);
      table.specificType("timestamp", "integer NOT NULL CONSTRAINT nonnegativeTimestamp CHECK (\"timestamp\" >= 0)");
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("outcome_value_timeseries");
};
