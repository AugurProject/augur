import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.raw("DROP VIEW IF EXISTS balances_detail").then((): PromiseLike<any> => {
    return knex.raw(`CREATE VIEW balances_detail AS
      SELECT tokens.${knex.client.config.client === "sqlite3" ? "contractAddress" : "\"contractAddress\""} as token, symbol, ${knex.client.config.client === "sqlite3" ? "marketId" : "\"marketId\""}, outcome, ${knex.client.config.client === "sqlite3" ? "feeWindow" : "\"feeWindow\""}, owner, balance, supply FROM balances
      LEFT JOIN tokens ON balances.token = tokens.${knex.client.config.client === "sqlite3" ? "contractAddress" : "\"contractAddress\""}
      LEFT JOIN token_supply ON token_supply.token = tokens.${knex.client.config.client === "sqlite3" ? "contractAddress" : "\"contractAddress\""}`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.raw("DROP VIEW balances_detail");
};
