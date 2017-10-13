import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("transfers").then((): PromiseLike<any> => {
    return knex.schema.raw(`CREATE TABLE transfers (
      transactionHash varchar(66) NOT NULL,
      logIndex integer NOT NULL CONSTRAINT nonnegativeLogIndex CHECK (logIndex >= 0),
      sender varchar(66) NOT NULL,
      recipient varchar(66) NOT NULL,
      token varchar(66) NOT NULL,
      value numeric NOT NULL CONSTRAINT positiveValue CHECK (value > 0),
      blockNumber integer NOT NULL CONSTRAINT positiveBlockNumber CHECK (blockNumber > 0),
      UNIQUE(transactionHash, logIndex)
    )`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("transfers");
};
