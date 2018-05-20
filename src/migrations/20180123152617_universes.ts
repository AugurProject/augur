import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("universes").then( (): PromiseLike<any> => {
    return knex.schema.createTable("universes", (table: Knex.CreateTableBuilder): void => {
      table.string("universe", 42).primary().notNullable();
      table.string("parentUniverse", 42).nullable();
      table.integer("payoutId").nullable();
      table.string("reputationToken", 42).notNullable();
      table.boolean("forked").notNullable();
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("universes");
};
