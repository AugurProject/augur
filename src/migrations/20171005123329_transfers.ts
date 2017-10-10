import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("transfers").then(() => {
    return knex.schema.raw(`CREATE TABLE transfers (
      transaction_hash varchar(66) NOT NULL,
      log_index integer NOT NULL CONSTRAINT nonnegative_log_index CHECK (log_index >= 0),
      sender varchar(66) NOT NULL,
      recipient varchar(66) NOT NULL,
      token varchar(66) NOT NULL,
      value numeric NOT NULL CONSTRAINT positive_value CHECK (value > 0),
      block_number integer NOT NULL CONSTRAINT positive_block_number CHECK (block_number > 0),
      UNIQUE(transaction_hash, log_index)
    )`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("transfers");
};
