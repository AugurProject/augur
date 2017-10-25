import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("positions").then(async (): Promise<any> => {
    return knex.schema.createTable("positions", (table: Knex.CreateTableBuilder): void => {
      table.increments("positionID").primary().notNullable();
      table.string("account", 66).notNullable();
      table.string("marketID", 66).notNullable();
      table.integer("outcome").notNullable();
      table.specificType("numShares", "NUMERIC").defaultTo(0).nullable();
      table.specificType("numSharesAdjustedForUserIntention", "NUMERIC").defaultTo(0).nullable();
      table.specificType("realizedProfitLoss", "NUMERIC").defaultTo(0).nullable();
      table.specificType("unrealizedProfitLoss", "NUMERIC").defaultTo(0).nullable();
      table.timestamp("lastUpdated").defaultTo(knex.fn.now()).notNullable();
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("positions");
};
