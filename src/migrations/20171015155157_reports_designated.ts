import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("reports_designated").then( (): PromiseLike<any> => {
    return  knex.schema.createTable("reports_designated", (table: Knex.CreateTableBuilder): void => {
      table.increments("reportDesignatedID");
      table.string("marketID", 66).notNullable();
      for (let i: number = 0; i <= 7; i++ ) {
        table.specificType(`payout${i}`, "NUMERIC").nullable();
      }
      table.integer("isInvalid");
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("reports_designated");
};
