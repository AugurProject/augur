import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("crowdsourcers").then( (): PromiseLike<any> => {
    return knex.schema.createTable("crowdsourcers", (table: Knex.CreateTableBuilder): void => {
      table.string("crowdsourcerID", 42).primary().notNullable();
      table.string("marketID", 42).notNullable();
      table.integer("payoutID").notNullable();

      table.index(["marketID"]);
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("crowdsourcers");
};
