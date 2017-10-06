import * as Knex from "knex";
import Promise = require("bluebird");

exports.up = function (knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists("blockchain_sync_history").then(() => {
    return knex.schema.raw(`CREATE TABLE blockchain_sync_history (
              id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
              highest_block_number integer NOT NULL CONSTRAINT nonnegative_highest_block_number CHECK (highest_block_number >= 0),
              sync_time timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
            )`);
  });
};

exports.down = function (knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists("blockchain_sync_history");
};
