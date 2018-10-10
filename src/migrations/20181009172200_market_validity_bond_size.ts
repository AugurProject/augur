import * as Knex from "knex";
import { ETHER} from "../constants";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.hasColumn("markets", "validityBondSize").then(async(exists) => {
    if (!exists) {
      await knex.schema.table("markets", (t) => {
        t.string("validityBondSize").defaultTo("0");
        t.string("transactionHash", 66);
        t.specificType("logIndex", "integer NOT NULL CONSTRAINT \"nonnegativelogIndex\" CHECK (\"logIndex\" >= 0)").defaultTo(0);
      });
    }
    const etherTokenRow = await knex("tokens").where("contractAddress", "ether");
    if (etherTokenRow.length === 0) {
      knex.insert({contractAddress: ETHER, symbol: ETHER}).into("tokens");
      knex.insert({token: ETHER, supply: null}).into("token_supply");
    }
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  await knex.schema.table("markets", (table: Knex.CreateTableBuilder): void => {
    table.dropColumn("validityBondSize");
  });
};
