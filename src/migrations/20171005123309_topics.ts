import * as Knex from "knex";
import Promise = require("bluebird");

exports.up = function (knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists("topics").then(() => {
    return knex.schema.raw(`CREATE TABLE topics (
                  topic varchar(255) PRIMARY KEY NOT NULL,
                  popularity integer DEFAULT 0,
                  universe varchar(66) NOT NULL
            )`);
  });
};

exports.down = function (knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists("topics");
};
