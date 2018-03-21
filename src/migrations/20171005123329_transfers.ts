import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("transfers").then((): PromiseLike<any> => {
    return knex.schema.raw(`CREATE TABLE transfers (
      "transactionHash" varchar(66) NOT NULL,
      "logIndex" unsigned integer NOT NULL CONSTRAINT "nonnegativeTransferLogIndex" CHECK ("logIndex" >= 0),
      sender varchar(66),
      recipient varchar(66),
      token varchar(66) NOT NULL,
      value VARCHAR(255) NOT NULL,
      "blockNumber" integer NOT NULL CONSTRAINT "positiveTransferBlockNumber" CHECK ("blockNumber" > 0),
      UNIQUE("transactionHash", "logIndex")
    )`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("transfers");
};
