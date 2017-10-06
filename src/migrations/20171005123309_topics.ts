import * as Knex from "knex";
import Promise = require("bluebird");

exports.up = function (knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists("topics").then(() => {
    return knex.schema.raw(`CREATE TABLE topics (
              name varchar(255) PRIMARY KEY NOT NULL,
              popularity integer DEFAULT 0
            )`);
  });
};

exports.down = function (knex: Knex): Promise<any> {
  return knex.schema.dropTableIfExists("topics");
};
