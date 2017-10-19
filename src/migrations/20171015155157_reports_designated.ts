import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("reports_designated").then( (): PromiseLike<any> => {
    return  knex.schema.createTable("reports_designated", (table: Knex.CreateTableBuilder) => {
      table.increments("reportDesignatedID");
      table.string("marketID", 66).notNullable();
      // TODO: discuss correct datatype
      for (let i: number = 0; i <= 14; i++ ) {
        table.integer("payout" + i).nullable();
      }
      table.integer("isInvalid");
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("reports_designated");
};
