import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("balances").then((): PromiseLike<any> => {
    // TODO: re-add to balance CONSTRAINT nonnegativeBalance CHECK (balance >= 0)
    return knex.schema.raw(`CREATE TABLE balances (
      owner varchar(66) NOT NULL,
      token varchar(66) NOT NULL,
      balance numeric NOT NULL DEFAULT 0,
      UNIQUE(owner, token)
    )`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("balances");
};
