import * as Knex from "knex";
import { promisify } from "util";
import { updateOpenInterest } from "../blockchain/log-processors/order-filled/update-volumetrics";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.hasColumn("markets", "openInterest").then(async(exists) => {
    if (!exists) await knex.schema.table("markets", (t) => t.string("openInterest").defaultTo("0"));
    const markets = await knex.select("marketId").from("markets");
    for (const market of markets) {
      await promisify(updateOpenInterest)(knex, market.marketId);
    }
    return;
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.table("markets", (table: Knex.CreateTableBuilder): void => {
    table.dropColumn("openInterest");
  });
};
