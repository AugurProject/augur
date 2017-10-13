import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("categories").then((): PromiseLike<any> => {
    return knex.schema.raw(`CREATE TABLE categories (
          category varchar(255) PRIMARY KEY NOT NULL,
          popularity integer DEFAULT 0,
          universe varchar(66) NOT NULL
    )`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("categories");
};
