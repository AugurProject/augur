import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.raw("DROP VIEW IF EXISTS balances_detail").then((): PromiseLike<any> => {
    return knex.raw(`CREATE VIEW balances_detail AS
      SELECT tokens.contractAddress as token, symbol, marketId, outcome, feeWindow, owner, balance, supply FROM balances
      LEFT JOIN tokens ON balances.token = tokens.contractAddress
      LEFT JOIN token_supply ON token_supply.token = tokens.contractAddress`);
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.raw("DROP VIEW balances_detail");
};
