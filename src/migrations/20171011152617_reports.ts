import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("reports").then(() => {
    return knex.schema.raw(`CREATE TABLE reports (
      report_id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
      reporter varchar(66) NOT NULL,
      market_id varchar(66) NOT NULL,
      reporting_token varchar(66) NOT NULL,
      amount_staked numeric,
      payout0 numeric,
      payout1 numeric,
      payout2 numeric,
      payout3 numeric,
      payout4 numeric,
      payout5 numeric,
      payout6 numeric,
      payout7 numeric,
      is_invalid integer
    )`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.schema.dropTableIfExists("reports");
};
