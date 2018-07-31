import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("balances").then((): PromiseLike<any> => {
    return knex.schema.raw(`CREATE TABLE balances (
      owner varchar(66) NOT NULL,
      token varchar(66) NOT NULL,
      balance varchar(255) NOT NULL DEFAULT "0" CONSTRAINT nonnegativeBalance CHECK (ltrim(balance, '-') = balance),
      UNIQUE(owner, token)
    )`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("balances");
};
