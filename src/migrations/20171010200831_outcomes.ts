import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("outcomes").then(() => {
    return knex.schema.raw(`CREATE TABLE outcomes (
      market_id varchar(42) NOT NULL,
      outcome integer NOT NULL,
      price numeric,
      shares_outstanding numeric,
      UNIQUE(market_id, outcome)
    )`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("outcomes");
};
