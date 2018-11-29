import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.hasColumn("blocks", "bulkSync").then(async(exists) => {
    if (!exists) await knex.schema.table("blocks", (t) => t.boolean("bulkSync").defaultTo(false));
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.table("blocks", (table: Knex.CreateTableBuilder): void => {
    table.dropColumn("bulkSync");
  });
};
