import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("blocks").then((): PromiseLike<any> => {
    return knex.schema.raw(`CREATE TABLE blocks (
      "blockNumber" integer PRIMARY KEY NOT NULL,
      "blockHash" varchar(66) NOT NULL,
      "timestamp" integer NOT NULL
    )`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("blocks");
};
