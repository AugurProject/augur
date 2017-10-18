import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("reports_designated").then( (): void => {
    knex.schema.raw(`CREATE TABLE reports_designated (
      "marketID" varchar(66) NOT NULL,
      payout0 numeric,
      payout1 numeric,
      payout2 numeric,
      payout3 numeric,
      payout4 numeric,
      payout5 numeric,
      payout6 numeric,
      payout7 numeric,
      "isInvalid" integer
    )`).then( (): void => {
      knex.schema.table("reports_designated", (table: Knex.AlterTableBuilder): void => {
        table.increments("reportDesignatedID").primary().notNullable();
      });
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("reports_designated");
};
