import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("reports_designated").then( (): PromiseLike<any> => {
    return  knex.schema.createTable("reports_designated", (table: Knex.CreateTableBuilder): void => {
      table.increments("reportDesignatedID");
      table.string("marketID", 42).notNullable();
      table.string("stakeToken", 42).notNullable();
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("reports_designated");
};
