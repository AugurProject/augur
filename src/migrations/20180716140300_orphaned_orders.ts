import * as Knex from "knex";

const KNOWN_ORPHANED_ORDERS = [
  "",
];

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.table("orders", (table: Knex.CreateTableBuilder): void => {
    table.boolean("orphaned").defaultTo(false);
  });
  knex.from("orders").whereIn("orderId", KNOWN_ORPHANED_ORDERS).update({orphaned: true});
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.table("orders", (table: Knex.CreateTableBuilder): void => {
    table.dropColumn("orphaned");
  });
};
