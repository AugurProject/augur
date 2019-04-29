import Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.table("categories", (table: Knex.CreateTableBuilder): void => {
    table.dropColumns("popularity");
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.table("categories", (table: Knex.CreateTableBuilder): void => {
    table.specificType("popularity", "numeric").defaultTo(0); // NB correct value of popularity is lost
  });
};
