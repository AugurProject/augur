import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.hasColumn("markets", "lastTradeBlockNumber").then((exists) => {
    if (!exists) return knex.schema.table("markets", (t) => t.integer("lastTradeBlockNumber"));
    return;
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.table("markets", (table: Knex.CreateTableBuilder): void => {
    table.dropColumn("lastTradeBlockNumber");
  });
};
