import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("categories").then(async (): Promise<any> => {
    return knex.schema.createTable("categories", (table: Knex.CreateTableBuilder): void => {
    table.string("category", 255).notNullable();
    table.integer("popularity");
    table.string("universe", 66).notNullable();

    table.unique(["universe", "category"]);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("categories");
};
