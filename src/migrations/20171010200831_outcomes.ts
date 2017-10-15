import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("outcomes").then((): PromiseLike<any> => {
    return knex.schema.raw(`CREATE TABLE outcomes (
      marketID varchar(42) NOT NULL,
      outcome integer NOT NULL,
      price numeric,
      sharesOutstanding numeric,
      UNIQUE(marketID, outcome)
    )`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("outcomes");
};
