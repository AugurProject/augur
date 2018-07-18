import * as Knex from "knex";

const KNOWN_ORPHANED_ORDERS = [
  "",
];

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.hasColumn("orders", "orphaned").then((exists) => {
    if (!exists) knex.schema.table("orders", (t) => t.boolean("orphaned")).then(() => {
      return knex.from("orders").whereIn("orderId", KNOWN_ORPHANED_ORDERS).update({orphaned: true});
    });
    return;
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.table("orders", (table: Knex.CreateTableBuilder): void => {
    table.dropColumn("orphaned");
  });
};
