import * as Knex from "knex";

// PRIMARY KEY AUTOINCREMENT pgsql compat issue? TODO: use .primary()
exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("market_state").then( (): PromiseLike<any> => {
    return knex.schema.raw(`CREATE TABLE market_state (
      "marketStateID" integer PRIMARY KEY AUTOINCREMENT,
      "marketID" varchar(66) NOT NULL,
      phase numeric,
      "isDisputed" boolean,
      "blockNumber" integer NOT NULL
    )`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("market_state");
};
