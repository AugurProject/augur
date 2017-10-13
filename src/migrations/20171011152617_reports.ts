import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("reports").then( (): void  => {
    knex.schema.raw(`CREATE TABLE reports (
      reporter varchar(66) NOT NULL,
      marketID varchar(66) NOT NULL,
      reportingToken varchar(66) NOT NULL,
      amountStaked numeric,
      payout0 numeric,
      payout1 numeric,
      payout2 numeric,
      payout3 numeric,
      payout4 numeric,
      payout5 numeric,
      payout6 numeric,
      payout7 numeric,
      isInvalid integer
    )`).then( (): void => {
      knex.schema.table("reports", (table: Knex.AlterTableBuilder): void => {
        table.increments("reportID").primary().notNullable();
      });
    });
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("reports");
};
