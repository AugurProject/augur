import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("tokens").then((): PromiseLike<any> => {
    return knex.schema.raw(`CREATE TABLE tokens (
      "contractAddress" varchar(66) PRIMARY KEY NOT NULL,
      "symbol" varchar(255) NOT NULL,
      "marketID" varchar(66),
      "outcome" integer,
      UNIQUE(symbol, marketID, outcome)
    )`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("tokens");
};
