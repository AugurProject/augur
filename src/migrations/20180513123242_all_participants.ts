import * as Knex from "knex";

exports.up = async (knex: Knex): Promise<any> => {
  return knex.raw("DROP VIEW IF EXISTS all_participants").then((): PromiseLike<any> => {
    return knex.raw("CREATE VIEW all_participants AS\n" +
      "SELECT markets.universe, markets.marketId, 'initial_report' as type, initialReporter as participantAddress, initial_reports.reporter as owner, CASE  WHEN redeemed = 0 THEN amountStaked ELSE 0 END as balance, initial_reports.payoutId, 1 as completed, reportingState, markets.forking, disavowed from initial_reports\n" +
      " JOIN markets ON markets.marketId = initial_reports.marketId\n" +
      " JOIN market_state ON markets.marketStateId = market_state.marketStateId\n" +
      "union\n" +
      "SELECT markets.universe, crowdsourcers.marketId, 'crowdsourcer' as type, crowdsourcers.crowdsourcerId as participantAddress , balances.owner, balances.balance, crowdsourcers.payoutId, crowdsourcers.completed, reportingState, markets.forking, crowdsourcers.disavowed from balances\n" +
      "  JOIN crowdsourcers ON crowdsourcers.crowdsourcerId = balances.token\n" +
      "  JOIN markets ON markets.marketId = crowdsourcers.marketId\n" +
      "  JOIN market_state ON markets.marketStateId = market_state.marketStateId");
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  return knex.raw("DROP VIEW all_participants");
};
