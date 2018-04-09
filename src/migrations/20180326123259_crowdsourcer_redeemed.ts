import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("crowdsourcer_redeemed").then((): PromiseLike<any> => {
    return knex.schema.createTable("crowdsourcer_redeemed", (table: Knex.CreateTableBuilder): void => {
      table.string("reporter", 42).notNullable();
      table.string("crowdsourcer", 42).notNullable();
      table.specificType("blockNumber", "integer NOT NULL CONSTRAINT positiveOrderBlockNumber CHECK (\"blockNumber\" > 0)");
      table.string("transactionHash", 66).notNullable();
      table.specificType("logIndex", "integer NOT NULL CONSTRAINT \"nonnegativelogIndex\" CHECK (\"logIndex\" >= 0)");
      table.string("amountRedeemed", 255);
      table.string("repReceived", 255);
      table.string("reportingFeesReceived", 255);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("crowdsourcer_redeemed");
};
