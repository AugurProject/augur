import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("universes").then( (): PromiseLike<any> => {
    return knex.schema.createTable("universes", (table: Knex.CreateTableBuilder): void => {
      table.string("universe", 42).primary().notNullable();
      table.string("parentUniverse", 42).nullable();
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("universes");
};
