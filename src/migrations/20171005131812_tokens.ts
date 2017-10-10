import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("tokens").then(() => {
    return knex.schema.raw(`CREATE TABLE tokens (
      contract_address varchar(66) PRIMARY KEY NOT NULL,
      symbol varchar(255) NOT NULL,
      market varchar(66),
      outcome integer,
      UNIQUE(symbol, market, outcome)
    )`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("tokens");
};
