import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("positions").then(async (): Promise<any> => {
    return knex.schema.createTable("positions", (table: Knex.CreateTableBuilder): void => {
      table.increments("positionId").primary().notNullable();
      table.string("account", 66).notNullable();
      table.string("marketId", 66).notNullable();
      table.integer("outcome").notNullable();
      table.string("numShares", 255).defaultTo("0").nullable();
      table.string("numSharesAdjustedForUserIntention", 255).defaultTo("0").nullable();
      table.string("realizedProfitLoss", 255).defaultTo("0").nullable();
      table.string("unrealizedProfitLoss", 255).defaultTo("0").nullable();
      table.string("averagePrice", 255).defaultTo("0").nullable();
      table.timestamp("lastUpdated").defaultTo(knex.fn.now()).notNullable();
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("positions");
};
