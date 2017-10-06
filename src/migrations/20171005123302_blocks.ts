import * as Knex from "knex";
import Promise = require("bluebird");

exports.up = function (knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists("blocks").then(() => {
    return knex.schema.raw(`CREATE TABLE blocks (
              block_number integer PRIMARY KEY NOT NULL,
              block_timestamp integer NOT NULL
            )`);
  });
};

exports.down = function (knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists("blocks");
};
