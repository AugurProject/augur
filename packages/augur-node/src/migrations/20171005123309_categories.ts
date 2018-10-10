import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("categories").then(async (): Promise<any> => {
    return knex.schema.createTable("categories", (table: Knex.CreateTableBuilder): void => {
    table.string("category", 255).notNullable();
    table.specificType("popularity", "numeric").defaultTo(0);
    table.string("universe", 66).notNullable();

    table.primary(["universe", "category"]);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("categories");
};
