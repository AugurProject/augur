import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("transactionHashes").then((): PromiseLike<any> => {
    return knex.schema.raw(`CREATE TABLE "transactionHashes" (
      "transactionHash" varchar(66) PRIMARY KEY NOT NULL,
      "blockNumber" integer NOT NULL,
      "removed" bool DEFAULT false
    )`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("transactionHashes");
};
